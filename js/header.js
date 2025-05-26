"use strict";

// Get the header element
const header = document.querySelector('header');

// Variable to store the previous scroll position
let lastScrollTop = 0;

// Add a scroll event listener to the window
window.addEventListener('scroll', function () {
    // Get the current scroll position
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Check if user is scrolling down
    if (currentScroll > lastScrollTop && currentScroll > header.offsetHeight) {
        // If scrolling down and past the header's initial height, hide the header
        header.classList.add('header-hidden');
        document.querySelector(".nav-links").classList.remove("show");
    } else {
        // If scrolling up or at the very top of the page, show the header
        header.classList.remove('header-hidden');
    }

    // Update the last scroll position for the next scroll event
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
});

document.querySelector(".hamburger").addEventListener("click", function () {
    document.querySelector(".nav-links").classList.toggle("show");
});