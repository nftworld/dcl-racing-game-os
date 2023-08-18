import { ChicagoEnvironment, UFOEnvironment } from './environments'
import { ufoEnvironment } from './UFO'
import { chicagoEnvironment, elevatorBtnParent } from './chicago'
// import * as Functions from 'src/globalfunctions'

export const uiCanvas = new UICanvas()

export function hideElevatorButton() {
  elevatorBtnParent.getComponent(Transform).scale = Vector3.Zero()
}

export function showElevatorButton() {
  elevatorBtnParent.getComponent(Transform).scale = Vector3.One()
}

export const ufoEnvironmentImage = new UIImage(uiCanvas, new Texture("images/racing-game/ufoEnvironment.png"))
ufoEnvironmentImage.name = "ufo-environment-image"
ufoEnvironmentImage.width = "100px"
ufoEnvironmentImage.height = "100px"
ufoEnvironmentImage.sourceWidth = 245
ufoEnvironmentImage.sourceHeight = 245
ufoEnvironmentImage.isPointerBlocker = true
ufoEnvironmentImage.hAlign = "right"
ufoEnvironmentImage.hAlign = "right"
ufoEnvironmentImage.positionY = "-5px"
ufoEnvironmentImage.onClick = new OnPointerDown(() => {
  ChicagoEnvironment.getComponent(Transform).scale = Vector3.Zero()
  UFOEnvironment.getComponent(Transform).scale = Vector3.One()
})
ufoEnvironmentImage.visible = false

export const chicagoEnvironmentImage = new UIImage(uiCanvas, new Texture("images/racing-game/chicagoEnvironment.png"))
chicagoEnvironmentImage.name = "chicago-environment-image"
chicagoEnvironmentImage.width = "100px"
chicagoEnvironmentImage.height = "100px"
chicagoEnvironmentImage.sourceWidth = 245
chicagoEnvironmentImage.sourceHeight = 245
chicagoEnvironmentImage.isPointerBlocker = true
chicagoEnvironmentImage.hAlign = "right"
chicagoEnvironmentImage.positionY = "100px"
chicagoEnvironmentImage.onClick = new OnPointerDown(() => {
  UFOEnvironment.getComponent(Transform).scale = Vector3.Zero()
  ChicagoEnvironment.getComponent(Transform).scale = Vector3.One()
})
chicagoEnvironmentImage.visible = false //dont show it by default
ufoEnvironment(UFOEnvironment)
UFOEnvironment.getComponent(Transform).scale = Vector3.Zero()
chicagoEnvironment(ChicagoEnvironment)
//chicagoScene.getComponent(Transform).scale = Vector3.Zero()

const cancelTexture = new Texture('images/racing-game/Cancel-Button-PNG-Image-Background.png')
export const cancelButton = new UIImage(uiCanvas, cancelTexture)
cancelButton.sourceLeft = 0
cancelButton.sourceTop = 0
cancelButton.height = 200
cancelButton.width = 200
cancelButton.sourceWidth = 512
cancelButton.sourceHeight = 512
cancelButton.hAlign = "center"
cancelButton.positionY = "-250px"
cancelButton.isPointerBlocker = true
cancelButton.visible = false

export const instructionsButton = new UIImage(uiCanvas, new Texture('images/racing-game/instructions_button.png'))
instructionsButton.vAlign = 'top'
instructionsButton.hAlign = "right"
instructionsButton.positionX = "-70px"
instructionsButton.positionY = "51px"
instructionsButton.sourceWidth = 1009
instructionsButton.sourceHeight = 257
instructionsButton.width = 101
instructionsButton.height = 26
instructionsButton.isPointerBlocker = true
instructionsButton.visible = true
instructionsButton.onClick = new OnPointerDown(() => {
  instructions.visible = !instructions.visible
})
instructionsButton.visible = false

export const instructions = new UIImage(uiCanvas, new Texture('images/racing-game/instructions.png'))
instructions.sourceTop = 0
instructions.sourceLeft = 0
instructions.sourceWidth = 1500
instructions.sourceHeight = 1000
instructions.positionY = 30
instructions.width = 900
instructions.height = 600
instructions.isPointerBlocker = true
instructions.visible = false
instructions.opacity = 0.9
instructions.onClick = new OnPointerDown(() => {
  instructions.visible = false
})

const instructionsHeaderPosY = -50

const instructionsHeader = new UIText(instructions)
instructionsHeader.value = "Instructions"
instructionsHeader.color = Color4.Blue()
instructionsHeader.fontSize = 65
instructionsHeader.vAlign = "top"
instructionsHeader.hAlign = "center"
instructionsHeader.positionX = -120
instructionsHeader.positionY = instructionsHeaderPosY
instructionsHeader.outlineWidth = 0.05
instructionsHeader.outlineColor = Color4.White()


const instructionsList = new UIText(instructions)
instructionsList.value = "1. Dont leave the scene while your transaction is pending\n" +
  "2. Paid races require polygon MANA for gameplay fees and MATIC for gas fees\n"+
  "3. You have 90 seconds to cancel your transaction before the game starts\n" +
  "4. Falling off the track results in being teleported back to the starting line\n" +
  "5. The race will end after 3 minutes\n"
instructionsList.lineSpacing = 20
instructionsList.color = Color4.White()
instructionsList.fontSize = 19
instructionsList.vAlign = "center"
instructionsList.hAlign = "left"
instructionsList.positionX = 15
instructionsList.positionY = instructionsHeaderPosY + 125
instructionsList.adaptWidth = true
instructionsList.textWrapping = false

const payoutsPosYadj = -300

const payoutssHeader = new UIText(instructions)
payoutssHeader.value = "Payouts"
payoutssHeader.color = Color4.Blue()
payoutssHeader.fontSize = 65
payoutssHeader.vAlign = "top"
payoutssHeader.hAlign = "center"
payoutssHeader.positionX = -120
payoutssHeader.positionY = payoutsPosYadj
payoutssHeader.outlineWidth = 0.05
payoutssHeader.outlineColor = Color4.White()

const payoutsList = new UIText(instructions)
payoutsList.value = "Gameplay fee: 5 MANA\n" +
  "2 player race: 1st place receives 9 MANA\n" +
  "3 player race: 1st Place receives 10 MANA. 2nd place receives 2.5 MANA\n" +
  "4 player race: 1st Place receives 10 MANA. 2nd place receives 5 MANA.  "
payoutsList.lineSpacing = 20
payoutsList.color = Color4.White()
payoutsList.fontSize = 19
payoutsList.vAlign = "center"
payoutsList.hAlign = "left"
payoutsList.positionX = 15
payoutsList.positionY = payoutsPosYadj + 150
payoutsList.adaptWidth = true
payoutsList.textWrapping = false
