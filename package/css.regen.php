<?php

/*

	CREATES ../req/af.min.css

*/

include "cssmin-v3.0.1.php";

$fulLCss="";

$includes=array("../req/design.css",
				"../req/design.elements.css",
				"../req/design.graphs.css",
				"../req/design.modal.css",
				//"../req/cal.css",
				"../req/fontawesome/css/font-awesome.css",
				"../req/typeahead.css",
				"../req/page.summary.css",
				"../req/page.events.css");

$filters = array
        (
        "RemoveComments"                => true, 
        "RemoveEmptyRulesets"           => true,
        "RemoveEmptyAtBlocks"           => true
        );
$plugins=[];

foreach ($includes as $filename) {

$minifier = new CssMinifier(file_get_contents($filename), $filters, $plugins);
$fullCss .= $minifier->getMinified();

}

file_put_contents("../req/af.min.css", $fullCss);

?>