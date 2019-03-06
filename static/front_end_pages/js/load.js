function loadXML(xmlFile){
	var xmlDoc;
	try{ //IE
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	}catch(e){ //firefox,opera
		xmlDoc = document.implementation.createDocument("","",null);
	}
	try{
		xmlDoc.asyc = false; //是否异步调用
		xmlDoc.load(xmlFile); //文件路径
	}catch(e){ //chrome
	var xmlhttp = new window.XMLHttpRequest();
	xmlhttp.open("GET",xmlFile,false); //创建一个新的http请求，并指定此请求的方法、URL以及验证信息
	xmlhttp.send(null);
	xmlDoc = xmlhttp.responseXML;
	}
	return xmlDoc.documentElement;
}
function loadCSV(csvFile){
	$.ajaxSettings.async = false;
	var csvContent;
	$.get(csvFile,function(data){
		    csvContent = data;
		},dataType='html')
		return csvContent;
}

