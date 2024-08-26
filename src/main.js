import AvO from '@avo'
import StarterStory from './starter-story.js'

window.onload = function() {
  window.avo = new AvO({ story: StarterStory })
}
