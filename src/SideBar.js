import React from "react";
import Button from "./Button";

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.switchColors = this.switchColors.bind(this);
        this.state = {};
    }

    switchColors() {
        this.swapCSSvar("main");
        this.swapCSSvar("button");
        this.swapCSSvar("hover");
        this.swapCSSvar("side");
        this.swapCSSvar("wall");
        this.swapCSSvar("accent");
    }

    swapCSSvar(property) {
        let temp = getComputedStyle(document.documentElement).getPropertyValue(
            "--" + property
        );
        document.documentElement.style.setProperty(
            "--" + property,
            getComputedStyle(document.documentElement).getPropertyValue(
                "--" + property + "1"
            )
        );
        document.documentElement.style.setProperty("--" + property + "1", temp);
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            const { reset, recursiveBacktracking, depthFirstSearch, aStar, dijkstra, iterativeRandom, BFS, recursiveDivision, recursiveDivision2 } = this.props;
            this.setState({
                BFS,
                reset,
                recursiveBacktracking,
                depthFirstSearch,
                aStar,
                dijkstra,
                iterativeRandom,
                recursiveDivision,
                recursiveDivision2,
            });
        }
    }

    render() {
        const {
            reset,
            recursiveBacktracking,
            dijkstra,
            aStar,
            depthFirstSearch,
            iterativeRandom,
            BFS,
            recursiveDivision,
            recursiveDivision2,
        } = this.state;
        return (
            <div className="side-bar">
                <div className="section">
                    <div className="section-text">Controls</div>

                    <Button
                        onClick={reset}
                        text={"Reset"}
                    ></Button>
                    <Button
                        onClick={this.switchColors}
                        text={"Dark/Light Mode"}
                    ></Button>
                </div>
                <div className="section">
                    <div className="section-text">Path Finders</div>
                    <Button
                        onClick={BFS}
                        text={"Breath First Search"}
                    ></Button>
                    <Button
                        onClick={dijkstra}
                        text={"Dijkstra's algorithm"}
                    ></Button>
                    <Button
                        onClick={aStar}
                        text={"A* algorithm"}
                    ></Button>
                    <Button
                        onClick={depthFirstSearch}
                        text={"Detph First Search"}
                        
                    ></Button>
                </div>
                <div className="section">
                    <div className="section-text">Maze Generators</div>
                    <Button
                        onClick={recursiveDivision}
                        text={"Recursive Division"}
                    ></Button>
                    <Button
                        onClick={recursiveDivision2}
                        text={"Recursive Division 2"}
                    ></Button>
                    <Button
                        onClick={recursiveBacktracking}
                        text={"Recursive Random"}
                    ></Button>
                    <Button
                        onClick={iterativeRandom}
                        text={"Iterative Random"}
                    ></Button>
                </div>
            </div>
        );
    }
}

export default SideBar;
