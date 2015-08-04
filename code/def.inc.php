<?php

include "code/functions.global.php";
include "code/functions.sql.php";
include "code/functions.file.php";
include "../alldone.io.pass/pass.php";

$this_server=["id"=>0, "saving_server"=>0, "saving_store"=>0];

$sql=array();

$incHttp="http://";

if ( ($_SERVER["SERVER_NAME"]==$localip)  ) {
$useServer="local";	
} else {
$useServer="remote";

	// Remote specific bits
	if (CRYPT_BLOWFISH != 1) { echo "<div style=\"text-align:center;\">Automatic shutdown: BF Error</div>"; exit;exit;exit;exit; }
	
	// Are we on a secure connection? If so, set up for secure. User pref (httpOnly).
	//if ( $_SERVER['SERVER_PORT']==443 ) {
	//$serversBase["remote"]["ml"]="https://www.afforder.com/";	
	//$incHttp="https://";
	//}

}

$dbServer = $serversBase[$useServer]["server"];
$dbUserName = $serversBase[$useServer]["username"];
$dbPassword = $serversBase[$useServer]["password"];
$dbDatabase = $serversBase[$useServer]["database"];	
$ml = $serversBase[$useServer]["ml"];
$mobMl = $serversBase[$useServer]["mobMl"];

// filestores
if ($useServer=="local") {
	$filestore="/var/www/alldone_data/";
} else {
	$filestore= "/home/steve/public/alldone.io/data/";
}

function safe ($word) { global $mysqli; return mysqli_real_escape_string($mysqli, strip_tags($word));  }

/**********************************************************************/

// Open database, closed in url.php (urgh)
sql_open();

$loggedin=false;
$loginInfo=[];
$check_login=false;

	// Collect and check login. Could either be via web (cookie) or json (:session, :uid)

	// Check for cookie login
	if ( ($_COOKIE["alldone"]) ) {
		$cookieArray=explode("^",$_COOKIE["alldone"]);
		$check_session=$cookieArray[1];
		$check_uid=$cookieArray[0];
		$check_login=true;
	}

	// Check for json login
	if ( (!$check_login) && ($_POST["session"]) && ($_POST["uid"]) ) {
		$check_session=urldecode($_POST["session"]);
		$check_uid=$_POST["uid"];
		$check_login=true;		
	}

	// Now actually check!
	if ($check_login) {

		$query="SELECT * FROM sessions, users ".
			   "WHERE ( (sessions.uid = '".safe($check_uid)."') ".
			   "AND (sessions.session = '".safe($check_session)."') ".
			   "AND (sessions.expires > '".safe( time() )."') ) ".
			   "AND sessions.uid = users.uid";

		$login_check=sql_select($query);

		if (sizeof($login_check)==1) {
			$loggedin=true;
			$loginInfo=["email"=>$login_check[0]["email"],
						"username"=>$login_check[0]["username"],
						"uid"=>$login_check[0]["uid"],
						"sessionid"=>$login_check[0]["sessionid"]];
		}

	}


?>