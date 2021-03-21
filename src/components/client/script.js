import $ from "jquery";
import { utils } from "../../assets/script/utils";
import "./style.scss";

export const client = {
  $client: $("#client"),
  $contentContainer: $("#client .content-container"),
  $launchContainer: $("#client .launch-container"),
  $rhombusContainer: $("#client .rhombus-container"),
  $col4: $("#client .col-4"),
  wheelRange: 0,
  wheelRangeTop: -126,
  wheelRangeBottom: 0,
  rhombusSetDelay: function () {
    let rhombus = this.$rhombusContainer.get();
    rhombus.sort(function (a, b) {
      return Math.random() > 0.5 ? 1 : -1;
    });
    // 所有動畫在 2s 內完成, 最少需要 delay 0.4s, 動畫時間 0.1s
    rhombus.forEach(function (div, index, array) {
      // 2 - 0.4 - 0.1 = 1.5
      // Number.prototype.toFixed(x); 數字保留 x 位小數後轉為字串返回
      let ms = ((1.5 / array.length) * index + 0.4).toFixed(2);
      div.style.transition = "opacity .1s ease-out " + ms + "s";
    });
  },
  clientWheelHandler: function (e) {
    // 滾輪往下, e.originalEvent.deltaY < 0, 頁面往上, top --
    // 滾輪往上, e.originalEvent.deltaY > 0, 頁面往下, top ++
    // e.originalEvent.deltaY 給的值與正常使用相反, 故需要調整
    let deltaY = e.originalEvent.deltaY > 0 ? -100 : 100;
    let BoundY = client.$contentContainer.get(0).offsetTop;
    let scrollTop = deltaY + BoundY;
    if (scrollTop > client.wheelRangeTop) scrollTop = -126;
    if (scrollTop < client.wheelRange * -1) scrollTop = client.wheelRange * -1;
    client.$contentContainer.css({
      top: scrollTop + "px",
    });
    return false;
  },
  launchContainerClickHandler: function () {
    client.$contentContainer.toggleClass("show");
    return false;
  },
  windowResizeHandler: function () {
    // 28 為 nav 高度
    // 126 為布局需要的高度
    client.wheelRange =
      28 + 126 + client.$col4.get(0).offsetHeight - window.innerHeight;
    if (client.wheelRange > 0) {
      client.$client
        .off("wheel", client.clientWheelHandler)
        .on("wheel", client.clientWheelHandler);
      client.wheelRangeBottom = client.$col4.get(0).offsetHeight;
    } else {
      // 不需要滾輪事件時
      client.$client.off("wheel");
      client.$contentContainer.css({ top: client.wheelRangeTop * -1 + "px" });
    }
    return false;
  },
  play: function () {},
  stop: function () {
    this.$contentContainer.removeClass("show").css({ top: "-255px" });
  },
  init: function () {
    this.rhombusSetDelay();
    this.$launchContainer.on("click", this.launchContainerClickHandler);
    this.windowResizeHandler();
    $(window).on("resize", utils.debounce(this.windowResizeHandler, {}));
  },
};
