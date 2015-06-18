<?php

	function htmltamalize($list) {

		$html = "<ul>";

		foreach ($list as $l) {

			$html .= "<li>";

			if ($l["done"]) {
				$html .= "<i class=\"fa fa-check\"></i> ";				
			} else {
				$html .= "<i class=\"fa fa-times\"></i> ";
			}

			$html .= $l["title"];
			$html .= "</li>";

			if ( ($l["children"]) && (sizeof($l["children"])>0) ) {

				$html .= htmltamalize($l["children"]);

			}

		}

		$html .= "</ul>";

		return $html;

	}

	include "code/design.top.php";
	//print_r($load_list);
	
	echo "<strong>/".$load_list["owner"]."/".$load_list["uri"]."</strong>";

	$data=json_decode($load_list["data"], true);

	echo htmltamalize($data["todo_list"]);

	include "code/design.bottom.php";

?>