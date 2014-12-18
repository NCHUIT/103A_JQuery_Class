<?php

if(file_exists("record.json"))
    $record = json_decode(file_get_contents("record.json"),true);
else
    $record = array();

if(isset($_GET['name']) && isset($_GET['win'])){
    if($_GET['name'] != strip_tags($_GET['name'])){
        http_response_code(405);
        exit();
    }
    if(!isset($record[$_GET['name']]))
        $record[$_GET['name']] = 0;
    if($_GET['win'] === 'true')
        $record[$_GET['name']]++;
    else
        $record[$_GET['name']]--;
}

/*
foreach ($record as $key => $value) {
        if($key != strip_tags($key))
                unset($record[$key]);
}*/

file_put_contents("record.json",json_encode($record));

echo json_encode($record);
?>
