import React, { useState, useRef } from 'react';
import { Sede, Servicio, Appointment, Patient } from '../types';
import { SEDES, SERVICIOS, TESTIMONIALS, TRANSFORMATIONS, PROMOS } from '../data';
import BeforeAfterSlider from './BeforeAfterSlider';
import LeadQuiz from './LeadQuiz';
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  Calendar, 
  ChevronRight, 
  HelpCircle,
  X,
  AlertCircle,
  Check,
  Megaphone,
  Ticket
} from 'lucide-react';

interface PatientPortalProps {
  onAppointmentBooked: (newAppt: Appointment, newPat?: Patient) => void;
  onOpenCRM: () => void;
  preselectedServiceId: string;
  setPreselectedServiceId: React.Dispatch<React.SetStateAction<string>>;
}

export default function PatientPortal({ onAppointmentBooked, onOpenCRM, preselectedServiceId, setPreselectedServiceId }: PatientPortalProps) {
  // Navigation active anchors
  const [activeTab, setActiveTab] = useState<'home' | 'servicios' | 'sedes' | 'AntesDespues' | 'quiz' | 'promociones'>('home');
  
  // Selected detail modal for service description
  const [selectedService, setSelectedService] = useState<Servicio | null>(null);

  // Fast booking form state
  const [bookingForm, setBookingForm] = useState({
    nombre: '',
    telefono: '',
    sedeId: 'puente-nuevo',
    servicioId: 'odontologia-general',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredApptLink, setRegisteredApptLink] = useState('');

  // Sede selector focus
  const [activeSedeId, setActiveSedeId] = useState('puente-nuevo');

  // Contact Form element reference for easy scrolling
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const sedesSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToBooking = (preselectedServ?: string) => {
    if (preselectedServ) {
      setBookingForm(prev => ({ ...prev, servicioId: preselectedServ }));
    }
    bookingFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToSedes = () => {
    sedesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Submit quick registration
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.nombre || !bookingForm.telefono) {
      alert('Por favor ingresa tu Nombre y Teléfono (WhatsApp)');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const apptId = `cit-${Date.now()}`;
      const chosenService = SERVICIOS.find(s => s.id === bookingForm.servicioId);
      const chosenSede = SEDES.find(s => s.id === bookingForm.sedeId);

      const newAppt: Appointment = {
        id: apptId,
        patientName: bookingForm.nombre,
        phone: bookingForm.telefono,
        sedeId: bookingForm.sedeId,
        serviceId: bookingForm.servicioId,
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // scheduled in 2 days as placeholder
        time: '10:30',
        specialist: 'Dr. Daniel Castro (Asignado automáticamente)',
        status: 'pending',
        notes: bookingForm.mensaje || undefined,
        createdAt: new Date().toISOString()
      };

      const newPat: Patient = {
        id: `pat-${Date.now()}`,
        name: bookingForm.nombre,
        phone: bookingForm.telefono,
        email: undefined,
        birthDate: '1995-01-01',
        sedePreferida: bookingForm.sedeId,
        historiaClinica: [`${new Date().toLocaleDateString('es-PE')} - Registrado a través de formulario web de contacto. Solicitó: ${chosenService?.title || 'Especialidad'}.`],
        status: 'active'
      };

      // Bubble up to update global React state (syncing CRM immediately!)
      onAppointmentBooked(newAppt, newPat);

      // Generate a custom WhatsApp trigger button link for immediate action
      const waText = encodeURIComponent(
        `¡Hola Clínica Dental Paradise! Resenvé una cita en la web:\n👤 Paciente: *${bookingForm.nombre}*\n📍 Sede: *${chosenSede?.name}*\n🦷 Tratamiento: *${chosenService?.title}*\n📱 Celular: ${bookingForm.telefono}\n💬 Mensaje: ${bookingForm.mensaje || 'Deseo confirmar fecha.'}`
      );
      setRegisteredApptLink(`https://wa.me/51989005627?text=${waText}`);
      
      setIsSubmitting(false);
      setShowSuccessModal(true);
      
      // Reset form
      setBookingForm({
        nombre: '',
        telefono: '',
        sedeId: 'puente-nuevo',
        servicioId: 'odontologia-general',
        mensaje: ''
      });
    }, 1000);
  };

  // Helper popup chatbot state
  const [showBot, setShowBot] = useState(false);
  const [botChat, setBotChat] = useState<Array<{sender: 'bot' | 'user', text: string}>>([
    { sender: 'bot', text: '¡Hola! Bienvenido a Clínica Dental Paradise. ¿Tienes alguna pregunta de nuestros tratamientos, precios o sedes?' }
  ]);

  const handleBotQuery = (query: string, reply: string) => {
    setBotChat(prev => [
      ...prev,
      { sender: 'user', text: query },
      { sender: 'bot', text: reply }
    ]);
  };

  const selectedSedeObj = SEDES.find(s => s.id === activeSedeId) || SEDES[0];

  return (
    <div className="bg-[#F8F9FA] text-slate-800 font-sans min-h-screen relative selection:bg-cyan-100 selection:text-blue-900">
      
      {/* HEADER & TOP BAR */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-40 border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo design */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] flex items-center justify-center text-white font-black text-xl shadow-md cursor-pointer">
              🦷
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
                Paradise <span className="text-[#00B4D8] text-xs font-semibold px-1.5 py-0.5 bg-blue-50 rounded">Clínica Dental</span>
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5">Sedes Puente Nuevo, Los Olivos & Rimac</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`transition-colors cursor-pointer ${activeTab === 'home' ? 'text-[#0077B6] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => { setActiveTab('servicios'); document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`transition-colors cursor-pointer ${activeTab === 'servicios' ? 'text-[#0077B6] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Servicios
            </button>
            <button 
              onClick={() => { setActiveTab('sedes'); document.getElementById('sedes')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`transition-colors cursor-pointer ${activeTab === 'sedes' ? 'text-[#0077B6] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Nuestras Sedes
            </button>
            <button 
              onClick={() => { setActiveTab('AntesDespues'); document.getElementById('casos')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`transition-colors cursor-pointer ${activeTab === 'AntesDespues' ? 'text-[#0077B6] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Casos Reales
            </button>
            <button 
              onClick={() => { setActiveTab('quiz'); document.getElementById('test-dental')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`transition-colors cursor-pointer ${activeTab === 'quiz' ? 'text-[#0077B6] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              ¿Qué Tratamiento Necesito?
            </button>
            <button 
              onClick={() => { setActiveTab('promociones'); document.getElementById('promociones')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`transition-colors cursor-pointer ${activeTab === 'promociones' ? 'text-[#0077B6] font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Promos
            </button>
          </nav>

          {/* Quick CTA Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScrollToBooking()}
              className="hidden lg:inline-flex bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4.5 py-2 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Agendar Cita Web
            </button>

            {/* Direct WhatsApp trigger */}
            <a
              href="https://wa.me/51989005627?text=Hola%20Cl%C3%ADnica%20Dental%20Paradise!%20Quiero%20solicitar%20informaci%C3%B3n%20para%20un%20tratamiento."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">S/30 Citas</span>
            </a>
          </div>

        </div>
      </header>

      {/* EMERGENCY BULLET BANNER */}
      <div className="bg-red-50 text-red-700 text-xs sm:text-sm border-b border-red-100 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-medium text-center sm:text-left flex items-center gap-1.5">
            <span className="animate-ping w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            🚨 <b>Emergencias Dentales las 24 Horas:</b> ¿Dolor agudo o diente roto? Te atendemos hoy mismo.
          </p>
          <a
            href="https://wa.me/51989005627?text=URGENTE%20Tengo%20una%20emergencia%20dental.%20Necesito%20atenci%C3%B3n%20inmediata."
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:text-red-900 flex items-center gap-1 text-[11px] sm:text-xs shrink-0"
          >
            Chatear con Especialista de Turno →
          </a>
        </div>
      </div>

      {/* 1. HERO SECTION (Te cambiamos la vida con una sonrisa perfecta) */}
      <section className="bg-gradient-to-br from-white via-white to-[#90E0EF]/20 pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#0077B6] bg-blue-100/60 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sede Principal a 1 cuadra de Puente Nuevo, El Agustino</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
              ¡Te Cambiamos la Vida con una <br className="hidden sm:inline"/>
              <span className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] bg-clip-text text-transparent">
                Sonrisa Perfecta!
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Contamos con todas las especialidades dentales en nuestras <b>6 cómodas sedes</b> de Lima. Diagnósticos integrales mediante cámaras intraorales y tratamientos sin dolor para toda tu familia.
            </p>

            {/* Quick Pricing info items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-xl mx-auto lg:mx-0 pt-2">
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
                <p className="text-xs text-slate-400 font-medium">Dental General</p>
                <p className="text-lg font-bold text-slate-900">Desde S/ 30</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
                <p className="text-xs text-slate-400 font-medium">Ortodoncia Brackets</p>
                <p className="text-[#0077B6] font-bold text-base sm:text-lg">S/ 180 al mes</p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs col-span-2 sm:col-span-1">
                <p className="text-xs text-slate-400 font-medium">Evaluación Inicial</p>
                <p className="text-emerald-600 font-bold text-lg">Totalmente Gratis</p>
              </div>
            </div>

            {/* High impact CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <a
                href="https://wa.me/51989005627?text=Quiero%20asistencia%20dental%20en%20Paradise!%20Me%20gustar%C3%ADa%20agendar%20una%20cita%20de%20S/30%20por%20favor."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg hover:shadow-xl text-sm sm:text-base cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                Agenda tu Cita por WhatsApp
              </a>

              <button
                onClick={handleScrollToSedes}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-2xl text-sm sm:text-base transition cursor-pointer"
              >
                Ver Sedes en Lima
              </button>
            </div>

            {/* Quality assurance tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-slate-400 text-xs pt-4">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Profesionales Calificados CoP</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#00B4D8]" /> Laboratorio Dental de Alta Tecnología</span>
            </div>
          </div>

          {/* Hero Right Graphic mockup (Smile illustration or family vector proxy) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600" 
                alt="Familia feliz sonriendo en Lima" 
                className="w-full h-[380px] sm:h-[450px] object-cover hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-indigo-100">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt="Karla" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />)}
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">"¡La mejor atención de Puente Nuevo!"</p>
                  <p className="text-[10px] text-slate-400">Karla Mendoza (Sede Puente Nuevo)</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SERVICIOS DESTACADOS */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0077B6] font-mono block">Especialidades Dentales</span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Nuestros Servicios de Excelencia
          </h3>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            Ofrecemos el abanico completo de especialidades con alta estética y presupuestos accesibles directos de laboratorio.
          </p>
        </div>

        {/* Services Cards Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICIOS.map((s) => (
            <div 
              key={s.id} 
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#00B4D8]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl p-2.5 bg-blue-50 rounded-xl inline-block mb-4">{s.icon}</span>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {s.shortDesc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase font-mono">Inversión desde:</span>
                  <span className="text-[#0077B6] font-bold text-sm sm:text-base">S/ {s.priceFrom}</span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setSelectedService(s)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition"
                  >
                    Detalles
                  </button>
                  <button
                    onClick={() => handleScrollToBooking(s.id)}
                    className="text-xs font-semibold bg-[#0077B6] hover:bg-[#005F92] text-white px-2.5 py-1.5 rounded-lg transition"
                  >
                    Agendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. NUESTRAS 6 SEDES (Interactive Chooser & Map Location Details) */}
      <section id="sedes" ref={sedesSectionRef} className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono block">6 Sedes Estratégicas</span>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">Nuestras Clínicas en Lima</h3>
              <p className="text-slate-400 text-sm max-w-md mt-1">
                Todas nuestras clínicas cuentan con amplias salas, cómodos accesos y horarios extendidos hasta las 10 PM.
              </p>
            </div>

            {/* Sede selector pills */}
            <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {SEDES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSedeId(s.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase transition-all cursor-pointer ${
                    activeSedeId === s.id 
                      ? 'bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.name.split(' ')[0]} {/* Abbreviation */}
                </button>
              ))}
            </div>
          </div>

          {/* Map/Location Card Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sede Detailed Info Panel */}
            <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📍</span>
                <div>
                  <h4 className="text-xl font-extrabold text-white">Sede {selectedSedeObj.name}</h4>
                  <p className="text-xs text-cyan-400 font-mono">Clínica Dental Paradise</p>
                </div>
              </div>

              {/* Picture inside card */}
              <div className="h-44 rounded-2xl overflow-hidden relative border border-slate-800">
                <img 
                  src={selectedSedeObj.image} 
                  alt={selectedSedeObj.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-blue-600/90 text-white text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider font-mono font-bold">
                  Sede Autorizada
                </span>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-mono">DIRECCIÓN DE ACCESO</span>
                    <p className="text-slate-205 text-sm mt-0.5">{selectedSedeObj.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-mono">HORARIO DE ATENCIÓN</span>
                    <p className="text-slate-205 text-sm mt-0.5">{selectedSedeObj.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-mono">TELÉFONO & WHATSAPP</span>
                    <p className="text-slate-205 text-sm mt-0.5">{selectedSedeObj.phone}</p>
                  </div>
                </div>
              </div>

              {/* CTAs per location */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
                <a 
                  href={selectedSedeObj.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-white font-bold px-4 py-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  📍 Cómo Llegar
                </a>

                <a 
                  href={selectedSedeObj.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-500 text-xs text-white font-bold px-4 py-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  💬 Reservar Sede
                </a>
              </div>
            </div>

            {/* Interactive map placeholder illustration */}
            <div className="lg:col-span-7 h-80 sm:h-96 bg-slate-950 rounded-3xl border border-slate-800/60 overflow-hidden relative flex items-center justify-center">
              
              {/* Nice graphical map representation */}
              <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-[#0c1322]" />

              <div className="text-center z-10 p-6 space-y-4">
                <div className="w-16 h-16 bg-blue-500/15 text-blue-400 rounded-full flex items-center justify-center mx-auto text-2xl border border-blue-500/20 animate-pulse">
                  🗺️
                </div>
                <div>
                  <h5 className="text-base font-bold text-white uppercase tracking-wider font-mono">Localización Google Maps Activa</h5>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Haga click en "Cómo Llegar" para abrir las coordenadas precisas de la sede <b>{selectedSedeObj.name}</b> de manera directa en su aplicación de mapas móviles.
                  </p>
                </div>
                
                <a 
                  href={selectedSedeObj.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#0077B6] hover:bg-[#0096C7] text-white text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  Abrir Mapa del El Agustino/Puente Nuevo →
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. GALERÍA ANTES Y DESPUÉS (Interactive Comparing Slider) */}
      <section id="casos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0077B6] font-mono block">Transformaciones Reales</span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Nuestra Galería de Sonrisas de Éxito
          </h3>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Deslice el marcador central de cada imagen para observar de forma interactiva el alineamiento y blanqueamiento corregido.
          </p>
        </div>

        {/* Transformation Grid of sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5">
          {TRANSFORMATIONS.map((tr) => (
            <BeforeAfterSlider 
              key={tr.id}
              beforeImg={tr.beforeImg}
              afterImg={tr.afterImg}
              title={tr.title}
              treatment={tr.treatment}
              description={tr.description}
            />
          ))}
        </div>
      </section>

      {/* 5. PROMOCIONES DE ACCESO RÁPIDO */}
      <section id="promociones" className="bg-gradient-to-br from-blue-50 via-white to-blue-200/20 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0077B6] font-mono block">Ofertas Exclusivas Web y Ads</span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Promociones y Facilidades de Pago</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">Válido reservando hoy mismo a través del portal clínico.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROMOS.map((p) => (
              <div 
                key={p.id}
                className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                {/* Visual badge top right */}
                <div className="absolute top-0 right-0 p-4 shrink-0 font-bold bg-cyan-100 text-cyan-800 text-xs rounded-bl-3xl">
                  {p.discount}
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-semibold text-[#0077B6] uppercase tracking-widest font-mono">Cupón de Descto.</p>
                  <h4 className="text-lg font-bold text-slate-900 leading-snug">{p.title}</h4>
                  <p className="text-slate-500 text-xs sm:text-sm">{p.description}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-150 space-y-3.5">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Validez: <b>{p.validUntil}</b></span>
                    <span>Código: <b className="font-mono text-slate-700 bg-slate-50 px-2 rounded">{p.code}</b></span>
                  </div>

                  <button
                    onClick={() => handleScrollToBooking(p.id === 'p1' ? 'odontologia-general' : p.id === 'p2' ? 'ortodoncia' : 'diseno-sonrisa')}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Aplicar Promoción en Cita</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE DENTAL TRIAGE QUIZ (¿Qué tratamiento necesitas?) */}
      <section id="test-dental" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0077B6] font-mono block">¿Dudas sobre qué elegir?</span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Resuelve el Test de Diagnóstico Digital
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            En un minuto, nuestro sistema de triage analiza tus aspiraciones estéticas y te brinda la especialidad óptima.
          </p>
        </div>

        <LeadQuiz 
          onSelectService={(servId) => handleScrollToBooking(servId)}
          onOpenBooking={(servId) => handleScrollToBooking(servId)}
        />
      </section>

      {/* 7. WHY CHOOSE US? SECTION */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono block">Garantía Paradise</span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">¿Por Qué Elegirnos? Su Sonrisa en Manos Seguras</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Dental Paradise se constituyó bajo un lema fundamental: democratizar la odontología estética en todo Lima Metropolitana. Eliminamos los altos márgenes injustificados y brindamos un servicio cálido.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2">
                <span className="text-2xl">🏬</span>
                <h4 className="font-bold text-white">6 Sedes Cercanas</h4>
                <p className="text-slate-400 text-xs">Ubicaciones de fácil acceso desde cualquier punto de Lima.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2">
                <span className="text-2xl">💳</span>
                <h4 className="font-bold text-white">Facilidades de Pago</h4>
                <p className="text-slate-400 text-xs">Brackets sin cuota inicial por colocación y cuotas fijas.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2">
                <span className="text-2xl">🏥</span>
                <h4 className="font-bold text-white">Todas las Especialidades</h4>
                <p className="text-slate-400 text-xs">Desde odontología general infantil hasta implantes óseos.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2">
                <span className="text-2xl">⏳</span>
                <h4 className="font-bold text-white">Horarios Extendidos</h4>
                <p className="text-slate-400 text-xs">Odontólogos de planta atendiendo hasta las 10 PM.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 relative">
            <h4 className="text-lg font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              Opiniones de Pacientes Felices
            </h4>

            <div className="space-y-4">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850 space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 border border-[#00B4D8]/20 shrink-0">
                        <img src={t.avatar} alt={t.name} referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{t.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-mono">{t.sede} · {t.treatment}</p>
                      </div>
                    </div>
                    
                    <span className="text-amber-400 font-mono text-xs flex items-center gap-0.5">
                      ★ {t.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 8. FORMULARIO DE CONTACTO RÁPIDO Y RESERVA */}
      <section id="contacto" ref={bookingFormRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex p-2.5 bg-blue-50 rounded-full text-[#0077B6] mb-1">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900">Reserva tu Cita de Valoración</h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
              Completa este breve formulario y un asesor médico te contactará vía WhatsApp para asignar tu especialista y horario.
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider font-mono">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.nombre}
                  onChange={e => setBookingForm({...bookingForm, nombre: e.target.value})}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0077B6] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider font-mono">Teléfono WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={bookingForm.telefono}
                  onChange={e => setBookingForm({...bookingForm, telefono: e.target.value})}
                  placeholder="Ej. 989005627 (9 dígitos)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0077B6] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider font-mono">Sede Temática de Preferencia</label>
                <select
                  value={bookingForm.sedeId}
                  onChange={e => setBookingForm({...bookingForm, sedeId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-[#0077B6] focus:bg-white transition appearance-none"
                >
                  {SEDES.map(s => <option key={s.id} value={s.id}>{s.name} ({s.address.split('(')[0]})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider font-mono">Especialidad de Interés</label>
                <select
                  value={bookingForm.servicioId}
                  onChange={e => setBookingForm({...bookingForm, servicioId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-[#0077B6] focus:bg-white transition appearance-none"
                >
                  {SERVICIOS.map(s => <option key={s.id} value={s.id}>{s.title} (Desde S/ {s.priceFrom})</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider font-mono">Cuéntanos qué te gustaría mejorar (Mensaje opcional)</label>
              <textarea
                value={bookingForm.mensaje}
                onChange={e => setBookingForm({...bookingForm, mensaje: e.target.value})}
                placeholder="Ejm: Deseo cotizar brackets estéticos o presentar molestias en muelas de juicio."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0077B6] focus:bg-white transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:from-[#006EAA] hover:to-[#00A4C8] text-white font-bold py-4 rounded-xl text-sm sm:text-base cursor-pointer shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Registrando Cita con la Sede...' : 'Enviar de Acuerdo y Agendar'}
            </button>

          </form>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦷</span>
              <span className="text-lg font-black text-white">Paradise Dental</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Clínica dental de alta confianza y accesibilidad en Lima, comprometida con transformar sonrisas con tecnología avanzada y presupuestos justos.
            </p>
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-300">📱 Central Telefónica:</p>
              <p className="text-sm font-bold text-white font-mono mt-0.5">989 005 627</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">Sedes en Lima Directo</h4>
            <ul className="space-y-2 text-xs">
              <li>📍 <b>Puente Nuevo:</b> Av. Primero de Mayo 3125</li>
              <li>📍 <b>Los Olivos:</b> Av. Naranjal 1182</li>
              <li>📍 <b>Independencia:</b> Av. Antisuyo 495</li>
              <li>📍 <b>El Agustino:</b> Av. Riva Agüero 1342</li>
              <li>📍 <b>Rímac:</b> Av. Tarapacá 480</li>
              <li>📍 <b>San Juan de Lurigancho:</b> Av. Próceres 1650</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">Especialidades</h4>
            <ul className="space-y-2 text-xs">
              <li>• Ortodoncia Profesional (Brackets S/180)</li>
              <li>• Implantes Dentales de Titanio</li>
              <li>• Diseño de Sonrisas y Carillas</li>
              <li>• Odontopediatría Cariñosa niños</li>
              <li>• Emergencias 24h y Endodoncias</li>
              <li>• Limpieza Ultrasónica General (S/30)</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">Información Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>• COP Registro Vigente</li>
              <li>• Libro de Reclamaciones</li>
              <li>• Políticas de Privacidad</li>
            </ul>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Modo Desarrollador / Administrativo</span>
              <button
                onClick={onOpenCRM}
                className="mt-1 text-xs text-[#00B4D8] font-bold hover:underline transition-all block text-left"
              >
                Acceder a Consola CRM Médica →
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 gap-4">
          <p>Socio Fundador CoP Nº 41229. Paradise Dental es marca registrada.</p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Facebook (492 segs)</a>
            <span>·</span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Instagram</a>
            <span>·</span>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">TikTok</a>
          </div>
        </div>
      </footer>

      {/* FLOAT CHATBOT PILL & DIALOG BOX */}
      <div className="fixed bottom-6 right-6 z-40 space-y-3 flex flex-col items-end">
        
        {/* Chatbot box dialog representation */}
        {showBot && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-4 w-76 sm:w-80 space-y-3.5 transition-all text-xs">
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🤖</span>
                <div>
                  <p className="font-bold text-slate-900">Dr. Paradise Bot</p>
                  <p className="text-[9px] text-[#00B4D8] uppercase font-mono font-bold flex items-center gap-0.5">
                    ● En línea · respuestas
                  </p>
                </div>
              </div>
              <button onClick={() => setShowBot(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {botChat.map((msg, i) => (
                <div key={i} className={`p-2.5 rounded-2xl leading-normal ${
                  msg.sender === 'user' 
                    ? 'bg-[#0077B6] text-white ml-6 text-right' 
                    : 'bg-slate-100 text-slate-800 mr-6'
                }`}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Simulated Suggestions */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] text-slate-400 uppercase font-mono font-medium">Preguntas frecuentes:</p>
              
              <button 
                onClick={() => handleBotQuery(
                  '¿Cuál es el precio de la primera cita?', 
                  'Nuestra consulta de diagnóstico general que incluye examen visual con cámara intraoral es de S/30. ¡Y si inicias tratamiento o te haces limpieza, el diagnóstico es con un cupón extra!'
                )}
                className="w-full text-left p-2 bg-slate-50 hover:bg-blue-50 hover:text-[#0077B6] rounded-xl transition block"
              >
                ¿Cuánto cuesta la primera cita?
              </button>

              <button 
                onClick={() => handleBotQuery(
                  '¿Tienen brackets en cuotas?', 
                  '¡Claro! Nuestra ortodoncia cuenta con colocación sin cuota inicial por inauguración de sedes. Solo pagas tus controles fijos mensuales desde S/180. Sin intereses.'
                )}
                className="w-full text-left p-2 bg-slate-50 hover:bg-blue-50 hover:text-[#0077B6] rounded-xl transition block"
              >
                ¿Cómo financio mis Brackets?
              </button>

              <button 
                onClick={() => handleBotQuery(
                  '¿Cuáles son las sedes?', 
                  'Tenemos 6 sedes en Lima: Puente Nuevo (Av. Primero de Mayo 3125, El Agustino), Los Olivos (Av. Naranjal 1182), Independencia, El Agustino municipal, Rimac y SJL.'
                )}
                className="w-full text-left p-2 bg-slate-50 hover:bg-blue-50 hover:text-[#0077B6] rounded-xl transition"
              >
                Ver ubicaciones y direcciones exactas
              </button>
            </div>
          </div>
        )}

        {/* Interactive toggle trigger */}
        <button
          onClick={() => setShowBot(!showBot)}
          className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-1.5 font-bold text-xs shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Preguntar al Dentista Bot</span>
        </button>

      </div>

      {/* SERVICE DETAIL MODAL DYNAMIC */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-4xl p-2.5 bg-blue-50 rounded-2xl">{selectedService.icon}</span>
              <div>
                <h4 className="text-xl font-bold text-slate-900 leading-tight">{selectedService.title}</h4>
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mt-0.5">Clínica Dental Paradise</p>
              </div>
            </div>

            {/* Img inside service detailed view */}
            <div className="h-44 rounded-2xl overflow-hidden border border-slate-100">
              <img 
                src={selectedService.image} 
                alt={selectedService.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-4">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {selectedService.fullDesc}
              </p>

              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#0077B6] font-mono block">Beneficios del Tratamiento:</span>
                {selectedService.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Precio Promocional:</span>
                  <span className="text-[#0077B6] font-black text-lg">S/ {selectedService.priceFrom}</span>
                </div>
                <span>Duración aproximada: <b>{selectedService.duration}</b></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <a 
                href={`https://wa.me/51989005627?text=Hola%20Cl%C3%ADnica%20Dental%20Paradise!%20Me%20interesa%20el%20tratamiento%20de%20*${encodeURIComponent(selectedService.title)}*%20que%20vi%20en%20su%20web.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-500 text-xs text-white font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white text-green-600" />
                Agendar WhatsApp
              </a>
              <button 
                onClick={() => { setSelectedService(null); handleScrollToBooking(selectedService.id); }}
                className="bg-slate-900 hover:bg-slate-800 text-xs text-white font-bold py-3 px-4 rounded-xl text-center cursor-pointer"
              >
                Reservar en Línea
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FAST BOOKING SUCCESS DIALOG */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 text-center shadow-xl relative border border-slate-100">
            
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-100">
              <Check className="w-8 h-8" strokeWidth={3} />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xl font-extrabold text-slate-900">¡Cita Registrada Exitosamente!</h4>
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-widest font-mono">Clínica Dental Paradise</p>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-2">
                Tu solicitud ha sido transmitida en tiempo real a la central de admisiones. Puedes visualizar tu cita instantáneamente en el panel de control médico o confirmar directo por WhatsApp.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-150 space-y-1.5 text-xs">
              <p>📍 Sede de Elección: <b>{SEDES.find(s=>s.id===bookingForm.sedeId)?.name || 'Sede'}</b></p>
              <p>🦷 Tratamiento: <b>{SERVICIOS.find(s=>s.id===bookingForm.servicioId)?.title || 'Especialidad'}</b></p>
              <p>⏳ Estado: <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">PENDIENTE EN CRM</span></p>
            </div>

            {/* Target actions */}
            <div className="space-y-2 pt-2">
              <a 
                href={registeredApptLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-green-600" />
                Confirmar al Instante por WhatsApp
              </a>

              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Cerrar e ir a la Página
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
