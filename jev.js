// Case index filters. Enhancement only: without this script every card stays visible
// and the filter controls stay hidden.
(function () {
  var filters = document.getElementById("filters");
  var grid = document.getElementById("case-grid");
  if (!filters || !grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".case-card"));
  var buttons = Array.prototype.slice.call(filters.querySelectorAll(".filter-btn"));
  var result = document.getElementById("filter-result");
  var reset = document.getElementById("filter-reset");
  var empty = document.getElementById("empty-state");
  var state = { primitive: "all", evidence: "all" };

  function matches(card) {
    var primitives = card.getAttribute("data-primitives").split(" ");
    return (state.primitive === "all" || primitives.indexOf(state.primitive) !== -1)
      && (state.evidence === "all" || card.getAttribute("data-evidence") === state.evidence);
  }

  function render() {
    var visible = 0;
    cards.forEach(function (card) {
      var show = matches(card);
      card.hidden = !show;
      if (show) visible += 1;
    });
    buttons.forEach(function (btn) {
      var pressed = state[btn.getAttribute("data-filter")] === btn.getAttribute("data-value");
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    });
    var filtered = state.primitive !== "all" || state.evidence !== "all";
    result.hidden = !filtered;
    empty.hidden = visible !== 0;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state[btn.getAttribute("data-filter")] = btn.getAttribute("data-value");
      render();
    });
  });

  reset.addEventListener("click", function () {
    state.primitive = "all";
    state.evidence = "all";
    render();
    buttons[0].focus();
  });

  filters.hidden = false;
  render();
})();

// Catalog filters. Enhancement only: without this script all rows stay visible
// and the filter form stays hidden.
(function () {
  var form = document.getElementById("catalog-filters");
  var table = document.getElementById("catalog-table");
  if (!form || !table) return;

  var rows = Array.prototype.slice.call(table.querySelectorAll("tr[data-entry]")).map(function (row) {
    return {
      el: row,
      text: row.textContent.toLowerCase(),
      rel: row.getAttribute("data-rel"),
      ev: row.getAttribute("data-ev"),
      types: row.getAttribute("data-t").split(" "),
      cats: row.getAttribute("data-c").split(" "),
      detail: row.hasAttribute("data-detail")
    };
  });
  var buttons = Array.prototype.slice.call(form.querySelectorAll(".filter-btn"));
  var q = document.getElementById("cat-q");
  var type = document.getElementById("cat-type");
  var cat = document.getElementById("cat-cat");
  var detail = document.getElementById("cat-detail");
  var count = document.getElementById("catalog-count");
  var summaryCount = document.getElementById("catalog-filter-summary-count");
  var reset = document.getElementById("catalog-reset");
  var empty = document.getElementById("catalog-empty");
  var state = { rel: "all", ev: "all" };

  function render() {
    var words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    var visible = 0;
    rows.forEach(function (r) {
      var show = (state.rel === "all" || r.rel === state.rel)
        && (state.ev === "all" || r.ev === state.ev)
        && (type.value === "all" || r.types.indexOf(type.value) !== -1)
        && (cat.value === "all" || r.cats.indexOf(cat.value) !== -1)
        && (!detail.checked || r.detail)
        && words.every(function (w) { return r.text.indexOf(w) !== -1; });
      r.el.hidden = !show;
      if (show) visible += 1;
    });
    buttons.forEach(function (btn) {
      var pressed = state[btn.getAttribute("data-filter")] === btn.getAttribute("data-value");
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    });
    var filtered = visible !== rows.length || words.length > 0 || state.rel !== "all" || state.ev !== "all"
      || type.value !== "all" || cat.value !== "all" || detail.checked;
    count.innerHTML = '<span class="num">' + visible + "</span> 件を表示"
      + (filtered ? '（全 <span class="num">' + rows.length + "</span> 件中）" : "");
    if (summaryCount) {
      summaryCount.innerHTML = '<span class="num">' + visible + "</span>件"
        + (filtered ? '／全<span class="num">' + rows.length + '</span>件' : "");
    }
    reset.hidden = !filtered;
    empty.hidden = visible !== 0;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state[btn.getAttribute("data-filter")] = btn.getAttribute("data-value");
      render();
    });
  });
  [q, type, cat, detail].forEach(function (el) {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  reset.addEventListener("click", function () {
    form.reset();
    state.rel = "all";
    state.ev = "all";
    render();
    q.focus();
  });

  form.hidden = false;
  render();
})();
