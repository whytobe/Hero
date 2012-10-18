<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <link rel="stylesheet" href="css/main.css">
		<link rel="stylesheet" href="css/game.css">
		<script src="js/vendor/jquery-1.8.0.min.js"></script>
		<script src="js/plugins.js"></script>
		<script src="js/main.js"></script>
		<script src="js/tools.js"></script>
		<script src="js/game.js"></script>
		<script src="js/game/item.js"></script>
		<style type="text/css">
			#char_type{
				background-image: url("img/char/char_1.png");
			    background-position: -128px 0;
			    background-repeat: no-repeat;
			    height: 32px;
			    width: 32px;
			    display: inline-block;
		   }
		   .nav{
		   		font-size:2em;
		   		display:inline-block;
		   		cursor:pointer;
		   }
		   .character_name{
		   	padding:10px;
		   }
		</style>
	</head>
	<body>
		<table width="100%" height="550px">
			<tr><td align="center" valign="middle">
				<div>
					<div class="nav" type="prev"><</div> <div id="char_type" type=""></div> <div class="nav" type="next">></div>
				</div>
				<div class="character_name">
					ชื่อตัวละคร <input id="character_name" type="text" placeholder="กรอกชื่อตัวละคร" /> <input type="button" id="createChar" value="ตกลง"/>
				</div>
			</td></tr>
		</table>
		<script type="text/javascript">
			function changeCharacter(){
				$('#char_type').css({'background-image':'url(img/char/char_'+$('#char_type').attr('type')+'.png)'});
			}
			function prevCharacter(){
				nextChar = parseInt($('#char_type').attr('type')) -1;
				if (nextChar < 0) nextChar = 38;
				$('#char_type').attr('type',nextChar%39);
				changeCharacter();
			}
			function nextCharacter(){
				nextChar = parseInt($('#char_type').attr('type')) +1;
				if (nextChar > 38) nextChar = 0;
				$('#char_type').attr('type',nextChar%39);
				changeCharacter();
			}
			function randomCharacter(){
				$('#char_type').attr('type',Math.floor(Math.random()*39));
				changeCharacter();
			}
			$(document).ready(function(){
				parent.unLoad();
				randomCharacter();
				$('#createChar').on('click',function(){
					action('newCharacter',{character_name:$('#character_name').val(),character_type:$('#char_type').attr('type')},logon);
				});
				$('.nav').on('click',function(){
					if ($(this).attr('type') == 'prev'){
						prevCharacter();
					} else if ($(this).attr('type') == 'next'){
						nextCharacter();
					}
				});
			})
		</script>
	</body>
</html>