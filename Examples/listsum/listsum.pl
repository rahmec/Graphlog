somma([], 0).
somma([H|T], S) :- somma(T, ST), S is ST + H.
