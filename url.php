<?php

/* plan:

   alldone.io/ = homepage / your todo lists
   alldone.io/username/todo/ = load a todo list, dumps json into page.

   --

   app: separate js loader.


*/

include "code/def.inc.php";

// Work with URL
$requesturl = $_SERVER["REQUEST_URI"];
$loginRequired=false;

// Strip local server directory
if ( $useServer == "local" ) {
    $requesturl = str_replace("alldone.io/", "", $requesturl);  // incase this is the local version running.	   
}

// Treat ? as further url slashes
$requesturl = str_replace("?", "/", $requesturl);
$requesturl = strtolower($requesturl);

// Split
$u = explode("/", $requesturl);

$page="code/404.php";


// Switch $u
switch ( $u[1] ) {

	case "api":

		include "api_code/index.php";
		exit;exit;exit;

	break;

    case "user":
	
	$page = "code/user/login.php";
	$title = "Login";

	if ($u[2]=="signup") {

		$page = "code/user/signup.php";
		$title = "Sign up";

	}

	if ($u[2]=="login") {

		$page = "code/user/login.php";
		$title = "Login";

	}

	if ($u[2]=="logout") {

		$loginRequired=true;
		$page = "code/user/logout.php";
		$title = "Log out";

	}

	if ($u[2]=="hello") {

		$loginRequired=true;
		$page = "code/user/newuser.php";
		$title = "Hello!";

	}

	break;

	case "app_test":

	$loginRequired=true;
		$page = "code/app_test.php";
		$title = "Hello!";
		$apptest=true;
	break;

	case "downloads":

	$loginRequired=true;
		$page = "code/downloads.php";
		$title = "downloads";


	break;

	case "lists":

		if($u[2]=="new") { 

			$loginRequired=true;
			$page="code/lists/new.php";
			$title="New list";

		}

	break;

	case "steverulesokay":
		if($u[2]=="dir") { $page="bits/dir.php";}
	break;

}

// User / list
if ( ($page=="code/404.php") && ($u[1]!="") ) {

	if ($u[2]!="") {

		// Might be a list!
		$load_list=grab_list($u[1], $u[2], false, []);

		if ($load_list["success"]) {

			// Yay!
			$page="code/load_todo.php";

			if ( ($u[3]=="settings") && ($load_list["owner"]==$loginInfo["username"]) ) {
				$page="code/lists/settings.php";
				$title="Settings";
			}

			if ( ($u[3]=="delete") && ($load_list["owner"]==$loginInfo["username"]) ) {
				$page="code/lists/delete.php";
				$title="Delete";
			}

			if ($u[3]=="html") {
				$page="code/todo.html.php";
			}

			if ($u[3]=="json") {
				$page="code/todo.json.php";
			}
			
		} else {

			// Boo
			$page="code/404.php";

		}

	}

}

// Home page?
if ($u[1]=="") {
	if ($loggedin) {
		$page="code/home_user.php";
	} else {
		$page = "code/home.php";
	}
}

// And return the page
if (file_exists($page)) {
	if ( (($loginRequired)&&($loggedin)) || (!$loginRequired) ) {
		include $page;
	} else {
		include "code/user/login.php";
	}
} else {
	include "code/404.php";
}

// Close database
sql_close();

?>