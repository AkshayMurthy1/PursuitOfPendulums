import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

const defaultInputs = {
  dxdt: "sin(x) - cos(y)",
  dydt: "sin(y) - cos(x)",
  d2xdt2: "0",
  d2ydt2: "0",
  x1: 0,
  y1: 0,
  x2: 1,
  y2: 1,
  res: 160,
  t: 10,
  scheme: "ember",
};

export default function Fractals() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [grid, setGrid] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const colorMap = useMemo(() => {
    const maps = {
      ember: (v) => [v, Math.floor(v * 0.55), Math.floor(v * 0.25)],
      aurora: (v) => [Math.floor(v * 0.2), Math.floor(v * 0.9), Math.floor(v * 0.7)],
      frost: (v) => [Math.floor(v * 0.35), Math.floor(v * 0.55), v],
      mono: (v) => [v, v, v],
      neon: (v) => [v, Math.floor(v * 0.15), Math.floor(255 - v * 0.5)],
    };
    return maps[inputs.scheme] ?? maps.ember;
  }, [inputs.scheme]);

  const gridStats = useMemo(() => {
    if (!grid?.length) return null;
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < grid.length; i += 1) {
      const row = grid[i];
      for (let j = 0; j < row.length; j += 1) {
        const val = row[j];
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }
    return { min, max, size: grid.length };
  }, [grid]);

  useEffect(() => {
    if (!grid || !grid.length) return;
    const size = grid.length;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    const min = gridStats?.min ?? 0;
    const max = gridStats?.max ?? 1;
    const span = max - min || 1;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        // Flip Y so (0,0) is bottom-left.
        const val = grid[x][size - 1 - y];
        const norm = (val - min) / span;
        const shade = Math.max(0, Math.min(255, Math.round(norm * 255)));
        const idx = (y * size + x) * 4;
        const [r, g, b] = colorMap(shade);
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [grid, gridStats]);

  const handleChange = (key, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setError("");
    setGrid(null);

    const payload = {
      dxdt: String(inputs.dxdt ?? ""),
      dydt: String(inputs.dydt ?? ""),
      d2xdt2: String(inputs.d2xdt2 ?? ""),
      d2ydt2: String(inputs.d2ydt2 ?? ""),
      x1: Number(inputs.x1),
      y1: Number(inputs.y1),
      x2: Number(inputs.x2),
      y2: Number(inputs.y2),
      res: Math.max(8, Math.floor(Number(inputs.res))),
      t: Math.max(0.1, Number(inputs.t)),
    };

    try {
      const res = await fetch(`${API_BASE}/api/make_fractal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let message = `Backend error: ${res.status} ${res.statusText}`;
        try {
          const errBody = await res.json();
          if (errBody?.error) {
            message = errBody.details ? `${errBody.error} ${errBody.details}` : errBody.error;
          }
        } catch (parseErr) {
          // Ignore JSON parsing failures and keep fallback message.
        }
        throw new Error(message);
      }
      const data = await res.json();
      setGrid(data.grid ?? []);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err?.message ?? "Failed to generate fractal.");
    }
  };

  return (
    <section className="panel active" id="fractals" aria-label="Fractal lab">
      <div className="section-head">
        <h3>Fractal Lab</h3>
        <span className="badge">Live</span>
      </div>
      <p className="section-subhead">
        Define the dynamical system and bounds, then render the 2D intensity field.
      </p>
      <div className="note">
        Quick syntax tips: use Python-style math. `sin(x)`, `cos(y)`, `exp(x)`, `sqrt(x)`, `abs(x)`.
        Powers use `**` (so `x**2`, not `x^2`). Use `pi` for π. Available symbols are `x`, `y`,
        `dxdt`, `dydt`, and `t`, don't use anything else. Example: `d2x/dt2 = -0.2*dxdt - x + x**3 + 0.3*cos(1.2*t)`.
      </div>

      <form className="fractal-form" onSubmit={handleSubmit}>
        <div className="param-grid">
          <label className="param">
            <span className="param-name">dx/dt</span>
            <input
              type="text"
              value={inputs.dxdt}
              onChange={(e) => handleChange("dxdt", e.target.value)}
            />
            <span className="helper">Use x, y, dxdt, dydt, t. Example: sin(x) - cos(y)</span>
          </label>
          <label className="param">
            <span className="param-name">dy/dt</span>
            <input
              type="text"
              value={inputs.dydt}
              onChange={(e) => handleChange("dydt", e.target.value)}
            />
            <span className="helper">Example: sin(y) - cos(x)</span>
          </label>
          <label className="param">
            <span className="param-name">d2x/dt2</span>
            <input
              type="text"
              value={inputs.d2xdt2}
              onChange={(e) => handleChange("d2xdt2", e.target.value)}
            />
            <span className="helper">Second derivative term (optional)</span>
          </label>
          <label className="param">
            <span className="param-name">d2y/dt2</span>
            <input
              type="text"
              value={inputs.d2ydt2}
              onChange={(e) => handleChange("d2ydt2", e.target.value)}
            />
            <span className="helper">Second derivative term (optional)</span>
          </label>
        </div>

        <div className="param-grid">
          <label className="param">
            <span className="param-name">x1</span>
            <input
              type="number"
              value={inputs.x1}
              step="0.1"
              onChange={(e) => handleChange("x1", e.target.value)}
            />
          </label>
          <label className="param">
            <span className="param-name">y1</span>
            <input
              type="number"
              value={inputs.y1}
              step="0.1"
              onChange={(e) => handleChange("y1", e.target.value)}
            />
          </label>
          <label className="param">
            <span className="param-name">x2</span>
            <input
              type="number"
              value={inputs.x2}
              step="0.1"
              onChange={(e) => handleChange("x2", e.target.value)}
            />
          </label>
          <label className="param">
            <span className="param-name">y2</span>
            <input
              type="number"
              value={inputs.y2}
              step="0.1"
              onChange={(e) => handleChange("y2", e.target.value)}
            />
          </label>
          <label className="param">
            <span className="param-name">Resolution</span>
            <input
              type="number"
              value={inputs.res}
              step="1"
              min="8"
              onChange={(e) => handleChange("res", e.target.value)}
            />
            <span className="helper">NxN grid</span>
          </label>
          <label className="param">
            <span className="param-name">T</span>
            <input
              type="number"
              value={inputs.t}
              step="0.1"
              onChange={(e) => handleChange("t", e.target.value)}
            />
            <span className="helper">Integration time</span>
          </label>
          <label className="param">
            <span className="param-name">Color scheme</span>
            <select
              className="tone-select"
              value={inputs.scheme}
              onChange={(e) => handleChange("scheme", e.target.value)}
            >
              <option value="ember">Ember</option>
              <option value="aurora">Aurora</option>
              <option value="frost">Frost</option>
              <option value="neon">Neon</option>
              <option value="mono">Monochrome</option>
            </select>
            <span className="helper">Applies to render output</span>
          </label>
        </div>

        <div className="play-row">
          <p className="note">Large resolutions can take time to compute.</p>
          <button className="play-btn" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Rendering..." : "Generate fractal"}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="viz-block">
        <div className="viz-head">
          <div>
            <div className="viz-title">Output</div>
            <div className="viz-sub">
              {gridStats ? `Grid ${gridStats.size}x${gridStats.size}` : "Awaiting render"}
            </div>
          </div>
          {gridStats && (
            <div className="meta">
              <span>min {gridStats.min.toFixed(3)}</span>
              <span>max {gridStats.max.toFixed(3)}</span>
            </div>
          )}
        </div>
        <div className="fractal-output">
          {grid ? (
            <canvas ref={canvasRef} className="fractal-canvas" />
          ) : (
            <div className="hint">Submit a system to visualize the grid.</div>
          )}
        </div>
      </div>
    </section>
  );
}
