<p align="center" style="margin-bottom:5px;">
  <img src="assets/img/logo.png" sytle="width:300px;height:auto">
</p>

<h1 align="center" style="font-weight:800; font-size:40px"> Graphlog</h1>

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

- [X] Determinare il numero di nodi
- [X] Determinare il numero di archi
- [ ] Presenza di un percorso tra due nodi
- [ ] Presenza di un cammino tra due nodi
- [ ] Calcolo dei principari indicatori di un grafo
- [ ] Determinare se il grafo è eureliano
- [ ] Determinare se il grafo è un albero
- [ ] Determminare quale nodo è la radice dell'albero
- [ ] Determinare se il grafo è bipartito
- [ ] Determinare il colore cromatico
- [ ] Determinare la stella di un nodo
- [ ] Determinare il grado di un nodo
- [ ] Determinare il nodo con grado minimo/massimo
- [ ] Determianre la distanza tra due nodi e il percorso minimo
- [ ] Determinare cammini, passeggiate e cicli sul grafo

## Contributors
<table>
  <tbody>
    <tr>
    <td align="center"><a href="https://github.com/OT-Rax"><img src="https://i.pinimg.com/736x/a4/84/12/a48412e0969152efac9ae07c308a5143.jpg"" width="72px;"   alt=""/><br /><sub><b>Rahmi El Mehcri</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/DavideDeZuane"><img src="https://i.pinimg.com/736x/a4/84/12/a48412e0969152efac9ae07c308a5143.jpg"" width="72px;"   alt=""/><br /><sub><b>Davide De Zuane</b></sub></a><br /></td>
    </tr>
   </tbody>
  </table>
