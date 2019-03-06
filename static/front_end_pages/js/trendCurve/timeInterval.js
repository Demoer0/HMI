var tapParams = {
    timer: {},
    element: {},
    tapStartTime: 0,
    type: 'increment'
};

function clearTapTimer() {
    clearTimeout(tapParams.timer);
}

function clearTapHandlers() {
    clearTapTimer();

    $(tapParams.element).unbind('mouseup', clearTapTimer)
        .unbind('mouseleave', clearTapHandlers);

    /* 移动设备 */
    $(tapParams.element).unbind('touchend', clearTapTimer)
        .unbind('touchcencel', clearTapHandlers);
}

function tapEvent(aEvent, aType) {

    /* 阻止默认事件并解除冒泡 */
    aEvent.preventDefault();
    aEvent.stopPropagation();

    tapParams = {
        element: aEvent.target,
        startTime: new Date().getTime() / 1000,
        type: aType
    };

    $(tapParams.element).bind('mouseup', clearTapTimer)
        .bind('mouseleave', clearTapHandlers);

    /* 移动设备 */
    $(tapParams.element).bind('touchend', clearTapTimer)
        .bind('touchcencel', clearTapHandlers);

    changeNumber();
}

function changeNumber() {

    var currentDate = new Date().getTime() / 1000;
    var intervalTime = currentDate - tapParams.startTime;


    /* 根据长按的时间改变数值变化幅度 */
    if (intervalTime < 1) {
        intervalTime = 0.5;
    }
    var secondCount = intervalTime * 10;
    if (intervalTime == 3) {
        secondCount = 50;
    }
    if (intervalTime >= 4) {
        secondCount = 200;
    }

    var numberElement = $('.number');
    var currentNumber = parseInt(numberElement.html());

    if (tapParams.type == 'increment') {
        currentNumber += 1;
    } else if (tapParams.type == 'decrement') {
        currentNumber -= 1;
    }
    
    if(currentNumber<=30){
    	numberElement.html(30)
    }else if(currentNumber>=600){
    	numberElement.html(600)
    }else{
    	numberElement.html(currentNumber)
    }
    tapParams.timer = setTimeout('changeNumber()', 1000 / secondCount);
}



