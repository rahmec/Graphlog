:- use_module(library(clpfd)). 

node(1).
node(2).
node(3).
node(4).

edge(1,3).
edge(1,2).
edge(2,4).
edge(2,3).
edge(1,4).

% Se lavori da CLI commenta questa parte che altrimenti non ti compila
% ################################################
% DOM MANIPULATION
% ################################################

:- use_module(library(dom)).

init :- 
    n_nodes(N),
    get_by_id('result_nodes',TxT1),
    html(TxT1,N),
    n_edges(E),
    get_by_id('result_edges',TxT2),
    html(TxT2,E),
    graph_density(D),
    get_by_id('result_density',TxT3),
    html(TxT3,D)
.

% ################################################



edge_s(X,Y) :- edge(Y,X).
connected(X,Y) :- edge_s(X,Y); edge(X,Y).

list_edge(L) :- findall(X, edge(X,_), L).
list_node(L) :- findall(X, node(X), L).
list_lenght([],0).
list_lenght([_|T],N1) :- list_lenght(T,N), N1 is N+1.
n_nodes(N) :- list_node(X), list_lenght(X,N).
n_edges(N) :- list_edge(X), list_lenght(X,N).


% coefficente binomiale, questi sono i casi standard non ricorsivi
bc(N, 0, 1) :- N #>= 0.
bc(N, N, 1) :- N #> 0. 
bc(M, N, R) :-
    N #> 0,        % The N = 0 case is already covered in the first base case
    M #> N,        % The M = N case is already covered in the second base case
    R #>= M,       % This constraint prevents unbounded search in non-solution space
    M1 #= M - 1,   % The rest of this is just the given formula
    N1 #= N - 1,
    bc(M1, N1, R1),
    bc(M1, N, R2),
    R #= R1 + R2
.
truncate(X,N,Result):- X >= 0, Result is floor(10^N*X)/10^N, !.
graph_density(N) :- n_nodes(V), n_edges(E), bc(V,2,X), T is E/X, truncate(T,2,N).   

star(X,L) :- findall(Y, connected(X,Y), L).
degree(X, N) :- star(X,L), list_lenght(L,N). 

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
part_of_path(X,Y,V,P) :- connected(X,Z), not(member(Z,V)), Z =\= Y, part_of_path(Z,Y,[X|V],P).

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
check_hamiltonian_cycles(X, [H|T], Y) :- path(X,H,P), n_nodes(N), list_lenght(P, N), last(Z, P), connected(Z,X), append(P, [X], Y), !.
check_hamiltonian_cycles(X, [H|T], P) :- check_hamiltonian_cycles(X, T, P). 

tree([H|T]) :-  n_nodes(N), n_edges(Z), Y is N-1, Z==Y, connected_graph([H|T]).