let canvas;
let omega_earth, omega_moon;
let earth, sun, moon;
let centerX, centerY;
let earthOrbitRadius = 100;
let moonOrbitRadius = 40;
let hrs = 0,
  hrCounter = 0;
let moonShadowX, moonShadowY = 150 + 16;


let maxsun = 0
let minsun = -1000

let t = 0
let stars_t = 0
let stars = []
let earthOrbit = []
let state = 1
let th = 0.02

let timeSlider, timeStep = 0.25,
  prevTimeStepSliderVal = 0.25;
let playPauseButton;

// preloading images
function preload() {
  sun = loadImage("assets/sun.png");
  earth = loadImage("assets/earth.png");
  moon = loadImage("assets/moon.png");
  cloud = loadImage("assets/cloud.png");
  buildings = loadImage("assets/buildings.png");
  buildingsInv = loadImage("assets/buildings-inverted.png");
}

function setup() {
  canvas = createCanvas(700, 480);
  canvas.parent('sketch-container');

  centerX = canvas.width / 4;
  centerY = canvas.height / 2 + 50;
  omega_earth = 2 * PI / 365.25;
  omega_moon = 2 * PI / 27.3

  centerX2 = 3 * canvas.width / 4;
  centerY2 = 3 * canvas.height / 4 + 50;
  omega_sun2 = 2 * PI / 365.25 * 24.6;

  // dotted elliptical earth orbit
  for (let i = 0; i <= 720; i += 5) {
    let theta = i / PI
    let earth_orbit_x = earthOrbitRadius * cos(theta) + centerX
    let earth_orbit_y = (earthOrbitRadius + 30) * sin(theta) + centerY
    earthOrbit.push([earth_orbit_x, earth_orbit_y]);
  }

  // slider for shifting days
  timeSlider = createSlider(0, 365.25, 0);
  timeSlider.position(canvas.width / 4, 42);
  timeSlider.style('width', String(canvas.width / 2) + 'px');
  timeSlider.id("time-slider")

  // slider for changing time step
  timeStepSlider = createSlider(0, 16, 3);
  timeStepSlider.position(canvas.width / 4, 68);
  timeStepSlider.style('width', String(canvas.width / 2) + 'px');
  timeStepSlider.id("time-step-slider")

  // button for play pause
  playPauseButton = createButton('Pause');
  playPauseButton.position(3 * canvas.width / 4 + 10, 66);
  playPauseButton.style('width', '60px')
  playPauseButton.style('height', '20px')
  playPauseButton.style('border-radius', '5px')
  playPauseButton.style('background-color', 'rgb(180, 50, 50)')
  playPauseButton.style('border', '0px')
  playPauseButton.style('color', 'white')
  playPauseButton.style('font-size', '10px')
}

function pauseMotion() {
  if (state == 1) {
    state = 0
    playPauseButton.elt.innerHTML = "Play";
    playPauseButton.style('background-color', 'rgb(50, 150, 50)');
    prevTimeStepSliderVal = timeStepSlider.value();
    timeStepSlider.value(0)
  }
}

function playMotion() {
  if (state == 0) {
    state = 1
    playPauseButton.elt.innerHTML = "Pause";
    playPauseButton.style('background-color', 'rgb(180, 50, 50)')
    timeStepSlider.value(prevTimeStepSliderVal)
  }
}

function draw() {
  // setup
  background(0);

  fill(255);
  noStroke();

  //heading
  let heading1 = text("Sun-Moon-Earth Visualization by Darshna Kopal", canvas.width / 4 + 35, 10, canvas.width, 80);
  fill(180)
  let heading2 = text("Scroll below the canvas for more information.", canvas.width / 4 + 46, 25, canvas.width, 80);
  
  fill(255)
  // marker for number of days
  text(String(timeSlider.value()) + " days", 3 * canvas.width / 4 + 22, 45, 70, 80);

  // label for time
  text("Time", canvas.width / 8 - 10, 45, 70, 80);

  // label for time step
  text("Time Step", canvas.width / 8 - 10, 71, 70, 80);

  strokeWeight(1)
  stroke('white');

  // play-pause function
  playPauseButton.mousePressed(() => {
    if (timeStep != 0) {
      pauseMotion();

    } else {
      playMotion();

    }
  });

  // drawing earth orbit 
  earthOrbit.forEach((pnt) => {
    point(pnt[0], pnt[1]);
  });

  // earth coordinates
  let earthX = earthOrbitRadius * cos(omega_earth * t) + centerX
  let earthY = (earthOrbitRadius + 30) * sin(omega_earth * t) + centerY

  let image_earthX = earthX - earth.width / 24
  let image_earthY = earthY - earth.height / 24

  // moon coordinates
  let moonX = moonOrbitRadius * cos(omega_moon * t) + earthX
  let moonY = moonOrbitRadius * sin(omega_moon * t) + earthY

  let image_moonX = moonX - moon.width / 60
  let image_moonY = moonY - moon.height / 60

  // finding random stars
  if (stars_t == 40) {
    stars = []
    for (let i = 0; i < 100; i++) {
      let x = int(random(canvas.width))
      let y = int(random(100, canvas.height))

      stars.push([x, y])
    }
    stars_t = 0;
  }

  stars_t += 1

  // drawing the stars
  stroke('rgba(255,255,255,0.4)')
  stars.forEach((star) => {
    point(star[0], star[1]);
  });

  // event listner for changing time value acc to time slider
  document.getElementById("time-slider").addEventListener("input", () => {
    t = timeSlider.value()
  });

  // setting value of time slider to match current time
  timeSlider.value(t % 365);

  // setting time step acc to time step slider
  timeStep = timeStepSlider.value() / 500

  strokeWeight(2)
  fill(0)
  triangle(centerX, centerY, earthX, earthY, moonX, moonY)

  // sun, earth, moon
  if (dist(centerX, centerY, earthX, earthY) +
    dist(earthX, earthY, moonX, moonY) -
    dist(centerX, centerY, moonX, moonY) < th) {
    strokeWeight(4)
    stroke(255, 127, 127)
    fill(0)
    triangle(centerX, centerY, earthX, earthY, moonX, moonY)
  }

  // sun, moon, earth
  else if (dist(centerX, centerY, moonX, moonY) +
    dist(earthX, earthY, moonX, moonY) -
    dist(centerX, centerY, earthX, earthY) < th) {
    strokeWeight(4)
    stroke(255, 127, 127)
    fill(0)
    triangle(centerX, centerY, earthX, earthY, moonX, moonY)
  }

  // displaying sun, earth, moon
  image(sun, centerX - sun.width / 16, centerY - sun.height / 16, sun.width / 8, sun.height / 8);
  image(earth, image_earthX, image_earthY, earth.width / 12, earth.height / 12);
  image(moon, image_moonX, image_moonY, moon.width / 30, moon.height / 30);

  // code for day-night visualisation

  // painting sky according to time of day
  let coeffR, coeffG, coeffB;

  if (hrs >= 0 && hrs < 16) {
    coeffR = 0.2
    coeffG = 0.6
    coeffB = 0.9
  } else {
    coeffR = 0.4
    coeffG = 0.6
    coeffB = 0.9
  }

  let skyR = int(min(coeffR * (abs((24 - hrs) / 24 * 255)), 255))
  let skyG = int(min(coeffG * (abs((24 - hrs) / 24 * 255)), 255))
  let skyB = int(min(coeffB * (abs((24 - hrs) / 24 * 255)), 255))
  skyColor = 'rgb(' + String(skyR) + ',' + String(skyG) + ',' + String(skyB) + ')'
  fill(skyColor);
  noStroke();
  rect(canvas.width / 2, 100, canvas.width, canvas.height - 100)

  // coordinates of sun in elliptical motion
  let sunX2 = 50 * cos(omega_sun2 * 15 * t) + centerX2
  let sunY2 = -200 * sin(omega_sun2 * 15 * t) + centerY2

  let image_sunX2 = sunX2 - sun.width / 12
  let image_sunY2 = sunY2 - sun.height / 12

  // drawing sun
  image(sun, image_sunX2, image_sunY2, sun.width / 6, sun.height / 6);

  // calculating moon shadow position
  vectorSE = createVector(earthX - centerX, earthY - centerY)
  vectorME = createVector(moonX - earthX, moonY - earthY)
  angleSEM = degrees(vectorSE.angleBetween(vectorME))

  moonShadowX = int((angleSEM / abs(angleSEM)) * (1 - abs(angleSEM) / 180) * 32)

  if (moonShadowX == 0) {
    fill(255);
    noStroke();
    text("New Moon Day!", canvas.width / 4 - 40, canvas.height - 40, 200, 80);
  } else if (moonShadowX == 31) {
    fill(255);
    noStroke();
    text("Full Moon Day!", canvas.width / 4 - 40, canvas.height - 40, 200, 80);
  }

  // drawing moon
  if (hrs > 8) {
    image(moon, 4.5 * canvas.width / 5, 150, moon.width / 20, moon.height / 20);
    fill(skyColor)
    circle(4.5 * canvas.width / 5 + 16 + moonShadowX, moonShadowY, 32);
  }
  
  // updating hours wrt position of sun
  hrs = int(sunY2 / 400 * 24) - 12

  // drawing buildings
  if (hrs < 8)
    image(buildingsInv, canvas.width / 2, canvas.height - buildings.height / 2, buildings.width / 2, buildings.height / 2);

  else {
    image(buildings, canvas.width / 2, canvas.height - buildings.height / 2, buildings.width / 2, buildings.height / 2);
    stroke('rgba(255,255,255,0.2)')
    stars.forEach((star) => {
      point(star[0], star[1]);
    });
  }

  // clouds
  image(cloud, canvas.width / 2 + 50, 150, 100, 50)
  image(cloud, 3 * canvas.width / 4, 250, 100, 55)
  image(cloud, canvas.width / 2 + 10, 300, 100, 40)

  // section dividers
  strokeWeight(4)
  stroke(150, 150, 150)
  line(0, 100, canvas.width, 100)
  line(canvas.width / 2, 100, canvas.width / 2, canvas.height)
  
  // updating time value
  t += timeStep
}