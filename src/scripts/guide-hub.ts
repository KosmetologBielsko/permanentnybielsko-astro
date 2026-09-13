import { guideMatchScore } from "../utils/guide-search";

function initGuideHub() {
  const root = document.querySelector<HTMLElement>("[data-guide-hub]");
  if (!root || root.dataset.hubReady) return;
  const input = root.querySelector<HTMLInputElement>("#hub-search-input");
  const form = root.querySelector<HTMLFormElement>(".hub-search");
  const grid = root.querySelector<HTMLElement>("#hub-entries");
  const heading = root.querySelector<HTMLElement>("#hub-library-title");
  const status = root.querySelector<HTMLElement>("[data-hub-status]");
  const pagination = root.querySelector<HTMLElement>("[data-hub-pagination]");
  const more = root.querySelector<HTMLButtonElement>("[data-hub-more]");
  const clear = root.querySelector<HTMLButtonElement>("[data-hub-clear]");
  const reset = root.querySelector<HTMLButtonElement>("[data-hub-reset]");
  const empty = root.querySelector<HTMLElement>("[data-hub-empty]");
  const allTopics = root.querySelector<HTMLButtonElement>("[data-hub-all-topics]");
  const submit = root.querySelector<HTMLButtonElement>(".hub-submit");
  if (!input || !form || !grid || !heading || !status || !pagination || !more || !clear || !reset || !empty || !allTopics || !submit) return;

  const filters = [...root.querySelectorAll<HTMLButtonElement>("[data-hub-filter]")];
  const filterNames = new Map(filters.map(button => [button.dataset.hubFilter!, button.dataset.label!]));
  const entries = [...root.querySelectorAll<HTMLElement>("[data-hub-entry]")].map((element, index) => ({
    element, index, text:element.dataset.search || "", title:element.dataset.title || "",
    groups:(element.dataset.groups || "").split(" ")
  }));
  const discoveries = root.querySelectorAll<HTMLElement>("[data-hub-discovery]");
  const batch = 12;
  let active = "all";
  let limit = batch;
  let current: typeof entries = [];
  let timer: ReturnType<typeof setTimeout> | undefined;

  function restoreState() {
    if (!location.hash.startsWith("#biblioteka-pmu?")) return;
    const params = new URLSearchParams(location.hash.split("?")[1]);
    active = filterNames.has(params.get("temat") || "") ? params.get("temat")! : "all";
    input!.value = (params.get("q") || "").slice(0,140);
    const count = Number(params.get("ile"));
    limit = Number.isFinite(count) && count >= batch ? Math.min(count,entries.length) : batch;
  }
  function saveState() {
    const params = new URLSearchParams();
    if (active !== "all") params.set("temat",active);
    if (input!.value.trim()) params.set("q",input!.value.trim());
    if (limit > batch) params.set("ile",String(limit));
    const hash = params.size ? `#biblioteka-pmu?${params}` : "#biblioteka-pmu";
    history.replaceState(history.state,"",`${location.pathname}${location.search}${hash}`);
  }
  function render(save = true) {
    const query = input!.value.trim();
    const scored = entries.map(entry => ({ entry, score:guideMatchScore(entry.text,entry.title,query) }));
    scored.sort((a,b) => b.score-a.score || a.entry.index-b.entry.index);
    current = scored.filter(({entry,score}) => score >= 0 && (active === "all" || entry.groups.includes(active))).map(({entry}) => entry);
    const shown = current.slice(0,limit);
    const shownElements = new Set(shown.map(entry => entry.element));
    for (const {entry} of scored) {
      entry.element.hidden = !shownElements.has(entry.element);
      grid!.append(entry.element);
    }
    const filtering = active !== "all" || Boolean(query);
    const label = filterNames.get(active) || "Wszystkie";
    heading!.textContent = query ? "Wyniki wyszukiwania" : active === "all" ? "Wszystkie poradniki" : label;
    status!.textContent = `Poradniki: ${shown.length} z ${current.length}${active !== "all" ? ` · ${label}` : ""}${query ? ` · „${query}”` : ""}`;
    submit!.textContent = query ? `Zobacz wyniki (${current.length}) ↓` : "Znajdź poradnik ↓";
    clear!.hidden = !query;
    reset!.hidden = !filtering;
    empty!.hidden = current.length !== 0;
    allTopics!.hidden = active === "all" || !query;
    pagination!.hidden = current.length <= limit;
    const nextCount = Math.min(batch,Math.max(0,current.length-limit));
    more!.textContent = nextCount === 1 ? "Pokaż ostatni poradnik ↓" : `Pokaż kolejne (${nextCount}) ↓`;
    filters.forEach(button => button.setAttribute("aria-pressed",String(button.dataset.hubFilter === active)));
    discoveries.forEach(section => { section.hidden = filtering; });
    const extra = root!.querySelector<HTMLDetailsElement>(".hub-more-topics");
    if (extra && [...extra.querySelectorAll<HTMLButtonElement>("[data-hub-filter]")].some(button => button.dataset.hubFilter === active)) extra.open = true;
    if (save) saveState();
  }
  function cancelPending() { if (timer) clearTimeout(timer); }
  function goToResults() {
    input!.blur();
    heading!.tabIndex = -1;
    heading!.focus({preventScroll:true});
    heading!.scrollIntoView({block:"start",behavior:"auto"});
  }
  function resetAll() {
    cancelPending(); active = "all"; input!.value = ""; limit = batch; render();
  }
  function showMore(all = false) {
    const next = current[limit]?.element.querySelector<HTMLAnchorElement>("a");
    limit = all ? entries.length : limit+batch;
    render();
    next?.focus({preventScroll:true});
  }

  input.addEventListener("input",() => {
    cancelPending(); limit = batch; timer = setTimeout(() => render(),120);
  });
  input.addEventListener("keydown",event => {
    if (event.key === "Escape") { cancelPending(); input.value = ""; limit = batch; render(); }
  });
  form.addEventListener("submit",event => {
    event.preventDefault(); cancelPending(); render(); goToResults();
  });
  clear.addEventListener("click",() => { cancelPending(); input.value = ""; limit = batch; render(); input.focus(); });
  filters.forEach(button => button.addEventListener("click",() => {
    cancelPending(); active = button.dataset.hubFilter!; limit = batch; render();
  }));
  root.querySelectorAll<HTMLAnchorElement>("[data-hub-topic]").forEach(link => link.addEventListener("click",event => {
    event.preventDefault(); cancelPending(); active = link.dataset.hubTopic!; input.value = ""; limit = batch; render(); goToResults();
  }));
  root.querySelectorAll<HTMLButtonElement>("[data-hub-preset]").forEach(button => button.addEventListener("click",() => {
    cancelPending(); active = "all"; input.value = button.dataset.hubPreset!; limit = batch; render(); goToResults();
  }));
  reset.addEventListener("click",() => { resetAll(); goToResults(); });
  root.querySelector("[data-hub-empty-reset]")?.addEventListener("click",() => { resetAll(); goToResults(); });
  allTopics.addEventListener("click",() => { active = "all"; limit = batch; render(); goToResults(); });
  more.addEventListener("click",() => showMore());
  root.querySelector("[data-hub-show-all]")?.addEventListener("click",() => showMore(true));
  root.querySelector("[data-hub-focus-search]")?.addEventListener("click",event => {
    event.preventDefault(); input.scrollIntoView({block:"center",behavior:"auto"}); input.focus({preventScroll:true});
  });
  window.addEventListener("hashchange",() => { active = "all"; input.value = ""; limit = batch; restoreState(); render(false); });
  root.dataset.hubReady = "true";
  root.querySelectorAll<HTMLElement>("[data-hub-controls]").forEach(control => { control.hidden = false; });
  root.querySelectorAll<HTMLInputElement | HTMLButtonElement>("[data-hub-controls] input, [data-hub-controls] button").forEach(control => { control.disabled = false; });
  restoreState(); render(false);
  if (location.hash.startsWith("#biblioteka-pmu?")) goToResults();
}

initGuideHub();
