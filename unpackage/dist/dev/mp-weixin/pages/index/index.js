"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  setup() {
    const x = common_vendor.ref(0);
    const y = common_vendor.ref(0);
    const rho = common_vendor.ref(0);
    const theta = common_vendor.ref(0);
    const dragging = common_vendor.ref(false);
    const audioContext = common_vendor.index.createInnerAudioContext();
    const circleRadii = [50, 100, 150];
    const pointRadius = 5;
    const initCanvas = () => {
      const ctx = common_vendor.index.createCanvasContext("coordinateCanvas");
      drawGrid(ctx);
    };
    const drawGrid = (ctx) => {
      ctx.clearRect(0, 0, 300, 300);
      ctx.setStrokeStyle("#000");
      ctx.setLineWidth(2);
      ctx.moveTo(150, 0);
      ctx.lineTo(150, 300);
      ctx.moveTo(0, 150);
      ctx.lineTo(300, 150);
      ctx.stroke();
      circleRadii.forEach((radius) => {
        ctx.beginPath();
        ctx.arc(150, 150, radius, 0, 2 * Math.PI);
        ctx.setStrokeStyle("#ddd");
        ctx.setLineWidth(1);
        ctx.stroke();
      });
      ctx.draw(true);
    };
    const drawPoint = (ctx, x2, y2) => {
      ctx.beginPath();
      ctx.arc(x2, y2, pointRadius, 0, 2 * Math.PI);
      ctx.setFillStyle("red");
      ctx.fill();
      ctx.draw(true);
    };
    const handleTouchStart = (e) => {
      audioContext.play();
      dragging.value = true;
      updateTouchCoordinates(e);
    };
    const handleTouchMove = (e) => {
      if (dragging.value) {
        updateTouchCoordinates(e);
      }
    };
    const handleTouchEnd = () => {
      audioContext.pause();
      dragging.value = false;
    };
    const updateTouchCoordinates = (e) => {
      const touch = e.touches[0];
      const rect = common_vendor.index.createSelectorQuery().select("#coordinateCanvas").boundingClientRect();
      rect.exec((res) => {
        const newX = Math.max(-150, Math.min(150, touch.x - 150));
        const newY = Math.max(-150, Math.min(150, touch.y - 150));
        if (newX !== x.value || newY !== y.value) {
          const ctx = common_vendor.index.createCanvasContext("coordinateCanvas");
          ctx.clearRect(x.value + 150 - 5, y.value + 150 - 5, 10, 10);
          initCanvas();
          x.value = newX;
          y.value = newY;
          rho.value = Math.sqrt(x.value * x.value + y.value * y.value);
          theta.value = (Math.atan2(-y.value, x.value) * 180 / Math.PI + 360) % 360;
          drawPoint(ctx, x.value + 150, y.value + 150);
        }
      });
    };
    const initAudio = () => {
      audioContext.src = "static/music/music.mp3";
      audioContext.loop = true;
    };
    common_vendor.onMounted(() => {
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
      handleTouchEnd
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $setup.handleTouchStart && $setup.handleTouchStart(...args)),
    b: common_vendor.o((...args) => $setup.handleTouchMove && $setup.handleTouchMove(...args)),
    c: common_vendor.o((...args) => $setup.handleTouchEnd && $setup.handleTouchEnd(...args)),
    d: common_vendor.t($setup.x.toFixed(2)),
    e: common_vendor.t(-$setup.y.toFixed(2)),
    f: common_vendor.t($setup.rho.toFixed(2)),
    g: common_vendor.t($setup.theta.toFixed(2))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "E:/music/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
