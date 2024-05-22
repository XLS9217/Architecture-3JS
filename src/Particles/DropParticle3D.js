import * as THREE from 'three'
import { gsap } from 'gsap'
import DropFragment from '../Shaders/FragmentShaders/DropParticle_Fragment.glsl'
import DropVertex from '../Shaders/VertexShaders/DropParticle_Vertex.glsl'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'
/*
use it's own shader to achieve the dropping effect of rain or snow
xz base at 0,y,0
destroy handle at scene manager
*/


export default class DropParticle3D{
    /**
     * type can be 'snow' 'rain' 'volcano'
     */
    constructor(amount, size, speed, type, ceil, floor, width, depth, timeUniform, resolutionUnifrom){
        this.amount = amount
        this.size = size
        this.speed = speed
        this.type = type
        this.ceil = ceil
        this.floor = floor
        this.width = width
        this.depth = depth
        this.timeUniform = timeUniform
        this.resolutionUnifrom = resolutionUnifrom

        this.windDirectionUniform = new THREE.Uniform(new THREE.Vector2(0.0,0.0)) // no wind by default
        this.windStrengthUniform = new THREE.Uniform(0.0) // no wind by default

        this.geometry = null
        this.material = null
        this.particles = null
    }

    getParticles(){
        if(this.particles){
            return this.particles
        }else{
            this.particles = this.generate()
            return this.particles
        }
    }


    changeWindDirection(direction) {
        let targetValue = new THREE.Vector2();
    
        if (direction === 'N') {
            targetValue.set(0.0, -1.0); // -z direction
        } else if (direction === 'S') {
            targetValue.set(0.0, 1.0); // +z direction
        } else if (direction === 'W') {
            targetValue.set(-1.0, 0.0); // -x direction
        } else if (direction === 'E') {
            targetValue.set(1.0, 0.0); // +x direction
        } else if (direction === 'NW') {
            targetValue.set(-Math.SQRT1_2, -Math.SQRT1_2); // -x, -z direction
        } else if (direction === 'NE') {
            targetValue.set(Math.SQRT1_2, -Math.SQRT1_2); // +x, -z direction
        } else if (direction === 'SW') {
            targetValue.set(-Math.SQRT1_2, Math.SQRT1_2); // -x, +z direction
        } else if (direction === 'SE') {
            targetValue.set(Math.SQRT1_2, Math.SQRT1_2); // +x, +z direction
        } else if (direction === 'Off') {
            targetValue.set(0.0, 0.0); // No wind
        }
    
        gsap.to(this.windDirectionUniform.value, {
            duration: 4.0,
            x: targetValue.x,
            y: targetValue.y,
            ease: "sin.inOut"
        });
    }

    changeWindStrength(strength){
        let changeSpeed = 2.0
        gsap.to(
            this.windStrengthUniform,
            {
                duration: changeSpeed,
                value: strength,
                delay: changeSpeed
            }
        )
    }

    //return the generated particle
    generate(){
        const positionsArray = new Float32Array(this.amount * 3)
        const sizesArray = new Float32Array(this.amount)
        const speedArray = new Float32Array(this.amount)

        for(let i=0; i<this.amount; i++){
            const i3 = i * 3;
    
            positionsArray[i3    ] = - this.width + Math.random() * this.width * 2
            positionsArray[i3 + 1] = this.ceil
            positionsArray[i3 + 2] = - this.depth + Math.random() * this.depth * 2
    
            sizesArray[i] = Math.random() * 0.5 + 0.5

            speedArray[i] = Math.random() * this.speed
        }

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3))
        this.geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray,1))
        this.geometry.setAttribute('aSpeed', new THREE.Float32BufferAttribute(speedArray,1))

 

        this.material = new THREE.ShaderMaterial({
            vertexShader: DropVertex,
            fragmentShader: DropFragment,
            uniforms: {
                uResolution: this.resolutionUnifrom,
                uTime: this.timeUniform,
                uSize: new THREE.Uniform(this.size),
                uCeil: new THREE.Uniform(this.ceil),
                uFloor: new THREE.Uniform(this.floor),
                uWindDirection: this.windDirectionUniform,
                uWindStrength: this.windStrengthUniform
            },
            depthWrite:false,
            blending: THREE.AdditiveBlending
        })
        
        //material = new THREE.PointsMaterial()
        const firework = new THREE.Points(this.geometry, this.material)
        firework.renderOrder = 999

        const cube = new THREE.Mesh(new THREE.BoxGeometry(10,10,10), new THREE.MeshBasicMaterial({ color: 0xffffff}))
        cube.position.set(0,100,0)
        return firework
    }

    deconstruct(){
        if(this.geometry) this.geometry.dispose()
        if(this.material) this.material.dispose()
    }




}