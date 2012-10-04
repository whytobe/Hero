function Battle(){
	this.round = 0;
	this.battlePage = {type:'battle',title:'การประลองยุทธ'};
	this.refresh = true;
	this.enemy = null;
	this.refresher = null;
	this.xhr = null;
	this.roundNumber = 0;
	this.end = false;
	this.initBattle = function(){
		//pauseGame(); // Stop refresh game.
		waitForBattle = false;
		this.openBattleBox();
		//loadPage(this.battlePage,function(){$("#battleResult").mCustomScrollbar()});	
		//action('battle',null,this.refreshBattle);
		
	}
	this.openBattleBox = function(data){
		$.fancybox.open({
	        type:'html'
	        ,modal:true
	        ,content:pageHTML[battle.battlePage.type]
			,title:battle.battlePage.title
			,autoSize:true
			,afterShow : function(){
				$("#battleResult").mCustomScrollbar();
				battle.refreshing();
			}
			,beforeShow : function(){
				load.close();
				pauseGame();
			}
			,beforeClose : resumeGame
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
			$('#battleResult .mCSB_container').append('<h1>You Win!!</h1>');
		} else if (winner === false){
			$('#battleResult .mCSB_container').append('<h1>You Lose!!</h1>');
		}
		$('#battleResult .mCSB_container').append('<button onclick="$.fancybox.close();$(this).remove();">ปิดหน้าต่าง</button>');
		$("#battleResult").mCustomScrollbar('update');
		$("#battleResult").mCustomScrollbar("scrollTo","bottom");
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
	
	this.result = function(response){
		if (response.result) {
			$.each(response.result, function(index,round) {
				if (index == 'win'){
					battle.xhr.abort();
					battle.refresh = false;
					battle.endMessage(response.result.win);
					battle.end = true;
				}
				if (round.dmg) battle.getBattle(round);
			});
			
		}
	}
	
	this.endBattle = function(){
		resumeGame(); // Resume refresh game.
		battle = null;
	}
}
