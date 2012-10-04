function showStatus(response){
	unLoad();
	Indicator('pulse',response.character_pulse,response.character_max_pulse);
	Indicator('soul',response.character_soul,response.character_max_soul);
	Indicator('exp',response.character_exp,response.character_max_exp);
	$.each(response, function(index,value) {
		Label('#stat_info .'+index,value);
	});
	me.character_model.character_atk_delay = response.character_atk_delay;
	me.character_model.character_matk_delay = response.character_matk_delay;
	checkPoint = ["character_str","character_agi","character_vit","character_int","character_dex","character_luk"];
	$.each(checkPoint, function(index, value) {
		if (Math.ceil($('#stat_info span.'+value).text()/10) > response.character_status_point) 
			$('#stat_info span.'+value).next('.addStat').remove();	  
	});
	$('.addStat').unbind('click').bind('click',function(){
		preLoad('.fancybox-wrap');
		console.log('up : '+$(this).attr('status'));
		action('addPoint',{addPoint:$(this).attr('status')},handle);
		/*refreshData.status = new Object();
		refreshData.status.addPoint = ;*/
		//action('upStatus',{status:$(point).attr('status')},)
	});
}


