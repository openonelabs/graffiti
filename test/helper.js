module.exports = {
  hex2a: function(hexx) {
    var hex = hexx.toString();
    var str = '';
    for (var i=2; i<hex.length; i+=2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }
}
