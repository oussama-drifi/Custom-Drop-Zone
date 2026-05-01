// ── Theme toggle ──
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
});

function updateIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
}

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// ── Open file picker on click (but not on the remove buttons) ──
dropzone.addEventListener('click', (e) => {
    if (!e.target.closest('.btn-remove')) fileInput.click();
});

fileInput.addEventListener('change', () => {
    handleFiles([...fileInput.files]);
    fileInput.value = '';
});

// ── Drag events (counter prevents false dragleave on child elements) ──
let dragCounter = 0;

dropzone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    dropzone.classList.add('hover');
});

dropzone.addEventListener('dragleave', () => {
    dragCounter--;
    if (dragCounter === 0) dropzone.classList.remove('hover');
});

dropzone.addEventListener('dragover', (e) => e.preventDefault());

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    dropzone.classList.remove('hover');
    handleFiles([...e.dataTransfer.files]);
});

// ── Process files ──
function handleFiles(files) {
    files.forEach(file => {
        const error = validate(file);
        addFileItem(file, error);
    });
}

function validate(file) {
    if (!ACCEPTED.includes(file.type)) return 'Unsupported format';
    if (file.size > MAX_SIZE) return 'File exceeds 10 MB';
    return null;
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function addFileItem(file, error) {
    const item = document.createElement('div');
    item.className = 'file-item';

    // Thumbnail or icon
    const thumbWrap = document.createElement('div');
    if (!error && file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.className = 'file-thumb';
        img.alt = file.name;
        const reader = new FileReader();
        reader.onload = e => (img.src = e.target.result);
        reader.readAsDataURL(file);
        thumbWrap.appendChild(img);
    } else {
        thumbWrap.className = 'file-thumb-icon';
        thumbWrap.innerHTML = `<i class="bi bi-file-earmark-image"></i>`;
    }

    // Info
    const info = document.createElement('div');
    info.className = 'file-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'file-name';
    nameEl.textContent = file.name;

    const metaEl = document.createElement('div');
    metaEl.className = 'file-meta';
    metaEl.textContent = formatSize(file.size);

    info.appendChild(nameEl);
    info.appendChild(metaEl);

    // Progress bar (shown during simulated upload)
    if (!error) {
        const progressWrap = document.createElement('div');
        progressWrap.className = 'progress-bar-wrap';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = '0%';
        progressWrap.appendChild(progressBar);
        info.appendChild(progressWrap);
    }

    // Status badge
    const statusEl = document.createElement('div');
    statusEl.className = 'file-status';
    if (error) {
        statusEl.innerHTML = `<span class="badge badge-error"><i class="bi bi-x-circle"></i>${error}</span>`;
    }

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove';
    removeBtn.innerHTML = `<i class="bi bi-x"></i>`;
    removeBtn.title = 'Remove';
    removeBtn.addEventListener('click', () => item.remove());

    item.appendChild(thumbWrap);
    item.appendChild(info);
    item.appendChild(statusEl);
    item.appendChild(removeBtn);
    fileList.appendChild(item);

    // Kick off simulated upload after DOM insert
    if (!error) {
        simulateUpload(
            info.querySelector('.progress-bar'),
            info.querySelector('.progress-bar-wrap'),
            statusEl
        );
    }
}

function simulateUpload(bar, wrap, statusEl) {
    let progress = 0;
    const tick = setInterval(() => {
        progress += Math.random() * 18 + 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(tick);
            wrap.remove();
            statusEl.innerHTML = `<span class="badge badge-success"><i class="bi bi-check-circle"></i>Ready</span>`;
        }
        bar.style.width = progress + '%';
    }, 120);
}