import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css';

const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  if (!hasMounted) return null;
  return <>{children}</>;
};

// ❄️ KAR TANELERİ BİLEŞENİ
const Snowflakes = React.memo(() => {
  // Hydration hatasını engellemek için mount kontrolü
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const flakes = useMemo(() => {
    // Sadece bileşen mount olduktan sonra (tarayıcıda) kar tanelerini oluşturur
    if (!mounted) return [];
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 5 + 2}px`,
      opacity: Math.random() * 0.8 + 0.3,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 10,
    }));
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      {flakes.map((f) => (
        <motion.div
          key={f.id}
          style={{
            position: 'absolute', background: 'white', borderRadius: '50%',
            left: f.left, width: f.size, height: f.size,
            opacity: f.opacity, boxShadow: '0 0 8px white'
          }}
          animate={{ y: ['-10vh', '110vh'], x: [0, 25, 0] }}
          transition={{ duration: f.duration, repeat: Infinity, ease: "linear", delay: f.delay }}
        />
      ))}
    </div>
  );
});

// 🏔️ EKRAN ALTI KAR BİRİKİNTİLERİ
const SnowAccumulation = React.memo(() => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hills = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 12 }).map((_, i) => ({
      width: 10 + Math.random() * 15,
      height: 17 + Math.random() * 40,
      left: (i * 8) - 10 + (Math.random() * 10),
      borderTopLeftRadius: `${60 + Math.random() * 40}%`,
      borderTopRightRadius: `${60 + Math.random() * 40}%`,
      opacity: 0.7 + Math.random() * 0.2,
    }));
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div style={{ position: 'fixed', bottom: -10, left: 0, width: '100%', height: '100px', pointerEvents: 'none', zIndex: 3, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
      {hills.map((h, i) => (
        <div
          key={i}
          style={{
            background: 'white',
            position: 'absolute',
            width: `${h.width}%`,
            height: `${h.height}px`,
            left: `${h.left}%`,
            borderTopLeftRadius: h.borderTopLeftRadius,
            borderTopRightRadius: h.borderTopRightRadius,
            filter: 'blur(12px)',
            opacity: h.opacity,
            boxShadow: '0 0 20px white',
          }}
        />
      ))}
    </div>
  );
});

const Layer1 = ({ onUnlock }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [trail, setTrail] = useState([]);
  const audioRef = useRef(null);

  const couplePhoto = "/icon.jpeg";
  const musicUrl = "/jingle-bells.mp3";
  const santaImage = "/santa-sleigh.png";

  function handleGlobalMouseMove(event) {
    const newPoint = {
      id: Date.now() + Math.random(),
      x: event.clientX,
      y: event.clientY,
      size: Math.random() * 10 + 15,
      emoji: ['✨', '💖', '❄️', '⭐'][Math.floor(Math.random() * 4)]
    };

    setTrail((prev) => [...prev.slice(-12), newPoint]);
    setTimeout(() => {
      setTrail((prev) => prev.filter(p => p.id !== newPoint.id));
    }, 600);
  }

  const startExperience = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Müzik hatası:", e));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '4haziran') {
      if (audioRef.current) { audioRef.current.pause(); }
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center overflow-hidden"
      onMouseMove={handleGlobalMouseMove}
      style={{
        background: 'radial-gradient(circle at center, #3d0202 0%, #000 100%)',
        position: 'relative',
        cursor: 'default'
      }}
    >
      <audio ref={audioRef} src={musicUrl} loop />

      <AnimatePresence>
        {trail.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 1, scale: 0.5, x: "-50%", y: "-50%" }}
            animate={{ opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', left: point.x, top: point.y,
              pointerEvents: 'none', zIndex: 9999, fontSize: point.size,
              color: '#D4AF37', textShadow: '0 0 10px gold'
            }}
          >
            {point.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <ClientOnly>
        <Snowflakes />
        <SnowAccumulation />
      </ClientOnly>

      {isStarted && (
        <motion.div
          initial={{ x: '-30vw', y: '80vh', rotate: -15 }}
          animate={{ x: '120vw', y: '10vh', rotate: -5 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ position: 'fixed', zIndex: 1, pointerEvents: 'none', opacity: 0.5 }}
        >
          <img src={santaImage} alt="Santa" style={{ width: '180px' }} />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.button
            key="start" onClick={startExperience}
            initial={{ scale: 0 }} animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{ background: 'none', border: 'none', fontSize: '120px', cursor: 'pointer', zIndex: 100, filter: 'drop-shadow(0 0 20px #D4AF37)' }}
          >
            ❄️
          </motion.button>
        ) : (
          <motion.div
            key="card"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              background: 'linear-gradient(135deg, rgba(74, 4, 4, 0.95) 0%, rgba(26, 2, 2, 0.98) 100%)',
              padding: '60px 40px', borderRadius: '40px',
              border: '3px solid #D4AF37',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              textAlign: 'center', width: '400px', position: 'relative', zIndex: 10
            }}
          >
            <motion.div
              animate={{ opacity: isHovered ? 0 : 1 }}
              transition={{ duration: 1 }}
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
                borderRadius: '35px', zIndex: 100, pointerEvents: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <span style={{ color: 'white', opacity: 0.9, fontSize: '15px', fontWeight: 'bold' }}>
                Buğuyu silmek için dokun... ❄️
              </span>
            </motion.div>

            <div style={{ position: 'absolute', top: '-15px', left: '-15px', fontSize: '55px' }}>🌿</div>
            <div style={{ position: 'absolute', top: '-15px', right: '-15px', fontSize: '55px', transform: 'scaleX(-1)' }}>🌿</div>

            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ marginBottom: '25px' }}>
              <div style={{ width: '160px', height: '160px', margin: '0 auto', background: '#D4AF37', padding: '3px', clipPath: 'path("M80 145c-40-30-80-70-80-105 0-25 18-40 40-40 15 0 30 10 40 25 10-15 25-25 40-25 22 0 40 15 40 40 0 35-40 75-80 105z")' }}>
                <img src={couplePhoto} alt="Biz" style={{ width: '100%', height: '100%', objectFit: 'cover', clipPath: 'inherit' }} />
              </div>
            </motion.div>

            <h2 style={{ color: '#D4AF37', fontSize: '28px', marginBottom: '10px' }}>Mutlu ve Senli Yıllar SEVGİLİM...</h2>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <motion.input
                type="text" placeholder="Özel şifremiz..." value={password}
                onChange={(e) => setPassword(e.target.value)}
                animate={error ? { x: [-10, 10, -10, 10, 0], borderColor: 'red' } : {}}
                style={{ background: 'rgba(0,0,0,0.5)', border: '2px solid #D4AF37', padding: '15px', borderRadius: '15px', color: '#fff', textAlign: 'center', outline: 'none' }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ background: 'linear-gradient(45deg, #D4AF37, #B8860B)', color: '#3d0202', padding: '15px', borderRadius: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' }}
              >
                🌘​ Yılbaşımız Başlasın ​​💌​​🎉
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layer1;