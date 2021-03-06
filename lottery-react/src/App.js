import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: ''
  };

  async componentDidMount() {
    // No need to specify 'from' in call as inside react
    // by default it is the selected account in meta mask
    const manager = await lottery.methods.manager().call();

    const players = await lottery.methods.getPlayers().call();

    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager: manager, players: players, balance: balance});
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'});

    // assuming that first account will be used to
    // enter in the lottery
    await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'You have been entered!'});
  };

  onClick = async () => {
      const accounts = await web3.eth.getAccounts();

      this.setState({message: 'Waiting on transaction success...'});

      // This will not return winner. Need to update the contract
      // to save winner value in a variable like 'manager'
      // and later we can access it directly
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });

      this.setState({message: 'A winner has been picked'});
  };

  render() {
    return (
      <div>
          <h2>Lottery Contract</h2>
          <p>This contract is managed by {this.state.manager}</p>
          <p>There are {this.state.players.length} people entered,
              competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>

          <hr/>

          <form onSubmit={this.onSubmit}>
              <h4>Want to try your luck?</h4>
              <div>
                  <label>
                      Amout of ether to enter
                  </label>
                  <input
                    value={this.state.value}
                    onChange={event => this.setState({value: event.target.value})}
                  />
              </div>
              <button>Enter</button>
          </form>

          <hr/>

          <h4>Ready to pick a winner?</h4>
          <button onClick={this.onClick}>Pick a winner!</button>

          <hr/>

          <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
