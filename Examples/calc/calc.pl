calc(X, Y) :- SUM is X + Y, write('Sum is '), write(SUM), nl,
    SUB is X - Y, write('Subtraction is '), write(SUB), nl,
    MUL is X * Y, write('Multipication is '), write(MUL), nl,
    DIV is X / Y, write('Division is '), write(DIV), nl,
    INT_DIV is X // Y, write('Integer Division is '), write(INT_DIV), nl,
    POW is X ** Y, write('Power is '), write(POW), nl,
    MOD is X mod Y, write('Modulus is '), write(MOD), nl.
