function showMySkill(skills){
	unLoad();
	
	$.each(skills, function(index,skill) {
		skill_rows = $('#skill_info .skill_rows.prototype').clone().removeClass('prototype').show();
		skill_rows.find('.detail .name').html(skill.skill_name);
		skill_rows.find('.image').attr('style','background-image:url(img/skill/'+skill.skill_id+'.png)');
		skill_rows.find('.detail .lv').html(skill.skill_lv);
		skill_rows.find('.detail .description').html(skill.skill_description);
		//skill_rows.find('.detail .ability').html(skill.skill_ability);
		
		enemy_attr = 
		ability = skill.skill_ability;
		if (ability){
			//console.log(ability);
			if (ability.require){
				ability_require = $("<div/>");
				ability_require.append('ต้องการ ')
				$.each(ability.require, function(index, value) {
					ability_require.append(index + ' : '+ JSON.stringify(value));  
				});
				ability_require.append(', ');
				skill_rows.find('.detail .ability').append(ability_require);
			}
			
			if (ability.enemy){
				if (ability.enemy.get_attr){
					ability_enemy= $("<div/>");
					ability_enemy.append('ฟื้นฟูพลังของคู่ต่อสู้ ');
					$.each(ability.enemy.get_attr, function(index, value) {
						ability_enemy.append(index + ' : '+ JSON.stringify(value));  
					});
					ability_enemy.append(', ');
					skill_rows.find('.detail .ability').append(ability_enemy);
				}
				
				if (ability.enemy.use_attr){
					ability_enemy= $("<div/>");
					ability_enemy.append('ลดพลังคู่ต่อสู้ ');
					$.each(ability.enemy.use_attr, function(index, value) {
						ability_enemy.append(index + ' : '+ JSON.stringify(value));  
					});
					ability_enemy.append(', ');
					skill_rows.find('.detail .ability').append(ability_enemy);
				}
			}
			
			if (ability.my){
				if (ability.my.get_attr){
					ability_my= $("<div/>");
					ability_my.append('ฟื้นฟูพลัง ');
					$.each(ability.my.get_attr, function(index, value) {
						ability_my.append(index + ' : '+ JSON.stringify(value));  
					});
					ability_my.append(', ');
					skill_rows.find('.detail .ability').append(ability_my);
				}
				
				if (ability.my.use_attr){
					ability_my= $("<div/>");
					ability_my.append('ใช้พลัง ');
					$.each(ability.my.use_attr, function(index, value) {
						ability_my.append(index + ' : '+ JSON.stringify(value));  
					});
					ability_my.append(', ');
					skill_rows.find('.detail .ability').append(ability_my);
				}
			}
		}
		//skill_rows.find('.detail .exp').html(skill.skill_count);
		skill.skill_count = (skill.skill_lv == "1")? parseInt(skill.skill_count) : (parseInt(skill.skill_count) - Math.pow((parseInt(skill.skill_lv)*2),3))
		if (skill.skill_lv < 10) skill_rows.find('.detail .exp .indicator').attr('title',skill.skill_count+'/'+Math.pow(((parseInt(skill.skill_lv)+1)*2),3)).animate({'width':(skill.skill_count/Math.pow(((parseInt(skill.skill_lv)+1)*2),3)*100)+'%'},{ duration: 'slow', queue: false });
		else skill_rows.find('.detail .exp').remove();
		skill_rows.find('.detail .created_date').html(skill.created_date);
		skill_rows.find('.detail .updated_date').html((skill.updated_date == '0000-00-00 00:00:00')? '-' : skill.updated_date);
		skill_rows.appendTo('#skill_info');
		
	});
	$('#skill_info').mCustomScrollbar();
}
