import React, { Component } from "react";
import '../App.css';
import { Container, Grid, Button, Message, Icon } from 'semantic-ui-react'

class PuissanceQuatre extends Component {
  state = {
    isWinner: false,
    isEqualWinner: false,
    grid: [],
    buttonsLine: [],
    player: 1,
    winner: "",
  }
  componentDidMount() {
    let tab = this.makeGrid();
    let bLine = [];
    for (let i = 0; i < 7; i++) {
      bLine.push(i);
    }
    this.setState({ grid: tab, buttonsLine: bLine })

  }

  makeGrid = () => {
    let tab = [];
    const rows = 7, cols = 6;

    for (let y = 0; y < cols; y++) {
      let tabx = [];
      for (let x = 0; x < rows; x++) {
        tabx.push(0)
      }
      tab.push(tabx)
    }
    return tab;
  }
  renderWinner = (winner) => {
    let couleur = "Rouge"
    if (winner === 2) {
      couleur = "Jaune"
    }
    this.setState({ winner: couleur, isWinner: true });
  }
  handleRePlay = () => {
    let tab = this.makeGrid();
    this.setState({ grid: tab, winner: "", player: 1, isWinner: false, isEqualWinner: false })
  }

  verifyWin = (tab, player) => {
    // HORIZONTAL
    for (let i = tab.length - 1; i >= 0; i--) { // pour chaque ligne
      let count = 0;
      for (let j = 0; j < tab[i].length; j++) {
        count = (tab[i][j] === player) ? count + 1 : 0;
        if (count >= 4) {
          return player;
        }
      }
    }
    // VERTICAL
    for (let j = 0; j < 7; j++) {
      let count = 0;
      for (let i = tab.length - 1; i >= 0; i--) { // pour chaque ligne
        count = (tab[i][j] === player) ? count + 1 : 0;
        if (count >= 4) {
          return player;
        }
      }
    }

    // DIAGONAL \
    for (let row = tab.length - 1; row >= 0; row--) { // pour chaque ligne
      for (let column = 0; column < 7; column++) {
        let count = 0, h = 0, d = 0;
        while (row + h < 6 && column + d < 7) {
          count = (tab[row + h][column + d] === player) ? count + 1 : 0;
          if (count >= 4) {
            return player;
          }
          h++;
          d++;
        }
      }
    }

    // ANTI DIAGONAL /
    for (let row = tab.length - 1; row >= 0; row--) { // pour chaque ligne 
      for (let column = 0; column < 7; column++) {
        let count = 0, h = 0, d = 0;
        while (row - h >= 0 && column + d < 7) {
          count = (tab[row - h][column + d] === player) ? count + 1 : 0;
          if (count >= 4) {
            return player;
          }
          h++;
          d++;
        }
      }
    }

    return 0;
  }

  addCoin = (tab, col, player) => {
    // console.log("===== addcoin =====");
    // console.log("col : ", col);
    let row = 0;
    for (let y = tab.length - 1; y >= 0; y--) {
      if (tab[y][col] === 0) {
        tab[y][col] = player;
        row = y;
        break;
      }
    }
    if (player === 1) this.setState({ player: 2 })
    else this.setState({ player: 1 })
    return {
      tab: tab,
      row: row,
      col: col
    }
  }

  handleMove = (col, player) => {
    let tab = this.state.grid;
    let result = this.addCoin(tab, col, player);
    let winner = this.verifyWin(result.tab, player);
    if (winner > 0) {
      this.renderWinner(winner);
    }
    else this.handleIaMove(result.tab)
  }

  checkGrid = (tab) => {
    let availableLine = [], lastY = tab.length - 1;
    for (let x = 0; x < 7; x++) {
      if (tab[lastY][x] === 0) {
        availableLine.push([lastY, x])
      } else {
        let y = lastY;
        while (y >= 0) {
          if (tab[y][x] === 0) {
            availableLine.push([y, x]);
            break
          }
          y--;
        }
      }
    }
    if (availableLine.length === 0) {
      this.setState({ isEqualWinner: true })
    }
    return availableLine;
  }

  handleIaMove = (tab) => {
    console.log("----- handleIaMove -----");
    let availableTab = this.checkGrid(tab);
    let newTab = tab, played = false;

    played = this.checkRule1(availableTab, tab)
    console.log("played : ", played);
    if (!played) {
      played = this.checkRule2(availableTab, tab)
      console.log("played ? ", played);
    } if (!played) {
      played = this.checkRule3(availableTab, tab)
      console.log("played ? ", played);
    } if (!played) {
      this.checkRule4(availableTab, tab)
    }

    let winner = this.verifyWin(newTab, 2);
    if (winner > 0) {
      this.renderWinner(winner);
    } else {
      this.setState({ player: 1, grid: newTab })
    }
  }

  checkRule1 = (availableTab, tab) => { // On vérifie si on peut gagner (0-2-2-2-0)
    console.log("===== checkRule1 =====");
    let Xs = [], res = false;
    // HORIZONTAL
    let check = this.checkHorizontal(availableTab, tab, 2)
    if (check > 0) Xs.push(check);

    // VERTICAL
    if (Xs.length === 0) {
      availableTab.forEach(at => {
        let x = at[1], y = at[0], h = 1, count = 0;
        while (y + h < 6) {
          if (tab[y + h][x] === 2) count++;
          else {
            count = 0;
            break;
          }
          if (count === 3) {
            Xs.push(x);
            res = true;
            return true;
          }
          h++;
        }
      });
    }

    // DIAGONAL
    if (Xs.length === 0) {
      Xs = this.checkDiagonal(availableTab, tab, 2);
    }

    // ANTI DIAGONAL
    if (Xs.length === 0) {
      Xs = this.checkAntiDiagonal(availableTab, tab, 2);
    }



    console.log(Xs);
    if (Xs.length > 0) {
      this.addCoin(tab, Xs[0], 2);
      res = true
    }
    else res = false;
    return res;
  }

  checkRule2 = (availableTab, tab) => { // On vérifie si le rouge peut gagner (0-1-1-1-0)
    console.log("===== checkRule2 =====");
    let Xs = [], res = false;
    // HORIZONTAL
    let check = this.checkHorizontal(availableTab, tab, 1)
    if (check > 0) Xs.push(check);

    // VERTICAL
    if (Xs.length === 0) {
      availableTab.forEach(at => {
        let x = at[1], y = at[0], h = 1, count = 0;
        while (y + h < 6) {
          if (tab[y + h][x] === 1) count++;
          else {
            count = 0;
            break;
          }
          if (count === 3) {
            Xs.push(x);
            res = true;
            return true;
          }
          h++;
        }
      });
    }

    // DIAGONAL
    if (Xs.length === 0) {
      Xs = this.checkDiagonal(availableTab, tab, 1)
    }

    // ANTI DIAGONAL
    if (Xs.length === 0) {
      Xs = this.checkAntiDiagonal(availableTab, tab, 1);
    }

    if (Xs.length > 0) {
      this.addCoin(tab, Xs[0], 2);
      res = true
    }
    else res = false;
    return res;

  }

  checkRule3 = (availableTab, tab) => { // On vérifie si l'adversaire a 2 jetons alignés (0-1-1-0)
    console.log("===== checkRule3 =====");
    let Xs = [];
    let res = false;
    // HORIZONTAL
    availableTab.forEach(at => {
      let x = at[1], y = at[0], g = 1, d = 1, count = 0;
      while (x - g >= 0) { // a gauche
        if (tab[y][x - g] === 1) {
          count++;
        }
        else {
          count = 0;
          break;
        }
        if (count === 2) {
          Xs.push(x);
          res = true;
          return true;
        }
        g++;
      }
      count = 0;
      while (x + d < 7) { // a droite
        if (tab[y][x + d] === 1) {
          count++;
        }
        else {
          count = 0;
          return;
        }
        if (count === 2) {
          Xs.push(x);

          res = true;
          return true;
        }
        d++;
      }
    });
    if (Xs.length > 1) {
      console.log(Xs);
      console.log("checkAbove : ", this.checkAbove(tab, availableTab, Xs[0], Xs));
      let resCol = this.checkAbove(tab, availableTab, Xs[0], Xs);
      if (resCol >= 0 ) {
        this.addCoin(tab, Xs[0], 2);
        res = true
      } else res = false;
    } else res = false;
    return res;
  }

  checkRule4 = (availableTab, tab) => { // On cherche la meilleure position
    console.log("===== checkRule4 =====");
    let choiceLine = Array(7).fill(0);
    // HORIZONTAL
    availableTab.forEach(at => {
      let x = at[1], y = at[0], g = 1, d = 1, count = 0;
      while (x - g >= 0) {
        if (tab[y][x - g] === 0) count++; // a gauche
        else if (tab[y][x - g] === 2) count += 2;
        else count = 0;

        if (count >= 3) {
          choiceLine[x] += count;
          return;
        }
        g++;
      }
      count = 0;
      while (x + d < 7) {
        if (tab[y][x + d] === 0) count++; // a droite 
        else if (tab[y][x + d] === 2) count += 2;
        else count = 0;

        if (count >= 3) {
          choiceLine[x] += count;
          return;
        }
        d++;
      }
    });

    // VERTICAL
    availableTab.forEach(at => {
      // console.log("VERTICAL");
      let x = at[1], y = at[0], h = 1, count = 0;
      while (y - h >= 0) {
        // console.log("tab[y - h][x] : ", tab[y - h][x]);
        if (tab[y - h][x] === 0) count++;
        else if (y + h < 6) {
          if (tab[y + h][x] === 2) count += 2;
        }
        else {
          count = 0;
        }
        if (count >= 3) {
          // console.log("VERTICAL x: ", x);
          // console.log("VERTICAL count: ", count);
          choiceLine[x] += count;
          return;
        }
        h++;
      }
    });

    // DIAGONAL \
    availableTab.forEach(at => {
      console.log("DIAGONAL");
      let x = at[1], y = at[0], h = 1, d = 1, count = 0;
      console.log(y + h);
      console.log(x + d);
      while (y - h >= 0 && x - d >= 0) {
        console.log("y : ", y);
        console.log("x : ", x);
        if (tab[y - h][x - d] === 0) count++;
        else if (tab[y - h][x - d] === 2) count += 2;
        else if (y + h < 6 && x + d < 7) {
          if (tab[y + h][x + d] === 0) count++;
          else if (tab[y + h][x + d] === 2) count += 2;
        }
        else {
          count = 0;
        }
        if (count >= 3) {
          console.log("DIAGONAL count: ", count);
          console.log("x : ", x);
          choiceLine[x] += count;
          return;
        }
        h++;
        d++;
      }
    });

    // ANTI DIAGONAL /
    availableTab.forEach(at => {
      // console.log("ANTI DIAGONAL");
      let x = at[1], y = at[0], h = 1, d = 1, count = 0;
      while (y - h >= 0 && x + d < 7) {
        if (tab[y - h][x + d] === 0) count++;
        else if (tab[y - h][x + d] === 2) count += 2;
        else if (y + h < 6 && x - d >= 0) {
          if (tab[y + h][x - d] === 0) count++;
          else if (tab[y + h][x - d] === 2) count += 2;
        }
        else {
          count = 0;
        }
        if (count >= 3) {
          console.log("ANTI DIAGONAL count: ", count);
          console.log("x : ", x);
          choiceLine[x] += count;
          return;
        }
        h++;
        d++;
      }
    });


    let filter = choiceLine.filter(c => c !== 0);

    console.log("choiceLine : ", choiceLine);

    if (filter.length > 0) {
      let max = Math.max(...choiceLine);
      let indexMax = choiceLine.indexOf(max);
      console.log("indexMax : ", indexMax);
      let resCol = this.checkAbove(tab, availableTab, max, choiceLine)
      console.log("resCol : ", resCol);
      if (resCol >= 0) this.addCoin(tab, resCol, 2);
      else this.renderWinner(1);
    } else {
      this.setState({ isEqualWinner: true });
    }
  }

  // ----- Pour les règles 1 et 2 -----
  checkHorizontal = (availableTab, tab, player) => {
    console.log("==== checkHorizontal ====");
    let X = 0;
    // HORIZONTAL
    availableTab.forEach(at => {
      let x = at[1], y = at[0], g = 1, d = 1, count = 0;
      while (x - g >= 0) { // a gauche
        if (tab[y][x - g] === player) {
          count++;
          if (count === 1) { // Si on a déjà compté 1 pion à gauche
            console.log("x : ", x);
            console.log("y : ", y);
            if (tab[y][x + 1] === player && tab[y][x + 2] === player) { // On regarde à droite pour voir s'il y a 2 autres bons pions

              console.log("Il y en a 2 à droite");
              X = x;
              return;
            }
          }
        } // Si a gauche il y a un bon pion
        else {
          count = 0;
          break;
        }
        if (count === 3) {
          X = x;
          return;
        }
        g++;
      }
      d = 1;
      while (x + d < 7) { // a droite
        if (tab[y][x + d] === player) {
          count++;
          if (count === 1) { // Si on a déjà compté 1 pion à droite
            console.log(tab[y][x - 1]);
            if (tab[y][x - 1] === player && tab[y][x - 2] === player) { // On regarde à gauche pour voir s'il y a 2 autres bons pions
              X = x;
              return;
            }
          }
        } else {
          count = 0;
          break;
        }
        if (count === 3) {
          X = x;
          return;
        }
        d++;
      }
    });
    return X;
  }

  checkDiagonal = (availableTab, tab, player) => { // \
    console.log("==== checkDiagonal ====");
    // console.log("player : ", player);
    let Xs = [];
    // DIAGONAL
    availableTab.forEach(at => {
      let x = at[1], y = at[0], h = 1, d = 1, count = 0;
      while (y + h < 6 && x + d < 7) {
        if (y - 1 >= 0 && x - 1 >= 0 && y + 1 < 6 && y + 2 < 6 && x + 1 < 7 && x + 2 < 7) { // Si on dépasse du tableau
          if (tab[y - 1][x - 1] === player && tab[y + 1][x + 1] === player && tab[y + 2][x + 2] === player) { // On regarde en bas à droite pour voir s'il y a 2 autres bons pions
            Xs.push(x);
            return true;
          }
        }
        if (tab[y + h][x + d] === player) {
          count++;
        } else {
          count = 0;
          break;
        }
        if (count === 3) {
          Xs.push(x);
          return true;
        }
        h++;
        d++;
      }
      h = 1;
      d = 1;
      count = 0;
      while (y - h >= 0 && x - d >= 0) {
        if (y + 1 < 6 && x + 1 < 7 && y - 1 >= 0 && y - 2 >= 0 && x - 1 >= 0 && x - 2 >= 0) { // Si on dépasse du tableau
          if (tab[y + 1][x + 1] === player && tab[y - 1][x - 1] === player && tab[y - 2][x - 2] === player) { // On regarde en bas à droite pour voir s'il y a 2 autres bons pions
            Xs.push(x);
            return true;
          }
        }
        if (tab[y - h][x - d] === player) {
          count++;
        } else {
          count = 0;
          break;
        }
        if (count === 3) {
          Xs.push(x);
          return true;
        }
        h++;
        d++;
      }
    });
    return Xs;
  }

  checkAntiDiagonal = (availableTab, tab, player) => { // /
    console.log("==== checkAntiDiagonal ====");
    let Xs = [];
    // ANTI DIAGONAL
    availableTab.forEach(at => {
      let x = at[1], y = at[0], h = 1, d = 1, count = 0;
      while (y - h >= 0 && x + d < 7) {
        if (y + 1 < 6 && x - 1 && y - 2 >= 0 && x + 2 < 7) { // Si on a déjà 1 pion en bas à gauche
          if (tab[y + 1][x - 1] === player && tab[y - 1][x + 1] === player && tab[y - 2][x + 2] === player) { // On regarde en haut à droite pour voir s'il y a 2 autres bons pions
            Xs.push(x);
            return true;
          }
        }
        if (tab[y - h][x + d] === player) {
          count++;

        } else {
          count = 0;
          break;
        }
        if (count === 3) {
          Xs.push(x);
          return true;
        }
        h++;
        d++;
      }
      h = 1;
      d = 1;
      count = 0;
      while (y + h < 6 && x - d >= 0) {
        if (y - 1 >= 0 && x + 1 < 7 && y + 2 < 6 && x - 2 >= 0) { // Si on a déjà 1 pion en bas à gauche
          if (tab[y - 1][x + 1] === player && tab[y + 1][x - 1] === player && tab[y + 2][x - 2] === player) { // On regarde en bas à gauche pour voir s'il y a 2 autres bons pions
            Xs.push(x);
            return true;
          }
        }
        if (tab[y + h][x - d] === player) {
          count++;

        } else {
          count = 0;
          break;
        }
        if (count === 3) {
          Xs.push(x);
          return true;
        }
        h++;
        d++;
      }
    });

    return Xs;
  }

  // ----- Pour la règle 4 -----
  checkAbove = (tab, availableLine, max, choiceLine) => {
    console.log("===== checkAbove =====");
    console.log("max : ", max);
    console.log("choiceLine : ", choiceLine);
    let resCol =  -1, currentMax = max;
    
    availableLine.forEach(at => {
      if (at[0] - 1 > 0) {
        let x = at[1], y = at[0] - 1, coordTemp = [[y, x]];
        choiceLine.forEach((choice, i) => {
          if (choice === currentMax && x === i) {
            console.log("coordTemp : ", coordTemp);
            // HORIZONTAL
            let horizontal = this.checkHorizontal(coordTemp, tab, 1);
            console.log("resultat horizontal : ", horizontal);
            if (horizontal > 0) {
              resCol = -1;
              return;
            } else resCol = i;
            // DIAGONAL
            let diagonal = this.checkDiagonal(coordTemp, tab, 1)
            console.log("resultat diagonal : ", diagonal);
            if (diagonal.length > 0) {
              resCol = -1;
              return;
            } else resCol = i;
            // ANTI DIAGONAL
            let antiDiagonal = this.checkAntiDiagonal(coordTemp, tab, 1)
            console.log("resultat antiDiagonal : ", antiDiagonal);
            if (antiDiagonal.length > 0) {
              resCol = -1;
              return;
            } else resCol = i;
          }

        })
      }
    });
    return resCol;
  }


  render() {
    const {
      grid,
      buttonsLine,
      player,
      isWinner,
      isEqualWinner,
      winner,
    } = this.state;
    return (
      <Container>
        <h1 style={{ textAlign: "center" }}>Puissance 4</h1>
        <div><Button icon="undo" content="Recommencer la partie" onClick={this.handleRePlay} /></div>
        {player === 2 ? null : <div>Votre tour (vous êtes <span style={{ color: "red" }}>Rouge</span>)</div>}
        <br />
        {
          isWinner ?
            <Message color={winner === "Jaune" ? "yellow" : "red"}>
              <Icon name='winner' loading />
              <Message.Content>
                <Message.Header>{winner === "Rouge" ? "Gagné !" : "Perdu ..."}</Message.Header>
                Le joueur {winner} a gagné !
              </Message.Content>
            </Message> : null
        }
        {
          isEqualWinner ?
            <Message warning>Match nul</Message> : null
        }
        <Grid padded columns={7} celled>
          <Grid.Row stretched>
            {buttonsLine.map((but, i) => (
              <Grid.Column key={i}>
                <Button disabled={isWinner ? true : isEqualWinner ? true : false} basic icon="arrow alternate circle down outline" onClick={() => { this.handleMove(but, player) }} />
              </Grid.Column>
            ))}
          </Grid.Row>
          {
            grid.map((row, i) => (
              <Grid.Row key={i}>{
                row.map((r, j) => (
                  <Grid.Column key={i + ":" + j} color={r === 0 ? null : r === 1 ? "red" : "yellow"} ><div style={{ width: "20px", height: "70px" }}></div></Grid.Column>
                ))
              }</Grid.Row>
            ))
          }
        </Grid>
        <br />
      </Container>
    );
  }
}

export default PuissanceQuatre;