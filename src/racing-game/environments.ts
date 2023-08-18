import { scene } from './scene'

export const UFOEnvironment = new Entity()
UFOEnvironment.setParent(scene)
UFOEnvironment.addComponent(new Transform({
  position: new Vector3(0, 0, 0),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(1,1,1)
}))
/*
  UFOscene.addComponent(new Transform({
  position: new Vector3(0, 0, 32),
  rotation: Quaternion.Euler(0, 90, 0),
  scale: new Vector3(1,1,1)
  }))
 */

export const ChicagoEnvironment = new Entity()
ChicagoEnvironment.setParent(scene)
ChicagoEnvironment.addComponent(new Transform({
  position: new Vector3(0, 0, 0),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(1, 1, 1)
}))
