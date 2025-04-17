import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import FooterWrapper from '@/components/FooterWrapper';
import { NavbarVisibilityProvider } from '@/components/NavbarVisibilityContext';

// Mengoptimalkan loading font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Font display swap untuk UX lebih baik
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

// Client components yang hanya di-load saat dibutuhkan
const Navbar = dynamic(() => import('@/components/Navbar'), {
  loading: () => <div className="h-16 backdrop-blur-md bg-dark-bg/50 fixed top-0 left-0 right-0 z-50"></div>,
});

// Client component untuk layout
const ClientLayout = dynamic(() => import('@/components/ClientLayout'), {
  loading: () => null,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bagusportfolio.com/'),
  title: {
    template: '%s | Bagus - Full Stack Developer',
    default: 'Bagus - Full Stack Developer',
  },
  description: 'Portfolio dari Bagus, seorang Full Stack Developer yang berpengalaman dalam React, Next.js, Laravel, Kotlin dan pengembangan aplikasi modern.',
  keywords: ['developer', 'full stack', 'react', 'next.js', 'laravel', 'portfolio', 'web developer', 'mobile developer'],
  authors: [{ name: 'Bagus' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://www.bagusportfolio.com/',
    title: 'Bagus - Full Stack Developer',
    description: 'Portfolio dari Bagus, seorang Full Stack Developer',
    siteName: 'Bagus Portfolio',
    images: ['/images/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bagus - Full Stack Developer',
    description: 'Portfolio dari Bagus, seorang Full Stack Developer',
    images: ['/images/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#030014',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-dark-bg min-h-screen antialiased">
        <NavbarVisibilityProvider>
          <Navbar />
          <Suspense fallback={
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <ClientLayout>
              {children}
            </ClientLayout>
          </Suspense>
          <FooterWrapper />
        </NavbarVisibilityProvider>
      </body>
    </html>
  );
}
