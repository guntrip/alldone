<?php

function login($uid, $location) {
// creates and returns a session

	global $useServer;

	define("WEEK_IN_SECONDS",604800);
	
	$characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#~!$@.?$%&*";
	$sessionid="";
	for ($n = 0; $n < 18; $n++) {
	$sessionid.=$characters[rand(0,strlen($characters))];
	}
	 	 
	$sessionLife = time() + 31449600;

	$query="INSERT INTO sessions (uid, session, expires)".
		   "VALUES(".$uid.", '".safe($sessionid)."', ".$sessionLife.")";
 

    $check = sql_insert($query);

    if (is_numeric($check)) {

    	if ($location=="web") {

    		$cookiecontents=$uid."^".($sessionid);
    		$duration=time() + 31449600;

    		if ($useSever=="remote") {
            setcookie("alldone", $cookiecontents, $duration,"/",".alldone.io");
            } else {
            setcookie("alldone", $cookiecontents, $duration,"/");
            }

    	}

    	return $sessionid;

    }

}

function check_login($email, $password) {

	
	
}

?>