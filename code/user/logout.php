<?php

	$cookiecontents="";
	$duration=time() - 86400;

	if ($useSever=="remote") {
    setcookie("alldone", $cookiecontents, $duration,"/",".alldone.io");
    } else {
    setcookie("alldone", $cookiecontents, $duration,"/");
    }

    // attempt to delete session
    if ($loginInfo["sessionid"]>0) {
    	sql_query("DELETE FROM sessions WHERE sessionid = '".safe($loginInfo["sessionid"])."'");
    }

    $loginInfo=[];
    $loggedin=false;

    include "code/design.top.php";

    echo "You've been logged out! <a href=\"".$ml."\">Return to alldone.io homepage</a>.";

    include "code/design.bottom.php";

?>