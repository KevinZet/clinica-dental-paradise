export interface Sede {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapUrl: string;
  whatsappLink: string;
  hours: string;
  image: string;
}

export interface Servicio {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  priceFrom: number;
  duration: string;
  icon: string;
  benefits: string[];
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  treatment: string;
  text: string;
  rating: number;
  sede: string;
  avatar: string;
  videoUrl?: string; // For simulating TikTok/Reels style vertical videos
}

export interface Transformation {
  id: string;
  title: string;
  treatment: string;
  beforeImg: string;
  afterImg: string;
  description: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email?: string;
  sedeId: string;
  serviceId: string;
  date: string;
  time: string;
  specialist: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthDate: string;
  sedePreferida: string;
  historiaClinica: string[];
  antecedentes?: string;
  status: 'active' | 'inactive';
  lastVisit?: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  validUntil: string;
  bgGradient: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    description?: string;
    pointsFor: string; // Treatment recommendation key
  }[];
}
