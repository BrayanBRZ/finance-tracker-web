const SIMULATED_LATENCY_MS = 400

export const latency = () =>
  new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS))
