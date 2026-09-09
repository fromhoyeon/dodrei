/** DODREI — STAGED STARTUP PRESENTATION v1.0.10 */
(() => {
  window.DODREI_STARTUP = {
    telemetryStage: 0,
    visualOpacity: 0,
    startScreenReleased: false,
  };

  const applyBuildLabel = () => {
    const note = document.querySelector('.start-note');
    const config = window.DODREI_CONFIG || window.P5LAB_CONFIG;
    if (!note || !config) return;
    const version = String(config.app?.version || '').trim();
    const revision = config.meta?.configRevision;
    if (!version) return;
    const hasRevision = revision !== undefined && revision !== null && String(revision).trim() !== '';
    note.textContent = `DODREI v${version}${hasRevision ? ` / revision ${revision}` : ''}`;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBuildLabel, { once: true });
  } else {
    applyBuildLabel();
  }

  const Telemetry = window.P5LabTelemetry;
  if (Telemetry && Telemetry.prototype.render) {
    const baseRender = Telemetry.prototype.render;
    Telemetry.prototype.render = function stagedTelemetryRender(snapshot) {
      const stage = Math.max(0, Math.min(3, Number(window.DODREI_STARTUP?.telemetryStage) || 0));
      if (stage <= 0) return;

      // Render the normal telemetry into three progressively revealed regions.
      // Stage 1: primary/left information, stage 2: parameters, stage 3: events.
      const ctx = drawingContext;
      if (!ctx || typeof ctx.save !== "function") return baseRender.call(this, snapshot);
      ctx.save();
      ctx.beginPath();
      if (stage === 1) {
        ctx.rect(0, 0, width, Math.max(1, height * 0.58));
      } else if (stage === 2) {
        ctx.rect(0, 0, width, Math.max(1, height * 0.84));
      } else {
        ctx.rect(0, 0, width, height);
      }
      ctx.clip();
      baseRender.call(this, snapshot);
      ctx.restore();
    };
  }
})();
