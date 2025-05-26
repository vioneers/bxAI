document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let grid = [];
    // Arrays to store constant dark patches and circles
    let darkRectangles = [];
    let blurredCircles = [];

    const cellSize = 100; // Size of each grid cell

    // Animation speed parameters for glowing cells
    const glowChance = 0.0001; // Significantly reduced chance for a cell to start glowing per frame
    const fadeInDuration = 1000; // How long the cell takes to fade in
    const peakBrightnessDuration = 3000; // How long the cell stays at peak brightness
    const fadeOutDuration = 3000; // How long the cell fades out

    // Noise filter parameters (adjusted for less, finer noise)
    const noiseDensity = 0.03; // Percentage of pixels to draw noise on (reduced)
    const noiseAlpha = 0.04; // Transparency of the noise pixels (reduced)
    const noiseSize = 1; // Size of each noise pixel (kept at 1 for finest single pixel dots)

    // Dark patches (rectangles) parameters
    const numDarkRectangles = 0; // Number of constant dark rectangles
    const darkPatchMinSize = 50; // Minimum size of a dark patch
    const darkPatchMaxSize = 200; // Maximum size of a dark patch
    const darkPatchAlpha = 0.8; // Transparency of the dark patches

    // Blurred dark circles parameters
    const numBlurredCircles = 5; // Number of constant blurred circles
    const blurredCircleMinRadius = 100; // Minimum radius of a blurred circle
    const blurredCircleMaxRadius = 500; // Maximum radius of a blurred circle
    const blurredCircleAlpha = 0.5; // Transparency of the blurred circles
    const blurredCircleBlurAmount = 20; // Amount of blur in pixels

    /**
     * Resizes the canvas to fill the window and reinitializes the grid and constant elements.
     * This ensures responsiveness on window resize.
     */
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Reinitialize grid and constant dark elements on resize to adapt to new dimensions
        initGrid();
        generateConstantDarkElements();
    }

    /**
     * Initializes the grid with cells. Each cell tracks its position and glow state.
     */
    function initGrid() {
        grid = [];
        for (let x = 0; x < width; x += cellSize) {
            for (let y = 0; y < height; y += cellSize) {
                grid.push({
                    x: x,
                    y: y,
                    alpha: 0, // Current transparency of the glow
                    glowStartTime: 0, // Timestamp when glow started
                    isGlowing: false // Flag to indicate if the cell is currently glowing
                });
            }
        }
    }

    /**
     * Generates a fixed number of dark rectangles and blurred circles.
     * These will persist on the canvas.
     */
    function generateConstantDarkElements() {
        darkRectangles = [];
        for (let i = 0; i < numDarkRectangles; i++) {
            const patchSize = darkPatchMinSize + Math.random() * (darkPatchMaxSize - darkPatchMinSize);
            const x = Math.random() * (width - patchSize);
            const y = Math.random() * (height - patchSize);
            darkRectangles.push({ x, y, size: patchSize, alpha: darkPatchAlpha });
        }

        blurredCircles = [];
        for (let i = 0; i < numBlurredCircles; i++) {
            const radius = blurredCircleMinRadius + Math.random() * (blurredCircleMaxRadius - blurredCircleMinRadius);
            const x = Math.random() * width;
            const y = Math.random() * height;
            blurredCircles.push({ x, y, radius, alpha: blurredCircleAlpha, blur: blurredCircleBlurAmount });
        }
    }

    /**
     * The main animation loop. Draws the grid, updates glowing cells,
     * draws constant dark patches and circles, and then noise.
     */
    function draw() {
        // Clear the entire canvas for the new frame
        ctx.clearRect(0, 0, width, height);

        // Draw static background grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; // Very subtle white lines
        ctx.lineWidth = 1;

        // Draw vertical lines
        for (let x = 0; x < width; x += cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y < height; y += cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        const currentTime = Date.now();

        // Iterate through each cell in the grid to update and draw glowing elements
        grid.forEach(cell => {
            // If a cell is not glowing, give it a chance to start glowing
            if (!cell.isGlowing && Math.random() < glowChance) {
                cell.isGlowing = true;
                cell.glowStartTime = currentTime;
                cell.alpha = 0; // Start fully transparent for fade-in
            }

            // If the cell is glowing, update its alpha based on time
            if (cell.isGlowing) {
                const elapsed = currentTime - cell.glowStartTime;

                if (elapsed < fadeInDuration) {
                    // Fade in phase: alpha increases from 0 to 1
                    cell.alpha = elapsed / fadeInDuration;
                } else if (elapsed < fadeInDuration + peakBrightnessDuration) {
                    // Peak brightness phase: alpha is 1
                    cell.alpha = 1;
                } else if (elapsed < fadeInDuration + peakBrightnessDuration + fadeOutDuration) {
                    // Fade out phase: alpha decreases from 1 to 0
                    cell.alpha = 1 - ((elapsed - (fadeInDuration + peakBrightnessDuration)) / fadeOutDuration);
                } else {
                    // Animation complete: reset cell
                    cell.isGlowing = false;
                    cell.alpha = 0;
                }

                // Only draw if the cell has some visibility
                if (cell.alpha > 0) {
                    // Draw the main glowing rectangle
                    ctx.fillStyle = `rgba(0, 123, 255, ${cell.alpha * 0.4})`; // Blue glow with transparency
                    ctx.fillRect(cell.x, cell.y, cellSize, cellSize);

                    // Add a subtle border to the glowing cells for definition, more opaque
                    ctx.strokeStyle = `rgba(0, 123, 255, ${cell.alpha * 0.8})`;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(cell.x, cell.y, cellSize, cellSize);
                }
            }
        });

        // --- Draw Constant Dark Patches (Rectangles) ---
        darkRectangles.forEach(patch => {
            ctx.fillStyle = `rgba(0, 0, 0, ${patch.alpha})`; // Black with transparency
            ctx.fillRect(patch.x, patch.y, patch.size, patch.size);
        });
        // --- End Draw Constant Dark Patches (Rectangles) ---

        // --- Draw Constant Blurred Dark Circles ---
        blurredCircles.forEach(circle => {
            ctx.filter = `blur(${circle.blur}px)`; // Apply blur filter
            ctx.fillStyle = `rgba(0, 0, 0, ${circle.alpha})`; // Black with transparency
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2); // Draw a circle
            ctx.fill();
            // IMPORTANT: Reset filter after drawing blurred elements to avoid blurring subsequent elements
            ctx.filter = 'none';
        });
        // --- End Draw Constant Blurred Dark Circles ---

        // --- Add Noise Filter ---
        // Loop through a percentage of the canvas area to draw noise pixels
        const numNoisePixels = width * height * noiseDensity;
        for (let i = 0; i < numNoisePixels; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            // Randomly choose between white or black noise for a subtle effect
            const color = Math.random() > 0.5 ? 255 : 0; // 255 for white, 0 for black
            ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${noiseAlpha})`;
            ctx.fillRect(x, y, noiseSize, noiseSize);
        }
        // --- End Noise Filter ---

        // Request the next animation frame
        requestAnimationFrame(draw);
    }

    // Initial setup calls
    resizeCanvas(); // Set initial canvas size and grid, and generate constant elements
    window.addEventListener('resize', resizeCanvas); // Listen for window resize events
    draw(); // Start the animation loop
});