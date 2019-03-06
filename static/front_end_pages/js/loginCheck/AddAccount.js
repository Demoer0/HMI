(function(){
	var permission = parseInt(getCookie("permission"));
//	console.log(typeof(permission))
	for(var i=1;i<6;i++){
		if(permission<=i){
			$("#level-"+i).css("display","none");
		}else{
			$("#level-"+i).css("display","block");
		}
	}
	/*绑定下拉框点击事件*/
	$(document).bind("click",function(e){
		var clickMe=$(e.target);/*获取点击元素*/
		if(!clickMe.hasClass("select-title")){
			$(".select-box ul").addClass("none").removeClass("block");
			if(clickMe.parent().hasClass("select-con")){
				var currenLiHtml=clickMe.html();
				clickMe.parent().siblings(".select-title").html(currenLiHtml);
				clickMe.addClass("current").siblings().removeClass("current");
			}
		}else if(clickMe.siblings(".select-con").hasClass("none")){
			clickMe.parents("body").find(".select-con").addClass("none").removeClass("block");
			clickMe.siblings(".select-con").addClass("block").removeClass("none");
		}else if(clickMe.siblings(".select-con").hasClass("block")){
				$(".select-box ul").addClass("none").removeClass("block");
		}
	});
	
	
	/*提交事件*/
	$("#account-submit").click(function(){
		var patt = /^\w+$/;
		if($("input[name='password1']").val()!=$("input[name='password2']").val()){
			$("#warning-text").html("两次输入密码不一致！");
			$("#warning-text").css("display","inline");
		}else if($("input[name='password1']").val()==""){
			$("#warning-text").html("密码不能为空！");
			$("#warning-text").css("display","inline");
		}else if(!patt.test($("input[name='password1']").val())){
			$("#warning-text").html("密码格式不正确！");
			$("#warning-text").css("display","inline");
		}else{
			var Account = {};
			Account.level = $("#account-level").html();
			Account.username = $("input[name='username']").val();
			Account.password = $("input[name='password2']").val();
			var data={
				'name':Account.username,
				'password':Account.password,
				'permission':Account.level
			};
			 $.ajax({
		        type: "GET",
		        url: "http://" + location.host + "/addUser",
				data:data,
		        dataType: 'json',
		        success: function(result){
		        	var content = JSON.stringify(result);
		        	console.log(content);
		        	console.log(result);
		        	$("input").val("");
					$("#account-level").html("1");
		        },
		        error: function(result){
					alert("返回数据失败");
		        }
		    });
		}
	});

	$("input[type='password']").focus(function(){
		$("#warning-text").html("");
		$("#warning-text").css("display","inline");
	})
	
	/*重置*/
	$("#account-reset").click(function(){
		$("input").val("");
		$("#account-level").html("1");
	})
})();
