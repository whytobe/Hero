<?php
    
?>
<div style="width:800px;height:600px;">
	<!--<div>การต่อสู้ระหว่าง <span id="myCharacter"></span> กับ .... <span id="enemy"></span> </div>-->
	<div id="battle_info">
		<div id="my_info">
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
		<div id="battle_stage">
			
		</div>
		<div id="enemy_info">
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
	<div id="battleResult" class="scrolling" style="padding:10px;height:300px;border:1px solid #FFA81E ;border-radius: 10px;">
		
	</div>
	<button id="attack_button" onclick="battle.attack(0)">attack</button>
	<audio id="battleHandle" style="display: none;"></audio>

</div>