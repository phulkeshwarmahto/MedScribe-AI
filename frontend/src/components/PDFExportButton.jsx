import { generatePDF } from "../utils/pdfExport";

export default function PDFExportButton({ soapNote }) {
  const handleExport = () => {
    generatePDF(soapNote);
  };

  return (
    <button
      onClick={handleExport}
      style={{
        marginTop: '1.5rem',
        padding: '0.5rem 1.5rem',
        backgroundColor: '#3E9B6E',
        color: 'white',
        borderRadius: '0.5rem',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      📄 Export as PDF
    </button>
  );
}
