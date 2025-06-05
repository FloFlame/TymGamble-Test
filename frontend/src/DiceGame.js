import React, { useState } from 'react';

function DiceGame({ user, setUser }) {
  const [bet, setBet] = useState(10);
  const [choice, setChoice] = useState(1);
  const [result, setResult] = useState(null);

  const play = () => {
    if (bet > user.balance || bet <= 0) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    let newBalance = user.balance - bet;
    if (roll === parseInt(choice)) {
      newBalance += bet * 6;
      setResult(`Rolled ${roll}. You win!`);
    } else {
      setResult(`Rolled ${roll}. You lose.`);
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
      <h2 className="text-2xl mb-4">Dice</h2>
      <div className="mb-4">
        <label className="mr-2">Bet:</label>
        <input type="number" value={bet} onChange={(e)=>setBet(e.target.value)} className="p-1 text-black w-24" />
      </div>
      <div className="mb-4">
        <label className="mr-2">Pick (1-6):</label>
        <input type="number" value={choice} min="1" max="6" onChange={(e)=>setChoice(e.target.value)} className="p-1 text-black w-24" />
      </div>
      <button onClick={play} className="bg-yellow-500 text-black px-4 py-2 rounded">Roll</button>
      {result && <div className="mt-4">{result}</div>}
    </div>
  );
}

export default DiceGame;
