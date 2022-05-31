// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

import * as THREE from 'three'
import { useGLRenderer} from './fxhash-libs/three-utils/RendererUtils'
import {line_defaults, makeLineTo, makeStroke, renderAsGLLines, renderAsMeshLine, strokeCircleAt} from './fxhash-libs/three-utils/LineUtils'
import { createAgentSystem } from './fxhash-libs/three-utils/Agent'
import {COLORS, PALETTES} from './fxhash-libs/three-utils/Colors'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { Group } from 'three'
import { randomChoiceFromArray, randRange } from './fxhash-libs/three-utils/FxUtils'

let camera, scene, renderer,material,controls,composer
let resize_functions = []
let update_functions = []
let render_functions = []
let prev_positions = []
// note about the fxrand() function 
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//start_position : new THREE.Vector3(0.0,0.0, 10.0),
let options = {
    camera : 
    {
        start_position : new THREE.Vector3(0.0,-0.0, 10.0),
        path : null,
        position : 0.0,
        speed : .0004,
        useControls : true
        //speed:0.01

    },
    color:
    {
        usePaletteOveride : true,
        palette : PALETTES.KIND_OF_BLUE
    }
}

const get_palette = () => {

    // if we aren't using the paletteOveride
    if(options.color.usePaletteOveride === false)
    {
        let [key,data] = utils.randomChoiceFromObject(PALETTES)
        options.color.palette = data
        console.log(key)
    }

}

const line_config = {
    ...line_defaults, useJitter : 0
}

const m1  = (o1,x,y) => {
    const start = new THREE.Vector3(0.0, 0.0, 0.0)
    const end = new THREE.Vector3(1.0, 1.0, 0.0)
    
    let final = new THREE.Group()
    let stroke_size = .01
    let step_size = .2
    for(var row = 0; row < 20 ; row++)
    {
        for(var col = 0; col < 20; col++)
        {
            start.set(o1.x + col * step_size, o1.y + row * step_size, o1.z)
            end.set(start.x + (x +   Math.sin(col / 20)), start.y +y , o1.z)
            makeLineTo(start,end,line_config).then( (res) => { 
                let [pts, colors] = res
                renderAsGLLines(pts,colors).then((group) => {
                    final.add(group)
                })
        
            })
        }

    }
       scene.add(final)
 
}

const m2  = (o1,x,y,max_row,max_col) => {
    const start = new THREE.Vector3(0.0, 0.0, 0.0)
    const end = new THREE.Vector3(1.0, 1.0, 0.0)
    
    let final = new THREE.Group()
    let stroke_size = .01
    let step_size = .2
    for(var row = 0; row < max_row ; row++)
    {
        for(var col = 0; col < max_col; col++)
        {
            start.set(o1.x + col * step_size, o1.y + row * step_size, o1.z)
            end.set(start.x + x, start.y +y , o1.z)
            makeLineTo(start,end,line_config).then( (res) => { 
                let [pts, colors] = res
                renderAsGLLines(pts,colors).then((group) => {
                    final.add(group)
                })
        
            })
        }

    }
       scene.add(final)
 
}
const make_art = () => {
    console.log("GO")
    get_palette()
    
    let o1 = new THREE.Vector3(-2.0, -2.0, 0.0)
    m1(o1, .02, 0)
    m1(o1,0, .2)
    let o2 = new THREE.Vector3(-1.5, -2.0, 0.0)
    m1(o2, .1, 0)
    m1(o2,0, .2)   
    let o3 = new THREE.Vector3(-10.0, .0, -1.0)
    m2(o3,.09, 0,100,100)   
    let o4 = new THREE.Vector3(-10.0, -10.0, -1.0)
    m2(o4,.03, 0,100,100)   }

const build_scene = () => {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(COLORS.BLACK);
    scene.fog = new THREE.Fog( 0x000000, 1, 20000 );
}

const create_camera = (w,h) => {

    camera = new THREE.PerspectiveCamera(60,w/h, .1,200000)
    camera.position.copy(options.camera.start_position)
    // easy orbiting
    // const initialPoints = [
	// 				new THREE.Vector3(10,2,-10),
	// 				new THREE.Vector3(10,2,10),
	// 				new THREE.Vector3(-10,2,10),
	// 				new THREE.Vector3(-10,2,-10)
	// 			];

    // const curve = new THREE.CatmullRomCurve3(initialPoints)
    // curve.curveType = 'centripetal'
    // curve.closed = true
    // options.camera.path = curve
    // curve.getPoints(50)

    if(options.camera.useControls)
    {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.45;

    }

}

const onWindowResize = () => {

				const width = window.innerWidth;
				const height = window.innerHeight;
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize( width, height );
                for(var r = 0; r < resize_functions.length; r++)
                {
                    resize_functions[r]();
                }




        render()

}

const init_three = (three_container) => {
    return new Promise((resolve, reject) => {

     build_scene()
     get_palette()
      make_art();

      build_lights();
      buildRenderer(three_container).then((r) => {
        renderer = r
        create_camera(window.innerWidth, window.innerHeight);

        window.addEventListener( 'resize', onWindowResize );
        window.addEventListener('keydown', () => {console.log(camera.position, camera)})

        render()
        resolve()
      })
    })
}
const init = () => 
{
  let three_container = document.createElement("div")
  three_container.classList.add('three-container')
  document.body.prepend(three_container)
  init_three(three_container).then(
      () => {
          animate()
      }
  )

}
const update_controls = () => {

    controls.update()

}


const animate = (now) => {

    now *= 0.001

    
    options.camera.useControls && update_controls()
    
    update_functions.length ? update_functions.map((func) => func(now)) : ''
    render_functions.length ? render_functions.map((func) => func(now)) : ''
    //  camera.rotateZ(Math.PI / 2.0)
    //  camera.rotateX(.3)
    requestAnimationFrame(animate)
    render()
}

const render = () => {

    renderer.render(scene,camera)
}


const buildRenderer = (domEl) => {
    return new Promise((resolve, reject) => {
        useGLRenderer(domEl).then((renderer) => {
            resolve(renderer)
        })

    })
  }
  const build_lights = () => {
     const light1 = new THREE.SpotLight(0xffffff, 1,1, Math.PI / 8, 1,1 );
    scene.add(light1)
    light1.position.set(0.0, 0.0, 100.0)
    let lightHelper1 = new THREE.SpotLightHelper( light1);
    let lightTarget = new THREE.Object3D()
    light1.target = lightTarget
    scene.add(lightTarget)
    //scene.add(lightHelper1)
    lightTarget.position.set(70.0,0.0, -600)
    const light2 = new THREE.HemisphereLight( 0xffffff, 0x000088, .5 );
				light2.position.set( - 1, 1.5, 1 );
				scene.add( light2 );

}

window.onload = init