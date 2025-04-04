/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';
// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (const game of games) {

        // create a new div element, which will become the game card
        const gameCard = document.createElement('div');

        // add the class game-card to the list
        gameCard.classList.add('game-card');

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `
            <h2>${game.name}</h2>
            <img class="game-img" src="${game.img}" alt="${game.name}" />
            <p>${game.description}</p>
            <p> Gool: ${game.goal}</p>
            <p> Backers: ${game.backers}</p>
            <p> Pledged: ${game.pledged} </p>
        `;

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

const addAllGamesToPage = addGamesToPage(GAMES_JSON);
/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const contributions = GAMES_JSON.reduce((Accumulator, game) => Accumulator + game.backers,0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${contributions.toLocaleString()}`

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const raises = GAMES_JSON.reduce((Accumulator, game) => Accumulator + game.pledged,0);
// set inner HTML using template literal
raisedCard.innerHTML = `$${raises.toLocaleString()}`

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length}`


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let filteredAndUnfunded = GAMES_JSON.filter((game) => { return game.pledged < game.goal});

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(filteredAndUnfunded);

}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let filteredAndFunded = GAMES_JSON.filter((game) => { return game.pledged >= game.goal});

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(filteredAndFunded);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.reduce((accumulator, game) => {
    return game.pledged < game.goal ? accumulator + 1 : accumulator;
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const message = unfundedGames > 0 
    ? `A total of $${raises.toLocaleString()} has been raised for ${GAMES_JSON.length} games. Currently ${unfundedGames} game${unfundedGames > 1 ? "s remain":" remains"} unfunded. We need your help to fund these amazing games!`
    : `A total of $${raises.toLocaleString()} has been raised for ${GAMES_JSON.length} games. Currently ${unfundedGames} game${unfundedGames > 1 ? "s remain":" remains"} unfunded. Thank you for your incredible support for our amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const descriptionsContainer = document.getElementById("description-container");

const messageElement = document.createElement("p");
messageElement.innerHTML = message;

descriptionsContainer.appendChild(messageElement);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...others] = sortedGames;
// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameElement = document.createElement("p");
firstGameElement.innerHTML = `${firstGame.name}`;
// do the same for the runner up item
const secondGameElement = document.createElement("p");
secondGameElement.innerHTML = `${secondGame.name}`;

firstGameContainer.appendChild(firstGameElement);
secondGameContainer.appendChild(secondGameElement);

/*************************************************************************************
 * Challenge 8: Add a search bar to the page
 * Skills used: event listeners, querySelectorAll, forEach, includes, createElement, appendChild
 */

document.getElementById('search-btn').addEventListener('click', function() {
    let searchQuery = document.getElementById('search-bar').value.toLowerCase();
    let gameCards = document.querySelectorAll('.game-card');
    let gameFound = false;

    gameCards.forEach(card => {
        let gameTitle = card.querySelector('h2').innerText.toLowerCase();
        if (gameTitle.includes(searchQuery)) {
            card.style.display = "block";
            gameFound = true;
        } else {
            card.style.display = "none";
        }
    });

    // Check if no game was found and display a message
    let noResultsMessage = document.getElementById('no-results');
    if (!gameFound) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('p');
            noResultsMessage.id = 'no-results';
            noResultsMessage.innerText = "No games found.";
            noResultsMessage.style.color = "red";
            noResultsMessage.style.fontSize = "18px";
            noResultsMessage.style.textAlign = "center";
            document.getElementById('games-container').appendChild(noResultsMessage);
        }
    } else {
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }
});

// add an event listener to the search bar to trigger the search function when the Enter key is pressed
document.getElementById('search-bar').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('search-btn').click();
    }
});