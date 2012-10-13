/**
*
*  Secure Hash Algorithm (SHA1)
*  http://www.webtoolkit.info/
*
**/
var load = new LoadInfo();
var pulse_color = "FF0000" ;
var soul_color = "486DE7";
var exp_color = "000000";
var itemColor = ['#CCCCBB','#33CCBB','#008844'];
var mute = false;
var pageHTML = {
	//<div id="preload"><div class="centerscreen"><img src="img/preload.gif" />
	'item' : '<div style="width:800px;height:500px;margin:0 auto"><div style="display:block;float:left;width:40%;"><br/><center><table cellpadding=0 cellspacing=0 border=0><tr height="30px"><td colspan=2 id="item-name"></td></tr><tr height="50px"><td id="item-img"class="midcen"></td><td id="item-mgr"class="midcen"colspan=2>จัดการไอเท็ม</td></td><tr height="120px"><td id="item-info"colspan=3>Item info</td></tr><tr><td id="gloves"class="equip-slot midcen"></td><td id="head"class="equip-slot midcen"></td><td id="garment"class="equip-slot midcen"></td></tr><tr><td id="righthand"class="equip-slot midcen"></td><td id="body"class="equip-slot midcen"></td><td id="lefthand"class="equip-slot midcen"></td></tr><tr><td id="acc1"class="equip-slot midcen"></td><td id="foots"class="equip-slot midcen"></td><td id="acc2"class="equip-slot midcen"></td></tr></table></center></div><div style="display:block;float:right;width:60%;"><br/><table cellpadding=0 cellspacing=0 border=0 width="100%"><tr><td class="item-list-head midcen use"style="background:#3cb;">ใช้งาน<td></tr><tr><td id="useItem"class="item-list use"colspan=3></td></tr><tr height="5px"></tr><tr><td class="item-list-head midcen equip"style="background:#084;">สวมใส่<td></tr><tr><td id="equipItem"class="item-list equip"colspan=3></td></tr><tr height="5px"></tr><tr><td class="item-list-head midcen unuse"style="background:#ccb;">ทั่วไป<td></tr><tr><td id="unuseItem"class="item-list unuse"colspan=3></td></tr></table></div><br style="clear:both"/></div>'
	,'status' : '<div class="divbox"id="stat_info"><div style="display:block;float:left;width:40%;"><br/><center><table cellpadding=0 cellspacing=0 border=0 width="100%"><tr height="50px"><td id="item-img"class="midcen">รูปผู้เล่น<br/>50 x 50px</td><td id="item-mgr"class="midcen"colspan=2></td></td><tr height="120px"><td id="item-info"colspan=3>อาชีพ:-<br/>ระดับ:<span class="character_lv"></span><br/>ชื่อเสียง:<span class="character_fame"></span><br/>เมือง:<span class="map_id"></span><br/>สถานะ:<span class="character_active"></span><br/>เริ่มท่องยุทธภพเมื่อ:<span class="created_date"></span><br/></td></tr><tr></table></center></div><div style="display:block;float:right;width:60%;"><table class="small"width="100%"style="text-align:center"><thead><tr height="50px"><th colspan=6 class="middle">ข้อมูลตัวละคร</th></tr></thead><tbody><tr class="height30 "><td width="10%">ชีพจร</td><td width="40%"colspan=2 style="padding:10px"><span class="pulse long"><div class="pulse_indicator indicator"></div></span></td><td width="10%">ลมปราณ</td><td width="40%"colspan=2 style="padding:10px"><span class="soul long"><div class="soul_indicator indicator"></div></span></td></tr><tr class="height30"><td>ประสบการณ์</td><td colspan=5 style="padding:10px"><span class="exp long"><div class="exp_indicator indicator"></div></span></td></tr><tr class="height30 middle"><td colspan=6><br/><hr/></td></tr><tr class="height60"><td class="str-table width1-6">แข็งแรง<br/><span class="character_str"></span><span class="addStat point"status="str">+</span></td><td class="agi-table width1-6">ว่องไว<br/><span class="character_agi"></span><span class="addStat point"status="agi">+</span></td><td class="vit-table width1-6">แข็งแกร่ง<br/><span class="character_vit"></span><span class="addStat point"status="vit">+</span></td><td class="dex-table width1-6">ชำนาญ<br/><span class="character_dex"></span><span class="addStat point"status="dex">+</span></td><td class="int-table width1-6">ฉลาด<br/><span class="character_int"></span><span class="addStat point"status="int">+</span></td><td class="luk-table width1-6">โชคชะตา<br/><span class="character_luk"></span><span class="addStat point"status="luk">+</span></td></tr><tr class="height30 middle"><td colspan=6><br/><hr/></td></tr><tr class="height20"align="left"><td colspan=2>พลังโจมตี</td><td class="character_atk"></td><td colspan=2>หน่วงเวลาโจมตี(วินาที)</td><td class="character_atk_delay"></td></tr><tr class="height20"align="left"><td colspan=2>กำลังภายใน</td><td class="character_matk"></td><td colspan=2>หน่วงเวลาผนึกปราณ(วินาที)</td><td class="character_matk_delay"></td></tr><tr class="height20"align="left"><td colspan=2>พลังป้องกัน</td><td class="character_def"></td><td colspan=2>อัตราการหลบหลีก</td><td class="character_flee"></td></tr><tr class="height20"align="left"><td colspan=2>ความแม่นยำ</td><td class="character_hit"></td><td colspan=2>ดวง[+-25%]</td><td class="character_lucky"></td></tr><tr class="height20"align="left"><td colspan=2>Drop rate(%)</td><td class="character_drop_rate">+%</td><td colspan=2>Status point คงเหลือ</td><td class="character_status_point"></td></tr></tbody></table></div><br style="clear:both"/></div>'
	,'battle' : '<div style="width:800px;height:600px;"id="battle_box"><div id="battle_info"><div id="my_info"><div class="myEffect"></div><div class="photo">player/monster img</div><div class="powerBar"><span class="pulse long"><div class="pulse_indicator indicator"></div></span><span class="soul long"><div class="soul_indicator indicator"></div></span></div><hr/><div>ชื่อ:<span class="name"></span></div><div>ระดับ:<span class="level"></span></div><div>ชื่อเสียง:<span class="fame"></span></div></div><div id="battle_stage"></div><div id="enemy_info"><div class="enemyEffect"></div><div class="photo">player/monster img</div><div class="powerBar"><span class="pulse long"><div class="pulse_indicator indicator"></div></span></div><hr/><div>ชื่อ:<span class="name"></span></div><div>ระดับ:<span class="level"></span></div><div>ชื่อเสียง:<span class="fame"></span></div></div></div><div class="break"></div><div class="skillZone"></div><div id="battleResult"class="scrolling"style="padding:10px;height:300px;border:1px solid #FFA81E ;border-radius: 10px;"></div><audio id="battleHandle"style="display: none;"></audio></div>'
}
$('.hideButton').click(toggleUserBar);

function playSound(filename,loop){
	soundHandle = document.getElementById('soundHandle');
	soundHandle.src = 'sound/'+filename+'.ogg';
	if (!mute) {
		soundHandle.loop = (typeof loop !== undefined)? loop : false;
		soundHandle.play();
	}
}
$(document).ready(function(){
	$('.muteButton').click(function(){
		muteIcon = $(this).children();
		soundHandle = document.getElementById('soundHandle');
		if (mute) {
			soundHandle.play();
			muteIcon.attr('class','ui-icon ui-icon-volume-on');
		} else {
			soundHandle.pause();
			muteIcon.attr('class','ui-icon ui-icon-volume-off');
		}
		mute = !mute;
	});
});
function toggleUserBar(){
	if ($('#user_bar').css('bottom') == '0px'){
		$('#user_bar').animate({'bottom':'-50px'},function() {$('.hideButton').html('<span class="ui-icon ui-icon-triangle-1-n"></span>');});
		$('.hideButton').animate({'margin-top':'-15px'});
	} else {
		$('#user_bar').animate({'bottom':'0px'},function() {$('.hideButton').html('<span class="ui-icon ui-icon-triangle-1-s"></span>1');});
		$('.hideButton').animate({'margin-top':'35px'});
	}
}
function Indicator(type,now,max){
	indColor = 0;
	indHead = "";
	switch(type){
		case "pulse":
			indColor = pulse_color;
			indHead = "ชีพจร";
			break;
		case "soul":
			indColor = soul_color;
			indHead = "ลมปราณ";
			break;
		case "exp":
			indColor = exp_color;
			indHead = "ค่าประสบการณ์";
			break;
	}
	$('.'+type+'_indicator').animate({'width':(now/max*100)+'%'},'slow').attr('title',indHead+" : "+now+"/"+max+" ("+(now/max*100).toFixed(0)+"%)");
	//$('.'+type+'_indicators').animate({'width':(now/max*100)+'%'},'slow').attr('title',indHead+" : "+now+"/"+max+" ("+(now/max*100).toFixed(0)+"%)");
	//$('#'+type).html("<div style='width:"++"%;height:100%;background-color:#"+indColor+"' title='"+indHead+" : "+now+"/"+max+" ("+(now/max*100).toFixed(0)+"%)'></div>");
}
function Label(data,val){
	$(data).html(val);       
}
function preLoad(obj){
	loader = $("<div class='preload'><div class='centerscreen'><img src='img/preload.gif' /><br /> กรุณารอสักครู่....</div></div>").hide().fadeIn();
	if (obj == "all"){
		$(".gameBG").append(loader);
	} else {
		$(obj).append(loader);	
	}
}

function isNumber(n) {
  return (!isNaN(parseFloat(n)) && isFinite(n))? Math.floor(n) : false;
}

function unLoad(){
	$(".preload").fadeOut(function(){$(this).remove();});
}

function msgBox(text,cb){
	$('.appriseOverlay,.appriseOuter').remove();
	apprise('<div class="noteTitle">'+text.title+'</div><div class="noteDescription">'+text.description+'</div>',(typeof cb !== 'undefined')? cb : null);
}

function LoadInfo(){
	this.show = function(){
		if ($('.appriseOverlay,.appriseOuter')){
			$('.appriseOverlay,.appriseOuter').remove();	
		}
		apprise('นายน้อย, กรุณารอสักครู่',{button:false});
	}
	
	this.update = function(text,option){
		$('.appriseOverlay,.appriseOuter').remove();
		if (typeof option !== 'undefined')	apprise(text,option);
		else apprise(text);
	}
	
	this.close = function(){
		appriseClose();
	}
 }
 function loadPage(page,callback,isModal){
 	isModal = (typeof isModal === 'undefined')? false : isModal;
 	$.fancybox.open({
        type:'ajax',
        modal:isModal,
		href:'pages/'+page.url,
		title:page.title,
		scrolling:'no'
		,width:830
		,height:630
		,scrolling:'no'
		,aspectRatio:true
		,autoResize:false
		,autoCenter:false
		,fitToView:false,
		beforeShow : load.close,
		afterShow : callback
	});
 }
 function openPage(page){
 	$.fancybox.open({
        type:'iframe'
        ,width:830
			,height:630
			,scrolling:'no'
			,aspectRatio:true
			,autoResize:false
			,autoCenter:false
			,fitToView:false,
		iframe:{
			preload : false,
			scrolling : false
		},
		href:page.url,
		title:page.title
		,beforeShow : function(){
			load.close();
			if (typeof pauseGame !== 'undefined') pauseGame();
			//pauseGame();
		}
		,beforeClose : function(){
			if (typeof resumeGame !== 'undefined') resumeGame();
		}
	});
 }
 
function SHA1 (msg) {
 
	function rotate_left(n,s) {
		var t4 = ( n<<s ) | (n>>>(32-s));
		return t4;
	};
 
	function lsb_hex(val) {
		var str="";
		var i;
		var vh;
		var vl;
 
		for( i=0; i<=6; i+=2 ) {
			vh = (val>>>(i*4+4))&0x0f;
			vl = (val>>>(i*4))&0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};
 
	function cvt_hex(val) {
		var str="";
		var i;
		var v;
 
		for( i=7; i>=0; i-- ) {
			v = (val>>>(i*4))&0x0f;
			str += v.toString(16);
		}
		return str;
	};
 
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	};
 
	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;
 
	msg = Utf8Encode(msg);
 
	var msg_len = msg.length;
 
	var word_array = new Array();
	for( i=0; i<msg_len-3; i+=4 ) {
		j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
		msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
		word_array.push( j );
	}
 
	switch( msg_len % 4 ) {
		case 0:
			i = 0x080000000;
		break;
		case 1:
			i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
		break;
 
		case 2:
			i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
		break;
 
		case 3:
			i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
		break;
	}
 
	word_array.push( i );
 
	while( (word_array.length % 16) != 14 ) word_array.push( 0 );
 
	word_array.push( msg_len>>>29 );
	word_array.push( (msg_len<<3)&0x0ffffffff );
 
 
	for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 
		for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
		for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
 
		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;
 
		for( i= 0; i<=19; i++ ) {
			temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=20; i<=39; i++ ) {
			temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=40; i<=59; i++ ) {
			temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=60; i<=79; i++ ) {
			temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;
 
	}
 
	var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
 
	return temp.toLowerCase();
 
}

function checkError(response){
	if (response.error){
		if (response.error.code =='1001' || response.error.code =='1002' || response.error.code =='1003')
		console.log(response.error );
		load.update('เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง<br/>'+ errorMsg[response.error.code].title  +', '+errorMsg[response.error.code].description);
		unLoad();
		return false;
	} else {
		return response;
	}
}

function action(inputAction,inputData,callback){
	return $.post('lib/action.php',{action:inputAction,data:inputData},function(response){
		if (response){
			if (response.error){
				if (response.error.code == 1001 || response.error.code == 1002 || response.error.code == 1003) {
					$('.appriseOverlay,.appriseOuter').remove();
					apprise('เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง<br/>'+ errorMsg[response.error.code].title  +', '+errorMsg[response.error.code].description,{'verify':true}, function(r) {
						if (r) {
							var index = location.href.lastIndexOf("/") + 1;
							var filename = location.href.substr(index);
							if (filename != 'index.html')location.href = 'index.html';
							else {
								$('#member_password').html('').select().focus();							
							}
	 
						}else{
							window.close();
						}
					});
				} else {
					load.update('เกิดข้อผิดพลาด! กรุณาลองใหม่อีกครั้ง<br/>'+ errorMsg[response.error.code].title  +', '+errorMsg[response.error.code].description);
				}
				console.log(response.error );
				unLoad();
			} else {
				if (typeof callback !== 'undefined') callback(response);
			}
		}
	},'json');
}
function addEffect(effect_id,effect_target){
	target = '#battle_stage';
	if (typeof effect_target !== 'undefined') target = effect_target;
	effect_name = 'effect_'+Math.floor(Math.random()*1000);
	effect_model = $('<div id="'+effect_name+'"/>');
	$(target).prepend(effect_model);
	
	var flashvars = {
'effect_name' : effect_name
	};
	  var params = {
 loop: "false",
 wmode: 'transparent'
	  };
	  var attributes = {
id:effect_name,
name:effect_name,
class:'effect'
	  }
	  ; 
	swfobject.embedSWF("effect/"+effect_id+".swf", effect_name, "330", "200","9.0.0", "expressInstall.swf", flashvars, params, attributes);
}

function removeMovie(movieId){
	console.log('Effect remove : '+movieId);
	$('#'+movieId).remove();
}

function getFlashMovie(movieName) {
    var isIE = navigator.appName.indexOf("Microsoft") != -1;
    return (isIE) ? window[movieName] : document[movieName];
}

function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; }
(function($){
    $.fn.disableSelection = function() {
    return this
             .attr('unselectable', 'on')
             .css('user-select', 'none')
             .on('selectstart', false);
};
})(jQuery);
$('*').contextmenu(function(){return false;});
