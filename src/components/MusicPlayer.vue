<script>
import ws from "./WebSocketService";

export default {
  props: ['audio', 'volume', 'action'],
  data() {
    return {
      audioElement: null,
      paused: true,
    };
  },
  watch: {
    action(newAction) {
      switch (newAction) {
        case 'play':
          this.playAudio();
          break;
        case 'pause':
          this.pauseAudio();
          break;
        case 'stop':
          this.stopAudio();
          break;
      }
      this.paused = this.audioElement ? this.audioElement.paused : true;
    },
    volume(newVolume) {
      if (this.audioElement) {
        this.audioElement.volume = newVolume;
      }
    },
    audio(newAudio) {
      this.resetAudio();
      ws.send(JSON.stringify(
        { target: 'control', key: 'nowPaying', value: newAudio }
      ));
    },
    paused(status) {
      ws.send(JSON.stringify(
        { target: 'control', key: 'paused', value: status }
      ));
    }
  },
  computed: {
    audioUrl() {
      return this.audio ? `https://api.xxtsoft.top/fes/uploads/music/${this.audio}` : '';
    },
  },
  mounted() {
    this.initializeAudio();
  },
  methods: {
    initializeAudio() {
      if (this.audioUrl) {
        this.audioElement = new Audio(this.audioUrl);
        this.audioElement.volume = this.volume;
        this.audioElement.addEventListener('ended', this.handleAudioEnded);
      }
    },
    resetAudio() {
      if (this.audioElement) {
        this.stopAudio();
        this.audioElement.src = this.audioUrl;
        this.audioElement.load(); // Ensures the new audio is loaded
      } else {
        this.initializeAudio();
      }
    },
    playAudio() {
      if (this.audioElement) {
        console.log(`Audio URL: ${this.audioUrl}`);
        this.audioElement.play();
      }
    },
    pauseAudio() {
      if (this.audioElement) {
        this.audioElement.pause();
      }
    },
    stopAudio() {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      }
    },
    handleAudioEnded() {
      this.$emit('update:action', 'stop');
    },
  },
  beforeUnmount() {
    if (this.audioElement) {
      this.audioElement.removeEventListener('ended', this.handleAudioEnded);
      this.audioElement = null;
    }
  },
};
</script>