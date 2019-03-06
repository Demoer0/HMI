/*websocket*/
var ws = new WebSocket("ws://" + location.host + "/test2");

msg = {
        'sessionId': 'indexLeft',
		'command': '11',
		'points_name': ['local_add', 'run_state', 'ave_Onesec_Wsp', 'angle_ave', 'Rotor_RSpd', 'G_RSpd1', 'G_Power_FB']
	};
 	ws.onopen = function(){
		//ws.send("connect success");
		ws.send(JSON.stringify(msg));
		console.log("left connect success");
 	};
    ws.onmessage = function(e){
        // console.log(e);
		var data = eval('(' + e.data + ')');
		var showContent = data.data;
		// console.log(showContent);
		$(".badge")[0].innerHTML = showContent['local_add']+"";
		$(".badge")[1].innerHTML = showContent['run_state']+"";
		// $(".badge")[2].innerHTML = showContent['location-now']+"";
		// $(".badge")[3].innerHTML = showContent['STATS.1.NO']+"";
		$(".badge")[4].innerHTML = showContent['ave_Onesec_Wsp']+"m/s";
		$(".badge")[5].innerHTML = showContent['angle_ave']+"";
		$(".badge")[6].innerHTML = showContent['Rotor_RSpd']+"rpm";
		$(".badge")[7].innerHTML = showContent['G_RSpd1']+"rpm";
		$(".badge")[8].innerHTML = showContent['G_Power_FB']+"kw";
	};
    ws.onerror = function(evt){
		console.log("发生错误")
	};
	ws.onclose = function(){
		console.log("断开连接");
	};

    $(function(){
	    //绑定底部点击事件
                $(".nav img ").on("click",function(){
                    /*按钮颜色变化*/
                    $(".nav img").css({
                         "background": "linear-gradient(#185D91,#0F3462)"
                    });
                    $(this).css({
                        "background": "linear-gradient(#0F3462,#185D91)"
                    });
                    /*页面跳转*/
                    var content = document.getElementById("window");
                    var page_to = $(this).attr("pageTo");
                    var page_url = $(this).attr("pageurl");
                    content.src = page_to;
                    content.setAttribute("pageurl",page_url);
                });
                /*进入调试*/
                $("#btn-debug").click(function(){
                    if($(this).attr('isDebug')=="false"){
                        $(this).css({
                            'background':'red',
                            'font-size':"0.028rem"
                        });
                        $(this).html('退出调试');
                        $(this).attr('isDebug','true');
                        $("#window").contents().find(".forDebug").css('display','block');
                        $("#window").contents().find(".debug-data").css('background','#747474');
                    }else{
                        $(this).css({
                            'background': 'linear-gradient(#004873,#005D98)',
                            'font-size':"0.028rem"
                        });
                        $(this).html('调试');
                        $(this).attr('isDebug','false');
                        $("#window").contents().find(".forDebug").css('display','none');
                        $("#window").contents().find(".debug-data").css('background','transparent');
                    }
                });

                /*登录查看*/
                $("#logincheck").click(function(){
                    /*页面跳转*/
                    var content = document.getElementById("window");
                    var page_to = $(this).attr("pageTo");
                    content.src = page_to;
                });

                /*停机*/
                $("#btn-stop").click(function () {
                    /*封装数据*/
                    var stopdata = {
                        command: 21,
                        point_name: 'Manual_stop',
                        point_value: true
                    };
                    jQuery.ajax({
                        type: 'GET',
                        url: "http://" + location.host + "/staticData",
                        data: stopdata,
                        dataType: 'json',
                        success: function (result) {
                            var res = JSON.stringify(result);
                            console.log(res);
                        },
                        error: function () {
                            alert("返回数据失败");
                        }
                    });
                });

                /*复位*/
                $("#btn-reset").click(function () {
                    /*封装数据*/
                    var resetdata = {
                        command: 21,
                        point_name: 'stop_clear',
                        point_value: true
                    };
                    jQuery.ajax({
                        type: 'GET',
                        url: "http://" + location.host + "/staticData",
                        data: resetdata,
                        dataType: 'json',
                        success: function (result) {
                            var res = JSON.stringify(result);
                            console.log(res);
                        },
                        error: function () {
                            alert("返回数据失败");
                        }
                    });
                });

                /*起机*/
                $("#btn-start").click(function () {
                    /*封装数据*/
                    var startdata = {
                        command: 21,
                        point_name: 'quick_start_up',
                        point_value: true
                    };
                    jQuery.ajax({
                        type: 'GET',
                        url: "http://" + location.host + "/staticData",
                        data: startdata,
                        dataType: 'json',
                        success: function (result) {
                            var res = JSON.stringify(result);
                            console.log(res);
                        },
                        error: function () {
                            alert("返回数据失败");
                        }
                    });
                });

                /*退出：点击之后回到登录页面*/
                $("#btn-exit").click(function () {
                    window.location="login.html";
                });
             });
