var PlexusParticles = function() {
    var radius;
    var positionY;

	var group;
	var particlesData = [];
	var positions, colors;
	var particles;
	var particlePositions;
	var pointCloud;
	var linesMesh;
	var lineColor;
	
	var limitConnections = true;
	var maxConnections = 3;
	var minDistance = 130;
	var maxParticleCount = 120;
	var particleCount = 120;

	this.init = function(parent) {

		radius = parent.radius;
		positionY = parent.positionY;

		lineColor = new THREE.Color();
		lineColor.setHSL(0.621212, 0.63, 1);

		var particleMaterial = new THREE.PointsMaterial( {
			color: 0xFFFFFF,
			size: 2,
			blending: THREE.AdditiveBlending,
			transparent: true,
			sizeAttenuation: false
		} );

		var lineMaterial = new THREE.LineBasicMaterial( {
			color: lineColor,
			linewidth: 1,
			vertexColors: THREE.AdditiveBlending,
			blending: THREE.NormalBlending,
			transparent: true
		} );

		var segments = maxParticleCount * maxParticleCount;

		positions = new Float32Array( segments * 3 );
		colors = new Float32Array( segments * 3 );

		particles = new THREE.BufferGeometry();
		particlePositions = new Float32Array( maxParticleCount * 3 );

		for ( var i = 0; i < maxParticleCount; i++ ) {

		    var posXYZ = getPointInsideCircle(radius, positionY);
			particlePositions[ i * 3     ] = posXYZ[0];
			particlePositions[ i * 3 + 1 ] = posXYZ[1];
			particlePositions[ i * 3 + 2 ] = posXYZ[2];

			var velY = 0.21 + Math.abs(Math.random() * 2);

			particlesData.push( {
				velocityY: velY,
				numConnections: 0
			} );
		}

		particles.setDrawRange( 0, particleCount );
		particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );

		var geometry = new THREE.BufferGeometry();
		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
		geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );
		geometry.computeBoundingSphere();
		geometry.setDrawRange( 0, 0 );

		pointCloud = new THREE.Points( particles, particleMaterial );

		linesMesh = new THREE.LineSegments( geometry, lineMaterial );
		linesMesh.castShadow = false;
		linesMesh.receiveShadow = false;

        group = new THREE.Group();
        group.add( pointCloud );
		group.add( linesMesh );
		parent.add( group );
	};

	this.update = function(parent) {

        var h = parent.halfHeight;

		var vertexPosition = 0;
		var colorPosition = 0;
		var numConnected = 0;

		for ( var c = 0; c < particleCount; c++ )
			particlesData[ c ].numConnections = 0;

		for ( var i = 0; i < particleCount; i++ ) {

			particlePositions[ i * 3 + 1 ] += particlesData[i].velocityY;

            if ( particlePositions[ i * 3 + 1 ] > h ) {
                var posXYZ = getPointInsideCircle(radius, positionY);
                particlesData[i].velocityY = 0.21 + Math.abs(Math.random() * 2);
                particlePositions[ i * 3] = posXYZ[0];
                particlePositions[ i * 3 + 1 ] = posXYZ[1];
                particlePositions[ i * 3 + 2 ] = posXYZ[2];
            }

			if ( limitConnections && particlesData[i].numConnections >= maxConnections )
				continue;

			for ( var j = i + 1; j < particleCount; j++ ) {

				var particleDataB = particlesData[ j ];
				if ( limitConnections && particleDataB.numConnections >= maxConnections )
					continue;

				var dx = particlePositions[ i * 3     ] - particlePositions[ j * 3     ];
				var dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
				var dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
				var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

				if ( dist < minDistance ) {

                    particlesData[i].numConnections++;
					particleDataB.numConnections++;

					var alpha = 1.0 - dist / minDistance;

					positions[ vertexPosition++ ] = particlePositions[ i * 3     ];
					positions[ vertexPosition++ ] = particlePositions[ i * 3 + 1 ];
					positions[ vertexPosition++ ] = particlePositions[ i * 3 + 2 ];

					positions[ vertexPosition++ ] = particlePositions[ j * 3     ];
					positions[ vertexPosition++ ] = particlePositions[ j * 3 + 1 ];
					positions[ vertexPosition++ ] = particlePositions[ j * 3 + 2 ];

					colors[ colorPosition++ ] = alpha;
					colors[ colorPosition++ ] = alpha;
					colors[ colorPosition++ ] = alpha;

					colors[ colorPosition++ ] = alpha;
					colors[ colorPosition++ ] = alpha;
					colors[ colorPosition++ ] = alpha;

					numConnected++;
				}
			}
		}

		linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
		linesMesh.geometry.attributes.position.needsUpdate = true;
		linesMesh.geometry.attributes.color.needsUpdate = true;
		pointCloud.geometry.attributes.position.needsUpdate = true;
	};

	this.changeValues = function(value) {
		var newColor = new THREE.Color();
		newColor.setHSL(value, 1, 0.63);
		linesMesh.material.color = newColor;
	};
};

function getPointInsideCircle(radius, yPos) {
    var dotAngle = Math.random() * 2 * Math.PI;
    var dotRadiusSq = Math.random() * radius * radius;
    var dotX = Math.sqrt(dotRadiusSq) * Math.cos(dotAngle);
    var dotZ = Math.sqrt(dotRadiusSq) * Math.sin(dotAngle);
    return [dotX, yPos, dotZ];
}
