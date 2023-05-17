let activeOverlay = false;
/**
 * Función que convierte unidades vh a px
 * @param {number} vh Valor en unidades vh
 * @returns {number} Valor convertido en unidades px
 */
function vhToPx(vh) {
    const h = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
    );
    return (vh * h) / 100;
}

// Crear el elemento overlay y bloquear el contenido
const extensionOverlay = document.createElement('div');
extensionOverlay.setAttribute('id', 'extension__overlay');
extensionOverlay.style.height = '0px';
document.body.appendChild(extensionOverlay);

// Crear sección superior y agregarla al overlay
const overlayTop = document.createElement('div');
overlayTop.setAttribute('id', 'overlay__top');
overlayTop.classList.add('blocked-content');
overlayTop.style.height = '0px';
extensionOverlay.appendChild(overlayTop);

// Crear contenedor y agregarlo al overlay
const container = document.createElement('div');
container.classList.add('section-container');
container.style.height = '0px';
extensionOverlay.appendChild(container);

// Crear sección inferior y agregarla al overlay
const overlayBottom = document.createElement('div');
overlayBottom.setAttribute('id', 'overlay__bottom');
overlayBottom.classList.add('blocked-content');
const overlayBottomHeight = vhToPx(100);
overlayBottom.style.height = `0px`;
extensionOverlay.appendChild(overlayBottom);



console.log('Corriendo content script');

// Escuchar mensaje del background para activar o desactivar overlay
chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "toggle_overlay") {
        if (activeOverlay === false) {
            activeOverlay = true;
            chrome.runtime.sendMessage({ action: "overlay_on" });
            
            extensionOverlay.style.display = 'flex';
            overlayTop.style.height = '50px';
            container.style.height = '100px';
            overlayBottom.style.height = `${overlayBottomHeight}px`;
            extensionOverlay.style.height = '100vh';
            // Mover el contenedor alrededor del cursor
            document.addEventListener('mousemove', function (e) {
                overlayBottom.style.height = `${overlayBottomHeight}px`;
                const x = e.clientX;
                const y = e.clientY;
                let heightBottom = overlayBottom.style.getPropertyValue('height');
                heightBottom = parseInt(heightBottom);
                container.style.top = `${y}px`;
                overlayTop.style.height = `${y}px`;

                let heightContainer = container.style.getPropertyValue('height');
                heightContainer = parseInt(heightContainer);
                const heightDifference = y + heightContainer;

                overlayBottom.style.height = `${heightBottom - heightDifference}px`;
                heightBottom = overlayBottom.style.getPropertyValue('height');
            });
        } else if (activeOverlay === true) {
            activeOverlay = false;
            chrome.runtime.sendMessage({ action: "overlay_off" });
            
            extensionOverlay.style.display = 'none';
            extensionOverlay.style.height = '0px';

        }
    }
});