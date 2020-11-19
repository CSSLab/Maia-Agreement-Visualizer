targets = ['maia_1100', 'maia_1200', 'maia_1300', 'maia_1400', 'maia_1500', 'maia_1600', 'maia_1700', 'maia_1800', 'maia_1900', 'sf_m',]

targets = []
var i;
for (i = 0; i < 5; i++) {
    targets.push('maia_1' + ((i * 2) + 1) + '00')
}
targets.push('sf_m')

function move_to_san(fen, move) {
    return Chess(fen).move(move, { sloppy: true })['san']
}

var piece_lookup  = {
    'p' : 'Pawn',
    'n' : 'Knight',
    'b' : 'Bishop',
    'r' : 'Rook',
    'q' : 'Queen',
    'k' : 'King',
}

function move_to_description(fen, move) {
    m = Chess(fen).move(move, { sloppy: true })
    //{ color: "w", from: "e2", to: "e4", flags: "b", piece: "p", san: "e4" }
    var decr_str = ''
    if (m['color'] == 'w') {
        decr_str = decr_str + "White "
    } else {
        decr_str = decr_str + "Black "
    }
    if (m['flags'] == 'k' || m['flags'] == 'q') {
        decr_str = decr_str + "Castled"
        return decr_str;
    }

    decr_str = decr_str + piece_lookup[m['piece']]
    decr_str = decr_str + " from " + m['from']
    decr_str = decr_str + " to " + m['to']
    if (m['flags'] == 'n') {
    } else if (m['flags'] == 'c') {
        decr_str = decr_str + " capturing a piece"
    } else if (m['flags'] == 'c') {
        decr_str = decr_str + " promoting their pawn"
    }
    return decr_str;
}

function setup_explorer_board(data_file) {
    console.log("loading: " + data_file);
    $.getJSON(data_file, function(data) {
        console.log("loaded: " + data_file);
        all_boards = data;
        update_explorer(false);
    });
}

function update_explorer(complexity_changed) {
    var i;
    var s ='';
    enabled_index_1 = 0;
    enabled_index_2 = 4;
    var flip_encountered = false;
    var start_value = $('#' + targets[0] + '_toggle')[0].checked;
    for (i = 0; i < targets.length; i++) {
        var c_val = $('#' + targets[i] + '_toggle')[0].checked;
        if (c_val) {
            s += '1'
        } else {
            s += '0'
        }
        if (i > 8) {
            $('#' + targets[i] + '_toggle')[0].disabled = false;
        } else if (c_val != start_value) {
            if (flip_encountered) {
                $('#' + targets[i] + '_toggle')[0].checked = ! start_value;
            } else {
                enabled_index_1 = i - 1;
                enabled_index_2 = i;
                flip_encountered = true;
            }
        }
    }
    for (i = 0; i < targets.length - 1; i++) {
        if (i == enabled_index_1) {
            $('#' + targets[i] + '_toggle')[0].disabled = false;
        } else if (i == enabled_index_2) {
            $('#' + targets[i] + '_toggle')[0].disabled = false;
        } else {
            $('#' + targets[i] + '_toggle')[0].disabled = true;
        }
    }
    var is_blunder = $('#is_blunder')[0].checked;
    var elo = $('#player_elo')[0].value;
    console.log(s, elo, is_blunder);
    if (!complexity_changed) {
        try {
            var dat = all_boards[s][elo][is_blunder];
            var material_val = dat.length / 2
            material_val = Math.floor(material_val)
            $('#material_count')[0].min = 0;
            $('#material_count')[0].max = dat.length - 1;
            $('#material_count')[0].value = material_val;
        } catch (err) {
            material_val = 0
            $('#material_count')[0].min = 0;
            $('#material_count')[0].max = 0;
            $('#material_count')[0].value = 0;
        }

    }
    var material = $('#material_count')[0].value;

    switch_to_board(s, elo, is_blunder, material);
}

function switch_to_board(board_str, player_elo, is_blunder, material_count) {
    var player_move = "unknown"

    try {
        if (($('#' + targets[targets.length - 1] + '_toggle')[0].checked) & is_blunder) {
            throw 'Stockfish incorrectly correct';
        }
        dat = all_boards[board_str][player_elo][is_blunder][material_count];
        var board = Chessboard(
            "explorer-board", {
            position: dat['board'],
            draggable: false,
            sparePieces: false,
            dropOffBoard: 'trash',
        });

        var style_str = "style='width: " + $("#board-container").width() + "px;height: " + $("#board-container").height() + "px;margin-bottom: " + -$("#board-container").height() + "px;'"
        $("#board-svg-container").html('<svg viewBox = "0 0 100 100" preserveAspectRatio = "xMidYMid slice" class="board-drawing" id="board-drawing-root"' + style_str + '><defs id="board-drawing-defs"></defs></svg >')


        for (var i = 0; i < targets.length; i++) {
            var e_move = dat[targets[i] + "_move"]
            $("#" + targets[i] + "_move").text(move_to_san(dat['board'],e_move));
            if (dat[targets[i] + "_correct"]) {
                draw_board_arrow(e_move, 'green', targets[i]);
                var player_move = e_move;
                var player_move_descrip = move_to_description(dat['board'], player_move);
            } else {
                draw_board_arrow(e_move, 'red', targets[i]);
            }
        }

    game_str = "lichess.org/" + dat["game_id"] + "#" + dat["move_ply"]
    $("#url_string").html(
        'This board is from: <a href="https://' + game_str + '">' + game_str + "</a>"
    )

    if (is_blunder) {
        $("#move_string").html('The player blundered and moved their <span class="move_text">' + player_move_descrip + '</span>' )
    } else {
        $("#move_string").html('The player made a good move, moving their <span class="move_text">' + player_move_descrip + '</span> which was a ')
    }
    $("#player_move").html()

    $("#fen_string").html('FEN: <span class="fen_text">' + dat["board"] + '</span>')
    $("#count_string").text("There were " + dat["count"] + " boards, out of 4,655,522 with this combination of models correct.")
    $("#cp_string").text("The number of pawns the current player was advantaged by here is: " + dat["cp_rel"] + ".")

    } catch (err) {
        var style_str = "style='height: " + $("#board-container").height()+ "px;'"
        $("#board-svg-container").html('')

        $("#move_string").text("")
        $("#explorer-board").html("<h3>No Board with these properties was found in our dataset</h3>")
        $("#fen_string").html('')
        $("#count_string").text("There were 0 boards, out of 4,655,522 with this combination of models correct.")
        $("#cp_string").text("")
        $("#url_string").html("")
        for (var i = 0; i < targets.length; i++) {
            $("#" + targets[i] + "_move").text('');
        }
    }
}

function draw_board_arrow(move_str, colour, arrow_text) {
    if (document.getElementById("arrowhead-" + move_str)) {
        return
    }
    var coords = move_to_coords(move_str);

    var arrow_head = document.createElement("marker");
    arrow_head.setAttribute('id', "arrowhead-" + move_str);
    arrow_head.setAttribute('orient', "auto");
    arrow_head.setAttribute('markerHeight', "4");
    arrow_head.setAttribute('fill', colour || "rgb(120, 120, 120)");
    arrow_head.setAttribute('refX', "1");
    arrow_head.setAttribute('refY', "2");

    var arrow_path = document.createElement("path");
    arrow_path.setAttribute("d", "M0,.5 V3.5 L2,2 Z");
    arrow_head.appendChild(arrow_path);
    document.getElementById('board-drawing-defs').appendChild(arrow_head);

    var arrow = document.createElement("line");
    console.log(coords);
    arrow.setAttribute('x1', (coords[0][0] - .5) * 100 / 8);
    arrow.setAttribute('y1', (8 - coords[0][1] + .5) * 100 / 8);
    arrow.setAttribute('x2', (coords[1][0] - .5) * 100 / 8);
    arrow.setAttribute('y2', (8 - coords[1][1] + .5) * 100 / 8);
    arrow.setAttribute('marker-end', "url(#arrowhead-" + move_str + ")");
    arrow.setAttribute('id', "svg-arrow-" + move_str);
    arrow.setAttribute('stroke', colour || "rgb(120, 120, 120)");
    arrow.setAttribute('stroke-width', "3");
    arrow.setAttribute('class', "board-arrow");
    arrow.setAttribute("opacity", ".6");
    document.getElementById('board-drawing-root').appendChild(arrow);


    var text = document.createElement("text", arrow_text);
    text.setAttribute("style", "font-size: 3pt;");
    var textPath = document.createElement("textPath");
    textPath.setAttribute("xlink:href", "#svg-arrow-" + move_str);
    textPath.setAttribute("startOffset", "50%");
    textPath.setAttribute("text-anchor", "middle");
    //textPath.appendChild(document.createTextNode(arrow_text));
    text.appendChild(textPath);
    document.getElementById('board-drawing-root').appendChild(text);
    $("#board-svg-container").html($("#board-svg-container").html());

}

function move_to_coords(move_str){
    var start = [move_str.charCodeAt(0) - 96, parseInt(move_str[1])];
    var end = [move_str.charCodeAt(2) - 96, parseInt(move_str[3])];
    return [start, end];
}
