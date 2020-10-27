
tf.loadGraphModel('assets/models/maia_1900_tfjs/model.json').then(function (m) {
    model = m;
});

function get_board_move_vec() {
    current_fen = board.fen();
    var arr = get_board_array();
    ten = tf.tensor(arr);
    move_ten = model.predict(ten.reshape([-1, 8, 8, 112]));
    move_arr = new Float64Array(move_ten.arraySync()[0]);
    return move_ten;
}

function tf_eval_button () {
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
        $("#json_display").append("<tr><td>" + key + "</td><td>" + val +"</td></tr>");
    });
}
