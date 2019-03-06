var timer;
var flag=[false,false,false,false];
var ws = new WebSocket("ws://" + location.host + "/test2");
var textContent = {
	init:function(){
		this.initCharts();
		this.events();
	},
	config:{
		pointList:[		//存放选中数据点名和datamapping
			{
				name:"",
				datamapping:""
			},
			{name:"",
				datamapping:""},
			{name:"",
				datamapping:""},
			{name:"",
				datamapping:""}
		],
		curveName:[	//各曲线对应的点名
			"",
			"",
			"",
			""
		],
		isChanged:[],
        /*各曲线X轴长度*/
		xAxisWith:{
			minWidth:30,
			maxWidth:600,
			currentWidth:30
		}
	},
	initCharts: function(){
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
	         text: 'Values'
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
                            symbol:'circle', 
	                    radius:2,  
	                    lineWidth:0,  
	                    lineColor:'#21BDE6',  
	                    fillColor:'#21BDE6',  
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
	                    enabled: true
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
	        backgroundColor: '#FCFFC5',
	        shape   : 'square',
	        shadow: false,
	        borderWidth: 1,
	        headerFormat: 'Value:',
	        pointFormat: '{point.y}',
			valueDecimals:3,
			shared: false,
			enabled:true,
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
	},
	events: function(){
		var _this = this;
		var _pointChoose = $("#point-choose");
		var _pointConfirm = $("#point-confirm");
		var _dataPoint = $(".data-point");
		var _setTime = $("#setTime");	//设置x轴宽度
		var _setxAxisConfirm = $("#setxAxis-confirm");
		var _setxAxisCancel = $("#setxAxis-cancel,.mask");
		var _mask = $(".mask");
		var _realTimeChartsContent = $('#realtime-charts-content');
		var _movePlotLine = $('#adjust_left,#adjust_right');
		var _plotLineCancel = $("#cancel");
		_pointChoose.click(function(){	//进入选点界面
			$("#trend-point").css("display","block");
			$("#layer1").css("opacity",0.1)
		});

		//选点完成后点击确认
		_pointConfirm.click(function(){	//确认选点
			$("#trend-point").css("display","none");
			$("#layer1").css("opacity",1);
			// 生成数据点名的数组
			var pointNameList = [];
			for (var i=0; i < _this.config.pointList.length; i++){
				if (_this.config.pointList[i].datamapping) {
					pointNameList.push(_this.config.pointList[i].datamapping)
				}
			}

			var msg = {
				sessionId: 'realtime',
				command: '11',
				points_name: pointNameList
			};

			ws.send(JSON.stringify(msg));
			_this.removePlotLine();
			_this.setPointChanged();
			// console.log(_this.config.isChanged)
			_this.setCurveName();		//设置curveName的值
			_this.setCurveNameLabel(); //设置标签的名字
			_this.drawCharts(pointNameList);
			_this.initPointChanged();
		});

		//选择点名
		_dataPoint.click(function(){	//选择点名
			var $this_name = $(this).text();
			var $this_datamapping = $(this).attr("datamapping");
			if(_this.isSelected($this_name)){
				_this.deletePoint($this_name);
				$(this).css("background","#FFFFFF");
//				console.log("删除数据点")
			}else{
				if(_this.isFull()){
//					console.log("数据点已满")
				}else{
//					console.log(_this.isFull())
					_this.addPoint($this_name,$this_datamapping);
					$(this).css("background","#9DC3E6");
//					console.log("添加数据点")
				}		
			}
			_this.setPointLabel()
		});
		
		_setTime.click(function(){
			$("#input-warning").css("visibility","hidden");
			$("input[class=xAxis-width-val]").val(_this.config.xAxisWith.currentWidth);
			$('#set_xAxis_width , .mask').css("display","block");
		});

		// 取消设置横坐标轴长度(取消设置显示时长)
		_setxAxisCancel.click(function(){
			$('#set_xAxis_width , .mask').css("display","none");
		});

		// 确认设置横坐标时长(确认修改时间)
		_setxAxisConfirm.click(function(){
			var _input = parseInt($("input[class=xAxis-width-val]").val());
			if(_input<_this.config.xAxisWith.minWidth||_input>_this.config.xAxisWith.maxWidth){
				$("#input-warning").css("visibility","visible");
				return
			}
			
			_this.config.xAxisWith.currentWidth = _input;
			$('#set_xAxis_width , .mask').css("display","none");
			_this.removePlotLine();
			_this.setxAxisWith();
			_this.drawCharts();
			_this.showYAxisValue();		
		});
		
		_realTimeChartsContent.bind('mousedown click',function(e){
			var chart, point, i, xVal, event;
	        for (i = 0; i < Highcharts.charts.length; i ++) {
	            chart = Highcharts.charts[i];
	            event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
                // point = chart.series[0].searchPoint(event, true); // Get the hovered point
	            point=chart.series[0].data[e.originalEvent.point.index];//从左到右
                // console.log(point);
	            if (point) {
	               //point.highlight(e);
	               point.select(true);
	               xVal=point.category;
	               
	               _this.creatPlotLines(xVal,i);
	//             setSelectedPoint(point);
	            }else{
//	            	console.log("plotLine:"+i);
	            }
	        }    
		});
		
		_movePlotLine.click(function(){
			var _that = $(this);
			_this.movePoltLine(_that);
			_this.showYAxisValue();
		});
		
		_plotLineCancel.click(function(){
			_this.removePlotLine();
		})
	},

    //判断数据点是否已选满
	isFull:function(){
		for(var i=0;i<this.config.pointList.length;i++){
			if(!this.config.pointList[i].name){
				return false
			}
		}
		return true
	},

    //判断数据点是否已选择
	isSelected:function(name){
		for(var i=0;i<this.config.pointList.length;i++){
			if(this.config.pointList[i].name == name){
				return true;
			}
		}
		return false;
	},

    //添加数据点
	addPoint:function(name, datamapping){
		var _this = this;
		for(var i=0;i<_this.config.pointList.length;i++ ){
				if(!_this.config.pointList[i].name){
					_this.config.pointList[i].name = name;
					_this.config.pointList[i].datamapping = datamapping;
					break
				}
			}
	},

	//删除数据点
	deletePoint:function(name){
		for(var i=0;i<this.config.pointList.length;i++){
			if(this.config.pointList[i].name == name){
				this.config.pointList[i] = {};
				break
			}
		}
	},

    //设置选点界面上各曲线对应的点名
	setPointLabel:function(){
		var _this = this;
		for(var i=0;i<_this.config.pointList.length;i++ ){
				if(!_this.config.pointList[i].name){
					$("#curve"+(i+1)+"-name").text("")
				}else{
					$("#curve"+(i+1)+"-name").text(_this.config.pointList[i].name)
				}
			}
	},

    //设置标签的名字
	setCurveNameLabel:function(){
		var _curveName = this.config.curveName;
		for(var i=0;i<_curveName.length;i++){
			$("#curve"+(i+1)+"_name").html(_curveName[i])
		}
	},
	
	setPointChanged:function(){
		var _this = this;
		for(var i=0;i<_this.config.curveName.length;i++){
			if(_this.config.pointList[i].name==_this.config.curveName[i]||(!_this.config.pointList[i].name&&_this.config.curveName[i]=="")){
				_this.config.isChanged[i] = false;
			}else{
				_this.config.isChanged[i] = true;
			}
		}
	},

	initPointChanged:function(){
		var _this = this;
		for(var i=0;i<_this.config.isChanged.length;i++){
			_this.config.isChanged[i] = false;
		}
	},

    /*设置曲线名称*/
    //设置curveName的值
	setCurveName:function(){
		var _this = this;
		for(var i=0;i<_this.config.curveName.length;i++){
			if(_this.config.pointList[i].name){
				_this.config.curveName[i] = _this.config.pointList[i].name
			}else{
				_this.config.curveName[i] = ""
			}
			 
		}
	},

	/*设置x坐标线*/
	setxAxisWith:function(){
		var _this = this;
		$("#setTime").text(_this.config.xAxisWith.currentWidth+"s")
	},

	/*绘制曲线图*/
	drawCharts:function(pointNameList){
		if(timer){
			// console.log("timer存在");
			clearInterval(timer);
		}
		var _this = this;
		var _date = new Date();
		var _xAxisWidth = _this.config.xAxisWith.currentWidth;
		var _yData;
		var _pointList = _this.config.pointList;
		var _isChanged = _this.config.isChanged;
		var _curveName = _this.config.curveName;

		for(var i=0;i<_pointList.length;i++){
			if(_isChanged[i]||_curveName[i]==""){
				// console.log("changed:"+i+1);
				// console.log(_this.config.isChanged);
				$('#container'+(i+1)).highcharts().series[0].update({
					pointStart: Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds()),
					name:"",
					data:[]
				})
			}else{
				// console.log("not changed:"+i+1);
				yData = $('#container'+(i+1)).highcharts().series[0].yData;
				$('#container'+(i+1)).highcharts().series[0].update({	//yData.length>_xAxisWidth?_xAxisWidth:yData.length从低到高和从高到底不一样
					pointStart: Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds()-(yData.length>_xAxisWidth?_xAxisWidth:yData.length)),
					name:"",
					data:$('#container'+(i+1)).highcharts().series[0].yData.slice(-_xAxisWidth,$('#container'+(i+1)).highcharts().series[0].data.length),
				})
			}
		}

		ws.onmessage = function (result) {
			var realtimedata = eval('(' + result.data + ')');
			showContent = realtimedata.data;
			_xAxisWidth = _this.config.xAxisWith.currentWidth;
			if (result != undefined) {
				for (var i = 0; i < _pointList.length; i++) {
					if (_pointList[i].datamapping) {
						var shift = $('#container' + (i + 1)).highcharts().series[0].data.length >= _xAxisWidth;
						// console.log(result.data[_pointList[i].datamapping]);
						// var data = 21*Math.random();      // generate the random number to use 
						var data = showContent[_pointList[i].datamapping];
						$('#container' + (i + 1)).highcharts().series[0].addPoint(data, true, shift);
					}
				}
			}
			_this.showYAxisValue();
		};

		ws.onerror = function (evt) {
			console.log("发生错误");
			console.log(evt);
		};

		ws.onclose = function () {
			console.log("断开连接")
			ws.close();
		};

		// console.log("the data will send to server is: ", pointNameList);
		/* timer=setInterval(function show() {
			_xAxisWidth = _this.config.xAxisWith.currentWidth;
			// 定时向后台请求数据
			$.ajax({
				type: "post",
				url: "http://" + location.host + "/trendcurve",
				data: {command: 11, points_name: pointNameList},
				dataType: 'json',
				success: function (result) {
					// console.log(result);
					if (result != undefined) {
						for(var i=0;i<_pointList.length;i++){
							if(_pointList[i].datamapping){
								var shift = $('#container'+(i+1)).highcharts().series[0].data.length>=_xAxisWidth;
					 			// console.log(result.data[_pointList[i].datamapping]);
								// var data = 21*Math.random();      // generate the random number to use 
								var data = result.data[_pointList[i].datamapping];
								$('#container'+(i+1)).highcharts().series[0].addPoint(data, true, shift);
							}
						}
					}
				},
				error: function (result) {
					console.log(result);
				}
			});
			_this.showYAxisValue();
		}, 1000); */
	},

	creatPlotLines:function(val,i){
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
	},
	
	showYAxisValue:function(){
		var i,j,chart,point_y,selectedPoints,len;
		var _this = this;
		for (i = 0; i < 4; i ++) {
	    	chart = Highcharts.charts[i];
	    	len=chart.series[0].data.length;
	    	j=i+1;
	    	selectedPoints=chart.getSelectedPoints();
			if(_this.config.curveName[i]!=""){
				point_y=chart.series[0].data[len-1].y.toFixed(2);
				$("#container"+j+"_value").text(point_y);
			}else{
				$("#container"+j+"_value").text("");
			}
			if(selectedPoints!=""){
				point_y=chart.series[0].data[selectedPoints[0].index].y.toFixed(2);
				$("#container"+j+"_value").text(point_y);
			}
			
		}
	},
	
	movePoltLine:function(e){
		var i,chart,point,selectedPoints;
		var _this = this;
		for (i = 0; i < Highcharts.charts.length; i ++) {
		    chart = Highcharts.charts[i];
		    selectedPoints=chart.getSelectedPoints();
		//  alert(selectedPoints)
			if(selectedPoints==""){
				continue;
			}
			if(e.attr("id") =="adjust_left"){
				point=chart.series[0].data[selectedPoints[0].index-1];
				if(point){
					point.select();
					_this.creatPlotLines(point.x,i);
		//     		setSelectedPoint(point);
				}else{
//			  		alert("Out of range!");
			  		break;
				}
				
		  	}else if(e.attr("id") =="adjust_right"){
		  		point=chart.series[0].data[selectedPoints[0].index+1];
		  		if(point){
					point.select();
					_this.creatPlotLines(point.x,i);
		//     		setSelectedPoint(point);
				}else{
//		  			alert("Out of range!");
			  		break;
					}
			  	}
		   }
	},

    //取消拉通的竖线
	removePlotLine:function(){
		// console.log("remove");
		var i,chart,point,selectedPoints;
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
	}
};

$(function(){
	textContent.init();
//	textContent.drawCharts();
});
