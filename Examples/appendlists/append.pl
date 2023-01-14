append([],L2,L2).
append([H|T], L2, [L3|H]) :- append(T, L2, L3).

