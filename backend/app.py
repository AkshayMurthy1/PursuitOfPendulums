from flask import Flask, jsonify, request
from flask_cors import CORS
import math
from scipy.integrate import solve_ivp
import numpy as np
import sympy as smp

app = Flask(__name__)
CORS(app)


def double_pendulum_derivatives(t,state, m1,m2,L1,L2,g):
    """Compute state derivatives for a double pendulum."""
    theta1, theta2, theta1_dot, theta2_dot = state

    delta = theta2 - theta1
    sin_delta = math.sin(delta)
    cos_delta = math.cos(delta)

    denom1 = (m1 + m2) * L1 - m2 * L1 * cos_delta * cos_delta
    denom2 = (L2 / L1) * denom1

    # Equations of motion (from standard double-pendulum model)
    theta1_ddot = (
        m2 * L1 * theta1_dot * theta1_dot * sin_delta * cos_delta
        + m2 * g * math.sin(theta2) * cos_delta
        + m2 * L2 * theta2_dot * theta2_dot * sin_delta
        + (m1 + m2) * g * math.sin(theta1)
    ) / denom1

    theta2_ddot = (
        -m2 * L2 * theta2_dot * theta2_dot * sin_delta * cos_delta
        + (m1 + m2)
        * (
            g * math.sin(theta1) * cos_delta
            - L1 * theta1_dot * theta1_dot * sin_delta
            - g * math.sin(theta2)
        )
    ) / denom2

    return theta1_dot, theta2_dot, theta1_ddot, theta2_ddot

t,g,m1,m2,L1,L2, = smp.symbols('t g m1 m2 L1 L2')
theta1 = smp.Function('theta1')
theta1 = theta1(t)
theta2 = smp.Function('theta2')
theta2 = theta2(t)

theta1_d = smp.diff(theta1,t)
theta2_d = smp.diff(theta2,t)
theta1_dd = smp.diff(theta1_d,t)
theta2_dd = smp.diff(theta2_d,t)

x1 = L1*smp.sin(theta1)
x2 = x1+L2*smp.sin(theta2)

y1 = -L1*smp.cos(theta1)
y2 = y1-L2*smp.cos(theta2)

T1 = smp.Rational(1,2) * m1 * (smp.diff(x1,t)**2+smp.diff(y1,t)**2).simplify()
T2 = smp.Rational(1,2) * m2 * (smp.diff(x2,t)**2+smp.diff(y2,t)**2).simplify()
T = T1+T2
V1 = m1*g*y1
V2 = m2*g*y2
V = V1+V2
L=T-V

E1 = smp.diff(L,theta1) - smp.diff(smp.diff(L,theta1_d),t)
E2 = smp.diff(L,theta2) - smp.diff(smp.diff(L,theta2_d),t)

sols = smp.solve([E1, E2], [theta1_dd, theta2_dd], simplify=True)

theta1_dd_f = smp.lambdify((theta1,theta2,theta1_d,theta2_d, m1,m2,L1,L2,g),sols[theta1_dd])
theta2_dd_f = smp.lambdify((theta1,theta2,theta1_d,theta2_d, m1,m2,L1,L2,g),sols[theta2_dd])


t_3, g_3, m1_3, m2_3, m3_3, L1_3, L2_3, L3_3 = smp.symbols("t_3 g_3 m1_3 m2_3 m3_3 L1_3 L2_3 L3_3")
theta1_fn_3 = smp.Function("theta1_3")
theta2_fn_3 = smp.Function("theta2_3")
theta3_fn_3 = smp.Function("theta3_3")

theta1_3 = theta1_fn_3(t_3)
theta2_3 = theta2_fn_3(t_3)
theta3_3 = theta3_fn_3(t_3)

theta1_d_3 = smp.diff(theta1_3, t_3)
theta2_d_3 = smp.diff(theta2_3, t_3)
theta3_d_3 = smp.diff(theta3_3, t_3)

theta1_dd_3 = smp.diff(theta1_d_3, t_3)
theta2_dd_3 = smp.diff(theta2_d_3, t_3)
theta3_dd_3 = smp.diff(theta3_d_3, t_3)

x1_3 = L1_3 * smp.sin(theta1_3)
x2_3 = x1_3 + L2_3 * smp.sin(theta2_3)
x3_3 = x2_3 + L3_3 * smp.sin(theta3_3)

y1_3 = -L1_3 * smp.cos(theta1_3)
y2_3 = y1_3 - L2_3 * smp.cos(theta2_3)
y3_3 = y2_3 - L3_3 * smp.cos(theta3_3)

T1_3 = smp.Rational(1, 2) * m1_3 * (smp.diff(x1_3, t_3) ** 2 + smp.diff(y1_3, t_3) ** 2).simplify()
T2_3 = smp.Rational(1, 2) * m2_3 * (smp.diff(x2_3, t_3) ** 2 + smp.diff(y2_3, t_3) ** 2).simplify()
T3_3 = smp.Rational(1, 2) * m3_3 * (smp.diff(x3_3, t_3) ** 2 + smp.diff(y3_3, t_3) ** 2).simplify()
T_3 = T1_3 + T2_3 + T3_3
V1_3 = m1_3 * g_3 * y1_3
V2_3 = m2_3 * g_3 * y2_3
V3_3 = m3_3 * g_3 * y3_3
V_3 = V1_3 + V2_3 + V3_3

L_3 = T_3 - V_3

E1_3 = smp.diff(L_3, theta1_3) - smp.diff(smp.diff(L_3, theta1_d_3), t_3)
E2_3 = smp.diff(L_3, theta2_3) - smp.diff(smp.diff(L_3, theta2_d_3), t_3)
E3_3 = smp.diff(L_3, theta3_3) - smp.diff(smp.diff(L_3, theta3_d_3), t_3)

print("Solving Triple Pendulum...")
sols_3 = smp.solve([E1_3, E2_3, E3_3], (theta1_dd_3, theta2_dd_3, theta3_dd_3))

theta1_dd_f_3 = smp.lambdify(
    (theta1_3, theta2_3, theta3_3, theta1_d_3, theta2_d_3, theta3_d_3, m1_3, m2_3, m3_3, L1_3, L2_3, L3_3, g_3),
    sols_3[theta1_dd_3],
)
theta2_dd_f_3 = smp.lambdify(
    (theta1_3, theta2_3, theta3_3, theta1_d_3, theta2_d_3, theta3_d_3, m1_3, m2_3, m3_3, L1_3, L2_3, L3_3, g_3),
    sols_3[theta2_dd_3],
)
theta3_dd_f_3 = smp.lambdify(
    (theta1_3, theta2_3, theta3_3, theta1_d_3, theta2_d_3, theta3_d_3, m1_3, m2_3, m3_3, L1_3, L2_3, L3_3, g_3),
    sols_3[theta3_dd_3],
)

def dp_system(t,state,m1,m2,L1,L2,g):
    theta1, theta2, theta1_dot, theta2_dot = state
    return [theta1_dot,theta2_dot,theta1_dd_f(theta1,theta2,theta1_dot,theta2_dot,m1,m2,L1,L2,g),theta2_dd_f(theta1,theta2,theta1_dot,theta2_dot,m1,m2,L1,L2,g)]

def tp_system(t,state,m1,m2,m3,L1,L2,L3,g):
    theta1,theta2,theta3,theta1_dot,theta2_dot,theta3_dot = state
    # Return all six derivatives to match the 6-state y0 expected by solve_ivp.
    return [
        theta1_dot,
        theta2_dot,
        theta3_dot,
        theta1_dd_f_3(theta1, theta2, theta3, theta1_dot, theta2_dot, theta3_dot, m1, m2, m3, L1, L2, L3, g),
        theta2_dd_f_3(theta1, theta2, theta3, theta1_dot, theta2_dot, theta3_dot, m1, m2, m3, L1, L2, L3, g),
        theta3_dd_f_3(theta1, theta2, theta3, theta1_dot, theta2_dot, theta3_dot, m1, m2, m3, L1, L2, L3, g),
    ]
def rk4_step(state, params, dt):
    """Runge-Kutta 4th order single step."""
    k1 = double_pendulum_derivatives(state, params)
    k1_state = [s + 0.5 * dt * k for s, k in zip(state, k1)]

    k2 = double_pendulum_derivatives(k1_state, params)
    k2_state = [s + 0.5 * dt * k for s, k in zip(state, k2)]

    k3 = double_pendulum_derivatives(k2_state, params)
    k3_state = [s + dt * k for s, k in zip(state, k3)]

    k4 = double_pendulum_derivatives(k3_state, params)

    return [
        s + (dt / 6.0) * (k1_i + 2 * k2_i + 2 * k3_i + k4_i)
        for s, k1_i, k2_i, k3_i, k4_i in zip(state, k1, k2, k3, k4)
    ]

def integrate_system(params, t_max=12.0, dt=0.02, max_steps=4000):
    theta1 = params.get("theta1", 1.2)
    theta2 = params.get("theta2", -0.4)
    theta1_dot = params.get("theta1_dot", 0.0)
    theta2_dot = params.get("theta2_dot", 0.0)

    steps = min(int(t_max / dt), max_steps)
    t_values = [0.0]
    theta1_values = [theta1]
    theta2_values = [theta2]

    state = [theta1, theta2, theta1_dot, theta2_dot]
    for _ in range(steps):
        state = rk4_step(state, params, dt)
        t_values.append(t_values[-1] + dt)
        theta1_values.append(state[0])
        theta2_values.append(state[1])

    return t_values, theta1_values, theta2_values


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/evolution_dp", methods=["POST"])
def evolution_dp():
    payload = request.get_json(silent=True) or {}

    defaults = {
        "m1": 1.0,
        "m2": 1.0,
        "L1": 1.0,
        "L2": 1.0,
        "g": 9.81,
    }
    state0s = {
        "theta1":np.pi/2,
        "theta2": np.pi/2,
        "theta1_dot": 0.0,
        "theta2_dot": 0.0,
    }

    ini_state= [float(payload.get(i,state0s[i])) for i in state0s]
    params = [float(payload.get(k, defaults[k])) for k in defaults]
    t_max = float(payload.get("t_max", 12.0))
    dt = float(payload.get("dt", 0.02))

    # Safety: avoid excessively large responses
    t_max = max(0.1, min(t_max, 60.0))
    dt = max(1e-3, min(dt, 0.1))

    try:
        t_span = (0,t_max)
        t_eval = np.arange(0,t_max,dt)
        print("INI_STATE:", ini_state)

        theta1_values, theta2_values,theta1_d,theta2_d = solve_ivp(
            dp_system,
            y0 = ini_state,
            t_span=t_span,
            args=params,
            t_eval=t_eval
        ).y

        return jsonify(
            {
                "t": list(t_eval),
                "theta1": list(theta1_values),
                "theta2": list(theta2_values),
                "theta1d":list(theta1_d),
                "theta2d":list(theta2_d),
                "params": list(params),
                "meta": {"t_max": t_max, "dt": dt, "count": len(t_eval)},
            }
        )
    except Exception as exc:
        return jsonify({"error": "Failed to compute double pendulum evolution.", "details": str(exc)}), 500

@app.route("/api/evolution_tp", methods=["POST"])
def evolution_tp():
    payload = request.get_json(silent=True) or {}

    defaults = {
        "m1": 1.0,
        "m2": 1.0,
        "m3": 1.0,
        "L1": 1.0,
        "L2": 1.0,
        "L3":1.0,
        "g": 9.81,
    }
    state0s = {
        "theta1":np.pi/2,
        "theta2": np.pi/2,
        "theta3": np.pi/2,
        "theta1_dot": 0.0,
        "theta2_dot": 0.0,
        "theta3_dot": 0.0,
    }

    ini_state= [float(payload.get(i,state0s[i])) for i in state0s]
    params = [float(payload.get(k, defaults[k])) for k in defaults]
    t_max = float(payload.get("t_max", 12.0))
    dt = float(payload.get("dt", 0.02))

    # Safety: avoid excessively large responses
    t_max = max(0.1, min(t_max, 60.0))
    dt = max(1e-3, min(dt, 0.1))

    try:
        t_span = (0,t_max)
        t_eval = np.arange(0,t_max,dt)
        print("INI_STATE:", ini_state)

        theta1_values, theta2_values,theta3_values,theta1_d,theta2_d,theta3_d = solve_ivp(
            tp_system,
            y0 = ini_state,
            t_span=t_span,
            args=params,
            t_eval=t_eval
        ).y

        return jsonify(
            {
                "t": list(t_eval),
                "theta1": list(theta1_values),
                "theta2": list(theta2_values),
                "theta3": list(theta3_values),
                "theta1d":list(theta1_d),
                "theta2d":list(theta2_d),
                "theta3d":list(theta3_d),
                "params": list(params),
                "meta": {"t_max": t_max, "dt": dt, "count": len(t_eval)},
            }
        )
    except Exception as exc:
        return jsonify({"error": "Failed to compute triple pendulum evolution.", "details": str(exc)}), 500



@app.route("/api/make_fractal", methods=["POST"])
def make_vis():
    payload = request.get_json(silent=True) or {}

    defaults = {
        "dxdt": "0",
        "dydt": "0",
        "d2xdt2": "0",
        "d2ydt2": "0",
    }
    limits = {
        "x1":0,
        "y1":0,
        "x2":1,
        "y2":1,
        "res":100,
        "t":10
    }

    # Use named parsing so res/t map correctly and avoid positional errors.
    try:
        x1 = float(payload.get("x1", limits["x1"]))
        y1 = float(payload.get("y1", limits["y1"]))
        x2 = float(payload.get("x2", limits["x2"]))
        y2 = float(payload.get("y2", limits["y2"]))
        res = int(payload.get("res", limits["res"]))
        t_max = float(payload.get("t", limits["t"]))
    except Exception as exc:
        return jsonify({"error": "Invalid numeric input.", "details": str(exc)}), 400

    # Safety caps to prevent runaway CPU/memory usage.
    res = max(10, min(res, 300))
    t_max = max(0.1, min(t_max, 60.0))

    params = [str(payload.get(k, defaults[k])) for k in defaults]

    try:
        x_sym, y_sym, dxdt_sym, dydt_sym, t_sym = smp.symbols("x y dxdt dydt t")
        exprs = [
            smp.sympify(expr, locals={"x": x_sym, "y": y_sym, "dxdt": dxdt_sym, "dydt": dydt_sym, "t": t_sym})
            for expr in params
        ]
        dxdt_f, dydt_f, d2xdt_f, d2ydt_f = [
            smp.lambdify((t_sym, x_sym, y_sym, dxdt_sym, dydt_sym), expr, modules="numpy") for expr in exprs
        ]
    except Exception as exc:
        return jsonify({"error": "Failed to parse expressions.", "details": str(exc)}), 400

    def func(t, state):
        x, y, dxdt, dydt = state
        return [
            dxdt_f(t, x, y, dxdt, dydt),
            dydt_f(t, x, y, dxdt, dydt),
            d2xdt_f(t, x, y, dxdt, dydt),
            d2ydt_f(t, x, y, dxdt, dydt),
        ]
    
    # Return a real 2D list for JSON serialization.
    try:
        grid = return_2d_chaos(func, x2, y2, x1, y1, N=res, T=t_max)
    except Exception as exc:
        return jsonify({"error": "Failed to generate fractal grid.", "details": str(exc)}), 500
    
    return jsonify({"grid": grid.tolist()})

def return_2d_chaos(func, x2,y2,x1=0,y1=0,N=50,T=10,ep=1e-3,dxdt=0,dydt=0,dt=.1):
    X = np.linspace(x1,x2,num=N)
    Y = np.linspace(y1,y2,num=N)
    #print(Y)
    grid = np.zeros((N,N))
    t_eval = np.arange(start=0,stop=T,step=dt)
    for i in range(len(X)):
        print(i)
        for j in range(len(Y)):
            x = X[i]
            y = Y[j]
            try:
                sol1 = solve_ivp(func,t_span=(0,T),y0=[x,y,dxdt,dydt],t_eval=t_eval)
                sol2 = solve_ivp(func,t_span=(0,T),y0=[x+ep,y+ep,dxdt,dydt],t_eval=t_eval)
                # Use distance between trajectories to keep a scalar per cell.
                val = np.linalg.norm((sol1.y[0],sol2.y[0]))
            except Exception:
                val = 0
            grid[i][j] = val
    return grid

if __name__ == "__main__":
    # For local development. In production, run with a WSGI server.
    app.run(host="0.0.0.0", port=5000, debug=True)
