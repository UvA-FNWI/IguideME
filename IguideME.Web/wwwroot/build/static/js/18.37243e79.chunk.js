(this.webpackJsonpiguideme=this.webpackJsonpiguideme||[]).push([[18],{198:function(e,t,n){"use strict";n.d(t,"a",(function(){return d}));var a=n(7),r=n(10),i=n(11),c=n(12),l=n(3),o=n(17),u=n(82),s=n(6),d=function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(r.a)(n,null,[{key:"getStudents",value:function(){return Object(l.a)()?Object(s.a)(u.a):this.client.get("students").then((function(e){return e.data}))}}]),n}(o.a)},203:function(e,t,n){"use strict";var a=n(67),r=n(7),i=n(10),c=n(11),l=n(12),o=n(0),u=n.n(o),s=n(235),d=n(428),m=n(81),p=n(994),h=n(54),E=n(198),f=n(3),b=n(52),v=(n(204),Object(b.b)((function(e){return{course:e.course,user:e.user}}))),g=function(e){Object(c.a)(n,e);var t=Object(l.a)(n);function n(){var e;Object(r.a)(this,n);for(var a=arguments.length,i=new Array(a),c=0;c<a;c++)i[c]=arguments[c];return(e=t.call.apply(t,[this].concat(i))).state={loaded:!1,students:[]},e}return Object(i.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.props.studentPickView&&E.a.getStudents().then((function(t){return e.setState({students:t,loaded:!0})})),this.setState({loaded:!0})}},{key:"renderInner",value:function(){var e=this;if(this.props.studentPickView){var t=this.state,n=t.students,r=t.loaded;return u.a.createElement(s.a,{id:"studentPicker",isLoading:!r,options:n.sort((function(e,t){return e.name.localeCompare(t.name)})).map((function(e){return{label:e.name,value:e.login_id}})),placeholder:"Choose a student",onChange:function(t){return e.props.setStudent(t?n.find((function(e){return e.login_id===t.value})):null)},isClearable:!0,styles:{control:function(e,t){return Object(a.a)(Object(a.a)({},e),{},{backgroundColor:"transparent",color:"white",border:"1px solid white"})},singleValue:function(e,t){return Object(a.a)(Object(a.a)({},e),{},{color:"white"})}}})}return u.a.createElement("div",{id:"inner"},u.a.createElement("h2",null,this.props.course?this.props.course.course_name:"Loading course..."))}},{key:"render",value:function(){return u.a.createElement(u.a.Fragment,null,u.a.createElement("div",{id:"adminHeader"},this.props.studentPickView?u.a.createElement(h.b,{to:"/admin",style:{float:"right"}},u.a.createElement("h3",null,"Admin Panel")):u.a.createElement("div",{style:{float:"right",padding:20}},u.a.createElement(d.a,{title:"Reload data"},u.a.createElement(m.a,{id:"reload",shape:"circle",style:{backgroundColor:"rgba(255, 255, 255, 0.5)",color:"white"},icon:u.a.createElement(p.a,null)}))),u.a.createElement("div",{id:"navbarContent"},u.a.createElement("div",{id:"brand"},u.a.createElement(h.b,{to:"/"},u.a.createElement("h1",null,"IGuideME"))),this.renderInner())),Object(f.a)()&&u.a.createElement("div",{id:"debugNotice"},"Application is running in ",u.a.createElement("strong",null,"demo")," mode. Changes will not be saved!"))}}]),n}(o.Component);t.a=v(g)},204:function(e,t,n){},220:function(e,t,n){},221:function(e,t,n){},222:function(e,t,n){"use strict";var a=n(7),r=n(10),i=n(11),c=n(12),l=n(0),o=n.n(l),u=n(83),s=n(203),d=n(14),m=n(966),p=n(967),h=n(1002),E=n(1003),f=n(1e3),b=n(1004),v=n(1005),g=n(997),C=n(1006),y=n(1007),S=n(1008),O=n(1009),j=n(1010),k=n(1011),w=n(327),_=n(54),z=(n(220),n(52)),x=Object(z.b)((function(e){return{user:e.user}}))(function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(r.a)(n,[{key:"render",value:function(){var e=this.props.user;return o.a.createElement("div",{id:"adminMenu"},o.a.createElement("div",{id:"user"},o.a.createElement("h3",null,e?e.name:"Loading profile..."),o.a.createElement("strong",null,o.a.createElement(h.a,null)," Instructor")),o.a.createElement(w.a,{selectedKeys:[this.props.menuKey]},o.a.createElement(w.a.Item,{key:"datamart",icon:o.a.createElement(E.a,null)},o.a.createElement(_.b,{to:"/admin"},"Datamart")),o.a.createElement(w.a.Item,{key:"tiles",icon:o.a.createElement(f.a,null)},o.a.createElement(_.b,{to:"/admin/tiles"},"Tiles")),o.a.createElement(w.a.Item,{key:"dashboard",icon:o.a.createElement(b.a,null)},o.a.createElement(_.b,{to:"/admin/dashboard"},"Dashboard")),o.a.createElement(w.a.Item,{key:"studentOverview",icon:o.a.createElement(v.a,null)},o.a.createElement(_.b,{to:"/admin/student-overview"},"Student Overview")),o.a.createElement(w.a.SubMenu,{key:"submenu",icon:o.a.createElement(g.a,null),title:"Grades"},o.a.createElement(w.a.Item,{key:"gradePredictor",icon:o.a.createElement(C.a,null)},o.a.createElement(_.b,{to:"/admin/grade-predictor"},"Predictor")),o.a.createElement(w.a.Item,{key:"gradeAnalyzer",icon:o.a.createElement(y.a,null)},o.a.createElement(_.b,{to:"/admin/grade-analyzer"},"Analyzer"))),o.a.createElement(w.a.Item,{key:"dataWizard",icon:o.a.createElement(S.a,null)},o.a.createElement(_.b,{to:"/admin/data-wizard"},"Data Wizard")),o.a.createElement(w.a.Item,{key:"analytics",icon:o.a.createElement(O.a,null)},o.a.createElement(_.b,{to:"/admin/analytics"},"Analytics")),o.a.createElement(w.a.Item,{key:"notificationCentre",icon:o.a.createElement(j.a,null)},o.a.createElement(_.b,{to:"/notification-centre"},"Notification Centre")),o.a.createElement(w.a.Item,{key:"settings",icon:o.a.createElement(k.a,null)},o.a.createElement(_.b,{to:"/admin/settings"},"Settings"))))}}]),n}(l.Component)),A=(n(221),function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(r.a)(n,[{key:"render",value:function(){var e=this.props,t=e.isAdmin,n=e.menuKey;return t?o.a.createElement("div",{id:"admin"},o.a.createElement(s.a,null),o.a.createElement(m.a,null,o.a.createElement(p.a,{xs:4},o.a.createElement(x,{menuKey:n})),o.a.createElement(p.a,{xs:20,id:"wrapper",className:"".concat("settings"!==n&&"noOverflow")},this.props.children))):o.a.createElement(d.a,{to:"/"})}}]),n}(l.Component));t.a=Object(u.a)(A)},956:function(e,t,n){},957:function(e,t,n){},989:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return te}));var a=n(7),r=n(10),i=n(11),c=n(12),l=n(0),o=n.n(l),u=n(222),s=n(369),d=n(183),m=n(428),p=n(716),h=n(357),E=n(208),f=n(292),b=n(914),v=n.n(b),g=n(935),C=n.n(g),y=n(943),S=n.n(y),O=n(706),j=(n(954),n(955),n(956),n(964)),k=n(960),w=n(122),_=n(179),z=n(81),x=n(714),A=n(39),I=n(98),B=n(52),L=n(40),T=v()(),P=C()(),M=T.Toolbar,D={loadCourse:function(){return I.a.loadCourse()}},N=Object(B.b)((function(e){return{course:e.course}}),D)(function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(a.a)(this,n);for(var r=arguments.length,i=new Array(r),c=0;c<r;c++)i[c]=arguments[c];return(e=t.call.apply(t,[this].concat(i))).state={doneLoading:!1,editorState:void 0,initialState:void 0,hasChanged:!1,saving:!1},e.isUpToDate=function(){if(!e.state.editorState||!e.state.doneLoading)return!1;var t=e.state.editorState;return Object(j.a)(t.getCurrentContent()).toString().trim()===e.state.initialState},e.updateState=function(t){e.setState({editorState:t,hasChanged:!0})},e.save=function(){var t=e.props.course;e.setState({saving:!0},(function(){var n=e.state.editorState,a=Object(j.a)(n.getCurrentContent());L.a.updateConsent(t.require_consent,a).then((function(){e.props.loadCourse().then((function(){e.setState({saving:!1,initialState:a},(function(){return _.b.success("Informed consent saved!")}))}))}))}))},e}return Object(r.a)(n,[{key:"componentDidMount",value:function(){var e=this,t=this.props.course;t&&t.text&&t.text;setTimeout((function(){e.setState({doneLoading:!0,editorState:f.EditorState.createWithContent(Object(k.a)(t&&t.text?t.text:w.a)),initialState:Object(j.a)(Object(k.a)(t&&t.text?t.text:"")),hasChanged:!1})}),300)}},{key:"render",value:function(){var e=this;return this.state.doneLoading?o.a.createElement("div",{id:"consentEditor"},o.a.createElement("div",{id:"editorToolbar"},o.a.createElement(M,null,(function(t){return o.a.createElement(o.a.Fragment,null,o.a.createElement(O.BoldButton,t),o.a.createElement(O.ItalicButton,t),o.a.createElement(O.UnderlineButton,t),o.a.createElement(O.CodeButton,t),o.a.createElement(O.UnorderedListButton,t),o.a.createElement(O.HeadlineOneButton,t),o.a.createElement(O.HeadlineTwoButton,t),o.a.createElement(O.HeadlineThreeButton,t),o.a.createElement(O.OrderedListButton,t),o.a.createElement(O.BlockquoteButton,t),o.a.createElement(O.CodeBlockButton,t),o.a.createElement(z.a,{id:"save",type:"link",disabled:e.isUpToDate()||e.state.saving,onClick:e.save},e.state.saving?"Saving":"Save"))})),!this.state.initialState&&o.a.createElement(x.a,{message:"Consent can not be given because the informed consent is undefined. Provide the informed consent below",type:"error",showIcon:!0})),o.a.createElement("div",{id:"contentWrapper",className:"".concat(this.isUpToDate()&&"up-to-date"," ").concat(this.state.saving&&"saving")},o.a.createElement(S.a,{editorState:this.state.editorState,onChange:this.updateState,plugins:[T,P]}))):o.a.createElement(A.a,{small:!0})}}]),n}(l.Component)),G=n(315),q=n.n(G),V={loadCourse:function(){return I.a.loadCourse()}},W=Object(B.b)((function(e){return{course:e.course}}),V)(function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(a.a)(this,n);for(var r=arguments.length,i=new Array(r),c=0;c<r;c++)i[c]=arguments[c];return(e=t.call.apply(t,[this].concat(i))).state={loading:!1},e.toggleConsentRequirement=function(){var t=e.props.course;t&&e.setState({loading:!0},(function(){L.a.updateConsent(!t.require_consent,t.text).then((function(){e.props.loadCourse().then((function(){e.setState({loading:!1})}))}))}))},e}return Object(r.a)(n,[{key:"render",value:function(){var e=this.props.course;return e?o.a.createElement("div",{id:"informedConsent"},o.a.createElement("h2",null,"Informed Consent"),o.a.createElement("div",{className:"primaryContainer"},o.a.createElement("span",null,o.a.createElement(m.a,{title:"Consent is mandatory!"},o.a.createElement(p.a,{checkedChildren:o.a.createElement(h.a,null),unCheckedChildren:o.a.createElement(E.a,null),onClick:this.toggleConsentRequirement,checked:e.require_consent||!0,disabled:!0,loading:this.state.loading})),"\xa0 When checked students are required to explicitly accept the informed consent. Students that did not grant consent won't be able to use the application and their data will be excluded."),o.a.createElement(s.a,null),e.require_consent&&o.a.createElement(q.a,null,o.a.createElement(N,null)))):o.a.createElement(A.a,{small:!0})}}]),n}(l.Component)),K=n(32),R=n(198),U=n(966),H=n(967),F=(n(957),n(298)),J=n.n(F),Q=n(93),X={loadCourse:function(){return I.a.loadCourse()}},Y=Object(B.b)((function(e){return{course:e.course}}),X)(function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(a.a)(this,n);for(var r=arguments.length,i=new Array(r),c=0;c<r;c++)i[c]=arguments[c];return(e=t.call.apply(t,[this].concat(i))).state={loaded:!1,students:[],enabled:!1,accepted:[]},e.isAccepted=function(t){return e.state.accepted.includes(t)},e}return Object(r.a)(n,[{key:"componentDidMount",value:function(){var e=this;R.a.getStudents().then((function(t){return e.setState({students:t,loaded:!0})})),Q.a.getAcceptList().then((function(t){e.setState({accepted:t.filter((function(e){return e.accepted})).map((function(e){return e.student_login_id}))})}));var t=this.props.course;t&&this.setState({enabled:t.accept_list})}},{key:"render",value:function(){var e=this,t=this.state,n=t.loaded,a=t.students,r=t.enabled,i=t.accepted;return n?o.a.createElement("div",{id:"acceptList"},o.a.createElement("h2",null,"Accept List"),o.a.createElement("div",{className:"primaryContainer"},o.a.createElement("span",null,o.a.createElement(p.a,{checkedChildren:o.a.createElement(h.a,null),unCheckedChildren:o.a.createElement(E.a,null),checked:r,onChange:function(t){L.a.updateAcceptList(t).then((function(t){return e.setState({enabled:t},(function(){return e.props.loadCourse()}))}))}}),"\xa0 If enabled only the students with explicit access may use the application. When disabled all enrolled students are able to use the application."),o.a.createElement(s.a,null),o.a.createElement("span",null,"Accepted: ",i.length," / ",a.length," ",o.a.createElement("small",null,"(",Math.round(i.length/a.length*100),"%)")),o.a.createElement("br",null),o.a.createElement(d.b,null,o.a.createElement(z.a,{disabled:!r},"Select all"),o.a.createElement(z.a,{disabled:!r},"Deselect all"),o.a.createElement(z.a,{disabled:!r,onClick:function(){J.a.fire({title:"Percentage of students to accept",input:"number",inputAttributes:{autocapitalize:"off"},showCancelButton:!0,confirmButtonText:"Randomize",showLoaderOnConfirm:!0,preConfirm:function(e){var t=parseInt(e);return t<10?J.a.showValidationMessage("The acceptance percentage must be above 10%!"):t>100?J.a.showValidationMessage("Percentages can't exceed 100%."):void 0},allowOutsideClick:function(){return!J.a.isLoading()}}).then((function(t){if(t.isConfirmed){var n=parseInt(t.value),r=Math.ceil(a.length*(n/100)),i=a.sort((function(){return.5-Math.random()})).slice(0,r);e.setState({accepted:i.map((function(e){return e.login_id}))}),J.a.fire("Task completed!","","success")}}))}},"Random assign"),o.a.createElement(z.a,{className:"successButtonStyle",disabled:!r,onClick:function(){Q.a.createAcceptList(a.map((function(e){return{student_login_id:e.login_id,accepted:i.includes(e.login_id)}}))).then((function(t){e.setState({accepted:t.filter((function(e){return e.accepted})).map((function(e){return e.student_login_id}))}),J.a.fire("Configuration saved!","","success")}))}},"Save")),o.a.createElement(s.a,null),o.a.createElement("div",{style:{opacity:r?1:.5}},o.a.createElement(U.a,null,a.sort((function(e,t){return e.name.localeCompare(t.name)})).map((function(t){return o.a.createElement(H.a,{xs:12,md:8,lg:6,xl:4},o.a.createElement("div",{className:"student ".concat(e.isAccepted(t.login_id)&&"accepted"),onClick:function(){e.isAccepted(t.login_id)?e.setState({accepted:i.filter((function(e){return e!==t.login_id}))}):e.setState({accepted:[].concat(Object(K.a)(i),[t.login_id])})}},o.a.createElement("span",null,t.name),o.a.createElement("br",null),o.a.createElement("small",null,t.login_id)))})))))):o.a.createElement("div",{id:"acceptList"},o.a.createElement("h2",null,"Accept List"),o.a.createElement("div",{className:"primaryContainer"},o.a.createElement(A.a,{small:!0})))}}]),n}(l.Component)),Z=n(715),$={loadCourse:function(){return I.a.loadCourse()}},ee=Object(B.b)((function(e){return{course:e.course}}),$)(function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){var e;Object(a.a)(this,n);for(var r=arguments.length,i=new Array(r),c=0;c<r;c++)i[c]=arguments[c];return(e=t.call.apply(t,[this].concat(i))).state={loading:!0,enabled:!1,size:0,inputSize:0,inputEnabled:!1,buttonText:"Save"},e.updatePeerGroups=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];e.setState({loading:!0},(function(){L.a.updateCoursePeerGroup(e.state.inputSize,!!t||e.state.inputEnabled).then((function(t){e.setState({enabled:t.personalized_peers,inputEnabled:t.personalized_peers,size:t.min_size,inputSize:t.min_size,buttonText:"Saved"},(function(){setTimeout((function(){return e.setState({buttonText:"Save",loading:!1})}),1e3)}))}))}))},e}return Object(r.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.setState({loading:!0},(function(){L.a.getCoursePeerGroups().then((function(t){e.setState({loading:!1,enabled:t.personalized_peers,inputEnabled:t.personalized_peers,size:t.min_size,inputSize:t.min_size})}))}))}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{id:"peerGroups"},o.a.createElement("h2",null,"Peer Groups"),o.a.createElement("div",{className:"primaryContainer"},o.a.createElement(d.b,{direction:"vertical"},o.a.createElement("div",null,o.a.createElement("span",null,o.a.createElement(p.a,{checkedChildren:o.a.createElement(h.a,null),unCheckedChildren:o.a.createElement(E.a,null),onClick:function(){e.updatePeerGroups(!e.state.inputEnabled),e.setState({inputEnabled:!e.state.inputEnabled})},checked:this.state.inputEnabled,loading:this.state.loading}),"\xa0 Enable personalized peer groups.")),o.a.createElement("div",null,"Minimum group size: \xa0",o.a.createElement(Z.a,{min:2,size:"large",value:this.state.inputSize,onChange:function(t){return e.setState({inputSize:t})},disabled:!this.state.enabled||this.state.loading})),o.a.createElement(z.a,{className:"successButtonStyle",onClick:function(){return e.updatePeerGroups()},loading:this.state.loading,disabled:this.state.loading},this.state.buttonText))))}}]),n}(l.Component)),te=function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(r.a)(n,[{key:"render",value:function(){return o.a.createElement(u.a,{menuKey:"settings"},o.a.createElement("h1",null,"Settings"),o.a.createElement(s.a,null),o.a.createElement(d.b,{direction:"vertical",style:{width:"100%"}},o.a.createElement(W,null),o.a.createElement(Y,null),o.a.createElement(ee,null)))}}]),n}(l.Component)}}]);
//# sourceMappingURL=18.37243e79.chunk.js.map