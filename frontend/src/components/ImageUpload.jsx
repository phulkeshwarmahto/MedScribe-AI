import { useState } from "react";

export default function ImageUpload({ onImageSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file) => {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPEG and PNG images are allowed");
      return;
    }

    setSelectedFile(file);
    onImageSelect(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            border: '2px dashed #0A2463',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="image-input"
          />
          <label htmlFor="image-input" style={{ cursor: 'pointer', display: 'block' }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📸</p>
            <p style={{ fontSize: '1.125rem', fontWeight: '500', color: '#0A2463', marginBottom: '0.5rem' }}>
              Drag and drop your prescription image
            </p>
            <p style={{ color: '#4b5563' }}>or click to select from your device</p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Supported: JPEG, PNG (max 5MB)
            </p>
          </label>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={preview}
              alt="Prescription preview"
              style={{ width: '128px', height: '128px', objectFit: 'cover', borderRadius: '0.5rem' }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '500', color: '#1f2937' }}>{selectedFile.name}</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
              <button
                onClick={clearSelection}
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
