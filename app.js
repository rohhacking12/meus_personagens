// app.js

var currentCharacterId = null;
var currentImageData = null;

function $(id) {
    return document.getElementById(id);
}

function showView(name) {
    $('view-list').style.display = 'none';
    $('view-form').style.display = 'none';
    $('view-pdf').style.display = 'none';
    
    if (name === 'list') {
        $('view-list').style.display = 'block';
        renderList();
    } else if (name === 'form') {
        $('view-form').style.display = 'block';
        if (currentCharacterId) {
            loadCharacterForEdit(currentCharacterId);
        } else {
            clearForm();
        }
    } else if (name === 'pdf') {
        $('view-pdf').style.display = 'block';
        renderPDFView(currentCharacterId);
    }
}

function openForm(id) {
    currentCharacterId = id || null;
    showView('form');
}

function detectMusicType(url) {
    if (!url) return null;
    if (url.indexOf('spotify.com') > -1 || url.indexOf('open.spotify.com') > -1) return 'spotify';
    if (url.indexOf('youtube.com') > -1 || url.indexOf('youtu.be') > -1) return 'youtube';
    return null;
}

function extractSpotifyId(url) {
    var parts = url.split('/');
    var id = parts[parts.length - 1];
    if (id.indexOf('?') > -1) id = id.split('?')[0];
    return id;
}

function extractYoutubeId(url) {
    if (url.indexOf('youtu.be') > -1) {
        var id = url.split('youtu.be/')[1];
        if (id.indexOf('?') > -1) id = id.split('?')[0];
        return id;
    }
    var match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
}

function updateThemeSongPreview(url) {
    var preview = $('themeSong-preview');
    var embed = $('themeSong-embed');
    var qrImg = $('themeSong-qr-img');
    var type = detectMusicType(url);
    
    if (!type || !url) {
        preview.style.display = 'none';
        return;
    }
    
    preview.style.display = 'block';
    
    if (type === 'spotify') {
        var id = extractSpotifyId(url);
        if (id) {
            embed.innerHTML = '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/' + id + '?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
        }
    } else if (type === 'youtube') {
        var id = extractYoutubeId(url);
        if (id) {
            embed.innerHTML = '<iframe width="100%" height="200" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        }
    }
    
    // QR Code usando API gratuita
    qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(url);
}

function loadCharacterForEdit(id) {
    var storage = new CharacterStorage();
    var c = storage.getById(id);
    if (c) {
        $('form-title').textContent = 'Editar Personagem';
        $('role').value = c.role || 'Protagonista';
        $('fullName').value = c.fullName || '';
        $('nicknames').value = c.nicknames || '';
        $('age').value = c.age || '';
        $('birthDate').value = c.birthDate || '';
        $('appearance').value = c.appearance || '';
        $('psychology').value = c.psychology || '';
        $('mainGoal').value = c.mainGoal || '';
        $('wants').value = c.wants || '';
        $('needs').value = c.needs || '';
        $('themeSong').value = c.themeSong || '';
        $('moreInfo').value = c.moreInfo || '';
        $('characterForm').setAttribute('data-id', c.id);
        
        if (c.themeSong) {
            updateThemeSongPreview(c.themeSong);
        }
        
        if (c.image) {
            currentImageData = c.image;
            showImagePreview(c.image);
        } else {
            currentImageData = null;
            hideImagePreview();
        }
    } else {
        clearForm();
    }
}

function clearForm() {
    $('characterForm').reset();
    $('characterForm').setAttribute('data-id', '');
    $('role').value = 'Protagonista';
    currentCharacterId = null;
    currentImageData = null;
    $('form-title').textContent = 'Novo Personagem';
    hideImagePreview();
    $('themeSong-preview').style.display = 'none';
    $('themeSong-embed').innerHTML = '';
}

function showImagePreview(src) {
    $('imagePreview').src = src;
    $('image-preview-container').style.display = 'inline-block';
    $('image-upload-area').style.display = 'none';
}

function hideImagePreview() {
    $('image-preview-container').style.display = 'none';
    $('image-upload-area').style.display = 'block';
    $('imageInput').value = '';
}

function resizeImage(file, maxWidth, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var w = img.width;
            var h = img.height;
            
            if (w > maxWidth) {
                h = (maxWidth / w) * h;
                w = maxWidth;
            }
            
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            
            var dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(dataUrl);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function saveCharacter() {
    var form = $('characterForm');
    var id = form.getAttribute('data-id') || null;
    
    var data = {
        id: id || undefined,
        image: currentImageData || null,
        role: $('role').value,
        fullName: $('fullName').value.trim(),
        nicknames: $('nicknames').value.trim(),
        age: $('age').value.trim(),
        birthDate: $('birthDate').value,
        appearance: $('appearance').value.trim(),
        psychology: $('psychology').value.trim(),
        mainGoal: $('mainGoal').value.trim(),
        wants: $('wants').value.trim(),
        needs: $('needs').value.trim(),
        themeSong: $('themeSong').value.trim(),
        moreInfo: $('moreInfo').value.trim()
    };

    if (!data.fullName) {
        alert('O nome e obrigatoro!');
        return;
    }

    var storage = new CharacterStorage();
    storage.save(data);
    
    alert('Personagem ' + (id ? 'atualizado' : 'criado') + ' com sucesso!');
    currentCharacterId = null;
    currentImageData = null;
    renderList();
    showView('list');
}

function deleteCharacter(id) {
    if (confirm('Excluir este personagem?')) {
        var storage = new CharacterStorage();
        storage.delete(id);
        renderList();
    }
}

function openPdfView(id) {
    currentCharacterId = id;
    showView('pdf');
}

function downloadPDF(id) {
    var storage = new CharacterStorage();
    var c = storage.getById(id);
    if (c) {
        window.generatePDF(c);
    } else {
        alert('Personagem nao encontrado.');
    }
}

function esc(text) {
    if (!text) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
}

function renderPDFView(id) {
    var storage = new CharacterStorage();
    var c = storage.getById(id);
    if (!c) {
        alert('Personagem nao encontrado.');
        return;
    }
    
    var h = '';
    if (c.image) {
        h += '<img src="' + c.image + '" style="width:150px;height:150px;object-fit:cover;border-radius:0.5rem;border:2px solid #d1d5db;float:right;margin-left:1.5rem;margin-bottom:1rem">';
    }
    h += '<h1 style="font-size:1.875rem;font-weight:bold;margin-bottom:0.5rem">' + esc(c.fullName) + '</h1>';
    if (c.role) h += '<span class="tag ' + getRoleTagClass(c.role) + '" style="display:inline-block;margin-bottom:0.75rem">' + esc(c.role) + '</span>';
    if (c.nicknames) h += '<p style="color:#6b7280;margin-bottom:1rem;font-style:italic">"' + esc(c.nicknames) + '"</p>';
    h += '<div style="clear:both"></div>';
    h += '<p><strong>Idade:</strong> ' + esc(c.age || 'N/A') + '</p>';
    h += '<p><strong>Nascimento:</strong> ' + esc(c.birthDate || 'N/A') + '</p>';
    h += '<p style="margin-top:1rem"><strong>Aparencia:</strong><br>' + esc(c.appearance || 'N/A') + '</p>';
    h += '<p style="margin-top:1rem"><strong>Psicologia:</strong><br>' + esc(c.psychology || 'N/A') + '</p>';
    h += '<p style="margin-top:1rem"><strong>Objetivo:</strong><br>' + esc(c.mainGoal || 'N/A') + '</p>';
    h += '<p style="margin-top:1rem"><strong>Quer:</strong> ' + esc(c.wants || 'N/A') + '</p>';
    h += '<p><strong>Precisa:</strong> ' + esc(c.needs || 'N/A') + '</p>';
    
    if (c.themeSong) {
        var type = detectMusicType(c.themeSong);
        h += '<p style="margin-top:1rem"><strong>Musica Tema:</strong></p>';
        if (type === 'spotify') {
            var sid = extractSpotifyId(c.themeSong);
            if (sid) {
                h += '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/' + sid + '?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>';
            }
        } else if (type === 'youtube') {
            var yid = extractYoutubeId(c.themeSong);
            if (yid) {
                h += '<iframe width="100%" height="200" src="https://www.youtube.com/embed/' + yid + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            }
        }
        h += '<div style="text-align:center;margin-top:0.75rem"><p style="font-size:0.75rem;color:#6b7280;margin-bottom:0.25rem">QR Code:</p>';
        h += '<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(c.themeSong) + '" style="width:120px;height:120px;border-radius:0.5rem;border:1px solid #d1d5db" alt="QR Code"></div>';
        h += '<p style="font-size:0.75rem;color:#6b7280;margin-top:0.5rem;word-break:break-all">' + esc(c.themeSong) + '</p>';
    }
    
    if (c.moreInfo) h += '<p style="margin-top:1rem"><strong>Mais Informacoes:</strong><br>' + esc(c.moreInfo) + '</p>';
    
    $('pdf-body').innerHTML = h;
    $('btn-download-pdf').setAttribute('data-char-id', id);
}

function getRoleTagClass(role) {
    if (!role) return 'tag-outro';
    var r = role.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return 'tag-' + r;
}

function renderList() {
    var storage = new CharacterStorage();
    var chars = storage.getAll();
    var grid = $('characters-grid');
    
    if (chars.length === 0) {
        grid.innerHTML = '<div class="empty-state">' +
            '<p>Nenhum personagem criado ainda.</p>' +
            '<small>Clique em "+ Novo" para comecar!</small>' +
            '</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < chars.length; i++) {
        var c = chars[i];
        var roleClass = getRoleTagClass(c.role);
        var roleName = c.role || 'Personagem';
        
        html += '<div class="card char-card" data-name="' + esc(c.fullName.toLowerCase()) + '" data-role="' + esc(c.role || '') + '">';
        
        html += '<div style="position:relative">';
        if (c.image) {
            html += '<img src="' + c.image + '" class="card-image" alt="' + esc(c.fullName) + '">';
        } else {
            html += '<div class="card-image-placeholder"><span>?</span></div>';
        }
        html += '<span class="tag ' + roleClass + '">' + esc(roleName) + '</span>';
        html += '</div>';
        
        html += '<div class="card-body">';
        html += '<h3 class="card-name" style="margin-bottom:0.75rem">' + esc(c.fullName) + '</h3>';
        html += '<div class="card-actions">';
        html += '<button onclick="openPdfView(\'' + c.id + '\')" class="btn-view">Ver Ficha</button>';
        html += '<button onclick="openForm(\'' + c.id + '\')" class="btn-edit">Editar</button>';
        html += '<button onclick="deleteCharacter(\'' + c.id + '\')" class="btn-del">Excluir</button>';
        html += '</div></div></div>';
    }
    grid.innerHTML = html;
}

// Busca e Filtros
var currentFilter = 'all';
var currentSearchTerm = '';

function applyFilters() {
    var cards = document.querySelectorAll('.char-card');
    for (var i = 0; i < cards.length; i++) {
        var name = (cards[i].getAttribute('data-name') || '').toLowerCase();
        var role = (cards[i].getAttribute('data-role') || '');
        
        var matchesSearch = name.indexOf(currentSearchTerm) !== -1;
        var matchesFilter = currentFilter === 'all' || role === currentFilter;
        
        cards[i].style.display = (matchesSearch && matchesFilter) ? '' : 'none';
    }
}

var searchInput = $('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        currentSearchTerm = e.target.value.toLowerCase();
        applyFilters();
    });
}

var filterBtns = document.querySelectorAll('.filter-btn');
for (var i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener('click', function() {
        for (var j = 0; j < filterBtns.length; j++) {
            filterBtns[j].classList.remove('active');
        }
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        applyFilters();
    });
}

// Upload de imagem
var imageInput = $('imageInput');
if (imageInput) {
    imageInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no maximo 5MB.');
                return;
            }
            resizeImage(file, 400, function(dataUrl) {
                currentImageData = dataUrl;
                showImagePreview(dataUrl);
            });
        }
    });
}

// Preview da musica tema em tempo real
var themeSongInput = $('themeSong');
if (themeSongInput) {
    var themeSongTimeout = null;
    themeSongInput.addEventListener('input', function(e) {
        clearTimeout(themeSongTimeout);
        themeSongTimeout = setTimeout(function() {
            updateThemeSongPreview(e.target.value.trim());
        }, 500);
    });
}

// Remover imagem
var imageRemove = $('imageRemove');
if (imageRemove) {
    imageRemove.addEventListener('click', function() {
        currentImageData = null;
        hideImagePreview();
    });
}

// Form submit
var form = $('characterForm');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveCharacter();
    });
}

// Botao download PDF
var btnPdf = $('btn-download-pdf');
if (btnPdf) {
    btnPdf.addEventListener('click', function() {
        var id = this.getAttribute('data-char-id');
        if (id) downloadPDF(id);
    });
    
    function checkJsPDF() {
        var available = false;
        if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
            available = true;
        } else if (typeof jsPDF !== 'undefined') {
            available = true;
        }
        
        if (!available) {
            btnPdf.style.opacity = '0.5';
            btnPdf.style.cursor = 'not-allowed';
            btnPdf.title = 'jsPDF nao carregado. Verifique sua conexao com a internet.';
        } else {
            btnPdf.style.opacity = '1';
            btnPdf.style.cursor = 'pointer';
            btnPdf.title = 'Baixar PDF';
        }
    }
    
    checkJsPDF();
    setTimeout(checkJsPDF, 2000);
}

// Imagem de fundo
var bgInput = $('bgInput');
var bgLayer = $('bg-layer');

function setBgImage(dataUrl) {
    bgLayer.style.backgroundImage = 'url(' + dataUrl + ')';
    try {
        localStorage.setItem('follett_bg_image', dataUrl);
    } catch(e) {
        console.warn('Erro ao salvar imagem de fundo:', e);
    }
}

function loadBgImage() {
    var saved = null;
    try {
        saved = localStorage.getItem('follett_bg_image');
    } catch(e) {}
    
    if (saved) {
        bgLayer.style.backgroundImage = 'url(' + saved + ')';
    } else {
        // Imagem de texto aleatoria como padrao
        var patterns = ['paper','wall','texture','lines','dots'];
        var pattern = patterns[Math.floor(Math.random() * patterns.length)];
        bgLayer.style.backgroundImage = 'url(https://picsum.photos/seed/' + pattern + Date.now() + '/1920/1080)';
    }
}

if (bgInput) {
    bgInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('A imagem deve ter no maximo 10MB.');
                return;
            }
            var reader = new FileReader();
            reader.onload = function(ev) {
                setBgImage(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}

loadBgImage();
renderList();
