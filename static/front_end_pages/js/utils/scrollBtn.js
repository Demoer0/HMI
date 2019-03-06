function scrollBtnClick(){
	$("#drop-down").click(function(){
		var t = $("#parameter-content").scrollTop();
		/*禁止连续点击*/
		if($("#parameter-content").is(':animated')){
			console.log("animated")
		}else{
			$("#parameter-content").animate({'scrollTop':t+100},400);
		}
	})
	$("#pull-up").click(function(){
		var t = $("#parameter-content").scrollTop();
		if($("#parameter-content").is(':animated')){
			console.log("animated")
		}else{
			$("#parameter-content").animate({'scrollTop':t-100},400);
		}		
	})
}
