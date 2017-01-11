<?php

if(isset($_POST) && !empty($_POST['id'])) {
  //var_dump($_POST);
  //
  define("WEBROOT", "http://".$_SERVER["HTTP_HOST"]."/");
  define("DOCROOT", $_SERVER["DOCUMENT_ROOT"]."/");

  global $bdd;

  require DOCROOT."studio/mysql.php";

  $id_song = $_POST['id'];
  $id_playlist = $_POST['id_playlist'];
  $move = $_POST['move'];


  $query = $bdd->query("SELECT * FROM NS_playlist_song WHERE id_playlist = $id_playlist ORDER BY song_order ASC");
  $result = $query->fetchAll();
  $query->closeCursor();
  $nombre = count($result);

  for ($i=0; $i<$nombre; $i++) {
    if($i < $nombre - 1 && $move == -1 && $result[$i+1]['id'] == $id_song) {
      $result[$i]['song_order']++;
    }
    if($i > 0 && $move == -1 && $result[$i]['id'] == $id_song) {
      $result[$i]['song_order']--;
    }
    if($i < $nombre - 1 && $move == 1 && $result[$i]['id'] == $id_song) {
      $result[$i]['song_order']++;
    }
    if($i > 0 && $move == 1 && $result[$i-1]['id'] == $id_song) {
      $result[$i]['song_order']--;
    }
    $bdd->query("UPDATE NS_playlist_song SET song_order = ".$result[$i]['song_order']." WHERE id = ".$result[$i]['id']);
  }

  //$bdd->query("INSERT INTO NS_playlist_song SET id_song = $id_song, id_playlist = $id_playlist, song_order = $nombre");

  $query = $bdd->query("SELECT ps.id, ps.song_order, ps.id_song, ps.id_playlist, s.name, s.author
    FROM NS_playlist_song AS ps, NS_song AS s
    WHERE ps.id_song = s.id AND ps.id_playlist = $id_playlist ORDER BY ps.song_order ASC");
  $result = $query->fetchAll();
  $query->closeCursor();

}
?>
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
