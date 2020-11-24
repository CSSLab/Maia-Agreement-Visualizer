var flipped = false;
var hide_intro = false;

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

var starting_fen = "2k1r1r1/1pqb1p2/p3pB1p/nPPpPnp1/8/2P2N2/2Q1BPPP/R4RK1 w - - 0 19"
//https://lichess.org/OW5GMLdP#36

var dat_start = {
    "board": "2k1r1r1/1pqb1p2/p3pB1p/nPPpPnp1/8/2P2N2/2Q1BPPP/R4RK1 w - - 0 19",
    "count": 34,
    "cp_rel": "7.5",
    "maia_1100_correct": "True",
    "maia_1100_move": "b5b6",
    "maia_1100_p_rounded": 0.4,
    "maia_1200_correct": "True",
    "maia_1200_move": "b5b6",
    "maia_1200_p_rounded": 0.6,
    "maia_1300_correct": "True",
    "maia_1300_move": "b5b6",
    "maia_1300_p_rounded": 0.5,
    "maia_1400_correct": "True",
    "maia_1400_move": "b5b6",
    "maia_1400_p_rounded": 0.5,
    "maia_1500_correct": "False",
    "maia_1500_move": "b5a6",
    "maia_1500_p_rounded": 0.5,
    "maia_1600_correct": "False",
    "maia_1600_move": "b5a6",
    "maia_1600_p_rounded": 0.5,
    "maia_1700_correct": "False",
    "maia_1700_move": "b5a6",
    "maia_1700_p_rounded": 0.6,
    "maia_1800_correct": "False",
    "maia_1800_move": "b5a6",
    "maia_1800_p_rounded": 0.5,
    "maia_1900_correct": "False",
    "maia_1900_move": "b5a6",
    "maia_1900_p_rounded": 0.5,
    "material_count": "12",
    "move": "b5b6",
    "move_ply": "34",
    "sf_m_move": "b5a6"
}

function move_to_description(fen, move) {
    var m = Chess(fen).move(move, { sloppy: true })
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
    var board_str = '111100000'
    var player_elo = 1300
    var is_blunder = true
    var sf_correct = false
    var material_count = 12
    all_boards = {
        '111100000': {
            1300 : {
                true: {
                    false: {
                        12: dat_start
                    }
                }
            }
        }
    }
    update_explorer(true);
    $.getJSON(data_file, function(data) {
        all_boards = data;
        //Hand picked starting board
        all_boards[board_str][player_elo][is_blunder][sf_correct][material_count] = dat_start;
        update_explorer(true);
    });
}

function start_interactive(){
    $(".starts_hidden").removeClass("starts_hidden");

    $("#start_button_holder").addClass("start_button_hidden");
    hide_intro = true;
    update_explorer(true);

}

function flip_order() {
    var current_val = parseInt($("#model_slider")[0].value)
    flipped = !flipped;

    if (flipped) {
        $("#low-model").addClass("label_right")
        $("#low-model").removeClass("label_left")

        $("#high-model").removeClass("label_right")
        $("#high-model").addClass("label_left")
    } else {
        $("#high-model").addClass("label_right")
        $("#high-model").removeClass("label_left")

        $("#low-model").removeClass("label_right")
        $("#low-model").addClass("label_left")
    }
    $("#model_slider")[0].value = 3000 - current_val;
    update_explorer(false);
}

function update_model_slider(target_elo) {
    var slider_label = $("#model_slider_label");
    slider_label.text(target_elo);

    var e = parseInt(target_elo[1]) - 1;

    if (flipped) {
        e = 8 - e;
    }

    var wm = $("#model_slider").width();

    var offset = e * wm / 8

    slider_label.css({
        left: offset + "px",
        "background-color" : "var(--maia-" + target_elo +"-color)",
    })
}

function update_explorer(complexity_changed) {
    if (hide_intro) {
        $("#intro-board-descr").hide()
        hide_intro = false;
    }
    var s ='';

    model_elo = $("#model_slider")[0].value
    if (flipped) {
        model_elo = (3000 - parseInt(model_elo)).toString();
    }
    var model_elo_short = parseInt(model_elo[1])
    update_model_slider(model_elo);

    var s = ''
    for (var i = 0; i < 9; i++) {
        if (i < model_elo_short ) {
            s += flipped ? "0" : "1";
        } else {
            s += flipped ? "1" : "0";
        }
    }
    var sf_correct = false;
    var is_blunder = false;
    if ($("#player_blunder")[0].value == 'sf_correct') {
        sf_correct = true;
    } else if ($("#player_blunder")[0].value == 'mistake') {
        is_blunder = true;
    }

    var elo = $('#player_elo')[0].value;
    if (!complexity_changed) {
        try {
            var dat = all_boards[s][elo][is_blunder][sf_correct];
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

    switch_to_board(s, elo, is_blunder, sf_correct, material);
}

function switch_to_board(board_str, player_elo, is_blunder, sf_correct, material_count) {
    try {
        dat = all_boards[board_str][player_elo][is_blunder][sf_correct][material_count];
        var black_active =  dat['board'].search(" w ") > 1
        var board = Chessboard(
            "explorer-board", {
            position: dat['board'],
            draggable: false,
            sparePieces: false,
            dropOffBoard: 'trash',
            //orientation: black_active ? 'black' : 'white' ,
        });

        var style_str = "style='width: " + ($("#explorer-board").width() -8) + "px;height: " + $("#explorer-board").height() + "px;margin-bottom: " + (-$("#explorer-board").height() - 4)+ "px;'"
        $("#board-svg-container").html('<svg viewBox = "0 0 100 100" preserveAspectRatio = "xMidYMid slice" class="board-drawing" id="board-drawing-root"' + style_str + '><defs id="board-drawing-defs"></defs></svg >')
        player_move_descrip = move_to_description(dat['board'], dat['move']);
        for (var i = 0; i < 9; i++) {
            var m_str = 'maia_1' + (i + 1) + '00'
            var e_move = dat[m_str +'_move']
            $("#" + m_str + "_move").text(move_to_san(dat['board'],e_move));
            //$("#" + m_str + "_conf").text(dat[m_str + '_p_rounded']);
            if (dat[m_str + "_correct"] == "True") {
                $("#" + m_str + "_correct").html("<span class='move_correct'>&#10004;</span>");
            } else {
                draw_board_arrow(e_move, 'red', black_active, false);
                $("#" + m_str + "_correct").html("<span class='move_incorrect'>&#x2717;</span>");
            }
        }
        var sf_move = dat['sf_m_move']
        $("#stockfish_move").text(move_to_san(dat['board'], sf_move));

        if (sf_correct) {
            $("#stockfish_correct").html("<span class='move_correct'>&#10004;</span>");
        } else {
            $("#stockfish_correct").html("<span class='move_incorrect_sf'>&#x2717;</span>");
            draw_board_arrow(sf_move, 'blue', black_active, true);
        }

        draw_board_arrow(dat['move'], 'green', black_active, false);

    game_str = "lichess.org/" + dat["game_id"] + "#" + dat["move_ply"]

    if (is_blunder) {
        $("#move_string").html('The player blundered and moved their <span class="move_desc_inline">' + player_move_descrip + '</span>' )
    } else {
        $("#move_string").html('The player made a good move, moving their <span class="move_desc_inline">' + player_move_descrip + '</span>')
    }

    $("#player_move").html()
        $("#count_string").html("There were <span class='count_text'>" + dat["count"] + "</span> boards, out of <span class='count_text'>4,655,522</span> with this combination of models correct.")
    //$("#cp_string").text("The number of pawns the current player was advantaged by here is: " + dat["cp_rel"] + ".")

    } catch (err) {
        console.log(err)
        var style_str = "style='height: " + $("#board-container").height()+ "px;'"
        $("#board-svg-container").html('')

        $("#move_string").text("")
        $("#explorer-board").html("<h3>No Board with these properties was found in our dataset</h3>")
        $("#fen_string").html('')
        $("#count_string").html("There were <span class='count_text'>0</span> boards, out of <span class='count_text'>49,532,224</span> with this combination of models correct.")
        $("#cp_string").text("")
        $("#url_string").html("")
    }
}

function draw_board_arrow(move_str, colour, black_active, is_sf) {
    if (document.getElementById("arrowhead-" + move_str + '_' + is_sf)) {
        return
    }
    coords = move_to_coords(move_str);

    var arrow_head = document.createElement("marker");
    arrow_head.setAttribute('id', "arrowhead-" + move_str + '_' + is_sf);
    arrow_head.setAttribute('orient', "auto");
    arrow_head.setAttribute('markerHeight', "4");
    arrow_head.setAttribute('fill', colour || "rgb(120, 120, 120)");
    arrow_head.setAttribute('refX', ".5");
    arrow_head.setAttribute('refY', "2");

    var arrow_path = document.createElement("path");
    arrow_path.setAttribute("d", "M0,.5 V3.5 L2,2 Z");
    arrow_head.appendChild(arrow_path);
    document.getElementById('board-drawing-defs').appendChild(arrow_head);

    var arrow = document.createElement("line");
    var delta_y = Math.abs(coords[1][1] - coords[0][1]);
    var delta_x = Math.abs(coords[1][0] - coords[0][0]);

    var h = Math.sqrt(delta_y ** 2 + delta_x ** 2)

    var def_x = delta_x / h * 6
    var def_y = delta_y / h * 6

    if (coords[1][0] > coords[0][0]) {
        def_x = def_x  * -1
    }

    if (coords[1][1] < coords[0][1]) {
        def_y = def_y * -1
    }
    arrow.setAttribute('y1', (8 - coords[0][1] + .6) * 100 / 8);
    arrow.setAttribute('y2', (8 - coords[1][1] + .6) * 100 / 8 + def_y);
    arrow.setAttribute('x1', (coords[0][0] - .5) * 100 / 8);
    arrow.setAttribute('x2', (coords[1][0] - .5) * 100 / 8 + def_x);
    arrow.setAttribute('marker-end', "url(#arrowhead-" + move_str + '_' + is_sf + ")");
    arrow.setAttribute('id', "gradient-" + move_str);
    arrow.setAttribute('stroke', colour || "rgb(120, 120, 120)");
    if (is_sf) {
        arrow.setAttribute('stroke-width', "2");
    } else {
        arrow.setAttribute('stroke-width', "3");
    }

    arrow.setAttribute('class', "board-arrow");
    arrow.setAttribute("opacity", ".6");
    document.getElementById('board-drawing-root').appendChild(arrow);

    var text = document.createElement("text", "");
    text.setAttribute("style", "font-size: 3pt;");
    var textPath = document.createElement("textPath");
    textPath.setAttribute("xlink:href", "#svg-arrow-" + move_str);
    textPath.setAttribute("startOffset", "50%");
    textPath.setAttribute("text-anchor", "middle");
    text.appendChild(textPath);
    document.getElementById('board-drawing-root').appendChild(text);
    $("#board-svg-container").html($("#board-svg-container").html());
}

function move_to_coords(move_str){
    var start = [move_str.charCodeAt(0) - 96, parseInt(move_str[1])];
    var end = [move_str.charCodeAt(2) - 96, parseInt(move_str[3])];
    return [start, end];
}


