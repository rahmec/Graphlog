// TO-DO:
//1
// [ ] query per contare il numero di archi e il numero di nodi
// [ ] tenere conto del nome dei nodi tramite una relazione node_name(id, label)?
//3
// [ ] scrivere il default kb dal file dentro js
// [ ] funzione per creare un grafo casuale
program_str = '\
node(1). \
node(2).\
node(3).\
node(4).\
edge(1,3).\
edge(1,2).\
edge(2,4).\
edge(2,3).\
edge(1,4).\
\
% Se lavori da CLI commenta questa parte che altrimenti non ti compila\
% ################################################\
% DOM MANIPULATION\
% ################################################\
:- use_module(library(dom)).\
init :- \
    n_nodes(N),\
    get_by_id("result_nodes",TxT1),\
    html(TxT1,N),\
    n_edges(E),\
    get_by_id("result_edges",TxT2),\
    html(TxT2,E),\
.\
% ################################################\
edge_s(X,Y) :- edge(Y,X).\
connected(X,Y) :- edge_s(X,Y); edge(X,Y).\
list_edge(L) :- findall(X, edge(X,_), L).\
list_node(L) :- findall(X, node(X), L).\
list_lenght([],0).\
list_lenght([_|T],N1) :- list_lenght(T,N), N1 is N+1.\
n_nodes(N) :- list_node(X), list_lenght(X,N).\
n_edges(N) :- list_edge(X), list_lenght(X,N).\
% coefficente binomiale, questi sono i casi standard non ricorsivi\
bc(N, 0, 1) :- N #>= 0.\
bc(N, N, 1) :- N #> 0. \
bc(M, N, R) :-\
    N #> 0,        % The N = 0 case is already covered in the first base case\
    M #> N,        % The M = N case is already covered in the second base case\
    R #>= M,       % This constraint prevents unbounded search in non-solution space\
    M1 #= M - 1,   % The rest of this is just the given formula\
    N1 #= N - 1,\
    bc(M1, N1, R1),\
    bc(M1, N, R2),\
    R #= R1 + R2\
.\
truncate(X,N,Result):- X >= 0, Result is floor(10^N*X)/10^N, !.\
graph_density(N) :- n_nodes(V), n_edges(E), bc(V,2,X), T is E/X, truncate(T,2,N).   \
\
star(X,L) :- findall(Y, connected(X,Y), L).\
degree(X, N) :- star(X,L), list_lenght(L,N).\
last(X,[X]).\
last(X, [_|T]) :- last(X, T).\
\
even(X) :- Z is mod(X, 2), Z == 0.\
\
not_in_list(X, []).\
not_in_list(X, [H]) :- X =\= H.\
not_in_list(X, [H|T]) :- X =\= H, not_in_list(X,T).\
\
unique_elements([]).\
unique_elements([X]).\
unique_elements([H|T]) :- not_in_list(H,T), unique_elements(T),!. \
\
walk([X,Y]) :- connected(X,Y).\
walk([H|[H1|T]]) :- edged(H,H1), walk([H1|T]), unique_elements([H|[H1|T]]).\
\
path(X,Y,P) :- part_of_path(X,Y,[],L), reverse(P,L).\
part_of_path(X,Y,V,[Y|[X|V]]) :- connected(X,Y).\
part_of_path(X,Y,V,P) :- connected(X,Z), not(member(Z,V)), Z =\= Y, part_of_path(Z,Y,[X|V],P).\
\
shortest_path(X,Y,P) :- path(X,Y,P), shortest_path_length(X,Y,N), list_lenght(P,N).\
shortest_path_length(X,Y,N) :- setof(P, path(X,Y,P), Set), shortest_array_length(Set, N).\
shortest_array_length([H|T], N) :- list_lenght(H,Z), shortest_array_length_procedure([H|T], Z, N).\
shortest_array_length_procedure([H], Min, N) :- list_lenght(H, Z), N is min(Min, Z).\
shortest_array_length_procedure([H|T], Min, N) :- list_lenght(H, L), Min2 is min(Min,L), shortest_array_length_procedure(T, Min2, N).\
\
connected_graph([H]) :- node(H).\
connected_graph([H1|[H2|T]]) :- path(H1,H2,_), exist_path(H1, [H2|T]), connected_graph([H2|T]), !.\
exist_path(X, [H]) :- path(X,H,_), !.\
exist_path(X, [H|T]) :- path(X,H,_), exist_path(X, T), !.\
\
eulerian([H]) :- degree(H, N), even(N).\
eulerian([H|T]) :- connected_graph([H|T]), degree(H, N), even(N), eulerian(T), !.\
\
hamiltonian([H|T], P) :- check_hamiltonian_cycles(H, T, P).\
check_hamiltonian_cycles(X, [H|T], Y) :- path(X,H,P), n_nodes(N), list_lenght(P, N), last(Z, P), connected(Z,X), append(P, [X], Y), !.\
check_hamiltonian_cycles(X, [H|T], P) :- check_hamiltonian_cycles(X, T, P). \
tree([H|T]) :-  n_nodes(N), n_edges(Z), Y is N-1, Z==Y, connected_graph([H|T]).\
'
program='prolog/default';
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
session.consult('prolog/default.pl');
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
	//kb = pl_kb_nodes_string + "\n" + pl_kb_edges_string;
	/*
	session.consult(kb, {
  		success: function () { console.log('Went well')},
  		error: function (err) { console.log(err) },
	});
	*/
	
	document.getElementById('action').style.display = "none";
	document.getElementById('query').style.display = "block";

	session.query('init.');
	session.answer((a) => {console.log(pl.format_answer(a))})

	var n_edges = data.edges.length;
	console.log(n_edges)
	var n_nodes = data.nodes.length;
	console.log(n_nodes)
	density =  n_edges / binomial(n_nodes,2);
	console.log(density);
	document.getElementById('result_density').innerHTML = density.toFixed(2);
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
		  '<input id="path_from" class="swal2-input" type="text" placeholder="Label della partenza">' +
		  '<input id="path_to" class="swal2-input" placeholder="Label di arrivo">',
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
			console.log(session.format_answer(a))
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
			console.log(session.format_answer(a))
			document.getElementById('tree').innerHTML = session.format_answer(a);
		}) 

}

function stable_set(){
	session.query('maximum_matching(X).');
	session.answer((a) => {console.log(pl.format_answer(a))}) 
	console.log(document.getElementById('stable_set'));
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