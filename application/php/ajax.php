<?php
    header('Content-type: application/json');
    
    $controller = $_POST['controller'];
    $action     = $_POST['action'];
    $data       = $_POST['data'];
    
    $className = sprintf('\controller\%s', ucfirst($controller));
    $classFile = sprintf('%s.php', $className);
    
    require_once '\controller\AbstractController.php';
    require_once $classFile;
    
    $class = new $className($data);
    $class->$action();
    
    $return = $class->{$action}();
    echo json_encode($return);