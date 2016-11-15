var compareStringHours = function(hours1, hours2) {
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

exports.compareStringHours = compareStringHours;