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
var data = [1,2,3,6,2,6,23,1,6,8,11,2,7,9,0,21,17,19]
$(function(){
	initCharts();
	/*择点*/
	$("#point-choose").click(function(){
		$("#trend-point").css("display","block");
		$("#layer1").css("opacity",0.1)
	});
	/*确认择点*/
	$("#point-confirm").click(function(){
		$("#trend-point").css("display","none");
		$("#layer1").css("opacity",1);
		/*克隆list数组,确认点名时使用*/
		copylist = list.slice(0);
		drawCharts();
		/*记录上一次择点结束时的点名，和list比较用于判断哪些曲线做了改变*/
		endlist = list.slice(0);
	})
	
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
		/*添加点名到曲线1,2,3,4上*/
		for(var i=1;i<5;i++){
			$("#curve"+i+"-name").text(list[i]);
		}
	})
})

function initCharts(){
	var chart = {
      zoomType: 'x',
      marginBottom: 22
    }; 
    var title = {
       text: null   
    };
    var xAxis = {
      type: 'datetime',
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
		}
	var series= [{
      type: 'line',
      name: null,
      pointInterval: 1000,
  
      data: [1,2,3,4,5,6,7]
      }
   ];
   var plotOptions = {
        series: {
                marker: {
                    enabled: false
                }
            },
   };
   
   var tooltip = {
   			shared: false,
            crosshairs: true,
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }
            }
   }
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
   
   
   $('#history-charts-content').bind(' mousedown ', function (e) {
			//$('#container').bind(' mouseover touchmove', function (e) {
		        var chart,
		            point,
		            i,
		            j,
		            xVal,
		            event;
		        //alert(Highcharts.charts.length);
		        
		        for (i = 0; i < Highcharts.charts.length; i ++) {
		            chart = Highcharts.charts[i];
		            event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
		            point = chart.series[0].searchPoint(event, true); // Get the hovered point
		            console.log(point)
		            if (point) {
		               //point.highlight(e);
		               point.select(true);
		               xVal=point.category;
		               
		               creatPlotLines(xVal,i);
//		               setSelectedPoint(point);
		            }else{
		            	console.log(i+'d');
		            }
		        }
		        
    		});
	/*绘制标示线*/
	var flag=[false,false,false,false];
	function creatPlotLines(val,i){
   		
   		var event,point;
   		var chart;
   		/*先新建标示线对象*/
   		var plotLine1={
   			value:val,
   			color:'#cccccc',
   			width:1,
   			id:'plot-line-1'
   		};
   		var plotLine2={
   			value:val,
   			color:'#cccccc',
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
	/*设置被选中点浮现的标签框*/
   function setSelectedPoint(point){
   		var text = point.category + ': ' + point.y + ' was last selected',
                            chart = point.series.chart;
                        if (!chart.lbl) {
                            chart.lbl = chart.renderer.label(text, 100, 70)
                                .attr({
                                    padding: 10,
                                    r: 5,
                                    fill: Highcharts.getOptions().colors[1],
                                    zIndex: 5
                                })
                                .css({
                                    color: '#FFFFFF'
                                })
                                .add();
                        } else {
                            chart.lbl.attr({
                                text: text
                            });
                        }
   }
    		
    		
}


function drawCharts(){
	var date1 = new Date();
	/*1-5位存的曲线点名*/
	for(var i=1;i<copylist.length;i++){
		if(copylist[i]==""){
			$('#container'+i).highcharts().series[0].update({
					pointStart: Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds()),
					name:copylist[i],
					data:[]
				})
		}else{
			$('#container'+i).highcharts().series[0].update({
				pointStart: Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds()),
				name:copylist[i],
				data:data,
			})
		}
	}
	console.log(copylist)
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
   			width:3,
   			id:'plot-line-1'
   		};
   		var plotLine2={
   			value:val,
   			color:'red',
   			width:3,
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
	/*设置被选中点浮现的标签框*/
   function setSelectedPoint(point){
   		var text = point.category + ': ' + point.y + ' was last selected',
                            chart = point.series.chart;
                        if (!chart.lbl) {
                            chart.lbl = chart.renderer.label(text, 100, 70)
                                .attr({
                                    padding: 10,
                                    r: 5,
                                    fill: Highcharts.getOptions().colors[1],
                                    zIndex: 5
                                })
                                .css({
                                    color: '#FFFFFF'
                                })
                                .add();
                        } else {
                            chart.lbl.attr({
                                text: text
                            });
                        }
   }
	/*左右微调的按钮函数*/
//	function click_adjust(e){
//	var i,j,chart,point,selectedPoints;
//	for (i = 0; i < Highcharts.charts.length; i ++) {
//      chart = Highcharts.charts[i];
//      selectedPoints=chart.getSelectedPoints();
//		if(e.id =="adjust_left"){
//			point=chart.series[0].data[selectedPoints[0].index-1];
//			if(point){
//				point.select();
//				creatPlotLines(point.x,i);
//         		setSelectedPoint(point);
//			}else{
//	  		alert("Out of range!");
//	  		break;
//			}
//			
//	  	}else if(e.id =="adjust_right"){
//	  		point=chart.series[0].data[selectedPoints[0].index+1];
//	  		if(point){
//				point.select();
//				creatPlotLines(point.x,i);
//         		setSelectedPoint(point);
//			}else{
//	  		alert("Out of range!");
//	  		break;
//			}
//	  	}
//  }
  	