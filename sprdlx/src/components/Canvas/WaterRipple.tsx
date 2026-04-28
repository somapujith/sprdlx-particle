import { useEffect, useRef } from 'react';

const simulationVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const simulationFragmentShader = `
uniform sampler2D textureA;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
uniform int frame;
varying vec2 vUv;

const float delta = 1.4;

void main() {
    vec2 uv = vUv;
    if (frame == 0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    vec4 data = texture2D(textureA, uv);
    float pressure = data.x;
    float pVel = data.y;

    vec2 texelSize = 1.0 / resolution;
    float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
    float p_left = texture2D(textureA, uv + vec2(-texelSize.x, 0.0)).x;
    float p_up = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
    float p_down = texture2D(textureA, uv + vec2(0.0, -texelSize.y)).x;

    if (uv.x <= texelSize.x) p_left = p_right;
    if (uv.x >= 1.0 - texelSize.x) p_right = p_left;
    if (uv.y <= texelSize.y) p_down = p_up;
    if (uv.y >= 1.0 - texelSize.y) p_up = p_down;

    pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
    pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;

    pressure += delta * pVel;

    pVel -= 0.005 * delta * pressure;

    pVel *= 1.0 - 0.002 * delta;
    pressure *= 0.999;

    vec2 mouseUV = mouse / resolution;
    if(mouse.x > 0.0) {
        float dist = distance(uv, mouseUV);
        if(dist <= 0.02) {
            pressure += 0.5 * (1.0 - dist / 0.02);
        }
    }

    gl_FragColor = vec4(pressure, pVel,
        (p_right - p_left) / 2.0,
        (p_up - p_down) / 2.0);
}
`;

const renderVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const renderFragmentShader = `
uniform sampler2D textureA;
uniform sampler2D textureB;
varying vec2 vUv;

void main() {
    vec4 data = texture2D(textureA, vUv);

    vec2 distortion = 0.3 * data.zw;
    vec4 color = texture2D(textureB, vUv + distortion);

    vec3 normal = normalize(vec3(-data.z * 2.0, 0.5, -data.w * 2.0));
    vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
    float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 1.5;

    gl_FragColor = color + vec4(specular);
}
`;

const SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 873 774" width="873" height="774">
  <path fill="white" d="M578 587.2c-19.3-19-42.1-41-64.2-63.7-4-4-7-11-7-16.8-.7-32-.4-64-.4-97.3 5-.2 9.1-.5 13.2-.5 27.9-.1 55.8.3 83.6-.3 8.6-.1 14.1 3 20.1 8.7 22 21.2 44.6 41.6 68 63.3l33.5-32.4c13.4-12.9 24.7-30.8 40.6-37.2 16.4-6.6 37.3-2 56.2-2.1 16.2-.2 32.4 0 50 0v55c-.2 17.4 4 36.6-2.2 51.5-6 14.6-22.3 25-34.5 37-12.6 12.4-25.6 24.4-37.8 36.1 22.2 22.9 42.3 44.2 63.3 64.7 8 7.9 11.8 15.7 11.5 27.2-.8 30.5-.3 61-.3 92.5-3.3.4-6.2 1-9.1 1-29.7 0-59.4.3-89.1-.3a25.7 25.7 0 0 1-15.7-7c-19.7-19.2-39-38.7-57.8-58.8-7.8-8.4-12.6-9.4-20.8-.2a1453.3 1453.3 0 0 1-57 59.6 23.5 23.5 0 0 1-14.7 6.4c-30 .5-60.1-.1-90.2.4-9 .1-11-3-11-11.4.5-29.8 0-59.6.5-89.3.1-5 3-11 6.5-14.9 20.7-23.4 42-46.4 64.7-71.2Zm-1.4-204.4V.8c4.5-.3 8.2-.7 12-.7 72 0 144-.2 215.9.3 6.1 0 13.5 3.1 18 7.3A844.6 844.6 0 0 1 866 51.2a21 21 0 0 1 5.4 13c.4 37.4.4 75 0 112.5 0 4.7-2.8 10.3-6 14-12.4 14.8-25.5 29-39.2 44.5 13 14.8 26.2 28.8 38.2 43.8 3.9 4.8 6.8 12 7 18.2.6 28.2.2 56.4.2 86.6-13.4 0-26.6-1.8-39.3.3-32.1 5.3-54.9-6.9-73.7-32.4-11.8-15.9-26.8-29.4-42.6-46.5v77.6H576.7Zm140-273.1v55.1h12.8c0-16-.3-31.4.2-46.7.3-10-4.4-11-13-8.4ZM272.4 1v134.1h-92.2c3.5 4.4 5.2 7 7.4 9.3 26.2 26.3 52.7 52.3 78.5 79a25.8 25.8 0 0 1 6.5 15.9c.7 25.5.5 51 .1 76.5 0 4.2-1.5 9.3-4.1 12.4a1554.2 1554.2 0 0 1-45.4 49.7 18 18 0 0 1-11.6 5.6c-68.5.4-137 .3-205.5.2-1.5 0-3-.4-5-.8V247.3h81.7c-4.2-4.8-6.4-7.7-9-10.2-21.8-22-43.4-44-65.6-65.6a24.2 24.2 0 0 1-7.8-19.4C.7 122.7.3 93.3.8 64c0-4.7 2.5-10.5 5.8-14 14.3-15.1 29-29.8 44.2-44.3 3-2.9 7.9-5.3 12-5.3 67.6-.4 135.3-.4 203-.4 1.9 0 3.7.5 6.5 1ZM.9 408.8H68c43.3 0 86.7-.2 130 .3a26 26 0 0 1 16 6.6c15.4 14.5 35.8 27.5 43.4 45.7 7.7 18.1 2.4 41.8 2.5 63 .1 61.9.2 123.8-.3 185.6 0 6.1-3.2 13.4-7.4 18a582.3 582.3 0 0 1-39.6 39 26 26 0 0 1-16 6.6c-31 0-61.8-1.3-92.7-1.3s-62.6.8-94 1.7c-7.4.2-10-2.2-10-9.9.2-116 .1-232 .2-348 0-2 .3-3.8.7-7.3Zm123.6 260.4c7.5 2.5 11.3 1.3 11.2-7.4-.2-47.2-.2-94.4 0-141.6.1-9.3-3.8-10.2-11.2-7.6v156.6Zm164.9-286.3V.9c3.7-.2 7.4-.8 11-.8C366 0 431.3-.1 496.7.3a27 27 0 0 1 17 7 770.1 770.1 0 0 1 41.6 42c3.3 3.5 5.8 9.3 5.8 14 .4 49.5.4 99 0 148.5a21 21 0 0 1-5.4 13 986.8 986.8 0 0 1-43.4 43.4 23.1 23.1 0 0 1-14.2 5.6c-23.5.5-47.1.2-72 .2v109H289.5ZM425.6 164l3.8 2.8c2.2-2.4 6.1-4.8 6.2-7.2.6-15 .5-30 0-45.1 0-2-3.2-4-5-6-1.6 2-4.7 4-4.8 6-.4 16.5-.2 33-.2 49.5Zm66.5 608.9H275.8V409.7H404v243.4h88v119.8Z"/>
</svg>`;

function WaterRipple() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    (async () => {
      const { Scene, OrthographicCamera, WebGLRenderer, RGBAFormat, FloatType, LinearFilter, WebGLRenderTarget, ShaderMaterial, Vector2, PlaneGeometry, Mesh, CanvasTexture } = await import('three');

      const scene = new Scene();
      const simScene = new Scene();

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const mouse = new Vector2();
    let frame = 0;

    const width = window.innerWidth * window.devicePixelRatio;
    const height = window.innerHeight * window.devicePixelRatio;
    const options = {
      format: RGBAFormat,
      type: FloatType,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };
    let rtA = new WebGLRenderTarget(width, height, options);
    let rtB = new WebGLRenderTarget(width, height, options);

    const simMaterial = new ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: new Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });

    const renderMaterial = new ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        textureB: { value: null },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    });

    const plane = new PlaneGeometry(2, 2);
    const simQuad = new Mesh(plane, simMaterial);
    const renderQuad = new Mesh(plane, renderMaterial);

    simScene.add(simQuad);
    scene.add(renderQuad);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: true })!;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const img = new Image();
    img.onload = () => {
      const scale = Math.min(width / 873, height / 774) * 0.5;
      const svgWidth = 873 * scale;
      const svgHeight = 774 * scale;
      const x = (width - svgWidth) / 2;
      const y = (height - svgHeight) / 2;
      ctx.drawImage(img, x, y, svgWidth, svgHeight);
      textTexture.needsUpdate = true;
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(SVG_STRING);

    const textTexture = new CanvasTexture(canvas);
    textTexture.minFilter = LinearFilter;
    textTexture.magFilter = LinearFilter;
    textTexture.format = RGBAFormat;

    const handleResize = () => {
      const newWidth = window.innerWidth * window.devicePixelRatio;
      const newHeight = window.innerHeight * window.devicePixelRatio;

      renderer.setSize(window.innerWidth, window.innerHeight);
      rtA.setSize(newWidth, newHeight);
      rtB.setSize(newWidth, newHeight);
      simMaterial.uniforms.resolution.value.set(newWidth, newHeight);

      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, newWidth, newHeight);

      const img = new Image();
      img.onload = () => {
        const scale = Math.min(newWidth / 873, newHeight / 774) * 0.5;
        const svgWidth = 873 * scale;
        const svgHeight = 774 * scale;
        const x = (newWidth - svgWidth) / 2;
        const y = (newHeight - svgHeight) / 2;
        ctx.drawImage(img, x, y, svgWidth, svgHeight);
        textTexture.needsUpdate = true;
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(SVG_STRING);
    };

    window.addEventListener('resize', handleResize);

    renderer.domElement.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX * window.devicePixelRatio;
      mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio;
    }, { passive: true });

    renderer.domElement.addEventListener('mouseleave', () => {
      mouse.set(0, 0);
    }, { passive: true });

    const animate = () => {
      simMaterial.uniforms.frame.value = frame++;
      simMaterial.uniforms.time.value = performance.now() / 1000;

      simMaterial.uniforms.textureA.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, camera);

      renderMaterial.uniforms.textureA.value = rtB.texture;
      renderMaterial.uniforms.textureB.value = textTexture;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      const temp = rtA;
      rtA = rtB;
      rtB = temp;

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      rtA.dispose();
      rtB.dispose();
      simMaterial.dispose();
      renderMaterial.dispose();
      renderer.dispose();
    };
    })();
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}

export default WaterRipple;
