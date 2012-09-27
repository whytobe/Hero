<?php
	/* Session Store 
	 * USER_ID			
	 * MEMBER_ID
	 * USER_NAME
	 * USER_UNIQUE
	 * USER_PASSWORD **
	 */	
	
	
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
		
	function getCharInfo(){
		/*$user =$_SESSION[USER];
		$reader = new Reader();
		$reader->commandText = 'select * from characters where character_id = '.$this->character[character_id].' limit 1';
		$db = $reader->read();
		if ($reader->hasRow()){
			$result = new Result();
			$result->set[me] = $db;
			$result->returnData();
		}
		$reader->free();*/
		$result = new Result();
		$result->set[me] = $this->character;
		$result->returnData();	
	}
	
	function id(){
		return $this->character[character_id];
	}
	
		function initialCharacter(){
			$data = new Reader();
			$data->commandText = 'select * from characters where character_id = '.$this->character[character_id];
			$this->character = $data->read();
			$data->free();	
			/*$character = $data->read();
			foreach ($character as $key => $value){
				if ($value)	$this->character[$key] = $value;
			}
			$data->free();	*/	
			//print_r($this->character);
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
			$result->returnData();
		}
		
				
		function getCharacters(){
			$reader = new Reader();
			$reader->commandText = 'select character_id,character_name,map_id,character_active,character_last_active from characters where substr(map_id,8) not in(select map_position from map_event where map_id = \''.substr($this->character[map_id], 0,6).'\') and map_id like \''.substr($this->character[map_id], 0,6).'%\' and character_id != '.$this->character[character_id];
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
			}
		}
		
		function warpTo($map_id,$position){
			$this->character[map_id] = $map_id.','.$position;
			$this->save();
		}
	}
	
?>