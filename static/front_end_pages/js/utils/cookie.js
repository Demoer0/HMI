function setCookie (name,value) {
	document.cookie=name+ "=" +escape(value);
}

function getCookie($name){    
  var data=document.cookie;    
  var dataArray=data.split("; ");    
  for(var i=0;i<dataArray.length;i++){    
    var varName=dataArray[i].split("=");    
    if(varName[0]==$name){    
      return decodeURI(varName[1]);    
    }                    
     
  }    
}    
       //删除cookie中所有定变量函数    
function delAllCookie(){    
  var myDate=new Date();    
  myDate.setTime(-1000);//设置时间    
  var data=document.cookie;    
  var dataArray=data.split("; ");    
    for(var i=0;i<dataArray.length;i++){    
      var varName=dataArray[i].split("=");    
      document.cookie=varName[0]+"=''; expires="+myDate.toGMTString();    
    } 
}
 
       //删除cookie中指定变量函数    
function delCookie($name){    
  var myDate=new Date();    
  myDate.setTime(-1000);//设置时间    
  document.cookie=$name+"=''; expires="+myDate.toGMTString();                
}