//initialize variables
var warArray = [];
var playerHand = [];
var compHand = [];

var playDeck = '';
var computerDeck = '';
var Decks = ['bladedancerC.png', 'gunslingerC.png', 'nightstalkerC.png', 'strikerC.png', 'sunbreakerC.png', 'defenderC.png', 'stormcallerC.png', 'sunsingerC.png', 'voidwalkerC.png'];

var playerCard = '';
var compCard = '';


//function to fill an array with 52 numbers
function fillArray()
{
	var deck = [];
	for (var i = 0; i < 52; i++)
	{
		deck[i] = i;
	}

	shuffle(deck);

	splitCards(deck);
}

//function to shuffle deck of cards. 
function shuffle(o)
{
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

//function to split shuffled deck in half
function splitCards(deck)
{
	var i = 0;

	//push a card to each "hand" array
	while (i != deck.length)
	{
		playerHand.push(deck[i]);
		compHand.push(deck[(i+1)]);
		i+=2;
	}

	//updates the card count areas of the game board
	$('#playCount').append("<p><strong style='font-size: 25px'>Player cards: " + playerHand.length + "</strong></p>");
	$('#compCount').append("<p><strong style='font-size: 25px'>Computer cards: " + compHand.length + "</strong></p>");
	$('#result').append('<p><strong style="font-size: 25px"></strong></p>');
}

//function to take top card off of each deck and put into card slot
function deal()
{
	//if a card is already in the slot, removes card. ALso shows "New Game" button if hidden
	$('#playerCard').html("");
	$('#compCard').html("");
	$('#newGame').show();

	//sets current card for each hand
	playerCard = playerHand[0];
	compCard = compHand[0];

	//creates an image element for the current card in each hand
	var img = document.createElement('img');
	var img2 = document.createElement('img');

	img.src = ("img/cards/" + playerHand[0] + ".png");
	img2.src = ("img/cards/" + compHand[0] + ".png");

	//adds card image to the card slot of the game board
	document.getElementById('playerCard').appendChild(img);
	document.getElementById('compCard').appendChild(img2);

	//calls compare function to compare current cards
	compare(playerCard, compCard);
}


//function to compare both face up cards (or current cards)
function compare(player, comp)
{
	//if player's card value is higher than the computer's card value
	//player wins
	if((player % 13) > (comp % 13))
	{
		//updates result div of the game board
		$('#result p').replaceWith('<p><strong style="font-size: 25px">Player wins!</strong></p>');
		
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
	else if ((player % 13) < (comp % 13))
	{
		//update the results div of the game table
		$('#result p').replaceWith('<p><strong style="font-size: 25px">Computer wins!</strong></p>');
		
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
	{
		war();
	}

}


//function to handle "war" instances or "ties"
function war()
{
	//show "war" animation
	$('#warAnimation').show().children().addClass('war');

	//keeps animation going for 1 second, then removes the 'war' class and hides the animation
	setTimeout(function()
	{
		$('#warP').removeClass('war');
		$('#warAnimation').hide();
	}, 1000);

	//calls function to draw cards from each deck
	warToArray();
}


//function to take cards from each deck and put into "war" array
function warToArray()
{
	//if not able to draw 4 cards, draw as many as possible
	if (playerHand.length < 5 || compHand.length < 5)
	{

		//if computer has less than 4 cards
		if(playerHand.length > compHand.length)
		{
			//take all but last card and push them to the war array
			for (var i = 0; i < compHand.length-1; i++)
			{
				warArray.push(playerHand[i]);
				playerHand.shift();
				warArray.push(compHand[i]);
				compHand.shift();
			}

			//compare the new current card from each deck.
			compareWar(playerHand[0], compHand[0]);
		}

		//if the player hand has less than 4 cards 
		else if(playerHand.length < compHand.length)
		{

			//take all but 1 and push them to the war array
			for (var i = 0; i < playerHand.length-1; i++)
			{
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
	else
	{

		//take three cards from each deck and push them to the war array
		for (var i = 0; i < 4; i++)
		{
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
function compareWar(player, comp)
{
	//if player's War card value is greater than the computer's War card value, player wins the tie
	if((player % 13) > (comp % 13))
	{
		//updates result section of the game board
		$('#result p').replaceWith('<p><strong style="font-size: 25px">Player wins!</strong></p>');
		
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
	else if ((player % 13) < (comp % 13))
	{
		//update result section of the game board
		$('#result p').replaceWith('<p><strong style="font-size: 25px">Computer wins!</strong></p>');
		
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
	{
		war();
	}
}


//function to check if either player is out of cards (being a win for the other player)
function checkWin()
{
	//if player is out of cards, computer wins
	if (playerHand.length === 0)
	{
		alert("Computer wins. :(");

		//resets the card and deck image to make it seem like the player is out of cards
		$('#playerCard').html("");
		$('#playerDeck').html("");

		//hides the "deal" button, forces player to only start a new game
		$('#deal').hide();
	}

	//if computer is out of cards, player wins
	else if (compHand.length === 0)
	{
		alert("Player wins!! :D");

		//resets the card and deck image to make it seem like the computer is out of cards.
		$('#compHand').html("");
		$('#compDeck').html("");

		//hides the "deal" button, forces the player to only start a new game
		$('#deal').hide();
	}
}

//function to set the player and computer deck. 
//player deck is chosen by a click, computer deck is chosen randomly and 
//cannot be the same as the players (only a visual nicety, does not affect gameplay)
function deckSet(element, pers)
{

	//creates an image element for the deck image
	var img = document.createElement('img');

	//if assigning player's deck, show deck image in "PlayerDeck" div
	if (pers === 'player')
	{
		img.src = ("img/backs/" + element);
		playDeck = element;
		document.getElementById('playerDeck').appendChild(img);
	}

	//if assigning computer's deck, show deck image in "compDeck" div
	else if (pers === 'comp')
	{
		img.src = ("img/backs/" + element);
		document.getElementById('compDeck').appendChild(img);
	}

	//this is called when player chooses a deck for the first time, but not before player deck is set
	if (computerDeck === '')
	{
		var yes = true;

		//while still looking for an image that is not used by the player
		while(yes)
		{
			var rand = Math.floor(Math.random() * 9);

			//if current image is not the player's deck image, 
			//call deckSet function as the computer and set to that image
			if (Decks[rand] != playDeck)
			{
				computerDeck = Decks[rand];
				deckSet(Decks[rand], 'comp');
				yes = false;
			}
		}
	}

	//hides the deck choice screen and shows the "how to play" screen
	$('#deckChoice').hide();
	$('#howTo').show();
}

//function that hides the "how to play" screen and shows the game board
function play()
{
	$('#howTo').hide();
	$('#game').show();
}


//function to update the card count after every "deal" finishes
function updateCount()
{
	$('#playCount p').replaceWith('<p><strong style="font-size: 25px">Player cards: ' + playerHand.length + "</strong></p>");
	$('#compCount p').replaceWith('<p><strong style="font-size: 25px">Computer cards: ' + compHand.length + "</strong></p>");
}



//function that automatically gets the game ready when the page is loaded
window.onload = function()
{
	//hides everything but the "deck choice" screen
	$('#game').hide();
	$('#howTo').hide();
	$('#warAnimation').hide();
	$('#deckChoice').show();
	$('#newGame').hide();

	//calls function to fill card array, shuffle, and split cards
	fillArray();
};