function Battle(){
	this.round = 0;
	this.battlePage = {url:'battle.php',title:'การประลองยุทธ'};
	this.refresh = true;
	this.enemy;
	this.refresher = null;
	this.initBattle = function(){
		pauseGame(); // Stop refresh game.
		waitForBattle = false;
		loadPage(this.battlePage);	
		action('battle',null,this.refreshBattle);
	}
	
	this.refreshBattle = function(response){
		if (response){
			if (typeof response.result !== 'undefined') {
				$.each(response.result, function(index,round) {
					if (round !== true && round !== false){
						if ($round.id == me.id){
							//My Attack;
						} else {
							//Enemy Attack
						}
						$('#battleResult').append('<pre>'+JSON.stringify(round)+'</pre>');	
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
					$('#battleResult').append('<pre>'+JSON.stringify(round)+'</pre>');	
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
