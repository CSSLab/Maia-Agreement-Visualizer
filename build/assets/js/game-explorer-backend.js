var game_ply = 0;
var num_games = 0;

function setup_game_board(data_file) {
    $.getJSON(data_file, function (data) {
        game_data = data;
        num_games = game_data['boards'].length
        update_game();
    })
}

function update_game() {
    var board = Chessboard(
        "game-explorer", {
        position: game_data['boards'][game_ply][0],
        draggable: false,
        sparePieces: false,
        dropOffBoard: 'trash',
    });

    $.find('.game-explorer .square-' + game_data['boards'][game_ply][1].substring(0, 2))[0].className += ' highlight-correct'
    $.find('.game-explorer .square-' + game_data['boards'][game_ply][1].substring(2, 4))[0].className += ' highlight-correct'

    $("#game_fen").html(game_data['boards'][game_ply][0])
}

function next_move() {
    if (game_ply < num_games) {
        game_ply = game_ply + 1;
    }
    update_game()
}

function prev_move() {
    if (game_ply > 0) {
        game_ply = game_ply - 1;
    }
    update_game()
}

function reset() {
    game_ply = 0;
    update_game()
}
