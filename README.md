# War

*Simple war card game using JavaScript, jQuery, and some CSS animations*

Game can be played at http://www.tyler-roland.com/War

## Game Walkthrough

### Setup:

A deck of cards is shuffled and split between the player and the computer, face down.

### Playing: 
Then the top card of each player's deck is flipped over and compared.
The player with the highest card wins both cards.

### War:

If the flipped cards are equal, then there is WAR. 
Up to four cards are drawn from each deck, and the fourth card is compared as normal.
The player with the highest card then wins all of the "war" cards.

*If either player has less than 4 cards left, only as many will be drawn so that the player has at least one card left to flip. So if the player has 3 cards left, only 2 will be drawn and the last card will be used in the comparison.*

### End:

The game ends when one player holds all of the cards.


## Developer Notes:

*I chose not to upload the card images used in the code because I did not own the images.
To replicate, 0.png = 2 of Clubs, 13.png = 2 of Diamonds, 26.png = 2 of Hearts, and 39.png = 2 of Spades.*

*CSS animations come from 'animate.css', a fantastic animation library created by Daniel Eden (found here https://daneden.github.io/animate.css/).*
