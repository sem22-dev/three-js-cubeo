import * as THREE from "three";
import "./style.css"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { gsap } from "gsap";

//Scene
const scene = new THREE.Scene()


// Create our sphere
const cubeSize = 2;
const gap = 0.2;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  emissive: "#",
  roughness: 0.1,
  metalness: 0.20,
});

// Remove the first loop where you're creating the cubes

// Create a group for the first and third row
const firstRow = new THREE.Group();
const thirdRow = new THREE.Group();
scene.add(firstRow);
scene.add(thirdRow);

// Create the cubes and add them to the scene and the group if they're in the first or third row
for(let x = 0; x < 3; x++) {
  for(let y = 0; y < 3; y++) {
    for(let z = 0; z < 3; z++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        x * (cubeSize + gap) - (cubeSize + gap),
        y * (cubeSize + gap) - (cubeSize + gap),
        z * (cubeSize + gap) - (cubeSize + gap)
      );
      scene.add(mesh);

       // Create an edges geometry and pass in the mesh to create a border
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
      mesh.add(line); // add line to the mesh so it moves with the mesh


      // If this is the first or third row, add it to the group
      if(y === 0) {
        firstRow.add(mesh);
      } else if(y === 2) {
        thirdRow.add(mesh);
      }
    }

    //Light
const light = new THREE.PointLight(0xffffff, 90, 100)
light.position.set(0, 10, 10)
light.intensity = 40
scene.add(light)

// Create a spotlight at the top corner
const spotLightTop = new THREE.SpotLight(0xffffff);
spotLightTop.position.set(15, 20, 5); // Position the light
spotLightTop.intensity = 1; // Set the intensity of the light
spotLightTop.angle = Math.PI / 4; // Set the angle of the light
spotLightTop.penumbra = 0.1; // Set the penumbra of the light
spotLightTop.decay = 2; // Set the decay of the light
spotLightTop.distance = 200; // Set the maximum distance the light can reach
scene.add(spotLightTop);

// Create a spotlight at the bottom left corner
const spotLightBottomLeft = new THREE.SpotLight(0xffffff);
spotLightBottomLeft.position.set(-15, -20, -5); // Position the light
spotLightBottomLeft.intensity = 1; // Set the intensity of the light
spotLightBottomLeft.angle = Math.PI / 4; // Set the angle of the light
spotLightBottomLeft.penumbra = 0.1; // Set the penumbra of the light
spotLightBottomLeft.decay = 2; // Set the decay of the light
spotLightBottomLeft.distance = 200; // Set the maximum distance the light can reach
scene.add(spotLightBottomLeft);
  }
  
}

// Wait for 2 seconds before starting the animation
setTimeout(() => {
  [firstRow, thirdRow].forEach(row => {
    gsap.to(row.rotation, {
      y: "+=2*Math.PI", // Rotate 360 degrees
      duration: 4, // Over 20 seconds
      ease: "power1.inOut", // Easing function
      repeat: 1, // Repeat the animation once
      yoyo: true, // Reverse the animation on repeat
    });
  });
}, 1500);




//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//Light
const light = new THREE.PointLight(0xffffff, 90, 100)
light.position.set(0, 10, 10)
light.intensity = 40
scene.add(light)



//Camera
const camera = new THREE.PerspectiveCamera(
  40, 
  sizes.width / sizes.height, 
  0.1, 
  100)
camera.position.z = 20
scene.add(camera)

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2)
renderer.render(scene, camera);

//COntrols
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 2

// Create an animation loop
const animate = function () {
  requestAnimationFrame(animate);

  // Rotate the scene around multiple axes
  scene.rotation.x += 0.01;
  scene.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();

//Resize
window.addEventListener("resize", () => {
  //update sizes
  console.log(window.innerWidth)
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //update Camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//Timeline magiccc
const tl = gsap.timeline({ defaults: {duration: 1} })
tl.fromTo(mesh.scale, { z: 0, x: 0, y:0 }, { z: 1, x: 1, y: 1})
tl.fromTo("nav", { y: "-100%" }, { y: "0%" })
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 })

//Mouse Animation colorr
let mouseDown = false
let rgb = []
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))

window.addEventListener("mousemove", (e) => {
  if(mouseDown) {
    rgb = [
      Math.round(e.pageX / sizes.width) * 255,
      Math.round((e.pageY / sizes.width) * 255,
      150,
    )]
    console.log(rgb)

    // lets animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    })
  }
})





