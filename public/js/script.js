document.addEventListener('DOMContentLoaded', function() {
  const bidangFilter = document.getElementById('bidangFilter');
  
  bidangFilter.addEventListener('change', function() {
    const selectedBidang = this.value;
    
    if (selectedBidang === 'all') {
      // Reload all data
      window.location.reload();
    } else {
      // Fetch filtered data
      fetch(`/api/volunteers/${selectedBidang}`)
        .then(response => response.json())
        .then(data => {
          updateTable(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });
  
  function updateTable(data) {
    const tbody = document.querySelector('#volunteersTable tbody');
    tbody.innerHTML = '';
    
    data.forEach((volunteer, index) => {
      const row = document.createElement('tr');
      
      // Nomor
      const noCell = document.createElement('td');
      noCell.textContent = index + 1;
      
      // Nama Lengkap
      const namaCell = document.createElement('td');
      namaCell.textContent = volunteer.nama_lengkap;
      
      // Bidang Pelayanan
      const bidangCell = document.createElement('td');
      if (volunteer.bidang_pelayanan && volunteer.bidang_pelayanan.length > 0) {
        volunteer.bidang_pelayanan.forEach(bidang => {
          const badge = document.createElement('span');
          badge.className = 'badge badge-primary';
          badge.textContent = bidang;
          bidangCell.appendChild(badge);
        });
      } else {
        bidangCell.textContent = '-';
      }
      
      // Alat Musik
      const alatCell = document.createElement('td');
      if (volunteer.alat_musik && volunteer.alat_musik.length > 0) {
        volunteer.alat_musik.forEach(alat => {
          const badge = document.createElement('span');
          badge.className = 'badge badge-success';
          badge.textContent = alat;
          alatCell.appendChild(badge);
        });
      } else {
        alatCell.textContent = '-';
      }
      
      // Email
      const emailCell = document.createElement('td');
      emailCell.textContent = volunteer.email || '-';
      
      // Append cells to row
      row.appendChild(noCell);
      row.appendChild(namaCell); 
      row.appendChild(bidangCell);
      row.appendChild(alatCell);
      row.appendChild(emailCell);
      
      // Append row to table
      tbody.appendChild(row);
    });
  }
});