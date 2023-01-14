// TO-DO:
//1
// [ ] query per contare il numero di archi e il numero di nodi
// [ ] tenere conto del nome dei nodi tramite una relazione node_name(id, label)?
//3
// [ ] scrivere il default kb dal file dentro js
// [ ] funzione per creare un grafo casuale
/*
################################################
Default Graph
################################################
*/
var nodes = new vis.DataSet([
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
]);

var edges = new vis.DataSet([
    {from: 1, to: 3},
    {from: 1, to: 2},
    {from: 2, to: 4},
    {from: 2, to: 3},
]);

var data = {
    nodes: nodes,
    edges: edges
};

var container = document.getElementById('mynetwork');
var options = {
	clickToUse: true,
};
var network = new vis.Network(container, data, options);


/*
################################################
Prolog
################################################
*/
var session = window.pl.create();
// load the knowledge base
session.consult('prolog/default.pl', {
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

/*
################################################
Parsing Function
################################################
*/

function submit(txt_nodes, txt_edges){
	
	if(txt_nodes == '' || txt_edges == '' ){
		console.log("Object must contain nodes and edges arrays");
		window.alert("Object must contain nodes and edges arrays");
		return false;
	}
	
	cleanGraph();
	parse_json_edges(txt_edges);
	parse_json_nodes(txt_nodes);
	//after parsing we load the KB
	kb = pl_kb_nodes_string + "\n" + pl_kb_edges_string;
	console.log(kb);
	session.consult(kb, {
  		success: function () { console.log('Went well')},
  		error: function (err) { console.log(err) },
	});
	session.query("node(X).", {
		success: function (goal) {
		    console.log("Query parsing went well");
		    session.answers(puri);
		},
		error: function (err) {
		    console.log("Query parsing went bad");
		},
	})
	
	document.getElementById('action').style.display = "none";
	document.getElementById('query').style.display = "block";
}

function parse_json_edges(str){
    try{
		object = JSON.parse(str);
		if(object.length == 0){
			alert("Definire almeno un arco");
			return false;
		}
		object.forEach((element) => { 
			data.edges.add(element);
			pl_kb_edges_string += "edge(%FROM%,%TO%). \n".replace("%FROM%", element.from).replace("%TO%", element.to);
		})
	} catch(e){
		json_error(e);
		return false;
    }
}

function parse_json_nodes(str){
	try{
		object = JSON.parse(str);
		if(object.length == 0){
			alert("Definire almeno un nodo");
			return false;
		}
		object.forEach((element) => {
			data.nodes.add(element)
			pl_kb_nodes_string += "node(%ID%). \n".replace("%ID%", element.id);
		})
	} catch (e){
		json_error(e);
		return false;
	}
}

function parse_json(str){
    try{
		object = JSON.parse(str);
		if(object['nodes'] != null && object['edges'] != null){
	    	cleanGraph();
	    	object['nodes'].forEach(addNode);
	    	object['edges'].forEach(addEdge);
		} else {
	    	console.log("Object must contain nodes and edges arrays");
	    	window.alert("Object must contain nodes and edges arrays");
		}
    } catch(e){
		console.log(e);
		window.alert("Loaded string is not a json.");
		console.log("Loaded string is not a json.");
		return false;
    }
}

/*
################################################
Other
################################################
*/

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


/*
################################################
Utility
################################################
*/
function json_error(error){
	console.log(error);
	window.alert("Loaded string is not a json.");
	console.log("Loaded string is not a json.");
}