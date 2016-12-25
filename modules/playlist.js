var compareDate = require('./compareDate');

/*
 * Playlist
 * Gestion des playlists en fonctions de tranche horaires
 */

/**
 * Class Playlist
 * Manage playlists
 */
var Playlist = {
	
	/**
	 * function constructor : construct a playlist
	 * Input : string name: name of the playlist
	 * Output : none
	 */
	constructor: function (name) {
		this.name = name;
		this.playlist = new Array();
	},

	/**
	 * function addSong : Add a song in the playlist
	 * Input : string name: name of the song,
	 * string url: chemin of the song,
	 * int duration: duration of the song in seconds
	 * Output : none
	 */
	addSong: function (name, url, duration) {
		this.playlist.push([name, url, duration]);
	},

	/**
	 * function randSong : Return a random song
	 * Input : none
	 * Output : a random song [name,url,duration]
	 */
	randSong: function() {
		var i = Math.floor(Math.random() * this.playlist.length);
		return this.playlist[i];
	},

	/**
	 * function getName : Return the name of playlist
	 * Input : none
	 * Output : string name : name of the playlist
	 */
	getName: function() {
		return this.name;
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
			var diff = compareDate.compareStringHours(element[1], element[2]);
			var begin = compareDate.compareStringHours(time, element[1]);
			var end = compareDate.compareStringHours(time, element[2]);
			if(((begin == 1 || begin == 0) && end == -1) || (diff == 1 && (begin == 1 || begin == 0 || end == -1))) {
				playlistNow.push(element);
			}
		});
		if(playlistNow.length == 0) {
			return false;
		}
		var i = Math.floor(Math.random() * playlistNow.length);
		return playlistNow[i][0];
	}
};

var PlaylistEvent = {
	initPlaylistEvent: function() {
		this.listPlaylist = new Array();
	},

	addPlaylist: function(playlist, day, hour) {
		this.listPlaylist.push([playlist, day, hour]); // format : DD/MM/YYYY HH:MM:SS
	},

	selectPlaylistEvent: function(date1, date2) {
		var playlistNow = new Array();
			console.log(date1.toLocaleDateString());
			console.log(date2.toLocaleTimeString());
		this.listPlaylist.forEach(function (element) {
			if(date1.toLocaleDateString() === element[1]) {
				var begin = compareDate.compareStringHours(date1.toLocaleTimeString(), element[2]);
				var end = compareDate.compareStringHours(date2.toLocaleTimeString(), element[2]);
				if((begin == -1 || begin == 0) && (end == 1 || end == 0)) {
					playlistNow.push(element);
				}
			}
		});
		if(playlistNow.length == 0) {
			return false;
		}
		var i = Math.floor(Math.random() * playlistNow.length);
		return playlistNow[i][0];
	}
};

exports.Playlist = Playlist;
exports.PlaylistTimeSlot = PlaylistTimeSlot;
exports.PlaylistEvent = PlaylistEvent;