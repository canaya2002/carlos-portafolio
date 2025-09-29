import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carlos Anaya Ruiz - Ingeniero en Tecnologías Computacionales',
  description: 'PMP certificado con 4+ años de experiencia en gestión de proyectos y desarrollo de software. Especializado en metodologías ágiles, IA y sistemas escalables.',
  keywords: ['Carlos Anaya', 'Ingeniero', 'Tecnologías Computacionales', 'PMP', 'Scrum', 'Full Stack', 'AI', 'Python', 'React'],
  authors: [{ name: 'Carlos Anaya Ruiz' }],
  creator: 'Carlos Anaya Ruiz',
  openGraph: {
    title: 'Carlos Anaya Ruiz - Ingeniero en Tecnologías Computacionales',
    description: 'PMP certificado con 4+ años de experiencia en gestión de proyectos y desarrollo de software.',
    url: 'https://carloscurriculum.com.mx',
    siteName: 'Carlos Anaya Ruiz - Portfolio',
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carlos Anaya Ruiz - Ingeniero en Tecnologías Computacionales',
    description: 'PMP certificado con 4+ años de experiencia en gestión de proyectos y desarrollo de software.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://carloscurriculum.com.mx" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}