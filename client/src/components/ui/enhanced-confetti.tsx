import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  rotationSpeed: number;
}

const colors = ['#00C48C', '#FFD500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

export function EnhancedConfetti({ 
  duration = 3000, 
  intensity = 150,
  onComplete 
}: { 
  duration?: number; 
  intensity?: number;
  onComplete?: () => void;
}) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Create initial confetti pieces
    const initialPieces: ConfettiPiece[] = [];
    for (let i = 0; i < intensity; i++) {
      initialPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 3 + 2,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    setPieces(initialPieces);

    // Animation loop
    const animationFrame = () => {
      setPieces(prev => 
        prev.map(piece => ({
          ...piece,
          x: piece.x + piece.speedX,
          y: piece.y + piece.speedY,
          rotation: piece.rotation + piece.rotationSpeed,
          speedY: piece.speedY + 0.1, // gravity
        })).filter(piece => piece.y < window.innerHeight + 50)
      );
    };

    const intervalId = setInterval(animationFrame, 16);

    // Stop after duration
    const timeoutId = setTimeout(() => {
      setIsActive(false);
      clearInterval(intervalId);
      onComplete?.();
    }, duration);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [duration, intensity, onComplete]);

  if (!isActive && pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute rounded-sm opacity-90"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            transition: 'opacity 0.5s ease-out',
          }}
        />
      ))}
    </div>
  );
}

export function SuccessConfetti({ onComplete }: { onComplete?: () => void }) {
  return (
    <EnhancedConfetti 
      duration={4000} 
      intensity={200} 
      onComplete={onComplete}
    />
  );
}