$(function(){
	$("#trend-btn-group p label").click(function(){
//		console.log($(this).attr("pageto"))
		$("#trend-iframe").attr("src",$(this).attr("pageto"))
		$("#trend-btn-group p label").css("background","#005D98");
		$(this).css("background","#004B74");
	})
})
