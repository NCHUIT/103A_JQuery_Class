<?php

if(file_exists("record.json"))
    $record = json_decode(file_get_contents("record.json"),true);
else
    $record = array();

if(isset($_GET['name']) && isset($_GET['win'])){
    if(!isset($record[$_GET['name']]))
        $record[$_GET['name']] = 0;
    if($_GET['win'] === 'true')
        $record[$_GET['name']]++;
    else
        $record[$_GET['name']]--;
}

file_put_contents("record.json",json_encode($record));

echo json_encode($record);
?>
