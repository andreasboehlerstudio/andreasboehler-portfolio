import {
  WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, Mesh,
  ShaderMaterial, TextureLoader, Vector2, Vector3, SRGBColorSpace
} from './assets/vendor/three/three.module.min.js';

export async function mountPortraitReveal(surface) {
  const enabled = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 701px) and (prefers-reduced-motion: no-preference)');
  if (!enabled.matches || navigator.connection?.saveData) return;
  const base = surface.querySelector('.about-brush-base');
  const reveal = surface.querySelector('[data-about-brush-color]');
  if (!base || !reveal) return;

  let renderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch {
    return; // The real HTML portrait is always the fallback.
  }
  const canvas = renderer.domElement;
  canvas.className = 'portrait-webgl';
  canvas.setAttribute('aria-hidden', 'true');
  renderer.setClearColor(0x000000, 0);
  const loader = new TextureLoader();
  const results = await Promise.allSettled([loader.loadAsync(base.currentSrc || base.src), loader.loadAsync(reveal.currentSrc || reveal.src)]);
  if (results.some(result => result.status === 'rejected')) {
    results.forEach(result => { if (result.status === 'fulfilled') result.value.dispose(); });
    renderer.dispose();
    return;
  }
  const textures = results.map(result => result.value);
  textures.forEach(texture => { texture.colorSpace = SRGBColorSpace; });
  const points = Array.from({ length: 24 }, () => new Vector3(-2, -2, 0));
  const uniforms = {
    normalImage: { value: textures[0] }, revealImage: { value: textures[1] },
    coverScale: { value: new Vector2(1, 1) }, coverOffset: { value: new Vector2() },
    resolution: { value: new Vector2() }, points: { value: points },
    pointer: { value: new Vector2(.5, .5) }
  };
  const material = new ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms,
    vertexShader: `varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: `
      uniform sampler2D normalImage;
      uniform sampler2D revealImage;
      uniform vec2 coverScale, coverOffset, resolution, pointer;
      uniform vec3 points[24];
      varying vec2 vUv;
      void main() {
        float brush = 0.;
        for (int i = 0; i < 24; i++) {
          float distancePx = length((vUv - points[i].xy) * resolution);
          brush = max(brush, (1. - smoothstep(34., 150., distancePx)) * points[i].z);
        }
        vec2 uv = vUv * coverScale + coverOffset;
        vec2 displacement = (pointer - vUv) * .007 * brush;
        vec3 original = texture2D(normalImage, uv).rgb;
        vec3 revealed = texture2D(revealImage, uv + displacement).rgb;
        gl_FragColor = vec4(mix(original, revealed, smoothstep(0., .62, brush)), brush);
        #include <colorspace_fragment>
      }`
  });
  const geometry = new PlaneGeometry(2, 2);
  const scene = new Scene();
  scene.add(new Mesh(geometry, material));
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  let frame = 0, lastTime = 0, nextPoint = 0, visible = true, disposed = false;
  const stop = () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; };
  const request = () => {
    if (!frame && visible && !document.hidden && enabled.matches && !disposed) frame = requestAnimationFrame(draw);
  };
  function draw(now) {
    frame = 0;
    const elapsed = lastTime ? Math.min((now - lastTime) / 1000, .1) : 0;
    lastTime = now;
    let active = false;
    points.forEach(point => { point.z = Math.max(0, point.z - elapsed / 1.8); active ||= point.z > 0; });
    renderer.render(scene, camera);
    if (active) request(); else lastTime = 0;
  }
  function resize() {
    const { width, height } = surface.getBoundingClientRect();
    if (!width || !height) return;
    const dpr = Math.min(devicePixelRatio, 1.5, Math.sqrt(2000000 / (width * height)));
    renderer.setSize(Math.round(width * dpr), Math.round(height * dpr), false);
    uniforms.resolution.value.set(width, height);
    const image = textures[0].image;
    const scale = Math.max(width / image.width, height / image.height);
    uniforms.coverScale.value.set(width / (image.width * scale), height / (image.height * scale));
    uniforms.coverOffset.value.set((1 - uniforms.coverScale.value.x) * .5, (1 - uniforms.coverScale.value.y) * .58);
    request();
  }
  function move(event) {
    if (event.pointerType === 'touch' || !enabled.matches) return;
    const rect = surface.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    uniforms.pointer.value.set(x, y);
    points[nextPoint].set(x, y, 1);
    nextPoint = (nextPoint + 1) % points.length;
    request();
  }
  function visibility() { if (document.hidden) stop(); else request(); }
  function preference() {
    canvas.hidden = !enabled.matches;
    if (!enabled.matches) { stop(); points.forEach(point => { point.z = 0; }); }
    else { resize(); request(); }
  }
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) request(); else stop();
  });
  const resizeObserver = new ResizeObserver(resize);
  function dispose() {
    if (disposed) return;
    disposed = true; stop(); observer.disconnect(); resizeObserver.disconnect();
    surface.removeEventListener('pointermove', move);
    document.removeEventListener('visibilitychange', visibility);
    enabled.removeEventListener('change', preference);
    window.removeEventListener('pagehide', pagehide);
    textures.forEach(texture => texture.dispose()); geometry.dispose(); material.dispose(); renderer.dispose();
    canvas.remove();
  }
  function pagehide(event) { if (!event.persisted) dispose(); else stop(); }
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); dispose(); }, { once: true });
  surface.append(canvas);
  surface.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('visibilitychange', visibility);
  enabled.addEventListener('change', preference);
  window.addEventListener('pagehide', pagehide);
  observer.observe(surface); resizeObserver.observe(surface); resize(); preference();
  surface.dataset.webglReady = 'true';
}
