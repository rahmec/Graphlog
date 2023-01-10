// create an array with nodes
var nodes = new vis.DataSet([
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'}
]);

// create an array with edges
var edges = new vis.DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 5}
]);

// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};

var options = {};

// initialize your network!
var network = new vis.Network(container, data, options);

var session = window.pl.create();

var pl_kb_nodes_string = "node(1). node(2). node(3). node(4). node(5)."
var pl_kb_edges_string = "\
    edge(1,3). edge(1,2). edge(2,4). edge(2,5).\
    edge(X,Y) :- edge(Y, X).\
"
session.consult(pl_kb_nodes_string+pl_kb_edges_string, {
    success: function () {
	console.log("Went well");
	session.query("node(X).", {
	    success: function (goal) {
		console.log("Query parsing went well");
		session.answers({
		    success: function (answers) {
			console.log("answer");
		    },
		    error: function (err){
			console.log("Errore");
			console.log(err);
		    },
		    fail: function (){
			console.log("fail");
		    },
		    limit: function (){
			console.log("time lim");
		    }
		});
	    },
	    error: function (err) {
		console.log("Query parsing went bad");
	    },
	});
    },
    error: function (err) {
	console.log("Went bad");
    },
});

function parse_json(str){
    try {
	object = JSON.parse(str);
	if(object['nodes'] != null && object['edges'] != null){
	    cleanGraph();
	    object['nodes'].forEach(addNode);
	    object['edges'].forEach(addEdge);
	}else{
	    console.log("Object must contain nodes and edges arrays");
	    window.alert("Object must contain nodes and edges arrays");
	}
    } catch (e) {
	console.log(e);
	window.alert("Loaded string is not a json.");
	console.log("Loaded string is not a json.");
	return false;
    }
}

function puri(answer){
    console.log(session.format_answer(answer));
}

function addNode(node) {

    data.nodes.add(node);
    //Add to Prolog KB
    pl_kb_nodes_string += "node("+node.id+")."
    session.consult(pl_kb_nodes_string+pl_kb_edges_string, {
	success: function () {
	    console.log("Node added to KB successfully");
	    session.query("node(X).", {
		success: function (goal) {
		    console.log("Query parsing went well");
		    session.answers(puri);
		},
		error: function (err) {
		    console.log("Query parsing went bad");
		},
	    });
	},
	error: function (err) {
	    console.log("Node not added");
	},
    });
}


function removeNode(node){
}

function addEdge(edge) {
    data.edges.add(edge);
    //Add to Prolog KB
}

function removeEdge(edge){
}

function cleanGraph(){
    data.nodes.clear();
    data.edges.clear();
    pl_kb_nodes_string="";
    pl_kb_edges_string="";
}

var json_obj = '{\
    "nodes": [\
	{"id": 1, "label": "Node 1"},\
	{"id": 2, "label": "Node 2"},\
	{"id": 3, "label": "Node 3"},\
	{"id": 4, "label": "Node 4"},\
	{"id": 5, "label": "Node 5"}\
    ],\
    "edges": [\
    {"from": 1, "to": 2},\
    {"from": 2, "to": 4},\
    {"from": 2, "to": 5}\
    ]\
}'

parse_json(json_obj);
