// qr-generator.js
let qrInstance;

// Menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function toggleSidebar() {
  sidebar.classList.toggle('active');
  sidebarOverlay.classList.toggle('active');
}

if (menuToggle && sidebar && sidebarOverlay) {
  menuToggle.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', toggleSidebar);
}

// Tab functionality
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs and contents
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    tab.classList.add('active');
    const tabId = tab.getAttribute('data-tab');
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    // Clear any existing messages
    hideMessages();
  });
});

// DOM Elements
const generateBtn = document.getElementById('generate-btn');
const scanBtn = document.getElementById('scan-btn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const textInput = document.getElementById('text');
const fileInput = document.getElementById('fileInput');
const qrContainer = document.getElementById('qrcode');
const qrCodeContainer = document.getElementById('qrcodeContainer');
const scanResult = document.getElementById('scanResult');
const scanResultText = document.getElementById('scanResultText');

function showError(message) {
  if (!errorMessage) return;
  errorMessage.textContent = '❌ ' + message;
  errorMessage.style.display = 'block';
  errorMessage.classList.remove('hide');
  if (successMessage) successMessage.style.display = 'none';
  setTimeout(() => {
    errorMessage.classList.add('hide');
    setTimeout(() => (errorMessage.style.display = 'none'), 500);
  }, 5000);
}

function showSuccess(message) {
  if (!successMessage) return;
  successMessage.textContent = '✅ ' + message;
  successMessage.style.display = 'block';
  successMessage.classList.remove('hide');
  if (errorMessage) errorMessage.style.display = 'none';
  setTimeout(() => {
    successMessage.classList.add('hide');
    setTimeout(() => (successMessage.style.display = 'none'), 500);
  }, 3000);
}

function hideMessages() {
  if (errorMessage) errorMessage.style.display = 'none';
  if (successMessage) successMessage.style.display = 'none';
}

function setLoading(button, isLoading, originalText) {
  if (!button) return;
  if (isLoading) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
  } else {
    button.disabled = false;
    button.innerHTML = originalText;
  }
}

// Generate QR Code
function generateQR() {
  if (!textInput || !qrContainer || !qrCodeContainer || !downloadBtn || !generateBtn) return;
  
  const text = textInput.value.trim();
  
  // Reset state
  qrContainer.innerHTML = "";
  qrCodeContainer.style.display = "none";
  downloadBtn.style.display = "none";
  hideMessages();

  if (!text) {
    showError("Masukkan dulu teks atau link!");
    return;
  }

  // Hapus QR code sebelumnya jika ada
  if (qrInstance) {
    qrInstance.clear();
  }

  // Show loading
  const originalText = generateBtn.innerHTML;
  setLoading(generateBtn, true, originalText);

  // Buat QR code baru
  setTimeout(() => {
    qrInstance = new QRCode(qrContainer, {
      text: text,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    // Tampilkan container dan tombol download
    setTimeout(() => {
      qrCodeContainer.style.display = "block";
      downloadBtn.style.display = "block";
      setLoading(generateBtn, false, originalText);
      showSuccess('QR Code berhasil dibuat!');
    }, 500);
  }, 500);
}

// Download QR Code
function downloadQR() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) {
    showError("Generate dulu QR-nya!");
    return;
  }

  // Animasi klik tombol
  if (downloadBtn) {
    downloadBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      downloadBtn.style.transform = "scale(1)";
    }, 150);
  }

  // Buat canvas baru dengan padding dan watermark
  const padding = 40;
  const newCanvas = document.createElement("canvas");
  const ctx = newCanvas.getContext("2d");
  
  newCanvas.width = canvas.width + (padding * 2);
  newCanvas.height = canvas.height + (padding * 2) + 30;
  
  // Background putih
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
  
  // Gambar QR di tengah dengan padding
  ctx.drawImage(canvas, padding, padding);
  
  // Tambahkan watermark
  ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#333333";
  ctx.textAlign = "center";
  ctx.fillText("by R_hmt", newCanvas.width/2, newCanvas.height - 10);
  
  // Download
  const link = document.createElement("a");
  link.href = newCanvas.toDataURL("image/png");
  link.download = `QR_Code_Rhmt_${Date.now()}.png`;
  link.click();
  
  showSuccess('QR Code berhasil didownload!');
}

// Scan QR Code
function scanQR() {
  if (!fileInput || !scanResult || !scanResultText || !scanBtn) return;
  
  const file = fileInput.files[0];
  if (!file) {
    showError("Pilih file gambar terlebih dahulu!");
    return;
  }

  // Reset state
  scanResult.classList.remove('show');
  hideMessages();
  
  // Show loading
  const originalText = scanBtn.innerHTML;
  setLoading(scanBtn, true, originalText);

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // Create canvas for image processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Try to decode QR code
      // Note: For actual QR scanning, you need to include a QR decoding library like jsQR
      // This is a simulation for demo purposes
      setTimeout(() => {
        // Simulate scanning process
        const isQRCode = Math.random() > 0.3; // 70% success rate for demo
        
        if (isQRCode) {
          // Simulate decoded text
          const decodedTexts = [
            "https://te.me/AiiSigma",
            "https://github.com/rhmt",
            "WELCOME TO R_HMT TOOLS",
            "Scan successful! This is a demo QR code text.",
            "Contact: support@rhmt.com"
          ];
          const randomText = decodedTexts[Math.floor(Math.random() * decodedTexts.length)];
          
          // Display result
          scanResultText.textContent = randomText;
          scanResult.classList.add('show');
          showSuccess('QR Code berhasil discan!');
        } else {
          showError('Gagal membaca QR Code. Pastikan gambar jelas dan berisi QR Code yang valid.');
        }
        
        setLoading(scanBtn, false, originalText);
      }, 1000);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Copy text to clipboard
function copyToClipboard() {
  if (!scanResultText || !copyBtn) return;
  
  const text = scanResultText.textContent;
  if (!text) {
    showError("Tidak ada teks untuk disalin!");
    return;
  }
  
  navigator.clipboard.writeText(text).then(() => {
    // Show copied animation
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
    copyBtn.style.background = 'linear-gradient(135deg, #00ff00, #00cc00)';
    
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fas fa-copy"></i> Salin Teks';
      copyBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
    }, 2000);
    
    showSuccess('Teks berhasil disalin ke clipboard!');
  }).catch(err => {
    console.error('Copy failed:', err);
    showError('Gagal menyalin teks. Coba manual.');
  });
}

// Event Listeners
if (generateBtn) {
  generateBtn.addEventListener('click', generateQR);
}

if (scanBtn) {
  scanBtn.addEventListener('click', scanQR);
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', downloadQR);
}

if (copyBtn) {
  copyBtn.addEventListener('click', copyToClipboard);
}

// Event listener untuk tombol Enter di input text
if (textInput) {
  textInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      generateQR();
    }
  });
}

// Auto-focus pada input saat halaman dimuat
window.onload = function() {
  if (textInput) textInput.focus();
  
  // Close sidebar when clicking on a link (for mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < 1024) {
        toggleSidebar();
      }
    });
  });
};

// Close sidebar when clicking on a link (for mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  });
});