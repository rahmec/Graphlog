La densità del grafo è il rapporto tra il numero di archi presenti nel grafo e il massimo numero di archi che il grafo può contenere (nel caso in cui siamo completamente connesso). Fornisce un indicazione in
sulla connettività del grafo e su quanti archi possiasmo ancora aggiungere.

Il numero massimo di archi presenti in un grafo simmetrico è dato dalla seguente formula: $M_{edege} = \frac{|V|*(|V|-1)}{2}$
Possiamo ora definire la formula della densità del grafo: $D =\frac{|E|}{\frac{|V|*(|V|-1)}{2}} = \frac{2\cdot|E|}{|V|*(|V|-1)}$




Invece che usare is, il quale è più un approccio imperativo, si utilizzano gli operatori della constraint logic programming  (CLP) in quanto prolog fornisce supporto anche a quest'ultima

Per calcolare la densità del grafo abbiamo implementato il coefficente binomiale
Per eseguire il troncamento del risultato (ovvero limitare il numero di cifre decimali dopo la virgola) abbiamo implementato la seguente regola per troncare fino alla x cifra  $trunc(n,x) = [10^2 \cdot x]/10^n$
