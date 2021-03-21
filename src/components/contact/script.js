import $ from "jquery";
import "./style.scss";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// 請在 views html 使用 ${require('')} 引入 components 的 template

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// component script

// 不需要參數或是熱更新時使用
// (function() {})();

// 需要參數或是熱更新時使用
// export function header(){};
// export default function header(){};

// 需要拋出物件時使用
// export const object = {};
// export default const object = {};

// 補充
// export 可以拋出多個物件
// export default 只能拋出一個物件

// example
// export const contactObject = {};
// export function contactFunction() {
//   console.log("Contact Script");
// }

export const contact = {
  play: function () {},
  stop: function () {},
  init: function () {},
};
