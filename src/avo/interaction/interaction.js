class Interaction {
  constructor (app) {
    this._app = app
  }

  load (div) {
    const menu = document.createElement('div')
    menu.innerHTML = `
      <p>Hello, this is an interaction menu!</p>
    `

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.innerText = 'OK!'
    closeButton.onclick = () => { this._app.setInteractionMenu(false) }
    menu.appendChild(closeButton)

    div.appendChild(menu)
    setTimeout(() => { closeButton.focus() }, 100)    
  }

  unload () {}
}

export default Interaction
