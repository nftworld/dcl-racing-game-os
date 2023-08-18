import { TriggerBoxShape, TriggerComponent } from '@dcl/ecs-scene-utils'
import { scene } from './scene'
import config from './config'
import gameplaySystem from './gameplay-system'

export const roadCornerShapeNoWalls = new GLTFShape('models/racing-game/cornerTrack_no_walls2.glb')
export const roadStraightShapeNoWalls = new GLTFShape('models/racing-game/straightTrack_no_walls2.glb')

export const roadCornerShapeWallsOnly = new GLTFShape('models/racing-game/cornerTrack_walls_only_invisible.glb')
// export const roadCornerShapeWallsOnly = new GLTFShape('models/racing-game/cornerTrack_walls_only_visible.glb')
export const roadStraightShapeWallsOnly = new GLTFShape('models/racing-game/straightTrack_walls_only_invisible.glb')
// export const roadStraightShapeWallsOnly = new GLTFShape('models/racing-game/straightTrack_walls_only_visible.glb')

const colliderShape = new GLTFShape('models/racing-game/directionCollider_transparent.glb')
// const colliderShape = new GLTFShape('models/racing-game/directionCollider.glb')

@Component('level1CornerFlag')
export class Level1CornerFlag { }
@Component('level1StraightFlag')
export class Level1StraightFlag { }
@Component('level2CornerFlag')
export class Level2CornerFlag { }
@Component('level2StraightFlag')
export class Level2StraightFlag { }
@Component('level3CornerFlag')
export class Level3CornerFlag { }
@Component('level3StraightFlag')
export class Level3StraightFlag { }
@Component('level4CornerFlag')
export class Level4CornerFlag { }
@Component('level4StraightFlag')
export class Level4StraightFlag { }

//############### REMOVE WALLS FROM TOP LEVEL

function addTrack(
  pos: Vector3,
  rot: Quaternion,
  scl: Vector3,
  trackShape: GLTFShape,
  trackNumber: number | string, // TODO: migrate all refs to numbers
  colliderShape: GLTFShape,
  addCollider: boolean,
  parent: Entity,
  floor: number
) {

  const track = new Entity()
  track.addComponentOrReplace(trackShape)
  track.addComponentOrReplace(
    new Transform({
      position: pos,
      rotation: rot,
      scale: scl
    })
  )

  track.setParent(parent)
  
  if(floor !== 4) {
    const walls = new Entity()
    if (trackShape === roadStraightShapeNoWalls) walls.addComponent(roadStraightShapeWallsOnly)
    if (trackShape === roadCornerShapeNoWalls) walls.addComponent(roadCornerShapeWallsOnly)
    walls.addComponentOrReplace(
      new Transform({
        position: new Vector3(0, 0, 0),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: Vector3.Zero()
      })
    )
    walls.setParent(track)
  }

  if (floor === 1 && trackShape === roadCornerShapeNoWalls) track.addComponent(new Level1CornerFlag())
  if (floor === 1 && trackShape === roadStraightShapeNoWalls) track.addComponent(new Level1StraightFlag())
  if (floor === 2 && trackShape === roadCornerShapeNoWalls) track.addComponent(new Level2CornerFlag())
  if (floor === 2 && trackShape === roadStraightShapeNoWalls) track.addComponent(new Level2StraightFlag())
  if (floor === 3 && trackShape === roadCornerShapeNoWalls) track.addComponent(new Level3CornerFlag())
  if (floor === 3 && trackShape === roadStraightShapeNoWalls) track.addComponent(new Level3StraightFlag())
  if (floor === 4 && trackShape === roadCornerShapeNoWalls) track.addComponent(new Level4CornerFlag())
  if (floor === 4 && trackShape === roadStraightShapeNoWalls) track.addComponent(new Level4StraightFlag())

  let primaryAxis = 'x'
  let primaryAxisReversed = false
  let secondaryAxis: 'x' | 'y' | 'z' | boolean = false
  let secondaryAxisReversed = false

  switch (parseInt(trackNumber.toString())) {
    case 1:
      primaryAxis = 'z'
      primaryAxisReversed = true
      secondaryAxis = 'x'
      break
    case 2:
      primaryAxis = 'x'
      secondaryAxis = 'z'
      break
    case 3:
      primaryAxis = 'z'
      secondaryAxis = 'x'
      secondaryAxisReversed = true
      break
    case 4:
      primaryAxis = 'x'
      secondaryAxis = 'z'
      primaryAxisReversed = true
      secondaryAxisReversed = true
      break
    case 6:
      primaryAxis = 'z'
      break
    case 7:
      primaryAxisReversed = true
      break
    case 8:
      primaryAxis = 'z'
      break
    case 9:
    case 10:
    case 11:
      primaryAxis = 'z'
      primaryAxisReversed = true
      break
    case 12:
      primaryAxis = 'z'
      primaryAxisReversed = false // because we'll be going down
      secondaryAxis = 'x'
      secondaryAxisReversed = false // ditto
      break
    case 13:
      primaryAxis = 'x'
      primaryAxisReversed = false // ditto
      secondaryAxis = 'z'
      break
    case 14:
      primaryAxis = 'z'
      primaryAxisReversed = false // ditto
      break
    case 15:
      primaryAxis = 'z'
      primaryAxisReversed = false // ditto
      break
  }

  // ---- Show track ID above track ----
  if (config.game.showTrackIDs) {
    const trackNumberTextScale = 10
    const trackNumberEnt = new Entity()
    trackNumberEnt.setParent(track)
    const colliderTextShape = new TextShape(`${floor}:${trackNumber}`)
    trackNumberEnt.addComponent(colliderTextShape)
    trackNumberEnt.addComponent(
      new Transform({
        position: new Vector3(0, 10, 0),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(trackNumberTextScale, trackNumberTextScale, trackNumberTextScale)
      })
    )
  }
  // -----------------------------------

  if (addCollider === true) {
    /*
        const wallColliderScale = 5
        const wallCollider = new Entity()
        wallCollider.setParent(track)
        wallCollider.addComponentOrReplace(colliderShape)
        wallCollider.addComponentOrReplace(new Transform({
            position: new Vector3(10.2, -2, 0),
            rotation: Quaternion.Euler(0, 90, 0),
            scale: new Vector3(wallColliderScale*2.7, wallColliderScale, wallColliderScale)
        })) 
        */

    const directionColliderScale = 3.5
    let directionColliderPosZ = -20

    for (let x = 0; x <= 1; x++) {
      const directionCollider = new Entity()
      directionCollider.setParent(track)
      directionCollider.addComponentOrReplace(colliderShape)
      directionCollider.addComponentOrReplace(
        new Transform({
          position: new Vector3(0, 7.75, directionColliderPosZ),
          rotation: Quaternion.Euler(0, 0, 0),
          scale: new Vector3(directionColliderScale, directionColliderScale / 1.25, directionColliderScale)
        })
      )

      directionCollider.addComponent(new DirectionColliderFlag())
      directionColliderPosZ += 40
    }
  }

  let triggerSize = new Vector3(4, 1, 4)
  let triggerPosition = new Vector3(0, 2, 0)

  switch (parseInt(trackNumber.toString())) {
    case 3:
      triggerSize = new Vector3(8, 1, 8)
      break
    case 4:
      triggerSize = new Vector3(8, 1, 8)
      break
    case 5:
      triggerSize = new Vector3(19, 1, 4)
      triggerPosition = new Vector3(0, 2, 0)
      break
    case 6:
      triggerSize = new Vector3(4, 1, 19)
      triggerPosition = new Vector3(0, 2, -1)
      break
    case 7:
      triggerSize = new Vector3(19, 1, 4)
      triggerPosition = new Vector3(0, 2, 0)
      break
    case 8:
      triggerSize = new Vector3(4, 3, 17)
      break
    case 9:
    case 10:
    case 11:
      triggerSize = new Vector3(4, 0.2, 8)
      triggerPosition = new Vector3(0, 1.5, 4)
      break
  }

  const triggerBoxShape = new TriggerBoxShape(triggerSize, triggerPosition)
  const triggerBoxComponent = new TriggerComponent(triggerBoxShape, {
    // enableDebug: true,
    onCameraEnter: () => {
      // log(`Player entering floor ${floor}, track ${trackNumber}`)
      void gameplaySystem.recordPlayerLastPosition(
        gameplaySystem.direction,
        floor,
        parseInt(trackNumber.toString()),
        Camera.instance.feetPosition
      )
    }
  })

  track.addComponent(triggerBoxComponent)

  gameplaySystem.track.push({
    floor,
    trackNumber,
    pos,
    rot,
    scl,
    primaryAxis,
    primaryAxisReversed,
    secondaryAxis,
    secondaryAxisReversed
  })
}

@Component("directionColliderFlag")
export class DirectionColliderFlag {}

//@Component("polePositionFlag")
//export class PolePositionFlag { }

const roadScale = 0.125
const roadStraightScale = 0.4
const roadXMargin = 1.85
const roadZMargin = 2.15
const roadY = 0.01
let roadYMargin = 2
const firstfloor = 1
const lastfloor = 4

for (let floor = firstfloor; floor <= lastfloor; floor++) {

  if (floor > firstfloor) {
    addTrack(
      new Vector3(0 + roadXMargin, roadY + roadYMargin, 0 + roadZMargin),
      Quaternion.Euler(0, 0, 0),
      new Vector3(roadScale, roadScale, roadScale),
      roadCornerShapeNoWalls,
      '1',
      colliderShape,
      false,
      scene,
      floor
    )

    addTrack(
      new Vector3(32 - roadZMargin, roadY + roadYMargin, 0 + roadXMargin),
      Quaternion.Euler(0, 270, 0),
      new Vector3(roadScale, roadScale, roadScale),
      roadCornerShapeNoWalls,
      '2',
      colliderShape,
      false,
      scene,
      floor
    )
  }

  addTrack(
    new Vector3(32 - roadXMargin, roadY + roadYMargin, 32 - roadZMargin),
    Quaternion.Euler(0, 180, 0),
    new Vector3(roadScale, roadScale, roadScale),
    roadCornerShapeNoWalls,
    '3',
    colliderShape,
    false,
    scene,
    floor
  )

  addTrack(
    new Vector3(0 + roadZMargin, roadY + roadYMargin, 32 - roadXMargin),
    Quaternion.Euler(0, 90, 0),
    new Vector3(roadScale, roadScale, roadScale),
    roadCornerShapeNoWalls,
    '4',
    colliderShape,
    false,
    scene,
    floor
  )

  if (floor > firstfloor) {
    addTrack(
      new Vector3(16, roadY + roadYMargin, 1.3),
      Quaternion.Euler(0, 90, 0),
      new Vector3(roadScale, roadScale, roadStraightScale),
      roadStraightShapeNoWalls,
      '5',
      colliderShape,
      true,
      scene,
      floor
    )

    addTrack(
      new Vector3(30.7, roadY + roadYMargin, 16),
      Quaternion.Euler(0, 0, 0),
      new Vector3(roadScale, roadScale, roadStraightScale),
      roadStraightShapeNoWalls,
      '6',
      colliderShape,
      true,
      scene,
      floor
    )
  }

  roadYMargin = roadYMargin + 3
}

roadYMargin = 2

for (let floor = firstfloor; floor <= lastfloor; floor++) {
  addTrack(
    new Vector3(16, roadY + roadYMargin, 32 - 1.3),
    Quaternion.Euler(0, -90, 0),
    new Vector3(roadScale, roadScale, roadStraightScale),
    roadStraightShapeNoWalls,
    '7',
    colliderShape,
    true,
    scene,
    floor
  )
  roadYMargin = roadYMargin + 3
}

roadYMargin = 1

addTrack(
  new Vector3(30.7, roadY + roadYMargin, 16),
  Quaternion.Euler(-6.5, 0, 0),
  new Vector3(roadScale, roadScale, roadStraightScale - 0.04),
  roadStraightShapeNoWalls,
  '8',
  colliderShape,
  true,
  scene,
  1
)

roadYMargin = roadYMargin + 3

addTrack(
  new Vector3(1.3, roadY + roadYMargin - 0.5, 16),
  Quaternion.Euler(-9.6, 180, 0),
  new Vector3(roadScale, roadScale, roadStraightScale - 0.04),
  roadStraightShapeNoWalls,
  '9',
  colliderShape,
  true,
  scene,
  2
)

roadYMargin = roadYMargin + 3

addTrack(
  new Vector3(1.3, roadY + roadYMargin - 0.5, 16),
  Quaternion.Euler(-9.6, 180, 0),
  new Vector3(roadScale, roadScale, roadStraightScale - 0.04),
  roadStraightShapeNoWalls,
  '10',
  colliderShape,
  true,
  scene,
  3
)

roadYMargin = roadYMargin + 3

addTrack(
  new Vector3(1.3, roadY + roadYMargin - 0.5, 16),
  Quaternion.Euler(-9.6, 180, 0),
  new Vector3(roadScale, roadScale, roadStraightScale - 0.04),
  roadStraightShapeNoWalls,
  '11',
  colliderShape,
  true,
  scene,
  4
)

roadYMargin = roadYMargin + 3

addTrack(
  new Vector3(1.85, roadY + roadYMargin - 0.75, 17.3),
  Quaternion.Euler(9.6, 0, 0),
  new Vector3(roadScale, roadScale, roadScale),
  roadCornerShapeNoWalls,
  '12',
  colliderShape,
  false,
  scene,
  4
)

addTrack(
  new Vector3(8.75, roadY + roadYMargin - 0.7, 16.8),
  Quaternion.Euler(0, 274, -10),
  new Vector3(roadScale, roadScale, roadScale),
  roadCornerShapeNoWalls,
  '13',
  colliderShape,
  false,
  scene,
  4
)

addTrack(
  new Vector3(1.3, roadY + roadYMargin - 1.8, 23.6),
  Quaternion.Euler(9, 0, 0),
  new Vector3(roadScale, roadScale, roadScale - 0.07),
  roadStraightShapeNoWalls,
  '14',
  colliderShape,
  false,
  scene,
  4
)

addTrack(
  new Vector3(9.94, roadY + roadYMargin - 1.815, 25.7),
  Quaternion.Euler(3, 0, -0.25),
  new Vector3(roadScale, roadScale, roadStraightScale - 0.24),
  roadStraightShapeNoWalls,
  '15',
  colliderShape,
  false,
  scene,
  4
)
