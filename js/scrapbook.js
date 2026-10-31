// ============================================================================
// Interactive Christmas Scrapbook, Heartfelt Letter & Holiday Coupons
// Vintage spiral book aesthetic + wax sealed letter + vector voucher badges
// ============================================================================

class ChristmasScrapbook {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.recipientName = options.recipientName || 'Everyone';
    this.senderName = options.senderName || 'Reizo Rajendra Dianta';
    this.customLetter = options.customLetter || `Dearest Friends, Family, and Everyone who made 2026 special,\n\nAs the Christmas lights twinkle and the year comes to an end, I wanted to send this holiday gift to wish you happiness, good health, and peace.\n\nThank you for every moment, laugh, and story we shared throughout 2026. Having great people around makes life so meaningful.\n\nMay your days be merry, warm, and bright. Here's to a prosperous 2027 for all of us!\n\nMerry Christmas 2026!`;

    const icons = window.XMAS_ICONS || {};
    this.coupons = [
      { id: 'c1', title: 'Free Holiday Coffee / Drink', desc: 'Redeemable anytime for a warm cup of coffee, boba, or sweet holiday beverage on me!', iconSvg: icons.voucherCocoa || icons.voucherCuddle, color: '#b71c1c' },
      { id: 'c2', title: 'Vintage Photobooth Snaps', desc: 'Unlimited holiday photobooth strip sessions with custom frame styling & high-res PNG export.', iconSvg: icons.voucherDrive || icons.camera, color: '#1b5e20' },
      { id: 'c3', title: 'Good Luck & Energy 2027', desc: 'Unlimited supply of positive encouragement, good vibes, and mutual support for the new year.', iconSvg: icons.voucherWish, color: '#f57f17' },
      { id: 'c4', title: 'Holiday Hangout / Gaming', desc: 'A fun chill hangout session, discord call, or gaming night listening to Christmas tunes.', iconSvg: icons.voucherMovie, color: '#880e4f' },
      { id: 'c5', title: 'Free Christmas Wish', desc: 'Ask for a simple holiday favor or creative project help, granted with holiday cheer!', iconSvg: icons.voucherWish, color: '#5d4037' }
    ];

    this.redeemed = new Set();
    this.render();
  }

  updateData(recipientName, senderName, letter) {
    if (recipientName) this.recipientName = recipientName;
    if (senderName) this.senderName = senderName;
    if (letter) this.customLetter = letter;
    this.render();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="scrapbook-wrapper">
        <!-- Spiral Binder Spine -->
        <div class="spiral-spine">
          ${Array.from({ length: 14 }).map(() => `
            <div class="spiral-ring">
              <div class="ring-metal"></div>
              <div class="ring-hole hole-left"></div>
              <div class="ring-hole hole-right"></div>
            </div>
          `).join('')}
        </div>

        <!-- Left Page: The Heartfelt Letter -->
        <div class="scrapbook-page page-left">
          <div class="page-corner-stamp">
            <svg class="postage-stamp-svg" viewBox="0 0 100 80">
              <rect x="5" y="5" width="90" height="70" rx="3" fill="#FFF9EB" stroke="#A83232" stroke-width="2" stroke-dasharray="3 2"/>
              <circle cx="50" cy="40" r="22" stroke="#A83232" stroke-width="1" stroke-dasharray="2 1" fill="none"/>
              <text x="50" y="32" font-family="'Cinzel', serif" font-size="7" fill="#A83232" text-anchor="middle">DECEMBER</text>
              <text x="50" y="46" font-family="'Playfair Display', serif" font-size="12" font-weight="bold" fill="#A83232" text-anchor="middle">25</text>
              <text x="50" y="55" font-family="'Cinzel', serif" font-size="6" fill="#A83232" text-anchor="middle">AIR MAIL</text>
            </svg>
          </div>

          <div class="letter-header">
            <span class="letter-kicker">A CHRISTMAS MESSAGE FOR YOU</span>
            <h3 class="letter-salutation">Dearest <span class="highlight-recipient" id="displayRecipient">${this.escapeHtml(this.recipientName)}</span>,</h3>
          </div>

          <div class="letter-body">
            <p class="letter-text" id="displayLetterText">${this.escapeHtml(this.customLetter).replace(/\n/g, '<br>')}</p>
          </div>

          <div class="letter-signoff">
            <span class="signoff-phrase">Warmest holiday wishes,</span>
            <span class="signoff-signature" id="displaySender">${this.escapeHtml(this.senderName)}</span>
          </div>

          <div class="page-wax-seal-decor">
            <div class="mini-wax-seal">
              <span>REIZO</span>
            </div>
          </div>
        </div>

        <!-- Right Page: Holiday Coupons -->
        <div class="scrapbook-page page-right">
          <div class="coupons-header">
            <div class="coupon-badge">HOLIDAY VOUCHERS</div>
            <h3 class="coupons-title">Little Gifts From My Heart</h3>
            <p class="coupons-subtitle">Tap any coupon to redeem your Christmas wish!</p>
          </div>

          <div class="coupons-grid">
            ${this.coupons.map(c => `
              <div class="coupon-card ${this.redeemed.has(c.id) ? 'coupon-redeemed' : ''}" data-id="${c.id}" style="--c-accent: ${c.color}">
                <div class="coupon-icon-box">${c.iconSvg || ''}</div>
                <div class="coupon-info">
                  <h4 class="coupon-name">${c.title}</h4>
                  <p class="coupon-desc">${c.desc}</p>
                </div>
                <div class="coupon-action">
                  <span class="coupon-btn-label">${this.redeemed.has(c.id) ? 'REDEEMED' : 'REDEEM'}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="page-scrap-decor">
            <span class="scrap-tag">Made with love • 25 Dec</span>
            <span class="scrap-holly">✦ ✦ ✦</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  bindEvents() {
    const couponCards = this.container.querySelectorAll('.coupon-card');
    couponCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        if (this.redeemed.has(id)) {
          window.xmasAudio.playBellChime();
          return;
        }

        this.redeemed.add(id);
        window.xmasAudio.playStickerPop();

        if (window.confetti) {
          window.confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#c2185b', '#ffd700', '#ffffff']
          });
        }

        card.classList.add('coupon-redeemed', 'coupon-bounce');
        const label = card.querySelector('.coupon-btn-label');
        if (label) label.innerText = 'REDEEMED';
      });
    });
  }
}

window.ChristmasScrapbook = ChristmasScrapbook;
