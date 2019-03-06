/*页面内容加载完后执行*/
$(function(){
	$("input[name=username],input[name=password]").focus(function(){
		$(".alert-message").css("visibility","hidden")
	});
	$("#user_login").click(function(){
		/*获取用户输入用户名、密码*/
		var username = $("input[name='username']").val();
		var password = $("input[name='password']").val();
		$.ajax({
		type:"post",
		url:"http://"+location.host+"/login",
		data:{"name":username,"password":password},
		dataType: 'json',
		success: function(result){
        	if(result.state=='error'){
        		console.log('用户名或密码有误');
        		$(".alert-message").css("visibility","visible")
        	}else{
        		console.log("登录成功！");
        		setCookie ("permission",result.permission);
        		/*window.open("main.html","_self");*/
        		window.location.href="http://"+location.host+"/main/"
        	}       	
        },
        error: function(result){
			alert("返回数据失败");
        }
	});
	})
});
