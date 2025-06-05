import React, { useState } from 'react';

function RouletteGame({ user, setUser }) {
  const [bet, setBet] = useState(10);
  const [choice, setChoice] = useState('red');
  const [result, setResult] = useState('');

  const spin = () => {
    if (bet > user.balance || bet <= 0) return;
    const number = Math.floor(Math.random()*37); //0-36
    const colors = ['green','red','black'];
    const color = number===0 ? 'green' : (number % 2 ? 'red' : 'black');
    let newBalance = user.balance - bet;
    if (color === choice && color !== 'green') {
      newBalance += bet * 2;
      setResult(`Landed ${number} ${color}. You win!`);
    } else {
      setResult(`Landed ${number} ${color}. You lose.`);
    }
    const updated = { ...user, balance: newBalance };
    setUser(updated);
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[user.username].balance = newBalance;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(updated));
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Roulette</h2>
      <div className="mb-2">
        <label className="mr-2">Bet:</label>
        <input type="number" value={bet} onChange={(e)=>setBet(e.target.value)} className="p-1 text-black w-24" />
      </div>
      <div className="mb-4">
        <select value={choice} onChange={(e)=>setChoice(e.target.value)} className="p-1 text-black">
          <option value="red">Red</option>
          <option value="black">Black</option>
        </select>
      </div>
      <button onClick={spin} className="bg-yellow-500 text-black px-4 py-2 rounded">Spin</button>
      {result && <div className="mt-4">{result}</div>}
    </div>
  );
}

export default RouletteGame;
