<?php
    if (isset($_GET['isAll'])) {
        $data = [
            ["txt" => "One",    "val" => "1" ],
            ["txt" => "Two",    "val" => "2" ],
            ["txt" => "Three",  "val" => "3" ]
        ];
        exit(json_encode($data));
    }