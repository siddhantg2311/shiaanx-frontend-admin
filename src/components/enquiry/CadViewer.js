import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const CadViewer = ({ fileUrl, fileName, onProgress }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partList, setPartList] = useState([]);
  const [selectedPartIndex, setSelectedPartIndex] = useState(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const rootGroupRef = useRef(null);
  const occtRef = useRef(null);

  // Helper to load occt-import-js from public folder
  const loadOcctLibrary = () => {
    return new Promise((resolve, reject) => {
      if (window.occtimportjs) {
        resolve(window.occtimportjs);
        return;
      }
      const script = document.createElement('script');
      // Use process.env.PUBLIC_URL to handle the /admin homepage prefix
      const publicUrl = process.env.PUBLIC_URL || '';
      script.src = `${publicUrl}/lib/occt/occt-import-js.js`;
      script.onload = () => resolve(window.occtimportjs);
      script.onerror = () => reject(new Error('Failed to load OCCT library'));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const initScene = () => {
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f0e8);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
      camera.position.set(200, 200, 200);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      rendererRef.current = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(150, 200, 100);
      scene.add(directionalLight);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);
      rootGroupRef.current = rootGroup;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
      };
    };

    const cleanup = initScene();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!fileUrl) return;

    const loadCadFile = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!occtRef.current) {
          const initOcct = await loadOcctLibrary();
          const publicUrl = process.env.PUBLIC_URL || '';
          occtRef.current = await initOcct({
            locateFile: (path) => `${publicUrl}/lib/occt/${path}`
          });
        }

        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const fileBuffer = new Uint8Array(arrayBuffer);

        const extension = fileName.split('.').pop().toLowerCase();
        let result;

        if (extension === 'step' || extension === 'stp') {
          result = occtRef.current.ReadStepFile(fileBuffer);
        } else if (extension === 'iges' || extension === 'igs') {
          result = occtRef.current.ReadIgesFile(fileBuffer);
        } else {
          throw new Error('Unsupported file format');
        }

        if (!result || !result.success) {
          throw new Error(result?.error || 'Failed to parse CAD file');
        }

        buildScene(result);
        setLoading(false);
      } catch (err) {
        console.error('Error loading CAD:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadCadFile();
  }, [fileUrl, fileName]);

  const buildScene = (data) => {
    const rootGroup = rootGroupRef.current;
    while (rootGroup.children.length > 0) {
      rootGroup.remove(rootGroup.children[0]);
    }

    const meshes = data.meshes || [];
    const color = new THREE.Color(0x9c8a73);
    
    meshes.forEach((meshData, index) => {
      const geometry = new THREE.BufferGeometry();
      
      if (meshData.attributes.position) {
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(meshData.attributes.position.array, 3));
      }
      if (meshData.attributes.normal) {
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(meshData.attributes.normal.array, 3));
      }
      if (meshData.index) {
        geometry.setIndex(new THREE.Uint32BufferAttribute(meshData.index.array, 1));
      }

      geometry.computeVertexNormals();
      geometry.computeBoundingBox();

      const material = new THREE.MeshStandardMaterial({
        color: color.clone(),
        metalness: 0.2,
        roughness: 0.5,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { index };
      rootGroup.add(mesh);

      // Add edges
      const edges = new THREE.EdgesGeometry(geometry, 25);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x5f6a74, transparent: true, opacity: 0.4 }));
      rootGroup.add(line);
    });

    const box = new THREE.Box3().setFromObject(rootGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 2.5; // Zoom out a bit

    cameraRef.current.position.set(center.x + cameraZ, center.y + cameraZ, center.z + cameraZ);
    cameraRef.current.lookAt(center);
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245, 240, 232, 0.8)' }}>
          <div className="aq-spinner"></div>
          <p style={{ marginLeft: '12px' }}>Loading 3D Model...</p>
        </div>
      )}
      {error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245, 240, 232, 0.8)', color: '#b44c36', padding: '20px', textAlign: 'center' }}>
          <p>Error loading model: {error}</p>
        </div>
      )}
    </div>
  );
};

export default CadViewer;
