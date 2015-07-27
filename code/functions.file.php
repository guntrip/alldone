<?php

	function file_get_lists($uid) {

		// Get lists available to this user!
		$query="SELECT files.fid, files.server, files.store, files.file, files.uri, ".
			   "permissions.type, users.uid, users.username FROM files, permissions,users WHERE ".
			   "( permissions.uid = '".safe($uid)."' AND ".
			   "( permissions.type=0 OR permissions.type=1 OR permissions.type=2 ) ) AND ".
			   "permissions.fid = files.fid AND users.uid = files.owner ".
			   "ORDER BY users.username, uri";

		return sql_select($query);

	}

	function grab_list($username, $list, $save, $data) {

	global $loggedin, $loginInfo;

	$return=[];

	if ($loggedin) { 
		$userUid=$loginInfo["uid"];
	} else {
		$userUid=-1; // So non-users can access public stuff.
	}

		// One query to check permissions and return everthing we need. First
		// part of the OR checks for specific user permissions. Second part
		// ignores specific bits and instead checks for public or demo status.

		$query="SELECT files.fid, files.server, files.store, files.file, files.uri, ".
			   "permissions.type, users.uid, users.username ".
			   "FROM files, permissions, users ".
			   "WHERE ". /* user has permission: */
			   "( (users.username = '".safe($username)."') AND ".
			   "(files.owner = users.uid AND files.uri = '".safe($list)."') AND ".
			   "( permissions.uid = '".safe($userUid)."' AND ".
			   "( permissions.type=0 OR permissions.type=1 OR permissions.type=2 ) ) AND ".
			   "permissions.fid = files.fid ) ".
			   "OR ". /* file is public: */
			   "( (users.username = '".safe($username)."') AND ".
			   "(files.owner = users.uid AND files.uri = '".safe($list)."') AND ".
			   "(permissions.type=8 OR permissions.type=9) AND ".
			   "permissions.fid = files.fid) ".
			   "ORDER BY permissions.type";
	
		
		$search=sql_select($query);
	
		if (sizeof($search)>0) {

			// Neat, so we've found it!
			$l=$search[0];

			if ($save) {

				if ( ($l["type"]==0) || ($l["type"]==2) ) {

					// Save!
					save($l["server"], $l["store"], $l["file"], $data);
					$return["success"]=true;

				} else {

					$return["success"]=false;	
					$return["fail"]="permissions";		

				}

			} else {

				$file=load($l["server"], $l["store"], $l["file"]);
			
				if ($file!=-1) {
					$return["success"]=true;
					$return["permission"]=$l["type"];
					$return["owner"]=$l["username"];
					$return["uri"]=$l["uri"];
					$return["fid"]=$l["fid"];
					$return["loc_data"]=["server"=>$l["server"], "store"=>$l["store"], "file"=>$l["file"]];
					$return["data"]=$file;
				}

			}

		} else {
		$return["fail"]="notfound";
		}
		
	return $return;

	}

	function update_list($username, $list, $data) {

	global $loggedin, $loginInfo;
	
	// am I allowed to save? if so.. save.	

	}

	function new_list($uid, $uri) {

	global $this_server;

		$filename=make_file_name($uid);
		$empty=json_encode(["todo_list"=>[], "colourscheme"=>"slate", "mode"=>"horizontal"]);

		$query="INSERT INTO files (server, store, file, uri, owner) ".
			   "VALUES('".safe($this_server["saving_server"])."', ".
			   "'".safe($this_server["saving_store"])."', ".
			   "'".safe($filename)."', ".
			   "'".safe($uri)."', ".
			   "'".safe($uid)."');";

		$fid=sql_insert($query);

		if ($fid) {

			// We've got the whatsit. Now, create the file.
			save($this_server["saving_server"], $this_server["saving_store"], $filename, $empty);

			// And add permissions
			add_permission($uid, $fid, 0);

			return $fid;

		} else {

			return false;

		}


	}

	function add_permission($uid, $fid, $permission) {

		$query="INSERT INTO permissions (uid, fid, type) ".
			   "VALUES('".safe($uid)."', ".
			   "'".safe($fid)."', ".
			   "'".safe($permission)."');";

		$fid=sql_insert($query);

	}

	/*file level:*/

	function load($server, $store, $file) {

		global $filestore, $this_server;

		if ($this_server["id"]==$server) {

		// Eventually, we can configure stuff based on server and store
		$file_prefix=$filestore.$store."/";
		$filename=$file_prefix.$file;

		if (file_exists($filename)) {

			$loaded=file_get_contents($filename);
			//$loaded=unserialize($loaded);

			return $loaded;

		} else {
		return -1;
		}

		echo "<h1>".$filename."</h1>";

		} else {
			// contact other server...
			return -1;
		}

	

	}

	function save($server, $store, $file, $data) {

		global $filestore, $this_server;

		if ($this_server["id"]==$server) {

		// Eventually, we can configure stuff based on server and store
		$file_prefix=$filestore.$store."/";
		$filename=$file_prefix.$file;
	
		file_put_contents($filename, ($data));

		return 1;

		} else {
			// contact other server...
			return 0;
		}

	}

	function delete_file($server, $store, $file) {

			global $filestore, $this_server;

			if ($this_server["id"]==$server) {

				$file_prefix=$filestore.$store."/";
				$filename=$file_prefix.$file;

				unlink($filename);

				return 1;

			} else {

				return 0;

			}

	}


	/* little functions */
	function make_file_name($uid) {
		return $uid."_".base_convert(time(), 10, 36);
	}

?>