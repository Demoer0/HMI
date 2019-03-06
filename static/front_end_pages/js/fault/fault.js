window.onload=function(){
	switchPage()
}

function switchPage(){
	
	$('.btn-menu').click(function(){
		$('.checked').addClass('unchecked');
		$('.checked').removeClass('checked');
		$(this).addClass('checked');
		$(this).removeClass('unchecked');
		$("#iframe").attr('src',$(this).attr("url"))
	})
}
