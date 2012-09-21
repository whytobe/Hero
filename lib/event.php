<?
	class Event{
		var  $info = array();
		function gotEvent(){
			$user = $_SESSION[USER]->character;
			$reader = new Reader();
			$reader->commandText = 'select event.event_id,event.event_name,event.event_type,event.event_description from map_event,event where map_event.event_id = event.event_id';
			$reader->commandText .= ' and map_event.map_id = \''.substr($user[map_id], 0,6).'\' and map_event.map_position = \''.substr($user[map_id], 7).'\'  limit 1';
			$db = $reader->read();
			$this->info = $db;
			$reader->free();
		}
		
		function initEventId($event_id){
			$reader = new Reader();
			$reader->commandText = 'select * from event where event_id = \''.$event_id.'\' limit 1';
			$db = $reader->read();
			$this->info = $db;
			$reader->free();
		}
		
		function executeEvent(){
			$result = new Result();
			//print_r($this);
			if ($this->info){
				$eventInfo = json_decode($this->info[event_description]); 
				switch ($this->info[event_type]){
					case 'warp' : 
						$myUser = $_SESSION[USER];
						$myUser->warpTo($eventInfo->map_id,$eventInfo->position);
						$result -> set[refresh] = true;
						$result -> returnData();
						$myUser->initialCharacter();
						$myUser->getCharInfo();
						getMapInfo();
						break;
					case 'page' :
						$result->set[page][url] = $eventInfo->page_url;
						$result->set[page][title] = $eventInfo->page_title;
						$result -> returnData();
						break;
					default :
						$result -> set[error] = 'Unknown Event Type.';
						$result -> set[message] = 'Unable to execute unknown event type.';
						$result -> returnError();
						break;
				}
			} else {
				$result -> set[error] = 'Unknown Event.';
				$result -> set[message] = 'Unable to execute unknown event.';
				$result -> returnError();
			}
		}
	}
?>