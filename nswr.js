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
 * Test heure
 */



function compareStringHours(hours1, hours2) {
	var h1 = parseInt(hours1.substr(0,2));
	var h2 = parseInt(hours2.substr(0,2));
	var m1 = parseInt(hours1.substr(3,2));
	var m2 = parseInt(hours2.substr(3,2));
	var s1 = parseInt(hours1.substr(6,2));
	var s2 = parseInt(hours2.substr(6,2));

	if(h1 > h2 || (h1 == h2 && m1 > m2) || (h1 == h2 && m1 == m2 && s1 > s2)) {
		return 1;
	} else if (h1 == h2 && m1 == m2 && s1 == s2) {
		return 0;
	} else {
		return -1;
	}
}

/*
 * Initialisation d'une queue de lecture
 */

var queue = new Array();
queue.push(["Bande Annonce Matte Box", "BA_Matte_Box.mp3"]);
//queue.push(["Jingle Onde Critique", "OC_jingle.mp3"]);
//queue.push(["Pudding A l'Arsenic - MAGOYOND", "PuddingRockCover.mp3"]);
//queue.push(["A Good Man - Doctor Who", "02 A Good Man.mp3"]);
//queue.push(["9th Art #15", "9th_Art_15 - 2015-12-20.mp3"]);


/*
 * Playlist
 * Gestion des playlists en fonctions de tranche horaires
 */

var Playlist = {
	
	initPlaylist: function (name) {
		this.name = name;
		this.playlist = new Array();
	},

	addsong: function (name, url, duration) {
		this.playlist.push([name, url, duration]);
	},

	onesong: function() {
		return this.playlist[0];
	},

	randsong: function() {
		var i = Math.floor(Math.random() * this.playlist.length);
		return this.playlist[i];
	}

};

var PlaylistTimeSlot = {

	initPlaylistTimeSlot: function() {
		this.listPlaylist = new Array();
	},

	addPlaylist: function(playlist, beginTime, endTime) {
		this.listPlaylist.push([playlist, beginTime, endTime]); //format : HH:MM:SS
	},

	selectRandomPlaylistInTime: function(time) {
		var playlistNow = new Array();
		this.listPlaylist.forEach(function (element) {
			var begin = compareStringHours(time, element[1]);
			var end = compareStringHours(time, element[2]);
			if((begin == 1 || begin == 0) && end == -1) {
				playlistNow.push(element);
			}
		});
		if(playlistNow.length == 0) {
			return false;
		}
		var i = Math.floor(Math.random() * playlistNow.length);
		return playlistNow[i][0];
	}
}

var playlist1 = Object.create(Playlist);
playlist1.initPlaylist("Playlist Test");
playlist1.addsong("A Good Man - Doctor Who", "02 A Good Man.mp3", 453);

var playlist2 = Object.create(Playlist);
playlist2.initPlaylist("Playlist Test");
playlist2.addsong("Pudding A l'Arsenic - MAGOYOND", "PuddingRockCover.mp3", 157);

var category = Object.create(PlaylistTimeSlot);
category.initPlaylistTimeSlot();
category.addPlaylist(playlist2, "00:00:00", "10:35:00");
category.addPlaylist(playlist1, "10:35:00", "23:59:59");

/*
 *
 */
var Jingle = Object.create(Playlist);
Jingle.initPlaylist("Jingle");
for (var i = 1; i < 18; i++) {
	Jingle.addsong("Jingle", "Jingle/Jingle ("+i+").mp3");
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
	queue.splice(0,1);
	if(queue.length <= 3) {
		player.emit('add_queue');
	}
});

player.on('add_queue', function() {
		var jingle = Jingle.randsong();
		queue.push([jingle[0], jingle[1]]);
		var date = new Date();
		var song = category.selectRandomPlaylistInTime(date.toLocaleTimeString()).onesong();
		queue.push([song[0], song[1]]);
		console.log("add a song to the queue, " + date.toLocaleTimeString());
});


/*
 * Player
 */

player.on('play_queue', function() {
	if(file != null) {
		decoder.unpipe();
		file.unpipe(decoder);
		file.close();
		//console.log('A');
	}
	var song = queue[0];
	player.emit('player_split'); //supprime le son de la queue
	file = new fs.createReadStream("musique/"+song[1]);
	//console.log('B');
	decoder = new lame.Decoder();
	decoder.on('format', function(format) {
		//console.log('E');
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
		//console.log('F');
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

