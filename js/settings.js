var switchStats = {
    "enableStats" : true
};

var lmPerWat = {
    "Incandescent Bulb" : 15,
    "Halogen Lamp"      : 20,
    "Fluorescent Lamp"  : 60,
    "LED Lamp"          : 90
};

var lampPower = {
    "Off"   : 0,
    "0.1W"  : 0.1,
    "0.25W" : 0.25,
    "0.5W"  : 0.5,
    "1W"    : 1,
    "2W"    : 2,
    "4W"    : 4,
    "8W"    : 8,
    "10W"   : 10,
    "15W"   : 15,
    "20W"   : 20,
    "50W"   : 50,
    "100W"  : 100,
    "150W"  : 150,
    "200W"  : 200,
    "250W"  : 250,
    "300W"  : 300,
    "350W"  : 350,
    "500W"  : 500,
    "1000W" : 1000
};

var ambientIlluminance = {
    "0.0001 lx  | Moonless, overcast night sky (starlight)(MoonlessNight)"  : 0.0001,
    "0.002 lx   | Moonless clear night sky with airglow"                    : 0.002,
    "0.004 lx   | WaningCrescent Moon night sky with airglow"               : 0.004,
    "0.008 lx   | LastQuarter Moon night sky with airglow"                  : 0.008,
    "0.016 lx   | LastQuarter Moon night Clear sky with airglow"            : 0.016,
    "0.25 lx    | Waning Gibbous Moon night sky with airglow"               : 0.25,
    "0.5 lx     | Full Moon night sky with airglow"                         : 0.5,
    "3.4 lx     | Civil twilight under a clear sky"                         : 3.4,
    "35 lx      | Public areas with dark surroundings"                      : 35,
    "50 lx      | Family living room lights (Australia, 1998)"              : 50,
    "80 lx      | Office building hallway/toilet lighting"                  : 80,
    "100 lx     | Very dark overcast day"                                   : 100,
    "150 lx     | Train station platforms"                                  : 150,
    "350 lx     | Typical Office Room lightning"                            : 350,
    "400 lx     | Sunrise / Sunset on a clear day"                          : 400,
    "1000 lx    | TV Studio Lightning / Overcast day"                       : 1000,
    "18000 lx   | Full Daylight with Indirect Sun"                          : 18000,
    "50000 lx   | Direct Sunlight at midday"                                : 50000
};

var toneMappingTypes = {
    "None"          : THREE.NoToneMapping,
    "Linear"        : THREE.LinearToneMapping,
    "Reinhard"      : THREE.ReinhardToneMapping,
    "Uncharted2"    : THREE.Uncharted2ToneMapping,
    "Cineon"        : THREE.CineonToneMapping
};

var lightningParams = {
    toneMapping             : Object.keys(toneMappingTypes)[3],
    hemiLightningPower      : Object.keys(ambientIlluminance)[3],
    pointLightningPowerA    : Object.keys(lmPerWat)[0],
    pointLightningPowerB    : Object.keys(lampPower)[3],
    exposure                : 1.0,
    shadows                 : true,
    hemiActive              : true,
    pointActive             : true
};

var shadersParams = {
    globalSwitch        : true,
    effectFXAA          : false,
    effectFilm          : true,
    effectBloom         : true,
    CRTPass             : true,
    rgbShiftShader      : true,
    staticPass          : true,
    vignettePass        : true,
    techniColor         : false,
    sepiaShader         : false,
    kaleidoShader       : false
};

var filmParams = {
    noiseIntensity      : 0.50,
    scanLinesIntensity  : 0.21,
    scanLinesCount      : 2160,
    grayScale           : false
};

var bloomParams = {
    strength            : 0.6,
    kernelSize          : 25,
    sigma               : 4.0,
    resolution          : 256
};

var CRTParams = {
    time                : 0,
    distortion1         : 1.12,
    distortion2         : 0.21,
    speed               : 0.12,
    rollSpeed           : 0.00
};

var rgbShiftParams = {
    amount              : 0.0012,
    angle               : 1.7
};

var staticParams = {
    time                : 0,
    amount              : 0.08,
    size                : 1.0
};

var vignetteParams = {
    offset              : 0.6,
    darkness            : 0.6
};

var techniColorParams = {
    amount  : 0.3
};

var sepiaParams = {
    amount              : 0.21
};

var kaleidoParams = {
    sides               : 12.0,
    angle               : 0.0
};

var plexusParams = {
    enable : true
};

var dancingSpotLightsParams = {
    enable  : true,
    helpers : false
};
