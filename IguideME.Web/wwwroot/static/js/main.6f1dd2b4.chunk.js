(this.webpackJsonpiguideme=this.webpackJsonpiguideme||[]).push([[0],{223:function(e,t,n){e.exports=n(435)},228:function(e,t,n){},229:function(e,t,n){},265:function(e,t,n){},273:function(e,t,n){},274:function(e,t,n){},403:function(e,t,n){},404:function(e,t,n){},427:function(e,t,n){},435:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(6),l=n.n(i);n(228),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(229);var c=n(10),o=n(11),s=n(189),u=n.n(s),d=function(){function e(){Object(c.a)(this,e)}return Object(o.a)(e,null,[{key:"setup",value:function(){this.client=u.a.create({baseURL:"https://localhost:5001/"})}}]),e}();d.client=void 0;var m=n(17),p=n(16),h=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,null,[{key:"fetchConsent",value:function(){return this.client.get("consent")}},{key:"setConsent",value:function(e){return this.client.post("consent",{granted:null===e?-1:e?1:0})}}]),n}(d),f=function(e){return{type:"SET_CONSENT_SUCCESS",payload:{granted:e}}},v=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement("h1",null,"Welcome to IguideME"))}}]),n}(a.Component),g=n(41),E=n(215),y=n(26),b=n(442),w=n(444),O=n(446),k=n(70),j=n(108),_=n.n(j),C=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={acceptedTerms:!1},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this,t=this.props.dispatch;return r.a.createElement("div",{id:"consent",style:{display:"block",padding:"10px",width:"100vw"}},r.a.createElement(_.a,null,r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement("h1",null,"IguideME"),r.a.createElement("h2",null,"INFORMED CONSENT"))),r.a.createElement("p",null,"Dear participant,",r.a.createElement("br",null),'We ask for your cooperation in an evaluation study into educational improvement. In this document, the so-called "informed consent", we explain this study and you can indicate whether you want to cooperate. Read the text below carefully. Then click on the informed consent link to sign the document (with yes or no, that choice is free).'),r.a.createElement("h3",null,"Goal of the research"),r.a.createElement("p",null,"The goal of this educational research is to study the effects of the feedback tool \u201cIguideME\u201d and activating learning tools (e.g. Perusall) on the learning process.",r.a.createElement("br",null),"The results of this research can be used to facilitate your learning process, to improve the design of this and other courses, and for scientific publications."),r.a.createElement("h3",null,"Research description"),r.a.createElement("p",null,"To investigate the effects of using IguideME, personal data (name and student ID) and learning activity data will be collected. Based on these data, you will receive personal feedback via the IguideME dashboard in Canvas. To investigate the effects of activating learning tools, the quality of assignments will be assessed and the results of a short questionnaire that scores motivation and learning behavior will be compared between the beginning and at the end of the course. For presentations purposes, all data will be anonymized."),r.a.createElement("h3",null,"Voluntariness"),r.a.createElement("p",null,"The participation in this research is voluntary. In the case that you decline to participate or stop your participation the data that you have generated will not be used in the research. You are free to stop your participation in this research without specifying a reason by informing dr. Erwin van Vliet."),r.a.createElement("h3",null,"Insurance"),r.a.createElement("p",null,"This research brings no risks for your health and safety and in this case the regular liability insurance of the University of Amsterdam is valid."),r.a.createElement("h3",null,"Additional Information"),r.a.createElement("p",null,"In case of any questions about this research please contact: dr. Erwin van Vliet (projectleader IGuideME), phone ",r.a.createElement("a",{href:"tel:0205257630"},"020-525 7630"),", e-mail ",r.a.createElement("a",{href:"mailto:e.a.vanvliet@uva.nl"},"e.a.vanvliet@uva.nl")),r.a.createElement("h2",null,"CONSENT FORM"),r.a.createElement("p",null,"Here you will be asked to sign the Informed consent.",r.a.createElement("br",null),r.a.createElement("ul",null,r.a.createElement("li",null,"By choosing ",r.a.createElement("i",null,'"Yes"')," in this form, you declare that you have read the document entitled \u201cinformed consent IguideME\u201d, understood it, and confirm that you agree with the procedure as described.",r.a.createElement("br",null)),r.a.createElement("li",null,"By choosing ",r.a.createElement("i",null,'"No"')," in the form, you declare that you have read read the document entitled \u201cinformed consent IguideME\u201d, understood it, and confirm that you do not want to participate in this study."))),r.a.createElement(b.a,{value:this.state.acceptedTerms,onChange:function(){return e.setState((function(e){return{acceptedTerms:!e.acceptedTerms}}))}},"\u201cI declare that I have read the information and understood it. I authorize the participation in this educational research and the use of my data in it. I keep my right to stop this authorization without giving an explicit reason to stop and to stop my participation in this experiment at any moment.\u201d"),r.a.createElement(w.a,{gutter:[6,6],style:{marginTop:20}},r.a.createElement(O.a,{md:12,xs:24},r.a.createElement(k.a,{onClick:function(){return h.setConsent(!0).then((function(){return t(f(!0))}))},disabled:!this.state.acceptedTerms,type:"primary",block:!0},"Yes, I give consent")),r.a.createElement(O.a,{md:12,xs:24},r.a.createElement("a",{href:"#"},r.a.createElement(k.a,{onClick:function(){return h.setConsent(!1).then((function(){return t(f(!1))}))},block:!0},"No, I do not give consent")))))}}]),n}(a.Component),S=Object(g.b)((function(e){return{consent:e.consent}}))(C),x=(n(265),n(218),n(43)),T=n.n(x),z=n(67),N=[{rank:2,type:"grade",name:"Prediction",visible:!1,average_grade:7.1,progress:null,peer_comparison:{minimum:0,maximum:10,average:7.1},entry_view_type:"graph",entries:[{name:"Predicted grade",grade:7.1,items:[],metadata:[{date:"01/07",grade:1.2},{date:"02/07",grade:2.3},{date:"03/07",grade:3.4},{date:"04/07",grade:5.6},{date:"05/07",grade:5.6},{date:"06/07",grade:6.8},{date:"07/07",grade:7.6}]}]},{rank:2,type:"outcome",name:"Learning Outcome",visible:!0,progress:0,peer_comparison:{minimum:0,maximum:100,average:71},entry_view_type:"components",entries:[]}],I=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,null,[{key:"fetchDiscussions",value:function(){return this.client.get("discussions")}},{key:"fetchQuizzes",value:function(){return this.client.get("quizzes")}},{key:"fetchSubmissions",value:function(){return this.client.get("submissions")}},{key:"fetchPerusall",value:function(){return this.client.get("perusall")}},{key:"fetchAttendance",value:function(){return this.client.get("attendance")}},{key:"fetchPracticeSessions",value:function(){return this.client.get("practice-sessions")}}]),n}(d),A=function(e){var t=e.data;return{type:"activity",rank:5,name:"Send in questions",visible:!0,progress:t.length,peer_comparison:{minimum:0,maximum:t.length,average:2},entry_view_type:"components",entries:t.map((function(e){return{name:e.title,hide_action_button:!0,grade:null,items:[],metadata:e.message}}))}},P=function(e){var t=e.data,n=t.submissions,a=t.quizzes,r=(t.questions,(e.data.questions||[]).map((function(e){return e.map((function(e){return 0===e.length?null:e})).flat()})));return{rank:1,type:"activity",name:"Quizzes",visible:!0,progress:n.length/a.length*100,average_grade:n.filter((function(e){return null!==e.score})).map((function(e){return e.score})).reduce((function(e,t){return e+t}),0)/n.filter((function(e){return null!==e.score})).length,peer_comparison:{minimum:3.8,maximum:9.3,average:7.5},entry_view_type:"components",entries:a.map((function(e,t){return{name:e.title,grade:n[t]?n[t].score:null,items:(r[t]||[]).map((function(e,t){return{name:"Question #".concat(t+1),status:e?"passed":"failed"}}))}}))}},M=function(e){var t=e.data,n=Object.keys(t);return{rank:3,type:"activity",name:"Perusall Assignments",visible:!0,progress:n.length/3*100,average_grade:Math.round(n.map((function(e){return t[e].grade})).reduce((function(e,t){return e+t}),0)/n.length*10)/10,peer_comparison:{minimum:3.8,maximum:9.3,average:7.5},entry_view_type:"components",entries:n.map((function(e,n){return{extra_wide:!0,hide_action_button:!0,name:"Perusall assignment ".concat(n+1),grade:t[e].grade,items:[],metadata:t[e]}}))}},D=function(e){var t=e.data,n=Object.keys(t);return{rank:2,type:"activity",name:"Practice Sessions",visible:!0,progress:n.length/2*100,average_grade:Math.round(n.map((function(e){return t[e].grade})).reduce((function(e,t){return e+t}),0)/n.length*10)/10,peer_comparison:{minimum:3.8,maximum:9.3,average:7.5},entry_view_type:"components",entries:n.map((function(e,n){return{extra_wide:!0,hide_action_button:!0,name:"Practice Session ".concat(n+1),grade:t[e].grade,items:[]}}))}},L=function(e){var t=e.data,n=Object.keys(t);return{rank:6,type:"activity",name:"Lecture Attendance",visible:!0,progress:t.filter((function(e){return"ja"===e.aanwezig})).length/2*100,peer_comparison:{minimum:0,maximum:2,average:1},entry_view_type:"components",entries:n.map((function(e,n){return{grade:null,hide_action_button:!0,name:"".concat(e),items:[],metadata:{Aanwezig:t[e].aanwezig}}}))}},R=function(e){var t=e.data;return{rank:1,type:"grade",name:"Exam grades",visible:!0,average_grade:Math.round(t.map((function(e){return parseFloat(e.grade)})).reduce((function(e,t){return e+t}),0)/t.length*10)/10,progress:t.length/2*100,peer_comparison:{minimum:1,maximum:9,average:6},entry_view_type:"components",entries:t.map((function(e){return{grade:e.grade,hide_action_button:!0,name:e.name,items:[]}}))}},W=n(191),q=n(192),U=n.n(q),B=n(193),F=n(45),Y=n(140),V=n(194),G=n.n(V),J=n(195);function H(e,t){return function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t,a=arguments.length>1?arguments[1]:void 0;switch(a.type){case"SET_".concat(e,"_PENDING"):return null;case"SET_".concat(e,"_SUCCESS"):return a.payload;case"UNSET_".concat(e,"_SUCCESS"):return null;case"SET_".concat(e,"_ERROR"):return a.error||"ERROR"}return n}}var Q=Object(F.c)({routing:J.routerReducer,tiles:H("TILES",[]),view:H("VIEW",null),consent:H("CONSENT",null)}),K={key:"root",storage:G.a,whitelist:["activeLabel","projects"]},$=Object(Y.a)(K,Q),X=Object(F.d)($,Object(F.a)(W.a,U.a,Object(B.createLogger)())),Z=Object(Y.b)(X),ee=function(){var e=Object(z.a)(T.a.mark((function e(){var t;return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=JSON.parse(JSON.stringify(N)),X.dispatch({type:"SET_TILES_SUCCESS",payload:null}),e.t0=t,e.t1=P,e.next=6,I.fetchQuizzes();case 6:return e.t2=e.sent,e.t3=(0,e.t1)(e.t2),e.t0.push.call(e.t0,e.t3),e.t4=t,e.t5=A,e.next=13,I.fetchDiscussions();case 13:return e.t6=e.sent,e.t7=(0,e.t5)(e.t6),e.t4.push.call(e.t4,e.t7),e.t8=t,e.t9=M,e.next=20,I.fetchPerusall();case 20:return e.t10=e.sent,e.t11=(0,e.t9)(e.t10),e.t8.push.call(e.t8,e.t11),e.t12=t,e.t13=D,e.next=27,I.fetchPracticeSessions();case 27:return e.t14=e.sent,e.t15=(0,e.t13)(e.t14),e.t12.push.call(e.t12,e.t15),e.t16=t,e.t17=L,e.next=34,I.fetchAttendance();case 34:return e.t18=e.sent,e.t19=(0,e.t17)(e.t18),e.t16.push.call(e.t16,e.t19),e.t20=t,e.t21=R,e.next=41,I.fetchSubmissions();case 41:return e.t22=e.sent,e.t23=(0,e.t21)(e.t22),e.t20.push.call(e.t20,e.t23),e.abrupt("return",{type:"SET_TILES_SUCCESS",payload:t});case 45:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),te=n(437),ne=n(438),ae=n(439),re=n(436),ie=(n(273),function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){var e=this.props,t=e.min,n=e.max,a=e.avg;return r.a.createElement("div",{className:"grade-distribution"},r.a.createElement("div",{className:"min"},r.a.createElement("small",null,"min"),r.a.createElement("span",null,t)),r.a.createElement("div",{className:"distribution"},r.a.createElement("small",null,"mean"),r.a.createElement("div",{className:"avg"},r.a.createElement("span",null,a)),r.a.createElement("div",{className:"sep",style:{left:"".concat((a-t)/(n-t)*100,"%")}})),r.a.createElement("div",{className:"max"},r.a.createElement("small",null,"max"),r.a.createElement("span",null,n)))}}]),n}(a.PureComponent)),le=(n(274),function(e){return e>=5.5}),ce=n(447),oe=n(448),se=n(441),ue=n(141),de=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).indicateByAverage=function(e){return r.a.createElement(se.a,{prefix:le(e)?r.a.createElement(ue.a,{title:"You're doing great!"},r.a.createElement(ce.a,{twoToneColor:"#52c41a"})):r.a.createElement(ue.a,{title:"You're behind the desired average"},r.a.createElement(oe.a,{twoToneColor:"rgb(255, 78, 78)"})),value:e,suffix:"/ 10"})},e.indicateByPeerComparison=function(e,t){return e>=t?r.a.createElement("h1",null,r.a.createElement(ue.a,{title:"You're doing great!"},r.a.createElement(ce.a,{twoToneColor:"#52c41a"}))):r.a.createElement("h1",null,r.a.createElement(ue.a,{title:"You're behind the desired average"},r.a.createElement(oe.a,{twoToneColor:"rgb(255, 78, 78)"})))},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this.props,t=e.statusFromAverage,n=e.average,a=e.progress,i=e.peerAverage;return r.a.createElement("div",null,r.a.createElement("div",{className:"statistic"},t?this.indicateByAverage(n):this.indicateByPeerComparison(a,i)))}}]),n}(a.PureComponent),me=function(){var e=Object(z.a)(T.a.mark((function e(t){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",{type:"SET_VIEW_SUCCESS",payload:t});case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),pe=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).progress=function(){var t=e.props.tile.progress;switch(t){case 0:return r.a.createElement(ae.a,{percent:0,status:"exception"});case 100:return r.a.createElement(ae.a,{percent:100});case null:return null;default:return r.a.createElement(ae.a,{percent:t})}},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.width,a=t.tile,i=a.average_grade,l=a.name,c=a.peer_comparison,o=a.progress;return a.visible?r.a.createElement("div",{style:{width:"".concat(n,"px")},className:"tile",onClick:Object(z.a)(T.a.mark((function t(){return T.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.t0=X,t.next=3,me(e.props.tile);case 3:t.t1=t.sent,t.t0.dispatch.call(t.t0,t.t1);case 5:case"end":return t.stop()}}),t)})))},r.a.createElement(_.a,null,r.a.createElement("div",{className:"inner ".concat(le(i||0)?"sufficient":"insufficient")},r.a.createElement("div",{className:"title"},r.a.createElement("h2",null,l)),null!==o?r.a.createElement("div",null,this.progress()):null,r.a.createElement(de,{statusFromAverage:!isNaN(i),average:null!==i?i:null,progress:o||null,peerAverage:c.average}),r.a.createElement("div",{className:"peer"},r.a.createElement(re.a,{plain:!0},"Peer comparison"),r.a.createElement(ie,{min:c.minimum,max:c.maximum,avg:c.average}))))):null}}]),n}(a.PureComponent),he=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(c.a)(this,n),(a=t.call(this,e)).wrapper=void 0,a.updateTileSize=function(){try{var e=a.wrapper.current.getBoundingClientRect().width;e>=990?a.setState({tileWidth:e/5,colSize:["60%","40%"]}):e>=760?a.setState({tileWidth:(e-1)/3,colSize:["".concat(100/3*2,"%"),"".concat(100/3,"%")]}):a.setState({tileWidth:e/2,colSize:["100%","100%"]})}catch(t){a.forceUpdate()}},a.wrapper=r.a.createRef(),a.state={tileWidth:0,colSize:["0px","0px"]},a}return Object(o.a)(n,[{key:"componentDidMount",value:function(){(0,this.props.dispatch)(ee()),window.addEventListener("resize",this.updateTileSize)}},{key:"componentDidUpdate",value:function(e,t,n){JSON.stringify(e.tiles)!==JSON.stringify(this.props.tiles)&&this.updateTileSize()}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.updateTileSize)}},{key:"render",value:function(){var e=this.props.tiles,t=this.state,n=t.tileWidth,a=t.colSize;return null===e?r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement("h1",null,"Welcome to IguideME"),r.a.createElement(te.a,{size:"large"})):r.a.createElement("div",{ref:this.wrapper},r.a.createElement(w.a,null,r.a.createElement(O.a,{flex:a[0]},r.a.createElement(ne.a.Title,{level:3},"Activities"),(e||[]).sort((function(e,t){return e.rank-t.rank})).filter((function(e){return"activity"===e.type})).map((function(e){return r.a.createElement(pe,{tile:e,width:n})}))),r.a.createElement(O.a,{flex:a[1]},r.a.createElement("div",null,r.a.createElement(ne.a.Title,{level:3},"Course Grades"),(e||[]).sort((function(e,t){return e.rank-t.rank})).filter((function(e){return"grade"===e.type})).map((function(e){return r.a.createElement(pe,{tile:e,width:n})}))),r.a.createElement("div",null,r.a.createElement(ne.a.Title,{level:3},"Learning Outcome"),r.a.createElement(w.a,{justify:"center"},(e||[]).sort((function(e,t){return e.rank-t.rank})).filter((function(e){return"outcome"===e.type})).map((function(e){return r.a.createElement(pe,{tile:e,width:n})})))))))}}]),n}(a.PureComponent),fe=Object(g.b)((function(e){return{tiles:e.tiles}}))(he),ve=n(209),ge=n.n(ve),Ee=n(449),ye=n(208),be=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("h2",null,"Your predicted grade is a ",r.a.createElement("b",null,this.props.average),"."),r.a.createElement(ye.Line,{data:this.props.data,options:{legend:{display:!1}}}))}}]),n}(a.PureComponent),we=(n(403),function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).isCompleted=function(e){return 0===(e.items||[]).filter((function(e){return"unstarted"===e.status})).length},e.renderProgress=function(t){var n=e.isCompleted(t),a=n?"completed":"in-progress",i=(t.grade||10)<5.5?"failed":"passed";return n?r.a.createElement("span",null,a,", ",i):r.a.createElement("span",null,a)},e.renderIemStatus=function(e){switch(e){case"failed":return r.a.createElement(oe.a,{twoToneColor:"rgb(255, 78, 78)"});case"passed":return r.a.createElement(ce.a,{twoToneColor:"#52c41a"});default:return null}},e.renderActionButton=function(t){return t.hide_action_button?null:r.a.createElement(k.a,{block:!0,type:e.isCompleted(t)?"dashed":"default"},e.isCompleted(t)?"Retake":"Take")},e.renderMetaData=function(e){return"string"===typeof e||e instanceof String?r.a.createElement("div",{dangerouslySetInnerHTML:{__html:String(e)}}):Object.keys(e).map((function(t){return r.a.createElement("p",null,r.a.createElement("b",null,t,":")," ",e[t])}))},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this,t=this.props.entries;return r.a.createElement("div",{id:"componentsView"},r.a.createElement(w.a,null,t.map((function(t){return r.a.createElement(O.a,{xs:24,sm:t.extra_wide?24:12,md:t.extra_wide?12:8,lg:t.extra_wide?8:6},r.a.createElement("div",{className:"component"},r.a.createElement("div",{className:"progress"},e.renderProgress(t)),r.a.createElement("h2",null,t.name),null!==t.grade&&(e.isCompleted(t)?r.a.createElement(de,{statusFromAverage:!0,average:t.grade}):r.a.createElement("span",null,"-")),(t.items||[]).map((function(t){return r.a.createElement("div",{className:"items"},r.a.createElement(w.a,null,r.a.createElement(O.a,{xs:19,md:12},r.a.createElement("a",{href:t.referer},t.name)),r.a.createElement(O.a,{xs:5,md:12},e.renderIemStatus(t.status))))})),t.metadata&&e.renderMetaData(t.metadata),e.renderActionButton(t)))}))))}}]),n}(a.PureComponent)),Oe=(n(404),function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).renderGraph=function(){var t=e.props.view;if(!t||1!==t.entries.length)return r.a.createElement("span",null,"Error: malformed data");var n=t.entries[0],a={labels:n.metadata.map((function(e){return e.date})),datasets:[{label:n.name,data:n.metadata.map((function(e){return e.grade}))}]};return r.a.createElement("div",{className:"graphWrapper"},r.a.createElement(be,{average:n.grade||"??",data:a}))},e.renderComponents=function(){var t=e.props.view;return!t||t.entries.length<1?null:r.a.createElement("div",{className:"componentsWrapper"},r.a.createElement(we,{entries:t.entries}))},e.renderOutcome=function(){return r.a.createElement("div",null,r.a.createElement("ul",null,r.a.createElement("li",null,"de kernbegrippen uit de farmacokinetiek (halfwaardetijd, verdelingsvolume e.d.) onderscheiden en toepassen"),r.a.createElement("li",null,"de kernbegrippen uit de farmacodynamiek (receptoraffiniteit, agonisme, antagonisme, concentratie-responsrelatie e.d.) onderscheiden en toepassen"),r.a.createElement("li",null,"farmacokinetische en farmacodynamische eigenschappen van neurofarmaca evalueren om zo te interpreteren hoe deze van belang zijn voor de farmacotherapeutische toepasbaarheid en effectiviteit van deze (potenti\xeble) geneesmiddelen"),r.a.createElement("li",null,"uitleggen (in een presentatie) welke (biologische) processen leiden tot de klinische verschijnselen van hersenaandoeningen"),r.a.createElement("li",null,"uitleggen (in een presentatie) hoe huidige (psycho)biologische onderzoeksbenaderingen inzicht verschaffen in de diverse ziektebeelden"),r.a.createElement("li",null,"een samenvatting in eigen woorden geven van de gangbare farmacotherapie\xebn en hoe die leiden tot verlichting van de klinische symptomen"),r.a.createElement("li",null,"de verschillende aspecten van het \u201cresearch & development\u201d van geneesmiddelen benoemen en uitleggen hoe deze worden toegepast bij de ontwikkeling van nieuwe geneesmiddelen"),r.a.createElement("li",null,"evalueren welke problemen kleven aan het gebruik van de beschikbare neurofarmaca en hoe naar aanleiding daarvan nieuwe geneesmiddelen zouden kunnen worden ontwikkeld")))},e.renderDetailView=function(){var t=e.props.view;if(!t)return null;if("outcome"===t.type)return e.renderOutcome();switch(t.entry_view_type){case"graph":return e.renderGraph();default:return e.renderComponents()}},e}return Object(o.a)(n,[{key:"componentDidMount",value:function(){(0,this.props.dispatch)(ee())}},{key:"render",value:function(){var e=this.props,t=e.dispatch,n=e.view;return n?r.a.createElement("div",{id:"tileDetail"},r.a.createElement(ge.a,{placement:"right",title:"Back to dashboard"},r.a.createElement(k.a,{onClick:Object(z.a)(T.a.mark((function e(){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=t,e.next=3,me(null);case 3:e.t1=e.sent,(0,e.t0)(e.t1);case 5:case"end":return e.stop()}}),e)}))),type:"primary",shape:"circle",icon:r.a.createElement(Ee.a,null)})),r.a.createElement("h1",null,n.name),this.renderDetailView()):r.a.createElement(fe,null)}}]),n}(a.PureComponent)),ke=Object(g.b)((function(e){return{view:e.view}}))(Oe),je=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){var e=this.props.view;return r.a.createElement("div",{id:"app"},null===e?r.a.createElement(fe,null):r.a.createElement(ke,null))}}]),n}(a.PureComponent),_e=Object(g.b)((function(e){return{view:e.view}}))(je),Ce=n(445),Se=n(443),xe=n(440),Te=n(221),ze=n(210),Ne=n.n(ze),Ie=n(450),Ae=(n(427),n(211)),Pe=n.n(Ae),Me=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,null,[{key:"uploadData",value:function(e){return this.client.post("Admin-perusall",e)}},{key:"getAll",value:function(){return this.client.get("Admin-perusall")}}]),n}(d),De=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={collection:""},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement(re.a,{orientation:"left"},this.props.title),r.a.createElement("p",null,"Per upload zijn de volgende velden vereist:",r.a.createElement("ul",null,this.props.required_fields.map((function(e){return r.a.createElement("li",null,e)})))),r.a.createElement(Se.a,{onChange:function(t){return e.setState({collection:t.target.value})},placeholder:"collection",style:{width:200}}),r.a.createElement(Ne.a,{cssClass:"csv-reader-input",onFileLoaded:function(t){if(0!==t.length){var n=t[0];e.props.required_fields.map((function(e){return Object.keys(n).includes(e)})).some((function(e){return!e}))?xe.a.error({title:"Failed to upload data",content:"Not all required fields were included!"}):Me.uploadData({key:e.state.collection,payload:t}).then((function(){xe.a.success({title:"Data uploaded successfully",content:"".concat(t.length," records were added!")})}))}},onError:function(){return Te.b.error("An error occurred loading the file")},parserOptions:{header:!0,dynamicTyping:!0,skipEmptyLines:!0,transformHeader:function(e){return e.toLowerCase().replace(/\W/g,"_")}},inputId:this.props.id,disabled:this.state.collection.length<1}),r.a.createElement(k.a,{type:"primary",onClick:function(){Me.getAll().then((function(t){xe.a.info({width:800,title:"".concat(e.props.title," data"),content:r.a.createElement("div",{style:{maxHeight:"60vh",overflow:"scroll"}},r.a.createElement(Pe.a,{name:!1,collapsed:!0,enableClipboard:!1,displayObjectSize:!1,displayDataTypes:!1,src:t.data}))})}))}},"View data"),"\xa0",r.a.createElement(k.a,{danger:!0,onClick:function(){xe.a.confirm({title:"Are you sure delete all ".concat(e.props.title," data?"),icon:r.a.createElement(Ie.a,null),content:"This action can not be undone.",okText:"Yes",okType:"danger",cancelText:"No",onOk:function(){console.log("OK")},onCancel:function(){console.log("Cancel")}})}},"Reset"))}}]),n}(a.PureComponent),Le=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("h1",null,"IguideME administration"),r.a.createElement(De,{id:"practice",title:"Practice Sessions",required_fields:["studentnaam","grade"]}),r.a.createElement(De,{id:"perusall",title:"Perusall",required_fields:["studentnaam","grade"]}),r.a.createElement(De,{id:"attendance",title:"Lecture Attendance",required_fields:["studentnaam","aanwezig (1 of 0)"]}))}}]),n}(a.PureComponent),Re=function(e){Object(m.a)(n,e);var t=Object(p.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this,t=this.props.dispatch;h.fetchConsent().then((function(n){switch(n.data){case 1:t(f(!0));break;case 0:t(f(!1));break;default:t(f(null))}e.forceUpdate()})).catch((function(){t(f(null)),e.forceUpdate()}))}},{key:"render",value:function(){return this.props.consent?!1===this.props.consent.granted?r.a.createElement("div",null,r.a.createElement(Ce.a,{message:"Consent not granted",description:"You have denied consent in the past. If you wish to participate you can grant consent below.",type:"info",showIcon:!0}),r.a.createElement(S,null)):null===this.props.consent.granted?r.a.createElement(S,null):r.a.createElement(E.a,null,r.a.createElement(y.c,null,r.a.createElement(y.a,{path:"/admin"},r.a.createElement(Le,null)),r.a.createElement(y.a,{path:"/consent"},r.a.createElement(S,null)),r.a.createElement(y.a,{path:"/"},r.a.createElement(_e,null)))):r.a.createElement(v,null)}}]),n}(r.a.Component),We=Object(g.b)((function(e){return{consent:e.consent}}))(Re),qe=n(216);d.setup(),l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(g.a,{store:X},r.a.createElement(qe.a,{loading:null,persistor:Z},r.a.createElement(We,null)))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[223,1,2]]]);
//# sourceMappingURL=main.6f1dd2b4.chunk.js.map