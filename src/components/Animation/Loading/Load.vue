<script setup>
import { ref} from 'vue';
const themeAction = ref( JSON.parse(localStorage.getItem('theme')));
</script>
<template>
  <div class="position-fixed" :class="themeAction ? 'fixed-black':'fixed-white'">
    <div class="jelly-triangle">
      <div class="jelly-triangle__dot"></div>
      <div class="jelly-triangle__traveler"></div>
    </div>
    <svg width="0" height="0" class="jelly-maker">
      <defs>
        <filter id="uib-jelly-triangle-ooze">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7.3" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="ooze"
          />
          <feBlend in="SourceGraphic" in2="ooze" />
        </filter>
      </defs>
    </svg>
  </div>
</template>
<style scoped>
.position-fixed {
  position: absolute;
  width:100%;
  height: 100%;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 1000;
}
.fixed-black{
  background: #000;
}
.fixed-black .jelly-triangle{
  --uib-color: #63e2b7;
}
.fixed-white{
  background-color:#fff;
}

.jelly-triangle {
  --uib-size: 60px;
  --uib-speed: 1s;
  --uib-color: #18a058;

  position: relative;
  height: var(--uib-size);
  width: var(--uib-size);
  filter: url('#uib-jelly-triangle-ooze');
}

.jelly-triangle__dot,
.jelly-triangle::before,
.jelly-triangle::after{
  content: '';
  position: absolute;
  width: 33%;
  height: 33%;
  background: var(--uib-color);
  border-radius: 100%;
}

.jelly-triangle__dot {
  top: 6%;
  left: 30%;
  animation: grow var(--uib-speed) ease infinite;
}

.jelly-triangle::before {
  bottom: 6%;
  right: 0;
  animation: grow var(--uib-speed) ease calc(var(--uib-speed) * -0.666)
    infinite;
}

.jelly-triangle::after {
  bottom: 6%;
  left: 0;
  animation: grow var(--uib-speed) ease calc(var(--uib-speed) * -0.333)
    infinite;
}

.jelly-triangle__traveler {
  position: absolute;
  top: 6%;
  left: 30%;
  width: 33%;
  height: 33%;
  background: var(--uib-color);
  border-radius: 100%;
  animation: triangulate var(--uib-speed) ease infinite;
}

.jelly-maker {
  width: 0;
  height: 0;
  position: absolute;
}

@keyframes triangulate {
  0%,
  100% {
    transform: none;
  }
  33.333% {
    transform: translate(120%, 175%);
  }
  66.666% {
    transform: translate(-95%, 175%);
  }
}

@keyframes grow {
  0%,
  100% {
    transform: scale(1.5);
  }
  20%,
  70% {
    transform: none;
  }
}
</style>
