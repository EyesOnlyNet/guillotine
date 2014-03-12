<?php

namespace controller;

abstract class AbstractController {
    protected $data;
    
    public function __construct($data) {
        $this->data = (object) $data;
    }
}