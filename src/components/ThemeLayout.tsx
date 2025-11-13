import React, { useState, ReactNode, useEffect, useRef } from 'react';

// Particle Background Component
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; }[] = [];
    const particleCount = 100;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    };
    
    resizeCanvas();

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x > canvas.width + 5) p.x = -5;
            if (p.x < -5) p.x = canvas.width + 5;
            if (p.y > canvas.height + 5) p.y = -5;
            if (p.y < -5) p.y = canvas.height + 5;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    };

    animate();
    
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 bg-slate-900">
        <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

// Modal Component
interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto text-slate-300" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-800/90 backdrop-blur-md border-b border-slate-700 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 text-2xl leading-none hover:text-white">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};


// Main Layout Component
interface ThemeLayoutProps {
  children: ReactNode;
}

const ThemeLayout: React.FC<ThemeLayoutProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const navLinks = ["About", "Contact", "Guide", "Privacy Policy", "Terms of Service", "DMCA"];

  const getModalContent = (modalName: string) => {
    switch (modalName) {
        case "About": return <p>This Break-Even Point Calculator is a powerful business tool designed to provide instant, accurate financial insights. Built with React and Tailwind CSS by HSINI MOHAMED.</p>;
        case "Contact": return <p>For inquiries, please reach out to <a href="mailto:hsini.web@gmail.com" className="text-sky-400 hover:underline">hsini.web@gmail.com</a> or visit <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">doodax.com</a>.</p>;
        case "Guide": return <p>To use the calculator, enter your total fixed costs, the selling price for a single unit, and the variable costs to produce a single unit. Click 'Calculate' to see your break-even point in units and revenue.</p>;
        case "Privacy Policy": return <p>Your privacy is important to us. This application is a client-side tool, meaning all data you enter is processed in your browser and is never sent to our servers. We do not collect or store any personal or financial information.</p>;
        case "Terms of Service": return <p>This tool is provided for informational purposes only and should not be considered financial advice. By using this calculator, you agree to not hold the creators liable for any decisions made based on its results.</p>;
        case "DMCA": return <p>If you believe that your copyrighted work has been used on this site in a way that constitutes copyright infringement, please notify our copyright agent at <a href="mailto:hsini.web@gmail.com" className="text-sky-400 hover:underline">hsini.web@gmail.com</a>.</p>;
        default: return null;
    }
  };


  return (
    <div className="relative min-h-screen text-slate-300 overflow-hidden">
      <ParticleBackground />
      
      <header className="fixed top-0 left-0 right-0 z-30 bg-slate-900/50 backdrop-blur-md border-b border-white/10">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Break-Even Calculator
          </h1>
          <div className="flex space-x-2 md:space-x-4 flex-wrap justify-center mt-2 md:mt-0">
            {navLinks.map(link => (
                <button key={link} onClick={() => setActiveModal(link)} className="text-sm text-slate-300 hover:text-sky-400 transition-colors px-2 py-1 rounded-md">
                    {link}
                </button>
            ))}
          </div>
        </nav>
      </header>
      
      <div className="pt-20 pb-8"> {/* Padding to offset fixed header */}
        {children}
      </div>
      
      <footer className="relative z-20 mt-auto border-t border-white/10 py-4 bg-slate-900/50 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
            <p className="mb-2">
                <span className="font-semibold text-lg" style={{color: '#FFD700'}}>Powered by HSINI MOHAMED</span> | 
                <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="ml-1 text-sky-400 hover:underline">GitHub</a>
            </p>
            <p>
                <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:underline">doodax.com</a> | 
                <a href="mailto:hsini.web@gmail.com" className="ml-2 hover:underline">hsini.web@gmail.com</a>
            </p>
        </div>
      </footer>

      {activeModal && (
        <Modal title={activeModal} onClose={() => setActiveModal(null)}>
            {getModalContent(activeModal)}
        </Modal>
      )}
    </div>
  );
};

export default ThemeLayout;