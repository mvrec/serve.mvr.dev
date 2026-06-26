// Setup WebGL Background for Hero Section (Wireframe Terrain Only)
        document.addEventListener('DOMContentLoaded', () => {
            const heroPContainer = document.getElementById('hero-canvas-particles');
            if (heroPContainer) {
                const scene = new THREE.Scene();
                scene.fog = new THREE.FogExp2(0x050505, 0.002);

                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.z = 50;
                camera.position.y = 10;

                const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                renderer.setSize(window.innerWidth, heroPContainer.clientHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                heroPContainer.appendChild(renderer.domElement);

                // Add Lights for the 3D Object
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(10, 20, 30);
                scene.add(directionalLight);

                // Load 3D Logo (OBJ ONLY)
                let logoMesh;
                const objLoader = new THREE.OBJLoader();
                objLoader.load('https://cdn.jsdelivr.net/gh/mvrec/serve.mvr.dev@master/assets/models/mvr-mark.obj', function (object) {
                    logoMesh = object;

                    // Center and position the logo based on screen size
                    const isMobile = window.innerWidth < 768;
                    const initialScale = isMobile ? 15 : 30;
                    logoMesh.scale.set(initialScale, initialScale, initialScale);
                    logoMesh.position.set(0, 5, 0);
                    // Override the model's color
                    logoMesh.traverse(function (child) {
                        if (child.isMesh) {
                            child.material = new THREE.MeshStandardMaterial({
                                color: 0xc9f500,  // The brand neon green
                                metalness: 0.5,
                                roughness: 0.2
                            });
                        }
                    });

                    scene.add(logoMesh);
                });

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


                    particlesMesh.rotation.y = elapsedTime * 0.05;
                    particlesMesh.rotation.x = elapsedTime * 0.02;

                    // Animate the logo if it has loaded
                    if (logoMesh) {
                        logoMesh.rotation.y = elapsedTime * 0.5; // Spinning
                        logoMesh.position.y = 5 + Math.sin(elapsedTime * 2) * 2; // Floating up and down
                    }

                    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
                    camera.position.y += (-mouseY * 0.05 + 10 - camera.position.y) * 0.05;
                    camera.lookAt(scene.position);

                    renderer.render(scene, camera);
                }
                animate();

                window.addEventListener('resize', () => {
                    windowHalfX = window.innerWidth / 2;
                    windowHalfY = window.innerHeight / 2;
                    camera.aspect = window.innerWidth / heroPContainer.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, heroPContainer.clientHeight);

                    // Adjust logo scale dynamically if window resizes between desktop and mobile
                    if (logoMesh) {
                        const isMobile = window.innerWidth < 768;
                        const scale = isMobile ? 15 : 30;
                        logoMesh.scale.set(scale, scale, scale);
                    }
                });
            }
        });