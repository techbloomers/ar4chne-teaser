/**
 * main.js — メインオーケストレーション
 * 
 * サイト全体の起動シーケンスとセクション制御を担当
 * 
 * 依存:
 *   - effects.js （window.AlienFX.scrambleText, triggerGlitch）
 *   - GSAP + ScrollTrigger（CDN、なくてもフォールバック動作する）
 * 
 * 担当機能:
 *   ❶ ブートシーケンス
 *   ❸ ヒーロー演出（scrambleText呼び出し）
 *   ❹ GSAP ScrollTrigger 初期化
 *   カウントダウンタイマー
 *   スクロールインジケーター
 */

(function () {
  'use strict';

  /* ==========================================
     ユーティリティ
  ========================================== */

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return document.querySelectorAll(selector);
  }


  /* ==========================================
     ❶ ブートシーケンス
     原則3: 8秒ルール — 合計delay ≈ 3.8秒 + 表示時間
  ========================================== */

  var BOOT_MESSAGES = [
    { text: 'WEYLAND-YUTANI CORP. TERMINAL v6.2.1', delay: 300 },
    { text: 'MU/TH/UR 6000 INTERFACE — ONLINE', delay: 500 },
    { text: 'RUNNING SYSTEM DIAGNOSTICS.......... OK', delay: 700 },
    { text: 'DECRYPTING CLASSIFIED ARCHIVE........ OK', delay: 600 },
    { text: 'BIOCONTAINMENT PROTOCOLS............. ACTIVE', delay: 500 },
    { text: 'WARNING: FILE INTEGRITY COMPROMISED', delay: 800 },
    { text: '> PRESS ENTER TO CONTINUE _', delay: 400 }
  ];

  /**
   * ブートログを1行ずつ表示する
   */
  async function runBootSequence() {
    var logEl = $('#boot-log');
    var enterBtn = $('#boot-enter');

    for (var i = 0; i < BOOT_MESSAGES.length; i++) {
      var msg = BOOT_MESSAGES[i];
      var line = document.createElement('div');
      line.className = 'line';
      line.textContent = msg.text;
      logEl.appendChild(line);

      await sleep(msg.delay);
      line.classList.add('visible');
    }

    await sleep(300);
    enterBtn.classList.add('visible');
  }

  /**
   * ブート画面を閉じてメインコンテンツを表示
   * ここが全体の起動トリガー
   */
  function exitBootScreen() {
    var bootScreen = $('#boot-screen');
    var skipBtn = $('#boot-skip');

    bootScreen.classList.add('hidden');
    skipBtn.classList.add('hidden');

    setTimeout(function () {
      bootScreen.classList.add('removed');
      $('#main-content').classList.add('visible');

      // 各モジュールの起動
      startHeroSequence();
      initScrollAnimations();

      // UIフェードイン
      setTimeout(function () {
        var audioBtn = $('#audio-btn');
        if (audioBtn) audioBtn.classList.add('visible');
      }, 1500);

      setTimeout(function () {
        var scrollInd = $('#scroll-indicator');
        if (scrollInd) scrollInd.classList.add('visible');
      }, 3500);
    }, 800);
  }

  // ブート画面のイベントバインド
  $('#boot-enter').addEventListener('click', exitBootScreen);
  $('#boot-skip').addEventListener('click', exitBootScreen);

  // ブート開始
  runBootSequence();


  /* ==========================================
     ❸ ヒーロー演出シーケンス
     effects.js の scrambleText を呼び出す
  ========================================== */

  function startHeroSequence() {
    var subtitle = $('#hero-subtitle');
    var title = $('#hero-title');
    var tagline = $('#hero-tagline');
    var scrambleEls = title.querySelectorAll('.scramble-text');

    // 1. サブタイトル表示
    setTimeout(function () {
      subtitle.classList.remove('gs-h');
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'none';
    }, 300);

    // 2. タイトルをスクランブル
    setTimeout(function () {
      scrambleEls.forEach(function (el, i) {
        setTimeout(function () {
          if (window.AlienFX && window.AlienFX.scrambleText) {
            window.AlienFX.scrambleText(el, 1200);
          }
        }, i * 400);
      });
    }, 800);

    // 3. グリッチ発火
    setTimeout(function () {
      if (window.AlienFX && window.AlienFX.triggerGlitch) {
        window.AlienFX.triggerGlitch(title, 400);
      }
    }, 2500);

    // 4. タグライン表示
    setTimeout(function () {
      tagline.classList.remove('gs-h');
      tagline.style.opacity = '1';
      tagline.style.transform = 'none';
    }, 3000);
  }


  /* ==========================================
     ❹ GSAP ScrollTrigger 初期化
     GSAPが読み込まれていない場合はフォールバックで全要素表示
  ========================================== */

  function initScrollAnimations() {
    // GSAPが利用不可ならフォールバック
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      $$('.gs-h').forEach(function (el) {
        el.classList.remove('gs-h');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- トランスミッションセクション: 各行が順にフェードイン ---
    var txLines = $$('#section-transmission .gs-h');
    txLines.forEach(function (el, i) {
      gsap.fromTo(el,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          delay: i * 0.12
        }
      );
    });

    // --- 警告セクション: グリッチ発火 + 順次表示 ---
    ScrollTrigger.create({
      trigger: '#section-warning',
      start: 'top 65%',
      onEnter: function () {
        var warningText = $('#warning-text');

        // グリッチ → パルス開始
        if (window.AlienFX && window.AlienFX.triggerGlitch) {
          window.AlienFX.triggerGlitch(warningText, 400);
        }
        setTimeout(function () {
          warningText.classList.add('pulse-on');
        }, 400);

        // 各要素を順次表示
        var warnEls = $$('#section-warning .gs-h');
        warnEls.forEach(function (el, i) {
          setTimeout(function () {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out'
            });
          }, 200 + i * 200);
        });
      },
      once: true
    });

    // --- カウントダウンセクション ---
    gsap.fromTo('#section-countdown',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#section-countdown',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }


  /* ==========================================
     カウントダウンタイマー
     ※ 日付を変更する場合はここのReleaseDate を編集
  ========================================== */

  var RELEASE_DATE = new Date('2026-12-25T00:00:00');

  function updateCountdown() {
    var now = new Date();
    var diff = RELEASE_DATE - now;
    var display = $('#countdown-display');

    if (!display) return;

    if (diff <= 0) {
      display.textContent = 'TRANSMISSION ACTIVE';
      return;
    }

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    display.innerHTML =
      '<span>' + pad(days) + '</span><span class="countdown-unit">DAYS</span>' +
      '<span class="countdown-divider"></span>' +
      '<span>' + pad(hours) + '</span><span class="countdown-unit">HRS</span>' +
      '<span class="countdown-divider"></span>' +
      '<span>' + pad(minutes) + '</span><span class="countdown-unit">MIN</span>' +
      '<span class="countdown-divider"></span>' +
      '<span>' + pad(seconds) + '</span><span class="countdown-unit">SEC</span>';
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ==========================================
     スクロールインジケーター
     最初のスクロールで非表示にする
  ========================================== */

  var scrollIndicatorHidden = false;
  window.addEventListener('scroll', function () {
    if (!scrollIndicatorHidden && window.scrollY > 100) {
      var ind = $('#scroll-indicator');
      if (ind) ind.classList.remove('visible');
      scrollIndicatorHidden = true;
    }
  }, { passive: true });

})();
