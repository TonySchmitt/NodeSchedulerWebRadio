<?php

  define("WEBROOT", "http://".$_SERVER["HTTP_HOST"]."/");
  define("DOCROOT", $_SERVER["DOCUMENT_ROOT"]."/");

  global $bdd;

  require DOCROOT."studio/mysql.php";

  if(isset($_GET) && $_GET['p'] == 'delete') {
    $bdd->query("DELETE FROM NS_playlist WHERE id=".$_GET['id']);
    header("Location: ".WEBROOT."studio/list_playlist.php");
    die();
  }
  $listSong = $bdd->query("SELECT * FROM NS_playlist")->fetchAll();

 ?>
 <html>
   <head>
     <meta charset="utf-8">
     <link href="<?= WEBROOT ?>css/bootstrap.min.css" rel="stylesheet">

       <!-- Custom Fonts -->
       <link href="<?= WEBROOT ?>css/font-awesome.min.css" rel="stylesheet" type="text/css">
     <meta name="viewport" content="width=device-width, initial-scale=1">

     <style>
     @font-face {
     	font-family: RadioStars;
     	src: url('<?= WEBROOT ?>font/radio stars.ttf');
     }

     body {
     }
     </style>
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
   <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
   <script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
   </head>
   <body style="background-color: #FFF; font-family: RadioStars; color: black;">
     <header class="col-md-8 col-md-offset-2 text-center">
       <h1>Studio NodeScheduler WebRadio</h1>
     </header>

     <content class="col-md-10 col-md-offset-1 text-center" style="margin-top: 60px;">
       <a href="<?= WEBROOT ?>studio/add_playlist.php"><button class="btn btn-success">Add Playlist</button></a>
       <br><br>
       <table class="table table-striped">
         <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Total Music</th>
          <th>Total Duration</th>
          <th>Action</th>
         </tr>
         <?php foreach($listSong as $playlist) {
           echo '<tr>';
           echo '<td>'.$playlist['id'].'</td>';
           echo '<td>'.$playlist['name'].'</td>';
           echo '<td>'.$playlist['name'].'</td>';
           echo '<td>'.$playlist['name'].'</td>';
           echo '<td>
           <a href="'.WEBROOT.'studio/add_playlist.php?p=modify&id='.$playlist['id'].'">
            <button class="btn btn-success"><i class="fa fa-pencil" aria-hidden="true"></i></button>
           </a> <a href="'.WEBROOT.'studio/list_playlist.php?p=delete&id='.$playlist['id'].'" onclick="return confirm(\'Sur de vouloir supprimer ?\');">
            <button class="btn btn-danger"><i class="fa fa-times" aria-hidden="true"></i></button>
           </a>';
           echo '</tr>';
         }
          ?>
       </table>
       <br><br>
         <a href="<?= WEBROOT ?>studio/add_playlist.php"><button class="btn btn-success">Add Playlist</button></a>
         <br><br>
     </content>
   </body>
 </html>
