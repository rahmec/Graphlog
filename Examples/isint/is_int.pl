is_int(0).
is_int(X) :- is_int(Y), X is Y+1.
