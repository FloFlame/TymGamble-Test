import React, { useState, useEffect } from 'react';
import './App.css';
import Login from "./Login";
import Profile from "./Profile";
import AdminPanel from "./AdminPanel";
import DiceGame from "./DiceGame";
import SlotsGame from "./SlotsGame";
import RouletteGame from "./RouletteGame";
import PlinkoGame from "./PlinkoGame";
import WheelGame from "./WheelGame";

// Game Components
const BlackjackGame = ({ tymCoins, setTymCoins }) => {
  const [gameState, setGameState] = useState('betting'); // betting, playing, finished
  const [bet, setBet] = useState(10);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameResult, setGameResult] = useState('');
  const [showDealerCards, setShowDealerCards] = useState(false);

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const createCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return { suit, rank };
  };

  const calculateScore = (cards) => {
    let score = 0;
    let aces = 0;
    
    cards.forEach(card => {
      if (card.rank === 'A') {
        aces++;
        score += 11;
      } else if (['J', 'Q', 'K'].includes(card.rank)) {
        score += 10;
      } else {
        score += parseInt(card.rank);
      }
    });

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  };

  const startGame = () => {
    if (bet > tymCoins || bet < 1) return;
    
    setTymCoins(prev => prev - bet);
    const newPlayerCards = [createCard(), createCard()];
    const newDealerCards = [createCard(), createCard()];
    
    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setPlayerScore(calculateScore(newPlayerCards));
    setDealerScore(calculateScore([newDealerCards[0]])); // Only show first dealer card
    setShowDealerCards(false);
    setGameState('playing');
    setGameResult('');
  };

  const hit = () => {
    const newCard = createCard();
    const newPlayerCards = [...playerCards, newCard];
    const newScore = calculateScore(newPlayerCards);
    
    setPlayerCards(newPlayerCards);
    setPlayerScore(newScore);
    
    if (newScore > 21) {
      setGameResult('Bust! You lose!');
      setGameState('finished');
    }
  };

  const stand = () => {
    setShowDealerCards(true);
    let newDealerCards = [...dealerCards];
    let newDealerScore = calculateScore(newDealerCards);
    
    while (newDealerScore < 17) {
      const newCard = createCard();
      newDealerCards.push(newCard);
      newDealerScore = calculateScore(newDealerCards);
    }
    
    setDealerCards(newDealerCards);
    setDealerScore(newDealerScore);
    
    // Determine winner
    if (newDealerScore > 21) {
      setGameResult('Dealer busts! You win!');
      setTymCoins(prev => prev + bet * 2);
    } else if (playerScore === 21 && playerCards.length === 2) {
      setGameResult('Blackjack! You win!');
      setTymCoins(prev => prev + bet * 2.5); // 1.5x payout for blackjack
    } else if (playerScore > newDealerScore) {
      setGameResult('You win!');
      setTymCoins(prev => prev + bet * 2);
    } else if (playerScore < newDealerScore) {
      setGameResult('Dealer wins!');
    } else {
      setGameResult('Push! Tie game!');
      setTymCoins(prev => prev + bet); // Return bet
    }
    
    setGameState('finished');
  };

  const resetGame = () => {
    setGameState('betting');
    setPlayerCards([]);
    setDealerCards([]);
    setPlayerScore(0);
    setDealerScore(0);
    setGameResult('');
    setShowDealerCards(false);
  };

  const Card = ({ card, hidden = false }) => (
    <div className={`inline-block mx-1 w-16 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-xl font-bold ${
      hidden ? 'bg-blue-600 border-blue-400' : 
      card.suit === '♥' || card.suit === '♦' ? 'bg-white text-red-600 border-gray-300' : 'bg-white text-black border-gray-300'
    }`}>
      {hidden ? '?' : (
        <>
          <div>{card.rank}</div>
          <div>{card.suit}</div>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-green-800 rounded-xl p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">♠ Blackjack ♠</h2>
      
      {gameState === 'betting' && (
        <div className="text-center">
          <div className="mb-4">
            <label className="block mb-2">Bet Amount:</label>
            <input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Math.max(1, Math.min(tymCoins, parseInt(e.target.value) || 0)))}
              className="bg-gray-800 text-white px-3 py-2 rounded border"
              min="1"
              max={tymCoins}
            />
          </div>
          <button 
            onClick={startGame}
            disabled={bet > tymCoins || bet < 1}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-bold py-3 px-6 rounded-lg"
          >
            Deal Cards
          </button>
        </div>
      )}

      {gameState !== 'betting' && (
        <div>
          <div className="mb-6">
            <h3 className="text-xl mb-2">Dealer ({showDealerCards ? dealerScore : '?'})</h3>
            <div className="flex justify-center mb-4">
              {dealerCards.map((card, index) => (
                <Card key={index} card={card} hidden={index === 1 && !showDealerCards} />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl mb-2">You ({playerScore})</h3>
            <div className="flex justify-center mb-4">
              {playerCards.map((card, index) => (
                <Card key={index} card={card} />
              ))}
            </div>
          </div>

          {gameState === 'playing' && (
            <div className="text-center">
              <button onClick={hit} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4">
                Hit
              </button>
              <button onClick={stand} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Stand
              </button>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="text-center">
              <h3 className="text-2xl mb-4 font-bold">{gameResult}</h3>
              <button onClick={resetGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MinesGame = ({ tymCoins, setTymCoins }) => {
  const [gameState, setGameState] = useState('betting');
  const [bet, setBet] = useState(10);
  const [bombs, setBombs] = useState(5);
  const [grid, setGrid] = useState(Array(25).fill(null));
  const [gameGrid, setGameGrid] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [gameResult, setGameResult] = useState('');

  const calculateMultiplier = (revealed, bombCount) => {
    const safeSpots = 25 - bombCount;
    const base = 24 + bombCount; // Base multiplier increases with bomb count
    return Math.pow(1 + (bombCount / 24), revealed) * (base / 24);
  };

  const startGame = () => {
    if (bet > tymCoins || bet < 1) return;
    
    setTymCoins(prev => prev - bet);
    
    // Create game grid with bombs
    const newGameGrid = Array(25).fill(false);
    const bombPositions = [];
    
    while (bombPositions.length < bombs) {
      const pos = Math.floor(Math.random() * 25);
      if (!bombPositions.includes(pos)) {
        bombPositions.push(pos);
        newGameGrid[pos] = true; // true = bomb
      }
    }
    
    setGameGrid(newGameGrid);
    setGrid(Array(25).fill(null));
    setRevealedCount(0);
    setCurrentMultiplier(1);
    setGameState('playing');
    setGameResult('');
  };

  const revealTile = (index) => {
    if (grid[index] !== null) return;
    
    const newGrid = [...grid];
    
    if (gameGrid[index]) {
      // Hit a bomb
      newGrid[index] = 'bomb';
      setGrid(newGrid);
      setGameResult('💣 Boom! You hit a bomb!');
      setGameState('finished');
      
      // Reveal all bombs
      setTimeout(() => {
        const finalGrid = [...newGrid];
        gameGrid.forEach((isBomb, idx) => {
          if (isBomb) finalGrid[idx] = 'bomb';
        });
        setGrid(finalGrid);
      }, 500);
    } else {
      // Safe tile
      newGrid[index] = 'safe';
      const newRevealedCount = revealedCount + 1;
      const newMultiplier = calculateMultiplier(newRevealedCount, bombs);
      
      setGrid(newGrid);
      setRevealedCount(newRevealedCount);
      setCurrentMultiplier(newMultiplier);
      
      // Check if won (revealed all safe tiles)
      if (newRevealedCount === 25 - bombs) {
        setGameResult(`🎉 You found all safe tiles! Won ${(bet * newMultiplier).toFixed(2)} TymCoins!`);
        setTymCoins(prev => prev + bet * newMultiplier);
        setGameState('finished');
      }
    }
  };

  const cashOut = () => {
    const winnings = bet * currentMultiplier;
    setTymCoins(prev => prev + winnings);
    setGameResult(`💰 Cashed out! Won ${winnings.toFixed(2)} TymCoins!`);
    setGameState('finished');
  };

  const resetGame = () => {
    setGameState('betting');
    setGrid(Array(25).fill(null));
    setGameGrid([]);
    setRevealedCount(0);
    setCurrentMultiplier(1);
    setGameResult('');
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">💣 Mines 💣</h2>
      
      {gameState === 'betting' && (
        <div className="text-center mb-6">
          <div className="mb-4">
            <label className="block mb-2">Bet Amount:</label>
            <input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Math.max(1, Math.min(tymCoins, parseInt(e.target.value) || 0)))}
              className="bg-gray-800 text-white px-3 py-2 rounded border mr-4"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Number of Bombs (1-24):</label>
            <input 
              type="number" 
              value={bombs} 
              onChange={(e) => setBombs(Math.max(1, Math.min(24, parseInt(e.target.value) || 1)))}
              className="bg-gray-800 text-white px-3 py-2 rounded border"
              min="1"
              max="24"
            />
          </div>
          <button 
            onClick={startGame}
            disabled={bet > tymCoins || bet < 1}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-bold py-3 px-6 rounded-lg"
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="text-center mb-4">
          <div className="mb-4">
            <p className="text-xl">Current Multiplier: <span className="text-yellow-400 font-bold">{currentMultiplier.toFixed(2)}x</span></p>
            <p className="text-lg">Potential Winnings: <span className="text-green-400">{(bet * currentMultiplier).toFixed(2)} TymCoins</span></p>
          </div>
          {revealedCount > 0 && (
            <button 
              onClick={cashOut}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Cash Out ({(bet * currentMultiplier).toFixed(2)} TymCoins)
            </button>
          )}
        </div>
      )}

      {gameState !== 'betting' && (
        <div className="mb-6">
          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
            {grid.map((tile, index) => (
              <button
                key={index}
                onClick={() => revealTile(index)}
                disabled={gameState === 'finished' || tile !== null}
                className={`w-12 h-12 rounded border-2 font-bold text-lg transition-all ${
                  tile === null ? 'bg-gray-700 hover:bg-gray-600 border-gray-500' :
                  tile === 'safe' ? 'bg-green-500 border-green-400 text-white' :
                  'bg-red-500 border-red-400 text-white'
                }`}
              >
                {tile === 'safe' ? '💎' : tile === 'bomb' ? '💣' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="text-center">
          <h3 className="text-2xl mb-4 font-bold">{gameResult}</h3>
          <button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

const CrashGame = ({ tymCoins, setTymCoins }) => {
  const [gameState, setGameState] = useState('betting');
  const [bet, setBet] = useState(10);
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(0);
  const [gameResult, setGameResult] = useState('');
  const [cashOutPoint, setCashOutPoint] = useState(0);

  const generateCrashPoint = () => {
    // Generate crash point between 1.75x and 3x with some randomness
    const base = 1.75;
    const range = 1.25;
    const random = Math.random();
    
    // Weighted towards lower values for more realistic casino odds
    const weighted = Math.pow(random, 2);
    return base + (range * weighted);
  };

  const startGame = () => {
    if (bet > tymCoins || bet < 1) return;
    
    setTymCoins(prev => prev - bet);
    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    setMultiplier(1.00);
    setGameState('flying');
    setGameResult('');
    setCashOutPoint(0);
    
    // Start the rocket animation
    const interval = setInterval(() => {
      setMultiplier(prev => {
        const newMultiplier = prev + 0.02;
        
        if (newMultiplier >= newCrashPoint) {
          clearInterval(interval);
          setGameResult(`💥 CRASHED at ${newCrashPoint.toFixed(2)}x!`);
          setGameState('crashed');
          return newCrashPoint;
        }
        
        return newMultiplier;
      });
    }, 50);
  };

  const cashOut = () => {
    const winnings = bet * multiplier;
    setTymCoins(prev => prev + winnings);
    setCashOutPoint(multiplier);
    setGameResult(`🚀 Cashed out at ${multiplier.toFixed(2)}x! Won ${winnings.toFixed(2)} TymCoins!`);
    setGameState('finished');
  };

  const resetGame = () => {
    setGameState('betting');
    setMultiplier(1.00);
    setCrashPoint(0);
    setGameResult('');
    setCashOutPoint(0);
  };

  return (
    <div className="bg-purple-900 rounded-xl p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">🚀 Crash 🚀</h2>
      
      {gameState === 'betting' && (
        <div className="text-center">
          <div className="mb-4">
            <label className="block mb-2">Bet Amount:</label>
            <input 
              type="number" 
              value={bet} 
              onChange={(e) => setBet(Math.max(1, Math.min(tymCoins, parseInt(e.target.value) || 0)))}
              className="bg-gray-800 text-white px-3 py-2 rounded border"
              min="1"
              max={tymCoins}
            />
          </div>
          <button 
            onClick={startGame}
            disabled={bet > tymCoins || bet < 1}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-bold py-3 px-6 rounded-lg"
          >
            🚀 Launch Rocket
          </button>
        </div>
      )}

      {(gameState === 'flying' || gameState === 'crashed' || gameState === 'finished') && (
        <div className="text-center">
          <div className="mb-6">
            <div className={`text-6xl mb-4 transition-all duration-300 ${
              gameState === 'crashed' ? 'animate-bounce' : 'animate-pulse'
            }`}>
              {gameState === 'crashed' ? '💥' : '🚀'}
            </div>
            <div className={`text-6xl font-bold mb-4 ${
              gameState === 'crashed' ? 'text-red-400' : 
              cashOutPoint > 0 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {multiplier.toFixed(2)}x
            </div>
            <div className="text-lg">
              Potential Winnings: <span className="text-green-400">{(bet * multiplier).toFixed(2)} TymCoins</span>
            </div>
          </div>

          {gameState === 'flying' && (
            <button 
              onClick={cashOut}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl animate-pulse"
            >
              💰 CASH OUT
            </button>
          )}

          {(gameState === 'crashed' || gameState === 'finished') && (
            <div>
              <h3 className="text-2xl mb-4 font-bold">{gameResult}</h3>
              {cashOutPoint > 0 && (
                <p className="text-lg mb-4 text-green-400">You cashed out at {cashOutPoint.toFixed(2)}x</p>
              )}
              <button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [tymCoins, setTymCoins] = useState(100);
  const [currentGame, setCurrentGame] = useState('blackjack');
  const [page, setPage] = useState('games');

  useEffect(() => {
    if (user) setTymCoins(user.balance);
  }, [user]);

  useEffect(() => {
    if (user) {
      const updated = { ...user, balance: tymCoins };
      setUser(updated);
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[user.username]) {
        users[user.username].balance = tymCoins;
        localStorage.setItem('users', JSON.stringify(users));
      }
      localStorage.setItem('currentUser', JSON.stringify(updated));
    }
  }, [tymCoins]);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const showGames = (
    <>
      <nav className="bg-black bg-opacity-30 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center space-x-4">
            {['blackjack','mines','crash','dice','slots','roulette','plinko','wheel'].map(g => (
              <button
                key={g}
                onClick={() => setCurrentGame(g)}
                className={`px-4 py-2 m-1 rounded-lg font-bold transition-all ${currentGame===g?'bg-yellow-500 text-black':'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-6">
        {currentGame === 'blackjack' && <BlackjackGame tymCoins={tymCoins} setTymCoins={setTymCoins} />}
        {currentGame === 'mines' && <MinesGame tymCoins={tymCoins} setTymCoins={setTymCoins} />}
        {currentGame === 'crash' && <CrashGame tymCoins={tymCoins} setTymCoins={setTymCoins} />}
        {currentGame === 'dice' && <DiceGame user={user} setUser={setUser} />}
        {currentGame === 'slots' && <SlotsGame user={user} setUser={setUser} />}
        {currentGame === 'roulette' && <RouletteGame user={user} setUser={setUser} />}
        {currentGame === 'plinko' && <PlinkoGame user={user} setUser={setUser} />}
        {currentGame === 'wheel' && <WheelGame user={user} setUser={setUser} />}
      </main>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <header className="bg-black bg-opacity-50 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold text-yellow-400">🪙 TymCasino</h1>
          <div className="flex items-center space-x-4">
            <div className="text-white text-xl">Balance: <span className="text-yellow-400 font-bold">{tymCoins.toFixed(2)} TymCoins</span></div>
            <button onClick={()=>setPage('profile')} className="bg-gray-700 text-white px-3 py-1 rounded">Profile</button>
            {user.isAdmin && <button onClick={()=>setPage('admin')} className="bg-gray-700 text-white px-3 py-1 rounded">Admin</button>}
            <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded">Logout</button>
          </div>
        </div>
      </header>
      {page==='profile' && <Profile user={user} setUser={setUser} />}
      {page==='admin' && user.isAdmin && <AdminPanel />}
      {page==='games' && showGames}
      <footer className="bg-black bg-opacity-50 p-4 mt-8 text-center text-white">
        <p>🎲 TymCasino - Play Responsibly with TymCoins 🎲</p>
      </footer>
    </div>
  );
}

export default App;
