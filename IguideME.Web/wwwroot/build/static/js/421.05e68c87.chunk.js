"use strict";(self.webpackChunkiguideme=self.webpackChunkiguideme||[]).push([[421],{4525:function(e,n,t){t.d(n,{Z:function(){return O}});var r=t(15671),i=t(43144),c=t(60136),a=t(95212),o=t(72791),s=t(28286),l=t(35714),u=t(64880),d=t(58686),h=t(19603),f=t(29529),m=t(78222),p=t(68961),v=t(55240),Z=t(56200),x=t(68409),j=t(30836),g=t(34633),z=t(6314),y=t(9150),w=t(752),C=t(36090),b=t(91523),M=t(60364),H=t(80184),S=(0,M.$j)((function(e){return{user:e.user}})),G=function(e){(0,c.Z)(t,e);var n=(0,a.Z)(t);function t(){return(0,r.Z)(this,t),n.apply(this,arguments)}return(0,i.Z)(t,[{key:"render",value:function(){var e=this.props.user;return(0,H.jsxs)("div",{id:"adminMenu",children:[(0,H.jsxs)("div",{id:"user",children:[(0,H.jsx)("h3",{children:e?e.name:"Loading profile..."}),(0,H.jsxs)("strong",{children:[(0,H.jsx)(f.Z,{})," Instructor"]})]}),(0,H.jsxs)(C.Z,{selectedKeys:[this.props.menuKey],children:[(0,H.jsx)(C.Z.Item,{icon:(0,H.jsx)(m.Z,{}),children:(0,H.jsx)(b.rU,{to:"/admin",children:"Datamart"})},"datamart"),(0,H.jsx)(C.Z.Item,{icon:(0,H.jsx)(p.Z,{}),children:(0,H.jsx)(b.rU,{to:"/admin/tiles",children:"Tiles"})},"tiles"),(0,H.jsx)(C.Z.Item,{icon:(0,H.jsx)(v.Z,{}),children:(0,H.jsx)(b.rU,{to:"/admin/dashboard",children:"Dashboard"})},"dashboard"),(0,H.jsx)(C.Z.Item,{icon:(0,H.jsx)(Z.Z,{}),children:(0,H.jsx)(b.rU,{to:"/admin/student-overview",children:"Student Overview"})},"studentOverview"),(0,H.jsxs)(C.Z.SubMenu,{icon:(0,H.jsx)(x.Z,{}),title:"Grades",children:[(0,H.jsx)(C.Z.Item,{icon:(0,H.jsx)(j.Z,{}),children:(0,H.jsx)(b.rU,{to:"/admin/grade-predictor",children:"Predictor"})},"gradePredictor"),(0,H.jsx)(C.Z.Item,{icon:(0,H.jsx)(g.Z,{}),children:(0,H.jsx)(b.rU,{to:"/admin/grade-analyzer",children:"Analyzer"})},"gradeAnalyzer")]},"submenu"),(0,H.jsx)(C.Z.Item,{icon:(0,H.jsx)(z.Z,{}),children:(0,H.jsx)(b.rU,{to:"/admin/data-wizard",children:"Data Wizard"})},"dataWizard"),(0,H.jsx)(C.Z.Item,{icon:(0,H.jsx)(y.Z,{}),children:(0,H.jsx)(b.rU,{to:"/admin/notification-centre",children:"Notification Centre"})},"notificationCentre"),(0,H.jsx)(C.Z.Item,{icon:(0,H.jsx)(w.Z,{}),children:(0,H.jsx)(b.rU,{to:"/admin/settings",children:"Settings"})},"settings")]})]})}}]),t}(o.Component),N=S(G),k=function(e){(0,c.Z)(t,e);var n=(0,a.Z)(t);function t(){return(0,r.Z)(this,t),n.apply(this,arguments)}return(0,i.Z)(t,[{key:"render",value:function(){var e=this.props,n=e.isAdmin,t=e.menuKey;return n?(0,H.jsxs)("div",{id:"admin",children:[(0,H.jsx)(l.Z,{}),(0,H.jsxs)(d.Z,{children:[(0,H.jsx)(h.Z,{xs:4,children:(0,H.jsx)(N,{menuKey:t})}),(0,H.jsx)(h.Z,{xs:20,id:"wrapper",className:"".concat("settings"!==t&&"noOverflow"),children:this.props.children})]})]}):(0,H.jsx)(u.l_,{to:"/"})}}]),t}(o.Component),O=(0,s.u)(k)},80421:function(e,n,t){t.r(n),t.d(n,{default:function(){return b}});var r=t(15671),i=t(43144),c=t(60136),a=t(95212),o=t(72791),s=t(4525),l=t(91333),u=t(74165),d=t(37762),h=t(15861),f=t(93433),m=t(87309),p=t(58686),v=t(19603),Z=t(18622),x=t(82622),j=t(86916),g=t(26394),z=t(80184),y=function(e){(0,c.Z)(t,e);var n=(0,a.Z)(t);function t(){var e;(0,r.Z)(this,t);for(var i=arguments.length,c=new Array(i),a=0;a<i;a++)c[a]=arguments[a];return(e=n.call.apply(n,[this].concat(c))).changeWidth=function(n){var t=e.props,r=t.column,i=t.tileGroups,c=JSON.parse(JSON.stringify(r));c.container_width=n,e.props.update(c,i)},e}return(0,i.Z)(t,[{key:"render",value:function(){var e=this,n=this.props,t=n.column,r=n.number,i=n.tileGroups,c=n.allTileGroups,a=[{label:"Small",value:"small"},{label:"Middle",value:"middle"},{label:"Large",value:"large"},{label:"Full width",value:"fullwidth"}];return(0,z.jsxs)("div",{className:"primaryContainer "+t.container_width,children:[(0,z.jsxs)("h2",{children:["Column #",r]}),(0,z.jsx)("label",{children:"Column width"}),(0,z.jsxs)(p.Z,{gutter:[10,10],children:[(0,z.jsx)(v.Z,{flex:"auto",children:(0,z.jsx)(Z.ZP,{onChange:function(n){return n&&e.changeWidth(n.value)},value:a.find((function(e){return e.value===t.container_width}))||null,options:a})}),(0,z.jsx)(v.Z,{flex:"80px",children:(0,z.jsx)(m.Z,{type:"primary",shape:"round",icon:(0,z.jsx)(x.Z,{}),onClick:function(){g.Z.deleteColumn(t.id).then((function(n){return e.props.removeColumn(t)}))},danger:!0})})]}),(0,z.jsx)(l.Z,{}),(0,z.jsx)("h3",{children:"Tile Groups"}),i.sort((function(e,n){return e.position-n.position})).map((function(n){return(0,z.jsx)("div",{style:{marginBottom:10},children:(0,z.jsxs)("span",{children:[(0,z.jsx)(m.Z,{icon:(0,z.jsx)(x.Z,{}),onClick:function(){var t=JSON.parse(JSON.stringify(n));t.column_id=-1,e.props.updateGroup(t)},danger:!0})," ",(0,z.jsx)("b",{children:n.title})]})})})),(0,z.jsx)(Z.ZP,{onChange:function(n){if(n){var r=JSON.parse(JSON.stringify(c.find((function(e){return e.id===n.value}))));r.column_id=t.id,r.position=i.length+1,j.Z.updateTileGroup(r).then((function(n){e.props.updateGroup(n)}))}},options:c.filter((function(e){return e.column_id<1})).map((function(e){return{label:e.title,value:e.id}}))})]})}}]),t}(o.Component),w=t(95909),C=function(e){(0,c.Z)(t,e);var n=(0,a.Z)(t);function t(){var e;(0,r.Z)(this,t);for(var i=arguments.length,c=new Array(i),a=0;a<i;a++)c[a]=arguments[a];return(e=n.call.apply(n,[this].concat(c))).state={loaded:!1,columns:[],tileGroups:[]},e}return(0,i.Z)(t,[{key:"componentDidMount",value:function(){var e=this;g.Z.getColumns().then((function(n){j.Z.getTileGroups().then((function(t){e.setState({loaded:!0,columns:n,tileGroups:t})}))}))}},{key:"render",value:function(){var e=this,n=this.state,t=n.columns,r=n.tileGroups;return n.loaded?(0,z.jsxs)("div",{id:"dashboardLayout",children:[(0,z.jsx)(m.Z,{onClick:function(){g.Z.createColumn({id:-1,position:t.length+1,container_width:"middle"}).then((function(n){e.setState({columns:[].concat((0,f.Z)(t),[n])})}))},children:"Add Column"}),(0,z.jsx)(l.Z,{}),t.sort((function(e,n){return e.position-n.position})).map((function(n,i){return(0,z.jsx)(y,{number:i+1,column:n,allTileGroups:r,tileGroups:r.filter((function(e){return e.column_id===n.id})),removeColumn:function(n){j.Z.getTileGroups().then((function(r){e.setState({columns:t.filter((function(e){return e.id!==n.id})),tileGroups:r})}))},updateGroup:function(n){j.Z.updateTileGroup(n).then((function(t){e.setState({tileGroups:[].concat((0,f.Z)(r.filter((function(e){return e.id!==n.id}))),[t])})}))},update:function(){var i=(0,h.Z)((0,u.Z)().mark((function i(c,a){var o,s,l,h,m,p;return(0,u.Z)().wrap((function(i){for(;;)switch(i.prev=i.next){case 0:if(c.container_width===t.find((function(e){return e.id===c.id})).container_width){i.next=3;break}return i.next=3,g.Z.updateColumn(c);case 3:o=a.filter((function(e){return!r.map((function(e){return e.id})).includes(e.id)})),s=[],l=(0,d.Z)(o),i.prev=6,l.s();case 8:if((h=l.n()).done){i.next=16;break}return m=h.value,i.next=12,j.Z.updateTileGroup(m);case 12:p=i.sent,s.push(p);case 14:i.next=8;break;case 16:i.next=21;break;case 18:i.prev=18,i.t0=i.catch(6),l.e(i.t0);case 21:return i.prev=21,l.f(),i.finish(21);case 24:e.setState({columns:[].concat((0,f.Z)(t.filter((function(e){return e.id!==n.id}))),[c]),tileGroups:[].concat((0,f.Z)(r.filter((function(e){return!o.map((function(e){return e.id})).includes(e.id)}))),(0,f.Z)(o))});case 25:case"end":return i.stop()}}),i,null,[[6,18,21,24]])})));return function(e,n){return i.apply(this,arguments)}}()})}))]}):(0,z.jsx)(w.Z,{small:!0})}}]),t}(o.Component),b=function(e){(0,c.Z)(t,e);var n=(0,a.Z)(t);function t(){return(0,r.Z)(this,t),n.apply(this,arguments)}return(0,i.Z)(t,[{key:"render",value:function(){return(0,z.jsxs)(s.Z,{menuKey:"dashboard",children:[(0,z.jsx)("h1",{children:"Dashboard"}),(0,z.jsx)("span",{children:"Configure the dashboard visible to students."}),(0,z.jsx)(l.Z,{}),(0,z.jsx)(C,{})]})}}]),t}(o.Component)},6314:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),i=t(72791),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M518.3 459a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"}},{tag:"path",attrs:{d:"M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0152.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 01-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"}}]},name:"cloud-upload",theme:"outlined"},a=t(54291),o=function(e,n){return i.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:c}))};o.displayName="CloudUploadOutlined";var s=i.forwardRef(o)},752:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),i=t(72791),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656zM340 683v77c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-77c-10.1 3.3-20.8 5-32 5s-21.9-1.8-32-5zm64-198V264c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v221c10.1-3.3 20.8-5 32-5s21.9 1.8 32 5zm-64 198c10.1 3.3 20.8 5 32 5s21.9-1.8 32-5c41.8-13.5 72-52.7 72-99s-30.2-85.5-72-99c-10.1-3.3-20.8-5-32-5s-21.9 1.8-32 5c-41.8 13.5-72 52.7-72 99s30.2 85.5 72 99zm.1-115.7c.3-.6.7-1.2 1-1.8v-.1l1.2-1.8c.1-.2.2-.3.3-.5.3-.5.7-.9 1-1.4.1-.1.2-.3.3-.4.5-.6.9-1.1 1.4-1.6l.3-.3 1.2-1.2.4-.4c.5-.5 1-.9 1.6-1.4.6-.5 1.1-.9 1.7-1.3.2-.1.3-.2.5-.3.5-.3.9-.7 1.4-1 .1-.1.3-.2.4-.3.6-.4 1.2-.7 1.9-1.1.1-.1.3-.1.4-.2.5-.3 1-.5 1.6-.8l.6-.3c.7-.3 1.3-.6 2-.8.7-.3 1.4-.5 2.1-.7.2-.1.4-.1.6-.2.6-.2 1.1-.3 1.7-.4.2 0 .3-.1.5-.1.7-.2 1.5-.3 2.2-.4.2 0 .3 0 .5-.1.6-.1 1.2-.1 1.8-.2h.6c.8 0 1.5-.1 2.3-.1s1.5 0 2.3.1h.6c.6 0 1.2.1 1.8.2.2 0 .3 0 .5.1.7.1 1.5.2 2.2.4.2 0 .3.1.5.1.6.1 1.2.3 1.7.4.2.1.4.1.6.2.7.2 1.4.4 2.1.7.7.2 1.3.5 2 .8l.6.3c.5.2 1.1.5 1.6.8.1.1.3.1.4.2.6.3 1.3.7 1.9 1.1.1.1.3.2.4.3.5.3 1 .6 1.4 1 .2.1.3.2.5.3.6.4 1.2.9 1.7 1.3s1.1.9 1.6 1.4l.4.4 1.2 1.2.3.3c.5.5 1 1.1 1.4 1.6.1.1.2.3.3.4.4.4.7.9 1 1.4.1.2.2.3.3.5l1.2 1.8s0 .1.1.1a36.18 36.18 0 015.1 18.5c0 6-1.5 11.7-4.1 16.7-.3.6-.7 1.2-1 1.8 0 0 0 .1-.1.1l-1.2 1.8c-.1.2-.2.3-.3.5-.3.5-.7.9-1 1.4-.1.1-.2.3-.3.4-.5.6-.9 1.1-1.4 1.6l-.3.3-1.2 1.2-.4.4c-.5.5-1 .9-1.6 1.4-.6.5-1.1.9-1.7 1.3-.2.1-.3.2-.5.3-.5.3-.9.7-1.4 1-.1.1-.3.2-.4.3-.6.4-1.2.7-1.9 1.1-.1.1-.3.1-.4.2-.5.3-1 .5-1.6.8l-.6.3c-.7.3-1.3.6-2 .8-.7.3-1.4.5-2.1.7-.2.1-.4.1-.6.2-.6.2-1.1.3-1.7.4-.2 0-.3.1-.5.1-.7.2-1.5.3-2.2.4-.2 0-.3 0-.5.1-.6.1-1.2.1-1.8.2h-.6c-.8 0-1.5.1-2.3.1s-1.5 0-2.3-.1h-.6c-.6 0-1.2-.1-1.8-.2-.2 0-.3 0-.5-.1-.7-.1-1.5-.2-2.2-.4-.2 0-.3-.1-.5-.1-.6-.1-1.2-.3-1.7-.4-.2-.1-.4-.1-.6-.2-.7-.2-1.4-.4-2.1-.7-.7-.2-1.3-.5-2-.8l-.6-.3c-.5-.2-1.1-.5-1.6-.8-.1-.1-.3-.1-.4-.2-.6-.3-1.3-.7-1.9-1.1-.1-.1-.3-.2-.4-.3-.5-.3-1-.6-1.4-1-.2-.1-.3-.2-.5-.3-.6-.4-1.2-.9-1.7-1.3s-1.1-.9-1.6-1.4l-.4-.4-1.2-1.2-.3-.3c-.5-.5-1-1.1-1.4-1.6-.1-.1-.2-.3-.3-.4-.4-.4-.7-.9-1-1.4-.1-.2-.2-.3-.3-.5l-1.2-1.8v-.1c-.4-.6-.7-1.2-1-1.8-2.6-5-4.1-10.7-4.1-16.7s1.5-11.7 4.1-16.7zM620 539v221c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V539c-10.1 3.3-20.8 5-32 5s-21.9-1.8-32-5zm64-198v-77c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v77c10.1-3.3 20.8-5 32-5s21.9 1.8 32 5zm-64 198c10.1 3.3 20.8 5 32 5s21.9-1.8 32-5c41.8-13.5 72-52.7 72-99s-30.2-85.5-72-99c-10.1-3.3-20.8-5-32-5s-21.9 1.8-32 5c-41.8 13.5-72 52.7-72 99s30.2 85.5 72 99zm.1-115.7c.3-.6.7-1.2 1-1.8v-.1l1.2-1.8c.1-.2.2-.3.3-.5.3-.5.7-.9 1-1.4.1-.1.2-.3.3-.4.5-.6.9-1.1 1.4-1.6l.3-.3 1.2-1.2.4-.4c.5-.5 1-.9 1.6-1.4.6-.5 1.1-.9 1.7-1.3.2-.1.3-.2.5-.3.5-.3.9-.7 1.4-1 .1-.1.3-.2.4-.3.6-.4 1.2-.7 1.9-1.1.1-.1.3-.1.4-.2.5-.3 1-.5 1.6-.8l.6-.3c.7-.3 1.3-.6 2-.8.7-.3 1.4-.5 2.1-.7.2-.1.4-.1.6-.2.6-.2 1.1-.3 1.7-.4.2 0 .3-.1.5-.1.7-.2 1.5-.3 2.2-.4.2 0 .3 0 .5-.1.6-.1 1.2-.1 1.8-.2h.6c.8 0 1.5-.1 2.3-.1s1.5 0 2.3.1h.6c.6 0 1.2.1 1.8.2.2 0 .3 0 .5.1.7.1 1.5.2 2.2.4.2 0 .3.1.5.1.6.1 1.2.3 1.7.4.2.1.4.1.6.2.7.2 1.4.4 2.1.7.7.2 1.3.5 2 .8l.6.3c.5.2 1.1.5 1.6.8.1.1.3.1.4.2.6.3 1.3.7 1.9 1.1.1.1.3.2.4.3.5.3 1 .6 1.4 1 .2.1.3.2.5.3.6.4 1.2.9 1.7 1.3s1.1.9 1.6 1.4l.4.4 1.2 1.2.3.3c.5.5 1 1.1 1.4 1.6.1.1.2.3.3.4.4.4.7.9 1 1.4.1.2.2.3.3.5l1.2 1.8v.1a36.18 36.18 0 015.1 18.5c0 6-1.5 11.7-4.1 16.7-.3.6-.7 1.2-1 1.8v.1l-1.2 1.8c-.1.2-.2.3-.3.5-.3.5-.7.9-1 1.4-.1.1-.2.3-.3.4-.5.6-.9 1.1-1.4 1.6l-.3.3-1.2 1.2-.4.4c-.5.5-1 .9-1.6 1.4-.6.5-1.1.9-1.7 1.3-.2.1-.3.2-.5.3-.5.3-.9.7-1.4 1-.1.1-.3.2-.4.3-.6.4-1.2.7-1.9 1.1-.1.1-.3.1-.4.2-.5.3-1 .5-1.6.8l-.6.3c-.7.3-1.3.6-2 .8-.7.3-1.4.5-2.1.7-.2.1-.4.1-.6.2-.6.2-1.1.3-1.7.4-.2 0-.3.1-.5.1-.7.2-1.5.3-2.2.4-.2 0-.3 0-.5.1-.6.1-1.2.1-1.8.2h-.6c-.8 0-1.5.1-2.3.1s-1.5 0-2.3-.1h-.6c-.6 0-1.2-.1-1.8-.2-.2 0-.3 0-.5-.1-.7-.1-1.5-.2-2.2-.4-.2 0-.3-.1-.5-.1-.6-.1-1.2-.3-1.7-.4-.2-.1-.4-.1-.6-.2-.7-.2-1.4-.4-2.1-.7-.7-.2-1.3-.5-2-.8l-.6-.3c-.5-.2-1.1-.5-1.6-.8-.1-.1-.3-.1-.4-.2-.6-.3-1.3-.7-1.9-1.1-.1-.1-.3-.2-.4-.3-.5-.3-1-.6-1.4-1-.2-.1-.3-.2-.5-.3-.6-.4-1.2-.9-1.7-1.3s-1.1-.9-1.6-1.4l-.4-.4-1.2-1.2-.3-.3c-.5-.5-1-1.1-1.4-1.6-.1-.1-.2-.3-.3-.4-.4-.4-.7-.9-1-1.4-.1-.2-.2-.3-.3-.5l-1.2-1.8v-.1c-.4-.6-.7-1.2-1-1.8-2.6-5-4.1-10.7-4.1-16.7s1.5-11.7 4.1-16.7z"}}]},name:"control",theme:"outlined"},a=t(54291),o=function(e,n){return i.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:c}))};o.displayName="ControlOutlined";var s=i.forwardRef(o)},78222:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),i=t(72791),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM304 240a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0z"}}]},name:"database",theme:"outlined"},a=t(54291),o=function(e,n){return i.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:c}))};o.displayName="DatabaseOutlined";var s=i.forwardRef(o)},82622:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),i=t(72791),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"}}]},name:"delete",theme:"outlined"},a=t(54291),o=function(e,n){return i.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:c}))};o.displayName="DeleteOutlined";var s=i.forwardRef(o)},30836:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),i=t(72791),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M312.1 591.5c3.1 3.1 8.2 3.1 11.3 0l101.8-101.8 86.1 86.2c3.1 3.1 8.2 3.1 11.3 0l226.3-226.5c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8a8.03 8.03 0 00-11.3 0L517 485.3l-86.1-86.2a8.03 8.03 0 00-11.3 0L275.3 543.4a8.03 8.03 0 000 11.3l36.8 36.8z"}},{tag:"path",attrs:{d:"M904 160H548V96c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H120c-17.7 0-32 14.3-32 32v520c0 17.7 14.3 32 32 32h356.4v32L311.6 884.1a7.92 7.92 0 00-2.3 11l30.3 47.2v.1c2.4 3.7 7.4 4.7 11.1 2.3L512 838.9l161.3 105.8c3.7 2.4 8.7 1.4 11.1-2.3v-.1l30.3-47.2a8 8 0 00-2.3-11L548 776.3V744h356c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 512H160V232h704v440z"}}]},name:"fund-projection-screen",theme:"outlined"},a=t(54291),o=function(e,n){return i.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:c}))};o.displayName="FundProjectionScreenOutlined";var s=i.forwardRef(o)},55240:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),i=t(72791),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M956.9 845.1L896.4 632V168c0-17.7-14.3-32-32-32h-704c-17.7 0-32 14.3-32 32v464L67.9 845.1C60.4 866 75.8 888 98 888h828.8c22.2 0 37.6-22 30.1-42.9zM200.4 208h624v395h-624V208zm228.3 608l8.1-37h150.3l8.1 37H428.7zm224 0l-19.1-86.7c-.8-3.7-4.1-6.3-7.8-6.3H398.2c-3.8 0-7 2.6-7.8 6.3L371.3 816H151l42.3-149h638.2l42.3 149H652.7z"}}]},name:"laptop",theme:"outlined"},a=t(54291),o=function(e,n){return i.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:c}))};o.displayName="LaptopOutlined";var s=i.forwardRef(o)},9150:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),i=t(72791),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M880 112c-3.8 0-7.7.7-11.6 2.3L292 345.9H128c-8.8 0-16 7.4-16 16.6v299c0 9.2 7.2 16.6 16 16.6h101.7c-3.7 11.6-5.7 23.9-5.7 36.4 0 65.9 53.8 119.5 120 119.5 55.4 0 102.1-37.6 115.9-88.4l408.6 164.2c3.9 1.5 7.8 2.3 11.6 2.3 16.9 0 32-14.2 32-33.2V145.2C912 126.2 897 112 880 112zM344 762.3c-26.5 0-48-21.4-48-47.8 0-11.2 3.9-21.9 11-30.4l84.9 34.1c-2 24.6-22.7 44.1-47.9 44.1zm496 58.4L318.8 611.3l-12.9-5.2H184V417.9h121.9l12.9-5.2L840 203.3v617.4z"}}]},name:"notification",theme:"outlined"},a=t(54291),o=function(e,n){return i.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:c}))};o.displayName="NotificationOutlined";var s=i.forwardRef(o)},56200:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),i=t(72791),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M824.2 699.9a301.55 301.55 0 00-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 00-86.4 60.4C345 754.6 314 826.8 312 903.8a8 8 0 008 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5A226.62 226.62 0 01612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c.1 4.3 3.7 7.7 8 7.7h56a8 8 0 008-8.2c-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5a126.86 126.86 0 01-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5A127.3 127.3 0 01612 612zM361.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 01-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 008 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z"}}]},name:"team",theme:"outlined"},a=t(54291),o=function(e,n){return i.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:c}))};o.displayName="TeamOutlined";var s=i.forwardRef(o)},29529:function(e,n,t){t.d(n,{Z:function(){return s}});var r=t(1413),i=t(72791),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"}}]},name:"user",theme:"outlined"},a=t(54291),o=function(e,n){return i.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:c}))};o.displayName="UserOutlined";var s=i.forwardRef(o)}}]);
//# sourceMappingURL=421.05e68c87.chunk.js.map