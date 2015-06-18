<?php

include "js.min.php";

$includes=array("../req/jquery-1.9.1.min.js",
				"../req/jquery.cookie.js",
				"../req/typeahead.min.js",
				"../req/pikaday.js",
				"../req/af.js");
				
$finalSave="../req/min.js";
				
	$complete="";
				
	for ($d = 0; $d < (sizeof($includes)); $d++) {
		
		$filename=$includes[$d];
		if (file_exists($filename)) {
		$content = file_get_contents($filename);		
		$complete=$complete."/*".$filename."*/".$content;
		echo "<pre>".$filename."</pre>";
		} else {
		echo "<h3>".$filename." not found.</h3>";
		}
	
	}
	
	$complete = JSMin::minify($complete);

	echo "<h2>Done</h2>";
	file_put_contents($finalSave, $complete);

?>