<?php
require_once 'config.php';
require_once 'map.php';
require_once 'item.php';
require_once 'event.php';
require_once 'member.php';
require_once 'battle.php';
require_once 'character.php';
session_start();

header('Content-type: application/json');
header('charset=utf-8');
// Include Library if needed.

//require_once 'facebook.php';


/*$testChar[character_id] = 1;
//$testChar[character_online_unique] = 'dd75ac50ec43b740426aea8268b077f2c86a9e44'; 
$test = new User($testChar);
$test->login();*/

//print_r($_SESSION[USER]);




//Setting result;
$result = new Result();

//Get User from session.
//$USER = $_SESSION[USER];
//$USER = new User(1, 'test');

//Check seesion is valid.


if ($_POST[action] == 'memberLogin'){
	memberLogin($_POST[data]);
} else if ($_SESSION[USER] and $_POST[action]) {
	//Check user is online.
	$myUser = $_SESSION[USER];
	if ($myUser->isOnline()) {
		//Do action by passing value.
		$_POST[action]($_POST[data]);
		
		//refreshGame(null);
		//initGame(null);
		//$result->set[character] = $MYUSER->character;
		//$result->returnData();
	} else {
		$result->set[error][code] = 1002;
		$result->returnError();
	}
} else {
	//print_r($_SESSION[USER]);
	
	//Return error that authenticating invalid.
	$result->set[error][code] = 1001;
	$result->returnError();
}

function initGame($data){
	$myUser = $_SESSION[USER];
	$myUser->initialCharacter();
	$myUser->getCharInfo();
	getMapInfo();
}


function gotEvent($data){
	$myUser = $_SESSION[USER];
	if ($data[position]) {
		$myUser->updatePosition($data[position]);
	}
	$event = new Event();
	$event->gotEvent();
	$event->executeEvent();	
}
function menu($data){
	switch($data[menuType]){
		case 'item' :
			getItem();
			break;
		case 'status' :
			myUser(null)->getStatusInfo();
			break;
	}
}

function refreshGame($data){
	$myUser = $_SESSION[USER];
	
	// Handle with receive data if need.
	if (isset($data[character])) {
		if ($data[character][position]) $myUser->updatePosition($data[character][position]);
	}
	$battle = (!isset($_SESSION[BATTLE]))? new Battle() : $_SESSION[BATTLE];
	if (isset($data[battle][response])){
		$battle->response($data[battle][response]);
	} else if (isset($data[battle][request][character_id])){
		$battle->request($data[battle][request][character_id]);
	}
	
	if (isset($data[refreshUserBar])) $myUser->refreshUserBar();
	/*if (isset($data[getStatus])) $myUser->getStatusInfo();
	
	/* Item function 
	if (isset($data[item])){
		if (isset($data[item][character_item_id])){
			$item = new Item($data[item][character_item_id]);
			$item->detail();
		}
	}
	
	if (isset($data[status])){
		if (isset($data[status][addPoint])) 
	
	}*/	
	
	$battle->checkRequest();
		
	$myUser->getCharacters();
	
	//getEvents();
	//getMessages();
	//getChats();
	//updateCharacterInfo();
}



echo json_encode($result);

?>       