room(kitchen).
room(office).
room(hall).
room('dining room').
room(cellar).

door(office, hall).
door(kitchen, office ).
door(hall, 'dining room').
door(kitchen, cellar).
door('dining_room', kitchen).

location(desk, office).
location(apple, kitchen).
location(flashlight, desk).

door(X,Y) :- door(Y,X).
