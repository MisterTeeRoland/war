//initialize variables
var warArray = [], playerHand = [], compHand = [];
var playDeck = '', computerDeck = '', playerCard = '', compCard = '';

var playing = false;

//function to fill an array with 52 numbers
function fillArray() {
	var deck = [];
	for (var i = 0; i < 52; i++)
		deck[i] = i;

	shuffle(deck);
	splitCards(deck);
}

//function to shuffle deck of cards. 
function shuffle(deck) {
    for(var j, x, i = deck.length; i; j = Math.floor(Math.random() * i), x = deck[--i], deck[i] = deck[j], deck[j] = x);
    return deck;
}

//function to split shuffled deck in half
function splitCards(deck) {
	var i = 0;

	//push a card to each "hand" array
	while (i != deck.length) {
		playerHand.push(deck[i]);
		compHand.push(deck[(i+1)]);
		i+=2;
	}

	$('.playCount').html("Player cards: " + playerHand.length);
	$('.compCount').html("Computer cards: " + compHand.length);
	$('.result').html("");
}

//function to take top card off of each deck and put into card slot
function deal() {
	//if a card is already in the slot, removes card. ALso shows "New Game" button if hidden
	$('.playerCard').html("");
	$('.compCard').html("");
	$('.newGame').show();

	//sets current card for each hand
	playerCard = playerHand[0];
	compCard = compHand[0];

	//creates an image element for the current card in each hand
	var img = document.createElement('img');
	var img2 = document.createElement('img');

	img.src = ("img/cards/" + playerHand[0] + ".png");
	img2.src = ("img/cards/" + compHand[0] + ".png");

	//adds card image to the card slot of the game board
	$('.playerCard').append(img);
	$('.compCard').append(img2);

	//calls compare function to compare current cards
	compare(playerCard, compCard);
}


//function to compare both face up cards (or current cards)
function compare(player, comp) {
	//if player's card value is higher than the computer's card value
	//player wins
	if((player % 13) > (comp % 13)) {
		//updates result div of the game board
		$('.result').html("Player wins!");
		
		//pushes current cards from each hand to the back of the player's hand
		playerHand.push(comp);
		playerHand.push(player);

		//removes current card from the front of each deck
		playerHand.shift();
		compHand.shift();

		//update card counts and check for a winner
		updateCount();
		checkWin();
	}

	//if computer's card value is higher than the player's card value
	//computer wins
	else if ((player % 13) < (comp % 13)) {
		//update the results div of the game table
		$('.result').html("Computer wins!");
		
		//pushes current cards from each hand to the back of the computer's hand
		compHand.push(player);
		compHand.push(comp);

		//removes current card from the front of each deck
		compHand.shift();
		playerHand.shift();

		//update card counts and check for a winner
		updateCount();
		checkWin();
	}

	//if player's current card value is the same as the computer's current card value
	//a "War" (tie) occurs
	else if ((player % 13) === (comp % 13))
		war();
}


//function to handle "war" instances or "ties"
function war() {
	//show "war" animation
	$('#warAnimation').addClass('war').show();

	//keeps animation going for 1 second, then removes the 'war' class and hides the animation
	setTimeout(function() {
		$('#warAnimation').removeClass('war').hide();
	}, 2000);

	//calls function to draw cards from each deck
	warToArray();
}


//function to take cards from each deck and put into "war" array
function warToArray() {

	//if not able to draw 4 cards, draw as many as possible
	if (playerHand.length < 5 || compHand.length < 5) {

		//if computer has less than 4 cards
		if(playerHand.length > compHand.length) {
			//take all but last card and push them to the war array
			for (var i = 0; i < compHand.length-1; i++) {
				warArray.push(playerHand[i]);
				playerHand.shift();
				warArray.push(compHand[i]);
				compHand.shift();
			}

			//compare the new current card from each deck.
			compareWar(playerHand[0], compHand[0]);
		}

		//if the player hand has less than 4 cards 
		else if(playerHand.length < compHand.length) {

			//take all but 1 and push them to the war array
			for (var i = 0; i < playerHand.length-1; i++) {
				warArray.push(playerHand[i]);
				playerHand.shift();
				warArray.push(compHand[i]);
				compHand.shift();
			}

			//compare the new current card from each deck
			compareWar(playerHand[0], compHand[0]);
		}
	}

	//if both decks have greater than four cards
	else {

		//take three cards from each deck and push them to the war array
		for (var i = 0; i < 4; i++) {
			warArray.push(playerHand[i]);
			playerHand.shift();
			warArray.push(compHand[i]);
			compHand.shift();
		}

		//compare the new current card from each deck
		compareWar(playerHand[0], compHand[0]);
	}
}


//function to compare current cards and allocate the war array correctly
function compareWar(player, comp) {
	//if player's War card value is greater than the computer's War card value, player wins the tie
	if((player % 13) > (comp % 13)) {
		//updates result section of the game board
		$('.result').html("Player wins!");
		
		//pushes entire war array to the back of the player's hand
		playerHand.push.apply(playerHand, warArray);

		//pushes both current cards (War cards) to back of the player's hand
		playerHand.push(comp);
		playerHand.push(player);
		
		//removes current card from both hands
		playerHand.shift();
		compHand.shift();
		
		//resets the war array to empty
		warArray.length = 0;

		//update card count and check for a winner
		updateCount();
		checkWin();
	}

	//if computer's War card value is greater than the player's War card value, computer wins the tie
	else if ((player % 13) < (comp % 13)) {
		//update result section of the game board
		$('#result').html("Computer wins!");
		
		//pushes the entire war array to the back of the computer's hand
		compHand.push.apply(compHand, warArray);
		
		//pushes both current cards (War cards) to the back of the computer's hand
		compHand.push(player);
		compHand.push(comp);

		//removes the current cards from each hand
		playerHand.shift();
		compHand.shift();

		//resets the war array to empty
		warArray.length = 0;

		//update card count and check for a winner
		updateCount();
		checkWin();
	}

	//if player's War card value is the same as the computer's War card value, call for another war
	else if ((player % 13) === (comp % 13))
		war();
}


//function to check if either player is out of cards (being a win for the other player)
function checkWin() {
	//if player is out of cards, computer wins
	if (playerHand.length == 0) {
		alert("Computer wins. :(");

		//resets the card and deck image to make it seem like the player is out of cards
		$('.playerCard').html("");
		$('.playerDeck').html("");

		//hides the "deal" button, forces player to only start a new game
		$('.deal').hide();
	}

	//if computer is out of cards, player wins
	else if (compHand.length == 0) {
		alert("Player wins!! :D");

		//resets the card and deck image to make it seem like the computer is out of cards.
		$('.compHand').html("");
		$('.compDeck').html("");

		//hides the "deal" button, forces the player to only start a new game
		$('.deal').hide();
	}
}

//function that hides the "how to play" screen and shows the game board
function play() {
	hideAll();
	$('.game').show();
	playing = true;
	sizeElements();
}


//function to update the card count after every "deal" finishes
function updateCount() {
	$('.playCount').html("Player cards: " + playerHand.length);
	$('.compCount').html("Computer cards: " + compHand.length);
}


function hideAll() {
	$("header").hide();
	$(".game").hide();
	$("#howToPlay").hide();
	$(".newGame").hide();
	$("#desktop").hide();
	$("#mobile").hide();
}

window.onload = function() {
	hideAll();
	$("header").show();
	$("#howToPlay").show();
	fillArray();
};

window.onresize = function() {
	sizeElements();
};

function sizeElements() {
	var width = window.innerWidth;

	if (playing) {
		//mobile screens!
		if (width < 800) {
			$("#desktop").hide();
			$("#mobile").show();
		}
		else {
			$("#mobile").hide();
			$("#desktop").show();
		}
	}
}