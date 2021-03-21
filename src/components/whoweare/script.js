import $ from "jquery";
import "./style.scss";

export const whoWeAre = {
  $introduceContainer: $("#whoweare .introduce-container"),
  // 點擊 .introduce-container 時, 切換 .mask 的樣式, 切換 .title 與 .text 的顯示
  introduceContainerClickHandler: function () {
    this.classList.toggle("selected");
    return false;
  },
  introduceContainerMouseleaveHandler: function () {
    this.classList.remove("selected");
    return false;
  },
  /**
   * video 在某些時候似乎會壞掉變成綠色, 所以在這裡不使用 .stop 方法, 而改用 .load
   * 方法, 已確保每次播放前都不會壞掉
   */
  play: function () {},
  stop: function () {},
  init: function () {
    this.$introduceContainer.each((index, item) => {
      item.index = index;
    });
    this.$introduceContainer.on("click", this.introduceContainerClickHandler);
    this.$introduceContainer.on(
      "mouseleave",
      this.introduceContainerMouseleaveHandler
    );
  },
};
