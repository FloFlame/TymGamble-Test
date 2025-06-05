import React, { useState } from 'react';

const segments = [0,2,3,5,10];

function WheelGame({ user, setUser }) {
  const [bet, setBet] = useState(10);
  const [result, setResult] = useState('');

  const spin = () => {
    if (bet > user.balance || bet <= 0) return;
    const mult = segments[Math.floor(Math.random()*segments.length)];
    const win = bet * mult;
    const newBalance = user.balance - bet + win;
    setResult(`Wheel landed on ${mult}x. ${win>0?`Won ${win}`:'Lost'}.`);
    const updated = { ...user, balance: newBalance };
    setUser(updated);
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[user.username].balance = newBalance;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(updated));
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Wheel</h2>
      <div className="mb-2">
        <label className="mr-2">Bet:</label>
        <input type="number" value={bet} onChange={(e)=>setBet(e.target.value)} className="p-1 text-black w-24" />
      </div>
      <button onClick={spin} className="bg-yellow-500 text-black px-4 py-2 rounded">Spin</button>
      {result && <div className="mt-4">{result}</div>}
    </div>
  );
}

export default WheelGame;
