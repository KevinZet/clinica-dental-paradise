import { Sede, Servicio, Testimonial, Transformation, Promo, QuizQuestion, Patient, Appointment } from './types';

export const SEDES: Sede[] = [
  {
    id: 'puente-nuevo',
    name: 'Puente Nuevo',
    address: 'Av. Primero de Mayo 3125, El Agustino (A 1 cuadra de Puente Nuevo)',
    phone: '989 005 627',
    mapUrl: 'https://maps.google.com/?q=Av.+Primero+de+Mayo+3125,+El+Agustino,+Peru',
    whatsappLink: 'https://wa.me/51989005627?text=Hola%20Cl%C3%ADnica%20Dental%20Paradise!%20Quiero%20agendar%20una%20cita%20para%20la%20sede%20Puente%20Nuevo.',
    hours: 'Lun - Sáb: 08:00 - 22:00 | Dom: Emergencias',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'los-olivos',
    name: 'Los Olivos',
    address: 'Av. Naranjal 1182 (Frente a la Estación Naranjal del Metropolitano)',
    phone: '989 005 627',
    mapUrl: 'https://maps.google.com/?q=Av.+Naranjal+1182,+Los+Olivos,+Peru',
    whatsappLink: 'https://wa.me/51989005627?text=Hola%20Cl%C3%ADnica%20Dental%20Paradise!%20Quiero%20agendar%20una%20cita%20para%20la%20sede%20Los%20Olivos.',
    hours: 'Lun - Sáb: 08:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'independencia',
    name: 'Independencia',
    address: 'Av. Antisuyo 495 (Espalda del Centro Comercial MegaPlaza)',
    phone: '989 005 627',
    mapUrl: 'https://maps.google.com/?q=Av.+Antisuyo+495,+Independencia,+Peru',
    whatsappLink: 'https://wa.me/51989005627?text=Hola%20Cl%C3%ADnica%20Dental%20Paradise!%20Quiero%20agendar%20una%20cita%20para%20la%20sede%20Independencia.',
    hours: 'Lun - Sáb: 08:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1582560372921-91440c26da1f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'el-agustino',
    name: 'El Agustino',
    address: 'Av. Riva Agüero 1342 (Frente a la Municipalidad)',
    phone: '989 005 627',
    mapUrl: 'https://maps.google.com/?q=Av.+Riva+Aguero+1342,+El+Agustino,+Peru',
    whatsappLink: 'https://wa.me/51989005627?text=Hola%20Cl%C3%ADnica%20Dental%20Paradise!%20Quiero%20agendar%20una%20cita%20para%20la%20sede%20El%20Agustino.',
    hours: 'Lun - Sáb: 08:00 - 21:00',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'rimac',
    name: 'Rímac',
    address: 'Av. Tarapacá 480 (Cerca a la Alameda de los Descalzos)',
    phone: '989 005 627',
    mapUrl: 'https://maps.google.com/?q=Av.+Tarapaca+480,+Rimac,+Peru',
    whatsappLink: 'https://wa.me/51989005627?text=Hola%20Cl%C3%ADnica%20Dental%20Paradise!%20Quiero%20agendar%20una%20cita%20para%20la%20sede%20Rimac.',
    hours: 'Lun - Sáb: 08:00 - 21:00',
    image: 'https://images.unsplash.com/photo-1504813184591-01552793005f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'san-juan-lurigancho',
    name: 'San Juan de Lurigancho',
    address: 'Av. Próceres de la Independencia 1650 (Cerca a la Estación Los Jardines)',
    phone: '989 005 627',
    mapUrl: 'https://maps.google.com/?q=Av.+Proceres+de+la+Independencia+1650,+SJL,+Peru',
    whatsappLink: 'https://wa.me/51989005627?text=Hola%20Cl%C3%ADnica%20Dental%20Paradise!%20Quiero%20agendar%20una%20cita%20para%20la%20sede%20San%20Juan%20de%20Lurigancho.',
    hours: 'Lun - Sáb: 08:00 - 22:00 | Dom: 09:00 - 15:00',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600'
  }
];

export const SERVICIOS: Servicio[] = [
  {
    id: 'implantes',
    title: 'Implantes Dentales',
    shortDesc: 'Recupera tus dientes perdidos con piezas fijas de titanio que lucen y actúan como dientes naturales.',
    fullDesc: 'Los implantes dentales son raíces artificiales de titanio que se colocan en el hueso maxilar para dar soporte a un diente artificial o una prótesis. Ofrecen una solución permanente que previene la pérdida ósea facial y permite masticar y hablar sin temor alguno.',
    priceFrom: 1200,
    duration: '2-3 sesiones',
    icon: '🦷',
    benefits: [
      'Aspecto y funcionamiento 100% natural',
      'No desgasta los dientes adyacentes sanos',
      'Solución definitiva y sumamente duradera',
      'Evita la deformación facial por falta de óseo'
    ],
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'ortodoncia',
    title: 'Ortodoncia (Brackets)',
    shortDesc: 'Alinea tus dientes y corrige tu mordida con brackets metálicos, estéticos o alineadores invisibles.',
    fullDesc: 'La ortodoncia profesional corrige la alineación de dientes desordenados o problemas de maloclusión. Ofrecemos brackets metálicos tradicionales, brackets de zafiro estéticos, y alineadores invisibles de última generación para todas las edades.',
    priceFrom: 180,
    duration: 'Control mensual',
    icon: '😁',
    benefits: [
      'Mejora notablemente la estética de tu perfil',
      'Mejora la masticación y digestión',
      'Previene el desgaste prematuro de dientes',
      'Financiamiento cómodo sin intereses'
    ],
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'odontopediatria',
    title: 'Odontopediatría',
    shortDesc: 'Atención dental especializada para niños en un ambiente libre de estrés y muy amigable.',
    fullDesc: 'Cuidamos la sonrisa de los más pequeños de la casa. Nuestro equipo de odontopediatras tiene amplia experiencia en el trato infantil, logrando que su visita al dentista sea divertida y con técnicas de mínima invasión (prevención, flúor, sellantes).',
    priceFrom: 40,
    duration: '45 minutos',
    icon: '👶',
    benefits: [
      'Ambiente lúdico e interactivo adaptado a niños',
      'Técnicas sin dolor y de manejo psicológico positivo',
      'Aplicación de flúor barniz y sellantes preventivos',
      'Educación interactiva en técnica de cepillado'
    ],
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'diseno-sonrisa',
    title: 'Diseño de Sonrisas',
    shortDesc: 'Transformamos tu sonrisa combinando carillas, blanqueamientos y recorte gingival.',
    fullDesc: 'Diseñamos la sonrisa de tus sueños simulando digitalmente la proporción ideal de tus dientes según tu rostro. Aplicamos carillas de porcelana o resina de alta gama, recorte estético de encías (gingivoplastia) y blanqueamientos profundos.',
    priceFrom: 350,
    duration: '1-2 sesiones',
    icon: '✨',
    benefits: [
      'Sonrisa armónica, blanca y perfectamente alineada',
      'Tratamiento personalizado y altamente estético',
      'Aumenta tu seguridad y autoestima notablemente',
      'Materiales de alta durabilidad y resistencia'
    ],
    image: 'https://images.unsplash.com/photo-1542156822-6924d1a71aba?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'protesis',
    title: 'Prótesis Dental',
    shortDesc: 'Dientes artificiales de excelente adaptabilidad (prótesis acrílicas, flexibles o metálicas).',
    fullDesc: 'Fabricamos prótesis dentales parciales o completas removibles y fijas de la más alta calidad y ajuste óptimo. Te devolvemos la habilidad de saborear y masticar tus alimentos sin molestias.',
    priceFrom: 250,
    duration: '3-4 sesiones',
    icon: '🦷',
    benefits: [
      'Soporte muscular y volumen facial recuperado',
      'Materiales ligeros, higiénicos y flexibles',
      'Retención óptima para masticar con confianza',
      'Precios muy competitivos de laboratorio directo'
    ],
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'odontologia-general',
    title: 'Odontología General',
    shortDesc: 'Limpiezas dentales con ultrasonido, curaciones estéticas y profilaxis profunda.',
    fullDesc: 'La base de una boca sana es la odontología general. Incluye diagnósticos precisos mediante cámaras intraorales, destartaraje ultrasónico para remover sarro acumulado, y curaciones con resinas estéticas invisibles que protegen y duran.',
    priceFrom: 30,
    duration: '30-45 minutos',
    icon: '🦷',
    benefits: [
      'Citas desde S/30 con diagnóstico integral',
      'Limpiezas sin dolo con tecnología ultrasónica',
      'Resinas fotocurables del color exacto de tu diente',
      'Detección oportuna de caries y gingivitis'
    ],
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'emergencias',
    title: 'Emergencias Dentales',
    shortDesc: 'Atención inmediata para dolores agudos, fracturas dentales o infecciones las 24/7.',
    fullDesc: '¿Tienes un dolor insoportable, se te rompió un diente o sufiste un golpe fuerte? No esperes más. Ofrecemos asistencia del dolor rápida con endodoncias de emergencia, extracciones controladas y curaciones paliativas rápidas.',
    priceFrom: 50,
    duration: 'Urgente',
    icon: '🚨',
    benefits: [
      'Atención rápida y prioritaria sin citas previas',
      'Resolución del dolor dental agudo en pocos minutos',
      'Especialistas listos para cirugías e infecciones',
      'Canales de WhatsApp directos para guiar tu urgencia'
    ],
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'estetica-facial',
    title: 'Estética Dental y Blanqueamiento',
    shortDesc: 'Blanqueamiento LED para aclarar hasta 4 tonos y bichectomía asistida de alta definición.',
    fullDesc: 'Embellece no solo tus dientes sino tu marco facial completo. Ofrecemos blanqueamiento dental led acelerado de última generación, carillas estéticas, bichectomía y aplicación de toxina botulínica para corregir sonrisas gingivales.',
    priceFrom: 199,
    duration: '1 sesión',
    icon: '✨',
    benefits: [
      'Dientes más blancos en una sesión de 45 min',
      'Seguro para el esmalte, no genera alta sensibilidad',
      'Tecnología LED de última generación alemana',
      'Complemento ideal para eventos especiales'
    ],
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Karla Mendoza',
    age: 26,
    treatment: 'Ortodoncia Brackets',
    text: 'Súper recomendados. Inicié mis brackets en la sede Puente Nuevo y el trato ha sido impecable. Además las cuotas mensuales son de S/180, súper accesible para mi bolsillo.',
    rating: 5,
    sede: 'Puente Nuevo',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 't2',
    name: 'Diego Flores',
    age: 34,
    treatment: 'Implantes Dentales',
    text: 'Perdí una muela por un accidente de fútbol. En la Sede Los Olivos me hicieron la cirugía de implante. No sentí nada de dolor durante el proceso y ahora muerdo con total normalidad.',
    rating: 5,
    sede: 'Los Olivos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 't3',
    name: 'Rosa Del Castillo',
    age: 39,
    treatment: 'Odontopediatría (su hijo Leo, 6 años)',
    text: 'Mi hijo le tenía pánico a los dentistas. Lo llevé a Independencia con la Odontopediatra y ahora sale sonriendo y preguntando cuándo volvemos. Súper dinámicos.',
    rating: 5,
    sede: 'Independencia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 't4',
    name: 'Santiago Ortiz',
    age: 29,
    treatment: 'Diseño de Sonrisa',
    text: 'Me hice carillas estéticas de resina en la clínica El Agustino y el cambio es brutal. Mis dientes lucen uniformes y muy naturales. Me ha subido la confianza al máximo.',
    rating: 5,
    sede: 'El Agustino',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  }
];

export const TRANSFORMATIONS: Transformation[] = [
  {
    id: 'tr1',
    title: 'Alineamiento Completo de Brackets',
    treatment: 'Ortodoncia Metálica Avanzada',
    beforeImg: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600&q=40', // Crowded teeth vector style/abstract proxy
    afterImg: 'https://images.unsplash.com/photo-1542156822-6924d1a71aba?auto=format&fit=crop&q=80&w=600', // Perfect straight smile
    description: 'Tratamiento de 14 meses. Se corrigió apiñamiento severo de maxilar superior e inferior, logrando una mordida ideal.'
  },
  {
    id: 'tr2',
    title: 'Diseño de Sonrisa de Alta Estética',
    treatment: 'Carillas de Porcelana + Recorte Encía',
    beforeImg: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600&q=30', // Stained/chipped mock proxy
    afterImg: 'https://images.unsplash.com/photo-15122290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600', // Beautiful white teeth
    description: 'Restauración estética total. Se cambiaron resinas antiguas desgastadas por carillas cerámicas Premium ultra-delgadas.'
  },
  {
    id: 'tr3',
    title: 'Implante y Corona Incisivo Central',
    treatment: 'Implante Dental Fijo de Titanio',
    beforeImg: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600&q=30', // Empty gap mock
    afterImg: 'https://images.unsplash.com/photo-1504813184591-01552793005f?auto=format&fit=crop&q=80&w=600', // Smile complete
    description: 'En tan solo dos sesiones, recuperó la pieza frontal perdida. Corona de circonio totalmente integrada.'
  }
];

export const PROMOS: Promo[] = [
  {
    id: 'p1',
    title: 'Profilaxis Dental Completa',
    description: 'Limpieza ultrasónica, pulido dental, fluorización y descarte de caries con cámara intraoral.',
    code: 'PROMO30',
    discount: 'S/ 30',
    validUntil: '30 de Junio del 2026',
    bgGradient: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'p2',
    title: 'Ortodoncia Brackets Estéticos',
    description: 'Inicia tu tratamiento sin cuota inicial por colocación. Mensualidades fijas desde S/180.',
    code: 'BRACKPARADISE',
    discount: 'Colocación Gratis',
    validUntil: '15 de Julio del 2026',
    bgGradient: 'from-cyan-600 to-emerald-500'
  },
  {
    id: 'p3',
    title: 'Diseño de Sonrisa Premium',
    description: 'Carillas de resina de alta gama (10 piezas frontales) con blanqueamiento post-tratamiento.',
    code: 'DREAMSONRISA',
    discount: '25% Dscto.',
    validUntil: '30 de Junio del 2026',
    bgGradient: 'from-teal-600 to-indigo-600'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '¿Qué es lo que más te gustaría mejorar en tu sonrisa?',
    options: [
      { text: 'Alinear mis dientes torcidos o amontonados', pointsFor: 'ortodoncia', description: 'Solución con brackets metálicos, estéticos o alineadores.' },
      { text: 'Reemplazar uno o varios dientes que perdí', pointsFor: 'implantes', description: 'Implantes fijos de titanio premium.' },
      { text: 'Tener una sonrisa más blanca, simétrica y radiante', pointsFor: 'diseno-sonrisa', description: 'Diseño estético con carillas o blanqueamientos.' },
      { text: 'Solo necesito un chequeo general o una limpieza profunda', pointsFor: 'odontologia-general', description: 'Profilaxis completa desde S/30.' }
    ]
  },
  {
    id: 2,
    question: '¿Sueles sentir algún dolor o sensibilidad extrema?',
    options: [
      { text: 'Sí, tengo un dolor intenso y necesito atención urgente', pointsFor: 'emergencias', description: 'Emergencias dentales con alivio del dolor inmediato' },
      { text: 'Siento sensibilidad al comer alimentos muy fríos o calientes', pointsFor: 'odontologia-general', description: 'Sensibilidad dental tratable mediante resinas o desensibilizantes' },
      { text: 'No tengo dolor, solo busco mejorar el aspecto estético', pointsFor: 'diseno-sonrisa', description: 'Tratamientos cosméticos personalizados' },
      { text: 'Es para el cuidado preventivo de mi hijo menor', pointsFor: 'odontopediatria', description: 'Odontopediatría cariñosa libre de miedos' }
    ]
  },
  {
    id: 3,
    question: '¿Cuál es tu preferencia de financiamiento o facilidades?',
    options: [
      { text: 'Busco ofertas económicas y pagar citas puntuales', pointsFor: 'odontologia-general', description: 'Contamos con servicios esenciales desde S/30.' },
      { text: 'Quiero pagar en cómodas cuotas sin intereses', pointsFor: 'ortodoncia', description: 'Financiamiento personalizado para tus brackets.' },
      { text: 'Busco la máxima calidad y tecnología sin importar el costo', pointsFor: 'diseno-sonrisa', description: 'Tecnología alemana e implantes biocompatibles.' },
      { text: 'Busco un descuento promocional rápido', pointsFor: 'odontologia-general', description: 'Limpiezas integrales promocionales.' }
    ]
  }
];

// CRM Mock Seed Data
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    name: 'Carlos Gonzales Ruíz',
    phone: '984712411',
    email: 'cgonzales@gmail.com',
    birthDate: '1992-04-12',
    sedePreferida: 'puente-nuevo',
    historiaClinica: [
      '12/04/2026 - Primera cita de ortodoncia. Consulta diagnóstica, toma de radiografías.',
      '15/05/2026 - Colocación definitiva de Brackets metálicos en arcada superior.'
    ],
    antecedentes: 'Paciente sin alergias medicinales. Sensibilidad leve.',
    status: 'active',
    lastVisit: '2026-05-15'
  },
  {
    id: 'pat-002',
    name: 'Fiorella Medina Alarcón',
    phone: '955811029',
    email: 'fio.medina@outlook.com',
    birthDate: '1988-11-23',
    sedePreferida: 'los-olivos',
    historiaClinica: [
      '20/03/2026 - Evaluación de implante dental para molar 36.',
      '14/04/2026 - Cirugía de implante de titanio (proceso exitoso).',
      '01/06/2026 - Revisión de oseointegración. Excelente recuperación.'
    ],
    antecedentes: 'Hipertensión leve controlada.',
    status: 'active',
    lastVisit: '2026-06-01'
  },
  {
    id: 'pat-003',
    name: 'Andrea Salas Chumpitaz',
    phone: '967111002',
    birthDate: '2019-07-08', // Kid!
    sedePreferida: 'independencia',
    historiaClinica: [
      '10/05/2026 - Profilaxis infantil con profiláctico sabor fresa. Se aplicó barniz de flúor en molares.',
      '10/06/2026 - Colocación de sellante preventivo en pieza 46.'
    ],
    antecedentes: 'Ninguno. Colaboradora durante la consulta.',
    status: 'active',
    lastVisit: '2026-06-10'
  },
  {
    id: 'pat-004',
    name: 'José María Vargas',
    phone: '912389123',
    email: 'jmvargas@yahoo.com',
    birthDate: '1975-02-15',
    sedePreferida: 'el-agustino',
    historiaClinica: [
      '18/05/2026 - Extracción pieza 28 por destrucción cariosa dolorosa.',
      '25/05/2026 - Retiro de puntos. Cicatrización normal.'
    ],
    antecedentes: 'Alérgico a la Penicilina.',
    status: 'active',
    lastVisit: '2026-05-25'
  },
  {
    id: 'pat-005',
    name: 'Mariana Pajuelo Luna',
    phone: '990312516',
    email: 'mariana.luna@gmail.com',
    birthDate: '1998-09-02',
    sedePreferida: 'rimac',
    historiaClinica: [
      '05/06/2026 - Blanqueamiento LED con curación de resina estética en pieza 11.'
    ],
    antecedentes: 'Ninguno.',
    status: 'active',
    lastVisit: '2026-06-05'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'cit-101',
    patientName: 'Carlos Gonzales Ruíz',
    phone: '984712411',
    email: 'cgonzales@gmail.com',
    sedeId: 'puente-nuevo',
    serviceId: 'ortodoncia',
    date: '2026-06-17', // Tomorrow
    time: '09:30',
    specialist: 'Dr. Hugo Sánchez (Ortodoncista)',
    status: 'confirmed',
    notes: 'Control mensual de brackets. Ajuste de ligaduras.',
    createdAt: '2026-06-10T10:00:00Z'
  },
  {
    id: 'cit-102',
    patientName: 'Fiorella Medina Alarcón',
    phone: '955811029',
    email: 'fio.medina@outlook.com',
    sedeId: 'los-olivos',
    serviceId: 'implantes',
    date: '2026-06-17', // Tomorrow
    time: '11:00',
    specialist: 'Dra. Pilar Wong (Cirujano Implantóloga)',
    status: 'confirmed',
    notes: 'Toma de impresión para la corona definitiva sobre implante.',
    createdAt: '2026-06-12T12:00:00Z'
  },
  {
    id: 'cit-103',
    patientName: 'Samuel Espinoza Prado',
    phone: '933481232',
    sedeId: 'puente-nuevo',
    serviceId: 'odontologia-general',
    date: '2026-06-16', // Today (past/ongoing)
    time: '14:00',
    specialist: 'Dr. Daniel Castro (Odontólogo General)',
    status: 'completed',
    notes: 'Profilaxis ultrasónica profunda contratada desde S/30.',
    createdAt: '2026-06-15T09:00:00Z'
  },
  {
    id: 'cit-104',
    patientName: 'Lucía Benavides',
    phone: '921102941',
    email: 'lucia.ben@gmail.com',
    sedeId: 'independencia',
    serviceId: 'diseno-sonrisa',
    date: '2026-06-18', // In 2 days
    time: '15:30',
    specialist: 'Dr. Hans Werner (Estética Dental)',
    status: 'pending',
    notes: 'Examen simulado digital de Diseño de Sonrisa.',
    createdAt: '2026-06-14T08:12:00Z'
  },
  {
    id: 'cit-105',
    patientName: 'Leo Salas Chumpitaz (Niño)',
    phone: '967111002',
    sedeId: 'independencia',
    serviceId: 'odontopediatria',
    date: '2026-06-20', // Next weekend
    time: '10:00',
    specialist: 'Dra. Sofía Martínez (Odontopediatra)',
    status: 'confirmed',
    notes: 'Revisión y fluorización preventiva periódica.',
    createdAt: '2026-06-15T16:00:00Z'
  },
  {
    id: 'cit-106',
    patientName: 'Gisela Cárdenas',
    phone: '988123012',
    email: 'gisela.c@gmail.com',
    sedeId: 'rimac',
    serviceId: 'protesis',
    date: '2026-06-19',
    time: '16:00',
    specialist: 'Dr. Carlos Mendoza (Rehabilitador Oral)',
    status: 'pending',
    notes: 'Prueba de prótesis removible metálica.',
    createdAt: '2026-06-13T11:45:00Z'
  },
  {
    id: 'cit-107',
    patientName: 'Julio Meléndez',
    phone: '911223344',
    sedeId: 'el-agustino',
    serviceId: 'emergencias',
    date: '2026-06-16', // Today (urgent)
    time: '18:30',
    specialist: 'Dr. Daniel Castro (Turno Emergencia)',
    status: 'confirmed',
    notes: 'Dolor agudo en molar inferior izquierdo. Posible endodoncia de urgencia.',
    createdAt: '2026-06-16T11:00:00Z'
  }
];
