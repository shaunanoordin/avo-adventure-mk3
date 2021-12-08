import Interaction from '@avo/interaction'
import Gravity from '@avo/subscript/types/gravity'

class DebugMenu extends Interaction {
  constructor (app) {
    super(app)
    this._type = 'debugMenu'
  }

  load (div) {
    const menu = document.createElement('div')
    menu.innerHTML = `
      <p>This is the debug menu!</p>
    `

    const enableGravity = () => {
      const app = this._app
      app.subscripts = app.subscripts.filter(s => s._type !== 'gravity')
      app.subscripts.push(new Gravity(app))
      this._app.setInteractionMenu(false)
    }

    const disableGravity = () => {
      const app = this._app
      app.subscripts = app.subscripts.filter(s => s._type !== 'gravity')
      this._app.setInteractionMenu(false)
    }

    const enableGravityButton = document.createElement('button')
    enableGravityButton.type = 'button'
    enableGravityButton.innerText = 'Enable Gravity'
    enableGravityButton.onclick = enableGravity
    menu.appendChild(enableGravityButton)

    const disableGravityButton = document.createElement('button')
    disableGravityButton.type = 'button'
    disableGravityButton.innerText = 'Disable Gravity'
    disableGravityButton.onclick = disableGravity
    menu.appendChild(disableGravityButton)

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.innerText = 'Close'
    closeButton.onclick = () => { this._app.setInteractionMenu(false) }
    menu.appendChild(closeButton)

    div.appendChild(menu)
    setTimeout(() => { closeButton.focus() }, 100)
  }
}

export default DebugMenu
