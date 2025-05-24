"use strict";

function animateNumber(element, target, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(progress * target);
        element.textContent = currentValue;
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
   
    requestAnimationFrame(update);
}

let numbersAnimated = false;
function handleScrollCounter() {

    const section = document.getElementById("numbers-section");
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (!numbersAnimated && sectionTop < windowHeight - 100) {
        numbersAnimated = true;
        
        document.querySelectorAll(".stat").forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"));
            animateNumber(stat, target, 3000);
        });
    }
}

window.addEventListener("scroll", handleScrollCounter);
window.addEventListener("load", handleScrollCounter);