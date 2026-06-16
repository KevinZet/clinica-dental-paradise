import React, { useState, useMemo } from 'react';
import { Appointment, Patient, Sede, Servicio } from '../types';
import { SEDES, SERVICIOS } from '../data';
import { 
  Users, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Cpu, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Plus, 
  Send, 
  UserPlus, 
  FileText, 
  Database,
  Bell,
  Heart,
  CalendarDays,
  Menu,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';

interface CRMSelectorProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

type TabType = 'metrics' | 'calendar' | 'patients' | 'automation';

export default function CRMSelector({ appointments, setAppointments, patients, setPatients }: CRMSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('metrics');
  
  // Calendar component filters
  const [filterSede, setFilterSede] = useState<string>('all');
  const [filterSpecialist, setFilterSpecialist] = useState<string>('all');
  const [filterTreatment, setFilterTreatment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form states for creating manual appointment inside CRM
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppt, setNewAppt] = useState({
    patientName: '',
    phone: '',
    email: '',
    sedeId: 'puente-nuevo',
    serviceId: 'ortodoncia',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    specialist: 'Dr. Hugo Sánchez (Ortodoncista)',
    notes: ''
  });

  // Patient CRM search/view states
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [newClinicalNote, setNewClinicalNote] = useState('');
  const [addPatientMode, setAddPatientMode] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    sedePreferida: 'puente-nuevo',
    antecedentes: ''
  });

  // Automation Sandbox simulations
  const [autoSimLogs, setAutoSimLogs] = useState<Array<{time: string, type: string, message: string, recipient: string}>>([
    { time: '08:15', type: 'Recordatorio 24h', message: 'Hola Carlos Gonzales! Recuerda tu cita de *Ortodoncia* mañana a las 09:30 en la Sede Puente Nuevo.', recipient: '984712411' },
    { time: '10:00', type: 'Cumpleaños', message: '¡Feliz Cumpleaño Andrea! Clínica Dental Paradise te desea un día lleno de risas. Reclama tu limpieza gratuita.', recipient: '967111002' },
    { time: '12:30', type: 'Follow-up', message: 'Hola Samuel, ¿cómo te sientes después de tu profilaxis? Cualquier Consulta escríbenos.', recipient: '933481232' }
  ]);
  const [simulatingType, setSimulatingType] = useState<string | null>(null);

  // Specialists List
  const SPECIALISTS = [
    'Dr. Hugo Sánchez (Ortodoncista)',
    'Dra. Pilar Wong (Cirujano Implantóloga)',
    'Dr. Daniel Castro (Odontólogo General)',
    'Dra. Sofía Martínez (Odontopediatra)',
    'Dr. Carlos Mendoza (Rehabilitador Oral)',
    'Dr. Hans Werner (Estética Dental)'
  ];

  // Colors for Recharts
  const COLORS = ['#0077B6', '#00B4D8', '#4EA8DE', '#90E0EF', '#56CFE1', '#72EFDD'];

  // Handle status update of appointment
  const handleStatusChange = (apptId: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        // If status changes to completed, automatically add visit info to patient clinic histories if exists
        if (newStatus === 'completed') {
          const service = SERVICIOS.find(s => s.id === a.serviceId);
          const historyEntry = `${new Date().toLocaleDateString('es-PE')} - Completó tratamiento de ${service?.title || 'Odontología'}. Sede: ${SEDES.find(s => s.id === a.sedeId)?.name}.`;
          
          setPatients(pats => pats.map(p => {
            if (p.name.toLowerCase() === a.patientName.toLowerCase() || p.phone === a.phone) {
              return {
                ...p,
                lastVisit: new Date().toISOString().split('T')[0],
                historiaClinica: [historyEntry, ...p.historiaClinica]
              };
            }
            return p;
          }));
        }
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  // Submit manual appointment within CRM
  const handleAddApptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.patientName || !newAppt.phone) {
      alert('Por favor ingresa Nombre y Teléfono');
      return;
    }

    const apptId = `cit-${Date.now()}`;
    const formattedAppt: Appointment = {
      id: apptId,
      patientName: newAppt.patientName,
      phone: newAppt.phone,
      email: newAppt.email || undefined,
      sedeId: newAppt.sedeId,
      serviceId: newAppt.serviceId,
      date: newAppt.date,
      time: newAppt.time,
      specialist: newAppt.specialist,
      status: 'confirmed',
      notes: newAppt.notes || undefined,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [formattedAppt, ...prev]);

    // Check if the patient exists in the patients database. If not, add them!
    const patientExists = patients.some(p => p.phone === newAppt.phone || p.name.toLowerCase() === newAppt.patientName.toLowerCase());
    if (!patientExists) {
      const newPat: Patient = {
        id: `pat-${Date.now()}`,
        name: newAppt.patientName,
        phone: newAppt.phone,
        email: newAppt.email || undefined,
        birthDate: '1995-01-01', // placeholder
        sedePreferida: newAppt.sedeId,
        historiaClinica: [`${new Date().toLocaleDateString('es-PE')} - Paciente ingresado desde Agenda CRM para cita de ${SERVICIOS.find(s => s.id === newAppt.serviceId)?.title || 'Tratamiento'}.`],
        status: 'active',
        lastVisit: newAppt.date
      };
      setPatients(prev => [...prev, newPat]);
    }

    // Reset Form
    setNewAppt({
      patientName: '',
      phone: '',
      email: '',
      sedeId: 'puente-nuevo',
      serviceId: 'ortodoncia',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      specialist: 'Dr. Hugo Sánchez (Ortodoncista)',
      notes: ''
    });
    setShowAddForm(false);
  };

  // Create Patient manually in CRM
  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.phone) {
      alert('Ingresa nombre y teléfono obligatorios.');
      return;
    }
    const patId = `pat-${Date.now()}`;
    const pRecord: Patient = {
      id: patId,
      name: newPatient.name,
      phone: newPatient.phone,
      email: newPatient.email || undefined,
      birthDate: newPatient.birthDate || '1990-01-01',
      sedePreferida: newPatient.sedePreferida,
      antecedentes: newPatient.antecedentes || undefined,
      historiaClinica: [`${new Date().toLocaleDateString('es-PE')} - Ficha clínica creada en el sistema administrado.`],
      status: 'active'
    };

    setPatients(prev => [pRecord, ...prev]);
    setNewPatient({
      name: '',
      phone: '',
      email: '',
      birthDate: '',
      sedePreferida: 'puente-nuevo',
      antecedentes: ''
    });
    setAddPatientMode(false);
    setSelectedPatientId(patId);
  };

  // Add clinical history note
  const handleAddClinicalNote = (patientId: string) => {
    if (!newClinicalNote.trim()) return;
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          historiaClinica: [
            `${new Date().toLocaleDateString('es-PE')} - ${newClinicalNote}`,
            ...p.historiaClinica
          ],
          lastVisit: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));
    setNewClinicalNote('');
  };

  // Trigger simulated automation campaign
  const handleTriggerAutomation = (campaignName: string) => {
    setSimulatingType(campaignName);
    
    setTimeout(() => {
      let recipientName = 'Paciente';
      let phoneNum = '989005627';
      let messageContent = '';

      if (campaignName === 'reminders') {
        // Pick top pending or confirmed appt
        const appt = appointments.find(a => a.status === 'confirmed' || a.status === 'pending');
        if (appt) {
          recipientName = appt.patientName;
          phoneNum = appt.phone;
          messageContent = `Hola *${appt.patientName}*! Te saludamos de Clínica Dental Paradise. Te recordamos tu cita mañana a las *${appt.time}* en nuestra Sede *${SEDES.find(s=>s.id===appt.sedeId)?.name || 'Central'}* para tu tratamiento de *${SERVICIOS.find(s=>s.id===appt.serviceId)?.title || 'Especialidad'}*. ¿Por favor nos confirmas?`;
        } else {
          messageContent = 'No hay citas activas para enviar recordatorio automático mañana.';
        }
      } else if (campaignName === 'followup') {
        const pat = patients[0];
        recipientName = pat.name;
        phoneNum = pat.phone;
        messageContent = `¡Hola *${pat.name}*! Esperamos que tu tratamiento reciente con nosotros haya sido confortable. Déjanos un comentario o dinos si presentas odontalgias. ¡Sonríe!`;
      } else if (campaignName === 'birthday') {
        const pat = patients[1] || patients[0];
        recipientName = pat.name;
        phoneNum = pat.phone;
        messageContent = `¡Feliz de Compartir tu Día, *${pat.name}*! 🎂 Clínica Dental Paradise te obsequia un cupón sorpresa del 15% en tu próxima curación o profilasix gratuita. Válido por todo el mes. ¡Felicidades!`;
      } else {
        messageContent = 'Campaña general activa: Descuento Navideño / Día de la Madre lanzado a todos los pacientes de Puente Nuevo.';
      }

      setLocalLogs(prev => [
        {
          time: new Date().toLocaleTimeString('es-PE', {hour: '2-digit', minute: '2-digit'}),
          type: campaignName === 'reminders' ? 'Recordatorio 24h' : campaignName === 'followup' ? 'Follow-Up' : 'Campaña',
          message: messageContent,
          recipient: phoneNum
        },
        ...prev
      ]);
      setSimulatingType(null);
    }, 1200);
  };

  // Helper hook array state copy to avoid modifying the constant
  const [localLogs, setLocalLogs] = useState(autoSimLogs);

  // --- COMPUTE STATISTICS & ANALYTICS ---
  
  // 1. Core counters
  const totalBooked = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const totalPatientsCount = patients.length;

  // Calculate approximate billing (S/)
  // Estimate: Implantes: 1200, Ortodoncia: 180, Odontopediatría: 40, Diseño: 350, general: 30, emergencies: 50, estetica: 199.
  const totalRevenue = useMemo(() => {
    let rev = 5820; // Pre-existing baseline
    appointments.forEach(a => {
      if (a.status === 'completed' || a.status === 'confirmed') {
        const service = SERVICIOS.find(s => s.id === a.serviceId);
        rev += (service?.priceFrom || 50);
      }
    });
    return rev;
  }, [appointments]);

  // 2. Data for: Citas por Sede
  const appointmentsBySedeData = useMemo(() => {
    return SEDES.map(s => {
      const count = appointments.filter(a => a.sedeId === s.id).length;
      return {
        name: s.name,
        citas: count
      };
    });
  }, [appointments]);

  // 3. Data for: Tratamientos más Populares
  const appointmentsByServiceData = useMemo(() => {
    return SERVICIOS.map(s => {
      const count = appointments.filter(a => a.serviceId === s.id).length;
      return {
        name: s.title.split(' ')[0], // abbreviation
        value: count
      };
    }).filter(d => d.value > 0);
  }, [appointments]);

  // 4. Monthly metrics mock simulation
  const monthlyTimelineData = [
    { name: 'Ene', ingresos: 4200, pacientes: 20 },
    { name: 'Feb', ingresos: 5800, pacientes: 32 },
    { name: 'Mar', ingresos: 7100, pacientes: 45 },
    { name: 'Abr', ingresos: 9200, pacientes: 58 },
    { name: 'May', ingresos: 12400, pacientes: 82 },
    { name: 'Jun', ingresos: totalRevenue, pacientes: totalPatientsCount * 12 }
  ];

  // Filtering appointments for Calendar Tab
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchSede = filterSede === 'all' || a.sedeId === filterSede;
      const matchSpecialist = filterSpecialist === 'all' || a.specialist === filterSpecialist;
      const matchTreatment = filterTreatment === 'all' || a.serviceId === filterTreatment;
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = !searchQuery || 
        a.patientName.toLowerCase().includes(searchLower) || 
        a.phone.includes(searchLower) ||
        (a.notes && a.notes.toLowerCase().includes(searchLower));

      return matchSede && matchSpecialist && matchTreatment && matchStatus && matchSearch;
    });
  }, [appointments, filterSede, filterSpecialist, filterTreatment, filterStatus, searchQuery]);

  // Filter patients
  const filteredPatients = useMemo(() => {
    const searchLower = patientSearch.toLowerCase();
    return patients.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.phone.includes(searchLower) ||
      (p.email && p.email.toLowerCase().includes(searchLower)) ||
      p.sedePreferida.includes(searchLower)
    );
  }, [patients, patientSearch]);

  const activePatientRecord = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  return (
    <div className="bg-slate-900 text-slate-150 min-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-800">
      
      {/* Admin CRM Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-950 p-6 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-indigo-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-cyan-500/20 uppercase tracking-widest font-mono">
              ● PANEL MÉDICO Y ADM
            </span>
            <span className="text-slate-400 text-xs">v2.1</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Gestión Clínicas Dental Paradise
          </h2>
          <p className="text-slate-300 text-sm">
            Toma de decisiones, control de agendas de las 6 sedes en Lima y CRM interactivo.
          </p>
        </div>

        <div className="bg-indigo-950/80 px-4 py-2.5 rounded-2xl border border-indigo-800/60 flex items-center gap-3 shrink-0">
          <Database className="text-cyan-400 w-5 h-5" />
          <div className="text-right">
            <p className="text-xs text-slate-400">Estado de Base de Datos</p>
            <p className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1">
              ● Sincronizado local
            </p>
          </div>
        </div>
      </div>

      {/* CRM Main Columns */}
      <div className="flex-grow flex flex-col lg:flex-row">
        
        {/* Left Side Sidebar / Navigation */}
        <div className="lg:w-64 bg-slate-950 p-4 border-r border-slate-800 flex flex-col justify-between shrink-0">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">
              Navegación CRM
            </p>
            
            <button
              onClick={() => setActiveTab('metrics')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'metrics' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Resumen y Métricas</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'calendar' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="flex-grow">Control de Citas</span>
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold">
                {appointments.filter(a => a.status === 'pending').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'patients' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Fichas Pacientes</span>
            </button>

            <button
              onClick={() => setActiveTab('automation')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'automation' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Automatizaciones</span>
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-900 text-xs text-slate-500 space-y-2">
            <div className="bg-slate-900/60 p-3 rounded-xl">
              <span className="font-semibold block text-slate-400 mb-0.5">Sedes Conectadas:</span>
              <p className="text-[11px] text-slate-500">6 activas en Lima Metropolitana</p>
            </div>
            <p className="text-center">Clínica Dental Paradise © 2026</p>
          </div>
        </div>

        {/* Right Side Content Pane */}
        <div className="flex-grow p-6 bg-slate-900/40 overflow-y-auto max-h-[80vh]">
          
          {/* ==================== TAB 1: METRICS & CHARTS ==================== */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              
              {/* Top Row Stat widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-mono uppercase block">Socio Fundador Facturas</span>
                    <span className="text-2xl font-bold text-white mt-1 block">S/ {totalRevenue.toLocaleString()}</span>
                    <span className="text-emerald-500 text-xs font-semibold mt-1 inline-block flex items-center gap-1">
                      ↗ +14% vs mes ant
                    </span>
                  </div>
                  <div className="bg-emerald-500/10 p-3.5 rounded-xl text-emerald-400">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-mono uppercase block">Total Pacientes</span>
                    <span className="text-2xl font-bold text-white mt-1 block">{totalPatientsCount} activos</span>
                    <span className="text-cyan-400 text-xs font-semibold mt-1 inline-block">
                      {patients.filter(p => p.status === 'active').length} estables en Lima
                    </span>
                  </div>
                  <div className="bg-cyan-500/10 p-3.5 rounded-xl text-cyan-400">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-mono uppercase block">Citas Programadas</span>
                    <span className="text-2xl font-bold text-white mt-1 block">{totalBooked} registradas</span>
                    <span className="text-indigo-400 text-xs font-semibold mt-1 inline-block flex items-center gap-1">
                      ● {confirmedAppointments} confirmadas
                    </span>
                  </div>
                  <div className="bg-indigo-500/10 p-3.5 rounded-xl text-indigo-400">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-mono uppercase block">Citas Pendientes</span>
                    <span className="text-2xl font-semibold text-amber-400 mt-1 block">
                      {pendingAppointments} por procesar
                    </span>
                    <span className="text-slate-400 text-xs mt-1 inline-block">
                      Requieren confirmación
                    </span>
                  </div>
                  <div className="bg-amber-500/10 p-3.5 rounded-xl text-amber-400">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Appointments by Sede */}
                <div className="bg-slate-950 p-5 sm:p-6 rounded-3xl border border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-base font-semibold text-white">Citas Solicitadas por Sede</h4>
                      <p className="text-xs text-slate-500">Distribución global en las 6 sedes principales de Lima</p>
                    </div>
                    <span className="bg-blue-600/10 text-blue-400 text-xs font-mono px-2 py-0.5 rounded border border-blue-500/15">
                      En Tiempo Real
                    </span>
                  </div>
                  
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={appointmentsBySedeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                        <Bar dataKey="citas" fill="#00B4D8" radius={[4, 4, 0, 0]}>
                          {appointmentsBySedeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Revenue Trend */}
                <div className="bg-slate-950 p-5 sm:p-6 rounded-3xl border border-slate-800">
                  <div>
                    <h4 className="text-base font-semibold text-white">Ingresos del Semestre (S/)</h4>
                    <p className="text-xs text-slate-500">Evolución de ventas odontológicas de Enero a Junio 2026</p>
                  </div>
                  
                  <div className="h-72 w-full mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTimelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                        <Line type="monotone" dataKey="ingresos" stroke="#0077B6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Bottom stats layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 col-span-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Tratamiento más Solicitado</h4>
                    <p className="text-xs text-slate-500 mb-4">Métricas cruzadas con fichas médicas clínicas</p>
                    
                    <div className="space-y-4">
                      {appointmentsByServiceData.slice(0, 4).map((entry, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-200">{entry.name}</span>
                            <span className="text-cyan-400">{entry.value} citas</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-cyan-500 h-full" style={{ width: `${(entry.value / totalBooked) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 col-span-2">
                  <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">Últimas Citas Agendadas Web</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-slate-800/80 text-left">
                      <thead>
                        <tr className="text-[11px] font-semibold text-slate-505 uppercase tracking-wider font-mono">
                          <th className="pb-3 text-slate-500">Paciente</th>
                          <th className="pb-3 text-slate-500">Sede</th>
                          <th className="pb-3 text-slate-500">Especialidad</th>
                          <th className="pb-3 text-slate-500">Hora</th>
                          <th className="pb-3 text-slate-500">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-xs">
                        {appointments.slice(0, 4).map((appt) => {
                          const sData = SEDES.find(s => s.id === appt.sedeId);
                          const tData = SERVICIOS.find(s => s.id === appt.serviceId);
                          return (
                            <tr key={appt.id} className="hover:bg-slate-900/30 transition-colors">
                              <td className="py-2.5 font-medium text-white">{appt.patientName}</td>
                              <td className="py-2.5 text-slate-400">{sData?.name || 'Sede'}</td>
                              <td className="py-2.5 text-slate-400">{tData?.title || 'Especialidad'}</td>
                              <td className="py-2.5 text-slate-400 font-mono">{appt.date} · {appt.time}</td>
                              <td className="py-2.5 font-bold text-emerald-400 font-mono">S/ {tData?.priceFrom || 30}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== TAB 2: CALENDAR & BOOKING LIST ==================== */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              
              {/* Header Filters */}
              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-blue-500" />
                      Control de Agenda Dental
                    </h3>
                    <p className="text-xs text-slate-400">
                      Filtrar citas médicas de las {SEDES.length} sedes. Agrega nuevas citas directamente.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl transition"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    <span>Crear Nueva Cita</span>
                  </button>
                </div>

                {/* Inline Manual Appointment Creator form */}
                {showAddForm && (
                  <form onSubmit={handleAddApptSubmit} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">★ NUEVA RESERVA DIRECTA (CRM)</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre del Paciente</label>
                        <input
                          type="text"
                          required
                          value={newAppt.patientName}
                          onChange={e => setNewAppt({...newAppt, patientName: e.target.value})}
                          placeholder="Ej. Roberto Benites"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Teléfono (WhatsApp)</label>
                        <input
                          type="tel"
                          required
                          value={newAppt.phone}
                          onChange={e => setNewAppt({...newAppt, phone: e.target.value})}
                          placeholder="Ej. 989005627"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Correo Electrónico (Opcional)</label>
                        <input
                          type="email"
                          value={newAppt.email}
                          onChange={e => setNewAppt({...newAppt, email: e.target.value})}
                          placeholder="correo@ejemplo.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Sede de Reserva</label>
                        <select
                          value={newAppt.sedeId}
                          onChange={e => setNewAppt({...newAppt, sedeId: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        >
                          {SEDES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Servicio / Tratamiento</label>
                        <select
                          value={newAppt.serviceId}
                          onChange={e => setNewAppt({...newAppt, serviceId: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        >
                          {SERVICIOS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Especialista Asignado</label>
                        <select
                          value={newAppt.specialist}
                          onChange={e => setNewAppt({...newAppt, specialist: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        >
                          {SPECIALISTS.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Fecha</label>
                        <input
                          type="date"
                          value={newAppt.date}
                          onChange={e => setNewAppt({...newAppt, date: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Hora</label>
                        <input
                          type="time"
                          value={newAppt.time}
                          onChange={e => setNewAppt({...newAppt, time: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Notas Médicas Iniciales</label>
                        <input
                          type="text"
                          value={newAppt.notes}
                          onChange={e => setNewAppt({...newAppt, notes: e.target.value})}
                          placeholder="Síntomas, motivos ejm: brackets sueltos"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-350 font-semibold px-4 py-2 rounded-xl transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-cyan-500 hover:bg-cyan-400 text-xs text-slate-950 font-bold px-5 py-2 rounded-xl transition"
                      >
                        Crear y Agendar
                      </button>
                    </div>
                  </form>
                )}

                {/* Filters Input Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1 font-mono">Sede</label>
                    <select
                      value={filterSede}
                      onChange={e => setFilterSede(e.target.value)}
                      className="w-full bg-slate-900 text-xs border border-slate-800 rounded-lg px-2 py-1.5"
                    >
                      <option value="all">Ver todas las sedes</option>
                      {SEDES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1 font-mono">Tratamiento</label>
                    <select
                      value={filterTreatment}
                      onChange={e => setFilterTreatment(e.target.value)}
                      className="w-full bg-slate-900 text-xs border border-slate-800 rounded-lg px-2 py-1.5"
                    >
                      <option value="all">Cualquier servicio</option>
                      {SERVICIOS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1 font-mono">Especialista</label>
                    <select
                      value={filterSpecialist}
                      onChange={e => setFilterSpecialist(e.target.value)}
                      className="w-full bg-slate-900 text-xs border border-slate-800 rounded-lg px-2 py-1.5"
                    >
                      <option value="all">Cualquier doctor</option>
                      {SPECIALISTS.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1 font-mono">Estado</label>
                    <select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="w-full bg-slate-900 text-xs border border-slate-800 rounded-lg px-2 py-1.5"
                    >
                      <option value="all">Ver todos los estados</option>
                      <option value="pending">Pendientes 🟡</option>
                      <option value="confirmed">Confirmadas 🟢</option>
                      <option value="completed">Completadas ✅</option>
                      <option value="cancelled">Canceladas ❌</option>
                    </select>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1 font-mono">Buscar Paciente</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Nombre o celular"
                        className="w-full bg-slate-900 text-xs border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-white"
                      />
                      <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid List representation of Appointments */}
              <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                  <span className="text-sm font-semibold text-slate-200">
                    Resultados de Agenda ({filteredAppointments.length} citas filtradas)
                  </span>
                  <span className="text-xs text-slate-400">Presiona un botón para confirmar por WhatsApp</span>
                </div>

                {filteredAppointments.length === 0 ? (
                  <div className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-semibold">No se encontraron citas con los filtros elegidos.</p>
                    <button 
                      onClick={() => { setFilterSede('all'); setFilterSpecialist('all'); setFilterTreatment('all'); setFilterStatus('all'); setSearchQuery(''); }}
                      className="mt-3 text-xs text-blue-400 underline hover:text-blue-300"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-slate-800">
                      <thead>
                        <tr className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono bg-slate-900/10">
                          <th className="p-4">Paciente / Teléfono</th>
                          <th className="p-4">Sede Requerida</th>
                          <th className="p-4">Tratamiento Asignado</th>
                          <th className="p-4">Fecha & Hora</th>
                          <th className="p-4">Médico Asignado</th>
                          <th className="p-4">Estado</th>
                          <th className="p-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 text-slate-300 text-xs">
                        {filteredAppointments.map(a => {
                          const sData = SEDES.find(s => s.id === a.sedeId);
                          const tData = SERVICIOS.find(s => s.id === a.serviceId);
                          
                          // WhatsApp direct templated recordator setup for web admin
                          const promptMsg = encodeURIComponent(
                            `¡Hola ${a.patientName}! Te recordamos tu cita odontológica para ${tData?.title || 'Especialidad'} el día ${a.date} a las ${a.time} en la sede ${sData?.name}. Confírmanos tu asistencia al 989005627. ¡Clínica Dental Paradise!`
                          );
                          const waActionLink = `https://wa.me/51${a.phone}?text=${promptMsg}`;

                          return (
                            <tr key={a.id} className="hover:bg-slate-900/30 transition-colors">
                              
                              {/* Patient Contact Info */}
                              <td className="p-4">
                                <div>
                                  <p className="font-semibold text-white text-sm">{a.patientName}</p>
                                  <p className="text-slate-400 font-mono text-xs">{a.phone}</p>
                                  {a.email && <p className="text-[10px] text-slate-500">{a.email}</p>}
                                </div>
                              </td>

                              {/* Sede */}
                              <td className="p-4">
                                <span className="bg-slate-900 px-2 py-1 rounded-md text-slate-300 border border-slate-800 block w-fit">
                                  {sData?.name || 'Cualquiera'}
                                </span>
                              </td>

                              {/* Treatment */}
                              <td className="p-4">
                                <div className="flex items-center gap-1.5">
                                  <span>{tData?.icon}</span>
                                  <span className="font-medium text-slate-200">{tData?.title || 'Odontología'}</span>
                                </div>
                              </td>

                              {/* Time */}
                              <td className="p-4">
                                <div className="font-mono">
                                  <p className="font-medium text-white">{a.date}</p>
                                  <p className="text-[11px] text-cyan-400">{a.time}</p>
                                </div>
                              </td>

                              {/* Doctor */}
                              <td className="p-4 text-slate-400">
                                {a.specialist}
                              </td>

                              {/* Status badge representation */}
                              <td className="p-4">
                                {a.status === 'pending' && (
                                  <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-1 rounded-full font-semibold border border-amber-500/10 uppercase">
                                    Pendiente
                                  </span>
                                )}
                                {a.status === 'confirmed' && (
                                  <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-1 rounded-full font-semibold border border-blue-500/10 uppercase">
                                    Confirmado
                                  </span>
                                )}
                                {a.status === 'completed' && (
                                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded-full font-semibold border border-emerald-500/10 uppercase">
                                    Completado
                                  </span>
                                )}
                                {a.status === 'cancelled' && (
                                  <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-1 rounded-full font-semibold border border-red-500/10 uppercase">
                                    Cancelado
                                  </span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="p-4 text-right">
                                <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                                  
                                  {/* Auto confirmed / completed switch */}
                                  {a.status === 'pending' && (
                                    <button
                                      onClick={() => handleStatusChange(a.id, 'confirmed')}
                                      className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold px-2 py-1 rounded-md transition"
                                      title="Confirmar cita"
                                    >
                                      Confirmar
                                    </button>
                                  )}

                                  {(a.status === 'confirmed' || a.status === 'pending') && (
                                    <button
                                      onClick={() => handleStatusChange(a.id, 'completed')}
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold px-2 py-1 rounded-md transition"
                                      title="Completar cita"
                                    >
                                      Atendido
                                    </button>
                                  )}

                                  {a.status !== 'cancelled' && a.status !== 'completed' && (
                                    <button
                                      onClick={() => handleStatusChange(a.id, 'cancelled')}
                                      className="bg-slate-900 border border-slate-800 hover:bg-red-950/40 text-red-400 text-[10px] px-2 py-1 rounded-md transition"
                                      title="Cancelar"
                                    >
                                      Cancelar
                                    </button>
                                  )}

                                  {/* Direct WhatsApp link to actual pre-filled message */}
                                  <a
                                    href={waActionLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md inline-flex items-center gap-1 transition"
                                    title="Enviar recordatorio manual"
                                  >
                                    <Send className="w-3 h-3 fill-white text-green-600" />
                                    <span>WhatsApp</span>
                                  </a>

                                </div>
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ==================== TAB 3: PATIENT CRM PROFILES ==================== */}
          {activeTab === 'patients' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Patient Selector List */}
              <div className="lg:col-span-1 bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Pacientes Registrados
                  </h4>
                  <button
                    onClick={() => { setAddPatientMode(!addPatientMode); setSelectedPatientId(null); }}
                    className="p-1 px-2.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 rounded-md text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={e => setPatientSearch(e.target.value)}
                    placeholder="Buscador rápido..."
                    className="w-full bg-slate-900 text-xs border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-white"
                  />
                  <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
                </div>

                <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredPatients.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setSelectedPatientId(p.id); setAddPatientMode(false); }}
                      className={`w-full text-left p-3.5 rounded-xl transition flex justify-between items-center ${
                        selectedPatientId === p.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-900/60 hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div>
                        <p className={`font-semibold text-xs ${selectedPatientId === p.id ? 'text-white' : 'text-slate-100'}`}>
                          {p.name}
                        </p>
                        <p className={`text-[11px] font-mono mt-0.5 ${selectedPatientId === p.id ? 'text-blue-100' : 'text-slate-450'}`}>
                          📱 {p.phone}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                  ))}
                  
                  {filteredPatients.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-6">No hay pacientes de alta con esos términos.</p>
                  )}
                </div>
              </div>

              {/* Right Column: Profile details or add-form */}
              <div className="lg:col-span-2 space-y-6">
                
                {addPatientMode ? (
                  <form onSubmit={handleAddPatientSubmit} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-cyan-400" />
                      Registrar Nueva Ficha de Paciente
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          value={newPatient.name}
                          onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                          placeholder="Felipe Alva"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Celular de Contacto</label>
                        <input
                          type="tel"
                          required
                          value={newPatient.phone}
                          onChange={e => setNewPatient({...newPatient, phone: e.target.value})}
                          placeholder="933111000"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Email</label>
                        <input
                          type="email"
                          value={newPatient.email}
                          onChange={e => setNewPatient({...newPatient, email: e.target.value})}
                          placeholder="felipe@gmail.com"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Fecha de Nacimiento</label>
                        <input
                          type="date"
                          value={newPatient.birthDate}
                          onChange={e => setNewPatient({...newPatient, birthDate: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Sede de Preferencia</label>
                        <select
                          value={newPatient.sedePreferida}
                          onChange={e => setNewPatient({...newPatient, sedePreferida: e.target.value})}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                        >
                          {SEDES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Antecedentes Médicos (Alergias, etc)</label>
                        <input
                          type="text"
                          value={newPatient.antecedentes}
                          onChange={e => setNewPatient({...newPatient, antecedentes: e.target.value})}
                          placeholder="Ejm: Alergia a aspirinas, diabetes"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setAddPatientMode(false)}
                        className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-100 px-4 py-2 rounded-xl"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-cyan-500 hover:bg-cyan-400 text-xs text-slate-950 font-bold px-5 py-2 rounded-xl"
                      >
                        Crear Ficha
                      </button>
                    </div>
                  </form>
                ) : activePatientRecord ? (
                  <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
                    
                    {/* Header profile info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 text-[10px] px-2 py-0.5 rounded uppercase font-mono font-bold">
                            📂 Ficha No {activePatientRecord.id}
                          </span>
                          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                            ACTIVO
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{activePatientRecord.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <span>Sede Preferida: <b>{SEDES.find(s=>s.id===activePatientRecord.sedePreferida)?.name || 'Cualquiera'}</b></span>
                          <span>·</span>
                          <span>Nacimiento: <b>{activePatientRecord.birthDate}</b></span>
                        </p>
                      </div>

                      <div className="text-right text-xs">
                        <p className="text-slate-500 font-mono">Última Visita Registrada</p>
                        <p className="text-cyan-400 font-semibold mt-0.5">{activePatientRecord.lastVisit || 'No reportada'}</p>
                      </div>
                    </div>

                    {/* Patient Core Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
                        <span className="text-slate-500 block font-mono">CELULAR WHATSAPP</span>
                        <p className="text-sm font-semibold text-white mt-1">📱 {activePatientRecord.phone}</p>
                      </div>
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
                        <span className="text-slate-500 block font-mono">CORREO DE ENVÍO</span>
                        <p className="text-sm font-medium text-slate-200 mt-1">✉ {activePatientRecord.email || 'No asignado'}</p>
                      </div>
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 sm:col-span-2">
                        <span className="text-slate-500 block font-mono">ANTECEDENTES GENERALES</span>
                        <p className="text-xs text-amber-400 font-medium mt-1">
                          ⚠️ {activePatientRecord.antecedentes || 'Sin alertas/antecedentes de cuidado reportados.'}
                        </p>
                      </div>
                    </div>

                    {/* Clinic logs / histories */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase tracking-wider font-mono text-slate-400 font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        Historial de Tratamientos y Consultas
                      </h4>

                      {/* Add clinic history box */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newClinicalNote}
                          onChange={e => setNewClinicalNote(e.target.value)}
                          placeholder="Añadir evolución médica o procedimiento realizado..."
                          className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          onKeyDown={e => e.key === 'Enter' && handleAddClinicalNote(activePatientRecord.id)}
                        />
                        <button
                          onClick={() => handleAddClinicalNote(activePatientRecord.id)}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 rounded-xl font-bold text-xs"
                        >
                          Anotar
                        </button>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {activePatientRecord.historiaClinica.map((h, idx) => (
                          <div key={idx} className="bg-slate-900/30 p-3 rounded-lg border border-slate-900 text-xs leading-relaxed text-slate-300">
                            {h}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-950 p-12 text-center rounded-3xl border border-slate-800">
                    <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-slate-300 font-bold mb-1">Ningún Paciente Seleccionado</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Selecciona un paciente del menú izquierdo o registra uno nuevo para visualizar la ficha de tratamientos de Dental Paradise.
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ==================== TAB 4: AUTOMATIONS CAMPAIGNS ==================== */}
          {activeTab === 'automation' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Automation Controller */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                    <Cpu className="w-5 h-5 text-indigo-400" />
                    Motores de Mensajería Automática
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Simula el envío masivo e inteligente de recordatorios clínicos y promociones desde la API de WhatsApp Business de Clínica Dental Paradise.
                  </p>

                  <div className="space-y-4">
                    
                    {/* Bot 1 */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="inline-block bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 text-[9px] px-2 py-0.5 rounded font-mono font-bold">
                          CAMPAÑA ACTIVA (24/7)
                        </span>
                        <h4 className="text-sm font-bold text-white">Recordatorio de Cita 24 Horas Antes</h4>
                        <p className="text-xs text-slate-400">
                          Lee automáticamente las citas de mañana de todas las sedes y genera un WhatsApp de confirmación formal.
                        </p>
                      </div>
                      <button
                        onClick={() => handleTriggerAutomation('reminders')}
                        disabled={simulatingType !== null}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition self-start sm:self-center shrink-0 cursor-pointer"
                      >
                        {simulatingType === 'reminders' ? 'Simulando...' : 'Lanzar Lote'}
                      </button>
                    </div>

                    {/* Bot 2 */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="inline-block bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 text-[9px] px-2 py-0.5 rounded font-mono font-bold">
                          POST-TRATAMIENTO
                        </span>
                        <h4 className="text-sm font-bold text-white">Encuesta y Follow-Up Post Cita (72 horas)</h4>
                        <p className="text-xs text-slate-400">
                          Pregunta de cortesía sobre el dolor o la adaptabilidad de prótesis/brackets y fideliza al paciente.
                        </p>
                      </div>
                      <button
                        onClick={() => handleTriggerAutomation('followup')}
                        disabled={simulatingType !== null}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition self-start sm:self-center shrink-0 cursor-pointer"
                      >
                        {simulatingType === 'followup' ? 'Simulando...' : 'Testeo Único'}
                      </button>
                    </div>

                    {/* Bot 3 */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="inline-block bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 text-[9px] px-2 py-0.5 rounded font-mono font-bold">
                          FIDELIZACIÓN
                        </span>
                        <h4 className="text-sm font-bold text-white">Felicidades de Cumpleaños Mensuales</h4>
                        <p className="text-xs text-slate-400">
                          Saluda a los pacientes que cumplen años hoy y regala cupones de profilaxis desde S/30 para toda la familia.
                        </p>
                      </div>
                      <button
                        onClick={() => handleTriggerAutomation('birthday')}
                        disabled={simulatingType !== null}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition self-start sm:self-center shrink-0 cursor-pointer"
                      >
                        {simulatingType === 'birthday' ? 'Simulando...' : 'Lanzar Saludos'}
                      </button>
                    </div>

                  </div>
                </div>

                {/* Info block */}
                <div className="bg-indigo-950/40 p-5 rounded-2xl border border-indigo-900/60 text-xs text-slate-300 space-y-2 flex gap-3.5 items-start">
                  <Sparkles className="w-8 h-8 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white">Integración Oficial de WhatsApp API</h5>
                    <p className="leading-relaxed">
                      Este simulador muestra las plantillas pre-aprobadas por Meta en nuestro canal. En producción, la pasarela envía a los celulares reales conectados a través de la API Gateway configurada.
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column: Simulated Live Logs */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Phone Simulator Preview */}
                <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 font-sans shadow-lg relative overflow-hidden">
                  
                  {/* Phone Notch/Header */}
                  <div className="flex justify-between items-center px-4 pb-3 border-b border-slate-900 text-[10px] text-slate-500 font-mono">
                    <span>Dental Paradise</span>
                    <div className="w-16 h-4 bg-slate-900 rounded-full mx-auto" />
                    <span>86% 🔋</span>
                  </div>

                  <div className="py-3 text-center border-b border-slate-900/40">
                    <p className="text-xs font-semibold text-slate-300">Logs de Envíos Masivos</p>
                    <p className="text-[10px] text-emerald-400 font-mono tracking-wider">CANAL: wa.me/51989005627</p>
                  </div>

                  {/* Log list (simulating chat bubbles or feed logs) */}
                  <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {localLogs.map((log, i) => (
                      <div key={i} className="bg-slate-900 p-3 rounded-2xl border border-slate-850 space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-cyan-400">{log.type}</span>
                          <span className="text-slate-500 font-mono">{log.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-205 leading-normal italic font-mono">
                          "{log.message}"
                        </p>
                        <div className="text-right text-[9px] text-slate-500 font-mono pt-1">
                          Enviado a: +51 {log.recipient}
                        </div>
                      </div>
                    ))}
                    
                    {simulatingType && (
                      <div className="bg-indigo-950/60 p-3 rounded-2xl border border-indigo-900/60 text-center text-xs text-indigo-300 animate-pulse font-mono">
                        ⏳ Preparando plantilla y compilando lote...
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
