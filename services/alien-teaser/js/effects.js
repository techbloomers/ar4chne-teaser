/**
 * effects.js — 視覚エフェクト（テキストスクランブル、グリッチ）
 * 
 * グローバルに公開する関数:
 *   window.AlienFX.scrambleText(el, duration)
 *   window.AlienFX.triggerGlitch(el, duration)
 */

window.AlienFX = window.AlienFX || {};

(function () {
  'use strict';

  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}|/\\';

  /**
   * テキストスクランブルを実行する
   * ランダムな文字列から正しいテキストに徐々に収束する
   * 
   * @param {HTMLElement} el - 対象要素（data-text属性またはtextContentを最終テキストとして使用）
   * @param {number} duration - 演出時間（ミリ秒、デフォルト1500）
   */
  function scrambleText(el, duration) {
    duration = duration || 1500;
    var finalText = el.getAttribute('data-text') || el.textContent;
    var length = finalText.length;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      var displayed = '';
      for (var i = 0; i < length; i++) {
        if (finalText[i] === ' ') {
          displayed += ' ';
        } else if (i < length * progress) {
          displayed += finalText[i];
        } else {
          displayed += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      el.textContent = displayed;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = finalText;
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * グリッチエフェクトを発火させる
   * CSSの .glitch-active クラスを一時的に付与する
   * 
   * @param {HTMLElement} el - 対象要素（.glitch-target クラスが必要）
   * @param {number} duration - グリッチの持続時間（ミリ秒、デフォルト400）
   */
  function triggerGlitch(el, duration) {
    duration = duration || 400;
    el.classList.add('glitch-active');
    setTimeout(function () {
      el.classList.remove('glitch-active');
    }, duration);
  }

  // グローバルに公開
  window.AlienFX.scrambleText = scrambleText;
  window.AlienFX.triggerGlitch = triggerGlitch;

})();
