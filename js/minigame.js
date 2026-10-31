// ============================================================================
// Find Hidden Santa Mini-Game
// Handcrafted Vector Winter Village Scene with Interactive Exploration
// ============================================================================

class FindSantaGame {
  constructor(containerId, onWinCallback) {
    this.container = document.getElementById(containerId);
    this.onWin = onWinCallback;
    this.found = false;
    this.hintIndex = 0;
    this.hints = [
      "Brrr, freezing! Santa is staying warm near the village...",
      "Look closely between the snowy cottages and pine trees!",
      "He might be peeking from behind the warm rooftops!",
      "Almost there! Check near the warm glowing chimneys..."
    ];

    this.render();
  }

  render() {
    if (!this.container) return;
    const icons = window.XMAS_ICONS || {};

    this.container.innerHTML = `
      <div class="santa-game-card">
        <div class="santa-game-header">
          <div class="game-badge">HOLIDAY QUEST</div>
          <h3 class="game-title">Find the Hidden Santa!</h3>
          <p class="game-subtitle">Somewhere in this cozy winter wonderland, Santa is hiding! Tap him to unlock the secret gift. Look closely... he might be tiny!</p>
        </div>

        <div class="village-canvas-wrapper" id="villageWrapper">
          <svg viewBox="0 0 1000 600" class="village-svg" id="villageSvg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="winterSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#d9e8f5"/>
                <stop offset="60%" stop-color="#edf4fa"/>
                <stop offset="100%" stop-color="#fff8f2"/>
              </linearGradient>

              <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="100%" stop-color="#e1ebf5"/>
              </linearGradient>

              <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f0f6fb"/>
                <stop offset="100%" stop-color="#d4e3f0"/>
              </linearGradient>

              <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fff3b0"/>
                <stop offset="100%" stop-color="#f6bd60"/>
              </radialGradient>

              <filter id="villageShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#809bb0" flood-opacity="0.25"/>
              </filter>
            </defs>

            <!-- Sky Background -->
            <rect width="1000" height="600" fill="url(#winterSky)"/>

            <!-- Distant Mountains -->
            <path d="M-50 350 L120 180 L280 340 L450 150 L620 320 L780 190 L950 330 L1050 210 L1050 600 L-50 600 Z" fill="#c5daf0" opacity="0.5"/>
            <path d="M120 180 L160 230 L110 240 Z" fill="#ffffff" opacity="0.9"/>
            <path d="M450 150 L500 210 L430 220 Z" fill="#ffffff" opacity="0.9"/>
            <path d="M780 190 L820 240 L760 250 Z" fill="#ffffff" opacity="0.9"/>

            <!-- Rolling Snow Hills Background -->
            <path d="M-50 380 Q250 260 550 350 T1050 320 L1050 600 L-50 600 Z" fill="url(#hillGrad2)"/>
            <path d="M-50 430 Q300 370 700 420 T1050 390 L1050 600 L-50 600 Z" fill="url(#hillGrad1)"/>

            <!-- Pine Forest Background Trees -->
            <g fill="#24513b" opacity="0.85">
              <path d="M60 380 L80 340 L100 380 Z"/>
              <path d="M65 365 L80 330 L95 365 Z"/>
              <path d="M90 390 L115 345 L140 390 Z"/>
              <path d="M130 400 L155 350 L180 400 Z"/>
              <path d="M820 370 L845 320 L870 370 Z"/>
              <path d="M850 380 L880 330 L910 380 Z"/>
              <path d="M890 390 L920 340 L950 390 Z"/>
            </g>

            <!-- Frozen Ice Skating Pond -->
            <ellipse cx="500" cy="510" rx="280" ry="70" fill="#cbe3f5" stroke="#ffffff" stroke-width="4" filter="url(#villageShadow)"/>
            <ellipse cx="500" cy="510" rx="260" ry="60" fill="#d8ebfa"/>
            <path d="M380 500 Q430 480 490 510" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.6"/>
            <path d="M480 520 Q540 540 620 505" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.6"/>

            <!-- Skaters on Ice -->
            <g transform="translate(420, 485) scale(0.6)">
              <circle cx="10" cy="10" r="5" fill="#4a2e18"/>
              <rect x="7" y="15" width="6" height="12" fill="#c62828" rx="2"/>
              <line x1="10" y1="27" x2="6" y2="38" stroke="#1c3144" stroke-width="2"/>
              <line x1="10" y1="27" x2="16" y2="35" stroke="#1c3144" stroke-width="2"/>
            </g>
            <g transform="translate(560, 500) scale(0.6)">
              <circle cx="10" cy="10" r="5" fill="#3e2723"/>
              <rect x="7" y="15" width="6" height="12" fill="#2e7d32" rx="2"/>
              <line x1="10" y1="27" x2="14" y2="37" stroke="#1c3144" stroke-width="2"/>
              <line x1="10" y1="27" x2="5" y2="34" stroke="#1c3144" stroke-width="2"/>
            </g>

            <!-- Red Chalet House 1 (Left) -->
            <g class="village-house" transform="translate(180, 360)">
              <rect x="25" y="10" width="16" height="35" fill="#8d322c"/>
              <path class="smoke-puff" d="M33 5 Q30 -10 38 -20 Q45 -30 36 -45" stroke="rgba(255,255,255,0.7)" stroke-width="4" fill="none" stroke-linecap="round"/>
              <rect x="15" y="45" width="110" height="85" fill="#a83232" rx="3" filter="url(#villageShadow)"/>
              <rect x="55" y="80" width="30" height="50" rx="15" fill="#5c1d1d"/>
              <circle cx="80" cy="105" r="2.5" fill="#f4d06f"/>
              <circle cx="70" cy="95" r="7" stroke="#2e7d32" stroke-width="3" fill="none"/>
              <circle cx="70" cy="98" r="2" fill="#e53935"/>

              <rect x="25" y="60" width="22" height="25" rx="3" fill="url(#windowGlow)"/>
              <line x1="36" y1="60" x2="36" y2="85" stroke="#a83232" stroke-width="2"/>
              <line x1="25" y1="72" x2="47" y2="72" stroke="#a83232" stroke-width="2"/>

              <rect x="93" y="60" width="22" height="25" rx="3" fill="url(#windowGlow)"/>
              <line x1="104" y1="60" x2="104" y2="85" stroke="#a83232" stroke-width="2"/>
              <line x1="93" y1="72" x2="115" y2="72" stroke="#a83232" stroke-width="2"/>

              <polygon points="70,10 5,50 135,50" fill="#7d2222"/>
              <path d="M70,8 L0,50 Q10,55 20,48 Q35,56 50,48 Q70,58 90,48 Q110,56 125,48 Q135,55 140,50 L70,8 Z" fill="#ffffff" filter="drop-shadow(0 3px 2px rgba(0,0,0,0.15))"/>
            </g>

            <!-- Church Tower -->
            <g class="village-church" transform="translate(680, 290)">
              <polygon points="50,15 35,90 65,90" fill="#78909c"/>
              <path d="M50,12 L33,90 L67,90 Z" fill="#ffffff" opacity="0.9"/>
              <line x1="50" y1="5" x2="50" y2="18" stroke="#d4af37" stroke-width="3"/>
              <line x1="44" y1="9" x2="56" y2="9" stroke="#d4af37" stroke-width="3"/>
              <rect x="30" y="90" width="40" height="150" fill="#e0e0e0" filter="url(#villageShadow)"/>
              <circle cx="50" cy="120" r="14" fill="#ffffff" stroke="#d4af37" stroke-width="2"/>
              <line x1="50" y1="120" x2="50" y2="111" stroke="#333" stroke-width="2"/>
              <line x1="50" y1="120" x2="57" y2="120" stroke="#333" stroke-width="1.5"/>
              <rect x="70" y="150" width="100" height="90" fill="#cfd8dc" rx="2"/>
              <polygon points="120,110 65,152 175,152" fill="#90a4ae"/>
              <path d="M120,108 L60,152 Q80,158 100,150 Q130,160 150,150 Q170,158 180,152 Z" fill="#ffffff"/>
              <rect x="85" y="165" width="20" height="40" rx="10" fill="url(#windowGlow)"/>
              <rect x="135" y="165" width="20" height="40" rx="10" fill="url(#windowGlow)"/>
            </g>

            <!-- Red Chalet House 2 (Right Front) -->
            <g class="village-house" transform="translate(810, 390)">
              <rect x="80" y="20" width="14" height="30" fill="#8d322c"/>
              <path class="smoke-puff" d="M87 15 Q82 0 90 -12 Q95 -24 88 -35" stroke="rgba(255,255,255,0.7)" stroke-width="3" fill="none" stroke-linecap="round"/>
              <rect x="20" y="55" width="95" height="75" fill="#992b2b" rx="2" filter="url(#villageShadow)"/>
              <polygon points="67.5,20 10,58 125,58" fill="#751e1e"/>
              <path d="M67.5,18 L5,58 Q20,64 40,56 Q70,66 90,56 Q115,64 130,58 Z" fill="#ffffff"/>
              <rect x="35" y="70" width="24" height="24" rx="2" fill="url(#windowGlow)"/>
              <rect x="75" y="70" width="24" height="24" rx="2" fill="url(#windowGlow)"/>
              <rect x="55" y="98" width="22" height="32" fill="#4a1515" rx="3"/>
            </g>

            <!-- Snowy Pine Tree with Lights -->
            <g transform="translate(320, 370)" filter="url(#villageShadow)">
              <rect x="38" y="120" width="14" height="30" fill="#5d4037"/>
              <polygon points="45,40 10,125 80,125" fill="#1b4d3e"/>
              <path d="M45,38 L5,125 Q25,133 45,123 Q65,133 85,125 Z" fill="#ffffff"/>
              <polygon points="45,20 18,80 72,80" fill="#235c4b"/>
              <path d="M45,18 L14,80 Q30,87 45,78 Q60,87 76,80 Z" fill="#ffffff"/>
              <polygon points="45,5 25,50 65,50" fill="#2d6a57"/>
              <path d="M45,3 L22,50 Q35,55 45,48 Q55,55 68,50 Z" fill="#ffffff"/>
              <polygon points="45,0 47,4 51,5 48,8 49,12 45,10 41,12 42,8 39,5 43,4" fill="#ffd700" filter="drop-shadow(0 0 4px #ffd700)"/>
              <circle cx="35" cy="45" r="3" fill="#ff5252" filter="drop-shadow(0 0 3px #ff5252)"/>
              <circle cx="55" cy="55" r="3" fill="#ffeb3b" filter="drop-shadow(0 0 3px #ffeb3b)"/>
              <circle cx="30" cy="75" r="3" fill="#40c4ff" filter="drop-shadow(0 0 3px #40c4ff)"/>
              <circle cx="60" cy="85" r="3" fill="#e040fb" filter="drop-shadow(0 0 3px #e040fb)"/>
              <circle cx="45" cy="100" r="3.5" fill="#ffd700" filter="drop-shadow(0 0 3px #ffd700)"/>
            </g>

            <!-- Street Lamp -->
            <g transform="translate(140, 440)">
              <rect x="8" y="20" width="4" height="80" fill="#263238"/>
              <polygon points="10,0 2,12 18,12" fill="#263238"/>
              <polygon points="4,12 16,12 14,22 6,22" fill="url(#windowGlow)"/>
              <circle cx="10" cy="17" r="16" fill="rgba(255, 235, 59, 0.25)"/>
            </g>

            <!-- HIDDEN SANTA PEAKING BEHIND CHALET 1 ROOF -->
            <g id="hiddenSantaTrigger" class="hidden-santa-group" transform="translate(305, 345)" cursor="pointer">
              <rect x="-15" y="-15" width="60" height="60" fill="transparent"/>
              <rect x="6" y="16" width="18" height="16" rx="4" fill="#d32f2f"/>
              <rect x="6" y="24" width="18" height="4" fill="#212121"/>
              <rect x="13" y="23" width="4" height="6" fill="#ffd700"/>
              <ellipse cx="15" cy="20" rx="9" ry="8" fill="#ffffff"/>
              <ellipse cx="15" cy="14" rx="6.5" ry="5.5" fill="#ffccbc"/>
              <circle cx="11" cy="15" r="1.5" fill="#ff8a80"/>
              <circle cx="19" cy="15" r="1.5" fill="#ff8a80"/>
              <circle cx="12.5" cy="13" r="1" fill="#212121"/>
              <circle cx="17.5" cy="13" r="1" fill="#212121"/>
              <circle cx="15" cy="15" r="1.5" fill="#e53935"/>
              <path d="M8 11 Q15 2 22 11 Z" fill="#d32f2f"/>
              <rect x="7" y="9" width="16" height="4" rx="2" fill="#ffffff"/>
              <circle cx="23" cy="8" r="2.5" fill="#ffffff"/>
              <circle class="santa-waving-hand" cx="3" cy="16" r="3" fill="#ffffff"/>
            </g>

            <!-- Foreground Snow Drifts -->
            <path d="M-20 540 Q250 490 600 550 T1050 530 L1050 600 L-20 600 Z" fill="#ffffff" opacity="0.95"/>
            <path d="M-20 570 Q400 520 800 560 T1050 550 L1050 600 L-20 600 Z" fill="#ffffff"/>
          </svg>

          <!-- Interactive Hint Bubble -->
          <div class="santa-feedback" id="santaFeedback">
            <span class="feedback-icon-svg">${icons.search || ''}</span>
            <span class="feedback-text" id="feedbackText">Tap on the winter village to explore and find Santa!</span>
          </div>
        </div>

        <!-- Santa Found Victory Card -->
        <div class="santa-victory-card hidden" id="santaVictoryCard">
          <div class="victory-ribbon">✦ YOU FOUND SANTA! ✦</div>
          <h4>"Ho Ho Ho! Merry Christmas!"</h4>
          <p>You have keen eyes! You've successfully unlocked the secret holiday letter, festive photo tree &amp; the vintage photobooth studio!</p>
          <button class="btn-holiday-gold" id="btnClaimSurprise">
            ${icons.sparkle || ''}
            <span>Open Your Christmas Surprise</span>
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const santaTrigger = document.getElementById('hiddenSantaTrigger');
    const villageSvg = document.getElementById('villageSvg');
    const feedbackText = document.getElementById('feedbackText');
    const btnClaimSurprise = document.getElementById('btnClaimSurprise');

    if (santaTrigger) {
      santaTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerWin();
      });
      santaTrigger.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.triggerWin();
      });
    }

    if (villageSvg) {
      villageSvg.addEventListener('click', (e) => {
        if (this.found) return;
        window.xmasAudio.playBellChime();
        feedbackText.innerText = this.hints[this.hintIndex % this.hints.length];
        this.hintIndex++;
        const feedbackEl = document.getElementById('santaFeedback');
        feedbackEl.classList.add('feedback-pulse');
        setTimeout(() => feedbackEl.classList.remove('feedback-pulse'), 500);
      });
    }

    if (btnClaimSurprise) {
      btnClaimSurprise.addEventListener('click', () => {
        window.xmasAudio.playWaxCrack();
        if (this.onWin) this.onWin();
      });
    }
  }

  triggerWin() {
    if (this.found) return;
    this.found = true;

    window.xmasAudio.playFanfare();

    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#d32f2f', '#2e7d32', '#ffd700', '#ffffff', '#ff8a80']
      });
    }

    const santaTrigger = document.getElementById('hiddenSantaTrigger');
    if (santaTrigger) {
      santaTrigger.classList.add('santa-celebrate');
    }

    const feedbackEl = document.getElementById('santaFeedback');
    if (feedbackEl) feedbackEl.style.display = 'none';

    const victoryCard = document.getElementById('santaVictoryCard');
    if (victoryCard) {
      victoryCard.classList.remove('hidden');
      victoryCard.classList.add('show-pop');
    }
  }
}

window.FindSantaGame = FindSantaGame;
