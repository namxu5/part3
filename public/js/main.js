// Hiệu ứng cho input tìm kiếm
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('focus', function() {
    searchInput.style.borderColor = '#3498db';
    searchInput.style.boxShadow = '0 0 5px #3498db';
  });
  searchInput.addEventListener('blur', function() {
    searchInput.style.borderColor = '#ccc';
    searchInput.style.boxShadow = 'none';
  });
}
// Hiệu ứng hover cho danh sách nhà cung cấp
const supplierList = document.getElementById('supplierList');
if (supplierList) {
  supplierList.querySelectorAll('li a').forEach(function(link) {
    link.addEventListener('mouseover', function() {
      link.style.color = '#e74c3c';
    });
    link.addEventListener('mouseout', function() {
      link.style.color = '#2980b9';
    });
  });
}
