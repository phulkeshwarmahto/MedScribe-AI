const parseMedicines = (text) => {
  // Split the text into medicine blocks
  // This is a heuristic approach - looks for numbered items or medicine names
  const medicines = [];
  const lines = text.split("\n");

  let currentMedicine = null;

  for (const line of lines) {
    if (line.trim() === "") continue;

    // Check if line starts with number or has medicine name pattern
    if (/^\d+\./.test(line) || /^[\s]*[A-Z][a-zA-Z\s\d]+$/.test(line)) {
      if (currentMedicine) {
        medicines.push(currentMedicine);
      }
      currentMedicine = {
        name: line.replace(/^\d+\.\s*/, "").trim(),
        usedFor: "",
        sideEffects: "",
        warnings: "",
      };
    } else if (currentMedicine) {
      if (
        line.toLowerCase().includes("used for") ||
        line.toLowerCase().includes("purpose")
      ) {
        currentMedicine.usedFor = line
          .replace(/used for:|purpose:|^[-•\s]*/i, "")
          .trim();
      } else if (
        line.toLowerCase().includes("side effect") ||
        line.toLowerCase().includes("adverse")
      ) {
        currentMedicine.sideEffects = line
          .replace(/side effect|adverse|^[-•\s]*/i, "")
          .trim();
      } else if (
        line.toLowerCase().includes("warning") ||
        line.toLowerCase().includes("precaution")
      ) {
        currentMedicine.warnings = line
          .replace(/warning|precaution|^[-•\s]*/i, "")
          .trim();
      }
    }
  }

  if (currentMedicine) {
    medicines.push(currentMedicine);
  }

  return medicines.length > 0
    ? medicines
    : [{ name: "Explanation", usedFor: text, sideEffects: "", warnings: "" }];
};

const MedicineCard = ({ medicine }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    marginBottom: '1rem',
    borderLeft: '4px solid #0A2463',
  }}>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '1rem' }}>
      💊 {medicine.name}
    </h3>

    {medicine.usedFor && (
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ fontWeight: '500', color: '#1f2937' }}>Used for:</p>
        <p style={{ color: '#374151', marginLeft: '1rem' }}>{medicine.usedFor}</p>
      </div>
    )}

    {medicine.sideEffects && (
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ fontWeight: '500', color: '#1f2937' }}>Side effects:</p>
        <p style={{ color: '#374151', marginLeft: '1rem' }}>{medicine.sideEffects}</p>
      </div>
    )}

    {medicine.warnings && (
      <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #dc2626', padding: '0.75rem', borderRadius: '0.25rem' }}>
        <p style={{ fontWeight: '500', color: '#991b1b' }}>⚠️ Warnings:</p>
        <p style={{ color: '#b91c1c', marginLeft: '1rem' }}>{medicine.warnings}</p>
      </div>
    )}
  </div>
);

export default function RxExplanation({ explanation }) {
  const medicines = parseMedicines(explanation);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '1.5rem' }}>
        Prescription Explanation
      </h2>
      {medicines.map((medicine, index) => (
        <MedicineCard key={index} medicine={medicine} />
      ))}
    </div>
  );
}
