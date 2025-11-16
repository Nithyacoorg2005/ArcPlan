import { useState } from 'react';
import { UploadScreen } from './components/UploadScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { Ruler } from 'lucide-react';

// This is the type for a single blueprint item
export type BlueprintItem = {
  name: string;
  x: number;
  y: number;
};

// Define the App's state
type AppState = 'upload' | 'processing' | 'results';

function App() {
  const [state, setState] = useState<AppState>('upload');
  
  // 1. ADD NEW STATE to hold the real blueprint data
  const [blueprintData, setBlueprintData] = useState<BlueprintItem[]>([]);

  // 2. UPDATE handleUpload to receive the data
  const handleUpload = (data: BlueprintItem[]) => {
    setBlueprintData(data); // <-- Save the data
    setState('processing');
  };

  const handleProcessingComplete = () => {
    setState('results');
  };

  const handleReset = () => {
    setState('upload');
    setBlueprintData([]); // <-- Clear the data on reset
  };

  return (
    <div className="min-h-screen bg-blueprint-dark flex flex-col">
      <header className="border-b border-blueprint-cyan/20 bg-blueprint-darker/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blueprint-cyan rounded-lg">
              <Ruler className="w-6 h-6 text-blueprint-dark" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              ArcPlan
            </h1>
          </div>
          <p className="text-white/60 text-sm">Video-to-Blueprint Converter</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {state === 'upload' && <UploadScreen onUpload={handleUpload} />}
        {state === 'processing' && (
          <ProcessingScreen onComplete={handleProcessingComplete} />
        )}
        
        {/* 3. PASS THE REAL DATA to ResultsScreen */}
        {state === 'results' && (
          <ResultsScreen onReset={handleReset} data={blueprintData} />
        )}
      </main>

      <footer className="border-t border-blueprint-cyan/20 bg-blueprint-darker/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 text-center text-white/40 text-sm">
          <p>Powered by AI Blueprint Technology</p>
        </div>
      </footer>
    </div>
  );
}

export default App;