'use client';

import React, { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
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
  Bot
} from 'lucide-react';

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
          // Opcional: Desconectar después de la primera aparición para optimizar
          // observer.unobserve(entry.target);
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
 * Navegación principal con estado de scroll y desplazamiento suave.
 */
const Navigation = memo(function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const contactId = 'contact'; // ID del formulario de contacto

  const navItems = useMemo(() => [
    { id: 'hero', label: 'Inicio' },
    { id: 'about', label: 'Sobre Mí' },
    { id: 'experience', label: 'Experiencia' },
    { id: 'skills', label: 'Habilidades' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'education', label: 'Formación' },
    { id: contactId, label: 'Contacto' }
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
        
      const sections = navItems.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // La sección se considera activa si su parte superior está dentro de los 150px superiores de la ventana
          return rect.top <= 150 && rect.bottom >= 150; 
        }
        return false;
      });
        
      if (currentSection) {
        setActiveSection(currentSection);
      } else if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
        // Lógica para marcar Contacto cuando se llega al fondo
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
          {navItems.map((item) => (
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
          <button className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-light hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
            <Download className="w-4 h-4 mr-2 inline" />
            Descargar CV
          </button>
          {/* Botón de Contactar actualizado con nuevo color y funcionalidad */}
          <button 
            onClick={() => scrollToSection(contactId)}
            className="px-6 py-2 bg-purple-600/80 backdrop-blur-sm border border-purple-500/50 rounded-full text-white font-light hover:bg-purple-600 transition-all duration-300 shadow-md shadow-purple-600/30 hover:shadow-lg hover:shadow-purple-600/50"
          >
            <Mail className="w-4 h-4 mr-2 inline" />
            Contactar
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
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-3 py-2 rounded-lg text-white font-light hover:bg-white/10 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 space-y-3 border-t border-white/10">
              <button className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white font-light">
                <Download className="w-4 h-4 mr-2 inline" />
                Descargar CV
              </button>
              <button 
                onClick={() => scrollToSection(contactId)}
                className="w-full px-6 py-3 bg-purple-600/80 border border-purple-500/50 rounded-full text-white font-light"
              >
                <Mail className="w-4 h-4 mr-2 inline" />
                Contactar
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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: '¡Hola! 👋 Soy el asistente virtual de Carlos. Pregúntame sobre su experiencia PMP, habilidades en IA o proyectos como NORA AI.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulación de respuesta del bot
  const simulateBotResponse = (userMsg: string): string => {
    const lowerMsg = userMsg.toLowerCase();

    if (lowerMsg.includes('pmp') || lowerMsg.includes('certificación')) {
      return "Carlos es un **Project Management Professional (PMP)** certificado. Lideró 5 proyectos B2B de software de hasta $250,000 USD, aplicando el framework PMBOK, y manejando integraciones con sistemas complejos como SAP S/4HANA.";
    }
    if (lowerMsg.includes('nora ai') || lowerMsg.includes('inteligencia artificial') || lowerMsg.includes('ia')) {
      return "**NORA AI** es un proyecto personal donde Carlos fue el desarrollador principal. Es un asistente de IA multiplataforma que integra LLMs avanzados (GPT-4, Gemini), utiliza un stack Next.js + Firebase serverless, y maneja pagos con Stripe. Demuestra su profunda habilidad en IA y arquitectura de sistemas.";
    }
    if (lowerMsg.includes('habilidades') || lowerMsg.includes('tecnologías')) {
      return "Sus habilidades clave abarcan **Frontend** (React, Next.js, TypeScript), **Backend** (Python, Go, C#/.NET), **Cloud/DevOps** (AWS, Azure, Docker) y **Data/AI** (TensorFlow, PyTorch, Power BI). También es especialista en metodologías **Scrum** y **PMBOK**.";
    }
    if (lowerMsg.includes('experiencia') || lowerMsg.includes('trabajo')) {
      return "Su experiencia se centra en ser **PMP** en Master Loyalty Group, donde gestionó proyectos de software y optimizó procesos con Python, además de ser el **Creador Principal** de NORA AI y **Consultor Full-Stack Freelance**.";
    }
    if (lowerMsg.includes('contacto') || lowerMsg.includes('email') || lowerMsg.includes('teléfono')) {
      return "Puedes contactar a Carlos por correo electrónico: **carlosaremployment@hotmail.com** o por teléfono: **+52 55 4416 7974**.";
    }
    if (lowerMsg.includes('hola') || lowerMsg.includes('qué tal')) {
        return "¡Hola! 😄 Estoy aquí para responder cualquier pregunta que tengas sobre el perfil de Carlos. ¿Necesitas saber sobre su experiencia en gestión de proyectos o sus habilidades técnicas?";
    }
    return "No tengo información específica sobre eso. Puedes preguntarme sobre su **experiencia**, **habilidades**, el proyecto **NORA AI** o su certificación **PMP**. 😊";
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
                Asistente de Carlos
              </h3>
              <p className="text-xs text-purple-100 font-light">Pregúntame sobre su perfil</p>
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
                    {message.timestamp.toLocaleTimeString('es-MX', { 
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
                placeholder="Pregúntame sobre Carlos..."
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
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const phrases = useMemo(() => [
    "Ingeniero en Tecnologías Computacionales",
    "PMP Certificado con 4+ años de experiencia",
    "Especialista en metodologías ágiles y Scrum",
    "Líder de equipos multidisciplinarios",
    "Innovador en IA y desarrollo de software"
  ], []);

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
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                    alt="Carlos Anaya"
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
              Carlos Anaya Ruiz
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
              Especializado en liderar equipos multidisciplinarios para entregar productos escalables 
              y centrados en el usuario, optimizando procesos y alineando la tecnología con los objetivos de negocio.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-800">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
              <button className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-light hover:bg-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-white/10">
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center space-x-3">
                  <Download className="w-5 h-5 group-hover:animate-vibrate" />
                  <span>Descargar CV</span>
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
                  <span>Contactar Ahora</span>
                </span>
              </button>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-1000">
            <div className="flex items-center justify-center space-x-8 text-white/60">
              <a href="mailto:carlosaremployment@hotmail.com" 
                  className="hover:text-purple-400 transition-colors duration-300 transform hover:scale-125">
                <Mail size={24} />
              </a>
              <a href="https://github.com/CArlos12002" 
                  className="hover:text-purple-400 transition-colors duration-300 transform hover:scale-125">
                <Github size={24} />
              </a>
              {/* Enlace de LinkedIn actualizado */}
              <a href="https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/" target="_blank" rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors duration-300 transform hover:scale-125">
                <Linkedin size={24} />
              </a>
              <span className="flex items-center text-sm text-white/80">
                <Phone size={18} className="mr-2 text-purple-400 animate-pulse" />
                +52 55 4416 7974
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
  return (
    <section id="about" className="py-16 md:py-24 bg-black relative overflow-hidden">
      <ParticleBackground particleCount={50} className="absolute top-0 opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            Sobre Mí
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Profesional apasionado por la innovación tecnológica y el liderazgo de equipos de alto rendimiento
          </p>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <AnimateOnScroll className="delay-200">
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed font-light">
                Con más de **4 años de experiencia** en la gestión de proyectos y desarrollo de software, 
                me especializo en liderar equipos multidisciplinarios para entregar productos escalables 
                y centrados en el usuario. Mi **certificación PMP** y conocimiento profundo en metodologías 
                ágiles me permiten optimizar procesos y alinear la tecnología con los objetivos estratégicos 
                del negocio.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed font-light">
                Mi pasión por la innovación se refleja en proyectos como **NORA AI**, donde he demostrado 
                mi capacidad para arquitectar sistemas complejos e integrar tecnologías de vanguardia. 
                Busco constantemente oportunidades para aplicar **inteligencia artificial** y *machine learning* en soluciones empresariales reales, impulsando la transformación digital.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 transform transition-transform duration-300 hover:scale-[1.05] hover:shadow-purple-700/50 hover:shadow-2xl">
                  <div className="text-4xl font-light text-purple-400 mb-2 animate-pulse-fast">4+</div>
                  <div className="text-sm text-gray-400 font-light">Años de Experiencia</div>
                </div>
                <div className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 transform transition-transform duration-300 hover:scale-[1.05] hover:shadow-blue-700/50 hover:shadow-2xl">
                  <div className="text-4xl font-light text-blue-400 mb-2">$250K+</div>
                  <div className="text-sm text-gray-400 font-light">Valor en Proyectos Gestionados</div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-400">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, title: 'Liderazgo', desc: 'Gestión efectiva de equipos multidisciplinarios', color: 'blue' },
                { icon: TrendingUp, title: 'Innovación', desc: 'Implementación de tecnologías emergentes', color: 'green' },
                { icon: Users, title: 'Colaboración', desc: 'Facilitación de equipos ágiles', color: 'purple' },
                { icon: Zap, title: 'Eficiencia', desc: 'Optimización de procesos complejos', color: 'yellow' }
              ].map((item, index) => (
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
  const [activeExperience, setActiveExperience] = useState(0);
    
  const experiences = [
    {
      title: "Project Management Professional (PMP)",
      company: "Master Loyalty Group",
      period: "Septiembre 2022 - Agosto 2023",
      achievements: [
        "Gestioné 5 proyectos B2B de software hasta $250,000 USD, asegurando la entrega a tiempo y dentro del presupuesto.",
        "Aplicación rigurosa del framework PMBOK (WBS, Risk Register) utilizando MS Project para una planificación detallada.",
        "Liderazgo de equipos de desarrollo Full-Stack (.NET Core, Angular, RxJS) con un enfoque en la calidad del código.",
        "Implementación de dashboards de Business Intelligence en Power BI con conexiones DirectQuery a bases de datos on-premise.",
        "Integración de sistemas EDI (ANSI X12) con el ERP SAP S/4HANA, optimizando la cadena de suministro.",
        "Construcción de pipelines CI/CD automatizados con Jenkins y Groovy, reduciendo el tiempo de despliegue en un 40%.",
        "Administración y monitoreo de infraestructura de red clave con switches Cisco Catalyst.",
        "Optimización de procesos logísticos y rutas con modelos de Machine Learning en Python (Pandas, Scikit-learn)."
      ],
      technologies: ['PMP', 'PMBOK', '.NET Core', 'Angular', 'RxJS', 'Power BI', 'Python', 'Jenkins', 'SAP S/4HANA', 'Cisco']
    },
    {
      title: "Creador y Desarrollador Principal - NORA AI",
      company: "Proyecto Personal (Innovación en IA)",
      period: "2024 - Presente",
      achievements: [
        "Arquitecté y desarrollé desde cero NORA AI, un asistente inteligente con capacidades multiplataforma.",
        "Implementación de un sistema de prompts dinámicos para la integración fluida de Large Language Models (LLMs).",
        "Diseño de un sistema de autenticación robusto y escalable con Firebase Auth y JSON Web Tokens (JWT).",
        "Estructura de base de datos NoSQL optimizada en Firestore para el manejo de conversaciones y perfiles de usuario.",
        "Desarrollo de una API para la generación de contenido multimedia (imágenes y video) utilizando modelos de IA generativa.",
        "Creación de funciones serverless y webhooks para manejar lógica de negocio asíncrona y procesos en segundo plano.",
        "Integración segura con la API de Stripe para el procesamiento de pagos de suscripciones."
      ],
      technologies: ['Next.js', 'Firebase', 'TypeScript', 'GPT-4', 'Gemini', 'Stripe API', 'NoSQL', 'LLMs', 'Serverless']
    },
    {
      title: "Consultor y Desarrollador Full-Stack",
      company: "Proyectos Freelance (Consultoría Tecnológica)",
      period: "2022 - Presente",
      achievements: [
        "Desarrollo de soluciones web y móviles end-to-end para diversos clientes, desde startups hasta PYMEs.",
        "Construcción de APIs RESTful de alto rendimiento utilizando ASP.NET Core y FastAPI (Python).",
        "Creación de interfaces de usuario dinámicas y reactivas con React, Next.js y Vue.js.",
        "Diseño, normalización y gestión de bases de datos relacionales (PostgreSQL) y NoSQL (MongoDB).",
        "Despliegue, monitoreo y mantenimiento de aplicaciones en entornos cloud (Azure, AWS, Vercel).",
        "Integración con servicios de terceros y APIs externas (e.g., sistemas de pago, CRMs, servicios de logística)."
      ],
      technologies: ['React', 'Next.js', 'Vue.js', 'ASP.NET Core', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Azure', 'AWS', 'Docker']
    }
  ];

  return (
    <section id="experience" className="relative py-16 md:py-24 bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            Experiencia Profesional
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Liderando proyectos de alto impacto en entornos empresariales complejos
          </p>
        </AnimateOnScroll>

        <div className="max-w-6xl mx-auto">
          {/* Experience Navigation */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {experiences.map((exp, index) => (
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
                    Logros Principales
                  </h4>
                  <div className="space-y-3">
                    {experiences[activeExperience].achievements.map((achievement, index) => (
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
                    Tecnologías Utilizadas
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {experiences[activeExperience].technologies.map((tech, index) => (
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
      </div>
    </section>
  );
});

/**
 * Sección de Habilidades Técnicas
 */
const SkillsSection = memo(function SkillsSection() {
  const [activeSkillCategory, setActiveSkillCategory] = useState('frontend');
    
  const skillCategories = {
    frontend: {
      title: 'Frontend & Mobile',
      icon: Code,
      skills: ['React', 'Next.js', 'Angular', 'Vue.js', 'Svelte', 'TypeScript', 'JavaScript', 'Swift (UIKit)', 'Kotlin (Jetpack)'],
      color: 'blue'
    },
    backend: {
      title: 'Backend & APIs',
      icon: Database,
      skills: ['Python', 'Go', 'Rust', 'C#/.NET', 'Java', 'Node.js', 'Django', 'FastAPI', 'GraphQL'],
      color: 'green'
    },
    cloud: {
      title: 'Cloud & DevOps',
      icon: Cloud,
      skills: ['AWS', 'Azure', 'GCP', 'Firebase', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'CI/CD'],
      color: 'purple'
    },
    data: {
      title: 'Data & AI',
      icon: Star,
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Pandas', 'Power BI', 'DAX', 'LLM Integration'],
      color: 'yellow'
    },
    management: {
      title: 'Gestión & Metodologías',
      icon: Briefcase,
      skills: ['Scrum', 'Kanban', 'PMBOK', 'Jira', 'Confluence', 'MS Project', 'Asana', 'Lean'],
      color: 'red'
    }
  };

  const activeCategoryData = useMemo(() => skillCategories[activeSkillCategory as keyof typeof skillCategories], [activeSkillCategory]);

  return (
    <section id="skills" className="py-16 md:py-24 bg-black relative overflow-hidden">
      <ParticleBackground particleCount={40} className="absolute bottom-0 opacity-10" />

      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            Habilidades Técnicas
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Tecnologías y herramientas que domino para crear soluciones innovadoras
          </p>
        </AnimateOnScroll>

        <div className="max-w-6xl mx-auto">
          {/* Skill Category Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-12 max-w-5xl mx-auto">
            {Object.entries(skillCategories).map(([key, category], index) => (
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
                    <category.icon className={`w-7 h-7 transition-all duration-500 ${
                      activeSkillCategory === key ? `text-${category.color}-400 opacity-100 animate-spin-hover` : 'text-white/80 opacity-80'
                    }`} />
                    <span className={`text-xs font-light transition-colors duration-500 ${
                      activeSkillCategory === key ? 'text-white' : 'text-gray-400'
                    }`}>
                      {category.title}
                    </span>
                  </div>
                </button>
              </AnimateOnScroll>
            ))}
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
                  Tecnologías especializadas en {activeCategoryData.title.toLowerCase()}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeCategoryData.skills.map((skill, index) => (
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
      </div>
    </section>
  );
});

/**
 * Sección de Proyectos
 */
const ProjectsSection = memo(function ProjectsSection() {
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
            Proyectos Destacados
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Soluciones innovadoras que demuestran mi capacidad técnica y visión de producto
          </p>
        </AnimateOnScroll>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* NORA AI - Featured Project with 3D effect */}
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
                          NORA AI
                        </h3>
                        <p className="text-purple-300 font-light">Asistente Inteligente Multiplataforma</p>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6 font-light leading-relaxed">
                      Asistente de IA desarrollado desde cero con arquitectura multiplataforma. 
                      Integra LLMs avanzados con un sistema de gestión de contexto dinámico para 
                      democratizar el acceso a la inteligencia artificial, demostrando la capacidad 
                      de crear **productos completos de IA** desde la conceptualización hasta la monetización.
                    </p>

                    <div className="space-y-3 mb-6">
                      {[
                        'Stack: Next.js + Firebase Serverless',
                        'Integración con LLMs (GPT-4, Gemini)',
                        'Autenticación robusta con JWT',
                        'API de generación de imágenes y video',
                        'Procesamiento de pagos con Stripe'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3 group hover:translate-x-1 transition-transform duration-200">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-dot-pulsate" 
                               style={{animationDelay: `${index * 0.2}s`}} />
                          <span className="text-gray-300 font-light text-sm group-hover:text-white">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {['Next.js', 'Firebase', 'TypeScript', 'GPT-4', 'Gemini', 'Stripe API'].map((tech, index) => (
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
                        Ver Proyecto
                      </button>
                      <button className="flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-light hover:bg-white/20 transition-all duration-300 hover:shadow-md">
                        <Github className="w-4 h-4 mr-2" />
                        Código
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
                            IA Multiplataforma
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

          {/* Other Projects */}
          <div className="grid md:grid-cols-2 gap-8">
            <AnimateOnScroll className="delay-200">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-xl shadow-green-700/20">
                <div className="h-32 bg-gradient-to-br from-green-500/70 to-blue-600/70 rounded-xl mb-6 relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-light text-xl" style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      Sistema BI Empresarial
                    </h4>
                  </div>
                </div>
                
                <p className="text-gray-300 font-light text-sm mb-4">
                  Sistema completo de Business Intelligence con modelos de datos relacionales 
                  y consultas DAX complejas para Master Loyalty Group. Optimización del rendimiento de reportes.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {['Power BI', 'DAX', 'SQL Server', 'Python'].map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-xs hover:scale-105 transition-transform">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll className="delay-400">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-xl shadow-purple-700/20">
                <div className="h-32 bg-gradient-to-br from-purple-500/70 to-pink-600/70 rounded-xl mb-6 relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-light text-xl" style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      Soluciones Full-Stack
                    </h4>
                  </div>
                </div>
                
                <p className="text-gray-300 font-light text-sm mb-4">
                  Desarrollo de múltiples soluciones web end-to-end para clientes freelance 
                  con APIs RESTful de alto rendimiento y despliegue automatizado en cloud.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'ASP.NET Core', 'Azure'].map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-xs hover:scale-105 transition-transform">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
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
  return (
    <section id="education" className="py-16 md:py-24 bg-black relative overflow-hidden">
      <ParticleBackground particleCount={30} className="absolute top-1/2 opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            Formación y Certificaciones
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Educación sólida en tecnologías computacionales e inteligencia artificial
          </p>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <AnimateOnScroll className="delay-200">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-xl shadow-blue-700/20 transform hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 animate-spin-hover-slow">
                  <GraduationCap className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-light text-white" 
                      style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    Ingeniería en Tecnologías Computacionales
                  </h3>
                  <p className="text-blue-300 font-light">Tecnológico de Monterrey</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-300 font-light text-sm leading-relaxed border-t border-white/10 pt-4">
                  Formación integral en desarrollo de software, sistemas de información, 
                  gestión de proyectos y tecnologías emergentes con enfoque en soluciones empresariales.
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="delay-400">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-xl shadow-purple-700/20 transform hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mr-4 animate-pulse-slow">
                  <Star className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-light text-white" 
                      style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    Especialización en IA Avanzada
                  </h3>
                  <p className="text-purple-300 font-light">Tecnológico de Monterrey</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-300 font-light text-sm leading-relaxed border-t border-white/10 pt-4">
                  Especialización avanzada en machine learning, deep learning, procesamiento de lenguaje 
                  natural y aplicaciones empresariales de inteligencia artificial y ciencia de datos.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Certifications */}
        <AnimateOnScroll className="delay-600">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-light text-white mb-8 border-b border-white/10 inline-block pb-2" 
                style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Certificaciones Profesionales
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Award, title: 'PMP', subtitle: 'Project Management Professional', color: 'green' },
              { icon: Users, title: 'Scrum Master', subtitle: 'Agile Project Management', color: 'blue' },
              { icon: Cloud, title: 'Azure & Cloud', subtitle: 'Cloud Platform Specialist', color: 'purple' }
            ].map((cert, index) => (
              <div key={index} className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl shadow-white/10 text-center transform hover:-translate-y-1 delay-${index * 100}`}>
                <div className={`w-16 h-16 bg-${cert.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float-small`}>
                  <cert.icon className={`w-8 h-8 text-${cert.color}-400`} />
                </div>
                <h4 className="font-light text-white mb-2 text-lg" style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  {cert.title}
                </h4>
                <p className="text-sm text-gray-400 font-light">{cert.subtitle}</p>
                <p className={`text-xs text-${cert.color}-400 font-light mt-2 animate-pulse`}>Certificado Activo</p>
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
              Ver Todos los Certificados
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
});

/**
 * Sección de Contacto con Formulario
 */
const ContactSection = memo(function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 animate-text-shadow" 
              style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            Conectemos
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            ¿Interesado en colaborar? Me encantaría conocer tu proyecto
          </p>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <AnimateOnScroll className="delay-200">
            <div className="space-y-8">
              <h3 className="text-2xl font-light text-white mb-6 border-b border-white/10 pb-2" 
                  style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Información de Contacto
              </h3>
              
              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: 'carlosaremployment@hotmail.com', href: 'mailto:carlosaremployment@hotmail.com' },
                  { icon: Phone, label: 'Teléfono', value: '+52 55 4416 7974', href: 'tel:+525544167974' },
                  { icon: Github, label: 'GitHub', value: 'github.com/CArlos12002', href: 'https://github.com/CArlos12002' },
                  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/carlos-anaya-ruiz-732abb249', href: 'https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/' },
                  { icon: MapPin, label: 'Ubicación', value: 'Ciudad de México, México', href: null }
                ].map((contact, index) => (
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
                Envíame un Mensaje
              </h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2">Nombre</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 font-light transition-all duration-300 hover:border-purple-400/50"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 font-light transition-all duration-300 hover:border-purple-400/50"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-2">Asunto</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 font-light transition-all duration-300 hover:border-purple-400/50"
                    placeholder="Asunto del mensaje"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-300 mb-2">Mensaje</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 font-light resize-none transition-all duration-300 hover:border-purple-400/50"
                    placeholder="Cuéntame sobre tu proyecto o idea..."
                  />
                </div>
                
                {/* Botón de Enviar con color y sombra actualizados */}
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-purple-600/80 backdrop-blur-sm border border-purple-500/50 rounded-full text-white font-light hover:bg-purple-600 hover:border-purple-400 transition-all duration-300 shadow-xl shadow-purple-600/40 hover:shadow-2xl hover:shadow-purple-600/70 transform hover:scale-[1.01] flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2 inline" />
                  Enviar Mensaje
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
  return (
    <footer className="py-16 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8"> {/* Simplificado a 2 columnas */}
          <div>
            <h3 className="text-3xl font-light text-white mb-4 tracking-wider" 
                style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Carlos Anaya
            </h3>
            <p className="text-gray-400 font-light leading-relaxed max-w-md">
              Ingeniero en Tecnologías Computacionales, PMP. Mi enfoque es liderar la innovación y desarrollar 
              soluciones tecnológicas escalables que resuelvan problemas de negocio reales.
            </p>
          </div>
          
          {/* Columna de Contacto - Mantenida y estilizada */}
          <div>
            <h4 className="text-xl font-light text-white mb-4" 
                style={{ fontFamily: 'Lastica, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Conéctate Conmigo
            </h4>
            <div className="space-y-3 text-gray-400 font-light">
              <p className="flex items-center"><Mail size={18} className="mr-3 text-purple-400" />carlosaremployment@hotmail.com</p>
              <p className="flex items-center"><Phone size={18} className="mr-3 text-purple-400" />+52 55 4416 7974</p>
              <p className="flex items-center"><MapPin size={18} className="mr-3 text-purple-400" />Ciudad de México, México</p>
              
              <div className="flex space-x-6 pt-4">
                <a href="mailto:carlosaremployment@hotmail.com" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-125">
                  <Mail size={24} />
                </a>
                <a href="https://github.com/CArlos12002" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-125">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/carlos-anaya-ruiz-732abb249/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors transform hover:scale-125">
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-gray-500 font-light text-sm">
          <p>&copy; {new Date().getFullYear()} Carlos Anaya Ruiz. Todos los derechos reservados.</p>
          <p className="mt-2">Desarrollado con Next.js, TailwindCSS y un toque de IA.</p>
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
  );
}