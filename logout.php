<?php
	session_start();
	if ($_GET[action] == 'logout'){
		session_unset();
		session_destroy();
		echo '<script type="text/javascript">location.href = "index.html"</script>';
	}
?>