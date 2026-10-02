import * as THREE from 'three';

/**
 * AI PULSE — 3D EVENT HORIZON & NEURAL UNIVERSE SCENE
 * Concept: Black hole with relativistic accretion disk, synaptic neural network,
 * and reactive gravitational particle field.
 */

export class EventHorizonScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`Container #${containerId} not found.`);
      return;
    }

    // Config & Parameters
    this.params = {
      speed: 1.0,
      particleCount: window.innerWidth < 768 ? 1600 : 3600,
      gravitationalWarp: 1.5,
      theme: 'orange', // 'orange' | 'cyan' | 'matrix'
      diskRadiusInner: 4.5,
      diskRadiusOuter: 16.0,
      isBursting: false,
      burstFactor: 0,
    };

    // Color themes
    this.themes = {
      orange: {
        coreGlow: new THREE.Color(0xFF5500),
        accretionInner: new THREE.Color(0xFFFFFF),
        accretionMid: new THREE.Color(0xFF7700),
        accretionOuter: new THREE.Color(0x992200),
        particles: new THREE.Color(0xFFAA44),
        synapses: new THREE.Color(0xFF6600),
        bgVoid: new THREE.Color(0x040408)
      },
      cyan: {
        coreGlow: new THREE.Color(0x00F0FF),
        accretionInner: new THREE.Color(0xFFFFFF),
        accretionMid: new THREE.Color(0x00B4D8),
        accretionOuter: new THREE.Color(0x7209B7),
        particles: new THREE.Color(0x00F0FF),
        synapses: new THREE.Color(0x0077B6),
        bgVoid: new THREE.Color(0x030712)
      },
      matrix: {
        coreGlow: new THREE.Color(0x00FF66),
        accretionInner: new THREE.Color(0xEEFFEA),
        accretionMid: new THREE.Color(0x00FF41),
        accretionOuter: new THREE.Color(0x003B00),
        particles: new THREE.Color(0x00FF41),
        synapses: new THREE.Color(0x008F11),
        bgVoid: new THREE.Color(0x020803)
      }
    };

    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    this.scrollProgress = 0;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030306, 0.018);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 4.5, 24);
    this.camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance',
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    // 3. Build Objects
    this.createBlackHoleCore();
    this.createAccretionDisk();
    this.createNeuralParticleField();
    this.createRelativisticJets();

    // 4. Listeners
    this.bindEvents();

    // 5. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  /**
   * The Event Horizon Void Core with Gravitational Lensing Halo
   */
  createBlackHoleCore() {
    this.blackHoleGroup = new THREE.Group();

    // Pure absolute void sphere (event horizon)
    const coreGeo = new THREE.SphereGeometry(3.6, 64, 64);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.blackHoleGroup.add(this.coreMesh);

    // Glowing photon sphere ring / Gravitational lensing ring
    const photonGeo = new THREE.RingGeometry(3.62, 4.2, 80);
    const photonMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        glowColor: { value: this.themes[this.params.theme].coreGlow },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 glowColor;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          float intensity = pow(1.0 - abs(dist - 0.45) * 5.0, 3.0);
          gl_FragColor = vec4(glowColor, clamp(intensity * 1.5, 0.0, 1.0));
        }
      `
    });
    this.photonRing = new THREE.Mesh(photonGeo, photonMat);
    this.photonRing.rotation.x = Math.PI / 2.3;
    this.blackHoleGroup.add(this.photonRing);

    // Outer Einstein Ring Halo (Billboard)
    const haloGeo = new THREE.PlaneGeometry(16, 16);
    const haloMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        glowColor: { value: this.themes[this.params.theme].coreGlow }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 glowColor;
        void main() {
          float r = length(vUv - 0.5) * 2.0;
          float halo = smoothstep(0.4, 0.5, r) * smoothstep(0.9, 0.5, r);
          gl_FragColor = vec4(glowColor, halo * 0.45);
        }
      `
    });
    this.haloMesh = new THREE.Mesh(haloGeo, haloMat);
    this.blackHoleGroup.add(this.haloMesh);

    this.scene.add(this.blackHoleGroup);
  }

  /**
   * Relativistic Accretion Disk with Doppler beaming & swirling plasma particles
   */
  createAccretionDisk() {
    const diskParticleCount = window.innerWidth < 768 ? 4000 : 9000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(diskParticleCount * 3);
    const colors = new Float32Array(diskParticleCount * 3);
    const sizes = new Float32Array(diskParticleCount);
    const angles = new Float32Array(diskParticleCount);
    const radii = new Float32Array(diskParticleCount);

    const theme = this.themes[this.params.theme];

    for (let i = 0; i < diskParticleCount; i++) {
      // Logarithmic distribution concentrated near event horizon
      const t = Math.pow(Math.random(), 2.2);
      const r = THREE.MathUtils.lerp(this.params.diskRadiusInner, this.params.diskRadiusOuter, t);
      const angle = Math.random() * Math.PI * 2;

      // Vertical thickness tapers off at edges
      const height = (Math.random() - 0.5) * (0.8 + (r / this.params.diskRadiusOuter) * 0.6);

      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = height;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      radii[i] = r;
      angles[i] = angle;

      // Plasma heat color gradient: White-hot inner disk -> fiery mid -> deep void outer
      const color = new THREE.Color();
      if (r < 6.5) {
        color.copy(theme.accretionInner).lerp(theme.accretionMid, (r - 4.5) / 2.0);
      } else {
        color.copy(theme.accretionMid).lerp(theme.accretionOuter, (r - 6.5) / (16.0 - 6.5));
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = (1.5 + Math.random() * 2.5) * (window.devicePixelRatio > 1 ? 1.0 : 1.4);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    this.diskRadii = radii;
    this.diskAngles = angles;

    // Custom Shader for soft glowing accretion points
    const mat = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: this.params.speed },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        varying float vBrightness;
        uniform float uTime;
        uniform float uSpeed;

        void main() {
          vColor = color;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Doppler beaming approximation: particles moving towards camera are brighter
          float doppler = 1.0 + (position.x / 14.0) * 0.45;
          vBrightness = clamp(doppler, 0.4, 1.6);
          
          gl_PointSize = size * (180.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vBrightness;

        void main() {
          // Circular particle with soft exponential falloff
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.05, dist);
          gl_FragColor = vec4(vColor * vBrightness, alpha * 0.85);
        }
      `
    });

    this.accretionPoints = new THREE.Points(geo, mat);
    this.accretionPoints.rotation.x = Math.PI / 3.2; // Tilted accretion disk
    this.accretionPoints.rotation.z = Math.PI / 12;
    this.scene.add(this.accretionPoints);
  }

  /**
   * Synaptic Neural Particle Network (Connecting Neurons in 3D Space)
   */
  createNeuralParticleField() {
    const count = this.params.particleCount;
    this.neuralGeo = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const originalPos = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    const radiusSpread = 42;

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 8.0 + Math.cbrt(Math.random()) * radiusSpread;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPos[i * 3] = x;
      originalPos[i * 3 + 1] = y;
      originalPos[i * 3 + 2] = z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.015;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }

    this.neuralPositions = positions;
    this.neuralOriginalPos = originalPos;
    this.neuralVelocities = velocities;

    this.neuralGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const neuralMat = new THREE.PointsMaterial({
      color: this.themes[this.params.theme].particles,
      size: 1.8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.neuralPoints = new THREE.Points(this.neuralGeo, neuralMat);
    this.scene.add(this.neuralPoints);
  }

  /**
   * Relativistic Polar Jets (Singularity Jets shooting from black hole poles)
   */
  createRelativisticJets() {
    const jetCount = 800;
    const jetGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(jetCount * 3);
    const colors = new Float32Array(jetCount * 3);

    const theme = this.themes[this.params.theme];

    for (let i = 0; i < jetCount; i++) {
      const sign = i % 2 === 0 ? 1 : -1;
      const length = 4.0 + Math.random() * 26.0;
      const cone = (length / 26.0) * 1.5;

      const x = (Math.random() - 0.5) * cone;
      const z = (Math.random() - 0.5) * cone;
      const y = sign * length;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const c = new THREE.Color().copy(theme.accretionMid).lerp(theme.coreGlow, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    jetGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    jetGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const jetMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 2.2,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.jets = new THREE.Points(jetGeo, jetMat);
    this.jets.rotation.x = Math.PI / 3.2; // Aligned with black hole spin axis
    this.jets.rotation.z = Math.PI / 12;
    this.scene.add(this.jets);
  }

  bindEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }

  /**
   * Public API methods for UI and Lab Controller
   */
  setSpeed(value) {
    this.params.speed = parseFloat(value);
  }

  setWarp(value) {
    this.params.gravitationalWarp = parseFloat(value);
  }

  setParticleCount(count) {
    // Dynamically adjust active particles count in buffer geometry
    this.params.particleCount = Math.min(count, this.neuralPositions.length / 3);
    this.neuralGeo.setDrawRange(0, this.params.particleCount);
  }

  setTheme(themeName) {
    if (!this.themes[themeName]) return;
    this.params.theme = themeName;
    const theme = this.themes[themeName];

    // Update shaders and materials
    if (this.photonRing) {
      this.photonRing.material.uniforms.glowColor.value = theme.coreGlow;
    }
    if (this.haloMesh) {
      this.haloMesh.material.uniforms.glowColor.value = theme.coreGlow;
    }
    if (this.neuralPoints) {
      this.neuralPoints.material.color = theme.particles;
    }

    // Re-color accretion disk
    if (this.accretionPoints) {
      const colors = this.accretionPoints.geometry.attributes.color.array;
      for (let i = 0; i < this.diskRadii.length; i++) {
        const r = this.diskRadii[i];
        const color = new THREE.Color();
        if (r < 6.5) {
          color.copy(theme.accretionInner).lerp(theme.accretionMid, (r - 4.5) / 2.0);
        } else {
          color.copy(theme.accretionMid).lerp(theme.accretionOuter, (r - 6.5) / (16.0 - 6.5));
        }
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      this.accretionPoints.geometry.attributes.color.needsUpdate = true;
    }
  }

  triggerBurst() {
    this.params.isBursting = true;
    this.params.burstFactor = 1.0;
  }

  resetCamera() {
    this.camera.position.set(0, 4.5, 24);
    this.camera.lookAt(0, 0, 0);
    this.mouse.targetX = 0;
    this.mouse.targetY = 0;
  }

  /**
   * Animation & Render Loop
   */
  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse lerping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Burst decay
    if (this.params.isBursting) {
      this.params.burstFactor *= 0.94;
      if (this.params.burstFactor < 0.01) {
        this.params.isBursting = false;
        this.params.burstFactor = 0;
      }
    }

    // 1. Accretion Disk Rotation & Keplerian Orbit Simulation
    if (this.accretionPoints) {
      const positions = this.accretionPoints.geometry.attributes.position.array;
      const count = this.diskRadii.length;
      const baseSpeed = 0.5 * this.params.speed * (1.0 + this.params.burstFactor * 3.0);

      for (let i = 0; i < count; i++) {
        const r = this.diskRadii[i];
        // Keplerian velocity: inner particles orbit much faster than outer particles
        const angularVelocity = (12.0 / Math.pow(r, 1.4)) * baseSpeed * delta;
        this.diskAngles[i] += angularVelocity;

        positions[i * 3] = Math.cos(this.diskAngles[i]) * r;
        positions[i * 3 + 2] = Math.sin(this.diskAngles[i]) * r;
      }
      this.accretionPoints.geometry.attributes.position.needsUpdate = true;
      this.accretionPoints.rotation.y += 0.001 * this.params.speed;
    }

    // 2. Polar Jets pulsation
    if (this.jets) {
      this.jets.rotation.y += 0.005 * this.params.speed;
      const scale = 1.0 + Math.sin(elapsedTime * 4.0) * 0.08 + this.params.burstFactor * 0.5;
      this.jets.scale.set(scale, scale, scale);
    }

    // 3. Neural Universe Particles: Gravitational Attraction & Mouse interaction
    if (this.neuralPoints) {
      const pos = this.neuralPositions;
      const orig = this.neuralOriginalPos;
      const v = this.neuralVelocities;
      const count = this.params.particleCount;
      const warp = this.params.gravitationalWarp;

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        // Gravitational pull toward singularity center (0,0,0)
        const dX = -pos[idx];
        const dY = -pos[idx + 1];
        const dZ = -pos[idx + 2];
        const distSq = dX * dX + dY * dY + dZ * dZ + 0.1;
        const dist = Math.sqrt(distSq);

        // Orbital swirl around y-axis
        const swirlX = -pos[idx + 2] * 0.0015 * warp;
        const swirlZ = pos[idx] * 0.0015 * warp;

        pos[idx] += v[idx] + swirlX;
        pos[idx + 1] += v[idx + 1];
        pos[idx + 2] += v[idx + 2] + swirlZ;

        // If pulled too close to event horizon, respawn far away in outer universe
        if (dist < 3.8) {
          pos[idx] = orig[idx] * (1.2 + Math.random() * 0.5);
          pos[idx + 1] = orig[idx + 1] * (1.2 + Math.random() * 0.5);
          pos[idx + 2] = orig[idx + 2] * (1.2 + Math.random() * 0.5);
        }
      }
      this.neuralGeo.attributes.position.needsUpdate = true;
    }

    // 4. Black Hole & Ring Pulsing
    if (this.blackHoleGroup) {
      const pulse = 1.0 + Math.sin(elapsedTime * 2.0) * 0.02 + this.params.burstFactor * 0.15;
      this.blackHoleGroup.scale.set(pulse, pulse, pulse);
      // Billboard halo faces camera
      this.haloMesh.quaternion.copy(this.camera.quaternion);
    }

    // 5. Camera Motion based on Scroll and Mouse Parallax
    const targetCamX = this.mouse.x * 3.5;
    const targetCamY = 4.5 + this.mouse.y * 2.5 - this.scrollProgress * 8.0;
    const targetCamZ = 24.0 - this.scrollProgress * 12.0; // Fly-in plunge as user scrolls

    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.04;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.04;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.04;

    this.camera.lookAt(0, -this.scrollProgress * 2.0, 0);

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}
