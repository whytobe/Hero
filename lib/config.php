<?php
	$db_hostname = 'localhost';
	$db_username = 'root';
	$db_password = 'root';
	$db_tablename = 'hero_db';
	
	
	$conn = mysql_connect($db_hostname,$db_username,$db_password) or die(mysql_error());
	mysql_select_db($db_tablename,$conn) or die(mysql_error());
	mysql_query("SET NAMES 'utf8'") or die(mysql_error());
	
	function fixObject (&$object){
	  if (!is_object ($object) && gettype ($object) == 'object')
	    return ($object = unserialize (serialize ($object)));
	  return $object;
	}

	
	class Result{
		var $set;
		
		function Result(){
			//if ($GLOBALS[result]) $this->set = $GLOBALS[result];
			if (is_array($GLOBALS[result])){
				foreach ($GLOBALS[result] as $key => $value){
					if ($value)	$this->set[$key] = $value;
				}
			}
		}
		
		
		function clear(){
			$this->set = null;
		}
		
		function returnData(){
			$GLOBALS[result] = $this->set; 
		}
		
		function returnError(){
			echo json_encode($this->set); 
			exit();
		}
	}
	
	
	class Reader{
		var $commandText; //MySql Command Text;
		var $result;
		
		function executeQuery(){
			$this->result = mysql_query($this->commandText) or die($this->error());
		}
	
		function hasRow(){
			$hasRow = false;
			if ($this->result) {
				if (mysql_num_rows($this->result)) $hasRow = true;
			} else {
				$this->executeQuery();
				if (mysql_num_rows($this->result)) $hasRow = true;
			}
			return $hasRow; 	
		}
		
		function read(){
			if ($this->result) {
				return mysql_fetch_assoc($this->result);
			} else {
				$this->executeQuery();
				return mysql_fetch_assoc($this->result);
			}
			
		}
		
		function free(){
			mysql_free_result($this->result) or die($this->error());
		}
		
		function error(){
			$result = new Result();
			$result->set[error] = 'MySQL error code :'.mysql_errno();
	        $result->set[message] = mysql_error();
			$result->returnError();
		}
	}
	
	class Inserter extends Reader{
		/* 
		 * How to use.
			$insert = new MySQLInsert();
			$insert->table = 'character';
			$insert->set['character_id'] = 1;
			$insert->set['character_name'] = 'test';
			$insert->execute();
		 */
		var $set = Array(); //MySql Command Text;
		var $table;
		
		function execute(){
			if (count($this->set) and !empty($this->table)){
				$this->commandText = 'insert into '.$this->table.'(';
				foreach ($this->set as $key => $value){
					$this->commandText .= $key.',';
				}
				$this->commandText = substr($this->commandText, 0,-1);
				$this->commandText .= ') values(';
				foreach ($this->set as $key => $value){
					$this->commandText .= is_numeric($value)? $value.',' : '\''.$value.'\',';
				}
				$this->commandText = substr($this->commandText, 0,-1);
				$this->commandText .= ')';
				
				$this->executeQuery();
				//echo $this->commandText.'<br/>';
			}
		}	
	}


	class Updater extends Reader{
		/* 
		 * How to use. 
			$insert = new MySQLUpdate();
			$insert->table = 'character';
			$insert->set['character_id'] = 1;
			$insert->set['character_name'] = 'test';
			$insert->where['character_id'] = 2;
			$insert->where['character_name'] = 'test';
			$insert->execute();
		 */
		var $set = Array(); //MySql Command Text;
		var $where = Array();
		var $table;
			
		function execute(){
			if (count($this->set) and count($this->where) and !empty($this->table)){
				$this->commandText = 'update '.$this->table.' set ';
				foreach ($this->set as $key => $value){
					$this->commandText .= $key.' = '.(is_numeric($value)? $value.',' : '\''.$value.'\',');
				}
				$this->commandText = substr($this->commandText, 0,-1);
				
				
				$this->commandText .= ' where ';
				foreach ($this->where as $key => $value){
					$this->commandText .= $key.' = '.(is_numeric($value)? $value.' and ' : '\''.$value.'\' and ');
				}
				$this->commandText = substr($this->commandText, 0,-4);
				
				$this->executeQuery();
				//echo $this->commandText.'<br/>';
			}
		}
	}


	class Deleter extends Reader{
		/* 
		 * How to use. 
			$insert = new MySQLDelete();
			$insert->table = 'character';
			$insert->where['character_id'] = 2;
			$insert->where['character_name'] = 'test';
			$insert->execute();
		 */
		var $where = Array();
		var $table;
		
		
		function execute(){
			if (count($this->set) and count($this->where) and !empty($this->table)){
				$this->commandText = 'delete from '.$this->table.' where ';
				foreach ($this->where as $key => $value){
					$this->commandText .= $key.' = '.(is_numeric($value)? $value.' and ' : '\''.$value.'\' and ');
				}
				$this->commandText = substr($this->commandText, 0,-4);
				
				$this->executeQuery();
				//echo $this->commandText.'<br/>';
			}
		}
	}
?>