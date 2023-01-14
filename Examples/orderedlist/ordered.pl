ordered([]).
ordered([H]).
ordered([H| [T|L] ]) :- H=<T, ordered([T|L]).
