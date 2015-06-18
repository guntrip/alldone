<?php

  include "code/design.top.php";

 
  if ($load_list["owner"]==$loginInfo["username"]) {

    // adding
    if ( (is_numeric($_POST["level"])) ) {

      // They are adding permissions!!
      if (($_POST["level"]<3)&&($_POST["username"]=="")) { echo "Username needed"; exit;exit;exit; }

        if (($_POST["level"]==8)||($_POST["level"]==9)) {

          $usercheck=[["uid"=>-1]];

        } else {

          // check the username exists..
          $query = "SELECT uid FROM users WHERE username = '".safe($_POST["username"])."'";
          $usercheck=sql_select($query);

        }

      if (sizeof($usercheck)==1) {


        $query="INSERT INTO permissions (uid,fid,type) ".
               "VALUES('".safe($usercheck[0]["uid"])."', '".safe($load_list["fid"])."', '".safe($_POST["level"])."');";
             
        $res=sql_insert($query);

        if (is_numeric($res)) {

          echo "<div class=\"nicebox\">".
         "<b>Permission added!</b> <a href=\"".$ml.$load_list["owner"]."/".$load_list["uri"]."/settings/\">Continue</a>.".
         "</div>";

         exit;exit;exit;

        }

      } else {

          echo "<div class=\"nicebox\">".
         "<b>Could not find a user called '".$_POST["username"]."'. Sorry!</b>".
         "</div>";

      }

    }

    // deleting
    if (is_numeric($_POST["delete_id"])) {

      // already checked ownership.
      $query="DELETE FROM permissions WHERE fid = '".safe($load_list["fid"])."' AND relationship = '".safe($_POST["delete_id"])."'";
      $ee=sql_query($query);

      if ($ee==true) {
        echo "<div class=\"nicebox\">".
         "<b>Permission deleted! <a href=\"".$ml.$load_list["owner"]."/".$load_list["uri"]."/settings/\">Continue</a>.</b>".
         "</div>";

         exit;exit;exit;
      }

    }


  	$query = "SELECT * FROM permissions ".
  			 "LEFT JOIN users ON permissions.uid = users.uid ".
  			 "WHERE fid = '".safe($load_list["fid"])."'";
  	$perms=sql_select($query);

  	echo "<div class=\"nicebox\">".
  		 "Editing permissions for <strong>/".$load_list["owner"]."/".$u[2]."/</strong>".
  		 "</div>";

  	echo "<ul class=\"listlist\">";

  	foreach ($perms as $p) {

  		echo "<li>";

  			if ($p["type"]==0) echo "<i class=\"fa fa-unlock\"></i> ";
  			if ($p["type"]==1) echo "<i class=\"fa fa-lock\"></i> ";
  			if ($p["type"]==2) echo "<i class=\"fa fa-unlock\"></i> ";
  			if ($p["type"]==8) echo "<i class=\"fa fa-globe\"></i> ";
  			if ($p["type"]==9) echo "<i class=\"fa fa-cogs\"></i> ";

  			if ($p["type"]<8) {
  				echo "<strong>".$p["username"]."</strong> ";

  				echo "(";
  				if ($p["type"]==0) { echo "full permissions"; }
  				if ($p["type"]==1) { echo "read only"; }
  				if ($p["type"]==2) { echo "read/write"; }
  				echo ")";

  			} elseif ($p["type"]==8) {
  				echo "public";
   			} elseif ($p["type"]==9) {
  				echo "demo";
  			}


  		if ($p["username"]!=$loginInfo["username"]) {
  		echo "<div style=\"float:right;\">".
  			 "<a style=\"font-weight:normal;cursor:pointer;\" onClick=\"$('#form_".$p["relationship"]."').submit();\">".
  			 "<i class=\"fa fa-trash\"></i> Remove".
  			 "</a>".
         "<form method=\"post\" id=\"form_".$p["relationship"]."\" action=\"\" style=\"display:inline;\"><input type=\"hidden\" name=\"delete_id\" value=\"".$p["relationship"]."\"></form>".
         "</div>";
  		}

  		echo "</li>";

  	}

  	echo "</ul>";

  

echo "<div class=\"nicebox\"><strong>Add permissions:</strong>";

echo "<form target=\"\" method=\"post\" id=\"perm\" class=\"quickform\">";

echo "<div><label for=\"username\">Username:</label> <input type=\"username\" id=\"username\" name=\"username\"></div>";

echo "<div><label for=\"level\">Level:</label> 

	 	<select id=\"level\" name=\"level\">
	 		<option value=\"0\">Full permissions</option>
	 		<option value=\"1\">Read only</option>
	 		<option value=\"8\">Public</option>
	 		<option value=\"9\">Demo</option>
	 	</select>

	</div>";

echo "<div><input type=\"submit\" value=\"Add permission\"></div></form>";

echo "<div style=\"font-size:0.85em;font-style:italic;\">".
      "<b>Permission explanation:</b><br />".
      "<b>Full permissions: </b> user can make all changes apart from permissions/deletion.<br />".
      "<b>Read only: </b> user can read but not modify.<br />".
      "<b>Public: </b> anyone can view list, even if not logged in.<br />".
      "<b>Demo: </b> anyone can view list and fiddle but no changes are saved".
      "</div>";

echo "</div>";

  include "code/design.bottom.php";

}

?>