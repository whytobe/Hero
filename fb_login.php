<?php
	require_once 'lib/fb/facebook.php';
	require_once 'lib/config.php';
	require_once 'lib/member.php';
	require_once 'lib/map.php';
	require_once 'lib/skill.php';
	require_once 'lib/character.php';
	
	header('Content-type: application/json');
	// Create our Application instance (replace this with your appId and secret).
	$facebook = new Facebook(array(
	  'appId' => '527476593936284',
	  'secret' => '18f5536f154973cb2d1953fae11900dc',
	));
	$user = $facebook->getUser();

  if ($user) {
	  try {
	    // Proceed knowing you have a logged in user who's authenticated.
	    $user_profile = $facebook->api('/me');
		//print_r($user_profile);
		$read = new Reader();
		$read->commandText = 'select member_facebook_id,member_id from member where member_facebook_id = '.$user;
		if (!$db = $read->read()){
			$db[member_facebook_id] = $user;
			$insert = new Inserter();
			$insert->table = 'member';
			$insert->set[member_facebook_id] = $user;
			$insert->set[member_name] = $user_profile[name]; 
		 	$insert->set[member_email] = $user_profile[email];
			$insert->execute();
		}
		memberLogin($db);
		echo json_encode($result);
	  } catch (FacebookApiException $e) {
	    error_log($e);
	    $user = null;
		$result2 = new Result();
		$result2->errorCode(1005);
		echo json_encode($result);
	  }
	  
  } else {
  	$result2 = new Result();
		$result2->errorCode(1005);
		echo json_encode($result);
  }
?>
