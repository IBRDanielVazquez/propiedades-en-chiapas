import { Viewer } from '@photo-sphere-viewer/core';

const scenes = {
  interior: [
    ['Sala principal', '01-sala'],
    ['Estudio', '02-estudio'],
    ['Baño de recámara 1', '03-bano-recamara-1'],
    ['Recámara 2', '04-recamara-2'],
    ['Baño de recámara 2', '05-bano-recamara-2'],
    ['Recámara 3', '06-recamara-3'],
    ['Baño de recámara 3', '07-bano-recamara-3'],
    ['Cocina', '08-cocina'],
    ['Sala y patio trasero', '09-sala-patio-trasero'],
  ],
  exterior: [
    ['Acceso principal', '01-acceso-principal'],
    ['Acceso interior', '02-acceso-interior'],
    ['Jardín frontal', '03-jardin-frontal'],
    ['Jardín frontal · vista 2', '04-jardin-frontal-2'],
    ['Acceso al corredor', '05-acceso-corredor'],
    ['Jardín trasero', '06-jardin-trasero'],
    ['Jardín trasero · vista 2A', '07-jardin-trasero-2a'],
    ['Jardín trasero · vista 2B', '08-jardin-trasero-2b'],
    ['Jardín trasero · vista 3', '09-jardin-trasero-3'],
  ],
};

const dialog = document.querySelector('#quinta-tour-dialog');
const sceneName = document.querySelector('#quinta-tour-current');
const sceneCount = document.querySelector('#quinta-tour-count');
const sceneThumbs = document.querySelector('#quinta-tour-scene-thumbs');
let viewer;
let group = 'interior';
let index = 0;

const current = () => scenes[group][index];
const panoramaPath = () => `./360/${group}/${current()[1]}.webp`;
const caption = () => `${group === 'interior' ? 'Interior' : 'Exterior'} · ${current()[0]}`;

function renderThumbs() {
  sceneThumbs.replaceChildren();
  scenes[group].forEach(([name, slug], sceneIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = sceneIndex === index ? 'is-active' : '';
    button.innerHTML = `<img src="./360/miniaturas/${group}/${slug}.webp" alt="" width="640" height="320"><span>${name}</span>`;
    button.addEventListener('click', () => updateScene(sceneIndex));
    sceneThumbs.append(button);
  });
}

async function updateScene(nextIndex, animate = true) {
  index = (nextIndex + scenes[group].length) % scenes[group].length;
  sceneName.textContent = caption();
  sceneCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(scenes[group].length).padStart(2, '0')}`;
  renderThumbs();
  if (!viewer) {
    viewer = new Viewer({
      container: document.querySelector('#quinta-viewer360'),
      panorama: panoramaPath(),
      caption: `${caption()} · Quinta Privada en Berriozábal`,
      loadingImg: `./360/posters/${group}/${current()[1]}.webp`,
      navbar: ['zoom', 'move', 'caption', 'fullscreen'],
      defaultZoomLvl: 0,
      touchmoveTwoFingers: false,
      mousewheelCtrlKey: false,
      lang: {
        zoom: 'Acercar', zoomOut: 'Alejar', zoomIn: 'Acercar', move: 'Mover',
        fullscreen: 'Pantalla completa', twoFingers: 'Desliza para explorar',
        ctrlZoom: 'Usa la rueda para acercar', loadError: 'No se pudo cargar esta vista',
      },
    });
  } else {
    await viewer.setPanorama(panoramaPath(), {
      caption: `${caption()} · Quinta Privada en Berriozábal`,
      transition: animate ? { speed: 700, rotation: true, effect: 'fade' } : false,
      zoom: 0,
    });
  }
}

document.querySelectorAll('[data-open-quinta-tour]').forEach((button) => button.addEventListener('click', async () => {
  group = button.dataset.openQuintaTour;
  index = 0;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  await new Promise(requestAnimationFrame);
  await updateScene(0, false);
  viewer.autoSize();
}));

const closeTour = () => { dialog.close(); document.body.style.overflow = ''; };
document.querySelector('[data-close-quinta-tour]').addEventListener('click', closeTour);
document.querySelector('[data-quinta-tour-prev]').addEventListener('click', () => updateScene(index - 1));
document.querySelector('[data-quinta-tour-next]').addEventListener('click', () => updateScene(index + 1));
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeTour(); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && dialog.open) closeTour();
  if (dialog.open && event.key === 'ArrowLeft') updateScene(index - 1);
  if (dialog.open && event.key === 'ArrowRight') updateScene(index + 1);
});

document.documentElement.dataset.quintaTourReady = 'true';
