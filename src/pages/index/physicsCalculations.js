function colorTemperature2rgbUsingTH(kelvin) {
    var temperature = kelvin / 100;
    var red, green, blue;
    if (temperature <= 66) {
      red = 255;
    } else {
      red = temperature - 60;
      red = 329.698727446 * Math.pow(red, -0.1332047592);
      if (red < 0)
        red = 0;
      if (red > 255)
        red = 255;
    }
    if (temperature <= 66) {
      green = temperature;
      green = 99.4708025861 * Math.log(green) - 161.1195681661;
      if (green < 0)
        green = 0;
      if (green > 255)
        green = 255;
    } else {
      green = temperature - 60;
      green = 288.1221695283 * Math.pow(green, -0.0755148492);
      if (green < 0)
        green = 0;
      if (green > 255)
        green = 255;
    }
    if (temperature >= 66) {
      blue = 255;
    } else {
      if (temperature <= 19) {
        blue = 0;
      } else {
        blue = temperature - 10;
        blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
        if (blue < 0)
          blue = 0;
        if (blue > 255)
          blue = 255;
      }
    }
    return { red: Math.round(red), blue: Math.round(blue), green: Math.round(green) };
  };
  
  
  
  function SmallToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function toHex(obj) {
    const str = "#" + SmallToHex(obj.red) + SmallToHex(obj.green) + SmallToHex(obj.blue)
    return str.toUpperCase()
  }
  
  
  function starProperties(mass) {
    const solarMass = 1.9891e30; // Mass of the Sun in kg
    const solarLuminosity = 3.828e26; // Luminosity of the Sun in watts
    const solarRadius = 6.96e8; // Radius of the Sun in meters
  
  
    // Calculate the star's luminosity
    const luminosity = Math.pow(mass*solarMass, 3.5) * solarLuminosity / Math.pow(solarMass, 3.5);
  
    // Calculate the star's radius
    const radius = Math.pow(mass, 0.8) * solarRadius;
  
    // Calculate the star's surface temperature
    const surfaceTemperature = 34.41867194386953 * Math.pow((luminosity / (radius * radius)), 0.25);
  
    // Calculate the star's color in hex
    // bad code lol, lets try this package:
    const rgb = colorTemperature2rgbUsingTH(surfaceTemperature);
    const color = toHex(rgb)
    /*
    const red = Math.round(Math.min(255, Math.max(0, 255 * (surfaceTemperature - 2000) / 8000)));
    const green = Math.round(Math.min(255, Math.max(0, 255 * (surfaceTemperature - 5000) / 8000)));
    const blue = Math.round(Math.min(255, Math.max(0, 255 * (surfaceTemperature - 8000) / 8000)));
    const color = "#" + red.toString(16).padStart(2, "0") + green.toString(16).padStart(2, "0") + blue.toString(16).padStart(2, "0");
    */
  
    // Return an object with the star's properties
    return {
        luminosity: luminosity,
        radius: radius,
        color: color,
        surfaceTemperature: surfaceTemperature,
    };
  }
  
  function justLuminosity(mass) {
    const solarMass = 1.9891e30; // Mass of the Sun in kg
    const solarLuminosity = 3.828e26; // Luminosity of the Sun in watts
  
  
    // Calculate the star's luminosity
    return Math.pow(mass*solarMass, 3.5) * solarLuminosity / Math.pow(solarMass, 3.5);
  }

  export { starProperties, justLuminosity }