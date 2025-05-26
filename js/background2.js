// JavaScript (script.js content)
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const squareSize = 100; // Size of each square in pixels
    const gapSize = 2; // Gap between squares in pixels

    let cols, rows;

    /**
     * Creates or recreates the grid of black squares based on window dimensions.
     * This function is called on initial load and whenever the window is resized.
     */
    function createGrid() {
        // Clear any existing squares to prevent duplicates on resize
        gridContainer.innerHTML = '';

        // Calculate the number of columns and rows that can fit the current window size
        // considering the square size and the gap between them.
        cols = Math.ceil(window.innerWidth / (squareSize + gapSize));
        rows = Math.ceil(window.innerHeight / (squareSize + gapSize));

        // Set the CSS grid properties dynamically to match the calculated columns and rows.
        // This ensures the grid fills the available space responsively.
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

        // Populate the grid container with the calculated number of squares.
        for (let i = 0; i < cols * rows; i++) {
            const square = document.createElement('div');
            square.classList.add('grid-square'); // Add the base styling class
            gridContainer.appendChild(square);
        }
    }

    /**
     * Triggers the glow animation on a randomly selected square.
     * The animation makes the square turn blue, slightly enlarge, and then revert.
     */
    function animateRandomSquare() {
        const squares = document.querySelectorAll('.grid-square');
        if (squares.length === 0) {
            console.warn("No grid squares found to animate.");
            return; // Exit if no squares are present
        }

        // Select a random square from the generated grid.
        const randomIndex = Math.floor(Math.random() * squares.length);
        const randomSquare = squares[randomIndex];

        // Add the 'glow' class to trigger the CSS animation defined in style.css.
        randomSquare.classList.add('glow');

        // Listen for the 'animationend' event to know when the glow animation has finished.
        // The '{ once: true }' option ensures this listener is automatically removed after it fires once,
        // preventing memory leaks and ensuring the square is ready for future animations.
        randomSquare.addEventListener('animationend', () => {
            // Once the animation completes, remove the 'glow' class.
            // This resets the square to its default black state, making it ready to glow again later.
            randomSquare.classList.remove('glow');
        }, { once: true });
    }

    // Initial call to create the grid when the page first loads.
    createGrid();

    // Add an event listener to re-create the grid whenever the browser window is resized.
    // This ensures the grid remains responsive and fills the screen correctly.
    window.addEventListener('resize', createGrid);

    // Set up an interval to periodically trigger the glowing square animation.
    // This creates the "rarely" glowing effect.
    setInterval(() => {
        // Generate a random delay between 0ms and 3000ms (0 to 3 seconds)
        // before actually starting the `animateRandomSquare` function.
        // This makes the glowing events much more frequent and unpredictable.
        const randomDelay = Math.random() * 3000;
        setTimeout(animateRandomSquare, randomDelay);
    }, 1000); // This outer interval checks every 1 second if a new glow should be scheduled.
});