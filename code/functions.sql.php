<?php

function sql_open() {
	global $mysqli, $dbServer, $dbUserName, $dbPassword, $dbDatabase;
	$mysqli = mysqli_connect($dbServer, $dbUserName, $dbPassword, $dbDatabase);
}

function sql_close() {
	global $mysqli;
	mysqli_close($mysqli);
}

function sql_select($query) {

global $mysqli;
			 	 
	$result = mysqli_query($mysqli, $query);	

	if (!$result) echo("<h3>".mysqli_error($mysqli)."</h3>");

	$rows=mysqli_num_rows($result);

	$return=[];

	for ($z = 0; $z < $rows; $z++) {

		$return[] = mysqli_fetch_assoc($result);

	}

    mysqli_free_result($result);	

	return $return;

}

function sql_insert($query) {

	global $mysqli;
		
	$result = mysqli_query($mysqli, $query);  

	if (!$result) echo("<h3>".mysqli_error($mysqli)."</h3>");

	return mysqli_insert_id($mysqli);

}

function sql_query($query) {

	global $mysqli;
		
	return mysqli_query($mysqli, $query);  

}


?>