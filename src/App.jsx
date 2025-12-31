import React, { useState, useEffect } from 'react';
import Layer1 from './components/Layer1';
import TunnelLayer from './components/TunnelLayer';
import Layer3 from './components/Layer3';
import Layer4 from './components/Layer4';
import Layer5 from './components/Layer5'; 

function App() {
  const [isClient, setIsClient] = useState(false);
  const [currentLayer, setCurrentLayer] = useState('layer1');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sunucu (Vercel Build) tarafında hiçbir şey render edilmezse HATA ÇIKAMAZ.
  if (!isClient) return null;

  return (
    <div className="App">
      {currentLayer === 'layer1' && <Layer1 onUnlock={() => setCurrentLayer('tunnel')} />}
      {currentLayer === 'tunnel' && <TunnelLayer onFinish={() => setCurrentLayer('layer3')} />}
      {currentLayer === 'layer3' && <Layer3 onFinish={() => setCurrentLayer('layer4')} />}
      {currentLayer === 'layer4' && <Layer4 onFinish={() => setCurrentLayer('layer5')} />}
      {currentLayer === 'layer5' && <Layer5 />}
    </div>
  );
}

export default App;