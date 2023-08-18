/**
 * DCL Racing Game
 * Race Timer
 *
 * DEPRECATED: This approach leads to the timer playing "catch up" when switching away
 * from the tab and back again. We now use gameplaySystem.timer
 */

import { padZero } from '../globalfunctions'
import gameplaySystem from './gameplay-system'
import config from './config'

let timerInstance: ISystem
let timer: UIText, maxTime: number, onComplete: any
let running = false

export class TimerSystem implements ISystem {
  lastTimeLeft?: number

  update() {
    if (!running) return
    if (gameplaySystem.state !== 'Started') return killTimer(true)

    let left = gameplaySystem.game.timeLeft || 0
    if (this.lastTimeLeft && this.lastTimeLeft === gameplaySystem.game.timeLeft) left -= 50

    const elapsedTime = maxTime - left
    this.lastTimeLeft = gameplaySystem.game.timeLeft
    if (elapsedTime >= maxTime) return killTimer(true)

    const elapsed = new Date(elapsedTime)
    const elapsedMinutes = padZero(elapsed.getMinutes())
    const elapsedSeconds = padZero(elapsed.getSeconds())
    const elapsedMilliseconds = padZero(elapsed.getMilliseconds())

    const max = new Date(maxTime)
    const maxMinutes = padZero(max.getMinutes())
    const maxSeconds = padZero(max.getSeconds())
    const maxMilliseconds = padZero(max.getMilliseconds(), 100, '00')

    timer.value = `${elapsedMinutes}:${elapsedSeconds}:${elapsedMilliseconds} / ${maxMinutes}:${maxSeconds}:${maxMilliseconds}`
  }
}

export function killTimer(callOnComplete?: boolean) {
  running = false
  timer!.visible = false
  engine.removeSystem(timerInstance)
  if (callOnComplete && typeof onComplete === 'function') onComplete()
}

export function createTimer(canvas: UICanvas, options?: any) {
  // start = Date.now()
  maxTime = options?.maxTime || config.game.timeLimit
  onComplete = options?.onComplete || onComplete

  timer = new UIText(canvas)
  timer.fontSize = options?.fontSize || 15
  timer.width = options?.width || 120
  timer.height = options?.height || 30
  timer.vAlign = options?.vAlign || 'bottom'
  timer.hAlign = options?.hAlign || 'right'
  timer.positionX = options?.positionX || -70
  timer.positionY = options?.positionY
  timer.visible = true
  running = true

  if (timerInstance) engine.removeSystem(timerInstance)

  timerInstance = new TimerSystem()
  engine.addSystem(timerInstance)

  return { timer, timerInstance, killTimer }
}
