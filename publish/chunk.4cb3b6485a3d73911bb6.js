(window.webpackJsonp=window.webpackJsonp||[]).push([[28,9,10],{249:function(e,i,t){"use strict";var n=t(31),s=t(49),r=t(95);var a={name:"ShippingLine",props:{shippingLine:{type:Object,required:!0}},computed:{deadlineStr(){const e=this.shippingLine,i=e.posting_deadline&&e.posting_deadline.working_days||e.delivery_time&&e.delivery_time.working_days;let t=e.posting_deadline?e.posting_deadline.days:0;return e.delivery_time&&(t+=e.delivery_time.days),t>1?"".concat(Object(s.a)(n.Rd)," ").concat(t," ")+Object(s.a)(i?n.Yd:n.Z).toLowerCase():Object(s.a)(1===t?"":e.pick_up?"Retire hoje":n.Sc)},freightValueStr(){const{shippingLine:e}=this,i="number"==typeof e.total_price?e.total_price:e.price;return i?Object(r.a)(i):Object(s.a)(e.pick_up?n.sb:"Coleta no Laboratório")}}};i.a=a},252:function(e,i,t){"use strict";t.d(i,"a",(function(){return n})),t.d(i,"b",(function(){return s}));var n=function(){var e=this,i=e.$createElement,t=e._self._c||i;return t("div",{staticClass:"shipping-line"},[t("strong",{staticClass:"mr-2"},[e._v(" "+e._s(e.deadlineStr)+" ")]),t("span",{staticClass:"mr-2"},[e._v(" "+e._s(e.freightValueStr)+" ")]),e.shippingLine.delivery_instructions?t("small",[e._v(" "+e._s(e.shippingLine.delivery_instructions)+" ")]):e._e()])},s=[]}},0,[33,34]]);