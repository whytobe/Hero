<?php
	function getSkillFromTown(){
			
		$read = new Reader();
		$read->commandText = "select skill_id,skill_name from skill where skill_id in (select skill_id from academy where map_id = '".substr(myUser('map_id'),0,6)."') and skill_id not in (select skill_id from character_skill where character_id = ".myUser('character_id').")";
		//echo $read->commandText;
		$result = new Result();
		if ($read->hasRow())
			while($db = $read->read()){
				$result->set[skill][] = $db;
			}
		else 
			$result->set[skill] = false;
		$result->returnData();
		/*$update = new Updater();
		$update->table = 'characters';
		$update->set[character_lv] = 'character_lv + 1';
		$update->where[character_id] = myUser('character_id');
		$update->execute();
		
		$insert = new Inserter();
		$insert->table = 'characters';
		$insert->set[character_type] = '2';
		$insert->execute();
		//$insert->set[character_type] = 2;*/
		
	}
	
	function learnSkill($data){
		$read = new Reader();
		$read->commandText = "select skill_id from character_skill where skill_id = ".$data[skill_id]." and character_id = ".myUser(character_id);
		//echo $read->commandText;
		$result = new Result();
		if (!$read->hasRow()){
			$read = new Reader();
			$read->commandText = "select skill_id from academy where map_id = '".substr(myUser('map_id'),0,6)."' and skill_id = ".$data[skill_id];
			if ($read->hasRow()){
				$insert = new Inserter();
				$insert->table = 'character_skill';
				$insert->set[character_id] = myUser(character_id);
				$insert->set[skill_id] = $data[skill_id];
				$insert->execute();
				
				$result->set[notice][note][title] = 'ยินดีด้วย !!!';
				$result->set[notice][note][description] = 'ท่านได้เรียนวิชาสำเร็จแล้ว';
				$result -> returnData();
			} else {
				$result = new Result();
				$result->errorCode(7002);
			}
			getSkillFromTown();
		}else{
			$result = new Result();
			$result->errorCode(7001);
		}
		//$insert->set[character_type] = 2;*/
	}
?>