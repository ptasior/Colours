const WIDTH = 9; // supposed to be < 10
const HEIGHT = 5; // supposed to be < 10
const COLOURS_NO = 7;
const COLOURS = {0:'red.png', 1:'green.png', 2:'blue.png', 3:'purple.png', 4:'yellow.png', 5:'stone.png', 6:'multi.png', STONE: 5, MULTI: 6};
var tab;
var list;
var result;

// Small improvement - sign function returning {-1|0|1} according to the sign of number
Number.prototype.sign = function(){
	if (this < 0) 
		return -1;
	if (this > 0)
		return 1;
	return 0;
}

// Returns first element in the array
Array.prototype.first = function(){
	return this[0];
}

// Returns last element in the array
Array.prototype.last = function(){
	return this[this.length-1];
}

Array.prototype.isEmpty = function(){
	return this.length == 0;
}

// Class representing item position 
function Pos()
{
	switch (typeof arguments[0])
	{
		case 'number' : this.x = arguments[0];
						this.y = arguments[1];
						break;
		case 'string' : this.x = parseInt(arguments[0].substr(1,1));
						this.y = parseInt(arguments[0].substr(2,1));
						break;
		case 'object' : this.x = arguments[0].x;
						this.y = arguments[0].y;
						break;
		default : alert('Unknown type passed into Pos construtor?');
	}
		
	this.getItem = function(){ // Returns HTML element at specified position
			return $(('e'+this.x)+this.y);
		}
}

function newGame()
{
// 	Allocating array
	tab = new Array();
	for(var i = 0; i < WIDTH; i++)
		tab[i] = new Array();
	
	list = new Array();
	result = new Array();
	
// 	Assigning number of colours to be removed
	for(var i = 0; i < COLOURS_NO-2; i++)
		result[i] = Math.floor(Math.random()*30+20);
	
// 	Filling it
	for(var i = 0; i < WIDTH; i++)
		for(var j = 0; j < HEIGHT; j++)
			tab[i][j] = getRandom();
		
	repaint();
}

function repaint()
{
	for(var i = 0; i < WIDTH; i++)
		for(var j = 0; j < HEIGHT; j++)
			$(('e'+i)+j).setStyle({backgroundImage: 'url(gfx/'+COLOURS[tab[i][j]]+')'});
		
	// FIXME - convert to some legal methods
	var txt = '';
	for(var i = 0; i < COLOURS_NO-2; i++)
		txt += '<img src="gfx/'+COLOURS[i]+'">'+result[i]+'<br>';
	
	$('status').update(txt);
}

function click()
{
// 	Get the coordinates of selected item
	var pos = new Pos(this.id);
	
	if(list.length == 0 && selectable(pos)) // Select
		select(pos);
	else if((list.length == 1) && list.first().x == pos.x && list.first().y == pos.y) // or unselect
	{
		list.shift();
		pos.getItem().removeClassName('selected');
	}
	else if(list.length > 2 && list.first().x == pos.x && list.first().y == pos.y) // End click (has to be clicked on the last item
	{
		remove();
		repaint();
		
		for(var i = 0; i < COLOURS_NO-2; i++)
			if(result[i] > 0)
				return;
		
		alert("You won!");
		newGame();
	}
}

function mouseover()
{
	if(list.isEmpty())
		return;
	
// 	Get the coordinates of selected item
	var pos = new Pos(this.id);
	if(selectable(pos))
		select(pos);
	if(list.length > 1 && list[1].x == pos.x && list[1].y == pos.y)
	{
		list[0].getItem().removeClassName('selected');
		list.shift();
	}
}

function selectable(pos)
{
	if(tab[pos.x][pos.y] == COLOURS.STONE) // Is a stone
		return false;
	
	if(list.length == 0) // Nothing selected
		if(tab[pos.x][pos.y] == COLOURS.MULTI)
			return false;
		else
			return true;
	
	if(!list.isEmpty()) // Cannot select the same again
		for(var i = 0; i < list.length; i++) // So check all items on the list
			if(list[i].x == pos.x && list[i].y == pos.y)
				return false;
			
	if(list.length > 1)  // Avoiding jumping back over already selected
	{
		if((list[1].y == list[0].y && list[0].y == pos.y) && // If 2 last are the same axis
			((list[1].x-list[0].x).sign() != (list[0].x-pos.x).sign())) // And the direction is the backward
			return false;
		if((list[1].x == list[0].x && list[0].x == pos.x) && // If 2 last are the same axis
			((list[1].y-list[0].y).sign() != (list[0].y-pos.y).sign())) // And the direction is the backward
			return false;
	}
	
	if(tab[pos.x][pos.y] == tab[list.last().x][list.last().y] || tab[pos.x][pos.y] == COLOURS.MULTI) // The same colour or multi-colour
	{
		if(list.first().x == pos.x) // Selected item is in the same column
		{
			var t = list.first().y-pos.y;
			for(t-=t.sign(); t != 0; t-=t.sign()) // Check whether there is no stone or other similar item on the way
				if(tab[pos.x][pos.y+t] == COLOURS.STONE)
					return false;
			return true;
		}
		if(list.first().y == pos.y) // Selected item is in the same row
		{
			var t = list.first().x-pos.x;
			for(t-=t.sign(); t != 0; t-=t.sign()) // Check whether there is no stone or other similar item on the way
				if(tab[pos.x+t][pos.y] == COLOURS.STONE)
					return false;
			return true;
		}
	}
	
	return false;
}

function select(pos)
{
	list.unshift(pos);
	pos.getItem().addClassName('selected');
}

function getRandom()
{
	if(Math.random() < 0.05) // Special items (stone, multi)
		return COLOURS_NO-2 + Math.floor(Math.random()*2);
	
	return Math.floor(Math.random()*(COLOURS_NO-2));
}

function remove()
{
	if(list.length < 2)
		return;
	
	result[tab[list.first().x][list.first().y]] -= list.length;
	if(result[tab[list.first().x][list.first().y]] < 0)
		result[tab[list.first().x][list.first().y]] = 0;
	
	while(list.length > 0)
	{
		tab[list.first().x][list.first().y] = getRandom(); // Add an animation
		list.first().getItem().removeClassName('selected');
		list.shift();
	}
}

window.onload = function(){
	for(var i = 0; i < WIDTH; i++)
		for(var j = 0; j < HEIGHT; j++)
		{
			var e = new Element('a', {'id': ('e'+i)+j});
			$('board').appendChild(e);
			e.observe('click', click);
			e.observe('mouseover', mouseover);
		}
	newGame();
	
//	Don't even look at this - this is treated as a dangerous crime in some countries ;)
	var txt = '';
	for(var i = 0; i < WIDTH; i++)
		for(var j = 0; j < HEIGHT; j++)
		{
			txt+=('#e'+i)+j+"\n{\nleft: "+(192+i*49-j*13)+"px;\ntop: "+(37+j*37+i*17)+"px;\n}\n\n";
		}
	$('styl').update(txt);
}
