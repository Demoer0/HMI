$(function(){
    var csvContent  = loadCSV("../statuscode.csv");
    var strs = csvContent.split(/[,\n]/);
    var arr=new Array();
   for (i=1;i<=strs.length/4;i++) {
        if(strs[4*i]){
            arr.push(strs[4*i]);
        }
   }
console.log(arr);
    for(var i=0;i<arr.length;i++) {
        var setDiv = document.createElement("div");
        var setTable1 = document.createElement("table");
        setTable1.className = "tag-table";
        setDiv.id="div-content";
        var setTr = document.createElement("tr");
        var setTh1 = document.createElement("th");
        var setTh2 = document.createElement("th");
        setTr.appendChild(setTh1);
        setTr.appendChild(setTh2);
        if(i===7){
            setTh1.id = "th1-style";
            setTh2.id = "th2-style";
        }
        setTh1.textContent = i + 1;
        setTh2.textContent = arr[i]+"故障列表->";
        setTable1.appendChild(setTr);
        setDiv.appendChild(setTable1);
        document.getElementById("table-content").appendChild(setDiv);
        createTable(i);
    }
    function createTable(i){
        var k,l;
        for (var j =1;j<=strs.length/4;j++) {
            if (strs[4 * j] === arr[i]) {
                k = j;
            }
        }
        for (var n=1;n<=strs.length/4;n++) {
            if (strs[4 * n] === arr[i + 1]) {
                l = n;
            }
        }
        for(var m=k;m<l;m++){
            var setDiv1 = document.createElement("div");
            var setTable2 = document.createElement("table");
            var setLabel = document.createElement("label");
            var Tr = document.createElement("tr");
            var Td1 = document.createElement("td");
            var Td2 = document.createElement("td");
            var Td3 = document.createElement("td");
            var Td4 = document.createElement("td");
            setDiv1.className="tableLength"
            Td1.className = "td1-style";
            Td2.className = "td2-style";
            Td3.className = "td3-style";
            Td4.className = "td4-style";
            Tr.appendChild(Td1);
            Tr.appendChild(Td2);
            Tr.appendChild(Td3);
            Tr.appendChild(Td4);
            Td4.appendChild(setLabel);
            setTable2.className ="table-content";
            setLabel.className="shield";
            setLabel.id=m;
            Td1.textContent = (i + 1)+'.'+(m-k+1);
            Td2.textContent = strs[4*m+2];
            Td3.textContent = '当前屏蔽状态';
            setTable2.appendChild(Tr);
            setDiv1.appendChild(setTable2);
            setDiv.append(setDiv1);
            $('.tableLength').hide();
        }
    }
    var arr1=new Array() ;
    $.ajax({
        type:"POST",
        url:"http://"+location.host+"/faultListHandler?command=61",
        success: function(result) {
            var content = JSON.stringify(result);
            //console.log(result);
            arr1.push(result.data.user_log);
            //console.log(arr1);
            for (var n = 1; n <= arr1[0].length; n++) {
                if (arr1[0][n-1] === "1") {
                    document.getElementById(n).textContent='屏蔽'
                } else {
                    document.getElementById(n).textContent='未屏蔽'
                }
            }
        },
        error: function(result){
            alert("返回数据失败");
        }
    });
$('th').click(function () {
     //$(this).parent().parent().parent().find('td').slideToggle();
     var display=$(this).parent().parent().parent().find('.tableLength').css('display');
     if(display=='none'){
     $(this).parent().parent().parent().find('.tableLength').show();
}
else{
$(this).parent().parent().parent().find('.tableLength').hide();
}
/*判定是否需要滚动按钮*/
        var contentHeight =document.getElementById("div-style").clientHeight;;
        var tableHeight =  document.getElementById("table-content").scrollHeight;
        console.log(contentHeight);
        console.log(tableHeight);
        console.log(display);
        if(contentHeight>tableHeight){
            $("#scroll-btns").css("display","none");
            console.log(1);
        }else{
            $("#scroll-btns").css("display","block");
            console.log(0);
        }
        $("#drop-down").click(function(){
            var t = $("#div-style").scrollTop();
            console.log(t);
            /*禁止连续点击*/
            if($("#div-style").is(':animated')){
                console.log("animated")
            }else{
                $("#div-style").animate({'scrollTop':t+100},400);
            }
        })
        $("#pull-up").click(function(){
            var t = $("#div-style").scrollTop();
            console.log(t);
            if($("#div-style").is(':animated')){
                console.log("animated")
            }else{
                $("#div-style").animate({'scrollTop':t-100},400);
            }
        })
    })
$('.shield').click(function () {
        
        var senddata= new Array();
        var num=$(this).attr("id")-1;
        senddata.push(num);
        if($(this).text()==="屏蔽"){
            var databutton='0';
        }
        else {
            databutton='1';
        }
        var msg = {
            command: 71,
            NUM: num,
            point_name:databutton,
            points_name:senddata
    };
        
        
        senddata.push(databutton);
        $.ajax({
            type:"GET",
            url:"http://"+location.host+"/faultRestHandler?",
            data: msg,
            dataType: 'json',
            success: function(result){
              console.log(result);
              var changeArr= result.data.user_log;
              console.log(changeArr);
                for (var q = 1; q <= changeArr.length; q++) {
                    if (changeArr[q-1] === "0") {
                        document.getElementById(q).textContent='未屏蔽';
                    } 
                    else {
                        document.getElementById(q).textContent='屏蔽';
                    }
                }
                },
                error: function(result){
                    alert("返回数据失败");
                }
            });
    })
});
