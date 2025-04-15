import { ReactNode } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ClientLayout from './ClientLayout';

interface LayoutProps {
  children: ReactNode;
}

// Server Component - Struktur statis tanpa state atau efek
export default function Layout({ children }: LayoutProps) {
  return (
    <ClientLayout>
      <div className="min-h-screen flex flex-col bg-[#030014] overflow-hidden">
        {/* Navbar is fixed at top */}
        <Navbar />
        
        {/* Main content without page transitions since we're using section-based approach */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </ClientLayout>
  );
} 