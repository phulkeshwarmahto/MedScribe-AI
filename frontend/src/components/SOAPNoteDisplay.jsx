const parseSoapNote = (text) => {
  const sections = {
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  };

  // Try to extract sections based on common patterns
  const subjPattern =
    /SUBJECTIVE:?\s*\n?(.*?)(?=OBJECTIVE:|$)/is;
  const objPattern =
    /OBJECTIVE:?\s*\n?(.*?)(?=ASSESSMENT:|$)/is;
  const assPattern =
    /ASSESSMENT:?\s*\n?(.*?)(?=PLAN:|$)/is;
  const planPattern = /PLAN:?\s*\n?(.*?)$/is;

  const subjMatch = text.match(subjPattern);
  const objMatch = text.match(objPattern);
  const assMatch = text.match(assPattern);
  const planMatch = text.match(planPattern);

  if (subjMatch) sections.subjective = subjMatch[1].trim();
  if (objMatch) sections.objective = objMatch[1].trim();
  if (assMatch) sections.assessment = assMatch[1].trim();
  if (planMatch) sections.plan = planMatch[1].trim();

  return sections;
};

const SoapSection = ({ title, content, borderColor, icon }) => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      borderLeft: `4px solid ${borderColor}`,
      marginBottom: '1rem',
    }}
  >
    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span>{icon}</span> {title}
    </h3>
    <p style={{ color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.625' }}>
      {content}
    </p>
  </div>
);

export default function SOAPNoteDisplay({ soap }) {
  const sections = parseSoapNote(soap);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '1.5rem' }}>
        SOAP Note Result
      </h2>

      <SoapSection
        title="Subjective"
        content={sections.subjective || "No subjective data extracted"}
        borderColor="#3b82f6"
        icon="👤"
      />

      <SoapSection
        title="Objective"
        content={sections.objective || "No objective data extracted"}
        borderColor="#22c55e"
        icon="📊"
      />

      <SoapSection
        title="Assessment"
        content={sections.assessment || "No assessment data extracted"}
        borderColor="#f97316"
        icon="🔍"
      />

      <SoapSection
        title="Plan"
        content={sections.plan || "No plan data extracted"}
        borderColor="#a855f7"
        icon="📋"
      />
    </div>
  );
}
