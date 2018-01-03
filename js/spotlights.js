var SpotLights = function() {

    var xRadius, zRadius, yPos;
    var spotLights;
    var spotHelpers;
    var positions = [];
    var spotBasicColors = [ 0xFF0000, 0x00FF00, 0x0000FF,
                            0xFFFF00, 0x00FFFF, 0xFF00FF];
    var mainTarget;
    var previousTarget;

    var helpersVisible = false;
    var previousHelpersState;

    var waveTarget;
    var waveRotationSpeed = 0.001;
    var waveModulationSpeed = 0.003;

    var waveHeight = 100;

    var spotIntensity = 2;
    var spotAngle = 0.5;
    var spotPenumbra = 0.5;
    var spotDecay = 3;
    var spotDistance = 1500;
    var spotWShadowRes = 1024;
    var spotHShadowRes = 1024;

    this.init = function(parent, numberOfSpots, initialRadiusX, initialRadiusZ) {

        spotLights = new THREE.Group();
        spotLights.name = "spotLights";

        spotHelpers = new THREE.Group();
        spotHelpers.name = "spotHelpers";
        previousHelpersState = false;

        xRadius = initialRadiusX;
        zRadius = initialRadiusZ;
        yPos = parent.position.y + 250;

        waveTarget = true;
        mainTarget = this.createSimpleSpotsTarget(
            parent.position.x,
            parent.position.y,
            parent.position.z);
        mainTarget.updateMatrixWorld();
        spotHelpers.add(mainTarget);
        previousTarget = mainTarget;

        positions = this.evenInCircle(xRadius, zRadius, yPos, numberOfSpots);

        for (var l = 0; l < numberOfSpots; l++) {

            var spot = this.createSpotLight(spotBasicColors[l], mainTarget);
            spot.name = "spotLight" + l;

            var spotHelper = new THREE.SpotLightHelper(spot);
            spotHelper.name = "spotHelper" + l;

            spot.position.set(
                positions[l][0],
                positions[l][1],
                positions[l][2]);

            spotHelper.update();
            spotLights.add(spot);
            spotHelpers.add(spotHelper);
            spotHelpers.visible = helpersVisible;


        }
        parent.add(spotLights);
        parent.add(spotHelpers);
    };

    this.update = function(parent) {
        if (safeSet(waveTarget) && waveTarget === true) {
            var t = Date.now() * waveRotationSpeed;
            var t2 = Date.now() * waveModulationSpeed;
            var tSin = Math.sin(t);
            var tCos = Math.cos(t);
            var tSinB = Math.sin(t2);

            mainTarget.position.x = tSin * (xRadius / 1.5);
            mainTarget.position.z = tCos * (zRadius / 1.5);
            mainTarget.position.y = waveHeight + (tSinB * waveHeight);

        }

        if (safeSet(mainTarget) && previousTarget !== mainTarget) {
            mainTarget.updateMatrixWorld();
            for (var spot = 0; spot < spotLights.children.length; spot++) {
                console.log(spot);
                spotLights.children[spot].target = mainTarget;
                spotLights.children[spot].material.update();
            }
        }

        if (previousHelpersState !== this.helpersVisible) {
            previousHelpersState = this.helpersVisible;
            spotHelpers.visible = this.helpersVisible;
        }
        if (this.helpersVisible) {
            for (var s = 0; s <= spotLights.children.length; s++) {
                if (spotHelpers.children[s].type !== "Mesh") {
                    spotHelpers.children[s].update();
                }
            }
        }
    };

    this.createSpotLight = function(color, target) {

        var newSpot = new THREE.SpotLight(color, 1);
        // var newSpotGeometry = new THREE.SphereGeometry(5, 8, 6);
        // var newSpotMaterial = new THREE.MeshLambertMaterial({
        //     color: color,
        //     emissive: color,
        //     emissiveIntensity: 8
        // });
        //
        // var newSpotMesh = new THREE.Mesh(newSpotGeometry, newSpotMaterial);
        // newSpot.add(newSpotMesh);

        newSpot.intensity = spotIntensity;
        newSpot.angle = spotAngle;
        newSpot.penumbra = spotPenumbra;
        newSpot.decay = spotDecay;
        newSpot.distance = spotDistance;
        newSpot.shadow.mapSize.width = spotWShadowRes;
        newSpot.shadow.mapSize.height = spotHShadowRes;
        newSpot.castShadow = true;
        newSpot.target = target;

        return newSpot;
    };

    this.evenInCircle = function(radiusX, radiusZ, positionY, points) {
        var positions = [];
        for (var point = 0; point <= points; point++) {
            var p = point / points;
            var angle = p * Math.PI * 2;
            var x = Math.sin(angle) * radiusX;
            var y = positionY;
            var z = Math.cos(angle) * radiusZ;
            positions.push([x, y, z]);
        }
        return positions;
    };

    this.createSimpleSpotsTarget = function(posX, posY, posZ) {
        var targetGeometry = new THREE.BoxBufferGeometry(10, 10, 10);
        var targetMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
        var target = new THREE.Mesh(targetGeometry, targetMaterial);
        target.position.set(posX, posY, posZ);
        target.updateMatrixWorld();
        return target;
    };

    this.createComplexSpotsTarget = function(posX, posY, posZ) {
        var targetGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
        var targetMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            emissive: 0xFFFFFF,
            emissiveIntensity: 2
        });
        var targetLight = new THREE.PointLight(0xFFFFFF, 1.0, 150, 2);
        targetLight.add(new THREE.Mesh(targetGeometry, targetMaterial));
        targetLight.position.set(posX, posY, posZ);
        targetLight.updateMatrixWorld();
        targetLight.castShadow = true;
        targetLight.receiveShadow = false;
        return targetLight;
    };
};

function safeSet(varToCheck) {
    return (typeof varToCheck !== 'undefined')
}

function safeAdd(parent, object) {
    if (safeSet(object) && !parent.getElementsByName(object.name)) {
        parent.add(object);
    }
}

function safeRemove(parent, object) {
    if (safeSet(object) && parent.getElementsByName(object.name)) {
        parent.remove(object);
    }
}
