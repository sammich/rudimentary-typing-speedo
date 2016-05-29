var lastKeyTime;
var deltaEl = $('#delta');
var cpmDeltaEl = $('#cpmDelta');
var wpmDeltaEl = $('#wpmDelta');
var avgs = { 10: [], 40: [], 1000: [] };
var avgEls = { 10: $('#avg10'), 40: $('#avg40'), 1000: $('#avg1000') };
var cpmEls = { 10: $('#cpm10'), 40: $('#cpm40'), 1000: $('#cpm1000') };
var wpmEls = { 10: $('#wpm10'), 40: $('#wpm40'), 1000: $('#wpm1000') };
var keysTyped = {
  keyPresses: 0
};

$(document).keypress(function(e) {
  keysTyped.keyPresses++;

  var char = String.fromCharCode(e.which);
  if (!keysTyped[char]) keysTyped[char] = 0;
  keysTyped[char]++;

  $('#keystyped').text(JSON.stringify(keysTyped, null, 4));

  var rol, rols, delta;

  if (lastKeyTime) {
    delta = e.timeStamp - lastKeyTime;

    displayVal(deltaEl, delta);
    displayVal(cpmDeltaEl, 60 / delta * 1000);
    displayVal(wpmDeltaEl, 60 / 5 / delta * 1000);

    for (rol in avgs) {
      if (avgs.hasOwnProperty(rol)) {
        rols = avgs[rol];
        rols.unshift(delta);
        if (rols.length > rol) rols.length = rol;
      }
    }
  }

  for (rol in avgs) {
    if (avgs.hasOwnProperty(rol)) {
      rols = avgs[rol];

      if (rols.length) {
        var total = rols.reduce(function (acc, n) {
          return acc + n;
        });
        var avg = total / rols.length;

        displayVal(avgEls[rol], avg);
        displayVal(cpmEls[rol], 60 / avg * 1000);
        displayVal(wpmEls[rol], 60 / 5 / avg * 1000);
      }
    }
  }

  lastKeyTime = e.timeStamp;

  resetAfterPause();
}).keydown(function () {
  $('#typingthing').focus();
});

var displayVal = function ($el, val, padNum) {
  var max = Math.pow(10, padNum || 4) - 1;
  if (val > max) val = max;
  $el.text(String(Math.ceil(val)).padLeft(padNum || 4));
};

var resetAfterPause = _.debounce(function reset() {
  for (var rol in avgs) {
    if (avgs.hasOwnProperty(rol)) {
      avgs[rol] = [];
    }
  }

  lastKeyTime = 0;
  console.log('reset');
}, 3000);

if (!String.prototype.padLeft) {
  String.prototype.padLeft = function(length, str) {
    str = str || ' ';
    return this.length >= length ?
    this :
    (new Array(Math.ceil((length - this.length) / str.length) + 1).join(str)).substr(0, (length - this.length)) + this;
  };
}
