<?php

namespace controller;

use \controller\AbstractController;

class Controller extends AbstractController {
    public function createUid() {
        return uniqid();
    }
}