/**
 * DCL Racing Game
 * Leaderboard UI
 */

// import * as utils from '@dcl/ecs-scene-utils'

import { padZero } from '../globalfunctions'
import { getStats } from './backend'

const boardX = 31.98
const boardY = 3.5
const boardZ = 4.5
const boardXRotate = 0
const boardYRotate = 90
const boardZRotate = 0
const scoreBoardRecords: any[] = []
const leaderboardScale = 1.5
const leaderBoardDimension = 2

// reference position for the leader board
export const boardParent = new Entity()
boardParent.addComponent(
  new Transform(
    new Transform({
      position: new Vector3(boardX, boardY, boardZ),
      rotation: Quaternion.Euler(boardXRotate, boardYRotate, boardZRotate),
      scale: new Vector3(leaderboardScale, leaderboardScale, leaderboardScale)
    })
  )
)

const boardBackgroundMaterial = new Material()
boardBackgroundMaterial.albedoColor = Color3.Blue()

const boardBackgroundScale = 7
const boardBackground = new Entity()
boardBackground.setParent(boardParent)
boardBackground.addComponent(new BoxShape())
boardBackground.getComponent(BoxShape).withCollisions = true
boardBackground.addComponent(new Transform({
    position: new Vector3(-0.5, -0.75, 0.01),
    rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(boardBackgroundScale, boardBackgroundScale / leaderBoardDimension, 0.01)
  })
)
boardBackground.addComponent(boardBackgroundMaterial)

// const canvas = new UICanvas()

const playNowPaidScale = 0.75
const playNowFreeScale = 0.75

export const playNowPaid = new Entity()
playNowPaid.addComponent(new PlaneShape())
playNowPaid.setParent(boardParent)

export const playNowFree = new Entity()
playNowFree.addComponent(new PlaneShape())
playNowFree.setParent(boardParent)

const playNowPaidTexture = new Texture('images/racing-game/PlayNow-Red.png')
const playNowPaidOrigW = 281
const playNowPaidOrigH = 117
const playNowPaidWidthRatio = playNowPaidOrigW / playNowPaidOrigH
playNowPaid.addComponent(
  new Transform({
    position: new Vector3(-0.45, -1.7, -0.01), //center
    //position: new Vector3(2, -1.8, -0.01), //right
    rotation: Quaternion.Euler(0, 0, 180),
    scale: new Vector3(playNowPaidScale * playNowPaidWidthRatio, playNowPaidScale, 0.01)
  })
)

const playNowFreeTexture = new Texture('images/racing-game/PlayNow-Blue.png')
const playNowFreeOrigW = 281
const playNowFreeOrigH = 117
const playNowFreeWidthRatio = playNowFreeOrigW / playNowFreeOrigH
playNowFree.addComponent(
  new Transform({
    position: new Vector3(1.85, -1.7, -0.01), //center
    //position: new Vector3(2, -1.8, -0.01), //right
    rotation: Quaternion.Euler(0, 0, 180),
    scale: new Vector3(playNowFreeScale * playNowFreeWidthRatio, playNowFreeScale, 0.01)
  })
)

const playNowPaidMaterial = new Material()
playNowPaidMaterial.metallic = 0
playNowPaidMaterial.roughness = 1
playNowPaidMaterial.albedoTexture = playNowPaidTexture
playNowPaidMaterial.alphaTexture = playNowPaidTexture
playNowPaid.addComponent(playNowPaidMaterial)

const playNowFreeMaterial = new Material()
playNowFreeMaterial.metallic = 0
playNowFreeMaterial.roughness = 1
playNowFreeMaterial.albedoTexture = playNowFreeTexture
playNowFreeMaterial.alphaTexture = playNowFreeTexture
playNowFree.addComponent(playNowFreeMaterial)

const playNowPaidText = new Entity()
const playNowPaidTextShape = new TextShape('Paid Game')
playNowPaidTextShape.fontSize = 1
playNowPaidTextShape.color = Color3.White()
playNowPaidText.setParent(playNowPaid)
playNowPaidText.addComponent(playNowPaidTextShape)
playNowPaidText.addComponent(
  new Transform({
    position: new Vector3(0, -0.65, 0),
    rotation: Quaternion.Euler(0, 0, 180),
    scale: new Vector3(1, 1 * leaderBoardDimension, 1)
  })
)

const playNowFreeText = new Entity()
const playNowFreeTextShape = new TextShape('Free Game')
playNowFreeTextShape.fontSize = 1
playNowFreeTextShape.color = Color3.White()
playNowFreeText.setParent(playNowFree)
playNowFreeText.addComponent(playNowFreeTextShape)
playNowFreeText.addComponent(
  new Transform({
    position: new Vector3(0, -0.65, 0),
    rotation: Quaternion.Euler(0, 0, 180),
    scale: new Vector3(1, 1 * leaderBoardDimension, 1)
  })
)

export async function updateBoard() {
  try {
    const gameData = await getStats()
    const scoreData: any = []

    for (const user of gameData) {
      const { name, wins, losses, fastestTime } = user

      let fastestMinutes, fastestSeconds, fastestMilliseconds
      const fastestDate = new Date(fastestTime)

      if (fastestTime) {
        fastestMinutes = padZero(fastestDate.getMinutes())
        fastestSeconds = padZero(fastestDate.getSeconds())
        fastestMilliseconds = padZero(fastestDate.getMilliseconds())
      }

      const fastest = fastestTime ? `${fastestMinutes}:${fastestSeconds}:${fastestMilliseconds}` : '-'

      scoreData.push({
        name,
        wins,
        losses,
        fastest
      })
    }

    buildLeaderBoard(scoreData, boardParent, scoreData.length).catch((error: any) => log(error))
  } catch (err) {
    log(err)
  }
}

const TitleFont = new Font(Fonts.SansSerif_Heavy)
const SFFont = new Font(Fonts.SansSerif)

export enum TextTypes {
  BIGTITLE = 'bigtitle',
  BIGVALUE = 'bigvalue',
  TITLE = 'title',
  LABEL = 'label',
  VALUE = 'value',
  UNIT = 'unit',
  TINYVALUE = 'tinyvalue',
  TINYTITLE = 'tinytitle'
}

export class ScoreBoardText extends Entity {
  constructor(type: TextTypes, text: string, transform: TranformConstructorArgs, parent: Entity) {
    super()
    engine.addEntity(this)

    this.addComponent(new Transform(transform))
    this.setParent(parent)

    const shape = new TextShape(text)

    shape.width = 10

    switch (type) {
      case TextTypes.BIGTITLE:
        shape.fontSize = 4
        shape.color = Color3.White()
        shape.vTextAlign = 'center'
        shape.font = TitleFont
        break
      case TextTypes.BIGVALUE:
        shape.fontSize = 3
        shape.color = Color3.Green()
        shape.vTextAlign = 'center'
        shape.font = TitleFont
        break

      case TextTypes.TITLE:
        shape.fontSize = 3
        shape.color = Color3.White()
        shape.vTextAlign = 'center'
        shape.width = 10
        shape.font = TitleFont
        break
      case TextTypes.TINYTITLE:
        shape.fontSize = 2
        shape.color = Color3.White()
        shape.vTextAlign = 'center'
        shape.width = 10
        shape.font = SFFont
        break
      case TextTypes.LABEL:
        shape.fontSize = 3
        shape.color = Color3.White()
        shape.vTextAlign = 'left'
        shape.font = SFFont
        break
      case TextTypes.VALUE:
        shape.fontSize = 3
        shape.color = Color3.Green()
        shape.vTextAlign = 'right'
        shape.font = SFFont
        break
      case TextTypes.TINYVALUE:
        shape.fontSize = 2
        shape.color = Color3.Green()
        shape.vTextAlign = 'right'
        shape.font = SFFont
        break

      case TextTypes.UNIT:
        shape.fontSize = 2
        shape.color = Color3.White()
        shape.vTextAlign = 'right'
        shape.font = SFFont
        break
    }

    this.addComponent(shape)
  }
}

export async function buildLeaderBoard(scoreData: any[], parent: Entity, length: number) {
  // if canvas is empty
  if (scoreBoardRecords.length === 0) {
    new ScoreBoardText(
      TextTypes.BIGTITLE,
      'Player',
      {
        position: new Vector3(-3, 0.65, 0)
      },
      parent
    )

    new ScoreBoardText(
      TextTypes.BIGTITLE,
      'Wins',
      {
        position: new Vector3(-1.5, 0.65, 0)
      },
      parent
    )

    new ScoreBoardText(
      TextTypes.BIGTITLE,
      'Losses',
      {
        position: new Vector3(0, 0.65, 0)
      },
      parent
    )

    new ScoreBoardText(
      TextTypes.BIGTITLE,
      'Fastest',
      {
        position: new Vector3(1.8, 0.65, 0)
      },
      parent
    )

    for (let i = 0; i < length; i++) {
      if (i < scoreData.length) {
        const name = new ScoreBoardText(
          TextTypes.TINYTITLE,
          scoreData[i].name,
          {
            position: new Vector3(-3, 0.2 - i / 4, 0)
          },
          parent
        )

        const wins = new ScoreBoardText(
          TextTypes.TINYVALUE,
          scoreData[i].wins.toString(),
          {
            position: new Vector3(-1.5, 0.2 - i / 4, 0)
          },
          parent
        )

        const losses = new ScoreBoardText(
          TextTypes.TINYVALUE,
          scoreData[i].losses.toString(),
          {
            position: new Vector3(0, 0.2 - i / 4, 0)
          },
          parent
        )

        const fastest = new ScoreBoardText(
          TextTypes.TINYVALUE,
          scoreData[i].fastest.toString(),
          {
            position: new Vector3(1.8, 0.2 - i / 4, 0)
          },
          parent
        )

        scoreBoardRecords.push({ name, wins, losses, fastest })
      } else {
        // create empty line

        new ScoreBoardText(
          TextTypes.TINYTITLE,
          '-',
          {
            position: new Vector3(-3, 0.2 - i / 4, 0)
          },
          parent
        )

        new ScoreBoardText(
          TextTypes.TINYVALUE,
          '-',
          {
            position: new Vector3(-1.5, 0.2 - i / 4, 0)
          },
          parent
        )

        new ScoreBoardText(
          TextTypes.TINYVALUE,
          '-',
          {
            position: new Vector3(0, 0.2 - i / 4, 0)
          },
          parent
        )

        new ScoreBoardText(
          TextTypes.TINYVALUE,
          '-',
          {
            position: new Vector3(1.8, 0.2 - i / 4, 0)
          },
          parent
        )
      }
    }
  } else {
    // update existing board
    for (let i = 0; i < length; i++) {
      if (i > scoreData.length) continue
      scoreBoardRecords[i].name.getComponent(TextShape).value = scoreData[i].name
      scoreBoardRecords[i].wins.getComponent(TextShape).value = scoreData[i].wins
      scoreBoardRecords[i].losses.getComponent(TextShape).value = scoreData[i].losses
      scoreBoardRecords[i].fastest.getComponent(TextShape).value = scoreData[i].fastest
    }
  }
}
