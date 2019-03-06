/*读取xml文件*/
var xmlContent = loadXML("../HmiApp_181009.xml");
/*定时器*/
var timer;
/*pointList*/
var  pointList = [];
var cur = 0;
msg = {'command': '11'};
/*websocket*/
var ws = new WebSocket("ws://" + location.host + "/test2");
//console.log("state:"+ws.readyState)
$(function(){
	//得到父页面中的windowde 的pageurl属性值
	var pageUrl = parent.document.getElementById("window").getAttribute("pageurl");
	/*MainPage下的相应节点*/
	var pageNode = xmlContent.getElementsByTagName(pageUrl)[0];
	var headerName = pageNode.getAttribute("name");
	/*设置一级导航的名称*/
	$("#headerName").html("系统>"+headerName);
	/*system-content属性值指向xml相应节点*/
	// 如果当前节点的下面没有子元素 给system-content创建contentUrl属性以及属性值
	if(pageNode.children.length==0){
		document.getElementById("system-content").setAttribute("contentUrl",pageNode.getAttribute("pageurl"))
	}
	// 如果当前节点的下面有子元素   遍历输出二级导航   设置二级导航的顶部按钮，创建label  和对应的contentUrl属性值
	for(var i=0;i<pageNode.children.length;i++){
		var setLabel = document.createElement("label");//创建label
		setLabel.textContent = pageNode.children[i].getAttribute("name");//获取label名称
		setLabel.className = "system-btns";//给label属性
		//给每一个label创建pageurl属性以及属性值
		setLabel.setAttribute("pageurl",pageNode.children[i].getAttribute("pageurl"));
		document.getElementById("system-btn-content").appendChild(setLabel);//将label创建到相应的位置
		//给system-content创建contentUrl属性以及属性值
		document.getElementById("system-content").setAttribute("contentUrl",pageNode.children[0].getAttribute("pageurl"));
	}
	/*判断按钮是否需要下拉按钮*/
	var btnsHeight = document.getElementById("system-btn-content").offsetHeight;
	if(btnsHeight){
		var singleHeight = document.getElementsByClassName("system-btns")[0].offsetHeight;
		$("#system-btn-group").css({
			"height":singleHeight+1
		});
		// alert(singleHeight);
		// alert(btnsHeight);
		if(btnsHeight-singleHeight>20){
			var dropbtn = document.createElement('span');
			dropbtn.id = 'drop-btn';
			var img = document.createElement('img');
			img.src = "../img/scrollBottom1.png";
			img.style.height = '0.031rem';
			img.style.padding = '0 0.013rem';
			img.style.marginTop = '0.002rem';
			dropbtn.appendChild(img);
			document.getElementById('system-btn-content').insertBefore(dropbtn,document.getElementById('system-btn-content').children[0]);
			$("#drop-btn").css({
				"border": "1px solid #41719C",
			    "float": "right",
			    "border-radius": "0.006rem",
			    "background": "#BCD68D",
			    "margin-left": "2px"
			});

			$("#system-btn-group").css("height",singleHeight+1);
			$("#drop-btn").click(function(){
				var divHeight = document.getElementById("system-btn-group").offsetHeight;
				if(divHeight<btnsHeight){
					$("#system-btn-group").css({
						"height":btnsHeight+1
					});
					$("#drop-btn img").attr("src","../img/scrollTop1.png");
				}else{
					$("#system-btn-group").css({
						"height":singleHeight+1
					});
					$("#drop-btn img").attr("src","../img/scrollBottom1.png");
				}
			});

			/*设置按钮的点击事件*/
			$("#system-btn-content label").click(function(){
				//$(this).insertBefore($("#system-btn-content").children().get(1));
                $("#system-btn-content label").css("background","#005D98");
                $(this).css("background","#004B74");
				$("#system-btn-group").css({
							"height":singleHeight+1
				});
				$("#drop-btn img").attr("src","../img/scrollBottom1.png");
				/*设置content区域的地址*/
				$("#system-content").attr("contentUrl",$(this).attr("pageurl"));
				createTableContent($("#system-content").attr("contentUrl"),xmlContent);
			});
		} else{
			/*设置按钮点击事件*/
			$("#system-btn-content label").click(function(){
				$("#system-btn-content label").css("background","#005D98");
				$(this).css("background","#004B74");
				/*设置content区域的地址*/
				$("#system-content").attr("contentUrl",$(this).attr("pageurl"));
				createTableContent($("#system-content").attr("contentUrl"),xmlContent);
			});
		}
	}

	/*设置content区域内容*/
	createTableContent($("#system-content").attr("contentUrl"),xmlContent);

	$("#system-mask,#debug-cancel,#debug-confirm").click(function(){
		$("#debug-modify").css("display","none");
		$("#system-mask").css("display","none");
	});
});

function createTableContent(pageurl,xmlContent){
	/*更换一个页面时，刷新pointList内的内容并发送给后台*/
	pointList.splice(0, pointList.length);
	$("#system-content").empty();
	clearInterval(timer);
	var urlName = pageurl.slice(5);
	var contentPageNodes = xmlContent.getElementsByTagName("Page");

	/*CurrentNode保存当前pageurl对应xml中的节点*/
	var CurrentNode;
	for(var i=0;i<contentPageNodes.length;i++){
		if(contentPageNodes[i].getAttribute("name")==urlName){
			CurrentNode = contentPageNodes[i];
			break;
		}
	}
	/*tableLength为当前节点下table的个数*/
	var CurrentNode_Tables = CurrentNode.getElementsByTagName("Table");
	var tableLength =CurrentNode_Tables.length;
	for(var i=0;i<tableLength;i++){
		var setTable = document.createElement("table");
		setTable.className = "content-table";
		var RowLength = CurrentNode_Tables[i].getElementsByTagName("Row").length;
		for(var j=0;j<RowLength;j++){
			var setTr = document.createElement("tr");
			/*table中的列*/
			var Cols = CurrentNode_Tables[i].getElementsByTagName("Row")[j].getElementsByTagName("Col");

			for(var k=0;k<Cols.length;k++){
				var setTd = document.createElement("td");
				var tdWidth = Cols[k].getAttribute("width");
				var tdAlign = Cols[k].hasAttribute("align")?Cols[k].getAttribute("align"):"";
				var tdRowspan = Cols[k].hasAttribute("rowspan")?Cols[k].getAttribute("rowspan"):"";
				if(Cols[k].children.length){
					/*TagName保存col中子标签的类型（只有Object,Yaw,Module,Button,,Iconfault五种）*/
					var Tag = Cols[k].children[0];
					var tdId;
					/*设置节点datamapping值*/
					if(Tag.getAttribute("datamapping")){
						tdId = Tag.getAttribute("datamapping");
						setTd.setAttribute("datamapping",tdId);
						setTd.setAttribute("datapoint",true);
					}
					setTd.setAttribute("moduletype",Tag.tagName);
					/*根据不同的节点创建不同的元素*/
					switch(Tag.tagName){
						case 'Object':
						{
							if(Tag.getAttribute("datamapping")){
								pointList.push(Tag.getAttribute("datamapping"));
							}
							/*读xml取得名字*/
							if(Tag.hasAttribute("name")){
								var tdContent = Tag.getAttribute("name");
								setTd.textContent = tdContent;
								if(Tag.hasAttribute("datamapping")){
									console.log("和xml描述不符");
								}
							}else if(Tag.hasAttribute("type")){
								var type = Tag.getAttribute('type');
								if(type == "1"){
									var typedef = Tag.getAttribute("typedef");
									setTd.setAttribute("typedef",typedef);
									setTd.setAttribute("type","1");
								}else if(type == "2"){
									setTd.setAttribute("type","2");
									var min = Tag.getAttribute("min");
									var max = Tag.getAttribute("max");
									setTd.setAttribute("min",min);
									setTd.setAttribute("max",max);
									setTd.className = 'debug-data';
								}
							}else{
								/*从后台读取数据*/
								setTd.className = 'data';
								setTd.setAttribute("unit",Tag.hasAttribute("unit")?Tag.getAttribute("unit"):"");
							}
						}

						break;
						case 'Module':
							{
								// var min, faultmin, alarmmin, alarmmax,faultmax, max;
								min = Tag.getAttribute("min");
								max = Tag.getAttribute("max");
								faultmin = Tag.getAttribute("faultmin");
								faultmax = Tag.getAttribute("faultmax");
								alarmmin = Tag.hasAttribute("alarmmin")?Tag.getAttribute("alarmmin"):null;
								alarmmax = Tag.hasAttribute("alarmmax")?Tag.getAttribute("alarmmax"):null;
								setTd.setAttribute("min",min);
								setTd.setAttribute("faultmin",faultmin);
								if(alarmmin!=null||alarmmax!=null){
									setTd.setAttribute("alarmmin",alarmmin);
									setTd.setAttribute("alarmmax",alarmmax);
								}
								setTd.setAttribute("faultmax",faultmax);
								setTd.setAttribute("max",max);
								setModule(setTd,faultmin,faultmax,alarmmin,alarmmax,min,max);
							}
						break;
						case 'Yaw':
							{
								/*风向、机舱位置、偏航方向*/
								var datamapping1,datamapping2,datamapping3;
								datamapping1 = Tag.getAttribute("datamapping1");
								datamapping2 = Tag.getAttribute("datamapping2");
								datamapping3 = Tag.getAttribute("datamapping3");
								setTd.setAttribute("datamapping1",datamapping1);
								setTd.setAttribute("datamapping2",datamapping2);
								setTd.setAttribute("datamapping3",datamapping3);
								var str = "<div id='cabin-module'>"+
											"<p>"+
												"<img src='../img/yaw/yaw_bg.png'/>"+
												"<img src='../img/yaw/yaw_fan.png' />"+
												"<img src='../img/yaw/yaw_clockwise.png'/>"+
												"<img src='../img/yaw/yaw_windDirection.png' />"+
											"</p>"+
										 "</div>";
								setTd.innerHTML = str;
							}
						break;
						/*此处只有两种button*/
						case 'Button':
							{
								var buttonContent = document.createElement('span');
								if(Tag.hasAttribute("name")){
									buttonContent.textContent = Tag.getAttribute("name");
								}else if(Tag.hasAttribute("type")){
									setTd.setAttribute("type",Tag.getAttribute("type"));
								}

								if(Tag.hasAttribute("typedef")){
									// pointList.push(Tag.getAttribute("datamapping"));
									// buttonContent.textContent = '启动';
									var typedef = Tag.getAttribute("typedef");
									setTd.setAttribute("typedef",typedef);
									if(typedef=="ButtonDoType"){
										/*需要读取datamapping的值*/
										// buttonContent.className = "ButtonDoType";
										buttonContent.setAttribute("ButtonDoType",1);
										buttonContent.textContent = "启动"
									}else if(typedef=="ButtonFaultType"){
										buttonContent.textContent = "屏蔽"
									}
								}
								buttonContent.className = "forDebug";
								setTd.appendChild(buttonContent);
							}
						break;
						case 'Iconfault':
						{
							if(Tag.getAttribute("datamapping")){
								pointList.push(Tag.getAttribute("datamapping"))
							}
							// setTd.setAttribute("type",Tag.tagName);
							tdContent = document.createElement('img');
							tdContent.src = "../img/circleGreen.png";
							tdContent.id = Tag.getAttribute("datamapping");
							tdContent.style.width = '0.04rem';
							tdContent.style.verticalAlign = 'middle';
							setTd.appendChild(tdContent);
						}
						break;
						default:
						break;
					}
				}

				setTd.style.textAlign = tdAlign;
				setTd.style.width = tdWidth;
				setTd.setAttribute("rowspan",tdRowspan);
				setTr.appendChild(setTd);
			}
		setTable.appendChild(setTr);
		}
	document.getElementById("system-content").appendChild(setTable);
	}

	/*判定是否需要滚动按钮*/
	var contentHeight = document.getElementById("table-content").clientHeight;
	var tableHeight = document.getElementById("system-content").scrollHeight;
	if(contentHeight>tableHeight){
		$("#scroll-btns").css("display","none");
	}else{
		$("#scroll-btns").css("display","block");
	}
	scrollBtnClick();

	/*是否为调试状态*/
	if($("#btn-debug",window.top.document).attr('isDebug')=="false"){
		$(".forDebug").css('display','none');
	}else{
		$(".forDebug").css('display','block');
		$(".debug-data").css('background','#747474');
	}


	/*调试操作*/
	$(".forDebug").click(function(){
	    var tdNode = $(this).parent();
	    // console.log(tdNode.attr("datamapping"));
		if($(this).attr("buttondotype")!=undefined){
		    /*待添加向后台发送数据的接口*/
			var state = $(this).attr("buttondotype");
			console.log("the state is: ", state);
			var content = state==1?"停止":"启动";
			$(this).html(content);
			var bgcolor = state==1?"#FE3B3C":"#00B0F0";
			$(this).css("background",bgcolor);

			/*封装数据*/
            var data = {
                command: 21,
                point_name: tdNode.attr("datamapping"),
                point_value: state
            };
            jQuery.ajax({
                type: 'POST',
                url: "http://" + location.host + "/staticData",
                data: data,
                dataType: 'json',
                success: function (result) {
                    var res = JSON.stringify(result);
                    console.log(res);
                    },
                error: function () {
                    alert("返回数据失败");
                }
            });

			$(this).attr("buttondotype",state==1?0:1)
		}
	});

	/*调试*/
	$(".debug-data").click(function(){
		if($("#btn-debug",window.top.document).attr('isDebug')=="true"){
			$("#debug-modify").css("display","block");
			$("#system-mask").css("display","block");
		}else{

		}
	});

	/*内容待添加*/
	$("#debug-modify-comfirm").click(function(){

	});

	/*构造websocket通信时需要发送给后台的数据*/
	// console.log(pointList);
	// var xmlNode = xmlContent.getElementsByTagName("Page." + urlName);
	// var labelName = xmlNode[0].getAttribute("name");
	msg['sessionId'] = pageurl;
	msg['points_name'] = pointList;
	// ws.send(JSON.stringify(msg));
	// console.log(msg);

	// 延时发送
	setTimeout("sendMessage(ws, msg)", 200);
}

function sendMessage(ws, msg) {
	ws.send(JSON.stringify(msg));
	console.log(msg);
}

/*页面加载完成后进行websocket通信*/
$(document).ready(function () {
	/*数据交互*/
	// var data = $("[datamapping]");
	// var pointList = [];
	// for(var i = 0;i<data.length;i++){
	// 	pointList.push(data[i].getAttribute('datamapping'));
	// }
	// console.log(pointList);

	// msg = {'command': '11'};
	// msg["data"]=pointList;

	// var ws = new WebSocket("ws://" + location.host + "/test2");
	// ws.onopen = function(event){
	// 	ws.send(JSON.stringify(msg));
	// };

	// console.log("readyState:"+ws.readyState)
	// if(ws.readyState == 1){
	// 	ws.send(pointList);
	// }


	/*处理从后台传来的消息*/
	ws.onmessage = function(e){
		var realtimedata = eval('('+e.data+')');
		showContent = realtimedata.data;
		// console.log(showContent);
		dataExchange(showContent, pointList);
	};
	ws.onerror = function(evt){
		console.log("发生错误");
		console.log(evt);
	};

	ws.onclose = function(){
		console.log("断开连接");
		ws.close();
	};
});

function scrollBtnClick(){
	$("#drop-down").click(function(){
		var t = $("#table-content").scrollTop();
		/*禁止连续点击*/
		if($("#table-content").is(':animated')){
			console.log("不能连续点击")
		}else{
			$("#table-content").animate({'scrollTop':t+300},300)
		}
	});
	$("#pull-up").click(function(){
		var t = $("#table-content").scrollTop();
		if($("#table-content").is(':animated')){
			console.log("animated")
		}else{
			$("#table-content").animate({'scrollTop':t-300},300);
		}
	})
}

//添加一个传递当前温度值的函数
function transCur(temData) {
	cur = temData;
}

function setModule(setTd,faultmin,faultmax,alarmmin,alarmmax,min,max){
	/*百分比*/
	// var cur = (parseFloat(faultmax)-parseFloat(faultmin))*Math.random()+parseFloat(faultmin);
	var cur_precent = (cur-parseFloat(min))/(parseFloat(max) - parseFloat(min))*100;
	var faultmin_precent = ((parseFloat(faultmin)-parseFloat(min))/(parseFloat(max) - parseFloat(min)))*100;
	var alarmmin_precent = alarmmin==null?'':((parseFloat(alarmmin)-parseFloat(min))/(parseFloat(max) - parseFloat(min)))*100;
	var alarmmax_precent = alarmmax==null?'':((parseFloat(alarmmax)-parseFloat(min))/(parseFloat(max) - parseFloat(min)))*100;
	var faultmax_precent = ((parseFloat(faultmax)-parseFloat(min))/(parseFloat(max) - parseFloat(min)))*100;
	var alarmmin_display = alarmmin==null?'none':'block';
	var alarmmax_display =alarmmax==null? 'none':'block';

	var state = "";
	if(cur_precent>faultmax_precent||cur_precent<faultmin_precent){
		state = "red"
	}else if(alarmmin!=null&&alarmmax!=null){
		if(cur_precent>alarmmax_precent||cur_precent<alarmmin_precent){
			state = "orange"
		}else{
			state = "green"
		}
	}else{
		state = "green"
	}
	var str = "<div>"+
					"<div id='pro-bar' class='module' min='' max=''>"+
						"<div id='val-bar' class='"+state+"' style='width:"+cur_precent+"%"+"'></div>"+
						"<div class='scale faultmin' style='left:"+faultmin_precent+'%'+"'></div>"+
						"<div class='scale alarmmin' style='left:"+alarmmin_precent+'%'+";display:"+alarmmin_display+"'></div>"+
						"<div class='scale alarmmax' style='left:"+alarmmax_precent+'%'+";display:"+alarmmax_display+"'></div>"+
						"<div class='scale faultmax' style='left:"+faultmax_precent+'%'+"'></div>"+
					"</div>"+
					"<div id='val-content' style='display:height: 0.015rem;;text-align: left;width: 90%; margin: 0 auto;position: relative;'>"+
						"<span class='val min-val' style='left:"+(-4)+'%'+"'>"+min+"</span>"+
						"<span class='val faultmin-val' style='left:"+(faultmin_precent-4)+'%'+"'>"+faultmin+"</span>"+
						"<span class='val alarmmin-val' style='left:"+alarmmin_precent+'%'+";display:"+alarmmin_display+"'>"+alarmmin+"</span>"+
						"<span class='val alarmmax-val' style='left:"+(alarmmax_precent-4)+'%'+";display:"+alarmmax_display+"'>"+alarmmax+"</span>"+
						"<span class='val faultmax-val' style='left:"+faultmax_precent+'%'+"'>"+faultmax+"</span>"+
						"<span class='val max-val' style='left:"+(98)+'%'+"'>"+max+"</span>"+
					"</div>"+
				"</div>";
	setTd.innerHTML = str;
	$("#val-content").css("display",'none')
}

// function dataIeraction1(){
// 	/*数据交互*/
// 	var data = $("[datamapping]");
// 	var pointList = [];
// 	for(var i = 0;i<data.length;i++){
// 		pointList.push(data[i].getAttribute('datamapping'));
// 	}
// 	console.log(pointList.toString());
// 	var datas = $("[datamapping="+pointList[0]+"]");
// //		console.log(data.attr("moduletype"))
// //	console.log(1)
// 	ws.onopen = function(event){
// 		ws.send(pointList);
// 	};
// 	// console.log("readyState:"+ws.readyState)
// 	// if(ws.readyState == 1){
// 	// 	ws.send(pointList);
// 	// }
// 	ws.onmessage = function(e){
// 		var realtimedata = eval('('+e.data+')');
// //		console.log(data.data["DI1-1机舱控制柜急停"]);
// 		dataExchange(realtimedata.data, pointList);
// 	};
// 	ws.onerror = function(evt){
// 		console.log("发生错误")
// 	};
// 	ws.onclose = function(){
// 		console.log("断开连接")
// 		ws.close();
// 	};
// 	console.log(ws)
// }


/*
 * 解析数据用于显示
 * */
function dataExchange(data,pointList){
	var list = pointList;
	for(var i = 0;i<list.length;i++){
		var dataPoint = $("[datamapping=\""+list[i]+"\"]");
		// console.log(dataPoint.length);
		/*还要考虑高低电平触发问题*/
		if(dataPoint.attr("moduletype")=="Iconfault"){
			if(data[list[i]]==true){
				dataPoint.find("img").attr("src","../img/circleRed.png");
			}else{
				dataPoint.find("img").attr("src","../img/circleGreen.png");
			}
		}else if(dataPoint.attr("moduletype")=="Object"){
			dataPoint.each(function(){
				if($(this).attr("moduletype")=="Object"){
					if(data[list[i]]==true){
                        $(this).text(1);
					}
					else if(data[list[i]]==false){
                        $(this).text(0);
					}
					else{
                        $(this).text(data[list[i]]);
					}
				}
			})
		}else if (dataPoint.attr("moduletype")=="Button"){
			var button = $(".forDebug");
			console.log(button);
			if(button.attr('buttondotype') != undefined){
				var state = button.attr('buttondotype');
				if (data[list[i]] == true){
					state = 1;
				}else{
					state = 0;
				}
				console.log("asdfaweijf");
				var content = state==1?"停止":"启动";
				$(this).html(content);
				var bgcolor = state==1?"#FE3B3C":"#00B0F0";
				$(this).css("background",bgcolor);
				$(this).attr("buttondotype",state==1?0:1)
			}else{
				console.log(data[list[i]]);
			}
			console.log(data[list[i]]);
        }else if(dataPoint.attr("moduletype")=="Moudle"){
		    console.log(data[list[i]]);
		    var currentTem = data[list[i]];
		    transCur(currentTem);
		}else if(dataPoint.attr("moduletype")=="Yaw"){
		    console.log(data[list[i]]);
		}
	}
}

// function dataIeraction(){
// //	console.log(2)
// 	var data = $("[datamapping]");
// //	data[3].attr("a",1);
// //	console.log(data[3].attr("a"))
// 		data.each(function(){
// //			console.log(1)
// 			var temp;
// 			if($(this).attr("moduletype")=="Iconfault"){
// 				temp =  Math.round(Math.random());
// 				console.log("temp:"+temp)
// 				if(temp == 0){
// 					$(this).find("img").attr("src","../img/circleRed.png");
// 				}else{
// 					$(this).find("img").attr("src","../img/circleGreen.png");
// 				}
// 			}else if($(this).attr("moduletype")=="Object"){
// 				temp = Math.round(100*Math.random())
// 				if($(this).attr("unit")){
// 					var unit = $(this).attr("unit")
// 				}else{
// 					unit = ""
// 				}

// 				$(this).text(temp+unit)
// 			}
// 		})
// 	if(data.attr("moduletype")=="Iconfault"){
// 		data.each(function)
// 		data.find("img").attr("src","../img/circleRed.png");
// 	}else if(data.attr("moduletype")=="Object"){
// 		data.text("30")
// 	}else{
// //		console.log(1)
// 	}

// }
