
softmax_temp = 2

tf.loadGraphModel('assets/models/maia_1900_tfjs/model.json').then(function (m) {
    model = m;
    var ones_ten = tf.ones([1,112, 64]);
    test_vec = model.predict(ones_ten);
    console.log(test_vec.arraySync())
});


tf.loadGraphModel('assets/models/maia_1900_tfjs_val/model.json').then(function (m) {
    model_value = m;
    var ones_ten = tf.ones([1, 112, 64]);
    test_vec = model_value.predict(ones_ten);
    console.log(test_vec.arraySync())
});

function get_board_move_vec() {
    current_fen = board.fen();
    var arr = get_board_array();
    ten = tf.tensor(arr);
    move_ten = model.predict(ten);
    move_arr = new Float64Array(move_ten.arraySync()[0]);
    return move_ten;
}

function get_board_value_vec() {
    current_fen = board.fen();
    var arr = get_board_array();
    ten = tf.tensor(arr);
    val_ten = model_value.predict(ten);
    val_arr = new Float64Array(val_ten.arraySync()[0]);
    return val_ten;
}

function tf_eval () {
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
