<template>
  <div :style="backgroundStyle"></div>
</template>

<script>
export default {
  props: ['image'],
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(https://api.xxtsoft.top/fes/uploads/image/${this.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
      };
    },
  },
};
</script>
