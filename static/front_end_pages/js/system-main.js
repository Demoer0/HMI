//加载页面初始化
$(function(){
	var XMLcontent = loadXML("../HmiApp_181009.xml");//读取文件
	//获取xml文件中的  <Page name="3.2">下面的第一个元素  系统主页
	var SystemXML = XMLcontent.getElementsByTagName("Page.3.2")[0];
	var SystemNodes = SystemXML.children.length;//获取Page name="3.2"子元素的长度
	var NodesName = new Array(SystemNodes);	//创建新的数据

	/*根据xml的MainPage标签创建系统界面主界面的表格开始*/
	var setTable = document.createElement("table");//创建table元素
	for(var i=0;i<NodesName.length;i++){//遍历xml中的子元素
		NodesName[i]=SystemXML.children[i].getAttribute("name");//获取name
		var setTr = document.createElement("tr");
		var setTd1 = document.createElement("td");
		var setTd2 = document.createElement("td");
//		var setDiv = document.createElement("div");
		var setImg = document.createElement("img");
		setImg.src = "../img/green.png";
		var pageTo;
		setTd1.textContent = NodesName[i];
		setTd1.className = "system-option";
		setImg.className = "status";
		setTd2.appendChild(setImg);//插入数据
		setTr.appendChild(setTd1);
		setTr.appendChild(setTd2);
		setTable.appendChild(setTr);
//		pageTo = SystemXML.children[i].children.length?SystemXML.children[i].children[0].getAttribute("pageurl"):SystemXML.children[i].getAttribute("pageurl");
		pageTo = SystemXML.children[i].tagName;
		setTd1.setAttribute("pageTo",pageTo);
		
	}
	document.getElementById("Page-index").appendChild(setTable);
		
	/*根据xml的MainPage标签创建系统界面主界面的表格结束*/
	
	/*系统子界面点击事件开始*/
	$(".system-option").click(function(){
		parent.document.getElementById("window").setAttribute("src","system/system-content.html")
		parent.document.getElementById("window").setAttribute("pageurl",$(this).attr("pageto"));
	})
	/*系统子界面点击事件结束*/
})