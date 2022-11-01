# Mina zkApp: Checkin Mvp

This repo is an MVP for my project, please find the documentation describing the final project idea including task list and timeline under `/docs/DOCUMENTATION.md`.

Idea of this MVP: 
- [X] Screen #1: Are you in the Vienna center? 
- [X] User clicks button to share location and submits 
- [X] zkApp verifies that user is in the allowed range 
- [X] If yes → proof is generated that user is in range without revealing the exact location
- [X] If yes → show success page
- [X] If no → show error page 

## How to build

```sh
npm run build
```

## Run test script
```
npx tsc && node build/run.js
```

## How to run tests

```sh
npm run test
npm run testw # watch mode
```

## Run with UI
```sh
npm start
```

## How to run coverage

```sh
npm run coverage
```

## License

[Apache-2.0](LICENSE)
