// pdf.js

window.generatePDF = function(characterData) {
    console.log('generatePDF chamado para:', characterData.fullName);
    
    var JspdfClass = null;
    
    if (typeof window.jspdf !== 'undefined') {
        if (window.jspdf.jsPDF) {
            JspdfClass = window.jspdf.jsPDF;
        }
    }
    
    if (!JspdfClass && typeof jsPDF !== 'undefined') {
        JspdfClass = jsPDF;
    }
    
    if (!JspdfClass) {
        alert('Erro: biblioteca jsPDF nao carregada. Verifique sua conexao com a internet e recarregue a pagina.');
        return;
    }

    try {
        var doc = new JspdfClass({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
    } catch(e) {
        alert('Erro ao criar o PDF: ' + e.message);
        return;
    }

    var y = 15;
    var pageWidth = 210;
    var margin = 15;
    var contentWidth = pageWidth - margin * 2;

    function checkPageBreak(needed) {
        if (y + needed > 280) {
            doc.addPage();
            y = 15;
        }
    }

    function addLine() {
        checkPageBreak(6);
        doc.setDrawColor(180, 180, 180);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
    }

    function addSection(title) {
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(40, 60, 90);
        doc.text(title, margin, y);
        y += 6;
        addLine();
    }

    function addField(label, value) {
        if (!value || value.trim() === '') return;
        
        checkPageBreak(10);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(label, margin, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        
        var lines = doc.splitTextToSize(value, contentWidth - 5);
        for (var i = 0; i < lines.length; i++) {
            checkPageBreak(6);
            doc.text(lines[i], margin + 5, y);
            y += 5;
        }
        y += 2;
    }

    // Cabecalho
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(30, 30, 30);
    doc.text('Ficha de Personagem', margin, 18);
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(characterData.fullName || 'Sem nome', margin, 28);

    // Imagem do personagem
    if (characterData.image) {
        try {
            var imgData = characterData.image;
            if (imgData.indexOf('data:') === 0) {
                var format = 'JPEG';
                if (imgData.indexOf('png') > -1) format = 'PNG';
                doc.addImage(imgData, format, pageWidth - margin - 35, 8, 35, 35);
            }
        } catch(e) {
            console.warn('Erro ao adicionar imagem no PDF:', e);
        }
    }

    y = 52;

    addSection('Informacoes Basicas');
    addField('Tipo de Personagem:', characterData.role);
    addField('Nome Completo:', characterData.fullName);
    addField('Apelidos/Codinomes:', characterData.nicknames);
    addField('Idade:', characterData.age);
    addField('Data de Nascimento:', characterData.birthDate);

    addSection('Aparencia Fisica');
    addField('Descricao:', characterData.appearance);

    addSection('Psicologia e Personalidade');
    addField('Tracos:', characterData.psychology);

    addSection('Motivacoes e Impulsos');
    addField('Objetivo Principal:', characterData.mainGoal);

    addSection('Arco Narrativo');
    addField('O que ele QUER (Desejo):', characterData.wants);
    addField('O que ele PRECISA (Necessidade):', characterData.needs);

    addSection('Extras');
    addField('Musica Tema:', characterData.themeSong);
    addField('Mais Informacoes:', characterData.moreInfo);

    // QR Code no PDF
    if (characterData.themeSong) {
        try {
            checkPageBreak(45);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            doc.text('QR Code - Musica Tema:', margin, y);
            y += 6;
            
            var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(characterData.themeSong);
            
            doc.addImage(qrUrl, 'PNG', margin, y, 30, 30);
            y += 38;
        } catch(e) {
            console.warn('Nao foi possivel adicionar QR Code (requer internet):', e);
        }
    }

    var filename = (characterData.fullName || 'personagem').replace(/\s+/g, '_') + '.pdf';
    console.log('Salvando PDF:', filename);
    
    try {
        doc.save(filename);
        console.log('PDF salvo com sucesso');
    } catch(e) {
        console.error('Erro ao salvar PDF:', e);
        alert('Erro ao salvar o PDF: ' + e.message);
    }
};

console.log('pdf.js carregado OK');
