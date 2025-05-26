function updateCountdown() {
  const countdownElement = document.getElementById("countdown_event");
  if (!countdownElement) return;

  const eventTime = new Date("2025-06-03T18:00:00+02:00").getTime();
  const now = new Date().getTime();
  const distance = eventTime - now;

  if (distance <= 0) {
    countdownElement.innerText = "The event is happening now!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  let countdownText = `Next event in: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds!`;

  if (window.innerWidth < 768) {
    countdownText = `Next event in:\n${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  countdownElement.innerText = countdownText;
}

setInterval(updateCountdown, 1000);
updateCountdown();
