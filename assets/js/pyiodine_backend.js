current_fen = 'start';
board = null


function get_board_array(source, target) {
    current_fen = board.fen();
    return pyodide.runPython("get_board_array()")
}


function eval_board_arr() {
    current_fen = board.fen();
    return pyodide.runPython("eval_board_arr()")
}

function setup_board() {
    board = Chessboard(
        "explorer-board", {
        position: current_fen,
        draggable: true,
        sparePieces: true,
        dropOffBoard: 'trash',
        onSnapEnd: get_board_array,
    });
    current_fen = board.fen();
    $("#tf_button")[0].disabled = false;
}
