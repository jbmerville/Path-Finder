import React from "react";
import Cell from "./Cell";

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.makeCurrent = this.makeCurrent.bind(this);
        this.reset = this.reset.bind(this);
        this.sleep = this.sleep.bind(this);
        this.recursiveBacktracking = this.recursiveBacktracking.bind(this);
        this.euclidian = this.euclidian.bind(this);
        this.aStar = this.aStar.bind(this);
        this.dijkstra = this.dijkstra.bind(this);
        this.iterativeRandom = this.iterativeRandom.bind(this);
        this.BFS = this.BFS.bind(this);

        this.state = {
            grid: [],
            height: props.height,
            width: props.width,
            hold: true,
            drag: [false, null],
            current: null,
            prev: null,
            solved: false,
        };
    }

    componentDidMount() {
        this.reset(false);
    }

    // univsited: default;

    reset(withMessage) {
        const grid = [];
        for (let i = 0; i < this.state.height; i++) {
            const row = [];
            for (let j = 0; j < this.state.width; j++) {
                const node = {
                    row: i,
                    col: j,
                    g: 0,
                    h: 0,
                    f: 0,
                    type: "unvisited"
                };
                if (withMessage) this.setDefault(node);
                if (i === 0 && j === 0) node.type = "start";
                if (i === this.state.height - 1 && j === this.state.width - 1)
                    node.type = "end";
                row.push(node);
            }
            grid.push(row);
        }
        this.setState({ grid: grid });
    }

    // Prints "Hello" when the grid is initiated.
    setDefault(node) {
        let i = node.row;
        let j = node.col;
        let k = 11;
        let u = 6;
        if (i === k) {
            if (
                j === u ||
                j === u + 3 ||
                j === u + 5 ||
                j === u + 6 ||
                j === u + 7 ||
                j === u + 9 ||
                j === u + 13 ||
                j === u + 17 ||
                j === u + 18 ||
                j === u + 19 ||
                j === u + 20
            )
                node.type = "wall";
        }
        if (i === k + 1) {
            if (
                j === u ||
                j === u + 3 ||
                j === u + 5 ||
                j === u + 9 ||
                j === u + 13 ||
                j === u + 17 ||
                j === u + 20
            )
                node.type = "wall";
        }
        if (i === k + 2) {
            if (
                j === u ||
                j === u + 1 ||
                j === u + 2 ||
                j === u + 3 ||
                j === u + 5 ||
                j === u + 6 ||
                j === u + 7 ||
                j === u + 9 ||
                j === u + 13 ||
                j === u + 17 ||
                j === u + 20
            )
                node.type = "wall";
        }
        if (i === k + 3) {
            if (
                j === u ||
                j === u + 3 ||
                j === u + 5 ||
                j === u + 9 ||
                j === u + 13 ||
                j === u + 17 ||
                j === u + 20
            )
                node.type = "wall";
        }
        if (i === k + 4) {
            if (
                j === u ||
                j === u + 3 ||
                j === u + 5 ||
                j === u + 6 ||
                j === u + 7 ||
                j === u + 9 ||
                j === u + 10 ||
                j === u + 11 ||
                j === u + 13 ||
                j === u + 14 ||
                j === u + 15 ||
                j === u + 17 ||
                j === u + 18 ||
                j === u + 19 ||
                j === u + 20
            )
                node.type = "wall";
        }
        return node;
    }

    // Turn on hover.
    down = event => {
        const { solved } = this.state;
        if (solved) this.resetNodeOfTypes(["found"]);
        this.setState({ hold: false, solved: false });
        
    };

    // Turn off hover.
    up = event => {
        
        const { current, grid, drag } = this.state;
        this.setState({ hold: true });
        if (drag[0]) {
            grid[current.row][current.col].type = drag[1];
            this.setState({ drag: [false, null], grid: grid });
        }
    };

    // Lock wall creation while moving the start and end states.
    lockAll = event => {
        if (!this.state.drag[0])
            this.setState({ drag: [true, this.state.current.type] });
    };

    // Update which node the user is currently hovering.
    makeCurrent(node) {
        const { current } = this.state;
        this.setState({ current: node, prev: current});
    }

    // ---- Path Finding Algorithms ----
    

   async dijkstra() { 

   }

    async aStar() {
        await this.resetNodeOfTypes(["visited", "found"]);
        const { grid } = this.state;
        let openSet = [];
        let closedSet = [];
        let path = [];
        let start = this.getStart();
        let end = this.getEnd();

        openSet.push(start);

        while (openSet.length > 0) {
            let winner = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                    winner = i;
                }
            }

            let current = openSet[winner];

            // did it find the end node?
            if (current === end) {
                break;
            }

            this.removeFromArray(openSet, current);
            closedSet.push(current);

            let neighbors = this.getUnvisitedNeighbors(current, true, false);
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                // Already seen?
                if (!closedSet.includes(neighbor)) {
                    let tempG = current.g + this.heuristic(neighbor, current);
                    let newPath = false;
                    if (openSet.includes(neighbor)) {
                        if (tempG < neighbor.g) {
                            neighbor.g = tempG;
                            newPath = true;
                        }
                    } else {
                        neighbor.g = tempG;
                        newPath = true;
                        openSet.push(neighbor);
                    }
                    if (newPath) {
                        neighbor.h = this.heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }
            }
            this.resetNodeOfTypes(["path"]);
            path = [];
            let temp = current;
            path.push(temp);
            while (temp.previous) {
                path.push(temp.previous);
                temp = temp.previous;
            }
            for (let node of path) {
                if (node.type !== "start") node.type ="path";
            }
            this.setState({ grid });
            await this.sleep(10);
        }
        this.resetNodeOfTypes(["path"]);
        for (let i = path.length - 1; i >= 0; i--) {
            if (path[i].type !== "start") path[i].type ="found";
            this.setState({ grid });
            await this.sleep(10);
        }
        this.setState({solved: true});
    }

    async euclidian() {
    }

    async recursiveBacktracking() {
        await this.resetNodeOfTypes(["visited", "found"]);
        const { grid } = this.state;
        let cur = this.getStart();
        let stack = [cur];
        let neighbors = this.getUnvisitedNeighbors(cur, false, false);
        while (stack.length > 0) {
            if (neighbors.length > 0) {
                stack.push(cur);
                let rand = Math.floor(Math.random() * neighbors.length);
                cur = neighbors[rand];
                for (let i = 0; i < neighbors.length; i++) {
                    if (i !== rand && i !== rand - 1) {
                        neighbors[i].type = "wall";
                    }
                }
                stack.push(cur);
                cur.type = "current";
                this.setState({ grid: grid });
                await this.sleep(5);
                cur.type = "visited";
                this.setState({ grid: grid });
                neighbors = this.getUnvisitedNeighbors(cur, false, false);
            } else if (stack.length > 0) {
                cur = stack.pop();
                while (
                    stack.length > 0 &&
                    this.getUnvisitedNeighbors(cur, false).length === 0
                ) {
                    cur = stack.pop();
                }
                neighbors = this.getUnvisitedNeighbors(cur, false, false);
            }
        }
        this.resetNodeOfTypes(["visited"]);
    }

    async iterativeRandom() {
        await this.resetNodeOfTypes(["visited", "found"]);
        const { height, width, grid } = this.state;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (grid[i][j].type === "unvisited" && Math.random() > 0.7)
                    grid[i][j].type = "wall";
                else if (grid[i][j].type === "unvisited")
                    grid[i][j].type = "visited";
                await this.sleep(1);
                this.setState({ grid: grid });
            }
        }
        this.resetNodeOfTypes(["visited"]);
    }

    // Once the End node is found this function computes the shortest path using Breath First Search.
    async BFS() {
        await this.resetNodeOfTypes(["visited", "found"]);
        let grid = this.state.grid;
        let end = this.getEnd();
        let start = this.getStart();
        let neighbors = this.getUnvisitedNeighbors(start, true, false);
        let queue = [];
        for (let neighbor of neighbors){
                neighbor.type = "visited";
                queue.push({node: neighbor, parent: {node: start, parent: null }});
        }
        this.setState({ grid });
        await this.sleep(10);
        while (queue.length > 0) {
            let newQueue = [];
            for (let curr of queue) {
                if (curr.node === end){
                    curr.node.type = "end";
                    curr = curr.parent;
                    await this.resetNodeOfTypes(["visited"]);
                    while (curr.parent !== null){
                        curr.node.type = "found";
                        this.setState({ grid });
                        await this.sleep(10);
                        curr = curr.parent;
                    }
                    this.setState({solved: true});
                    return;
                }
     
                curr.node.type = "visited";
                neighbors = this.getUnvisitedNeighbors(curr.node, true, false);
                for (let neighbor of neighbors){
                    neighbor.type = "visited";
                    newQueue.push({node: neighbor, parent: curr});
                }
            }
            queue = newQueue;
            this.setState({ grid });
            await this.sleep(150);
        }        
    }

    // ---- helper methods ----

    getStart() {
        return this.getNode("start");
    }

    getEnd() {
        return this.getNode("end");
    }

    // Rerturn the first node with type passed as an argument.
    getNode(type) {
        const { height, width, grid } = this.state;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (grid[i][j].type === type) return grid[i][j];
            }
        }
        return null;
    }

    // Makes the nodes of types, given in a array of types, have type "unvisited"
    async resetNodeOfTypes(types) {
        const { height, width, grid } = this.state;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (types.includes(grid[i][j].type))
                    grid[i][j].type = "unvisited";
            }
        }
        this.setState({ grid });
    }

    // Make an async function sleep for time in milliseconds.
    sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    // Returns a list of all neighbor nodes that are either univisited, the end node or the start node.
    getUnvisitedNeighbors(node, includeEnd, includeStart) {
        let grid = this.state.grid;
        let neighbors = [];
        let i = node.row;
        let j = node.col;
        let types = ["unvisited", "start", "end"];
        if (i > 0 && types.includes(grid[i - 1][j].type))
            neighbors.push(grid[i - 1][j]);
        if (i < grid.length - 1 &&  types.includes(grid[i + 1][j].type))
            neighbors.push(grid[i + 1][j]);
        if (j > 0 &&  types.includes(grid[i][j - 1].type))
            neighbors.push(grid[i][j - 1]);
        if (j < grid[0].length - 1 &&  types.includes(grid[i][j + 1].type))
            neighbors.push(grid[i][j + 1]);
        for (let neighbor of neighbors){
            if (!includeEnd && neighbor.type === "end") this.removeFromArray(neighbors, neighbor);
            if (!includeStart && neighbor.type === "start") this.removeFromArray(neighbors, neighbor);
        }
        
        return neighbors;
    }

    removeFromArray(arr, elt) {
        for (let i = arr.length; i >= 0; i--) {
            if (arr[i] === elt) {
                arr.splice(i, 1);
            }
        }
    }

    // returns an educated guess for the distance between 2 nodes
    heuristic(a, b) {
        let ver = Math.abs(a.col - b.col);
        let hor = Math.abs(a.row - b.row);
        return Math.sqrt(hor * hor + ver * ver);
    }

    render() {
        const { grid, drag, hold } = this.state;
        return (
            <table>
                <tbody
                    className="grid"
                    onMouseDown={this.down}
                    onMouseUp={this.up}
                >
                    {grid.map((row, rowIdx) => {
                        return (
                            <tr className={"row"} key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    return (
                                        <Cell
                                            current={this.makeCurrent}
                                            drag={drag[0]}
                                            dragType={drag[1]}
                                            lockAll={this.lockAll}
                                            node={node}
                                            hold={hold}
                                            key={node.row + "-" + node.col}
                                        ></Cell>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

export default Grid;
