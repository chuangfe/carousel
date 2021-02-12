import $ from "jquery";
import "./style.scss";

export const twist = {
  $mask: $("#twist .mask"),
  $circleContainer: $("#twist .circle-container"),
  circleContainerClickHandler: function () {
    twist.$mask.removeClass("show");
  },
  play: function () {},
  stop: function () {
    this.$mask.addClass("show");
  },
  init: function () {
    this.$circleContainer.on("click", this.circleContainerClickHandler);
  },
};
