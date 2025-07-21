import { useEffect } from 'react';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#00C48C', '#FFD500', '#4CAF50', '#FFA726'];
    const particles: HTMLElement[] = [];

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'coin-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDelay = Math.random() * 0.5 + 's';
      
      container.appendChild(particle);
      particles.push(particle);
    }

    const cleanup = setTimeout(() => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      onComplete?.();
    }, 1000);

    return () => {
      clearTimeout(cleanup);
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, [trigger, onComplete]);

  return (
    <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50" />
  );
}
