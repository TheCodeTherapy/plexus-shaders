function configureGUI() {

    var f0 = threeGUI.add(switchStats, 'enableStats');

    var f1  = threeGUI.addFolder('Shaders and PostProcess');

    f1.add(shadersParams, 'globalSwitch').listen();
    f1.add(shadersParams, 'effectFXAA').listen();
    f1.add(shadersParams, 'effectFilm').listen();
    f1.add(shadersParams, 'effectBloom').listen();
    f1.add(shadersParams, 'CRTPass').listen();
    f1.add(shadersParams, 'rgbShiftShader').listen();
    f1.add(shadersParams, 'staticPass').listen();
    f1.add(shadersParams, 'vignettePass').listen();
    f1.add(shadersParams, 'kaleidoShader').listen();
    f1.add(shadersParams, 'techniColor').listen();
    f1.add(shadersParams, 'sepiaShader').listen();
    var enableEvery = { EnableEverything:function() {
            shadersParams.globalSwitch = true;
            shadersParams.effectFXAA = true;
            shadersParams.effectFilm = true;
            shadersParams.effectBloom = true;
            shadersParams.CRTPass = true;
            shadersParams.rgbShiftShader = true;
            shadersParams.staticPass = true;
            shadersParams.vignettePass = true;
            shadersParams.techniColor = false;
            shadersParams.sepiaShader = true;
        }};
    var disableEvery = { DisableEverything:function() {
            shadersParams.globalSwitch = true;
            shadersParams.effectFXAA = false;
            shadersParams.effectFilm = false;
            shadersParams.effectBloom = false;
            shadersParams.CRTPass = false;
            shadersParams.rgbShiftShader = false;
            shadersParams.staticPass = false;
            shadersParams.vignettePass = false;
            shadersParams.kaleidoShader = false;
            shadersParams.techniColor = false;
            shadersParams.sepiaShader = false;
        }};

    f1.add(enableEvery, 'EnableEverything');
    f1.add(disableEvery, 'DisableEverything');

    var f2  = f1.addFolder('Film Params');
    var f3  = f1.addFolder('Bloom Params');
    var f4  = f1.addFolder('CRT Params');
    var f5  = f1.addFolder('RGBShift Params');
    var f6  = f1.addFolder('Static Params');
    var f7  = f1.addFolder('Vignette Params');
    var f8  = f1.addFolder('Technicolor Params');
    var f9 = f1.addFolder('Sepia Params');
    var f10 = f1.addFolder('Kaleido Params');

    f2.add(filmParams, 'noiseIntensity', 0.1, 1.5).step(0.01);
    f2.add(filmParams, 'scanLinesIntensity', 0.1, 1.5).step(0.01);
    f2.add(filmParams, 'scanLinesCount', height, height * 4).step(1);
    f2.add(filmParams, 'grayScale');

    f3.add(bloomParams, 'strength', 0.0, 2.0);

    f4.add(CRTParams, 'distortion1', 0.01, 9.0).step(0.01);
    f4.add(CRTParams, 'distortion2', 0.01, 9.0).step(0.01);
    f4.add(CRTParams, 'speed', 0.001, 0.210).step(0.01);
    f4.add(CRTParams, 'rollSpeed', -0.90, 0.90).step(0.01);

    f5.add(rgbShiftParams, 'amount', 0.0, 0.06);
    f5.add(rgbShiftParams, 'angle', 0.0, 3.0);

    f6.add(staticParams, 'amount', 0.0, 0.5).step(0.01);
    f6.add(staticParams, 'size', 1, 6).step(1);

    f7.add(vignetteParams, 'offset', 0.0, 1.0).step(0.01);
    f7.add(vignetteParams, 'darkness', 0.0, 1.0).step(0.01);

    f8.add(techniColorParams, 'amount', 0.0, 1.0).step(0.01);

    f9.add(sepiaParams, 'amount', 0.0, 1.0).step(0.01);

    f10.add(kaleidoParams, 'sides', 3.0, 32.0).step(1);
    f10.add(kaleidoParams, 'angle', 0.0, 6.0).step(0.01);

    var f11  = threeGUI.addFolder('Main Lights and Tone');

    f11.add(lightningParams, 'toneMapping', Object.keys((toneMappingTypes)));
    f11.add(lightningParams, 'hemiLightningPower', Object.keys(ambientIlluminance));
    f11.add(lightningParams, 'pointLightningPowerA', Object.keys(lmPerWat));
    f11.add(lightningParams, 'pointLightningPowerB', Object.keys(lampPower));
    f11.add(lightningParams, 'exposure', 0.0, 1.2).step(0.01);
    f11.add(lightningParams, 'hemiActive');
    f11.add(lightningParams, 'pointActive');
    f11.add(lightningParams, 'shadows');

    var f12 = threeGUI.addFolder('Plexus Particles');
    f12.add(plexusParams, 'enable');

    var f13 = threeGUI.addFolder('Dancing SpotLights');
    f13.add(dancingSpotLightsParams, 'enable');
    f13.add(dancingSpotLightsParams, 'helpers').listen();

    threeGUI.close();
}
