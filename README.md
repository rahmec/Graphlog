<p align="center" style="margin-bottom:5px;">
  <img src="assets/img/logo-transparent.png" sytle="width:300px;height:auto">
</p>

<h1 align="center" style="font-weight:800; font-size:80px"> GraphLog</h1>

Progetto universitario per la realizzazione di un agente che consenta di eseguire analisi su grafi. Si tratta di una single-page application scritta in `HTML` e `JS` per consentire la facilità di utilizzo del linguaggio dichiarativo `prolog`. Le principali tecnologie utilizzate sono:

- <img src="https://visjs.org/images/visjs_logo.png" width="14"></img> [VisJS](https://visjs.org/): libreria js per la visualizzazione e manipolazione di grafi 
- <img src="https://avatars.githubusercontent.com/u/57189039?s=200&v=4" width="14"></img> [TauProlog](http://tau-prolog.org/): interprete prolog per il js

L'obiettivo principale è quello di realizzare un applicativo che consenta di realizzare in maniera intuitiva e semplice analisi su grafi e di riportare i principali modelli di programmazione matematica in un linguaggio dichiarativo come prolog.

## Ambiente di Lavoro
Specifichiamo l'ambiente, e le sue caratteristiche, in cui dovrà operare l'agente.
| **Agent Type**  | **Performance Measure** |  **Enviroment** | **Actuators**  |  **Sensors** |
|---|---|---|---|---|
|  Symple Reflex | None |  Different type of graphs | Web Inteface  | User Interface  |


Le proprietà dell'ambiente sono necessarie per determinare il modello da applicare e per realizzare una buona progettazione.

| **Task Enviroment**  | **Observable** |  **Agents** | **Deterministics**  |  **Episodic** | **Static** |  **Discrete** |
|---|---|---|---|---|---|---|
|  Graph Analysis |  Fully |  Single |  Deterministic | Episodic  | Semi| Discrete |

## Prolog
L'applicativo dispone di un interafaccia grafica che consente all'utente di caricare il proprio grafo seguendo la notazione `json`. Una volta premuto il submit
apparirà una schermata che presenterà all'utente la rappresentazione grafica del grafo da lui indicato e una serie di informazioni ed azioni da eseguire sul grafo.

### Facts
I fatti, attraverso i quali descriviamo il grafo in prolog, sono i seguenti:
- Per descrivere la presenza di un nodo `x` utilizziamo il predicato 
   ```prolog
     node(x).
   ```
- Per descrivere la presenza di un arco tra il nodo `x` e il nodo `y` utilizziamo il predicato
  ```prolog
    edge(x,y).
  ```
- Poichè consideriamo grafi simmetrici non teniamo conto dell'orientamentpo degli archi e definiamo le seguenti regole
  ```prolog
    edge_s(X,Y) :- edge(Y,X).
    connected(X,Y) :- edge_s(X,Y); edge(X,Y).
   ```

### Rules
L'agente che abbiamo realizzato è del tipo **Simple-Reflex** in quanto esegue una azione in riposta ad una certa condizione. La percezione che funziona da trigger per le azioni prestabilite è l'interazione da parte dell'utente tramite UI. 

Segue una lista delle action implementate e delle regole che le realizzano:

- [X] **Determinare il numero di nodi**: la regola `list_lenght\2`, data una generica lista, ne conta la lunghezza; costruiamo una lista che contiene tutti gli oggetti della relazione unaria `node\1` e la lunghezza di questa lista è proprio il numero di nodi. 
La rules `n_nodes\1` non fa altro che crare la lista dei nodi e calcolarne la lunghezza.
  ```prolog
    list_lenght([],0).
    list_lenght([_|T],N1) :- list_lenght(T,N), N1 is N+1.
    list_node(L) :- findall(X, node(X), L).
    n_nodes(N) :- list_node(X), list_lenght(X,N).
  ```
  
- [X] **Determinare il numero di archi**: si procede in maniera analoga a quanto visto per la regola precedente, definiamo una regola che crea una lista degli archi e poi se ne calcola la lunghezza. Implementata dalla regola `n_edges\1`.
  ```prolog
    list_edge(L) :- findall(X, edge(X,_), L).
    n_edges(N) :- list_edge(X), list_lenght(X,N). 
   ```
   
- [X] **Determinare la stella di un nodo e il suo grado**: la stella di un nodo è l'insieme di archi incidenti al nodo, `star\1` non fa altro che creare una lista di tutti quei nodi che sono adiacenti al nodo `X` (facciamo uso della regola `connected\2` in quanto trattiamo grafi simmetrici). Il grado del nodo non è altro che la cardinalità della stella perciò ci basta calcolare la lunghezza della lista risultante.
  ```prolog
    edge_s(X,Y) :- edge(Y,X).
    connected(X,Y) :- edge_s(X,Y); edge(X,Y).
    star(X,L) :- findall(Y, connected(X,Y), L).
    degree(X, N) :- star(X,L), list_lenght(L,N). 
  ```
- [ ] Determinare il nodo con grado minimo/massimo

- [X] **Percorso tra due nodi**: un percorso è una sequenza di nodi (o archi) adiacenti che non si ripetono, per determinare il percorso tra due nodi abbiamo bisogno di costruirlo in maniera incrementale. La regola `part_of_path\4` è una relazione tra i nodi di partenza e arrivo, i nodi visitati fino a quel momento e il path complessivo. Se X non è connesso direttamente a Y allora cerco uno Z che non è membro di quelli visitati che connesso a Y o a sua volta connesso a qualcuno che è connesso a Y.
    ```prolog
      path(X,Y,P) :- part_of_path(X,Y,[],L), reverse(P,L).  
      part_of_path(X,Y,V,[Y|[X|V]]) :- connected(X,Y).
      part_of_path(X,Y,V,P) :- connected(X,Z), not(member(Z,V)), Z =\= Y, part_of_path(Z,Y,[X|V],P).
    ```
- [X] **Determinare il percorso minimo tra due nodi**:
    ```prolog
    ```

- [X] **Determinare se il grafo è connesso**: un grafo è connesso se è composto da una sola componente connessa ovvero se a partire da qualsiasi nodo posso raggiungere tutti gli altri. La regola `exist_path\2` determina se esiste un percorso tra il nodo corrente e tutti gil altri del grafo. La regola `connected_graph\1` itera questa procedura per tutti i nodi. 
    ```prolog
      connected_graph([H]) :- node(H).
      connected_graph([H1|[H2|T]]) :- exist_path(H1, [H2|T]), connected_graph([H2|T]), !.
      exist_path(X, [H]) :- path(X,H,_), !.
      exist_path(X, [H|T]) :- path(X,H,_), exist_path(X, T), !.
    ```
- [X] **Determinare se il grafo è Euleriano**: dal Teorema di Eurelo sappiamo che un grafo è eureliano (ammette ciclo euleriano) se è connesso e se ogni nodo ha grado pari. Quindi riutilizziamo la regola che determina se il grafo è connesso e richiediamo che il grado di ogni nodo sia pari, per farlo utilizziamo la regola `even\1`.
    ```prolog
      even(X) :- Z is mod(X, 2), Z == 0.
      eulerian([H]) :- degree(H, N), even(N).
      eulerian([H|T]) :- connected_graph([H|T]), degree(H, N), even(N), eulerian(T), !.
    ```
- [X] **Determinare ciclo Hamiltoniano sul grafo**: un ciclo Hamiltoniano attraversa tutti i nodi del grafo una e una solta volta; per prima cosa tra tutti i path controllo che ne esista uno che inizia in un nodo e finisce in un nodo connesso al nodo iniziale, se un path di questo tipo esiste allora controllo che l'ultimo elemento del Path sia connesso al primo nodo e che la lunghezza del percorso ottenuta sia pari al numero di nodi.
    ```prolog
      hamiltonian([H|T], P) :- check_hamiltonian_cycles(H, T, P).
      check_hamiltonian_cycles(X, [H|T], Y) :- path(X,H,P), n_nodes(N), list_lenght(P, N), last(Z, P), connected(Z,X), append(P, [X], Y), !.
      check_hamiltonian_cycles(X, [H|T], P) :- check_hamiltonian_cycles(X, T, P). 
    ```
- [X] **Determinare se il grafo è un albero**: un grafo simmetrico è un albero se e solo se risulta connesso e ha un numero di archi pari al numero di nodi meno. Allora affinchè il grafo sia un albero deve soddisfare `conntected_graph` e inoltre che il numero di nodi e il numero di archi rispettino la relazione descritta.
Abbiamo deciso di mettere prima la condizione sui nodi ed archi poichè si riesce a verificare più velocemente rispetto alla connesione del grafo.
    ```prolog
      tree([H|T]) :-  n_nodes(N), n_edges(Z), Y is N-1, Z==Y, connected_graph([H|T]).
    ```
## JavaScript



## Contributors
<table>
  <tbody>
    <tr>
    <td align="center"><a href="https://github.com/OT-Rax"><img src="https://avatars.githubusercontent.com/u/61871646?v=4" width="72px;"/><br /><sub><b>Rahmi El Mehcri</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/DavideDeZuane"><img src="https://avatars.githubusercontent.com/u/73750232?v=4" style="border-radius: 50%;" width="72px;"></img><br /><sub><b>Davide De Zuane</b></sub></a><br /></td>
    </tr>
   </tbody>
  </table>
