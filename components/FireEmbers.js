"use client";

import { useEffect, useRef } from "react";

const EMBER_COLORS = [
  "rgba(255, 51, 0",   // kıpkırmızı
  "rgba(255, 102, 0",  // turuncu
  "rgba(255, 153, 0",  // parlak turuncu
  "rgba(255, 200, 0",  // kor sarısı
  "rgba(220, 60, 0",   // koyu kor
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

class Ember {
  constructor(canvas, olumRef) {
    this.canvas = canvas;
    this.olumRef = olumRef;
    this.reset();
  }

  reset() {
    // Ekranın rastgele bir yerinde doğsun
    this.x = randomBetween(0, this.canvas.width);
    this.y = randomBetween(0, this.canvas.height);
    
    const currentDeaths = this.olumRef ? this.olumRef.current : 0;
    
    // Zorluk (Ölüm) arttıkça şiddetlenme çarpanı
    let intensity = 1;
    if (currentDeaths > 100) intensity = 1.8;
    else if (currentDeaths > 50) intensity = 1.4;

    this.radius = randomBetween(1, 3.5) * (intensity > 1 ? 1.2 : 1);
    
    // Yavaşça yukarı doğru süzülme (şiddet artarsa hızlanır)
    this.vy = randomBetween(-0.4, -1.2) * intensity; // Sadece yukarı doğru (negatif y)
    this.vx = randomBetween(-0.3, 0.3) * intensity; // Hafif sağa veya sola
    
    this.opacity = randomBetween(0.2, 1);
    this.fadeSpeed = randomBetween(0.002, 0.006) * (intensity > 1 ? 1.5 : 1); // Çok yavaşça sönme
    
    // Daha çok öldükçe kırmızı (index 0) tonların seçilme ihtimali artar
    let colorIndex = Math.floor(Math.random() * EMBER_COLORS.length);
    if (currentDeaths > 100 && Math.random() > 0.4) colorIndex = 0; // %60 ihtimalle kıpkırmızı
    
    this.color = EMBER_COLORS[colorIndex];
    this.glowSize = this.radius * randomBetween(2.5, 5);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Alevlerin rüzgarda uçuşması gibi hafif yalpalamalar
    this.x += Math.sin(this.y * 0.02) * 0.3;
    
    this.opacity -= this.fadeSpeed;

    // Eğer tamamen söndüyse veya ekrandan çıktıysa yeniden doğur
    if (this.opacity <= 0 || this.y < -10 || this.x < -10 || this.x > this.canvas.width + 10) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();

    // Ateş parlaması (glow)
    const glow = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.glowSize
    );
    glow.addColorStop(0, `${this.color}, ${this.opacity})`);
    glow.addColorStop(0.4, `${this.color}, ${this.opacity * 0.4})`);
    glow.addColorStop(1, `${this.color}, 0)`);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Köz merkezi (parlak nokta)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}, ${Math.min(this.opacity * 1.5, 1)})`;
    ctx.fill();

    ctx.restore();
  }
}

export default function FireEmbers({ toplamOlum = 0 }) {
  const canvasRef = useRef(null);
  const embersRef = useRef([]);
  const animRef = useRef(null);
  const olumRef = useRef(toplamOlum);

  useEffect(() => {
    olumRef.current = toplamOlum;
  }, [toplamOlum]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 120 köz oluştur
    embersRef.current = Array.from({ length: 120 }, () => {
      const e = new Ember(canvas, olumRef);
      // Başlangıçta sayfanın her yerine doğal olarak dağılsınlar
      e.x = randomBetween(0, canvas.width);
      e.y = randomBetween(0, canvas.height);
      return e;
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embersRef.current.forEach((ember) => {
        ember.update();
        ember.draw(ctx);
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hidden md:block absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
