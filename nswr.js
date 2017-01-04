"use strict";
/*
 * Ajout des packages
 */
var nodeshout = require('nodeshout');
var FileReadStream = require('nodeshout').FileReadStream,
	ShoutStream = require('nodeshout').ShoutStream;
var fs = require('fs');
var lame = require('lame');
var EventEmitter = require('events').EventEmitter;
var compareDate = require('./modules/compareDate');
var playl = require('./modules/playlist');
var Playlist = playl.Playlist;
var PlaylistEvent = playl.PlaylistEvent;
var PlaylistTimeSlot = playl.PlaylistTimeSlot;

/*
 * Initialisation de Shout pour se connecter à Icecast
 */

nodeshout.init();

var shout = nodeshout.create();

shout.setHost('localhost');
shout.setPort('8000');
shout.setUser('source');
shout.setPassword('hackme');
shout.setMount('mount');
shout.setFormat(1);
shout.setAudioInfo('bitrate', '128');
shout.setAudioInfo('samplerate', '44100');
shout.setAudioInfo('channels', '2');

shout.open();
var metadata = nodeshout.createMetadata();


/*
 * Initialisation d'une queue de lecture
 */
var date = new Date();
console.log(date.getTime());
var queue = new Array();
queue.push(["Bande Annonce Matte Box", "BA_Matte_Box.mp3", date, 32]);
//queue.push(["Jingle Onde Critique", "OC_jingle.mp3"]);
//queue.push(["Pudding A l'Arsenic - MAGOYOND", "PuddingRockCover.mp3"]);
//queue.push(["A Good Man - Doctor Who", "02 A Good Man.mp3"]);
//queue.push(["9th Art #15", "9th_Art_15 - 2015-12-20.mp3"]);

var listPlaylist = new Array();

var playlist1 = Object.create(Playlist);
playlist1.constructor("Playlist Doctor Who");
playlist1.addSong("A Good Man - Doctor Who", "02 A Good Man.mp3", 453);
playlist1.addSong("Concussed - Doctor Who", "04 Concussed.mp3", 207);

var playlist2 = Object.create(Playlist);
playlist2.constructor("Playlist MAGOYOND");
playlist2.addSong("Pudding A l'Arsenic - MAGOYOND", "PuddingRockCover.mp3", 157);

var playlist3 = Object.create(Playlist);
playlist3.constructor("Playlist Emission");
//playlist3.addsong("Onde Critique", "OC_jingle.mp3", 58);
playlist3.addSong("9th Art", "9th_Art_15 - 2015-12-20.mp3", 3119)

listPlaylist.push(playlist1);
listPlaylist.push(playlist2);
listPlaylist.push(playlist3);


var category = Object.create(PlaylistTimeSlot);
category.initPlaylistTimeSlot();
category.addPlaylist(playlist1, "14:10:00", "09:10:00");
category.addPlaylist(playlist2, "09:10:00", "14:39:59");

var playlistEvent = Object.create(PlaylistEvent);
playlistEvent.initPlaylistEvent();
playlistEvent.addPlaylist(playlist3, "16/11/2016", "17:55:00");


/*
 *
 */
var Jingle = Object.create(Playlist);
Jingle.constructor("Jingle");
for (var i = 1; i < 18; i++) {
	Jingle.addSong("Jingle", "Jingle/Jingle ("+i+").mp3", 6);
}



/*
 * Gestion du player automatique
 */

var player = new EventEmitter();
var fs = require('fs');
var file = null;
var encoder;
var decoder = new lame.Decoder();

player.on('player_split', function () {
	var date = new Date();
	var s = date.getTime();
	//s += 4*3600*1000 + 50*60*1000;
	date.setTime(s);
	console.log("Queue : ");
	for(var i=0; i<queue.length; i++) {
		queue[i][2] =  new Date(date.getTime());
		console.log("- " + queue[i][0] + "-" + queue[i][1] + ", " + queue[i][2].toLocaleTimeString());
		var time = date.getTime();
		time += queue[i][3]*1000;
		date.setTime(time);
	}
	currentsong[1] = queue[0][2].toLocaleString("en-EN");
	currentsong[2] = queue[1][2].toLocaleString("en-EN");
	queue.splice(0,1);
	if(queue.length <= 3) {
		player.emit('add_queue');
	}
});

player.on('add_queue', function() {
		var jingle = Jingle.randSong();
		var date = new Date();
		date.setTime(queue[queue.length-1][2].getTime());

		var ms = date.getTime() - queue[queue.length-1][3]*1000;
		var date1 = new Date();
		date1.setTime(ms);

		queue.push([jingle[0], jingle[1], date, jingle[2]]);

		var date2 = new Date();
		date2.setTime(queue[queue.length-2][2].getTime());

		var pe = playlistEvent.selectPlaylistEvent(date1, date2);

		if(pe) {
			var song = pe.onesong()
		} else {
			var song = category.selectRandomPlaylistInTime(date.toLocaleTimeString()).randSong();
		}
		queue.push([song[0], song[1], date.toLocaleTimeString, song[2]]);
		console.log("add a song to the queue, " + date.toLocaleTimeString());
});


/*
 * Player
 */
var currentsong = new Array();
player.on('play_queue', function() {
	if(file != null) {
		decoder.unpipe();
		file.unpipe(decoder);
		file.close();
		//console.log('A');
	}
	var song = queue[0];
	currentsong[0]=song[0];
	console.log("Current Song : " + currentsong);
	player.emit('player_split'); //supprime le son de la queue
	file = new fs.createReadStream("musique/"+song[1]);
	//console.log('B');
	decoder = new lame.Decoder();
	decoder.on('format', function(format) {
		encoder = new lame.Encoder({
			// input
			channels: format['channels'],        // 2 channels (left and right)
			bitDepth: 16,       // 16-bit samples
			sampleRate: format['sampleRate'],  // 44,100 Hz sample rate

			// output
			bitRate: 128,
			outSampleRate: 44100,
			mode: lame.STEREO  // STEREO (default), JOINTSTEREO, DUALCHANNEL or MONO
		});
		metadata.add('song', song[0]);
		shout.setMetadata(metadata);
		var s = decoder.pipe(encoder).pipe(new ShoutStream(shout));
		//console.log('G');
		s.on('finish', function() {
			player.emit('play_queue');
		});
	});
	//console.log('C');
  	file.pipe(decoder);
});

player.emit('add_queue');
player.emit('play_queue');


var http = require('http');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    console.log('Utilisateur connecté');
});
// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
    // Quand le serveur reçoit un signal de type "message" du client
    socket.on('message', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
    });
    socket.on('updateClient', function(){
        socket.emit('updateServer', currentsong[0],currentsong[1],currentsong[2]);
        socket.emit('updateQueueServer', queue);
        socket.emit('updatePlaylistServer', listPlaylist[0].getName());
    });

    socket.on('removeOneQueue', function(i) {
    	console.log('remove the ' + i + 'eme element');
		queue.splice(i,1);
    });
});


server.listen(8080);
