import $ from "jquery";
import "./style.scss";

export const ralphLauren = {
  $ralphlauren: $("#ralphlauren"),
  $ralphlaurenContainer: $("#ralphlauren .ralphlauren-container"),
  $videoContainer: $("#ralphlauren .video-container"),
  $texBackground: $("#ralphlauren .text-background"),
  // 判斷該畫面有沒有 selected class, 來決定是否有動畫
  play: function () {
    this.$ralphlauren.addClass("selected");
  },
  stop: function () {
    this.$ralphlauren.removeClass("selected");
  },
  init: function () {},
};
