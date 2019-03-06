/*页面内容加载完后执行*/
$(function () {
    $.ajax({
        type:"get",
        url:"http://" + location.host + "/logincheck?permission=5",
        dataType: 'json',
        success: function(result){
            if(result.state=='error'){
                console.log('对不起，您没有此权限！');
            }else{
                console.log("您可以访问登录历史！");
                console.log(result);
                // console.log(result.data[1][1]);
                var html = "";
                html+="<table>";
                for (var key in result.data){
                    html+="<tr><td>";
                    html+=key;
                    html+="</td>";
                    for(var i = 0;i< 4;i++){
                        console.log(result.data[key][i]);
                        html += "<td>";
                        html += result.data[key][i];
                        html += "</td>";
                        if(i==2){
                            html += "<td>";
                            html += "</td>";
                        }
                    }
                    html += "</tr>";
                }
                html += "</table>";
                var info=document.getElementById("loginCheck-content");
                info.innerHTML = html;
                // console.log(info.innerHTML);
            }
        },
        error: function(result){
            alert("返回数据失败");
        }
    });
})
