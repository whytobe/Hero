function Battle(){
	this.round = 0;
	this.battlePage = {url:'battle.php',title:'การประลองยุทธ'};
	this.refresh = true;
	this.enemy = null;
	this.refresher = null;
	this.roundNumber = 0;
	this.initBattle = function(){
		pauseGame(); // Stop refresh game.
		waitForBattle = false;
		loadPage(this.battlePage,function(){$("#battleResult").mCustomScrollbar()});	
		action('battle',null,this.refreshBattle);
	}
	
	this.getBattle = function(data){
		battleHTML = $('<div class="battleRound"><div class="roundTitle">กระบวนท่าที่ <span class="roundNumber"></span></div><div class="roundDetail"><span class="attacker"></span> โจมตีด้วย <span class="skill"></span> สร้างความเสียหายได้ <span class="damage"></span></div></div>');
		battleHTML.find('.roundNumber').html(++battle.roundNumber);
		battleHTML.find('.roundDetail').addClass((data.id == me.id)? 'mine' : 'enemy').addClass(data.type);
		battleHTML.find('.attacker').html((data.id == me.id)? me.name : battle.enemy.character_name);
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
	
	this.refreshBattle = function(response){
		if (response){
			if (typeof response.result !== 'undefined') {
				$.each(response.result, function(index,round) {
					if (round !== true && round !== false){
						battle.getBattle(round);
						//$('#battleResult').append('<pre>'+JSON.stringify(round)+'</pre>');	
					}
				});
				if (typeof response.result.win !== 'undefined') {
					if (response.result.win === true) { 
						$('#battleResult').append('<h3>You Win!!</h3>');
					} else if (response.result.win === false) {
						$('#battleResult').append('<h3>You Lose!!</h3>');
					}
					battle.refresh = false;
					battle.refreshher.abort();
				}
			}
		}
		if (battle.refresh) battle.refreshher = action('battle',null,battle.refreshBattle);
	}
	this.disableButton = function(){
		$('#attack_button').attr('disabled',true);
	}
	this.enableButton = function(){
		$('#attack_button').removeAttr('disabled');
	}
	this.attack = function(skill_id){
		action('battle',{skill:skill_id},this.result);
		this.disableButton();
		setTimeout(battle.enableButton,5000);
	}
	
	this.result = function(response){
		if (response.result) {
			$.each(response.result, function(index,round) {
				if (round !== true && round !== false){
					battle.getBattle(round);
					//$('#battleResult').append('<pre>'+JSON.stringify(round)+'</pre>');	
				}
			});
			
		}
		
		if (typeof response.result.win !== 'undefined') {
			if (response.result.win === true) { 
				$('#battleResult').append('<h3>You Win!!</h3>');
			} else if (response.result.win === false) {
				$('#battleResult').append('<h3>You Lose!!</h3>');	
			}
			battle.refresh = false;
			battle.refreshher.abort();
		}
	}
	
	this.endBattle = function(){
		resumeGame(); // Resume refresh game.
		battle = null;
	}
}
