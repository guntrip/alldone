<?php

include "code/design.top.php";
$showForm=true;
$errors=[];

if ($_POST["email"]!="") {

	$showForm=false;

	

	// check email is free.
	$email_check=sql_select("SELECT uid FROM users WHERE email = '".safe($_POST["email"])."'");
	if (sizeof($email_check)>0) {
		$errors["email"]="Email address exists";
	}

	// check username is free.
	$user_check=sql_select("SELECT uid FROM users WHERE username = '".safe($_POST["username"])."'");
	if (sizeof($user_check)>0) {
		$errors["username"]="User exists";
	}

	// password matches
	if ( ($_POST["password"]) != $_POST["password2"] ) {
		$errors["password2"]="Does not match";
	}

	// password ser
	if ($_POST["password"]=="") {
		$errors["password"]="Please set password";
	}

	if ( sizeof($errors) == 0 ) {

		// Generate salt
		$salt="";
		$characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for ($n = 1; $n < 21; $n++) {
		$salt.=$characters[rand(0,strlen($characters))];
		}
		$salt='$2a$07$'.$salt.'$'; // Blowfish

		// Hash password with salt
		$megapassword=crypt($_POST["password"], $salt);	 

		// Create user
		$query="INSERT INTO users (email, username, salt, password) ".
			   "VALUES('".safe($_POST["email"])."', '".safe($_POST["username"])."', '".safe($salt)."', '".safe($megapassword)."')";

		$uid=sql_insert($query);

		if (!is_numeric($uid)) {
			echo "<b>error creating user :(</b>";				
		} else {
			
			// Success! Now log them in.
			login($uid, "web");

			// Move to new user page
			echo "Hurrah, new account created for <b>".$_POST["username"]."</b>. ".
				 "<a href=\"".$ml."\">Click here to continue</a>.";

		}

	} else {

		$showForm=true;

	}


}

if ($showForm) {

echo "<form target=\"\" method=\"post\" id=\"signup\" class=\"quickform\">";

echo "<div><label for=\"email\">Email:</label> <input type=\"email\" id=\"email\" name=\"email\"></div>";
if ($errors["email"]) { echo "<div class=\"error\">".$errors["email"]."</div>"; }

echo "<div><label for=\"username\">Username:</label> <input type=\"text\" id=\"username\" name=\"username\"></div>";
if ($errors["username"]) { echo "<div class=\"error\">".$errors["username"]."</div>"; }

echo "<div><label for=\"password\">Password:</label> <input type=\"password\" id=\"password\" name=\"password\"></div>";
if ($errors["password"]) { echo "<div class=\"error\">".$errors["password"]."</div>"; }

echo "<div><label for=\"password2\">Repeat password:</label> <input type=\"password\" id=\"password2\" name=\"password2\"></div>";
if ($errors["password2"]) { echo "<div class=\"error\">".$errors["password2"]."</div>"; }

echo "<div><input type=\"submit\" value=\"Sign up\"></div></form>";

echo "<div style=\"margin-top:10px;border-top:1px solid #000;text-size:0.8em;font-style:italic;\">".
	 "alldone.io is currently in its infancy. While it will rapidly improve, please note that ".
	 "some features may not always function perfectly and there may be downtime. Your password is ".
	 "hashed with a unique salt but I've not yet set up HTTPS so please be aware your password is ".
	 "transmitted via HTTP during signup and login for now and pick accordingly.".
	 "</div>";

}

include "code/design.bottom.php";

?>