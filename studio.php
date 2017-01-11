<?php
  /**
  * Studio for the gestion of NodeScheduler
  */

  define("WEBROOT", "http://".$_SERVER["HTTP_HOST"]."/");
  define("DOCROOT", $_SERVER["DOCUMENT_ROOT"]);
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
    	src: url('font/radio stars.ttf');
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

    <content class="col-md-8 col-md-offset-2 text-center" style="margin-top: 60px;">
      <a href="<?= WEBROOT ?>studio/list_song.php"><button type="button" class="btn btn-default">Gestion des musiques</button></a><br><br>
      <a href="<?= WEBROOT ?>studio/list_playlist.php"><button type="button" class="btn btn-default">Gestion des playlists</button></a>
    </content>
  </body>
</html>
