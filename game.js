/*
	game.js
	Tyler Roland
	Modified 11/21/17
	War functionality
*/

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
	
	//if a card is already in the slot, removes card. Also shows "New Game" button if hidden
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
	$('.playerCard').append(img).animateCss("flipInYRev");
	$('.compCard').append(img2).animateCss("flipInY");

	//calls compare function to compare current cards
	compare(playerCard, compCard);
}


//function to compare both face up cards (or current cards)
function compare(player, comp) {
	
	//if player's card value is higher than the computer's card value, player wins
	if((player % 13) > (comp % 13)) {
	
		//updates result div of the game board
		$('.result').html("Player wins!").animateCss("flipInX");
		
		//pushes current cards from each hand to the back of the player's hand
		playerHand.push(comp);
		playerHand.push(player);

		//removes current card from the front of each deck
		playerHand.shift();
		compHand.shift();

		setTimeout(function() {
			moveCards('player');
		}, 1500);

		//update card counts and check for a winner
		updateCount();
		checkWin();
	}

	//if computer's card value is higher than the player's card value, computer wins
	else if ((player % 13) < (comp % 13)) {
		
		//update the results div of the game table
		$('.result').html("Computer wins!").animateCss("flipInX");
		
		//pushes current cards from each hand to the back of the computer's hand
		compHand.push(player);
		compHand.push(comp);

		//removes current card from the front of each deck
		compHand.shift();
		playerHand.shift();

		setTimeout(function() {
			moveCards('comp');
		}, 1500);

		//update card counts and check for a winner
		updateCount();
		checkWin();
	}

	//if player's current card value is the same as the computer's current card value a "War" (tie) occurs
	else if ((player % 13) === (comp % 13))
		war();
}

//function to move cards to a winners deck (animation)
function moveCards(winner) {

	if (winner == "player") {
		console.log("moving left");
		$(".playerCard img").css('position', 'relative').animate({ left: '-2000px' }, function() { $(this).hide(); });
		$(".compCard img").css('position', 'relative').animate({ left: '-2000px' }, function() { $(this).hide(); });
	}
	else if (winner == "comp") {
		console.log("moving right");
		$(".playerCard img").css('position', 'relative').animate({ left: '2000px' }, function() { $(this).hide(); });
		$(".compCard img").css('position', 'relative').animate({ left: '2000px' }, function() { $(this).hide(); });
	}
	else if (winner == "playerWar") {
		$("#warArea img").css("position", "relative").animate({ left: '-2000px' }, function() { $("#warArea img").hide(); });
	}
	else if (winner == "compWar") {
		$("#warArea img").css("position", "relative").animate({ left: '2000px' }, function() { $("#warArea img").hide(); });
	}
}


//function to handle "war" instances or "ties"
function war() {
	
	//show "war" animation
	$('#warAnimation').css("display", "table");

	$("#warText").animateCss("lightSpeedIn", function() {
		$("#warText").animateCss("lightSpeedOut");
	});

	//keeps animation going for 1 second, then removes the 'war' class and hides the animation
	setTimeout(function() {
		$('#warAnimation').hide();
		$("#warText").removeClass("lightSpeedOut");

		$("#warArea").show();
		
		//calls function to draw cards from each deck
		warToArray();
	}, 2000);

	
}


//function to take cards from each deck and put into "war" array
function warToArray() {

	var cardStr = "";
	var length = 0;

	//if not able to draw 4 cards, draw as many as possible
	if (playerHand.length < 5 || compHand.length < 5) {

		//if computer has less than 4 cards
		if(playerHand.length > compHand.length) {
			length = compHand.length - 1;
		}

		//if the player hand has less than 4 cards
		else if (playerHand.length < compHand.length) {
			length = playerHand.length - 1;
		}
	}

	//if both decks have greater than four cards
	else {
		length = 3;		
	}

	//take the cards from each deck and push them to the war array
	for (var i = 0; i < length; i++) {
		warArray.push(playerHand[0]);
		playerHand.shift();
		warArray.push(compHand[0]);
		compHand.shift();
		cardStr += '<img src="img/cardback.jpg">';
	}

	//set up the War visual with relevant cards
	$(".playerWarFinal").html("<img src='img/cards/"+playerHand[0]+".png'>").animateCss("flipInYRev");
	$(".playerWarCards").html(cardStr);
	$(".compWarCards").html(cardStr);
	$(".compWarFinal").html("<img src='img/cards/"+compHand[0]+".png'>").animateCss("flipInY");

	//compare the new current card from each deck
	compareWar(playerHand[0], compHand[0]);
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

		setTimeout(function() {
			moveCards("playerWar");
			moveCards("player");
		}, 3000);

		setTimeout(function() {
			$("#warArea").hide();
		}, 3500);

		//update card count and check for a winner
		updateCount();
		checkWin();
	}

	//if computer's War card value is greater than the player's War card value, computer wins the tie
	else if ((player % 13) < (comp % 13)) {
		
		//update result section of the game board
		$('.result').html("Computer wins!");
		
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

		setTimeout(function() {
			moveCards("compWar");
			moveCards("comp");
		}, 3000);

		setTimeout(function() {
			$("#warArea").hide();
		}, 3500);

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
		$(".result").html("The computer wins the game :(").animateCss("flipInX");

		//resets the card and deck image to make it seem like the player is out of cards
		$('.playerCard').html("");
		$('.playerDeck').html("");

		//hides the "deal" button, forces player to only start a new game
		$('.deal').hide();
	}

	//if computer is out of cards, player wins
	else if (compHand.length == 0) {
		
		$(".result").html("You won the game! :)").animateCss("flipInX");

		//resets the card and deck image to make it seem like the computer is out of cards.
		$('.compCard').html("");
		$('.compDeck').html("");

		//hides the "deal" button, forces the player to only start a new game
		$('.deal').hide();
	}
}

//function that hides the "how to play" screen and shows the game board
function play() {
	hideAll();
	$("#header").show().addClass("animated fadeInDown");
	$("#gameboard").show();
	playing = true;
}

//function to update the card count after every "deal" finishes
function updateCount() {
	$('.playCount').html("Player cards: " + playerHand.length);
	$('.compCount').html("Computer cards: " + compHand.length);
}

//simple function to hide big page elements, usually followed by showing other specific elements
function hideAll() {
	$("#jumbotron").hide();
	$("#gameboard").hide();
	$("#howToPlay").hide();
	$("#header").hide();
	$(".newGame").hide();
}

window.onload = function() {

	preloadImages();

	hideAll();
	$("#jumbotron").show();
	$("#howToPlay").show();
	fillArray();

	$("#year").html(new Date().getFullYear());
};

//custom function, used with animate.css to quickly add and then remove animation classes (once animation is finished)
//found here: https://github.com/daneden/animate.css
$.fn.extend({
	animateCss: function(animationName, callback) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
              callback();
            }
        });
        return this;
	}
});

//function to preload images into the browser cache for quicker loading during play
function preloadImages() {
	for (var i = 0; i < 52; i++) {
		var img = new Image();
		img.src = 'img/cards/'+i+'.png';
	}
}