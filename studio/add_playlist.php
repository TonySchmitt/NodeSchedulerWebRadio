<?php

  define("WEBROOT", "http://".$_SERVER["HTTP_HOST"]."/");
  define("DOCROOT", $_SERVER["DOCUMENT_ROOT"]."/");

  global $bdd;

  require DOCROOT."studio/mysql.php";

  $list = $bdd->query("SELECT * FROM NS_song")->fetchAll();
  foreach ($list as $key) {
    $listSong[$key['author']." - ".$key['name']] = $key['id'];
  }

  require DOCROOT . "studio/Form.php";


  if(isset($_POST) && !empty($_POST)) {
    $name = $bdd->quote($_POST['name']);

    if(isset($_GET) && $_GET['p'] == "modify")
      $bdd->query("UPDATE NS_playlist SET name = $name WHERE id=".$_GET['id']);
    else
      $bdd->query("INSERT INTO NS_playlist SET name = $name");
  }

  if(isset($_GET) && $_GET['p'] == "modify") {
    $q = $bdd->query("SELECT * FROM NS_playlist WHERE id=".$_GET['id']);
    $song = $q->fetch();
    $q->closeCursor();
    $form = new Form($song);
    $query = $bdd->query("SELECT ps.id, ps.song_order, ps.id_song, ps.id_playlist, s.name, s.author
      FROM NS_playlist_song AS ps, NS_song AS s
      WHERE ps.id_song = s.id AND ps.id_playlist = ".$_GET['id']." ORDER BY ps.song_order ASC");
    $result = $query->fetchAll();
    $query->closeCursor();
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
         <?= $form->input("name", "name", ["placeholder" => "Name of the playlist."]) ?><br>

         <div class="row">
           <button class="btn btn-success" type="submit"><?php if(isset($song)) {echo 'Modify Playlist';} else {echo 'Add Playlist';} ?></button>
         </div>
       </form>
       <br><br><br>
       <?php
       if(isset($_GET) && $_GET['p'] == "modify")
       {
        ?>
       <div class="row">
        <h3>List of the playlist song</h3>
         <p id="result">
           <table class="table table-striped">
             <tr>
              <th>Order</th>
              <th>Name</th>
              <th>Author</th>
              <th class="text-right">Actions</th>
            </tr>
           <?php
             foreach ($result as $key) {
               echo '<tr><td>'.$key['song_order'].'</td>';
               echo '<td>'.$key['name'].'</td>';
               echo '<td>'.$key['author'].'</td>';
               echo '<td class="text-right">
               <div class="btn btn-default" onclick="moveSong('.$key['id'].', -1)"><i class="fa fa-arrow-up" aria-hidden="true"></i></div>
               <div class="btn btn-default" onclick="moveSong('.$key['id'].', 1)"><i class="fa fa-arrow-down" aria-hidden="true"></i></div>
               <div class="btn btn-danger" onclick="deleteSong('.$key['id'].')"><i class="fa fa-times" aria-hidden="true"></i></div></td>';
               echo '</tr>';
             }
            ?>
           </table>
         </p>
       </div>
       <br><br><br>
       <div class="row">
        <h3>Add a Song to the playlist</h3>
         <?= $form->select("id_song", "id_song", $listSong); ?>
         <div id="AddSong" class="btn btn-success">Add this song on the playlist</div>
       </div>
       <?php
        }
        ?>
     </content>
     <script>
       function moveSong(id, move) {
         var id_playlist = parseInt("<?= $_GET['id'] ?>");
         $.post("<?= WEBROOT ?>studio/move_ajax_song_playlist.php", {id: id, id_playlist: id_playlist, move: move}).done(function (data) {
           $("#result").html(data);
         });
       }

       function deleteSong(id) {
         var id_playlist = parseInt("<?= $_GET['id'] ?>");
         $.post("<?= WEBROOT ?>studio/delete_ajax_song_playlist.php", {id: id, id_playlist: id_playlist}).done(function (data) {
           $("#result").html(data);
         });
       }

      $("#AddSong").click(function() {
        var id = $("#id_song").val();
        var id_playlist = parseInt("<?= $_GET['id'] ?>");
        $.post("<?= WEBROOT ?>studio/add_ajax_song_playlist.php", {id: id, id_playlist: id_playlist}).done(function (data) {
          $("#result").html(data);
        });
      });

     </script>
   </body>
 </html>
