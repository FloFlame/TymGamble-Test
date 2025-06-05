import React, { useState } from 'react';

function Profile({ user, setUser }) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const redeem = () => {
    const codes = JSON.parse(localStorage.getItem('codes') || '{}');
    if (codes[code]) {
      const amount = codes[code];
      const updatedUser = { ...user, balance: user.balance + amount };
      setUser(updatedUser);
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      users[user.username].balance = updatedUser.balance;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      delete codes[code];
      localStorage.setItem('codes', JSON.stringify(codes));
      setMessage(`Added ${amount} coins!`);
      setCode('');
    } else {
      setMessage('Invalid code');
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Profile: {user.username}</h2>
      <p className="mb-4">Balance: {user.balance} TymCoins</p>
      <div className="mb-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Redeem code"
          className="p-2 rounded bg-gray-700 mr-2"
        />
        <button onClick={redeem} className="bg-green-500 px-4 py-2 rounded">Redeem</button>
      </div>
      {message && <div className="text-yellow-400">{message}</div>}
    </div>
  );
}

export default Profile;
