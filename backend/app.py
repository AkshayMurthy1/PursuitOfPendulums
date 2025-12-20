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

    t_span = (0,t_max)
    t_eval = np.arange(0,t_max,dt)
    print("INI_STATE:", ini_state)

    theta1_values, theta2_values,theta1_d,theta2_d = solve_ivp(dp_system,y0 = ini_state, t_span=t_span,args=params,  t_eval=t_eval).y

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

    t_span = (0,t_max)
    t_eval = np.arange(0,t_max,dt)
    print("INI_STATE:", ini_state)

    theta1_values, theta2_values,theta3_values,theta1_d,theta2_d,theta3_d = solve_ivp(tp_system,y0 = ini_state, t_span=t_span,args=params,  t_eval=t_eval).y

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

if __name__ == "__main__":
    # For local development. In production, run with a WSGI server.
    app.run(host="0.0.0.0", port=5000, debug=True)
