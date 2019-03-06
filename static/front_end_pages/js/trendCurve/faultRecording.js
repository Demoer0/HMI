$(function(){
    $.ajax({
        type:"get",
        url:"http://"+location.host+"/faultrecord",
        success: function(result){
            var content = JSON.stringify(result);
                console.log(content);
           //   currentFaultTable(result.data)
            //document.getElementById("table-head").textContent(result.data[1][0]);
            var arr=new Array();
            arr.push(result.data);
            console.log(result.data[10]);
            createfaultRecording(result);
        },
        error: function(result){
            alert("返回数据失败");
        }
    });
});

function createfaultRecording(result){
    var table = document.getElementById("faultRecording-content-table");
    console.log(result.data);
    for(var key=2;key<=502;key++){
        var tr = document.createElement('tr');
        var tdArr=['td1','td2','td3','td4','td5','td6','td7','td8','td9','td10','td11','td12','td13','td14','td15','td16','td17','td18','td19','td20'];
        console.log(key);
        for(var i=0;i<20;i++){
            tdArr[i] = document.createElement("td");
            tr.appendChild(tdArr[i]);
            tdArr[i].textContent=result.data[key][i];
        }
        //console.log(result.data);
        table.appendChild(tr);
    }
}
