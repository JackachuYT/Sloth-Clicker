import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slothImg from "./3607779_na_1f-removebg-preview.png";
import backgroundImg from "./coolbackgrounds-unsplash-bean.jpg";

// 🧩 Your local sound files
import clickSoundFile from "./sounds/mouse-click-sound.wav";
import upgradeSoundFile from "./sounds/success.wav";
import bonusSoundFile from "./sounds/phone-alert-marimba-bubble-om-fx-1-00-01.mp3";
import musicFile from "./sounds/the-realization-ambient-piano-230860.mp3";
import shopSoundFile from "./recording2.wav";

export default function ClickerGame() {
  // 📊 Game state
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [upgradeCost, setUpgradeCost] = useState(50);
  const [autoClickerCost, setAutoClickerCost] = useState(100);
  const [bonusVisible, setBonusVisible] = useState(false);
  const [bonusX, setBonusX] = useState(50);
  const [bonusY, setBonusY] = useState(50);
  const [bonusTimer, setBonusTimer] = useState(0);
  const [muted, setMuted] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [shopMessage, setShopMessage] = useState(false);

  // 🔊 Audio refs
  const musicRef = useRef(null);
  const clickSoundRef = useRef(null);
  const upgradeSoundRef = useRef(null);
  const bonusSoundRef = useRef(null);
  const shopSoundRef = useRef(null);

  // 🎵 Load audio files
  useEffect(() => {
    musicRef.current = new Audio(musicFile);
    musicRef.current.loop = true;
    musicRef.current.volume = 0.3;

    clickSoundRef.current = new Audio(clickSoundFile);
    upgradeSoundRef.current = new Audio(upgradeSoundFile);
    bonusSoundRef.current = new Audio(bonusSoundFile);
    shopSoundRef.current = new Audio(shopSoundFile);
  }, []);

  // 🎶 Music control
  useEffect(() => {
    if (!musicRef.current) return;
    if (musicOn && !muted) {
      musicRef.current.play().catch(() => {});
    } else {
      musicRef.current.pause();
    }
  }, [musicOn, muted]);

  // 🧠 Helper: play sound safely
  const play = (ref) => {
    if (!muted && ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  // 🖱️ Clicking sloth
  const handleClick = () => {
    setScore((s) => s + multiplier);
    play(clickSoundRef);
  };

  // ⬆️ Upgrade
  const handleUpgrade = () => {
    if (score >= upgradeCost) {
      setScore(score - upgradeCost);
      setMultiplier((m) => m + 1);
      setUpgradeCost(Math.floor(upgradeCost * 1.5));
      play(upgradeSoundRef);
    }
  };

  // 🤖 Auto clicker
  const handleAutoClicker = () => {
    if (score >= autoClickerCost) {
      setScore(score - autoClickerCost);
      setAutoClickers((a) => a + 1);
      setAutoClickerCost(Math.floor(autoClickerCost * 1.8));
      play(upgradeSoundRef);
    }
  };

  // 🔁 Auto clicks every second
  useEffect(() => {
    const t = setInterval(() => setScore((s) => s + autoClickers * multiplier), 1000);
    return () => clearInterval(t);
  }, [autoClickers, multiplier]);

  // 🎁 Bonus system
  useEffect(() => {
    let interval;
    if (bonusVisible) {
      setBonusTimer(7.6);
      interval = setInterval(() => {
        setBonusTimer((p) => {
          if (p <= 0.1) {
            setBonusVisible(false);
            clearInterval(interval);
            return 0;
          }
          return +(p - 0.1).toFixed(1);
        });
      }, 100);
    } else {
      const spawn = setInterval(() => {
        if (!bonusVisible && Math.random() < 0.25) {
          setBonusX(Math.random() * 70 + 10);
          setBonusY(Math.random() * 70 + 10);
          setBonusVisible(true);
          clearInterval(spawn);
        }
      }, 5000);
      return () => clearInterval(spawn);
    }
    return () => clearInterval(interval);
  }, [bonusVisible]);

  const handleBonus = () => {
    setScore((s) => s + 100 * multiplier);
    setBonusVisible(false);
    play(bonusSoundRef);
  };

  // 🛒 Shop button
  const handleShopClick = () => {
    play(shopSoundRef);
    setShopMessage(true);
    setTimeout(() => setShopMessage(false), 2000);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        color: "white",
        textAlign: "center",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", textShadow: "2px 2px 5px black" }}>
        🦥 Sloth Clicker 🦥
      </h1>

      <motion.img
        src={slothImg}
        alt="Sloth Clicker"
        onClick={handleClick}
        whileTap={{ scale: 0.9, rotate: 5 }}
        style={{
          width: 200,
          cursor: "pointer",
          marginBottom: "1rem",
          filter: "drop-shadow(0 0 10px rgba(255,255,255,0.6))",
        }}
      />

      <p style={{ fontSize: "1.4rem" }}>Score: {score}</p>
      <p>Multiplier: x{multiplier}</p>
      <p>Auto-Clickers: {autoClickers}</p>

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={handleUpgrade}
          disabled={score < upgradeCost}
          style={{
            backgroundColor: score < upgradeCost ? "#3b82f6aa" : "#3b82f6",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.5rem",
            cursor: score < upgradeCost ? "not-allowed" : "pointer",
            margin: "0.2rem",
          }}
        >
          Upgrade ({upgradeCost})
        </button>

        <button
          onClick={handleAutoClicker}
          disabled={score < autoClickerCost}
          style={{
            backgroundColor: score < autoClickerCost ? "#f59e0baa" : "#f59e0b",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.5rem",
            cursor: score < autoClickerCost ? "not-allowed" : "pointer",
            margin: "0.2rem",
          }}
        >
          Auto-Clicker ({autoClickerCost})
        </button>

        <button
          onClick={() => setMusicOn(!musicOn)}
          style={{
            backgroundColor: musicOn ? "#10b981" : "#6b7280",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            margin: "0.2rem",
          }}
        >
          {musicOn ? "🎵 Music On" : "🎶 Music Off"}
        </button>

        <button
          onClick={() => setMuted(!muted)}
          style={{
            backgroundColor: muted ? "#ef4444" : "#10b981",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            margin: "0.2rem",
          }}
        >
          {muted ? "🔇 Muted" : "🔊 Sound On"}
        </button>
      </div>

      {/* 🛒 SHOP BUTTON */}
      <motion.button
        onClick={handleShopClick}
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          background: "linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet)",
          backgroundSize: "400% 400%",
          color: "white",
          padding: "0.6rem 1.5rem",
          border: "none",
          borderRadius: "0.7rem",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 0 20px rgba(255,255,255,0.6)",
          animation: "rainbowGlow 3s linear infinite",
          marginTop: "1.5rem",
        }}
      >
        🛒 Shop
      </motion.button>

      {shopMessage && (
        <p style={{ marginTop: "1rem", color: "#fbbf24", fontSize: "1.2rem" }}>
          🛍️ Shop Coming Soon!
        </p>
      )}

      {/* 🎁 BONUS */}
      <AnimatePresence>
        {bonusVisible && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: "absolute",
              top: `${bonusY}%`,
              left: `${bonusX}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              onClick={handleBonus}
              style={{
                backgroundColor: "#22c55e",
                padding: "1rem",
                borderRadius: "50%",
                color: "white",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              🎁 +100
            </button>
            <div
              style={{
                height: "6px",
                background: "#fff3",
                marginTop: "4px",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "6px",
                  width: `${(bonusTimer / 7.6) * 100}%`,
                  background: "#22c55e",
                  transition: "width 0.1s linear",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 🌈 Animated rainbow glow
const style = document.createElement("style");
style.innerHTML = `
@keyframes rainbowGlow {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}`;
document.head.appendChild(style);
