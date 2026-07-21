import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const nombresRef = ref(db, 'sorteo/nombres');
const imagenRef = ref(db, 'sorteo/imagen');

const gridContainer = document.getElementById('grid-container');
const imageUpload = document.getElementById('image-upload');
const raffleImage = document.getElementById('raffle-image');
const placeholderText = document.getElementById('placeholder-text');
const countFilledEl = document.getElementById('count-filled');
const countEmptyEl = document.getElementById('count-empty');
const btnReset = document.getElementById('btn-reset');
const btnExport = document.getElementById('btn-export');
const toast = document.getElementById('toast');
const statusBadge = document.getElementById('status-badge');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');

const inputs = new Array(51);
const cards = new Array(51);
let nombresData = {};
let lastImageVal = null;

function initGrid() {
    gridContainer.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= 50; i++) {
        const numFormatted = String(i).padStart(2, '0');

        const card = document.createElement('div');
        card.className = 'number-card';
        card.id = `card-${i}`;

        const badge = document.createElement('div');
        badge.className = 'number-badge';
        badge.textContent = numFormatted;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'number-input';
        input.id = `input-${i}`;
        input.dataset.numero = String(i);
        input.placeholder = 'Nombre del participante...';

        card.appendChild(badge);
        card.appendChild(input);
        fragment.appendChild(card);

        cards[i] = card;
        inputs[i] = input;
    }

    gridContainer.appendChild(fragment);
}

// TIEMPO REAL para nombres
onValue(nombresRef, (snapshot) => {
    nombresData = snapshot.val() || {};

    statusBadge.textContent = '🟢 Conectado en Tiempo Real';
    statusBadge.classList.add('connected');

    for (let i = 1; i <= 50; i++) {
        const input = inputs[i];
        const card = cards[i];
        const val = nombresData[i] || '';
        const isFilled = val.trim() !== '';

        if (input && document.activeElement !== input && input.value !== val) {
            input.value = val;
        }

        if (card) {
            card.classList.toggle('filled', isFilled);
        }
    }

    actualizarContadores();
});

// TIEMPO REAL para Imagen
onValue(imagenRef, (snapshot) => {
    const imgVal = snapshot.val() || '';
    if (imgVal === lastImageVal) {
        return;
    }

    lastImageVal = imgVal;
    if (imgVal) {
        raffleImage.src = imgVal;
        raffleImage.style.display = 'block';
        placeholderText.style.display = 'none';
    } else {
        raffleImage.src = '';
        raffleImage.style.display = 'none';
        placeholderText.style.display = 'block';
    }
});

// Envío de cambios
gridContainer.addEventListener('input', (e) => {
if (e.target.classList.contains('number-input')) {
    const numero = e.target.dataset.numero;
    const nombre = e.target.value;

    const itemRef = ref(db, `sorteo/nombres/${numero}`);
    if (nombre.trim() !== '') {
    set(itemRef, nombre);
    } else {
    remove(itemRef);
    }
    mostrarToast('Sincronizado en tiempo real');
}
});

// Envío de imagen
imageUpload.addEventListener('change', (e) => {
const file = e.target.files[0];
if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
    const base64Image = event.target.result;
    set(imagenRef, base64Image)
        .then(() => mostrarToast('Imagen actualizada en todos los dispositivos'))
        .catch(() => alert('La imagen es demasiado pesada para enviarse en tiempo real. Intenta con una imagen más liviana.'));
    };
    reader.readAsDataURL(file);
}
});

function actualizarContadores() {
const cantidadVendida = Object.keys(nombresData).length;
countFilledEl.textContent = cantidadVendida;
countEmptyEl.textContent = 50 - cantidadVendida;
}

const loginCredentials = {
    username: 'juan',
    password: 'velasquez'
};

function showLoginModal() {
    loginModal.classList.remove('hidden');
    document.body.classList.add('locked');
    loginError.textContent = '';
    loginUsername.value = '';
    loginPassword.value = '';
    loginUsername.focus();
}

function hideLoginModal() {
    loginModal.classList.add('hidden');
    document.body.classList.remove('locked');
}

function validarCredenciales(usuario, contrasena) {
    return usuario === loginCredentials.username && contrasena === loginCredentials.password;
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = loginUsername.value.trim();
    const contrasena = loginPassword.value;

    if (validarCredenciales(usuario, contrasena)) {
        hideLoginModal();
    } else {
        loginError.textContent = 'Usuario o contraseña incorrectos. Intenta de nuevo.';
        loginPassword.value = '';
        loginPassword.focus();
    }
});

let timeoutToast;
function mostrarToast(mensaje) {
toast.textContent = mensaje;
toast.classList.add('show');
clearTimeout(timeoutToast);
timeoutToast = setTimeout(() => {
    toast.classList.remove('show');
}, 1200);
}

// Limpiar BD
btnReset.addEventListener('click', () => {
if (confirm('¿Deseas reiniciar el sorteo para TODOS los dispositivos conectados?')) {
    remove(ref(db, 'sorteo'));
    mostrarToast('Sorteo reiniciado');
}
});

// Exportar
btnExport.addEventListener('click', () => {
let reporte = "LISTA DEL SORTEO (50 NÚMEROS)\n";
reporte += "===================================\n";
for (let i = 1; i <= 50; i++) {
    const numFormatted = String(i).padStart(2, '0');
    const nombre = nombresData[i] || '--- DISPONIBLE ---';
    reporte += `N° ${numFormatted}: ${nombre}\n`;
}

const blob = new Blob([reporte], { type: 'text/plain;charset=utf-8' });
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = 'lista_sorteo_50.txt';
link.click();
});

initGrid();
showLoginModal();