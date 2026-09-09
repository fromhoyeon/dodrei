/** DODREI — AUDIO MUTE / GLOBAL PLAYBACK PAUSE PATCH v1.0.29 */
(() => {
  const AudioEngine = window.P5LabAudioEngine;
  if (!AudioEngine || AudioEngine.prototype._dodreiMuteV109) return;

  const baseRequestPlay = AudioEngine.prototype.requestPlay;
  const baseRetryFromGesture = AudioEngine.prototype.retryFromGesture;
  const baseUpdate = AudioEngine.prototype.update;
  const baseSnapshot = AudioEngine.prototype.snapshot;

  AudioEngine.prototype._outputMuted = function _outputMuted() {
    return !!this.muted || !!this.playbackPaused;
  };

  AudioEngine.prototype._applyOutputMute = function _applyOutputMute() {
    const effective = this._outputMuted();
    if (this.nativeAudio) {
      try {
        this.nativeAudio.muted = effective;
        this.nativeAudio.defaultMuted = effective;
      } catch (_) {}
    }
    if (effective && this.fxActive && this.fxCtx) {
      const now = this.fxCtx.currentTime;
      try {
        this.fxDirectGain?.gain?.setTargetAtTime(0, now, 0.015);
        this.fxDelayGain?.gain?.setTargetAtTime(0, now, 0.015);
      } catch (_) {}
    }
    return effective;
  };

  AudioEngine.prototype.setMuted = function setMuted(muted) {
    this.muted = !!muted;
    this._applyOutputMute();
    if (this.telemetry?.event) this.telemetry.event(`AUDIO MUTE ${this.muted ? "ON" : "OFF"}`);
    return this.muted;
  };

  AudioEngine.prototype.isMuted = function isMuted() {
    return !!this.muted;
  };

  AudioEngine.prototype.setPlaybackPaused = function setPlaybackPaused(paused) {
    const next = !!paused;
    if (this.playbackPaused === next) return next;
    this.playbackPaused = next;

    if (next) {
      if (this.nativeAudio && !this.nativeAudio.paused) {
        try { this.nativeAudio.pause(); } catch (_) {}
      }
      if (this.fxCtx && this.fxCtx.state === "running") {
        try {
          const result = this.fxCtx.suspend();
          if (result?.catch) result.catch(() => {});
        } catch (_) {}
      }
      this.playState = "PAUSED";
    } else if (this.started) {
      if (this.nativeAudio?.paused) this.requestPlay("RUNTIME_RESUME");
      if (this.fxCtx && this.fxCtx.state === "suspended") {
        try {
          const result = this.fxCtx.resume();
          if (result?.catch) result.catch(() => {});
        } catch (_) {}
      }
    }

    this._applyOutputMute();
    if (this.telemetry?.event) this.telemetry.event(`AUDIO PLAYBACK ${next ? "PAUSED" : "RESUMED"}`);
    return next;
  };

  AudioEngine.prototype.requestPlay = function requestPlayV109(reason) {
    if (this.playbackPaused) {
      this._applyOutputMute();
      return Promise.resolve();
    }
    const result = baseRequestPlay.call(this, reason);
    this._applyOutputMute();
    return result;
  };

  AudioEngine.prototype.retryFromGesture = function retryFromGestureV109() {
    if (this.playbackPaused) return;
    return baseRetryFromGesture.call(this);
  };

  AudioEngine.prototype.update = function updateV109(analysis, interaction) {
    const data = baseUpdate.call(this, analysis, interaction);
    this._applyOutputMute();
    return data;
  };

  AudioEngine.prototype.snapshot = function snapshotV109() {
    return {
      ...baseSnapshot.call(this),
      muted: !!this.muted,
      playbackPaused: !!this.playbackPaused,
      outputMuted: this._outputMuted(),
    };
  };

  AudioEngine.prototype._dodreiMuteV105 = true;
  AudioEngine.prototype._dodreiMuteV108 = true;
  AudioEngine.prototype._dodreiMuteV109 = true;
})();
