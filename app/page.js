"use client";
import { useState, useRef, useEffect } from "react";
import FireEmbers from '../components/FireEmbers';
import GlobalToast from '../components/GlobalToast';
import PairingModal from '../components/PairingModal';
import Header from '../components/Header';
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, generateHunterID, generatePairingCode } from "../lib/firebase";

// ─────────────────────────────────────────────────────────────
// 📚 GIZLi OTOMATIK ALGILAMA SÖZLÜĞÜ (Silent Auto-detect Database)
// ─────────────────────────────────────────────────────────────
const BOSS_DATABASE = [
  // ── ELDEN RING (Base Game) ────────────────────────────────────
  { isim: "Margit, the Fell Omen", oyun: "Elden Ring" },
  { isim: "Godrick the Grafted", oyun: "Elden Ring" },
  { isim: "Red Wolf of Radagon", oyun: "Elden Ring" },
  { isim: "Rennala, Queen of the Full Moon", oyun: "Elden Ring" },
  { isim: "Starscourge Radahn", oyun: "Elden Ring" },
  { isim: "Rykard, Lord of Blasphemy", oyun: "Elden Ring" },
  { isim: "Morgott, the Omen King", oyun: "Elden Ring" },
  { isim: "Fire Giant", oyun: "Elden Ring" },
  { isim: "Godskin Duo", oyun: "Elden Ring" },
  { isim: "Maliketh, the Black Blade", oyun: "Elden Ring" },
  { isim: "Godfrey, First Elden Lord", oyun: "Elden Ring" },
  { isim: "Hoarah Loux, Warrior", oyun: "Elden Ring" },
  { isim: "Radagon of the Golden Order", oyun: "Elden Ring" },
  { isim: "Elden Beast", oyun: "Elden Ring" },
  { isim: "Malenia, Blade of Miquella", oyun: "Elden Ring" },
  { isim: "Mohg, Lord of Blood", oyun: "Elden Ring" },
  { isim: "Dragonlord Placidusax", oyun: "Elden Ring" },
  { isim: "Lichdragon Fortissax", oyun: "Elden Ring" },
  { isim: "Astel, Naturalborn of the Void", oyun: "Elden Ring" },
  { isim: "Mimic Tear", oyun: "Elden Ring" },
  { isim: "Valiant Gargoyle", oyun: "Elden Ring" },
  { isim: "Magma Wyrm Makar", oyun: "Elden Ring" },
  { isim: "Commander Niall", oyun: "Elden Ring" },
  { isim: "Loretta, Knight of the Haligtree", oyun: "Elden Ring" },
  { isim: "Royal Knight Loretta", oyun: "Elden Ring" },
  { isim: "Elemer of the Briar", oyun: "Elden Ring" },
  { isim: "Crucible Knight Ordovis", oyun: "Elden Ring" },
  { isim: "Godskin Apostle", oyun: "Elden Ring" },
  { isim: "Godskin Noble", oyun: "Elden Ring" },
  { isim: "Leonine Misbegotten", oyun: "Elden Ring" },
  { isim: "Ancestor Spirit", oyun: "Elden Ring" },
  { isim: "Regal Ancestor Spirit", oyun: "Elden Ring" },
  { isim: "Tree Sentinel", oyun: "Elden Ring" },
  { isim: "Flying Dragon Agheel", oyun: "Elden Ring" },
  { isim: "Glintstone Dragon Smarag", oyun: "Elden Ring" },
  { isim: "Borealis the Freezing Fog", oyun: "Elden Ring" },
  { isim: "Decaying Ekzykes", oyun: "Elden Ring" },
  { isim: "Glintstone Dragon Adula", oyun: "Elden Ring" },
  { isim: "Ancient Dragon Lansseax", oyun: "Elden Ring" },
  { isim: "Alecto, Black Knife Ringleader", oyun: "Elden Ring" },
  { isim: "Esgar, Priest of Blood", oyun: "Elden Ring" },
  { isim: "Fell Twins", oyun: "Elden Ring" },
  // ── ELDEN RING (Shadow of the Erdtree DLC) ───────────────────
  { isim: "Divine Beast Dancing Lion", oyun: "Elden Ring" },
  { isim: "Rellana, Twin Moon Knight", oyun: "Elden Ring" },
  { isim: "Messmer the Impaler", oyun: "Elden Ring" },
  { isim: "Commander Gaius", oyun: "Elden Ring" },
  { isim: "Romina, Saint of the Bud", oyun: "Elden Ring" },
  { isim: "Scadutree Avatar", oyun: "Elden Ring" },
  { isim: "Midra, Lord of Frenzied Flame", oyun: "Elden Ring" },
  { isim: "Bayle the Dread", oyun: "Elden Ring" },
  { isim: "Putrescent Knight", oyun: "Elden Ring" },
  { isim: "Metyr, Mother of Fingers", oyun: "Elden Ring" },
  { isim: "Promised Consort Radahn", oyun: "Elden Ring" },
  { isim: "Needle Knight Leda", oyun: "Elden Ring" },
  { isim: "Count Ymir, Mother of Fingers", oyun: "Elden Ring" },

  // ── SEKİRO: SHADOWS DIE TWICE ────────────────────────────────
  { isim: "Gyoubu Masataka Oniwa", oyun: "Sekiro" },
  { isim: "Lady Butterfly", oyun: "Sekiro" },
  { isim: "Genichiro Ashina", oyun: "Sekiro" },
  { isim: "Folding Screen Monkeys", oyun: "Sekiro" },
  { isim: "Guardian Ape", oyun: "Sekiro" },
  { isim: "Headless Ape", oyun: "Sekiro" },
  { isim: "Corrupted Monk (Illusion)", oyun: "Sekiro" },
  { isim: "Corrupted Monk", oyun: "Sekiro" },
  { isim: "Divine Dragon", oyun: "Sekiro" },
  { isim: "Owl", oyun: "Sekiro" },
  { isim: "Owl (Father)", oyun: "Sekiro" },
  { isim: "Emma, the Gentle Blade", oyun: "Sekiro" },
  { isim: "Isshin Ashina", oyun: "Sekiro" },
  { isim: "Isshin, the Sword Saint", oyun: "Sekiro" },
  { isim: "Demon of Hatred", oyun: "Sekiro" },
  { isim: "Genichiro, Way of Tomoe", oyun: "Sekiro" },
  { isim: "O'Rin of the Water", oyun: "Sekiro" },
  { isim: "Armored Warrior", oyun: "Sekiro" },
  { isim: "Juzou the Drunkard", oyun: "Sekiro" },
  { isim: "Tokujiro the Glutton", oyun: "Sekiro" },
  { isim: "Snake Eyes Shirafuji", oyun: "Sekiro" },
  { isim: "Snake Eyes Shirahagi", oyun: "Sekiro" },
  { isim: "Lone Shadow Masanaga", oyun: "Sekiro" },
  { isim: "Lone Shadow Vilehand", oyun: "Sekiro" },
  { isim: "Seven Ashina Spears - Shume Masaji Oniwa", oyun: "Sekiro" },

  // ── BLOODBORNE ───────────────────────────────────────────────
  { isim: "Cleric Beast", oyun: "Bloodborne" },
  { isim: "Father Gascoigne", oyun: "Bloodborne" },
  { isim: "Blood-Starved Beast", oyun: "Bloodborne" },
  { isim: "Vicar Amelia", oyun: "Bloodborne" },
  { isim: "The Witch of Hemwick", oyun: "Bloodborne" },
  { isim: "Shadow of Yharnam", oyun: "Bloodborne" },
  { isim: "Rom, the Vacuous Spider", oyun: "Bloodborne" },
  { isim: "The One Reborn", oyun: "Bloodborne" },
  { isim: "Micolash, Host of the Nightmare", oyun: "Bloodborne" },
  { isim: "Mergo's Wet Nurse", oyun: "Bloodborne" },
  { isim: "Celestial Emissary", oyun: "Bloodborne" },
  { isim: "Ebrietas, Daughter of the Cosmos", oyun: "Bloodborne" },
  { isim: "Gehrman, the First Hunter", oyun: "Bloodborne" },
  { isim: "Moon Presence", oyun: "Bloodborne" },
  { isim: "Darkbeast Paarl", oyun: "Bloodborne" },
  { isim: "Amygdala", oyun: "Bloodborne" },
  { isim: "Alfred, Hunter of Vilebloods", oyun: "Bloodborne" },
  // Bloodborne DLC
  { isim: "Ludwig, the Accursed", oyun: "Bloodborne" },
  { isim: "Living Failures", oyun: "Bloodborne" },
  { isim: "Lady Maria of the Astral Clocktower", oyun: "Bloodborne" },
  { isim: "Laurence, the First Vicar", oyun: "Bloodborne" },
  { isim: "Orphan of Kos", oyun: "Bloodborne" },
  { isim: "Logarius", oyun: "Bloodborne" },

  // ── DARK SOULS III ───────────────────────────────────────────
  { isim: "Iudex Gundyr", oyun: "Dark Souls III" },
  { isim: "Vordt of the Boreal Valley", oyun: "Dark Souls III" },
  { isim: "Curse-rotted Greatwood", oyun: "Dark Souls III" },
  { isim: "Crystal Sage", oyun: "Dark Souls III" },
  { isim: "Deacons of the Deep", oyun: "Dark Souls III" },
  { isim: "Abyss Watchers", oyun: "Dark Souls III" },
  { isim: "High Lord Wolnir", oyun: "Dark Souls III" },
  { isim: "Old Demon King", oyun: "Dark Souls III" },
  { isim: "Pontiff Sulyvahn", oyun: "Dark Souls III" },
  { isim: "Yhorm the Giant", oyun: "Dark Souls III" },
  { isim: "Aldrich, Devourer of Gods", oyun: "Dark Souls III" },
  { isim: "Dancer of the Boreal Valley", oyun: "Dark Souls III" },
  { isim: "Oceiros, the Consumed King", oyun: "Dark Souls III" },
  { isim: "Champion Gundyr", oyun: "Dark Souls III" },
  { isim: "Ancient Wyvern", oyun: "Dark Souls III" },
  { isim: "Nameless King", oyun: "Dark Souls III" },
  { isim: "Lothric, Younger Prince", oyun: "Dark Souls III" },
  { isim: "Lorian, Elder Prince", oyun: "Dark Souls III" },
  { isim: "Soul of Cinder", oyun: "Dark Souls III" },
  { isim: "Dragonslayer Armour", oyun: "Dark Souls III" },
  // Dark Souls III DLC
  { isim: "Sister Friede", oyun: "Dark Souls III" },
  { isim: "Father Ariandel", oyun: "Dark Souls III" },
  { isim: "Slave Knight Gael", oyun: "Dark Souls III" },
  { isim: "Darkeater Midir", oyun: "Dark Souls III" },
  { isim: "Halflight, Spear of the Church", oyun: "Dark Souls III" },
  { isim: "Demon Prince", oyun: "Dark Souls III" },
  { isim: "Champion's Gravetender", oyun: "Dark Souls III" },

  // ── DARK SOULS II ────────────────────────────────────────────
  { isim: "The Last Giant", oyun: "Dark Souls II" },
  { isim: "Pursuer", oyun: "Dark Souls II" },
  { isim: "Flexile Sentry", oyun: "Dark Souls II" },
  { isim: "Ruin Sentinels", oyun: "Dark Souls II" },
  { isim: "Lost Sinner", oyun: "Dark Souls II" },
  { isim: "Belfry Gargoyles", oyun: "Dark Souls II" },
  { isim: "Mytha, the Baneful Queen", oyun: "Dark Souls II" },
  { isim: "Smelter Demon", oyun: "Dark Souls II" },
  { isim: "Old Iron King", oyun: "Dark Souls II" },
  { isim: "Scorpioness Najka", oyun: "Dark Souls II" },
  { isim: "Duke's Dear Freja", oyun: "Dark Souls II" },
  { isim: "Royal Rat Authority", oyun: "Dark Souls II" },
  { isim: "Executioner's Chariot", oyun: "Dark Souls II" },
  { isim: "Skeleton Lords", oyun: "Dark Souls II" },
  { isim: "Demon of Song", oyun: "Dark Souls II" },
  { isim: "Dragonrider", oyun: "Dark Souls II" },
  { isim: "Twin Dragonriders", oyun: "Dark Souls II" },
  { isim: "Looking Glass Knight", oyun: "Dark Souls II" },
  { isim: "Velstadt, the Royal Aegis", oyun: "Dark Souls II" },
  { isim: "Vendrick", oyun: "Dark Souls II" },
  { isim: "Guardian Dragon", oyun: "Dark Souls II" },
  { isim: "Ancient Dragon", oyun: "Dark Souls II" },
  { isim: "Giant Lord", oyun: "Dark Souls II" },
  { isim: "Nashandra", oyun: "Dark Souls II" },
  { isim: "Throne Watcher & Throne Defender", oyun: "Dark Souls II" },
  { isim: "Darklurker", oyun: "Dark Souls II" },
  { isim: "The Rotten", oyun: "Dark Souls II" },
  // Dark Souls II DLC
  { isim: "Fume Knight", oyun: "Dark Souls II" },
  { isim: "Sir Alonne", oyun: "Dark Souls II" },
  { isim: "Burnt Ivory King", oyun: "Dark Souls II" },
  { isim: "Lud & Zallen, the King's Pets", oyun: "Dark Souls II" },
  { isim: "Elana, the Squalid Queen", oyun: "Dark Souls II" },
  { isim: "Sinh, the Slumbering Dragon", oyun: "Dark Souls II" },
  { isim: "Nadalia, Bride of Ash", oyun: "Dark Souls II" },
  { isim: "Afflicted Graverobber", oyun: "Dark Souls II" },

  // ── DARK SOULS ───────────────────────────────────────────────
  { isim: "Asylum Demon", oyun: "Dark Souls" },
  { isim: "Taurus Demon", oyun: "Dark Souls" },
  { isim: "Capra Demon", oyun: "Dark Souls" },
  { isim: "Moonlight Butterfly", oyun: "Dark Souls" },
  { isim: "Gaping Dragon", oyun: "Dark Souls" },
  { isim: "Chaos Witch Quelaag", oyun: "Dark Souls" },
  { isim: "Ceaseless Discharge", oyun: "Dark Souls" },
  { isim: "Centipede Demon", oyun: "Dark Souls" },
  { isim: "Demon Firesage", oyun: "Dark Souls" },
  { isim: "Iron Golem", oyun: "Dark Souls" },
  { isim: "Ornstein & Smough", oyun: "Dark Souls" },
  { isim: "Dragon Slayer Ornstein", oyun: "Dark Souls" },
  { isim: "Executioner Smough", oyun: "Dark Souls" },
  { isim: "Sif, the Great Grey Wolf", oyun: "Dark Souls" },
  { isim: "Crossbreed Priscilla", oyun: "Dark Souls" },
  { isim: "Dark Sun Gwyndolin", oyun: "Dark Souls" },
  { isim: "Pinwheel", oyun: "Dark Souls" },
  { isim: "Gravelord Nito", oyun: "Dark Souls" },
  { isim: "Bed of Chaos", oyun: "Dark Souls" },
  { isim: "Seath the Scaleless", oyun: "Dark Souls" },
  { isim: "Four Kings", oyun: "Dark Souls" },
  { isim: "Gwyn, Lord of Cinder", oyun: "Dark Souls" },
  { isim: "Stray Demon", oyun: "Dark Souls" },
  // Dark Souls DLC
  { isim: "Artorias the Abysswalker", oyun: "Dark Souls" },
  { isim: "Manus, Father of the Abyss", oyun: "Dark Souls" },
  { isim: "Sanctuary Guardian", oyun: "Dark Souls" },
  { isim: "Black Dragon Kalameet", oyun: "Dark Souls" },

  // ── DEMON'S SOULS ────────────────────────────────────────────
  { isim: "Vanguard", oyun: "Demon's Souls" },
  { isim: "Phalanx", oyun: "Demon's Souls" },
  { isim: "Tower Knight", oyun: "Demon's Souls" },
  { isim: "Penetrator", oyun: "Demon's Souls" },
  { isim: "False King Allant", oyun: "Demon's Souls" },
  { isim: "Old King Allant", oyun: "Demon's Souls" },
  { isim: "Armor Spider", oyun: "Demon's Souls" },
  { isim: "Flamelurker", oyun: "Demon's Souls" },
  { isim: "Dragon God", oyun: "Demon's Souls" },
  { isim: "Fool's Idol", oyun: "Demon's Souls" },
  { isim: "Maneater", oyun: "Demon's Souls" },
  { isim: "Old Monk", oyun: "Demon's Souls" },
  { isim: "Adjudicator", oyun: "Demon's Souls" },
  { isim: "Old Hero", oyun: "Demon's Souls" },
  { isim: "Storm King", oyun: "Demon's Souls" },
  { isim: "Maiden Astraea", oyun: "Demon's Souls" },
  { isim: "Garl Vinland", oyun: "Demon's Souls" },
  { isim: "Dirty Colossus", oyun: "Demon's Souls" },
  { isim: "Leechmonger", oyun: "Demon's Souls" },

  // ── LIES OF P ────────────────────────────────────────────────
  { isim: "Parade Master", oyun: "Lies of P" },
  { isim: "Scrapped Watchman", oyun: "Lies of P" },
  { isim: "Mad Donkey", oyun: "Lies of P" },
  { isim: "Fallen Archbishop Andreus", oyun: "Lies of P" },
  { isim: "King's Flame, Fuoco", oyun: "Lies of P" },
  { isim: "Black Rabbit Brotherhood", oyun: "Lies of P" },
  { isim: "Puppet-Devouring Green Monster of the Swamp", oyun: "Lies of P" },
  { isim: "Champion Victor", oyun: "Lies of P" },
  { isim: "Door Guardian", oyun: "Lies of P" },
  { isim: "Corrupted Parade Master", oyun: "Lies of P" },
  { isim: "Laxasia The Complete", oyun: "Lies of P" },
  { isim: "Simon Manus, Arm of God", oyun: "Lies of P" },
  { isim: "Simon Manus, Awakened God", oyun: "Lies of P" },
  { isim: "Nameless Puppet", oyun: "Lies of P" },
  { isim: "Rookie Explorer Hugo", oyun: "Lies of P" },
  { isim: "White Lady Lorenzini Isabelle", oyun: "Lies of P" },
  { isim: "Elder of the Covenant", oyun: "Lies of P" },
];

const SplashScreen = ({ onEnter, audioPlay }) => {
  const [isFading, setIsFading] = useState(false);

  const handleClick = () => {
    if (isFading) return;
    audioPlay();
    setIsFading(true);
    setTimeout(() => {
      onEnter();
    }, 1500); // 1.5s fade out
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center cursor-pointer transition-all duration-[1500ms] ease-in-out ${
        isFading ? "opacity-0 pointer-events-none bg-black" : "opacity-100"
      }`}
      style={{
        background: isFading ? "#000" : "radial-gradient(circle at center, #110e0a 0%, #000000 100%)"
      }}
    >
      <div className={`flex flex-col items-center gap-6 transition-all duration-[1200ms] ease-in-out ${isFading ? "blur-sm scale-110 opacity-0" : "scale-100 opacity-100 hover:scale-105"}`}>
        {/* Süsleme Çizgisi */}
        <div className="w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-[#AC8A34] to-transparent opacity-50"></div>
        
        <h1 className="font-serif text-[#E6DFC8] text-xl md:text-2xl tracking-[0.4em] md:tracking-[0.5em] uppercase text-center antialiased drop-shadow-sm">
          GİRİŞ İÇİN TIKLAYIN
        </h1>
        
        <p className="font-sans text-[#8A7A4A] text-[10px] md:text-xs tracking-[0.8em] uppercase opacity-70 text-center">
          AV BAŞLIYOR...
        </p>

        {/* Süsleme Çizgisi */}
        <div className="w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-[#AC8A34] to-transparent opacity-50"></div>
      </div>
    </div>
  );
};

export default function Home() {
  const [digerSecildiMi, setDigerSecildiMi] = useState(false);

  // Müzik / Ses ayarları
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [prevVolume, setPrevVolume] = useState(0.5);
  const audioRef = useRef(null);
  const slashAudioRef = useRef(null);

  // Giriş Ekranı (Splash Screen) State & Logic
  const [hasEntered, setHasEntered] = useState(false);

  const triggerAudioPlay = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Oynatma hatası:", e));
      setIsMuted(false);
      if (volume === 0) setVolume(0.5);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
    if (slashAudioRef.current) {
      slashAudioRef.current.volume = volume;
      slashAudioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // ─────────────────────────────────────────────────────────────
  // 🎓 CUSTOM DROPDOWN STATE'İ
  // ─────────────────────────────────────────────────────────────
  const [acilirMenuAcikMi, setAcilirMenuAcikMi] = useState(false);
  const acilirMenuRef = useRef(null);

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    function handleClickOutside(e) {
      if (acilirMenuRef.current && !acilirMenuRef.current.contains(e.target)) {
        setAcilirMenuAcikMi(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Oyun listesi — dropdown'da gösterilecek seçenekler
  const oyunSecenekleri = ["Elden Ring", "Sekiro", "Bloodborne", "Dark Souls III", "Dark Souls II", "Dark Souls", "Demon's Souls", "Lies of P", "Diğer"];

  // ─────────────────────────────────────────────────────────────
  // 💾 BOSS LİSTESİ STATE'İ + FIREBASE PERSISTENCE
  // ─────────────────────────────────────────────────────────────
  const [isMounted, setIsMounted] = useState(false);
  const [bosslar, setBosslar] = useState([]);
  const [myHunterId, setMyHunterId] = useState("");
  const [activeHunterId, setActiveHunterId] = useState("");
  const [activeRole, setActiveRole] = useState("owner");
  const [isKindled, setIsKindled] = useState(false);

  // Hydration korumalı mount: hunter_id yükle veya üret
  useEffect(() => {
    try {
      let storedId = localStorage.getItem("hunter_id");
      if (!storedId) {
        storedId = generateHunterID();
        localStorage.setItem("hunter_id", storedId);
      }
      setMyHunterId(storedId);
      setActiveHunterId(storedId);
      setActiveRole("owner");
      
      const storedKindled = localStorage.getItem("is_kindled") === "true";
      setIsKindled(storedKindled);
    } catch (e) {
      console.warn("localStorage erişim hatası:", e);
    }
    setIsMounted(true);
  }, []);

  const toggleKindle = () => {
    const newVal = !isKindled;
    setIsKindled(newVal);
    localStorage.setItem("is_kindled", newVal);
  };

  // Firebase Realtime Listener
  useEffect(() => {
    if (!activeHunterId) return;

    const unsub = onSnapshot(doc(db, "hunters", activeHunterId), (docSnap) => {
      if (docSnap.exists() && docSnap.data().bosslar) {
        setBosslar(docSnap.data().bosslar);
      }
    });

    return () => unsub(); // cleanup
  }, [activeHunterId]);

  // ─────────────────────────────────────────────────────────────
  // 🎓 FORM STATE'LERİ
  // ─────────────────────────────────────────────────────────────
  const [bossAdi, setBossAdi] = useState("");
  const [seciliOyun, setSeciliOyun] = useState(""); // Başlangıçta boş → dropdown'da "BİR OYUN SEÇİN"
  const [kesilenAnimasyonId, setKesilenAnimasyonId] = useState(null);

  // ─────────────────────────────────────────────────────────────
  // 🔍 GİZLİ OTOMATIK ALGILAMA (Silent Auto-detect)
  // Kullanıcı yazmaya başladıkça BOSS_DATABASE'de ara,
  // eşleşme bulursa oyunu otomatik seç.
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const q = bossAdi.trim();
    // FIX #5: Her uzunluk için tutarlı davranış
    if (q.length === 0) {
      setSeciliOyun("");
      setDigerSecildiMi(false);
      return;
    }
    if (q.length < 2) {
      // 1 karakter: auto-detect'i sıfırla ama bekle
      setDigerSecildiMi(false);
      return;
    }
    const query = q.toLowerCase();
    const eslesen = BOSS_DATABASE.find(b => b.isim.toLowerCase().includes(query));
    if (eslesen) {
      setDigerSecildiMi(false);
      setSeciliOyun(eslesen.oyun);
    } else if (q.length >= 5) {
      // 5+ karakter yazılınca ve eşleşme yoksa "Diğer" seç
      setDigerSecildiMi(true);
      setSeciliOyun("");
    } else {
      // 2-4 karakter arasında eşleşme yok: Diğer'i sıfırla (kullanıcı hala yazıyor)
      setDigerSecildiMi(false);
    }
  }, [bossAdi]);

  // ─────────────────────────────────────────────────────────────
  // ✨ ANİMASYON STATE'LERİ
  // ─────────────────────────────────────────────────────────────
  const [yeniEklenenId, setYeniEklenenId] = useState(null);
  const [olumAnimasyonId, setOlumAnimasyonId] = useState(null);
  const [silinenAnimasyonId, setSilinenAnimasyonId] = useState(null);
  const [globalToast, setGlobalToast] = useState({ isVisible: false, title: "", message: "", subMessage: "", type: "error", isLeaving: false });
  // FIX #2: Toast zamanlayıcılarını ref ile takip et (race condition önleme)
  const toastTimer1Ref = useRef(null);
  const toastTimer2Ref = useRef(null);

  const showToast = (title, message, subMessage = "", type = "error") => {
    if (toastTimer1Ref.current) clearTimeout(toastTimer1Ref.current);
    if (toastTimer2Ref.current) clearTimeout(toastTimer2Ref.current);
    
    setGlobalToast({ isVisible: true, title, message, subMessage, type, isLeaving: false });
    
    toastTimer1Ref.current = setTimeout(() => setGlobalToast(prev => ({ ...prev, isLeaving: true })), 3000);
    toastTimer2Ref.current = setTimeout(() => setGlobalToast(prev => ({ ...prev, isVisible: false })), 3400);
  };

  // Bileşen unmount olduğunda zamanlayıcıları temizle
  useEffect(() => {
    return () => {
      if (toastTimer1Ref.current) clearTimeout(toastTimer1Ref.current);
      if (toastTimer2Ref.current) clearTimeout(toastTimer2Ref.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 🔗 CİHAZ EŞLEŞTİRME (PAIRING) STATE'LERİ
  // ─────────────────────────────────────────────────────────────
  const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 🎓 TAB FİLTRE STATE'İ
  // Boss listesini oyuna göre filtrelemek için kullanılır.
  // "HEPSİ" seçiliyken tüm boss'lar gösterilir.
  // ─────────────────────────────────────────────────────────────
  const [aktifTab, setAktifTab] = useState("HEPSİ");
  const [displayedTab, setDisplayedTab] = useState("HEPSİ");
  const [isTabChanging, setIsTabChanging] = useState(false);

  const handleTabChange = (oyun) => {
    if (oyun === aktifTab) return;
    setAktifTab(oyun);
    setIsTabChanging(true);
    setTimeout(() => {
      setDisplayedTab(oyun);
      setIsTabChanging(false);
    }, 300);
  };

  // Boss listesindeki benzersiz oyun isimlerini çıkar
  const benzersizOyunlar = [...new Set(bosslar.map(b => b.oyun))];

  // ─────────────────────────────────────────────────────────────
  // 🎓 HESAPLANMIŞ DEĞERLER (Derived State)
  // ─────────────────────────────────────────────────────────────
  const kesilenSayisi = bosslar.filter(b => b.kesildiMi).length;
  const toplamSayi = bosslar.length;
  const toplamOlum = bosslar.reduce((toplam, b) => toplam + b.olumler, 0);

  // ─────────────────────────────────────────────────────────────
  // 🎓 FONKSİYONLAR
  // ─────────────────────────────────────────────────────────────

  // Yeni boss ekle
  const bossEkle = () => {
    if (activeRole === 'observer') return;
    if (!bossAdi.trim()) return;
    const newId = Date.now();
    const query = bossAdi.trim().toLowerCase();

    // Veritabanında eşleşen bir boss var mı?
    const eslesenler = BOSS_DATABASE.filter(b => b.isim.toLowerCase().includes(query));
    const eslesen = eslesenler.length > 0
      ? eslesenler.reduce((en, b) => b.isim.length < en.isim.length ? b : en)
      : null;

    const eklenecekIsim = eslesen ? eslesen.isim : bossAdi.trim();
    const eklenecekOyun = eslesen ? eslesen.oyun : (seciliOyun || "Diğer");

    // —— MÜKERRER KONTROL ——
    // Aynı isimde bir boss zaten listede var mı?
    const zatenVar = bosslar.some(
      b => b.isim.toLowerCase() === eklenecekIsim.toLowerCase()
    );

    if (zatenVar) {
      showToast(
        "Mühreden Zaten Yenik Düştü",
        eklenecekIsim,
        `${eklenecekOyun} — Bu düşman zaten mühürlenmiş`,
        "error"
      );
      return; // Ekleme yapma!
    }

    const yeniBoss = {
      id: newId,
      isim: eklenecekIsim,
      oyun: eklenecekOyun,
      olumler: 0,
      kesildiMi: false,
    };

    // Firestore'a yaz
    const yeniDizi = [...bosslar, yeniBoss];
    if (activeHunterId) {
      setDoc(doc(db, "hunters", activeHunterId), { bosslar: yeniDizi }, { merge: true });
    }

    setBossAdi("");

    // Mühürle Animasyonu Tetikle
    setYeniEklenenId(newId);
    setTimeout(() => setYeniEklenenId(null), 800);
  };

  // Enter tuşu ile de ekleyebilmek için
  const inputKeyDown = (e) => {
    if (e.key === "Enter") bossEkle();
  };

  // Ölüm sayısını 1 artır
  const olumArttir = (id) => {
    if (activeRole === 'observer') return;
    setOlumAnimasyonId(id);
    const yeniDizi = bosslar.map(b => b.id === id ? { ...b, olumler: b.olumler + 1 } : b);
    if (activeHunterId) {
      setDoc(doc(db, "hunters", activeHunterId), { bosslar: yeniDizi }, { merge: true });
    }
    setTimeout(() => setOlumAnimasyonId(null), 400);
  };

  // Boss'u kesildi olarak işaretle
  const kesil = (id) => {
    if (activeRole === 'observer') return;
    // Kılıç ses efektini çal
    if (slashAudioRef.current) {
      slashAudioRef.current.currentTime = 0;
      slashAudioRef.current.play().catch(e => console.log("Ses oynatılamadı:", e));
    }

    // Önce animasyonu tetikle
    setKesilenAnimasyonId(id);

    // Animasyonu izlemesi için 800ms bekle ve alt listeye at
    setTimeout(() => {
      const yeniDizi = bosslar.map(b => b.id === id ? { ...b, kesildiMi: true } : b);
      if (activeHunterId) {
        setDoc(doc(db, "hunters", activeHunterId), { bosslar: yeniDizi }, { merge: true });
      }
      setKesilenAnimasyonId(null);
    }, 800);
  };

  // Boss'u listeden sil
  const sil = (id) => {
    if (activeRole === 'observer') return;
    setSilinenAnimasyonId(id);
    setTimeout(() => {
      const updated = bosslar.filter(b => b.id !== id);

      // FIX #1: Silinen boss son oyunsa, orphaned tab'ı HEPSİ'ye döndür
      const halaVarMi = updated.some(b => b.oyun === aktifTab);
      if (aktifTab !== "HEPSİ" && !halaVarMi) {
        setAktifTab("HEPSİ");
        setDisplayedTab("HEPSİ");
      }

      if (activeHunterId) {
        setDoc(doc(db, "hunters", activeHunterId), { bosslar: updated }, { merge: true });
      }
      setSilinenAnimasyonId(null);
      showToast("Mühür Kırıldı", "Düşman kalıcı olarak silindi", "", "success");
    }, 500);
  };

  // Hydration Guard: SSR uyumsuzluğunu önle
  if (!isMounted) return null;

  return (
    <main className="min-h-screen lg:min-h-[80vh] flex flex-col items-center pt-12 md:pt-24 px-4 md:px-8 relative overflow-hidden">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 🔥 KINDLED (YÜKSEK KONTRAST) ARKA PLAN OVERLAY                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-500 ${isKindled ? 'bg-[#1a1917]/85' : 'bg-transparent'}`}></div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 🎓 SPLASH SCREEN (GİRİŞ EKRANI)                              */}
      {/* ─────────────────────────────────────────────────────────── */}
      {!hasEntered && <SplashScreen onEnter={() => setHasEntered(true)} audioPlay={triggerAudioPlay} />}

      {/* ─────────────────────────────────────────────────────── */}
      {/* 🔗 CİHAZ EŞLEŞTİRME (PAIRING) MODAL                        */}
      {/* ─────────────────────────────────────────────────────── */}
      <PairingModal 
        isOpen={isPairingModalOpen} 
        onClose={() => setIsPairingModalOpen(false)} 
        myHunterId={myHunterId} 
        setActiveHunterId={setActiveHunterId} 
        setActiveRole={setActiveRole}
        showToast={showToast} 
      />

      {/* Ateş köz animasyonu — en arka katman */}
      {/* FIX #3: toplamOlum prop'u ile ateş yoğunluğu dinamik */}
      <FireEmbers toplamOlum={toplamOlum} />

      {/* ─────────────────────────────────────────────────────── */}
      {/* 🔔 GLOBAL TOAST                                          */}
      {/* ─────────────────────────────────────────────────────── */}
      <GlobalToast toast={globalToast} />

      {/* Tüm UI içeriği canvas'ın önünde */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* ─────────────────────────────────────────────────────────── */}
        {/* 🎓 HEADER — Minimal & Zarif                                */}
        {/* ─────────────────────────────────────────────────────────── */}
        <Header 
          setIsPairingModalOpen={setIsPairingModalOpen}
          kesilenSayisi={kesilenSayisi}
          toplamSayi={toplamSayi}
          toplamOlum={toplamOlum}
          volume={volume}
          setVolume={setVolume}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          prevVolume={prevVolume}
          setPrevVolume={setPrevVolume}
          onVolumeToggle={() => {
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play().catch(e => console.log("Oynatma hatası:", e));
            }
          }}
          myHunterId={myHunterId}
          activeHunterId={activeHunterId}
          onReturnHome={() => {
            setActiveHunterId(myHunterId);
            setActiveRole('owner');
            showToast("Geri Dönüldü", "Kendi dünyanıza başarıyla döndünüz.", "", "success");
          }}
          isKindled={isKindled}
          toggleKindle={toggleKindle}
        />
        <audio ref={audioRef} src="/muzik.mp3" loop />
        <audio ref={slashAudioRef} src="/slashsound.mp3" preload="auto" />

        {/* ─────────────────────────────────────────────────────── */}
        {/* 🎓 INPUT PANELİ                                        */}
        {/* ─────────────────────────────────────────────────────── */}
        {activeRole !== 'observer' && (
          <div className="w-full max-w-5xl border border-[#4a3f2d]/70 p-[14px] md:p-6 relative flex flex-col gap-4 bg-[#d4af37]/[0.02]">
            {/* Köşe Süslemeleri */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#b8a665]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#b8a665]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#b8a665]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#b8a665]"></div>

            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-start">
              {/* Boss İsmi Inputu */}
              <div className={`w-full md:flex-1 border transition-colors duration-500 flex flex-col justify-center focus-within:border-[#d4af37] ${isKindled ? 'bg-white/10 border-white/30 hover:border-white/50' : 'bg-black/65 border-[#b89e6e]/30 hover:border-[#b89e6e]/60'}`}>
                <input
                  type="text"
                  placeholder="BOSS ADINI GİRİN..."
                  value={bossAdi}
                  onChange={(e) => setBossAdi(e.target.value)}
                  onKeyDown={inputKeyDown}
                  className="w-full bg-transparent px-[14px] py-[12px] md:px-5 md:py-3 h-[44px] text-xs font-serif tracking-widest text-stone-200 placeholder:text-[#8A7A4A]/70 focus:outline-none uppercase"
                />
              </div>

              {/* ─────────────────────────────────────────────────── */}
              {/* 🎓 CUSTOM DROPDOWN                                  */}
              {/* ─────────────────────────────────────────────────── */}
              <div className="w-full md:w-56 flex flex-col gap-2 relative" ref={acilirMenuRef}>
                {/* Dropdown Trigger */}
                <div
                  className={`border transition-colors duration-500 relative cursor-pointer flex items-center justify-between px-[14px] py-[12px] md:px-4 md:py-3 ${isKindled ? 'bg-white/10 border-white/30 hover:border-white/50' : 'bg-black/65 border-[#b89e6e]/30 hover:border-[#b89e6e]/60'}`}
                  onClick={() => setAcilirMenuAcikMi(!acilirMenuAcikMi)}
                >
                  <div className="text-xs font-serif tracking-widest text-stone-200 uppercase">
                    {digerSecildiMi
                      ? "DİĞER..."
                      : seciliOyun
                        ? seciliOyun.toUpperCase()
                        : <span className="text-[#4a3f2d]">BİR OYUN SEÇİN</span>
                    }
                  </div>
                  <div className={`text-[#8A7A4A] transition-transform flex-shrink-0 ${acilirMenuAcikMi ? "rotate-180" : ""}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>

                {/* DROPDOWN MENÜ */}
                {acilirMenuAcikMi && (
                  <ul className="absolute top-full left-0 right-0 mt-1 border border-[#332b1f] bg-[#0e0c08] z-50 max-h-72 overflow-y-auto custom-scrollbar">
                    {oyunSecenekleri.map((oyun) => (
                      <li
                        key={oyun}
                        className={`px-4 py-2.5 text-xs font-serif tracking-widest cursor-pointer transition-all
                        ${(oyun === "Diğer" && digerSecildiMi) || (!digerSecildiMi && oyun === seciliOyun)
                            ? "text-[#d4af37] bg-[#1a1508]"
                            : "text-[#8A7A4A] hover:text-[#d4af37] hover:bg-[#1a1508] hover:pl-5"
                          }`}
                        onClick={() => {
                          if (oyun === "Diğer") {
                            setDigerSecildiMi(true);
                            setSeciliOyun("");
                          } else {
                            setDigerSecildiMi(false);
                            setSeciliOyun(oyun);
                          }
                          setAcilirMenuAcikMi(false);
                        }}
                      >
                        {oyun}
                      </li>
                    ))}
                  </ul>
                )}

                {/* "Diğer" seçilince altına oyun adı inputu açılır */}
                {digerSecildiMi && (
                  <div className={`border transition-colors duration-500 flex flex-col justify-center focus-within:border-[#d4af37] ${isKindled ? 'bg-white/10 border-white/30 hover:border-white/50' : 'bg-white/5 border-[#b89e6e]/30 hover:border-[#b89e6e]/60'}`}>
                    <input
                      type="text"
                      placeholder="OYUN ADINI GİRİN..."
                      value={seciliOyun}
                      onChange={(e) => setSeciliOyun(e.target.value)}
                      className="w-full bg-transparent px-[14px] py-[12px] md:px-5 md:py-3 h-[44px] text-xs font-serif tracking-widest text-stone-200 placeholder:text-[#8A7A4A]/70 focus:outline-none uppercase"
                    />
                  </div>
                )}
              </div>

              {/* EKLE BUTONU — Di\u011fer se\u00e7iliyse oyun ad\u0131 girilene kadar kapal\u0131 */}
              <button
                onClick={bossEkle}
                disabled={!bossAdi.trim() || (digerSecildiMi && !seciliOyun.trim())}
                className={`w-full md:w-40 border text-xs font-serif tracking-[0.2em] min-h-[44px] px-[20px] py-[13px] md:py-3 transition-all flex justify-center items-center gap-2 uppercase self-center ${bossAdi.trim() && !(digerSecildiMi && !seciliOyun.trim())
                  ? "border-[#4a3f2d] bg-[#181208] text-[#8A7A4A] hover:bg-[#1e1810] hover:text-[#b8a665] cursor-pointer"
                  : "border-[#332b1f] bg-[#050505] text-[#332b1f] cursor-not-allowed"
                  }`}
              >
                <span>+</span> MÜHÜRLE
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────── */}
        {/* 🎓 EMPTY STATE & LISTELER                              */}
        {/* ─────────────────────────────────────────────────────── */}
        {bosslar.length === 0 ? (
          <div className="w-full max-w-5xl border border-[#1a1508] bg-[#050505] flex flex-col items-center justify-center mt-6" style={{ padding: '52px 0' }}>
            <div className="text-[#332b1f] mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </div>
            <span className="font-serif text-[10px] tracking-[0.3em] text-[#332b1f] uppercase">
              MÜHÜRLENMİŞ DÜŞMAN YOK
            </span>
          </div>
        ) : (
          <>
            {/* ─────────────────────────────────────────────────────── */}
            {/* 🎓 TAB FİLTRELERİ                                      */}
            {/* Boss listesini oyuna göre filtreler.                    */}
            {/* Aktif tab altın alt çizgi + parlak renk alır.           */}
            {/* ─────────────────────────────────────────────────────── */}
            <div className="w-full max-w-5xl mt-4">
              <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-2">
                {/* HEPSİ tabı */}
                <button
                  onClick={() => handleTabChange("HEPSİ")}
                  className={`flex-shrink-0 whitespace-nowrap px-4 py-2 text-[10px] font-serif tracking-[0.2em] uppercase transition-all relative
              ${aktifTab === "HEPSİ"
                      ? "text-[#E6DFC8] bg-[#d4af37]/10"
                      : "text-[#8A7A4A] hover:text-[#b8a665] hover:bg-[#d4af37]/5"
                    }`}
                >
                  HEPSİ
                  {/* Aktif tab altı çizgisi */}
                  {aktifTab === "HEPSİ" && (
                    <div className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-[#d4af37]" />
                  )}
                </button>

                {/* Oyun tabları — boss listesindeki benzersiz oyunlardan dinamik */}
                {benzersizOyunlar.map((oyun) => (
                  <button
                    key={oyun}
                    onClick={() => handleTabChange(oyun)}
                    className={`flex-shrink-0 whitespace-nowrap px-4 py-2 text-[10px] font-serif tracking-[0.2em] uppercase transition-all relative
                ${aktifTab === oyun
                        ? "text-[#E6DFC8] bg-[#d4af37]/10"
                        : "text-[#8A7A4A] hover:text-[#b8a665] hover:bg-[#d4af37]/5"
                      }`}
                  >
                    {oyun}
                    {/* Aktif tab altı çizgisi */}
                    {aktifTab === oyun && (
                      <div className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-[#d4af37]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab çizgisi — tüm tabların altında ince ayırıcı */}
              <div className="h-px bg-[#1a1508]" />
            </div>

            {/* ─────────────────────────────────────────────────────── */}
            {/* 🎓 AKTİF BOSS KARTLARI                                 */}
            {/* kesildiMi === false olan boss'lar burada listelenir.    */}
            {/* aktifTab'a göre filtrelenir.                            */}
            {/* ─────────────────────────────────────────────────────── */}
            <div className={`w-full max-w-5xl mt-6 flex flex-col gap-[4px] md:gap-[2px] transition-opacity ${isTabChanging ? 'animate-ash-fade-out' : 'animate-ash-fade-in'}`}>
              {bosslar
                .filter(b => !b.kesildiMi)
                .filter(b => displayedTab === "HEPSİ" || b.oyun === displayedTab)
                .map((boss) => (
                  <div
                    key={boss.id}
                    className={`group flex flex-col md:flex-row md:items-center gap-[9px] md:gap-[14px] px-[14px] md:px-[18px] py-[11px] border transition-all duration-[800ms] ease-out relative self-stretch w-full ${kesilenAnimasyonId === boss.id
                      ? "border-[#3a7a3a]/50 bg-[#0f2a0f]/40 scale-[0.98] opacity-50"
                      : "border-[#332b1f] bg-[#0c0a07] hover:bg-[#110e0a]"
                      } ${yeniEklenenId === boss.id ? "animate-summon-sign" : ""} ${olumAnimasyonId === boss.id ? "animate-blood-shake" : ""} ${silinenAnimasyonId === boss.id ? "animate-burn-away" : ""}`}
                  >
                    {/* Sol altın kenar — orijinal: rgba(172, 138, 52, 0.50) */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#AC8A34]/50" />

                    {/* Köşe Süslemeleri — sadece SOL ÜST + SAĞ ALT */}
                    <div className="absolute top-0 left-[2px] w-2.5 h-2.5 border-t border-l border-[#AC8A34]/50" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#AC8A34]/50" />

                    {/* MOBİL: Üst satır — Oyun Etiketi + Boss Adı + Ölüm Sayısı */}
                    <div className="flex items-center justify-between md:contents">
                      {/* Oyun Etiketi + Boss Adı */}
                      <div className="flex items-center gap-2 min-w-0 md:contents">
                        <span className="font-sans text-[8px] leading-[12px] tracking-[1.28px] text-[#a09060] uppercase font-normal flex-shrink-0 w-20 text-left truncate">
                          {boss.oyun}
                        </span>
                        <div className="min-w-0 md:flex-1 flex relative">
                          {/* Havadan İnen Fiziksel Kılıç */}
                          {kesilenAnimasyonId === boss.id && (
                            <div
                              className="absolute left-[-20px] top-[-10px] w-[24px] h-[24px] z-20 animate-sword-swing"
                              style={{ transformOrigin: 'bottom center' }}
                            >
                              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" style={{ filter: 'drop-shadow(0px 0px 4px rgba(212, 175, 55, 0.6))' }}>
                                {/* Bıçak */}
                                <path d="M45 10 L50 0 L55 10 V65 H45 Z" fill="#E6DFC8" />
                                {/* Siperlik (Crossguard) */}
                                <rect x="30" y="65" width="40" height="6" fill="#B4943C" />
                                {/* Kabza */}
                                <rect x="42" y="71" width="16" height="20" fill="#332b1f" />
                                {/* Topuz (Pommel) */}
                                <circle cx="50" cy="95" r="5" fill="#B4943C" />
                              </svg>
                            </div>
                          )}

                          <span className={`relative font-serif text-[13px] leading-[19.5px] tracking-[0.91px] uppercase truncate inline-block transition-colors duration-500 ${isKindled ? 'text-gray-100 font-medium' : 'text-stone-200 font-normal'}`}>
                            {boss.isim}
                            {/* Üstünü Çizme Animasyonu (Kılıç Kesiği) */}
                            <div
                              className="absolute left-0 top-1/2 h-[1.5px] bg-gradient-to-r from-transparent via-[#E6DFC8] to-[#E6DFC8] transition-all duration-[500ms] ease-out z-10 flex items-center justify-end"
                              style={{
                                transform: "translateY(-50%)",
                                width: kesilenAnimasyonId === boss.id ? "100%" : "0%"
                              }}
                            >
                              {/* Kılıç/Rüzgar Dalgası Animasyonu */}
                              <div
                                className={`absolute right-[-12px] top-1/2 -translate-y-1/2 transition-opacity duration-200 ${kesilenAnimasyonId === boss.id ? "opacity-100" : "opacity-0"}`}
                              >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0px 0px 4px rgba(230, 223, 200, 0.8))' }}>
                                  {/* Rüzgar Kesiği (Wind Slash) */}
                                  <path d="M2 2 Q22 12 2 22 Q14 12 2 2 Z" fill="#E6DFC8" />
                                </svg>
                              </div>
                            </div>
                          </span>
                        </div>
                      </div>

                      {/* Ölüm Sayısı + İkon */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 md:order-none">
                        <img src="/death-icon.svg" alt="Ölüm" width={14} height={14} className="opacity-70" />
                        <span className="font-sans text-[15px] leading-[15px] text-[#E6DFC8] font-light w-[28px] text-right inline-block">
                          {boss.olumler}
                        </span>
                      </div>
                    </div>

                    {/* MOBİL: Alt satır — KESİLDİ + ÖLDÜN + Sil butonları */}
                    <div className="flex items-center justify-start gap-[6px] md:mt-0 md:contents">
                      {/* VANQUISHED Butonu — FIX #4: Animasyon sırasında disabled */}
                      {activeRole !== 'observer' && (
                        <button
                          onClick={() => kesil(boss.id)}
                          disabled={kesilenAnimasyonId === boss.id}
                          className={`h-[44px] min-h-[44px] flex-1 md:flex-none md:w-[110px] md:h-auto md:min-h-0 md:px-0 md:py-2 font-serif text-[8px] leading-[12px] tracking-[1.6px] uppercase border transition-all text-center font-normal flex-shrink-0 flex items-center justify-center ${kesilenAnimasyonId === boss.id
                            ? "border-[#2a5a2a]/50 bg-[#0a1f0a]/50 text-[#4a904a]/50 cursor-not-allowed"
                            : "border-[#3a7a3a] bg-[#0f2a0f] text-[#62B062] hover:bg-[#153015] hover:text-[#7ad07a] hover:border-[#4a9a4a] cursor-pointer"
                            }`}
                          style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                        >
                          KESİLDİ
                        </button>
                      )}

                      {/* DIED Butonu */}
                      {activeRole !== 'observer' && (
                        <button
                          onClick={() => olumArttir(boss.id)}
                          className="h-[44px] min-h-[44px] flex-1 md:flex-none md:w-[90px] md:h-auto md:min-h-0 md:px-0 md:py-2 font-serif text-[8px] leading-[12px] tracking-[1.6px] uppercase border border-[#7a3030] bg-[#2a0f0f] text-[#D06060] hover:bg-[#351515] hover:text-[#e07070] hover:border-[#9a4040] transition-all cursor-pointer text-center font-normal flex-shrink-0 flex items-center justify-center"
                          style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                        >
                          ÖLDÜN
                        </button>
                      )}

                      {/* Silme Butonu */}
                      {activeRole !== 'observer' && (
                        <button
                          onClick={() => sil(boss.id)}
                          className="w-[44px] h-[44px] min-h-[44px] md:w-[30px] md:h-[44px] flex items-center justify-center border border-[#332b1f] bg-[#0a0907] text-[#5a5040] hover:text-[#b8a665] hover:border-[#4a3f2d] transition-all cursor-pointer flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* ─────────────────────────────────────────────────────── */}
            {/* ⚔️ AYIRICI — Aktif ve Kesilmiş bosslar arası           */}
            {/* Sol gradient çizgi + merkez ikon + sağ gradient çizgi  */}
            {/* ─────────────────────────────────────────────────────── */}
            <div
              className={`flex items-center gap-[12px] flex-shrink-0 w-full max-w-5xl transition-opacity ${isTabChanging ? 'animate-ash-fade-out' : 'animate-ash-fade-in'}`}
              style={{ height: '36px', padding: '14px 0' }}
            >
              {/* Sol çizgi — soldan sağa solan gradient */}
              <div
                className="flex-1 h-px flex-shrink-0"
                style={{ background: 'linear-gradient(90deg, rgba(180, 148, 60, 0.20) 0%, rgba(180, 148, 60, 0.06) 100%)' }}
              />

              {/* Merkez ikon placeholder — 8x8px, sonra gerçek ikon eklenecek */}
              <div className="w-2 h-2 flex-shrink-0 rotate-45 border border-[#B4943C]/30" />

              {/* Sağ çizgi — sağdan sola solan gradient */}
              <div
                className="flex-1 h-px flex-shrink-0"
                style={{ background: 'linear-gradient(270deg, rgba(180, 148, 60, 0.20) 0%, rgba(180, 148, 60, 0.06) 100%)' }}
              />
            </div>

            {/* ─────────────────────────────────────────────────────── */}
            {/* 💀 KESİLMİŞ (SLAIN) BOSS KARTLARI                      */}
            {/* kesildiMi === true olan boss'lar burada listelenir.     */}
            {/* ─────────────────────────────────────────────────────── */}
            <div className={`w-full max-w-5xl flex flex-col gap-[4px] md:gap-[2px] transition-opacity ${isTabChanging ? 'animate-ash-fade-out' : 'animate-ash-fade-in'}`}>
              {bosslar
                .filter(b => b.kesildiMi)
                .filter(b => displayedTab === "HEPSİ" || b.oyun === displayedTab)
                .map((boss) => (
                  <div
                    key={boss.id}
                    className={`group flex flex-col md:flex-row md:items-center gap-[9px] md:gap-[14px] px-[14px] md:px-[18px] py-[11px] border border-[#1a1508] bg-[#080704] transition-colors relative opacity-50 self-stretch w-full ${silinenAnimasyonId === boss.id ? "animate-burn-away opacity-100" : "hover:bg-[#0a0907]"}`}
                  >
                    {/* Sol kenar — soluk */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#AC8A34]/20" />

                    {/* Köşe Süslemeleri — soluk */}
                    <div className="absolute top-0 left-[2px] w-2.5 h-2.5 border-t border-l border-[#AC8A34]/20" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#AC8A34]/20" />

                    {/* MOBİL: Üst satır — Oyun Etiketi + Boss Adı + Ölüm Sayısı */}
                    <div className="flex items-center justify-between md:contents">
                      {/* Oyun Etiketi + Boss Adı */}
                      <div className="flex items-center gap-2 min-w-0 md:contents">
                        <span className="font-sans text-[8px] leading-[12px] tracking-[1.28px] text-[#8A7A4A]/50 uppercase font-normal flex-shrink-0 w-20 text-left truncate">
                          {boss.oyun}
                        </span>
                        <span className="font-serif text-[13px] leading-[19.5px] tracking-[0.91px] text-[#E6DFC8]/40 uppercase font-normal truncate line-through decoration-[#E6DFC8]/40 md:flex-1">
                          {boss.isim}
                        </span>
                      </div>

                      {/* Ölüm Sayısı */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 md:order-none">
                        <img src="/whitedeath-icon.svg" alt="Ölüm" width={14} height={14} className="opacity-30" />
                        <span className="font-sans text-[15px] leading-[15px] text-[#E6DFC8]/40 font-light w-[28px] text-right inline-block">
                          {boss.olumler}
                        </span>
                      </div>
                    </div>

                    {/* MOBİL: Alt satır — SLAIN etiketi + Sil butonu */}
                    <div className="flex items-center justify-between md:justify-start gap-[6px] md:gap-[14px] md:mt-0 md:contents">
                      {/* SLAIN Etiketi ve İkonu */}
                      <div className="flex items-center gap-2 flex-shrink-0 md:w-[110px] md:justify-center">
                        <img src="/slain.svg" alt="Slain Icon" width={28} height={28} />
                        <span className="font-serif text-[8px] leading-[12px] tracking-[1.6px] uppercase text-[#7a3030]">
                          KESİLDİ
                        </span>
                      </div>

                      {/* Silme Butonu */}
                      {activeRole !== 'observer' && (
                        <button
                          onClick={() => sil(boss.id)}
                          className="w-[44px] h-[44px] min-h-[44px] md:w-[30px] md:h-[44px] flex items-center justify-center border border-[#1a1508] bg-[#060503] text-[#5a5040]/40 hover:text-[#b8a665] hover:border-[#332b1f] transition-all cursor-pointer flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* ─────────────────────────────────────────────────────── */}
        {/* 📜 FOOTER                                              */}
        {/* Çizgiler, merkez ikon ve kapanış yazısı                */}
        {/* ─────────────────────────────────────────────────────── */}
        <div
          className="w-full max-w-5xl flex flex-col pt-[36px]"
          style={{ height: '75px' }}
        >
          {/* Ayırıcı Çizgi ve İkon */}
          <div className="flex items-center w-full">
            {/* Sol Çizgi */}
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, rgba(180, 148, 60, 0.20) 100%)' }}
            />

            {/* Merkez İkon */}
            <img src="/mainicon.svg" alt="Main Icon" width={15} height={15} className="opacity-[1]" />

            {/* Sağ Çizgi */}
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(270deg, rgba(0, 0, 0, 0.00) 0%, rgba(180, 148, 60, 0.20) 100%)' }}
            />
          </div>

          {/* Footer Yazısı */}
          <div className="flex flex-col items-center pt-[12px] h-[24px] flex-shrink-0 w-full">
            <span className="text-[#4A3E26] font-sans text-[8px] font-normal leading-[12px] tracking-[2.72px] text-center uppercase">
              LÜTFUN REHBERLİĞİ YOLUNU AYDINLATSIN
            </span>
          </div>
        </div>
      </div>
      {/* z-10 wrapper kapanışı */}
    </main>
  );
}