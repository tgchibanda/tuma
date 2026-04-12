/*!
 * Vue.js v2.7.14
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */var se=Object.freeze({}),N=Array.isArray;function O(e){return e==null}function b(e){return e!=null}function Z(e){return e===!0}function nd(e){return e===!1}function qt(e){return typeof e=="string"||typeof e=="number"||typeof e=="symbol"||typeof e=="boolean"}function q(e){return typeof e=="function"}function te(e){return e!==null&&typeof e=="object"}var ca=Object.prototype.toString;function ue(e){return ca.call(e)==="[object Object]"}function od(e){return ca.call(e)==="[object RegExp]"}function Vn(e){var t=parseFloat(String(e));return t>=0&&Math.floor(t)===t&&isFinite(e)}function Sr(e){return b(e)&&typeof e.then=="function"&&typeof e.catch=="function"}function ld(e){return e==null?"":Array.isArray(e)||ue(e)&&e.toString===ca?JSON.stringify(e,null,2):String(e)}function Ut(e){var t=parseFloat(e);return isNaN(t)?e:t}function Q(e,t){for(var s=Object.create(null),r=e.split(","),a=0;a<r.length;a++)s[r[a]]=!0;return t?function(i){return s[i.toLowerCase()]}:function(i){return s[i]}}var dd=Q("slot,component",!0),cd=Q("key,ref,slot,slot-scope,is");function Ge(e,t){var s=e.length;if(s){if(t===e[s-1]){e.length=s-1;return}var r=e.indexOf(t);if(r>-1)return e.splice(r,1)}}var ud=Object.prototype.hasOwnProperty;function re(e,t){return ud.call(e,t)}function ye(e){var t=Object.create(null);return function(r){var a=t[r];return a||(t[r]=e(r))}}var pd=/-(\w)/g,de=ye(function(e){return e.replace(pd,function(t,s){return s?s.toUpperCase():""})}),Xn=ye(function(e){return e.charAt(0).toUpperCase()+e.slice(1)}),fd=/\B([A-Z])/g,rt=ye(function(e){return e.replace(fd,"-$1").toLowerCase()});function md(e,t){function s(r){var a=arguments.length;return a?a>1?e.apply(t,arguments):e.call(t,r):e.call(t)}return s._length=e.length,s}function gd(e,t){return e.bind(t)}var Qn=Function.prototype.bind?gd:md;function $r(e,t){t=t||0;for(var s=e.length-t,r=new Array(s);s--;)r[s]=e[s+t];return r}function B(e,t){for(var s in t)e[s]=t[s];return e}function eo(e){for(var t={},s=0;s<e.length;s++)e[s]&&B(t,e[s]);return t}function G(e,t,s){}var me=function(e,t,s){return!1},to=function(e){return e};function hd(e){return e.reduce(function(t,s){return t.concat(s.staticKeys||[])},[]).join(",")}function at(e,t){if(e===t)return!0;var s=te(e),r=te(t);if(s&&r)try{var a=Array.isArray(e),i=Array.isArray(t);if(a&&i)return e.length===t.length&&e.every(function(l,d){return at(l,t[d])});if(e instanceof Date&&t instanceof Date)return e.getTime()===t.getTime();if(!a&&!i){var n=Object.keys(e),o=Object.keys(t);return n.length===o.length&&n.every(function(l){return at(e[l],t[l])})}else return!1}catch{return!1}else return!s&&!r?String(e)===String(t):!1}function so(e,t){for(var s=0;s<e.length;s++)if(at(e[s],t))return s;return-1}function Cs(e){var t=!1;return function(){t||(t=!0,e.apply(this,arguments))}}function vd(e,t){return e===t?e===0&&1/e!==1/t:e===e||t===t}var si="data-server-rendered",Ys=["component","directive","filter"],ro=["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated","errorCaptured","serverPrefetch","renderTracked","renderTriggered"],ce={optionMergeStrategies:Object.create(null),silent:!1,productionTip:!1,devtools:!1,performance:!1,errorHandler:null,warnHandler:null,ignoredElements:[],keyCodes:Object.create(null),isReservedTag:me,isReservedAttr:me,isUnknownElement:me,getTagNamespace:G,parsePlatformTagName:to,mustUseProp:me,async:!0,_lifecycleHooks:ro},ao=/a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;function io(e){var t=(e+"").charCodeAt(0);return t===36||t===95}function Me(e,t,s,r){Object.defineProperty(e,t,{value:s,enumerable:!!r,writable:!0,configurable:!0})}var xd=new RegExp("[^".concat(ao.source,".$_\\d]"));function bd(e){if(!xd.test(e)){var t=e.split(".");return function(s){for(var r=0;r<t.length;r++){if(!s)return;s=s[t[r]]}return s}}}var yd="__proto__"in{},ae=typeof window<"u",he=ae&&window.navigator.userAgent.toLowerCase(),qe=he&&/msie|trident/.test(he),_t=he&&he.indexOf("msie 9.0")>0,no=he&&he.indexOf("edge/")>0;he&&he.indexOf("android")>0;var wd=he&&/iphone|ipad|ipod|ios/.test(he),ri=he&&he.match(/firefox\/(\d+)/),Ar={}.watch,oo=!1;if(ae)try{var ai={};Object.defineProperty(ai,"passive",{get:function(){oo=!0}}),window.addEventListener("test-passive",null,ai)}catch{}var Xt,kt=function(){return Xt===void 0&&(!ae&&typeof global<"u"?Xt=global.process&&global.process.env.VUE_ENV==="server":Xt=!1),Xt},Rs=ae&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__;function vt(e){return typeof e=="function"&&/native code/.test(e.toString())}var Wt=typeof Symbol<"u"&&vt(Symbol)&&typeof Reflect<"u"&&vt(Reflect.ownKeys),Mt;typeof Set<"u"&&vt(Set)?Mt=Set:Mt=function(){function e(){this.set=Object.create(null)}return e.prototype.has=function(t){return this.set[t]===!0},e.prototype.add=function(t){this.set[t]=!0},e.prototype.clear=function(){this.set=Object.create(null)},e}();var Lt=null;function We(e){e===void 0&&(e=null),e||Lt&&Lt._scope.off(),Lt=e,e&&e._scope.on()}var pe=function(){function e(t,s,r,a,i,n,o,l){this.tag=t,this.data=s,this.children=r,this.text=a,this.elm=i,this.ns=void 0,this.context=n,this.fnContext=void 0,this.fnOptions=void 0,this.fnScopeId=void 0,this.key=s&&s.key,this.componentOptions=o,this.componentInstance=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1,this.isOnce=!1,this.asyncFactory=l,this.asyncMeta=void 0,this.isAsyncPlaceholder=!1}return Object.defineProperty(e.prototype,"child",{get:function(){return this.componentInstance},enumerable:!1,configurable:!0}),e}(),et=function(e){e===void 0&&(e="");var t=new pe;return t.text=e,t.isComment=!0,t};function ft(e){return new pe(void 0,void 0,void 0,String(e))}function Cr(e){var t=new pe(e.tag,e.data,e.children&&e.children.slice(),e.text,e.elm,e.context,e.componentOptions,e.asyncFactory);return t.ns=e.ns,t.isStatic=e.isStatic,t.key=e.key,t.isComment=e.isComment,t.fnContext=e.fnContext,t.fnOptions=e.fnOptions,t.fnScopeId=e.fnScopeId,t.asyncMeta=e.asyncMeta,t.isCloned=!0,t}var _d=0,ds=[],kd=function(){for(var e=0;e<ds.length;e++){var t=ds[e];t.subs=t.subs.filter(function(s){return s}),t._pending=!1}ds.length=0},Ze=function(){function e(){this._pending=!1,this.id=_d++,this.subs=[]}return e.prototype.addSub=function(t){this.subs.push(t)},e.prototype.removeSub=function(t){this.subs[this.subs.indexOf(t)]=null,this._pending||(this._pending=!0,ds.push(this))},e.prototype.depend=function(t){e.target&&e.target.addDep(this)},e.prototype.notify=function(t){for(var s=this.subs.filter(function(n){return n}),r=0,a=s.length;r<a;r++){var i=s[r];i.update()}},e}();Ze.target=null;var cs=[];function St(e){cs.push(e),Ze.target=e}function $t(){cs.pop(),Ze.target=cs[cs.length-1]}var lo=Array.prototype,Ts=Object.create(lo),Sd=["push","pop","shift","unshift","splice","sort","reverse"];Sd.forEach(function(e){var t=lo[e];Me(Ts,e,function(){for(var r=[],a=0;a<arguments.length;a++)r[a]=arguments[a];var i=t.apply(this,r),n=this.__ob__,o;switch(e){case"push":case"unshift":o=r;break;case"splice":o=r.slice(2);break}return o&&n.observeArray(o),n.dep.notify(),i})});var ii=Object.getOwnPropertyNames(Ts),co={},ua=!0;function Ke(e){ua=e}var $d={notify:G,depend:G,addSub:G,removeSub:G},ni=function(){function e(t,s,r){if(s===void 0&&(s=!1),r===void 0&&(r=!1),this.value=t,this.shallow=s,this.mock=r,this.dep=r?$d:new Ze,this.vmCount=0,Me(t,"__ob__",this),N(t)){if(!r)if(yd)t.__proto__=Ts;else for(var a=0,i=ii.length;a<i;a++){var n=ii[a];Me(t,n,Ts[n])}s||this.observeArray(t)}else for(var o=Object.keys(t),a=0;a<o.length;a++){var n=o[a];it(t,n,co,void 0,s,r)}}return e.prototype.observeArray=function(t){for(var s=0,r=t.length;s<r;s++)Fe(t[s],!1,this.mock)},e}();function Fe(e,t,s){if(e&&re(e,"__ob__")&&e.__ob__ instanceof ni)return e.__ob__;if(ua&&(s||!kt())&&(N(e)||ue(e))&&Object.isExtensible(e)&&!e.__v_skip&&!$e(e)&&!(e instanceof pe))return new ni(e,t,s)}function it(e,t,s,r,a,i){var n=new Ze,o=Object.getOwnPropertyDescriptor(e,t);if(!(o&&o.configurable===!1)){var l=o&&o.get,d=o&&o.set;(!l||d)&&(s===co||arguments.length===2)&&(s=e[t]);var c=!a&&Fe(s,!1,i);return Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){var v=l?l.call(e):s;return Ze.target&&(n.depend(),c&&(c.dep.depend(),N(v)&&po(v))),$e(v)&&!a?v.value:v},set:function(v){var y=l?l.call(e):s;if(vd(y,v)){if(d)d.call(e,v);else{if(l)return;if(!a&&$e(y)&&!$e(v)){y.value=v;return}else s=v}c=!a&&Fe(v,!1,i),n.notify()}}}),n}}function pa(e,t,s){if(!fa(e)){var r=e.__ob__;return N(e)&&Vn(t)?(e.length=Math.max(e.length,t),e.splice(t,1,s),r&&!r.shallow&&r.mock&&Fe(s,!1,!0),s):t in e&&!(t in Object.prototype)?(e[t]=s,s):e._isVue||r&&r.vmCount?s:r?(it(r.value,t,s,void 0,r.shallow,r.mock),r.dep.notify(),s):(e[t]=s,s)}}function uo(e,t){if(N(e)&&Vn(t)){e.splice(t,1);return}var s=e.__ob__;e._isVue||s&&s.vmCount||fa(e)||re(e,t)&&(delete e[t],s&&s.dep.notify())}function po(e){for(var t=void 0,s=0,r=e.length;s<r;s++)t=e[s],t&&t.__ob__&&t.__ob__.dep.depend(),N(t)&&po(t)}function fo(e){return Ad(e,!0),Me(e,"__v_isShallow",!0),e}function Ad(e,t){fa(e)||Fe(e,t,kt())}function fa(e){return!!(e&&e.__v_isReadonly)}function $e(e){return!!(e&&e.__v_isRef===!0)}function Rr(e,t,s){Object.defineProperty(e,s,{enumerable:!0,configurable:!0,get:function(){var r=t[s];if($e(r))return r.value;var a=r&&r.__ob__;return a&&a.dep.depend(),r},set:function(r){var a=t[s];$e(a)&&!$e(r)?a.value=r:t[s]=r}})}var oi=ye(function(e){var t=e.charAt(0)==="&";e=t?e.slice(1):e;var s=e.charAt(0)==="~";e=s?e.slice(1):e;var r=e.charAt(0)==="!";return e=r?e.slice(1):e,{name:e,once:s,capture:r,passive:t}});function Tr(e,t){function s(){var r=s.fns;if(N(r))for(var a=r.slice(),i=0;i<a.length;i++)Ye(a[i],null,arguments,t,"v-on handler");else return Ye(r,null,arguments,t,"v-on handler")}return s.fns=e,s}function mo(e,t,s,r,a,i){var n,o,l,d;for(n in e)o=e[n],l=t[n],d=oi(n),O(o)||(O(l)?(O(o.fns)&&(o=e[n]=Tr(o,i)),Z(d.once)&&(o=e[n]=a(d.name,o,d.capture)),s(d.name,o,d.capture,d.passive,d.params)):o!==l&&(l.fns=o,e[n]=l));for(n in t)O(e[n])&&(d=oi(n),r(d.name,t[n],d.capture))}function Ne(e,t,s){e instanceof pe&&(e=e.data.hook||(e.data.hook={}));var r,a=e[t];function i(){s.apply(this,arguments),Ge(r.fns,i)}O(a)?r=Tr([i]):b(a.fns)&&Z(a.merged)?(r=a,r.fns.push(i)):r=Tr([a,i]),r.merged=!0,e[t]=r}function Cd(e,t,s){var r=t.options.props;if(!O(r)){var a={},i=e.attrs,n=e.props;if(b(i)||b(n))for(var o in r){var l=rt(o);li(a,n,o,l,!0)||li(a,i,o,l,!1)}return a}}function li(e,t,s,r,a){if(b(t)){if(re(t,s))return e[s]=t[s],a||delete t[s],!0;if(re(t,r))return e[s]=t[r],a||delete t[r],!0}return!1}function Rd(e){for(var t=0;t<e.length;t++)if(N(e[t]))return Array.prototype.concat.apply([],e);return e}function ma(e){return qt(e)?[ft(e)]:N(e)?go(e):void 0}function Rt(e){return b(e)&&b(e.text)&&nd(e.isComment)}function go(e,t){var s=[],r,a,i,n;for(r=0;r<e.length;r++)a=e[r],!(O(a)||typeof a=="boolean")&&(i=s.length-1,n=s[i],N(a)?a.length>0&&(a=go(a,"".concat(t||"","_").concat(r)),Rt(a[0])&&Rt(n)&&(s[i]=ft(n.text+a[0].text),a.shift()),s.push.apply(s,a)):qt(a)?Rt(n)?s[i]=ft(n.text+a):a!==""&&s.push(ft(a)):Rt(a)&&Rt(n)?s[i]=ft(n.text+a.text):(Z(e._isVList)&&b(a.tag)&&O(a.key)&&b(t)&&(a.key="__vlist".concat(t,"_").concat(r,"__")),s.push(a)));return s}var Td=1,ho=2;function Ps(e,t,s,r,a,i){return(N(s)||qt(s))&&(a=r,r=s,s=void 0),Z(i)&&(a=ho),Pd(e,t,s,r,a)}function Pd(e,t,s,r,a){if(b(s)&&b(s.__ob__)||(b(s)&&b(s.is)&&(t=s.is),!t))return et();N(r)&&q(r[0])&&(s=s||{},s.scopedSlots={default:r[0]},r.length=0),a===ho?r=ma(r):a===Td&&(r=Rd(r));var i,n;if(typeof t=="string"){var o=void 0;n=e.$vnode&&e.$vnode.ns||ce.getTagNamespace(t),ce.isReservedTag(t)?i=new pe(ce.parsePlatformTagName(t),s,r,void 0,void 0,e):(!s||!s.pre)&&b(o=Ls(e.$options,"components",t))?i=yi(o,s,e,r,t):i=new pe(t,s,r,void 0,void 0,e)}else i=yi(t,s,e,r);return N(i)?i:b(i)?(b(n)&&vo(i,n),b(s)&&Dd(s),i):et()}function vo(e,t,s){if(e.ns=t,e.tag==="foreignObject"&&(t=void 0,s=!0),b(e.children))for(var r=0,a=e.children.length;r<a;r++){var i=e.children[r];b(i.tag)&&(O(i.ns)||Z(s)&&i.tag!=="svg")&&vo(i,t,s)}}function Dd(e){te(e.style)&&Os(e.style),te(e.class)&&Os(e.class)}function Fd(e,t){var s=null,r,a,i,n;if(N(e)||typeof e=="string")for(s=new Array(e.length),r=0,a=e.length;r<a;r++)s[r]=t(e[r],r);else if(typeof e=="number")for(s=new Array(e),r=0;r<e;r++)s[r]=t(r+1,r);else if(te(e))if(Wt&&e[Symbol.iterator]){s=[];for(var o=e[Symbol.iterator](),l=o.next();!l.done;)s.push(t(l.value,s.length)),l=o.next()}else for(i=Object.keys(e),s=new Array(i.length),r=0,a=i.length;r<a;r++)n=i[r],s[r]=t(e[n],n,r);return b(s)||(s=[]),s._isVList=!0,s}function Od(e,t,s,r){var a=this.$scopedSlots[e],i;a?(s=s||{},r&&(s=B(B({},r),s)),i=a(s)||(q(t)?t():t)):i=this.$slots[e]||(q(t)?t():t);var n=s&&s.slot;return n?this.$createElement("template",{slot:n},i):i}function Ed(e){return Ls(this.$options,"filters",e)||to}function di(e,t){return N(e)?e.indexOf(t)===-1:e!==t}function Ld(e,t,s,r,a){var i=ce.keyCodes[t]||s;return a&&r&&!ce.keyCodes[t]?di(a,r):i?di(i,e):r?rt(r)!==t:e===void 0}function jd(e,t,s,r,a){if(s&&te(s)){N(s)&&(s=eo(s));var i=void 0,n=function(l){if(l==="class"||l==="style"||cd(l))i=e;else{var d=e.attrs&&e.attrs.type;i=r||ce.mustUseProp(t,d,l)?e.domProps||(e.domProps={}):e.attrs||(e.attrs={})}var c=de(l),u=rt(l);if(!(c in i)&&!(u in i)&&(i[l]=s[l],a)){var v=e.on||(e.on={});v["update:".concat(l)]=function(y){s[l]=y}}};for(var o in s)n(o)}return e}function Nd(e,t){var s=this._staticTrees||(this._staticTrees=[]),r=s[e];return r&&!t||(r=s[e]=this.$options.staticRenderFns[e].call(this._renderProxy,this._c,this),xo(r,"__static__".concat(e),!1)),r}function Ud(e,t,s){return xo(e,"__once__".concat(t).concat(s?"_".concat(s):""),!0),e}function xo(e,t,s){if(N(e))for(var r=0;r<e.length;r++)e[r]&&typeof e[r]!="string"&&ci(e[r],"".concat(t,"_").concat(r),s);else ci(e,t,s)}function ci(e,t,s){e.isStatic=!0,e.key=t,e.isOnce=s}function Md(e,t){if(t&&ue(t)){var s=e.on=e.on?B({},e.on):{};for(var r in t){var a=s[r],i=t[r];s[r]=a?[].concat(a,i):i}}return e}function bo(e,t,s,r){t=t||{$stable:!s};for(var a=0;a<e.length;a++){var i=e[a];N(i)?bo(i,t,s):i&&(i.proxy&&(i.fn.proxy=!0),t[i.key]=i.fn)}return r&&(t.$key=r),t}function Id(e,t){for(var s=0;s<t.length;s+=2){var r=t[s];typeof r=="string"&&r&&(e[t[s]]=t[s+1])}return e}function Bd(e,t){return typeof e=="string"?t+e:e}function yo(e){e._o=Ud,e._n=Ut,e._s=ld,e._l=Fd,e._t=Od,e._q=at,e._i=so,e._m=Nd,e._f=Ed,e._k=Ld,e._b=jd,e._v=ft,e._e=et,e._u=bo,e._g=Md,e._d=Id,e._p=Bd}function ga(e,t){if(!e||!e.length)return{};for(var s={},r=0,a=e.length;r<a;r++){var i=e[r],n=i.data;if(n&&n.attrs&&n.attrs.slot&&delete n.attrs.slot,(i.context===t||i.fnContext===t)&&n&&n.slot!=null){var o=n.slot,l=s[o]||(s[o]=[]);i.tag==="template"?l.push.apply(l,i.children||[]):l.push(i)}else(s.default||(s.default=[])).push(i)}for(var d in s)s[d].every(zd)&&delete s[d];return s}function zd(e){return e.isComment&&!e.asyncFactory||e.text===" "}function It(e){return e.isComment&&e.asyncFactory}function jt(e,t,s,r){var a,i=Object.keys(s).length>0,n=t?!!t.$stable:!i,o=t&&t.$key;if(!t)a={};else{if(t._normalized)return t._normalized;if(n&&r&&r!==se&&o===r.$key&&!i&&!r.$hasNormal)return r;a={};for(var l in t)t[l]&&l[0]!=="$"&&(a[l]=Hd(e,s,l,t[l]))}for(var d in s)d in a||(a[d]=qd(s,d));return t&&Object.isExtensible(t)&&(t._normalized=a),Me(a,"$stable",n),Me(a,"$key",o),Me(a,"$hasNormal",i),a}function Hd(e,t,s,r){var a=function(){var i=Lt;We(e);var n=arguments.length?r.apply(null,arguments):r({});n=n&&typeof n=="object"&&!N(n)?[n]:ma(n);var o=n&&n[0];return We(i),n&&(!o||n.length===1&&o.isComment&&!It(o))?void 0:n};return r.proxy&&Object.defineProperty(t,s,{get:a,enumerable:!0,configurable:!0}),a}function qd(e,t){return function(){return e[t]}}function Wd(e){var t=e.$options,s=t.setup;if(s){var r=e._setupContext=Zd(e);We(e),St();var a=Ye(s,null,[e._props||fo({}),r],e,"setup");if($t(),We(),q(a))t.render=a;else if(te(a))if(e._setupState=a,a.__sfc){var n=e._setupProxy={};for(var i in a)i!=="__sfc"&&Rr(n,a,i)}else for(var i in a)io(i)||Rr(e,a,i)}}function Zd(e){return{get attrs(){if(!e._attrsProxy){var t=e._attrsProxy={};Me(t,"_v_attr_proxy",!0),Ds(t,e.$attrs,se,e,"$attrs")}return e._attrsProxy},get listeners(){if(!e._listenersProxy){var t=e._listenersProxy={};Ds(t,e.$listeners,se,e,"$listeners")}return e._listenersProxy},get slots(){return Yd(e)},emit:Qn(e.$emit,e),expose:function(t){t&&Object.keys(t).forEach(function(s){return Rr(e,t,s)})}}}function Ds(e,t,s,r,a){var i=!1;for(var n in t)n in e?t[n]!==s[n]&&(i=!0):(i=!0,Kd(e,n,r,a));for(var n in e)n in t||(i=!0,delete e[n]);return i}function Kd(e,t,s,r){Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){return s[r][t]}})}function Yd(e){return e._slotsProxy||wo(e._slotsProxy={},e.$scopedSlots),e._slotsProxy}function wo(e,t){for(var s in t)e[s]=t[s];for(var s in e)s in t||delete e[s]}function Gd(e){e._vnode=null,e._staticTrees=null;var t=e.$options,s=e.$vnode=t._parentVnode,r=s&&s.context;e.$slots=ga(t._renderChildren,r),e.$scopedSlots=s?jt(e.$parent,s.data.scopedSlots,e.$slots):se,e._c=function(i,n,o,l){return Ps(e,i,n,o,l,!1)},e.$createElement=function(i,n,o,l){return Ps(e,i,n,o,l,!0)};var a=s&&s.data;it(e,"$attrs",a&&a.attrs||se,null,!0),it(e,"$listeners",t._parentListeners||se,null,!0)}var Pr=null;function Jd(e){yo(e.prototype),e.prototype.$nextTick=function(t){return ba(t,this)},e.prototype._render=function(){var t=this,s=t.$options,r=s.render,a=s._parentVnode;a&&t._isMounted&&(t.$scopedSlots=jt(t.$parent,a.data.scopedSlots,t.$slots,t.$scopedSlots),t._slotsProxy&&wo(t._slotsProxy,t.$scopedSlots)),t.$vnode=a;var i;try{We(t),Pr=t,i=r.call(t._renderProxy,t.$createElement)}catch(n){nt(n,t,"render"),i=t._vnode}finally{Pr=null,We()}return N(i)&&i.length===1&&(i=i[0]),i instanceof pe||(i=et()),i.parent=a,i}}function nr(e,t){return(e.__esModule||Wt&&e[Symbol.toStringTag]==="Module")&&(e=e.default),te(e)?t.extend(e):e}function Vd(e,t,s,r,a){var i=et();return i.asyncFactory=e,i.asyncMeta={data:t,context:s,children:r,tag:a},i}function Xd(e,t){if(Z(e.error)&&b(e.errorComp))return e.errorComp;if(b(e.resolved))return e.resolved;var s=Pr;if(s&&b(e.owners)&&e.owners.indexOf(s)===-1&&e.owners.push(s),Z(e.loading)&&b(e.loadingComp))return e.loadingComp;if(s&&!b(e.owners)){var r=e.owners=[s],a=!0,i=null,n=null;s.$on("hook:destroyed",function(){return Ge(r,s)});var o=function(u){for(var v=0,y=r.length;v<y;v++)r[v].$forceUpdate();u&&(r.length=0,i!==null&&(clearTimeout(i),i=null),n!==null&&(clearTimeout(n),n=null))},l=Cs(function(u){e.resolved=nr(u,t),a?r.length=0:o(!0)}),d=Cs(function(u){b(e.errorComp)&&(e.error=!0,o(!0))}),c=e(l,d);return te(c)&&(Sr(c)?O(e.resolved)&&c.then(l,d):Sr(c.component)&&(c.component.then(l,d),b(c.error)&&(e.errorComp=nr(c.error,t)),b(c.loading)&&(e.loadingComp=nr(c.loading,t),c.delay===0?e.loading=!0:i=setTimeout(function(){i=null,O(e.resolved)&&O(e.error)&&(e.loading=!0,o(!1))},c.delay||200)),b(c.timeout)&&(n=setTimeout(function(){n=null,O(e.resolved)&&d(null)},c.timeout)))),a=!1,e.loading?e.loadingComp:e.resolved}}function _o(e){if(N(e))for(var t=0;t<e.length;t++){var s=e[t];if(b(s)&&(b(s.componentOptions)||It(s)))return s}}function Qd(e){e._events=Object.create(null),e._hasHookEvent=!1;var t=e.$options._parentListeners;t&&ko(e,t)}var Bt;function ec(e,t){Bt.$on(e,t)}function tc(e,t){Bt.$off(e,t)}function sc(e,t){var s=Bt;return function r(){var a=t.apply(null,arguments);a!==null&&s.$off(e,r)}}function ko(e,t,s){Bt=e,mo(t,s||{},ec,tc,sc,e),Bt=void 0}function rc(e){var t=/^hook:/;e.prototype.$on=function(s,r){var a=this;if(N(s))for(var i=0,n=s.length;i<n;i++)a.$on(s[i],r);else(a._events[s]||(a._events[s]=[])).push(r),t.test(s)&&(a._hasHookEvent=!0);return a},e.prototype.$once=function(s,r){var a=this;function i(){a.$off(s,i),r.apply(a,arguments)}return i.fn=r,a.$on(s,i),a},e.prototype.$off=function(s,r){var a=this;if(!arguments.length)return a._events=Object.create(null),a;if(N(s)){for(var i=0,n=s.length;i<n;i++)a.$off(s[i],r);return a}var o=a._events[s];if(!o)return a;if(!r)return a._events[s]=null,a;for(var l,d=o.length;d--;)if(l=o[d],l===r||l.fn===r){o.splice(d,1);break}return a},e.prototype.$emit=function(s){var r=this,a=r._events[s];if(a){a=a.length>1?$r(a):a;for(var i=$r(arguments,1),n='event handler for "'.concat(s,'"'),o=0,l=a.length;o<l;o++)Ye(a[o],r,i,r,n)}return r}}var tt=null;function So(e){var t=tt;return tt=e,function(){tt=t}}function ac(e){var t=e.$options,s=t.parent;if(s&&!t.abstract){for(;s.$options.abstract&&s.$parent;)s=s.$parent;s.$children.push(e)}e.$parent=s,e.$root=s?s.$root:e,e.$children=[],e.$refs={},e._provided=s?s._provided:Object.create(null),e._watcher=null,e._inactive=null,e._directInactive=!1,e._isMounted=!1,e._isDestroyed=!1,e._isBeingDestroyed=!1}function ic(e){e.prototype._update=function(t,s){var r=this,a=r.$el,i=r._vnode,n=So(r);r._vnode=t,i?r.$el=r.__patch__(i,t):r.$el=r.__patch__(r.$el,t,s,!1),n(),a&&(a.__vue__=null),r.$el&&(r.$el.__vue__=r);for(var o=r;o&&o.$vnode&&o.$parent&&o.$vnode===o.$parent._vnode;)o.$parent.$el=o.$el,o=o.$parent},e.prototype.$forceUpdate=function(){var t=this;t._watcher&&t._watcher.update()},e.prototype.$destroy=function(){var t=this;if(!t._isBeingDestroyed){xe(t,"beforeDestroy"),t._isBeingDestroyed=!0;var s=t.$parent;s&&!s._isBeingDestroyed&&!t.$options.abstract&&Ge(s.$children,t),t._scope.stop(),t._data.__ob__&&t._data.__ob__.vmCount--,t._isDestroyed=!0,t.__patch__(t._vnode,null),xe(t,"destroyed"),t.$off(),t.$el&&(t.$el.__vue__=null),t.$vnode&&(t.$vnode.parent=null)}}}function nc(e,t,s){e.$el=t,e.$options.render||(e.$options.render=et),xe(e,"beforeMount");var r;r=function(){e._update(e._render(),s)};var a={before:function(){e._isMounted&&!e._isDestroyed&&xe(e,"beforeUpdate")}};new ya(e,r,G,a,!0),s=!1;var i=e._preWatchers;if(i)for(var n=0;n<i.length;n++)i[n].run();return e.$vnode==null&&(e._isMounted=!0,xe(e,"mounted")),e}function oc(e,t,s,r,a){var i=r.data.scopedSlots,n=e.$scopedSlots,o=!!(i&&!i.$stable||n!==se&&!n.$stable||i&&e.$scopedSlots.$key!==i.$key||!i&&e.$scopedSlots.$key),l=!!(a||e.$options._renderChildren||o),d=e.$vnode;e.$options._parentVnode=r,e.$vnode=r,e._vnode&&(e._vnode.parent=r),e.$options._renderChildren=a;var c=r.data.attrs||se;e._attrsProxy&&Ds(e._attrsProxy,c,d.data&&d.data.attrs||se,e,"$attrs")&&(l=!0),e.$attrs=c,s=s||se;var u=e.$options._parentListeners;if(e._listenersProxy&&Ds(e._listenersProxy,s,u||se,e,"$listeners"),e.$listeners=e.$options._parentListeners=s,ko(e,s,u),t&&e.$options.props){Ke(!1);for(var v=e._props,y=e.$options._propKeys||[],p=0;p<y.length;p++){var m=y[p],f=e.$options.props;v[m]=$a(m,f,t,e)}Ke(!0),e.$options.propsData=t}l&&(e.$slots=ga(a,r.context),e.$forceUpdate())}function $o(e){for(;e&&(e=e.$parent);)if(e._inactive)return!0;return!1}function ha(e,t){if(t){if(e._directInactive=!1,$o(e))return}else if(e._directInactive)return;if(e._inactive||e._inactive===null){e._inactive=!1;for(var s=0;s<e.$children.length;s++)ha(e.$children[s]);xe(e,"activated")}}function Ao(e,t){if(!(t&&(e._directInactive=!0,$o(e)))&&!e._inactive){e._inactive=!0;for(var s=0;s<e.$children.length;s++)Ao(e.$children[s]);xe(e,"deactivated")}}function xe(e,t,s,r){r===void 0&&(r=!0),St();var a=Lt;r&&We(e);var i=e.$options[t],n="".concat(t," hook");if(i)for(var o=0,l=i.length;o<l;o++)Ye(i[o],e,s||null,e,n);e._hasHookEvent&&e.$emit("hook:"+t),r&&We(a),$t()}var Te=[],va=[],Fs={},Dr=!1,xa=!1,mt=0;function lc(){mt=Te.length=va.length=0,Fs={},Dr=xa=!1}var Co=0,Fr=Date.now;if(ae&&!qe){var or=window.performance;or&&typeof or.now=="function"&&Fr()>document.createEvent("Event").timeStamp&&(Fr=function(){return or.now()})}var dc=function(e,t){if(e.post){if(!t.post)return 1}else if(t.post)return-1;return e.id-t.id};function cc(){Co=Fr(),xa=!0;var e,t;for(Te.sort(dc),mt=0;mt<Te.length;mt++)e=Te[mt],e.before&&e.before(),t=e.id,Fs[t]=null,e.run();var s=va.slice(),r=Te.slice();lc(),fc(s),uc(r),kd(),Rs&&ce.devtools&&Rs.emit("flush")}function uc(e){for(var t=e.length;t--;){var s=e[t],r=s.vm;r&&r._watcher===s&&r._isMounted&&!r._isDestroyed&&xe(r,"updated")}}function pc(e){e._inactive=!1,va.push(e)}function fc(e){for(var t=0;t<e.length;t++)e[t]._inactive=!0,ha(e[t],!0)}function mc(e){var t=e.id;if(Fs[t]==null&&!(e===Ze.target&&e.noRecurse)){if(Fs[t]=!0,!xa)Te.push(e);else{for(var s=Te.length-1;s>mt&&Te[s].id>e.id;)s--;Te.splice(s+1,0,e)}Dr||(Dr=!0,ba(cc))}}var le,gc=function(){function e(t){t===void 0&&(t=!1),this.detached=t,this.active=!0,this.effects=[],this.cleanups=[],this.parent=le,!t&&le&&(this.index=(le.scopes||(le.scopes=[])).push(this)-1)}return e.prototype.run=function(t){if(this.active){var s=le;try{return le=this,t()}finally{le=s}}},e.prototype.on=function(){le=this},e.prototype.off=function(){le=this.parent},e.prototype.stop=function(t){if(this.active){var s=void 0,r=void 0;for(s=0,r=this.effects.length;s<r;s++)this.effects[s].teardown();for(s=0,r=this.cleanups.length;s<r;s++)this.cleanups[s]();if(this.scopes)for(s=0,r=this.scopes.length;s<r;s++)this.scopes[s].stop(!0);if(!this.detached&&this.parent&&!t){var a=this.parent.scopes.pop();a&&a!==this&&(this.parent.scopes[this.index]=a,a.index=this.index)}this.parent=void 0,this.active=!1}},e}();function hc(e,t){t===void 0&&(t=le),t&&t.active&&t.effects.push(e)}function vc(e){var t=e._provided,s=e.$parent&&e.$parent._provided;return s===t?e._provided=Object.create(s):t}function nt(e,t,s){St();try{if(t)for(var r=t;r=r.$parent;){var a=r.$options.errorCaptured;if(a)for(var i=0;i<a.length;i++)try{var n=a[i].call(r,e,t,s)===!1;if(n)return}catch(o){ui(o,r,"errorCaptured hook")}}ui(e,t,s)}finally{$t()}}function Ye(e,t,s,r,a){var i;try{i=s?e.apply(t,s):e.call(t),i&&!i._isVue&&Sr(i)&&!i._handled&&(i.catch(function(n){return nt(n,r,a+" (Promise/async)")}),i._handled=!0)}catch(n){nt(n,r,a)}return i}function ui(e,t,s){if(ce.errorHandler)try{return ce.errorHandler.call(null,e,t,s)}catch(r){r!==e&&pi(r)}pi(e)}function pi(e,t,s){if(ae&&typeof console<"u")console.error(e);else throw e}var Or=!1,Er=[],Lr=!1;function Qt(){Lr=!1;var e=Er.slice(0);Er.length=0;for(var t=0;t<e.length;t++)e[t]()}var Ot;if(typeof Promise<"u"&&vt(Promise)){var xc=Promise.resolve();Ot=function(){xc.then(Qt),wd&&setTimeout(G)},Or=!0}else if(!qe&&typeof MutationObserver<"u"&&(vt(MutationObserver)||MutationObserver.toString()==="[object MutationObserverConstructor]")){var es=1,bc=new MutationObserver(Qt),fi=document.createTextNode(String(es));bc.observe(fi,{characterData:!0}),Ot=function(){es=(es+1)%2,fi.data=String(es)},Or=!0}else typeof setImmediate<"u"&&vt(setImmediate)?Ot=function(){setImmediate(Qt)}:Ot=function(){setTimeout(Qt,0)};function ba(e,t){var s;if(Er.push(function(){if(e)try{e.call(t)}catch(r){nt(r,t,"nextTick")}else s&&s(t)}),Lr||(Lr=!0,Ot()),!e&&typeof Promise<"u")return new Promise(function(r){s=r})}var yc="2.7.14",mi=new Mt;function Os(e){return us(e,mi),mi.clear(),e}function us(e,t){var s,r,a=N(e);if(!(!a&&!te(e)||e.__v_skip||Object.isFrozen(e)||e instanceof pe)){if(e.__ob__){var i=e.__ob__.dep.id;if(t.has(i))return;t.add(i)}if(a)for(s=e.length;s--;)us(e[s],t);else if($e(e))us(e.value,t);else for(r=Object.keys(e),s=r.length;s--;)us(e[r[s]],t)}}var wc=0,ya=function(){function e(t,s,r,a,i){hc(this,le&&!le._vm?le:t?t._scope:void 0),(this.vm=t)&&i&&(t._watcher=this),a?(this.deep=!!a.deep,this.user=!!a.user,this.lazy=!!a.lazy,this.sync=!!a.sync,this.before=a.before):this.deep=this.user=this.lazy=this.sync=!1,this.cb=r,this.id=++wc,this.active=!0,this.post=!1,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new Mt,this.newDepIds=new Mt,this.expression="",q(s)?this.getter=s:(this.getter=bd(s),this.getter||(this.getter=G)),this.value=this.lazy?void 0:this.get()}return e.prototype.get=function(){St(this);var t,s=this.vm;try{t=this.getter.call(s,s)}catch(r){if(this.user)nt(r,s,'getter for watcher "'.concat(this.expression,'"'));else throw r}finally{this.deep&&Os(t),$t(),this.cleanupDeps()}return t},e.prototype.addDep=function(t){var s=t.id;this.newDepIds.has(s)||(this.newDepIds.add(s),this.newDeps.push(t),this.depIds.has(s)||t.addSub(this))},e.prototype.cleanupDeps=function(){for(var t=this.deps.length;t--;){var s=this.deps[t];this.newDepIds.has(s.id)||s.removeSub(this)}var r=this.depIds;this.depIds=this.newDepIds,this.newDepIds=r,this.newDepIds.clear(),r=this.deps,this.deps=this.newDeps,this.newDeps=r,this.newDeps.length=0},e.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():mc(this)},e.prototype.run=function(){if(this.active){var t=this.get();if(t!==this.value||te(t)||this.deep){var s=this.value;if(this.value=t,this.user){var r='callback for watcher "'.concat(this.expression,'"');Ye(this.cb,this.vm,[t,s],this.vm,r)}else this.cb.call(this.vm,t,s)}}},e.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},e.prototype.depend=function(){for(var t=this.deps.length;t--;)this.deps[t].depend()},e.prototype.teardown=function(){if(this.vm&&!this.vm._isBeingDestroyed&&Ge(this.vm._scope.effects,this),this.active){for(var t=this.deps.length;t--;)this.deps[t].removeSub(this);this.active=!1,this.onStop&&this.onStop()}},e}(),je={enumerable:!0,configurable:!0,get:G,set:G};function wa(e,t,s){je.get=function(){return this[t][s]},je.set=function(a){this[t][s]=a},Object.defineProperty(e,s,je)}function _c(e){var t=e.$options;if(t.props&&kc(e,t.props),Wd(e),t.methods&&Rc(e,t.methods),t.data)Sc(e);else{var s=Fe(e._data={});s&&s.vmCount++}t.computed&&Cc(e,t.computed),t.watch&&t.watch!==Ar&&Tc(e,t.watch)}function kc(e,t){var s=e.$options.propsData||{},r=e._props=fo({}),a=e.$options._propKeys=[],i=!e.$parent;i||Ke(!1);var n=function(l){a.push(l);var d=$a(l,t,s,e);it(r,l,d),l in e||wa(e,"_props",l)};for(var o in t)n(o);Ke(!0)}function Sc(e){var t=e.$options.data;t=e._data=q(t)?$c(t,e):t||{},ue(t)||(t={});var s=Object.keys(t),r=e.$options.props;e.$options.methods;for(var a=s.length;a--;){var i=s[a];r&&re(r,i)||io(i)||wa(e,"_data",i)}var n=Fe(t);n&&n.vmCount++}function $c(e,t){St();try{return e.call(t,t)}catch(s){return nt(s,t,"data()"),{}}finally{$t()}}var Ac={lazy:!0};function Cc(e,t){var s=e._computedWatchers=Object.create(null),r=kt();for(var a in t){var i=t[a],n=q(i)?i:i.get;r||(s[a]=new ya(e,n||G,G,Ac)),a in e||Ro(e,a,i)}}function Ro(e,t,s){var r=!kt();q(s)?(je.get=r?gi(t):hi(s),je.set=G):(je.get=s.get?r&&s.cache!==!1?gi(t):hi(s.get):G,je.set=s.set||G),Object.defineProperty(e,t,je)}function gi(e){return function(){var s=this._computedWatchers&&this._computedWatchers[e];if(s)return s.dirty&&s.evaluate(),Ze.target&&s.depend(),s.value}}function hi(e){return function(){return e.call(this,this)}}function Rc(e,t){e.$options.props;for(var s in t)e[s]=typeof t[s]!="function"?G:Qn(t[s],e)}function Tc(e,t){for(var s in t){var r=t[s];if(N(r))for(var a=0;a<r.length;a++)jr(e,s,r[a]);else jr(e,s,r)}}function jr(e,t,s,r){return ue(s)&&(r=s,s=s.handler),typeof s=="string"&&(s=e[s]),e.$watch(t,s,r)}function Pc(e){var t={};t.get=function(){return this._data};var s={};s.get=function(){return this._props},Object.defineProperty(e.prototype,"$data",t),Object.defineProperty(e.prototype,"$props",s),e.prototype.$set=pa,e.prototype.$delete=uo,e.prototype.$watch=function(r,a,i){var n=this;if(ue(a))return jr(n,r,a,i);i=i||{},i.user=!0;var o=new ya(n,r,a,i);if(i.immediate){var l='callback for immediate watcher "'.concat(o.expression,'"');St(),Ye(a,n,[o.value],n,l),$t()}return function(){o.teardown()}}}function Dc(e){var t=e.$options.provide;if(t){var s=q(t)?t.call(e):t;if(!te(s))return;for(var r=vc(e),a=Wt?Reflect.ownKeys(s):Object.keys(s),i=0;i<a.length;i++){var n=a[i];Object.defineProperty(r,n,Object.getOwnPropertyDescriptor(s,n))}}}function Fc(e){var t=To(e.$options.inject,e);t&&(Ke(!1),Object.keys(t).forEach(function(s){it(e,s,t[s])}),Ke(!0))}function To(e,t){if(e){for(var s=Object.create(null),r=Wt?Reflect.ownKeys(e):Object.keys(e),a=0;a<r.length;a++){var i=r[a];if(i!=="__ob__"){var n=e[i].from;if(n in t._provided)s[i]=t._provided[n];else if("default"in e[i]){var o=e[i].default;s[i]=q(o)?o.call(t):o}}}return s}}var Oc=0;function Ec(e){e.prototype._init=function(t){var s=this;s._uid=Oc++,s._isVue=!0,s.__v_skip=!0,s._scope=new gc(!0),s._scope._vm=!0,t&&t._isComponent?Lc(s,t):s.$options=ot(_a(s.constructor),t||{},s),s._renderProxy=s,s._self=s,ac(s),Qd(s),Gd(s),xe(s,"beforeCreate",void 0,!1),Fc(s),_c(s),Dc(s),xe(s,"created"),s.$options.el&&s.$mount(s.$options.el)}}function Lc(e,t){var s=e.$options=Object.create(e.constructor.options),r=t._parentVnode;s.parent=t.parent,s._parentVnode=r;var a=r.componentOptions;s.propsData=a.propsData,s._parentListeners=a.listeners,s._renderChildren=a.children,s._componentTag=a.tag,t.render&&(s.render=t.render,s.staticRenderFns=t.staticRenderFns)}function _a(e){var t=e.options;if(e.super){var s=_a(e.super),r=e.superOptions;if(s!==r){e.superOptions=s;var a=jc(e);a&&B(e.extendOptions,a),t=e.options=ot(s,e.extendOptions),t.name&&(t.components[t.name]=e)}}return t}function jc(e){var t,s=e.options,r=e.sealedOptions;for(var a in s)s[a]!==r[a]&&(t||(t={}),t[a]=s[a]);return t}function ka(e,t,s,r,a){var i=this,n=a.options,o;re(r,"_uid")?(o=Object.create(r),o._original=r):(o=r,r=r._original);var l=Z(n._compiled),d=!l;this.data=e,this.props=t,this.children=s,this.parent=r,this.listeners=e.on||se,this.injections=To(n.inject,r),this.slots=function(){return i.$slots||jt(r,e.scopedSlots,i.$slots=ga(s,r)),i.$slots},Object.defineProperty(this,"scopedSlots",{enumerable:!0,get:function(){return jt(r,e.scopedSlots,this.slots())}}),l&&(this.$options=n,this.$slots=this.slots(),this.$scopedSlots=jt(r,e.scopedSlots,this.$slots)),n._scopeId?this._c=function(c,u,v,y){var p=Ps(o,c,u,v,y,d);return p&&!N(p)&&(p.fnScopeId=n._scopeId,p.fnContext=r),p}:this._c=function(c,u,v,y){return Ps(o,c,u,v,y,d)}}yo(ka.prototype);function Nc(e,t,s,r,a){var i=e.options,n={},o=i.props;if(b(o))for(var l in o)n[l]=$a(l,o,t||se);else b(s.attrs)&&xi(n,s.attrs),b(s.props)&&xi(n,s.props);var d=new ka(s,n,a,r,e),c=i.render.call(null,d._c,d);if(c instanceof pe)return vi(c,s,d.parent,i);if(N(c)){for(var u=ma(c)||[],v=new Array(u.length),y=0;y<u.length;y++)v[y]=vi(u[y],s,d.parent,i);return v}}function vi(e,t,s,r,a){var i=Cr(e);return i.fnContext=s,i.fnOptions=r,t.slot&&((i.data||(i.data={})).slot=t.slot),i}function xi(e,t){for(var s in t)e[de(s)]=t[s]}function Es(e){return e.name||e.__name||e._componentTag}var Sa={init:function(e,t){if(e.componentInstance&&!e.componentInstance._isDestroyed&&e.data.keepAlive){var s=e;Sa.prepatch(s,s)}else{var r=e.componentInstance=Uc(e,tt);r.$mount(t?e.elm:void 0,t)}},prepatch:function(e,t){var s=t.componentOptions,r=t.componentInstance=e.componentInstance;oc(r,s.propsData,s.listeners,t,s.children)},insert:function(e){var t=e.context,s=e.componentInstance;s._isMounted||(s._isMounted=!0,xe(s,"mounted")),e.data.keepAlive&&(t._isMounted?pc(s):ha(s,!0))},destroy:function(e){var t=e.componentInstance;t._isDestroyed||(e.data.keepAlive?Ao(t,!0):t.$destroy())}},bi=Object.keys(Sa);function yi(e,t,s,r,a){if(!O(e)){var i=s.$options._base;if(te(e)&&(e=i.extend(e)),typeof e=="function"){var n;if(O(e.cid)&&(n=e,e=Xd(n,i),e===void 0))return Vd(n,t,s,r,a);t=t||{},_a(e),b(t.model)&&Bc(e.options,t);var o=Cd(t,e);if(Z(e.options.functional))return Nc(e,o,t,s,r);var l=t.on;if(t.on=t.nativeOn,Z(e.options.abstract)){var d=t.slot;t={},d&&(t.slot=d)}Mc(t);var c=Es(e.options)||a,u=new pe("vue-component-".concat(e.cid).concat(c?"-".concat(c):""),t,void 0,void 0,void 0,s,{Ctor:e,propsData:o,listeners:l,tag:a,children:r},n);return u}}}function Uc(e,t){var s={_isComponent:!0,_parentVnode:e,parent:t},r=e.data.inlineTemplate;return b(r)&&(s.render=r.render,s.staticRenderFns=r.staticRenderFns),new e.componentOptions.Ctor(s)}function Mc(e){for(var t=e.hook||(e.hook={}),s=0;s<bi.length;s++){var r=bi[s],a=t[r],i=Sa[r];a!==i&&!(a&&a._merged)&&(t[r]=a?Ic(i,a):i)}}function Ic(e,t){var s=function(r,a){e(r,a),t(r,a)};return s._merged=!0,s}function Bc(e,t){var s=e.model&&e.model.prop||"value",r=e.model&&e.model.event||"input";(t.attrs||(t.attrs={}))[s]=t.model.value;var a=t.on||(t.on={}),i=a[r],n=t.model.callback;b(i)?(N(i)?i.indexOf(n)===-1:i!==n)&&(a[r]=[n].concat(i)):a[r]=n}var Po=G,Se=ce.optionMergeStrategies;function zt(e,t,s){if(s===void 0&&(s=!0),!t)return e;for(var r,a,i,n=Wt?Reflect.ownKeys(t):Object.keys(t),o=0;o<n.length;o++)r=n[o],r!=="__ob__"&&(a=e[r],i=t[r],!s||!re(e,r)?pa(e,r,i):a!==i&&ue(a)&&ue(i)&&zt(a,i));return e}function wi(e,t,s){return s?function(){var a=q(t)?t.call(s,s):t,i=q(e)?e.call(s,s):e;return a?zt(a,i):i}:t?e?function(){return zt(q(t)?t.call(this,this):t,q(e)?e.call(this,this):e)}:t:e}Se.data=function(e,t,s){return s?wi(e,t,s):t&&typeof t!="function"?e:wi(e,t)};function zc(e,t){var s=t?e?e.concat(t):N(t)?t:[t]:e;return s&&Hc(s)}function Hc(e){for(var t=[],s=0;s<e.length;s++)t.indexOf(e[s])===-1&&t.push(e[s]);return t}ro.forEach(function(e){Se[e]=zc});function qc(e,t,s,r){var a=Object.create(e||null);return t?B(a,t):a}Ys.forEach(function(e){Se[e+"s"]=qc});Se.watch=function(e,t,s,r){if(e===Ar&&(e=void 0),t===Ar&&(t=void 0),!t)return Object.create(e||null);if(!e)return t;var a={};B(a,e);for(var i in t){var n=a[i],o=t[i];n&&!N(n)&&(n=[n]),a[i]=n?n.concat(o):N(o)?o:[o]}return a};Se.props=Se.methods=Se.inject=Se.computed=function(e,t,s,r){if(!e)return t;var a=Object.create(null);return B(a,e),t&&B(a,t),a};Se.provide=function(e,t){return e?function(){var s=Object.create(null);return zt(s,q(e)?e.call(this):e),t&&zt(s,q(t)?t.call(this):t,!1),s}:t};var Wc=function(e,t){return t===void 0?e:t};function Zc(e,t){var s=e.props;if(s){var r={},a,i,n;if(N(s))for(a=s.length;a--;)i=s[a],typeof i=="string"&&(n=de(i),r[n]={type:null});else if(ue(s))for(var o in s)i=s[o],n=de(o),r[n]=ue(i)?i:{type:i};e.props=r}}function Kc(e,t){var s=e.inject;if(s){var r=e.inject={};if(N(s))for(var a=0;a<s.length;a++)r[s[a]]={from:s[a]};else if(ue(s))for(var i in s){var n=s[i];r[i]=ue(n)?B({from:i},n):{from:n}}}}function Yc(e){var t=e.directives;if(t)for(var s in t){var r=t[s];q(r)&&(t[s]={bind:r,update:r})}}function ot(e,t,s){if(q(t)&&(t=t.options),Zc(t),Kc(t),Yc(t),!t._base&&(t.extends&&(e=ot(e,t.extends,s)),t.mixins))for(var r=0,a=t.mixins.length;r<a;r++)e=ot(e,t.mixins[r],s);var i={},n;for(n in e)o(n);for(n in t)re(e,n)||o(n);function o(l){var d=Se[l]||Wc;i[l]=d(e[l],t[l],s,l)}return i}function Ls(e,t,s,r){if(typeof s=="string"){var a=e[t];if(re(a,s))return a[s];var i=de(s);if(re(a,i))return a[i];var n=Xn(i);if(re(a,n))return a[n];var o=a[s]||a[i]||a[n];return o}}function $a(e,t,s,r){var a=t[e],i=!re(s,e),n=s[e],o=ki(Boolean,a.type);if(o>-1){if(i&&!re(a,"default"))n=!1;else if(n===""||n===rt(e)){var l=ki(String,a.type);(l<0||o<l)&&(n=!0)}}if(n===void 0){n=Gc(r,a,e);var d=ua;Ke(!0),Fe(n),Ke(d)}return n}function Gc(e,t,s){if(re(t,"default")){var r=t.default;return e&&e.$options.propsData&&e.$options.propsData[s]===void 0&&e._props[s]!==void 0?e._props[s]:q(r)&&Nr(t.type)!=="Function"?r.call(e):r}}var Jc=/^\s*function (\w+)/;function Nr(e){var t=e&&e.toString().match(Jc);return t?t[1]:""}function _i(e,t){return Nr(e)===Nr(t)}function ki(e,t){if(!N(t))return _i(t,e)?0:-1;for(var s=0,r=t.length;s<r;s++)if(_i(t[s],e))return s;return-1}function D(e){this._init(e)}Ec(D);Pc(D);rc(D);ic(D);Jd(D);function Vc(e){e.use=function(t){var s=this._installedPlugins||(this._installedPlugins=[]);if(s.indexOf(t)>-1)return this;var r=$r(arguments,1);return r.unshift(this),q(t.install)?t.install.apply(t,r):q(t)&&t.apply(null,r),s.push(t),this}}function Xc(e){e.mixin=function(t){return this.options=ot(this.options,t),this}}function Qc(e){e.cid=0;var t=1;e.extend=function(s){s=s||{};var r=this,a=r.cid,i=s._Ctor||(s._Ctor={});if(i[a])return i[a];var n=Es(s)||Es(r.options),o=function(d){this._init(d)};return o.prototype=Object.create(r.prototype),o.prototype.constructor=o,o.cid=t++,o.options=ot(r.options,s),o.super=r,o.options.props&&eu(o),o.options.computed&&tu(o),o.extend=r.extend,o.mixin=r.mixin,o.use=r.use,Ys.forEach(function(l){o[l]=r[l]}),n&&(o.options.components[n]=o),o.superOptions=r.options,o.extendOptions=s,o.sealedOptions=B({},o.options),i[a]=o,o}}function eu(e){var t=e.options.props;for(var s in t)wa(e.prototype,"_props",s)}function tu(e){var t=e.options.computed;for(var s in t)Ro(e.prototype,s,t[s])}function su(e){Ys.forEach(function(t){e[t]=function(s,r){return r?(t==="component"&&ue(r)&&(r.name=r.name||s,r=this.options._base.extend(r)),t==="directive"&&q(r)&&(r={bind:r,update:r}),this.options[t+"s"][s]=r,r):this.options[t+"s"][s]}})}function Si(e){return e&&(Es(e.Ctor.options)||e.tag)}function ts(e,t){return N(e)?e.indexOf(t)>-1:typeof e=="string"?e.split(",").indexOf(t)>-1:od(e)?e.test(t):!1}function $i(e,t){var s=e.cache,r=e.keys,a=e._vnode;for(var i in s){var n=s[i];if(n){var o=n.name;o&&!t(o)&&Ur(s,i,r,a)}}}function Ur(e,t,s,r){var a=e[t];a&&(!r||a.tag!==r.tag)&&a.componentInstance.$destroy(),e[t]=null,Ge(s,t)}var Ai=[String,RegExp,Array],ru={name:"keep-alive",abstract:!0,props:{include:Ai,exclude:Ai,max:[String,Number]},methods:{cacheVNode:function(){var e=this,t=e.cache,s=e.keys,r=e.vnodeToCache,a=e.keyToCache;if(r){var i=r.tag,n=r.componentInstance,o=r.componentOptions;t[a]={name:Si(o),tag:i,componentInstance:n},s.push(a),this.max&&s.length>parseInt(this.max)&&Ur(t,s[0],s,this._vnode),this.vnodeToCache=null}}},created:function(){this.cache=Object.create(null),this.keys=[]},destroyed:function(){for(var e in this.cache)Ur(this.cache,e,this.keys)},mounted:function(){var e=this;this.cacheVNode(),this.$watch("include",function(t){$i(e,function(s){return ts(t,s)})}),this.$watch("exclude",function(t){$i(e,function(s){return!ts(t,s)})})},updated:function(){this.cacheVNode()},render:function(){var e=this.$slots.default,t=_o(e),s=t&&t.componentOptions;if(s){var r=Si(s),a=this,i=a.include,n=a.exclude;if(i&&(!r||!ts(i,r))||n&&r&&ts(n,r))return t;var o=this,l=o.cache,d=o.keys,c=t.key==null?s.Ctor.cid+(s.tag?"::".concat(s.tag):""):t.key;l[c]?(t.componentInstance=l[c].componentInstance,Ge(d,c),d.push(c)):(this.vnodeToCache=t,this.keyToCache=c),t.data.keepAlive=!0}return t||e&&e[0]}},au={KeepAlive:ru};function iu(e){var t={};t.get=function(){return ce},Object.defineProperty(e,"config",t),e.util={warn:Po,extend:B,mergeOptions:ot,defineReactive:it},e.set=pa,e.delete=uo,e.nextTick=ba,e.observable=function(s){return Fe(s),s},e.options=Object.create(null),Ys.forEach(function(s){e.options[s+"s"]=Object.create(null)}),e.options._base=e,B(e.options.components,au),Vc(e),Xc(e),Qc(e),su(e)}iu(D);Object.defineProperty(D.prototype,"$isServer",{get:kt});Object.defineProperty(D.prototype,"$ssrContext",{get:function(){return this.$vnode&&this.$vnode.ssrContext}});Object.defineProperty(D,"FunctionalRenderContext",{value:ka});D.version=yc;var nu=Q("style,class"),ou=Q("input,textarea,option,select,progress"),Do=function(e,t,s){return s==="value"&&ou(e)&&t!=="button"||s==="selected"&&e==="option"||s==="checked"&&e==="input"||s==="muted"&&e==="video"},Fo=Q("contenteditable,draggable,spellcheck"),lu=Q("events,caret,typing,plaintext-only"),du=function(e,t){return js(t)||t==="false"?"false":e==="contenteditable"&&lu(t)?t:"true"},cu=Q("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,truespeed,typemustmatch,visible"),Mr="http://www.w3.org/1999/xlink",Aa=function(e){return e.charAt(5)===":"&&e.slice(0,5)==="xlink"},Oo=function(e){return Aa(e)?e.slice(6,e.length):""},js=function(e){return e==null||e===!1};function uu(e){for(var t=e.data,s=e,r=e;b(r.componentInstance);)r=r.componentInstance._vnode,r&&r.data&&(t=Ci(r.data,t));for(;b(s=s.parent);)s&&s.data&&(t=Ci(t,s.data));return pu(t.staticClass,t.class)}function Ci(e,t){return{staticClass:Ca(e.staticClass,t.staticClass),class:b(e.class)?[e.class,t.class]:t.class}}function pu(e,t){return b(e)||b(t)?Ca(e,Ra(t)):""}function Ca(e,t){return e?t?e+" "+t:e:t||""}function Ra(e){return Array.isArray(e)?fu(e):te(e)?mu(e):typeof e=="string"?e:""}function fu(e){for(var t="",s,r=0,a=e.length;r<a;r++)b(s=Ra(e[r]))&&s!==""&&(t&&(t+=" "),t+=s);return t}function mu(e){var t="";for(var s in e)e[s]&&(t&&(t+=" "),t+=s);return t}var gu={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},hu=Q("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),Ta=Q("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),vu=function(e){return e==="pre"},Pa=function(e){return hu(e)||Ta(e)};function Eo(e){if(Ta(e))return"svg";if(e==="math")return"math"}var ss=Object.create(null);function xu(e){if(!ae)return!0;if(Pa(e))return!1;if(e=e.toLowerCase(),ss[e]!=null)return ss[e];var t=document.createElement(e);return e.indexOf("-")>-1?ss[e]=t.constructor===window.HTMLUnknownElement||t.constructor===window.HTMLElement:ss[e]=/HTMLUnknownElement/.test(t.toString())}var Ir=Q("text,number,password,search,email,tel,url");function Da(e){if(typeof e=="string"){var t=document.querySelector(e);return t||document.createElement("div")}else return e}function bu(e,t){var s=document.createElement(e);return e!=="select"||t.data&&t.data.attrs&&t.data.attrs.multiple!==void 0&&s.setAttribute("multiple","multiple"),s}function yu(e,t){return document.createElementNS(gu[e],t)}function wu(e){return document.createTextNode(e)}function _u(e){return document.createComment(e)}function ku(e,t,s){e.insertBefore(t,s)}function Su(e,t){e.removeChild(t)}function $u(e,t){e.appendChild(t)}function Au(e){return e.parentNode}function Cu(e){return e.nextSibling}function Ru(e){return e.tagName}function Tu(e,t){e.textContent=t}function Pu(e,t){e.setAttribute(t,"")}var Du=Object.freeze({__proto__:null,createElement:bu,createElementNS:yu,createTextNode:wu,createComment:_u,insertBefore:ku,removeChild:Su,appendChild:$u,parentNode:Au,nextSibling:Cu,tagName:Ru,setTextContent:Tu,setStyleScope:Pu}),Fu={create:function(e,t){gt(t)},update:function(e,t){e.data.ref!==t.data.ref&&(gt(e,!0),gt(t))},destroy:function(e){gt(e,!0)}};function gt(e,t){var s=e.data.ref;if(b(s)){var r=e.context,a=e.componentInstance||e.elm,i=t?null:a,n=t?void 0:a;if(q(s)){Ye(s,r,[i],r,"template ref function");return}var o=e.data.refInFor,l=typeof s=="string"||typeof s=="number",d=$e(s),c=r.$refs;if(l||d){if(o){var u=l?c[s]:s.value;t?N(u)&&Ge(u,a):N(u)?u.includes(a)||u.push(a):l?(c[s]=[a],Ri(r,s,c[s])):s.value=[a]}else if(l){if(t&&c[s]!==a)return;c[s]=n,Ri(r,s,i)}else if(d){if(t&&s.value!==a)return;s.value=i}}}}function Ri(e,t,s){var r=e._setupState;r&&re(r,t)&&($e(r[t])?r[t].value=s:r[t]=s)}var Ue=new pe("",{},[]),Tt=["create","activate","update","remove","destroy"];function Xe(e,t){return e.key===t.key&&e.asyncFactory===t.asyncFactory&&(e.tag===t.tag&&e.isComment===t.isComment&&b(e.data)===b(t.data)&&Ou(e,t)||Z(e.isAsyncPlaceholder)&&O(t.asyncFactory.error))}function Ou(e,t){if(e.tag!=="input")return!0;var s,r=b(s=e.data)&&b(s=s.attrs)&&s.type,a=b(s=t.data)&&b(s=s.attrs)&&s.type;return r===a||Ir(r)&&Ir(a)}function Eu(e,t,s){var r,a,i={};for(r=t;r<=s;++r)a=e[r].key,b(a)&&(i[a]=r);return i}function Lu(e){var t,s,r={},a=e.modules,i=e.nodeOps;for(t=0;t<Tt.length;++t)for(r[Tt[t]]=[],s=0;s<a.length;++s)b(a[s][Tt[t]])&&r[Tt[t]].push(a[s][Tt[t]]);function n(h){return new pe(i.tagName(h).toLowerCase(),{},[],void 0,h)}function o(h,g){function w(){--w.listeners===0&&l(h)}return w.listeners=g,w}function l(h){var g=i.parentNode(h);b(g)&&i.removeChild(g,h)}function d(h,g,w,$,A,j,R){if(b(h.elm)&&b(j)&&(h=j[R]=Cr(h)),h.isRootInsert=!A,!c(h,g,w,$)){var E=h.data,M=h.children,L=h.tag;b(L)?(h.elm=h.ns?i.createElementNS(h.ns,L):i.createElement(L,h),_(h),p(h,M,g),b(E)&&f(h,g),y(w,h.elm,$)):Z(h.isComment)?(h.elm=i.createComment(h.text),y(w,h.elm,$)):(h.elm=i.createTextNode(h.text),y(w,h.elm,$))}}function c(h,g,w,$){var A=h.data;if(b(A)){var j=b(h.componentInstance)&&A.keepAlive;if(b(A=A.hook)&&b(A=A.init)&&A(h,!1),b(h.componentInstance))return u(h,g),y(w,h.elm,$),Z(j)&&v(h,g,w,$),!0}}function u(h,g){b(h.data.pendingInsert)&&(g.push.apply(g,h.data.pendingInsert),h.data.pendingInsert=null),h.elm=h.componentInstance.$el,m(h)?(f(h,g),_(h)):(gt(h),g.push(h))}function v(h,g,w,$){for(var A,j=h;j.componentInstance;)if(j=j.componentInstance._vnode,b(A=j.data)&&b(A=A.transition)){for(A=0;A<r.activate.length;++A)r.activate[A](Ue,j);g.push(j);break}y(w,h.elm,$)}function y(h,g,w){b(h)&&(b(w)?i.parentNode(w)===h&&i.insertBefore(h,g,w):i.appendChild(h,g))}function p(h,g,w){if(N(g))for(var $=0;$<g.length;++$)d(g[$],w,h.elm,null,!0,g,$);else qt(h.text)&&i.appendChild(h.elm,i.createTextNode(String(h.text)))}function m(h){for(;h.componentInstance;)h=h.componentInstance._vnode;return b(h.tag)}function f(h,g){for(var w=0;w<r.create.length;++w)r.create[w](Ue,h);t=h.data.hook,b(t)&&(b(t.create)&&t.create(Ue,h),b(t.insert)&&g.push(h))}function _(h){var g;if(b(g=h.fnScopeId))i.setStyleScope(h.elm,g);else for(var w=h;w;)b(g=w.context)&&b(g=g.$options._scopeId)&&i.setStyleScope(h.elm,g),w=w.parent;b(g=tt)&&g!==h.context&&g!==h.fnContext&&b(g=g.$options._scopeId)&&i.setStyleScope(h.elm,g)}function k(h,g,w,$,A,j){for(;$<=A;++$)d(w[$],j,h,g,!1,w,$)}function S(h){var g,w,$=h.data;if(b($))for(b(g=$.hook)&&b(g=g.destroy)&&g(h),g=0;g<r.destroy.length;++g)r.destroy[g](h);if(b(g=h.children))for(w=0;w<h.children.length;++w)S(h.children[w])}function C(h,g,w){for(;g<=w;++g){var $=h[g];b($)&&(b($.tag)?(P($),S($)):l($.elm))}}function P(h,g){if(b(g)||b(h.data)){var w,$=r.remove.length+1;for(b(g)?g.listeners+=$:g=o(h.elm,$),b(w=h.componentInstance)&&b(w=w._vnode)&&b(w.data)&&P(w,g),w=0;w<r.remove.length;++w)r.remove[w](h,g);b(w=h.data.hook)&&b(w=w.remove)?w(h,g):g()}else l(h.elm)}function F(h,g,w,$,A){for(var j=0,R=0,E=g.length-1,M=g[0],L=g[E],U=w.length-1,W=w[0],X=w[U],ke,Ee,Le,ti,ir=!A;j<=E&&R<=U;)O(M)?M=g[++j]:O(L)?L=g[--E]:Xe(M,W)?(z(M,W,$,w,R),M=g[++j],W=w[++R]):Xe(L,X)?(z(L,X,$,w,U),L=g[--E],X=w[--U]):Xe(M,X)?(z(M,X,$,w,U),ir&&i.insertBefore(h,M.elm,i.nextSibling(L.elm)),M=g[++j],X=w[--U]):Xe(L,W)?(z(L,W,$,w,R),ir&&i.insertBefore(h,L.elm,M.elm),L=g[--E],W=w[++R]):(O(ke)&&(ke=Eu(g,j,E)),Ee=b(W.key)?ke[W.key]:T(W,g,j,E),O(Ee)?d(W,$,h,M.elm,!1,w,R):(Le=g[Ee],Xe(Le,W)?(z(Le,W,$,w,R),g[Ee]=void 0,ir&&i.insertBefore(h,Le.elm,M.elm)):d(W,$,h,M.elm,!1,w,R)),W=w[++R]);j>E?(ti=O(w[U+1])?null:w[U+1].elm,k(h,ti,w,R,U,$)):R>U&&C(g,j,E)}function T(h,g,w,$){for(var A=w;A<$;A++){var j=g[A];if(b(j)&&Xe(h,j))return A}}function z(h,g,w,$,A,j){if(h!==g){b(g.elm)&&b($)&&(g=$[A]=Cr(g));var R=g.elm=h.elm;if(Z(h.isAsyncPlaceholder)){b(g.asyncFactory.resolved)?ne(h.elm,g,w):g.isAsyncPlaceholder=!0;return}if(Z(g.isStatic)&&Z(h.isStatic)&&g.key===h.key&&(Z(g.isCloned)||Z(g.isOnce))){g.componentInstance=h.componentInstance;return}var E,M=g.data;b(M)&&b(E=M.hook)&&b(E=E.prepatch)&&E(h,g);var L=h.children,U=g.children;if(b(M)&&m(g)){for(E=0;E<r.update.length;++E)r.update[E](h,g);b(E=M.hook)&&b(E=E.update)&&E(h,g)}O(g.text)?b(L)&&b(U)?L!==U&&F(R,L,U,w,j):b(U)?(b(h.text)&&i.setTextContent(R,""),k(R,null,U,0,U.length-1,w)):b(L)?C(L,0,L.length-1):b(h.text)&&i.setTextContent(R,""):h.text!==g.text&&i.setTextContent(R,g.text),b(M)&&b(E=M.hook)&&b(E=E.postpatch)&&E(h,g)}}function V(h,g,w){if(Z(w)&&b(h.parent))h.parent.data.pendingInsert=g;else for(var $=0;$<g.length;++$)g[$].data.hook.insert(g[$])}var K=Q("attrs,class,staticClass,staticStyle,key");function ne(h,g,w,$){var A,j=g.tag,R=g.data,E=g.children;if($=$||R&&R.pre,g.elm=h,Z(g.isComment)&&b(g.asyncFactory))return g.isAsyncPlaceholder=!0,!0;if(b(R)&&(b(A=R.hook)&&b(A=A.init)&&A(g,!0),b(A=g.componentInstance)))return u(g,w),!0;if(b(j)){if(b(E))if(!h.hasChildNodes())p(g,E,w);else if(b(A=R)&&b(A=A.domProps)&&b(A=A.innerHTML)){if(A!==h.innerHTML)return!1}else{for(var M=!0,L=h.firstChild,U=0;U<E.length;U++){if(!L||!ne(L,E[U],w,$)){M=!1;break}L=L.nextSibling}if(!M||L)return!1}if(b(R)){var W=!1;for(var X in R)if(!K(X)){W=!0,f(g,w);break}!W&&R.class&&Os(R.class)}}else h.data!==g.text&&(h.data=g.text);return!0}return function(g,w,$,A){if(O(w)){b(g)&&S(g);return}var j=!1,R=[];if(O(g))j=!0,d(w,R);else{var E=b(g.nodeType);if(!E&&Xe(g,w))z(g,w,R,null,null,A);else{if(E){if(g.nodeType===1&&g.hasAttribute(si)&&(g.removeAttribute(si),$=!0),Z($)&&ne(g,w,R))return V(w,R,!0),g;g=n(g)}var M=g.elm,L=i.parentNode(M);if(d(w,R,M._leaveCb?null:L,i.nextSibling(M)),b(w.parent))for(var U=w.parent,W=m(w);U;){for(var X=0;X<r.destroy.length;++X)r.destroy[X](U);if(U.elm=w.elm,W){for(var ke=0;ke<r.create.length;++ke)r.create[ke](Ue,U);var Ee=U.data.hook.insert;if(Ee.merged)for(var Le=1;Le<Ee.fns.length;Le++)Ee.fns[Le]()}else gt(U);U=U.parent}b(L)?C([g],0,0):b(g.tag)&&S(g)}}return V(w,R,j),w.elm}}var ju={create:lr,update:lr,destroy:function(t){lr(t,Ue)}};function lr(e,t){(e.data.directives||t.data.directives)&&Nu(e,t)}function Nu(e,t){var s=e===Ue,r=t===Ue,a=Ti(e.data.directives,e.context),i=Ti(t.data.directives,t.context),n=[],o=[],l,d,c;for(l in i)d=a[l],c=i[l],d?(c.oldValue=d.value,c.oldArg=d.arg,Pt(c,"update",t,e),c.def&&c.def.componentUpdated&&o.push(c)):(Pt(c,"bind",t,e),c.def&&c.def.inserted&&n.push(c));if(n.length){var u=function(){for(var v=0;v<n.length;v++)Pt(n[v],"inserted",t,e)};s?Ne(t,"insert",u):u()}if(o.length&&Ne(t,"postpatch",function(){for(var v=0;v<o.length;v++)Pt(o[v],"componentUpdated",t,e)}),!s)for(l in a)i[l]||Pt(a[l],"unbind",e,e,r)}var Uu=Object.create(null);function Ti(e,t){var s=Object.create(null);if(!e)return s;var r,a;for(r=0;r<e.length;r++){if(a=e[r],a.modifiers||(a.modifiers=Uu),s[Mu(a)]=a,t._setupState&&t._setupState.__sfc){var i=a.def||Ls(t,"_setupState","v-"+a.name);typeof i=="function"?a.def={bind:i,update:i}:a.def=i}a.def=a.def||Ls(t.$options,"directives",a.name)}return s}function Mu(e){return e.rawName||"".concat(e.name,".").concat(Object.keys(e.modifiers||{}).join("."))}function Pt(e,t,s,r,a){var i=e.def&&e.def[t];if(i)try{i(s.elm,e,s,r,a)}catch(n){nt(n,s.context,"directive ".concat(e.name," ").concat(t," hook"))}}var Iu=[Fu,ju];function Pi(e,t){var s=t.componentOptions;if(!(b(s)&&s.Ctor.options.inheritAttrs===!1)&&!(O(e.data.attrs)&&O(t.data.attrs))){var r,a,i,n=t.elm,o=e.data.attrs||{},l=t.data.attrs||{};(b(l.__ob__)||Z(l._v_attr_proxy))&&(l=t.data.attrs=B({},l));for(r in l)a=l[r],i=o[r],i!==a&&Di(n,r,a,t.data.pre);(qe||no)&&l.value!==o.value&&Di(n,"value",l.value);for(r in o)O(l[r])&&(Aa(r)?n.removeAttributeNS(Mr,Oo(r)):Fo(r)||n.removeAttribute(r))}}function Di(e,t,s,r){r||e.tagName.indexOf("-")>-1?Fi(e,t,s):cu(t)?js(s)?e.removeAttribute(t):(s=t==="allowfullscreen"&&e.tagName==="EMBED"?"true":t,e.setAttribute(t,s)):Fo(t)?e.setAttribute(t,du(t,s)):Aa(t)?js(s)?e.removeAttributeNS(Mr,Oo(t)):e.setAttributeNS(Mr,t,s):Fi(e,t,s)}function Fi(e,t,s){if(js(s))e.removeAttribute(t);else{if(qe&&!_t&&e.tagName==="TEXTAREA"&&t==="placeholder"&&s!==""&&!e.__ieph){var r=function(a){a.stopImmediatePropagation(),e.removeEventListener("input",r)};e.addEventListener("input",r),e.__ieph=!0}e.setAttribute(t,s)}}var Bu={create:Pi,update:Pi};function Oi(e,t){var s=t.elm,r=t.data,a=e.data;if(!(O(r.staticClass)&&O(r.class)&&(O(a)||O(a.staticClass)&&O(a.class)))){var i=uu(t),n=s._transitionClasses;b(n)&&(i=Ca(i,Ra(n))),i!==s._prevClass&&(s.setAttribute("class",i),s._prevClass=i)}}var zu={create:Oi,update:Oi},Hu=/[\w).+\-_$\]]/;function Fa(e){var t=!1,s=!1,r=!1,a=!1,i=0,n=0,o=0,l=0,d,c,u,v,y;for(u=0;u<e.length;u++)if(c=d,d=e.charCodeAt(u),t)d===39&&c!==92&&(t=!1);else if(s)d===34&&c!==92&&(s=!1);else if(r)d===96&&c!==92&&(r=!1);else if(a)d===47&&c!==92&&(a=!1);else if(d===124&&e.charCodeAt(u+1)!==124&&e.charCodeAt(u-1)!==124&&!i&&!n&&!o)v===void 0?(l=u+1,v=e.slice(0,u).trim()):f();else{switch(d){case 34:s=!0;break;case 39:t=!0;break;case 96:r=!0;break;case 40:o++;break;case 41:o--;break;case 91:n++;break;case 93:n--;break;case 123:i++;break;case 125:i--;break}if(d===47){for(var p=u-1,m=void 0;p>=0&&(m=e.charAt(p),m===" ");p--);(!m||!Hu.test(m))&&(a=!0)}}v===void 0?v=e.slice(0,u).trim():l!==0&&f();function f(){(y||(y=[])).push(e.slice(l,u).trim()),l=u+1}if(y)for(u=0;u<y.length;u++)v=qu(v,y[u]);return v}function qu(e,t){var s=t.indexOf("(");if(s<0)return'_f("'.concat(t,'")(').concat(e,")");var r=t.slice(0,s),a=t.slice(s+1);return'_f("'.concat(r,'")(').concat(e).concat(a!==")"?","+a:a)}function Gs(e,t){console.error("[Vue compiler]: ".concat(e))}function Nt(e,t){return e?e.map(function(s){return s[t]}).filter(function(s){return s}):[]}function lt(e,t,s,r,a){(e.props||(e.props=[])).push(Zt({name:t,value:s,dynamic:a},r)),e.plain=!1}function Br(e,t,s,r,a){var i=a?e.dynamicAttrs||(e.dynamicAttrs=[]):e.attrs||(e.attrs=[]);i.push(Zt({name:t,value:s,dynamic:a},r)),e.plain=!1}function dr(e,t,s,r){e.attrsMap[t]=s,e.attrsList.push(Zt({name:t,value:s},r))}function Wu(e,t,s,r,a,i,n,o){(e.directives||(e.directives=[])).push(Zt({name:t,rawName:s,value:r,arg:a,isDynamicArg:i,modifiers:n},o)),e.plain=!1}function cr(e,t,s){return s?"_p(".concat(t,',"').concat(e,'")'):e+t}function Pe(e,t,s,r,a,i,n,o){r=r||se,r.right?o?t="(".concat(t,")==='click'?'contextmenu':(").concat(t,")"):t==="click"&&(t="contextmenu",delete r.right):r.middle&&(o?t="(".concat(t,")==='click'?'mouseup':(").concat(t,")"):t==="click"&&(t="mouseup")),r.capture&&(delete r.capture,t=cr("!",t,o)),r.once&&(delete r.once,t=cr("~",t,o)),r.passive&&(delete r.passive,t=cr("&",t,o));var l;r.native?(delete r.native,l=e.nativeEvents||(e.nativeEvents={})):l=e.events||(e.events={});var d=Zt({value:s.trim(),dynamic:o},n);r!==se&&(d.modifiers=r);var c=l[t];Array.isArray(c)?a?c.unshift(d):c.push(d):c?l[t]=a?[d,c]:[c,d]:l[t]=d,e.plain=!1}function Zu(e,t){return e.rawAttrsMap[":"+t]||e.rawAttrsMap["v-bind:"+t]||e.rawAttrsMap[t]}function ge(e,t,s){var r=Y(e,":"+t)||Y(e,"v-bind:"+t);if(r!=null)return Fa(r);if(s!==!1){var a=Y(e,t);if(a!=null)return JSON.stringify(a)}}function Y(e,t,s){var r;if((r=e.attrsMap[t])!=null){for(var a=e.attrsList,i=0,n=a.length;i<n;i++)if(a[i].name===t){a.splice(i,1);break}}return s&&delete e.attrsMap[t],r}function Ei(e,t){for(var s=e.attrsList,r=0,a=s.length;r<a;r++){var i=s[r];if(t.test(i.name))return s.splice(r,1),i}}function Zt(e,t){return t&&(t.start!=null&&(e.start=t.start),t.end!=null&&(e.end=t.end)),e}function Li(e,t,s){var r=s||{},a=r.number,i=r.trim,n="$$v",o=n;i&&(o="(typeof ".concat(n," === 'string'")+"? ".concat(n,".trim()")+": ".concat(n,")")),a&&(o="_n(".concat(o,")"));var l=Ie(t,o);e.model={value:"(".concat(t,")"),expression:JSON.stringify(t),callback:"function (".concat(n,") {").concat(l,"}")}}function Ie(e,t){var s=Ku(e);return s.key===null?"".concat(e,"=").concat(t):"$set(".concat(s.exp,", ").concat(s.key,", ").concat(t,")")}var zr,Lo,Dt,Re,ps,Hr;function Ku(e){if(e=e.trim(),zr=e.length,e.indexOf("[")<0||e.lastIndexOf("]")<zr-1)return Re=e.lastIndexOf("."),Re>-1?{exp:e.slice(0,Re),key:'"'+e.slice(Re+1)+'"'}:{exp:e,key:null};for(Lo=e,Re=ps=Hr=0;!Ea();)Dt=Oa(),jo(Dt)?No(Dt):Dt===91&&Yu(Dt);return{exp:e.slice(0,ps),key:e.slice(ps+1,Hr)}}function Oa(){return Lo.charCodeAt(++Re)}function Ea(){return Re>=zr}function jo(e){return e===34||e===39}function Yu(e){var t=1;for(ps=Re;!Ea();){if(e=Oa(),jo(e)){No(e);continue}if(e===91&&t++,e===93&&t--,t===0){Hr=Re;break}}}function No(e){for(var t=e;!Ea()&&(e=Oa(),e!==t););}var fs="__r",ur="__c";function Gu(e,t,s){var r=t.value,a=t.modifiers,i=e.tag,n=e.attrsMap.type;if(e.component)return Li(e,r,a),!1;if(i==="select")Xu(e,r,a);else if(i==="input"&&n==="checkbox")Ju(e,r,a);else if(i==="input"&&n==="radio")Vu(e,r,a);else if(i==="input"||i==="textarea")Qu(e,r,a);else if(!ce.isReservedTag(i))return Li(e,r,a),!1;return!0}function Ju(e,t,s){var r=s&&s.number,a=ge(e,"value")||"null",i=ge(e,"true-value")||"true",n=ge(e,"false-value")||"false";lt(e,"checked","Array.isArray(".concat(t,")")+"?_i(".concat(t,",").concat(a,")>-1")+(i==="true"?":(".concat(t,")"):":_q(".concat(t,",").concat(i,")"))),Pe(e,"change","var $$a=".concat(t,",")+"$$el=$event.target,"+"$$c=$$el.checked?(".concat(i,"):(").concat(n,");")+"if(Array.isArray($$a)){"+"var $$v=".concat(r?"_n("+a+")":a,",")+"$$i=_i($$a,$$v);"+"if($$el.checked){$$i<0&&(".concat(Ie(t,"$$a.concat([$$v])"),")}")+"else{$$i>-1&&(".concat(Ie(t,"$$a.slice(0,$$i).concat($$a.slice($$i+1))"),")}")+"}else{".concat(Ie(t,"$$c"),"}"),null,!0)}function Vu(e,t,s){var r=s&&s.number,a=ge(e,"value")||"null";a=r?"_n(".concat(a,")"):a,lt(e,"checked","_q(".concat(t,",").concat(a,")")),Pe(e,"change",Ie(t,a),null,!0)}function Xu(e,t,s){var r=s&&s.number,a='Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;'+"return ".concat(r?"_n(val)":"val","})"),i="$event.target.multiple ? $$selectedVal : $$selectedVal[0]",n="var $$selectedVal = ".concat(a,";");n="".concat(n," ").concat(Ie(t,i)),Pe(e,"change",n,null,!0)}function Qu(e,t,s){var r=e.attrsMap.type,a=s||{},i=a.lazy,n=a.number,o=a.trim,l=!i&&r!=="range",d=i?"change":r==="range"?fs:"input",c="$event.target.value";o&&(c="$event.target.value.trim()"),n&&(c="_n(".concat(c,")"));var u=Ie(t,c);l&&(u="if($event.target.composing)return;".concat(u)),lt(e,"value","(".concat(t,")")),Pe(e,d,u,null,!0),(o||n)&&Pe(e,"blur","$forceUpdate()")}function ep(e){if(b(e[fs])){var t=qe?"change":"input";e[t]=[].concat(e[fs],e[t]||[]),delete e[fs]}b(e[ur])&&(e.change=[].concat(e[ur],e.change||[]),delete e[ur])}var Ht;function tp(e,t,s){var r=Ht;return function a(){var i=t.apply(null,arguments);i!==null&&Uo(e,a,s,r)}}var sp=Or&&!(ri&&Number(ri[1])<=53);function rp(e,t,s,r){if(sp){var a=Co,i=t;t=i._wrapper=function(n){if(n.target===n.currentTarget||n.timeStamp>=a||n.timeStamp<=0||n.target.ownerDocument!==document)return i.apply(this,arguments)}}Ht.addEventListener(e,t,oo?{capture:s,passive:r}:s)}function Uo(e,t,s,r){(r||Ht).removeEventListener(e,t._wrapper||t,s)}function pr(e,t){if(!(O(e.data.on)&&O(t.data.on))){var s=t.data.on||{},r=e.data.on||{};Ht=t.elm||e.elm,ep(s),mo(s,r,rp,Uo,tp,t.context),Ht=void 0}}var ap={create:pr,update:pr,destroy:function(e){return pr(e,Ue)}},rs;function ji(e,t){if(!(O(e.data.domProps)&&O(t.data.domProps))){var s,r,a=t.elm,i=e.data.domProps||{},n=t.data.domProps||{};(b(n.__ob__)||Z(n._v_attr_proxy))&&(n=t.data.domProps=B({},n));for(s in i)s in n||(a[s]="");for(s in n){if(r=n[s],s==="textContent"||s==="innerHTML"){if(t.children&&(t.children.length=0),r===i[s])continue;a.childNodes.length===1&&a.removeChild(a.childNodes[0])}if(s==="value"&&a.tagName!=="PROGRESS"){a._value=r;var o=O(r)?"":String(r);ip(a,o)&&(a.value=o)}else if(s==="innerHTML"&&Ta(a.tagName)&&O(a.innerHTML)){rs=rs||document.createElement("div"),rs.innerHTML="<svg>".concat(r,"</svg>");for(var l=rs.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;l.firstChild;)a.appendChild(l.firstChild)}else if(r!==i[s])try{a[s]=r}catch{}}}}function ip(e,t){return!e.composing&&(e.tagName==="OPTION"||np(e,t)||op(e,t))}function np(e,t){var s=!0;try{s=document.activeElement!==e}catch{}return s&&e.value!==t}function op(e,t){var s=e.value,r=e._vModifiers;if(b(r)){if(r.number)return Ut(s)!==Ut(t);if(r.trim)return s.trim()!==t.trim()}return s!==t}var lp={create:ji,update:ji},Mo=ye(function(e){var t={},s=/;(?![^(]*\))/g,r=/:(.+)/;return e.split(s).forEach(function(a){if(a){var i=a.split(r);i.length>1&&(t[i[0].trim()]=i[1].trim())}}),t});function fr(e){var t=Io(e.style);return e.staticStyle?B(e.staticStyle,t):t}function Io(e){return Array.isArray(e)?eo(e):typeof e=="string"?Mo(e):e}function dp(e,t){var s={},r;if(t)for(var a=e;a.componentInstance;)a=a.componentInstance._vnode,a&&a.data&&(r=fr(a.data))&&B(s,r);(r=fr(e.data))&&B(s,r);for(var i=e;i=i.parent;)i.data&&(r=fr(i.data))&&B(s,r);return s}var cp=/^--/,Ni=/\s*!important$/,Ui=function(e,t,s){if(cp.test(t))e.style.setProperty(t,s);else if(Ni.test(s))e.style.setProperty(rt(t),s.replace(Ni,""),"important");else{var r=up(t);if(Array.isArray(s))for(var a=0,i=s.length;a<i;a++)e.style[r]=s[a];else e.style[r]=s}},Mi=["Webkit","Moz","ms"],as,up=ye(function(e){if(as=as||document.createElement("div").style,e=de(e),e!=="filter"&&e in as)return e;for(var t=e.charAt(0).toUpperCase()+e.slice(1),s=0;s<Mi.length;s++){var r=Mi[s]+t;if(r in as)return r}});function Ii(e,t){var s=t.data,r=e.data;if(!(O(s.staticStyle)&&O(s.style)&&O(r.staticStyle)&&O(r.style))){var a,i,n=t.elm,o=r.staticStyle,l=r.normalizedStyle||r.style||{},d=o||l,c=Io(t.data.style)||{};t.data.normalizedStyle=b(c.__ob__)?B({},c):c;var u=dp(t,!0);for(i in d)O(u[i])&&Ui(n,i,"");for(i in u)a=u[i],a!==d[i]&&Ui(n,i,a??"")}}var pp={create:Ii,update:Ii},Bo=/\s+/;function zo(e,t){if(!(!t||!(t=t.trim())))if(e.classList)t.indexOf(" ")>-1?t.split(Bo).forEach(function(r){return e.classList.add(r)}):e.classList.add(t);else{var s=" ".concat(e.getAttribute("class")||""," ");s.indexOf(" "+t+" ")<0&&e.setAttribute("class",(s+t).trim())}}function Ho(e,t){if(!(!t||!(t=t.trim())))if(e.classList)t.indexOf(" ")>-1?t.split(Bo).forEach(function(a){return e.classList.remove(a)}):e.classList.remove(t),e.classList.length||e.removeAttribute("class");else{for(var s=" ".concat(e.getAttribute("class")||""," "),r=" "+t+" ";s.indexOf(r)>=0;)s=s.replace(r," ");s=s.trim(),s?e.setAttribute("class",s):e.removeAttribute("class")}}function qo(e){if(e){if(typeof e=="object"){var t={};return e.css!==!1&&B(t,Bi(e.name||"v")),B(t,e),t}else if(typeof e=="string")return Bi(e)}}var Bi=ye(function(e){return{enterClass:"".concat(e,"-enter"),enterToClass:"".concat(e,"-enter-to"),enterActiveClass:"".concat(e,"-enter-active"),leaveClass:"".concat(e,"-leave"),leaveToClass:"".concat(e,"-leave-to"),leaveActiveClass:"".concat(e,"-leave-active")}}),Wo=ae&&!_t,pt="transition",mr="animation",ms="transition",Ns="transitionend",qr="animation",Zo="animationend";Wo&&(window.ontransitionend===void 0&&window.onwebkittransitionend!==void 0&&(ms="WebkitTransition",Ns="webkitTransitionEnd"),window.onanimationend===void 0&&window.onwebkitanimationend!==void 0&&(qr="WebkitAnimation",Zo="webkitAnimationEnd"));var zi=ae?window.requestAnimationFrame?window.requestAnimationFrame.bind(window):setTimeout:function(e){return e()};function Ko(e){zi(function(){zi(e)})}function st(e,t){var s=e._transitionClasses||(e._transitionClasses=[]);s.indexOf(t)<0&&(s.push(t),zo(e,t))}function De(e,t){e._transitionClasses&&Ge(e._transitionClasses,t),Ho(e,t)}function Yo(e,t,s){var r=Go(e,t),a=r.type,i=r.timeout,n=r.propCount;if(!a)return s();var o=a===pt?Ns:Zo,l=0,d=function(){e.removeEventListener(o,c),s()},c=function(u){u.target===e&&++l>=n&&d()};setTimeout(function(){l<n&&d()},i+1),e.addEventListener(o,c)}var fp=/\b(transform|all)(,|$)/;function Go(e,t){var s=window.getComputedStyle(e),r=(s[ms+"Delay"]||"").split(", "),a=(s[ms+"Duration"]||"").split(", "),i=Hi(r,a),n=(s[qr+"Delay"]||"").split(", "),o=(s[qr+"Duration"]||"").split(", "),l=Hi(n,o),d,c=0,u=0;t===pt?i>0&&(d=pt,c=i,u=a.length):t===mr?l>0&&(d=mr,c=l,u=o.length):(c=Math.max(i,l),d=c>0?i>l?pt:mr:null,u=d?d===pt?a.length:o.length:0);var v=d===pt&&fp.test(s[ms+"Property"]);return{type:d,timeout:c,propCount:u,hasTransform:v}}function Hi(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max.apply(null,t.map(function(s,r){return qi(s)+qi(e[r])}))}function qi(e){return Number(e.slice(0,-1).replace(",","."))*1e3}function Wr(e,t){var s=e.elm;b(s._leaveCb)&&(s._leaveCb.cancelled=!0,s._leaveCb());var r=qo(e.data.transition);if(!O(r)&&!(b(s._enterCb)||s.nodeType!==1)){for(var a=r.css,i=r.type,n=r.enterClass,o=r.enterToClass,l=r.enterActiveClass,d=r.appearClass,c=r.appearToClass,u=r.appearActiveClass,v=r.beforeEnter,y=r.enter,p=r.afterEnter,m=r.enterCancelled,f=r.beforeAppear,_=r.appear,k=r.afterAppear,S=r.appearCancelled,C=r.duration,P=tt,F=tt.$vnode;F&&F.parent;)P=F.context,F=F.parent;var T=!P._isMounted||!e.isRootInsert;if(!(T&&!_&&_!=="")){var z=T&&d?d:n,V=T&&u?u:l,K=T&&c?c:o,ne=T&&f||v,h=T&&q(_)?_:y,g=T&&k||p,w=T&&S||m,$=Ut(te(C)?C.enter:C),A=a!==!1&&!_t,j=La(h),R=s._enterCb=Cs(function(){A&&(De(s,K),De(s,V)),R.cancelled?(A&&De(s,z),w&&w(s)):g&&g(s),s._enterCb=null});e.data.show||Ne(e,"insert",function(){var E=s.parentNode,M=E&&E._pending&&E._pending[e.key];M&&M.tag===e.tag&&M.elm._leaveCb&&M.elm._leaveCb(),h&&h(s,R)}),ne&&ne(s),A&&(st(s,z),st(s,V),Ko(function(){De(s,z),R.cancelled||(st(s,K),j||(Vo($)?setTimeout(R,$):Yo(s,i,R)))})),e.data.show&&(t&&t(),h&&h(s,R)),!A&&!j&&R()}}}function Jo(e,t){var s=e.elm;b(s._enterCb)&&(s._enterCb.cancelled=!0,s._enterCb());var r=qo(e.data.transition);if(O(r)||s.nodeType!==1)return t();if(b(s._leaveCb))return;var a=r.css,i=r.type,n=r.leaveClass,o=r.leaveToClass,l=r.leaveActiveClass,d=r.beforeLeave,c=r.leave,u=r.afterLeave,v=r.leaveCancelled,y=r.delayLeave,p=r.duration,m=a!==!1&&!_t,f=La(c),_=Ut(te(p)?p.leave:p),k=s._leaveCb=Cs(function(){s.parentNode&&s.parentNode._pending&&(s.parentNode._pending[e.key]=null),m&&(De(s,o),De(s,l)),k.cancelled?(m&&De(s,n),v&&v(s)):(t(),u&&u(s)),s._leaveCb=null});y?y(S):S();function S(){k.cancelled||(!e.data.show&&s.parentNode&&((s.parentNode._pending||(s.parentNode._pending={}))[e.key]=e),d&&d(s),m&&(st(s,n),st(s,l),Ko(function(){De(s,n),k.cancelled||(st(s,o),f||(Vo(_)?setTimeout(k,_):Yo(s,i,k)))})),c&&c(s,k),!m&&!f&&k())}}function Vo(e){return typeof e=="number"&&!isNaN(e)}function La(e){if(O(e))return!1;var t=e.fns;return b(t)?La(Array.isArray(t)?t[0]:t):(e._length||e.length)>1}function Wi(e,t){t.data.show!==!0&&Wr(t)}var mp=ae?{create:Wi,activate:Wi,remove:function(e,t){e.data.show!==!0?Jo(e,t):t()}}:{},gp=[Bu,zu,ap,lp,pp,mp],hp=gp.concat(Iu),vp=Lu({nodeOps:Du,modules:hp});_t&&document.addEventListener("selectionchange",function(){var e=document.activeElement;e&&e.vmodel&&ja(e,"input")});var Xo={inserted:function(e,t,s,r){s.tag==="select"?(r.elm&&!r.elm._vOptions?Ne(s,"postpatch",function(){Xo.componentUpdated(e,t,s)}):Zi(e,t,s.context),e._vOptions=[].map.call(e.options,Us)):(s.tag==="textarea"||Ir(e.type))&&(e._vModifiers=t.modifiers,t.modifiers.lazy||(e.addEventListener("compositionstart",xp),e.addEventListener("compositionend",Gi),e.addEventListener("change",Gi),_t&&(e.vmodel=!0)))},componentUpdated:function(e,t,s){if(s.tag==="select"){Zi(e,t,s.context);var r=e._vOptions,a=e._vOptions=[].map.call(e.options,Us);if(a.some(function(n,o){return!at(n,r[o])})){var i=e.multiple?t.value.some(function(n){return Yi(n,a)}):t.value!==t.oldValue&&Yi(t.value,a);i&&ja(e,"change")}}}};function Zi(e,t,s){Ki(e,t),(qe||no)&&setTimeout(function(){Ki(e,t)},0)}function Ki(e,t,s){var r=t.value,a=e.multiple;if(!(a&&!Array.isArray(r))){for(var i,n,o=0,l=e.options.length;o<l;o++)if(n=e.options[o],a)i=so(r,Us(n))>-1,n.selected!==i&&(n.selected=i);else if(at(Us(n),r)){e.selectedIndex!==o&&(e.selectedIndex=o);return}a||(e.selectedIndex=-1)}}function Yi(e,t){return t.every(function(s){return!at(s,e)})}function Us(e){return"_value"in e?e._value:e.value}function xp(e){e.target.composing=!0}function Gi(e){e.target.composing&&(e.target.composing=!1,ja(e.target,"input"))}function ja(e,t){var s=document.createEvent("HTMLEvents");s.initEvent(t,!0,!0),e.dispatchEvent(s)}function Zr(e){return e.componentInstance&&(!e.data||!e.data.transition)?Zr(e.componentInstance._vnode):e}var bp={bind:function(e,t,s){var r=t.value;s=Zr(s);var a=s.data&&s.data.transition,i=e.__vOriginalDisplay=e.style.display==="none"?"":e.style.display;r&&a?(s.data.show=!0,Wr(s,function(){e.style.display=i})):e.style.display=r?i:"none"},update:function(e,t,s){var r=t.value,a=t.oldValue;if(!r!=!a){s=Zr(s);var i=s.data&&s.data.transition;i?(s.data.show=!0,r?Wr(s,function(){e.style.display=e.__vOriginalDisplay}):Jo(s,function(){e.style.display="none"})):e.style.display=r?e.__vOriginalDisplay:"none"}},unbind:function(e,t,s,r,a){a||(e.style.display=e.__vOriginalDisplay)}},yp={model:Xo,show:bp},Qo={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterToClass:String,leaveToClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String,appearToClass:String,duration:[Number,String,Object]};function Kr(e){var t=e&&e.componentOptions;return t&&t.Ctor.options.abstract?Kr(_o(t.children)):e}function el(e){var t={},s=e.$options;for(var r in s.propsData)t[r]=e[r];var a=s._parentListeners;for(var r in a)t[de(r)]=a[r];return t}function Ji(e,t){if(/\d-keep-alive$/.test(t.tag))return e("keep-alive",{props:t.componentOptions.propsData})}function wp(e){for(;e=e.parent;)if(e.data.transition)return!0}function _p(e,t){return t.key===e.key&&t.tag===e.tag}var kp=function(e){return e.tag||It(e)},Sp=function(e){return e.name==="show"},$p={name:"transition",props:Qo,abstract:!0,render:function(e){var t=this,s=this.$slots.default;if(s&&(s=s.filter(kp),!!s.length)){var r=this.mode,a=s[0];if(wp(this.$vnode))return a;var i=Kr(a);if(!i)return a;if(this._leaving)return Ji(e,a);var n="__transition-".concat(this._uid,"-");i.key=i.key==null?i.isComment?n+"comment":n+i.tag:qt(i.key)?String(i.key).indexOf(n)===0?i.key:n+i.key:i.key;var o=(i.data||(i.data={})).transition=el(this),l=this._vnode,d=Kr(l);if(i.data.directives&&i.data.directives.some(Sp)&&(i.data.show=!0),d&&d.data&&!_p(i,d)&&!It(d)&&!(d.componentInstance&&d.componentInstance._vnode.isComment)){var c=d.data.transition=B({},o);if(r==="out-in")return this._leaving=!0,Ne(c,"afterLeave",function(){t._leaving=!1,t.$forceUpdate()}),Ji(e,a);if(r==="in-out"){if(It(i))return l;var u,v=function(){u()};Ne(o,"afterEnter",v),Ne(o,"enterCancelled",v),Ne(c,"delayLeave",function(y){u=y})}}return a}}},tl=B({tag:String,moveClass:String},Qo);delete tl.mode;var Ap={props:tl,beforeMount:function(){var e=this,t=this._update;this._update=function(s,r){var a=So(e);e.__patch__(e._vnode,e.kept,!1,!0),e._vnode=e.kept,a(),t.call(e,s,r)}},render:function(e){for(var t=this.tag||this.$vnode.data.tag||"span",s=Object.create(null),r=this.prevChildren=this.children,a=this.$slots.default||[],i=this.children=[],n=el(this),o=0;o<a.length;o++){var l=a[o];l.tag&&l.key!=null&&String(l.key).indexOf("__vlist")!==0&&(i.push(l),s[l.key]=l,(l.data||(l.data={})).transition=n)}if(r){for(var d=[],c=[],o=0;o<r.length;o++){var l=r[o];l.data.transition=n,l.data.pos=l.elm.getBoundingClientRect(),s[l.key]?d.push(l):c.push(l)}this.kept=e(t,null,d),this.removed=c}return e(t,null,i)},updated:function(){var e=this.prevChildren,t=this.moveClass||(this.name||"v")+"-move";!e.length||!this.hasMove(e[0].elm,t)||(e.forEach(Cp),e.forEach(Rp),e.forEach(Tp),this._reflow=document.body.offsetHeight,e.forEach(function(s){if(s.data.moved){var r=s.elm,a=r.style;st(r,t),a.transform=a.WebkitTransform=a.transitionDuration="",r.addEventListener(Ns,r._moveCb=function i(n){n&&n.target!==r||(!n||/transform$/.test(n.propertyName))&&(r.removeEventListener(Ns,i),r._moveCb=null,De(r,t))})}}))},methods:{hasMove:function(e,t){if(!Wo)return!1;if(this._hasMove)return this._hasMove;var s=e.cloneNode();e._transitionClasses&&e._transitionClasses.forEach(function(a){Ho(s,a)}),zo(s,t),s.style.display="none",this.$el.appendChild(s);var r=Go(s);return this.$el.removeChild(s),this._hasMove=r.hasTransform}}};function Cp(e){e.elm._moveCb&&e.elm._moveCb(),e.elm._enterCb&&e.elm._enterCb()}function Rp(e){e.data.newPos=e.elm.getBoundingClientRect()}function Tp(e){var t=e.data.pos,s=e.data.newPos,r=t.left-s.left,a=t.top-s.top;if(r||a){e.data.moved=!0;var i=e.elm.style;i.transform=i.WebkitTransform="translate(".concat(r,"px,").concat(a,"px)"),i.transitionDuration="0s"}}var Pp={Transition:$p,TransitionGroup:Ap};D.config.mustUseProp=Do;D.config.isReservedTag=Pa;D.config.isReservedAttr=nu;D.config.getTagNamespace=Eo;D.config.isUnknownElement=xu;B(D.options.directives,yp);B(D.options.components,Pp);D.prototype.__patch__=ae?vp:G;D.prototype.$mount=function(e,t){return e=e&&ae?Da(e):void 0,nc(this,e,t)};ae&&setTimeout(function(){ce.devtools&&Rs&&Rs.emit("init",D)},0);var Dp=/\{\{((?:.|\r?\n)+?)\}\}/g,Vi=/[-.*+?^${}()|[\]\/\\]/g,Fp=ye(function(e){var t=e[0].replace(Vi,"\\$&"),s=e[1].replace(Vi,"\\$&");return new RegExp(t+"((?:.|\\n)+?)"+s,"g")});function Op(e,t){var s=t?Fp(t):Dp;if(s.test(e)){for(var r=[],a=[],i=s.lastIndex=0,n,o,l;n=s.exec(e);){o=n.index,o>i&&(a.push(l=e.slice(i,o)),r.push(JSON.stringify(l)));var d=Fa(n[1].trim());r.push("_s(".concat(d,")")),a.push({"@binding":d}),i=o+n[0].length}return i<e.length&&(a.push(l=e.slice(i)),r.push(JSON.stringify(l))),{expression:r.join("+"),tokens:a}}}function Ep(e,t){t.warn;var s=Y(e,"class");s&&(e.staticClass=JSON.stringify(s.replace(/\s+/g," ").trim()));var r=ge(e,"class",!1);r&&(e.classBinding=r)}function Lp(e){var t="";return e.staticClass&&(t+="staticClass:".concat(e.staticClass,",")),e.classBinding&&(t+="class:".concat(e.classBinding,",")),t}var jp={staticKeys:["staticClass"],transformNode:Ep,genData:Lp};function Np(e,t){t.warn;var s=Y(e,"style");s&&(e.staticStyle=JSON.stringify(Mo(s)));var r=ge(e,"style",!1);r&&(e.styleBinding=r)}function Up(e){var t="";return e.staticStyle&&(t+="staticStyle:".concat(e.staticStyle,",")),e.styleBinding&&(t+="style:(".concat(e.styleBinding,"),")),t}var Mp={staticKeys:["staticStyle"],transformNode:Np,genData:Up},is,Ip={decode:function(e){return is=is||document.createElement("div"),is.innerHTML=e,is.textContent}},Bp=Q("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),zp=Q("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),Hp=Q("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),qp=/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,Wp=/^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,Xi="[a-zA-Z_][\\-\\.0-9_a-zA-Z".concat(ao.source,"]*"),sl="((?:".concat(Xi,"\\:)?").concat(Xi,")"),Qi=new RegExp("^<".concat(sl)),Zp=/^\s*(\/?)>/,en=new RegExp("^<\\/".concat(sl,"[^>]*>")),Kp=/^<!DOCTYPE [^>]+>/i,tn=/^<!\--/,sn=/^<!\[/,rn=Q("script,style,textarea",!0),an={},Yp={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":`
`,"&#9;":"	","&#39;":"'"},Gp=/&(?:lt|gt|quot|amp|#39);/g,Jp=/&(?:lt|gt|quot|amp|#39|#10|#9);/g,Vp=Q("pre,textarea",!0),nn=function(e,t){return e&&Vp(e)&&t[0]===`
`};function Xp(e,t){var s=t?Jp:Gp;return e.replace(s,function(r){return Yp[r]})}function Qp(e,t){for(var s=[],r=t.expectHTML,a=t.isUnaryTag||me,i=t.canBeLeftOpenTag||me,n=0,o,l,d=function(){if(o=e,!l||!rn(l)){var m=e.indexOf("<");if(m===0){if(tn.test(e)){var f=e.indexOf("-->");if(f>=0)return t.shouldKeepComment&&t.comment&&t.comment(e.substring(4,f),n,n+f+3),u(f+3),"continue"}if(sn.test(e)){var _=e.indexOf("]>");if(_>=0)return u(_+2),"continue"}var k=e.match(Kp);if(k)return u(k[0].length),"continue";var S=e.match(en);if(S){var C=n;return u(S[0].length),p(S[1],C,n),"continue"}var P=v();if(P)return y(P),nn(P.tagName,e)&&u(1),"continue"}var F=void 0,T=void 0,z=void 0;if(m>=0){for(T=e.slice(m);!en.test(T)&&!Qi.test(T)&&!tn.test(T)&&!sn.test(T)&&(z=T.indexOf("<",1),!(z<0));)m+=z,T=e.slice(m);F=e.substring(0,m)}m<0&&(F=e),F&&u(F.length),t.chars&&F&&t.chars(F,n-F.length,n)}else{var V=0,K=l.toLowerCase(),ne=an[K]||(an[K]=new RegExp("([\\s\\S]*?)(</"+K+"[^>]*>)","i")),T=e.replace(ne,function(g,w,$){return V=$.length,!rn(K)&&K!=="noscript"&&(w=w.replace(/<!\--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")),nn(K,w)&&(w=w.slice(1)),t.chars&&t.chars(w),""});n+=e.length-T.length,e=T,p(K,n-V,n)}if(e===o)return t.chars&&t.chars(e),"break"};e;){var c=d();if(c==="break")break}p();function u(m){n+=m,e=e.substring(m)}function v(){var m=e.match(Qi);if(m){var f={tagName:m[1],attrs:[],start:n};u(m[0].length);for(var _=void 0,k=void 0;!(_=e.match(Zp))&&(k=e.match(Wp)||e.match(qp));)k.start=n,u(k[0].length),k.end=n,f.attrs.push(k);if(_)return f.unarySlash=_[1],u(_[0].length),f.end=n,f}}function y(m){var f=m.tagName,_=m.unarySlash;r&&(l==="p"&&Hp(f)&&p(l),i(f)&&l===f&&p(f));for(var k=a(f)||!!_,S=m.attrs.length,C=new Array(S),P=0;P<S;P++){var F=m.attrs[P],T=F[3]||F[4]||F[5]||"",z=f==="a"&&F[1]==="href"?t.shouldDecodeNewlinesForHref:t.shouldDecodeNewlines;C[P]={name:F[1],value:Xp(T,z)}}k||(s.push({tag:f,lowerCasedTag:f.toLowerCase(),attrs:C,start:m.start,end:m.end}),l=f),t.start&&t.start(f,C,k,m.start,m.end)}function p(m,f,_){var k,S;if(f==null&&(f=n),_==null&&(_=n),m)for(S=m.toLowerCase(),k=s.length-1;k>=0&&s[k].lowerCasedTag!==S;k--);else k=0;if(k>=0){for(var C=s.length-1;C>=k;C--)t.end&&t.end(s[C].tag,f,_);s.length=k,l=k&&s[k-1].tag}else S==="br"?t.start&&t.start(m,[],!0,f,_):S==="p"&&(t.start&&t.start(m,[],!1,f,_),t.end&&t.end(m,f,_))}}var on=/^@|^v-on:/,gr=/^v-|^@|^:|^#/,ef=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,ln=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,tf=/^\(|\)$/g,gs=/^\[.*\]$/,sf=/:(.*)$/,dn=/^:|^\.|^v-bind:/,rl=/\.[^.\]]+(?=[^\]]*$)/g,Yr=/^v-slot(:|$)|^#/,rf=/[\r\n]/,af=/[ \f\t\r\n]+/g,nf=ye(Ip.decode),Ms="_empty_",ht,cn,Gr,hr,vr,xr,Jr,un;function Na(e,t,s){return{type:1,tag:e,attrsList:t,attrsMap:kf(t),rawAttrsMap:{},parent:s,children:[]}}function of(e,t){ht=t.warn||Gs,xr=t.isPreTag||me,Jr=t.mustUseProp||me,un=t.getTagNamespace||me,t.isReservedTag,Gr=Nt(t.modules,"transformNode"),hr=Nt(t.modules,"preTransformNode"),vr=Nt(t.modules,"postTransformNode"),cn=t.delimiters;var s=[],r=t.preserveWhitespace!==!1,a=t.whitespace,i,n,o=!1,l=!1;function d(u){if(c(u),!o&&!u.processed&&(u=hs(u,t)),!s.length&&u!==i&&i.if&&(u.elseif||u.else)&&xt(i,{exp:u.elseif,block:u}),n&&!u.forbidden)if(u.elseif||u.else)mf(u,n);else{if(u.slotScope){var v=u.slotTarget||'"default"';(n.scopedSlots||(n.scopedSlots={}))[v]=u}n.children.push(u),u.parent=n}u.children=u.children.filter(function(p){return!p.slotScope}),c(u),u.pre&&(o=!1),xr(u.tag)&&(l=!1);for(var y=0;y<vr.length;y++)vr[y](u,t)}function c(u){if(!l)for(var v=void 0;(v=u.children[u.children.length-1])&&v.type===3&&v.text===" ";)u.children.pop()}return Qp(e,{warn:ht,expectHTML:t.expectHTML,isUnaryTag:t.isUnaryTag,canBeLeftOpenTag:t.canBeLeftOpenTag,shouldDecodeNewlines:t.shouldDecodeNewlines,shouldDecodeNewlinesForHref:t.shouldDecodeNewlinesForHref,shouldKeepComment:t.comments,outputSourceRange:t.outputSourceRange,start:function(u,v,y,p,m){var f=n&&n.ns||un(u);qe&&f==="svg"&&(v=Rf(v));var _=Na(u,v,n);f&&(_.ns=f),$f(_)&&!kt()&&(_.forbidden=!0);for(var k=0;k<hr.length;k++)_=hr[k](_,t)||_;o||(lf(_),_.pre&&(o=!0)),xr(_.tag)&&(l=!0),o?df(_):_.processed||(al(_),ff(_),hf(_)),i||(i=_),y?d(_):(n=_,s.push(_))},end:function(u,v,y){var p=s[s.length-1];s.length-=1,n=s[s.length-1],d(p)},chars:function(u,v,y){if(n&&!(qe&&n.tag==="textarea"&&n.attrsMap.placeholder===u)){var p=n.children;if(l||u.trim()?u=Sf(n)?u:nf(u):p.length?a?a==="condense"?u=rf.test(u)?"":" ":u=" ":u=r?" ":"":u="",u){!l&&a==="condense"&&(u=u.replace(af," "));var m=void 0,f=void 0;!o&&u!==" "&&(m=Op(u,cn))?f={type:2,expression:m.expression,tokens:m.tokens,text:u}:(u!==" "||!p.length||p[p.length-1].text!==" ")&&(f={type:3,text:u}),f&&p.push(f)}}},comment:function(u,v,y){if(n){var p={type:3,text:u,isComment:!0};n.children.push(p)}}}),i}function lf(e){Y(e,"v-pre")!=null&&(e.pre=!0)}function df(e){var t=e.attrsList,s=t.length;if(s)for(var r=e.attrs=new Array(s),a=0;a<s;a++)r[a]={name:t[a].name,value:JSON.stringify(t[a].value)},t[a].start!=null&&(r[a].start=t[a].start,r[a].end=t[a].end);else e.pre||(e.plain=!0)}function hs(e,t){cf(e),e.plain=!e.key&&!e.scopedSlots&&!e.attrsList.length,uf(e),vf(e),xf(e),bf(e);for(var s=0;s<Gr.length;s++)e=Gr[s](e,t)||e;return yf(e),e}function cf(e){var t=ge(e,"key");t&&(e.key=t)}function uf(e){var t=ge(e,"ref");t&&(e.ref=t,e.refInFor=wf(e))}function al(e){var t;if(t=Y(e,"v-for")){var s=pf(t);s&&B(e,s)}}function pf(e){var t=e.match(ef);if(t){var s={};s.for=t[2].trim();var r=t[1].trim().replace(tf,""),a=r.match(ln);return a?(s.alias=r.replace(ln,"").trim(),s.iterator1=a[1].trim(),a[2]&&(s.iterator2=a[2].trim())):s.alias=r,s}}function ff(e){var t=Y(e,"v-if");if(t)e.if=t,xt(e,{exp:t,block:e});else{Y(e,"v-else")!=null&&(e.else=!0);var s=Y(e,"v-else-if");s&&(e.elseif=s)}}function mf(e,t){var s=gf(t.children);s&&s.if&&xt(s,{exp:e.elseif,block:e})}function gf(e){for(var t=e.length;t--;){if(e[t].type===1)return e[t];e.pop()}}function xt(e,t){e.ifConditions||(e.ifConditions=[]),e.ifConditions.push(t)}function hf(e){var t=Y(e,"v-once");t!=null&&(e.once=!0)}function vf(e){var t;e.tag==="template"?(t=Y(e,"scope"),e.slotScope=t||Y(e,"slot-scope")):(t=Y(e,"slot-scope"))&&(e.slotScope=t);var s=ge(e,"slot");if(s&&(e.slotTarget=s==='""'?'"default"':s,e.slotTargetDynamic=!!(e.attrsMap[":slot"]||e.attrsMap["v-bind:slot"]),e.tag!=="template"&&!e.slotScope&&Br(e,"slot",s,Zu(e,"slot"))),e.tag==="template"){var r=Ei(e,Yr);if(r){var a=pn(r),i=a.name,n=a.dynamic;e.slotTarget=i,e.slotTargetDynamic=n,e.slotScope=r.value||Ms}}else{var r=Ei(e,Yr);if(r){var o=e.scopedSlots||(e.scopedSlots={}),l=pn(r),d=l.name,n=l.dynamic,c=o[d]=Na("template",[],e);c.slotTarget=d,c.slotTargetDynamic=n,c.children=e.children.filter(function(y){if(!y.slotScope)return y.parent=c,!0}),c.slotScope=r.value||Ms,e.children=[],e.plain=!1}}}function pn(e){var t=e.name.replace(Yr,"");return t||e.name[0]!=="#"&&(t="default"),gs.test(t)?{name:t.slice(1,-1),dynamic:!0}:{name:'"'.concat(t,'"'),dynamic:!1}}function xf(e){e.tag==="slot"&&(e.slotName=ge(e,"name"))}function bf(e){var t;(t=ge(e,"is"))&&(e.component=t),Y(e,"inline-template")!=null&&(e.inlineTemplate=!0)}function yf(e){var t=e.attrsList,s,r,a,i,n,o,l,d;for(s=0,r=t.length;s<r;s++)if(a=i=t[s].name,n=t[s].value,gr.test(a))if(e.hasBindings=!0,o=_f(a.replace(gr,"")),o&&(a=a.replace(rl,"")),dn.test(a))a=a.replace(dn,""),n=Fa(n),d=gs.test(a),d&&(a=a.slice(1,-1)),o&&(o.prop&&!d&&(a=de(a),a==="innerHtml"&&(a="innerHTML")),o.camel&&!d&&(a=de(a)),o.sync&&(l=Ie(n,"$event"),d?Pe(e,'"update:"+('.concat(a,")"),l,null,!1,ht,t[s],!0):(Pe(e,"update:".concat(de(a)),l,null,!1,ht,t[s]),rt(a)!==de(a)&&Pe(e,"update:".concat(rt(a)),l,null,!1,ht,t[s])))),o&&o.prop||!e.component&&Jr(e.tag,e.attrsMap.type,a)?lt(e,a,n,t[s],d):Br(e,a,n,t[s],d);else if(on.test(a))a=a.replace(on,""),d=gs.test(a),d&&(a=a.slice(1,-1)),Pe(e,a,n,o,!1,ht,t[s],d);else{a=a.replace(gr,"");var c=a.match(sf),u=c&&c[1];d=!1,u&&(a=a.slice(0,-(u.length+1)),gs.test(u)&&(u=u.slice(1,-1),d=!0)),Wu(e,a,i,n,u,d,o,t[s])}else Br(e,a,JSON.stringify(n),t[s]),!e.component&&a==="muted"&&Jr(e.tag,e.attrsMap.type,a)&&lt(e,a,"true",t[s])}function wf(e){for(var t=e;t;){if(t.for!==void 0)return!0;t=t.parent}return!1}function _f(e){var t=e.match(rl);if(t){var s={};return t.forEach(function(r){s[r.slice(1)]=!0}),s}}function kf(e){for(var t={},s=0,r=e.length;s<r;s++)t[e[s].name]=e[s].value;return t}function Sf(e){return e.tag==="script"||e.tag==="style"}function $f(e){return e.tag==="style"||e.tag==="script"&&(!e.attrsMap.type||e.attrsMap.type==="text/javascript")}var Af=/^xmlns:NS\d+/,Cf=/^NS\d+:/;function Rf(e){for(var t=[],s=0;s<e.length;s++){var r=e[s];Af.test(r.name)||(r.name=r.name.replace(Cf,""),t.push(r))}return t}function Tf(e,t){if(e.tag==="input"){var s=e.attrsMap;if(!s["v-model"])return;var r=void 0;if((s[":type"]||s["v-bind:type"])&&(r=ge(e,"type")),!s.type&&!r&&s["v-bind"]&&(r="(".concat(s["v-bind"],").type")),r){var a=Y(e,"v-if",!0),i=a?"&&(".concat(a,")"):"",n=Y(e,"v-else",!0)!=null,o=Y(e,"v-else-if",!0),l=br(e);al(l),dr(l,"type","checkbox"),hs(l,t),l.processed=!0,l.if="(".concat(r,")==='checkbox'")+i,xt(l,{exp:l.if,block:l});var d=br(e);Y(d,"v-for",!0),dr(d,"type","radio"),hs(d,t),xt(l,{exp:"(".concat(r,")==='radio'")+i,block:d});var c=br(e);return Y(c,"v-for",!0),dr(c,":type",r),hs(c,t),xt(l,{exp:a,block:c}),n?l.else=!0:o&&(l.elseif=o),l}}}function br(e){return Na(e.tag,e.attrsList.slice(),e.parent)}var Pf={preTransformNode:Tf},fn=[jp,Mp,Pf];function Df(e,t){t.value&&lt(e,"textContent","_s(".concat(t.value,")"),t)}function Ff(e,t){t.value&&lt(e,"innerHTML","_s(".concat(t.value,")"),t)}var Of={model:Gu,text:Df,html:Ff},Ef={expectHTML:!0,modules:fn,directives:Of,isPreTag:vu,isUnaryTag:Bp,mustUseProp:Do,canBeLeftOpenTag:zp,isReservedTag:Pa,getTagNamespace:Eo,staticKeys:hd(fn)},il,Ua,Lf=ye(Nf);function jf(e,t){e&&(il=Lf(t.staticKeys||""),Ua=t.isReservedTag||me,Vr(e),Xr(e,!1))}function Nf(e){return Q("type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap"+(e?","+e:""))}function Vr(e){if(e.static=Uf(e),e.type===1){if(!Ua(e.tag)&&e.tag!=="slot"&&e.attrsMap["inline-template"]==null)return;for(var t=0,s=e.children.length;t<s;t++){var r=e.children[t];Vr(r),r.static||(e.static=!1)}if(e.ifConditions)for(var t=1,s=e.ifConditions.length;t<s;t++){var a=e.ifConditions[t].block;Vr(a),a.static||(e.static=!1)}}}function Xr(e,t){if(e.type===1){if((e.static||e.once)&&(e.staticInFor=t),e.static&&e.children.length&&!(e.children.length===1&&e.children[0].type===3)){e.staticRoot=!0;return}else e.staticRoot=!1;if(e.children)for(var s=0,r=e.children.length;s<r;s++)Xr(e.children[s],t||!!e.for);if(e.ifConditions)for(var s=1,r=e.ifConditions.length;s<r;s++)Xr(e.ifConditions[s].block,t)}}function Uf(e){return e.type===2?!1:e.type===3?!0:!!(e.pre||!e.hasBindings&&!e.if&&!e.for&&!dd(e.tag)&&Ua(e.tag)&&!Mf(e)&&Object.keys(e).every(il))}function Mf(e){for(;e.parent;){if(e=e.parent,e.tag!=="template")return!1;if(e.for)return!0}return!1}var If=/^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/,Bf=/\([^)]*?\);*$/,mn=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,nl={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},zf={esc:["Esc","Escape"],tab:"Tab",enter:"Enter",space:[" ","Spacebar"],up:["Up","ArrowUp"],left:["Left","ArrowLeft"],right:["Right","ArrowRight"],down:["Down","ArrowDown"],delete:["Backspace","Delete","Del"]},Ce=function(e){return"if(".concat(e,")return null;")},gn={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:Ce("$event.target !== $event.currentTarget"),ctrl:Ce("!$event.ctrlKey"),shift:Ce("!$event.shiftKey"),alt:Ce("!$event.altKey"),meta:Ce("!$event.metaKey"),left:Ce("'button' in $event && $event.button !== 0"),middle:Ce("'button' in $event && $event.button !== 1"),right:Ce("'button' in $event && $event.button !== 2")};function hn(e,t){var s=t?"nativeOn:":"on:",r="",a="";for(var i in e){var n=ol(e[i]);e[i]&&e[i].dynamic?a+="".concat(i,",").concat(n,","):r+='"'.concat(i,'":').concat(n,",")}return r="{".concat(r.slice(0,-1),"}"),a?s+"_d(".concat(r,",[").concat(a.slice(0,-1),"])"):s+r}function ol(e){if(!e)return"function(){}";if(Array.isArray(e))return"[".concat(e.map(function(c){return ol(c)}).join(","),"]");var t=mn.test(e.value),s=If.test(e.value),r=mn.test(e.value.replace(Bf,""));if(e.modifiers){var a="",i="",n=[],o=function(c){if(gn[c])i+=gn[c],nl[c]&&n.push(c);else if(c==="exact"){var u=e.modifiers;i+=Ce(["ctrl","shift","alt","meta"].filter(function(v){return!u[v]}).map(function(v){return"$event.".concat(v,"Key")}).join("||"))}else n.push(c)};for(var l in e.modifiers)o(l);n.length&&(a+=Hf(n)),i&&(a+=i);var d=t?"return ".concat(e.value,".apply(null, arguments)"):s?"return (".concat(e.value,").apply(null, arguments)"):r?"return ".concat(e.value):e.value;return"function($event){".concat(a).concat(d,"}")}else return t||s?e.value:"function($event){".concat(r?"return ".concat(e.value):e.value,"}")}function Hf(e){return"if(!$event.type.indexOf('key')&&"+"".concat(e.map(qf).join("&&"),")return null;")}function qf(e){var t=parseInt(e,10);if(t)return"$event.keyCode!==".concat(t);var s=nl[e],r=zf[e];return"_k($event.keyCode,"+"".concat(JSON.stringify(e),",")+"".concat(JSON.stringify(s),",")+"$event.key,"+"".concat(JSON.stringify(r))+")"}function Wf(e,t){e.wrapListeners=function(s){return"_g(".concat(s,",").concat(t.value,")")}}function Zf(e,t){e.wrapData=function(s){return"_b(".concat(s,",'").concat(e.tag,"',").concat(t.value,",").concat(t.modifiers&&t.modifiers.prop?"true":"false").concat(t.modifiers&&t.modifiers.sync?",true":"",")")}}var Kf={on:Wf,bind:Zf,cloak:G},Yf=function(){function e(t){this.options=t,this.warn=t.warn||Gs,this.transforms=Nt(t.modules,"transformCode"),this.dataGenFns=Nt(t.modules,"genData"),this.directives=B(B({},Kf),t.directives);var s=t.isReservedTag||me;this.maybeComponent=function(r){return!!r.component||!s(r.tag)},this.onceId=0,this.staticRenderFns=[],this.pre=!1}return e}();function ll(e,t){var s=new Yf(t),r=e?e.tag==="script"?"null":Oe(e,s):'_c("div")';return{render:"with(this){return ".concat(r,"}"),staticRenderFns:s.staticRenderFns}}function Oe(e,t){if(e.parent&&(e.pre=e.pre||e.parent.pre),e.staticRoot&&!e.staticProcessed)return dl(e,t);if(e.once&&!e.onceProcessed)return cl(e,t);if(e.for&&!e.forProcessed)return pl(e,t);if(e.if&&!e.ifProcessed)return Ma(e,t);if(e.tag==="template"&&!e.slotTarget&&!t.pre)return bt(e,t)||"void 0";if(e.tag==="slot")return am(e,t);var s=void 0;if(e.component)s=im(e.component,e,t);else{var r=void 0,a=t.maybeComponent(e);(!e.plain||e.pre&&a)&&(r=fl(e,t));var i=void 0,n=t.options.bindings;a&&n&&n.__isScriptSetup!==!1&&(i=Gf(n,e.tag)),i||(i="'".concat(e.tag,"'"));var o=e.inlineTemplate?null:bt(e,t,!0);s="_c(".concat(i).concat(r?",".concat(r):"").concat(o?",".concat(o):"",")")}for(var l=0;l<t.transforms.length;l++)s=t.transforms[l](e,s);return s}function Gf(e,t){var s=de(t),r=Xn(s),a=function(o){if(e[t]===o)return t;if(e[s]===o)return s;if(e[r]===o)return r},i=a("setup-const")||a("setup-reactive-const");if(i)return i;var n=a("setup-let")||a("setup-ref")||a("setup-maybe-ref");if(n)return n}function dl(e,t){e.staticProcessed=!0;var s=t.pre;return e.pre&&(t.pre=e.pre),t.staticRenderFns.push("with(this){return ".concat(Oe(e,t),"}")),t.pre=s,"_m(".concat(t.staticRenderFns.length-1).concat(e.staticInFor?",true":"",")")}function cl(e,t){if(e.onceProcessed=!0,e.if&&!e.ifProcessed)return Ma(e,t);if(e.staticInFor){for(var s="",r=e.parent;r;){if(r.for){s=r.key;break}r=r.parent}return s?"_o(".concat(Oe(e,t),",").concat(t.onceId++,",").concat(s,")"):Oe(e,t)}else return dl(e,t)}function Ma(e,t,s,r){return e.ifProcessed=!0,ul(e.ifConditions.slice(),t,s,r)}function ul(e,t,s,r){if(!e.length)return r||"_e()";var a=e.shift();if(a.exp)return"(".concat(a.exp,")?").concat(i(a.block),":").concat(ul(e,t,s,r));return"".concat(i(a.block));function i(n){return s?s(n,t):n.once?cl(n,t):Oe(n,t)}}function pl(e,t,s,r){var a=e.for,i=e.alias,n=e.iterator1?",".concat(e.iterator1):"",o=e.iterator2?",".concat(e.iterator2):"";return e.forProcessed=!0,"".concat(r||"_l","((").concat(a,"),")+"function(".concat(i).concat(n).concat(o,"){")+"return ".concat((s||Oe)(e,t))+"})"}function fl(e,t){var s="{",r=Jf(e,t);r&&(s+=r+","),e.key&&(s+="key:".concat(e.key,",")),e.ref&&(s+="ref:".concat(e.ref,",")),e.refInFor&&(s+="refInFor:true,"),e.pre&&(s+="pre:true,"),e.component&&(s+='tag:"'.concat(e.tag,'",'));for(var a=0;a<t.dataGenFns.length;a++)s+=t.dataGenFns[a](e);if(e.attrs&&(s+="attrs:".concat(vs(e.attrs),",")),e.props&&(s+="domProps:".concat(vs(e.props),",")),e.events&&(s+="".concat(hn(e.events,!1),",")),e.nativeEvents&&(s+="".concat(hn(e.nativeEvents,!0),",")),e.slotTarget&&!e.slotScope&&(s+="slot:".concat(e.slotTarget,",")),e.scopedSlots&&(s+="".concat(Xf(e,e.scopedSlots,t),",")),e.model&&(s+="model:{value:".concat(e.model.value,",callback:").concat(e.model.callback,",expression:").concat(e.model.expression,"},")),e.inlineTemplate){var i=Vf(e,t);i&&(s+="".concat(i,","))}return s=s.replace(/,$/,"")+"}",e.dynamicAttrs&&(s="_b(".concat(s,',"').concat(e.tag,'",').concat(vs(e.dynamicAttrs),")")),e.wrapData&&(s=e.wrapData(s)),e.wrapListeners&&(s=e.wrapListeners(s)),s}function Jf(e,t){var s=e.directives;if(s){var r="directives:[",a=!1,i,n,o,l;for(i=0,n=s.length;i<n;i++){o=s[i],l=!0;var d=t.directives[o.name];d&&(l=!!d(e,o,t.warn)),l&&(a=!0,r+='{name:"'.concat(o.name,'",rawName:"').concat(o.rawName,'"').concat(o.value?",value:(".concat(o.value,"),expression:").concat(JSON.stringify(o.value)):"").concat(o.arg?",arg:".concat(o.isDynamicArg?o.arg:'"'.concat(o.arg,'"')):"").concat(o.modifiers?",modifiers:".concat(JSON.stringify(o.modifiers)):"","},"))}if(a)return r.slice(0,-1)+"]"}}function Vf(e,t){var s=e.children[0];if(s&&s.type===1){var r=ll(s,t.options);return"inlineTemplate:{render:function(){".concat(r.render,"},staticRenderFns:[").concat(r.staticRenderFns.map(function(a){return"function(){".concat(a,"}")}).join(","),"]}")}}function Xf(e,t,s){var r=e.for||Object.keys(t).some(function(o){var l=t[o];return l.slotTargetDynamic||l.if||l.for||ml(l)}),a=!!e.if;if(!r)for(var i=e.parent;i;){if(i.slotScope&&i.slotScope!==Ms||i.for){r=!0;break}i.if&&(a=!0),i=i.parent}var n=Object.keys(t).map(function(o){return Qr(t[o],s)}).join(",");return"scopedSlots:_u([".concat(n,"]").concat(r?",null,true":"").concat(!r&&a?",null,false,".concat(Qf(n)):"",")")}function Qf(e){for(var t=5381,s=e.length;s;)t=t*33^e.charCodeAt(--s);return t>>>0}function ml(e){return e.type===1?e.tag==="slot"?!0:e.children.some(ml):!1}function Qr(e,t){var s=e.attrsMap["slot-scope"];if(e.if&&!e.ifProcessed&&!s)return Ma(e,t,Qr,"null");if(e.for&&!e.forProcessed)return pl(e,t,Qr);var r=e.slotScope===Ms?"":String(e.slotScope),a="function(".concat(r,"){")+"return ".concat(e.tag==="template"?e.if&&s?"(".concat(e.if,")?").concat(bt(e,t)||"undefined",":undefined"):bt(e,t)||"undefined":Oe(e,t),"}"),i=r?"":",proxy:true";return"{key:".concat(e.slotTarget||'"default"',",fn:").concat(a).concat(i,"}")}function bt(e,t,s,r,a){var i=e.children;if(i.length){var n=i[0];if(i.length===1&&n.for&&n.tag!=="template"&&n.tag!=="slot"){var o=s?t.maybeComponent(n)?",1":",0":"";return"".concat((r||Oe)(n,t)).concat(o)}var l=s?em(i,t.maybeComponent):0,d=a||tm;return"[".concat(i.map(function(c){return d(c,t)}).join(","),"]").concat(l?",".concat(l):"")}}function em(e,t){for(var s=0,r=0;r<e.length;r++){var a=e[r];if(a.type===1){if(vn(a)||a.ifConditions&&a.ifConditions.some(function(i){return vn(i.block)})){s=2;break}(t(a)||a.ifConditions&&a.ifConditions.some(function(i){return t(i.block)}))&&(s=1)}}return s}function vn(e){return e.for!==void 0||e.tag==="template"||e.tag==="slot"}function tm(e,t){return e.type===1?Oe(e,t):e.type===3&&e.isComment?rm(e):sm(e)}function sm(e){return"_v(".concat(e.type===2?e.expression:gl(JSON.stringify(e.text)),")")}function rm(e){return"_e(".concat(JSON.stringify(e.text),")")}function am(e,t){var s=e.slotName||'"default"',r=bt(e,t),a="_t(".concat(s).concat(r?",function(){return ".concat(r,"}"):""),i=e.attrs||e.dynamicAttrs?vs((e.attrs||[]).concat(e.dynamicAttrs||[]).map(function(o){return{name:de(o.name),value:o.value,dynamic:o.dynamic}})):null,n=e.attrsMap["v-bind"];return(i||n)&&!r&&(a+=",null"),i&&(a+=",".concat(i)),n&&(a+="".concat(i?"":",null",",").concat(n)),a+")"}function im(e,t,s){var r=t.inlineTemplate?null:bt(t,s,!0);return"_c(".concat(e,",").concat(fl(t,s)).concat(r?",".concat(r):"",")")}function vs(e){for(var t="",s="",r=0;r<e.length;r++){var a=e[r],i=gl(a.value);a.dynamic?s+="".concat(a.name,",").concat(i,","):t+='"'.concat(a.name,'":').concat(i,",")}return t="{".concat(t.slice(0,-1),"}"),s?"_d(".concat(t,",[").concat(s.slice(0,-1),"])"):t}function gl(e){return e.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b");new RegExp("\\b"+"delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b")+"\\s*\\([^\\)]*\\)");function xn(e,t){try{return new Function(e)}catch(s){return t.push({err:s,code:e}),G}}function nm(e){var t=Object.create(null);return function(r,a,i){a=B({},a),a.warn,delete a.warn;var n=a.delimiters?String(a.delimiters)+r:r;if(t[n])return t[n];var o=e(r,a),l={},d=[];return l.render=xn(o.render,d),l.staticRenderFns=o.staticRenderFns.map(function(c){return xn(c,d)}),t[n]=l}}function om(e){return function(s){function r(a,i){var n=Object.create(s),o=[],l=[],d=function(v,y,p){(p?l:o).push(v)};if(i){i.modules&&(n.modules=(s.modules||[]).concat(i.modules)),i.directives&&(n.directives=B(Object.create(s.directives||null),i.directives));for(var c in i)c!=="modules"&&c!=="directives"&&(n[c]=i[c])}n.warn=d;var u=e(a.trim(),n);return u.errors=o,u.tips=l,u}return{compile:r,compileToFunctions:nm(r)}}}var lm=om(function(t,s){var r=of(t.trim(),s);s.optimize!==!1&&jf(r,s);var a=ll(r,s);return{ast:r,render:a.render,staticRenderFns:a.staticRenderFns}}),dm=lm(Ef),hl=dm.compileToFunctions,ns;function vl(e){return ns=ns||document.createElement("div"),ns.innerHTML=e?`<a href="
"/>`:`<div a="
"/>`,ns.innerHTML.indexOf("&#10;")>0}var cm=ae?vl(!1):!1,um=ae?vl(!0):!1,pm=ye(function(e){var t=Da(e);return t&&t.innerHTML}),fm=D.prototype.$mount;D.prototype.$mount=function(e,t){if(e=e&&Da(e),e===document.body||e===document.documentElement)return this;var s=this.$options;if(!s.render){var r=s.template;if(r)if(typeof r=="string")r.charAt(0)==="#"&&(r=pm(r));else if(r.nodeType)r=r.innerHTML;else return this;else e&&(r=mm(e));if(r){var a=hl(r,{outputSourceRange:!1,shouldDecodeNewlines:cm,shouldDecodeNewlinesForHref:um,delimiters:s.delimiters,comments:s.comments},this),i=a.render,n=a.staticRenderFns;s.render=i,s.staticRenderFns=n}}return fm.call(this,e,t)};function mm(e){if(e.outerHTML)return e.outerHTML;var t=document.createElement("div");return t.appendChild(e.cloneNode(!0)),t.innerHTML}D.compile=hl;/*!
  * vue-router v3.6.5
  * (c) 2022 Evan You
  * @license MIT
  */function ve(e,t){for(var s in t)e[s]=t[s];return e}var gm=/[!'()*]/g,hm=function(e){return"%"+e.charCodeAt(0).toString(16)},vm=/%2C/g,ut=function(e){return encodeURIComponent(e).replace(gm,hm).replace(vm,",")};function ea(e){try{return decodeURIComponent(e)}catch{}return e}function xm(e,t,s){t===void 0&&(t={});var r=s||bm,a;try{a=r(e||"")}catch{a={}}for(var i in t){var n=t[i];a[i]=Array.isArray(n)?n.map(bn):bn(n)}return a}var bn=function(e){return e==null||typeof e=="object"?e:String(e)};function bm(e){var t={};return e=e.trim().replace(/^(\?|#|&)/,""),e&&e.split("&").forEach(function(s){var r=s.replace(/\+/g," ").split("="),a=ea(r.shift()),i=r.length>0?ea(r.join("=")):null;t[a]===void 0?t[a]=i:Array.isArray(t[a])?t[a].push(i):t[a]=[t[a],i]}),t}function ym(e){var t=e?Object.keys(e).map(function(s){var r=e[s];if(r===void 0)return"";if(r===null)return ut(s);if(Array.isArray(r)){var a=[];return r.forEach(function(i){i!==void 0&&(i===null?a.push(ut(s)):a.push(ut(s)+"="+ut(i)))}),a.join("&")}return ut(s)+"="+ut(r)}).filter(function(s){return s.length>0}).join("&"):null;return t?"?"+t:""}var Is=/\/?$/;function Bs(e,t,s,r){var a=r&&r.options.stringifyQuery,i=t.query||{};try{i=ta(i)}catch{}var n={name:t.name||e&&e.name,meta:e&&e.meta||{},path:t.path||"/",hash:t.hash||"",query:i,params:t.params||{},fullPath:yn(t,a),matched:e?wm(e):[]};return s&&(n.redirectedFrom=yn(s,a)),Object.freeze(n)}function ta(e){if(Array.isArray(e))return e.map(ta);if(e&&typeof e=="object"){var t={};for(var s in e)t[s]=ta(e[s]);return t}else return e}var Je=Bs(null,{path:"/"});function wm(e){for(var t=[];e;)t.unshift(e),e=e.parent;return t}function yn(e,t){var s=e.path,r=e.query;r===void 0&&(r={});var a=e.hash;a===void 0&&(a="");var i=t||ym;return(s||"/")+i(r)+a}function xl(e,t,s){return t===Je?e===t:t?e.path&&t.path?e.path.replace(Is,"")===t.path.replace(Is,"")&&(s||e.hash===t.hash&&xs(e.query,t.query)):e.name&&t.name?e.name===t.name&&(s||e.hash===t.hash&&xs(e.query,t.query)&&xs(e.params,t.params)):!1:!1}function xs(e,t){if(e===void 0&&(e={}),t===void 0&&(t={}),!e||!t)return e===t;var s=Object.keys(e).sort(),r=Object.keys(t).sort();return s.length!==r.length?!1:s.every(function(a,i){var n=e[a],o=r[i];if(o!==a)return!1;var l=t[a];return n==null||l==null?n===l:typeof n=="object"&&typeof l=="object"?xs(n,l):String(n)===String(l)})}function _m(e,t){return e.path.replace(Is,"/").indexOf(t.path.replace(Is,"/"))===0&&(!t.hash||e.hash===t.hash)&&km(e.query,t.query)}function km(e,t){for(var s in t)if(!(s in e))return!1;return!0}function bl(e){for(var t=0;t<e.matched.length;t++){var s=e.matched[t];for(var r in s.instances){var a=s.instances[r],i=s.enteredCbs[r];if(!(!a||!i)){delete s.enteredCbs[r];for(var n=0;n<i.length;n++)a._isBeingDestroyed||i[n](a)}}}}var Sm={name:"RouterView",functional:!0,props:{name:{type:String,default:"default"}},render:function(t,s){var r=s.props,a=s.children,i=s.parent,n=s.data;n.routerView=!0;for(var o=i.$createElement,l=r.name,d=i.$route,c=i._routerViewCache||(i._routerViewCache={}),u=0,v=!1;i&&i._routerRoot!==i;){var y=i.$vnode?i.$vnode.data:{};y.routerView&&u++,y.keepAlive&&i._directInactive&&i._inactive&&(v=!0),i=i.$parent}if(n.routerViewDepth=u,v){var p=c[l],m=p&&p.component;return m?(p.configProps&&wn(m,n,p.route,p.configProps),o(m,n,a)):o()}var f=d.matched[u],_=f&&f.components[l];if(!f||!_)return c[l]=null,o();c[l]={component:_},n.registerRouteInstance=function(S,C){var P=f.instances[l];(C&&P!==S||!C&&P===S)&&(f.instances[l]=C)},(n.hook||(n.hook={})).prepatch=function(S,C){f.instances[l]=C.componentInstance},n.hook.init=function(S){S.data.keepAlive&&S.componentInstance&&S.componentInstance!==f.instances[l]&&(f.instances[l]=S.componentInstance),bl(d)};var k=f.props&&f.props[l];return k&&(ve(c[l],{route:d,configProps:k}),wn(_,n,d,k)),o(_,n,a)}};function wn(e,t,s,r){var a=t.props=$m(s,r);if(a){a=t.props=ve({},a);var i=t.attrs=t.attrs||{};for(var n in a)(!e.props||!(n in e.props))&&(i[n]=a[n],delete a[n])}}function $m(e,t){switch(typeof t){case"undefined":return;case"object":return t;case"function":return t(e);case"boolean":return t?e.params:void 0}}function yl(e,t,s){var r=e.charAt(0);if(r==="/")return e;if(r==="?"||r==="#")return t+e;var a=t.split("/");(!s||!a[a.length-1])&&a.pop();for(var i=e.replace(/^\//,"").split("/"),n=0;n<i.length;n++){var o=i[n];o===".."?a.pop():o!=="."&&a.push(o)}return a[0]!==""&&a.unshift(""),a.join("/")}function Am(e){var t="",s="",r=e.indexOf("#");r>=0&&(t=e.slice(r),e=e.slice(0,r));var a=e.indexOf("?");return a>=0&&(s=e.slice(a+1),e=e.slice(0,a)),{path:e,query:s,hash:t}}function Be(e){return e.replace(/\/(?:\s*\/)+/g,"/")}var zs=Array.isArray||function(e){return Object.prototype.toString.call(e)=="[object Array]"},At=kl,Cm=Ia,Rm=Fm,Tm=wl,Pm=_l,Dm=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function Ia(e,t){for(var s=[],r=0,a=0,i="",n=t&&t.delimiter||"/",o;(o=Dm.exec(e))!=null;){var l=o[0],d=o[1],c=o.index;if(i+=e.slice(a,c),a=c+l.length,d){i+=d[1];continue}var u=e[a],v=o[2],y=o[3],p=o[4],m=o[5],f=o[6],_=o[7];i&&(s.push(i),i="");var k=v!=null&&u!=null&&u!==v,S=f==="+"||f==="*",C=f==="?"||f==="*",P=o[2]||n,F=p||m;s.push({name:y||r++,prefix:v||"",delimiter:P,optional:C,repeat:S,partial:k,asterisk:!!_,pattern:F?Lm(F):_?".*":"[^"+bs(P)+"]+?"})}return a<e.length&&(i+=e.substr(a)),i&&s.push(i),s}function Fm(e,t){return wl(Ia(e,t),t)}function Om(e){return encodeURI(e).replace(/[\/?#]/g,function(t){return"%"+t.charCodeAt(0).toString(16).toUpperCase()})}function Em(e){return encodeURI(e).replace(/[?#]/g,function(t){return"%"+t.charCodeAt(0).toString(16).toUpperCase()})}function wl(e,t){for(var s=new Array(e.length),r=0;r<e.length;r++)typeof e[r]=="object"&&(s[r]=new RegExp("^(?:"+e[r].pattern+")$",za(t)));return function(a,i){for(var n="",o=a||{},l=i||{},d=l.pretty?Om:encodeURIComponent,c=0;c<e.length;c++){var u=e[c];if(typeof u=="string"){n+=u;continue}var v=o[u.name],y;if(v==null)if(u.optional){u.partial&&(n+=u.prefix);continue}else throw new TypeError('Expected "'+u.name+'" to be defined');if(zs(v)){if(!u.repeat)throw new TypeError('Expected "'+u.name+'" to not repeat, but received `'+JSON.stringify(v)+"`");if(v.length===0){if(u.optional)continue;throw new TypeError('Expected "'+u.name+'" to not be empty')}for(var p=0;p<v.length;p++){if(y=d(v[p]),!s[c].test(y))throw new TypeError('Expected all "'+u.name+'" to match "'+u.pattern+'", but received `'+JSON.stringify(y)+"`");n+=(p===0?u.prefix:u.delimiter)+y}continue}if(y=u.asterisk?Em(v):d(v),!s[c].test(y))throw new TypeError('Expected "'+u.name+'" to match "'+u.pattern+'", but received "'+y+'"');n+=u.prefix+y}return n}}function bs(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function Lm(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function Ba(e,t){return e.keys=t,e}function za(e){return e&&e.sensitive?"":"i"}function jm(e,t){var s=e.source.match(/\((?!\?)/g);if(s)for(var r=0;r<s.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return Ba(e,t)}function Nm(e,t,s){for(var r=[],a=0;a<e.length;a++)r.push(kl(e[a],t,s).source);var i=new RegExp("(?:"+r.join("|")+")",za(s));return Ba(i,t)}function Um(e,t,s){return _l(Ia(e,s),t,s)}function _l(e,t,s){zs(t)||(s=t||s,t=[]),s=s||{};for(var r=s.strict,a=s.end!==!1,i="",n=0;n<e.length;n++){var o=e[n];if(typeof o=="string")i+=bs(o);else{var l=bs(o.prefix),d="(?:"+o.pattern+")";t.push(o),o.repeat&&(d+="(?:"+l+d+")*"),o.optional?o.partial?d=l+"("+d+")?":d="(?:"+l+"("+d+"))?":d=l+"("+d+")",i+=d}}var c=bs(s.delimiter||"/"),u=i.slice(-c.length)===c;return r||(i=(u?i.slice(0,-c.length):i)+"(?:"+c+"(?=$))?"),a?i+="$":i+=r&&u?"":"(?="+c+"|$)",Ba(new RegExp("^"+i,za(s)),t)}function kl(e,t,s){return zs(t)||(s=t||s,t=[]),s=s||{},e instanceof RegExp?jm(e,t):zs(e)?Nm(e,t,s):Um(e,t,s)}At.parse=Cm;At.compile=Rm;At.tokensToFunction=Tm;At.tokensToRegExp=Pm;var _n=Object.create(null);function ys(e,t,s){t=t||{};try{var r=_n[e]||(_n[e]=At.compile(e));return typeof t.pathMatch=="string"&&(t[0]=t.pathMatch),r(t,{pretty:!0})}catch{return""}finally{delete t[0]}}function Ha(e,t,s,r){var a=typeof e=="string"?{path:e}:e;if(a._normalized)return a;if(a.name){a=ve({},e);var i=a.params;return i&&typeof i=="object"&&(a.params=ve({},i)),a}if(!a.path&&a.params&&t){a=ve({},a),a._normalized=!0;var n=ve(ve({},t.params),a.params);if(t.name)a.name=t.name,a.params=n;else if(t.matched.length){var o=t.matched[t.matched.length-1].path;a.path=ys(o,n,"path "+t.path)}return a}var l=Am(a.path||""),d=t&&t.path||"/",c=l.path?yl(l.path,d,s||a.append):d,u=xm(l.query,a.query,r&&r.options.parseQuery),v=a.hash||l.hash;return v&&v.charAt(0)!=="#"&&(v="#"+v),{_normalized:!0,path:c,query:u,hash:v}}var Mm=[String,Object],Im=[String,Array],kn=function(){},Bm={name:"RouterLink",props:{to:{type:Mm,required:!0},tag:{type:String,default:"a"},custom:Boolean,exact:Boolean,exactPath:Boolean,append:Boolean,replace:Boolean,activeClass:String,exactActiveClass:String,ariaCurrentValue:{type:String,default:"page"},event:{type:Im,default:"click"}},render:function(t){var s=this,r=this.$router,a=this.$route,i=r.resolve(this.to,a,this.append),n=i.location,o=i.route,l=i.href,d={},c=r.options.linkActiveClass,u=r.options.linkExactActiveClass,v=c??"router-link-active",y=u??"router-link-exact-active",p=this.activeClass==null?v:this.activeClass,m=this.exactActiveClass==null?y:this.exactActiveClass,f=o.redirectedFrom?Bs(null,Ha(o.redirectedFrom),null,r):o;d[m]=xl(a,f,this.exactPath),d[p]=this.exact||this.exactPath?d[m]:_m(a,f);var _=d[m]?this.ariaCurrentValue:null,k=function(h){Sn(h)&&(s.replace?r.replace(n,kn):r.push(n,kn))},S={click:Sn};Array.isArray(this.event)?this.event.forEach(function(h){S[h]=k}):S[this.event]=k;var C={class:d},P=!this.$scopedSlots.$hasNormal&&this.$scopedSlots.default&&this.$scopedSlots.default({href:l,route:o,navigate:k,isActive:d[p],isExactActive:d[m]});if(P){if(P.length===1)return P[0];if(P.length>1||!P.length)return P.length===0?t():t("span",{},P)}if(this.tag==="a")C.on=S,C.attrs={href:l,"aria-current":_};else{var F=Sl(this.$slots.default);if(F){F.isStatic=!1;var T=F.data=ve({},F.data);T.on=T.on||{};for(var z in T.on){var V=T.on[z];z in S&&(T.on[z]=Array.isArray(V)?V:[V])}for(var K in S)K in T.on?T.on[K].push(S[K]):T.on[K]=k;var ne=F.data.attrs=ve({},F.data.attrs);ne.href=l,ne["aria-current"]=_}else C.on=S}return t(this.tag,C,this.$slots.default)}};function Sn(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&!(e.button!==void 0&&e.button!==0)){if(e.currentTarget&&e.currentTarget.getAttribute){var t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function Sl(e){if(e){for(var t,s=0;s<e.length;s++)if(t=e[s],t.tag==="a"||t.children&&(t=Sl(t.children)))return t}}var Hs;function sa(e){if(!(sa.installed&&Hs===e)){sa.installed=!0,Hs=e;var t=function(a){return a!==void 0},s=function(a,i){var n=a.$options._parentVnode;t(n)&&t(n=n.data)&&t(n=n.registerRouteInstance)&&n(a,i)};e.mixin({beforeCreate:function(){t(this.$options.router)?(this._routerRoot=this,this._router=this.$options.router,this._router.init(this),e.util.defineReactive(this,"_route",this._router.history.current)):this._routerRoot=this.$parent&&this.$parent._routerRoot||this,s(this,this)},destroyed:function(){s(this)}}),Object.defineProperty(e.prototype,"$router",{get:function(){return this._routerRoot._router}}),Object.defineProperty(e.prototype,"$route",{get:function(){return this._routerRoot._route}}),e.component("RouterView",Sm),e.component("RouterLink",Bm);var r=e.config.optionMergeStrategies;r.beforeRouteEnter=r.beforeRouteLeave=r.beforeRouteUpdate=r.created}}var Kt=typeof window<"u";function os(e,t,s,r,a){var i=t||[],n=s||Object.create(null),o=r||Object.create(null);e.forEach(function(c){ra(i,n,o,c,a)});for(var l=0,d=i.length;l<d;l++)i[l]==="*"&&(i.push(i.splice(l,1)[0]),d--,l--);return{pathList:i,pathMap:n,nameMap:o}}function ra(e,t,s,r,a,i){var n=r.path,o=r.name,l=r.pathToRegexpOptions||{},d=Hm(n,a,l.strict);typeof r.caseSensitive=="boolean"&&(l.sensitive=r.caseSensitive);var c={path:d,regex:zm(d,l),components:r.components||{default:r.component},alias:r.alias?typeof r.alias=="string"?[r.alias]:r.alias:[],instances:{},enteredCbs:{},name:o,parent:a,matchAs:i,redirect:r.redirect,beforeEnter:r.beforeEnter,meta:r.meta||{},props:r.props==null?{}:r.components?r.props:{default:r.props}};if(r.children&&r.children.forEach(function(m){var f=i?Be(i+"/"+m.path):void 0;ra(e,t,s,m,c,f)}),t[c.path]||(e.push(c.path),t[c.path]=c),r.alias!==void 0)for(var u=Array.isArray(r.alias)?r.alias:[r.alias],v=0;v<u.length;++v){var y=u[v],p={path:y,children:r.children};ra(e,t,s,p,a,c.path||"/")}o&&(s[o]||(s[o]=c))}function zm(e,t){var s=At(e,[],t);return s}function Hm(e,t,s){return s||(e=e.replace(/\/$/,"")),e[0]==="/"||t==null?e:Be(t.path+"/"+e)}function qm(e,t){var s=os(e),r=s.pathList,a=s.pathMap,i=s.nameMap;function n(y){os(y,r,a,i)}function o(y,p){var m=typeof y!="object"?i[y]:void 0;os([p||y],r,a,i,m),m&&m.alias.length&&os(m.alias.map(function(f){return{path:f,children:[p]}}),r,a,i,m)}function l(){return r.map(function(y){return a[y]})}function d(y,p,m){var f=Ha(y,p,!1,t),_=f.name;if(_){var k=i[_];if(!k)return v(null,f);var S=k.regex.keys.filter(function(z){return!z.optional}).map(function(z){return z.name});if(typeof f.params!="object"&&(f.params={}),p&&typeof p.params=="object")for(var C in p.params)!(C in f.params)&&S.indexOf(C)>-1&&(f.params[C]=p.params[C]);return f.path=ys(k.path,f.params),v(k,f,m)}else if(f.path){f.params={};for(var P=0;P<r.length;P++){var F=r[P],T=a[F];if(Wm(T.regex,f.path,f.params))return v(T,f,m)}}return v(null,f)}function c(y,p){var m=y.redirect,f=typeof m=="function"?m(Bs(y,p,null,t)):m;if(typeof f=="string"&&(f={path:f}),!f||typeof f!="object")return v(null,p);var _=f,k=_.name,S=_.path,C=p.query,P=p.hash,F=p.params;if(C=_.hasOwnProperty("query")?_.query:C,P=_.hasOwnProperty("hash")?_.hash:P,F=_.hasOwnProperty("params")?_.params:F,k)return i[k],d({_normalized:!0,name:k,query:C,hash:P,params:F},void 0,p);if(S){var T=Zm(S,y),z=ys(T,F);return d({_normalized:!0,path:z,query:C,hash:P},void 0,p)}else return v(null,p)}function u(y,p,m){var f=ys(m,p.params),_=d({_normalized:!0,path:f});if(_){var k=_.matched,S=k[k.length-1];return p.params=_.params,v(S,p)}return v(null,p)}function v(y,p,m){return y&&y.redirect?c(y,m||p):y&&y.matchAs?u(y,p,y.matchAs):Bs(y,p,m,t)}return{match:d,addRoute:o,getRoutes:l,addRoutes:n}}function Wm(e,t,s){var r=t.match(e);if(r){if(!s)return!0}else return!1;for(var a=1,i=r.length;a<i;++a){var n=e.keys[a-1];n&&(s[n.name||"pathMatch"]=typeof r[a]=="string"?ea(r[a]):r[a])}return!0}function Zm(e,t){return yl(e,t.parent?t.parent.path:"/",!0)}var Km=Kt&&window.performance&&window.performance.now?window.performance:Date;function $l(){return Km.now().toFixed(3)}var Al=$l();function Js(){return Al}function Cl(e){return Al=e}var Rl=Object.create(null);function Tl(){"scrollRestoration"in window.history&&(window.history.scrollRestoration="manual");var e=window.location.protocol+"//"+window.location.host,t=window.location.href.replace(e,""),s=ve({},window.history.state);return s.key=Js(),window.history.replaceState(s,"",t),window.addEventListener("popstate",$n),function(){window.removeEventListener("popstate",$n)}}function ze(e,t,s,r){if(e.app){var a=e.options.scrollBehavior;a&&e.app.$nextTick(function(){var i=Ym(),n=a.call(e,t,s,r?i:null);n&&(typeof n.then=="function"?n.then(function(o){Rn(o,i)}).catch(function(o){}):Rn(n,i))})}}function Pl(){var e=Js();e&&(Rl[e]={x:window.pageXOffset,y:window.pageYOffset})}function $n(e){Pl(),e.state&&e.state.key&&Cl(e.state.key)}function Ym(){var e=Js();if(e)return Rl[e]}function Gm(e,t){var s=document.documentElement,r=s.getBoundingClientRect(),a=e.getBoundingClientRect();return{x:a.left-r.left-t.x,y:a.top-r.top-t.y}}function An(e){return yt(e.x)||yt(e.y)}function Cn(e){return{x:yt(e.x)?e.x:window.pageXOffset,y:yt(e.y)?e.y:window.pageYOffset}}function Jm(e){return{x:yt(e.x)?e.x:0,y:yt(e.y)?e.y:0}}function yt(e){return typeof e=="number"}var Vm=/^#\d/;function Rn(e,t){var s=typeof e=="object";if(s&&typeof e.selector=="string"){var r=Vm.test(e.selector)?document.getElementById(e.selector.slice(1)):document.querySelector(e.selector);if(r){var a=e.offset&&typeof e.offset=="object"?e.offset:{};a=Jm(a),t=Gm(r,a)}else An(e)&&(t=Cn(e))}else s&&An(e)&&(t=Cn(e));t&&("scrollBehavior"in document.documentElement.style?window.scrollTo({left:t.x,top:t.y,behavior:e.behavior}):window.scrollTo(t.x,t.y))}var He=Kt&&function(){var e=window.navigator.userAgent;return(e.indexOf("Android 2.")!==-1||e.indexOf("Android 4.0")!==-1)&&e.indexOf("Mobile Safari")!==-1&&e.indexOf("Chrome")===-1&&e.indexOf("Windows Phone")===-1?!1:window.history&&typeof window.history.pushState=="function"}();function qs(e,t){Pl();var s=window.history;try{if(t){var r=ve({},s.state);r.key=Js(),s.replaceState(r,"",e)}else s.pushState({key:Cl($l())},"",e)}catch{window.location[t?"replace":"assign"](e)}}function aa(e){qs(e,!0)}var ct={redirected:2,aborted:4,cancelled:8,duplicated:16};function Xm(e,t){return Vs(e,t,ct.redirected,'Redirected when going from "'+e.fullPath+'" to "'+sg(t)+'" via a navigation guard.')}function Qm(e,t){var s=Vs(e,t,ct.duplicated,'Avoided redundant navigation to current location: "'+e.fullPath+'".');return s.name="NavigationDuplicated",s}function Tn(e,t){return Vs(e,t,ct.cancelled,'Navigation cancelled from "'+e.fullPath+'" to "'+t.fullPath+'" with a new navigation.')}function eg(e,t){return Vs(e,t,ct.aborted,'Navigation aborted from "'+e.fullPath+'" to "'+t.fullPath+'" via a navigation guard.')}function Vs(e,t,s,r){var a=new Error(r);return a._isRouter=!0,a.from=e,a.to=t,a.type=s,a}var tg=["params","query","hash"];function sg(e){if(typeof e=="string")return e;if("path"in e)return e.path;var t={};return tg.forEach(function(s){s in e&&(t[s]=e[s])}),JSON.stringify(t,null,2)}function Ws(e){return Object.prototype.toString.call(e).indexOf("Error")>-1}function Xs(e,t){return Ws(e)&&e._isRouter&&(t==null||e.type===t)}function Pn(e,t,s){var r=function(a){a>=e.length?s():e[a]?t(e[a],function(){r(a+1)}):r(a+1)};r(0)}function rg(e){return function(t,s,r){var a=!1,i=0,n=null;Dl(e,function(o,l,d,c){if(typeof o=="function"&&o.cid===void 0){a=!0,i++;var u=Dn(function(m){ig(m)&&(m=m.default),o.resolved=typeof m=="function"?m:Hs.extend(m),d.components[c]=m,i--,i<=0&&r()}),v=Dn(function(m){var f="Failed to resolve async component "+c+": "+m;n||(n=Ws(m)?m:new Error(f),r(n))}),y;try{y=o(u,v)}catch(m){v(m)}if(y)if(typeof y.then=="function")y.then(u,v);else{var p=y.component;p&&typeof p.then=="function"&&p.then(u,v)}}}),a||r()}}function Dl(e,t){return Fl(e.map(function(s){return Object.keys(s.components).map(function(r){return t(s.components[r],s.instances[r],s,r)})}))}function Fl(e){return Array.prototype.concat.apply([],e)}var ag=typeof Symbol=="function"&&typeof Symbol.toStringTag=="symbol";function ig(e){return e.__esModule||ag&&e[Symbol.toStringTag]==="Module"}function Dn(e){var t=!1;return function(){for(var s=[],r=arguments.length;r--;)s[r]=arguments[r];if(!t)return t=!0,e.apply(this,s)}}var we=function(t,s){this.router=t,this.base=ng(s),this.current=Je,this.pending=null,this.ready=!1,this.readyCbs=[],this.readyErrorCbs=[],this.errorCbs=[],this.listeners=[]};we.prototype.listen=function(t){this.cb=t};we.prototype.onReady=function(t,s){this.ready?t():(this.readyCbs.push(t),s&&this.readyErrorCbs.push(s))};we.prototype.onError=function(t){this.errorCbs.push(t)};we.prototype.transitionTo=function(t,s,r){var a=this,i;try{i=this.router.match(t,this.current)}catch(o){throw this.errorCbs.forEach(function(l){l(o)}),o}var n=this.current;this.confirmTransition(i,function(){a.updateRoute(i),s&&s(i),a.ensureURL(),a.router.afterHooks.forEach(function(o){o&&o(i,n)}),a.ready||(a.ready=!0,a.readyCbs.forEach(function(o){o(i)}))},function(o){r&&r(o),o&&!a.ready&&(!Xs(o,ct.redirected)||n!==Je)&&(a.ready=!0,a.readyErrorCbs.forEach(function(l){l(o)}))})};we.prototype.confirmTransition=function(t,s,r){var a=this,i=this.current;this.pending=t;var n=function(m){!Xs(m)&&Ws(m)&&(a.errorCbs.length?a.errorCbs.forEach(function(f){f(m)}):console.error(m)),r&&r(m)},o=t.matched.length-1,l=i.matched.length-1;if(xl(t,i)&&o===l&&t.matched[o]===i.matched[l])return this.ensureURL(),t.hash&&ze(this.router,i,t,!1),n(Qm(i,t));var d=og(this.current.matched,t.matched),c=d.updated,u=d.deactivated,v=d.activated,y=[].concat(dg(u),this.router.beforeHooks,cg(c),v.map(function(m){return m.beforeEnter}),rg(v)),p=function(m,f){if(a.pending!==t)return n(Tn(i,t));try{m(t,i,function(_){_===!1?(a.ensureURL(!0),n(eg(i,t))):Ws(_)?(a.ensureURL(!0),n(_)):typeof _=="string"||typeof _=="object"&&(typeof _.path=="string"||typeof _.name=="string")?(n(Xm(i,t)),typeof _=="object"&&_.replace?a.replace(_):a.push(_)):f(_)})}catch(_){n(_)}};Pn(y,p,function(){var m=ug(v),f=m.concat(a.router.resolveHooks);Pn(f,p,function(){if(a.pending!==t)return n(Tn(i,t));a.pending=null,s(t),a.router.app&&a.router.app.$nextTick(function(){bl(t)})})})};we.prototype.updateRoute=function(t){this.current=t,this.cb&&this.cb(t)};we.prototype.setupListeners=function(){};we.prototype.teardown=function(){this.listeners.forEach(function(t){t()}),this.listeners=[],this.current=Je,this.pending=null};function ng(e){if(!e)if(Kt){var t=document.querySelector("base");e=t&&t.getAttribute("href")||"/",e=e.replace(/^https?:\/\/[^\/]+/,"")}else e="/";return e.charAt(0)!=="/"&&(e="/"+e),e.replace(/\/$/,"")}function og(e,t){var s,r=Math.max(e.length,t.length);for(s=0;s<r&&e[s]===t[s];s++);return{updated:t.slice(0,s),activated:t.slice(s),deactivated:e.slice(s)}}function qa(e,t,s,r){var a=Dl(e,function(i,n,o,l){var d=lg(i,t);if(d)return Array.isArray(d)?d.map(function(c){return s(c,n,o,l)}):s(d,n,o,l)});return Fl(r?a.reverse():a)}function lg(e,t){return typeof e!="function"&&(e=Hs.extend(e)),e.options[t]}function dg(e){return qa(e,"beforeRouteLeave",Ol,!0)}function cg(e){return qa(e,"beforeRouteUpdate",Ol)}function Ol(e,t){if(t)return function(){return e.apply(t,arguments)}}function ug(e){return qa(e,"beforeRouteEnter",function(t,s,r,a){return pg(t,r,a)})}function pg(e,t,s){return function(a,i,n){return e(a,i,function(o){typeof o=="function"&&(t.enteredCbs[s]||(t.enteredCbs[s]=[]),t.enteredCbs[s].push(o)),n(o)})}}var El=function(e){function t(s,r){e.call(this,s,r),this._startLocation=Et(this.base)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.setupListeners=function(){var r=this;if(!(this.listeners.length>0)){var a=this.router,i=a.options.scrollBehavior,n=He&&i;n&&this.listeners.push(Tl());var o=function(){var l=r.current,d=Et(r.base);r.current===Je&&d===r._startLocation||r.transitionTo(d,function(c){n&&ze(a,c,l,!0)})};window.addEventListener("popstate",o),this.listeners.push(function(){window.removeEventListener("popstate",o)})}},t.prototype.go=function(r){window.history.go(r)},t.prototype.push=function(r,a,i){var n=this,o=this,l=o.current;this.transitionTo(r,function(d){qs(Be(n.base+d.fullPath)),ze(n.router,d,l,!1),a&&a(d)},i)},t.prototype.replace=function(r,a,i){var n=this,o=this,l=o.current;this.transitionTo(r,function(d){aa(Be(n.base+d.fullPath)),ze(n.router,d,l,!1),a&&a(d)},i)},t.prototype.ensureURL=function(r){if(Et(this.base)!==this.current.fullPath){var a=Be(this.base+this.current.fullPath);r?qs(a):aa(a)}},t.prototype.getCurrentLocation=function(){return Et(this.base)},t}(we);function Et(e){var t=window.location.pathname,s=t.toLowerCase(),r=e.toLowerCase();return e&&(s===r||s.indexOf(Be(r+"/"))===0)&&(t=t.slice(e.length)),(t||"/")+window.location.search+window.location.hash}var Ll=function(e){function t(s,r,a){e.call(this,s,r),!(a&&fg(this.base))&&Fn()}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.setupListeners=function(){var r=this;if(!(this.listeners.length>0)){var a=this.router,i=a.options.scrollBehavior,n=He&&i;n&&this.listeners.push(Tl());var o=function(){var d=r.current;Fn()&&r.transitionTo(ws(),function(c){n&&ze(r.router,c,d,!0),He||_s(c.fullPath)})},l=He?"popstate":"hashchange";window.addEventListener(l,o),this.listeners.push(function(){window.removeEventListener(l,o)})}},t.prototype.push=function(r,a,i){var n=this,o=this,l=o.current;this.transitionTo(r,function(d){On(d.fullPath),ze(n.router,d,l,!1),a&&a(d)},i)},t.prototype.replace=function(r,a,i){var n=this,o=this,l=o.current;this.transitionTo(r,function(d){_s(d.fullPath),ze(n.router,d,l,!1),a&&a(d)},i)},t.prototype.go=function(r){window.history.go(r)},t.prototype.ensureURL=function(r){var a=this.current.fullPath;ws()!==a&&(r?On(a):_s(a))},t.prototype.getCurrentLocation=function(){return ws()},t}(we);function fg(e){var t=Et(e);if(!/^\/#/.test(t))return window.location.replace(Be(e+"/#"+t)),!0}function Fn(){var e=ws();return e.charAt(0)==="/"?!0:(_s("/"+e),!1)}function ws(){var e=window.location.href,t=e.indexOf("#");return t<0?"":(e=e.slice(t+1),e)}function ia(e){var t=window.location.href,s=t.indexOf("#"),r=s>=0?t.slice(0,s):t;return r+"#"+e}function On(e){He?qs(ia(e)):window.location.hash=e}function _s(e){He?aa(ia(e)):window.location.replace(ia(e))}var mg=function(e){function t(s,r){e.call(this,s,r),this.stack=[],this.index=-1}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.push=function(r,a,i){var n=this;this.transitionTo(r,function(o){n.stack=n.stack.slice(0,n.index+1).concat(o),n.index++,a&&a(o)},i)},t.prototype.replace=function(r,a,i){var n=this;this.transitionTo(r,function(o){n.stack=n.stack.slice(0,n.index).concat(o),a&&a(o)},i)},t.prototype.go=function(r){var a=this,i=this.index+r;if(!(i<0||i>=this.stack.length)){var n=this.stack[i];this.confirmTransition(n,function(){var o=a.current;a.index=i,a.updateRoute(n),a.router.afterHooks.forEach(function(l){l&&l(n,o)})},function(o){Xs(o,ct.duplicated)&&(a.index=i)})}},t.prototype.getCurrentLocation=function(){var r=this.stack[this.stack.length-1];return r?r.fullPath:"/"},t.prototype.ensureURL=function(){},t}(we),H=function(t){t===void 0&&(t={}),this.app=null,this.apps=[],this.options=t,this.beforeHooks=[],this.resolveHooks=[],this.afterHooks=[],this.matcher=qm(t.routes||[],this);var s=t.mode||"hash";switch(this.fallback=s==="history"&&!He&&t.fallback!==!1,this.fallback&&(s="hash"),Kt||(s="abstract"),this.mode=s,s){case"history":this.history=new El(this,t.base);break;case"hash":this.history=new Ll(this,t.base,this.fallback);break;case"abstract":this.history=new mg(this,t.base);break}},jl={currentRoute:{configurable:!0}};H.prototype.match=function(t,s,r){return this.matcher.match(t,s,r)};jl.currentRoute.get=function(){return this.history&&this.history.current};H.prototype.init=function(t){var s=this;if(this.apps.push(t),t.$once("hook:destroyed",function(){var n=s.apps.indexOf(t);n>-1&&s.apps.splice(n,1),s.app===t&&(s.app=s.apps[0]||null),s.app||s.history.teardown()}),!this.app){this.app=t;var r=this.history;if(r instanceof El||r instanceof Ll){var a=function(n){var o=r.current,l=s.options.scrollBehavior,d=He&&l;d&&"fullPath"in n&&ze(s,n,o,!1)},i=function(n){r.setupListeners(),a(n)};r.transitionTo(r.getCurrentLocation(),i,i)}r.listen(function(n){s.apps.forEach(function(o){o._route=n})})}};H.prototype.beforeEach=function(t){return Wa(this.beforeHooks,t)};H.prototype.beforeResolve=function(t){return Wa(this.resolveHooks,t)};H.prototype.afterEach=function(t){return Wa(this.afterHooks,t)};H.prototype.onReady=function(t,s){this.history.onReady(t,s)};H.prototype.onError=function(t){this.history.onError(t)};H.prototype.push=function(t,s,r){var a=this;if(!s&&!r&&typeof Promise<"u")return new Promise(function(i,n){a.history.push(t,i,n)});this.history.push(t,s,r)};H.prototype.replace=function(t,s,r){var a=this;if(!s&&!r&&typeof Promise<"u")return new Promise(function(i,n){a.history.replace(t,i,n)});this.history.replace(t,s,r)};H.prototype.go=function(t){this.history.go(t)};H.prototype.back=function(){this.go(-1)};H.prototype.forward=function(){this.go(1)};H.prototype.getMatchedComponents=function(t){var s=t?t.matched?t:this.resolve(t).route:this.currentRoute;return s?[].concat.apply([],s.matched.map(function(r){return Object.keys(r.components).map(function(a){return r.components[a]})})):[]};H.prototype.resolve=function(t,s,r){s=s||this.history.current;var a=Ha(t,s,r,this),i=this.match(a,s),n=i.redirectedFrom||i.fullPath,o=this.history.base,l=gg(o,n,this.mode);return{location:a,route:i,href:l,normalizedTo:a,resolved:i}};H.prototype.getRoutes=function(){return this.matcher.getRoutes()};H.prototype.addRoute=function(t,s){this.matcher.addRoute(t,s),this.history.current!==Je&&this.history.transitionTo(this.history.getCurrentLocation())};H.prototype.addRoutes=function(t){this.matcher.addRoutes(t),this.history.current!==Je&&this.history.transitionTo(this.history.getCurrentLocation())};Object.defineProperties(H.prototype,jl);var Nl=H;function Wa(e,t){return e.push(t),function(){var s=e.indexOf(t);s>-1&&e.splice(s,1)}}function gg(e,t,s){var r=s==="hash"?"#"+t:t;return e?Be(e+"/"+r):r}H.install=sa;H.version="3.6.5";H.isNavigationFailure=Xs;H.NavigationFailureType=ct;H.START_LOCATION=Je;Kt&&window.Vue&&window.Vue.use(H);function Ul(e,t){return function(){return e.apply(t,arguments)}}const{toString:hg}=Object.prototype,{getPrototypeOf:Za}=Object,{iterator:Qs,toStringTag:Ml}=Symbol,er=(e=>t=>{const s=hg.call(t);return e[s]||(e[s]=s.slice(8,-1).toLowerCase())})(Object.create(null)),_e=e=>(e=e.toLowerCase(),t=>er(t)===e),tr=e=>t=>typeof t===e,{isArray:Ct}=Array,wt=tr("undefined");function Yt(e){return e!==null&&!wt(e)&&e.constructor!==null&&!wt(e.constructor)&&oe(e.constructor.isBuffer)&&e.constructor.isBuffer(e)}const Il=_e("ArrayBuffer");function vg(e){let t;return typeof ArrayBuffer<"u"&&ArrayBuffer.isView?t=ArrayBuffer.isView(e):t=e&&e.buffer&&Il(e.buffer),t}const xg=tr("string"),oe=tr("function"),Bl=tr("number"),Gt=e=>e!==null&&typeof e=="object",bg=e=>e===!0||e===!1,ks=e=>{if(er(e)!=="object")return!1;const t=Za(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Ml in e)&&!(Qs in e)},yg=e=>{if(!Gt(e)||Yt(e))return!1;try{return Object.keys(e).length===0&&Object.getPrototypeOf(e)===Object.prototype}catch{return!1}},wg=_e("Date"),_g=_e("File"),kg=e=>!!(e&&typeof e.uri<"u"),Sg=e=>e&&typeof e.getParts<"u",$g=_e("Blob"),Ag=_e("FileList"),Cg=e=>Gt(e)&&oe(e.pipe);function Rg(){return typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}}const En=Rg(),Ln=typeof En.FormData<"u"?En.FormData:void 0,Tg=e=>{let t;return e&&(Ln&&e instanceof Ln||oe(e.append)&&((t=er(e))==="formdata"||t==="object"&&oe(e.toString)&&e.toString()==="[object FormData]"))},Pg=_e("URLSearchParams"),[Dg,Fg,Og,Eg]=["ReadableStream","Request","Response","Headers"].map(_e),Lg=e=>e.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"");function Jt(e,t,{allOwnKeys:s=!1}={}){if(e===null||typeof e>"u")return;let r,a;if(typeof e!="object"&&(e=[e]),Ct(e))for(r=0,a=e.length;r<a;r++)t.call(null,e[r],r,e);else{if(Yt(e))return;const i=s?Object.getOwnPropertyNames(e):Object.keys(e),n=i.length;let o;for(r=0;r<n;r++)o=i[r],t.call(null,e[o],o,e)}}function zl(e,t){if(Yt(e))return null;t=t.toLowerCase();const s=Object.keys(e);let r=s.length,a;for(;r-- >0;)if(a=s[r],t===a.toLowerCase())return a;return null}const Qe=(()=>typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:global)(),Hl=e=>!wt(e)&&e!==Qe;function na(){const{caseless:e,skipUndefined:t}=Hl(this)&&this||{},s={},r=(a,i)=>{if(i==="__proto__"||i==="constructor"||i==="prototype")return;const n=e&&zl(s,i)||i;ks(s[n])&&ks(a)?s[n]=na(s[n],a):ks(a)?s[n]=na({},a):Ct(a)?s[n]=a.slice():(!t||!wt(a))&&(s[n]=a)};for(let a=0,i=arguments.length;a<i;a++)arguments[a]&&Jt(arguments[a],r);return s}const jg=(e,t,s,{allOwnKeys:r}={})=>(Jt(t,(a,i)=>{s&&oe(a)?Object.defineProperty(e,i,{value:Ul(a,s),writable:!0,enumerable:!0,configurable:!0}):Object.defineProperty(e,i,{value:a,writable:!0,enumerable:!0,configurable:!0})},{allOwnKeys:r}),e),Ng=e=>(e.charCodeAt(0)===65279&&(e=e.slice(1)),e),Ug=(e,t,s,r)=>{e.prototype=Object.create(t.prototype,r),Object.defineProperty(e.prototype,"constructor",{value:e,writable:!0,enumerable:!1,configurable:!0}),Object.defineProperty(e,"super",{value:t.prototype}),s&&Object.assign(e.prototype,s)},Mg=(e,t,s,r)=>{let a,i,n;const o={};if(t=t||{},e==null)return t;do{for(a=Object.getOwnPropertyNames(e),i=a.length;i-- >0;)n=a[i],(!r||r(n,e,t))&&!o[n]&&(t[n]=e[n],o[n]=!0);e=s!==!1&&Za(e)}while(e&&(!s||s(e,t))&&e!==Object.prototype);return t},Ig=(e,t,s)=>{e=String(e),(s===void 0||s>e.length)&&(s=e.length),s-=t.length;const r=e.indexOf(t,s);return r!==-1&&r===s},Bg=e=>{if(!e)return null;if(Ct(e))return e;let t=e.length;if(!Bl(t))return null;const s=new Array(t);for(;t-- >0;)s[t]=e[t];return s},zg=(e=>t=>e&&t instanceof e)(typeof Uint8Array<"u"&&Za(Uint8Array)),Hg=(e,t)=>{const r=(e&&e[Qs]).call(e);let a;for(;(a=r.next())&&!a.done;){const i=a.value;t.call(e,i[0],i[1])}},qg=(e,t)=>{let s;const r=[];for(;(s=e.exec(t))!==null;)r.push(s);return r},Wg=_e("HTMLFormElement"),Zg=e=>e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,function(s,r,a){return r.toUpperCase()+a}),jn=(({hasOwnProperty:e})=>(t,s)=>e.call(t,s))(Object.prototype),Kg=_e("RegExp"),ql=(e,t)=>{const s=Object.getOwnPropertyDescriptors(e),r={};Jt(s,(a,i)=>{let n;(n=t(a,i,e))!==!1&&(r[i]=n||a)}),Object.defineProperties(e,r)},Yg=e=>{ql(e,(t,s)=>{if(oe(e)&&["arguments","caller","callee"].indexOf(s)!==-1)return!1;const r=e[s];if(oe(r)){if(t.enumerable=!1,"writable"in t){t.writable=!1;return}t.set||(t.set=()=>{throw Error("Can not rewrite read-only method '"+s+"'")})}})},Gg=(e,t)=>{const s={},r=a=>{a.forEach(i=>{s[i]=!0})};return Ct(e)?r(e):r(String(e).split(t)),s},Jg=()=>{},Vg=(e,t)=>e!=null&&Number.isFinite(e=+e)?e:t;function Xg(e){return!!(e&&oe(e.append)&&e[Ml]==="FormData"&&e[Qs])}const Qg=e=>{const t=new Array(10),s=(r,a)=>{if(Gt(r)){if(t.indexOf(r)>=0)return;if(Yt(r))return r;if(!("toJSON"in r)){t[a]=r;const i=Ct(r)?[]:{};return Jt(r,(n,o)=>{const l=s(n,a+1);!wt(l)&&(i[o]=l)}),t[a]=void 0,i}}return r};return s(e,0)},eh=_e("AsyncFunction"),th=e=>e&&(Gt(e)||oe(e))&&oe(e.then)&&oe(e.catch),Wl=((e,t)=>e?setImmediate:t?((s,r)=>(Qe.addEventListener("message",({source:a,data:i})=>{a===Qe&&i===s&&r.length&&r.shift()()},!1),a=>{r.push(a),Qe.postMessage(s,"*")}))(`axios@${Math.random()}`,[]):s=>setTimeout(s))(typeof setImmediate=="function",oe(Qe.postMessage)),sh=typeof queueMicrotask<"u"?queueMicrotask.bind(Qe):typeof process<"u"&&process.nextTick||Wl,rh=e=>e!=null&&oe(e[Qs]),x={isArray:Ct,isArrayBuffer:Il,isBuffer:Yt,isFormData:Tg,isArrayBufferView:vg,isString:xg,isNumber:Bl,isBoolean:bg,isObject:Gt,isPlainObject:ks,isEmptyObject:yg,isReadableStream:Dg,isRequest:Fg,isResponse:Og,isHeaders:Eg,isUndefined:wt,isDate:wg,isFile:_g,isReactNativeBlob:kg,isReactNative:Sg,isBlob:$g,isRegExp:Kg,isFunction:oe,isStream:Cg,isURLSearchParams:Pg,isTypedArray:zg,isFileList:Ag,forEach:Jt,merge:na,extend:jg,trim:Lg,stripBOM:Ng,inherits:Ug,toFlatObject:Mg,kindOf:er,kindOfTest:_e,endsWith:Ig,toArray:Bg,forEachEntry:Hg,matchAll:qg,isHTMLForm:Wg,hasOwnProperty:jn,hasOwnProp:jn,reduceDescriptors:ql,freezeMethods:Yg,toObjectSet:Gg,toCamelCase:Zg,noop:Jg,toFiniteNumber:Vg,findKey:zl,global:Qe,isContextDefined:Hl,isSpecCompliantForm:Xg,toJSONObject:Qg,isAsyncFn:eh,isThenable:th,setImmediate:Wl,asap:sh,isIterable:rh};class ie extends Error{static from(t,s,r,a,i,n){const o=new ie(t.message,s||t.code,r,a,i);return o.cause=t,o.name=t.name,t.status!=null&&o.status==null&&(o.status=t.status),n&&Object.assign(o,n),o}constructor(t,s,r,a,i){super(t),Object.defineProperty(this,"message",{value:t,enumerable:!0,writable:!0,configurable:!0}),this.name="AxiosError",this.isAxiosError=!0,s&&(this.code=s),r&&(this.config=r),a&&(this.request=a),i&&(this.response=i,this.status=i.status)}toJSON(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:x.toJSONObject(this.config),code:this.code,status:this.status}}}ie.ERR_BAD_OPTION_VALUE="ERR_BAD_OPTION_VALUE";ie.ERR_BAD_OPTION="ERR_BAD_OPTION";ie.ECONNABORTED="ECONNABORTED";ie.ETIMEDOUT="ETIMEDOUT";ie.ERR_NETWORK="ERR_NETWORK";ie.ERR_FR_TOO_MANY_REDIRECTS="ERR_FR_TOO_MANY_REDIRECTS";ie.ERR_DEPRECATED="ERR_DEPRECATED";ie.ERR_BAD_RESPONSE="ERR_BAD_RESPONSE";ie.ERR_BAD_REQUEST="ERR_BAD_REQUEST";ie.ERR_CANCELED="ERR_CANCELED";ie.ERR_NOT_SUPPORT="ERR_NOT_SUPPORT";ie.ERR_INVALID_URL="ERR_INVALID_URL";const I=ie,ah=null;function oa(e){return x.isPlainObject(e)||x.isArray(e)}function Zl(e){return x.endsWith(e,"[]")?e.slice(0,-2):e}function yr(e,t,s){return e?e.concat(t).map(function(a,i){return a=Zl(a),!s&&i?"["+a+"]":a}).join(s?".":""):t}function ih(e){return x.isArray(e)&&!e.some(oa)}const nh=x.toFlatObject(x,{},null,function(t){return/^is[A-Z]/.test(t)});function sr(e,t,s){if(!x.isObject(e))throw new TypeError("target must be an object");t=t||new FormData,s=x.toFlatObject(s,{metaTokens:!0,dots:!1,indexes:!1},!1,function(m,f){return!x.isUndefined(f[m])});const r=s.metaTokens,a=s.visitor||c,i=s.dots,n=s.indexes,l=(s.Blob||typeof Blob<"u"&&Blob)&&x.isSpecCompliantForm(t);if(!x.isFunction(a))throw new TypeError("visitor must be a function");function d(p){if(p===null)return"";if(x.isDate(p))return p.toISOString();if(x.isBoolean(p))return p.toString();if(!l&&x.isBlob(p))throw new I("Blob is not supported. Use a Buffer instead.");return x.isArrayBuffer(p)||x.isTypedArray(p)?l&&typeof Blob=="function"?new Blob([p]):Buffer.from(p):p}function c(p,m,f){let _=p;if(x.isReactNative(t)&&x.isReactNativeBlob(p))return t.append(yr(f,m,i),d(p)),!1;if(p&&!f&&typeof p=="object"){if(x.endsWith(m,"{}"))m=r?m:m.slice(0,-2),p=JSON.stringify(p);else if(x.isArray(p)&&ih(p)||(x.isFileList(p)||x.endsWith(m,"[]"))&&(_=x.toArray(p)))return m=Zl(m),_.forEach(function(S,C){!(x.isUndefined(S)||S===null)&&t.append(n===!0?yr([m],C,i):n===null?m:m+"[]",d(S))}),!1}return oa(p)?!0:(t.append(yr(f,m,i),d(p)),!1)}const u=[],v=Object.assign(nh,{defaultVisitor:c,convertValue:d,isVisitable:oa});function y(p,m){if(!x.isUndefined(p)){if(u.indexOf(p)!==-1)throw Error("Circular reference detected in "+m.join("."));u.push(p),x.forEach(p,function(_,k){(!(x.isUndefined(_)||_===null)&&a.call(t,_,x.isString(k)?k.trim():k,m,v))===!0&&y(_,m?m.concat(k):[k])}),u.pop()}}if(!x.isObject(e))throw new TypeError("data must be an object");return y(e),t}function Nn(e){const t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g,function(r){return t[r]})}function Ka(e,t){this._pairs=[],e&&sr(e,this,t)}const Kl=Ka.prototype;Kl.append=function(t,s){this._pairs.push([t,s])};Kl.toString=function(t){const s=t?function(r){return t.call(this,r,Nn)}:Nn;return this._pairs.map(function(a){return s(a[0])+"="+s(a[1])},"").join("&")};function oh(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+")}function Yl(e,t,s){if(!t)return e;const r=s&&s.encode||oh,a=x.isFunction(s)?{serialize:s}:s,i=a&&a.serialize;let n;if(i?n=i(t,a):n=x.isURLSearchParams(t)?t.toString():new Ka(t,a).toString(r),n){const o=e.indexOf("#");o!==-1&&(e=e.slice(0,o)),e+=(e.indexOf("?")===-1?"?":"&")+n}return e}class lh{constructor(){this.handlers=[]}use(t,s,r){return this.handlers.push({fulfilled:t,rejected:s,synchronous:r?r.synchronous:!1,runWhen:r?r.runWhen:null}),this.handlers.length-1}eject(t){this.handlers[t]&&(this.handlers[t]=null)}clear(){this.handlers&&(this.handlers=[])}forEach(t){x.forEach(this.handlers,function(r){r!==null&&t(r)})}}const Un=lh,Ya={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1,legacyInterceptorReqResOrdering:!0},dh=typeof URLSearchParams<"u"?URLSearchParams:Ka,ch=typeof FormData<"u"?FormData:null,uh=typeof Blob<"u"?Blob:null,ph={isBrowser:!0,classes:{URLSearchParams:dh,FormData:ch,Blob:uh},protocols:["http","https","file","blob","url","data"]},Ga=typeof window<"u"&&typeof document<"u",la=typeof navigator=="object"&&navigator||void 0,fh=Ga&&(!la||["ReactNative","NativeScript","NS"].indexOf(la.product)<0),mh=(()=>typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&typeof self.importScripts=="function")(),gh=Ga&&window.location.href||"http://localhost",hh=Object.freeze(Object.defineProperty({__proto__:null,hasBrowserEnv:Ga,hasStandardBrowserEnv:fh,hasStandardBrowserWebWorkerEnv:mh,navigator:la,origin:gh},Symbol.toStringTag,{value:"Module"})),ee={...hh,...ph};function vh(e,t){return sr(e,new ee.classes.URLSearchParams,{visitor:function(s,r,a,i){return ee.isNode&&x.isBuffer(s)?(this.append(r,s.toString("base64")),!1):i.defaultVisitor.apply(this,arguments)},...t})}function xh(e){return x.matchAll(/\w+|\[(\w*)]/g,e).map(t=>t[0]==="[]"?"":t[1]||t[0])}function bh(e){const t={},s=Object.keys(e);let r;const a=s.length;let i;for(r=0;r<a;r++)i=s[r],t[i]=e[i];return t}function Gl(e){function t(s,r,a,i){let n=s[i++];if(n==="__proto__")return!0;const o=Number.isFinite(+n),l=i>=s.length;return n=!n&&x.isArray(a)?a.length:n,l?(x.hasOwnProp(a,n)?a[n]=[a[n],r]:a[n]=r,!o):((!a[n]||!x.isObject(a[n]))&&(a[n]=[]),t(s,r,a[n],i)&&x.isArray(a[n])&&(a[n]=bh(a[n])),!o)}if(x.isFormData(e)&&x.isFunction(e.entries)){const s={};return x.forEachEntry(e,(r,a)=>{t(xh(r),a,s,0)}),s}return null}function yh(e,t,s){if(x.isString(e))try{return(t||JSON.parse)(e),x.trim(e)}catch(r){if(r.name!=="SyntaxError")throw r}return(s||JSON.stringify)(e)}const Ja={transitional:Ya,adapter:["xhr","http","fetch"],transformRequest:[function(t,s){const r=s.getContentType()||"",a=r.indexOf("application/json")>-1,i=x.isObject(t);if(i&&x.isHTMLForm(t)&&(t=new FormData(t)),x.isFormData(t))return a?JSON.stringify(Gl(t)):t;if(x.isArrayBuffer(t)||x.isBuffer(t)||x.isStream(t)||x.isFile(t)||x.isBlob(t)||x.isReadableStream(t))return t;if(x.isArrayBufferView(t))return t.buffer;if(x.isURLSearchParams(t))return s.setContentType("application/x-www-form-urlencoded;charset=utf-8",!1),t.toString();let o;if(i){if(r.indexOf("application/x-www-form-urlencoded")>-1)return vh(t,this.formSerializer).toString();if((o=x.isFileList(t))||r.indexOf("multipart/form-data")>-1){const l=this.env&&this.env.FormData;return sr(o?{"files[]":t}:t,l&&new l,this.formSerializer)}}return i||a?(s.setContentType("application/json",!1),yh(t)):t}],transformResponse:[function(t){const s=this.transitional||Ja.transitional,r=s&&s.forcedJSONParsing,a=this.responseType==="json";if(x.isResponse(t)||x.isReadableStream(t))return t;if(t&&x.isString(t)&&(r&&!this.responseType||a)){const n=!(s&&s.silentJSONParsing)&&a;try{return JSON.parse(t,this.parseReviver)}catch(o){if(n)throw o.name==="SyntaxError"?I.from(o,I.ERR_BAD_RESPONSE,this,null,this.response):o}}return t}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:ee.classes.FormData,Blob:ee.classes.Blob},validateStatus:function(t){return t>=200&&t<300},headers:{common:{Accept:"application/json, text/plain, */*","Content-Type":void 0}}};x.forEach(["delete","get","head","post","put","patch"],e=>{Ja.headers[e]={}});const Va=Ja,wh=x.toObjectSet(["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"]),_h=e=>{const t={};let s,r,a;return e&&e.split(`
`).forEach(function(n){a=n.indexOf(":"),s=n.substring(0,a).trim().toLowerCase(),r=n.substring(a+1).trim(),!(!s||t[s]&&wh[s])&&(s==="set-cookie"?t[s]?t[s].push(r):t[s]=[r]:t[s]=t[s]?t[s]+", "+r:r)}),t},Mn=Symbol("internals"),kh=e=>!/[\r\n]/.test(e);function Jl(e,t){if(!(e===!1||e==null)){if(x.isArray(e)){e.forEach(s=>Jl(s,t));return}if(!kh(String(e)))throw new Error(`Invalid character in header content ["${t}"]`)}}function Ft(e){return e&&String(e).trim().toLowerCase()}function Sh(e){let t=e.length;for(;t>0;){const s=e.charCodeAt(t-1);if(s!==10&&s!==13)break;t-=1}return t===e.length?e:e.slice(0,t)}function Ss(e){return e===!1||e==null?e:x.isArray(e)?e.map(Ss):Sh(String(e))}function $h(e){const t=Object.create(null),s=/([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;let r;for(;r=s.exec(e);)t[r[1]]=r[2];return t}const Ah=e=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());function wr(e,t,s,r,a){if(x.isFunction(r))return r.call(this,t,s);if(a&&(t=s),!!x.isString(t)){if(x.isString(r))return t.indexOf(r)!==-1;if(x.isRegExp(r))return r.test(t)}}function Ch(e){return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g,(t,s,r)=>s.toUpperCase()+r)}function Rh(e,t){const s=x.toCamelCase(" "+t);["get","set","has"].forEach(r=>{Object.defineProperty(e,r+s,{value:function(a,i,n){return this[r].call(this,t,a,i,n)},configurable:!0})})}class rr{constructor(t){t&&this.set(t)}set(t,s,r){const a=this;function i(o,l,d){const c=Ft(l);if(!c)throw new Error("header name must be a non-empty string");const u=x.findKey(a,c);(!u||a[u]===void 0||d===!0||d===void 0&&a[u]!==!1)&&(Jl(o,l),a[u||l]=Ss(o))}const n=(o,l)=>x.forEach(o,(d,c)=>i(d,c,l));if(x.isPlainObject(t)||t instanceof this.constructor)n(t,s);else if(x.isString(t)&&(t=t.trim())&&!Ah(t))n(_h(t),s);else if(x.isObject(t)&&x.isIterable(t)){let o={},l,d;for(const c of t){if(!x.isArray(c))throw TypeError("Object iterator must return a key-value pair");o[d=c[0]]=(l=o[d])?x.isArray(l)?[...l,c[1]]:[l,c[1]]:c[1]}n(o,s)}else t!=null&&i(s,t,r);return this}get(t,s){if(t=Ft(t),t){const r=x.findKey(this,t);if(r){const a=this[r];if(!s)return a;if(s===!0)return $h(a);if(x.isFunction(s))return s.call(this,a,r);if(x.isRegExp(s))return s.exec(a);throw new TypeError("parser must be boolean|regexp|function")}}}has(t,s){if(t=Ft(t),t){const r=x.findKey(this,t);return!!(r&&this[r]!==void 0&&(!s||wr(this,this[r],r,s)))}return!1}delete(t,s){const r=this;let a=!1;function i(n){if(n=Ft(n),n){const o=x.findKey(r,n);o&&(!s||wr(r,r[o],o,s))&&(delete r[o],a=!0)}}return x.isArray(t)?t.forEach(i):i(t),a}clear(t){const s=Object.keys(this);let r=s.length,a=!1;for(;r--;){const i=s[r];(!t||wr(this,this[i],i,t,!0))&&(delete this[i],a=!0)}return a}normalize(t){const s=this,r={};return x.forEach(this,(a,i)=>{const n=x.findKey(r,i);if(n){s[n]=Ss(a),delete s[i];return}const o=t?Ch(i):String(i).trim();o!==i&&delete s[i],s[o]=Ss(a),r[o]=!0}),this}concat(...t){return this.constructor.concat(this,...t)}toJSON(t){const s=Object.create(null);return x.forEach(this,(r,a)=>{r!=null&&r!==!1&&(s[a]=t&&x.isArray(r)?r.join(", "):r)}),s}[Symbol.iterator](){return Object.entries(this.toJSON())[Symbol.iterator]()}toString(){return Object.entries(this.toJSON()).map(([t,s])=>t+": "+s).join(`
`)}getSetCookie(){return this.get("set-cookie")||[]}get[Symbol.toStringTag](){return"AxiosHeaders"}static from(t){return t instanceof this?t:new this(t)}static concat(t,...s){const r=new this(t);return s.forEach(a=>r.set(a)),r}static accessor(t){const r=(this[Mn]=this[Mn]={accessors:{}}).accessors,a=this.prototype;function i(n){const o=Ft(n);r[o]||(Rh(a,n),r[o]=!0)}return x.isArray(t)?t.forEach(i):i(t),this}}rr.accessor(["Content-Type","Content-Length","Accept","Accept-Encoding","User-Agent","Authorization"]);x.reduceDescriptors(rr.prototype,({value:e},t)=>{let s=t[0].toUpperCase()+t.slice(1);return{get:()=>e,set(r){this[s]=r}}});x.freezeMethods(rr);const be=rr;function _r(e,t){const s=this||Va,r=t||s,a=be.from(r.headers);let i=r.data;return x.forEach(e,function(o){i=o.call(s,i,a.normalize(),t?t.status:void 0)}),a.normalize(),i}function Vl(e){return!!(e&&e.__CANCEL__)}class Th extends I{constructor(t,s,r){super(t??"canceled",I.ERR_CANCELED,s,r),this.name="CanceledError",this.__CANCEL__=!0}}const Vt=Th;function Xl(e,t,s){const r=s.config.validateStatus;!s.status||!r||r(s.status)?e(s):t(new I("Request failed with status code "+s.status,[I.ERR_BAD_REQUEST,I.ERR_BAD_RESPONSE][Math.floor(s.status/100)-4],s.config,s.request,s))}function Ph(e){const t=/^([-+\w]{1,25})(:?\/\/|:)/.exec(e);return t&&t[1]||""}function Dh(e,t){e=e||10;const s=new Array(e),r=new Array(e);let a=0,i=0,n;return t=t!==void 0?t:1e3,function(l){const d=Date.now(),c=r[i];n||(n=d),s[a]=l,r[a]=d;let u=i,v=0;for(;u!==a;)v+=s[u++],u=u%e;if(a=(a+1)%e,a===i&&(i=(i+1)%e),d-n<t)return;const y=c&&d-c;return y?Math.round(v*1e3/y):void 0}}function Fh(e,t){let s=0,r=1e3/t,a,i;const n=(d,c=Date.now())=>{s=c,a=null,i&&(clearTimeout(i),i=null),e(...d)};return[(...d)=>{const c=Date.now(),u=c-s;u>=r?n(d,c):(a=d,i||(i=setTimeout(()=>{i=null,n(a)},r-u)))},()=>a&&n(a)]}const Zs=(e,t,s=3)=>{let r=0;const a=Dh(50,250);return Fh(i=>{const n=i.loaded,o=i.lengthComputable?i.total:void 0,l=n-r,d=a(l),c=n<=o;r=n;const u={loaded:n,total:o,progress:o?n/o:void 0,bytes:l,rate:d||void 0,estimated:d&&o&&c?(o-n)/d:void 0,event:i,lengthComputable:o!=null,[t?"download":"upload"]:!0};e(u)},s)},In=(e,t)=>{const s=e!=null;return[r=>t[0]({lengthComputable:s,total:e,loaded:r}),t[1]]},Bn=e=>(...t)=>x.asap(()=>e(...t)),Oh=ee.hasStandardBrowserEnv?((e,t)=>s=>(s=new URL(s,ee.origin),e.protocol===s.protocol&&e.host===s.host&&(t||e.port===s.port)))(new URL(ee.origin),ee.navigator&&/(msie|trident)/i.test(ee.navigator.userAgent)):()=>!0,Eh=ee.hasStandardBrowserEnv?{write(e,t,s,r,a,i,n){if(typeof document>"u")return;const o=[`${e}=${encodeURIComponent(t)}`];x.isNumber(s)&&o.push(`expires=${new Date(s).toUTCString()}`),x.isString(r)&&o.push(`path=${r}`),x.isString(a)&&o.push(`domain=${a}`),i===!0&&o.push("secure"),x.isString(n)&&o.push(`SameSite=${n}`),document.cookie=o.join("; ")},read(e){if(typeof document>"u")return null;const t=document.cookie.match(new RegExp("(?:^|; )"+e+"=([^;]*)"));return t?decodeURIComponent(t[1]):null},remove(e){this.write(e,"",Date.now()-864e5,"/")}}:{write(){},read(){return null},remove(){}};function Lh(e){return typeof e!="string"?!1:/^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)}function jh(e,t){return t?e.replace(/\/?\/$/,"")+"/"+t.replace(/^\/+/,""):e}function Ql(e,t,s){let r=!Lh(t);return e&&(r||s==!1)?jh(e,t):t}const zn=e=>e instanceof be?{...e}:e;function dt(e,t){t=t||{};const s={};function r(d,c,u,v){return x.isPlainObject(d)&&x.isPlainObject(c)?x.merge.call({caseless:v},d,c):x.isPlainObject(c)?x.merge({},c):x.isArray(c)?c.slice():c}function a(d,c,u,v){if(x.isUndefined(c)){if(!x.isUndefined(d))return r(void 0,d,u,v)}else return r(d,c,u,v)}function i(d,c){if(!x.isUndefined(c))return r(void 0,c)}function n(d,c){if(x.isUndefined(c)){if(!x.isUndefined(d))return r(void 0,d)}else return r(void 0,c)}function o(d,c,u){if(u in t)return r(d,c);if(u in e)return r(void 0,d)}const l={url:i,method:i,data:i,baseURL:n,transformRequest:n,transformResponse:n,paramsSerializer:n,timeout:n,timeoutMessage:n,withCredentials:n,withXSRFToken:n,adapter:n,responseType:n,xsrfCookieName:n,xsrfHeaderName:n,onUploadProgress:n,onDownloadProgress:n,decompress:n,maxContentLength:n,maxBodyLength:n,beforeRedirect:n,transport:n,httpAgent:n,httpsAgent:n,cancelToken:n,socketPath:n,responseEncoding:n,validateStatus:o,headers:(d,c,u)=>a(zn(d),zn(c),u,!0)};return x.forEach(Object.keys({...e,...t}),function(c){if(c==="__proto__"||c==="constructor"||c==="prototype")return;const u=x.hasOwnProp(l,c)?l[c]:a,v=u(e[c],t[c],c);x.isUndefined(v)&&u!==o||(s[c]=v)}),s}const ed=e=>{const t=dt({},e);let{data:s,withXSRFToken:r,xsrfHeaderName:a,xsrfCookieName:i,headers:n,auth:o}=t;if(t.headers=n=be.from(n),t.url=Yl(Ql(t.baseURL,t.url,t.allowAbsoluteUrls),e.params,e.paramsSerializer),o&&n.set("Authorization","Basic "+btoa((o.username||"")+":"+(o.password?unescape(encodeURIComponent(o.password)):""))),x.isFormData(s)){if(ee.hasStandardBrowserEnv||ee.hasStandardBrowserWebWorkerEnv)n.setContentType(void 0);else if(x.isFunction(s.getHeaders)){const l=s.getHeaders(),d=["content-type","content-length"];Object.entries(l).forEach(([c,u])=>{d.includes(c.toLowerCase())&&n.set(c,u)})}}if(ee.hasStandardBrowserEnv&&(r&&x.isFunction(r)&&(r=r(t)),r||r!==!1&&Oh(t.url))){const l=a&&i&&Eh.read(i);l&&n.set(a,l)}return t},Nh=typeof XMLHttpRequest<"u",Uh=Nh&&function(e){return new Promise(function(s,r){const a=ed(e);let i=a.data;const n=be.from(a.headers).normalize();let{responseType:o,onUploadProgress:l,onDownloadProgress:d}=a,c,u,v,y,p;function m(){y&&y(),p&&p(),a.cancelToken&&a.cancelToken.unsubscribe(c),a.signal&&a.signal.removeEventListener("abort",c)}let f=new XMLHttpRequest;f.open(a.method.toUpperCase(),a.url,!0),f.timeout=a.timeout;function _(){if(!f)return;const S=be.from("getAllResponseHeaders"in f&&f.getAllResponseHeaders()),P={data:!o||o==="text"||o==="json"?f.responseText:f.response,status:f.status,statusText:f.statusText,headers:S,config:e,request:f};Xl(function(T){s(T),m()},function(T){r(T),m()},P),f=null}"onloadend"in f?f.onloadend=_:f.onreadystatechange=function(){!f||f.readyState!==4||f.status===0&&!(f.responseURL&&f.responseURL.indexOf("file:")===0)||setTimeout(_)},f.onabort=function(){f&&(r(new I("Request aborted",I.ECONNABORTED,e,f)),f=null)},f.onerror=function(C){const P=C&&C.message?C.message:"Network Error",F=new I(P,I.ERR_NETWORK,e,f);F.event=C||null,r(F),f=null},f.ontimeout=function(){let C=a.timeout?"timeout of "+a.timeout+"ms exceeded":"timeout exceeded";const P=a.transitional||Ya;a.timeoutErrorMessage&&(C=a.timeoutErrorMessage),r(new I(C,P.clarifyTimeoutError?I.ETIMEDOUT:I.ECONNABORTED,e,f)),f=null},i===void 0&&n.setContentType(null),"setRequestHeader"in f&&x.forEach(n.toJSON(),function(C,P){f.setRequestHeader(P,C)}),x.isUndefined(a.withCredentials)||(f.withCredentials=!!a.withCredentials),o&&o!=="json"&&(f.responseType=a.responseType),d&&([v,p]=Zs(d,!0),f.addEventListener("progress",v)),l&&f.upload&&([u,y]=Zs(l),f.upload.addEventListener("progress",u),f.upload.addEventListener("loadend",y)),(a.cancelToken||a.signal)&&(c=S=>{f&&(r(!S||S.type?new Vt(null,e,f):S),f.abort(),f=null)},a.cancelToken&&a.cancelToken.subscribe(c),a.signal&&(a.signal.aborted?c():a.signal.addEventListener("abort",c)));const k=Ph(a.url);if(k&&ee.protocols.indexOf(k)===-1){r(new I("Unsupported protocol "+k+":",I.ERR_BAD_REQUEST,e));return}f.send(i||null)})},Mh=(e,t)=>{const{length:s}=e=e?e.filter(Boolean):[];if(t||s){let r=new AbortController,a;const i=function(d){if(!a){a=!0,o();const c=d instanceof Error?d:this.reason;r.abort(c instanceof I?c:new Vt(c instanceof Error?c.message:c))}};let n=t&&setTimeout(()=>{n=null,i(new I(`timeout of ${t}ms exceeded`,I.ETIMEDOUT))},t);const o=()=>{e&&(n&&clearTimeout(n),n=null,e.forEach(d=>{d.unsubscribe?d.unsubscribe(i):d.removeEventListener("abort",i)}),e=null)};e.forEach(d=>d.addEventListener("abort",i));const{signal:l}=r;return l.unsubscribe=()=>x.asap(o),l}},Ih=Mh,Bh=function*(e,t){let s=e.byteLength;if(!t||s<t){yield e;return}let r=0,a;for(;r<s;)a=r+t,yield e.slice(r,a),r=a},zh=async function*(e,t){for await(const s of Hh(e))yield*Bh(s,t)},Hh=async function*(e){if(e[Symbol.asyncIterator]){yield*e;return}const t=e.getReader();try{for(;;){const{done:s,value:r}=await t.read();if(s)break;yield r}}finally{await t.cancel()}},Hn=(e,t,s,r)=>{const a=zh(e,t);let i=0,n,o=l=>{n||(n=!0,r&&r(l))};return new ReadableStream({async pull(l){try{const{done:d,value:c}=await a.next();if(d){o(),l.close();return}let u=c.byteLength;if(s){let v=i+=u;s(v)}l.enqueue(new Uint8Array(c))}catch(d){throw o(d),d}},cancel(l){return o(l),a.return()}},{highWaterMark:2})},qn=64*1024,{isFunction:ls}=x,qh=(({Request:e,Response:t})=>({Request:e,Response:t}))(x.global),{ReadableStream:Wn,TextEncoder:Zn}=x.global,Kn=(e,...t)=>{try{return!!e(...t)}catch{return!1}},Wh=e=>{e=x.merge.call({skipUndefined:!0},qh,e);const{fetch:t,Request:s,Response:r}=e,a=t?ls(t):typeof fetch=="function",i=ls(s),n=ls(r);if(!a)return!1;const o=a&&ls(Wn),l=a&&(typeof Zn=="function"?(p=>m=>p.encode(m))(new Zn):async p=>new Uint8Array(await new s(p).arrayBuffer())),d=i&&o&&Kn(()=>{let p=!1;const m=new Wn,f=new s(ee.origin,{body:m,method:"POST",get duplex(){return p=!0,"half"}}).headers.has("Content-Type");return m.cancel(),p&&!f}),c=n&&o&&Kn(()=>x.isReadableStream(new r("").body)),u={stream:c&&(p=>p.body)};a&&["text","arrayBuffer","blob","formData","stream"].forEach(p=>{!u[p]&&(u[p]=(m,f)=>{let _=m&&m[p];if(_)return _.call(m);throw new I(`Response type '${p}' is not supported`,I.ERR_NOT_SUPPORT,f)})});const v=async p=>{if(p==null)return 0;if(x.isBlob(p))return p.size;if(x.isSpecCompliantForm(p))return(await new s(ee.origin,{method:"POST",body:p}).arrayBuffer()).byteLength;if(x.isArrayBufferView(p)||x.isArrayBuffer(p))return p.byteLength;if(x.isURLSearchParams(p)&&(p=p+""),x.isString(p))return(await l(p)).byteLength},y=async(p,m)=>{const f=x.toFiniteNumber(p.getContentLength());return f??v(m)};return async p=>{let{url:m,method:f,data:_,signal:k,cancelToken:S,timeout:C,onDownloadProgress:P,onUploadProgress:F,responseType:T,headers:z,withCredentials:V="same-origin",fetchOptions:K}=ed(p),ne=t||fetch;T=T?(T+"").toLowerCase():"text";let h=Ih([k,S&&S.toAbortSignal()],C),g=null;const w=h&&h.unsubscribe&&(()=>{h.unsubscribe()});let $;try{if(F&&d&&f!=="get"&&f!=="head"&&($=await y(z,_))!==0){let L=new s(m,{method:"POST",body:_,duplex:"half"}),U;if(x.isFormData(_)&&(U=L.headers.get("content-type"))&&z.setContentType(U),L.body){const[W,X]=In($,Zs(Bn(F)));_=Hn(L.body,qn,W,X)}}x.isString(V)||(V=V?"include":"omit");const A=i&&"credentials"in s.prototype,j={...K,signal:h,method:f.toUpperCase(),headers:z.normalize().toJSON(),body:_,duplex:"half",credentials:A?V:void 0};g=i&&new s(m,j);let R=await(i?ne(g,K):ne(m,j));const E=c&&(T==="stream"||T==="response");if(c&&(P||E&&w)){const L={};["status","statusText","headers"].forEach(ke=>{L[ke]=R[ke]});const U=x.toFiniteNumber(R.headers.get("content-length")),[W,X]=P&&In(U,Zs(Bn(P),!0))||[];R=new r(Hn(R.body,qn,W,()=>{X&&X(),w&&w()}),L)}T=T||"text";let M=await u[x.findKey(u,T)||"text"](R,p);return!E&&w&&w(),await new Promise((L,U)=>{Xl(L,U,{data:M,headers:be.from(R.headers),status:R.status,statusText:R.statusText,config:p,request:g})})}catch(A){throw w&&w(),A&&A.name==="TypeError"&&/Load failed|fetch/i.test(A.message)?Object.assign(new I("Network Error",I.ERR_NETWORK,p,g,A&&A.response),{cause:A.cause||A}):I.from(A,A&&A.code,p,g,A&&A.response)}}},Zh=new Map,td=e=>{let t=e&&e.env||{};const{fetch:s,Request:r,Response:a}=t,i=[r,a,s];let n=i.length,o=n,l,d,c=Zh;for(;o--;)l=i[o],d=c.get(l),d===void 0&&c.set(l,d=o?new Map:Wh(t)),c=d;return d};td();const Xa={http:ah,xhr:Uh,fetch:{get:td}};x.forEach(Xa,(e,t)=>{if(e){try{Object.defineProperty(e,"name",{value:t})}catch{}Object.defineProperty(e,"adapterName",{value:t})}});const Yn=e=>`- ${e}`,Kh=e=>x.isFunction(e)||e===null||e===!1;function Yh(e,t){e=x.isArray(e)?e:[e];const{length:s}=e;let r,a;const i={};for(let n=0;n<s;n++){r=e[n];let o;if(a=r,!Kh(r)&&(a=Xa[(o=String(r)).toLowerCase()],a===void 0))throw new I(`Unknown adapter '${o}'`);if(a&&(x.isFunction(a)||(a=a.get(t))))break;i[o||"#"+n]=a}if(!a){const n=Object.entries(i).map(([l,d])=>`adapter ${l} `+(d===!1?"is not supported by the environment":"is not available in the build"));let o=s?n.length>1?`since :
`+n.map(Yn).join(`
`):" "+Yn(n[0]):"as no adapter specified";throw new I("There is no suitable adapter to dispatch the request "+o,"ERR_NOT_SUPPORT")}return a}const sd={getAdapter:Yh,adapters:Xa};function kr(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new Vt(null,e)}function Gn(e){return kr(e),e.headers=be.from(e.headers),e.data=_r.call(e,e.transformRequest),["post","put","patch"].indexOf(e.method)!==-1&&e.headers.setContentType("application/x-www-form-urlencoded",!1),sd.getAdapter(e.adapter||Va.adapter,e)(e).then(function(r){return kr(e),r.data=_r.call(e,e.transformResponse,r),r.headers=be.from(r.headers),r},function(r){return Vl(r)||(kr(e),r&&r.response&&(r.response.data=_r.call(e,e.transformResponse,r.response),r.response.headers=be.from(r.response.headers))),Promise.reject(r)})}const rd="1.15.0",ar={};["object","boolean","number","function","string","symbol"].forEach((e,t)=>{ar[e]=function(r){return typeof r===e||"a"+(t<1?"n ":" ")+e}});const Jn={};ar.transitional=function(t,s,r){function a(i,n){return"[Axios v"+rd+"] Transitional option '"+i+"'"+n+(r?". "+r:"")}return(i,n,o)=>{if(t===!1)throw new I(a(n," has been removed"+(s?" in "+s:"")),I.ERR_DEPRECATED);return s&&!Jn[n]&&(Jn[n]=!0,console.warn(a(n," has been deprecated since v"+s+" and will be removed in the near future"))),t?t(i,n,o):!0}};ar.spelling=function(t){return(s,r)=>(console.warn(`${r} is likely a misspelling of ${t}`),!0)};function Gh(e,t,s){if(typeof e!="object")throw new I("options must be an object",I.ERR_BAD_OPTION_VALUE);const r=Object.keys(e);let a=r.length;for(;a-- >0;){const i=r[a],n=t[i];if(n){const o=e[i],l=o===void 0||n(o,i,e);if(l!==!0)throw new I("option "+i+" must be "+l,I.ERR_BAD_OPTION_VALUE);continue}if(s!==!0)throw new I("Unknown option "+i,I.ERR_BAD_OPTION)}}const $s={assertOptions:Gh,validators:ar},fe=$s.validators;class Ks{constructor(t){this.defaults=t||{},this.interceptors={request:new Un,response:new Un}}async request(t,s){try{return await this._request(t,s)}catch(r){if(r instanceof Error){let a={};Error.captureStackTrace?Error.captureStackTrace(a):a=new Error;const i=(()=>{if(!a.stack)return"";const n=a.stack.indexOf(`
`);return n===-1?"":a.stack.slice(n+1)})();try{if(!r.stack)r.stack=i;else if(i){const n=i.indexOf(`
`),o=n===-1?-1:i.indexOf(`
`,n+1),l=o===-1?"":i.slice(o+1);String(r.stack).endsWith(l)||(r.stack+=`
`+i)}}catch{}}throw r}}_request(t,s){typeof t=="string"?(s=s||{},s.url=t):s=t||{},s=dt(this.defaults,s);const{transitional:r,paramsSerializer:a,headers:i}=s;r!==void 0&&$s.assertOptions(r,{silentJSONParsing:fe.transitional(fe.boolean),forcedJSONParsing:fe.transitional(fe.boolean),clarifyTimeoutError:fe.transitional(fe.boolean),legacyInterceptorReqResOrdering:fe.transitional(fe.boolean)},!1),a!=null&&(x.isFunction(a)?s.paramsSerializer={serialize:a}:$s.assertOptions(a,{encode:fe.function,serialize:fe.function},!0)),s.allowAbsoluteUrls!==void 0||(this.defaults.allowAbsoluteUrls!==void 0?s.allowAbsoluteUrls=this.defaults.allowAbsoluteUrls:s.allowAbsoluteUrls=!0),$s.assertOptions(s,{baseUrl:fe.spelling("baseURL"),withXsrfToken:fe.spelling("withXSRFToken")},!0),s.method=(s.method||this.defaults.method||"get").toLowerCase();let n=i&&x.merge(i.common,i[s.method]);i&&x.forEach(["delete","get","head","post","put","patch","common"],p=>{delete i[p]}),s.headers=be.concat(n,i);const o=[];let l=!0;this.interceptors.request.forEach(function(m){if(typeof m.runWhen=="function"&&m.runWhen(s)===!1)return;l=l&&m.synchronous;const f=s.transitional||Ya;f&&f.legacyInterceptorReqResOrdering?o.unshift(m.fulfilled,m.rejected):o.push(m.fulfilled,m.rejected)});const d=[];this.interceptors.response.forEach(function(m){d.push(m.fulfilled,m.rejected)});let c,u=0,v;if(!l){const p=[Gn.bind(this),void 0];for(p.unshift(...o),p.push(...d),v=p.length,c=Promise.resolve(s);u<v;)c=c.then(p[u++],p[u++]);return c}v=o.length;let y=s;for(;u<v;){const p=o[u++],m=o[u++];try{y=p(y)}catch(f){m.call(this,f);break}}try{c=Gn.call(this,y)}catch(p){return Promise.reject(p)}for(u=0,v=d.length;u<v;)c=c.then(d[u++],d[u++]);return c}getUri(t){t=dt(this.defaults,t);const s=Ql(t.baseURL,t.url,t.allowAbsoluteUrls);return Yl(s,t.params,t.paramsSerializer)}}x.forEach(["delete","get","head","options"],function(t){Ks.prototype[t]=function(s,r){return this.request(dt(r||{},{method:t,url:s,data:(r||{}).data}))}});x.forEach(["post","put","patch"],function(t){function s(r){return function(i,n,o){return this.request(dt(o||{},{method:t,headers:r?{"Content-Type":"multipart/form-data"}:{},url:i,data:n}))}}Ks.prototype[t]=s(),Ks.prototype[t+"Form"]=s(!0)});const As=Ks;class Qa{constructor(t){if(typeof t!="function")throw new TypeError("executor must be a function.");let s;this.promise=new Promise(function(i){s=i});const r=this;this.promise.then(a=>{if(!r._listeners)return;let i=r._listeners.length;for(;i-- >0;)r._listeners[i](a);r._listeners=null}),this.promise.then=a=>{let i;const n=new Promise(o=>{r.subscribe(o),i=o}).then(a);return n.cancel=function(){r.unsubscribe(i)},n},t(function(i,n,o){r.reason||(r.reason=new Vt(i,n,o),s(r.reason))})}throwIfRequested(){if(this.reason)throw this.reason}subscribe(t){if(this.reason){t(this.reason);return}this._listeners?this._listeners.push(t):this._listeners=[t]}unsubscribe(t){if(!this._listeners)return;const s=this._listeners.indexOf(t);s!==-1&&this._listeners.splice(s,1)}toAbortSignal(){const t=new AbortController,s=r=>{t.abort(r)};return this.subscribe(s),t.signal.unsubscribe=()=>this.unsubscribe(s),t.signal}static source(){let t;return{token:new Qa(function(a){t=a}),cancel:t}}}const Jh=Qa;function Vh(e){return function(s){return e.apply(null,s)}}function Xh(e){return x.isObject(e)&&e.isAxiosError===!0}const da={Continue:100,SwitchingProtocols:101,Processing:102,EarlyHints:103,Ok:200,Created:201,Accepted:202,NonAuthoritativeInformation:203,NoContent:204,ResetContent:205,PartialContent:206,MultiStatus:207,AlreadyReported:208,ImUsed:226,MultipleChoices:300,MovedPermanently:301,Found:302,SeeOther:303,NotModified:304,UseProxy:305,Unused:306,TemporaryRedirect:307,PermanentRedirect:308,BadRequest:400,Unauthorized:401,PaymentRequired:402,Forbidden:403,NotFound:404,MethodNotAllowed:405,NotAcceptable:406,ProxyAuthenticationRequired:407,RequestTimeout:408,Conflict:409,Gone:410,LengthRequired:411,PreconditionFailed:412,PayloadTooLarge:413,UriTooLong:414,UnsupportedMediaType:415,RangeNotSatisfiable:416,ExpectationFailed:417,ImATeapot:418,MisdirectedRequest:421,UnprocessableEntity:422,Locked:423,FailedDependency:424,TooEarly:425,UpgradeRequired:426,PreconditionRequired:428,TooManyRequests:429,RequestHeaderFieldsTooLarge:431,UnavailableForLegalReasons:451,InternalServerError:500,NotImplemented:501,BadGateway:502,ServiceUnavailable:503,GatewayTimeout:504,HttpVersionNotSupported:505,VariantAlsoNegotiates:506,InsufficientStorage:507,LoopDetected:508,NotExtended:510,NetworkAuthenticationRequired:511,WebServerIsDown:521,ConnectionTimedOut:522,OriginIsUnreachable:523,TimeoutOccurred:524,SslHandshakeFailed:525,InvalidSslCertificate:526};Object.entries(da).forEach(([e,t])=>{da[t]=e});const Qh=da;function ad(e){const t=new As(e),s=Ul(As.prototype.request,t);return x.extend(s,As.prototype,t,{allOwnKeys:!0}),x.extend(s,t,null,{allOwnKeys:!0}),s.create=function(a){return ad(dt(e,a))},s}const J=ad(Va);J.Axios=As;J.CanceledError=Vt;J.CancelToken=Jh;J.isCancel=Vl;J.VERSION=rd;J.toFormData=sr;J.AxiosError=I;J.Cancel=J.CanceledError;J.all=function(t){return Promise.all(t)};J.spread=Vh;J.isAxiosError=Xh;J.mergeConfig=dt;J.AxiosHeaders=be;J.formToJSON=e=>Gl(x.isHTMLForm(e)?new FormData(e):e);J.getAdapter=sd.getAdapter;J.HttpStatusCode=Qh;J.default=J;const Ve=J,ev={name:"Landing",data(){return{feedItems:[],stats:{},loading:!0,toasts:[],toastTimer:null,reviewIndex:0,reviewTimer:null,howItWorksStep:0,statsVisible:!1,animatedStats:{volume:0,count:0,rate:0,cities:0}}},computed:{reviews(){return[{name:"Tendai M.",location:"Melbourne to Harare",avatar:"T",color:"bg-green-700",stars:5,date:"2 weeks ago",text:"Absolutely life-changing. I have been sending money home for years and always lost 8 to 10 percent to fees and bad rates. eZimConnect matched me in under an hour and my mum got her cash the same afternoon. Zero stress."},{name:"Rudo C.",location:"Sydney to Bulawayo",avatar:"R",color:"bg-blue-700",stars:5,date:"1 month ago",text:"I was skeptical at first but the escrow system made me feel completely safe. Sent AUD 800 and my sister confirmed she received every cent. The whole process took 3 hours. Other providers used to charge me over AUD 60 for the same amount."},{name:"Farai N.",location:"Brisbane to Mutare",avatar:"F",color:"bg-purple-700",stars:5,date:"3 weeks ago",text:"The chat feature during the transaction gave me peace of mind. I could talk directly with the person delivering the cash. My mother confirmed receipt immediately. Will never use a remittance service again."},{name:"Tatenda K.",location:"Perth to Gweru",avatar:"T",color:"bg-orange-600",stars:5,date:"5 days ago",text:"As someone who sends money every month, the recurring orders feature is a game changer. I set it once and eZimConnect handles everything. My family in Gweru now receives reliably on time every month."},{name:"Blessing S.",location:"Adelaide to Victoria Falls",avatar:"B",color:"bg-teal-700",stars:5,date:"1 week ago",text:"I run a small business in Zimbabwe and needed AUD regularly for my Australian suppliers. eZimConnect directory listing means customers find me. This platform is exactly what our community needed."}]},toastPool(){return[{icon:"💸",msg:"T***i from Melbourne just sent AUD 450 to Harare"},{icon:"👋",msg:"New member from Sydney just joined eZimConnect"},{icon:"💸",msg:"R***o from Brisbane sent AUD 700 to Bulawayo"},{icon:"⭐",msg:"F***i just left a 5-star review — Delivered same day!"},{icon:"💸",msg:"B***g from Perth sent AUD 200 to Mutare"},{icon:"👋",msg:"New member from Adelaide just joined eZimConnect"},{icon:"💸",msg:"C***o from Sydney sent AUD 550 to Harare"},{icon:"⭐",msg:"T***a just left a 5-star review — No fees, lightning fast!"}]},steps(){return[{n:"01",icon:"fa-user-plus",title:"Create account",colorClass:"text-green-600",bgClass:"bg-green-50",iconBg:"bg-green-600",desc:"Sign up free in 2 minutes. Add your Australian bank account. No setup fees ever.",detail:"Your real details are always private. Choose to show your profile as public or anonymous."},{n:"02",icon:"fa-plus-circle",title:"Post your order",colorClass:"text-blue-600",bgClass:"bg-blue-50",iconBg:"bg-blue-600",desc:"State how much AUD to send and who receives USD cash in Zimbabwe. Any amount from AUD 50.",detail:"Our live calculator shows exactly what your recipient gets after our 1.5% flat fee."},{n:"03",icon:"fa-handshake",title:"Match and agree",colorClass:"text-purple-600",bgClass:"bg-purple-50",iconBg:"bg-purple-600",desc:"Match with someone who has the opposite need. Negotiate the rate via in-app chat.",detail:"Choose Secure delivery (AUD first) or Risk delivery (cash first). Your choice every time."},{n:"04",icon:"fa-shield-alt",title:"Escrow protects",colorClass:"text-orange-500",bgClass:"bg-orange-50",iconBg:"bg-orange-500",desc:"Your AUD is held in our Trust Account until delivery is confirmed with photo proof.",detail:"Recipient ID photo plus cash handover photo required before any funds move."},{n:"05",icon:"fa-check-circle",title:"Funds released",colorClass:"text-teal-600",bgClass:"bg-teal-50",iconBg:"bg-teal-600",desc:"Recipient confirms cash received. AUD released to deliverer. Transaction complete.",detail:"The whole process typically takes 2 to 6 hours. Faster than any bank wire."}]},currentStep(){return this.steps[this.howItWorksStep]}},async mounted(){try{const[e,t]=await Promise.all([this.$http.get("/feed?per_page=8"),this.$http.get("/feed/stats")]);this.feedItems=e.data.data||[],this.stats=t.data.data||{}}catch{}this.loading=!1,setTimeout(()=>this.scheduleToast(),8e3),this.reviewTimer=setInterval(()=>{this.reviewIndex=(this.reviewIndex+1)%this.reviews.length},6e3),this.$nextTick(()=>{const e=document.getElementById("stats-section");e&&new IntersectionObserver(s=>{s[0].isIntersecting&&!this.statsVisible&&(this.statsVisible=!0,this.animateStats())},{threshold:.3}).observe(e)})},beforeDestroy(){clearTimeout(this.toastTimer),clearInterval(this.reviewTimer)},methods:{scheduleToast(){const e=25e3+Math.random()*15e3;this.toastTimer=setTimeout(()=>{const t=this.toastPool[Math.floor(Math.random()*this.toastPool.length)],s=Date.now();this.toasts.push({...t,id:s}),setTimeout(()=>{this.toasts=this.toasts.filter(r=>r.id!==s)},7e3),this.scheduleToast()},e)},dismissToast(e){this.toasts=this.toasts.filter(t=>t.id!==e)},setReview(e){this.reviewIndex=e,clearInterval(this.reviewTimer),this.reviewTimer=setInterval(()=>{this.reviewIndex=(this.reviewIndex+1)%this.reviews.length},6e3)},prevReview(){this.setReview((this.reviewIndex-1+this.reviews.length)%this.reviews.length)},nextReview(){this.setReview((this.reviewIndex+1)%this.reviews.length)},animateStats(){const e={volume:parseInt(this.stats.total_volume_aud||847320),count:parseInt(this.stats.total_count||1243),rate:98,cities:parseInt(this.stats.cities_count||16)},t=1800,s=Date.now(),r=()=>{const a=Math.min((Date.now()-s)/t,1),i=1-Math.pow(1-a,3);this.animatedStats.volume=Math.round(e.volume*i),this.animatedStats.count=Math.round(e.count*i),this.animatedStats.rate=Math.round(e.rate*i),this.animatedStats.cities=Math.round(e.cities*i),a<1&&requestAnimationFrame(r)};requestAnimationFrame(r)},fmtVolume(){const e=this.animatedStats.volume;return e>=1e6?"AUD "+(e/1e6).toFixed(1)+"M":"AUD "+e.toLocaleString()},fmtAud(e){return"AUD "+parseFloat(e||0).toFixed(2)},fmtUsd(e){return"USD "+parseFloat(e||0).toFixed(2)},fmtDate(e){return e?new Date(e).toLocaleDateString("en-AU",{day:"numeric",month:"short"}):"Today"}},template:`
<div class="min-h-screen bg-white overflow-x-hidden" style="font-family:Georgia,serif;">

  <!-- Toast notifications (bottom-left) -->
  <div class="fixed bottom-5 left-5 z-50 space-y-2 max-w-xs">
    <transition-group name="toast-pop">
      <div v-for="t in toasts" :key="t.id"
        class="flex items-start gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
        @click="dismissToast(t.id)">
        <span class="text-lg flex-shrink-0">{{ t.icon }}</span>
        <p class="text-xs leading-snug flex-1">{{ t.msg }}</p>
        <i class="fas fa-times text-xs text-gray-500 hover:text-white mt-0.5"></i>
      </div>
    </transition-group>
  </div>

  <!-- NAVBAR -->
  <nav class="sticky top-0 z-40 bg-white/96 backdrop-blur-sm border-b border-gray-100 shadow-sm">
    <div class="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
      <router-link to="/" class="flex items-center">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-9 w-auto">
      </router-link>
      <div class="hidden md:flex items-center gap-0.5">
        <a href="#how-it-works" class="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">How it works</a>
        <a href="#features"     class="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">Features</a>
        <a href="#reviews"      class="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">Reviews</a>
        <router-link to="/directory" class="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">Directory</router-link>
      </div>
      <div class="flex items-center gap-2">
        <router-link to="/login"    class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-700 transition-colors">Log in</router-link>
        <router-link to="/register" class="px-5 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 shadow-md transition-all" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Get started free</router-link>
      </div>
    </div>
  </nav>

  <!-- HERO -->
  <section class="relative overflow-hidden" style="background:linear-gradient(160deg,#0d4a28 0%,#1a6b3c 50%,#0f5e32 100%);">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10" style="background:#f59e0b;"></div>
      <div class="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-8" style="background:#f59e0b;"></div>
    </div>
    <div class="max-w-6xl mx-auto px-5 py-20 lg:py-28 relative z-10">
      <div class="grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border border-white/20 bg-white/10">
            <span class="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
            <span class="text-xs font-bold text-yellow-300 tracking-wider uppercase">Zero bank fees · Live now</span>
          </div>
          <h1 class="text-white mb-5 leading-tight" style="font-family:Georgia,serif;font-size:clamp(2.2rem,4vw,3.5rem);font-weight:900;">
            Send money to Zimbabwe<br><span style="color:#f59e0b;">without the fees</span>
          </h1>
          <p class="text-green-100 text-lg mb-8 leading-relaxed max-w-md">
            eZimConnect connects Australians directly with trusted community members to swap
            AUD for USD cash. Peer-to-peer, secured by escrow, at just 1.5%.
          </p>
          <div class="flex flex-wrap gap-3 mb-8">
            <router-link to="/register" class="flex items-center gap-2 px-7 py-3.5 text-sm font-bold rounded-xl shadow-lg hover:scale-105 transition-transform" style="background:#f59e0b;color:#1a1a1a;">
              <i class="fas fa-paper-plane text-xs"></i> Start sending money
            </router-link>
            <a href="#how-it-works" class="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
              <i class="fas fa-play-circle text-xs"></i> How it works
            </a>
          </div>
          <div class="flex flex-wrap gap-5 text-sm">
            <div class="flex items-center gap-2">
              <div class="flex -space-x-1.5">
                <div v-for="(c,i) in ['bg-green-400','bg-blue-400','bg-purple-400','bg-orange-400']" :key="i"
                  :class="['w-7 h-7 rounded-full border-2 border-green-800 flex items-center justify-center text-white text-xs font-bold',c]">{{ 'TRFB'[i] }}</div>
              </div>
              <span class="text-green-200 font-medium">1,200+ members</span>
            </div>
            <div class="flex items-center gap-1 text-green-200">
              <i class="fas fa-star text-yellow-400 text-xs"></i>
              <span class="font-semibold">4.9 rating</span>
              <span class="opacity-60 ml-1">· 340+ reviews</span>
            </div>
          </div>
        </div>

        <!-- Calculator -->
        <div class="relative">
          <div class="rounded-3xl p-6 shadow-2xl border border-white/20" style="background:rgba(255,255,255,0.08);">
            <div class="flex items-center justify-between mb-5">
              <p class="text-white font-bold">Live calculator</p>
              <span class="flex items-center gap-1.5 text-xs text-green-300">
                <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                1 AUD = 0.6300 USD
              </span>
            </div>
            <div class="rounded-2xl p-4 mb-2" style="background:rgba(255,255,255,0.1);">
              <p class="text-green-200 text-xs mb-1">You send</p>
              <div class="flex items-center justify-between">
                <span class="text-white text-3xl font-black">AUD 500.00</span>
                <div class="flex items-center gap-2 rounded-xl px-3 py-1.5" style="background:rgba(255,255,255,0.15);"><span>🇦🇺</span><span class="text-white font-bold text-sm">AUD</span></div>
              </div>
            </div>
            <div class="text-center text-xs text-green-300 py-2 opacity-80">Platform fee: AUD 7.50 (1.5%)</div>
            <div class="rounded-2xl p-4 mb-4" style="background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);">
              <p class="text-yellow-300 text-xs mb-1">Recipient gets</p>
              <div class="flex items-center justify-between">
                <span class="text-3xl font-black" style="color:#f59e0b;">USD 310.27</span>
                <div class="flex items-center gap-2 rounded-xl px-3 py-1.5" style="background:rgba(255,255,255,0.15);"><span>🇿🇼</span><span class="text-white font-bold text-sm">USD</span></div>
              </div>
            </div>
            <div class="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4 text-xs text-green-300" style="background:rgba(34,197,94,0.1);">
              <i class="fas fa-piggy-bank text-green-400"></i>
              Save approx. AUD 17.50 vs other providers
            </div>
            <router-link to="/register" class="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all" style="background:#f59e0b;color:#1a1a1a;">
              Get started free <i class="fas fa-arrow-right text-xs"></i>
            </router-link>
          </div>
          <div class="absolute -right-3 -bottom-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-2.5 flex items-center gap-3 tuma-float">
            <div class="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-check text-green-600 text-sm"></i>
            </div>
            <div><p class="font-bold text-gray-900 text-sm">Cash delivered!</p><p class="text-xs text-gray-400">Harare · 2 hrs ago</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS -->
  <section id="stats-section" class="border-b border-gray-100 bg-gray-50">
    <div class="max-w-6xl mx-auto px-5 py-14">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div v-for="(s,i) in [
          {label:'Total AUD sent',     val:fmtVolume(),                              icon:'fa-dollar-sign'},
          {label:'Completed trades',   val:animatedStats.count.toLocaleString()+'+', icon:'fa-exchange-alt'},
          {label:'Success rate',       val:animatedStats.rate+'%',                   icon:'fa-check-circle'},
          {label:'Cities in Zimbabwe', val:animatedStats.cities+'',                  icon:'fa-map-marker-alt'},
        ]" :key="i">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style="background:linear-gradient(135deg,rgba(26,107,60,0.12),rgba(26,107,60,0.06));">
            <i :class="'fas ' + s.icon + ' text-green-700'"></i>
          </div>
          <p class="text-3xl font-black text-gray-900" style="font-family:Georgia,serif;">{{ s.val }}</p>
          <p class="text-sm text-gray-500 mt-1 font-medium">{{ s.label }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section id="how-it-works" class="py-20 bg-white">
    <div class="max-w-5xl mx-auto px-5">
      <div class="text-center mb-12">
        <span class="inline-block text-xs font-bold tracking-widest uppercase text-green-700 bg-green-50 px-4 py-1.5 rounded-full mb-3">Simple process</span>
        <h2 class="text-4xl font-black text-gray-900 mb-3" style="font-family:Georgia,serif;">How eZimConnect works</h2>
        <p class="text-gray-500 max-w-md mx-auto">Five steps from signup to your recipient receiving cash in Zimbabwe.</p>
      </div>
      <div class="flex flex-wrap gap-2 justify-center mb-10">
        <button v-for="(s,i) in steps" :key="i" @click="howItWorksStep = i"
          :class="['flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition-all',
            howItWorksStep === i ? 'bg-green-700 border-green-700 text-white shadow-md' : 'border-gray-200 text-gray-600 bg-white hover:border-green-300']">
          <span :class="['w-5 h-5 rounded-full text-xs font-black flex items-center justify-center',
            howItWorksStep === i ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600']">{{ i+1 }}</span>
          {{ s.title }}
        </button>
      </div>
      <transition name="step-fade" mode="out-in">
        <div :key="howItWorksStep" class="grid md:grid-cols-2 gap-8 items-center">
          <div :class="['rounded-3xl p-12 flex items-center justify-center min-h-56', currentStep.bgClass]">
            <div class="text-center">
              <div :class="['w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg', currentStep.iconBg]">
                <i :class="'fas ' + currentStep.icon + ' text-white text-4xl'"></i>
              </div>
              <span :class="['text-8xl font-black opacity-10', currentStep.colorClass]" style="font-family:Georgia,serif;">{{ currentStep.n }}</span>
            </div>
          </div>
          <div>
            <p :class="['text-xs font-bold tracking-widest uppercase mb-2', currentStep.colorClass]">Step {{ currentStep.n }}</p>
            <h3 class="text-2xl font-black text-gray-900 mb-3" style="font-family:Georgia,serif;">{{ currentStep.title }}</h3>
            <p class="text-gray-600 leading-relaxed mb-4">{{ currentStep.desc }}</p>
            <div class="flex items-start gap-2 p-3.5 bg-gray-50 rounded-xl">
              <i class="fas fa-info-circle text-gray-400 mt-0.5 flex-shrink-0"></i>
              <p class="text-sm text-gray-500">{{ currentStep.detail }}</p>
            </div>
            <div class="flex items-center gap-2 mt-6">
              <button v-for="(_,i) in steps" :key="i" @click="howItWorksStep = i"
                :class="['h-1.5 rounded-full transition-all', howItWorksStep === i ? 'w-8 bg-green-700' : 'w-2 bg-gray-200']"></button>
              <button @click="howItWorksStep = (howItWorksStep + 1) % steps.length"
                class="ml-auto text-sm font-semibold text-green-700 flex items-center gap-1 hover:text-green-800">
                {{ howItWorksStep < steps.length - 1 ? 'Next step' : 'Start over' }}
                <i class="fas fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>

  <!-- FEATURES -->
  <section id="features" style="background:#0d1117;" class="py-20">
    <div class="max-w-6xl mx-auto px-5">
      <div class="text-center mb-14">
        <span class="inline-block text-xs font-bold tracking-widest uppercase text-yellow-400 bg-yellow-400/10 px-4 py-1.5 rounded-full mb-3">Built for our community</span>
        <h2 class="text-4xl font-black text-white mb-3" style="font-family:Georgia,serif;">Everything you need to send money home</h2>
        <p class="text-gray-400 max-w-lg mx-auto">Every feature designed around the realities of sending money between Australia and Zimbabwe.</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="f in [
          {icon:'fa-shield-alt',     color:'#22c55e', title:'Escrow protection',   desc:'Your AUD is never at risk. Funds only release when cash delivery is verified with photo evidence.'},
          {icon:'fa-handshake',      color:'#f59e0b', title:'Peer-to-peer rates',  desc:'Negotiate directly with community members and agree on a rate. No middlemen taking extra margin.'},
          {icon:'fa-comments',       color:'#60a5fa', title:'In-transaction chat', desc:'Talk directly with your match partner throughout the process. Built-in and on-platform.'},
          {icon:'fa-camera',         color:'#a78bfa', title:'Photo verification',  desc:'Delivery proved with recipient ID photo and cash handover photo. No photo, no release.'},
          {icon:'fa-calendar-check', color:'#f97316', title:'Recurring orders',    desc:'Set up automatic monthly transfers so your family receives on time every month without effort.'},
          {icon:'fa-bolt',           color:'#22c55e', title:'Fast matching',       desc:'Most orders match within hours thanks to our growing community across all major Australian cities.'},
          {icon:'fa-users',          color:'#f59e0b', title:'Trusted directory',   desc:'Verified businesses and power traders listed publicly. Browse profiles and delivery locations.'},
          {icon:'fa-chart-line',     color:'#60a5fa', title:'Rate alerts',         desc:'Set your target rate and get notified when reached. Trade at exactly the rate you want.'},
          {icon:'fa-id-card',        color:'#a78bfa', title:'Identity verified',   desc:'All users complete identity verification. No anonymous accounts means a safer community.'},
        ]" :key="f.title" class="p-5 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors" style="background:#161b22;">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" :style="'background:' + f.color + '22;border:1px solid ' + f.color + '44;'">
            <i :class="'fas ' + f.icon" :style="'color:' + f.color"></i>
          </div>
          <h3 class="text-white font-bold mb-1.5">{{ f.title }}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- COMPARISON TABLE -->
  <section class="py-20 bg-white">
    <div class="max-w-3xl mx-auto px-5">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-black text-gray-900 mb-2" style="font-family:Georgia,serif;">eZimConnect vs Traditional remittance</h2>
        <p class="text-gray-500 text-sm">For AUD 500 sent to Zimbabwe</p>
      </div>
      <div class="rounded-3xl border-2 border-gray-100 overflow-hidden shadow-xl">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b-2 border-gray-100">
              <th class="text-left py-4 px-5 font-semibold text-gray-500">Feature</th>
              <th class="py-4 px-5 text-center">
                <div class="inline-flex flex-col items-center gap-1">
                  <img src="/images/logo.svg" alt="eZimConnect" class="h-6 w-auto">
                </div>
              </th>
              <th class="py-4 px-5 text-center bg-gray-50 font-semibold text-gray-400">Other Providers</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r,i) in [
              ['Platform fee',            '1.5% = AUD 7.50',     '4 to 5 pct plus fixed fee'],
              ['Exchange rate',           'Peer negotiated',     'Bank retail rate'],
              ['AUD protection',          'Full escrow',         'None'],
              ['Delivery proof required', 'ID and cash photo',   'None'],
              ['Dispute resolution',      'Admin mediated',      'Not available'],
              ['Recurring orders',        'Fully automatic',     'Manual each time'],
              ['Your saving on AUD 500',  'Keep AUD 17 more',    'Lose AUD 25 to 30'],
            ]" :key="i" :class="['border-b border-gray-50', i % 2 ? 'bg-gray-50/40' : '']">
              <td class="py-3 px-5 font-medium text-gray-700">{{ r[0] }}</td>
              <td class="py-3 px-5 text-center">
                <span class="inline-flex items-center gap-1.5 font-semibold text-green-700">
                  <i class="fas fa-check-circle text-green-500 text-xs"></i>{{ r[1] }}
                </span>
              </td>
              <td class="py-3 px-5 text-center text-gray-400 bg-gray-50/80">
                <span class="flex items-center justify-center gap-1.5">
                  <i class="fas fa-times-circle text-red-300 text-xs"></i>{{ r[2] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- REVIEWS SLIDER -->
  <section id="reviews" class="py-20" style="background:#fafaf8;">
    <div class="max-w-4xl mx-auto px-5">
      <div class="text-center mb-12">
        <span class="inline-block text-xs font-bold tracking-widest uppercase text-green-700 bg-green-50 px-4 py-1.5 rounded-full mb-3">Community voices</span>
        <h2 class="text-4xl font-black text-gray-900 mb-3" style="font-family:Georgia,serif;">What our members say</h2>
        <div class="flex items-center justify-center gap-1 mt-2">
          <i v-for="s in 5" :key="s" class="fas fa-star text-yellow-400 text-lg"></i>
          <span class="ml-2 text-gray-700 font-semibold">4.9 out of 5</span>
          <span class="text-gray-400 ml-1 text-sm">· 340+ reviews</span>
        </div>
      </div>
      <div class="relative max-w-2xl mx-auto mb-8">
        <transition name="review-slide" mode="out-in">
          <div :key="reviewIndex" class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div class="text-5xl font-black leading-none mb-4" style="color:#f59e0b;font-family:Georgia,serif;">"</div>
            <p class="text-gray-700 text-lg leading-relaxed mb-6 italic" style="font-family:Georgia,serif;">{{ reviews[reviewIndex].text }}</p>
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-3">
                <div :class="['w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg', reviews[reviewIndex].color]">
                  {{ reviews[reviewIndex].avatar }}
                </div>
                <div>
                  <p class="font-bold text-gray-900">{{ reviews[reviewIndex].name }}</p>
                  <p class="text-sm text-gray-500 flex items-center gap-1">
                    <i class="fas fa-map-marker-alt text-green-600 text-xs"></i>{{ reviews[reviewIndex].location }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex gap-0.5 justify-end">
                  <i v-for="s in reviews[reviewIndex].stars" :key="s" class="fas fa-star text-yellow-400 text-sm"></i>
                </div>
                <p class="text-xs text-gray-400 mt-0.5">{{ reviews[reviewIndex].date }}</p>
              </div>
            </div>
          </div>
        </transition>
        <button @click="prevReview" class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-green-700 transition-colors">
          <i class="fas fa-chevron-left text-sm"></i>
        </button>
        <button @click="nextReview" class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-green-700 transition-colors">
          <i class="fas fa-chevron-right text-sm"></i>
        </button>
      </div>
      <div class="flex justify-center gap-2 mb-8">
        <button v-for="(_,i) in reviews" :key="i" @click="setReview(i)"
          :class="['h-2 rounded-full transition-all', reviewIndex === i ? 'w-8 bg-green-700' : 'w-2 bg-gray-300 hover:bg-gray-400']"></button>
      </div>
      <div class="flex justify-center gap-3 flex-wrap">
        <button v-for="(r,i) in reviews" :key="i" @click="setReview(i)"
          :class="['flex flex-col items-center p-3 rounded-2xl border-2 transition-all min-w-16 cursor-pointer',
            reviewIndex === i ? 'border-green-600 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200']">
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-1.5', r.color]">{{ r.avatar }}</div>
          <p class="text-xs font-semibold text-gray-700">{{ r.name }}</p>
          <div class="flex mt-0.5"><i v-for="s in r.stars" :key="s" class="fas fa-star text-yellow-400 text-xs"></i></div>
        </button>
      </div>
    </div>
  </section>

  <!-- LIVE TRANSACTION FEED -->
  <section class="py-20 bg-white">
    <div class="max-w-3xl mx-auto px-5">
      <div class="text-center mb-8">
        <span class="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-green-700 bg-green-50 px-4 py-1.5 rounded-full mb-3">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Live activity
        </span>
        <h2 class="text-3xl font-black text-gray-900" style="font-family:Georgia,serif;">Transactions happening now</h2>
        <p class="text-gray-500 mt-1.5 text-sm">All names anonymised for privacy.</p>
      </div>
      <div class="space-y-2.5">
        <div v-for="(item,i) in (feedItems.length ? feedItems : [
          {display_sender:'T***i from Melbourne', display_receiver:'C***o in Harare',   amount_aud:'450.00', amount_usd:'283.27', completed_at:null},
          {display_sender:'R***o from Sydney',    display_receiver:'F***i in Bulawayo', amount_aud:'700.00', amount_usd:'441.45', completed_at:null},
          {display_sender:'B***g from Brisbane',  display_receiver:'T***a in Mutare',   amount_aud:'200.00', amount_usd:'126.12', completed_at:null},
          {display_sender:'C***e from Perth',     display_receiver:'N***a in Harare',   amount_aud:'550.00', amount_usd:'346.83', completed_at:null},
          {display_sender:'F***i from Adelaide',  display_receiver:'R***o in Gweru',    amount_aud:'350.00', amount_usd:'220.71', completed_at:null},
        ]).slice(0,6)" :key="i"
          class="flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-3.5 border border-gray-100 hover:border-green-100 hover:bg-green-50/30 transition-colors">
          <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-arrow-right text-green-600 text-xs"></i>
          </div>
          <p class="text-sm text-gray-700 flex-1 flex flex-wrap gap-x-1.5 items-baseline">
            <span class="font-semibold text-gray-900">{{ item.display_sender }}</span>
            <span class="text-gray-400">sent</span>
            <span class="font-bold text-gray-900">{{ fmtAud(item.amount_aud) }}</span>
            <span class="text-gray-400">to</span>
            <span class="font-semibold text-green-700">{{ fmtUsd(item.amount_usd) }}</span>
            <span class="text-gray-400">for</span>
            <span class="font-medium">{{ item.display_receiver }}</span>
          </p>
          <span class="text-xs text-gray-400 flex-shrink-0">{{ fmtDate(item.completed_at) }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA SECTION -->
  <section style="background:linear-gradient(135deg,#0d4a28,#1a6b3c);" class="py-20 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style="background:#f59e0b;"></div>
      <div class="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-8" style="background:#f59e0b;"></div>
    </div>
    <div class="max-w-2xl mx-auto px-5 text-center relative z-10">
      <div class="flex justify-center gap-0.5 mb-5">
        <i v-for="s in 5" :key="s" class="fas fa-star text-yellow-400 text-lg"></i>
      </div>
      <h2 class="text-4xl font-black text-white mb-4" style="font-family:Georgia,serif;">
        Ready to save on your next transfer to Zimbabwe?
      </h2>
      <p class="text-green-200 mb-8 text-lg">Join 1,200+ Australians who have already switched. Free account in 2 minutes.</p>
      <div class="flex flex-wrap gap-4 justify-center">
        <router-link to="/register" class="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl" style="background:#f59e0b;color:#1a1a1a;">
          <i class="fas fa-user-plus"></i> Create free account
        </router-link>
        <router-link to="/directory" class="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-colors">
          <i class="fas fa-users"></i> Browse senders
        </router-link>
      </div>
      <p class="text-green-300 text-xs mt-5 font-medium">No setup fees · No hidden charges · Cancel anytime</p>
    </div>
  </section>

  <!-- FOOTER -->
  <footer style="background:#0d1117;" class="py-14 border-t border-gray-800">
    <div class="max-w-6xl mx-auto px-5">
      <div class="grid md:grid-cols-4 gap-8 mb-10">
        <div class="md:col-span-2">
          <div class="mb-4">
            <img src="/images/logo-dark.svg" alt="eZimConnect" class="h-9 w-auto">
          </div>
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">Peer-to-peer currency exchange for Australians sending money to Zimbabwe. Zero bank fees. Secured by escrow.</p>
          <p class="text-gray-600 text-xs mt-3 flex items-center gap-1.5"><i class="fas fa-lock text-gray-600"></i>NAB Trust Account · AUSTRAC registered</p>
        </div>
        <div>
          <p class="text-white font-semibold text-sm mb-4">Platform</p>
          <div class="space-y-2.5">
            <router-link v-for="l in [{to:'/register',t:'Create account'},{to:'/login',t:'Log in'},{to:'/directory',t:'Browse senders'},{to:'/browse',t:'Open orders'}]" :key="l.t" :to="l.to" class="block text-sm text-gray-400 hover:text-white transition-colors">{{ l.t }}</router-link>
          </div>
        </div>
        <div>
          <p class="text-white font-semibold text-sm mb-4">Company</p>
          <div class="space-y-2.5">
            <router-link to="/how-it-works"    class="block text-sm text-gray-400 hover:text-white transition-colors">How it works</router-link>
            <router-link to="/safety-and-escrow"  class="block text-sm text-gray-400 hover:text-white transition-colors">Safety &amp; Escrow</router-link>
            <router-link to="/privacy"            class="block text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</router-link>
            <router-link to="/terms"              class="block text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</router-link>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p class="text-gray-600 text-xs">Copyright 2025 eZimConnect Pty Ltd. All rights reserved.</p>
        <div class="flex items-center gap-4 text-gray-600 text-xs">
          <router-link to="/privacy" class="hover:text-gray-400 transition-colors">Privacy</router-link>
          <router-link to="/terms"   class="hover:text-gray-400 transition-colors">Terms</router-link>
        </div>
      </div>
    </div>
  </footer>

  <style>
  .toast-pop-enter-active, .toast-pop-leave-active { transition: all 0.3s ease; }
  .toast-pop-enter { opacity: 0; transform: translateX(-16px) scale(0.95); }
  .toast-pop-leave-to { opacity: 0; transform: translateX(-16px) scale(0.95); }
  .step-fade-enter-active { transition: all 0.3s ease; }
  .step-fade-enter { opacity: 0; transform: translateY(10px); }
  .review-slide-enter-active, .review-slide-leave-active { transition: all 0.4s ease; }
  .review-slide-enter { opacity: 0; transform: translateX(24px); }
  .review-slide-leave-to { opacity: 0; transform: translateX(-24px); }
  @keyframes tuma-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
  .tuma-float { animation: tuma-float 3s ease-in-out infinite; }
  </style>
</div>`},tv={name:"Login",data(){return{email:"",password:"",loading:!1,error:null,show2fa:!1,tempToken:"",twoFaCode:""}},methods:{async submit(){var e,t;this.loading=!0,this.error=null;try{const{data:s}=await this.$http.post("/auth/login",{email:this.email,password:this.password});s.data.requires_2fa?(this.tempToken=s.data.temp_token,this.show2fa=!0):(this.$auth.login(s.data.token,s.data.user),this.$router.push(this.$route.query.redirect||"/dashboard"))}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Invalid credentials."}this.loading=!1},async verify2fa(){var e,t;this.loading=!0;try{const{data:s}=await this.$http.post("/auth/2fa/verify",{temp_token:this.tempToken,code:this.twoFaCode});this.$auth.login(s.data.token,s.data.user),this.$router.push("/dashboard")}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Invalid code."}this.loading=!1}},template:`<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <router-link to="/" class="inline-flex items-center gap-2">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-9 w-auto">
      </router-link>
      <h1 class="text-xl font-semibold text-gray-900 mt-4">{{ show2fa?'Two-Factor Authentication':'Welcome back' }}</h1>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
      <alert-banner v-if="error" type="error" :message="error" />
      <div v-if="!show2fa" class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
          <input v-model="email" type="email" @keyup.enter="submit"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="you@email.com">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
          <input v-model="password" type="password" @keyup.enter="submit"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500" placeholder="••••••••">
        </div>
        <div class="flex justify-end">
          <router-link to="/forgot-password" class="text-sm text-green-700 hover:underline">Forgot password?</router-link>
        </div>
        <button @click="submit" :disabled="loading" class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 transition">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>Log in
        </button>
      </div>
      <div v-else class="space-y-4">
        <p class="text-sm text-gray-600">Enter the 6-digit code from your authenticator app or SMS.</p>
        <input v-model="twoFaCode" type="text" maxlength="6" @keyup.enter="verify2fa"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500" placeholder="000000">
        <button @click="verify2fa" :disabled="loading||twoFaCode.length<6" class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 transition">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>Verify
        </button>
      </div>
    </div>
    <p class="text-center text-sm text-gray-500 mt-5">
      Don't have an account? <router-link to="/register" class="text-green-700 font-medium hover:underline">Sign up</router-link>
    </p>
  </div>
</div>`},sv={name:"Register",data(){return{form:{first_name:"",last_name:"",email:"",phone:"",password:"",password_confirmation:"",country_id:1,referral_code:"",captcha_token:""},loading:!1,error:null,captchaReady:!1,captchaWidgetId:null}},async created(){this.$route.query.ref&&(this.form.referral_code=this.$route.query.ref)},mounted(){if(window.hcaptcha)this.renderCaptcha();else{const e=document.createElement("script");e.src="https://js.hcaptcha.com/1/api.js?render=explicit",e.async=!0,e.defer=!0,e.onload=()=>this.renderCaptcha(),document.head.appendChild(e)}},beforeDestroy(){if(this.captchaWidgetId!==null&&window.hcaptcha)try{window.hcaptcha.reset(this.captchaWidgetId)}catch{}},methods:{renderCaptcha(){this.$nextTick(()=>{const e=this.$el.querySelector("#hcaptcha-box");!e||!window.hcaptcha||(this.captchaWidgetId=window.hcaptcha.render(e,{sitekey:window.HCAPTCHA_SITE_KEY||"10000000-ffff-ffff-ffff-000000000001",theme:"light",callback:t=>{this.form.captcha_token=t,this.captchaReady=!0},"expired-callback":()=>{this.form.captcha_token="",this.captchaReady=!1},"error-callback":()=>{this.form.captcha_token="",this.captchaReady=!1}}))})},async submit(){var e,t,s,r;if(!this.form.captcha_token){this.error="Please complete the security check before continuing.";return}this.loading=!0,this.error=null;try{const{data:a}=await this.$http.post("/auth/register",this.form);this.$auth.login(a.data.token,a.data.user),this.$router.push("/onboarding")}catch(a){const i=(t=(e=a.response)==null?void 0:e.data)==null?void 0:t.errors;this.error=i?Object.values(i).flat()[0]:((r=(s=a.response)==null?void 0:s.data)==null?void 0:r.message)||"Registration failed.",window.hcaptcha&&this.captchaWidgetId!==null&&(window.hcaptcha.reset(this.captchaWidgetId),this.form.captcha_token="",this.captchaReady=!1)}this.loading=!1}},template:`<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <router-link to="/" class="inline-flex items-center justify-center">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-10 w-auto">
      </router-link>
      <h1 class="text-xl font-semibold text-gray-900 mt-4">Create your account</h1>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
      <alert-banner v-if="error" type="error" :message="error" />
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">First name</label>
            <input v-model="form.first_name" type="text" autocomplete="given-name"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="Tendai">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Last name</label>
            <input v-model="form.last_name" type="text" autocomplete="family-name"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="Moyo">
          </div>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Email</label>
          <input v-model="form.email" type="email" autocomplete="email"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="you@email.com">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Phone (Australian)</label>
          <input v-model="form.phone" type="tel" autocomplete="tel"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="+61 412 345 678">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Password</label>
          <input v-model="form.password" type="password" autocomplete="new-password"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="8+ characters">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">Confirm password</label>
          <input v-model="form.password_confirmation" type="password" autocomplete="new-password"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="Repeat password">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">
            Referral code <span class="text-gray-400 font-normal">(optional)</span>
          </label>
          <input v-model="form.referral_code" type="text"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 uppercase"
            placeholder="e.g. ABC12345">
        </div>

        <!-- hCaptcha widget -->
        <div class="flex justify-center">
          <div id="hcaptcha-box"></div>
        </div>

        <button @click="submit" :disabled="loading || !captchaReady"
          class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 disabled:opacity-50 transition">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          Create Account
        </button>
        <p class="text-xs text-center text-gray-400">
          By creating an account you agree to our
          <router-link to="/terms" class="underline hover:text-gray-600">Terms of Service</router-link>
          and
          <router-link to="/privacy" class="underline hover:text-gray-600">Privacy Policy</router-link>.
        </p>
      </div>
    </div>

    <p class="text-center text-sm text-gray-500 mt-5">
      Already have an account?
      <router-link to="/login" class="text-green-700 font-medium hover:underline">Log in</router-link>
    </p>
  </div>
</div>`},rv={name:"VerifyEmail",data(){return{status:"verifying",message:""}},async mounted(){var s,r;const{id:e,hash:t}=this.$route.params;if(!e||!t){this.status="error",this.message="Invalid verification link.";return}try{const{data:a}=await this.$http.get(`/auth/verify-email/${e}/${t}`);if(this.$auth.isLoggedIn)try{const i=await this.$http.get("/user");this.$auth.setUser(i.data.data)}catch{}a.message&&a.message.toLowerCase().includes("already")?this.status="already":this.status="success"}catch(a){this.status="error",this.message=((r=(s=a.response)==null?void 0:s.data)==null?void 0:r.message)||"Verification failed. The link may have expired."}},methods:{proceed(){this.$auth.isLoggedIn?this.$router.push("/onboarding"):this.$router.push("/login?verified=1")}},template:`
<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div class="w-full max-w-sm text-center">

    <!-- Logo -->
    <router-link to="/" class="inline-flex justify-center mb-8">
      <img src="/images/logo.svg" alt="eZimConnect" class="h-10 w-auto">
    </router-link>

    <!-- Verifying spinner -->
    <div v-if="status === 'verifying'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <i class="fas fa-spinner fa-spin text-3xl text-green-600 mb-4 block"></i>
      <p class="text-gray-600 font-medium">Verifying your email…</p>
    </div>

    <!-- Success -->
    <div v-else-if="status === 'success'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="fas fa-check-circle text-green-600 text-3xl"></i>
      </div>
      <h1 class="text-xl font-bold text-gray-900 mb-2">Email verified!</h1>
      <p class="text-gray-500 text-sm mb-7">
        Your email address has been confirmed. Your account is ready.
      </p>
      <button @click="proceed"
        class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
        Continue to account setup
      </button>
    </div>

    <!-- Already verified -->
    <div v-else-if="status === 'already'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="fas fa-check-circle text-blue-500 text-3xl"></i>
      </div>
      <h1 class="text-xl font-bold text-gray-900 mb-2">Already verified</h1>
      <p class="text-gray-500 text-sm mb-7">
        This email address is already verified. You can log in and continue.
      </p>
      <button @click="proceed"
        class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
        Go to dashboard
      </button>
    </div>

    <!-- Error -->
    <div v-else-if="status === 'error'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="fas fa-times-circle text-red-500 text-3xl"></i>
      </div>
      <h1 class="text-xl font-bold text-gray-900 mb-2">Verification failed</h1>
      <p class="text-gray-500 text-sm mb-7">{{ message }}</p>
      <router-link to="/login"
        class="block w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
        Back to login
      </router-link>
    </div>

  </div>
</div>`},av={name:"ForgotPassword",data(){return{email:"",loading:!1,sent:!1,error:null}},methods:{async submit(){var e,t;if(this.email){this.loading=!0,this.error=null;try{await this.$http.post("/auth/forgot-password",{email:this.email}),this.sent=!0}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed to send reset link."}this.loading=!1}}},template:`
<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <div class="w-14 h-14 rounded-2xl mx-auto mb-4 shadow-md flex flex-col items-start justify-center px-2.5 gap-1" style="background:linear-gradient(145deg,#1a6b3c,#2d9460);">
        <div class="flex items-center w-full gap-0.5"><span class="text-[6px] font-black text-yellow-400 leading-none">AUD</span><div class="flex-1 h-px bg-yellow-400"></div></div>
        <div class="flex items-center w-full gap-0.5 flex-row-reverse"><span class="text-[6px] font-black text-white leading-none">USD</span><div class="flex-1 h-px bg-white opacity-70"></div></div>
      </div>
      <h1 class="text-2xl font-black text-gray-900" style="font-family:Georgia,serif;">Tu<span style="color:#f59e0b;">Ma</span></h1>
      <p class="text-sm text-gray-500 mt-1">Reset your password</p>
    </div>
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
      <div v-if="!sent">
        <h2 class="text-lg font-bold text-gray-900 mb-1">Forgot your password?</h2>
        <p class="text-sm text-gray-500 mb-5">Enter your email and we will send you a reset link.</p>
        <alert-banner v-if="error" type="error" :message="error" class="mb-4" />
        <div class="mb-4">
          <label class="text-sm font-semibold text-gray-700 block mb-1.5">Email address</label>
          <input v-model="email" type="email" @keyup.enter="submit"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            placeholder="you@example.com">
        </div>
        <button @click="submit" :disabled="loading || !email"
          class="w-full py-3.5 font-bold text-white rounded-xl disabled:opacity-50 transition-all hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>Send reset link
        </button>
      </div>
      <div v-else class="text-center py-4">
        <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-envelope-open-text text-green-600 text-2xl"></i>
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Check your email</h2>
        <p class="text-sm text-gray-500 mb-4">We sent a reset link to <strong>{{ email }}</strong>. Check your spam folder too.</p>
        <button @click="sent = false; email = ''" class="text-sm text-green-700 hover:underline font-medium">Try a different email</button>
      </div>
    </div>
    <p class="text-center mt-5 text-sm">
      <router-link to="/login" class="text-green-700 font-semibold hover:underline">
        <i class="fas fa-arrow-left text-xs mr-1"></i> Back to log in
      </router-link>
    </p>
  </div>
</div>`},iv={name:"ResetPassword",data(){return{password:"",confirm:"",loading:!1,done:!1,error:null}},computed:{token(){return this.$route.query.token||""},email(){return this.$route.query.email||""}},methods:{async submit(){var e,t;if(this.password!==this.confirm){this.error="Passwords do not match.";return}this.loading=!0,this.error=null;try{await this.$http.post("/auth/reset-password",{token:this.token,email:this.email,password:this.password,password_confirmation:this.confirm}),this.done=!0,setTimeout(()=>this.$router.push("/login"),3e3)}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Reset failed. The link may have expired."}this.loading=!1}},template:`
<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-black text-gray-900" style="font-family:Georgia,serif;">Tu<span style="color:#f59e0b;">Ma</span></h1>
      <p class="text-sm text-gray-500 mt-1">Create a new password</p>
    </div>
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
      <div v-if="!done">
        <h2 class="text-lg font-bold text-gray-900 mb-5">Set new password</h2>
        <alert-banner v-if="error" type="error" :message="error" class="mb-4" />
        <div class="space-y-4">
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1.5">New password</label>
            <input v-model="password" type="password"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="8+ characters">
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1.5">Confirm password</label>
            <input v-model="confirm" type="password" @keyup.enter="submit"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="Repeat new password">
          </div>
          <button @click="submit" :disabled="loading || !password || !confirm"
            class="w-full py-3.5 font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition-all"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>Reset password
          </button>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check-circle text-green-600 text-2xl"></i>
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Password reset!</h2>
        <p class="text-sm text-gray-500">Redirecting you to log in...</p>
        <router-link to="/login" class="inline-block mt-4 text-sm text-green-700 font-semibold hover:underline">Go to login now</router-link>
      </div>
    </div>
  </div>
</div>`},nv={name:"Onboarding",data(){return{step:"verify-email",user:null,resending:!1,resendCooldown:0,resendTimer:null,checkingVerification:!1,pollTimer:null}},computed:{isVerified(){return this.user&&this.user.email_verified}},async mounted(){try{const{data:e}=await this.$http.get("/user");this.$auth.setUser(e.data),this.user=e.data}catch{this.user=this.$auth.user}this.isVerified?this.step=this.user&&this.user.onboarding_completed?"complete":"profile":this.startPolling()},beforeDestroy(){clearInterval(this.pollTimer),clearInterval(this.resendTimer)},methods:{startPolling(){this.pollTimer=setInterval(async()=>{try{const{data:e}=await this.$http.get("/user"),t=e.data;this.$auth.setUser(t),this.user=t,t.email_verified&&(clearInterval(this.pollTimer),this.step="profile",this.$toast.success("Email verified! Let's finish setting up your account."))}catch{}},5e3)},async resendEmail(){var e,t;if(!(this.resendCooldown>0)){this.resending=!0;try{await this.$http.post("/auth/resend-verification"),this.$toast.success("Verification email sent. Please check your inbox."),this.resendCooldown=60,this.resendTimer=setInterval(()=>{this.resendCooldown--,this.resendCooldown<=0&&clearInterval(this.resendTimer)},1e3)}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed to resend. Please try again.")}this.resending=!1}},async completeOnboarding(){try{await this.$http.post("/user/complete-onboarding")}catch{}this.$router.push("/dashboard")}},template:`
<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
  <div class="w-full max-w-md">

    <!-- Header -->
    <div class="text-center mb-8">
      <router-link to="/" class="inline-flex justify-center mb-4">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-10 w-auto">
      </router-link>
    </div>

    <!-- Step: Verify Email -->
    <div v-if="step === 'verify-email'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
      <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="fas fa-envelope-open-text text-green-600 text-2xl"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
      <p class="text-gray-500 text-sm mb-1">
        We sent a verification link to
      </p>
      <p class="font-semibold text-gray-900 mb-5">{{ user && user.email }}</p>
      <p class="text-gray-400 text-xs mb-6">
        Click the link in the email to verify your address. This page will update automatically once verified.
      </p>

      <!-- Animated waiting indicator -->
      <div class="flex items-center justify-center gap-1.5 mb-6">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay:0s"></div>
        <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay:0.15s"></div>
        <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay:0.3s"></div>
        <span class="text-xs text-gray-400 ml-2">Waiting for verification…</span>
      </div>

      <button @click="resendEmail" :disabled="resending || resendCooldown > 0"
        class="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition mb-3">
        <i v-if="resending" class="fas fa-spinner fa-spin mr-1.5"></i>
        {{ resendCooldown > 0 ? 'Resend in ' + resendCooldown + 's' : 'Resend verification email' }}
      </button>

      <p class="text-xs text-gray-400">
        Wrong email?
        <button @click="$auth.logout(); $router.push('/register')"
          class="text-green-700 font-medium hover:underline">
          Start over
        </button>
      </p>
    </div>

    <!-- Step: Profile setup -->
    <div v-else-if="step === 'profile'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="fas fa-check-circle text-green-600 text-2xl"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-1 text-center">Email verified!</h2>
      <p class="text-gray-400 text-sm text-center mb-7">Your account is ready. Here's what to do next.</p>

      <!-- Checklist of next steps -->
      <div class="space-y-3 mb-7">
        <div v-for="item in [
          { icon: 'fa-id-card',     label: 'Complete KYC verification',   sub: 'Required to trade — takes 5 minutes', to: '/kyc' },
          { icon: 'fa-university',  label: 'Add your Australian bank account', sub: 'Needed to receive AUD from completed trades', to: '/bank-accounts' },
          { icon: 'fa-user',        label: 'Set up your profile',         sub: 'Add a photo and bio to build trust',   to: '/profile' },
        ]" :key="item.label"
          class="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition cursor-pointer"
          @click="$router.push(item.to)">
          <div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <i :class="['fas', item.icon, 'text-green-600 text-sm']"></i>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ item.label }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ item.sub }}</p>
          </div>
          <i class="fas fa-chevron-right text-gray-300 text-xs ml-auto mt-1.5"></i>
        </div>
      </div>

      <button @click="completeOnboarding"
        class="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
        Go to Dashboard
      </button>
    </div>

  </div>
</div>`},ov={name:"Dashboard",data(){return{stats:null,orders:[],matches:[],announcements:[],totalTrades:0,noticeboard:[],holidays:[],loading:!0,user:null}},async mounted(){var e,t;this.user=this.$auth.user,this.totalTrades=((e=this.user)==null?void 0:e.total_trades)||((t=this.user)==null?void 0:t.successful_trades)||0,await Promise.all([this.fetchStats(),this.fetchOrders(),this.fetchMatches(),this.fetchNoticeboard(),this.fetchHolidays()]),this.loading=!1},methods:{async fetchStats(){try{const{data:e}=await this.$http.get("/user/stats");this.stats=e.data}catch{}},async fetchOrders(){try{const{data:e}=await this.$http.get("/orders?status=open&per_page=3");this.orders=e.data}catch{}},async fetchMatches(){try{const{data:e}=await this.$http.get("/matches?per_page=5");this.matches=e.data}catch{}},async fetchNoticeboard(){try{const{data:e}=await this.$http.get("/noticeboard?per_page=3");this.noticeboard=e.data}catch{}},async fetchHolidays(){try{const{data:e}=await this.$http.get("/public-holidays");this.holidays=(e.data||[]).slice(0,2)}catch{}}},template:`<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-7xl mx-auto px-4 py-8">
    <loading-spinner v-if="loading" />
    <div v-else>

      <!-- Welcome + KYC alert -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          Good {{ new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening' }},
          {{ user && user.first_name }} 👋
        </h1>
        <router-link to="/orders/create"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition shadow-sm">
          <i class="fas fa-plus"></i> Create Order
        </router-link>
      </div>

      <alert-banner v-if="user && user.kyc_status === 'pending'" type="warning"
        message="Complete your identity verification (KYC) to start trading." :dismissible="false" />
      <alert-banner v-if="user && user.kyc_status === 'rejected'" type="error"
        message="Your KYC was rejected. Please re-submit your documents." :dismissible="false" />

      <!-- Holiday alerts -->
      <div v-if="holidays.length" class="mb-4">
        <alert-banner v-for="h in holidays" :key="h.name" type="info"
          :message="'⚠ Upcoming: ' + h.name + ' in ' + h.country + ' on ' + h.holiday_date + (h.affects_deliveries ? ' — deliveries may be affected.' : '.')" />
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="(card, i) in [
          {label:'Active Orders', value: stats && stats.active_orders||0, icon:'fa-list-alt', to:'/orders', color:'blue'},
          {label:'Active Matches', value: stats && stats.active_matches||0, icon:'fa-handshake', to:'/matches', color:'green'},
          {label:'Completed Trades', value: stats && stats.completed_trades||0, icon:'fa-check-circle', to:'/history', color:'teal'},
          {label:'Your Rating', value: stats && stats.rating ? parseFloat(stats.rating).toFixed(1)+'★' : 'New', icon:'fa-star', to:'/profile', color:'yellow'},
        ]" :key="i">
          <router-link :to="card.to"
            :class="['block bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow']">
            <div :class="['w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-'+card.color+'-100']">
              <i :class="['fas', card.icon, 'text-'+card.color+'-600', 'text-sm']"></i>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ card.value }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ card.label }}</p>
          </router-link>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Active matches / orders -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Pending actions -->
          <div v-if="matches.filter(m=>['deposit_uploaded','awaiting_confirmation','delivery_method_selecting','awaiting_risk_confirmation','awaiting_risk_deposit'].includes(m.status)).length">
            <h2 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <i class="fas fa-exclamation-circle text-orange-500"></i> Action Required
            </h2>
            <div class="space-y-3">
              <match-card v-for="m in matches.filter(m=>['awaiting_deposit','awaiting_confirmation','delivery_method_selecting','awaiting_risk_confirmation','awaiting_risk_deposit'].includes(m.status))"
                :key="m.ulid" :match="m" />
            </div>
          </div>

          <!-- Active matches -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-base font-semibold text-gray-900">Active Matches</h2>
              <router-link to="/matches" class="text-sm text-green-700 hover:underline">View all →</router-link>
            </div>
            <div class="space-y-3" v-if="matches.length">
              <match-card v-for="m in matches.slice(0,3)" :key="m.ulid" :match="m" />
            </div>
            <empty-state v-else icon="fa-handshake" title="No active matches"
              :subtitle="user && user.total_trades > 0 ? 'Browse open orders to find your next match.' : 'Browse open orders to find your first match.'"
              action-label="Browse Orders" action-to="/browse" />
          </div>

          <!-- Open orders -->
          <div v-if="orders.length">
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-base font-semibold text-gray-900">Your Open Orders</h2>
              <router-link to="/orders" class="text-sm text-green-700 hover:underline">View all →</router-link>
            </div>
            <div class="space-y-3">
              <order-card v-for="o in orders" :key="o.ulid" :order="o" />
            </div>
          </div>
        </div>

        <!-- Right sidebar -->
        <div class="space-y-6">

          <!-- Noticeboard -->
          <div v-if="noticeboard.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <i class="fas fa-bullhorn text-green-600"></i>
              <h3 class="text-sm font-semibold text-gray-900">Noticeboard</h3>
            </div>
            <div class="divide-y divide-gray-50">
              <div v-for="post in noticeboard" :key="post.id" class="px-4 py-3">
                <div class="flex items-center gap-1.5 mb-1">
                  <span v-if="post.is_pinned" class="text-xs text-orange-600"><i class="fas fa-thumbtack"></i></span>
                  <span class="text-xs font-medium text-gray-800">{{ post.title }}</span>
                </div>
                <p class="text-xs text-gray-500 line-clamp-2">{{ post.content }}</p>
              </div>
            </div>
          </div>

          <!-- Trust score -->
          <div v-if="stats" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Your Trust Score</h3>
            <div class="flex items-center gap-3">
              <div class="relative w-14 h-14">
                <svg class="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" stroke-width="3.8"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#15803d" stroke-width="3.8"
                    :stroke-dasharray="(stats.trust_score||0) + ' 100'" stroke-linecap="round"/>
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                  {{ stats.trust_score || 0 }}
                </span>
              </div>
              <div>
                <p class="text-xs text-gray-500">Complete trades and verify your account to increase your score.</p>
                <router-link to="/settings" class="text-xs text-green-700 hover:underline mt-1 block">
                  Improve score →
                </router-link>
              </div>
            </div>
          </div>

          <!-- Transaction Feed -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100">
              <h3 class="text-sm font-semibold text-gray-900">Recent Transactions</h3>
            </div>
            <div class="p-4">
              <transaction-feed-ticker />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`},lv={name:"Browse",data(){return{orders:[],meta:null,loading:!0,locations:[],groupedLocations:{},filters:{location_ids:[],order_type:"",min_aud:"",max_aud:"",sort:"newest",user_ulid:""},sendMoneyViaName:"",proposing:null,proposeForm:{my_order_ulid:"",proposed_aud:"",proposed_usd:"",message:""},myOpenOrders:[],rate:null,proposing_loading:!1,propose_error:null}},computed:{activeLocationNames(){return this.filters.location_ids.map(e=>this.locations.find(t=>t.id===e)).filter(Boolean).map(e=>e.name)}},async mounted(){var e,t;if(await Promise.all([this.fetchLocations(),this.fetchMyOrders(),this.fetchRate()]),this.$route.query.location){const s=parseInt(this.$route.query.location);s&&(this.filters.location_ids=[s])}if(this.$route.query.user){this.filters.user_ulid=this.$route.query.user;try{const{data:s}=await this.$http.get("/users/"+this.$route.query.user);this.sendMoneyViaName=((t=(e=s.data)==null?void 0:e.display_name)==null?void 0:t.split(" ")[0])||""}catch{}}await this.load()},methods:{async load(e=1){var t,s,r;this.loading=!0;try{const a={page:e};this.filters.location_ids.length&&(a.zim_location_ids=this.filters.location_ids.join(",")),this.filters.order_type&&(a.order_type=this.filters.order_type),this.filters.min_aud&&(a.min_aud=this.filters.min_aud),this.filters.max_aud&&(a.max_aud=this.filters.max_aud),this.filters.sort!=="newest"&&(a.sort=this.filters.sort),this.filters.user_ulid&&(a.user_ulid=this.filters.user_ulid);const{data:i}=await this.$http.get("/orders/browse",{params:a});this.orders=i.data||[],this.meta=(t=i.meta)==null?void 0:t.pagination}catch(a){this.$toast.error(((r=(s=a.response)==null?void 0:s.data)==null?void 0:r.message)||"Failed to load orders.")}this.loading=!1},async fetchLocations(){try{const{data:e}=await this.$http.get("/countries/2/locations"),t=e.data;this.locations=t.flat||[];const s={};(t.grouped||[]).forEach(r=>{s[r.province]=r.locations}),this.groupedLocations=s}catch{}},async fetchMyOrders(){try{const{data:e}=await this.$http.get("/orders",{params:{status:"open"}});this.myOpenOrders=e.data||[]}catch{}},async fetchRate(){try{const{data:e}=await this.$http.get("/exchange-rates/AUD/USD");this.rate=e.data}catch{}},toggleCity(e){e=parseInt(e);const t=this.filters.location_ids.indexOf(e);t===-1?this.filters.location_ids.push(e):this.filters.location_ids.splice(t,1)},isCitySelected(e){return this.filters.location_ids.includes(parseInt(e))},clearCities(){this.filters.location_ids=[]},resetFilters(){this.filters={location_ids:[],order_type:"",min_aud:"",max_aud:"",sort:"newest",user_ulid:""},this.sendMoneyViaName="",this.load()},fixUrl(e){if(!e)return null;try{const t=new URL(e);return window.location.origin+t.pathname}catch{return e}},openPropose(e){if(!this.myOpenOrders.length){this.$toast.error("You need an open order to propose a match."),this.$router.push("/orders/create");return}this.proposing=e,this.propose_error=null;const s=this.myOpenOrders.find(r=>r.order_type!==e.order_type)||this.myOpenOrders[0];this.proposeForm={my_order_ulid:(s==null?void 0:s.ulid)||"",proposed_aud:e.amount_aud,proposed_usd:e.amount_usd,message:""}},calcUsd(){if(!this.rate||!this.proposeForm.proposed_aud)return;const e=parseFloat(this.rate.platform_fee_percent||1.5),t=parseFloat(this.proposeForm.proposed_aud);this.proposeForm.proposed_usd=((t-t*e/100)*parseFloat(this.rate.rate)).toFixed(2)},async submitPropose(){var e,t;if(!this.proposeForm.my_order_ulid||!this.proposeForm.proposed_aud){this.propose_error="Please select your order and enter an amount.";return}this.proposing_loading=!0,this.propose_error=null;try{const{data:s}=await this.$http.post("/orders/"+this.proposing.ulid+"/propose-match",{target_order_ulid:this.proposing.ulid,proposed_aud:parseFloat(this.proposeForm.proposed_aud),proposed_usd:parseFloat(this.proposeForm.proposed_usd),message:this.proposeForm.message||null});this.$toast.success("Match proposed! You will be redirected to the match."),this.proposing=null,this.$router.push("/matches/"+s.data.match.ulid)}catch(s){this.propose_error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed to propose match."}this.proposing_loading=!1},viewProfile(e){e&&this.$router.push("/profile/"+e)},trustColor(e){return e>=70?"text-green-600":e>=40?"text-yellow-600":"text-gray-400"}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />

  <!-- ── PROPOSE MATCH MODAL ──────────────────────────────────────────────── -->
  <div v-if="proposing"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    @click.self="proposing = null">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-bold text-gray-900">Propose a match</h2>
        <button @click="proposing = null"
          class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-100">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Their order</p>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-black text-gray-900 text-xl">{{ $fmt.aud(proposing.amount_aud) }}</p>
            <p class="text-sm text-gray-500 mt-0.5">{{ $fmt.usd(proposing.amount_usd) }}</p>
            <p class="text-xs text-gray-400 mt-0.5">
              <i class="fas fa-map-marker-alt text-green-600 mr-0.5"></i>
              {{ proposing.delivery_location && proposing.delivery_location.name }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-800">{{ proposing.owner ? proposing.owner.display_name : '' }}</p>
            <div class="flex items-center gap-1 justify-end mt-0.5">
              <i class="fas fa-star text-yellow-400 text-xs"></i>
              <span class="text-xs text-gray-500">
                {{ proposing.owner ? proposing.owner.rating : null ? parseFloat(proposing.owner.rating).toFixed(1) : 'No ratings' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <alert-banner v-if="propose_error" type="error" :message="propose_error" class="mb-4" />

      <div class="space-y-4">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1.5">Use my order</label>
          <select v-model="proposeForm.my_order_ulid"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option v-if="!myOpenOrders.length" value="">No open orders — create one first</option>
            <option v-for="o in myOpenOrders" :key="o.ulid" :value="o.ulid">
              {{ o.order_type === 'send_to_zim' ? 'Send' : 'Receive' }}
              · {{ $fmt.aud(o.amount_aud) }}
              · {{ o.delivery_location && o.delivery_location.name ? o.delivery_location.name : 'Unknown city' }}
            </option>
          </select>
          <router-link v-if="!myOpenOrders.length" to="/orders/create"
            class="text-xs text-green-700 font-semibold hover:underline mt-1 inline-block">
            + Create an order first
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1.5">AUD amount</label>
            <input v-model="proposeForm.proposed_aud" type="number" min="50" step="10" @input="calcUsd"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="500">
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1.5">
              USD <span class="text-gray-400 font-normal text-xs">(auto)</span>
            </label>
            <input v-model="proposeForm.proposed_usd" type="number" min="1" step="0.01"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="310.27">
          </div>
        </div>
        <p v-if="rate" class="text-xs text-gray-400 -mt-2">
          Rate: 1 AUD = {{ parseFloat(rate.rate).toFixed(4) }} USD · Fee: {{ rate.platform_fee_percent || 1.5 }}%
        </p>

        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1.5">
            Message <span class="text-gray-400 font-normal text-xs">(optional)</span>
          </label>
          <textarea v-model="proposeForm.message" rows="2"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500"
            placeholder="Hi! I am available today and can confirm quickly..."></textarea>
        </div>

        <div class="flex gap-3">
          <button @click="submitPropose"
            :disabled="proposing_loading || !proposeForm.my_order_ulid || !proposeForm.proposed_aud || !myOpenOrders.length"
            class="flex-1 py-3.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition-all shadow-sm"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="proposing_loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-handshake mr-2"></i>
            Send proposal
          </button>
          <button @click="proposing = null"
            class="px-5 py-3.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ── MAIN CONTENT ──────────────────────────────────────────────────────── -->
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Browse Open Orders</h1>
        <div v-if="sendMoneyViaName"
          class="mt-3 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
          <i class="fas fa-filter text-green-600"></i>
          <p class="text-sm text-green-800 font-medium flex-1">
            Showing orders by <strong>{{ sendMoneyViaName }}</strong>
          </p>
          <button @click="filters.user_ulid=''; sendMoneyViaName=''; load()"
            class="text-xs text-green-700 font-semibold hover:underline">Clear filter</button>
        </div>
        <p class="text-sm text-gray-500 mt-0.5">Find a match and start a transaction.</p>
      </div>
      <router-link to="/orders/create"
        class="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all shadow-sm"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> Post your own order
      </router-link>
    </div>

    <div class="grid lg:grid-cols-4 gap-6">

      <!-- ── SIDEBAR ─────────────────────────────────────────────────────── -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-gray-900">Filters</h2>
            <button @click="resetFilters" class="text-xs text-green-700 hover:underline font-medium">Reset all</button>
          </div>

          <!-- Direction -->
          <div class="mb-4">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Direction</label>
            <select v-model="filters.order_type" @change="load()"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
              <option value="">All directions</option>
              <option value="send_to_zim">Send to Zimbabwe</option>
              <option value="receive_from_zim">Receive from Zimbabwe</option>
            </select>
          </div>

          <!-- Multi-city filter -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Zimbabwe cities
                <span v-if="filters.location_ids.length"
                  class="ml-1 bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {{ filters.location_ids.length }}
                </span>
              </label>
              <button v-if="filters.location_ids.length" @click="clearCities(); load()"
                class="text-xs text-red-500 hover:underline">Clear</button>
            </div>

            <!-- Selected pills -->
            <div v-if="filters.location_ids.length" class="flex flex-wrap gap-1 mb-2">
              <span v-for="name in activeLocationNames" :key="name"
                class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                {{ name }}
              </span>
            </div>

            <!-- Checkboxes -->
            <div class="max-h-52 overflow-y-auto border border-gray-100 rounded-xl">
              <div v-if="!Object.keys(groupedLocations).length" class="px-3 py-4 text-xs text-gray-400 text-center">
                <i class="fas fa-spinner fa-spin mr-1"></i> Loading...
              </div>
              <div v-for="(locs, province) in groupedLocations" :key="province">
                <p class="text-xs font-semibold text-gray-400 px-3 py-1.5 bg-gray-50 border-b border-gray-100 sticky top-0">
                  {{ province }}
                </p>
                <label v-for="loc in locs" :key="loc.id"
                  class="flex items-center gap-2.5 px-3 py-2 hover:bg-green-50 cursor-pointer transition-colors">
                  <input type="checkbox"
                    :checked="isCitySelected(loc.id)"
                    @change="toggleCity(loc.id)"
                    class="w-3.5 h-3.5 rounded accent-green-600 flex-shrink-0">
                  <span class="text-sm text-gray-700">{{ loc.name }}</span>
                </label>
              </div>
            </div>
            <button @click="load()"
              class="w-full mt-2 py-2 text-xs font-semibold text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
              Apply city filter
            </button>
          </div>

          <!-- Amount -->
          <div class="mb-4">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Amount (AUD)</label>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="filters.min_aud" @keyup.enter="load()" type="number" min="50"
                class="px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-green-500"
                placeholder="Min">
              <input v-model="filters.max_aud" @keyup.enter="load()" type="number"
                class="px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-green-500"
                placeholder="Max">
            </div>
          </div>

          <!-- Sort -->
          <div class="mb-4">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Sort by</label>
            <select v-model="filters.sort" @change="load()"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
              <option value="newest">Newest first</option>
              <option value="amount_asc">Amount: low to high</option>
              <option value="amount_desc">Amount: high to low</option>
            </select>
          </div>

          <button @click="load()"
            class="w-full py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i class="fas fa-search mr-1.5 text-xs"></i> Search orders
          </button>
        </div>
      </div>

      <!-- ── RESULTS ─────────────────────────────────────────────────────── -->
      <div class="lg:col-span-3">

        <!-- Active filter chips -->
        <div v-if="filters.location_ids.length || filters.order_type || filters.min_aud || filters.max_aud"
          class="flex flex-wrap gap-2 mb-4 items-center">
          <span class="text-xs text-gray-500 font-medium">Active:</span>
          <span v-if="filters.order_type"
            class="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
            {{ filters.order_type === 'send_to_zim' ? 'Send to ZIM' : 'Receive from ZIM' }}
            <button @click="filters.order_type = ''; load()"><i class="fas fa-times text-xs ml-0.5"></i></button>
          </span>
          <span v-for="name in activeLocationNames" :key="name"
            class="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
            <i class="fas fa-map-marker-alt text-xs"></i>{{ name }}
          </span>
          <span v-if="filters.min_aud || filters.max_aud"
            class="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">
            AUD {{ filters.min_aud || '50' }}{{ filters.max_aud ? ' – ' + filters.max_aud : '+' }}
          </span>
        </div>

        <loading-spinner v-if="loading" />

        <div v-else-if="orders.length" class="space-y-3">
          <div class="flex items-center justify-between text-xs text-gray-400 px-1 mb-2">
            <span>{{ meta && meta.total || orders.length }} order{{ (meta && meta.total || orders.length) !== 1 ? 's' : '' }} found</span>
            <span>Boosted orders appear first</span>
          </div>

          <div v-for="order in orders" :key="order.ulid"
            :class="['bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-5',
              order.is_trusted_contact
                ? 'border-green-300 ring-1 ring-green-200 bg-green-50/20'
                : 'border-gray-100']">

            <!-- Trusted contact badge -->
            <div v-if="order.is_trusted_contact"
              class="flex items-center gap-1.5 mb-3 text-xs font-bold text-green-700 bg-green-100 w-fit px-3 py-1.5 rounded-xl">
              <i class="fas fa-user-check text-xs"></i> Trusted contact
            </div>

            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap gap-2 mb-2.5">
                  <span :class="['text-xs font-bold px-2.5 py-1 rounded-lg',
                    order.order_type === 'send_to_zim' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                    {{ order.order_type === 'send_to_zim' ? 'Send to Zimbabwe' : 'Receive from Zimbabwe' }}
                  </span>
                  <span v-if="order.is_boosted" class="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-lg font-bold">
                    <i class="fas fa-bolt mr-0.5"></i> Boosted
                  </span>
                </div>

                <p class="text-2xl font-black text-gray-900">{{ $fmt.aud(order.amount_aud) }}</p>
                <p class="text-sm text-gray-500 mt-0.5">
                  {{ $fmt.usd(order.amount_usd) }}
                  <span v-if="order.delivery_location && order.delivery_location.name">
                    <i class="fas fa-map-marker-alt text-green-600 text-xs ml-2 mr-0.5"></i>
                    {{ order.delivery_location.name }}
                    <span v-if="order.delivery_location.province" class="text-gray-400">, {{ order.delivery_location.province }}</span>
                  </span>
                </p>

                <div class="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                  <div class="w-9 h-9 rounded-xl bg-green-100 flex-shrink-0 overflow-hidden relative">
                    <img v-if="order.owner && order.owner.avatar_url"
                      :src="fixUrl(order.owner.avatar_url)"
                      class="w-full h-full object-cover"
                      @error="$event.target.style.display='none'">
                    <div class="absolute inset-0 flex items-center justify-center text-green-700 font-bold text-sm">
                      {{ order.owner && order.owner.display_name ? order.owner.display_name[0].toUpperCase() : '?' }}
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ order.owner ? order.owner.display_name : '' }}</p>
                    <div class="flex items-center flex-wrap gap-3 text-xs text-gray-400 mt-0.5">
                      <span v-if="order.owner && order.owner.rating">
                        <i class="fas fa-star text-yellow-400"></i>
                        {{ parseFloat(order.owner.rating).toFixed(1) }}
                      </span>
                      <span>{{ order.owner && order.owner.total_trades }} trades</span>
                      <span :class="['font-semibold', trustColor(order.owner && order.owner.trust_score || 0)]">
                        Trust {{ order.owner && order.owner.trust_score }}
                      </span>
                      <span v-if="order.owner && order.owner.kyc_verified" class="text-green-600 font-medium">
                        <i class="fas fa-check-circle text-xs"></i> Verified
                      </span>
                      <span>{{ order.created_human }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-2 flex-shrink-0">
                <button @click="openPropose(order)"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all shadow-sm whitespace-nowrap"
                  style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
                  <i class="fas fa-handshake text-xs"></i> Propose match
                </button>
                <!-- Use programmatic navigation to avoid route conflicts with /profile/:ulid -->
                <button v-if="order.owner && order.owner.ulid" @click="viewProfile(order.owner.ulid)"
                  class="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors justify-center">
                  <i class="fas fa-user text-xs"></i> View profile
                </button>
              </div>
            </div>
          </div>

          <pagination-links :meta="meta" @page="load($event)" />
        </div>

        <empty-state v-else-if="!loading" icon="fa-search"
          title="No orders found"
          :subtitle="filters.location_ids.length
            ? 'No open orders for the selected cities. Try adding more cities or clear the city filter.'
            : 'No open orders match your filters. Try adjusting your search or post your own order.'"
          action-label="Post your own order"
          action-to="/orders/create" />
      </div>
    </div>
  </div>
  <app-footer />
</div>`},dv={name:"CreateOrder",data(){return{step:1,form:{order_type:"",amount_aud:"",zim_delivery_location_id:"",zim_delivery_address:"",zim_delivery_notes:"",zim_recipient_name:"",zim_recipient_phone:"",aud_bank_account_id:"",saved_recipient_id:"",save_recipient:!1,recipient_nickname:""},rate:null,locations:[],groupedLocations:[],bankAccounts:[],savedRecipients:[],loading:!1,submitting:!1,error:null,feeCalc:null}},computed:{selectedLocation(){return this.locations.find(e=>e.id==this.form.zim_delivery_location_id)},selectedAccount(){return this.bankAccounts.find(e=>e.id==this.form.aud_bank_account_id)},canProceedStep1(){return!!this.form.order_type},canProceedStep2(){return parseFloat(this.form.amount_aud)>=50},canProceedStep3(){return!!this.form.zim_delivery_location_id},canProceedStep4(){return!!(this.form.zim_recipient_name&&this.form.zim_recipient_phone)},canProceedStep5(){return!!this.form.aud_bank_account_id},canProceed(){return[this.canProceedStep1,this.canProceedStep2,this.canProceedStep3,this.canProceedStep4,this.canProceedStep5][this.step-1]},reviewRows(){return[{label:"Direction",value:this.form.order_type==="send_to_zim"?"🇦🇺 Send to Zimbabwe":"🇿🇼 Receive from Zimbabwe",highlight:!1},{label:"Amount (AUD)",value:this.$fmt.aud(parseFloat(this.form.amount_aud)||0),highlight:!1},{label:"Platform fee",value:this.feeCalc?this.$fmt.aud(this.feeCalc.feeAud)+" ("+this.feeCalc.feePercent+"%)":"—",highlight:!1},{label:"Recipient gets",value:this.feeCalc?this.$fmt.usd(this.feeCalc.usd):"—",highlight:!0},{label:"City",value:this.selectedLocation?this.selectedLocation.name:"—",highlight:!1},{label:"Recipient",value:this.form.zim_recipient_name&&this.form.zim_recipient_phone?this.form.zim_recipient_name+" · "+this.form.zim_recipient_phone:"—",highlight:!1},{label:"Your bank",value:this.selectedAccount?this.selectedAccount.bank_name+" ····"+(this.selectedAccount.account_number||"").slice(-4):"—",highlight:!1}]},quickAmounts(){return[100,200,300,500,1e3,2500,5e3,7500,1e4]}},async mounted(){await Promise.all([this.fetchRate(),this.fetchLocations(),this.fetchBankAccounts(),this.fetchRecipients()]),this.bankAccounts.length||(this.$toast.error("Please add an Australian bank account before creating an order."),this.$router.replace("/bank-accounts"))},watch:{"form.amount_aud":"updateCalc","form.saved_recipient_id"(e){const t=this.savedRecipients.find(s=>s.id==e);t&&(this.form.zim_recipient_name=t.recipient_name,this.form.zim_recipient_phone=t.recipient_phone,this.form.zim_delivery_location_id=t.delivery_location_id,this.form.zim_delivery_address=t.delivery_address||"",this.form.zim_delivery_notes=t.delivery_notes||"")}},methods:{async fetchRate(){try{const{data:e}=await this.$http.get("/exchange-rates/AUD/USD");this.rate=e.data,this.updateCalc()}catch{}},async fetchLocations(){try{const{data:e}=await this.$http.get("/countries/2/locations");this.locations=e.data.flat||[],this.groupedLocations=e.data.grouped||[]}catch{}},async fetchBankAccounts(){try{const{data:e}=await this.$http.get("/bank-accounts");this.bankAccounts=e.data||[]}catch{}},async fetchRecipients(){try{const{data:e}=await this.$http.get("/recipients");this.savedRecipients=e.data||[]}catch{}},updateCalc(){const e=parseFloat(this.form.amount_aud);if(!e||!this.rate){this.feeCalc=null;return}const t=parseFloat(this.rate.platform_fee_percent||1.5),s=parseFloat((e*t/100).toFixed(2)),r=e-s,a=parseFloat((r*parseFloat(this.rate.rate)).toFixed(2));this.feeCalc={feeAud:s,usd:a,feePercent:t}},next(){this.step<6&&this.step++},back(){this.step>1&&this.step--},isQuickAmountSelected(e){return parseFloat(this.form.amount_aud)===e},selectQuickAmount(e){this.form.amount_aud=e,this.updateCalc()},async submit(){var e,t;this.submitting=!0,this.error=null;try{const{data:s}=await this.$http.post("/orders",{...this.form,amount_aud:parseFloat(this.form.amount_aud),zim_delivery_location_id:parseInt(this.form.zim_delivery_location_id),aud_bank_account_id:parseInt(this.form.aud_bank_account_id)});this.$toast.success("Order created successfully!"),this.$router.push("/orders/"+s.data.order.ulid)}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed to create order."}this.submitting=!1}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">

    <div class="mb-8">
      <router-link to="/orders" class="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1">
        <i class="fas fa-arrow-left text-xs"></i> Back to orders
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900">Create Order</h1>
      <div class="flex items-center gap-2 mt-4">
        <div v-for="i in 6" :key="i"
          :class="['flex-1 h-1.5 rounded-full transition-colors',
            i <= step ? 'bg-green-600' : 'bg-gray-200']"></div>
      </div>
      <p class="text-xs text-gray-400 mt-1">Step {{ step }} of 6</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

      <!-- Step 1: Direction -->
      <div v-if="step === 1">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">What would you like to do?</h2>
        <p class="text-sm text-gray-500 mb-6">Choose the direction of your transaction.</p>
        <div class="grid gap-4">
          <button v-for="opt in [
            {type:'send_to_zim',      icon:'fa-paper-plane',     label:'Send to Zimbabwe',       desc:'Deposit AUD here. Recipient gets USD cash in Zimbabwe.', color:'blue'},
            {type:'receive_from_zim', icon:'fa-hand-holding-usd', label:'Receive from Zimbabwe', desc:'Someone delivers USD cash in Zimbabwe. You get AUD here.', color:'purple'}
          ]" :key="opt.type" @click="form.order_type = opt.type"
            :class="['p-5 rounded-2xl border-2 text-left transition cursor-pointer',
              form.order_type === opt.type
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300']">
            <div class="flex items-center gap-3">
              <div :class="'w-10 h-10 rounded-xl flex items-center justify-center bg-' + opt.color + '-100'">
                <i :class="'fas ' + opt.icon + ' text-' + opt.color + '-600'"></i>
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ opt.label }}</p>
                <p class="text-sm text-gray-500 mt-0.5">{{ opt.desc }}</p>
              </div>
              <i v-if="form.order_type === opt.type"
                class="fas fa-check-circle text-green-600 ml-auto text-lg"></i>
            </div>
          </button>
        </div>
      </div>

      <!-- Step 2: Amount -->
      <div v-if="step === 2">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">How much AUD?</h2>
        <p class="text-sm text-gray-500 mb-6">Minimum AUD $50. Your KYC tier determines your maximum.</p>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Amount (AUD)</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
            <input v-model="form.amount_aud" type="number" min="50" step="10"
              class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold focus:outline-none focus:border-green-500"
              placeholder="0.00" @input="updateCalc">
          </div>
        </div>

        <smart-calculator :amount-aud="parseFloat(form.amount_aud) || 0" :rate="rate" />

        <div class="flex gap-2 mt-4 flex-wrap">
          <button v-for="amt in quickAmounts" :key="amt"
            @click="selectQuickAmount(amt)"
            :class="['px-3 py-1.5 text-xs rounded-lg border transition font-medium',
              isQuickAmountSelected(amt)
                ? 'bg-green-700 text-white border-green-700'
                : 'border-gray-200 text-gray-600 hover:border-green-400']">&#36;{{ amt }}</button>
        </div>
      </div>

      <!-- Step 3: City -->
      <div v-if="step === 3">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Select Zimbabwe city</h2>
        <p class="text-sm text-gray-500 mb-4">Choose the city for cash delivery. You can only match with orders for the same city.</p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">City <span class="text-red-500">*</span></label>
          <select v-model="form.zim_delivery_location_id"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white">
            <option value="">Select a city...</option>
            <optgroup v-for="group in groupedLocations" :key="group.province" :label="group.province">
              <option v-for="loc in group.locations" :key="loc.id" :value="loc.id">
                {{ loc.name }}
              </option>
            </optgroup>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Specific area or street
            <span class="text-gray-400 font-normal">(optional)</span>
          </label>
          <input v-model="form.zim_delivery_address" type="text"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="e.g. Near OK Supermarket, Borrowdale">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            Delivery notes
            <span class="text-gray-400 font-normal">(optional)</span>
          </label>
          <input v-model="form.zim_delivery_notes" type="text"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
            placeholder="e.g. Call 30 minutes before arrival">
        </div>
      </div>

      <!-- Step 4: Recipient -->
      <div v-if="step === 4">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Zimbabwe recipient details</h2>
        <p class="text-sm text-gray-500 mb-4">Who will receive the USD cash in Zimbabwe?</p>

        <div v-if="savedRecipients.length" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Use a saved recipient</label>
          <select v-model="form.saved_recipient_id"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white">
            <option value="">Enter details manually...</option>
            <option v-for="r in savedRecipients" :key="r.id" :value="r.id">
              {{ r.nickname }} — {{ r.recipient_name }}
            </option>
          </select>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Full name <span class="text-red-500">*</span>
            </label>
            <input v-model="form.zim_recipient_name" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="e.g. Chido Moyo">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Phone number <span class="text-red-500">*</span>
            </label>
            <input v-model="form.zim_recipient_phone" type="tel"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="+263 77 123 4567">
          </div>
        </div>

        <div v-if="!form.saved_recipient_id" class="mt-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.save_recipient" type="checkbox" class="w-4 h-4 text-green-600">
            <span class="text-sm text-gray-700">Save this recipient for future orders</span>
          </label>
          <input v-if="form.save_recipient" v-model="form.recipient_nickname" type="text"
            class="mt-2 w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
            placeholder="Nickname (e.g. Mum, Brother James)">
        </div>
      </div>

      <!-- Step 5: Bank Account -->
      <div v-if="step === 5">
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Your Australian bank account</h2>
        <p class="text-sm text-gray-500 mb-4">This is where you will deposit from (or receive AUD to).</p>

        <div v-if="bankAccounts.length" class="space-y-3">
          <button v-for="acc in bankAccounts" :key="acc.id" @click="form.aud_bank_account_id = acc.id"
            :class="['w-full p-4 rounded-xl border-2 text-left transition',
              form.aud_bank_account_id == acc.id
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300']">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ acc.bank_name }}</p>
                <p class="text-sm text-gray-500 mt-0.5">
                  {{ acc.account_name }} &middot; &middot;&middot;&middot;&middot;{{ (acc.account_number || '').slice(-4) }}
                </p>
                <span v-if="acc.is_primary" class="text-xs text-green-700 font-medium">Primary</span>
              </div>
              <i v-if="form.aud_bank_account_id == acc.id"
                class="fas fa-check-circle text-green-600 text-lg"></i>
            </div>
          </button>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500 text-sm mb-4">No bank accounts yet.</p>
          <router-link to="/bank-accounts" class="text-green-700 text-sm font-medium hover:underline">
            Add a bank account &rarr;
          </router-link>
        </div>
      </div>

      <!-- Step 6: Review -->
      <div v-if="step === 6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Review your order</h2>
        <alert-banner v-if="error" type="error" :message="error" />

        <div class="space-y-0">
          <div v-for="row in reviewRows" :key="row.label"
            class="flex justify-between py-3 border-b border-gray-100 last:border-0">
            <span class="text-sm text-gray-500">{{ row.label }}</span>
            <span :class="['text-sm font-medium',
              row.highlight ? 'text-green-700 text-base font-bold' : 'text-gray-900']">
              {{ row.value }}
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-between mt-8">
        <button v-if="step > 1" @click="back"
          class="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
          <i class="fas fa-arrow-left mr-1"></i> Back
        </button>
        <div v-else></div>

        <button v-if="step < 6" @click="next" :disabled="!canProceed"
          class="px-6 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 transition disabled:opacity-40">
          Continue <i class="fas fa-arrow-right ml-1"></i>
        </button>

        <button v-if="step === 6" @click="submit" :disabled="submitting"
          class="px-6 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 transition disabled:opacity-50">
          <i v-if="submitting" class="fas fa-spinner fa-spin mr-2"></i>
          Create Order
        </button>
      </div>
    </div>
  </div>
  <app-footer />
</div>`},cv={name:"Orders",data(){return{tab:"open",orders:[],meta:null,loading:!0,cancelling:null}},computed:{tabs(){return[{key:"open",label:"Open",icon:"fa-clock"},{key:"completed",label:"Completed",icon:"fa-check-circle"},{key:"cancelled",label:"Cancelled",icon:"fa-times-circle"},{key:"expired",label:"Expired",icon:"fa-hourglass-end"}]}},async mounted(){await this.load()},watch:{tab(){this.load()}},methods:{async load(e=1){var t;this.loading=!0;try{const{data:s}=await this.$http.get("/orders",{params:{status:this.tab,page:e}});this.orders=s.data,this.meta=(t=s.meta)==null?void 0:t.pagination}catch{}this.loading=!1},async cancel(e){var s,r;const t=prompt("Reason for cancelling (optional):")??"";this.cancelling=e.ulid;try{await this.$http.put("/orders/"+e.ulid+"/cancel",{reason:t}),this.$toast.success("Order cancelled."),await this.load()}catch(a){this.$toast.error(((r=(s=a.response)==null?void 0:s.data)==null?void 0:r.message)||"Could not cancel.")}this.cancelling=null},async extend(e){var t,s;try{await this.$http.put("/orders/"+e.ulid+"/extend"),this.$toast.success("Order extended by 48 hours."),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Could not extend.")}},expiresLabel(e){if(!e)return"";const t=new Date(e)-new Date;if(t<0)return"Expired";const s=Math.floor(t/36e5);return s<24?"Expires in "+s+"h":"Expires in "+Math.floor(s/24)+"d"}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">My Orders</h1>
      <router-link to="/orders/create"
        class="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition">
        <i class="fas fa-plus"></i> New Order
      </router-link>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-6 overflow-x-auto">
      <button v-for="t in tabs" :key="t.key" @click="tab = t.key"
        :class="['flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap',
          tab === t.key ? 'bg-green-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50']">
        <i :class="'fas ' + t.icon + ' text-xs'"></i>
        {{ t.label }}
      </button>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="orders.length" class="space-y-3">
      <div v-for="order in orders" :key="order.ulid"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap gap-2 mb-2">
              <span :class="['text-xs font-semibold px-2.5 py-1 rounded-lg',
                order.order_type === 'send_to_zim' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                <i :class="['fas mr-1', order.order_type === 'send_to_zim' ? 'fa-paper-plane' : 'fa-hand-holding-usd']"></i>
                {{ order.order_type === 'send_to_zim' ? 'Send to ZIM' : 'Receive from ZIM' }}
              </span>
              <status-badge :status="order.status" />
              <span v-if="order.is_boosted" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                <i class="fas fa-bolt mr-0.5"></i> Boosted
              </span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ $fmt.aud(order.amount_aud) }}</p>
            <p class="text-sm text-gray-400 mt-0.5">
              {{ $fmt.usd(order.amount_usd) }}
              &middot; {{ order.delivery_location?.name }}
            </p>
            <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span><i class="far fa-clock mr-1"></i>{{ $fmt.date(order.created_at) }}</span>
              <span v-if="order.status === 'open'" class="text-orange-500 font-medium">
                {{ expiresLabel(order.expires_at) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2 flex-shrink-0">
            <router-link :to="'/orders/' + order.ulid"
              class="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
              View
            </router-link>
            <button v-if="order.status === 'open'" @click="extend(order)"
              class="px-3 py-1.5 text-xs font-medium border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50">
              Extend
            </button>
            <button v-if="order.status === 'open'" @click="cancel(order)"
              :disabled="cancelling === order.ulid"
              class="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>

        <!-- Recipient row -->
        <div v-if="order.zim_recipient_name" class="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-500">
          <i class="fas fa-user text-gray-400"></i>
          {{ order.zim_recipient_name }} &middot; {{ order.zim_recipient_phone }}
        </div>
      </div>

      <pagination-links :meta="meta" @page="load($event)" />
    </div>

    <empty-state v-else icon="fa-list-alt"
      :title="tab === 'open' ? 'No open orders' : 'No ' + tab + ' orders'"
      :subtitle="tab === 'open' ? 'Create your first order to get started.' : 'Nothing here yet.'"
      :action-label="tab === 'open' ? 'Create Order' : null"
      action-to="/orders/create" />
  </div>
  <app-footer />
</div>`},uv={name:"OrderDetail",data(){return{order:null,matches:[],loading:!0}},async mounted(){try{const e=this.$route.params.ulid,[t,s]=await Promise.all([this.$http.get("/orders/"+e),this.$http.get("/matches",{params:{order_ulid:e}}).catch(()=>({data:{data:[]}}))]);this.order=t.data.data,this.matches=s.data.data||[]}catch{this.$router.push("/orders")}this.loading=!1},methods:{async extend(){var e,t;try{await this.$http.put("/orders/"+this.order.ulid+"/extend"),this.$toast.success("Order extended by 48 hours.");const{data:s}=await this.$http.get("/orders/"+this.order.ulid);this.order=s.data}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed.")}},async cancel(){var e,t;if(confirm("Cancel this order?"))try{await this.$http.put("/orders/"+this.order.ulid+"/cancel"),this.$toast.success("Order cancelled."),this.$router.push("/orders")}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed.")}}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center gap-2 mb-6">
      <router-link to="/orders" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
        <i class="fas fa-arrow-left text-xs"></i> My Orders
      </router-link>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="order" class="space-y-5">
      <!-- Header -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <status-badge :status="order.status" />
              <span :class="['text-xs font-semibold px-2 py-0.5 rounded-lg', order.order_type === 'send_to_zim' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                {{ order.order_type === 'send_to_zim' ? 'Send to Zimbabwe' : 'Receive from Zimbabwe' }}
              </span>
              <span v-if="order.is_boosted" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-lg font-medium">
                <i class="fas fa-bolt mr-0.5"></i> Boosted
              </span>
            </div>
            <p class="text-3xl font-black text-gray-900">{{ $fmt.aud(order.amount_aud) }}</p>
            <p class="text-base text-gray-500 mt-0.5">{{ $fmt.usd(order.amount_usd) }} &middot; {{ order.delivery_location?.name }}</p>
          </div>
          <div class="flex flex-col gap-2 flex-shrink-0">
            <button v-if="order.status === 'open'" @click="extend"
              class="px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50">
              Extend 48h
            </button>
            <button v-if="order.status === 'open'" @click="cancel"
              class="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 rounded-xl hover:bg-red-50">
              Cancel
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="bg-gray-50 rounded-xl px-3 py-2.5">
            <p class="text-gray-400 text-xs mb-0.5">Recipient</p>
            <p class="font-semibold text-gray-800">{{ order.zim_recipient_name || '—' }}</p>
            <p class="text-gray-500 text-xs">{{ order.zim_recipient_phone || '' }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-3 py-2.5">
            <p class="text-gray-400 text-xs mb-0.5">Platform fee</p>
            <p class="font-semibold text-gray-800">{{ $fmt.aud(order.platform_fee_aud) }} ({{ order.platform_fee_percent }}%)</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-3 py-2.5">
            <p class="text-gray-400 text-xs mb-0.5">Created</p>
            <p class="font-semibold text-gray-800">{{ $fmt.date(order.created_at) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl px-3 py-2.5">
            <p class="text-gray-400 text-xs mb-0.5">Expires</p>
            <p :class="['font-semibold', order.status === 'open' ? 'text-orange-600' : 'text-gray-800']">
              {{ order.expires_at ? $fmt.date(order.expires_at) : '—' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="order.status === 'open'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
        <div class="grid grid-cols-2 gap-3">
          <router-link :to="'/browse?location=' + order.zim_delivery_location_id"
            class="flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl border border-green-200 text-green-700 hover:bg-green-50 transition-colors">
            <i class="fas fa-search text-xs"></i> Find matches
          </router-link>
          <router-link :to="'/orders/create?repeat=' + order.ulid"
            class="flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl bg-green-700 text-white hover:bg-green-800 transition-colors">
            <i class="fas fa-redo text-xs"></i> Repeat order
          </router-link>
        </div>
      </div>

      <!-- Active matches -->
      <div v-if="matches.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">Matches ({{ matches.length }})</h3>
        </div>
        <div class="divide-y divide-gray-50">
          <router-link v-for="m in matches" :key="m.ulid" :to="'/matches/' + m.ulid"
            class="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
            <div>
              <status-badge :status="m.status" />
              <p class="text-sm text-gray-600 mt-1">{{ m.agreed_aud ? $fmt.aud(m.agreed_aud) : 'Proposed: ' + $fmt.aud(m.proposed_aud) }}</p>
            </div>
            <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
          </router-link>
        </div>
      </div>

      <empty-state v-else-if="order.status === 'open'" icon="fa-handshake"
        title="No matches yet"
        subtitle="Your order is open and visible to other members. You can also browse open orders to propose a match yourself."
        action-label="Browse open orders" action-to="/browse" />
    </div>
  </div>
  <app-footer />
</div>`},pv={name:"Matches",data(){return{matches:[],meta:null,loading:!0,tab:"active"}},computed:{tabs(){return[{key:"active",label:"Active"},{key:"completed",label:"Completed"},{key:"cancelled",label:"Cancelled"}]}},async mounted(){await this.load()},watch:{tab(){this.load()}},methods:{async load(e=1){var t;this.loading=!0;try{const s={page:e};this.tab==="active"?s.exclude_status="completed,cancelled,refunded":s.status=this.tab;const{data:r}=await this.$http.get("/matches",{params:s});this.matches=r.data,this.meta=(t=r.meta)==null?void 0:t.pagination}catch{}this.loading=!1},statusColor(e){return["completed"].includes(e)?"text-green-600":["cancelled","refunded"].includes(e)?"text-red-500":["disputed"].includes(e)?"text-orange-500":"text-blue-600"},stepLabel(e){return{proposed:"Waiting for response",negotiating:"Negotiating rate",rate_agreed:"Choose delivery method",delivery_method_selecting:"Agree on delivery",awaiting_deposit:"Waiting for AUD deposit",deposit_uploaded:"Deposit proof submitted",deposit_verified:"Deposit confirmed",awaiting_delivery:"Cash being delivered",delivery_uploaded:"Delivery proof submitted",awaiting_confirmation:"Waiting for confirmation",confirmed:"Confirmed — releasing funds",completing:"Completing",completed:"Completed",cancelled:"Cancelled",disputed:"Under dispute",refunded:"Refunded"}[e]||e}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Matches</h1>

    <!-- Tabs -->
    <div class="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-6">
      <button v-for="t in tabs" :key="t.key" @click="tab = t.key"
        :class="['flex-1 py-2 rounded-xl text-sm font-medium transition',
          tab === t.key ? 'bg-green-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800']">
        {{ t.label }}
      </button>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="matches.length" class="space-y-3">
      <router-link v-for="match in matches" :key="match.ulid" :to="'/matches/' + match.ulid"
        class="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <!-- Status + delivery badge -->
            <div class="flex flex-wrap gap-2 mb-2">
              <status-badge :status="match.status" />
              <span v-if="match.delivery_method && match.delivery_method !== 'pending'"
                :class="['text-xs font-medium px-2 py-0.5 rounded-full',
                  match.delivery_method === 'secure' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700']">
                <i :class="['fas mr-0.5 text-xs',
                  match.delivery_method === 'secure' ? 'fa-shield-alt' : 'fa-exclamation-triangle']"></i>
                {{ match.delivery_method === 'secure' ? 'Secure' : 'Risk' }}
              </span>
              <!-- Unread badge -->
              <span v-if="match.unread_messages > 0"
                class="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
                {{ match.unread_messages }} new message{{ match.unread_messages > 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Amount -->
            <p v-if="match.agreed_aud" class="text-xl font-bold text-gray-900">
              {{ $fmt.aud(match.agreed_aud) }}
              <span class="text-sm text-gray-400 font-normal ml-1">{{ $fmt.usd(match.agreed_usd) }}</span>
            </p>
            <p v-else-if="match.proposed_aud" class="text-base font-semibold text-gray-600">
              Proposed: {{ $fmt.aud(match.proposed_aud) }}
            </p>

            <!-- Step label -->
            <p :class="['text-xs font-medium mt-1', statusColor(match.status)]">
              <i class="fas fa-circle text-xs mr-1"></i>{{ stepLabel(match.status) }}
            </p>

            <!-- Location + date -->
            <p class="text-xs text-gray-400 mt-1.5">
              <span v-if="match.location">
                <i class="fas fa-map-marker-alt mr-1 text-green-600"></i>{{ match.location.name }} &middot;
              </span>
              {{ $fmt.datetime(match.updated_at) }}
            </p>
          </div>

          <div class="flex-shrink-0 text-right">
            <span class="text-xs text-green-700 font-medium">View &rarr;</span>
          </div>
        </div>
      </router-link>

      <pagination-links :meta="meta" @page="load($event)" />
    </div>

    <empty-state v-else icon="fa-handshake"
      :title="tab === 'active' ? 'No active matches' : 'No ' + tab + ' matches'"
      :subtitle="tab === 'active' ? 'Browse open orders to propose your first match.' : 'Nothing here yet.'"
      action-label="Browse Orders" action-to="/browse" />
  </div>
  <app-footer />
</div>`},fv={name:"MatchDetail",data(){return{match:null,negotiations:null,loading:!0,actionLoading:!1,error:null,negotiateAction:"",counterAud:"",counterUsd:"",counterMsg:"",deliveryMethod:"",riskPayoutMethod:"platform_then_bank",depositFile:null,depositorRef:"",idPhoto:null,idType:"national_id",handoverPhoto:null,combinedPhoto:null,verificationNote:"",useOption:"two",ratingScore:0,ratingComment:"",ratingSubmitted:!1,myReview:null,editingReview:!1}},computed:{myId(){var e;return(e=this.$auth.user)==null?void 0:e.id},myRole(){var e;return(e=this.match)==null?void 0:e.my_role},isSender(){return this.myRole==="sender"},chatClosed(){var e;return["completed","cancelled","refunded"].includes((e=this.match)==null?void 0:e.status)},canUploadDeposit(){var e;return["awaiting_deposit","awaiting_risk_deposit"].includes((e=this.match)==null?void 0:e.status)&&this.isSender},canUploadDelivery(){var e;return["awaiting_delivery","awaiting_risk_delivery"].includes((e=this.match)==null?void 0:e.status)&&!this.isSender},canConfirmDelivery(){var e;return["awaiting_confirmation","awaiting_risk_confirmation"].includes((e=this.match)==null?void 0:e.status)&&this.isSender},canSelectDeliveryMethod(){var e;return((e=this.match)==null?void 0:e.status)==="rate_agreed"},canConfirmDeliveryMethod(){var e,t;return((e=this.match)==null?void 0:e.status)==="delivery_method_selecting"&&((t=this.match)==null?void 0:t.delivery_method_proposed_by)!==this.myId},canRate(){var e;return((e=this.match)==null?void 0:e.status)==="completed"},showNegotiation(){var e;return["proposed","negotiating"].includes((e=this.match)==null?void 0:e.status)},negotiationHint(){return"The AUD and USD amounts are negotiated between you and your partner. The rate shown is a guide — agree on a rate that works for both of you."},isMyTurn(){var e;return(e=this.match)==null?void 0:e.is_my_turn_to_negotiate},deliveryInstruction(){if(!this.match)return"";const e=this.match.status,t=this.match.agreed_usd;return e==="awaiting_delivery"?"AUD is secured in escrow. Please deliver USD $"+t+" cash to the recipient and upload verification photos.":e==="awaiting_risk_delivery"?"Risk Delivery: Please deliver USD $"+t+" cash first. The sender will deposit AUD after you confirm delivery.":["awaiting_confirmation","awaiting_risk_confirmation"].includes(e)?"Cash has been delivered. Please confirm the recipient received the money.":""},depositBankRef(){var e;return((e=this.match)==null?void 0:e.deposit_reference)||""},agreedUsdLabel(){return this.match?"USD $"+this.match.agreed_usd:""},handoverHint(){return this.match?"Photo of USD $"+this.match.agreed_usd+" with handwritten amount on paper":"Photo showing cash amount"},combinedHint(){return this.match?"One photo showing: recipient holding their ID next to the cash with USD $"+this.match.agreed_usd+" written on paper.":"Combined verification photo"},recipientName(){var e,t;return((t=(e=this.match)==null?void 0:e.send_order)==null?void 0:t.zim_recipient_name)||"the recipient"}},async mounted(){await this.load()},methods:{async load(){var e;this.loading=!0;try{const{data:t}=await this.$http.get("/matches/"+this.$route.params.ulid);if(this.match=t.data,this.showNegotiation&&await this.loadNegotiations(),((e=this.match)==null?void 0:e.status)==="completed")try{const s=await this.$http.get("/matches/"+this.$route.params.ulid+"/my-review");this.myReview=s.data.data,this.myReview&&(this.ratingScore=this.myReview.score,this.ratingComment=this.myReview.review_text||"")}catch{}}catch{this.$router.push("/matches")}this.loading=!1},async loadNegotiations(){try{const{data:e}=await this.$http.get("/matches/"+this.$route.params.ulid+"/negotiations");this.negotiations=e.data}catch{}},async accept(){var e,t;this.actionLoading=!0;try{await this.$http.post("/matches/"+this.match.ulid+"/negotiate",{action:"accept"}),this.$toast.success("Rate agreed! Now choose your delivery method."),await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed")}this.actionLoading=!1},async counter(){var e,t;if(!(!this.counterAud||!this.counterUsd)){this.actionLoading=!0;try{await this.$http.post("/matches/"+this.match.ulid+"/negotiate",{action:"counter",proposed_aud:parseFloat(this.counterAud),proposed_usd:parseFloat(this.counterUsd),message:this.counterMsg}),this.$toast.success("Counter-offer sent."),this.negotiateAction="",this.counterAud="",this.counterUsd="",this.counterMsg="",await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed")}this.actionLoading=!1}},async cancelMatch(){var e,t;if(confirm("Cancel this match? Your order will return to open.")){this.actionLoading=!0;try{await this.$http.put("/matches/"+this.match.ulid+"/cancel"),this.$toast.success("Match cancelled."),this.$router.push("/matches")}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed")}this.actionLoading=!1}},async proposeDeliveryMethod(){var e,t;this.actionLoading=!0;try{const s={method:this.deliveryMethod};this.deliveryMethod==="risk"&&(s.risk_payout_method=this.riskPayoutMethod),await this.$http.post("/matches/"+this.match.ulid+"/delivery-method",s),this.$toast.success("Delivery method proposed."),await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed")}this.actionLoading=!1},async confirmDeliveryMethod(e){var t,s;this.actionLoading=!0;try{await this.$http.post("/matches/"+this.match.ulid+"/delivery-method/confirm",{confirmed:e}),this.$toast.success(e?"Delivery method confirmed.":"Match cancelled."),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed")}this.actionLoading=!1},async uploadDeposit(){var t,s;if(!this.depositFile||!this.depositorRef)return;this.actionLoading=!0;const e=new FormData;e.append("proof_file",this.depositFile),e.append("depositor_reference",this.depositorRef);try{await this.$http.post("/matches/"+this.match.ulid+"/deposit/upload",e,{headers:{"Content-Type":"multipart/form-data"}}),this.$toast.success("Deposit proof uploaded. Admin will verify shortly."),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed")}this.actionLoading=!1},async uploadDelivery(){var t,s;this.actionLoading=!0;const e=new FormData;if(this.useOption==="combined"){if(!this.combinedPhoto){this.$toast.error("Please upload a combined photo."),this.actionLoading=!1;return}e.append("combined_verification_photo",this.combinedPhoto)}else{if(!this.idPhoto||!this.handoverPhoto){this.$toast.error("Please upload both photos."),this.actionLoading=!1;return}e.append("recipient_id_photo",this.idPhoto),e.append("recipient_id_type",this.idType),e.append("handover_amount_photo",this.handoverPhoto)}this.verificationNote&&e.append("verification_note",this.verificationNote);try{await this.$http.post("/matches/"+this.match.ulid+"/delivery/upload",e,{headers:{"Content-Type":"multipart/form-data"}}),this.$toast.success("Delivery proof uploaded."),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed")}this.actionLoading=!1},async confirmDelivery(){var e,t;if(confirm("Confirm the cash was received in Zimbabwe?")){this.actionLoading=!0;try{await this.$http.post("/matches/"+this.match.ulid+"/delivery/confirm"),this.$toast.success("Receipt confirmed!"),await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed")}this.actionLoading=!1}},async submitRating(){var e,t;if(this.ratingScore){this.actionLoading=!0;try{const{data:s}=await this.$http.post("/matches/"+this.match.ulid+"/rate",{score:this.ratingScore,review_text:this.ratingComment});this.myReview=s.data,this.$toast.success(this.myReview?"Review updated!":"Review submitted!"),this.editingReview=!1,await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed")}this.actionLoading=!1}},async deleteReview(){var e,t;if(confirm("Delete your review?")){this.actionLoading=!0;try{await this.$http.delete("/matches/"+this.match.ulid+"/my-review"),this.myReview=null,this.ratingScore=0,this.ratingComment="",this.$toast.success("Review deleted.")}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed")}this.actionLoading=!1}},async raiseDispute(){var t,s;const e=prompt("Please describe the issue (minimum 20 characters):");if(!(!e||e.length<20)){this.actionLoading=!0;try{await this.$http.post("/matches/"+this.match.ulid+"/dispute",{reason:e}),this.$toast.success("Dispute raised."),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed")}this.actionLoading=!1}},formatNegDate(e){return e?new Date(e).toLocaleString():""}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/matches" class="text-gray-400 hover:text-gray-600">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h1 class="text-xl font-bold text-gray-900">Match Detail</h1>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="match" class="grid md:grid-cols-3 gap-6">

      <!-- Left: Timeline + Summary -->
      <div class="md:col-span-1 space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <status-badge :status="match.status" />
          <div v-if="match.agreed_aud" class="mt-3">
            <p class="text-2xl font-bold text-gray-900">{{ $fmt.aud(match.agreed_aud) }}</p>
            <p class="text-sm text-gray-500">{{ $fmt.usd(match.agreed_usd) }}</p>
          </div>
          <div class="mt-3 text-sm space-y-1.5">
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">My role</span>
              <span class="font-medium capitalize text-gray-900">{{ myRole }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-gray-50">
              <span class="text-gray-500">Delivery</span>
              <span :class="['font-medium capitalize',
                match.delivery_method === 'secure' ? 'text-green-700' :
                match.delivery_method === 'risk' ? 'text-orange-600' : 'text-gray-500']">
                {{ match.delivery_method === 'pending' ? 'Not set' : match.delivery_method }}
              </span>
            </div>
            <div class="flex justify-between py-1.5">
              <span class="text-gray-500">Ref</span>
              <span class="font-mono text-xs text-gray-700">{{ match.deposit_reference }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-800 mb-4">Progress</h3>
          <status-timeline :match="match" />
        </div>

        <div v-if="['proposed','negotiating','rate_agreed','delivery_method_selecting'].includes(match.status)">
          <button @click="cancelMatch" :disabled="actionLoading"
            class="w-full py-2.5 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition">
            Cancel Match
          </button>
        </div>

        <div v-if="['awaiting_delivery','awaiting_risk_delivery','delivery_uploaded','risk_delivery_uploaded','awaiting_confirmation','awaiting_risk_confirmation'].includes(match.status)">
          <button @click="raiseDispute"
            class="w-full py-2.5 text-sm text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50">
            <i class="fas fa-flag mr-1"></i> Raise Dispute
          </button>
        </div>
      </div>

      <!-- Right: Main content -->
      <div class="md:col-span-2 space-y-5">

        <!-- Negotiation thread -->
        <div v-if="showNegotiation" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-comments text-green-600"></i> Negotiation
            <span v-if="negotiations" class="text-xs text-gray-400 font-normal ml-1">
              Round {{ negotiations.negotiation_rounds || 1 }} of {{ negotiations.max_rounds || 5 }}
            </span>
          </h3>

          <div v-if="negotiations" class="space-y-3 mb-5 max-h-64 overflow-y-auto">
            <div v-for="n in negotiations.negotiations" :key="n.id"
              :class="['p-3 rounded-xl text-sm', n.proposed_by.is_me ? 'bg-green-50 ml-8' : 'bg-gray-50 mr-8']">
              <div class="flex justify-between items-start mb-1">
                <span class="font-medium text-gray-800">
                  {{ n.proposed_by.is_me ? 'You' : n.proposed_by.display_name }}
                </span>
                <span class="text-xs text-gray-400">{{ formatNegDate(n.created_at) }}</span>
              </div>
              <p class="font-bold text-gray-900">
                {{ $fmt.aud(n.proposed_aud) }} &harr; {{ $fmt.usd(n.proposed_usd) }}
              </p>
              <p v-if="n.message" class="text-gray-600 mt-1 text-xs">{{ n.message }}</p>
            </div>
          </div>

          <div v-if="isMyTurn">
            <div v-if="!negotiateAction" class="flex gap-3">
              <button @click="accept" :disabled="actionLoading"
                class="flex-1 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
                <i class="fas fa-check mr-1"></i> Accept
              </button>
              <button @click="negotiateAction = 'counter'"
                class="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50">
                <i class="fas fa-exchange-alt mr-1"></i> Counter-offer
              </button>
            </div>

            <div v-if="negotiateAction === 'counter'" class="space-y-3 mt-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-gray-600 mb-1 block">AUD amount</label>
                  <input v-model="counterAud" type="number"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                    placeholder="500.00">
                </div>
                <div>
                  <label class="text-xs text-gray-600 mb-1 block">USD amount</label>
                  <input v-model="counterUsd" type="number"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                    placeholder="313.00">
                </div>
              </div>
              <input v-model="counterMsg" type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                placeholder="Optional message...">
              <div class="flex gap-2">
                <button @click="counter" :disabled="actionLoading || !counterAud || !counterUsd"
                  class="flex-1 py-2 text-sm font-medium bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50">
                  Send Counter-offer
                </button>
                <button @click="negotiateAction = ''"
                  class="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-sm text-center text-gray-500 py-2 bg-gray-50 rounded-lg">
            <i class="fas fa-clock mr-1"></i> Waiting for the other party to respond...
          </div>
        </div>

        <!-- Delivery method selection -->
        <div v-if="canSelectDeliveryMethod || canConfirmDeliveryMethod"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-route text-green-600"></i> Choose Delivery Method
          </h3>

          <div v-if="canSelectDeliveryMethod" class="space-y-3">
            <button v-for="opt in [
              {value:'secure', icon:'fa-shield-alt', label:'Secure Delivery (Recommended)',
               desc:'Sender deposits AUD first. Cash is delivered after funds are in escrow.',
               color:'green'},
              {value:'risk', icon:'fa-exclamation-triangle', label:'Risk Delivery',
               desc:'Deliverer goes first. Only choose if you trust the other party.',
               color:'orange'}
            ]" :key="opt.value" @click="deliveryMethod = opt.value"
              :class="['w-full p-4 rounded-xl border-2 text-left transition',
                deliveryMethod === opt.value
                  ? 'border-' + opt.color + '-500 bg-' + opt.color + '-50'
                  : 'border-gray-200 hover:border-gray-300']">
              <div class="flex items-start gap-3">
                <i :class="'fas mt-0.5 text-' + opt.color + '-600 ' + opt.icon"></i>
                <div>
                  <p class="font-semibold text-sm text-gray-900">{{ opt.label }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ opt.desc }}</p>
                </div>
                <i v-if="deliveryMethod === opt.value"
                  class="fas fa-check-circle text-green-600 ml-auto"></i>
              </div>
            </button>

            <div v-if="deliveryMethod === 'risk'" class="mt-2">
              <label class="text-xs text-gray-600 mb-1.5 block font-medium">Payout preference</label>
              <select v-model="riskPayoutMethod"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-green-500">
                <option value="platform_then_bank">Via eZimConnect escrow then to my bank</option>
                <option value="direct_bank">Direct to my Australian bank account</option>
              </select>
            </div>

            <button @click="proposeDeliveryMethod" :disabled="!deliveryMethod || actionLoading"
              class="w-full py-3 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition mt-2">
              <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>
              Propose This Method
            </button>
          </div>

          <div v-if="canConfirmDeliveryMethod" class="space-y-3">
            <div class="p-4 bg-gray-50 rounded-xl text-sm">
              <p class="font-medium text-gray-800">
                The other party proposed:
                <span :class="['font-bold',
                  match.delivery_method === 'secure' ? 'text-green-700' : 'text-orange-600']">
                  {{ match.delivery_method === 'secure' ? 'Secure Delivery' : 'Risk Delivery' }}
                </span>
              </p>
            </div>
            <div class="flex gap-3">
              <button @click="confirmDeliveryMethod(true)" :disabled="actionLoading"
                class="flex-1 py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50">
                Accept
              </button>
              <button @click="confirmDeliveryMethod(false)" :disabled="actionLoading"
                class="flex-1 py-2.5 text-sm font-medium border border-red-200 text-red-600 rounded-xl hover:bg-red-50">
                Reject &amp; Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Deposit section -->
        <div v-if="match.deposit" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-university text-green-600"></i> AUD Deposit
          </h3>

          <div v-if="canUploadDeposit">
            <div class="bg-blue-50 rounded-xl p-4 mb-4 text-sm space-y-1.5">
              <p class="font-semibold text-blue-800 mb-2">Transfer details:</p>
              <p><span class="text-blue-600">Bank:</span> <strong>National Australia Bank</strong></p>
              <p><span class="text-blue-600">Account:</span> <strong>eZimConnect Pty Ltd Trust Account</strong></p>
              <p>
                <span class="text-blue-600">Amount:</span>
                <strong>{{ $fmt.aud(match.agreed_aud) }}</strong>
              </p>
              <p>
                <span class="text-blue-600">Reference:</span>
                <strong class="font-mono text-blue-900">{{ depositBankRef }}</strong>
                <span class="text-xs text-red-600 ml-1">Use exact reference</span>
              </p>
            </div>

            <div class="space-y-3">
              <div>
                <label class="text-xs font-medium text-gray-700 mb-1 block">
                  Your bank transfer reference
                </label>
                <input v-model="depositorRef" type="text"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                  :placeholder="depositBankRef">
              </div>
              <file-upload label="Payment screenshot" accept="image/*,.pdf"
                hint="JPG, PNG or PDF, max 5MB" :required="true"
                @change="depositFile = $event" />
              <button @click="uploadDeposit"
                :disabled="!depositFile || !depositorRef || actionLoading"
                class="w-full py-3 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
                <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>
                Upload Proof
              </button>
            </div>
          </div>

          <div v-else class="flex items-center gap-2 text-sm">
            <span :class="['w-2 h-2 rounded-full',
              ['verified','released'].includes(match.deposit.status)
                ? 'bg-green-500' : 'bg-yellow-500']"></span>
            <span class="capitalize">Deposit {{ match.deposit.status }}</span>
          </div>
        </div>

        <!-- Delivery upload -->
        <div v-if="canUploadDelivery" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <i class="fas fa-money-bill-wave text-green-600"></i> Upload Delivery Proof
          </h3>
          <p class="text-xs text-gray-500 mb-4">{{ deliveryInstruction }}</p>

          <div class="flex gap-3 mb-4">
            <button v-for="opt in [{v:'two', l:'Two photos'}, {v:'combined', l:'One combined photo'}]"
              :key="opt.v" @click="useOption = opt.v"
              :class="['flex-1 py-2 text-xs font-medium rounded-lg border transition',
                useOption === opt.v
                  ? 'bg-green-700 text-white border-green-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50']">
              {{ opt.l }}
            </button>
          </div>

          <div v-if="useOption === 'two'" class="space-y-4">
            <file-upload label="Recipient's ID photo" accept="image/*,.pdf"
              hint="Passport, national ID, or driver's licence" :required="true"
              @change="idPhoto = $event" />
            <div>
              <label class="text-xs font-medium text-gray-700 mb-1 block">ID type</label>
              <select v-model="idType"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none">
                <option value="national_id">National ID</option>
                <option value="passport">Passport</option>
                <option value="drivers_licence">Driver's Licence</option>
              </select>
            </div>
            <file-upload label="Cash handover photo" accept="image/*,.pdf"
              :hint="handoverHint" :required="true"
              @change="handoverPhoto = $event" />
          </div>

          <div v-else>
            <file-upload label="Combined verification photo" accept="image/*,.pdf"
              :hint="combinedHint" :required="true"
              @change="combinedPhoto = $event" />
          </div>

          <input v-model="verificationNote" type="text"
            class="mt-3 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
            placeholder="Optional delivery note">

          <button @click="uploadDelivery" :disabled="actionLoading"
            class="w-full mt-4 py-3 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
            <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>
            Submit Delivery Proof
          </button>
        </div>

        <!-- Confirm delivery -->
        <div v-if="canConfirmDelivery"
          class="bg-white rounded-2xl border border-green-200 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-2">Confirm Cash Received</h3>
          <p class="text-sm text-gray-600 mb-4">
            Confirm that the recipient received the USD cash in Zimbabwe.
          </p>
          <button @click="confirmDelivery" :disabled="actionLoading"
            class="w-full py-3 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
            <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>
            <i v-else class="fas fa-thumbs-up mr-1"></i>
            Yes, Cash Was Received
          </button>
        </div>

        <!-- Partner info + rating (shown when completed) -->
        <div v-if="match.status === 'completed'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-user-friends text-green-600"></i>
            Transaction Partner
          </h3>
          <!-- Partner card -->
          <div class="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
            <div v-if="isSender">
              <img v-if="match.receive_order && match.receive_order.owner && match.receive_order.owner.avatar_url"
                :src="match.receive_order.owner.avatar_url"
                class="w-12 h-12 rounded-xl object-cover">
              <div v-else class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-black text-lg">
                {{ match.receive_order && match.receive_order.owner && match.receive_order.owner.display_name ? match.receive_order.owner.display_name[0] : '?' }}
              </div>
            </div>
            <div v-else>
              <img v-if="match.send_order && match.send_order.owner && match.send_order.owner.avatar_url"
                :src="match.send_order.owner.avatar_url"
                class="w-12 h-12 rounded-xl object-cover">
              <div v-else class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-black text-lg">
                {{ match.send_order && match.send_order.owner && match.send_order.owner.display_name ? match.send_order.owner.display_name[0] : '?' }}
              </div>
            </div>
            <div class="flex-1">
              <p class="font-bold text-gray-900">
                {{ isSender ? (match.receive_order && match.receive_order.owner ? match.receive_order.owner.display_name : '—') : (match.send_order && match.send_order.owner ? match.send_order.owner.display_name : '—') }}
              </p>
              <p class="text-xs text-gray-500">
                Rating: {{ isSender ? (match.receive_order && match.receive_order.owner && match.receive_order.owner.rating ? match.receive_order.owner.rating : '—') : (match.send_order && match.send_order.owner && match.send_order.owner.rating ? match.send_order.owner.rating : '—') }}
                · Trust: {{ isSender ? (match.receive_order && match.receive_order.owner ? match.receive_order.owner.trust_score : '—') : (match.send_order && match.send_order.owner ? match.send_order.owner.trust_score : '—') }}
              </p>
            </div>
            <button @click="$router.push('/profile/' + (isSender ? (match.receive_order && match.receive_order.owner ? match.receive_order.owner.ulid : '') : (match.send_order && match.send_order.owner ? match.send_order.owner.ulid : '')))"
              class="text-xs text-green-700 font-semibold border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50">
              View profile
            </button>
          </div>

          <!-- Existing review display -->
          <div v-if="myReview && !editingReview" class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-bold text-gray-900">Your Review</p>
              <div class="flex gap-2">
                <button @click="editingReview = true"
                  class="text-xs text-blue-600 font-semibold hover:underline">Edit</button>
                <button @click="deleteReview"
                  class="text-xs text-red-500 font-semibold hover:underline">Delete</button>
              </div>
            </div>
            <div class="flex items-center gap-1 mb-1">
              <i v-for="s in 5" :key="s"
                :class="['fas fa-star text-sm', s <= myReview.score ? 'text-yellow-400' : 'text-gray-200']"></i>
              <span class="text-sm font-semibold text-gray-700 ml-1">{{ myReview.score }}.0</span>
            </div>
            <p class="text-sm text-gray-600 italic">{{ myReview.review_text || 'No comment.' }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ $fmt.date(myReview.created_at) }}</p>
          </div>

          <!-- Review form (new or editing) -->
          <div v-if="!myReview || editingReview">
            <p class="text-sm font-bold text-gray-900 mb-3">
              {{ myReview ? 'Edit your review' : 'Rate your partner' }}
            </p>
            <div class="flex items-center gap-2 mb-3">
              <button v-for="s in 5" :key="s" @click="ratingScore = s"
                :class="['text-2xl transition-transform hover:scale-110', s <= ratingScore ? 'text-yellow-400' : 'text-gray-200']">
                ★
              </button>
              <span v-if="ratingScore" class="text-sm text-gray-600 ml-1">{{ ratingScore }}/5</span>
            </div>
            <textarea v-model="ratingComment" rows="3"
              class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 resize-none mb-3"
              placeholder="Share your experience with this partner..."></textarea>
            <div class="flex gap-2">
              <button @click="submitRating" :disabled="!ratingScore || actionLoading"
                class="flex-1 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
                style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
                <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>
                {{ myReview ? 'Update review' : 'Submit review' }}
              </button>
              <button v-if="editingReview" @click="editingReview = false"
                class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Chat -->
        <chat-panel :match-ulid="match.ulid" :is-closed="chatClosed" />
      </div>
    </div>
  </div>
  <app-footer />
</div>`},mv={name:"Profile",data(){return{user:null,form:{},loading:!0,saving:!1,photoFile:null,photoUploading:!1,error:null,success:!1,reviews:[],reviewsLoading:!1}},async mounted(){await this.load(),await this.loadReviews()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/user");this.user=e.data,this.form={first_name:this.user.first_name,last_name:this.user.last_name,bio:this.user.bio||"",gender:this.user.gender||"",account_type:this.user.account_type,business_name:this.user.business_name||"",business_description:this.user.business_description||"",profile_visibility:this.user.profile_visibility,always_available:this.user.always_available,min_amount_aud:this.user.min_amount_aud,max_amount_aud:this.user.max_amount_aud}}catch{}this.loading=!1},async loadReviews(){this.reviewsLoading=!0;try{const{data:e}=await this.$http.get("/user/reviews");this.reviews=e.data||[]}catch{}this.reviewsLoading=!1},async save(){var e,t;this.saving=!0,this.error=null,this.success=!1;try{await this.$http.put("/user/profile",this.form),this.success=!0,this.$toast.success("Profile saved."),await this.load()}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed to save."}this.saving=!1},async uploadPhoto(){var t,s;if(!this.photoFile)return;this.photoUploading=!0;const e=new FormData;e.append("photo",this.photoFile);try{const{data:r}=await this.$http.post("/user/profile/photo",e,{headers:{"Content-Type":"multipart/form-data"}});this.user.profile_photo=r.data.profile_photo,this.$toast.success("Profile photo updated.")}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Upload failed.")}this.photoUploading=!1},onPhotoChange(e){this.photoFile=e.target.files[0],this.photoFile&&this.uploadPhoto()}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

    <loading-spinner v-if="loading" />
    <div v-else class="space-y-6">

      <!-- Photo + name card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center gap-5">
          <div class="relative">
            <div class="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100">
              <img v-if="user.profile_photo" :src="user.profile_photo"
                class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <i class="fas fa-user text-3xl"></i>
              </div>
            </div>
            <label class="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition">
              <i class="fas fa-camera text-white text-xs"></i>
              <input type="file" accept="image/*" class="hidden" @change="onPhotoChange">
            </label>
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-900">{{ user.first_name }} {{ user.last_name }}</p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span v-if="user.total_trades" class="text-xs text-gray-500">
                <i class="fas fa-star text-yellow-400"></i>
                {{ user.rating ? parseFloat(user.rating).toFixed(1) : 'No ratings' }}
                &middot; {{ user.total_trades }} trades
              </span>
              <span v-if="user.is_verified_business" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                <i class="fas fa-check-circle mr-0.5"></i> Verified Business
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit form -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-4">Personal Details</h2>
        <alert-banner v-if="error" type="error" :message="error" />

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">First name</label>
            <input v-model="form.first_name" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Last name</label>
            <input v-model="form.last_name" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500">
          </div>
          <div class="sm:col-span-2">
            <label class="text-sm font-medium text-gray-700 block mb-1">Bio <span class="text-gray-400 font-normal">(optional)</span></label>
            <textarea v-model="form.bio" rows="3"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none"
              placeholder="Tell other traders a bit about yourself..."></textarea>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Gender</label>
            <select v-model="form.gender"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white">
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Account type</label>
            <select v-model="form.account_type"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 bg-white">
              <option value="personal">Personal</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div v-if="form.account_type === 'business'" class="sm:col-span-2">
            <label class="text-sm font-medium text-gray-700 block mb-1">Business name</label>
            <input v-model="form.business_name" type="text"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              placeholder="Your business name">
          </div>
        </div>
      </div>

      <!-- Directory settings -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-1">Directory Listing</h2>
        <p class="text-sm text-gray-500 mb-4">Appear in the public directory so other users can find and contact you directly.</p>

        <div class="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p class="text-sm font-medium text-gray-800">Show in directory</p>
            <p class="text-xs text-gray-500">Other users can see your profile and contact you</p>
          </div>
          <button @click="form.always_available = !form.always_available"
            :class="['relative inline-flex w-11 h-6 rounded-full transition-colors',
              form.always_available ? 'bg-green-600' : 'bg-gray-200']">
            <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
              form.always_available ? 'translate-x-5' : 'translate-x-0']"></span>
          </button>
        </div>

        <div class="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p class="text-sm font-medium text-gray-800">Profile visibility</p>
            <p class="text-xs text-gray-500">Anonymous hides your real name</p>
          </div>
          <select v-model="form.profile_visibility"
            class="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-green-500">
            <option value="public">Public</option>
            <option value="anonymous">Anonymous</option>
          </select>
        </div>

        <div v-if="form.always_available" class="grid sm:grid-cols-2 gap-3 mt-3">
          <div>
            <label class="text-xs font-medium text-gray-700 block mb-1">Min order (AUD)</label>
            <input v-model="form.min_amount_aud" type="number" min="50"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500">
          </div>
          <div>
            <label class="text-xs font-medium text-gray-700 block mb-1">Max order (AUD)</label>
            <input v-model="form.max_amount_aud" type="number" min="50"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500">
          </div>
        </div>
      </div>

      <button @click="save" :disabled="saving"
        class="w-full py-3.5 bg-green-700 text-white rounded-2xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition shadow-sm">
        <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i> Save Profile
      </button>

      <!-- Reviews -->
      <div v-if="reviews.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-900">
            Reviews
            <span class="text-sm text-gray-400 font-normal ml-2">
              <i class="fas fa-star text-yellow-400"></i>
              {{ user.rating ? parseFloat(user.rating).toFixed(1) : '—' }}
            </span>
          </h2>
        </div>
        <div class="divide-y divide-gray-50 max-h-80 overflow-y-auto">
          <div v-for="r in reviews" :key="r.id" class="px-5 py-4">
            <div class="flex items-center justify-between mb-1">
              <rating-stars :value="r.score" />
              <span class="text-xs text-gray-400">{{ $fmt.date(r.created_at) }}</span>
            </div>
            <p v-if="r.review_text" class="text-sm text-gray-600">{{ r.review_text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`},gv={name:"PublicProfile",data(){return{profile:null,loading:!0,error:null}},computed:{ulid(){return this.$route.params.ulid},isMe(){try{return JSON.parse(localStorage.getItem("tuma_user")||"{}").ulid===this.ulid}catch{return!1}},avatarLetter(){var e,t,s;return((s=(t=(e=this.profile)==null?void 0:e.display_name)==null?void 0:t[0])==null?void 0:s.toUpperCase())||"?"},trustColor(){var t;const e=((t=this.profile)==null?void 0:t.trust_score)||0;return e>=70?"text-green-600":e>=40?"text-yellow-600":"text-gray-400"}},async mounted(){await this.load()},methods:{async load(){var e;this.loading=!0;try{const{data:t}=await this.$http.get("/users/"+this.ulid);this.profile=t.data}catch(t){this.error=((e=t.response)==null?void 0:e.status)===404?"This profile is not available.":"Failed to load profile."}this.loading=!1},sendMoneyVia(){this.$router.push("/browse?user="+this.ulid)},fixUrl(e){if(!e)return null;try{const t=new URL(e);return window.location.origin+t.pathname}catch{return e}},stars(e){return Array.from({length:5},(t,s)=>s<Math.round(e))}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />

  <div class="max-w-3xl mx-auto px-4 py-8">

    <loading-spinner v-if="loading" />

    <div v-else-if="error" class="text-center py-16">
      <i class="fas fa-user-slash text-4xl text-gray-300 mb-3 block"></i>
      <p class="text-gray-500">{{ error }}</p>
      <button @click="$router.back()" class="mt-4 text-sm text-green-700 font-semibold">← Go back</button>
    </div>

    <div v-else-if="profile" class="space-y-4">

      <!-- Header card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Green banner -->
        <div class="h-20 w-full" style="background:linear-gradient(135deg,#0d4a28,#1a6b3c,#2d9460)"></div>

        <div class="px-6 pb-6">
          <!-- Avatar overlapping banner -->
          <div class="flex items-end justify-between -mt-10 mb-4">
            <div class="relative">
              <img v-if="fixUrl(profile.profile_photo)"
                :src="fixUrl(profile.profile_photo)"
                class="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-md"
                @error="$event.target.style.display='none'">
              <div v-else
                class="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-3xl font-black text-white"
                style="background:linear-gradient(135deg,#1a6b3c,#2d9460)">
                {{ avatarLetter }}
              </div>
              <span v-if="profile.always_available"
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                title="Available now"></span>
            </div>

            <button v-if="!isMe" @click="sendMoneyVia"
              class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all"
              style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
              <i class="fas fa-paper-plane text-xs"></i>
              Send money via {{ profile.display_name.split(' ')[0] }}
            </button>
          </div>

          <!-- Name + badges -->
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <h1 class="text-xl font-black text-gray-900" style="font-family:Georgia,serif;">
              {{ profile.display_name }}
            </h1>
            <span v-if="profile.is_verified_business"
              class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
              <i class="fas fa-check-circle mr-0.5"></i>Verified Business
            </span>
          </div>

          <p v-if="profile.business_name" class="text-sm text-gray-500 mb-1">{{ profile.business_name }}</p>

          <div class="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
            <span v-if="profile.country">
              <i class="fas fa-map-marker-alt text-green-600 mr-1"></i>{{ profile.country }}
            </span>
            <span>
              <i class="fas fa-calendar text-gray-400 mr-1"></i>Member since {{ $fmt.date(profile.member_since) }}
            </span>
          </div>

          <p v-if="profile.bio" class="text-sm text-gray-600 leading-relaxed mb-3">{{ profile.bio }}</p>

          <!-- Earned badges -->
          <div v-if="profile.badges && profile.badges.length" class="flex flex-wrap gap-2 mb-3">
            <span v-for="b in profile.badges" :key="b.badge_key"
              class="flex items-center gap-1.5 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 px-2.5 py-1 rounded-full font-medium"
              :title="b.badge_name">
              <span>{{ b.badge_icon }}</span>
              {{ b.badge_name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-3 gap-3">
        <div v-for="stat in [
          { label: 'Total Trades',  value: profile.total_trades },
          { label: 'Rating',        value: profile.rating ? parseFloat(profile.rating).toFixed(1) + ' ★' : '—' },
          { label: 'Trust Score',   value: profile.trust_score, color: trustColor },
        ]" :key="stat.label"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-black mb-0.5" :class="stat.color || 'text-gray-900'">{{ stat.value }}</p>
          <p class="text-xs text-gray-500">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Trading preferences -->
      <div v-if="profile.min_amount_aud || profile.max_amount_aud"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="text-sm font-bold text-gray-900 mb-3">
          <i class="fas fa-sliders-h text-green-600 mr-2"></i>Trading Preferences
        </h3>
        <div class="flex flex-wrap gap-4 text-sm">
          <div v-if="profile.min_amount_aud">
            <p class="text-xs text-gray-500 mb-0.5">Minimum</p>
            <p class="font-bold text-gray-900">{{ $fmt.aud(profile.min_amount_aud) }}</p>
          </div>
          <div v-if="profile.max_amount_aud">
            <p class="text-xs text-gray-500 mb-0.5">Maximum</p>
            <p class="font-bold text-gray-900">{{ $fmt.aud(profile.max_amount_aud) }}</p>
          </div>
          <div v-if="profile.always_available">
            <p class="text-xs text-gray-500 mb-0.5">Availability</p>
            <p class="font-bold text-green-700">
              <i class="fas fa-circle text-green-500 text-xs mr-1"></i>Always available
            </p>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="text-sm font-bold text-gray-900 mb-4">
          <i class="fas fa-star text-yellow-400 mr-2"></i>
          Recent Reviews
          <span class="text-gray-400 font-normal ml-1">({{ profile.recent_reviews?.length || 0 }})</span>
        </h3>

        <div v-if="profile.recent_reviews && profile.recent_reviews.length" class="space-y-4">
          <div v-for="(rev, i) in profile.recent_reviews" :key="i"
            class="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
            <div class="flex items-start justify-between gap-3 mb-1.5">
              <div class="flex items-center gap-2">
                <!-- Reviewer avatar -->
                <div class="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                  <img v-if="fixUrl(rev.reviewer?.avatar_url)"
                    :src="fixUrl(rev.reviewer.avatar_url)"
                    class="w-7 h-7 rounded-lg object-cover"
                    @error="$event.target.style.display='none'">
                  <span v-else>{{ (rev.reviewer?.display_name || '?')[0].toUpperCase() }}</span>
                </div>
                <p class="text-sm font-semibold text-gray-900">
                  {{ rev.reviewer?.display_name || rev.reviewer || 'Anonymous' }}
                </p>
              </div>
              <p class="text-xs text-gray-400 flex-shrink-0">{{ $fmt.date(rev.created_at) }}</p>
            </div>
            <!-- Stars -->
            <div class="flex items-center gap-0.5 mb-1.5">
              <i v-for="s in 5" :key="s"
                :class="['fas fa-star text-xs', s <= rev.score ? 'text-yellow-400' : 'text-gray-200']"></i>
              <span class="text-xs text-gray-500 ml-1">{{ rev.score }}.0</span>
            </div>
            <p v-if="rev.comment" class="text-sm text-gray-600 leading-relaxed">{{ rev.comment }}</p>
            <p v-else class="text-sm text-gray-400 italic">No comment left.</p>
          </div>
        </div>

        <div v-else class="text-center py-6">
          <i class="fas fa-star text-3xl text-gray-200 block mb-2"></i>
          <p class="text-sm text-gray-400">No reviews yet.</p>
        </div>
      </div>

      <!-- Send money CTA at bottom -->
      <div v-if="!isMe" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
        <p class="text-sm text-gray-600 mb-3">
          Want to swap money with <strong>{{ profile.display_name.split(' ')[0] }}</strong>?
        </p>
        <button @click="sendMoneyVia"
          class="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i class="fas fa-paper-plane text-xs"></i>
          Send money via {{ profile.display_name.split(' ')[0] }}
        </button>
        <p class="text-xs text-gray-400 mt-2">You'll be taken to their open orders</p>
      </div>

    </div>
  </div>
  <app-footer />
</div>`},hv={name:"KYC",data(){return{status:null,loading:!0,uploads:{},uploading:{},errors:{}}},computed:{steps(){if(!this.status)return[];const e=this.status.documents||[];return[{type:"passport",label:"Government-issued ID",desc:"Passport, national ID card, or driver's licence. Must be valid and clearly readable.",icon:"fa-passport",required:!0,idTypes:["Passport","National ID","Driver's Licence"]},{type:"selfie",label:"Selfie holding your ID",desc:"A clear photo of your face while holding your ID document. Both your face and ID must be visible.",icon:"fa-camera",required:!0,idTypes:null},{type:"proof_of_address",label:"Proof of Address",desc:"Bank statement, utility bill, or council notice less than 3 months old showing your name and address.",icon:"fa-home",required:!1,idTypes:null}].map(t=>{const s=e.find(r=>r.document_type===t.type);return{...t,doc:s,uploaded:!!s,docStatus:s==null?void 0:s.status,rejectionReason:s==null?void 0:s.rejection_reason}})},allRequiredUploaded(){return this.steps.filter(e=>e.required).every(e=>e.uploaded&&e.docStatus!=="rejected")},progressPercent(){if(!this.steps.length)return 0;const e=this.steps.filter(t=>t.docStatus==="approved").length;return Math.round(e/this.steps.length*100)},statusConfig(){var t;const e=(t=this.status)==null?void 0:t.kyc_status;return e==="approved"?{icon:"fa-check-circle",color:"green",label:"Approved",desc:"Your identity is verified. You can trade without restrictions."}:e==="submitted"?{icon:"fa-clock",color:"blue",label:"Under Review",desc:"Our team is reviewing your documents. This usually takes 1–2 business days."}:e==="rejected"?{icon:"fa-times-circle",color:"red",label:"Action Required",desc:"Some documents were rejected. Please re-upload the affected documents."}:{icon:"fa-id-card",color:"yellow",label:"Not Started",desc:"Upload your documents below to verify your identity."}}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/kyc");this.status=e.data}catch{}this.loading=!1},onFileSelect(e,t){var i,n;const s=((n=(i=t.target)==null?void 0:i.files)==null?void 0:n[0])||t;if(!s)return;const r=10;if(s.size>r*1024*1024){this.$set(this.errors,e,"File too large. Maximum size is "+r+"MB.");return}if(!["image/jpeg","image/jpg","image/png","application/pdf"].includes(s.type)){this.$set(this.errors,e,"Invalid file type. Please upload a JPG, PNG, or PDF.");return}this.$set(this.errors,e,null),this.$set(this.uploads,e,s)},async upload(e){var r,a,i,n,o,l;const t=this.uploads[e];if(!t){this.$set(this.errors,e,"Please select a file first.");return}this.$set(this.uploading,e,!0),this.$set(this.errors,e,null);const s=new FormData;s.append("document_type",e),s.append("file",t);try{await this.$http.post("/kyc/upload",s,{headers:{"Content-Type":"multipart/form-data"}}),this.$set(this.uploads,e,null),this.$toast.success("Document uploaded successfully!"),await this.load()}catch(d){const c=((a=(r=d.response)==null?void 0:r.data)==null?void 0:a.message)||((l=(o=(n=(i=d.response)==null?void 0:i.data)==null?void 0:n.errors)==null?void 0:o.file)==null?void 0:l[0])||"Upload failed. Please try again.";this.$set(this.errors,e,c)}this.$set(this.uploading,e,!1)},async deleteDoc(e,t){if(confirm("Remove this document? You will need to upload it again."))try{await this.$http.delete("/kyc/documents/"+e),this.$set(this.uploads,t,null),this.$toast.success("Document removed."),await this.load()}catch{this.$toast.error("Could not remove document.")}},getFilePreview(e){var s;const t=this.uploads[e];return t&&(s=t.type)!=null&&s.startsWith("image/")?URL.createObjectURL(t):null},docViewUrl(e){return"/api/v1/files/kyc/"+e}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Identity Verification</h1>
      <p class="text-gray-500 text-sm">
        Verify your identity to build trust with other traders.
        Your documents are stored securely and only reviewed by the eZimConnect team.
      </p>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else class="space-y-5">

      <!-- Status banner -->
      <div :class="['rounded-2xl p-5 border-2 flex items-start gap-4',
        statusConfig.color === 'green'  ? 'bg-green-50  border-green-200' :
        statusConfig.color === 'blue'   ? 'bg-blue-50   border-blue-200' :
        statusConfig.color === 'red'    ? 'bg-red-50    border-red-200' :
        'bg-yellow-50 border-yellow-200']">
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
          statusConfig.color === 'green'  ? 'bg-green-100' :
          statusConfig.color === 'blue'   ? 'bg-blue-100' :
          statusConfig.color === 'red'    ? 'bg-red-100' :
          'bg-yellow-100']">
          <i :class="['fas text-xl',
            statusConfig.icon,
            statusConfig.color === 'green'  ? 'text-green-600' :
            statusConfig.color === 'blue'   ? 'text-blue-600' :
            statusConfig.color === 'red'    ? 'text-red-600' :
            'text-yellow-600']"></i>
        </div>
        <div class="flex-1">
          <p class="font-semibold text-gray-900">{{ statusConfig.label }}</p>
          <p class="text-sm text-gray-600 mt-0.5">{{ statusConfig.desc }}</p>
          <div v-if="status?.kyc_status === 'submitted'" class="mt-3 flex items-center gap-2">
            <div class="flex-1 bg-blue-200 rounded-full h-1.5">
              <div class="bg-blue-600 h-1.5 rounded-full" style="width: 60%"></div>
            </div>
            <span class="text-xs text-blue-600 font-medium">In review</span>
          </div>
        </div>
      </div>

      <!-- What you need -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">What you need to upload</h2>
        <div class="grid grid-cols-3 gap-3">
          <div v-for="step in steps" :key="step.type"
            :class="['flex flex-col items-center text-center p-3 rounded-xl transition',
              step.docStatus === 'approved' ? 'bg-green-50' : step.uploaded ? 'bg-blue-50' : 'bg-gray-50']">
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center mb-1.5',
              step.docStatus === 'approved' ? 'bg-green-100' : step.uploaded ? 'bg-blue-100' : 'bg-gray-100']">
              <i :class="['fas text-sm',
                step.docStatus === 'approved' ? 'fa-check text-green-600' :
                step.uploaded ? 'fa-clock text-blue-600' :
                step.icon + ' text-gray-400']"></i>
            </div>
            <p class="text-xs font-medium text-gray-700 leading-tight">{{ step.label }}</p>
            <span :class="['text-xs mt-1 font-medium',
              step.required ? 'text-red-500' : 'text-gray-400']">
              {{ step.required ? 'Required' : 'Optional' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Document upload cards -->
      <div v-for="step in steps" :key="step.type"
        :class="['bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition',
          step.docStatus === 'approved' ? 'border-green-200' :
          step.docStatus === 'rejected' ? 'border-red-200' :
          step.uploaded ? 'border-blue-200' :
          'border-gray-100']">

        <!-- Card header -->
        <div :class="['px-5 py-4 border-b flex items-center justify-between',
          step.docStatus === 'approved' ? 'border-green-100 bg-green-50' :
          step.docStatus === 'rejected' ? 'border-red-100 bg-red-50' :
          step.uploaded ? 'border-blue-100 bg-blue-50' :
          'border-gray-100 bg-gray-50']">
          <div class="flex items-center gap-3">
            <div :class="['w-9 h-9 rounded-xl flex items-center justify-center',
              step.docStatus === 'approved' ? 'bg-green-100' :
              step.docStatus === 'rejected' ? 'bg-red-100' :
              step.uploaded ? 'bg-blue-100' : 'bg-gray-200']">
              <i :class="['fas', step.icon,
                step.docStatus === 'approved' ? 'text-green-600' :
                step.docStatus === 'rejected' ? 'text-red-600' :
                step.uploaded ? 'text-blue-600' : 'text-gray-500']"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="text-sm font-semibold text-gray-900">{{ step.label }}</p>
                <span v-if="step.required" class="text-xs text-red-500 font-medium">Required</span>
                <span v-else class="text-xs text-gray-400">Optional</span>
              </div>
            </div>
          </div>
          <!-- Status pill -->
          <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full',
            step.docStatus === 'approved' ? 'bg-green-100 text-green-700' :
            step.docStatus === 'rejected' ? 'bg-red-100 text-red-700' :
            step.docStatus === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-500']">
            {{ step.docStatus === 'approved' ? '✓ Approved' : step.docStatus === 'rejected' ? '✗ Rejected' : step.docStatus === 'pending' ? '⏳ Under review' : 'Not uploaded' }}
          </span>
        </div>

        <!-- Card body -->
        <div class="p-5">
          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4">{{ step.desc }}</p>

          <!-- Rejection reason -->
          <div v-if="step.rejectionReason" class="mb-4 flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
            <i class="fas fa-exclamation-circle text-red-500 mt-0.5 flex-shrink-0"></i>
            <div>
              <p class="text-sm font-medium text-red-800">Rejection reason:</p>
              <p class="text-sm text-red-700 mt-0.5">{{ step.rejectionReason }}</p>
            </div>
          </div>

          <!-- Approved: show view link -->
          <div v-if="step.docStatus === 'approved'" class="flex items-center gap-2 text-sm text-green-700">
            <i class="fas fa-check-circle"></i>
            <span class="font-medium">Document approved</span>
            <a v-if="step.doc" :href="docViewUrl(step.doc.id)" target="_blank"
              class="ml-auto text-xs text-green-700 hover:underline flex items-center gap-1">
              <i class="fas fa-eye text-xs"></i> View
            </a>
          </div>

          <!-- Under review: show note with delete option -->
          <div v-else-if="step.docStatus === 'pending'" class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-blue-700">
              <i class="fas fa-clock"></i>
              <span>Submitted — under review</span>
            </div>
            <button @click="deleteDoc(step.doc.id, step.type)"
              class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 transition">
              <i class="fas fa-trash-alt text-xs"></i> Remove
            </button>
          </div>

          <!-- Can upload -->
          <div v-else-if="status?.can_submit">

            <!-- File preview -->
            <div v-if="uploads[step.type]" class="mb-3">
              <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <img v-if="getFilePreview(step.type)" :src="getFilePreview(step.type)"
                  class="w-12 h-12 object-cover rounded-lg flex-shrink-0">
                <div v-else class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-file-pdf text-red-500"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800 truncate">{{ uploads[step.type].name }}</p>
                  <p class="text-xs text-gray-500">{{ (uploads[step.type].size / 1024 / 1024).toFixed(2) }} MB</p>
                </div>
                <button @click="$set(uploads, step.type, null)" class="text-gray-400 hover:text-red-500 p-1">
                  <i class="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>

            <!-- Error -->
            <div v-if="errors[step.type]" class="mb-3 text-xs text-red-600 flex items-center gap-1.5">
              <i class="fas fa-exclamation-circle"></i>{{ errors[step.type] }}
            </div>

            <!-- Upload area + button -->
            <div class="flex gap-3">
              <label :class="['flex-1 flex items-center justify-center gap-2 p-3.5 border-2 border-dashed rounded-xl cursor-pointer transition text-sm font-medium',
                uploads[step.type] ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-green-400 hover:bg-green-50 hover:text-green-700']">
                <i :class="['fas', uploads[step.type] ? 'fa-check-circle' : 'fa-cloud-upload-alt']"></i>
                {{ uploads[step.type] ? 'Change file' : 'Click to select file' }}
                <input type="file" class="hidden" accept="image/jpeg,image/jpg,image/png,application/pdf"
                  @change="onFileSelect(step.type, $event)">
              </label>

              <button v-if="uploads[step.type]"
                @click="upload(step.type)"
                :disabled="uploading[step.type]"
                class="px-5 py-3 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors flex items-center gap-2 flex-shrink-0">
                <i v-if="uploading[step.type]" class="fas fa-spinner fa-spin text-xs"></i>
                <i v-else class="fas fa-upload text-xs"></i>
                {{ uploading[step.type] ? 'Uploading...' : 'Upload' }}
              </button>
            </div>

            <p class="text-xs text-gray-400 mt-2">
              Accepted: JPG, PNG, PDF &middot; Max 10MB
            </p>
          </div>
        </div>
      </div>

      <!-- All submitted success state -->
      <div v-if="allRequiredUploaded && status?.kyc_status === 'submitted'"
        class="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
        <i class="fas fa-paper-plane text-blue-600 text-3xl mb-3 block"></i>
        <p class="font-semibold text-blue-900 text-lg">Documents submitted!</p>
        <p class="text-sm text-blue-700 mt-1">
          Our team will review your documents within 1–2 business days.
          You'll receive an email notification once approved.
        </p>
      </div>

      <!-- Tips -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <i class="fas fa-lightbulb text-yellow-500"></i> Tips for faster approval
        </h3>
        <ul class="space-y-2 text-sm text-gray-600">
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
            Make sure documents are well-lit and all text is clearly readable
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
            Selfie: hold your ID next to your face — both must be fully visible
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
            Documents must not be expired
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-0.5 flex-shrink-0 text-xs"></i>
            File size under 10MB — high quality JPEG or PNG preferred
          </li>
        </ul>
      </div>
    </div>
  </div>
  <app-footer />
</div>`},vv={name:"BankAccounts",data(){return{accounts:[],loading:!0,showForm:!1,form:{bank_name:"",account_name:"",bsb_code:"",account_number:"",account_type:"savings",country_id:1},saving:!1,error:null,editId:null}},computed:{hasPrimary(){return this.accounts.some(e=>e.is_primary)}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/bank-accounts");this.accounts=e.data||[]}catch{}this.loading=!1},openForm(){this.showForm=!0,this.editId=null,this.form={bank_name:"",account_name:"",bsb_code:"",account_number:"",account_type:"savings",country_id:1},this.error=null},async save(){var e,t;this.saving=!0,this.error=null;try{this.editId?(await this.$http.put("/bank-accounts/"+this.editId,this.form),this.$toast.success("Account updated.")):(await this.$http.post("/bank-accounts",this.form),this.$toast.success("Bank account added.")),this.showForm=!1,await this.load()}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed to save."}this.saving=!1},edit(e){this.editId=e.id,this.form={bank_name:e.bank_name,account_name:e.account_name,bsb_code:e.bsb_code||"",account_number:e.account_number,account_type:e.account_type||"savings",country_id:e.country_id||1},this.showForm=!0,this.error=null},async setPrimary(e){try{await this.$http.put("/bank-accounts/"+e+"/set-primary"),await this.load()}catch{}},async remove(e){var t,s;if(confirm("Remove this bank account?"))try{await this.$http.delete("/bank-accounts/"+e),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed.")}}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Bank Accounts</h1>
        <p class="text-sm text-gray-500 mt-0.5">Your Australian bank accounts for AUD transactions.</p>
      </div>
      <button @click="openForm()" v-if="accounts.length < 5"
        class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> Add account
      </button>
    </div>

    <!-- No bank account warning -->
    <div v-if="!loading && !accounts.length"
      class="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-5 flex items-start gap-3">
      <i class="fas fa-exclamation-triangle text-orange-500 text-xl flex-shrink-0 mt-0.5"></i>
      <div>
        <p class="font-bold text-orange-800 mb-1">No bank account added</p>
        <p class="text-sm text-orange-700">You need at least one Australian bank account before you can create or accept orders. Add one now to start sending or receiving money.</p>
      </div>
    </div>

    <!-- Add/Edit form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-gray-900">{{ editId ? 'Edit' : 'Add' }} bank account</h2>
        <button @click="showForm = false" class="p-1 text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
      </div>
      <alert-banner v-if="error" type="error" :message="error" class="mb-4" />
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Bank name <span class="text-red-500">*</span></label>
          <input v-model="form.bank_name" type="text" placeholder="e.g. NAB, ANZ, Commonwealth Bank"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Account holder name <span class="text-red-500">*</span></label>
          <input v-model="form.account_name" type="text" placeholder="Full name as on the account"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1">BSB <span class="text-gray-400 font-normal">(xxx-xxx)</span></label>
            <input v-model="form.bsb_code" type="text" placeholder="083-001"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
          </div>
          <div>
            <label class="text-sm font-semibold text-gray-700 block mb-1">Account number <span class="text-red-500">*</span></label>
            <input v-model="form.account_number" type="text" placeholder="123456789"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
          </div>
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Account type</label>
          <select v-model="form.account_type" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="savings">Savings</option>
            <option value="cheque">Cheque / Transaction</option>
          </select>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="save" :disabled="saving || !form.bank_name || !form.account_name || !form.account_number"
            class="flex-1 py-3 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i>
            {{ editId ? 'Save changes' : 'Add account' }}
          </button>
          <button @click="showForm = false" class="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="accounts.length" class="space-y-3">
      <div v-for="acc in accounts" :key="acc.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-university text-blue-600"></i>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <p class="font-bold text-gray-900">{{ acc.bank_name }}</p>
                <span v-if="acc.is_primary" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Primary</span>
              </div>
              <p class="text-sm text-gray-600">{{ acc.account_name }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                <span v-if="acc.bsb_code">BSB {{ acc.bsb_code }} · </span>
                Account ····{{ (acc.account_number || '').slice(-4) }}
              </p>
            </div>
          </div>
          <div class="flex gap-1.5 flex-shrink-0">
            <button v-if="!acc.is_primary" @click="setPrimary(acc.id)"
              class="px-2.5 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">
              Set primary
            </button>
            <button @click="edit(acc)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
              <i class="fas fa-edit text-sm"></i>
            </button>
            <button @click="remove(acc.id)" :disabled="acc.is_primary"
              class="p-1.5 rounded-lg transition-colors"
              :class="acc.is_primary ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:bg-red-50 hover:text-red-600'"
              :title="acc.is_primary ? 'Cannot delete primary account' : 'Delete'">
              <i class="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
      <p class="text-xs text-center text-gray-400 pt-1">{{ accounts.length }}/5 accounts used</p>
    </div>

    <div v-else-if="!showForm" class="text-center py-4">
      <button @click="openForm()" class="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus"></i> Add your first bank account
      </button>
    </div>
  </div>
  <app-footer />
</div>`},xv={name:"Settings",data(){return{user:null,prefs:null,loading:!0,saving:!1,tab:"notifications",currentPassword:"",newPassword:"",confirmPassword:"",passwordLoading:!1,passwordError:null,passwordSuccess:!1,twoFaLoading:!1,twoFaQr:null,twoFaCode:"",twoFaError:null,pinStep:"set",pin:"",pinConfirm:"",currentPin:"",pinLoading:!1,pinError:null,pinSuccess:!1}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/user");this.user=e.data,this.prefs={...e.data.notification_preferences}}catch{}this.loading=!1},async savePrefs(){this.saving=!0;try{await this.$http.put("/user/notifications/preferences",this.prefs),this.$toast.success("Notification preferences saved.")}catch{this.$toast.error("Failed to save preferences.")}this.saving=!1},async changePassword(){var e,t;if(this.newPassword!==this.confirmPassword){this.passwordError="Passwords do not match.";return}this.passwordLoading=!0,this.passwordError=null;try{await this.$http.put("/user/password",{current_password:this.currentPassword,password:this.newPassword,password_confirmation:this.confirmPassword}),this.passwordSuccess=!0,this.currentPassword="",this.newPassword="",this.confirmPassword="",this.$toast.success("Password changed.")}catch(s){this.passwordError=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed to change password."}this.passwordLoading=!1},async setup2fa(){var e,t;this.twoFaLoading=!0;try{const{data:s}=await this.$http.post("/auth/2fa/setup");this.twoFaQr=s.data}catch(s){this.twoFaError=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed."}this.twoFaLoading=!1},async confirm2fa(){var e,t;this.twoFaLoading=!0,this.twoFaError=null;try{await this.$http.post("/auth/2fa/confirm",{code:this.twoFaCode}),this.$toast.success("Two-factor authentication enabled."),this.twoFaQr=null,this.twoFaCode="",await this.load()}catch(s){this.twoFaError=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Invalid code."}this.twoFaLoading=!1},async disable2fa(){var e,t;if(confirm("Disable two-factor authentication? This reduces your account security.")){this.twoFaLoading=!0;try{await this.$http.post("/auth/2fa/disable",{code:this.twoFaCode}),this.$toast.success("2FA disabled."),this.twoFaCode="",await this.load()}catch(s){this.twoFaError=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Invalid code."}this.twoFaLoading=!1}},async setPin(){var e,t;if(this.pin.length!==6){this.pinError="PIN must be 6 digits.";return}if(this.pin!==this.pinConfirm){this.pinError="PINs do not match.";return}this.pinLoading=!0,this.pinError=null;try{await this.$http.post("/auth/pin/setup",{pin:this.pin,pin_confirmation:this.pinConfirm,current_pin:this.currentPin||void 0}),this.pinSuccess=!0,this.pin="",this.pinConfirm="",this.currentPin="",this.$toast.success("Transaction PIN set."),await this.load()}catch(s){this.pinError=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed to set PIN."}this.pinLoading=!1}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

    <loading-spinner v-if="loading" />
    <div v-else>
      <!-- Tabs -->
      <div class="flex gap-1 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm mb-6 overflow-x-auto">
        <button v-for="t in [
          {key:'notifications', label:'Notifications', icon:'fa-bell'},
          {key:'security',      label:'Security',      icon:'fa-lock'},
          {key:'pin',           label:'Transaction PIN', icon:'fa-key'},
        ]" :key="t.key" @click="tab = t.key"
          :class="['flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap',
            tab === t.key ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-800']">
          <i :class="'fas ' + t.icon + ' text-xs'"></i> {{ t.label }}
        </button>
      </div>

      <!-- Notifications tab -->
      <div v-if="tab === 'notifications' && prefs" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <div class="space-y-4">
          <div v-for="pref in [
            {key:'email',        label:'Email notifications',     desc:'Receive updates by email'},
            {key:'inapp',        label:'In-app notifications',    desc:'Notifications inside eZimConnect'},
            {key:'sms',          label:'SMS notifications',       desc:'Text message alerts'},
            {key:'push',         label:'Push notifications',      desc:'Browser push notifications'},
            {key:'rate_alerts',  label:'Rate alerts',             desc:'Notify when target rate is reached'},
            {key:'matches',      label:'Match proposals',         desc:'When someone proposes a match'},
            {key:'chat',         label:'Chat messages',           desc:'New messages from your match partner'},
            {key:'transactions', label:'Transaction updates',     desc:'Status changes on your transactions'},
            {key:'marketing',    label:'Platform news',           desc:'Tips, features, and announcements'},
          ]" :key="pref.key"
            class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p class="text-sm font-medium text-gray-800">{{ pref.label }}</p>
              <p class="text-xs text-gray-500">{{ pref.desc }}</p>
            </div>
            <button @click="prefs[pref.key] = !prefs[pref.key]"
              :class="['relative inline-flex w-11 h-6 rounded-full transition-colors flex-shrink-0',
                prefs[pref.key] ? 'bg-green-600' : 'bg-gray-200']">
              <span :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                prefs[pref.key] ? 'translate-x-5' : 'translate-x-0']"></span>
            </button>
          </div>
        </div>
        <button @click="savePrefs" :disabled="saving"
          class="mt-6 w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i> Save Preferences
        </button>
      </div>

      <!-- Security tab -->
      <div v-if="tab === 'security'" class="space-y-5">
        <!-- Change password -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Change Password</h2>
          <alert-banner v-if="passwordError" type="error" :message="passwordError" />
          <alert-banner v-if="passwordSuccess" type="success" message="Password updated successfully." />
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Current password</label>
              <input v-model="currentPassword" type="password"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="Your current password">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">New password</label>
              <input v-model="newPassword" type="password"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="8+ characters">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 block mb-1">Confirm new password</label>
              <input v-model="confirmPassword" type="password"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                placeholder="Repeat new password">
            </div>
            <button @click="changePassword" :disabled="passwordLoading || !currentPassword || !newPassword"
              class="w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
              <i v-if="passwordLoading" class="fas fa-spinner fa-spin mr-2"></i> Update Password
            </button>
          </div>
        </div>

        <!-- 2FA -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-semibold text-gray-900">Two-Factor Authentication</h2>
              <p class="text-sm text-gray-500 mt-0.5">Adds a second layer of security to your account</p>
            </div>
            <span :class="['text-xs font-semibold px-3 py-1 rounded-full',
              user.two_fa_enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
              {{ user.two_fa_enabled ? 'Enabled' : 'Disabled' }}
            </span>
          </div>

          <alert-banner v-if="twoFaError" type="error" :message="twoFaError" />

          <div v-if="!user.two_fa_enabled">
            <div v-if="!twoFaQr">
              <p class="text-sm text-gray-600 mb-4">
                Use an authenticator app like Google Authenticator or Authy to generate login codes.
              </p>
              <button @click="setup2fa" :disabled="twoFaLoading"
                class="w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
                <i v-if="twoFaLoading" class="fas fa-spinner fa-spin mr-2"></i> Enable 2FA
              </button>
            </div>
            <div v-else class="space-y-4">
              <p class="text-sm text-gray-700">Scan this QR code with your authenticator app:</p>
              <div class="flex justify-center p-4 bg-white border border-gray-200 rounded-xl" v-html="twoFaQr.qr_code_svg"></div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Or enter this code manually:</p>
                <code class="text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-lg block text-center">{{ twoFaQr.secret }}</code>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700 block mb-1">Enter the 6-digit code to confirm</label>
                <input v-model="twoFaCode" type="text" maxlength="6"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500"
                  placeholder="000000">
              </div>
              <button @click="confirm2fa" :disabled="twoFaLoading || twoFaCode.length < 6"
                class="w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
                Confirm &amp; Enable 2FA
              </button>
            </div>
          </div>

          <div v-else class="space-y-3">
            <p class="text-sm text-gray-600">2FA is enabled. Enter your current code to disable it.</p>
            <input v-model="twoFaCode" type="text" maxlength="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500"
              placeholder="000000">
            <button @click="disable2fa" :disabled="twoFaLoading || twoFaCode.length < 6"
              class="w-full py-3 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition">
              Disable 2FA
            </button>
          </div>
        </div>
      </div>

      <!-- PIN tab -->
      <div v-if="tab === 'pin'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-base font-semibold text-gray-900 mb-1">Transaction PIN</h2>
        <p class="text-sm text-gray-500 mb-5">
          A 6-digit PIN required to confirm transactions.
          <span v-if="user.pin_set" class="text-green-600 font-medium ml-1">Currently set.</span>
          <span v-else class="text-orange-500 font-medium ml-1">Not yet set.</span>
        </p>

        <alert-banner v-if="pinError" type="error" :message="pinError" />
        <alert-banner v-if="pinSuccess" type="success" message="Transaction PIN updated." />

        <div class="space-y-4">
          <div v-if="user.pin_set">
            <label class="text-sm font-medium text-gray-700 block mb-1">Current PIN</label>
            <input v-model="currentPin" type="password" maxlength="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500"
              placeholder="000000">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">New PIN (6 digits)</label>
            <input v-model="pin" type="password" maxlength="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500"
              placeholder="000000">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 block mb-1">Confirm new PIN</label>
            <input v-model="pinConfirm" type="password" maxlength="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-green-500"
              placeholder="000000">
          </div>
          <button @click="setPin" :disabled="pinLoading || pin.length < 6 || pinConfirm.length < 6"
            class="w-full py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition">
            <i v-if="pinLoading" class="fas fa-spinner fa-spin mr-2"></i>
            {{ user.pin_set ? 'Update PIN' : 'Set PIN' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`},bv={name:"Notifications",data(){return{notifications:[],meta:null,loading:!0,marking:!1}},async mounted(){await this.load()},methods:{async load(e=1){var t;this.loading=!0;try{const{data:s}=await this.$http.get("/user/notifications",{params:{page:e}});this.notifications=s.data,this.meta=(t=s.meta)==null?void 0:t.pagination}catch{}this.loading=!1},async markAllRead(){this.marking=!0;try{await this.$http.post("/user/notifications/read-all"),this.notifications=this.notifications.map(e=>({...e,read_at:new Date().toISOString()})),this.$toast.success("All marked as read.")}catch{}this.marking=!1},async markRead(e){try{await this.$http.post("/user/notifications/"+e+"/read");const t=this.notifications.find(s=>s.id===e);t&&(t.read_at=new Date().toISOString())}catch{}},iconFor(e){return{MatchProposed:"fa-handshake",FundsReleased:"fa-hand-holding-usd",DepositVerified:"fa-check-circle",DisputeResolved:"fa-gavel",KycApproved:"fa-id-card",KycRejected:"fa-times-circle",RateAlertTriggered:"fa-chart-line",ChatMessage:"fa-comment"}[e]||"fa-bell"}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
      <button v-if="notifications.some(n => !n.read_at)" @click="markAllRead" :disabled="marking"
        class="text-sm text-green-700 hover:underline font-medium">
        Mark all read
      </button>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="notifications.length" class="space-y-2">
      <div v-for="n in notifications" :key="n.id"
        @click="markRead(n.id)"
        :class="['bg-white rounded-2xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow',
          !n.read_at ? 'border-green-200 bg-green-50/30' : 'border-gray-100']">
        <div class="flex items-start gap-3">
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
            !n.read_at ? 'bg-green-100' : 'bg-gray-100']">
            <i :class="['fas text-sm', iconFor(n.type), !n.read_at ? 'text-green-600' : 'text-gray-400']"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p :class="['text-sm', !n.read_at ? 'font-semibold text-gray-900' : 'font-medium text-gray-700']">
              {{ n.data?.message || 'New notification' }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">{{ $fmt.datetime(n.created_at) }}</p>
          </div>
          <div v-if="!n.read_at" class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
        </div>
      </div>
      <pagination-links :meta="meta" @page="load($event)" />
    </div>

    <empty-state v-else icon="fa-bell" title="No notifications" subtitle="You're all caught up!" />
  </div>
  <app-footer />
</div>`},yv={name:"History",data(){return{trades:[],meta:null,loading:!0}},async mounted(){await this.load()},methods:{async load(e=1){var t;this.loading=!0;try{const{data:s}=await this.$http.get("/user/history",{params:{page:e}});this.trades=s.data,this.meta=(t=s.meta)==null?void 0:t.pagination}catch{}this.loading=!1},totalAud(){return this.trades.reduce((e,t)=>e+parseFloat(t.agreed_aud||0),0)},totalUsd(){return this.trades.reduce((e,t)=>e+parseFloat(t.agreed_usd||0),0)}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Trade History</h1>

    <loading-spinner v-if="loading" />

    <div v-else>
      <!-- Summary -->
      <div v-if="trades.length" class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-gray-900">{{ trades.length }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Completed trades</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-gray-900">{{ $fmt.aud(totalAud()) }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Total AUD exchanged</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-green-700">{{ $fmt.usd(totalUsd()) }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Total USD exchanged</p>
        </div>
      </div>

      <!-- Table -->
      <div v-if="trades.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">AUD</th>
                <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">USD</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Method</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="trade in trades" :key="trade.ulid" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-gray-700">{{ $fmt.date(trade.completed_at) }}</td>
                <td class="px-4 py-3">
                  <span :class="['text-xs font-semibold px-2 py-0.5 rounded-lg',
                    trade.role === 'sender' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                    {{ trade.role === 'sender' ? 'Sender' : 'Receiver' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right font-semibold text-gray-900">{{ $fmt.aud(trade.agreed_aud) }}</td>
                <td class="px-4 py-3 text-right font-semibold text-green-700">{{ $fmt.usd(trade.agreed_usd) }}</td>
                <td class="px-4 py-3 text-gray-600">{{ trade.location || '—' }}</td>
                <td class="px-4 py-3">
                  <span :class="['text-xs capitalize', trade.delivery_method === 'secure' ? 'text-green-600' : 'text-orange-600']">
                    {{ trade.delivery_method }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <router-link :to="'/matches/' + trade.ulid" class="text-xs text-green-700 hover:underline">
                    View
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <pagination-links v-if="meta" :meta="meta" @page="load($event)" />

      <empty-state v-if="!trades.length" icon="fa-history"
        title="No completed trades yet"
        subtitle="Once you complete your first transaction it will appear here."
        action-label="Browse Orders" action-to="/browse" />
    </div>
  </div>
  <app-footer />
</div>`},wv={name:"Directory",data(){return{items:[],meta:null,loading:!0,search:"",orderType:"",city:"",locations:[]}},async mounted(){var e;try{const{data:t}=await this.$http.get("/countries/2/locations");this.locations=((e=t.data)==null?void 0:e.flat)||[]}catch{}await this.load()},methods:{async load(e=1){var t;this.loading=!0;try{const s={page:e,per_page:12};this.search&&(s.search=this.search),this.orderType&&(s.order_type=this.orderType),this.city&&(s.location_id=this.city);const{data:r}=await this.$http.get("/directory",{params:s});this.items=r.data||[],this.meta=(t=r.meta)==null?void 0:t.pagination}catch{}this.loading=!1},reset(){this.search="",this.orderType="",this.city="",this.load()},viewProfile(e){this.$router.push("/profile/"+e)},fixUrl(e){if(!e)return null;try{const t=new URL(e);return window.location.origin+t.pathname}catch{return e}},trustColor(e){return e>=70?"text-green-600":e>=40?"text-yellow-600":"text-gray-400"}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-7">
      <h1 class="text-2xl font-bold text-gray-900">Member Directory</h1>
      <p class="text-sm text-gray-500 mt-1">Browse verified traders and businesses. Click any member to view their full profile.</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      <div class="grid sm:grid-cols-4 gap-3">
        <div class="sm:col-span-2">
          <input v-model="search" @keyup.enter="load()" type="text"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
            placeholder="Search by name...">
        </div>
        <select v-model="orderType" @change="load()"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">All types</option>
          <option value="send_to_zim">Sends to Zimbabwe</option>
          <option value="receive_from_zim">Receives from Zimbabwe</option>
        </select>
        <select v-model="city" @change="load()"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">All cities</option>
          <option v-for="l in locations" :key="l.id" :value="l.id">{{ l.name }}</option>
        </select>
      </div>
      <div class="flex gap-2 mt-3">
        <button @click="load()" class="px-4 py-2 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i class="fas fa-search mr-1.5 text-xs"></i>Search
        </button>
        <button @click="reset()" class="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Reset</button>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="items.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="item in items" :key="item.ulid"
        @click="viewProfile(item.ulid)"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer p-5">
        <div class="flex items-start gap-3 mb-3">
          <div class="w-12 h-12 rounded-2xl bg-green-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
            <img v-if="item.avatar_url"
              :src="fixUrl(item.avatar_url)"
              class="w-12 h-12 object-cover"
              @error="$event.target.style.display='none'">
            <span v-if="!item.avatar_url" class="text-green-700 font-black text-xl">
              {{ item.display_name ? item.display_name[0].toUpperCase() : '?' }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <p class="font-bold text-gray-900 truncate">{{ item.display_name }}</p>
              <span v-if="item.is_verified_business" class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-semibold flex-shrink-0">
                <i class="fas fa-check-circle text-xs"></i>
              </span>
            </div>
            <p v-if="item.business_name" class="text-xs text-gray-500 truncate">{{ item.business_name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">
              <i class="fas fa-map-marker-alt text-green-600 mr-0.5"></i>
              {{ item.city || item.country || 'Australia' }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center mb-3">
          <div class="bg-gray-50 rounded-xl py-2">
            <p class="text-base font-black text-gray-900">{{ item.total_trades }}</p>
            <p class="text-xs text-gray-400">Trades</p>
          </div>
          <div class="bg-gray-50 rounded-xl py-2">
            <p class="text-base font-black text-gray-900">{{ item.rating ? parseFloat(item.rating).toFixed(1) : '—' }}</p>
            <p class="text-xs text-gray-400">Rating</p>
          </div>
          <div class="bg-gray-50 rounded-xl py-2">
            <p :class="['text-base font-black', trustColor(item.trust_score)]">{{ item.trust_score }}</p>
            <p class="text-xs text-gray-400">Trust</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 mb-3">
          <span v-if="item.always_available" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            <i class="fas fa-circle text-green-500" style="font-size:7px"></i> Available
          </span>
          <span v-for="b in (item.badges || []).slice(0,3)" :key="b.badge_key" class="text-sm" :title="b.badge_name">{{ b.badge_icon }}</span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-0.5">
            <i v-for="s in 5" :key="s"
              :class="['fas fa-star text-xs', s <= Math.round(item.rating || 0) ? 'text-yellow-400' : 'text-gray-200']"></i>
          </div>
          <span class="text-xs text-green-700 font-semibold flex items-center gap-1">
            View profile <i class="fas fa-chevron-right text-xs"></i>
          </span>
        </div>
      </div>
    </div>

    <empty-state v-else-if="!loading" icon="fa-users"
      title="No members found"
      subtitle="Try a different search term or clear your filters." />

    <div class="mt-6" v-if="meta">
      <pagination-links :meta="meta" @page="load($event)" />
    </div>
  </div>
  <app-footer />
</div>`},_v={name:"RateAlerts",data(){return{alerts:[],loading:!0,form:{target_rate:"",direction:"above",notify_once:!0},saving:!1,showForm:!1,error:null,currentRate:null}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const[e,t]=await Promise.all([this.$http.get("/rate-alerts"),this.$http.get("/exchange-rates/AUD/USD")]);this.alerts=e.data.data||[],this.currentRate=t.data.data}catch{}this.loading=!1},async addAlert(){var e,t;this.saving=!0,this.error=null;try{await this.$http.post("/rate-alerts",{from_currency:"AUD",to_currency:"USD",...this.form}),this.$toast.success("Rate alert created!"),this.showForm=!1,this.form={target_rate:"",direction:"above",notify_once:!0},await this.load()}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed."}this.saving=!1},async toggle(e){try{await this.$http.put("/rate-alerts/"+e.id,{is_active:!e.is_active}),await this.load()}catch{}},async remove(e){if(confirm("Delete this alert?"))try{await this.$http.delete("/rate-alerts/"+e),await this.load()}catch{}}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Rate Alerts</h1>
        <p v-if="currentRate" class="text-sm text-gray-500 mt-0.5">
          Current rate: <strong class="text-green-700">{{ parseFloat(currentRate.rate).toFixed(4) }}</strong> AUD/USD
        </p>
      </div>
      <button @click="showForm = !showForm"
        class="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
        <i class="fas fa-plus"></i> Add alert
      </button>
    </div>
    <!-- Add form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <h2 class="text-base font-semibold text-gray-900 mb-4">New Rate Alert</h2>
      <alert-banner v-if="error" type="error" :message="error" class="mb-3" />
      <div class="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label class="text-xs font-semibold text-gray-700 block mb-1">Target rate (AUD/USD)</label>
          <input v-model="form.target_rate" type="number" step="0.0001" min="0.0001"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
            placeholder="e.g. 0.6500">
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-700 block mb-1">Alert me when rate is</label>
          <select v-model="form.direction" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="above">Above target</option>
            <option value="below">Below target</option>
          </select>
        </div>
      </div>
      <label class="flex items-center gap-2 text-sm text-gray-700 mb-3 cursor-pointer">
        <input v-model="form.notify_once" type="checkbox" class="w-4 h-4 text-green-600 rounded">
        Notify once then deactivate
      </label>
      <div class="flex gap-2">
        <button @click="addAlert" :disabled="saving || !form.target_rate"
          class="flex-1 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-1"></i>Create alert
        </button>
        <button @click="showForm = false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
      </div>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="alerts.length" class="space-y-3">
      <div v-for="a in alerts" :key="a.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-gray-900">
              AUD/USD {{ a.direction === 'above' ? 'rises above' : 'drops below' }}
              <span class="text-green-700">{{ parseFloat(a.target_rate).toFixed(4) }}</span>
            </p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ a.is_active ? 'Active' : 'Inactive' }}
              <span v-if="a.triggered_at"> &middot; Triggered {{ $fmt.date(a.triggered_at) }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="toggle(a)" :class="['relative inline-flex w-10 h-5 rounded-full transition-colors', a.is_active ? 'bg-green-600' : 'bg-gray-200']">
              <span :class="['absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', a.is_active ? 'translate-x-5' : 'translate-x-0']"></span>
            </button>
            <button @click="remove(a.id)" class="text-red-400 hover:text-red-600 p-1"><i class="fas fa-trash text-xs"></i></button>
          </div>
        </div>
      </div>
    </div>
    <empty-state v-else icon="fa-chart-line" title="No rate alerts" subtitle="Create an alert to be notified when the AUD/USD rate reaches your target." />
  </div>
  <app-footer />
</div>`},kv={name:"Recipients",data(){return{recipients:[],loading:!0,showForm:!1,form:{nickname:"",recipient_name:"",recipient_phone:"",delivery_location_id:"",delivery_address:"",delivery_notes:""},locations:[],saving:!1,error:null}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const[e,t]=await Promise.all([this.$http.get("/recipients"),this.$http.get("/countries/2/locations")]);this.recipients=e.data.data||[];const s=t.data.data||[];this.locations=Array.isArray(s)?s:s.flat?s.flat():[]}catch{}this.loading=!1},async save(){var e,t;this.saving=!0,this.error=null;try{await this.$http.post("/recipients",{...this.form,delivery_location_id:parseInt(this.form.delivery_location_id)}),this.$toast.success("Recipient saved."),this.showForm=!1,this.form={nickname:"",recipient_name:"",recipient_phone:"",delivery_location_id:"",delivery_address:"",delivery_notes:""},await this.load()}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed."}this.saving=!1},async remove(e){if(confirm("Delete this recipient?"))try{await this.$http.delete("/recipients/"+e),await this.load()}catch{}},async toggleFav(e){try{await this.$http.put("/recipients/"+e.id,{is_favourite:!e.is_favourite}),await this.load()}catch{}}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Saved Recipients</h1>
        <p class="text-sm text-gray-500 mt-0.5">Zimbabwe recipients you send to regularly</p>
      </div>
      <button @click="showForm = !showForm" class="flex items-center gap-2 px-4 py-2 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
        <i class="fas fa-plus"></i> Add recipient
      </button>
    </div>
    <!-- Form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <h2 class="text-base font-semibold text-gray-900 mb-4">New Recipient</h2>
      <alert-banner v-if="error" type="error" :message="error" class="mb-3" />
      <div class="space-y-3">
        <div>
          <label class="text-xs font-semibold text-gray-700 block mb-1">Nickname (for you)</label>
          <input v-model="form.nickname" type="text" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="e.g. Mum, Brother James">
        </div>
        <div class="grid sm:grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-semibold text-gray-700 block mb-1">Full name <span class="text-red-500">*</span></label>
            <input v-model="form.recipient_name" type="text" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="e.g. Chido Moyo">
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-700 block mb-1">Phone <span class="text-red-500">*</span></label>
            <input v-model="form.recipient_phone" type="tel" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="+263 77...">
          </div>
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-700 block mb-1">City <span class="text-red-500">*</span></label>
          <select v-model="form.delivery_location_id" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="">Select city...</option>
            <option v-for="l in locations" :key="l.id" :value="l.id">{{ l.name }}</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-700 block mb-1">Address / notes</label>
          <input v-model="form.delivery_address" type="text" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500" placeholder="Area or delivery notes">
        </div>
        <div class="flex gap-2">
          <button @click="save" :disabled="saving || !form.recipient_name || !form.recipient_phone || !form.delivery_location_id"
            class="flex-1 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors">
            <i v-if="saving" class="fas fa-spinner fa-spin mr-1"></i>Save recipient
          </button>
          <button @click="showForm=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="recipients.length" class="space-y-3">
      <div v-for="r in recipients" :key="r.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
              {{ r.nickname ? r.nickname[0].toUpperCase() : r.recipient_name[0].toUpperCase() }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="font-semibold text-gray-900">{{ r.nickname || r.recipient_name }}</p>
                <span v-if="r.is_favourite" class="text-yellow-500 text-xs"><i class="fas fa-star"></i></span>
              </div>
              <p class="text-sm text-gray-600">{{ r.recipient_name }} &middot; {{ r.recipient_phone }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                <i class="fas fa-map-marker-alt text-green-600 mr-1"></i>
                {{ r.delivery_location?.name || 'Unknown city' }}
                <span v-if="r.delivery_address"> &middot; {{ r.delivery_address }}</span>
              </p>
            </div>
          </div>
          <div class="flex gap-1 flex-shrink-0">
            <button @click="toggleFav(r)" :class="['p-1.5 rounded-lg hover:bg-gray-100 transition-colors', r.is_favourite ? 'text-yellow-500' : 'text-gray-400']">
              <i class="fas fa-star text-sm"></i>
            </button>
            <button @click="remove(r.id)" class="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
              <i class="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <empty-state v-else icon="fa-address-book" title="No saved recipients"
      subtitle="Save your Zimbabwe contacts to fill orders faster next time." />
  </div>
  <app-footer />
</div>`},Sv={name:"Contacts",data(){return{contacts:[],loading:!0,search:"",searching:!1,results:[],query:""}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/contacts");this.contacts=e.data||[]}catch{}this.loading=!1},async searchUsers(){if(this.query.trim()){this.searching=!0;try{const{data:e}=await this.$http.get("/directory",{params:{search:this.query,per_page:5}});this.results=e.data||[]}catch{}this.searching=!1}},async add(e){var t,s;try{await this.$http.post("/contacts",{trusted_user_ulid:e}),this.$toast.success("Added to trusted contacts."),this.results=[],this.query="",await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed.")}},async remove(e){if(confirm("Remove this contact?"))try{await this.$http.delete("/contacts/"+e),await this.load()}catch{}}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Trusted Contacts</h1>
    <p class="text-sm text-gray-500 mb-6">Members you trust. Their orders appear highlighted when you browse.</p>
    <!-- Search to add -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <h2 class="text-base font-semibold text-gray-900 mb-3">Add a trusted contact</h2>
      <div class="flex gap-2">
        <input v-model="query" @keyup.enter="searchUsers" type="text"
          class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          placeholder="Search by name...">
        <button @click="searchUsers" :disabled="searching" class="px-4 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors">
          <i v-if="searching" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-search"></i>
        </button>
      </div>
      <div v-if="results.length" class="mt-3 space-y-2">
        <div v-for="r in results" :key="r.ulid" class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ r.display_name }}</p>
            <p class="text-xs text-gray-500">{{ r.total_trades }} trades &middot; {{ r.rating ? parseFloat(r.rating).toFixed(1) + ' rating' : 'No ratings yet' }}</p>
          </div>
          <button @click="add(r.ulid)" class="text-xs text-green-700 font-semibold hover:underline">Add</button>
        </div>
      </div>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="contacts.length" class="space-y-3">
      <div v-for="c in contacts" :key="c.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <user-avatar :user="c.trusted_user" size="md" />
          <div>
            <p class="font-semibold text-gray-900 text-sm">{{ c.trusted_user?.display_name || 'Unknown' }}</p>
            <p class="text-xs text-gray-500">Added {{ $fmt.date(c.added_at) }}</p>
            <p v-if="c.note" class="text-xs text-gray-400 italic mt-0.5">{{ c.note }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <router-link :to="'/users/' + (c.trusted_user?.ulid || '')"
            class="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">View</router-link>
          <button @click="remove(c.id)" class="px-2.5 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50">Remove</button>
        </div>
      </div>
    </div>
    <empty-state v-else icon="fa-user-friends" title="No trusted contacts"
      subtitle="Add members you have traded with before. Their orders will be highlighted when you browse." />
  </div>
  <app-footer />
</div>`},$v={name:"Templates",data(){return{templates:[],loading:!0}},async mounted(){try{const{data:e}=await this.$http.get("/templates");this.templates=e.data||[]}catch{}this.loading=!1},methods:{async useTemplate(e){var t,s;try{const{data:r}=await this.$http.post("/templates/"+e+"/use");this.$toast.success("Order created from template!"),this.$router.push("/orders/"+r.data.ulid)}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed.")}},async remove(e){if(confirm("Delete this template?"))try{await this.$http.delete("/templates/"+e),this.templates=this.templates.filter(t=>t.id!==e)}catch{}}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Order Templates</h1>
        <p class="text-sm text-gray-500 mt-0.5">Saved order configurations for one-tap reuse</p>
      </div>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="templates.length" class="space-y-3">
      <div v-for="t in templates" :key="t.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-bold text-gray-900">{{ t.name }}</p>
            <p class="text-sm text-gray-600 mt-0.5">{{ $fmt.aud(t.amount_aud) }} &middot; {{ t.order_type === 'send_to_zim' ? 'Send to ZIM' : 'Receive from ZIM' }}</p>
            <p v-if="t.saved_recipient" class="text-xs text-gray-400 mt-0.5">Recipient: {{ t.saved_recipient.nickname }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Used {{ t.use_count }} times<span v-if="t.last_used_at"> &middot; Last: {{ $fmt.date(t.last_used_at) }}</span></p>
          </div>
          <div class="flex gap-2">
            <button @click="useTemplate(t.id)"
              class="px-3 py-1.5 bg-green-700 text-white text-xs font-semibold rounded-xl hover:bg-green-800 transition-colors">
              Use now
            </button>
            <button @click="remove(t.id)" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <i class="fas fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-layer-group text-gray-400 text-2xl"></i>
      </div>
      <h3 class="font-semibold text-gray-900 mb-2">No templates yet</h3>
      <p class="text-sm text-gray-500 mb-5">Templates are created automatically when you check "Save as template" during order creation.</p>
      <router-link to="/orders/create" class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
        <i class="fas fa-plus"></i> Create your first order
      </router-link>
    </div>
  </div>
  <app-footer />
</div>`},Av={name:"Recurring",data(){return{orders:[],loading:!0}},async mounted(){try{const{data:e}=await this.$http.get("/recurring");this.orders=e.data||[]}catch{}this.loading=!1},methods:{async toggle(e,t){try{await this.$http.post("/recurring/"+e+"/"+(t?"resume":"pause")),await this.refresh()}catch{this.$toast.error("Failed.")}},async remove(e){if(confirm("Stop this recurring order?"))try{await this.$http.delete("/recurring/"+e),this.orders=this.orders.filter(t=>t.id!==e)}catch{}},async refresh(){try{const{data:e}=await this.$http.get("/recurring");this.orders=e.data||[]}catch{}}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Recurring Orders</h1>
      <p class="text-sm text-gray-500 mt-0.5">Automatically create orders on a schedule</p>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else-if="orders.length" class="space-y-3">
      <div v-for="o in orders" :key="o.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <p class="font-bold text-gray-900">{{ o.order_template?.name }}</p>
              <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', o.paused_at ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700']">
                {{ o.paused_at ? 'Paused' : 'Active' }}
              </span>
            </div>
            <p class="text-sm text-gray-600 capitalize">{{ o.frequency }} &middot; {{ o.run_count }} runs so far</p>
            <p class="text-xs text-gray-400 mt-0.5">Next run: {{ $fmt.date(o.next_run_at) }}</p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button @click="toggle(o.id, !!o.paused_at)"
              :class="['px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors',
                o.paused_at ? 'border-green-200 text-green-700 hover:bg-green-50' : 'border-orange-200 text-orange-600 hover:bg-orange-50']">
              {{ o.paused_at ? 'Resume' : 'Pause' }}
            </button>
            <button @click="remove(o.id)" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <i class="fas fa-trash text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
      <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-calendar-check text-gray-400 text-2xl"></i>
      </div>
      <h3 class="font-semibold text-gray-900 mb-2">No recurring orders</h3>
      <p class="text-sm text-gray-500 mb-5">Set up recurring orders to automatically send money to Zimbabwe every week, fortnight, or month.</p>
      <router-link to="/templates" class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors">
        <i class="fas fa-layer-group"></i> Set up via templates
      </router-link>
    </div>
  </div>
  <app-footer />
</div>`},Cv={name:"Referral",data(){return{user:null,referrals:[],loading:!0,copied:!1}},computed:{referralLink(){return this.user?window.location.origin+"/register?ref="+this.user.referral_code:""},qualifiedCount(){return this.referrals.filter(e=>e.status==="qualified"||e.status==="rewarded").length}},async mounted(){try{const[e,t]=await Promise.all([this.$http.get("/user"),this.$http.get("/user/referrals").catch(()=>({data:{data:[]}}))]);this.user=e.data.data,this.referrals=t.data.data||[]}catch{}this.loading=!1},methods:{copy(){navigator.clipboard.writeText(this.referralLink),this.copied=!0,setTimeout(()=>this.copied=!1,2e3)}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Refer a Friend</h1>
    <p class="text-gray-500 text-sm mb-6">
      Invite friends to eZimConnect. When they complete their first trade,
      you both get <strong>50% off</strong> the platform fee on your next trade.
    </p>

    <loading-spinner v-if="loading" />

    <div v-else class="space-y-6">

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-gray-900">{{ user?.referral_count || 0 }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Total referrals</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-green-700">{{ qualifiedCount }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Qualified</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-gray-900">{{ $fmt.aud(user?.referral_earnings_aud || 0) }}</p>
          <p class="text-xs text-gray-500 mt-0.5">Earned</p>
        </div>
      </div>

      <!-- Referral link -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 class="text-base font-semibold text-gray-900 mb-3">Your referral link</h2>
        <div class="flex gap-2">
          <input :value="referralLink" readonly
            class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none"
            @click="$event.target.select()">
          <button @click="copy"
            :class="['px-4 py-3 rounded-xl text-sm font-semibold transition flex-shrink-0',
              copied ? 'bg-green-700 text-white' : 'bg-gray-900 text-white hover:bg-gray-800']">
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          Referral code: <strong class="font-mono text-gray-600">{{ user?.referral_code }}</strong>
        </p>
      </div>

      <!-- How it works -->
      <div class="bg-green-50 border border-green-200 rounded-2xl p-5">
        <h2 class="text-base font-semibold text-green-900 mb-3">How it works</h2>
        <div class="space-y-2 text-sm text-green-800">
          <div class="flex items-start gap-2">
            <span class="w-5 h-5 bg-green-700 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <p>Share your referral link with a friend in the Australian–Zimbabwean community.</p>
          </div>
          <div class="flex items-start gap-2">
            <span class="w-5 h-5 bg-green-700 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <p>They sign up with your link and complete their first trade on eZimConnect.</p>
          </div>
          <div class="flex items-start gap-2">
            <span class="w-5 h-5 bg-green-700 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <p>Both of you receive a <strong>50% discount</strong> on the platform fee for your next trade.</p>
          </div>
        </div>
      </div>

      <!-- Referral list -->
      <div v-if="referrals.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <h2 class="text-base font-semibold text-gray-900">Your referrals</h2>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="r in referrals" :key="r.id" class="px-5 py-3 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-800">{{ r.referred?.display_name || 'Anonymous user' }}</p>
              <p class="text-xs text-gray-400">{{ $fmt.date(r.created_at) }}</p>
            </div>
            <span :class="['text-xs font-medium px-2.5 py-1 rounded-full',
              r.status === 'rewarded' ? 'bg-green-100 text-green-700' :
              r.status === 'qualified' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-500']">
              {{ r.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`},Rv={name:"Disputes",data(){return{disputes:[],loading:!0}},async mounted(){try{const{data:e}=await this.$http.get("/disputes");this.disputes=e.data||[]}catch{}this.loading=!1},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Disputes</h1>
    <loading-spinner v-if="loading" />
    <div v-else-if="disputes.length" class="space-y-3">
      <router-link v-for="d in disputes" :key="d.id" :to="'/disputes/' + d.id"
        class="block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <status-badge :status="d.status" />
              <span class="text-xs text-gray-500">{{ $fmt.date(d.created_at) }}</span>
            </div>
            <p class="text-sm text-gray-700 mt-1 line-clamp-2">{{ d.reason }}</p>
          </div>
          <i class="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0 mt-1"></i>
        </div>
      </router-link>
    </div>
    <empty-state v-else icon="fa-balance-scale" title="No disputes"
      subtitle="You have no open or closed disputes. Disputes are raised when there is a disagreement during a transaction." />
  </div>
  <app-footer />
</div>`},Tv={name:"DisputeDetail",data(){return{dispute:null,messages:[],loading:!0,message:"",sending:!1}},async mounted(){try{await this.load()}catch{}this.loading=!1},methods:{async load(){const e=this.$route.params.id,[t,s]=await Promise.all([this.$http.get("/disputes/"+e),this.$http.get("/disputes/"+e+"/messages").catch(()=>({data:{data:[]}}))]);this.dispute=t.data.data,this.messages=s.data.data||[]},async send(){var e,t;if(this.message.trim()){this.sending=!0;try{await this.$http.post("/disputes/"+this.dispute.id+"/messages",{message:this.message}),this.message="",await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed to send.")}this.sending=!1}}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-2xl mx-auto px-4 py-8">
    <router-link to="/disputes" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
      <i class="fas fa-arrow-left text-xs"></i> Disputes
    </router-link>
    <loading-spinner v-if="loading" />
    <div v-else-if="dispute" class="space-y-5">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center gap-2 mb-3 flex-wrap">
          <status-badge :status="dispute.status" />
          <span class="text-xs text-gray-500">Opened {{ $fmt.date(dispute.created_at) }}</span>
        </div>
        <h2 class="text-base font-semibold text-gray-900 mb-1">Dispute Reason</h2>
        <p class="text-sm text-gray-600">{{ dispute.reason }}</p>
        <div v-if="dispute.resolution_notes" class="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
          <p class="text-sm font-semibold text-green-800 mb-1">Resolution</p>
          <p class="text-sm text-green-700">{{ dispute.resolution_notes }}</p>
        </div>
      </div>
      <!-- Message thread -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">Message Thread</h3>
        </div>
        <div class="divide-y divide-gray-50 max-h-96 overflow-y-auto">
          <div v-for="m in messages" :key="m.id" :class="['px-5 py-4', m.is_admin_message ? 'bg-blue-50' : '']">
            <div class="flex items-center gap-2 mb-1">
              <span :class="['text-xs font-semibold', m.is_admin_message ? 'text-blue-700' : 'text-gray-700']">
                {{ m.is_admin_message ? 'eZimConnect Admin' : (m.sender?.first_name || 'You') }}
              </span>
              <span class="text-xs text-gray-400">{{ $fmt.datetime(m.created_at) }}</span>
            </div>
            <p class="text-sm text-gray-700">{{ m.message }}</p>
          </div>
          <div v-if="!messages.length" class="px-5 py-8 text-center text-sm text-gray-400">No messages yet.</div>
        </div>
        <!-- Reply -->
        <div v-if="!['resolved_sender','resolved_receiver','refunded','closed'].includes(dispute.status)" class="px-5 py-4 border-t border-gray-100">
          <div class="flex gap-2">
            <input v-model="message" @keyup.enter="send" type="text"
              class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="Type your message...">
            <button @click="send" :disabled="sending || !message.trim()"
              class="px-4 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 disabled:opacity-50 transition-colors">
              <i v-if="sending" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</div>`},Pv={name:"AdminLogin",data(){return{email:"",password:"",loading:!1,error:null}},methods:{async submit(){var e,t;this.loading=!0,this.error=null;try{const{data:s}=await this.$http.post("/../../api/v1/admin/auth/login",{email:this.email,password:this.password});this.$auth.login(s.data.token,s.data.admin),this.$router.push("/admin/dashboard")}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Invalid admin credentials."}this.loading=!1}},template:`<div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <div class="text-center mb-8">
      <div class="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-900/40">
        <i class="fas fa-shield-alt text-white text-xl"></i>
      </div>
      <h1 class="text-xl font-bold text-white">eZimConnect Admin Panel</h1>
      <p class="text-sm text-gray-500 mt-1">Authorised personnel only</p>
    </div>
    <div class="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-7">
      <alert-banner v-if="error" type="error" :message="error" class="mb-4" />
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-300 block mb-1.5">Email</label>
          <input v-model="email" type="email" @keyup.enter="submit"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            placeholder="admin@ezimconnect.com">
        </div>
        <div>
          <label class="text-sm font-medium text-gray-300 block mb-1.5">Password</label>
          <input v-model="password" type="password" @keyup.enter="submit"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            placeholder="••••••••">
        </div>
        <button @click="submit" :disabled="loading"
          class="w-full py-3.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg shadow-green-900/30">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          Sign in to Admin
        </button>
      </div>
    </div>
    <p class="text-center text-sm mt-5">
      <router-link to="/login" class="text-gray-600 hover:text-gray-400 transition-colors">
        &larr; Back to user login
      </router-link>
    </p>
  </div>
</div>`},Dv={name:"AdminDashboard",data(){return{stats:null,recentMatches:[],loading:!0}},async mounted(){try{const{data:e}=await this.$http.get("/../../api/v1/admin/dashboard");this.stats=e.data,this.recentMatches=e.data.recent_matches||[]}catch{}this.loading=!1},computed:{volumeThisMonth(){var e;return this.stats?"AUD $"+Number(((e=this.stats.volume)==null?void 0:e.this_month_aud)||0).toLocaleString():"$0"},volumeAllTime(){var e;return this.stats?"AUD $"+Number(((e=this.stats.volume)==null?void 0:e.all_time_aud)||0).toLocaleString():"$0"},revenueThisMonth(){var e;return this.stats?"AUD $"+Number(((e=this.stats.revenue)==null?void 0:e.this_month_aud)||0).toFixed(2):"0.00"},revenueAllTime(){var e;return this.stats?"AUD $"+Number(((e=this.stats.revenue)==null?void 0:e.all_time_aud)||0).toFixed(2):"0.00"},statCards(){var e,t,s,r,a,i;return this.stats?[{label:"Total Users",value:(e=this.stats.users)==null?void 0:e.total,icon:"fa-users",color:"blue",sub:(((t=this.stats.users)==null?void 0:t.new_today)||0)+" new today",to:"/admin/users"},{label:"Active Orders",value:(s=this.stats.orders)==null?void 0:s.open,icon:"fa-list-alt",color:"green",sub:(((r=this.stats.orders)==null?void 0:r.today)||0)+" today",to:"/admin/orders"},{label:"Active Matches",value:(a=this.stats.matches)==null?void 0:a.active,icon:"fa-handshake",color:"teal",sub:(((i=this.stats.matches)==null?void 0:i.completed_today)||0)+" completed today",to:"/admin/matches"},{label:"Volume This Month",value:this.volumeThisMonth,icon:"fa-dollar-sign",color:"purple",sub:"All time: "+this.volumeAllTime,to:"/admin/matches"}]:[]},activeStatusBreakdown(){var e,t;return(t=(e=this.stats)==null?void 0:e.matches)!=null&&t.status_breakdown?Object.fromEntries(Object.entries(this.stats.matches.status_breakdown).filter(([s,r])=>r>0&&!["completed","cancelled","refunded"].includes(s))):{}}},methods:{statusLabel(e){return e.replace(/_/g," ")},matchDate(e){return e.updated_at||""}},template:`
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />
  <div class="flex-1 min-w-0 lg:ml-60">
  
  <div class="max-w-7xl mx-auto px-6 py-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
      <span class="text-sm text-gray-500">
        {{ new Date().toLocaleDateString('en-AU', {weekday:'long', day:'numeric', month:'long'}) }}
      </span>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="stats">

      <!-- Urgent actions banner -->
      <div v-if="stats.pending_actions && stats.pending_actions.total_urgent > 0"
        class="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
        <div class="flex items-center gap-2 mb-3">
          <i class="fas fa-exclamation-circle text-orange-500"></i>
          <h2 class="font-semibold text-orange-900">
            {{ stats.pending_actions.total_urgent }} action(s) require your attention
          </h2>
        </div>
        <div class="flex flex-wrap gap-3">
          <router-link v-if="stats.pending_actions.deposits_to_verify > 0"
            to="/admin/deposits"
            class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-orange-200 text-sm font-medium text-orange-800 hover:bg-orange-50">
            <i class="fas fa-file-invoice-dollar"></i>
            {{ stats.pending_actions.deposits_to_verify }} deposit(s) to verify
          </router-link>
          <router-link v-if="stats.pending_actions.funds_to_release > 0"
            to="/admin/matches"
            class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-orange-200 text-sm font-medium text-orange-800 hover:bg-orange-50">
            <i class="fas fa-hand-holding-usd"></i>
            {{ stats.pending_actions.funds_to_release }} fund release(s) ready
          </router-link>
          <router-link v-if="stats.pending_actions.open_disputes > 0"
            to="/admin/disputes"
            class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-red-200 text-sm font-medium text-red-800 hover:bg-red-50">
            <i class="fas fa-exclamation-triangle"></i>
            {{ stats.pending_actions.open_disputes }} open dispute(s)
          </router-link>
          <router-link v-if="stats.pending_actions.pending_kyc > 0"
            to="/admin/users"
            class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-orange-200 text-sm font-medium text-orange-800 hover:bg-orange-50">
            <i class="fas fa-id-card"></i>
            {{ stats.pending_actions.pending_kyc }} KYC review(s)
          </router-link>
        </div>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <router-link v-for="(card, i) in statCards" :key="i" :to="card.to"
          class="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
          <div :class="'w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-' + card.color + '-100'">
            <i :class="'fas ' + card.icon + ' text-' + card.color + '-600 text-sm'"></i>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ card.value != null ? card.value : '—' }}</p>
          <p class="text-xs font-medium text-gray-600 mt-0.5">{{ card.label }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ card.sub }}</p>
        </router-link>
      </div>

      <!-- Revenue + Risk + Status -->
      <div class="grid md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-coins text-yellow-500 mr-1"></i> Fee Revenue
          </h3>
          <p class="text-2xl font-bold text-gray-900">AUD {{ revenueThisMonth }}</p>
          <p class="text-xs text-gray-500 mt-1">This month</p>
          <p class="text-sm text-gray-600 mt-2">
            All time: <strong>AUD {{ revenueAllTime }}</strong>
          </p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-flag text-red-500 mr-1"></i> Risk Flags Today
          </h3>
          <p class="text-2xl font-bold"
            :class="stats.risk && stats.risk.flagged_today > 0 ? 'text-red-600' : 'text-gray-900'">
            {{ stats.risk ? stats.risk.flagged_today : 0 }}
          </p>
          <router-link to="/admin/audit-logs"
            class="text-xs text-green-700 hover:underline mt-2 block">
            View flagged logs &rarr;
          </router-link>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-chart-bar text-blue-500 mr-1"></i> Match Status
          </h3>
          <div class="space-y-1.5">
            <div v-for="(count, status) in activeStatusBreakdown" :key="status"
              class="flex justify-between text-xs">
              <span class="text-gray-600 capitalize">{{ statusLabel(status) }}</span>
              <span class="font-semibold text-gray-900">{{ count }}</span>
            </div>
            <p v-if="Object.keys(activeStatusBreakdown).length === 0"
              class="text-xs text-gray-400">No active matches</p>
          </div>
        </div>
      </div>

      <!-- Recent matches table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-sm font-semibold text-gray-900">Recent Matches</h3>
          <router-link to="/admin/matches" class="text-xs text-green-700 hover:underline">
            View all &rarr;
          </router-link>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="m in recentMatches" :key="m.ulid"
            class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition">
            <status-badge :status="m.status" />
            <span class="font-mono text-xs text-gray-400">{{ m.ulid ? m.ulid.slice(0, 8) : '' }}</span>
            <span class="text-sm text-gray-700 flex-1">
              {{ m.agreed_aud ? $fmt.aud(m.agreed_aud) : 'Negotiating' }}
            </span>
            <span class="text-xs text-gray-400">{{ matchDate(m) }}</span>
            <router-link :to="'/admin/matches/' + m.ulid"
              class="text-xs text-green-700 hover:underline">
              View
            </router-link>
          </div>
          <div v-if="recentMatches.length === 0" class="px-5 py-6 text-center text-sm text-gray-400">
            No matches yet
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</div>`},Fv={name:"AdminUsers",data(){return{items:[],stats:{},meta:null,loading:!0,error:null,search:"",kycFilter:"",statusFilter:"",actionLoading:null}},async mounted(){await this.load()},methods:{async load(e=1){var s,r,a;this.loading=!0,this.error=null;const t={page:e};this.search&&(t.search=this.search),this.kycFilter&&(t.kyc_status=this.kycFilter),this.statusFilter&&(t.account_status=this.statusFilter);try{const{data:i}=await this.$http.get("/../../api/v1/admin/users",{params:t});this.items=i.data||[],this.stats=i.stats||{},this.meta=((s=i.meta)==null?void 0:s.pagination)||null}catch(i){this.error=((a=(r=i.response)==null?void 0:r.data)==null?void 0:a.message)||"Failed to load users"}this.loading=!1},async approveKyc(e){var t,s;this.actionLoading=e+"_kyc";try{await this.$http.put("/../../api/v1/admin/users/"+e+"/kyc/approve"),this.$toast.success("KYC approved."),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed")}this.actionLoading=null},async rejectKyc(e){var s,r;const t=prompt("Rejection reason (required):");if(t){this.actionLoading=e+"_kyc";try{await this.$http.put("/../../api/v1/admin/users/"+e+"/kyc/reject",{reason:t}),this.$toast.success("KYC rejected."),await this.load()}catch(a){this.$toast.error(((r=(s=a.response)==null?void 0:s.data)==null?void 0:r.message)||"Failed")}this.actionLoading=null}},async suspend(e){var s,r;const t=prompt("Suspension reason:");if(t){this.actionLoading=e+"_suspend";try{await this.$http.put("/../../api/v1/admin/users/"+e+"/suspend",{reason:t}),this.$toast.success("User suspended."),await this.load()}catch(a){this.$toast.error(((r=(s=a.response)==null?void 0:s.data)==null?void 0:r.message)||"Failed")}this.actionLoading=null}},kycBadge(e){return{pending:"bg-gray-100 text-gray-600",submitted:"bg-blue-100 text-blue-700",approved:"bg-green-100 text-green-700",rejected:"bg-red-100 text-red-700"}[e]||"bg-gray-100 text-gray-600"},statusBadge(e){return{active:"bg-green-100 text-green-700",suspended:"bg-orange-100 text-orange-700",banned:"bg-red-100 text-red-700"}[e]||"bg-gray-100 text-gray-600"}},template:`
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 min-w-0 lg:ml-60">
    <div class="max-w-7xl mx-auto px-6 py-6">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold text-gray-900">Users</h1>
        <span v-if="meta" class="text-sm text-gray-500">{{ meta.total }} total</span>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div class="grid sm:grid-cols-4 gap-3">
          <div class="sm:col-span-2">
            <input v-model="search" @keyup.enter="load()"
              type="text"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="Search by name, email, ULID...">
          </div>

          <select v-model="kycFilter" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="">All KYC</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select v-model="statusFilter" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">KYC</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trades</th>
                <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Trust</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-50">
              <tr v-for="user in items" :key="user.id" class="hover:bg-gray-50">
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900">{{ user.first_name }} {{ user.last_name }}</p>
                  <p class="text-xs text-gray-500">{{ user.email }}</p>
                </td>

                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-0.5 rounded-full capitalize', kycBadge(user.kyc_status)]">
                    {{ user.kyc_status }}
                  </span>
                </td>

                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-0.5 rounded-full capitalize', statusBadge(user.account_status)]">
                    {{ user.account_status }}
                  </span>
                </td>

                <td class="px-4 py-3 text-center">{{ user.successful_trades }}</td>

                <td class="px-4 py-3 text-center">
                  <span :class="user.trust_score >= 70 ? 'text-green-600' : user.trust_score >= 40 ? 'text-yellow-600' : 'text-red-500'">
                    {{ user.trust_score }}
                  </span>
                </td>

                <td class="px-4 py-3 text-xs text-gray-500">
                  {{ $fmt.date(user.created_at) }}
                </td>

                <td class="px-4 py-3">
                  <div class="flex gap-1">
                    <router-link :to="'/admin/users/' + user.id"
                      class="px-2 py-1 text-xs text-green-700 border border-green-200 rounded-lg">
                      View
                    </router-link>

                    <button v-if="user.kyc_status === 'submitted'"
                      @click="approveKyc(user.id)"
                      :disabled="actionLoading === user.id + '_kyc'"
                      class="px-2 py-1 text-xs text-white bg-green-600 rounded-lg">
                      Approve
                    </button>

                    <button v-if="user.kyc_status === 'submitted'"
                      @click="rejectKyc(user.id)"
                      class="px-2 py-1 text-xs text-red-600 border border-red-200 rounded-lg">
                      Reject
                    </button>

                    <button v-if="user.account_status === 'active'"
                      @click="suspend(user.id)"
                      class="px-2 py-1 text-xs text-orange-600 border border-orange-200 rounded-lg">
                      Suspend
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <pagination-links v-if="meta" :meta="meta" @page="load($event)" />
      </div>

    </div>
  </div>
</div>`},Ov={name:"AdminUserDetail",data(){return{user:null,documents:[],bankAccounts:[],recentMatches:[],reviews:[],loginActivity:[],badges:[],loading:!0,actionLoading:!1,activeTab:"overview",suspendForm:{reason:"",days:7},rejectForm:{reason:""},showSuspendModal:!1,showRejectModal:!1}},computed:{userId(){return this.$route.params.id}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/admin/users/"+this.userId),t=e.data;this.user=t.user,this.documents=t.documents||[],this.bankAccounts=t.bank_accounts||[],this.recentMatches=t.recent_matches||[],this.reviews=t.reviews||[],this.loginActivity=t.login_activity||[],this.badges=t.badges||[]}catch{this.$router.push("/admin/users")}this.loading=!1},async approveKyc(){var e,t;if(confirm("Approve KYC for "+this.user.first_name+"?")){this.actionLoading=!0;try{await this.$http.put("/admin/users/"+this.userId+"/kyc/approve"),this.$toast.success("KYC approved."),await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed.")}this.actionLoading=!1}},async rejectKyc(){var e,t;if(!this.rejectForm.reason){this.$toast.error("Please enter a rejection reason.");return}this.actionLoading=!0;try{await this.$http.put("/admin/users/"+this.userId+"/kyc/reject",{reason:this.rejectForm.reason}),this.$toast.success("KYC rejected."),this.showRejectModal=!1,await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed.")}this.actionLoading=!1},async suspend(){var e,t;if(!this.suspendForm.reason){this.$toast.error("Please enter a reason.");return}this.actionLoading=!0;try{await this.$http.put("/admin/users/"+this.userId+"/suspend",this.suspendForm),this.$toast.success("User suspended."),this.showSuspendModal=!1,await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed.")}this.actionLoading=!1},async unsuspend(){var e,t;if(confirm("Unsuspend this user?")){this.actionLoading=!0;try{await this.$http.put("/admin/users/"+this.userId+"/unsuspend"),this.$toast.success("User unsuspended."),await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed.")}this.actionLoading=!1}},async ban(){var e,t;if(confirm("PERMANENTLY BAN this user? This cannot be undone.")){this.actionLoading=!0;try{await this.$http.put("/admin/users/"+this.userId+"/ban"),this.$toast.success("User banned."),await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed.")}this.actionLoading=!1}},statusBadge(e){return{active:"bg-green-100 text-green-700",suspended:"bg-orange-100 text-orange-700",banned:"bg-red-100 text-red-700"}[e]||"bg-gray-100 text-gray-600"},kycBadge(e){return{approved:"bg-green-100 text-green-700",submitted:"bg-blue-100 text-blue-700",pending:"bg-gray-100 text-gray-600",rejected:"bg-red-100 text-red-700"}[e]||"bg-gray-100 text-gray-600"},matchStatusColor(e){return["completed"].includes(e)?"bg-green-100 text-green-700":["cancelled","expired","refunded","disputed"].includes(e)?"bg-red-100 text-red-700":"bg-blue-100 text-blue-700"}},template:`
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />

  <!-- Suspend modal -->
  <div v-if="showSuspendModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 class="font-bold text-gray-900 mb-4">Suspend account</h3>
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Reason <span class="text-red-500">*</span></label>
          <input v-model="suspendForm.reason" type="text" placeholder="e.g. Suspicious activity"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Duration (days)</label>
          <input v-model.number="suspendForm.days" type="number" min="1" max="365"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="suspend" :disabled="actionLoading" class="flex-1 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50">
            <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>Suspend
          </button>
          <button @click="showSuspendModal=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Reject KYC modal -->
  <div v-if="showRejectModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 class="font-bold text-gray-900 mb-4">Reject KYC</h3>
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Reason for rejection <span class="text-red-500">*</span></label>
          <textarea v-model="rejectForm.reason" rows="3" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-red-400"
            placeholder="e.g. Photo is blurry — please resubmit a clearer ID photo"></textarea>
        </div>
        <div class="flex gap-2">
          <button @click="rejectKyc" :disabled="actionLoading" class="flex-1 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 disabled:opacity-50">
            <i v-if="actionLoading" class="fas fa-spinner fa-spin mr-1"></i>Reject KYC
          </button>
          <button @click="showRejectModal=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4 py-6">
    <div class="flex items-center gap-2 mb-5 text-sm">
      <router-link to="/admin/users" class="text-gray-500 hover:text-gray-700 flex items-center gap-1">
        <i class="fas fa-arrow-left text-xs"></i> Users
      </router-link>
      <span class="text-gray-300">/</span>
      <span v-if="user" class="text-gray-700 font-medium">{{ user.first_name }} {{ user.last_name }}</span>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="user" class="space-y-5">

      <!-- Header card -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="flex items-start gap-4">
            <!-- Avatar -->
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0"
              style="background:linear-gradient(135deg,#1a6b3c,#2d9460)">
              {{ user.first_name ? user.first_name[0].toUpperCase() : '?' }}
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h1 class="text-xl font-black text-gray-900">{{ user.first_name }} {{ user.last_name }}</h1>
                <span v-if="user.is_verified_business" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  <i class="fas fa-check-circle mr-0.5"></i>Business
                </span>
              </div>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
              <p class="text-sm text-gray-400">{{ user.phone }}</p>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span :class="['text-xs px-2.5 py-1 rounded-full font-bold', statusBadge(user.account_status)]">
                  {{ user.account_status }}
                </span>
                <span :class="['text-xs px-2.5 py-1 rounded-full font-bold', kycBadge(user.kyc_status)]">
                  KYC: {{ user.kyc_status }}
                </span>
                <span class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
                  Trust: {{ user.trust_score }}
                </span>
                <span class="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">
                  {{ user.account_type || 'personal' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-wrap gap-2">
            <template v-if="user.kyc_status === 'submitted'">
              <button @click="approveKyc" :disabled="actionLoading"
                class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50">
                <i class="fas fa-check"></i> Approve KYC
              </button>
              <button @click="showRejectModal=true"
                class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-red-500 text-white rounded-xl hover:bg-red-600">
                <i class="fas fa-times"></i> Reject KYC
              </button>
            </template>
            <button v-if="user.account_status === 'active'" @click="showSuspendModal=true"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600">
              <i class="fas fa-pause"></i> Suspend
            </button>
            <button v-if="user.account_status === 'suspended'" @click="unsuspend" :disabled="actionLoading"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50">
              <i class="fas fa-play"></i> Unsuspend
            </button>
            <button v-if="user.account_status !== 'banned'" @click="ban" :disabled="actionLoading"
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-red-800 text-white rounded-xl hover:bg-red-900 disabled:opacity-50">
              <i class="fas fa-ban"></i> Ban
            </button>
          </div>
        </div>

        <!-- Suspension info -->
        <div v-if="user.account_status === 'suspended' && user.suspension_reason"
          class="mt-4 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 text-sm text-orange-800">
          <i class="fas fa-exclamation-triangle mr-1.5"></i>
          <strong>Suspended:</strong> {{ user.suspension_reason }}
          <span v-if="user.account_suspended_until"> · Until {{ $fmt.date(user.account_suspended_until) }}</span>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="s in [
          {l:'Total Trades',     v: user.total_trades},
          {l:'Successful',       v: user.successful_trades},
          {l:'Rating',           v: user.rating ? parseFloat(user.rating).toFixed(1) + ' ★' : '—'},
          {l:'Trust Score',      v: user.trust_score},
        ]" :key="s.l" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center">
          <p class="text-2xl font-black text-gray-900 mb-0.5">{{ s.v }}</p>
          <p class="text-xs text-gray-500">{{ s.l }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-white rounded-2xl border border-gray-200 p-1 shadow-sm overflow-x-auto">
        <button v-for="tab in [
          {k:'overview',  l:'Overview'},
          {k:'kyc',       l:'KYC Docs (' + documents.length + ')'},
          {k:'bank',      l:'Bank Accounts'},
          {k:'matches',   l:'Matches (' + recentMatches.length + ')'},
          {k:'reviews',   l:'Reviews (' + reviews.length + ')'},
          {k:'activity',  l:'Login Activity'},
        ]" :key="tab.k" @click="activeTab = tab.k"
          :class="['flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap',
            activeTab === tab.k
              ? 'text-white'
              : 'text-gray-600 hover:bg-gray-50']"
          :style="activeTab === tab.k ? 'background:linear-gradient(135deg,#1a6b3c,#2d9460)' : ''">
          {{ tab.l }}
        </button>
      </div>

      <!-- Overview tab -->
      <div v-if="activeTab === 'overview'" class="grid sm:grid-cols-2 gap-5">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-user text-green-600"></i> Account Details
          </h3>
          <div class="space-y-2.5">
            <div v-for="row in [
              ['User ID',           '#' + user.id],
              ['Country',           user.country || '—'],
              ['Last seen',         user.last_seen || '—'],
              ['Last login',        user.last_login_at ? $fmt.date(user.last_login_at) : '—'],
              ['Member since',      $fmt.date(user.created_at)],
              ['Referral code',     user.referral_code || '—'],
              ['Referrals made',    user.referral_count || 0],
              ['Business name',     user.business_name || '—'],
              ['Reports against',   user.report_count || 0],
            ]" :key="row[0]" class="flex items-center justify-between gap-2 text-sm">
              <span class="text-gray-500">{{ row[0] }}</span>
              <span class="font-semibold text-gray-800 text-right">{{ row[1] }}</span>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-shield-alt text-green-600"></i> Verification Status
          </h3>
          <div class="space-y-2.5 text-sm">
            <div v-for="row in [
              ['Email verified',   user.email_verified],
              ['Phone verified',   user.phone_verified],
              ['2FA enabled',      user.two_fa_enabled],
              ['PIN set',          user.pin_set],
              ['Onboarding done',  user.onboarding_completed],
            ]" :key="row[0]" class="flex items-center justify-between gap-2">
              <span class="text-gray-500">{{ row[0] }}</span>
              <span :class="row[1] ? 'text-green-600 font-bold' : 'text-gray-400'">
                <i :class="row[1] ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                {{ row[1] ? 'Yes' : 'No' }}
              </span>
            </div>
          </div>
          <!-- Badges -->
          <div v-if="badges.length" class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs font-bold text-gray-500 mb-2">BADGES EARNED</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="b in badges" :key="b.badge_key"
                class="flex items-center gap-1 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 px-2 py-1 rounded-full"
                :title="b.badge_name">
                {{ b.badge_icon }} {{ b.badge_name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- KYC Documents tab -->
      <div v-if="activeTab === 'kyc'">
        <div v-if="documents.length" class="space-y-3">
          <div v-for="doc in documents" :key="doc.id"
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-id-card text-gray-500"></i>
              </div>
              <div>
                <p class="font-semibold text-gray-900 text-sm capitalize">{{ doc.document_type.replace(/_/g,' ') }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', kycBadge(doc.status)]">
                    {{ doc.status }}
                  </span>
                  <span class="text-xs text-gray-400">{{ $fmt.date(doc.created_at) }}</span>
                </div>
                <p v-if="doc.rejection_reason" class="text-xs text-red-500 mt-0.5">{{ doc.rejection_reason }}</p>
              </div>
            </div>
            <a :href="doc.file_url" target="_blank"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50">
              <i class="fas fa-eye"></i> View
            </a>
          </div>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No KYC documents uploaded yet.
        </div>
      </div>

      <!-- Bank Accounts tab -->
      <div v-if="activeTab === 'bank'">
        <div v-if="bankAccounts.length" class="space-y-3">
          <div v-for="acc in bankAccounts" :key="acc.id"
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-university text-blue-600"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="font-semibold text-gray-900 text-sm">{{ acc.bank_name }}</p>
                  <span v-if="acc.is_primary" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Primary</span>
                  <span v-if="acc.is_verified" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
                </div>
                <p class="text-sm text-gray-600">{{ acc.account_name }}</p>
                <p class="text-xs text-gray-400">
                  <span v-if="acc.bsb_code">BSB {{ acc.bsb_code }} · </span>
                  ····{{ acc.account_number }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No bank accounts on file.
        </div>
      </div>

      <!-- Matches tab -->
      <div v-if="activeTab === 'matches'">
        <div v-if="recentMatches.length" class="space-y-2.5">
          <div v-for="m in recentMatches" :key="m.ulid"
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span :class="['text-xs px-2 py-0.5 rounded-full font-semibold', matchStatusColor(m.status)]">
                  {{ m.status.replace(/_/g,' ') }}
                </span>
                <span class="text-xs text-gray-400">{{ $fmt.date(m.created_at) }}</span>
              </div>
              <p class="font-bold text-gray-900 text-sm">
                {{ m.agreed_aud ? 'AUD ' + parseFloat(m.agreed_aud).toFixed(2) : 'AUD —' }}
                → {{ m.agreed_usd ? 'USD ' + parseFloat(m.agreed_usd).toFixed(2) : 'USD —' }}
              </p>
            </div>
            <router-link :to="'/admin/matches/' + m.ulid"
              class="text-xs text-green-700 font-semibold hover:underline flex-shrink-0">
              View →
            </router-link>
          </div>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No recent matches.
        </div>
      </div>

      <!-- Reviews tab -->
      <div v-if="activeTab === 'reviews'">
        <div v-if="reviews.length" class="space-y-3">
          <div v-for="(r, i) in reviews" :key="i"
            class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-1">
                <i v-for="s in 5" :key="s"
                  :class="['fas fa-star text-sm', s <= r.score ? 'text-yellow-400' : 'text-gray-200']"></i>
                <span class="text-sm font-bold text-gray-700 ml-1">{{ r.score }}/5</span>
              </div>
              <span class="text-xs text-gray-400">{{ $fmt.date(r.created_at) }}</span>
            </div>
            <p v-if="r.review_text" class="text-sm text-gray-600 italic">"{{ r.review_text }}"</p>
            <p class="text-xs text-gray-400 mt-1">by {{ r.reviewer }}</p>
          </div>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No reviews yet.
        </div>
      </div>

      <!-- Login Activity tab -->
      <div v-if="activeTab === 'activity'">
        <div v-if="loginActivity.length" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">IP Address</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Location</th>
                <th class="text-left py-3 px-4 font-semibold text-gray-600">Device</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(l, i) in loginActivity" :key="i" class="hover:bg-gray-50">
                <td class="py-3 px-4 text-gray-600">{{ $fmt.date(l.login_at) }}</td>
                <td class="py-3 px-4 font-mono text-xs text-gray-700">{{ l.ip_address }}</td>
                <td class="py-3 px-4 text-gray-600">{{ l.location || '—' }}</td>
                <td class="py-3 px-4">
                  <span class="text-gray-500 capitalize">{{ l.device_type || '—' }}</span>
                  <span v-if="l.is_new_device" class="ml-1.5 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium">New device</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center text-gray-400 text-sm">
          No login activity recorded.
        </div>
      </div>

    </div><!-- end user div -->
  </div>
</div>`},Ev={name:"AdminMatches",data(){return{items:[],meta:null,loading:!0,error:null,statusFilter:""}},async mounted(){await this.load()},watch:{statusFilter(){this.load()}},methods:{async load(e=1){var s,r,a;this.loading=!0,this.error=null;const t={page:e};this.statusFilter&&(t.status=this.statusFilter);try{const{data:i}=await this.$http.get("/../../api/v1/admin/matches",{params:t});this.items=i.data||[],this.meta=((s=i.meta)==null?void 0:s.pagination)||null}catch(i){this.error=((a=(r=i.response)==null?void 0:r.data)==null?void 0:a.message)||"Failed to load matches"}this.loading=!1},urgencyClass(e){return["deposit_uploaded","risk_deposit_uploaded"].includes(e.status)?"border-l-4 border-l-blue-500":["confirmed","risk_deposit_verified"].includes(e.status)?"border-l-4 border-l-green-500":e.status==="disputed"?"border-l-4 border-l-red-500":""}},template:`
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 min-w-0 lg:ml-60">
    <div class="max-w-7xl mx-auto px-6 py-6">

      <div class="flex items-center justify-between mb-5">
        <h1 class="text-xl font-bold">Matches</h1>
        <select v-model="statusFilter" class="px-3 py-2 border rounded-xl text-sm">
          <option value="">All statuses</option>
          <option value="deposit_uploaded">Deposit uploaded</option>
          <option value="risk_deposit_uploaded">Risk deposit uploaded</option>
          <option value="confirmed">Ready to release</option>
          <option value="risk_deposit_verified">Risk ready</option>
          <option value="disputed">Disputed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div class="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-4 py-3 text-left text-xs">Match</th>
                <th class="px-4 py-3 text-left text-xs">Status</th>
                <th class="px-4 py-3 text-right text-xs">AUD</th>
                <th class="px-4 py-3 text-left text-xs">Sender</th>
                <th class="px-4 py-3 text-left text-xs">Receiver</th>
                <th class="px-4 py-3 text-left text-xs">Location</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="m in items" :key="m.ulid" :class="['hover:bg-gray-50', urgencyClass(m)]">
                <td class="px-4 py-3">
                  <p class="font-mono text-xs">{{ m.ulid?.slice(0,12) }}</p>
                  <p class="text-xs text-gray-400">{{ $fmt.date(m.created_at) }}</p>
                </td>

                <td class="px-4 py-3">
                  <status-badge :status="m.status" />
                </td>

                <td class="px-4 py-3 text-right font-semibold">
                  {{ m.agreed_aud ? $fmt.aud(m.agreed_aud) : '—' }}
                </td>

                <td class="px-4 py-3 text-xs">{{ m.sender?.name }}</td>
                <td class="px-4 py-3 text-xs">{{ m.receiver?.name }}</td>
                <td class="px-4 py-3 text-xs">{{ m.location?.name }}</td>

                <td class="px-4 py-3">
                  <router-link :to="'/admin/matches/' + m.ulid"
                    class="px-3 py-1 text-xs border rounded-lg text-green-700">
                    View
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!items.length" class="text-center py-10 text-gray-400">
            No matches found
          </div>
        </div>

        <pagination-links v-if="meta" :meta="meta" @page="load($event)" />
      </div>

    </div>
  </div>
</div>`},Lv={name:"AdminMatchDetail",data(){return{match:null,loading:!0,actionLoading:!1,error:null}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/../../api/v1/admin/matches/"+this.$route.params.ulid);this.match=e.data}catch{this.$router.push("/admin/matches")}this.loading=!1},async verifyDeposit(){var e,t;if(confirm("Confirm AUD deposit has arrived in the eZimConnect bank account?")){this.actionLoading=!0;try{await this.$http.put("/../../api/v1/admin/matches/"+this.match.ulid+"/verify-deposit"),this.$toast.success("Deposit verified. Deliverer notified."),await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed")}this.actionLoading=!1}},async releaseFunds(){var e,t;if(confirm("Confirm you have sent AUD to the receiver's bank account?")){this.actionLoading=!0;try{await this.$http.put("/../../api/v1/admin/matches/"+this.match.ulid+"/release-funds"),this.$toast.success("Funds released. Transaction completed!"),await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed")}this.actionLoading=!1}},async refund(){var t,s;const e=prompt("Reason for refund:");if(e){this.actionLoading=!0;try{await this.$http.put("/../../api/v1/admin/matches/"+this.match.ulid+"/refund",{reason:e}),this.$toast.success("Refund processed."),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed")}this.actionLoading=!1}},async forceCancel(){var t,s;const e=prompt("Reason for force-cancelling:");if(e){this.actionLoading=!0;try{await this.$http.put("/../../api/v1/admin/matches/"+this.match.ulid+"/force-cancel",{reason:e}),this.$toast.success("Match force-cancelled."),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed")}this.actionLoading=!1}}},template:`<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />
  <div class="flex-1 min-w-0 lg:ml-60">
  <div class="bg-white border-b px-6 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
    <router-link to="/admin/matches" class="text-gray-400 hover:text-gray-700"><i class="fas fa-arrow-left"></i></router-link>
    <div class="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center">
      <span class="text-white font-bold text-xs">Tu</span>
    </div>
    <span class="font-bold text-gray-900">eZimConnect <span class="text-green-600 text-sm">Admin</span></span>
    <span class="text-gray-400 mx-1">›</span>
    <span class="text-sm text-gray-600">Match Detail</span>
  </div>

  <div class="max-w-6xl mx-auto px-6 py-6">
    <loading-spinner v-if="loading" />
    <div v-else-if="match" class="grid md:grid-cols-3 gap-6">

      <!-- Left: Summary + Actions -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-3">
            <status-badge :status="match.status" />
            <span class="font-mono text-xs text-gray-400">{{ match.ulid?.slice(0,12) }}</span>
          </div>
          <p class="text-2xl font-bold text-gray-900">{{ match.agreed_aud ? $fmt.aud(match.agreed_aud) : 'Negotiating' }}</p>
          <p v-if="match.agreed_usd" class="text-sm text-gray-500">↔ {{ $fmt.usd(match.agreed_usd) }}</p>
          <div class="mt-3 text-sm space-y-1.5">
            <div class="flex justify-between"><span class="text-gray-500">Delivery</span><span class="font-medium capitalize">{{ match.delivery_method }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Fee</span><span>{{ match.platform_fee_aud ? $fmt.aud(match.platform_fee_aud) : '—' }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Ref</span><span class="font-mono text-xs">{{ match.deposit_reference }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Location</span><span>{{ match.location?.name }}</span></div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Admin Actions</h3>

          <button v-if="match.available_actions?.can_verify_deposit"
            @click="verifyDeposit" :disabled="actionLoading"
            class="w-full py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
            <i class="fas fa-check mr-1"></i> Verify Deposit
          </button>

          <button v-if="match.available_actions?.can_release_funds"
            @click="releaseFunds" :disabled="actionLoading"
            class="w-full py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50 transition">
            <i class="fas fa-hand-holding-usd mr-1"></i> Release Funds
          </button>

          <button v-if="match.available_actions?.can_refund"
            @click="refund" :disabled="actionLoading"
            class="w-full py-2.5 text-sm font-medium border border-orange-300 text-orange-700 rounded-xl hover:bg-orange-50">
            <i class="fas fa-undo mr-1"></i> Refund to Sender
          </button>

          <button v-if="match.available_actions?.can_force_cancel"
            @click="forceCancel" :disabled="actionLoading"
            class="w-full py-2.5 text-sm font-medium border border-red-200 text-red-600 rounded-xl hover:bg-red-50">
            <i class="fas fa-times mr-1"></i> Force Cancel
          </button>
        </div>

        <!-- Parties -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Parties</h3>
          <div v-if="match.sender" class="mb-3 pb-3 border-b border-gray-50">
            <p class="text-xs text-gray-400 mb-0.5">Sender (AUD depositor)</p>
            <p class="text-sm font-medium text-gray-900">{{ match.sender.name }}</p>
            <p class="text-xs text-gray-500">{{ match.sender.email }}</p>
            <router-link :to="'/admin/users/'+match.sender.id" class="text-xs text-green-700 hover:underline">View profile →</router-link>
          </div>
          <div v-if="match.receiver">
            <p class="text-xs text-gray-400 mb-0.5">Receiver (cash deliverer)</p>
            <p class="text-sm font-medium text-gray-900">{{ match.receiver.name }}</p>
            <p class="text-xs text-gray-500">{{ match.receiver.email }}</p>
            <router-link :to="'/admin/users/'+match.receiver.id" class="text-xs text-green-700 hover:underline">View profile →</router-link>
          </div>
        </div>
      </div>

      <!-- Right: Details -->
      <div class="md:col-span-2 space-y-5">

        <!-- Deposit proof -->
        <div v-if="match.deposit" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-file-invoice-dollar text-blue-600"></i> Deposit Proof
          </h3>
          <div class="flex items-center justify-between text-sm mb-3">
            <span class="text-gray-600">Status</span>
            <span :class="['font-semibold capitalize', match.deposit.status==='verified'?'text-green-700':match.deposit.status==='pending'?'text-yellow-600':'text-gray-700']">
              {{ match.deposit.status }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm mb-3">
            <span class="text-gray-600">Amount</span><span class="font-medium">{{ $fmt.aud(match.deposit.amount_aud) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm mb-3">
            <span class="text-gray-600">Our reference</span>
            <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{{ match.deposit.our_bank_reference }}</span>
          </div>
          <div class="flex items-center justify-between text-sm mb-4">
            <span class="text-gray-600">Their reference</span>
            <span class="text-gray-800">{{ match.deposit.depositor_reference || '—' }}</span>
          </div>
          <a v-if="match.deposit.proof_url" :href="match.deposit.proof_url" target="_blank"
            class="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">
            <i class="fas fa-image text-blue-500"></i> View Proof Image
          </a>
        </div>

        <!-- Delivery proof — two photos side by side -->
        <div v-if="match.delivery" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-money-bill-wave text-green-600"></i> Delivery Proof
            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal ml-1">
              Agreed: {{ $fmt.usd(match.delivery.amount_usd) }}
            </span>
          </h3>
          <div class="text-sm space-y-1.5 mb-4">
            <div class="flex justify-between"><span class="text-gray-500">Status</span>
              <span :class="['font-semibold capitalize', match.delivery.status==='confirmed'?'text-green-700':'text-yellow-600']">{{ match.delivery.status }}</span>
            </div>
            <div class="flex justify-between"><span class="text-gray-500">Recipient</span><span>{{ match.delivery.recipient_name }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Phone</span><span>{{ match.delivery.recipient_phone }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Location</span><span>{{ match.delivery.location?.name }}</span></div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <a v-if="match.delivery.recipient_id_photo_url" :href="match.delivery.recipient_id_photo_url" target="_blank"
              class="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-center">
              <i class="fas fa-id-card text-2xl text-blue-400"></i>
              <span class="text-xs text-gray-600 font-medium">Recipient ID</span>
              <span class="text-xs text-green-700">View Photo</span>
            </a>
            <a v-if="match.delivery.handover_amount_photo_url" :href="match.delivery.handover_amount_photo_url" target="_blank"
              class="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-center">
              <i class="fas fa-money-bill text-2xl text-green-400"></i>
              <span class="text-xs text-gray-600 font-medium">Cash Handover</span>
              <span class="text-xs text-green-700">View Photo</span>
            </a>
            <a v-if="match.delivery.combined_photo_url" :href="match.delivery.combined_photo_url" target="_blank"
              class="col-span-2 flex items-center gap-2 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <i class="fas fa-camera text-2xl text-purple-400"></i>
              <div>
                <p class="text-xs font-medium text-gray-700">Combined Verification Photo</p>
                <p class="text-xs text-green-700">Click to view</p>
              </div>
            </a>
          </div>
        </div>

        <!-- Negotiation history -->
        <div v-if="match.negotiations && match.negotiations.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-comments text-gray-400"></i> Negotiation History
          </h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="n in match.negotiations" :key="n.created_at"
              class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-sm">
              <div class="flex-1">
                <span class="font-medium text-gray-800">{{ n.proposed_by }}</span>
                <span class="text-gray-500 ml-2">proposed</span>
                <span class="font-bold text-gray-900 ml-1">{{ $fmt.aud(n.proposed_aud) }} ↔ {{ $fmt.usd(n.proposed_usd) }}</span>
                <p v-if="n.message" class="text-xs text-gray-500 mt-1">{{ n.message }}</p>
              </div>
              <span :class="['text-xs px-2 py-0.5 rounded-full',
                n.status==='accepted'?'bg-green-100 text-green-700':n.status==='countered'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-600']">
                {{ n.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Dispute -->
        <div v-if="match.dispute" class="bg-red-50 border border-red-200 rounded-2xl p-5">
          <h3 class="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
            <i class="fas fa-exclamation-circle text-red-500"></i> Active Dispute
          </h3>
          <p class="text-sm text-red-700 mb-3">{{ match.dispute.reason }}</p>
          <router-link :to="'/admin/disputes/'+match.dispute.id"
            class="inline-flex items-center gap-1 text-sm font-medium text-red-700 hover:underline">
            View & Resolve Dispute →
          </router-link>
        </div>

        <!-- Timeline -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">Progress Timeline</h3>
          <status-timeline :match="match" />
        </div>
      </div>
    </div>
  </div>
  </div>
</div>`},jv={name:"AdminDeposits",data(){return{items:[],meta:null,loading:!0,error:null}},async mounted(){await this.load()},methods:{async load(e=1){var t,s,r;this.loading=!0,this.error=null;try{const{data:a}=await this.$http.get("/../../api/v1/admin/deposits",{params:{page:e}});this.items=a.data||[],this.meta=((t=a.meta)==null?void 0:t.pagination)||null}catch(a){this.error=((r=(s=a.response)==null?void 0:s.data)==null?void 0:r.message)||"Failed to load deposits"}this.loading=!1},urgencyClass(e){return e>=24?"bg-red-50 border-red-200":e>=8?"bg-orange-50 border-orange-100":"bg-white border-gray-100"}},template:`
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 lg:ml-60">
    <div class="max-w-5xl mx-auto px-6 py-6">

      <h1 class="text-xl font-bold mb-5">Deposit Queue</h1>

      <loading-spinner v-if="loading" />

      <div v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div v-if="items.length" class="space-y-3">
          <div v-for="d in items" :key="d.id"
            :class="['rounded-2xl border p-5', urgencyClass(d.hours_waiting || 0)]">

            <p class="font-semibold">{{ $fmt.aud(d.amount_aud) }}</p>
            <p class="text-xs text-gray-500">{{ d.depositor?.name }}</p>

            <div class="mt-2 flex gap-2">
              <a v-if="d.proof_url" :href="d.proof_url" target="_blank"
                class="px-3 py-1 text-xs border rounded">Proof</a>

              <router-link :to="'/admin/matches/' + d.match_ulid"
                class="px-3 py-1 text-xs border rounded text-green-700">
                Match
              </router-link>
            </div>
          </div>

          <pagination-links :meta="meta" @page="load($event)" />
        </div>

        <div v-else class="text-center py-10 text-gray-400">
          No pending deposits
        </div>
      </div>

    </div>
  </div>
</div>`},Nv={name:"AdminDisputes",data(){return{items:[],meta:null,loading:!0,error:null,statusFilter:"open"}},async mounted(){await this.load()},watch:{statusFilter(){this.load()}},methods:{async load(e=1){var t,s,r;this.loading=!0,this.error=null;try{const{data:a}=await this.$http.get("/../../api/v1/admin/disputes",{params:{page:e,status:this.statusFilter||void 0}});this.items=a.data||[],this.meta=((t=a.meta)==null?void 0:t.pagination)||null}catch(a){this.error=((r=(s=a.response)==null?void 0:s.data)==null?void 0:r.message)||"Failed to load disputes"}this.loading=!1},urgencyRow(e){return e.urgency==="critical"?"bg-red-50 border-l-4 border-l-red-500":e.urgency==="high"?"bg-orange-50 border-l-4 border-l-orange-400":e.urgency==="medium"?"border-l-4 border-l-yellow-400":""}},template:`
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 lg:ml-60">
    <div class="max-w-6xl mx-auto px-6 py-6">

      <div class="flex items-center justify-between mb-5">
        <h1 class="text-xl font-bold text-gray-900">Disputes</h1>

        <div class="flex items-center gap-2">
          <div class="flex gap-1 text-xs">
            <span class="px-2 py-1 bg-red-100 text-red-700 rounded font-medium">Critical 48h+</span>
            <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded font-medium">High 24h+</span>
            <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">Medium 8h+</span>
          </div>

          <select v-model="statusFilter"
            class="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="open">Open</option>
            <option value="under_review">Under Review</option>
            <option value="">All</option>
          </select>
        </div>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div v-if="items.length" class="space-y-3">
          <div v-for="d in items" :key="d.id"
            :class="['bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition', urgencyRow(d)]">

            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex flex-wrap gap-2 mb-2">
                  <span :class="['text-xs font-bold px-2 py-0.5 rounded-full',
                    d.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                    d.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                    d.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600']">
                    {{ d.urgency }} · {{ d.hours_open }}h open
                  </span>

                  <status-badge :status="d.status" />

                  <span v-if="d.agreed_aud" class="text-xs font-semibold text-gray-700">
                    {{ $fmt.aud(d.agreed_aud) }}
                  </span>
                </div>

                <p class="text-sm text-gray-700 mb-1">
                  {{ d.reason ? d.reason.slice(0, 120) : '' }}
                </p>

                <p class="text-xs text-gray-500">
                  Sender: <span class="font-medium">{{ d.sender?.name }}</span>
                  · Receiver: <span class="font-medium">{{ d.receiver?.name }}</span>
                </p>
              </div>

              <router-link :to="'/admin/disputes/' + d.id"
                :class="['flex-shrink-0 px-4 py-2 text-sm font-semibold text-white rounded-xl',
                  d.urgency === 'critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-700 hover:bg-green-800']">
                Resolve
              </router-link>
            </div>

          </div>

          <pagination-links :meta="meta" @page="load($event)" />
        </div>

        <div v-else class="text-center py-16 text-gray-400">
          No disputes
        </div>
      </div>

    </div>
  </div>
</div>`},Uv={name:"AdminDisputeDetail",data(){return{dispute:null,loading:!0,msg:"",msgLoading:!1,resolveLoading:!1,resolveNotes:""}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/../../api/v1/admin/disputes/"+this.$route.params.id);this.dispute=e.data}catch{this.$router.push("/admin/disputes")}this.loading=!1},async sendMessage(){if(this.msg.trim()){this.msgLoading=!0;try{await this.$http.post("/../../api/v1/admin/disputes/"+this.dispute.id+"/messages",{message:this.msg}),this.msg="",this.$toast.success("Message sent."),await this.load()}catch{this.$toast.error("Failed to send message.")}this.msgLoading=!1}},async resolve(e){var s,r;const t=this.resolveNotes||prompt("Resolution notes (required):");if(t){this.resolveLoading=!0;try{await this.$http.put("/../../api/v1/admin/disputes/"+this.dispute.id+"/resolve",{resolution:e,notes:t}),this.$toast.success("Dispute resolved."),await this.load()}catch(a){this.$toast.error(((r=(s=a.response)==null?void 0:s.data)==null?void 0:r.message)||"Failed")}this.resolveLoading=!1}}},template:`<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />
  <div class="flex-1 min-w-0 lg:ml-60">
  <div class="bg-white border-b px-6 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
    <router-link to="/admin/disputes" class="text-gray-400 hover:text-gray-700"><i class="fas fa-arrow-left"></i></router-link>
    <div class="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-xs">Tu</span></div>
    <span class="font-bold text-gray-900">eZimConnect <span class="text-green-600 text-sm">Admin</span></span>
    <span class="text-gray-400 mx-1">›</span>
    <span class="text-sm text-gray-600">Dispute #{{ $route.params.id }}</span>
  </div>

  <div class="max-w-5xl mx-auto px-6 py-6">
    <loading-spinner v-if="loading" />
    <div v-else-if="dispute" class="grid md:grid-cols-3 gap-6">

      <!-- Left: Info + Resolve -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-3">
            <status-badge :status="dispute.status" />
            <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full',
              dispute.urgency==='critical'?'bg-red-100 text-red-700':dispute.urgency==='high'?'bg-orange-100 text-orange-700':'bg-gray-100 text-gray-600']">
              {{ dispute.urgency }}
            </span>
          </div>
          <p class="text-sm font-medium text-gray-800 mb-1">Raised {{ dispute.hours_open }}h ago</p>
          <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">{{ dispute.reason }}</p>
        </div>

        <div v-if="dispute.match" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-xs font-semibold text-gray-500 uppercase mb-3">Transaction</h3>
          <div class="text-sm space-y-1.5">
            <div class="flex justify-between"><span class="text-gray-500">Amount</span><span class="font-bold">{{ $fmt.aud(dispute.match.agreed_aud) }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Delivery</span><span class="capitalize">{{ dispute.match.delivery_method }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Deposit</span><span class="capitalize">{{ dispute.match.deposit_status }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Delivery</span><span class="capitalize">{{ dispute.match.delivery_status }}</span></div>
          </div>
          <router-link :to="'/admin/matches/'+dispute.match_ulid" class="text-xs text-green-700 hover:underline block mt-3">View match →</router-link>
          <div class="flex gap-2 mt-3">
            <a v-if="dispute.match.proof_url" :href="dispute.match.proof_url" target="_blank"
              class="flex-1 text-center text-xs py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Deposit Proof</a>
            <a v-if="dispute.match.delivery_id_photo_url" :href="dispute.match.delivery_id_photo_url" target="_blank"
              class="flex-1 text-center text-xs py-2 border border-gray-200 rounded-lg hover:bg-gray-50">ID Photo</a>
            <a v-if="dispute.match.delivery_handover_url" :href="dispute.match.delivery_handover_url" target="_blank"
              class="flex-1 text-center text-xs py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Handover</a>
          </div>
        </div>

        <!-- Resolve -->
        <div v-if="['open','under_review'].includes(dispute.status)" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 class="text-xs font-semibold text-gray-500 uppercase mb-3">Resolve Dispute</h3>
          <textarea v-model="resolveNotes" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 resize-none focus:outline-none focus:border-green-500" placeholder="Resolution notes…"></textarea>
          <div class="space-y-2">
            <button @click="resolve('receiver')" :disabled="resolveLoading"
              class="w-full py-2.5 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50">
              <i class="fas fa-hand-holding-usd mr-1"></i> Favour Receiver (release funds)
            </button>
            <button @click="resolve('refund')" :disabled="resolveLoading"
              class="w-full py-2.5 text-sm font-medium border border-orange-300 text-orange-700 rounded-xl hover:bg-orange-50">
              <i class="fas fa-undo mr-1"></i> Refund Sender
            </button>
            <button @click="resolve('sender')" :disabled="resolveLoading"
              class="w-full py-2.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50">
              Favour Sender (no payment to receiver)
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Message thread -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style="height:600px">
          <div class="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h3 class="text-sm font-semibold text-gray-900">Message Thread</h3>
          </div>
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div v-for="msg in (dispute.messages||[])" :key="msg.id"
              :class="['p-3 rounded-xl text-sm', msg.is_admin_message?'bg-green-50 ml-8':'bg-gray-50 mr-8']">
              <div class="flex justify-between items-start mb-1">
                <span :class="['font-medium', msg.is_admin_message?'text-green-800':'text-gray-800']">
                  <i v-if="msg.is_admin_message" class="fas fa-shield-alt mr-1 text-xs"></i>
                  {{ msg.sender?.name }}
                  <span class="text-xs font-normal text-gray-400 ml-1">{{ msg.sender?.role }}</span>
                </span>
                <span class="text-xs text-gray-400">{{ msg.created_at ? new Date(msg.created_at).toLocaleString() : '' }}</span>
              </div>
              <p class="text-gray-700">{{ msg.message }}</p>
            </div>
          </div>
          <div v-if="['open','under_review'].includes(dispute.status)" class="p-3 border-t border-gray-200 flex gap-2">
            <input v-model="msg" type="text" @keyup.enter="sendMessage"
              class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
              placeholder="Send message to both parties…">
            <button @click="sendMessage" :disabled="msgLoading || !msg.trim()"
              class="px-4 py-2 bg-green-700 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-green-800">
              <i v-if="msgLoading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</div>`},Mv={name:"AdminSettings",data(){return{settings:{},edited:{},loading:!0,saving:!1}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/../../api/v1/admin/settings");this.settings=e.data||{}}catch{}this.loading=!1},edit(e,t){this.$set(this.edited,e,t)},async save(){if(Object.keys(this.edited).length){this.saving=!0;try{await this.$http.put("/../../api/v1/admin/settings",this.edited),this.$toast.success("Saved"),this.edited={},await this.load()}catch{this.$toast.error("Failed")}this.saving=!1}}},template:`
<div class="min-h-screen bg-gray-100 flex">
  <admin-nav />

  <div class="flex-1 lg:ml-60">
    <div class="max-w-4xl mx-auto px-6 py-6">

      <div class="flex justify-between mb-5">
        <h1 class="text-xl font-bold">Settings</h1>

        <button v-if="Object.keys(edited).length"
          @click="save"
          class="px-4 py-2 bg-green-700 text-white rounded">
          Save
        </button>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else class="space-y-3">
        <div v-for="(s, key) in settings" :key="key"
          class="bg-white border rounded-xl p-4 flex justify-between items-center">

          <span class="font-mono text-sm">{{ key }}</span>

          <input :value="s.value"
            @input="edit(key, $event.target.value)"
            class="border px-3 py-1 rounded text-sm w-40 text-right" />
        </div>
      </div>

    </div>
  </div>
</div>`},Iv={name:"AdminOrders",data(){return{orders:[],meta:null,loading:!0,filters:{status:"",order_type:"",search:"",page:1}}},async mounted(){await this.load()},methods:{async load(e=1){var t;this.loading=!0;try{const s={page:e,per_page:20};this.filters.status&&(s.status=this.filters.status),this.filters.order_type&&(s.order_type=this.filters.order_type),this.filters.search&&(s.search=this.filters.search);const{data:r}=await this.$http.get("/admin/orders",{params:s});this.orders=r.data||[],this.meta=(t=r.meta)==null?void 0:t.pagination}catch{}this.loading=!1},reset(){this.filters={status:"",order_type:"",search:"",page:1},this.load()},typeBadge(e){return e==="send_to_zim"?"bg-blue-100 text-blue-700":"bg-purple-100 text-purple-700"}},template:`
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">All Orders</h1>
    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
      <div class="grid sm:grid-cols-4 gap-3">
        <input v-model="filters.search" @keyup.enter="load()" type="text"
          class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          placeholder="Search user or city...">
        <select v-model="filters.status" @change="load()"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">All statuses</option>
          <option v-for="s in ['open','negotiating','agreed','in_escrow','delivering','completed','cancelled','expired','disputed']" :key="s" :value="s">{{ s }}</option>
        </select>
        <select v-model="filters.order_type" @change="load()"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">All types</option>
          <option value="send_to_zim">Send to Zimbabwe</option>
          <option value="receive_from_zim">Receive from Zimbabwe</option>
        </select>
        <div class="flex gap-2">
          <button @click="load()" class="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Search</button>
          <button @click="reset()" class="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Reset</button>
        </div>
      </div>
    </div>
    <loading-spinner v-if="loading" />
    <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">User</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Type</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Amount</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">City</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
            <th class="text-left py-3 px-4 font-semibold text-gray-600">Created</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="o in orders" :key="o.ulid" class="hover:bg-gray-50 transition-colors">
            <td class="py-3 px-4 font-medium text-gray-900">{{ o.user?.display_name || o.user?.first_name || '—' }}</td>
            <td class="py-3 px-4">
              <span :class="['text-xs font-bold px-2 py-0.5 rounded-lg', typeBadge(o.order_type)]">
                {{ o.order_type === 'send_to_zim' ? 'Send' : 'Receive' }}
              </span>
            </td>
            <td class="py-3 px-4 font-semibold">{{ $fmt.aud(o.amount_aud) }}</td>
            <td class="py-3 px-4 text-gray-600">{{ o.delivery_location?.name || '—' }}</td>
            <td class="py-3 px-4"><status-badge :status="o.status" /></td>
            <td class="py-3 px-4 text-gray-400">{{ $fmt.date(o.created_at) }}</td>
          </tr>
          <tr v-if="!orders.length"><td colspan="6" class="py-8 text-center text-sm text-gray-400">No orders found.</td></tr>
        </tbody>
      </table>
      <div class="px-4 py-3 border-t border-gray-100" v-if="meta">
        <pagination-links :meta="meta" @page="load($event)" />
      </div>
    </div>
  </div>
</div>`},Bv={name:"AdminRates",data(){return{rates:[],loading:!0,form:{from_currency:"AUD",to_currency:"USD",rate:""},saving:!1,error:null,showForm:!1}},computed:{currentRate(){return this.rates.find(e=>e.is_active)}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/admin/exchange-rates");this.rates=e.data||[]}catch{}this.loading=!1},async save(){var e,t;if(!this.form.rate||parseFloat(this.form.rate)<=0){this.error="Please enter a valid rate.";return}this.saving=!0,this.error=null;try{await this.$http.post("/admin/exchange-rates",{...this.form,rate:parseFloat(this.form.rate)}),this.$toast.success("New rate activated. Previous rate deactivated."),this.form.rate="",this.showForm=!1,await this.load()}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed."}this.saving=!1},async deactivate(e){if(confirm("Deactivate this rate?"))try{await this.$http.put("/admin/exchange-rates/"+e+"/deactivate"),await this.load()}catch{}}},template:`
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />
  <div class="max-w-3xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Exchange Rates</h1>
        <p class="text-sm text-gray-500 mt-0.5">Set the AUD/USD rate used for all new orders and calculators.</p>
      </div>
      <button @click="showForm = !showForm"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> Set new rate
      </button>
    </div>

    <!-- Current rate hero -->
    <div v-if="currentRate" class="rounded-3xl p-6 mb-5 text-white" style="background:linear-gradient(135deg,#0d4a28,#1a6b3c);">
      <p class="text-sm font-semibold text-green-200 mb-1">Current active rate</p>
      <p class="text-5xl font-black mb-1" style="font-family:Georgia,serif;">{{ parseFloat(currentRate.rate).toFixed(4) }}</p>
      <p class="text-green-200 text-sm">AUD 1 = USD {{ parseFloat(currentRate.rate).toFixed(4) }}</p>
      <p class="text-green-300 text-xs mt-2">Set {{ $fmt.date(currentRate.set_at) }}</p>
    </div>
    <div v-else class="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5 text-sm text-orange-700">
      <i class="fas fa-exclamation-triangle mr-2"></i>No active exchange rate set. Users cannot create orders until a rate is set.
    </div>

    <!-- Set new rate form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">
      <h3 class="text-base font-bold text-gray-900 mb-4">Set new AUD/USD rate</h3>
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-xs text-yellow-800">
        <i class="fas fa-exclamation-circle mr-1"></i>
        Setting a new rate will immediately deactivate the current rate. All new orders will use the new rate.
        Existing agreed matches are unaffected.
      </div>
      <alert-banner v-if="error" type="error" :message="error" class="mb-3" />
      <div class="flex gap-3 items-end">
        <div class="flex-1">
          <label class="text-sm font-semibold text-gray-700 block mb-1">New AUD/USD rate</label>
          <input v-model="form.rate" type="number" step="0.0001" min="0.0001"
            @keyup.enter="save"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold focus:outline-none focus:border-green-500"
            placeholder="e.g. 0.6350">
          <p class="text-xs text-gray-400 mt-1">
            <span v-if="form.rate && parseFloat(form.rate) > 0">
              AUD 500 → USD {{ (500 * 0.985 * parseFloat(form.rate || 0)).toFixed(2) }} (after 1.5% fee)
            </span>
          </p>
        </div>
        <button @click="save" :disabled="saving || !form.rate"
          class="px-5 py-3 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i>
          Activate rate
        </button>
        <button @click="showForm=false" class="px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
      </div>
    </div>

    <!-- Rate history -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-sm font-bold text-gray-900">Rate History</h3>
        <span class="text-xs text-gray-400">{{ rates.length }} entries</span>
      </div>
      <loading-spinner v-if="loading" />
      <div v-else class="divide-y divide-gray-50">
        <div v-for="r in rates" :key="r.id" class="flex items-center justify-between px-5 py-3.5 gap-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="r.is_active ? 'bg-green-100' : 'bg-gray-100'">
              <i class="fas fa-chart-line text-sm" :class="r.is_active ? 'text-green-600' : 'text-gray-400'"></i>
            </div>
            <div>
              <p class="font-bold text-gray-900">{{ parseFloat(r.rate).toFixed(4) }} <span class="text-xs text-gray-500 font-normal">AUD/USD</span></p>
              <p class="text-xs text-gray-400">{{ $fmt.date(r.set_at) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
              {{ r.is_active ? 'Active' : 'Inactive' }}
            </span>
            <button v-if="r.is_active" @click="deactivate(r.id)"
              class="text-xs text-gray-500 hover:text-red-600 border border-gray-200 px-2.5 py-1 rounded-lg hover:border-red-200">
              Deactivate
            </button>
          </div>
        </div>
        <div v-if="!rates.length" class="px-5 py-8 text-center text-sm text-gray-400">No rates set yet.</div>
      </div>
    </div>
  </div>
</div>`},zv={name:"AdminLocations",data(){return{locations:[],loading:!0,showForm:!1,editId:null,form:{name:"",province:"",country_id:2,is_active:!0},saving:!1,error:null,search:""}},computed:{filtered(){if(!this.search)return this.locations;const e=this.search.toLowerCase();return this.locations.filter(t=>t.name.toLowerCase().includes(e)||t.province.toLowerCase().includes(e))},grouped(){const e={};return this.filtered.forEach(t=>{e[t.province]||(e[t.province]=[]),e[t.province].push(t)}),e}},async mounted(){await this.load()},methods:{async load(){var e;this.loading=!0;try{const{data:t}=await this.$http.get("/admin/locations");this.locations=((e=t.data)==null?void 0:e.flat)||t.data||[]}catch{}this.loading=!1},openAdd(){this.editId=null,this.error=null,this.form={name:"",province:"",country_id:2,is_active:!0},this.showForm=!0},openEdit(e){this.editId=e.id,this.error=null,this.form={name:e.name,province:e.province,country_id:e.country_id||2,is_active:e.is_active},this.showForm=!0},async save(){var e,t;if(!this.form.name||!this.form.province){this.error="Name and province are required.";return}this.saving=!0,this.error=null;try{this.editId?(await this.$http.put("/admin/locations/"+this.editId,this.form),this.$toast.success("Location updated.")):(await this.$http.post("/admin/locations",this.form),this.$toast.success("Location added.")),this.showForm=!1,await this.load()}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed."}this.saving=!1},async toggle(e){try{await this.$http.put("/admin/locations/"+e.id+"/toggle-active"),await this.load()}catch{}},async remove(e){var t,s;if(confirm("Delete this location? This cannot be undone."))try{await this.$http.delete("/admin/locations/"+e),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed.")}}},template:`
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Zimbabwe Delivery Locations</h1>
        <p class="text-sm text-gray-500 mt-0.5">{{ locations.length }} cities configured</p>
      </div>
      <button @click="openAdd()"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> Add city
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">
      <h3 class="text-base font-bold text-gray-900 mb-4">{{ editId ? 'Edit location' : 'Add new city' }}</h3>
      <alert-banner v-if="error" type="error" :message="error" class="mb-3" />
      <div class="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">City name <span class="text-red-500">*</span></label>
          <input v-model="form.name" type="text" placeholder="e.g. Harare"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Province <span class="text-red-500">*</span></label>
          <input v-model="form.province" type="text" placeholder="e.g. Harare Province"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
      </div>
      <label class="flex items-center gap-2 text-sm text-gray-700 mb-4 cursor-pointer">
        <input type="checkbox" v-model="form.is_active" class="w-4 h-4 text-green-600 rounded accent-green-600">
        Active (visible to users)
      </label>
      <div class="flex gap-2">
        <button @click="save" :disabled="saving" class="px-5 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i>
          {{ editId ? 'Save changes' : 'Add city' }}
        </button>
        <button @click="showForm=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
      <input v-model="search" type="text"
        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
        placeholder="Search cities or provinces...">
    </div>

    <loading-spinner v-if="loading" />

    <div v-else class="space-y-4">
      <div v-for="(locs, province) in grouped" :key="province"
        class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <p class="text-sm font-bold text-gray-700">{{ province }}</p>
          <p class="text-xs text-gray-400">{{ locs.length }} {{ locs.length === 1 ? 'city' : 'cities' }}</p>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="loc in locs" :key="loc.id" class="flex items-center justify-between px-5 py-3.5 gap-3">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full flex-shrink-0" :class="loc.is_active ? 'bg-green-500' : 'bg-gray-300'"></div>
              <div>
                <p class="font-semibold text-gray-900 text-sm">{{ loc.name }}</p>
                <p class="text-xs text-gray-400">{{ loc.slug }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', loc.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
                {{ loc.is_active ? 'Active' : 'Inactive' }}
              </span>
              <button @click="toggle(loc)" :class="['relative inline-flex w-9 h-5 rounded-full transition-colors flex-shrink-0', loc.is_active ? 'bg-green-500' : 'bg-gray-300']">
                <span :class="['absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', loc.is_active ? 'translate-x-4' : 'translate-x-0']"></span>
              </button>
              <button @click="openEdit(loc)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><i class="fas fa-edit text-xs"></i></button>
              <button @click="remove(loc.id)" class="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><i class="fas fa-trash text-xs"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!Object.keys(grouped).length" class="text-center py-8 text-sm text-gray-400">No locations found.</div>
    </div>
  </div>
</div>`},Hv={name:"AdminAuditLogs",data(){return{logs:[],meta:null,loading:!0,filters:{event:"",user_id:"",search:""}}},async mounted(){await this.load()},methods:{async load(e=1){var t;this.loading=!0;try{const s={page:e,per_page:25};this.filters.event&&(s.event=this.filters.event),this.filters.user_id&&(s.user_id=this.filters.user_id),this.filters.search&&(s.search=this.filters.search);const{data:r}=await this.$http.get("/admin/audit-logs",{params:s});this.logs=r.data||[],this.meta=(t=r.meta)==null?void 0:t.pagination}catch{}this.loading=!1},reset(){this.filters={event:"",user_id:"",search:""},this.load()},eventColor(e){return e&&e.startsWith("fraud")?"bg-red-100 text-red-700":e&&e.startsWith("user")?"bg-blue-100 text-blue-700":e&&e.startsWith("order")?"bg-purple-100 text-purple-700":e&&e.startsWith("match")?"bg-yellow-100 text-yellow-700":e&&e.startsWith("kyc")?"bg-green-100 text-green-700":e&&e.startsWith("admin")?"bg-orange-100 text-orange-700":"bg-gray-100 text-gray-600"}},template:`
<div class="min-h-screen bg-gray-100">
  <admin-nav />
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Audit Logs</h1>
      <p class="text-sm text-gray-500 mt-0.5">Full record of all system events and admin actions.</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
      <div class="grid sm:grid-cols-3 gap-3">
        <input v-model="filters.search" @keyup.enter="load()" type="text"
          class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          placeholder="Search events...">
        <input v-model="filters.event" @keyup.enter="load()" type="text"
          class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
          placeholder="Filter by event type (e.g. order.created)">
        <div class="flex gap-2">
          <button @click="load()" class="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Search</button>
          <button @click="reset()" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Reset</button>
        </div>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="divide-y divide-gray-50">
        <div v-for="log in logs" :key="log.id" class="px-5 py-3.5 hover:bg-gray-50 transition-colors">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 min-w-0">
              <span :class="['text-xs px-2.5 py-1 rounded-lg font-bold whitespace-nowrap flex-shrink-0 mt-0.5', eventColor(log.action)]">
                {{ log.action }}
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ log.user && log.user.name }} 
                  <span class="text-gray-400 font-normal">· {{ log.user && log.user.email }}</span>
                </p>
                <p v-if="log.new_values ? JSON.stringify(log.new_values).slice(0,80) : log.action" class="text-xs text-gray-500 mt-0.5 truncate">{{ log.new_values ? JSON.stringify(log.new_values).slice(0,80) : log.action }}</p>
                <p v-if="log.ip_address" class="text-xs text-gray-400 mt-0.5">IP: {{ log.ip_address }}</p>
              </div>
            </div>
            <span class="text-xs text-gray-400 flex-shrink-0 mt-1">{{ $fmt.datetime ? $fmt.datetime(log.created_at) : $fmt.date(log.created_at) }}</span>
          </div>
        </div>
        <div v-if="!logs.length" class="px-5 py-8 text-center text-sm text-gray-400">No audit logs found.</div>
      </div>
      <div class="px-5 py-3 border-t border-gray-100" v-if="meta">
        <pagination-links :meta="meta" @page="load($event)" />
      </div>
    </div>
  </div>
</div>`},qv={name:"AdminNoticeboard",data(){return{posts:[],loading:!0,showForm:!1,editId:null,form:{title:"",body:"",type:"info",is_pinned:!1,audience:"all"},saving:!1,error:null}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/admin/noticeboard");this.posts=e.data||[]}catch{}this.loading=!1},openAdd(){this.editId=null,this.error=null,this.form={title:"",body:"",type:"info",is_pinned:!1,audience:"all"},this.showForm=!0},openEdit(e){this.editId=e.id,this.error=null,this.form={title:e.title,body:e.body,type:e.type,is_pinned:!!e.is_pinned,audience:e.audience||"all"},this.showForm=!0},async save(){var e,t;if(!this.form.title||!this.form.body){this.error="Title and body are required.";return}this.saving=!0,this.error=null;try{this.editId?(await this.$http.put("/admin/noticeboard/"+this.editId,this.form),this.$toast.success("Post updated.")):(await this.$http.post("/admin/noticeboard",this.form),this.$toast.success("Post created.")),this.showForm=!1,await this.load()}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed."}this.saving=!1},async publish(e){try{await this.$http.put("/admin/noticeboard/"+e+"/publish"),await this.load()}catch{}},async togglePin(e){try{await this.$http.put("/admin/noticeboard/"+e+"/pin"),await this.load()}catch{}},async remove(e){if(confirm("Delete this notice?"))try{await this.$http.delete("/admin/noticeboard/"+e),await this.load()}catch{}},typeBadge(e){return{info:"bg-blue-100 text-blue-700",warning:"bg-yellow-100 text-yellow-700",success:"bg-green-100 text-green-700",alert:"bg-red-100 text-red-700"}[e]||"bg-gray-100 text-gray-600"},typeIcon(e){return{info:"fa-info-circle text-blue-500",warning:"fa-exclamation-triangle text-yellow-500",success:"fa-check-circle text-green-500",alert:"fa-exclamation-circle text-red-500"}[e]||"fa-circle text-gray-400"}},template:`
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Noticeboard</h1>
        <p class="text-sm text-gray-500 mt-0.5">System announcements visible to all users.</p>
      </div>
      <button @click="openAdd()"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> New notice
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-bold text-gray-900">{{ editId ? 'Edit notice' : 'Create new notice' }}</h3>
        <button @click="showForm=false" class="p-1.5 text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
      </div>
      <alert-banner v-if="error" type="error" :message="error" class="mb-3" />
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Title <span class="text-red-500">*</span></label>
          <input v-model="form.title" type="text" placeholder="e.g. Scheduled maintenance this weekend"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Body <span class="text-red-500">*</span></label>
          <textarea v-model="form.body" rows="4" placeholder="Full notice content..."
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500"></textarea>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="text-xs font-semibold text-gray-600 block mb-1">Type</label>
            <select v-model="form.type" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="alert">Alert</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600 block mb-1">Audience</label>
            <select v-model="form.audience" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
              <option value="all">All users</option>
              <option value="senders">Senders only</option>
              <option value="receivers">Receivers only</option>
            </select>
          </div>
          <div class="flex items-end pb-0.5">
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" v-model="form.is_pinned" class="w-4 h-4 rounded accent-green-600">
              Pin to top
            </label>
          </div>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="save" :disabled="saving"
            class="px-5 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i>
            {{ editId ? 'Save changes' : 'Create notice' }}
          </button>
          <button @click="showForm=false" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="posts.length" class="space-y-3">
      <div v-for="post in posts" :key="post.id" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3 flex-1">
            <i :class="['fas text-lg flex-shrink-0 mt-0.5', typeIcon(post.type)]"></i>
            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <p class="font-bold text-gray-900">{{ post.title }}</p>
                <span v-if="post.is_pinned" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  <i class="fas fa-thumbtack mr-0.5"></i>Pinned
                </span>
                <span :class="['text-xs px-2 py-0.5 rounded-full font-semibold capitalize', typeBadge(post.type)]">
                  {{ post.type }}
                </span>
                <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
                  {{ post.is_published ? 'Published' : 'Draft' }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-1">{{ post.body }}</p>
              <p class="text-xs text-gray-400">
                Audience: {{ post.audience || 'All' }}
                · Created {{ $fmt.date(post.created_at) }}
                <span v-if="post.published_at"> · Published {{ $fmt.date(post.published_at) }}</span>
              </p>
            </div>
          </div>
          <div class="flex gap-1.5 flex-shrink-0">
            <button v-if="!post.is_published" @click="publish(post.id)"
              class="px-2.5 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700">
              Publish
            </button>
            <button @click="togglePin(post.id)"
              :class="['px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors',
                post.is_pinned ? 'border-yellow-300 text-yellow-700 bg-yellow-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50']">
              <i class="fas fa-thumbtack"></i>
            </button>
            <button @click="openEdit(post)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-xl">
              <i class="fas fa-edit text-sm"></i>
            </button>
            <button @click="remove(post.id)" class="p-1.5 text-red-400 hover:bg-red-50 rounded-xl">
              <i class="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
      <i class="fas fa-bullhorn text-4xl text-gray-300 mb-3 block"></i>
      <p class="font-semibold text-gray-600 mb-1">No notices yet</p>
      <p class="text-sm text-gray-400 mb-4">Create a notice to inform users about platform updates, maintenance, or important information.</p>
      <button @click="openAdd()" class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus"></i> Create first notice
      </button>
    </div>
  </div>
</div>`},Wv={name:"AdminReports",data(){return{reports:[],meta:null,loading:!0,filters:{status:""},resolving:null,resolveForm:{action:"dismiss",admin_note:""},resolveLoading:!1}},async mounted(){await this.load()},methods:{async load(e=1){var t;this.loading=!0;try{const s={page:e,per_page:20};this.filters.status&&(s.status=this.filters.status);const{data:r}=await this.$http.get("/admin/reports",{params:s});this.reports=r.data||[],this.meta=(t=r.meta)==null?void 0:t.pagination}catch{}this.loading=!1},openResolve(e){this.resolving=e,this.resolveForm={action:"dismiss",admin_note:""}},async resolve(){var e,t;this.resolveLoading=!0;try{await this.$http.put("/admin/reports/"+this.resolving.id+"/resolve",this.resolveForm),this.$toast.success("Report resolved."),this.resolving=null,await this.load()}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed.")}this.resolveLoading=!1},statusBadge(e){return{open:"bg-red-100 text-red-700",resolved:"bg-green-100 text-green-700",dismissed:"bg-gray-100 text-gray-500"}[e]||"bg-gray-100 text-gray-600"}},template:`
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />

  <!-- Resolve modal -->
  <div v-if="resolving" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
      <h3 class="font-bold text-gray-900 mb-4">Resolve report</h3>
      <div class="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
        <p class="font-semibold text-gray-800 mb-1">Reported user: {{ resolving.reported_user?.first_name }} {{ resolving.reported_user?.last_name }}</p>
        <p class="text-gray-600">Reason: {{ resolving.reason }}</p>
        <p v-if="resolving.description" class="text-gray-500 text-xs mt-1">{{ resolving.description }}</p>
      </div>
      <div class="space-y-3">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Action</label>
          <select v-model="resolveForm.action" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="dismiss">Dismiss (no action)</option>
            <option value="warn">Warn reported user</option>
            <option value="suspend">Suspend reported user</option>
            <option value="ban">Ban reported user</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Admin note</label>
          <textarea v-model="resolveForm.admin_note" rows="2"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500"
            placeholder="Internal note about this resolution..."></textarea>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="resolve" :disabled="resolveLoading"
            class="flex-1 py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="resolveLoading" class="fas fa-spinner fa-spin mr-1.5"></i>
            Resolve report
          </button>
          <button @click="resolving=null" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Reports</h1>
        <p class="text-sm text-gray-500 mt-0.5">Reports submitted by members about other members.</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
      <div class="flex gap-3">
        <select v-model="filters.status" @change="load()"
          class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <button @click="filters.status=''; load()" class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Reset</button>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="reports.length" class="space-y-3">
      <div v-for="r in reports" :key="r.id" class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', statusBadge(r.status)]">
                {{ r.status }}
              </span>
              <span class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium capitalize">
                {{ r.reason?.replace(/_/g,' ') }}
              </span>
              <span class="text-xs text-gray-400">{{ $fmt.date(r.created_at) }}</span>
            </div>
            <div class="grid sm:grid-cols-2 gap-3 text-sm mb-2">
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Reported by</p>
                <p class="font-semibold text-gray-800">
                  {{ r.reporter?.first_name }} {{ r.reporter?.last_name }}
                  <span class="text-gray-500 font-normal text-xs"> · {{ r.reporter?.email }}</span>
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-0.5">Reported user</p>
                <p class="font-semibold text-gray-800">
                  {{ r.reported_user?.first_name }} {{ r.reported_user?.last_name }}
                  <span class="text-gray-500 font-normal text-xs"> · {{ r.reported_user?.email }}</span>
                </p>
              </div>
            </div>
            <p v-if="r.description" class="text-sm text-gray-600 italic">{{ r.description }}</p>
            <p v-if="r.admin_note" class="text-xs text-blue-600 mt-1">
              <i class="fas fa-shield-alt mr-1"></i>Admin note: {{ r.admin_note }}
            </p>
          </div>
          <div class="flex flex-col gap-2 flex-shrink-0">
            <button v-if="r.status === 'open'" @click="openResolve(r)"
              class="px-3 py-1.5 text-xs font-bold text-white bg-green-700 rounded-xl hover:bg-green-800">
              Resolve
            </button>
            <router-link :to="'/admin/users/' + r.reported_user?.id"
              class="px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-center">
              View user
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
      <i class="fas fa-flag text-4xl text-gray-300 mb-3 block"></i>
      <p class="font-semibold text-gray-600 mb-1">No reports</p>
      <p class="text-sm text-gray-400">No user reports have been submitted yet.</p>
    </div>

    <div class="mt-5" v-if="meta">
      <pagination-links :meta="meta" @page="load($event)" />
    </div>
  </div>
</div>`},Zv={name:"AdminSupport",data(){return{tickets:[],meta:null,loading:!0,filters:{status:"",priority:"",search:""},selected:null,messages:[],replyText:"",adminNotes:"",saving:!1,view:"list"}},async mounted(){await this.load()},methods:{async load(e=1){var t;this.loading=!0;try{const s={page:e,per_page:20};this.filters.status&&(s.status=this.filters.status),this.filters.priority&&(s.priority=this.filters.priority),this.filters.search&&(s.search=this.filters.search);const{data:r}=await this.$http.get("/admin/support",{params:s});this.tickets=r.data||[],this.meta=(t=r.meta)==null?void 0:t.pagination}catch{}this.loading=!1},async open(e){this.selected=e,this.view="detail",this.replyText="",this.adminNotes="";try{const{data:t}=await this.$http.get("/admin/support/"+e.id);this.selected=t.data,this.messages=t.data.messages||[],this.adminNotes=t.data.admin_notes||""}catch{}},async reply(){var e,t;if(this.replyText.trim()){this.saving=!0;try{await this.$http.post("/admin/support/"+this.selected.id+"/reply",{message:this.replyText}),this.replyText="",await this.open(this.selected),this.$toast.success("Reply sent to user.")}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed.")}this.saving=!1}},async setStatus(e){var t,s;this.saving=!0;try{await this.$http.put("/admin/support/"+this.selected.id+"/status",{status:e,admin_notes:this.adminNotes}),this.$toast.success("Status updated."),await this.open(this.selected),await this.load()}catch(r){this.$toast.error(((s=(t=r.response)==null?void 0:t.data)==null?void 0:s.message)||"Failed.")}this.saving=!1},statusColor(e){return{open:"bg-blue-100 text-blue-700",awaiting_support:"bg-yellow-100 text-yellow-700",awaiting_user:"bg-purple-100 text-purple-700",resolved:"bg-green-100 text-green-700",closed:"bg-gray-100 text-gray-500"}[e]||"bg-gray-100 text-gray-600"},priorityColor(e){return{low:"bg-gray-100 text-gray-500",normal:"bg-blue-100 text-blue-600",high:"bg-orange-100 text-orange-700",urgent:"bg-red-100 text-red-700"}[e]||"bg-gray-100 text-gray-500"}},template:`
<div class="min-h-screen bg-gray-100 lg:pl-60">
  <admin-nav />
  <div class="max-w-6xl mx-auto px-4 py-8">

    <!-- List view -->
    <div v-if="view === 'list'">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p class="text-sm text-gray-500 mt-0.5">Manage user support requests</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
        <div class="grid sm:grid-cols-4 gap-3">
          <input v-model="filters.search" @keyup.enter="load()" type="text"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500"
            placeholder="Search user or subject...">
          <select v-model="filters.status" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="awaiting_support">Awaiting Support</option>
            <option value="awaiting_user">Awaiting User</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select v-model="filters.priority" @change="load()"
            class="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <div class="flex gap-2">
            <button @click="load()" class="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90"
              style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Search</button>
            <button @click="filters={status:'',priority:'',search:''}; load()" class="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm">Reset</button>
          </div>
        </div>
      </div>

      <loading-spinner v-if="loading" />

      <div v-else class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Ref</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">User</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Subject</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Priority</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-600">Updated</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="t in tickets" :key="t.id"
              @click="open(t)"
              class="hover:bg-gray-50 cursor-pointer transition-colors">
              <td class="py-3 px-4 font-mono text-xs text-gray-500">{{ t.ref }}</td>
              <td class="py-3 px-4">
                <p class="font-medium text-gray-900">{{ t.user && t.user.name }}</p>
                <p class="text-xs text-gray-400">{{ t.user && t.user.email }}</p>
              </td>
              <td class="py-3 px-4">
                <p class="font-medium text-gray-900 truncate max-w-xs">{{ t.subject }}</p>
                <p class="text-xs text-gray-400 capitalize">{{ t.category }}</p>
              </td>
              <td class="py-3 px-4">
                <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', statusColor(t.status)]">
                  {{ t.status.replace(/_/g,' ') }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', priorityColor(t.priority)]">
                  {{ t.priority }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-400 text-xs">{{ $fmt.date(t.updated_at) }}</td>
            </tr>
            <tr v-if="!tickets.length && !loading">
              <td colspan="6" class="py-10 text-center text-sm text-gray-400">No tickets found.</td>
            </tr>
          </tbody>
        </table>
        <div class="px-4 py-3 border-t border-gray-100" v-if="meta">
          <pagination-links :meta="meta" @page="load($event)" />
        </div>
      </div>
    </div>

    <!-- Detail view -->
    <div v-else-if="view === 'detail' && selected">
      <div class="flex items-center gap-3 mb-6">
        <button @click="view='list'; selected=null" class="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5">
          <i class="fas fa-arrow-left text-xs"></i> Back
        </button>
        <span class="text-gray-300">/</span>
        <span class="text-sm font-semibold text-gray-700">{{ selected.ref }}</span>
      </div>

      <div class="grid lg:grid-cols-3 gap-5">
        <!-- Messages thread -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 class="font-bold text-gray-900 mb-1">{{ selected.subject }}</h2>
            <div class="flex flex-wrap gap-2 mb-4">
              <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', statusColor(selected.status)]">{{ selected.status.replace(/_/g,' ') }}</span>
              <span :class="['text-xs px-2.5 py-1 rounded-full font-medium', priorityColor(selected.priority)]">{{ selected.priority }}</span>
              <span class="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{{ selected.category }}</span>
              <span v-if="selected.match_ulid" class="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-mono">{{ selected.match_ulid }}</span>
            </div>

            <!-- Messages -->
            <div class="space-y-3 mb-4">
              <div v-for="msg in messages" :key="msg.id"
                :class="['flex', msg.sender_role === 'support' ? 'justify-end' : 'justify-start']">
                <div :class="['max-w-sm rounded-2xl px-4 py-3 text-sm',
                  msg.sender_role === 'support'
                    ? 'bg-green-700 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm']">
                  <p class="font-semibold text-xs mb-1 opacity-70">{{ msg.sender_name }}</p>
                  <p class="leading-relaxed whitespace-pre-line">{{ msg.message }}</p>
                  <p class="text-xs mt-1.5 opacity-60">{{ $fmt.date(msg.created_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Reply box -->
            <div class="border-t border-gray-100 pt-4">
              <textarea v-model="replyText" rows="4"
                class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500 mb-2"
                placeholder="Type your reply to the user..."></textarea>
              <button @click="reply" :disabled="saving || !replyText.trim()"
                class="w-full py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
                style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
                <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i> Send reply to user
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar: user info + actions -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p class="text-xs font-bold text-gray-500 uppercase mb-3">User</p>
            <p class="font-bold text-gray-900">{{ selected.user && selected.user.name }}</p>
            <p class="text-sm text-gray-500">{{ selected.user && selected.user.email }}</p>
            <router-link v-if="selected.user && selected.user.id" :to="'/admin/users/' + selected.user.id"
              class="mt-3 block text-xs text-green-700 font-semibold hover:underline">View user profile →</router-link>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p class="text-xs font-bold text-gray-500 uppercase mb-3">Update Status</p>
            <div class="space-y-2">
              <button v-for="s in ['open','awaiting_user','resolved','closed']" :key="s"
                @click="setStatus(s)" :disabled="saving"
                :class="['w-full py-2 text-xs font-semibold rounded-xl border transition-colors disabled:opacity-50',
                  selected.status === s
                    ? 'bg-green-700 text-white border-green-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50']">
                {{ s.replace(/_/g,' ').replace(/\bw/g, l => l.toUpperCase()) }}
              </button>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p class="text-xs font-bold text-gray-500 uppercase mb-2">Admin Notes (internal)</p>
            <textarea v-model="adminNotes" rows="3"
              class="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs resize-none focus:outline-none focus:border-green-500"
              placeholder="Internal notes not visible to user..."></textarea>
            <button @click="setStatus(selected.status)" :disabled="saving"
              class="mt-2 w-full py-1.5 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50">
              Save notes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`},Kv={name:"Support",data(){return{tickets:[],loading:!0,view:"list",selected:null,selectedMessages:[],form:{subject:"",category:"general",message:"",match_ulid:""},replyText:"",saving:!1,error:null}},async mounted(){await this.load()},methods:{async load(){this.loading=!0;try{const{data:e}=await this.$http.get("/support");this.tickets=e.data||[]}catch{}this.loading=!1},async submit(){var e,t;if(!this.form.subject||!this.form.category||!this.form.message){this.error="Please fill in all required fields.";return}this.saving=!0,this.error=null;try{await this.$http.post("/support",this.form),this.$toast.success("Ticket submitted. We'll respond within 24 hours."),this.form={subject:"",category:"general",message:"",match_ulid:""},this.view="list",await this.load()}catch(s){this.error=((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed to submit."}this.saving=!1},async openTicket(e){var t;this.selected=e,this.view="detail";try{const{data:s}=await this.$http.get("/support/"+e.id);this.selectedMessages=((t=s.data)==null?void 0:t.messages)||[]}catch{}},async reply(){var e,t;if(this.replyText.trim()){this.saving=!0;try{await this.$http.post("/support/"+this.selected.id+"/reply",{message:this.replyText}),this.replyText="",await this.openTicket(this.selected),this.$toast.success("Reply sent.")}catch(s){this.$toast.error(((t=(e=s.response)==null?void 0:e.data)==null?void 0:t.message)||"Failed.")}this.saving=!1}},statusColor(e){return{open:"bg-blue-100 text-blue-700",awaiting_support:"bg-yellow-100 text-yellow-700",awaiting_user:"bg-purple-100 text-purple-700",resolved:"bg-green-100 text-green-700",closed:"bg-gray-100 text-gray-500"}[e]||"bg-gray-100 text-gray-600"},statusLabel(e){return{open:"Open",awaiting_support:"Awaiting Support",awaiting_user:"Reply Needed",resolved:"Resolved",closed:"Closed"}[e]||e}},template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-8">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Support</h1>
        <p class="text-sm text-gray-500 mt-0.5">Get help from the eZimConnect team.</p>
      </div>
      <button v-if="view === 'list'" @click="view = 'new'"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        <i class="fas fa-plus text-xs"></i> New ticket
      </button>
      <button v-else @click="view='list'; selected=null"
        class="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
        <i class="fas fa-arrow-left text-xs"></i> Back
      </button>
    </div>

    <!-- New ticket form -->
    <div v-if="view === 'new'" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 class="text-base font-bold text-gray-900 mb-4">Submit a support request</h2>
      <alert-banner v-if="error" type="error" :message="error" class="mb-4" />
      <div class="space-y-4">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Category <span class="text-red-500">*</span></label>
          <select v-model="form.category"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-green-500">
            <option value="general">General Enquiry</option>
            <option value="payment">Payment / Deposit</option>
            <option value="transaction">Transaction Issue</option>
            <option value="account">Account Problem</option>
            <option value="technical">Technical Issue</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Subject <span class="text-red-500">*</span></label>
          <input v-model="form.subject" type="text" placeholder="Brief description of your issue"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Transaction reference <span class="text-gray-400 font-normal">(optional)</span></label>
          <input v-model="form.match_ulid" type="text" placeholder="e.g. TM-A1B2C3D4 or match ULID"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500">
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-1">Message <span class="text-red-500">*</span></label>
          <textarea v-model="form.message" rows="5"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500"
            placeholder="Please describe your issue in detail. Include any relevant dates, amounts, and transaction references."></textarea>
        </div>
        <button @click="submit" :disabled="saving"
          class="w-full py-3 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i>
          Submit ticket
        </button>
        <p class="text-xs text-center text-gray-400">Average response time: under 24 hours on business days.</p>
      </div>
    </div>

    <!-- Ticket detail -->
    <div v-else-if="view === 'detail' && selected">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="font-bold text-gray-900">{{ selected.subject }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ selected.ref }} · {{ $fmt.date(selected.created_at) }}</p>
          </div>
          <span :class="['text-xs px-2.5 py-1 rounded-full font-semibold', statusColor(selected.status)]">
            {{ statusLabel(selected.status) }}
          </span>
        </div>
        <!-- Messages -->
        <div class="space-y-3 mt-4">
          <div v-for="msg in selectedMessages" :key="msg.id"
            :class="['flex', msg.sender_role === 'user' ? 'justify-end' : 'justify-start']">
            <div :class="['max-w-sm rounded-2xl px-4 py-3 text-sm',
              msg.sender_role === 'user'
                ? 'bg-green-700 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm']">
              <p class="font-semibold text-xs mb-1 opacity-70">{{ msg.sender_name }}</p>
              <p class="leading-relaxed">{{ msg.message }}</p>
              <p class="text-xs mt-1.5 opacity-60">{{ $fmt.date(msg.created_at) }}</p>
            </div>
          </div>
        </div>
        <!-- Reply -->
        <div v-if="!['resolved','closed'].includes(selected.status)" class="mt-4 pt-4 border-t border-gray-100">
          <textarea v-model="replyText" rows="3"
            class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-500 mb-2"
            placeholder="Type your reply..."></textarea>
          <button @click="reply" :disabled="saving || !replyText.trim()"
            class="w-full py-2.5 text-sm font-bold text-white rounded-xl disabled:opacity-50 hover:opacity-90"
            style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
            <i v-if="saving" class="fas fa-spinner fa-spin mr-1.5"></i> Send reply
          </button>
        </div>
        <div v-else class="mt-4 pt-3 border-t border-gray-100 text-center text-sm text-gray-400">
          This ticket is {{ selected.status }}. Open a new ticket if you need more help.
        </div>
      </div>
    </div>

    <!-- Tickets list -->
    <div v-else>
      <loading-spinner v-if="loading" />
      <div v-else-if="tickets.length" class="space-y-3">
        <div v-for="t in tickets" :key="t.id"
          @click="openTicket(t)"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md cursor-pointer transition-shadow">
          <div class="flex items-center justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span :class="['text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0', statusColor(t.status)]">
                  {{ statusLabel(t.status) }}
                </span>
                <p class="font-semibold text-gray-900 truncate text-sm">{{ t.subject }}</p>
              </div>
              <p class="text-xs text-gray-400">{{ t.ref }} · {{ $fmt.date(t.updated_at) }}</p>
            </div>
            <i class="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0"></i>
          </div>
        </div>
      </div>
      <div v-else class="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
        <i class="fas fa-headset text-4xl text-gray-300 mb-3 block"></i>
        <p class="font-semibold text-gray-600 mb-1">No support tickets</p>
        <p class="text-sm text-gray-400 mb-4">Need help? Our team is here for you.</p>
        <button @click="view = 'new'"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          <i class="fas fa-plus"></i> Submit a ticket
        </button>
      </div>
    </div>
  </div>
  <app-footer />
</div>`},Yv={name:"HowItWorks",template:`
<div class="min-h-screen bg-gray-50">
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-9 w-auto">
      </router-link>
      <div class="flex gap-3">
        <router-link to="/login"    class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-700">Log in</router-link>
        <router-link to="/register" class="px-4 py-2 text-sm font-bold text-white bg-green-700 rounded-xl hover:bg-green-800">Sign up</router-link>
      </div>
    </div>
  </nav>

  <div class="max-w-4xl mx-auto px-4 py-14">
    <div class="text-center mb-12">
      <span class="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">How TuMa Works</span>
      <h1 class="text-4xl font-black text-gray-900 mt-4 mb-3" style="font-family:Georgia,serif;">Send money to Zimbabwe<br>without the bank fees</h1>
      <p class="text-lg text-gray-500 max-w-xl mx-auto">TuMa connects Australians who want to send AUD with people in Zimbabwe who deliver USD cash — peer-to-peer, secured by escrow.</p>
    </div>

    <!-- Steps -->
    <div class="grid md:grid-cols-2 gap-6 mb-14">
      <div v-for="(step, i) in [
        { n:'1', icon:'fa-user-plus',     title:'Create an account',     desc:'Sign up and verify your identity. KYC takes less than 5 minutes with a photo ID.' },
        { n:'2', icon:'fa-list-alt',      title:'Create an order',       desc:'Specify how much AUD you want to swap. Our calculator shows an estimated USD amount.' },
        { n:'3', icon:'fa-handshake',     title:'Match and negotiate',   desc:'Browse open orders or get matched automatically. Negotiate the AUD/USD rate directly with your partner.' },
        { n:'4', icon:'fa-university',    title:'Deposit AUD to escrow', desc:'Transfer AUD to TuMa's trust account. We hold it securely until delivery is confirmed.' },
        { n:'5', icon:'fa-money-bill-wave',title:'Cash delivered in Zimbabwe',desc:'Your match delivers USD cash to your recipient. They upload a photo with the recipient's ID as proof.' },
        { n:'6', icon:'fa-check-circle',  title:'Confirm and complete',  desc:'You confirm receipt. We release your AUD to your partner. Transaction complete — usually within hours.' },
      ]" :key="step.n"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
          style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">{{ step.n }}</div>
        <div>
          <p class="font-bold text-gray-900 mb-1">{{ step.title }}</p>
          <p class="text-sm text-gray-500 leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </div>

    <div class="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
      <h2 class="text-xl font-black text-gray-900 mb-2">Ready to get started?</h2>
      <p class="text-gray-600 mb-5">Join thousands of Zimbabweans in Australia saving on every transfer.</p>
      <router-link to="/register" class="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        Create free account <i class="fas fa-arrow-right text-xs"></i>
      </router-link>
    </div>
  </div>
</div>`},Gv={name:"SafetyAndEscrow",template:`
<div class="min-h-screen bg-gray-50">
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-9 w-auto">
      </router-link>
      <div class="flex gap-3">
        <router-link to="/login"    class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-700">Log in</router-link>
        <router-link to="/register" class="px-4 py-2 text-sm font-bold text-white bg-green-700 rounded-xl hover:bg-green-800">Sign up</router-link>
      </div>
    </div>
  </nav>

  <div class="max-w-4xl mx-auto px-4 py-14">
    <div class="text-center mb-12">
      <span class="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full">Safety & Escrow</span>
      <h1 class="text-4xl font-black text-gray-900 mt-4 mb-3" style="font-family:Georgia,serif;">Your money is protected<br>every step of the way</h1>
      <p class="text-lg text-gray-500 max-w-xl mx-auto">TuMa's escrow system ensures neither party can lose funds in a legitimate transaction.</p>
    </div>

    <div class="space-y-6 mb-12">
      <div v-for="f in [
        { icon:'fa-lock', color:'green', title:'AUD held in escrow', desc:'When you deposit AUD, it goes into TuMa's regulated trust account — not to the other person. It stays there until you confirm the cash was received in Zimbabwe.' },
        { icon:'fa-id-card', color:'blue', title:'Identity verified', desc:'Every member must verify their identity with a government-issued ID before trading. Anonymous users cannot participate in transactions.' },
        { icon:'fa-camera', color:'purple', title:'Proof of delivery required', desc:'The cash deliverer must upload a photo of the recipient's ID plus a handover photo showing the cash and amount. This creates an undeniable record.' },
        { icon:'fa-gavel', color:'orange', title:'Dispute resolution', desc:'If something goes wrong, raise a dispute. TuMa staff review all evidence and make a binding decision. Funds are never released without proper confirmation.' },
        { icon:'fa-shield-alt', color:'red', title:'Fraud prevention', desc:'Our system monitors transactions for suspicious patterns. Accounts with repeated disputes or fraud indicators are suspended immediately.' },
        { icon:'fa-star', color:'yellow', title:'Community trust scores', desc:'Every member has a trust score based on completed trades, ratings, and on-time delivery. Choose partners with high trust scores for extra peace of mind.' },
      ]" :key="f.title"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4 items-start">
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-'+f.color+'-100']">
          <i :class="['fas', f.icon, 'text-'+f.color+'-600', 'text-lg']"></i>
        </div>
        <div>
          <h3 class="font-bold text-gray-900 mb-1">{{ f.title }}</h3>
          <p class="text-sm text-gray-500 leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Secure vs Risk -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Two delivery options</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-green-50 rounded-xl p-4 border border-green-100">
          <p class="font-bold text-green-800 mb-1"><i class="fas fa-lock mr-2"></i>Secure Delivery (recommended)</p>
          <p class="text-sm text-green-700">AUD is deposited to escrow first. Cash is delivered after verification. Maximum protection for both parties.</p>
        </div>
        <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p class="font-bold text-orange-800 mb-1"><i class="fas fa-exclamation-triangle mr-2"></i>Risk Delivery</p>
          <p class="text-sm text-orange-700">Cash is delivered first, then AUD is deposited. Only use with trusted, verified partners with high trust scores.</p>
        </div>
      </div>
    </div>

    <div class="text-center">
      <router-link to="/register" class="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
        style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
        Start securely <i class="fas fa-arrow-right text-xs"></i>
      </router-link>
    </div>
  </div>
</div>`},Jv={name:"PublicTermsOfService",template:`
<div class="min-h-screen bg-gray-50">
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-9 w-auto">
      </router-link>
      <div class="flex gap-3">
        <router-link to="/login"    class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-700 transition-colors">Log in</router-link>
        <router-link to="/register" class="px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-opacity" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Sign up free</router-link>
      </div>
    </div>
  </nav>

  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
      <div class="mb-8">
        <span class="text-xs font-bold px-3 py-1 rounded-full" style="background:#f0fdf4;color:#1a6b3c;">Legal</span>
        <h1 class="text-3xl font-black text-gray-900 mt-4 mb-2" style="font-family:Georgia,serif;">Terms of Service</h1>
        <p class="text-sm text-gray-400">Last updated: 1 January 2025 · Effective: 1 January 2025</p>
        <div class="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
          By using TuMa you agree to these terms. Please read them carefully before creating an account.
        </div>
      </div>

      <div class="space-y-7 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using TuMa ("Platform", "we", "us"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use this platform. TuMa is operated by TuMa Pty Ltd, registered in Australia (ABN pending).</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">2. Platform Description</h2>
          <p>TuMa is a peer-to-peer currency exchange platform facilitating AUD-to-USD cash transactions between members in Australia and Zimbabwe. TuMa acts as an escrow intermediary — we hold AUD deposits while cash delivery is arranged between members. TuMa is not a bank, money remitter, or financial institution.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">3. Eligibility</h2>
          <p>You must be at least 18 years of age and legally permitted to conduct financial transactions in your jurisdiction. By registering, you confirm that all information provided is accurate and complete. Providing false information may result in permanent account termination.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">4. Identity Verification (KYC)</h2>
          <p>TuMa is committed to Anti-Money Laundering (AML) compliance. You may be required to submit identity documents for verification. We reserve the right to suspend or terminate accounts that do not meet verification requirements or where verification documents are found to be fraudulent.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">5. Transaction Process and Escrow</h2>
          <p>When using the Secure Delivery option, AUD funds deposited into TuMa's trust account are held in escrow until delivery of cash is confirmed. Funds are released only after both parties confirm the transaction. For Risk Delivery, parties transact at their own risk without full escrow protection. TuMa takes no responsibility for losses arising from Risk Delivery transactions.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">6. Exchange Rate</h2>
          <p>TuMa provides an indicative AUD/USD exchange rate for reference only. The actual exchange rate for each transaction is negotiated directly between the two parties. TuMa does not guarantee any particular rate.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">7. Platform Fees</h2>
          <p>TuMa charges a platform fee on each completed transaction, displayed during order creation. Fees are deducted from the AUD amount before release to the receiver. TuMa reserves the right to modify fees with 30 days' notice.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">8. Prohibited Conduct</h2>
          <p>You must not use TuMa for: money laundering or terrorism financing; sanctions evasion; fraudulent transactions; harassing or threatening other members; creating multiple accounts; or any activity that violates Australian or Zimbabwe law.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">9. Disputes</h2>
          <p>If a dispute arises, both parties should attempt to resolve it via the in-platform dispute system. TuMa staff may investigate and make a final determination on disputed transactions. TuMa's decision is binding and final regarding fund release from escrow.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">10. Limitation of Liability</h2>
          <p>TuMa's total liability shall not exceed the transaction fees paid by you in the 6 months preceding the relevant event. We are not liable for delays, losses, or failures caused by events outside our control, including banking delays, network outages, or third-party failures.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">11. Governing Law</h2>
          <p>These terms are governed by the laws of New South Wales, Australia. Disputes shall be subject to the exclusive jurisdiction of the courts of New South Wales.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">12. Contact</h2>
          <p>Questions about these Terms? Contact us at <a href="mailto:legal@tuma.com.au" class="font-medium hover:underline" style="color:#1a6b3c;">legal@tuma.com.au</a></p>
        </section>
      </div>

      <div class="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-3 justify-between items-center">
        <div class="flex flex-wrap gap-3 text-xs text-gray-400">
          <router-link to="/privacy"        class="hover:text-gray-600 transition-colors">Privacy Policy</router-link>
          <router-link to="/aml-policy"     class="hover:text-gray-600 transition-colors">AML Policy</router-link>
          <router-link to="/acceptable-use" class="hover:text-gray-600 transition-colors">Acceptable Use</router-link>
        </div>
        <router-link to="/register" class="text-xs font-bold text-white px-4 py-2 rounded-xl hover:opacity-90" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          Create account
        </router-link>
      </div>
    </div>
  </div>
</div>`},Vv={name:"PublicPrivacyPolicy",template:`
<div class="min-h-screen bg-gray-50">
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-9 w-auto">
      </router-link>
      <div class="flex gap-3">
        <router-link to="/login"    class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-700">Log in</router-link>
        <router-link to="/register" class="px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">Sign up free</router-link>
      </div>
    </div>
  </nav>

  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
      <div class="mb-8">
        <span class="text-xs font-bold px-3 py-1 rounded-full" style="background:#f0fdf4;color:#1a6b3c;">Legal</span>
        <h1 class="text-3xl font-black text-gray-900 mt-4 mb-2" style="font-family:Georgia,serif;">Privacy Policy</h1>
        <p class="text-sm text-gray-400">Last updated: 1 January 2025 · Compliant with the Australian Privacy Act 1988</p>
      </div>

      <div class="space-y-7 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">1. Information We Collect</h2>
          <p><strong>Identity data:</strong> Name, date of birth, nationality, and identity documents for KYC verification.</p>
          <p class="mt-2"><strong>Contact data:</strong> Email address, phone number, and Australian address.</p>
          <p class="mt-2"><strong>Financial data:</strong> Bank account details (BSB and account number) for AUD transactions. We do not store card numbers or CVV codes.</p>
          <p class="mt-2"><strong>Transaction data:</strong> Records of all orders, matches, deposits, and cash deliveries you participate in.</p>
          <p class="mt-2"><strong>Device data:</strong> IP address, browser type, and login history for security and fraud prevention.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">2. How We Use Your Information</h2>
          <p>We use your data to: provide and operate TuMa; verify your identity under AML/KYC obligations; process and secure transactions; prevent fraud; respond to support; send transaction notifications; and improve our platform. We will not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">3. Legal Basis for Processing</h2>
          <p>Performance of contract; legal obligation (AML, KYC requirements); legitimate interests (fraud prevention, security); and consent where you have opted in to optional communications.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">4. Data Sharing</h2>
          <p>We share limited data with: identity verification providers; payment partners; law enforcement when required by law; and cloud infrastructure providers under data processing agreements. Between matched parties, only display name, trust score, and rating are shared — never identity documents.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">5. Data Retention</h2>
          <p>We retain your data for as long as your account is active, plus 7 years for financial and AML compliance records as required by Australian law.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">6. Your Rights</h2>
          <p>Under the Australian Privacy Act 1988 you have the right to: access your personal data; correct inaccuracies; request deletion (subject to legal obligations); restrict processing; and lodge a complaint with the OAIC (oaic.gov.au).</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">7. Security</h2>
          <p>We use industry-standard encryption, secure servers, and strict access controls. All passwords are hashed. Financial data is encrypted at rest and in transit.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">8. Cookies</h2>
          <p>We use session cookies for authentication and performance cookies only. No advertising or third-party tracking cookies are used.</p>
        </section>

        <section>
          <h2 class="font-bold text-gray-900 text-base mb-2">9. Contact</h2>
          <p>Privacy enquiries: <a href="mailto:privacy@tuma.com.au" class="font-medium hover:underline" style="color:#1a6b3c;">privacy@tuma.com.au</a></p>
        </section>
      </div>

      <div class="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-3 justify-between items-center">
        <div class="flex flex-wrap gap-3 text-xs text-gray-400">
          <router-link to="/terms"          class="hover:text-gray-600">Terms of Service</router-link>
          <router-link to="/aml-policy"     class="hover:text-gray-600">AML Policy</router-link>
          <router-link to="/acceptable-use" class="hover:text-gray-600">Acceptable Use</router-link>
        </div>
        <router-link to="/register" class="text-xs font-bold text-white px-4 py-2 rounded-xl hover:opacity-90" style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
          Create account
        </router-link>
      </div>
    </div>
  </div>
</div>`},Xv={name:"AmlPolicy",template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="mb-8">
        <span class="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">Legal</span>
        <h1 class="text-3xl font-black text-gray-900 mt-3 mb-2" style="font-family:Georgia,serif;">AML & Compliance Policy</h1>
        <p class="text-sm text-gray-400">Last updated: 1 January 2025</p>
      </div>
      <div class="prose max-w-none text-gray-700 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Our Commitment</h2>
          <p>eZimConnect is committed to complying with Australian Anti-Money Laundering and Counter-Terrorism Financing (AML/CTF) laws, including the <em>Anti-Money Laundering and Counter-Terrorism Financing Act 2006</em> (Cth) and all relevant AUSTRAC obligations.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Know Your Customer (KYC)</h2>
          <p>All users must verify their identity before conducting transactions. We collect and verify government-issued photo ID and may request additional documentation for enhanced due diligence on high-value transactions or flagged accounts.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Transaction Monitoring</h2>
          <p>eZimConnect monitors all transactions for suspicious patterns. Transactions that trigger risk thresholds are reviewed by our compliance team. We report suspicious matters to AUSTRAC as required by law.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Prohibited Activities</h2>
          <p>The following activities are strictly prohibited on eZimConnect: transactions involving sanctioned individuals or entities; structuring transactions to avoid reporting thresholds; use of the platform for terrorism financing; and transactions involving proceeds of crime.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Record Keeping</h2>
          <p>We retain transaction records, KYC documents, and audit trails for a minimum of 7 years in accordance with Australian law. These records are available to regulators upon lawful request.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Contact</h2>
          <p>To report suspicious activity or for compliance enquiries: <a href="mailto:compliance@ezimconnect.com.au" class="text-green-700 hover:underline">compliance@ezimconnect.com.au</a></p>
        </section>
      </div>
    </div>
  </div>
  <app-footer />
</div>`},Qv={name:"AcceptableUse",template:`
<div class="min-h-screen bg-gray-50">
  <app-nav />
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <div class="mb-8">
        <span class="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">Legal</span>
        <h1 class="text-3xl font-black text-gray-900 mt-3 mb-2" style="font-family:Georgia,serif;">Acceptable Use Policy</h1>
        <p class="text-sm text-gray-400">Last updated: 1 January 2025</p>
      </div>
      <div class="prose max-w-none text-gray-700 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Purpose</h2>
          <p>This policy defines acceptable conduct on eZimConnect to protect members and maintain a safe, trustworthy community.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Permitted Use</h2>
          <p>eZimConnect is designed exclusively for legitimate peer-to-peer AUD/USD currency exchange between Australian-based senders and Zimbabwe-based cash deliverers. You may use eZimConnect to create orders, propose and negotiate matches, arrange cash deliveries, and manage your account.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Prohibited Use</h2>
          <p>You must not: create fake or duplicate accounts; misrepresent your identity or the nature of funds; threaten, harass, or abuse other members; manipulate the rating system; use automated scripts or bots; attempt to circumvent our security measures; or use eZimConnect to process unlawfully obtained funds.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Community Standards</h2>
          <p>Members are expected to communicate respectfully, honour agreed transaction terms, upload accurate delivery and deposit proof, and resolve disputes in good faith. We take community trust seriously — members with a pattern of disputes or low trust scores may be removed.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Consequences of Violation</h2>
          <p>Violations may result in warnings, temporary suspension, permanent ban, or referral to law enforcement, depending on severity.</p>
        </section>
        <section>
          <h2 class="text-base font-bold text-gray-900 mb-2">Reporting Violations</h2>
          <p>To report a member who has violated this policy, use the "Report user" feature on their profile or contact <a href="mailto:safety@ezimconnect.com.au" class="text-green-700 hover:underline">safety@ezimconnect.com.au</a>.</p>
        </section>
      </div>
    </div>
  </div>
  <app-footer />
</div>`},ei=new Nl({mode:"history",scrollBehavior:()=>({y:0}),routes:[{path:"/",component:ev,name:"landing"},{path:"/login",component:tv,name:"login",meta:{guest:!0}},{path:"/register",component:sv,name:"register",meta:{guest:!0}},{path:"/forgot-password",component:av,name:"forgot"},{path:"/verify-email/:id/:hash",component:rv,name:"verify-email"},{path:"/reset-password",component:iv,name:"reset"},{path:"/directory",component:wv,name:"directory"},{path:"/how-it-works",component:Yv,name:"how-it-works"},{path:"/safety-and-escrow",component:Gv,name:"safety-escrow"},{path:"/terms",component:Jv,name:"terms"},{path:"/privacy",component:Vv,name:"privacy"},{path:"/aml-policy",component:Xv,name:"aml"},{path:"/acceptable-use",component:Qv,name:"acceptable-use"},{path:"/profile/:ulid",component:gv,name:"public-profile"},{path:"/onboarding",component:nv,meta:{auth:!0}},{path:"/dashboard",component:ov,meta:{auth:!0}},{path:"/browse",component:lv,meta:{auth:!0}},{path:"/orders/create",component:dv,meta:{auth:!0}},{path:"/orders",component:cv,meta:{auth:!0}},{path:"/orders/:ulid",component:uv,meta:{auth:!0}},{path:"/matches",component:pv,meta:{auth:!0}},{path:"/matches/:ulid",component:fv,meta:{auth:!0}},{path:"/profile",component:mv,meta:{auth:!0}},{path:"/kyc",component:hv,meta:{auth:!0}},{path:"/bank-accounts",component:vv,meta:{auth:!0}},{path:"/settings",component:xv,meta:{auth:!0}},{path:"/notifications",component:bv,meta:{auth:!0}},{path:"/history",component:yv,meta:{auth:!0}},{path:"/rate-alerts",component:_v,meta:{auth:!0}},{path:"/recipients",component:kv,meta:{auth:!0}},{path:"/contacts",component:Sv,meta:{auth:!0}},{path:"/templates",component:$v,meta:{auth:!0}},{path:"/recurring",component:Av,meta:{auth:!0}},{path:"/referral",component:Cv,meta:{auth:!0}},{path:"/disputes",component:Rv,meta:{auth:!0}},{path:"/disputes/:id",component:Tv,meta:{auth:!0}},{path:"/support",component:Kv,meta:{auth:!0}},{path:"/admin/login",component:Pv,meta:{guest:!0}},{path:"/admin/dashboard",component:Dv,meta:{admin:!0}},{path:"/admin/users",component:Fv,meta:{admin:!0}},{path:"/admin/users/:id",component:Ov,meta:{admin:!0}},{path:"/admin/matches",component:Ev,meta:{admin:!0}},{path:"/admin/matches/:ulid",component:Lv,meta:{admin:!0}},{path:"/admin/deposits",component:jv,meta:{admin:!0}},{path:"/admin/disputes",component:Nv,meta:{admin:!0}},{path:"/admin/disputes/:id",component:Uv,meta:{admin:!0}},{path:"/admin/settings",component:Mv,meta:{admin:!0}},{path:"/admin/orders",component:Iv,meta:{admin:!0}},{path:"/admin/rates",component:Bv,meta:{admin:!0}},{path:"/admin/locations",component:zv,meta:{admin:!0}},{path:"/admin/audit-logs",component:Hv,meta:{admin:!0}},{path:"/admin/noticeboard",component:qv,meta:{admin:!0}},{path:"/admin/reports",component:Wv,meta:{admin:!0}},{path:"/admin/support",component:Zv,meta:{admin:!0}},{path:"*",redirect:"/"}]});ei.beforeEach((e,t,s)=>{const r=localStorage.getItem("tuma_token"),a=(()=>{try{return JSON.parse(localStorage.getItem("tuma_user")||"null")}catch{return null}})();if(e.meta.auth&&!r)return s("/login");if(e.meta.admin&&(!r||(a==null?void 0:a.role)!=="admin"))return s("/admin/login");if(e.meta.guest&&r)return s((a==null?void 0:a.role)==="admin"?"/admin/dashboard":"/dashboard");s()});const e0={name:"AppNav",data(){return{mobileOpen:!1,unreadCount:0,unreadPoll:null}},computed:{user(){return this.$auth.user},isAdmin(){var e;return((e=this.user)==null?void 0:e.role)==="admin"}},mounted(){this.$auth.isLoggedIn&&(this.fetchUnreadCount(),this.unreadPoll=setInterval(this.fetchUnreadCount,3e4))},beforeDestroy(){clearInterval(this.unreadPoll)},methods:{async fetchUnreadCount(){try{const{data:e}=await this.$http.get("/user/notifications?per_page=50");this.unreadCount=(e.data||[]).filter(t=>!t.read_at).length||0}catch{}},async logout(){try{await this.$http.post("/auth/logout")}catch{}this.$auth.logout(),this.$router.push("/login")},isActive(e){return this.$route.path===e||this.$route.path.startsWith(e+"/")}},template:`
<nav class="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center gap-4">

      <!-- Logo -->
      <router-link to="/dashboard" class="flex items-center gap-2 flex-shrink-0">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-9 w-auto">
      </router-link>

      <!-- Desktop nav links -->
      <div class="hidden md:flex items-center gap-0.5 flex-1">
        <router-link v-for="link in [
          {to:'/dashboard', label:'Dashboard'},
          {to:'/orders',    label:'Orders'},
          {to:'/browse',    label:'Browse'},
          {to:'/matches',   label:'Matches'},
          {to:'/directory', label:'Directory'},
        ]" :key="link.to" :to="link.to"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            isActive(link.to)
              ? 'text-green-700 bg-green-50'
              : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
          ]">
          {{ link.label }}
        </router-link>
      </div>

      <!-- Right side actions -->
      <div class="flex items-center gap-1 flex-shrink-0">

        <!-- Support / Help -->
        <router-link to="/support"
          class="p-2 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          title="Help & Support">
          <i class="far fa-question-circle text-lg"></i>
        </router-link>

        <!-- Notifications bell -->
        <router-link to="/notifications"
          class="relative p-2 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
          <i class="far fa-bell text-lg"></i>
          <span v-if="unreadCount > 0"
            class="absolute top-0.5 right-0.5 min-w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center px-0.5 font-bold">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </router-link>

        <!-- User menu -->
        <div class="relative group ml-1">
          <button class="flex items-center gap-1.5 py-1.5 px-2 rounded-xl hover:bg-gray-100 transition-colors">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style="background:linear-gradient(135deg,#1a6b3c,#2d9460);">
              {{ user && user.first_name ? user.first_name[0].toUpperCase() : 'U' }}
            </div>
            <span class="hidden md:block text-sm font-semibold text-gray-700 max-w-20 truncate">
              {{ user ? user.first_name || 'Account' : 'Account' }}
            </span>
            <i class="fas fa-chevron-down text-xs text-gray-400 hidden md:block"></i>
          </button>

          <!-- Dropdown -->
          <div class="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
            <div class="px-3 py-2 border-b border-gray-50 mb-1">
              <p class="text-sm font-bold text-gray-900">{{ user && user.first_name }} {{ user && user.last_name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ user && user.email }}</p>
            </div>
            <router-link to="/profile"       class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="far fa-user text-gray-400 w-4 text-center"></i> Profile</router-link>
            <router-link to="/kyc"           class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="fas fa-id-card text-gray-400 w-4 text-center"></i> Verification</router-link>
            <router-link to="/bank-accounts" class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="fas fa-university text-gray-400 w-4 text-center"></i> Bank Accounts</router-link>
            <router-link to="/settings"      class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="fas fa-cog text-gray-400 w-4 text-center"></i> Settings</router-link>
            <router-link to="/referral"      class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="fas fa-gift text-gray-400 w-4 text-center"></i> Referrals</router-link>
            <router-link to="/history"       class="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-700 rounded-lg mx-1 transition-colors"><i class="fas fa-history text-gray-400 w-4 text-center"></i> History</router-link>
            <template v-if="isAdmin">
              <div class="border-t border-gray-100 my-1 mx-1"></div>
              <router-link to="/admin/dashboard" class="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 rounded-lg mx-1 transition-colors">
                <i class="fas fa-shield-alt w-4 text-center"></i> Admin Panel
              </router-link>
            </template>
            <div class="border-t border-gray-100 my-1 mx-1"></div>
            <button @click="logout" class="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors w-full text-left">
              <i class="fas fa-sign-out-alt w-4 text-center"></i> Log out
            </button>
          </div>
        </div>

        <!-- Mobile hamburger -->
        <button @click="mobileOpen = !mobileOpen"
          class="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors ml-1">
          <i :class="mobileOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden border-t border-gray-100 py-2 space-y-0.5">
      <router-link v-for="link in [
        {to:'/dashboard', label:'Dashboard',  icon:'fa-home'},
        {to:'/orders',    label:'Orders',     icon:'fa-list-alt'},
        {to:'/browse',    label:'Browse',     icon:'fa-search'},
        {to:'/matches',   label:'Matches',    icon:'fa-handshake'},
        {to:'/directory', label:'Directory',  icon:'fa-users'},
        {to:'/support',   label:'Help & Support', icon:'fa-question-circle'},
      ]" :key="link.to" :to="link.to"
        @click.native="mobileOpen = false"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
          isActive(link.to)
            ? 'text-green-700 bg-green-50'
            : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
        ]">
        <i :class="['fas', link.icon, 'w-4 text-center text-gray-400']"></i>
        {{ link.label }}
      </router-link>
    </div>
  </div>
</nav>`},t0={name:"AdminNav",props:{active:{type:String,default:""}},data(){return{collapsed:!1,mobileOpen:!1}},computed:{user(){return this.$auth.user},navGroups(){return[{label:"Overview",links:[{to:"/admin/dashboard",label:"Dashboard",icon:"fa-th-large"}]},{label:"Transactions",links:[{to:"/admin/matches",label:"Matches",icon:"fa-handshake"},{to:"/admin/deposits",label:"Deposits",icon:"fa-dollar-sign"},{to:"/admin/orders",label:"Orders",icon:"fa-list-alt"},{to:"/admin/disputes",label:"Disputes",icon:"fa-exclamation-circle",urgent:!0}]},{label:"Users",links:[{to:"/admin/users",label:"Users",icon:"fa-users"},{to:"/admin/reports",label:"Reports",icon:"fa-flag"},{to:"/admin/support",label:"Support",icon:"fa-headset"}]},{label:"Platform",links:[{to:"/admin/rates",label:"Exchange Rates",icon:"fa-chart-line"},{to:"/admin/locations",label:"Locations",icon:"fa-map-marker-alt"},{to:"/admin/noticeboard",label:"Noticeboard",icon:"fa-bullhorn"},{to:"/admin/settings",label:"Settings",icon:"fa-cog"},{to:"/admin/audit-logs",label:"Audit Logs",icon:"fa-clipboard-list"}]}]}},methods:{async logout(){try{await this.$http.post("/auth/logout")}catch{}this.$auth.logout(),this.$router.push("/admin/login")}},template:`
<div>
  <!-- Desktop sidebar (fixed w-60, collapses to w-16) -->
  <aside :class="['fixed top-0 left-0 h-full bg-gray-900 text-white z-40 transition-all duration-200 hidden lg:flex flex-col',
    collapsed ? 'w-16' : 'w-60']">

    <!-- Logo -->
    <div class="flex items-center gap-3 px-4 py-4 border-b border-gray-800 flex-shrink-0">
      <img src="/images/logo.svg" alt="eZimConnect" class="h-7 w-auto flex-shrink-0 brightness-0 invert">
      <p v-if="!collapsed" class="text-xs text-green-400 font-medium whitespace-nowrap">Admin Panel</p>
      <button @click="collapsed = !collapsed" class="ml-auto text-gray-500 hover:text-white flex-shrink-0">
        <i :class="['fas text-xs', collapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
      </button>
    </div>

    <!-- Nav groups -->
    <nav class="flex-1 overflow-y-auto py-3 px-2">
      <div v-for="group in navGroups" :key="group.label" class="mb-4">
        <p v-if="!collapsed" class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1.5">
          {{ group.label }}
        </p>
        <router-link v-for="link in group.links" :key="link.to" :to="link.to"
          :class="['flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-colors group',
            $route.path === link.to || $route.path.startsWith(link.to + '/')
              ? 'bg-green-700 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white']"
          :title="collapsed ? link.label : ''">
          <i :class="['fas flex-shrink-0 w-4 text-center', link.icon,
            link.urgent ? 'text-red-400' : '']"></i>
          <span v-if="!collapsed" class="flex-1 min-w-0 truncate">{{ link.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- User + logout -->
    <div class="border-t border-gray-800 p-3 flex-shrink-0">
      <div v-if="!collapsed" class="flex items-center gap-2 px-2 mb-2">
        <div class="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          {{ user && user.first_name ? user.first_name[0].toUpperCase() : 'A' }}
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ user ? user.first_name : 'Admin' }}</p>
          <p class="text-xs text-gray-500 truncate">{{ user ? user.email : '' }}</p>
        </div>
      </div>
      <button @click="logout"
        :class="['flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors',
          collapsed ? 'justify-center' : '']">
        <i class="fas fa-sign-out-alt flex-shrink-0 w-4 text-center"></i>
        <span v-if="!collapsed">Log out</span>
      </button>
    </div>
  </aside>

  <!-- Mobile top bar -->
  <div class="lg:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-lg">
    <div class="flex items-center gap-2">
      <img src="/images/logo.svg" alt="eZimConnect" class="h-7 w-auto brightness-0 invert">
      <span class="text-xs text-green-400 font-medium ml-1">Admin</span>
    </div>
    <button @click="mobileOpen = !mobileOpen" class="p-2 text-gray-400 hover:text-white">
      <i :class="['fas', mobileOpen ? 'fa-times' : 'fa-bars']"></i>
    </button>
  </div>

  <!-- Mobile overlay -->
  <transition name="fade">
    <div v-if="mobileOpen" class="fixed inset-0 bg-black/50 z-30 lg:hidden" @click="mobileOpen = false"></div>
  </transition>

  <!-- Mobile drawer -->
  <transition name="slide-left">
    <div v-if="mobileOpen" class="fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 lg:hidden flex flex-col shadow-2xl">
      <div class="flex items-center justify-between p-4 border-b border-gray-800">
        <img src="/images/logo.svg" alt="eZimConnect" class="h-7 w-auto brightness-0 invert">
        <button @click="mobileOpen = false" class="text-gray-500 hover:text-white p-1">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <nav class="flex-1 py-3 px-2 overflow-y-auto">
        <div v-for="group in navGroups" :key="group.label" class="mb-4">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1.5">{{ group.label }}</p>
          <router-link v-for="link in group.links" :key="link.to" :to="link.to"
            @click.native="mobileOpen = false"
            :class="['flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              $route.path === link.to ? 'bg-green-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white']">
            <i :class="['fas flex-shrink-0 w-4 text-center', link.icon]"></i>
            {{ link.label }}
          </router-link>
        </div>
      </nav>
      <div class="border-t border-gray-800 p-3">
        <button @click="logout" class="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors">
          <i class="fas fa-sign-out-alt w-4 text-center"></i> Log out
        </button>
      </div>
    </div>
  </transition>

  <style>
  .fade-enter-active,.fade-leave-active{transition:opacity .2s}
  .fade-enter,.fade-leave-to{opacity:0}
  .slide-left-enter-active,.slide-left-leave-active{transition:transform .25s ease}
  .slide-left-enter,.slide-left-leave-to{transform:translateX(-100%)}
  </style>
</div>`},s0={props:{size:{default:"md"}},template:`<div class="flex justify-center items-center py-8">
  <div :class="['animate-spin rounded-full border-t-2 border-green-600 border-r-2 border-gray-200',
    size==='sm'?'w-5 h-5':size==='lg'?'w-12 h-12':'w-8 h-8']"></div>
</div>`},r0={props:{type:{default:"info"},message:String,dismissible:{default:!0}},data(){return{visible:!0}},computed:{classes(){return{info:"bg-blue-50 border-blue-200 text-blue-800",success:"bg-green-50 border-green-200 text-green-800",warning:"bg-yellow-50 border-yellow-200 text-yellow-800",error:"bg-red-50 border-red-200 text-red-800"}[this.type]||"bg-gray-50 border-gray-200 text-gray-800"},icon(){return{info:"fa-info-circle",success:"fa-check-circle",warning:"fa-exclamation-triangle",error:"fa-times-circle"}[this.type]||"fa-info-circle"}},template:`<div v-if="visible && message" :class="['flex items-start gap-3 p-4 rounded-lg border text-sm', classes]">
  <i :class="['fas mt-0.5 flex-shrink-0', icon]"></i>
  <span class="flex-1">{{ message }}</span>
  <button v-if="dismissible" @click="visible=false" class="opacity-60 hover:opacity-100"><i class="fas fa-times"></i></button>
</div>`},a0={props:{status:String},computed:{label(){return this.$fmt?this.$fmt.statusLabel(this.status):this.status},colorClass(){const e=this.status;return["completed"].includes(e)?"bg-green-100 text-green-800":["cancelled","expired","refunded"].includes(e)?"bg-red-100 text-red-800":["disputed"].includes(e)?"bg-orange-100 text-orange-800":["confirmed","deposit_verified"].includes(e)?"bg-blue-100 text-blue-800":["open"].includes(e)?"bg-gray-100 text-gray-700":"bg-yellow-100 text-yellow-800"}},template:`<span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colorClass]">{{ label }}</span>`},i0={props:{user:Object,size:{default:"md"},src:String},computed:{sizeClass(){return{sm:"w-8 h-8 text-xs",md:"w-10 h-10 text-sm",lg:"w-14 h-14 text-base",xl:"w-20 h-20 text-xl"}[this.size]||"w-10 h-10 text-sm"},initials(){return this.user?((this.user.first_name||this.user.display_name||"?")[0]||"?").toUpperCase():"?"},bgColor(){const e=["bg-green-500","bg-blue-500","bg-purple-500","bg-orange-500","bg-teal-500"],t=(this.user&&this.user.id||0)%e.length;return e[t]}},template:`<div :class="['rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0', sizeClass, bgColor]">
  <img v-if="src" :src="src" :class="['rounded-full w-full h-full object-cover']" @error="$event.target.style.display='none'"/>
  <span v-else>{{ initials }}</span>
</div>`},n0={props:{value:Number,max:{default:5},size:{default:"sm"},interactive:{default:!1}},data(){return{hovered:0}},computed:{display(){return this.hovered||this.value||0}},methods:{set(e){this.interactive&&this.$emit("input",e)}},template:`<div class="flex gap-0.5">
  <i v-for="i in max" :key="i"
    :class="['fas fa-star', size==='sm'?'text-sm':'text-base',
      i <= display ? 'text-yellow-400' : 'text-gray-200',
      interactive ? 'cursor-pointer' : '']"
    @mouseenter="interactive && (hovered=i)"
    @mouseleave="interactive && (hovered=0)"
    @click="set(i)"></i>
  <span v-if="value" class="text-xs text-gray-500 ml-1">{{ parseFloat(value).toFixed(1) }}</span>
</div>`},o0={props:{icon:{default:"fa-inbox"},title:String,subtitle:String,actionLabel:String,actionTo:String},template:`<div class="text-center py-16 px-4">
  <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
    <i :class="['fas text-gray-400 text-2xl', icon]"></i>
  </div>
  <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
  <p v-if="subtitle" class="text-gray-500 text-sm mb-6 max-w-sm mx-auto">{{ subtitle }}</p>
  <router-link v-if="actionLabel && actionTo" :to="actionTo"
    class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
    {{ actionLabel }}
  </router-link>
</div>`},l0={props:{show:Boolean,title:String,message:String,confirmLabel:{default:"Confirm"},confirmClass:{default:"bg-red-600 hover:bg-red-700"},loading:Boolean},template:`<div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50" @click="$emit('cancel')"></div>
  <div class="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
    <h3 class="font-semibold text-gray-900 text-lg mb-2">{{ title }}</h3>
    <p class="text-gray-600 text-sm mb-6">{{ message }}</p>
    <div class="flex gap-3 justify-end">
      <button @click="$emit('cancel')" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
      <button @click="$emit('confirm')" :disabled="loading"
        :class="['px-4 py-2 text-sm text-white rounded-lg font-medium transition disabled:opacity-50', confirmClass]">
        <i v-if="loading" class="fas fa-spinner fa-spin mr-1"></i>{{ confirmLabel }}
      </button>
    </div>
  </div>
</div>`},d0={props:{meta:Object},template:`<div v-if="meta && meta.last_page > 1" class="flex items-center justify-between mt-6">
  <p class="text-sm text-gray-500">
    Showing {{ meta.from }}–{{ meta.to }} of {{ meta.total }}
  </p>
  <div class="flex gap-1">
    <button @click="$emit('page', meta.current_page - 1)" :disabled="meta.current_page <= 1"
      class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
      <i class="fas fa-chevron-left text-xs"></i>
    </button>
    <button v-for="p in meta.last_page" :key="p"
      v-if="Math.abs(p - meta.current_page) <= 2"
      @click="$emit('page', p)"
      :class="['px-3 py-1.5 text-sm rounded-lg border transition',
        p === meta.current_page ? 'bg-green-700 text-white border-green-700' : 'border-gray-200 hover:bg-gray-50']">
      {{ p }}
    </button>
    <button @click="$emit('page', meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page"
      class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
      <i class="fas fa-chevron-right text-xs"></i>
    </button>
  </div>
</div>`},c0={template:`<footer class="bg-white border-t border-gray-100 mt-16 py-8">
  <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
    <div class="flex items-center gap-2">
      <img src="/images/logo.svg" alt="eZimConnect" class="h-7 w-auto">
      <span class="text-gray-400 text-sm ml-2">© {{ new Date().getFullYear() }}</span>
    </div>
    <div class="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-gray-500">
      <router-link to="/privacy"        class="hover:text-gray-900 transition-colors">Privacy Policy</router-link>
      <router-link to="/terms"          class="hover:text-gray-900 transition-colors">Terms of Service</router-link>
      <router-link to="/aml-policy"     class="hover:text-gray-900 transition-colors">AML &amp; Compliance</router-link>
      <router-link to="/acceptable-use" class="hover:text-gray-900 transition-colors">Acceptable Use</router-link>
      <router-link to="/support"        class="hover:text-gray-900 transition-colors">Support</router-link>
      <router-link to="/directory"      class="hover:text-gray-900 transition-colors">Directory</router-link>
    </div>
  </div>
</footer>`},u0={props:{label:String,accept:{default:"image/*,.pdf"},hint:String,required:Boolean},data(){return{fileName:"",dragOver:!1}},methods:{onFile(e){const t=e.target&&e.target.files?e.target.files[0]:e.dataTransfer?e.dataTransfer.files[0]:null;t&&(this.fileName=t.name,this.$emit("change",t))}},template:`<div>
  <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">
    {{ label }} <span v-if="required" class="text-red-500">*</span>
  </label>
  <div
    :class="['relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition',
      dragOver ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-gray-50']"
    @dragover.prevent="dragOver=true"
    @dragleave="dragOver=false"
    @drop.prevent="dragOver=false; onFile($event)"
    @click="$refs.input.click()">
    <input ref="input" type="file" :accept="accept" class="hidden" @change="onFile">
    <i v-if="!fileName" class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
    <i v-else class="fas fa-check-circle text-2xl text-green-600 mb-2"></i>
    <p class="text-sm font-medium" :class="fileName ? 'text-green-700' : 'text-gray-700'">
      {{ fileName || 'Click to upload or drag & drop' }}
    </p>
    <p v-if="hint && !fileName" class="text-xs text-gray-400 mt-1">{{ hint }}</p>
  </div>
</div>`},Ae={LoadingSpinner:s0,AlertBanner:r0,StatusBadge:a0,UserAvatar:i0,RatingStars:n0,EmptyState:o0,ConfirmModal:l0,PaginationLinks:d0,AppFooter:c0,FileUpload:u0},p0=Ae.AppFooter,f0=Ae.LoadingSpinner,m0=Ae.AlertBanner,g0=Ae.StatusBadge,h0=Ae.UserAvatar,v0=Ae.RatingStars,x0={name:"SmartCalculator",props:{amountAud:{type:Number,default:0},rate:Object},computed:{feePercent(){var e;return parseFloat(((e=this.rate)==null?void 0:e.platform_fee_percent)||1.5)},feeAud(){return parseFloat((this.amountAud*this.feePercent/100).toFixed(2))},netAud(){return parseFloat((this.amountAud-this.feeAud).toFixed(2))},amountUsd(){var e;return(e=this.rate)!=null&&e.rate?parseFloat((this.netAud*parseFloat(this.rate.rate)).toFixed(2)):0},wuFee(){return parseFloat((this.amountAud*.05).toFixed(2))},savings(){return parseFloat((this.wuFee-this.feeAud).toFixed(2))}},template:`<div v-if="amountAud > 0" class="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
  <div class="flex justify-between">
    <span class="text-gray-600">Amount you send</span>
    <span class="font-semibold text-gray-900">{{ $fmt.aud(amountAud) }}</span>
  </div>
  <div class="flex justify-between text-gray-500">
    <span>Platform fee ({{ feePercent }}%)</span>
    <span class="text-red-500">- {{ $fmt.aud(feeAud) }}</span>
  </div>
  <div class="flex justify-between border-t border-gray-200 pt-2">
    <span class="text-gray-600">Net amount</span>
    <span class="font-medium">{{ $fmt.aud(netAud) }}</span>
  </div>
  <div class="flex justify-between text-gray-500">
    <span>Guide rate <span class="text-xs text-orange-500 font-medium">(indicative)</span></span>
    <span>1 AUD ≈ {{ rate ? parseFloat(rate.rate).toFixed(4) : '—' }} USD</span>
  </div>
  <div class="flex justify-between bg-green-50 -mx-5 px-5 py-3 rounded-b-2xl border-t border-green-100">
    <span class="font-semibold text-green-800">Estimated receive <span class="text-xs font-normal text-green-600">(guide only)</span></span>
    <span class="font-bold text-green-700 text-base">≈ {{ $fmt.usd(amountUsd) }}</span>
  </div>
  <p class="text-xs text-orange-600 flex items-start gap-1.5 pt-1">
    <i class="fas fa-info-circle mt-0.5 flex-shrink-0"></i>
    The actual USD amount is negotiated between you and the other party when you match.
  </p>
  <div v-if="savings > 0" class="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
    <i class="fas fa-piggy-bank"></i>
    <span>You save approx. <strong>{{ $fmt.aud(savings) }}</strong> vs other providers</span>
  </div>
</div>`},b0={name:"StatusTimeline",props:{match:Object},computed:{steps(){const e=this.match||{},t=e.delivery_method==="secure"||e.delivery_method==="pending",s=[{key:"proposed",label:"Match Proposed",icon:"fa-handshake",done:!0},{key:"rate_agreed",label:"Rate Agreed",icon:"fa-check-double",done:!["proposed","negotiating"].includes(e.status)},{key:"delivery_method",label:"Delivery Method",icon:t?"fa-shield-alt":"fa-exclamation-triangle",done:e.delivery_method_agreed,active:e.status==="delivery_method_selecting"}];return t||e.delivery_method==="pending"?s.push({key:"deposit",label:"AUD Deposited",icon:"fa-dollar-sign",done:["deposit_verified","awaiting_delivery","delivery_uploaded","awaiting_confirmation","confirmed","releasing","completed"].includes(e.status),active:["awaiting_deposit","deposit_uploaded"].includes(e.status)},{key:"delivery",label:"Cash Delivered",icon:"fa-money-bill-wave",done:["awaiting_confirmation","confirmed","releasing","completed"].includes(e.status),active:["awaiting_delivery","delivery_uploaded"].includes(e.status)}):s.push({key:"risk_delivery",label:"Cash Delivered First",icon:"fa-money-bill-wave",done:["risk_confirmed","awaiting_risk_deposit","risk_deposit_uploaded","risk_deposit_verified","releasing","completed"].includes(e.status),active:["awaiting_risk_delivery","risk_delivery_uploaded","awaiting_risk_confirmation"].includes(e.status)},{key:"risk_deposit",label:"AUD Deposited",icon:"fa-dollar-sign",done:["risk_deposit_verified","releasing","completed"].includes(e.status),active:["awaiting_risk_deposit","risk_deposit_uploaded"].includes(e.status)}),s.push({key:"confirmed",label:"Receipt Confirmed",icon:"fa-thumbs-up",done:["confirmed","releasing","completed"].includes(e.status)},{key:"completed",label:"Funds Released",icon:"fa-check-circle",done:e.status==="completed",active:e.status==="releasing"}),s}},template:`<div class="relative">
  <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
  <div class="space-y-4">
    <div v-for="(step, i) in steps" :key="step.key" class="flex items-start gap-4 relative">
      <div :class="['relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
        step.done ? 'bg-green-600' : step.active ? 'bg-blue-600 animate-pulse' : 'bg-gray-200']">
        <i :class="['fas text-xs', step.icon, step.done || step.active ? 'text-white' : 'text-gray-400']"></i>
      </div>
      <div class="pt-1 pb-4">
        <p :class="['text-sm font-medium', step.done ? 'text-gray-900' : step.active ? 'text-blue-700' : 'text-gray-400']">
          {{ step.label }}
        </p>
        <p v-if="step.active" class="text-xs text-blue-600 mt-0.5">In progress</p>
      </div>
    </div>
  </div>
</div>`},y0={name:"ChatPanel",props:{matchUlid:String,isClosed:Boolean},data(){return{messages:[],loading:!0,sending:!1,newMessage:"",attachment:null,page:1,meta:null,polling:null}},computed:{myId(){var e;return(e=this.$auth.user)==null?void 0:e.id}},mounted(){this.load(),this.isClosed||(this.polling=setInterval(this.loadNew,8e3))},beforeDestroy(){clearInterval(this.polling)},methods:{async load(){var e;try{const{data:t}=await this.$http.get(`/matches/${this.matchUlid}/messages?page=${this.page}`);this.messages=[...t.data.reverse(),...this.messages],this.meta=(e=t.meta)==null?void 0:e.pagination,await this.$http.post(`/matches/${this.matchUlid}/messages/read`)}catch{}this.loading=!1,this.$nextTick(()=>this.scrollBottom())},async loadNew(){try{const{data:e}=await this.$http.get(`/matches/${this.matchUlid}/messages?page=1`),t=e.data.reverse().filter(s=>!this.messages.find(r=>r.id===s.id));t.length&&(this.messages=[...this.messages,...t],this.$nextTick(()=>this.scrollBottom())),await this.$http.post(`/matches/${this.matchUlid}/messages/read`)}catch{}},async send(){if(!(!this.newMessage.trim()&&!this.attachment||this.sending)){this.sending=!0;try{const e=new FormData;this.newMessage.trim()&&e.append("message",this.newMessage),this.attachment&&e.append("attachment",this.attachment);const{data:t}=await this.$http.post(`/matches/${this.matchUlid}/messages`,e,{headers:{"Content-Type":"multipart/form-data"}});this.messages.push({...t.data,is_mine:!0,sender:this.$auth.user}),this.newMessage="",this.attachment=null,this.$nextTick(()=>this.scrollBottom())}catch{this.$toast.error("Failed to send message")}this.sending=!1}},onFile(e){this.attachment=e.target.files[0]},scrollBottom(){const e=this.$refs.msgList;e&&(e.scrollTop=e.scrollHeight)}},template:`<div class="border border-gray-200 rounded-2xl overflow-hidden flex flex-col" style="height:420px">
  <!-- Header -->
  <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <i class="fas fa-comments text-green-600"></i>
      <span class="text-sm font-medium text-gray-800">Transaction Chat</span>
    </div>
    <span v-if="isClosed" class="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Closed</span>
  </div>

  <!-- Messages -->
  <div ref="msgList" class="flex-1 overflow-y-auto p-4 space-y-3">
    <loading-spinner v-if="loading" />
    <div v-for="msg in messages" :key="msg.id"
      :class="['flex', msg.is_mine ? 'justify-end' : 'justify-start']">
      <div :class="['max-w-xs lg:max-w-sm rounded-2xl px-4 py-2.5 text-sm',
        msg.is_mine ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm']">
        <p>{{ msg.message }}</p>
        <p :class="['text-xs mt-1', msg.is_mine ? 'text-green-200' : 'text-gray-400']">
          {{ msg.created_human }}
          <i v-if="msg.is_mine" :class="['fas ml-1', msg.is_read ? 'fa-check-double text-blue-200' : 'fa-check']"></i>
        </p>
      </div>
    </div>
    <div v-if="!loading && messages.length === 0" class="text-center text-sm text-gray-400 py-8">
      No messages yet. Start the conversation!
    </div>
  </div>

  <!-- Input -->
  <div v-if="!isClosed" class="px-3 py-2 border-t border-gray-200 bg-white flex items-end gap-2">
    <label class="cursor-pointer text-gray-400 hover:text-green-600 p-1.5">
      <i class="fas fa-paperclip"></i>
      <input type="file" class="hidden" accept="image/*,.pdf" @change="onFile">
    </label>
    <div class="flex-1">
      <div v-if="attachment" class="text-xs text-green-700 mb-1 flex items-center gap-1">
        <i class="fas fa-paperclip"></i> {{ attachment.name }}
        <button @click="attachment=null" class="ml-1 text-red-400"><i class="fas fa-times"></i></button>
      </div>
      <textarea v-model="newMessage" @keydown.enter.exact.prevent="send"
        placeholder="Type a message…"
        class="w-full text-sm border-0 resize-none outline-none bg-transparent"
        rows="1"></textarea>
    </div>
    <button @click="send" :disabled="sending || (!newMessage.trim() && !attachment)"
      class="w-9 h-9 bg-green-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-green-700 flex-shrink-0">
      <i class="fas fa-paper-plane text-sm"></i>
    </button>
  </div>

  <div v-if="isClosed" class="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
    This transaction is complete. Chat has been closed.
  </div>
</div>`},w0={name:"TransactionFeedTicker",data(){return{items:[],stats:{},loading:!0}},async mounted(){try{const[e,t]=await Promise.all([this.$http.get("/feed?per_page=20"),this.$http.get("/feed/stats")]);this.items=e.data.data||[],this.stats=t.data.data||{}}catch{}this.loading=!1},computed:{totalVolumeFormatted(){return this.stats.total_volume_aud?"AUD $"+Number(this.stats.total_volume_aud).toLocaleString():"—"},statCards(){return[{label:"Total Sent",value:this.totalVolumeFormatted,icon:"fa-dollar-sign",color:"green"},{label:"Transactions",value:this.stats.total_count||"—",icon:"fa-exchange-alt",color:"blue"},{label:"Success Rate",value:this.stats.success_rate?this.stats.success_rate+"%":"98%",icon:"fa-check-circle",color:"teal"},{label:"Cities Served",value:this.stats.cities_count||16,icon:"fa-map-marker-alt",color:"purple"}]}},methods:{formatDate(e){return e?new Date(e).toLocaleDateString("en-AU",{day:"numeric",month:"short"}):""}},template:`
<div>
  <div v-if="!loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div v-for="(card, i) in statCards" :key="i" class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div :class="'w-9 h-9 rounded-xl flex items-center justify-center mb-2 bg-' + card.color + '-100'">
        <i :class="'fas ' + card.icon + ' text-' + card.color + '-600 text-sm'"></i>
      </div>
      <p class="text-xl font-bold text-gray-900">{{ card.value }}</p>
      <p class="text-xs text-gray-500 mt-0.5">{{ card.label }}</p>
    </div>
  </div>

  <div class="space-y-2">
    <div v-for="item in items.slice(0, 8)" :key="item.id"
      class="flex items-center gap-3 py-3 px-4 bg-white rounded-xl border border-gray-100">
      <div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-700">
          <span class="font-medium">{{ item.display_sender }}</span>
          sent <span class="font-semibold text-gray-900">AUD </span>
          <span>{{ item.amount_aud }}</span>
          &rarr; <span class="font-semibold text-green-700">USD </span>
          <span>{{ item.amount_usd }}</span>
          to {{ item.display_receiver }}
        </p>
      </div>
      <span class="text-xs text-gray-400 flex-shrink-0">{{ formatDate(item.completed_at) }}</span>
    </div>
    <loading-spinner v-if="loading" />
  </div>
</div>`},_0={props:{order:Object,showOwner:{default:!1}},template:`<div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
  <div class="flex items-start justify-between gap-3">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 flex-wrap">
        <span :class="['text-xs font-semibold px-2.5 py-1 rounded-lg',
          order.order_type==='send_to_zim' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
          <i :class="['fas mr-1', order.order_type==='send_to_zim' ? 'fa-paper-plane' : 'fa-hand-holding-usd']"></i>
          {{ order.order_type==='send_to_zim' ? 'Send to ZIM' : 'Receive from ZIM' }}
        </span>
        <span v-if="order.is_boosted" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
          <i class="fas fa-bolt mr-0.5"></i> Boosted
        </span>
        <status-badge :status="order.status" />
      </div>
      <div class="mt-2 flex items-baseline gap-2">
        <span class="text-xl font-bold text-gray-900">{{ $fmt.aud(order.amount_aud) }}</span>
        <span class="text-sm text-gray-400">↔ {{ $fmt.usd(order.amount_usd) }}</span>
      </div>
      <div class="mt-1 flex items-center gap-1 text-xs text-gray-500">
        <i class="fas fa-map-marker-alt text-green-600"></i>
        {{ order.delivery_location?.name }}
        <span v-if="order.delivery_location?.province" class="text-gray-400">· {{ order.delivery_location.province }}</span>
      </div>
    </div>
    <div v-if="showOwner && order.owner" class="text-right flex-shrink-0">
      <user-avatar :user="order.owner" size="sm" />
      <div class="mt-1 flex items-center gap-1 justify-end">
        <i class="fas fa-star text-yellow-400 text-xs"></i>
        <span class="text-xs text-gray-600">{{ order.owner.rating || 'New' }}</span>
      </div>
    </div>
  </div>
  <div class="mt-3 flex items-center justify-between">
    <span class="text-xs text-gray-400">
      <i class="far fa-clock mr-1"></i>{{ order.created_human || $fmt.date(order.created_at) }}
    </span>
    <router-link :to="'/orders/'+order.ulid"
      class="text-xs font-medium text-green-700 hover:text-green-800">View →</router-link>
  </div>
</div>`},k0={props:{match:Object},template:`<div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
  <div class="flex items-center justify-between gap-3">
    <div class="flex-1">
      <div class="flex items-center gap-2 flex-wrap">
        <status-badge :status="match.status" />
        <span v-if="match.delivery_method && match.delivery_method !== 'pending'"
          :class="['text-xs px-2 py-0.5 rounded-full font-medium',
            match.delivery_method==='secure' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700']">
          <i :class="['fas mr-0.5', match.delivery_method==='secure' ? 'fa-shield-alt' : 'fa-exclamation-triangle']"></i>
          {{ match.delivery_method === 'secure' ? 'Secure' : 'Risk' }}
        </span>
        <span v-if="match.unread_messages" class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
          {{ match.unread_messages }} new
        </span>
      </div>
      <div v-if="match.agreed_aud" class="mt-2">
        <span class="text-lg font-bold text-gray-900">{{ $fmt.aud(match.agreed_aud) }}</span>
        <span class="text-sm text-gray-400 ml-1">↔ {{ $fmt.usd(match.agreed_usd) }}</span>
      </div>
      <div v-else-if="match.proposed_aud" class="mt-2 text-sm text-gray-600">
        Proposed: {{ $fmt.aud(match.proposed_aud) }} ↔ {{ $fmt.usd(match.proposed_usd) }}
      </div>
      <p class="text-xs text-gray-400 mt-1">
        <i class="far fa-clock mr-1"></i>{{ $fmt.datetime(match.created_at) }}
      </p>
    </div>
    <router-link :to="'/matches/'+match.ulid"
      class="flex-shrink-0 px-4 py-2 bg-green-700 text-white text-xs font-medium rounded-xl hover:bg-green-800 transition">
      View
    </router-link>
  </div>
</div>`},id={OrderCard:_0,MatchCard:k0},S0=id.OrderCard,$0=id.MatchCard,A0=Ae.EmptyState,C0=Ae.ConfirmModal,R0=Ae.FileUpload,T0=Ae.PaginationLinks;Ve.defaults.baseURL="/api/v1";Ve.defaults.headers.common.Accept="application/json";Ve.defaults.headers.common["Content-Type"]="application/json";Ve.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";Ve.interceptors.request.use(e=>{const t=localStorage.getItem("tuma_token");return t&&(e.headers.Authorization=`Bearer ${t}`),e});Ve.interceptors.response.use(e=>e,e=>{var t;return((t=e.response)==null?void 0:t.status)===401&&(localStorage.removeItem("tuma_token"),localStorage.removeItem("tuma_user"),ei.push("/login").catch(()=>{})),Promise.reject(e)});D.prototype.$http=Ve;D.prototype.$api=Ve;D.use(Nl);D.prototype.$auth={get user(){try{return JSON.parse(localStorage.getItem("tuma_user")||"null")}catch{return null}},get token(){return localStorage.getItem("tuma_token")},get isLoggedIn(){return!!localStorage.getItem("tuma_token")},login(e,t){localStorage.setItem("tuma_token",e),localStorage.setItem("tuma_user",JSON.stringify(t))},logout(){localStorage.removeItem("tuma_token"),localStorage.removeItem("tuma_user")}};D.prototype.$fmt={aud:e=>`AUD $${parseFloat(e||0).toFixed(2)}`,usd:e=>`USD $${parseFloat(e||0).toFixed(2)}`,date:e=>e?new Date(e).toLocaleDateString("en-AU",{day:"numeric",month:"short",year:"numeric"}):"—",datetime:e=>e?new Date(e).toLocaleString("en-AU",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}):"—",statusLabel(e){return{open:"Open",negotiating:"Negotiating",rate_agreed:"Rate Agreed",delivery_method_selecting:"Choosing Delivery",agreed:"Agreed",awaiting_deposit:"Awaiting Deposit",deposit_uploaded:"Proof Uploaded",deposit_verified:"Deposit Verified",awaiting_delivery:"Awaiting Delivery",awaiting_risk_delivery:"Risk Delivery Pending",delivery_uploaded:"Delivered",awaiting_confirmation:"Awaiting Confirmation",confirmed:"Confirmed",releasing:"Releasing Funds",completed:"Completed",cancelled:"Cancelled",expired:"Expired",disputed:"Disputed",refunded:"Refunded"}[e]||e},statusColor(e){return["completed"].includes(e)?"green":["cancelled","expired","refunded"].includes(e)?"red":["disputed"].includes(e)?"orange":["confirmed","deposit_verified","awaiting_delivery"].includes(e)?"blue":"yellow"}};D.prototype.$toast={_show(e,t){const s=document.createElement("div");s.className=`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${t==="success"?"bg-green-600":t==="error"?"bg-red-600":"bg-gray-800"}`,s.textContent=e,document.body.appendChild(s),setTimeout(()=>s.remove(),3500)},success(e){this._show(e,"success")},error(e){this._show(e,"error")},info(e){this._show(e,"info")}};D.component("app-nav",e0);D.component("admin-nav",t0);D.component("app-footer",p0);D.component("loading-spinner",f0);D.component("alert-banner",m0);D.component("status-badge",g0);D.component("user-avatar",h0);D.component("rating-stars",v0);D.component("smart-calculator",x0);D.component("status-timeline",b0);D.component("chat-panel",y0);D.component("transaction-feed-ticker",w0);D.component("order-card",S0);D.component("match-card",$0);D.component("empty-state",A0);D.component("confirm-modal",C0);D.component("file-upload",R0);D.component("pagination-links",T0);new D({el:"#app",router:ei,template:"<router-view />"});
