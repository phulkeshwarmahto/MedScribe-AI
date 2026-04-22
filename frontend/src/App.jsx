import { useState } from 'react'
import Navbar from './components/Navbar'
import DoctorMode from './components/DoctorMode'
import PatientMode from './components/PatientMode'

export default function App() {
  const [activeTab, setActiveTab] = useState('doctor')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {activeTab === 'doctor' && <DoctorMode />}
        {activeTab === 'patient' && <PatientMode />}
      </main>
    </div>
  )
}
