//Clase para realizar un grafo extra y realizar las busquedas DFS y BFS
class Graph {
    constructor(numVertices, network) {
        this.numVertices = numVertices;
        this.adjList = new Map();
        this.brokerSearch = false;
        this.network = network; // Añadimos referencia a la red de vis.js
    }

    addNode(node) {
        this.adjList.set(node, []);
    }
    
    addEdge(from, to) {
        this.adjList.get(from).push(to);
        this.adjList.get(to).push(from);
    }
    
    printGraph() {
        let nodes = this.adjList.keys();
        for (let node of nodes) {
            let nodeValues = this.adjList.get(node);
            let conc = "";
            for (let value of nodeValues)
                conc += `${value} `;
            console.log(`${node} -> ${conc}`);
        }
    }
    
    // Método para iluminar un nodo
    highlightNode(nodeId, color = '#2ecc71') {
        return new Promise((resolve) => {
            this.network.body.data.nodes.update({
                id: nodeId, 
                color: color,
                font: { color: '#edeef0' }
            });
            
            setTimeout(() => {
                resolve();
            }, 500); // Tiempo de espera para ver la iluminación
        });
    }

    // Método para resetear los colores de los nodos
    resetNodeColors() {
        const nodes = this.network.body.data.nodes.get({
            filter: (node) => node.id !== nodoMeta
        });
        
        nodes.forEach(node => {
            this.network.body.data.nodes.update({
                id: node.id, 
                color: node.id === nodoMeta ? '#d71212' : '#3a595c',
                font: { color: '#edeef0' }
            });
        });
    }
    
    // Método para limpiar la lista de resultados
    clearResults() {
        resultList.innerHTML = '';
    }
    
    // Método para añadir un nodo a la lista de resultados
    addToResults(node) {
        console.log(node); // Mantener el console.log original para depuración
        const li = document.createElement('li');
        li.textContent = `Visitando nodo ${node}`;
        if (node === nodoMeta) {
            li.textContent += " (META ENCONTRADA!)";
            li.style.fontWeight = "bold";
            li.style.color = "#d71212";
        }
        resultList.appendChild(li);
    }
    
// Método DFS animado
async dfs(startingNode, Goal) {
    this.clearResults();
    this.resetNodeColors();
    this.brokerSearch = false;
    let visited = {};
    await this.DFSUtil(startingNode, Goal, visited);
}

// Método DFSUtil animado modificado
async DFSUtil(initNode, Goal, visited) {
    if (this.brokerSearch) return;

    // Marcar el nodo como visitado y mostrar en pantalla
    visited[initNode] = true;
    await this.highlightNode(initNode);
    this.addToResults(`Avanza: ${initNode}`);

    let get_neighbours = this.adjList.get(initNode);
    for (let i in get_neighbours) {
        let get_elem = get_neighbours[i];

        // Si encuentra el nodo objetivo
        if (get_elem === Goal) {
            await this.highlightNode(Goal, '#d71212');
            this.addToResults(`Objetivo encontrado: ${Goal}`);
            this.brokerSearch = true;
            return true;
        }

        // Llamada recursiva a vecinos no visitados
        if (!visited[get_elem]) {
            if (await this.DFSUtil(get_elem, Goal, visited)) {
                return true;
            }
        }
    }

    // Mostrar el retroceso al nodo anterior
    this.addToResults(`Retrocede: ${initNode}`);
    return false;
}


    // Método BFS animado
    async bfs(startingNode, Goal) {
        this.clearResults();
        this.resetNodeColors();
        let visited = {};
        let q = [];
        
        visited[startingNode] = true;
        q.push(startingNode);
        
        while (q.length > 0) {
            let getQueueElement = q.shift();
            
            await this.highlightNode(getQueueElement);
            this.addToResults(getQueueElement);
            
            if (Goal === getQueueElement) {
                await this.highlightNode(Goal, '#d71212');
                return;
            }
            
            let get_List = this.adjList.get(getQueueElement);
            for (let i in get_List) {
                let neigh = get_List[i];
                if (!visited[neigh]) {
                    visited[neigh] = true;
                    q.push(neigh);
                }
            }
        }
    }
}

//Creacion de constantes par alos valores dados por el formulario
const totalNodos = Number(localStorage.getItem("totalNodos"));
const nodoRaiz = Number(localStorage.getItem("nodoRaiz"));
const nodosHijo = Number(localStorage.getItem("nodoHijo"));
const nodosPadre = Number(localStorage.getItem("nodoPadre"));
const nodoMeta = Number(localStorage.getItem("nodoMeta"));
const amplitud = Number(localStorage.getItem("amplitud"));
const nivel = Number(localStorage.getItem("nivel"));
const ramas = Number(localStorage.getItem("ramas"));
//Calculo de constantes que se utilizaran a lo largo
const minParents = nivel - 1
const minNodes = amplitud + nivel - 2

//Creacion paralela de grafo para la BFS y DPS
const tree = new Graph(nodosHijo + 1)

// creacion del elemento nodos y vertices para el dibujo del arbol
const nodes = new vis.DataSet()
const edges = new vis.DataSet()
const data = {
    nodes: nodes,
    edges: edges,
}
const container = document.getElementById("mynetwork")
let network
//opciones para el dibujo de los nodos
const options = {
    layout: {
        hierarchical: {
            direction: 'UD',
            sortMethod: "directed",
            parentCentralization: true,
            shakeTowards: "roots",
        },
    },
    physics: {
        enabled: true,
        stabilization: false,
        barnesHut: {
            gravitationalConstant: -30000,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.5
        }
    },
    interaction: {
        dragNodes: false, // Desactivar arrastre de nodos
        hover: false, // Desactivar hover
        navigationButtons: false, // Desactivar botones de navegación
        zoomView: false // Desactivar zoom
    },
    edges: {
        color: {
            color: 'rgba(255, 255, 255, 0.5)', // Blanco semi-transparente para los bordes
            highlight: 'rgba(255, 255, 255, 0.8)' // Blanco más opaco cuando se resalta
        },
        width: 2, // Bordes ligeramente más gruesos
        smooth: {
            type: 'cubicBezier', // Curva más atractiva visualmente
            forceDirection: 'vertical',
            roundness: 0.5
        }
    }
};

const DFSButton = document.getElementById("dfsButton")
const BFSButton = document.getElementById("bfsButton")
const resultList = document.getElementById("ul");

const initTree = () => {
    generateNodes()
    generateBasicEdges()
    const [remainingNodesInLastLevel, levelToStart, filledLevel, startNode] = generateRemainingParents();
    generateRemainingNodes(remainingNodesInLastLevel, levelToStart, filledLevel, startNode)
    network = new vis.Network(container, data, options);
    tree.printGraph()
}
//Creacion de todos los nodos t agregandolos al elemento de nodes
const generateNodes = () => {
    for (let index = 1; index <= nodosHijo + 1; index++) {
        if (index === nodoMeta) {
            nodes.add([{ id: index, label: ` ${index} `, title: `Node ${index}`, color: `#d71212`, font: { color: '#edeef0' } }]);
        } else {
            nodes.add([{ id: index, label: ` ${index} `, title: `Node ${index}`, color: `#3a595c`, font: { color: '#edeef0' } }]);
        }
        tree.addNode(index)
    }
}
// Creacion del Arbol "Basico o Base"
const generateBasicEdges = () => {
    let numberParentNodes = nodosPadre
    for (let i = 0; i < amplitud; i++) {
        edges.add([{ from: 1, to: i + 2 }]);
        tree.addEdge(1, i + 2)
    }

    edges.add([{ from: 2, to: amplitud + 2 }]);
    tree.addEdge(2, amplitud + 2)

    for (let index = 0; index < minParents - 2; index++) {
        edges.add([{ from: index + amplitud + 2, to: index + amplitud + 3 }]);
        tree.addEdge(index + amplitud + 2, index + amplitud + 3)
    }
}
// Creacion del arbol de los remanente de nodos Padre
const generateRemainingParents = () => {
    let remainingParents = nodosPadre - minParents
    let remainingNodesInLevel = 2
    let filledLevel = 1
    let firstParent = 3
    let startNode = minNodes + 2
    while (remainingParents--) {
        if (remainingNodesInLevel !== nivel) {
            if (remainingNodesInLevel == 2) {
                tree.addEdge(firstParent, startNode)
                edges.add([{ from: firstParent, to: startNode++ }]);
            } else {
                tree.addEdge(startNode - 1, startNode)
                edges.add([{ from: startNode - 1, to: startNode++ }]);
            }
            remainingNodesInLevel++
        } else {
            remainingNodesInLevel = 2
            firstParent++
            remainingParents++
            filledLevel++
        }
    }
    return [(nivel - 2 - (nivel - remainingNodesInLevel)), firstParent - 1, filledLevel, startNode];
}
// Creacion del arbol de los remanentes de los nodos (hijos)
const generateRemainingNodes = (RNILL, levelToStart, filledLevel, startNode) => {
    if (RNILL === nivel - 2) {
        filledLevel++
        levelToStart++
    }
    let auxRNILL = RNILL % (nivel - 2)
    let remainingNodes = nodosHijo - startNode + 2
    if (remainingNodes) {
        let remainingAmplitud
        if (auxRNILL > 0) {
            remainingAmplitud = amplitud - filledLevel - 1
            auxRNILL--
        } else {
            remainingAmplitud = amplitud - filledLevel
        }
        let startNodeFilling = (nivel - 2) * filledLevel + amplitud - 1
        while (remainingNodes--) {
            if (remainingAmplitud > 0) {
                tree.addEdge(levelToStart ?? 1, startNode);
                edges.add([{ from: levelToStart, to: startNode++ }]);
                remainingAmplitud--
            } else {
                levelToStart = startNodeFilling
                startNodeFilling++
                if (auxRNILL > 0) {
                    remainingAmplitud = amplitud - filledLevel - 1
                    auxRNILL--
                } else {
                    remainingAmplitud = amplitud - filledLevel
                }
                remainingNodes++
            }
        }
    }
}

initTree()

// Agregamos event listeners directamente a los botones de la interfaz
document.getElementById("dfsButton").addEventListener('click', async () => {
    // Primero, pasamos la red de vis.js al grafo
    tree.network = network;
    await tree.dfs(1, nodoMeta);
});

document.getElementById("bfsButton").addEventListener('click', async () => {
    // Primero, pasamos la red de vis.js al grafo
    tree.network = network;
    await tree.bfs(1, nodoMeta);
});