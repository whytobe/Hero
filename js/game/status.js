function showStatus(response){
	unLoad();
	Indicator('pulse',response.character_pulse,response.character_max_pulse);
	Indicator('soul',response.character_soul,response.character_max_soul);
	Indicator('exp',response.character_exp,response.character_max_exp);
	$.each(response, function(index,value) {
		Label('#stat_info .'+index,value);
		if ($('#stat_info .'+index).next('.addStat').length > 0){
			$('#stat_info .'+index).parent().find('.pointInfo').remove()
			$('#stat_info .'+index).parent().append('<span class="pointInfo">('+Math.ceil(value/10)+')</span>');
		}
	});
	$('#stat_info .photo').css({'background-image':'url(http://graph.facebook.com/'+me.character_model.facebook_id+'/picture?type=square)','background-size':'100% auto','background-position':'center center','background-repeat':'no-repeat'}).html('');
	me.character_model.character_atk_delay = response.character_atk_delay;
	me.character_model.character_matk_delay = response.character_matk_delay;
	checkPoint = ["character_str","character_agi","character_vit","character_int","character_dex","character_luk"];
	$.each(checkPoint, function(index, value) {
		if (Math.ceil($('#stat_info span.'+value).text()/10) > response.character_status_point) 
			$('#stat_info span.'+value).parent().find('.addStat,.pointInfo').remove();	  
	});
	$('.addStat').off().on('click',function(){
		status = $(this).attr('status');
		preLoad('.fancybox-wrap');
		console.log('up : '+$(this).attr('status'));
		action('addPoint',{addPoint:status},handle);
		/*refreshData.status = new Object();
		refreshData.status.addPoint = ;*/
		//action('upStatus',{status:$(point).attr('status')},)
	});
}


