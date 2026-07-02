# AvO: Adventurer's Omnibus

AvO: Adventurer's Omnibus is a small Zelda-like adventure game, meant to be played on a web browser.

You can play it online at http://shaunanoordin.github.io/avo-adventure-mk3 , though as of July 2026 this is still a work in progress.

Created by [Shaun A. Noordin](https://shaunanoordin.com)

## For Players

_Be curious, and be kind._

🚧 TODO: explain game goals and game controls

## For Developers

If you're technically inclined, you can run the game on your local machine.

- Target audience: Casual gamers.
- Target devices: PCs and mobile devices.
- This is a web app built on HTML5, JavaScript, and [Sass](https://sass-lang.com/)/CSS. It has to be hosted on a basic web server.
- Developing the web app requires [Node](https://nodejs.org/) and NPM installed on your machine and a handy command line interface. (Bash, cmd.exe, etc)

Starting the project:

1. Install the project dependencies by running `npm install`
2. Run `npm start` to start the server. (Alternatively, use `npm run dev` to start the server in dev mode, so source files will be watched, and changes compiled dynamically.)
3. Open `http://localhost:3000` on your web browser to view the app.

If you're _super_ technically inclined, you can even modify the game. You should start by looking in the `/src` folder.

Project anatomy:

- Source JavaScript and Sass files are in the `/src` folder.
- Compiled JS and CSS files are in the `/app` folder.
- Media assets are meant to be placed in the `/assets` folder.
- Entry point is `index.html`. (i.e. this is the actual web page that the browser opens, which contains all the game code.)

Original code was based on [an unfinished Ludum Dare 48 game](https://github.com/shaunanoordin/ludumdare-48), [CNY2021](https://github.com/shaunanoordin/cny2021), and [AvO mk2](https://github.com/shaunanoordin/avo-adventure-mk2/).
