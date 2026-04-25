import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 uOffset;
  uniform vec2 uResolution;
  uniform vec4 uBorderColor;
  uniform vec4 uHoverColor;
  uniform vec4 uBackgroundColor;
  uniform vec2 uMousePos;
  uniform float uZoom;
  uniform float uCellSize;
  uniform float uTextureCount;
  uniform sampler2D uImageAtlas;
  uniform sampler2D uTextAtlas;
  varying vec2 vUv;

  void main() {
    vec2 screenUV = (vUv - 0.5) * 2.0;

    float radius = length(screenUV);
    float distortion = 1.0 - 0.08 * radius * radius;
    vec2 distortedUV = screenUV * distortion;

    vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 worldCoord = distortedUV * aspectRatio;

    worldCoord *= uZoom;
    worldCoord += uOffset;

    vec2 cellPos = worldCoord / uCellSize;
    vec2 cellId = floor(cellPos);
    vec2 cellUV = fract(cellPos);

    vec2 mouseScreenUV = (uMousePos / uResolution) * 2.0 - 1.0;
    mouseScreenUV.y = -mouseScreenUV.y;

    float mouseRadius = length(mouseScreenUV);
    float mouseDistortion = 1.0 - 0.08 * mouseRadius * mouseRadius;
    vec2 mouseDistortedUV = mouseScreenUV * mouseDistortion;
    vec2 mouseWorldCoord = mouseDistortedUV * aspectRatio;

    mouseWorldCoord *= uZoom;
    mouseWorldCoord += uOffset;

    vec2 mouseCellPos = mouseWorldCoord / uCellSize;
    vec2 mouseCellId = floor(mouseCellPos);

    vec2 cellCenter = cellId + 0.5;
    vec2 mouseCellCenter = mouseCellId + 0.5;
    float cellDistance = length(cellCenter - mouseCellCenter);
    float hoverIntensity = 1.0 - smoothstep(0.4, 0.7, cellDistance);
    bool isHovered = hoverIntensity > 0.0 && uMousePos.x >= 0.0;

    vec3 backgroundColor = uBackgroundColor.rgb;
    if (isHovered) {
      backgroundColor = mix(uBackgroundColor.rgb, uHoverColor.rgb, hoverIntensity * uHoverColor.a);
    }

    float lineWidth = 0.005;
    float gridX = smoothstep(0.0, lineWidth, cellUV.x) * smoothstep(0.0, lineWidth, 1.0 - cellUV.x);
    float gridY = smoothstep(0.0, lineWidth, cellUV.y) * smoothstep(0.0, lineWidth, 1.0 - cellUV.y);
    float gridMask = gridX * gridY;

    float imageSize = 0.6;
    float imageBorder = (1.0 - imageSize) * 0.5;

    vec2 imageUV = (cellUV - imageBorder) / imageSize;

    float edgeSmooth = 0.01;
    vec2 imageMask = smoothstep(-edgeSmooth, edgeSmooth, imageUV) *
                    smoothstep(-edgeSmooth, edgeSmooth, 1.0 - imageUV);
    float imageAlpha = imageMask.x * imageMask.y;

    bool inImageArea = imageUV.x >= 0.0 && imageUV.x <= 1.0 && imageUV.y >= 0.0 && imageUV.y <= 1.0;

    float textHeight = 0.08;
    float textY = 0.88;

    bool inTextArea = cellUV.x >= 0.05 && cellUV.x <= 0.95 && cellUV.y >= textY && cellUV.y <= (textY + textHeight);

    float texIndex = mod(cellId.x + cellId.y * 3.0, uTextureCount);

    vec3 color = backgroundColor;

    if (inImageArea && imageAlpha > 0.0) {
      float atlasSize = ceil(sqrt(uTextureCount));
      vec2 atlasPos = vec2(mod(texIndex, atlasSize), floor(texIndex / atlasSize));
      vec2 atlasUV = (atlasPos + imageUV) / atlasSize;
      atlasUV.y = 1.0 - atlasUV.y;

      vec3 imageColor = texture2D(uImageAtlas, atlasUV).rgb;
      color = mix(color, imageColor, imageAlpha);
    }

    if (inTextArea) {
      vec2 textCoord = vec2((cellUV.x - 0.05) / 0.9, (cellUV.y - textY) / textHeight);
      textCoord.y = 1.0 - textCoord.y;

      float atlasSize = ceil(sqrt(uTextureCount));
      vec2 atlasPos = vec2(mod(texIndex, atlasSize), floor(texIndex / atlasSize));
      vec2 atlasUV = (atlasPos + textCoord) / atlasSize;

      vec4 textColor = texture2D(uTextAtlas, atlasUV);

      vec3 textBgColor = backgroundColor;
      color = mix(textBgColor, textColor.rgb, textColor.a);
    }

    vec3 borderRGB = uBorderColor.rgb;
    float borderAlpha = uBorderColor.a;
    color = mix(color, borderRGB, (1.0 - gridMask) * borderAlpha);

    float fade = 1.0 - smoothstep(1.2, 1.8, radius);

    gl_FragColor = vec4(color * fade, 1.0);
  }
`;

const createPlaceholder = (hue: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, `hsl(${hue}, 80%, 30%)`);
  gradient.addColorStop(1, `hsl(${hue}, 80%, 50%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  for (let i = 0; i < 20; i++) {
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 30, 30);
  }
  return canvas.toDataURL('image/png');
};

const projects = [
  { title: 'Motion Study', image: createPlaceholder(0), year: 2024, href: '/sample-project' },
  { title: 'Idle Form', image: createPlaceholder(30), year: 2023, href: '/sample-project' },
  { title: 'Blur Signal', image: createPlaceholder(60), year: 2024, href: '/sample-project' },
  { title: 'Still Drift', image: createPlaceholder(90), year: 2023, href: '/sample-project' },
  { title: 'Tidewalk', image: createPlaceholder(120), year: 2024, href: '/sample-project' },
  { title: 'Core Motion', image: createPlaceholder(150), year: 2022, href: '/sample-project' },
  { title: 'White Bloom', image: createPlaceholder(180), year: 2024, href: '/sample-project' },
  { title: 'Backrun', image: createPlaceholder(210), year: 2023, href: '/sample-project' },
  { title: 'Rushline', image: createPlaceholder(240), year: 2024, href: '/sample-project' },
  { title: 'Afterimage', image: createPlaceholder(270), year: 2023, href: '/sample-project' },
  { title: 'Shadowhead', image: createPlaceholder(300), year: 2022, href: '/sample-project' },
  { title: 'Opal Lace', image: createPlaceholder(330), year: 2024, href: '/sample-project' },
  { title: 'Glassprint', image: createPlaceholder(10), year: 2024, href: '/sample-project' },
  { title: 'Redshift', image: createPlaceholder(40), year: 2023, href: '/sample-project' },
  { title: 'White Noise', image: createPlaceholder(70), year: 2023, href: '/sample-project' },
  { title: 'Twin Field', image: createPlaceholder(100), year: 2024, href: '/sample-project' },
  { title: 'Petalloop', image: createPlaceholder(130), year: 2023, href: '/sample-project' },
  { title: 'Ghostwalk', image: createPlaceholder(160), year: 2024, href: '/sample-project' },
  { title: 'Heatwave', image: createPlaceholder(190), year: 2023, href: '/sample-project' },
  { title: 'Sky Drift', image: createPlaceholder(220), year: 2024, href: '/sample-project' },
  { title: 'Spindle', image: createPlaceholder(250), year: 2022, href: '/sample-project' },
  { title: 'Pacer', image: createPlaceholder(280), year: 2023, href: '/sample-project' },
  { title: 'Stride', image: createPlaceholder(310), year: 2024, href: '/sample-project' },
  { title: 'Cryo Pulse', image: createPlaceholder(20), year: 2022, href: '/sample-project' },
  { title: 'Velvet Blur', image: createPlaceholder(50), year: 2024, href: '/sample-project' },
];

const config = {
  cellSize: 0.75,
  zoomLevel: 1.25,
  lerpFactor: 0.075,
  borderColor: 'rgba(255, 255, 255, 0.15)',
  backgroundColor: 'rgba(0, 0, 0, 1)',
  textColor: 'rgba(128, 128, 128, 1)',
  hoverColor: 'rgba(255, 255, 255, 0)',
};

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    document.title = 'SPRDLX — Projects';
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene,
      camera: THREE.OrthographicCamera,
      renderer: THREE.WebGLRenderer,
      plane: THREE.Mesh;
    let isDragging = false,
      isClick = true,
      clickStartTime = 0;
    let previousMouse = { x: 0, y: 0 };
    let offset = { x: 0, y: 0 },
      targetOffset = { x: 0, y: 0 };
    let mousePosition = { x: -1, y: -1 };
    let zoomLevel = 1.0,
      targetZoom = 1.0;
    let textTextures: THREE.CanvasTexture[] = [];

    const rgbaToArray = (rgba: string) => {
      const match = rgba.match(/rgba?\(([^)]+)\)/);
      if (!match) return [1, 1, 1, 1];
      return match[1]
        .split(',')
        .map((v, i) =>
          i < 3 ? parseFloat(v.trim()) / 255 : parseFloat(v.trim() || '1')
        );
    };

    const createTextTexture = (title: string, year: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      ctx.clearRect(0, 0, 2048, 256);
      ctx.font = '80px IBM Plex Mono';
      ctx.fillStyle = config.textColor;
      ctx.textBaseline = 'middle';
      ctx.imageSmoothingEnabled = false;

      ctx.textAlign = 'left';
      ctx.fillText(title.toUpperCase(), 30, 128);
      ctx.textAlign = 'right';
      ctx.fillText(year.toString().toUpperCase(), 2048 - 30, 128);

      const texture = new THREE.CanvasTexture(canvas);
      Object.assign(texture, {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        flipY: false,
        generateMipmaps: false,
        format: THREE.RGBAFormat,
      });

      return texture;
    };

    const createTextureAtlas = (textures: THREE.Texture[], isText = false) => {
      const atlasSize = Math.ceil(Math.sqrt(textures.length));
      const textureSize = 512;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = atlasSize * textureSize;
      const ctx = canvas.getContext('2d')!;

      if (isText) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      textures.forEach((texture, index) => {
        const x = (index % atlasSize) * textureSize;
        const y = Math.floor(index / atlasSize) * textureSize;

        if (isText && (texture as any).source?.data) {
          ctx.drawImage((texture as any).source.data, x, y, textureSize, textureSize);
        } else if (!isText && (texture as any).image?.complete) {
          ctx.drawImage((texture as any).image, x, y, textureSize, textureSize);
        }
      });

      const atlasTexture = new THREE.CanvasTexture(canvas);
      Object.assign(atlasTexture, {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        flipY: false,
      });

      return atlasTexture;
    };

    const loadTextures = () => {
      const textureLoader = new THREE.TextureLoader();
      const imageTextures: THREE.Texture[] = [];
      let loadedCount = 0;

      return new Promise<THREE.Texture[]>((resolve) => {
        projects.forEach((project) => {
          const texture = textureLoader.load(project.image, () => {
            if (++loadedCount === projects.length) resolve(imageTextures);
          });

          Object.assign(texture, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
          });

          imageTextures.push(texture);
          textTextures.push(createTextTexture(project.title, project.year));
        });
      });
    };

    const updateMousePosition = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mousePosition.x = event.clientX - rect.left;
      mousePosition.y = event.clientY - rect.top;
      if (plane && (plane.material as THREE.ShaderMaterial).uniforms) {
        ((plane.material as THREE.ShaderMaterial).uniforms.uMousePos.value as THREE.Vector2).set(mousePosition.x, mousePosition.y);
      }
    };

    const startDrag = (x: number, y: number) => {
      isDragging = true;
      isClick = true;
      clickStartTime = Date.now();
      document.body.classList.add('dragging');
      previousMouse.x = x;
      previousMouse.y = y;
      setTimeout(() => isDragging && (targetZoom = config.zoomLevel), 150);
    };

    const handleMove = (currentX: number, currentY: number) => {
      if (!isDragging || currentX === undefined || currentY === undefined) return;

      const deltaX = currentX - previousMouse.x;
      const deltaY = currentY - previousMouse.y;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        isClick = false;
        if (targetZoom === 1.0) targetZoom = config.zoomLevel;
      }

      targetOffset.x -= deltaX * 0.003;
      targetOffset.y += deltaY * 0.003;
      previousMouse.x = currentX;
      previousMouse.y = currentY;
    };

    const onPointerUp = (event: PointerEvent | TouchEvent) => {
      isDragging = false;
      document.body.classList.remove('dragging');
      targetZoom = 1.0;

      if (isClick && Date.now() - clickStartTime < 200) {
        const endX =
          (event as PointerEvent).clientX || (event as TouchEvent).changedTouches?.[0]?.clientX;
        const endY =
          (event as PointerEvent).clientY || (event as TouchEvent).changedTouches?.[0]?.clientY;

        if (endX !== undefined && endY !== undefined) {
          const rect = renderer.domElement.getBoundingClientRect();
          const screenX = ((endX - rect.left) / rect.width) * 2 - 1;
          const screenY = -(((endY - rect.top) / rect.height) * 2 - 1);

          const radius = Math.sqrt(screenX * screenX + screenY * screenY);
          const distortion = 1.0 - 0.08 * radius * radius;

          let worldX = screenX * distortion * (rect.width / rect.height) * zoomLevel + offset.x;
          let worldY = screenY * distortion * zoomLevel + offset.y;

          const cellX = Math.floor(worldX / config.cellSize);
          const cellY = Math.floor(worldY / config.cellSize);
          const texIndex = Math.floor((cellX + cellY * 3.0) % projects.length);
          const actualIndex = texIndex < 0 ? projects.length + texIndex : texIndex;

          if (projects[actualIndex]?.href) {
            window.location.href = projects[actualIndex].href;
          }
        }
      }
    };

    const onWindowResize = () => {
      if (!containerRef.current) return;

      const { offsetWidth: width, offsetHeight: height } = containerRef.current;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      if (plane && (plane.material as THREE.ShaderMaterial).uniforms) {
        ((plane.material as THREE.ShaderMaterial).uniforms.uResolution.value as THREE.Vector2).set(width, height);
      }
    };

    const setupEventListeners = () => {
      document.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
      document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
      document.addEventListener('mouseup', onPointerUp);
      document.addEventListener('mouseleave', onPointerUp);

      const passiveOpts = { passive: false };
      document.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault();
          startDrag(e.touches[0].clientX, e.touches[0].clientY);
        },
        passiveOpts
      );
      document.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault();
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        },
        passiveOpts
      );
      document.addEventListener('touchend', onPointerUp, passiveOpts);

      window.addEventListener('resize', onWindowResize);
      document.addEventListener('contextmenu', (e) => e.preventDefault());

      renderer.domElement.addEventListener('mousemove', updateMousePosition);
      renderer.domElement.addEventListener('mouseleave', () => {
        mousePosition.x = mousePosition.y = -1;
        if (plane && (plane.material as THREE.ShaderMaterial).uniforms) {
          ((plane.material as THREE.ShaderMaterial).uniforms.uMousePos.value as THREE.Vector2).set(-1, -1);
        }
      });
    };

    const animate = () => {
      requestAnimationFrame(animate);

      offset.x += (targetOffset.x - offset.x) * config.lerpFactor;
      offset.y += (targetOffset.y - offset.y) * config.lerpFactor;
      zoomLevel += (targetZoom - zoomLevel) * config.lerpFactor;

      if (plane && (plane.material as THREE.ShaderMaterial).uniforms) {
        ((plane.material as THREE.ShaderMaterial).uniforms.uOffset.value as THREE.Vector2).set(offset.x, offset.y);
        ((plane.material as THREE.ShaderMaterial).uniforms.uZoom as any).value = zoomLevel;
      }

      renderer.render(scene, camera);
    };

    const init = async () => {
      if (!containerRef.current) return;

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      const bgColor = rgbaToArray(config.backgroundColor);
      renderer.setClearColor(
        new THREE.Color(bgColor[0], bgColor[1], bgColor[2]),
        bgColor[3]
      );
      containerRef.current.appendChild(renderer.domElement);

      const imageTextures = await loadTextures();
      const imageAtlas = createTextureAtlas(imageTextures, false);
      const textAtlas = createTextureAtlas(textTextures, true);

      const uniforms = {
        uOffset: { value: new THREE.Vector2(0, 0) },
        uResolution: {
          value: new THREE.Vector2(
            containerRef.current.offsetWidth,
            containerRef.current.offsetHeight
          ),
        },
        uBorderColor: {
          value: new THREE.Vector4(...(rgbaToArray(config.borderColor) as [number, number, number, number])),
        },
        uHoverColor: {
          value: new THREE.Vector4(...(rgbaToArray(config.hoverColor) as [number, number, number, number])),
        },
        uBackgroundColor: {
          value: new THREE.Vector4(...(rgbaToArray(config.backgroundColor) as [number, number, number, number])),
        },
        uMousePos: { value: new THREE.Vector2(-1, -1) },
        uZoom: { value: 1.0 },
        uCellSize: { value: config.cellSize },
        uTextureCount: { value: projects.length },
        uImageAtlas: { value: imageAtlas },
        uTextAtlas: { value: textAtlas },
      };

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
      });

      plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      setupEventListeners();
      animate();
      setIsReady(true);
    };

    init();

    return () => {
      if (containerRef.current && renderer?.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-black"
      style={{ cursor: 'grab' }}
    >
      <style>{`
        body.dragging {
          cursor: grabbing;
        }
        .vignette-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 70%,
            rgba(0, 0, 0, 0.75) 90%,
            rgba(0, 0, 0, 1) 100%
          );
        }
      `}</style>
      <div className="vignette-overlay" />
    </div>
  );
}
