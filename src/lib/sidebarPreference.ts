export const SIDEBAR_STORAGE_KEY = "roboatlas.sidebar-collapsed.v1";

export function loadSidebarCollapsed(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveSidebarCollapsed(collapsed: boolean): void {
  try {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  } catch {
    // This display preference must never prevent the sidebar from working.
  }
}
