# AvO: Adventurer's Omnibus

AvO: Adventurer's Omnibus is a collection of small adventure games.

Original code was based on [an unfinished Ludum Dare 48 game](https://github.com/shaunanoordin/ludumdare-48), [CNY2021](https://github.com/shaunanoordin/cny2021), and [AvO mk2](https://github.com/shaunanoordin/avo-adventure-mk2/).

Created by [Shaun A. Noordin](https://shaunanoordin.com).

## How to Use

Start the web app by accessing `index.html` from your web browser. (Compatible with Chrome 90.)

## Development Notes

- Target audience: Casual gamers.
- Target devices: PCs and mobile devices.
- This is a web app built on HTML5, JavaScript, and [Sass](https://sass-lang.com/)/CSS.
- Developing the web app requires [Node](https://nodejs.org/) and NPM installed on your machine and a handy command line interface. (Bash, cmd.exe, etc)

Project anatomy:

- Source JavaScript and Sass files are in the `/src` folder.
- Compiled JS and CSS files are in the `/app` folder.
- Media assets are meant to be placed in the `/assets` folder, but this is optional.
- Entry point is `index.html`.

Starting the project:

1. Install the project dependencies by running `npm install`
2. Run `npm start` to start the server, or `npm run dev` to start the server in dev mode (i.e. source files will be watched and changes compiled dynamically.)
3. Open `http://localhost:3000` on your web browser to view the app.
