/**
* Javascript implementation of Dijkstra's algorithm
* Based on: http://en.wikipedia.org/wiki/Dijkstra's_algorithm
* Author: James Jackson (www.jamesdavidjackson.com)
* Source: http://github.com/nojacko/dijkstras-js/tree/
*/

/**
* @class Dijkstras
**/
var Dijkstras = (function () {

    var Dijkstras = function () {
        this.graph = [];
        this.queue;
        this.distance = [];
        this.previous = []
    }

    /**
    * Creates a graph from array.
    * Each element in the array should be in the format:
    * 	[NODE NAME, [[NODE NAME, COST], ...] ]
    *
    * @param graphy Array of nodes and vertices.
    *
	*/

    Dijkstras.prototype.setGraph = function (graph)
    {
        // Error check graph
        if (typeof graph !== 'object') {
            throw "graph isn't an object (" + typeof graph + ")";
        }

        if (graph.length < 1) {
            throw "graph is empty";
        }

		/*	change input array to we need format array
		 */
		var map_array = [];
		for (var index in graph) {
			var line = graph[index];
			if (typeof line !== 'object' || line.length !== 2) {
				throw "node must be an array and contain 2 values (point1, point2). Failed at index: " + index;
			}
			var distance = Math.sqrt(((line[0][0] - line[1][0]) * (line[0][0] - line[1][0])) + ((line[0][1] - line[1][1]) * (line[0][1] - line[1][1])));
			//console.log("dis=" + distance);
			sp = line[0].toString();
			ep = line[1].toString();
			var flag = false;
			//start point
			for (var i in map_array) {
				var item = map_array[i];
				if (item[0] == sp) {
					child = [ep, distance];
					item[1].push(child);
					flag = true;
					break;
				}
			}
			if (flag == false) {
				map_array.push([sp, [[ep, distance]]]);
			}
			//end point
			flag = false;
			for (var i in map_array) {
				var item = map_array[i];
				if (item[0] == ep) {
					child = [sp, distance];
					item[1].push(child);
					flag = true;
					break;
				}
			}
			if (flag == false) {
				map_array.push([ep, [[sp, distance]]]);
			}
		}
		/*
		for (var i in map_array) {
			var item = map_array[i];
			console.log(item[0]);
			console.log(item[1]);
		}*/

		//console.log(map_array);

        //for (var index in graph) {
        for (var index in map_array) {
            // Error check each node
            //var node = graph[index];
            var node = map_array[index];
            if (typeof node !== 'object' || node.length !== 2) {
                throw "node must be an array and contain 2 values (name, vertices). Failed at index: " + index;
            }

            var nodeName = node[0];
            var vertices = node[1];
            this.graph[nodeName] = [];

			//console.log("node=" + node);
			//console.log("nodeName=" + nodeName + ",vertices=" + vertices);
            for (var v in vertices) {
                // Error check each node
                var vertex = vertices[v];
                if (typeof vertex !== 'object' || vertex.length !== 2) {
                    throw "vertex must be an array and contain 2 values (name, vertices). Failed at index: " + index + "[" + v + "]" ;
                }
                var vertexName = vertex[0];
                var vertexCost = vertex[1];
                this.graph[nodeName][vertexName] = vertexCost;
            }
        }
    }

    /**
    * Find shortest path
    *
    * @param source The starting node.
    * @param target The target node.
    * @return array Path to target, or empty array if unable to find path.
    */
    Dijkstras.prototype.getPath = function (source, target)
    {
        // Check source and target exist
        if (typeof this.graph[source] === 'undefined') {
            throw "source " + source + " doesn't exist";
        }
        if (typeof this.graph[target] === 'undefined') {
            throw "target " + target + " doesn't exist";
        }

        // Already at target
        if (source === target) {
            return [];
        }

        // Reset all previous values
        this.queue = new MinHeap();
        this.queue.add(source, 0);
        this.previous[source] = null;

        // Loop all nodes
        var u = null
        while (u = this.queue.shift()) {
            // Reached taget!
            if (u === target) {
                var path = [];
                while (this.previous[u] != null) {
                    path.unshift(u);
                    u = this.previous[u];
                }
				path.unshift(source);
                return path;
            }

            // all remaining vertices are inaccessible from source
            if (this.queue.getDistance(u) == Infinity) {
                return [];
            }

            var uDistance = this.queue.getDistance(u)
            for (var neighbour in this.graph[u]) {
                var nDistance = this.queue.getDistance(neighbour),
                    aDistance = uDistance + this.graph[u][neighbour];

                if (aDistance < nDistance) {
                    this.queue.update(neighbour, aDistance);
                    this.previous[neighbour] = u;
                }
            }
        }

        return [];
    }



    // Fibonacci Heap (min first)
    var MinHeap = (function() {
        var MinHeap = function () {
            this.min = null;
            this.roots = [];
            this.nodes = [];
        }

        MinHeap.prototype.shift = function()
        {
            var minNode = this.min;

            // Current min is null or no more after it
            if (minNode == null || this.roots.length < 1) {
                this.min = null;
                return minNode
            }

            // Remove it
            this.remove(minNode);

            // Consolidate
            if (this.roots.length > 50) {
                this.consolidate();
            }

            // Get next min
            var lowestDistance = Infinity,
                length = this.roots.length;

            for (var i = 0; i < length; i++) {
                var node = this.roots[i],
                    distance = this.getDistance(node);

                if (distance < lowestDistance) {
                    lowestDistance = distance;
                    this.min = node;
                }
            }

            return minNode;
        }

        MinHeap.prototype.consolidate = function()
        {
            // Consolidate
            var depths = [ [], [], [], [], [], [], [] ],
                maxDepth = depths.length - 1, // 0-index
                removeFromRoots = [];

            // Populate depths array
            var length = this.roots.length;
            for (var i = 0; i < length; i++) {
                var node = this.roots[i],
                depth = this.nodes[node].depth;

                if (depth < maxDepth) {
                    depths[depth].push(node);
                }
            }

            // Consolidate
            for (var depth = 0; depth <= maxDepth; depth++) {
                while (depths[depth].length > 1) {

                    var first = depths[depth].shift(),
                        second = depths[depth].shift(),
                        newDepth = depth + 1,
                        pos = -1;

                    if (this.nodes[first].distance < this.nodes[second].distance) {
                        this.nodes[first].depth = newDepth;
                        this.nodes[first].children.push(second);
                        this.nodes[second].parent = first;

                        if (newDepth <= maxDepth) {
                            depths[newDepth].push(first);
                        }

                        // Find position in roots where adopted node is
                        pos = this.roots.indexOf(second);

                    } else {
                        this.nodes[second].depth = newDepth;
                        this.nodes[second].children.push(first);
                        this.nodes[first].parent = second;

                        if (newDepth <= maxDepth) {
                            depths[newDepth].push(second);
                        }

                        // Find position in roots where adopted node is
                        pos = this.roots.indexOf(first);
                    }

                    // Remove roots that have been made children
                    if (pos > -1) {
                        this.roots.splice(pos, 1);
                    }
                }
            }
        }

        MinHeap.prototype.add = function(node, distance)
        {
            // Add the node
            this.nodes[node] = {
                node: node,
                distance: distance,
                depth: 0,
                parent: null,
                children: []
            };

            // Is it the minimum?
            if (!this.min || distance < this.nodes[this.min].distance) {
                this.min = node;
            }

            // Other stuff
            this.roots.push(node);
        }

        MinHeap.prototype.update = function(node, distance)
        {
            this.remove(node);
            this.add(node, distance);
        }

        MinHeap.prototype.remove = function(node)
        {
            if (!this.nodes[node]) {
                return;
            }

            // Move children to be children of the parent
            var numChildren = this.nodes[node].children.length;
            if (numChildren > 0) {
                for (var i = 0; i < numChildren; i++) {
                    var child = this.nodes[node].children[i];
                    this.nodes[child].parent = this.nodes[node].parent;

                    // No parent, then add to roots
                    if (this.nodes[child].parent == null) {
                        this.roots.push(child);
                    }
                }
            }

            var parent = this.nodes[node].parent;

            // Root, so remove from roots
            if (parent == null) {
                var pos = this.roots.indexOf(node);
                if (pos > -1) {
                    this.roots.splice(pos, 1);
                }
            } else {
                // Go up the parents and decrease their depth
                while (parent) {
                    this.nodes[parent].depth--;
                    parent = this.nodes[parent].parent
                }
            }
        }

        MinHeap.prototype.getDistance = function(node)
        {
            if (this.nodes[node]) {
                return this.nodes[node].distance;
            }
            return Infinity;
        }

        return MinHeap;
    })();

    return Dijkstras;
})();

/*var map_array = 
	[
		['A', [['B', 12], ['F', 16], ['G', 14]] ],
		['B', [['A', 12], ['F', 7], ['C', 10]] ],
		['C', [['B', 10], ['D', 3], ['E', 5], ['F', 6]] ],
		['D', [['C', 3], ['E', 4]] ],
		['E', [['C', 5], ['D', 4], ['F', 2], ['G', 8]] ],
		['F', [['A', 16], ['B', 7], ['C', 6], ['E', 2], ['G', 9]] ],
		['G', [['A', 14], ['E', 8], ['F', 9]] ]
	];
*/

var map_array = [
	[[0,0], [1,1]],
	[[0,0], [2,2]],
	[[0,0], [3,2]],
	[[1,1], [2,2]],
	[[1,1], [4,1]],
	[[2,2], [3,2]],
	[[2,2], [4,3]],
	[[2,2], [4,1]],
	[[4,1], [4,3]],
	[[4,1], [5,2]],
	[[4,3], [5,2]],
	[[3,2], [4,3]]
]

var map1_array = [
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
d.setGraph(map1_array);
//var path = d.getPath('D', 'A');
//var path = d.getPath([0,0].toString(), [4,3].toString());
var path = d.getPath([199,39].toString(), [202.7,39.8].toString());
console.log(path);

