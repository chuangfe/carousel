import $ from "jquery";
import { utils } from "../../assets/script/utils";
import "./style.scss";

/**
 * 事件節流, 減少事件函式的執行次數
 * 事件連續觸發, 事件函式需要一定的時間才會執行
 * @param {function} func - event function
 * @param {number} wait - 事件觸發後, 多久才可以執行事件函式, 若連續觸發事件, 事件函
 * 式不會執行
 * @param {number} limit - 若事件連續觸發事件, 每間隔多少時間必需執行一次事件函式
 * @param {boolean} immediate - true 代表第一次觸發事件時執行一次事件函式, 再開始節
 * 流, false 代表直接開始節流
 */
function debounce(func, { wait = 1000 / 30, limit = 30, immediate = true }) {
  // target - 事件函式的 this 目標
  // event - 事件函式的 event 物件
  // timer - 用於保存 setTimeout, 讓需要時可以 clear setTimeout
  // startTime - 計算事件函式每次執行的間隔時間
  let target, event, startTime, currentTime, timer;

  function waitFunc() {
    func.call(target, event);
    startTime = currentTime;
  }

  return function (e) {
    // target - 事件函式的 this 目標
    target = this;
    // event - 事件函式的 event 物件
    event = e;
    // 事件觸發後, 當前的時間, 回傳由 1970-01-01 00:00:00 UTC 開始到現在的毫秒
    currentTime = new Date().getTime();

    /**
     * 第一次觸發事件
     * immediate 判斷是否要執行事件函式
     * startTime 不會有第二次是 undefined, startTime = currentTime;
     */
    if (immediate && startTime === undefined) {
      waitFunc();
    }

    // 清除定時器
    clearTimeout(timer);

    // 若需要強迫執行一次事件函式 && 間隔時間滿足條件時
    if (limit && currentTime - startTime > limit) {
      waitFunc();
    } else {
      // 間隔時間沒有滿足條件, 且沒有再觸發事件時, wait 時間到會自動執行事件函式
      timer = setTimeout(waitFunc, wait);
    }
  };
}

export const citroen = {
  $citroen: $("#citroen"),
  $launchContainer: $("#citroen .launch-container"),
  // 跟著滑鼠移動的 block 們
  $moveBlocks: $("#citroen .move-block"),
  $mask: $("#citroen .mask"),
  $logo: $("#citroen .logo"),
  // .mask 中用來表現動畫的 image
  $sequence: $("#citroen .sequence"),
  // 拖拽的外層容器, 有背景線的矩形容器, 可拖拽範圍
  $spriteContainer: $("#citroen .sprite-container"),
  // 拖拽按鈕, 可拖拽的目標
  $spriteDrag: $("#citroen .sprite-drag"),
  // 可拖拽的範圍
  dragRange: 0,
  // 拖拽滑鼠左鍵按下時的 X 座標
  mousedownX: 0,
  // $spriteDrag 拖拽滑鼠左鍵按下時的 position left 值
  offsetLeft: 0,
  // 圖片的 src 字串
  imageSrc: "",
  // 圖片 src 字串最大索引
  imagesLength: 53,
  // 圖片 src 字串中 "-" 字元的索引
  indexOf: 0,
  // 圖片 src 中索引的數字
  newSrcIndex: 0,
  /**
   * @param {number} newIndex - 在 windowMousemoveHandler 時根據 button 的
   * offsetLeft 計算百分比, 並轉換成 index 傳入該函式
   */
  imageSrcToggle: function () {
    // substring(startIndex, endIndex) 擷取字串, 擷取從 startIndex 索引至 endIndex 索引的字串
    let oldSrcIndexString = this.imageSrc.substring(
      this.indexOf,
      this.indexOf + 2
    );
    // toString() 將數值轉為字串
    // padStart(2, "0") 若字串的長度小於 2, 在前面加上 0 字串
    let newSrcIndexString = this.newSrcIndex.toString().padStart(2, "0");
    // replace(old, new) 將 old 字串改為 new 字串
    let newSrc = this.imageSrc.replace(oldSrcIndexString, newSrcIndexString);
    this.$sequence.attr("src", newSrc);
  },
  reset: function () {
    this.newSrcIndex = 0;
    this.imageSrcToggle();
    this.$spriteDrag.css({ left: 0 + "px" });
    this.$mask.removeClass("hidden").css({ display: "block" });
  },
  launchContainerClickHandler: function () {
    citroen.reset();
  },
  spriteDragMousedownHandler: function (e) {
    citroen.mousedownX = e.clientX;
    citroen.offsetLeft = this.offsetLeft;
    window.addEventListener("mousemove", citroen.windowMousemoveHandler);
    window.addEventListener("mouseup", citroen.windowMouseupHandler);
    return false;
  },
  logoTransitionendHandler: function (e) {
    if (e.target !== this) return false;
    if (citroen.$mask.hasClass("hidden")) {
      citroen.$mask.css({ display: "none" });
    }
    return false;
  },
  citroenMousemoveHandler: function (e) {
    // 期望目標, 依視窗中心點為原點
    let x = e.clientX - window.innerWidth / 2;
    let y = e.clientY - window.innerHeight / 2;
    citroen.$moveBlocks.each(function (i, doc) {
      let translateX = x * doc.dataset.range;
      let translateY = y * doc.dataset.range;
      doc.style.transform =
        "translate(" + translateX + "px, " + translateY + "px)";
    });
  },
  windowMousemoveHandler: function (e) {
    // 拖拽部分
    let left = citroen.offsetLeft + e.clientX - citroen.mousedownX;
    if (left < 0) left = 0;
    if (left > citroen.dragRange) left = citroen.dragRange;
    citroen.$spriteDrag.css({ left: left + "px" });
    // img 修改 src 部分
    citroen.newSrcIndex = Math.round(
      (left / citroen.dragRange) * citroen.imagesLength
    );
    citroen.imageSrcToggle();
  },
  windowMouseupHandler: function () {
    window.removeEventListener("mousemove", citroen.windowMousemoveHandler);
    window.removeEventListener("mouseup", citroen.windowMouseupHandler);
    if (citroen.newSrcIndex === citroen.imagesLength) {
      citroen.$mask.addClass("hidden");
    }
  },
  play: function () {},
  stop: function () {
    this.reset();
  },
  init: function () {
    // 紀錄圖片的 src
    this.imageSrc = this.$sequence.attr("src");
    // 紀錄圖片 src 的 index 字串的索引
    this.indexOf = this.imageSrc.indexOf("-") + 1;
    // 紀錄可拖拽的範圍
    this.dragRange = this.$spriteContainer.width() - this.$spriteDrag.width();

    this.$launchContainer.on("click", this.launchContainerClickHandler);
    this.$citroen.on("mousemove", this.citroenMousemoveHandler);
    this.$spriteDrag.on("mousedown", this.spriteDragMousedownHandler);
    this.$logo.on("transitionend", this.logoTransitionendHandler);
  },
};
