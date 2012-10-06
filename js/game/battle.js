function Battle(){
	this.round = 0;
	this.battlePage = {type:'battle',title:'การประลองยุทธ'};
	this.refresh = true;
	this.enemy = null;
	this.refresher = null;
	this.xhr = null;
	this.roundNumber = 0;
	this.end = false;
	this.me = null
	this.playSound = function(filename){
	 	soundHandle = document.getElementById('battleHandle');
		soundHandle.src = 'sound/'+filename+'.ogg';
		soundHandle.loop = false;
		soundHandle.play();
	}
	this.initBattle = function(){
		//pauseGame(); // Stop refresh game.
		waitForBattle = false;
		this.openBattleBox();
		this.me = new Object();
		this.me.pulse = me.character_model.character_pulse;
		this.me.max_pulse = me.character_model.character_max_pulse;
		this.me.soul = me.character_model.character_soul;
		this.me.max_soul = me.character_model.character_max_soul;
		//this.enemy = new Object();
		this.enemy.pulse = ((battle.enemy.character_pulse)? battle.enemy.character_pulse : battle.enemy.monster_pulse);
		this.enemy.max_pulse = this.enemy.pulse;
		//loadPage(this.battlePage,function(){$("#battleResult").mCustomScrollbar()});	
		//action('battle',null,this.refreshBattle);
				
	}
	this.refreshBar  = function(){
		$('#battle_info #my_info .powerBar .pulse .indicator').animate({'width':(battle.me.pulse/battle.me.max_pulse*100)+'%'},'slow');
		$('#battle_info #my_info .powerBar .soul .indicator').animate({'width':(battle.me.soul/battle.me.max_soul*100)+'%'},'slow');
		$('#battle_info #enemy_info .powerBar .pulse .indicator').animate({'width':(battle.enemy.pulse/battle.enemy.max_pulse*100)+'%'},'slow');
	}
	this.openBattleBox = function(data){
		$.fancybox.open({
	        //type:'html'
        type:'ajax'
        
        ,modal:true
        //,content:pageHTML[page.type]
        ,href:'pages/battle.php'
			,title:'ต่อสู้กับ '+((battle.enemy.character_name)? battle.enemy.character_name : battle.enemy.monster_name)
			,autoSize:true
			,afterShow : function(){
				$("#battleResult").mCustomScrollbar();
				battle.refreshBar();
				battle.refreshing();
				$('#battle_info #my_info .name').html(me.character_model.character_name);
				$('#battle_info #my_info .level').html(me.character_model.character_lv);
				$('#battle_info #my_info .fame').html(me.character_model.character_fame);
				$('#battle_info #enemy_info .name').html((battle.enemy.character_name)? battle.enemy.character_name : battle.enemy.monster_name);
				$('#battle_info #enemy_info .level').html((battle.enemy.character_lv)? battle.enemy.character_lv : battle.enemy.monster_lv);
				$('#battle_info #enemy_info .fame').html((battle.enemy.character_fame) ? battle.enemy.character_fame : '-');
			}
			,beforeShow : function(){
				load.close();
				pauseGame();
				playSound('battle',false);
			}
			,beforeClose : function(){
				resumeGame();
				playSound(MAP.id.substr(0,4),true);
			}
		});
	}
	
	this.refreshing = function(){
		if (!battle.end) battle.xhr = action('battle',null,battle.refreshBattle);
	}
	
	this.getBattle = function(data){
		battleHTML = $('<div class="battleRound"><div class="roundTitle">กระบวนท่าที่ <span class="roundNumber"></span></div><div class="roundDetail"><span class="attacker"></span> โจมตีด้วย <span class="skill"></span> สร้างความเสียหายได้ <span class="damage"></span></div></div>');
		battleHTML.find('.roundNumber').html(++battle.roundNumber);
		battleHTML.find('.roundDetail').addClass((data.id == me.id)? 'mine' : 'enemy').addClass(data.type);
		battleHTML.find('.attacker').html((data.id == me.id)? me.name : (battle.enemy.character_name)? battle.enemy.character_name : battle.enemy.monster_name);
		battleHTML.find('.skill').html(data.name+'['+data.lv+']');
		battleHTML.find('.damage').html(data.dmg);
		if (data.dmg != 'miss') {
			if (data.id == me.id){
				battle.enemy.pulse -= data.dmg;
			} else {
				battle.me.pulse -= data.dmg
			}
			battle.playSound('atk');
			battle.refreshBar();
		} else if (data.dmg == 'miss') battle.playSound('miss');
		
		//if ($("#battleResult.mCustomScrollbar").length > 0) {
			battleHTML.appendTo('#battleResult .mCSB_container');
			$("#battleResult").mCustomScrollbar('update');
			$("#battleResult").mCustomScrollbar("scrollTo","bottom");
		/*} else {
			battleHTML.appendTo('#battleResult');
			$("#battleResult.mCustomScrollbar").mCustomScrollbar();
		}*/
		
	}
	this.endMessage = function(winner){
		if (winner === true){
			//You win.
			$('#battleResult .mCSB_container').append('<hr/><div class="text-center winner-text">คุณเอาชนะคู่ต่อสู้ได้!!</div>');
			battle.playSound('winner');
		} else if (winner === false){
			$('#battleResult .mCSB_container').append('<hr/><div class="text-center loser-text">คุณได้พ่ายแพ้ให้แก่คู่ต่อสู้!!</div>');
			battle.playSound('loser');
		}
		
		
	}
	this.refreshBattle = function(response){
		battle.result(response);
		if (battle.refresh) battle.refresher = setTimeout(battle.refreshing,1000);		
	}
	this.disableButton = function(){
		$('#attack_button').attr('disabled',true);
	}
	this.enableButton = function(){
		$('#attack_button').removeAttr('disabled');
	}
	this.attack = function(skill_id){
		if (!battle.end) {
			action('battle',{skill:skill_id},this.result);
			this.disableButton();
			setTimeout(battle.enableButton,me.character_model.character_atk_delay*1000);
		}
	}
	
	this.exp = function(response){
		expHTML = $('<div/>').html('คุณได้รับค่าประสบการณ์ '+response+'').addClass('text-center');
		$('#battleResult .mCSB_container').append(expHTML);
		//console.log(response);
	}
	
	this.drop = function(response){
		dropHTML = $('<div/>').html('ได้รับไอเท็ม').addClass('text-center');
		dropItem = $('<div/>').addClass('item-drop').appendTo(dropHTML);
		$.each(response, function(index,value) {
			dropItem.append('<img class="item-icon-drop" src="img/item/'+value.id+'.png" />x'+value.count+'   ');
		});
		//console.log(response);
		$('#battleResult .mCSB_container').append(dropHTML);
	}
	
	this.result = function(response){
		if (response.result) {
			$.each(response.result, function(index,round) {
				if (round.dmg) battle.getBattle(round);
				if (index == 'win'){
					battle.xhr.abort();
					battle.refresh = false;
					battle.endMessage(round);
					battle.end = true;
					//console.log(round);
				} 
				if (index == 'exp')	battle.exp(round);
				if (index == 'item_drop') battle.drop(round);
				if (index == 'lvup') {
					lvupHTML = $('<div/>').html('ระดับของคุณได้เพิ่มขึ้น!!').addClass('text-center').css({'text-decoration':'underline','color':'#00f'}).click(function(){menu('status')});
					$('#battleResult .mCSB_container').append(lvupHTML);
				}
				
			});
			if (battle.end) $('#battleResult .mCSB_container').append('<div class="text-center close-battle" onclick="$.fancybox.close();$(this).remove();">ปิดหน้าต่าง</div>');
			$("#battleResult").mCustomScrollbar('update');
			$("#battleResult").mCustomScrollbar("scrollTo","bottom");
		}
	}
	
	this.endBattle = function(){
		resumeGame(); // Resume refresh game.
		battle = null;
	}
}
