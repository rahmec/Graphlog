see(a, 2, 5).
see(d, 5, 5).
see(e, 5, 2).

on(a, b).
on(b, c).
on(c, table).
on(d, table).
on(e, table).

z(B, 0) :- on(B, table).
z(B1, Z1) :- on(B1, B2), z(B2, Z2), Z1 is Z2+1.
%z(B1, Z+1) :- on(B1, B2), z(B2, Z). TI FA VEDERE L'INSIEME DEI CALCOLI
xy(B1, X, Y) :- see(B1, X, Y).
xy(B1, X, Y) :- on(B2, B1), see(B2, X, Y).

over(B1, B2) :- on(B1, B2).
over(B1, B2) :- on(B1, B3), over(B3, B2).

times_over(B1, B2, 1) :- on(B1, B2).
times_over(B1, B2, Z1) :- on(B1, B3), times_over(B3, B2, Z3), Z1 is Z3+1.

number_over(B1, 0) :- see(B1, _, _).
number_over(B1, X) :- over(B2, B1), number_over(B2, Y), X is Y+1.
