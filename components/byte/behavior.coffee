# Byte Behavior Engine
# Determines Byte's mood, messages, and behavioral decisions
# Returns data/decisions to TypeScript - does not render UI

# Constants
INACTIVITY_BORED_MS = 50000
INACTIVITY_ANGRY_MS = 150000

# Message priorities
MESSAGE_PRIORITY =
  route: 100
  intro: 90
  click: 60
  fact: 50
  inactivity: 10

# Route-specific messages
routeMessages =
  '/':
    message: "Welcome to the workspace. Let's see what we're building here."
    animation: 'happy'
  '/about':
    message: "Time to meet the engineer behind all this."
    animation: 'curious'
  '/projects':
    message: "Now we're getting to the good stuff. Hardware and software experiments."
    animation: 'excited'
  '/minibuilds':
    message: "Small experiments and quick builds. The learning ground for bigger projects."
    animation: 'curious'
  '/creativelab':
    message: "A little different from the usual builds. This is where the creative experiments live."
    animation: 'curious'
  '/circuits':
    message: "Circuit designs and schematics. The blueprints behind the hardware."
    animation: 'curious'
  '/github':
    message: "Inspecting the codebase. Where all the magic happens."
    animation: 'curious'
  '/experience':
    message: "Professional work. Where theory meets reality."
    animation: 'happy'
  '/certificates':
    message: "Learning credentials. Always shipping, always learning."
    animation: 'happy'
  '/coursework':
    message: "Academic foundations. Building from the ground up."
    animation: 'curious'
  '/publications':
    message: "Research work. The deeper technical contributions."
    animation: 'curious'
  '/skillmatrix':
    message: "Skill breakdown across the tech stack."
    animation: 'curious'
  '/languages':
    message: "Let's see what languages are actually showing up across the codebase."
    animation: 'curious'
  '/techstack':
    message: "The tools and technologies that power everything."
    animation: 'excited'
  '/resume':
    message: "The compressed version. Everything in one document."
    animation: 'happy'
  '/contact':
    message: "Communication channels. Reach out if you need something built."
    animation: 'happy'
  '/settings':
    message: "Configuration panel. Customize your experience."
    animation: 'curious'
  '/keysprint':
    message: "Testing typing speed. Developer productivity matters."
    animation: 'curious'

# Click interaction messages
clickMessages = [
  "Yep, still here."
  "Clicking the guide? Bold move."
  "There's more stuff in the Explorer on the left."
  "I take my job very seriously. Mostly."
  "Try opening another section."
  "The projects section is where it gets interesting."
  "You can navigate with the sidebar or tabs up top."
  "This portfolio runs entirely client-side."
  "The terminal at the bottom actually works."
  "Zen mode hides everything. Including me."
  "Built with Next.js and way too much attention to detail."
  "Lite mode disables my animations. Toggle it off in Settings to see me move!"
  "My name is Byte. Watch me track your cursor."
]

# Portfolio facts
portfolioFacts = [
  "This portfolio contains 16 hardware and software projects spanning 2018-2026."
  "The flagship project is Zephyr Station - an ESP32 environmental monitoring system."
  "Most projects use ESP32/ESP8266 microcontrollers with various sensors."
  "The tech stack focuses heavily on embedded systems and IoT development."
  "Multiple projects feature real-time data visualization with OLED displays."
  "The portfolio includes both funded college projects and community work."
  "Several projects integrate I2C, SPI, UART, and 1-Wire communication protocols."
  "Projects include RFID attendance systems, GPS navigation, and air quality monitoring."
  "Hardware costs range from ₹1,103 to ₹6,080 per project with full BOM documentation."
  "The portfolio website itself is styled as VS Code and built with React/Next.js."
]

# Inactivity messages
inactivityMessages =
  bored: "Go on, keep exploring."

# Helper: Get random item from array
randomItem = (array) ->
  array[Math.floor(Math.random() * array.length)]

# Determine mood based on idle time
# Input: idleMs (number) - milliseconds since last activity
# Output: mood (string) - 'idle', 'bored', or 'angry'
getMoodFromIdleTime = (idleMs) ->
  if idleMs >= INACTIVITY_ANGRY_MS
    'angry'
  else if idleMs >= INACTIVITY_BORED_MS
    'bored'
  else
    'idle'

# Get route-specific message
# Input: path (string) - current route path
# Output: object with message, animation, priority, id
getRouteMessage = (path) ->
  config = routeMessages[path]
  if config
    {
      text: config.message
      animation: config.animation
      priority: MESSAGE_PRIORITY.route
      id: "route-#{path}"
    }
  else
    null

# Get click message
# Input: none
# Output: object with message, animation, priority, id
getClickMessage = ->
  msg = randomItem(clickMessages)
  {
    text: msg
    animation: 'excited'
    priority: MESSAGE_PRIORITY.click
    id: "click-#{Date.now()}"
  }

# Get portfolio fact message
# Input: lastFact (string) - last fact shown to avoid repetition
# Output: object with message, animation, priority, id
getFactMessage = (lastFact = null) ->
  fact = randomItem(portfolioFacts)
  
  # Avoid repeating the same fact if possible
  if portfolioFacts.length > 1 and fact is lastFact
    fact = randomItem(portfolioFacts)
  
  {
    text: fact
    animation: 'curious'
    priority: MESSAGE_PRIORITY.fact
    id: "fact-#{fact.substring(0, 20)}"
  }

# Get inactivity message
# Input: mood (string) - current mood
# Output: object with message, animation, priority, id
getInactivityMessage = (mood) ->
  if mood is 'bored'
    {
      text: inactivityMessages.bored
      animation: 'bored'
      priority: MESSAGE_PRIORITY.inactivity
      id: 'bored'
    }
  else
    null

# Get intro message
# Input: liteMode (boolean) - whether lite mode is enabled
# Output: object with message, animation, priority, id
getIntroMessage = (liteMode) ->
  if liteMode
    text = "Hey, I'm Byte. I'll be your guide throughout the portfolio. Lite mode is enabled—disable it in Settings to see my animations!"
    duration = 10000
  else
    text = "Hey, I'm Byte. I'll be your guide throughout the portfolio."
    duration = 8000
  
  {
    text: text
    animation: 'happy'
    priority: MESSAGE_PRIORITY.intro
    id: 'intro'
    duration: duration
  }

# Main behavior decision function
# Input: state object with:
#   - page: current route path
#   - idleMs: milliseconds since last activity
#   - currentMood: current mood
#   - lastFact: last fact shown (optional)
#   - liteMode: whether lite mode is enabled (optional)
#   - messageType: type of message to get (optional)
# Output: object with mood and/or message decision
getByteBehavior = (state) ->
  { page, idleMs, currentMood, lastFact, liteMode, messageType } = state
  
  # Determine mood based on idle time
  mood = getMoodFromIdleTime(idleMs)
  
  # Get message based on requested type
  message = null
  
  switch messageType
    when 'route'
      message = getRouteMessage(page)
      mood = 'happy'  # Reset to happy on route change
    when 'click'
      message = getClickMessage()
    when 'fact'
      message = getFactMessage(lastFact)
    when 'inactivity'
      message = getInactivityMessage(mood)
    when 'intro'
      message = getIntroMessage(liteMode)
  
  {
    mood: mood
    message: message
  }

# Export functions for TypeScript
module.exports =
  getMoodFromIdleTime: getMoodFromIdleTime
  getRouteMessage: getRouteMessage
  getClickMessage: getClickMessage
  getFactMessage: getFactMessage
  getInactivityMessage: getInactivityMessage
  getIntroMessage: getIntroMessage
  getByteBehavior: getByteBehavior
  MESSAGE_PRIORITY: MESSAGE_PRIORITY
