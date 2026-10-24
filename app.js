const envelope = document.querySelector('.envelope');
const modalOverlay = document.querySelector('.modal-overlay');
const closeModal = document.querySelector('.close-modal');
const heartOverlay = document.getElementById('heartAnimOverlay');

let opening = false;

function showLetter() {
  modalOverlay.classList.add('active');
  opening = false;
}

const romance = new RomanceSequence({
  overlay: heartOverlay,
  canvas: document.getElementById('heartCanvas'),
  photoStage: document.getElementById('photoHeartStage'),
  popupStage: document.getElementById('popupStage'),
  hintEl: document.getElementById('stageHint'),
  skipBtn: document.getElementById('skipHeartAnim'),
  onComplete: showLetter,
});

envelope.addEventListener('click', () => {
  if (opening || modalOverlay.classList.contains('active')) return;
  if (heartOverlay.classList.contains('active')) return;
  opening = true;
  envelope.classList.add('open');
  setTimeout(() => romance.start(), 350);
});

closeModal.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  setTimeout(() => {
    envelope.classList.remove('open');
  }, 300);
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal.click();
  }
});
