import React from 'react';
import ReactDOM from 'react-dom';
import './static/index.css';
import './static/game.css';

import {Board} from './board';
import registerServiceWorker from './registerServiceWorker';

class BoardView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {board: new Board()}
    }

    componentDidMount() {
        window.addEventListener("keydown",event => this.handleKeyDown(event));
    }

    componentWillMount() {
        window.removeEventListener("keydown",event => this.handleKeyDown(event));
    }
    
    handleKeyDown(event) {
        if(this.state.board.gameOver) {
            alert("game over !");
            this.setState({board: new Board()});
        }
        if(event.keyCode >=37 && event.keyCode <= 40) {
            event.preventDefault();
            let direction = event.keyCode - 37;
            this.setState({board: this.state.board.move(direction)});
        }
    }

    render() {
        let cells = [];
        cells = this.state.board.cells.map((rowList,row) => {
            return rowList.map((tile,column) => <Cell key={row * 4 + column}></Cell>);
        })
        let tiles = this.state.board.tiles
            .filter(tile => tile.value !== 0)
            .map((tile,index) => <TileView tile={tile} key={tile.id}></TileView>);
        return (
            // <Header score={this.state.board.score} bestScore={this.state.board.bestScore}></Header>
            <div className="game-board">
                <div className="cell-board">{cells}</div>
                {tiles}
            </div>
        )
    }
}

class Cell extends React.Component {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return <div className="cell"></div>
    }
}

class TileView extends React.Component {
    render() {
        let tile = this.props.tile;
        let classArray = [];
        classArray.push("tile");
        classArray.push("tile" + tile.value);
        classArray.push("position-" + tile.row + "-" + tile.column);
        if(tile.isNew()){
            classArray.push("new");
        }
        else {
            if(tile.fromRow() !== tile.toRow()) {
                classArray.push("row-from-" + tile.fromRow() + "-to-" + tile.toRow());
                classArray.push("isMoving");
            }
            if(tile.fromColumn() !== tile.toColumn()) {
                classArray.push("column-from-" + tile.fromColumn() + "-to-" + tile.toColumn());
                classArray.push("isMoving");
            }
        }
        if(tile.mergedInto) classArray.push("merged");
        let classes = classArray.join(" ");
        tile.consoleValue();
        return (
            <div className={classes}>{tile.value}</div>
        )
    }
}


ReactDOM.render(<BoardView />, document.getElementById('root'));
registerServiceWorker();
