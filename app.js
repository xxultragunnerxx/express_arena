const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    console.log('The root path was called');
    res.send('Hello Express!');
});

app.get('/burgers',(req, res) => {
    res.send('We have juicy cheese burgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way!');
});

app.get('/pizza/pineapple', (req, res) => {
    res.send('We dont serve that here. Never call again!');
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
    `;
    res.send(responseText);
})

app.get('/queryViewer', (req, res) => {
    console.log(req.query)
    res.end();
})

app.get('/greetings', (req, res) => {
    const name = req.query.name;
    const race = req.query.race;

    if(!name){
        return res.status(400).send('Please provide a name');
    }

    if(!race){
        return res.status(400).send('Please provide a race');
    }

    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;
    res.send(greeting)
})

app.get('/sum', (req, res) => {
    const numberA = req.query.a
    const numberB = req.query.b
    const sumOfAB = (Number(numberA)+Number(numberB)).toString()
    res.send(`The sum of ${numberA} and ${numberB} is ${sumOfAB}`);
})

app.get('/cipher', (req, res) => {
    
    const text = req.query.text
    const shift = req.query.shift
    
    if(!text) {
        return res
        .status(400)
        .send('text is required')
    }

    if(!shift) {
        return res
        .status(400)
        .send('shift is required')
    }

    const numShift = parseFloat(shift)

    if(Number.isNaN(numShift)){
        return res
        .status
        .send ('shift must be a number')
    }

    const base = 'A'.charCodeAt(0)

    const cipher = text
    .toUpperCase()
    .split('')
    .map(char =>{
        const code = char.charCodeAt();
        if(code < base || code > (base + 26)) {
            return char
        }

        let diff = code - base 
        diff = diff + numShift
        diff = diff % 26

        const shiftedChar = String.fromCharCode(base + diff);
        return shiftedChar
    }).join('')
    console.log()
})

app.get('/lotto', (req, res) => {
    const {numbers} = req.query
    
    if(!numbers){
        return res
        .status(200)
        .send('numbers is required')
    }

    if(!Array.isArray(numbers)){
        return res
        .status(200)
        .send('numbers must be an array')
    }

    const guesses = numbers
            .map(n => parseInt(n))
            .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20))
    
    if(guesses.length != 6){
        return res
        .status(400)
        .send("numbers must contain 6 integers between 1 and 20");

    }

    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

    
    const winningNumbers = [];
    for(let i = 0; i < 6; i++) {
      const ran = Math.floor(Math.random() * stockNumbers.length);
      winningNumbers.push(stockNumbers[ran]);
      stockNumbers.splice(ran, 1);
    }
  
    
    let diff = winningNumbers.filter(n => !guesses.includes(n));
  
    let responseText;
  
    switch(diff.length){
      case 0: 
        responseText = 'Wow! Unbelievable! You could have won the mega millions!';
        break;
      case 1:   
        responseText = 'Congratulations! You win $100!';
        break;
      case 2:
        responseText = 'Congratulations, you win a free ticket!';
        break;
      default:
        responseText = 'Sorry, you lose';  
    }

})



app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});
