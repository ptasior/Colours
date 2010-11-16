const WIDTH = 9; // supposed to be < 10
const HEIGHT = 5; // supposed to be < 10
const COLOURS_NO = 7;
const COLOURS = {0:'red.png', 1:'green.png', 2:'blue.png', 3:'purple.png', 4:'yellow.png', 5:'stone.png', 6:'multi.png', STONE: 5, MULTI: 6};
var tab;
var list;
var result;

// Small improvement - sign function returning {-1|0|1} according to the sign of number
Number.prototype.sign = function()
{
	if (this < 0) 
		return -1;
	if (this > 0)
		return 1;
	return 0;
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
	var x = this.id.substr(1,1);
	var y = this.id.substr(2,1);
	
	if(selectable(x,y)) // Select
		select(x,y);
	else if((list.length > 0) && list[0][0] == x && list[0][1] == y) // or unselect
	{
		list.shift();
		$(('e'+x)+y).removeClassName('selected');
	}
}

function dblclick()
{
	var x = this.id.substr(1,1);
	var y = this.id.substr(2,1);
	
	if(selectable(x,y))
		select(x,y);
	remove();
	repaint();
}

function selectable(x,y)
{
	if(list.length > 0) // Cannot select the same again
		for(var i = 0; i < list.length; i++) // So check all items on the list
			if(list[i][0] == x && list[i][1] == y)
				return false;
	
	if(tab[x][y] == COLOURS.STONE) // Is a stone
		return false;
	
	if(list.length == 0) // Nothing selected
		if(tab[x][y] == COLOURS.MULTI)
			return false;
		else
			return true;
	
	if(tab[x][y] == tab[list[list.length-1][0]][list[list.length-1][1]] || tab[x][y] == COLOURS.MULTI) // The same colour or multi-colour
	{
		if(list[0][0] == x) // Selected item is in the same column
		{
			var t = list[0][1]-y;
			for(t-=t.sign(); t != 0; t-=t.sign()) // Check whether there is no stone or other similar item on the way
				if(tab[x][parseInt(y)+t] == tab[x][y] || tab[x][parseInt(y)+t] == COLOURS.STONE)
					return false;
			return true;
		}
		if(list[0][1] == y) // Selected item is in the same row
		{
			var t = list[0][0]-x;
			for(t-=t.sign(); t != 0; t-=t.sign()) // Check whether there is no stone or other similar item on the way
				if(tab[parseInt(x)+t][y] == tab[x][y] || tab[parseInt(x)+t][y] == COLOURS.MULTI || tab[parseInt(x)+t][y] == COLOURS.STONE)
					return false;
			return true;
		}
	}
	
	return false;
}

function select(x, y)
{
	list.unshift(new Array(x, y));
	$(('e'+x)+y).addClassName('selected');
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
	
	result[tab[list[0][0]][list[0][1]]] -= list.length;
	if(result[tab[list[0][0]][list[0][1]]] < 0)
		result[tab[list[0][0]][list[0][1]]] = 0;
	
	while(list.length > 0)
	{
		tab[list[0][0]][list[0][1]] = getRandom(); // Add an animation
		$(('e'+list[0][0])+list[0][1]).removeClassName('selected');
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
			e.observe('dblclick', dblclick);
		}
	newGame();
	
//	Don't even look at this - this is treated as a dangerous crime in some places ;)
	var txt = '';
	for(var i = 0; i < WIDTH; i++)
		for(var j = 0; j < HEIGHT; j++)
		{
			txt+=('#e'+i)+j+"\n{\nleft: "+(192+i*49-j*13)+"px;\ntop: "+(37+j*37+i*17)+"px;\n}\n\n";
		}
	$('styl').update(txt);
}
