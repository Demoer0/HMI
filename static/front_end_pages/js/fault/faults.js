$(function(){
	var xmlContent = loadXML("../HmiApp_170814.xml");
	var pageUrl = parent.document.getElementById("window").getAttribute("pageurl");
	var pageNode = xmlContent.getElementsByTagName(pageUrl)[0];
	/*生成界面顶部按钮*/
	for(var i=0;i<pageNode.children.length;i++){
		var setLabel = document.createElement("label");
		setLabel.textContent = pageNode.children[i].getAttribute("name")
		setLabel.setAttribute("pageurl",pageNode.children[i].getAttribute("pageurl"));
		document.getElementById("faults-btn-group").appendChild(setLabel);
		document.getElementById("fault-content").setAttribute("contentUrl",pageNode.children[0].getAttribute("pageurl"));
	}
	/*设置顶部按钮点击事件*/
	$("#faults-btn-group label").click(function(){
		$("#faults-btn-group label").css("background","#FFFFFF");
		$(this).css("background","#9DC3E6");
		/*设置content区域的地址,有xml下MainPage下的pageurl决定*/
		$("#fault-content").attr("contenturl",$(this).attr("pageurl"));
		createFaultsContent($("#fault-content").attr("contentUrl"),xmlContent);
	})
	createFaultsContent($("#fault-content").attr("contentUrl"),xmlContent);
})

function createFaultsContent(pageurl,xmlContent){
	$("#faults-content-table").empty();
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
	var TableLen = CurrentNode.getElementsByTagName("Table").length?CurrentNode.getElementsByTagName("Table").length:CurrentNode.getElementsByTagName("Log").length;
//	console.log(TableLen)
	for(var k=0;k<TableLen;k++){
		var CurrentTableNode = CurrentNode.getElementsByTagName("Table").length?CurrentNode.getElementsByTagName("Table")[k]:CurrentNode.getElementsByTagName("Log")[k];
//		console.log(j)
		var rowLengh = CurrentTableNode.getElementsByTagName("Row").length;
		for(var i=0;i<rowLengh;i++){
			var setTr = document.createElement("tr");
			var Cols = CurrentTableNode.getElementsByTagName("Row")[i].getElementsByTagName("Col");
			for(var j=0;j<Cols.length;j++){
				var setTd = document.createElement("td");
				var tdContent="";
				var tdWidth = Cols[j].getAttribute("width");
				var tdAlign = Cols[j].hasAttribute("align")?Cols[j].getAttribute("align"):"";
				var Tag = Cols[j].children.length?Cols[j].children[0]:null;
				if(Tag!=null&&Tag.hasAttribute("name")){
					tdContent = Tag.getAttribute("name")
				}else{
					
				}
				setTd.textContent = tdContent;
				setTd.style.textAlign = tdAlign;
				/*width设置为xml中指定宽度*/
				setTd.style.width = tdWidth;
				setTr.appendChild(setTd);
			}
			document.getElementById("faults-content-table").appendChild(setTr);
		}
	}
	
}
