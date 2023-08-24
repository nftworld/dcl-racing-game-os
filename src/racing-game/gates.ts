import config from './config'
import { scene } from './scene'

const doNotEnterOrigW = 162
const doNotEnterOrigH = 162
const doNotEnterWidthRatio = doNotEnterOrigW / doNotEnterOrigH

// const startGateScale = 2.6
const startGateScale = 0
export const startGate = new Entity()
if (!config.game.disableStartGate) {
  // startGate.setParent(scene)
} 
const startGateShape = new PlaneShape()

startGateShape.withCollisions = false
startGateShape.visible = false //racers dont like it in their face. Perhaps replace it with waving flags or something

startGate.addComponent(startGateShape)
const startGateTexture = new Texture('images/racing-game/donotenter.png')
const startGateMaterial = new Material()
startGateMaterial.albedoTexture = startGateTexture
startGateMaterial.metallic = 0
startGateMaterial.roughness = 1
startGate.addComponent(startGateMaterial)
startGate.addComponent(new Transform({
  position: new Vector3(30.7, 1.3, 7.05), //this is the starting line
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(startGateScale * doNotEnterWidthRatio, startGateScale, startGateScale)
}))

// ---------------------------------------------------------------

const loopGateScale = 2.6
export const loopGate = new Entity()
loopGate.setParent(scene)
const loopGateShape = new PlaneShape()
loopGate.addComponent(loopGateShape)
const loopGateTexture = new Texture('images/racing-game/donotenter.png')
const loopGateMaterial = new Material()
loopGateMaterial.albedoTexture = loopGateTexture
loopGateMaterial.metallic = 0
loopGateMaterial.roughness = 1
loopGate.addComponent(loopGateMaterial)
loopGate.addComponent(new Transform({
  position: new Vector3(9.95, 12.35, 29.4),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(loopGateScale * doNotEnterWidthRatio, loopGateScale, loopGateScale)
}))
