<html>
	<head>
		<link rel="stylesheet" type="text/css" href="css/main.css" />
		<link rel="stylesheet" type="text/css" href="css/game.css" />
		<script src="js/vendor/jquery-1.8.0.min.js"></script>
		<script src="js/plugins.js"></script>
		<script src="js/main.js"></script>
		<script src="js/tools.js"></script>
		<script src="js/game.js"></script>
		<script>
			function showSkill(response) {
				$('.skill_learn').html('');
				if (response.notice) msgBox(response.notice.note);
				if (response.skill) {
					$.each(response.skill, function(index, skill) {
						skillHTML = $('<li><img class="skill_photo"/> วิชา<span class="skill_name"></span></li>');
						//skillHTML.html(skill.skill_id + ' :' + skill.skill_name);
						//skillHTML.html("<img src='skill_img/" + skill.skill_id + ".png' /> " + skill.skill_name);
						skillHTML.find('img.skill_photo').attr('src', 'skill_img/' + skill.skill_id + '.png').on("click", function() {
							action('learnSkill', {
								'skill_id' : skill.skill_id
							}, showSkill);
						});
						skillHTML.find('span.skill_name').html(skill.skill_name);
						$('.skill_learn').append(skillHTML);
					});
				} else {
					$('.skill_learn').append('เราไม่มีวิชาใดจะสอนท่านแล้ว ลองออกเดินทางไปหาเพื่อนข้าที่สำนักบู๊ตึ๊ง สาขา 2 เพื่อเรียนวิชาอื่น');
				}

				unLoad();
			}

			preLoad('.skill_learn');
			action('getSkillFromTown', null, showSkill);

		</script>
		<style>
			ul.skill_learn li {
				line-height: 50px;
				vertical-align: middle;
			}
			ul.skill_learn li img {
				width: 30px;
				height: 30px;
				vertical-align: middle;
			}
		</style>
	</head>
	<body>
		<div style="border:1px solid #777;height:535px;">
			<div class="text-center head" >
				สำนักวิชา
			</div>
			<div style="float:right;width:200px;height:400px;margin:100px 20px 0;text-align:center">
				<img src="img/npc/academy.jpg" />
				<br/>
				เจ้าสำนัก
			</div>
			<div style="float: left; width: 400px; height: 400px; margin: 30px 0px 0px 20px; padding: 20px; color: rgb(119, 119, 119);">

				<div id='poem' style="font-size: 1.5em; color: rgb(116, 78, 28);text-align:center"></div>
				<br/>
				<ul class="skill_learn" style="list-style: disc;list-style-position:inside">
					สำนักบู้ลิ้ม
				</ul>
			</div>
		</div>
	</body>
</html>