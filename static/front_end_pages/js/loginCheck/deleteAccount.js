var obj = {};
$(function(){
	showTableList();
	$("#delete-cancel").click(function(){
		hideAlertDiv();
	});
	$(".mask").click(function(){
		hideAlertDiv();
	})
//	$(".delete-action").click(function(){
//		
//	})
});

function deleteAccount(username){
	console.log("删除"+username);
	$.ajax({
        type: "GET",
        url: "http://"+ location.host +"/deleteUser",
		data:{'name':obj.username},
        dataType: 'json',
        success: function(result){
        	var content = JSON.stringify(result);
		        	console.log(content);
//      	setTableContent(result.data);
        },
        error: function(result){
			alert("返回数据失败");
        }
   });
}

function showAlertDiv(obj){
	$(".mask").css("display","block");
	$("#alert-div").css("display","block");
}

function hideAlertDiv(){
	$(".mask").css("display","none");
	$("#alert-div").css("display","none");
}

function showTableList(){
	var data = {};
	data.permission = getCookie("permission");
	$.ajax({
        type: "GET",
        url: "http://" + location.host + "/queryUser",
		data:data,
        dataType: 'json',
        success: function(result){
        	var content = JSON.stringify(result);
//		        	console.log(content);
        	setTableContent(result.data);
        },
        error: function(result){
			alert("返回数据失败");
        }
   });		    
}

function setTableContent(data){
//	console.log(data)
	var userLevel,userName;
	var _deleteTable = $("#delete-table");
	$("tr").remove(".userlist");
	for(var i in data){
		var tr = document.createElement("tr");
		tr.className = "userlist";
		var userNameTd = document.createElement("td");
		var userLevelTd = document.createElement("td");
		var deleteAction = document.createElement("td");
		var deleteLabel = document.createElement("label");
		userName = i;
		userLevel = data[i];
//		console.log(userName+":"+userLevel)
		userNameTd.textContent = userName;
		userLevelTd.textContent = userLevel;
		deleteLabel.textContent = "删除";
		deleteLabel.className = "delete-action";
		deleteAction.appendChild(deleteLabel);	
		tr.appendChild(userLevelTd);
		tr.appendChild(userNameTd);
		tr.appendChild(deleteAction);
		_deleteTable.append(tr);
	}
	$(".delete-action").click(function(){
		level = $(this).parent().prev().prev().text();
		username = $(this).parent().prev().text();
//		console.log(username)
		obj.username = $(this).parent().prev().text();
		obj.level = $(this).parent().prev().prev().text();
		showAlertDiv();
	});
	
	$("#delete-confirm").click(function(){	
//		console.log(obj.username)
		deleteAccount(username);
		hideAlertDiv();
		showTableList();
	})
}

//function deleteAccount(username){
//	var user = {};
//	user.name = 
//	$.ajax({
//      type: "GET",
//      url: "http://"+config.ip+"/deleteUser",
//		data:user,
//      dataType: 'json',
//      success: function(result){
//      	var content = JSON.stringify(result);
//		        	console.log(content);
////      	setTableContent(result.data);
//      },
//      error: function(result){
//			alert("返回数据失败");
//      }
// });	
//}
