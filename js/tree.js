// ============================================================================
// Interactive Christmas Tree Photo Mosaic & Memory Lightbox
// Polaroid frames arranged in a Christmas tree shape with glowing fairy lights
// ============================================================================

class ChristmasTreeMosaic {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.photos = this.loadStoredPhotos() || [
      {
        id: 'top-1',
        title: 'Grand City Lights',
        date: 'Dec 25, 2026',
        caption: 'Standing under the grand holiday monument lights. Wishing big dreams, boundless peace, and bright futures for everyone!',
        src: 'assets/photos/reizo-4.jpg',
        rotation: -2
      },
      {
        id: 'row2-1',
        title: 'Creative Nights & Code',
        date: 'Dec 24, 2026',
        caption: 'Late night coding sessions, building creative projects and festive web experiences. See you all in 2027!',
        src: 'assets/photos/reizo-2.jpg',
        rotation: 3
      },
      {
        id: 'row2-2',
        title: 'Golden Architecture',
        date: 'Dec 22, 2026',
        caption: 'Chasing golden evening lights, architectural silhouettes, and positive holiday energy with good friends.',
        src: 'assets/photos/reizo-5.jpg',
        rotation: -3
      },
      {
        id: 'row3-1',
        title: 'Jewel Rain Vortex',
        date: 'Dec 19, 2026',
        caption: 'Marveling at the iconic indoor waterfall under the crystalline glass dome canopy.',
        src: 'assets/photos/reizo-9.jpg',
        rotation: 2
      },
      {
        id: 'row3-2',
        title: 'Serene Lake Temple',
        date: 'Dec 16, 2026',
        caption: 'Peaceful morning breeze at Ulun Danu Beratan, reflecting on great memories and tranquility.',
        src: 'assets/photos/reizo-8.jpg',
        rotation: -4
      },
      {
        id: 'row3-3',
        title: 'Holiday Travel & Journey',
        date: 'Dec 14, 2026',
        caption: 'Suitcase packed, exploring new city skylines and ready for the next big adventure!',
        src: 'assets/photos/reizo-7.jpg',
        rotation: 3
      },
      {
        id: 'row4-1',
        title: 'City Goods & Coffee',
        date: 'Dec 10, 2026',
        caption: 'Exploring aesthetic spots around town, grabbing warm holiday coffee with friends.',
        src: 'assets/photos/reizo-1.jpg',
        rotation: -2
      },
      {
        id: 'row4-2',
        title: 'Lakeside Night Lights',
        date: 'Dec 06, 2026',
        caption: 'Warm festive lights reflecting on the water, sharing laughter and holiday chill vibes.',
        src: 'assets/photos/reizo-6.jpg',
        rotation: 2
      },
      {
        id: 'row4-3',
        title: 'Midnight Winter Walk',
        date: 'Nov 30, 2026',
        caption: 'Crisp night air, city streetlights, and moving forward with passion into the new year.',
        src: 'assets/photos/reizo-3.jpg',
        rotation: -3
      },
      {
        id: 'row4-4',
        title: 'Golden Sunset Silhouette',
        date: 'Dec 31, 2026',
        caption: 'Watching the golden sunset reflection across the ocean waters, reflecting on an unforgettable 2026 and welcoming 2027 with hope and joy!',
        src: 'assets/photos/reizo-10.jpg',
        rotation: 4
      }
    ];

    this.activePhoto = null;
    this.render();
  }

  loadStoredPhotos() {
    try {
      const stored = localStorage.getItem('xmas_tree_photos_2026_final');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length >= 10 && parsed[9].src && parsed[9].src.includes('reizo-10.jpg')) {
          return parsed;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  savePhotos() {
    try {
      localStorage.setItem('xmas_tree_photos_2026_final', JSON.stringify(this.photos));
    } catch (e) {
      console.warn('Could not save photos to storage', e);
    }
  }

  addPhoto(photoObj) {
    this.photos.unshift(photoObj);
    this.savePhotos();
    this.render();
  }

  render() {
    if (!this.container) return;
    const icons = window.XMAS_ICONS || {};

    const t1 = this.photos.slice(0, 1);
    const t2 = this.photos.slice(1, 3);
    const t3 = this.photos.slice(3, 6);
    const t4 = this.photos.slice(6, 10);

    this.container.innerHTML = `
      <div class="tree-mosaic-section">
        <div class="tree-header">
          <div class="tree-badge">OUR MEMORY TREE</div>
          <h3 class="tree-title">Tree of Cherished Moments</h3>
          <p class="tree-subtitle">Every polaroid is an ornament of joy we've shared. Click any photo to open the memory!</p>
        </div>

        <div class="tree-canvas-container">
          <!-- Twinkling Fairy Lights Garland (SVG) -->
          <svg class="fairy-lights-garland" viewBox="0 0 700 850" preserveAspectRatio="none">
            <path d="M350 70 Q280 180 350 250 Q450 340 320 440 Q180 540 360 630 Q540 720 350 820" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="4 6"/>
            <circle class="bulb bulb-gold" cx="350" cy="70" r="6"/>
            <circle class="bulb bulb-red" cx="300" cy="150" r="5"/>
            <circle class="bulb bulb-green" cx="360" cy="220" r="5.5"/>
            <circle class="bulb bulb-gold" cx="420" cy="310" r="5"/>
            <circle class="bulb bulb-red" cx="330" cy="400" r="6"/>
            <circle class="bulb bulb-green" cx="240" cy="490" r="5"/>
            <circle class="bulb bulb-gold" cx="320" cy="580" r="6"/>
            <circle class="bulb bulb-red" cx="460" cy="670" r="5.5"/>
            <circle class="bulb bulb-green" cx="360" cy="780" r="5"/>
          </svg>

          <!-- Golden Star on Top -->
          <div class="tree-star-wrapper" id="treeStarTop">
            <div class="tree-star-glow"></div>
            <svg class="star-svg" viewBox="0 0 100 100">
              <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#FFD700"/>
              <polygon points="50,15 60,38 85,38 65,53 73,78 50,62 27,78 35,53 15,38 40,38" fill="#FFF9C4"/>
            </svg>
          </div>

          <!-- Tier 1 -->
          <div class="tree-tier tier-1">
            ${t1.map(p => this.renderPolaroid(p)).join('')}
          </div>

          <!-- Tier 2 -->
          <div class="tree-tier tier-2">
            ${t2.map(p => this.renderPolaroid(p)).join('')}
          </div>

          <!-- Tier 3 -->
          <div class="tree-tier tier-3">
            ${t3.map(p => this.renderPolaroid(p)).join('')}
          </div>

          <!-- Tier 4 -->
          <div class="tree-tier tier-4">
            ${t4.map(p => this.renderPolaroid(p)).join('')}
          </div>

          <!-- Wooden Tree Trunk & Bespoke Vector Presents (No Emojis) -->
          <div class="tree-trunk-base">
            <div class="wooden-trunk"></div>
            <div class="base-presents">
              <div class="present-svg-box">${icons.giftBox || ''}</div>
              <div class="present-svg-box">${icons.giftBoxGreen || ''}</div>
              <div class="present-svg-box">${icons.giftBoxGold || ''}</div>
            </div>
          </div>
        </div>

        <!-- Lightbox Modal -->
        <div class="tree-lightbox hidden" id="treeLightbox">
          <div class="lightbox-backdrop" id="lightboxBackdrop"></div>
          <div class="lightbox-content">
            <button class="lightbox-close" id="lightboxClose">×</button>
            <div class="lightbox-polaroid" id="lightboxPolaroid"></div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderPolaroid(photo) {
    const rot = photo.rotation || 0;
    return `
      <div class="polaroid-frame" data-id="${photo.id}" style="--rot: ${rot}deg;" title="Click to view memory">
        <div class="washi-tape"></div>
        <div class="polaroid-photo-box">
          <img src="${photo.src}" alt="${photo.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=500&q=80'">
        </div>
        <div class="polaroid-caption-box">
          <span class="polaroid-caption-text">${photo.title}</span>
          <span class="polaroid-date">${photo.date}</span>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const frames = this.container.querySelectorAll('.polaroid-frame');
    frames.forEach(frame => {
      frame.addEventListener('click', () => {
        const id = frame.getAttribute('data-id');
        const photo = this.photos.find(p => p.id === id);
        if (photo) {
          window.xmasAudio.playBellChime();
          this.openLightbox(photo);
        }
      });
    });

    const closeBtn = document.getElementById('lightboxClose');
    const backdrop = document.getElementById('lightboxBackdrop');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
    if (backdrop) backdrop.addEventListener('click', () => this.closeLightbox());

    const starTop = document.getElementById('treeStarTop');
    if (starTop) {
      starTop.addEventListener('click', () => {
        window.xmasAudio.playFanfare();
        if (window.confetti) {
          window.confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.3 },
            colors: ['#ffd700', '#fff9c4', '#ff8a80']
          });
        }
      });
    }

    const presents = this.container.querySelectorAll('.present-svg-box');
    presents.forEach(pres => {
      pres.addEventListener('click', () => {
        window.xmasAudio.playBellChime();
        if (window.confetti) {
          window.confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
        }
      });
    });
  }

  openLightbox(photo) {
    const lightbox = document.getElementById('treeLightbox');
    const polaroidEl = document.getElementById('lightboxPolaroid');
    if (!lightbox || !polaroidEl) return;

    polaroidEl.innerHTML = `
      <div class="lb-washi-tape"></div>
      <div class="lb-photo-box">
        <img src="${photo.src}" alt="${photo.title}">
      </div>
      <div class="lb-caption-area">
        <h4 class="lb-title">${photo.title}</h4>
        <div class="lb-date">${photo.date}</div>
        <p class="lb-story">${photo.caption}</p>
      </div>
    `;

    lightbox.classList.remove('hidden');
    lightbox.classList.add('lightbox-active');
  }

  closeLightbox() {
    const lightbox = document.getElementById('treeLightbox');
    if (lightbox) {
      lightbox.classList.remove('lightbox-active');
      setTimeout(() => lightbox.classList.add('hidden'), 250);
    }
  }
}

window.ChristmasTreeMosaic = ChristmasTreeMosaic;
