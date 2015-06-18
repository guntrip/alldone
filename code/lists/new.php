<?php

	include "code/design.top.php";

	$showForm=true;

	if ($_POST["newname"]) {

		$showForm=false;

		if ( preg_match("/^[a-z0-9_-]+$/i", $_POST["newname"]) ) {

			// Does it exist already?
			$check="SELECT fid FROM files WHERE ".
				   "(owner = '".safe($loginInfo["uid"])."' AND ".
				   "uri = '".safe($_POST["newname"])."')";

			$check_results=sql_select($check);

			if (sizeof($check_results)==0) {

			// Create list!
			$fid = new_list($loginInfo["uid"], $_POST["newname"]);

			echo "<div class=nicebox><b>Hurrah! List created!</b><br /><br />".
			     "Go to <a href=\"".$ml.$loginInfo["username"]."/".$_POST["newname"]."/\">".$ml.$loginInfo["username"]."/".$_POST["newname"]."/</div>";

			} else {
			echo "Sorry, you already own a list with that name.";
			}

		} else {
		echo "Sorry. Invalid characters!";
		}

	}

	if ($showForm) {

	echo "<div class=nicebox>Create a new list!</div>";


	echo "<form target=\"\" method=\"post\" id=\"newlist\" class=\"quickform\">";

	echo "<div><label for=\"newname\">List name:</label> <input type=\"text\" id=\"newname\" name=\"newname\"></div>";

	echo "<div><input type=\"submit\" value=\"Create\"></div></form>";

	echo "<div style=\"margin-top:10px;font-size:0.9em;font-style:italic;\">".
		 "Your list will appear at ".$ml.$loginInfo["username"]."/<strong>list_name</strong>/. Initial ".
		 "permissions will only allow you to use it but you can change that and other settings later. You ".
		 "can only use alphanumeric charcters, underscores and hyphens.".
		 "</div>";

	}


	include "code/design.bottom.php";

?>