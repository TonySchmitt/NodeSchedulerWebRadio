<?php

  define("WEBROOT", "http://".$_SERVER["HTTP_HOST"]."/");
  define("DOCROOT", $_SERVER["DOCUMENT_ROOT"]."/");

  global $bdd;

  require DOCROOT."studio/mysql.php";

  require DOCROOT . "studio/Form.php";


  if(isset($_POST) && !empty($_POST)) {
    $name = $bdd->quote($_POST['name']);
    $author = $bdd->quote($_POST['author']);
    $path = $bdd->quote($_POST['path_file']);
    $duration = floor($_POST['duration']*1000);

    if(isset($_GET) && $_GET['p'] == "modify")
      $bdd->query("UPDATE NS_song SET name = $name, author = $author, path_file = $path, duration = $duration WHERE id=".$_GET['id']);
    else
      $bdd->query("INSERT INTO NS_song SET name = $name, author = $author, path_file = $path, duration = $duration");
  }

  if(isset($_GET) && $_GET['p'] == "modify") {
    $song = $bdd->query("SELECT * FROM NS_song WHERE id=".$_GET['id'])->fetch();
    $form = new Form($song);
  } else {
    $form = new Form();
  }

 ?>
 <html>
   <head>
     <meta charset="utf-8">
     <link href="<?= WEBROOT ?>css/bootstrap.min.css" rel="stylesheet">

       <!-- Custom Fonts -->
       <link href="<?= WEBROOT ?>css/font-awesome.min.css" rel="stylesheet" type="text/css">
       <link rel="stylesheet" href="<?= WEBROOT ?>jquery.fileTree/jqueryFileTree.css">
     <meta name="viewport" content="width=device-width, initial-scale=1">

     <style>
     @font-face {
     	font-family: RadioStars;
     	src: url('<?= WEBROOT ?>font/radio stars.ttf');
     }

     body {
     }
     </style>
     <script src="<?= WEBROOT ?>jquery.js"></script>
     <script src="<?= WEBROOT ?>jquery.fileTree/jqueryFileTree.js"></script>
   <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
   <script src="//cdn.tinymce.com/4/tinymce.min.js"></script>
   </head>
   <body style="background-color: #FFF; color: black;">
     <header class="col-md-8 col-md-offset-2 text-center" style="font-family: RadioStars;">
       <h1>Studio NodeScheduler WebRadio</h1>
     </header>

     <content class="col-md-10 col-md-offset-1 text-center" style="margin-top: 60px;">
       <form action="" method="post">
         <?= $form->input("name", "name", ["placeholder" => "Name of the song."]) ?><br>
         <?= $form->input("author", "author", ["placeholder" => "Author of the song."]) ?>
         <?= $form->input("path_file", "path_file", ["type" => "hidden"]) ?>
         <?= $form->input("duration", "duration", ["type" => "hidden"]) ?>
         <br><br>
       <div class="row">
         <h4 class="text-left">Select a File</h4>
         <div id="container_id" class="text-left col-md-4"></div>
         <div class="col-md-8">
           <p>Path File : <span id="pathFile"><?php if(isset($song)) {echo $song['path_file'];} ?></span></p>
           <p>Duration File : <span id="durationFile"><?php if(isset($song)) {echo $song['duration'];} ?></span></p>
           <audio id="audioFile" src="<?php if(isset($song)) {echo WEBROOT.substr($song['path_file'],23);} ?>" controls></audio>
         </div>
       </div>
       <div class="row">
         <button class="btn btn-success" type="submit"><?php if(isset($song)) {echo 'Modify Song';} else {echo 'Add Song';} ?></button>
       </div>
       </form>
     </content>
     <script>
     $(document).ready( function() {
         $('#container_id').fileTree({ root: '/var/www/NodeScheduler/musique/' }, function(file) {
             $('#pathFile').html(file);
             $('#path_file').val(file);
             var audio = document.querySelector('#audioFile');
             audio.src = "<?= WEBROOT ?>" + file.substr(23);
             audio.addEventListener('loadedmetadata', function() {
                  audio.play();
                  $('#durationFile').html(audio.duration + " s");
                  $('#duration').val(audio.duration);
              });
         });
      });
     </script>
   </body>
 </html>
