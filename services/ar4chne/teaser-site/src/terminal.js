// ============================================
// AR4CHNE — In-Page Terminal Resume
// ============================================

// --- Terminal Text Definition ---
const TERMINAL_LINES = [
  { text: 'AR4CHNE — PROFILE FILE', color: '#ffffff' },
  { text: '─────────────────────────────────────────', color: '#3a3a4a', instant: true },
  { text: '区分     ：', color: '#e8e8e8', label: '閲覧制限', labelColor: '#a594f9' },
  { text: '最終更新 ：2026-03-16', color: '#e8e8e8' },
  { text: '対象     ：エンジニア', color: '#e8e8e8' },
  { text: '', color: '#e8e8e8' },
  { text: 'ハンドル  ：', color: '#e8e8e8', label: 'AR4CHNE', labelColor: '#ffffff' },
  { text: '立場     ：開発（AI併用）', color: '#e8e8e8' },
  { text: '指針     ：AIを鵜呑みにせず、設計は自分次第。', color: '#e8e8e8' },
  { text: '           最良のパートナーとして活用する。', color: '#e8e8e8' },
  { text: '', color: '#e8e8e8' },
  { text: '─────────────────────────────────────────', color: '#3a3a4a', instant: true },
  { text: '制作物', color: '#e8e8e8' },
  { text: '─────────────────────────────────────────', color: '#3a3a4a', instant: true },
  { text: '', color: '#e8e8e8' },
  { text: '[01] デスクトップマスコット改造（shimeji-ee）', color: '#e8e8e8' },
  { text: '  形式   ：', color: '#e8e8e8', label: 'Javaデスクトップ拡張', labelColor: '#7c6ddb' },
  { text: '  状況   ：', color: '#e8e8e8', label: 'デモ映像あり', labelColor: '#7c6ddb' },
  { text: '  備考   ：挙動スクリプト独自実装。', color: '#e8e8e8' },
  { text: '           リポジトリは非公開。映像で見せます。', color: '#e8e8e8' },
  { text: '', color: '#e8e8e8' },
  { text: '[02] 司書型BOT（OpenClaw使用）', color: '#e8e8e8' },
  { text: '  形式   ：', color: '#e8e8e8', label: 'Discordナレッジ検索', labelColor: '#7c6ddb' },
  {
    text: '  状況   ：',
    color: '#e8e8e8',
    label: '私的サーバーで運用中 / 要問合せ',
    labelColor: '#7c6ddb',
  },
  { text: '  備考   ：呼ばれたときだけ応答するタイプ。', color: '#e8e8e8' },
  { text: '           RAGに近い構造。詳細はお問い合わせください。', color: '#e8e8e8' },
  { text: '', color: '#e8e8e8' },
  { text: '[03] プロダクションLP', color: '#e8e8e8' },
  { text: '  形式   ：', color: '#e8e8e8', label: 'クライアント向けLP', labelColor: '#7c6ddb' },
  {
    text: '  状況   ：',
    color: '#e8e8e8',
    label: 'NDA対象 — スクショ/動画のみ可',
    labelColor: '#7c6ddb',
  },
  { text: '  備考   ：フルビルド済み。公開権は自分にない。', color: '#e8e8e8' },
  { text: '', color: '#e8e8e8' },
  { text: '[04] 同人カードゲーム', color: '#e8e8e8' },
  {
    text: '  形式   ：',
    color: '#e8e8e8',
    label: 'Electron + React（TypeScript）',
    labelColor: '#7c6ddb',
  },
  { text: '  状況   ：', color: '#e8e8e8', label: 'アルファテスト中', labelColor: '#7c6ddb' },
  { text: '  備考   ：AI併用で個人開発。', color: '#e8e8e8' },
  { text: '           テストプレイはコミュニティ内で継続中。', color: '#e8e8e8' },
  { text: '', color: '#e8e8e8' },
  { text: '[05] 映画ティザーサイト（ファンメイド）', color: '#e8e8e8' },
  { text: '  形式   ：', color: '#e8e8e8', label: 'HTML / CSS / JS + GSAP', labelColor: '#7c6ddb' },
  { text: '  状況   ：', color: '#e8e8e8', label: '完成済み', labelColor: '#7c6ddb' },
  { text: '  備考   ：映画『エイリアン』モチーフの非公式サイト。', color: '#e8e8e8' },
  { text: '', color: '#e8e8e8' },
  { text: '─────────────────────────────────────────', color: '#3a3a4a', instant: true },
  { text: '非公開の制作物は複数あります。', color: '#e8e8e8' },
  { text: '実績の詳細は個別にご共有できます。', color: '#e8e8e8' },
  { text: '─────────────────────────────────────────', color: '#3a3a4a', instant: true },
  { text: '', color: '#e8e8e8' },
  { text: '次のアクション：', color: '#e8e8e8', slow: true },
  { text: '  これからも宜しくお願いします。', color: '#e8e8e8', slow: true },
  { text: '  評価お待ちしています。', color: '#e8e8e8', slow: true },
  { text: '', color: '#e8e8e8' },
  { text: 'EOF', color: '#e8e8e8', slow: true, eof: true },
];

// --- Speed Definitions (ms per character) ---
const SPEED = {
  header: { min: 8, max: 12 },
  normal: { min: 18, max: 28 },
  slow: { min: 40, max: 60 },
};

// --- Check reduced motion preference ---
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// --- Random speed within range ---
function randomDelay(range) {
  return range.min + Math.random() * (range.max - range.min);
}

// --- Build plain text for clipboard ---
function buildPlainText() {
  return TERMINAL_LINES.map((line) => {
    if (line.label) return line.text + line.label;
    return line.text;
  }).join('\n');
}

// --- Main Terminal Controller ---
export function initTerminal() {
  const trigger = document.getElementById('profile-trigger');
  const btn = document.getElementById('profile-btn');
  const terminalWindow = document.getElementById('terminal-window');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalFooter = document.getElementById('terminal-footer');
  const btnReplay = document.getElementById('terminal-replay');
  const btnCopy = document.getElementById('terminal-copy');
  const btnClose = document.getElementById('terminal-close');

  if (!trigger || !btn || !terminalWindow) return;

  let animationId = null;
  let isAnimating = false;

  // --- Click handler: show terminal ---
  btn.addEventListener('click', () => {
    if (isAnimating) return;
    fadeOut(trigger, 300, () => {
      terminalWindow.style.display = 'block';
      requestAnimationFrame(() => {
        terminalWindow.classList.add('is-visible');
        startTyping();
      });
    });
  });

  // --- REPLAY ---
  btnReplay.addEventListener('click', () => {
    if (isAnimating) return;
    terminalFooter.classList.remove('is-visible');
    terminalOutput.innerHTML = '';
    startTyping();
  });

  // --- COPY ---
  btnCopy.addEventListener('click', () => {
    const text = buildPlainText();
    navigator.clipboard.writeText(text).then(() => {
      const originalText = btnCopy.textContent;
      btnCopy.textContent = 'COPIED';
      setTimeout(() => {
        btnCopy.textContent = originalText;
      }, 1500);
    });
  });

  // --- CLOSE ---
  btnClose.addEventListener('click', () => {
    cancelAnimation();
    terminalWindow.classList.remove('is-visible');
    terminalWindow.addEventListener(
      'transitionend',
      () => {
        terminalWindow.style.display = 'none';
        terminalOutput.innerHTML = '';
        terminalFooter.classList.remove('is-visible');
        fadeIn(trigger, 300);
      },
      { once: true }
    );
  });

  // --- Fade helpers ---
  function fadeOut(el, duration, callback) {
    el.style.transition = `opacity ${duration}ms ease`;
    el.style.opacity = '0';
    el.addEventListener(
      'transitionend',
      () => {
        el.style.display = 'none';
        if (callback) callback();
      },
      { once: true }
    );
  }

  function fadeIn(el, duration) {
    el.style.display = '';
    requestAnimationFrame(() => {
      el.style.transition = `opacity ${duration}ms ease`;
      el.style.opacity = '1';
    });
  }

  // --- Cancel in-progress animation ---
  function cancelAnimation() {
    isAnimating = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // --- Start the typing sequence ---
  function startTyping() {
    isAnimating = true;
    terminalOutput.innerHTML = '';

    // Reduced motion: show all at once
    if (prefersReducedMotion()) {
      renderAllInstant();
      isAnimating = false;
      terminalFooter.classList.add('is-visible');
      return;
    }

    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    cursor.textContent = '█';
    terminalOutput.appendChild(cursor);

    let lineIndex = 0;

    function processNextLine() {
      if (!isAnimating) return;

      if (lineIndex >= TERMINAL_LINES.length) {
        // Typing complete — make cursor blink
        cursor.classList.add('is-blinking');
        isAnimating = false;
        // Show footer buttons
        setTimeout(() => {
          terminalFooter.classList.add('is-visible');
        }, 400);
        return;
      }

      const lineDef = TERMINAL_LINES[lineIndex];
      lineIndex++;

      // Create line container
      const lineEl = document.createElement('div');

      if (lineDef.instant) {
        // Instant render (separator lines)
        lineEl.style.color = lineDef.color;
        lineEl.textContent = lineDef.text;
        terminalOutput.insertBefore(lineEl, cursor);
        requestAnimationFrame(() => processNextLine());
        return;
      }

      // Empty line
      if (!lineDef.text && !lineDef.label) {
        lineEl.innerHTML = '&nbsp;';
        terminalOutput.insertBefore(lineEl, cursor);
        setTimeout(() => processNextLine(), 60);
        return;
      }

      terminalOutput.insertBefore(lineEl, cursor);

      // Determine speed range
      let speedRange = SPEED.normal;
      if (lineIndex <= 2) speedRange = SPEED.header;
      if (lineDef.slow) speedRange = SPEED.slow;

      // Full text to type (base + label)
      const baseText = lineDef.text || '';
      const labelText = lineDef.label || '';

      // Type the base text first
      typeText(lineEl, baseText, lineDef.color, speedRange, () => {
        if (!isAnimating) return;
        if (labelText) {
          // Type the label with its own color
          typeText(lineEl, labelText, lineDef.labelColor, speedRange, () => {
            if (!isAnimating) return;
            if (lineDef.eof) {
              // Append cursor inline for EOF line
              lineEl.appendChild(document.createTextNode(' '));
              lineEl.appendChild(cursor);
              cursor.classList.add('is-blinking');
              isAnimating = false;
              setTimeout(() => {
                terminalFooter.classList.add('is-visible');
              }, 400);
            } else {
              processNextLine();
            }
          });
        } else {
          if (lineDef.eof) {
            lineEl.appendChild(document.createTextNode(' '));
            lineEl.appendChild(cursor);
            cursor.classList.add('is-blinking');
            isAnimating = false;
            setTimeout(() => {
              terminalFooter.classList.add('is-visible');
            }, 400);
          } else {
            processNextLine();
          }
        }
      });
    }

    processNextLine();
  }

  // --- Type text character by character ---
  function typeText(container, text, color, speedRange, callback) {
    if (!text) {
      if (callback) callback();
      return;
    }

    const span = document.createElement('span');
    span.style.color = color;
    container.appendChild(span);

    let charIndex = 0;
    let lastTime = 0;
    let nextDelay = randomDelay(speedRange);

    function step(timestamp) {
      if (!isAnimating) return;
      if (!lastTime) lastTime = timestamp;

      const elapsed = timestamp - lastTime;
      if (elapsed >= nextDelay) {
        span.textContent += text[charIndex];
        charIndex++;
        lastTime = timestamp;
        nextDelay = randomDelay(speedRange);
      }

      if (charIndex < text.length) {
        animationId = requestAnimationFrame(step);
      } else {
        if (callback) callback();
      }
    }

    animationId = requestAnimationFrame(step);
  }

  // --- Render all lines instantly (reduced motion) ---
  function renderAllInstant() {
    TERMINAL_LINES.forEach((lineDef) => {
      const lineEl = document.createElement('div');

      if (!lineDef.text && !lineDef.label) {
        lineEl.innerHTML = '&nbsp;';
      } else {
        const baseSpan = document.createElement('span');
        baseSpan.style.color = lineDef.color;
        baseSpan.textContent = lineDef.text;
        lineEl.appendChild(baseSpan);

        if (lineDef.label) {
          const labelSpan = document.createElement('span');
          labelSpan.style.color = lineDef.labelColor;
          labelSpan.textContent = lineDef.label;
          lineEl.appendChild(labelSpan);
        }
      }

      terminalOutput.appendChild(lineEl);
    });

    // Add static cursor at end
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    cursor.textContent = ' █';
    terminalOutput.lastElementChild.appendChild(cursor);
  }
}
