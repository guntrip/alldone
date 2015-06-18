<?php

	/********************************************
		alldone.io

		sql:	user (uid, email, salt, password)
				session (uid>session)
				files (fid>filename)
				permissions (uid>fid, type (0:user_all, 1:user_read, 2:user_write, 8:public, 9:demo) )

		file access procedure:
				if uid has permissions to fid, work!

		plan: as few calls as possible!

		---

		unless we're logging in, session is passed in $_POST which is picked up on and 
		checked by def.inc.php so we can just check $loggedin :)



	*********************************************/
	
	header('Access-Control-Allow-Origin: *');
	$return=[];
	include "api_code/functions.api.php";

	if ($_POST) {

		if ($_POST["request"]=="login") {

			$session = api_login($_POST["user"], $_POST["pswd"]);

			if ($session==-1) {
				$return["result"]=0;				
			} else {

				$return["result"]=1;
				$return["session"]=$session["session"];
				$return["uid"]=$session["uid"];
			}

		} else {

			if (($_POST["session"])) {

				if ($_POST["request"]=="grab") {	
					// don't check logged in, as it would be weird if they were not
					// and maybe they should bea ble to get public lists!
				
					$list=$_POST["list"];
					$list_ex=explode("/",$list);

					$return["result"]=0;

					if(sizeof($list_ex)==2) {

						// Try and load it.
						$load_list=grab_list($list_ex[0], $list_ex[1], false, []);

						if ($load_list["success"]) {

							$return["list_data"]=$load_list["data"]; // still needs to be parsed by js
							$return["permission"]=$load_list["permission"];
							$return["uri"]=$load_list["uri"];
							$return["owner"]=$load_list["owner"];
							$return["result"]=1;

						}

					}

				}	

				if ($_POST["request"]=="update") {

					if ($loggedin) {

					$check=grab_list($_POST["owner"], $_POST["uri"], true, $_POST["data"]);	

						if ($check["success"]) {
							$return["result"]=1;						
						} else {
							$return["result"]=0;
							$return["error"]="notfound";	
						}

					} else {
					$return["result"]=0;
					$return["error"]="login";
					}
				}	

				if ($_POST["request"]=="delete") {
				
				}

				if ($_POST["request"]=="lists") {

					if ($loggedin) {

						// list of available lists.
						$result=file_get_lists($loginInfo["uid"]);

						$return["result"]=1;
						$return["data"]=clean_lists($result);

					} else {

						$return["result"]=0;
						$return["error"]="login";

					}

				}	

			} else {
				$return["result"]=0;
				$return["error"]="session";
			}

		}

	}

	// Output JSON
	echo json_encode($return);

?>