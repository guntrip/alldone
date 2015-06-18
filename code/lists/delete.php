<?php

 include "code/design.top.php";

 
 if ($load_list["owner"]==$loginInfo["username"]) {

 	if ( $_POST["check"]==(date("z")-23) ) {


 		// Turn this into a function at some point :/

 			// delete file..
 			delete_file($load_list["loc_data"]["server"], $load_list["loc_data"]["store"], $load_list["loc_data"]["file"]);

 			// remove permissions
 			$query="DELETE FROM permissions WHERE fid = '".safe($load_list["fid"])."'";
     		$ee=sql_query($query);

     		// remove files db
 			$query="DELETE FROM files WHERE fid = '".safe($load_list["fid"])."'";
     		$ee=sql_query($query);


          echo "<div class=\"nicebox\">".
         "<b>Deleted! <a href=\"".$ml."\">Continue</a>.</b>".
         "</div>";


 	} else {
  
  	echo "<div class=\"nicebox\">".
  		 "Are you sure you want to delete <strong>/".$load_list["owner"]."/".$u[2]."/</strong>? This cannot be undone.".
  		 "</div>";

  	echo "<form id=\"deleter\" method=\"post\">".
  		 "<input type=\"hidden\" name=\"check\" value=\"".(date("z")-23)."\">".
  		 "<input type=\"submit\" value=\"Confirm deletion\" style=\"font-weight:bold;\">".
  		 "</form>";

  	}

}	

 include "code/design.bottom.php";

?>