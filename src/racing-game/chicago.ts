import * as Functions from '../globalfunctions'

@Component("trainlerpdata")
export class TrainLerpData {
  array: Vector3[]
  origin = 0
  target = 1
  fraction = 0
  constructor(path: Vector3[]) {
    this.array = path
  }
}

@Component("trainCarFlag")
export class TrainCarFlag { }

@Component("elevatorFlag")
export class ElevatorFlag { }

export let elevatorBtnParent: Entity
export let elevatorbutton: Entity
export let goingup: Entity

export function chicagoEnvironment(chicagoScene: Entity) { 

  const ground = new Entity()
  ground.setParent(chicagoScene)
  const snowfloorShape = new BoxShape()
  ground.addComponent(snowfloorShape)
  const groundTransform = new Transform({
    position: new Vector3(16, 0, 16),
    rotation: new Quaternion(0, 0, 0, 1),
    //rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(32, 0, 32)
  })
  ground.addComponent(groundTransform)
  const groundMaterial = new Material()
  //elevatormaterial.hasAlpha = false;
  const groundColor = Color3.FromHexString("#000000")
  groundMaterial.albedoColor = groundColor
  groundMaterial.metallic = 0.0
  groundMaterial.roughness = 1
  ground.addComponent(groundMaterial) 

  let roadstripesPosX = 0
  for(let x=0;x<14;x++) {
    Functions.addGroundColliderWithParent(9.6, 0, 0, 3+roadstripesPosX, 0.1, 0.01, 0.75, Color3.White(), chicagoScene) 
    roadstripesPosX+=2
  }
/*
  const carParent = new Entity()
  carParent.setParent(chicagoScene)
  const carParentTransform = new Transform({
    position: new Vector3(30.75,0,5.5),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(10,10,10)
  })
  carParent.addComponentOrReplace(carParentTransform) 

  const carBody = new Entity()
  carBody.addComponent(new GLTFShape('models/racing-game/chicago/BattleRacers/LuxCasing00R03.gltf'))
  carBody.setParent(carParent)
  const carFront = new Entity()
  carFront.addComponent(new GLTFShape('models/racing-game/chicago/BattleRacers/BeetleBumper00C02.gltf')) 
  carFront.setParent(carParent)
  const carRear = new Entity()
  carRear.addComponent(new GLTFShape('models/racing-game/chicago/BattleRacers/BeetleSpoiler01C03.gltf'))
  carRear.setParent(carParent)
  const carWheels = new Entity()
  carWheels.addComponent(new GLTFShape('models/racing-game/chicago/BattleRacers/BeetleWheel02C03.gltf'))
  carWheels.setParent(carParent)

  const carParent2 = new Entity()
  carParent2.setParent(chicagoScene)
  const carParent2Transform = new Transform({
    position: new Vector3(30.75,0,2),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(10,10,10)
  })

  carParent2.addComponentOrReplace(carParent2Transform) 
  const carBody2 = new Entity()
  carBody2.addComponent(new GLTFShape('models/racing-game/chicago/BattleRacers/LuxCasing00R02.gltf'))
  carBody2.setParent(carParent2)
  const carFront2 = new Entity()
  carFront2.addComponent(new GLTFShape('models/racing-game/chicago/BattleRacers/LuxBumper02C02.gltf')) 
  carFront2.setParent(carParent2)
  const carRear2 = new Entity()
  carRear2.addComponent(new GLTFShape('models/racing-game/chicago/BattleRacers/BeetleSpoiler00C05.gltf'))
  carRear2.setParent(carParent2)
  const carWheels2 = new Entity()
  carWheels2.addComponent(new GLTFShape('models/racing-game/chicago/BattleRacers/MuscleWheel02C02.gltf'))
  carWheels2.setParent(carParent2)

  const carParent2OpenSea = new Entity()
  const carParent2OpenSeaShape = new TextShape("https://opensea.io/bundles/sharp-one-of-a-kind-custom-zeta-hybrid-with-rare-1")

  carParent2OpenSea.addComponent(carParent2OpenSeaShape)
  const carParent2OpenSeaTransform = new Transform({
      rotation: Quaternion.Euler(0,-90,0),
      scale: new Vector3(0.01,0.01,0.01)
  })

  carParent2OpenSea.addComponent(carParent2OpenSeaTransform) 
  carParent2OpenSea.setParent(carParent2)
*/
  const michigan_ave = new Entity()
  michigan_ave.setParent(chicagoScene)
  //michigan_ave.addComponent(new GLTFShape('models/racing-game/chicago/buildings_optimized/buildings.gltf'))
  michigan_ave.addComponent(new GLTFShape('models/racing-game/chicago/Buildings_20.glb'))
  const michiganAveTransform = new Transform({
    position: new Vector3(6,0,8),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(0.05, 0.05, 0.05)
  })
  michigan_ave.addComponentOrReplace(michiganAveTransform) 

  const trainTrackCornerShape = new GLTFShape('models/racing-game/chicago/Track_1.glb')
  const trainTrackStraightShape = new GLTFShape('models/racing-game/chicago/Track_2.glb')

  const trackScale=0.29
  const trackMargin=0.3
  const numXParcels=1
  const numZParcels=2

  // behind the buildings ###

  const track1 = new Entity() //front left 1
  track1.setParent(chicagoScene)
  track1.addComponentOrReplace(trainTrackCornerShape)
  const trainTrackTransform1 = new Transform({
    //position: new Vector3(0+trackMargin,0,0+trackMargin),
  position: new Vector3(2.55+trackMargin,0,0+trackMargin),
  rotation: Quaternion.Euler(0,-270,0),
  scale: new Vector3(trackScale, trackScale,trackScale)
  })
  track1.addComponentOrReplace(trainTrackTransform1)

  const track3 = new Entity() //back left
  track3.setParent(chicagoScene)
  track3.addComponentOrReplace(trainTrackCornerShape)
  const trainTrackTransform3 = new Transform({
  //position: new Vector3(0+trackMargin,0,(16*numZParcels)-trackMargin),
    position: new Vector3(2.55+trackMargin,0,(16*numZParcels)-trackMargin),
  rotation: Quaternion.Euler(0,-180,0),
  scale: new Vector3(trackScale, trackScale,trackScale)
  })
  track3.addComponentOrReplace(trainTrackTransform3)

  // ###

  const track2 = new Entity() //front right
  track2.setParent(chicagoScene)
  track2.addComponentOrReplace(trainTrackCornerShape)
  const trainTrackTransform2 = new Transform({
  position: new Vector3((16*numXParcels)-trackMargin,0,0+trackMargin),
  rotation: Quaternion.Euler(0,0,0),
  scale: new Vector3(trackScale, trackScale,trackScale)
  })
  track2.addComponentOrReplace(trainTrackTransform2)

  const track4 = new Entity() //back right
  track4.setParent(chicagoScene)
  track4.addComponentOrReplace(trainTrackCornerShape)
  const trainTrackTransform4 = new Transform({
  position: new Vector3((16*numXParcels)-trackMargin,0,(16*numZParcels)-trackMargin),
  rotation: Quaternion.Euler(0,-90,0),
  scale: new Vector3(trackScale, trackScale,trackScale)
  })
  track4.addComponentOrReplace(trainTrackTransform4)

  const straightTrackScale=0.4

  // behind the buildings ###

  const track5 = new Entity() //left side
  track5.setParent(chicagoScene)

  track5.addComponentOrReplace(trainTrackStraightShape)
  const trainTrackTransform5 = new Transform({
    //position: new Vector3(0+trackMargin,0,7.6+trackMargin),
    position: new Vector3(2.55+trackMargin,0,7.6+trackMargin),
  rotation: Quaternion.Euler(0,90,0),
  scale: new Vector3(straightTrackScale,trackScale,trackScale)
  })
  track5.addComponentOrReplace(trainTrackTransform5)

  const track6 = new Entity() //left side
  track6.setParent(chicagoScene)

  track6.addComponentOrReplace(trainTrackStraightShape)
  const trainTrackTransform6 = new Transform({
  //position: new Vector3(0+trackMargin,0,15.6+trackMargin),
    position: new Vector3(2.55+trackMargin,0,15.6+trackMargin),
  rotation: Quaternion.Euler(0,90,0),
  scale: new Vector3(straightTrackScale, trackScale,trackScale)
  })
  track6.addComponentOrReplace(trainTrackTransform6)
  //engine.addEntity(track6)

  // ###

  const track7 = new Entity() //right side
  track7.setParent(chicagoScene)

  track7.addComponentOrReplace(trainTrackStraightShape)
  const trainTrackTransform7 = new Transform({
  position: new Vector3(16-trackMargin,0,15.8+trackMargin),
  rotation: Quaternion.Euler(0,-90,0),
  scale: new Vector3(straightTrackScale,trackScale,trackScale)
  })
  track7.addComponentOrReplace(trainTrackTransform7)

  const track8 = new Entity() //right side
  track8.setParent(chicagoScene)

  track8.addComponentOrReplace(trainTrackStraightShape)
  const trainTrackTransform8 = new Transform({
  position: new Vector3(16-trackMargin,0,23.8+trackMargin),
  rotation: Quaternion.Euler(0,-90,0),
  scale: new Vector3(straightTrackScale, trackScale,trackScale)
  })
  track8.addComponentOrReplace(trainTrackTransform8)

  const track9 = new Entity() //front extend right
  track9.setParent(chicagoScene)

  track9.addComponentOrReplace(trainTrackStraightShape)
  const trainTrackTransform9 = new Transform({
  position: new Vector3(20+trackMargin,0,0+trackMargin),
  rotation: Quaternion.Euler(0,0,0),
  scale: new Vector3(trackScale, trackScale,trackScale)
  })
  track9.addComponentOrReplace(trainTrackTransform9)

  const track10 = new Entity() //front extend right
  track10.setParent(chicagoScene)

  track10.addComponentOrReplace(trainTrackStraightShape)
  const trainTrackTransform10 = new Transform({
  position: new Vector3(25.1+trackMargin,0,0+trackMargin),
  rotation: Quaternion.Euler(0,0,0),
  scale: new Vector3(trackScale, trackScale,trackScale)
  })
  track10.addComponentOrReplace(trainTrackTransform10)
  engine.addEntity(track10)

  //the front corner by the restaurants ###

  const track11 = new Entity() //front right
  track11.setParent(chicagoScene)

  track11.addComponentOrReplace(trainTrackCornerShape)
  const trainTrackTransform11 = new Transform({
    //position: new Vector3((32*numXParcels)-trackMargin,0,0+trackMargin),
  position: new Vector3((29.5*numXParcels)-trackMargin,0,0+trackMargin),
  rotation: Quaternion.Euler(0,0,0),
  scale: new Vector3(trackScale, trackScale,trackScale)
  })
  track11.addComponentOrReplace(trainTrackTransform11)

  // ###

  //by the restaurants ###

  const track12 = new Entity() //right side 2
  track12.setParent(chicagoScene)

  track12.addComponentOrReplace(trainTrackStraightShape)
  const trainTrackTransform12 = new Transform({
    //position: new Vector3(32-trackMargin,1,15.8+trackMargin),
  position: new Vector3(29.5-trackMargin,0,15.8+trackMargin),
  rotation: Quaternion.Euler(0,-90,0),
  scale: new Vector3(straightTrackScale,trackScale,trackScale)
  })
  track12.addComponentOrReplace(trainTrackTransform12)

  const track13 = new Entity() //right side 2
  track13.setParent(chicagoScene)

  track13.addComponentOrReplace(trainTrackStraightShape)
  const trainTrackTransform13 = new Transform({
    //position: new Vector3(32-trackMargin,1,23.8+trackMargin),
  position: new Vector3(29.5-trackMargin,0,23.8+trackMargin),
  rotation: Quaternion.Euler(0,-90,0),
  scale: new Vector3(straightTrackScale, trackScale,trackScale)
  })
  track13.addComponentOrReplace(trainTrackTransform13)

  // ###
  // the back corner by the restaurants ###
  const track14 = new Entity() //back right
  track14.setParent(chicagoScene)

  track14.addComponentOrReplace(trainTrackCornerShape)
  const trainTrackTransform14 = new Transform({
    //position: new Vector3((32*numXParcels)-trackMargin,0,(16*numZParcels)-trackMargin),
    position: new Vector3((29.5*numXParcels)-trackMargin,0,(16*numZParcels)-trackMargin),
  rotation: Quaternion.Euler(0,-90,0),
  scale: new Vector3(trackScale, trackScale,trackScale)
  })
  track14.addComponentOrReplace(trainTrackTransform14)

  // ###

  const track15 = new Entity() //back extend right
  track15.setParent(chicagoScene)

  track15.addComponentOrReplace(trainTrackStraightShape)
  const trainTrackTransform15 = new Transform({
  position: new Vector3(20+trackMargin,0,31.13-trackMargin),
  rotation: Quaternion.Euler(0,0,0),
  scale: new Vector3(trackScale, trackScale,trackScale)
  })
  track15.addComponentOrReplace(trainTrackTransform15)

  const track16 = new Entity() //back extend right
  track16.setParent(chicagoScene)

  track16.addComponentOrReplace(trainTrackStraightShape)
  const trainTrackTransform16 = new Transform({
  position: new Vector3(25.1+trackMargin,0,31.13-trackMargin),
  rotation: Quaternion.Euler(0,0,0),
  scale: new Vector3(trackScale, trackScale,trackScale)
  })
  track16.addComponentOrReplace(trainTrackTransform16)



  const trainScale=0.3
  //const trainCar1StartX=9.2
  //const trainCar2StartX=5.6
  const trainCar1StartX=9.5
  const trainCar2StartX=5.9
  //const trainCar3StartX=2
  const trainMargin=0.33
  //const trainZ1 = 0.4+trainMargin
  const trainZ1 = 0.4+trainMargin
  //const trainX2 = 16-0.4-trainMargin
  const trainX2 = 16-0.4-trainMargin
  //const trainZ2 = 32-0.4-trainMargin
  const trainZ2 = 32-0.4-trainMargin
  //const trainX3 = 0.4+trainMargin
  const trainX3 = 2.9+trainMargin
  const trainCarRotation = 90

  //const trainShape = new GLTFShape('models/racing-game/chicago/train_optimized/train.gltf')
  const trainShape = new GLTFShape('models/racing-game/chicago/train/train.glb')



  const trainCar1 = new Entity()
  trainCar1.setParent(chicagoScene)

  trainCar1.addComponent(trainShape)
  const TransformTrainCar1 = new Transform({
    position: new Vector3(trainCar1StartX,0,trainZ1),
    rotation: Quaternion.Euler(0,trainCarRotation,0),
    scale: new Vector3(trainScale,trainScale,trainScale*0.9)
  })
  trainCar1.addComponent(TransformTrainCar1)

  trainCar1.addComponent(
        new OnPointerDown(() => {
          engine.addSystem(new TrainRide())
        })
      )

  const trainCar1Animator = new Animator();
  trainCar1.addComponent(trainCar1Animator);
  trainCar1.addComponent(new TrainLerpData([
    new Vector3(trainCar1StartX,0,trainZ1), 
    new Vector3(trainX2, 0, trainZ1),
    new Vector3(trainX2, 0, trainZ2),
    new Vector3(trainX3, 0, trainZ2),
    new Vector3(trainX3, 0, trainZ1),
    new Vector3(trainCar1StartX,0,trainZ1)
  ]))
  trainCar1.addComponent(new TrainCarFlag())

  const adXadj = 0
  const adYadj = 4.45
  const adZadj = -0.5

  Functions.addAd(468 / 60, 1.5, adXadj, adYadj, adZadj, 0, 90, 180, trainCar1, "x")

  const trainCar2 = new Entity()
  trainCar2.setParent(chicagoScene)
  trainCar2.addComponent(trainShape)
  const TransformTrainCar2 = new Transform({
    position: new Vector3(trainCar2StartX,0,trainZ1),
    rotation: Quaternion.Euler(0,trainCarRotation,0),
    scale: new Vector3(trainScale,trainScale,trainScale*0.9)
  })
  trainCar2.addComponent(TransformTrainCar2)
  const trainCar2Animator = new Animator();
  trainCar2.addComponent(trainCar2Animator);
  trainCar2.addComponent(new TrainLerpData([
    new Vector3(trainCar2StartX,0,trainZ1), 
    new Vector3(trainX2+16-2.5, 0, trainZ1),
    new Vector3(trainX2+16-2.5, 0, trainZ2),
    new Vector3(trainX3, 0, trainZ2),
    new Vector3(trainX3, 0, trainZ1),
    new Vector3(trainCar2StartX,0,trainZ1)
  ]))
  trainCar2.addComponent(new TrainCarFlag())
  Functions.addAd(468 / 60, 1.5, adXadj, adYadj, adZadj, 0, 90, 180, trainCar2, "x")

  const trainCarGroup = engine.getComponentGroup(TrainCarFlag)

  class TrainRide {
    update(dt: number) {
      let trainCarCounter = 0;
      const speedFactor=10
      for (const ent of trainCarGroup.entities){
        const transform = ent.getComponent(Transform)
        const path = ent.getComponent(TrainLerpData)
        if (path.fraction < 1) {
          if (trainCarCounter === 0) {
            path.fraction += dt/speedFactor //speed
            if(transform.position.x === trainCar1StartX && transform.position.z === trainZ1) {
            // transform.rotation.eulerAngles = new Vector3(0,trainCarRotation,0) //after the train reaches its destination and theres no next target, it turns sideways so this turns it back
            }
          } else if (trainCarCounter === 1) {
            if(path.target <2) {
              //transform.rotation.eulerAngles = new Vector3(0,trainCarRotation,0)
              path.fraction += dt/(speedFactor+(speedFactor/1.75)) 
            } else {
              path.fraction += dt/speedFactor //speed
            }
          } else {
            if(path.target <2) {
              //transform.rotation.eulerAngles = new Vector3(0,trainCarRotation,0)
              path.fraction += dt/(speedFactor*2) //speed
            } else { 
              path.fraction += dt/speedFactor //speed
            }
          }
          transform.position = Vector3.Lerp(
            path.array[path.origin],
            path.array[path.target],
            path.fraction
          ) 
        } else {
          path.origin = path.target
          path.target += 1

          if (path.target >= path.array.length) {
            path.target = 0
          }

          path.fraction = 0

          if(path.target <2 ) {
            if (trainCarCounter === 0) {
              transform.lookAt(new Vector3(trainX2, 0, trainZ1))
            //transform.lookAt(new Vector3(trainCar1StartX, 0, trainZ1))
          } else if (trainCarCounter === 1) {
            transform.lookAt(new Vector3(trainX2, 0, trainZ1))
            //transform.lookAt(new Vector3(trainCar2StartX, 0, trainZ1))
          } else {
            transform.lookAt(new Vector3(trainMargin, 0, trainZ1))
            //transform.lookAt(new Vector3(trainCar3StartX, 0, trainZ1))
          }

          } else {
            transform.lookAt(path.array[path.target]) 
          }

        }
        trainCarCounter += 1
      }
    }
  } 
  engine.addSystem(new TrainRide())


  //removing venues and screens code 572-777 didnt help FPS

  const soldierfield = new Entity()
  soldierfield.setParent(chicagoScene)
  //soldierfield.addComponent(new GLTFShape('models/racing-game/chicago/soldierfield_optimized/soldierfield.gltf'))
  soldierfield.addComponent(new GLTFShape('models/racing-game/chicago/Soldierfield_4.glb'))
  const soldierfieldTransform = new Transform({
    position: new Vector3(18.5,0.04,7),
    rotation: Quaternion.Euler(0,184,0),
    scale: new Vector3(0.03, 0.03, 0.025)
  })
  soldierfield.addComponentOrReplace(soldierfieldTransform) 

  //const playIconTexture = new Texture("models/racing-game/chicago/video_play_icon2.png")
  const playIconTexture1 = new Texture("models/racing-game/chicago/soldierfield_play_icon_jpg2.jpg")
  const playIconTexture2 = new Texture("models/racing-game/chicago/wrigleyfield_play_icon2.jpg")
  const playIconTexture3 = new Texture("models/racing-game/chicago/allstatearena_play_icon.jpg")
  const playIconTexture4 = new Texture("models/racing-game/chicago/fieldmuseum_play_icon.jpg")

  const myVideoClip1 = new VideoClip("https://dclhost.com/videos/SoldierField/SoldierField.m3u8")
  const myVideoTexture1 = new VideoTexture(myVideoClip1)
  const myMaterial1 = new Material()
  myMaterial1.metallic = 0
  myMaterial1.roughness = 1
  //myMaterial1.albedoTexture = myVideoTexture1
  myMaterial1.albedoTexture = playIconTexture1
  const screen1 = new Entity()
  screen1.setParent(chicagoScene)

  screen1.addComponent(new PlaneShape())
  screen1.addComponent(
    new Transform({
      position: new Vector3(16.5,2.25,7),
      rotation: Quaternion.Euler(0,90,0),
      scale: new Vector3(4,2,1)
    })
  )
  screen1.addComponent(myMaterial1)
  screen1.addComponent(
    new OnPointerDown(() => {
      if(myMaterial1.albedoTexture === playIconTexture1) {
        screen1.addComponentOrReplace(myMaterial1)
        myMaterial1.albedoTexture = myVideoTexture1
        screen2.addComponentOrReplace(myMaterial2)
        myMaterial2.albedoTexture = playIconTexture2
        screen3.addComponentOrReplace(myMaterial3)
        myMaterial3.albedoTexture = playIconTexture3
        screen4.addComponentOrReplace(myMaterial4)
        myMaterial4.albedoTexture = playIconTexture4
      } else {
        screen1.addComponentOrReplace(myMaterial1)
        myMaterial1.albedoTexture = playIconTexture1
      }
      myVideoTexture1.playing = !myVideoTexture1.playing
      myVideoTexture2.playing = false
      myVideoTexture3.playing = false
      myVideoTexture4.playing = false
    })
  )
  myVideoTexture1.playing = false

  const wrigleyfield = new Entity()
  wrigleyfield.setParent(chicagoScene)
  wrigleyfield.addComponent(new GLTFShape('models/racing-game/chicago/wrigleyfield.glb'))
  const wrigleyTransform = new Transform({
    position: new Vector3(20.5,0.02,12),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(0.03, 0.03, 0.03)
  })
  wrigleyfield.addComponentOrReplace(wrigleyTransform) 

  const myVideoClip2 = new VideoClip("https://dclhost.com/videos/WrigleyField/WrigleyField.m3u8")
  const myVideoTexture2 = new VideoTexture(myVideoClip2)
  const myMaterial2 = new Material()
  myMaterial2.metallic = 0
  myMaterial2.roughness = 1
  myMaterial2.albedoTexture = playIconTexture2
  const screen2 = new Entity()
  screen2.setParent(chicagoScene)
  screen2.addComponent(new PlaneShape())
  screen2.addComponent(
    new Transform({
      position: new Vector3(16.5,2.25,15),
      rotation: Quaternion.Euler(0,90,0),
      scale: new Vector3(4,2,1)
    })
  )
  screen2.addComponent(myMaterial2)
  screen2.addComponent(
    new OnPointerDown(() => {
      if(myMaterial2.albedoTexture === playIconTexture2) {
        screen1.addComponentOrReplace(myMaterial1)
        myMaterial1.albedoTexture = playIconTexture1
        screen2.addComponentOrReplace(myMaterial2)
        myMaterial2.albedoTexture = myVideoTexture2
        screen3.addComponentOrReplace(myMaterial3)
        myMaterial3.albedoTexture = playIconTexture3
        screen4.addComponentOrReplace(myMaterial4)
        myMaterial4.albedoTexture = playIconTexture4
      } else {
        screen2.addComponentOrReplace(myMaterial2)
        myMaterial2.albedoTexture = playIconTexture2
      }
      myVideoTexture1.playing = false
      myVideoTexture2.playing = !myVideoTexture2.playing
      myVideoTexture3.playing = false
      myVideoTexture4.playing = false
    })
  )
  myVideoTexture2.playing = false

  const allstatearena = new Entity()
  allstatearena.setParent(chicagoScene)
  allstatearena.addComponent(new GLTFShape('models/racing-game/chicago/allstate_arena.glb'))
  const allstatearenaTransform = new Transform({
    position: new Vector3(18.5,0,21.3),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(0.032, 0.032, 0.032)
  })
  allstatearena.addComponentOrReplace(allstatearenaTransform) 

  const myVideoClip3 = new VideoClip("https://dclhost.com/videos/AllstateArena/AllstateArena.m3u8")
  const myVideoTexture3 = new VideoTexture(myVideoClip3)
  const myMaterial3 = new Material()
  myMaterial3.metallic = 0
  myMaterial3.roughness = 1
  myMaterial3.albedoTexture = playIconTexture3
  const screen3 = new Entity()
  screen3.setParent(chicagoScene)
  screen3.addComponent(new PlaneShape())
  screen3.addComponent(
    new Transform({
      position: new Vector3(16.5,2.25,21.25),
      rotation: Quaternion.Euler(0,90,0),
      scale: new Vector3(4,2,1)
    })
  )
  screen3.addComponent(myMaterial3)
  screen3.addComponent(
    new OnPointerDown(() => {
      if(myMaterial3.albedoTexture === playIconTexture3) {
        screen1.addComponentOrReplace(myMaterial1)
        myMaterial1.albedoTexture = playIconTexture1
        screen2.addComponentOrReplace(myMaterial2)
        myMaterial2.albedoTexture = playIconTexture2
        screen3.addComponentOrReplace(myMaterial3)
        myMaterial3.albedoTexture = myVideoTexture3
        screen4.addComponentOrReplace(myMaterial4)
        myMaterial4.albedoTexture = playIconTexture4
      } else {
        screen3.addComponentOrReplace(myMaterial3)
        myMaterial3.albedoTexture = playIconTexture3
      }
      myVideoTexture1.playing = false
      myVideoTexture2.playing = false
      myVideoTexture3.playing = !myVideoTexture3.playing
      myVideoTexture4.playing = false
    })
  )
  myVideoTexture3.playing = false

  const fieldmuseum = new Entity()
  fieldmuseum.setParent(chicagoScene)
  fieldmuseum.addComponent(new GLTFShape('models/racing-game/chicago/fieldmuseum.glb'))
  const fieldmuseumTransform = new Transform({
    position: new Vector3(18.5,0,26.5),
    rotation: Quaternion.Euler(90,0,90),
    scale: new Vector3(0.025, 0.025, 0.025)
  })
  fieldmuseum.addComponentOrReplace(fieldmuseumTransform) 

  const myVideoClip4 = new VideoClip("https://dclhost.com/videos/FieldMuseum/FieldMuseum.m3u8")
  const myVideoTexture4 = new VideoTexture(myVideoClip4)
  const myMaterial4 = new Material()
  myMaterial4.metallic = 0
  myMaterial4.roughness = 1
  myMaterial4.albedoTexture = playIconTexture4
  const screen4 = new Entity()
  screen4.setParent(chicagoScene)
  screen4.addComponent(new PlaneShape())
  screen4.addComponent(
    new Transform({
      position: new Vector3(16.5,2.25,26.5),
      rotation: Quaternion.Euler(0,90,0),
      scale: new Vector3(4,2,1)
    })
  )
  screen4.addComponent(myMaterial4)
  screen4.addComponent(
    new OnPointerDown(() => {
      if(myMaterial4.albedoTexture === playIconTexture4) {
        screen1.addComponentOrReplace(myMaterial1)
        myMaterial1.albedoTexture = playIconTexture1
        screen2.addComponentOrReplace(myMaterial2)
        myMaterial2.albedoTexture = playIconTexture2
        screen3.addComponentOrReplace(myMaterial3)
        myMaterial3.albedoTexture = playIconTexture3
        screen4.addComponentOrReplace(myMaterial4)
        myMaterial4.albedoTexture = myVideoTexture4
      } else {
        screen4.addComponentOrReplace(myMaterial4)
        myMaterial4.albedoTexture = playIconTexture4
      }
      myVideoTexture1.playing = false
      myVideoTexture2.playing = false
      myVideoTexture3.playing = false
      myVideoTexture4.playing = !myVideoTexture4.playing
    })
  )
  myVideoTexture4.playing = false

  const elevatorGroup = engine.getComponentGroup(ElevatorFlag)

  function addElevator() {

    for(const entity of elevatorGroup.entities) {
      engine.removeEntity(entity)
    }

  const elevatorfloor = new Entity()
  elevatorfloor.setParent(chicagoScene)

  const elevatorfloorShape = new BoxShape()
  //elevatorfloorShape.withCollisions = true 
  elevatorfloor.addComponent(elevatorfloorShape) 

  const elevatorTransform = new Transform({
    position: new Vector3(13.3,0,27.8),
    rotation: Quaternion.Euler(0,0,0),
    scale: new Vector3(6,0.25,6)
  })
  elevatorfloor.addComponent(elevatorTransform) 
  const elevatormaterial = new Material()
  //elevatormaterial.hasAlpha = false;
  const elevatorcolor = Color3.FromHexString("#5f82b2")
  elevatormaterial.albedoColor = elevatorcolor
  elevatormaterial.metallic = 0.0
  elevatormaterial.roughness = 0.9
  elevatorfloor.addComponent(elevatormaterial) 
  elevatorfloor.addComponent(new ElevatorFlag())
  }

  class ElevatorMove implements ISystem {
    update() {
      for(const entity of elevatorGroup.entities) {
        const elevatortransform = entity.getComponent(Transform)
        const elevatordistance = Vector3.Up().scale(0.05)
        if (elevatortransform.position.y<16.5) {
          elevatortransform.translate(elevatordistance)
        }
      }
    }
  }

  engine.addSystem(new ElevatorMove())
  
  const clearMaterial = new BasicMaterial()
  clearMaterial.alphaTest = 2

  elevatorBtnParent = new Entity()
  const elevatorBtnParentScale = 0.5
  elevatorBtnParent.addComponent(new BoxShape())
  elevatorBtnParent.addComponent(new Transform({
    position: new Vector3(14.25, 1.5, 27.85),
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(elevatorBtnParentScale, elevatorBtnParentScale, elevatorBtnParentScale)
  }))
  elevatorBtnParent.addComponent(new OnPointerDown(() => {
    addElevator()
  }, {
    hoverText: "Go",
    distance: 5
  }))
  elevatorBtnParent.addComponent(clearMaterial)
  elevatorBtnParent.setParent(chicagoScene)

  elevatorbutton = new Entity()
  const elevatorbuttonScale = 2
  elevatorbutton.addComponent(new GLTFShape('models/racing-game/chicago/redbutton.glb'))
  const elevatorbuttonTransform = new Transform({
    position: new Vector3(0,0,0),
    rotation: Quaternion.Euler(-90,0,-90),
    scale: new Vector3(elevatorbuttonScale, elevatorbuttonScale, elevatorbuttonScale)
  })
  elevatorbutton.addComponent(elevatorbuttonTransform) 
  elevatorbutton.setParent(elevatorBtnParent)

  goingup = new Entity()
  const goingupShape = new TextShape("Going Up?")
  goingup.addComponent(goingupShape)
  const goingupTransform = new Transform({
    position: new Vector3(0,0,0.25),
    rotation: Quaternion.Euler(90,0,0),
    scale: new Vector3(0.1,0.1,0.1)
  })
  goingup.addComponent(goingupTransform) 
  goingup.setParent(elevatorbutton)

  const goinguparrow = new Entity()
  const goinguparrowShape = new TextShape("Go")

  goinguparrowShape.paddingBottom=0
  goinguparrow.addComponent(goinguparrowShape)
  const goinguparrowTransform = new Transform({
    position: new Vector3(0,0.05,0),
    rotation: Quaternion.Euler(90,90,90),
    scale: new Vector3(0.125, 0.125, 0.125)
  })
  goinguparrow.addComponent(goinguparrowTransform)
  goinguparrow.setParent(elevatorbutton)

  const mcdonalds = new Entity()
  mcdonalds.setParent(chicagoScene)
  mcdonalds.addComponent(new GLTFShape('models/racing-game/chicago/mcdonalds_optimized/mcdonalds.gltf'))
  const mcdonaldsTransform = new Transform({
    position: new Vector3(22.5,0.05,5.8),
    rotation: Quaternion.Euler(0,180,0),
    scale: new Vector3(0.19,0.2,0.2)
  })
  mcdonalds.addComponentOrReplace(mcdonaldsTransform) 

  const starbucks = new Entity()
  starbucks.setParent(chicagoScene)
  //starbucks.addComponent(new GLTFShape('models/racing-game/chicago/starbucks_optimized/starbucks.gltf'))
  starbucks.addComponent(new GLTFShape('models/racing-game/chicago/StarBucks_Building_6.glb'))
  const starbucksTransform = new Transform({
    position: new Vector3(26.5,0.6,7.3),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(0.2,0.2,0.2)
  })
  starbucks.addComponentOrReplace(starbucksTransform) 

  const subway = new Entity()
  subway.setParent(chicagoScene)
  //subway.addComponent(new GLTFShape('models/racing-game/chicago/subway_optimized/subway.gltf'))
  subway.addComponent(new GLTFShape('models/racing-game/chicago/Subway_Building_0.glb'))
  const subwayTransform = new Transform({
    position: new Vector3(25.5,0,10.8),
    rotation: Quaternion.Euler(0,-90,0),
    scale: new Vector3(0.25,0.25,0.2)
  })
  subway.addComponentOrReplace(subwayTransform) 

  const tacobell = new Entity()
  tacobell.setParent(chicagoScene)
  tacobell.addComponent(new GLTFShape('models/racing-game/chicago/tacobell.glb'))
  const tacobellTransform = new Transform({
    position: new Vector3(25.5,0,15),
    rotation: Quaternion.Euler(0,-90,0),
    scale: new Vector3(0.33,0.33,0.33)
  })
  tacobell.addComponentOrReplace(tacobellTransform) 

  const pizzahut = new Entity()
  pizzahut.setParent(chicagoScene)
  pizzahut.addComponent(new GLTFShape('models/racing-game/chicago/pizzahut.glb'))
  const pizzahutTransform = new Transform({
    position: new Vector3(25,0,18.5),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(0.15,0.15,0.15)
  })
  pizzahut.addComponentOrReplace(pizzahutTransform) 

  const portillos = new Entity()
  portillos.setParent(chicagoScene)
  portillos.addComponent(new GLTFShape('models/racing-game/chicago/portillos.glb'))
  const portillosTransform = new Transform({
    position: new Vector3(26,0,22.7),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(0.15,0.15,0.15)
  })
  portillos.addComponentOrReplace(portillosTransform) 

  const kfc = new Entity()
  kfc.setParent(chicagoScene)
  //kfc.addComponent(new GLTFShape('models/racing-game/chicago/kfc_optimized/kfc.gltf'))
  kfc.addComponent(new GLTFShape('models/racing-game/chicago/KFC2.glb'))
  const kfcTransform = new Transform({
    position: new Vector3(28,0,25),
    rotation: Quaternion.Euler(0,90,0),
    scale: new Vector3(0.25,0.25,0.25)
  })
  kfc.addComponentOrReplace(kfcTransform) 

} //function 