import $ from "jquery";
import "./style.scss";

// $adisseoBackground $adisseoContainer 通過 selected
export const adisseo = {
  $adisseo: $("#adisseo"),
  $adisseoBackground: $("#adisseo .adisseo-background"),
  $adisseoContainer: $("#adisseo .adisseo-container"),
  $launch: $("#adisseo .launch"),
  $spriteContainer: $("#adisseo .sprite-container"),
  launchClickHandler: function () {
    adisseo.$adisseoBackground.removeClass("selected");
    adisseo.$adisseoContainer.removeClass("selected");
  },
  spriteContainerClickHandler: function () {
    adisseo.$adisseoBackground.addClass("selected");
    adisseo.$adisseoContainer.addClass("selected");
  },
  play: function () {
    this.$adisseo.addClass("selected");
  },
  stop: function () {
    this.$adisseo.removeClass("selected");
    this.$adisseoBackground.removeClass("selected");
    this.$adisseoContainer.removeClass("selected");
  },
  init: function () {
    this.$launch.on("click", this.launchClickHandler);
    this.$spriteContainer.on("click", this.spriteContainerClickHandler);
  },
};
