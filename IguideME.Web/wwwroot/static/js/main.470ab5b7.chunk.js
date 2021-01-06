(this.webpackJsonpiguideme=this.webpackJsonpiguideme||[]).push([[0],{223:function(e,t,n){e.exports=n(436)},228:function(e,t,n){},229:function(e,t,n){},265:function(e,t,n){},273:function(e,t,n){},274:function(e,t,n){},295:function(e,t,n){},404:function(e,t,n){},405:function(e,t,n){},428:function(e,t,n){},436:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(10),l=n.n(i);n(228),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(229);var c=n(6),o=n(7),s=n(190),u=n.n(s),d=function(){function e(){Object(c.a)(this,e)}return Object(o.a)(e,null,[{key:"setup",value:function(){console.log("CONTROLLER SETUP"),this.client=u.a.create({baseURL:"https://localhost:5001/"}),console.log(this.client)}}]),e}();d.client=void 0;var p=n(9),m=n(8),h=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,null,[{key:"fetchConsent",value:function(){return this.client.get("consent")}},{key:"setConsent",value:function(e){return this.client.post("consent",{granted:null===e?-1:e?1:0})}}]),n}(d),f=function(e){return{type:"SET_CONSENT_SUCCESS",payload:{granted:e}}},g=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement("h1",null,"Welcome to IguideME"))}}]),n}(a.Component),v=n(41),y=n(216),E=n(26),b=n(443),w=n(445),O=n(447),k=n(70),j=n(109),_=n.n(j),S=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={acceptedTerms:!1},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this,t=this.props.dispatch;return r.a.createElement("div",{id:"consent",style:{display:"block",padding:"10px",width:"100vw"}},r.a.createElement(_.a,null,r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement("h1",null,"IguideME"),r.a.createElement("h2",null,"INFORMED CONSENT"))),r.a.createElement("p",null,"Dear participant,",r.a.createElement("br",null),'We ask for your cooperation in an evaluation study into educational improvement. In this document, the so-called "informed consent", we explain this study and you can indicate whether you want to cooperate. Read the text below carefully. Then click on the informed consent link to sign the document (with yes or no, that choice is free).'),r.a.createElement("h3",null,"Goal of the research"),r.a.createElement("p",null,"The goal of this educational research is to study the effects of the feedback tool \u201cIguideME\u201d and activating learning tools (e.g. Perusall) on the learning process.",r.a.createElement("br",null),"The results of this research can be used to facilitate your learning process, to improve the design of this and other courses, and for scientific publications."),r.a.createElement("h3",null,"Research description"),r.a.createElement("p",null,"To investigate the effects of using IguideME, personal data (name and student ID) and learning activity data will be collected. Based on these data, you will receive personal feedback via the IguideME dashboard in Canvas. To investigate the effects of activating learning tools, the quality of assignments will be assessed and the results of a short questionnaire that scores motivation and learning behavior will be compared between the beginning and at the end of the course. For presentations purposes, all data will be anonymized."),r.a.createElement("h3",null,"Voluntariness"),r.a.createElement("p",null,"The participation in this research is voluntary. In the case that you decline to participate or stop your participation the data that you have generated will not be used in the research. You are free to stop your participation in this research without specifying a reason by informing dr. Erwin van Vliet."),r.a.createElement("h3",null,"Insurance"),r.a.createElement("p",null,"This research brings no risks for your health and safety and in this case the regular liability insurance of the University of Amsterdam is valid."),r.a.createElement("h3",null,"Additional Information"),r.a.createElement("p",null,"In case of any questions about this research please contact: dr. Erwin van Vliet (projectleader IGuideME), phone ",r.a.createElement("a",{href:"tel:0205257630"},"020-525 7630"),", e-mail ",r.a.createElement("a",{href:"mailto:e.a.vanvliet@uva.nl"},"e.a.vanvliet@uva.nl")),r.a.createElement("h2",null,"CONSENT FORM"),r.a.createElement("p",null,"Here you will be asked to sign the Informed consent.",r.a.createElement("br",null),r.a.createElement("ul",null,r.a.createElement("li",null,"By choosing ",r.a.createElement("i",null,'"Yes"')," in this form, you declare that you have read the document entitled \u201cinformed consent IguideME\u201d, understood it, and confirm that you agree with the procedure as described.",r.a.createElement("br",null)),r.a.createElement("li",null,"By choosing ",r.a.createElement("i",null,'"No"')," in the form, you declare that you have read read the document entitled \u201cinformed consent IguideME\u201d, understood it, and confirm that you do not want to participate in this study."))),r.a.createElement(b.a,{value:this.state.acceptedTerms,onChange:function(){return e.setState((function(e){return{acceptedTerms:!e.acceptedTerms}}))}},"\u201cI declare that I have read the information and understood it. I authorize the participation in this educational research and the use of my data in it. I keep my right to stop this authorization without giving an explicit reason to stop and to stop my participation in this experiment at any moment.\u201d"),r.a.createElement(w.a,{gutter:[6,6],style:{marginTop:20}},r.a.createElement(O.a,{md:12,xs:24},r.a.createElement(k.a,{onClick:function(){return h.setConsent(!0).then((function(){return t(f(!0))}))},disabled:!this.state.acceptedTerms,type:"primary",block:!0},"Yes, I give consent")),r.a.createElement(O.a,{md:12,xs:24},r.a.createElement("a",{href:"#"},r.a.createElement(k.a,{onClick:function(){return h.setConsent(!1).then((function(){return t(f(!1))}))},block:!0},"No, I do not give consent")))))}}]),n}(a.Component),C=Object(v.b)((function(e){return{consent:e.consent}}))(S),x=(n(265),n(98)),A=n(43),T=n.n(A),N=n(67),I=[{rank:2,type:"grade",name:"Prediction",visible:!0,average_grade:7.1,progress:null,peer_comparison:{minimum:0,maximum:10,average:7.1},entry_view_type:"graph",entries:[{name:"Predicted grade",grade:7.1,items:[],metadata:[{date:"01/07",y_lower:1.2,y_hat:5.4,y_upper:6.8},{date:"02/07",y_lower:4.2,y_hat:6.4,y_upper:9.8},{date:"03/07",y_lower:4.2,y_hat:6.4,y_upper:7.8},{date:"04/07",y_lower:1.2,y_hat:5.4,y_upper:6.8},{date:"05/07",y_lower:1.2,y_hat:5.4,y_upper:6.8},{date:"06/07",y_lower:1.2,y_hat:5.4,y_upper:6.8},{date:"07/07",y_lower:1.2,y_hat:5.4,y_upper:6.8}]}]},{rank:2,type:"outcome",name:"Learning Outcome",visible:!0,progress:0,peer_comparison:{minimum:0,maximum:3,average:1},entry_view_type:"components",entries:[]}],z=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,null,[{key:"fetchDiscussions",value:function(){return this.client.get("discussions")}},{key:"fetchQuizzes",value:function(){return this.client.get("quizzes")}},{key:"fetchSubmissions",value:function(){return this.client.get("submissions")}},{key:"fetchPerusall",value:function(){return this.client.get("perusall")}},{key:"fetchAttendance",value:function(){return this.client.get("attendance")}},{key:"fetchPracticeSessions",value:function(){return this.client.get("practice-sessions")}}]),n}(d),P=function(e){return 0===e.length&&(e=[0,1]),{minimum:Math.min.apply(Math,Object(x.a)(e)),maximum:Math.max.apply(Math,Object(x.a)(e)),average:Math.round(e.reduce((function(e,t){return e+t}))/e.length*10)/10}},M=function(e){var t=e.data;return{type:"activity",rank:5,name:"Send in questions",visible:!0,progress:t.length,peer_comparison:{minimum:0,maximum:t.length,average:2},entry_view_type:"components",entries:t.map((function(e){return{name:e.title,hide_action_button:!0,grade:null,items:[],metadata:e.message}}))}},D=function(e){var t=e.data,n=t.submissions,a=t.quizzes,r=(t.questions,t.peer_comp),i=(e.data.questions||[]).map((function(e){return e.map((function(e){return 0===e.length?null:e})).flat()}));return{rank:1,type:"activity",name:"Quizzes",visible:!0,progress:Math.round(n.filter((function(e){return null!==e.score})).length/a.length*100),average_grade:n.filter((function(e){return null!==e.score})).map((function(e){return e.score})).reduce((function(e,t){return e+t}),0)/n.filter((function(e){return null!==e.score})).length,peer_comparison:P(r),entry_view_type:"components",entries:a.map((function(e,t){return{name:e.title,grade:n[t]?n[t].score:null,items:(i[t]||[]).map((function(e,a){return{name:"Question #".concat(a+1),status:null!==n[t]?e?"passed":"failed":"unstarted"}}))}}))}},U=function(e){var t=e.data.payload,n=Object.keys(t);return{rank:3,type:"activity",name:"Perusall Assignments",visible:!0,progress:Math.round(n.length/3*100),average_grade:Math.round(n.map((function(e){return t[e].grade})).reduce((function(e,t){return e+t}),0)/n.length*10)/10,peer_comparison:P(e.data.peer_comp),entry_view_type:"components",entries:n.map((function(e,n){return{extra_wide:!0,hide_action_button:!0,name:"Perusall assignment ".concat(n+1),grade:t[e].grade||null,items:[],metadata:JSON.parse(t[e].entry||"{}")}}))}},R=function(e){var t=e.data.payload,n=Object.keys(t);return{rank:2,type:"activity",name:"Practice Sessions",visible:!0,progress:Math.round(n.length/5*100),average_grade:Math.round(n.map((function(e){return t[e].grade})).reduce((function(e,t){return e+t}),0)/n.length*10)/10,peer_comparison:P(e.data.peer_comp),entry_view_type:"components",entries:n.map((function(e,n){return{extra_wide:!0,hide_action_button:!0,name:"Practice Session ".concat(n+1),grade:t[e].grade,items:[]}}))}},W=function(e){var t=e.data.payload,n=Object.keys(t);return{rank:6,type:"activity",name:"Lecture Attendance",visible:!0,progress:Math.round(t.filter((function(e){return"ja"===e.aanwezig})).length/25*100),peer_comparison:P(e.data.peer_comp),entry_view_type:"components",entries:n.map((function(e,n){return{grade:null,hide_action_button:!0,name:"".concat(e),items:[],metadata:{Aanwezig:t[e].aanwezig}}}))}},F=function(e){var t=e.data.payload;return{rank:1,type:"grade",name:"Exam grades",visible:!0,average_grade:Math.round(t.map((function(e){return parseFloat(e.grade)})).reduce((function(e,t){return e+t}),0)/t.length*10)/10,progress:Math.round(t.length/3*100),peer_comparison:P(e.data.peer_comp),entry_view_type:"components",entries:t.map((function(e){return{grade:e.grade,hide_action_button:!0,name:e.name,items:[]}}))}},L=n(192),V=n(193),q=n.n(V),B=n(194),Y=n(45),J=n(141),G=n(195),H=n.n(G),Q=n(196);function $(e,t){return function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t,a=arguments.length>1?arguments[1]:void 0;switch(a.type){case"SET_".concat(e,"_PENDING"):return null;case"SET_".concat(e,"_SUCCESS"):return a.payload;case"UNSET_".concat(e,"_SUCCESS"):return null;case"SET_".concat(e,"_ERROR"):return a.error||"ERROR"}return n}}var K=Object(Y.c)({routing:Q.routerReducer,tiles:$("TILES",[]),view:$("VIEW",null),consent:$("CONSENT",null),adminView:$("ADMIN_VIEW",!1)}),X={key:"root",storage:H.a,whitelist:["activeLabel","projects"]},Z=Object(J.a)(X,K),ee=Object(Y.d)(Z,Object(Y.a)(L.a,q.a,Object(B.createLogger)())),te=Object(J.b)(ee),ne=function(){var e=Object(N.a)(T.a.mark((function e(){var t;return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=JSON.parse(JSON.stringify(I)),ee.dispatch({type:"SET_TILES_SUCCESS",payload:null}),e.t0=t,e.t1=D,e.next=6,z.fetchQuizzes();case 6:return e.t2=e.sent,e.t3=(0,e.t1)(e.t2),e.t0.push.call(e.t0,e.t3),e.t4=t,e.t5=M,e.next=13,z.fetchDiscussions();case 13:return e.t6=e.sent,e.t7=(0,e.t5)(e.t6),e.t4.push.call(e.t4,e.t7),e.t8=t,e.t9=U,e.next=20,z.fetchPerusall();case 20:return e.t10=e.sent,e.t11=(0,e.t9)(e.t10),e.t8.push.call(e.t8,e.t11),e.t12=t,e.t13=R,e.next=27,z.fetchPracticeSessions();case 27:return e.t14=e.sent,e.t15=(0,e.t13)(e.t14),e.t12.push.call(e.t12,e.t15),e.t16=t,e.t17=W,e.next=34,z.fetchAttendance();case 34:return e.t18=e.sent,e.t19=(0,e.t17)(e.t18),e.t16.push.call(e.t16,e.t19),e.t20=t,e.t21=F,e.next=41,z.fetchSubmissions();case 41:return e.t22=e.sent,e.t23=(0,e.t21)(e.t22),e.t20.push.call(e.t20,e.t23),e.abrupt("return",{type:"SET_TILES_SUCCESS",payload:t});case 45:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ae=n(438),re=n(439),ie=n(440),le=n(437),ce=(n(273),function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){var e=this.props,t=e.min,n=e.max,a=e.avg;return r.a.createElement("div",{className:"grade-distribution"},r.a.createElement("div",{className:"min"},r.a.createElement("small",null,"min"),r.a.createElement("span",null,t)),r.a.createElement("div",{className:"distribution"},r.a.createElement("small",null,"mean"),r.a.createElement("div",{className:"avg"},r.a.createElement("span",null,a)),r.a.createElement("div",{className:"sep",style:{left:"".concat((a-t)/(n-t)*100,"%")}})),r.a.createElement("div",{className:"max"},r.a.createElement("small",null,"max"),r.a.createElement("span",null,n)))}}]),n}(a.PureComponent)),oe=(n(274),function(e){return e>=5.5}),se=n(448),ue=n(449),de=n(442),pe=n(142),me=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).indicateByAverage=function(e){return r.a.createElement(de.a,{prefix:oe(e)?r.a.createElement(pe.a,{title:"You're doing great!"},r.a.createElement(se.a,{twoToneColor:"#52c41a"})):r.a.createElement(pe.a,{title:"You're behind the desired average"},r.a.createElement(ue.a,{twoToneColor:"rgb(255, 78, 78)"})),value:e,suffix:"/ 10"})},e.indicateByPeerComparison=function(e,t){return e>=t?r.a.createElement("h1",null,r.a.createElement(pe.a,{title:"You're doing great!"},r.a.createElement(se.a,{twoToneColor:"#52c41a"}))):r.a.createElement("h1",null,r.a.createElement(pe.a,{title:"You're behind the desired average"},r.a.createElement(ue.a,{twoToneColor:"rgb(255, 78, 78)"})))},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this.props,t=e.statusFromAverage,n=e.average,a=e.progress,i=e.peerAverage;return r.a.createElement("div",null,r.a.createElement("div",{className:"statistic"},t?this.indicateByAverage(n):this.indicateByPeerComparison(a,i)))}}]),n}(a.PureComponent),he=function(){var e=Object(N.a)(T.a.mark((function e(t){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",{type:"SET_VIEW_SUCCESS",payload:t});case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),fe=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).progress=function(){var t=e.props.tile.progress;switch(t){case 0:return r.a.createElement(ie.a,{percent:0,status:"exception"});case 100:return r.a.createElement(ie.a,{percent:100});case null:return null;default:return r.a.createElement(ie.a,{percent:t})}},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.width,a=t.tile,i=a.average_grade,l=a.name,c=a.peer_comparison,o=a.progress;return a.visible?r.a.createElement("div",{style:{width:"".concat(n,"px")},className:"tile",onClick:Object(N.a)(T.a.mark((function t(){return T.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.t0=ee,t.next=3,he(e.props.tile);case 3:t.t1=t.sent,t.t0.dispatch.call(t.t0,t.t1);case 5:case"end":return t.stop()}}),t)})))},r.a.createElement(_.a,null,r.a.createElement("div",{className:"inner ".concat(oe(i||0)?"sufficient":"insufficient")},r.a.createElement("div",{className:"title"},r.a.createElement("h2",null,l)),null!==o?r.a.createElement("div",null,this.progress()):null,r.a.createElement(me,{statusFromAverage:!isNaN(i),average:null!==i?i:null,progress:o||null,peerAverage:c.average}),r.a.createElement("div",{className:"peer"},r.a.createElement(le.a,{plain:!0},"Peer comparison"),r.a.createElement(ce,{min:c.minimum,max:c.maximum,avg:c.average}))))):null}}]),n}(a.PureComponent),ge=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,null,[{key:"fetchIsAdmin",value:function(){return this.client.get("is-admin")}}]),n}(d),ve=(n(295),function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(e){var a;return Object(c.a)(this,n),(a=t.call(this,e)).wrapper=void 0,a.updateTileSize=function(){try{var e=a.wrapper.current.getBoundingClientRect().width;e>=990?a.setState({tileWidth:(e-50)/5,colSize:["60%","40%"]}):e>=760?a.setState({tileWidth:(e-50-1)/3,colSize:["".concat(100/3*2,"%"),"".concat(100/3,"%")]}):a.setState({tileWidth:(e-50-2)/2,colSize:["100%","100%"]})}catch(t){a.forceUpdate()}},a.wrapper=r.a.createRef(),a.state={isAdmin:!1,tileWidth:0,colSize:["0px","0px"]},a}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this;(0,this.props.dispatch)(ne()),ge.fetchIsAdmin().then((function(t){e.setState({isAdmin:t.data})})),window.addEventListener("resize",this.updateTileSize)}},{key:"componentDidUpdate",value:function(e,t,n){JSON.stringify(e.tiles)!==JSON.stringify(this.props.tiles)&&this.updateTileSize()}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.updateTileSize)}},{key:"render",value:function(){var e=this,t=this.props.tiles,n=this.state,a=n.tileWidth,i=n.colSize;return null===t?r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement("h1",null,"Welcome to IguideME"),r.a.createElement(ae.a,{size:"large"})):r.a.createElement("div",{ref:this.wrapper,style:{padding:20,boxSizing:"border-box"}},this.state.isAdmin&&r.a.createElement("div",{style:{marginBottom:20}},r.a.createElement(k.a,{onClick:function(){return e.props.dispatch({type:"SET_ADMIN_VIEW_SUCCESS",payload:!0})}},"Administration")),r.a.createElement(w.a,{gutter:[5,5]},r.a.createElement(O.a,{flex:i[0],className:"tileWrapper"},r.a.createElement(re.a.Title,{level:3},"Activities"),(t||[]).sort((function(e,t){return e.rank-t.rank})).filter((function(e){return"activity"===e.type})).map((function(e){return r.a.createElement(fe,{tile:e,width:a})}))),r.a.createElement(O.a,{flex:i[1]},r.a.createElement("div",{className:"tileWrapper"},r.a.createElement(re.a.Title,{level:3},"Course Grades"),(t||[]).sort((function(e,t){return e.rank-t.rank})).filter((function(e){return"grade"===e.type})).map((function(e){return r.a.createElement(fe,{tile:e,width:a-5})}))),r.a.createElement("br",null),r.a.createElement("div",{className:"tileWrapper"},r.a.createElement(re.a.Title,{level:3},"Learning Outcome"),r.a.createElement(w.a,{justify:"center"},(t||[]).sort((function(e,t){return e.rank-t.rank})).filter((function(e){return"outcome"===e.type})).map((function(e){return r.a.createElement(fe,{tile:e,width:a})})))))))}}]),n}(a.PureComponent)),ye=Object(v.b)((function(e){return{tiles:e.tiles}}))(ve),Ee=n(210),be=n.n(Ee),we=n(450),Oe=n(209),ke=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("h2",null,"Your predicted grade is a ",r.a.createElement("b",null,this.props.average),"."),r.a.createElement(Oe.Line,{data:{labels:[1,2,3,4],datasets:[{label:"Min",backgroundColor:"rgba(55, 173, 221,  0.6)",borderColor:"rgba(55, 173, 221, 1.0)",fill:!1,data:[5,5,3,2]},{label:"Max",backgroundColor:"rgba(55, 173, 221, 0.6)",borderColor:"rgba(55, 173, 221, 1.0)",fill:"-1",data:[8,7,6,5]},{label:"Predicted grade",backgroundColor:"rgba(55, 173, 221, 0.6)",borderColor:"rgba(55, 173, 221, 1.0)",fill:!1,data:[7,6,4,4]}]},options:{legend:{display:!1},maintainAspectRatio:!1,spanGaps:!1,elements:{line:{tension:1e-6}},plugins:{filler:{propagate:!1}},scales:{xAxes:[{ticks:{autoSkip:!1}}]}}}))}}]),n}(a.PureComponent),je=(n(404),function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).isCompleted=function(e){return 0===(e.items||[]).filter((function(e){return"unstarted"===e.status})).length},e.renderProgress=function(t){var n=e.isCompleted(t),a=n?"completed":"in-progress",i=(t.grade||10)<5.5?"failed":"passed";return n?r.a.createElement("span",null,a,", ",i):r.a.createElement("span",null,a)},e.renderIemStatus=function(e){switch(e){case"failed":return r.a.createElement(ue.a,{twoToneColor:"rgb(255, 78, 78)"});case"passed":return r.a.createElement(se.a,{twoToneColor:"#52c41a"});default:return null}},e.renderActionButton=function(t){return t.hide_action_button?null:r.a.createElement(k.a,{block:!0,type:e.isCompleted(t)?"dashed":"default"},e.isCompleted(t)?"Retake":"Take")},e.renderMetaData=function(e){return"string"===typeof e||e instanceof String?r.a.createElement("div",{dangerouslySetInnerHTML:{__html:String(e)}}):Object.keys(e).map((function(t){return r.a.createElement("p",null,r.a.createElement("b",null,t,":")," ",e[t])}))},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this,t=this.props.entries;return r.a.createElement("div",{id:"componentsView"},r.a.createElement(w.a,null,t.map((function(t){return r.a.createElement(O.a,{xs:24,sm:t.extra_wide?24:12,md:t.extra_wide?12:8,lg:t.extra_wide?8:6},r.a.createElement("div",{className:"component"},r.a.createElement("div",{className:"progress"},e.renderProgress(t)),r.a.createElement("h2",null,t.name),null!==t.grade&&(e.isCompleted(t)?r.a.createElement(me,{statusFromAverage:!0,average:t.grade}):r.a.createElement("span",null,"-")),(t.items||[]).map((function(t){return r.a.createElement("div",{className:"items"},r.a.createElement(w.a,null,r.a.createElement(O.a,{xs:19,md:12},r.a.createElement("a",{href:t.referer},t.name)),r.a.createElement(O.a,{xs:5,md:12},e.renderIemStatus(t.status))))})),t.metadata&&e.renderMetaData(t.metadata),e.renderActionButton(t)))}))))}}]),n}(a.PureComponent)),_e=(n(405),function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,i=new Array(a),l=0;l<a;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).renderGraph=function(){var t=e.props.view;if(!t||1!==t.entries.length)return r.a.createElement("span",null,"Error: malformed data");var n=t.entries[0],a={labels:n.metadata.map((function(e){return e.date})),datasets:[{label:n.name,data:n.metadata.map((function(e){return e.grade}))}]};return r.a.createElement("div",{className:"graphWrapper"},r.a.createElement(ke,{average:n.grade||"??",data:a}))},e.renderComponents=function(){var t=e.props.view;return!t||t.entries.length<1?null:r.a.createElement("div",{className:"componentsWrapper"},r.a.createElement(je,{entries:t.entries}))},e.renderOutcome=function(){return r.a.createElement("div",null,r.a.createElement("ul",null,r.a.createElement("li",null,"de kernbegrippen uit de farmacokinetiek (halfwaardetijd, verdelingsvolume e.d.) onderscheiden en toepassen"),r.a.createElement("li",null,"de kernbegrippen uit de farmacodynamiek (receptoraffiniteit, agonisme, antagonisme, concentratie-responsrelatie e.d.) onderscheiden en toepassen"),r.a.createElement("li",null,"farmacokinetische en farmacodynamische eigenschappen van neurofarmaca evalueren om zo te interpreteren hoe deze van belang zijn voor de farmacotherapeutische toepasbaarheid en effectiviteit van deze (potenti\xeble) geneesmiddelen"),r.a.createElement("li",null,"uitleggen (in een presentatie) welke (biologische) processen leiden tot de klinische verschijnselen van hersenaandoeningen"),r.a.createElement("li",null,"uitleggen (in een presentatie) hoe huidige (psycho)biologische onderzoeksbenaderingen inzicht verschaffen in de diverse ziektebeelden"),r.a.createElement("li",null,"een samenvatting in eigen woorden geven van de gangbare farmacotherapie\xebn en hoe die leiden tot verlichting van de klinische symptomen"),r.a.createElement("li",null,"de verschillende aspecten van het \u201cresearch & development\u201d van geneesmiddelen benoemen en uitleggen hoe deze worden toegepast bij de ontwikkeling van nieuwe geneesmiddelen"),r.a.createElement("li",null,"evalueren welke problemen kleven aan het gebruik van de beschikbare neurofarmaca en hoe naar aanleiding daarvan nieuwe geneesmiddelen zouden kunnen worden ontwikkeld")))},e.renderDetailView=function(){var t=e.props.view;if(!t)return null;if("outcome"===t.type)return e.renderOutcome();switch(t.entry_view_type){case"graph":return e.renderGraph();default:return e.renderComponents()}},e}return Object(o.a)(n,[{key:"componentDidMount",value:function(){(0,this.props.dispatch)(ne())}},{key:"render",value:function(){var e=this.props,t=e.dispatch,n=e.view;return n?r.a.createElement("div",{id:"tileDetail"},r.a.createElement(be.a,{placement:"right",title:"Back to dashboard"},r.a.createElement(k.a,{onClick:Object(N.a)(T.a.mark((function e(){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=t,e.next=3,he(null);case 3:e.t1=e.sent,(0,e.t0)(e.t1);case 5:case"end":return e.stop()}}),e)}))),type:"primary",shape:"circle",icon:r.a.createElement(we.a,null)})),r.a.createElement("h1",null,n.name),this.renderDetailView()):r.a.createElement(ye,null)}}]),n}(a.PureComponent)),Se=Object(v.b)((function(e){return{view:e.view}}))(_e),Ce=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){var e=this.props.view;return r.a.createElement("div",{id:"app"},null===e?r.a.createElement(ye,null):r.a.createElement(Se,null))}}]),n}(a.PureComponent),xe=Object(v.b)((function(e){return{view:e.view}}))(Ce),Ae=n(446),Te=n(444),Ne=n(441),Ie=n(221),ze=n(211),Pe=n.n(ze),Me=n(451),De=(n(428),n(212)),Ue=n.n(De),Re=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){var e;Object(c.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={collection:""},e}return Object(o.a)(n,[{key:"render",value:function(){var e=this,t=this;return r.a.createElement("div",null,r.a.createElement(le.a,{orientation:"left"},this.props.title),r.a.createElement("p",null,"Per upload zijn de volgende velden vereist:",r.a.createElement("ul",null,this.props.required_fields.map((function(e){return r.a.createElement("li",null,e)})))),r.a.createElement(Te.a,{onChange:function(t){return e.setState({collection:t.target.value})},placeholder:"collection",style:{width:200}}),r.a.createElement(Pe.a,{cssClass:"csv-reader-input",onFileLoaded:function(t){if(0!==t.length){var n=t[0];e.props.required_fields.map((function(e){return Object.keys(n).includes(e)})).some((function(e){return!e}))?Ne.a.error({title:"Failed to upload data",content:"Not all required fields were included!"}):e.props.doUpload(e.state.collection,t).then((function(){Ne.a.success({title:"Data uploaded successfully",content:"".concat(t.length," records were added!")})}))}},onError:function(){return Ie.b.error("An error occurred loading the file")},parserOptions:{header:!0,dynamicTyping:!0,skipEmptyLines:!0,transformHeader:function(e){return e.toLowerCase().replace(/\W/g,"_")}},inputId:this.props.id,disabled:this.state.collection.length<1}),r.a.createElement(k.a,{type:"primary",onClick:function(){e.props.doFetch().then((function(t){var n=new Set(t.data.map((function(e){return e.groupID})));console.log("GROUPS",n);var a={};Array.from(n).forEach((function(e){a[e]=t.data.filter((function(t){return t.groupID===e}))})),console.log("JSON",a),Ne.a.info({width:800,title:"".concat(e.props.title," data"),content:r.a.createElement("div",{style:{maxHeight:"60vh",overflow:"scroll"}},r.a.createElement(Ue.a,{name:!1,collapsed:!0,enableClipboard:!1,displayObjectSize:!1,displayDataTypes:!1,src:a}))})}))}},"View data"),"\xa0",r.a.createElement(k.a,{danger:!0,onClick:function(){Ne.a.confirm({title:"Do you really want to delete all ".concat(e.props.title," data?"),icon:r.a.createElement(Me.a,null),content:"This action can not be undone.",okText:"Yes",okType:"danger",cancelText:"No",onOk:function(){t.props.doUpload("",{}).then((function(){return Ie.b.success("Reset was successful!")}))}})}},"Reset"))}}]),n}(a.PureComponent),We=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,null,[{key:"uploadData",value:function(e,t){return this.client.post("Admin-perusall",{key:e,payload:t})}},{key:"getAll",value:function(){return this.client.get("Admin-perusall")}}]),n}(d),Fe=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,null,[{key:"uploadData",value:function(e,t){return this.client.post("Admin-practice-sessions",{key:e,payload:t})}},{key:"getAll",value:function(){return this.client.get("Admin-practice-sessions")}}]),n}(d),Le=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,null,[{key:"uploadData",value:function(e,t){return this.client.post("Admin-attendance",{key:e,payload:t})}},{key:"getAll",value:function(){return this.client.get("Admin-attendance")}}]),n}(d),Ve=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(e){var a;return Object(c.a)(this,n),(a=t.call(this,e)).handlePracticeSessionsUpload=function(e,t){return Fe.uploadData(e,t).then((function(e){return e.data}))},a.handlePracticeSessionsFetch=function(){return Fe.getAll()},a.handlePerusallUpload=function(e,t){var n=t.map((function(e){return{studentnaam:e.studentnaam,grade:e.grade,entry:JSON.stringify(e)}}));return We.uploadData(e,n).then((function(e){return e.data}))},a.handlePerusallFetch=function(){return We.getAll()},a.handleAttendanceUpload=function(e,t){return Le.uploadData(e,t).then((function(e){return e.data}))},a.handleAttendanceFetch=function(){return Le.getAll()},d.setup(),a}return Object(o.a)(n,[{key:"render",value:function(){return d.setup(),r.a.createElement("div",null,r.a.createElement("h1",null,"IguideME administration"),r.a.createElement(Re,{id:"practice",title:"Practice Sessions",required_fields:["studentnaam","grade"],doUpload:this.handlePracticeSessionsUpload,doFetch:this.handlePracticeSessionsFetch}),r.a.createElement(Re,{id:"perusall",title:"Perusall",required_fields:["studentnaam","grade"],doUpload:this.handlePerusallUpload,doFetch:this.handlePerusallFetch}),r.a.createElement(Re,{id:"attendance",title:"Lecture Attendance",required_fields:["studentnaam","aanwezig"],doUpload:this.handleAttendanceUpload,doFetch:this.handleAttendanceFetch}))}}]),n}(a.PureComponent),qe=function(e){Object(p.a)(n,e);var t=Object(m.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"componentDidMount",value:function(){var e=this,t=this.props.dispatch;h.fetchConsent().then((function(n){switch(n.data){case 1:t(f(!0));break;case 0:t(f(!1));break;default:t(f(null))}e.forceUpdate()})).catch((function(){t(f(null)),e.forceUpdate()}))}},{key:"render",value:function(){return this.props.consent?!1===this.props.consent.granted?r.a.createElement("div",null,r.a.createElement(Ae.a,{message:"Consent not granted",description:"You have denied consent in the past. If you wish to participate you can grant consent below.",type:"info",showIcon:!0}),r.a.createElement(C,null)):this.props.adminView?r.a.createElement(Ve,null):null===this.props.consent.granted?r.a.createElement(C,null):r.a.createElement(y.a,null,r.a.createElement(E.c,null,r.a.createElement(E.a,{path:"/admin"},r.a.createElement(Ve,null)),r.a.createElement(E.a,{path:"/consent"},r.a.createElement(C,null)),r.a.createElement(E.a,{path:"/"},r.a.createElement(xe,null)))):r.a.createElement(g,null)}}]),n}(r.a.Component),Be=Object(v.b)((function(e){return{consent:e.consent,adminView:e.adminView}}))(qe),Ye=n(217);d.setup(),l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(v.a,{store:ee},r.a.createElement(Ye.a,{loading:null,persistor:te},r.a.createElement(Be,null)))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[223,1,2]]]);
//# sourceMappingURL=main.470ab5b7.chunk.js.map