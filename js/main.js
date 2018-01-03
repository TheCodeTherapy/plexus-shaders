var camera, scene, renderer, group, disc;
var width, height, depth;
var container, statsContainer;
var threeStats, threeGUI;
var previousTonemap, previousExposure;
var previousShadowMap = false;
var shadersTime = 0.0;
var startTime, elapsedTime;
var composer = {};
var renderPass, effectCopy;
var effectFXAA, effectFilm, effectBloom, rgbShiftShader;
var staticPass, CRTPass, vignettePass, kaleidoShader;
var techniColor, sepiaShader;
var basicLightning, hemiLight, pointLight;
var sceneMaterials = [];
var mouseX = 0;
var mouseY = 0;
var windowHalfX;
var windowHalfY;
var mouseFocus = false;
var cameraMoveFactor = 10;
var particlesGroup;
var spotLightsGroup;
var plexusParticles;
var dancingSpotLights;
var hedron, circle;
var fftSize = 128;
var audioLoader, listener, audio, analyser, uniforms;

setEvents();
init();
animate();

function init() {

    startTime       = Date.now();
    scene           = new THREE.Scene();
    group           = new THREE.Group();
    disc            = new THREE.Group();
    basicLightning  = new THREE.Group();
    particlesGroup  = new THREE.Group();
    spotLightsGroup = new THREE.Group();

    container       = document.getElementById( 'container' );
    statsContainer  = document.getElementById( 'stats' );
    recalculateDimensions();

    camera = new THREE.PerspectiveCamera( 40, width / height, 1, 7000 );
    camera.position.z = 1000;
    camera.position.y = 18000;

    audioLoader     = new THREE.AudioLoader();
    listener        = new THREE.AudioListener();

    camera.add(listener);

    audio           = new THREE.Audio(listener);

    audioLoader.load('ambientjam.ogg', function(buffer) {
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.setVolume(0.7);
        audio.play();
    } );

    analyser = new THREE.AudioAnalyser(audio, fftSize);

    threeStats = new Stats();
    if (safeSet(threeStats)) {
        configureStats();
    }

    threeGUI = new dat.GUI( { autoplace: false, width: width / 5 } );
    if (safeSet(threeGUI)) { configureGUI(); }
    var guiContainer = document.getElementById('custom-gui');
    guiContainer.appendChild(threeGUI.domElement);

    scene.fog = new THREE.Fog( 0x000000, 1500, 5000 );

    particlesGroup.radius = 512;
    particlesGroup.positionY = 0;
    plexusParticles = new PlexusParticles();
    plexusParticles.init( particlesGroup );
    group.add( particlesGroup );

    dancingSpotLights = new SpotLights();
    dancingSpotLights.init( spotLightsGroup, 3, 500, 500 );
    dancingSpotLights.helpersVisible = dancingSpotLightsParams.helpers;
    group.add(spotLightsGroup);
    spotLightsGroup.visible = dancingSpotLightsParams.enable;

    renderer = setRenderer();
    setPostProcessingChain();
    setupBasicLightning();

    group.position.y = -100;
    group.add( disc );
    group.add( basicLightning );
    scene.add( group );

    var hedronGeometry = new THREE.DodecahedronGeometry(30, 0);
    var hedronMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
    hedron = new THREE.Mesh(hedronGeometry, hedronMaterial);
    hedron.castShadow = true;
    hedron.receiveShadow = false;
    hedron.position.y = 70;
    hedron.updateMatrixWorld();
    sceneMaterials.push(hedronMaterial);
    group.add(hedron);

    var circleRadius = 500;
    var texture = new THREE.TextureLoader().load('vinyl_texture.png');
    var circleGeometry = new THREE.CircleGeometry(circleRadius, 128);
    var circleMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        metalness: 0,
        map: texture
    });
    circleMaterial.side = THREE.DoubleSide;
    circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.castShadow = false;
    circle.receiveShadow = true;
    circle.rotation.x = degToRad(90);
    circle.position.set(0, -10, 0);
    circle.updateMatrixWorld();
    sceneMaterials.push(circleMaterial);
    disc.add(circle);

    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
}

function setupBasicLightning() {
    hemiLight = new THREE.HemisphereLight( 0xDDDDFF, 0xDDDDFF, 0.02 );
    hemiLight.intensity = ambientIlluminance[lightningParams.hemiLightningPower];
    hemiLight.position.set(0, height / 2.5, 0);
    hemiLight.visible = lightningParams.hemiActive;
    basicLightning.add(hemiLight);

    var pointLightGeometry = new THREE.DodecahedronGeometry(7, 0);
    var pointLightMaterial = new THREE.MeshStandardMaterial({
        emissive: 0x4477FF,
        emissiveIntensity: 2,
        color: 0xFFFFFF
    });

    pointLight = new THREE.SpotLight(0x4477FF, 2);
    pointLight.castShadow = true;
    pointLight.angle = 0.8;
    pointLight.penumbra = 0.8;
    pointLight.decay = 2;
    pointLight.distance = 800;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    pointLight.add(new THREE.Mesh(pointLightGeometry, pointLightMaterial));
    pointLight.updateMatrixWorld();
    pointLight.castShadow = true;
    pointLight.intensity =  lmPerWat[lightningParams.pointLightningPowerA] *
                            lampPower[lightningParams.pointLightningPowerB];
    pointLight.position.set(0, height / 3, 0);
    pointLight.visible = lightningParams.pointActive;
    basicLightning.add(pointLight);
}

function animate() {
    updateShadersAndLights();
    updatePlexusParticles();
    updateDancingSpotLights();
    updateHedron();
    updateCameraPosition();
    requestAnimationFrame( animate );
    analyser.getFrequencyData();
    if (switchStats.enableStats) {
        threeStats.domElement.style.visibility = 'visible';
        updateStats();
    } else {
        threeStats.domElement.style.visibility = 'hidden';
    }
    composer.render();
}

function updateShadersAndLights() {
    shadersTime += 0.01;

    staticPass.uniforms[ 'time' ].value = shadersTime;
    CRTPass.uniforms[ 'time' ].value = shadersTime;

    if (lightningParams.exposure !== previousExposure) {
        renderer.toneMappingExposure = Math.pow(lightningParams.exposure, 5.0);
        previousExposure = lightningParams.exposure;
    }

    renderer.shadowMap.enabled  = lightningParams.shadows;
    renderer.toneMapping        = toneMappingTypes[lightningParams.toneMapping];

    if (shadersParams.globalSwitch) {
        effectFXAA.enabled      = shadersParams.effectFXAA;
        effectFilm.enabled      = shadersParams.effectFilm;
        effectBloom.enabled     = shadersParams.effectBloom;
        CRTPass.enabled         = shadersParams.CRTPass;
        rgbShiftShader.enabled  = shadersParams.rgbShiftShader;
        staticPass.enabled      = shadersParams.staticPass;
        vignettePass.enabled    = shadersParams.vignettePass;
        kaleidoShader.enabled   = shadersParams.kaleidoShader;
        techniColor.enabled     = shadersParams.techniColor;
        sepiaShader.enabled     = shadersParams.sepiaShader;
    } else {
        effectFXAA.enabled      = false;
        effectFilm.enabled      = false;
        effectBloom.enabled     = false;
        CRTPass.enabled         = false;
        rgbShiftShader.enabled  = false;
        staticPass.enabled      = false;
        vignettePass.enabled    = false;
        techniColor.enabled     = false;
        sepiaShader.enabled     = false;
        kaleidoShader.enabled   = false;
    }

    effectFilm.uniforms.nIntensity.value        = filmParams.noiseIntensity;
    effectFilm.uniforms.sIntensity.value        = filmParams.scanLinesIntensity;
    effectFilm.uniforms.sCount.value            = filmParams.scanLinesCount;
    effectFilm.uniforms.grayscale.value         = filmParams.grayScale ? 1 : 0;
    effectBloom.copyUniforms.opacity.value      = bloomParams.strength;
    effectBloom.kernelSize                      = bloomParams.kernelSize;
    effectBloom.sigma                           = bloomParams.sigma;
    effectBloom.resolution                      = bloomParams.resolution;
    CRTPass.uniforms[ 'distortion' ].value      = CRTParams.distortion1;
    CRTPass.uniforms[ 'distortion2' ].value     = CRTParams.distortion2;
    CRTPass.uniforms[ 'speed' ].value           = CRTParams.speed;
    CRTPass.uniforms[ 'rollSpeed' ].value       = CRTParams.rollSpeed;
    rgbShiftShader.uniforms[ 'amount' ].value   = rgbShiftParams.amount;
    rgbShiftShader.uniforms[ 'angle' ].value    = rgbShiftParams.angle;
    staticPass.uniforms[ 'amount' ].value       = staticParams.amount;
    staticPass.uniforms[ 'size' ].value         = staticParams.size;
    vignettePass.uniforms[ 'offset' ].value     = vignetteParams.offset;
    vignettePass.uniforms[ 'darkness' ].value   = vignetteParams.darkness;
    techniColor.uniforms[ 'amount' ].value      = techniColorParams.amount;
    sepiaShader.uniforms[ 'amount' ].value      = sepiaParams.amount;
    kaleidoShader.uniforms[ "sides" ].value     = kaleidoParams.sides;
    kaleidoShader.uniforms[ "angle" ].value     = kaleidoParams.angle;

    if (lightningParams.shadows !== previousShadowMap) {
        updateMaterials();
        previousShadowMap = lightningParams.shadows;
    }

    if (lightningParams.toneMapping !== previousTonemap) {
        updateMaterials();
        previousTonemap = lightningParams.toneMapping;
    }

    hemiLight.intensity  = ambientIlluminance[lightningParams.hemiLightningPower];
    pointLight.intensity =  lmPerWat[lightningParams.pointLightningPowerA] *
        lampPower[lightningParams.pointLightningPowerB];

    hemiLight.visible = lightningParams.hemiActive;
    pointLight.visible = lightningParams.pointActive;
}

function updatePlexusParticles() {
    if (plexusParams.enable) {
        particlesGroup.visible = true;
        plexusParticles.update(particlesGroup);
    } else {
        particlesGroup.visible = false;
    }
}

function updateDancingSpotLights() {
    if (dancingSpotLightsParams.enable) {
        spotLightsGroup.visible = true;
        dancingSpotLights.helpersVisible = dancingSpotLightsParams.helpers;
        dancingSpotLights.update(spotLightsGroup);
    } else {
        dancingSpotLightsParams.helpers = false;
        spotLightsGroup.visible = false;
    }
}

function updateHedron() {
    hedron.rotation.x += 0.05;
    if (hedron.rotation.x >= 360) { hedron.rotation.x = 0; }

    hedron.rotation.y += 0.01;
    if (hedron.rotation.y >= 360) { hedron.rotation.y = 0; }
}

function updateCameraPosition() {
    group.mousePositionX = mouseX / 10;
    group.mousePositionY = mouseY / 10;

    camera.position.x += ( (mouseX / cameraMoveFactor) - camera.position.x ) * .025;
    camera.position.y += ( - (mouseY / (cameraMoveFactor / 2)) - camera.position.y ) * .025;
    camera.position.y = clamp(camera.position.y, 130, 50000);
    camera.position.z = 1000;
    camera.lookAt( scene.position );

    if (shadersParams.CRTPass || shadersParams.rgbShiftShader) {

        var absMouseX = Math.abs(group.mousePositionX);
        var absMouseY = Math.abs(group.mousePositionY);
        var distortFactor = Math.max(absMouseX, absMouseY);
        var distortThreshold = 80.0;

        particlesGroup.rotation.y += 0.005 + ((analyser.data[12] / 168.0) / 100);
        disc.rotation.y += 0.02;

        var distortFactorB = (analyser.data[21] <= distortThreshold) ? analyser.data[21] / 1.7 : analyser.data[21];
        CRTPass.uniforms[ 'distortion2' ].value += distortFactorB / 50;
        if (shadersParams.CRTPass) {
            CRTPass.uniforms[ 'distortion' ].value += distortFactor / 1200.;
        }
        if (shadersParams.rgbShiftShader) {
            rgbShiftShader.uniforms[ 'amount' ].value += distortFactorB / 32000;
        }

        if (analyser.data[21] >= 130.0) {
            changePlexus();
        }
    }
}

function updateStats() {
    if (safeSet(threeStats))
    {
        threeStats.update();
    }
}

function setEvents() {
    addEvent(window,"load",function(e) {
        e.parent = null;
        addEvent(document, "mouseout", function(e) {
            e = e ? e : window.event;
            var from = e.relatedTarget || e.toElement;
            if (!from || from.nodeName === "HTML") {
                mouseFocus = false;
            }
        });
    });

    addEvent(document, "mousemove", onDocumentMouseMove);
}

function render() {
    renderer.render( scene, camera );
}
