var xmlContent;
$(function(){
	//加载xml文件
	xmlContent = loadXML("../HmiApp_181009.xml");
	var pageUrl = parent.document.getElementById("window").getAttribute("pageurl");
	var pageNode = xmlContent.getElementsByTagName(pageUrl)[0];
	/*生成界面顶部按钮  */
	//遍历pageNode下的所有子元素
	for(var i=0;i<pageNode.children.length;i++){
		var setLabel =document.createElement("label");
		setLabel.textContent = pageNode.children[i].getAttribute("name");
		//给对应的label添加相应的pageurl属性
		setLabel.setAttribute("pageurl",pageNode.children[i].getAttribute("pageurl"));
		document.getElementById("reportForms-btn-content").appendChild(setLabel);
		//给报表的内容区域添加contentUrl的属性
		document.getElementById("reportForms-content").setAttribute("contentUrl",pageNode.children[0].getAttribute("pageurl"));
	}
	/*设置顶部按钮点击事件*/
	$("#reportForms-btn-content label").click(function(){
		$("#reportForms-btn-content label").css("background","#005D98");
		$(this).css("background","#004B74");
		/*设置content区域的地址,有xml下MainPage下的pageurl 3.6.1决定*/
		$("#reportForms-content").attr("contenturl",$(this).attr("pageurl"));
		createReportFormsContent($("#reportForms-content").attr("contentUrl"),xmlContent);
	});
	createReportFormsContent($("#reportForms-content").attr("contentUrl"),xmlContent);
	
	/*数据清零*/
	$("#resetData").click(function(){
		$("#alert-div").css('display','block');
		$("#reportForms-mask").css('display','block');
	});
	/*确认按钮*/
	$("#clear-confirm").click(function(){
		/*这里写逻辑*/
		
		$("#alert-div").css('display','none');
		$("#reportForms-mask").css('display','none');
	});
	
	$("#clear-cancel,#reportForms-mask").click(function(){
		$("#alert-div").css('display','none');
		$("#reportForms-mask").css('display','none');
	})
});

/*创建表格内容*/
function createReportFormsContent(pageurl,xmlContent){
	$("#rep-content-table").empty();
	var urlName = pageurl.slice(5);
	var contentPageNodes = xmlContent.getElementsByTagName("Page");
	/*CurrentNode保存当前pageurl对应xml中的节点*/
	var CurrentNode;
	/*找到page节点下对应的那个节点*/
	for(var i=0;i<contentPageNodes.length;i++){
		if(contentPageNodes[i].getAttribute("name")==urlName){
			CurrentNode = contentPageNodes[i];
			break;
		}
	}
	
	var CurrentTableNode = CurrentNode.getElementsByTagName("Table").length?CurrentNode.getElementsByTagName("Table")[0]:CurrentNode.getElementsByTagName("Log")[0];
	var isTable = CurrentNode.getElementsByTagName("Table").length?true:false;
	/*是否显示数据清零按钮*/
	if(isTable){
		$("#resetData").css("display","block")
	}else{
		$("#resetData").css("display","none");
		console.log($("#resetData").html());
	}
	var rowLengh = CurrentTableNode.getElementsByTagName("Row").length;
	for(var i=0;i<rowLengh;i++){
		var setTr = document.createElement("tr");
		var Cols = CurrentTableNode.getElementsByTagName("Row")[i].getElementsByTagName("Col");
		for(var j=0;j<Cols.length;j++){
			var setTd = document.createElement("td");
			var tdContent="";
			var tdWidth = Cols[j].getAttribute("width");
			var tdAlign = Cols[j].hasAttribute("align")?Cols[j].getAttribute("align"):"";
			var Tag = Cols[j].children[0];
			if(Tag.hasAttribute("name")){
				tdContent = Tag.getAttribute("name")
			}else if(Tag.hasAttribute("datamapping")){
				setTd.setAttribute("datamapping",Tag.getAttribute("datamapping"));
				setTd.setAttribute("id",Tag.getAttribute("datamapping"));
			}
			setTd.textContent = tdContent;
			setTd.style.textAlign = tdAlign;
			/*width设置为xml中指定宽度*/
			setTd.style.width = tdWidth;
			setTr.appendChild(setTd);
		}
		document.getElementById("rep-content-table").appendChild(setTr);
	}

	$(document).ready(function () {
		var msg = {"command": 11};
		var points_name = new Array();
		var datas = $("[datamapping]");
		// console.log(datas);
		for (var i = 0; i < datas.length; i++){
			points_name.push(datas[i].getAttribute("datamapping"));
		}
		msg["points_name"] = points_name;
		// console.log(points_name);
		// console.log('pp',msg);
		$.ajax({
			type: "POST",
			url: "http://" + location.host + "/report",
			data: msg,
			dataType: 'json',
			success:function (result) {
				console.log(result);
				if(result != undefined){
					for (var i in result.data) {
						if (result.data.hasOwnProperty(i) && typeof result.data[i] != "function") {             				
						 	// console.log("对象属性: ", i);  
						 	document.getElementById(i).innerText = result.data[i];    				
					 	}
				 	}
				}
		            }
		});
	});
}
