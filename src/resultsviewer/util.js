
function getRandomDivId(){
		
	var length = 12;
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

	if (! length) {
		length = Math.floor(Math.random() * chars.length);
	}

	var str = '';
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	
	return str;
}
