class Board {
    constructor() {
        this.fourPercent = 0.2; // 4出现概率
        this.cells = [];
        this.tiles = [];
        this.gameOver = false;
        for(let row = 0; row < 4; row++) {
            this.cells.push([]);
            for(let column = 0; column < 4; column++) {
                let newTile = new Tile();
                this.cells[row][column] = newTile;
                this.tiles.push(newTile);
            }
        }
        this.addRandomTile();
        this.addRandomTile();
        this.setPosition();
    }

    addRandomTile() {
        let seed = Math.random() * this.getEmptyNum();
        seed = Math.floor(seed);
        let emptyCells = [];
        for(let row = 0; row < 4; row++) {
            for(let column = 0; column < 4; column++){
                if(!this.cells[row][column].value) {
                    emptyCells.push({row:row,column:column});
                }
            } 
        }
        let cell = emptyCells[seed];
        let newTile = new Tile(this.getRandomNum());
        this.cells[cell.row][cell.column] = newTile;
        this.tiles.push(newTile);
    }
    
    getEmptyNum() {
        let emptyNum = 0;
        for(let row = 0; row < 4; row++) {
            for(let column = 0; column < 4; column++) {
                if(!this.cells[row][column].value) {
                    emptyNum++;
                }
            }
        }
        return emptyNum;
    }

    getRandomNum() {
        return Math.random() > this.fourPercent ? 2 : 4;
    }

    moveleft() {
        let isChanged = false;
        for(let row = 0; row < 4; row++) {
            let list = this.cells[row].filter(tile => tile.value);
            for(let i = 0; i < list.length; i++) {
                isChanged |= (list[i].value !== this.cells[row][i].value)
                if(i > 0 && list[i].value === list[i-1].value && !list[i-1].mergedInto) {
                    let newTile = new Tile(list[i].value * 2);
                    this.tiles.push(newTile);
                    list[i-1].mergedInto = newTile;
                    list[i].mergedInto = newTile;
                    list.splice(i-1, 2, newTile);
                    isChanged = true;
                }
            }
            let emptyCells = 4 - list.length;
            for(let i = 0; i < emptyCells; i++) {
                let newTile = new Tile();
                list.push(newTile);
            }
            this.cells[row] = list;
        }
        return isChanged;
    }

    clearOldTiles() {
        this.tiles = this.tiles.filter(tile => !tile.markForDeletion);
        this.tiles.forEach( tile => tile.markForDeletion = true);
    }

    setPosition() {
        this.cells.map((Rowtiles,row) => {
            Rowtiles.map((tile,column) => {
                tile.oldRow = tile.row;
                tile.oldColumn = tile.column;
                tile.row = row;
                tile.column = column;
                tile.markForDeletion = false;
            })
        })
        // this.consoleValue();
    }

    rotateLeft(){
        let res = [];
        for(let row = 0; row < 4; row++) {
            res.push([]);
            for(let column = 0; column < 4; column++) {
                res[row][column] = this.cells[column][3 - row];
            }
        }
        return res;
    }

    move(direction) {
        // 0 -> left, 1 -> up, 2 -> right, 3 -> down
        this.clearOldTiles();
        for(let i = 0; i < direction; i++) {
            this.cells = this.rotateLeft();
        }
        let isMoved = this.moveleft()
        for(let i = direction; i < 4; i++) {
            this.cells = this.rotateLeft();
        }
        if(isMoved) {
            this.addRandomTile();
            this.gameOver = this.hasLost();
        }
        this.setPosition();
        return this;
    }

    hasLost() {
        if(this.canRowMove()) return false;
        this.cells = this.rotateLeft();
        if(this.canRowMove()) return false;
        for(let i = 0; i < 3; i++) {
            this.cells = this.rotateLeft();
        }
        return true;
    }

    canRowMove() {
        for(let row = 0; row < 4; row++) {
            let rowList = this.cells[row].filter(tile => tile.value);
            if(rowList.length < 4) return true;
            for(let i = 1; i < 4; i++) {
                if(rowList[i-1].value === rowList[i].value) return true;
            }
        }
        return false;
    }
    // for debug
    consoleValue() {
        for(let row = 0; row < 4; row++) {
            let rowList = this.cells[row];
            console.log(rowList[0].value + " " + rowList[1].value + " " + rowList[2].value + " " + rowList[3].value)
        }
    }
}

class Tile {
    constructor(value){
        this.value = value || 0;
        this.row = -1;
        this.column = -1;
        this.oldRow = -1;
        this.oldColumn = -1;
        this.markForDeletion = false;
        this.mergedInto = null;
    }

    isNew() {
        return this.oldRow === -1 && !this.mergedInto;
    }

    hasMoved() {
        return this.mergedInto || !this.oldRow !==  -1 && (this.oldRow !== this.row || this.oldColumn !== this.column);
    }

    fromRow() {
        return this.mergedInto ? this.row : this.oldRow;
    }

    fromColumn() {
        return this.mergedInto ? this.column : this.oldColumn;
    }

    toRow() {
        return this.mergedInto ? this.mergedInto.row : this.row;
    }
    
    toColumn() {
        return this.mergedInto ? this.mergedInto.column : this.column;
    }
}

export {Board}
