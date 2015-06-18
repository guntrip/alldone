<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" dir="ltr">
<head><title>Todo</title>
<meta http-equiv="content-type" content="text/html; charset=UTF8">
<link href='http://fonts.googleapis.com/css?family=Slabo+27px' rel='stylesheet' type='text/css'>
<link href='http://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link rel="stylesheet" href="style.css" type="text/css"/>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/autosize.js"></script>
<script type="text/javascript" src="web.js"></script>
<script type="text/javascript" src="common.js"></script>
<script type="text/javascript" src="todo.js"></script>
<script type="text/javascript" src="design.js"></script>
<script type="text/javascript" src="data.js"></script>
<script type="text/javascript" src="details.js"></script>
<script type="text/javascript" src="magic.js"></script>
</head>
<body class=purple>
	<div id="wrapper">
	</div>
	<!--dialogs-->	
	<div id="overlay"></div>
	<div id="json_jazz"><textarea></textarea>
		<div>
			<input type=button value="Save Changes" onclick="json_mod_save();">
			<input type=button value="Cancel" onclick="json_mod_cancel();">
			<div class="note">This is JSON. You might have more fun copying this to a better text editor.</div>
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
</body>
</html>