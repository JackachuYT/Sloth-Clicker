import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slothImg from "./3607779_na_1f-removebg-preview.png";
import backgroundImg from "./coolbackgrounds-unsplash-bean.jpg";
import clickSoundFile from "./sounds/mouse-click-sound.wav";
import upgradeSoundFile from "./sounds/success.wav";
import bonusSoundFile from "./sounds/phone-alert-marimba-bubble-om-fx-1-00-01.mp3";
import musicFile from "./sounds/the-realization-ambient-piano-230860.mp3";
import shopOpenSoundFile from "./sounds/shopopen.wav";
import shopCloseSoundFile from "./sounds/shopclose.wav";

const ACHIEVEMENTS = [
  { id: "first_click",   cat: "🖱️ Clicking", name: "First Click",      icon: "👆",   desc: "Click the sloth once",                   reward: { pts: 5 },                        rewardDesc: "+5 pts" },
  { id: "clicks_100",    cat: "🖱️ Clicking", name: "Click Enthusiast", icon: "🖱️",   desc: "Click 100 times",                        reward: { pts: 100 },                      rewardDesc: "+100 pts" },
  { id: "clicks_1000",   cat: "🖱️ Clicking", name: "Click Master",     icon: "⚡",   desc: "Click 1,000 times",                      reward: { pts: 500, autoClickers: 1 },     rewardDesc: "+500 pts & 1 free Baby Sloth" },
  { id: "clicks_10000",  cat: "🖱️ Clicking", name: "Clicker Legend",   icon: "🔥",   desc: "Click 10,000 times",                     reward: { pts: 5000, slothGangs: 1 },      rewardDesc: "+5,000 pts & 1 free Sloth Gang" },
  { id: "score_100",     cat: "💰 Score",    name: "Getting Started",  icon: "💰",   desc: "Reach 100 points",                       reward: { pts: 50 },                       rewardDesc: "+50 pts" },
  { id: "score_1k",      cat: "💰 Score",    name: "Four Figures",     icon: "💵",   desc: "Reach 1,000 points",                     reward: { pts: 500 },                      rewardDesc: "+500 pts" },
  { id: "score_10k",     cat: "💰 Score",    name: "Ten Thousand",     icon: "🤑",   desc: "Reach 10,000 points",                    reward: { pts: 2000, multiplierUp: 1 },    rewardDesc: "+2,000 pts & +1 multiplier" },
  { id: "score_100k",    cat: "💰 Score",    name: "One Hundred K",    icon: "🏦",   desc: "Reach 100,000 points",                   reward: { pts: 25000, autoClickers: 2 },   rewardDesc: "+25,000 pts & 2 free Baby Sloths" },
  { id: "score_1m",      cat: "💰 Score",    name: "Millionaire",      icon: "💎",   desc: "Reach 1,000,000 points",                 reward: { pts: 100000 },                   rewardDesc: "+100,000 pts" },
  { id: "first_upgrade", cat: "⬆️ Upgrades", name: "Power Up",         icon: "⬆️",   desc: "Buy your first Click Power upgrade",     reward: { pts: 50 },                       rewardDesc: "+50 pts" },
  { id: "mult_10",       cat: "⬆️ Upgrades", name: "10x Mode",         icon: "🚀",   desc: "Reach x10 multiplier",                   reward: { pts: 2000 },                     rewardDesc: "+2,000 pts" },
  { id: "first_auto",    cat: "⬆️ Upgrades", name: "Auto Pilot",       icon: "🤖",   desc: "Buy your first Baby Sloth",              reward: { pts: 100 },                      rewardDesc: "+100 pts" },
  { id: "sloth_army",    cat: "⬆️ Upgrades", name: "Sloth Army",       icon: "🦥",   desc: "Own 5 Baby Sloths",                      reward: { pts: 500, slothGangs: 1 },       rewardDesc: "+500 pts & 1 free Sloth Gang" },
  { id: "sloth_gang",    cat: "⬆️ Upgrades", name: "Gang's All Here",  icon: "🦥🦥", desc: "Buy a Sloth Gang",                       reward: { pts: 3000 },                     rewardDesc: "+3,000 pts" },
  { id: "sloth_empire",  cat: "⬆️ Upgrades", name: "Emperor",          icon: "👑",   desc: "Buy a Sloth Empire",                     reward: { pts: 15000, multiplierUp: 1 },   rewardDesc: "+15,000 pts & +1 multiplier" },
  { id: "crit_hit",      cat: "⬆️ Upgrades", name: "Critical Thinker", icon: "🎯",   desc: "Unlock Critical Hit",                    reward: { pts: 200 },                      rewardDesc: "+200 pts" },
  { id: "double_tap",    cat: "⬆️ Upgrades", name: "Double Trouble",   icon: "👆👆", desc: "Unlock Double Tap",                      reward: { pts: 400 },                      rewardDesc: "+400 pts" },
  { id: "golden_sloth",  cat: "⬆️ Upgrades", name: "Golden Age",       icon: "🥇",   desc: "Buy the Golden Sloth",                   reward: { pts: 3000 },                     rewardDesc: "+3,000 pts" },
  { id: "first_shop",    cat: "🎲 Events",   name: "Window Shopping",  icon: "🛒",   desc: "Open the shop for the first time",       reward: { pts: 25 },                       rewardDesc: "+25 pts" },
  { id: "bonus_catch",   cat: "🎲 Events",   name: "Gift Grabber",     icon: "🎁",   desc: "Catch a bonus bubble",                   reward: { pts: 100 },                      rewardDesc: "+100 pts" },
  { id: "score_bomb",    cat: "🎲 Events",   name: "Boom!",            icon: "💣",   desc: "Use a Score Bomb",                       reward: { pts: 200 },                      rewardDesc: "+200 pts" },
  { id: "secret_code",   cat: "🎲 Events",   name: "Secret Keeper",    icon: "🔑",   desc: "Redeem the secret code",                 reward: { pts: 3000, autoClickers: 1 },    rewardDesc: "+3,000 pts & 1 free Baby Sloth" },
  { id: "rainbow_manual",cat: "🎲 Events",   name: "Rainbow Chaser",   icon: "🌈",   desc: "Trigger a Rainbow Event manually",       reward: { pts: 1500 },                     rewardDesc: "+1,500 pts" },
  { id: "rainbow_auto",  cat: "🎲 Events",   name: "Lucky!",           icon: "🍀",   desc: "Get a natural Rainbow Event",            reward: { pts: 5000 },                     rewardDesc: "+5,000 pts" },
  { id: "prestige_1",    cat: "✨ Prestige",  name: "Rebirth",          icon: "✨",   desc: "Prestige for the first time",            reward: { pts: 10000, multiplierUp: 1 },   rewardDesc: "+10,000 pts & +1 multiplier" },
  { id: "prestige_3",    cat: "✨ Prestige",  name: "Eternal Sloth",    icon: "♾️",   desc: "Prestige 3 times",                       reward: { pts: 50000, slothGangs: 1 },     rewardDesc: "+50,000 pts & 1 free Sloth Gang" },
  { id: "what_now",      cat: "🌀 Secret",   name: "What Now?",        icon: "🕳️",   desc: "Complete every other achievement",        reward: null,                              rewardDesc: null, special: true },
];

const CATS = ["🖱️ Clicking", "💰 Score", "⬆️ Upgrades", "🎲 Events", "✨ Prestige"];

const SAVE_KEY = "slothClicker_save";
const loadSave = () => {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "{}"); }
  catch { return {}; }
};

export default function ClickerGame() {
  const sv = loadSave();

  const [score, setScore] = useState(sv.score ?? 0);
  const [multiplier, setMultiplier] = useState(sv.multiplier ?? 1);
  const [autoClickers, setAutoClickers] = useState(sv.autoClickers ?? 0);
  const [slothGangs, setSlothGangs] = useState(sv.slothGangs ?? 0);
  const [slothEmpires, setSlothEmpires] = useState(sv.slothEmpires ?? 0);
  const [upgradeCost, setUpgradeCost] = useState(sv.upgradeCost ?? 50);
  const [autoClickerCost, setAutoClickerCost] = useState(sv.autoClickerCost ?? 100);
  const [slothGangCost, setSlothGangCost] = useState(sv.slothGangCost ?? 500);
  const [slothEmpireCost, setSlothEmpireCost] = useState(sv.slothEmpireCost ?? 2500);
  const [critHitUnlocked, setCritHitUnlocked] = useState(sv.critHitUnlocked ?? false);
  const [doubleTapUnlocked, setDoubleTapUnlocked] = useState(sv.doubleTapUnlocked ?? false);
  const [goldenSlothBought, setGoldenSlothBought] = useState(sv.goldenSlothBought ?? false);
  const [critFlash, setCritFlash] = useState(false);
  const [bonusVisible, setBonusVisible] = useState(false);
  const [bonusX, setBonusX] = useState(50);
  const [bonusY, setBonusY] = useState(50);
  const [bonusTimer, setBonusTimer] = useState(0);
  const [muted, setMuted] = useState(sv.muted ?? false);
  const [musicOn, setMusicOn] = useState(sv.musicOn ?? true);
  const [shopOpen, setShopOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeUnlocked, setCodeUnlocked] = useState(sv.codeUnlocked ?? false);
  const [codeMessage, setCodeMessage] = useState("");
  const [tenXBought, setTenXBought] = useState(sv.tenXBought ?? false);
  const [slothNexusCost, setSlothNexusCost] = useState(sv.slothNexusCost ?? 10000);
  const [slothNexuses, setSlothNexuses] = useState(sv.slothNexuses ?? 0);
  const [clickMagnetBought, setClickMagnetBought] = useState(sv.clickMagnetBought ?? false);
  const [timeBoostActive, setTimeBoostActive] = useState(false);
  const [timeBoostLeft, setTimeBoostLeft] = useState(0);
  const [rainbowTriggerCount, setRainbowTriggerCount] = useState(sv.rainbowTriggerCount ?? 0);
  const [rainbowActive, setRainbowActive] = useState(false);
  const [rainbowTimeLeft, setRainbowTimeLeft] = useState(0);
  const [totalClicks, setTotalClicks] = useState(sv.totalClicks ?? 0);
  const [popups, setPopups] = useState([]);
  const [achievements, setAchievements] = useState(sv.achievements ?? {});
  const [toastQueue, setToastQueue] = useState([]);
  const [currentToast, setCurrentToast] = useState(null);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [prestigeCount, setPrestigeCount] = useState(sv.prestigeCount ?? 0);
  const [prestigeConfirm, setPrestigeConfirm] = useState(false);
  const [whatNowClicks, setWhatNowClicks] = useState(0);
  const [whatNowMsg, setWhatNowMsg] = useState("");
  const [endScreen, setEndScreen] = useState(false);
  const [endPhase, setEndPhase] = useState("main");
  const [adminOpen, setAdminOpen] = useState(false);

  const musicRef = useRef(null);
  const clickSoundRef = useRef(null);
  const upgradeSoundRef = useRef(null);
  const bonusSoundRef = useRef(null);
  const shopOpenSoundRef = useRef(null);
  const shopCloseSoundRef = useRef(null);
  const savedMultiplierRef = useRef(1);
  const multiplierRef = useRef(1);
  const scoreRef = useRef(0);
  const achievementsRef = useRef({});

  useEffect(() => { multiplierRef.current = multiplier; }, [multiplier]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { achievementsRef.current = achievements; }, [achievements]);

  // persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        score, multiplier, autoClickers, slothGangs, slothEmpires,
        upgradeCost, autoClickerCost, slothGangCost, slothEmpireCost,
        critHitUnlocked, doubleTapUnlocked, goldenSlothBought,
        muted, musicOn, codeUnlocked, tenXBought, rainbowTriggerCount,
        totalClicks, achievements, prestigeCount,
        slothNexusCost, slothNexuses, clickMagnetBought,
      }));
    } catch {}
  }, [score, multiplier, autoClickers, slothGangs, slothEmpires,
      upgradeCost, autoClickerCost, slothGangCost, slothEmpireCost,
      critHitUnlocked, doubleTapUnlocked, goldenSlothBought,
      muted, musicOn, codeUnlocked, tenXBought, rainbowTriggerCount,
      totalClicks, achievements, prestigeCount,
      slothNexusCost, slothNexuses, clickMagnetBought]);

  useEffect(() => {
    musicRef.current = new Audio(musicFile);
    musicRef.current.loop = true;
    musicRef.current.volume = 0.3;
    clickSoundRef.current = new Audio(clickSoundFile);
    upgradeSoundRef.current = new Audio(upgradeSoundFile);
    bonusSoundRef.current = new Audio(bonusSoundFile);
    shopOpenSoundRef.current = new Audio(shopOpenSoundFile);
    shopCloseSoundRef.current = new Audio(shopCloseSoundFile);
  }, []);

  useEffect(() => {
    if (!musicRef.current) return;
    if (musicOn && !muted) musicRef.current.play().catch(() => {});
    else musicRef.current.pause();
  }, [musicOn, muted]);

  // toast queue — pick next when slot is free
  useEffect(() => {
    if (currentToast || toastQueue.length === 0) return;
    setCurrentToast(toastQueue[0]);
    setToastQueue(q => q.slice(1));
  }, [toastQueue, currentToast]);

  // toast timer — dismiss after 1.5s
  useEffect(() => {
    if (!currentToast) return;
    const t = setTimeout(() => setCurrentToast(null), 1500);
    return () => clearTimeout(t);
  }, [currentToast]);

  // score milestone achievements
  useEffect(() => {
    if (score >= 100) unlock("score_100");
    if (score >= 1000) unlock("score_1k");
    if (score >= 10000) unlock("score_10k");
    if (score >= 100000) unlock("score_100k");
    if (score >= 1000000) unlock("score_1m");
  }, [score]); // eslint-disable-line

  useEffect(() => {
    if (multiplier >= 2) unlock("first_upgrade");
    if (multiplier >= 10) unlock("mult_10");
  }, [multiplier]); // eslint-disable-line

  useEffect(() => {
    if (totalClicks >= 1) unlock("first_click");
    if (totalClicks >= 100) unlock("clicks_100");
    if (totalClicks >= 1000) unlock("clicks_1000");
    if (totalClicks >= 10000) unlock("clicks_10000");
  }, [totalClicks]); // eslint-disable-line

  useEffect(() => { if (autoClickers >= 1) unlock("first_auto"); if (autoClickers >= 5) unlock("sloth_army"); }, [autoClickers]); // eslint-disable-line
  useEffect(() => { if (slothGangs >= 1) unlock("sloth_gang"); }, [slothGangs]); // eslint-disable-line
  useEffect(() => { if (slothEmpires >= 1) unlock("sloth_empire"); }, [slothEmpires]); // eslint-disable-line
  useEffect(() => { if (critHitUnlocked) unlock("crit_hit"); }, [critHitUnlocked]); // eslint-disable-line
  useEffect(() => { if (doubleTapUnlocked) unlock("double_tap"); }, [doubleTapUnlocked]); // eslint-disable-line
  useEffect(() => { if (goldenSlothBought) unlock("golden_sloth"); }, [goldenSlothBought]); // eslint-disable-line
  useEffect(() => { if (codeUnlocked) unlock("secret_code"); }, [codeUnlocked]); // eslint-disable-line

  // unlock "What Now?" when all 26 normal achievements done
  useEffect(() => {
    const normalIds = ACHIEVEMENTS.filter(a => !a.special).map(a => a.id);
    if (normalIds.every(id => achievementsRef.current[id])) unlock("what_now");
  }, [achievements]); // eslint-disable-line

  // auto income
  useEffect(() => {
    const t = setInterval(() => {
      const income = (autoClickers + slothGangs * 5 + slothEmpires * 20) * multiplierRef.current * (goldenSlothBought ? 2 : 1);
      setScore(s => s + income);
    }, 1000);
    return () => clearInterval(t);
  }, [autoClickers, slothGangs, slothEmpires, goldenSlothBought]);

  // bonus bubble
  useEffect(() => {
    let interval;
    if (bonusVisible) {
      setBonusTimer(7.6);
      interval = setInterval(() => {
        setBonusTimer(p => {
          if (p <= 0.1) { setBonusVisible(false); clearInterval(interval); return 0; }
          return +(p - 0.1).toFixed(1);
        });
      }, 100);
    } else {
      const spawn = setInterval(() => {
        if (Math.random() < 0.25) {
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

  // rainbow
  const triggerRainbow = (duration, isNatural = false) => {
    savedMultiplierRef.current = multiplierRef.current;
    setRainbowActive(true);
    setRainbowTimeLeft(duration);
    if (isNatural) unlock("rainbow_auto");
  };

  useEffect(() => {
    if (!rainbowActive) return;
    const shuffleId = setInterval(() => setMultiplier(Math.floor(Math.random() * 100) + 1), 150);
    const countdownId = setInterval(() => {
      setRainbowTimeLeft(t => {
        if (t <= 0.1) {
          setRainbowActive(false);
          setMultiplier(savedMultiplierRef.current);
          clearInterval(shuffleId);
          clearInterval(countdownId);
          return 0;
        }
        return +(t - 0.1).toFixed(1);
      });
    }, 100);
    return () => { clearInterval(shuffleId); clearInterval(countdownId); };
  }, [rainbowActive]);

  useEffect(() => {
    if (!timeBoostActive) return;
    const id = setInterval(() => {
      setTimeBoostLeft(t => {
        if (t <= 0.1) { setTimeBoostActive(false); return 0; }
        return +(t - 0.1).toFixed(1);
      });
    }, 100);
    return () => clearInterval(id);
  }, [timeBoostActive]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!rainbowActive && Math.random() < 0.04) triggerRainbow(10, true);
    }, 10000);
    return () => clearInterval(id);
  }, [rainbowActive]); // eslint-disable-line

  // helpers
  const play = (ref) => {
    if (!muted && ref.current) { ref.current.currentTime = 0; ref.current.play().catch(() => {}); }
  };

  const applyReward = (reward) => {
    if (reward.pts) setScore(s => s + reward.pts);
    if (reward.multiplierUp) setMultiplier(m => m + reward.multiplierUp);
    if (reward.autoClickers) setAutoClickers(a => a + reward.autoClickers);
    if (reward.slothGangs) setSlothGangs(g => g + reward.slothGangs);
  };

  const unlock = (id) => {
    if (achievementsRef.current[id]) return;
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (!a) return;
    setAchievements(prev => ({ ...prev, [id]: true }));
    setToastQueue(q => [...q, a]);
    if (a.reward) applyReward(a.reward);
  };

  const handleShopOpen = () => { play(shopOpenSoundRef); setShopOpen(true); unlock("first_shop"); };
  const handleShopClose = () => { play(shopCloseSoundRef); setShopOpen(false); };
  const handleAchievementsOpen = () => { play(shopOpenSoundRef); setAchievementsOpen(true); };
  const handleAchievementsClose = () => { play(shopCloseSoundRef); setAchievementsOpen(false); };

  const handleClick = (e) => {
    const isCrit = critHitUnlocked && Math.random() < 0.20;
    const taps = doubleTapUnlocked ? 2 : 1;
    const magnetBonus = clickMagnetBought ? Math.floor((autoClickers + slothGangs * 5 + slothEmpires * 20 + slothNexuses * 100) * 0.1) : 0;
    const gain = multiplier * taps * (isCrit ? 3 : 1) + magnetBonus;
    setScore(s => s + gain);
    setTotalClicks(c => c + 1);
    const id = Date.now() + Math.random();
    setPopups(prev => [...prev, { id, x: e.clientX, y: e.clientY, text: isCrit ? `💥 CRIT! +${gain.toLocaleString()}` : `+${gain.toLocaleString()}`, color: isCrit ? "#ff7700" : "#fff", big: isCrit }]);
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 1000);
    if (isCrit) { setCritFlash(true); setTimeout(() => setCritFlash(false), 400); }
    play(clickSoundRef);
  };

  const handleUpgrade = () => {
    const cost = upgradeCost;
    if (scoreRef.current >= cost) { setScore(s => s - cost); setMultiplier(m => m + 1); setUpgradeCost(Math.floor(cost * 1.5)); play(upgradeSoundRef); }
  };
  const handleAutoClicker = () => {
    const cost = autoClickerCost;
    if (scoreRef.current >= cost) { setScore(s => s - cost); setAutoClickers(a => a + 1); setAutoClickerCost(Math.floor(cost * 1.8)); play(upgradeSoundRef); }
  };
  const handleSlothGang = () => {
    const cost = slothGangCost;
    if (scoreRef.current >= cost) { setScore(s => s - cost); setSlothGangs(g => g + 1); setSlothGangCost(Math.floor(cost * 2)); play(upgradeSoundRef); }
  };
  const handleSlothEmpire = () => {
    const cost = slothEmpireCost;
    if (scoreRef.current >= cost) { setScore(s => s - cost); setSlothEmpires(e => e + 1); setSlothEmpireCost(Math.floor(cost * 2.2)); play(upgradeSoundRef); }
  };
  const handleCritHit = () => {
    if (scoreRef.current >= 400 && !critHitUnlocked) { setScore(s => s - 400); setCritHitUnlocked(true); play(upgradeSoundRef); }
  };
  const handleDoubleTap = () => {
    if (scoreRef.current >= 800 && !doubleTapUnlocked) { setScore(s => s - 800); setDoubleTapUnlocked(true); play(upgradeSoundRef); }
  };
  const handleScoreBomb = () => {
    if (scoreRef.current >= 300) { setScore(s => s - 300 + 500 * multiplierRef.current); play(upgradeSoundRef); unlock("score_bomb"); }
  };
  const handleGoldenSloth = () => {
    if (scoreRef.current >= 3000 && !goldenSlothBought) { setScore(s => s - 3000); setGoldenSlothBought(true); play(upgradeSoundRef); }
  };
  const handleBonus = () => {
    setScore(s => s + 100 * multiplierRef.current);
    setBonusVisible(false);
    play(bonusSoundRef);
    unlock("bonus_catch");
  };
  const handleCodeSubmit = () => {
    const code = codeInput.trim().toUpperCase();
    if (code === "SL0TH") {
      if (!codeUnlocked) { setCodeUnlocked(true); setCodeMessage("✅ Code accepted! Secret items unlocked!"); }
      else setCodeMessage("Already redeemed!");
    } else if (code === "SCOG") {
      setCodeMessage("🔧 Admin panel unlocked!");
      setAdminOpen(true);
    } else if (code === "ZZZZZZ") {
      setAutoClickers(a => a + 10);
      setCodeMessage("💤 10 Baby Sloths fell asleep into your team!");
    } else if (code === "BIGBUX") {
      setScore(s => s + 50000);
      setCodeMessage("💰 +50,000 pts deposited!");
    } else if (code === "LAZYBOY") {
      if (!timeBoostActive) { setTimeBoostActive(true); setTimeBoostLeft(60); setCodeMessage("⏰ 60s of 2× auto income — enjoy the laziness!"); }
      else setCodeMessage("⏰ Time Boost already active!");
    } else {
      setCodeMessage("❌ Invalid code.");
    }
    setTimeout(() => setCodeMessage(""), 2500);
    setCodeInput("");
  };
  const handle10X = () => {
    if (scoreRef.current >= 500 && !tenXBought) { setScore(s => s - 500); setMultiplier(m => m * 10); setTenXBought(true); play(upgradeSoundRef); }
  };
  const handleSlothNexus = () => {
    const cost = slothNexusCost;
    if (scoreRef.current >= cost) { setScore(s => s - cost); setSlothNexuses(n => n + 1); setSlothNexusCost(Math.floor(cost * 2)); play(upgradeSoundRef); }
  };
  const handleClickMagnet = () => {
    if (scoreRef.current >= 2000 && !clickMagnetBought) { setScore(s => s - 2000); setClickMagnetBought(true); play(upgradeSoundRef); }
  };
  const handleTimeBoost = () => {
    if (scoreRef.current >= 750 && !timeBoostActive) { setScore(s => s - 750); setTimeBoostActive(true); setTimeBoostLeft(30); play(upgradeSoundRef); }
  };
  const handleRainbowTrigger = () => {
    if (scoreRef.current >= 1000 && !rainbowActive && rainbowTriggerCount < 3) {
      setScore(s => s - 1000); setRainbowTriggerCount(c => c + 1); triggerRainbow(5); unlock("rainbow_manual");
    }
  };
  const handlePrestige = () => {
    const n = prestigeCount + 1;
    setPrestigeCount(n);
    setScore(0); setMultiplier(1 + n);
    setAutoClickers(0); setSlothGangs(0); setSlothEmpires(0);
    setUpgradeCost(50); setAutoClickerCost(100); setSlothGangCost(500); setSlothEmpireCost(2500);
    setCritHitUnlocked(false); setDoubleTapUnlocked(false); setGoldenSlothBought(false);
    setTenXBought(false); setRainbowTriggerCount(0); setPrestigeConfirm(false);
    setSlothNexuses(0); setSlothNexusCost(10000); setClickMagnetBought(false);
    setTimeBoostActive(false); setTimeBoostLeft(0);
    unlock("prestige_1");
    if (n >= 3) unlock("prestige_3");
    play(upgradeSoundRef);
  };

  const resetAll = () => {
    localStorage.removeItem(SAVE_KEY);
    setScore(0); setMultiplier(1); setAutoClickers(0); setSlothGangs(0); setSlothEmpires(0);
    setUpgradeCost(50); setAutoClickerCost(100); setSlothGangCost(500); setSlothEmpireCost(2500);
    setCritHitUnlocked(false); setDoubleTapUnlocked(false); setGoldenSlothBought(false);
    setMuted(false); setMusicOn(true); setCodeUnlocked(false); setTenXBought(false);
    setRainbowTriggerCount(0); setTotalClicks(0); setAchievements({}); setPrestigeCount(0);
    setWhatNowClicks(0); setSlothNexuses(0); setSlothNexusCost(10000); setClickMagnetBought(false);
    setTimeBoostActive(false); setTimeBoostLeft(0);
  };

  const handleWhatNowClick = () => {
    const normalIds = ACHIEVEMENTS.filter(a => !a.special).map(a => a.id);
    const allDone = normalIds.every(id => achievementsRef.current[id]);
    if (!allDone) {
      setWhatNowMsg("You aren't worthy... Come back when you unlock all the achievements.");
      setTimeout(() => setWhatNowMsg(""), 3000);
      return;
    }
    const next = whatNowClicks + 1;
    setWhatNowClicks(next);
    if (next >= 3) {
      setWhatNowClicks(0);
      setEndScreen(true);
      setEndPhase("main");
    }
  };

  const handleEndContinue = () => {
    setEndPhase("continue_1");
    setTimeout(() => {
      setEndPhase("continue_2");
      setTimeout(() => {
        setEndPhase("continue_3");
        setTimeout(() => {
          setEndPhase("continue_4");
          setTimeout(() => { setEndScreen(false); setEndPhase("main"); }, 1800);
        }, 2500);
      }, 2000);
    }, 2000);
  };

  const handleEndReset = () => {
    setEndPhase("reset_1");
    setTimeout(() => {
      setEndPhase("reset_2");
      setTimeout(() => {
        setEndPhase("reset_3");
        setTimeout(() => {
          setEndPhase("reset_4");
          setTimeout(() => {
            setEndPhase("reset_5");
            setTimeout(() => { resetAll(); setEndScreen(false); setEndPhase("main"); }, 2000);
          }, 5000);
        }, 1500);
      }, 1500);
    }, 1500);
  };


  const autoIncome = (autoClickers + slothGangs * 5 + slothEmpires * 20 + slothNexuses * 100) * multiplier * (goldenSlothBought ? 2 : 1) * (timeBoostActive ? 2 : 1);
  const unlockedCount = Object.keys(achievements).length;

  const btnStyle = (color, disabled) => ({
    backgroundColor: disabled ? color + "55" : color,
    color: "white", padding: "0.55rem 1rem", border: "none", borderRadius: "0.5rem",
    cursor: disabled ? "not-allowed" : "pointer", margin: "0.2rem 0", width: "100%",
    fontSize: "0.95rem", textAlign: "left", opacity: disabled ? 0.6 : 1, transition: "opacity 0.2s",
  });

  const SectionHeader = ({ children }) => (
    <p style={{ color: "#a5b4fc", fontWeight: "bold", marginBottom: "0.5rem", marginTop: "1rem", fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
      {children}
    </p>
  );

  const modalWrap = {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
  };
  const modalBox = {
    background: "linear-gradient(135deg, #1e1b4b, #312e81)", border: "2px solid #818cf8",
    borderRadius: "1rem", padding: "1.5rem 1.75rem", width: "min(460px, 92vw)",
    maxHeight: "88vh", overflowY: "auto", color: "white",
    boxShadow: "0 0 50px #818cf866", position: "relative",
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: "cover", backgroundPosition: "center", height: "100vh", width: "100vw", color: "white", textAlign: "center", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>

      {/* Rainbow overlay */}
      {rainbowActive && <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none", background: "linear-gradient(270deg,#ff000066,#ff7f0066,#ffff0066,#00ff0066,#0000ff66,#8b00ff66,#ff000066)", backgroundSize: "600% 600%", animation: "rainbowThrob 0.6s linear infinite" }} />}
      {rainbowActive && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "rgba(0,0,0,0.75)", border: "2px solid white", borderRadius: "0.75rem", padding: "0.5rem 1.5rem", animation: "rainbowText 0.4s linear infinite", fontWeight: "bold", fontSize: "1.1rem", whiteSpace: "nowrap" }}>🌈 RAINBOW EVENT! x{multiplier} — {rainbowTimeLeft.toFixed(1)}s</div>}
      {timeBoostActive && <div style={{ position: "fixed", top: rainbowActive ? "4rem" : "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 199, background: "rgba(0,0,0,0.8)", border: "2px solid #22d3ee", borderRadius: "0.75rem", padding: "0.5rem 1.5rem", fontWeight: "bold", fontSize: "1rem", whiteSpace: "nowrap", color: "#22d3ee" }}>⏰ TIME BOOST! 2× auto — {timeBoostLeft.toFixed(1)}s</div>}
      {critFlash && <div style={{ position: "fixed", inset: 0, zIndex: 55, pointerEvents: "none", background: "rgba(255,80,0,0.25)", animation: "critFlash 0.4s ease-out" }} />}

      {/* Achievement toast */}
      <AnimatePresence>
        {currentToast && (
          <motion.div key={currentToast.id} initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ position: "fixed", bottom: "2rem", right: "1.5rem", background: "linear-gradient(135deg,#1e1b4b,#312e81)", border: "2px solid #fbbf24", borderRadius: "0.75rem", padding: "0.75rem 1.1rem", zIndex: 500, display: "flex", alignItems: "center", gap: "0.75rem", maxWidth: "280px", boxShadow: "0 0 24px rgba(251,191,36,0.5)" }}
          >
            <span style={{ fontSize: "2rem", flexShrink: 0 }}>{currentToast.icon}</span>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "0.68rem", color: "#fbbf24", fontWeight: "bold", marginBottom: "0.1rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Achievement Unlocked!</p>
              <p style={{ fontSize: "0.9rem", fontWeight: "bold", margin: 0 }}>{currentToast.name}</p>
              <p style={{ fontSize: "0.72rem", color: "#c7d2fe", margin: 0 }}>{currentToast.desc}</p>
              {currentToast.rewardDesc && <p style={{ fontSize: "0.68rem", color: "#fbbf24", margin: "0.15rem 0 0", fontWeight: "bold" }}>🎁 {currentToast.rewardDesc}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prestige confirm */}
      <AnimatePresence>
        {prestigeConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }} onClick={e => { if (e.target === e.currentTarget) setPrestigeConfirm(false); }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} style={{ background: "linear-gradient(135deg,#1a0a2e,#2d1b69)", border: "2px solid #c084fc", borderRadius: "1rem", padding: "2rem", width: "min(360px,90vw)", textAlign: "center", boxShadow: "0 0 40px rgba(192,132,252,0.5)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✨</div>
              <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Ready to Prestige?</h2>
              <p style={{ color: "#c7d2fe", marginBottom: "0.3rem", fontSize: "0.9rem" }}>Resets your score, multiplier, and all upgrades.</p>
              <p style={{ color: "#a78bfa", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Reward: start next run with <strong>x{1 + prestigeCount + 1} base multiplier</strong>.</p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button onClick={handlePrestige} style={{ background: "#7c3aed", color: "white", border: "none", borderRadius: "0.5rem", padding: "0.6rem 1.5rem", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>✨ Prestige!</button>
                <button onClick={() => setPrestigeConfirm(false)} style={{ background: "#374151", color: "white", border: "none", borderRadius: "0.5rem", padding: "0.6rem 1.2rem", cursor: "pointer" }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", textShadow: "2px 2px 5px black" }}>
        🦥 Sloth Clicker 🦥{prestigeCount > 0 && <span style={{ fontSize: "1rem", color: "#c084fc", marginLeft: "0.5rem" }}>✨×{prestigeCount}</span>}
      </h1>

      <motion.img src={slothImg} alt="Sloth" onClick={handleClick} whileTap={{ scale: 0.9, rotate: 5 }}
        style={{ width: 200, cursor: "pointer", marginBottom: "1rem", filter: rainbowActive ? "drop-shadow(0 0 20px white) hue-rotate(var(--hue,0deg))" : "drop-shadow(0 0 10px rgba(255,255,255,0.6))" }}
      />

      <p style={{ fontSize: "1.4rem" }}>Score: {score.toLocaleString()}</p>
      <p>Multiplier: x{multiplier}{critHitUnlocked ? " 🎯" : ""}{doubleTapUnlocked ? " 👆" : ""}{prestigeCount > 0 ? ` (✨+${prestigeCount} base)` : ""}</p>
      <p>Auto Income: {autoIncome.toLocaleString()}/s</p>

      <div style={{ marginTop: "0.5rem" }}>
        <button onClick={() => { if (clickSoundRef.current) { clickSoundRef.current.currentTime = 0; clickSoundRef.current.play().catch(() => {}); } setMusicOn(!musicOn); }}
          style={{ backgroundColor: musicOn ? "#10b981" : "#6b7280", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "0.5rem", cursor: "pointer", margin: "0.2rem" }}>
          {musicOn ? "🎵 Music On" : "🎶 Music Off"}
        </button>
        <button onClick={() => { if (clickSoundRef.current) { clickSoundRef.current.currentTime = 0; clickSoundRef.current.play().catch(() => {}); } setMuted(!muted); }}
          style={{ backgroundColor: muted ? "#ef4444" : "#10b981", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "0.5rem", cursor: "pointer", margin: "0.2rem" }}>
          {muted ? "🔇 Muted" : "🔊 Sound On"}
        </button>
      </div>

      {/* Prestige button */}
      <AnimatePresence>
        {score >= 1000000 && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: [1, 1.04, 1], boxShadow: ["0 0 12px #c084fc55", "0 0 28px #c084fcaa", "0 0 12px #c084fc55"] }} exit={{ opacity: 0, scale: 0.8 }} transition={{ scale: { repeat: Infinity, duration: 2 }, boxShadow: { repeat: Infinity, duration: 2 } }}
            onClick={() => setPrestigeConfirm(true)}
            style={{ background: "linear-gradient(90deg,#7c3aed,#c084fc,#7c3aed)", backgroundSize: "200%", animation: "prestigeShift 3s linear infinite", color: "white", padding: "0.6rem 1.8rem", border: "none", borderRadius: "0.7rem", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", marginTop: "0.75rem", letterSpacing: "0.05em" }}>
            ✨ PRESTIGE
          </motion.button>
        )}
      </AnimatePresence>

      {/* Shop + Achievements buttons */}
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.2rem", alignItems: "center" }}>
        <motion.button onClick={handleShopOpen} animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          style={{ background: "linear-gradient(90deg,#ff0000,#ff7700,#ffff00,#00ff88,#00aaff,#8844ff,#ff0000)", backgroundSize: "300% 100%", color: "white", padding: "0.7rem 2rem", border: "3px solid transparent", borderRadius: "0.8rem", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem", letterSpacing: "0.05em", boxShadow: "0 0 24px rgba(200,100,255,0.7)", animation: "shopRainbow 2s linear infinite, shopGlow 1.5s ease-in-out infinite", outline: "3px solid rgba(255,255,255,0.25)", outlineOffset: "2px" }}>
          🛒 Shop
        </motion.button>
        <button onClick={handleAchievementsOpen}
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "0.7rem 1.1rem", borderRadius: "0.8rem", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", backdropFilter: "blur(4px)" }}>
          🏆 {unlockedCount}/{ACHIEVEMENTS.length}
        </button>
      </div>

      {/* SHOP MODAL */}
      <AnimatePresence>
        {shopOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.8 } }} style={modalWrap} onClick={e => { if (e.target === e.currentTarget) handleShopClose(); }}>
            <motion.div initial={{ scale: 0, opacity: 0, borderRadius: "50%" }} animate={{ scale: 1, opacity: 1, borderRadius: "1rem", transition: { type: "spring", duration: 0.88, bounce: 0.22 } }} exit={{ scale: 0, opacity: 0, borderRadius: "50%", transition: { duration: 0.8, ease: [0.4, 0, 1, 1] } }} style={modalBox}>
              <button onClick={handleShopClose} style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "none", border: "none", color: "white", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
              <h2 style={{ marginBottom: "0.3rem", fontSize: "1.5rem" }}>🛒 Sloth Shop</h2>
              <p style={{ marginBottom: "0.5rem", color: "#c7d2fe", fontSize: "0.95rem" }}>💰 Balance: <strong>{score.toLocaleString()}</strong> pts</p>

              <SectionHeader>⚡ Click Upgrades</SectionHeader>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleUpgrade} disabled={score < upgradeCost} style={btnStyle("#3b82f6", score < upgradeCost)}>⬆️ Click Power — {upgradeCost.toLocaleString()} pts<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>x{multiplier} → x{multiplier + 1} per click</span></button></div>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleCritHit} disabled={score < 400 || critHitUnlocked} style={btnStyle("#ef4444", score < 400 || critHitUnlocked)}>🎯 Critical Hit — 400 pts {critHitUnlocked ? "✅" : ""}<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>{critHitUnlocked ? "Active! 20% chance for 3× damage" : "One-time: 20% chance each click deals 3× points"}</span></button></div>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleDoubleTap} disabled={score < 800 || doubleTapUnlocked} style={btnStyle("#f97316", score < 800 || doubleTapUnlocked)}>👆 Double Tap — 800 pts {doubleTapUnlocked ? "✅" : ""}<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>{doubleTapUnlocked ? "Active! Each click counts twice" : "One-time: every click counts as 2 clicks"}</span></button></div>

              <SectionHeader>🤖 Auto Income</SectionHeader>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleAutoClicker} disabled={score < autoClickerCost} style={btnStyle("#f59e0b", score < autoClickerCost)}>🦥 Baby Sloth — {autoClickerCost.toLocaleString()} pts<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>Own: {autoClickers} — +1/s each × multiplier</span></button></div>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleSlothGang} disabled={score < slothGangCost} style={btnStyle("#10b981", score < slothGangCost)}>🦥🦥 Sloth Gang — {slothGangCost.toLocaleString()} pts<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>Own: {slothGangs} — +5/s each × multiplier</span></button></div>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleSlothEmpire} disabled={score < slothEmpireCost} style={btnStyle("#0ea5e9", score < slothEmpireCost)}>👑 Sloth Empire — {slothEmpireCost.toLocaleString()} pts<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>Own: {slothEmpires} — +20/s each × multiplier</span></button></div>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleGoldenSloth} disabled={score < 3000 || goldenSlothBought} style={btnStyle("#eab308", score < 3000 || goldenSlothBought)}>🥇 Golden Sloth — 3,000 pts {goldenSlothBought ? "✅" : ""}<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>{goldenSlothBought ? "Active! All auto income doubled" : "One-time: doubles all auto income permanently"}</span></button></div>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleSlothNexus} disabled={score < slothNexusCost} style={btnStyle("#6366f1", score < slothNexusCost)}>🌀 Sloth Nexus — {slothNexusCost.toLocaleString()} pts<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>Own: {slothNexuses} — +100/s each × multiplier</span></button></div>

              <SectionHeader>💥 Special</SectionHeader>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleScoreBomb} disabled={score < 300} style={btnStyle("#ec4899", score < 300)}>💣 Score Bomb — 300 pts<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>Instantly gain {(500 * multiplier).toLocaleString()} pts (500 × x{multiplier})</span></button></div>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleTimeBoost} disabled={score < 750 || timeBoostActive} style={btnStyle("#22d3ee", score < 750 || timeBoostActive)}>⏰ Time Boost — 750 pts {timeBoostActive ? "✅" : ""}<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>{timeBoostActive ? `Active! ${timeBoostLeft.toFixed(1)}s left` : "30s of 2× all auto income"}</span></button></div>
              <div style={{ marginBottom: "0.5rem" }}><button onClick={handleClickMagnet} disabled={score < 2000 || clickMagnetBought} style={btnStyle("#f43f5e", score < 2000 || clickMagnetBought)}>🧲 Click Magnet — 2,000 pts {clickMagnetBought ? "✅" : ""}<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>{clickMagnetBought ? "Active! Auto income bonus on each click" : "One-time: each click also gains 10% of your auto rate"}</span></button></div>

              {codeUnlocked && (
                <div style={{ border: "1px solid #fbbf24", borderRadius: "0.6rem", padding: "0.75rem", marginTop: "0.8rem", background: "#78350f22" }}>
                  <SectionHeader>🔑 Secret Items</SectionHeader>
                  <div style={{ marginBottom: "0.5rem" }}><button onClick={handle10X} disabled={tenXBought || score < 500} style={btnStyle("#a855f7", tenXBought || score < 500)}>⚡ 10× Multiplier — 500 pts {tenXBought ? "✅" : ""}<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>{tenXBought ? "Purchased!" : `Multiplies your current x${multiplier} by 10`}</span></button></div>
                  <div><button onClick={handleRainbowTrigger} disabled={score < 1000 || rainbowActive || rainbowTriggerCount >= 3} style={btnStyle("#db2777", score < 1000 || rainbowActive || rainbowTriggerCount >= 3)}>🌈 Rainbow Event — 1,000 pts ({3 - rainbowTriggerCount} left)<span style={{ display: "block", fontSize: "0.72rem", opacity: 0.75 }}>{rainbowTriggerCount >= 3 ? "Used up! Refresh to reset." : rainbowActive ? "Already active!" : "5s of random x1–100 multiplier"}</span></button></div>
                </div>
              )}

              <hr style={{ borderColor: "#4338ca55", margin: "1.2rem 0 0.8rem" }} />
              <p style={{ fontWeight: "bold", marginBottom: "0.5rem", fontSize: "0.9rem" }}>🔐 Redeem Code</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="text" value={codeInput} onChange={e => setCodeInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCodeSubmit()} placeholder="Enter code..." style={{ flex: 1, padding: "0.5rem", borderRadius: "0.4rem", border: "1px solid #818cf8", background: "#1e1b4b", color: "white", fontSize: "1rem", outline: "none" }} />
                <button onClick={handleCodeSubmit} style={{ padding: "0.5rem 1rem", background: "#6366f1", color: "white", border: "none", borderRadius: "0.4rem", cursor: "pointer", fontWeight: "bold" }}>Redeem</button>
              </div>
              {codeMessage && <p style={{ marginTop: "0.5rem", color: codeMessage.startsWith("✅") ? "#86efac" : "#fca5a5" }}>{codeMessage}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACHIEVEMENTS MODAL */}
      <AnimatePresence>
        {achievementsOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.8 } }} style={modalWrap} onClick={e => { if (e.target === e.currentTarget) handleAchievementsClose(); }}>
            <motion.div initial={{ scale: 0, opacity: 0, borderRadius: "50%" }} animate={{ scale: 1, opacity: 1, borderRadius: "1rem", transition: { type: "spring", duration: 0.88, bounce: 0.22 } }} exit={{ scale: 0, opacity: 0, borderRadius: "50%", transition: { duration: 0.8, ease: [0.4, 0, 1, 1] } }} style={modalBox}>
              <button onClick={handleAchievementsClose} style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "none", border: "none", color: "white", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
              <h2 style={{ marginBottom: "0.2rem", fontSize: "1.5rem" }}>🏆 Achievements</h2>
              <p style={{ color: "#c7d2fe", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{unlockedCount} / {ACHIEVEMENTS.length} unlocked</p>
              {CATS.map(cat => (
                <div key={cat}>
                  <SectionHeader>{cat}</SectionHeader>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.5rem" }}>
                    {ACHIEVEMENTS.filter(a => a.cat === cat).map(a => {
                      const done = !!achievements[a.id];
                      return (
                        <div key={a.id} style={{ background: done ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)", border: `1px solid ${done ? "#818cf8" : "rgba(255,255,255,0.1)"}`, borderRadius: "0.5rem", padding: "0.5rem 0.6rem", opacity: done ? 1 : 0.5 }}>
                          <div style={{ fontSize: "1.2rem" }}>{done ? a.icon : "🔒"}</div>
                          <p style={{ fontSize: "0.72rem", fontWeight: "bold", margin: "0.15rem 0 0.05rem", lineHeight: 1.2 }}>{a.name}</p>
                          <p style={{ fontSize: "0.62rem", color: "#c7d2fe", margin: 0, lineHeight: 1.3 }}>{done ? a.desc : "???"}</p>
                          {done && a.rewardDesc && <p style={{ fontSize: "0.58rem", color: "#fbbf24", margin: "0.1rem 0 0", fontWeight: "bold" }}>🎁 {a.rewardDesc}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {/* What Now? — only shown when unlocked */}
              {achievements["what_now"] && (() => {
                const a = ACHIEVEMENTS.find(x => x.id === "what_now");
                return (
                  <div style={{ marginTop: "0.5rem" }}>
                    <SectionHeader>🌀 Secret</SectionHeader>
                    <div onClick={handleWhatNowClick} style={{ background: "rgba(167,139,250,0.2)", border: "2px solid #a78bfa", borderRadius: "0.5rem", padding: "0.75rem 1rem", cursor: "pointer", textAlign: "center", transition: "all 0.2s", userSelect: "none", animation: "mysteryGlow 2s ease-in-out infinite" }}>
                      <div style={{ fontSize: "1.8rem" }}>{a.icon}</div>
                      <p style={{ fontSize: "0.85rem", fontWeight: "bold", margin: "0.2rem 0 0.1rem" }}>{a.name}</p>
                      <p style={{ fontSize: "0.68rem", color: "#c7d2fe", margin: 0 }}>{a.desc}</p>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.6rem" }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: i < whatNowClicks ? "#a78bfa" : "rgba(255,255,255,0.15)", border: "1.5px solid #a78bfa", transition: "background 0.2s" }} />
                        ))}
                      </div>
                    </div>
                    {whatNowMsg && <p style={{ textAlign: "center", color: "#fca5a5", fontSize: "0.78rem", marginTop: "0.5rem", lineHeight: 1.4 }}>{whatNowMsg}</p>}
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BONUS BUBBLE */}
      <AnimatePresence>
        {bonusVisible && (
          <div style={{ position: "fixed", top: `${bonusY}%`, left: `${bonusX}%`, transform: "translate(-50%,-50%)", zIndex: 60 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <button onClick={handleBonus} style={{ backgroundColor: "#22c55e", width: "80px", height: "80px", borderRadius: "50%", color: "white", fontWeight: "bold", border: "3px solid #16a34a", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", fontSize: "0.75rem", boxShadow: "0 0 16px rgba(34,197,94,0.7)", flexShrink: 0 }}>
                <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>🎁</span>
                <span>+{(100 * multiplier).toLocaleString()}</span>
              </button>
              <div style={{ width: "80px", height: "6px", background: "#fff3", marginTop: "6px", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "6px", width: `${(bonusTimer / 7.6) * 100}%`, background: "#22c55e", transition: "width 0.1s linear" }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* END SCREEN */}
      <AnimatePresence>
        {endScreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            style={{ position: "fixed", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2000, overflow: "hidden" }}>

            {/* White hole — grows through continue phases */}
            {!endPhase.startsWith("reset") && (
              <motion.div
                animate={{
                  width: { main: 120, continue_1: 180, continue_2: 260, continue_3: 380, continue_4: 2800 }[endPhase] ?? 120,
                  height: { main: 120, continue_1: 180, continue_2: 260, continue_3: 380, continue_4: 2800 }[endPhase] ?? 120,
                }}
                transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
                style={{ borderRadius: "50%", background: "white", flexShrink: 0, position: "absolute",
                  boxShadow: endPhase === "continue_4" ? "none" : "0 0 80px #fffa, 0 0 160px #fff6" }}
              />
            )}

            <AnimatePresence mode="wait">
              {endPhase === "main" && (
                <motion.div key="main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: 0.4 }}
                  style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", marginTop: "180px" }}>
                  <p style={{ fontSize: "1.5rem", color: "white", letterSpacing: "0.06em", textAlign: "center", textShadow: "0 0 30px #fff8" }}>So... you reached the end...</p>
                  <div style={{ display: "flex", gap: "1.5rem" }}>
                    <button onClick={handleEndContinue} style={{ background: "rgba(255,255,255,0.12)", border: "2px solid white", color: "white", padding: "0.65rem 2rem", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", backdropFilter: "blur(4px)" }}>Continue</button>
                    <button onClick={handleEndReset} style={{ background: "rgba(255,0,0,0.25)", border: "2px solid #ff4444", color: "white", padding: "0.65rem 2rem", borderRadius: "0.5rem", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>RESET</button>
                  </div>
                </motion.div>
              )}

              {endPhase === "continue_1" && (
                <motion.p key="c1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ position: "relative", fontSize: "1.6rem", color: "white", letterSpacing: "0.1em", textAlign: "center", marginTop: "220px", textShadow: "0 0 20px #fff" }}>
                  You have proven yourself.
                </motion.p>
              )}
              {endPhase === "continue_2" && (
                <motion.p key="c2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ position: "relative", fontSize: "1.6rem", color: "#fbbf24", letterSpacing: "0.08em", textAlign: "center", marginTop: "280px", textShadow: "0 0 20px #fbbf2488" }}>
                  The sloth gods are pleased.
                </motion.p>
              )}
              {endPhase === "continue_3" && (
                <motion.p key="c3" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0.8] }} exit={{ opacity: 0 }} transition={{ duration: 2 }}
                  style={{ position: "relative", fontSize: "2rem", color: "white", letterSpacing: "0.12em", textAlign: "center", marginTop: "360px", fontStyle: "italic", textShadow: "0 0 40px #ffff" }}>
                  You shall be released...
                </motion.p>
              )}
              {endPhase === "continue_4" && null}

              {endPhase === "reset_1" && (
                <motion.p key="r1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: "relative", fontSize: "3rem", color: "white", letterSpacing: "0.6em" }}>...</motion.p>
              )}
              {endPhase === "reset_2" && (
                <motion.p key="r2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: "relative", fontSize: "1.3rem", color: "#ef4444", letterSpacing: "0.08em", textAlign: "center" }}>
                  Initiating memory wipe...
                </motion.p>
              )}
              {endPhase === "reset_3" && (
                <motion.p key="r3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: "relative", fontSize: "1.1rem", color: "#fca5a5", letterSpacing: "0.06em", textAlign: "center" }}>
                  Warning: This action is irreversible.
                </motion.p>
              )}
              {endPhase === "reset_4" && (
                <motion.div key="r4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: "relative", fontFamily: "monospace", color: "#00ff88", textAlign: "left", maxWidth: "520px", width: "90vw", padding: "1.5rem 2rem", border: "1px solid #00ff8866", borderRadius: "0.5rem", background: "#001a0a" }}>
                  <p style={{ margin: "0 0 0.5rem", color: "#444", animation: "termLine 0.1s ease 0s both" }}>root@sloth-terminal:~$</p>
                  <p style={{ margin: "0 0 0.4rem", animation: "termLine 0.4s ease 0.3s both" }}>Welcome to Sloth terminal.</p>
                  <p style={{ margin: "0 0 0.4rem", animation: "termLine 0.4s ease 0.8s both" }}>Commands here:</p>
                  <p style={{ margin: "0 0 1.2rem", color: "#ffff88", animation: "termLine 0.4s ease 1.3s both" }}>$ sudo run user_forget.bat &amp;&amp; clear local browser.cache</p>
                  <p style={{ margin: "0 0 0.6rem", color: "#aaa", fontSize: "0.85rem", animation: "termLine 0.4s ease 1.9s both" }}>Erasing memories...</p>
                  <div style={{ background: "#00ff8822", border: "1px solid #00ff8866", borderRadius: "0.25rem", padding: "0.3rem", animation: "termLine 0.4s ease 2.2s both" }}>
                    <div style={{ background: "#00ff88", height: "0.6rem", borderRadius: "0.25rem", width: "0%", animation: "terminalBar 3s linear 2.5s forwards" }} />
                  </div>
                  <p style={{ margin: "0.8rem 0 0", color: "#00ff8899", fontSize: "0.8rem", animation: "termLine 0.4s ease 5.6s both" }}>Done. All data removed.</p>
                </motion.div>
              )}
              {endPhase === "reset_5" && (
                <motion.div key="r5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                  <p style={{ fontSize: "1.3rem", color: "#00ff88", letterSpacing: "0.1em" }}>Memory erased.</p>
                  <p style={{ fontSize: "1.8rem", color: "white", letterSpacing: "0.15em", fontStyle: "italic" }}>Goodbye.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN PANEL */}
      <AnimatePresence>
        {adminOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalWrap} onClick={e => { if (e.target === e.currentTarget) setAdminOpen(false); }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} style={{ ...modalBox, border: "2px solid #22c55e", boxShadow: "0 0 50px #22c55e44" }}>
              <button onClick={() => setAdminOpen(false)} style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "none", border: "none", color: "white", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
              <h2 style={{ marginBottom: "0.1rem", fontSize: "1.3rem", color: "#22c55e" }}>🔧 Admin Panel</h2>
              <p style={{ color: "#6b7280", fontSize: "0.7rem", marginBottom: "0.75rem" }}>SCOG — Sloth Clicker OG debug mode</p>
              <SectionHeader>💰 Score</SectionHeader>
              <button onClick={() => setScore(s => s + 1000000)} style={btnStyle("#3b82f6", false)}>+1,000,000 score</button>
              <button onClick={() => setScore(s => s + 100000000)} style={btnStyle("#1d4ed8", false)}>+100,000,000 score</button>
              <button onClick={() => setScore(999999999)} style={btnStyle("#7c3aed", false)}>Set score to 999,999,999</button>
              <SectionHeader>⚡ Multiplier</SectionHeader>
              <button onClick={() => setMultiplier(m => m + 10)} style={btnStyle("#f59e0b", false)}>+10 multiplier</button>
              <button onClick={() => setMultiplier(m => m * 10)} style={btnStyle("#d97706", false)}>×10 multiplier</button>
              <SectionHeader>🤖 Units</SectionHeader>
              <button onClick={() => setAutoClickers(a => a + 10)} style={btnStyle("#10b981", false)}>+10 Baby Sloths</button>
              <button onClick={() => setSlothGangs(g => g + 5)} style={btnStyle("#059669", false)}>+5 Sloth Gangs</button>
              <button onClick={() => setSlothEmpires(e => e + 3)} style={btnStyle("#047857", false)}>+3 Sloth Empires</button>
              <SectionHeader>🏆 Achievements</SectionHeader>
              <button onClick={() => ACHIEVEMENTS.forEach(a => unlock(a.id))} style={btnStyle("#6366f1", false)}>Unlock ALL achievements</button>
              <SectionHeader>🎲 Events</SectionHeader>
              <button onClick={() => setCodeUnlocked(true)} style={btnStyle("#ec4899", false)}>Unlock secret code (SL0TH)</button>
              <button onClick={() => triggerRainbow(10, false)} style={btnStyle("#db2777", false)}>Trigger Rainbow Event (10s)</button>
              <SectionHeader>🗑️ Danger Zone</SectionHeader>
              <button onClick={() => { resetAll(); setAdminOpen(false); }} style={btnStyle("#ef4444", false)}>⚠️ Reset everything</button>
              <hr style={{ borderColor: "#22c55e22", margin: "0.75rem 0" }} />
              <p style={{ fontSize: "0.65rem", color: "#6b7280", lineHeight: 1.6 }}>
                Score: {score.toLocaleString()} | Mult: x{multiplier} | Clicks: {totalClicks.toLocaleString()}<br />
                Sloths: {autoClickers} | Gangs: {slothGangs} | Empires: {slothEmpires}<br />
                Prestige: {prestigeCount} | Achievements: {Object.keys(achievements).length}/{ACHIEVEMENTS.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLICK POPUPS */}
      {popups.map(p => (
        <div key={p.id} style={{ position: "fixed", left: p.x, top: p.y, transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 999 }}>
          <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -70 }} transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ color: p.color, fontWeight: "bold", fontSize: p.big ? "1.4rem" : "1.1rem", textShadow: "0 2px 8px rgba(0,0,0,0.9)", userSelect: "none", whiteSpace: "nowrap" }}>
            {p.text}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

const style = document.createElement("style");
style.innerHTML = `
@keyframes shopRainbow { 0% { background-position: 0% 50%; } 100% { background-position: 300% 50%; } }
@keyframes shopGlow { 0%,100% { box-shadow: 0 0 18px rgba(200,100,255,0.7),0 0 8px rgba(255,255,255,0.3); } 50% { box-shadow: 0 0 36px rgba(80,200,255,0.9),0 0 16px rgba(255,255,255,0.5); } }
@keyframes prestigeShift { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
@keyframes rainbowThrob { 0%{background-position:0% 50%;opacity:0.55}25%{background-position:50% 0%;opacity:0.75}50%{background-position:100% 50%;opacity:0.55}75%{background-position:50% 100%;opacity:0.75}100%{background-position:0% 50%;opacity:0.55} }
@keyframes rainbowText { 0%{color:#ff4444}16%{color:#ff8800}33%{color:#ffff00}50%{color:#00ff88}66%{color:#4488ff}83%{color:#cc44ff}100%{color:#ff4444} }
@keyframes critFlash { 0%{opacity:1}100%{opacity:0} }
@keyframes terminalBar { 0%{width:0%}100%{width:100%} }
@keyframes termLine { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
@keyframes crackDraw { from{stroke-dashoffset:150} to{stroke-dashoffset:0} }
@keyframes mysteryGlow { 0%,100%{box-shadow:0 0 10px rgba(129,140,248,0.4),0 0 24px rgba(129,140,248,0.2)} 50%{box-shadow:0 0 24px rgba(129,140,248,0.9),0 0 48px rgba(129,140,248,0.5)} }`;
document.head.appendChild(style);
