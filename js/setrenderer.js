function setRenderer() {
    var sceneRenderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    sceneRenderer.setClearColor(0x000000, 0.0);
    sceneRenderer.setPixelRatio( window.devicePixelRatio );
    sceneRenderer.setSize( width, height );
    sceneRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    sceneRenderer.shadowMap.enabled = true;
    sceneRenderer.toneMapping = toneMappingTypes[lightningParams.toneMapping];
    sceneRenderer.gammaInput = true;
    sceneRenderer.gammaOutput = true;
    sceneRenderer.autoClear = false;

    previousTonemap = sceneRenderer.toneMapping;
    previousExposure = Math.pow(lightningParams.exposure, 5.0);

    return sceneRenderer;
}
