<?
	class Event{
		var  $info = array();
		function gotEvent(){
			$reader = new Reader();
			$reader->commandText = 'select event.event_id,event.event_name,event.event_type,event.event_description from map_event,event where map_event.event_id = event.event_id';
			$reader->commandText .= ' and map_event.map_id = \''.substr(myUser('map_id'), 0,6).'\' and map_event.map_position = \''.substr(myUser('map_id'), 7).'\'  limit 1';
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
						echo json_encode($GLOBALS[result]);
						exit();
						break;
					case 'page' :
						$result->set[page][url] = $eventInfo->page_url;
						$result->set[page][title] = $eventInfo->page_title;
						$result -> returnData();
						break;
					case 'note' :
						//$result->set[notice][url] = $eventInfo->notice_type;
						$result->set[notice][note][title] = $eventInfo->note_title;
						$result->set[notice][note][description] = $eventInfo->note_description;
						$result -> returnData();
						break;
					default :
						$result -> set[error][code] = 3002;
						$result -> returnError();
						break;
				}
			} else {
				$result->set[notice][note][title] = 'เขตหวงห้าม';
				$result->set[notice][note][description] = 'ยังไม่เปิดใช้งานในขณะนี้';
				$result -> returnData();
				/*$result -> set[error][code] = 3001;
				$result -> returnError();*/
			}
		}
	}
?>