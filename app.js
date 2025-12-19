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
  { nombre: "Biblioteca", coords: [0.3586732674871526, -78.1115249373806] },
  { nombre: "FCCS", coords: [0.3589090924468441, -78.1116708650704] },
  { nombre: "FICA", coords: [0.3588957936356396, -78.11132723049812] },
  { nombre: "Centro de Idiomas", coords: [0.35849867883906034, -78.11171386162185] },
  { nombre: "Polideportivo", coords: [0.3587541759882453, -78.11249614174487] },
  { nombre: "Auditorio", coords: [0.3572721211686934, -78.11178648548976] },
  { nombre: "Canchas", coords: [0.35758588167812405, -78.1115773077047] },
  { nombre: "CanchasN1", coords: [0.35679120874729586, -78.11169605115022] },
  { nombre: "Comedor", coords: [0.3563987784907535, -78.11131401953625] },
  { nombre: "FECYT", coords: [0.35723707779712466, -78.11094045601] },
  { nombre: "FACAE", coords: [0.35674310639488443, -78.11083996696314] },
  { nombre: "Jardin Facae", coords: [0.3568132784751284, -78.11118126504171] },
  { nombre: "Institucion de postgrado", coords: [0.3582613749429171, -78.11255602653867] },
  { nombre: "Parque acuatico", coords: [0.3591306785344449, -78.11210297225011] },
  { nombre: "Snna-utn", coords: [0.3591306785344449, -78.11210297225011] },  
  { nombre: "Jardin bienestar", coords: [0.3591548344975423, -78.11050656245071] },
  { nombre: "Edificio central", coords: [0.35794192246309736, -78.11089041857365] },
  { nombre: "carrera en electricidad", coords: [0.3578220118950115, -78.11235599174665] },
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
