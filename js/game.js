var enableCache = false; // for debug.
var enableRefresh = true; // for refresh.
var permanotice = null;
var Char = Array();
var me = null;
$.getScript("js/vendor/jquery-ui-1.8.23.custom.min.js",loadPinesScript,enableCache);
function loadPinesScript(){
	$.getScript("js/pines/jquery.pnotify.min.js",loadMapScript,enableCache);
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
	    });
	},enableCache);
}

function handle(response){
	if (response.refresh) gotRefresh(response); // Handle event when got refresh page data.
	if (response.map) gotMap(response);  // Handle event when got map data.
	if (response.character) gotCharacter(response); // Handle event when got character data.
	if (response.me) gotMe(response); // Handle event when got me.
	if (response.page) gotPage(response); // Handle event when got page event.
}
function refreshGame(){
	action('refreshGame',{character:{position:me.updatePosition}},function(response){
		handle(response);
		if (enableRefresh) setTimeout(refreshGame,1500);
	});
}
function pauseGame(){
	enableRefresh = false;
	console.log('Game was stopped');
}
function resumeGame(){
	enableRefresh = true;
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
	$.fancybox.open({
        type:'iframe',
		iframe:{
			preload : false
		},
		href:'pages/'+response.page.url,
		title:response.page.title,
		beforeShow : load.close
	});
}


// End Handle function.


