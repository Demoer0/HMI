window.onload = function(){
	// getPointName();
	var address = "ws://"+location.host+"/test2";
	// console.log(address);
	var ws = new WebSocket(address);
	msg = {
		'sessionId': 'index',
		'command': '11',
		'points_name': ['angle1', 'angle2', 'angle3', 'Rotor_RSpd', 'ave_Onesec_Wsp', 'G_RSpd1', 'Gear_RSpd']
	};
 	ws.onopen = function(event){
		//ws.send("connect success");
		ws.send(JSON.stringify(msg));		
		console.log("connect success");
		};
	ws.onmessage = function(e){
		var data = eval('(' + e.data + ')');
		var showContent = data.data;
		// console.log(showContent);
		$("#data1")[0].innerHTML = showContent['angle1']+"";
		$("#data2")[0].innerHTML = showContent['angle2']+"";
		$("#data3")[0].innerHTML = showContent['angle3']+"";
		$("#data4")[0].innerHTML = showContent['Rotor_RSpd']+"rpm";
		$("#data5")[0].innerHTML = showContent['ave_Onesec_Wsp']+"m/s";
		$("#data6")[0].innerHTML = showContent['G_RSpd1']+"rpm";
		$("#data7")[0].innerHTML = showContent['Gear_RSpd']+"rpm";
		// ws.send(JSON.stringify(msg));
		// ws.send(ws.readyState);
	};
	ws.onerror = function(evt){
		console.log("发生错误")
	};
	ws.onclose = function(){
		console.log("断开连接");
		ws.close();
	};
	//点击维护 事件
	$(".toggle1").click(function(){
		if($(this).hasClass("toggle-off"))
		{
			var data1={
			command:21,
			point_name:'maintenance',
			point_value:true
			};
			$(this).toggleClass("toggle-on");//属性为on的状态 红色
			$(this).removeClass("toggle-off");//移除toggle-off属性
            parent.window.document.getElementById('Repair-or-Maintain').innerHTML='维护';


		}else if($(this).hasClass("toggle-on")){
			var data1={

			command:21,
			point_name:'maintenance',
			point_value:false
			};
			$(this).toggleClass("toggle-off");//属性为off的状态
			$(this).removeClass("toggle-on");//移除toggle-off属性
			parent.window.document.getElementById('Repair-or-Maintain').innerHTML='维修/维护';
		}
		 $.ajax({
			type: "GET",
    		url: "http://"+location.host+"/staticData",
	        data:data1,
            dataType: 'json',
            success: function(result){
    			var res = JSON.stringify(result);
    			//alert(result);
    			console.log(res);
    			},
    		error: function(result){
		console.log("返回数据失败");
    			}
		});
	});
	//点击维修 事件
	$(".toggle2").click(function(){
		if($(this).hasClass("toggle-off"))
		{
			var data1={
			command:21,
			point_name:'repair',
			point_value:true
			};
			$(this).toggleClass("toggle-on");//属性为on的状态 红色
			$(this).removeClass("toggle-off");//移除toggle-off属性
			var text = parent.window.document.getElementById("Repair-or-Maintain").innerHTML;
			console.log(text);
            parent.window.document.getElementById("Repair-or-Maintain").innerHTML='维修';

		}else if($(this).hasClass("toggle-on")){
			var data1={
			command:21,
			point_name:'repair',
			point_value:false
			};
			$(this).toggleClass("toggle-off");//属性为off的状态
			$(this).removeClass("toggle-on");//移除toggle-off属性
			parent.window.document.getElementById('Repair-or-Maintain').innerHTML='维修/维护';
		}
		 $.ajax({
			type: "GET",
    		url: "http://"+location.host+"/staticData",
	        data:data1,
            dataType: 'json',
            success: function(result){
    			var res = JSON.stringify(result);
    			//alert(result);
    			console.log(res);
    			},
    		error: function(result){
		console.log("返回数据失败");
    			}
		});
	})
};

// function getPointName(){
// 	var data = $(["datamapping"]);
// 	console.log(data);
// 	var pointList = [];
// 	for (var i = 0; i < data.length; i++) {
// 		pointList.push(data[i].getAttribute("datamapping"));
// 	}
// 	console.log(pointList);
// };
// });
