/*
 * DCL Racing Game by NFTWorld.io
 * Gameplay System
 * This is the main system that handles the multiplayer game logic
*/

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* we use @ts-ignore a lot because for some reason we're not able to override SDK6 tsconfig es version */
/* this may be fixed when upgrading to SDK7 */

import * as utils from '@dcl/ecs-scene-utils'
import { Interval, setTimeout } from '@dcl/ecs-scene-utils'
import { CornerLabel } from '@dcl/ui-scene-utils'
import { getUserPublicKey } from '@decentraland/Identity'
import { getPlayerData } from '@decentraland/Players'
import { movePlayerTo } from '@decentraland/RestrictedActions'

import config from './config'
import EventEmitter from './events'
import { padZero } from 'src/globalfunctions'
import { getGame, getCurrentGameId, recordUser, recordFinish, setFinalPosition, recordUserMetadata } from './backend'
import { boardParent, playNowPaid, playNowFree, updateBoard } from './leaderboard'
import { MovementBind } from './movement-bind'
import { FeeProvider } from './fees'
import {
  ufoEnvironmentImage,
  chicagoEnvironmentImage,
  instructionsButton,
  cancelButton,
  uiCanvas,
  showElevatorButton,
  hideElevatorButton
} from './user-interface'

type Track = {
  pos: Vector3
  rot: Quaternion
  scl: Vector3
  trackNumber: any
  floor: number
  primaryAxis: string
  primaryAxisReversed: boolean
  secondaryAxis: 'x' | 'y' | 'z' | boolean
  secondaryAxisReversed: boolean
}

type Position = {
  floor: number
  track: number
  direction: string
  position: Vector3
  primaryAxis: string
  primaryAxisReversed: boolean
  secondaryAxis: 'x' | 'y' | 'z' | boolean
  secondaryAxisReversed: boolean
}

const TrackRanking: string[] = []
// @ts-ignore
for (const [floor, tracks] of config.trackOrder.entries()) {
  for (const track of tracks) {
    TrackRanking.push(`${floor}:${track}`)
  }
}

let playerIsInScene = false
let UICanvasImagesHidden = true
export class GameplaySystem implements ISystem {
  id?: number
  me?: string | null
  bus: MessageBus
  state: string | undefined
  events: EventEmitter
  feeProvider: FeeProvider = new FeeProvider()
  players: Array<string>
  playerPositions?: {
    [address: string]: {
      address: string
      position: Position
      direction: 'up' | 'down'
    }
  }
  lastPosition: {
    floor: number
    track: number
    direction: 'up' | 'down'
    position: Vector3
  }
  position: Position
  movementBind?: MovementBind
  direction: 'up' | 'down'
  syncEntity: Entity
  syncInterval: Interval
  positionSyncEntity: Entity
  positionInterval: Interval
  currentPlace?: CornerLabel
  raceIdLabel: CornerLabel
  debugInfo: CornerLabel
  game: any
  lastTime?: string
  trackOrder: Array<Array<number>>
  track: Array<Track>
  localPlaces?: Array<string>
  killTimer: any
  timer: UIText
  gameInProgressEntity: Entity
  gameInProgressTimerEntity: Entity
  waitingForOpponentsTimer: UIText
  waitingForOpponentsText: UIText
  playerSlotsText: UIText
  playerJoinedText: UIText
  log: any

  constructor() {
    this.log = (...args: any[]) => log('[Racing Game]', ...args)

    getUserPublicKey()
      .then((address) => (this.me = address))
      .catch(log)

    this.track = []
    this.players = []
    this.direction = 'up'
    this.trackOrder = config.trackOrder
    this.bus = new MessageBus()
    this.events = new EventEmitter()
    void this.feeProvider.init()

    this.syncEntity = new Entity()
    this.positionSyncEntity = new Entity()
    this.syncInterval = new Interval(config.backend.syncInterval, this.syncState.bind(this))
    this.positionInterval = new Interval(config.backend.positionInterval, this.syncPosition.bind(this))
    this.syncEntity.addComponent(this.syncInterval)
    this.positionSyncEntity.addComponent(this.positionInterval)
    engine.addEntity(this.syncEntity)
    engine.addEntity(this.positionSyncEntity)

    this.lastPosition = {
      floor: 1,
      track: this.trackOrder[1][0],
      direction: 'up',
      position: Camera.instance.feetPosition
    }

    this.position = {
      ...this.lastPosition,
      direction: 'up',
      position: Camera.instance.feetPosition,
      primaryAxis: 'z',
      primaryAxisReversed: false,
      secondaryAxis: false,
      secondaryAxisReversed: false
    }

    this.debugInfo = new CornerLabel(`${this.direction}:${this.position.floor}:${this.position.track}`)
    if (!config.game.showTrackIDs) this.debugInfo.hide()

    this.raceIdLabel = new CornerLabel('', -10, 50, undefined, 10)

    boardParent.addComponentOrReplace(
      new utils.Interval(config.backend.leaderboardUpdateInterval, () => {
        if (!playerIsInScene) return
        updateBoard().catch((error) => log(error))
      })
    )

    this.gameInProgressEntity = new Entity()
    this.gameInProgressEntity.addComponent(new Transform({ position: new Vector3(1, -1.5, 0), scale: Vector3.Zero() }))
    this.gameInProgressEntity.addComponent(new TextShape('Game in progress'))
    this.gameInProgressEntity.setParent(boardParent)
    this.gameInProgressEntity.getComponent(TextShape).fontSize = 3

    this.gameInProgressTimerEntity = new Entity()
    this.gameInProgressTimerEntity.addComponent(
      new Transform({ position: new Vector3(1, -2, 0), scale: Vector3.Zero() })
    )
    this.gameInProgressTimerEntity.addComponent(new TextShape('00:00'))
    this.gameInProgressTimerEntity.setParent(boardParent)
    this.gameInProgressTimerEntity.getComponent(TextShape).fontSize = 3

    this.waitingForOpponentsText = new UIText(uiCanvas)
    this.waitingForOpponentsText.visible = false
    this.waitingForOpponentsText.value = 'Waiting for opponents...'
    this.waitingForOpponentsText.fontSize = 40
    this.waitingForOpponentsText.positionX = 0
    this.waitingForOpponentsText.positionY = 70
    this.waitingForOpponentsText.hTextAlign = 'center'
    this.waitingForOpponentsText.color = Color4.Yellow()

    this.waitingForOpponentsTimer = new UIText(uiCanvas)
    this.waitingForOpponentsTimer.visible = false
    this.waitingForOpponentsTimer.value = '00:00'
    this.waitingForOpponentsTimer.fontSize = 50
    this.waitingForOpponentsTimer.positionX = 0
    this.waitingForOpponentsTimer.positionY = -50 //swapped with playerSlotsText below
    this.waitingForOpponentsTimer.color = Color4.White()

    this.playerSlotsText = new UIText(uiCanvas)
    this.playerSlotsText.visible = false
    this.playerSlotsText.value = ''
    this.playerSlotsText.fontSize = 50
    this.playerSlotsText.positionX = 20
    this.playerSlotsText.positionY = 0 //swapped with waitingForOpponentsTimer above
    this.playerSlotsText.color = Color4.White()

    this.playerJoinedText = new UIText(uiCanvas)
    this.playerJoinedText.visible = false
    this.playerJoinedText.value = ''
    this.playerJoinedText.fontSize = 30 
    this.playerJoinedText.adaptHeight
    this.playerJoinedText.adaptWidth
    this.playerJoinedText.hAlign = "center"
    this.playerJoinedText.hTextAlign = "center"
    // this.playerJoinedText.positionX = -200 //changed from -100 to 0
    this.playerJoinedText.positionY = 150 //changed from -150 to 150
    this.playerJoinedText.color = Color4.Yellow()

    this.timer = new UIText(uiCanvas)
    this.timer.fontSize = 15
    this.timer.vAlign = 'bottom'
    this.timer.hAlign = 'right'
    this.timer.width = 120
    this.timer.height = 30
    this.timer.positionX = -70
    this.timer.color = Color4.White()
    this.timer.visible = false

    this.bus.on('racing:player:registered', async (user: any) => {
      if (!playerIsInScene) return
      const userData = await getPlayerData({ userId: user?.address })
      // log({ userData, user })
      if (!userData) return
      this.playerJoinedText.visible = true
      this.playerJoinedText.hAlign = 'middle'
      this.playerJoinedText.value = `${userData.displayName} has joined the race!`
      setTimeout(3000, () => {
        this.playerJoinedText.visible = false
        this.playerJoinedText.value = ''
      })
    })

    this.bus.on('racing:player:unregistered', async (user: any) => {
      if (!playerIsInScene) return
      const userData = await getPlayerData({ userId: user?.address })
      // log({ userData, user })
      if (!userData || !this.game?.players?.includes(user?.address)) return
      this.playerJoinedText.visible = true
      this.playerJoinedText.hAlign = 'middle'
      this.playerJoinedText.value = `${userData.displayName} has left the race!`
      setTimeout(3000, () => {
        this.playerJoinedText.visible = false
        this.playerJoinedText.value = ''
      })
    })

    onPlayerDisconnectedObservable.add((player) => {
      // @ts-ignore
      if (this.players.includes(player.userId)) this.bus.emit('racing:player:unregistered', { address: player.userId })
    })

    this.bus.on('racing:finished', () => {
      if (this.timer) {
        this.timer.value = ''
        this.timer.visible = false
      }

      if (typeof this.killTimer === 'function') {
        this.killTimer()
        this.killTimer = undefined
      }
    })

    // Update local places list from the bus for faster UI updates
    // while the backend handles what's official
    this.bus.on('racing:position', (data: { player: string; position: Position; direction: 'up' | 'down' }) => {
      if (!this.me || !playerIsInScene) return
      if (!this.playerPositions) this.playerPositions = {}
      // log(
      //   'playerPositions',
      //   // @ts-ignore
      //   // Object.values(this.playerPositions).map((p) => [
      //   //   p.address,
      //   //   p.position.floor,
      //   //   p.position.track,
      //   //   p.direction,
      //   //   p.primaryAxis,
      //   //   p.position.x,
      //   //   p.position.z
      //   // ])
      // )

      if (
        config.game.teleportDown &&
        data.player === this.me &&
        this.playerPositions[data.player]?.direction !== data.direction &&
        data.direction === 'down'
      ) {
        void movePlayerTo(new Vector3(config.scene.finished.x ?? 38.54, config.scene.finished.y ?? 2.89, config.scene.finished.z ?? 58.09))
      }

      this.playerPositions[data.player] = {
        address: data.player,
        position: data.position as Position,
        direction: data.direction
      }

      if (this.game.state === 'Started') {
        // @ts-ignore
        const ranks = Object.entries(this.game.times || [])
          .sort((a: [string, number], b: [string, number]) => a[1] - b[1])
          .map((entry: any) => ({ address: entry[0], time: entry[1] }))

        // @ts-ignore
        const unfinishedPlayers = Object.values(this.playerPositions)
          .sort((a: any, b: any) => a.address - b.address)
          .sort((a: any, b: any) => {
            const aDirection = this.playerPositions?.[a.address]?.direction || 'up'
            const bDirection = this.playerPositions?.[b.address]?.direction || 'up'
            const aFloor = this.playerPositions?.[a.address]?.position.floor || 1
            const bFloor = this.playerPositions?.[b.address]?.position.floor || 1
            const aTrack = this.playerPositions?.[a.address]?.position.track || config.trackOrder[aFloor][0]
            const bTrack = this.playerPositions?.[b.address]?.position.track || config.trackOrder[bFloor][0]

            const aPosition = TrackRanking.indexOf(`${aFloor}:${aTrack}`)
            const bPosition = TrackRanking.indexOf(`${bFloor}:${bTrack}`)

            if (aDirection === 'down' && bDirection === 'up') return -1
            if (aDirection === 'up' && bDirection === 'down') return 1

            // log({
            //   a,
            //   b,
            //   aDirection,
            //   bDirection,
            //   aFloor,
            //   bFloor,
            //   aTrack,
            //   bTrack,
            //   aPosition,
            //   bPosition,
            //   result: aDirection === 'up' ? bPosition - aPosition : aPosition - bPosition
            // })

            return aDirection === 'up' ? bPosition - aPosition : aPosition - bPosition
          })
          .sort((a: any, b: any) => {
            const aDirection = this.playerPositions?.[a.address]?.direction || 'up'
            const bDirection = this.playerPositions?.[b.address]?.direction || 'up'
            const aFloor = this.playerPositions?.[a.address]?.position.floor || 1
            const bFloor = this.playerPositions?.[b.address]?.position.floor || 1
            const aTrack = this.playerPositions?.[a.address]?.position.track || config.trackOrder[aFloor][0]
            const bTrack = this.playerPositions?.[b.address]?.position.track || config.trackOrder[bFloor][0]

            if (aFloor === bFloor && aTrack === bTrack) {
              // Sort by position along section
              const aRecord = this.playerPositions?.[a.address] as any
              const bRecord = this.playerPositions?.[b.address] as any

              const { primaryAxis, secondaryAxis, primaryAxisReversed, secondaryAxisReversed } = aRecord.position

              const aPosition = aRecord?.position.position
              const bPosition = bRecord?.position.position

              if (!aPosition) return 1
              if (!bPosition) return -1

              // @ts-ignore
              const aPrimaryPosition = aPosition[primaryAxis]
              // @ts-ignore
              const bPrimaryPosition = bPosition[primaryAxis]

              if (aDirection === 'down' && bDirection === 'up') return 0 //-1
              if (aDirection === 'up' && bDirection === 'down') return 0 //1

              if (secondaryAxis) {
                const aSecondaryPosition = (aPosition as any)[secondaryAxis]
                const bSecondaryPosition = (bPosition as any)[secondaryAxis]
                const aIsSecondary = primaryAxisReversed
                  ? aPrimaryPosition < (config.cornerIntersections as any)[aTrack][primaryAxis]
                  : aPrimaryPosition > (config.cornerIntersections as any)[aTrack][primaryAxis]
                const bIsSecondary = primaryAxisReversed
                  ? bPrimaryPosition < (config.cornerIntersections as any)[bTrack][primaryAxis]
                  : bPrimaryPosition > (config.cornerIntersections as any)[bTrack][primaryAxis]

                const cornerResult =
                  aDirection === 'up'
                    ? secondaryAxisReversed
                      ? aSecondaryPosition - bSecondaryPosition
                      : bSecondaryPosition - aSecondaryPosition
                    : secondaryAxisReversed
                      ? bSecondaryPosition - aSecondaryPosition // eslint-disable-line
                      : aSecondaryPosition - bSecondaryPosition // eslint-disable-line

                // log('same corner', {
                //   a,
                //   b,
                //   aTrack,
                //   primaryAxis,
                //   secondaryAxis,
                //   primaryAxisReversed,
                //   secondaryAxisReversed,
                //   aIsSecondary,
                //   bIsSecondary,
                //   aPrimaryPosition,
                //   bPrimaryPosition,
                //   aSecondaryPosition,
                //   bSecondaryPosition,
                //   intersection: (config.cornerIntersections as any)[aTrack],
                //   cornerResult
                // })

                if (aIsSecondary || bIsSecondary) {
                  if (aIsSecondary && !bIsSecondary) return aDirection === 'up' ? -1 : 1
                  if (!aIsSecondary && bIsSecondary) return aDirection === 'up' ? 1 : -1
                  return cornerResult
                }
              }

              const result =
                aDirection === 'up'
                  ? primaryAxisReversed
                    ? aPrimaryPosition - bPrimaryPosition
                    : bPrimaryPosition - aPrimaryPosition
                  : primaryAxisReversed
                    ? bPrimaryPosition - aPrimaryPosition // eslint-disable-line
                    : aPrimaryPosition - bPrimaryPosition // eslint-disable-line

              // log('same track', {
              //   a,
              //   b,
              //   aDirection,
              //   bDirection,
              //   aFloor,
              //   bFloor,
              //   aTrack,
              //   bTrack,
              //   aPrimaryPosition,
              //   bPrimaryPosition,
              //   primaryAxis,
              //   primaryAxisReversed,
              //   secondaryAxis,
              //   secondaryAxisReversed,
              //   result
              // })

              return result
            } else return 0
          })
          .map((item: any) => item.address)

        // @ts-ignore
        // log(Object.values(ranks).map((r) => r.address), unfinishedPlayers)
        this.localPlaces = [...Object.values(ranks).map((r) => r.address), ...unfinishedPlayers]
        // log('\n', this.localPlaces, '\n', this.game.places, this.game)
      }
    })
  }

  nth(n: number) {
    // Figures out the proper ordinal for the input integer
    return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th'
  }

  get myPlace() {
    if (!this.me) return
    if (this.localPlaces && this.localPlaces.length !== this.players.length) this.localPlaces = this.game.places

    // Are all players still at pole position?
    const atStart: string[] = []

    // @ts-ignore
    for (const [address, { position }] of Object.entries(this.playerPositions)) {
      if (
        position.floor === 1 &&
        position.track === 8 &&
        position.direction === 'up' &&
        position.position?.x > 37.5 &&
        position.position?.x < 39.1 &&
        position.position?.z > 37.3 &&
        position.position?.z < 39
      ) {
        atStart.push(address)
      }
    }

    const allPlayersAtStart = atStart.length === this.players.length
    if (allPlayersAtStart) return 0

    // @ts-ignore
    if (atStart.includes(this.me)) return -1
    if (atStart.length === this.players.length) return 0

    const index = this.localPlaces?.indexOf(this.me)
    if (typeof index !== 'number' || index < 0) return 0
    return index + 1
  }

  get myTime() {
    if (!this.me || !this.game?.game_end) return
    let elapsedDuration = this.game?.times?.[this.me] || Date.now() - this.game?.game_start

    if (elapsedDuration > this.game?.game_end - this.game?.game_start)
      elapsedDuration = this.game?.game_end - this.game?.game_start

    if (elapsedDuration > config.game.timeLimit)
      elapsedDuration = config.game.timeLimit

    const elapsed = new Date(elapsedDuration)
    const elapsedMinutes = padZero(elapsed.getMinutes())
    const elapsedSeconds = padZero(elapsed.getSeconds())
    const elapsedMilliseconds = padZero(elapsed.getMilliseconds())
    return `${elapsedMinutes}:${elapsedSeconds}:${elapsedMilliseconds}`
  }

  get iAmRegistered() {
    // @ts-ignore
    // log('iAmRegistered?', this.me && this.players.includes(this.me), this.players, { game: this.id })
    return this.me && this.players.includes(this.me)
  }

  get iAmFinished() {
    return this.iAmRegistered && this.game?.times?.[this.me!]
  }

  update() {
    const { x, y, z } = Camera.instance.position

    if (
      x >= (config.scene.xMinBoundary ?? 8) &&
      x <= (config.scene.xMaxBoundary ?? 40) &&
      y >= (config.scene.yMinBoundary ?? 8) &&
      y <= (config.scene.yMaxBoundary ?? 40) &&
      z >= (config.scene.zMinBoundary ?? 32) &&
      z <= (config.scene.zMaxBoundary ?? 64)
    ) {
      playerIsInScene = true
    } else {
      playerIsInScene = false
    }

    if (playerIsInScene) {
      if (UICanvasImagesHidden) {
        ufoEnvironmentImage.visible = true
        chicagoEnvironmentImage.visible = true
        instructionsButton.visible = true
        UICanvasImagesHidden = false
      }
    }

    if (!playerIsInScene) {
      if (!UICanvasImagesHidden) {
        ufoEnvironmentImage.visible = false
        chicagoEnvironmentImage.visible = false
        instructionsButton.visible = false
        UICanvasImagesHidden = true
      }
    }

    if (!this.iAmRegistered) return
    if (config.game.showTrackIDs) this.debugInfo?.set(`${this.direction}:${this.position.floor}:${this.position.track}`)

    if (this.state === 'Started') {
      this.lastTime = this.myTime
      this.bus.emit('racing:position', { player: this.me, position: this.position, direction: this.direction })
      hideElevatorButton()

      const left = this.game.timeLeft || 0
      const elapsedTime = config.game.timeLimit - left

      if (elapsedTime >= config.game.timeLimit || elapsedTime >= this.game.game_end) {
        this.timer.visible = false
      } else {
        const elapsed = new Date(elapsedTime)
        const elapsedMinutes = padZero(elapsed.getMinutes())
        const elapsedSeconds = padZero(elapsed.getSeconds())
        const elapsedMilliseconds = padZero(elapsed.getMilliseconds())

        const max = new Date(config.game.timeLimit)
        const maxMinutes = padZero(max.getMinutes())
        const maxSeconds = padZero(max.getSeconds())
        const maxMilliseconds = padZero(max.getMilliseconds(), 100, '00')

        this.timer.value = `${elapsedMinutes}:${elapsedSeconds}:${elapsedMilliseconds} / ${maxMinutes}:${maxSeconds}:${maxMilliseconds}`
        this.timer.visible = true
      }

      if (this.myPlace && this.myPlace > 0) {
        const subscript = this.nth(this.myPlace)
        if (!this.currentPlace) this.currentPlace = new CornerLabel(this.myPlace + subscript, 0, 20)
        else this.currentPlace.set(this.myPlace + subscript)
      } else {
        this.currentPlace?.set('')
      }

      if (
        this.position.floor !== this.lastPosition.floor ||
        this.position.track !== this.lastPosition.track ||
        !this.game.places.includes(this.me)
      ) {
        void this.recordPlayerLastPosition(
          this.direction,
          this.position.floor,
          this.position.track,
          Camera.instance.feetPosition
        )
      }
    } else {
      showElevatorButton()
      this.currentPlace?.set('')
    }

    if (this.state === 'Finished') {
      this.currentPlace?.hide()
      this.bus.emit('racing:finished', this.game)
      this.movementBind?.loose() // Be sure player is released from pole position
    }
  }

  async syncPosition() {
    if (!playerIsInScene) return
    if (this.game?.state !== 'Started') return
    if (!this.iAmRegistered) return
    void this.recordPlayerLastPosition(this.direction, this.position.floor, this.position.track, Camera.instance.feetPosition)
  }

  async syncState() {
    if (!playerIsInScene) {
      this.raceIdLabel.set('')
      this.waitingForOpponentsText.visible = false
      this.waitingForOpponentsTimer.value = ''
      this.playerSlotsText.value = ''
      return
    }

    this.id = this.id || (await getCurrentGameId())
    if (!this.id) return

    try {
      const game = await getGame(this.id)
      const newState = game?.state || 'Unknown'

      this.players = game?.entries ? Object.keys(game.entries) : []
      // @ts-ignore
      if (!this.players.includes(this.me)) {
        cancelButton.visible = false
        this.waitingForOpponentsText.visible = false
        this.waitingForOpponentsTimer.value = ''
        this.waitingForOpponentsTimer.visible = false
        this.playerSlotsText.value = ''
        this.playerSlotsText.visible = false
      } else {
        if (this.state === 'Registration') {
          if (game.waitTime && this.waitingForOpponentsTimer) {
            const waitTime = new Date(game.waitTime)
            const waitMinutes = padZero(waitTime.getMinutes())
            const waitSeconds = padZero(waitTime.getSeconds())
            this.playerSlotsText.value = `${this.players.length} / ${config.game.playerLimit}`
            this.playerSlotsText.visible = true
            this.waitingForOpponentsTimer.value = game.waitTime < 0 ? '' : `${waitMinutes}:${waitSeconds}`
            this.waitingForOpponentsTimer.visible = true
            this.waitingForOpponentsText.visible = true
          } else {
            this.waitingForOpponentsTimer.value = ''
            this.waitingForOpponentsTimer.visible = false
            this.waitingForOpponentsText.visible = false
            this.playerSlotsText.value = ''
            this.playerSlotsText.visible = false
          }
        } else {
          this.waitingForOpponentsText.visible = false
          this.waitingForOpponentsTimer.value = ''
          this.waitingForOpponentsTimer.visible = false
          this.playerSlotsText.value = ''
          this.playerSlotsText.visible = false
        }
      }

      if (this.state === 'Registration') {
        // @ts-ignore
        if (this.players.includes(this.me)) playNowPaid.getComponent(Transform).position.y = -100
        else playNowPaid.getComponent(Transform).position.y = -1.7

        // @ts-ignore
        if (this.players.includes(this.me)) playNowFree.getComponent(Transform).position.y = -100
        else playNowFree.getComponent(Transform).position.y = -1.7

        if (this.game.type === 'free') playNowPaid.getComponent(Transform).position.y = -100
        if (this.game.type === 'paid') playNowFree.getComponent(Transform).position.y = -100
        this.raceIdLabel.set('')
      } else {
        playNowPaid.getComponent(Transform).position.y = -100
        playNowFree.getComponent(Transform).position.y = -100
        this.raceIdLabel.set(`Race #${this.id.toString()}`)
      }

      this.gameInProgressEntity.getComponent(Transform).scale =
        this.state === 'Registration' ? Vector3.Zero() : Vector3.One()

      if (this.state === 'Started') {
        const timeLeftMs = game.game_end - Date.now()
        const elapsed = new Date(timeLeftMs)
        const elapsedMinutes = padZero(elapsed.getMinutes())
        const elapsedSeconds = padZero(elapsed.getSeconds())

        let timeLeft = `${elapsedMinutes}:${elapsedSeconds}`
        if (timeLeftMs < 0) timeLeft = '00:00'

        this.gameInProgressTimerEntity.getComponent(Transform).scale = Vector3.One()
        this.gameInProgressTimerEntity.getComponent(TextShape).value = timeLeft
      } else {
        this.gameInProgressTimerEntity.getComponent(Transform).scale = Vector3.Zero()
        this.gameInProgressTimerEntity.getComponent(TextShape).value = ''
      }

      if (this.state !== newState) {
        switch (newState) {
          case 'Starting':
            this.localPlaces = undefined
            this.playerPositions = undefined
            this.playerSlotsText.value = ''
            this.playerSlotsText.visible = false

            if (this.iAmRegistered) {
              this.events.emit('racing:game:starting', game)
              await this.recordPlayerLastPosition(
                this.direction,
                this.position.floor,
                this.position.track,
                Camera.instance.feetPosition
              )
            }

            break
          case 'Started':
            if (this.iAmRegistered) this.events.emit('racing:game:started', game)
            if (config.game.teleportUp) void movePlayerTo(new Vector3(21.93, 12.3, 62.91))
            break
          case 'Finished':
            if (this.killTimer) this.killTimer()
            if (this.iAmRegistered) {
              await this.recordGameFinalPosition(this.id)
              this.events.emit('racing:game:finished', game)
            }

            this.id = undefined
            this.direction = 'up'
            break
        }
      }

      this.state = newState
      this.game = game

      // log('-----------------------------------------')
      // log('id', this.id)
      // log('state', this.state)
      // log('players', this.players)
      // log('positions', this.playerPositions)
      // log(game)
      // log('-----------------------------------------')
    } catch (err) {
      log(err)
      this.id = undefined
    }
  }

  async addPlayer(address: string, tx?: string, metadata?: any) {
    if (this.state !== 'Registration') throw new Error('Not accepting new players')
    if (this.players.length === config.game.playerLimit) throw new Error('Maximum players entered')
    // @ts-ignore
    if (this.players.includes(address.toLowerCase())) throw new Error('You are already registered')

    const user = await getPlayerData({ userId: address })
    metadata.name = user?.displayName || address

    const response = await recordUser({
      address,
      gameId: this.id,
      metadata,
      tx
    })

    if (!response || response.error) throw new Error(response.error?.toString())
    this.players.push(address.toLowerCase())
    this.events.emit('racing:player:registered', address.toLowerCase())
    this.bus.emit('racing:player:registered', { address: address.toLowerCase() })
    return { error: false }
  }

  async recordGameFinalPosition(game: number) {
    const address = await getUserPublicKey()
    // @ts-ignore
    const currentTrack: Track = this.track.find(
      (t: Track) => t.floor === this.position.floor && parseInt(t.trackNumber) === this.position.track
    )
    const { primaryAxis, primaryAxisReversed, secondaryAxis, secondaryAxisReversed } = currentTrack
    const { x, y, z } = Camera.instance.feetPosition

    const position = {
      direction: this.direction,
      floor: currentTrack.floor,
      track: currentTrack.trackNumber,
      primaryAxis,
      primaryAxisReversed,
      secondaryAxis,
      secondaryAxisReversed,
      position: { x, y, z }
    }

    if (!isNaN(game) && this.iAmRegistered) void setFinalPosition({ game, address, position })
  }

  async recordPlayerLastPosition(direction: 'up' | 'down', floor: number, track: number, position: Vector3) {
    // @ts-ignore
    if (!this.players.includes(this.me) || this.iAmFinished) return
    if (!this.game || this.game.state !== 'Started') return

    // @ts-ignore
    const currentTrack: Track = this.track.find((t: Track) => t.floor === floor && parseInt(t.trackNumber) === track)
    const { primaryAxis, primaryAxisReversed, secondaryAxis, secondaryAxisReversed } = currentTrack

    this.lastPosition.floor = this.position.floor
    this.lastPosition.track = this.position.track
    this.position = {
      direction,
      floor,
      track,
      position,
      primaryAxis,
      primaryAxisReversed,
      secondaryAxis,
      secondaryAxisReversed
    }

    this.lastPosition.position = new Vector3(
      this.position.position.x,
      this.position.position.y,
      this.position.position.z
    )

    this.bus.emit('racing:position', { player: this.me, position: this.position, direction: this.direction })

    const user = await getPlayerData({ userId: this.me! })
    await recordUserMetadata({
      address: this.me,
      metadata: {
        name: user?.displayName || this.me!,
        floor,
        track,
        direction,
        position: { x: this.position.position.x, y: this.position.position.y, z: this.position.position.z },
        primaryAxis,
        primaryAxisReversed,
        secondaryAxis,
        secondaryAxisReversed
      }
    })
  }

  async finishLine(address: string) {
    if (this.state !== 'Started') throw new Error('Game is not started')
    const response = await recordFinish({ address, id: this.id })
    if (!response || response.error) throw new Error(response.error?.toString())
    return { error: false }
  }
}

export const runningSystem = new GameplaySystem()
export default runningSystem
engine.addSystem(runningSystem)
