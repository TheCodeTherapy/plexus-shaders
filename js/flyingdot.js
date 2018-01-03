var FlyingDot = function() {
    var group;
    var dot;
    var currentPos;
    var newPos;
    var speedFactor = 0.004;
    var lerpTime = 1;
    var currentLerpTime = 0;
    var tick = 0;

    var particleSystem;
    var particlesOptions;
    var spawnerOptions;

    var clock = new THREE.Clock();

    this.init = function(parent) {
        newPos = currentPos = getRandomPosition();
        dot = getBox(5, 5, 5);
        dot.position.set(currentPos.x, currentPos.y, currentPos.z);

        particleSystem = new THREE.GPUParticleSystem({
            maxParticles: 512000
        });

        particlesOptions = {
            position: new THREE.Vector3(),
            positionRandomness: 1.2,
            velocity: new THREE.Vector3(),
            velocityRandomness: 3.5,
            color: 0x001122,
            colorRandomness: 0.7,
            turbulence: 1.7,
            lifetime: 6,
            size: 12,
            sizeRandomness: 3
        };

        spawnerOptions = {
            spawnRate: 150000,
            horizontalSpeed: 1.5,
            verticalSpeed: 1.33,
            timeScale: 1
        };

        this.changeDestine();
        group = new THREE.Group();
        group.add(dot);
        group.add(particleSystem);
        parent.add(group);
    };

    this.changeDestine = function() {
        newPos = getRandomPosition();
    };

    this.update = function(parent) {

        if (dot.position.distanceTo(newPos) < 1) {

            currentPos = dot.position;
            this.changeDestine();
            currentLerpTime = 0;
            speedFactor = getRandomNumber(0.0016, 0.0040);
        }

        currentLerpTime += speedFactor;
        currentLerpTime = (currentLerpTime > lerpTime) ? lerpTime : currentLerpTime;

        var perc = smoothStepA(currentLerpTime / lerpTime);

        var newX = lerp(currentPos.x, newPos.x, perc);
        var newY = lerp(currentPos.y, newPos.y, perc);
        var newZ = lerp(currentPos.z, newPos.z, perc);

        //console.log(parent.mousePositionX);
        dot.position.set(newX, newY, newZ);

        dot.rotation.x += 0.02;
        dot.rotation.y += 0.10;
        dot.rotation.z -= 0.04;

        var delta = clock.getDelta() * spawnerOptions.timeScale;
        tick += delta;
        if (tick < 0) tick = 0;
        if (delta > 0) {
            particlesOptions.position.x = dot.position.x;
            particlesOptions.position.y = dot.position.y;
            particlesOptions.position.z = dot.position.z;
            for ( var x = 0; x < spawnerOptions.spawnRate * delta; x++ ) {
                particleSystem.spawnParticle( particlesOptions );
            }
        }
        particleSystem.update( tick );
    };
};

function lerp(a, b, t){
    return a + (b - a) * t;
}

function smoothStepA(n) {
    return n * n * n * (n * (6 * n - 15) + 10);
}

function smoothStepB(n) {
    return n * n * (3 - 2 * n);
}

function getBox(w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });
    var boxMesh = new THREE.Mesh(geometry, material);
    return boxMesh;
}

function getRandomPosition() {
    var x = getRandomNumber(-600, 600);
    var y = getRandomNumber(-250, 250);
    var z = getRandomNumber(-450, 500);
    return new THREE.Vector3(x, y, z);
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
