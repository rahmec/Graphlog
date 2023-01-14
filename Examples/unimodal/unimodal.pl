ordered_inverse([]).
ordered_inverse([_]).
ordered_inverse([H| [T|L] ]) :- H>=T, ordered_inverse([T|L]).

ordered([]).
ordered([_]).
ordered([H| [T|L] ]) :- H=<T, ordered([T|L]).

unimodal_up([H|[T|L]]) :- H=<T, ordered_inverse(L).
unimodal_up([H|[T|L]]) :- H=<T, unimodal_up([T|L]).
unimodal_down([H|[T|L]]) :- H>=T, ordered(L).
unimodal_down([H|[T|L]]) :- H>=T, unimodal_down([T|L]).
unimodal([]).
unimodal([_]).
unimodal([H|T]) :- unimodal_up([H|T]); unimodal_down([H|T]).
