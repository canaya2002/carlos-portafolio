'use client';

import React, { useState, useEffect, useRef, useMemo, memo, useCallback, createContext, useContext } from 'react';
import Image from 'next/image';
import {
  Download,
  Mail,
  Github,
  Linkedin,
  Phone,
  MapPin,
  Calendar,
  Award,
  Code,
  Database,
  Cloud,
  Briefcase,
  GraduationCap,
  Star,
  ExternalLink,
  Zap,
  Users,
  Target,
  TrendingUp,
  Menu,
  X,
  MessageCircle,
  Send,
  User,
  Bot,
  Globe
} from 'lucide-react';

// =================================================================
// 0. DATA & CONTEXT
// =================================================================

type Language = 'es' | 'en';

interface SkillCategory {
  title: string;
  icon: any;
  color: string;
  skills: string[];
}

interface SkillsData {
  title: string;
  subtitle: string;
  categories: {
    frontend: SkillCategory;
    backend: SkillCategory;
    cloud: SkillCategory;
    data: SkillCategory;
    management: SkillCategory;
  };
}

interface PortfolioData {
  [key: string]: {
    [key in Language]: any;
  };
  skills: {
    [key in Language]: SkillsData;
  };
}

// Data corrected and synchronized across both languages (using the previously provided, correct structure)
const portfolioData: PortfolioData = {
  metadata: {
    es: { name: 'Carlos Anaya Ruiz', title: 'Ingeniero en Tecnologías Computacionales', email: 'carlosaremployment@hotmail.com', phone: '+52 55 4416 7974', github: 'https://github.com/CArlos12002', linkedin: 'https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/', website: 'carlos-portafolio-sigma.vercel.app', location: 'Ciudad de México, México', cv_download: 'Descargar CV', contact_btn: 'Contactar' },
    en: { name: 'Carlos Anaya Ruiz', title: 'Computer Technologies Engineer', email: 'carlosaremployment@hotmail.com', phone: '+52 55 4416 7974', github: 'https://github.com/CArlos12002', linkedin: 'https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/', website: 'carlos-portafolio-sigma.vercel.app', location: 'Mexico City, Mexico', cv_download: 'Download CV', contact_btn: 'Contact' }
  },
  navigation: {
    es: [ { id: 'hero', label: 'Inicio' }, { id: 'about', label: 'Sobre Mí' }, { id: 'experience', label: 'Experiencia' }, { id: 'skills', label: 'Habilidades' }, { id: 'projects', label: 'Proyectos' }, { id: 'education', label: 'Formación' }, { id: 'contact', label: 'Contacto' } ],
    en: [ { id: 'hero', label: 'Home' }, { id: 'about', label: 'About Me' }, { id: 'experience', label: 'Experience' }, { id: 'skills', label: 'Skills' }, { id: 'projects', label: 'Projects' }, { id: 'education', label: 'Education' }, { id: 'contact', label: 'Contact' } ]
  },
  hero: {
    es: {
      phrases: [ "Ingeniero en Tecnologías Computacionales", "PMP Certificado con 4+ años de experiencia", "Especialista en metodologías ágiles y Scrum", "Líder de equipos multidisciplinarios", "Innovador en IA y desarrollo de software" ],
      summary: "Especializado en liderar equipos multidisciplinarios para entregar productos escalables y centrados en el usuario, optimizando procesos y alineando la tecnología con los objetivos de negocio.",
    },
    en: {
      phrases: [ "Computer Technologies Engineer", "PMP Certified with 4+ years of experience", "Agile and Scrum Methodologies Specialist", "Leader of Multidisciplinary Teams", "Innovator in AI and Software Development" ],
      summary: "Specialized in leading multidisciplinary teams to deliver scalable and user-centric products, optimizing processes and aligning technology with business objectives.",
    }
  },
  about: {
    es: {
      title: 'Sobre Mí',
      subtitle: 'Profesional apasionado por la innovación tecnológica y el liderazgo de equipos de alto rendimiento',
      p1: 'Con más de **4 años de experiencia** en la gestión de proyectos y desarrollo de software, me especializo en liderar equipos multidisciplinarios para entregar productos escalables y centrados en el usuario. Mi **certificación PMP** y conocimiento profundo en metodologías ágiles me permiten optimizar procesos y alinear la tecnología con los objetivos estratégicos del negocio.',
      p2: 'Mi pasión por la innovación se refleja en proyectos como **NORA AI**, donde he demostrado mi capacidad para arquitectar sistemas complejos e integrar tecnologías de vanguardia. Busco constantemente oportunidades para aplicar **inteligencia artificial** y *machine learning* en soluciones empresariales reales, impulsando la transformación digital.',
      stats: [ { value: '4+', label: 'Años de Experiencia' }, { value: '$50K+', label: 'Valor en Proyectos Gestionados' } ], // Changed $250K+ to $50K+ based on new experience data
      traits: [ { icon: Target, title: 'Liderazgo', desc: 'Gestión efectiva de equipos multidisciplinarios', color: 'blue' }, { icon: TrendingUp, title: 'Innovación', desc: 'Implementación de tecnologías emergentes', color: 'green' }, { icon: Users, title: 'Colaboración', desc: 'Facilitación de equipos ágiles', color: 'purple' }, { icon: Zap, title: 'Eficiencia', desc: 'Optimización de procesos complejos', color: 'yellow' } ]
    },
    en: {
      title: 'About Me',
      subtitle: 'Professional passionate about technological innovation and leading high-performing teams',
      p1: 'With over **4 years of experience** in project management and software development, I specialize in leading multidisciplinary teams to deliver scalable and user-centric products. My **PMP certification** and deep knowledge of Agile methodologies allow me to optimize processes and align technology with strategic business objectives.',
      p2: 'My passion for innovation is reflected in projects like **NORA AI**, where I’ve demonstrated my ability to architect complex systems and integrate cutting-edge technologies. I constantly seek opportunities to apply **artificial intelligence** and *machine learning* in real business solutions, driving digital transformation.',
      stats: [ { value: '4+', label: 'Years of Experience' }, { value: '$50K+', label: 'Value in Managed Projects' } ],
      traits: [ { icon: Target, title: 'Leadership', desc: 'Effective management of multidisciplinary teams', color: 'blue' }, { icon: TrendingUp, title: 'Innovation', desc: 'Implementation of emerging technologies', color: 'green' }, { icon: Users, title: 'Collaboration', desc: 'Facilitation of Agile teams', color: 'purple' }, { icon: Zap, title: 'Efficiency', desc: 'Optimization of complex processes', color: 'yellow' } ]
    }
  },
  experience: {
    es: {
      title: 'Experiencia Profesional',
      subtitle: 'Liderando proyectos de alto impacto en entornos empresariales complejos',
      list: [
        {
          title: "Food Solution Manager", company: "Unilever", period: "Noviembre 2023 - Abril 2025",
          achievements: [
            "Optimicé procesos logísticos mediante analítica de datos, usando Python (Pandas, Scikit-learn) para ETL y modelos predictivos de demanda e inventario.",
            "Desarrollé un sistema de BI en Power BI con modelos de datos relacionales (esquema de estrella) y consultas DAX complejas, integrando fuentes vía SQL y APIs REST para soportar la expansión a 3 nuevos canales.",
            "Lideré proyectos comerciales como Product Owner bajo un marco Agile-Scrum, gestionando el backlog y Sprints en Jira para acelerar el time-to-market.",
            "Supervisé la implementación técnica de sistemas de trazabilidad para el cumplimiento de normativas (HACCP, ISO 22000), mejorando la integridad de la cadena de suministro."
          ],
          technologies: ['Python', 'Pandas', 'Scikit-learn', 'Power BI', 'DAX', 'SQL', 'Agile-Scrum', 'Jira']
        },
        {
          title: "PMP", company: "Master Loyalty Group", period: "Septiembre 2022 - Agosto 2023",
          achievements: [
            "Gestioné 5 proyectos B2B de software (hasta $50,000 USD), aplicando el framework PMBOK (PMP) para la planificación (WBS, Risk Register), ejecución y control con MS Project y técnicas EVM.",
            "Lideré equipos de desarrollo (.NET Core, Angular, RxJS) y QA (Selenium), facilitando la colaboración y coordinando estrategias de testing automatizado.",
            "Implementé dashboards en Power BI con conexiones DirectQuery a Azure DevOps y SQL Server, utilizando DAX para visualizar métricas clave como burn-down y velocidad del equipo."
          ],
          technologies: ['PMP', 'PMBOK', '.NET Core', 'Angular', 'RxJS', 'Power BI', 'DAX', 'Azure DevOps', 'SQL Server']
        },
        {
          title: "IT Manager", company: "Wan Hai Lines", period: "Febrero 2021 - Agosto 2022",
          achievements: [
            "Dirigí la integración de sistemas EDI (ANSI X12) con SAP S/4HANA mediante el mapeo de transacciones a IDocs, automatizando y optimizando el flujo de la cadena de suministro.",
            "Construí pipelines de CI/CD con Jenkinsfiles (Groovy) para automatizar el ciclo de vida de aplicaciones .NET, mejorando la estabilidad y frecuencia de los despliegues.",
            "Administré la infraestructura de red con switches Cisco Catalyst (VLANs, ACLs) y UniFi Controller, optimizando la cobertura y el rendimiento inalámbrico.",
            "Gestioné la seguridad perimetral con firewalls FortiGate, configurando VPNs IPsec y políticas de prevención de intrusiones (IPS) para proteger los activos de la red."
          ],
          technologies: ['EDI', 'SAP S/4HANA', 'Jenkins', 'CI/CD', 'Cisco Catalyst', 'FortiGate', 'VPNs']
        },
      ]
    },
    en: {
      title: 'Professional Experience',
      subtitle: 'Leading high-impact projects in complex business environments',
      list: [
        {
          title: "Food Solution Manager", company: "Unilever", period: "November 2023 - April 2025",
          achievements: [
            "Optimized logistics processes through data analytics using Python (Pandas, Scikit-learn) for ETL and predictive models of demand and inventory.",
            "Developed a Business Intelligence system in Power BI with relational data models (star schema) and complex DAX queries, integrating data sources via SQL and REST APIs to support expansion into three new channels.",
            "Led commercial projects as Product Owner within an Agile-Scrum framework, managing the backlog and Sprints in Jira to accelerate time-to-market.",
            "Supervised the technical implementation of traceability systems to meet regulatory standards (HACCP, ISO 22000), improving supply chain integrity."
          ],
          technologies: ['Python', 'Pandas', 'Scikit-learn', 'Power BI', 'DAX', 'SQL', 'Agile-Scrum', 'Jira']
        },
        {
          title: "PMP", company: "Master Loyalty Group", period: "September 2022 - August 2023",
          achievements: [
            "Managed five B2B software projects (up to $50,000 USD) applying the PMBOK (PMP) framework for planning (WBS, Risk Register), execution, and control using MS Project and EVM techniques.",
            "Led development teams (.NET Core, Angular, RxJS) and QA teams (Selenium), fostering collaboration and coordinating automated testing strategies.",
            "Implemented Power BI dashboards with DirectQuery connections to Azure DevOps and SQL Server, leveraging DAX to visualize key metrics such as burn-down rates and team velocity."
          ],
          technologies: ['PMP', 'PMBOK', '.NET Core', 'Angular', 'RxJS', 'Power BI', 'DAX', 'Azure DevOps', 'SQL Server']
        },
        {
          title: "IT Manager", company: "Wan Hai Lines", period: "February 2021 - August 2022",
          achievements: [
            "Directed the integration of EDI systems (ANSI X12) with SAP S/4HANA by mapping transactions to IDocs, automating and optimizing the supply chain workflow.",
            "Built CI/CD pipelines with Jenkinsfiles (Groovy) to automate the lifecycle of .NET applications, improving deployment stability and frequency.",
            "Administered network infrastructure with Cisco Catalyst switches (VLANs, ACLs) and UniFi Controller, optimizing wireless coverage and performance.",
            "Managed perimeter security with FortiGate firewalls, configuring IPsec VPNs and intrusion prevention policies (IPS) to safeguard network assets."
          ],
          technologies: ['EDI', 'SAP S/4HANA', 'Jenkins', 'CI/CD', 'Cisco Catalyst', 'FortiGate', 'VPNs']
        },
      ]
    }
  },
  skills: {
    es: {
      title: 'Habilidades Técnicas',
      subtitle: 'Tecnologías y herramientas que domino para crear soluciones innovadoras',
      categories: {
        frontend: { title: 'Frontend & Móvil', icon: Code, color: 'blue', skills: ['React', 'Next.js', 'Angular', 'Vue.js', 'Svelte', 'TypeScript', 'JavaScript', 'Swift (UIKit)', 'Kotlin (Jetpack)'] },
        backend: { title: 'Backend & APIs', icon: Database, color: 'green', skills: ['Python', 'Go', 'Rust', 'C#/.NET', 'Java', 'Node.js', 'Django', 'FastAPI', 'GraphQL'] },
        cloud: { title: 'Cloud & DevOps', icon: Cloud, color: 'purple', skills: ['AWS', 'Azure', 'GCP', 'Firebase', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'CI/CD'] },
        data: { title: 'Data & AI', icon: Star, color: 'yellow', skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Pandas', 'Power BI', 'DAX', 'LLM Integration'] },
        management: { title: 'Gestión & Metodologías', icon: Briefcase, color: 'red', skills: ['Scrum', 'Kanban', 'PMBOK', 'Jira', 'Confluence', 'MS Project', 'Asana', 'Lean'] }
      }
    },
    en: {
      title: 'Technical Skills',
      subtitle: 'Technologies and tools I master to create innovative solutions',
      categories: {
        frontend: { title: 'Frontend & Mobile', icon: Code, color: 'blue', skills: ['React', 'Next.js', 'Angular', 'Vue.js', 'Svelte', 'TypeScript', 'JavaScript', 'Swift (UIKit)', 'Kotlin (Jetpack)'] },
        backend: { title: 'Backend & APIs', icon: Database, color: 'green', skills: ['Python', 'Go', 'Rust', 'C#/.NET', 'Java', 'Node.js', 'Django', 'FastAPI', 'GraphQL'] },
        cloud: { title: 'Cloud & DevOps', icon: Cloud, color: 'purple', skills: ['AWS', 'Azure', 'GCP', 'Firebase', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'CI/CD'] },
        data: { title: 'Data & AI', icon: Star, color: 'yellow', skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Pandas', 'Power BI', 'DAX', 'LLM Integration'] },
        management: { title: 'Management & Methodologies', icon: Briefcase, color: 'red', skills: ['Scrum', 'Kanban', 'PMBOK', 'Jira', 'Confluence', 'MS Project', 'Asana', 'Lean'] }
      }
    }
  },
  projects: {
    es: {
      title: 'Proyectos Destacados',
      subtitle: 'Soluciones innovadoras que demuestran mi capacidad técnica y visión de producto',
      featured: {
        title: 'NORA AI', subtitle: 'Asistente Inteligente Multiplataforma',
        description: 'Asistente de IA desarrollado desde cero con arquitectura multiplataforma. Integra LLMs avanzados con un sistema de gestión de contexto dinámico para democratizar el acceso a la inteligencia artificial, demostrando la capacidad de crear **productos completos de IA** desde la conceptualización hasta la monetización.',
        features: [ 'Stack: Next.js + Firebase Serverless', 'Integración con LLMs (GPT-4, Gemini)', 'Autenticación robusta con JWT', 'API de generación de imágenes y video', 'Procesamiento de pagos con Stripe' ],
        tech: ['Next.js', 'Firebase', 'TypeScript', 'GPT-4', 'Gemini', 'Stripe API'],
        buttons: { view: 'Ver Proyecto', code: 'Código' },
        placeholder_text: 'IA Multiplataforma'
      },
      other: [
        {
          title: 'Sistema BI Empresarial', description: 'Sistema completo de Business Intelligence con modelos de datos relacionales y consultas DAX complejas para Master Loyalty Group. Optimización del rendimiento de reportes.',
          tech: ['Power BI', 'DAX', 'SQL Server', 'Python']
        },
        {
          title: 'Soluciones Full-Stack', description: 'Desarrollo de múltiples soluciones web end-to-end para clientes freelance con APIs RESTful de alto rendimiento y despliegue automatizado en cloud.',
          tech: ['React', 'Next.js', 'ASP.NET Core', 'Azure']
        }
      ]
    },
    en: {
      title: 'Featured Projects',
      subtitle: 'Innovative solutions demonstrating my technical capability and product vision',
      featured: {
        title: 'NORA AI', subtitle: 'Multi-platform Intelligent Assistant',
        description: 'AI assistant developed from scratch with a multi-platform architecture. It integrates advanced LLMs with a dynamic context management system to democratize access to artificial intelligence, demonstrating the ability to create **complete AI products** from conceptualization to monetization.',
        features: [ 'Stack: Next.js + Firebase Serverless', 'LLMs Integration (GPT-4, Gemini)', 'Robust authentication with JWT', 'Image and video generation API', 'Payment processing with Stripe' ],
        tech: ['Next.js', 'Firebase', 'TypeScript', 'GPT-4', 'Gemini', 'Stripe API'],
        buttons: { view: 'View Project', code: 'Code' },
        placeholder_text: 'Multi-platform AI'
      }
      ,
      other: [
        {
          title: 'Enterprise BI System', description: 'Complete Business Intelligence system with relational data models and complex DAX queries for Master Loyalty Group. Optimization of report performance.',
          tech: ['Power BI', 'DAX', 'SQL Server', 'Python']
        },
        {
          title: 'Full-Stack Solutions', description: 'Development of multiple end-to-end web solutions for freelance clients with high-performance RESTful APIs and automated cloud deployment.',
          tech: ['React', 'Next.js', 'ASP.NET Core', 'Azure']
        }
      ]
    }
  },
  education: {
    es: {
      title: 'Formación y Certificaciones',
      subtitle: 'Educación sólida en tecnologías computacionales e inteligencia artificial',
      academic: [
        { icon: GraduationCap, title: 'Ingeniería en Tecnologías Computacionales', subtitle: 'Tecnológico de Monterrey', desc: 'Formación integral en desarrollo de software, sistemas de información, gestión de proyectos y tecnologías emergentes con enfoque en soluciones empresariales.' },
        { icon: Star, title: 'Especialización en IA Avanzada', subtitle: 'Tecnológico de Monterrey', desc: 'Especialización avanzada en machine learning, deep learning, procesamiento de lenguaje natural y aplicaciones empresariales de inteligencia artificial y ciencia de datos.' }
      ],
      certifications: {
        title: 'Certificaciones Profesionales',
        list: [ { icon: Award, title: 'PMP', subtitle: 'Project Management Professional', color: 'green' }, { icon: Users, title: 'Scrum Master', subtitle: 'Agile Project Management', color: 'blue' }, { icon: Cloud, title: 'Azure & Cloud', subtitle: 'Cloud Platform Specialist', color: 'purple' } ],
        button: 'Ver Todos los Certificados'
      }
    },
    en: {
      title: 'Education and Certifications',
      subtitle: 'Solid education in computer technologies and artificial intelligence',
      academic: [
        { icon: GraduationCap, title: 'B.S. in Computer Technologies Engineering', subtitle: 'Tecnológico de Monterrey', desc: 'Comprehensive training in software development, information systems, project management, and emerging technologies with a focus on business solutions.' },
        { icon: Star, title: 'Specialization in Advanced AI', subtitle: 'Tecnológico de Monterrey', desc: 'Advanced specialization in machine learning, deep learning, natural language processing, and enterprise applications of artificial intelligence and data science.' }
      ],
      certifications: {
        title: 'Professional Certifications',
        list: [ { icon: Award, title: 'PMP', subtitle: 'Project Management Professional', color: 'green' }, { icon: Users, title: 'Scrum Master', subtitle: 'Agile Project Management', color: 'blue' }, { icon: Cloud, title: 'Azure & Cloud', subtitle: 'Cloud Platform Specialist', color: 'purple' } ],
        button: 'View All Certificates'
      }
    }
  },
  contact: {
    es: {
      title: 'Conectemos',
      subtitle: '¿Interesado en colaborar? Me encantaría conocer tu proyecto',
      info_title: 'Información de Contacto',
      message_title: 'Envíame un Mensaje',
      form_labels: { name: 'Nombre', email: 'Email', subject: 'Asunto', message: 'Mensaje', placeholder: 'Cuéntame sobre tu proyecto o idea...', button: 'Enviar Mensaje' },
      info_list: [
        { icon: Mail, label: 'Email', value: 'carlosaremployment@hotmail.com', href: 'mailto:carlosaremployment@hotmail.com' },
        { icon: Phone, label: 'Teléfono', value: '+52 55 4416 7974', href: 'tel:+525544167974' },
        { icon: Github, label: 'GitHub', value: 'github.com/CArlos12002', href: 'https://github.com/CArlos12002' },
        { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/carlos-anaya-ruiz-732abb249', href: 'https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/' },
        { icon: MapPin, label: 'Ubicación', value: 'Ciudad de México, México', href: null }
      ]
    },
    en: {
      title: 'Let\'s Connect',
      subtitle: 'Interested in collaborating? I would love to hear about your project',
      info_title: 'Contact Information',
      message_title: 'Send Me a Message',
      form_labels: { name: 'Name', email: 'Email', subject: 'Subject', message: 'Message', placeholder: 'Tell me about your project or idea...', button: 'Send Message' },
      info_list: [
        { icon: Mail, label: 'Email', value: 'carlosaremployment@hotmail.com', href: 'mailto:carlosaremployment@hotmail.com' },
        { icon: Phone, label: 'Phone', value: '+52 55 4416 7974', href: 'tel:+525544167974' },
        { icon: Github, label: 'GitHub', value: 'github.com/CArlos12002', href: 'https://github.com/CArlos12002' },
        { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/carlos-anaya-ruiz-732abb249', href: 'https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/' },
        { icon: MapPin, label: 'Location', value: 'Mexico City, Mexico', href: null }
      ]
    }
  },
  footer: {
    es: {
      p1: 'Ingeniero en Tecnologías Computacionales, PMP. Mi enfoque es liderar la innovación y desarrollar soluciones tecnológicas escalables que resuelvan problemas de negocio reales.',
      connect_title: 'Conéctate Conmigo',
      copy: 'Todos los derechos reservados.',
      tech_stack: 'Desarrollado con Next.js, TailwindCSS y un toque de IA.'
    },
    en: {
      p1: 'Computer Technologies Engineer, PMP. My focus is on leading innovation and developing scalable technological solutions that solve real business problems.',
      connect_title: 'Connect With Me',
      copy: 'All rights reserved.',
      tech_stack: 'Developed with Next.js, TailwindCSS, and a touch of AI.'
    }
  },
  chatbot: {
    es: {
      welcome: '¡Hola! 👋 Soy el asistente virtual de Carlos. Pregúntame sobre su experiencia PMP, habilidades en IA o proyectos como NORA AI.',
      title: 'Asistente de Carlos',
      subtitle: 'Pregúntame sobre su perfil',
      placeholder: 'Pregúntame sobre Carlos...',
      default_response: "No tengo información específica sobre eso. Puedes preguntarme sobre su **experiencia**, **habilidades**, el proyecto **NORA AI** o su certificación **PMP**. 😊"
    },
    en: {
      welcome: 'Hello! 👋 I\'m Carlos\'s virtual assistant. Ask me about his PMP experience, AI skills, or projects like NORA AI.',
      title: 'Carlos\'s Assistant',
      subtitle: 'Ask me about his profile',
      placeholder: 'Ask me about Carlos...',
      default_response: "I don't have specific information about that. You can ask me about his **experience**, **skills**, the **NORA AI** project, or his **PMP** certification. 😊"
    }
  }
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  data: (key: keyof typeof portfolioData) => any;
  metadata: any;
}>({
  language: 'es',
  setLanguage: () => {},
  // Using 'es' as the safe default key
  data: (key: keyof typeof portfolioData) => portfolioData[key]?.['es'] || {},
  metadata: portfolioData.metadata['es']
});

const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  const getData = useCallback((key: keyof typeof portfolioData) => {
    // CRITICAL FIX: Use optional chaining ('?.') and a fallback (|| {}) 
    // to handle cases where portfolioData[key] might be undefined 
    // during early rendering stages in Next.js/SSR environments.
    return portfolioData[key]?.[language] || {};
  }, [language]);

  const metadata = useMemo(() => portfolioData.metadata[language], [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, data: getData, metadata }}>
      {children}
    </LanguageContext.Provider>
  );
};


// =================================================================
// 1. ANIMATION COMPONENTS
// =================================================================

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

/**
 * Componente que aplica una animación de entrada al hacer scroll.
 */
const AnimateOnScroll = ({ children, className = '', threshold = 0.1 }: AnimateOnScrollProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // observer.unobserve(entry.target); // Optional: Disconnect after first appearance
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <div ref={ref} className={`${className} transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
      {children}
    </div>
  );
};

interface ParticleBackgroundProps {
  particleCount?: number;
  particleColor?: string;
  lineColor?: string;
  className?: string;
}

class Particle {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;

  constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    // Rebotar en los bordes
    if (this.x + this.size > canvas.width || this.x - this.size < 0) this.directionX = -this.directionX;
    if (this.y + this.size > canvas.height || this.y - this.size < 0) this.directionY = -this.directionY;
    
    // Movimiento
    this.x += this.directionX;
    this.y += this.directionY;
    
    this.draw(ctx);
  }
}

/**
 * Fondo animado con partículas conectadas por líneas.
 * Utiliza memo para optimización.
 */
const ParticleBackground = memo(function ParticleBackground({
  particleCount = 70,
  particleColor = 'rgba(255, 255, 255, 0.2)', // Blanco semi-transparente
  lineColor = 'rgba(120, 80, 255, 0.4)', // Púrpura/Azul semi-transparente
  className = ''
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesArrayRef = useRef<Particle[]>([]);

  const connect = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, particlesArray: Particle[]) => {
    const maxDistanceSq = (canvas.width / 8) * (canvas.height / 8); // Ajuste de la distancia

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < maxDistanceSq) {
          const opacityValue = 1 - (distanceSq / maxDistanceSq);
          
          // Usar un color más vibrante para las líneas con opacidad dinámica
          const rgb = lineColor.match(/\d+/g)?.slice(0, 3).join(',');
          if (rgb) {
            ctx.strokeStyle = `rgba(${rgb}, ${opacityValue * 0.8})`; 
          } else {
            ctx.strokeStyle = `rgba(120, 80, 255, ${opacityValue * 0.8})`;
          }
          
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }, [lineColor]);

  const init = useCallback((canvas: HTMLCanvasElement) => {
    particlesArrayRef.current = [];
    const minSize = 1;
    const maxSize = 3;

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * (maxSize - minSize) + minSize;
      const x = Math.random() * (canvas.width - size * 2) + size;
      const y = Math.random() * (canvas.height - size * 2) + size;
      // Movimiento más lento para un efecto de fondo sutil
      const directionX = (Math.random() * .2) - .1; 
      const directionY = (Math.random() * .2) - .1;
      particlesArrayRef.current.push(new Particle(x, y, directionX, directionY, size, particleColor));
    }
  }, [particleCount, particleColor]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
    particlesArrayRef.current.forEach(p => p.update(ctx, canvas));
    connect(ctx, canvas, particlesArrayRef.current);

    animationRef.current = requestAnimationFrame(animate);
  }, [connect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      const setCanvasDimensions = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init(canvas);
      };
      
      setCanvasDimensions();

      const handleResize = () => {
        setCanvasDimensions();
      };
      window.addEventListener('resize', handleResize);

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [init, animate]);

  return <canvas ref={canvasRef} className={`absolute inset-0 z-0 ${className}`} />;
});

// =================================================================
// 2. LAYOUT COMPONENTS
// =================================================================

/**
 * Navegación principal con estado de scroll, idioma y desplazamiento suave.
 */
const Navigation = memo(function Navigation() {
  const { language, setLanguage, data, metadata } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navItems = data('navigation');
  const contactId = 'contact';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
        
      const sections = navItems.map((item: any) => item.id);
      const currentSection = sections.find((section: string) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // The section is considered active if its top is within the top 150px of the viewport
          return rect.top <= 150 && rect.bottom >= 150; 
        }
        return false;
      });
        
      if (currentSection) {
        setActiveSection(currentSection);
      } else if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
        // Logic to mark Contact when the bottom is reached
        setActiveSection(contactId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <button
          onClick={() => scrollToSection('hero')}
          className="text-3xl font-light text-white hover:text-purple-400 transition-colors tracking-widest"
          style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          Carlos<span className="text-purple-400 text-5xl">.</span>
        </button>

        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item: any) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-light transition-colors relative group ${
                activeSection === item.id
                  ? 'text-purple-400'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {item.label}
              <span className={`absolute bottom-[-5px] left-0 h-[2px] w-full bg-purple-400 transition-all duration-300 transform ${
                activeSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-75'
              }`} />
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-light hover:bg-white/20 transition-all duration-300"
            title={language === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Download CV Button */}
          <button className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-light hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
            <Download className="w-4 h-4 mr-2 inline" />
            {metadata.cv_download}
          </button>
          {/* Contact Button */}
          <button 
            onClick={() => scrollToSection(contactId)}
            className="px-6 py-2 bg-purple-600/80 backdrop-blur-sm border border-purple-500/50 rounded-full text-white font-light hover:bg-purple-600 transition-all duration-300 shadow-md shadow-purple-600/30 hover:shadow-lg hover:shadow-purple-600/50"
          >
            <Mail className="w-4 h-4 mr-2 inline" />
            {metadata.contact_btn}
          </button>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
          <div className="container mx-auto px-6 py-4 space-y-3">
            {navItems.map((item: any) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-3 py-2 rounded-lg text-white font-light hover:bg-white/10 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 space-y-3 border-t border-white/10">
              <button
                onClick={toggleLanguage}
                className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white font-light flex items-center justify-center"
              >
                <Globe className="w-4 h-4 mr-2 inline" />
                {language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              </button>
              <button className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white font-light">
                <Download className="w-4 h-4 mr-2 inline" />
                {metadata.cv_download}
              </button>
              <button 
                onClick={() => scrollToSection(contactId)}
                className="w-full px-6 py-3 bg-purple-600/80 border border-purple-500/50 rounded-full text-white font-light"
              >
                <Mail className="w-4 h-4 mr-2 inline" />
                {metadata.contact_btn}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
});

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

/**
 * ChatBot flotante con funcionalidad de simulación.
 */
const ChatBot = memo(function ChatBot() {
  const { language, data, metadata } = useLanguage();
  const chatbotData = data('chatbot');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: chatbotData.welcome,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      role: 'bot',
      content: chatbotData.welcome,
      timestamp: new Date()
    }]);
  }, [language, chatbotData.welcome]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulación de respuesta del bot
  const simulateBotResponse = (userMsg: string): string => {
    const lowerMsg = userMsg.toLowerCase();
    const isSpanish = language === 'es';

    if (lowerMsg.includes('pmp') || lowerMsg.includes(isSpanish ? 'certificación' : 'certification')) {
      return isSpanish
        ? "Carlos es un **Project Management Professional (PMP)** certificado. Lideró 5 proyectos B2B de software de hasta $50,000 USD, aplicando el framework PMBOK y manejando integraciones con sistemas complejos como SAP S/4HANA."
        : "Carlos is a certified **Project Management Professional (PMP)**. He managed 5 B2B software projects up to $50,000 USD, applying the PMBOK framework and handling complex system integrations like SAP S/4HANA.";
    }
    if (lowerMsg.includes('nora ai') || lowerMsg.includes(isSpanish ? 'inteligencia artificial' : 'artificial intelligence') || lowerMsg.includes('ia') || lowerMsg.includes('ai')) {
      return isSpanish
        ? "**NORA AI** es un proyecto personal donde Carlos fue el desarrollador principal. Es un asistente de IA multiplataforma que integra LLMs avanzados (GPT-4, Gemini), utiliza un stack Next.js + Firebase serverless, y maneja pagos con Stripe. Demuestra su profunda habilidad en IA y arquitectura de sistemas."
        : "**NORA AI** is a personal project where Carlos was the lead developer. It is a multi-platform AI assistant that integrates advanced LLMs (GPT-4, Gemini), uses a Next.js + Firebase serverless stack, and handles payments with Stripe. It showcases his deep skill in AI and system architecture.";
    }
    if (lowerMsg.includes(isSpanish ? 'habilidades' : 'skills') || lowerMsg.includes(isSpanish ? 'tecnologías' : 'technologies')) {
      return isSpanish
        ? "Sus habilidades clave abarcan **Frontend** (React, Next.js, TypeScript), **Backend** (Python, Go, C#/.NET), **Cloud/DevOps** (AWS, Azure, Docker) y **Data/AI** (TensorFlow, PyTorch, Power BI). También es especialista en metodologías **Scrum** y **PMBOK**."
        : "His key skills cover **Frontend** (React, Next.js, TypeScript), **Backend** (Python, Go, C#/.NET), **Cloud/DevOps** (AWS, Azure, Docker) and **Data/AI** (TensorFlow, PyTorch, Power BI). He is also a specialist in **Scrum** and **PMBOK** methodologies.";
    }
    if (lowerMsg.includes(isSpanish ? 'experiencia' : 'experience') || lowerMsg.includes(isSpanish ? 'trabajo' : 'work')) {
      return isSpanish
        ? "Su experiencia se centra en ser **PMP** en Master Loyalty Group, **IT Manager** en Wan Hai Lines, y **Food Solution Manager** en Unilever, además de ser el **Creador Principal** de NORA AI."
        : "His experience focuses on being **PMP** at Master Loyalty Group, **IT Manager** at Wan Hai Lines, and **Food Solution Manager** at Unilever, in addition to being the **Lead Creator** of NORA AI.";
    }
    if (lowerMsg.includes(isSpanish ? 'contacto' : 'contact') || lowerMsg.includes('email') || lowerMsg.includes(isSpanish ? 'teléfono' : 'phone')) {
      return isSpanish
        ? `Puedes contactar a Carlos por correo electrónico: **${metadata.email}** o por teléfono: **${metadata.phone}**.`
        : `You can contact Carlos by email: **${metadata.email}** or by phone: **${metadata.phone}** .`;
    }
    if (lowerMsg.includes('hola') || lowerMsg.includes(isSpanish ? 'qué tal' : 'hello')) {
      return isSpanish
        ? "¡Hola! 😄 Estoy aquí para responder cualquier pregunta que tengas sobre el perfil de Carlos. ¿Necesitas saber sobre su experiencia en gestión de proyectos o sus habilidades técnicas?"
        : "Hello! 😄 I'm here to answer any questions you have about Carlos's profile. Do you need to know about his project management experience or his technical skills?";
    }
    return chatbotData.default_response;
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular latencia de red/procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500));

    const botContent = simulateBotResponse(userMessage.content);

    const botMessage: Message = {
      role: 'bot',
      content: botContent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60]"> {/* Aumentado z-index */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          // Estilos con sombra 3D y borde pulsante
          className={`relative bg-purple-600/80 hover:bg-purple-600 text-white rounded-full p-4 shadow-xl transition-all duration-300 backdrop-blur-sm border border-purple-500/50 group 
            ${!isOpen ? 'animate-bounce-slow shadow-purple-600/70 hover:shadow-purple-600/90' : ''}
          `}
          style={{ 
            boxShadow: isOpen ? '0 0 20px rgba(168, 85, 247, 0.7)' : '0 8px 15px rgba(168, 85, 247, 0.5)' 
          }}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          {/* Borde pulsante */}
          {!isOpen && <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-purple-400 animate-glowing-border" />}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50 flex flex-col transform transition-transform duration-500 ease-out animate-in-from-bottom">
          <div className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white p-4 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-light text-lg" style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {chatbotData.title}
              </h3>
              <p className="text-xs text-purple-100 font-light">{chatbotData.subtitle}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 transition-opacity duration-300 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'bot' && (
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                    <Bot size={16} className="text-purple-400" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-lg transition-transform duration-300 ease-in-out ${
                    message.role === 'user'
                      ? 'bg-purple-600/80 text-white transform hover:scale-[1.02] rounded-br-none'
                      : 'bg-white/10 text-gray-100 border border-white/20 rounded-tl-none transform hover:scale-[1.02]'
                  }`}
                >
                  <p className="text-sm font-light whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-1 opacity-60 font-light text-right">
                    {message.timestamp.toLocaleTimeString(language === 'es' ? 'es-MX' : 'en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center animate-spin-slow">
                  <Bot size={16} className="text-purple-400" />
                </div>
                <div className="bg-white/10 border border-white/20 p-3 rounded-2xl rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-dot-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={chatbotData.placeholder}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 text-sm font-light transition-all duration-300"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-purple-600/80 hover:bg-purple-600 disabled:bg-gray-600 disabled:opacity-50 text-white p-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg hover:scale-105"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

// =================================================================
// 3. SECTION COMPONENTS
// =================================================================

/**
 * Sección de Inicio: Presentación principal.
 */
const HeroSection = memo(function HeroSection() {
  const { data, metadata } = useLanguage();
  const heroData = data('hero');
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const phrases = heroData.phrases;

  // Efecto de máquina de escribir/transición de frases
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentPhrase(prev => (prev + 1) % phrases.length);
        setIsVisible(true);
      }, 700); // Duración de la animación de salida
    }, 4500); // Tiempo total por frase (4500ms)
    return () => clearInterval(interval);
  }, [phrases.length]);

  // Efecto Parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20 md:pt-0">
      <ParticleBackground particleCount={120} className="fixed" /> {/* Fondo fijo para parallax */}
      
      {/* Capa de fondo con Parallax */}
      <div className="absolute inset-0 z-10 transition-transform duration-100" style={{ transform: `translateY(${scrollY * 0.4}px)` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20" />
      </div>

      <div className="relative z-30 container mx-auto px-6 text-center py-20">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll className="mt-8 md:mt-0">
            <div className="mb-8 flex justify-center transform hover:scale-[1.02] transition-transform duration-500 ease-out">
              <div className="relative w-48 h-48 md:w-64 md:h-64 group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full animate-glowing-slow shadow-2xl" />
                <div className="absolute inset-1 bg-black rounded-full overflow-hidden border-4 border-white/20 transition-all duration-500 group-hover:inset-0 group-hover:border-purple-400">
                  <Image
                    src="/images/profile.jpg" // Local path updated
                    alt={metadata.name}
                    fill
                    className="object-cover transition-opacity duration-1000 group-hover:opacity-80"
                    priority
                  />
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-200">
            {/* Reducción de tamaño del título principal */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light text-white mb-8 md:mb-10 tracking-wide transition-all duration-500 hover:tracking-widest" 
                style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              {metadata.name}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-400">
            <div className="h-[100px] md:h-[120px] flex items-center justify-center mb-10">
              {/* Reducción de tamaño de la frase rotativa */}
              <h2
                className={`text-xl md:text-3xl lg:text-4xl font-light text-white/90 leading-tight transition-all duration-700 ease-in-out transform max-w-4xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                {phrases[currentPhrase]}
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-600">
            <p className="text-md md:text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              {heroData.summary}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-800">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
              <button className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-light hover:bg-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-white/10">
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center space-x-3">
                  <Download className="w-5 h-5 group-hover:animate-vibrate" />
                  <span>{metadata.cv_download}</span>
                </span>
              </button>
              
              {/* Botón de Contactar actualizado */}
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-8 py-4 bg-purple-600/80 backdrop-blur-sm border border-purple-500/50 rounded-full text-white font-light hover:bg-purple-600 hover:border-purple-400 transition-all duration-300 overflow-hidden shadow-lg shadow-purple-600/40 hover:shadow-2xl hover:shadow-purple-600/70"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center space-x-3 transform group-hover:scale-[1.02] transition-transform duration-300">
                  <Mail className="w-5 h-5" />
                  <span>{metadata.contact_btn} Ahora</span>
                </span>
              </button>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-1000">
            <div className="flex items-center justify-center space-x-8 text-white/60">
              <a href={`mailto:${metadata.email}`} 
                  className="hover:text-purple-400 transition-colors duration-300 transform hover:scale-125">
                <Mail size={24} />
              </a>
              <a href={metadata.github} target="_blank" rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors duration-300 transform hover:scale-125">
                <Github size={24} />
              </a>
              {/* Enlace de LinkedIn actualizado */}
              <a href={metadata.linkedin} target="_blank" rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors duration-300 transform hover:scale-125">
                <Linkedin size={24} />
              </a>
              <span className="flex items-center text-sm text-white/80">
                <Phone size={18} className="mr-2 text-purple-400 animate-pulse" />
                {metadata.phone}
              </span>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
});

/**
 * Sección Sobre Mí
 */
const AboutSection = memo(function AboutSection() {
  const { data } = useLanguage();
  const aboutData = data('about');

  return (
    <section id="about" className="py-16 md:py-24 bg-black relative overflow-hidden">
      <ParticleBackground particleCount={50} className="absolute top-0 opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {aboutData.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            {aboutData.subtitle}
          </p>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <AnimateOnScroll className="delay-200">
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: aboutData.p1 }} />
              
              <p className="text-lg text-gray-300 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: aboutData.p2 }} />

              <div className="grid grid-cols-2 gap-6 pt-6">
                {aboutData.stats.map((stat: any, index: number) => (
                  <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 transform transition-transform duration-300 hover:scale-[1.05] hover:shadow-purple-700/50 hover:shadow-2xl">
                    <div className="text-4xl font-light text-purple-400 mb-2 animate-pulse-fast">{stat.value}</div>
                    <div className="text-sm text-gray-400 font-light">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-400">
            <div className="grid grid-cols-2 gap-4">
              {aboutData.traits.map((item: any, index: number) => (
                <div 
                  key={index} 
                  className={`p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 transition-all duration-300 transform hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 hover:shadow-xl shadow-${item.color}-700/50`}
                >
                  <item.icon className={`w-8 h-8 text-${item.color}-400 mb-3 animate-wiggle`} style={{animationDelay: `${index * 0.2}s`}} />
                  <h3 className="font-medium text-white mb-2" style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
});

/**
 * Sección de Experiencia Profesional
 */
const ExperienceSection = memo(function ExperienceSection() {
  const { data } = useLanguage();
  const experienceData = data('experience');
  // Check if data is properly loaded, otherwise fallback to an empty array
  const experiences = experienceData.list || [];
  const [activeExperience, setActiveExperience] = useState(0);
    
  return (
    <section id="experience" className="relative py-16 md:py-24 bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {experienceData.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            {experienceData.subtitle}
          </p>
        </AnimateOnScroll>

        {experiences.length > 0 && (
          <div className="max-w-6xl mx-auto">
            {/* Experience Navigation */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {experiences.map((exp: any, index: number) => (
                <AnimateOnScroll key={index} className={`delay-${index * 100}`}>
                  <button
                    onClick={() => setActiveExperience(index)}
                    className={`w-full p-4 rounded-2xl transition-all duration-300 border text-left transform hover:-translate-y-1 hover:shadow-xl ${
                      activeExperience === index  
                        ? 'border-purple-500/50 bg-purple-900/30 scale-[1.03] shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                        : 'border-white/20 bg-white/10 hover:bg-white/15'
                    }`}
                  >
                    <h3 className={`font-medium mb-1 text-lg transition-colors duration-300 ${
                      activeExperience === index ? 'text-white' : 'text-gray-300'
                    }`} style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {exp.company}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 ${
                      activeExperience === index ? 'text-purple-300' : 'text-gray-400'
                    }`}>
                      {exp.title}
                    </p>
                  </button>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Active Experience Details */}
            <AnimateOnScroll key={activeExperience}> {/* Key para forzar re-animación */}
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/20 transition-all duration-700 shadow-2xl shadow-white/5">
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-light text-white mb-2 transition-transform duration-500 hover:scale-[1.01]" 
                      style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {experiences[activeExperience].title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-gray-300">
                    <span className="flex items-center text-sm p-1 px-3 bg-purple-600/20 rounded-full border border-purple-400/30">
                      <Briefcase className="w-4 h-4 mr-2 text-purple-400" />
                      {experiences[activeExperience].company}
                    </span>
                    <span className="flex items-center text-sm p-1 px-3 bg-white/10 rounded-full border border-white/20">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {experiences[activeExperience].period}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xl font-medium text-white mb-4 flex items-center" 
                        style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      <Target className="w-5 h-5 mr-3 text-purple-400 animate-pulse-slow" />
                      {data('language') === 'es' ? 'Logros Principales' : 'Key Achievements'}
                    </h4>
                    <div className="space-y-3">
                      {experiences[activeExperience].achievements.map((achievement: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3 group hover:bg-white/5 p-2 rounded-lg transition-colors duration-200">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2.5 flex-shrink-0 animate-dot-pulsate" 
                              style={{animationDelay: `${index * 0.1}s`}} />
                          <span className="text-gray-300 font-light text-sm leading-relaxed transition-transform duration-300 group-hover:text-white">
                            {achievement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-medium text-white mb-4 flex items-center" 
                        style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      <Code className="w-5 h-5 mr-3 text-blue-400 animate-spin-slow" />
                      {data('language') === 'es' ? 'Tecnologías Utilizadas' : 'Technologies Used'}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {experiences[activeExperience].technologies.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-gray-300 text-sm font-light hover:bg-purple-600/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        )}
      </div>
    </section>
  );
});

/**
 * Sección de Habilidades Técnicas
 */
const SkillsSection = memo(function SkillsSection() {
  const { data } = useLanguage();
  const skillData = data('skills');
  const skillCategories = skillData.categories;
  const initialCategoryKey = skillCategories ? Object.keys(skillCategories)[0] : 'frontend';
  const [activeSkillCategory, setActiveSkillCategory] = useState(initialCategoryKey);
    
  const activeCategoryData = useMemo(() => {
    // Check if skillCategories and activeSkillCategory exist before access
    if (skillCategories && activeSkillCategory) {
      return skillCategories[activeSkillCategory as keyof typeof skillCategories];
    }
    // Fallback to an empty structure to prevent crashes
    return { title: 'Loading...', subtitle: '', categories: {}, skills: [], color: 'gray' };
  }, [activeSkillCategory, skillCategories]);

  return (
    <section id="skills" className="py-16 md:py-24 bg-black relative overflow-hidden">
      <ParticleBackground particleCount={40} className="absolute bottom-0 opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {skillData.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            {skillData.subtitle}
          </p>
        </AnimateOnScroll>

        {skillCategories && (
          <div className="max-w-6xl mx-auto">
            {/* Skill Category Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-12 max-w-5xl mx-auto">
              {Object.entries(skillCategories).map(([key, category], index) => {
                // Type assertion for the category object to resolve 'unknown' type error
                const cat = category as SkillCategory;

                return (
                  <AnimateOnScroll key={key} className={`delay-${index * 100}`}>
                    <button
                      onClick={() => setActiveSkillCategory(key)}
                      className={`w-full p-4 rounded-2xl transition-all duration-300 border hover:-translate-y-1 transform hover:shadow-xl ${
                        activeSkillCategory === key  
                          ? 'border-purple-500/50 bg-purple-900/30 scale-[1.02] shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                          : 'border-white/20 bg-white/10 hover:bg-white/15'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <cat.icon className={`w-7 h-7 transition-all duration-500 ${
                          activeSkillCategory === key ? `text-${cat.color}-400 opacity-100 animate-spin-hover` : 'text-white/80 opacity-80'
                        }`} />
                        <span className={`text-xs font-light transition-colors duration-500 ${
                          activeSkillCategory === key ? 'text-white' : 'text-gray-400'
                        }`}>
                          {cat.title}
                        </span>
                      </div>
                    </button>
                  </AnimateOnScroll>
                );
              })}
            </div>

            {/* Active Skills Display */}
            <AnimateOnScroll key={activeSkillCategory}> {/* Key para re-animar */}
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/20 transition-all duration-500 max-w-5xl mx-auto shadow-2xl shadow-white/5">
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-light text-white mb-4" 
                      style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {activeCategoryData.title}
                  </h3>
                  <p className="text-gray-300 font-light">
                    {data('language') === 'es' ? 'Tecnologías especializadas en ' : 'Specialized technologies in '}
                    {activeCategoryData.title.toLowerCase()}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {activeCategoryData.skills.map((skill: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-300 transform hover:translate-x-1 hover:shadow-lg hover:shadow-purple-700/20"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className={`w-3 h-3 bg-${activeCategoryData.color}-400 rounded-full flex-shrink-0 animate-dot-pulsate`} />
                      <span className="text-gray-300 font-light text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        )}
      </div>
    </section>
  );
});

/**
 * Sección de Proyectos
 */
const ProjectsSection = memo(function ProjectsSection() {
  const { data } = useLanguage();
  const projectData = data('projects');
  const featured = projectData.featured || {};
  const other = projectData.other || [];

  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [cardStyle, setCardStyle] = useState({});

  // Efecto de inclinación 3D avanzado al pasar el mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const rotateX = (y / rect.height - 0.5) * -8; // Rotación más pronunciada
    const rotateY = (x / rect.width - 0.5) * 8; // Rotación más pronunciada
    const shadowX = (x / rect.width - 0.5) * 20;
    const shadowY = (y / rect.height - 0.5) * 20;

    setCardStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: 'transform 0.1s ease-out',
      boxShadow: `${shadowX}px ${shadowY}px 50px rgba(168, 85, 247, 0.7)` // Sombra dinámica
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -999, y: -999 });
    setCardStyle({
      transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-in-out',
      boxShadow: 'none'
    });
  };

  return (
    <section id="projects" className="py-16 md:py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {projectData.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            {projectData.subtitle}
          </p>
        </AnimateOnScroll>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* NORA AI - Featured Project with 3D effect */}
          {featured.title && (
            <AnimateOnScroll>
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={cardStyle}
                className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/20 transition-all duration-500 shadow-lg overflow-hidden will-change-transform"
              >
                {/* Efecto de luz radial con posición de mouse */}
                <div
                  className="absolute rounded-full bg-[radial-gradient(circle_farthest-side,rgba(168,85,247,0.3),transparent)] w-96 h-96 pointer-events-none transition-opacity duration-500"
                  style={{ top: mousePos.y, left: mousePos.x, transform: 'translate(-50%, -50%)', opacity: mousePos.x !== -999 ? 1 : 0 }}
                />
                
                <div className="relative z-10">
                  <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center animate-spin-slow">
                          <Star className="w-7 h-7 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-3xl md:text-4xl font-light text-white" 
                              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                            {featured.title}
                          </h3>
                          <p className="text-purple-300 font-light">{featured.subtitle}</p>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: featured.description }} />

                      <div className="space-y-3 mb-6">
                        {(featured.features || []).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center space-x-3 group hover:translate-x-1 transition-transform duration-200">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-dot-pulsate" 
                                 style={{animationDelay: `${index * 0.2}s`}} />
                            <span className="text-gray-300 font-light text-sm group-hover:text-white">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {(featured.tech || []).map((tech: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-sm font-light hover:scale-105 transition-transform"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <button className="flex items-center px-6 py-3 bg-purple-600/80 backdrop-blur-sm border border-purple-500/50 rounded-full text-white font-light hover:bg-purple-600 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-purple-600/50">
                          <ExternalLink className="w-4 h-4 mr-2 animate-wiggle-small" />
                          {featured.buttons?.view}
                        </button>
                        <button className="flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-light hover:bg-white/20 transition-all duration-300 hover:shadow-md">
                          <Github className="w-4 h-4 mr-2" />
                          {featured.buttons?.code}
                        </button>
                      </div>
                    </div>

                    <div className="relative transform transition-transform duration-500 group-hover:scale-[1.05] group-hover:rotate-1">
                      <div className="w-full h-80 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl overflow-hidden relative shadow-2xl shadow-purple-900/80">
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Star className="w-16 h-16 mx-auto mb-4 animate-float" />
                            <h4 className="text-xl font-light" style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                              {featured.placeholder_text}
                            </h4>
                            <p className="text-sm text-purple-100 mt-2">Web • iOS • Android • macOS • Windows</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          )}

          {/* Other Projects */}
          <div className="grid md:grid-cols-2 gap-8">
            {other.map((item: any, index: number) => (
              <AnimateOnScroll key={index} className={`delay-${(index + 1) * 200}`}>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-xl shadow-green-700/20">
                  <div className="h-32 bg-gradient-to-br from-green-500/70 to-blue-600/70 rounded-xl mb-6 relative overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-light text-xl" style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {item.title}
                      </h4>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 font-light text-sm mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {(item.tech || []).map((tech: string, techIndex: number) => (
                      <span key={techIndex} className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs hover:scale-105 transition-transform">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

/**
 * Sección de Formación Académica y Certificaciones
 */
const EducationSection = memo(function EducationSection() {
  const { data } = useLanguage();
  const educationData = data('education');
  const academic = educationData.academic || [];
  const certifications = educationData.certifications || {};
  const certificationList = certifications.list || [];

  return (
    <section id="education" className="py-16 md:py-24 bg-black relative overflow-hidden">
      <ParticleBackground particleCount={30} className="absolute top-1/2 opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {educationData.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            {educationData.subtitle}
          </p>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {academic.map((item: any, index: number) => (
            <AnimateOnScroll key={index} className={`delay-${(index + 1) * 200}`}>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-xl shadow-blue-700/20 transform hover:scale-[1.02]">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 animate-spin-hover-slow">
                    <item.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-white" 
                        style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-blue-300 font-light">{item.subtitle}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-300 font-light text-sm leading-relaxed border-t border-white/10 pt-4">
                    {item.desc}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Certifications */}
        {certifications.title && (
          <AnimateOnScroll className="delay-600">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-light text-white mb-8 border-b border-white/10 inline-block pb-2" 
                  style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {certifications.title}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {certificationList.map((cert: any, index: number) => (
                <div key={index} className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl shadow-white/10 text-center transform hover:-translate-y-1 delay-${index * 100}`}>
                  <div className={`w-16 h-16 bg-${cert.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float-small`}>
                    <cert.icon className={`w-8 h-8 text-${cert.color}-400`} />
                  </div>
                  <h4 className="font-light text-white mb-2 text-lg" style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    {cert.title}
                  </h4>
                  <p className="text-sm text-gray-400 font-light">{cert.subtitle}</p>
                  <p className={`text-xs text-${cert.color}-400 font-light mt-2 animate-pulse`}>
                    {data('language') === 'es' ? 'Certificado Activo' : 'Active Certificate'}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="https://drive.google.com/drive/folders/1wanG6pMmIIlwEir_5bZv4bbMYOQlxuHz?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-light hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-xl hover:shadow-white/10"
              >
                <ExternalLink className="w-4 h-4 mr-3 animate-wiggle-small" />
                {certifications.button}
              </a>
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
});

/**
 * Sección de Contacto con Formulario
 */
const ContactSection = memo(function ContactSection() {
  const { data } = useLanguage();
  const contactData = data('contact');
  const infoList = contactData.info_list || [];
  const formLabels = contactData.form_labels || {};

  return (
    <section id="contact" className="py-16 md:py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {contactData.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            {contactData.subtitle}
          </p>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <AnimateOnScroll className="delay-200">
            <div className="space-y-8">
              <h3 className="text-2xl font-light text-white mb-6 border-b border-white/10 pb-2" 
                  style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {contactData.info_title}
              </h3>
              
              <div className="space-y-6">
                {infoList.map((contact: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-700/20 transform hover:translate-x-1">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center animate-pulse-slow">
                      <contact.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-light text-white text-lg" style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {contact.label}
                      </p>
                      {contact.href ? (
                        <a href={contact.href} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 font-light text-sm">
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-gray-300 font-light text-sm">{contact.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-400">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl shadow-white/5">
              <h3 className="text-2xl font-light text-white mb-6 border-b border-white/10 pb-2" 
                  style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {contactData.message_title}
              </h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2">{formLabels.name}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 font-light transition-all duration-300 hover:border-purple-400/50"
                      placeholder={formLabels.name === 'Nombre' ? 'Tu nombre' : 'Your name'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2">{formLabels.email}</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 font-light transition-all duration-300 hover:border-purple-400/50"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-2">{formLabels.subject}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 font-light transition-all duration-300 hover:border-purple-400/50"
                    placeholder={formLabels.subject === 'Asunto' ? 'Asunto del mensaje' : 'Subject of the message'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-2">{formLabels.message}</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 font-light resize-none transition-all duration-300 hover:border-purple-400/50"
                    placeholder={formLabels.placeholder}
                  />
                </div>
                
                {/* Botón de Enviar con color y sombra actualizados */}
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-purple-600/80 backdrop-blur-sm border border-purple-500/50 rounded-full text-white font-light hover:bg-purple-600 hover:border-purple-400 transition-all duration-300 shadow-xl shadow-purple-600/40 hover:shadow-2xl hover:shadow-purple-600/70 transform hover:scale-[1.01] flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2 inline" />
                  {formLabels.button}
                </button>
              </form>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
});

/**
 * Pie de página: simplificado según la solicitud.
 */
const Footer = memo(function Footer() {
  const { data, metadata } = useLanguage();
  const footerData = data('footer');

  return (
    <footer className="py-16 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8"> {/* Simplificado a 2 columnas */}
          <div>
            <h3 className="text-3xl font-light text-white mb-4 tracking-wider" 
                style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              {metadata.name}
            </h3>
            <p className="text-gray-400 font-light leading-relaxed max-w-md">
              {footerData.p1}
            </p>
          </div>
          
          {/* Columna de Contacto - Mantenida y estilizada */}
          <div>
            <h4 className="text-xl font-light text-white mb-4" 
                style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              {footerData.connect_title}
            </h4>
            <div className="space-y-3 text-gray-400 font-light">
              <p className="flex items-center"><Mail size={18} className="mr-3 text-purple-400" />{metadata.email}</p>
              <p className="flex items-center"><Phone size={18} className="mr-3 text-purple-400" />{metadata.phone}</p>
              <p className="flex items-center"><MapPin size={18} className="mr-3 text-purple-400" />{metadata.location}</p>
              
              <div className="flex space-x-6 pt-4">
                <a href={`mailto:${metadata.email}`} className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-125">
                  <Mail size={24} />
                </a>
                <a href={metadata.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-125">
                  <Github size={24} />
                </a>
                <a href={metadata.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-125">
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-gray-500 font-light text-sm">
          <p>&copy; {new Date().getFullYear()} {metadata.name}. {footerData.copy}</p>
          <p className="mt-2">{footerData.tech_stack}</p>
        </div>
      </div>
    </footer>
  );
});

// =================================================================
// 4. MAIN APP & STYLES
// =================================================================

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <ExperienceSection />
          <SkillsSection />
          <ProjectsSection />
          <EducationSection />
          <ContactSection />
        </main>
        <Footer />
        <ChatBot />

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Lastica:wght@300;400;500;600;700&display=swap');

          /* Animaciones base */
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-float { animation: float 4s ease-in-out infinite; }
          
          @keyframes float-small {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          .animate-float-small { animation: float-small 3s ease-in-out infinite; }

          @keyframes glowing-border {
            0% { box-shadow: 0 0 5px rgba(168, 85, 247, 0.5); }
            50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 30px rgba(168, 85, 247, 0.4); }
            100% { box-shadow: 0 0 5px rgba(168, 85, 247, 0.5); }
          }
          .animate-glowing-slow { animation: glowing-border 5s ease-in-out infinite; }
          
          @keyframes pulse-slow {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
          }
          .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }

          @keyframes bounce-slow {
              0%, 20%, 50%, 80%, 100% {
                  transform: translateY(0);
              }
              40% {
                  transform: translateY(-10px);
              }
              60% {
                  transform: translateY(-5px);
              }
          }
          .animate-bounce-slow { animation: bounce-slow 8s ease-out infinite; }
          
          @keyframes dot-bounce {
              0%, 80%, 100% { transform: scale(0); }
              40% { transform: scale(1.0); }
          }
          .animate-dot-bounce div:nth-child(2) { animation-delay: 0.1s; }
          .animate-dot-bounce div:nth-child(3) { animation-delay: 0.2s; }

          @keyframes dot-pulsate {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.4); opacity: 1; }
          }
          .animate-dot-pulsate { animation: dot-pulsate 1.5s ease-in-out infinite; }

          @keyframes text-shadow {
              0% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
              50% { text-shadow: 0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(60, 20, 255, 0.3); }
              100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
          }
          .animate-text-shadow { animation: text-shadow 5s ease-in-out infinite; }

          @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }
          .animate-spin-slow { animation: spin-slow 30s linear infinite; }
          
          @keyframes spin-hover {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }
          .animate-spin-hover:hover { animation: spin-hover 1s linear infinite; }
          
          @keyframes spin-hover-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }
          .animate-spin-hover-slow:hover { animation: spin-hover-slow 4s linear infinite; }
          
          @keyframes wiggle {
              0%, 7% { transform: rotateZ(0); }
              15% { transform: rotateZ(-5deg); }
              20% { transform: rotateZ(2deg); }
              25% { transform: rotateZ(-2deg); }
              30% { transform: rotateZ(1deg); }
              35% { transform: rotateZ(0); }
              100% { transform: rotateZ(0); }
          }
          .animate-wiggle { animation: wiggle 2s linear infinite; }
          
          @keyframes wiggle-small {
              0%, 7% { transform: rotateZ(0); }
              15% { transform: rotateZ(-3deg); }
              20% { transform: rotateZ(1deg); }
              25% { transform: rotateZ(-1deg); }
              30% { transform: rotateZ(0.5deg); }
              35% { transform: rotateZ(0); }
              100% { transform: rotateZ(0); }
          }
          .animate-wiggle-small { animation: wiggle-small 4s linear infinite; }
          
          /* Efecto de borde pulsante para el ChatBot */
          .animate-glowing-border {
              border-radius: 50%;
              animation: glowing 1.5s ease-in-out infinite alternate;
          }

          @keyframes glowing {
              from {
                  box-shadow: 0 0 5px rgba(168, 85, 247, 0.5), 0 0 10px rgba(168, 85, 247, 0.3);
                  opacity: 0.8;
              }
              to {
                  box-shadow: 0 0 10px rgba(168, 85, 247, 0.8), 0 0 20px rgba(168, 85, 247, 0.5);
                  opacity: 1;
              }
          }
          
          /* Estilos base */
          html { scroll-behavior: smooth; }
          body {
            font-family: 'Lastica', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #000;
          }

          /* Estilos para scrollbar personalizado */
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #6b21a8; border-radius: 4px; border: 1px solid #4c1d95; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8b5cf6; }

          /* Clases de delay para AnimateOnScroll */
          .delay-100 { transition-delay: 100ms; }
          .delay-200 { transition-delay: 200ms; }
          .delay-300 { transition-delay: 300ms; }
          .delay-400 { transition-delay: 400ms; }
          .delay-500 { transition-delay: 500ms; }
          .delay-600 { transition-delay: 600ms; }
          .delay-800 { transition-delay: 800ms; }
          .delay-1000 { transition-delay: 1000ms; }
        `}</style>
      </div>
    </LanguageProvider>
  );
}