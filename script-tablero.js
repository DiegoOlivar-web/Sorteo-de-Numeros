// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
apiKey: "AIzaSyDR-P_S7CAGCEw8WlJzTgHPkDMPIOdZWQk",
authDomain: "ilovejuan.firebaseapp.com",
databaseURL: "https://ilovejuan-default-rtdb.firebaseio.com",
projectId: "ilovejuan",
storageBucket: "ilovejuan.firebasestorage.app",
messagingSenderId: "57213839627",
appId: "1:57213839627:web:429c76d2183f2c924d1a0e",
measurementId: "G-97C9T9N0XD"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Cuadrícula
const grid = document.getElementById('grid-numeros');
for (let i = 1; i <= 50; i++) {
const divDiv = document.createElement('div');
divDiv.className = 'numero';
divDiv.id = `num-${i}`;
divDiv.textContent = i;
grid.appendChild(divDiv);
}

// Cambios en tiempo real
const nombresRef = ref(db, 'sorteo/nombres');

onValue(nombresRef, (snapshot) => {
const datos = snapshot.val() || {};

// Recorrido de tablero
for (let i = 1; i <= 50; i++) {
    const elementoNumero = document.getElementById(`num-${i}`);
    
    if (datos[i] && datos[i].trim() !== "") {
    elementoNumero.classList.add('registrado');
    elementoNumero.title = `Registrado por: ${datos[i]}`; // Monstrar nombre
    } else {
    elementoNumero.classList.remove('registrado');
    elementoNumero.title = "";
    }
}
});

// Sincronizar imagen
const imagenRef = ref(db, 'sorteo/imagen');
onValue(imagenRef, (snapshot) => {
const imgVal = snapshot.val();
const bgUrl = imgVal ? `url('${imgVal}')` : "url('plantilla-sorteo.png')";

// Actualizar fondo escritorio
document.body.style.backgroundImage = bgUrl;

// Actualizar contenedor móviles
const mobileImg = document.getElementById('imagen-mobile');
if (mobileImg) {
    mobileImg.style.backgroundImage = bgUrl;
}
});