export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{
        width: '3rem',
        height: '3rem',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #0A2463',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}></div>
      <p style={{ marginTop: '1rem', fontSize: '1.125rem', color: '#374151' }}>Gemma 4 is thinking...</p>
    </div>
  );
}
