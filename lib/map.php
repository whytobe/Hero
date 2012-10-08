<?php
	function getMapInfo(){
		$user =$_SESSION[USER]->character;
		$result = new Result();
		$reader = new Reader();
		$reader->commandText = 'select map_id,map_description,map_name,map_path,monster_id from map where map_id = \''.substr($user[map_id], 0,6).'\' limit 1';
		$db = $reader->read();
		if ($reader->hasRow()){
			myUser()->map = $db;
			unset(myUser()->map[map_path]);
			$result->set[map] = $db;
			$result->returnData();
		} else {
			$result -> set[error][code] = 5001;
			$result -> returnError();
		}
		$reader->free();
	}
	
	
?>