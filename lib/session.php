<?
	require_once 'config.php';
	require_once 'map.php';
	require_once 'event.php';
	require_once 'member.php';
	require_once 'battle.php';
	require_once 'character.php';

	session_start();
	header('Content-type: application/json');
	header('charset=utf-8');
	print_r($_SESSION);
	//unset($_SESSION[battle]);
	//echo microtime(true);
	//echo substr('test', 0,-1)
	echo myUser(null)->maxExp();
?>