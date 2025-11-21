// Student modal functions
function openStudentModal() {
  document.getElementById('studentModal').classList.remove('hidden');
}

function closeStudentModal() {
  document.getElementById('studentModal').classList.add('hidden');
}

// Close student modal when clicking outside content
document.addEventListener('click', function(event) {
  const modal = document.getElementById('studentModal');
  const content = modal.querySelector('.modal-box');
  if (!modal.classList.contains('hidden') && !content.contains(event.target) && modal.contains(event.target)) {
    closeStudentModal();
  }
});



function logout() {
  // Redirect to login modal or homepage
  window.location.href = "index.html";
}

// Toggle sidebar for mobile
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('hidden');
}
