export default function Animations({
  systems,
  activeTab,
  setActiveTab,
  paramState,
  handleInputChange,
  handlePlay,
  isFetching,
  fetchError,
  evolutionData,
  dpCanvasRef,
  tpCanvasRef,
  toneControls,
  setToneControls,
  audioReady,
  isPaused,
  onPauseToggle,
  onDownloadMusic,
}) {
  const activeSystem = systems.find((s) => s.key === activeTab) ?? systems[0];

  return (
    <section className="panel active" id="animations" aria-label="Physics animations and sound">
      <div className="section-head">
        <h3>Physics Animations &amp; Sound</h3>
        <span className="badge">Interactive</span>
      </div>
      <p className="section-subhead">
        Tune parameters, and map motion to tone.
      </p>

      <div className="tabs" role="tablist">
        {systems.map((system) => (
          <button
            key={system.key}
            className={`tab ${activeTab === system.key ? "active" : ""}`}
            data-tab={system.key}
            role="tab"
            type="button"
            onClick={() => setActiveTab(system.key)}
          >
            {system.name}
          </button>
        ))}
      </div>

      {systems.map((system) => {
        const isActive = activeTab === system.key;
        const isSystemLive = evolutionData?.system === system.key;
        return (
          <section
            key={system.key}
            className={`panel ${isActive ? "active" : ""}`}
            role="tabpanel"
            aria-hidden={!isActive}
          >
            <div className="section-head">
              <h3>{system.description}</h3>
              <span className="badge">{system.tag}</span>
            </div>
            <div className="param-grid">
              {system.params.map((param) => (
                <label key={param.key} className="param">
                  <span className="param-name">
                    <span className="latex">{`\\(${param.label}\\)`}</span>{" "}
                    <span className="plain-label">{param.readableLabel}</span>
                  </span>
                  <input
                    type="number"
                    step={param.step ?? "any"}
                    value={paramState[system.key]?.[param.key] ?? ""}
                    onChange={(e) => handleInputChange(system.key, param.key, e.target.value)}
                  />
                  <span className="helper">{param.helper}</span>
                </label>
              ))}
            </div>
            <div className="play-row">
              <p className="note">{system.note}</p>
              <button className="play-btn" type="button" onClick={() => handlePlay(system.key)}>
                {system.key === "double-pendulum"
                  ? "Simulate Double"
                  : system.key === "triple-pendulum"
                  ? "Simulate Triple"
                  : "Play Music"}
              </button>
            </div>
            {system.key === "double-pendulum" && (
              <div className="viz-block">
                <div className="viz-head">
                  <div>
                    <div className="viz-title">Double Pendulum evolution</div>
                    <div className="viz-sub">Animates the system and plays the tones of its angles</div>
                  </div>
                  <div className="viz-status">
                    {isFetching && isActive ? "Fetching." : fetchError ? "Error" : isSystemLive ? "Live" : "Idle"}
                  </div>
                  <div className="viz-actions">
                    <button className="play-btn ghost" type="button" onClick={onPauseToggle}>
                      {isPaused ? "Resume" : "Pause"}
                    </button>
                    <button
                      className="play-btn ghost"
                      type="button"
                      disabled={!isSystemLive || isFetching}
                      onClick={() => onDownloadMusic(system.key)}
                    >
                      Download music
                    </button>
                  </div>
                </div>
                <canvas ref={dpCanvasRef} className="pendulum-canvas" width={640} height={420} />
                <div className="tone-controls">
                  <div className="tone-column">
                    <div className="tone-label">$\theta_1$ tone</div>
                    <label>
                      Instrument
                      <select
                        className="tone-select"
                        value={toneControls.th1.instrument}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th1: { ...prev.th1, instrument: e.target.value },
                          }))
                        }
                      >
                        <option value="piano">Piano</option>
                        <option value="guitar">Guitar</option>
                        <option value="flute">Flute</option>
                        <option value="organ">Organ</option>
                        <option value="strings">Strings</option>
                      </select>
                    </label>
                    <label>
                      Base: {toneControls.th1.base.toFixed(0)} Hz
                      <input
                        type="range"
                        min="60"
                        max="1000"
                        step="1"
                        value={toneControls.th1.base}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th1: { ...prev.th1, base: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Scale: {toneControls.th1.scale.toFixed(0)} Hz/rad
                      <input
                        type="range"
                        min="10"
                        max="300"
                        step="1"
                        value={toneControls.th1.scale}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th1: { ...prev.th1, scale: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Velocity gain: {toneControls.th1.vel.toFixed(2)}x
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.05"
                        value={toneControls.th1.vel}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th1: { ...prev.th1, vel: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className="tone-column">
                    <div className="tone-label">$\theta_2$ tone</div>
                    <label>
                      Instrument
                      <select
                        className="tone-select"
                        value={toneControls.th2.instrument}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th2: { ...prev.th2, instrument: e.target.value },
                          }))
                        }
                      >
                        <option value="piano">Piano</option>
                        <option value="guitar">Guitar</option>
                        <option value="flute">Flute</option>
                        <option value="organ">Organ</option>
                        <option value="strings">Strings</option>
                      </select>
                    </label>
                    <label>
                      Base: {toneControls.th2.base.toFixed(0)} Hz
                      <input
                        type="range"
                        min="60"
                        max="1000"
                        step="1"
                        value={toneControls.th2.base}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th2: { ...prev.th2, base: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Scale: {toneControls.th2.scale.toFixed(0)} Hz/rad
                      <input
                        type="range"
                        min="10"
                        max="300"
                        step="1"
                        value={toneControls.th2.scale}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th2: { ...prev.th2, scale: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Velocity gain: {toneControls.th2.vel.toFixed(2)}x
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.05"
                        value={toneControls.th2.vel}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th2: { ...prev.th2, vel: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
                {fetchError && <div className="error">{fetchError}</div>}
                {!fetchError && isSystemLive && (
                  <div className="meta">
                    <span>Frames: {evolutionData.meta?.count ?? evolutionData.theta1.length}</span>
                    <span>dt: {(evolutionData.meta?.dt ?? 0.02).toFixed(3)} s</span>
                    <span>T: {(evolutionData.meta?.t_max ?? 0).toFixed(1)} s</span>
                  </div>
                )}
                {!fetchError && !isSystemLive && !isFetching && (
                  <div className="hint">Tap "Simulate Double" to sense the beauty of physics.</div>
                )}
              </div>
            )}
            {system.key === "triple-pendulum" && (
              <div className="viz-block">
                <div className="viz-head">
                  <div>
                    <div className="viz-title">Triple Pendulum Evolution</div>
                    <div className="viz-sub">Animates the system and plays the tones of its angles</div>
                  </div>
                  <div className="viz-status">
                    {isFetching && isActive ? "Fetching." : fetchError ? "Error" : isSystemLive ? "Live" : "Idle"}
                  </div>
                  <div className="viz-actions">
                    <button className="play-btn ghost" type="button" onClick={onPauseToggle}>
                      {isPaused ? "Resume" : "Pause"}
                    </button>
                    <button
                      className="play-btn ghost"
                      type="button"
                      disabled={!isSystemLive || isFetching}
                      onClick={() => onDownloadMusic(system.key)}
                    >
                      Download music
                    </button>
                  </div>
                </div>
                <canvas ref={tpCanvasRef} className="pendulum-canvas" width={640} height={420} />
                <div className="tone-controls">
                  <div className="tone-column">
                    <div className="tone-label">$\theta_1$ tone</div>
                    <label>
                      Instrument
                      <select
                        className="tone-select"
                        value={toneControls.th1.instrument}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th1: { ...prev.th1, instrument: e.target.value },
                          }))
                        }
                      >
                        <option value="piano">Piano</option>
                        <option value="guitar">Guitar</option>
                        <option value="flute">Flute</option>
                        <option value="organ">Organ</option>
                        <option value="strings">Strings</option>
                      </select>
                    </label>
                    <label>
                      Base: {toneControls.th1.base.toFixed(0)} Hz
                      <input
                        type="range"
                        min="60"
                        max="1000"
                        step="1"
                        value={toneControls.th1.base}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th1: { ...prev.th1, base: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Scale: {toneControls.th1.scale.toFixed(0)} Hz/rad
                      <input
                        type="range"
                        min="10"
                        max="300"
                        step="1"
                        value={toneControls.th1.scale}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th1: { ...prev.th1, scale: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Velocity gain: {toneControls.th1.vel.toFixed(2)}x
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.05"
                        value={toneControls.th1.vel}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th1: { ...prev.th1, vel: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className="tone-column">
                    <div className="tone-label">$\theta_2$ tone</div>
                    <label>
                      Instrument
                      <select
                        className="tone-select"
                        value={toneControls.th2.instrument}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th2: { ...prev.th2, instrument: e.target.value },
                          }))
                        }
                      >
                        <option value="piano">Piano</option>
                        <option value="guitar">Guitar</option>
                        <option value="flute">Flute</option>
                        <option value="organ">Organ</option>
                        <option value="strings">Strings</option>
                      </select>
                    </label>
                    <label>
                      Base: {toneControls.th2.base.toFixed(0)} Hz
                      <input
                        type="range"
                        min="60"
                        max="1000"
                        step="1"
                        value={toneControls.th2.base}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th2: { ...prev.th2, base: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Scale: {toneControls.th2.scale.toFixed(0)} Hz/rad
                      <input
                        type="range"
                        min="10"
                        max="300"
                        step="1"
                        value={toneControls.th2.scale}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th2: { ...prev.th2, scale: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Velocity gain: {toneControls.th2.vel.toFixed(2)}x
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.05"
                        value={toneControls.th2.vel}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th2: { ...prev.th2, vel: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className="tone-column">
                    <div className="tone-label">$\theta_3$ tone</div>
                    <label>
                      Instrument
                      <select
                        className="tone-select"
                        value={toneControls.th3.instrument}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th3: { ...prev.th3, instrument: e.target.value },
                          }))
                        }
                      >
                        <option value="piano">Piano</option>
                        <option value="guitar">Guitar</option>
                        <option value="flute">Flute</option>
                        <option value="organ">Organ</option>
                        <option value="strings">Strings</option>
                      </select>
                    </label>
                    <label>
                      Base: {toneControls.th3.base.toFixed(0)} Hz
                      <input
                        type="range"
                        min="60"
                        max="1000"
                        step="1"
                        value={toneControls.th3.base}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th3: { ...prev.th3, base: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Scale: {toneControls.th3.scale.toFixed(0)} Hz/rad
                      <input
                        type="range"
                        min="10"
                        max="300"
                        step="1"
                        value={toneControls.th3.scale}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th3: { ...prev.th3, scale: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      Velocity gain: {toneControls.th3.vel.toFixed(2)}x
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.05"
                        value={toneControls.th3.vel}
                        onChange={(e) =>
                          setToneControls((prev) => ({
                            ...prev,
                            th3: { ...prev.th3, vel: Number(e.target.value) },
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
                {fetchError && <div className="error">{fetchError}</div>}
                {!fetchError && isSystemLive && (
                  <div className="meta">
                    <span>Frames: {evolutionData.meta?.count ?? evolutionData.theta1.length}</span>
                    <span>dt: {(evolutionData.meta?.dt ?? 0.02).toFixed(3)} s</span>
                    <span>T: {(evolutionData.meta?.t_max ?? 0).toFixed(1)} s</span>
                  </div>
                )}
                {!fetchError && !isSystemLive && !isFetching && (
                  <div className="hint">Tap "Simulate Triple" to view and hear the beauty of physics.</div>
                )}
              </div>
            )}
          </section>
        );
      })}
    </section>
  );
}
