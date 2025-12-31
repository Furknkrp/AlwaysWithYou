import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Stars, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- ÖN YÜKLEME (PRELOAD) ---
// Resimlerin tünel başında indirilmesini sağlayarak "anında" görünmesini sağlar.
useTexture.preload('/photos/moon_phases_heart.png');
useTexture.preload('/photos/final_photo.jpg');
useTexture.preload('/photos/moon.jpg');

// --- TAKIMYILDIZI VERİLERİ ---
const constellationData = {
  gemini: {
    stars: [{ x: 0.28, y: 0.10 }, { x: 0.32, y: 0.18 }, { x: 0.38, y: 0.32 }, { x: 0.45, y: 0.45 }, { x: 0.48, y: 0.28 }, { x: 0.15, y: 0.15 }, { x: 0.20, y: 0.23 }, { x: 0.10, y: 0.30 }, { x: 0.25, y: 0.38 }, { x: 0.28, y: 0.52 }],
    lines: [[0, 1], [1, 2], [2, 3], [1, 4], [5, 6], [6, 7], [6, 8], [8, 9], [1, 6]]
  },
  pisces: {
    stars: [{ x: 0.60, y: 0.85 }, { x: 0.65, y: 0.75 }, { x: 0.70, y: 0.65 }, { x: 0.72, y: 0.58 }, { x: 0.70, y: 0.53 }, { x: 0.66, y: 0.50 }, { x: 0.62, y: 0.55 }, { x: 0.64, y: 0.61 }, { x: 0.75, y: 0.80 }, { x: 0.82, y: 0.83 }, { x: 0.88, y: 0.81 }, { x: 0.94, y: 0.78 }, { x: 0.90, y: 0.74 }],
    lines: [[0, 1], [0, 8], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 2], [8, 9], [9, 10], [10, 11], [11, 12]]
  }
};

// --- 1. YÜKLEME EKRANI TASARIMI VE ANİMASYONLARI ---
const loaderStyles = `
  @keyframes fall {
    0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
    20% { opacity: 1; }
    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
  }
  .heart {
    position: fixed;
    top: -50px;
    fill: #ff4d6d;
    pointer-events: none;
    animation: fall linear infinite;
    z-index: 1001;
  }
  .vine-container {
    position: relative;
    width: 300px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .flower {
    filter: drop-shadow(0 0 5px currentColor);
  }
`;

const Flower = ({ x, y, color, scale }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} className="flower" style={{ color }}>
    <circle cx="0" cy="0" r="3" fill="white" />
    {[0, 72, 144, 216, 288].map(deg => (
      <ellipse key={deg} transform={`rotate(${deg})`} cx="6" cy="0" rx="5" ry="3" fill="currentColor" opacity="0.9" />
    ))}
  </g>
);

const Leaf = ({ x, y, rotation }) => (
  <path
    d="M0,0 Q5,-5 10,0 Q5,5 0,0"
    fill="#4a6316"
    transform={`translate(${x},${y}) rotate(${rotation})`}
  />
);

const OverlayLoader = () => {
  const { progress } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const hearts = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      duration: Math.random() * 3 + 3 + 's',
      delay: Math.random() * 5 + 's',
      size: Math.random() * 15 + 10 + 'px'
    }));
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#050505', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      color: 'white', fontFamily: 'sans-serif', overflow: 'hidden'
    }}>
      <style>{loaderStyles}</style>

      {/* Düşen Kalpler */}
      {hearts.map(h => (
        <svg key={h.id} className="heart" style={{ left: h.left, animationDuration: h.duration, animationDelay: h.delay, width: h.size }} viewBox="0 0 32 32">
          <path d="M16 28.5s-12-7.2-12-14.5c0-4 3.2-7.2 7.2-7.2 2.3 0 4.4 1.1 5.8 2.8 1.4-1.7 3.5-2.8 5.8-2.8 4 0 7.2 3.2 7.2 7.2 0 7.3-12 14.5-12 14.5z" />
        </svg>
      ))}

      <div className="vine-container">
        <svg style={{ position: 'absolute', width: '120%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 300 40">
          <path d="M0,25 Q50,10 100,25 T200,25 T300,25" fill="none" stroke="#6b8e23" strokeWidth="3" strokeLinecap="round" />
          <Flower x={20} y={15} color="#ffb7ff" scale={0.8} />
          <Flower x={80} y={28} color="#90e0ef" scale={0.6} />
          <Flower x={160} y={12} color="#ffd166" scale={0.7} />
          <Flower x={240} y={22} color="#ff85a1" scale={0.9} />
          <Leaf x={50} y={15} rotation={45} />
          <Leaf x={120} y={25} rotation={-30} />
          <Leaf x={210} y={18} rotation={10} />
        </svg>

        <div style={{
          width: '250px', height: '6px', background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(107, 142, 35, 0.3)'
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, #6b8e23, #b5e48c)',
            boxShadow: '0 0 10px #b5e48c',
            transition: 'width 0.3s ease-out'
          }} />
        </div>
      </div>

      <p style={{ marginTop: '20px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>
        {progress < 100 ? `Evreni'M HAZIRLANIYOR: %${Math.round(progress)}` : 'BAŞLIYORUZ! Sevgili Sevgili`M'}
      </p>
    </div>
  );
};

// --- 2. 3D TÜNEL BİLEŞENLERİ ---

const ShootingStars = () => {
  const count = 150;
  const mesh = useRef();
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        z: (Math.random() - 0.5) * 100,
        speed: Math.random() * 0.6 + 0.3
      });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      p.z += p.speed * (delta * 60);
      if (p.z > 15) p.z = -85;
      const dummy = new THREE.Object3D();
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(0.06, 0.06, 2.5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <boxGeometry args={[0.2, 0.2, 1]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
    </instancedMesh>
  );
};

// TunnelLayer.jsx içinde PhotoCard bileşenini şu şekilde güncelle:
const PhotoCard = ({ url, position }) => {
  // Texture yüklenirken hata oluşursa beyaz bir kare göstererek çökmesini engelleriz
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => setTexture(tex),
      undefined,
      () => console.log(`Resim yüklenemedi: ${url}`)
    );
  }, [url]);

  if (!texture) return null;

  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[2.2, 1.4]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const MoonPassage = ({ position }) => {
  const texture = useTexture('/photos/moon.jpg');
  return (
    <mesh position={position}>
      {/* İsteğin üzerine tekrar Plane'e (düzlem/çember görünümü) çevrildi */}
      <planeGeometry args={[4.66, 4.66]} />
      <meshBasicMaterial map={texture} transparent opacity={1} side={THREE.DoubleSide} />
    </mesh>
  );
};


const Constellation = ({ data, position, scale = 5, opacityRef }) => {
  const lineGeometry = useMemo(() => {
    const points = [];
    const colors = [];
    const colorWhite = new THREE.Color('#ffffff');

    data.lines.forEach(([startIdx, endIdx]) => {
      const start = data.stars[startIdx];
      const end = data.stars[endIdx];
      const vStart = new THREE.Vector3((start.x - 0.5) * scale, (start.y - 0.5) * -scale, 0);
      const vEnd = new THREE.Vector3((end.x - 0.5) * scale, (end.y - 0.5) * -scale, 0);
      const vMid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);

      points.push(vStart, vMid, vMid, vEnd);
      // Çizgileri daha da şeffaf yapıyoruz (0.15 parlaklık)
      colors.push(0, 0, 0, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0, 0, 0);
    });

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [data, scale]);

  const starsRef = useRef();
  const linesRef = useRef();

  useFrame((state) => {
    if (opacityRef.current && starsRef.current) {
      const currentOpacity = opacityRef.current.opacity;
      linesRef.current.material.opacity = currentOpacity * 0.2; // Çizgiler iyice silikleşti

      starsRef.current.children.forEach((group, i) => {
        // Merkez nokta
        group.children[0].material.opacity = currentOpacity;

        // Parlama (Glow) - Çok daha hızlı ve mikro titreme
        const pulse = (Math.sin(state.clock.elapsedTime * 6 + i) + 1) * 0.5;
        group.children[1].material.opacity = currentOpacity * (0.05 + pulse * 0.2);
        group.children[1].scale.setScalar(0.5 + pulse * 0.5);
      });
    }
  });

  return (
    <group position={position}>
      <group ref={starsRef}>
        {data.stars.map((star, i) => (
          <group key={i} position={[(star.x - 0.5) * scale, (star.y - 0.5) * -scale, 0]}>
            {/* 1. MERKEZ: İğne ucu kadar küçük (0.009) */}
            <mesh>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent />
            </mesh>

            {/* 2. PARLAMA: Ayırt edilemeyecek kadar dar (0.025) */}
            <mesh>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
};


const FinalScene = ({ show, stopPoint }) => {
  const heartTexture = useTexture('/photos/moon_phases_heart.png');
  const finalPhotoTexture = useTexture('/photos/final_photo.jpg');

  const heartMat = useRef();
  const finalMat = useRef();

  useFrame((state, delta) => {
    if (show && heartMat.current && finalMat.current) {
      const newOpacity = THREE.MathUtils.lerp(heartMat.current.opacity, 1, 0.1);
      heartMat.current.opacity = newOpacity;
      finalMat.current.opacity = newOpacity;
    }
  });

  return (

    <group position={[0, 0, stopPoint - 4]}>
      {/* Gemini - Sol Üstte (Fotoğraftaki gibi biraz daha yukarıda) */}
      <Constellation
        data={constellationData.gemini}
        position={[-4, 1, -2]}
        scale={6.7}
        opacityRef={heartMat}
      />

      {/* Pisces - Sağ Altta (Fotoğraftaki gibi köşeye yakın) */}
      <Constellation
        data={constellationData.pisces}
        position={[5.3, -1, -2]}
        scale={7}
        opacityRef={heartMat}
      />

      <mesh position={[-1.15, 0, 0]}>
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial ref={heartMat} map={heartTexture} transparent opacity={0} depthTest={false} />
      </mesh>
      <mesh position={[2.07, 0, 0]}>
        <planeGeometry args={[2.5, 2.8]} />
        <meshBasicMaterial ref={finalMat} map={finalPhotoTexture} transparent opacity={0} depthTest={false} />
      </mesh>
    </group>
  );
};

const TunnelGroup = ({ onReachEnd }) => {
  const { camera } = useThree();
  const [showFinal, setShowFinal] = useState(false);
  const hasTriggeredEnd = useRef(false); // Kalbin çıkması için kilit mekanizması

  const totalPhotos = 266;
  const radius = 3.5;
  const photosPerRing = 6;
  const ringHeightSpacing = 2.5;
  const totalRings = Math.ceil(totalPhotos / photosPerRing);
  const tunnelLength = totalRings * ringHeightSpacing;

  const photos = useMemo(() => {
    const temp = [];
    for (let i = 0; i < totalPhotos; i++) {
      const ringIndex = Math.floor(i / photosPerRing);
      const angle = (i % photosPerRing / photosPerRing) * Math.PI * 2;
      temp.push({
        pos: [Math.cos(angle) * radius, Math.sin(angle) * radius, -(ringIndex * ringHeightSpacing)],
        url: `/photos/${i + 1}.jpg`
      });
    }
    return temp;
  }, []);

  const moonPos = -(tunnelLength + 25);
  const stopPoint = moonPos - 10;

  useFrame((state, delta) => {
    if (camera.position.z > stopPoint) {
      camera.position.z -= 0.8 * delta;
      camera.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;

      if (camera.position.z <= moonPos && !showFinal) {
        setShowFinal(true);
      }
    } else {
      camera.position.z = stopPoint;
      // Kamera durduğunda ve daha önce tetiklenmediyse kalbi göster
      if (!hasTriggeredEnd.current) {
        hasTriggeredEnd.current = true;
        onReachEnd();
      }
    }
  });

  return (
    <>
      {photos.map((p, i) => <PhotoCard key={i} position={p.pos} url={p.url} />)}
      <MoonPassage position={[0, 0, moonPos]} />
      <FinalScene show={showFinal} stopPoint={stopPoint} />
      <ShootingStars />
      <Stars radius={100} count={1000} factor={4} fade speed={1} />
    </>
  );
};

// --- 3. ANA KATMAN ---
const TunnelLayer = ({ onFinish }) => {
  const [showHeart, setShowHeart] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false); //  Patlama efekti kontrolü
  const audioRef = useRef(null);

  // Tarayıcı engeline takılmamak için kullanıcı sayfaya tıkladığında 
  // müziğin başladığından emin olan küçük bir fonksiyon
  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Müzik çalma başarısız: Tarayıcı etkileşim bekliyor.");
      });
    }
  };

  return (
    <div
      style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative' }}
      onClick={startMusic} // Sayfanın herhangi bir yerine tıklandığında müzik başlar
    >
      {/* SES DOSYASI */}
      <audio
        ref={audioRef}
        src="/space.mp3"
        autoPlay
        loop
      />

      <OverlayLoader />

      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <TunnelGroup onReachEnd={() => setShowHeart(true)} />
        </Suspense>
      </Canvas>

      {/* ❤️ ÖZELLEŞTİRİLMİŞ SİMLİ KALP VE GEÇİŞ EFEKTİ */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              pointerEvents: isExpanding ? 'none' : 'auto'
            }}
          >
            {/* Patlama Efekti (Işıltı Yayılması) */}
            {isExpanding && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 100, opacity: 1 }} // Tüm ekranı kaplayana kadar büyür
                transition={{ duration: 1.5, ease: "circIn" }}
                onAnimationComplete={onFinish} // Animasyon bitince Layer3'e geçer
                style={{
                  position: 'absolute',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,77,109,1) 0%, rgba(255,200,200,0.5) 50%, rgba(255,255,255,0) 100%)',
                  boxShadow: '0 0 50px 20px #ff4d6d',
                  filter: 'blur(5px)'
                }}
              />
            )}

            {/* Ana Kalp Butonu */}
            {!isExpanding && (
              <motion.button
                key="magical-heart"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.2, 1], // Nabız
                  filter: [
                    'drop-shadow(0 0 10px #ff7c94ff)',
                    'drop-shadow(0 0 30px #ff4d6d)', // Işıldama (Glow)
                    'drop-shadow(0 0 10px #ff4d6d)'
                  ]
                }}
                transition={{
                  opacity: { duration: 1.5 },
                  scale: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
                  filter: { repeat: Infinity, duration: 2, ease: "linear" }
                }}
                onClick={() => setIsExpanding(true)} // Tıklandığında patlama başlar
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '120px',
                  position: 'relative'
                }}
              >
                {/* İçi Boş Kırmızı Simli Görünüm */}
                <span style={{
                  WebkitTextStroke: '3px #ff002fff', // Kırmızı kenar
                  color: 'transparent',
                  textShadow: '0 0 0px rgba(121, 0, 22, 0.8)',
                  display: 'block'
                }}>
                  ♡
                </span>

                {/* Sim Efekti İçin Küçük Parıltılar */}
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ position: 'absolute', top: '10%', left: '20%', fontSize: '20px' }}
                ></motion.div>
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
                  style={{ position: 'absolute', bottom: '20%', right: '10%', fontSize: '20px' }}
                ></motion.div>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TunnelLayer;