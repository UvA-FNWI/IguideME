(self.webpackChunkiguideme=self.webpackChunkiguideme||[]).push([[969],{76864:function(e,n,t){"use strict";t.d(n,{Z:function(){return d}});var r=t(1413),o=t(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"}}]},name:"left",theme:"outlined"},c=t(54291),i=function(e,n){return o.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:a}))};i.displayName="LeftOutlined";var d=o.forwardRef(i)},41938:function(e,n,t){"use strict";t.d(n,{Z:function(){return d}});var r=t(1413),o=t(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"}}]},name:"right",theme:"outlined"},c=t(54291),i=function(e,n){return o.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:a}))};i.displayName="RightOutlined";var d=o.forwardRef(i)},19581:function(e,n,t){"use strict";t.d(n,{Z:function(){return a}});var r=t(29439),o=t(72791);function a(){var e=o.useReducer((function(e){return e+1}),0);return(0,r.Z)(e,2)[1]}},52832:function(e,n,t){"use strict";var r=t(72791),o=t(19581),a=t(78295);n.Z=function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],n=(0,r.useRef)({}),t=(0,o.Z)();return(0,r.useEffect)((function(){var r=a.ZP.subscribe((function(r){n.current=r,e&&t()}));return function(){return a.ZP.unsubscribe(r)}}),[]),n.current}},37083:function(e,n,t){"use strict";var r=t(87462),o=t(4942),a=t(29439),c=t(81694),i=t.n(c),d=t(48573),s=t.n(d),l=t(41818),u=t(72791),p=t(71929),f=t(61113),v=t(79393),h=function(e,n){var t={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.indexOf(r)<0&&(t[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)n.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(t[r[o]]=e[r[o]])}return t},g=((0,v.b)("small","default","large"),null);var y=function(e){var n=e.spinPrefixCls,t=e.spinning,c=void 0===t||t,d=e.delay,v=e.className,y=e.size,m=void 0===y?"default":y,k=e.tip,x=e.wrapperClassName,N=e.style,b=e.children,Z=h(e,["spinPrefixCls","spinning","delay","className","size","tip","wrapperClassName","style","children"]),E=u.useState((function(){return c&&!function(e,n){return!!e&&!!n&&!isNaN(Number(n))}(c,d)})),C=(0,a.Z)(E,2),D=C[0],S=C[1];u.useEffect((function(){var e=s()((function(){S(c)}),d);return e(),function(){var n;null===(n=null===e||void 0===e?void 0:e.cancel)||void 0===n||n.call(e)}}),[d,c]);var w=function(t){var a,c=t.direction,d=i()(n,(a={},(0,o.Z)(a,"".concat(n,"-sm"),"small"===m),(0,o.Z)(a,"".concat(n,"-lg"),"large"===m),(0,o.Z)(a,"".concat(n,"-spinning"),D),(0,o.Z)(a,"".concat(n,"-show-text"),!!k),(0,o.Z)(a,"".concat(n,"-rtl"),"rtl"===c),a),v),s=(0,l.Z)(Z,["indicator","prefixCls"]),p=u.createElement("div",(0,r.Z)({},s,{style:N,className:d,"aria-live":"polite","aria-busy":D}),function(e,n){var t=n.indicator,r="".concat(e,"-dot");return null===t?null:(0,f.l$)(t)?(0,f.Tm)(t,{className:i()(t.props.className,r)}):(0,f.l$)(g)?(0,f.Tm)(g,{className:i()(g.props.className,r)}):u.createElement("span",{className:i()(r,"".concat(e,"-dot-spin"))},u.createElement("i",{className:"".concat(e,"-dot-item")}),u.createElement("i",{className:"".concat(e,"-dot-item")}),u.createElement("i",{className:"".concat(e,"-dot-item")}),u.createElement("i",{className:"".concat(e,"-dot-item")}))}(n,e),k?u.createElement("div",{className:"".concat(n,"-text")},k):null);if("undefined"!==typeof b){var h=i()("".concat(n,"-container"),(0,o.Z)({},"".concat(n,"-blur"),D));return u.createElement("div",(0,r.Z)({},s,{className:i()("".concat(n,"-nested-loading"),x)}),D&&u.createElement("div",{key:"loading"},p),u.createElement("div",{className:h,key:"container"},b))}return p};return u.createElement(p.C,null,w)},m=function(e){var n=e.prefixCls,t=(0,u.useContext(p.E_).getPrefixCls)("spin",n),o=(0,r.Z)((0,r.Z)({},e),{spinPrefixCls:t});return u.createElement(y,(0,r.Z)({},o))};m.setDefaultIndicator=function(e){g=e},n.Z=m},20821:function(e,n,t){var r=t(26050),o=/^\s+/;e.exports=function(e){return e?e.slice(0,r(e)+1).replace(o,""):e}},26050:function(e){var n=/\s/;e.exports=function(e){for(var t=e.length;t--&&n.test(e.charAt(t)););return t}},48573:function(e,n,t){var r=t(8092),o=t(50072),a=t(42582),c=Math.max,i=Math.min;e.exports=function(e,n,t){var d,s,l,u,p,f,v=0,h=!1,g=!1,y=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function m(n){var t=d,r=s;return d=s=void 0,v=n,u=e.apply(r,t)}function k(e){return v=e,p=setTimeout(N,n),h?m(e):u}function x(e){var t=e-f;return void 0===f||t>=n||t<0||g&&e-v>=l}function N(){var e=o();if(x(e))return b(e);p=setTimeout(N,function(e){var t=n-(e-f);return g?i(t,l-(e-v)):t}(e))}function b(e){return p=void 0,y&&d?m(e):(d=s=void 0,u)}function Z(){var e=o(),t=x(e);if(d=arguments,s=this,f=e,t){if(void 0===p)return k(f);if(g)return clearTimeout(p),p=setTimeout(N,n),m(f)}return void 0===p&&(p=setTimeout(N,n)),u}return n=a(n)||0,r(t)&&(h=!!t.leading,l=(g="maxWait"in t)?c(a(t.maxWait)||0,n):l,y="trailing"in t?!!t.trailing:y),Z.cancel=function(){void 0!==p&&clearTimeout(p),v=0,d=f=s=p=void 0},Z.flush=function(){return void 0===p?u:b(o())},Z}},70152:function(e,n,t){var r=t(39066),o=t(43141);e.exports=function(e){return"symbol"==typeof e||o(e)&&"[object Symbol]"==r(e)}},50072:function(e,n,t){var r=t(97009);e.exports=function(){return r.Date.now()}},42582:function(e,n,t){var r=t(20821),o=t(8092),a=t(70152),c=/^[-+]0x[0-9a-f]+$/i,i=/^0b[01]+$/i,d=/^0o[0-7]+$/i,s=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(a(e))return NaN;if(o(e)){var n="function"==typeof e.valueOf?e.valueOf():e;e=o(n)?n+"":n}if("string"!=typeof e)return 0===e?e:+e;e=r(e);var t=i.test(e);return t||d.test(e)?s(e.slice(2),t?2:8):c.test(e)?NaN:+e}},69034:function(e,n,t){"use strict";t.d(n,{Z:function(){return C}});var r=t(87462),o=t(4942),a=t(45987),c=t(1413),i=t(15671),d=t(43144),s=t(97326),l=t(60136),u=t(95212),p=t(72791),f=t(81694),v=t.n(f),h=t(54170),g=t(2379),y=function(e){for(var n=e.prefixCls,t=e.level,r=e.isStart,a=e.isEnd,c="".concat(n,"-indent-unit"),i=[],d=0;d<t;d+=1){var s;i.push(p.createElement("span",{key:d,className:v()(c,(s={},(0,o.Z)(s,"".concat(c,"-start"),r[d]),(0,o.Z)(s,"".concat(c,"-end"),a[d]),s))}))}return p.createElement("span",{"aria-hidden":"true",className:"".concat(n,"-indent")},i)},m=p.memo(y),k=t(80153),x=["eventKey","className","style","dragOver","dragOverGapTop","dragOverGapBottom","isLeaf","isStart","isEnd","expanded","selected","checked","halfChecked","loading","domRef","active","data","onMouseMove","selectable"],N="open",b="close",Z=function(e){(0,l.Z)(t,e);var n=(0,u.Z)(t);function t(){var e;(0,i.Z)(this,t);for(var r=arguments.length,o=new Array(r),a=0;a<r;a++)o[a]=arguments[a];return(e=n.call.apply(n,[this].concat(o))).state={dragNodeHighlight:!1},e.selectHandle=void 0,e.onSelectorClick=function(n){(0,e.props.context.onNodeClick)(n,(0,k.F)(e.props)),e.isSelectable()?e.onSelect(n):e.onCheck(n)},e.onSelectorDoubleClick=function(n){(0,e.props.context.onNodeDoubleClick)(n,(0,k.F)(e.props))},e.onSelect=function(n){if(!e.isDisabled()){var t=e.props.context.onNodeSelect;n.preventDefault(),t(n,(0,k.F)(e.props))}},e.onCheck=function(n){if(!e.isDisabled()){var t=e.props,r=t.disableCheckbox,o=t.checked,a=e.props.context.onNodeCheck;if(e.isCheckable()&&!r){n.preventDefault();var c=!o;a(n,(0,k.F)(e.props),c)}}},e.onMouseEnter=function(n){(0,e.props.context.onNodeMouseEnter)(n,(0,k.F)(e.props))},e.onMouseLeave=function(n){(0,e.props.context.onNodeMouseLeave)(n,(0,k.F)(e.props))},e.onContextMenu=function(n){(0,e.props.context.onNodeContextMenu)(n,(0,k.F)(e.props))},e.onDragStart=function(n){var t=e.props.context.onNodeDragStart;n.stopPropagation(),e.setState({dragNodeHighlight:!0}),t(n,(0,s.Z)(e));try{n.dataTransfer.setData("text/plain","")}catch(r){}},e.onDragEnter=function(n){var t=e.props.context.onNodeDragEnter;n.preventDefault(),n.stopPropagation(),t(n,(0,s.Z)(e))},e.onDragOver=function(n){var t=e.props.context.onNodeDragOver;n.preventDefault(),n.stopPropagation(),t(n,(0,s.Z)(e))},e.onDragLeave=function(n){var t=e.props.context.onNodeDragLeave;n.stopPropagation(),t(n,(0,s.Z)(e))},e.onDragEnd=function(n){var t=e.props.context.onNodeDragEnd;n.stopPropagation(),e.setState({dragNodeHighlight:!1}),t(n,(0,s.Z)(e))},e.onDrop=function(n){var t=e.props.context.onNodeDrop;n.preventDefault(),n.stopPropagation(),e.setState({dragNodeHighlight:!1}),t(n,(0,s.Z)(e))},e.onExpand=function(n){var t=e.props,r=t.loading,o=t.context.onNodeExpand;r||o(n,(0,k.F)(e.props))},e.setSelectHandle=function(n){e.selectHandle=n},e.getNodeState=function(){var n=e.props.expanded;return e.isLeaf()?null:n?N:b},e.hasChildren=function(){var n=e.props.eventKey;return!!((e.props.context.keyEntities[n]||{}).children||[]).length},e.isLeaf=function(){var n=e.props,t=n.isLeaf,r=n.loaded,o=e.props.context.loadData,a=e.hasChildren();return!1!==t&&(t||!o&&!a||o&&r&&!a)},e.isDisabled=function(){var n=e.props.disabled;return!(!e.props.context.disabled&&!n)},e.isCheckable=function(){var n=e.props.checkable,t=e.props.context.checkable;return!(!t||!1===n)&&t},e.syncLoadData=function(n){var t=n.expanded,r=n.loading,o=n.loaded,a=e.props.context,c=a.loadData,i=a.onNodeLoad;r||c&&t&&!e.isLeaf()&&(e.hasChildren()||o||i((0,k.F)(e.props)))},e.isDraggable=function(){var n=e.props,t=n.data,r=n.context.draggable;return!(!r||r.nodeDraggable&&!r.nodeDraggable(t))},e.renderDragHandler=function(){var n=e.props.context,t=n.draggable,r=n.prefixCls;return(null===t||void 0===t?void 0:t.icon)?p.createElement("span",{className:"".concat(r,"-draggable-icon")},t.icon):null},e.renderSwitcherIconDom=function(n){var t=e.props.switcherIcon,r=e.props.context.switcherIcon,o=t||r;return"function"===typeof o?o((0,c.Z)((0,c.Z)({},e.props),{},{isLeaf:n})):o},e.renderSwitcher=function(){var n=e.props.expanded,t=e.props.context.prefixCls;if(e.isLeaf()){var r=e.renderSwitcherIconDom(!0);return!1!==r?p.createElement("span",{className:v()("".concat(t,"-switcher"),"".concat(t,"-switcher-noop"))},r):null}var o=v()("".concat(t,"-switcher"),"".concat(t,"-switcher_").concat(n?N:b)),a=e.renderSwitcherIconDom(!1);return!1!==a?p.createElement("span",{onClick:e.onExpand,className:o},a):null},e.renderCheckbox=function(){var n=e.props,t=n.checked,r=n.halfChecked,o=n.disableCheckbox,a=e.props.context.prefixCls,c=e.isDisabled(),i=e.isCheckable();if(!i)return null;var d="boolean"!==typeof i?i:null;return p.createElement("span",{className:v()("".concat(a,"-checkbox"),t&&"".concat(a,"-checkbox-checked"),!t&&r&&"".concat(a,"-checkbox-indeterminate"),(c||o)&&"".concat(a,"-checkbox-disabled")),onClick:e.onCheck},d)},e.renderIcon=function(){var n=e.props.loading,t=e.props.context.prefixCls;return p.createElement("span",{className:v()("".concat(t,"-iconEle"),"".concat(t,"-icon__").concat(e.getNodeState()||"docu"),n&&"".concat(t,"-icon_loading"))})},e.renderSelector=function(){var n,t,r=e.state.dragNodeHighlight,o=e.props,a=o.title,c=o.selected,i=o.icon,d=o.loading,s=o.data,l=e.props.context,u=l.prefixCls,f=l.showIcon,h=l.icon,g=l.loadData,y=l.titleRender,m=e.isDisabled(),k="".concat(u,"-node-content-wrapper");if(f){var x=i||h;n=x?p.createElement("span",{className:v()("".concat(u,"-iconEle"),"".concat(u,"-icon__customize"))},"function"===typeof x?x(e.props):x):e.renderIcon()}else g&&d&&(n=e.renderIcon());t="function"===typeof a?a(s):y?y(s):a;var N=p.createElement("span",{className:"".concat(u,"-title")},t);return p.createElement("span",{ref:e.setSelectHandle,title:"string"===typeof a?a:"",className:v()("".concat(k),"".concat(k,"-").concat(e.getNodeState()||"normal"),!m&&(c||r)&&"".concat(u,"-node-selected")),onMouseEnter:e.onMouseEnter,onMouseLeave:e.onMouseLeave,onContextMenu:e.onContextMenu,onClick:e.onSelectorClick,onDoubleClick:e.onSelectorDoubleClick},n,N,e.renderDropIndicator())},e.renderDropIndicator=function(){var n=e.props,t=n.disabled,r=n.eventKey,o=e.props.context,a=o.draggable,c=o.dropLevelOffset,i=o.dropPosition,d=o.prefixCls,s=o.indent,l=o.dropIndicatorRender,u=o.dragOverNodeKey,p=o.direction;return!t&&!!a&&u===r?l({dropPosition:i,dropLevelOffset:c,indent:s,prefixCls:d,direction:p}):null},e}return(0,d.Z)(t,[{key:"componentDidMount",value:function(){this.syncLoadData(this.props)}},{key:"componentDidUpdate",value:function(){this.syncLoadData(this.props)}},{key:"isSelectable",value:function(){var e=this.props.selectable,n=this.props.context.selectable;return"boolean"===typeof e?e:n}},{key:"render",value:function(){var e,n=this.props,t=n.eventKey,c=n.className,i=n.style,d=n.dragOver,s=n.dragOverGapTop,l=n.dragOverGapBottom,u=n.isLeaf,f=n.isStart,g=n.isEnd,y=n.expanded,N=n.selected,b=n.checked,Z=n.halfChecked,E=n.loading,C=n.domRef,D=n.active,S=(n.data,n.onMouseMove),w=n.selectable,O=(0,a.Z)(n,x),P=this.props.context,K=P.prefixCls,T=P.filterTreeNode,L=P.keyEntities,M=P.dropContainerKey,I=P.dropTargetKey,G=P.draggingNodeKey,H=this.isDisabled(),F=(0,h.Z)(O,{aria:!0,data:!0}),j=(L[t]||{}).level,A=g[g.length-1],_=this.isDraggable(),R=!H&&_,B=G===t,z=void 0!==w?{"aria-selected":!!w}:void 0;return p.createElement("div",(0,r.Z)({ref:C,className:v()(c,"".concat(K,"-treenode"),(e={},(0,o.Z)(e,"".concat(K,"-treenode-disabled"),H),(0,o.Z)(e,"".concat(K,"-treenode-switcher-").concat(y?"open":"close"),!u),(0,o.Z)(e,"".concat(K,"-treenode-checkbox-checked"),b),(0,o.Z)(e,"".concat(K,"-treenode-checkbox-indeterminate"),Z),(0,o.Z)(e,"".concat(K,"-treenode-selected"),N),(0,o.Z)(e,"".concat(K,"-treenode-loading"),E),(0,o.Z)(e,"".concat(K,"-treenode-active"),D),(0,o.Z)(e,"".concat(K,"-treenode-leaf-last"),A),(0,o.Z)(e,"".concat(K,"-treenode-draggable"),_),(0,o.Z)(e,"dragging",B),(0,o.Z)(e,"drop-target",I===t),(0,o.Z)(e,"drop-container",M===t),(0,o.Z)(e,"drag-over",!H&&d),(0,o.Z)(e,"drag-over-gap-top",!H&&s),(0,o.Z)(e,"drag-over-gap-bottom",!H&&l),(0,o.Z)(e,"filter-node",T&&T((0,k.F)(this.props))),e)),style:i,draggable:R,"aria-grabbed":B,onDragStart:R?this.onDragStart:void 0,onDragEnter:_?this.onDragEnter:void 0,onDragOver:_?this.onDragOver:void 0,onDragLeave:_?this.onDragLeave:void 0,onDrop:_?this.onDrop:void 0,onDragEnd:_?this.onDragEnd:void 0,onMouseMove:S},z,F),p.createElement(m,{prefixCls:K,level:j,isStart:f,isEnd:g}),this.renderDragHandler(),this.renderSwitcher(),this.renderCheckbox(),this.renderSelector())}}]),t}(p.Component),E=function(e){return p.createElement(g.k.Consumer,null,(function(n){return p.createElement(Z,(0,r.Z)({},e,{context:n}))}))};E.displayName="TreeNode",E.defaultProps={title:"---"},E.isTreeNode=1;var C=E},2379:function(e,n,t){"use strict";t.d(n,{k:function(){return r}});var r=t(72791).createContext(null)},4359:function(e,n,t){"use strict";t.d(n,{BT:function(){return v},Ds:function(){return l},E6:function(){return h},L0:function(){return i},OM:function(){return f},_5:function(){return c},bt:function(){return s},r7:function(){return g},wA:function(){return u},yx:function(){return d}});var r=t(93433),o=t(71002),a=(t(72791),t(60632));t(69034);function c(e,n){if(!e)return[];var t=e.slice(),r=t.indexOf(n);return r>=0&&t.splice(r,1),t}function i(e,n){var t=(e||[]).slice();return-1===t.indexOf(n)&&t.push(n),t}function d(e){return e.split("-")}function s(e,n){return"".concat(e,"-").concat(n)}function l(e){return e&&e.type&&e.type.isTreeNode}function u(e,n){var t=[];return function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];n.forEach((function(n){var r=n.key,o=n.children;t.push(r),e(o)}))}(n[e].children),t}function p(e){if(e.parent){var n=d(e.pos);return Number(n[n.length-1])===e.parent.children.length-1}return!1}function f(e,n,t,r,o,a,c,i,s,l){var u,f=e.clientX,v=e.clientY,h=e.target.getBoundingClientRect(),g=h.top,y=h.height,m=(("rtl"===l?-1:1)*(((null===o||void 0===o?void 0:o.x)||0)-f)-12)/r,k=i[t.props.eventKey];if(v<g+y/2){var x=c.findIndex((function(e){return e.key===k.key})),N=c[x<=0?0:x-1].key;k=i[N]}var b=k.key,Z=k,E=k.key,C=0,D=0;if(!s.includes(b))for(var S=0;S<m&&p(k);S+=1)k=k.parent,D+=1;var w=n.props.data,O=k.node,P=!0;return function(e){var n=d(e.pos);return 0===Number(n[n.length-1])}(k)&&0===k.level&&v<g+y/2&&a({dragNode:w,dropNode:O,dropPosition:-1})&&k.key===t.props.eventKey?C=-1:(Z.children||[]).length&&s.includes(E)?a({dragNode:w,dropNode:O,dropPosition:0})?C=0:P=!1:0===D?m>-1.5?a({dragNode:w,dropNode:O,dropPosition:1})?C=1:P=!1:a({dragNode:w,dropNode:O,dropPosition:0})?C=0:a({dragNode:w,dropNode:O,dropPosition:1})?C=1:P=!1:a({dragNode:w,dropNode:O,dropPosition:1})?C=1:P=!1,{dropPosition:C,dropLevelOffset:D,dropTargetKey:k.key,dropTargetPos:k.pos,dragOverNodeKey:E,dropContainerKey:0===C?null:(null===(u=k.parent)||void 0===u?void 0:u.key)||null,dropAllowed:P}}function v(e,n){if(e)return n.multiple?e.slice():e.length?[e[0]]:e}function h(e){if(!e)return null;var n;if(Array.isArray(e))n={checkedKeys:e,halfCheckedKeys:void 0};else{if("object"!==(0,o.Z)(e))return(0,a.ZP)(!1,"`checkedKeys` is not an array or an object"),null;n={checkedKeys:e.checked||void 0,halfCheckedKeys:e.halfChecked||void 0}}return n}function g(e,n){var t=new Set;function o(e){if(!t.has(e)){var r=n[e];if(r){t.add(e);var a=r.parent;r.node.disabled||a&&o(a.key)}}}return(e||[]).forEach((function(e){o(e)})),(0,r.Z)(t)}},87613:function(e,n,t){"use strict";t.d(n,{S:function(){return c}});var r=t(60632);function o(e,n){var t=new Set;return e.forEach((function(e){n.has(e)||t.add(e)})),t}function a(e){var n=e||{},t=n.disabled,r=n.disableCheckbox,o=n.checkable;return!(!t&&!r)||!1===o}function c(e,n,t,c){var i,d=[];i=c||a;var s,l=new Set(e.filter((function(e){var n=!!t[e];return n||d.push(e),n}))),u=new Map,p=0;return Object.keys(t).forEach((function(e){var n=t[e],r=n.level,o=u.get(r);o||(o=new Set,u.set(r,o)),o.add(n),p=Math.max(p,r)})),(0,r.ZP)(!d.length,"Tree missing follow keys: ".concat(d.slice(0,100).map((function(e){return"'".concat(e,"'")})).join(", "))),s=!0===n?function(e,n,t,r){for(var a=new Set(e),c=new Set,i=0;i<=t;i+=1)(n.get(i)||new Set).forEach((function(e){var n=e.key,t=e.node,o=e.children,c=void 0===o?[]:o;a.has(n)&&!r(t)&&c.filter((function(e){return!r(e.node)})).forEach((function(e){a.add(e.key)}))}));for(var d=new Set,s=t;s>=0;s-=1)(n.get(s)||new Set).forEach((function(e){var n=e.parent,t=e.node;if(!r(t)&&e.parent&&!d.has(e.parent.key))if(r(e.parent.node))d.add(n.key);else{var o=!0,i=!1;(n.children||[]).filter((function(e){return!r(e.node)})).forEach((function(e){var n=e.key,t=a.has(n);o&&!t&&(o=!1),i||!t&&!c.has(n)||(i=!0)})),o&&a.add(n.key),i&&c.add(n.key),d.add(n.key)}}));return{checkedKeys:Array.from(a),halfCheckedKeys:Array.from(o(c,a))}}(l,u,p,i):function(e,n,t,r,a){for(var c=new Set(e),i=new Set(n),d=0;d<=r;d+=1)(t.get(d)||new Set).forEach((function(e){var n=e.key,t=e.node,r=e.children,o=void 0===r?[]:r;c.has(n)||i.has(n)||a(t)||o.filter((function(e){return!a(e.node)})).forEach((function(e){c.delete(e.key)}))}));i=new Set;for(var s=new Set,l=r;l>=0;l-=1)(t.get(l)||new Set).forEach((function(e){var n=e.parent,t=e.node;if(!a(t)&&e.parent&&!s.has(e.parent.key))if(a(e.parent.node))s.add(n.key);else{var r=!0,o=!1;(n.children||[]).filter((function(e){return!a(e.node)})).forEach((function(e){var n=e.key,t=c.has(n);r&&!t&&(r=!1),o||!t&&!i.has(n)||(o=!0)})),r||c.delete(n.key),o&&i.add(n.key),s.add(n.key)}}));return{checkedKeys:Array.from(c),halfCheckedKeys:Array.from(o(i,c))}}(l,n.halfCheckedKeys,u,p,i),s}},80153:function(e,n,t){"use strict";t.d(n,{F:function(){return k},H8:function(){return m},I8:function(){return y},km:function(){return p},oH:function(){return h},w$:function(){return f},zn:function(){return v}});var r=t(71002),o=t(93433),a=t(1413),c=t(45987),i=t(41818),d=t(85501),s=t(60632),l=t(4359),u=["children"];function p(e,n){return null!==e&&void 0!==e?e:n}function f(e){var n=e||{},t=n.title||"title";return{title:t,_title:n._title||[t],key:n.key||"key",children:n.children||"children"}}function v(e){return function e(n){return(0,d.Z)(n).map((function(n){if(!(0,l.Ds)(n))return(0,s.ZP)(!n,"Tree/TreeNode can only accept TreeNode as children."),null;var t=n.key,r=n.props,o=r.children,i=(0,c.Z)(r,u),d=(0,a.Z)({key:t},i),p=e(o);return p.length&&(d.children=p),d})).filter((function(e){return e}))}(e)}function h(e,n,t){var r=f(t),c=r._title,d=r.key,s=r.children,u=new Set(!0===n?[]:n),v=[];return function e(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return t.map((function(f,h){for(var g,y=(0,l.bt)(r?r.pos:"0",h),m=p(f[d],y),k=0;k<c.length;k+=1){var x=c[k];if(void 0!==f[x]){g=f[x];break}}var N=(0,a.Z)((0,a.Z)({},(0,i.Z)(f,[].concat((0,o.Z)(c),[d,s]))),{},{title:g,key:m,parent:r,pos:y,children:null,data:f,isStart:[].concat((0,o.Z)(r?r.isStart:[]),[0===h]),isEnd:[].concat((0,o.Z)(r?r.isEnd:[]),[h===t.length-1])});return v.push(N),!0===n||u.has(m)?N.children=e(f[s]||[],N):N.children=[],N}))}(e),v}function g(e,n,t){var a,c=("object"===(0,r.Z)(t)?t:{externalGetKey:t})||{},i=c.childrenPropName,d=c.externalGetKey,s=f(c.fieldNames),u=s.key,v=s.children,h=i||v;d?"string"===typeof d?a=function(e){return e[d]}:"function"===typeof d&&(a=function(e){return d(e)}):a=function(e,n){return p(e[u],n)},function t(r,c,i,d){var s=r?r[h]:e,u=r?(0,l.bt)(i.pos,c):"0",p=r?[].concat((0,o.Z)(d),[r]):[];if(r){var f=a(r,u),v={node:r,index:c,pos:u,key:f,parentPos:i.node?i.pos:null,level:i.level+1,nodes:p};n(v)}s&&s.forEach((function(e,n){t(e,n,{node:r,pos:u,level:i?i.level+1:-1},p)}))}(null)}function y(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=n.initWrapper,r=n.processEntity,o=n.onProcessFinished,a=n.externalGetKey,c=n.childrenPropName,i=n.fieldNames,d=arguments.length>2?arguments[2]:void 0,s=a||d,l={},u={},f={posEntities:l,keyEntities:u};return t&&(f=t(f)||f),g(e,(function(e){var n=e.node,t=e.index,o=e.pos,a=e.key,c=e.parentPos,i=e.level,d={node:n,nodes:e.nodes,index:t,key:a,pos:o,level:i},s=p(a,o);l[o]=d,u[s]=d,d.parent=l[c],d.parent&&(d.parent.children=d.parent.children||[],d.parent.children.push(d)),r&&r(d,f)}),{externalGetKey:s,childrenPropName:c,fieldNames:i}),o&&o(f),f}function m(e,n){var t=n.expandedKeys,r=n.selectedKeys,o=n.loadedKeys,a=n.loadingKeys,c=n.checkedKeys,i=n.halfCheckedKeys,d=n.dragOverNodeKey,s=n.dropPosition,l=n.keyEntities[e];return{eventKey:e,expanded:-1!==t.indexOf(e),selected:-1!==r.indexOf(e),loaded:-1!==o.indexOf(e),loading:-1!==a.indexOf(e),checked:-1!==c.indexOf(e),halfChecked:-1!==i.indexOf(e),pos:String(l?l.pos:""),dragOver:d===e&&0===s,dragOverGapTop:d===e&&-1===s,dragOverGapBottom:d===e&&1===s}}function k(e){var n=e.data,t=e.expanded,r=e.selected,o=e.checked,c=e.loaded,i=e.loading,d=e.halfChecked,l=e.dragOver,u=e.dragOverGapTop,p=e.dragOverGapBottom,f=e.pos,v=e.active,h=e.eventKey,g=(0,a.Z)((0,a.Z)({},n),{},{expanded:t,selected:r,checked:o,loaded:c,loading:i,halfChecked:d,dragOver:l,dragOverGapTop:u,dragOverGapBottom:p,pos:f,active:v,key:h});return"props"in g||Object.defineProperty(g,"props",{get:function(){return(0,s.ZP)(!1,"Second param return from event is node data instead of TreeNode instance. Please read value directly instead of reading from `props`."),e}}),g}}}]);
//# sourceMappingURL=969.86c40c11.chunk.js.map