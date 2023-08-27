/*
 * DCL Racing Game by NFTWorld.io
 * Game Entry Point
 * This file works in concert with gameplay-system to manage the scene and game state
*/

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* we use @ts-ignore a lot because for some reason we're not able to override SDK6 tsconfig es version */
/* this may be fixed when upgrading to SDK7 */

import { boardParent, playNowPaid, playNowFree } from './leaderboard'
// import { createTimer } from './timer'
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { getUserData } from '@decentraland/Identity'
import gameplaySystem from './gameplay-system'
import { OkPrompt, displayAnnouncement } from '@dcl/ui-scene-utils'
import config from './config'
import { MovementBind } from './movement-bind'
import { scene } from './scene'
import { cancelButton, uiCanvas } from './user-interface'
import { loopGate, startGate } from './gates'
import { cancelEntry } from './backend'
import {
  DirectionColliderFlag,
  Level1CornerFlag,
  Level1StraightFlag,
  Level2CornerFlag,
  Level2StraightFlag,
  Level3CornerFlag,
  Level3StraightFlag
} from './track'

const scenePosY = scene.getComponent(Transform).position.y
const movementBind = new MovementBind()
gameplaySystem.movementBind = movementBind

let stage = 0
let stage1 = false
let stage2 = false
let stage3 = false
let stage4 = false
let startRace = false //changed to true after the Countdown system completes 321Go! and then turned false again after gate is opened and race is started
let playerIsOnTheTrack = false
let movingToPolePosition = false

boardParent.setParent(scene)

const defaultMetadata = {
  environment: 'ufo',
  vehicle: 'zeta',
  floor: 1,
  track: '8',
  position: {
    x: config.scene.pole.x,
    y: config.scene.pole.y,
    z: config.scene.pole.z
  }
}

let colliders: IEntity[] = []
const directionCollidersGroup = engine.getComponentGroup(DirectionColliderFlag)

const resetGatesAndColliders = () => {
  startGate.getComponent(Transform).position.z = 7.05
  loopGate.getComponent(Transform).position.set(9.95, 12.35, 29.4)
  for (const ent of directionCollidersGroup.entities) {
    ent.getComponent(Transform).rotation.setEuler(0, 0, 0)
  }
}

const addDirectionColliders = () => {
  for (const ent of colliders) engine.addEntity(ent)
}

const removeDirectionColliders = () => {
  colliders = []
  while (directionCollidersGroup.entities.length) {
    colliders.push(directionCollidersGroup.entities[0])
    engine.removeEntity(directionCollidersGroup.entities[0])
  }
}

const setup = () => {
  stage = 1
  stage1 = true

  gameplaySystem.events.once('racing:game:starting', () => {
    addDirectionColliders()
    stage = 2
    stage2 = true
    engine.addSystem(new countDown())
  })

  gameplaySystem.events.once('racing:game:started', () => {
    stage = 3
    stage3 = !stage3 //stage 3 is now true but we aren't using it because we're using startRace instead
    startRace = true
    // const { timer, killTimer } = createTimer(uiCanvas)
    // gameplaySystem.killTimer = killTimer
    // gameplaySystem.timer = timer
  })

  gameplaySystem.events.once('racing:game:finished', () => {
    resetGatesAndColliders()
    removeDirectionColliders()
    if (stage !== 3) return
    stage = 4
    // gameplaySystem.killTimer()
    gameplaySystem.timer.visible = false
  })
}

playNowFree.addComponent(
  new OnPointerDown(
    async () => {
      const user = await getUserData()
      if (!user?.publicKey) return

      if (gameplaySystem.players.length === config.game.playerLimit)
        return new OkPrompt('This game has the maximum number of players')

      if (gameplaySystem.state !== 'Registration')
        return new OkPrompt('The game is still loading, please try again in a moment')

      await gameplaySystem.addPlayer(user.publicKey!, undefined, defaultMetadata)

      // For local single player testing, add more players
      for (const fakeUser of config.game.fakeUsers) {
        await gameplaySystem.addPlayer(fakeUser, undefined, defaultMetadata)
      }

      setup()
    },
    { distance: 20 }
  )
)

if (config.game.enablePaidGames) {
  playNowPaid.addComponent(
    new OnPointerDown(
      async () => {
        const user = await getUserData()
        if (!user?.publicKey) return

        if (gameplaySystem.players.length === config.game.playerLimit)
          return new OkPrompt('This game has the maximum number of players')

        if (gameplaySystem.state !== 'Registration')
          return new OkPrompt('The game is still loading, please try again in a moment')

        new OkPrompt(`The next signature request is to pay the ${config.fees.entryFee} Polygon MANA entry fee`, () => {
          void (async () => {
            try {
              const user = await getUserData()
              if (!user) return

              const txText = new UIText(uiCanvas)
              txText.value = 'Transaction pending...'
              txText.fontAutoSize = true

              const tx: any = await gameplaySystem.feeProvider.registerUser(user.publicKey!)
              txText.visible = false

              log('game:tx', tx)

              if (tx?.error) throw new Error(tx.error)
              await gameplaySystem.addPlayer(user.publicKey!, tx.txId, defaultMetadata)

              // ----------------------------------------------------------------------------------------
              // For local single player testing, add more players
              for (const fakeUser of config.game.fakeUsers) {
                await gameplaySystem.addPlayer(fakeUser, '0xDEADBEEFCAFE', defaultMetadata)
              }
              // ----------------------------------------------------------------------------------------
            } catch (err: any) {
              movementBind.loose()
              log('registerUser:error', err.message)
              return new OkPrompt(err.message)
            }

            setup()
          })()
        })
      },
      { distance: 20 }
    )
  )
} else {
  playNowPaid.addComponent(
    new OnPointerDown(
      () => {
        new OkPrompt('Paid games are currently disabled')
      },
      {
        button: ActionButton.ANY,
        hoverText: 'Paid Games Disabled'
      }
    )
  )
}

let direction = "up"
let hasFinished = false

const level1CornerGroup = engine.getComponentGroup(Level1CornerFlag)
const level1StraightGroup = engine.getComponentGroup(Level1StraightFlag)
const level2CornerGroup = engine.getComponentGroup(Level2CornerFlag)
const level2StraightGroup = engine.getComponentGroup(Level2StraightFlag)
const level3CornerGroup = engine.getComponentGroup(Level3CornerFlag)
const level3StraightGroup = engine.getComponentGroup(Level3StraightFlag)

class gamePlayMechanics {
  feetPosYthreshold = 0.16
  // groundPosY = 0.154 //orignal value - works in local preview but not in-world
  // groundPosY = 0.15 //works in local preview but not in-world
  // groundPosY = 0.14 //works in local preview but not in-world
  groundPosY = 0
  polePositionPosZ = config.scene.pole.z ?? 5.3001
  level1WallsRemoved = false
  level2WallsRemoved = false
  level3WallsRemoved = false
  level4WallsRemoved = false

  update() {
    if (gameplaySystem.direction === 'up') {
      if (gameplaySystem.position.floor === 1) {
        if (!this.level1WallsRemoved) {
          for (const entity of level1StraightGroup.entities) { removeWalls(entity) }
          for (const entity of level1CornerGroup.entities) { removeWalls(entity) }
          this.level1WallsRemoved = true
        }

        if (!this.level2WallsRemoved) {
          for (const entity of level2StraightGroup.entities) { removeWalls(entity) }
          for (const entity of level2CornerGroup.entities) { removeWalls(entity) }
          this.level2WallsRemoved = true
        }

        if (!this.level3WallsRemoved) {
          for (const entity of level3StraightGroup.entities) { removeWalls(entity) }
          for (const entity of level3CornerGroup.entities) { removeWalls(entity) }
          this.level3WallsRemoved = true
        }
      }

      if (gameplaySystem.position.floor === 2) {
        if (this.level1WallsRemoved) { 
          for (const entity of level1StraightGroup.entities) { addWalls(entity) }
          for (const entity of level1CornerGroup.entities) { addWalls(entity) }
          this.level1WallsRemoved = false
        }
      }

      if (gameplaySystem.position.floor === 3) {
        if (this.level2WallsRemoved) { 
          for (const entity of level2StraightGroup.entities) { addWalls(entity) }
          for (const entity of level2CornerGroup.entities) { addWalls(entity) }
          this.level2WallsRemoved = false
        }
      }

      if (gameplaySystem.position.floor === 4) {
        if (this.level3WallsRemoved) { 
          for (const entity of level3StraightGroup.entities) { addWalls(entity) }
          for (const entity of level3CornerGroup.entities) { addWalls(entity) }
          this.level3WallsRemoved = false
        }
      }
    }

    if (gameplaySystem.direction === 'down') {
      if (gameplaySystem.position.floor === 3) {
        if (!this.level3WallsRemoved) {
          for (const entity of level3StraightGroup.entities) { removeWalls(entity) }
          for (const entity of level3CornerGroup.entities) { removeWalls(entity) }
          this.level3WallsRemoved = true
        }
      }

      if (gameplaySystem.position.floor === 2) {
        if (!this.level2WallsRemoved) {
          for (const entity of level2StraightGroup.entities) { removeWalls(entity) }
          for (const entity of level2CornerGroup.entities) { removeWalls(entity) }
          this.level2WallsRemoved = true
        }
      }

      if (gameplaySystem.position.floor === 1) {
        if (!this.level1WallsRemoved) {
          for (const entity of level1StraightGroup.entities) { removeWalls(entity) }
          for (const entity of level1CornerGroup.entities) { removeWalls(entity) }
          this.level1WallsRemoved = true
        }
      }
    }

    if (stage === 1 && stage1) {
      hasFinished = false
      //teleport racers to the line
      polePosition()

      //box them in so they cant move away
      movementBind.bind(config.scene.pole)

      cancelButton.visible = true

      cancelButton.onClick = new OnPointerDown(() => {
        log('cancelEntry:confirm', gameplaySystem.id)
        new OkPrompt(
          'Are you sure you want to leave this race',
          async () => {
            log('cancelEntry:cancel', gameplaySystem.id)
            
            gameplaySystem.playerJoinedText.value = 'Cancelling your entry...'
            gameplaySystem.playerJoinedText.visible = true
            cancelButton.visible = false
            movementBind.loose()
            if (!gameplaySystem.id) return

            try {
              const result = await cancelEntry(gameplaySystem.id)
              log('cancelEntry:result', result)
              if (!result || result.error) throw new Error(result?.error || 'Network error')
              gameplaySystem.events.emit('racing:player:unregistered')
            } catch (err: any) {
              log(err.message)
              new OkPrompt(
                gameplaySystem.game.type === 'free'
                ? 'There was an error cancelling your entry. Please try again.'
                : 'There was an error refunding your entry. Please contact support.'
              )

              cancelButton.visible = true
            } finally {
              gameplaySystem.playerJoinedText.value = ''
              gameplaySystem.playerJoinedText.visible = false
            }
          },
          'Leave'
        )
      })

      //stop the above from repeating over and over
      stage1 = !stage1
    }

    if (stage === 2 && stage2) {
      cancelButton.visible = false
      // 3-2-1-Go
      // engine.addSystem(new countDown())
      stage2 = !stage2
    }

    if (stage === 3) {
      // log("stage is 3")
      if (startRace) {
        log("race is started")
        //set by Countdown system below after 321Go! completes
        //release pole position
        movementBind.loose()

        //open the gate
        gameplaySystem.log('opening the gate')
        startGate.getComponent(Transform).position.z = 5
        //startGate.getComponent(Transform).scale = Vector3.Zero()
        //startGateShape.withCollisions = false

        //start the timer
        // moved to gameplaySystem
        // const { killTimer } = createTimer(uiCanvas, {
        //   onComplete: () => {
        //     // placeholder
        //   }
        // })

        // gameplaySystem.killTimer = killTimer
        startRace = !startRace
      }

      //user has left pole position and is now on the track
      if (
        Camera.instance.feetPosition.z > this.polePositionPosZ &&
        Camera.instance.feetPosition.y > this.feetPosYthreshold
      ) {
        playerIsOnTheTrack = true
      }

      // gameplaySystem.log(Camera.instance.feetPosition.x, Camera.instance.feetPosition.y, Camera.instance.feetPosition.z)

      //if user is past pole position and falls off the track
      if (
        !hasFinished &&
        playerIsOnTheTrack &&
        Camera.instance.feetPosition.y < this.feetPosYthreshold &&
        Camera.instance.feetPosition.y >= this.groundPosY
      ) {
        gameplaySystem.log('player fell off the track')
        gameplaySystem.log(Camera.instance.feetPosition.asArray())
        direction = 'up'
        gameplaySystem.direction = 'up'
        polePosition()
      }

      if (hasFinished) stage = 4

      //when racer reaches the loop, switch the colliders around so that user can come back down the track in the opposite direction
      if (
        Camera.instance.feetPosition.x < 11 &&
        Camera.instance.feetPosition.y > config.scene.yBase + 11.2 &&
        Camera.instance.feetPosition.z < 61 &&
        direction === 'up'
      ) {
        // log('loop gate reached')
        for (const ent of directionCollidersGroup.entities) {
          ent.getComponent(Transform).rotation.setEuler(0, 180, 0)
        }

        loopGate.getComponent(Transform).position.set(2, 12.35, 29.4)
        direction = 'down'
        gameplaySystem.direction = 'down'
      }

      //if user reaches finish line
      if (
        Camera.instance.feetPosition.x > 36 &&
        Camera.instance.feetPosition.x < 39 &&
        Camera.instance.feetPosition.z < 41 &&
        gameplaySystem.position.track === 8 &&
        gameplaySystem.position.floor === 1 &&
        direction === 'down' &&
        !hasFinished
      ) {
        hasFinished = true
        void gameplaySystem.finishLine(gameplaySystem.me as string)
      }
    }

    if (stage === 4) {
      //race has ended - determine places and show appropriate splash screen
      if (gameplaySystem.killTimer) gameplaySystem.killTimer()
      if (gameplaySystem.timer) gameplaySystem.timer.value = ''
      movementBind.loose() // Be sure player is released from pole position
      direction = 'up'

      let splashTextureURL = ''
      let splashTextPlace = ''
      let splashTextMessage = ''
      const splashTextTime = gameplaySystem.myTime

      //dev
      // splashTextureURL = config.splash.first
      // splashTextPlace = '1st'
      // splashTextMessage = '\nCongratulations!\nYou gained 4 MANA'
      // splashTextTime = gameplaySystem.lastTime || gameplaySystem.myTime || '?'

      const prizes = gameplaySystem.game.prizes[gameplaySystem.players.length.toString()]

      if (gameplaySystem.myPlace! > 0) {
        if (gameplaySystem.players.length === 2) {
          if (gameplaySystem.myPlace === 1) {
            splashTextureURL = config.splash.first
            splashTextPlace = '1st'
            if (gameplaySystem.game.type === "free") {
              splashTextMessage = '\nCongratulations!'
            } else {
              splashTextMessage = `\nCongratulations!\nYou gained ${prizes.first} MANA`
            }
          }
          if (gameplaySystem.myPlace === 2) {
            splashTextureURL = config.splash.secondBronze
            splashTextPlace = '2nd'
            splashTextMessage = '\nBetter luck next time'
          }
        }

        if (gameplaySystem.players.length === 3) {
          if (gameplaySystem.myPlace === 1) {
            splashTextureURL = config.splash.first
            splashTextPlace = '1st'
            if (gameplaySystem.game.type === "free") {
              splashTextMessage = '\nCongratulations!'
            } else {
              splashTextMessage = `\nCongratulations!\nYou gained ${prizes.first} MANA`
            }
          }
          if (gameplaySystem.myPlace === 2) {
            splashTextureURL = config.splash.second
            splashTextPlace = '2nd'
            if (gameplaySystem.game.type === "free") {
              splashTextMessage = '\nNot bad!'
            } else {
              splashTextMessage = `\nYou get ${prizes.second} MANA back`
            }
          }
          if (gameplaySystem.myPlace === 3) {
            splashTextureURL = config.splash.third
            splashTextPlace = '3rd'
            splashTextMessage = '\nBetter luck next time'
          }
        }

        if (gameplaySystem.players.length === 4) {
          if (gameplaySystem.myPlace === 1) {
            splashTextureURL = config.splash.first
            splashTextPlace = '1st'
            if (gameplaySystem.game.type === "free") {
              splashTextMessage = '\nCongratulations!'
            } else {
              splashTextMessage = `\nCongratulations!\nYou gained ${prizes.first} MANA`
            }
          }
          if (gameplaySystem.myPlace === 2) {
            splashTextureURL = config.splash.second
            splashTextPlace = '2nd'
            if (gameplaySystem.game.type === "free") {
              splashTextMessage = '\nNot bad!'
            } else {
              splashTextMessage = `\nYou get ${prizes.second} MANA back`
            }
          }
          if (gameplaySystem.myPlace === 3) {
            splashTextureURL = config.splash.third
            splashTextPlace = '3rd'
            splashTextMessage = '\nBetter luck next time'
          }
          if (gameplaySystem.myPlace === 4) {
            splashTextureURL = config.splash.fourth
            splashTextPlace = '4th'
            splashTextMessage = '\nBetter luck next time'
          }
        }

        const splashTexture = new Texture(splashTextureURL)
        const splash = new UIImage(uiCanvas, splashTexture)
        splash.sourceWidth = 994
        splash.sourceHeight = 661
        splash.width = 994
        splash.height = 661
        splash.hAlign = 'middle'
        splash.vAlign = 'center'
        splash.isPointerBlocker = true
        splash.onClick = new OnPointerDown(() => {
          splash.isPointerBlocker = false
          splash.visible = false
          splashTextComponent.visible = false
          splashTextHeader.visible = false
        })

        const splashTextComponent = new UIText(uiCanvas)
        splashTextComponent.fontSize = 25
        splashTextComponent.value = 'Your time: ' + splashTextTime + '\n' + splashTextMessage
        splashTextComponent.adaptWidth = true
        splashTextComponent.adaptHeight = true
        splashTextComponent.vAlign = 'middle'
        splashTextComponent.paddingLeft = -155
        splashTextComponent.isPointerBlocker = false

        const splashTextHeader = new UIText(uiCanvas)
        splashTextHeader.fontSize = 75
        splashTextHeader.value = splashTextPlace + ' Place'
        splashTextHeader.paddingBottom = 100
        splashTextHeader.paddingLeft = -240
        splashTextHeader.isPointerBlocker = false
      } else {
        const paidPortion = gameplaySystem.game.type === 'paid' ? '. All players refunded.' : ''
        if (gameplaySystem.myPlace === 0) 
          new (displayAnnouncement as any)(`The game was a tie${paidPortion}`, 5)
        else if (gameplaySystem.myPlace === -1)
          new (displayAnnouncement as any)(`You never moved!`, 5)
      }

      movementBind.loose()
      stage4 = !stage4
      stage = 5
    }
  }
}

engine.addSystem(new gamePlayMechanics())

export class countDown {
  countDownTextComponent = new UIText(uiCanvas)
  fontSizeScale = 1
  fontSizeScaleLimit = 250
  fontSizeScaleMultiplier = 2
  fontSizeNumber = 1000
  countDownText = ''
  start = Date.now() + 5000
  debug = false

  constructor(debug = false) {
    this.debug = debug
  }

  update() {
    const countdown = gameplaySystem.game?.game_start
      ? (gameplaySystem.game.game_start - Date.now()) / 1000
      : (this.start - Date.now()) / 1000

    if (this.debug) {
      stage = 2
      stage2 = true
    }

    if (stage === 2) {
      this.countDownTextComponent.value = ''
      this.countDownTextComponent.adaptWidth = true
      this.countDownTextComponent.adaptHeight = true
      this.countDownTextComponent.hAlign = 'center'
      this.countDownTextComponent.vAlign = 'middle'
      this.countDownTextComponent.isPointerBlocker = false

      if (countdown < 3 && countdown >= 2) {
        if (this.countDownText === '') this.fontSizeScale = 1
        this.countDownText = '3'
        this.countDownTextComponent.fontSize = this.fontSizeNumber / this.fontSizeScale
        if (this.countDownTextComponent.fontSize > this.fontSizeScaleLimit)
          this.fontSizeScale = this.fontSizeScale * this.fontSizeScaleMultiplier
      }

      if (countdown < 2 && countdown >= 1) {
        if (this.countDownText === '3') this.fontSizeScale = 1
        this.countDownText = '2'
        this.countDownTextComponent.fontSize = this.fontSizeNumber / this.fontSizeScale
        if (this.countDownTextComponent.fontSize > this.fontSizeScaleLimit)
          this.fontSizeScale = this.fontSizeScale * this.fontSizeScaleMultiplier
      }

      if (countdown < 1 && countdown >= 0) {
        if (this.countDownText === '2') this.fontSizeScale = 1
        this.countDownText = '1'
        this.countDownTextComponent.fontSize = this.fontSizeNumber / this.fontSizeScale
        if (this.countDownTextComponent.fontSize > this.fontSizeScaleLimit)
          this.fontSizeScale = this.fontSizeScale * this.fontSizeScaleMultiplier
      }

      if (countdown < 0) {
        if (this.countDownText === '1') this.fontSizeScale = 1
        this.countDownText = 'Go!'
        this.countDownTextComponent.fontSize = this.fontSizeNumber / this.fontSizeScale
        if (this.countDownTextComponent.fontSize > this.fontSizeScaleLimit)
          this.fontSizeScale = this.fontSizeScale * this.fontSizeScaleMultiplier
      }
    }

    if (countdown <= -2) {
      this.countDownText = ''
      this.countDownTextComponent.visible = false
      engine.removeSystem(this)
    }

    this.countDownTextComponent.value = this.countDownText
  }
}

// dev
// engine.addSystem(new countDown(true))

function polePosition() {
  if (movingToPolePosition) return
  movingToPolePosition = true

  const movePlayerPosX = config.scene.pole.x ?? 30.695
  const movePlayerPosY = (config.scene.pole.y ?? 0) + scenePosY
  const movePlayerPosZ = config.scene.pole.z ?? 5.3 //anything more than this returns an error about look rotation vector being zero(from the crossrealm/avatars code) but 7 is more preferable
  // log('polePosition', {
  //   scenePosY,
  //   movePlayerPosX,
  //   movePlayerPosY,
  //   movePlayerPosZ
  // })

  playerIsOnTheTrack = false //player is not on the track while in pole position. They must move forward to enter the track

  // Make sure we update our new position as quickly as possible
  void gameplaySystem.recordPlayerLastPosition('up', 1, 8, new Vector3(movePlayerPosX, movePlayerPosY, movePlayerPosZ))

  void movePlayerTo(
    { x: movePlayerPosX, y: movePlayerPosY, z: movePlayerPosZ },
    { x: movePlayerPosX, y: movePlayerPosY, z: movePlayerPosZ }
  )

  movingToPolePosition = false

  //when falling off the track, we need to make sure the direction coliders are facing the correct way for going up the track (user may have been coming down the track)
  for (const ent of directionCollidersGroup.entities) {
    ent.getComponent(Transform).rotation.setEuler(0, 0, 0)
  }

  //set the gate at the top to the correct position
  loopGate.getComponent(Transform).position.set(9.95, 12.35, 29.4)
}

function removeWalls(entity:IEntity) {
  for (const child in entity.children) {
    let directionCollider = false

    if (Object.prototype.hasOwnProperty.call(entity.children, child)) {
      for (const ent of directionCollidersGroup.entities) {
        if (ent === entity.children[child]) directionCollider = true
      }

      if (!directionCollider) entity.children[child].getComponent(Transform).scale = Vector3.Zero()
    }
  }
}

function addWalls(entity:IEntity) {
  for (const child in entity.children) {
    let directionCollider = false

    if (Object.prototype.hasOwnProperty.call(entity.children, child)) {
      for (const ent of directionCollidersGroup.entities) {
        if (ent === entity.children[child]) directionCollider = true
      }

      if (!directionCollider) entity.children[child].getComponent(Transform).scale = Vector3.One()
    }
  }
}
