import React, { useState, useEffect } from 'react';
import PatientPortal from './components/PatientPortal';
import CRMSelector from './components/CRMSelector';
import { Appointment, Patient } from './types';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS } from './data';
import { 
  Lock, 
  Eye, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  HelpCircle,
  TrendingUp,
  Settings
} from 'lucide-react';

export default function App() {
  // Shared state connecting Patient facing booking to Admin CRM scheduler
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const local = localStorage.getItem('paradise_appointments');
    return local ? JSON.parse(local) : MOCK_APPOINTMENTS;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const local = localStorage.getItem('paradise_patients');
    return local ? JSON.parse(local) : MOCK_PATIENTS;
  });

  // Mode: 'patient' (public website) or 'admin' (CRM backend)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  // Floating demonstration notification banner
  const [showDemoTip, setShowDemoTip] = useState(true);

  // Deep route preselected service selection
  const [preselectedServiceId, setPreselectedServiceId] = useState<string>('odontologia-general');

  // Persistence logic so changes aren't lost on refresh
  useEffect(() => {
    localStorage.setItem('paradise_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('paradise_patients', JSON.stringify(patients));
  }, [patients]);

  const handleNewAppointmentBooked = (newAppt: Appointment, newPat?: Patient) => {
    setAppointments(prev => [newAppt, ...prev]);
    if (newPat) {
      setPatients(prev => {
        const exists = prev.some(p => p.phone === newPat.phone);
        return exists ? prev : [newPat, ...prev];
      });
    }

    // Interactive notification
    if (showDemoTip) {
      const audioNotice = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav');
      // Play soft confirmation chirp if permitted
      audioNotice.play().catch(() => {});
    }
  };

  const handleToggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col justify-between bg-slate-50">
      
      {/* GLOBAL PERSISTENT SWITCHBOARD HEADER FOR DEMO PREVIEW */}
      <div className="bg-slate-900 border-b border-slate-800 text-white text-xs py-2 px-4 shadow-sm z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <p className="font-medium text-center sm:text-left text-slate-300">
              💡 <b>Demostración Interactiva Paradise:</b> ¡Programa una cita en la web y aparecerá al instante en la consola clínica!
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <span className="text-[10px] text-slate-400">
              Vista Actual: <b className="text-white uppercase">{isAdminMode ? 'Consola Médica CRM' : 'Página Principal'}</b>
            </span>

            {/* Premium toggle custom switch */}
            <button
              onClick={handleToggleAdminMode}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-[11px] uppercase transition-all shadow-md cursor-pointer ${
                isAdminMode 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500' 
                  : 'bg-slate-850 hover:bg-slate-800 text-cyan-305 border border-slate-700'
              }`}
            >
              {isAdminMode ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Ver Página Web</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Consola CRM Administrador</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* RENDER ACTIVE PORTAL */}
      <main className="flex-grow">
        {isAdminMode ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Quick Navigation to return */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => setIsAdminMode(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
              >
                ← Volver al Portal del Paciente (Sitio Web Público)
              </button>
              <div className="text-xs text-slate-400 font-mono">
                Registros activos: <b className="text-slate-600">{appointments.length} Citas</b> | <b className="text-slate-600">{patients.length} Fichas Clínicas</b>
              </div>
            </div>

            <CRMSelector 
              appointments={appointments}
              setAppointments={setAppointments}
              patients={patients}
              setPatients={setPatients}
            />
          </div>
        ) : (
          <PatientPortal 
            onAppointmentBooked={handleNewAppointmentBooked}
            onOpenCRM={() => setIsAdminMode(true)}
            preselectedServiceId={preselectedServiceId}
            setPreselectedServiceId={setPreselectedServiceId}
          />
        )}
      </main>

      {/* FLOAT DEMO INTEGRATION TIP BANNER */}
      {showDemoTip && !isAdminMode && (
        <div className="fixed bottom-22 left-6 z-40 max-w-xs bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-800/80 animate-fade-in text-xs space-y-2">
          <div className="flex justify-between items-start">
            <span className="font-bold text-cyan-400 uppercase tracking-widest font-mono text-[9px] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400 fill-cyan-400" />
              Sincronización Web + CRM
            </span>
            <button onClick={() => setShowDemoTip(false)} className="text-slate-400 hover:text-white p-0.5">✕</button>
          </div>
          <p className="text-slate-350 leading-relaxed text-[11px]">
            ¡Nuestra agenda está interconectada! Si rellenas el formulario de contacto o el test dental abajo, la cita se insertará directamente en el <b>Control de Citas CRM</b> de los doctores.
          </p>
          <button
            onClick={() => setIsAdminMode(true)}
            className="text-[10px] text-cyan-300 font-bold hover:underline block pt-1 cursor-pointer"
          >
            Abrir Modulo Administrativo CRM →
          </button>
        </div>
      )}

    </div>
  );
}
