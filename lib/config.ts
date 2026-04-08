export type ThemeMode = "light" | "dark" | "system";

export type LucideIconName =
  | "Sparkles"
  | "ScanLine"
  | "ShieldCheck"
  | "Gem"
  | "Baby"
  | "Stethoscope";

export interface NavChildLink {
  href: string;
  label: string;
}

export interface NavLink {
  href: string;
  label: string;
  children?: NavChildLink[];
}

export interface BrandConfig {
  clinicName: string;
  tagline: string;
  legalName: string;
  logoUrl: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  defaultTheme: ThemeMode;
}

export interface ContactConfig {
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
  phoneHref: string;
  email: string;
  whatsapp: string;
  emergencyPhone: string;
  googleMapsEmbedUrl: string;
  latitude: number;
  longitude: number;
}

export interface SocialConfig {
  instagram: string;
  facebook: string;
  linkedin: string;
  x: string;
}

export interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
}

export interface HeroFloatingCard {
  title: string;
  body: string;
  icon: "ShieldCheck" | "Sparkles";
  position: string;
}

export interface HeroConfig {
  heading: string;
  rotatingWords: string[];
  subheading: string;
  heroImage: string;
  ctaPrimary: string;
  ctaSecondary: string;
  servicesCta: string;
  ratingBlurb: string;
  imageEyebrow: string;
  imageCaption: string;
  floatingCards: HeroFloatingCard[];
}

export interface HomeConfig {
  badge: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutHighlights: string[];
}

export interface ServiceConfig {
  title: string;
  description: string;
  icon: LucideIconName;
}

export interface StatConfig {
  label: string;
  value: number;
  suffix: string;
}

export interface DoctorConfig {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  bio: string;
}

export interface TestimonialConfig {
  name: string;
  treatment: string;
  rating: number;
  quote: string;
}

export interface ReviewStatConfig {
  label: string;
  value: string;
}

export interface BlogPostConfig {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  body: string[];
}

export interface FaqConfig {
  question: string;
  answer: string;
}

export interface GalleryItemConfig {
  before: string;
  after: string;
  title: string;
}

export interface BookingConfig {
  slotPools: string[];
  dateTitle: string;
  dateDescription: string;
  dateLabel: string;
  doctorLabel: string;
  slotLabel: string;
  patientNameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  reasonLabel: string;
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successDescription: string;
  intro: SectionCopy;
}

export interface ContactFormConfig {
  title: string;
  description: string;
  nameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  serviceLabel: string;
  servicePlaceholder: string;
  messageLabel: string;
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successDescription: string;
}

export interface ChatbotConfig {
  welcome: string;
  assistantLabel: string;
  placeholder: string;
  thinkingLabel: string;
  openLabel: string;
  voiceInputLabel: string;
  sendLabel: string;
  shortcuts: {
    book: string;
    services: string;
    contact: string;
  };
  quickReplies: string[];
  unsupportedVoiceMessage: string;
  voiceRetryMessage: string;
  defaultFallback: string;
  disclaimer: string;
}

export interface SeoConfig {
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  category: string;
}

export interface UiConfig {
  bookNowLabel: string;
  quickLinksLabel: string;
  contactLabel: string;
  loadingMessage: string;
  notFoundTitle: string;
  notFoundDescription: string;
  backHomeLabel: string;
  themeToggleLabel: string;
  cookieTitle: string;
  cookieDescription: string;
  cookieAcceptLabel: string;
  whatsappLabel: string;
  menuOpenLabel: string;
  blogReadArticleLabel: string;
  blogBackLabel: string;
  visitClinicTitle: string;
  globalErrorEyebrow: string;
  globalErrorTitle: string;
  globalErrorDescription: string;
  globalErrorRetryLabel: string;
}

export interface SiteSectionConfig {
  whyChooseUs: SectionCopy;
  services: SectionCopy & { allServicesLabel: string };
  testimonials: SectionCopy;
  gallery: SectionCopy & { beforeLabel: string; afterLabel: string };
  faq: SectionCopy;
  doctors: SectionCopy;
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
}

export interface PageCopyConfig {
  about: SectionCopy & {
    philosophyTitle: string;
    philosophyBody: string;
    patientsNoticeTitle: string;
    patientsNoticeBody: string;
  };
  services: SectionCopy;
  doctors: SectionCopy;
  book: SectionCopy;
  contact: SectionCopy;
  blogs: SectionCopy;
}

export interface ManifestConfig {
  name: string;
  shortName: string;
  description: string;
  backgroundColor: string;
  themeColor: string;
}

export interface ClinicConfig {
  site: {
    url: string;
    locale: string;
  };
  brand: BrandConfig;
  contact: ContactConfig;
  social: SocialConfig;
  seo: SeoConfig;
  manifest: ManifestConfig;
  navLinks: NavLink[];
  hero: HeroConfig;
  home: HomeConfig;
  services: ServiceConfig[];
  stats: StatConfig[];
  differentiators: string[];
  doctors: DoctorConfig[];
  testimonials: TestimonialConfig[];
  reviewStats: ReviewStatConfig[];
  blogPosts: BlogPostConfig[];
  faqs: FaqConfig[];
  gallery: GalleryItemConfig[];
  booking: BookingConfig;
  contactForm: ContactFormConfig;
  chatbot: ChatbotConfig;
  ui: UiConfig;
  sections: SiteSectionConfig;
  pages: PageCopyConfig;
}

export const clinicConfig: ClinicConfig = {
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://smilecraftdental.com",
    locale: "en_US",
  },
  brand: {
    clinicName: "Nexra Healthcare",
    tagline:
      "Modern healthcare experiences shaped around trust, clarity, and stronger digital conversion.",
    legalName: "Nexra Healthcare",
    logoUrl: "/Nexra Healthcare.png",
    favicon: "/brand/nexra-healthcare-mark.svg",
    primaryColor: "#0A61C9",
    secondaryColor: "#1F9C63",
    accentColor: "#D39A00",
    defaultTheme: "light",
  },
  contact: {
    address: "214 Harbor Wellness Avenue",
    city: "Santa Monica",
    region: "CA",
    postalCode: "90401",
    country: "US",
    phone: "+1 (310) 555-0148",
    phoneHref: "tel:+13105550148",
    email: "hello@smilecraftdental.com",
    whatsapp: "+13105550148",
    emergencyPhone: "+1 (310) 555-0171",
    googleMapsEmbedUrl:
      "https://www.google.com/maps?q=Santa+Monica+CA&output=embed",
    latitude: 34.0195,
    longitude: -118.4912,
  },
  social: {
    instagram: "https://instagram.com/smilecraftdental",
    facebook: "https://facebook.com/smilecraftdental",
    linkedin: "https://linkedin.com/company/smilecraftdental",
    x: "https://x.com/smilecraftdental",
  },
  seo: {
    defaultTitle: "Nexra Healthcare",
    defaultDescription:
      "A modern healthcare brand experience with patient-first journeys, strong trust signals, and polished digital touchpoints.",
    keywords: [
      "healthcare clinic website",
      "modern healthcare brand",
      "patient-first healthcare",
      "digital healthcare experience",
      "clinic appointment website",
      "healthcare enquiry platform",
    ],
    category: "healthcare",
  },
  manifest: {
    name: "Nexra Healthcare",
    shortName: "Nexra",
    description:
      "Modern healthcare experiences with polished branding, trust-led journeys, and fast appointment conversion.",
    backgroundColor: "#f8fcff",
    themeColor: "#0A61C9",
  },
  navLinks: [
    { href: "/", label: "Home" },
    {
      href: "/about",
      label: "About",
      children: [
        { href: "/about", label: "About Us" },
        { href: "/doctors", label: "Doctors" },
        { href: "/reviews", label: "Reviews" },
        { href: "/blogs", label: "Blogs" },
      ],
    },
    { href: "/services", label: "Services" },
    { href: "/book", label: "Book" },
    { href: "/contact", label: "Contact" },
  ],
  hero: {
    heading: "Confident smiles begin with thoughtful dental care.",
    rotatingWords: ["Implants", "Aligners", "Root Canal", "Cosmetic Dentistry"],
    subheading:
      "A premium, white-label dental experience designed to earn trust quickly, convert appointments smoothly, and scale across multiple clinics from one config.",
    heroImage: "/dental_implants_600.jpg",
    ctaPrimary: "Book Appointment",
    ctaSecondary: "Enquire Now",
    servicesCta: "Explore Services",
    ratingBlurb: "Rated by families, cosmetic patients, and emergency visitors",
    imageEyebrow: "Calm. Precise. Premium.",
    imageCaption:
      "A trustworthy first impression for clinics that want stronger conversions without noisy design.",
    floatingCards: [
      {
        icon: "ShieldCheck",
        title: "Sterile & Digital",
        body: "Advanced diagnostics with comfort-first workflows.",
        position: "left-4 top-6 right-16 md:left-6 md:right-auto lg:-left-8 lg:top-8",
      },
      {
        icon: "Sparkles",
        title: "Smile Design",
        body: "Aesthetic treatment planning with real visual previews.",
        position: "right-4 bottom-5 left-20 md:right-6 md:left-auto lg:-right-8 lg:bottom-10",
      },
    ],
  },
  home: {
    badge: "Trusted Family & Cosmetic Dentistry",
    aboutTitle: "A digital-first clinic experience that still feels human.",
    aboutDescription:
      "We combine warm chairside communication with modern diagnostics, treatment planning, and carefully paced appointments so patients feel informed instead of rushed.",
    aboutHighlights: [
      "Same-week consults for urgent and cosmetic cases",
      "Transparent treatment plans with digital previews",
      "Comfort-first interiors and anxiety-aware workflows",
    ],
  },
  services: [
    {
      title: "Dental Implants",
      description:
        "Permanent tooth replacement planned digitally for stability, fit, and natural aesthetics.",
      icon: "Sparkles",
    },
    {
      title: "Clear Aligners & Braces",
      description:
        "Orthodontic solutions for teens and adults with personalized smile simulations.",
      icon: "ScanLine",
    },
    {
      title: "Root Canal Therapy",
      description:
        "Microscope-assisted endodontics focused on pain relief and long-term tooth preservation.",
      icon: "ShieldCheck",
    },
    {
      title: "Cosmetic Dentistry",
      description:
        "Veneers, bonding, whitening, and smile makeovers designed around facial harmony.",
      icon: "Gem",
    },
    {
      title: "Pediatric Dentistry",
      description:
        "Gentle preventive and restorative care built for children and first-time dental visits.",
      icon: "Baby",
    },
    {
      title: "Preventive Care",
      description:
        "Routine cleanings, exams, oral cancer screenings, and digital diagnostics.",
      icon: "Stethoscope",
    },
  ],
  stats: [
    { label: "Happy Patients", value: 12000, suffix: "+" },
    { label: "Years Combined Experience", value: 45, suffix: "+" },
    { label: "Average Review Score", value: 49, suffix: "/50" },
    { label: "Same-Week Appointments", value: 96, suffix: "%" },
  ],
  differentiators: [
    "Digital diagnostics and treatment visualization",
    "Transparent plans with comfort-first care",
    "Flexible scheduling with emergency slots",
    "Boutique interiors designed to reduce anxiety",
  ],
  doctors: [
    {
      id: "dr-amelia",
      name: "Dr. Amelia Hart",
      specialty: "Prosthodontist & Implant Lead",
      experience: "14 years",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
      bio: "Focuses on full-mouth rehabilitation, implant prosthetics, and high-aesthetic restorative planning.",
    },
    {
      id: "dr-liam",
      name: "Dr. Liam Carter",
      specialty: "Endodontist",
      experience: "11 years",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80",
      bio: "Specializes in microscope-guided root canal therapy and pain management for complex retreatment cases.",
    },
    {
      id: "dr-sofia",
      name: "Dr. Sofia Nguyen",
      specialty: "Orthodontist",
      experience: "9 years",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80",
      bio: "Designs aligner and braces plans that balance function, comfort, and confident smile aesthetics.",
    },
  ],
  testimonials: [
    {
      name: "Natalie R.",
      treatment: "Smile Makeover",
      rating: 5,
      quote:
        "The entire journey felt structured, calm, and genuinely premium. I finally smile in photos again.",
    },
    {
      name: "Marcus D.",
      treatment: "Implants",
      rating: 5,
      quote:
        "Clear communication, precise timelines, and excellent results. The booking flow was as smooth as the treatment.",
    },
    {
      name: "Priya S.",
      treatment: "Pediatric Visit",
      rating: 5,
      quote:
        "Our daughter felt completely at ease. The team made a dental visit feel light, gentle, and reassuring.",
    },
  ],
  reviewStats: [
    { label: "Google Rating", value: "4.9/5" },
    { label: "Verified Reviews", value: "1,200+" },
    { label: "Returning Patients", value: "87%" },
  ],
  blogPosts: [
    {
      slug: "dental-implants-vs-bridges",
      title: "Dental Implants vs Bridges: Which Option Lasts Longer?",
      excerpt:
        "A patient-friendly comparison of longevity, comfort, maintenance, and long-term oral health outcomes.",
      category: "Implants",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
      body: [
        "Dental implants generally last longer than bridges because the titanium implant integrates with bone and does not rely on adjacent teeth for support. A well-maintained implant can last decades, while bridges often need replacement sooner because the supporting teeth and cemented structure experience wear over time.",
        "Bridges can still be the better option in cases where bone volume is limited, surgery is not preferred, or a faster restorative timeline matters more than maximum longevity. The right recommendation depends on gum health, bite forces, adjacent tooth condition, and the patient’s maintenance habits.",
        "Patients comparing implants and bridges should ask about cleaning difficulty, long-term cost, and whether neighboring healthy teeth need to be altered. In most cases, implants offer the best stability and preservation of surrounding bone, while bridges may offer a simpler short-term path.",
      ],
    },
    {
      slug: "clear-aligners-care-guide",
      title: "Clear Aligners Care Guide for Busy Adults",
      excerpt:
        "Simple habits that help aligner patients protect trays, stay consistent, and get better results on schedule.",
      category: "Orthodontics",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80",
      body: [
        "Clear aligners work best when they stay in place for the prescribed number of hours each day. That means meals, coffee habits, and travel routines need to support consistency. Patients who build small habits around cleaning, storing, and reinserting trays tend to finish treatment more predictably.",
        "Always remove aligners before eating, and rinse them before putting them back in. Keep a travel kit with a case, small toothbrush, and cleaning tablets so you do not end up wrapping trays in tissue or skipping hygiene during a busy day.",
        "If you are balancing work, events, and treatment, plan tray changes on quieter evenings and keep check-ins on the calendar. Small discipline with aligners usually matters more than intensity, and that consistency is what leads to smooth progress.",
      ],
    },
    {
      slug: "how-to-manage-dental-anxiety",
      title: "How to Manage Dental Anxiety Before Your Appointment",
      excerpt:
        "What calm clinics do differently, and what patients can do before stepping into the chair.",
      category: "Patient Care",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&w=1200&q=80",
      body: [
        "Dental anxiety is common, and the most effective clinics treat it as a care design issue rather than a personality flaw. Patients do better when the team explains steps in advance, confirms consent clearly, and structures the visit so there are fewer surprises.",
        "Before your appointment, tell the clinic about previous difficult experiences, fear triggers, or procedures that make you nervous. Bring headphones if music helps, avoid rushing to the appointment, and ask for pauses or explanations whenever needed.",
        "A calm appointment usually starts long before treatment begins. Good clinics build trust through pacing, communication, and gentle process design, which is why anxious patients often benefit from choosing practices that prioritize comfort-first workflows.",
      ],
    },
  ],
  faqs: [
    {
      question: "Do you accept emergency walk-ins?",
      answer:
        "Yes. We keep limited emergency slots open daily for pain, trauma, swelling, and broken restorations.",
    },
    {
      question: "How do online bookings work?",
      answer:
        "Patients select a doctor, preferred date, and available time slot. Booking requests are validated on the server and can be forwarded to your operational workflow using a secure webhook.",
    },
    {
      question: "Can this site be reused for other clinics?",
      answer:
        "Yes. Clinic branding, content, contacts, media, and SEO details are centralized in a single config file for white-label rollout.",
    },
    {
      question: "Do you offer financing options?",
      answer:
        "Yes. Flexible staged treatment plans and third-party payment support can be configured per clinic.",
    },
  ],
  gallery: [
    {
      before: "https://placehold.co/640x480/e2e8f0/0f172a?text=Before",
      after: "https://placehold.co/640x480/cffafe/0f172a?text=After",
      title: "Composite Veneer Enhancement",
    },
    {
      before: "https://placehold.co/640x480/e2e8f0/0f172a?text=Before",
      after: "https://placehold.co/640x480/cffafe/0f172a?text=After",
      title: "Single Implant Restoration",
    },
  ],
  booking: {
    slotPools: [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "04:00 PM",
      "04:30 PM",
      "05:00 PM",
      "05:30 PM",
      "06:00 PM",
      "06:30 PM",
    ],
    dateTitle: "Choose your date",
    dateDescription:
      "Slots update dynamically based on doctor and date selection.",
    dateLabel: "Selected date",
    doctorLabel: "Select doctor",
    slotLabel: "Available time slots",
    patientNameLabel: "Patient name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    reasonLabel: "Reason for visit",
    submitLabel: "Confirm Appointment",
    submittingLabel: "Confirming...",
    successTitle: "Booking request received",
    successDescription:
      "Your request has been validated and queued successfully. We will confirm the appointment from the clinic workflow.",
    intro: {
      eyebrow: "Book Appointment",
      title:
        "A conversion-focused booking flow with server-validated requests.",
      description:
        "Choose a doctor, preferred date, and available slot. Requests are validated on both client and server and can be forwarded to your clinic workflow.",
    },
  },
  contactForm: {
    title: "Send an enquiry",
    description:
      "Use this form for treatment questions, pricing requests, or appointment support.",
    nameLabel: "Name",
    phoneLabel: "Phone",
    emailLabel: "Email",
    serviceLabel: "Service",
    servicePlaceholder: "Choose a service",
    messageLabel: "Message",
    submitLabel: "Send Enquiry",
    submittingLabel: "Submitting...",
    successTitle: "Enquiry sent",
    successDescription:
      "Your enquiry has been validated and forwarded successfully. The clinic team can now follow up through the configured workflow.",
  },
  chatbot: {
    welcome:
      "Hi, I'm your digital care assistant. I can help with bookings, treatments, pricing guidance, and emergency directions.",
    assistantLabel: "Digital care assistant",
    placeholder: "Ask about services, prices, or booking support...",
    thinkingLabel: "Thinking...",
    openLabel: "Open chatbot",
    voiceInputLabel: "Start voice input",
    sendLabel: "Send message",
    shortcuts: {
      book: "Book",
      services: "Services",
      contact: "Contact",
    },
    quickReplies: [
      "Book Appointment",
      "Services",
      "Pricing",
      "Emergency",
      "Insurance",
    ],
    unsupportedVoiceMessage:
      "Voice input is not supported in this browser. You can still type your question below.",
    voiceRetryMessage:
      "I could not catch that clearly. Please try again or type your message.",
    defaultFallback:
      "I can help with services, pricing, emergency information, doctor selection, voice assistance, and appointment booking. Ask me directly or tap a quick reply.",
    disclaimer:
      "Voice support uses the browser speech API when available. Chat guidance is informational and should not replace direct clinical advice for emergencies.",
  },
  ui: {
    bookNowLabel: "Book Now",
    quickLinksLabel: "Quick Links",
    contactLabel: "Contact",
    loadingMessage: "Loading dental experience...",
    notFoundTitle: "Page not found",
    notFoundDescription:
      "The page you requested does not exist for this clinic tenant. Return home and continue browsing.",
    backHomeLabel: "Back to Home",
    themeToggleLabel: "Toggle theme",
    cookieTitle: "Cookie consent",
    cookieDescription:
      "This site stores theme and consent preferences locally to improve the patient browsing experience.",
    cookieAcceptLabel: "Accept",
    whatsappLabel: "WhatsApp",
    menuOpenLabel: "Open menu",
    blogReadArticleLabel: "Read article",
    blogBackLabel: "Back to Blogs",
    visitClinicTitle: "Visit the clinic",
    globalErrorEyebrow: "Application Error",
    globalErrorTitle: "Something went wrong",
    globalErrorDescription:
      "We could not render the site correctly. Review the server logs and retry after fixing the issue.",
    globalErrorRetryLabel: "Try Again",
  },
  sections: {
    whyChooseUs: {
      eyebrow: "Why Choose Us",
      title: "Built for trust before the first appointment.",
      description:
        "The experience blends strong conversion design with calm clinical authority, so premium dental brands feel credible from the first scroll.",
    },
    services: {
      eyebrow: "Services",
      title: "Comprehensive dentistry with premium presentation.",
      description:
        "Every core service is configurable through the shared white-label data model, making this template ready for single-clinic or SaaS rollout.",
      allServicesLabel: "Explore All Services",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "Patient stories that reinforce trust.",
      description:
        "A lightweight testimonial lane keeps the page feeling active without hurting performance.",
    },
    gallery: {
      eyebrow: "Before & After",
      title: "Clinical transformations presented with restraint.",
      description:
        "A simple gallery gives dental brands space to show outcomes without turning the site into a cluttered portfolio.",
      beforeLabel: "Before",
      afterLabel: "After",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Clear answers for common patient questions.",
      description:
        "The FAQ is driven from the same config file, so each clinic can tailor tone, policies, and positioning without touching the layout.",
    },
    doctors: {
      eyebrow: "Clinical Team",
      title: "Introduce your doctors with authority and polish.",
      description:
        "This route is designed for premium doctor presentation while staying easy to customize for any clinic team size.",
    },
    finalCta: {
      eyebrow: "Ready to Book",
      title: "Make it easy for patients to take the next step.",
      description:
        "Strong service pages should end with a clear action. This section keeps that conversion moment elegant and fast.",
      primaryLabel: "Book Appointment",
      secondaryLabel: "Call Clinic",
    },
  },
  pages: {
    about: {
      eyebrow: "About Us",
      title:
        "Boutique dentistry shaped around calm, clarity, and clinical rigor.",
      description:
        "This page is intentionally structured for white-label deployment: a clear story block, reusable stats, and brand-safe layout that can adapt to any dental clinic profile.",
      philosophyTitle: "Our philosophy",
      philosophyBody:
        "SmileCraft Dental Studio combines digital diagnosis, comfort-first workflows, and transparent communication to make high-quality dentistry feel more human.",
      patientsNoticeTitle: "What patients notice",
      patientsNoticeBody:
        "Shorter wait times, a consistent visual standard, clear treatment pathways, and a team that explains choices rather than pushing procedures.",
    },
    services: {
      eyebrow: "Service Library",
      title: "A configurable service catalogue for every clinic tenant.",
      description:
        "Each service card can be swapped, expanded, or repurposed from the central config, allowing one codebase to support multiple dental specialties and locations.",
    },
    doctors: {
      eyebrow: "Clinical Team",
      title: "Introduce your doctors with authority and polish.",
      description:
        "This route is designed for premium doctor presentation while staying easy to customize for any clinic team size.",
    },
    book: {
      eyebrow: "Book Appointment",
      title:
        "A conversion-focused booking flow with server-validated requests.",
      description:
        "The booking experience uses shared validation, dynamic time slots, and a server action that can forward requests into your operations stack.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Enquiry capture, map embed, and direct patient contact.",
      description:
        "This page is built to handle both polished lead capture and immediate action, including map directions and a floating WhatsApp shortcut.",
    },
    blogs: {
      eyebrow: "Patient Education",
      title: "Practical dental guidance that supports trust and SEO.",
      description:
        "Blog content lives in config today, but the page structure is ready to evolve toward CMS or MDX content without route changes.",
    },
  },
};
