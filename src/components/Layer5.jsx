import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Layer5 = () => {
    const videoSrc = "/20251230_140419_1.mp4";
    const [showButton, setShowButton] = useState(false);

    // Video bittiğinde çalışacak fonksiyon
    const handleVideoEnd = () => {
        setShowButton(true);
    };

    return (
        <div style={styles.container}>
            {/* Dış Çerçeve */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={styles.videoFrame}
            >
                {/* Video Bileşeni */}
                <video
                    src={videoSrc}
                    style={styles.video}
                    autoPlay
                    controls // Başlat/Durdur kontrollerini sağlar
                    playsInline
                    onEnded={handleVideoEnd} // Video bitince butonu gösterir
                />

                {/* Video Üzerindeki Yazılar (Opsiyonel) */}
                {!showButton && (
                    <div style={styles.overlay}>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            style={styles.videoTitle}
                        >

                        </motion.h1>
                    </div>
                )}
            </motion.div>

            {/* Video Bittikten Sonra Beliren Buton */}
            <AnimatePresence>
                {showButton && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        style={styles.buttonContainer}
                    >
                        <a
                            href="https://i-miss-you-dusky.vercel.app/"
                            style={styles.redirectButton}
                        >
                            Sana Bir Mesajım Daha Var Bitane'M
                            <img
                                src="/emoji.png" // Buraya kendi resminin adını yaz
                                alt="icon"
                                style={styles.buttonIcon}
                            />
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative'
    },
    videoFrame: {
        position: 'relative',
        width: '92vw',
        height: '85vh', // Buton için altta biraz daha pay bıraktık
        borderRadius: '25px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        backgroundColor: '#000',
        border: '6px solid white'
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    overlay: {
        position: 'absolute',
        top: '5%',
        width: '100%',
        textAlign: 'center',
        pointerEvents: 'none' // Videonun kontrol edilmesini engellemez
    },
    videoTitle: {
        fontFamily: "'Great Vibes', cursive",
        fontSize: '2rem',
        color: '#fff',
        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
    },
    buttonContainer: {
        marginTop: '20px',
        zIndex: 10
    },
    redirectButton: {
        display: 'flex',           // İçindekileri (yazı ve resim) yan yana getirir
        alignItems: 'center',      // Dikeyde tam ortalar
        justifyContent: 'center',  // Yatayda ortalar
        gap: '10px',               // Yazı ile resim arasındaki boşluk
        padding: '12px 30px',
        backgroundColor: '#ff4d6d',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '50px',
        fontFamily: "'Quicksand', sans-serif",
        fontWeight: 'bold',
        fontSize: '1.1rem',        // Yazı boyutu
        boxShadow: '0 5px 15px rgba(255, 77, 109, 0.4)',
        transition: 'transform 0.3s ease'
    },

    buttonIcon: {
        height: '2.1rem',          // Yazı fontu boyutuyla (fontSize) aynı yaptık
        width: 'auto',             // Resmin oranının bozulmaması için
        display: 'block'
    }
};

export default Layer5;