/* ==========================================================================
   THE ENCHANTED JOURNAL OF PRATIKSHA
   2-Page Book Spread Physical Page Flip Engine with Dynamic Z-Index Stacking
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  const journalData = window.journalData;
  if (!journalData || !journalData.spreads) {
    console.error("Journal spread data not found!");
    return;
  }

  const spreads = journalData.spreads;

  // ==========================================
  // 1. STATE & DOM ELEMENTS
  // ==========================================
  const state = {
    currentScene: 0, // 0: Portal, 1: Castle, 2: Forest, 3: Library, 4: Desk
    isOpen: false,
    currentSheet: 0, // 0: Cover, 1 to totalSheets
    totalSheets: spreads.length - 1,
    isAudioOn: true,
    isJourneyStarted: false
  };

  // Cinematic DOM Nodes
  const cinematicViewport = document.getElementById('cinematic-viewport');
  const stageClouds = document.getElementById('stage-clouds-view');
  const stageCastle = document.getElementById('stage-castle-view');
  const stageForest = document.getElementById('stage-forest-view');
  const stageLibrary = document.getElementById('stage-library-view');
  const stageDesk = document.getElementById('stage-desk-view');

  const sceneViews = [stageCastle, stageForest, stageLibrary, stageDesk];

  // Book DOM Nodes
  const bookContainer = document.getElementById('enchanted-book-container');
  const frontCoverPlate = document.getElementById('front-cover-plate');
  const bookPagesStack = document.getElementById('book-pages-stack');
  const audioControlBtn = document.getElementById('audio-control');
  const leftBasePlate = document.querySelector('.left-base-plate');
  const introVideoOverlay = document.getElementById('intro-video-overlay');
  const introVideoPlayer = document.getElementById('intro-video');


  // ==========================================
  // 2. WEB AUDIO SFX ENGINE (Page Flip, Chime, Wax Crack)
  // ==========================================
  class MagicalAudioSynth {
    constructor() {
      this.ctx = null;
      this.isEnabled = true;
    }

    init() {
      try {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      } catch (e) {}
    }

    playChime() {
      if (!this.isEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.1);
          gain.gain.setValueAtTime(0.01, this.ctx.currentTime + index * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.15, this.ctx.currentTime + index * 0.1 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.1 + 0.7);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + index * 0.1);
          osc.stop(this.ctx.currentTime + index * 0.1 + 0.8);
        });
      } catch (e) {}
    }

    playPageFlip() {
      if (!this.isEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(700, this.ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(250, this.ctx.currentTime + 0.15);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        whiteNoise.start();
      } catch (e) {}
    }

    playWaxCrack() {
      if (!this.isEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
        this.playChime();
      } catch(e) {}
    }
  }

  const audioSynth = new MagicalAudioSynth();

  audioControlBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    state.isAudioOn = !state.isAudioOn;
    audioSynth.isEnabled = state.isAudioOn;
    if (state.isAudioOn) {
      audioSynth.init();
      audioControlBtn.querySelector('.audio-label').textContent = 'Sound On';
      audioControlBtn.querySelector('.audio-icon').textContent = '🪄🔊';
    } else {
      audioControlBtn.querySelector('.audio-label').textContent = 'Muted';
      audioControlBtn.querySelector('.audio-icon').textContent = '🪄🔇';
    }
  });


  // ==========================================
  // 3. CANVAS PARTICLE ENGINE
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(x, y, isBurst = false) {
      this.x = x || Math.random() * canvas.width;
      this.y = y || Math.random() * canvas.height;
      this.size = isBurst ? Math.random() * 4 + 2 : Math.random() * 2.5 + 0.5;
      this.speedX = isBurst ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 0.8;
      this.speedY = isBurst ? (Math.random() - 0.5) * 8 : -Math.random() * 0.8 - 0.2;
      this.color = isBurst 
        ? `hsl(${Math.random() * 50 + 35}, 100%, 70%)` 
        : `rgba(255, 242, 161, ${Math.random() * 0.8 + 0.2})`;
      this.alpha = 1;
      this.decay = isBurst ? Math.random() * 0.02 + 0.01 : 0;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.decay > 0) {
        this.alpha -= this.decay;
      } else {
        if (this.y < 0) this.y = canvas.height;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fff2a1';
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 75; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function triggerBurst(x, y) {
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(x, y, true));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
      p.update();
      p.draw();
      if (p.alpha <= 0) {
        particles.splice(index, 1);
      }
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  // ==========================================
  // 4. AUTOMATED CINEMATIC CAMERA CONTROLLER
  // ==========================================
  function goToScene(sceneIndex) {
    state.currentScene = sceneIndex;
    
    if (stageClouds) stageClouds.classList.remove('active');

    sceneViews.forEach((view, idx) => {
      if (view) {
        if (idx === sceneIndex - 1) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      }
    });

    audioSynth.playChime();
  }

  function startAutomatedJourney() {
    if (state.isJourneyStarted) return;
    state.isJourneyStarted = true;

    audioSynth.init();
    goToScene(4);
  }

  function openBookDirectly() {
    if (state.isOpen) return;

    state.isOpen = true;
    state.currentSheet = 1;
    audioSynth.init();
    audioSynth.playPageFlip();
    audioSynth.playChime();

    if (bookContainer) {
      bookContainer.classList.remove('state-closed');
      bookContainer.classList.add('state-open');
    }

    if (frontCoverPlate) {
      frontCoverPlate.classList.add('front-cover-hidden');
    }
  }

  // ==========================================
  // 5. RENDER 2-PAGE SPREAD HTML CONTENT
  // ==========================================
  function renderSinglePageHTML(pageObj) {
    if (!pageObj) return '';

    switch (pageObj.type) {
      case 'prologue-left':
        return `
          <div class="journal-header" style="margin-top: 15%;">
            <span class="header-rune">${pageObj.crest}</span>
            <span class="page-badge">${pageObj.badge}</span>
            <h1 class="page-title">${pageObj.title}</h1>
            <p class="page-tagline">${pageObj.subtitle}</p>
            <p class="page-body-text" style="font-size: 1.1rem; margin-top: 20px;">${pageObj.text}</p>
          </div>
        `;

      case 'prologue-right':
        return `
          <span class="page-badge">${pageObj.badge}</span>
          <h2 class="page-title">${pageObj.title}</h2>
          <div class="page-body-text" style="margin-top: 20px;">${pageObj.content}</div>
          <div class="page-turn-hint">✦ Tap anywhere on screen to flip › ✦</div>
        `;

      case 'toc-right':
        const tocItems = pageObj.items.map(item => `
          <li>
            <span class="toc-chapter">${item.chapter}</span>
            <span class="toc-description">${item.description}</span>
          </li>
        `).join('');

        return `
          <span class="page-badge">${pageObj.badge}</span>
          <h2 class="page-title">${pageObj.title}</h2>
          <div class="page-body-text" style="margin-top: 18px;">${pageObj.intro}</div>
          <ul class="toc-list">
            ${tocItems}
          </ul>
          <div class="page-turn-hint">✦ Tap anywhere on screen to start the story › ✦</div>
        `;

      case 'image-left':
        return `
          <span class="page-badge">${pageObj.badge}</span>
          <h2 class="page-title">${pageObj.title}</h2>
          <div class="page-tagline">"${pageObj.tagline}"</div>
          <div class="page-illustration">
            <div class="illustration-art" style="background-image: url('${pageObj.imageUrl}');"></div>
            <div class="illustration-caption">${pageObj.imageCaption}</div>
          </div>
          ${pageObj.content ? `<div class="page-body-text" style="font-size: 1.05rem;">${pageObj.content}</div>` : ''}
        `;

      case 'text-right':
      case 'text-left':
        const illustrationClass = pageObj.imageUrl && pageObj.imageUrl.includes('class_group_photo') ? 'page-illustration small-illustration' : 'page-illustration';
        const illustrationHeight = pageObj.imageUrl && pageObj.imageUrl.includes('class_group_photo') ? 'height: 620px;' : 'height: 150px;';
        return `
          <span class="page-badge">${pageObj.badge}</span>
          <h2 class="page-title">${pageObj.title}</h2>
          ${pageObj.tagline ? `<div class="page-tagline">"${pageObj.tagline}"</div>` : ''}
          ${pageObj.imageUrl ? `
            <div class="${illustrationClass}" style="${illustrationHeight}">
              <div class="illustration-art" style="background-image: url('${pageObj.imageUrl}');"></div>
              <div class="illustration-caption">${pageObj.imageCaption}</div>
            </div>` : ''}
          <div class="page-body-text">${pageObj.content}</div>
          <div class="page-turn-hint">✦ Tap anywhere to flip next › ✦</div>
        `;

      case 'poetry-right':
        const quotesHTML = pageObj.quotes.map(q => `
          <div class="quote-item">
            <p class="quote-text">"${q.text}"</p>
            <p class="quote-author">— ${q.author}</p>
          </div>
        `).join('');

        return `
          <span class="page-badge">${pageObj.badge}</span>
          <h2 class="page-title">${pageObj.title}</h2>
          <div class="page-tagline">"${pageObj.tagline}"</div>
          <div class="quotes-card">${quotesHTML}</div>
          <div class="page-turn-hint">✦ Tap anywhere to flip next › ✦</div>
        `;

      case 'gallery-left':
      case 'gallery-right':
        const portraitsHTML = pageObj.portraits.map(p => `
          <div class="portrait-card">
            <div class="portrait-frame-art" style="background-image: url('${p.imageUrl}');"></div>
          </div>
        `).join('');

        return `
          <span class="page-badge">${pageObj.badge}</span>
          <h2 class="page-title">${pageObj.title}</h2>
          <div class="page-tagline">"${pageObj.tagline}"</div>
          <div class="portraits-grid">${portraitsHTML}</div>
          <div class="page-turn-hint">✦ Tap anywhere to flip next › ✦</div>
        `;

      case 'seal-left':
        return `
          <span class="page-badge">${pageObj.badge}</span>
          <h2 class="page-title">${pageObj.title}</h2>
          <div class="page-tagline">"${pageObj.tagline}"</div>
          
          <div id="wax-seal-container" class="wax-seal-wrapper">
            <button id="wax-seal-btn" class="wax-seal-img-btn" title="Click to break the Red Wax Seal!">
              <img src="${pageObj.waxSealImageUrl}" alt="Red Wax Seal" />
            </button>
            <div class="seal-prompt">✦ Tap the Red Wax Seal to Reveal the Letter ✦</div>
          </div>
        `;

      case 'envelope-right':
        return `
          <span class="page-badge">${pageObj.badge}</span>
          <h2 class="page-title">${pageObj.title}</h2>
          <div class="page-tagline">"${pageObj.tagline}"</div>
          <div class="envelope-wrapper">
            <div class="envelope-shell">
              <div class="envelope-flap"></div>
              <button id="wax-seal-btn" class="wax-seal-img-btn" title="Click to break the Red Wax Seal!">
                <img src="${pageObj.waxSealImageUrl}" alt="Red Wax Seal" />
              </button>
            </div>
            <div class="seal-caption">${pageObj.waxSealCaption}</div>
            <div id="parchment-scroll" class="birthday-parchment-scroll">
              <div class="letter-salutation">${pageObj.salutation}</div>
              <h2 class="letter-header">${pageObj.header}</h2>
              <div class="letter-body">${pageObj.body}</div>
            </div>
          </div>
        `;

      case 'letter-right':
        return `
          <span class="page-badge">${pageObj.badge}</span>
          <div id="birthday-scroll-unrolled" class="birthday-parchment-scroll">
            <div class="letter-salutation">${pageObj.salutation}</div>
            <h2 class="letter-header">${pageObj.header}</h2>
            <div class="letter-body">${pageObj.body}</div>
          </div>
        `;

      case 'wishes-left':
        const wishesHTML = pageObj.wishes.map(w => `<li>${w}</li>`).join('');
        return `
          <span class="page-badge">${pageObj.badge}</span>
          <h2 class="page-title">${pageObj.title}</h2>
          <div class="page-tagline">"${pageObj.tagline}"</div>
          <div class="wishes-card">
            <ul class="wishes-list">${wishesHTML}</ul>
          </div>
        `;

      case 'ending-right':
        return `
          <span class="page-badge">${pageObj.badge}</span>
          <h2 class="page-title">${pageObj.title}</h2>
          <div class="page-body-text" style="text-align: center; margin-top: 30%; font-weight: bold; color: #78350f;">
            ${pageObj.closing}
          </div>
        `;

      case 'blank-page':
        return '';

      default:
        return '';
    }
  }

  function animateLetterText(element, text, speed = 80) {
    if (!element) return;
    const tokens = text.split(/(\s+)/);
    element.textContent = '';
    let index = 0;
    const interval = setInterval(() => {
      if (index >= tokens.length) {
        clearInterval(interval);
        return;
      }
      element.textContent += tokens[index];
      index += 1;
    }, speed);
  }

  function createBookSheets() {
    if (leftBasePlate) {
      leftBasePlate.innerHTML = `
        <div class="paper-grain"></div>
        ${renderSinglePageHTML(spreads[0].leftPage)}
      `;
    }

    bookPagesStack.innerHTML = '';
    
    // Create physical sheets for Spreads, allowing any empty right page to leave a blank sheet
    const pagePairs = [];
    for (let i = 0; i < spreads.length - 1; i++) {
      const rightPage = spreads[i].rightPage;
      pagePairs.push({
        frontPage: rightPage && rightPage.type !== 'blank-page' ? rightPage : null,
        backPage: spreads[i + 1].leftPage
      });
    }

    pagePairs.forEach((pair, index) => {
      const sheet = document.createElement('div');
      sheet.className = 'page-sheet';
      sheet.id = `page-sheet-${index + 1}`;
      sheet.style.zIndex = (100 - index);

      const frontFace = document.createElement('div');
      frontFace.className = 'page-face-front';
      frontFace.innerHTML = `
        <div class="paper-grain"></div>
        ${renderSinglePageHTML(pair.frontPage)}
      `;

      const backFace = document.createElement('div');
      backFace.className = 'page-face-back';
      backFace.innerHTML = `
        <div class="paper-grain"></div>
        ${renderSinglePageHTML(pair.backPage)}
      `;

      sheet.appendChild(frontFace);
      sheet.appendChild(backFace);

      bookPagesStack.appendChild(sheet);
    });

    setTimeout(() => {
      const waxBtn = document.getElementById('wax-seal-btn');
      const parchmentScroll = document.getElementById('parchment-scroll');

      if (waxBtn) {
        waxBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const rect = waxBtn.getBoundingClientRect();
          triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
          
          waxBtn.classList.add('cracked');
          audioSynth.playWaxCrack();

          const envelopeShell = waxBtn.closest('.envelope-shell');
          if (envelopeShell) {
            envelopeShell.classList.add('open');
          }

          const pageFace = waxBtn.closest('.page-face-front, .page-face-back');
          if (pageFace) {
            pageFace.classList.add('zoomed');
          }

          if (parchmentScroll) {
            parchmentScroll.classList.add('revealed');
            const bodyText = parchmentScroll.querySelector('.letter-body');
            if (bodyText) {
              const text = bodyText.textContent || '';
              bodyText.textContent = '';
              animateLetterText(bodyText, text, 90);
            }
          }
        });
      }

      if (parchmentScroll) {
        parchmentScroll.addEventListener('click', (e) => {
          e.stopPropagation();
          parchmentScroll.classList.remove('revealed');

          const envelopeShell = parchmentScroll.closest('.envelope-wrapper')?.querySelector('.envelope-shell');
          if (envelopeShell) {
            envelopeShell.classList.remove('open');
          }

          const waxBtn = document.getElementById('wax-seal-btn');
          if (waxBtn) {
            waxBtn.classList.remove('cracked');
          }

          const pageFace = parchmentScroll.closest('.page-face-front, .page-face-back');
          if (pageFace) {
            pageFace.classList.remove('zoomed');
          }
        });
      }
    }, 500);
  }

  createBookSheets();

  let introVideoStarted = false;
  let introVideoEnded = false;

  function startIntroVideo() {
    if (!introVideoPlayer || introVideoStarted) return;
    introVideoPlayer.muted = false;
    introVideoPlayer.play().then(() => {
      introVideoStarted = true;
      introVideoEnded = false;
    }).catch(() => {
      // Browser blocked unmuted autoplay — wait for one tap to start unmuted
      function onFirstTap() {
        introVideoPlayer.muted = false;
        introVideoPlayer.play().then(() => {
          introVideoStarted = true;
          introVideoEnded = false;
        }).catch(() => {
          closeIntroVideo();
        });
        document.removeEventListener('click', onFirstTap);
      }
      document.addEventListener('click', onFirstTap);
    });
  }

  function closeIntroVideo() {
    // Instantly remove the overlay — no fade, no purple flash
    if (introVideoOverlay) {
      introVideoOverlay.style.display = 'none';
    }
    if (introVideoPlayer) {
      introVideoPlayer.pause();
    }
    state.isJourneyStarted = true;
    goToScene(4);
    openBookDirectly();
  }

  if (introVideoPlayer) {
    introVideoPlayer.addEventListener('ended', () => {
      introVideoEnded = true;
      closeIntroVideo();
    });
  }

  // Auto-play the intro video immediately on page load — no click needed
  startIntroVideo();


  // ==========================================
  // 6. GLOBAL CLICK-ANYWHERE PAGE FLIP ENGINE
  // ==========================================
  function openBook() {
    if (state.isOpen) return;
    audioSynth.init();

    state.isOpen = true;
    if (bookContainer) {
      bookContainer.classList.remove('state-closed');
      bookContainer.classList.add('state-open');
    }

    if (frontCoverPlate) {
      frontCoverPlate.classList.add('flipped');
      frontCoverPlate.style.zIndex = 10;
    }
    audioSynth.playChime();
    state.currentSheet = 1;
  }

  function turnPreviousPage() {
    if (!state.isOpen) {
      openBook();
      return;
    }

    if (state.currentSheet <= 1) {
      return;
    }

    const sheetIdx = state.currentSheet - 1;
    const currentSheetEl = document.getElementById(`page-sheet-${sheetIdx}`);
    if (currentSheetEl) {
      currentSheetEl.classList.remove('flipped');
      currentSheetEl.style.zIndex = 100 - sheetIdx;
      audioSynth.playPageFlip();
      state.currentSheet--;
    }
  }

  function turnNextPage() {
    if (!state.isOpen) {
      openBook();
      return;
    }

    // If Cover hasn't flipped yet, flip cover first!
    if (state.currentSheet === 0) {
      if (frontCoverPlate) {
        frontCoverPlate.classList.add('flipped');
        frontCoverPlate.style.zIndex = 10;
      }
      audioSynth.playPageFlip();
      state.currentSheet = 1;
      return;
    }

    if (state.currentSheet <= state.totalSheets) {
      const sheetIdx = state.currentSheet;
      const currentSheetEl = document.getElementById(`page-sheet-${sheetIdx}`);
      if (currentSheetEl) {
        currentSheetEl.classList.add('flipped');
        // Sheet z-index on left side rests ON TOP of cover plate and previous flipped sheets!
        currentSheetEl.style.zIndex = 20 + sheetIdx;
        audioSynth.playPageFlip();
        state.currentSheet++;
      }
    }
  }

  function turnPageFromClick(e) {
    const rect = bookContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const middle = rect.width / 2;

    if (clickX < middle) {
      turnPreviousPage();
    } else {
      turnNextPage();
    }
  }

  // GLOBAL CLICK ANYWHERE ON SCREEN TO START OR FLIP
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('#audio-control') || e.target.closest('#wax-seal-btn')) return;

    if (!state.isJourneyStarted) {
      startAutomatedJourney();
      return;
    }

    const isBookPageClick = e.target.closest('.page-face-front, .page-face-back, .page-sheet, #enchanted-book-container');

    if (!state.isOpen && state.currentScene === 4) {
      openBook();
    } else if (state.isOpen && isBookPageClick) {
      turnPageFromClick(e);
    }
  });

});
