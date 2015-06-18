<?php

$showForm=true;
$loginFail=false;;

if ($_POST["email"]) {

	$query="SELECT * FROM users WHERE email = '".safe($_POST["email"])."'";
	$login_results=sql_select($query);

	if (sizeof($login_results)==1) {

		// Check password.
		$testPassword=crypt($_POST["password"], $login_results[0]["password"]);

		if ( $testPassword == $login_results[0]["password"] ) {

			// Hurrah. Log them in!
			login($login_results[0]["uid"], "web");
			header("Location: ".$ml);

		} else {

			$showForm=true;
			$loginFail=true;

		}

	} else {

		$showForm=true;
		$loginFail=true;

	}

}

if ($showForm) {

 include "code/design.top.php";

echo "<form target=\"\" method=\"post\" id=\"login\" class=\"quickform\">";

if ($loginFail) {
	echo "<b>Log in failed! Please check your email address and password.</b>";
}

echo "<div><label for=\"email\">Email:</label> <input type=\"email\" id=\"email\" name=\"email\"></div>";

echo "<div><label for=\"password\">Password:</label> <input type=\"password\" id=\"password\" name=\"password\"></div>";

echo "<div><input type=\"submit\" value=\"Log in\"></div></form>";

echo "<div style=\"margin-top:10px;border-top:1px solid #000;text-size:0.8em;font-style:italic;\">".
	 "Forgotten your password? Please email Steve to reset it".
	 "</div>";

include "code/design.bottom.php";

}

?>