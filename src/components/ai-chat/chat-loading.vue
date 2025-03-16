<template>
  <div class="chat-loading">
    <div class="loading-item"></div>
    <div class="loading-item"></div>
    <div class="loading-item"></div>
    <div class="loading-item"></div>
    <div class="loading-item"></div>
    <div class="loading-item"></div>
    <div class="loading-item"></div>
    <div class="loading-item"></div>
    <div class="loading-item"></div>
  </div>
</template>

<style lang="less" scoped>
.chat-loading {
  width: 17px;
  height: 17px;
}
.chat-loading,
.chat-loading > .loading-item {
  position: relative;
  box-sizing: border-box;
}

.chat-loading {
  display: block;
  font-size: 0;
  color: #000;
}
.chat-loading > .loading-item {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}



.chat-loading > .loading-item {
  width: 3px;
  height: 3px;
  margin: 1px;
  border-radius: 100%;
  animation-name: ball-grid-beat;
  animation-iteration-count: infinite;
}

.chat-loading > .loading-item:nth-child(1) {
  animation-duration: 0.65s;
  animation-delay: 0.03s;
}

.chat-loading > .loading-item:nth-child(2) {
  animation-duration: 1.02s;
  animation-delay: 0.09s;
}

.chat-loading > .loading-item:nth-child(3) {
  animation-duration: 1.06s;
  animation-delay: -0.69s;
}

.chat-loading > .loading-item:nth-child(4) {
  animation-duration: 1.5s;
  animation-delay: -0.41s;
}

.chat-loading > .loading-item:nth-child(5) {
  animation-duration: 1.6s;
  animation-delay: 0.04s;
}

.chat-loading > .loading-item:nth-child(6) {
  animation-duration: 0.84s;
  animation-delay: 0.07s;
}

.chat-loading > .loading-item:nth-child(7) {
  animation-duration: 0.68s;
  animation-delay: -0.66s;
}

.chat-loading > .loading-item:nth-child(8) {
  animation-duration: 0.93s;
  animation-delay: -0.76s;
}

.chat-loading > .loading-item:nth-child(9) {
  animation-duration: 1.24s;
  animation-delay: -0.76s;
}

@keyframes ball-grid-beat {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.35;
  }

  100% {
    opacity: 1;
  }
}
</style>
