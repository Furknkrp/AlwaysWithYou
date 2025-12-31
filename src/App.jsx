import React, { useState, useEffect, lazy, Suspense } from 'react';

const Layer1 = lazy(() => import('./components/Layer1'));
const TunnelLayer = lazy(() => import('./components/TunnelLayer'));
const Layer3 = lazy(() => import('./components/Layer3'));
const Layer4 = lazy(() => import('./components/Layer4'));
const Layer5 = lazy(() => import('./components/Layer5'));

function App() {
  const [currentLayer, setCurrentLayer] = useState('layer1');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ background: 'black', minHeight: '100vh' }} />;
  }

  return (
    <div className="App" suppressHydrationWarning>
      <Suspense fallback={<div style={{ background: 'black', minHeight: '100vh' }} />}>
        {currentLayer === 'layer1' && <Layer1 onUnlock={() => setCurrentLayer('tunnel')} />}
        {currentLayer === 'tunnel' && <TunnelLayer onFinish={() => setCurrentLayer('layer3')} />}
        {currentLayer === 'layer3' && <Layer3 onFinish={() => setCurrentLayer('layer4')} />}
        {currentLayer === 'layer4' && <Layer4 onFinish={() => setCurrentLayer('layer5')} />}
        {currentLayer === 'layer5' && <Layer5 />}
      </Suspense>
    </div>
  );
}

export default App;
