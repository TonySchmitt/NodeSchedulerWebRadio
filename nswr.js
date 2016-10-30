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
 * Initialisation d'une queue de lecture
 */

var queue = new Array();
queue.push(["Bande Annonce Matte Box", "BA_Matte_Box.mp3"]);
queue.push(["Jingle Onde Critique", "OC_jingle.mp3"]);
queue.push(["Pudding A l'Arsenic - MAGOYOND", "PuddingRockCover.mp3"]);
queue.push(["A Good Man - Doctor Who", "02 A Good Man.mp3"]);
queue.push(["9th Art #15", "9th_Art_15 - 2015-12-20.mp3"]);


var player = new EventEmitter();
var fs = require('fs');
var file = null;
var encoder;
var decoder = new lame.Decoder();


player.on('play_queue', function() {
	if(file != null) {
		decoder.unpipe();
		file.unpipe(decoder);
		file.close();
		//console.log('A');
	}
	file = new fs.createReadStream("musique/"+queue[0][1]);
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
		metadata.add('song', queue[0][0]);
		shout.setMetadata(metadata);
		var s = decoder.pipe(encoder).pipe(new ShoutStream(shout));
		//console.log('G');
		s.on('finish', function() {
			queue.splice(0,1);
			player.emit('play_queue');
		});
	});
	//console.log('C');
  	file.pipe(decoder);
});

player.emit('play_queue');

