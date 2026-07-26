// ==========================================
// Wedding Invitation - Richard & Ayu
// ==========================================

/**
 * Mengambil nama tamu dari parameter URL
 * Contoh: index.html?to=Budi atau index.html?nama=Budi
 */
function getGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guest = urlParams.get('to') || urlParams.get('nama') || urlParams.get('guest');
  
  if (guest) {
    document.getElementById('guestName').textContent = decodeURIComponent(guest);
  }
}

/**
 * Membuka halaman undangan dan memulai musik
 */
function openInvitation() {
  const cover = document.getElementById('cover');
  const navbar = document.getElementById('navbar');
  const bgMusic = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicBtn');
  
  // Hide cover dengan animasi
  cover.classList.add('hidden');
  navbar.classList.add('show');
  
  // Play musik setelah animasi selesai
  setTimeout(() => {
    bgMusic.play().catch(err => {
      console.log('Autoplay diblokir, user harus klik tombol play');
    });
    musicBtn.classList.add('playing');
  }, 500);
}

/**
 * Toggle play/pause untuk background music
 */
function toggleMusic() {
  const music = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  
  if (music.paused) {
    music.play();
    btn.classList.add('playing');
  } else {
    music.pause();
    btn.classList.remove('playing');
  }
}

/**
 * Menghitung countdown menuju hari pernikahan
 */
function initCountdown() {
  // Tanggal pernikahan: 15 Juni 2025, pukul 08:00 WIB
  const weddingDate = new Date('2025-06-15T08:00:00+08:00').getTime();
  
  // Elemen DOM
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    // Jika sudah lewat tanggal
    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/**
 * Menambahkan ucapan baru ke dalam daftar
 */
function addWish(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('wishName');
  const attendanceSelect = document.getElementById('wishAttendance');
  const messageInput = document.getElementById('wishMessage');
  
  const name = nameInput.value.trim();
  const attendance = attendanceSelect.value;
  const message = messageInput.value.trim();
  
  if (!name || !attendance || !message) {
    alert('Mohon lengkapi semua field');
    return;
  }
  
  // Buat elemen wish baru
  const wishItem = document.createElement('div');
  wishItem.className = 'wish-item';
  wishItem.innerHTML = `
    <div class="wish-attendance">${escapeHtml(attendance)}</div>
    <div class="wish-name">${escapeHtml(name)}</div>
    <div class="wish-message">${escapeHtml(message)}</div>
  `;
  
  // Tambahkan ke paling atas daftar
  const wishesList = document.getElementById('wishesList');
  wishesList.insertBefore(wishItem, wishesList.firstChild);
  
  // Reset form
  nameInput.value = '';
  attendanceSelect.value = '';
  messageInput.value = '';
  
  // Scroll ke ucapan terbaru
  wishItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Escape HTML untuk mencegah XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Konfirmasi kehadiran (RSVP)
 */
function confirmRSVP(event, status) {
  const message = document.getElementById('rsvpMessage');
  const buttons = document.querySelectorAll('.rsvp-btn');
  
  // Hapus status active dari semua button
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Tambah status active ke button yang diklik
  const targetBtn = event.currentTarget || event.target.closest('.rsvp-btn');
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
  
  // Tampilkan pesan sesuai konfirmasi
  if (status === 'hadir') {
    message.innerHTML = '<i class="fas fa-check-circle"></i> Terima kasih atas konfirmasinya! Kami sangat senang menunggu kehadiran Anda di hari bahagia kami.';
  } else {
    message.innerHTML = '<i class="fas fa-info-circle"></i> Terima kasih telah menginformasikan. Mohon maaf jika ada halangan, semoga diberikan kesehatan selalu.';
  }
  message.style.display = 'block';
}

/**
 * Membuka lightbox untuk galeri
 */
function openLightbox(item) {
  const img = item.querySelector('img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('show');
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

/**
 * Menutup lightbox
 */
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('show');
  document.body.style.overflow = '';
}

/**
 * Inisialisasi animasi fade-in saat scroll
 */
function initScrollAnimation() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: stop observing setelah animasi muncul
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe semua elemen dengan class fade-in
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/**
 * Navbar show/hide saat scroll
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        
        // Show/hide navbar berdasarkan arah scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
          navbar.classList.remove('show');
        } else if (currentScroll < lastScroll) {
          navbar.classList.add('show');
        }
        
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * Smooth scroll untuk navigation links
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-container a, a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        
        if (target) {
          const offsetTop = target.offsetTop - 70; // offset untuk navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/**
 * Keyboard shortcuts untuk lightbox
 */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    
    // Tekan ESC untuk menutup lightbox
    if (e.key === 'Escape' && lightbox.classList.contains('show')) {
      closeLightbox();
    }
  });
}

/**
 * Inisialisasi semua fungsi saat DOM siap
 */
function init() {
  getGuestName();
  initCountdown();
  initScrollAnimation();
  initNavbarScroll();
  initSmoothScroll();
  initKeyboardShortcuts();
  
  console.log('💍 Wedding Invitation - Richard & Ayu');
  console.log('✨ Loaded successfully!');
}

// Jalankan saat DOM sudah siap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
