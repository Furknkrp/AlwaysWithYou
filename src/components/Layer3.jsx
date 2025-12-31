import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Layer3 = ({ onFinish }) => {
    const [step, setStep] = useState('envelope');
    const [isFlipped, setIsFlipped] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);
    
    // 🎵 Müzik Referansı
    const audioRef = useRef(null);

    // Sayfa açıldığında müziği başlat
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5; // Ses seviyesini buradan ayarlayabilirsin (0.0 ile 1.0 arası)
            audioRef.current.play().catch(e => console.log("Müzik başlatılamadı:", e));
        }
    }, []);

    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    // Kar ve Kayan Yıldız Konfigürasyonu
    const particlesOptions = {
        background: { color: "#001233" },
        particles: {
            number: { value: 100, density: { enable: true, area: 800 } },
            color: { value: "#ffffffff" },
            shape: { type: "circle" },
            opacity: { value: { min: 0.1, max: 0.8 }, anim: { enable: true, speed: 1 } },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 0.6, direction: "bottom", straight: false, outModes: "out" }
        },
        emitters: {
            direction: "bottom-right",
            rate: { quantity: 1, delay: 10 },
            life: { duration: 3, count: 0 },
            position: { x: 0, y: 0 },
            particles: {
                move: { speed: 20, straight: true },
                size: { value: 2 },
                color: { value: "#ffffffff" }
            }
        }
    };

    // Özel Çizilmiş Wax Seal (Balmumu Mühür)
    const WaxSeal = () => (
        <svg width="60" height="60" viewBox="0 0 100 100" style={styles.seal}>
            <circle cx="50" cy="50" r="40" fill="#8b0000be" filter="url(#shadow)" />
            <path d="M50 70C50 70 75 50 75 35C75 25 60 20 50 30C40 20 25 25 25 35C25 50 50 70 50 70Z" fill="#ff0000ff" />
            <defs><filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" /></filter></defs>
        </svg>
    );

    return (
        <div style={styles.container}>
          
        <audio 
            ref={audioRef} 
            src="/mektup_muzigi.mp3" 
            loop 
        />

        <div style={styles.oceanOverlay}></div>
            <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />

            <AnimatePresence mode="wait">
                {step === 'envelope' ? (
                    <motion.div
                        key="envelope"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            rotate: [-1.5, 1.5, -1.5] // Sallanma Hareketi
                        }}
                        transition={{
                            rotate: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                            scale: { duration: 0.5 }
                        }}
                        exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
                        onClick={() => setStep('card')}
                        style={styles.envelope}
                    >
                        <div style={styles.envFront}>
                            <div style={styles.flap}></div>
                            <WaxSeal />
                            <p style={styles.envHint}>Dünya'M a mektup var...</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="card"
                        initial={{ y: 300, opacity: 0, rotate: 10 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        style={styles.cardContainer}
                    >
                        <div
                            style={{
                                ...styles.cardInner,
                                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                            }}
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            {/* KART ÖN YÜZ (FOTOĞRAF) */}
                            <div style={{ ...styles.cardFace, ...styles.cardFront }}>
                                <div style={styles.postcardBorder}>
                                    <img src="/image_1.png" alt="Foto" style={styles.photo} />
                                </div>
                                {/* Zarif Kıvrılma Animasyonu */}
                                <motion.div
                                    style={styles.flipHint}
                                    animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                />
                            </div>

                            {/* KART ARKA YÜZ (KARTPOSTAL TASARIMI) */}
                            <div style={{ ...styles.cardFace, ...styles.cardBack }}>
                                <div style={styles.postcardLayout}>
                                    <div style={styles.leftMessage}>
                                        <h3 style={styles.handwritingHeader}>Mutlu Yıllar Mavi Kişi'M...</h3>
                                        <p style={styles.messageText}>
                                            Hayallerimizin peşinden yürürken bazen ne tarafa gideceğimizi bilmesek bile birbirimizi kaybetmeyelim. Çünkü önemli olan nerede olduğumuz değil, kiminle olduğumuzdur. Hayatın her noktasında köşesinde biz olalım Dünya'M. Ben sadece aşık olduğum için değil, aynı zamanda en güvendiğim, en çok saygı duyduğum, konuşmadan anlaşıp hissedebildiğim, hem sevgilim hem en iyi arkadaşım hem sırdaşım olduğun için çooookkk seviyorumm senii 🤍. Hayatım ömrüm boyunca gözlerine baktığımda kokunu alıp tenini hissettiğim her anda "İyi ki " diyeceğim. İyi ki hayatımdasın güzelimm.  Sen, aynı yastığa baş koyup aynı gökyüzüne umutla bakacağım ortak hayaller kuracağımsın... Uzun zaman geçse de yıllar geçse bile elini tuttuğumda ilk günkü gibi atacak kalbim 💓
                                        </p>
                                    </div>
                                    <div style={styles.rightInfo}>
                                        <div style={styles.stamp}><img
                                            src="/pul_resmi.png"
                                            alt="Pul"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        /></div>
                                        <div style={styles.addressLines}>
                                            <p style={styles.line}>Sizin Mavi Kişiniz, sizi en kötü ve en iyi hâllerinizle görmüş, ancak hiçbir zaman yanınızdan ayrılmamış kişidir. Sizinle hem kahkahaları hem de gözyaşlarını paylaşmış, başarılarınıza da yenilgilerinize de tanıklık etmiş kişidir. <br /> <br />Koşullar ne olursa olsun, sizi özel hissettirmeyi her zaman bir şekilde başaran kişidir. Varlığı güvenli bir sığınaktır. Kendiniz olabildiğiniz, yargılanmaktan korkmadığınız bir yer. Ve en gri günlerinizde, yolunuzu aydınlatan bir ışık huzmesidir; size asla yalnız olmadığınızı hatırlatır. </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Zarif Kıvrılma Animasyonu (Arka yüzde de aktif) */}
                                <motion.div
                                    style={{
                                        ...styles.flipHint, // Genel stilleri al
                                        right: 'auto',      // Sağdaki yerini sıfırla
                                        left: '15px',       // Sola 15px boşluk ver
                                    }}
                                    // ÖNEMLİ: Simetriyi 'initial' ve 'animate' içinde tanımlıyoruz ki bozulmasın
                                    initial={{ scaleX: -1 }}
                                    animate={{
                                        y: [0, -10, 0],
                                        scaleX: -1 // Y eksenine göre aynalama (simetri) burasıdır
                                    }}
                                    transition={{ duration: 2 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* ✨ KART AÇILDIĞINDA SAĞDA BELİREN SİMLİ KALP */}
            {step === 'card' && (
                <motion.div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        pointerEvents: isExpanding ? 'auto' : 'none'
                    }}
                >
                    {/* Işıltı Yayılma Efekti (Tüneldekiyle Aynı) */}
                    {isExpanding && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 100, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "circIn" }}
                            onAnimationComplete={onFinish}
                            style={{
                                position: 'absolute',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, #ff4d6d 0%, #ffc8c8 50%, transparent 100%)',
                                boxShadow: '0 0 50px 20px #ff4d6d',
                                filter: 'blur(5px)',
                                pointerEvents: 'auto'
                            }}
                        />
                    )}

                    {/* Kalp Butonu (Kartın Sağında Konumlandırıldı) */}
                    {!isExpanding && (
                        <motion.button
                            key="layer3-next-heart"
                            initial={{ opacity: 0, scale: 0, x: 450 }} // Kartın sağına (x: 450) ötelendi
                            animate={{
                                opacity: 1,
                                scale: [1, 1.2, 1],
                                x: 490, // Konumu koru
                                filter: ['drop-shadow(0 0 10px #fa002eff)', 'drop-shadow(0 0 30px #fcb4c1ff)', 'drop-shadow(0 0 10px #780217ff)']
                            }}
                            transition={{
                                scale: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
                                opacity: { delay: 1, duration: 1 } // Kart açıldıktan biraz sonra gelsin
                            }}
                            onClick={() => setIsExpanding(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '100px',
                                position: 'absolute',
                                pointerEvents: 'auto'
                            }}
                        >
                            <span style={{
                                WebkitTextStroke: '3px #ff002fff',
                                color: 'transparent',
                                textShadow: '0 0 15px rgba(255, 77, 109, 0.8)'
                            }}>
                                ♡
                            </span>
                            {/* Minik Simler */}
                            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ position: 'absolute', top: '10%', left: '20%', fontSize: '20px' }}></motion.div>
                            <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} style={{ position: 'absolute', bottom: '20%', right: '10%', fontSize: '20px' }}></motion.div>
                        </motion.button>
                    )}
                </motion.div>
            )}
        </div>
    );
};

const styles = {
    container: {
        height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center',
        alignItems: 'center', perspective: '2000px', backgroundColor: '#001233', overflow: 'hidden'
    },
    oceanOverlay: {
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, #0077b8ff 0%, transparent 80%)',
        opacity: 0.3, pointerEvents: 'none'
    },
    envelope: {
        width: '450px', height: '300px', cursor: 'pointer', zIndex: 10, position: 'relative'
    },
    envFront: {
        width: '100%', height: '100%', backgroundColor: '#fcfaf2', borderRadius: '4px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    flap: {
        position: 'absolute', top: 0, width: '100%', height: '50%',
        background: '#f4f1ea', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', zIndex: 1
    },
    seal: { zIndex: 5, transform: 'translateY(20px)' },
    envHint: { position: 'absolute', bottom: 20, color: '#999', fontSize: '0.8rem', letterSpacing: '2px' },
    cardContainer: { width: '700px', height: '450px', zIndex: 20 },
    cardInner: {
        width: '100%', height: '100%', position: 'relative',
        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        transformStyle: 'preserve-3d', cursor: 'pointer'
    },
    cardFace: {
        position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
        borderRadius: '10px', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', backgroundColor: '#fff',
        border: '12px solid white', overflow: 'hidden'
    },
    cardFront: { padding: '5px' },
    cardBack: { transform: 'rotateY(180deg)', padding: '30px' },
    photo: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' },
    postcardLayout: { display: 'flex', height: '100%', gap: '30px' },
    leftMessage: { flex: 2, borderRight: '1px solid #ddd', paddingRight: '20px', textAlign: 'left' },
    rightInfo: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
    messageText: {
        fontFamily: "'Quicksand', sans-serif", fontSize: '1rem', // Font küçültüldü
        lineHeight: '1.6', color: '#003566'
    },
    handwritingHeader: { fontFamily: "'Great Vibes', cursive", color: '#a30000', marginBottom: '10px' },
    stamp: {
        width: '60px',
        height: '80px',
        border: '2px dashed #ccc', // Pul kenarı efekti
        padding: '2px',            // Resim ile kenarlık arasında boşluk
        backgroundColor: '#fff',
        overflow: 'hidden',        // Resmin köşelerden taşmasını engeller
        marginBottom: '5px'        // Altındaki yazıya çok yapışmasın
    },
    addressLines: {
        width: '100%',
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px' // Satırlar arası boşluk
    },
    line: {
        fontFamily: "'Special Elite', sans-serif", // Farklı ve modern bir font
        fontSize: '0.8rem',
        color: '#000000', // Siyah renk
        borderBottom: '1px solid #eee', // Çizgili kartpostal görünümünü korur
        textAlign: 'left',
        margin: '0',
        paddingBottom: '2px',
        fontStyle: 'italic' // Daha şık durması için eğik yapılabilir 
    },
    flipHint: {
        position: 'absolute', bottom: '15px', right: '15px', width: '35px', height: '35px',
        background: 'linear-gradient(135deg, transparent 50%, #eee 50%, #ccc 100%)',
        clipPath: 'polygon(100% 0, 0 100%, 100% 100%)', borderRadius: '0 0 5px 0',
        boxShadow: '-2px -2px 5px rgba(0,0,0,0.1)'
    }
};

export default Layer3;