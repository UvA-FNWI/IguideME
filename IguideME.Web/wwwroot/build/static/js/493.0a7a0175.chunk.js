"use strict";(self.webpackChunkiguideme=self.webpackChunkiguideme||[]).push([[493],{4525:function(t,e,n){n.d(e,{Z:function(){return U}});var s=n(15671),r=n(43144),i=n(60136),a=n(95212),o=n(72791),d=n(28286),c=n(35714),l=n(64880),u=n(58686),m=n(19603),h=n(29529),x=n(78222),p=n(68961),j=n(55240),f=n(56200),Z=n(68409),y=n(30836),v=n(34633),S=n(6314),g=n(9150),b=n(752),k=n(36090),I=n(91523),T=n(60364),z=n(80184),D=(0,T.$j)((function(t){return{user:t.user}})),w=function(t){(0,i.Z)(n,t);var e=(0,a.Z)(n);function n(){return(0,s.Z)(this,n),e.apply(this,arguments)}return(0,r.Z)(n,[{key:"render",value:function(){var t=this.props.user;return(0,z.jsxs)("div",{id:"adminMenu",children:[(0,z.jsxs)("div",{id:"user",children:[(0,z.jsx)("h3",{children:t?t.name:"Loading profile..."}),(0,z.jsxs)("strong",{children:[(0,z.jsx)(h.Z,{})," Instructor"]})]}),(0,z.jsxs)(k.Z,{selectedKeys:[this.props.menuKey],children:[(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(x.Z,{}),children:(0,z.jsx)(I.rU,{to:"/admin",children:"Datamart"})},"datamart"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(p.Z,{}),children:(0,z.jsx)(I.rU,{to:"/admin/tiles",children:"Tiles"})},"tiles"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(j.Z,{}),children:(0,z.jsx)(I.rU,{to:"/admin/dashboard",children:"Dashboard"})},"dashboard"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(f.Z,{}),children:(0,z.jsx)(I.rU,{to:"/admin/student-overview",children:"Student Overview"})},"studentOverview"),(0,z.jsxs)(k.Z.SubMenu,{icon:(0,z.jsx)(Z.Z,{}),title:"Grades",children:[(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(y.Z,{}),children:(0,z.jsx)(I.rU,{to:"/admin/grade-predictor",children:"Predictor"})},"gradePredictor"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(v.Z,{}),children:(0,z.jsx)(I.rU,{to:"/admin/grade-analyzer",children:"Analyzer"})},"gradeAnalyzer")]},"submenu"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(S.Z,{}),children:(0,z.jsx)(I.rU,{to:"/admin/data-wizard",children:"Data Wizard"})},"dataWizard"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(g.Z,{}),children:(0,z.jsx)(I.rU,{to:"/admin/notification-centre",children:"Notification Centre"})},"notificationCentre"),(0,z.jsx)(k.Z.Item,{icon:(0,z.jsx)(b.Z,{}),children:(0,z.jsx)(I.rU,{to:"/admin/settings",children:"Settings"})},"settings")]})]})}}]),n}(o.Component),E=D(w),O=function(t){(0,i.Z)(n,t);var e=(0,a.Z)(n);function n(){return(0,s.Z)(this,n),e.apply(this,arguments)}return(0,r.Z)(n,[{key:"render",value:function(){var t=this.props,e=t.isAdmin,n=t.menuKey;return e?(0,z.jsxs)("div",{id:"admin",children:[(0,z.jsx)(c.Z,{}),(0,z.jsxs)(u.Z,{children:[(0,z.jsx)(m.Z,{xs:4,children:(0,z.jsx)(E,{menuKey:n})}),(0,z.jsx)(m.Z,{xs:20,id:"wrapper",className:"".concat("settings"!==n&&"noOverflow"),children:this.props.children})]})]}):(0,z.jsx)(l.l_,{to:"/"})}}]),n}(o.Component),U=(0,d.u)(O)},23493:function(t,e,n){n.r(e),n.d(e,{default:function(){return O}});var s,r=n(15671),i=n(43144),a=n(60136),o=n(95212),d=n(72791),c=n(92143),l=n(37083),u=n(32788),m=n(4525),h=n(74165),x=n(15861),p=n(50419),j=n(58686),f=n(19603),Z=n(75594),y=n(21830),v=n.n(y),S=n(80184),g=function(t){(0,a.Z)(n,t);var e=(0,o.Z)(n);function n(){return(0,r.Z)(this,n),e.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){var t=this.props,e=t.startSync,n=t.abortSync,s=t.elapsed;return(0,S.jsxs)("div",{children:[(0,S.jsx)("div",{children:(0,S.jsxs)(c.Zb,{width:208,height:208,elevation:3,className:"clock-wrapper",style:{borderRadius:"208px"},children:[(0,S.jsx)(c.Zb,{flat:!0,width:208,height:208,style:{borderRadius:"208px"},className:"clock-dashed ".concat(s?"clock-dashed--animating":"")}),(0,S.jsx)("span",{className:"elapsed-time",children:(0,S.jsxs)("h3",{children:[(0,S.jsx)("small",{children:"elapsed time"}),(0,S.jsx)("br",{}),s||"Idle"]})})]})}),(0,S.jsx)("br",{}),(0,S.jsxs)(j.Z,{gutter:10,children:[(0,S.jsx)(f.Z,{xs:12,children:(0,S.jsx)(c.zx,{color:"rgb(0, 185, 120)",disabled:void 0!==s,block:!0,onClick:e,children:"synchronize"})}),(0,S.jsx)(f.Z,{xs:12,children:(0,S.jsx)(c.zx,{disabled:void 0===s,color:"rgb(255, 110, 90)",block:!0,onClick:function(){v().fire({title:"Do you really want to abort the synchronization?",text:"It will be unsuccessful!",icon:"warning",focusCancel:!0,showCancelButton:!0,confirmButtonText:"Abort",cancelButtonText:"Cancel",customClass:{}}).then((function(t){t.value&&(n(),v().fire("Synchronization aborted!","The synchronization has stopped and the most recent data will be used instead.","error"))}))},children:"abort"})})]})]})}}]),n}(d.Component),b=n(72426),k=n.n(b);!function(t){t.BOOT_UP="tasks.boot-up",t.STUDENTS="tasks.students",t.QUIZZES="tasks.quizzes",t.DISCUSSIONS="tasks.discussions",t.ASSIGNMENTS="tasks.assignments",t.SUBMISSIONS="tasks.submissions",t.GRADE_PREDICTOR="tasks.grade-predictor",t.PEER_GROUPS="tasks.peer-groups",t.DONE="tasks.done"}(s||(s={}));var I=function(t){if(t)return k()(k().utc().diff(t)).utcOffset(0).format("HH:mm:ss")},T=[{id:s.BOOT_UP,title:"Boot-up",description:"Establish a connection."},{id:s.STUDENTS,title:"Students",description:"Register enrolled students."},{id:s.QUIZZES,title:"Quizzes",description:"Obtain available quizzes."},{id:s.DISCUSSIONS,title:"Discussions",description:"Obtain posted discussions."},{id:s.ASSIGNMENTS,title:"Assignments",description:"Obtain available assignments."},{id:s.SUBMISSIONS,title:"Submissions",description:"Obtain submissions from students."},{id:s.GRADE_PREDICTOR,title:"Grade Prediction",description:"Predict grade per student."},{id:s.PEER_GROUPS,title:"Peer Groups",description:"Assign student peer groups."}],z=n(12740),D=n(95909),w=n(68438),E=function(t){(0,a.Z)(n,t);var e=(0,o.Z)(n);function n(){var t;(0,r.Z)(this,n);for(var i=arguments.length,a=new Array(i),o=0;o<i;o++)a[o]=arguments[o];return(t=e.call.apply(e,[this].concat(a))).interval=void 0,t.state={loaded:!1,start:void 0,elapsedTime:void 0,datamartError:!1,currentTask:null,completedTasks:[],currentTasks:[]},t.badgeStyle=function(e){var n=t.state.currentTask,s=T.findIndex((function(t){return t.id===e})),r=T.findIndex((function(t){return t.id===n}));return s<r?{color:"success",text:"Completed"}:s===r?{color:"warning",text:"In-progress"}:{color:"error",text:"Unstarted"}},t.startSync=function(){t.setState({datamartError:!1}),z.Z.startNewSync().then((function(e){e?(p.ZP.success("Sync started!"),t.setState({start:k().utc()}),t.pollSync()):t.setState({datamartError:!0})}))},t.pollSync=function(){t.interval=setInterval((0,x.Z)((0,h.Z)().mark((function e(){return(0,h.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z.Z.getStatus().then((function(e){var n=Object.keys(e).find((function(t){return e[t].progressInformation!==s.DONE}));if(!n)return t.setState({start:void 0}),void clearInterval(t.interval);t.setState({elapsedTime:I(k().utc(e[n].startTime)),currentTask:e[n].progressInformation})}));case 2:case"end":return e.stop()}}),e)}))),1e3)},t.abortSync=function(){t.interval&&clearInterval(t.interval),t.setState({start:void 0,completedTasks:[],currentTasks:[]})},t}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){this.setState({loaded:!0})}},{key:"componentWillUnmount",value:function(){(0,w.f)()&&localStorage.removeItem("debugHandshake")}},{key:"render",value:function(){var t=this,e=this.state,n=e.loaded,s=e.datamartError;return n?(0,S.jsxs)(j.Z,{gutter:[20,20],children:[(0,S.jsxs)(f.Z,{xs:24,md:12,lg:9,children:[(0,S.jsx)(g,{startSync:this.startSync,abortSync:this.abortSync,elapsed:I(this.state.start)}),s&&(0,S.jsx)(c.bZ,{type:"error",outlined:!0,style:{marginTop:20},children:"Failed to reach datamart. Try again later!"})]}),(0,S.jsx)(f.Z,{xs:24,md:12,lg:15,children:(0,S.jsx)(c.Zb,{elevation:1,style:{padding:10,backgroundColor:"rgb(246, 248, 250)"},children:(0,S.jsx)(j.Z,{gutter:[10,10],children:T.map((function(e){return(0,S.jsx)(f.Z,{xs:24,lg:12,children:(0,S.jsx)(c.Zb,{style:{display:"flex",alignItems:"center"},elevation:1,children:(0,S.jsxs)(c.Zb,{flat:!0,style:{width:"100%",padding:20},children:[(0,S.jsx)(Z.Z,{status:t.badgeStyle(e.id).color,text:t.badgeStyle(e.id).text,style:{float:"right"}}),(0,S.jsx)("h4",{style:{margin:0},children:e.title}),(0,S.jsx)(c.YS,{secondary:!0,component:"span",children:e.description})]})})},e.id)}))})})})]}):(0,S.jsx)(D.Z,{small:!0})}}]),n}(d.Component),O=function(t){(0,a.Z)(n,t);var e=(0,o.Z)(n);function n(){var t;(0,r.Z)(this,n);for(var s=arguments.length,i=new Array(s),a=0;a<s;a++)i[a]=arguments[a];return(t=e.call.apply(e,[this].concat(i))).state={loaded:!1,synchronizations:[]},t}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){var t=this;z.Z.getSynchronizations().then((function(e){return t.setState({synchronizations:e.sort((function(t,e){return k()(t.start_timestamp,"MM/DD/YYYY HH:mm:ss").isBefore(k()(e.start_timestamp,"MM/DD/YYYY HH:mm:ss"))?1:-1})),loaded:!0})}))}},{key:"render",value:function(){var t=this.state,e=t.loaded,n=t.synchronizations,s="MM/DD/YYYY HH:mm:ss",r="MMMM Do[,] YYYY [at] HH:mm";n.map((function(t){var e=k().utc(t.start_timestamp,s).local(),n=k().utc(t.end_timestamp,s).local();return t.start_timestamp=e.format(r),n.isBefore(e)?(t.end_timestamp="",t.duration=""):(t.end_timestamp=n.format(r),t.duration=k().utc(1e3*parseInt(t.duration)).format("HH:mm:ss")),t}));var i=e?n.filter((function(t){return"COMPLETE"===t.status})):[],a=i.length>0?i[0]:null;return(0,S.jsx)(m.Z,{menuKey:"datamart",children:(0,S.jsxs)("div",{id:"datamart",children:[(0,S.jsx)("h1",{children:"Datamart"}),e?a?(0,S.jsxs)("p",{children:["The latest successful synchronization took place on",(0,S.jsxs)("b",{children:[" ",k().utc(a.start_timestamp,r).format(r)," "]}),(0,S.jsxs)("small",{children:["(",k().utc(a.start_timestamp,r).fromNow(),")"]}),". Synchronizations run automatically at 03:00AM (UTC time)."]}):(0,S.jsx)("p",{children:"No historic synchronizations available."}):(0,S.jsxs)("div",{children:[(0,S.jsx)(l.Z,{})," Retrieving latest synchronization..."]}),(0,S.jsx)(c.iz,{dense:!0,style:{margin:"10px 0"}}),(0,S.jsx)(E,{}),e&&(0,S.jsxs)(d.Fragment,{children:[(0,S.jsx)("h1",{style:{marginTop:20},children:"Historic versions"}),(0,S.jsx)(c.iz,{dense:!0,style:{margin:"10px 0"}}),(0,S.jsx)(u.Z,{scroll:{x:240},dataSource:n,columns:[{title:"Start timestamp",dataIndex:"start_timestamp",key:"start_timestamp"},{title:"End timestamp",dataIndex:"end_timestamp",key:"end_timestamp"},{title:"Duration",dataIndex:"duration",key:"duration"},{title:"Hash",dataIndex:"hash",key:"hash",render:function(t,e){return(0,S.jsx)("code",{children:t})}},{title:"Status",dataIndex:"status",key:"status"}]})]})]})})}}]),n}(d.Component)}}]);
//# sourceMappingURL=493.0a7a0175.chunk.js.map