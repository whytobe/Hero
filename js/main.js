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
$.getScript("js/apprise-1.5.full.js",null,true);
$.getScript("js/jquery.contextMenu.js",null,true);
$.getScript("js/fancybox/jquery.fancybox.js?v=2.1.0",null,true);
$.getScript("js/moment.min.js",function(){$.getScript("js/th.js",function(){moment.lang('th');},true);},true);

function login(){
	action('memberLogin',{
		member_username:$('#member_username').val(),
		member_password:SHA1($('#member_password').val())
		},logon);
}


function logon(data){
	if (!data.error){
		location.href = 'main.html';
	} else {
		alert(data.error + '\n' +data.message);
	}
}


$(document).ready(function(){
	$('#login_button').click(login);
});
