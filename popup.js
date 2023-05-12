// Obtener el botón de la extensión
let button = document.getElementById('toggleButton');

// Enviar un mensaje al archivo background.js al hacer clic en el botón
button.addEventListener('click', function(){
  chrome.runtime.sendMessage({ action: "toggle_overlay" });
});
