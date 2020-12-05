<?php
    if (isset($_GET['isAll'])) {
        $data = [
            ["txt" => "One",    "val" => "1" ],
            ["txt" => "Two",    "val" => "2" ],
            ["txt" => "Three",  "val" => "3" ]
        ];
    } else  {
        $first_lets = mb_substr($_GET['search'], 0, 2);
        switch ($first_lets) {
            case "On":
                $data = [
                    ["txt" => "One",    "val" => "1" ]
                ];
                break;
            case "Tw":
                $data = [
                    ["txt" => "Two",    "val" => "2" ]
                ];
                break;
            case "Th":
                $data = [
                    ["txt" => "Three",    "val" => "3" ]
                ];
                break;
        }

    }

    exit(json_encode($data));