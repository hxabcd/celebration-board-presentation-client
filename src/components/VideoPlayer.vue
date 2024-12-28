<template>
  <div v-if="isPlaying" class="video-container">
    <video ref="video" :src="videoUrl" @ended="stopVideo" controls></video>
  </div>
</template>

<script>
export default {
  props: ['video', 'action'],
  data() {
    return {
      isPlaying: false,
    };
  },
  watch: {
    action(newAction) {
      const videoElement = this.$refs.video;
      if (newAction === 'play') {
        this.isPlaying = true;
        videoElement.play();
      } else if (newAction === 'stop') {
        this.isPlaying = false;
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    },
  },
  computed: {
    videoUrl() {
      return this.video ? `http://localhost:3000/uploads/video/${this.video}` : '';
    },
  },
  methods: {
    stopVideo() {
      this.isPlaying = false;
      this.$emit('update:action', 'stop');
    },
  },
};
</script>

<style>
.video-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
