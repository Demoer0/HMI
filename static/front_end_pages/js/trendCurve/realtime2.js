var list = new Array(5);
var endlist = new Array(5);
var copylist = new Array("","","","","");
var datamappingList = new Array(5);
var timer;
list[0]=1;
list[1]="";
list[2]="";
list[3]="";
list[4]="";
$(function(){
	/*初始化charts*/	
	initCharts();
	$("#point-confirm").click(function(){
		$("#trend-point").css("display","none");
		$("#layer1").css("opacity",1);
		/*克隆list数组,确认点名时使用*/
		copylist = list.slice(0);
		drawCharts(parseInt($("#setTime").html()));
		/*记录上一次择点结束时的点名，和list比较用于判断哪些曲线做了改变*/
		endlist = list.slice(0);
	})
	$("#point-choose").click(function(){
		$("#trend-point").css("display","block");
		$("#layer1").css("opacity",0.1)
	});
	
	$("#point-table td").click(function(){
		/*为点击的点分配曲线*/
		if(list[0]>=6){			
		}else{
			if(!($.inArray($(this).text(),list)==-1)){
				$(this).css("background","#FFFFFF");
				var index =$.inArray($(this).text(),list);
				list[0] = index<list[0]?index:list[0];
				list[index] = "";
//				console.log(list)				
			}else{				
				if(list[0]==5){					
				}else{
					$(this).css("background","#9DC3E6");
					list[list[0]]=$(this).text();
					var index = $.inArray("",list)>0?$.inArray("",list):5;
					list[0]=index;
//					console.log(list)
				}			
			}			
		}
		/*添加点名到曲线1,2,3,4上;显示所选择的曲线名;*/
		for(var i=1;i<5;i++){
			$("#curve"+i+"-name").text(list[i]);
			$("#container"+i+"_name").html("曲线"+i+"：<br/>"+list[i]);
		}
	})
	
	$("#setTime").click(function(){
		$("#upAndDown").css("display","block");
	})
	/*左右调节拉通的直线*/
	$('#adjust img').click(function(e){
		var _obj = e.target; 
		click_adjust(_obj);
	})
});

function initCharts(){
	var chart = {
      zoomType: 'x',
      marginBottom: 22
    }; 
    var title = {
       text: null   
    };
    var xAxis = {
      type: 'datetime'
//    labels:{
//    	enabled:false,
//    }
    };
    var yAxis = {
//  	tickInterval:1,
      title: {
         text: null
      }
    };
    var legend = {
      enabled: false 
    };
   
	var credits = {
			enabled:false
		};
	var series= [{
      type: 'line',
      name: null,
      pointInterval: 1000,
  
      data: [],
      marker:{//线上数据点  
                    radius:0,  
                    lineWidth:0,  
                    lineColor:'#fba845',  
                    fillColor:'#fba845',  
                    states:{  
                        hover:{  
                            enabled:false  
                        }  
                    }  
                }
      }
   ];
   var plotOptions = {
        series: {
                marker: {
                    enabled: false
                }
            }
   };
   
   var tooltip = {
	   	positioner: function () {
	                        return {
	                            x: this.chart.chartWidth - this.label.width-10, // right aligned
	                            y: 1 // align to title
	                        };
	                    },
        backgroundColor: 'none',
        shape   : 'square',
        shadow: false,
        borderWidth: 1,
        headerFormat: '',
        pointFormat: '{point.y}',
		valueDecimals:3,
		shared: false,
		enabled:false,
		followPointer:true
//		crosshairs: [{
//              width: 1,
//              color: 'green'
//          }]
   };
	var json1 = {};
   json1.chart = chart;
   json1.title = title;
   json1.legend = legend;
   json1.xAxis = xAxis;
   json1.yAxis = yAxis;  
   json1.series = series;
   json1.credits=credits;
   json1.plotOptions = plotOptions;
   json1.tooltip = tooltip;
   //初始配置highcharts
   $('#container1').highcharts(json1);
   $('#container2').highcharts(json1);
   $('#container3').highcharts(json1);
   $('#container4').highcharts(json1);
	//绑定鼠标点击事件	
   $('#realtime-charts-content').bind(' mousedown click', function (e) {		
        var chart,
            point,
            i,
            j,
            xVal,
            event;       
        for (i = 0; i < Highcharts.charts.length; i ++) {
            chart = Highcharts.charts[i];
            event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
//		            point = chart.series[0].searchPoint(event, true); // Get the hovered point
            point=chart.series[0].data[e.originalEvent.point.index];
//		            console.log(point)
            if (point) {
               //point.highlight(e);
               point.select(true);
               xVal=point.category;
               
               creatPlotLines(xVal,i);
//             setSelectedPoint(point);
            }else{
            	console.log(i+'d');
            }
        }    
	});
	
	//点击空白处取消竖线
	$("#cancel").click(function(){
		var i,j,chart,point,selectedPoints;
		for (i = 0; i < 4; i ++) {
	   		var chart=Highcharts.charts[i];
	   		var selectedPoints=chart.getSelectedPoints();
	   		if(selectedPoints==''){
	   			continue;
	   		}
	   		selectedPoints[0].select(false);
	   		chart.xAxis[0].removePlotLine('plot-line-2');
	   		chart.xAxis[0].removePlotLine('plot-line-1');
	   		var point=chart.series[0].data[selectedPoints[0].index];
	   		//console.log(point)
	   	}  		
  	})
}

function syncExtremes(e) {
    var thisChart = this.chart;
    
    if (e.trigger !== 'syncExtremes') { 
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { 
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                }
            }
        });
    }
}

function drawCharts(sec){
	console.log(sec);
	clearInterval(timer);
	var date1 = new Date();
	var yData;
	var interval = parseInt($("#setTime").html());
	/*1-5位存的曲线点名*/
	for(var i=1;i<copylist.length;i++){
		if(copylist[i]==""||endlist[i]!=list[i]){
			$('#container'+i).highcharts().series[0].update({
					pointStart: Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds()),
					name:copylist[i],
					data:[]
				})
		}else{
			yData = $('#container'+i).highcharts().series[0].yData;
			$('#container'+i).highcharts().series[0].update({
				pointStart: Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds()-yData.length),
				name:copylist[i],
				data:$('#container'+i).highcharts().series[0].yData.slice(-sec,$('#container'+(i+1)).highcharts().series[0].data.length),
			})
		}
	}
	timer=setInterval(function show() {
		for(var i=1;i<copylist.length;i++){	
			if(copylist[i]!=""){
				var shift = $('#container'+i).highcharts().series[0].data.length>=sec;
				/*
				 *这里请求数据 
				 * */			
				var data = 21*Math.random();
				$('#container'+i).highcharts().series[0].addPoint(data, true, shift);
			}
		}	
	}, 1000);
}


function cancelTimeInterval(){
	
	$("#upAndDown").css({
		"display":'none'
	})
}

function confirmTimeInterval(){
	console.log($("#timeValue").html()+'s');
	$("#setTime").html($("#timeValue").html()+'s');
	$("#upAndDown").css({
		"display":'none'
	});
	/*重置时间间隔*/
	drawCharts($("#timeValue").html());
}


/*绘制标示线*/
var flag=[false,false,false,false];
function creatPlotLines(val,i){
	
	var event,point;
	var chart;
	/*先新建标示线对象*/
	var plotLine1={
		value:val,
		color:'red',
		width:1,
		id:'plot-line-1'
	};
	var plotLine2={
		value:val,
		color:'red',
		width:1,
		id:'plot-line-2'
	};
	chart=Highcharts.charts[i];
	if(!flag[i]){
		
		chart.xAxis[0].addPlotLine(plotLine1);
		chart.xAxis[0].removePlotLine('plot-line-2');
	}else{
		chart.xAxis[0].addPlotLine(plotLine2);
		chart.xAxis[0].removePlotLine('plot-line-1');
	}
	flag[i]=!flag[i];
	
		//chart.xAxis[0].plotLines=plotLines;
   		
   		
  }
/*左右微调的按钮函数*/
function click_adjust(e){
var i,j,chart,point,selectedPoints;
for (i = 0; i < Highcharts.charts.length; i ++) {
    chart = Highcharts.charts[i];
    selectedPoints=chart.getSelectedPoints();
//  alert(selectedPoints)
	if(selectedPoints==""){
		continue;
	}
	if(e.id =="adjust_left"){
		point=chart.series[0].data[selectedPoints[0].index-1];
		if(point){
			point.select();
			creatPlotLines(point.x,i);
//     		setSelectedPoint(point);
		}else{
	  		alert("Out of range!");
	  		break;
		}
		
  	}else if(e.id =="adjust_right"){
  		point=chart.series[0].data[selectedPoints[0].index+1];
  		if(point){
			point.select();
			creatPlotLines(point.x,i);
//     		setSelectedPoint(point);
		}else{
  			alert("Out of range!");
	  		break;
			}
	  	}
   }	
}
/*显示实时最新y值或标示线y值*/
function yValue(){
	var i,j,chart,point_y,selectedPoints,len;
	for (i = 0; i < 4; i ++) {
    	chart = Highcharts.charts[i];
    	len=chart.series[0].data.length;
    	//console.log(i+"/"+len);
    	j=i+1;
    	if(list[j]==""){
    		$("#container"+j+"_value").text("y"+j+":");
    		continue;
    	}
    	
    	selectedPoints=chart.getSelectedPoints();
		if(selectedPoints==""){
			point_y=chart.series[0].data[len-1].y.toFixed(4);
		}else{
			point_y=chart.series[0].data[selectedPoints[0].index].y.toFixed(4);
		}
		$("#container"+j+"_value").text("y"+j+":"+point_y);
    }
}
setInterval("yValue()",1000);//每隔一秒执行一次