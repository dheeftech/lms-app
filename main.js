// Main Three.js JavaScript for SpeedEats

// Global scene references
let heroScene, foodScene, driverScene, mapScene, particlesScene;
let heroCamera, foodCamera, driverCamera, mapCamera, particlesCamera;
let heroRenderer, foodRenderer, driverRenderer, mapRenderer, particlesRenderer;

// Initialize Hero Scene (Home Page)
function initHeroScene() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    // Scene
    heroScene = new THREE.Scene();
    
    // Camera
    heroCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    heroCamera.position.z = 5;

    // Renderer
    heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(heroRenderer.domElement);

    // Create delivery motorcycle
    const motorcycle = createMotorcycle();
    heroScene.add(motorcycle);

    // Add floating food items
    const foods = createFloatingFoods();
    foods.forEach(food => heroScene.add(food));

    // Add particles
    const particles = createParticles(100);
    heroScene.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    heroScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xf97316, 1);
    pointLight.position.set(5, 5, 5);
    heroScene.add(pointLight);

    // Animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Rotate motorcycle slightly
        motorcycle.rotation.y = Math.sin(time * 0.5) * 0.1;
        motorcycle.position.y = Math.sin(time) * 0.2;

        // Animate food items
        foods.forEach((food, index) => {
            food.rotation.y += 0.02;
            food.position.y = Math.sin(time + index) * 0.5;
        });

        // Rotate particles
        particles.rotation.y += 0.001;

        heroRenderer.render(heroScene, heroCamera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        heroCamera.aspect = window.innerWidth / window.innerHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Create 3D Motorcycle
function createMotorcycle() {
    const motorcycle = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xf97316 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    motorcycle.add(body);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(1.2, -0.4, 0);
    motorcycle.add(frontWheel);

    const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backWheel.rotation.z = Math.PI / 2;
    backWheel.position.set(-1.2, -0.4, 0);
    motorcycle.add(backWheel);

    // Delivery box
    const boxGeometry = new THREE.BoxGeometry(1, 1, 0.8);
    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-0.5, 0.8, 0);
    motorcycle.add(box);

    // Headlight
    const lightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const lightMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, emissive: 0xffff00 });
    const headlight = new THREE.Mesh(lightGeometry, lightMaterial);
    headlight.position.set(1, 0.2, 0);
    motorcycle.add(headlight);

    return motorcycle;
}

// Create Floating Food Items
function createFloatingFoods() {
    const foods = [];
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da];
    
    for (let i = 0; i < 6; i++) {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: colors[i],
            shininess: 100
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4 - 2
        );
        foods.push(sphere);
    }
    
    return foods;
}

// Create Particles
function createParticles(count) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xf97316,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });
    
    return new THREE.Points(geometry, material);
}

// Initialize Food Scene (Restaurants Page)
function initFoodScene() {
    const container = document.getElementById('food-canvas');
    if (!container) return;

    foodScene = new THREE.Scene();
    foodCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    foodCamera.position.z = 5;

    foodRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    foodRenderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(foodRenderer.domElement);

    // Create rotating food items
    const foodItems = [];
    const geometries = [
        new THREE.TorusGeometry(0.5, 0.2, 16, 100), // Donut
        new THREE.ConeGeometry(0.5, 1, 32), // Ice cream
        new THREE.OctahedronGeometry(0.5), // Diamond shape
    ];
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0xff6b6b }),
        new THREE.MeshPhongMaterial({ color: 0xffe66d }),
        new THREE.MeshPhongMaterial({ color: 0x4ecdc4 }),
    ];

    for (let i = 0; i < 9; i++) {
        const geometry = geometries[i % geometries.length];
        const material = materials[i % materials.length];
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4
        );
        foodItems.push(mesh);
        foodScene.add(mesh);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    foodScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xf97316, 1);
    pointLight.position.set(5, 5, 5);
    foodScene.add(pointLight);

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        foodItems.forEach((item, index) => {
            item.rotation.x += 0.01;
            item.rotation.y += 0.02;
            item.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        });

        foodRenderer.render(foodScene, foodCamera);
    }
    animate();

    window.addEventListener('resize', () => {
        foodCamera.aspect = window.innerWidth / window.innerHeight;
        foodCamera.updateProjectionMatrix();
        foodRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize Driver Scene (Drivers Page)
function initDriverScene() {
    const container = document.getElementById('driver-canvas');
    if (!container) return;

    driverScene = new THREE.Scene();
    driverCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    driverCamera.position.z = 6;
    driverCamera.position.x = 2;

    driverRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    driverRenderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(driverRenderer.domElement);

    // Create detailed motorcycle
    const motorcycle = createDetailedMotorcycle();
    motorcycle.position.x = -1;
    driverScene.add(motorcycle);

    // Add road lines
    const roadGroup = new THREE.Group();
    for (let i = -10; i < 10; i++) {
        const lineGeometry = new THREE.BoxGeometry(0.2, 0.05, 1);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(0, -2, i * 2);
        roadGroup.add(line);
    }
    driverScene.add(roadGroup);

    // Add moving particles (speed effect)
    const speedParticles = createParticles(200);
    driverScene.add(speedParticles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    driverScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xf97316, 1.5);
    pointLight.position.set(5, 3, 5);
    driverScene.add(pointLight);

    // Animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.02;

        // Move motorcycle forward effect
        motorcycle.position.z = Math.sin(time * 0.5) * 0.5;
        motorcycle.rotation.y = Math.sin(time) * 0.05;

        // Rotate wheels
        motorcycle.children.forEach(child => {
            if (child.geometry && child.geometry.type === 'CylinderGeometry') {
                child.rotation.x += 0.1;
            }
        });

        // Move road lines
        roadGroup.children.forEach(line => {
            line.position.z += 0.1;
            if (line.position.z > 10) {
                line.position.z = -10;
            }
        });

        // Rotate particles
        speedParticles.rotation.y += 0.005;

        driverRenderer.render(driverScene, driverCamera);
    }
    animate();

    window.addEventListener('resize', () => {
        driverCamera.aspect = window.innerWidth / window.innerHeight;
        driverCamera.updateProjectionMatrix();
        driverRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Create Detailed Motorcycle
function createDetailedMotorcycle() {
    const motorcycle = new THREE.Group();

    // Main body
    const bodyGeometry = new THREE.BoxGeometry(2.5, 1, 1.2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xf97316, shininess: 100 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    motorcycle.add(body);

    // Front fairing
    const fairingGeometry = new THREE.ConeGeometry(0.6, 1, 32);
    const fairing = new THREE.Mesh(fairingGeometry, bodyMaterial);
    fairing.rotation.x = Math.PI / 2;
    fairing.position.set(1.5, 0.3, 0);
    motorcycle.add(fairing);

    // Wheels with spokes
    const wheelGeometry = new THREE.TorusGeometry(0.5, 0.15, 16, 32);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontWheel.position.set(1.3, -0.5, 0);
    motorcycle.add(frontWheel);

    const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backWheel.position.set(-1.3, -0.5, 0);
    motorcycle.add(backWheel);

    // Delivery box on back
    const boxGeometry = new THREE.BoxGeometry(1.2, 1.2, 1);
    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-1, 0.8, 0);
    
    // Logo on box
    const logoGeometry = new THREE.CircleGeometry(0.3, 32);
    const logoMaterial = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 0, 0.51);
    box.add(logo);
    
    motorcycle.add(box);

    // Headlight
    const headlightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const headlightMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffff00, 
        emissive: 0xffff00,
        emissiveIntensity: 0.5
    });
    const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight.position.set(2, 0, 0);
    motorcycle.add(headlight);

    // Handlebars
    const handlebarGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    const handlebarMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const handlebar = new THREE.Mesh(handlebarGeometry, handlebarMaterial);
    handlebar.rotation.z = Math.PI / 2;
    handlebar.position.set(1, 0.5, 0);
    motorcycle.add(handlebar);

    return motorcycle;
}

// Initialize Map Scene (Tracking Page)
function initMapScene() {
    const container = document.getElementById('map-canvas');
    if (!container) return;

    mapScene = new THREE.Scene();
    mapCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    mapCamera.position.z = 8;
    mapCamera.position.y = 3;
    mapCamera.lookAt(0, 0, 0);

    mapRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    mapRenderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(mapRenderer.domElement);

    // Create grid (map streets)
    const gridHelper = new THREE.GridHelper(20, 20, 0xf97316, 0x444444);
    mapScene.add(gridHelper);

    // Create delivery marker (motorcycle)
    const marker = createDeliveryMarker();
    mapScene.add(marker);

    // Create destination marker
    const destGeometry = new THREE.ConeGeometry(0.3, 1, 32);
    const destMaterial = new THREE.MeshPhongMaterial({ color: 0x4ecdc4 });
    const destination = new THREE.Mesh(destGeometry, destMaterial);
    destination.position.set(5, 0.5, 5);
    destination.rotation.x = Math.PI;
    mapScene.add(destination);

    // Create route line
    const routePoints = [];
    routePoints.push(new THREE.Vector3(0, 0.1, 0));
    routePoints.push(new THREE.Vector3(5, 0.1, 5));
    const routeGeometry = new THREE.BufferGeometry().setFromPoints(routePoints);
    const routeMaterial = new THREE.LineBasicMaterial({ color: 0xf97316, linewidth: 3 });
    const route = new THREE.Line(routeGeometry, routeMaterial);
    mapScene.add(route);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    mapScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xf97316, 1);
    pointLight.position.set(5, 5, 5);
    mapScene.add(pointLight);

    // Animation
    let progress = 0;
    function animate() {
        requestAnimationFrame(animate);
        progress += 0.005;

        if (progress > 1) progress = 0;

        // Move marker along route
        marker.position.x = progress * 5;
        marker.position.z = progress * 5;
        marker.rotation.y = -Math.PI / 4;

        // Pulse destination
        destination.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.2);

        mapRenderer.render(mapScene, mapCamera);
    }
    animate();

    window.addEventListener('resize', () => {
        mapCamera.aspect = window.innerWidth / window.innerHeight;
        mapCamera.updateProjectionMatrix();
        mapRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Create Delivery Marker
function createDeliveryMarker() {
    const marker = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.5);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xf97316 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    marker.add(body);

    return marker;
}

// Initialize Particles (for CTA section)
function initParticles() {
    const container = document.getElementById('particles-canvas');
    if (!container) return;

    particlesScene = new THREE.Scene();
    particlesCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    particlesCamera.position.z = 5;

    particlesRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    particlesRenderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(particlesRenderer.domElement);

    const particles = createParticles(150);
    particlesScene.add(particles);

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.002;
        particles.rotation.x += 0.001;
        particlesRenderer.render(particlesScene, particlesCamera);
    }
    animate();

    window.addEventListener('resize', () => {
        particlesCamera.aspect = window.innerWidth / window.innerHeight;
        particlesCamera.updateProjectionMatrix();
        particlesRenderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('bg-gray-900/95');
        navbar.classList.remove('bg-gray-900/80');
    } else {
        navbar.classList.add('bg-gray-900/80');
        navbar.classList.remove('bg-gray-900/95');
    }
});

// Export functions for HTML pages
window.initHeroScene = initHeroScene;
window.initFoodScene = initFoodScene;
window.initDriverScene = initDriverScene;
window.initMapScene = initMapScene;
window.initParticles = initParticles;
