import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// ----------------------------------------------------------------
// CORE KNOWLEDGE BASE (Updated project value for consistency)
// ----------------------------------------------------------------
const CARLOS_INFO = `
INFORMACIÓN SOBRE CARLOS ANAYA RUIZ:

PERFIL PROFESIONAL:
- Ingeniero en Tecnologías Computacionales con certificación PMP
- Más de 4 años de experiencia en gestión de proyectos y desarrollo de software
- Especializado en metodologías ágiles (Scrum) y gestión de equipos multidisciplinarios
- Enfoque en productos escalables y centrados en el usuario

EXPERIENCIA LABORAL:
- Food Solution Manager en Unilever (Noviembre 2023 - Abril 2025)
  - Optimicé procesos logísticos con Python (Pandas, Scikit-learn) para modelos predictivos.
- PMP en Master Loyalty Group (Septiembre 2022 - Agosto 2023)
  - Gestionó 5 proyectos B2B de software hasta $50,000 USD.
  - Aplicó framework PMBOK para planificación, ejecución y control.
  - Lideró equipos de desarrollo (.NET Core, Angular, RxJS) y QA (Selenium).
  - Implementó dashboards en Power BI con conexiones DirectQuery.
- IT Manager en Wan Hai Lines (Febrero 2021 - Agosto 2022)
  - Dirigió integración de sistemas EDI (ANSI X12) con SAP S/4HANA.
  - Construyó pipelines de CI/CD con Jenkins.
  - Administró infraestructura con switches Cisco y UniFi Controller.

FORMACIÓN ACADÉMICA:
- Ingeniería en Tecnologías Computacionales (2019-2023) - Tecnológico de Monterrey
- Especialización en Inteligencia Artificial Avanzada para Ciencia de Datos (2023-2024) - Tecnológico de Monterrey

HABILIDADES TÉCNICAS:
- Lenguajes: Python, Go, Rust, C#/.NET, Java, TypeScript
- Frontend: React, Next.js, Angular, Vue.js, Svelte
- Backend: Node.js, Django, FastAPI
- Bases de datos: PostgreSQL, MongoDB, MySQL, Redis
- Cloud: AWS, Azure, GCP, Firebase
- DevOps: Docker, Kubernetes, Terraform, Jenkins
- IA/ML: TensorFlow, PyTorch, Scikit-learn, LLM Integration
- Gestión: Jira, MS Project, Scrum, Kanban, PMBOK

PROYECTOS DESTACADOS:
- NORA AI: Asistente de IA multiplataforma desarrollado desde cero
- Consultor Full-Stack para múltiples clientes (2022-presente)

IDIOMAS:
- Español: Nativo (C2)
- Inglés: Profesional (C1)
- Francés: Principiante (A2)

CONTACTO:
- Email: carlosaremployment@hotmail.com
- Teléfono: +52 55 4416 7974
- GitHub: github.com/CArlos12002
- LinkedIn: linkedin.com/in/carlos-anaya-ruiz-732abb249/
- Sitio web: carlos-portafolio-sigma.vercel.app
`;

// ----------------------------------------------------------------
// API POST Handler
// ----------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 1. Input Validation
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Mensaje de usuario no válido o ausente.' }, { status: 400 });
    }

    // 2. Model Initialization and System Prompt Construction
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    INSTRUCCIONES DE ROL:
    Eres **NORA AI**, un asistente inteligente creado por Carlos Anaya Ruiz. Tu única misión es proveer información detallada y profesional sobre el perfil de Carlos, sus proyectos y sus habilidades.

    BASE DE DATOS DE CONOCIMIENTO:
    ${CARLOS_INFO}

    REGLAS ESTRICTAS:
    1.  Responde con la identidad de NORA AI.
    2.  Responde de manera **conversacional, profesional y útil**, siempre enfocándote en las fortalezas de Carlos.
    3.  **SOLO** debes utilizar la información explícitamente proporcionada en la BASE DE DATOS de arriba.
    4.  Si la pregunta requiere información que **NO** está en la base de datos (Ej: opiniones, información personal o externa, proyectos no listados), debes indicar de manera cortés y firme que **no tienes esa información específica** en tu base de conocimiento.
    5.  Si preguntan sobre contacto, cita el Email y Teléfono directamente.

    Pregunta del usuario: ${message}
    `;

    // 3. Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });

  } catch (error) {
    // 4. Robust Error Handling
    console.error('Error en la ruta de la API de chat (NORA AI):', error);

    // Check for specific API key errors (though the framework often handles this)
    if (error instanceof Error && error.message.includes('API key')) {
        return NextResponse.json(
            { error: 'Error de autenticación: la clave API de Gemini no está configurada correctamente.' },
            { status: 500 }
        );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor. No fue posible procesar la solicitud de IA.' },
      { status: 500 }
    );
  }
}