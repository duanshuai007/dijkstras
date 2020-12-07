# dijkstras-js

Javascript implementation of Dijkstra's algorithm 

## Sample Usage
	
	var map_array = [ 
		[[199,39],[200,40]], 
		[[200,40],[201,40]],
		[[201,40],[202,40]],  
		[[202,40],[202.7,39.8]],  
		[[202.7,39.8],[202.4,39.4]],
		[[202.4,39.4],[201.8,39.2]],   
		[[201.8,39.2],[201,39.2]], 
		[[201,39.2],[200,39.1]],  
		[[200,39.1],[199,39]], 
		[[199,39],[200,38.8]],
		[[200,38.8],[201,39.2]],
		[[199,39],[200.5,39.6]],
		[[200,39.1],[200.5,39.6]],
		[[200.5,39.6],[200,40]],
		[[202,40],[201.8,39.2]],
		[[200.5,39.6],[201,39.2]],
		[[201,39.2],[202,40]],
		[[202,40],[202.4,39.4]]
	]

	var d = new Dijkstras();
	d.setGraph(map_array);
	var path = d.getPath([199,39].toString(), [202.7,39.8].toString());
	console.log(path);
	
## Resources
http://en.wikipedia.org/wiki/Dijkstra's_algorithm

## Fork!
Please fork and improve!
