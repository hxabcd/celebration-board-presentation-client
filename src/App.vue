<template>
  <div id="app">
    <FullScreen />
    <BackgroundImage :image="currentImage" />
    <MusicPlayer :audio="currentAudio" :volume="volume" :action="musicAction" />
    <VideoPlayer :video="currentVideo" :action="videoAction" />
  </div>
</template>

<script>
import FullScreen from './components/FullScreen.vue';
import BackgroundImage from './components/BackgroundImage.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import VideoPlayer from './components/VideoPlayer.vue';
import ws from './components/WebSocketService';

export default {
  components: {
    FullScreen,
    BackgroundImage,
    MusicPlayer,
    VideoPlayer,
  },
  data() {
    return {
      connectionStatus: '未连接',
      socket: null,
      currentImage: 'default.png',
      currentAudio: null,
      currentVideo: null,
      musicAction: null,
      videoAction: null,
      volume: 0.5,
    };
  },
  watch: {
    connectionStatus(newStatus) {
      document.title = `晚会看板呈现端 | ${newStatus}`;
    },
  },
  created() {
    document.title = `晚会看板呈现端 | ${this.connectionStatus}`;
    ws.onMessage(this.handleMessage);
    ws.onOpen( () => {
      this.connectionStatus = '已连接';
    });
    ws.onClose( () => {
      this.connectionStatus = '连接断开';
    });
  },
  methods: {
    handleMessage(message) {
      const data = JSON.parse(message);
      if (data.target === 'presentation') {
        switch (data.type) {
          case 'music':
            this.handleMusicAction(data);
            break;
          case 'image':
            this.handleImageAction(data);
            break;
          case 'video':
            this.handleVideoAction(data);
            break;
          default:
            console.error('Unknown message type:', data.type);
        }
      }
    },
    handleMusicAction(data) {
      if (data.action === 'play') {
        if (data.file) {
          this.currentAudio = data.file;
        }
      }
      this.musicAction = data.action;
      if (data.action === 'volume') {
        this.volume = data.value;
      }
    },
    handleImageAction(data) {
      this.currentImage = data.file || 'default.png';
    },
    handleVideoAction(data) {
      if (data.action === 'play') {
        this.currentVideo = data.file;
      }
      this.videoAction = data.action;
    },
  },
  beforeUnmount() {
    ws.offMessage(this.handleMessage);
    ws.offOpen(this.handleOpen);
    ws.offClose(this.handleClose);
  }
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
</style>