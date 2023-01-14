listlen([], 0).
listlen([_|T], N) :- listlen(T, N1), N is N1 +1.
