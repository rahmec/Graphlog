cube :- write("Write a number: "),
    read(Number),
    process(Number).

process(stop) :- !.
process(Number) :- 
    C is Number * Number * Number,
    write("Cube of "), write(Number), write(":"), tab(2), write(C).
