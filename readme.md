# LingSheng Xu

scene graph class should follow strandard

```js
//load stuff in constrcutor model, points
constructor(inputScene)

//make thit singulton
let instance = null;

//define priviate variable on top of the class

//setters and getters
 setIdealCameraLocation(camera) {
    camera.position.set(774, 67, -571)
}

isSceneReady(){
    return modelLoader.isSceneReady()
}

getPoints(){
    return points;
}
```