import * as THREE from './three.module.js';

//import { game } from "game.js";
//console.log(THREE.Scene)

// export default function(){
//     console.log(game)
// }
var scene    = new THREE.Scene(),
    camera   = new THREE.PerspectiveCamera(35,360/640,0.1,1000),
    renderer = new THREE.WebGLRenderer();
    //renderer.shadowMap.enabled = true;
    renderer.setSize(360,640);

//document.body.appendChild(renderer.domElement);

//灯光
var light = new THREE.SpotLight(0xffccff,1);//设置光源
light.position.set(15,15,35);

scene.add(light);// 追加光源到场景

var geo = new THREE.BoxGeometry(1,1,1);
var geometry = new THREE.CubeGeometry(1, 1, 1);
// 加载纹理贴

var texture = new THREE.TextureLoader().load("assets/images/tt1.jpg");
var material = new THREE.MeshLambertMaterial({map:texture});
var mat = new THREE.MeshBasicMaterial({color:0Xff0000});
var cube = new THREE.Mesh(geo,mat);
scene.add(cube);


camera.position.z = 10;
cube.castShadow = true;


function render(){
    // requestAnimationFrame(render);
    // cube.rotation.x +=0.01;
    // cube.rotation.y +=0.01;
    // cube.rotation.z +=0.01;
    //renderer.render(scene,camera);
}
render();

