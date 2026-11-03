// Shared, dynamic player/group handling (1 to MAX_PLAYERS groups).
var MAX_PLAYERS = 10;
var numPlayers = 3;
var DEFAULT_NAMES = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Teal', 'Brown', 'Gray'];
var playerTranslation = {};
var control = 1;
// score_player_1 ... score_player_10 stay as globals (the game code reads them via window[]).
for (var _i = 1; _i <= MAX_PLAYERS; _i++) {
    window['score_player_' + _i] = 0;
    playerTranslation[_i] = DEFAULT_NAMES[_i - 1];
}

function escapeHtml(s) {
    return $('<div>').text(s).html();
}

// Number of cells per row so 10 groups fit as 5 + 5 rather than one tiny row.
function cellWidthStyle(extra) {
    var perRow = numPlayers <= 5 ? numPlayers : Math.ceil(numPlayers / 2);
    return 'style="width:' + (100 / perRow) + '%;' + (extra || '') + '"';
}

function eachPlayer(fn) {
    for (var i = 1; i <= numPlayers; i++) { fn(i); }
}

function buildPlayerUI() {
    var w = cellWidthStyle('float:left;');
    var html;

    // Scoreboard in footer
    html = '';
    eachPlayer(function (i) {
        html += '<div class="player-cell text-center" ' + w + '><h4><span id="player-' + i + '-name">' +
            escapeHtml(playerTranslation[i]) + '</span>: <span id="player-' + i + '-score">$0</span></h4></div>';
    });
    $('#scoreboard').html(html + '<div class="clearfix"></div>');

    // Right / wrong buttons in question modal and final modal
    html = '';
    var finalHtml = '';
    eachPlayer(function (i) {
        var label = escapeHtml(playerTranslation[i]);
        html += '<div class="score-button-group player-cell" ' + w + '>' +
            '<button type="button" class="btn btn-danger score-button" id="p' + i + '-wrong-button"><span class="glyphicon glyphicon-remove"></span> ' + label + '</button> ' +
            '<button type="button" class="btn btn-success score-button" id="p' + i + '-right-button"><span class="glyphicon glyphicon-ok"></span> ' + label + '</button></div>';
        finalHtml += '<div class="score-button-group player-cell" ' + w + '>' +
            '<button type="button" class="btn btn-danger final-score-button" id="final-p' + i + '-wrong-button"><span class="glyphicon glyphicon-remove"></span> ' + label + '</button> ' +
            '<button type="button" class="btn btn-success final-score-button" id="final-p' + i + '-right-button"><span class="glyphicon glyphicon-ok"></span> ' + label + '</button></div>';
    });
    $('#scoring-buttons').html(html + '<div class="clearfix"></div>');
    $('#final-scoring-buttons').html(finalHtml + '<div class="clearfix"></div>');

    // Final jeopardy wagers
    html = '';
    eachPlayer(function (i) {
        html += '<div class="score-button-group player-cell" ' + w + '><input type="text" class="form-control" placeholder="' +
            escapeHtml(playerTranslation[i]) + ' Wager" id="wager-player-' + i + '-input" /></div>';
    });
    $('#final-jeopardy-score-input-div').html(html + '<div class="clearfix"></div>');

    // Adjust modal: names, scores, control
    html = '';
    var scoreHtml = '';
    var ctrlHtml = '';
    eachPlayer(function (i) {
        html += '<div class="score-button-group player-cell" ' + w + '><input type="text" class="form-control" placeholder="Group ' + i + ' Name" id="name-player-' + i + '-input" /></div>';
        scoreHtml += '<div class="score-button-group player-cell" ' + w + '><input type="text" class="form-control" placeholder="Group ' + i + ' Score" id="score-player-' + i + '-input" /></div>';
        ctrlHtml += '<div class="control-button-group player-cell" ' + w + '><label class="radio-inline"><input type="radio" id="control-player-' + i + '-input" name="control-input" value="' + i + '"/></label></div>';
    });
    $('#adjust-name-input-div').html(html + '<div class="clearfix"></div>');
    $('#adjust-score-input-div').html(scoreHtml + '<div class="clearfix"></div>');
    $('#adjust-control-input-div').html(ctrlHtml + '<div class="clearfix"></div>');

    if (control > numPlayers) { control = 1; }
    if (typeof updateScore === 'function') { updateScore(); }
}

function setNumPlayers(n) {
    n = parseInt(n);
    if (isNaN(n) || n < 1) { n = 1; }
    if (n > MAX_PLAYERS) { n = MAX_PLAYERS; }
    numPlayers = n;
    $('#group-count').val(n);
    buildPlayerUI();
}

function refreshPlayerLabels() {
    // Wager placeholders depend on the current names (final round only).
    eachPlayer(function (i) {
        $('#wager-player-' + i + '-input').attr('placeholder', playerTranslation[i] + ' Wager');
    });
}

$(function () {
    var opts = '';
    for (var i = 1; i <= MAX_PLAYERS; i++) { opts += '<option value="' + i + '">' + i + '</option>'; }
    $('#group-count').html(opts).val(numPlayers).on('change', function () {
        setNumPlayers($(this).val());
    });
    buildPlayerUI();
});
