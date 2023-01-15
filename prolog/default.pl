node(1).
node(2).
node(3).
node(4).

edge(1,3).
edge(1,2).
edge(2,4).
edge(2,3).
edge(1,4).

edge_s(X,Y) :- edge(Y,X).
connected(X,Y) :- edge_s(X,Y); edge(X,Y).

list_edge(L) :- findall(X, edge(X,_), L).
list_node(L) :- findall(X, node(X), L).
list_lenght([],0).
list_lenght([_|T],N1) :- list_lenght(T,N), N1 is N+1.
n_nodes(N) :- list_node(X), list_lenght(X,N).
n_edges(N) :- list_edge(X), list_lenght(X,N).

star(X,L) :- findall(Y, connected(X,Y), L).
degree(X, N) :- star(X,L), list_lenght(L,N). 

last(X,[X]).
last(X, [_|T]) :- last(X, T).

not_in_list(X, []).
not_in_list(X, [H]) :- X =\= H.
not_in_list(X, [H|T]) :- X =\= H, not_in_list(X,T).

unique_elements([]).
unique_elements([X]).
unique_elements([H|T]) :- not_in_list(H,T), unique_elements(T),!. 

shortest_path(X,Y,P) :- path(X,Y,P), shortest_path_length(X,Y,N), list_lenght(P,N).
shortest_path_length(X,Y,N) :- setof(P, path(X,Y,P), Set), shortest_array_length(Set, N).
shortest_array_length([H|T], N) :- list_lenght(H,Z), shortest_array_length_procedure([H|T], Z, N).
shortest_array_length_procedure([H], Min, N) :- list_lenght(H, Z), N is min(Min, Z).
shortest_array_length_procedure([H|T], Min, N) :- list_lenght(H, L), Min2 is min(Min,L), shortest_array_length_procedure(T, Min2, N).

path(X,Y,P) :- part_of_path(X,Y,[],L), reverse(P,L).
part_of_path(X,Y,V,[Y|[X|V]]) :- connected(X,Y).
part_of_path(X,Y,V,P) :- connected(X,Z), not(member(Z,V)), Z =\= Y, part_of_path(Z,Y,[X|V],P).

walk([X,Y]) :- connected(X,Y).
walk([H|[H1|T]]) :- edged(H,H1), walk([H1|T]), unique_elements([H|[H1|T]]).