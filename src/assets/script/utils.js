export const utils = Utils();

function Utils() {
  /**
   * @param {Object} object - lazyLoadInit 參數集合
   * @param {Number} object.index - 紀錄 lazyLoad 的次數, 必需要外部傳入, 因為
   *  lazyLoadInit 會多次執行
   * @param {Array} object.elements - 正常情況是 img tag 的集合, 也可以吃 video tag
   *  集合, 建議轉成真陣列, 目前無法使用 src arr 的方式, 因為 webpack loader 不會解析
   *  未渲染的 dom 的 src 路徑, 所以路徑會錯誤, 故有解決辦法再說
   * @param {Function} object.callBack - elements load 事件執行的函式
   * @param {Boolean} object.allLoadRunCallBack - 回調函式要在何時執行, true = 每個
   *  load 事件都執行回調函式, false = 最後 load事件執行回調函式
   */
  function lazyLoadInit(object) {
    let tagName = object.elements[object.index].tagName.toLowerCase();
    let el = document.createElement(tagName);
    el.eventType = tagName === "img" ? "load" : "loadstart";
    el.addEventListener(el.eventType, lazyLoadHandler);
    /**
     * 將 object 掛到每個 el 身上, 讓 lazyLoadHandler 中的 this 使用, 希望傳址不會
     * 太消耗性能
     */
    el.lazyLoadData = object;
    el.src = object.elements[object.index].src;
  }
  // load event function
  function lazyLoadHandler() {
    // 刪除 el 的 load 事件
    this.removeEventListener(this.eventType, lazyLoadHandler);
    // 補足索引和長度差距, 陣列 0 號執行 load 事件, 故計算 1 次
    this.lazyLoadData.index++;
    // 記算當前 load 的百分比
    let percentage =
      this.lazyLoadData.index / this.lazyLoadData.elements.length;
    // 如果 callBack 存在
    if (this.lazyLoadData.callBack) {
      // 如果要在每個 load 事件都執行 callBack
      if (this.lazyLoadData.allLoadRunCallBack) {
        this.lazyLoadData.callBack(percentage);
      } else {
        // 在最後的 load 事件執行 callBack
        if (this.lazyLoadData.index === this.lazyLoadData.elements.length) {
          this.lazyLoadData.callBack(percentage);
          return false;
        }
      }
    }
    // load 事件結束
    if (this.lazyLoadData.index === this.lazyLoadData.elements.length) {
      return false;
    }
    // 繼續回調
    lazyLoadInit(this.lazyLoadData);
  }
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  return {
    /**
     * 只在前端做的模擬讀取進度, 原理是獲取有 src 的 tag, 並依照該 tags 做虛擬 dom
     * 的 load 事件, 在傳入 callBack 給 event function 執行
     * @param {array} elements - [img, audio, video, ...]
     * @param {function} callBack lazyLoadHandler 執行的函式
     * @param {boolean} allLoadRunCallBack
     * 如果是 true 則每一個元素 lazyLoadHandler 後執行 callBack 函式
     * 如果是 false 則最後的元素 lazyLoadHandler 後執行 callBack 函式
     */
    lazyLoad: function ({ elements, callBack, allLoadRunCallBack = false }) {
      lazyLoadInit({
        index: 0,
        elements: elements,
        callBack: callBack,
        allLoadRunCallBack: allLoadRunCallBack,
      });
    },
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    /**
     * 事件節流 - 減少事件函式的執行次數
     * 事件連續觸發, 事件函式需要一定的時間才會執行
     * @param {function} func - event function
     * @param {number} wait - 事件觸發後, 多久才可以執行事件函式, 若連續觸發事件,
     * 事件函式不會執行
     * @param {number} limit - 若事件連續觸發事件, 每間隔多少時間必需執行事件函式
     * @param {boolean} immediate - true 代表第一次觸發事件時執行一次事件函式, 再
     * 開始節流, false 代表直接開始節流
     * 補充, 通常針對 resize(視窗縮放) wheel(滾輪事件) mousemove(滑鼠移動)
     * keydown(鍵盤按下) ...
     */
    debounce: function (
      func,
      { wait = 1000 / 30, limit = 0, immediate = false }
    ) {
      // target - 事件函式的 this 目標
      // event - 事件函式的 event 物件
      // startTime - 事件函式執行後的時間
      // currentTime - 當前時間
      // timer - 用於保存 setTimeout, 讓需要時可以 clear setTimeout
      let target, event, startTime, currentTime, timer;
      // 包裝後的事件函式
      function waitFunc() {
        func.call(target, event);
        startTime = currentTime;
      }
      // 事件函式
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
    },
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
  };
}
