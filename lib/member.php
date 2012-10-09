<?php
	/*function memberLogin($data){
		if ($data[member_username] and $data[member_password]){
			$reader = new Reader();
			$reader->commandText = 'select character_id from characters,member where characters.member_id = member.member_id and member_username = \''.$data[member_username].'\' and member_password = \''.$data[member_password].'\' limit 1';
			if ($reader->hasRow()){
				$db = $reader->read();
				$char[character_id] = $db[character_id];
				$char[character_online_unique] = sha1($char[character_last_active] = date('c'));
			
				$data = new Updater();
				$data->table = 'characters';
				$data->set[character_active] = 'Just Login!';
				$data->set[character_last_active] = $char[character_last_active];
				$data->set[character_online_unique] = $char[character_online_unique];
				$data->where[character_id] = $char[character_id];
				//echo $data->commandText;
				$data->execute();
				
				$login = new User($char);
				$login->login();
			} else {
				sleep(2);
				$result = new Result();
				$result->set[error][code] =  1003;
				$result->returnError();
			}
			$reader->free();
		}
	}*/
	function firstBackpack(){
		// Add Back Pack Item
		$character_id = myUser('character_id');
		$backpackItem = array(
			10001=>100, // ขาไก่ 100
			10002=>100, // ไข่ไก่ 100
			10003=>50, // ขาหมู 50
			24101=>1 // ดาบ 1 เล่ม
		);
		foreach ($backpackItem as $key => $value) {
			$insert = new Inserter();
			$insert->table = 'character_item';
			$insert->set[item_id] = $key;
			$insert->set[item_count] = $value;
			$insert->set[character_id] = $character_id;
			$insert->execute();
		}
		
		$backpackSkill = array(
			0=>1, // หมัดเปล่าระดับ 1
		);
		foreach ($backpackSkill as $key => $value) {
			$insert = new Inserter();
			$insert->table = 'character_skill';
			$insert->set[skill_id] = $key;
			$insert->set[skill_lv] = $value;
			$insert->set[character_id] = $character_id;
			$insert->execute();
		}
		
	}
	
	function newCharacter($data){
		if (isset($_SESSION[member])){
			$insert = new Inserter();
			$insert->table = 'characters';
			$insert->set[character_name] = $data[character_name];
			$insert->set[character_type] = $data[character_type];
			$insert->set[member_id] = $_SESSION[member][member_id];
			$insert->execute();
			memberLogin($_SESSION[member]);
			unset($_SESSION[member]);
			firstBackpack();
		} else {
			$result = new Result();
			$result->errorCode(1002);
		}
	}
	
	function memberLogin($data){
		if ($data[member_username] and $data[member_password]){
			$reader = new Reader();
			$reader->commandText = 'select member_id from member where member_username = \''.$data[member_username].'\' and member_password = \''.$data[member_password].'\' limit 1';
			if ($db = $reader->read()){
				$_SESSION[member] = $data;
				$_SESSION[member][member_id] = $db[member_id];
				$reader = new Reader();
				$reader->commandText = 'select character_id from characters,member where characters.member_id = member.member_id and member_username = \''.$data[member_username].'\' and member_password = \''.$data[member_password].'\' limit 1';
				if ($db = $reader->read()){
					$char[character_id] = $db[character_id];
					$char[character_online_unique] = sha1($char[character_last_active] = date('c'));
				
					$data = new Updater();
					$data->table = 'characters';
					$data->set[character_active] = 'Just Login!';
					$data->set[character_last_active] = $char[character_last_active];
					$data->set[character_online_unique] = $char[character_online_unique];
					$data->where[character_id] = $char[character_id];
					//echo $data->commandText;
					$data->execute();
					unset($_SESSION[member]);
					$login = new User($char);
					$login->login();
					$login->updateStatus();
				}	else {
					$result = new Result();
					$result->set[newCharacter] = true;
					$result->returnData();					
				}
			
			} else {
				sleep(2);
				$result = new Result();
				$result->set[error][code] =  1003;
				$result->returnError();
			}
			$reader->free();
		}
	}
	

?>