count_to_X(X) :- count_to_X(X, 0), nl.
count_to_X(X, Y) :- Y=X, write(X), nl.
count_to_X(X, Y) :- Y\=X, write(Y), nl, Z is Y+1, count_to_X(X, Z).
