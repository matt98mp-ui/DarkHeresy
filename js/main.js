import { state } from "./state.js";
import { initEvents } from "./events.js";
import { renderAll } from "./ui.js";
import { openBrowser } from "./browser.js";

const DENSITY_KEY = "dh_density";
const THEME_KEY = "dh_theme";
const INV_UI_KEY = "dh_inventory_ui";
const BROWSER_PAGE_SIZE_KEY = "dh_browser_page_size";

// Load datasets (legacy format writes to window.*)
import "../data/weapons.js";
import "../data/armors.js";
import "../data/gear.js";
import "../data/talents.js";
import "../data/psychicPowers.js";
import "../data/weaponMods.js";
import "../data/classes.js";
import "../data/races.js";
import "../data/backgrounds.js";
import "../data/injuries.js";
import "../data/talentTrees.js";

function init() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t) document.body.dataset.theme = t;
    const d = localStorage.getItem(DENSITY_KEY);
    if (d) document.body.dataset.density = d;
  } catch {}

  // Centralize all data so browser/search can use it predictably
  state.data = {

    weapons: window.WEAPONS ?? [],
    armors: window.ARMORS ?? [],
    gear: window.GEAR ?? [],
    talents: window.TALENTS ?? [],
    psychicPowers: window.PSYCHIC_POWERS ?? [],
    weaponMods: window.WEAPON_MODS ?? [],
    classes: window.CLASSES ?? [],
    races: window.RACES ?? [],
    backgrounds: window.BACKGROUNDS ?? [],
    injuries: window.INJURIES ?? [],
    talentTrees: window.TALENT_TREES ?? [],
  };



  function populateGlanceSelects() {
    const careerSel = document.getElementById("glanceCareerSelect");
    if (careerSel && careerSel.options.length === 0) {
      const list = state.data.classes || [];
      careerSel.innerHTML =
        '<option value="">—</option>' +
        list.slice(0, 1000).map(c => `<option value="${c.name}">${c.name}</option>`).join("") +
        '<option value="__other__">Other…</option>';
    }

    const homeSel = document.getElementById("glanceHomeworldSelect");
    if (homeSel && homeSel.options.length === 0) {
      const list = (state.data.backgrounds && state.data.backgrounds.length) ? state.data.backgrounds : (state.data.races || []);
      homeSel.innerHTML =
        '<option value="">—</option>' +
        list.slice(0, 1000).map(h => `<option value="${h.name}">${h.name}</option>`).join("") +
        '<option value="__other__">Other…</option>';
    }
  }

    const homeList = document.getElementById("homeworldList");
    if (homeList && homeList.options.length === 0) {
      const list = (state.data.backgrounds && state.data.backgrounds.length) ? state.data.backgrounds : (state.data.races || []);
      homeList.innerHTML = list.slice(0, 1000).map(h => `<option value="${h.name}"></option>`).join("");
    }
  }



  // Populate select inputs (minimal)
  const weaponSelect = document.getElementById("weaponSelect");
  if (weaponSelect && weaponSelect.options.length === 0) {
    const ws = state.data.weapons || [];
    weaponSelect.innerHTML = ws.slice(0, 500).map(w => `<option>${w.name}</option>`).join("");
  }
  
  const weaponModSelect = document.getElementById("weaponModSelect");
  if (weaponModSelect && weaponModSelect.options.length === 0) {
    const ms = state.data.weaponMods || [];
    weaponModSelect.innerHTML = ms.slice(0, 500).map(m => `<option>${m.name}</option>`).join("");
  }
  const weaponModSlotSelect = document.getElementById("weaponModSlotSelect");
  if (weaponModSlotSelect && weaponModSlotSelect.options.length === 0) {
    weaponModSlotSelect.innerHTML = `<option value="0">Slot 1</option><option value="1">Slot 2</option><option value="2">Slot 3</option>`;
    weaponModSlotSelect.value = String(state.selectedWeaponSlot || 0);
  }

const armorSelect = document.getElementById("armorSelect");
  if (armorSelect && armorSelect.options.length === 0) {
    const as = state.data.armors || [];
    armorSelect.innerHTML = as.slice(0, 500).map(a => `<option>${a.name}</option>`).join("");
  }

  // Ensure character exists
  state.character ||= {
    wounds: 12,
    corruption: 0,
    talents: [],
    psychicPowers: [],
  };

  // Restore browser page size
  try {
    const saved = Number(localStorage.getItem(BROWSER_PAGE_SIZE_KEY));
    if (saved === 25 || saved === 50 || saved === 100) state.browserPageSize = saved;
  } catch {}


  // Restore inventory UI preferences
  try {
    const raw = localStorage.getItem(INV_UI_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && typeof o === "object") {
        if (typeof o.search === "string") state.inventorySearch = o.search;
        if (o.sort === "name" || o.sort === "category" || o.sort === "weight") state.inventorySort = o.sort;
        if (typeof o.group === "boolean") state.inventoryGroup = o.group;
      }
    }
  } catch {}

  // Start browser on a sensible default
  openBrowser(state.browserKind || "weapons");

  populateGlanceSelects();

  initEvents();
  renderAll();


window.addEventListener("DOMContentLoaded", init);
