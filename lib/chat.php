<?php
	function sendChat($data){
		echo $chat_text = strip_tags($data[text]);
		//$chat_text = addslashes($chat_text);
		//$chat_text = preg_replace ( "'<[^>]+>'U", "", $data[text]);
		if ($chat_text != ''){
			$insert = new Inserter();
			$insert->table ='chat';
			$insert->set[character_id] = myUser('character_id');
			$insert->set[chat_text] = $chat_text;
			$insert->execute();
			getChat();
		}
	}

	function getChat(){
		
		if (isset($_SESSION[chat_id])) {
			$read = new Reader();
			$read->commandText = 'select chat_id,chat_text,chat.character_id,chat.created_date from chat,characters where characters.character_id = chat.character_id and map_id like \''.substr(myUser('map_id'), 0,6).'%\' and chat_id > '.$_SESSION[chat_id].' and chat.character_id != '.myUser('character_id').' order by chat_id';
			//if ($read->hasRow()){
				$hasRow = false;
				$result = new Result();
				while ($db = $read->read()){
					$result->set[chat][] = $db;
					$_SESSION[chat_id] = $db[chat_id];
					$hasRow = true;
				}
				$read->free();
				if ($hasRow) $result->returnData();
			//} 
		} else {
			$read = new Reader();
			$read->commandText = 'select max(chat_id) as max_chat_id from chat';
			if ($db = $read->read()){
				$_SESSION[chat_id] = $db[max_chat_id];
				getChat();
			} else {
				$result = new Result();
				$result->errorCode(1004);
			}
		}
	}
?>