if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$1 = {
    data() {
      return {
        x: 0,
        y: 0,
        rho: 0,
        theta: 0,
        dragging: false,
        lastX: 0,
        lastY: 0,
        audioContext: null,
        circleRadii: [50, 100, 150]
        // 圆圈半径数组  
      };
    },
    onLoad() {
      this.initCanvas();
      this.initAudio();
    },
    methods: {
      initCanvas() {
        const ctx = uni.createCanvasContext("coordinateCanvas");
        ctx.setStrokeStyle("#000");
        ctx.setLineWidth(2);
        ctx.moveTo(150, 0);
        ctx.lineTo(150, 300);
        ctx.moveTo(0, 150);
        ctx.lineTo(300, 150);
        ctx.stroke();
        this.circleRadii.forEach((radius) => {
          ctx.beginPath();
          ctx.arc(150, 150, radius, 0, 2 * Math.PI);
          ctx.setStrokeStyle("#ddd");
          ctx.setLineWidth(1);
          ctx.stroke();
        });
        ctx.beginPath();
        ctx.arc(150, 150, 5, 0, 2 * Math.PI);
        ctx.setFillStyle("red");
        ctx.fill();
        ctx.draw();
        uni.$on("canvasTouchMove", this.handleCanvasTouchMove);
        uni.$on("canvasTouchStart", this.handleCanvasTouchStart);
        uni.$on("canvasTouchEnd", this.handleCanvasTouchEnd);
      },
      handleCanvasTouchMove(e) {
        if (this.dragging) {
          const touch = e.touches[0];
          const rect = uni.createSelectorQuery().select("#coordinateCanvas").boundingClientRect();
          rect.exec((res) => {
            this.x = touch.x - res.left - 150 + this.lastX;
            this.y = touch.y - res.top - 150 + this.lastY;
            this.updatePolarCoordinates();
            this.drawPoint();
          });
        }
      },
      handleCanvasTouchStart(e) {
        this.dragging = true;
        this.audioContext.play();
        const touch = e.touches[0];
        const rect = uni.createSelectorQuery().select("#coordinateCanvas").boundingClientRect();
        rect.exec((res) => {
          this.lastX = touch.x - res.left - 150;
          this.lastY = touch.y - res.top - 150;
          this.x = this.lastX;
          this.y = this.lastY;
          this.updatePolarCoordinates();
        });
      },
      handleCanvasTouchEnd() {
        this.dragging = false;
        this.audioContext.stop();
      },
      drawPoint() {
        const ctx = uni.createCanvasContext("coordinateCanvas");
        ctx.clearRect(0, 0, 300, 300);
        ctx.setStrokeStyle("#000");
        ctx.setLineWidth(2);
        ctx.moveTo(150, 0);
        ctx.lineTo(150, 300);
        ctx.moveTo(0, 150);
        ctx.lineTo(300, 150);
        ctx.stroke();
        this.circleRadii.forEach((radius) => {
          ctx.beginPath();
          ctx.arc(150, 150, radius, 0, 2 * Math.PI);
          ctx.setStrokeStyle("#ddd");
          ctx.setLineWidth(1);
          ctx.stroke();
        });
        ctx.beginPath();
        ctx.arc(this.x + 150, this.y + 150, 5, 0, 2 * Math.PI);
        ctx.setFillStyle("red");
        ctx.fill();
        ctx.draw();
      },
      updatePolarCoordinates() {
        this.rho = Math.sqrt(this.x * this.x + this.y * this.y);
        this.theta = (Math.atan2(this.y, this.x) * 180 / Math.PI + 360) % 360;
      },
      initAudio() {
        this.audioContext = uni.createInnerAudioContext();
        this.audioContext.src = "static/music/mymusic.mp3";
        this.audioContext.autoplay = false;
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("canvas", {
        "canvas-id": "coordinateCanvas",
        class: "canvas"
      }),
      vue.createElementVNode("view", { class: "info" }, [
        vue.createElementVNode(
          "text",
          null,
          "X: " + vue.toDisplayString($data.x.toFixed(2)) + " Y: " + vue.toDisplayString($data.y.toFixed(2)),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "text",
          null,
          "ρ: " + vue.toDisplayString($data.rho.toFixed(2)) + " θ: " + vue.toDisplayString($data.theta.toFixed(2)) + "°",
          1
          /* TEXT */
        )
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "E:/music/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/music/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
