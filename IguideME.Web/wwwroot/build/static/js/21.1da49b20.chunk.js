(this.webpackJsonpiguideme=this.webpackJsonpiguideme||[]).push([[21],{1006:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return X}));var n=a(4),r=a(5),l=a(8),i=a(9),c=a(0),o=a.n(c),u=a(197),d=a(262),s=a(777),m=a(1010),h=a(957),p=a(994),f=a(993),E={top:30,left:30,right:30,bottom:70},b={name:"Start",children:[{name:"Home",children:[{name:"Quizzes",children:[{name:"Home",children:[{name:"Perusall"},{name:"Quizzes"}]}]}]},{name:"Quizzes",children:[{name:"Perusall"},{name:"Attendance"},{name:"C",children:[{name:"C1"},{name:"D",children:[{name:"D1"},{name:"D2"}]}]}]},{name:"Perusall",children:[{name:"Attendance"},{name:"B2"},{name:"B3"}]}]},v=a(980),g=a(981),y=a(983),k=a(984),O=a(985),j=a(986),w=a(987),z=a(988),C=a(989),x=a(990),P=a(991),A=a(992);var I=function(e){Object(l.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){var e=this,t=E;return o.a.createElement("div",{style:{width:"100%"}},o.a.createElement(f.a,null,(function(a){var n=Math.max(a.width,400),r=500-t.top-t.bottom,l=n-t.left-t.right,i=0,c=0,u=function(e){var t=e.layout,a=e.linkType,n=e.orientation;return"polar"===t?"step"===a?v.a:"curve"===a?g.a:"line"===a?y.a:k.a:"vertical"===n?"step"===a?O.a:"curve"===a?j.a:"line"===a?w.a:z.a:"step"===a?C.a:"curve"===a?x.a:"line"===a?P.a:A.a}({layout:"cartesian",linkType:"diagonal",orientation:"horizontal"});return o.a.createElement("svg",{width:n,height:500},o.a.createElement(p.a,{id:"links-gradient",from:"#fd9b93",to:"#fe6e9e"}),o.a.createElement("rect",{width:n,height:500,rx:14,fill:"#272b4d"}),o.a.createElement(s.a,{top:t.top,left:t.left},o.a.createElement(m.a,{root:Object(h.b)(b,(function(e){return e.isExpanded?null:e.children})),size:[r,l],separation:function(e,t){return(e.parent===t.parent?1:.5)/e.depth}},(function(t){return o.a.createElement(s.a,{top:c,left:i},t.links().map((function(e,t){return o.a.createElement(u,{key:t,data:e,percent:.5,stroke:"rgb(254,110,158,0.6)",strokeWidth:"10",fill:"none"})})),t.descendants().map((function(t,a){var n,r;return n=t.x,r=t.y,o.a.createElement(s.a,{top:n,left:r,key:a},0===t.depth&&o.a.createElement("circle",{r:12,fill:"url('#links-gradient')",onClick:function(){t.data.isExpanded=!t.data.isExpanded,console.log(t),e.forceUpdate()}}),0!==t.depth&&o.a.createElement("rect",{height:30,width:80,y:-15,x:-40,fill:"#272b4d",stroke:t.data.children?"#03c0dc":"#26deb0",strokeWidth:1,strokeDasharray:t.data.children?"0":"2,2",strokeOpacity:t.data.children?1:.6,rx:t.data.children?0:10,onClick:function(){t.data.isExpanded=!t.data.isExpanded,console.log(t),e.forceUpdate()}}),o.a.createElement("text",{dy:".33em",fontSize:9,fontFamily:"Arial",textAnchor:"middle",style:{pointerEvents:"none"},fill:0===t.depth?"#71248e":t.children?"white":"#26deb0"},t.data.name))})))}))))})))}}]),a}(c.Component),S=a(11),Q=a(1002),D=a(996),M=a(997),N=a(995),K=[[11975,5871,8916,2868,4229],[1951,10048,2060,6171,3021],[8010,16145,8090,8045,312],[1013,990,940,6907,9210],[4201,3992,3912,6329,5302]];function T(e,t){return t<e?-1:t>e?1:t>=e?0:NaN}Object(N.a)({domain:[0,1,2,3,4],range:["url(#gpinkorange)","url(#gpurplered)","url(#gpurplegreen)","url(#gbluelime)","url(#gtest)"]});var V=function(e){Object(l.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){for(var e=["blue","red","orange","green","pink"],t=[],a=0;a<e.length-1;a++){t.push([e[a],e[a]]);for(var n=a+1;n<e.length;n++)t.push([e[a],e[n]]),t.push([e[n],e[a]])}return o.a.createElement("div",{style:{width:"100%"}},o.a.createElement(f.a,null,(function(a){var n=(a.width||200)/2,r=a.width||200,l=.5*Math.min(r,n)-20,i=l-10;return console.log(t),o.a.createElement("svg",{width:r,height:n},t.map((function(e){var t=Object(S.a)(e,2),a=t[0],n=t[1];return o.a.createElement(p.a,{id:"g"+a+n,from:a,to:n,vertical:!1})})),o.a.createElement("rect",{width:r,height:n,fill:"#e4e3d8",rx:14}),o.a.createElement(s.a,{top:n/2,left:r/2},o.a.createElement(D.a,{matrix:K,padAngle:.05,sortSubgroups:T},(function(t){return o.a.createElement("g",null,t.chords.groups.map((function(t,a){return o.a.createElement(Q.a,{key:"key-".concat(a),data:t,innerRadius:i,outerRadius:l,fill:e[a],onClick:function(){}})})),t.chords.map((function(t,a){return o.a.createElement(M.a,{key:"ribbon-".concat(a),chord:t,radius:i,fill:"url(#g".concat(e[t.source.index]).concat(e[t.target.index],")"),fillOpacity:.75,onClick:function(){alert("".concat(t.source.index,"/").concat(t.target.index))}})})))}))))})))}}]),a}(c.Component),L=a(1003),R=a(18),W=a(1015),Y=a(954),B=a(795),F=a(29),G=a.n(F),H=a(667),U="#a44afe",_=40,q=[{date:G()().add(0,"days"),Quizzes:"100",Perusall:"83"},{date:G()().add(1,"days"),Quizzes:"104",Perusall:"63"},{date:G()().add(2,"days"),Quizzes:"140",Perusall:"98"},{date:G()().add(3,"days"),Quizzes:"170",Perusall:"112"},{date:G()().add(4,"days"),Quizzes:"130",Perusall:"120"},{date:G()().add(5,"days"),Quizzes:"120",Perusall:"140"},{date:G()().add(6,"days"),Quizzes:"180",Perusall:"195"}],J=function(e){Object(l.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){return o.a.createElement("div",{style:{width:"100%"}},o.a.createElement(H.a,{mode:"multiple",allowClear:!0,style:{marginBottom:20,width:300},placeholder:"Please select",defaultValue:["quizzes","perusall"],onChange:function(){}},o.a.createElement(H.a.Option,{value:"quizzes"},"Quizzes"),o.a.createElement(H.a.Option,{value:"perusall"},"Perusall")),o.a.createElement(f.a,null,(function(e){var t,a,n=e.width,r=n,l=500-_-100,i=Object.keys(q[0]).filter((function(e){return"date"!==e})),c=q.reduce((function(e,t){var a=i.reduce((function(e,a){return e+=Number(t[a])}),0);return e.push(a),e}),[]),u=(t=q,Object(W.a)().domain(t.map((function(e){return function(e){return e.date.format("YYYY-MM-DD")}(e)}))).padding(.2)),d=(a=c,Object(Y.a)().domain([0,Math.max.apply(Math,Object(R.a)(a))]).nice());!function(e,t){Object(B.a)().domain(e).range(t)}(i,["#6c5efb","#c998ff",U]);return u.rangeRound([0,r]),d.range([l,0]),o.a.createElement("svg",{width:n,height:500},o.a.createElement("rect",{x:0,y:0,width:n,height:500,fill:"#eaedff",rx:14}),o.a.createElement(s.a,{top:_}),o.a.createElement(L.a,{top:l+_,scale:u,tickFormat:function(e){return e},stroke:U,tickStroke:U,tickLabelProps:function(){return{fill:U,fontSize:11,textAnchor:"middle"}}}))})))}}]),a}(c.Component),X=function(e){Object(l.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){return o.a.createElement(u.a,{menuKey:"analytics"},o.a.createElement("h1",null,"Analytics"),o.a.createElement("span",null,"Configure the dashboard visible to students."),o.a.createElement(d.a,null),o.a.createElement("h2",null,"User interactions"),o.a.createElement("p",null,"Graph overview of all user interactions."),o.a.createElement(I,null),o.a.createElement(d.a,null),o.a.createElement("h2",null,"Tile traffic"),o.a.createElement("p",null,"Each ribbon shows the traffic volume between all views."),o.a.createElement(V,null),o.a.createElement(d.a,null),o.a.createElement("h2",null,"Tile conversions"),o.a.createElement(J,null))}}]),a}(c.Component)},185:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var n=a(4),r=a(5),l=a(8),i=a(9),c=a(3),o=a(16),u=a(71),d=a(10),s=function(e){Object(l.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,null,[{key:"getStudents",value:function(){return Object(c.a)()?Object(d.a)(u.a):this.client.get("students").then((function(e){return e.data}))}}]),a}(o.a)},191:function(e,t,a){"use strict";var n=a(6),r=a(4),l=a(5),i=a(8),c=a(9),o=a(0),u=a.n(o),d=a(206),s=a(673),m=a(78),h=a(1012),p=a(47),f=a(185),E=a(3),b=a(46),v=(a(192),Object(b.b)((function(e){return{course:e.course,user:e.user}}))),g=function(e){Object(i.a)(a,e);var t=Object(c.a)(a);function a(){var e;Object(r.a)(this,a);for(var n=arguments.length,l=new Array(n),i=0;i<n;i++)l[i]=arguments[i];return(e=t.call.apply(t,[this].concat(l))).state={loaded:!1,students:[]},e}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.props.studentPickView&&f.a.getStudents().then((function(t){return e.setState({students:t,loaded:!0})})),this.setState({loaded:!0})}},{key:"renderInner",value:function(){var e=this;if(this.props.studentPickView){var t=this.state,a=t.students,r=t.loaded;return u.a.createElement(d.a,{id:"studentPicker",isLoading:!r,options:a.sort((function(e,t){return e.name.localeCompare(t.name)})).map((function(e){return{label:e.name,value:e.login_id}})),placeholder:"Choose a student",onChange:function(t){return e.props.setStudent(t?a.find((function(e){return e.login_id===t.value})):null)},isClearable:!0,styles:{control:function(e,t){return Object(n.a)(Object(n.a)({},e),{},{backgroundColor:"transparent",color:"white",border:"1px solid white"})},singleValue:function(e,t){return Object(n.a)(Object(n.a)({},e),{},{color:"white"})}}})}return u.a.createElement("div",{id:"inner"},u.a.createElement("h2",null,this.props.course?this.props.course.course_name:"Loading course..."))}},{key:"render",value:function(){return u.a.createElement(u.a.Fragment,null,u.a.createElement("div",{id:"adminHeader"},this.props.studentPickView?u.a.createElement(p.b,{to:"/admin",style:{float:"right"}},u.a.createElement("h3",null,"Admin Panel")):u.a.createElement("div",{style:{float:"right",padding:20}},u.a.createElement(s.a,{title:"Reload data"},u.a.createElement(m.a,{id:"reload",shape:"circle",style:{backgroundColor:"rgba(255, 255, 255, 0.5)",color:"white"},icon:u.a.createElement(h.a,null)}))),u.a.createElement("div",{id:"navbarContent"},u.a.createElement("div",{id:"brand"},u.a.createElement(p.b,{to:"/"},u.a.createElement("h1",null,"IGuideME"))),this.renderInner())),Object(E.a)()&&u.a.createElement("div",{id:"debugNotice"},"Application is running in ",u.a.createElement("strong",null,"demo")," mode. Changes will not be saved!"))}}]),a}(o.Component);t.a=v(g)},192:function(e,t,a){},195:function(e,t,a){},196:function(e,t,a){},197:function(e,t,a){"use strict";var n=a(4),r=a(5),l=a(8),i=a(9),c=a(0),o=a.n(c),u=a(73),d=a(191),s=a(14),m=a(964),h=a(965),p=a(287),f=a(288),E=a(1014),b=a(289),v=a(290),g=a(1013),y=a(291),k=a(292),O=a(293),j=a(294),w=a(295),z=a(296),C=a(666),x=a(47),P=(a(195),a(46)),A=Object(P.b)((function(e){return{user:e.user}})),I=function(e){Object(l.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){var e=this.props.user;return o.a.createElement("div",{id:"adminMenu"},o.a.createElement("div",{id:"user"},o.a.createElement("h3",null,e?e.name:"Loading profile..."),o.a.createElement("strong",null,o.a.createElement(p.a,null)," Instructor")),o.a.createElement(C.a,{selectedKeys:[this.props.menuKey]},o.a.createElement(C.a.Item,{key:"datamart",icon:o.a.createElement(f.a,null)},o.a.createElement(x.b,{to:"/admin"},"Datamart")),o.a.createElement(C.a.Item,{key:"tiles",icon:o.a.createElement(E.a,null)},o.a.createElement(x.b,{to:"/admin/tiles"},"Tiles")),o.a.createElement(C.a.Item,{key:"dashboard",icon:o.a.createElement(b.a,null)},o.a.createElement(x.b,{to:"/admin/dashboard"},"Dashboard")),o.a.createElement(C.a.Item,{key:"studentOverview",icon:o.a.createElement(v.a,null)},o.a.createElement(x.b,{to:"/admin/student-overview"},"Student Overview")),o.a.createElement(C.a.SubMenu,{key:"submenu",icon:o.a.createElement(g.a,null),title:"Grades"},o.a.createElement(C.a.Item,{key:"gradePredictor",icon:o.a.createElement(y.a,null)},o.a.createElement(x.b,{to:"/admin/grade-predictor"},"Predictor")),o.a.createElement(C.a.Item,{key:"gradeAnalyzer",icon:o.a.createElement(k.a,null)},o.a.createElement(x.b,{to:"/admin/grade-analyzer"},"Analyzer"))),o.a.createElement(C.a.Item,{key:"dataWizard",icon:o.a.createElement(O.a,null)},o.a.createElement(x.b,{to:"/admin/data-wizard"},"Data Wizard")),o.a.createElement(C.a.Item,{key:"analytics",icon:o.a.createElement(j.a,null)},o.a.createElement(x.b,{to:"/admin/analytics"},"Analytics")),o.a.createElement(C.a.Item,{key:"notificationCentre",icon:o.a.createElement(w.a,null)},o.a.createElement(x.b,{to:"/notification-centre"},"Notification Centre")),o.a.createElement(C.a.Item,{key:"settings",icon:o.a.createElement(z.a,null)},o.a.createElement(x.b,{to:"/admin/settings"},"Settings"))))}}]),a}(c.Component),S=A(I),Q=(a(196),function(e){Object(l.a)(a,e);var t=Object(i.a)(a);function a(){return Object(n.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){var e=this.props,t=e.isAdmin,a=e.menuKey;return t?o.a.createElement("div",{id:"admin"},o.a.createElement(d.a,null),o.a.createElement(m.a,null,o.a.createElement(h.a,{xs:4},o.a.createElement(S,{menuKey:a})),o.a.createElement(h.a,{xs:20,id:"wrapper",className:"".concat("settings"!==a&&"noOverflow")},this.props.children))):o.a.createElement(s.a,{to:"/"})}}]),a}(c.Component));t.a=Object(u.a)(Q)}}]);
//# sourceMappingURL=21.1da49b20.chunk.js.map