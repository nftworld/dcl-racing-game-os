import * as utils from '@dcl/ecs-scene-utils'
//import { setTimeout } from '@dcl/ecs-scene-utils';
import { getCurrentRealm } from '@decentraland/EnvironmentAPI'
import { getUserData } from '@decentraland/Identity'
import { getParcel, SceneParcels } from '@decentraland/ParcelIdentity'
//import { signedFetch } from "@decentraland/SignedFetch";
//import { TimeOut } from "src/claw_machine/claw_machine";

export class CrossRealm implements ISystem {
  crossRealm = true
  camera: Camera = new Camera()
  canvas = new UICanvas()

  gotAvatarFromServer = false

  server: string
  modelsList: Model[]
  groupsList: Models
  currentGroup: string
  avatars: AvatarsList = {}
  ws: WebSocket
  parcels: SceneParcels = { base: '', parcels: [] }
  modArea: Entity = new Entity()
  defaultAvatar: string
  icons: Icon[] = []
  forcedShow: { [name: string]: boolean } = {}
  previousFrom: { [name: string]: string } = {}

  //userData: UserData | null = null;
  //userData: UserData = {displayName: '', publicKey: '', hasConnectedWeb3: false, userId: ''}
  userData: any //to avoid nondescript erros 9/13/21

  //realm: Realm;
  realm: any //to avoid nondescript erros 9/13/21

  currentAvatar: string

  myUser: {
    time: { position: number; realm: number }
    last: { position: Vector3; rotation: Quaternion }
    type: 'avatar' | 'model'
  } = {
      time: { position: 0, realm: 0 },
      last: { position: new Vector3(), rotation: new Quaternion() },
      type: 'avatar'
    }

  constructor(server: string, models: Models, defaultAvatar = 'avatar') {
    this.ws = new WebSocket(server)
    this.currentGroup = 'cars'
    this.groupsList = models
    this.modelsList = this.groupsList[this.currentGroup]
    this.server = server
    this.currentAvatar = defaultAvatar
    this.defaultAvatar = defaultAvatar
    this.myUser.type = defaultAvatar === 'avatar' ? 'avatar' : 'model'
    this.modArea.addComponentOrReplace(
      new AvatarModifierArea({
        area: { box: new Vector3(11 * 16, 100, 11 * 16) },
        modifiers: [AvatarModifiers.HIDE_AVATARS]
      })
    )

    this.modArea.addComponent(new Transform({ position: new Vector3(8, 100, 16 * 3 + 8) }))
    engine.addEntity(this.modArea)

    // Get data needed

    void executeTask(async () => {
      this.userData = await getUserData()

      const response = await fetch(
        `https://peer.decentraland.org/content/entities/profiles?pointer=${this.userData.userId}`
      )
      let image: Texture
      const json = await response.json()
      //log(json);
      if (json[0] && json[0].content) {
        const faceHash = (json[0].content as any[]).filter((a) => a.file.indexOf('face256.png') !== -1)[0].hash
        image = new Texture('https://peer.decentraland.org/content/contents/' + faceHash)
      } else {
        image = new Texture(
          'https://peer.decentraland.org/lambdas/images/QmZbyGxDnZ4PaMVX7kpA2NuGTrmnpwTJ8heKKTSCk4GRJL/256'
        )
      }
      const avatarIcon = new Icon(image, this.canvas, 410, 0, 64, 64, {
        sourceHeight: 256,
        sourceWidth: 256
      })
      avatarIcon.image.onClick = new OnPointerDown(() => {
        const type = 'avatar'
        //log("type", type);
        if (type !== this.myUser.type) {
          this.myUser.type = type
          this.deleteHideAvatarArea()
        }
        this.currentAvatar = 'avatar'
        this.myUser.type = type
        //log("change to", element.name, type);
        this.updateUser(this.avatars[this.userData.userId])
      })
    })
    void this.updateStuff()
  }

  switchGroup(name: string) {
    if (name === this.currentGroup) return

    // Set the previous avatar to switch back to it automatically later
    this.previousFrom[this.currentGroup] = this.currentAvatar

    this.currentGroup = name
    this.modelsList = this.groupsList[name]
    for (const model in this.modelsList) {
      const element = this.modelsList[model]
      if (!this.icons[+model]) {
        this.icons[+model] = new Icon(element.image, this.canvas, 410 + 74 * (this.icons.length + 1), 0, 64, 64, {
          sourceHeight: 256,
          sourceWidth: 256
        })
      } else {
        this.icons[+model].image.source = element.image
      }
      this.icons[+model].image.onClick = new OnPointerDown(() => {
        const type = 'model'
        if (type !== this.myUser.type) {
          this.myUser.type = type
          this.createHideAvatarArea()
        }
        this.currentAvatar = element.name
        this.myUser.type = type
        this.updateUser(this.avatars[this.userData.userId])
      })
      if (!element.hidden) this.icons[+model].show()
      else if (element.hidden && this.forcedShow[element.name]) this.icons[+model].show()
      else this.icons[+model].hide()
    }
    for (const e in this.icons) {
      const icon = this.icons[e]
      if (!this.modelsList.filter((a) => a.image === icon.image.source).length) {
        if (icon.image) {
          icon.hide()
          continue
        }
      }
    }
    const element = { name: this.previousFrom[this.currentGroup] || 'avatar' }

    // Switch to the previous avatar used
    const type = element.name === 'avatar' ? 'avatar' : 'model'
    //log("type", type);
    if (type !== this.myUser.type) {
      this.myUser.type = type
      if (type === 'model') this.createHideAvatarArea()
      else if (type === 'avatar') this.deleteHideAvatarArea()
    }
    this.currentAvatar = element.name
    this.myUser.type = type
    //log("change to", element.name, type);
    this.updateUser(this.avatars[this.userData.userId])
  }

  show(name: string) {
    for (const model of this.modelsList) {
      if (model.name === name) {
        for (const icon of this.icons) {
          if (icon.image.source === model.image) icon.show()
        }
      }
    }
    this.forcedShow[name] = true
  }

  async updateStuff() {
    // Get ETH address
    this.realm = await getCurrentRealm()

    // Get list of parcels to not show avatars out of the scene
    await getParcel().then((parcel) => (this.parcels = parcel.land.sceneJsonData.scene))
    if (this.myUser.type === 'model') this.createHideAvatarArea()

    if (this.modelsList.length) {
      for (const avatar in this.modelsList) {
        if (Object.prototype.hasOwnProperty.call(this.modelsList, avatar)) {
          const element = this.modelsList[avatar]
          const avatarIcon = new Icon(element.image, this.canvas, 410 + 74 * (+avatar + 1), 0, 64, 64, {
            sourceHeight: 256,
            sourceWidth: 256
          })
          this.icons.push(avatarIcon)
          if (element.hidden) avatarIcon.image.visible = false
          avatarIcon.image.onClick = new OnPointerDown(() => {
            const type = 'model'
            if (type !== this.myUser.type) {
              this.myUser.type = type
              this.createHideAvatarArea()
            }
            this.currentAvatar = element.name
            this.myUser.type = type
            this.updateUser(this.avatars[this.userData.userId])
          })
        }
      }
    }
    // Wait a bit and connect to the server
    await delay(2000)
    this.connectToWS(this.server)
  }

  isItCrossRealm(localRealm: string, outRealm: string) {
    if (localRealm === 'localhost-stub' || outRealm === 'localhost-stub') return true
    if (localRealm === outRealm) return false
    return true
  }

  isModelAvailable(modelName: string): boolean {
    if (modelName === 'avatar') return false
    return !!this.modelsList.filter((v) => v.name === modelName).length
  }

  getCorrectQuaternion(quat: Array<number>): Quaternion {
    const eulerAngles = new Quaternion(quat[0], quat[1], quat[2], quat[3]).eulerAngles
    return new Quaternion().setEuler(0, eulerAngles.y, eulerAngles.z)
  }

  connectToWS(server: string) {
    this.ws = new WebSocket(server)
    this.ws.onmessage = this.onMessage.bind(this)
  }

  createHideAvatarArea() {
    this.modArea.getComponent(Transform).position.y = 0
  }

  deleteHideAvatarArea() {
    //log("delete mod area");
    this.modArea.getComponent(Transform).position.y = 100
  }

  //Handle message from the websocket
  async onMessage(event: MessageEvent) {
    const message: Users = JSON.parse(event.data)
    if (message.length)
      for (const data of message) {
        if (this.userData === undefined) return
        if (!this.crossRealm && this.realm.displayName !== data.user.realm) return
        // Just in case, if no user just drop it
        if (!data.user)
          if (data.lastUpdate <= +new Date() - 1 * 60 * 1000) {
            //log(JSON.stringify(data));

            if (this.avatars[data.userId]) this.removeUser(data)
            continue
          }

        if (!this.avatars[data.userId]) {
          // Creating avatar
          //log("create user for ", data.userId);
          this.createUser(data)
          continue
        } else {
          // Update avatar
          if (this.myUser.type === 'model' && data.userId === this.userData.userId) {
            continue
          } else this.updateUser(data)
          continue
        }
      }
  }

  // Create a new avatar in world
  createUser(data: User) {
    //log(data);
    this.avatars[data.userId] = {
      ...data,
      entity: new Entity(),
      type: data.user.avatar && data.user.avatar === 'avatar' ? 'avatar' : 'model'
    }

    const ent = this.createAvatar(this.avatars[data.userId])
    this.avatars[data.userId].entity = ent

    // Set position
    if (data.userId !== this.userData.userId) {
      this.avatars[data.userId].entity.getComponentOrCreate(Transform).position = new Vector3(
        data.position[0],
        data.position[1],
        data.position[2]
      )

      this.avatars[data.userId].entity.getComponentOrCreate(Transform).rotation = this.getCorrectQuaternion(
        data.rotation
      )
    }
    engine.addEntity(this.avatars[data.userId].entity)
    if (this.userData.userId === data.userId) {
      if (data.user.avatar) this.currentAvatar = data.user.avatar
      ent.setParent(Attachable.AVATAR)
      ent.getComponentOrCreate(Transform).position = new Vector3(0, -0.9, 0)
    }
    //log(`Created shape for ${data.user.name} at ${+data.position[0]},${+data.position[2]}`);
  }

  // Update position or avatar/model
  updateUser(data: User) {
    this.avatars[data.userId].lastUpdate = data.lastUpdate
    //log("Update user", data.user.name, data.user.avatar, this.myUser.type);
    //log(1);
    if (data.userId !== this.userData.userId) {
      if (!new Vector3(...this.avatars[data.userId].position).equals(new Vector3(...data.position))) {
        this.avatars[data.userId].position = data.position
        if (this.avatars[data.userId].type === 'avatar') {
          this.avatars[data.userId].entity.getComponentOrCreate(Transform).position = new Vector3(
            data.position[0] + +this.parcels.base.split(',')[0] * 16,
            data.position[1],
            data.position[2] + +this.parcels.base.split(',')[1] * 16
          )
        } else {
          this.avatars[data.userId].entity.getComponentOrCreate(Transform).position = new Vector3(
            data.position[0],
            data.position[1],
            data.position[2]
          )
        }
        //log(this.avatars[data.userId].entity.getComponentOrCreate(Transform).position);
      }
      this.avatars[data.userId].rotation = data.rotation

      this.avatars[data.userId].entity.getComponentOrCreate(Transform).rotation = this.getCorrectQuaternion(
        data.rotation
      )
    }
    //log(2, this.avatars[data.userId].type);
    //log(3, this.userData.userId, this.avatars[data.userId].user.avatar);
    //log(3, this.userData.userId, data.user.avatar);
    //log(3, this.userData.userId, this.currentAvatar);

    if (this.avatars[data.userId].type !== this.myUser.type) {
      this.avatars[data.userId].type = this.myUser.type
      if (data.userId === this.userData.userId) this.avatars[data.userId].user.avatar = this.currentAvatar
      engine.removeEntity(this.avatars[data.userId].entity)
      const ent = this.createAvatar(this.avatars[data.userId])
      this.avatars[data.userId].entity = ent
      engine.addEntity(ent)
      if (this.userData.userId === data.userId) {
        ent.setParent(Attachable.AVATAR)
        ent.getComponentOrCreate(Transform).position = new Vector3(0, -0.9, 0)
      } else {
        if (this.avatars[data.userId].type === 'avatar') {
          this.avatars[data.userId].entity.getComponentOrCreate(Transform).position = new Vector3(
            data.position[0] + +this.parcels.base.split(',')[0] * 16,
            data.position[1],
            data.position[2] + +this.parcels.base.split(',')[1] * 16
          )
        } else {
          this.avatars[data.userId].entity.getComponentOrCreate(Transform).position = new Vector3(
            data.position[0],
            data.position[1],
            data.position[2]
          )
        }
      }
    } else if (this.myUser.type === 'model') {
      if (
        data.user.avatar !== 'avatar' &&
        (this.avatars[data.userId].user.avatar !== data.user.avatar ||
          (data.userId === this.userData.userId && this.avatars[data.userId].user.avatar !== this.currentAvatar))
      ) {
        if (data.userId === this.userData.userId) this.avatars[data.userId].user.avatar = this.currentAvatar
        else this.avatars[data.userId].user.avatar = data.user.avatar
        //log(this.userData.userId, this.avatars[data.userId].user.avatar);
        const model = this.modelsList.filter((v) => v.name === data.user.avatar)[0]
        this.avatars[data.userId].entity.addComponentOrReplace(
          new GLTFShape(this.modelsList.filter((v) => v.name === data.user.avatar)[0].model)
        )
        if (model.scale) this.avatars[data.userId].entity.getComponentOrCreate(Transform).scale = model.scale
      }
    }
  }

  // Delete an avatar from the world
  removeUser(data: User) {
    //log("Remove user");
    engine.removeEntity(this.avatars[data.userId].entity)
    delete this.avatars[data.userId]
  }

  // Create entity with model or dcl avatar
  createAvatar(data: Avatar): Entity {
    if (!data.user.avatar) data.user.avatar = this.defaultAvatar
    if (data.userId === this.userData.userId && data.user.avatar === 'avatar') return new Entity()
    //log("Create avatar", data.user.name);

    if (this.myUser.type === 'model') {
      if (!this.isModelAvailable(data.user.avatar)) data.user.avatar = this.modelsList[1].name
      //log("create model", data.user.avatar);
      const ent = new Entity()
      const model = this.modelsList.filter((v) => v.name === data.user.avatar)[0]
      ent.addComponent(new GLTFShape(model.model))
      if (data.userId !== this.userData.userId) {
        //log("create model 123456789");
        ent.getComponentOrCreate(Transform).position = Vector3.FromArray(data.position)
      }
      if (model.scale) ent.getComponentOrCreate(Transform).scale = model.scale
      this.avatars[data.userId].type = 'model'

      return ent
      //} else if (this.crossRealm && data.user.realm !== this.realm.displayName) {
    } else if (this.crossRealm) {
      //log("create avatar 123");
      this.avatars[data.userId].type = 'avatar'
      const avatarShape = new AvatarShape()

      avatarShape.name = `${data.user.name} (${data.user.realm})`

      avatarShape.bodyShape = 'dcl://base-avatars/BaseFemale'
      avatarShape.wearables = [
        'dcl://base-avatars/f_sweater',
        'dcl://base-avatars/f_jeans',
        'dcl://base-avatars/bun_shoes',
        'dcl://base-avatars/standard_hair',
        'dcl://base-avatars/f_eyes_00',
        'dcl://base-avatars/f_eyebrows_00',
        'dcl://base-avatars/f_mouth_00'
      ]

      const ent = new Entity()

      ent.addComponent(avatarShape)
      return ent
    } else {
      this.avatars[data.userId].type = 'avatar'
      return new Entity()
    }
  }

  isWithinParcel(parcels: string[]) {
    if (parcels.length < 1) return false
    //if (this.camera.worldPosition.asArray() === [0, 0, 0]) return false; //throws an error
    if (!this.camera.worldPosition.asArray()) return false //works without this but seems to be working with it too so keeping it for now
    for (const land of parcels) {
      const [x, z] = land.split(',')
      if (
        this.camera.worldPosition.x > +x * 16 &&
        this.camera.worldPosition.x < (+x + 1) * 16 &&
        this.camera.worldPosition.z > +z * 16 &&
        this.camera.worldPosition.z < (+z + 1) * 16
      )
        return true
    }
    return false
  }

  async grabAvatarData(ent: Entity, userAddress: string) {
    const response = await fetch(`https://peer.decentraland.org/content/entities/profiles?pointer=${userAddress}`)
    const json = await response.json()
    if (!json[0]) return
    const profileData = json[0].metadata.avatars[0]
    const avatarData = profileData.avatar
    if (profileData.name !== ent.getComponent(AvatarShape).name) ent.getComponent(AvatarShape).name = profileData.name
    if (this.realm.serverName !== 'localhost') {
      if (avatarData.wearables !== ent.getComponent(AvatarShape).wearables)
        ent.getComponent(AvatarShape).wearables = avatarData.wearables
      if (avatarData.bodyShape !== ent.getComponent(AvatarShape).bodyShape)
        ent.getComponent(AvatarShape).bodyShape = avatarData.bodyShape
    }

    if (avatarData.eyes.color.color !== ent.getComponent(AvatarShape).eyeColor)
      ent.getComponent(AvatarShape).eyeColor = {
        a: 0,
        ...avatarData.eyes.color.color
      }
    if (avatarData.hair.color.color !== ent.getComponent(AvatarShape).hairColor)
      ent.getComponent(AvatarShape).hairColor = {
        a: 0,
        ...avatarData.hair.color.color
      }
    if (avatarData.skin.color.color !== ent.getComponent(AvatarShape).skinColor)
      ent.getComponent(AvatarShape).skinColor = {
        a: 0,
        ...avatarData.skin.color.color
      }
  }

  async update(dt: number) {
    if (this.userData === undefined) return
    this.myUser.time.position += dt
    this.myUser.time.realm += dt
    const currentPosition = this.camera.feetPosition
    const currentRotation = this.camera.rotation

    if (this.isWithinParcel(this.parcels.parcels)) {
      if (
        this.myUser.time.position > 0.1 &&
        (this.myUser.last.position.y !== currentPosition.y ||
          this.myUser.last.rotation.toString() !== currentRotation.toString())
      ) {
        this.sendUpdate()
        this.myUser.time.position = 0
        this.myUser.last.position = currentPosition.clone()
        this.myUser.last.rotation = currentRotation.clone()
      } else if (
        this.myUser.time.position > 0.25 &&
        this.myUser.last.position.toString() !== currentPosition.toString()
      ) {
        this.sendUpdate()
        this.myUser.time.position = 0
        this.myUser.last.position = currentPosition.clone()
        this.myUser.last.rotation = currentRotation.clone()
      } else if (this.myUser.time.position > 5) {
        this.sendUpdate()
        this.myUser.time.position = 0
        this.myUser.last.position = currentPosition.clone()
        this.myUser.last.rotation = currentRotation.clone()
      }

      if (this.myUser.time.realm > 5) {
        this.checkUsers()
        this.realm = await getCurrentRealm()
      }
    }
  }

  sendUpdate() {
    //log(this.camera.feetPosition.asArray());
    const myAvatar: User = {
      position: this.camera.feetPosition.asArray(),
      lastUpdate: 0,
      rotation: this.camera.rotation.asArray(),
      userId: this.userData.userId,
      user: { realm: this.realm.displayName, avatar: this.currentAvatar, name: this.userData.displayName }
    }
    if (this.ws && this.ws.OPEN && !this.ws.CONNECTING) {
      this.ws.send(JSON.stringify(myAvatar))
    }
  }

  checkUsers() {
    for (const userId in this.avatars) {
      if (userId === this.userData.userId) continue
      if (Object.prototype.hasOwnProperty.call(this.avatars, userId)) {
        const avatar = this.avatars[userId]
        if (avatar.lastUpdate < +new Date() - 1 * 60 * 1000) {
          this.removeUser(avatar)
        }
      }
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const ent = new Entity()
    engine.addEntity(ent)
    ent.addComponent(
      new utils.Delay(ms, () => {
        resolve()
        engine.removeEntity(ent)
      })
    )
  })
}

export function addCrossRealm(server: string, models: Models, defaultAvatar = 'avatar') {
  const crossrealmClass = new CrossRealm(server, models, defaultAvatar)
  engine.addSystem(crossrealmClass)
  return crossrealmClass
}

class Icon {
  image: UIImage
  //canvas: UICanvas;
  canvas: any //to avoid nondescript errors 9/13/21

  constructor(
    image: Texture,
    canvas: UICanvas,
    xOffset?: number,
    yOffset?: number,
    width?: number,
    height?: number,
    section?: {
      sourceWidth: number
      sourceHeight: number
      sourceLeft?: number
      sourceTop?: number
    }
  ) {
    const texture = image

    this.image = new UIImage(canvas, texture)

    this.image.hAlign = 'left'
    this.image.vAlign = 'bottom'
    this.image.positionX = xOffset ? xOffset : 0
    this.image.positionY = yOffset ? yOffset : -36
    this.image.width = width ? width : 32
    this.image.height = height ? height : 32
    this.image.sourceLeft = section && section.sourceLeft ? section.sourceLeft : 0
    this.image.sourceTop = section && section.sourceTop ? section.sourceTop : 0
    this.image.sourceWidth = section ? section.sourceWidth : width ? width : 32
    this.image.sourceHeight = section ? section.sourceHeight : height ? height : 32
  }

  //Hides the image from view in the screen
  public hide(): void {
    this.image.visible = false
  }

  //Makes an invisible image visible again.
  //@param {number} duration //Seconds to display the image onscreen. If no value is provided, it stays visible.
  public show(): void {
    this.image.visible = true
  }
}

type Model = {
  name: string
  model: string
  image: Texture
  scale?: Vector3
  rotation?: Quaternion
  offset?: Vector3
  hidden?: boolean
}

interface Models {
  //[name: string] : Model[]
  [name: string]: Array<Model>
}

type User = {
  userId: string
  user: {
    realm: string
    avatar?: string
    name?: string
  }
  position: Array<number>
  rotation: Array<number>
  lastUpdate: number
}

type Users = Array<User>

interface Avatar extends User {
  entity: Entity
  type: 'avatar' | 'model'
}

type AvatarsList = {
  [userId: string]: Avatar
}
