var warArray = [];
var playerHand = [];
var compHand = [];

var playDeck = '';
var computerDeck = '';
var Decks = ['bladedancerC.png', 'gunslingerC.png', 'nightstalkerC.png', 'strikerC.png', 'sunbreakerC.png', 'defenderC.png', 'stormcallerC.png', 'sunsingerC.png', 'voidwalkerC.png'];

var playerCard = '';
var compCard = '';



function shuffle(o)
{
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}


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

//function to split shuffled deck in half
function splitCards(deck)
{
	//alert('splitting...');

	var i = 0;

	while (i != deck.length)
	{
		playerHand.push(deck[i]);
		compHand.push(deck[(i+1)]);
		i+=2;
	}

	$('#playCount').append("<p><strong style='font-size: 25px'>Player cards: " + playerHand.length + "</strong></p>");
	$('#compCount').append("<p><strong style='font-size: 25px'>Computer cards: " + compHand.length + "</strong></p>");
	$('#result').append('<p><strong style="font-size: 25px"></strong></p>');
	//alert('player hand: ' + playerHand.length + ', compHand: ' +  compHand.length);

}

//function to take top card off of each deck and put into card slot
function deal()
{

	$('#playerCard').html("");
	$('#compCard').html("");
	$('#newGame').show();
	$('#warAnimation p').removeClass('war');

	playerCard = playerHand[0];
	compCard = compHand[0];

	//alert("player: " + (playerCard % 13) + ", comp: " + (compCard % 13));

	var img = document.createElement('img');
	var img2 = document.createElement('img');

	img.src = ("img/cards/" + playerHand[0] + ".png");
	img2.src = ("img/cards/" + compHand[0] + ".png");

	document.getElementById('playerCard').appendChild(img);
	document.getElementById('compCard').appendChild(img2);

	compare(playerCard, compCard); //calls compare function to compare cards
}


//function to compare both face up cards
function compare(player, comp)
{
	if((player % 13) > (comp % 13))
	{
		//player wins
		$('#result p').replaceWith('<p><strong style="font-size: 25px">Player wins!</strong></p>');
		playerHand.push(comp);
		playerHand.push(player);
		playerHand.shift();
		compHand.shift();
		updateCount();
		checkWin();
	}
	else if ((player % 13) < (comp % 13))
	{
		//computer wins
		$('#result p').replaceWith('<p><strong style="font-size: 25px">Computer wins!</strong></p>');
		compHand.push(player);
		compHand.push(comp);
		compHand.shift();
		playerHand.shift();
		updateCount();
		checkWin();
	}
	else if ((player % 13) === (comp % 13))
	{
		war();
	}

}


//function to handle war instances or "ties"
function war()
{
	$('#warAnimation').show().children().addClass('war');

	setTimeout(function()
	{
		$('#warP').removeClass('war');
		$('#warAnimation').hide();
	}, 1000);

	warToArray();
}

//function to take cards from each deck and put into "war" array
function warToArray()
{
	//if not able to draw 4 cards, draw as many as possible
	if (playerHand.length < 5 || compHand.length < 5)
	{
		if(playerHand.length > compHand.length)
		{
			for (var i = 0; i < compHand.length-1; i++)
			{
				warArray.push(playerHand[i]);
				playerHand.shift();
				warArray.push(compHand[i]);
				compHand.shift();
			}
			compareWar();
		}

		else if(playerHand.length < compHand.length)
		{
			for (var i = 0; i < playerHand.length-1; i++)
			{
				warArray.push(playerHand[i]);
				playerHand.shift();
				warArray.push(compHand[i]);
				compHand.shift();
			}
			compareWar();
		}
	}
	else
	{
		for (var i = 0; i < 4; i++)
		{
			warArray.push(playerHand[i]);
			playerHand.shift();
			warArray.push(compHand[i]);
			compHand.shift();
		}
		compareWar(playerHand[0], compHand[0]);
	}
}

function compareWar(player, comp)
{
	if((player % 13) > (comp % 13))
	{
		//player wins
		$('#result p').replaceWith('<p><strong style="font-size: 25px">Player wins!</strong></p>');
		playerHand.push.apply(playerHand, warArray);
		playerHand.push(comp);
		playerHand.push(player);
		playerHand.shift();
		compHand.shift();
		warArray.length = 0;
		updateCount();
		checkWin();
	}
	else if ((player % 13) < (comp % 13))
	{
		//computer wins
		$('#result p').replaceWith('<p><strong style="font-size: 25px">Computer wins!</strong></p>');
		compHand.push.apply(compHand, warArray);
		compHand.push(player);
		compHand.push(comp);
		playerHand.shift();
		compHand.shift();
		warArray.length = 0;
		updateCount();
		checkWin();
	}
	else if ((player % 13) === (comp % 13))
	{
		war();
	}
}

function checkWin()
{
	if (playerHand.length === 0)
	{
		alert("Computer wins. :(");
		$('#playerCard').html("");
		$('#playerDeck').html("");
		$('#deal').hide();
	}
	else if (compHand.length === 0)
	{
		alert("Player wins!! :D");
		$('#compHand').html("");
		$('#compDeck').html("");
		//$('#compCard').hide();
		//$('compDeck').hide();
		$('#deal').hide();
	}
}

function deckSet(element, pers)
{
	var img = document.createElement('img');

	if (pers === 'player')
	{
		img.src = ("img/backs/" + element);
		playDeck = element;
		document.getElementById('playerDeck').appendChild(img);
	}
	else if (pers === 'comp')
	{
		img.src = ("img/backs/" + element);
		document.getElementById('compDeck').appendChild(img);
	}

	if (computerDeck === '')
	{
		var yes = true;

		while(yes)
		{
			var rand = Math.floor(Math.random() * 9);

			if (Decks[rand] != playDeck)
			{
				computerDeck = Decks[rand];
				deckSet(Decks[rand], 'comp');
				yes = false;
			}
		}
	}

	$('#deckChoice').hide();
	$('#howTo').show();
}

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
	
	$('#game').hide();
	$('#howTo').hide();
	$('#warAnimation').hide();
	$('#deckChoice').show();
	$('#newGame').hide();

	fillArray();
};