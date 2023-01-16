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
    {id: 1, label: 'Node 1', shape: "dot"},
    {id: 2, label: 'Node 2', shape: "dot"},
    {id: 3, label: 'Node 3', shape: "dot"},
    {id: 4, label: 'Node 4', shape: "dot"},
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
	nodes:{
		shape: 'dot',
		size: 20,
	},
	interaction: { 
		navigationButtons: false,
	},
	manipulation: {
		enabled: true,
		//la funzione addNode viene chiamata prima che avvenga l'azione
		//quando le funzioni che aggiungono elementi vengono realizzata è necessario fare una query che aggiorni i valori
		addNode: function(nodeData,callback) {
			Swal.fire({
				title: 'Add Node',
				html:
				  '<input id="node_id" class="swal2-input" type="text" placeholder="ID">' +
				  '<input id="node_label" class="swal2-input" placeholder="Label">',
				focusConfirm: false,
				allowOutsideClick: false,
				preConfirm: () => {
					if (!document.getElementById('node_label').value || !document.getElementById('node_id').value) {
						Swal.showValidationMessage(`Please enter all fields`)
					  }
				  }
			}).then((result) => {
				nodeData.label = document.getElementById('node_label').value;
				nodeData.id = document.getElementById('node_id').value;
				console.log(nodeData)
				callback(nodeData);
				add_node_to_kb(nodeData);
				console.log(pl_kb_nodes_string);

			})
		},
		addEdge: function(edgeData,callback) {
			if (edgeData.from === edgeData.to) {
				Swal.fire({title:'Waning', icon:'warning', text:'Non puoi collegare un nodo a se stesso'})
				return false;
			}
			/*
			var edge_from;
			var edge_to;
			Swal.fire({
				title: 'Add Node',
				html:
				  '<input id="edge_from" class="swal2-input" type="text" placeholder="From">' +
				  '<input id="edge_to" class="swal2-input" placeholder="To">',
				focusConfirm: false,
				allowOutsideClick: false,
				preConfirm: () => {
					edge_from = document.getElementById('edge_from').value;
					edge_to = document.getElementById('edge_to').value
					if (!edge_from || !edge_to) {
						Swal.showValidationMessage(`Please enter all fields`)
					  }
				  }
			}).then((result) => {
				edgeData.from = edge_from;
				edgeData.to = edge_to;
				console.log(edgeData);
				callback(edgeData);

			})
			*/
			callback(edgeData);
			add_edge_to_kb(edgeData);
			console.log(pl_kb_edges_string);


		},
	},
};
var network = new vis.Network(container, data, options);

network.on("click", function (params) {
	if(params.nodes.length > 2){
		alert('Seleziona al massimo due nodi');
		params.nodes.pop();

	}
	console.log(params.nodes);
  });


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

function default_query(){
	session.query('n_nodes(N).', {
		success: function (goal) {
			console.log('Query went well!')
			session.answers(puri);
		}
	})
}

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
	session.query("n_nodes(X), n_edges(Y).", {
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
	console.log('prova');
	session.consult('/prolog/default.pl');
	session.query('init.');
	session.answer((a) => {console.log(pl.format_answer(a))}) 
	console.log('dopo prova');
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
			pl_kb_edges_string += replace_edge_string(element);
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
			pl_kb_nodes_string += replace_node_string(element.id);
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

function add_node_to_kb(object){
	pl_kb_nodes_string += replace_node_string(object.id);
}

function add_edge_to_kb(object){
	pl_kb_edges_string += replace_edge_string(object);

}

function replace_node_string(node_id){
	return "node(%ID%). \n".replace("%ID%", node_id);
}

function replace_edge_string(edge){
	return "edge(%FROM%,%TO%). \n".replace("%FROM%", edge.from).replace("%TO%", edge.to)
}

/*
################################################
Other
################################################
*/

function path(){
	Swal.fire({
		title: 'Path tra due Nodi',
		html:
		  '<input id="path_from" class="swal2-input" type="text" placeholder="Label della partenza">' +
		  '<input id="path_to" class="swal2-input" placeholder="Label di arrivo">',
		focusConfirm: false,
		preConfirm: () => {
			if (!document.getElementById('path_from').value || !document.getElementById('path_to').value) {
				Swal.showValidationMessage(`Please enter all fields`)
			  }
		  }
	}).then((result) => {

	})
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