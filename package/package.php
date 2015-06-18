<?php

	include "cssmin-v3.0.1.php";
	include "js.min.php";

	$all=array("../js/autosize.js",
			   "../common.js",
			   "../data.js",
			   "../design.js",
			   "../details.js",
			   "../magic.js",
			   "../todo.js");

	$complete="";
				
	for ($d = 0; $d < (sizeof($all)); $d++) {
		
		$filename=$all[$d];
		if (file_exists($filename)) {

		$content = file_get_contents($filename);		
		$complete=$complete."/*".$filename."*/".$content;

		echo "<pre>".$filename."</pre>";
		} else {
		echo "<h3>".$filename." not found.</h3>";
		}
	
	}		
	
	$complete = JSMin::minify($complete);

	// Now add specifics..
	$web = file_get_contents("../web.js");
	echo "<pre>"."../web.js"."</pre>";
	$web_min = JSMin::minify($web);

	$app = file_get_contents("../app.js");
	echo "<pre>"."../app.js"."</pre>";
	$app_min = JSMin::minify($app);

	file_put_contents("results/web.min.js", $complete.$web_min);
	file_put_contents("results/app.min.js", $complete.$app_min);

	// Now the CSS (currently we don't use...)
	$filters = array
        (
        "RemoveComments"                => true, 
        "RemoveEmptyRulesets"           => true,
        "RemoveEmptyAtBlocks"           => true
        );
	$plugins=[];

	$minifier = new CssMinifier(file_get_contents("../style.css"), $filters, $plugins);
	$fullCss .= $minifier->getMinified();
	echo "<pre>"."../style.css"."</pre>";

	file_put_contents("results/shiny.css", $fullCss);

?>