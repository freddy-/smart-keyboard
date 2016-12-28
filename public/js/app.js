
$(function(){
	var $listaBotoesFuncao = $(".botoes-f div");
	for (var i = 0; i < 12; i++) {
		$listaBotoesFuncao.append('<button type="button" funcao="f' + (i + 1) + '" >F' + (i + 1) + '</button>');
	};

	$(".botoes-f button").click(function(event){
		event.preventDefault();
		var funcao = $(this).attr("funcao");
		sendFunctionKey(funcao);
	});

	$(".enter").click(function(event){
		event.preventDefault();
		sendEnter();
	});

	$(".clear").click(function(event){
		event.preventDefault();
		sendClear();
	});

	$(".ctrl-a").click(function(event){
		event.preventDefault();
		sendCtrlA();
	});

	var trackPad = document.getElementsByClassName("track-pad")[0];
	var trackPadScroll = document.getElementsByClassName("track-pad-scroll")[0];

	// create a simple instance
	// by default, it only adds horizontal recognizers
	var tp = new Hammer(trackPad);
	var scroll = new Hammer(trackPadScroll);
	
	// let the pan gesture support all directions.
	// this will block the vertical scrolling on a touch-device while on the element
	tp.get('pan').set({ direction: Hammer.DIRECTION_ALL });
	scroll.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

	var oldX = 0, oldY = 0;

	// listen to events...
	tp.on("panleft panright panup pandown", function(ev) {
	  	console.log(ev.deltaX);
	  	console.log(ev.deltaY);

	  	var newX, newY;

	  	if (ev.deltaX > oldX) {
	  		newX = ev.deltaX;
	  	}else if (ev.deltaX < oldX) {
	  		newX = ev.deltaX;
	  	}else {
	  		newX = 0;
	  	}

	  	if (ev.deltaY > oldY) {
	  		newY = ev.deltaY;
	  	}else if (ev.deltaY < oldY) {
	  		newY = ev.deltaY;
	  	}else {
	  		newY = 0;
	  	}

	  	oldX = newX;
	  	oldY = newY;

	  	sendMousePosition(newX / 8, newY / 8 );
	});

	var lastDir;
	var delayScroll = 0;

	scroll.on("panup", function(ev){
		if (lastDir === "up") {
			if (delayScroll >= 3) {
				delayScroll = 0;
				scrollMouse("up");	
			}else{
				delayScroll++;
			}
		}else{
			lastDir = "up"
			delayScroll = 0;
		}					
	});

	scroll.on("pandown", function(ev){
		if (lastDir === "down") {
			if (delayScroll >= 3) {
				delayScroll = 0;
				scrollMouse("down");	
			}else{
				delayScroll++;
			}
		}else{
			lastDir = "down"
			delayScroll = 0;
		}
	});

	tp.on("tap", function(){
		sendMouseClick();
	});

});

function scrollMouse(direction){
	$.ajax({
		url: "/send/mouse/scroll/" + direction
	});
}

function sendMousePosition(dX, dY){
	$.ajax({
		type: "POST",
		url: "/send/mouse/move/",
		data: JSON.stringify({x: dX, y: dY}),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	});
}

function sendMouseClick(){
	$.ajax({
		url: "/send/mouse/click/"
	});
}

function sendFunctionKey(fkey){
	$.ajax({
		url: "/send/key/" + fkey
	});
}

function sendEnter(){
	sendText();

	$.ajax({
		url: "/send/key/enter"
	});
}

function sendText(){

	if($("input[type=text]").val().length > 0){
		$.ajax({
			type: "POST",
			url: "/send/string",
			data: JSON.stringify({string: encodeURI($("input[type=text]").val())}),
			contentType: "application/json; charset=utf-8",
			dataType: "json"
		});
		
		$("input[type=text]").val("");
	}
	
}

function sendClear(){
	$.ajax({
		url: "/send/clear"
	});
}

function sendCtrlA(){
	$.ajax({
		url: "/send/ctrla"
	});
}
