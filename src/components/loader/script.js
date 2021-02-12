import $ from "jquery";
import { utils } from "../../assets/script/utils";
import "./style.scss";

export const loader = {
  // .title 的白色背景
  $mask: $("#loader .title .mask"),
  // 拖拽的 gif 圖片
  $tutorial: $("#loader .tutorial"),
  // 最下方的文字說明圖片
  $txtDragProjects: $("#loader .txt-drag-projects"),
  // lazyLoad 最後一個完成後會執行
  play: function () {
    this.$tutorial.css({ transition: "opacity 0.4s ease-out", opacity: 1 });
    this.$txtDragProjects.css({
      transition: "opacity 0.4s ease-out",
      opacity: 1,
    });
  },
  /**
   * carousel modulesContainerTransitionendHandler 事件後會執行
   * carousel.modulesPlay, 就是離開 loader 畫面, 前往 whoweare 畫面時
   */
  stop: function () {
    this.$tutorial.css({ display: "none" });
    this.$txtDragProjects.css({ display: "none" });
  },
  init: function () {
    utils.lazyLoad({
      elements: Array.from(document.querySelectorAll("img")),
      callBack: function (percentage) {
        loader.$mask.css({
          transform: " translateX(" + 100 * percentage + "%)",
        });
        if (percentage === 1) loader.play();
      },
      allLoadRunCallBack: true,
    });
  },
};
