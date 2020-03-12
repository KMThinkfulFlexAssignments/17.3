
'use strict';
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get('/burgers', (req, res) => {
  res.send('We have juicy burgers');
});

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Your pizza is on the way!');
});

app.get('/pizza/pineapple', (req, res) => {
  res.send('We don\'t serve that here, never call us again!');
});

app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
    `;
  res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end();
});

//6 steps for writing a function that responds to query strings
app.get('/greetings', (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;
  
  //2. validate the values
  if(!name) {
    //3. name was not provided
    return res.status(400).send('Please provide a name');
  }
  
  if(!race) {
    //3. race was not provided
    return res.status(400).send('Please provide a race');
  }
  
  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;
  
  //6. send the response 
  res.send(greeting);
});

app.listen(8000, () => {
  console.log('Express server is listening on port 8000');
});

//drills start here
app.get('/sum', (req, res) => {
  const a = req.query.a;
  const b = req.query.b;
  const c = parseInt(a) + parseInt(b);

  if(!a) {
    return res.status(400).send('Please provide a number (a)');
  }
  if(!b) {
    return res.status(400).send('Please provide a number (b)');
  }
  if(Number.isNaN(c)) {
    return res.status(400).send('Inputs must be numbers');
  }
  res.send(`The sum of ${a} amd ${b} is ${c}`);
});

app.get('/cipher', (req, res) => {
  const text = req.query.text;
  const shift = req.query.shift;
  const shiftKey = parseInt(shift);

  if(!text) {
    return res.status(400).send('Please provide text to encrypt');
  }
  if(!shift) {
    return res.status(400).send('Please provide a character shift key');
  }
  if(Number.isNaN(shiftKey)) {
    return res.status(400).send('Shift key must be a number');
  }

  const base = 'A'.charCodeAt(0);
  const cipher = text.toUpperCase().split('').map(char => {
    const code = char.charCodeAt(0);
    if(code < base || code > (base + 26)) {
      return char;
    }
    let distance = code - base;
    distance = distance + shiftKey;
    distance = distance % 26;

    const shiftedChar = String.fromCharCode(base + distance);
    return shiftedChar;
  })
    .join('');

  res.status(200).send(cipher);
});

app.get('/lotto', (req, res) => {
  let numbers = req.query.numbers;

  if(!numbers) {
    return res.status(400).send('Please provide numbers to enter the lotto');
  }
  if(!Array.isArray(numbers)) {
    return res.status(400).send('Numbers must be in an array');
  }

  const guess = numbers.map(n => parseInt(n)).filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  if(guess.length !== 6) {
    return res.status(400).send('You need 6 numbers between 1 and 20 to enter the lotto');
  }

  const stock = Array(20).fill(1).map((_, i) => i + 1);
  const winners = [];
  for(let i = 0; i < 6; i ++) {
    const ran = Math.floor(Math.random() * stock.length);
    winners.push(stock[ran]);
    stock.splice(ran, 1);
  }

  let diff = winners.filter(n => !guess.includes(n));
  let responseText;
  switch(diff.length){
  case 0: 
    responseText = `Wow! Unbelievable! You could have won the mega millions! The winning numbers were ${winners}`;
    break;
  case 1:   
    responseText = `Congratulations! You win $100! The winning numbers were ${winners}`;
    break;
  case 2:
    responseText = `Congratulations, you win a free ticket! The winning numbers were ${winners}`;
    break;
  default:
    responseText = `Sorry, you lose. The winning numbers were ${winners}`;  
  }

  res.send(responseText);
});