import jsPDF from "jspdf";

export const generatePDF = (soapText, language = "english") => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("MedScribe AI - SOAP Note", 20, 20);
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(soapText, 170);
  doc.text(lines, 20, 35);
  doc.save(`soap-note-${language}-${Date.now()}.pdf`);
};
