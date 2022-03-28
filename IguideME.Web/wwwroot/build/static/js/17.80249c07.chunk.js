(this.webpackJsonpiguideme=this.webpackJsonpiguideme||[]).push([[17],{1011:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return k}));var n=a(4),c=a(5),r=a(8),i=a(9),l=a(0),o=a.n(l),u=a(197),s=a(262),d=a(198),m=a(13),f=a(18),h=a(7),v=a.n(h),p=a(78),b=a(964),g=a(965),E=a(206),O=a(676),y=(a(794),a(41)),j=a(92),w=function(e){Object(r.a)(a,e);var t=Object(i.a)(a);function a(){var e;Object(n.a)(this,a);for(var c=arguments.length,r=new Array(c),i=0;i<c;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).changeWidth=function(t){var a=e.props,n=a.column,c=a.tileGroups,r=JSON.parse(JSON.stringify(n));r.container_width=t,e.props.update(r,c)},e}return Object(c.a)(a,[{key:"render",value:function(){var e=this,t=this.props,a=t.column,n=t.number,c=t.tileGroups,r=t.allTileGroups,i=[{label:"Small",value:"small"},{label:"Middle",value:"middle"},{label:"Large",value:"large"},{label:"Full width",value:"fullwidth"}];return o.a.createElement("div",{className:"primaryContainer "+a.container_width},o.a.createElement("h2",null,"Column #",n),o.a.createElement("label",null,"Column width"),o.a.createElement(b.a,{gutter:[10,10]},o.a.createElement(g.a,{flex:"auto"},o.a.createElement(E.a,{onChange:function(t){return t&&e.changeWidth(t.value)},value:i.find((function(e){return e.value===a.container_width}))||null,options:i})),o.a.createElement(g.a,{flex:"80px"},o.a.createElement(p.a,{type:"primary",shape:"round",icon:o.a.createElement(O.a,null),onClick:function(){j.a.deleteColumn(a.id).then((function(t){return e.props.removeColumn(a)}))},danger:!0}))),o.a.createElement(s.a,null),o.a.createElement("h3",null,"Tiles"),c.sort((function(e,t){return e.position-t.position})).map((function(t){return o.a.createElement("div",{style:{marginBottom:10}},o.a.createElement("span",null,o.a.createElement(p.a,{icon:o.a.createElement(O.a,null),onClick:function(){var a=JSON.parse(JSON.stringify(t));a.column_id=-1,e.props.updateGroup(a)},danger:!0})," ",o.a.createElement("b",null,t.title)))})),o.a.createElement(E.a,{onChange:function(t){if(t){var n=JSON.parse(JSON.stringify(r.find((function(e){return e.id===t.value}))));n.column_id=a.id,n.position=c.length+1,y.a.updateTileGroup(n).then((function(t){e.props.updateGroup(t)}))}},options:r.filter((function(e){return e.column_id<1})).map((function(e){return{label:e.title,value:e.id}}))}))}}]),a}(l.Component),z=a(33),C=function(e){Object(r.a)(a,e);var t=Object(i.a)(a);function a(){var e;Object(n.a)(this,a);for(var c=arguments.length,r=new Array(c),i=0;i<c;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={loaded:!1,columns:[],tileGroups:[]},e}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this;j.a.getColumns().then((function(t){y.a.getTileGroups().then((function(a){e.setState({loaded:!0,columns:t,tileGroups:a})}))}))}},{key:"render",value:function(){var e=this,t=this.state,a=t.columns,n=t.tileGroups;return t.loaded?o.a.createElement("div",{id:"dashboardLayout"},o.a.createElement(p.a,{onClick:function(){j.a.createColumn({id:-1,position:a.length+1,container_width:"middle"}).then((function(t){e.setState({columns:[].concat(Object(f.a)(a),[t])})}))}},"Add Column"),o.a.createElement(s.a,null),a.sort((function(e,t){return e.position-t.position})).map((function(t,c){return o.a.createElement(w,{number:c+1,column:t,allTileGroups:n,tileGroups:n.filter((function(e){return e.column_id===t.id})),removeColumn:function(t){y.a.getTileGroups().then((function(n){e.setState({columns:a.filter((function(e){return e.id!==t.id})),tileGroups:n})}))},updateGroup:function(t){y.a.updateTileGroup(t).then((function(a){e.setState({tileGroups:[].concat(Object(f.a)(n.filter((function(e){return e.id!==t.id}))),[a])})}))},update:function(){var c=Object(m.a)(v.a.mark((function c(r,i){var l,o,u,s,m,h;return v.a.wrap((function(c){for(;;)switch(c.prev=c.next){case 0:if(r.container_width===a.find((function(e){return e.id===r.id})).container_width){c.next=3;break}return c.next=3,j.a.updateColumn(r);case 3:l=i.filter((function(e){return!n.map((function(e){return e.id})).includes(e.id)})),o=[],u=Object(d.a)(l),c.prev=6,u.s();case 8:if((s=u.n()).done){c.next=16;break}return m=s.value,c.next=12,y.a.updateTileGroup(m);case 12:h=c.sent,o.push(h);case 14:c.next=8;break;case 16:c.next=21;break;case 18:c.prev=18,c.t0=c.catch(6),u.e(c.t0);case 21:return c.prev=21,u.f(),c.finish(21);case 24:e.setState({columns:[].concat(Object(f.a)(a.filter((function(e){return e.id!==t.id}))),[r]),tileGroups:[].concat(Object(f.a)(n.filter((function(e){return!l.map((function(e){return e.id})).includes(e.id)}))),Object(f.a)(l))});case 25:case"end":return c.stop()}}),c,null,[[6,18,21,24]])})));return function(e,t){return c.apply(this,arguments)}}()})}))):o.a.createElement(z.a,{small:!0})}}]),a}(l.Component),k=function(e){Object(r.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){return o.a.createElement(u.a,{menuKey:"dashboard"},o.a.createElement("h1",null,"Dashboard"),o.a.createElement("span",null,"Configure the dashboard visible to students."),o.a.createElement(s.a,null),o.a.createElement(C,null))}}]),a}(l.Component)},185:function(e,t,a){"use strict";a.d(t,"a",(function(){return d}));var n=a(4),c=a(5),r=a(8),i=a(9),l=a(3),o=a(16),u=a(71),s=a(10),d=function(e){Object(r.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,null,[{key:"getStudents",value:function(){return Object(l.a)()?Object(s.a)(u.a):this.client.get("students").then((function(e){return e.data}))}}]),a}(o.a)},191:function(e,t,a){"use strict";var n=a(6),c=a(4),r=a(5),i=a(8),l=a(9),o=a(0),u=a.n(o),s=a(206),d=a(673),m=a(78),f=a(1012),h=a(47),v=a(185),p=a(3),b=a(46),g=(a(192),Object(b.b)((function(e){return{course:e.course,user:e.user}}))),E=function(e){Object(i.a)(a,e);var t=Object(l.a)(a);function a(){var e;Object(c.a)(this,a);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={loaded:!1,students:[]},e}return Object(r.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.props.studentPickView&&v.a.getStudents().then((function(t){return e.setState({students:t,loaded:!0})})),this.setState({loaded:!0})}},{key:"renderInner",value:function(){var e=this;if(this.props.studentPickView){var t=this.state,a=t.students,c=t.loaded;return u.a.createElement(s.a,{id:"studentPicker",isLoading:!c,options:a.sort((function(e,t){return e.name.localeCompare(t.name)})).map((function(e){return{label:e.name,value:e.login_id}})),placeholder:"Choose a student",onChange:function(t){return e.props.setStudent(t?a.find((function(e){return e.login_id===t.value})):null)},isClearable:!0,styles:{control:function(e,t){return Object(n.a)(Object(n.a)({},e),{},{backgroundColor:"transparent",color:"white",border:"1px solid white"})},singleValue:function(e,t){return Object(n.a)(Object(n.a)({},e),{},{color:"white"})}}})}return u.a.createElement("div",{id:"inner"},u.a.createElement("h2",null,this.props.course?this.props.course.course_name:"Loading course..."))}},{key:"render",value:function(){return u.a.createElement(u.a.Fragment,null,u.a.createElement("div",{id:"adminHeader"},this.props.studentPickView?u.a.createElement(h.b,{to:"/admin",style:{float:"right"}},u.a.createElement("h3",null,"Admin Panel")):u.a.createElement("div",{style:{float:"right",padding:20}},u.a.createElement(d.a,{title:"Reload data"},u.a.createElement(m.a,{id:"reload",shape:"circle",style:{backgroundColor:"rgba(255, 255, 255, 0.5)",color:"white"},icon:u.a.createElement(f.a,null)}))),u.a.createElement("div",{id:"navbarContent"},u.a.createElement("div",{id:"brand"},u.a.createElement(h.b,{to:"/"},u.a.createElement("h1",null,"IGuideME"))),this.renderInner())),Object(p.a)()&&u.a.createElement("div",{id:"debugNotice"},"Application is running in ",u.a.createElement("strong",null,"demo")," mode. Changes will not be saved!"))}}]),a}(o.Component);t.a=g(E)},192:function(e,t,a){},195:function(e,t,a){},196:function(e,t,a){},197:function(e,t,a){"use strict";var n=a(4),c=a(5),r=a(8),i=a(9),l=a(0),o=a.n(l),u=a(73),s=a(191),d=a(14),m=a(964),f=a(965),h=a(287),v=a(288),p=a(1014),b=a(289),g=a(290),E=a(1013),O=a(291),y=a(292),j=a(293),w=a(294),z=a(295),C=a(296),k=a(666),x=a(47),M=(a(195),a(46)),S=Object(M.b)((function(e){return{user:e.user}})),V=function(e){Object(r.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){var e=this.props.user;return o.a.createElement("div",{id:"adminMenu"},o.a.createElement("div",{id:"user"},o.a.createElement("h3",null,e?e.name:"Loading profile..."),o.a.createElement("strong",null,o.a.createElement(h.a,null)," Instructor")),o.a.createElement(k.a,{selectedKeys:[this.props.menuKey]},o.a.createElement(k.a.Item,{key:"datamart",icon:o.a.createElement(v.a,null)},o.a.createElement(x.b,{to:"/admin"},"Datamart")),o.a.createElement(k.a.Item,{key:"tiles",icon:o.a.createElement(p.a,null)},o.a.createElement(x.b,{to:"/admin/tiles"},"Tiles")),o.a.createElement(k.a.Item,{key:"dashboard",icon:o.a.createElement(b.a,null)},o.a.createElement(x.b,{to:"/admin/dashboard"},"Dashboard")),o.a.createElement(k.a.Item,{key:"studentOverview",icon:o.a.createElement(g.a,null)},o.a.createElement(x.b,{to:"/admin/student-overview"},"Student Overview")),o.a.createElement(k.a.SubMenu,{key:"submenu",icon:o.a.createElement(E.a,null),title:"Grades"},o.a.createElement(k.a.Item,{key:"gradePredictor",icon:o.a.createElement(O.a,null)},o.a.createElement(x.b,{to:"/admin/grade-predictor"},"Predictor")),o.a.createElement(k.a.Item,{key:"gradeAnalyzer",icon:o.a.createElement(y.a,null)},o.a.createElement(x.b,{to:"/admin/grade-analyzer"},"Analyzer"))),o.a.createElement(k.a.Item,{key:"dataWizard",icon:o.a.createElement(j.a,null)},o.a.createElement(x.b,{to:"/admin/data-wizard"},"Data Wizard")),o.a.createElement(k.a.Item,{key:"analytics",icon:o.a.createElement(w.a,null)},o.a.createElement(x.b,{to:"/admin/analytics"},"Analytics")),o.a.createElement(k.a.Item,{key:"notificationCentre",icon:o.a.createElement(z.a,null)},o.a.createElement(x.b,{to:"/notification-centre"},"Notification Centre")),o.a.createElement(k.a.Item,{key:"settings",icon:o.a.createElement(C.a,null)},o.a.createElement(x.b,{to:"/admin/settings"},"Settings"))))}}]),a}(l.Component),H=S(V),N=(a(196),function(e){Object(r.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){var e=this.props,t=e.isAdmin,a=e.menuKey;return t?o.a.createElement("div",{id:"admin"},o.a.createElement(s.a,null),o.a.createElement(m.a,null,o.a.createElement(f.a,{xs:4},o.a.createElement(H,{menuKey:a})),o.a.createElement(f.a,{xs:20,id:"wrapper",className:"".concat("settings"!==a&&"noOverflow")},this.props.children))):o.a.createElement(d.a,{to:"/"})}}]),a}(l.Component));t.a=Object(u.a)(N)},198:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var n=a(54);function c(e,t){var a="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=Object(n.a)(e))||t&&e&&"number"===typeof e.length){a&&(e=a);var c=0,r=function(){};return{s:r,n:function(){return c>=e.length?{done:!0}:{done:!1,value:e[c++]}},e:function(e){throw e},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,l=!0,o=!1;return{s:function(){a=a.call(e)},n:function(){var e=a.next();return l=e.done,e},e:function(e){o=!0,i=e},f:function(){try{l||null==a.return||a.return()}finally{if(o)throw i}}}}},262:function(e,t,a){"use strict";var n=a(1),c=a(2),r=a(0),i=a(12),l=a.n(i),o=a(168),u=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var c=0;for(n=Object.getOwnPropertySymbols(e);c<n.length;c++)t.indexOf(n[c])<0&&Object.prototype.propertyIsEnumerable.call(e,n[c])&&(a[n[c]]=e[n[c]])}return a};t.a=function(e){return r.createElement(o.a,null,(function(t){var a,i=t.getPrefixCls,o=t.direction,s=e.prefixCls,d=e.type,m=void 0===d?"horizontal":d,f=e.orientation,h=void 0===f?"center":f,v=e.className,p=e.children,b=e.dashed,g=e.plain,E=u(e,["prefixCls","type","orientation","className","children","dashed","plain"]),O=i("divider",s),y=h.length>0?"-".concat(h):h,j=!!p,w=l()(O,"".concat(O,"-").concat(m),(a={},Object(c.a)(a,"".concat(O,"-with-text"),j),Object(c.a)(a,"".concat(O,"-with-text").concat(y),j),Object(c.a)(a,"".concat(O,"-dashed"),!!b),Object(c.a)(a,"".concat(O,"-plain"),!!g),Object(c.a)(a,"".concat(O,"-rtl"),"rtl"===o),a),v);return r.createElement("div",Object(n.a)({className:w},E,{role:"separator"}),p&&r.createElement("span",{className:"".concat(O,"-inner-text")},p))}))}},287:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"}}]},name:"user",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="UserOutlined";t.a=n.forwardRef(i)},288:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM304 240a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0z"}}]},name:"database",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="DatabaseOutlined";t.a=n.forwardRef(i)},289:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M956.9 845.1L896.4 632V168c0-17.7-14.3-32-32-32h-704c-17.7 0-32 14.3-32 32v464L67.9 845.1C60.4 866 75.8 888 98 888h828.8c22.2 0 37.6-22 30.1-42.9zM200.4 208h624v395h-624V208zm228.3 608l8.1-37h150.3l8.1 37H428.7zm224 0l-19.1-86.7c-.8-3.7-4.1-6.3-7.8-6.3H398.2c-3.8 0-7 2.6-7.8 6.3L371.3 816H151l42.3-149h638.2l42.3 149H652.7z"}}]},name:"laptop",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="LaptopOutlined";t.a=n.forwardRef(i)},290:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M824.2 699.9a301.55 301.55 0 00-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 00-86.4 60.4C345 754.6 314 826.8 312 903.8a8 8 0 008 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5A226.62 226.62 0 01612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c.1 4.3 3.7 7.7 8 7.7h56a8 8 0 008-8.2c-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5a126.86 126.86 0 01-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5A127.3 127.3 0 01612 612zM361.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 01-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 008 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z"}}]},name:"team",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="TeamOutlined";t.a=n.forwardRef(i)},291:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M312.1 591.5c3.1 3.1 8.2 3.1 11.3 0l101.8-101.8 86.1 86.2c3.1 3.1 8.2 3.1 11.3 0l226.3-226.5c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8a8.03 8.03 0 00-11.3 0L517 485.3l-86.1-86.2a8.03 8.03 0 00-11.3 0L275.3 543.4a8.03 8.03 0 000 11.3l36.8 36.8z"}},{tag:"path",attrs:{d:"M904 160H548V96c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H120c-17.7 0-32 14.3-32 32v520c0 17.7 14.3 32 32 32h356.4v32L311.6 884.1a7.92 7.92 0 00-2.3 11l30.3 47.2v.1c2.4 3.7 7.4 4.7 11.1 2.3L512 838.9l161.3 105.8c3.7 2.4 8.7 1.4 11.1-2.3v-.1l30.3-47.2a8 8 0 00-2.3-11L548 776.3V744h356c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 512H160V232h704v440z"}}]},name:"fund-projection-screen",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="FundProjectionScreenOutlined";t.a=n.forwardRef(i)},292:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM288 604a64 64 0 10128 0 64 64 0 10-128 0zm118-224a48 48 0 1096 0 48 48 0 10-96 0zm158 228a96 96 0 10192 0 96 96 0 10-192 0zm148-314a56 56 0 10112 0 56 56 0 10-112 0z"}}]},name:"dot-chart",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="DotChartOutlined";t.a=n.forwardRef(i)},293:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M518.3 459a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"}},{tag:"path",attrs:{d:"M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0152.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 01-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"}}]},name:"cloud-upload",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="CloudUploadOutlined";t.a=n.forwardRef(i)},294:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M888 680h-54V540H546v-92h238c8.8 0 16-7.2 16-16V168c0-8.8-7.2-16-16-16H240c-8.8 0-16 7.2-16 16v264c0 8.8 7.2 16 16 16h238v92H190v140h-54c-4.4 0-8 3.6-8 8v176c0 4.4 3.6 8 8 8h176c4.4 0 8-3.6 8-8V688c0-4.4-3.6-8-8-8h-54v-72h220v72h-54c-4.4 0-8 3.6-8 8v176c0 4.4 3.6 8 8 8h176c4.4 0 8-3.6 8-8V688c0-4.4-3.6-8-8-8h-54v-72h220v72h-54c-4.4 0-8 3.6-8 8v176c0 4.4 3.6 8 8 8h176c4.4 0 8-3.6 8-8V688c0-4.4-3.6-8-8-8zM256 805.3c0 1.5-1.2 2.7-2.7 2.7h-58.7c-1.5 0-2.7-1.2-2.7-2.7v-58.7c0-1.5 1.2-2.7 2.7-2.7h58.7c1.5 0 2.7 1.2 2.7 2.7v58.7zm288 0c0 1.5-1.2 2.7-2.7 2.7h-58.7c-1.5 0-2.7-1.2-2.7-2.7v-58.7c0-1.5 1.2-2.7 2.7-2.7h58.7c1.5 0 2.7 1.2 2.7 2.7v58.7zM288 384V216h448v168H288zm544 421.3c0 1.5-1.2 2.7-2.7 2.7h-58.7c-1.5 0-2.7-1.2-2.7-2.7v-58.7c0-1.5 1.2-2.7 2.7-2.7h58.7c1.5 0 2.7 1.2 2.7 2.7v58.7zM360 300a40 40 0 1080 0 40 40 0 10-80 0z"}}]},name:"cluster",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="ClusterOutlined";t.a=n.forwardRef(i)},295:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M880 112c-3.8 0-7.7.7-11.6 2.3L292 345.9H128c-8.8 0-16 7.4-16 16.6v299c0 9.2 7.2 16.6 16 16.6h101.7c-3.7 11.6-5.7 23.9-5.7 36.4 0 65.9 53.8 119.5 120 119.5 55.4 0 102.1-37.6 115.9-88.4l408.6 164.2c3.9 1.5 7.8 2.3 11.6 2.3 16.9 0 32-14.2 32-33.2V145.2C912 126.2 897 112 880 112zM344 762.3c-26.5 0-48-21.4-48-47.8 0-11.2 3.9-21.9 11-30.4l84.9 34.1c-2 24.6-22.7 44.1-47.9 44.1zm496 58.4L318.8 611.3l-12.9-5.2H184V417.9h121.9l12.9-5.2L840 203.3v617.4z"}}]},name:"notification",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="NotificationOutlined";t.a=n.forwardRef(i)},296:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656zM340 683v77c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-77c-10.1 3.3-20.8 5-32 5s-21.9-1.8-32-5zm64-198V264c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v221c10.1-3.3 20.8-5 32-5s21.9 1.8 32 5zm-64 198c10.1 3.3 20.8 5 32 5s21.9-1.8 32-5c41.8-13.5 72-52.7 72-99s-30.2-85.5-72-99c-10.1-3.3-20.8-5-32-5s-21.9 1.8-32 5c-41.8 13.5-72 52.7-72 99s30.2 85.5 72 99zm.1-115.7c.3-.6.7-1.2 1-1.8v-.1l1.2-1.8c.1-.2.2-.3.3-.5.3-.5.7-.9 1-1.4.1-.1.2-.3.3-.4.5-.6.9-1.1 1.4-1.6l.3-.3 1.2-1.2.4-.4c.5-.5 1-.9 1.6-1.4.6-.5 1.1-.9 1.7-1.3.2-.1.3-.2.5-.3.5-.3.9-.7 1.4-1 .1-.1.3-.2.4-.3.6-.4 1.2-.7 1.9-1.1.1-.1.3-.1.4-.2.5-.3 1-.5 1.6-.8l.6-.3c.7-.3 1.3-.6 2-.8.7-.3 1.4-.5 2.1-.7.2-.1.4-.1.6-.2.6-.2 1.1-.3 1.7-.4.2 0 .3-.1.5-.1.7-.2 1.5-.3 2.2-.4.2 0 .3 0 .5-.1.6-.1 1.2-.1 1.8-.2h.6c.8 0 1.5-.1 2.3-.1s1.5 0 2.3.1h.6c.6 0 1.2.1 1.8.2.2 0 .3 0 .5.1.7.1 1.5.2 2.2.4.2 0 .3.1.5.1.6.1 1.2.3 1.7.4.2.1.4.1.6.2.7.2 1.4.4 2.1.7.7.2 1.3.5 2 .8l.6.3c.5.2 1.1.5 1.6.8.1.1.3.1.4.2.6.3 1.3.7 1.9 1.1.1.1.3.2.4.3.5.3 1 .6 1.4 1 .2.1.3.2.5.3.6.4 1.2.9 1.7 1.3s1.1.9 1.6 1.4l.4.4 1.2 1.2.3.3c.5.5 1 1.1 1.4 1.6.1.1.2.3.3.4.4.4.7.9 1 1.4.1.2.2.3.3.5l1.2 1.8s0 .1.1.1a36.18 36.18 0 015.1 18.5c0 6-1.5 11.7-4.1 16.7-.3.6-.7 1.2-1 1.8 0 0 0 .1-.1.1l-1.2 1.8c-.1.2-.2.3-.3.5-.3.5-.7.9-1 1.4-.1.1-.2.3-.3.4-.5.6-.9 1.1-1.4 1.6l-.3.3-1.2 1.2-.4.4c-.5.5-1 .9-1.6 1.4-.6.5-1.1.9-1.7 1.3-.2.1-.3.2-.5.3-.5.3-.9.7-1.4 1-.1.1-.3.2-.4.3-.6.4-1.2.7-1.9 1.1-.1.1-.3.1-.4.2-.5.3-1 .5-1.6.8l-.6.3c-.7.3-1.3.6-2 .8-.7.3-1.4.5-2.1.7-.2.1-.4.1-.6.2-.6.2-1.1.3-1.7.4-.2 0-.3.1-.5.1-.7.2-1.5.3-2.2.4-.2 0-.3 0-.5.1-.6.1-1.2.1-1.8.2h-.6c-.8 0-1.5.1-2.3.1s-1.5 0-2.3-.1h-.6c-.6 0-1.2-.1-1.8-.2-.2 0-.3 0-.5-.1-.7-.1-1.5-.2-2.2-.4-.2 0-.3-.1-.5-.1-.6-.1-1.2-.3-1.7-.4-.2-.1-.4-.1-.6-.2-.7-.2-1.4-.4-2.1-.7-.7-.2-1.3-.5-2-.8l-.6-.3c-.5-.2-1.1-.5-1.6-.8-.1-.1-.3-.1-.4-.2-.6-.3-1.3-.7-1.9-1.1-.1-.1-.3-.2-.4-.3-.5-.3-1-.6-1.4-1-.2-.1-.3-.2-.5-.3-.6-.4-1.2-.9-1.7-1.3s-1.1-.9-1.6-1.4l-.4-.4-1.2-1.2-.3-.3c-.5-.5-1-1.1-1.4-1.6-.1-.1-.2-.3-.3-.4-.4-.4-.7-.9-1-1.4-.1-.2-.2-.3-.3-.5l-1.2-1.8v-.1c-.4-.6-.7-1.2-1-1.8-2.6-5-4.1-10.7-4.1-16.7s1.5-11.7 4.1-16.7zM620 539v221c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V539c-10.1 3.3-20.8 5-32 5s-21.9-1.8-32-5zm64-198v-77c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v77c10.1-3.3 20.8-5 32-5s21.9 1.8 32 5zm-64 198c10.1 3.3 20.8 5 32 5s21.9-1.8 32-5c41.8-13.5 72-52.7 72-99s-30.2-85.5-72-99c-10.1-3.3-20.8-5-32-5s-21.9 1.8-32 5c-41.8 13.5-72 52.7-72 99s30.2 85.5 72 99zm.1-115.7c.3-.6.7-1.2 1-1.8v-.1l1.2-1.8c.1-.2.2-.3.3-.5.3-.5.7-.9 1-1.4.1-.1.2-.3.3-.4.5-.6.9-1.1 1.4-1.6l.3-.3 1.2-1.2.4-.4c.5-.5 1-.9 1.6-1.4.6-.5 1.1-.9 1.7-1.3.2-.1.3-.2.5-.3.5-.3.9-.7 1.4-1 .1-.1.3-.2.4-.3.6-.4 1.2-.7 1.9-1.1.1-.1.3-.1.4-.2.5-.3 1-.5 1.6-.8l.6-.3c.7-.3 1.3-.6 2-.8.7-.3 1.4-.5 2.1-.7.2-.1.4-.1.6-.2.6-.2 1.1-.3 1.7-.4.2 0 .3-.1.5-.1.7-.2 1.5-.3 2.2-.4.2 0 .3 0 .5-.1.6-.1 1.2-.1 1.8-.2h.6c.8 0 1.5-.1 2.3-.1s1.5 0 2.3.1h.6c.6 0 1.2.1 1.8.2.2 0 .3 0 .5.1.7.1 1.5.2 2.2.4.2 0 .3.1.5.1.6.1 1.2.3 1.7.4.2.1.4.1.6.2.7.2 1.4.4 2.1.7.7.2 1.3.5 2 .8l.6.3c.5.2 1.1.5 1.6.8.1.1.3.1.4.2.6.3 1.3.7 1.9 1.1.1.1.3.2.4.3.5.3 1 .6 1.4 1 .2.1.3.2.5.3.6.4 1.2.9 1.7 1.3s1.1.9 1.6 1.4l.4.4 1.2 1.2.3.3c.5.5 1 1.1 1.4 1.6.1.1.2.3.3.4.4.4.7.9 1 1.4.1.2.2.3.3.5l1.2 1.8v.1a36.18 36.18 0 015.1 18.5c0 6-1.5 11.7-4.1 16.7-.3.6-.7 1.2-1 1.8v.1l-1.2 1.8c-.1.2-.2.3-.3.5-.3.5-.7.9-1 1.4-.1.1-.2.3-.3.4-.5.6-.9 1.1-1.4 1.6l-.3.3-1.2 1.2-.4.4c-.5.5-1 .9-1.6 1.4-.6.5-1.1.9-1.7 1.3-.2.1-.3.2-.5.3-.5.3-.9.7-1.4 1-.1.1-.3.2-.4.3-.6.4-1.2.7-1.9 1.1-.1.1-.3.1-.4.2-.5.3-1 .5-1.6.8l-.6.3c-.7.3-1.3.6-2 .8-.7.3-1.4.5-2.1.7-.2.1-.4.1-.6.2-.6.2-1.1.3-1.7.4-.2 0-.3.1-.5.1-.7.2-1.5.3-2.2.4-.2 0-.3 0-.5.1-.6.1-1.2.1-1.8.2h-.6c-.8 0-1.5.1-2.3.1s-1.5 0-2.3-.1h-.6c-.6 0-1.2-.1-1.8-.2-.2 0-.3 0-.5-.1-.7-.1-1.5-.2-2.2-.4-.2 0-.3-.1-.5-.1-.6-.1-1.2-.3-1.7-.4-.2-.1-.4-.1-.6-.2-.7-.2-1.4-.4-2.1-.7-.7-.2-1.3-.5-2-.8l-.6-.3c-.5-.2-1.1-.5-1.6-.8-.1-.1-.3-.1-.4-.2-.6-.3-1.3-.7-1.9-1.1-.1-.1-.3-.2-.4-.3-.5-.3-1-.6-1.4-1-.2-.1-.3-.2-.5-.3-.6-.4-1.2-.9-1.7-1.3s-1.1-.9-1.6-1.4l-.4-.4-1.2-1.2-.3-.3c-.5-.5-1-1.1-1.4-1.6-.1-.1-.2-.3-.3-.4-.4-.4-.7-.9-1-1.4-.1-.2-.2-.3-.3-.5l-1.2-1.8v-.1c-.4-.6-.7-1.2-1-1.8-2.6-5-4.1-10.7-4.1-16.7s1.5-11.7 4.1-16.7z"}}]},name:"control",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="ControlOutlined";t.a=n.forwardRef(i)},676:function(e,t,a){"use strict";var n=a(0),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"}}]},name:"delete",theme:"outlined"},r=a(28),i=function(e,t){return n.createElement(r.a,Object.assign({},e,{ref:t,icon:c}))};i.displayName="DeleteOutlined";t.a=n.forwardRef(i)},794:function(e,t,a){}}]);
//# sourceMappingURL=17.80249c07.chunk.js.map