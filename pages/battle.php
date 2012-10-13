<?php
    
?>
<div style="width:800px;height:600px;" id='battle_box'>
	<div id="battle_info">
		<div id="my_info">
			<div class="myEffect"></div>
			<div class="photo">player / monster img</div>
			<div class="powerBar">
				<span class='pulse long' ><div class="pulse_indicator indicator" ></div></span>
				<span class='soul long' ><div class="soul_indicator indicator" ></div></span>
			</div>
			<hr/>
			<div>ชื่อ : <span class="name"></span></div>
			<div>ระดับ : <span class="level"></span></div>
			<div>ชื่อเสียง : <span class="fame"></span></div>
		</div>
		<div id="enemy_info">
			<div class="enemyEffect"></div>
			<div class="photo">player / monster img</div>
			<div class="powerBar">
				<span class='pulse long' ><div class="pulse_indicator indicator" ></div></span>
			</div>
			<hr/>
			<div>ชื่อ : <span class="name"></span></div>
			<div>ระดับ : <span class="level"></span></div>
			<div>ชื่อเสียง : <span class="fame"></span></div>
		</div>
	</div>
	<div class="break"></div>
	<div class="skillZone"></div>
	<div id="battleResult" class="scrolling" >	
	</div>
	<audio id="battleHandle" style="display: none;"></audio>

</div>