function addEvent(obj, evt, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evt, fn, false);
    }
    else if (obj.attachEvent) {
        obj.attachEvent("on" + evt, fn);
    }
}

function onDocumentMouseMove(event) {
    mouseX = ( event.clientX - windowHalfX ) * 10;
    mouseY = ( event.clientY - windowHalfY ) * 10;
    if (!mouseFocus) mouseFocus = true;
}

function onWindowResize() {
    recalculateDimensions();
}

function recalculateDimensions() {
    width                       = container.offsetWidth;
    height                      = container.offsetHeight;
    depth                       = height;

    windowHalfX                 = width / 2;
    windowHalfY                 = height / 2;

    group.width                 = width;
    group.height                = height;
    group.depth                 = depth;
    group.halfWidth             = windowHalfX;
    group.halfHeight            = windowHalfY;
    group.halfDepth             = group.halfHeight;

    particlesGroup.halfHeight   = group.halfHeight;

    if (safeSet(camera)) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    if (safeSet(renderer)) {
        renderer.setSize( width, height );
    }

    if (safeSet(composer) && composer.length > 0) {
        composer.setSize( width, height );
    }

    if (safeSet(effectFXAA)) {
        effectFXAA.uniforms[ 'resolution' ].value.set(1 / width, 1 / height);
    }
}

function updateMaterials() {
    for (var mat = 0; mat < sceneMaterials.length; mat++) {
        sceneMaterials[mat].needsUpdate = true;
    }
}

function changePlexus() {
    var newHue = Math.random();
    plexusParticles.changeValues(newHue);
}

function safeSet(varToCheck) {
    return (typeof varToCheck !== 'undefined')
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

function randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function map(value, min1, max1, min2, max2) {
    return lerp(TUtil.norm(value, min1, max1), min2, max2);
}

function lerp(value, min, max) {
    return min + (max - min) * value;
}

function norm(value , min, max) {
    return (value - min) / (max - min);
}

function randomVector3(range) {
    return new THREE.Vector3(
        randomRange(-range, range),
        randomRange(-range, range),
        randomRange(-range, range));
}

function randomVector2(range) {
    return new THREE.Vector2(
        randomRange(-range, range),
        randomRange(-range, range));
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function smoothstep(value, min, max ) {
    var x = Math.max(0, Math.min(1, (value-min) / (max-min)));
    return x * x * (3 - 2 * x);
}

function sample(ary) {
    return ary[randomInt(0,ary.length-1)];
}

function modWrap(n, m) {
    return ((n % m) + m) % m;
}
