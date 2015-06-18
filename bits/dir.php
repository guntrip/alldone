<?php

	// Makes directories.
	$dir=$filestore."0";
	if (mkdir($dir, 0777, true)) {
	echo "CREATE	".$dir."\n";
	} else {
	echo "<b>FAILED</b>	".$dir."\n";
	}

?>