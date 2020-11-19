targets = ['maia_1100', 'maia_1200', 'maia_1300', 'maia_1400', 'maia_1500', 'maia_1600', 'maia_1700', 'maia_1800', 'maia_1900', 'sf_m',]

targets = []
var i;
for (i = 0; i < 5; i++) {
    targets.push('maia_1' + ((i * 2) + 1) + '00')
}
targets.push('sf_m')

var arrow_map_diagonal = {
    true : {
        true: '&#8601;',
        false: '&#8600;',
    },
    false: {
        true: '&#8598;',
        false: '&#8599;',
    }
}

var arrow_map_ortho = {
    true: {
        true: '&#8592;',
        false: '&#8594;',
    },
    false: {
        true: '&#8595;',
        false: '&#8593;',
    }
}

function get_url_parameter (url, name) {
    var ret = url.searchParams.get(name);
    if (ret == null) {
        throw 'Missing parameter: ' + name;
    }
    return ret;
}

function setup_explorer_board(data_file) {
    console.log("loading: " + data_file);

    var url = new URL(window.location.href)
    try {
        for (i = 0; i < targets.length; i++) {

            $('#' + targets[i] + '_toggle')[0].checked = get_url_parameter(url, targets[i]);
            console.log(targets[i], get_url_parameter(url, targets[i]))
        }
        //$('#force_diagonal')[0].checked = get_url_parameter(url, "force_diagonal");
        $('#is_blunder')[0].checked = get_url_parameter(url,"is_blunder");
        $('#player_elo')[0].value = get_url_parameter(url,"player_rating");
        $('#material_count')[0].value = get_url_parameter(url,"material_count");
    } catch (err) {
        console.log("errored", err)
    }
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
    var disabled = true;//$('#force_diagonal')[0].checked;
    var flip_encountered = false;
    var start_value = $('#' + targets[0] + '_toggle')[0].checked;
    for (i = 0; i < targets.length; i++) {
        var c_val = $('#' + targets[i] + '_toggle')[0].checked;
        if (c_val) {
            s += '1'
        } else {
            s += '0'
        }
        if (! disabled) {
            $('#' + targets[i] + '_toggle')[0].disabled = false;
        } else if (i > 8) {
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
    if (disabled) {
        for (i = 0; i < targets.length - 1; i++) {
            if (i == enabled_index_1) {
                $('#' + targets[i] + '_toggle')[0].disabled = false;
            } else if (i == enabled_index_2) {
                $('#' + targets[i] + '_toggle')[0].disabled = false;
            } else {
                $('#' + targets[i] + '_toggle')[0].disabled = true;
            }
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

    //console.log(s);

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
        var i;
        var square_size = calculateSquareSize()
        var style_str = "style='width: " + $("#board-container").width() + "px;height: " + $("#board-container").height() + "px;margin-bottom: " + -$("#board-container").height() +"px;'"
        $("#board-svg-container").html('<svg viewBox = "0 0 100 100" preserveAspectRatio = "xMidYMid slice" class="board-drawing" id="board-drawing-root"' + style_str + '><defs id="board-drawing-defs"></defs></svg >')

        for (i = 0; i < targets.length; i++) {
            var e_move = dat[targets[i] + "_move"]
            $("#" + targets[i] + "_move").text(e_move)

            if (dat[targets[i] + "_correct"]) {
                draw_board_arrow(e_move, 'green', targets[i]);
                player_move = e_move;
                //$.find('#explorer-board .square-' + e_move.substring(0, 2))[0].className += ' highlight-correct'
                //$.find('#explorer-board .square-' + e_move.substring(2, 4))[0].className += ' highlight-correct'
                /*$('#explorer-board .square-' + e_move.substring(2, 4)).append(
                        '<svg width="' +
                        square_size +
                        'px" height="' +
                    square_size + 'px"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" /></svg>')*/
            } else {
                draw_board_arrow(e_move, 'red', targets[i]);
                //$.find('#explorer-board .square-' + e_move.substring(0, 2))[0].className += ' highlight-' + targets[i]
                //$.find('#explorer-board .square-' + e_move.substring(2, 4))[0].className += ' highlight-' + targets[i]
            }
            /*
            var from_symbol = arrow_map_diagonal[e_move[1] > e_move[3]][e_move[0] > e_move[2]];

            if (e_move[1] == e_move[3]) {
                from_symbol = arrow_map_ortho[true][e_move[0] > e_move[2]];
            } else if (e_move[0] == e_move[2]) {
                from_symbol = arrow_map_ortho[false][e_move[1] > e_move[3]];
            }

            $('#explorer-board .square-' + e_move.substring(0, 2)).append('<div class="model-move-square-from ' + targets[i] + '_move_square">' + from_symbol+'</div>')
            $('#explorer-board .square-' + e_move.substring(2, 4)).append('<div class="model-move-square-to ' + targets[i] + '_move_square"> &#9675; </div>')
            */
        }
    } catch (err) {
        dat = {};
        for (i = 0; i < targets.length; i++) {
            dat[targets[i] + "_move"] = "????";
            dat[targets[i] + "_correct"] = false;
            dat["game_id"] = "None";
            dat["move_ply"] = 0;
            dat["board"] = "";
            dat['material_count'] = 0;
            dat["count"] = 0;
            dat["cp_rel"] = "";
        }
        $("#explorer-board").html("<h3>No Board with these properties was found in our dataset</h3>")
    }

    game_str = "lichess.org/" + dat["game_id"] + "#" + dat["move_ply"]
    $("#game_link").html(
        '<a href="https://' + game_str + '">' + game_str + "</a>"
    )

    $("#player_move").html('<span class="move_text">' + player_move + '</span>')
    $("#rating").html(player_elo)
    $("#fen").html('<span class="fen_text">' + dat["board"] + '</span>')
    $("#count_string").text("There were " + dat["count"] + " boards, out of TODO, with this combination of models correct.")
    $("#cp_string").text("The number of pawns the current player was advantaged by here is: " + dat["cp_rel"] + ".")
    var url = new URL(window.location.href)
    for (i = 0; i < targets.length; i++) {
        url.searchParams.append(targets[i], $('#' + targets[i] + '_toggle')[0].checked);
    }
    url.searchParams.append("player_rating",player_elo);
    url.searchParams.append("is_blunder", is_blunder);
    url.searchParams.append("material_count", material_count);
    //url.searchParams.append("force_diagonal", $('#force_diagonal')[0].checked);
    $("#url").html(
        '<a href="' + url + '">link</a>'
    )
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


    //$("#board-drawing").append(`<line class="board-arrow" stroke="rgb(120, 120, 120)"  marker-end= opacity = ".6" x1 = "${coords[0][0]}" y1 = "${coords[0][1]}" x2 = "${coords[1][0]}" y2 = "${coords[1][1]}" ></line >`)
}

function move_to_coords(move_str){
    var start = [move_str.charCodeAt(0) - 96, parseInt(move_str[1])];
    var end = [move_str.charCodeAt(2) - 96, parseInt(move_str[3])];
    return [start, end];
}

function calculateSquareSize() {
    var container = $("#explorer-board")
    var containerWidth = parseInt(container.width(), 10)

    // defensive, prevent infinite loop
    if (!containerWidth || containerWidth <= 0) {
        return 0
    }

    // pad one pixel
    var boardWidth = containerWidth - 1

    while (boardWidth % 8 !== 0 && boardWidth > 0) {
        boardWidth = boardWidth - 1
    }

    return boardWidth / 8
}
