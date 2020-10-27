import micropip

def final_init():
    print("leela_board loaded")
    from js import setup_board
    setup_board()

micropip.install("{{ "/assets/python/chess-1.2.1-py3-none-any.whl" | absolute_url }}").then(print("python chess loaded"))

micropip.install("{{ "/assets/python/leela_board-0.0.1-py3-none-any.whl" | absolute_url }}").then(final_init())

def get_board_array():
    import leela_board
    import numpy as np
    from js import current_fen
    print(f"processing: {current_fen}")
    b_arr = leela_board.LeelaBoard(current_fen).lcz_features()
    return b_arr.tolist()

def eval_board_arr():
    import leela_board
    import numpy as np
    from js import current_fen, move_arr

    return leela_board.eval_board(current_fen, np.array(move_arr))

def test_setup():
    import leela_board
    from js import current_fen
    print(f"processing: {current_fen}")
