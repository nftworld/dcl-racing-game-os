export class MovementBind extends Entity {
  headEntity: Entity
  active: boolean = false

  constructor() {
    super()

    const box = new BoxShape()
    box.withCollisions = true
    box.visible = false

    // Debugging
    // box.visible = true
    // const boxMaterial = new Material()
    // boxMaterial.albedoColor = Color3.Red()
    // this.addComponent(boxMaterial)
    // ----------

    this.addComponent(box)
    this.addComponent(
      new Transform({
        position: Camera.instance.position,
        scale: new Vector3(1.5, 2, 1.5)
      })
    )

    const headPosition = Camera.instance.position.clone()
    this.headEntity = new Entity()
    const head = new BoxShape()
    head.withCollisions = true
    head.visible = false

    this.headEntity.addComponent(head)
    this.headEntity.addComponent(
      new Transform({
        position: headPosition.add(new Vector3(0, 1.2, 0)),
        scale: new Vector3(1.5, 1.5, 1.5)
      })
    )
  }

  bind(position?: { x: number, y: number, z: number }) {
    log('Binding movement')
    if (this.active) return
    this.active = true
    const { x, y, z } = position || Camera.instance.position
    this.headEntity.getComponent(Transform).position.set(x, y + 1.2 > 2.75 ? 2.75 : y + 1.2, z)

    engine.addEntity(this)
    engine.addEntity(this.headEntity)
  }

  loose() {
    log('Unbinding movement')
    if (!this.active) return
    this.active = false
    engine.removeEntity(this.headEntity)
    engine.removeEntity(this)
  }
}
