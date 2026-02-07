import { useEffect, useRef, useState } from "react";
import fractalA from "../imgs/dp_solo.png";
import fractalD from "../imgs/!DoublePendulumFractal.jpg";
import fractalB from "../imgs/triple_pendulum_fractal_2_cropped.png";
import fractalC from "../imgs/triple_pendulum_fractal_3_cropped.png";
import fractalE1 from "../imgs/eq5_cropped.png";
import fractalE2 from "../imgs/eq5_2pi2pi.png";
import fractalE3 from "../imgs/eq5_4pi4pi.png";
import fractalE4 from "../imgs/eq5_16pi16pi.png";
import fractalF1 from "../imgs/200x200eq5b.png";
import fractalF2 from "../imgs/200x200eq5bWOW.png";
import fractalF3 from "../imgs/200x200eq5b_4pi.png";
import fractalF4 from "../imgs/200x200eq5b_16pi.png";

//TODO implement all these fractal images into the gallery by appending them to the galleryPieces array. they are from the lorenz attractor, chua DEs, rossler system, and duffing system. please put their equations in the author. 
import LorenzFracA from "../imgs/200x200_lorenz_15_square_z=2.png"
import LorenzFracB from "../imgs/200x200_lorenz_30_square_z=2.png"
import ChuaFracA from "../imgs/240x240_blur_chua.png"
import ChuaFracB from "../imgs/240x240_blur_chua3030.png"
import RossFrac from "../imgs/240x240_rossler_30_z=10.png"
import DuffFrac from "../imgs/240x240_blur_duff_sigma=.2.png"




import Gallery from "./Gallery.jsx";
import Animations from "./Animations.jsx";
import Fractals from "./Fractals.jsx";

const sections = [
  { key: "gallery", label: "Gallery", blurb: "Physics and Math Visualizations" },
  { key: "animations", label: "Animations", blurb: "Interactive physics-driven sound lab" },
  { key: "fractals", label: "Fractal Lab", blurb: "Create your own art!" },
];

const galleryPieces = [
  {
    title: "Lovely Lorenz Pt. 1",
    image: LorenzFracA,
    text: "Artist: $\\frac{dx}{dt} = \\sigma (y-x), \\frac{dy}{dt} = x(\\rho - z) - y, \\frac{dz}{dt} = xy - \\beta z$",
    details: "A chaos visualization of the Lorenz Attractor using Lyapunov Exponents! Used $\\sigma = 10,\\rho=28,\\beta = 8/3$. Plotted $x \\in (-15,15), y\\in (-15,15)$, and $z_0=15$ was used for the initial condition of $z$."
  },
  {
    title: "Lovely Lorenz Pt. 2",
    image: LorenzFracB,
    text: "Artist: $\\frac{dx}{dt} = \\sigma (y-x), \\frac{dy}{dt} = x(\\rho - z) - y, \\frac{dz}{dt} = xy - \\beta z$",
    details: "Same Lorenz system except zoomed out!. Plotted $x \\in (-30,30), y\\in (-30,30)$."
  },
  {
    title: "Chua Catastrophe Pt. 1",
    image: ChuaFracA,
    text: "Artist: $\\frac{dx}{dt} = \\alpha (y - x - f(x)), \\frac{dy}{dt} = x - y + z, \\frac{dz}{dt} = -\\beta y,\\ f(x)=m_1 x + \\tfrac{1}{2}(m_0 - m_1)(|x+1|-|x-1|)$",
    details: "Lyapunov Exponent chaos visualization (with a bit of blur) of the Chua circuit. Used $\\alpha=15.6,\\beta=28, f(x) = m_1x+\\frac{1}{2}(m_0-m_1)(|x+1|-|x-1|), m_0 = -1.143, m_1 = -0.714$. Plotted $x \\in (-15,15), y\\in (-15,15)$"
  },
  {
    title: "Chua Catastrophe Pt. 2",
    image: ChuaFracB,
    text: "Artist: $\\frac{dx}{dt} = \\alpha (y - x - f(x)), \\frac{dy}{dt} = x - y + z, \\frac{dz}{dt} = -\\beta y,\\ f(x)=m_1 x + \\tfrac{1}{2}(m_0 - m_1)(|x+1|-|x-1|)$",
    details: "Alternate view of the same Chua dynamics on a larger grid! Plotted $x \\in (-30,30), y\\in (-30,30)$"
  },
  {
    title: "Rössler-Branded Taffy",
    image: RossFrac,
    text: "Artist: $\\frac{dx}{dt} = -y - z, \\frac{dy}{dt} = x + a y, \\frac{dz}{dt} = b + z(x - c)$",
    details: "Rössler system chaos intensity across initial conditions.Used $a=-.2,b=0.2,c=5.7,z_0=10$. Plotted $x \\in (-30,30), y\\in (-30,30)$"
  },
  {
    title: "Duffing Explosion",
    image: DuffFrac,
    text: "Artist: $\\frac{d^2x}{dt^2} + \\delta \\frac{dx}{dt} - x + x^3 = \\gamma \\cos(\\omega t)$",
    details: "Forced Duffing oscillator chaos visualization. Used $\\delta =0.2,\\gamma=0.2,\\omega=1.2$. Plotted $x \\in (-30,30), y\\in (-30,30)$!"
  },


  { 
    title: "Second-Order Emblem Pt. 1",
    image: fractalF1,
    text: "Artist: $\\frac{d^2x}{dt^2} = \\text{sin}(x) - \\text{cos}(y), \\frac{d^2y}{dt^2} = \\text{sin}(y) - \\text{cos}(x)$",
    details: "This is an intensity visualization of the above Ordinary Differential Equation (ODE), stretching from $x \\in (0,1)$ and $y \\in (0,1)$. I used the same intensity quantification method as in 'Symmetrically Asymmetric Chaos'"

  },
  { 
    title: "Second-Order Emblem Pt. 3",
    image: fractalF2,
    text: "Artist: $\\frac{d^2x}{dt^2} = \\text{sin}(x) - \\text{cos}(y), \\frac{d^2y}{dt^2} = \\text{sin}(y) - \\text{cos}(x)$",
    details: "Let's scale back to $x \\in (0,2\\pi)$ and $y \\in (0,2\\pi)$!"

  },
  { 
    title: "Second-Order Emblem Pt. 3",
    image: fractalF3,
    text: "Artist: $\\frac{d^2x}{dt^2} = \\text{sin}(x) - \\text{cos}(y), \\frac{d^2y}{dt^2} = \\text{sin}(y) - \\text{cos}(x)$",
    details: "Same intensity visualization, but zoomed out now from $x \\in (0,4\\pi)$ and $y \\in (0,4\\pi)$!"

  },
  { 
    title: "Second-Order Emblem Pt. 4",
    image: fractalF4,
    text: "Artist: $\\frac{d^2x}{dt^2} = \\text{sin}(x) - \\text{cos}(y), \\frac{d^2y}{dt^2} = \\text{sin}(y) - \\text{cos}(x)$",
    details: "This is an intensity visualization of the above Ordinary Differential Equation (ODE), stretching from $x \\in (0,16\\pi)$ and $y \\in (0,16\\pi)$"

  },  

  { 
    title: "Symmetrically Asymmetric Chaos Pt. 1",
    image: fractalE1,
    text: "Artist: $\\frac{dx}{dt} = \\text{sin}(x) - \\text{cos}(y), \\frac{dy}{dt} = \\text{sin}(y) - \\text{cos}(x)$",
    details: "This is an intensity visualization of the above Ordinary Differential Equation (ODE), stretching from $x \\in (0,1)$ and $y \\in (0,1)$. It basically sums up a quantity for chaos and intensity (how large does the system get), at each initial starting point $x_0,y_0$ in the grid.$"

  },
  { 
    title: "Symmetrically Asymmetric Chaos Pt. 2",
    image: fractalE2,
    text: "Artist: $\\frac{dx}{dt} = \\text{sin}(x) - \\text{cos}(y), \\frac{dy}{dt} = \\text{sin}(y) - \\text{cos}(x)$",
    details: "This is a more zoomed out intensity visualization that stretches from $x \\in (0,2\\pi)$ and $y \\in (0,2\\pi)$"

  },
  { 
    title: "Symmetrically Asymmetric Chaos Pt. 3",
    image: fractalE3,
    text: "Artist: $\\frac{dx}{dt} = \\text{sin}(x) - \\text{cos}(y), \\frac{dy}{dt} = \\text{sin}(y) - \\text{cos}(x)$",
    details: "This is a more zoomed out intensity visualization that stretches from $x \\in (0,4\\pi)$ and $y \\in (0,4\\pi)$"

  },
  { 
    title: "Symmetrically Asymmetric Chaos Pt. 4",
    image: fractalE4,
    text: "Artist: $\\frac{dx}{dt} = \\text{sin}(x) - \\text{cos}(y), \\frac{dy}{dt} = \\text{sin}(y) - \\text{cos}(x)$",
    details: "Zoom out to $x \\in (0,16\\pi)$ and $y \\in (0,16\\pi)$, and you get this!"

  },
  {
    title: "Balance of Chaos",
    image: fractalA,
    text: "Artist: Double Pendulum",
    details: "Mapped initial angle configurations on each axis for each of the angles of the double pendulum, with $\\theta_1,\\theta_2 \\in [0,2\\pi]$. Value at a pixel is proportional to $(\\vec{E}(\\theta_1,\\theta_2)-\\vec{E}(\\theta_1 + \\epsilon,\\theta_2+ \\epsilon))^2$, where $\\vec{E}(\\theta_1,\\theta_2)$ is the evolution vector for an initial state. This piece essentially represents the chaoticity of the double pendulum in its full extent.",
  },
  {
    title: "Triad of Chaos",
    image: fractalB,
    text: "Artist: Triple Pendulum",
    details: "Plotted the first two angles on each of the axes again, where $\\theta_1,\\theta_2 \\in [0,2\\pi]$ Used the same concept of taking the L2 norm between evolution vectors to track divergence; except now there is a third bob that is also perturbed a slight amount: Each pixel is proportional in hue to $(\\vec{E}(\\theta_1,\\theta_2,\\theta_3)-\\vec{E}(\\theta_1 + \\epsilon,\\theta_2+ \\epsilon,\\theta_3+ \\epsilon)^2$. I apologize for the low-resolution; it takes forever to simulate the gigantic ODEs that govern the triple pendulum to which my small laptop is at mercy to.",
  },
  {
    title: "Patternal Divergence",
    image: fractalC,
    text: "Artist: Triple Pendulum",
    details: "For this piece, only one solution of the triple pendulum was obtained (and therefore it is very high resolution!), $\\hat{\\vec{u}}(t)$ which basically indexes $\\vec{E}(\\frac{\\pi}{2},\\frac{\\pi}{2},\\frac{\\pi}{2})$. I also created a very loose \"approximate\" sinusoidal solution based on treating the system as a rigid single pendulum, $\\vec{u}(t)$. Then, having $t_1,t_2$ span the x and y axes, each pixel was proportional in hue to $(\\hat{\\vec{u}}(t)-\\vec{u}(t))^2$.",
  },
  { 
    title: "The Wonderful Chaos of RISE",
    image: fractalD,
    text: "Artist: Double Pendulum",
    details: "I varied the domain of the Balance of Chaos to $[-\\pi,\\pi]$, and used different color representations as well as blurs to combine many visualizations to create this piece."

  },

    
];

const defaults = [
  { key: "T", label: "T", helper: "s", step: 0.1, defaultValue: 10 },
  { key: "dt", label: "dt", step: 0.1, defaultValue: 0.02 },
];

const systems = [
  {
    key: "double-pendulum",
    name: "Double Pendulum",
    tag: "Stateful",
    description: "Chaotic double pendulum",
    note: "Pass these values and map chaotic motion to sound.",
    params: [
      { key: "m1", label: "m_1", helper: "kg", step: 0.1, defaultValue: 1 },
      { key: "m2", label: "m_2", helper: "kg", step: 0.1, defaultValue: 1 },
      { key: "g", label: "g", helper: "m/s^2", step: 0.1, defaultValue: 9.81 },
      { key: "l1", label: "\\ell_1", helper: "meters", step: 0.1, defaultValue: 1 },
      { key: "l2", label: "\\ell_2", helper: "meters", step: 0.1, defaultValue: 1 },
      { key: "theta1", label: "\\theta_1", helper: "radians", step: 0.01, defaultValue: 1.2 },
      { key: "theta2", label: "\\theta_2", helper: "radians", step: 0.01, defaultValue: -0.4 },
      { key: "theta1_dot", label: "\\dot{\\theta}_1", helper: "rad/s", step: 0.01, defaultValue: 0 },
      { key: "theta2_dot", label: "\\dot{\\theta}_2", helper: "rad/s", step: 0.01, defaultValue: 0 },
    ].concat(defaults),
  },
  {
    key: "triple-pendulum",
    name: "Triple Pendulum",
    tag: "Chaotic",
    description: "Chaotic triple pendulum",
    note: "Pass these values and map chaotic motion to sound.",
    params: [
      { key: "m1", label: "m_1", helper: "kg", step: 0.1, defaultValue: 1 },
      { key: "m2", label: "m_2", helper: "kg", step: 0.1, defaultValue: 1 },
      { key: "m3", label: "m_3", helper: "kg", step: 0.1, defaultValue: 1 },
      { key: "g", label: "g", helper: "m/s^2", step: 0.1, defaultValue: 9.81 },
      { key: "l1", label: "\\ell_1", helper: "meters", step: 0.1, defaultValue: 1 },
      { key: "l2", label: "\\ell_2", helper: "meters", step: 0.1, defaultValue: 1 },
      { key: "l3", label: "\\ell_3", helper: "meters", step: 0.1, defaultValue: 1 },
      { key: "theta1", label: "\\theta_1", helper: "radians", step: 0.01, defaultValue: 1.0 },
      { key: "theta2", label: "\\theta_2", helper: "radians", step: 0.01, defaultValue: 0.6 },
      { key: "theta3", label: "\\theta_3", helper: "radians", step: 0.01, defaultValue: -0.4 },
      { key: "theta1_dot", label: "\\dot{\\theta}_1", helper: "rad/s", step: 0.01, defaultValue: 0 },
      { key: "theta2_dot", label: "\\dot{\\theta}_2", helper: "rad/s", step: 0.01, defaultValue: 0 },
      { key: "theta3_dot", label: "\\dot{\\theta}_3", helper: "rad/s", step: 0.01, defaultValue: 0 },
    ].concat(defaults),
  },
  // {
  //   key: "harmonic-oscillator",
  //   name: "Harmonic Oscillator",
  //   tag: "Linear",
  //   description: "Driven harmonic oscillator",
  //   note: "Use these to sculpt a resonant tone or percussive decay.",
  //   params: [
  //     { key: "mass", label: "m", helper: "kg", step: 0.1, defaultValue: 1 },
  //     { key: "k", label: "k", helper: "N/m", step: 0.1, defaultValue: 20 },
  //     { key: "c", label: "c", helper: "N*s/m", step: 0.05, defaultValue: 0.4 },
  //     { key: "x0", label: "x_0", helper: "meters", step: 0.01, defaultValue: 0.2 },
  //     { key: "v0", label: "v_0", helper: "m/s", step: 0.01, defaultValue: 0 },
  //     { key: "drive", label: "F_0", helper: "N", step: 0.1, defaultValue: 1 },
  //     { key: "omega_d", label: "\\omega_d", helper: "rad/s", step: 0.1, defaultValue: 2.5 },
  //   ],
  // },
  // {
  //   key: "string-resonator",
  //   name: "String Resonator",
  //   tag: "Modal",
  //   description: "1D string resonator",
  //   note: "Map modal weights to partials or sample grains.",
  //   params: [
  //     { key: "tension", label: "T", helper: "N", step: 0.1, defaultValue: 65 },
  //     { key: "mu", label: "\\mu", helper: "kg/m", step: 0.001, defaultValue: 0.003 },
  //     { key: "L", label: "L", helper: "meters", step: 0.01, defaultValue: 0.8 },
  //     { key: "x_pluck", label: "x_{pluck}", helper: "fraction of length", step: 0.01, defaultValue: 0.25 },
  //     { key: "amplitude", label: "A", helper: "meters", step: 0.01, defaultValue: 0.05 },
  //     { key: "modes", label: "N", helper: "harmonics", step: 1, defaultValue: 12 },
  //   ],
  // },
];

let mathJaxPromise;
const ensureMathJax = () => {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.MathJax) return Promise.resolve(window.MathJax);
  if (mathJaxPromise) return mathJaxPromise;
  // Configure MathJax to allow line breaking so long expressions wrap within cards/modals.
  window.MathJax = {
    tex: {
      inlineMath: [
        ["\\(", "\\)"],
        ["$", "$"],
      ],
      displayMath: [["\\[", "\\]"]],
      processEscapes: true,
    },
    chtml: {
      linebreaks: { automatic: true, width: "container" },
    },
    svg: {
      linebreaks: { automatic: true },
    },
  };
  const script = document.createElement("script");
  script.id = "mathjax-script";
  script.type = "text/javascript";
  script.async = true;
  script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  mathJaxPromise = new Promise((resolve) => {
    script.onload = () => resolve(window.MathJax);
    script.onerror = () => resolve(null);
  });
  document.head.appendChild(script);
  return mathJaxPromise;
};

const numberOrValue = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
};

const instrumentType = (name) => {
  switch (name) {
    case "guitar":
      return "triangle";
    case "flute":
      return "sine";
    case "organ":
      return "square";
    case "strings":
      return "sawtooth";
    case "piano":
    default:
      return "sine";
  }
};

let soundfontPromise;
const ensureSoundfont = () => {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.Soundfont) return Promise.resolve(window.Soundfont);
  if (soundfontPromise) return soundfontPromise;
  const script = document.createElement("script");
  script.id = "soundfont-player";
  script.async = true;
  script.src = "https://cdn.jsdelivr.net/npm/soundfont-player@0.15.7/dist/soundfont-player.js";
  soundfontPromise = new Promise((resolve) => {
    script.onload = () => resolve(window.Soundfont);
    script.onerror = () => resolve(null);
  });
  document.head.appendChild(script);
  return soundfontPromise;
};

const instrumentSoundfont = {
  piano: "acoustic_grand_piano",
  guitar: "acoustic_guitar_nylon",
  flute: "flute",
  organ: "drawbar_organ",
  strings: "string_ensemble_1",
};

const freqToMidi = (freq) => 69 + 12 * Math.log2(freq / 440);
const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

export default function App() {
  const [activeSection, setActiveSection] = useState("gallery");
  const [activeTab, setActiveTab] = useState(systems[0].key);
  const [paramState, setParamState] = useState(() => {
    const initial = {};
    systems.forEach((system) => {
      initial[system.key] = {};
      system.params.forEach((param) => {
        initial[system.key][param.key] = param.defaultValue ?? "";
      });
    });
    return initial;
  });
  const [evolutionData, setEvolutionData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [audioReady, setAudioReady] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const dpCanvasRef = useRef(null);
  const tpCanvasRef = useRef(null);
  const dpTrailRef = useRef([]);
  const tpTrailRef = useRef([]);
  const audioRef = useRef(null);
  const [toneControls, setToneControls] = useState({
    th1: { base: 240, scale: 90, instrument: "piano", vel: 1.0 },
    th2: { base: 360, scale: 110, instrument: "flute", vel: 1.0 },
    th3: { base: 480, scale: 120, instrument: "organ", vel: 1.0 },
  });
  const toneControlsRef = useRef(toneControls);
  const instrumentCacheRef = useRef({});
  const playersRef = useRef({ th1: null, th2: null, th3: null });
  const lastNoteRef = useRef({ th1: 0, th2: 0, th3: 0 });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    ensureMathJax().then((mj) => mj?.typesetPromise?.());
  }, [activeTab, activeSection, selectedPiece]);

  useEffect(() => {
    toneControlsRef.current = toneControls;
  }, [toneControls]);

  const ensureAudioEngine = () => {
    if (typeof window === "undefined") return null;
    if (!audioRef.current) {
      const ctx = new AudioContext();
      audioRef.current = { ctx };
    }
    if (audioRef.current?.ctx?.state === "suspended") {
      audioRef.current.ctx.resume();
    }
    if (audioRef.current?.ctx?.state === "running") {
      setAudioReady(true);
    }
    return audioRef.current;
  };

  useEffect(() => {
    let canceled = false;
    const makeFallbackPlayer = (ctx, inst) => {
      const wave = instrumentType(inst);
      return {
        play: (midi, when, opts = {}) => {
          const freq = midiToFreq(midi);
          const dur = opts.duration ?? 0.15;
          const gainVal = opts.gain ?? 0.08;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = wave;
          osc.frequency.value = freq;
          gain.gain.value = gainVal;
          osc.connect(gain).connect(ctx.destination);
          osc.start(when);
          gain.gain.setTargetAtTime(0.0001, when + dur * 0.6, 0.04);
          osc.stop(when + dur);
        },
      };
    };

    const loadPlayers = async () => {
      if (!audioReady) return;
      const audio = ensureAudioEngine();
      if (!audio) return;
      const sf = await ensureSoundfont();
      if (!sf) {
        const fallback1 = makeFallbackPlayer(audio.ctx, toneControlsRef.current.th1.instrument);
        const fallback2 = makeFallbackPlayer(audio.ctx, toneControlsRef.current.th2.instrument);
        const fallback3 = makeFallbackPlayer(audio.ctx, toneControlsRef.current.th3.instrument);
        if (!canceled) {
          playersRef.current = { th1: fallback1, th2: fallback2, th3: fallback3 };
        }
        return;
      }

      const loadInstrument = async (instName) => {
        const key = instrumentSoundfont[instName] ?? instrumentSoundfont.piano;
        if (instrumentCacheRef.current[key]) return instrumentCacheRef.current[key];
        const player = await sf.instrument(audio.ctx, key);
        instrumentCacheRef.current[key] = player;
        return player;
      };

      const [p1, p2, p3] = await Promise.all([
        loadInstrument(toneControlsRef.current.th1.instrument),
        loadInstrument(toneControlsRef.current.th2.instrument),
        loadInstrument(toneControlsRef.current.th3.instrument),
      ]);
      if (canceled) return;
      playersRef.current = { th1: p1, th2: p2, th3: p3 };
    };

    loadPlayers();
    return () => {
      canceled = true;
    };
  }, [toneControls, audioReady]);

  useEffect(() => {
    const unlock = () => ensureAudioEngine();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, [ensureAudioEngine]);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (sections.some((s) => s.key === hash)) {
        setActiveSection(hash);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const handleNavigate = (key) => {
    setActiveSection(key);
    window.location.hash = key;
  };

  const handlePauseToggle = () => {
    setIsPaused((prev) => !prev);
  };

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const renderAudioToWav = (data, controls) => {
    const dt = data.meta?.dt ?? 0.02;
    const duration = data.meta?.t_max ?? (data.t?.length ?? 0) * dt;
    const sampleRate = 44100;
    const samples = Math.max(1, Math.floor(duration * sampleRate));
    const buffer = new Float32Array(samples);

    const theta1 = data.theta1 ?? [];
    const theta2 = data.theta2 ?? [];
    const theta3 = data.theta3 ?? [];
    const theta1d = data.theta1d ?? [];
    const theta2d = data.theta2d ?? [];
    const theta3d = data.theta3d ?? [];

    const voices = [
      { angle: theta1, vel: theta1d, ctrl: controls.th1 },
      { angle: theta2, vel: theta2d, ctrl: controls.th2 },
    ];
    if (data.system === "triple-pendulum") {
      voices.push({ angle: theta3, vel: theta3d, ctrl: controls.th3 });
    }

    for (let i = 0; i < samples; i += 1) {
      const t = i / sampleRate;
      const idx = clamp(Math.floor(t / dt), 0, (theta1.length || 1) - 1);
      let v = 0;
      voices.forEach(({ angle, vel, ctrl }) => {
        if (!angle[idx] && angle[idx] !== 0) return;
        const freq = clamp(ctrl.base + angle[idx] * ctrl.scale, 20, 2000);
        const amp = clamp(0.04 + Math.abs(vel[idx] ?? 0) * ctrl.vel * 0.08, 0, 0.35);
        v += amp * Math.sin(2 * Math.PI * freq * t);
      });
      buffer[i] = clamp(v, -0.9, 0.9);
    }

    const wavBytes = samples * 2;
    const header = new ArrayBuffer(44 + wavBytes);
    const view = new DataView(header);
    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i += 1) view.setUint8(offset + i, str.charCodeAt(i));
    };
    writeString(0, "RIFF");
    view.setUint32(4, 36 + wavBytes, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits
    writeString(36, "data");
    view.setUint32(40, wavBytes, true);

    let offset = 44;
    for (let i = 0; i < samples; i += 1, offset += 2) {
      view.setInt16(offset, buffer[i] * 0x7fff, true);
    }
    return new Blob([header], { type: "audio/wav" });
  };

  const handleDownloadMusic = (systemKey) => {
    if (!evolutionData || evolutionData.system !== systemKey) {
      setFetchError("No simulation to export yet.");
      return;
    }
    try {
      const blob = renderAudioToWav(evolutionData, toneControlsRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${systemKey}-audio.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setFetchError(err?.message ?? "Failed to render audio");
    }
  };

  const handleInputChange = (systemKey, paramKey, value) => {
    setParamState((prev) => ({
      ...prev,
      [systemKey]: {
        ...prev[systemKey],
        [paramKey]: numberOrValue(value),
      },
    }));
  };

  const handlePlay = async (systemKey) => {
    const params = paramState[systemKey] ?? {};
    let endpoint = "";
    let payload = {};

    if (systemKey === "double-pendulum") {
      endpoint = `${API_BASE}/api/evolution_dp`;
      payload = {
        m1: params.m1 ?? 1,
        m2: params.m2 ?? 1,
        L1: params.l1 ?? 1,
        L2: params.l2 ?? 1,
        g: params.g ?? 9.81,
        theta1: params.theta1 ?? 1.2,
        theta2: params.theta2 ?? -0.4,
        theta1_dot: params.theta1_dot ?? 0,
        theta2_dot: params.theta2_dot ?? 0,
        t_max: params.T ?? 12,
        dt: params.dt ?? 0.02,
      };
    } else if (systemKey === "triple-pendulum") {
      endpoint = `${API_BASE}/api/evolution_tp`;
      payload = {
        m1: params.m1 ?? 1,
        m2: params.m2 ?? 1,
        m3: params.m3 ?? 1,
        L1: params.l1 ?? 1,
        L2: params.l2 ?? 1,
        L3: params.l3 ?? 1,
        g: params.g ?? 9.81,
        theta1: params.theta1 ?? 1.0,
        theta2: params.theta2 ?? 0.6,
        theta3: params.theta3 ?? -0.4,
        theta1_dot: params.theta1_dot ?? 0,
        theta2_dot: params.theta2_dot ?? 0,
        theta3_dot: params.theta3_dot ?? 0,
        t_max: params.T ?? 12,
        dt: params.dt ?? 0.02,
      };
    } else {
      console.warn("playPhysicsMusic handler not defined yet.", { system: systemKey, params });
      return;
    }

    ensureAudioEngine();

    setIsFetching(true);
    setFetchError("");
    setEvolutionData(null);
    setIsPaused(false);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Backend error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (systemKey === "double-pendulum") {
        setEvolutionData({
          system: systemKey,
          ...data,
          L1: payload.L1,
          L2: payload.L2,
        });
      } else {
        setEvolutionData({
          system: systemKey,
          ...data,
          L1: payload.L1,
          L2: payload.L2,
          L3: payload.L3,
        });
      }
    } catch (err) {
      setFetchError(err?.message ?? "Failed to reach backend");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!evolutionData || evolutionData.system !== "double-pendulum") return undefined;
    dpTrailRef.current = [];
    const canvas = dpCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return undefined;

    const { theta1, theta2, theta1d = [], theta2d = [], L1 = 1, L2 = 1 } = evolutionData;
    const audio = ensureAudioEngine();
    const totalLength = L1 + L2;
    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = 40;
    const scale = (Math.min(width, height) * 0.45) / totalLength;

    let frame = 0;
    let rafId;

    const drawFrame = () => {
      const i = frame % theta1.length;
      const th1 = theta1[i];
      const th2 = theta2[i];
      const th1d = theta1d[i] ?? 0;
      const th2d = theta2d[i] ?? 0;

      const x1 = originX + L1 * scale * Math.sin(th1);
      const y1 = originY + L1 * scale * Math.cos(th1);
      const x2 = x1 + L2 * scale * Math.sin(th2);
      const y2 = y1 + L2 * scale * Math.cos(th2);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(originX, originY + 2);
      ctx.lineTo(originX, height - 10);
      ctx.stroke();

      ctx.strokeStyle = "#6ae3ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.fillStyle = "#6ae3ff";
      ctx.beginPath();
      ctx.arc(x1, y1, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ff8fb1";
      ctx.beginPath();
      ctx.arc(x2, y2, 10, 0, Math.PI * 2);
      ctx.fill();

      dpTrailRef.current.push({ x: x2, y: y2 });
      if (dpTrailRef.current.length > 240) dpTrailRef.current.shift();
      ctx.lineWidth = 2;
      for (let j = 1; j < dpTrailRef.current.length; j += 1) {
        const p0 = dpTrailRef.current[j - 1];
        const p1 = dpTrailRef.current[j];
        const alpha = j / dpTrailRef.current.length;
        ctx.strokeStyle = `rgba(106, 227, 255, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }

      if (audio) {
        const tones = toneControlsRef.current;
        const players = playersRef.current;
        const now = audio.ctx.currentTime;
        const minGap = 0.08;
        const gainFromSpeed = (speed, velScale) => Math.min(0.45, 0.05 + Math.abs(speed) * 0.12 * velScale);

        const trigger = (key, angle, angleDot) => {
          const player = players[key];
          if (!player) return;
          const last = lastNoteRef.current[key] ?? 0;
          if (isPaused || now - last < minGap) return;
          const ctrl = tones[key];
          const freq = Math.max(60, ctrl.base + angle * ctrl.scale);
          const midi = freqToMidi(freq);
          const gain = gainFromSpeed(angleDot, ctrl.vel);
          player.play(midi, audio.ctx.currentTime, { gain, duration: 0.15 });
          lastNoteRef.current[key] = now;
        };

        trigger("th1", th1, th1d);
        trigger("th2", th2, th2d);
      }

      if (!isPaused) {
        frame += 1;
      }
      rafId = requestAnimationFrame(drawFrame);
    };

    rafId = requestAnimationFrame(drawFrame);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [evolutionData, isPaused, toneControls, audioReady, ensureAudioEngine]);

  useEffect(() => {
    if (!evolutionData || evolutionData.system !== "triple-pendulum") return undefined;
    tpTrailRef.current = [];
    const canvas = tpCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return undefined;

    const { theta1 = [], theta2 = [], theta3 = [], theta1d = [], theta2d = [], theta3d = [], L1 = 1, L2 = 1, L3 = 1 } =
      evolutionData;
    const audio = ensureAudioEngine();
    const totalLength = L1 + L2 + L3;
    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = 40;
    const scale = (Math.min(width, height) * 0.42) / totalLength;

    let frame = 0;
    let rafId;

    const drawFrame = () => {
      const i = frame % theta1.length;
      const th1 = theta1[i];
      const th2 = theta2[i];
      const th3 = theta3[i];

      const x1 = originX + L1 * scale * Math.sin(th1);
      const y1 = originY + L1 * scale * Math.cos(th1);

      const x2 = x1 + L2 * scale * Math.sin(th2);
      const y2 = y1 + L2 * scale * Math.cos(th2);

      const x3 = x2 + L3 * scale * Math.sin(th3);
      const y3 = y2 + L3 * scale * Math.cos(th3);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(originX, originY + 2);
      ctx.lineTo(originX, height - 10);
      ctx.stroke();

      ctx.strokeStyle = "#ff9f6a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.stroke();

      ctx.fillStyle = "#ff9f6a";
      ctx.beginPath();
      ctx.arc(x1, y1, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x2, y2, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x3, y3, 9, 0, Math.PI * 2);
      ctx.fill();

      tpTrailRef.current.push({ x: x3, y: y3 });
      if (tpTrailRef.current.length > 360) tpTrailRef.current.shift();
      ctx.lineWidth = 2;
      for (let j = 1; j < tpTrailRef.current.length; j += 1) {
        const p0 = tpTrailRef.current[j - 1];
        const p1 = tpTrailRef.current[j];
        const alpha = j / tpTrailRef.current.length;
        ctx.strokeStyle = `rgba(255, 159, 106, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }

      if (audio) {
        const tones = toneControlsRef.current;
        const players = playersRef.current;
        const now = audio.ctx.currentTime;
        const minGap = 0.08;
        const gainFromSpeed = (speed, velScale) => Math.min(0.45, 0.05 + Math.abs(speed) * 0.12 * velScale);

        const trigger = (key, angle, angleDot) => {
          const player = players[key];
          if (!player) return;
          const last = lastNoteRef.current[key] ?? 0;
          if (isPaused || now - last < minGap) return;
          const ctrl = tones[key];
          const freq = Math.max(60, ctrl.base + angle * ctrl.scale);
          const midi = freqToMidi(freq);
          const gain = gainFromSpeed(angleDot, ctrl.vel);
          player.play(midi, audio.ctx.currentTime, { gain, duration: 0.15 });
          lastNoteRef.current[key] = now;
        };

        trigger("th1", th1, theta1d[i] ?? 0);
        trigger("th2", th2, theta2d[i] ?? 0);
        trigger("th3", th3, theta3d[i] ?? 0);
      }

      if (!isPaused) {
        frame += 1;
      }
      rafId = requestAnimationFrame(drawFrame);
    };

    rafId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafId);
  }, [evolutionData, isPaused, ensureAudioEngine]);

  return (
    <div className="page">
      <main className="shell">
        <header className="hero">
          <div className="hero-text">
            <div className="kicker">Akshay Murthy</div>
            <h1>Pursuit of Pendulums</h1>
            <p>
              Experiments at the intersection of physics, generative sound, and visual form. Explore
              the gallery, play with physics-driven animations, and peek at the upcoming fractal lab.
            </p>
            <div className="hero-actions">
              <a
                className="hero-btn primary"
                href="#gallery"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate("gallery");
                }}
              >
                Enter the gallery
              </a>
            </div>
          </div>
        </header>

        <nav className="top-nav" aria-label="Primary">
          {sections.map((section) => (
            <a
              key={section.key}
              className={`top-link ${activeSection === section.key ? "active" : ""}`}
              href={`#${section.key}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(section.key);
              }}
            >
              <span className="top-link-label">{section.label}</span>
              <span className="top-link-sub">{section.blurb}</span>
            </a>
          ))}
        </nav>

        <div className="section-stack">
          {activeSection === "gallery" && (
            <Gallery
              pieces={galleryPieces}
              selectedPiece={selectedPiece}
              onSelectPiece={setSelectedPiece}
              onClose={() => setSelectedPiece(null)}
            />
          )}
          {activeSection === "animations" && (
            <Animations
              systems={systems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              paramState={paramState}
              handleInputChange={handleInputChange}
              handlePlay={handlePlay}
              isFetching={isFetching}
              fetchError={fetchError}
              evolutionData={evolutionData}
              dpCanvasRef={dpCanvasRef}
              tpCanvasRef={tpCanvasRef}
              toneControls={toneControls}
              setToneControls={setToneControls}
              audioReady={audioReady}
              isPaused={isPaused}
              onPauseToggle={handlePauseToggle}
              onDownloadMusic={handleDownloadMusic}
            />
          )}
          {activeSection === "fractals" && <Fractals />}
        </div>
      </main>
    </div>
  );
}
