// framework
import $ from "jquery";
import { utils } from "../../assets/script/utils";

// component
import { loader } from "../../components/loader/script";
import { whoWeAre } from "../../components/whoweare/script";
import { ralphLauren } from "../../components/ralphlauren/script";
import { bose } from "../../components/bose/script";
import { bullittAgency } from "../../components/bullittagency/script";
import { adisseo } from "../../components/adisseo/script";
import { kindy } from "../../components/kindy/script";
import { sanofi } from "../../components/sanofi/script";
import { news } from "../../components/news/script";
import { twist } from "../../components/twist/script";
import { luminarc } from "../../components/luminarc/script";
import { client } from "../../components/client/script";
import { ownthesky } from "../../components/ownthesky/script";
import { citroen } from "../../components/citroen/script";
import { contact } from "../../components/contact/script";

$(document).ready(function() {
  let modules = [
    loader,
    whoWeAre,
    ralphLauren,
    bose,
    bullittAgency,
    adisseo,
    kindy,
    sanofi,
    news,
    twist,
    luminarc,
    client,
    ownthesky,
    citroen,
    contact,
  ];

  if (module.hot) {
    module.hot.accept("../../components/loader/script", loader.init);
    module.hot.accept("../../components/whoweare/script", whoWeAre.init);
    module.hot.accept("../../components/ralphlauren/script", ralphLauren.init);
    module.hot.accept("../../components/bose/script", bose.init);
    module.hot.accept(
      "../../components/bullittagency/script",
      bullittAgency.init
    );
    module.hot.accept("../../components/adisseo/script", adisseo.init);
    module.hot.accept("../../components/kindy/script", kindy.init);
    module.hot.accept("../../components/sanofi/script", sanofi.init);
    module.hot.accept("../../components/news/script", news.init);
    module.hot.accept("../../components/twist/script", twist.init);
    module.hot.accept("../../components/luminarc/script", twist.init);
    module.hot.accept("../../components/client/script", client.init);
    module.hot.accept("../../components/ownthesky/script", ownthesky.init);
    module.hot.accept("../../components/citroen/script", citroen.init);
    module.hot.accept("../../components/contact/script", contact.init);
  }

  const carousel = {
    $carouselContainer: $("#carousel-container"),
    $modulesContainer: $("#modules-container"),
    // 存放各種 modules import 的返回物件
    modules: modules,
    newSelectedIndex: 0,
    oldSelectedIndex: 0,
    // 在 $modulesContainer window 拖拽時使用的變數
    left: 0,
    downX: 0,
    moveX: 0,
    // 用於阻擋 nav home 部分事件
    switch: true,
    // 是否可以拖拽
    onOff: true,
    // $carouselContainer 畫面上下切換,  true 代表畫面向上, false 代表畫面向下
    carouselContainerTogglesClass: function(boolean) {
      if (boolean) {
        this.$carouselContainer.removeClass("show-home");
      } else {
        this.$carouselContainer.addClass("show-home");
      }
    },
    // $modulesContainer 切換 module 時的樣式改變, 就是移動
    modulesContainerSetStyle: function() {
      let i = Math.floor(this.newSelectedIndex);
      this.$modulesContainer.css({
        transform: "translateX(" + -i * 100 + "vw)",
      });
    },
    // module 播放的函式執行, 停止的函式執行
    modulesPlay: function() {
      this.modules[this.newSelectedIndex].play();
      this.modules[this.oldSelectedIndex].stop();
      // loader module 結束後, 切到下一個 module, 才顯示 #nav, 僅限第一次
      if (this.oldSelectedIndex === 0) nav.navOneShow();
      this.oldSelectedIndex = this.newSelectedIndex;
    },
    carouselContainerTransitionendHandler: function(e) {
      if (e.target !== this) return false;
      // 當前畫面在上方, 並且 index 有修改過, 才能執行 modulesPlay
      if (
        carousel.switch &&
        carousel.newSelectedIndex !== carousel.oldSelectedIndex
      ) {
        carousel.modulesPlay();
      }
      return false;
    },
    /**
     * $modulesContainer 在 module 畫面切換完成後, 刪除 transition 樣式, 只有在
     * window mouseup 時 $modulesContainer transition 樣式才有效
     */
    modulesContainerTransitionendHandler: function(e) {
      if (e.target !== this) return false;
      // $modulesContainer 動畫結束, 可拖拽了
      carousel.onOff = true;
      // 當前畫面在上方, 並且 index 有修改過, 才能執行 modulesPlay
      if (
        carousel.switch &&
        carousel.newSelectedIndex !== carousel.oldSelectedIndex
      ) {
        carousel.modulesPlay();
      }
      /**
       * 在假設 $modulesContainer transition 有效的情況下, transitionend 後刪除
       * transition 樣式
       */
      carousel.$modulesContainer.css({ transition: "none" });
      return false;
    },
    /**
     * $modulesContainer mousedown 時紀錄 offsetLeft, mousedown clientX, 並且
     * 刪除 transition 樣式, 因為有可能是在 transition 執行時 mousedown, 所以必
     * 需強制設定 transform translateX offsetLeft, 鎖定當前 $modulesContainer
     * 的位置, window 綁定 mousemove mouseup 事件
     */
    modulesContainerMousedownHandler: function(e) {
      // 如果畫面不在上方, 檔掉事件
      if (!carousel.switch) return false;
      // 現在不可以拖拽
      if (!carousel.onOff) return false;
      carousel.left = carousel.$modulesContainer.offset().left;
      carousel.downX = e.clientX;
      $(window).on("mousemove", carousel.windowMousemoveHandler);
      $(window).on("mouseup", carousel.windowMouseupHandler);
      return false;
    },
    /**
     * 阻擋 chrome mousemove 滑鼠沒移動也觸發的情況, 並計算正確的 transform 賦值給
     * $modulesContainer 讓他跟著滑鼠移動, 達成拖拽的效果
     */
    windowMousemoveHandler: function(e) {
      // chrome mousemove 會誤觸發, 不確定要不要阻擋事件
      if (carousel.downX === e.clientX) return false;
      carousel.moveX = e.clientX - carousel.downX;
      carousel.$modulesContainer.css({
        transition: "none",
        transform: "translateX(" + (carousel.left + carousel.moveX) + "px)",
      });
      return false;
    },
    windowMouseupHandler: function() {
      // window 刪除 mousemove mouseup 事件
      $(window).off("mousemove", carousel.windowMousemoveHandler);
      $(window).off("mouseup", carousel.windowMouseupHandler);
      /**
       * 拖拽距離小於 -200 時, 代表滑鼠往左拖拽 $modulesContainer 往左移動
       * carousel.newSelectedIndex += 1, modules 的數量是
       * 15 個, 所以 carousel.newSelectedIndex > 14 時必需要鎖定在 14
       */
      if (carousel.moveX < -200) {
        carousel.newSelectedIndex += 1;
        if (carousel.newSelectedIndex > 14) carousel.newSelectedIndex = 14;
      }
      /**
       * 拖拽距離大於 200 時, 代表滑鼠往右拖拽 $modulesContainer 往右移動
       * carousel.newSelectedIndex -= 1, load module 除了剛開始播放以外, 就不再
       * 顯示, 所以 carousel.newSelectedIndex 不能是 0
       */
      if (carousel.moveX > 200) {
        // 如果有人白目在 loader module 時往右拖拽就 return false 鎖住
        if (carousel.newSelectedIndex === 0) {
          carousel.$modulesContainer.css({
            transition: "transform 0.4s ease-out",
          });
          carousel.modulesContainerSetStyle();
          return false;
        } else {
          carousel.newSelectedIndex -= 1;
          if (carousel.newSelectedIndex < 1) carousel.newSelectedIndex = 1;
        }
      }
      /**
       * carousel.moveX === 0, 代表只是單純的點擊, 故可以拖拽, 並刪除
       * $modulesContainer 的 transition 樣式, 避免畫面在下方時, 上方還有動畫
       * carousel.moveX !== 0, 代表有確實的拖拽事件, mousemove 有觸發, mouseup
       * 事件後, 關閉拖拽開關  carousel.onOff = false, 並在
       * modulesContainerTransitionendHandler 事件觸發後, carousel.onOff = true,
       * 才可以拖拽
       */
      if (carousel.moveX === 0) {
        carousel.onOff = true;
        carousel.$modulesContainer.css({ transition: "none" });
      } else {
        carousel.onOff = false;
        carousel.$modulesContainer.css({
          transition: "transform 0.4s ease-out",
        });
        carousel.modulesContainerSetStyle();
      }
      // 方便下次事件判斷
      carousel.moveX = 0;
      /**
       * 在 load module mousedown mouseup, 跳過 mousemove 時,
       * carousel.newSelectedIndex 還會是 0, 所以執行到這邊就要停止
       */
      if (carousel.newSelectedIndex === 0) return false;
      // 更新 nav.newSelectedIndex home.newSelectedIndex 並且讓各自的動畫到位
      nav.newSelectedIndex = home.newSelectedIndex =
        carousel.newSelectedIndex - 1;
      nav.navigatorsTogglesClass();
      nav.navigatorDragSetStyle();
      home.backgroundSetStyle();
      nav.oldSelectedIndex = home.oldSelectedIndex =
        carousel.newSelectedIndex - 1;
      return false;
    },
    init: function() {
      this.$carouselContainer.on(
        "transitionend",
        carousel.carouselContainerTransitionendHandler
      );
      carousel.$modulesContainer.on(
        "transitionend",
        carousel.modulesContainerTransitionendHandler
      );
      this.$modulesContainer.on(
        "mousedown",
        this.modulesContainerMousedownHandler
      );
      window.addEventListener("keydown", (e) => {
        if (e.keyCode === 9) {
          // 阻止 tab 默認事件
          e.preventDefault();
          // 阻止 keydown 冒泡
          e.stopPropagation();
        }
      });
    },
  };

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  const nav = {
    $nav: $("#nav"),
    $maskMenu: $("#nav .mask-menu"),
    $maskHover: $("#nav .mask-hover"),
    $navigators: $("#nav .navigator"),
    $navigatorDrag: $("#nav .navigator-drag"),
    newSelectedIndex: 0,
    oldSelectedIndex: 0,
    // carousel modulesContainer load module 切到第一個 module 後執行
    navOneShow: function() {
      this.$nav.css({ display: "block" });
    },
    // $nav 畫面顯示切換, true 代表小型 nav, false 代表完整版 nav
    navTogglesClass: function(boolean) {
      if (boolean) {
        this.$nav.removeClass("show-nav");
      } else {
        this.$nav.addClass("show-nav");
      }
    },
    // $navigators 調整 selected class
    navigatorsTogglesClass: function() {
      this.$navigators.eq(this.oldSelectedIndex).removeClass("selected");
      this.$navigators.eq(this.newSelectedIndex).addClass("selected");
    },
    // $navigatorDrag 獲取 $navigators mouseenter 的 offsetLeft, 然後移動
    navigatorDragSetStyle: function() {
      /**
       * loader 畫面時, $nav 是 display none 的, 然後通過 mouseup 事件移動到
       * whoweare 的過程中, 已經執行 navigatorDragSetStyle, 此時無法獲取正常的
       * left, 移動結束後, $nav 才會改為 display block 這時 left 才正常, 所以
       * 無法獲取時, 需要加上 || 改為 1px
       */
      let left = this.$navigators.get(this.newSelectedIndex).offsetLeft || 1;
      this.$navigatorDrag.css({
        transform: "translateX(" + left + "px)",
      });
    },
    /**
     * 避免畫面在下方時 carousel.switch === false 觸發 $maskHover click 事件
     */
    maskMenuHoverClickHandler: function() {
      if (!carousel.switch) return false;
      carousel.switch = false;
      carousel.carouselContainerTogglesClass(false);
      nav.navTogglesClass(false);
      home.homeTogglesClass(false);
      return false;
    },
    /**
     * $carouselContainer 在上方時禁止該事件觸發, $navigators mouseenter 時紀錄
     * nav.newSelectedIndex home.newSelectedIndex, 並且移動 $navigatorDrag 和
     * home.backgroundSetStyle 各種動畫, 動畫執行後更新 home.oldSelectedIndex,
     * nav.oldSelectedIndex 是跟著當前 module 跑的所以先不更新, 只有在 module 選
     * 定後畫面切換至上方時才更新, 這部分略為混亂可以多想想
     */
    navigatorMouseenterHandler: function() {
      if (carousel.switch) return false;
      nav.newSelectedIndex = home.newSelectedIndex = this.index;
      nav.navigatorDragSetStyle();
      home.backgroundSetStyle();
      home.oldSelectedIndex = this.index;
      return false;
    },
    /**
     * 首先畫面在上方時 carousel.switch = true 阻擋該事件, $navigator click 就是
     * 選定 module 時, carousel nav home 各自的 selectedIndex 更新, 各自的動畫執
     * 行, 唯獨 carousel.oldSelectedIndex 不能動, 因為該變數必需在 modulesPlay 結
     * 束時才能改, 而 modulesPlay 只能在 $carouselContainer transitionend 時執行
     * 這樣才能達成畫面到上方時, 才播放 module 的動畫
     * 補充說明, carousel.newSelectedIndex = nav.newSelectedIndex + 1 是因為要避
     * 免 load module 的畫面出現
     */
    navigatorDragClickHandler: function() {
      if (carousel.switch) return false;
      carousel.switch = true;
      carousel.newSelectedIndex = nav.newSelectedIndex + 1;
      home.newSelectedIndex = nav.newSelectedIndex;
      carousel.carouselContainerTogglesClass(true);
      carousel.modulesContainerSetStyle();
      nav.navTogglesClass(true);
      nav.navigatorsTogglesClass();
      nav.navigatorDragSetStyle();
      home.homeTogglesClass(true);
      home.backgroundSetStyle();
      nav.oldSelectedIndex = home.oldSelectedIndex = nav.newSelectedIndex;
      return false;
    },
    init: function() {
      // $navigators mouseenter 時紀錄 nav.newSelectedIndex
      this.$navigators.each((index, navigator) => {
        navigator.index = index;
      });
      this.$maskMenu.on("click", this.maskMenuHoverClickHandler);
      this.$maskHover.on("click", this.maskMenuHoverClickHandler);
      this.$navigators.on("mouseenter", this.navigatorMouseenterHandler);
      this.$navigatorDrag.on("click", this.navigatorDragClickHandler);
    },
  };

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  const home = {
    $home: $("#home"),
    $background: $("#home .home-background"),
    $dashed: $("#home .home-background-dashed"),
    $imagesContainer: $("#home .home-background-images-container"),
    $imageItems: $("#home .home-background-image-item"),
    $fontsContainer: $("#home .home-font-container"),
    $fontItems: $("#home .home-font-item"),
    $fontTitles: $("#home .home-font-item a"),
    newSelectedIndex: 0,
    oldSelectedIndex: 0,
    homeTogglesClass: function(boolean) {
      if (boolean) {
        this.$home.removeClass("show-home");
      } else {
        this.$home.addClass("show-home");
      }
    },
    // $background 下面子元素的一系列動畫
    backgroundSetStyle: function() {
      // $background 移動, 同時拖動 $dashed 和 $imagesContainer
      let value = this.newSelectedIndex * 135;
      /**
       * 2021/01/29 顯示卡驅動程式更新後, chrome transition: transform; 爆炸,
       * 動畫無理由的 lag, 原因不明且查詢不到, 故動畫改使用 left top 定位
       * chrome: 版本 88.0.4324.104 (正式版本) (64 位元)
       * 顯示卡: GTX 970, 驅動 461.40 發行日期: 01/26/2021
       */
      this.$background.css({
        transform: "translate(" + value * -1 + "px, " + value + "px)",
      });
      // this.$background.css({
      //   left: value * -1 + "px",
      //   top: value + "px",
      // });
      // $imageItems 切換 selected class
      this.$imageItems.eq(this.oldSelectedIndex).removeClass("selected");
      this.$imageItems.eq(this.newSelectedIndex).addClass("selected");
      // $fontItems 切換 selected class
      this.$fontItems.eq(this.oldSelectedIndex).removeClass("selected");
      this.$fontItems.eq(this.newSelectedIndex).addClass("selected");
      // $fontsContainer 移動
      this.$fontsContainer.css({
        transform: "translateX(" + this.newSelectedIndex * 470 * -1 + "px)",
      });
    },
    /**
     * 與 nav.navigatorDragClickHandler 類似, 畫面在上方阻擋該事件, 各自的
     * selectedIndex 更新, 各自的動畫執行, 該執行的都執行了
     */
    fontTitlesClickHandler: function() {
      if (carousel.switch) return false;
      carousel.switch = true;
      carousel.newSelectedIndex = this.index + 1;
      nav.newSelectedIndex = home.newSelectedIndex = this.index;
      carousel.carouselContainerTogglesClass(true);
      carousel.modulesContainerSetStyle();
      nav.navTogglesClass(true);
      nav.navigatorsTogglesClass();
      nav.navigatorDragSetStyle();
      home.homeTogglesClass(true);
      home.backgroundSetStyle();
      nav.oldSelectedIndex = home.oldSelectedIndex = this.index;
      return false;
    },
    resize: function() {
      let imagesContainerOffsetTop = home.$imagesContainer.get(0).offsetTop;
      let imagesContainerOffsetLeft = home.$imagesContainer.get(0).offsetLeft;
      /**
       * $dashed 定位至左下角, 背景圖片是 270 * 270 並且從左下角開始鋪滿背景圖片,
       * % 270) - 270 代表 $imagesContainer 第一個 image item 的左上角與下一張背
       * 景圖片的左上角對齊, 為什麼是下一張? 因為 $dashed 是定位至左下角, 故 left
       * 與 bottom 不能是正值, 否則 $background 與 $dashed 中間會露出屁股, 對齊後
       * 由於 $dashed 背景圖片與 image item 大小不一致, 所以需再次調整, 就是 -135,
       * home 的背景動畫是由 $dashed 與 $imageItems 的父元素 $background 來移動,
       * 所以父元素玩動畫不影響 $dashed 與 image item 的對齊
       */
      home.$dashed.css({
        left: (imagesContainerOffsetLeft % 270) - 270 - 135 + "px",
        bottom:
          ((window.innerHeight - imagesContainerOffsetTop) % 270) - 270 + "px",
      });
      home.backgroundSetStyle();
      return false;
    },
    init: function() {
      home.$fontTitles.on("click", home.fontTitlesClickHandler);
      home.$fontTitles.each((index, font) => (font.index = index));
      home.resize();
      $(window).on("resize", utils.debounce(home.resize, {}));
    },
  };

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  // init 部分集中在這裡執行, 在 ready 內執行應該比較安全

  carousel.init();
  nav.init();
  home.init();

  modules.forEach((module) => {
    module.init();
  });
});
