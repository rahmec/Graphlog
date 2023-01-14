node(1).
node(2).
node(3).
node(4).

edge(1,3).
edge(1,2).
edge(2,4).
edge(2,3).
edge(1,4).
%poiche il grafo è simmetrico
edge_s(X,Y) :- edge(Y,X).
connected(X,Y) :- edge_s(X,Y); edge(X,Y).
%trovare il numero di nodi e di archi
list_edge(L) :- findall(X, edge(X,_), L).
list_node(L) :- findall(X, node(X), L).
list_lenght([],0).
list_lenght([_|T],N1) :- list_lenght(T,N), N1 is N+1.
n_nodes(N) :- list_node(X), list_lenght(X,N).
n_edges(N) :- list_edge(X), list_lenght(X,N).

last(X,[X]).
last(X, [_|T]) :- last(X, T).

not_in_list(X, []).
not_in_list(X, [H]) :- X =\= H.
not_in_list(X, [H|T]) :- X =\= H, not_in_list(X,T).

unique_elements([]).
unique_elements([X]).
unique_elements([H|T]) :- not_in_list(H,T), unique_elements(T),!. 

walk([X,Y]) :- connected(X,Y).
walk([H|[H1|T]]) :- edged(H,H1), walk([H1|T]), unique_elements([H|[H1|T]]).

%path([H|L],Y) :- last(X,L), edged(X, Z), not_in_list(Z, [H|L]), append([H|L], Z, F), last(Y,F), print(F).
part_of_path(X,Y,L) :- not(last(Y, L)), unique_elements(L), not(member(Y, L)), walk(L).

%un path tra a e b esiste se esiste un percorso tra tra questi due, questo è la lista Q rovesciata
%path(A,B,Path) :-       travel(A,B,[A],Q), reverse(Q,Path).

%travel(A,B,P,[B|P]) :- connected(A,B).
% Si ottiene un percorso da A a B a condizione che A sia collegato a un nodo C diverso da B che non si trova sulla parte del percorso visitata in precedenza, e si continua a trovare un percorso da C a B
%travel(A,B,Visited,Path) :- connected(A,C), C \== B, \+member(C,Visited), travel(C,B,[C|Visited],Path). 

path([H|T], Y) :- connected(H,Y), reverse(Q,[H|T]), print(Q).
path([H|T], Y) :- connected(H,Z), not(member(Z,[H|T])), path([Z|[H|T]],Y).

%path(X,Y) :- edge(X,Y).
%path(X,Y,[X|T]) :- unique_elements([X|T]), walk([X|T]), last(Y,[X|T]).
%path(X,Y, L) :- edge(X,N), not_in_list(N,L). 
