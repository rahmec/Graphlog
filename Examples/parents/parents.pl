%FACTS
female(pam).
female(ann).
female(liz).
male(bob).
male(tom).
male(pat).
male(jim).
parent(pam, bob).
parent(tom, bob).
parent(tom, liz).
parent(bob, ann).
parent(bob, pat).
parent(pat, jim).
%RULES
grandparent(Z, X) :- parent(Y, X), parent(Z, Y).
grandchild(Z, X) :- parent(Y, Z), parent(X, Y).
sibling(X, Y) :- parent(Z, X), parent(Z, Y).
mother(X, Y) :- parent(X, Y), female(X).
hasChild(X) :- parent(X, _).
sister(X, Y) :- parent(_,X), parent(_, Y), female(X).
aunt(X, Y) :- parent(Z, Y), sister(X, Z).
uncle(X, Y) :- parent(Z, Y), brother(X, Z).
cousin(X, Y) :- parent(Z1, X), parent(Z2, Y), sibling(Z1, Z2).
ancestor(X, Y) :- parent(X, Y).
ancestor(X,Y) :- parent(X, Z), ancestor(Z, Y).
