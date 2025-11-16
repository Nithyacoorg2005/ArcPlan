import React from 'react';
// Import the type from App.tsx
import { BlueprintItem } from '../App';
import {
  Armchair,
  Bed,
  Book,
  Bot,
  Circle,
  GlassWater, // <-- 1. CHANGED FROM 'Cup'
  Laptop,
  Microwave,
  Monitor,
 
  Plug,
  Refrigerator,
  RefreshCw,
  
  Sofa,
  Utensils,
  Wind,
  Wrench,
  DoorOpen,
} from 'lucide-react';

// Define the component's props, which App.tsx is passing to it
type ResultsScreenProps = {
  onReset: () => void;
  data: BlueprintItem[];
};

// Helper function to get an icon for each object name
// This makes the blueprint look much better
const getIcon = (name: string) => {
  const className = "w-6 h-6 text-white";
  switch (name) {
    case 'chair':
      return <Armchair className={className} />;
    case 'sofa':
      return <Sofa className={className} />;
    case 'bed':
      return <Bed className={className} />;
    case 'tv':
      return <Monitor className={className} />;
    case 'laptop':
      return <Laptop className={className} />;
    case 'outlet': // This is our 'clock' proxy
      return <Plug className={className} />;
    case 'potted plant':
      return <Circle className={className} />; // Using Circle as a simple icon
    case 'bottle':
    case 'cup':
      return <GlassWater className={className} />; // <-- 2. CHANGED FROM 'Cup'
    case 'book':
      return <Book className={className} />;
    case 'dining table':
      return <Utensils className={className} />;
    case 'toilet':
      return <Circle className={className} />;
    
    case 'refrigerator':
      return <Refrigerator className={className} />;
   
    case 'microwave':
      return <Microwave className={className} />;
    default:
      return <Circle className={className} />;
  }
};

export function ResultsScreen({ onReset, data }: ResultsScreenProps) {
  // --- FIX IS HERE ---
  // Ensure 'data' is always an array, even if it's passed as undefined or null
  const safeData = Array.isArray(data) ? data : [];
  // -------------------

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Your Generated Blueprint
        </h2>

        {/* The Blueprint Grid */}
        <div
          className="relative w-full aspect-video bg-blueprint-darker/60 border-2 border-blueprint-cyan/30 rounded-lg shadow-2xl overflow-hidden"
          style={{
            // This creates the grid background
            backgroundImage:
              'linear-gradient(to right, rgba(0, 190, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 190, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Mock Door */}
          <div className="absolute left-4 bottom-4 w-2 h-24 bg-white" />
          <div className="absolute left-4 bottom-4 w-12 h-2 bg-white" />
          <span className="absolute left-8 bottom-28 text-white/70 text-xs font-mono uppercase tracking-widest">
            Door
          </span>

          {/* Mock Window */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-2 bg-white" />
          <span className="absolute top-8 left-1/2 -translate-x-1/2 text-white/70 text-xs font-mono uppercase tracking-widest">
            Window
          </span>

          {/* --- Render REAL Data --- */}
          {/* USE 'safeData' INSTEAD OF 'data' */}
          {safeData.map((item, index) => (
            <div
              key={index}
              className="absolute flex flex-col items-center"
              style={{
                // Position the item based on its x/y coordinates
                // We use 90% and 10% to keep it away from the hard edges
                left: `${item.x * 80 + 10}%`, 
                top: `${item.y * 80 + 10}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {getIcon(item.name)}
              <span className="mt-1 text-white/80 text-xs font-mono uppercase">
                {item.name}
              </span>
            </div>
          ))}
          
          {safeData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/60 text-lg">No objects from your list were detected.</p>
            </div>
          )}

        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="w-full max-w-xs mx-auto mt-8 bg-blueprint-cyan text-blueprint-dark font-bold py-3 px-6 rounded-lg text-lg
                     hover:bg-white transition-all
                     flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Start New Plan
        </button>
      </div>
    </div>
  );
}