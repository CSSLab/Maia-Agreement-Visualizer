current_fen = 'start';
board = null


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
}

function get_board_array(source, target) {
    current_fen = board.fen();
    return pyodide.runPython("get_board_array()")
}

