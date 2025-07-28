import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Leaf, 
  Recycle, 
  TreePine,
  Droplets,
  Wind,
  Globe
} from 'lucide-react';

interface RecyclingTipsProps {
  currentMaterial?: string;
}

export function RecyclingTips({ currentMaterial }: RecyclingTipsProps) {
  const tipsData = {
    plastic: {
      icon: <Recycle className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      title: "Plastic Recycling Tips",
      facts: [
        "Plastic bottles can be recycled into new bottles, clothing, or carpets",
        "It takes 450+ years for plastic to decompose naturally", 
        "1 plastic bottle = 1 polar fleece vest when recycled properly",
        "Rinse containers before recycling to avoid contamination"
      ],
      impact: "Recycling 1 ton of plastic saves 2,000 pounds of CO₂"
    },
    metal: {
      icon: <Wind className="w-6 h-6" />,
      color: "from-gray-500 to-gray-600",
      title: "Metal Recycling Tips",
      facts: [
        "Aluminum cans can be recycled infinitely without quality loss",
        "An aluminum can becomes a new can in just 60 days",
        "Steel is the most recycled material in the world",
        "Recycling steel uses 75% less energy than making new steel"
      ],
      impact: "Recycling 1 aluminum can powers a TV for 3 hours"
    },
    glass: {
      icon: <Droplets className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      title: "Glass Recycling Tips",
      facts: [
        "Glass can be recycled endlessly without losing quality",
        "It takes 1 million years for glass to decompose naturally",
        "Recycled glass melts at lower temperatures, saving energy",
        "Different colored glass should be separated when possible"
      ],
      impact: "1 recycled glass bottle saves enough energy to power a laptop for 25 minutes"
    },
    paper: {
      icon: <TreePine className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      title: "Paper Recycling Tips",
      facts: [
        "Paper can be recycled 5-7 times before fibers break down",
        "Recycling 1 ton of paper saves 17 trees",
        "Remove all tape, staples, and plastic before recycling",
        "Wet or food-stained paper cannot be recycled"
      ],
      impact: "Recycling paper uses 60% less energy than making new paper"
    },
    compost: {
      icon: <Leaf className="w-6 h-6" />,
      color: "from-green-600 to-lime-500",
      title: "Composting Tips",
      facts: [
        "Composting reduces methane emissions from landfills",
        "Compost improves soil health and reduces need for fertilizers",
        "Food waste makes up 30% of household waste",
        "Worms can help speed up the composting process"
      ],
      impact: "Composting 1 pound of food waste prevents 0.5 pounds of CO₂"
    }
  };

  const generalTips = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Every Item Counts",
      description: "Your small actions create massive collective impact"
    },
    {
      icon: <Recycle className="w-5 h-5" />,
      title: "Clean Before Recycling",
      description: "Rinse containers to prevent contamination"
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Know Your Local Rules",
      description: "Recycling guidelines vary by location"
    }
  ];

  const activeTips = currentMaterial && tipsData[currentMaterial as keyof typeof tipsData] 
    ? tipsData[currentMaterial as keyof typeof tipsData] 
    : null;

  return (
    <div className="space-y-6">
      {activeTips ? (
        <Card className={`glassmorphic border-dark-border bg-gradient-to-r ${activeTips.color} bg-opacity-10`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${activeTips.color} rounded-full flex items-center justify-center text-white`}>
                {activeTips.icon}
              </div>
              <div>
                <h3 className="font-bold text-text-primary">{activeTips.title}</h3>
                <Badge className="bg-eco-green/20 text-eco-green border-eco-green/30">
                  Material-Specific
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-dark-surface-variant p-4 rounded-xl">
                <h4 className="font-medium mb-3 text-reward-yellow">Environmental Impact</h4>
                <p className="text-sm text-text-secondary">{activeTips.impact}</p>
              </div>

              <div>
                <h4 className="font-medium mb-3">Did You Know?</h4>
                <div className="space-y-2">
                  {activeTips.facts.map((fact, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-eco-green rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-text-secondary">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glassmorphic border-dark-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-eco-green to-reward-yellow rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-dark-bg" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">General Recycling Tips</h3>
                <p className="text-sm text-text-secondary">Essential knowledge for eco-warriors</p>
              </div>
            </div>

            <div className="space-y-4">
              {generalTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-dark-surface-variant rounded-xl">
                  <div className="w-8 h-8 bg-eco-green/20 rounded-full flex items-center justify-center text-eco-green">
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary mb-1">{tip.title}</h4>
                    <p className="text-sm text-text-secondary">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glassmorphic border-dark-border bg-gradient-to-r from-reward-yellow/10 to-eco-green/10">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-reward-yellow to-eco-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-dark-bg" />
            </div>
            <h3 className="font-bold text-text-primary mb-2">Making a Difference</h3>
            <p className="text-sm text-text-secondary mb-4">
              Your recycling efforts contribute to a cleaner planet for future generations
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-dark-surface-variant p-3 rounded-xl">
                <div className="text-lg font-bold text-eco-green">2.5M</div>
                <div className="text-xs text-text-secondary">Tons CO₂ Saved</div>
              </div>
              <div className="bg-dark-surface-variant p-3 rounded-xl">
                <div className="text-lg font-bold text-reward-yellow">45K</div>
                <div className="text-xs text-text-secondary">Trees Planted</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}