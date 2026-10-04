const tabs = document.querySelectorAll('[data-quinta-panel]');
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
  document.querySelectorAll('.quinta-media-panel').forEach((panel) => panel.classList.toggle('is-active', panel.id === tab.dataset.quintaPanel));
}));

const galleryImages = [
  'images/Quinta-Berriozabal.png', 'images/Quinta-Berriozabal-1.png',
  'images/Quinta-Berriozabal-2.png', 'images/Quinta-Berriozabal-3.png',
  'images/Quinta-Berriozabal-4.png', 'images/Quinta-Berriozabal-5.png',
  'images/Quinta-Berriozabal-6.png', 'images/Quinta-Berriozabal-8.png',
  'images/Quinta-Berriozabal-10.png', 'images/Quinta-Berriozabal-11.png',
  'images/Quinta-Berriozabal-12.png', 'images/Quinta-Berriozabal-13.png',
  'images/Quinta-Berriozabal-14.png', 'images/Quinta-Berriozabal-15.png',
  'images/Quinta-Berriozabal-16.png', 'images/Quinta-Berriozabal-17.png',
  'images/Quinta-Berriozabal-18.png', 'images/Quinta-Berriozabal-19.png',
];
const imageDialog = document.querySelector('#quinta-image-dialog');
const lightboxImage = document.querySelector('#quinta-lightbox-image');
let galleryIndex = 0;

function showImage(nextIndex) {
  galleryIndex = (nextIndex + galleryImages.length) % galleryImages.length;
  lightboxImage.src = galleryImages[galleryIndex];
  lightboxImage.alt = `Vista ampliada de la Quinta en Berriozábal ${galleryIndex + 1}`;
}

document.querySelectorAll('[data-quinta-gallery-index]').forEach((button) => button.addEventListener('click', () => {
  showImage(Number(button.dataset.quintaGalleryIndex));
  imageDialog.showModal();
  document.body.style.overflow = 'hidden';
}));
const closeImage = () => { imageDialog.close(); document.body.style.overflow = ''; };
document.querySelector('[data-close-quinta-image]').addEventListener('click', closeImage);
document.querySelector('[data-quinta-image-prev]').addEventListener('click', () => showImage(galleryIndex - 1));
document.querySelector('[data-quinta-image-next]').addEventListener('click', () => showImage(galleryIndex + 1));
imageDialog.addEventListener('click', (event) => { if (event.target === imageDialog) closeImage(); });

let tourLoading = false;
document.querySelectorAll('[data-open-quinta-tour]').forEach((button) => button.addEventListener('click', () => {
  if (document.documentElement.dataset.quintaTourReady || tourLoading) return;
  tourLoading = true;
  const script = document.createElement('script');
  script.src = 'vendor/tour-app.bundle.js';
  script.onload = () => { tourLoading = false; button.click(); };
  script.onerror = () => { tourLoading = false; };
  document.body.append(script);
}, { capture: true }));
