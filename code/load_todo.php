<?php

/* TODO APPLICATION 
 *
 * - phpized version of todo.php
 * - <?php echo $ml; ?> before scripts
 * - echo $load_script at bottom of <head>
 *
 */



$load_script="<script>var load_from_var=true;".
			 "var load_item=".($load_list["data"]).";".
			 "var load_owner='".$load_list["owner"]."';".
			 "var load_uid='".$loginInfo["uid"]."';".
			 "var load_title='".$load_list["uri"]."';".
			 "var load_permission='".$load_list["permission"]."';</script>";

// todo.php modded below:
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" dir="ltr">
<head><title>alldone.io/<?php echo $load_list["owner"]."/".$load_list["uri"]; ?></title>
<meta http-equiv="content-type" content="text/html; charset=UTF8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link href='http://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link rel="stylesheet" href="<?php echo $ml; ?>style.css" type="text/css"/>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>
<?php

	if (($useServer=="local")&&($_GET["forceMin"]!="true")) {

		echo "<script type=\"text/javascript\" src=\"".$ml."js/autosize.js\"></script>".
		"<script type=\"text/javascript\" src=\"".$ml."common.js\"></script>".
		"<script type=\"text/javascript\" src=\"".$ml."web.js\"></script>".
		"<script type=\"text/javascript\" src=\"".$ml."todo.js\"></script>".
		"<script type=\"text/javascript\" src=\"".$ml."design.js\"></script>".
		"<script type=\"text/javascript\" src=\"".$ml."data.js\"></script>".
		"<script type=\"text/javascript\" src=\"".$ml."details.js\"></script>".
		"<script type=\"text/javascript\" src=\"".$ml."magic.js\"></script>";

	} else {

	echo "<script type=\"text/javascript\" src=\"".$ml."web.min.js\"></script>\n";

	}

?>
<?php echo $load_script; ?>
</head>
<body class=slate>
	<div id="wrapper">
	</div>
	<!--dialogs-->	
	<div id="overlay"></div>
	<div id="json_jazz"><textarea></textarea>
		<div>
			<input type=button value="Save Changes" onclick="json_mod_save();">
			<input type=button value="Cancel" onclick="json_mod_cancel();">
			<div class="note">JSON</div>
		</div>
	</div>
	<div id="dialog" class="">
		<div class="title">Confirmation</div>
		<div class="content">
		</div>
		<div class="buttons">
			<input type="button" value="Save">
		</div>
	</div>
	<div id="updating"><i class="fa fa-cog fa-spin fa-3x"></i></div>
</body>
</html>