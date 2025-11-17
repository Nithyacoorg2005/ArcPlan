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
  const [blueprintData, setBlueprintData] = useState<BlueprintItem[]>([]);
  // We'll also add a state for errors
  const [errorMessage, setErrorMessage] = useState('');

  // 1. handleUpload now receives a File and contains all the logic
  const handleUpload = async (file: File) => {
    // Immediately switch to the processing screen for a better UX
    setState('processing');
    setErrorMessage(''); // Clear old errors

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 2. The fetch logic is now here in App.tsx
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('File processed:', data.filename);
        
        // 3. Save the data
        setBlueprintData(data.blueprint || []);
        
        // 4. Move to the results screen
        setState('results');

      } else {
        // Handle errors from the server
        console.error('Upload error:', data.error);
        setErrorMessage(data.error || 'An unknown error occurred.');
        setState('upload'); // Go back to upload screen on error
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
      setErrorMessage('Network error: Could not connect to the Python server.');
      setState('upload'); // Go back to upload screen on error
    }
  };

  const handleReset = () => {
    setState('upload');
    setBlueprintData([]);
    setErrorMessage('');
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
        {/* This line will now be correct because handleUpload accepts a 'File' */}
        {state === 'upload' && (
          <UploadScreen onUpload={handleUpload} />
        )}
        
        {/* The ProcessingScreen no longer needs props, it just spins */}
        {state === 'processing' && <ProcessingScreen />}
        
        {state === 'results' && (
          <ResultsScreen onReset={handleReset} data={blueprintData} />
        )}

        {/* Show an error message on the upload screen if something went wrong */}
        {state === 'upload' && errorMessage && (
          <div className="text-center p-4">
            <p className="text-red-400 font-semibold">{errorMessage}</p>
          </div>
        )}
      </main>

      <footer className="border-t border-blueprint-cyan/20 bg-blueprint-darker/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 text-center text-white/40 text-sm">
          <p>Submitted to Arc - Image-to-model tool Hackathon</p>
          <p>Developed by Nithyashree CS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;