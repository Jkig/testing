import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import { useState } from 'react'

// import earthScene from "./earthScene.json";
// import basicScene from "./basicScene.json";

const earthScene = {
  "planetFile": "/img/8k_earth_daymap.jpg",
  "planetMass": 5.972e24,
  "speed": 0.01,

  "isCameraOrbit": true,

  "ourSun": true,
  "isEarth": true,
  "sunColor": "#FFFFFF",

  "daylength": 86400,
  "yearlength": 3160000,
  "orbitLenght": 306000,

  "distanceFromSun": 149600000,
  "planetSize": 6378,
  "cameraOrbit": 67100,
  "sunSize": 1400000,

  "tilt": 0.4
}

const basicScene = {
  "planetFile": "/img/2k_jupiter.jpg",
  "planetMass": 1.899e27,
  "speed": 0.01,

  "isCameraOrbit": true,

  "ourSun": true,
  "isEarth": false,
  "sunColor": "#FFFFFF",

  "daylength": 35609,
  "yearlength": 374371200,
  "orbitLenght": 306000,

  "distanceFromSun": 714920000,
  "planetSize": 69911,
  "cameraOrbit": 671000,
  "sunSize": 1400000,

  "tilt": 0.05462881
}






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






function App() {
    const [data, setData] = useState({
        ourSun: true,
        mass: 1,
        earth: false,
        distanceFromPlanet: 10,// in planet radii
        distanceFromSun: 1,// in AU
        closest: .75,
        furthest: 1.1,
        orbiting: true,
        luminosity: 3.828e26,
    });

    const [display, setDisplay] = useState(false);

    const handleChangeMass = e => {
        // take a 1-100 and put trough exponential
        let massSM = null
        if (e.target.value == 50){
            setData({...data, mass: 1});
        }else{
            if (e.target.value < 50){
                massSM = e.target.value/50
            }else{
                massSM = (e.target.value-50)*4
            }
            let lumin = justLuminosity(massSM)

            setData({...data, mass: massSM, closest: Math.sqrt(lumin/(3.828e26))*.75, furthest: Math.sqrt(lumin/(3.828e26))*1.1});
        }
      };

    const handleChangeSun = e =>{
        setData({...data, ourSun: e.target.checked})
    }

    const handleChangePlanet = e =>{
        setData({...data, earth: e.target.checked})
        console.log("use earth", e.target.checked)
    }

    const handleChangePlanetDistance = e =>{
        let dist = null
        if (e.target.value == 100){
            setData({...data, distanceFromSun: 1});
        }else{
            if (e.target.value < 100){
                dist = e.target.value/100
            }else{
                dist = (e.target.value-99)
            }
            setData({...data, distanceFromSun: dist});
        }
    }
    // calculate, special case for sun.., iff 1 solar mas on slider, then set on calculate
    // orbit length calculated from orbits and junk ez (mass doesn't matter)
    // 1.496e8 // au to km,
    // useeffect to set some things
    // TODO useeffect to show things (earth radii, etc, re load things when needed)

    // store habitable zone in the local object, and use useeffect to update habitable zone
    const handleChangeDistance = e =>{
        setData({...data, distanceFromPlanet: Number(e.target.value)})
    }

    const handleChangeOrbit = e =>{
        setData({...data, orbiting: e.target.checked})
    }

    const handleCalculate = () =>{
        // should make this /\ cleaner
        // now create our json and store it
        let sceneObject = null
        // now set everything else
        if (data.earth){
            sceneObject = earthScene
            // earth constant:
            // console.log("earth", 2*Math.PI*Math.sqrt(1/(6.6743e-11*5.972e24))) // earth
            const earthGravitational = 3.147147566443759e-7;

            sceneObject.orbitLength = Math.sqrt(Math.pow(data.distanceFromPlanet*sceneObject.planetSize*1000, 3))*earthGravitational;
        }else{
            sceneObject = basicScene
            //  constant:
            // console.log("jupiter", 2*Math.PI*Math.sqrt(1/(6.6743e-11*1.899e27))) // jupiter
            const jupiterGravitational = 1.764877328242383e-8;
            // then multiply by sqrt(r^3), r = planetradius*distanceFromPlanet
            sceneObject.orbitLength = Math.sqrt(Math.pow(data.distanceFromPlanet*sceneObject.planetSize*1000, 3))*jupiterGravitational;
        }
        const starInfo = starProperties(data.mass);
        // ourSun t/f
        if (!data.ourSun){
        // sun properties (size/color)
            sceneObject.ourSun = false
            sceneObject.sunColor = starInfo.color
            sceneObject.sunSize = starInfo.radius/1000
        }
        // distance from sun
        sceneObject.distanceFromSun = 149600000*data.distanceFromSun;
        // distance from planet
        sceneObject.cameraOrbit = sceneObject.planetSize*data.distanceFromPlanet;
        // time for planet orbit (don't actually care about planets rn)
        // time for camera orbit -- handled in the if/else above
        // isCameraOrbit t/f
        sceneObject.isCameraOrbit = data.orbiting;
        // luminosity
        sceneObject.luminosity = starInfo.luminosity
        // now localstore
        localStorage.clear();
        localStorage.setItem("sceneData", JSON.stringify(sceneObject));
        setDisplay(true)
    }
    return (
        <div className='main'>
            <h1>Build the system</h1>
            <ul>
                <li>
                    <ul className='horizontal'>
                        <li className='horizontali'>Earth</li>
                        <li className='horizontali'>
                            <label className="container">
                                <input type="checkbox" onClick={handleChangePlanet}/>
                                <span className="checkmark"></span>
                            </label>
                        </li>
                    </ul>
                </li>

                <li>
                    <ul className='horizontal'>
                        <li className='horizontali'>Just use our sun!</li>
                        <li className='horizontali'>
                            <label className="container">
                                <input type="checkbox" defaultChecked="true" onClick={handleChangeSun}/>
                                <span className="checkmark"></span>
                            </label>
                        </li>
                    </ul>
                </li>

                {!data.ourSun && <li>
                    <div>Size of star</div>
                    <div className="slidecontainer">
                        <input type="range" min="4" max="100" className="slider" id="myRange" onChange={handleChangeMass}/>
                        {data.mass} Solar mass{(data.mass !== 1) && 'es'}
                    </div>
                </li>}

                <li>
                    <div className="slidecontainer">
                        <ul>
                            <li className='horizontali'>Distance from the sun:</li>
                            <li className='horizontali'>{data.distanceFromSun}AU</li>
                            <li className='horizontali'>Habitable from {Math.round(data.closest * 100) / 100} to {Math.round(data.furthest * 100) / 100}</li>
                        </ul>
                        <input type="range" min="1" max="200" className="slider" id="myRange" defaultValue={100} onChange={handleChangePlanetDistance}/>
                    </div>
                </li>
                <li>
                    <div>Distance from planet: {data.distanceFromPlanet} planet radii </div>
                    <div className="slidecontainer">
                        <input type="range" min="2" max="200" className="slider" id="myRange" onChange={handleChangeDistance}/>
                    </div>
                </li>
                <li>
                    <ul className='horizontal'>
                        <li className='horizontali'>Orbit automatically</li>
                        <li className='horizontali'>
                            <label className="container">
                                <input type="checkbox" defaultChecked="true" onClick={handleChangeOrbit}/>
                                <span className="checkmark"></span>
                            </label>
                        </li>
                    </ul>
                </li>
                <li>
                <button className="createButton" type="submit" onClick={handleCalculate}>
                    <a href="view.html" className="link">View your system!</a>
                    </button>
                </li>
            </ul>
            
        </div>
    )
    // probably have all this stuff in a form, then build json and make local storage of it
    // I used to have calculate and link seperate, pulling apart the star info means i can have it combined
}


ReactDOM.createRoot(document.getElementById('root')).render(<App />)
