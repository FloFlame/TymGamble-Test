import React, { useState } from 'react';

const symbols = ['🍒','🍋','🔔','7'];

function SlotsGame({ user, setUser }) {
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState(['?','?','?']);
  const [message, setMessage] = useState('');

  const spin = () => {
    if (bet > user.balance || bet <= 0) return;
    const newReels = [0,1,2].map(()=>symbols[Math.floor(Math.random()*symbols.length)]);
    setReels(newReels);
    let newBalance = user.balance - bet;
    if (newReels.every(r => r === newReels[0])) {
      newBalance += bet * 5;
      setMessage('Jackpot!');
    } else if (new Set(newReels).size === 2) {
      newBalance += bet * 2;
      setMessage('Nice!');
    } else {
      setMessage('Try again');
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
      <h2 className="text-2xl mb-4">Slots</h2>
      <div className="mb-4">
        <label className="mr-2">Bet:</label>
        <input type="number" value={bet} onChange={(e)=>setBet(e.target.value)} className="p-1 text-black w-24" />
      </div>
      <button onClick={spin} className="bg-yellow-500 text-black px-4 py-2 rounded">Spin</button>
      <div className="text-4xl my-4">{reels.join(' ')}</div>
      {message && <div>{message}</div>}
    </div>
  );
}

export default SlotsGame;
