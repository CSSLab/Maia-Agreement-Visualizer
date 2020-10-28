import micropip

def final_init(*args):
    import leela_board
    print("leela_board loaded")
    from js import setup_board, get_full_eval
    setup_board()
    get_full_eval()

micropip.install("{{ "/assets/python/chess-1.2.1-py3-none-any.whl" | absolute_url }}").then(print("python chess loaded"))

micropip.install("{{ "/assets/python/leela_board-0.0.1-py3-none-any.whl" | absolute_url }}").then(final_init)

def get_board_array():
    import leela_board
    import numpy as np
    from js import current_fen
    print(f"processing: {current_fen}")
    b_arr = leela_board.LeelaBoard(current_fen).lcz_features()
    return b_arr.reshape(1,112,64).astype('float32').tolist()

def eval_board_arr():
    import leela_board
    import numpy as np
    from js import current_fen, move_arr, softmax_temp

    return leela_board.eval_board(current_fen, np.array(move_arr), policy_softmax_temp = softmax_temp)

def test_setup():
    import leela_board
    from js import current_fen
    print(f"processing: {current_fen}")
