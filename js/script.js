$(document).ready(function() {
    // Define the piece theme function
    function pieceTheme(piece) {
        return 'images/' + piece + '.png'; // Adjust path as needed
    }

    // Initialize the chessboard
    var board = ChessBoard('board', {
        draggable: false, // Disable drag-and-drop
        position: 'start',
        onSnapEnd: onSnapEnd,
        pieceTheme: pieceTheme // Use the pieceTheme function
    });

    var chess = new Chess();
    var selectedSquare = null;

    $('#resetButton').on('click', function() {
        chess.reset();
        board.position('start');
        $('.square-55d63').removeClass('highlight possible-move'); // Clear all highlights
        $('#board').removeClass('flipped'); // Ensure board is not flipped on reset
    });

    $('#undoButton').on('click', function() {
        // Undo the last move
        chess.undo();
        board.position(chess.fen());
        $('#board').removeClass('flipped'); // Ensure board is not flipped on undo
        $('.square-55d63').removeClass('highlight possible-move'); // Clear all highlights
    });

    $('#board').on('click', '.square-55d63', function() {
        var square = $(this).attr('data-square');
        handleClick(square);
    });

    function handleClick(square) {
        if (selectedSquare === null) {
            // Select the piece
            selectedSquare = square;
            $('.square-55d63').removeClass('highlight'); // Remove highlight from all squares
            $('#' + selectedSquare).addClass('highlight'); // Add highlight to selected square
            
            // Highlight possible moves
            highlightPossibleMoves(selectedSquare);
        } else {
            // Attempt to move the piece
            var move = chess.move({
                from: selectedSquare,
                to: square,
                promotion: 'q' // Promote to queen by default if a pawn reaches the last rank
            });

            if (move === null) {
                // Invalid move, deselect square and clear highlights
                $('.square-55d63').removeClass('highlight possible-move');
            } else {
                // Valid move, update board position
                board.position(chess.fen());

                // Flip the board
                $('#board').toggleClass('flipped');
                
                // Check if the game is over
                if (chess.game_over()) {
                    alert('Game over!');
                }
            }

            // Deselect the square
            selectedSquare = null;
            // Clear highlights
            $('.square-55d63').removeClass('highlight possible-move');
        }
    }
    function highlightPossibleMoves(square) {
        // Clear previous highlights
        $('.square-55d63').removeClass('possible-move');

        // Get possible moves for the piece at the selected square
        var moves = chess.moves({
            square: square,
            verbose: true
        });

        // Highlight possible moves
        moves.forEach(move => {
            // Use data-square attribute to match the square
            $('div[data-square="' + move.to + '"]').addClass('possible-move');
        });
    }


    function onSnapEnd () {
        board.position(chess.fen());
    }
});
