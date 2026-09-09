// Keep startup loading status tied to config.js without overwriting the build label.
if (window.P5LabMediaManager) {
  P5LabMediaManager.prototype.setLoadingStatus = function(action, note) {
    const actionEl = document.querySelector('.start-action');
    const versionEl = document.querySelector('.start-note');
    const residentEl = document.querySelector('.start-resident');
    const version = P5LAB_CONFIG?.app?.version || '?';
    const revision = P5LAB_CONFIG?.meta?.configRevision ?? '?';
    if (actionEl) actionEl.textContent = action;
    if (versionEl) versionEl.textContent = `DODREI v${version} / revision ${revision}`;
    if (residentEl) residentEl.textContent = note || '';
  };
}
