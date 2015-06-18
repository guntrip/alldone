<?php

/*

	Use the 'local' database details when we're 
	running on this IP address. Remote is default.

*/

$localip="255.255.255.0";

$serversBase["remote"]=array();
$serversBase["remote"]["server"]="localhost";
$serversBase["remote"]["username"]="";
$serversBase["remote"]["password"]="";
$serversBase["remote"]["database"]="";
$serversBase["remote"]["ml"]="http://www.alldone.io/";
$serversBase["remote"]["http"]="http://www.alldone.io/";

$serversBase["local"]=array();
$serversBase["local"]["server"]="localhost";
$serversBase["local"]["username"]="";
$serversBase["local"]["password"]="";
$serversBase["local"]["database"]="";	
$serversBase["local"]["mobMl"]="http://".$localip."/alldone.io/";
$serversBase["local"]["secure"]="http://".$localip."/alldone.io/";

?>