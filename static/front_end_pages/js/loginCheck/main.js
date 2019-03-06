$(function(){
	$("#account-btn-group label").click(function(){
		$(".nav-btn").each(function(){
			$(this).removeClass("nav-btn-selected");
		});
		$(this).addClass("nav-btn-selected");
		var str = $(this).attr("id")+".html";
		$("#logincheck-iframe-area iframe").attr("src",str);
	})
})
