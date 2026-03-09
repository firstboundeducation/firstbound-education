import "./style.css";
import { jsPDF } from "jspdf";

document.querySelector("#app").innerHTML = `
  <div class="app-shell" id="app-shell">
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-topbar">
        <button
          id="toggle-sidebar-button"
          class="collapse-button"
          type="button"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          ◂
        </button>
      </div>

      <div class="sidebar-content" id="sidebar-content">
        <div class="sidebar-section">
          <div class="sidebar-header">
            <div class="sidebar-title-row">
              <h2>Notebooks</h2>
              <button
                id="toggle-notebooks-button"
                class="collapse-button"
                type="button"
                aria-label="Toggle notebooks section"
                title="Collapse or expand notebooks"
              >
                ▾
              </button>
            </div>

            <div class="sidebar-actions">
              <button id="new-notebook-button" type="button">+ Notebook</button>
              <button id="rename-notebook-button" type="button">Rename</button>
              <button id="delete-notebook-button" type="button">Delete</button>
            </div>
          </div>

          <div id="notebook-list" class="list"></div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-header">
            <div class="sidebar-title-row">
              <h2>Pages</h2>

              <div class="title-icon-group">
                <button
                  id="toggle-page-search-button"
                  class="header-icon-button"
                  type="button"
                  aria-label="Search pages"
                  title="Search pages"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6"></circle>
                    <path d="M20 20l-4.2-4.2"></path>
                  </svg>
                </button>

                <button
                  id="toggle-pages-button"
                  class="collapse-button"
                  type="button"
                  aria-label="Toggle pages section"
                  title="Collapse or expand pages"
                >
                  ▾
                </button>
              </div>
            </div>

            <div id="page-search-bar" class="page-search-bar is-collapsed">
              <input
                id="page-search-input"
                class="page-search-input"
                type="search"
                placeholder="Find page by name"
                autocomplete="off"
                spellcheck="false"
                inputmode="search"
                enterkeyhint="search"
              />

              <button
                id="page-search-submit"
                class="page-search-submit"
                type="button"
                aria-label="Go to page"
                title="Go to page"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h12"></path>
                  <path d="M12 6l6 6-6 6"></path>
                </svg>
              </button>
            </div>

            <div class="sidebar-actions">
              <button id="new-page-button" type="button">+ Page</button>
              <button id="duplicate-page-button" type="button">Duplicate</button>
              <button id="move-page-button" type="button">Move</button>
              <button id="copy-page-to-notebook-button" type="button">Copy To</button>
              <button id="rename-page-button" type="button">Rename</button>
              <button id="delete-page-button" type="button">Delete</button>
            </div>
          </div>

          <div id="page-list" class="list page-grid"></div>
        </div>
      </div>
    </aside>

    <main class="main-area">
      <div class="toolbar">
        <div class="toolbar-location">
          <div class="toolbar-label">Current</div>
          <div id="location-label" class="toolbar-path"></div>
        </div>

        <div class="toolbar-controls">
          <button
            class="tool-button compact-tool-button is-active"
            data-tool="pen"
            type="button"
            title="Pen"
            aria-label="Pen"
          >
            <svg class="tool-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20l4.5-1 9.8-9.8-3.5-3.5L5 15.5 4 20Z"></path>
              <path d="M13.8 6.2l3.5 3.5"></path>
              <path d="M3.5 20.5h6"></path>
            </svg>
          </button>

          <button
            class="tool-button compact-tool-button"
            data-tool="highlighter"
            type="button"
            title="Highlighter"
            aria-label="Highlighter"
          >
            <svg class="tool-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 4l6 6"></path>
              <path d="M5 19l4.5-.8L20 7.7 16.3 4 5.8 14.5 5 19Z"></path>
              <path d="M4 20h9"></path>
            </svg>
          </button>

          <button
            class="tool-button compact-tool-button"
            data-tool="eraser"
            type="button"
            title="Eraser"
            aria-label="Eraser"
          >
            <svg class="tool-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 18L3.8 14.8a2.3 2.3 0 0 1 0-3.2L10.6 4.8a2.3 2.3 0 0 1 3.2 0l6.4 6.4a2.3 2.3 0 0 1 0 3.2L16.5 18"></path>
              <path d="M7 18h13"></path>
              <path d="M10.5 8.2l5.3 5.3"></path>
            </svg>
          </button>

          <button
            class="tool-button compact-tool-button"
            data-tool="lasso"
            type="button"
            title="Lasso"
            aria-label="Lasso"
          >
            <svg class="tool-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 9c0-3 2.8-5 6.5-5S18 6 18 9c0 2.5-2 4.5-5 5.2"></path>
              <path d="M13 14.2c0 0-3.5.7-3.5 3 0 1.1.8 1.8 1.8 1.8 1.2 0 2-.9 2-2.1 0-1.8-1.4-2.7-1.4-2.7"></path>
              <path d="M9.3 19.8l-.4.7"></path>
            </svg>
          </button>

          <label class="toolbar-group compact-group" title="Color">
            <span class="compact-icon-label" aria-hidden="true">
              <svg class="mini-icon-svg" viewBox="0 0 24 24">
                <path d="M12 3c3.9 0 7 2.8 7 6.2 0 2.7-2 4.8-4.8 4.8h-1.1c-.8 0-1.3.7-1.1 1.5.2 1.2-.7 2.5-2.6 2.5C5 18 2 14.8 2 10.7 2 6.4 6.4 3 12 3Z"></path>
                <circle cx="7.5" cy="9" r="1"></circle>
                <circle cx="11" cy="7.2" r="1"></circle>
                <circle cx="14.5" cy="8.8" r="1"></circle>
              </svg>
            </span>
            <input id="color-input" type="color" value="#111111" />
          </label>

          <label class="toolbar-group compact-group" title="Width">
            <span class="compact-icon-label" aria-hidden="true">
              <svg class="mini-icon-svg" viewBox="0 0 24 24">
                <path d="M4 7h16"></path>
                <path d="M6 12h12"></path>
                <path d="M8 17h8"></path>
              </svg>
            </span>
            <input id="width-input" type="range" min="1" max="40" step="0.5" value="2.5" />
          </label>

          <div class="settings-tile" id="settings-tile">
            <button
              id="toggle-settings-panel-button"
              class="icon-button settings-button"
              type="button"
              title="Open settings"
              aria-label="Open settings"
              aria-expanded="false"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3.5l1.1 2.2 2.4.4 1.7-1.7 2 2-1.7 1.7.4 2.4 2.2 1.1v2.8l-2.2 1.1-.4 2.4 1.7 1.7-2 2-1.7-1.7-2.4.4-1.1 2.2H10l-1.1-2.2-2.4-.4-1.7 1.7-2-2 1.7-1.7-.4-2.4L1 14.6v-2.8l2.2-1.1.4-2.4L1.9 6.6l2-2 1.7 1.7 2.4-.4L9.1 3.5H12Z"></path>
                <circle cx="12" cy="12" r="3.2"></circle>
              </svg>
            </button>

            <div id="settings-panel" class="settings-panel is-collapsed">
              <div class="settings-panel-title">Settings</div>

              <label class="settings-row">
                <span>Canvas</span>
                <select id="canvas-type-select">
                  <option value="large-lined">Large Lined</option>
                  <option value="graph">Graph Paper</option>
                  <option value="blank">Blank</option>
                </select>
              </label>

              <button
                id="theme-toggle-button"
                class="settings-theme-button"
                type="button"
                title="Toggle light and dark mode"
                aria-label="Toggle light and dark mode"
              >
                Dark Mode
              </button>

              <div class="settings-button-stack">
                <button
                  id="download-backup-button"
                  class="settings-theme-button"
                  type="button"
                  title="Download a full backup file"
                  aria-label="Download a full backup file"
                >
                  Download Backup
                </button>

                <button
                  id="import-backup-button"
                  class="settings-theme-button"
                  type="button"
                  title="Import a backup file"
                  aria-label="Import a backup file"
                >
                  Import Backup
                </button>

                <input
                  id="import-backup-input"
                  type="file"
                  accept=".json,application/json"
                  hidden
                />
              </div>

              <button
                id="toggle-pdf-export-menu-button"
                class="settings-theme-button"
                type="button"
                title="Open PDF export options"
                aria-label="Open PDF export options"
                aria-expanded="false"
              >
                Export as PDF
              </button>

              <div id="pdf-export-menu" class="settings-button-stack is-collapsed">
                <button
                  id="export-notebook-pdf-button"
                  class="settings-theme-button"
                  type="button"
                  title="Export the current notebook as a PDF"
                  aria-label="Export the current notebook as a PDF"
                >
                  Export Notebook
                </button>

                <button
                  id="export-selected-pages-pdf-button"
                  class="settings-theme-button"
                  type="button"
                  title="Choose specific pages to export as a PDF"
                  aria-label="Choose specific pages to export as a PDF"
                >
                  Export Selected Pages
                </button>
              </div>
            </div>
          </div>

          <button
            id="extend-page-button"
            class="icon-button"
            type="button"
            title="Add more page length"
            aria-label="Add more page length"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="3" width="12" height="18" rx="2"></rect>
              <path d="M17 7h4"></path>
              <path d="M19 5v4"></path>
            </svg>
          </button>

          <button
            id="trim-page-button"
            class="icon-button"
            type="button"
            title="Trim empty page space"
            aria-label="Trim empty page space"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="3" width="12" height="18" rx="2"></rect>
              <path d="M17 7h4"></path>
            </svg>
          </button>

          <div id="zoom-readout" class="zoom-readout">100%</div>

          <button
            id="reset-zoom-button"
            class="zoom-reset-button"
            type="button"
            title="Reset zoom"
            aria-label="Reset zoom"
            disabled
          >
            100%
          </button>

          <button
            id="undo-button"
            class="icon-button"
            type="button"
            title="Undo"
            aria-label="Undo"
          >
            <span class="arrow-icon">↶</span>
          </button>

          <button
            id="redo-button"
            class="icon-button"
            type="button"
            title="Redo"
            aria-label="Redo"
          >
            <span class="arrow-icon">↷</span>
          </button>

          <button
            id="clear-page-button"
            class="icon-button danger-icon-button"
            type="button"
            title="Clear Page"
            aria-label="Clear Page"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="4" width="14" height="16" rx="2"></rect>
              <path d="M7 7l10 10"></path>
              <path d="M17 7L7 17"></path>
            </svg>
          </button>
        </div>
      </div>

      <div id="page-scroll" class="page-scroll">
        <div id="page-surface-frame" class="page-surface-frame">
          <div id="page-surface" class="page-surface" data-canvas-type="large-lined">
            <canvas id="committed-canvas"></canvas>
            <canvas id="live-canvas"></canvas>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div id="pdf-page-picker-modal" class="modal-overlay is-hidden">
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <div class="modal-title">Export Selected Pages</div>
          <div id="pdf-page-picker-subtitle" class="modal-subtitle"></div>
        </div>

        <button
          id="close-pdf-page-picker-button"
          class="icon-button"
          type="button"
          title="Close page picker"
          aria-label="Close page picker"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12"></path>
            <path d="M18 6L6 18"></path>
          </svg>
        </button>
      </div>

      <div class="modal-toolbar">
        <button id="select-all-pdf-pages-button" type="button">Select All</button>
        <button id="clear-pdf-pages-button" type="button">Clear</button>
      </div>

      <div id="pdf-page-picker-list" class="modal-page-grid"></div>

      <div class="modal-actions">
        <button id="cancel-pdf-export-button" type="button">Cancel</button>
        <button id="confirm-pdf-export-button" type="button">Export PDF</button>
      </div>
    </div>
  </div>

  <div id="page-transfer-modal" class="modal-overlay is-hidden">
    <div class="modal-card modal-card-small">
      <div class="modal-header">
        <div>
          <div id="page-transfer-title" class="modal-title">Move Page</div>
          <div id="page-transfer-subtitle" class="modal-subtitle"></div>
        </div>

        <button
          id="close-page-transfer-button"
          class="icon-button"
          type="button"
          title="Close page transfer"
          aria-label="Close page transfer"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12"></path>
            <path d="M18 6L6 18"></path>
          </svg>
        </button>
      </div>

      <div id="page-transfer-list" class="modal-target-list"></div>

      <div class="modal-actions">
        <button id="cancel-page-transfer-button" type="button">Cancel</button>
        <button id="confirm-page-transfer-button" type="button">Confirm</button>
      </div>
    </div>
  </div>

  <div
    id="canvas-context-menu"
    class="canvas-context-menu is-hidden"
    role="menu"
    aria-label="Canvas menu"
  >
    <button
      id="paste-image-context-button"
      class="canvas-context-menu-button"
      type="button"
      role="menuitem"
    >
      Paste Image
    </button>
  </div>

  <style>
    .canvas-context-menu {
      position: fixed;
      z-index: 120;
      min-width: 160px;
      padding: 8px;
      border: 1px solid var(--button-border);
      border-radius: 12px;
      background: var(--toolbar-bg);
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.22);
    }

    .canvas-context-menu.is-hidden {
      display: none;
    }

    .canvas-context-menu-button {
      width: 100%;
      border: 1px solid var(--button-border);
      background: var(--button-bg);
      color: var(--text);
      border-radius: 10px;
      padding: 10px 12px;
      text-align: left;
      cursor: pointer;
    }

    .canvas-context-menu-button:hover {
      background: var(--button-hover);
    }
  </style>
`;

const STORAGE_KEY = "thigma-notes-app-v15";
const LEGACY_STORAGE_KEYS = [
  "thigma-notes-app-v14",
  "thigma-notes-app-v13",
  "thigma-notes-app-v12",
  "thigma-notes-app-v11",
  "thigma-notes-app-v10",
  "thigma-notes-app-v9",
  "thigma-notes-app-v8",
  "thigma-notes-app-v7",
  "thigma-notes-app-v6",
  "thigma-notes-app-v5",
  "thigma-notes-app-v4",
  "thigma-notes-app-v3",
  "thigma-notes-app-v2",
  "thigma-notes-app-v1"
];

const DEFAULT_PAGE_HEIGHT = 1200;
const PAGE_GROW_AMOUNT = 1000;
const VALID_CANVAS_TYPES = new Set(["large-lined", "graph", "blank"]);
const VALID_THEMES = new Set(["light", "dark"]);
const IMAGE_HANDLE_SIZE = 14;
const IMAGE_MIN_SIZE = 48;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const LASSO_POINT_MIN_DISTANCE = 5;
const SELECTION_HIT_PADDING = 12;

const LINE_HOLD_DELAY_MS = 180;
const RAW_POINT_MIN_DISTANCE = 0.35;
const DISPLAY_POINT_MIN_DISTANCE = 0.6;
const SMOOTHING_STRENGTH = 0.58;

const appShell = document.getElementById("app-shell");
const sidebar = document.getElementById("sidebar");
const settingsTile = document.getElementById("settings-tile");

const committedCanvas = document.getElementById("committed-canvas");
const liveCanvas = document.getElementById("live-canvas");

const committedCtx = committedCanvas.getContext("2d");
const liveCtx = liveCanvas.getContext("2d");

const notebookList = document.getElementById("notebook-list");
const pageList = document.getElementById("page-list");
const locationLabel = document.getElementById("location-label");

const toggleSidebarButton = document.getElementById("toggle-sidebar-button");
const toggleNotebooksButton = document.getElementById("toggle-notebooks-button");
const togglePagesButton = document.getElementById("toggle-pages-button");
const togglePageSearchButton = document.getElementById("toggle-page-search-button");
const pageSearchBar = document.getElementById("page-search-bar");
const pageSearchInput = document.getElementById("page-search-input");
const pageSearchSubmit = document.getElementById("page-search-submit");

const newNotebookButton = document.getElementById("new-notebook-button");
const renameNotebookButton = document.getElementById("rename-notebook-button");
const deleteNotebookButton = document.getElementById("delete-notebook-button");
const newPageButton = document.getElementById("new-page-button");
const duplicatePageButton = document.getElementById("duplicate-page-button");
const movePageButton = document.getElementById("move-page-button");
const copyPageToNotebookButton = document.getElementById("copy-page-to-notebook-button");
const renamePageButton = document.getElementById("rename-page-button");
const deletePageButton = document.getElementById("delete-page-button");

const toolButtons = document.querySelectorAll(".tool-button");
const colorInput = document.getElementById("color-input");
const widthInput = document.getElementById("width-input");
const toggleSettingsPanelButton = document.getElementById(
  "toggle-settings-panel-button"
);
const settingsPanel = document.getElementById("settings-panel");
const canvasTypeSelect = document.getElementById("canvas-type-select");
const themeToggleButton = document.getElementById("theme-toggle-button");
const downloadBackupButton = document.getElementById("download-backup-button");
const importBackupButton = document.getElementById("import-backup-button");
const importBackupInput = document.getElementById("import-backup-input");
const togglePdfExportMenuButton = document.getElementById(
  "toggle-pdf-export-menu-button"
);
const pdfExportMenu = document.getElementById("pdf-export-menu");
const exportNotebookPdfButton = document.getElementById("export-notebook-pdf-button");
const exportSelectedPagesPdfButton = document.getElementById(
  "export-selected-pages-pdf-button"
);
const pdfPagePickerModal = document.getElementById("pdf-page-picker-modal");
const pdfPagePickerSubtitle = document.getElementById("pdf-page-picker-subtitle");
const pdfPagePickerList = document.getElementById("pdf-page-picker-list");
const closePdfPagePickerButton = document.getElementById(
  "close-pdf-page-picker-button"
);
const selectAllPdfPagesButton = document.getElementById(
  "select-all-pdf-pages-button"
);
const clearPdfPagesButton = document.getElementById("clear-pdf-pages-button");
const cancelPdfExportButton = document.getElementById("cancel-pdf-export-button");
const confirmPdfExportButton = document.getElementById("confirm-pdf-export-button");

const pageTransferModal = document.getElementById("page-transfer-modal");
const pageTransferTitle = document.getElementById("page-transfer-title");
const pageTransferSubtitle = document.getElementById("page-transfer-subtitle");
const pageTransferList = document.getElementById("page-transfer-list");
const closePageTransferButton = document.getElementById("close-page-transfer-button");
const cancelPageTransferButton = document.getElementById("cancel-page-transfer-button");
const confirmPageTransferButton = document.getElementById("confirm-page-transfer-button");

const canvasContextMenu = document.getElementById("canvas-context-menu");
const pasteImageContextButton = document.getElementById("paste-image-context-button");

const extendPageButton = document.getElementById("extend-page-button");
const trimPageButton = document.getElementById("trim-page-button");
const zoomReadout = document.getElementById("zoom-readout");
const resetZoomButton = document.getElementById("reset-zoom-button");
const undoButton = document.getElementById("undo-button");
const redoButton = document.getElementById("redo-button");
const clearPageButton = document.getElementById("clear-page-button");

const pageScroll = document.getElementById("page-scroll");
const pageSurfaceFrame = document.getElementById("page-surface-frame");
const pageSurface = document.getElementById("page-surface");

const state = {
  notebooks: [],
  selectedNotebookId: null,
  selectedPageId: null,

  redoStack: [],
  currentStroke: null,
  drawing: false,
  activePointerId: null,
  lineSnapTimer: null,

  currentTool: "pen",
  currentColor: "#111111",
  penWidth: 2.5,
  highlighterWidth: 14,
  eraserWidth: 18,

  theme: "light",
  sidebarCollapsed: false,
  settingsPanelOpen: false,
  pageSearchOpen: false,
  pdfExportMenuOpen: false,
  pdfPagePickerOpen: false,
  pdfSelectedPageIds: [],
  pdfExportBusy: false,

  pageTransferOpen: false,
  pageTransferMode: "move",
  pageTransferTargetNotebookId: null,

  contextMenuOpen: false,
  contextMenuX: 0,
  contextMenuY: 0,
  contextMenuPastePoint: null,

  zoomScale: 1,

  collapsedSections: {
    notebooks: false,
    pages: false
  },

  selectedImageId: null,
  imageInteraction: null,
  imageEraseSession: null,

  lassoPath: null,
  lassoSelection: null,
  selectionInteraction: null
};

const activeTouchPointers = new Map();
const pinchState = {
  active: false,
  initialDistance: 0,
  initialScale: 1,
  anchorContentPoint: null
};

const imageCache = new Map();

function makeId(prefix) {
  if (crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function normalizeCanvasType(value) {
  return VALID_CANVAS_TYPES.has(value) ? value : "large-lined";
}

function normalizeTheme(value) {
  return VALID_THEMES.has(value) ? value : "light";
}

function normalizeImage(rawImage) {
  if (!rawImage || typeof rawImage.src !== "string") return null;

  return {
    id: typeof rawImage.id === "string" ? rawImage.id : makeId("image"),
    src: rawImage.src,
    x: typeof rawImage.x === "number" ? rawImage.x : 80,
    y: typeof rawImage.y === "number" ? rawImage.y : 80,
    width:
      typeof rawImage.width === "number" && rawImage.width > 0
        ? rawImage.width
        : 240,
    height:
      typeof rawImage.height === "number" && rawImage.height > 0
        ? rawImage.height
        : 180
  };
}

function cloneStroke(stroke) {
  return {
    tool: stroke.tool,
    color: stroke.color,
    width: stroke.width,
    points: Array.isArray(stroke.points)
      ? stroke.points.map((point) => ({ x: point.x, y: point.y }))
      : []
  };
}

function cloneImage(image) {
  return {
    id: makeId("image"),
    src: image.src,
    x: image.x,
    y: image.y,
    width: image.width,
    height: image.height
  };
}

function clonePage(page, nameOverride = page.name) {
  return {
    id: makeId("page"),
    name: nameOverride,
    height: page.height,
    canvasType: normalizeCanvasType(page.canvasType),
    strokes: Array.isArray(page.strokes) ? page.strokes.map(cloneStroke) : [],
    images: Array.isArray(page.images) ? page.images.map(cloneImage) : []
  };
}

function clampZoom(scale) {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale));
}

function updateZoomUi() {
  zoomReadout.textContent = `${Math.round(state.zoomScale * 100)}%`;
  resetZoomButton.disabled = Math.abs(state.zoomScale - 1) < 0.01;
}

function resetZoom() {
  const viewportCenter = {
    x: pageScroll.clientWidth / 2,
    y: pageScroll.clientHeight / 2
  };

  const anchor = getContentPointFromViewportPoint(viewportCenter);

  state.zoomScale = 1;
  updateSurfaceGeometry();
  applyZoomScroll(anchor, viewportCenter);
  redrawCommittedLayer();
  redrawLiveLayer();
}

function getLogicalSurfaceWidth() {
  return Math.max(320, Math.min(1000, pageScroll.clientWidth - 36));
}

function getLogicalSurfaceHeight() {
  const page = getCurrentPage();
  return page ? page.height : DEFAULT_PAGE_HEIGHT;
}

function getViewportPointFromClient(clientPoint) {
  const rect = pageScroll.getBoundingClientRect();

  return {
    x: clientPoint.x - rect.left,
    y: clientPoint.y - rect.top
  };
}

function getContentPointFromViewportPoint(viewportPoint) {
  return {
    x: (pageScroll.scrollLeft + viewportPoint.x) / state.zoomScale,
    y: (pageScroll.scrollTop + viewportPoint.y) / state.zoomScale
  };
}

function applyZoomScroll(anchorContentPoint, viewportPoint) {
  pageScroll.scrollLeft = anchorContentPoint.x * state.zoomScale - viewportPoint.x;
  pageScroll.scrollTop = anchorContentPoint.y * state.zoomScale - viewportPoint.y;
}

function zoomAtClientPoint(clientX, clientY, nextScale) {
  const clampedScale = clampZoom(nextScale);

  if (Math.abs(clampedScale - state.zoomScale) < 0.0001) {
    return;
  }

  const viewportPoint = getViewportPointFromClient({
    x: clientX,
    y: clientY
  });

  const anchorContentPoint = getContentPointFromViewportPoint(viewportPoint);

  state.zoomScale = clampedScale;
  updateSurfaceGeometry();
  applyZoomScroll(anchorContentPoint, viewportPoint);
  redrawCommittedLayer();
  redrawLiveLayer();
}

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function cross(start, end, point) {
  return (end.x - start.x) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x);
}

function perpendicularDistanceToLine(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);

  if (length === 0) {
    return distance(point, start);
  }

  return Math.abs(cross(start, end, point)) / length;
}

function pathLength(points) {
  let total = 0;

  for (let i = 1; i < points.length; i++) {
    total += distance(points[i - 1], points[i]);
  }

  return total;
}

function normalizeAngle(angle) {
  let a = angle;

  while (a < 0) a += Math.PI * 2;
  while (a >= Math.PI * 2) a -= Math.PI * 2;

  return a;
}

function ccwDelta(fromAngle, toAngle) {
  let delta = normalizeAngle(toAngle) - normalizeAngle(fromAngle);
  if (delta < 0) delta += Math.PI * 2;
  return delta;
}

function clockwiseDelta(fromAngle, toAngle) {
  let delta = normalizeAngle(fromAngle) - normalizeAngle(toAngle);
  if (delta < 0) delta += Math.PI * 2;
  return delta;
}

function angleIsOnCcwPath(startAngle, endAngle, testAngle) {
  const total = ccwDelta(startAngle, endAngle);
  const test = ccwDelta(startAngle, testAngle);
  return test <= total;
}

function computeCircleFromThreePoints(p1, p2, p3) {
  const d =
    2 *
    (p1.x * (p2.y - p3.y) +
      p2.x * (p3.y - p1.y) +
      p3.x * (p1.y - p2.y));

  if (Math.abs(d) < 0.0001) return null;

  const p1sq = p1.x * p1.x + p1.y * p1.y;
  const p2sq = p2.x * p2.x + p2.y * p2.y;
  const p3sq = p3.x * p3.x + p3.y * p3.y;

  const ux =
    (p1sq * (p2.y - p3.y) +
      p2sq * (p3.y - p1.y) +
      p3sq * (p1.y - p2.y)) /
    d;

  const uy =
    (p1sq * (p3.x - p2.x) +
      p2sq * (p1.x - p3.x) +
      p3sq * (p2.x - p1.x)) /
    d;

  const center = { x: ux, y: uy };
  const radius = distance(center, p1);

  if (!Number.isFinite(radius) || radius < 1) return null;

  return { center, radius };
}

function buildArcSamplePoints(start, apex, end) {
  const circle = computeCircleFromThreePoints(start, apex, end);
  if (!circle) return null;

  const { center, radius } = circle;

  const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
  const apexAngle = Math.atan2(apex.y - center.y, apex.x - center.x);
  const endAngle = Math.atan2(end.y - center.y, end.x - center.x);

  const useCcw = angleIsOnCcwPath(startAngle, endAngle, apexAngle);
  const sweep = useCcw
    ? ccwDelta(startAngle, endAngle)
    : clockwiseDelta(startAngle, endAngle);

  if (sweep < 0.04 || sweep > Math.PI * 1.85) return null;

  const arcLength = radius * sweep;
  const samples = Math.max(18, Math.min(220, Math.ceil(arcLength / 4)));

  const points = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const angle = useCcw
      ? startAngle + sweep * t
      : startAngle - sweep * t;

    points.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    });
  }

  return {
    points,
    circle,
    sweep,
    arcLength
  };
}

function clearLineSnapTimer() {
  if (state.lineSnapTimer !== null) {
    clearTimeout(state.lineSnapTimer);
    state.lineSnapTimer = null;
  }
}

function isStraightLineCandidate(rawPoints) {
  if (!Array.isArray(rawPoints) || rawPoints.length < 3) return false;

  const start = rawPoints[0];
  const end = rawPoints[rawPoints.length - 1];
  const lineLength = distance(start, end);

  if (lineLength < 16) return false;

  let totalPathLength = 0;
  let maxDeviation = 0;

  for (let i = 1; i < rawPoints.length; i++) {
    totalPathLength += distance(rawPoints[i - 1], rawPoints[i]);
  }

  for (const point of rawPoints) {
    maxDeviation = Math.max(maxDeviation, perpendicularDistanceToLine(point, start, end));
  }

  const maxAllowedDeviation = Math.max(5, lineLength * 0.08);
  const maxAllowedPathRatio = 1.18;

  return (
    maxDeviation <= maxAllowedDeviation &&
    totalPathLength <= lineLength * maxAllowedPathRatio + 2
  );
}

function detectArcCandidate(rawPoints) {
  if (!Array.isArray(rawPoints) || rawPoints.length < 5) return null;
  if (isStraightLineCandidate(rawPoints)) return null;

  const start = rawPoints[0];
  const end = rawPoints[rawPoints.length - 1];
  const chordLength = distance(start, end);

  if (chordLength < 20) return null;

  let apexIndex = -1;
  let apexSignedDeviation = 0;

  for (let i = 1; i < rawPoints.length - 1; i++) {
    const signedDeviation = cross(start, end, rawPoints[i]);
    if (Math.abs(signedDeviation) > Math.abs(apexSignedDeviation)) {
      apexSignedDeviation = signedDeviation;
      apexIndex = i;
    }
  }

  if (apexIndex === -1) return null;

  const apex = rawPoints[apexIndex];
  const apexDeviation = perpendicularDistanceToLine(apex, start, end);
  const minNeededDeviation = Math.max(8, chordLength * 0.11);

  if (apexDeviation < minNeededDeviation) return null;

  const arcBuild = buildArcSamplePoints(start, apex, end);
  if (!arcBuild) return null;

  const { circle, points: arcPoints, arcLength } = arcBuild;
  const sideSign = Math.sign(apexSignedDeviation);

  let wrongSideCount = 0;
  let radiusErrorSum = 0;
  let maxRadiusError = 0;

  for (const point of rawPoints) {
    const pointSide = Math.sign(cross(start, end, point));
    if (pointSide !== 0 && pointSide !== sideSign) {
      wrongSideCount += 1;
    }

    const radiusError = Math.abs(distance(circle.center, point) - circle.radius);
    radiusErrorSum += radiusError;
    maxRadiusError = Math.max(maxRadiusError, radiusError);
  }

  const averageRadiusError = radiusErrorSum / rawPoints.length;
  const maxAllowedRadiusError = Math.max(7, circle.radius * 0.09);
  const avgAllowedRadiusError = Math.max(3.5, circle.radius * 0.04);

  if (wrongSideCount > Math.floor(rawPoints.length * 0.22)) return null;
  if (maxRadiusError > maxAllowedRadiusError) return null;
  if (averageRadiusError > avgAllowedRadiusError) return null;

  const rawPath = pathLength(rawPoints);
  if (rawPath < chordLength * 1.07) return null;
  if (rawPath > arcLength * 1.35 || rawPath < arcLength * 0.72) return null;

  return {
    apexPoint: apex,
    sampledPoints: arcPoints
  };
}

function activateStraightLineMode() {
  const stroke = state.currentStroke;
  if (!stroke || stroke.tool === "eraser") return;
  if (stroke.snapMode) return;
  if (!isStraightLineCandidate(stroke.rawPoints)) return;

  const start = stroke.rawPoints[0];
  const end = stroke.rawPoints[stroke.rawPoints.length - 1];

  stroke.snapMode = "line";
  stroke.points = [start, end];

  redrawLiveLayer();
}

function activateArcMode() {
  const stroke = state.currentStroke;
  if (!stroke || stroke.tool === "eraser") return;
  if (stroke.snapMode) return;

  const arcCandidate = detectArcCandidate(stroke.rawPoints);
  if (!arcCandidate) return;

  stroke.snapMode = "arc";
  stroke.arcApexPoint = arcCandidate.apexPoint;
  stroke.points = arcCandidate.sampledPoints;

  redrawLiveLayer();
}

function activateBestSnapMode() {
  const stroke = state.currentStroke;
  if (!stroke || stroke.tool === "eraser") return;
  if (stroke.snapMode) return;

  if (isStraightLineCandidate(stroke.rawPoints)) {
    activateStraightLineMode();
    return;
  }

  activateArcMode();
}

function scheduleLineSnapTimer() {
  clearLineSnapTimer();

  const stroke = state.currentStroke;
  if (!stroke) return;
  if (stroke.tool === "eraser") return;
  if (stroke.snapMode) return;
  if (!state.drawing) return;

  state.lineSnapTimer = window.setTimeout(() => {
    state.lineSnapTimer = null;

    if (!state.drawing || !state.currentStroke) return;
    activateBestSnapMode();
  }, LINE_HOLD_DELAY_MS);
}

function updateArcPreviewFromEndpoint(stroke, endpoint) {
  if (!stroke.arcApexPoint) return false;

  const arcBuild = buildArcSamplePoints(stroke.rawPoints[0], stroke.arcApexPoint, endpoint);
  if (!arcBuild) return false;

  stroke.points = arcBuild.points;
  return true;
}

function appendPointToCurrentStroke(rawPoint, force = false) {
  const stroke = state.currentStroke;
  if (!stroke) return false;

  if (!stroke.rawPoints) {
    stroke.rawPoints = [...stroke.points];
  }

  const lastRawPoint = stroke.rawPoints[stroke.rawPoints.length - 1];
  if (!force && lastRawPoint && distance(lastRawPoint, rawPoint) < RAW_POINT_MIN_DISTANCE) {
    return false;
  }

  stroke.rawPoints.push(rawPoint);

  if (stroke.snapMode === "line") {
    stroke.points = [stroke.rawPoints[0], rawPoint];
    return true;
  }

  if (stroke.snapMode === "arc") {
    return updateArcPreviewFromEndpoint(stroke, rawPoint);
  }

  const lastDisplayPoint = stroke.points[stroke.points.length - 1];
  const nextPoint = force
    ? rawPoint
    : {
        x: lastDisplayPoint.x * SMOOTHING_STRENGTH + rawPoint.x * (1 - SMOOTHING_STRENGTH),
        y: lastDisplayPoint.y * SMOOTHING_STRENGTH + rawPoint.y * (1 - SMOOTHING_STRENGTH)
      };

  const displayMinDistance = force
    ? 0
    : Math.max(DISPLAY_POINT_MIN_DISTANCE, stroke.width * 0.08);

  if (!force && distance(lastDisplayPoint, nextPoint) < displayMinDistance) {
    return false;
  }

  stroke.points.push(nextPoint);
  return true;
}

function computePageHeightWithBottomPadding(page, paddingPx) {
  let maxY = 0;

  if (Array.isArray(page?.strokes)) {
    for (const stroke of page.strokes) {
      if (!stroke || !Array.isArray(stroke.points)) continue;

      for (const point of stroke.points) {
        if (point && typeof point.y === "number" && point.y > maxY) {
          maxY = point.y;
        }
      }
    }
  }

  if (Array.isArray(page?.images)) {
    for (const image of page.images) {
      if (!image) continue;
      const bottom = Number(image.y || 0) + Number(image.height || 0);
      if (bottom > maxY) {
        maxY = bottom;
      }
    }
  }

  return Math.max(DEFAULT_PAGE_HEIGHT, Math.ceil(maxY + paddingPx));
}

function computeRequiredPageHeight(page) {
  return computePageHeightWithBottomPadding(page, 300);
}

function createBlankPage(name) {
  return {
    id: makeId("page"),
    name,
    height: DEFAULT_PAGE_HEIGHT,
    canvasType: "large-lined",
    strokes: [],
    images: []
  };
}

function createBlankNotebook(name) {
  return {
    id: makeId("notebook"),
    name,
    pages: [createBlankPage("Page 1")]
  };
}

function normalizeNotebooks(rawNotebooks) {
  if (!Array.isArray(rawNotebooks)) return [];

  return rawNotebooks.map((notebook, notebookIndex) => {
    const rawPages = Array.isArray(notebook.pages) ? notebook.pages : [];

    const pages = rawPages.map((page, pageIndex) => {
      const strokes = Array.isArray(page.strokes) ? page.strokes : [];
      const images = Array.isArray(page.images)
        ? page.images.map(normalizeImage).filter(Boolean)
        : [];

      const normalizedPage = {
        id: typeof page.id === "string" ? page.id : makeId("page"),
        name:
          typeof page.name === "string" && page.name.trim()
            ? page.name
            : `Page ${pageIndex + 1}`,
        height: DEFAULT_PAGE_HEIGHT,
        canvasType: normalizeCanvasType(page.canvasType),
        strokes,
        images
      };

      normalizedPage.height =
        typeof page.height === "number" && page.height > 0
          ? Math.max(page.height, computeRequiredPageHeight(normalizedPage))
          : computeRequiredPageHeight(normalizedPage);

      return normalizedPage;
    });

    return {
      id: typeof notebook.id === "string" ? notebook.id : makeId("notebook"),
      name:
        typeof notebook.name === "string" && notebook.name.trim()
          ? notebook.name
          : `Notebook ${notebookIndex + 1}`,
      pages: pages.length > 0 ? pages : [createBlankPage("Page 1")]
    };
  });
}

function getCurrentNotebook() {
  return (
    state.notebooks.find((notebook) => notebook.id === state.selectedNotebookId) ||
    null
  );
}

function getCurrentPage() {
  const notebook = getCurrentNotebook();
  if (!notebook) return null;

  return (
    notebook.pages.find((page) => page.id === state.selectedPageId) ||
    notebook.pages[0] ||
    null
  );
}

function getSelectedImage() {
  const page = getCurrentPage();
  if (!page) return null;

  return page.images.find((image) => image.id === state.selectedImageId) || null;
}

function ensureSelections() {
  if (state.notebooks.length === 0) {
    const starterNotebook = createBlankNotebook("Notebook 1");
    state.notebooks = [starterNotebook];
    state.selectedNotebookId = starterNotebook.id;
    state.selectedPageId = starterNotebook.pages[0].id;
    return;
  }

  let notebook = getCurrentNotebook();

  if (!notebook) {
    notebook = state.notebooks[0];
    state.selectedNotebookId = notebook.id;
  }

  if (!Array.isArray(notebook.pages) || notebook.pages.length === 0) {
    notebook.pages = [createBlankPage("Page 1")];
  }

  const pageExists = notebook.pages.some((page) => page.id === state.selectedPageId);

  if (!pageExists) {
    state.selectedPageId = notebook.pages[0].id;
  }
}

function getPersistedAppState() {
  return {
    notebooks: state.notebooks,
    selectedNotebookId: state.selectedNotebookId,
    selectedPageId: state.selectedPageId,
    currentTool: state.currentTool,
    currentColor: state.currentColor,
    penWidth: state.penWidth,
    highlighterWidth: state.highlighterWidth,
    eraserWidth: state.eraserWidth,
    theme: state.theme,
    sidebarCollapsed: state.sidebarCollapsed,
    settingsPanelOpen: state.settingsPanelOpen,
    collapsedSections: state.collapsedSections
  };
}

function saveAppState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getPersistedAppState()));
  } catch (error) {
    console.error("Could not save notes:", error);
  }
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function makeBackupFilename() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `thigma-notes-backup-${stamp}.json`;
}

function downloadBackup() {
  const backupPayload = {
    app: "Thigma Notes",
    exportedAt: new Date().toISOString(),
    version: 1,
    storageKey: STORAGE_KEY,
    backupData: getPersistedAppState()
  };

  downloadTextFile(
    makeBackupFilename(),
    JSON.stringify(backupPayload, null, 2)
  );
}

function resetTransientStateAfterImport() {
  state.redoStack = [];
  state.currentStroke = null;
  state.drawing = false;
  state.activePointerId = null;
  state.lineSnapTimer = null;
  state.selectedImageId = null;
  state.imageInteraction = null;
  state.imageEraseSession = null;
  state.pageTransferOpen = false;
  state.pageTransferMode = "move";
  state.pageTransferTargetNotebookId = null;
  state.contextMenuOpen = false;
  state.contextMenuX = 0;
  state.contextMenuY = 0;
  state.contextMenuPastePoint = null;
  state.zoomScale = 1;

  activeTouchPointers.clear();
  endPinchGesture();
}

function importBackupObject(parsed) {
  const data =
    parsed &&
    typeof parsed === "object" &&
    parsed.backupData &&
    typeof parsed.backupData === "object"
      ? parsed.backupData
      : parsed;

  if (!data || !Array.isArray(data.notebooks)) {
    throw new Error("Backup file is missing notebook data.");
  }

  importNotebookBasedState(data);
  ensureSelections();
  resetTransientStateAfterImport();

  syncControlsFromState();
  renderSidebar();
  resizeCanvases();
  saveAppState();

  pageScroll.scrollTop = 0;
  pageScroll.scrollLeft = 0;
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read backup file."));
    reader.readAsText(file);
  });
}

async function handleImportBackupFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await readFileAsText(file);
    const parsed = JSON.parse(text);
    importBackupObject(parsed);
    window.alert("Backup imported successfully.");
  } catch (error) {
    console.error(error);
    window.alert("Could not import that backup file.");
  } finally {
    importBackupInput.value = "";
  }
}

function applyPdfExportMenuState() {
  pdfExportMenu.classList.toggle("is-collapsed", !state.pdfExportMenuOpen);
  togglePdfExportMenuButton.setAttribute(
    "aria-expanded",
    state.pdfExportMenuOpen ? "true" : "false"
  );
}

function getSelectedPdfPagesInOrder() {
  const notebook = getCurrentNotebook();
  if (!notebook) return [];

  const selectedIds = new Set(state.pdfSelectedPageIds);
  return notebook.pages.filter((page) => selectedIds.has(page.id));
}

function applyPdfPagePickerState() {
  pdfPagePickerModal.classList.toggle("is-hidden", !state.pdfPagePickerOpen);
  confirmPdfExportButton.disabled =
    state.pdfExportBusy || getSelectedPdfPagesInOrder().length === 0;

  confirmPdfExportButton.textContent = state.pdfExportBusy
    ? "Exporting..."
    : "Export PDF";
}

function togglePdfExportMenu() {
  state.pdfExportMenuOpen = !state.pdfExportMenuOpen;
  applyPdfExportMenuState();
}

function closePdfExportMenu() {
  state.pdfExportMenuOpen = false;
  applyPdfExportMenuState();
}

function openPdfPagePicker() {
  closeCanvasContextMenu();

  const currentPage = getCurrentPage();
  state.pdfPagePickerOpen = true;
  state.pdfSelectedPageIds = currentPage ? [currentPage.id] : [];
  renderPdfPagePickerList();
  applyPdfPagePickerState();
}

function closePdfPagePicker() {
  state.pdfPagePickerOpen = false;
  state.pdfSelectedPageIds = [];
  applyPdfPagePickerState();
}

function togglePdfPageSelection(pageId) {
  const selectedIds = new Set(state.pdfSelectedPageIds);

  if (selectedIds.has(pageId)) {
    selectedIds.delete(pageId);
  } else {
    selectedIds.add(pageId);
  }

  state.pdfSelectedPageIds = [...selectedIds];
  renderPdfPagePickerList();
  applyPdfPagePickerState();
}

function selectAllPdfPages() {
  const notebook = getCurrentNotebook();
  if (!notebook) return;

  state.pdfSelectedPageIds = notebook.pages.map((page) => page.id);
  renderPdfPagePickerList();
  applyPdfPagePickerState();
}

function clearPdfPageSelections() {
  state.pdfSelectedPageIds = [];
  renderPdfPagePickerList();
  applyPdfPagePickerState();
}

function renderPdfPagePickerList() {
  const notebook = getCurrentNotebook();
  pdfPagePickerList.innerHTML = "";

  if (!notebook) {
    pdfPagePickerSubtitle.textContent = "No notebook selected";
    return;
  }

  pdfPagePickerSubtitle.textContent = `Current notebook: ${notebook.name}`;

  const selectedIds = new Set(state.pdfSelectedPageIds);

  notebook.pages.forEach((page, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "modal-page-tile";
    button.classList.toggle("is-selected", selectedIds.has(page.id));

    const title = document.createElement("div");
    title.className = "modal-page-title";
    title.textContent = `${index + 1}. ${page.name}`;

    const meta = document.createElement("div");
    meta.className = "modal-page-meta";
    meta.textContent = `${page.strokes.length} stroke${
      page.strokes.length === 1 ? "" : "s"
    } · ${page.images.length} image${page.images.length === 1 ? "" : "s"}`;

    button.append(title, meta);
    button.addEventListener("click", () => togglePdfPageSelection(page.id));

    pdfPagePickerList.append(button);
  });
}

function getTransferTargetNotebooks() {
  const currentNotebook = getCurrentNotebook();
  if (!currentNotebook) return [];

  return state.notebooks.filter((notebook) => notebook.id !== currentNotebook.id);
}

function applyPageTransferState() {
  pageTransferModal.classList.toggle("is-hidden", !state.pageTransferOpen);
  confirmPageTransferButton.disabled = !state.pageTransferTargetNotebookId;
  confirmPageTransferButton.textContent =
    state.pageTransferMode === "move" ? "Move Page" : "Copy Page";
}

function setPageTransferTarget(notebookId) {
  state.pageTransferTargetNotebookId = notebookId;
  renderPageTransferList();
  applyPageTransferState();
}

function renderPageTransferList() {
  pageTransferList.innerHTML = "";

  const currentPage = getCurrentPage();
  const targets = getTransferTargetNotebooks();
  const selectedTargetId = state.pageTransferTargetNotebookId;

  if (!currentPage) {
    pageTransferSubtitle.textContent = "No page selected";
    applyPageTransferState();
    return;
  }

  if (targets.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "modal-page-meta";
    emptyMessage.textContent = "Create another notebook first.";
    pageTransferList.append(emptyMessage);
    state.pageTransferTargetNotebookId = null;
    applyPageTransferState();
    return;
  }

  for (const notebook of targets) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "modal-page-tile";
    button.classList.toggle("is-selected", notebook.id === selectedTargetId);

    const title = document.createElement("div");
    title.className = "modal-page-title";
    title.textContent = notebook.name;

    const meta = document.createElement("div");
    meta.className = "modal-page-meta";
    meta.textContent = `${notebook.pages.length} page${
      notebook.pages.length === 1 ? "" : "s"
    }`;

    button.append(title, meta);
    button.addEventListener("click", () => setPageTransferTarget(notebook.id));

    pageTransferList.append(button);
  }

  applyPageTransferState();
}

function openPageTransfer(mode) {
  endStroke();
  closeCanvasContextMenu();

  const currentNotebook = getCurrentNotebook();
  const currentPage = getCurrentPage();
  const targets = getTransferTargetNotebooks();

  if (!currentNotebook || !currentPage) return;

  if (targets.length === 0) {
    window.alert("Create another notebook first.");
    return;
  }

  state.pageTransferMode = mode;
  state.pageTransferOpen = true;
  state.pageTransferTargetNotebookId = targets[0].id;

  pageTransferTitle.textContent = mode === "move" ? "Move Page" : "Copy Page";
  pageTransferSubtitle.textContent = `"${currentPage.name}" from "${currentNotebook.name}"`;

  renderPageTransferList();
  applyPageTransferState();
}

function closePageTransfer() {
  state.pageTransferOpen = false;
  state.pageTransferMode = "move";
  state.pageTransferTargetNotebookId = null;
  applyPageTransferState();
}

function confirmPageTransfer() {
  const sourceNotebook = getCurrentNotebook();
  const currentPage = getCurrentPage();
  const targetNotebook = state.notebooks.find(
    (notebook) => notebook.id === state.pageTransferTargetNotebookId
  );

  if (!sourceNotebook || !currentPage || !targetNotebook) return;

  if (state.pageTransferMode === "copy") {
    const copiedPage = clonePage(currentPage, currentPage.name);
    copiedPage.height = Math.max(copiedPage.height, computeRequiredPageHeight(copiedPage));

    targetNotebook.pages.push(copiedPage);
    renumberDefaultPages(targetNotebook);

    state.selectedNotebookId = targetNotebook.id;
    state.selectedPageId = copiedPage.id;
  } else {
    const pageIndex = sourceNotebook.pages.findIndex((page) => page.id === currentPage.id);
    if (pageIndex === -1) return;

    const [movedPage] = sourceNotebook.pages.splice(pageIndex, 1);
    targetNotebook.pages.push(movedPage);

    if (sourceNotebook.pages.length === 0) {
      sourceNotebook.pages.push(createBlankPage("Page 1"));
    }

    renumberDefaultPages(sourceNotebook);
    renumberDefaultPages(targetNotebook);

    state.selectedNotebookId = targetNotebook.id;
    state.selectedPageId = movedPage.id;
  }

  state.redoStack = [];
  state.selectedImageId = null;
  state.imageInteraction = null;
  clearLassoSelection(false);
  clearImageEraseSession();
  closeCanvasContextMenu();
  pageScroll.scrollTop = 0;
  pageScroll.scrollLeft = 0;

  closePageTransfer();
  renderSidebar();
  resizeCanvases();
  saveAppState();
}

function getCssVariable(name, fallback = "") {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

function drawExportPageBackground(ctx, width, height, canvasType) {
  ctx.save();

  ctx.fillStyle = getCssVariable("--page-bg", "#ffffff");
  ctx.fillRect(0, 0, width, height);

  if (canvasType === "large-lined") {
    ctx.strokeStyle = getCssVariable(
      "--large-line-color",
      "rgba(37, 99, 235, 0.22)"
    );
    ctx.lineWidth = 1;

    for (let y = 40; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  if (canvasType === "graph") {
    ctx.strokeStyle = getCssVariable(
      "--graph-line-color",
      "rgba(37, 99, 235, 0.2)"
    );
    ctx.lineWidth = 1;

    for (let x = 0; x <= width; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function loadImageForExport(src) {
  return new Promise((resolve, reject) => {
    const img = getCachedImage(src);

    if (img.complete && img.naturalWidth) {
      resolve(img);
      return;
    }

    const onLoad = () => resolve(img);
    const onError = () => reject(new Error("Could not load image for PDF export."));

    img.addEventListener("load", onLoad, { once: true });
    img.addEventListener("error", onError, { once: true });
  });
}

async function renderPageToExportCanvas(page, scale = 2) {
  const width = getLogicalSurfaceWidth();
  const height = page.height;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width * scale));
  canvas.height = Math.max(1, Math.floor(height * scale));

  const ctx = canvas.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.imageSmoothingEnabled = true;

  drawExportPageBackground(
    ctx,
    width,
    height,
    normalizeCanvasType(page.canvasType)
  );

  for (const imageItem of page.images) {
    try {
      const img = await loadImageForExport(imageItem.src);
      ctx.drawImage(
        img,
        imageItem.x,
        imageItem.y,
        imageItem.width,
        imageItem.height
      );
    } catch (error) {
      console.error(error);
    }
  }

  for (const stroke of page.strokes) {
    drawStroke(ctx, stroke);
  }

  return canvas;
}

function makeSafePdfFilename(name) {
  const safeBase = String(name || "thigma-notes")
    .replace(/[\\/:*?"<>|]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");

  return `${safeBase || "thigma-notes"}.pdf`;
}

async function exportPagesToPdf(pages, filenameBase) {
  if (!pages || pages.length === 0) return;

  state.pdfExportBusy = true;
  applyPdfPagePickerState();

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "letter",
      compress: true
    });

    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    const margin = 24;
    const contentWidth = pdfPageWidth - margin * 2;
    const contentHeight = pdfPageHeight - margin * 2;

    let isFirstPdfPage = true;

    for (const page of pages) {
      const renderedCanvas = await renderPageToExportCanvas(page, 2);

      const sliceHeightPx = Math.max(
        1,
        Math.floor((contentHeight * renderedCanvas.width) / contentWidth)
      );

      let offsetY = 0;

      while (offsetY < renderedCanvas.height) {
        const currentSliceHeight = Math.min(
          sliceHeightPx,
          renderedCanvas.height - offsetY
        );

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = renderedCanvas.width;
        sliceCanvas.height = currentSliceHeight;

        const sliceCtx = sliceCanvas.getContext("2d");
        sliceCtx.drawImage(
          renderedCanvas,
          0,
          offsetY,
          renderedCanvas.width,
          currentSliceHeight,
          0,
          0,
          renderedCanvas.width,
          currentSliceHeight
        );

        if (!isFirstPdfPage) {
          pdf.addPage("letter", "portrait");
        }

        isFirstPdfPage = false;

        const renderedHeightInPdf =
          (currentSliceHeight * contentWidth) / renderedCanvas.width;

        pdf.addImage(
          sliceCanvas.toDataURL("image/png"),
          "PNG",
          margin,
          margin,
          contentWidth,
          renderedHeightInPdf,
          undefined,
          "FAST"
        );

        offsetY += currentSliceHeight;
      }
    }

    pdf.save(makeSafePdfFilename(filenameBase));
  } catch (error) {
    console.error(error);
    window.alert("Could not export PDF.");
  } finally {
    state.pdfExportBusy = false;
    applyPdfPagePickerState();
  }
}

async function exportCurrentNotebookToPdf() {
  const notebook = getCurrentNotebook();
  if (!notebook) return;

  closePdfExportMenu();
  await exportPagesToPdf(notebook.pages, notebook.name || "Notebook");
}

function startSelectedPagesPdfExport() {
  closePdfExportMenu();
  openPdfPagePicker();
}

async function confirmSelectedPagesPdfExport() {
  const notebook = getCurrentNotebook();
  const pages = getSelectedPdfPagesInOrder();

  if (!notebook || pages.length === 0) return;

  await exportPagesToPdf(pages, `${notebook.name} Selected Pages`);
  closePdfPagePicker();
}

function importLegacyV1(parsed) {
  const importedNotebook = createBlankNotebook("Imported Notebook");
  importedNotebook.pages[0].name = "Imported Page";
  importedNotebook.pages[0].strokes = Array.isArray(parsed.strokes) ? parsed.strokes : [];
  importedNotebook.pages[0].height = computeRequiredPageHeight(importedNotebook.pages[0]);

  state.notebooks = [importedNotebook];
  state.selectedNotebookId = importedNotebook.id;
  state.selectedPageId = importedNotebook.pages[0].id;

  if (
    parsed.currentTool === "pen" ||
    parsed.currentTool === "highlighter" ||
    parsed.currentTool === "eraser" ||
    parsed.currentTool === "lasso"
  ) {
    state.currentTool = parsed.currentTool;
  }

  if (typeof parsed.currentColor === "string") {
    state.currentColor = parsed.currentColor;
  }

  if (typeof parsed.penWidth === "number") {
    state.penWidth = parsed.penWidth;
  }

  if (typeof parsed.highlighterWidth === "number") {
    state.highlighterWidth = parsed.highlighterWidth;
  }

  if (typeof parsed.eraserWidth === "number") {
    state.eraserWidth = parsed.eraserWidth;
  }
}

function importNotebookBasedState(parsed) {
  state.notebooks = normalizeNotebooks(parsed.notebooks);

  if (typeof parsed.selectedNotebookId === "string") {
    state.selectedNotebookId = parsed.selectedNotebookId;
  }

  if (typeof parsed.selectedPageId === "string") {
    state.selectedPageId = parsed.selectedPageId;
  }

  if (
    parsed.currentTool === "pen" ||
    parsed.currentTool === "highlighter" ||
    parsed.currentTool === "eraser" ||
    parsed.currentTool === "lasso"
  ) {
    state.currentTool = parsed.currentTool;
  }

  if (typeof parsed.currentColor === "string") {
    state.currentColor = parsed.currentColor;
  }

  if (typeof parsed.penWidth === "number") {
    state.penWidth = parsed.penWidth;
  }

  if (typeof parsed.highlighterWidth === "number") {
    state.highlighterWidth = parsed.highlighterWidth;
  }

  if (typeof parsed.eraserWidth === "number") {
    state.eraserWidth = parsed.eraserWidth;
  }

  state.theme = normalizeTheme(parsed.theme);

  if (typeof parsed.sidebarCollapsed === "boolean") {
    state.sidebarCollapsed = parsed.sidebarCollapsed;
  }

  if (typeof parsed.settingsPanelOpen === "boolean") {
    state.settingsPanelOpen = parsed.settingsPanelOpen;
  }

  if (parsed.collapsedSections && typeof parsed.collapsedSections === "object") {
    state.collapsedSections = {
      notebooks: Boolean(parsed.collapsedSections.notebooks),
      pages: Boolean(parsed.collapsedSections.pages)
    };
  }
}

function loadAppState() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      importNotebookBasedState(JSON.parse(saved));
      ensureSelections();
      return;
    } catch (error) {
      console.error("Could not load saved notes:", error);
    }
  }

  for (const key of LEGACY_STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);

      if (key === "thigma-notes-app-v1") {
        importLegacyV1(parsed);
      } else {
        importNotebookBasedState(parsed);
      }

      ensureSelections();
      return;
    } catch (error) {
      console.error(`Could not import ${key}:`, error);
    }
  }

  ensureSelections();
}

function getWidthForTool(tool) {
  if (tool === "highlighter") return state.highlighterWidth;
  if (tool === "eraser") return state.eraserWidth;
  return state.penWidth;
}

function syncWidthControl() {
  widthInput.value = String(getWidthForTool(state.currentTool));
}

function setActiveTool(tool, shouldSave = true) {
  if (
    tool !== "pen" &&
    tool !== "highlighter" &&
    tool !== "eraser" &&
    tool !== "lasso"
  ) {
    tool = "pen";
  }

  state.currentTool = tool;

  for (const button of toolButtons) {
    button.classList.toggle("is-active", button.dataset.tool === tool);
  }

  if (tool !== "lasso") {
    clearLassoSelection(false);
  } else {
    state.selectedImageId = null;
  }

  closeCanvasContextMenu();

  colorInput.disabled = tool === "eraser" || tool === "lasso";
  widthInput.disabled = tool === "lasso";
  syncWidthControl();
  redrawLiveLayer();

  if (shouldSave) {
    saveAppState();
  }
}

function applyThemeState() {
  document.documentElement.dataset.theme = state.theme;

  const nextLabel = state.theme === "dark" ? "Light Mode" : "Dark Mode";
  themeToggleButton.textContent = nextLabel;
  themeToggleButton.title = `Switch to ${nextLabel.toLowerCase()}`;
  themeToggleButton.setAttribute("aria-label", `Switch to ${nextLabel.toLowerCase()}`);
}

function applyCanvasTypeState() {
  const page = getCurrentPage();
  const canvasType = page ? normalizeCanvasType(page.canvasType) : "large-lined";

  pageSurface.dataset.canvasType = canvasType;
  canvasTypeSelect.value = canvasType;
}

function applySettingsPanelState() {
  settingsPanel.classList.toggle("is-collapsed", !state.settingsPanelOpen);
  toggleSettingsPanelButton.setAttribute(
    "aria-expanded",
    state.settingsPanelOpen ? "true" : "false"
  );
}

function applyPageSearchState() {
  pageSearchBar.classList.toggle("is-collapsed", !state.pageSearchOpen);
}

function openPageSearch() {
  state.pageSearchOpen = true;

  if (state.collapsedSections.pages) {
    state.collapsedSections.pages = false;
    applyCollapseState();
    saveAppState();
  }

  applyPageSearchState();
  pageSearchInput.focus();
  pageSearchInput.select();
}

function closePageSearch(clearValue = false) {
  state.pageSearchOpen = false;
  applyPageSearchState();

  if (clearValue) {
    pageSearchInput.value = "";
  }
}

function togglePageSearch() {
  if (state.pageSearchOpen) {
    closePageSearch(false);
  } else {
    openPageSearch();
  }
}

function normalizeSearchText(text) {
  return text.trim().toLowerCase();
}

function findBestPageMatch(query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return null;

  let bestMatch = null;

  for (let notebookIndex = 0; notebookIndex < state.notebooks.length; notebookIndex++) {
    const notebook = state.notebooks[notebookIndex];

    for (let pageIndex = 0; pageIndex < notebook.pages.length; pageIndex++) {
      const page = notebook.pages[pageIndex];
      const pageName = page.name.trim().toLowerCase();

      let matchTier = null;

      if (pageName === normalizedQuery) {
        matchTier = 0;
      } else if (pageName.startsWith(normalizedQuery)) {
        matchTier = 1;
      } else if (pageName.includes(normalizedQuery)) {
        matchTier = 2;
      } else {
        continue;
      }

      const currentNotebookPenalty = notebook.id === state.selectedNotebookId ? 0 : 1;
      const candidate = {
        notebookId: notebook.id,
        pageId: page.id,
        rank: [matchTier, currentNotebookPenalty, notebookIndex, pageIndex]
      };

      if (!bestMatch) {
        bestMatch = candidate;
        continue;
      }

      const [a0, a1, a2, a3] = candidate.rank;
      const [b0, b1, b2, b3] = bestMatch.rank;

      if (
        a0 < b0 ||
        (a0 === b0 && a1 < b1) ||
        (a0 === b0 && a1 === b1 && a2 < b2) ||
        (a0 === b0 && a1 === b1 && a2 === b2 && a3 < b3)
      ) {
        bestMatch = candidate;
      }
    }
  }

  return bestMatch;
}

function goToMatchedPage(match) {
  if (!match) return false;

  if (match.notebookId !== state.selectedNotebookId) {
    selectNotebook(match.notebookId);
  }

  if (match.pageId !== state.selectedPageId) {
    selectPage(match.pageId);
  }

  closePageSearch(false);
  return true;
}

function performPageSearch() {
  const match = findBestPageMatch(pageSearchInput.value);

  if (!match) {
    pageSearchInput.focus();
    pageSearchInput.select();
    return;
  }

  goToMatchedPage(match);
}

function closeSettingsPanel() {
  if (!state.settingsPanelOpen) return;

  state.settingsPanelOpen = false;
  state.pdfExportMenuOpen = false;

  applySettingsPanelState();
  applyPdfExportMenuState();
  saveAppState();
}

function applyCanvasContextMenuState() {
  canvasContextMenu.classList.toggle("is-hidden", !state.contextMenuOpen);

  if (!state.contextMenuOpen) return;

  const menuWidth = canvasContextMenu.offsetWidth || 170;
  const menuHeight = canvasContextMenu.offsetHeight || 56;

  const left = Math.max(
    8,
    Math.min(state.contextMenuX, window.innerWidth - menuWidth - 8)
  );
  const top = Math.max(
    8,
    Math.min(state.contextMenuY, window.innerHeight - menuHeight - 8)
  );

  canvasContextMenu.style.left = `${left}px`;
  canvasContextMenu.style.top = `${top}px`;
}

function closeCanvasContextMenu() {
  if (!state.contextMenuOpen && !state.contextMenuPastePoint) return;

  state.contextMenuOpen = false;
  state.contextMenuPastePoint = null;
  applyCanvasContextMenuState();
}

function openCanvasContextMenu(clientX, clientY, pastePoint) {
  state.contextMenuOpen = true;
  state.contextMenuX = clientX;
  state.contextMenuY = clientY;
  state.contextMenuPastePoint = pastePoint;
  applyCanvasContextMenuState();
}

async function readImageBlobFromClipboard() {
  if (!window.isSecureContext || !navigator.clipboard?.read) {
    throw new Error("Clipboard image read is not available here.");
  }

  const clipboardItems = await navigator.clipboard.read();

  for (const item of clipboardItems) {
    const imageType = item.types.find((type) => type.startsWith("image/"));
    if (imageType) {
      return await item.getType(imageType);
    }
  }

  throw new Error("No image found on clipboard.");
}

async function pasteImageFromSystemClipboardAt(point) {
  try {
    const blob = await readImageBlobFromClipboard();
    await pasteImageFromClipboard(blob, point);
  } catch (error) {
    console.error(error);
    window.alert(
      "Could not paste an image from the clipboard here. If needed, try regular Ctrl/Cmd+V."
    );
  }
}

function pointInPolygon(point, polygon) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || 0.000001) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
}

function getStrokeBounds(stroke) {
  if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) {
    return null;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of stroke.points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function getImageBounds(image) {
  return {
    minX: image.x,
    minY: image.y,
    maxX: image.x + image.width,
    maxY: image.y + image.height,
    width: image.width,
    height: image.height
  };
}

function mergeBounds(boundsList) {
  if (!boundsList.length) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const bounds of boundsList) {
    minX = Math.min(minX, bounds.minX);
    minY = Math.min(minY, bounds.minY);
    maxX = Math.max(maxX, bounds.maxX);
    maxY = Math.max(maxY, bounds.maxY);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function selectionHasContent() {
  return Boolean(
    state.lassoSelection &&
      (state.lassoSelection.strokes.length > 0 ||
        state.lassoSelection.images.length > 0)
  );
}

function computeLassoSelectionBounds(selection = state.lassoSelection) {
  if (!selection) return null;

  const boundsList = [];

  for (const stroke of selection.strokes) {
    const bounds = getStrokeBounds(stroke);
    if (bounds) boundsList.push(bounds);
  }

  for (const image of selection.images) {
    boundsList.push(getImageBounds(image));
  }

  return mergeBounds(boundsList);
}

function clearLassoSelection(shouldRedraw = true) {
  state.lassoPath = null;
  state.lassoSelection = null;
  state.selectionInteraction = null;

  if (shouldRedraw) {
    redrawLiveLayer();
  }
}

function pointInSelectionBounds(point) {
  const bounds = state.lassoSelection?.bounds;
  if (!bounds) return false;

  return (
    point.x >= bounds.minX - SELECTION_HIT_PADDING &&
    point.x <= bounds.maxX + SELECTION_HIT_PADDING &&
    point.y >= bounds.minY - SELECTION_HIT_PADDING &&
    point.y <= bounds.maxY + SELECTION_HIT_PADDING
  );
}

function buildLassoSelectionFromPath(path) {
  const page = getCurrentPage();
  if (!page || path.length < 3) {
    return {
      strokes: [],
      images: [],
      bounds: null
    };
  }

  const selectedStrokes = [];
  const selectedImages = [];

  for (const stroke of page.strokes) {
    if (stroke.points.some((point) => pointInPolygon(point, path))) {
      selectedStrokes.push(stroke);
    }
  }

  for (const image of page.images) {
    const samplePoints = [
      { x: image.x, y: image.y },
      { x: image.x + image.width, y: image.y },
      { x: image.x, y: image.y + image.height },
      { x: image.x + image.width, y: image.y + image.height },
      { x: image.x + image.width / 2, y: image.y + image.height / 2 }
    ];

    if (samplePoints.some((point) => pointInPolygon(point, path))) {
      selectedImages.push(image);
    }
  }

  const selection = {
    strokes: selectedStrokes,
    images: selectedImages,
    bounds: null
  };

  selection.bounds = computeLassoSelectionBounds(selection);
  return selection;
}

function moveLassoSelectionBy(dx, dy) {
  const page = getCurrentPage();
  if (!page || !selectionHasContent()) return;

  const bounds = state.lassoSelection.bounds;
  const safeDx = bounds ? Math.max(dx, -bounds.minX) : dx;
  const safeDy = bounds ? Math.max(dy, -bounds.minY) : dy;

  if (safeDx === 0 && safeDy === 0) return;

  for (const stroke of state.lassoSelection.strokes) {
    for (const point of stroke.points) {
      point.x += safeDx;
      point.y += safeDy;
    }
  }

  for (const image of state.lassoSelection.images) {
    image.x += safeDx;
    image.y += safeDy;
  }

  page.height = Math.max(page.height, computeRequiredPageHeight(page));
  state.lassoSelection.bounds = computeLassoSelectionBounds(state.lassoSelection);

  redrawCommittedLayer();
  redrawLiveLayer();
}

function deleteLassoSelection() {
  const page = getCurrentPage();
  if (!page || !selectionHasContent()) return;

  const selectedStrokes = new Set(state.lassoSelection.strokes);
  const selectedImages = new Set(state.lassoSelection.images);

  page.strokes = page.strokes.filter((stroke) => !selectedStrokes.has(stroke));
  page.images = page.images.filter((image) => !selectedImages.has(image));

  page.height = computePageHeightWithBottomPadding(page, 400);
  state.redoStack = [];

  clearLassoSelection(false);
  redrawCommittedLayer();
  redrawLiveLayer();
  renderSidebar();
  saveAppState();
}

function drawLassoPath(ctx, points) {
  if (!points || points.length === 0) return;

  ctx.save();
  ctx.strokeStyle = "#2563eb";
  ctx.fillStyle = "rgba(37, 99, 235, 0.08)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([7, 5]);

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  if (points.length > 2) {
    ctx.closePath();
    ctx.fill();
  }

  ctx.stroke();
  ctx.restore();
}

function drawLassoSelectionOverlay(ctx, selection) {
  if (!selection?.bounds) return;

  const bounds = selection.bounds;

  ctx.save();
  ctx.strokeStyle = "#2563eb";
  ctx.fillStyle = "rgba(37, 99, 235, 0.06)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 5]);

  ctx.fillRect(bounds.minX, bounds.minY, bounds.width, bounds.height);
  ctx.strokeRect(bounds.minX, bounds.minY, bounds.width, bounds.height);

  ctx.restore();
}

function startLassoInteraction(e) {
  if (!canStartStroke(e)) return;

  e.preventDefault();
  closeCanvasContextMenu();

  const point = getPointFromEvent(e);

  if (selectionHasContent() && pointInSelectionBounds(point)) {
    state.selectionInteraction = {
      pointerId: e.pointerId,
      lastPoint: point
    };
    state.activePointerId = e.pointerId;
    liveCanvas.setPointerCapture(e.pointerId);
    redrawLiveLayer();
    return;
  }

  state.selectedImageId = null;
  state.lassoSelection = null;
  state.selectionInteraction = null;
  state.lassoPath = [point];
  state.activePointerId = e.pointerId;
  liveCanvas.setPointerCapture(e.pointerId);
  redrawLiveLayer();
}

function updateLassoInteraction(e) {
  if (e.pointerId !== state.activePointerId) return;

  e.preventDefault();
  const point = getPointFromEvent(e);

  if (state.selectionInteraction) {
    const dx = point.x - state.selectionInteraction.lastPoint.x;
    const dy = point.y - state.selectionInteraction.lastPoint.y;

    state.selectionInteraction.lastPoint = point;
    moveLassoSelectionBy(dx, dy);
    return;
  }

  if (!state.lassoPath) return;

  const lastPoint = state.lassoPath[state.lassoPath.length - 1];
  if (!lastPoint || distance(lastPoint, point) >= LASSO_POINT_MIN_DISTANCE) {
    state.lassoPath.push(point);
    redrawLiveLayer();
  }
}

function finishLassoInteraction(e) {
  if (state.activePointerId === null) return false;
  if (e && e.pointerId !== undefined && e.pointerId !== state.activePointerId) {
    return false;
  }

  const pointerId = e?.pointerId ?? state.activePointerId;

  if (state.selectionInteraction) {
    state.selectionInteraction = null;
    state.activePointerId = null;

    try {
      liveCanvas.releasePointerCapture(pointerId);
    } catch {
      // ignore
    }

    redrawLiveLayer();
    renderSidebar();
    saveAppState();
    return true;
  }

  if (!state.lassoPath) return false;

  const finishedPath = [...state.lassoPath];
  state.lassoPath = null;
  state.activePointerId = null;

  try {
    liveCanvas.releasePointerCapture(pointerId);
  } catch {
    // ignore
  }

  if (finishedPath.length < 3) {
    clearLassoSelection();
    return true;
  }

  const selection = buildLassoSelectionFromPath(finishedPath);

  if (selection.strokes.length === 0 && selection.images.length === 0) {
    clearLassoSelection();
    return true;
  }

  state.lassoSelection = selection;
  redrawLiveLayer();
  return true;
}

function syncControlsFromState() {
  colorInput.value = state.currentColor;
  setActiveTool(state.currentTool, false);
  syncWidthControl();
  applyThemeState();
  applyCanvasTypeState();
  applySettingsPanelState();
  applyPageSearchState();
  applyPdfExportMenuState();
  applyPdfPagePickerState();
  applyPageTransferState();
  applyCanvasContextMenuState();
}

function syncLocationLabel() {
  const notebook = getCurrentNotebook();
  const page = getCurrentPage();

  locationLabel.textContent =
    notebook && page ? `${notebook.name} / ${page.name}` : "No page selected";
}

function applyCollapseState() {
  appShell.classList.toggle("sidebar-collapsed", state.sidebarCollapsed);

  toggleSidebarButton.textContent = state.sidebarCollapsed ? "▸" : "◂";
  toggleSidebarButton.title = state.sidebarCollapsed
    ? "Expand sidebar"
    : "Collapse sidebar";
  toggleSidebarButton.setAttribute(
    "aria-label",
    state.sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
  );

  notebookList.classList.toggle("is-collapsed", state.collapsedSections.notebooks);
  pageList.classList.toggle("is-collapsed", state.collapsedSections.pages);

  toggleNotebooksButton.textContent = state.collapsedSections.notebooks ? "▸" : "▾";
  togglePagesButton.textContent = state.collapsedSections.pages ? "▸" : "▾";
}

function renderNotebookList() {
  notebookList.innerHTML = "";

  for (const notebook of state.notebooks) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-item";

    if (notebook.id === state.selectedNotebookId) {
      button.classList.add("is-active");
    }

    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = notebook.name;

    const meta = document.createElement("span");
    meta.className = "item-meta";
    meta.textContent = `${notebook.pages.length} page${
      notebook.pages.length === 1 ? "" : "s"
    }`;

    button.append(name, meta);
    button.addEventListener("click", () => selectNotebook(notebook.id));

    notebookList.append(button);
  }
}

function renderPageList() {
  pageList.innerHTML = "";

  const notebook = getCurrentNotebook();
  if (!notebook) return;

  for (const page of notebook.pages) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-item";

    if (page.id === state.selectedPageId) {
      button.classList.add("is-active");
    }

    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = page.name;

    const meta = document.createElement("span");
    meta.className = "item-meta";
    meta.textContent = `${page.strokes.length} stroke${
      page.strokes.length === 1 ? "" : "s"
    } · ${page.images.length} image${page.images.length === 1 ? "" : "s"}`;

    button.append(name, meta);
    button.addEventListener("click", () => selectPage(page.id));

    pageList.append(button);
  }
}

function renderSidebar() {
  renderNotebookList();
  renderPageList();
  syncLocationLabel();
  applyCanvasTypeState();
  applySettingsPanelState();
  applyPageSearchState();
  applyCollapseState();
  applyPdfExportMenuState();

  if (state.pdfPagePickerOpen) {
    renderPdfPagePickerList();
    applyPdfPagePickerState();
  }

  if (state.pageTransferOpen) {
    renderPageTransferList();
    applyPageTransferState();
  }
}

function setupCanvas(canvas, ctx) {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(getLogicalSurfaceWidth(), 1);
  const height = Math.max(getLogicalSurfaceHeight(), 1);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.imageSmoothingEnabled = true;
}

function updateSurfaceGeometry() {
  const logicalWidth = getLogicalSurfaceWidth();
  const logicalHeight = getLogicalSurfaceHeight();

  pageSurface.style.width = `${logicalWidth}px`;
  pageSurface.style.height = `${logicalHeight}px`;
  pageSurface.style.transform = `scale(${state.zoomScale})`;

  pageSurfaceFrame.style.width = `${logicalWidth * state.zoomScale}px`;
  pageSurfaceFrame.style.height = `${logicalHeight * state.zoomScale}px`;

  updateZoomUi();
}

function clearCanvas(ctx, canvas) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function getCachedImage(src) {
  const cached = imageCache.get(src);
  if (cached) return cached;

  const img = new Image();
  img.onload = () => {
    redrawCommittedLayer();
    redrawLiveLayer();
  };
  img.src = src;
  imageCache.set(src, img);
  return img;
}

function getImageEraseDraft(imageId) {
  return state.imageEraseSession?.drafts.get(imageId) || null;
}

function ensureImageDraft(page, imageItem) {
  if (!state.imageEraseSession) {
    state.imageEraseSession = { drafts: new Map() };
  }

  const existing = state.imageEraseSession.drafts.get(imageItem.id);
  if (existing) return existing;

  const img = getCachedImage(imageItem.src);
  if (!img.complete || !img.naturalWidth) return null;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(imageItem.width));
  canvas.height = Math.max(1, Math.round(imageItem.height));

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const draft = {
    imageId: imageItem.id,
    originalSrc: imageItem.src,
    canvas,
    ctx
  };

  state.imageEraseSession.drafts.set(imageItem.id, draft);
  return draft;
}

function clearImageEraseSession() {
  state.imageEraseSession = null;
}

function commitImageEraseSession() {
  const page = getCurrentPage();
  const session = state.imageEraseSession;
  if (!page || !session) return;

  for (const [imageId, draft] of session.drafts.entries()) {
    const imageItem = page.images.find((image) => image.id === imageId);
    if (!imageItem) continue;

    const newSrc = draft.canvas.toDataURL("image/png");
    imageCache.delete(draft.originalSrc);

    const newImg = new Image();
    newImg.src = newSrc;
    imageCache.set(newSrc, newImg);

    imageItem.src = newSrc;
  }

  clearImageEraseSession();
}

function applyStrokeStyle(ctx, stroke) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = stroke.width;

  if (stroke.tool === "highlighter") {
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.globalAlpha = 0.25;
    ctx.globalCompositeOperation = "multiply";
    return;
  }

  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

function drawDot(ctx, stroke, point) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, Math.max(stroke.width / 2, 1), 0, Math.PI * 2);
  ctx.fill();
}

function drawStroke(ctx, stroke) {
  if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) {
    return;
  }

  ctx.save();
  applyStrokeStyle(ctx, stroke);

  const pts = stroke.points;

  if (pts.length === 1) {
    drawDot(ctx, stroke, pts[0]);
    ctx.restore();
    return;
  }

  if (pts.length === 2) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo(pts[1].x, pts[1].y);
    ctx.stroke();
    ctx.restore();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);

  for (let i = 1; i < pts.length - 1; i++) {
    const current = pts[i];
    const next = pts[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;

    ctx.quadraticCurveTo(current.x, current.y, midX, midY);
  }

  const last = pts[pts.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.stroke();

  ctx.restore();
}

function drawImageItem(ctx, imageItem) {
  const draft = getImageEraseDraft(imageItem.id);
  if (draft) {
    ctx.drawImage(draft.canvas, imageItem.x, imageItem.y, imageItem.width, imageItem.height);
    return;
  }

  const img = getCachedImage(imageItem.src);
  if (!img.complete || !img.naturalWidth) return;

  ctx.drawImage(img, imageItem.x, imageItem.y, imageItem.width, imageItem.height);
}

function drawImageSelection(ctx, imageItem) {
  ctx.save();

  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(imageItem.x, imageItem.y, imageItem.width, imageItem.height);
  ctx.setLineDash([]);

  const handleX = imageItem.x + imageItem.width - IMAGE_HANDLE_SIZE / 2;
  const handleY = imageItem.y + imageItem.height - IMAGE_HANDLE_SIZE / 2;

  ctx.fillStyle = "#3b82f6";
  ctx.fillRect(handleX, handleY, IMAGE_HANDLE_SIZE, IMAGE_HANDLE_SIZE);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.strokeRect(handleX, handleY, IMAGE_HANDLE_SIZE, IMAGE_HANDLE_SIZE);

  ctx.restore();
}

function redrawCommittedLayer() {
  clearCanvas(committedCtx, committedCanvas);

  const page = getCurrentPage();
  if (!page) return;

  for (const image of page.images) {
    drawImageItem(committedCtx, image);
  }

  for (const stroke of page.strokes) {
    drawStroke(committedCtx, stroke);
  }
}

function redrawLiveLayer() {
  clearCanvas(liveCtx, liveCanvas);

  if (state.currentStroke && state.currentStroke.tool !== "eraser") {
    drawStroke(liveCtx, state.currentStroke);
  }

  if (state.lassoPath) {
    drawLassoPath(liveCtx, state.lassoPath);
  }

  if (selectionHasContent()) {
    drawLassoSelectionOverlay(liveCtx, state.lassoSelection);
    return;
  }

  const selectedImage = getSelectedImage();
  if (selectedImage) {
    drawImageSelection(liveCtx, selectedImage);
  }
}

function resizeCanvases() {
  updateSurfaceGeometry();
  setupCanvas(committedCanvas, committedCtx);
  setupCanvas(liveCanvas, liveCtx);
  redrawCommittedLayer();
  redrawLiveLayer();
}

function getPointFromEvent(e) {
  const rect = pageSurface.getBoundingClientRect();
  const logicalWidth = getLogicalSurfaceWidth();
  const logicalHeight = getLogicalSurfaceHeight();

  const x = Math.max(0, Math.min((e.clientX - rect.left) / state.zoomScale, logicalWidth));
  const y = Math.max(0, Math.min((e.clientY - rect.top) / state.zoomScale, logicalHeight));

  return { x, y };
}

function pointInImage(point, imageItem) {
  return (
    point.x >= imageItem.x &&
    point.x <= imageItem.x + imageItem.width &&
    point.y >= imageItem.y &&
    point.y <= imageItem.y + imageItem.height
  );
}

function pointInResizeHandle(point, imageItem) {
  const handleX = imageItem.x + imageItem.width - IMAGE_HANDLE_SIZE / 2;
  const handleY = imageItem.y + imageItem.height - IMAGE_HANDLE_SIZE / 2;

  return (
    point.x >= handleX &&
    point.x <= handleX + IMAGE_HANDLE_SIZE &&
    point.y >= handleY &&
    point.y <= handleY + IMAGE_HANDLE_SIZE
  );
}

function bringImageToFront(page, imageId) {
  const index = page.images.findIndex((image) => image.id === imageId);
  if (index === -1) return;

  const [image] = page.images.splice(index, 1);
  page.images.push(image);
}

function hitTestImage(point) {
  const page = getCurrentPage();
  if (!page) return null;

  for (let i = page.images.length - 1; i >= 0; i--) {
    const image = page.images[i];

    if (pointInResizeHandle(point, image)) {
      return { image, mode: "resize" };
    }

    if (pointInImage(point, image)) {
      return { image, mode: "drag" };
    }
  }

  return null;
}

function canStartStroke(e) {
  if (e.pointerType === "touch") return true;
  if (e.pointerType === "pen") return true;
  if (e.pointerType === "mouse" && e.button === 0) return true;
  return false;
}

function renumberDefaultPages(notebook) {
  if (!notebook) return;

  for (let i = 0; i < notebook.pages.length; i++) {
    const page = notebook.pages[i];

    if (/^Page \\d+$/.test(page.name)) {
      page.name = `Page ${i + 1}`;
    }
  }
}

function distanceSquared(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function pointNearAny(point, eraserPoints, radius) {
  const radiusSq = radius * radius;

  for (const eraserPoint of eraserPoints) {
    if (distanceSquared(point, eraserPoint) <= radiusSq) {
      return true;
    }
  }

  return false;
}

function eraseStrokesWithPoints(page, eraserPoints, radius) {
  const nextStrokes = [];

  for (const stroke of page.strokes) {
    if (!stroke || !Array.isArray(stroke.points) || stroke.points.length === 0) {
      continue;
    }

    const keptSegments = [];
    let currentSegment = [];

    for (const point of stroke.points) {
      if (pointNearAny(point, eraserPoints, radius)) {
        if (currentSegment.length > 0) {
          keptSegments.push(currentSegment);
          currentSegment = [];
        }
      } else {
        currentSegment.push(point);
      }
    }

    if (currentSegment.length > 0) {
      keptSegments.push(currentSegment);
    }

    if (keptSegments.length === 1 && keptSegments[0].length === stroke.points.length) {
      nextStrokes.push(stroke);
      continue;
    }

    for (const segment of keptSegments) {
      if (segment.length === 0) continue;

      nextStrokes.push({
        ...stroke,
        points: segment
      });
    }
  }

  page.strokes = nextStrokes;
}

function imageIntersectsEraser(imageItem, eraserPoints, radius) {
  const left = imageItem.x - radius;
  const top = imageItem.y - radius;
  const right = imageItem.x + imageItem.width + radius;
  const bottom = imageItem.y + imageItem.height + radius;

  for (const point of eraserPoints) {
    if (
      point.x >= left &&
      point.x <= right &&
      point.y >= top &&
      point.y <= bottom
    ) {
      return true;
    }
  }

  return false;
}

function eraseImagesWithPoints(page, eraserPoints, radius) {
  for (const imageItem of page.images) {
    if (!imageIntersectsEraser(imageItem, eraserPoints, radius)) continue;

    const draft = ensureImageDraft(page, imageItem);
    if (!draft) continue;

    draft.ctx.globalCompositeOperation = "destination-out";
    draft.ctx.fillStyle = "rgba(0,0,0,1)";

    for (const point of eraserPoints) {
      const localX = point.x - imageItem.x;
      const localY = point.y - imageItem.y;

      draft.ctx.beginPath();
      draft.ctx.arc(localX, localY, radius, 0, Math.PI * 2);
      draft.ctx.fill();
    }
  }
}

function applyDestructiveEraserPoints(eraserPoints, radius) {
  const page = getCurrentPage();
  if (!page || eraserPoints.length === 0) return;

  eraseStrokesWithPoints(page, eraserPoints, radius);
  eraseImagesWithPoints(page, eraserPoints, radius);

  page.height = Math.max(page.height, computeRequiredPageHeight(page));
  redrawCommittedLayer();
  redrawLiveLayer();
}

function startImageInteraction(e, hit) {
  const page = getCurrentPage();
  if (!page) return;

  bringImageToFront(page, hit.image.id);
  state.selectedImageId = hit.image.id;

  const selectedImage = getSelectedImage();
  if (!selectedImage) return;

  state.imageInteraction = {
    mode: hit.mode,
    pointerId: e.pointerId,
    startPoint: getPointFromEvent(e),
    startX: selectedImage.x,
    startY: selectedImage.y,
    startWidth: selectedImage.width,
    startHeight: selectedImage.height
  };

  liveCanvas.setPointerCapture(e.pointerId);
  redrawCommittedLayer();
  redrawLiveLayer();
}

function moveSelectedImage(e) {
  const interaction = state.imageInteraction;
  const image = getSelectedImage();
  const page = getCurrentPage();

  if (!interaction || !image || !page) return false;
  if (interaction.pointerId !== e.pointerId) return false;

  const point = getPointFromEvent(e);
  const dx = point.x - interaction.startPoint.x;
  const dy = point.y - interaction.startPoint.y;

  if (interaction.mode === "drag") {
    image.x = Math.max(0, interaction.startX + dx);
    image.y = Math.max(0, interaction.startY + dy);
  } else if (interaction.mode === "resize") {
    image.width = Math.max(IMAGE_MIN_SIZE, interaction.startWidth + dx);
    image.height = Math.max(IMAGE_MIN_SIZE, interaction.startHeight + dy);
  }

  page.height = Math.max(page.height, computeRequiredPageHeight(page));
  redrawCommittedLayer();
  redrawLiveLayer();

  return true;
}

function finishImageInteraction(e) {
  const interaction = state.imageInteraction;
  if (!interaction) return false;
  if (e && interaction.pointerId !== e.pointerId) return false;

  clearImageInteraction();
  const page = getCurrentPage();
  if (page) {
    page.height = Math.max(page.height, computeRequiredPageHeight(page));
  }

  redrawCommittedLayer();
  redrawLiveLayer();
  renderSidebar();
  saveAppState();
  return true;
}

function clearImageInteraction() {
  state.imageInteraction = null;
}

function selectNotebook(notebookId) {
  endStroke();

  if (state.selectedNotebookId === notebookId) return;

  state.selectedNotebookId = notebookId;

  const notebook = getCurrentNotebook();
  state.selectedPageId = notebook?.pages[0]?.id ?? null;

  state.redoStack = [];
  state.selectedImageId = null;
  state.imageInteraction = null;
  clearLassoSelection(false);
  closePageTransfer();
  closeCanvasContextMenu();
  pageScroll.scrollTop = 0;

  renderSidebar();
  resizeCanvases();
  saveAppState();
}

function selectPage(pageId) {
  endStroke();

  if (state.selectedPageId === pageId) return;

  state.selectedPageId = pageId;
  state.redoStack = [];
  state.selectedImageId = null;
  state.imageInteraction = null;
  clearLassoSelection(false);
  closePageTransfer();
  closeCanvasContextMenu();
  pageScroll.scrollTop = 0;

  renderSidebar();
  resizeCanvases();
  saveAppState();
}

function createNotebook() {
  endStroke();

  const notebook = createBlankNotebook(`Notebook ${state.notebooks.length + 1}`);
  state.notebooks.push(notebook);
  state.selectedNotebookId = notebook.id;
  state.selectedPageId = notebook.pages[0].id;
  state.redoStack = [];
  state.selectedImageId = null;
  state.imageInteraction = null;
  clearLassoSelection(false);
  closePageTransfer();
  closeCanvasContextMenu();
  pageScroll.scrollTop = 0;

  renderSidebar();
  resizeCanvases();
  saveAppState();
}

function renameCurrentNotebook() {
  const notebook = getCurrentNotebook();
  if (!notebook) return;

  const nextName = window.prompt("Rename notebook", notebook.name);
  if (nextName === null) return;

  const trimmed = nextName.trim();
  if (!trimmed) return;

  notebook.name = trimmed;
  renderSidebar();
  saveAppState();
}

function deleteCurrentNotebook() {
  endStroke();

  const notebook = getCurrentNotebook();
  if (!notebook) return;

  const confirmed = window.confirm(`Delete notebook "${notebook.name}"?`);
  if (!confirmed) return;

  const notebookIndex = state.notebooks.findIndex((item) => item.id === notebook.id);
  if (notebookIndex === -1) return;

  state.notebooks.splice(notebookIndex, 1);

  if (state.notebooks.length === 0) {
    const replacementNotebook = createBlankNotebook("Notebook 1");
    state.notebooks.push(replacementNotebook);
    state.selectedNotebookId = replacementNotebook.id;
    state.selectedPageId = replacementNotebook.pages[0].id;
  } else {
    const nextIndex = Math.min(notebookIndex, state.notebooks.length - 1);
    const nextNotebook = state.notebooks[nextIndex];

    state.selectedNotebookId = nextNotebook.id;
    state.selectedPageId = nextNotebook.pages[0]?.id ?? null;
  }

  state.redoStack = [];
  state.currentStroke = null;
  state.drawing = false;
  state.activePointerId = null;
  state.selectedImageId = null;
  state.imageInteraction = null;
  clearImageEraseSession();
  clearLineSnapTimer();
  closePageTransfer();
  closeCanvasContextMenu();
  pageScroll.scrollTop = 0;
  pageScroll.scrollLeft = 0;

  renderSidebar();
  resizeCanvases();
  saveAppState();
}

function createPage() {
  endStroke();

  const notebook = getCurrentNotebook();
  if (!notebook) return;

  const page = createBlankPage(`Page ${notebook.pages.length + 1}`);
  notebook.pages.push(page);
  state.selectedPageId = page.id;
  state.redoStack = [];
  state.selectedImageId = null;
  state.imageInteraction = null;
  clearLassoSelection(false);
  closePageTransfer();
  closeCanvasContextMenu();
  pageScroll.scrollTop = 0;

  renderSidebar();
  resizeCanvases();
  saveAppState();
}

function duplicateCurrentPage() {
  endStroke();

  const notebook = getCurrentNotebook();
  const page = getCurrentPage();

  if (!notebook || !page) return;

  const pageIndex = notebook.pages.findIndex((item) => item.id === page.id);
  if (pageIndex === -1) return;

  const duplicatedPage = clonePage(page, `${page.name} Copy`);
  duplicatedPage.height = Math.max(duplicatedPage.height, computeRequiredPageHeight(duplicatedPage));

  notebook.pages.splice(pageIndex + 1, 0, duplicatedPage);

  state.selectedPageId = duplicatedPage.id;
  state.redoStack = [];
  state.selectedImageId = null;
  state.imageInteraction = null;
  clearLassoSelection(false);
  closePageTransfer();
  closeCanvasContextMenu();
  pageScroll.scrollTop = 0;

  renderSidebar();
  resizeCanvases();
  saveAppState();
}

function renameCurrentPage() {
  const page = getCurrentPage();
  if (!page) return;

  const nextName = window.prompt("Rename page", page.name);
  if (nextName === null) return;

  const trimmed = nextName.trim();
  if (!trimmed) return;

  page.name = trimmed;
  renderSidebar();
  saveAppState();
}

function deleteCurrentPage() {
  endStroke();

  const notebook = getCurrentNotebook();
  const page = getCurrentPage();

  if (!notebook || !page) return;

  const confirmed = window.confirm(`Delete "${page.name}"?`);
  if (!confirmed) return;

  const pageIndex = notebook.pages.findIndex((item) => item.id === page.id);
  if (pageIndex === -1) return;

  notebook.pages.splice(pageIndex, 1);

  if (notebook.pages.length === 0) {
    const replacementPage = createBlankPage("Page 1");
    notebook.pages.push(replacementPage);
    state.selectedPageId = replacementPage.id;
  } else {
    const nextIndex = Math.min(pageIndex, notebook.pages.length - 1);
    state.selectedPageId = notebook.pages[nextIndex].id;
  }

  renumberDefaultPages(notebook);

  state.redoStack = [];
  state.currentStroke = null;
  state.drawing = false;
  state.activePointerId = null;
  state.selectedImageId = null;
  state.imageInteraction = null;
  clearLassoSelection(false);
  clearLineSnapTimer();
  closePageTransfer();
  closeCanvasContextMenu();
  pageScroll.scrollTop = 0;

  renderSidebar();
  resizeCanvases();
  saveAppState();
}

function clearCurrentPage() {
  const page = getCurrentPage();
  if (!page) return;
  if (page.strokes.length === 0 && page.images.length === 0) return;

  const confirmed = window.confirm("Clear only the current page?");
  if (!confirmed) return;

  page.strokes = [];
  page.images = [];
  page.height = DEFAULT_PAGE_HEIGHT;

  state.redoStack = [];
  state.currentStroke = null;
  state.drawing = false;
  state.activePointerId = null;
  state.selectedImageId = null;
  state.imageInteraction = null;
  clearLassoSelection(false);
  clearImageEraseSession();
  clearLineSnapTimer();
  closePageTransfer();
  closeCanvasContextMenu();
  pageScroll.scrollTop = 0;

  redrawCommittedLayer();
  redrawLiveLayer();
  renderSidebar();
  resizeCanvases();
  saveAppState();
}

function deleteSelectedImage() {
  const page = getCurrentPage();
  if (!page || !state.selectedImageId) return;

  const index = page.images.findIndex((image) => image.id === state.selectedImageId);
  if (index === -1) return;

  page.images.splice(index, 1);
  state.selectedImageId = null;
  state.imageInteraction = null;

  page.height = computePageHeightWithBottomPadding(page, 400);

  redrawCommittedLayer();
  redrawLiveLayer();
  renderSidebar();
  saveAppState();
}

function extendCurrentPage() {
  const page = getCurrentPage();
  if (!page) return;

  const oldScrollTop = pageScroll.scrollTop;

  page.height += PAGE_GROW_AMOUNT;
  resizeCanvases();
  saveAppState();

  pageScroll.scrollTop = oldScrollTop + 180;
}

function trimCurrentPage() {
  const page = getCurrentPage();
  if (!page) return;

  const oldScrollTop = pageScroll.scrollTop;
  const targetHeight = computePageHeightWithBottomPadding(page, 400);

  page.height = targetHeight;
  resizeCanvases();
  saveAppState();

  const maxScrollTop = Math.max(0, pageSurfaceFrame.clientHeight - pageScroll.clientHeight);
  pageScroll.scrollTop = Math.min(oldScrollTop, maxScrollTop);
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyThemeState();
  saveAppState();
}

function setCurrentPageCanvasType(canvasType) {
  const page = getCurrentPage();
  if (!page) return;

  page.canvasType = normalizeCanvasType(canvasType);
  applyCanvasTypeState();
  saveAppState();
}

function toggleSettingsPanel() {
  state.settingsPanelOpen = !state.settingsPanelOpen;
  applySettingsPanelState();
  saveAppState();
}

function cancelCurrentStroke() {
  clearLineSnapTimer();

  if (state.currentStroke?.tool === "eraser") {
    commitImageEraseSession();
    const page = getCurrentPage();
    if (page) {
      page.height = Math.max(page.height, computeRequiredPageHeight(page));
      renderSidebar();
      saveAppState();
    }
  }

  if (state.activePointerId !== null) {
    try {
      liveCanvas.releasePointerCapture(state.activePointerId);
    } catch {
      // ignore
    }
  }

  state.currentStroke = null;
  state.drawing = false;
  state.activePointerId = null;

  redrawCommittedLayer();
  redrawLiveLayer();
}

function getTouchMidpointClient() {
  const points = [...activeTouchPointers.values()];
  if (points.length < 2) return null;

  const a = points[0];
  const b = points[1];

  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}

function getTouchDistance() {
  const points = [...activeTouchPointers.values()];
  if (points.length < 2) return 0;

  const a = points[0];
  const b = points[1];

  return Math.hypot(b.x - a.x, b.y - a.y);
}

function beginPinchGesture() {
  if (activeTouchPointers.size < 2) return;

  const midpointClient = getTouchMidpointClient();
  if (!midpointClient) return;

  const viewportPoint = getViewportPointFromClient(midpointClient);

  pinchState.active = true;
  pinchState.initialDistance = Math.max(8, getTouchDistance());
  pinchState.initialScale = state.zoomScale;
  pinchState.anchorContentPoint = getContentPointFromViewportPoint(viewportPoint);
}

function endPinchGesture() {
  pinchState.active = false;
  pinchState.initialDistance = 0;
  pinchState.initialScale = state.zoomScale;
  pinchState.anchorContentPoint = null;
}

function updatePinchGesture() {
  if (!pinchState.active || activeTouchPointers.size < 2) return;

  const midpointClient = getTouchMidpointClient();
  if (!midpointClient) return;

  const currentDistance = Math.max(8, getTouchDistance());
  const nextScale = clampZoom(
    pinchState.initialScale * (currentDistance / pinchState.initialDistance)
  );

  state.zoomScale = nextScale;
  updateSurfaceGeometry();

  const viewportPoint = getViewportPointFromClient(midpointClient);
  applyZoomScroll(pinchState.anchorContentPoint, viewportPoint);

  redrawCommittedLayer();
  redrawLiveLayer();
}

function startStroke(e) {
  const page = getCurrentPage();
  if (!page) return;
  if (!canStartStroke(e)) return;

  e.preventDefault();
  clearLineSnapTimer();
  clearLassoSelection(false);
  closeCanvasContextMenu();

  state.drawing = true;
  state.activePointerId = e.pointerId;
  liveCanvas.setPointerCapture(e.pointerId);

  const point = getPointFromEvent(e);

  state.currentStroke = {
    tool: state.currentTool,
    color: state.currentColor,
    width: getWidthForTool(state.currentTool),
    points: [point],
    rawPoints: [point],
    snapMode: null,
    arcApexPoint: null
  };

  if (state.currentTool === "eraser") {
    applyDestructiveEraserPoints([point], state.currentStroke.width / 2);
  } else {
    redrawLiveLayer();
    scheduleLineSnapTimer();
  }
}

function moveStroke(e) {
  if (!state.drawing) return;
  if (e.pointerId !== state.activePointerId) return;
  if (!state.currentStroke) return;

  e.preventDefault();

  const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  const addedPoints = [];

  for (const event of events) {
    const point = getPointFromEvent(event);

    if (state.currentTool === "eraser") {
      const pts = state.currentStroke.points;
      const last = pts[pts.length - 1];

      if (!last || last.x !== point.x || last.y !== point.y) {
        pts.push(point);
        addedPoints.push(point);
      }
    } else {
      const changed = appendPointToCurrentStroke(point, false);
      if (changed) {
        addedPoints.push(point);
      }
    }
  }

  if (state.currentTool === "eraser") {
    if (addedPoints.length > 0) {
      applyDestructiveEraserPoints(addedPoints, state.currentStroke.width / 2);
    }
  } else {
    if (addedPoints.length > 0) {
      redrawLiveLayer();

      if (!state.currentStroke.snapMode) {
        scheduleLineSnapTimer();
      }
    }
  }
}

function endStroke(e) {
  if (!state.drawing) return;

  if (e && e.pointerId !== undefined && e.pointerId !== state.activePointerId) {
    return;
  }

  clearLineSnapTimer();
  state.drawing = false;

  const page = getCurrentPage();

  if (state.currentStroke && page) {
    if (state.currentStroke.tool !== "eraser") {
      if (e && typeof e.clientX === "number" && typeof e.clientY === "number") {
        appendPointToCurrentStroke(getPointFromEvent(e), true);
      }

      page.strokes.push({
        tool: state.currentStroke.tool,
        color: state.currentStroke.color,
        width: state.currentStroke.width,
        points: state.currentStroke.points
      });

      page.height = Math.max(page.height, computeRequiredPageHeight(page));
      state.redoStack = [];
      renderSidebar();
      saveAppState();
    } else {
      commitImageEraseSession();
      page.height = Math.max(page.height, computeRequiredPageHeight(page));
      renderSidebar();
      saveAppState();
    }
  }

  state.currentStroke = null;
  state.activePointerId = null;

  redrawCommittedLayer();
  redrawLiveLayer();

  if (e && e.pointerId !== undefined) {
    try {
      liveCanvas.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }
}

function undo() {
  const page = getCurrentPage();
  if (!page || page.strokes.length === 0) return;

  const removedStroke = page.strokes.pop();
  state.redoStack.push(removedStroke);
  clearLassoSelection(false);

  redrawCommittedLayer();
  redrawLiveLayer();
  renderSidebar();
  saveAppState();
}

function redo() {
  const page = getCurrentPage();
  if (!page || state.redoStack.length === 0) return;

  const restoredStroke = state.redoStack.pop();
  page.strokes.push(restoredStroke);
  page.height = Math.max(page.height, computeRequiredPageHeight(page));
  clearLassoSelection(false);

  redrawCommittedLayer();
  redrawLiveLayer();
  renderSidebar();
  saveAppState();
}

function handlePageWheel(e) {
  if (e.ctrlKey) {
    e.preventDefault();

    const zoomFactor = Math.exp(-e.deltaY * 0.0025);
    zoomAtClientPoint(e.clientX, e.clientY, state.zoomScale * zoomFactor);
    return;
  }

  pageScroll.scrollTop += e.deltaY;
  pageScroll.scrollLeft += e.deltaX;
  e.preventDefault();
}

function handleSidebarWheel(e) {
  if (state.sidebarCollapsed) return;

  sidebar.scrollTop += e.deltaY;
  e.preventDefault();
}

function handlePointerDown(e) {
  if (e.pointerType === "touch") {
    activeTouchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activeTouchPointers.size >= 2) {
      if (state.drawing) {
        cancelCurrentStroke();
      }

      state.lassoPath = null;
      state.selectionInteraction = null;
      clearImageInteraction();
      beginPinchGesture();
      e.preventDefault();
      return;
    }
  }

  if (state.currentTool === "lasso") {
    startLassoInteraction(e);
    return;
  }

  const point = getPointFromEvent(e);
  const hit = hitTestImage(point);

  if (hit) {
    if (state.drawing) {
      cancelCurrentStroke();
    }

    clearLassoSelection(false);
    closeCanvasContextMenu();
    e.preventDefault();
    startImageInteraction(e, hit);
    return;
  }

  if (state.selectedImageId) {
    state.selectedImageId = null;
    redrawLiveLayer();
  }

  startStroke(e);
}

function handlePointerMove(e) {
  if (e.pointerType === "touch" && activeTouchPointers.has(e.pointerId)) {
    activeTouchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinchState.active && activeTouchPointers.size >= 2) {
      updatePinchGesture();
      e.preventDefault();
      return;
    }
  }

  if (state.currentTool === "lasso") {
    updateLassoInteraction(e);
    return;
  }

  if (state.imageInteraction) {
    e.preventDefault();
    moveSelectedImage(e);
    return;
  }

  moveStroke(e);
}

function handlePointerEnd(e) {
  if (e.pointerType === "touch") {
    activeTouchPointers.delete(e.pointerId);

    if (pinchState.active) {
      if (activeTouchPointers.size >= 2) {
        updatePinchGesture();
      } else {
        endPinchGesture();
      }

      e.preventDefault();
      return;
    }
  }

  if (state.currentTool === "lasso") {
    if (finishLassoInteraction(e)) {
      return;
    }
  }

  if (finishImageInteraction(e)) {
    return;
  }

  endStroke(e);
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read pasted image."));
    reader.readAsDataURL(blob);
  });
}

function loadImageMetadata(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => reject(new Error("Could not load pasted image."));
    img.src = src;
  });
}

async function pasteImageFromClipboard(blob, anchorPoint = null) {
  const page = getCurrentPage();
  if (!page) return;

  const src = await blobToDataUrl(blob);
  const metadata = await loadImageMetadata(src);

  const availableWidth = Math.max(200, getLogicalSurfaceWidth() - 120);
  const maxInitialWidth = Math.min(availableWidth, 520);
  const initialWidth = Math.min(metadata.width, maxInitialWidth);
  const scale = initialWidth / metadata.width;
  const initialHeight = Math.max(IMAGE_MIN_SIZE, metadata.height * scale);

  let x;
  let y;

  if (anchorPoint) {
    x = Math.max(
      20,
      Math.min(
        getLogicalSurfaceWidth() - initialWidth - 20,
        anchorPoint.x - initialWidth / 2
      )
    );
    y = Math.max(20, anchorPoint.y - initialHeight / 2);
  } else {
    const viewportCenterY =
      (pageScroll.scrollTop + pageScroll.clientHeight / 2) / state.zoomScale;
    x = Math.max(20, (getLogicalSurfaceWidth() - initialWidth) / 2);
    y = Math.max(20, viewportCenterY - initialHeight / 2);
  }

  const imageItem = {
    id: makeId("image"),
    src,
    x,
    y,
    width: initialWidth,
    height: initialHeight
  };

  page.images.push(imageItem);
  page.height = Math.max(page.height, computePageHeightWithBottomPadding(page, 400));
  state.selectedImageId = imageItem.id;
  clearLassoSelection(false);

  redrawCommittedLayer();
  redrawLiveLayer();
  renderSidebar();
  saveAppState();
}

for (const button of toolButtons) {
  button.addEventListener("click", () => {
    setActiveTool(button.dataset.tool);
  });
}

colorInput.addEventListener("input", (e) => {
  state.currentColor = e.target.value;
  saveAppState();
});

widthInput.addEventListener("input", (e) => {
  const value = Number(e.target.value);

  if (state.currentTool === "highlighter") {
    state.highlighterWidth = value;
  } else if (state.currentTool === "eraser") {
    state.eraserWidth = value;
  } else {
    state.penWidth = value;
  }

  saveAppState();
});

toggleSettingsPanelButton.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleSettingsPanel();
});

togglePageSearchButton.addEventListener("click", (e) => {
  e.stopPropagation();
  togglePageSearch();
});

pageSearchSubmit.addEventListener("click", () => {
  performPageSearch();
});

pageSearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    performPageSearch();
  }
});

canvasTypeSelect.addEventListener("change", (e) => {
  setCurrentPageCanvasType(e.target.value);
});

themeToggleButton.addEventListener("click", () => {
  toggleTheme();
});

downloadBackupButton.addEventListener("click", () => {
  downloadBackup();
});

importBackupButton.addEventListener("click", () => {
  importBackupInput.click();
});

importBackupInput.addEventListener("change", handleImportBackupFile);

togglePdfExportMenuButton.addEventListener("click", (e) => {
  e.stopPropagation();
  togglePdfExportMenu();
});

exportNotebookPdfButton.addEventListener("click", async () => {
  await exportCurrentNotebookToPdf();
});

exportSelectedPagesPdfButton.addEventListener("click", () => {
  startSelectedPagesPdfExport();
});

closePdfPagePickerButton.addEventListener("click", () => {
  closePdfPagePicker();
});

cancelPdfExportButton.addEventListener("click", () => {
  closePdfPagePicker();
});

selectAllPdfPagesButton.addEventListener("click", () => {
  selectAllPdfPages();
});

clearPdfPagesButton.addEventListener("click", () => {
  clearPdfPageSelections();
});

confirmPdfExportButton.addEventListener("click", async () => {
  await confirmSelectedPagesPdfExport();
});

pdfPagePickerModal.addEventListener("pointerdown", (e) => {
  if (e.target === pdfPagePickerModal) {
    closePdfPagePicker();
  }
});

closePageTransferButton.addEventListener("click", () => {
  closePageTransfer();
});

cancelPageTransferButton.addEventListener("click", () => {
  closePageTransfer();
});

confirmPageTransferButton.addEventListener("click", () => {
  confirmPageTransfer();
});

pasteImageContextButton.addEventListener("click", async () => {
  const pastePoint = state.contextMenuPastePoint;
  closeCanvasContextMenu();
  await pasteImageFromSystemClipboardAt(pastePoint);
});

pageTransferModal.addEventListener("pointerdown", (e) => {
  if (e.target === pageTransferModal) {
    closePageTransfer();
  }
});

extendPageButton.addEventListener("click", extendCurrentPage);
trimPageButton.addEventListener("click", trimCurrentPage);
resetZoomButton.addEventListener("click", resetZoom);

newNotebookButton.addEventListener("click", createNotebook);
renameNotebookButton.addEventListener("click", renameCurrentNotebook);
deleteNotebookButton.addEventListener("click", deleteCurrentNotebook);
newPageButton.addEventListener("click", createPage);
duplicatePageButton.addEventListener("click", duplicateCurrentPage);
movePageButton.addEventListener("click", () => openPageTransfer("move"));
copyPageToNotebookButton.addEventListener("click", () => openPageTransfer("copy"));
renamePageButton.addEventListener("click", renameCurrentPage);
deletePageButton.addEventListener("click", deleteCurrentPage);

toggleSidebarButton.addEventListener("click", () => {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  applyCollapseState();
  resizeCanvases();
  saveAppState();
});

toggleNotebooksButton.addEventListener("click", () => {
  state.collapsedSections.notebooks = !state.collapsedSections.notebooks;
  applyCollapseState();
  saveAppState();
});

togglePagesButton.addEventListener("click", () => {
  state.collapsedSections.pages = !state.collapsedSections.pages;
  applyCollapseState();
  saveAppState();
});

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
clearPageButton.addEventListener("click", clearCurrentPage);

document.addEventListener("pointerdown", (e) => {
  if (state.settingsPanelOpen && !settingsTile.contains(e.target)) {
    closeSettingsPanel();
  }

  if (state.contextMenuOpen && !canvasContextMenu.contains(e.target)) {
    closeCanvasContextMenu();
  }
});

document.addEventListener("paste", async (e) => {
  const target = e.target;
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  ) {
    return;
  }

  const items = Array.from(e.clipboardData?.items || []);
  const imageItem = items.find((item) => item.type.startsWith("image/"));
  if (!imageItem) return;

  const blob = imageItem.getAsFile();
  if (!blob) return;

  e.preventDefault();

  try {
    await pasteImageFromClipboard(blob);
  } catch (error) {
    console.error(error);
  }
});

window.addEventListener("keydown", (e) => {
  const isModifierPressed = e.ctrlKey || e.metaKey;

  if (e.key === "Escape") {
    closeSettingsPanel();
    closePageSearch(false);
    closePdfPagePicker();
    closePageTransfer();
    closeCanvasContextMenu();
    clearLassoSelection();
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    if (selectionHasContent()) {
      e.preventDefault();
      deleteLassoSelection();
      return;
    }

    if (state.selectedImageId) {
      e.preventDefault();
      deleteSelectedImage();
      return;
    }
  }

  if (!isModifierPressed) return;

  const key = e.key.toLowerCase();

  if (key === "z" && !e.shiftKey) {
    e.preventDefault();
    undo();
    return;
  }

  if (key === "y" || (key === "z" && e.shiftKey)) {
    e.preventDefault();
    redo();
  }
});

pageScroll.addEventListener("wheel", handlePageWheel, { passive: false });
sidebar.addEventListener("wheel", handleSidebarWheel, { passive: false });

liveCanvas.addEventListener("contextmenu", (e) => {
  const point = getPointFromEvent(e);

  if (state.drawing) {
    cancelCurrentStroke();
  }

  finishImageInteraction();
  e.preventDefault();
  openCanvasContextMenu(e.clientX, e.clientY, point);
});

liveCanvas.addEventListener("pointerdown", handlePointerDown);
liveCanvas.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", handlePointerEnd);
window.addEventListener("pointercancel", handlePointerEnd);

window.addEventListener("blur", () => {
  activeTouchPointers.clear();
  endPinchGesture();
  finishImageInteraction();
  finishLassoInteraction();
  endStroke();
  clearLineSnapTimer();
  closeSettingsPanel();
  closePdfPagePicker();
  closePageTransfer();
  closeCanvasContextMenu();
});

window.addEventListener("resize", () => {
  resizeCanvases();

  if (state.contextMenuOpen) {
    applyCanvasContextMenuState();
  }
});

loadAppState();
syncControlsFromState();
renderSidebar();
updateZoomUi();
resizeCanvases();