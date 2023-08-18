import { addCrossRealm } from './crossrealm/index'

export const crossRealmAvatars = addCrossRealm('wss://websockets.dclnodes.io/', {
  cars: [
    {
      image: new Texture('models/avatars/bolt/image.png'),
      model: 'models/avatars/bolt/model.glb',
      name: 'bolt',
      scale: new Vector3().setAll(5),
      hidden: false
    },
    {
      image: new Texture('models/avatars/guerilla/image.png'),
      model: 'models/avatars/guerilla/model.glb',
      name: 'guerilla',
      scale: new Vector3().setAll(5),
      hidden: false
    },
    {
      image: new Texture('models/avatars/zeta/image.png'),
      model: 'models/avatars/zeta/model.glb',
      name: 'zeta',
      scale: new Vector3().setAll(5),
      hidden: false
    },
    {
      image: new Texture('models/avatars/hyperion/image.png'),
      model: 'models/avatars/hyperion/model.glb',
      name: 'hyperion',
      scale: new Vector3().setAll(5),
      hidden: false
    },
    {
      image: new Texture('models/avatars/vista/image.png'),
      model: 'models/avatars/vista/model.glb',
      name: 'vista',
      scale: new Vector3().setAll(5),
      hidden: false
    },
    {
      image: new Texture('models/avatars/python/image.png'),
      model: 'models/avatars/python/model.glb',
      name: 'python',
      scale: new Vector3().setAll(5),
      hidden: false
    }
  ]
})
