import $ from "jquery";
import { utils } from "../../assets/script/utils";
import "./style.scss";

/**
 * @param {Number} value -  window.innerWidth or window.innerHeight
 * 要求: 列數 * 100 > window.innerWidth, 行數 * 100 > window.innerHeight
 * 5 % 2 = 2 ... 1
 * Math.ceil() 小數無條件進位
 */
function getRowCol(value) {
  // 如果有餘數, 商進位
  return value % 100 > 0 ? Math.ceil(value / 100) : value / 100;
}

/**
 * 計算 .mask 有文字圖片的索引
 * @param {Number} row - .mask div 的列數 - 9 格後, 剩下的格數除 2 分配至左右
 * @param {Number} col - .mask div 的行數 - 5 格後, 剩下的格數除 2 分配至左右
 */
function getStartXY(row, col) {
  //  Math.ceil() 小數無條件進位, 這樣定位會往偏右方
  let startX = Math.ceil((row - 9) / 2);
  //  Math.floor() 小數無條件捨去, 這樣定位會往偏上方
  let startY = Math.floor((col - 5) / 2);
  return {
    row: startX,
    col: startY,
  };
}

/**
 * 簡單說明動畫與事件的原理, .mask > div 在 create 時就有各自的 transition delay 時
 * 間, .mask.on-hover 時使用 !important 權限高於行內樣式, 已達成 hover 的 opacity
 * 動畫, .mask click 後刪除自己的 .on-hover class, 這時 divs 才會使用各自不同的
 * transition delay 行內樣式執行 opacity: 0; 動畫, .mask delay 2s transitionend
 * 後自己會 display: none; 就能點擊 .launch-container
 *
 * .launch-container click 後 .mask && .mask > div 恢復原狀, 與
 * bullittAgency.stop() 相同, 這樣不用切畫面也可以再玩一次
 */
export const bullittAgency = {
  $bullittagency: $("#bullittagency"),
  $mask: $("#bullittagency .mask"),
  $launchContainer: $("#bullittagency .launch-container"),
  squares: [],
  lastSquare: null,
  maskTransitionendHandler: function (e) {
    // 阻擋被冒泡
    if (e.target !== this) return false;
    bullittAgency.$mask.css({ display: "none" });
    // 阻擋冒泡
    return false;
  },
  maskClickHandler: function (e) {
    this.classList.remove("on-hover");
    return false;
  },
  launchContainerClickHandler: function () {
    bullittAgency.$mask.css({ display: "block" }).addClass("on-hover");
    return false;
  },
  create: function () {
    /**
     * 1440 * 720 時, 最少要列 15 格, 行 8 格數量的 div, div 大小為 100px * 100px,
     * 所以有餘數時要進位, 如果有人的螢幕比我的還小, 那就不管了
     */
    let row =
      getRowCol(window.innerWidth) < 15 ? 15 : getRowCol(window.innerWidth);
    // 8 行, Y
    let col =
      getRowCol(window.innerHeight) < 8 ? 8 : getRowCol(window.innerHeight);
    // 總共需要的 div 數量
    let len = row * col;
    // 有圖的 div 範圍需要列 9 格, 行 5 格, {row: 3, col: 2}, {x: 3, y: 2},
    /**
     * 記算有背景圖片的 div 索引, 大概範圍是列 9 格, 行 5 格, 並且要置中, 所以要算
     * 上下左右各需要空出多少格, 算出第一個有背景圖的索引後, 其他都好說
     */
    let start = getStartXY(row, col);
    let startIndex = start.col * row + start.row;
    // 有可能會做 windows resize 所以 bullittAgency.squares 清空
    bullittAgency.squares = [];
    // create div, push 到 squares 保存, 並且索引正確時設置背景圖的 class
    for (let i = 0; i < len; i++) {
      let square = document.createElement("div");
      bullittAgency.squares.push(square);
      switch (i) {
        case startIndex:
          square.classList.add("square-wetryto");
          break;
        // ---------------------------------------------------------------------
        case startIndex + row + 1:
          square.classList.add("square-m");
          break;
        case startIndex + row + 2:
          square.classList.add("square-a");
          break;
        case startIndex + row + 3:
          square.classList.add("square-k");
          break;
        case startIndex + row + 4:
          square.classList.add("square-e");
          break;
        // ---------------------------------------------------------------------
        case startIndex + row * 2 + 1:
          square.classList.add("square-t");
          break;
        case startIndex + row * 2 + 2:
          square.classList.add("square-h");
          break;
        case startIndex + row * 2 + 3:
          square.classList.add("square-e");
          break;
        case startIndex + row * 2 + 4:
          square.classList.add("square-line");
          break;
        case startIndex + row * 2 + 5:
          square.classList.add("square-w-bold");
          break;
        case startIndex + row * 2 + 6:
          square.classList.add("square-e-bold");
          break;
        case startIndex + row * 2 + 7:
          square.classList.add("square-b-bold");
          break;
        // ---------------------------------------------------------------------
        case startIndex + row * 3 + 1:
          square.classList.add("square-a");
          break;
        case startIndex + row * 3 + 2:
          square.classList.add("square-line");
          break;
        case startIndex + row * 3 + 3:
          square.classList.add("square-b-bold");
          break;
        case startIndex + row * 3 + 4:
          square.classList.add("square-e-bold");
          break;
        case startIndex + row * 3 + 5:
          square.classList.add("square-t-bold");
          break;
        case startIndex + row * 3 + 6:
          square.classList.add("square-t-bold");
          break;
        case startIndex + row * 3 + 7:
          square.classList.add("square-e-bold");
          break;
        case startIndex + row * 3 + 8:
          square.classList.add("square-r-bold");
          break;
        // ---------------------------------------------------------------------
        case startIndex + row * 4 + 1:
          square.classList.add("square-p");
          break;
        case startIndex + row * 4 + 2:
          square.classList.add("square-l");
          break;
        case startIndex + row * 4 + 3:
          square.classList.add("square-a");
          break;
        case startIndex + row * 4 + 4:
          square.classList.add("square-c");
          break;
        case startIndex + row * 4 + 5:
          square.classList.add("square-e");
          break;
      }
    }

    bullittAgency.$mask
      // 根據列行記算 $mask 的寬高, 至少要超過父元素才能當背景
      .css({ width: row * 100 + "px", height: col * 100 + "px" })
      // 有可能會做 windows resize 所以刪除子元素
      .empty()
      // 把 create squares 加進去
      .append(bullittAgency.squares);
    // 打亂 bullittAgency.squares 的選取排序, 因為 $mask click 的動畫是 squares 隨機消失
    bullittAgency.squares
      .sort(() => {
        return Math.random() > 0.5 ? 1 : -1;
      })
      /**
       * 隨機排序的 squares 每個人都有不同的 transition-delay, 當畫面在
       * #bullittagency 且 $mask removeClass 'on-hover', 這裡才會有效, 如果
       * $mask addClass 'on-hover' css 部分有使用 !important 來阻擋這裡的行內樣式
       */
      .forEach((square, index, squares) => {
        // 所有人都必需在 2 秒內消失, 不管你 delay 多久
        let second = (index / squares.length) * 1.9;
        square.style.transition = "opacity 0.1s ease-out " + second + "s";
      });
  },
  play: function () {
    this.$bullittagency.addClass("selected");
  },
  stop: function () {
    this.$bullittagency.removeClass("selected");
    this.$mask.css({ display: "block" }).addClass("on-hover");
  },
  init: function () {
    this.$mask.on("click", this.maskClickHandler);
    this.$mask.on("transitionend", this.maskTransitionendHandler);
    this.$launchContainer.on("click", this.launchContainerClickHandler);
    this.create();
    $(window).on("resize", utils.debounce(this.create, {}));
  },
};
