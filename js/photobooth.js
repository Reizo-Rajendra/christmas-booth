// ============================================================================
// Retro Christmas Photobooth Studio (인생네컷 / Life Four Cuts Style)
// 10 Frame Themes • 5 Layout Modes • Multi-Shot Countdown • SVG Icons • High-Res PNG
// Official Watermark: Made by Reizo Rajendra Dianta
// ============================================================================

class ChristmasPhotobooth {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.stream = null;
    this.videoEl = null;
    this.shots = [];
    this.activeFilter = 'warm';
    this.activeFrameTheme = 'crimson';
    this.activeLayout = 'layout-3cut';
    this.isCapturing = false;
    this.placedStickers = [];
    this.customFooterText = 'MERRY CHRISTMAS 2026';
    this.customSubtitle = 'with joy & warmth • 25.12';

    this.samplePhotos = [
      'assets/photos/reizo-4.jpg',
      'assets/photos/reizo-9.jpg',
      'assets/photos/reizo-8.jpg',
      'assets/photos/reizo-7.jpg',
      'assets/photos/reizo-2.jpg',
      'assets/photos/reizo-1.jpg',
      'assets/photos/reizo-5.jpg',
      'assets/photos/reizo-6.jpg',
      'assets/photos/reizo-3.jpg'
    ];

    this.render();
  }

  getRequiredShotsCount() {
    switch (this.activeLayout) {
      case 'layout-card': return 1;
      case 'layout-polaroid': return 2;
      case 'layout-3cut':
      default: return 3;
    }
  }

  render() {
    if (!this.container) return;
    const icons = window.XMAS_ICONS || {};

    this.container.innerHTML = `
      <div class="photobooth-studio">
        <!-- Studio Header -->
        <div class="studio-header">
          <div class="studio-badge">VINTAGE CHRISTMAS PHOTOBOOTH (3-CUT)</div>
          <h2 class="studio-title">Capture Holiday Magic</h2>
          <p class="studio-subtitle">Snap a vintage 3-cut photostrip with friends, choose from 10 luxury holiday themes &amp; save your holiday memories!</p>
        </div>

        <div class="studio-layout">
          <!-- Left: Camera View & Live Controls -->
          <div class="camera-stage">
            <div class="camera-viewport-box" id="viewportBox">
              <video id="webcamVideo" autoplay playsinline muted class="camera-feed filter-${this.activeFilter}"></video>
              <div class="camera-flash" id="cameraFlash"></div>

              <!-- Live Webcam Status Badge -->
              <div class="camera-live-badge hidden" id="cameraLiveBadge">
                <span class="live-dot"></span>
                <span id="cameraLiveText">WEBCAM LIVE</span>
              </div>

              <!-- Big Countdown Overlay -->
              <div class="countdown-overlay hidden" id="countdownOverlay">
                <span class="countdown-digit" id="countdownDigit">3</span>
                <span class="countdown-hint">Get Ready &amp; Strike a Pose!</span>
              </div>

              <!-- Camera Offline Placeholder -->
              <div class="camera-placeholder" id="cameraPlaceholder">
                <div class="placeholder-icon-svg">${icons.camera || ''}</div>
                <h4>Kamera Siap Digunakan</h4>
                <p>Klik "Buka Webcam" untuk live preview, atau gunakan tombol emas di bawah untuk pakai kamera HP / file foto!</p>
                <button class="btn-holiday-gold" id="btnStartCamera">
                  ${icons.camera || ''}
                  <span>Buka Webcam</span>
                </button>
              </div>

              <!-- Pose Guidance Prompt -->
              <div class="pose-hint hidden" id="poseHint">
                <span id="poseHintText">Pose 1: Big Warm Smile!</span>
              </div>
            </div>

            <!-- Direct Device / Phone Camera Input Button -->
            <label class="btn-holiday-gold" for="directDeviceCamera" style="cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 18px; width: 100%; font-size: 0.9rem; font-weight: 700; border-radius: 30px; box-sizing: border-box; text-align: center; box-shadow: 0 4px 15px rgba(212,175,55,0.4);">
              ${icons.camera || ''}
              <span>📸 Ambil Foto Kamera HP / Upload 3 Foto</span>
              <input type="file" id="directDeviceCamera" accept="image/*" capture="user" multiple class="hidden">
            </label>

            <!-- Multi-Device Camera Selector (Visible if >1 camera) -->
            <div id="cameraDeviceRow" class="camera-device-row hidden" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; background: rgba(122, 18, 31, 0.08); padding: 8px 14px; border-radius: 12px; border: 1px dashed rgba(212, 175, 55, 0.4);">
              <span style="font-size: 0.75rem; color: #7a121f; font-weight: 700; letter-spacing: 0.5px;">PILIH KAMERA:</span>
              <select id="cameraDeviceSelect" class="camera-device-select"></select>
            </div>

            <!-- Camera Toolbar -->
            <div class="camera-controls">
              <button class="btn-ctrl" id="btnToggleCam" title="Buka / Tutup Webcam">
                ${icons.camera || ''}
                <span id="btnToggleCamText">Webcam</span>
              </button>

              <button class="btn-capture-big" id="btnStartCapture" title="Ambil 3 Foto Otomatis">
                <div class="capture-inner-circle">
                  ${icons.camera || ''}
                </div>
              </button>

              <button class="btn-ctrl" id="btnSnapSingle" title="Ambil 1 Foto Langsung">
                ${icons.sparkle || ''}
                <span>Snap 1x</span>
              </button>

              <label class="btn-ctrl" title="Upload Photos" for="fileInputUpload">
                ${icons.upload || ''}
                <span>File</span>
                <input type="file" id="fileInputUpload" accept="image/*" multiple class="hidden">
              </label>

              <button class="btn-ctrl" id="btnLoadSample" title="Gunakan Foto Reizo">
                ${icons.tree || ''}
                <span>Sample</span>
              </button>
            </div>

            <!-- Filter Selection Bar -->
            <div class="filter-bar">
              <span class="bar-label">FILTERS:</span>
              <button class="filter-chip active" data-filter="warm">Warm Hearth</button>
              <button class="filter-chip" data-filter="kodachrome">Vintage Film</button>
              <button class="filter-chip" data-filter="dream">Holiday Glow</button>
              <button class="filter-chip" data-filter="cool">Winter Frost</button>
              <button class="filter-chip" data-filter="bw">Classic B&amp;W</button>
            </div>

            <!-- Sticker Tray -->
            <div class="sticker-tray-section">
              <div class="tray-title">
                <span>STAMP FESTIVE STICKERS ON YOUR STRIP:</span>
                <span class="tray-tip">(Click sticker to add, drag to position)</span>
              </div>
              <div class="sticker-tray" id="stickerTray">
                ${(window.CHRISTMAS_STICKERS || []).map(s => `
                  <div class="sticker-item" data-id="${s.id}" title="${s.name}">
                    ${s.svg}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right: The Photostrip Live Preview & Customizer -->
          <div class="photostrip-preview-stage">
            <!-- Studio Custom Panel: Layouts & Themes -->
            <div class="studio-custom-panel">
              <!-- Row 1: Layout Mode (Only 3-Cut, Polaroid Duo, Card) -->
              <div class="selector-row">
                <span class="selector-label">STUDIO LAYOUT:</span>
                <div class="layout-selector">
                  <button class="btn-layout active" data-layout="layout-3cut">3-Cut Strip (3 Foto)</button>
                  <button class="btn-layout" data-layout="layout-polaroid">Polaroid Duo (2 Foto)</button>
                  <button class="btn-layout" data-layout="layout-card">Holiday Card (1 Foto)</button>
                </div>
              </div>

              <!-- Row 2: 10 Frame Themes -->
              <div class="selector-row">
                <span class="selector-label">FRAME THEME:</span>
                <div class="frame-selector">
                  <button class="frame-swatch crimson active" data-theme="crimson" title="Royal Velvet & Gold"></button>
                  <button class="frame-swatch tartan" data-theme="tartan" title="Scottish Highland Tartan"></button>
                  <button class="frame-swatch evergreen" data-theme="evergreen" title="Alpine Pine & Holly"></button>
                  <button class="frame-swatch snow" data-theme="snow" title="Snowflake Pastel Frost"></button>
                  <button class="frame-swatch gingerbread" data-theme="gingerbread" title="Gingerbread & Royal Icing"></button>
                  <button class="frame-swatch film90s" data-theme="film90s" title="Vintage 90s Kodak 35mm"></button>
                  <button class="frame-swatch ribbon" data-theme="ribbon" title="Silk Holiday Ribbon & Bows"></button>
                  <button class="frame-swatch midnight" data-theme="midnight" title="Midnight Constellation"></button>
                  <button class="frame-swatch newspaper" data-theme="newspaper" title="The Holiday Times Newsprint"></button>
                  <button class="frame-swatch minimalist" data-theme="minimalist" title="Seoul Minimalist White"></button>
                </div>
              </div>
            </div>

            <!-- The Realtime Photostrip Element (3 Slots) -->
            <div class="strip-container-outer">
              <div class="photostrip theme-${this.activeFrameTheme} ${this.activeLayout}" id="photostripPreview">
                <!-- Strip Header -->
                <div class="strip-top-header">
                  <div class="strip-header-title">CHRISTMAS MEMORIES</div>
                </div>

                <!-- Photos Grid Slots (Exactly 3 slots) -->
                <div class="strip-photos-grid" id="stripPhotosGrid">
                  ${[0, 1, 2].map(i => `
                    <div class="strip-frame slot-${i}" data-index="${i}">
                      <div class="slot-empty">
                        <span>#${i + 1}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <!-- Strip Interactive Sticker Overlay Layer -->
                <div class="strip-stickers-layer" id="stripStickersLayer"></div>

                <!-- Strip Footer -->
                <div class="strip-footer">
                  <div class="strip-footer-title" id="stripFooterTitle" contenteditable="true" spellcheck="false" title="Click to edit text">
                    ${this.customFooterText}
                  </div>
                  <div class="strip-footer-subtitle" id="stripFooterSubtitle" contenteditable="true" spellcheck="false" title="Click to edit text">
                    ${this.customSubtitle}
                  </div>
                  
                  <!-- Official Creator Watermark -->
                  <div class="strip-watermark-tag">Made by Reizo Rajendra Dianta</div>

                  <div class="strip-barcode">
                    <span class="barcode-bars">||| | |||| | ||| |||| |</span>
                    <span class="barcode-num">XMAS-2026-REIZO</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons for the Photostrip -->
            <div class="strip-actions">
              <button class="btn-holiday-gold" id="btnDownloadStrip">
                ${icons.download || ''}
                <span>Save High-Res Photostrip</span>
              </button>
              <button class="btn-holiday-outline" id="btnHangOnTree">
                ${icons.tree || ''}
                <span>Hang On Memory Tree</span>
              </button>
              <button class="btn-holiday-text" id="btnClearStrip">
                ${icons.refresh || ''}
                <span>Reset Strip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.videoEl = document.getElementById('webcamVideo');

    // Camera buttons
    const btnStartCamera = document.getElementById('btnStartCamera');
    const btnToggleCam = document.getElementById('btnToggleCam');
    if (btnStartCamera) btnStartCamera.addEventListener('click', () => this.startCamera());
    if (btnToggleCam) btnToggleCam.addEventListener('click', () => this.toggleCamera());

    // Camera device dropdown
    const deviceSelect = document.getElementById('cameraDeviceSelect');
    if (deviceSelect) {
      deviceSelect.addEventListener('change', () => {
        if (deviceSelect.value) this.startCamera(deviceSelect.value);
      });
    }
    this.refreshCameraDeviceList();

    // Capture sequence button (Auto 3 photos)
    const btnStartCapture = document.getElementById('btnStartCapture');
    if (btnStartCapture) btnStartCapture.addEventListener('click', () => this.startCaptureSequence());

    // Single snap button (Instant 1 photo)
    const btnSnapSingle = document.getElementById('btnSnapSingle');
    if (btnSnapSingle) btnSnapSingle.addEventListener('click', () => this.snapSinglePhoto());

    // Direct phone camera / file upload input
    const directDevCam = document.getElementById('directDeviceCamera');
    if (directDevCam) {
      directDevCam.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    // Standard file upload
    const fileInput = document.getElementById('fileInputUpload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    // Load sample photos
    const btnLoadSample = document.getElementById('btnLoadSample');
    if (btnLoadSample) {
      btnLoadSample.addEventListener('click', () => {
        window.xmasAudio.playBellChime();
        this.shots = [...this.samplePhotos];
        this.updateStripPhotos();
      });
    }

    // Filters
    const filterChips = this.container.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeFilter = chip.getAttribute('data-filter');
        if (this.videoEl) {
          this.videoEl.className = `camera-feed filter-${this.activeFilter}`;
        }
        this.updateStripPhotos();
        window.xmasAudio.playStickerPop();
      });
    });

    // Layout Selector
    const layoutBtns = this.container.querySelectorAll('.btn-layout');
    layoutBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        layoutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeLayout = btn.getAttribute('data-layout');
        const strip = document.getElementById('photostripPreview');
        if (strip) {
          strip.className = `photostrip theme-${this.activeFrameTheme} ${this.activeLayout}`;
        }
        window.xmasAudio.playStickerPop();
      });
    });

    // 10 Frame Theme Selector
    const frameSwatches = this.container.querySelectorAll('.frame-swatch');
    frameSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        frameSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.activeFrameTheme = swatch.getAttribute('data-theme');
        const strip = document.getElementById('photostripPreview');
        if (strip) {
          strip.className = `photostrip theme-${this.activeFrameTheme} ${this.activeLayout}`;
        }
        window.xmasAudio.playStickerPop();
      });
    });

    // Stickers
    const stickerItems = this.container.querySelectorAll('.sticker-item');
    stickerItems.forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        this.addStickerToStrip(id);
      });
    });

    // Strip actions
    const btnDownload = document.getElementById('btnDownloadStrip');
    const btnHang = document.getElementById('btnHangOnTree');
    const btnClear = document.getElementById('btnClearStrip');

    if (btnDownload) btnDownload.addEventListener('click', () => this.exportHighResStrip());
    if (btnHang) btnHang.addEventListener('click', () => this.hangStripOnTree());
    if (btnClear) btnClear.addEventListener('click', () => this.clearStrip());

    // Editable footer
    const footerTitle = document.getElementById('stripFooterTitle');
    const footerSubtitle = document.getElementById('stripFooterSubtitle');
    if (footerTitle) {
      footerTitle.addEventListener('input', () => {
        this.customFooterText = footerTitle.innerText.trim();
      });
    }
    if (footerSubtitle) {
      footerSubtitle.addEventListener('input', () => {
        this.customSubtitle = footerSubtitle.innerText.trim();
      });
    }
  }

  async refreshCameraDeviceList() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      const select = document.getElementById('cameraDeviceSelect');
      const row = document.getElementById('cameraDeviceRow');
      if (!select || !row) return;

      if (videoInputs.length > 1) {
        select.innerHTML = videoInputs.map((d, idx) => `
          <option value="${d.deviceId}">${d.label || `Kamera ${idx + 1}`}</option>
        `).join('');
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    } catch (e) {
      console.warn('Could not enumerate video devices', e);
    }
  }

  async startCamera(preferredDeviceId = null) {
    if (window.xmasAudio && window.xmasAudio.ensureContext) {
      window.xmasAudio.ensureContext();
    }
    const placeholder = document.getElementById('cameraPlaceholder');
    const liveBadge = document.getElementById('cameraLiveBadge');
    const toggleText = document.getElementById('btnToggleCamText');

    // 1. Listen for Chrome permission change events (auto-start when user flips (i) toggle)
    if (navigator.permissions && navigator.permissions.query) {
      try {
        navigator.permissions.query({ name: 'camera' }).then(permissionStatus => {
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted' && (!this.stream || !this.stream.active)) {
              console.log('Camera permission granted via browser settings! Auto-starting...');
              this.startCamera();
            }
          };
        }).catch(() => {});
      } catch (e) {}
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('navigator.mediaDevices.getUserMedia is not supported on this browser context');
      if (placeholder) {
        placeholder.style.display = 'flex';
        placeholder.innerHTML = `
          <div class="placeholder-icon-svg" style="color: #f59e0b; font-size: 2.2rem;">⚠️</div>
          <h4 style="color: #ffd700; margin-bottom: 6px;">Fitur Webcam Tidak Didukung</h4>
          <p style="font-size: 0.88rem; line-height: 1.5; max-width: 380px; margin: 0 auto 16px; color: #fff9e6;">
            Browser ini tidak mendukung live webcam. Jangan khawatir, kamu tetap bisa berfoto menggunakan tombol upload/kamera HP di bawah!
          </p>
        `;
      }
      return false;
    }

    // Stop existing stream if switching devices
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }

    // Candidate constraints list
    const candidateConstraints = [];
    if (preferredDeviceId) {
      candidateConstraints.push({ video: { deviceId: { exact: preferredDeviceId } }, audio: false });
    }
    candidateConstraints.push({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
    candidateConstraints.push({ video: { facingMode: 'user' }, audio: false });
    candidateConstraints.push({ video: true, audio: false });

    let stream = null;
    let lastError = null;

    for (const constraints of candidateConstraints) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (stream) break;
      } catch (err) {
        lastError = err;
        console.warn('Camera constraint attempt failed:', constraints, err.name, err.message);
        // If permission explicitly denied by user, stop trying constraints that will immediately fail
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          break;
        }
      }
    }

    if (stream) {
      this.stream = stream;
      if (this.videoEl) {
        this.videoEl.srcObject = this.stream;
        try {
          await this.videoEl.play();
        } catch (e) {
          console.warn('Video play issue:', e);
        }
        if (placeholder) placeholder.style.display = 'none';
        if (liveBadge) liveBadge.classList.remove('hidden');
        if (toggleText) toggleText.innerText = 'Tutup Cam';
        if (window.xmasAudio) window.xmasAudio.playBellChime();
        if (window.showHolidayToast) {
          window.showHolidayToast('Kamera webcam berhasil terhubung! Siap berfoto!', '📹');
        }
        this.refreshCameraDeviceList();
      }
      return true;
    }

    // If stream could not be started, show clear on-screen guidance
    console.error('Final Camera Error:', lastError);
    if (liveBadge) liveBadge.classList.add('hidden');
    if (toggleText) toggleText.innerText = 'Webcam';

    if (placeholder) {
      placeholder.style.display = 'flex';
      const isBlocked = lastError && (lastError.name === 'NotAllowedError' || lastError.name === 'PermissionDeniedError');
      const isBusy = lastError && (lastError.name === 'NotReadableError' || lastError.name === 'TrackStartError');

      if (isBlocked) {
        placeholder.innerHTML = `
          <div class="permission-guide-box">
            <div class="permission-guide-title">
              <span>⚠️</span>
              <span>Izin Akses Kamera Terblokir di Chrome</span>
            </div>
            <div class="permission-step">
              <span class="permission-step-num">1</span>
              <span>Lihat address bar di paling atas browser Chrome kamu (di sebelah kiri <code>localhost:3000</code>).</span>
            </div>
            <div class="permission-step">
              <span class="permission-step-num">2</span>
              <span>Klik ikon <strong>( i )</strong> atau ikon <strong>Gembok / Setelan</strong> di samping <code>localhost:3000</code>.</span>
            </div>
            <div class="permission-step">
              <span class="permission-step-num">3</span>
              <span>Pada baris <strong>Kamera (Camera)</strong>, klik tombol geser/dropdown dan ubah menjadi <strong>Allow (Izinkan)</strong>.</span>
            </div>
            <div class="permission-guide-actions">
              <button class="btn-holiday-gold" id="btnRetryCamera" style="padding: 9px 20px; border-radius: 25px; font-size: 0.88rem;">
                🔄 Buka Kamera Sekarang
              </button>
              <label class="btn-holiday-outline" for="directDeviceCamera" style="cursor: pointer; padding: 9px 18px; border-radius: 25px; display: inline-flex; align-items: center; gap: 6px; font-size: 0.88rem;">
                📸 Pakai Kamera HP / Foto
              </label>
            </div>
          </div>
        `;
        if (window.showHolidayToast) {
          window.showHolidayToast('Izin kamera belum aktif. Klik ikon ( i ) di sebelah localhost:3000 pada address bar Chrome untuk Allow!', '⚠️', 6000);
        }
      } else if (isBusy) {
        placeholder.innerHTML = `
          <div class="placeholder-icon-svg" style="color: #f59e0b; font-size: 2.2rem;">📷</div>
          <h4 style="color: #ffd700; margin-bottom: 6px;">Kamera Sedang Digunakan Aplikasi Lain</h4>
          <p style="font-size: 0.88rem; line-height: 1.5; max-width: 390px; margin: 0 auto 16px; color: #fff9e6;">
            Webcam sedang aktif di aplikasi lain (seperti Windows Camera, Zoom, Discord, OBS, atau WhatsApp Desktop).<br>
            Tutup aplikasi tersebut lalu klik tombol di bawah:
          </p>
          <button class="btn-holiday-gold" id="btnRetryCamera" style="padding: 10px 24px; border-radius: 25px;">
            🔄 Coba Hubungkan Lagi
          </button>
        `;
        if (window.showHolidayToast) {
          window.showHolidayToast('Kamera sedang dipakai aplikasi lain (OBS/Zoom/Discord). Tutup aplikasi tersebut dulu!', '⚠️', 5000);
        }
      } else {
        placeholder.innerHTML = `
          <div class="placeholder-icon-svg" style="color: #f59e0b; font-size: 2.2rem;">⚠️</div>
          <h4 style="color: #ffd700; margin-bottom: 6px;">Kamera Siap Digunakan</h4>
          <p style="font-size: 0.88rem; line-height: 1.5; max-width: 390px; margin: 0 auto 16px; color: #fff9e6;">
            Klik tombol di bawah untuk menyalakan webcam, atau gunakan tombol upload / kamera HP.
          </p>
          <button class="btn-holiday-gold" id="btnRetryCamera" style="padding: 10px 24px; border-radius: 25px;">
            🔄 Buka Kamera
          </button>
        `;
      }

      const retryBtn = placeholder.querySelector('#btnRetryCamera');
      if (retryBtn) retryBtn.addEventListener('click', () => this.startCamera());
    }

    return false;
  }

  toggleCamera() {
    const liveBadge = document.getElementById('cameraLiveBadge');
    const toggleText = document.getElementById('btnToggleCamText');

    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
      if (this.videoEl) this.videoEl.srcObject = null;
      const placeholder = document.getElementById('cameraPlaceholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
        placeholder.innerHTML = `
          <div class="placeholder-icon-svg" style="color: #d4af37; font-size: 2.2rem;">📷</div>
          <h4 style="color: #ffd700; margin-bottom: 6px;">Webcam Dijeda</h4>
          <p style="font-size: 0.88rem; line-height: 1.5; max-width: 360px; margin: 0 auto 16px; color: #fff9e6;">
            Klik tombol di bawah untuk menyalakan kembali webcam live preview!
          </p>
          <button class="btn-holiday-gold" id="btnRestartCamFromPlaceholder" style="padding: 10px 24px; border-radius: 25px;">
            🔄 Buka Webcam
          </button>
        `;
        const restartBtn = placeholder.querySelector('#btnRestartCamFromPlaceholder');
        if (restartBtn) restartBtn.addEventListener('click', () => this.startCamera());
      }
      if (liveBadge) liveBadge.classList.add('hidden');
      if (toggleText) toggleText.innerText = 'Webcam';
      if (window.showHolidayToast) {
        window.showHolidayToast('Webcam dinonaktifkan.', '⏸️');
      }
    } else {
      this.startCamera();
    }
  }

  async snapSinglePhoto() {
    if (window.xmasAudio && window.xmasAudio.ensureContext) {
      window.xmasAudio.ensureContext();
    }
    if (!this.stream) {
      const ok = await this.startCamera();
      if (!ok) {
        const directCam = document.getElementById('directDeviceCamera') || document.getElementById('fileInputUpload');
        if (directCam) {
          if (window.showHolidayToast) {
            window.showHolidayToast('Membuka pilihan foto / kamera perangkat...', '📸', 2500);
          }
          directCam.click();
        }
        return;
      }
    }

    if (window.xmasAudio) window.xmasAudio.playCameraShutter();
    this.triggerFlash();
    const photoDataUrl = this.captureCurrentVideoFrame();

    const maxNeeded = this.getRequiredShotsCount();
    if (this.shots.length >= maxNeeded) {
      this.shots[maxNeeded - 1] = photoDataUrl;
    } else {
      this.shots.push(photoDataUrl);
    }
    this.updateStripPhotos();
    if (window.xmasAudio) window.xmasAudio.playBellChime();
    if (window.showHolidayToast) {
      window.showHolidayToast(`Foto berhasil diambil! (${this.shots.length}/${maxNeeded})`, '✨', 2500);
    }
  }

  async startCaptureSequence() {
    if (this.isCapturing) return;

    if (!this.stream) {
      const ok = await this.startCamera();
      if (!ok) {
        if (window.showHolidayToast) {
          window.showHolidayToast('Webcam belum aktif. Izinkan kamera di Chrome atau klik tombol emas Ambil Foto Kamera HP!', '📸', 5000);
        }
        return;
      }
    }

    this.isCapturing = true;
    this.shots = [];
    this.updateStripPhotos();

    const maxNeeded = this.getRequiredShotsCount();
    const poses = [
      'Pose 1: Big Warm Smile!',
      'Pose 2: Peace / Heart Hands!',
      'Pose 3: Cute Holiday Wink!'
    ];

    const poseHint = document.getElementById('poseHint');
    const poseHintText = document.getElementById('poseHintText');
    const countdownOverlay = document.getElementById('countdownOverlay');
    const countdownDigit = document.getElementById('countdownDigit');

    for (let shotIndex = 0; shotIndex < maxNeeded; shotIndex++) {
      if (poseHint && poseHintText) {
        poseHint.classList.remove('hidden');
        poseHintText.innerText = poses[shotIndex % poses.length];
      }

      for (let sec = 3; sec > 0; sec--) {
        if (countdownOverlay && countdownDigit) {
          countdownOverlay.classList.remove('hidden');
          countdownDigit.innerText = sec;
          countdownDigit.classList.remove('digit-pop');
          void countdownDigit.offsetWidth;
          countdownDigit.classList.add('digit-pop');
        }
        window.xmasAudio.playCountdownBeep(false);
        await this.delay(1000);
      }

      window.xmasAudio.playCountdownBeep(true);
      window.xmasAudio.playCameraShutter();
      this.triggerFlash();

      const photoDataUrl = this.captureCurrentVideoFrame();
      this.shots.push(photoDataUrl);
      this.updateStripPhotos();

      if (countdownOverlay) countdownOverlay.classList.add('hidden');

      if (shotIndex < maxNeeded - 1) {
        await this.delay(1400);
      }
    }

    if (poseHint) poseHint.classList.add('hidden');
    this.isCapturing = false;

    window.xmasAudio.playFanfare();
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#e53935', '#43a047', '#ffd700', '#ffffff']
      });
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  triggerFlash() {
    const flash = document.getElementById('cameraFlash');
    if (flash) {
      flash.classList.add('flash-active');
      setTimeout(() => flash.classList.remove('flash-active'), 250);
    }
  }

  captureCurrentVideoFrame() {
    if (!this.videoEl || !this.videoEl.videoWidth) {
      return this.samplePhotos[this.shots.length % this.samplePhotos.length];
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.videoEl.videoWidth || 1280;
    canvas.height = this.videoEl.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.filter = this.getCanvasFilterCSS(this.activeFilter);
    ctx.drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.95);
  }

  getCanvasFilterCSS(filterName) {
    switch (filterName) {
      case 'kodachrome': return 'contrast(1.2) saturate(1.25) sepia(0.18)';
      case 'dream': return 'brightness(1.1) contrast(0.95) saturate(1.15)';
      case 'cool': return 'hue-rotate(185deg) saturate(0.9) brightness(1.05)';
      case 'bw': return 'grayscale(1) contrast(1.3) brightness(0.95)';
      case 'warm':
      default: return 'sepia(0.2) saturate(1.2) brightness(1.05)';
    }
  }

  handleFileUpload(e) {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;

    if (window.xmasAudio) window.xmasAudio.playBellChime();
    const maxNeeded = this.getRequiredShotsCount();

    if (fileList.length >= maxNeeded || this.shots.length >= maxNeeded) {
      this.shots = [];
    }

    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (this.shots.length < maxNeeded) {
          this.shots.push(evt.target.result);
        } else {
          this.shots[maxNeeded - 1] = evt.target.result;
        }
        this.updateStripPhotos();
        if (window.showHolidayToast) {
          window.showHolidayToast(`Foto berhasil dimuat (${this.shots.length}/${maxNeeded})!`, '🖼️', 2000);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  }

  updateStripPhotos() {
    const grid = document.getElementById('stripPhotosGrid');
    if (!grid) return;

    const slots = grid.querySelectorAll('.strip-frame');
    slots.forEach((slot, i) => {
      if (this.shots[i]) {
        slot.innerHTML = `
          <img src="${this.shots[i]}" class="slot-photo filter-${this.activeFilter}" alt="Photo ${i + 1}">
          <button class="btn-slot-retake" data-index="${i}" title="Remove photo">×</button>
        `;
        const retakeBtn = slot.querySelector('.btn-slot-retake');
        if (retakeBtn) {
          retakeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.shots.splice(i, 1);
            this.updateStripPhotos();
          });
        }
      } else {
        slot.innerHTML = `
          <div class="slot-empty">
            <span>#${i + 1}</span>
          </div>
        `;
      }
    });
  }

  addStickerToStrip(stickerId) {
    const stickerData = (window.CHRISTMAS_STICKERS || []).find(s => s.id === stickerId);
    if (!stickerData) return;

    window.xmasAudio.playStickerPop();
    const layer = document.getElementById('stripStickersLayer');
    if (!layer) return;

    const stickerEl = document.createElement('div');
    stickerEl.className = 'placed-sticker';
    stickerEl.innerHTML = `
      ${stickerData.svg}
      <button class="remove-sticker-btn">×</button>
    `;

    const randomRot = (Math.random() * 20 - 10).toFixed(1);
    stickerEl.style.left = '40%';
    stickerEl.style.top = '40%';
    stickerEl.style.transform = `rotate(${randomRot}deg)`;

    this.makeDraggable(stickerEl, layer);

    const removeBtn = stickerEl.querySelector('.remove-sticker-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stickerEl.remove();
      });
    }

    layer.appendChild(stickerEl);
  }

  makeDraggable(el, boundary) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    const onStart = (clientX, clientY) => {
      isDragging = true;
      startX = clientX;
      startY = clientY;
      initialLeft = el.offsetLeft;
      initialTop = el.offsetTop;
      el.classList.add('is-dragging');
    };

    const onMove = (clientX, clientY) => {
      if (!isDragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      el.style.left = `${initialLeft + dx}px`;
      el.style.top = `${initialTop + dy}px`;
    };

    const onEnd = () => {
      isDragging = false;
      el.classList.remove('is-dragging');
    };

    el.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('remove-sticker-btn')) return;
      onStart(e.clientX, e.clientY);
      const moveHandler = (me) => onMove(me.clientX, me.clientY);
      const upHandler = () => {
        onEnd();
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', upHandler);
      };
      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', upHandler);
    });

    el.addEventListener('touchstart', (e) => {
      if (e.target.classList.contains('remove-sticker-btn')) return;
      if (e.touches.length > 0) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    el.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    el.addEventListener('touchend', onEnd);
  }

  clearStrip() {
    this.shots = [];
    const layer = document.getElementById('stripStickersLayer');
    if (layer) layer.innerHTML = '';
    this.updateStripPhotos();
    window.xmasAudio.playBellChime();
  }

  // Export High-Res PNG with Watermark: Made by Reizo Rajendra Dianta
  async exportHighResStrip() {
    window.xmasAudio.playCameraShutter();

    const needed = this.getRequiredShotsCount();
    const exportShots = [...this.shots];
    while (exportShots.length < needed) {
      exportShots.push(this.samplePhotos[exportShots.length % this.samplePhotos.length]);
    }

    const canvas = document.createElement('canvas');
    let width = 800;
    let height = 1860;

    if (this.activeLayout === 'layout-polaroid') {
      width = 900;
      height = 1600;
    } else if (this.activeLayout === 'layout-card') {
      width = 1000;
      height = 1360;
    } else {
      // Default: 3-Cut Classic Strip (3 Photos!)
      width = 800;
      height = 1860;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background Theme
    this.drawStripBackground(ctx, width, height, this.activeFrameTheme);

    // 2. Header
    ctx.textAlign = 'center';
    ctx.fillStyle = this.getThemeTextColor(this.activeFrameTheme);
    ctx.font = 'bold 28px "Cinzel", serif';
    ctx.fillText('✦ CHRISTMAS MEMORIES ✦', width / 2, 75);

    // 3. Draw Photos per Layout
    let footerY = 1690;

    if (this.activeLayout === 'layout-polaroid') {
      const pw = 720;
      const ph = 540;
      const px = (width - pw) / 2;
      await this.drawFramedPhoto(ctx, exportShots[0], px, 120, pw, ph);
      await this.drawFramedPhoto(ctx, exportShots[1], px, 710, pw, ph);
      footerY = 1430;
    } else if (this.activeLayout === 'layout-card') {
      const pw = 860;
      const ph = 890;
      const px = (width - pw) / 2;
      await this.drawFramedPhoto(ctx, exportShots[0], px, 115, pw, ph);
      footerY = 1190;
    } else {
      // 3-Cut Strip (3 Photos)
      const pw = 700;
      const ph = 440;
      const px = (width - pw) / 2;
      for (let i = 0; i < 3; i++) {
        await this.drawFramedPhoto(ctx, exportShots[i], px, 115 + i * 480, pw, ph);
      }
      footerY = 1690;
    }

    // 4. Footer & Watermark
    ctx.fillStyle = this.getThemeTextColor(this.activeFrameTheme);
    ctx.font = 'bold 36px "Playfair Display", serif';
    ctx.fillText(this.customFooterText || 'MERRY CHRISTMAS 2026', width / 2, footerY);

    ctx.font = 'italic 24px "Great Vibes", cursive';
    ctx.fillText(this.customSubtitle || 'with joy & warmth • 25.12', width / 2, footerY + 45);

    // Official Creator Watermark on Exported PNG
    ctx.font = 'bold 16px "Cinzel", serif';
    ctx.fillText('Made by Reizo Rajendra Dianta', width / 2, footerY + 80);

    ctx.font = '14px monospace';
    ctx.fillText('||| | |||| | ||| |||| | XMAS-2026-REIZO', width / 2, footerY + 105);

    // Download PNG
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Christmas-${this.activeLayout}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    // Auto-save to backend database so Reizo can see all submissions!
    this.saveToDatabase(dataUrl);

    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
    }
  }

  async saveToDatabase(dataUrl) {
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          name: this.customFooterText || 'Pengunjung Natal',
          message: this.customSubtitle || 'Merry Christmas 2026',
          layout: this.activeLayout,
          theme: this.activeFrameTheme
        })
      });
      const resData = await res.json();
      if (resData.success) {
        console.log('Saved to photobooth database:', resData.data.id);
        if (window.refreshCommunityGallery) {
          window.refreshCommunityGallery();
        }
      }
    } catch (e) {
      console.warn('Database submission error', e);
    }
  }

  async drawFramedPhoto(ctx, src, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fillRect(x - 5, y - 5, w + 10, h + 10);
    ctx.restore();

    await this.drawImageToCanvas(ctx, src, x, y, w, h, this.activeFilter);
  }

  drawStripBackground(ctx, w, h, theme) {
    if (theme === 'tartan') {
      ctx.fillStyle = '#8b1e2a';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(27, 59, 43, 0.45)';
      for (let x = 0; x < w; x += 60) ctx.fillRect(x, 0, 30, h);
      for (let y = 0; y < h; y += 60) ctx.fillRect(0, y, w, 30);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3;
      for (let x = 30; x < w; x += 120) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 30; y < h; y += 120) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    } else if (theme === 'evergreen') {
      ctx.fillStyle = '#143323';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, w - 40, h - 40);
    } else if (theme === 'snow') {
      ctx.fillStyle = '#FAF7F2';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#8b1e2a';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, w - 40, h - 40);
    } else if (theme === 'gingerbread') {
      ctx.fillStyle = '#7a4b3d';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#ffffff';
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, w - 40, h - 40);
      ctx.setLineDash([]);
    } else if (theme === 'film90s') {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, w - 36, h - 36);
    } else if (theme === 'ribbon') {
      ctx.fillStyle = '#941725';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 5;
      ctx.strokeRect(20, 20, w - 40, h - 40);
    } else if (theme === 'midnight') {
      ctx.fillStyle = '#0b1320';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, w - 40, h - 40);
    } else if (theme === 'newspaper') {
      ctx.fillStyle = '#f4ede1';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#2b1f1d';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, w - 40, h - 40);
    } else if (theme === 'minimalist') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, w - 40, h - 40);
    } else {
      ctx.fillStyle = '#7a121f';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#e5c158';
      ctx.lineWidth = 4;
      ctx.strokeRect(18, 18, w - 36, h - 36);
    }
  }

  getThemeTextColor(theme) {
    if (theme === 'snow' || theme === 'newspaper') return '#7a121f';
    if (theme === 'minimalist') return '#1f2937';
    if (theme === 'midnight') return '#fef08a';
    if (theme === 'film90s') return '#fbbf24';
    return '#FFF9E6';
  }

  async drawImageToCanvas(ctx, src, x, y, w, h, filterName) {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.filter = this.getCanvasFilterCSS(filterName);

        const imgAspect = img.width / img.height;
        const boxAspect = w / h;
        let sx, sy, sw, sh;

        if (imgAspect > boxAspect) {
          sh = img.height;
          sw = img.height * boxAspect;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = img.width / boxAspect;
          sx = 0;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    });
  }

  hangStripOnTree() {
    if (this.shots.length === 0) {
      if (window.showHolidayToast) {
        window.showHolidayToast('Silakan ambil atau upload foto terlebih dahulu!', '📸', 3000);
      }
      return;
    }

    if (window.xmasTree) {
      window.xmasTree.addPhoto({
        id: `strip-${Date.now()}`,
        title: this.customFooterText || 'Photobooth Cut',
        date: 'Dec 25, 2026',
        caption: 'Freshly taken at our vintage Christmas Photobooth!',
        src: this.shots[0],
        rotation: (Math.random() * 8 - 4).toFixed(1)
      });

      if (window.xmasAudio) window.xmasAudio.playBellChime();
      if (window.showHolidayToast) {
        window.showHolidayToast('Foto photobooth kamu berhasil digantung di Pohon Natal!', '🎄', 4000);
      }

      const treeEl = document.getElementById('sectionTree');
      if (treeEl) treeEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

window.ChristmasPhotobooth = ChristmasPhotobooth;
