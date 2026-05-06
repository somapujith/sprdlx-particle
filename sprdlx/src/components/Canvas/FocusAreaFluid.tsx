import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FocusAreaFluidProps {
  currentImageUrl: string;
  nextImageUrl?: string;
  blendProgress?: number;
  className?: string;
  height?: number;
}

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fluidFragmentShader = `
  uniform sampler2D uPrevTrails;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform vec2 uResolution;
  uniform float uDecay;
  uniform bool uIsMoving;

  varying vec2 vUv;

  void main() {
    vec4 prevState = texture2D(uPrevTrails, vUv);

    float newValue = prevState.r * uDecay;

    if (uIsMoving) {
      vec2 mouseDirection = uMouse - uPrevMouse;
      float lineLength = length(mouseDirection);

      if (lineLength > 0.001) {
        vec2 mouseDir = mouseDirection / lineLength;

        vec2 toPixel = vUv - uPrevMouse;
        float projAlong = dot(toPixel, mouseDir);
        projAlong = clamp(projAlong, 0.0, lineLength);

        vec2 closestPoint = uPrevMouse + projAlong * mouseDir;
        float dist = length(vUv - closestPoint);

        float lineWidth = 0.09;
        float intensity = smoothstep(lineWidth, 0.0, dist) * 0.3;

        newValue += intensity;
      }
    }

    gl_FragColor = vec4(newValue, 0.0, 0.0, 1.0);
  }
`;

const displayFragmentShader = `
  uniform sampler2D uFluid;
  uniform sampler2D uTopTexture;
  uniform sampler2D uBottomTexture;
  uniform vec2 uResolution;
  uniform float uDpr;
  uniform vec2 uTopTextureSize;
  uniform vec2 uBottomTextureSize;

  varying vec2 vUv;

  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;

    vec2 s = uResolution / textureSize;

    float scale = max(s.x, s.y);

    vec2 scaledSize = textureSize * scale;

    vec2 offset = (uResolution - scaledSize) * 0.5;

    return (uv * uResolution - offset) / scaledSize;
  }

  void main() {
    float fluid = texture2D(uFluid, vUv).r;

    vec2 topUV = getCoverUV(vUv, uTopTextureSize);
    vec2 bottomUV = getCoverUV(vUv, uBottomTextureSize);

    vec4 topColor = texture2D(uTopTexture, topUV);
    vec4 bottomColor = texture2D(uBottomTexture, bottomUV);

    float threshold = 0.02;
    float edgeWidth = 0.004 / uDpr;

    float t = smoothstep(threshold, threshold + edgeWidth, fluid);

    vec4 finalColor = mix(topColor, bottomColor, t);

    gl_FragColor = finalColor;
  }
`;

function FocusAreaFluid({
  currentImageUrl,
  nextImageUrl,
  blendProgress = 0,
  className,
  height = 384,
}: FocusAreaFluidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const prevMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const isMovingRef = useRef(false);
  const lastMoveTimeRef = useRef(0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const displayMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const topTextureSizeRef = useRef(new THREE.Vector2(1, 1));
  const bottomTextureSizeRef = useRef(new THREE.Vector2(1, 1));

  const loadImageIntoSlot = (
    url: string,
    target: 'top' | 'bottom',
    displayMaterial: THREE.ShaderMaterial,
  ) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;
      const sizeVec = target === 'top' ? topTextureSizeRef.current : bottomTextureSizeRef.current;
      sizeVec.set(originalWidth, originalHeight);

      const maxSize = 4096;
      let newWidth = originalWidth;
      let newHeight = originalHeight;
      if (originalWidth > maxSize || originalHeight > maxSize) {
        if (originalWidth > originalHeight) {
          newWidth = maxSize;
          newHeight = Math.floor(originalHeight * (maxSize / originalWidth));
        } else {
          newHeight = maxSize;
          newWidth = Math.floor(originalWidth * (maxSize / originalHeight));
        }
      }

      const imgCanvas = document.createElement('canvas');
      imgCanvas.width = newWidth;
      imgCanvas.height = newHeight;
      const imgCtx = imgCanvas.getContext('2d');
      if (imgCtx) imgCtx.drawImage(img, 0, 0, newWidth, newHeight);

      const newTexture = new THREE.CanvasTexture(imgCanvas);
      newTexture.minFilter = THREE.LinearFilter;
      newTexture.magFilter = THREE.LinearFilter;
      newTexture.needsUpdate = true;

      const uniformName = target === 'top' ? 'uTopTexture' : 'uBottomTexture';
      const previous = displayMaterial.uniforms[uniformName].value as THREE.Texture | null;
      displayMaterial.uniforms[uniformName].value = newTexture;
      if (previous && previous !== newTexture) previous.dispose();
    };
    img.src = url;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement('canvas');
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      precision: 'highp',
      alpha: true,
    });
    rendererRef.current = renderer;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const size = 500;
    const pingPongTargets = [
      new THREE.WebGLRenderTarget(size, size, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }),
      new THREE.WebGLRenderTarget(size, size, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }),
    ];
    let currentTarget = 0;

    const topTexture = createPlaceholderTexture('#ffffff');
    const bottomTexture = createPlaceholderTexture('#ffffff');

    const trailsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPrevTrails: { value: null },
        uMouse: { value: mouseRef.current },
        uPrevMouse: { value: prevMouseRef.current },
        uResolution: { value: new THREE.Vector2(size, size) },
        uDecay: { value: 0.97 },
        uIsMoving: { value: false },
      },
      vertexShader,
      fragmentShader: fluidFragmentShader,
    });

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uFluid: { value: null },
        uTopTexture: { value: topTexture },
        uBottomTexture: { value: bottomTexture },
        uResolution: {
          value: new THREE.Vector2(width, height),
        },
        uDpr: { value: window.devicePixelRatio },
        uTopTextureSize: { value: topTextureSizeRef.current },
        uBottomTextureSize: { value: bottomTextureSizeRef.current },
      },
      vertexShader,
      fragmentShader: displayFragmentShader,
    });
    displayMaterialRef.current = displayMaterial;

    loadImageIntoSlot(currentImageUrl, 'top', displayMaterial);
    loadImageIntoSlot(nextImageUrl || currentImageUrl, 'bottom', displayMaterial);

    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const displayMesh = new THREE.Mesh(planeGeometry, displayMaterial);
    scene.add(displayMesh);

    const simMesh = new THREE.Mesh(planeGeometry, trailsMaterial);
    const simScene = new THREE.Scene();
    simScene.add(simMesh);

    renderer.setRenderTarget(pingPongTargets[0]);
    renderer.clear();
    renderer.setRenderTarget(pingPongTargets[1]);
    renderer.clear();
    renderer.setRenderTarget(null);

    function createPlaceholderTexture(color: string) {
      const placeholderCanvas = document.createElement('canvas');
      placeholderCanvas.width = 512;
      placeholderCanvas.height = 512;
      const ctx = placeholderCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 512, 512);
      }

      const texture = new THREE.CanvasTexture(placeholderCanvas);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    }

    function onMouseMove(event: MouseEvent) {
      if (!canvasRef.current) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();

      if (
        event.clientX >= canvasRect.left &&
        event.clientX <= canvasRect.right &&
        event.clientY >= canvasRect.top &&
        event.clientY <= canvasRect.bottom
      ) {
        prevMouseRef.current.copy(mouseRef.current);

        mouseRef.current.x = (event.clientX - canvasRect.left) / canvasRect.width;
        mouseRef.current.y =
          1 - (event.clientY - canvasRect.top) / canvasRect.height;

        isMovingRef.current = true;
        lastMoveTimeRef.current = performance.now();
      } else {
        isMovingRef.current = false;
      }
    }

    function onWindowResize() {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      renderer.setSize(newWidth, newHeight);
      displayMaterial.uniforms.uResolution.value.set(newWidth, newHeight);
      displayMaterial.uniforms.uDpr.value = window.devicePixelRatio;
    }

    function animate() {
      requestAnimationFrame(animate);

      if (isMovingRef.current && performance.now() - lastMoveTimeRef.current > 50) {
        isMovingRef.current = false;
      }

      const prevTarget = pingPongTargets[currentTarget];
      currentTarget = (currentTarget + 1) % 2;
      const currentRenderTarget = pingPongTargets[currentTarget];

      trailsMaterial.uniforms.uPrevTrails.value = prevTarget.texture;
      trailsMaterial.uniforms.uMouse.value.copy(mouseRef.current);
      trailsMaterial.uniforms.uPrevMouse.value.copy(prevMouseRef.current);
      trailsMaterial.uniforms.uIsMoving.value = isMovingRef.current;

      renderer.setRenderTarget(currentRenderTarget);
      renderer.render(simScene, camera);

      displayMaterial.uniforms.uFluid.value = currentRenderTarget.texture;

      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    }

    canvas.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    animate();

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      (displayMaterial.uniforms.uTopTexture.value as THREE.Texture | null)?.dispose?.();
      (displayMaterial.uniforms.uBottomTexture.value as THREE.Texture | null)?.dispose?.();
      trailsMaterial.dispose();
      displayMaterial.dispose();
      planeGeometry.dispose();
      pingPongTargets[0].dispose();
      pingPongTargets[1].dispose();
      renderer.dispose();
      containerRef.current?.removeChild(canvas);
      displayMaterialRef.current = null;
    };
  }, []);

  useEffect(() => {
    const displayMaterial = displayMaterialRef.current;
    if (!displayMaterial) return;
    loadImageIntoSlot(currentImageUrl, 'top', displayMaterial);
    loadImageIntoSlot(nextImageUrl || currentImageUrl, 'bottom', displayMaterial);
  }, [currentImageUrl, nextImageUrl]);

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-lg overflow-hidden ${className ?? ''}`}
      style={{ position: 'relative', height }}
    />
  );
}

export default FocusAreaFluid;
