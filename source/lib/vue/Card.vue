<template>
  <canvas
    v-created="this"
    :style="{ transform: 'rotateX(' + x + 'deg) rotateY(' + y + 'deg)' }"
  ></canvas>
</template>

<script>
import { Card } from "ygo-card";

let cardIns;

export default {
  name: "Card",
  props: ["rotate", "data"],
  data() {
    return {
      x: 0,
      y: 0,
    };
  },
  watch: {
    data: {
      handler() {
        cardIns.feedData(this.data);
      },
      deep: true,
    },
  },
  directives: {
    created: {
      inserted(el, binding) {
        const that = binding.value;

        const FLASH_URL = "https://ymssx.gitee.io/ygo/static/flash.jpg";

        cardIns = new Card({
          canvas: el,
          data: that.data,
          moldPath: "/ygo/static/mold",
          getPic: (id) => `https://ymssx.gitee.io/pics/500/${id}.jpg`,
          size: [813, 1185],
          passwordSwitch: true,
          fontsLoaded: () => {
            that.$emit("loaded", cardIns);
          },
          picLoaded: () => {
            let img = new Image();
            img.src = FLASH_URL;
            img.onload = () => {
              if (that.rotate) {
                cardIns.feedFlash(img);
              }
            };
          },
        });

        cardIns.render();

        if (that.rotate) {
          var clear;
          var clear2;
          var x_s, y_s;

          //预加载
          let img = new Image();
          img.src = FLASH_URL;

          el.addEventListener("mousemove", function (e) {
            e = e || window.event;
            var y_ = e.offsetX;
            var x_ = e.offsetY;
            y_ = (-1 * (y_ - this.offsetWidth / 2)) / 14;
            x_ = (x_ - this.offsetHeight / 2) / 14;

            var x = 0;
            var y = 0;

            if (Math.abs(x_) < 5) {
              x_s = true;
            }
            if (Math.abs(y_) < 5) {
              y_s = true;
            }

            if (x_s) {
              x = x_;
              that.x = x;
            }
            if (y_s) {
              y = y_;
              that.y = y;
            }

            if (x_s || y_s) {
              cardIns.data.flash = Math.max(
                Math.abs(x) / 18,
                Math.abs(y) / 18
              );
            }

            if (clear || clear2) {
              clearInterval(clear);
              clearTimeout(clear2);
            }
          });

          el.addEventListener("mouseout", function (e) {
            x_s = false;
            y_s = false;

            let part_x = that.x / 100;
            let part_y = that.y / 100;
            let part_f = cardIns.data.flash / 100;

            clear = setInterval(() => {
              if (that.x * part_x >= 0 || that.y * part_y >= 0) {
                that.x -= part_x;
                that.y -= part_y;
                cardIns.data.flash -= part_f;
                clear2 = setTimeout(() => {
                  that.x = 0;
                  that.y = 0;
                  cardIns.data.flash = 0;

                  clearInterval(clear);
                }, 500);
              } else {
                that.x = 0;
                that.y = 0;
                cardIns.data.flash = 0;

                clearInterval(clear);
              }
            }, 5);
          });
        }
      },
    },
  },
};
</script>
