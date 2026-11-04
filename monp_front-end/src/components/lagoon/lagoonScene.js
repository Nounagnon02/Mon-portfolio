/* ============================================================
   Lagoon scene — houses on stilts, built from code (no model file).
   The house is the interface everyone sees; the stilts under the
   water are what carries it. Scrolling takes the camera below the
   surface, where each stilt carries the name of a technology.
   ============================================================ */
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  Fog,
  HemisphereLight,
  DirectionalLight,
  PlaneGeometry,
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  SphereGeometry,
  Mesh,
  MeshLambertMaterial,
  MeshBasicMaterial,
  InstancedMesh,
  Object3D,
  Group,
  Sprite,
  SpriteMaterial,
  CanvasTexture,
  DoubleSide,
  MathUtils,
  SRGBColorSpace,
  Vector3,
} from 'three';

const SURFACE_Y = 0;
const DECK_Y = 0.9;
const BED_Y = -4.2;
const SLOW_FRAME = 1 / 22; // below ~22 fps on average, the static image takes over

// x, z, width, body height, depth. Two staggered rows (z ≈ 0 near, z ≈ -6 far)
// so roofs and name tags never overlap. Wide screens: houses fill the right half.
const LAYOUT_WIDE = [
  [0.25, 0, 1.7, 0.85, 1.3],
  [2.16, -5, 1.8, 0.9, 1.4],
  [3.08, -0.5, 1.6, 0.8, 1.2],
  [6.15, -5.5, 1.7, 0.85, 1.3],
  [5.94, 0, 1.5, 0.75, 1.2],
  [10.2, -6, 1.6, 0.8, 1.2],
];

// Portrait screens: three houses in front, three behind, all below the text
const LAYOUT_NARROW = [
  [-2.46, 0, 1.3, 0.75, 1.0],
  [0, 0, 1.4, 0.8, 1.1],
  [2.46, 0, 1.3, 0.7, 1.0],
  [-1.65, -7, 1.3, 0.75, 1.0],
  [1.65, -7, 1.3, 0.7, 1.0],
  [4.6, -7, 1.3, 0.75, 1.0],
];

const NEAR_ROW_Z = -3;

const CAMERA_WIDE = { fov: 38, pos: [0, 1.6, 14], look: [0, 2.2, 0] };
const CAMERA_NARROW = { fov: 52, pos: [0, 1.4, 20], look: [0, 5.47, 0] };

function smoothstep(edge0, edge1, x) {
  const t = MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function makeLabel(text, { fg, bg, border, worldHeight }) {
  const scale = 2;
  const fontPx = 26 * scale;
  const padX = 18 * scale;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const font = `500 ${fontPx}px "IBM Plex Mono", ui-monospace, monospace`;
  ctx.font = font;
  const width = Math.ceil(ctx.measureText(text).width + padX * 2);
  const height = Math.ceil(fontPx * 1.9);
  canvas.width = width;
  canvas.height = height;

  ctx.font = font;
  const r = height / 2;
  ctx.beginPath();
  ctx.moveTo(r, 1);
  ctx.lineTo(width - r, 1);
  ctx.arc(width - r, r, r - 1, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(r, height - 1);
  ctx.arc(r, r, r - 1, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();
  ctx.fillStyle = bg;
  ctx.fill();
  if (border) {
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = border;
    ctx.stroke();
  }
  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2 + scale);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const material = new SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new Sprite(material);
  sprite.scale.set(worldHeight * (width / height), worldHeight, 1);
  return sprite;
}

export function createLagoonScene(canvas, { houses, palette, narrow, onSlow, onLost }) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !narrow,
    powerPreference: 'default',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.6));
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const haze = new Color(palette.haze);
  const deep = new Color(palette.deepTop);
  scene.fog = new Fog(haze.clone(), 16, 60);

  const preset = narrow ? CAMERA_NARROW : CAMERA_WIDE;
  const camera = new PerspectiveCamera(preset.fov, 1, 0.1, 120);
  const basePos = new Vector3(...preset.pos);
  const baseLook = new Vector3(...preset.look);
  const lookTarget = new Vector3();

  scene.add(new HemisphereLight(new Color(palette.skyBottom), deep, 1.7));
  const sun = new DirectionalLight(new Color(palette.sun), 1.3);
  sun.position.set(16, 7, -12);
  scene.add(sun);
  // Soft light on the façades facing the visitor (dimmer at night)
  const fill = new DirectionalLight(new Color(palette.skyTop), palette.night ? 0.45 : 1.2);
  fill.position.set(-4, 6, 18);
  scene.add(fill);

  const disposables = [];
  const track = (thing) => {
    disposables.push(thing);
    return thing;
  };

  /* ---- Water surface (gentle waves in the vertex shader) ---- */
  const time = { value: 0 };
  const waterGeo = track(new PlaneGeometry(160, 160, 48, 48));
  const waterMat = track(
    new MeshBasicMaterial({
      color: palette.water,
      transparent: true,
      opacity: 0.9,
      side: DoubleSide,
    }),
  );
  waterMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time;
    shader.vertexShader = `uniform float uTime;\n${shader.vertexShader}`.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      transformed.z += sin(position.x * 0.55 + uTime * 0.9) * 0.035 + cos(position.y * 0.7 + uTime * 0.7) * 0.03;`,
    );
  };
  const water = new Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = SURFACE_Y;
  water.renderOrder = 2;
  scene.add(water);

  /* ---- Lagoon bed ---- */
  const bed = new Mesh(
    track(new PlaneGeometry(160, 160)),
    track(new MeshLambertMaterial({ color: palette.deepBottom })),
  );
  bed.rotation.x = -Math.PI / 2;
  bed.position.y = BED_Y;
  scene.add(bed);

  /* ---- Houses ---- */
  const woodMat = track(new MeshLambertMaterial({ color: palette.wood }));
  const roofMat = track(new MeshLambertMaterial({ color: palette.roof }));
  const deckMat = track(new MeshLambertMaterial({ color: palette.deck }));
  const windowMat = track(new MeshBasicMaterial({ color: palette.window }));
  const doorMat = track(new MeshBasicMaterial({ color: palette.deck }));
  const boxGeo = track(new BoxGeometry(1, 1, 1));
  const roofGeo = track(new ConeGeometry(Math.SQRT1_2, 1, 4));
  roofGeo.rotateY(Math.PI / 4);
  const paneGeo = track(new PlaneGeometry(1, 1));

  const layout = narrow ? LAYOUT_NARROW : LAYOUT_WIDE;
  const stiltSpots = [];
  const nameLabels = [];
  const techLabels = [];

  houses.slice(0, layout.length).forEach((house, i) => {
    const [x, z, w, h, d] = layout[i];
    const group = new Group();
    group.position.set(x, 0, z);

    const deck = new Mesh(boxGeo, deckMat);
    deck.scale.set(w + 0.35, 0.08, d + 0.35);
    deck.position.y = DECK_Y;
    group.add(deck);

    const body = new Mesh(boxGeo, woodMat);
    body.scale.set(w, h, d);
    body.position.y = DECK_Y + 0.04 + h / 2;
    group.add(body);

    const roofH = h * 0.85;
    const roof = new Mesh(roofGeo, roofMat);
    roof.scale.set(w + 0.3, roofH, d + 0.3);
    roof.position.y = DECK_Y + 0.04 + h + roofH / 2;
    group.add(roof);

    const front = d / 2 + 0.002;
    [-w * 0.27, w * 0.27].forEach((wx) => {
      const pane = new Mesh(paneGeo, windowMat);
      pane.scale.set(0.2, 0.24, 1);
      pane.position.set(wx, DECK_Y + 0.04 + h * 0.58, front);
      group.add(pane);
    });
    const door = new Mesh(paneGeo, doorMat);
    door.scale.set(0.2, h * 0.6, 1);
    door.position.set(0, DECK_Y + 0.04 + h * 0.3, front);
    group.add(door);

    scene.add(group);

    // Stilts: four corners plus a middle pair on wider houses
    const xs = w > 1.6 ? [-w / 2, 0, w / 2] : [-w / 2, w / 2];
    xs.forEach((sx) => {
      [-d / 2, d / 2].forEach((sz) => stiltSpots.push([x + sx, z + sz]));
    });

    // On portrait screens only the front row is labelled, larger, to stay readable
    const nearRow = z > NEAR_ROW_Z;
    if (narrow && !nearRow) return;

    const label = makeLabel(house.name, {
      fg: palette.skyTop,
      bg: palette.ink,
      worldHeight: narrow ? 0.5 : 0.3,
    });
    label.position.set(x, DECK_Y + 0.04 + h + roofH + (narrow ? 0.5 : 0.38), z);
    track(label.material.map);
    track(label.material);
    nameLabels.push(label);
    scene.add(label);

    house.foundations.slice(0, narrow ? 2 : 3).forEach((tech, j) => {
      const tag = makeLabel(tech, {
        fg: palette.onDeep,
        bg: palette.deepTop,
        border: palette.onDeepSoft,
        worldHeight: narrow ? 0.42 : 0.26,
      });
      const tagX = narrow ? x : x + (j - 1) * (w * 0.45);
      tag.position.set(tagX, -1.25 - j * (narrow ? 0.8 : 0.62), z + d / 2 + 0.25);
      tag.material.opacity = 0;
      // Always drawn over the stilts, so a technology name is never cut in two
      tag.material.depthTest = false;
      tag.renderOrder = 10;
      track(tag.material.map);
      track(tag.material);
      techLabels.push(tag);
      scene.add(tag);
    });
  });

  const stiltLength = DECK_Y - BED_Y;
  const stiltGeo = track(new CylinderGeometry(0.055, 0.07, stiltLength, 6));
  const stiltMat = track(new MeshLambertMaterial({ color: palette.woodWet }));
  const stilts = new InstancedMesh(stiltGeo, stiltMat, stiltSpots.length);
  const dummy = new Object3D();
  stiltSpots.forEach(([sx, sz], i) => {
    dummy.position.set(sx, (DECK_Y + BED_Y) / 2, sz);
    dummy.rotation.set(0, 0, ((i % 3) - 1) * 0.015);
    dummy.updateMatrix();
    stilts.setMatrixAt(i, dummy.matrix);
  });
  scene.add(stilts);

  /* ---- A pirogue drifting near the shore ---- */
  const canoe = new Group();
  const hull = new Mesh(boxGeo, deckMat);
  hull.scale.set(1.7, 0.12, 0.34);
  canoe.add(hull);
  const bodyGeo = track(new CylinderGeometry(0.07, 0.09, 0.42, 6));
  const headGeo = track(new SphereGeometry(0.085, 8, 6));
  const poleGeo = track(new CylinderGeometry(0.014, 0.014, 1.9, 4));
  const person = new Mesh(bodyGeo, deckMat);
  person.position.set(-0.2, 0.27, 0);
  canoe.add(person);
  const head = new Mesh(headGeo, deckMat);
  head.position.set(-0.2, 0.56, 0);
  canoe.add(head);
  const pole = new Mesh(poleGeo, deckMat);
  pole.position.set(0.15, 0.55, 0);
  pole.rotation.z = -0.38;
  canoe.add(pole);
  const canoeBase = narrow ? new Vector3(-1.8, 0.05, 9) : new Vector3(-4.5, 0.05, 5);
  canoe.position.copy(canoeBase);
  scene.add(canoe);

  /* ---- State, loop, interaction ---- */
  let progress = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let raf = 0;
  let running = false;
  let last = 0;
  let elapsed = 0;
  let perfFrames = 0;
  let perfTotal = 0;
  let perfChecked = false;
  let disposed = false;

  const clearColor = new Color();

  function update(dt) {
    elapsed += dt;
    time.value = elapsed;

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    const dive = smoothstep(0, 1, progress);
    camera.position.set(
      basePos.x + pointer.x * 0.35,
      MathUtils.lerp(basePos.y, -2.2, dive) + pointer.y * 0.15,
      MathUtils.lerp(basePos.z, basePos.z - 2.2, dive),
    );
    lookTarget.set(baseLook.x, MathUtils.lerp(baseLook.y, -2.4, dive), baseLook.z);
    camera.lookAt(lookTarget);

    // Above the water: transparent canvas over the CSS sky. Below: deep water.
    const under = smoothstep(0.3, -0.3, camera.position.y - SURFACE_Y);
    scene.fog.color.lerpColors(haze, deep, under);
    // Underwater visibility scales with the camera distance, so the stilts stay visible
    scene.fog.near = MathUtils.lerp(basePos.z + 4, basePos.z * 0.25, under);
    scene.fog.far = MathUtils.lerp(basePos.z + 48, basePos.z + 10, under);
    clearColor.copy(deep);
    renderer.setClearColor(clearColor, under);

    nameLabels.forEach((l) => {
      l.material.opacity = 1 - under;
    });
    techLabels.forEach((l) => {
      l.material.opacity = smoothstep(0.35, 1, under);
    });

    // Seen from below, the hull would hide the view: the pirogue stays above the surface
    canoe.visible = under < 0.5;
    canoe.position.x = canoeBase.x + Math.sin(elapsed * 0.07) * 0.6;
    canoe.position.y = canoeBase.y + Math.sin(elapsed * 1.1) * 0.02;
    canoe.rotation.z = Math.sin(elapsed * 1.3) * 0.02;
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60;
    last = now;
    update(dt);
    renderer.render(scene, camera);

    // Measure once, after a short warm-up, whether this device keeps up
    if (!perfChecked && elapsed > 1.5) {
      perfFrames += 1;
      perfTotal += dt;
      if (perfFrames >= 90) {
        perfChecked = true;
        if (perfTotal / perfFrames > SLOW_FRAME && onSlow) onSlow();
      }
    }
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const handleLost = (e) => {
    e.preventDefault();
    if (onLost) onLost();
  };
  canvas.addEventListener('webglcontextlost', handleLost);

  resize();
  update(0);
  renderer.render(scene, camera);

  return {
    setProgress(p) {
      progress = MathUtils.clamp(p, 0, 1);
    },
    setPointer(x, y) {
      pointer.tx = MathUtils.clamp(x, -1, 1);
      pointer.ty = MathUtils.clamp(y, -1, 1);
    },
    start() {
      if (running || disposed) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    resize,
    dispose() {
      if (disposed) return;
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('webglcontextlost', handleLost);
      stilts.dispose();
      disposables.forEach((thing) => thing.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
