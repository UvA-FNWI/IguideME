"use strict";(self.webpackChunkiguideme=self.webpackChunkiguideme||[]).push([[493],{1699:function(t,e,n){n.d(e,{Z:function(){return u}});var r=n(15671),s=n(43144),i=n(60136),a=n(95212),o=n(68438),d=n(5674),c=n(68865),l=n(30767),u=function(t){(0,i.Z)(n,t);var e=(0,a.Z)(n);function n(){return(0,r.Z)(this,n),e.apply(this,arguments)}return(0,s.Z)(n,null,[{key:"getStudents",value:function(){return(0,o.f)()?(0,l.g)(c.wZ):this.client.get("students").then((function(t){return t.data}))}},{key:"getConsents",value:function(){return(0,o.f)()?(0,l.g)(c.nj):this.client.get("consents").then((function(t){return t.data}))}},{key:"getGoalgrades",value:function(){return(0,o.f)()?(0,l.g)(c.sU):this.client.get("goal-grades").then((function(t){return t.data}))}}]),n}(d.Z)},4525:function(t,e,n){n.d(e,{Z:function(){return O}});var r=n(15671),s=n(43144),i=n(60136),a=n(95212),o=n(72791),d=n(72014),c=n(49109),l=n(64880),u=n(58686),h=n(19603),m=n(29529),x=n(78222),p=n(68961),f=n(55240),j=n(56200),Z=n(68409),v=n(30836),g=n(34633),y=n(6314),S=n(53660),b=n(9150),k=n(752),I=n(36090),w=n(91523),C=n(60364),T=n(80184),z=(0,C.$j)((function(t){return{user:t.user}})),U=function(t){(0,i.Z)(n,t);var e=(0,a.Z)(n);function n(){return(0,r.Z)(this,n),e.apply(this,arguments)}return(0,s.Z)(n,[{key:"render",value:function(){var t=this.props.user;return(0,T.jsxs)("div",{id:"adminMenu",children:[(0,T.jsxs)("div",{id:"user",children:[(0,T.jsx)("h3",{children:t?t.name:"Loading profile..."}),(0,T.jsxs)("strong",{children:[(0,T.jsx)(m.Z,{})," Instructor"]})]}),(0,T.jsxs)(I.Z,{selectedKeys:[this.props.menuKey],children:[(0,T.jsx)(I.Z.Item,{icon:(0,T.jsx)(x.Z,{}),children:(0,T.jsx)(w.rU,{to:"/admin",children:"Datamart"})},"datamart"),(0,T.jsx)(I.Z.Item,{icon:(0,T.jsx)(p.Z,{}),children:(0,T.jsx)(w.rU,{to:"/admin/tiles",children:"Tiles"})},"tiles"),(0,T.jsx)(I.Z.Item,{icon:(0,T.jsx)(f.Z,{}),children:(0,T.jsx)(w.rU,{to:"/admin/dashboard",children:"Dashboard"})},"dashboard"),(0,T.jsx)(I.Z.Item,{icon:(0,T.jsx)(j.Z,{}),children:(0,T.jsx)(w.rU,{to:"/admin/student-overview",children:"Student Overview"})},"studentOverview"),(0,T.jsxs)(I.Z.SubMenu,{icon:(0,T.jsx)(Z.Z,{}),title:"Grades",children:[(0,T.jsx)(I.Z.Item,{icon:(0,T.jsx)(v.Z,{}),children:(0,T.jsx)(w.rU,{to:"/admin/grade-predictor",children:"Predictor"})},"gradePredictor"),(0,T.jsx)(I.Z.Item,{icon:(0,T.jsx)(g.Z,{}),children:(0,T.jsx)(w.rU,{to:"/admin/grade-analyzer",children:"Analyzer"})},"gradeAnalyzer")]},"submenu"),(0,T.jsx)(I.Z.Item,{icon:(0,T.jsx)(y.Z,{}),children:(0,T.jsx)(w.rU,{to:"/admin/data-wizard",children:"Data Wizard"})},"dataWizard"),(0,T.jsx)(I.Z.Item,{icon:(0,T.jsx)(S.Z,{}),children:(0,T.jsx)(w.rU,{to:"/admin/analytics",children:"Analytics"})},"analytics"),(0,T.jsx)(I.Z.Item,{icon:(0,T.jsx)(b.Z,{}),children:(0,T.jsx)(w.rU,{to:"/admin/notification-centre",children:"Notification Centre"})},"notificationCentre"),(0,T.jsx)(I.Z.Item,{icon:(0,T.jsx)(k.Z,{}),children:(0,T.jsx)(w.rU,{to:"/admin/settings",children:"Settings"})},"settings")]})]})}}]),n}(o.Component),D=z(U),E=function(t){(0,i.Z)(n,t);var e=(0,a.Z)(n);function n(){return(0,r.Z)(this,n),e.apply(this,arguments)}return(0,s.Z)(n,[{key:"render",value:function(){var t=this.props,e=t.isAdmin,n=t.menuKey;return e?(0,T.jsxs)("div",{id:"admin",children:[(0,T.jsx)(c.Z,{}),(0,T.jsxs)(u.Z,{children:[(0,T.jsx)(h.Z,{xs:4,children:(0,T.jsx)(D,{menuKey:n})}),(0,T.jsx)(h.Z,{xs:20,id:"wrapper",className:"".concat("settings"!==n&&"noOverflow"),children:this.props.children})]})]}):(0,T.jsx)(l.l_,{to:"/"})}}]),n}(o.Component),O=(0,d.u)(E)},23493:function(t,e,n){n.r(e),n.d(e,{default:function(){return D}});var r,s=n(15671),i=n(43144),a=n(60136),o=n(95212),d=n(72791),c=n(92143),l=n(37083),u=n(32788),h=n(4525),m=n(74165),x=n(15861),p=n(50419),f=n(58686),j=n(19603),Z=n(75594),v=n(21830),g=n.n(v),y=n(80184),S=function(t){(0,a.Z)(n,t);var e=(0,o.Z)(n);function n(){return(0,s.Z)(this,n),e.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){var t=this.props,e=t.startSync,n=t.abortSync,r=t.elapsed;return(0,y.jsxs)("div",{children:[(0,y.jsx)("div",{children:(0,y.jsxs)(c.Zb,{width:208,height:208,elevation:3,className:"clock-wrapper",style:{borderRadius:"208px"},children:[(0,y.jsx)(c.Zb,{flat:!0,width:208,height:208,style:{borderRadius:"208px"},className:"clock-dashed ".concat(r?"clock-dashed--animating":"")}),(0,y.jsx)("span",{className:"elapsed-time",children:(0,y.jsxs)("h3",{children:[(0,y.jsx)("small",{children:"elapsed time"}),(0,y.jsx)("br",{}),r||"Idle"]})})]})}),(0,y.jsx)("br",{}),(0,y.jsxs)(f.Z,{gutter:10,children:[(0,y.jsx)(j.Z,{xs:12,children:(0,y.jsx)(c.zx,{color:"rgb(0, 185, 120)",disabled:void 0!==r,block:!0,onClick:e,children:"synchronize"})}),(0,y.jsx)(j.Z,{xs:12,children:(0,y.jsx)(c.zx,{disabled:void 0===r,color:"rgb(255, 110, 90)",block:!0,onClick:function(){g().fire({title:"Do you really want to abort the synchronization?",text:"It will be unsuccessful!",icon:"warning",focusCancel:!0,showCancelButton:!0,confirmButtonText:"Abort",cancelButtonText:"Cancel",customClass:{}}).then((function(t){t.value&&(n(),g().fire("Synchronization aborted!","The synchronization has stopped and the most recent data will be used instead.","error"))}))},children:"abort"})})]})]})}}]),n}(d.Component),b=n(72426),k=n.n(b);!function(t){t.BOOT_UP="tasks.boot-up",t.STUDENTS="tasks.students",t.QUIZZES="tasks.quizzes",t.DISCUSSIONS="tasks.discussions",t.ASSIGNMENTS="tasks.assignments",t.SUBMISSIONS="tasks.submissions",t.GRADE_PREDICTOR="tasks.grade-predictor",t.PEER_GROUPS="tasks.peer-groups",t.DONE="tasks.done"}(r||(r={}));var I=function(t){if(t)return k()(k().utc().diff(t)).utcOffset(0).format("HH:mm:ss")},w=[{id:r.BOOT_UP,title:"Boot-up",description:"Establish a connection."},{id:r.STUDENTS,title:"Students",description:"Register enrolled students."},{id:r.QUIZZES,title:"Quizzes",description:"Obtain available quizzes."},{id:r.DISCUSSIONS,title:"Discussions",description:"Obtain posted discussions."},{id:r.ASSIGNMENTS,title:"Assignments",description:"Obtain available assignments."},{id:r.SUBMISSIONS,title:"Submissions",description:"Obtain submissions from students."},{id:r.GRADE_PREDICTOR,title:"Grade Prediction",description:"Predict grade per student."},{id:r.PEER_GROUPS,title:"Peer Groups",description:"Assign student peer groups."}],C=n(12740),T=n(95909),z=n(68438),U=function(t){(0,a.Z)(n,t);var e=(0,o.Z)(n);function n(){var t;(0,s.Z)(this,n);for(var i=arguments.length,a=new Array(i),o=0;o<i;o++)a[o]=arguments[o];return(t=e.call.apply(e,[this].concat(a))).interval=void 0,t.state={loaded:!1,start:void 0,elapsedTime:void 0,datamartError:!1,currentTask:null,completedTasks:[],currentTasks:[]},t.badgeStyle=function(e){var n=t.state.currentTask,r=w.findIndex((function(t){return t.id===e})),s=w.findIndex((function(t){return t.id===n}));return r<s?{color:"success",text:"Completed"}:r===s?{color:"warning",text:"In-progress"}:{color:"error",text:"Unstarted"}},t.startSync=function(){t.setState({datamartError:!1}),C.Z.startNewSync().then((function(e){e?(p.ZP.success("Sync started!"),t.setState({start:k().utc()}),t.pollSync()):t.setState({datamartError:!0})}))},t.pollSync=function(){t.interval=setInterval((0,x.Z)((0,m.Z)().mark((function e(){return(0,m.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C.Z.getStatus().then((function(e){var n=Object.keys(e).find((function(t){return e[t].progressInformation!==r.DONE}));if(!n)return t.setState({start:void 0}),void clearInterval(t.interval);t.setState({elapsedTime:I(k().utc(e[n].startTime)),currentTask:e[n].progressInformation})}));case 2:case"end":return e.stop()}}),e)}))),1e3)},t.abortSync=function(){t.interval&&clearInterval(t.interval),t.setState({start:void 0,completedTasks:[],currentTasks:[]})},t}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){this.setState({loaded:!0})}},{key:"componentWillUnmount",value:function(){(0,z.f)()&&localStorage.removeItem("debugHandshake")}},{key:"render",value:function(){var t=this,e=this.state,n=e.loaded,r=e.datamartError;return n?(0,y.jsxs)(f.Z,{gutter:[20,20],children:[(0,y.jsxs)(j.Z,{xs:24,md:12,lg:9,children:[(0,y.jsx)(S,{startSync:this.startSync,abortSync:this.abortSync,elapsed:I(this.state.start)}),r&&(0,y.jsx)(c.bZ,{type:"error",outlined:!0,style:{marginTop:20},children:"Failed to reach datamart. Try again later!"})]}),(0,y.jsx)(j.Z,{xs:24,md:12,lg:15,children:(0,y.jsx)(c.Zb,{elevation:1,style:{padding:10,backgroundColor:"rgb(246, 248, 250)"},children:(0,y.jsx)(f.Z,{gutter:[10,10],children:w.map((function(e){return(0,y.jsx)(j.Z,{xs:24,lg:12,children:(0,y.jsx)(c.Zb,{style:{display:"flex",alignItems:"center"},elevation:1,children:(0,y.jsxs)(c.Zb,{flat:!0,style:{width:"100%",padding:20},children:[(0,y.jsx)(Z.Z,{status:t.badgeStyle(e.id).color,text:t.badgeStyle(e.id).text,style:{float:"right"}}),(0,y.jsx)("h4",{style:{margin:0},children:e.title}),(0,y.jsx)(c.YS,{secondary:!0,component:"span",children:e.description})]})})},e.id)}))})})})]}):(0,y.jsx)(T.Z,{small:!0})}}]),n}(d.Component),D=function(t){(0,a.Z)(n,t);var e=(0,o.Z)(n);function n(){var t;(0,s.Z)(this,n);for(var r=arguments.length,i=new Array(r),a=0;a<r;a++)i[a]=arguments[a];return(t=e.call.apply(e,[this].concat(i))).state={loaded:!1,synchronizations:[]},t}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){var t=this;C.Z.getSynchronizations().then((function(e){return t.setState({synchronizations:e.sort((function(t,e){return k()(t.start_timestamp,"MM/DD/YYYY HH:mm:ss").isBefore(k()(e.start_timestamp,"MM/DD/YYYY HH:mm:ss"))?1:-1})),loaded:!0})}))}},{key:"render",value:function(){var t=this.state,e=t.loaded,n=t.synchronizations,r="MM/DD/YYYY HH:mm:ss",s="MMMM Do[,] YYYY [at] HH:mm";n.map((function(t){var e=k().utc(t.start_timestamp,r).local(),n=k().utc(t.end_timestamp,r).local();return t.start_timestamp=e.format(s),n.isBefore(e)?(t.end_timestamp="",t.duration=""):(t.end_timestamp=n.format(s),t.duration=k().utc(1e3*parseInt(t.duration)).format("HH:mm:ss")),t}));var i=e?n.filter((function(t){return"COMPLETE"===t.status})):[],a=i.length>0?i[0]:null;return(0,y.jsx)(h.Z,{menuKey:"datamart",children:(0,y.jsxs)("div",{id:"datamart",children:[(0,y.jsx)("h1",{children:"Datamart"}),e?a?(0,y.jsxs)("p",{children:["The latest successful synchronization took place on",(0,y.jsxs)("b",{children:[" ",k().utc(a.start_timestamp,s).format(s)," "]}),(0,y.jsxs)("small",{children:["(",k().utc(a.start_timestamp,s).fromNow(),")"]}),". Synchronizations run automatically at 03:00AM (UTC time)."]}):(0,y.jsx)("p",{children:"No historic synchronizations available."}):(0,y.jsxs)("div",{children:[(0,y.jsx)(l.Z,{})," Retrieving latest synchronization..."]}),(0,y.jsx)(c.iz,{dense:!0,style:{margin:"10px 0"}}),(0,y.jsx)(U,{}),e&&(0,y.jsxs)(d.Fragment,{children:[(0,y.jsx)("h1",{style:{marginTop:20},children:"Historic versions"}),(0,y.jsx)(c.iz,{dense:!0,style:{margin:"10px 0"}}),(0,y.jsx)(u.Z,{scroll:{x:240},dataSource:n,columns:[{title:"Start timestamp",dataIndex:"start_timestamp",key:"start_timestamp"},{title:"End timestamp",dataIndex:"end_timestamp",key:"end_timestamp"},{title:"Duration",dataIndex:"duration",key:"duration"},{title:"Hash",dataIndex:"hash",key:"hash",render:function(t,e){return(0,y.jsx)("code",{children:t})}},{title:"Status",dataIndex:"status",key:"status"}]})]})]})})}}]),n}(d.Component)},49109:function(t,e,n){n.d(e,{Z:function(){return g}});var r=n(1413),s=n(15671),i=n(43144),a=n(60136),o=n(95212),d=n(72791),c=n(18622),l=n(35945),u=n(87309),h=n(14057),m=n(91523),x=n(1699),p=n(68438),f=n(60364),j=n(80184),Z=(0,f.$j)((function(t){return{course:t.course,user:t.user}})),v=function(t){(0,a.Z)(n,t);var e=(0,o.Z)(n);function n(){var t;(0,s.Z)(this,n);for(var r=arguments.length,i=new Array(r),a=0;a<r;a++)i[a]=arguments[a];return(t=e.call.apply(e,[this].concat(i))).state={loaded:!1,students:[]},t}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){var t=this;this.props.studentPickView&&x.Z.getStudents().then((function(e){return t.setState({students:e,loaded:!0})})),this.setState({loaded:!0})}},{key:"renderInner",value:function(){var t=this;if(this.props.studentPickView){var e=this.state,n=e.students,s=e.loaded;return(0,j.jsx)(c.ZP,{id:"studentPicker",isLoading:!s,options:n.sort((function(t,e){return t.name.localeCompare(e.name)})).map((function(t){return{label:t.name,value:t.login_id}})),placeholder:"Choose a student",onChange:function(e){return t.props.setStudent(e?n.find((function(t){return t.login_id===e.value})):null)},isClearable:!0,styles:{control:function(t,e){return(0,r.Z)((0,r.Z)({},t),{},{backgroundColor:"transparent",color:"white",border:"1px solid white"})},singleValue:function(t,e){return(0,r.Z)((0,r.Z)({},t),{},{color:"white"})}}})}return(0,j.jsx)("div",{id:"inner",children:(0,j.jsx)("h2",{children:this.props.course?this.props.course.course_name:"Loading course..."})})}},{key:"render",value:function(){return(0,j.jsxs)(d.Fragment,{children:[(0,j.jsxs)("div",{id:"adminHeader",children:[this.props.studentPickView?(0,j.jsx)(m.rU,{to:"/admin",style:{float:"right"},children:(0,j.jsx)("h3",{children:"Admin Panel"})}):(0,j.jsx)("div",{style:{float:"right",padding:20},children:(0,j.jsx)(l.Z,{title:"Reload data",children:(0,j.jsx)(u.Z,{id:"reload",shape:"circle",style:{backgroundColor:"rgba(255, 255, 255, 0.5)",color:"white"},icon:(0,j.jsx)(h.Z,{})})})}),(0,j.jsxs)("div",{id:"navbarContent",children:[(0,j.jsx)("div",{id:"brand",children:(0,j.jsx)(m.rU,{to:"/",children:(0,j.jsx)("h1",{children:"IGuideME"})})}),this.renderInner()]})]}),(0,p.f)()&&(0,j.jsxs)("div",{id:"debugNotice",children:["Application is running in ",(0,j.jsx)("strong",{children:"demo"})," mode. Changes will not be saved!"]})]})}}]),n}(d.Component),g=Z(v)}}]);
//# sourceMappingURL=493.3ef73918.chunk.js.map