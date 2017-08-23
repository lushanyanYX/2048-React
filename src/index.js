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
        this.state.board.cells.map((rowList,row) => {
            rowList.map((tile,column) => {
                cells.push(<div className="cell" key={row * 4 + column}></div>);
            })
        })
        let tiles = this.state.board.tiles
            .filter(tile => tile.value !== 0)
            .map((tile,index) => <TileView tile={tile} key={index}></TileView>);
        return (
            <div className="game-board">
                <div className="cell-board">{cells}</div>
                {tiles}
            </div>
        )
    }
}

class TileView extends React.Component {
    shouldComponentUpdate(nextProps) {
        return true;
    }
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
            }
            if(tile.fromColumn() !== tile.toColumn()) {
                classArray.push("column-from-" + tile.fromColumn() + "-to-" + tile.toColumn());
            }
        }
        let classes = classArray.join(" ");
        return (
            <div className={classes}>{tile.value}</div>
        )
    }
}


ReactDOM.render(<BoardView />, document.getElementById('root'));
registerServiceWorker();
