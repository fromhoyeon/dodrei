// Keep the archive loading UI tied to config.js instead of hard-coded version/revision text.
if (window.P5LabMediaManager) {
  P5LabMediaManager.prototype.setLoadingStatus = function(action, note) {
    const actionEl = document.querySelector('.start-action');
    const noteEl = document.querySelector('.start-note');
    const version = P5LAB_CONFIG?.app?.version || '?';
    const revision = P5LAB_CONFIG?.meta?.configRevision ?? '?';
    if (actionEl) actionEl.textContent = action;
    if (noteEl) noteEl.textContent = `DODREI v${version} / revision ${revision} / ${note}`;
  };
}
