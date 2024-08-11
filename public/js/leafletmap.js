var map = L.map('map').setView([40, 35], 9);
        
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Coded By Coder Shreya ♥♥ 💕❤️💕'
}).addTo(map);

           
const icon = L.icon({
    iconUrl: "/images/wanderlusticon.svg", // Correct path relative to the 'public' directory
    iconSize: [100, 100]
  });
  
  L.marker([coordinates[1], coordinates[0]], { icon: icon}).addTo(map)
    .bindPopup(`<b><h4>${listing.location}</h4><p> Exact Location Provided After Booking</p></b>`)
    .openPopup();



    