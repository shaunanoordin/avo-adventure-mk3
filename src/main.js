import AvO from '@avo'
import StarterStory from './starter-story/starter-story'

window.onload = function() {
  window.avo = new AvO({ story: StarterStory })
}
