<template>
  <!-- chat thinking -->
  <div class="chat-thinking">
    <div class="thinking-item"></div>
    <div class="thinking-item"></div>
    <div class="thinking-item"></div>
    <div class="thinking-item"></div>
    <div class="thinking-item"></div>
    <div class="thinking-item"></div>
    <div class="thinking-item"></div>
    <div class="thinking-item"></div>
    <div class="thinking-item"></div>
  </div>
</template>

<style lang="less" scoped>
.chat-thinking {
  width: 17px;
  height: 17px;
  display: block;
  font-size: 0;
  color: #000;
  position: relative;
  box-sizing: border-box;

  .thinking-item {
    width: 3px;
    height: 3px;
    margin: 1px;
    border-radius: 50%;
    background-color: currentColor;
    display: inline-block;
    animation: ball-grid-beat infinite;
    position: relative;
    box-sizing: border-box;
  }

  each(range(1, 9), {
    .thinking-item:nth-child(@{value}) {
      animation-duration: (0.6s + @value * 0.1);
      animation-delay: (-0.8s + @value * 0.1);
    }
  });
}

@keyframes ball-grid-beat {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
</style>

