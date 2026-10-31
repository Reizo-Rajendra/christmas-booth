// ============================================================================
// Main Application Coordinator & Interactive Journey Flow
// Created with love by Reizo Rajendra Dianta • Responsive on Mobile, Mac & Laptop
// ============================================================================

// Global Festive Toast Notification
window.showHolidayToast = function(message, icon = '🎄', duration = 3500) {
  let container = document.getElementById('holidayToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'holidayToastContainer';
    container.className = 'holiday-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'holiday-toast';
  toast.innerHTML = `
    <span class="holiday-toast-icon">${icon}</span>
    <span class="holiday-toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 320);
  }, duration);
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Snow Particle System
  window.xmasSnow = new window.SnowEngine('snowCanvas');

  // Sender: Reizo Rajendra Dianta | Universal Holiday Gift for Everyone
  const senderName = 'Reizo Rajendra Dianta';
  const recipientName = 'Everyone';
  const customLetter = `Dearest Friends, Family, and Everyone who made 2026 so unforgettable,\n\nAs the Christmas lights twinkle and this year draws to a close, I wanted to share this holiday experience with all of you as a token of appreciation and warmth.\n\nThank you for every laugh, every collaboration, every kind word, and every moment shared throughout 2026. Having wonderful people like you in my life makes every day brighter.\n\nMay your holidays be filled with joy, peace, cozy memories, and delicious treats. Here is to an even more incredible, healthy, and successful 2027 for all of us!\n\nMerry Christmas 2026 & Happy New Year!`;

  // Initialize Sub-Systems
  window.xmasTree = new window.ChristmasTreeMosaic('treeContainer');
  window.xmasScrapbook = new window.ChristmasScrapbook('scrapbookContainer', {
    recipientName: recipientName,
    senderName: senderName,
    customLetter: customLetter
  });
  window.xmasPhotobooth = new window.ChristmasPhotobooth('photoboothContainer');

  // Mini-Game
  window.xmasGame = new window.FindSantaGame('miniGameContainer', () => {
    const scrapbookSection = document.getElementById('sectionScrapbook');
    if (scrapbookSection) {
      scrapbookSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Setup Envelope & Story Flow
  initEnvelopeJourney();

  // Setup Vinyl Peppermint Music Player (Real Vocal Tracks)
  initVinylPlayer();

  // Setup Christmas Countdown & Calendar
  initCountdownAndCalendar();

  // Setup Navigation Smooth Scrolling
  initNavigation();

  // Setup Community Photobook Database Gallery
  initCommunityGallery();
});

// ----------------------------------------------------------------------------
// ENVELOPE JOURNEY FLOW (Perfect Flush Sealed Closure)
// ----------------------------------------------------------------------------
function initEnvelopeJourney() {
  const envelopeHero = document.getElementById('envelopeHero');
  const waxSeal = document.getElementById('waxSealButton');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const postcardLetter = document.getElementById('postcardLetter');
  const surpriseChoiceBox = document.getElementById('surpriseChoiceBox');
  const btnSurpriseYes = document.getElementById('btnSurpriseYes');
  const btnSurpriseNo = document.getElementById('btnSurpriseNo');
  const noMessageCard = document.getElementById('noMessageCard');
  const btnNoBack = document.getElementById('btnNoBack');
  const mainHolidayContent = document.getElementById('mainHolidayContent');

  let isOpen = false;

  const openEnvelope = () => {
    if (isOpen) return;
    isOpen = true;

    // 1. Play wax crack sound
    window.xmasAudio.playWaxCrack();

    // 2. Wax seal cracks and dissolves
    waxSeal.classList.add('seal-cracked');

    // 3. Envelope flap folds open in 3D upwards
    envelopeFlap.classList.add('flap-open');

    // 4. Postcard glides smoothly UPWARDS out of the pocket
    setTimeout(() => {
      postcardLetter.classList.add('postcard-raised');
      window.xmasAudio.playPageTurn();
    }, 450);

    // 5. Show surprise choice prompt
    setTimeout(() => {
      surpriseChoiceBox.classList.remove('hidden');
      surpriseChoiceBox.classList.add('choice-enter');
    }, 1100);
  };

  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);

  // User clicks "Yes, Open It"
  if (btnSurpriseYes) {
    btnSurpriseYes.addEventListener('click', () => {
      window.xmasAudio.playFanfare();
      window.xmasAudio.startMusicLoop(); // Plays Real Vocal Song!

      if (window.confetti) {
        window.confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#c62828', '#2e7d32', '#ffd700', '#ffffff']
        });
      }

      envelopeHero.classList.add('hero-faded-out');
      setTimeout(() => {
        envelopeHero.style.display = 'none';
        mainHolidayContent.classList.remove('hidden');
        mainHolidayContent.classList.add('content-reveal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);
    });
  }

  // User clicks "Not Yet"
  if (btnSurpriseNo) {
    btnSurpriseNo.addEventListener('click', () => {
      window.xmasAudio.playBellChime();
      surpriseChoiceBox.classList.add('hidden');
      noMessageCard.classList.remove('hidden');
      noMessageCard.classList.add('choice-enter');
    });
  }

  if (btnNoBack) {
    btnNoBack.addEventListener('click', () => {
      window.xmasAudio.playBellChime();
      noMessageCard.classList.add('hidden');
      surpriseChoiceBox.classList.remove('hidden');
    });
  }
}

// ----------------------------------------------------------------------------
// VINYL PEPPERMINT MUSIC PLAYER (Plays Real Vocal Songs)
// ----------------------------------------------------------------------------
function initVinylPlayer() {
  const icons = window.XMAS_ICONS || {};
  const vinylDisc = document.getElementById('peppermintVinyl');
  const tonearm = document.getElementById('turntableTonearm');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const btnPrevTrack = document.getElementById('btnPrevTrack');
  const btnNextTrack = document.getElementById('btnNextTrack');
  const trackTitle = document.getElementById('playerTrackTitle');
  const trackArtist = document.getElementById('playerTrackArtist');
  const playlistItems = document.querySelectorAll('.playlist-track-item');

  if (btnPrevTrack) btnPrevTrack.innerHTML = icons.prev || '';
  if (btnNextTrack) btnNextTrack.innerHTML = icons.next || '';
  if (btnPlayPause) btnPlayPause.innerHTML = icons.play || '';

  const updatePlayerUI = (track) => {
    if (trackTitle) trackTitle.innerText = track.title;
    if (trackArtist) trackArtist.innerText = track.artist;

    playlistItems.forEach((item, index) => {
      if (index === window.xmasAudio.currentTrackIndex) {
        item.classList.add('track-active');
      } else {
        item.classList.remove('track-active');
      }
    });
  };

  const updatePlayState = (isPlaying) => {
    if (isPlaying) {
      if (vinylDisc) vinylDisc.classList.add('spinning');
      if (tonearm) tonearm.classList.add('tonearm-on-record');
      if (btnPlayPause) btnPlayPause.innerHTML = icons.pause || '';
    } else {
      if (vinylDisc) vinylDisc.classList.remove('spinning');
      if (tonearm) tonearm.classList.remove('tonearm-on-record');
      if (btnPlayPause) btnPlayPause.innerHTML = icons.play || '';
    }
  };

  window.xmasAudio.onTrackChange = updatePlayerUI;
  window.xmasAudio.onPlayStateChange = updatePlayState;

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      window.xmasAudio.togglePlay();
    });
  }

  if (btnNextTrack) {
    btnNextTrack.addEventListener('click', () => {
      window.xmasAudio.nextTrack();
    });
  }

  if (btnPrevTrack) {
    btnPrevTrack.addEventListener('click', () => {
      window.xmasAudio.prevTrack();
    });
  }

  playlistItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      window.xmasAudio.setTrack(idx);
    });
  });

  // Pre-load first track info
  updatePlayerUI(window.xmasAudio.getCurrentTrack());
}

// ----------------------------------------------------------------------------
// COUNTDOWN & DECEMBER CALENDAR
// ----------------------------------------------------------------------------
function initCountdownAndCalendar() {
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  const updateCountdown = () => {
    const now = new Date();
    let currentYear = now.getFullYear();
    let xmas = new Date(currentYear, 11, 25, 0, 0, 0);

    if (now > xmas) {
      xmas = new Date(currentYear + 1, 11, 25, 0, 0, 0);
    }

    const diff = xmas - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (cdDays) cdDays.innerText = String(days).padStart(2, '0');
    if (cdHours) cdHours.innerText = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.innerText = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.innerText = String(seconds).padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const calDays = document.querySelectorAll('.cal-day');
  calDays.forEach(day => {
    day.addEventListener('click', () => {
      window.xmasAudio.playBellChime();
      day.classList.add('day-tapped');
      setTimeout(() => day.classList.remove('day-tapped'), 300);
    });
  });
}

// ----------------------------------------------------------------------------
// NAVIGATION
// ----------------------------------------------------------------------------
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-pill');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.xmasAudio.playBellChime();
      const targetId = link.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ----------------------------------------------------------------------------
// COMMUNITY PHOTOBOOK DATABASE GALLERY (VIEW ALL SUBMISSIONS)
// ----------------------------------------------------------------------------
function initCommunityGallery() {
  const galleryGrid = document.getElementById('communityGalleryGrid');
  const btnRefresh = document.getElementById('btnRefreshGallery');

  const loadGallery = async () => {
    if (!galleryGrid) return;

    try {
      const res = await fetch('/api/submissions');
      const json = await res.json();

      if (!json.success || !json.data || json.data.length === 0) {
        galleryGrid.innerHTML = `
          <div class="gallery-empty-state">
            <p>Belum ada foto tersimpan. Ayo buat dan simpan strip foto kamu di studio fotobooth di atas!</p>
          </div>
        `;
        return;
      }

      galleryGrid.innerHTML = json.data.map(item => {
        const dateStr = new Date(item.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        return `
          <div class="gallery-card" data-id="${item.id}">
            <div class="gallery-card-img-wrap" onclick="window.open('${item.imageUrl}', '_blank')">
              <img src="${item.imageUrl}" class="gallery-card-img" alt="${item.name}">
            </div>
            <div class="gallery-card-meta">
              <span class="gallery-card-title">${item.name || 'Holiday Friend'}</span>
              <span class="gallery-card-date">${dateStr}</span>
            </div>
            <div class="gallery-card-actions">
              <a href="${item.imageUrl}" download="Photostrip-${item.id}.png" class="gallery-btn-download">
                ⬇️ Download
              </a>
              <button class="gallery-btn-delete" data-id="${item.id}" title="Hapus dari Database">
                🗑️
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Attach delete handlers for Reizo
      const deleteBtns = galleryGrid.querySelectorAll('.gallery-btn-delete');
      deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          if (confirm('Hapus foto ini dari database?')) {
            await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
            window.xmasAudio.playBellChime();
            loadGallery();
          }
        });
      });
    } catch (err) {
      console.warn('Could not load community gallery', err);
    }
  };

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      window.xmasAudio.playBellChime();
      loadGallery();
    });
  }

  window.refreshCommunityGallery = loadGallery;
  loadGallery();
}
