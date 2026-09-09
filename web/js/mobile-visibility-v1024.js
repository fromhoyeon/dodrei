/** DODREI — RUNTIME FOCUS / VISIBILITY PAUSE v1.0.29
 * Any focus loss or document hiding pauses DODREI through the single global
 * runtime pause entry point. Returning to the page never resumes automatically.
 */
(()=>{
  const pauseRuntime=()=>{
    if(window.DODREI_RUNTIME_PAUSED)return;
    if(typeof window.DODREI_SET_PAUSED==="function")window.DODREI_SET_PAUSED(true);
  };

  window.addEventListener("blur",pauseRuntime);
  window.addEventListener("pagehide",pauseRuntime);
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden)pauseRuntime();
  });
})();
