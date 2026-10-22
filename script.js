// ===== Referral Link Controller =====
const CONFIG = {
  refLink: "https://po-ru4.click/login?social=Google&utm_campaign=869330&utm_source=affiliate&utm_medium=sr&a=ll42uJOj45hlWG&al=1804873&ac=googl&cid=986843&code=WELCOME50"
};

document.addEventListener("DOMContentLoaded", () => {
  const refLinks = document.querySelectorAll("[data-ref]");
  refLinks.forEach(link => {
    link.href = CONFIG.refLink;
    link.target = "_blank";
    link.rel = "noopener sponsored";
    
    link.addEventListener("click", (e) => {
      const trackTag = link.getAttribute("data-track") || "generic";
      if (window.dataLayer) {
        window.dataLayer.push({ event: "partner_link_click", trackingLabel: trackTag });
      }
    });
  });

  // Video Controls Logic
  const video = document.getElementById("promoVideo");
  const videoBtn = document.getElementById("videoToggleBtn");
  const videoBtnText = document.getElementById("videoBtnText");

  if (video && videoBtn) {
    videoBtn.addEventListener("click", () => {
      if (video.muted) {
        video.muted = false;
        videoBtnText.textContent = "Mute";
      } else {
        video.muted = true;
        videoBtnText.textContent = "Unmute";
      }
    });

    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  // ===== Interactive Canvas Trading Chart Simulator =====
  const canvas = document.getElementById("tradingChart");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let dataPoints = [];
    const maxPoints = 40;
    let basePrice = 1.08450;
    let currentPrice = basePrice;
    
    for (let i = 0; i < maxPoints; i++) {
      basePrice += (Math.random() - 0.49) * 0.00015;
      dataPoints.push(basePrice);
    }

    function renderChart() {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const minP = Math.min(...dataPoints);
      const maxP = Math.max(...dataPoints);
      const range = (maxP - minP) || 0.001;
      const stepX = w / (maxPoints - 1);

      const points = dataPoints.map((p, index) => {
        const x = index * stepX;
        const y = h - 30 - ((p - minP) / range) * (h - 60);
        return { x, y };
      });

      const lastPoint = points[points.length - 1];
      const isUp = dataPoints[dataPoints.length - 1] >= dataPoints[dataPoints.length - 2];
      
      const areaGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (isUp) {
        areaGrad.addColorStop(0, "rgba(24, 224, 168, 0.35)");
        areaGrad.addColorStop(1, "rgba(24, 224, 168, 0.0)");
      } else {
        areaGrad.addColorStop(0, "rgba(244, 63, 94, 0.35)");
        areaGrad.addColorStop(1, "rgba(244, 63, 94, 0.0)");
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = areaGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = isUp ? "#18e0a8" : "#f43f5e";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = isUp ? "#18e0a8" : "#f43f5e";
      ctx.fill();

      const priceTag = document.getElementById("chartPriceTag");
      if (priceTag) {
        const assetVal = document.getElementById("assetSelect").value;
        let displayPrice = currentPrice.toFixed(5);
        if (assetVal.includes("BTC")) displayPrice = "$" + (currentPrice * 62000).toFixed(2);
        if (assetVal.includes("GOLD")) displayPrice = "$" + (currentPrice * 2200).toFixed(2);
        
        priceTag.textContent = displayPrice;
        priceTag.style.backgroundColor = isUp ? "rgba(24, 224, 168, 0.85)" : "rgba(244, 63, 94, 0.85)";
      }
    }

    setInterval(() => {
      const delta = (Math.random() - 0.49) * 0.0002;
      currentPrice += delta;
      dataPoints.shift();
      dataPoints.push(currentPrice);
      renderChart();
    }, 300);

    let simBalanceVal = 10000.00;
    const simBalance = document.getElementById("simBalance");
    const simToast = document.getElementById("simToast");

    function executeSimTrade(type) {
      if (simToast) {
        simToast.textContent = `⏳ Trade opened (${type.toUpperCase()}). Evaluating in 3s...`;
        simToast.className = "mt-3 text-center text-xs font-semibold text-brand-cyan animate-pulse";
      }

      setTimeout(() => {
        const won = Math.random() > 0.35;
        if (won) {
          const profit = 92;
          simBalanceVal += profit;
          simBalance.textContent = `$${simBalanceVal.toLocaleString("en-US", {minimumFractionDigits: 2})}`;
          simToast.textContent = `🎉 Win! Forecast correct (+ $${profit}.00 payout)`;
          simToast.className = "mt-3 text-center text-xs font-semibold text-brand-lime";
        } else {
          simBalanceVal -= 50;
          simBalance.textContent = `$${simBalanceVal.toLocaleString("en-US", {minimumFractionDigits: 2})}`;
          simToast.textContent = `📉 Loss (- $50.00). Try again!`;
          simToast.className = "mt-3 text-center text-xs font-semibold text-rose-400";
        }
      }, 3000);
    }

    document.getElementById("btnHigher")?.addEventListener("click", () => executeSimTrade("Higher"));
    document.getElementById("btnLower")?.addEventListener("click", () => executeSimTrade("Lower"));
  }
});
