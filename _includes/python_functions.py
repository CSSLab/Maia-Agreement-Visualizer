import micropip

def final_init():
    print("leela_board loaded")
    from js import setup_board
    setup_board()



micropip.install("{{ "/assets/python/chess-1.2.1-py3-none-any.whl" | absolute_url }}").then(print("python chess loaded"))

micropip.install("{{ "/assets/python/leela_board-0.0.1-py3-none-any.whl" | absolute_url }}").then(final_init())

def get_board_array():
    import leela_board
    from js import current_fen
    print(f"processing: {current_fen}")
    return leela_board.LeelaBoard(current_fen).lcz_features()

