import AvO from '@avo'
import StarterStory from './starter-story'

window.onload = function init () {
  window.avo = new AvO({ story: StarterStory })
}
