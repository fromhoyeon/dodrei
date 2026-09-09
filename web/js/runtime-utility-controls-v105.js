/** DODREI — PAUSE / UI-HIDE / FULLSCREEN UTILITY CONTROLS */
window.addEventListener("DOMContentLoaded", () => {
  const pauseButton = document.getElementById("runtime-pause-button");
  const uiButton = document.getElementById("runtime-ui-button");
  const fullscreenButton = document.getElementById("runtime-fullscreen-button");
  const stopPointer = (event) => event.stopPropagation();
  const setPressed = (button, pressed, label, title) => { if (!button) return; button.setAttribute("aria-pressed", pressed ? "true" : "false"); button.setAttribute("aria-label", label); button.title = title; };

  if (pauseButton) {
    const refreshPause = () => {
      const paused = !!window.DODREI_RUNTIME_PAUSED;
      pauseButton.textContent = paused ? "RESUME" : "PAUSE";
      setPressed(pauseButton, paused, paused ? "Resume DODREI" : "Pause DODREI", paused ? "Resume DODREI" : "Pause DODREI");
    };
    pauseButton.addEventListener("pointerdown", stopPointer);
    pauseButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = !window.DODREI_RUNTIME_PAUSED;
      if (typeof window.DODREI_SET_PAUSED === "function") window.DODREI_SET_PAUSED(next);
      else window.DODREI_RUNTIME_PAUSED = next;
      refreshPause();
    });
    window.addEventListener("dodrei:pausechange", refreshPause);
    refreshPause();
  }

  if (uiButton) {
    const refreshUi=()=>{const hidden=document.body.classList.contains("dodrei-ui-hidden");uiButton.textContent="UI";setPressed(uiButton,hidden,hidden?"Show runtime controls":"Hide runtime controls",hidden?"Show runtime controls":"Hide runtime controls");};
    uiButton.addEventListener("pointerdown",stopPointer);uiButton.addEventListener("click",(event)=>{event.preventDefault();event.stopPropagation();document.body.classList.toggle("dodrei-ui-hidden");refreshUi();});refreshUi();
  }
  if (fullscreenButton) {
    const isFullscreen=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
    const refreshFullscreen=()=>{const active=isFullscreen();fullscreenButton.textContent="FS";setPressed(fullscreenButton,active,active?"Exit fullscreen":"Enter fullscreen",active?"Exit fullscreen":"Enter fullscreen");};
    fullscreenButton.addEventListener("pointerdown",stopPointer);
    fullscreenButton.addEventListener("click",async(event)=>{event.preventDefault();event.stopPropagation();try{if(isFullscreen()){const exit=document.exitFullscreen||document.webkitExitFullscreen;if(exit)await exit.call(document);}else{const root=document.documentElement;const enter=root.requestFullscreen||root.webkitRequestFullscreen;if(enter)await enter.call(root);}}catch(_){}refreshFullscreen();});
    document.addEventListener("fullscreenchange",refreshFullscreen);document.addEventListener("webkitfullscreenchange",refreshFullscreen);refreshFullscreen();
  }
});
