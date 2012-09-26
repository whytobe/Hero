<?php
	function memberLogin($data){
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
	}
	
	

?>