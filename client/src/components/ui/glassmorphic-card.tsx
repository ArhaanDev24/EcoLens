import { cn } from "@/lib/utils";
import { Card } from "./card";

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassmorphicCard({ children, className }: GlassmorphicCardProps) {
  return (
    <Card className={cn("glassmorphic", className)}>
      {children}
    </Card>
  );
}
