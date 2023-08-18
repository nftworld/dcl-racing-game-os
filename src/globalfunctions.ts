import * as EthConnect from 'eth-connect'
import { getProvider } from '@decentraland/web3-provider'
import * as dclTx from 'decentraland-transactions' //error
import { TriggerBoxShape, TriggerComponent } from '@dcl/ecs-scene-utils'

export function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function getRandomInteger(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

// export function padZero(time: number | string, min: number = 10, padWith: string = '0') {
export function padZero(time: number, min: number = 10, padWith: string = '0') {
  return time < min ? padWith + time : '' + time
}

export function distance(pos1: Vector3, pos2: Vector3): number {
  const a = pos1.x - pos2.x
  const b = pos1.z - pos2.z
  return a * a + b * b
}

export function showImg(
  artist: string,
  title: string,
  file: string,
  origW: number,
  origH: number,
  scaleY: number,
  url: string,
  posX: number,
  posY: number,
  posZ: number,
  rotation1: number,
  rotation2: number,
  rotation3: number,
  border: boolean,
  parent: Entity
) {
  const widthRatio = origW / origH
  const myEntity = new Entity()
  //myEntity.addComponent(new ArtFlag2())
  const plane = new PlaneShape()
  plane.withCollisions = false
  myEntity.addComponent(plane)
  myEntity.setParent(parent)

  if (url) {
    myEntity.addComponent(
      new OnPointerDown(() => {
        openExternalURL(url)
      })
    )
  }

  const myEntityTransform = new Transform({
    position: new Vector3(posX, posY, posZ),
    rotation: Quaternion.Euler(rotation1, rotation2, rotation3),
    scale: new Vector3(scaleY * widthRatio, scaleY, 1)
  })

  myEntity.addComponent(myEntityTransform)
  const myTexture = new Texture(file)
  const myMaterial = new Material()
  myMaterial.albedoTexture = myTexture
  myMaterial.metallic = 0
  myMaterial.roughness = 1
  //myMaterial.transparencyMode = 1 // just use this (but not for all images?)
  //myMaterial.alphaTest = 0.3 //dont need this for transparency mode. It didnt even seem to work anyway
  myEntity.addComponent(myMaterial)
  //engine.addEntity(myEntity)

  if (border === true) {
    const backgroundScale = 1.1
    const backgroundOffset = 0.01
    const background = new Entity()
    const backgroundShape = new PlaneShape()
    backgroundShape.withCollisions = false
    background.addComponent(backgroundShape)
    background.setParent(myEntity)
    const backgroundTransform = new Transform({
      position: new Vector3(0, 0, 0 - backgroundOffset),
      rotation: Quaternion.Euler(rotation1, rotation2, rotation3),
      scale: new Vector3(backgroundScale, backgroundScale, 1)
    })
    background.addComponent(backgroundTransform)
    const white = Color3.FromHexString('#FFFFFF')
    const backgroundMaterial = new Material()
    backgroundMaterial.albedoColor = white
    backgroundMaterial.metallic = 0
    backgroundMaterial.roughness = 1
    backgroundMaterial.emissiveColor = white
    background.addComponent(backgroundMaterial)
  }

  let artisttitleoffset = 0.65
  if (artist) {
    const artistEntity = new Entity()
    artistEntity.setParent(myEntity) //this assumes the scale of the image which is different from one to the next. Better to have static scale for the text
    const artistShape = new TextShape(artist)
    artistShape.paddingBottom = 0
    //artistShape.lineSpacing = null
    artistEntity.addComponent(artistShape)
    artistEntity.addComponent(
      new Transform({
        position: new Vector3(0, artisttitleoffset, 0),
        rotation: Quaternion.Euler(0, 180, 180),
        scale: new Vector3(0.1, 0.1, 1) //based on scale of parent entity which changes from one to the next so the text sizes are different
      })
    )
    artisttitleoffset += 0.1 //only increment this if there is an artist. otherwise show the title directly below the image
  }

  if (title) {
    const titleEntity = new Entity()
    titleEntity.setParent(myEntity) //this assumes the scale of the image which is different from one to the next. Better to have static scale for the text
    const titleShape = new TextShape(title)
    titleShape.paddingBottom = 0
    //titleShape.lineSpacing = null
    titleEntity.addComponent(titleShape)
    titleEntity.addComponent(
      new Transform({
        position: new Vector3(0, artisttitleoffset, 0),
        rotation: Quaternion.Euler(0, 180, 180),
        scale: new Vector3(0.2, 0.15, 1) //based on scale of parent entity which changes from one to the next so the text sizes are different
      })
    )
  }
} //showImg function

//show video function

export function showVid(
  heading: string,
  subheading: string,
  file: string,
  playicon: string,
  url: string,
  origW: number,
  origH: number,
  scaleY: number,
  posX: number,
  posY: number,
  posZ: number,
  rotation1: number,
  rotation2: number,
  rotation3: number,
  vidplaying: boolean,
  loop: boolean,
  parent: Entity
) {
  const widthRatio = origW / origH
  const myVideoClip1 = new VideoClip(file)
  const myVideoTexture1 = new VideoTexture(myVideoClip1)
  const screen1 = new Entity()
  screen1.setParent(parent)
  screen1.addComponent(new PlaneShape())
  //screen1.withCollisions = false
  screen1.addComponent(
    new Transform({
      position: new Vector3(posX, posY, posZ),
      rotation: Quaternion.Euler(rotation1, rotation2, rotation3 + 180), //for some reason videos are upside down compared to images
      scale: new Vector3(scaleY * widthRatio, scaleY, 1)
    })
  )

  const Video_playicon = new Texture(playicon)
  const myMaterial1 = new Material()
  myMaterial1.metallic = 0
  myMaterial1.roughness = 1
  Video_playicon ? (myMaterial1.albedoTexture = Video_playicon) : (myMaterial1.albedoTexture = myVideoTexture1)
  screen1.addComponent(myMaterial1)
  screen1.addComponent(
    new OnPointerDown(
      () => {
        myMaterial1.albedoTexture === Video_playicon
          ? (myMaterial1.albedoTexture = myVideoTexture1)
          : (myMaterial1.albedoTexture = Video_playicon)
        myVideoTexture1.playing = !myVideoTexture1.playing
        openExternalURL(url)
      },
      { distance: 20 }
    )
  )

  myVideoTexture1.playing = vidplaying
  myVideoTexture1.loop = loop
  const artistEntity = new Entity()
  artistEntity.setParent(screen1) //this assumes the scale of the image which is different from one to the next. Better to have static scale for the text
  const artistShape = new TextShape(heading)
  artistShape.paddingBottom = 0
  //artistShape.lineSpacing = null
  artistEntity.addComponent(artistShape)
  artistEntity.addComponent(
    new Transform({
      position: new Vector3(0, -0.535, 0),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(0.05, 0.05, 1) //based on scale of parent entity which changes from one to the next so the text sizes are different
    })
  )

  //artistEntity.getComponent(Transform).scale.set(0.1,0.1,0.1) //this is still based off of parent scale
  artistEntity.addComponent(
    new OnPointerDown(
      () => {
        openExternalURL(url)
      },
      { distance: 20 }
    )
  )

  const titleEntity = new Entity()
  titleEntity.setParent(screen1) //this assumes the scale of the image which is different from one to the next. Better to have static scale for the text
  const titleShape = new TextShape(subheading)
  titleShape.paddingBottom = 0
  //titleShape.lineSpacing = null
  titleEntity.addComponent(titleShape)
  titleEntity.addComponent(
    new Transform({
      position: new Vector3(0, -0.6, 0),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(0.035, 0.035, 1) //based on scale of parent entity which changes from one to the next so the text sizes are different
    })
  )

  titleEntity.addComponent(
    new OnPointerDown(
      () => {
        openExternalURL(url)
      },
      { distance: 20 }
    )
  )
} //showVid function

export function showNFT(
  heading: string,
  subheading: string,
  file: string,
  url: string,
  posX: number,
  posY: number,
  posZ: number,
  rot1: number,
  rot2: number,
  rot3: number,
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  parent: Entity
) {
  const NFT = new Entity()
  NFT.addComponent(new NFTShape(file, Color3.White()))
  const NFTTransform = new Transform({
    position: new Vector3(posX, posY, posZ),
    rotation: Quaternion.Euler(rot1, rot2, rot3),
    scale: new Vector3(scaleX, scaleY, scaleZ)
  })

  NFT.addComponent(NFTTransform)
  if (url) {
    NFT.addComponent(
      new OnPointerDown(() => {
        openExternalURL(url)
      })
    )
  }

  const NFTMaterial = new Material()
  NFTMaterial.metallic = 0
  NFTMaterial.roughness = 1
  NFT.addComponent(NFTMaterial)
  NFT.setParent(parent)
  if (heading) {
    const subheading1Entity = new Entity()
    subheading1Entity.setParent(NFT) //this assumes the scale of the image which is different from one to the next. Better to have static scale for the text
    const subheading1Shape = new TextShape(heading)
    subheading1Shape.paddingBottom = 0
    //subheading1Shape.lineSpacing = null
    subheading1Entity.addComponent(subheading1Shape)
    subheading1Entity.addComponent(
      new Transform({
        position: new Vector3(0, -0.3, 0),
        rotation: Quaternion.Euler(0, 0, 0)
      })
    )
    subheading1Entity.getComponent(Transform).scale.set(0.045, 0.045, 1) //this is still based off of parent scale
  }

  if (subheading) {
    //log("There is a subheading2")
    const subheading2Entity = new Entity()
    subheading2Entity.setParent(NFT) //this assumes the scale of the image which is different from one to the next. Better to have static scale for the text
    const subheading2Shape = new TextShape(subheading)
    subheading2Shape.paddingBottom = 0
    //subheading2Shape.lineSpacing = null
    subheading2Entity.addComponent(subheading2Shape)
    subheading2Entity.addComponent(
      new Transform({
        position: new Vector3(0, -0.335, 0),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(0.025, 0.025, 1) //based on scale of parent entity which changes from one to the next so the text sizes are different
      })
    )
  }
} //function showNFT

export function showNFTs(
  heading: string,
  subheading: string,
  file: string,
  url: string,
  posX: number,
  posY: number,
  posZ: number,
  rot1: number,
  rot2: number,
  rot3: number,
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  parent: Entity,
  count: number
) {
  const posXorig = posX
  // const posYorig = posY
  // const posZorig = posZ
  const NFT = new Entity()
  NFT.addComponent(new NFTShape(file, Color3.White()))
  const NFTTransform = new Transform({
    position: new Vector3(posX, posY, posZ),
    rotation: Quaternion.Euler(rot1, rot2, rot3),
    scale: new Vector3(scaleX, scaleY, scaleZ)
  })

  NFT.addComponent(NFTTransform)
  if (url) {
    NFT.addComponent(
      new OnPointerDown(() => {
        openExternalURL(url)
      })
    )
  }

  const NFTMaterial = new Material()
  NFTMaterial.metallic = 0
  NFTMaterial.roughness = 1
  NFT.addComponent(NFTMaterial)
  NFT.setParent(parent)
  const posadj = 0.08

  for (let counter = 0; counter < count; counter++) {
    const NFT2 = new Entity()
    NFT2.addComponent(new NFTShape(file, Color3.White()))
    const NFT2Transform = new Transform({
      position: new Vector3(posX, posY, posZ),
      rotation: Quaternion.Euler(rot1, rot2, rot3),
      scale: new Vector3(scaleX, scaleY, scaleZ)
    })

    NFT2.addComponent(NFT2Transform)
    if (url) {
      NFT2.addComponent(
        new OnPointerDown(() => {
          openExternalURL(url)
        })
      )
    }

    const NFT2Material = new Material()
    NFT2Material.metallic = 0
    NFT2Material.roughness = 1
    NFT2.addComponent(NFT2Material)
    NFT2.setParent(parent)

    if (rot1 === 0 && rot2 === 90 && rot3 === 0) {
      posX -= posadj
    } else if (rot1 === 0 && rot2 === -90 && rot3 === 0) {
      posX += posadj
    }
  } //for

  posX = posXorig //reset posX
  //reset posY
  //reset posZ
  if (heading) {
    const headingoffset = -0.7
    const headingscale = 0.1
    const headingEntity = new Entity()
    //subheading1Entity.setParent(NFT);
    headingEntity.setParent(parent)
    const headingShape = new TextShape(heading)
    headingShape.paddingBottom = 0
    //headingShape.lineSpacing = null
    headingEntity.addComponent(headingShape)
    headingEntity.addComponent(
      new Transform({
        //position: new Vector3(0,subheadingoffset,0),
        position: new Vector3(posX, posY - headingoffset, posZ),
        rotation: Quaternion.Euler(rot1, rot2, rot3),
        scale: new Vector3(headingscale, headingscale, 1) //based on scale of parent entity which changes from one to the next so the text sizes are different
      })
    )
  }

  if (subheading) {
    //let subheadingoffset = -0.3
    const subheadingoffset = 0.375 * scaleX
    const subheadingscale = 0.045 * scaleX
    const subheadingEntity = new Entity()
    //subheading2Entity.setParent(NFT);
    subheadingEntity.setParent(parent)
    const subheadingShape = new TextShape(subheading)
    subheadingShape.paddingBottom = 0
    //subheadingShape.lineSpacing = null
    subheadingEntity.addComponent(subheadingShape)
    subheadingEntity.addComponent(
      new Transform({
        //position: new Vector3(0,subheadingoffset,0),
        position: new Vector3(posX, posY - subheadingoffset, posZ),
        rotation: Quaternion.Euler(rot1, rot2, rot3),
        scale: new Vector3(subheadingscale, subheadingscale, 1) //based on scale of parent entity which changes from one to the next so the text sizes are different
      })
    )
  }
} //function showNFTs

export function addStore(
  style: string,
  posX: number,
  posY: number,
  posZ: number,
  rot1: number,
  rot2: number,
  rot3: number,
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  parent: Entity,
  forrent: boolean
) {
  let storefile = ''
  let storeurl = ''

  if (style === 'qurka') {
    storefile = 'models/stores/qurka2.glb'
    storeurl = 'https://nftworld.io/store/rentals/1x1-mall-shop-in-nft-world-city/'
  } else if (style === 'green') {
    storefile = 'models/stores/green_optimized/green.gltf'
    storeurl = 'https://nftworld.io/store/rentals/1x1-mall-shop/'
  } else if (style === 'purple') {
    storefile = 'models/stores/purple_optimized/purple.gltf'
    storeurl = 'https://nftworld.io/store/rentals/1x1-mall-shop/'
  } else if (style === 'blue') {
    storefile = 'models/stores/blue_optimized/blue.gltf'
    storeurl = 'https://nftworld.io/store/rentals/1x1-mall-shop/'
  } else if (style === 'jatin') {
    storefile = 'models/stores/jatin/CubeShowroomGBL/cuberoom.glb'
    storeurl = 'https://nftworld.io/store/rentals/1x1-mall-shop/'
  }

  const store = new Entity()
  const storeShape = new GLTFShape(storefile)
  store.addComponentOrReplace(storeShape)
  store.setParent(parent)
  const storeTransform = new Transform({
    position: new Vector3(posX, posY, posZ),
    rotation: Quaternion.Euler(rot1, rot2, rot3),
    scale: new Vector3(scaleX, scaleY, scaleZ)
  })
  store.addComponentOrReplace(storeTransform)

  if (forrent) {
    showSign('', '', 'images/forrent_icon3.png', 599, 429, 2, storeurl, 0, posY + 2.5, 0, 180, 0, 0, false, store)
  }
} //function addStore

export function showModel(
  file: string,
  posX: number,
  posY: number,
  posZ: number,
  rot1: number,
  rot2: number,
  rot3: number,
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  parent: Entity
) {
  const model = new Entity()
  const modelShape = new GLTFShape(file)
  model.addComponentOrReplace(modelShape)
  model.setParent(parent)
  const modelTransform = new Transform({
    position: new Vector3(posX, posY, posZ),
    rotation: Quaternion.Euler(rot1, rot2, rot3),
    scale: new Vector3(scaleX, scaleY, scaleZ)
  })
  model.addComponentOrReplace(modelTransform)
} //function showModel

export function addGroundCollider(
  posX: number,
  posY: number,
  posYadj: number,
  posZ: number,
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  color: Color3,
  parent: Entity
) {
  const groundfloorPosY = posY
  const groundcolliderPosY = groundfloorPosY - posYadj
  const groundcollider = new Entity()
  const groundcolliderShape = new BoxShape()
  groundcolliderShape.withCollisions = true
  groundcollider.addComponent(groundcolliderShape)
  const groundcolliderMaterial = new Material()
  groundcolliderMaterial.albedoColor = color
  groundcolliderMaterial.metallic = 0.0
  groundcolliderMaterial.roughness = 1
  groundcollider.addComponent(groundcolliderMaterial)
  groundcollider.addComponent(
    new Transform({
      position: new Vector3(posX, groundcolliderPosY, posZ),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(scaleX, scaleY, scaleZ)
    })
  )
  //engine.addEntity(groundcollider)
  groundcollider.setParent(parent)
}

export async function doUserHaveNFT(userAddress: string, contractsAddresses: string[]): Promise<boolean> {
  try {
    const provider = await getProvider()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestManager: any = new EthConnect.RequestManager(provider)
    const metaProvider: any = new EthConnect.HTTPProvider('https://polygon-rpc.com')
    const metaRequestManager: any = new EthConnect.RequestManager(metaProvider)

    const l1Collections: any = dclTx.getContract(dclTx.ContractName.ERC721, 80001)
    const l2Collections: any = dclTx.getContract(dclTx.ContractName.ERC721CollectionV2, 137)

    for (const cAddress of contractsAddresses) {
      if (cAddress.indexOf('ethereum') === 0) {
        const contract: any = await new EthConnect.ContractFactory(requestManager, l1Collections.abi).at(
          cAddress.split('/')[1]
        )
        const val = await contract.balanceOf(userAddress)
        log(val)
        if (val > 0) {
          //log(cAddress);
          return true
        }
      } else if (cAddress.indexOf('matic') === 0) {
        const contract: any = await new EthConnect.ContractFactory(metaRequestManager, l2Collections.abi).at(
          cAddress.split('/')[1]
        )
        const val = await contract.balanceOf(userAddress)
        if (val > 0) {
          //log(cAddress);
          return true
        }
      }
    }

    return false
  } catch (error) {
    //log(error.toString());
    return false
  }
}

export function showSign(
  artist: string,
  title: string,
  file: string,
  origW: number,
  origH: number,
  scaleY: number,
  url: string,
  posX: number,
  posY: number,
  posZ: number,
  rotation1: number,
  rotation2: number,
  rotation3: number,
  border: boolean,
  parent: Entity
) {
  const widthRatio = origW / origH

  const icon = new Texture(file)
  const ent = new Entity()
  ent.setParent(parent)
  ent.addComponent(new PlaneShape())
  ent.addComponent(
    new Transform({
      position: new Vector3(posX, posY, posZ),
      rotation: Quaternion.Euler(rotation1, rotation2, rotation3),
      scale: new Vector3(scaleY * widthRatio, scaleY, 1)
    })
  )
  if (url) {
    ent.addComponent(
      new OnPointerDown(
        () => {
          openExternalURL(url)
        },
        { distance: 20 }
      )
    )
  }

  const mat = new Material()
  mat.metallic = 0
  mat.roughness = 1
  mat.albedoTexture = icon
  ent.addComponent(mat)
}

export function billboardSign(parent: Entity, file: string, trans: Transform, triggerBoxSize: Vector3) {
  const icon = new Texture(file)
  const ent = new Entity()
  ent.setParent(parent)
  ent.addComponent(trans)
  ent.addComponent(new PlaneShape())

  //ent.addComponent(new Billboard(false, true, false)) //seems to ignore Transform rotation, and shows the image upside down

  ent.addComponent(
    new TriggerComponent(new TriggerBoxShape(triggerBoxSize, new Vector3(0, 1, 0)), {
      enableDebug: false,
      onCameraEnter() {
        //log("Triggered")
        engine.removeEntity(ent)
      }
    })
  )

  const mat = new Material()
  mat.metallic = 0
  mat.roughness = 1
  mat.albedoTexture = icon
  ent.addComponent(mat)
}

export function addAd(
  adWidthRatio: number,
  adYScale: number,
  adXPos: number,
  adYPos: number,
  adZPos: number,
  adRot1: number,
  adRot2: number,
  adRot3: number,
  parent: Entity,
  spacingAxis: string
) {
  const adImages: string[] = ['nftworld_ad2.jpg', 'mtvrs.jpg', 'advertise.jpg']
  const randomInt = getRandomInteger(0, adImages.length - 1)
  const adImage = adImages[randomInt]
  const adURLs: string[] = [
    'https://nftworld.io?utm_source=nftworld&utm_medium=referral&utm_campaign=nftworldcity&utm_content=banner_ad',
    'https://mtvrs.com/?utm_source=nftworld&utm_medium=referral&utm_campaign=nftworldcity&utm_content=banner_ad',
    'https://nftworld.io/store/ads/metaverse-chat-banner-ad/?utm_source=nftworld&utm_medium=referral&utm_campaign=nftworldcity&utm_content=banner_ad'
  ]
  const adURL = adURLs[randomInt]

  /*
  var sponsored_ad_url = "https://nftworld.io/mbe/decentraland/ads/ads.json"
  fetch(sponsored_ad_url)
    .then((resp) => resp.json()) // Transform the data into json
    .then((data) => {
      const assets = data.assets
      const random = assets[Math.floor(Math.random() * assets.length)]

      //these variables have to be declared here between the brackets
      let adImage: string = "https://nftworld.io/mbe/decentraland/ads/" + random.image
      let adURL: string = "https://nftworld.io/mbe/decentraland/ads/" + random.url

      //but then nothing outside the brackets can use them and I cant really move everything into here, and I dont want to duplicate this for every placement
    });
  */

  const ad = new Entity()
  ad.setParent(parent)
  ad.addComponent(new PlaneShape())

  ad.addComponent(
    new OnPointerDown(
      () => {
        openExternalURL(adURL)
      },
      { distance: 20 }
    )
  )

  const ad1Transform = new Transform({
    position: new Vector3(adXPos, adYPos, adZPos),
    rotation: Quaternion.Euler(adRot1, adRot2, adRot3),
    scale: new Vector3(adYScale * adWidthRatio, adYScale, 1)
  })
  ad.addComponent(ad1Transform)
  const adMaterial = new Material()
  adMaterial.metallic = 0
  adMaterial.roughness = 1

  const ad1Texture = new Texture('images/ads/' + adImage)
  adMaterial.albedoTexture = ad1Texture
  ad.addComponent(adMaterial)
  //engine.addEntity(ad)

  const ad2 = new Entity()
  ad2.setParent(parent)
  ad2.addComponent(new PlaneShape())

  ad2.addComponent(
    new OnPointerDown(
      () => {
        openExternalURL(adURL)
      },
      { distance: 20 }
    )
  )

  if (spacingAxis === 'x') {
    adXPos += 0.1
  } else if (spacingAxis === 'z') {
    adZPos += 0.1
  }

  const ad2Transform = new Transform({
    position: new Vector3(adXPos, adYPos, adZPos),
    rotation: Quaternion.Euler(adRot3, adRot2, adRot1),
    scale: new Vector3(adYScale * adWidthRatio, adYScale, 1)
  })
  ad2.addComponent(ad2Transform)
  ad2.addComponent(adMaterial)
  //engine.addEntity(ad2)
}

export function halloweenGallery(parent: Entity) {
  const gltfShapeJackolantern = new GLTFShape('models/claw_machine/pumpkinOrange.glb')

  const jackolantern = new Entity()
  jackolantern.setParent(parent)
  jackolantern.addComponentOrReplace(gltfShapeJackolantern)
  jackolantern.addComponent(
    new Transform({
      position: new Vector3(3, 0, 31),
      rotation: Quaternion.Euler(0, 30, 0),
      scale: new Vector3(1.25, 1.25, 1.25)
    })
  )

  const jackolantern2 = new Entity()
  jackolantern2.setParent(parent)
  jackolantern2.addComponentOrReplace(gltfShapeJackolantern)
  jackolantern2.addComponent(
    new Transform({
      position: new Vector3(17, 0, 31),
      rotation: Quaternion.Euler(0, -30, 0),
      scale: new Vector3(1.25, 1.25, 1.25)
    })
  )
}


export function addGroundColliderWithParent( //same as addGroundCollider but with parent
  posX: number,
  posY: number,
  posYadj: number,
  posZ: number,
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  color: Color3,
  parent: Entity
) {
  const groundfloorPosY = posY
  const groundcolliderPosY = groundfloorPosY - posYadj
  const groundcollider = new Entity()
  const groundcolliderShape = new BoxShape()
  groundcolliderShape.withCollisions = true
  groundcollider.addComponent(groundcolliderShape)
  const groundcolliderMaterial = new Material()
  groundcolliderMaterial.albedoColor = color
  groundcolliderMaterial.metallic = 0.0
  groundcolliderMaterial.roughness = 1
  groundcollider.addComponent(groundcolliderMaterial)
  groundcollider.addComponent(
    new Transform({
      position: new Vector3(posX, groundcolliderPosY, posZ),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(scaleX, scaleY, scaleZ)
    })
  )
  //engine.addEntity(groundcollider)
  groundcollider.setParent(parent)
}
