function togglePassword(id) {
  const field = document.getElementById(id);
  if (field) {
    field.type = field.type === "password" ? "text" : "password";
  }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  } else {
    // Fallback ke alert jika elemen notification tidak ada
    alert(message);
  }
}

// Fungsi untuk toggle menu mobile
function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('active');
  }
}

// Fungsi logout
function logout() {
  try {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    showNotification('Anda telah keluar dari sistem', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    console.error('Error during logout:', error);
    window.location.href = 'index.html';
  }
  return false;
}

// Fungsi untuk memeriksa status login
function checkLoginStatus() {
  try {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    
    if (isLoggedIn === 'true' && username) {
      // Update username di topbar
      const usernameElements = document.querySelectorAll('#username');
      usernameElements.forEach(el => {
        el.textContent = username;
      });
      return true;
    } else {
      // Periksa apakah kita berada di halaman yang memerlukan login
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const protectedPages = ['dashboard.html', 'upload.html', 'hasil.html', 'pengumpulan.html'];
      
      if (protectedPages.includes(currentPage)) {
        window.location.href = 'login.html';
        return false;
      }
      return true;
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    return true; // Lanjutkan jika ada error dengan localStorage
  }
}

// Fungsi untuk menghasilkan ID unik
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Fungsi untuk memformat tanggal
function formatDate(date) {
  try {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('id-ID', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return new Date(date).toString();
  }
}

// Event listener untuk form login
function setupLoginForm() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.querySelector('#loginForm input[type="text"]').value;
      
      try {
        // Simpan status login dan username ke localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        showNotification("Login berhasil! Selamat datang di Ruang Belajar!", 'success');
        
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } catch (error) {
        console.error('Error during login:', error);
        // Fallback jika localStorage tidak tersedia
        alert("Login berhasil! Selamat datang di Ruang Belajar!");
        window.location.href = "dashboard.html";
      }
    });
  }
}

// Event listener untuk form register
function setupRegisterForm() {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const pass = document.getElementById("regPassword").value;
      const confirm = document.getElementById("confirmPassword").value;
      const username = document.querySelector('#registerForm input[placeholder="Username"]').value;

      if (pass !== confirm) {
        showNotification("Password tidak cocok!", 'error');
      } else {
        try {
          // Simpan status login dan username ke localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', username);
          
          showNotification("Akun berhasil dibuat!", 'success');
          
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1000);
        } catch (error) {
          console.error('Error during registration:', error);
          // Fallback jika localStorage tidak tersedia
          alert("Akun berhasil dibuat!");
          window.location.href = "dashboard.html";
        }
      }
    });
  }
}

// Event listener untuk form upload
function setupUploadForm() {
  const uploadForm = document.getElementById("uploadForm");
  if (uploadForm) {
    uploadForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const nama = document.getElementById('nama').value;
      const mapel = document.getElementById('mapel').value;
      const judul = document.getElementById('judul').value;
      const deskripsi = document.getElementById('deskripsi').value;
      const fileInput = document.getElementById('file');
      const file = fileInput.files[0];
      
      // Validasi file
      if (file) {
        const fileSize = file.size / 1024 / 1024; // in MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                             'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
        
        if (fileSize > 10) {
          showNotification("Ukuran file terlalu besar! Maksimal 10MB", 'error');
          return;
        }
        
        if (!allowedTypes.includes(file.type)) {
          showNotification("Format file tidak didukung!", 'error');
          return;
        }
      }
      
      // Simulasi upload progress
      const uploadProgress = document.getElementById('uploadProgress');
      const progressBar = document.getElementById('progressBar');
      const uploadMessage = document.getElementById('uploadMessage');
      
      if (uploadProgress && progressBar) {
        uploadProgress.style.display = 'block';
        let progress = 0;
        
        const interval = setInterval(() => {
          progress += 10;
          progressBar.style.width = progress + '%';
          progressBar.textContent = progress + '%';
          
          if (progress >= 100) {
            clearInterval(interval);
            
            try {
              // Simpan data tugas ke localStorage
              const tugas = {
                id: generateId(),
                nama,
                mapel,
                judul,
                deskripsi,
                file: file ? file.name : '',
                tanggal: new Date().toISOString(),
                status: "Terkirim",
                nilai: null
              };
              
              let data = [];
              try {
                const storedData = localStorage.getItem("tugas");
                if (storedData) {
                  data = JSON.parse(storedData);
                }
              } catch (error) {
                console.error('Error parsing stored data:', error);
              }
              
              data.push(tugas);
              localStorage.setItem("tugas", JSON.stringify(data));
              
              if (uploadMessage) {
                uploadMessage.innerHTML = `<div class="alert alert-success">Tugas berhasil dikumpulkan!</div>`;
              }
              showNotification("Tugas berhasil dikumpulkan!", 'success');
              
              // Reset form
              uploadForm.reset();
              
              // Sembunyikan progress bar setelah beberapa saat
              setTimeout(() => {
                uploadProgress.style.display = 'none';
                progressBar.style.width = '0%';
                progressBar.textContent = '0%';
              }, 2000);
            } catch (error) {
              console.error('Error saving task:', error);
              showNotification("Terjadi kesalahan saat menyimpan tugas", 'error');
            }
          }
        }, 200);
      } else {
        // Fallback jika elemen progress tidak ada
        try {
          const tugas = {
            id: generateId(),
            nama,
            mapel,
            judul,
            deskripsi,
            file: file ? file.name : '',
            tanggal: new Date().toISOString(),
            status: "Terkirim",
            nilai: null
          };
          
          let data = [];
          try {
            const storedData = localStorage.getItem("tugas");
            if (storedData) {
              data = JSON.parse(storedData);
            }
          } catch (error) {
            console.error('Error parsing stored data:', error);
          }
          
          data.push(tugas);
          localStorage.setItem("tugas", JSON.stringify(data));
          
          showNotification("Tugas berhasil dikumpulkan!", 'success');
          uploadForm.reset();
        } catch (error) {
          console.error('Error saving task:', error);
          showNotification("Terjadi kesalahan saat menyimpan tugas", 'error');
        }
      }
    });
  }
}

// Fungsi untuk memuat data dashboard
function loadDashboardData() {
  try {
    let data = [];
    try {
      const storedData = localStorage.getItem("tugas");
      if (storedData) {
        data = JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error parsing stored data:', error);
    }
    
    // Update statistik
    const totalTugasEl = document.getElementById('totalTugas');
    const tugasSelesaiEl = document.getElementById('tugasSelesai');
    const tugasPendingEl = document.getElementById('tugasPending');
    const tugasTerlambatEl = document.getElementById('tugasTerlambat');
    
    if (totalTugasEl) totalTugasEl.textContent = data.length;
    if (tugasSelesaiEl) tugasSelesaiEl.textContent = data.filter(t => t.status === "Dinilai").length;
    if (tugasPendingEl) tugasPendingEl.textContent = data.filter(t => t.status === "Terkirim").length;
    if (tugasTerlambatEl) tugasTerlambatEl.textContent = data.filter(t => t.status === "Terlambat").length;
    
    // Update tabel tugas terbaru
    const tugasTable = document.getElementById('tugasTable');
    if (tugasTable) {
      tugasTable.innerHTML = '';
      
      // Ambil 5 tugas terbaru
      const recentTasks = data.slice(-5).reverse();
      
      if (recentTasks.length === 0) {
        tugasTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada tugas</td></tr>';
      } else {
        recentTasks.forEach(tugas => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${tugas.judul}</td>
            <td>${tugas.mapel}</td>
            <td>${formatDate(tugas.tanggal)}</td>
            <td><span class="status-badge status-${tugas.status === 'Dinilai' ? 'graded' : 'submitted'}">${tugas.status}</span></td>
            <td>
              <button class="btn-sm btn-primary" onclick="viewTaskDetail('${tugas.id}')">
                <i class="fas fa-eye"></i> Lihat
              </button>
            </td>
          `;
          tugasTable.appendChild(row);
        });
      }
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

// Fungsi untuk memuat data hasil tugas
function loadHasilData(filterMapel = '') {
  try {
    let data = [];
    try {
      const storedData = localStorage.getItem("tugas");
      if (storedData) {
        data = JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error parsing stored data:', error);
    }
    
    const hasilTabel = document.getElementById('hasilTabel');
    const emptyState = document.getElementById('emptyState');
    
    if (hasilTabel) {
      hasilTabel.innerHTML = '';
      
      // Filter data berdasarkan mapel jika ada
      let filteredData = data;
      if (filterMapel) {
        filteredData = data.filter(t => t.mapel === filterMapel);
      }
      
      if (filteredData.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (hasilTabel.parentElement) hasilTabel.parentElement.style.display = 'none';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        if (hasilTabel.parentElement) hasilTabel.parentElement.style.display = 'block';
        
        filteredData.forEach((tugas, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${tugas.nama}</td>
            <td>${tugas.mapel}</td>
            <td>${tugas.judul}</td>
            <td><a href="#" onclick="downloadFile('${tugas.file}'); return false;">${tugas.file}</a></td>
            <td>${formatDate(tugas.tanggal)}</td>
            <td><span class="status-badge status-${tugas.status === 'Dinilai' ? 'graded' : 'submitted'}">${tugas.status}</span></td>
            <td>${tugas.nilai || '-'}</td>
            <td>
              <button class="btn-sm btn-primary" onclick="viewTaskDetail('${tugas.id}')">
                <i class="fas fa-eye"></i>
              </button>
              ${tugas.status !== 'Dinilai' ? `
              <button class="btn-sm btn-success" onclick="giveGrade('${tugas.id}')">
                <i class="fas fa-check"></i>
              </button>` : ''}
            </td>
          `;
          hasilTabel.appendChild(row);
        });
      }
    }
  } catch (error) {
    console.error('Error loading hasil data:', error);
  }
}

// Fungsi untuk melihat detail tugas
function viewTaskDetail(taskId) {
  try {
    let data = [];
    try {
      const storedData = localStorage.getItem("tugas");
      if (storedData) {
        data = JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error parsing stored data:', error);
    }
    
    const task = data.find(t => t.id === taskId);
    
    if (task) {
      const modal = document.getElementById('detailModal');
      const modalBody = document.getElementById('modalBody');
      
      if (modal && modalBody) {
        modalBody.innerHTML = `
          <div class="form-group">
            <label>Nama</label>
            <p>${task.nama}</p>
          </div>
          <div class="form-group">
            <label>Mata Pelajaran</label>
            <p>${task.mapel}</p>
          </div>
          <div class="form-group">
            <label>Judul Tugas</label>
            <p>${task.judul}</p>
          </div>
          <div class="form-group">
            <label>Deskripsi</label>
            <p>${task.deskripsi || '-'}</p>
          </div>
          <div class="form-group">
            <label>File</label>
            <p><a href="#" onclick="downloadFile('${task.file}'); return false;">${task.file}</a></p>
          </div>
          <div class="form-group">
            <label>Tanggal Pengumpulan</label>
            <p>${formatDate(task.tanggal)}</p>
          </div>
          <div class="form-group">
            <label>Status</label>
            <p><span class="status-badge status-${task.status === 'Dinilai' ? 'graded' : 'submitted'}">${task.status}</span></p>
          </div>
          ${task.nilai ? `
          <div class="form-group">
            <label>Nilai</label>
            <p>${task.nilai}</p>
          </div>` : ''}
        `;
        
        modal.style.display = 'block';
      }
    }
  } catch (error) {
    console.error('Error viewing task detail:', error);
    showNotification('Terjadi kesalahan saat melihat detail tugas', 'error');
  }
}

// Fungsi untuk memberi nilai
function giveGrade(taskId) {
  try {
    const nilai = prompt('Masukkan nilai (0-100):');
    
    if (nilai !== null && !isNaN(nilai) && nilai >= 0 && nilai <= 100) {
      let data = [];
      try {
        const storedData = localStorage.getItem("tugas");
        if (storedData) {
          data = JSON.parse(storedData);
        }
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
      
      const taskIndex = data.findIndex(t => t.id === taskId);
      
      if (taskIndex !== -1) {
        data[taskIndex].nilai = nilai;
        data[taskIndex].status = 'Dinilai';
        localStorage.setItem("tugas", JSON.stringify(data));
        
        showNotification('Nilai berhasil disimpan!', 'success');
        loadHasilData(); // Refresh tabel
      }
    } else if (nilai !== null) {
      showNotification('Nilai harus antara 0-100!', 'error');
    }
  } catch (error) {
    console.error('Error giving grade:', error);
    showNotification('Terjadi kesalahan saat memberi nilai', 'error');
  }
}

// Fungsi untuk download file (simulasi)
function downloadFile(filename) {
  showNotification(`Mengunduh file: ${filename}`, 'info');
  // Di aplikasi nyata, ini akan mengunduh file dari server
}

// Setup event listeners
function setupEventListeners() {
  // Event listener untuk filter mapel
  const filterMapel = document.getElementById('filterMapel');
  if (filterMapel) {
    filterMapel.addEventListener('change', function() {
      loadHasilData(this.value);
    });
  }

  // Event listener untuk tombol refresh
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      const filterMapel = document.getElementById('filterMapel');
      const filterValue = filterMapel ? filterMapel.value : '';
      loadHasilData(filterValue);
      showNotification('Data berhasil diperbarui!', 'success');
    });
  }

  // Event listener untuk tombol close modal
  const closeModal = document.getElementById('closeModal');
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      const modal = document.getElementById('detailModal');
      if (modal) modal.style.display = 'none';
    });
  }

  // Event listener untuk klik di luar modal
  window.addEventListener('click', function(event) {
    const modal = document.getElementById('detailModal');
    if (modal && event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Event listener untuk tombol menu mobile
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }
}

// Inisialisasi halaman
document.addEventListener('DOMContentLoaded', function() {
  // Periksa status login
  checkLoginStatus();
  
  // Setup form event listeners
  setupLoginForm();
  setupRegisterForm();
  setupUploadForm();
  
  // Setup other event listeners
  setupEventListeners();
  
  // Load data sesuai halaman
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  if (currentPage.includes('dashboard.html')) {
    loadDashboardData();
  } else if (currentPage.includes('hasil.html')) {
    loadHasilData();
  }
});