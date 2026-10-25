import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Radar, Gauge, Eye, Maximize2, RotateCcw } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function SwarmClusterCanvas({ activeAgentId, onSelectAgent }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [cameraMode, setCameraMode] = useState('orbit'); // 'orbit', 'top', 'core'
  const speedRef = useRef(1);
  const cameraModeRef = useRef('orbit');

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2.5, 60);
    pointLight.position.set(0, 8, 12);
    scene.add(pointLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 2.5, 60);
    purpleLight.position.set(0, -8, -12);
    scene.add(purpleLight);

    const swarmGroup = new THREE.Group();
    scene.add(swarmGroup);

    // Central Shared Context Blackboard Core
    const coreGeo = new THREE.IcosahedronGeometry(2.3, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    swarmGroup.add(coreMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.SphereGeometry(1.4, 24, 24);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.15,
      metalness: 0.9,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.7,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    swarmGroup.add(innerMesh);

    // 6 Clustered Specialist Agent Nodes
    const agentDefs = [
      { id: 'arch', name: 'Architect', color: 0xc084fc, radius: 7.6, speed: 0.7, angle: 0, yOffset: 2 },
      { id: 'back', name: 'Backend',   color: 0x34d399, radius: 7.0, speed: 0.9, angle: 1.05, yOffset: -1.5 },
      { id: 'front', name: 'Frontend',  color: 0x38bdf8, radius: 8.2, speed: 0.8, angle: 2.1, yOffset: 1 },
      { id: 'test', name: 'Testing',   color: 0xfbbf24, radius: 7.3, speed: 1.1, angle: 3.14, yOffset: -2 },
      { id: 'sec',  name: 'Security',  color: 0xf87171, radius: 7.9, speed: 0.65, angle: 4.2, yOffset: 2.5 },
      { id: 'doc',  name: 'Release',   color: 0xe2e8f0, radius: 6.8, speed: 0.85, angle: 5.2, yOffset: -0.5 },
    ];

    const agentMeshes = [];
    const linkLines = [];
    const interactiveSpheres = [];

    agentDefs.forEach((agent) => {
      const nodeGeo = new THREE.SphereGeometry(0.9, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: agent.color,
        emissive: agent.color,
        emissiveIntensity: 0.85,
        roughness: 0.25,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.userData = { id: agent.id, name: agent.name };

      const haloGeo = new THREE.RingGeometry(1.1, 1.4, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: agent.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      nodeMesh.add(halo);

      swarmGroup.add(nodeMesh);
      agentMeshes.push({ mesh: nodeMesh, def: agent, halo: halo });
      interactiveSpheres.push(nodeMesh);

      // Connecting data-link beam
      const lineMat = new THREE.LineBasicMaterial({
        color: agent.color,
        transparent: true,
        opacity: 0.45,
      });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      swarmGroup.add(line);
      linkLines.push({ line: line, agentMesh: nodeMesh });
    });

    // Particle Cloud
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 40;
      particlePos[i + 1] = (Math.random() - 0.5) * 40;
      particlePos[i + 2] = (Math.random() - 0.5) * 40;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.14,
      transparent: true,
      opacity: 0.6,
    });
    const starField = new THREE.Points(particleGeo, particleMat);
    scene.add(starField);

    // Mouse Interaction & Raycasting
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseVector.x = x;
      mouseVector.y = y;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        targetRotationY = (x * 0.5);
        targetRotationX = (-y * 0.5);
      }
    };

    // Click on 3D agent to focus
    const onClick = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseVector.set(x, y);

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(interactiveSpheres);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const agentId = clickedMesh.userData.id;
        sound.playLock();
        if (onSelectAgent) {
          onSelectAgent(agentId);
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClick);

    // Animation Loop
    let animId;
    let accumulatedTime = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const currentSpeed = speedRef.current;
      accumulatedTime += delta * currentSpeed;

      // Handle Camera Modes
      const mode = cameraModeRef.current;
      if (mode === 'top') {
        camera.position.x += (0 - camera.position.x) * 0.05;
        camera.position.y += (22 - camera.position.y) * 0.05;
        camera.position.z += (3 - camera.position.z) * 0.05;
        camera.lookAt(0, 0, 0);
      } else if (mode === 'core') {
        camera.position.x += (0 - camera.position.x) * 0.05;
        camera.position.y += (0 - camera.position.y) * 0.05;
        camera.position.z += (8 - camera.position.z) * 0.05;
        camera.lookAt(0, 0, 0);
      } else {
        camera.position.x += (0 - camera.position.x) * 0.05;
        camera.position.y += (0 - camera.position.y) * 0.05;
        camera.position.z += (24 - camera.position.z) * 0.05;
        camera.lookAt(0, 0, 0);
      }

      // Rotate central core
      coreMesh.rotation.x = accumulatedTime * 0.25;
      coreMesh.rotation.y = accumulatedTime * 0.35;
      innerMesh.rotation.y = -accumulatedTime * 0.2;

      // Pulse core scale slightly
      const pulse = 1 + Math.sin(accumulatedTime * 2) * 0.03;
      innerMesh.scale.set(pulse, pulse, pulse);

      agentMeshes.forEach((item, idx) => {
        const def = item.def;
        const angle = def.angle + accumulatedTime * def.speed * 0.3;
        const x = Math.cos(angle) * def.radius;
        const z = Math.sin(angle) * def.radius;
        const y = def.yOffset + Math.sin(accumulatedTime * 1.8 + idx) * 0.8;

        item.mesh.position.set(x, y, z);
        item.halo.rotation.z = accumulatedTime * 2.5;
        item.halo.lookAt(camera.position);

        // Highlight selected agent
        if (activeAgentId === def.id) {
          item.mesh.scale.set(1.4, 1.4, 1.4);
          item.halo.material.opacity = 1.0;
        } else {
          item.mesh.scale.set(1.0, 1.0, 1.0);
          item.halo.material.opacity = 0.6;
        }

        const positions = linkLines[idx].line.geometry.attributes.position.array;
        positions[3] = x;
        positions[4] = y;
        positions[5] = z;
        linkLines[idx].line.geometry.attributes.position.needsUpdate = true;
      });

      starField.rotation.y = accumulatedTime * 0.03;

      // Inertial rotation damping
      if (mode === 'orbit') {
        swarmGroup.rotation.y += (targetRotationY - swarmGroup.rotation.y) * 0.06;
        swarmGroup.rotation.x += (targetRotationX - swarmGroup.rotation.x) * 0.06;
      } else {
        swarmGroup.rotation.y += (0 - swarmGroup.rotation.y) * 0.06;
        swarmGroup.rotation.x += (0 - swarmGroup.rotation.x) * 0.06;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, [activeAgentId, onSelectAgent]);

  const handleSpeedChange = (mult) => {
    sound.playBeep(500 + mult * 200, 0.04);
    setSpeedMultiplier(mult);
  };

  const handleModeChange = (mode) => {
    sound.playBeep(700, 0.04);
    setCameraMode(mode);
  };

  return (
    <div className="hero-3d-wrapper hover-target" ref={containerRef} id="canvas3dContainer">
      <div className="canvas-hud-header">
        <div className="hud-tag">
          <Radar size={14} /> 3D CLUSTER TOPOLOGY
        </div>
        
        {/* Interactive 3D Controls */}
        <div className="canvas-controls">
          <div className="btn-group-pill">
            <button
              className={`pill-btn ${speedMultiplier === 0.5 ? 'active' : ''}`}
              onClick={() => handleSpeedChange(0.5)}
              title="0.5x Slow Motion"
            >
              0.5x
            </button>
            <button
              className={`pill-btn ${speedMultiplier === 1 ? 'active' : ''}`}
              onClick={() => handleSpeedChange(1)}
              title="1x Realtime"
            >
              1x
            </button>
            <button
              className={`pill-btn ${speedMultiplier === 2.5 ? 'active' : ''}`}
              onClick={() => handleSpeedChange(2.5)}
              title="2.5x Warp"
            >
              2.5x
            </button>
          </div>

          <div className="btn-group-pill">
            <button
              className={`pill-btn ${cameraMode === 'orbit' ? 'active' : ''}`}
              onClick={() => handleModeChange('orbit')}
              title="Orbit View"
            >
              Orbit
            </button>
            <button
              className={`pill-btn ${cameraMode === 'top' ? 'active' : ''}`}
              onClick={() => handleModeChange('top')}
              title="Top-Down Radar"
            >
              Radar
            </button>
            <button
              className={`pill-btn ${cameraMode === 'core' ? 'active' : ''}`}
              onClick={() => handleModeChange('core')}
              title="Close-Up Core"
            >
              Core
            </button>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="canvas-element" />

      <div className="canvas-hud-footer">
        <div className="legend-nodes">
          <span
            className={`legend-chip c-arch ${activeAgentId === 'arch' ? 'chip-active' : ''}`}
            onClick={() => { sound.playLock(); onSelectAgent && onSelectAgent('arch'); }}
          >
            ● Architect
          </span>
          <span
            className={`legend-chip c-back ${activeAgentId === 'back' ? 'chip-active' : ''}`}
            onClick={() => { sound.playLock(); onSelectAgent && onSelectAgent('back'); }}
          >
            ● Backend
          </span>
          <span
            className={`legend-chip c-front ${activeAgentId === 'front' ? 'chip-active' : ''}`}
            onClick={() => { sound.playLock(); onSelectAgent && onSelectAgent('front'); }}
          >
            ● Frontend
          </span>
          <span
            className={`legend-chip c-test ${activeAgentId === 'test' ? 'chip-active' : ''}`}
            onClick={() => { sound.playLock(); onSelectAgent && onSelectAgent('test'); }}
          >
            ● QA & Test
          </span>
          <span
            className={`legend-chip c-sec ${activeAgentId === 'sec' ? 'chip-active' : ''}`}
            onClick={() => { sound.playLock(); onSelectAgent && onSelectAgent('sec'); }}
          >
            ● Security
          </span>
          <span
            className={`legend-chip c-doc ${activeAgentId === 'doc' ? 'chip-active' : ''}`}
            onClick={() => { sound.playLock(); onSelectAgent && onSelectAgent('doc'); }}
          >
            ● Release
          </span>
        </div>
        <div className="canvas-hint">Click any agent node in 3D to inspect &bull; Drag to rotate</div>
      </div>
    </div>
  );
}
