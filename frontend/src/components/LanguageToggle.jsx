export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
      <button
        type="button"
        onClick={() => setLanguage("english")}
        aria-pressed={language === "english"}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          fontWeight: '500',
          backgroundColor: language === "english" ? '#0A2463' : 'transparent',
          color: language === "english" ? 'white' : '#0A2463',
          border: language === "english" ? 'none' : '2px solid #0A2463',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("hindi")}
        aria-pressed={language === "hindi"}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          fontWeight: '500',
          backgroundColor: language === "hindi" ? '#0A2463' : 'transparent',
          color: language === "hindi" ? 'white' : '#0A2463',
          border: language === "hindi" ? 'none' : '2px solid #0A2463',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
      >
        Hindi
      </button>
    </div>
  );
}
