<?php
	function battle($data){
		if ($myBattle = getBattleSession()){
			$myBattle->checkWinner();
			if (isset($data[skill])){
				$myBattle->attack($data[skill]);
			}
		}
		
	}
	
	function getBattleSession(){
		if (isset($_SESSION[BATTLE])) {
			return $result = $_SESSION[BATTLE];
		} else {
			return false;
			/*$result = new Result();
			$result->errorCode(4001);*/
		}
	}
	
	class Battle{
		var $battle; 
		//var $request;
		//var $response;
		var $delay;
		var $result;
		var $round;
		var $enemy;
		var $monster;
		var $monster_delay;
		var $monster_skill;
		var $mySkill;
		function monster($monster_info){
			if (isset($monster_info)){
				return $this->monster[$monster_info];
			} else {
				return $this->monster;
			}
		}
		
		function enemy($enemy_info){
			if (isset($enemy_info)){
				return $this->enemy[$enemy_info];
			} else {
				return $this->enemy;
			}
		}
		
		function checkWinner(){
			$reader = new Reader();
			$reader->commandText = 'select * from character_battle where battle_id = '.$this->battle[battle_id];
			$db = $reader->read();
			$this->battle = $db;
			$battleResult = split('-', $this->battle[battle_result]);
			$battleCount = count($battleResult);
			
			for ($i = $this->round;$i<$battleCount;$i++){
				if ($battleResult[$i]){
					$result = new Result();
					$result->set[result][$i] = json_decode($battleResult[$i]);
					$this->round++;
					$result->returnData();
				}
			}
			 
			$this->save();
			$reader->free();
			if ($this->battle[battle_request] == 0){
				//Enemy Won.			
				$this->endBattle(false);
				return true;
			} else if (isset($this->enemy)){
				if ($this->enemy('character_pulse') <= 0) {
					//Enemy Lose.
					$updater = new Updater();
					$updater->table = 'character_battle';
					$updater->set[battle_request] = 0;
					$updater->set[battle_winner] = myUser('character_id');
					$updater->set[end_date] = date('c');
					$updater->where[battle_id] = $this->battle[battle_id];
					$updater->execute();
					$this->endBattle(true);
					return true;
				} else {
					return false;
				}
			} else if (isset($this->monster)){
				$this->monsterAttack();
				if (myUser('character_pulse') <= 0){
					$updater = new Updater();
					$updater->table = 'character_battle';
					$updater->set[battle_request] = 0;
					$updater->set[battle_winner] = 'monster';
					$updater->set[end_date] = date('c');
					$updater->where[battle_id] = $this->battle[battle_id] ;
					$updater->execute();
					$this->endBattle(false);
					return true;					
				} else if ($this->monster('monster_pulse') <= 0) {
					//Enemy Lose.
					$updater = new Updater();
					$updater->table = 'character_battle';
					$updater->set[battle_request] = 0;
					$updater->set[battle_winner] = myUser('character_id');
					$updater->set[end_date] = date('c');
					$updater->where[battle_id] = $this->battle[battle_id];
					$updater->execute();
					$this->endBattle(true);
					return true;
				} else  {
					return false;
				}
			} 
			return false;
		}
		
		function endBattle($winner){
			myUser(null)->setActive('เดินทาง... ');
			$result = new Result();
			$result->set[result][win] = $winner;
			//if (isset($this->monster)) $result->set[result][gotItem] = $this->getExp($winner);
			$result->returnData(); 
			$this->clearBattleSession();
		}
		
		function getExp($winner){
			$result = new Result();
			if (isset($this->enemy)){
				
			} else if (isset($this->monster)){
				
			} else {
				$result->errorCode(4007);
			}
		}
		
		function getItem(){
			$result = new Result();
			if (isset($this->enemy)){
				
			} else if (isset($this->monster)){
				
			} else {
				$result->errorCode(4008);
			}
		}
		
		function approx($val){
			return $val * ((75+(rand(0,50)))/100);
		}
				
		function getDamage($skill_id){
			if ($this->battle[battle_request] == 2 && $this->delay <= microtime(true)){
				$result = new Result();	
				$skill = json_decode($this->mySkill[$skill_id][skill_ability]);
				$skillmultiply = $skill->skill_damage[$this->mySkill[$skill_id][skill_lv] -1];	
				
				$myAtk = myUser('character_atk');
				$enemyDef = $this->enemy('character_def');
				
				$myHit = myUser('character_hit');
				$enemyFlee =  $this->enemy('character_flee');
				
				$hit = $this->approx($myHit /($myHit + $enemyFlee) * 100);
				if (rand(0, 100) < $hit){
					$damage = $this->approx(($myAtk - $enemyDef)*$skillmultiply);
					$damage = ($damage < 1)? 1 : ceil($damage);
					
					$result->set[result][$this->round][dmg] = $damage;
					$result->set[result][$this->round][type] = 'hit';
				} else {
					$result->set[result][$this->round][dmg] = 'miss';
					$result->set[result][$this->round][type] = 'miss';
				}	
				$result->set[result][$this->round][id] = myUser('character_id');		
				$result->set[result][$this->round][name] = $this->mySkill[$skill_id][skill_name];
				$result->set[result][$this->round][lv] = $this->mySkill[$skill_id][skill_lv];
				$result->returnData();
				
				$this->enemy['character_pulse'] = $this->enemy['character_pulse'] - $result->set[result][$this->round][dmg];
				$updater = new Updater();
				$updater->table = 'character_battle';
				//$result->set[result][$this->round][s_id] = $skill_id;
				//unset($result->set[result][$this->round][name]);
				$updater->set[battle_result] = addslashes($this->battle[battle_result].json_encode($result->set[result][$this->round])).'-';
				$updater->where[battle_id] = $this->battle[battle_id];
				$updater->execute();
				$this->round++;
				$this->delay = microtime(true)+myUser('character_atk_delay');
				$this->checkWinner();
			}
		}
		
		
		function getMonsterDamage($skill_id){
			if ($this->battle[battle_request] == 2 && $this->delay <= microtime(true)){
				$result = new Result();	
				$skill = json_decode($this->mySkill[$skill_id][skill_ability]);
				$skillmultiply = $skill->skill_damage[$this->mySkill[$skill_id][skill_lv] -1];	
				
				$myAtk = myUser('character_atk');
				$enemyDef = $this->monster('monster_def');
				
				$myHit = myUser('character_hit');
				$enemyFlee = $this->monster('monster_flee');
				
				$hit = $this->approx($myHit /($myHit + $enemyFlee) * 100);
				if (rand(0, 100) < $hit){
					$damage = $this->approx(($myAtk - $enemyDef)*$skillmultiply);
					$damage = ($damage < 1)? 1 : ceil($damage);
					
					$result->set[result][$this->round][dmg] = $damage;
					$result->set[result][$this->round][type] = 'hit';
				} else {
					$result->set[result][$this->round][dmg] = 'miss';
					$result->set[result][$this->round][type] = 'miss';
				}	
				$result->set[result][$this->round][id] = myUser('character_id');		
				$result->set[result][$this->round][name] = $this->mySkill[$skill_id][skill_name];
				$result->set[result][$this->round][lv] = $this->mySkill[$skill_id][skill_lv];
				$result->returnData();
				
				$this->monster['monster_pulse'] = $this->monster['monster_pulse'] - $result->set[result][$this->round][dmg];
				$updater = new Updater();
				$updater->table = 'character_battle';
				//$result->set[result][$this->round][s_id] = $skill_id;
				//unset($result->set[result][$this->round][name]);
				$updater->set[battle_result] = addslashes($this->battle[battle_result].json_encode($result->set[result][$this->round])).'-';
				$updater->where[battle_id] = $this->battle[battle_id];
				$updater->execute();
				$this->round++;
				$this->delay = microtime(true)+myUser('character_atk_delay');
				$this->checkWinner();
			}
		}
		
		function monsterAttack(){
			if ($this->battle[battle_request] == 2 && $this->monster_delay <= microtime(true)){
				$result = new Result();	
				$monsterAttackSkill = 0;
				$monsterSkillLevel = 1;
				$skill = json_decode($this->monster_skill[$monsterAttackSkill][skill_ability]);
				$skillmultiply = $skill->skill_damage[$monsterSkillLevel  -1];	
				
				$myAtk = $this->monster('monster_atk');
				$enemyDef = myUser('character_def');
				
				$myHit = $this->monster('monster_hit');
				$enemyFlee =  myUser('character_flee');
				
				$hit = $this->approx($myHit /($myHit + $enemyFlee) * 100);
				if (rand(0, 100) < $hit){
					$damage = $this->approx(($myAtk - $enemyDef)*$skillmultiply);
					$damage = ($damage < 1)? 1 : ceil($damage);
					
					$result->set[result][$this->round][dmg] = $damage;
					$result->set[result][$this->round][type] = 'hit';
				} else {
					$result->set[result][$this->round][dmg] = 'miss';
					$result->set[result][$this->round][type] = 'miss';
				}	
				$result->set[result][$this->round][id] = 'm';//myUser('character_id');		
				$result->set[result][$this->round][name] = $this->monster_skill[$monsterAttackSkill][skill_name];
				$result->set[result][$this->round][lv] = $monsterSkillLevel;
				$result->returnData();
				
				myUser(null)->character['character_pulse'] = myUser(null)->character['character_pulse'] - $result->set[result][$this->round][dmg];
				$updater = new Updater();
				$updater->table = 'character_battle';
				//$result->set[result][$this->round][s_id] = $skill_id;
				//unset($result->set[result][$this->round][name]);
				$updater->set[battle_result] = addslashes($this->battle[battle_result].json_encode($result->set[result][$this->round])).'-';
				$updater->where[battle_id] = $this->battle[battle_id];
				$updater->execute();
				$this->round++;
				$this->monster_delay = microtime(true)+$this->monster[monster_atk_delay];
			}
		}
		
		function attack($skill_id){
			if (!$this->mySkill[$skill_id]) $skill_id = 0; // Set skill to 0 when skill_id is invalid.
			if (isset($this->enemy)) $this->getDamage($skill_id);
			else if (isset($this->monster)) $this->getMonsterDamage($skill_id);
			else {
				$result = new Result();
				$result->errorCode(4005);
			}
		}
		
		function getSkillInfo(){
			$reader = new Reader();
			$reader->commandText = 'select skill.skill_id,skill_lv,skill_name,skill_ability from skill,character_skill where character_skill.skill_id = skill.skill_id and character_skill.character_id = '.myUser('character_id');
			while ($db = $reader->read()){
				$this->mySkill[$db[skill_id]] = $db;
			}
		}
		
		function clearBattleSession(){
			unset($_SESSION[BATTLE]);	
			session_unregister('BATTLE');
		}
		
		function getMonsterInfo(){
			$reader = new Reader();
			$reader->commandText = 'select * from monster where monster_id = '.((is_array($this->monster))? $this->monster[monster_id] : $this->monster);
			if ($db = $reader->read()){
				$this->monster = $db;
				$monsterSkill = json_decode($db[monster_skill]);
				$implodeMonsterSkill = '';
				foreach ($monsterSkill as $key => $value) {
					$implodeMonsterSkill .= $key.',';
				}
				$implodeMonsterSkill = substr($implodeMonsterSkill, 0,-1);
				$skillReader = new Reader();
				$skillReader->commandText = 'select * from skill where skill_id in ('.$implodeMonsterSkill.')';
				while ($dbSkill = $skillReader->read()){
					$this->monster_skill[$dbSkill[skill_id]] = $dbSkill;
				}
			} else {
				$result = new Result();
				$result->errorCode(4006);
			}
			$reader = free;
		}
		
		function getEnemyInfo(){
			$reader = new Reader();
			$reader->commandText = 'select * from characters where character_id = '.((is_array($this->enemy))? $this->enemy[character_id] : $this->enemy);
			if ($db = $reader->read()){
				$this->enemy = $db;
			} else {
				$result = new Result();
				$result->errorCode(4002);
			}
			$reader = free;
		}
		
		function startBattle(){
			$result = new Result();
			$this->round = 0;
			$this->getSkillInfo();
			if (isset($this->enemy)) {
				$this->getEnemyInfo();
				myUser(null)->setActive('กำลังต่อสู้กับ '.$this->enemy[character_name]);
				$result->set[notice][battle][enemy] = $this->enemy;
			} else if (isset($this->monster)){
				$this->getMonsterInfo();
				//$this->getMonsterSkillInfo();
				myUser(null)->setActive('กำลังต่อสู้กับ '.$this->monster[monster_name]);
				$result->set[notice][battle][enemy] = $this->monster;	
			}
			$result->set[notice][battle][start] = true;
			$this->save();
			$result->returnData();
		}

		function save(){
			$_SESSION[BATTLE] = $this;
		}
		
		function checkRequest(){
			$result = new Result();
			$reader = new Reader();
			$reader->commandText = 'select * from character_battle where (battle_defender_id = '.myUser('character_id').' or  battle_attacker_id = '.myUser('character_id').') and battle_request in (1,2) order by battle_id desc limit 1';
			if ($db = $reader->read()){
				$this->battle = $db;
				$this->result = json_decode($this->battle[battle_result]);
				if ($db[battle_defender_id] == myUser('character_id') and $db[battle_monster_id] == null){
					$this->enemy = $db[battle_attacker_id];
					$this->getEnemyInfo();	
				} else if ($db[battle_attacker_id] == myUser('character_id') and $db[battle_monster_id] == null){
					$this->enemy = $db[battle_defender_id];
					$this->getEnemyInfo();	
				} else {
					$this->monster = $db[battle_monster_id];
					$this->getMonsterInfo();
				}
				 //: $db[battle_attacker_id];
				
				$this->save();
				
				switch ($this->battle[battle_request]){
					case 1 :
						if ($this->battle[battle_attacker_id] == myUser('character_id')){
							//มี session อยู่แล้ว และกำลังท้าประลอง
							$result->set[notice][battle][request] = true;
						} else {
							//มี session อยู่แล้ว และกำลังถูกท้าประลอง
							$result->set[notice][battle][response] = true;
							$result->set[notice][battle][name] = (isset($this->enemy[character_name]))? $this->enemy[character_name] : $this->monster[monster_name];
						}
						$result->returnData();
						break;
					case 2 :
						// กำลังต่อสู้
						$this->startBattle();
						break;
				}	
				
				
			} else {
				$this->clearBattleSession();
			}
			$reader->free();
				
		}
		
		function response($response){
			//echo 'response = '.($response=='true');
			if ($this->battle[battle_id]){
				$updater = new Updater();
				$updater->table = 'character_battle';
				$updater->set[battle_request] = ($response == 'true')? 2 : 0;
				$updater->where[battle_id] = $this->battle[battle_id];
				//echo $updater->commandText;
				$updater->execute();
			}
		}
		
		function getRequestInfo(){
			$reader = new Reader();
			$reader->commandText = 'select * from character_battle where battle_attacker_id = '.myUser('character_id').' and battle_request = 1 order by battle_id desc limit 1';
			if ($db = $reader->read()){
				$this->battle = $db;
				$this->save();
			}
			$reader->free(); 
		}
		
		function request($character_id){
			
			if ($this->notDuplicate() and $this->isSameMap($character_id)){
				$inserter = new Inserter();
				$inserter->table = 'character_battle';
				$inserter->set[battle_attacker_id] = myUser('character_id');
				$inserter->set[battle_defender_id] = $character_id;
				$inserter->execute();
				$this->enemy = $character_id;
				$this->getRequestInfo();
				$this->save();
				//$result[notice][battle][waiting] = true;
				//$result->returnData();
			} else {
				
			}
		}
		
		function notDuplicate(){
			$result = new Result();
			$reader = new Reader();
			$reader->commandText = 'select battle_id from character_battle where (battle_attacker_id = '.myUser('character_id').' or battle_attacker_id = '.myUser('character_id').') and battle_request = 1 limit 1';
			$db = $reader->hasRow();
			if ($db) $result->errorCode(4003);
			$reader->free(); 
			return $result;		
		}
		
		function isSameMap($character_id){
			$result = new Result();
			$reader = new Reader();
			$reader->commandText = 'select character_id from characters where character_id = '.$character_id.' and map_id like \''.substr(myUser('map_id'), 0,6).'%\'';
			$db = $reader->hasRow();
			if (!$db) $result->errorCode(4004);
			$reader->free(); 
			return $result;	
		}
	}
?>