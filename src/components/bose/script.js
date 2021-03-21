import $ from "jquery";
import "./style.scss";

export const bose = {
  $bose: $("#bose"),
  // 該頁面有 selected class 後, 會播放延遲的動畫
  play: function () {
    this.$bose.addClass("selected");
  },
  // 刪除 selected class 後, 有執行動畫的 dom 恢復原本的樣式
  stop: function () {
    this.$bose.removeClass("selected");
  },
  init: function () {},
};
