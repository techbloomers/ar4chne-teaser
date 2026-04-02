/**
 * particles.js — パーティクル星空背景
 * 
 * #particles-canvas にアンバー系の微光点を描画する
 * モバイルでは粒子数を削減、prefers-reduced-motionでは無効化
 */

(function () {
  'use strict';

  var canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  // prefers-reduced-motion を尊重
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // モバイルでは粒子数を削減
  var isMobile = window.innerWidth < 768;
  var PARTICLE_COUNT = isMobile ? 30 : 70;

  // 粒子の初期化
  var stars = [];
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.3,
      velocityX: (Math.random() - 0.5) * 0.12,
      velocityY: (Math.random() - 0.5) * 0.08,
      opacity: Math.random() * 0.4 + 0.08,
      flickerSpeed: Math.random() * 0.015 + 0.003
    });
  }

  // 描画ループ
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var time = Date.now();

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      // 微妙な明滅
      s.opacity += Math.sin(time * s.flickerSpeed) * 0.002;
      s.opacity = Math.max(0.04, Math.min(0.5, s.opacity));

      // 移動
      s.x += s.velocityX;
      s.y += s.velocityY;

      // 画面端のラップアラウンド
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;

      // 描画
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 200, 150, ' + s.opacity + ')';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();

})();
