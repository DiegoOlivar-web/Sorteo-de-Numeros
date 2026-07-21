const STORAGE_KEY_NAMES = 'sorteo_50_nombres';
const STORAGE_KEY_IMAGE = 'sorteo_50_imagen';

const gridContainer = document.getElementById('grid-container');
const imageUpload = document.getElementById('image-upload');
const raffleImage = document.getElementById('raffle-image');
const placeholderText = document.getElementById('placeholder-text');
const countFilledEl = document.getElementById('count-filled');
const countEmptyEl = document.getElementById('count-empty');
const btnReset = document.getElementById('btn-reset');
const btnExport = document.getElementById('btn-export');
const toast = document.getElementById('toast');

let nombresData = JSON.parse(localStorage.getItem(STORAGE_KEY_NAMES)) || {};

// Renderizado 50 números
function renderGrid() {
gridContainer.innerHTML = '';
for (let i = 1; i <= 50; i++) {
    const numFormatted = String(i).padStart(2, '0');
    const valorActual = nombresData[i] || '';

    const card = document.createElement('div');
    card.className = `number-card ${valorActual.trim() !== '' ? 'filled' : ''}`;
    card.id = `card-${i}`;

    card.innerHTML = `
    <div class="number-badge">${numFormatted}</div>
    <input 
        type="text" 
        class="number-input" 
        data-numero="${i}" 
        placeholder="Nombre del participante..." 
        value="${escapeHtml(valorActual)}"
    />
    `;

    gridContainer.appendChild(card);
}
actualizarContadores();
}

function escapeHtml(text) {
return text.replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
});
}

// Guardado de números
gridContainer.addEventListener('input', (e) => {
if (e.target.classList.contains('number-input')) {
    const numero = e.target.dataset.numero;
    const nombre = e.target.value;
    const cardElement = document.getElementById(`card-${numero}`);

    if (nombre.trim() !== '') {
    nombresData[numero] = nombre;
    cardElement.classList.add('filled');
    } else {
    delete nombresData[numero];
    cardElement.classList.remove('filled');
    }

    localStorage.setItem(STORAGE_KEY_NAMES, JSON.stringify(nombresData));
    actualizarContadores();
    mostrarToast('Guardado automáticamente');
}
});

// Guardado de imagen
function cargarImagenGuardada() {
const savedImage = localStorage.getItem(STORAGE_KEY_IMAGE);
if (savedImage) {
    raffleImage.src = savedImage;
    raffleImage.style.display = 'block';
    placeholderText.style.display = 'none';
}
}

imageUpload.addEventListener('change', (e) => {
const file = e.target.files[0];
if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
    const base64Image = event.target.result;
    raffleImage.src = base64Image;
    raffleImage.style.display = 'block';
    placeholderText.style.display = 'none';
    
    try {
        localStorage.setItem(STORAGE_KEY_IMAGE, base64Image);
        mostrarToast('Imagen guardada');
    } catch (err) {
        alert('La imagen es muy pesada para guardarse automáticamente. Se mantendrá visible mientras no cierres la pestaña.');
    }
    };
    reader.readAsDataURL(file);
}
});

// Cont
function actualizarContadores() {
const cantidadVendida = Object.keys(nombresData).length;
countFilledEl.textContent = cantidadVendida;
countEmptyEl.textContent = 50 - cantidadVendida;
}

// Notify
let timeoutToast;
function mostrarToast(mensaje) {
toast.textContent = mensaje;
toast.classList.add('show');
clearTimeout(timeoutToast);
timeoutToast = setTimeout(() => {
    toast.classList.remove('show');
}, 1200);
}

// Limpiar lista
btnReset.addEventListener('click', () => {
if (confirm('¿Deseas vaciar la lista de participantes y la imagen?')) {
    localStorage.removeItem(STORAGE_KEY_NAMES);
    localStorage.removeItem(STORAGE_KEY_IMAGE);
    nombresData = {};
    raffleImage.src = '';
    raffleImage.style.display = 'none';
    placeholderText.style.display = 'block';
    renderGrid();
    mostrarToast('Lista reiniciada');
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

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
renderGrid();
cargarImagenGuardada();
});