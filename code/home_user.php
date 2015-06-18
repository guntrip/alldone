<?php

include "design.top.php";

$available=file_get_lists($loginInfo["uid"]);

echo "<div class=nicebox>";
if (sizeof($available)>0) { 
	echo "These are the lists you've created and that have been shared with you:";
} else {
	echo "You have no lists yet. Click 'New' to create one.";
}	
echo "</div>";

echo "<ul class=\"listlist\">";
foreach ($available as $file) {

	echo "<li><a href=\"".$ml.$file["username"]."/".$file["uri"]."/\">/".$file["username"]."/".$file["uri"]."/</a>";

		if ($file["username"]==$loginInfo["username"]) {
			echo "<a href=\"".$ml.$file["username"]."/".$file["uri"]."/settings/\" title=\"permissions\"><i class=\"fa fa-eye\"></i></a>";
			echo "<a href=\"".$ml.$file["username"]."/".$file["uri"]."/delete/\" title=\"delete\"><i class=\"fa fa-trash\"></i></a>";
		}

	echo "</li>";

}
echo "</ul>";

include "design.bottom.php";

?>