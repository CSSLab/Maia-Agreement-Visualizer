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
        onSnapEnd: get_full_eval,
    });
    current_fen = board.fen();
    $("#tf_button")[0].disabled = false;
}

function get_full_eval(source, target) {
    tf_Arr = get_board_move_vec();
    console.log(tf_Arr);
    move_dict = eval_board_arr();
    console.log(move_dict);
    $("#json_display").html(`<table id="json_display">
  <tr>
    <th>Move</th>
    <th>P</th>
  </tr>
</table>`)
    $.each(move_dict, function (key, val) {
        $("#json_display").append("<tr><td>" + key + "</td><td>" + val + "</td></tr>");
    });
}
