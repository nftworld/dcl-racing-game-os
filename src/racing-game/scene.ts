import config from './config'

const scenePosX = 0.5
const scenePosY = config.scene.yBase ?? 20
const scenePosZ = 2

const sceneRot1 = 0
const sceneRot2 = 0
const sceneRot3 = 0


export const scene = new Entity()

scene.addComponent(
  new Transform({
    position: new Vector3(scenePosX * 16, scenePosY, scenePosZ * 16),
    rotation: Quaternion.Euler(sceneRot1, sceneRot2, sceneRot3)
  })
)

engine.addEntity(scene)
