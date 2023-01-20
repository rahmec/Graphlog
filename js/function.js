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
				callback(nodeData);
				add_node_to_kb(nodeData);

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

	session.consult("prolog/default.pl", {
  		success: function () { 
			console.log('Went well');
			session.consult(kb,{
				success: function(){init();}
			})
		},
  		error: function (err) { console.log(err) },
	});
	session.query('minimum_star(X).');
	session.answer((a) => {
		console.log(session.format_answer(a))})
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
	var from;
	var to;
	Swal.fire({
		title: 'Path tra due Nodi',
		html:
		  '<input id="path_from" class="swal2-input" type="text" placeholder="ID della partenza">' +
		  '<input id="path_to" class="swal2-input" placeholder="ID di arrivo">',
		focusConfirm: false,
		preConfirm: () => {
			from = document.getElementById('path_from').value;
			to = document.getElementById('path_to').value
			if (!from || !to) {
				Swal.showValidationMessage(`Please enter all fields`)
			  }
		  }
	}).then((result) => {
		path_query = "shortest_path(%FROM%, %TO%, P).".replace("%FROM%", from).replace("%TO%", to);
		session.query(path_query);
		session.answer((a) => {
			if(session.format_answer(a) == 'false'){ 
				document.getElementById('min_path').innerHTML = 'Nessun cammino';
				return false;
			}
			document.getElementById('min_path').innerHTML = session.format_answer(a);

		}) 
	})
}

function tree(){
	tree_query = 'list_node(L), tree(L).';
	session.query(tree_query);
		session.answer((a) => {
			document.getElementById('tree').innerHTML = session.format_answer(a);
		}) 

}

function eulerian(){
	eulerian_query = "list_node(L), eulerian(L).";
	session.query(eulerian_query);
	session.answer((a) => {
		document.getElementById('eulerian').innerHTML = session.format_answer(a);
	}) 
}

function hamiltonian(){
	hamilton_query = "list_node(L), hamiltonian(L,P).";
	session.query(hamilton_query);
	session.answer((a) => {
		document.getElementById('hamiltonian').innerHTML = session.format_answer(a);
	}) 
}

function biparted(){
	biparted_query = "biparted(Z).";
	session.query(biparted_query);
	session.answer((a) => {
		document.getElementById('biparted').innerHTML = session.format_answer(a);
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

function binomial(n, k) {
	if ((typeof n !== 'number') || (typeof k !== 'number')) 
 return false; 
   var coeff = 1;
   for (var x = n-k+1; x <= n; x++) coeff *= x;
   for (x = 1; x <= k; x++) coeff /= x;
   return coeff;
}

function randomGraph(){
    cleanGraph();
    random_node_number = Math.floor(Math.random() * 8)+4;
    json_nodes = [];
    json_edges = [];
    added_edges = [];
    for(let i=1; i<=random_node_number; i++){
	json_nodes.push({id: i, label: 'Node '+i, shape: "dot"});
	pl_kb_nodes_string += replace_node_string(i);
	random_edges_number = Math.floor(Math.random() * 2)+1;
	for(let j=0; j<random_edges_number; j++){
	    random_node = Math.floor(Math.random() * random_node_number)+1;
	    while(random_node == i){
		random_node = Math.floor(Math.random() * random_node_number)+1;
	    }
	    var flag = true;
	    for(let k=0; k<added_edges.length; k++){
		if((added_edges[k][0] == i  &&  added_edges[k][1] == random_node) || (added_edges[k][0] == random_node  &&  added_edges[k][1] == i)){
		    flag = false;
		    break;
		}
	    }
	    if(flag){
		pl_kb_nodes_string += replace_edge_string({from: i, to: random_node});
		json_edges.push({from: i, to: random_node});
		added_edges.push([i,random_node]);
	    }
	}
    }
    nodes = new vis.DataSet(json_nodes);
    edges = new vis.DataSet(json_edges);
    data.nodes = nodes;
    data.edges = edges;
    network = new vis.Network(container, data, options);
    kb = pl_kb_nodes_string + "\n" + pl_kb_edges_string;
    session.consult("prolog/default.pl", {
	    success: function () { 
		    console.log('Went well');
		    session.consult(kb,{
			    success: function(){init();}
		    })
	    },
	    error: function (err) { console.log(err) },
    });
}

function init(){
    document.getElementById('action').style.display = "none";
    document.getElementById('query').style.display = "block";

    session.query('init.');
    session.answer((a) => {console.log(pl.format_answer(a))})

    var n_edges = data.edges.length;
    var n_nodes = data.nodes.length;

    density =  n_edges / binomial(n_nodes,2);
    document.getElementById('result_density').innerHTML = density.toFixed(2);
}
