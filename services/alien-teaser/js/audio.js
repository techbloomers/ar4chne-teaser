/**
 * audio.js — Web Audio API アンビエントサウンドシステム
 * 
 * 低周波ドローン音 + LFO + 微妙なうなりで不気味な空間音を生成
 * 外部ファイル・APIキー一切不要
 * 
 * #audio-btn のクリックでON/OFF切替
 */

(function () {
  'use strict';

  var audioCtx = null;
  var isPlaying = false;
  var masterGain = null;

  var btn = document.getElementById('audio-btn');
  if (!btn) return;

  /**
   * オーディオグラフを構築する
   * 3つのオシレーター + LFOで不気味なドローンを生成
   */
  function setupAudioGraph() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // マスターゲイン（全体音量）
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0; // 初期は無音
    masterGain.connect(audioCtx.destination);

    // --- ドローン1: メイン低周波 ---
    var drone1 = audioCtx.createOscillator();
    drone1.type = 'sine';
    drone1.frequency.value = 48; // 低い周波数
    var drone1Gain = audioCtx.createGain();
    drone1Gain.gain.value = 0.5;
    drone1.connect(drone1Gain);
    drone1Gain.connect(masterGain);

    // --- LFO: ドローン1の音量をゆっくりうねらせる ---
    var lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08; // 非常にゆっくり
    var lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.12;
    lfo.connect(lfoGain);
    lfoGain.connect(drone1Gain.gain); // ドローン1のゲインを変調

    // --- ドローン2: 微妙にずらしてうなりを生む ---
    var drone2 = audioCtx.createOscillator();
    drone2.type = 'sine';
    drone2.frequency.value = 51; // 3Hzのビートを生む
    var drone2Gain = audioCtx.createGain();
    drone2Gain.gain.value = 0.25;
    drone2.connect(drone2Gain);
    drone2Gain.connect(masterGain);

    // --- ドローン3: 高いオクターブでうっすら ---
    var drone3 = audioCtx.createOscillator();
    drone3.type = 'triangle';
    drone3.frequency.value = 96; // ドローン1のオクターブ上
    var drone3Gain = audioCtx.createGain();
    drone3Gain.gain.value = 0.06;
    drone3.connect(drone3Gain);
    drone3Gain.connect(masterGain);

    // 全オシレーター開始
    drone1.start();
    lfo.start();
    drone2.start();
    drone3.start();
  }

  /**
   * サウンドのON/OFF切替
   */
  btn.addEventListener('click', function () {
    // 初回クリック時にオーディオグラフ構築
    if (!audioCtx) {
      setupAudioGraph();
    }

    if (isPlaying) {
      // フェードアウト（1.5秒）
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
      isPlaying = false;
      btn.textContent = '♪ Sound: OFF';
    } else {
      // iOS対応: suspend状態ならresume
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      // フェードイン（2.5秒）
      masterGain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 2.5);
      isPlaying = true;
      btn.textContent = '♪ Sound: ON';
    }
  });

})();
