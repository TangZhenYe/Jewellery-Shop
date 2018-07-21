<template>
  <div v-show="visible">
    <div class="dialog-tips dialog-center">
      <div>{{ message }}</div>
    </div>
  </div>


</template>
<script>
export default {
  data () {
    return {
      visible: false,
      message: "",
    }
  }
}
</script>
<style>
.dialog-tips{
  position: fixed;
  z-index: 1000;
  min-width: 220px;
  padding: 20px 0px;
  white-space: nowrap;
  background-color: rgba(0,0,0,.5);
  color: #fff;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
}
.dialog-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>