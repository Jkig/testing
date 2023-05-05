import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';
import { useState } from 'react'

import earthScene from "./earthScene.json";
import basicScene from "./basicScene.json";

import {starProperties, justLuminosity} from "./physicsCalculations"


function App() {
    const [data, setData] = useState({
        ourSun: true,
        mass: 1,
        earth: false,
        distanceFromPlanet: 10,// in planet radii
        distanceFromSun: 1,// in AU
        closest: .75,
        furthest: 1.1,
        orbiting: false,
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

    const handleChangeDistance = e =>{
        setData({...data, distanceFromPlanet: Number(e.target.value)})
    }

    const handleChangeOrbit = e =>{
        setData({...data, orbiting: e.target.checked})
    }

    const handleCalculate = () =>{
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

        // if in sun, alert and force reload?? for now "no sun, you are in it"
        if (sceneObject.distanceFromSun <= sceneObject.sunSize){
            window.alert("You are in the sun, so it won't show up")
        }

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
                        <input type="range" min="10" max="200" className="slider" id="myRange" defaultValue={100} onChange={handleChangePlanetDistance}/>
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
                                <input type="checkbox" onClick={handleChangeOrbit}/>
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
}


ReactDOM.createRoot(document.getElementById('root')).render(<App />)
