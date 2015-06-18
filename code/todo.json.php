<?php

// Set up pretty print..
$json = json_decode($load_list["data"],true);

$pretty=json_encode($json["todo_list"], JSON_PRETTY_PRINT);

echo $pretty;

?>