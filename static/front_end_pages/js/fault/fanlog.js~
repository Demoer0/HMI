(function(){
	$.ajax({
		type:"get",
		url:"http://"+location.host+"/fanLogHandler?command=51",
		success: function(result){
        	var content = JSON.stringify(result);
//       	console.log(content);
//      	console.log(result.data[1].name);
//      	currentFaultTable(result.data)
        	createFanLogList(result.data.machine_log);
        },
        error: function(result){
			alert("返回数据失败");
        }
	});
})()

function createFanLogList(data){
	var table = document.getElementById("fanLog-content-table");
        var csvContent  = loadCSV("../runstate.csv");
	var strs = csvContent.split(/[\n]/);
         var num=0;
	for(var i = 0 ;i<data.length;i++){
		var tr = document.createElement("tr");
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		td1.textContent = i+1;
		td2.textContent = strs[data[i][0]];
		td3.textContent = data[i][1];
                num++;
		table.appendChild(tr)
		
	}
/*判定是否需要滚动按钮*/
$(document).ready(function () {
    var contentHeight = document.getElementById("fanLog-content").clientHeight;
    var tableHeight = 50*num;
    console.log(contentHeight);
    console.log(tableHeight);
    if(contentHeight>tableHeight){
        $("#scroll-btns").css("display","none");
    }else{
        $("#scroll-btns").css("display","block");
    }
    $("#drop-down").click(function(){
		var t = $("#fanLog-content").scrollTop();
                console.log(t);
		/*禁止连续点击*/
		if($("#fanLog-content").is(':animated')){
			console.log("animated")
		}else{
			$("#fanLog-content").animate({'scrollTop':t+100},400);
		}
	})
	$("#pull-up").click(function(){
		var t = $("#fanLog-content").scrollTop();
                console.log(t);
		if($("#fanLog-content").is(':animated')){
			console.log("animated")
		}else{
			$("#fanLog-content").animate({'scrollTop':t-100},400);
		}		
	})
})
}
