import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Secret: click the footer heart 5 times quickly → heart rain
  const footerHeart = document.getElementById('footer-heart');
  if (footerHeart) {
    let heartClicks = 0;
    let heartTimer;
    footerHeart.style.cursor = 'pointer';
    footerHeart.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    footerHeart.addEventListener('click', () => {
      heartClicks++;
      clearTimeout(heartTimer);
      // Grow with each click
      const scale = 1 + heartClicks * 0.15;
      footerHeart.style.transform = `scale(${scale})`;
      heartTimer = setTimeout(() => {
        heartClicks = 0;
        footerHeart.style.transform = '';
      }, 800);
      if (heartClicks >= 5) {
        heartClicks = 0;
        footerHeart.style.transform = 'scale(2.5)';
        setTimeout(() => {
          footerHeart.style.transform = '';
          triggerHeartRain();
        }, 200);
      }
    });
  }

  // Contact button — email assembled in JS so it never appears in HTML source
  const contactBtn = document.getElementById('contact-btn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      const parts = ['airpiehi', 'gmail', 'com'];
      window.location.href = `mailto:${parts[0]}@${parts[1]}.${parts[2]}`;
    });
  }

  // 1. Split H1 letters for hover effects and interactions
  const h1 = document.querySelector('.hero-content h1');
  let letters = [];
  if (h1) {
    const text = h1.textContent;
    h1.textContent = '';
    h1.setAttribute('aria-label', text);
    
    for (let char of text) {
      if (char === ' ') {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        h1.appendChild(space);
      } else {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('letter');
        span.setAttribute('aria-hidden', 'true');
        h1.appendChild(span);
        letters.push(span);
      }
    }
  }

  // 2. Secret "PIE" puzzle
  let clickHistory = [];
  
  letters.forEach((letter) => {
    // Track hover via class so it persists through boop animation
    // (CSS :hover won't re-evaluate without real mouse movement)
    let leaveTimer;
    letter.addEventListener('mouseenter', () => {
      clearTimeout(leaveTimer);
      letter.classList.add('letter-hover');
    });
    letter.addEventListener('mouseleave', () => {
      leaveTimer = setTimeout(() => letter.classList.remove('letter-hover'), 40);
    });

    letter.addEventListener('click', () => {
      // Juicy animation
      letter.classList.add('boop');
      setTimeout(() => letter.classList.remove('boop'), 400);

      // Record letter click
      clickHistory.push(letter.textContent.toLowerCase());
      if (clickHistory.length > 5) clickHistory.shift();

      // Check if they spelled 'pie'
      if (clickHistory.slice(-3).join('') === 'pie') {
        triggerSecretMode();
        clickHistory = [];
      }

      // Check if they spelled 'air'
      if (clickHistory.slice(-3).join('') === 'air') {
        triggerAirMode();
        clickHistory = [];
      }
    });
  });

  // 3. Logo spin code + letter spin secret
  const logo = document.querySelector('.floating-logo-container');
  let logoClicks = 0;
  let floatResumeTimer = null;
  let leanInTimer = null;
  let cooldownTimer = null;
  let onCooldown = false;

  function resetLogoState() {
    onCooldown = false;
    logoClicks = 0;
    logo.classList.remove('float-paused', 'boop-tilt-1', 'boop-tilt-2');
    logo.classList.add('tilt-reset');
    setTimeout(() => logo.classList.remove('tilt-reset'), 500);
  }

  if (logo) {
    logo.addEventListener('click', () => {
      if (onCooldown) return;

      // Cancel any pending reset
      if (leanInTimer) clearTimeout(leanInTimer);

      // Pause the float, resume after 2.5s
      logo.classList.add('float-paused');
      if (floatResumeTimer) clearTimeout(floatResumeTimer);
      floatResumeTimer = setTimeout(() => logo.classList.remove('float-paused'), 2500);

      logoClicks++;
      if (logoClicks >= 3) {
        logo.classList.remove('boop-tilt-1', 'boop-tilt-2');
        document.body.classList.add('spin-page');
        setTimeout(() => document.body.classList.remove('spin-page'), 1400);
        logoClicks = 0;
      } else {
        logo.classList.remove('boop-tilt-1', 'boop-tilt-2');
        logo.classList.add('spin-boop');
        setTimeout(() => {
          logo.classList.remove('spin-boop');
          logo.classList.add(logoClicks === 1 ? 'boop-tilt-1' : 'boop-tilt-2');
        }, 600);

        // After first click, reset if not clicked again within 2s
        if (logoClicks === 1) {
          leanInTimer = setTimeout(() => {
            onCooldown = true;
            cooldownTimer = setTimeout(resetLogoState, 800);
          }, 2000);
        }
      }
    });
  }

  // 4. Top secret button reveal
  const secretBtn = document.getElementById('top-secret-btn');
  const secretText = document.getElementById('classified-secret');
  const secretDesc = document.getElementById('top-secret-desc');
  
  if (secretBtn && secretText && secretDesc) {
    secretBtn.addEventListener('click', () => {
      // Juice it
      secretBtn.classList.add('boop');
      setTimeout(() => secretBtn.classList.remove('boop'), 400);
      
      // Reveal it by swapping the paragraph
      if (secretText.style.display === 'none') {
        secretText.style.display = 'block';
        secretDesc.style.opacity = '0';
        secretDesc.style.position = 'absolute';
        secretDesc.style.pointerEvents = 'none';
        secretBtn.textContent = 'HIDE SECRET';
        
        // Initialize Matrix
        const canvas = document.getElementById('matrix-canvas');
        if (canvas) {
          if (window.matrixInterval) clearInterval(window.matrixInterval);
          if (window.matrixObserver) window.matrixObserver.disconnect();
          if (canvas.matrixInterval) clearInterval(canvas.matrixInterval);
          if (canvas.matrixObserver) canvas.matrixObserver.disconnect();

          const ctx = canvas.getContext('2d');
          const letters = ['A', '1', 'R', 'P', 'I', 'E'];
          const baseFontSize = 22;
          let cols = [], cw = 0, ch = 0;

          function init() {
            cw = canvas.offsetWidth;
            ch = canvas.offsetHeight;
            if (cw === 0 || ch <= 0) return false;

            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(cw * dpr);
            canvas.height = Math.floor(ch * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, cw, ch);

            const numCols = Math.ceil(cw / baseFontSize);
            cols = Array.from({ length: numCols }, () => {
              // Bias toward slower speeds for larger sizes
              const rand = Math.random();
              let speedMultiplier, fontSizeVar;

              if (rand < 0.3) {
                // 30% chance: large & slow
                fontSizeVar = baseFontSize * (0.9 + Math.random() * 0.3);
                speedMultiplier = 0.05 + Math.random() * 0.2;
              } else if (rand < 0.6) {
                // 30% chance: small & fast
                fontSizeVar = baseFontSize * (0.6 + Math.random() * 0.25);
                speedMultiplier = 0.5 + Math.random() * 0.5;
              } else {
                // 40% chance: medium mixed
                fontSizeVar = baseFontSize * (0.6 + Math.random() * 0.6);
                speedMultiplier = 0.1 + Math.random() * 0.9;
              }

              return {
                y: Math.random() * ch,
                speed: fontSizeVar * speedMultiplier,
                fontSize: fontSizeVar,
                brightness: 0.4 + Math.random() * 0.6,
              };
            });
            return true;
          }

          function draw() {
            if (!cw) return;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
            ctx.fillRect(0, 0, cw, ch);

            for (let i = 0; i < cols.length; i++) {
              const col = cols[i];
              ctx.font = `bold ${Math.round(col.fontSize)}px monospace`;
              const b = Math.round(180 * col.brightness);
              ctx.fillStyle = `rgb(0, ${b}, 0)`;
              ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * baseFontSize + 2, col.y);

              col.y += col.speed;

              // Always reset immediately, but start at varied heights above canvas
              // so restarts are staggered — no dead zones, always active
              if (col.y > ch) {
                const rand = Math.random();
                let speedMultiplier, fontSizeVar;

                if (rand < 0.3) {
                  // 30% chance: large & slow
                  fontSizeVar = baseFontSize * (0.9 + Math.random() * 0.3);
                  speedMultiplier = 0.05 + Math.random() * 0.2;
                } else if (rand < 0.6) {
                  // 30% chance: small & fast
                  fontSizeVar = baseFontSize * (0.6 + Math.random() * 0.25);
                  speedMultiplier = 0.5 + Math.random() * 0.5;
                } else {
                  // 40% chance: medium mixed
                  fontSizeVar = baseFontSize * (0.6 + Math.random() * 0.6);
                  speedMultiplier = 0.1 + Math.random() * 0.9;
                }

                col.y = -fontSizeVar * (1 + Math.floor(Math.random() * 8));
                col.fontSize = fontSizeVar;
                col.speed = fontSizeVar * speedMultiplier;
                col.brightness = 0.4 + Math.random() * 0.6;
              }
            }
          }

          let started = false;
          const observer = new ResizeObserver(() => {
            if (init() && !started) {
              started = true;
              window.matrixInterval = setInterval(draw, 50);
              canvas.matrixInterval = window.matrixInterval;
            }
          });
          observer.observe(canvas.parentElement);
          window.matrixObserver = observer;
          canvas.matrixObserver = observer;
        }
      } else {
        secretText.style.display = 'none';
        secretDesc.style.opacity = '1';
        secretDesc.style.position = 'static';
        secretDesc.style.pointerEvents = 'auto';
        secretBtn.textContent = 'Top Secret';
      }
    });
  }

  // 4b. Secret Code Validator
  const codeInput = document.getElementById('secret-code-input');
  const codeSubmit = document.getElementById('secret-code-submit');
  const codeResponse = document.getElementById('secret-code-response');

  if (codeInput && codeSubmit && codeResponse) {
    const handleCodeSubmit = () => {
      const code = codeInput.value.trim().toUpperCase();
      if (!code) return;

      codeSubmit.classList.add('boop');
      setTimeout(() => codeSubmit.classList.remove('boop'), 200);

      if (code === 'A1RP1E') {
        codeResponse.style.opacity = '1';
        codeResponse.style.color = '#0f0';
        codeResponse.innerHTML = 'Verifying...';
        codeInput.value = '';
        setTimeout(() => {
          triggerPennyConfetti();
          codeResponse.style.opacity = '0';
        }, 1500);
      } else {
        codeResponse.style.opacity = '1';
        codeResponse.style.color = '#f00';
        codeResponse.innerHTML = 'ERR: ACCESS DENIED. LOGGED.';
        codeInput.value = '';
        setTimeout(() => {
           codeResponse.style.opacity = '0';
        }, 3000);
      }
    };

    codeSubmit.addEventListener('click', handleCodeSubmit);
    codeInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleCodeSubmit();
    });
  }

  // 5. Overscroll upside down secret
  let isUpsideDown = false;

  function flipSite() {
    isUpsideDown = true;
    document.body.classList.add('upside-down');
    const ohNoWrapper = document.getElementById('oh-no-wrapper');
    if (ohNoWrapper) ohNoWrapper.style.display = 'block';
  }

  function unflipSite() {
    isUpsideDown = false;
    document.body.classList.remove('upside-down');
    document.body.style.transform = '';
    const ohNoWrapper = document.getElementById('oh-no-wrapper');
    if (ohNoWrapper) ohNoWrapper.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const ohNoBtns = document.querySelectorAll('.oh-no-btn');
  ohNoBtns.forEach(btn => {
    btn.addEventListener('click', () => unflipSite());
  });

  // Footer explicit click/touch and drag
  const footer = document.querySelector('footer');
  let isDraggingFooter = false;
  let footerDragStartY = 0;
  const belowFold = document.getElementById('below-the-fold');
  let bounceTimeout = null;

  function showBelowFold(amount) {
    if (!belowFold) return;
    const pct = Math.min(amount / 400, 1);
    belowFold.style.transform = `translateY(${(1 - pct) * 100}%)`;
  }

  function hideBelowFold() {
    if (!belowFold) return;
    belowFold.style.transition = 'transform 0.3s ease';
    belowFold.style.transform = 'translateY(100%)';
  }

  // Show on wheel overscroll at bottom — accumulate ticks
  let wheelAccum = 0;
  let wheelDecayTimer = null;

  window.addEventListener('wheel', (e) => {
    const scrollMaxY = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= scrollMaxY - 2 && e.deltaY > 0) {
      wheelAccum = Math.min(wheelAccum + e.deltaY, 400);
      showBelowFold(wheelAccum);
      clearTimeout(wheelDecayTimer);
      wheelDecayTimer = setTimeout(() => {
        wheelAccum = 0;
        hideBelowFold();
      }, 600);
    }
  }, { passive: true });

  // Hide immediately if user scrolls back up
  window.addEventListener('scroll', () => {
    const scrollMaxY = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY < scrollMaxY - 2) {
      wheelAccum = 0;
      clearTimeout(wheelDecayTimer);
      hideBelowFold();
    }
  }, { passive: true });


  if (footer) {
    footer.style.cursor = 'grab';
    
    const FLIP_THRESHOLD = 200;

    const startDrag = (y) => {
      isDraggingFooter = true;
      footerDragStartY = y;
      footer.style.cursor = 'grabbing';
      document.body.style.transition = 'none';
      clearTimeout(bounceTimeout);
      belowFold.style.transition = 'none';
    };

    const moveDrag = (y) => {
      if (!isDraggingFooter) return;
      const dragDelta = footerDragStartY - y;

      if (!isUpsideDown) {
        // Normal: pull footer up to flip
        const pullUp = Math.max(0, dragDelta);
        const pull = Math.pow(pullUp, 0.7) * -1.2;
        document.body.style.transform = `translateY(${pull}px)`;
        showBelowFold(pullUp);

        if (pullUp > FLIP_THRESHOLD) {
          isDraggingFooter = false;
          footer.style.cursor = 'grab';
          document.body.style.transform = '';
          document.body.style.transition = '';
          hideBelowFold();
          flipSite();
        }
      } else {
        // Upside down: pull footer down visually (currentY > startY, so dragDelta < 0)
        const pullDown = Math.max(0, -dragDelta);
        const pull = Math.pow(pullDown, 0.7) * 1.2;
        // translateY before rotate = screen-space translation (moves element down visually)
        document.body.style.transform = `translateY(${pull}px) rotate(180deg)`;

        if (pullDown > FLIP_THRESHOLD) {
          isDraggingFooter = false;
          footer.style.cursor = 'grab';
          document.body.style.transform = '';
          document.body.style.transition = '';
          unflipSite();
        }
      }
    };

    const endDrag = () => {
      if (isDraggingFooter) {
        isDraggingFooter = false;
        footer.style.cursor = 'grab';
        document.body.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        document.body.style.transform = '';
        setTimeout(() => { document.body.style.transition = ''; }, 400);
        hideBelowFold();
      }
    };

    footer.addEventListener('mousedown', (e) => {
      startDrag(e.clientY);
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => moveDrag(e.clientY));
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('mouseleave', endDrag);

    // Touch support
    footer.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientY), {passive: true});
    window.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientY), {passive: true});
    window.addEventListener('touchend', endDrag);
  }
});

function triggerHeartRain() {
  const colors = ['#000000'];
  const count = 40;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.textContent = '♥';
      heart.style.cssText = `
        position: fixed;
        top: -2rem;
        left: ${Math.random() * 100}vw;
        font-size: ${1 + Math.random() * 2}rem;
        color: ${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events: none;
        z-index: 9999;
        will-change: transform, opacity;
        animation: heartFall ${1.5 + Math.random() * 1.5}s ease-in forwards;
        transform: rotate(${(Math.random() - 0.5) * 40}deg);
      `;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 3500);
    }, i * 60);
  }
}

function triggerAirMode() {
  const allLetters = document.querySelectorAll('.hero-content h1 .letter');
  allLetters.forEach((l, i) => {
    const xRange = (Math.random() - 0.5) * 900;
    const rot = (Math.random() - 0.5) * 60;
    l.style.setProperty('--air-x', `${xRange}px`);
    l.style.setProperty('--air-rot', `${rot}deg`);
    setTimeout(() => {
      l.classList.add('air-scatter');
      setTimeout(() => l.classList.remove('air-scatter'), 1600);
    }, i * 60);
  });
}

function triggerSecretMode() {
  document.body.style.animation = "rainbowBg 5s infinite";

  const logo = document.querySelector('.floating-logo-container');
  const tagline = document.querySelector('.hero-content p');
  const sectionTitle = document.querySelector('.section-title');
  const comingSoon = document.querySelector('.coming-soon');
  const heart = document.getElementById('footer-heart');

  if (logo) logo.classList.add('logo-party');
  if (tagline) tagline.classList.add('hero-party');
  if (sectionTitle) setTimeout(() => sectionTitle.classList.add('hero-party'), 100);
  if (comingSoon) setTimeout(() => comingSoon.classList.add('hero-party'), 200);
  if (heart) setTimeout(() => heart.classList.add('heart-party'), 300);

  const cards = document.querySelectorAll('.app-card');
  cards.forEach((card, i) => {
    setTimeout(() => card.classList.add('party-mode'), i * 150);
  });

  // Turn it off after 8 seconds — settle gracefully from mid-animation position
  setTimeout(() => {
    const settle = (el, partyClass) => {
      if (!el) return;
      const frozen = getComputedStyle(el).transform;
      el.classList.remove(partyClass);
      el.style.transform = frozen;
      el.offsetHeight;
      el.style.transition = 'transform 0.5s ease-out';
      el.style.transform = '';
      setTimeout(() => { el.style.transition = ''; }, 500);
    };

    settle(logo, 'logo-party');
    settle(tagline, 'hero-party');
    settle(sectionTitle, 'hero-party');
    settle(comingSoon, 'hero-party');
    settle(heart, 'heart-party');
    cards.forEach(card => settle(card, 'party-mode'));
    document.body.style.animation = "";
  }, 8000);
}

function triggerPennyConfetti() {
  const logo = document.querySelector('.floating-logo');
  const logoSrc = logo ? logo.src : '/logo.png';
  
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '10000';
  container.style.overflow = 'hidden';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  document.body.appendChild(container);

  // Success message overlay
  const overlayText = document.createElement('div');
  overlayText.innerHTML = 'AUTHORIZATION AUTHORIZED';
  overlayText.style.fontFamily = 'monospace';
  overlayText.style.fontSize = 'clamp(1.5rem, 6vw, 5rem)';
  overlayText.style.fontWeight = 'bold';
  overlayText.style.color = '#0f0';
  overlayText.style.textShadow = '0 0 20px #0f0, 4px 4px 0 #000';
  overlayText.style.padding = '2rem';
  overlayText.style.border = '4px solid #0f0';
  overlayText.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlayText.style.boxShadow = '10px 10px 0 #000';
  overlayText.style.whiteSpace = 'nowrap';
  overlayText.style.overflow = 'hidden';
  overlayText.style.opacity = '0';
  overlayText.style.transform = 'scale(0.8)';
  container.appendChild(overlayText);

  // Animate the overlay
  overlayText.animate([
    { opacity: 0, transform: 'scale(0.8)' },
    { opacity: 1, transform: 'scale(1)' },
    { opacity: 1, transform: 'scale(1)' },
    { opacity: 0, transform: 'scale(1.2)' }
  ], {
    duration: 3500,
    easing: 'ease-out'
  });

  const colors = ['#c4a882', '#ffee00', '#a855f7', '#ff3b3b', '#ffb366', '#4db8ff', '#ffffff'];

  // Start raining cards after a small delay
  setTimeout(() => {
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const card = document.createElement('div');
        card.style.position = 'absolute';
        card.style.willChange = 'transform';
        card.style.top = '-150px';
        card.style.left = Math.random() * 95 + 'vw';
        card.style.width = '80px';
        card.style.height = '112px';
        card.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        card.style.border = '4px solid #000';
        card.style.borderRadius = '6px';
        card.style.boxShadow = '4px 4px 0 #000';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'center';
        card.style.padding = '8px';
        
        const img = document.createElement('img');
        img.src = logoSrc;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.filter = 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))';
        card.appendChild(img);

        container.appendChild(card);

        // Better physics: start slow, fall fast with cubic-bezier
        const fallDuration = 1500 + Math.random() * 2000;
        const startX = (Math.random() - 0.5) * 50; 
        const endX = startX + (Math.random() - 0.5) * 200; // Drift sideways
        const rotation = -45 + Math.random() * 90;
        const endRotation = rotation + (-360 + Math.random() * 720);
        
        const animation = card.animate([
          { transform: `translate(${startX}px, 0) rotate(${rotation}deg)` },
          { transform: `translate(${endX}px, 120vh) rotate(${endRotation}deg)` }
        ], {
          duration: fallDuration,
          easing: 'cubic-bezier(0.4, 0, 1, 1)' // Accelerates like gravity
        });

        animation.onfinish = () => card.remove();
      }, Math.random() * 3500);
    }
  }, 1000);

  // Clean up container after all cards should have fallen
  setTimeout(() => {
    container.remove();
  }, 8000);
}
