import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const CARLOS_INFO = `
INFORMACIÓN SOBRE CARLOS ANAYA RUIZ:

PERFIL PROFESIONAL:
- Ingeniero en Tecnologías Computacionales con certificación PMP
- Más de 4 años de experiencia en gestión de proyectos y desarrollo de software
- Especializado en metodologías ágiles (Scrum) y gestión de equipos multidisciplinarios
- Enfoque en productos escalables y centrados en el usuario

EXPERIENCIA LABORAL:
- PMP en Master Loyalty Group (Septiembre 2022 - Agosto 2023)
- Gestionó 5 proyectos B2B de software hasta $250,000 USD
- Aplicó framework PMBOK para planificación, ejecución y control
- Lideró equipos de desarrollo (.NET Core, Angular, RxJS) y QA (Selenium)
- Implementó dashboards en Power BI con conexiones DirectQuery
- Dirigió integración de sistemas EDI (ANSI X12) con SAP S/4HANA
- Construyó pipelines de CI/CD con Jenkins
- Administró infraestructura con switches Cisco y UniFi Controller
- Optimizó procesos logísticos con Python (Pandas, Scikit-learn)

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
- Sitio web: carloscurriculum.com.mx
`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Eres un asistente inteligente en la página web de Carlos Anaya Ruiz. Tu trabajo es responder preguntas sobre su perfil profesional, experiencia y habilidades de manera conversacional y profesional.

    ${CARLOS_INFO}

    INSTRUCCIONES:
    - Responde SOLO sobre Carlos Anaya Ruiz basándote en la información proporcionada
    - Si te preguntan algo que no está en la información, di que no tienes esa información específica
    - Sé conversacional, profesional y útil
    - Si alguien pregunta sobre contacto o más información, proporciona sus datos de contacto
    - Mantén las respuestas concisas pero informativas
    - Puedes hacer recomendaciones sobre por qué Carlos sería un buen candidato para ciertos roles

    Pregunta del usuario: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });

  } catch (error) {
    console.error('Error en chat API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}