$(function(){
    $.ajax({
        type:"get",
        //url:"http://"+config.ip+"/currentFaultHandler",
        url:"http://"+location.host+"/faultShieldHandler",
        success: function(result){
            var content = JSON.stringify(result);
            console.log(result);
            //console.log(result.data.current_fault[0]);
            shieldedFaultTable(result.data);

        },
        error: function(result){
            alert("返回数据失败");
        }
    });
});
function shieldedFaultTable(data){
    var Table = document.getElementById("shieldedFault-content-table");
    var csvContent  = loadCSV("../statuscode.csv");
    var strs = csvContent.split(/[,\n]/);
    var num=0;
    //console.log(strs);
    //console.log(csvContent);
    //console.log(strs[0]);
    for(var i = 0 ;i<data.length;i++){
        if(data[i]==="1"){
        var tr = document.createElement("tr");
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        tr.appendChild(td1);
        tr.appendChild(td2);
        td1.className="height";
        td1.textContent = strs[4*(i+1)+1];
        td2.textContent = strs[4*(i+1)+2];
        num++;
        Table.appendChild(tr)
}
    }
/*判定是否需要滚动按钮*/
$(document).ready(function () {
    var contentHeight = document.getElementById("shieldedFault-content").clientHeight;
    var tableHeight = 50*num;
    console.log(contentHeight);
    console.log(tableHeight);
    if(contentHeight>tableHeight){
        $("#scroll-btns").css("display","none");
    }else{
        $("#scroll-btns").css("display","block");
    }
    $("#drop-down").click(function(){
		var t = $("#shieldedFault-content").scrollTop();
                console.log(t);
		/*禁止连续点击*/
		if($("#shieldedFault-content").is(':animated')){
			console.log("animated")
		}else{
			$("#shieldedFault-content").animate({'scrollTop':t+100},400);
		}
	})
	$("#pull-up").click(function(){
		var t = $("#shieldedFault-content").scrollTop();
                console.log(t);
		if($("#shieldedFault-content").is(':animated')){
			console.log("animated")
		}else{
			$("#shieldedFault-content").animate({'scrollTop':t-100},400);
		}		
	})
})
}
 
