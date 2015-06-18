<?php

function api_login($username, $password) {


	// returns a session if successful.
	if ($username) {

	$query="SELECT * FROM users WHERE email = '".safe($username)."'";
	$login_results=sql_select($query);

	if (sizeof($login_results)==1) {

		// Check password.
		$testPassword=crypt($password, $login_results[0]["password"]);

		if ( $testPassword == $login_results[0]["password"] ) {

			// Hurrah. Log them in!
			$session = login($login_results[0]["uid"], "app");
			return ["session"=>$session, "uid"=>$login_results[0]["uid"]];

		} else {

			return -1;

		}

	} else {

		return -1;

	}

}

}

function clean_lists($lists) {

	$clean=[];

	foreach ($lists as $list) {

		$clean[]=["username"=>$list["username"], "uri"=>$list["uri"]];

	}

	return $clean;

}

?>