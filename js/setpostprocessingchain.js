function setPostProcessingChain() {
    composer    = new THREE.EffectComposer( renderer );
    renderPass  = new THREE.RenderPass( scene, camera );
    effectCopy  = new THREE.ShaderPass( THREE.CopyShader );
    effectFXAA  = new THREE.ShaderPass( THREE.FXAAShader );

    effectFXAA.uniforms[ 'resolution' ].value.set(1 / width, 1 / height);

    effectFilm  = new THREE.FilmPass(
        filmParams.noiseIntensity,
        filmParams.scanLinesIntensity,
        filmParams.scanLinesCount,
        filmParams.grayScale );

    effectBloom = new THREE.BloomPass(
        bloomParams.strength,
        bloomParams.kernelSize,
        bloomParams.sigma,
        bloomParams.resolution );

    CRTPass = new THREE.ShaderPass( THREE.CRTShader );
    CRTPass.uniforms[ 'time' ].value = CRTParams.time;
    CRTPass.uniforms[ 'distortion' ].value = CRTParams.distortion1;
    CRTPass.uniforms[ 'distortion2' ].value = CRTParams.distortion2;
    CRTPass.uniforms[ 'speed' ].value = CRTParams.speed;
    CRTPass.uniforms[ 'rollSpeed' ].value = CRTParams.rollSpeed;

    rgbShiftShader = new THREE.ShaderPass( THREE.RGBShiftShader );
    rgbShiftShader.uniforms[ 'amount' ].value = rgbShiftParams.amount;
    rgbShiftShader.uniforms[ 'angle' ].value = rgbShiftParams.angle;

    staticPass = new THREE.ShaderPass( THREE.StaticShader );
    staticPass.uniforms[ 'time' ].value = staticParams.time;
    staticPass.uniforms[ 'amount' ].value = staticParams.amount;
    staticPass.uniforms[ 'size' ].value = staticParams.size;

    vignettePass = new THREE.ShaderPass( THREE.VignetteShader );
    vignettePass.uniforms[ "offset" ].value = vignetteParams.offset;
    vignettePass.uniforms[ "darkness" ].value = vignetteParams.darkness;

    techniColor = new THREE.ShaderPass( THREE.TechnicolorShader );
    techniColor.uniforms[ 'amount' ].value = techniColorParams.amount;

    sepiaShader = new THREE.ShaderPass( THREE.SepiaShader );
    sepiaShader.uniforms[ "amount" ].value = sepiaParams.amount;

    kaleidoShader = new THREE.ShaderPass( THREE.KaleidoShader );
    kaleidoShader.uniforms[ "sides" ].value = kaleidoParams.sides;
    kaleidoShader.uniforms[ "angle" ].value = kaleidoParams.angle;

    effectFXAA.renderToScreen       = false;
    effectFilm.renderToScreen       = false;
    effectBloom.renderToScreen      = false;
    CRTPass.renderToScreen        = false;
    rgbShiftShader.renderToScreen   = false;
    staticPass.renderToScreen       = false;
    vignettePass.renderToScreen     = false;
    techniColor.renderToScreen      = false;
    sepiaShader.renderToScreen      = false;
    kaleidoShader.renderToScreen    = false;
    effectCopy.renderToScreen       = true;

    if (shadersParams.globalSwitch) {
        effectFXAA.enabled      = shadersParams.effectFXAA;
        effectFilm.enabled      = shadersParams.effectFilm;
        effectBloom.enabled     = shadersParams.effectBloom;
        CRTPass.enabled         = shadersParams.CRTPass;
        rgbShiftShader.enabled  = shadersParams.rgbShiftShader;
        staticPass.enabled      = shadersParams.staticPass;
        vignettePass.enabled    = shadersParams.vignettePass;
        techniColor.enabled     = shadersParams.techniColor;
        sepiaShader.enabled     = shadersParams.sepiaShader;
        kaleidoShader.enabled   = shadersParams.kaleidoShader;
    } else {
        effectFXAA.enabled      = false;
        effectFilm.enabled      = false;
        effectBloom.enabled     = false;
        CRTPass.enabled       = false;
        rgbShiftShader.enabled  = false;
        staticPass.enabled      = false;
        vignettePass.enabled    = false;
        techniColor.enabled     = false;
        sepiaShader.enabled     = false;
        kaleidoShader.enabled   = false;
    }

    composer.addPass( renderPass );
    composer.addPass( effectFXAA );
    composer.addPass( effectFilm );
    composer.addPass( effectBloom );
    composer.addPass( CRTPass );
    composer.addPass( rgbShiftShader );
    composer.addPass( staticPass );
    composer.addPass( vignettePass );
    composer.addPass( techniColor );
    composer.addPass( sepiaShader );
    composer.addPass( kaleidoShader );
    composer.addPass( effectCopy );
}
