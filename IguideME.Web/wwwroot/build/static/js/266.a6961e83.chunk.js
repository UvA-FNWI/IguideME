"use strict";(self.webpackChunkiguideme=self.webpackChunkiguideme||[]).push([[266],{1699:function(e,t,n){n.d(t,{Z:function(){return c}});var r=n(15671),i=n(43144),s=n(60136),a=n(95212),o=n(68438),l=n(5674),d=n(68865),u=n(30767),c=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,null,[{key:"getStudents",value:function(){return(0,o.f)()?(0,u.g)(d.wZ):this.client.get("students").then((function(e){return e.data}))}},{key:"getConsents",value:function(){return(0,o.f)()?(0,u.g)(d.nj):this.client.get("consents").then((function(e){return e.data}))}},{key:"getGoalgrades",value:function(){return(0,o.f)()?(0,u.g)(d.sU):this.client.get("goal-grades").then((function(e){return e.data}))}}]),n}(l.Z)},72908:function(e,t,n){n.d(t,{b:function(){return r}});var r=["studentloginid","studentid","student","id"]},4525:function(e,t,n){n.d(t,{Z:function(){return N}});var r=n(15671),i=n(43144),s=n(60136),a=n(95212),o=n(72791),l=n(72014),d=n(49109),u=n(64880),c=n(58686),h=n(19603),f=n(29529),p=n(78222),g=n(68961),x=n(55240),Z=n(56200),j=n(68409),m=n(30836),v=n(34633),y=n(6314),b=n(53660),k=n(9150),C=n(752),S=n(36090),w=n(91523),_=n(60364),A=n(80184),M=(0,_.$j)((function(e){return{user:e.user}})),D=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){var e=this.props.user;return(0,A.jsxs)("div",{id:"adminMenu",children:[(0,A.jsxs)("div",{id:"user",children:[(0,A.jsx)("h3",{children:e?e.name:"Loading profile..."}),(0,A.jsxs)("strong",{children:[(0,A.jsx)(f.Z,{})," Instructor"]})]}),(0,A.jsxs)(S.Z,{selectedKeys:[this.props.menuKey],children:[(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(p.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin",children:"Datamart"})},"datamart"),(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(g.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin/tiles",children:"Tiles"})},"tiles"),(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(x.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin/dashboard",children:"Dashboard"})},"dashboard"),(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(Z.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin/student-overview",children:"Student Overview"})},"studentOverview"),(0,A.jsxs)(S.Z.SubMenu,{icon:(0,A.jsx)(j.Z,{}),title:"Grades",children:[(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(m.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin/grade-predictor-old",children:"Old Predictor"})},"gradePredictorOld"),(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(m.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin/grade-predictor",children:"Predictor"})},"gradePredictor"),(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(v.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin/grade-analyzer",children:"Analyzer"})},"gradeAnalyzer")]},"submenu"),(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(y.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin/data-wizard",children:"Data Wizard"})},"dataWizard"),(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(b.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin/analytics",children:"Analytics"})},"analytics"),(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(k.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin/notification-centre",children:"Notification Centre"})},"notificationCentre"),(0,A.jsx)(S.Z.Item,{icon:(0,A.jsx)(C.Z,{}),children:(0,A.jsx)(w.rU,{to:"/admin/settings",children:"Settings"})},"settings")]})]})}}]),n}(o.Component),E=M(D),I=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){var e=this.props,t=e.isAdmin,n=e.menuKey;return t?(0,A.jsxs)("div",{id:"admin",children:[(0,A.jsx)(d.Z,{}),(0,A.jsxs)(c.Z,{children:[(0,A.jsx)(h.Z,{xs:4,children:(0,A.jsx)(E,{menuKey:n})}),(0,A.jsx)(h.Z,{xs:20,id:"wrapper",className:"".concat("settings"!==n&&"noOverflow"),children:this.props.children})]})]}):(0,A.jsx)(u.l_,{to:"/"})}}]),n}(o.Component),N=(0,l.u)(I)},81266:function(e,t,n){n.r(t),n.d(t,{default:function(){return ie}});var r=n(15671),i=n(43144),s=n(60136),a=n(95212),o=n(72791),l=n(4525),d=n(91333),u=n(74165),c=n(15861),h=n(47528),f=n(87309),p=n(17350),g=n(68885),x=n(32788),Z=n(91004),j=n(83099),m=n(21830),v=n.n(m),y=n(86916),b=n(80184),k=n(60793),C=function(e,t,n){return t.map((function(t){var r=n.filter((function(e){return e.entry_id===t.id})),i=r.map((function(e){return parseFloat(e.grade)}));return{_rawEntry:t,title:t.title,rows:r.length,grades:i,binaryGrades:!!e&&"BINARY"===e.content,average:Math.round(100*k.mean(i))/100,stdev:Math.round(100*k.stdev(i))/100,skewness:Math.round(100*k.skewness(i))/100}}))},S=n(58686),w=n(19603),_=n(4219),A=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,s=new Array(i),a=0;a<i;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).state={query:""},e}return(0,i.Z)(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.tileEntry,r=t.submissions,i=t.students,s=this.state.query;return n?(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{children:n.title}),(0,b.jsxs)(S.Z,{children:[(0,b.jsxs)(w.Z,{xs:24,md:12,children:[(0,b.jsx)("h2",{children:"Student Grades"}),(0,b.jsx)("label",{children:"Find student by name"}),(0,b.jsx)(_.Z,{size:"large",value:s,placeholder:"Student name or login id",onChange:function(t){return e.setState({query:t.target.value})}}),(0,b.jsx)(x.Z,{columns:[{title:"Name",dataIndex:"student_name",key:"student_name"},{title:"Student ID",dataIndex:"student_id",key:"student_id"},{title:"Grade",dataIndex:"grade",key:"grade"}],dataSource:r.filter((function(e){var t=i.find((function(t){return e.user_login_id===t.login_id}));return!!t&&(t.name.toLowerCase().includes(s.toLowerCase())||t.login_id.toLowerCase().includes(s.toLowerCase()))})).sort((function(e,t){return parseFloat(t.grade)-parseFloat(e.grade)})).map((function(e,t){var n=i.find((function(t){return e.user_login_id===t.login_id}));return{key:t,student_name:n?n.name:"???",student_id:n?n.login_id:"???",grade:e.grade}}))})]}),(0,b.jsx)(w.Z,{xs:24,md:8})]})]}):null}}]),n}(o.Component),M=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,s=new Array(i),a=0;a<i;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).state={drawerOpen:!1,openEntry:void 0},e}return(0,i.Z)(n,[{key:"render",value:function(){var e,t,n=this,r=this.state,i=r.drawerOpen,s=r.openEntry,a=this.props,o=a.tile,l=a.entries,d=a.submissions,u=a.students;return(0,b.jsxs)("div",{className:"historicUploads",children:[(0,b.jsxs)(g.Z,{width:"100%",visible:i&&s,onClose:function(){return n.setState({drawerOpen:!1})},children:[u.length," students",(0,b.jsx)(A,{tileEntry:s,students:u,submissions:d.filter((function(e){return e.entry_id===(!!s&&s.id)}))})]}),(0,b.jsx)("h3",{children:"Historic Uploads"}),(0,b.jsx)(x.Z,{columns:(e=function(e){n.setState({drawerOpen:!0,openEntry:e})},t=function(){return n.props.reload()},[{title:"Source name",dataIndex:"title",key:"title"},{title:"Rows",dataIndex:"rows",key:"rows"},{title:"Average",dataIndex:"average",key:"average"},{title:"Std. dev",dataIndex:"stdev",key:"stdev"},{title:"Skewness",dataIndex:"skewness",key:"skewness",render:function(e){return isNaN(e)?"0":e}},{width:200,title:"Scores",render:function(e,t){return(0,b.jsx)(Z.Z,{grades:t.grades,binary:t.binaryGrades,withLegend:!1,height:100})}},{title:"Actions",render:function(n,r){return(0,b.jsxs)(j.Z,{children:[(0,b.jsx)(f.Z,{onClick:function(){return e(r._rawEntry)},children:"View Data"}),(0,b.jsx)(f.Z,{className:"dangerButtonStyle",onClick:function(){return v().fire({title:"Do you really want to delete this data?",text:'All data from "'.concat(r.title,'" will be lost indefinitely!'),icon:"warning",focusCancel:!0,showCancelButton:!0,confirmButtonText:"Delete",cancelButtonText:"Cancel",customClass:{confirmButton:"historicUploadConfirm",cancelButton:"historicUploadCancel"}}).then((function(e){e.value?y.Z.deleteTileEntry(r._rawEntry.id).then((function(){t(),v().fire("Entries deleted!","","success")})):e.dismiss===v().DismissReason.cancel&&v().fire("Cancelled","The data has been preserved!","error")}))},children:"Delete"})]})}}]),scroll:{x:1e3},dataSource:C(o,l,d)})]})}}]),n}(o.Component),D=n(93433),E=n(1699),I=n(32014),N=n(95909),U=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,s=new Array(i),a=0;a<i;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).isHighlighted=function(){var t=e.props,n=t.query,r=t.student;return 0!==n.length&&r.name.toLowerCase().includes(n.toLowerCase())},e}return(0,i.Z)(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.student,r=t.studentRecord;return(0,b.jsx)(w.Z,{xs:12,md:8,lg:6,className:"student",children:(0,b.jsx)(I.Z,{value:n.login_id,checked:!!r&&r.grade>0,onChange:function(t){e.props.updateStudent(n.login_id,{studentloginid:n.login_id,grade:t.target.checked?1:0})},children:(0,b.jsxs)("span",{className:"studentName "+(this.isHighlighted()?"highlight":""),children:[n.name," ",(0,b.jsxs)("small",{children:["(",n.login_id,")"]})]})},n.login_id)})}}]),n}(o.Component),T=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,s=new Array(i),a=0;a<i;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).state={loaded:!1,query:""},e.updateStudent=function(t,n){e.props.setData([].concat((0,D.Z)(e.props.data.filter((function(e){return e.studentloginid!==t}))),[n]))},e}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){var e=this;E.Z.getStudents().then((function(t){return e.setState({students:t,loaded:!0})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.loaded,r=t.query,i=this.props,s=i.data,a=i.students;return n?(0,b.jsxs)("div",{id:"uploadBinaryData",children:[(0,b.jsxs)(S.Z,{gutter:[10,10],children:[(0,b.jsx)(w.Z,{xs:24,md:12,children:(0,b.jsx)(I.Z,{indeterminate:s.filter((function(e){return e.grade>0})).length!==a.length&&s.filter((function(e){return e.grade>0})).length>0,onChange:function(){s.filter((function(e){return e.grade>0})).length<a.length?e.props.setData(a.map((function(e){return{studentloginid:e.login_id,grade:1}}))):e.props.setData(a.map((function(e){return{studentloginid:e.login_id,grade:0}})))},checked:s.filter((function(e){return e.grade>0})).length===a.length,children:(0,b.jsx)("span",{style:{color:"white"},children:"Check all"})})}),(0,b.jsx)(w.Z,{xs:24,md:12,children:(0,b.jsx)("div",{style:{float:"right",display:"inline-block"},children:(0,b.jsxs)("span",{children:[s.filter((function(e){return e.grade>0})).length," ",(0,b.jsxs)("small",{children:["/ ",a.length," \xa0 (",Math.round(s.filter((function(e){return e.grade>0})).length/a.length*100),"%)"]})]})})})]}),(0,b.jsx)(_.Z,{placeholder:"Find student by name",autoComplete:"off",autoCorrect:"off",onChange:function(t){return e.setState({query:t.target.value})},value:r}),(0,b.jsx)(S.Z,{children:a.map((function(t){return(0,b.jsx)(U,{student:t,query:r,updateStudent:e.updateStudent,studentRecord:s.find((function(e){return e.studentloginid===t.login_id}))})}))})]}):(0,b.jsx)(N.Z,{small:!0})}}]),n}(o.Component),L=n(4942),G=n(1413),O=n(61081),P=n(40447),R=n(37295),B=n(82622),z=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,s=new Array(i),a=0;a<i;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).state={menuOpen:!1,key:"",value:""},e}return(0,i.Z)(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.student,r=t.studentRecord,i=this.state,s=i.menuOpen,a=i.key,l=i.value,d=r?Object.keys(r).filter((function(e){return!["studentloginid","grade"].includes(e)})):[];return(0,b.jsx)(w.Z,{xs:24,md:12,children:(0,b.jsx)("div",{style:{padding:10,border:"1px solid #EAEAEA"},children:(0,b.jsxs)(S.Z,{gutter:[10,10],children:[(0,b.jsx)(w.Z,{xs:12,md:16,children:(0,b.jsx)("strong",{children:n.name})}),(0,b.jsx)(w.Z,{xs:12,md:8,children:(0,b.jsx)(O.Z,{size:"small",min:1,max:10,onChange:function(t){e.props.updateStudent(n.login_id,(0,G.Z)((0,G.Z)({},r),{},{studentloginid:n.login_id,grade:t}))},value:r?r.grade:void 0})}),(0,b.jsx)(w.Z,{xs:24,children:(0,b.jsxs)("div",{className:"metaAttributes",children:[(0,b.jsx)(f.Z,{icon:s?(0,b.jsx)(P.Z,{}):(0,b.jsx)(R.Z,{}),size:"small",shape:"circle",onClick:function(){return e.setState({menuOpen:!s})},style:{float:"right"}}),(0,b.jsx)("small",{children:"Meta Attributes"}),(0,b.jsx)("br",{}),s&&(0,b.jsxs)(o.Fragment,{children:[(0,b.jsx)("div",{children:d.sort((function(e,t){return e.localeCompare(t)})).map((function(t){return(0,b.jsxs)("div",{children:[(0,b.jsx)(f.Z,{icon:(0,b.jsx)(B.Z,{}),size:"small",style:{color:"#EAEAEA"},type:"text",onClick:function(){var i=JSON.parse(JSON.stringify(r));delete i[t],e.props.updateStudent(n.login_id,i)}}),t,": ",r[t]]})}))}),(0,b.jsx)("div",{children:(0,b.jsxs)(S.Z,{gutter:[10,10],children:[(0,b.jsx)(w.Z,{xs:10,children:(0,b.jsx)(_.Z,{placeholder:"Key",onChange:function(t){return e.setState({key:t.target.value})},value:a})}),(0,b.jsx)(w.Z,{xs:10,children:(0,b.jsx)(_.Z,{placeholder:"Value",onChange:function(t){return e.setState({value:t.target.value})},value:l})}),(0,b.jsx)(w.Z,{xs:4,children:(0,b.jsx)(f.Z,{type:"primary",block:!0,disabled:0===a.length||0===l.length,onClick:function(){var t;e.props.updateStudent(n.login_id,(0,G.Z)((0,G.Z)({},r),{},(t={},(0,L.Z)(t,a,l),(0,L.Z)(t,"studentloginid",n.login_id),t))),e.setState({key:"",value:""})},children:"Add"})})]})})]})]})})]})})})}}]),n}(o.Component),F=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,s=new Array(i),a=0;a<i;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).state={students:[],loaded:!1},e.updateStudent=function(t,n){e.props.setData([].concat((0,D.Z)(e.props.data.filter((function(e){return e.studentloginid!==t}))),[n]))},e}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){var e=this;E.Z.getStudents().then((function(t){return e.setState({students:t,loaded:!0})}))}},{key:"render",value:function(){var e=this,t=this.state.loaded,n=this.props,r=n.students,i=n.data;return t?(0,b.jsx)("div",{id:"uploadEntriesData",children:(0,b.jsx)(S.Z,{gutter:[10,10],style:{margin:"20px 0"},children:r.map((function(t){return(0,b.jsx)(z,{student:t,updateStudent:e.updateStudent,studentRecord:i.find((function(e){return e.studentloginid===t.login_id}))},t.login_id)}))})}):(0,b.jsx)(N.Z,{small:!0})}}]),n}(o.Component),q=n(50419),K=n(97673),V=n.n(K),H=n(5674),W=n(72908),$=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,null,[{key:"validateData",value:function(e){if(!("grade"in e[0]))return!1;for(var t=0;t<W.b.length;t++)if(W.b[t]in e[0])return!0;return!1}}]),n}(H.Z),Y=n(9146),J=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,s=new Array(i),a=0;a<i;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).state={loaded:!1,uploading:!1,students:[],data:[],title:""},e.handleFileUpload=function(t){$.validateData(t)?e.setState({data:t}):q.ZP.error("Invalid data!")},e.upload=function(){var t=e.props.tile,n=e.state,r=n.data,i=n.title;e.setState({uploading:!0},(function(){y.Z.createTileEntry({id:-1,state:Y.j.new,tile_id:t.id,title:i,type:"ASSIGNMENT"}).then((function(t){y.Z.uploadData(t.id,r).then((function(){setTimeout((function(){q.ZP.success("Data uploaded!"),e.props.closeUploadMenu(),e.props.reload()}),200)}))}))}))},e}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){var e=this;E.Z.getStudents().then((function(t){return e.setState({students:t.sort((function(e,t){return e.name.localeCompare(t.name)})),loaded:!0})}))}},{key:"render",value:function(){var e=this,t=this.props.tile,n=this.state,r=n.students,i=n.data,s=n.title,a=n.uploading;return(0,b.jsxs)("div",{id:"uploadManager",children:[(0,b.jsxs)(j.Z,{direction:"vertical",style:{width:"100%"},children:[(0,b.jsxs)(S.Z,{gutter:[10,10],children:[(0,b.jsxs)(w.Z,{xs:5,children:[(0,b.jsx)("label",{children:"Data Source"}),(0,b.jsx)("br",{}),(0,b.jsxs)("label",{className:"uploadSource",style:{height:"fit-content"},children:["Upload data source (.CSV)",(0,b.jsx)(V(),{onFileLoaded:function(t){return e.handleFileUpload(t)},inputStyle:{display:"none"},onError:function(){return alert("error")},parserOptions:{header:!0,dynamicTyping:!1,skipEmptyLines:!0,transformHeader:function(e){return e.toLowerCase().replace(/\W/g,"_")}}})]})]}),(0,b.jsxs)(w.Z,{xs:19,children:[(0,b.jsx)("label",{children:"Entry title"}),(0,b.jsx)(_.Z,{placeholder:"Title",value:s,onChange:function(t){return e.setState({title:t.target.value})}})]}),(0,b.jsx)(w.Z,{xs:24,children:(0,b.jsxs)("strong",{id:"notice",children:["Notice: each upload ",(0,b.jsx)("u",{children:"must"})," contain a column named ",(0,b.jsx)("i",{children:"StudentID"})," specifying the student's login id. There must also be a column named ",(0,b.jsx)("i",{children:"Grade"}),". All other columns will be stored as meta attributes to the submission."]})})]}),(0,b.jsx)("div",{children:"BINARY"===t.content?(0,b.jsx)(T,{data:i,setData:function(t){return e.setState({data:t})},students:r}):(0,b.jsx)(F,{data:i,setData:function(t){return e.setState({data:t})},students:r})})]}),(0,b.jsxs)(j.Z,{children:[(0,b.jsx)(f.Z,{onClick:this.props.closeUploadMenu,className:"dangerButtonStyle",children:"Cancel"}),(0,b.jsx)(f.Z,{className:"successButton",onClick:this.upload,loading:a,disabled:s.length<1,children:"Upload"})]})]})}}]),n}(o.Component),Q=n(89591),X={loadTiles:function(){return Q.b.loadTiles()},loadTileEntries:function(){return Q.b.loadTileEntries()}},ee=(0,n(60364).$j)((function(e){return{tiles:e.tiles,tileEntries:e.tileEntries}}),X),te=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,s=new Array(i),a=0;a<i;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).state={loaded:!1,uploadMenuOpen:!1,students:[],submissions:[]},e.reload=function(){e.setState({loaded:!1},(function(){E.Z.getStudents().then(function(){var t=(0,c.Z)((0,u.Z)().mark((function t(n){var r,i;return(0,u.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.props.tile.id,t.next=3,y.Z.getTileSubmissions(r);case 3:i=t.sent,e.props.loadTiles().then((function(){e.props.loadTileEntries().then((function(){e.setState({submissions:i,loaded:!0,students:n})}))}));case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}))},e}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){this.reload()}},{key:"render",value:function(){var e=this,t=this.props,n=t.tileGroup,r=t.tile,i=t.tileEntries,s=this.state,a=s.uploadMenuOpen,o=s.students,l=s.submissions;return s.loaded?(0,b.jsxs)("div",{className:"primaryContainer externalTile",style:{marginBottom:20},children:[(0,b.jsxs)("h2",{children:[(0,b.jsx)("b",{children:r.title})," ",(0,b.jsx)(h.Z,{children:n.title})]}),a?(0,b.jsx)(p.Z,{children:(0,b.jsx)(J,{tile:r,reload:this.reload,closeUploadMenu:function(){return e.setState({uploadMenuOpen:!1})}})}):(0,b.jsx)(f.Z,{className:"successButton",style:{float:"right"},onClick:function(){return e.setState({uploadMenuOpen:!0})},children:"New Upload"}),(0,b.jsx)(M,{tile:r,entries:i.filter((function(e){return e.tile_id===r.id})),students:o,submissions:l,reload:this.reload})]}):(0,b.jsx)(N.Z,{})}}]),n}(o.Component),ne=ee(te),re=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){var e=this.props,t=e.tiles,n=e.tileGroups;return(0,b.jsx)("div",{children:t.map((function(e){return(0,b.jsx)("div",{children:(0,b.jsx)(ne,{tile:e,tileGroup:n.find((function(t){return t.id===e.group_id}))})})}))})}}]),n}(o.Component),ie=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var i=arguments.length,s=new Array(i),a=0;a<i;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).state={loaded:!1,tiles:[],tileGroups:[]},e}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){var e=this;y.Z.getTileGroups().then((function(t){y.Z.getTiles().then((function(n){e.setState({tiles:n,tileGroups:t,loaded:!0})}))}))}},{key:"render",value:function(){var e=this.state,t=e.loaded,n=e.tiles,r=e.tileGroups;return(0,b.jsxs)(l.Z,{menuKey:"dataWizard",children:[(0,b.jsx)("h1",{children:"Data Wizard"}),(0,b.jsx)(d.Z,{}),t?(0,b.jsx)(re,{tiles:n.filter((function(e){return"EXTERNAL_DATA"===e.type})),tileGroups:r}):(0,b.jsx)(N.Z,{small:!0})]})}}]),n}(o.Component)},91004:function(e,t,n){n.d(t,{Z:function(){return c}});var r=n(15671),i=n(43144),s=n(60136),a=n(95212),o=n(72791),l=n(732),d=n(28353),u=n(80184),c=function(e){(0,s.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){var e=this.props,t=e.grades,n=e.binary,r=e.height,i=e.withLegend;return(0,u.jsx)("div",{children:(0,u.jsx)(d.$Q,{height:r,data:(0,l.Sh)(t,n),options:(0,l.Kb)(i)})})}}]),n}(o.Component);c.defaultProps={height:300,withLegend:!0}},732:function(e,t,n){n.d(t,{Kb:function(){return a},RC:function(){return r},Sh:function(){return i},Yd:function(){return s}});var r=function(e){return{labels:e.sort((function(e,t){return e-t})).map((function(e){return e.toString()})),datasets:[{label:"Grades",borderColor:"rgb(90, 50, 255)",backgroundColor:"rgba(90, 50, 255, 0.4)",pointRadius:0,data:e.sort((function(e,t){return e-t}))}]}},i=function(e,t){return{labels:t?["0","1"]:["0","1","2","3","4","5","6","7","8","9","10"],datasets:[{label:"Failed",backgroundColor:"rgb(255,110,90)",data:t?[e.filter((function(e){return 0===e})).length,0]:[e.filter((function(e){return 0===Math.floor(e)})).length,e.filter((function(e){return 1===Math.floor(e)})).length,e.filter((function(e){return 2===Math.floor(e)})).length,e.filter((function(e){return 3===Math.floor(e)})).length,e.filter((function(e){return 4===Math.floor(e)})).length,e.filter((function(e){return 5===Math.floor(e)&&e<5.5})).length,0,0,0,0,0]},{label:"Passed",backgroundColor:"rgb(0, 185, 125)",data:t?[0,e.filter((function(e){return 1===e})).length]:[0,0,0,0,0,e.filter((function(e){return 5===Math.floor(e)&&e>=5.5})).length,e.filter((function(e){return 6===Math.floor(e)})).length,e.filter((function(e){return 7===Math.floor(e)})).length,e.filter((function(e){return 8===Math.floor(e)})).length,e.filter((function(e){return 9===Math.floor(e)})).length,e.filter((function(e){return 10===Math.floor(e)})).length]}]}},s=function(){return{maintainAspectRatio:!1,legend:{display:!1},scales:{xAxes:[{gridLines:{display:!1},ticks:{display:!1}}],yAxes:[{scaleLabel:{display:!0,labelString:"Grade"}}]}}},a=function(e){return{maintainAspectRatio:!1,legend:{display:!1},scales:{xAxes:[{gridLines:{display:!1},scaleLabel:{display:e,labelString:"Grade"},stacked:!0}],yAxes:[{scaleLabel:{display:e,labelString:"# of students"},stacked:!0}]}}}},49109:function(e,t,n){n.d(t,{Z:function(){return v}});var r=n(1413),i=n(15671),s=n(43144),a=n(60136),o=n(95212),l=n(72791),d=n(18622),u=n(35945),c=n(87309),h=n(14057),f=n(91523),p=n(1699),g=n(68438),x=n(60364),Z=n(80184),j=(0,x.$j)((function(e){return{course:e.course,user:e.user}})),m=function(e){(0,a.Z)(n,e);var t=(0,o.Z)(n);function n(){var e;(0,i.Z)(this,n);for(var r=arguments.length,s=new Array(r),a=0;a<r;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).state={loaded:!1,students:[]},e}return(0,s.Z)(n,[{key:"componentDidMount",value:function(){var e=this;this.props.studentPickView&&p.Z.getStudents().then((function(t){return e.setState({students:t,loaded:!0})})),this.setState({loaded:!0})}},{key:"renderInner",value:function(){var e=this;if(this.props.studentPickView){var t=this.state,n=t.students,i=t.loaded;return(0,Z.jsx)(d.ZP,{id:"studentPicker",isLoading:!i,options:n.sort((function(e,t){return e.name.localeCompare(t.name)})).map((function(e){return{label:e.name,value:e.login_id}})),placeholder:"Choose a student",onChange:function(t){return e.props.setStudent(t?n.find((function(e){return e.login_id===t.value})):null)},isClearable:!0,styles:{control:function(e,t){return(0,r.Z)((0,r.Z)({},e),{},{backgroundColor:"transparent",color:"white",border:"1px solid white"})},singleValue:function(e,t){return(0,r.Z)((0,r.Z)({},e),{},{color:"white"})}}})}return(0,Z.jsx)("div",{id:"inner",children:(0,Z.jsx)("h2",{children:this.props.course?this.props.course.course_name:"Loading course..."})})}},{key:"render",value:function(){return(0,Z.jsxs)(l.Fragment,{children:[(0,Z.jsxs)("div",{id:"adminHeader",children:[this.props.studentPickView?(0,Z.jsx)(f.rU,{to:"/admin",style:{float:"right"},children:(0,Z.jsx)("h3",{children:"Admin Panel"})}):(0,Z.jsx)("div",{style:{float:"right",padding:20},children:(0,Z.jsx)(u.Z,{title:"Reload data",children:(0,Z.jsx)(c.Z,{id:"reload",shape:"circle",style:{backgroundColor:"rgba(255, 255, 255, 0.5)",color:"white"},icon:(0,Z.jsx)(h.Z,{})})})}),(0,Z.jsxs)("div",{id:"navbarContent",children:[(0,Z.jsx)("div",{id:"brand",children:(0,Z.jsx)(f.rU,{to:"/",children:(0,Z.jsx)("h1",{children:"IGuideME"})})}),this.renderInner()]})]}),(0,g.f)()&&(0,Z.jsxs)("div",{id:"debugNotice",children:["Application is running in ",(0,Z.jsx)("strong",{children:"demo"})," mode. Changes will not be saved!"]})]})}}]),n}(l.Component),v=j(m)}}]);
//# sourceMappingURL=266.a6961e83.chunk.js.map