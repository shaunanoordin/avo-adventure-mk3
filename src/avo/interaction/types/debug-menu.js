import Interaction from '@avo/interaction'
import Hero from '@avo/entity/types/hero'
import HeroV2 from '@avo/entity/types/hero-v2'

export default class DebugMenu extends Interaction {
  constructor (app) {
    super(app)
    this._type = 'debug-menu'
  }

  load (div) {
    const app = this._app
    const menu = document.createElement('div')
    menu.innerHTML = `
      <h2>Debug Menu</h2>
    `

    const changeHeroButton1 = document.createElement('button')
    changeHeroButton1.type = 'button'
    changeHeroButton1.innerText = 'Use Hero v1'
    changeHeroButton1.onclick = () => {
      const { x, y } = app.hero
      app.hero._expired = true
      app.hero = new Hero(app, 0, 0)
      app.entities.push(app.hero)
      app.camera.target = app.hero
      app.hero.x = x
      app.hero.y = y
      app.setInteractionMenu(false)
    }
    menu.appendChild(changeHeroButton1)

    const changeHeroButton2 = document.createElement('button')
    changeHeroButton2.type = 'button'
    changeHeroButton2.innerText = 'Use Hero v2'
    changeHeroButton2.onclick = () => {
      const { x, y } = app.hero
      app.hero._expired = true
      app.hero = new HeroV2(app, 0, 0)
      app.entities.push(app.hero)
      app.camera.target = app.hero
      app.hero.x = x
      app.hero.y = y
      app.setInteractionMenu(false)
    }
    menu.appendChild(changeHeroButton2)

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.innerText = 'OK!'
    closeButton.onclick = () => { app.setInteractionMenu(false) }
    menu.appendChild(closeButton)

    div.appendChild(menu)
    setTimeout(() => { closeButton.focus() }, 100)
  }

  unload () {}
}
