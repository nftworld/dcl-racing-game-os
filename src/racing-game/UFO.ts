@Component("ufoLightsFlag")
export class UFOLightsFlag {}

@Component("ufoRingFlag")
export class UFORingFlag {}

@Component("policeLightsFlag1")
export class PoliceLightsFlag1 {}

@Component("policeLightsFlag2")
export class PoliceLightsFlag2 {}

@Component("policeLightsFlag3")
export class PoliceLightsFlag3 {}

export function ufoEnvironment(UFOscene: Entity) { 
  const ground = new Entity()
  ground.setParent(UFOscene)
  const gltfShape = new GLTFShape('models/racing-game/UFO/FloorBaseGrass_01/FloorBaseGrass_01.glb')
  ground.addComponentOrReplace(gltfShape)
  const groundTransform = new Transform({
    position: new Vector3(16, 0, 16),
    rotation: new Quaternion(0, 0, 0, 1),
    scale: new Vector3(2, 1, 2)
  })

  ground.addComponentOrReplace(groundTransform)

  const UFOscale = 7.7

  const UFO = new Entity() 
  UFO.setParent(UFOscene)
  // UFO.addComponent(new GLTFShape('models/racing-game/UFO/UFO.glb'))
  UFO.addComponent(new GLTFShape('models/racing-game/UFO/UFO_no_collider.glb'))
  const UFOTransform = new Transform({
    //position: new Vector3(0, 9, 20),
    //rotation: Quaternion.Euler(80, -90, 0), 
    position: new Vector3(8, 5, 20.8),
    rotation: Quaternion.Euler(20, 0, -60),
    scale: new Vector3(UFOscale, UFOscale, UFOscale)
  })
  UFO.addComponentOrReplace(UFOTransform)

  const craterScale = 2
  const crater = new Entity()
  crater.setParent(UFOscene)
  // crater.addComponent(new GLTFShape('models/racing-game/UFO/crater.glb'))
  crater.addComponent(new GLTFShape('models/racing-game/UFO/crater_no_collider.glb'))
  crater.addComponent(new Transform({
    position: new Vector3(10.50, 0, 20),
    rotation: Quaternion.Euler(0, 90, 0),
    scale: new Vector3(craterScale, craterScale, craterScale)
  }))

  /*
  const craterScale = 5
  const caterOrigW = 470
  const craterOrigH = 215
  const craterWidthRatio = caterOrigW / craterOrigH
  const crater = new Entity()
  crater.setParent(UFOscene)
  const craterShape = new ConeShape()
  crater.addComponent(craterShape)
  const craterMaterial = new Material()
  const craterTexture = new Texture("images/crater.jpg")
  craterMaterial.albedoTexture = craterTexture
  craterMaterial.metallic = 0
  craterMaterial.roughness = 1
  crater.addComponent(craterMaterial)
  crater.addComponent(new Transform({
    position: new Vector3(8, 0.02, 20.8), 
    rotation: Quaternion.Euler(90, 180, 90),
    scale: new Vector3(craterScale * craterWidthRatio, craterScale, craterScale)
  })) 
  */

  /*
  //Police Cars
  const policeScale = 1

  const police = new Entity()
  police.setParent(UFOscene)
  police.addComponent(new GLTFShape('models/racing-game/UFO/police.glb'))
  const policeTransform = new Transform({
    position: new Vector3(19, 0, 20),
    rotation: Quaternion.Euler(0, -90, 0),
    scale: new Vector3(policeScale, policeScale, policeScale) 
  })
  police.addComponentOrReplace(policeTransform)

  //Police Lights
  const policeLightParent1 = new Entity()
  policeLightParent1.setParent(police)
  policeLightParent1.addComponent(new Transform({
    position: new Vector3(0, 0, 0),
    rotation: Quaternion.Euler(0, 0, 0) 
  }))

  const policeLightsMaterial1 = new Material()  
  const policeLightsMaterial2 = new Material() 
  const policeLightsMaterial3 = new Material() 
  const policeLightsScale = 0.65
  let policeLightPosAdj = 0

  for (let i=0;i<=6;i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent1)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.45 + policeLightPosAdj, 1.525, -0.4),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))
    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1()) 
    }

    policeLightPosAdj +=0.21
  }

  const policeLightParent2 = new Entity() 
  policeLightParent2.setParent(police)
  policeLightParent2.addComponent(new Transform({
    position: new Vector3(3.1, -0.02, -0.06),
    rotation: Quaternion.Euler(0, 0, 0)
  }))

  policeLightPosAdj = 0

  for (let i = 0; i <= 6; i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent2)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.5 + policeLightPosAdj, 1.55, -0.35),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))
    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }

    policeLightPosAdj += 0.21
  }

  const policeLightParent3 = new Entity()
  policeLightParent3.setParent(police)
  policeLightParent3.addComponent(new Transform({
    position: new Vector3(-3, -0.03, -7.45),
    rotation: Quaternion.Euler(0, 0, 0)
  }))

  policeLightPosAdj = 0

  for (let i = 0; i <= 6; i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent3)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.5 + policeLightPosAdj, 1.55, -0.25),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))

    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }

    policeLightPosAdj += 0.21
  }

  const policeLightParent4 = new Entity()
  policeLightParent4.setParent(police)
  policeLightParent4.addComponent(new Transform({
    position: new Vector3(0.0125, -0.03, -7.45),
    rotation: Quaternion.Euler(0, 0, 0)
  }))

  policeLightPosAdj = 0

  //the SUV is wider so it has more lights
  for (let i = 0; i <= 6; i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent4)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.45 + policeLightPosAdj, 1.55, -0.25),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))

    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 7) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 8) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())  
    }

    policeLightPosAdj += 0.21
  }
  */

  //Police Cars
  const policeScale = 1

  const police = new Entity()
  police.setParent(UFOscene)
  police.addComponent(new GLTFShape('models/racing-game/UFO/police2_no_collider.glb'))
  const policeTransform = new Transform({
    position: new Vector3(19, 0, 20),
    rotation: Quaternion.Euler(0, -90, 0),
    scale: new Vector3(policeScale, policeScale, policeScale)
  })
  police.addComponentOrReplace(policeTransform)

  //Police Lights
  const policeLightParent1 = new Entity()
  policeLightParent1.setParent(police)
  policeLightParent1.addComponent(new Transform({
    position: new Vector3(0, 0, 0),
    rotation: Quaternion.Euler(0, 0, 0)
  }))

  const policeLightsMaterial1 = new Material()
  const policeLightsMaterial2 = new Material()
  const policeLightsMaterial3 = new Material()
  const policeLightsScale = 0.65
  let policeLightPosXAdj = 0

  for (let i = 0; i <= 6; i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent1)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.45 + policeLightPosXAdj, 1.525, -0.4),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))
    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }

    policeLightPosXAdj += 0.21
  }

  const policeLightParent2 = new Entity()
  policeLightParent2.setParent(police)
  policeLightParent2.addComponent(new Transform({
    position: new Vector3(3.1, -0.02, -0.06),
    rotation: Quaternion.Euler(0, 0, 0)
  }))

  policeLightPosXAdj = 0

  for (let i = 0; i <= 6; i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent2)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.5 + policeLightPosXAdj, 1.55, -0.35),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))
    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }

    policeLightPosXAdj += 0.21
  }

  const policeLightParent5 = new Entity()
  policeLightParent5.setParent(police)
  policeLightParent5.addComponent(new Transform({
    position: new Vector3(0, 0, 0),
    rotation: Quaternion.Euler(0, 0, 0)
  }))

  policeLightPosXAdj = -2.9

  for (let i = 0; i <= 6; i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent5)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.45 + policeLightPosXAdj, 1.525, -0.4),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))
    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }

    policeLightPosXAdj += 0.21
  }

  const policeLightParent6 = new Entity()
  policeLightParent6.setParent(police)
  policeLightParent6.addComponent(new Transform({
    position: new Vector3(3.1, -0.02, -0.06),
    rotation: Quaternion.Euler(0, 0, 0)
  }))

  policeLightPosXAdj = -8.8

  for (let i = 0; i <= 6; i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent6)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.5 + policeLightPosXAdj, 1.55, -0.35),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))
    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }

    policeLightPosXAdj += 0.21
  }

  const policeLights3and4PosZAdj = 1.35

  const policeLightParent3 = new Entity()
  policeLightParent3.setParent(police)
  policeLightParent3.addComponent(new Transform({
    position: new Vector3(-3, -0.03, -7.45),
    rotation: Quaternion.Euler(0, 0, 0)
  }))

  policeLightPosXAdj = 0.2

  for (let i = 0; i <= 6; i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent3)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.5 + policeLightPosXAdj, 1.55, -0.25 + policeLights3and4PosZAdj),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))

    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }

    policeLightPosXAdj += 0.21
  }

  const policeLightParent4 = new Entity()
  policeLightParent4.setParent(police)
  policeLightParent4.addComponent(new Transform({
    position: new Vector3(0.0125, -0.03, -7.45),
    rotation: Quaternion.Euler(0, 0, 0)
  }))

  policeLightPosXAdj = 0

  //the SUV is wider so it has more lights
  for (let i = 0; i <= 6; i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent4)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.45 + policeLightPosXAdj, 1.55, -0.25 + policeLights3and4PosZAdj),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))

    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 7) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 8) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }

    policeLightPosXAdj += 0.21
  }

  const policeLightParent7 = new Entity()
  policeLightParent7.setParent(police)
  policeLightParent7.addComponent(new Transform({
    position: new Vector3(-3, -0.03, -7.45),
    rotation: Quaternion.Euler(0, 0, 0)
  }))

  policeLightPosXAdj = -2.7

  for (let i = 0; i <= 6; i++) {
    const policeLight = new Entity()
    policeLight.setParent(policeLightParent7)
    policeLight.addComponent(new BoxShape())
    policeLight.getComponent(BoxShape).withCollisions = false
    policeLight.addComponent(new Transform({
      position: new Vector3(-0.5 + policeLightPosXAdj, 1.55, -0.25 + policeLights3and4PosZAdj),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(policeLightsScale / 3, policeLightsScale / 6, policeLightsScale / 2)
    }))

    if (i === 0) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 1) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 2) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 3) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }
    if (i === 4) {
      policeLight.addComponent(policeLightsMaterial3)
      policeLight.addComponent(new PoliceLightsFlag3())
    }
    if (i === 5) {
      policeLight.addComponent(policeLightsMaterial1)
      policeLight.addComponent(new PoliceLightsFlag1())
    }
    if (i === 6) {
      policeLight.addComponent(policeLightsMaterial2)
      policeLight.addComponent(new PoliceLightsFlag2())
    }

    policeLightPosXAdj += 0.21
  }

  const militaryVehicleScaleAdj = 0.75
 
  const militaryVehicle1Scale = 4.75 * militaryVehicleScaleAdj
  const militaryVehiclePosXAdj = 4

  const militaryVehicle1 = new Entity()
  militaryVehicle1.setParent(UFOscene)
  militaryVehicle1.addComponent(new GLTFShape('models/racing-game/UFO/warp_a2_no_collider.glb')) 
  const militaryVehicle1Transform = new Transform({
    position: new Vector3(11 - militaryVehiclePosXAdj, 0, 6.75), //higher z moves it closer to police cars, higher x moves it further away from the UFO
    rotation: Quaternion.Euler(0, 180, 0),
    scale: new Vector3(militaryVehicle1Scale, militaryVehicle1Scale, militaryVehicle1Scale)
  })
  militaryVehicle1.addComponentOrReplace(militaryVehicle1Transform)

  const militaryVehicle2Scale = 4 * militaryVehicleScaleAdj

  const militaryVehicle2 = new Entity()
  militaryVehicle2.setParent(UFOscene)
  militaryVehicle2.addComponent(new GLTFShape('models/racing-game/UFO/armored_tank_no_collider.glb'))
  const militaryVehicle2Transform = new Transform({
    position: new Vector3(16 - militaryVehiclePosXAdj, 0, 6.5), //higher z moves it closer to police cars, higher x moves it further away from the UFO
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(militaryVehicle2Scale, militaryVehicle2Scale, militaryVehicle2Scale)
  })
  militaryVehicle2.addComponentOrReplace(militaryVehicle2Transform) 

  const militaryVehicle3Scale = 3 * militaryVehicleScaleAdj

  const militaryVehicle3 = new Entity()
  militaryVehicle3.setParent(UFOscene)
  militaryVehicle3.addComponent(new GLTFShape('models/racing-game/UFO/armored_vehicle_no_collider.glb')) 
  const militaryVehicle3Transform = new Transform({
    position: new Vector3(21 - militaryVehiclePosXAdj, 0.5, 6), //higher z moves it closer to police cars, higher x moves it further away from the UFO
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(militaryVehicle3Scale, militaryVehicle3Scale, militaryVehicle3Scale)
  })
  militaryVehicle3.addComponentOrReplace(militaryVehicle3Transform)

  //UFO blinking lights 
  const UFOLightsMaterial = new Material()
  const UFOLightsScale = 0.09

  const UFOLight1 = new Entity()
  UFOLight1.setParent(UFO)
  UFOLight1.addComponent(new SphereShape())
  UFOLight1.getComponent(SphereShape).withCollisions = false
  UFOLight1.addComponent(new Transform({
    position: new Vector3(-0.685, 0.1229, -0.395),
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(UFOLightsScale, UFOLightsScale, UFOLightsScale)  
  }))
  UFOLight1.addComponent(UFOLightsMaterial)
  UFOLight1.addComponent(new UFOLightsFlag()) 

  const UFOLight2 = new Entity()
  UFOLight2.setParent(UFO)
  UFOLight2.addComponent(new SphereShape())
  UFOLight2.getComponent(SphereShape).withCollisions = false
  UFOLight2.addComponent(new Transform({
    position: new Vector3(0, 0.1229, 0.79), 
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(UFOLightsScale, UFOLightsScale, UFOLightsScale)
  }))
  UFOLight2.addComponent(UFOLightsMaterial)
  UFOLight2.addComponent(new UFOLightsFlag()) 

  const UFOLight3 = new Entity()
  UFOLight3.setParent(UFO)
  UFOLight3.addComponent(new SphereShape())
  UFOLight3.getComponent(SphereShape).withCollisions = false
  UFOLight3.addComponent(new Transform({
    position: new Vector3(0.685, 0.1229, -0.395),
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(UFOLightsScale, UFOLightsScale, UFOLightsScale)
  }))
  UFOLight3.addComponent(UFOLightsMaterial)
  UFOLight3.addComponent(new UFOLightsFlag()) 

  const UFORingMaterial = new Material()
  const UFORingScale = 1.1

  const UFORing = new Entity()
  UFORing.setParent(UFO)
  UFORing.addComponent(new SphereShape())
  // UFORing.getComponent(SphereShape).withCollisions = true
  UFORing.getComponent(SphereShape).withCollisions = false
  UFORing.addComponent(new Transform({
    position: new Vector3(0, 0.055, 0),
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(UFORingScale, UFORingScale / 18, UFORingScale)
  }))
  UFORing.addComponent(UFORingMaterial)
  UFORing.addComponent(new UFORingFlag()) 



  //const UFOLightsColors: any[] = [Color3.Blue(), Color3.Black()] 
  //new Color3(0.5, 0, 0.5)
  const UFOLightsColors: any[] = [Color3.FromHexString("#0ee8f1"), Color3.FromHexString("#00f5ff") ,Color3.Black()] 
  const UFORingColors: any[] = [Color3.FromHexString("#0ee8f1"), Color3.FromHexString("#00f5ff"), Color3.Magenta()]  
  const policeLightsColors1: any[] = [Color3.White(), Color3.Blue(), Color3.Red()] 
  const policeLightsColors2: any[] = [Color3.Blue(), Color3.Red(), Color3.White()] 
  const policeLightsColors3: any[] = [Color3.Red(), Color3.White(), Color3.Blue()]   
  
  let currentColorIndexLights = 0
  let nextColorIndexLights = 1
  let colorRatioLights = 0

  let currentColorIndexRing = 0
  let nextColorIndexRing = 1
  let colorRatioRing = 0

  let currentColorIndexPolice = 0
  let nextColorIndexPolice = 1
  let colorRatioPolice = 0

  class Lights {
    UFOLightsGroup = engine.getComponentGroup(UFOLightsFlag)
    UFORingGroup = engine.getComponentGroup(UFORingFlag)
    policeLightsGroup1 = engine.getComponentGroup(PoliceLightsFlag1)
    policeLightsGroup2 = engine.getComponentGroup(PoliceLightsFlag2)
    policeLightsGroup3 = engine.getComponentGroup(PoliceLightsFlag3)

    update() {
      //UFO Lights
      for (const entity of this.UFOLightsGroup.entities) {
        const UFOLightsMaterial = entity.getComponent(Material)
        UFOLightsMaterial.albedoColor = Color3.Lerp(UFOLightsColors[currentColorIndexLights], UFOLightsColors[nextColorIndexLights], colorRatioLights)
        if (colorRatioLights < 1) {
          colorRatioLights += 0.075 //this has to get smaller as number of entities gets larger
        } else {
          colorRatioLights = 0
          currentColorIndexLights++
          if (currentColorIndexLights > UFOLightsColors.length - 1) {
            currentColorIndexLights = 0
          }
          nextColorIndexLights++
          if (nextColorIndexLights > UFOLightsColors.length - 1) {
            nextColorIndexLights = 0
          }
        }
      }

      //UFO Ring
      for (const entity of this.UFORingGroup.entities) { 
        const UFORingMaterial = entity.getComponent(Material)
        UFORingMaterial.albedoColor = Color3.Lerp(UFORingColors[currentColorIndexRing], UFORingColors[nextColorIndexRing], colorRatioRing)
        if (colorRatioRing < 1) {
          colorRatioRing += 0.075 //this has to get smaller as number of entities gets larger
        } else {
          colorRatioRing = 0
          currentColorIndexRing++
          if (currentColorIndexRing > UFORingColors.length - 1) {
            currentColorIndexRing = 0
          }
          nextColorIndexRing++
          if (nextColorIndexRing > UFORingColors.length - 1) {
            nextColorIndexRing = 0
          }
        }
      }


        //Police Lights 1
        for (const entity of this.policeLightsGroup1.entities) {
          const policeLightsMaterial1 = entity.getComponent(Material)
          policeLightsMaterial1.albedoColor = Color3.Lerp(policeLightsColors1[currentColorIndexPolice], policeLightsColors1[nextColorIndexPolice], colorRatioPolice)
          if (colorRatioPolice < 1) {
            colorRatioPolice += 0.0075 //this has to get smaller as number of entities gets larger
          } else {
            colorRatioPolice = 0
            currentColorIndexPolice++
            if (currentColorIndexPolice > policeLightsColors1.length - 1) {
              currentColorIndexPolice = 0
            }
            nextColorIndexPolice++
            if (nextColorIndexPolice > policeLightsColors1.length - 1) {
              nextColorIndexPolice = 0
            }
          }
        }

      //Police Lights 2
      for (const entity of this.policeLightsGroup2.entities) {
        const policeLightsMaterial2 = entity.getComponent(Material)
        policeLightsMaterial2.albedoColor = Color3.Lerp(policeLightsColors2[currentColorIndexPolice], policeLightsColors2[nextColorIndexPolice], colorRatioPolice)
        if (colorRatioPolice < 1) {
          colorRatioPolice += 0.005 //this has to get smaller as number of entities gets larger
        } else {
          colorRatioPolice = 0
          currentColorIndexPolice++
          if (currentColorIndexPolice > policeLightsColors2.length - 1) {
            currentColorIndexPolice = 0
          }
          nextColorIndexPolice++
          if (nextColorIndexPolice > policeLightsColors2.length - 1) {
            nextColorIndexPolice = 0
          }
        }
      }

      //Police Lights 3
      for (const entity of this.policeLightsGroup3.entities) {
        const policeLightsMaterial3 = entity.getComponent(Material)
        policeLightsMaterial3.albedoColor = Color3.Lerp(policeLightsColors3[currentColorIndexPolice], policeLightsColors3[nextColorIndexPolice], colorRatioPolice)
        if (colorRatioPolice < 1) {
          colorRatioPolice += 0.01 //this has to get smaller as number of entities gets larger
        } else {
          colorRatioPolice = 0
          currentColorIndexPolice++
          if (currentColorIndexPolice > policeLightsColors3.length - 1) {
            currentColorIndexPolice = 0
          }
          nextColorIndexPolice++
          if (nextColorIndexPolice > policeLightsColors3.length - 1) {
            nextColorIndexPolice = 0
          }
        }
      }


    }
  }

engine.addSystem(new Lights)

}