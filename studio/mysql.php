<?php
global $bdd;

try {
	$bdd = new \PDO('mysql:host=localhost;dbname=NodeScheduler;charset=utf8', "root", "v5H8ncL43");
}
catch (Exception $e) {
	die('Erreur : '.$e->getMessage());
}
