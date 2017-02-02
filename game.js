const gameUtils = {
  getAllCells: () => Array.from(document.querySelectorAll('td')),
  getNeighbors: (cell, x, y) => {
    const neighbors = [];
    for (let i = x-1; i <= x+1; i++) {
      for (let j = y-1; j <= y+1; j++) {
        if (i === x && j === y) continue;
        neighbors.push(document.getElementById(`${i}-${j}`));
      }
    }
    return neighbors.filter(neighbor => neighbor);
  },
  countLiveNeighbors: neighbors => neighbors.filter(neighbor => gameUtils.isAlive(neighbor)).length,
  setCellStatus: (cell, status) => {
    cell.setAttribute('data-status', status);
    cell.className = status;
  },
  isAlive: cell => cell.getAttribute('data-status') === 'alive'
}

const gameOfLife = {
  width: 30,
  height: 30,
  stepInterval: null,
  board: null,

  createAndShowBoard: function () {
    // create <table> element
    const goltable = document.createElement("tbody");

    // build Table HTML
    let tablehtml = '';
    for (let h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (let w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element, store board on game object
    const board = document.getElementById('board');
    board.appendChild(goltable);
    this.board = board;

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    const cells = gameUtils.getAllCells();
    cells.forEach(cell => {
      const idArr = cell.id.split('-');
      const x = Number(idArr[0]);
      const y = Number(idArr[1]);
      iteratorFunc(cell, x, y)
    });
  },

  setupBoardEvents: function () {
    // // if attaching click handler to each cell:
    // const onCellClick = (e) => {
    //   if (!gameUtils.isAlive(this)) {
    //     gameUtils.setCellStatus(this, 'alive');
    //   } else {
    //     gameUtils.setCellStatus(this, 'dead')
    //   }
    // };

    // if attaching click handler to board (event delegation!):
    const onCellClick = e => {
      const cell = e.target;

      if (!gameUtils.isAlive(cell)) {
        gameUtils.setCellStatus(cell, 'alive');
      } else {
        gameUtils.setCellStatus(cell, 'dead')
      }
    };

    // // if attaching click handler to each cell:
    // this.forEachCell((cell, x, y) => cell.onclick = onCellClick);

    // if attaching click handler to board (event delegation!):
    this.board.onclick = onCellClick;

    // hook up buttons
    document.getElementById('step_btn').onclick = () => this.step();
    document.getElementById('play_btn').onclick = () => this.enableAutoPlay();
    document.getElementById('reset_btn').onclick = () => this.reset();
    document.getElementById('clear_btn').onclick = () => this.clear();
  },

  step: function () {
    const toggles = [];

    this.forEachCell((cell, x, y) => {
      // get cell's neighbors
      const neighbors = gameUtils.getNeighbors(cell, x, y);
      // count live neighbors
      const neighborCount = gameUtils.countLiveNeighbors(neighbors);
      // determine whether cell should live or die in next gen
      if (gameUtils.isAlive(cell)) {
        if (neighborCount < 2 || neighborCount > 3) toggles.push(cell);
      } else {
        if (neighborCount === 3) toggles.push(cell);
      }
    });

    // change state of the board
    toggles.forEach(cell => {
      const newStatus = gameUtils.isAlive(cell) ? 'dead' : 'alive';
      gameUtils.setCellStatus(cell, newStatus);
    });
  },

  enableAutoPlay: function () {
    if (!this.stepInterval) this.stepInterval = setInterval(() => this.step(), 100);
    else this.stop();
  },

  stop: function() {
    clearInterval(this.stepInterval);
    this.stepInterval = null;
  },

  reset: function() {
    let status;
    this.forEachCell(cell => {
      status = Math.random() > 0.5 ? 'alive' : 'dead';
      gameUtils.setCellStatus(cell, status);
    })
  },

  clear: function() {
    this.stop();
    this.forEachCell(cell => gameUtils.setCellStatus(cell, 'dead'));
  }
};

gameOfLife.createAndShowBoard();
