$(function(){
	$.ajax({
		type:"get",
		url:"http://"+location.host+"/userLogHandler",
		success: function(result){
        //	var content = JSON.stringify(result);
        	console.log(result);
//      	console.log(result.data[1].name);
//      	currentFaultTable(result.data)
        	createUserLogList(result);
        },
        error: function(result){
			alert("返回数据失败");
        }
	});
});

function createUserLogList(result){
	var table = document.getElementById("userlog-content-table");
        var num=0;
	for(var key in result.data){
		var tr = document.createElement("tr");
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');
		//console.log(result.data);
		tr.appendChild(td1);
		tr.appendChild(td2);
                tr.appendChild(td3)
                td1.className="height";
		td1.textContent =key;
		td2.textContent = result.data[key][0];
                if(result.data[key][1]=="scan"){
		td3.textContent = "浏览";
                }
                else{
                td3.textContent = "修改参数";
}
		table.appendChild(tr);
                num++;
		
	}
/*判定是否需要滚动按钮*/
$(document).ready(function () {
    var contentHeight = document.getElementById("userlog-content").clientHeight;
    var tableHeight = 50*num;
    console.log(contentHeight);
    console.log(tableHeight);
    if(contentHeight>tableHeight){
        $("#scroll-btns").css("display","none");
    }else{
        $("#scroll-btns").css("display","block");
    }
    $("#drop-down").click(function(){
		var t = $("#userlog-content").scrollTop();
                console.log(t);
		/*禁止连续点击*/
		if($("#userlog-content").is(':animated')){
			console.log("animated")
		}else{
			$("#userlog-content").animate({'scrollTop':t+100},400);
		}
	})
	$("#pull-up").click(function(){
		var t = $("#userlog-content").scrollTop();
                console.log(t);
		if($("#userlog-content").is(':animated')){
			console.log("animated")
		}else{
			$("#userlog-content").animate({'scrollTop':t-100},400);
		}		
	})
})
}
/*判定是否需要滚动按钮*/
$(document).ready(function () {
    var contentHeight = document.getElementById("userlog-content").clientHeight;
    var tableHeight = document.documentElement.scrollHeight;
    console.log(contentHeight);
    console.log(tableHeight);
    if(contentHeight>tableHeight){
        $("#scroll-btns").css("display","none");
    }else{
        $("#scroll-btns").css("display","block");
    }
    $("#drop-down").click(function(){
		var t = $("#userlog-content").scrollTop();
                console.log(t);
		/*禁止连续点击*/
		if($("#userlog-content").is(':animated')){
			console.log("animated")
		}else{
			$("#userlog-content").animate({'scrollTop':t+100},400);
		}
	})
	$("#pull-up").click(function(){
		var t = $("#userlog-content").scrollTop();
                console.log(t);
		if($("#userlog-content").is(':animated')){
			console.log("animated")
		}else{
			$("#userlog-content").animate({'scrollTop':t-100},400);
		}		
	})
})
