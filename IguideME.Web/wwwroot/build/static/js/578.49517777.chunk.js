"use strict";(self.webpackChunkiguideme=self.webpackChunkiguideme||[]).push([[578],{1699:function(e,t,n){n.d(t,{Z:function(){return d}});var r=n(15671),i=n(43144),a=n(60136),c=n(95212),s=n(68438),o=n(5674),l=n(68865),u=n(30767),d=function(e){(0,a.Z)(n,e);var t=(0,c.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,null,[{key:"getStudents",value:function(){return(0,s.f)()?(0,u.g)(l.wZ):this.client.get("students").then((function(e){return e.data}))}},{key:"getConsents",value:function(){return(0,s.f)()?(0,u.g)(l.nj):this.client.get("consents").then((function(e){return e.data}))}},{key:"getGoalgrades",value:function(){return(0,s.f)()?(0,u.g)(l.sU):this.client.get("goal-grades").then((function(e){return e.data}))}}]),n}(o.Z)},4525:function(e,t,n){n.d(t,{Z:function(){return _}});var r=n(15671),i=n(43144),a=n(60136),c=n(95212),s=n(72791),o=n(72014),l=n(49109),u=n(64880),d=n(58686),h=n(19603),f=n(29529),v=n(78222),p=n(68961),m=n(55240),Z=n(56200),g=n(68409),x=n(30836),j=n(34633),y=n(6314),w=n(53660),b=n(9150),C=n(752),k=n(36090),S=n(91523),N=n(60364),z=n(80184),I=(0,N.$j)((function(e){return{user:e.user}})),O=function(e){(0,a.Z)(n,e);var t=(0,c.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){var e=this.props.user;return(0,z.jsxs)("div",{id:"adminMenu",children:[(0,z.jsxs)("div",{id:"user",children:[(0,z.jsx)("h3",{children:e?e.name:"Loading profile..."}),(0,z.jsxs)("strong",{children:[(0,z.jsx)(f.Z,{})," Instructor"]})]}),(0,z.jsxs)(k.Z,{selectedKeys:[this.props.menuKey],children:[(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(v.Z,{}),children:(0,z.jsx)(S.rU,{to:"/admin",children:"Datamart"})},"datamart"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(p.Z,{}),children:(0,z.jsx)(S.rU,{to:"/admin/tiles",children:"Tiles"})},"tiles"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(m.Z,{}),children:(0,z.jsx)(S.rU,{to:"/admin/dashboard",children:"Dashboard"})},"dashboard"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(Z.Z,{}),children:(0,z.jsx)(S.rU,{to:"/admin/student-overview",children:"Student Overview"})},"studentOverview"),(0,z.jsxs)(k.Z.SubMenu,{icon:(0,z.jsx)(g.Z,{}),title:"Grades",children:[(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(x.Z,{}),children:(0,z.jsx)(S.rU,{to:"/admin/grade-predictor",children:"Predictor"})},"gradePredictor"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(j.Z,{}),children:(0,z.jsx)(S.rU,{to:"/admin/grade-analyzer",children:"Analyzer"})},"gradeAnalyzer")]},"submenu"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(y.Z,{}),children:(0,z.jsx)(S.rU,{to:"/admin/data-wizard",children:"Data Wizard"})},"dataWizard"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(w.Z,{}),children:(0,z.jsx)(S.rU,{to:"/admin/analytics",children:"Analytics"})},"analytics"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(b.Z,{}),children:(0,z.jsx)(S.rU,{to:"/admin/notification-centre",children:"Notification Centre"})},"notificationCentre"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(C.Z,{}),children:(0,z.jsx)(S.rU,{to:"/admin/settings",children:"Settings"})},"settings")]})]})}}]),n}(s.Component),M=I(O),E=function(e){(0,a.Z)(n,e);var t=(0,c.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){var e=this.props,t=e.isAdmin,n=e.menuKey;return t?(0,z.jsxs)("div",{id:"admin",children:[(0,z.jsx)(l.Z,{}),(0,z.jsxs)(d.Z,{children:[(0,z.jsx)(h.Z,{xs:4,children:(0,z.jsx)(M,{menuKey:n})}),(0,z.jsx)(h.Z,{xs:20,id:"wrapper",className:"".concat("settings"!==n&&"noOverflow"),children:this.props.children})]})]}):(0,z.jsx)(u.l_,{to:"/"})}}]),n}(s.Component),_=(0,o.u)(E)},36578:function(e,t,n){n.r(t),n.d(t,{default:function(){return A}});var r=n(15671),i=n(43144),a=n(60136),c=n(95212),s=n(72791),o=n(4525),l=n(91333),u=n(83099),d=n(25581),h=n(74165),f=n(15861),v=n(86916),p=n(32788),m=n(1413),Z=n(93433),g=n(75033),x=n(35945),j=n(58686),y=n(19603),w=n(28817),b=n(80184),C=function(e){(0,a.Z)(n,e);var t=(0,c.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,a=new Array(i),c=0;c<i;c++)a[c]=arguments[c];return(e=t.call.apply(t,[this].concat(a))).wrapperRef=s.createRef(),e}return(0,i.Z)(n,[{key:"render",value:function(){var e=this.props,t=e.average,n=e.grades,r=this.wrapperRef.current?this.wrapperRef.current.getBoundingClientRect().width:0;return(0,b.jsx)("div",{ref:this.wrapperRef,children:(0,b.jsxs)("svg",{width:r,height:30,children:[(0,b.jsx)("rect",{x:0,y:5,fill:"#bbbbbb",height:5,width:r}),t&&(0,b.jsx)("rect",{x:t/10*r-4,y:0,fill:"rgb(90, 50, 255)",height:15,width:4}),(0,b.jsx)("rect",{x:Math.min.apply(Math,(0,Z.Z)(n))/10*r,y:5,fill:"rgb(90, 50, 255)",height:5,width:Math.max.apply(Math,(0,Z.Z)(n))/10*r-Math.min.apply(Math,(0,Z.Z)(n))/10*r})]})})}}]),n}(s.Component);function k(e,t,n){return n?function(e,t){return{title:e.title,dataIndex:e.id,key:"tile_"+e.id.toString(),width:250,render:function(e,n){var r=t.map((function(e){return"".concat(e.tile_id,"_").concat(e.id)})).map((function(e){return n[e]})).filter((function(e){return e.length>0})).map((function(e){return parseFloat(e)})),i=r.length>0?r.reduce((function(e,t){return e+t}),0)/r.length:null;return(0,b.jsxs)(j.Z,{children:[(0,b.jsx)(y.Z,{xs:4,children:i?(0,b.jsx)(x.Z,{title:r.sort((function(e,t){return e-t})).join(", "),children:Math.round(100*i)/100}):"N/A"}),(0,b.jsx)(y.Z,{xs:20,children:(0,b.jsx)(C,{average:i||void 0,grades:r})})]})}}}(e,t):{title:e.title,children:t.map((function(t){return{title:t.title,dataIndex:e.id+"_"+t.id,key:t.id,width:150,sorter:function(n,r){return n[e.id+"_"+t.id]-r[e.id+"_"+t.id]},render:function(e,t){if(!e)return(0,b.jsx)(x.Z,{title:"No grade available",children:(0,b.jsx)(g.Z,{})});try{var n=parseFloat(e);if(n<5.5)return(0,b.jsx)("span",{className:"dangerText",children:(0,b.jsx)("b",{children:e})});if(n>=9.5)return(0,b.jsx)("span",{className:"successText",children:(0,b.jsx)("b",{children:e})})}catch(r){}return e}}}))}}function S(e,t,n){switch(e.type){case"ASSIGNMENTS":case"EXTERNAL_DATA":switch(e.content){case"ENTRIES":default:return k(e,t,n);case"BINARY":return function(e,t){var n=t.length;return{title:e.title,dataIndex:e.id,key:e.id,width:150,sorter:function(t,n){return t[e.id]-n[e.id]},render:function(e,t){return(0,b.jsx)("div",{children:(0,b.jsxs)(u.Z,{direction:"horizontal",style:{width:"100%"},children:[e,"/",n,(0,b.jsx)(w.Z,{type:"circle",width:50,status:"active",percent:Math.round(parseFloat(e)/n*100),format:function(e){return"".concat(e,"%")}})]})})}}}(e,t)}case"DISCUSSIONS":return k(e,t,n)}}function N(e,t,n){var r=[],i=[{title:"Student",key:"name",dataIndex:"name",fixed:!0,width:200,sorter:function(e,t){return e.name.localeCompare(t.name)},defaultSortOrder:"ascend",render:function(e,t){return(0,b.jsxs)("span",{children:[e,(0,b.jsx)("br",{}),(0,b.jsx)("small",{children:t.student.login_id})]})}}],a=e.filter((function(e){return!["PREDICTION","LEARNING_OUTCOMES"].includes(e.content)})).map((function(e){return S(e,t.filter((function(t){return t.tile_id===e.id})),n)})).filter((function(e){return void 0!==e}));return r.push.apply(r,i.concat((0,Z.Z)(a))),r}function z(e,t){return"BINARY"===t.find((function(t){return t.id===e.tile_id})).content?e.tile_id.toString():"".concat(e.tile_id,"_").concat(e.id)}function I(e,t,n,r,i){return e.map((function(e){return(0,m.Z)({student:e,key:e.id,name:e.name},Object.fromEntries(t.map((function(a){var c=n.filter((function(e){return e.tile_id===a.id}));if("BINARY"===a.content){var s=r.filter((function(t){return t.user_login_id===e.login_id&&c.map((function(e){return e.id})).includes(t.entry_id)})).map((function(e){return parseInt(e.grade)})).filter((function(e){return 1===e})).length.toString();return[[a.id,s]]}return"DISCUSSIONS"===a.type?c.map((function(n){var r=i.filter((function(t){return t.title===n.title&&(t.posted_by===e.name||t.posted_by===e.user_id.toString())}));return[z(n,t),r.length]})):c.map((function(n){var i=r.find((function(t){return t.entry_id===n.id&&t.user_login_id===e.login_id}));return[z(n,t),i?i.grade:""]}))})).flat()))}))}var O=n(1699),M=n(82889),E=function(e){(0,a.Z)(n,e);var t=(0,c.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,a=new Array(i),c=0;c<i;c++)a[c]=arguments[c];return(e=t.call.apply(t,[this].concat(a))).state={loaded:!1,tiles:[],tileGroups:[],tileEntries:[],discussions:[],students:[],submissions:[]},e}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){var e=this;v.Z.getTileGroups().then(function(){var t=(0,f.Z)((0,h.Z)().mark((function t(n){return(0,h.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({tileGroups:n});case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),v.Z.getTiles().then(function(){var t=(0,f.Z)((0,h.Z)().mark((function t(n){return(0,h.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({tiles:n});case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),v.Z.getEntries().then(function(){var t=(0,f.Z)((0,h.Z)().mark((function t(n){return(0,h.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({tileEntries:n});case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),O.Z.getStudents().then(function(){var t=(0,f.Z)((0,h.Z)().mark((function t(n){return(0,h.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({students:n});case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),M.Z.getDiscussions().then(function(){var t=(0,f.Z)((0,h.Z)().mark((function t(n){return(0,h.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({discussions:n});case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),v.Z.getAllSubmissions().then(function(){var t=(0,f.Z)((0,h.Z)().mark((function t(n){return(0,h.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({submissions:n,loaded:!0});case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}},{key:"render",value:function(){var e=this.props.averaged,t=this.state,n=t.tiles,r=t.tileEntries,i=t.discussions,a=t.students,c=t.submissions;return(0,b.jsx)("div",{id:"studentsGradeTable",style:{position:"relative",overflow:"visible"},children:(0,b.jsx)(p.Z,{columns:N(n,r,e),dataSource:I(a,n,r,c,i),scroll:{x:900},bordered:!0,sticky:!0})})}}]),n}(s.Component),_=n(11532),V=n(68944),R=function(e){(0,a.Z)(n,e);var t=(0,c.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,a=new Array(i),c=0;c<i;c++)a[c]=arguments[c];return(e=t.call.apply(t,[this].concat(a))).state={consents:[],goals:[]},e}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){var e=this;O.Z.getConsents().then(function(){var t=(0,f.Z)((0,h.Z)().mark((function t(n){return(0,h.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({consents:n});case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),O.Z.getGoalgrades().then(function(){var t=(0,f.Z)((0,h.Z)().mark((function t(n){return(0,h.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({goals:n});case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}},{key:"render",value:function(){var e=this.state,t=e.consents,n=e.goals;return(0,b.jsx)("div",{id:"studentsConsentTable",style:{position:"relative",overflow:"visible"},children:(0,b.jsx)(p.Z,{columns:this.getColumns(),dataSource:this.getData(t,n),scroll:{x:900},bordered:!0,sticky:!0})})}},{key:"getColumns",value:function(){return[{title:"Student",dataIndex:"userName",fixed:!0,width:80,sorter:function(e,t){return e.userName.localeCompare(t.userName)},defaultSortOrder:"ascend",render:function(e,t){return(0,b.jsxs)("span",{children:[e,(0,b.jsx)("br",{}),(0,b.jsx)("small",{children:t.consentData.userLoginID})]})}},{title:"Consent",dataIndex:"granted",width:150,sorter:function(e,t){return t.granted-e.granted},filters:[{text:"Consent given",value:1},{text:"Consent not given",value:0},{text:"No data",value:-1}],onFilter:function(e,t){return t.granted===e},render:function(e,t){try{var n=parseInt(e);return-1===n?(0,b.jsx)(x.Z,{title:"No consent data available",children:(0,b.jsx)(g.Z,{})}):0===n?(0,b.jsx)("span",{className:"dangerText",children:(0,b.jsx)(x.Z,{title:"No consent given",children:(0,b.jsx)(_.Z,{})})}):(0,b.jsx)("span",{className:"successText",children:(0,b.jsx)(x.Z,{title:"Consent given",children:(0,b.jsx)(V.Z,{})})})}catch(r){return e}}},{title:"Goal",dataIndex:"grade",fixed:!0,width:150,sorter:function(e,t){return e.grade-t.grade},render:function(e,t){return(0,b.jsxs)("span",{children:[e,(0,b.jsx)("br",{})]})}}]}},{key:"getData",value:function(e,t){return e.map((function(e){var n;return{consentData:e,key:e.userID,userName:e.userName,granted:e.granted,grade:null===(n=t.find((function(t){return t.courseID===e.courseID&&t.userLoginID===e.userLoginID})))||void 0===n?void 0:n.grade}}))}}]),n}(s.Component),A=function(e){(0,a.Z)(n,e);var t=(0,c.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,a=new Array(i),c=0;c<i;c++)a[c]=arguments[c];return(e=t.call.apply(t,[this].concat(a))).state={averaged:!1},e}return(0,i.Z)(n,[{key:"render",value:function(){var e=this,t=this.state.averaged;return(0,b.jsxs)(o.Z,{menuKey:"studentOverview",children:[(0,b.jsx)("h1",{children:"Student Overview"}),(0,b.jsx)(l.Z,{}),(0,b.jsxs)(u.Z,{direction:"vertical",style:{width:"100%"},children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{children:"Show averages"}),(0,b.jsx)("br",{}),(0,b.jsx)(d.Z,{onClick:function(t){return e.setState({averaged:t})},checked:t})]}),(0,b.jsx)(E,{averaged:t})]}),(0,b.jsx)(u.Z,{direction:"vertical",style:{width:"100%"},children:(0,b.jsx)(R,{})})]})}}]),n}(s.Component)},49109:function(e,t,n){n.d(t,{Z:function(){return j}});var r=n(1413),i=n(15671),a=n(43144),c=n(60136),s=n(95212),o=n(72791),l=n(18622),u=n(35945),d=n(87309),h=n(14057),f=n(91523),v=n(1699),p=n(68438),m=n(60364),Z=n(80184),g=(0,m.$j)((function(e){return{course:e.course,user:e.user}})),x=function(e){(0,c.Z)(n,e);var t=(0,s.Z)(n);function n(){var e;(0,i.Z)(this,n);for(var r=arguments.length,a=new Array(r),c=0;c<r;c++)a[c]=arguments[c];return(e=t.call.apply(t,[this].concat(a))).state={loaded:!1,students:[]},e}return(0,a.Z)(n,[{key:"componentDidMount",value:function(){var e=this;this.props.studentPickView&&v.Z.getStudents().then((function(t){return e.setState({students:t,loaded:!0})})),this.setState({loaded:!0})}},{key:"renderInner",value:function(){var e=this;if(this.props.studentPickView){var t=this.state,n=t.students,i=t.loaded;return(0,Z.jsx)(l.ZP,{id:"studentPicker",isLoading:!i,options:n.sort((function(e,t){return e.name.localeCompare(t.name)})).map((function(e){return{label:e.name,value:e.login_id}})),placeholder:"Choose a student",onChange:function(t){return e.props.setStudent(t?n.find((function(e){return e.login_id===t.value})):null)},isClearable:!0,styles:{control:function(e,t){return(0,r.Z)((0,r.Z)({},e),{},{backgroundColor:"transparent",color:"white",border:"1px solid white"})},singleValue:function(e,t){return(0,r.Z)((0,r.Z)({},e),{},{color:"white"})}}})}return(0,Z.jsx)("div",{id:"inner",children:(0,Z.jsx)("h2",{children:this.props.course?this.props.course.course_name:"Loading course..."})})}},{key:"render",value:function(){return(0,Z.jsxs)(o.Fragment,{children:[(0,Z.jsxs)("div",{id:"adminHeader",children:[this.props.studentPickView?(0,Z.jsx)(f.rU,{to:"/admin",style:{float:"right"},children:(0,Z.jsx)("h3",{children:"Admin Panel"})}):(0,Z.jsx)("div",{style:{float:"right",padding:20},children:(0,Z.jsx)(u.Z,{title:"Reload data",children:(0,Z.jsx)(d.Z,{id:"reload",shape:"circle",style:{backgroundColor:"rgba(255, 255, 255, 0.5)",color:"white"},icon:(0,Z.jsx)(h.Z,{})})})}),(0,Z.jsxs)("div",{id:"navbarContent",children:[(0,Z.jsx)("div",{id:"brand",children:(0,Z.jsx)(f.rU,{to:"/",children:(0,Z.jsx)("h1",{children:"IGuideME"})})}),this.renderInner()]})]}),(0,p.f)()&&(0,Z.jsxs)("div",{id:"debugNotice",children:["Application is running in ",(0,Z.jsx)("strong",{children:"demo"})," mode. Changes will not be saved!"]})]})}}]),n}(o.Component),j=g(x)},6314:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(1413),i=n(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M518.3 459a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"}},{tag:"path",attrs:{d:"M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0152.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 01-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"}}]},name:"cloud-upload",theme:"outlined"},c=n(54291),s=function(e,t){return i.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:a}))};s.displayName="CloudUploadOutlined";var o=i.forwardRef(s)},53660:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(1413),i=n(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M888 680h-54V540H546v-92h238c8.8 0 16-7.2 16-16V168c0-8.8-7.2-16-16-16H240c-8.8 0-16 7.2-16 16v264c0 8.8 7.2 16 16 16h238v92H190v140h-54c-4.4 0-8 3.6-8 8v176c0 4.4 3.6 8 8 8h176c4.4 0 8-3.6 8-8V688c0-4.4-3.6-8-8-8h-54v-72h220v72h-54c-4.4 0-8 3.6-8 8v176c0 4.4 3.6 8 8 8h176c4.4 0 8-3.6 8-8V688c0-4.4-3.6-8-8-8h-54v-72h220v72h-54c-4.4 0-8 3.6-8 8v176c0 4.4 3.6 8 8 8h176c4.4 0 8-3.6 8-8V688c0-4.4-3.6-8-8-8zM256 805.3c0 1.5-1.2 2.7-2.7 2.7h-58.7c-1.5 0-2.7-1.2-2.7-2.7v-58.7c0-1.5 1.2-2.7 2.7-2.7h58.7c1.5 0 2.7 1.2 2.7 2.7v58.7zm288 0c0 1.5-1.2 2.7-2.7 2.7h-58.7c-1.5 0-2.7-1.2-2.7-2.7v-58.7c0-1.5 1.2-2.7 2.7-2.7h58.7c1.5 0 2.7 1.2 2.7 2.7v58.7zM288 384V216h448v168H288zm544 421.3c0 1.5-1.2 2.7-2.7 2.7h-58.7c-1.5 0-2.7-1.2-2.7-2.7v-58.7c0-1.5 1.2-2.7 2.7-2.7h58.7c1.5 0 2.7 1.2 2.7 2.7v58.7zM360 300a40 40 0 1080 0 40 40 0 10-80 0z"}}]},name:"cluster",theme:"outlined"},c=n(54291),s=function(e,t){return i.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:a}))};s.displayName="ClusterOutlined";var o=i.forwardRef(s)},752:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(1413),i=n(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656zM340 683v77c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-77c-10.1 3.3-20.8 5-32 5s-21.9-1.8-32-5zm64-198V264c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v221c10.1-3.3 20.8-5 32-5s21.9 1.8 32 5zm-64 198c10.1 3.3 20.8 5 32 5s21.9-1.8 32-5c41.8-13.5 72-52.7 72-99s-30.2-85.5-72-99c-10.1-3.3-20.8-5-32-5s-21.9 1.8-32 5c-41.8 13.5-72 52.7-72 99s30.2 85.5 72 99zm.1-115.7c.3-.6.7-1.2 1-1.8v-.1l1.2-1.8c.1-.2.2-.3.3-.5.3-.5.7-.9 1-1.4.1-.1.2-.3.3-.4.5-.6.9-1.1 1.4-1.6l.3-.3 1.2-1.2.4-.4c.5-.5 1-.9 1.6-1.4.6-.5 1.1-.9 1.7-1.3.2-.1.3-.2.5-.3.5-.3.9-.7 1.4-1 .1-.1.3-.2.4-.3.6-.4 1.2-.7 1.9-1.1.1-.1.3-.1.4-.2.5-.3 1-.5 1.6-.8l.6-.3c.7-.3 1.3-.6 2-.8.7-.3 1.4-.5 2.1-.7.2-.1.4-.1.6-.2.6-.2 1.1-.3 1.7-.4.2 0 .3-.1.5-.1.7-.2 1.5-.3 2.2-.4.2 0 .3 0 .5-.1.6-.1 1.2-.1 1.8-.2h.6c.8 0 1.5-.1 2.3-.1s1.5 0 2.3.1h.6c.6 0 1.2.1 1.8.2.2 0 .3 0 .5.1.7.1 1.5.2 2.2.4.2 0 .3.1.5.1.6.1 1.2.3 1.7.4.2.1.4.1.6.2.7.2 1.4.4 2.1.7.7.2 1.3.5 2 .8l.6.3c.5.2 1.1.5 1.6.8.1.1.3.1.4.2.6.3 1.3.7 1.9 1.1.1.1.3.2.4.3.5.3 1 .6 1.4 1 .2.1.3.2.5.3.6.4 1.2.9 1.7 1.3s1.1.9 1.6 1.4l.4.4 1.2 1.2.3.3c.5.5 1 1.1 1.4 1.6.1.1.2.3.3.4.4.4.7.9 1 1.4.1.2.2.3.3.5l1.2 1.8s0 .1.1.1a36.18 36.18 0 015.1 18.5c0 6-1.5 11.7-4.1 16.7-.3.6-.7 1.2-1 1.8 0 0 0 .1-.1.1l-1.2 1.8c-.1.2-.2.3-.3.5-.3.5-.7.9-1 1.4-.1.1-.2.3-.3.4-.5.6-.9 1.1-1.4 1.6l-.3.3-1.2 1.2-.4.4c-.5.5-1 .9-1.6 1.4-.6.5-1.1.9-1.7 1.3-.2.1-.3.2-.5.3-.5.3-.9.7-1.4 1-.1.1-.3.2-.4.3-.6.4-1.2.7-1.9 1.1-.1.1-.3.1-.4.2-.5.3-1 .5-1.6.8l-.6.3c-.7.3-1.3.6-2 .8-.7.3-1.4.5-2.1.7-.2.1-.4.1-.6.2-.6.2-1.1.3-1.7.4-.2 0-.3.1-.5.1-.7.2-1.5.3-2.2.4-.2 0-.3 0-.5.1-.6.1-1.2.1-1.8.2h-.6c-.8 0-1.5.1-2.3.1s-1.5 0-2.3-.1h-.6c-.6 0-1.2-.1-1.8-.2-.2 0-.3 0-.5-.1-.7-.1-1.5-.2-2.2-.4-.2 0-.3-.1-.5-.1-.6-.1-1.2-.3-1.7-.4-.2-.1-.4-.1-.6-.2-.7-.2-1.4-.4-2.1-.7-.7-.2-1.3-.5-2-.8l-.6-.3c-.5-.2-1.1-.5-1.6-.8-.1-.1-.3-.1-.4-.2-.6-.3-1.3-.7-1.9-1.1-.1-.1-.3-.2-.4-.3-.5-.3-1-.6-1.4-1-.2-.1-.3-.2-.5-.3-.6-.4-1.2-.9-1.7-1.3s-1.1-.9-1.6-1.4l-.4-.4-1.2-1.2-.3-.3c-.5-.5-1-1.1-1.4-1.6-.1-.1-.2-.3-.3-.4-.4-.4-.7-.9-1-1.4-.1-.2-.2-.3-.3-.5l-1.2-1.8v-.1c-.4-.6-.7-1.2-1-1.8-2.6-5-4.1-10.7-4.1-16.7s1.5-11.7 4.1-16.7zM620 539v221c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V539c-10.1 3.3-20.8 5-32 5s-21.9-1.8-32-5zm64-198v-77c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v77c10.1-3.3 20.8-5 32-5s21.9 1.8 32 5zm-64 198c10.1 3.3 20.8 5 32 5s21.9-1.8 32-5c41.8-13.5 72-52.7 72-99s-30.2-85.5-72-99c-10.1-3.3-20.8-5-32-5s-21.9 1.8-32 5c-41.8 13.5-72 52.7-72 99s30.2 85.5 72 99zm.1-115.7c.3-.6.7-1.2 1-1.8v-.1l1.2-1.8c.1-.2.2-.3.3-.5.3-.5.7-.9 1-1.4.1-.1.2-.3.3-.4.5-.6.9-1.1 1.4-1.6l.3-.3 1.2-1.2.4-.4c.5-.5 1-.9 1.6-1.4.6-.5 1.1-.9 1.7-1.3.2-.1.3-.2.5-.3.5-.3.9-.7 1.4-1 .1-.1.3-.2.4-.3.6-.4 1.2-.7 1.9-1.1.1-.1.3-.1.4-.2.5-.3 1-.5 1.6-.8l.6-.3c.7-.3 1.3-.6 2-.8.7-.3 1.4-.5 2.1-.7.2-.1.4-.1.6-.2.6-.2 1.1-.3 1.7-.4.2 0 .3-.1.5-.1.7-.2 1.5-.3 2.2-.4.2 0 .3 0 .5-.1.6-.1 1.2-.1 1.8-.2h.6c.8 0 1.5-.1 2.3-.1s1.5 0 2.3.1h.6c.6 0 1.2.1 1.8.2.2 0 .3 0 .5.1.7.1 1.5.2 2.2.4.2 0 .3.1.5.1.6.1 1.2.3 1.7.4.2.1.4.1.6.2.7.2 1.4.4 2.1.7.7.2 1.3.5 2 .8l.6.3c.5.2 1.1.5 1.6.8.1.1.3.1.4.2.6.3 1.3.7 1.9 1.1.1.1.3.2.4.3.5.3 1 .6 1.4 1 .2.1.3.2.5.3.6.4 1.2.9 1.7 1.3s1.1.9 1.6 1.4l.4.4 1.2 1.2.3.3c.5.5 1 1.1 1.4 1.6.1.1.2.3.3.4.4.4.7.9 1 1.4.1.2.2.3.3.5l1.2 1.8v.1a36.18 36.18 0 015.1 18.5c0 6-1.5 11.7-4.1 16.7-.3.6-.7 1.2-1 1.8v.1l-1.2 1.8c-.1.2-.2.3-.3.5-.3.5-.7.9-1 1.4-.1.1-.2.3-.3.4-.5.6-.9 1.1-1.4 1.6l-.3.3-1.2 1.2-.4.4c-.5.5-1 .9-1.6 1.4-.6.5-1.1.9-1.7 1.3-.2.1-.3.2-.5.3-.5.3-.9.7-1.4 1-.1.1-.3.2-.4.3-.6.4-1.2.7-1.9 1.1-.1.1-.3.1-.4.2-.5.3-1 .5-1.6.8l-.6.3c-.7.3-1.3.6-2 .8-.7.3-1.4.5-2.1.7-.2.1-.4.1-.6.2-.6.2-1.1.3-1.7.4-.2 0-.3.1-.5.1-.7.2-1.5.3-2.2.4-.2 0-.3 0-.5.1-.6.1-1.2.1-1.8.2h-.6c-.8 0-1.5.1-2.3.1s-1.5 0-2.3-.1h-.6c-.6 0-1.2-.1-1.8-.2-.2 0-.3 0-.5-.1-.7-.1-1.5-.2-2.2-.4-.2 0-.3-.1-.5-.1-.6-.1-1.2-.3-1.7-.4-.2-.1-.4-.1-.6-.2-.7-.2-1.4-.4-2.1-.7-.7-.2-1.3-.5-2-.8l-.6-.3c-.5-.2-1.1-.5-1.6-.8-.1-.1-.3-.1-.4-.2-.6-.3-1.3-.7-1.9-1.1-.1-.1-.3-.2-.4-.3-.5-.3-1-.6-1.4-1-.2-.1-.3-.2-.5-.3-.6-.4-1.2-.9-1.7-1.3s-1.1-.9-1.6-1.4l-.4-.4-1.2-1.2-.3-.3c-.5-.5-1-1.1-1.4-1.6-.1-.1-.2-.3-.3-.4-.4-.4-.7-.9-1-1.4-.1-.2-.2-.3-.3-.5l-1.2-1.8v-.1c-.4-.6-.7-1.2-1-1.8-2.6-5-4.1-10.7-4.1-16.7s1.5-11.7 4.1-16.7z"}}]},name:"control",theme:"outlined"},c=n(54291),s=function(e,t){return i.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:a}))};s.displayName="ControlOutlined";var o=i.forwardRef(s)},78222:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(1413),i=n(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM304 240a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0z"}}]},name:"database",theme:"outlined"},c=n(54291),s=function(e,t){return i.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:a}))};s.displayName="DatabaseOutlined";var o=i.forwardRef(s)},30836:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(1413),i=n(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M312.1 591.5c3.1 3.1 8.2 3.1 11.3 0l101.8-101.8 86.1 86.2c3.1 3.1 8.2 3.1 11.3 0l226.3-226.5c3.1-3.1 3.1-8.2 0-11.3l-36.8-36.8a8.03 8.03 0 00-11.3 0L517 485.3l-86.1-86.2a8.03 8.03 0 00-11.3 0L275.3 543.4a8.03 8.03 0 000 11.3l36.8 36.8z"}},{tag:"path",attrs:{d:"M904 160H548V96c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H120c-17.7 0-32 14.3-32 32v520c0 17.7 14.3 32 32 32h356.4v32L311.6 884.1a7.92 7.92 0 00-2.3 11l30.3 47.2v.1c2.4 3.7 7.4 4.7 11.1 2.3L512 838.9l161.3 105.8c3.7 2.4 8.7 1.4 11.1-2.3v-.1l30.3-47.2a8 8 0 00-2.3-11L548 776.3V744h356c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 512H160V232h704v440z"}}]},name:"fund-projection-screen",theme:"outlined"},c=n(54291),s=function(e,t){return i.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:a}))};s.displayName="FundProjectionScreenOutlined";var o=i.forwardRef(s)},55240:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(1413),i=n(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M956.9 845.1L896.4 632V168c0-17.7-14.3-32-32-32h-704c-17.7 0-32 14.3-32 32v464L67.9 845.1C60.4 866 75.8 888 98 888h828.8c22.2 0 37.6-22 30.1-42.9zM200.4 208h624v395h-624V208zm228.3 608l8.1-37h150.3l8.1 37H428.7zm224 0l-19.1-86.7c-.8-3.7-4.1-6.3-7.8-6.3H398.2c-3.8 0-7 2.6-7.8 6.3L371.3 816H151l42.3-149h638.2l42.3 149H652.7z"}}]},name:"laptop",theme:"outlined"},c=n(54291),s=function(e,t){return i.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:a}))};s.displayName="LaptopOutlined";var o=i.forwardRef(s)},9150:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(1413),i=n(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M880 112c-3.8 0-7.7.7-11.6 2.3L292 345.9H128c-8.8 0-16 7.4-16 16.6v299c0 9.2 7.2 16.6 16 16.6h101.7c-3.7 11.6-5.7 23.9-5.7 36.4 0 65.9 53.8 119.5 120 119.5 55.4 0 102.1-37.6 115.9-88.4l408.6 164.2c3.9 1.5 7.8 2.3 11.6 2.3 16.9 0 32-14.2 32-33.2V145.2C912 126.2 897 112 880 112zM344 762.3c-26.5 0-48-21.4-48-47.8 0-11.2 3.9-21.9 11-30.4l84.9 34.1c-2 24.6-22.7 44.1-47.9 44.1zm496 58.4L318.8 611.3l-12.9-5.2H184V417.9h121.9l12.9-5.2L840 203.3v617.4z"}}]},name:"notification",theme:"outlined"},c=n(54291),s=function(e,t){return i.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:a}))};s.displayName="NotificationOutlined";var o=i.forwardRef(s)},56200:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(1413),i=n(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M824.2 699.9a301.55 301.55 0 00-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 00-86.4 60.4C345 754.6 314 826.8 312 903.8a8 8 0 008 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5A226.62 226.62 0 01612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c.1 4.3 3.7 7.7 8 7.7h56a8 8 0 008-8.2c-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5a126.86 126.86 0 01-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5A127.3 127.3 0 01612 612zM361.5 510.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 01-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 008 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z"}}]},name:"team",theme:"outlined"},c=n(54291),s=function(e,t){return i.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:a}))};s.displayName="TeamOutlined";var o=i.forwardRef(s)},29529:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(1413),i=n(72791),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"}}]},name:"user",theme:"outlined"},c=n(54291),s=function(e,t){return i.createElement(c.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:a}))};s.displayName="UserOutlined";var o=i.forwardRef(s)},91333:function(e,t,n){var r=n(87462),i=n(4942),a=n(81694),c=n.n(a),s=n(72791),o=n(71929),l=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n};t.Z=function(e){var t,n=s.useContext(o.E_),a=n.getPrefixCls,u=n.direction,d=e.prefixCls,h=e.type,f=void 0===h?"horizontal":h,v=e.orientation,p=void 0===v?"center":v,m=e.orientationMargin,Z=e.className,g=e.children,x=e.dashed,j=e.plain,y=l(e,["prefixCls","type","orientation","orientationMargin","className","children","dashed","plain"]),w=a("divider",d),b=p.length>0?"-".concat(p):p,C=!!g,k="left"===p&&null!=m,S="right"===p&&null!=m,N=c()(w,"".concat(w,"-").concat(f),(t={},(0,i.Z)(t,"".concat(w,"-with-text"),C),(0,i.Z)(t,"".concat(w,"-with-text").concat(b),C),(0,i.Z)(t,"".concat(w,"-dashed"),!!x),(0,i.Z)(t,"".concat(w,"-plain"),!!j),(0,i.Z)(t,"".concat(w,"-rtl"),"rtl"===u),(0,i.Z)(t,"".concat(w,"-no-default-orientation-margin-left"),k),(0,i.Z)(t,"".concat(w,"-no-default-orientation-margin-right"),S),t),Z),z=(0,r.Z)((0,r.Z)({},k&&{marginLeft:m}),S&&{marginRight:m});return s.createElement("div",(0,r.Z)({className:N},y,{role:"separator"}),g&&"vertical"!==f&&s.createElement("span",{className:"".concat(w,"-inner-text"),style:z},g))}},25581:function(e,t,n){n.d(t,{Z:function(){return y}});var r=n(87462),i=n(4942),a=n(77106),c=n(81694),s=n.n(c),o=n(29439),l=n(45987),u=n(72791),d=n(75179),h=n(11354),f=u.forwardRef((function(e,t){var n,r=e.prefixCls,a=void 0===r?"rc-switch":r,c=e.className,f=e.checked,v=e.defaultChecked,p=e.disabled,m=e.loadingIcon,Z=e.checkedChildren,g=e.unCheckedChildren,x=e.onClick,j=e.onChange,y=e.onKeyDown,w=(0,l.Z)(e,["prefixCls","className","checked","defaultChecked","disabled","loadingIcon","checkedChildren","unCheckedChildren","onClick","onChange","onKeyDown"]),b=(0,d.Z)(!1,{value:f,defaultValue:v}),C=(0,o.Z)(b,2),k=C[0],S=C[1];function N(e,t){var n=k;return p||(S(n=e),null===j||void 0===j||j(n,t)),n}var z=s()(a,c,(n={},(0,i.Z)(n,"".concat(a,"-checked"),k),(0,i.Z)(n,"".concat(a,"-disabled"),p),n));return u.createElement("button",Object.assign({},w,{type:"button",role:"switch","aria-checked":k,disabled:p,className:z,ref:t,onKeyDown:function(e){e.which===h.Z.LEFT?N(!1,e):e.which===h.Z.RIGHT&&N(!0,e),null===y||void 0===y||y(e)},onClick:function(e){var t=N(!k,e);null===x||void 0===x||x(t,e)}}),m,u.createElement("span",{className:"".concat(a,"-inner")},k?Z:g))}));f.displayName="Switch";var v=f,p=n(71929),m=n(19125),Z=n(1815),g=n(12833),x=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]])}return n},j=u.forwardRef((function(e,t){var n,c=e.prefixCls,o=e.size,l=e.disabled,d=e.loading,h=e.className,f=void 0===h?"":h,j=x(e,["prefixCls","size","disabled","loading","className"]),y=u.useContext(p.E_),w=y.getPrefixCls,b=y.direction,C=u.useContext(Z.Z),k=u.useContext(m.Z),S=(null!==l&&void 0!==l?l:k)||d,N=w("switch",c),z=u.createElement("div",{className:"".concat(N,"-handle")},d&&u.createElement(a.Z,{className:"".concat(N,"-loading-icon")})),I=s()((n={},(0,i.Z)(n,"".concat(N,"-small"),"small"===(o||C)),(0,i.Z)(n,"".concat(N,"-loading"),d),(0,i.Z)(n,"".concat(N,"-rtl"),"rtl"===b),n),f);return u.createElement(g.Z,{insertExtraNode:!0},u.createElement(v,(0,r.Z)({},j,{prefixCls:N,className:I,disabled:S,ref:t,loadingIcon:z})))}));j.__ANT_SWITCH=!0;var y=j}}]);
//# sourceMappingURL=578.49517777.chunk.js.map