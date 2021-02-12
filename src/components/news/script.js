import $ from "jquery";
import { utils } from "../../assets/script/utils";
import "./style.scss";

export const news = {
  $news: $("#news"),
  $lineItalic: $("#news .line-italic"),
  $contentContainer: $("#news .content-container"),
  $imgContainer: $("#news .img-container"),
  $scrollContainer: $("#news .scroll-container"),
  $scroll: $("#news .scroll"),
  /**
   * contentContainer 可移動範圍, 需要用 js 動態計算
   * contentContainer 高度 - window.innerHeight 畫面高度
   */
  contentContainerRange: 0,
  /**
   * scroll 卷軸可移動範圍, 需要用 js 動態計算
   * window.innerHeight 畫面高度 - 189 卷軸高度 - 28 nav 高度
   */
  scrollRange: 0,
  // 拖拽使用, mousedown 時紀錄
  scrollTop: 0,
  // 效果改為獨立函式, 這樣在 whee mousemove 都可以使用
  newsAnimation: function (scrollTop) {
    if (scrollTop < 0) scrollTop = 0;
    if (scrollTop > news.scrollRange) scrollTop = this.scrollRange;
    // 滾輪往上, 頁面往下, translateY ++
    // 滾輪往下, 頁面往上, translateY --
    let percentage =
      -(scrollTop / this.scrollRange) * this.contentContainerRange;
    this.$scroll.css({ top: scrollTop + "px" });
    this.$lineItalic.css({ transform: "translateY(" + percentage + "px)" });
    this.$contentContainer.css({
      transform: "translateY(" + percentage + "px)",
    });
  },
  newsWheelHandler: function (e) {
    // e.originalEvent.deltaY > 0, 代表卷軸向下滾動
    let deltaY =
      e.originalEvent.deltaY > 0
        ? news.scrollRange / 8
        : -(news.scrollRange / 8);
    let BoundY = news.$scroll.get(0).offsetTop;
    let scrollTop = deltaY + BoundY;
    news.newsAnimation(scrollTop);
    return false;
  },
  scrollMousedownHandler: function (e) {
    if (e.target !== this) return false;
    news.scrollTop = this.offsetTop - e.clientY;
    window.addEventListener("mousemove", news.windowMousemoveHandler);
    window.addEventListener("mouseup", news.windowMouseupHandler);
    return false;
  },
  windowMousemoveHandler: function (e) {
    let scrollTop = news.scrollTop + e.clientY;
    news.newsAnimation(scrollTop);
    return false;
  },
  windowMouseupHandler: function () {
    window.removeEventListener("mousemove", news.windowMousemoveHandler);
    window.removeEventListener("mouseup", news.windowMouseupHandler);
    return false;
  },
  imgContainerClickHandler: function () {
    let index = Number(this.dataset.index);
    // 有夠醜的程式碼, 但是效能比較好
    this.$imgs.eq(index).removeClass("show");
    index += 1;
    index = index > 2 ? 0 : index;
    this.$imgs.eq(index).addClass("show");
    this.dataset.index = index;
    return false;
  },
  windowResizeHandler: function () {
    news.contentContainerRange =
      news.$contentContainer.get(0).offsetHeight - window.innerHeight;
    // 189px 卷軸的高度, 28px nav 的高度
    news.scrollRange = window.innerHeight - 189 - 28;

    // 如果螢幕高度 > contentContainerRange, 則不需要滾輪與拖拽事件
    if (news.contentContainerRange > 0) {
      news.$news
        .off("wheel", news.newsWheelHandler)
        .on("wheel", news.newsWheelHandler);
      news.$scroll
        .addClass("show")
        .off("mousedown", news.scrollMousedownHandler)
        .on("mousedown", news.scrollMousedownHandler);
    } else {
      // 不需要滾輪事件時
      news.$news.off("wheel", news.newsWheelHandler);
      news.$scroll
        .removeClass("show")
        .off("mousedown", news.scrollMousedownHandler);
    }
    return false;
  },
  play: function () {},
  stop: function () {
    // contentContainer, scroll 都回到頂部
    this.newsAnimation(0);
  },
  init: function () {
    this.$imgContainer.off("click").on("click", this.imgContainerClickHandler);
    // 將 imgContainer 的子元素保存在屬性中, 讓 click 使用
    this.$imgContainer.each(function (index, imgContainer) {
      imgContainer.$imgs = $(imgContainer).children("img");
    });
    // 計算 contentContainerRange scrollRange
    this.windowResizeHandler();
    $(window).on("resize", utils.debounce(this.windowResizeHandler, {}));
  },
};
