"use strict";

// Get references to the HTML elements
const imageSequenceContainer = document.getElementById('image-sequence-container');
const sequenceImage = document.getElementById('sequence-image');
const section = document.getElementById('team-section');

// --- Animation Configuration ---
const framesPerBurst = 10; // Number of frames to play in each quick animation burst
const burstAnimationDurationMs = 300; // How fast each 20-frame burst plays (e.g., 0.4 seconds)

// Define the scroll distances for each "segment" of the animation
// Each segment consists of a short scroll to trigger, and a longer scroll to pause.
const scrollTriggerInitiationZone = 100; // Pixels user must scroll past to initiate a new burst
const scrollPauseZone = 300; // Pixels user must scroll through after a burst completes, while it's paused on the 20th frame

// Total scroll height for one full burst (animation + pause)
const segmentTotalScrollHeight = scrollTriggerInitiationZone + scrollPauseZone;

// --- Image Paths Setup ---
const imagePaths = [];
// IMPORTANT: Adjust numFrames to match the actual number of image files in your 'res/frames' directory.
// For smoother animation, ensure you have enough frames.
const numFrames = 160; // Example: 60 frames = 3 bursts of 20 frames

// Load image paths from the 'res/frames' directory
for (let i = 0; i < numFrames; i++) {
    const frameNumber = String(i).padStart(3, '0'); // e.g., 001, 002, ..., 060
    // Assuming image files are named like 'frame_001.jpg', 'frame_002.jpg', etc.
    // Adjust the file extension (.jpg, .png, etc.) if necessary.
    imagePaths.push(`res/frames/frame_${frameNumber}.png`);
}

// Calculate total animation bursts
const numBursts = Math.ceil(numFrames / framesPerBurst);

// Determine the total scroll height required for the entire animation (all bursts + pauses)
// This is crucial for correctly calculating the overall page height.
const totalAnimationScrollNeeded = numBursts * segmentTotalScrollHeight;

// --- Animation State Variables ---
let currentVisibleBurstIndex = 0; // The burst index that should currently be displayed (either animating or paused)
let isAnimatingBurst = false; // Flag to prevent multiple concurrent burst animations
let animationFrameId = null; // Stores the requestAnimationFrame ID for the current burst animation

// --- Preload Images ---
// This is vital for fluid animation. All images are loaded into memory first.
const preloadedImages = [];
let imagesLoadedCount = 0;
imagePaths.forEach(path => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
        imagesLoadedCount++;
        if (imagesLoadedCount === imagePaths.length) {
            console.log("All images preloaded.");
            // Set initial image after all images are loaded
            sequenceImage.src = imagePaths[0];
            // Adjust spacer-bottom height after images are loaded and animation height is calculated
            setSectionHeight();
            // Initial check in case user loaded page already scrolled
            handleScrollForBursts();
        }
    };
    img.onerror = () => {
        console.error(`Failed to load image: ${path}`);
        // Continue even if some images fail to load
        imagesLoadedCount++;
        if (imagesLoadedCount === imagePaths.length) {
            console.log("All images preloaded (with some errors).");
            sequenceImage.src = imagePaths[0];
            setSectionHeight();
            handleScrollForBursts();
        }
    };
    preloadedImages.push(img);
});

// --- Helper Function to Set Spacer Bottom Height ---
function setSectionHeight() {
    // The `image-sequence-container` is sticky and has `height: 100vh`.
    // The scrollable area for the animation starts from `imageSequenceContainer.offsetTop`.
    // We need to ensure there's enough scrollable content *after* the animation container
    // so that the browser allows scrolling through `totalAnimationScrollNeeded`.
    // The spacer-top contributes to the initial scroll.
    // So, spacer-bottom needs to make up the remaining scroll height.
    const totalPageContentHeightNeeded = imageSequenceContainer.offsetTop + totalAnimationScrollNeeded + window.innerHeight; // Add viewport height to allow final scroll out
    const currentContentHeight = parseFloat(section.style.height);

    if (totalAnimationScrollNeeded > currentContentHeight) {
        // Add the difference to spacer-bottom's height
        section.style.height = `${totalAnimationScrollNeeded - currentContentHeight}px`; // Subtract 100dvh to account for the sticky container's height
    } else {
        // If the content is already tall enough, ensure a minimum height
        section.style.height = `100dvh`; // Fallback minimum height
    }

    console.log(`Total animation scroll needed: ${totalAnimationScrollNeeded}px`);
    console.log(`team section adjusted to: ${section.style.height}`);
}


// --- Core Animation Logic ---

// Function to start playing a burst animation (20 frames)
function startBurstAnimation(targetBurstIndex) {
    // Prevent multiple animations from running simultaneously for the same burst
    if (isAnimatingBurst || targetBurstIndex >= numBursts || targetBurstIndex < 0) {
        return;
    }

    isAnimatingBurst = true;
    currentVisibleBurstIndex = targetBurstIndex;

    // Calculate the start and end global frame indices for this burst
    const burstStartIndex = currentVisibleBurstIndex * framesPerBurst;
    // Ensure the end index doesn't exceed the total number of frames available
    const burstEndIndex = Math.min(burstStartIndex + framesPerBurst, numFrames);

    let frameStartTime = performance.now(); // Timestamp when this burst animation started

    function animateBurst(currentTime) {
        if (!isAnimatingBurst) {
            // If the animation was stopped externally (e.g., by another scroll trigger)
            cancelAnimationFrame(animationFrameId);
            return;
        }

        const elapsedTime = currentTime - frameStartTime;
        // Calculate progress (0 to 1) based on elapsed time and burst duration
        const progress = Math.min(1, elapsedTime / burstAnimationDurationMs);

        // Determine which frame within the 20-frame burst should be displayed
        let frameIndexInBurst = Math.floor(progress * framesPerBurst);

        // Ensure it stays on the last frame of the burst if progress is 1 or more
        if (frameIndexInBurst >= framesPerBurst) {
            frameIndexInBurst = framesPerBurst - 1;
        }

        // Calculate the global index of the frame to display
        const globalFrameIndex = burstStartIndex + frameIndexInBurst;
        const clampedGlobalFrameIndex = Math.min(globalFrameIndex, numFrames-1); // Final clamping

        // Update the image source
        sequenceImage.src = imagePaths[clampedGlobalFrameIndex];

        // Continue animation if not finished
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animateBurst);
        } else {
            // Burst animation finished playing all 20 frames
            isAnimatingBurst = false;
            cancelAnimationFrame(animationFrameId); // Clear the animation frame ID
        }
    }

    // Start the animation loop
    animationFrameId = requestAnimationFrame(animateBurst);
}

// --- Scroll Event Handler ---
function handleScrollForBursts() {
    const animationSectionTop = section.offsetTop;
    const currentScrollY = window.scrollY;

    // Calculate scroll position relative to the animation section's start
    let relativeScroll = currentScrollY - animationSectionTop;

    // Clamp relativeScroll to be within the total animation's designated height
    relativeScroll = Math.max(0, Math.min(totalAnimationScrollNeeded, relativeScroll));

    // Determine which "segment" (burst + pause zone) the user's scroll position falls into
    const targetSegmentIndex = Math.floor(relativeScroll / segmentTotalScrollHeight);

    // If the user's scroll position has entered a new segment (burst zone)
    // and we are not currently animating a burst for that segment
    if (targetSegmentIndex !== currentVisibleBurstIndex && !isAnimatingBurst) {
        // Trigger the animation for the new burst
        startBurstAnimation(targetSegmentIndex);
    } else if (targetSegmentIndex === currentVisibleBurstIndex && !isAnimatingBurst) {
        // If the user is currently in the correct segment but not animating (meaning it's paused)
        // Ensure the static last frame of that burst is displayed.
        const targetFrameIndex = Math.min((currentVisibleBurstIndex * framesPerBurst) + framesPerBurst - 1, numFrames - 1);
        if (sequenceImage.src !== imagePaths[targetFrameIndex]) {
            sequenceImage.src = imagePaths[targetFrameIndex];
        }
    }
    // If isAnimatingBurst is true, the requestAnimationFrame loop is managing the image.
}

// Add scroll event listener
window.addEventListener('scroll', handleScrollForBursts);

// Initial setup on page load
window.addEventListener('load', () => {
    // Ensure the `spacer-bottom` height is correctly set up
    setSectionHeight();

    // Set the very first frame immediately if images are loaded
    if (imagesLoadedCount === imagePaths.length && imagePaths.length > 0) {
        sequenceImage.src = imagePaths[0];
    } else {
        // If not all images loaded, show loading text until they are
        sequenceImage.src = 'https://placehold.co/800x600/a0c4ff/ffffff?text=Loading...';
    }

    // Call handleScrollForBursts initially in case the user loads the page scrolled down
    handleScrollForBursts();
});