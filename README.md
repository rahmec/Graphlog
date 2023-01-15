<p align="center" style="margin-bottom:5px;">
  <img src="assets/img/logo.png" sytle="width:300px;height:auto">
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

## Funzionamento
L'applicativo dispone di un interafaccia grafica che consente all'utente di caricare il proprio grafo seguendo la notazione `json`. Una volta premuto il submit
apparirà una schermata che presenterà all'utente la rappresentazione grafica del grafo da lui indicato e una serie di informazioni ed azioni da eseguire sul grafo.

### Facts

### Rules
L'agente che abbiamo realizzato è del tipo **Simple-Reflex** in quanto esegue una azione in riposta ad una certa condizione. La percezione che funziona da trigger per le azioni prestabilite è l'interazione da parte dell'utente tramite UI. Le action implementeate sono:

- [X] **Determinare il numero di nodi**: abbiamo definito la regola `list_lenght`, la quale data una generica lista ne conta la lunghezza; costruiamo una lista che contiene tutti i fatti `node` e poi la passiamo alla regola che ne calcola la lunghezza.
  ```prolog
    list_lenght([],0).
    list_lenght([_|T],N1) :- list_lenght(T,N), N1 is N+1.
    list_node(L) :- findall(X, node(X), L).
    n_nodes(N) :- list_node(X), list_lenght(X,N).
  ```
- [X] **Determinare il numero di archi**: abbiamo definito una regola analoga analoga a quella per i nodi.
  ```prolog
    list_edge(L) :- findall(X, edge(X,_), L).
    n_edges(N) :- list_edge(X), list_lenght(X,N). 
   ```
- [X] **Determinare la stella di un nodo e il suo grado**: la stella è l'insieme di archi adiacenti al nodo; il segeunte fatto ritorna una lista dei nodi che hanno una connessione diretta con quello indicato. Per determinare il grado riutilizziamo il predicato list lenght.
  ```prolog
    star(X,L) :- findall(Y, connected(X,Y), L).
    degree(X, N) :- star(X,L), list_lenght(L,N). 
  ```
- [ ] Determinare il nodo con grado minimo/massimo

- [X] **Percorso tra due nodi**: un percorso è una sequenza di nodi (o archi) adiacenti che non si ripetono, per determinare il percorso tra due nodi abbiamo bisogno di costruirlo in maniera incrementale. La regola `part_of_path\4` è una relazione tra i nodi di partenza e arrivo, i nodi visitati fino a quel momento e il path complessivo. Se X non è connesso direttamente a Y allora cerco uno Z che non è membro di quelli visitati che è in connesso a Y o a sua volta connesso a qualcuno che è connesso a Y.
    ```prolog
      path(X,Y,P) :- part_of_path(X,Y,[],L), reverse(P,L).  
      part_of_path(X,Y,V,[Y|[X|V]]) :- connected(X,Y).
      part_of_path(X,Y,V,P) :- connected(X,Z), not(member(Z,V)), Z =\= Y, part_of_path(Z,Y,[X|V],P).
    ```
- [X] **Determinare il percorso minimo tra due nodi**:
    ```prolog
    ```

- [X] **Determinare se il grafo è connesso**: un grafo è connesso se è composto da una sola componente connessa ovvero se a partire da qualsiasi nodo posso raggiungere tutti gli altri. La regola `exist_path` determina se esiste un percorso tra il nodo corrente e tutti gil altri del grafo. La regola `connected_graph` itera questa procedura per tutti i nodi. 
    ```prolog
      connected_graph([H]) :- node(H).
      connected_graph([H1|[H2|T]]) :- exist_path(H1, [H2|T]), connected_graph([H2|T]), !.
      exist_path(X, [H]) :- path(X,H,_), !.
      exist_path(X, [H|T]) :- path(X,H,_), exist_path(X, T), !.
    ```
- [X] **Determinare se il grafo è Euleriano**: dal Teorema di Eurelo sappiamo che un grafo è eureliano (ammette ciclo euleriano) se è connesso e se ogni nodo ha grado pari.
    ```prolog
      eulerian([H]) :- degree(H, N), even(N).
      eulerian([H|T]) :- connected_graph([H|T]), degree(H, N), even(N), eulerian(T), !.
    ```
- [X] **Determinare ciclo Hamiltoniano sul grafo**:
    ```prolog
    
    ```
- [X] Determinare se il grafo è un albero
- [ ] Determinare se il grafo è bipartito
- [ ] Determinare il colore cromatico

## Contributors
<table>
  <tbody>
    <tr>
    <td align="center"><a href="https://github.com/OT-Rax"><img src="https://i.pinimg.com/736x/a4/84/12/a48412e0969152efac9ae07c308a5143.jpg"" width="72px;"   alt=""/><br /><sub><b>Rahmi El Mehcri</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/DavideDeZuane"><img src="https://i.pinimg.com/736x/a4/84/12/a48412e0969152efac9ae07c308a5143.jpg"" width="72px;"   alt=""/><br /><sub><b>Davide De Zuane</b></sub></a><br /></td>
    </tr>
   </tbody>
  </table>
