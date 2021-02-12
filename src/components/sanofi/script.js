import $ from "jquery";
import { utils } from "../../assets/script/utils";
import "./style.scss";

export const sanofi = {
  $sanofi: $("#sanofi"),
  $jsMoveBlock: $("#sanofi .js-move-block"),
  $jsOpacityBlock: $("#sanofi .js-opacity-block"),
  center: { x: 0, y: 0 },
  sanofiMousemoveHandler: function (e) {
    sanofi.$jsMoveBlock.each(function (index, Element) {
      /**
       * 獲取 dom 的 data 屬性 left top range, 依照 left top 為移動前的中心點,
       * range 是可移動的範圍, e.clientX 是滑鼠的座標, sanofi.center.x 可視區
       * 的中心點, 滑鼠越接近中心點, dom 就不會移動
       */
      let left =
        Number(Element.dataset.left) +
        Number(Element.dataset.range) * (e.clientX - sanofi.center.x);
      let top =
        Number(Element.dataset.top) +
        Number(Element.dataset.range) * (e.clientY - sanofi.center.y);

      Element.style.left = left + "px";
      Element.style.top = top + "px";
    });
    // 滑鼠越離開中心點, dom 越透明
    sanofi.$jsOpacityBlock.css({
      opacity: 1 - Math.abs(e.clientX - sanofi.center.x) / sanofi.center.x,
    });
  },
  play: function () {},
  stop: function () {},
  init: function () {
    this.$jsMoveBlock.each(function (index, Element) {
      /**
       * 經過 google search getBoundingClientRect() 多次觸發會有延伸的問題, 例如
       * 畫面重繪, 故改為使用 offsetLeft, 並且 css 刪除 transform 樣式, 使用 margin
       * 置中, 因為 offsetLeft 無法獲取 transform
       */
      let bound = {
        left: Element.offsetLeft,
        top: Element.offsetTop,
      };
      // 保存初始位置
      Element.dataset.left = bound.left;
      Element.dataset.top = bound.top;
      // 使用 offsetLeft 行內樣式, 取代 css 樣式
      Element.style.left = bound.left + "px";
      Element.style.top = bound.top + "px";
      Element.style.margin = 0 + "px";
      Element.style.transform = "none";
    });
    this.center.x = Math.round(window.innerWidth / 2);
    this.center.y = Math.round(window.innerHeight / 2);
    this.$sanofi.on("mousemove", this.sanofiMousemoveHandler);
  },
};
