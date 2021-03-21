import $ from "jquery";
import "./style.scss";

export const kindy = {
  $backgrounds: $("#kindy .background"),
  $mask: $("#kindy .mask"),
  $maskCircle: $("#kindy .mask-circle"),
  $lis: $("#kindy .list li"),
  $launch: $("#kindy .launch"),
  newIndex: 0,
  oldIndex: 0,
  onOff: true,
  backgroundsToggleClass: function () {
    kindy.$backgrounds.eq(kindy.oldIndex).removeClass("show");
    kindy.$backgrounds.eq(kindy.newIndex).addClass("show");
  },
  lisToggleClass: function () {
    kindy.$lis.eq(kindy.oldIndex).removeClass("selected");
    kindy.$lis.eq(kindy.newIndex).addClass("selected");
  },
  launchAnimationendHandler: function (e) {
    if (e.target !== this) return false;
    this.classList.remove("moving");
    return false;
  },
  /**
   * $mask transition 時間最長, 當觸發 end 事件後, 更新 kindy.oldIndex, 才可以繼續
   * 點擊 $lis, 並且讓 $mask $maskCircle 刪除 show class 恢復到最初的樣式, 補充
   * $mask $maskCircle 兩張圖的第一格是透明的, 所以恢復後看起來像消失了
   */
  maskTransitionendHandler: function (e) {
    if (e.target !== this) return false;
    kindy.oldIndex = kindy.newIndex;
    kindy.onOff = true;
    kindy.$mask.removeClass("show");
    kindy.$maskCircle.removeClass("show");
    return false;
  },
  // $maskCircle 動畫的最後一格, 圖片最大, 這時候替換 $backgrounds 的圖片
  maskCircleTransitionendHandler: function (e) {
    if (e.target !== this) return false;
    kindy.backgroundsToggleClass();
    return false;
  },
  lisClickHandler: function (e) {
    // 避免誤觸發, 雖然不知道會有誰能觸發?
    if (e.target !== this) return false;
    // $backgrounds 的圖片替換中, 不可以點擊
    if (!kindy.onOff) return false;
    // 如果你點擊當前顯示的索引就阻擋
    if (kindy.newIndex === this.index) return false;
    // 紀錄 index, 讓 $backgrounds 使用
    kindy.newIndex = this.index;
    // 你點擊了, 在動畫結束前不可以再次點擊
    kindy.onOff = false;
    // $mask 開始跑動畫
    kindy.$mask.addClass("show");
    // $maskCircle 開始跑動畫
    kindy.$maskCircle.addClass("show");
    // $lis 切換 selected class
    kindy.lisToggleClass();
    return false;
  },
  launchClickHandler: function () {
    if (this.classList.contains("moving")) return false;
    this.classList.add("moving");
    return false;
  },
  play: function () {},
  stop: function () {
    this.newIndex = 0;
    this.backgroundsToggleClass();
    this.lisToggleClass();
    this.oldIndex = this.newIndex;
  },
  init: function () {
    this.$lis
      .each((index, li) => {
        li.index = index;
      })
      .on("click", this.lisClickHandler);
    this.$mask.on("transitionend", this.maskTransitionendHandler);
    this.$maskCircle.on("transitionend", this.maskCircleTransitionendHandler);
    this.$launch.on("animationend", this.launchAnimationendHandler);
    this.$launch.on("click", this.launchClickHandler);
  },
};
