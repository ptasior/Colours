const WIDTH = 7; // supposed to be < 10
const HEIGHT = 5; // supposed to be < 10
const COLOURS_NO = 5;
const COLOURS = {0:'#cccccc', 1:'#ff0000', 2:'#00ff00', 3:'#0000ff', 4:'#ffff00'};
var tab;
var list;
var result;

function newGame()
{
// 	Allocating array
	tab = new Array();
	for(var i = 0; i < WIDTH; i++)
		tab[i] = new Array();
	
	list = new Array();
	result = new Array();
	
// 	Assigning number of colours to be removed
	for(var i = 0; i < COLOURS_NO; i++)
		result[i] = Math.floor(Math.random()*100);
	
// 	Filling it
	for(var i = 0; i < WIDTH; i++)
		for(var j = 0; j < HEIGHT; j++)
			tab[i][j] = Math.floor(Math.random()*COLOURS_NO);
		
	repaint();
}

function repaint()
{
	for(var i = 0; i < WIDTH; i++)
		for(var j = 0; j < HEIGHT; j++)
			$(('e'+i)+j).setStyle({backgroundColor: COLOURS[tab[i][j]]});
		
	var txt = '';
	for(var i = 0; i < COLOURS_NO; i++)
		txt += '<span style="color:'+COLOURS[i]+'">'+result[i]+'</span><br>';
	
	$('status').update(txt);
}

function click()
{
// 	Get the coordinates of selected item
	var x = this.id.substr(1,1);
	var y = this.id.substr(2,1);
	
	select(x,y);
}

function dblclick()
{
	var x = this.id.substr(1,1);
	var y = this.id.substr(2,1);
	
	select(x,y);
	remove();
	repaint();
}

function select(x, y)
{
	if(list.length == 0) // Start
	{
		list.unshift(new Array(x, y));
		$(('e'+x)+y).addClassName('selected');
	}
	else if(list[0][0] == x && list[0][1] == y) // Removing previously added
	{
		list.shift();
		$(('e'+x)+y).removeClassName('selected');
	}
	else if((list[0][0] == x || list[0][1] == y) && (tab[x][y] == tab[list[0][0]][list[0][1]])) // Adding new if in the same row or col and have the same colour
	{
		list.unshift(new Array(x, y));
		$(('e'+x)+y).addClassName('selected');
	}
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
		tab[list[0][0]][list[0][1]] = Math.floor(Math.random()*COLOURS_NO); // Add an animation
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
			// temporary
			e.setStyle({left: i*21+'px'});
			e.setStyle({top: j*21+'px'});
		}
	newGame();
}

