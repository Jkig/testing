README.md:
# Try it out!
https://planetarium-eeb82.web.app

# The purpose:
The initial idea behind this was as a reference, as when I saw artists paint scenes that were very unrealistic, or in movies or something, it takes me out of the zone and I start thinking about the system.

With this tool, you can build basic systems, and get an idea about what different systems can look like, most importantly habitable ones.

If you select your own sun, then the mass slider adjusts the color, size, as well as temperature and luminosity, which in turn changes the size of the habitable zone

# Goals:
* I want to add the shader that allows for day/night cycles on earth, but its a little too slow for some machines so far.
* maybe have a few options for higher quality if your computer can handle it
* Adding new systems, such as binary and trinary stars
* Movement in the sun
* more planets, a third perspective, which can show a moon (or even something like the earth around a gas giant)
* new gas giants wouldn’t be that hard to make, choose a composition, run a fluid sim
* for extreme situations (small and close stars), there can be planets where day lengths are relative to year lengths, so conditionally add this in? Otherwise the extra calculation adds effectively no realism
* add in moons, so we could be "looking at" the planet and moon from a "spaceship"

# What its built with:
* React, Threejs (to work with webGL)
* vite
* firebase for hosting, it all actually runs on the client side

# Source for textures:
https://www.solarsystemscope.com/textures/