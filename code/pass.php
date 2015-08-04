<?php

/*

	Use the 'local' database details when we're 
	running on this IP address. Remote is default.

*/

$localip="82.8.225.110";

$serversBase["remote"]=array();
$serversBase["remote"]["server"]="localhost";
$serversBase["remote"]["username"]="alldone";
$serversBase["remote"]["password"]="doneduck323";
$serversBase["remote"]["database"]="alldone";
$serversBase["remote"]["ml"]="http://www.alldone.io/";
$serversBase["remote"]["mobMl"]="http://m.alldone.io/";
$serversBase["remote"]["http"]="http://www.alldone.io/";

$serversBase["local"]=array();
$serversBase["local"]["server"]="localhost";
$serversBase["local"]["username"]="steve";
$serversBase["local"]["password"]="bertfish13";
$serversBase["local"]["database"]="alldone";	
$serversBase["local"]["ml"]="http://".$localip."/alldone.io/";
$serversBase["local"]["mobMl"]="http://".$localip."/alldone.io/";
$serversBase["local"]["secure"]="http://".$localip."/alldone.io/";

?>