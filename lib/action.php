<?php
require_once 'config.php';
require_once 'map.php';
require_once 'event.php';
require_once 'member.php';
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
		$result->set[error] = 'User isn\'t online.';
	    $result->set[message] = 'Please login and try again';
		$result->returnError();
	}
} else {
	//print_r($_SESSION[USER]);
	
	//Return error that authenticating invalid.
	$result -> set[error] = 'Auth Error.';
	$result -> set[message] = 'Authentication is invalid.';
	$result -> returnError();
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

function refreshGame($data){
	$myUser = $_SESSION[USER];
	if ($data[character][position]) {
		$myUser->updatePosition($data[character][position]);
	}
	$myUser->getCharacters();
	
	//getEvents();
	//getMessages();
	//getChats();
	//updateCharacterInfo();
}

echo json_encode($result);

?>       