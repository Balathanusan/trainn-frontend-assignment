<template>
  <div>
    {{ msg }}
  </div>
</template>

<script>
export default {
  name: "Toast",
  props: {
    msg: String,
  },
};
</script>

<style scoped lang="scss">
</style>
