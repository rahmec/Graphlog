:- use_module(library(lists)).
:- use_module(library(js)).

% Se lavori da CLI commenta questa parte che altrimenti non ti compila
% ################################################
% DOM MANIPULATION
% ################################################

:- use_module(library(dom)).

init :- 
    n_nodes(V), get_by_id('result_nodes',TxT1), html(TxT1,V),
    n_edges(E), get_by_id('result_edges',TxT2), html(TxT2,E),
    maximum_stable_set(S), get_by_id('stable_set', TxT3), html(TxT3,S),
    minimum_edge_cover(EC), get_by_id('edge_cover', TxT4), html(TxT4,EC),
    maximum_star(N1,Value1),
    get_by_id('max_star', TxT5), html(TxT5, Value1),
    get_by_id('node_max_star', TxT6), html(TxT6, N1),
    minimum_star(N2,Value2),
    get_by_id('min_star', TxT7), html(TxT7, Value2),
    get_by_id('node_min_star', TxT8), html(TxT8, N2),
    maximum_matching(M), get_by_id('matching', TxT9), html(TxT9,M),
    minimum_vertex_cover(VC), get_by_id('vertex_cover',TxT10), html(TxT10,VC)
.

% ################################################

edge_array([X|[Y]]) :- edge(X,Y).
edge_s(X,Y) :- edge(Y,X).
connected(X,Y) :- edge_s(X,Y); edge(X,Y).

list_edge(L) :- findall(X, edge(X,_), L).
list_node(L) :- findall(X, node(X), L).
list_lenght([],0).
list_lenght([_|T],N1) :- list_lenght(T,N), N1 is N+1.
n_nodes(N) :- list_node(X), list_lenght(X,N).
n_edges(N) :- list_edge(X), list_lenght(X,N).

star(X,L) :- setof(Y, connected(X,Y), L).
degree(X, N) :- star(X,L), list_lenght(L,N). 
minimum_star(N,X) :- findall(Y, star(_, Y), L), minimum_list_in_lists(L, X), star(N, X).
maximum_star(N,X) :- findall(Y, star(_, Y), L), maximum_list_in_lists(L, X), star(N, X).

subtraction(L1,[],L1).
subtraction([],_,[]).
subtraction(L1,L2,X) :- subtraction_calculation(L1, L2, [], X), !.
subtraction_calculation([H|T], L2, C, X) :- \+member(H,L2), append(C, [H], U), subtraction_calculation(T, L2, U, X).
subtraction_calculation([H|T], L2, C, X) :- member(H,L2), subtraction_calculation(T, L2, C, X).
subtraction_calculation([H], L2, C, X) :- \+member(H, L2), append(C, [H], X).
subtraction_calculation([H], L2, C, C) :- member(H, L2).

intersection(_,[],[]).
intersection([],_,[]).
intersection(L1,L2,X) :- intersection_calculation(L1, L2, [], X), !.
intersection_calculation([H|T], L2, C, X) :- member(H,L2), append(C, [H], U), intersection_calculation(T, L2, U, X).
intersection_calculation([H|T], L2, C, X) :- \+member(H,L2), intersection_calculation(T, L2, C, X).
intersection_calculation([H], L2, C, X) :- member(H, L2), append(C, [H], X).
intersection_calculation([H], L2, C, C) :- \+member(H, L2).

last(X,[X]).
last(X, [_|T]) :- last(X, T).

even(X) :- Z is mod(X, 2), Z == 0.

not_in_list(X, []).
not_in_list(X, [H]) :- X =\= H.
not_in_list(X, [H|T]) :- X =\= H, not_in_list(X,T).

unique_elements([]).
unique_elements([X]).
unique_elements([H|T]) :- not_in_list(H,T), unique_elements(T),!. 

walk([X,Y]) :- connected(X,Y).
walk([H|[H1|T]]) :- edged(H,H1), walk([H1|T]), unique_elements([H|[H1|T]]).

path(X,Y,P) :- part_of_path(X,Y,[],L), reverse(P,L).
part_of_path(X,Y,V,[Y|[X|V]]) :- connected(X,Y).
part_of_path(X,Y,V,P) :- connected(X,Z), \+member(Z,V), Z =\= Y, part_of_path(Z,Y,[X|V],P).

shortest_path(X,Y,P) :- path(X,Y,P), shortest_path_length(X,Y,N), list_lenght(P,N).
shortest_path_length(X,Y,N) :- setof(P, path(X,Y,P), Set), shortest_array_length(Set, N).
shortest_array_length([H|T], N) :- list_lenght(H,Z), shortest_array_length_procedure([H|T], Z, N).
shortest_array_length_procedure([H], Min, N) :- list_lenght(H, Z), N is min(Min, Z).
shortest_array_length_procedure([H|T], Min, N) :- list_lenght(H, L), Min2 is min(Min,L), shortest_array_length_procedure(T, Min2, N).

connected_graph([H]) :- node(H).
connected_graph([H1|[H2|T]]) :- path(H1,H2,_), exist_path(H1, [H2|T]), connected_graph([H2|T]), !.
exist_path(X, [H]) :- path(X,H,_), !.
exist_path(X, [H|T]) :- path(X,H,_), exist_path(X, T), !.

eulerian([H]) :- degree(H, N), even(N).
eulerian([H|T]) :- connected_graph([H|T]), degree(H, N), even(N), eulerian(T), !.

hamiltonian([H|T], P) :- check_hamiltonian_cycles(H, T, P).
check_hamiltonian_cycles(X, [H|T], Y) :- path(X,H,P), n_nodes(N), N=\=2,list_lenght(P, N), last(Z, P), connected(Z,X), append(P, [X], Y), !.
check_hamiltonian_cycles(X, [H|T], P) :- check_hamiltonian_cycles(X, T, P). 

tree([H|T]) :-  n_nodes(N), n_edges(Z), Y is N-1, Z==Y, connected_graph([H|T]).


disconnected(X, [H]) :- node(X), node(H), X=\=H, \+connected(X,H).
disconnected(X, [H|T]) :- node(X), node(H), X=\=H, \+connected(X,H), disconnected(X, T).

stable_set([]).
stable_set([H]) :- node(H).
stable_set([H|T]) :- list_node(X), subset(X,[H|T]), disconnected(H, T), stable_set(T).
stable_set([H|T]) :- list_node([H|T]), disconnected(H, T), !.

maximum_stable_set(X) :- setof(Z, stable_set(Z), S), maximum_list_in_lists(S, X), !.
stable_set_of_cardinality(X, C) :- stable_set(X), list_lenght(X, Z), Z==C, !.

maximum_length([H|T], X) :- list_lenght(H, N), maximum_length_calculation(T, N, Y), X is max(N,Y).
maximum_length([H], X) :- list_lenght(H, X).
maximum_length_calculation([H|T], U, X) :- list_lenght(H, N), Z is max(U,N), maximum_length_calculation(T, Z, X).
maximum_length_calculation([H|T], U, X) :- list_lenght(H, N), X is max(U,N).
maximum_list_in_lists(L, X) :- maximum_length(L, N), member(X,L), list_lenght(X,M), N==M, !.

ordered([]).
ordered([H]).
ordered([H| [T|L] ]) :- H=<T, ordered([T|L]).

graph([H]) :- node(H).
graph([H|T]) :- graph(T), node(H), unique_elements([H|T]).

subset([], []).
subset([E|Tail], [E|NTail]):- subset(Tail, NTail).
subset([_|Tail], NTail):- subset(Tail, NTail).

same([H1], [H2]) :- H1 == H2.
same([H1|T1], [H2|T2]) :- H1==H2, same(T1, T2), !.

matching(E) :- setof(X, edge_array(X), S), subset(S, E), arrays_dont_intersect(E).
edges_subset(E) :- setof(X, edge_array(X), S), subset(S, E).
arrays_dont_intersect([H]).
arrays_dont_intersect([H|[H1|T]]) :- intersection(H,H1,X), list_lenght(X,N), N==0, arrays_dont_intersect([H|T]), arrays_dont_intersect([H1|T]).
maximum_matching(M) :- setof(X, matching(X), S), maximum_list_in_lists(S,M).

disconnected_graph([H]) :- node(H).
disconnected_graph([H|T]) :- list_node(L), subset(L, [H|T]), disconnected(H, T), disconnected_graph(T).
biparted(Z) :- list_node(L), disconnected_graph(X), subtraction(L,X,Y), disconnected_graph(Y), Z=[X,Y], !.

minimum_length([H], X) :- list_lenght(H, X).
minimum_length([H|T], X) :- list_lenght(H, N), minimum_length_calculation(T, N, Y), X is min(N,Y).
minimum_length_calculation([H|T], U, X) :- list_lenght(H, N), Z is min(U,N), minimum_length_calculation(T, Z, X).
minimum_length_calculation([H|T], U, X) :- list_lenght(H, N), X is min(U,N).
minimum_list_in_lists(L, X) :- minimum_length(L, N), member(X,L), list_lenght(X,M), N==M, !.

vertex_cover(X) :- list_node(L), subset(L, X), setof(Y, edge_array(Y), E), edge_covered_by_nodes(X,E).
edge_covered_by_nodes(X, [H]) :- subtraction(H,X,S), list_lenght(S,N), N=<1.
edge_covered_by_nodes(X, [H|T]) :- subtraction(H,X,S), list_lenght(S,N), N=<1, edge_covered_by_nodes(X, T).
minimum_vertex_cover(V) :- setof(X, vertex_cover(X), S), minimum_list_in_lists(S, V).

edge_cover(X) :- setof(Y, edge_array(Y), E), subset(E,X), covered_nodes(X, N), list_node(L), same(L,N).
covered_nodes(E, N) :- elements_union(E, X), sort(X, N).
elements_union([H], H).
elements_union([H|T], X) :- elements_union_steps(T, H, X).
elements_union_steps([H], U, X) :- append(H, U, X).
elements_union_steps([H|T], U, X) :- append(H, U, Z), elements_union_steps(T, Z, X).
minimum_edge_cover(E) :- setof(X, edge_cover(X), S), minimum_list_in_lists(S, E).