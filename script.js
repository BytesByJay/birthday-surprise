// ===== GLOBAL VARIABLES =====
let scene, camera, renderer, textMesh, particles;
let isAudioPlaying = false;
let audio = null;
let currentGalleryPage = 0;
const photosPerPage = 6;
let galleryPhotos = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeWebsite();
    setupScrollAnimations();
    setupGallery();
    setupCountdown();
    setupSurpriseAnimation();
    setupMusicToggle();
    setupNavigationScroll();
    createConfettiElements();
    
    // Initialize 3D scene after a short delay for better performance
    setTimeout(() => {
        init3DScene();
    }, 500);
    
    // Add loading screen removal
    const loadingScreen = document.querySelector('.loading');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    }
});

// ===== WEBSITE INITIALIZATION =====
function initializeWebsite() {
    // Add loading screen
    const loadingHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    
    // GSAP ScrollTrigger registration
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Set name placeholder with a default name (can be customized)
    const namePlaceholder = document.querySelector('.name-placeholder');
    if (namePlaceholder) {
        namePlaceholder.textContent = 'Sarah'; // Change this to the actual name
    }
    
    console.log('🎉 Birthday website initialized!');
}

// ===== 3D SCENE SETUP =====
function init3DScene() {
    try {
        const container = document.getElementById('three-container');
        if (!container || typeof THREE === 'undefined') return;

        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Create floating particles
        createParticles();

        // Create 3D text
        const loader = new THREE.FontLoader();
        // Using a simple geometry for the "25" since we don't have font files
        create3DNumber();

        // Camera positioning
        camera.position.z = 5;

        // Start animation loop
        animate3D();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
        
    } catch (error) {
        console.log('3D scene initialization skipped:', error.message);
    }
}

function create3DNumber() {
    // Create a 3D "25" using basic geometries
    const group = new THREE.Group();
    
    // Create "2"
    const geometry2 = new THREE.BoxGeometry(0.3, 1.5, 0.2);
    const material = new THREE.MeshPhongMaterial({
        color: 0xff6b9d,
        transparent: true,
        opacity: 0.8
    });
    
    const mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.position.x = -0.8;
    group.add(mesh2);
    
    // Create "5"
    const mesh5 = new THREE.Mesh(geometry2, material);
    mesh5.position.x = 0.8;
    group.add(mesh5);
    
    // Position the group
    group.position.set(0, 0, 0);
    group.scale.set(0.8, 0.8, 0.8);
    
    textMesh = group;
    scene.add(textMesh);
}

function createParticles() {
    // Reduce particle count significantly on mobile for better performance
    const particleCount = isMobileDevice() ? 20 : 100;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;     // x
        positions[i + 1] = (Math.random() - 0.5) * 10; // y
        positions[i + 2] = (Math.random() - 0.5) * 10; // z
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    // Rotate the text
    if (textMesh) {
        textMesh.rotation.y += 0.005;
        textMesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    // Animate particles
    if (particles) {
        particles.rotation.y += 0.002;
        const positions = particles.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.001;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    if (typeof gsap === 'undefined') {
        // Fallback for no GSAP - use Intersection Observer for smooth animations
        setupIntersectionObserver();
        return;
    }
    
    // Smooth fade in elements on scroll - less jarring
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        gsap.fromTo(element, 
            { opacity: 0, y: 20 }, // Reduced movement for smoother effect
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, // Faster, smoother
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%", // Start animation earlier
                    end: "bottom 15%",
                    toggleActions: "play none none reverse", // Allow reverse
                    once: false // Allow replay
                }
            }
        );
    });
    
    // Smooth animate message cards
    const messageCards = document.querySelectorAll('.message-card');
    messageCards.forEach((card, index) => {
        gsap.fromTo(card,
            { opacity: 0, y: 30 }, // Less dramatic movement
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: index * 0.1, // Less staggered delay
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    
    // Gentle parallax effect for background elements
    gsap.to('.floating-elements', {
        y: -50, // Less movement
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1 // Smoother scrub
        }
    });
}

// Fallback smooth scroll animations using Intersection Observer
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'all 0.6s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that need animation
    document.querySelectorAll('.fade-in, .message-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// ===== GALLERY SETUP =====
function setupGallery() {
    loadGalleryPhotos();
    setupGalleryControls();
}

function loadGalleryPhotos() {
    // Using Unsplash for placeholder family photos
    const photoUrls = [
        'https://cdn.pixabay.com/photo/2023/08/23/12/57/young-8208513_960_720.jpg',
        'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop&crop=faces',
        'https://cdn.pixabay.com/photo/2016/11/29/07/35/beach-1868132_960_720.jpg',
        'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=400&h=300&fit=crop&crop=faces',
        'https://images.unsplash.com/photo-1608096299210-db7e38487075?w=400&h=300&fit=crop&crop=faces',
        'https://cdn.pixabay.com/photo/2024/01/07/11/17/welsh-corgi-8492879_960_720.jpg',
        'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&h=300&fit=crop&crop=faces',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=faces',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=faces',
    ];
    
    const captions = [
        'Family gathering at Christmas',
        'Birthday celebration last year',
        'Summer vacation memories',
        'Holiday traditions',
        'Cozy family dinner',
        'Adventure time together',
        'Celebrating milestones',
        'Making memories',
        'Love and laughter'
    ];
    
    galleryPhotos = photoUrls.map((url, index) => ({
        url: url,
        caption: captions[index] || `Beautiful memory ${index + 1}`
    }));
    
    renderGalleryPage();
    console.log(`🖼️  Gallery loaded: ${galleryPhotos.length} photos, showing ${Math.min(photosPerPage, galleryPhotos.length)} on first page`);
}

function renderGalleryPage() {
    const galleryGrid = document.getElementById('galleryGrid');
    const startIndex = currentGalleryPage * photosPerPage;
    const endIndex = Math.min(startIndex + photosPerPage, galleryPhotos.length);
    
    galleryGrid.innerHTML = '';
    
    for (let i = startIndex; i < endIndex; i++) {
        const photo = galleryPhotos[i];
        const galleryItem = createGalleryItem(photo, i);
        galleryGrid.appendChild(galleryItem);
    }
    
    // Update navigation buttons
    updateGalleryButtons();
    
    // Animate the newly added gallery items
    setTimeout(() => {
        animateGalleryItems();
    }, 100);
}

function createGalleryItem(photo, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    item.innerHTML = `
        <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
        <div class="gallery-overlay">
            <div class="gallery-caption">${photo.caption}</div>
        </div>
    `;
    
    return item;
}

function setupGalleryControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.addEventListener('click', () => {
        if (currentGalleryPage > 0) {
            currentGalleryPage--;
            renderGalleryPage();
            animateGalleryTransition();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const maxPages = Math.ceil(galleryPhotos.length / photosPerPage);
        if (currentGalleryPage < maxPages - 1) {
            currentGalleryPage++;
            renderGalleryPage();
            animateGalleryTransition();
        }
    });
}

function updateGalleryButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const maxPages = Math.ceil(galleryPhotos.length / photosPerPage);
    
    prevBtn.style.opacity = currentGalleryPage > 0 ? '1' : '0.5';
    nextBtn.style.opacity = currentGalleryPage < maxPages - 1 ? '1' : '0.5';
    
    prevBtn.disabled = currentGalleryPage <= 0;
    nextBtn.disabled = currentGalleryPage >= maxPages - 1;
}

function animateGalleryItems() {
    if (typeof gsap === 'undefined') {
        // Fallback for when GSAP is not available
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8) translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'scale(1) translateY(0)';
            }, index * 100);
        });
        return;
    }
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    gsap.fromTo(galleryItems, 
        { opacity: 0, scale: 0.8, y: 20 },
        { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }
    );
}

function animateGalleryTransition() {
    animateGalleryItems();
}

// ===== COUNTDOWN TIMER =====
function setupCountdown() {
    // Set target date (change this to the actual birthday date)
    const targetDate = new Date('2024-12-31T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            updateTimeUnit('days', days);
            updateTimeUnit('hours', hours);
            updateTimeUnit('minutes', minutes);
            updateTimeUnit('seconds', seconds);
        } else {
            // Birthday has arrived!
            showBirthdayMessage();
        }
    }
    
    function updateTimeUnit(unit, value) {
        const element = document.getElementById(unit);
        if (element) {
            const formattedValue = value.toString().padStart(2, '0');
            if (element.textContent !== formattedValue) {
                element.textContent = formattedValue;
                animateTimeUpdate(element);
            }
        }
    }
    
    function animateTimeUpdate(element) {
        if (typeof gsap === 'undefined') return;
        gsap.fromTo(element, 
            { scale: 1.2, color: '#ff6b9d' },
            { scale: 1, color: '#ffffff', duration: 0.5 }
        );
    }
    
    function showBirthdayMessage() {
        const countdownSection = document.querySelector('.countdown-section');
        if (countdownSection) {
            countdownSection.innerHTML = `
                <div class="container">
                    <h2 class="section-title">🎉 Happy Birthday! 🎉</h2>
                    <p style="text-align: center; color: white; font-size: 1.25rem;">
                        The special day is finally here!
                    </p>
                </div>
            `;
            triggerConfetti();
        }
    }
    
    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== SURPRISE ANIMATION =====
function setupSurpriseAnimation() {
    const surpriseButton = document.getElementById('surpriseButton');
    const surpriseReveal = document.getElementById('surpriseReveal');
    const videoSurprise = document.getElementById('videoSurprise');
    const surpriseMessage = document.getElementById('surpriseMessage');
    const surpriseVideo = document.getElementById('surpriseVideo');
    const playVideoBtn = document.getElementById('playVideoBtn');
    const showMessageBtn = document.getElementById('showMessageBtn');
    
    // Main surprise reveal
    surpriseButton.addEventListener('click', function() {
        // Hide button with smooth animation
        this.style.transition = 'all 0.3s ease-out';
        this.style.transform = 'scale(0)';
        this.style.opacity = '0';
        
        setTimeout(() => {
            this.style.display = 'none';
            
            // Show surprise container
            surpriseReveal.classList.add('active');
            
            // Trigger confetti
            triggerConfetti();
            
            // Animate balloons
            animateBalloons();
            
            // Check if video exists and show appropriate surprise
            setTimeout(() => {
                checkAndShowSurprise();
            }, 1000);
            
        }, 300);
    });
    
    // Video control handlers
    if (playVideoBtn) {
        playVideoBtn.addEventListener('click', function() {
            showVideoSurprise();
        });
    }
    
    if (showMessageBtn) {
        showMessageBtn.addEventListener('click', function() {
            showMessageSurprise();
        });
    }
    
    // Video event handlers
    if (surpriseVideo) {
        surpriseVideo.addEventListener('loadedmetadata', function() {
            console.log('🎥 Video loaded successfully!');
        });
        
        surpriseVideo.addEventListener('error', function(e) {
            console.log('🚨 Video failed to load, showing message instead');
            showMessageSurprise();
        });
    }
}

function checkAndShowSurprise() {
    const videoSurprise = document.getElementById('videoSurprise');
    const surpriseVideo = document.getElementById('surpriseVideo');
    
    // Check if video file exists by trying to load it
    if (surpriseVideo) {
        const videoSrc = surpriseVideo.querySelector('source[type="video/mp4"]').src;
        
        fetch(videoSrc, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    showVideoSurprise();
                } else {
                    showMessageSurprise();
                }
            })
            .catch(() => {
                showMessageSurprise();
            });
    } else {
        showMessageSurprise();
    }
}

function showVideoSurprise() {
    const videoSurprise = document.getElementById('videoSurprise');
    const surpriseMessage = document.getElementById('surpriseMessage');
    
    if (videoSurprise) {
        videoSurprise.classList.add('show');
        // Hide message initially when showing video
        surpriseMessage.style.display = 'none';
        
        console.log('🎥 Video surprise activated!');
    }
}

function showMessageSurprise() {
    const surpriseMessage = document.getElementById('surpriseMessage');
    const videoSurprise = document.getElementById('videoSurprise');
    
    if (surpriseMessage) {
        // Hide video if it was shown
        if (videoSurprise) {
            videoSurprise.style.display = 'none';
        }
        
        surpriseMessage.classList.add('show');
        console.log('💌 Message surprise activated!');
    }
}

function animateBalloons() {
    if (typeof gsap === 'undefined') return;
    
    const balloons = document.querySelectorAll('.balloon');
    
    // Initial animation
    gsap.fromTo(balloons, 
        { opacity: 0, y: 100, scale: 0 },
        { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)"
        }
    );
    
    // Continuous floating animation
    balloons.forEach((balloon, index) => {
        gsap.to(balloon, {
            y: -20,
            duration: 2 + index * 0.3,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut",
            delay: index * 0.2
        });
        
        gsap.to(balloon, {
            rotation: 5,
            duration: 3 + index * 0.5,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut",
            delay: index * 0.1
        });
    });
}

// ===== CONFETTI EFFECT =====
function createConfettiElements() {
    // Pre-create confetti elements for performance
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
}

function triggerConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    if (!confettiContainer) return;
    
    const colors = ['#ff6b9d', '#4facfe', '#43e97b', '#fa709a', '#fee140'];
    
    // Reduce confetti amount significantly on mobile devices
    const confettiCount = isMobileDevice() ? 15 : 50;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfettiPiece(confettiContainer, colors[i % colors.length]);
    }
    
    console.log(`🎊 Confetti triggered: ${confettiCount} pieces (Mobile: ${isMobileDevice()})`);
}

function createConfettiPiece(container, color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = color;
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, 5000);
}

// ===== MUSIC TOGGLE =====
function setupMusicToggle() {
    const musicToggle = document.getElementById('musicToggle');
    
    // Create audio element
    audio = new Audio();
    audio.src = './birthday-song.mp3';
    audio.loop = true;
    audio.volume = 0.3;
    
    // Check if audio file exists and is valid
    audio.addEventListener('error', function(e) {
        console.log('Audio file not found or invalid');
        musicToggle.style.opacity = '0.5';
        musicToggle.title = 'Add birthday-song.mp3 to enable music';
    });
    
    audio.addEventListener('canplaythrough', function() {
        console.log('🎵 Audio file loaded successfully!');
        musicToggle.style.opacity = '1';
        musicToggle.title = 'Toggle background music';
    });
    
    musicToggle.addEventListener('click', function() {
        if (isAudioPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
}

function playMusic() {
    if (audio && audio.src) {
        audio.play().catch(e => console.log('Audio play failed:', e));
        isAudioPlaying = true;
        document.getElementById('musicToggle').classList.add('playing');
    } else {
        // Fallback: show message about music
        showMusicMessage();
    }
}

function pauseMusic() {
    if (audio) {
        audio.pause();
        isAudioPlaying = false;
        document.getElementById('musicToggle').classList.remove('playing');
    }
}

function showMusicMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2rem 3rem;
        border-radius: 20px;
        z-index: 10000;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.2);
        max-width: 400px;
    `;
    message.innerHTML = `
        <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">🎵 Add Birthday Music!</h3>
        <p style="margin-bottom: 1rem;">Add a file named <strong>birthday-song.mp3</strong> to your website folder.</p>
        <p style="font-size: 0.9rem; opacity: 0.9;">Check the MUSIC_SETUP.md file for easy instructions!</p>
        <button onclick="this.parentElement.remove()" style="
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 15px;
            margin-top: 1rem;
            cursor: pointer;
        ">Got it!</button>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
    }, 8000);
}

// ===== NAVIGATION SMOOTH SCROLL =====
function setupNavigationScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navigation
        
        if (typeof gsap !== 'undefined') {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: offsetTop,
                ease: "power2.inOut"
            });
        } else {
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// ===== UTILITY FUNCTIONS =====
function addSparkleEffect(element) {
    const sparkle = document.createElement('span');
    sparkle.innerHTML = '✨';
    sparkle.style.cssText = `
        position: absolute;
        pointer-events: none;
        font-size: 1rem;
        opacity: 0;
        animation: sparkleFloat 1s ease-out forwards;
    `;
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
    sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Add sparkle keyframes to CSS
const sparkleKeyframes = `
    @keyframes sparkleFloat {
        0% {
            opacity: 1;
            transform: translateY(0px) scale(0);
        }
        50% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-40px) scale(0);
        }
    }
`;

const style = document.createElement('style');
style.textContent = sparkleKeyframes;
document.head.appendChild(style);

// ===== INTERACTIVE ENHANCEMENTS =====
// Mobile and touch device detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || (typeof window.orientation !== 'undefined') 
           || (window.innerWidth <= 768);
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

// Only add cursor sparkles on non-mobile, non-touch devices
if (!isMobileDevice() && !isTouchDevice()) {
    document.addEventListener('mousemove', function(e) {
        // Reduced frequency for better performance - even less sparkles
        if (Math.random() > 0.97) {
            createCursorSparkle(e.clientX, e.clientY);
        }
    });
    console.log('✨ Cursor sparkles enabled for desktop');
} else {
    console.log('📱 Mobile device detected - cursor sparkles disabled for better experience');
}

function createCursorSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: linear-gradient(45deg, #ff6b9d, #4facfe);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: fadeOut 1s ease-out forwards;
    `;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

const fadeOutKeyframes = `
    @keyframes fadeOut {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;

const fadeStyle = document.createElement('style');
fadeStyle.textContent = fadeOutKeyframes;
document.head.appendChild(fadeStyle);

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.log('An error occurred, but the party continues! 🎉');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (typeof onWindowResize === 'function') {
            onWindowResize();
        }
    }, 250);
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', function(e) {
    // Allow keyboard navigation for surprise button
    if (e.key === 'Enter' || e.key === ' ') {
        const focused = document.activeElement;
        if (focused.id === 'surpriseButton') {
            e.preventDefault();
            focused.click();
        }
    }
});

console.log('🎂 Birthday website is ready to celebrate! 🎉');