var enableCache = false; // for debug.
var enableRefresh = true; // for refresh.
var refreshXHR; // the XHR refresher.
var refreshTimer; // the refresher timeer/
var permanotice = null;
var requestBattle = null;
var Char = Array();
var me = null;
var refreshData = new Object();
var waitForBattle = false;
var battle = null;
//$.getScript("js/vendor/jquery-ui-1.8.23.custom.min.js",loadPinesScript,enableCache);
//function loadPinesScript(){
	$.getScript("js/pines/jquery.pnotify.min.js",loadErrorScript,enableCache);
//}
function loadErrorScript(){
	$.pnotify.defaults.styling = "jqueryui";
	$.pnotify.defaults.history = false;
    if (permanotice) {
    	permanotice.pnotify_display();
    } else {
   	 	permanotice = $.pnotify({
		    title: 'Loading Error Helper....',
		    text: 'Error Helper function is loading..',
		    type: 'info',
			//nonblock: true,
			animate_speed: 'fast',
		    hide: false,
		    closer: false,
		    sticker: false
	    });
    }
	$.getScript("js/game/error.js",loadMapScript,enableCache);
}
function loadMapScript(){
	$.pnotify.defaults.styling = "jqueryui";
	$.pnotify.defaults.history = false;
    if (permanotice) {
    	permanotice.pnotify_display();
    } else {
   	 	permanotice = $.pnotify({
		    title: 'Loading Map....',
		    text: 'Map function is loading..',
		    type: 'info',
			//nonblock: true,
			animate_speed: 'fast',
		    hide: false,
		    closer: false,
		    sticker: false
	    });
    }
	$.getScript("js/game/map.js",loadCharacterScript,enableCache);
}
function loadCharacterScript(){
	if (permanotice.pnotify_remove) permanotice.pnotify_remove();
		permanotice = $.pnotify({
		    title: 'Loading Character....',
		    text: 'Character function is loading..',
		    type: 'info',
		    //nonblock: true,
		    animate_speed: 'fast',
		    hide: false,
		    closer: false,
		    sticker: false
	    });
	$.getScript("js/game/character.js",function(){
		if (permanotice.pnotify_remove) permanotice.pnotify_remove();
    	permanotice = $.pnotify({
		    title: 'Loading Player Data....',
		    text: 'Your data is loading..',
		    animate_speed: 'fast',
		   	type: 'info',
	   		 //nonblock: true,
		    hide: false,
		    closer: false,
		    sticker: false
	    });
	    
	    action('initGame',null,function(response){
	    	$.pnotify_remove_all(); // Clear all notification.
	    	handle(response);
	    	refreshGame();
	    	$.getScript("js/game/battle.js",null,enableCache);
	    	$.getScript("js/game/item.js",null,enableCache);
	    	$.getScript("js/game/skill.js",null,enableCache);
	    	$.getScript("js/game/status.js",null,enableCache);
	    });
	},enableCache);
}

function handle(response){
	if (response.refresh) gotRefresh(response); // Handle event when got refresh page data.
	if (response.map) gotMap(response);  // Handle event when got map data.
	if (response.character) gotCharacter(response); // Handle event when got character data.
	if (response.me) gotMe(response); // Handle event when got me.
	if (response.page) gotPage(response); // Handle event when got page event.
	if (response.notice) gotNotice(response.notice); // Handle event when receive request battle.
	if (response.user_bar) refreshUserBar(response.user_bar.character);
	if (response.character_item) showItem(response.character_item); // Show item.
	if (response.item_detail) itemDetail(response.item_detail); // Show item detail.
	if (response.status) showStatus(response.status); // Show status detail.
	
	if (waitForBattle && !response.notice){
		load.update('คู่ต่อสู้ได้ปฏิเสธการต่อสู้ หรือไม่ตอบรับในเวลาที่กำหนด');
		waitForBattle = false;
		requestBattle = false;
	} 
}
function loadUserBar(){
	preLoad('#user_bar');
	refreshData.refreshUserBar = true;
}

function refreshUserBar(response){
	unLoad();
	Indicator('pulse',response.character_pulse,response.character_max_pulse);
	Indicator('soul',response.character_soul,response.character_max_soul);
	Indicator('exp',response.character_exp,response.character_max_exp);
	$.each(response, function(index,value) {
		Label('#character_info .'+index,value);  
	});
	/*Label('#character_info .character_name',response.character_name);
	Label('#character_info .character_lv',response.character_lv);
	Label('#character_info .character_fame',response.character_fame);
	Label('#character_info .character_money',response.character_money);*/
}

function refreshGame(){
	if (MAP.path[me.updatePosition]){
		refreshData.character = new Object(); 
		refreshData.character.position = me.updatePosition;
	}
	if (refreshTimer) clearTimeout(refreshTimer);
	if (refreshXHR) refreshXHR.abort();
	if (refreshData.battle) if (refreshData.battle.request) if (refreshData.battle.request.character_id) waitForBattle = true;
	refreshXHR = action('refreshGame',(refreshData)? refreshData : null,function(response){
		handle(response);
		if (enableRefresh) {
			refreshTimer = window.setTimeout(refreshGame,1500);
		}
	});
	refreshData = new Object();
}
function pauseGame(){
	enableRefresh = false;
	if (refreshTimer) clearTimeout(refreshTimer);
	if (refreshXHR) refreshXHR.abort();
	console.log('Game was stopped');
}
function resumeGame(){
	enableRefresh = true;
	loadUserBar();
	refreshGame();
	console.log('Game is running');
}

// Handle function.

function gotRefresh(response){
	load.close();
	me.clear();
	me = null;
	$.each(Char, function(index,thisChar) {	
		if (typeof thisChar !== 'undefined') {
			thisChar.clear();
				Char.splice(index,1);
		}
	}); // Set all char to inactive.
	$('.Character').remove();
	Char = Array();
}

function gotMap(response){
	mapInitial(response.map.map_id,eval(response.map.map_path));
}

function gotCharacter(response){
	if (response.character){
		//console.log('Got '+response.character.length+' characters in map');
		$.each(Char, function(index,thisChar) {	
			if (typeof thisChar !== 'undefined') thisChar.active = false;
		}); // Set all char to inactive.
		$.each(response.character, function(index,thisChar) {
			//thisChar = this;
			if (MAP.path[thisChar.map_id.substr(7)] == 1){
				if (typeof Char[thisChar.character_id] !== 'undefined'){
					//console.log('Move Character : '+thisChar.character_name+'('+thisChar.character_id+')');
					Char[thisChar.character_id].character_model.character_active = thisChar.character_active +'<div>('+moment(thisChar.character_last_active, "YYYY-MM-DD hh:mm:ss").fromNow()+')</div>';
					Char[thisChar.character_id].refreshContextMenu();
					Char[thisChar.character_id].active = true; // Set this char to active.
					Char[thisChar.character_id].move(thisChar.map_id.substr(7));
				} else {
					//console.log('Initialize Character : '+thisChar.character_name+'('+thisChar.character_id+')');
					Char[thisChar.character_id] = new Character(thisChar,false);
				}
			} /*else {
				if (Char[thisChar.character_id]) {
					Char[thisChar.character_id];
				}
			}*/
		});
		$.each(Char, function(index,thisChar) {	
			if (typeof thisChar !== 'undefined'){
				//console.log('char index : '+index+', id : '+thisChar.id);	
				if (!thisChar.active) {
					thisChar.clear();
					//Char.splice(index,1);
					delete Char[index]; 
				}
			} else {
				//Char.splice(index,1);
			}
		}); // Clear all char that inactive.
	} else if (typeof response.character === 'undefined' && typeof response.page === 'undefined' && typeof response.refresh === 'undefined'){
		$.each(Char, function(index,thisChar) {	
			if (typeof thisChar !== 'undefined') {
				thisChar.clear();
				delete Char[index];
			}
		}); // Set all char to inactive.
	}
}

function gotMe(response){
	console.log('Initialize My Character : '+response.me.character_name+'('+response.me.character_id+')');
	me = new Character(response.me,true); // Initial My Character;
}

function gotPage(response){
	openPage(response.page);
}

function noticeNote(response){
	if (response) msgBox(response);
}

function noticeBattle(notice){
	if (notice.battle.start){
		battle = new Battle();
		battle.initBattle();
		if (notice.battle.enemy) battle.enemy = notice.battle.enemy;
	} else {
		if (!waitForBattle){
			if (notice.battle.response){
				waitForBattle = true;
				if (!requestBattle){
					apprise('<span class="playerColor">'+notice.battle.name+'</span> ได้ส่งคำท้าประลองมาให้คุณ',{'verify':true, 'textYes':'ด้วยความยินดี', 'textNo':'ฝากไว้ก่อนเถอะ!!'},function(response){
						refreshData.battle = new Object();
						refreshData.battle.response = response;
						if (!response){
							load.update('บุญคุณต้องทดแทน 10 ปีล้างแค้นยังไม่สาย</br> ฮึ่ม... ฝากไว้ก่อนเถอะ');
							waitForBattle = false;
						} else {
							load.show();
						}
						requestBattle = false;
					})
					requestBattle = true;
				}
			} else if (notice.battle.request){
				waitForBattle = true;
				load.show();
			} else if (notice.battle.start) {
				battle = new Battle();
				battle.initBattle();
				if (notice.battle.enemy) battle.enemy = notice.battle.enemy;
			}
		} 
	} 
}

function gotNotice(notice){
	if (notice.battle) noticeBattle(notice);
	if (notice.note) noticeNote(notice.note);
}

// End Handle function.

function menu(type){
	page = new Object();
	page.type = type;
	switch(type){
		case 'item' :
			page.title  = 'Character Items';
			break;
		case 'status' :
			//page.url = 'status.php';
			//loadPage(page,null);
			//refreshData.getStatus = true; 
			page.title = 'Character Status';
	}
 	$.fancybox.open({
        type:'html'
        ,modal:false
        ,content:pageHTML[page.type]
		,title:page.title
		,autoSize:true
		,afterLoad : function(){
				action('menu',{menuType:type},handle);
				preLoad(".fancybox-wrap");
		}
		,beforeShow : function(){
			load.close();
			pauseGame();
		}
		,beforeClose : resumeGame
	});
	
}




