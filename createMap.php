<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>เจ้ายุทธภพออนไลน์ - สุดยอดคัมภีร์และอาวุธในตำนานที่เหล่าผู้กล้าต่อสู้เพื่อแย่งชิงให้ได้มา เพื่อความเป็นหนึ่งในยุทธภพ</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="css/reset.css">
        <!--<link rel="stylesheet" href="css/normalize.css">-->
        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.6.1.min.js"></script>
        <style>
        #pathCanvas .block{
        	margin:-1px;
			border:1px solid rgba(255,255,255,0.4);
			text-shadow:1px 1px 1px #000;
			color:#fff;
			font-size:9px;
		}
		#pathCanvas .block.X{
			background-color:rgba(255,0,0,0.2);
		}
		/*#pathCanvas .block.O{
			background-color:rgba(0,255,0,0.2);
		}*/
		#pathCanvas .block.E{
			background-color:rgba(0,0,255,0.2);
		}
		
		/*#pathCanvas .block:hover{
			background:url('img/move.png') center center no-repeat transparent;
		}*/
        </style>
    </head>
    <body class="gameBG">
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
        <div id="gameCanvas">
        	<div id="mapCanvas"></div>
        	<div id="charCanvas"></div>
        	<div id="pathCanvas"></div>
        </div>
        <div id="contextCanvas"></div>

        <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>-->
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.0.min.js"><\/script>')</script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>
        <script type="text/javascript">
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
				    $.pnotify_remove_all(); // Clear all notification.
			    	//initGame(response);
				},enableCache);
			}
			
			function loadMap(){
				mapDemo($('#map_image').val());
			}
			
			path = null;
			mapSense = ['X','O','E'];
			function mapDemo(map_id){
				path = MAP.path = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				//Initial Map Canvas
				$('#mapCanvas').attr('style','background-image:url(img/map/'+map_id+'.png)');
				if ($('#map_path').val()){
					try{
						path = MAP.path = eval($('#map_path').val());
						//alert(path);
					} catch (e) {
						path = MAP.path = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
					}
				} 
				//Initial Path Canvas
				$('#pathCanvas').html(''); // Clear old canvas.
				blockCount = MAP.rowCount * MAP.columnCount;
				
				for (i=0;i<blockCount;i++){		
					var block = $('<div class="block '+mapSense[path[i]]+'" path="'+i+'"/>');
					//Add eventlistener to block for touch event.
						block.click(function(){
							//console.log('click @'+($(this).attr('path')));
							//path[$(this).attr('path'))] = ;
							path[$(this).attr('path')] = (parseInt(path[$(this).attr('path')])+1)%3;
							//$(this).html(mapSense[path[$(this).attr('path')]]+'<div class="map_num">'+$(this).attr('path')+'</div>');
							//$(this).html(mapSense[path[$(this).attr('path')]]+'<div class="map_num">'+$(this).attr('path')+'</div>');
							$(this).attr('class','block '+mapSense[path[$(this).attr('path')]]);
						});

					//block.html(mapSense[path[i]]+'<div class="map_num">'+i+'</div>');
					block.html(i);
					$('#pathCanvas').append(block);
				}
			}
			
			function getPath(){
				$('#new_path').val('['+path+']');
			}
			
			(function($){
		    $.fn.disableSelection = function() {
		        return this
		                 .attr('unselectable', 'on')
		                 .css('user-select', 'none')
		                 .on('selectstart', false);
		    };
			})(jQuery);
			//$('body').disableSelection();
			
			function setToclipboard(valToSet) {
				if (window.clipboardData && clipboardData.setData) {
					clipboardData.setData("Text", valToSet);
				}
			}
        </script>
        <div style="color:#fff;line-height:25px;">
	        <!--ชื่อแผนที่ : <input type="text" id="map_id" /> <br/>--></br/>
	        ชื่อรูปแผนที่ : <input type="text" id="map_image" /> <button onclick="loadMap();">Load Image</button><br/>
	        Old path <br/>
	        <textarea id="map_path"></textarea></br>
	        New path <br/>
	        <textarea id="new_path" onclick="setToclipboard($(this).html())"></textarea></br>
	        <button onclick="getPath()">Get path</button>
		</div>
        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. 
        <script>
            var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>-->
    </body>
</html>
