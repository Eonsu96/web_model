// Paper size configurations (in pixels at 96 DPI)
const PAPER_SIZES = {
    a4: { width: 794, height: 1123, name: 'A4 (210×297mm)' },
    a3: { width: 1123, height: 1587, name: 'A3 (297×420mm)' },
    a5: { width: 559, height: 794, name: 'A5 (148×210mm)' },
    letter: { width: 816, height: 1056, name: 'Letter (8.5×11")' }
};

// State management
const state = {
    photos: [],
    currentPhotoIndex: 0,
    currentPhotoData: null,
    filters: {
        brightness: 0,
        contrast: 0,
        clarity: 0,
        saturation: 0
    },
    paperSize: 'a4'
};

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const photoInput = document.getElementById('photoInput');
const photoList = document.getElementById('photoList');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const placeholderMessage = document.getElementById('placeholderMessage');

const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const claritySlider = document.getElementById('clarity');
const saturationSlider = document.getElementById('saturation');

const brightnessValue = document.getElementById('brightnessValue');
const contrastValue = document.getElementById('contrastValue');
const clarityValue = document.getElementById('clarityValue');
const saturationValue = document.getElementById('saturationValue');

const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const printBtn = document.getElementById('printBtn');

const paperSizeRadios = document.querySelectorAll('input[name="paperSize"]');
const paperInfo = document.getElementById('paperInfo');
const canvasInfo = document.getElementById('canvasInfo');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateCanvasSize();
});

// Event Listeners Setup
function setupEventListeners() {
    // Upload events
    uploadArea.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', handleFileSelect);
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFileDrop(e.dataTransfer.files);
    });

    // Filter sliders
    brightnessSlider.addEventListener('input', (e) => {
        state.filters.brightness = parseInt(e.target.value);
        brightnessValue.textContent = e.target.value + '%';
        redrawCanvas();
    });

    contrastSlider.addEventListener('input', (e) => {
        state.filters.contrast = parseInt(e.target.value);
        contrastValue.textContent = e.target.value + '%';
        redrawCanvas();
    });

    claritySlider.addEventListener('input', (e) => {
        state.filters.clarity = parseInt(e.target.value);
        clarityValue.textContent = e.target.value + '%';
        redrawCanvas();
    });

    saturationSlider.addEventListener('input', (e) => {
        state.filters.saturation = parseInt(e.target.value);
        saturationValue.textContent = e.target.value + '%';
        redrawCanvas();
    });

    // Paper size selection
    paperSizeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.paperSize = e.target.value;
            updateCanvasSize();
            redrawCanvas();
        });
    });

    // Action buttons
    resetBtn.addEventListener('click', resetFilters);
    downloadBtn.addEventListener('click', downloadImage);
    printBtn.addEventListener('click', printImage);
}

// File Handling
function handleFileSelect(e) {
    handleFileDrop(e.target.files);
}

function handleFileDrop(files) {
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    state.photos.push({
                        id: Date.now() + index,
                        name: file.name,
                        data: img
                    });
                    updatePhotoList();
                    if (state.currentPhotoIndex === 0 && state.photos.length === 1) {
                        selectPhoto(0);
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Photo List Management
function updatePhotoList() {
    photoList.innerHTML = '';
    state.photos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = `photo-item ${index === state.currentPhotoIndex ? 'active' : ''}`;
        photoItem.innerHTML = `
            <span class="photo-item-name">${photo.name}</span>
            <button class="photo-item-remove">Remove</button>
        `;
        
        photoItem.addEventListener('click', () => selectPhoto(index));
        photoItem.querySelector('.photo-item-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            removePhoto(index);
        });
        
        photoList.appendChild(photoItem);
    });
}

function selectPhoto(index) {
    state.currentPhotoIndex = index;
    state.currentPhotoData = state.photos[index].data;
    updatePhotoList();
    resetFilters();
    redrawCanvas();
}

function removePhoto(index) {
    state.photos.splice(index, 1);
    if (state.photos.length === 0) {
        state.currentPhotoIndex = 0;
        state.currentPhotoData = null;
        placeholderMessage.style.display = 'block';
    } else if (state.currentPhotoIndex >= state.photos.length) {
        state.currentPhotoIndex = state.photos.length - 1;
        selectPhoto(state.currentPhotoIndex);
    } else {
        selectPhoto(state.currentPhotoIndex);
    }
    updatePhotoList();
}

// Canvas Management
function updateCanvasSize() {
    const size = PAPER_SIZES[state.paperSize];
    canvas.width = size.width;
    canvas.height = size.height;
    paperInfo.textContent = `Paper Size: ${size.name}`;
    canvasInfo.textContent = `Canvas: ${size.width}×${size.height}px`;
}

function redrawCanvas() {
    if (!state.currentPhotoData) {
        placeholderMessage.style.display = 'block';
        return;
    }

    placeholderMessage.style.display = 'none';

    // Get paper size
    const paperSize = PAPER_SIZES[state.paperSize];
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate image dimensions to fit the canvas
    const imgAspect = state.currentPhotoData.width / state.currentPhotoData.height;
    const canvasAspect = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, drawX, drawY;

    if (imgAspect > canvasAspect) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgAspect;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
    } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgAspect;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
    }

    // Apply filters
    applyFilters();
    
    // Draw image
    ctx.drawImage(state.currentPhotoData, drawX, drawY, drawWidth, drawHeight);
}

function applyFilters() {
    // Create filter string
    let filterString = '';

    if (state.filters.brightness !== 0) {
        const brightness = 100 + state.filters.brightness;
        filterString += `brightness(${brightness}%) `;
    }

    if (state.filters.contrast !== 0) {
        const contrast = 100 + state.filters.contrast;
        filterString += `contrast(${contrast}%) `;
    }

    if (state.filters.saturation !== 0) {
        const saturation = 100 + state.filters.saturation;
        filterString += `saturate(${saturation}%) `;
    }

    if (state.filters.clarity !== 0) {
        const clarity = 100 + (state.filters.clarity * 0.5);
        filterString += `contrast(${clarity}%) `;
    }

    ctx.filter = filterString || 'none';
}

// Filter Controls
function resetFilters() {
    state.filters = {
        brightness: 0,
        contrast: 0,
        clarity: 0,
        saturation: 0
    };

    brightnessSlider.value = 0;
    contrastSlider.value = 0;
    claritySlider.value = 0;
    saturationSlider.value = 0;

    brightnessValue.textContent = '0%';
    contrastValue.textContent = '0%';
    clarityValue.textContent = '0%';
    saturationValue.textContent = '0%';

    ctx.filter = 'none';
    redrawCanvas();
}

// Download Functionality
function downloadImage() {
    if (!state.currentPhotoData) {
        alert('Please upload a photo first!');
        return;
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `photo-${Date.now()}.png`;
    link.click();
}

// Print Functionality
function printImage() {
    if (!state.currentPhotoData) {
        alert('Please upload a photo first!');
        return;
    }

    const printWindow = window.open('', '', 'width=800,height=600');
    const paperSize = PAPER_SIZES[state.paperSize];
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Print Photo</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                }
                img {
                    width: 100%;
                    height: 100%;
                }
                @page {
                    size: ${getPaperSizeCSS(state.paperSize)};
                    margin: 0;
                }
            </style>
        </head>
        <body onload="window.print()">
            <img src="${canvas.toDataURL('image/png')}" />
        </body>
        </html>
    `);
    printWindow.document.close();
}

function getPaperSizeCSS(size) {
    const sizeMap = {
        a4: 'A4',
        a3: 'A3',
        a5: 'A5',
        letter: 'letter'
    };
    return sizeMap[size] || 'A4';
}
