<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" dir="ltr">
<head><title>alldone.io <?php echo $title; ?></title>
<meta http-equiv="content-type" content="text/html; charset=UTF8">
<link href='http://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link rel="stylesheet" href="<?php echo $ml; ?>req/site.css" type="text/css"/>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<!--<script type="text/javascript" src="<?php echo $ml; ?>req/site.js"></script>-->
<?php echo $load_script; ?>
</head>
<body>
<div class=header>
		<a class=logo href="<?php echo $ml; ?>">alldone.io</a>
		<?php
		if ($loggedin) {

			echo "<div class=\"tools\">hello ".$loginInfo["username"]."<br />".
				 "<a href=\"".$ml."user/logout/\">logout</a></div>";

		}
		?>
</div>
<?php
	if ($loggedin) {
		echo "<nav>".
			 "<a href=\"".$ml."\">My lists</a>".
			 "<a href=\"".$ml."lists/new/\">New</a>".
			 //"<a href=\"".$ml."downloads/\">Downloads</a>".
			 "</nav>";
	} else {
		echo "<nav>".
			 "<a href=\"".$ml."user/login/\">Login</a>".
			 "<a href=\"".$ml."user/signup/\">Create account</a>".
			 "</nav>";	
	}
?>
<div class="content">