import React, { useState } from 'react';
import Layer1 from './components/Layer1';
import TunnelLayer from './components/TunnelLayer';
import Layer3 from './components/Layer3';
import Layer4 from './components/Layer4';
import Layer5 from './components/Layer5'; 

function App() {
  // Başlangıç katmanını 'layer1' yapıyoruz. 
  // Test etmek istediğin katmanı buraya yazabilirsin (örn: 'layer4')
  const [currentLayer, setCurrentLayer] = useState('layer1');

  return (
    <div className="App">
      {/* 1. Katman: Giriş ve Şifre Ekranı */}
      {currentLayer === 'layer1' && (
        <Layer1 onUnlock={() => setCurrentLayer('tunnel')} />
      )}

      {/* 2. Katman: Uzay Tüneli ve Fotoğraflar */}
      {currentLayer === 'tunnel' && (
        <TunnelLayer onFinish={() => setCurrentLayer('layer3')} />
      )}

      {/* 3. Katman: Mektup ve Kartpostal */}
      {currentLayer === 'layer3' && (
        <Layer3 onFinish={() => setCurrentLayer('layer4')} />
      )}

      {/* 4. Katman: Yılbaşı Geri Sayımı ve Dev Kalp */}
      {currentLayer === 'layer4' && (
        <Layer4 onFinish={() => setCurrentLayer('layer5')} />
      )}

      {/* 5. Katman: Final Sürprizi */}
      {currentLayer === 'layer5' && (
        <Layer5 />
      )}
    </div>
  );
}

export default App;