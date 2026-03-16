// ============================================
// AR4CHNE Teaser — Three.js Background
// Spider Web Network — Radial structure + Dynamic connections
// ============================================

import * as THREE from 'three';

export function initBackground(canvas) {
  const isMobile = window.innerWidth < 768;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- Configuration ---
  const config = {
    particleCount: isMobile ? 300 : 650,
    connectionDistance: isMobile ? 1.3 : 1.5,
    maxConnections: isMobile ? 600 : 1800,
    mouseRadius: 3.0,
    mouseStrength: 0.4,
    webRadius: 6,
    webRings: 6,
    webSpokes: 12,
  };

  // =============================================
  // 1. STATIC SPIDER WEB STRUCTURE
  // =============================================

  function createStaticWeb() {
    const points = [];
    const { webRadius, webRings, webSpokes } = config;

    // Generate web node positions
    const webNodes = [];

    for (let r = 0; r <= webRings; r++) {
      webNodes[r] = [];
      const radius = (r / webRings) * webRadius;

      for (let s = 0; s < webSpokes; s++) {
        const angle = (s / webSpokes) * Math.PI * 2;
        // Add organic waviness
        const wobble =
          r > 0 ? Math.sin(s * 3.7 + r * 2.1) * 0.15 + Math.cos(s * 1.3 + r * 4.5) * 0.1 : 0;
        const adjustedRadius = radius + wobble;

        const x = Math.cos(angle) * adjustedRadius;
        const y = Math.sin(angle) * adjustedRadius;
        const z = Math.sin(s * 0.8 + r * 0.5) * 0.15 - 2;

        webNodes[r][s] = new THREE.Vector3(x, y, z);
      }
    }

    // Radial lines (spokes)
    for (let s = 0; s < webSpokes; s++) {
      for (let r = 0; r < webRings; r++) {
        points.push(webNodes[r][s].clone());
        points.push(webNodes[r + 1][s].clone());
      }
    }

    // Concentric rings
    for (let r = 1; r <= webRings; r++) {
      for (let s = 0; s < webSpokes; s++) {
        const nextS = (s + 1) % webSpokes;
        points.push(webNodes[r][s].clone());
        points.push(webNodes[r][nextS].clone());
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
    });

    const web = new THREE.LineSegments(geometry, material);
    web.userData = {
      originalPoints: points.map((p) => p.clone()),
    };
    scene.add(web);

    return web;
  }

  const staticWeb = createStaticWeb();

  // =============================================
  // 2. PARTICLE SYSTEM
  // =============================================

  const { particleCount } = config;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const opacities = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.pow(Math.random(), 0.6) * 8;
    const z = (Math.random() - 0.5) * 5;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = Math.sin(angle) * radius;
    positions[i3 + 2] = z;

    velocities[i3] = (Math.random() - 0.5) * 0.003;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.003;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;

    sizes[i] = Math.random() * 2.5 + 0.5;
    opacities[i] = Math.random() * 0.35 + 0.15;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  particleGeometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: `
      attribute float aSize;
      attribute float aOpacity;
      varying float vOpacity;
      uniform float uTime;
      uniform float uPixelRatio;

      void main() {
        vec3 pos = position;
        pos.x += sin(uTime * 0.3 + position.y * 0.5) * 0.04;
        pos.y += cos(uTime * 0.2 + position.x * 0.5) * 0.04;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * uPixelRatio * (1.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vOpacity = aOpacity;
      }
    `,
    fragmentShader: `
      varying float vOpacity;

      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.05, d) * vOpacity;
        gl_FragColor = vec4(0.659, 0.333, 0.969, alpha);
      }
    `,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // =============================================
  // 3. DYNAMIC CONNECTIONS (LineSegments)
  // =============================================

  const maxLineVertices = config.maxConnections * 2;
  const connectionPositions = new Float32Array(maxLineVertices * 3);
  const connectionAlphas = new Float32Array(maxLineVertices);

  const connectionGeometry = new THREE.BufferGeometry();
  connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));
  connectionGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(connectionAlphas, 1));
  connectionGeometry.setDrawRange(0, 0);

  const connectionMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aAlpha;
      varying float vAlpha;
      void main() {
        vAlpha = aAlpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(0.659, 0.333, 0.969, vAlpha);
      }
    `,
  });

  const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
  scene.add(connections);

  // =============================================
  // 4. MOUSE INTERACTION
  // =============================================

  const mouse = {
    x: 0,
    y: 0,
    target: { x: 0, y: 0 },
    world: { x: 0, y: 0 },
  };

  function onMouseMove(e) {
    mouse.target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.target.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    mouse.world.x = mouse.target.x * 5;
    mouse.world.y = mouse.target.y * 5;
  }
  window.addEventListener('mousemove', onMouseMove);

  // =============================================
  // 5. RESIZE
  // =============================================

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  }
  window.addEventListener('resize', onResize);

  // =============================================
  // 6. ANIMATION LOOP
  // =============================================

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    particleMaterial.uniforms.uTime.value = elapsed;

    // --- Drift particles + mouse repulsion ---
    const posAttr = particleGeometry.getAttribute('position');
    const pa = posAttr.array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      let px = pa[i3];
      let py = pa[i3 + 1];
      let pz = pa[i3 + 2];

      px += velocities[i3];
      py += velocities[i3 + 1];
      pz += velocities[i3 + 2];

      // Mouse repulsion
      const dx = px - mouse.world.x;
      const dy = py - mouse.world.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < config.mouseRadius && dist > 0.01) {
        const force = (1 - dist / config.mouseRadius) * config.mouseStrength * 0.01;
        px += (dx / dist) * force;
        py += (dy / dist) * force;
      }

      // Boundary wrap
      if (Math.abs(px) > 10) velocities[i3] *= -1;
      if (Math.abs(py) > 10) velocities[i3 + 1] *= -1;
      if (Math.abs(pz) > 4) velocities[i3 + 2] *= -1;

      pa[i3] = px;
      pa[i3 + 1] = py;
      pa[i3 + 2] = pz;
    }
    posAttr.needsUpdate = true;

    // --- Update dynamic connections ---
    let lineIndex = 0;
    const connPosAttr = connectionGeometry.getAttribute('position');
    const connAlphaAttr = connectionGeometry.getAttribute('aAlpha');
    const cpa = connPosAttr.array;
    const caa = connAlphaAttr.array;
    const maxDist = config.connectionDistance;
    const maxDistSq = maxDist * maxDist;

    for (let i = 0; i < particleCount && lineIndex < config.maxConnections; i++) {
      const i3 = i * 3;
      const ax = pa[i3];
      const ay = pa[i3 + 1];
      const az = pa[i3 + 2];

      for (let j = i + 1; j < particleCount && lineIndex < config.maxConnections; j++) {
        const j3 = j * 3;
        const ddx = ax - pa[j3];
        if (ddx > maxDist || ddx < -maxDist) continue;
        const ddy = ay - pa[j3 + 1];
        if (ddy > maxDist || ddy < -maxDist) continue;
        const ddz = az - pa[j3 + 2];
        const distSq = ddx * ddx + ddy * ddy + ddz * ddz;

        if (distSq < maxDistSq) {
          const li = lineIndex * 6;
          cpa[li] = ax;
          cpa[li + 1] = ay;
          cpa[li + 2] = az;
          cpa[li + 3] = pa[j3];
          cpa[li + 4] = pa[j3 + 1];
          cpa[li + 5] = pa[j3 + 2];

          const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.12;
          const ai = lineIndex * 2;
          caa[ai] = alpha;
          caa[ai + 1] = alpha;

          lineIndex++;
        }
      }
    }

    connectionGeometry.setDrawRange(0, lineIndex * 2);
    connPosAttr.needsUpdate = true;
    connAlphaAttr.needsUpdate = true;

    // --- Animate static web (gentle breathing + mouse distortion) ---
    const webPosAttr = staticWeb.geometry.getAttribute('position');
    const wpa = webPosAttr.array;
    const originalPoints = staticWeb.userData.originalPoints;
    const breathe = Math.sin(elapsed * 0.5) * 0.025;

    for (let i = 0; i < originalPoints.length; i++) {
      const i3 = i * 3;
      const op = originalPoints[i];
      const distFromCenter = Math.sqrt(op.x * op.x + op.y * op.y);
      const breathScale = 1 + breathe * (distFromCenter / config.webRadius);

      // Mouse distortion on the static web
      const wdx = op.x - mouse.world.x;
      const wdy = op.y - mouse.world.y;
      const wDist = Math.sqrt(wdx * wdx + wdy * wdy);
      let pushX = 0;
      let pushY = 0;
      if (wDist < config.mouseRadius * 1.5 && wDist > 0.01) {
        const pushForce = (1 - wDist / (config.mouseRadius * 1.5)) * 0.3;
        pushX = (wdx / wDist) * pushForce;
        pushY = (wdy / wDist) * pushForce;
      }

      wpa[i3] = op.x * breathScale + pushX;
      wpa[i3 + 1] = op.y * breathScale + pushY;
      wpa[i3 + 2] = op.z + Math.sin(elapsed * 0.3 + distFromCenter * 0.5) * 0.04;
    }
    webPosAttr.needsUpdate = true;

    // --- Smooth camera follow mouse ---
    mouse.x += (mouse.target.x - mouse.x) * 0.02;
    mouse.y += (mouse.target.y - mouse.y) * 0.02;
    camera.position.x = mouse.x * 0.5;
    camera.position.y = mouse.y * 0.3;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  let rafId = null;
  function animateLoop() {
    rafId = requestAnimationFrame(animateLoop);
    animate();
  }
  animateLoop();

  // --- Cleanup ---
  function dispose() {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  }

  return { scene, camera, renderer, staticWeb, dispose };
}
