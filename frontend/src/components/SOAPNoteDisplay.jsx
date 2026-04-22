const parseSoapNote = (text) => {
  const sections = {
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  };

  const subjPattern = /SUBJECTIVE:?\s*\n?(.*?)(?=OBJECTIVE:|$)/is;
  const objPattern = /OBJECTIVE:?\s*\n?(.*?)(?=ASSESSMENT:|$)/is;
  const assPattern = /ASSESSMENT:?\s*\n?(.*?)(?=PLAN:|$)/is;
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

const contentByLanguage = {
  english: {
    resultTitle: "SOAP Note Result",
    resultLabel: "Generated in English",
    titles: {
      subjective: "Subjective",
      objective: "Objective",
      assessment: "Assessment",
      plan: "Plan",
    },
    empty: {
      subjective: "No subjective data extracted",
      objective: "No objective data extracted",
      assessment: "No assessment data extracted",
      plan: "No plan data extracted",
    },
  },
  hindi: {
    resultTitle: "\u0938\u094b\u092a \u0928\u094b\u091f",
    resultLabel:
      "\u0939\u093f\u0902\u0926\u0940 \u092e\u0947\u0902 \u091c\u0928\u0930\u0947\u091f \u0915\u093f\u092f\u093e \u0917\u092f\u093e",
    titles: {
      subjective: "\u0938\u092c\u094d\u091c\u0947\u0915\u094d\u091f\u093f\u0935",
      objective: "\u0911\u092c\u094d\u091c\u0947\u0915\u094d\u091f\u093f\u0935",
      assessment: "\u0905\u0938\u0947\u0938\u092e\u0947\u0902\u091f",
      plan: "\u092a\u094d\u0932\u093e\u0928",
    },
    empty: {
      subjective:
        "\u0915\u094b\u0908 \u0938\u092c\u094d\u091c\u0947\u0915\u094d\u091f\u093f\u0935 \u0921\u0947\u091f\u093e \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u093e",
      objective:
        "\u0915\u094b\u0908 \u0911\u092c\u094d\u091c\u0947\u0915\u094d\u091f\u093f\u0935 \u0921\u0947\u091f\u093e \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u093e",
      assessment:
        "\u0915\u094b\u0908 \u0905\u0938\u0947\u0938\u092e\u0947\u0902\u091f \u0921\u0947\u091f\u093e \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u093e",
      plan:
        "\u0915\u094b\u0908 \u092a\u094d\u0932\u093e\u0928 \u0921\u0947\u091f\u093e \u0928\u0939\u0940\u0902 \u092e\u093f\u0932\u093e",
    },
  },
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

export default function SOAPNoteDisplay({ soap, language = "english" }) {
  const sections = parseSoapNote(soap);
  const copy = contentByLanguage[language] || contentByLanguage.english;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: '#dbeafe',
          color: '#0A2463',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '0.75rem',
        }}
      >
        {copy.resultLabel}
      </div>

      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '1.5rem' }}>
        {copy.resultTitle}
      </h2>

      <SoapSection
        title={copy.titles.subjective}
        content={sections.subjective || copy.empty.subjective}
        borderColor="#3b82f6"
        icon="S"
      />

      <SoapSection
        title={copy.titles.objective}
        content={sections.objective || copy.empty.objective}
        borderColor="#22c55e"
        icon="O"
      />

      <SoapSection
        title={copy.titles.assessment}
        content={sections.assessment || copy.empty.assessment}
        borderColor="#f97316"
        icon="A"
      />

      <SoapSection
        title={copy.titles.plan}
        content={sections.plan || copy.empty.plan}
        borderColor="#a855f7"
        icon="P"
      />
    </div>
  );
}
