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
const numberElements = new Array(51);
const mobileImg = document.getElementById('imagen-mobile');
let lastBgUrl = '';

const fragment = document.createDocumentFragment();
for (let i = 1; i <= 50; i++) {
    const divDiv = document.createElement('div');
    divDiv.className = 'numero';
    divDiv.id = `num-${i}`;
    divDiv.textContent = i;

    fragment.appendChild(divDiv);
    numberElements[i] = divDiv;
}
grid.appendChild(fragment);

// Cambios en tiempo real
const nombresRef = ref(db, 'sorteo/nombres');

onValue(nombresRef, (snapshot) => {
    const datos = snapshot.val() || {};

    for (let i = 1; i <= 50; i++) {
        const elementoNumero = numberElements[i];
        if (!elementoNumero) {
            continue;
        }

        const nombre = datos[i];
        const registrado = typeof nombre === 'string' && nombre.trim() !== '';

        elementoNumero.classList.toggle('registrado', registrado);
        elementoNumero.title = registrado ? `Registrado por: ${nombre}` : '';
    }
});

// Sincronizar imagen
const imagenRef = ref(db, 'sorteo/imagen');
onValue(imagenRef, (snapshot) => {
    const imgVal = snapshot.val() || '';
    const bgUrl = imgVal ? `url('${imgVal}')` : "url('plantilla-sorteo.png')";

    if (bgUrl === lastBgUrl) {
        return;
    }

    lastBgUrl = bgUrl;
    document.body.style.backgroundImage = bgUrl;
    if (mobileImg) {
        mobileImg.style.backgroundImage = bgUrl;
    }
});