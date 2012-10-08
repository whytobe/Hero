$.getScript = function(url, callback, cache){
  $.ajax({
    type: "GET",
    url: url,
    success: callback,
    dataType: "script",
    cache: cache
  });
};
$.getScript("js/tools.js",null,true);
$.getScript("js/vendor/jquery-ui-1.8.23.custom.min.js",null,true);
$.getScript("js/jquery.mousewheel.min.js",null,true);
$.getScript("js/jquery.mCustomScrollbar.js",null,true);
$.getScript("js/jquery.contextMenu.js",null,true);
$.getScript("js/fancybox/jquery.fancybox.js?v=2.1.0",null,true);
$.getScript("js/apprise-1.5.full.js",null,true);
$.getScript("js/game/error.js",null,true);

$.getScript("js/moment.min.js",function(){$.getScript("js/th.js",function(){moment.lang('th');},true);},true);

function login(){
	load.show();
	action('memberLogin',{
		member_username:$('#member_username').val(),
		member_password:SHA1($('#member_password').val())
		},logon);
}


function logon(data){
	console.log(data);
	if (!data.error){
		if (data.newCharacter == true){
			page = new Object();
			page.url = 'newCharacter.php';
			page.title ='สร้างตัวละคร';
			openPage(page,null);
		} else {
			parent.location.href = 'main.html';
		}
	} else {
		console.log(response.error );
		load.show('เกิดข้อผิดพลาด! ชื่อผู้ใช้ และ/หรือรหัสผ่านไม่ถูกต้อง<br/> กรุณาลองใหม่อีกครั้ง<br/>');
		unLoad();
	}
}


$(document).ready(function(){
	$('#login_button').click(login);
});

