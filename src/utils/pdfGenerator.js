import { jsPDF } from 'jspdf'

export function generatePDF(characterData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = 15
  const pageWidth = 210
  const margin = 15
  const contentWidth = pageWidth - margin * 2

  function checkPageBreak(needed) { if (y + needed > 280) { doc.addPage(); y = 15 } }
  function addLine() { checkPageBreak(6); doc.setDrawColor(180,180,180); doc.line(margin,y,pageWidth-margin,y); y += 5 }
  function addSection(title) { checkPageBreak(12); doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(40,60,90); doc.text(title,margin,y); y += 6; addLine() }
  function addField(label, value) {
    if (!value || value.trim() === '') return
    checkPageBreak(10)
    doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(60,60,60); doc.text(label,margin,y); y += 5
    doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(30,30,30)
    const lines = doc.splitTextToSize(value, contentWidth - 5)
    for (let i = 0; i < lines.length; i++) { checkPageBreak(6); doc.text(lines[i], margin+5, y); y += 5 }
    y += 2
  }

  doc.setFillColor(240,240,240); doc.rect(0,0,pageWidth,45,'F')
  doc.setFont('helvetica','bold'); doc.setFontSize(20); doc.setTextColor(30,30,30); doc.text('Ficha de Personagem',margin,18)
  doc.setFontSize(14); doc.setTextColor(100,100,100); doc.text(characterData.fullName || 'Sem nome',margin,28)
  if (characterData.image) { try { const f = characterData.image.indexOf('png')>-1?'PNG':'JPEG'; doc.addImage(characterData.image,f,pageWidth-margin-35,8,35,35) } catch(e){} }
  y = 52

  addSection('Informacoes Basicas'); addField('Tipo:', characterData.role); addField('Nome:', characterData.fullName); addField('Apelidos:', characterData.nicknames); addField('Idade:', characterData.age); addField('Nascimento:', characterData.birthDate)
  addSection('Aparencia Fisica'); addField('Descricao:', characterData.appearance)
  addSection('Psicologia'); addField('Tracos:', characterData.psychology)
  addSection('Motivacoes'); addField('Objetivo:', characterData.mainGoal)
  addSection('Arco Narrativo'); addField('Quer:', characterData.wants); addField('Precisa:', characterData.needs)
  addSection('Extras'); addField('Musica:', characterData.themeSong); addField('Mais Info:', characterData.moreInfo)
  if (characterData.themeSong) { try { checkPageBreak(45); doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.text('QR Code:',margin,y); y+=6; doc.addImage('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+encodeURIComponent(characterData.themeSong),'PNG',margin,y,30,30); y+=38 } catch(e){} }

  doc.save((characterData.fullName||'personagem').replace(/\s+/g,'_')+'.pdf')
}
