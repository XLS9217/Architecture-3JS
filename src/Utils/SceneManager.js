import * as THREE from 'three'

let instance = null
let scene = null
let camera = null
const raycaster = new THREE.Raycaster()

export default class SceneManager{
    constructor(inputScene, inputCamera){
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this 

        scene = inputScene
        camera = inputCamera
        this.currentGraph = null
    }

    LoadGraph(sceneGraph){
        //clear the scene and add a new graph
        scene.clear();
        this.currentGraph = sceneGraph
        this.currentGraph.loadScene()
        this.currentGraph.setIdealCameraLocation(camera)
    }

    Update2DTagVisibility(sizes){
        
        let minimunPointDistance = 400  

        if(this.currentGraph.isSceneReady())
        {
            
            // Go through each tag
            for(const tag of this.currentGraph.getTags())
            {

                const screenPosition = tag.position.clone()
                screenPosition.project(camera)

                // Set the raycaster
                raycaster.setFromCamera(screenPosition, camera)
                const intersects = raycaster.intersectObjects(scene.children, true)
                //console.log(intersects)

                
                const pointDistance = tag.position.distanceTo(camera.position)
                const distanceRatio = (minimunPointDistance-pointDistance) / minimunPointDistance
                const opacity = 1-Math.cos((distanceRatio+0.5) * Math.PI/2)
                //console.log(opacity)

                // No intersect found
                if(intersects.length === 0)
                {
                    // Show
                    tag.unhide(opacity)
                }
                else
                {
                    // Get the distance of the intersection and the distance of the point
                    const intersectionDistance = intersects[0].distance

                    // Intersection is close than the point
                    if(intersectionDistance < pointDistance || pointDistance > minimunPointDistance)
                    {
                        // Hide
                        tag.hide()
                        //console.log("hide")
                    }
                    // Intersection is further than the point
                    else
                    {
                        // Show
                        tag.unhide(opacity)
                    }
                }
            }




            // Go through each point
            for(const point of this.currentGraph.getPoints())
            {
                // Get 2D screen position
                const screenPosition = point.position.clone()
                screenPosition.project(camera)
        
                // Set the raycaster
                raycaster.setFromCamera(screenPosition, camera)
                const intersects = raycaster.intersectObjects(scene.children, true)
        
                // No intersect found
                if(intersects.length === 0)
                {
                    // Show
                    point.element.classList.add('visible')
                }

                // Intersect found
                else
                {
                    // Get the distance of the intersection and the distance of the point
                    const intersectionDistance = intersects[0].distance
                    const pointDistance = point.position.distanceTo(camera.position)
        
                    // Intersection is close than the point
                    if(intersectionDistance < pointDistance || pointDistance > minimunPointDistance)
                    {
                        // Hide
                        point.element.classList.remove('visible')
                    }
                    // Intersection is further than the point
                    else
                    {
                        // Show
                        point.element.classList.add('visible')
                    }
                }
        
                const translateX = screenPosition.x * sizes.width * 0.5
                const translateY = - screenPosition.y * sizes.height * 0.5
                point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
            }
        }
    }
}