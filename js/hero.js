
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
	    	$.getScript("js/game/poem.js",null,enableCache);
	    });
	},enableCache);
}