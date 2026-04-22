import { generatePDF } from "../utils/pdfExport";

export default function PDFExportButton({ soapNote, language = "english" }) {
  const isHindi = language === "hindi";

  const handleExport = () => {
    if (isHindi) {
      return;
    }

    generatePDF(soapNote, language);
  };

  return (
    <button
      onClick={handleExport}
      disabled={isHindi}
      title={isHindi ? "PDF export currently supports English SOAP notes only." : "Export as PDF"}
      style={{
        marginTop: '1.5rem',
        padding: '0.5rem 1.5rem',
        backgroundColor: '#3E9B6E',
        color: 'white',
        borderRadius: '0.5rem',
        fontWeight: '500',
        border: 'none',
        cursor: isHindi ? 'not-allowed' : 'pointer',
        opacity: isHindi ? 0.6 : 1,
      }}
    >
      {isHindi ? "PDF export for Hindi coming soon" : "Export as PDF"}
    </button>
  );
}
