import micropip

def final_init():
    print("leela_board loaded")
    from js import setup_board
    setup_board()



micropip.install('http://127.0.0.1:4000/Maia-Agreement-Visualizer/assets/python/chess-1.2.1-py3-none-any.whl').then(print("python chess loaded"))

micropip.install('http://127.0.0.1:4000/Maia-Agreement-Visualizer/assets/python/leela_board-0.0.1-py3-none-any.whl').then(final_init())


def get_board_array():
    import leela_board
    from js import current_fen
    print(f"processing: {current_fen}")
    return leela_board.LeelaBoard(current_fen).lcz_features()

