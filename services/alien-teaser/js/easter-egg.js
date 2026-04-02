/**
 * easter-egg.js — 隠しコマンド入力システム
 * 
 * キーボードで特定の単語を入力すると、フルスクリーンオーバーレイに
 * 隠しメッセージが表示される
 * 
 * 登録済みコマンド:
 *   MOTHER    → "INTERFACE 2037 READY FOR INQUIRY"
 *   XENOMORPH → "SPECIMEN STATUS: CONTAINMENT BREACH"
 *   NOSTROMO  → "CREW EXPENDABLE."
 *   RIPLEY    → "FINAL REPORT, COMMERCIAL STARSHIP NOSTROMO"
 * 
 * 新しいコマンドは COMMANDS オブジェクトに追加するだけでOK
 */

(function () {
  'use strict';

  var inputBuffer = '';
  var BUFFER_MAX = 20;
  var DISPLAY_DURATION = 3500; // 表示時間（ms）

  /**
   * コマンド定義
   * 新しいイースターエッグはここに追加する
   */
  var COMMANDS = {
    'MOTHER': {
      message: 'INTERFACE 2037 READY FOR INQUIRY',
      color: 'var(--station)'
    },
    'XENOMORPH': {
      message: 'SPECIMEN STATUS: CONTAINMENT BREACH',
      color: 'var(--alert)'
    },
    'NOSTROMO': {
      message: 'CREW EXPENDABLE.',
      color: 'var(--primary)'
    },
    'RIPLEY': {
      message: 'FINAL REPORT, COMMERCIAL STARSHIP NOSTROMO',
      color: 'var(--station)'
    }
  };

  var overlay = document.getElementById('egg-overlay');
  if (!overlay) return;

  // オーバーレイをクリックで閉じる
  overlay.addEventListener('click', function () {
    overlay.classList.remove('active');
  });

  /**
   * イースターエッグメッセージを表示
   */
  function showMessage(command) {
    overlay.textContent = command.message;
    overlay.style.color = command.color;
    overlay.style.textShadow = '0 0 30px ' + command.color;
    overlay.classList.add('active');

    // 自動で閉じる
    setTimeout(function () {
      overlay.classList.remove('active');
    }, DISPLAY_DURATION);
  }

  /**
   * キーボード入力を監視
   */
  document.addEventListener('keydown', function (e) {
    // フォーム要素にフォーカス中は無視
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    inputBuffer += e.key.toUpperCase();

    // バッファが長すぎたらトリミング
    if (inputBuffer.length > BUFFER_MAX) {
      inputBuffer = inputBuffer.slice(-BUFFER_MAX);
    }

    // コマンドマッチング
    var keywords = Object.keys(COMMANDS);
    for (var i = 0; i < keywords.length; i++) {
      var keyword = keywords[i];
      if (inputBuffer.indexOf(keyword) !== -1) {
        showMessage(COMMANDS[keyword]);
        inputBuffer = ''; // バッファリセット
        break;
      }
    }
  });

})();
