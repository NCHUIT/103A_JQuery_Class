var SUITS = ["c", "s", "h", "d"];
var RANKS = ["a", "2", "3", "4", "5", "6", "7", "8", "9", "t", "j", "q", "k"];
var VALUES = {a:1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "t":10, "j":10, "q":10, "k":10};

// Card
function Card(suit, rank) {
  if( SUITS.indexOf(suit) != -1 && RANKS.indexOf(rank) != -1 ) {
    this.suit = suit;
    this.rank = rank;
  } else {
    throw "Invalid card: " + suit + rank;
  }
  return this;
}

Card.prototype = {
  toString: function() {
    return this.suit + this.rank;
  },
  get_suit: function() {
    return this.suit;
  },
  get_rank: function() {
    return this.rank;
  },
};

function Hand(steal) {
  this.cards = [];
  this.steal = typeof(steal) !== 'undefined' ? steal : false;
  return this;
}

Hand.prototype = {
  toString: function() {
    return "Hand contains " + this.cards.join(" ");
  },
  add_card: function(card) {
    this.cards.push(card);
  },
  hit:function(deck){
    if(this.get_value() <= 21)
      this.add_card(deck.deal_card());
    if(this.get_value() > 21){
      return false;
    }
    return true;
  },
  get_value: function() {
    var value = 0, hasAce = false;
    for( var i in this.cards ) {
      card = this.cards[i];
      if( card.get_rank() == 'a' )
        hasAce = true;
      value += VALUES[card.get_rank()];
    }
    if(hasAce && value<=11)
      value += 10;
    if(value < 21 && this.cards.length>=5)
      return 21;
    return value;
  },
  wins:function(dealer){
    return this.get_value() <= 21 && dealer.get_value() < this.get_value() || dealer.get_value() > 21;
  },
  dealer_run:function(deck,player){
    while(this.get_value() < 17 || this.get_value() < Math.min(player.get_value(), 21))
      this.add_card(deck.deal_card());
  },
  get_cards: function(){
    return this.cards;
  },
};

function Deck() {
  this.cards = [];
  for( var i in SUITS )
    for( var j in RANKS )
      this.cards.push(new Card(SUITS[i], RANKS[j]));

  return this;
}

Deck.prototype = {
  toString: function() {
    return "Deck contains " + this.cards.join(" ");
  },
  player_wins: function(player,dealer){
    return player.wins(dealer);
  },
  shuffle: function() {
    this.cards = shuffle(this.cards);
    return this;
  },
  deal_card: function() {
    return this.cards.pop();
  },
};

function shuffle(v) {
  for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
  return v;
}

// ==================================

var deck,player,dealer;
var busted = false;

function outcome(msg,state){
  $("#outcome").text(msg).attr("class","alert alert-" + state);
}

$(document).ready(function(){
  deck = new Deck();
  deck.shuffle();
  player = new Hand();
  dealer = new Hand(true);

  player.add_card(deck.deal_card());
  dealer.add_card(deck.deal_card());
  player.add_card(deck.deal_card());
  dealer.add_card(deck.deal_card());

  var board = $("#player .blackjack-board");
  board.empty();
  var cards = player.cards;
  for(k in cards)
    board.append($("<div class='poker poker-"+cards[k].toString()+"'></div>"));

  board = $("#dealer .blackjack-board");
  board.empty();
  var cards = dealer.cards;
  for(k in cards){
    if(k == 0)
      board.append(jQuery("<div class='poker poker-back-heartstone'></div>"));
    else
      board.append($("<div class='poker poker-"+cards[k].toString()+"'></div>"));
  }

  $("#player .badge").text(player.get_value());
  // $("#dealer .badge").text(dealer.get_value());

  $("#btn-hit").click(function(){
    //var card = deck.deal_card();
    if(busted){
      outcome("你已經死了","warning");
      return;
    }
    busted = !player.hit(deck);
    console.log(card.toString());
    console.log(player.toString());
    var cardDOM = $("<div class='poker poker-"+player.cards[player.cards.length - 1].toString()+"'></div>");
    console.log(cardDOM);
    $("#player .blackjack-board").append(cardDOM);
    $("#player .badge").text(player.get_value());
    if(busted)
      outcome("洗洗睡吧","danger");
  });
});

// jQuery 大致運作模式

// 1.選取DOM
// 2.針對選到的 DOM 進行操作