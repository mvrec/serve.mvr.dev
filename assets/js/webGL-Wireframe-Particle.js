// Setup WebGL Background for Hero Section (Wireframe Terrain & Particles)
        document.addEventListener('DOMContentLoaded', () => {
            const heroContainer = document.getElementById('hero-canvas-container');
            if (heroContainer) {
                const scene = new THREE.Scene();
                scene.fog = new THREE.FogExp2(0x050505, 0.002);

                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.z = 50;
                camera.position.y = 10;

                const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                renderer.setSize(window.innerWidth, heroContainer.clientHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                heroContainer.appendChild(renderer.domElement);

                // Terrain
                const terrainGeometry = new THREE.PlaneGeometry(400, 400, 60, 60);
                const positions = terrainGeometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i + 2] = Math.sin(positions[i] / 20) * Math.cos(positions[i + 1] / 20) * 15;
                }
                terrainGeometry.computeVertexNormals();

                const terrainMaterial = new THREE.MeshBasicMaterial({
                    color: 0xc9f500,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.2
                });

                const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
                terrain.rotation.x = -Math.PI / 2;
                terrain.position.y = -40;
                scene.add(terrain);

                // Particles (Circle dots)
                const createCircleTexture = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 64;
                    canvas.height = 64;
                    const context = canvas.getContext('2d');
                    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
                    gradient.addColorStop(0, 'rgba(255,255,255,1)');
                    gradient.addColorStop(1, 'rgba(255,255,255,0)');
                    context.fillStyle = gradient;
                    context.beginPath();
                    context.arc(32, 32, 30, 0, Math.PI * 2);
                    context.fill();
                    const texture = new THREE.CanvasTexture(canvas);
                    return texture;
                };

                const particlesGeometry = new THREE.BufferGeometry();
                const particlesCount = 700;
                const posArray = new Float32Array(particlesCount * 3);

                for (let i = 0; i < particlesCount * 3; i++) {
                    posArray[i] = (Math.random() - 0.5) * 150;
                }

                particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
                const particlesMaterial = new THREE.PointsMaterial({
                    size: 0.5,
                    map: createCircleTexture(),
                    transparent: true,
                    opacity: 1,
                    color: 0xc9f500,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });

                const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
                scene.add(particlesMesh);

                let mouseX = 0;
                let mouseY = 0;
                let windowHalfX = window.innerWidth / 2;
                let windowHalfY = window.innerHeight / 2;

                document.addEventListener('mousemove', (event) => {
                    mouseX = (event.clientX - windowHalfX);
                    mouseY = (event.clientY - windowHalfY);
                });

                const clock = new THREE.Clock();
                const animate = () => {
                    requestAnimationFrame(animate);
                    const elapsedTime = clock.getElapsedTime();

                    terrain.rotation.z = elapsedTime * 0.1;
                    terrain.position.y = -40 + Math.sin(elapsedTime * 0.5) * 3;

                    particlesMesh.rotation.y = elapsedTime * 0.05;
                    particlesMesh.rotation.x = elapsedTime * 0.02;

                    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
                    camera.position.y += (-mouseY * 0.05 + 10 - camera.position.y) * 0.05;
                    camera.lookAt(scene.position);

                    renderer.render(scene, camera);
                }
                animate();

                window.addEventListener('resize', () => {
                    windowHalfX = window.innerWidth / 2;
                    windowHalfY = window.innerHeight / 2;
                    camera.aspect = window.innerWidth / heroContainer.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, heroContainer.clientHeight);
                });
            }
        });