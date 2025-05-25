"use strict";

window.onload = function () {
  const map = L.map('map', { preferCanvas: true }).setView([48.7139, 2.2085], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const locations = [
    { coords: [48.7139, 2.2085], name: "École Polytechnique" },
    { coords: [44.4268, 26.1025], name: "Maria, Luxin & Tea" },
    { coords: [40.4168, -3.7038], name: "Antonio" },
    { coords: [41.3874, 2.1686], name: "Angel" },
    { coords: [41.7151, 44.8271], name: "Keti" },
    { coords: [40.7128, -74.0060], name: "Apolline" },
    { coords: [60.1699, 24.9384], name: "Utu" }
  ];

  locations.forEach((loc) => {
    const marker = L.marker(loc.coords).addTo(map);
    marker.bindPopup(`<strong>${loc.name}</strong>`);
  });
};
