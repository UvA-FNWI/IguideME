"use strict";(self.webpackChunkiguideme=self.webpackChunkiguideme||[]).push([[23],{4525:function(e,t,n){n.d(t,{Z:function(){return A}});var i=n(15671),s=n(43144),r=n(60136),a=n(95212),o=n(72791),c=n(28286),d=n(35714),u=n(64880),l=n(58686),h=n(19603),p=n(29529),x=n(78222),j=n(68961),f=n(55240),Z=n(56200),m=n(68409),v=n(30836),g=n(34633),C=n(6314),S=n(9150),b=n(752),y=n(36090),k=n(91523),z=n(60364),I=n(80184),w=(0,z.$j)((function(e){return{user:e.user}})),D=function(e){(0,r.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,i.Z)(this,n),t.apply(this,arguments)}return(0,s.Z)(n,[{key:"render",value:function(){var e=this.props.user;return(0,I.jsxs)("div",{id:"adminMenu",children:[(0,I.jsxs)("div",{id:"user",children:[(0,I.jsx)("h3",{children:e?e.name:"Loading profile..."}),(0,I.jsxs)("strong",{children:[(0,I.jsx)(p.Z,{})," Instructor"]})]}),(0,I.jsxs)(y.Z,{selectedKeys:[this.props.menuKey],children:[(0,I.jsx)(y.Z.Item,{icon:(0,I.jsx)(x.Z,{}),children:(0,I.jsx)(k.rU,{to:"/admin",children:"Datamart"})},"datamart"),(0,I.jsx)(y.Z.Item,{icon:(0,I.jsx)(j.Z,{}),children:(0,I.jsx)(k.rU,{to:"/admin/tiles",children:"Tiles"})},"tiles"),(0,I.jsx)(y.Z.Item,{icon:(0,I.jsx)(f.Z,{}),children:(0,I.jsx)(k.rU,{to:"/admin/dashboard",children:"Dashboard"})},"dashboard"),(0,I.jsx)(y.Z.Item,{icon:(0,I.jsx)(Z.Z,{}),children:(0,I.jsx)(k.rU,{to:"/admin/student-overview",children:"Student Overview"})},"studentOverview"),(0,I.jsxs)(y.Z.SubMenu,{icon:(0,I.jsx)(m.Z,{}),title:"Grades",children:[(0,I.jsx)(y.Z.Item,{icon:(0,I.jsx)(v.Z,{}),children:(0,I.jsx)(k.rU,{to:"/admin/grade-predictor",children:"Predictor"})},"gradePredictor"),(0,I.jsx)(y.Z.Item,{icon:(0,I.jsx)(g.Z,{}),children:(0,I.jsx)(k.rU,{to:"/admin/grade-analyzer",children:"Analyzer"})},"gradeAnalyzer")]},"submenu"),(0,I.jsx)(y.Z.Item,{icon:(0,I.jsx)(C.Z,{}),children:(0,I.jsx)(k.rU,{to:"/admin/data-wizard",children:"Data Wizard"})},"dataWizard"),(0,I.jsx)(y.Z.Item,{icon:(0,I.jsx)(S.Z,{}),children:(0,I.jsx)(k.rU,{to:"/admin/notification-centre",children:"Notification Centre"})},"notificationCentre"),(0,I.jsx)(y.Z.Item,{icon:(0,I.jsx)(b.Z,{}),children:(0,I.jsx)(k.rU,{to:"/admin/settings",children:"Settings"})},"settings")]})]})}}]),n}(o.Component),B=w(D),U=function(e){(0,r.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,i.Z)(this,n),t.apply(this,arguments)}return(0,s.Z)(n,[{key:"render",value:function(){var e=this.props,t=e.isAdmin,n=e.menuKey;return t?(0,I.jsxs)("div",{id:"admin",children:[(0,I.jsx)(d.Z,{}),(0,I.jsxs)(l.Z,{children:[(0,I.jsx)(h.Z,{xs:4,children:(0,I.jsx)(B,{menuKey:n})}),(0,I.jsx)(h.Z,{xs:20,id:"wrapper",className:"".concat("settings"!==n&&"noOverflow"),children:this.props.children})]})]}):(0,I.jsx)(u.l_,{to:"/"})}}]),n}(o.Component),A=(0,c.u)(U)},93060:function(e,t,n){n.r(t),n.d(t,{default:function(){return ae}});var i=n(15671),s=n(43144),r=n(60136),a=n(95212),o=n(72791),c=n(4525),d=n(91333),u=n(83099),l=n(35945),h=n(25581),p=n(67575),x=n(60732),j=n(1413),f=n(72010),Z=n(7720),m=n(46566),v=n(25471),g=n(78707),C=(n(3321),n(21044),n(83455)),S=n(18190),b=n(9597),y=n(50419),k=n(87309),z=n(90785),I=n(95909),w=n(11663),D=n(60364),B=n(92607),U=n(80184),A=(0,Z.ZP)(),T=(0,m.Z)(),L=A.Toolbar,E={loadCourse:function(){return w.U.loadCourse()}},P=(0,D.$j)((function(e){return{course:e.course}}),E),_=function(e){(0,r.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,i.Z)(this,n);for(var s=arguments.length,r=new Array(s),a=0;a<s;a++)r[a]=arguments[a];return(e=t.call.apply(t,[this].concat(r))).state={doneLoading:!1,editorState:void 0,initialState:void 0,hasChanged:!1,saving:!1},e.isUpToDate=function(){if(!e.state.editorState||!e.state.doneLoading)return!1;var t=e.state.editorState;return(0,C.E)(t.getCurrentContent()).toString().trim()===e.state.initialState},e.updateState=function(t){e.setState({editorState:t,hasChanged:!0})},e.save=function(){var t=e.props.course;e.setState({saving:!0},(function(){var n=e.state.editorState,i=(0,C.E)(n.getCurrentContent());B.Z.updateConsent(t.require_consent,i).then((function(){e.props.loadCourse().then((function(){e.setState({saving:!1,initialState:i},(function(){return y.ZP.success("Informed consent saved!")}))}))}))}))},e}return(0,s.Z)(n,[{key:"componentDidMount",value:function(){var e=this,t=this.props.course;setTimeout((function(){e.setState({doneLoading:!0,editorState:f.EditorState.createWithContent((0,S.M)(t&&t.text?t.text:b.Q)),initialState:(0,C.E)((0,S.M)(t&&t.text?t.text:"")),hasChanged:!1})}),300)}},{key:"render",value:function(){var e=this;return this.state.doneLoading?(0,U.jsxs)("div",{id:"consentEditor",children:[(0,U.jsxs)("div",{id:"editorToolbar",children:[(0,U.jsx)(L,{children:function(t){return(0,U.jsxs)(o.Fragment,{children:[(0,U.jsx)(g.BoldButton,(0,j.Z)({},t)),(0,U.jsx)(g.ItalicButton,(0,j.Z)({},t)),(0,U.jsx)(g.UnderlineButton,(0,j.Z)({},t)),(0,U.jsx)(g.CodeButton,(0,j.Z)({},t)),(0,U.jsx)(g.UnorderedListButton,(0,j.Z)({},t)),(0,U.jsx)(g.HeadlineOneButton,(0,j.Z)({},t)),(0,U.jsx)(g.HeadlineTwoButton,(0,j.Z)({},t)),(0,U.jsx)(g.HeadlineThreeButton,(0,j.Z)({},t)),(0,U.jsx)(g.OrderedListButton,(0,j.Z)({},t)),(0,U.jsx)(g.BlockquoteButton,(0,j.Z)({},t)),(0,U.jsx)(g.CodeBlockButton,(0,j.Z)({},t)),(0,U.jsx)(k.Z,{id:"save",type:"link",disabled:e.isUpToDate()||e.state.saving,onClick:e.save,children:e.state.saving?"Saving":"Save"})]})}}),!this.state.initialState&&(0,U.jsx)(z.Z,{message:"Consent can not be given because the informed consent is undefined. Provide the informed consent below",type:"error",showIcon:!0})]}),(0,U.jsx)("div",{id:"contentWrapper",className:"".concat(this.isUpToDate()&&"up-to-date"," ").concat(this.state.saving&&"saving"),children:(0,U.jsx)(v.ZP,{editorState:this.state.editorState,onChange:this.updateState,plugins:[A,T]})})]}):(0,U.jsx)(I.Z,{small:!0})}}]),n}(o.Component),M=P(_),N=n(17350),q={loadCourse:function(){return w.U.loadCourse()}},G=(0,D.$j)((function(e){return{course:e.course}}),q),O=function(e){(0,r.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,i.Z)(this,n);for(var s=arguments.length,r=new Array(s),a=0;a<s;a++)r[a]=arguments[a];return(e=t.call.apply(t,[this].concat(r))).state={loading:!1},e.toggleConsentRequirement=function(){var t=e.props.course;t&&e.setState({loading:!0},(function(){B.Z.updateConsent(!t.require_consent,t.text).then((function(){e.props.loadCourse().then((function(){e.setState({loading:!1})}))}))}))},e}return(0,s.Z)(n,[{key:"render",value:function(){var e=this.props.course;return e?(0,U.jsxs)("div",{id:"informedConsent",children:[(0,U.jsx)("h2",{children:"Informed Consent"}),(0,U.jsxs)("div",{className:"primaryContainer",children:[(0,U.jsxs)("span",{children:[(0,U.jsx)(l.Z,{title:"Consent is mandatory!",children:(0,U.jsx)(h.Z,{checkedChildren:(0,U.jsx)(p.Z,{}),unCheckedChildren:(0,U.jsx)(x.Z,{}),onClick:this.toggleConsentRequirement,checked:e.require_consent||!0,disabled:!0,loading:this.state.loading})}),"\xa0 When checked students are required to explicitly accept the informed consent. Students that did not grant consent won't be able to use the application and their data will be excluded."]}),(0,U.jsx)(d.Z,{}),e.require_consent&&(0,U.jsx)(N.Z,{children:(0,U.jsx)(M,{})})]})]}):(0,U.jsx)(I.Z,{small:!0})}}]),n}(o.Component),W=G(O),K=n(93433),$=n(1699),R=n(58686),H=n(19603),V=n(21830),F=n.n(V),Q=n(12740),J={loadCourse:function(){return w.U.loadCourse()}},X=(0,D.$j)((function(e){return{course:e.course}}),J),Y=function(e){(0,r.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,i.Z)(this,n);for(var s=arguments.length,r=new Array(s),a=0;a<s;a++)r[a]=arguments[a];return(e=t.call.apply(t,[this].concat(r))).state={loaded:!1,students:[],enabled:!1,accepted:[]},e.isAccepted=function(t){return e.state.accepted.includes(t)},e}return(0,s.Z)(n,[{key:"componentDidMount",value:function(){var e=this;$.Z.getStudents().then((function(t){return e.setState({students:t,loaded:!0})})),Q.Z.getAcceptList().then((function(t){e.setState({accepted:t.filter((function(e){return e.accepted})).map((function(e){return e.userID}))})}));var t=this.props.course;t&&this.setState({enabled:t.accept_list})}},{key:"render",value:function(){var e=this,t=this.state,n=t.loaded,i=t.students,s=t.enabled,r=t.accepted;return n?(0,U.jsxs)("div",{id:"acceptList",children:[(0,U.jsx)("h2",{children:"Accept List"}),(0,U.jsxs)("div",{className:"primaryContainer",children:[(0,U.jsxs)("span",{children:[(0,U.jsx)(h.Z,{checkedChildren:(0,U.jsx)(p.Z,{}),unCheckedChildren:(0,U.jsx)(x.Z,{}),checked:s,onChange:function(t){B.Z.updateAcceptList(t).then((function(t){return e.setState({enabled:t},(function(){return e.props.loadCourse()}))}))}}),"\xa0 If enabled only the students with explicit access may use the application. When disabled all enrolled students are able to use the application."]}),(0,U.jsx)(d.Z,{}),(0,U.jsxs)("span",{children:["Accepted: ",r.length," / ",i.length," ",(0,U.jsxs)("small",{children:["(",Math.round(r.length/i.length*100),"%)"]})]}),(0,U.jsx)("br",{}),(0,U.jsxs)(u.Z,{children:[(0,U.jsx)(k.Z,{disabled:!s,children:"Select all"}),(0,U.jsx)(k.Z,{disabled:!s,children:"Deselect all"}),(0,U.jsx)(k.Z,{disabled:!s,onClick:function(){F().fire({title:"Percentage of students to accept",input:"number",inputAttributes:{autocapitalize:"off"},showCancelButton:!0,confirmButtonText:"Randomize",showLoaderOnConfirm:!0,preConfirm:function(e){var t=parseInt(e);return t<10?F().showValidationMessage("The acceptance percentage must be above 10%!"):t>100?F().showValidationMessage("Percentages can't exceed 100%."):void 0},allowOutsideClick:function(){return!F().isLoading()}}).then((function(t){if(t.isConfirmed){var n=parseInt(t.value),s=Math.ceil(i.length*(n/100)),r=i.sort((function(){return.5-Math.random()})).slice(0,s);e.setState({accepted:r.map((function(e){return e.userID}))}),F().fire("Task completed!","","success")}}))},children:"Random assign"}),(0,U.jsx)(k.Z,{className:"successButtonStyle",disabled:!s,onClick:function(){Q.Z.createAcceptList(i.map((function(e){return{userID:e.userID,accepted:r.includes(e.userID)}}))).then((function(t){e.setState({accepted:t.filter((function(e){return e.accepted})).map((function(e){return e.userID}))}),F().fire("Configuration saved!","","success")}))},children:"Save"})]}),(0,U.jsx)(d.Z,{}),(0,U.jsx)("div",{style:{opacity:s?1:.5},children:(0,U.jsx)(R.Z,{children:i.sort((function(e,t){return e.name.localeCompare(t.name)})).map((function(t){return(0,U.jsx)(H.Z,{xs:12,md:8,lg:6,xl:4,children:(0,U.jsxs)("div",{className:"student ".concat(e.isAccepted(t.userID)&&"accepted"),onClick:function(){e.isAccepted(t.userID)?e.setState({accepted:r.filter((function(e){return e!==t.userID}))}):e.setState({accepted:[].concat((0,K.Z)(r),[t.userID])})},children:[(0,U.jsx)("span",{children:t.name}),(0,U.jsx)("br",{}),(0,U.jsx)("small",{children:t.userID})]})})}))})})]})]}):(0,U.jsxs)("div",{id:"acceptList",children:[(0,U.jsx)("h2",{children:"Accept List"}),(0,U.jsx)("div",{className:"primaryContainer",children:(0,U.jsx)(I.Z,{small:!0})})]})}}]),n}(o.Component),ee=X(Y),te=n(61081),ne={loadCourse:function(){return w.U.loadCourse()}},ie=(0,D.$j)((function(e){return{course:e.course}}),ne),se=function(e){(0,r.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,i.Z)(this,n);for(var s=arguments.length,r=new Array(s),a=0;a<s;a++)r[a]=arguments[a];return(e=t.call.apply(t,[this].concat(r))).state={loading:!0,enabled:!1,size:0,inputSize:0,inputEnabled:!1,buttonText:"Save"},e.updatePeerGroups=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];e.setState({loading:!0},(function(){B.Z.updateCoursePeerGroup(e.state.inputSize,!!t||e.state.inputEnabled).then((function(t){e.setState({enabled:t.personalized_peers,inputEnabled:t.personalized_peers,size:t.min_size,inputSize:t.min_size,buttonText:"Saved"},(function(){setTimeout((function(){return e.setState({buttonText:"Save",loading:!1})}),1e3)}))}))}))},e}return(0,s.Z)(n,[{key:"componentDidMount",value:function(){var e=this;this.setState({loading:!0},(function(){B.Z.getCoursePeerGroups().then((function(t){e.setState({loading:!1,enabled:t.personalized_peers,inputEnabled:t.personalized_peers,size:t.min_size,inputSize:t.min_size})}))}))}},{key:"render",value:function(){var e=this;return(0,U.jsxs)("div",{id:"peerGroups",children:[(0,U.jsx)("h2",{children:"Peer Groups"}),(0,U.jsx)("div",{className:"primaryContainer",children:(0,U.jsxs)(u.Z,{direction:"vertical",children:[(0,U.jsx)("div",{children:(0,U.jsxs)("span",{children:[(0,U.jsx)(h.Z,{checkedChildren:(0,U.jsx)(p.Z,{}),unCheckedChildren:(0,U.jsx)(x.Z,{}),onClick:function(){e.updatePeerGroups(!e.state.inputEnabled),e.setState({inputEnabled:!e.state.inputEnabled})},checked:this.state.inputEnabled,loading:this.state.loading}),"\xa0 Enable personalized peer groups."]})}),(0,U.jsxs)("div",{children:["Minimum group size: \xa0",(0,U.jsx)(te.Z,{min:2,size:"large",value:this.state.inputSize,onChange:function(t){return e.setState({inputSize:t})},disabled:!this.state.enabled||this.state.loading})]}),(0,U.jsx)(k.Z,{className:"successButtonStyle",onClick:function(){return e.updatePeerGroups()},loading:this.state.loading,disabled:this.state.loading,children:this.state.buttonText})]})})]})}}]),n}(o.Component),re=ie(se),ae=function(e){(0,r.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,i.Z)(this,n),t.apply(this,arguments)}return(0,s.Z)(n,[{key:"render",value:function(){return(0,U.jsxs)(c.Z,{menuKey:"settings",children:[(0,U.jsx)("h1",{children:"Settings"}),(0,U.jsx)(d.Z,{}),(0,U.jsxs)(u.Z,{direction:"vertical",style:{width:"100%"},children:[(0,U.jsx)(W,{}),(0,U.jsx)(ee,{}),(0,U.jsx)(re,{})]})]})}}]),n}(o.Component)}}]);
//# sourceMappingURL=23.6f8cad53.chunk.js.map