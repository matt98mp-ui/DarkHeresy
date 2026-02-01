import { state } from "./state.js";

export function applyGMPreset(preset) {
  state.gmPreset = preset;
}

export function resetGMSettings() {
  state.gmPreset = null;
}

export function toggleGMPanel() {
  state.gmOpen = !state.gmOpen;
  const panel = document.getElementById("gmPanel");
  if (panel) panel.style.display = state.gmOpen ? "block" : "none";
}
