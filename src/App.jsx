import React, { useState, useEffect } from 'react';
import Layer1 from './components/Layer1';
import TunnelLayer from './components/TunnelLayer';
import Layer3 from './components/Layer3';
import Layer4 from './components/Layer4';
import Layer5 from './components/Layer5'; 

function App() {
  const [currentLayer, setCurrentLayer] = useState('layer1');
  const [hasWindow, setHasWindow] = useState(false);

  // Bu useEffect sadece tarayıcıda (client) çalışır. 
  // Error #418'i %100 bitirir.
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  // Eğer tarayıcı henüz hazır değilse (Vercel Build aşaması), 
  // hiçbir şey render etme (Hydration mismatch'i önler).
  if (!hasWindow) {
    return <div style={{ background: 'black', minHeight: '100vh' }} />;
  }

  return (
    <div className="App" suppressHydrationWarning={true}>
      {currentLayer === 'layer1' && (
        <Layer1 onUnlock={() => setCurrentLayer('tunnel')} />
      )}

      {currentLayer === 'tunnel' && (
        <TunnelLayer onFinish={() => setCurrentLayer('layer3')} />
      )}

      {currentLayer === 'layer3' && (
        <Layer3 onFinish={() => setCurrentLayer('layer4')} />
      )}

      {currentLayer === 'layer4' && (
        <Layer4 onFinish={() => setCurrentLayer('layer5')} />
      )}

      {currentLayer === 'layer5' && (
        <Layer5 />
      )}
    </div>
  );
}

export default App;