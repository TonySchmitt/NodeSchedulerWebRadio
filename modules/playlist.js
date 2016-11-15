var compareDate = require('./compareDate');

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
			var begin = compareDate.compareStringHours(time, element[1]);
			var end = compareDate.compareStringHours(time, element[2]);
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
};

var PlaylistEvent = {
	initPlaylistEvent: function() {
		this.listPlaylist = new Array();
	},

	addPlaylist: function(playlist, day, hour) {
		this.listPlaylist.push([playlist, day, hour]); // format : YYYY-MM-DD HH:MM:SS
	},

	selectPlaylistEvent: function(date1, date2) {
		var playlistNow = new Array();
			console.log(date1);
			console.log(date2);
		this.listPlaylist.forEach(function (element) {
			var begin = compareDate.compareStringHours(date1, element[2]);
			var end = compareDate.compareStringHours(date2, element[2]);
			if((begin == -1 || begin == 0) && (end == 1 || end == 0)) {
				playlistNow.push(element);
			}
		});
		if(playlistNow.length == 0) {
			return false;
		}
		var i = 0; //Math.floor(Math.random() * playlistNow.length);
		return playlistNow[i][0];
	}
};

exports.Playlist = Playlist;
exports.PlaylistTimeSlot = PlaylistTimeSlot;
exports.PlaylistEvent = PlaylistEvent;