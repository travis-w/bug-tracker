# Bug Tracker

This project is an experiment I am working on about trying to create a bug tracker built on reproducible bugs. Bugs require a failing test in order to be submitted.

I am also using this project as a time to mess around with [Vue 3](https://v3.vuejs.org/) and [Tailwind CSS](https://tailwindcss.com/), so please excuse the messy code.

## Project Goals
- Develop a basic bug reporting system that encourages reproducible bugs and tests so that a develper will know when the bug is solved.
- Auto capture test videos and screenshots based on the tests.
- Learn Tailwind CSS and Vue 3 and other new(ish) technologies.
- Define schema so multiple different test frameworks can be used
- Plugin system?

## Project Requirements
- Node (currently only developed and tested in Node 14)
- Mongo DB

## Project Setup

### Server
```
cd server
npm i
npm run dev
```

### Frontend
```
cd frontend
npm i
npm run serve
```
