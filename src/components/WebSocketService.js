import { reactive } from 'vue';

class WebSocketService {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.messageCallbacks = new Map();
        this.openCallbacks = new Map();
        this.closeCallbacks = new Map();
        this.errorCallbacks = new Map();
        this.state = reactive({
            connected: false,
            error: null,
        });
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            this.state.connected = true;
            this.state.error = null;
            console.log('WebSocket connected');
            this.openCallbacks.forEach(callback => callback());
        };

        this.socket.onclose = () => {
            this.state.connected = false;
            console.log('WebSocket disconnected');
            this.closeCallbacks.forEach(callback => callback());
        };

        this.socket.onerror = (error) => {
            this.state.connected = false;
            this.state.error = error;
            console.error('WebSocket error:', error);
            this.errorCallbacks.forEach(callback => callback(error));
        };

        this.socket.onmessage = (event) => {
            this.messageCallbacks.forEach(callback => callback(event.data));
        };
    }

    onMessage(callback) {
        if (typeof callback === 'function') {
            this.messageCallbacks.set(callback, callback);
        } else {
            console.error('Callback must be a function');
        }
    }

    offMessage(callback) {
        if (this.messageCallbacks.has(callback)) {
            this.messageCallbacks.delete(callback);
        } else {
            console.error('Callback not found');
        }
    }

    onOpen(callback) {
        if (typeof callback === 'function') {
            this.openCallbacks.set(callback, callback);
        } else {
            console.error('Callback must be a function');
        }
    }

    offOpen(callback) {
        if (this.openCallbacks.has(callback)) {
            this.openCallbacks.delete(callback);
        } else {
            console.error('Callback not found');
        }
    }

    onClose(callback) {
        if (typeof callback === 'function') {
            this.closeCallbacks.set(callback, callback);
        } else {
            console.error('Callback must be a function');
        }
    }

    offClose(callback) {
        if (this.closeCallbacks.has(callback)) {
            this.closeCallbacks.delete(callback);
        } else {
            console.error('Callback not found');
        }
    }

    onError(callback) {
        if (typeof callback === 'function') {
            this.errorCallbacks.set(callback, callback);
        } else {
            console.error('Callback must be a function');
        }
    }

    offError(callback) {
        if (this.errorCallbacks.has(callback)) {
            this.errorCallbacks.delete(callback);
        } else {
            console.error('Callback not found');
        }
    }

    send(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error('WebSocket is not open. Ready state: ' + (this.socket ? this.socket.readyState : 'No Socket'));
            this.state.error = 'Cannot send message, WebSocket is not open.';
        }
    }

    getReadyState() {
        return this.socket ? this.socket.readyState : null;
    }
}

const websocketService = new WebSocketService('ws://localhost:3000');
websocketService.connect();

export default websocketService;
