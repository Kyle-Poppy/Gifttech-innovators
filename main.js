function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function closeModalOutside(event) {
  const modal = document.getElementById('aboutModal');
  if (event.target === modal) {
    closeModal('aboutModal');
  }
}
