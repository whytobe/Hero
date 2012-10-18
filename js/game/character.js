var CHAR = {
	moveRange : 8,											//	Offset of movement.
	moveDelay : 250,											//	Move delay in millisecond.
	moveStep : [0,1,2,1],									//	Array movement step for sprite refer.
	size : 32,													//	Character size in width and height.
	sprite : [[0,1,2],[3,4,5],[6,7,8],[9,10,11]]	,	//	Character sprint in each angle.
	direction : {'UP':0,'DOWN':1,'LEFT':2,'RIGHT':3},
	offsetTop : $('#gameCanvas').offset().top,
	offsetLeft : $('#gameCanvas').offset().left,
}



function Character(character_model,isMe){
	// Setting Character Data.
	this.character_model = character_model;
	this.core = this;
	this.id = character_model.character_id;
	this.position = character_model.map_id.substr(7);
	this.updatePosition = this.position;
	this.name = character_model.character_name;
	this.type = character_model.character_type;
	this.offset = offsetFromPosition(this.position);
	this.direction = CHAR.direction.DOWN;
	this.step = 1;
	this.pathWay = null;
	this.currentPosition = null;
	this.moveStep = 1;
	this.active = true;
	this.skill = null;
	console.log('Inittial Character : '+this.name +' @position : '+this.position);
	
	// Prepare Character Model.
	this.isMe = (typeof isMe !== 'undefined')? isMe : false;
	
	this.model = (this.isMe)? $('<div class="Character me"/>') : $('<div class="Character"/>');
	if (this.type != 99){
		this.model.css({'background-image':'url(img/char/char_'+this.type+'.png)'});	
	} else {
		this.model.css({'background-image':'url(img/char/'+this.type+'.gif)'});
		this.model.addClass('gm');
	}
	
	//this.model = $('<div id="char_'+this.id+'" class="Character"/>');
	this.model.css({
		top : this.offset.top + 'px',
		left : this.offset.left + 'px'
	})
	
	this.model.attr('character_id',this.id);
	
	if (!this.isMe){
		this.contextMenu = $('<ul id="context_'+this.id+'" class="contextMenu"/>');
		$('<li/>').addClass('name').append($('<a/>').attr('href','#name').html(this.name)).appendTo(this.contextMenu);
		$('<li/>').addClass('active').append($('<a/>').attr('href','#active').html(this.character_model.character_active)).appendTo(this.contextMenu);
		/*$('<li/>').addClass('addfriend separator').append($('<a/>').attr('href','#addfriend').html('เพิ่มเป็นเพื่อน')).appendTo(this.contextMenu);*/
		$('<li/>').addClass('request separator').append($('<a/>').attr('href','#request').html('ท้าประลอง')).appendTo(this.contextMenu);
		this.contextMenu.appendTo($('#contextCanvas'));
		//this.model.contextmenu(function(){console.log('context event')});
		this.model.contextMenu({
						menu: 'context_'+this.id
					}, function(request, el, pos) {
						console.log('showContextMenu');
						switch(request){
							case 'request' :
								load.update('นายน้อยกรุณารอสักครู่,<br/> ข้าน้อยกำลังส่งคำร้องไปยังคู่ต่อสู้<br/><br/><button id="cancleRequest" onclick="refreshData.battle = new Object();refreshData.battle.response = false;load.close();requestBattle = false;">ยกเลิก</button>',{button:false});
								refreshData.battle = new Object();
								refreshData.battle.request = new Object();
								refreshData.battle.request.character_id = $(el).attr('character_id');
							break;
						}
						//action(request,{battle:{character_id:}},handle); 
					});
	} else {
		refreshUserBar(this.character_model);
	}
	this.refreshContextMenu = function(){
		if (typeof this.contextMenu !== 'undefined') this.contextMenu.find('.active a').html(this.character_model.character_active);
	}
	
	//this.refreshContextMenu();
	
	//Setting Character's Name;
	this.modelName = $('<div class="name"/>').html(this.name);
	this.model.append(this.modelName);
	this.model.hide().appendTo('#charCanvas').fadeIn();
	//$('#charCanvas').append(this.model.hide().fadeIn());

	this.setDirection = function(inputDirection){
		this.direction = CHAR.direction[inputDirection];
		this.setSprite();
	};
	
	this.setStep = function(inputStep){
		this.step = inputStep;
		this.setSprite();
	}
	
	this.setSprite = function(){
		this.model.css('background-position','-'+((this.direction*CHAR.size*3)+(this.step*CHAR.size))+'px 0');
	}
	this.chat = function(text,time){
		this.model.find('.chat').remove();
		chatText = $('<span class="chat '+((this.id == me.id) ? 'mine' : '')+'"><table><tr><td nowrap>'+text+'</td></tr></table></span>');
		chatText.appendTo(this.model).delay(5000).fadeOut(function(){$(this).remove()});
		timeText = time.toLocaleTimeString()
		chatList = $('<div '+((this.id == me.id) ? 'class="mine"' : '')+'/>').html('['+timeText+'] '+this.name+' : '+ text );
		chatList.appendTo('#chat_content .mCSB_container').delay(60000).fadeOut(function(){$(this).remove()});
		$('#chat_content').mCustomScrollbar('update');
		$('#chat_content').mCustomScrollbar("scrollTo","bottom");
	}
	this.clear = function(){
		this.model.fadeOut('slow',function(){$(this).remove()});
		if (typeof this.contextMenu !== 'undefined') this.contextMenu.remove();
	}
	
	this.move = function(target){
		var mov = this.core;
		mov.model.clearQueue();
		mov.model.stop();
		mov.moveStep = 1;
		mov.currentPosition = positionFromOffset(mov.model.position());
		
		if (typeof target !== 'undefined' && target != mov.currentPosition){
			mov.pathWay = calcWay(mov.currentPosition,mov.currentPosition,target).split('-');
			mov.updatePosition = mov.pathWay[mov.pathWay.length -1];
			//console.log(mov.pathWay);
			switch(mov.pathWay[mov.moveStep] - mov.pathWay[mov.moveStep-1]){
				case -30 : mov.setDirection('UP');break;
				case 30 : mov.setDirection('DOWN');break;
				case -1 : mov.setDirection('LEFT');break;
				case 1 : mov.setDirection('RIGHT');break;
			}
			for (i=1;i<mov.pathWay.length;i++){
				var pathOffset = offsetFromPosition(mov.pathWay[i]);
				mov.model.animate({
					left : pathOffset.left +'px',
					top : pathOffset.top +'px',
					percent: 100
				},{
					duration :CHAR.moveDelay,
					easing : 'linear',
					step : function(){
						mov.setStep(Math.floor(this.percent/33)%3);
						//console.log( Math.floor(this.percent/33)%3 );
					},
					complete : function(){
						this.percent = 0;
						mov.position = mov.pathWay[mov.moveStep];
						if (mov.pathWay[mov.moveStep] == target){
							mov.setStep(1);
							if (mov.isMe && MAP.path[mov.position] == 2) {
								load.show();
								action('gotEvent',{position:mov.position},handle);
							}
						} else {
							switch(mov.pathWay[mov.moveStep+1] - mov.pathWay[mov.moveStep]){
								case -30 : mov.setDirection('UP');break;
								case 30 : mov.setDirection('DOWN');break;
								case -1 : mov.setDirection('LEFT');break;
								case 1 : mov.setDirection('RIGHT');break;
							}
							mov.moveStep++;
						}
					}
				});
			}
			//alert('move to '+target);
		} 
			
	};
	
}