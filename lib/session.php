<?
	require_once 'config.php';
	require_once 'character.php';
	session_start();
	header('Content-type: application/json');
	header('charset=utf-8');
	print_r($_SESSION[USER]);
	
	$event = json_decode('{"map_id":"fild01","position":245});
	print_r($event);
?>