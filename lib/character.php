<?php
	/* Session Store 
	 * USER_ID			
	 * MEMBER_ID
	 * USER_NAME
	 * USER_UNIQUE
	 * USER_PASSWORD **
	 */	
	function addPoint($data){
		myUser()->addPoint($data[addPoint]);
	}
	
	class User{
		var $character = Array();
		//var $member = Array();
		function User($inputCharacter){
			foreach ($inputCharacter as $key => $value){
				if ($value)	$this->character[$key] = $value;
			}
			//$this->character = $inputCharacter;
			//	
		}
	
	function getStatusInfo(){
		$this->initialCharacter();
		$result = new Result();
		$result->set[status] = $this->character;
		$baseExp = pow((($this->character[character_lv])*2),3);
		$result->set[status][character_exp] -= $baseExp;
		$result->set[status][character_max_exp] -= $baseExp;
		$result->returnData();	
	}
	
	function getCharInfo(){
		$result = new Result();
		$result->set[me] = $this->character;
		$baseExp = pow((($this->character[character_lv])*2),3);
		$result->set[me][character_exp] -= $baseExp;
		$result->set[me][character_max_exp] -= $baseExp;
		$result->returnData();	
	}
	
	function addPoint($point){
		$result = new Result();
		$status = array(
		'str' => 'character_str',
		'agi' => 'character_agi',
		'vit' =>'character_vit',
		'int' =>'character_int',
		'dex' => 'character_dex',
		'luk' => 'character_luk');
		if (!$upstatus = $status[$point]){
			$result->errorCode(2002);
		}
		$useStatPoint = $this->checkEnoughPoint($upstatus);
		$this->character[$upstatus]++;
		$this->character[character_status_point] -= $useStatPoint;
		$this->updateStatus();
		$this->getStatusInfo();
	
	}
	
	function updateStatus(){
		$DEFAULT_ATK_DELAY = 3; // หน่วงเวลาโจมตีพื้นฐาน
		$DEFAULT_MATK_DELAY = 5; // หน่วงเวลาโจมตีเวทย์พื้นฐาน
		$this->character[character_max_pulse] = ($this->character[character_lv]*50)+($this->character[character_vit]*35)+(floor($this->character[character_vit]/2)^2);
		$this->character[character_max_soul] = ($this->character[character_lv]*20)+($this->character[character_int]*14)+(floor($this->character[character_int]/2)^2);
		$this->character[character_atk] = $this->character[character_str]+(($this->character[character_str]/5)*5)+($this->character[character_lv]*2);
		$this->character[character_def] = $this->character[character_vit]+(($this->character[character_vit]/5)*7)+($this->character[character_lv]*2);
		$this->character[character_matk] = $this->character[character_int]+(($this->character[character_int]/5)*15)+($this->character[character_lv]*2);
		$this->character[character_flee] = $this->character[character_agi]+(($this->character[character_agi]/5)*5)+($this->character[character_lv]*2);
		$this->character[character_hit] = $this->character[character_dex]+(($this->character[character_dex]/5)*7)+($this->character[character_lv]*2);
		$this->character[character_drop_rate] = ($this->character[character_luk]+(($this->character[character_luk]/5)*9))/10;
		$this->character[character_atk_delay] = number_format(($DEFAULT_ATK_DELAY*100/($this->character[character_lv]+100+($this->character[character_agi]*3)+(($this->character[character_agi]/9)^2))), 2, '.', ',');
		$this->character[character_matk_delay] = number_format(($DEFAULT_MATK_DELAY*100/($this->character[character_lv]+100+($this->character[character_dex]*3)+(($this->character[character_dex]/7)^2))), 2, '.', ',');
		$this->character[character_lucky] = $this->character[character_luk]/2;
		$this->getItemAbility();
		if ($this->character['character_pulse'] > $this->character['character_max_pulse']) $this->character['character_pulse'] = $this->character['character_max_pulse'];
		if ($this->character['character_soul'] > $this->character['character_max_soul']) $this->character['character_soul'] = $this->character['character_max_soul'];
		
		$this->save();
	}

	function getItemAbility(){
		$reader = new Reader();
		$reader->commandText = 'select item_ability from character_item,item where character_item.item_id = item.item_id and character_id = '.$this->character[character_id].' and item_active = 1';
		while ($db = $reader->read()){
			$ability = json_decode($db[item_ability]);
			foreach ($ability as $key => $value) {
				$this->character['character_'.$key] += $value;
			}
		}
		
	}
	
	function checkEnoughPoint($point){
		$requirePoint = (ceil($this->character[$point]/10));
		if ($requirePoint <= $this->character[character_status_point]){
			return $requirePoint;
		} else {
			$result = new Result();
			$result->errorCode(2001);
		}
	}
	
	function id(){
		return $this->character[character_id];
	}
	
	function maxExp(){
		return pow((($this->character[character_lv]+1)*2),3);
			
	}
	
	function existItem($item_id){
		$read = new Reader();
		$read->commandText = 'select character_item_id,item_type,item_count from character_item,item where character_item.item_id = item.item_id and character_item.item_id = '.$item_id.' and character_id = '.$this->character[character_id];
		if ($db = $read->read()){
			return ($db[item_type] != '2')? false : true;
		} else {
			return false;
		}
	}
	
	function getItem($drop_rate){
		if ($drop_rate){
			$result = new Result();
			//$drop = rand(0,100);
			foreach ($drop_rate as $key => $value) {
				if (rand(0,100) <= $value){
					if ($this->existItem($key)){
						$insert = new Inserter();
						$insert->table = 'character_item';
						$insert->set[character_id] = $this->character[character_id];
						$insert->set[item_id] = $key;
						//$insert->set[item_count] = 1;
						$insert->execute();
					} else {
						$update = new Updater();
						$update->table = 'character_item';
						$update->set[item_count] = 'item_count + 1';
						$update->where[character_id] = $this->character[character_id];
						$update->where[item_id] = $key;
						echo $update->commandText;
						$update->execute();
					}
					
					$itemdrop[id] = $key;
					$itemdrop[count] = 1;
					$result->set[result][item_drop][] = $itemdrop;
				}
			}	
			$result->returnData();		
		} 
	}
	
	function levelUp($exp = 0){
		//$this->character[character_max_exp] = ((($this->character[character_lv]+1)*2)^3);
		$this->character[character_max_exp] = $this->maxExp();
		$this->character[character_exp] += $exp;
		$levelup = false;
		while ($this->character[character_exp] >= $this->character[character_max_exp]){
			$this->character[character_lv]++;
			$this->character[character_status_point] += 10+((ceil($this->character[character_lv]/10)+1)*2);
			$this->character[character_max_exp] = $this->maxExp();			
			$levelup = true;
		} 
		$this->updateStatus();
		$this->save();
		return $levelup;
		
	}
	
		function initialCharacter(){
			$data = new Reader();
			$data->commandText = 'select * from characters where character_id = '.$this->character[character_id];
			$this->character = $data->read();
			$this->character[character_max_exp] = $this->maxExp();
			$data->free();	
			/*$character = $data->read();
			foreach ($character as $key => $value){
				if ($value)	$this->character[$key] = $value;
			}
			$data->free();	*/	
			//print_r($this->character);
		}
		
		function gotMoney($money){
			$this->initialCharacter();
			$this->character[character_money] += $money;
			$this->save();
		}
		
		function spendMoney($money){
			$this->initialCharacter();
			if ($money <= $this->character[character_money] && $money > 0){
				$this->character[character_money] -= $money;
				$this->save();
			} else {
				$result = new Result();
				$result->errorCode(2003);
			}
		}
		
		function isOnline(){
			$data = new Reader();
			$data->commandText = 'select character_id from characters where character_id = '.$this->character[character_id].' and character_online_unique = \''.$this->character[character_online_unique].'\'';
			return ($data->hasRow()) ? true : false;
    	}
		
		function setActive($activeText){
			$this->character[character_active] = $activeText;
			$this->character[character_last_active] = date('c');
			$this->save();
		}
		
		function save(){
			$data = new Updater();
			$data->table = 'characters';
			$data->set = $this->character;
			if (isset($data->set[character_max_exp])) unset($data->set[character_max_exp]);
			$data->where[character_id] = $this->character[character_id];
			unset($data->set[character_id]);
			unset($data->set[character_online_unique]);
			$data->execute();
		}
			
		function login(){
			
			//echo $data->commandText;
			unset($_SESSION[USER]);
			$this->initialCharacter();
			$_SESSION[USER] = $this;
			/*foreach ($this->character as $key => $value){
				if ($value)	$_SESSION[USER][$key] = $value;
			}*/
			//print_r($this->character);
			
		}
		function refreshUserBar(){
			$this->initialCharacter();
			
			$result = new Result();
			$result->set[user_bar][character] = $this->character;
			$baseExp = pow((($this->character[character_lv])*2),3);
			$result->set[user_bar][character][character_exp] -= $baseExp;
			$result->set[user_bar][character][character_max_exp] -= $baseExp;
			$result->returnData();
		}
		
				
		function getCharacters(){
			$reader = new Reader();
			///character_last_active > now() - 300 and
			$reader->commandText = 'select character_id,character_name,map_id,character_active,character_type,character_last_active from characters,member where character_last_active > now() - 300 and member.member_id = characters.member_id and substr(map_id,8) not in(select map_position from map_event where map_id = \''.substr($this->character[map_id], 0,6).'\') and map_id like \''.substr($this->character[map_id], 0,6).'%\' and character_id != '.$this->character[character_id];
			if ($reader->hasRow()){
				$result = new Result();
				while ($db = $reader->read()){
					$result->set[character][] = $db;
				}
				$result->returnData();
			}
			$reader->free();			
		}
		
		function updatePosition($position){
			if (substr($this->character[map_id],7) != $position){
				$this->character[character_active] = 'กำลังเดินทาง..';
				$this->character[character_last_active] = date('c');
				$this->character[map_id] = substr($this->character[map_id], 0,6).','.$position;
				$this->save();
				if ($this->map[monster_id] != null){
					$monster = json_decode($this->map[monster_id]);
					$monster_found = null;
					foreach ($monster as $key => $value) {
						$found = rand(0,100);
						if ($found < $value){
							$monster_found = $key;						
						} else {
							break;	
						}
					}
					if ($monster_found != null) {
						$inserter = new Inserter();
						$inserter->table = 'character_battle';
						$inserter->set[battle_defender_id] = myUser('character_id');
						$inserter->set[battle_monster_id] = $key;
						$inserter->set[battle_request] = 2;
						$inserter->execute();
					}
				}
			}
		}
		
		function warpTo($map_id,$position){
			$this->character[map_id] = $map_id.','.$position;
			$this->save();
		}
	}
	
?>