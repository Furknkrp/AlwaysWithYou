import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Layer4 = ({ onFinish }) => {
    // Fotoğraf Url (Pusulanın merkezindeki)
    const photoUrl = "/love.jpeg";

    const targetDate = new Date("2026-01-01T00:00:00").getTime();
    const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
    const [progress, setProgress] = useState({ h: 0, m: 0, s: 0 });
    const [status, setStatus] = useState('countdown'); 
    const [isExpanding, setIsExpanding] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [sparks, setSparks] = useState([]);

    // 🕒 Zaman Mantığı
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = targetDate - now;
            if (diff <= 0) {
                clearInterval(timer);
                setStatus('celebrating');
            } else {
                const hNum = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const mNum = Math.floor((diff / 1000 / 60) % 60);
                const sNum = Math.floor((diff / 1000) % 60);
                setTimeLeft({ h: hNum.toString().padStart(2, '0'), m: mNum.toString().padStart(2, '0'), s: sNum.toString().padStart(2, '0') });
                setProgress({ h: (hNum / 24) * 100, m: (mNum / 60) * 100, s: (sNum / 60) * 100 });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    // 🎆 Gelişmiş Havai Fişek Motoru (Parçacık Üretimi)
    const fireworkParticles = useMemo(() => {
        return Array.from({ length: 450 }).map((_, i) => ({
            id: i,
            angle: Math.random() * Math.PI * 2,
            velocity: 10 + Math.random() * 45,
            size: 1.5 + Math.random() * 4,
            color: i % 4 === 0 ? '#FFD700' : i % 4 === 1 ? '#FFFFFF' : i % 4 === 2 ? '#FF4D6D' : '#FF9E00',
            drift: (Math.random() - 0.5) * 100, // Hafif rüzgar etkisi
            duration: 2.5 + Math.random() * 2.5
        }));
    }, []);

    // Kutlama akış yönetimi
    useEffect(() => {
        if (status === 'celebrating') {
            const timer = setTimeout(() => setStatus('final'), 6500);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleInteraction = (e) => {
        const newSpark = { id: Date.now(), x: e.clientX, y: e.clientY };
        setSparks(prev => [...prev, newSpark]);
        setTimeout(() => setSparks(prev => prev.filter(s => s.id !== newSpark.id)), 1000);
    };

    const RealisticLED = ({ color, index }) => (
        <div style={styles.ledWrapper}>
            <motion.div 
                style={styles.ledBulb}
                animate={{ 
                    boxShadow: [
                        `0 0 8px ${color}`,
                        `0 0 45px ${color}, 0 0 75px ${color}`,
                        `0 0 8px ${color}`
                    ],
                    opacity: [0.6, 1, 0.6],
                    filter: ['brightness(1)', 'brightness(1.8)', 'brightness(1)']
                }}
                transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.1 }}
            >
                <div style={styles.ledReflex} />
            </motion.div>
        </div>
    );

    return (
        <div 
            style={styles.container}
            onMouseMove={(e) => setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 8,
                y: (e.clientY / window.innerHeight - 0.5) * 8
            })}
            onClick={handleInteraction}
        >
            <AnimatePresence mode="wait">
                {status === 'countdown' && (
                    <motion.div 
                        key="countdown-layer" 
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.8, filter: 'blur(30px)' }}
                        style={styles.fullScreen}
                    >
                        <div style={styles.flexCenter}>
                            {/* DİJİTAL SAAT */}
                            <motion.div style={{ ...styles.digitalWrapper, rotateY: mousePos.x, rotateX: -mousePos.y }}>
                                <div style={styles.wire} />
                                <div style={styles.fairyLights}>
                                    {['#FFD700', '#FF4D6D', '#FFFFFF', '#FFD700', '#FF4D6D', '#FFFFFF'].map((c, i) => (
                                        <RealisticLED key={i} color={c} index={i} />
                                    ))}
                                </div>
                                <div style={styles.digitalClock}>
                                    <div style={styles.timeText}>{timeLeft.h}:{timeLeft.m}:{timeLeft.s}</div>
                                </div>
                            </motion.div>

                            {/* PUSULA */}
                            <motion.div style={{ ...styles.compass3D, rotateY: mousePos.x, rotateX: -mousePos.y }}>
                                <svg style={styles.svg} width="360" height="360">
                                    <circle cx="180" cy="180" r="170" style={styles.ringBase} />
                                    <motion.circle cx="180" cy="180" r="170" style={{...styles.ringFill, stroke: '#6eb78eff'}} strokeDasharray="1068" animate={{ strokeDashoffset: 1068 - (1068 * progress.h) / 100 }} />
                                </svg>
                                <svg style={styles.svg} width="280" height="280">
                                    <circle cx="140" cy="140" r="130" style={styles.ringBase} />
                                    <motion.circle cx="140" cy="140" r="130" style={{...styles.ringFill, stroke: '#FFFFFF'}} strokeDasharray="816" animate={{ strokeDashoffset: 816 - (816 * progress.m) / 100 }} />
                                </svg>
                                <svg style={styles.svg} width="200" height="200">
                                    <circle cx="100" cy="100" r="90" style={styles.ringBase} />
                                    <motion.circle cx="100" cy="100" r="90" style={{...styles.ringFill, stroke: '#ffea7fff'}} strokeDasharray="565" animate={{ strokeDashoffset: 565 - (565 * progress.s) / 100 }} />
                                </svg>
                                <div style={styles.photoFrame}>
                                    <img src={photoUrl} alt="Love" style={styles.photo} />
                                    <div style={styles.photoOverlay} />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {status === 'celebrating' && (
                    <motion.div key="celebrating-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.fwLayer}>
                        {/* 🎇 ANA PATLAMA FLASHI */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.4, 0] }}
                            transition={{ duration: 1, delay: 0.8 }}
                            style={styles.screenFlash}
                        />

                        {/* 🚀 ROKET FIRLATMA */}
                        <motion.div 
                            initial={{ y: '100vh', opacity: 1, scale: 1.5 }}
                            animate={{ y: '-5vh', opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                            style={styles.rocket}
                        >
                            <div style={styles.rocketTrail} />
                        </motion.div>

                        {/* 💥 PARÇACIKLAR */}
                        {fireworkParticles.map(p => (
                            <motion.div
                                key={p.id}
                                initial={{ x: 0, y: 0, opacity: 1 }}
                                animate={{ 
                                    x: Math.cos(p.angle) * p.velocity * 18 + p.drift,
                                    y: [Math.sin(p.angle) * p.velocity * 18, 500], // Yerçekimi etkisi
                                    opacity: [1, 1, 0],
                                    scale: [1, 1.2, 0],
                                    filter: ["brightness(1)", "brightness(2)", "brightness(1)"] // Sparkle etkisi
                                }}
                                transition={{ 
                                    delay: 0.9, 
                                    duration: p.duration, 
                                    ease: "easeOut"
                                }}
                                style={{ 
                                    ...styles.fwParticle, 
                                    backgroundColor: p.color, 
                                    width: p.size, 
                                    height: p.size,
                                    boxShadow: `0 0 ${p.size * 3}px ${p.color}`
                                }}
                            />
                        ))}
                    </motion.div>
                )}

                {status === 'final' && (
                    <motion.div key="final-layer" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} style={styles.finalCenter}>
                        {isExpanding && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 450 }}
                                transition={{ duration: 2, ease: "circIn" }}
                                onAnimationComplete={onFinish}
                                style={styles.whiteExpansion}
                            />
                        )}
                        {!isExpanding && (
                            <motion.button
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                onClick={() => setIsExpanding(true)}
                                style={styles.hugeHeart}
                            >
                                ❤️
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TIKLAMA KALPLERİ */}
            {sparks.map(s => (
                <motion.div key={s.id} initial={{ opacity: 1, scale: 0 }} animate={{ opacity: 0, scale: 2.5, y: -100 }} style={{ ...styles.spark, left: s.x, top: s.y }}> ❤️ </motion.div>
            ))}
        </div>
    );
};

const styles = {
    container: { height: '100vh', width: '100vw', background: '#050000', backgroundImage: 'radial-gradient(circle, #200000 0%, #000000 100%)', overflow: 'hidden', perspective: '1500px', cursor: 'crosshair', position: 'relative' },
    fullScreen: { height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute' },
    flexCenter: { display: 'flex', alignItems: 'center', gap: '80px', flexWrap: 'wrap', justifyContent: 'center' },
    
    // LED & DİJİTAL SAAT
    digitalWrapper: { position: 'relative', transformStyle: 'preserve-3d' },
    wire: { position: 'absolute', top: '-5px', left: '10%', width: '80%', height: '2px', background: '#222', zIndex: 15 },
    fairyLights: { position: 'absolute', top: '-18px', width: '100%', display: 'flex', justifyContent: 'space-around', zIndex: 20 },
    ledWrapper: { width: '14px', height: '24px', display: 'flex', justifyContent: 'center' },
    ledBulb: { width: '10px', height: '16px', borderRadius: '50% 50% 45% 45%', position: 'relative' },
    ledReflex: { position: 'absolute', top: '2px', left: '2px', width: '3px', height: '5px', background: 'rgba(255,255,255,0.6)', borderRadius: '50%' },
    digitalClock: { background: 'rgba(255,255,255,0.02)', border: '2px solid rgba(241,229,172,0.5)', borderRadius: '35px', padding: '55px 75px', backdropFilter: 'blur(35px)', boxShadow: '0 0 60px rgba(0,0,0,0.9)' },
    timeText: { fontFamily: "'Courier New', monospace", fontSize: 'clamp(3rem, 10vw, 5.5rem)', color: '#F1E5AC', fontWeight: 'bold', textShadow: '0 0 35px rgba(241,229,172,0.7)', letterSpacing: '8px' },

    // PUSULA
    compass3D: { width: '360px', height: '360px', position: 'relative', transformStyle: 'preserve-3d', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    svg: { position: 'absolute', overflow: 'visible' },
    ringBase: { fill: 'none', stroke: 'rgba(255,255,255,0.02)', strokeWidth: '2' },
    ringFill: { fill: 'none', strokeWidth: '6', strokeLinecap: 'round', filter: 'drop-shadow(0 0 20px currentColor)' },
    photoFrame: { width: '155px', height: '155px', borderRadius: '50%', border: '4px solid #F1E5AC', overflow: 'hidden', position: 'relative', transform: 'translateZ(60px)', boxShadow: '0 0 60px rgba(0,0,0,0.7)' },
    photo: { width: '100%', height: '100%', objectFit: 'cover' },
    photoOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(183,110,121,0.2), transparent)' },

    // 🎆 HAVAİ FİŞEK MOTORU
    fwLayer: { position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' },
    screenFlash: { position: 'absolute', inset: 0, background: '#FFF', zIndex: 100 },
    rocket: { width: '4px', height: '80px', background: 'linear-gradient(to top, transparent, #FFF, #FFD700)', borderRadius: '4px', filter: 'blur(1px)' },
    rocketTrail: { position: 'absolute', bottom: '-50px', left: '50%', transform: 'translateX(-50%)', width: '2px', height: '60px', background: 'linear-gradient(to top, transparent, rgba(255,215,0,0.3))' },
    fwParticle: { position: 'absolute', borderRadius: '50%', filter: 'blur(0.5px)' },

    spark: { position: 'fixed', pointerEvents: 'none', zIndex: 500, fontSize: '24px' },
    finalCenter: { position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    hugeHeart: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 'min(420px, 90vw)', filter: 'drop-shadow(0 0 80px #ff0000)' },
    whiteExpansion: { position: 'absolute', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fff', zIndex: 2000 }
};

export default Layer4;