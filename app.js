/* MAPA */
const map = L.map('map', { zoomControl: false })
  .setView([0.3580, -78.1118], 17);

L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

/* VOZ */
function hablar(texto) {
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = 'es-ES';
  voz.rate = 0.9;
  speechSynthesis.speak(voz);
}

hablar("Bienvenido a la Universidad Técnica del Norte");

/* GPS EN TIEMPO REAL */
let userCoords = null;
let userMarker = null;

navigator.geolocation.watchPosition(
  pos => {
    userCoords = [pos.coords.latitude, pos.coords.longitude];

    if (!userMarker) {
      userMarker = L.circleMarker(userCoords, {
        radius: 8,
        color: '#0066ff',
        fillColor: '#3399ff',
        fillOpacity: 0.9
      }).addTo(map);
    } else {
      userMarker.setLatLng(userCoords);
    }

    if (ruta && destinoActual) {
      actualizarRuta();
    }
  },
  err => {
    hablar("No se pudo obtener tu ubicación");
  },
  { enableHighAccuracy: true }
);

/* UBICACIONES REALES DEL CAMPUS */
const lugares = [
  { nombre: "Biblioteca", coords: [0.358286, -78.111810] },
  { nombre: "FICA", coords: [0.358330, -78.111720] },
  { nombre: "Centro de Idiomas", coords: [0.358140, -78.111980] },
  { nombre: "Polideportivo", coords: [0.358090, -78.112260] },
  { nombre: "Auditorio", coords: [0.357720, -78.112050] },
  { nombre: "Canchas", coords: [0.357520, -78.111820] },
  { nombre: "Comedor", coords: [0.357850, -78.111300] }
];

let marcadorDestino = null;
let ruta = null;
let destinoActual = null;

/* BUSCAR */
function buscarLugar() {
  const texto = document.getElementById("searchInput")
    .value.trim().toLowerCase();

  if (!texto) return;

  const lugar = lugares.find(l =>
    l.nombre.toLowerCase() === texto ||
    l.nombre.toLowerCase().includes(texto)
  );

  if (!lugar) {
    hablar("No se encontró esa ubicación dentro del campus");
    return;
  }

  destinoActual = lugar;
  mostrarDestino(lugar);
}

/* BOTONES */
function buscarDirecto(nombre) {
  document.getElementById("searchInput").value = nombre;
  buscarLugar();
}

/* MOSTRAR DESTINO */
function mostrarDestino(lugar) {

  if (marcadorDestino) map.removeLayer(marcadorDestino);
  if (ruta) map.removeLayer(ruta);

  marcadorDestino = L.marker(lugar.coords)
    .addTo(map)
    .bindPopup(lugar.nombre)
    .openPopup();

  map.setView(lugar.coords, 18);

  actualizarRuta();

  hablar(`Te guiaré al ${lugar.nombre}`);
}

/* LINEA GUIA DINÁMICA */
function actualizarRuta() {
  if (!userCoords || !destinoActual) return;

  if (ruta) map.removeLayer(ruta);

  ruta = L.polyline([userCoords, destinoActual.coords], {
    color: 'red',
    weight: 5
  }).addTo(map);
}
