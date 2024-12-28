<template>
  <div v-if="isVisible" class="fullscreen-button-container">
    <button @click="goFullscreen">全屏显示</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: true
    };
  },
  methods: {
    goFullscreen() {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
      }

      // 隐藏组件
      this.isVisible = false;
    }
  }
};
</script>

<style scoped>
.fullscreen-button-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  padding: 10px 0;
  z-index: 1000; /* 确保按钮在最上层 */
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}
</style>
