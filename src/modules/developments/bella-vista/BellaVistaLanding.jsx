import { useBellaVistaTracking } from './hooks/useBellaVistaTracking';
import './styles/tokens.css';
import './styles/fonts.css';

export default function BellaVistaLanding() {
  useBellaVistaTracking();
  
  return (
    <main className="min-h-screen bg-[#1A1612] text-[#F4EFE6] font-sans">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold">Bella Vista Ocozocoautla</h1>
        <p className="mt-4 text-lg opacity-80">
          Módulo en desarrollo. Tracking activo ✓
        </p>
      </div>
    </main>
  );
}
