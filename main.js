// --- Intersection Observer for Scroll Animations ---
// We use a simple fade-in effect when elements scroll into view

document.addEventListener("DOMContentLoaded", () => {
  const animElements = document.querySelectorAll('.fade-in-section, .timeline-item');

  const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              
              // If this section contains the skills wrapper, animate the bars
              if (entry.target.id === 'skills-section' || entry.target.contains(document.getElementById('skills-section'))) {
                const bars = entry.target.querySelectorAll('.skill-bar-fill');
                bars.forEach(bar => {
                  const width = bar.getAttribute('data-width');
                  bar.style.width = width;
                });
              }

              observer.unobserve(entry.target); // Only animate once
          }
      });
  }, observerOptions);

  animElements.forEach(el => {
      observer.observe(el);
  });
});

// --- Constellation Background Animation ---
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  const numberOfParticles = 40; // Lower density for a subtler, premium look

  // Set canvas to full window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  });

  // --- Smooth Lerp State for Background Glow ---
  // We calculate target positions on scroll, then 'lerp' the current values towards them for fluid motion
  let targetGlow = { x: 85, y: 15, size: 600 };
  let currentGlow = { x: 85, y: 15, size: 600 };

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio = maxScroll > 0 ? scrollPos / maxScroll : 0;
    
    // Ultra-subtle targets: X and Y move very little, expansion is minimal
    targetGlow.x = 85 - (scrollRatio * 10);
    targetGlow.y = 15 + (scrollRatio * 12);
    targetGlow.size = 600 + (scrollRatio * 180);
  });

  function updateGlowVariables() {
    currentGlow.x += (targetGlow.x - currentGlow.x) * 0.025; // Smoothest transition factor
    currentGlow.y += (targetGlow.y - currentGlow.y) * 0.025;
    currentGlow.size += (targetGlow.size - currentGlow.size) * 0.025;

    document.body.style.setProperty('--glow-x', `${currentGlow.x}%`);
    document.body.style.setProperty('--glow-y', `${currentGlow.y}%`);
    document.body.style.setProperty('--glow-size', `${currentGlow.size}px`);
  }

  class Particle {
    constructor(x, y, directionX, directionY, size) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.3)'; // Premium Cyan tinted dots
      ctx.fill();
    }

    update() {
      if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
      if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2; 
        let directionY = (Math.random() * 0.4) - 0.2;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
    }
  }

  function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                       ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
        
        // Connect nearby particles - subtle density
        if (distance < 135 * 135) {
          let opacityValue = (1 - (distance / (135 * 135))) * 0.25; 
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacityValue})`; // Electric Cyan lines
          ctx.lineWidth = 0.45;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
    updateGlowVariables(); // Silky smooth glow transition
  }

  init();
  animate();
}

// --- Carousel Logic ---
const carouselTrack = document.getElementById('project-carousel');
const btnLeft = document.getElementById('carousel-left');
const btnRight = document.getElementById('carousel-right');

if (carouselTrack && btnLeft && btnRight) {
  let autoPlayInterval;

  const getScrollAmount = () => carouselTrack.firstElementChild.offsetWidth + 32;

  const scrollRight = () => {
    if (carouselTrack.scrollLeft + carouselTrack.clientWidth >= carouselTrack.scrollWidth - 10) {
      carouselTrack.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carouselTrack.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    }
  };

  btnLeft.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    resetAutoPlay();
  });

  btnRight.addEventListener('click', () => {
    scrollRight();
    resetAutoPlay();
  });

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(scrollRight, 3500); // Auto scroll every 3.5s
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  // Pause on hover
  carouselTrack.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  carouselTrack.addEventListener('mouseleave', startAutoPlay);

  startAutoPlay();
}

// --- Dynamic Interactive Animations ---

// Magnetic Navigation Links
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('mousemove', (e) => {
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Magnetic 'attraction' towards cursor
    link.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  
  link.addEventListener('mouseleave', () => {
    link.style.transform = 'translate(0, 0)';
  });
});

// 3D Tilt Effect on Project Cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on cursor position relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20; 
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    
    // Dynamic 'Cursor Glow' localized on the card
    const cardCaption = card.querySelector('.card-caption');
    if (cardCaption) {
      cardCaption.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, transparent 60%), 
                                      linear-gradient(to top, rgba(0,0,0,0.85) 20%, transparent 100%)`;
    }
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    const cardCaption = card.querySelector('.card-caption');
    if (cardCaption) {
      cardCaption.style.background = 'linear-gradient(to top, rgba(0,0,0,0.85) 20%, transparent 100%)';
    }
  });
});

// --- Mobile Menu Toggle ---
const navToggle = document.querySelector('.nav-toggle');
const navElement = document.querySelector('nav');

if (navToggle && navElement) {
  navToggle.addEventListener('click', () => {
    navElement.classList.toggle('active');
    
    // Prevent scrolling when navigation is open on mobile
    if (navElement.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close nav menu on link clicks
  const navItems = navElement.querySelectorAll('ul a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navElement.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// --- Timeline Scroll Progress & Active States ---
const timelineContainer = document.getElementById('timeline-container');
const timelineProgress = document.getElementById('timeline-progress');

if (timelineContainer && timelineProgress) {
  const handleTimelineScroll = () => {
    const rect = timelineContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    
    const items = timelineContainer.querySelectorAll('.timeline-item');
    const timelineLine = timelineContainer.querySelector('.timeline-line');
    
    if (items.length === 0) return;
    
    const lastItem = items[items.length - 1];
    // The dot center is exactly at offsetTop + 6px inside the last timeline item
    const maxGlowHeight = lastItem.offsetTop + 6;
    
    // Restrict the static background line to end exactly at the last circle node
    if (timelineLine) {
      timelineLine.style.height = `${maxGlowHeight}px`;
    }
    
    // Get absolute top position of the container relative to the entire page
    const containerPageTop = rect.top + scrollY;
    
    // Start drawing progress when the timeline container top enters 75% of the viewport height.
    const startScroll = Math.max(0, containerPageTop - windowHeight * 0.75);
    
    // End drawing progress when the last circle node reaches 40% of the viewport height.
    const endScroll = containerPageTop + maxGlowHeight - windowHeight * 0.4;
    
    let percent = 0;
    
    if (scrollY > startScroll) {
      const scrollRange = endScroll - startScroll;
      if (scrollRange > 0) {
        percent = ((scrollY - startScroll) / scrollRange) * 100;
      } else {
        percent = 100;
      }
    }
    
    // Force exact 0% if the user is scrolled to the absolute top of the page
    if (scrollY <= 0) {
      percent = 0;
    }
    
    // Force 100% if the user has scrolled to the absolute bottom of the page
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0 && scrollY >= maxScroll - 10) {
      percent = 100;
    }
    
    // Clamp between 0% and 100%
    percent = Math.min(Math.max(percent, 0), 100);
    
    // Calculate progress height in pixels to stop exactly at the last circle node
    const progressHeightPx = (percent / 100) * maxGlowHeight;
    timelineProgress.style.height = `${progressHeightPx}px`;
    
    items.forEach(item => {
      // Add a slight tolerance (5px) so the dot activates exactly as the glow reaches it
      if (progressHeightPx >= (item.offsetTop - 5)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };
  
  // Hook up scroll and resize event listeners
  window.addEventListener('scroll', handleTimelineScroll);
  window.addEventListener('resize', handleTimelineScroll);
  // Trigger once on page load to set correct initial state
  handleTimelineScroll();
}
