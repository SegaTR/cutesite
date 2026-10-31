const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const loveMessage = document.getElementById('loveMessage');
const question = document.getElementById('question');
const bgHearts = document.getElementById('bg-hearts');
const fireworks = document.getElementById('fireworks');
const moreFireworksBtn = document.getElementById('moreFireworksBtn');
const cuteModeBtn = document.getElementById('cuteModeBtn');
const easterEggBtn = document.getElementById('easterEggBtn');
const easterEggMessage = document.getElementById('easterEggMessage');
let additionalFireworksCount = 0;
let fireworksCount = 0;
const relationshipStart = new Date(2026, 7, 10);

function updateDaysTogether() {
  const today = new Date();
  const startDay = Date.UTC(relationshipStart.getFullYear(), relationshipStart.getMonth(), relationshipStart.getDate());
  const currentDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.max(0, Math.floor((currentDay - startDay) / 86400000));
  const lastTwoDigits = days % 100;
  const lastDigit = days % 10;
  const word = lastTwoDigits >= 11 && lastTwoDigits <= 14
    ? 'дней'
    : lastDigit === 1
      ? 'день'
      : lastDigit >= 2 && lastDigit <= 4
        ? 'дня'
        : 'дней';

  document.getElementById('daysTogether').textContent = String(days);
  document.getElementById('daysWord').textContent = word;
}

updateDaysTogether();

function moveNoButton() {
  const yesRect = yesBtn.getBoundingClientRect();
  const cardRect = noBtn.parentElement.parentElement.getBoundingClientRect();
  const buttonRect = noBtn.getBoundingClientRect();
  const padding = 14;
  const gap = 18;
  const maxLeft = Math.max(padding, window.innerWidth - buttonRect.width - padding);
  const maxTop = Math.max(padding, window.innerHeight - buttonRect.height - padding);
  let destination;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const left = Math.random() * (maxLeft - padding) + padding;
    const top = Math.random() * (maxTop - padding) + padding;
    const avoidsYes = left + buttonRect.width + gap < yesRect.left
       || left - gap > yesRect.right
       || top + buttonRect.height + gap < yesRect.top
       || top - gap > yesRect.bottom;
    const avoidsCard = left + buttonRect.width + gap < cardRect.left
       || left - gap > cardRect.right
       || top + buttonRect.height + gap < cardRect.top
       || top - gap > cardRect.bottom;

    if (avoidsYes && avoidsCard) {
      destination = { left, top };
      break;
    }
  }

  if (!destination) {
    const corners = [
      { left: padding, top: padding },
      { left: maxLeft, top: padding },
      { left: padding, top: maxTop },
      { left: maxLeft, top: maxTop },
    ];
    destination = corners.find(({ left, top }) => (
      (left + buttonRect.width + gap < yesRect.left
        || left - gap > yesRect.right
        || top + buttonRect.height + gap < yesRect.top
        || top - gap > yesRect.bottom)
      && (left + buttonRect.width + gap < cardRect.left
        || left - gap > cardRect.right
        || top + buttonRect.height + gap < cardRect.top
        || top - gap > cardRect.bottom)
    )) || corners[0];
  }

  if (!noBtn.classList.contains('is-running')) {
    noBtn.classList.add('is-running');
    noBtn.style.left = `${buttonRect.left}px`;
    noBtn.style.top = `${buttonRect.top}px`;
  }

  requestAnimationFrame(() => {
    noBtn.style.left = `${destination.left}px`;
    noBtn.style.top = `${destination.top}px`;
  });
}

function launchFireworks() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#c94f43', '#f2b84b', '#68a889', '#8e79bd', '#f08c9b'];

  for (let burst = 0; burst < 5; burst += 1) {
    const firework = document.createElement('span');
    firework.className = 'firework-burst';
    firework.style.left = `${20 + Math.random() * 60}%`;
    firework.style.top = `${15 + Math.random() * 55}%`;

    for (let particle = 0; particle < 24; particle += 1) {
      const spark = document.createElement('span');
      const angle = (Math.PI * 2 * particle) / 24;
      const distance = 55 + Math.random() * 65;
      spark.className = 'firework-spark';
      spark.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      firework.appendChild(spark);
    }

    fireworks.appendChild(firework);
    setTimeout(() => firework.remove(), 1600);
  }
}

function launchHearts(count = 54, includePhotos = false) {
  const photoPaths = ['photos/photo1.jpg', 'photos/photo2.jpg', 'photos/photo3.jpg'];
  const photoSlots = new Set();
  const photoCount = includePhotos ? Math.min(3, count) : 0;

  while (photoSlots.size < photoCount) {
    photoSlots.add(Math.floor(Math.random() * count));
  }

  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`;

    if (photoSlots.has(i)) {
      const photo = document.createElement('img');
      const photoPath = photoPaths[Math.floor(Math.random() * photoPaths.length)];
      photo.className = 'heart-photo-img';
      photo.src = photoPath;
      photo.alt = '';
      photo.addEventListener('error', () => {
        heart.textContent = '📷';
        heart.title = photoPath;
        heart.classList.add('photo-placeholder');
      }, { once: true });
      heart.classList.add('heart-photo');
      heart.appendChild(photo);
    } else {
      heart.textContent = ['💖', '💗', '💞', '💘', '♥️'][Math.floor(Math.random() * 5)];
      heart.style.animationDelay = `${Math.random() * 1.5}s`;
    }

    bgHearts.appendChild(heart);

    setTimeout(() => heart.remove(), 7000);
  }
}

function launchCelebration(showPhotos = false) {
  launchFireworks();
  launchHearts(54, showPhotos);
  fireworksCount += 1;
  document.getElementById('fireworksCount').textContent = String(fireworksCount);
}

noBtn.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse') moveNoButton();
});
noBtn.addEventListener('click', (event) => {
  event.preventDefault();
  if (!noBtn.classList.contains('is-running')) moveNoButton();
});

moreFireworksBtn.addEventListener('click', () => {
  launchCelebration(true);
  additionalFireworksCount += 1;

  if (additionalFireworksCount >= 2) {
    easterEggBtn.classList.remove('hidden');
  }
});

cuteModeBtn.addEventListener('click', () => {
  const enabled = document.body.classList.toggle('extra-cute');
  cuteModeBtn.setAttribute('aria-pressed', String(enabled));
  cuteModeBtn.textContent = enabled ? 'Уже милее 💖' : 'Ещё милее ✨';

  if (enabled) launchHearts(24);
});

easterEggBtn.addEventListener('click', () => {
  easterEggMessage.classList.remove('hidden');
});

yesBtn.addEventListener('click', () => {
  question.textContent = 'Я тоже тебя люблю 😍';
  loveMessage.classList.remove('hidden');
  noBtn.style.display = 'none';
  launchCelebration();
});
