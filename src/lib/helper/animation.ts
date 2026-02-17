type CSSConfig = Record<string, string | number | null | undefined>;

const DEFAULT_CSS_CONFIGS = {
  DIVIDER_SIZE: 2,
  EDGE_SIZE: 5,
};

// ---------- tiny helpers ----------
const $$ = (root: ParentNode, sel: string): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(sel));

const $one = (root: ParentNode, sel: string): HTMLElement | null =>
  root.querySelector<HTMLElement>(sel);

const children = (root: HTMLElement, sel: string): HTMLElement[] =>
  $$(root, `:scope > ${sel}`);

const setStyles = (els: HTMLElement | HTMLElement[], obj: CSSConfig): void => {
  const arr = Array.isArray(els) ? els : [els];
  for (const el of arr) {
    if (!el || !obj) continue;
    for (const [k, v] of Object.entries(obj)) {
      if (v == null) continue;
      el.style.setProperty(k, String(v));
    }
  }
};

const pxOrRaw = (val: string | number | null | undefined): string | null => {
  if (val == null) return null;
  if (typeof val === 'number') return `${val}px`;
  const s = String(val).trim();
  return /^[+-]?\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
};

// ---------- private helpers ----------

const add_score_cards = (digitpos: number, top_or_bottom: 'top' | 'bottom') => {
  let str = `<div class="scorer-panel text-center float-left overflow-hidden z-[1] relative"" data-panel-digit="${digitpos}" data-panel-num="0">`;

  const panel_class =
    top_or_bottom === 'bottom' ? 'scorer-bottom' : 'scorer-top';

  for (let i = 9; i >= 0; i--) {
    let j = i;

    if (top_or_bottom === 'bottom') {
      j = (i - 9) * -1;
      str += `<div class="scorer-bottom-bg scorer-num ${j === 0 ? 'flipped' : ''}"></div>`;
    }

    str +=
      `<div class="scorer-num ${panel_class} ${j === 0 && top_or_bottom === 'bottom' ? 'flipped' : ''}" data-scorer-num="${j}">` +
      `<span>${j}</span>` +
      (top_or_bottom === 'top'
        ? `<div class="scorer-bg" style="position:absolute; left:0; top:0; height:100%; width:100%; background-color:black;"></div>`
        : '') +
      `</div>`;
  }
  return str + '</div>';
};

const init_Create_Panel = (el: HTMLElement, numDigits: number) => {
  let str = '';

  for (let i = 1; i <= numDigits; i++) str += add_score_cards(i, 'top');

  str += '<div style="clear:left;"></div>';

  for (let i = 1; i <= numDigits; i++) str += add_score_cards(i, 'bottom');

  el.innerHTML = str;
};

const flipcard = (
  direction: 'up' | 'down',
  panel: 'top' | 'bottom',
  scorer_num_el: HTMLElement | null,
  last_num: number
) => {
  if (!scorer_num_el) return;
  const num = parseInt(
    scorer_num_el.getAttribute('data-scorer-num') || '0',
    10
  );

  if (scorer_num_el.classList.contains('flipped')) {
    scorer_num_el.classList.remove('flipped');
    if (panel === 'bottom') {
      const prev = scorer_num_el.previousElementSibling as HTMLElement | null;
      if (prev && prev.classList.contains('scorer-bottom-bg')) {
        prev.classList.remove('flipped');
      }
    }
  } else {
    scorer_num_el.classList.add('flipped');
    if (panel === 'bottom') {
      const prev = scorer_num_el.previousElementSibling as HTMLElement | null;
      if (prev && prev.classList.contains('scorer-bottom-bg')) {
        prev.classList.add('flipped');
      }
    }
  }

  if (num === last_num) return;

  if (panel === 'top') {
    setTimeout(() => {
      flipcard(
        direction,
        panel,
        direction === 'up'
          ? (scorer_num_el.previousElementSibling as HTMLElement | null)
          : (scorer_num_el.nextElementSibling as HTMLElement | null),
        last_num
      );
    }, 500);
  } else {
    if (direction === 'up') {
      setTimeout(() => {
        let next = scorer_num_el.nextElementSibling as HTMLElement | null;
        next = next ? (next.nextElementSibling as HTMLElement | null) : null;
        flipcard(direction, panel, next, last_num);
      }, 500);
    } else {
      setTimeout(() => {
        let prev = scorer_num_el.previousElementSibling as HTMLElement | null;
        prev = prev
          ? (prev.previousElementSibling as HTMLElement | null)
          : null;
        flipcard(direction, panel, prev, last_num);
      }, 500);
    }
  }
};

const flipdigit = (
  scorer_el: HTMLElement,
  digit: number,
  target_num: number
) => {
  const panels = children(
    scorer_el,
    `.scorer-panel[data-panel-digit="${digit}"]`
  );
  if (!panels.length) return;

  const curr_num = parseInt(
    panels[0].getAttribute('data-panel-num') || '0',
    10
  );
  if (curr_num === target_num) return;

  const direction: 'up' | 'down' = target_num < curr_num ? 'down' : 'up';

  let top_start_num, top_last_num, bottom_start_num, bottom_last_num;
  if (direction === 'up') {
    top_start_num = curr_num;
    top_last_num = target_num - 1;
    bottom_start_num = curr_num + 1;
    bottom_last_num = target_num;
  } else {
    top_start_num = curr_num - 1;
    top_last_num = target_num;
    bottom_start_num = curr_num;
    bottom_last_num = target_num + 1;
  }

  let topFlipDelay = 0,
    bottomFlipDelay = 0;
  if (direction === 'up') bottomFlipDelay = 250;
  else topFlipDelay = 250;

  setTimeout(() => {
    const startTop = $one(
      scorer_el,
      `.scorer-panel[data-panel-digit="${digit}"] > .scorer-num.scorer-top[data-scorer-num="${top_start_num}"]`
    );
    flipcard(direction, 'top', startTop, top_last_num);
  }, topFlipDelay);

  setTimeout(() => {
    const startBottom = $one(
      scorer_el,
      `.scorer-panel[data-panel-digit="${digit}"] > .scorer-num.scorer-bottom[data-scorer-num="${bottom_start_num}"]`
    );
    flipcard(direction, 'bottom', startBottom, bottom_last_num);
  }, bottomFlipDelay);

  panels.forEach((p) => p.setAttribute('data-panel-num', String(target_num)));
};

// ---------- public API ----------

export const Scorer = {
  init() {
    $$(document, '.scorer').forEach((el) => {
      const numDigits = parseInt(
        el.getAttribute('data-scorer-digits') || '0',
        10
      );
      if (!numDigits) return;

      init_Create_Panel(el, numDigits);

      const scorer_css: CSSConfig = {};
      const scorer_panel_css: CSSConfig = {};
      const scorer_num_css: CSSConfig = {};
      const scorer_bottom_css: CSSConfig = {};
      const scorer_bottom_bg_css: CSSConfig = {};

      // divider size
      {
        const cssOpt = el.getAttribute('data-divider-size');
        const dividerSize =
          cssOpt != null && cssOpt !== ''
            ? parseInt(cssOpt, 10)
            : DEFAULT_CSS_CONFIGS.DIVIDER_SIZE;
        scorer_panel_css['border-width'] = pxOrRaw(dividerSize * 2);
      }

      // divider color
      {
        const cssOpt = el.getAttribute('data-divider-color');
        if (cssOpt) scorer_panel_css['border-color'] = cssOpt;
      }

      // card width
      {
        const cssOpt = el.getAttribute('data-card-width');
        if (cssOpt) {
          const w = parseInt(cssOpt, 10);
          scorer_num_css['width'] = pxOrRaw(w);
          scorer_panel_css['width'] = pxOrRaw(w + 2 * 4);
        }
      }

      // bg color
      {
        const cssOpt = el.getAttribute('data-bg-color');
        if (cssOpt) scorer_num_css['background'] = cssOpt;
      }

      // text color
      {
        const cssOpt = el.getAttribute('data-color');
        if (cssOpt) scorer_num_css['color'] = cssOpt;
      }

      // font size
      {
        const cssOpt = el.getAttribute('data-font-size');
        if (cssOpt) scorer_num_css['font-size'] = cssOpt;
      }

      // height
      {
        const cssOpt = el.getAttribute('data-height');
        if (cssOpt) {
          const H = parseInt(cssOpt, 10);
          const dividerSize =
            parseInt(el.getAttribute('data-divider-size') || '', 10) ||
            DEFAULT_CSS_CONFIGS.DIVIDER_SIZE;
          const edgeSizeLocal =
            parseInt(el.getAttribute('data-edge-size') || '', 10) ||
            DEFAULT_CSS_CONFIGS.EDGE_SIZE;

          scorer_css['height'] = pxOrRaw(H);
          scorer_panel_css['height'] = pxOrRaw(H / 2 - 2 * dividerSize);
          const num_height = H - 2 * edgeSizeLocal - 2 * dividerSize;
          scorer_num_css['height'] = pxOrRaw(num_height);
          scorer_num_css['line-height'] = pxOrRaw(num_height);
          scorer_bottom_css['top'] = pxOrRaw(-H / 2);
          scorer_bottom_bg_css['top'] = scorer_bottom_css['top'];
        }
      }

      // apply styles
      setStyles(el, scorer_css);
      setStyles(children(el, '.scorer-panel'), scorer_panel_css);
      setStyles($$(el, '.scorer-num'), scorer_num_css);
      setStyles($$(el, '.scorer-bottom'), scorer_bottom_css);
      setStyles($$(el, '.scorer-bottom-bg'), scorer_bottom_bg_css);
    });
  },

  flip(scorer_el: HTMLElement | string, num: number | string) {
    const el =
      typeof scorer_el === 'string'
        ? (document.querySelector(scorer_el) as HTMLElement | null)
        : scorer_el;
    if (!el) return;

    let n = parseInt(String(num), 10);
    if (Number.isNaN(n)) n = 0;

    const num_digit = parseInt(
      el.getAttribute('data-scorer-digits') || '0',
      10
    );
    for (let i = num_digit; i >= 1; i--) {
      flipdigit(el, i, n % 10);
      n = Math.floor(n / 10);
    }
  },
};
