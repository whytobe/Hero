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
		if (!mute){
			soundHandle = document.getElementById('battleHandle');
			soundHandle.src = 'sound/'+filename+'.ogg';
			soundHandle.loop = false;
			soundHandle.play();
		} else {
			soundHandle = document.getElementById('battleHandle');
			soundHandle.src = null;
		}
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
	this.getMySkill = function(){
		$.each(me.skill, function(index,skill) {
			$('.skillZone').append('<button class="skill_button" skill_id="'+skill.skill_id+'" >'+skill.skill_name+'</button>');  
		});
		$('.skill_button').off('click').on('click',function(){
			skill_id = $(this).attr('skill_id');
			battle.attack(skill_id);
		});
		
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
        //,content:pageHTML['battle']
        ,href:'pages/battle.php'
			,title:'ต่อสู้กับ '+((battle.enemy.character_name)? battle.enemy.character_name : battle.enemy.monster_name)
			,width:830
			,height:630
			,scrolling:'no'
			,aspectRatio:true
			,autoResize:false
			,autoCenter:false
			,fitToView:false
			,afterShow : function(){
				$("#battleResult").mCustomScrollbar();
				//$("#battleResult").disableSelection();
				battle.refreshBar();
				battle.refreshing();
				
				$('#battle_info #my_info .name').html(me.character_model.character_name);
				$('#battle_info #my_info .level').html(me.character_model.character_lv);
				$('#battle_info #my_info .fame').html(me.character_model.character_fame);
				$('#battle_info #my_info .photo').css({'background-image':'url(img/member/'+me.character_model.character_id+'.png)','background-size':'100% 100%','background-position':'center center','background-repeat':'no-repeat'}).html('');
				
				$('#battle_info #enemy_info .name').html((battle.enemy.character_name)? battle.enemy.character_name : battle.enemy.monster_name);
				$('#battle_info #enemy_info .level').html((battle.enemy.character_lv)? battle.enemy.character_lv : battle.enemy.monster_lv);
				$('#battle_info #enemy_info .fame').html((battle.enemy.character_fame) ? battle.enemy.character_fame : '-');
				$('#battle_info #enemy_info .photo').css({
					'background-image':'url(img/'+((battle.enemy.character_id)? 'member/'+battle.enemy.character_id : 'monster/'+battle.enemy.monster_id)+'.png)'
					,'background-size':'100% 100%'
					,'background-position':'center center','background-repeat':'no-repeat'}).html('');
				battle.getMySkill();
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
	
	this.dmgShow = function(value,enemy,type,addition_type){
		dmgEffect = $('<div class="dmgShow"/>').html(value);
		
		if (typeof type !== 'undefined') dmgEffect.addClass(type);	
		if (typeof addition_type !== 'undefined') dmgEffect.addClass(type);
		
		if (enemy == 'enemy') dmgEffect.appendTo('#enemy_info .enemyEffect').animate({top:'-=100',opacity:'0'},2000,function(){$(this).remove()});
		else dmgEffect.appendTo('#my_info .myEffect').animate({top:'-=100',opacity:'0'},2000,function(){$(this).remove()});
	}
	
	this.getBattle = function(data){
		//<div class="roundTitle">กระบวนท่าที่ <span class="roundNumber"></span></div>
		
		//battleHTML.find('.roundNumber').html(++battle.roundNumber);
		//battleHTML.find('.roundDetail').addClass((data.id != me.id)? 'mine' : 'enemy').addClass(data.type);
		//battleHTML.find('.attacker').html((data.id != me.id)? me.name : (battle.enemy.character_name)? battle.enemy.character_name : battle.enemy.monster_name);
		
//		battleHTML.find('.damage').html(data.my.);
		console.log(data);
		if (typeof data.enemy !== 'undefined'){
			
			if (typeof data.enemy.use_attr  !== 'undefined'){
				addEffect(data.skill_id,'#enemy_info .enemyEffect');
				$.each(data.enemy.use_attr, function(index,value) {
					battleHTML = $('<div class="battleRound"><div class="roundDetail"><span class="attr"></span><span class="dmgTo"></span> จาก <span class="skill"></span> <span class="damage"></span></div></div>');
					battleHTML.find('.skill').html(data.name+'<span class="skill_level">'+data.lv+'</span>');
					battleHTML.find('.roundDetail').addClass('enemy');
					if (value != 'miss') {
						battle.enemy[index] = parseInt(battle.enemy[index]) - parseInt(value);
						battleHTML.find('.attr').html('สูญเสีย ');
						battleHTML.find('.dmgTo').html(index);
						battleHTML.find('.damage').html(value);
						if (data.attack_count) {
							for (i=0;i<data.attack_count;i++){
								setTimeout(function(){battle.dmgShow(value/data.attack_count,'enemy','use');},i*(1000/data.attack_count));
							}
						} else {
							battle.dmgShow(value,'enemy','use');		
						}
					} else {
						battleHTML.find('.roundDetail').addClass('miss');
						battleHTML.find('.attr').html('หลบการโจมตี');
						battle.dmgShow(value,'enemy','miss');
					}
					battleHTML.appendTo('#battleResult .mCSB_container').effect('highlight',2000);
				});
			}
			if (typeof data.enemy.get_attr !== 'undefined'){
				$.each(data.enemy.get_attr, function(index,value) {
					battleHTML = $('<div class="battleRound"><div class="roundDetail"><span class="attr"></span><span class="dmgTo"></span> จาก <span class="skill"></span> <span class="damage"></span></div></div>');
					battleHTML.find('.skill').html(data.name+'<span class="skill_level">'+data.lv+'</span>');
					battleHTML.find('.roundDetail').addClass('enemy');
					battleHTML.find('.dmgTo').html(index);
					battleHTML.find('.attr').html('ได้รับการฟื้นฟู ');
					battleHTML.find('.damage').html(value);
					battle.enemy[index] = parseInt(battle.enemy[index]) + parseInt(value);		
					battle.dmgShow(value,'enemy','get');		
					battleHTML.appendTo('#battleResult .mCSB_container').effect('highlight',2000);		  
				});
			}
		}
		
		if (typeof data.my !== 'undefined'){
			if (typeof data.my.use_attr !== 'undefined'){
				$.each(data.my.use_attr, function(index,value) {
					battleHTML = $('<div class="battleRound"><div class="roundDetail"><span class="attr"></span><span class="dmgTo"></span> จาก <span class="skill"></span> <span class="damage"></span></div></div>');
					battleHTML.find('.skill').html(data.name+'<span class="skill_level">'+data.lv+'</span>');
					battleHTML.find('.roundDetail').addClass('mine');
					if (index != 'soul') addEffect(data.skill_id,'#my_info .myEffect');
					if (value != 'miss') {
						//console.log(index);
						battle.me[index] = parseInt(battle.me[index]) - parseInt(value);
						battleHTML.find('.attr').html('สูญเสีย ');
						battleHTML.find('.dmgTo').html(index);
						battleHTML.find('.damage').html(value);	
						if (index != 'soul') battle.dmgShow(value,'me','use');
						else battle.dmgShow(value,'me','soulColor');			
					} else {
						battleHTML.find('.roundDetail').addClass('miss');
						battleHTML.find('.attr').html('หลบการโจมตี');
						battle.dmgShow(value,'me','miss');		
					}
					battleHTML.appendTo('#battleResult .mCSB_container').effect('highlight',2000);
				});
			}
			if (typeof data.my.get_attr !== 'undefined'){
				$.each(data.my.get_attr, function(index,value) {
					battle.dmgShow(value,'me','get');		
					battleHTML = $('<div class="battleRound"><div class="roundDetail"><span class="attr"></span><span class="dmgTo"></span> จาก <span class="skill"></span> <span class="damage"></span></div></div>');
					battleHTML.find('.skill').html(data.name+'<span class="skill_level">'+data.lv+'</span>');
					battleHTML.find('.roundDetail').addClass('mine');
					battleHTML.find('.dmgTo').html(index);
					battleHTML.find('.attr').html('ได้รับการฟื้นฟู ');
					battleHTML.find('.damage').html(value);
					battle.me[index] = parseInt(battle.me[index]) + parseInt(value);				  
					battleHTML.appendTo('#battleResult .mCSB_container').effect('highlight',2000);
				});
			}
		}
		
		
		/*
		if (data.dmg != 'miss') {
			if (data.id == me.id){
				//$('#my_info .photo').animate({left: '+=400'});//.animate({left:'-=400'},300);
				battle.enemy.pulse -= data.dmg;
				addEffect(data.skill_id,'#enemy_info .enemyEffect');
			} else {
				battle.me.pulse -= data.dmg
			}
			//battle.playSound('atk');			
		} else if (data.dmg == 'miss') battle.playSound('miss');
		if (data.use_soul) battle.me.soul -= data.use_soul;*/
		battle.refreshBar();
		$("#battleResult").mCustomScrollbar('update');
		$("#battleResult").mCustomScrollbar("scrollTo","bottom");
		
		
	}
	this.endMessage = function(winner){
		if (winner === true){
			//You win.
			$('#battleResult .mCSB_container').append('<hr/><div class="text-center winner-text">คุณเอาชนะคู่ต่อสู้ได้!!</div>');
			playSound('winner');
		} else if (winner === false){
			$('#battleResult .mCSB_container').append('<hr/><div class="text-center loser-text">คุณได้พ่ายแพ้ให้แก่คู่ต่อสู้!!</div>');
			playSound('loser');
		}
		
		
	}
	this.refreshBattle = function(response){
		battle.result(response);
		if (battle.refresh) battle.refresher = setTimeout(battle.refreshing,1000);		
	}
	this.disableButton = function(){
		$('.skill_button').attr('disabled',true);
	}
	this.enableButton = function(){
		$('.skill_button').removeAttr('disabled');
	}
	this.attack = function(skill_id){
		if (!battle.end) {
			action('battle',{skill:skill_id},this.result);
			this.disableButton();
			setTimeout(battle.enableButton,me.character_model.character_atk_delay*1000);
		}
	}
	
	this.exp = function(response){
		HTML = $('<div/>').html('คุณได้รับค่าประสบการณ์ '+response+'!!').addClass('text-center').addClass('expColor');
		$('#battleResult .mCSB_container').append(HTML);
		//console.log(response);
	}
	
	this.money = function(response){
		HTML = $('<div/>').html('คุณได้รับเงินจำนวน '+response+' ยุน!!').addClass('text-center').addClass('moneyColor');
		$('#battleResult .mCSB_container').append(HTML);
		//console.log(response);
	}
	
	this.drop = function(response){
		dropHTML = $('<div/>').html('ได้รับไอเท็ม').addClass('text-center').addClass('itemColor');
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
				if (round.my || round.enemy) 
					battle.getBattle(round);
					
				if (index == 'win'){
					battle.xhr.abort();
					battle.refresh = false;
					battle.endMessage(round);
					battle.end = true;
					//console.log(round);
				} 
				if (index == 'money') battle.money(round);
				if (index == 'item_drop') battle.drop(round);
				if (index == 'exp')	battle.exp(round);
				if (index == 'lvup') {
					lvupHTML = $('<div/>').html('ระดับของคุณได้เพิ่มขึ้น!!').addClass('text-center').css({'text-decoration':'underline','color':'#00f'}).click(function(){menu('status')});
					$('#battleResult .mCSB_container').append(lvupHTML);
					noticeHTML = '<div>ระดับของคุณได้เพิ่มขึ้น!! <br/>ไปยังหน้าสถานะตัวละคร?</div>';
					apprise(noticeHTML, {'verify':true,'textYes':'ใช่','textNo':'ช้าก่อน!'}, function(r) {
						load.close();
						if(r) menu('status');
					});
				}
				
			});
			if (battle.end) {
				$('#battleResult .mCSB_container').append('<div class="text-center close-battle" onclick="$.fancybox.close();$(this).remove();">ปิดหน้าต่าง</div>');
				$('.skillZone').remove();
			}
			$("#battleResult").mCustomScrollbar('update');
			$("#battleResult").mCustomScrollbar("scrollTo","bottom");
		}
	}
	
	this.endBattle = function(){
		resumeGame(); // Resume refresh game.
		battle = null;
	}
}
