import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
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
    letter.addEventListener('click', () => {
      // Juicy animation
      letter.classList.add('boop');
      setTimeout(() => letter.classList.remove('boop'), 400);

      // Record letter click
      clickHistory.push(letter.textContent.toLowerCase());
      if (clickHistory.length > 5) clickHistory.shift(); // Keep history short to avoid memory bloat

      // Check if they spelled 'pie' 
      if (clickHistory.slice(-3).join('') === 'pie') {
        triggerSecretMode();
        clickHistory = []; // puzzle reset
      }
    });
  });

  // 3. Logo spin code + inverted mode secret
  const logo = document.querySelector('.floating-logo-container');
  let logoClicks = 0;
  if (logo) {
    logo.addEventListener('click', () => {
      logo.classList.add('spin-boop');
      setTimeout(() => logo.classList.remove('spin-boop'), 600);

      logoClicks++;
      if (logoClicks >= 4) {
        document.body.classList.toggle('inverted-mode');
        logoClicks = 0;
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
          const fontSize = 22;
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

            const numCols = Math.ceil(cw / fontSize);
            // Stagger y positions randomly across full canvas height so columns
            // are always at different phases — no synchronized bright band
            cols = Array.from({ length: numCols }, () => ({
              y: Math.random() * ch,
              speed: fontSize * (0.15 + Math.random() * 0.35),
              brightness: 0.5 + Math.random() * 0.5,
            }));
            return true;
          }

          function draw() {
            if (!cw) return;
            // Slow fade produces the trailing glow naturally
            ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
            ctx.fillRect(0, 0, cw, ch);
            ctx.font = `bold ${fontSize}px monospace`;

            for (let i = 0; i < cols.length; i++) {
              const col = cols[i];
              // Vary brightness per column for organic effect
              const b = Math.round(180 * col.brightness);
              ctx.fillStyle = `rgb(0, ${b}, 0)`;
              ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fontSize + 2, col.y);

              col.y += col.speed;

              // Always reset immediately, but start at varied heights above canvas
              // so restarts are staggered — no dead zones, always active
              if (col.y > ch) {
                col.y = -fontSize * (1 + Math.floor(Math.random() * 8));
                col.speed = fontSize * (0.15 + Math.random() * 0.35);
                col.brightness = 0.5 + Math.random() * 0.5;
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
        codeResponse.innerHTML = 'VERIFIED. REDIRECTING...';
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

function triggerSecretMode() {
  document.body.style.animation = "rainbowBg 5s infinite";
  
  const cards = document.querySelectorAll('.app-card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('party-mode');
    }, i * 150);
  });
  
  // Turn it off after 8 seconds
  setTimeout(() => {
     cards.forEach(card => card.classList.remove('party-mode'));
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
