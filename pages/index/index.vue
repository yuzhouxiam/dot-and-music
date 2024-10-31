<template>
  <view class="container">
    <canvas 
      canvas-id="coordinateCanvas" 
      class="canvas" 
      @touchstart="handleTouchStart" 
      @touchmove="handleTouchMove" 
      @touchend="handleTouchEnd"
    ></canvas>
    <view class="info">
      <view><text>X: {{ x.toFixed(2) }} Y: {{ -y.toFixed(2) }}</text></view>
      <view><text>ρ: {{ rho.toFixed(2) }} θ: {{ theta.toFixed(2) }}°</text></view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const x = ref(0);
    const y = ref(0);
    const rho = ref(0);
    const theta = ref(0);
    const dragging = ref(false);
    const audioContext = uni.createInnerAudioContext();
    const circleRadii = [50, 100, 150];
    const pointRadius = 5; // 点的半径

    const initCanvas = () => {
      const ctx = uni.createCanvasContext('coordinateCanvas');
      drawGrid(ctx); 
    };
// 画坐标系和圆
    const drawGrid = (ctx) => {
      ctx.clearRect(0, 0, 300, 300); // 清除整个画布
//画坐标系	  
      ctx.setStrokeStyle('#000');
      ctx.setLineWidth(2);
      ctx.moveTo(150, 0);
      ctx.lineTo(150, 300);
      ctx.moveTo(0, 150);
      ctx.lineTo(300, 150);
      ctx.stroke();
//画圆
      circleRadii.forEach(radius => {
        ctx.beginPath();
        ctx.arc(150, 150, radius, 0, 2 * Math.PI);
        ctx.setStrokeStyle('#ddd');
        ctx.setLineWidth(1);
        ctx.stroke();
      });

      ctx.draw(true);
    };
//画点
    const drawPoint = (ctx, x, y) => {
      ctx.beginPath();
      ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
      ctx.setFillStyle('red');
      ctx.fill();
      ctx.draw(true); // 局部刷新，
    };
//点击
    const handleTouchStart = (e) => {
      audioContext.play(); // 播放音乐
	  dragging.value = true;
      updateTouchCoordinates(e);
    };
//拖动
    const handleTouchMove = (e) => {
      if (dragging.value) {
        updateTouchCoordinates(e);
      }
    };
//停止点击
    const handleTouchEnd = () => {
      //audioContext.stop(); // 停止播放音乐
	  audioContext.pause();//暂停播放音乐
	  dragging.value = false;
    };
//更新状态
    const updateTouchCoordinates = (e) => {
      const touch = e.touches[0];
      const rect = uni.createSelectorQuery().select('#coordinateCanvas').boundingClientRect();
      rect.exec((res) => {
        const newX = Math.max(-150, Math.min(150,touch.x-150)); // 计算新坐标
		const newY = Math.max(-150, Math.min(150,touch.y-150));
		//const newX = touch.x - 150;
        //const newY = touch.y - 150;

        if (newX !== x.value || newY !== y.value) { // 仅在坐标变化时绘制
          const ctx = uni.createCanvasContext('coordinateCanvas');
          // 清除旧点
          ctx.clearRect(x.value + 150-5, y.value + 150-5, 10,10);
          initCanvas();
          x.value = newX;
          y.value = newY;
		  rho.value = Math.sqrt(x.value *x.value + y.value * y.value);
		  theta.value = (Math.atan2(-y.value, x.value) * 180 / Math.PI + 360) % 360;
		  //console.log('rho'+rho);
          drawPoint(ctx, x.value + 150, y.value + 150); // 绘制新点
        }
      });
    };
//初始化音频
    const initAudio = () => {
      audioContext.src = 'static/music/music.mp3'; 
	  audioContext.loop=true;//循环播放
    };

    onMounted(() => {
      initCanvas();
      initAudio();
    });

    return {
      x,
      y,
      rho,
      theta,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    };
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.canvas {
  width: 300px;
  height: 300px;
  border: 1px solid #000;
}
.info {
  margin-top: 20px;
}
</style>
