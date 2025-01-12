import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../BlackJack.css'; // Poți adăuga stiluri în acest fișier CSS separat

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const GamePage = () => {
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setDealerScore] = useState(0);
    const [deck, setDeck] = useState([]);
    const [gameOver, setGameOver] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const numeUtilizator = localStorage.getItem('numeUtilizator');
        setUsername(numeUtilizator);
        if (!token) {
            setIsAuthenticated(false);
        } else {
            const decodedToken = jwtDecode(token);
            axios.get('http://localhost:8081/api/user/username', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error("Error fetching username:", error);
                    setIsAuthenticated(false);
                });
        }
    }, []);

    const generateDeck = () => {
        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

        let newDeck = [];
        values.forEach(value => {
            suits.forEach(suit => {
                newDeck.push(`${value}_of_${suit}`);
            });
        });

        return newDeck;
    };

    const calculateScore = (hand) => {
        let score = 0;
        let aceCount = 0;

        hand.forEach(card => {
            if (card.includes('jack') || card.includes('queen') || card.includes('king')) {
                score += 10;
            } else if (card.includes('ace')) {
                score += 11;
                aceCount += 1;
            } else {
                score += parseInt(card.split('_')[0]);
            }
        });

        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount -= 1;
        }

        return score;
    };

    const startGame = () => {
        let newDeck = generateDeck();
        newDeck = newDeck.sort(() => Math.random() - 0.5);

        const playerInitialHand = [newDeck.pop(), newDeck.pop()];
        const dealerInitialHand = [newDeck.pop(), newDeck.pop()];

        setDeck(newDeck);
        setPlayerHand(playerInitialHand);
        setDealerHand(dealerInitialHand); // Ambele cărți ale dealerului sunt acum vizibile
        setPlayerScore(calculateScore(playerInitialHand));
        setDealerScore(calculateScore(dealerInitialHand));
        setGameOver(false);

        console.log('Player Hand:', playerInitialHand);
        console.log('Dealer Hand:', dealerInitialHand);
    };

    const hit = () => {
        const newCard = deck.pop();
        setDeck([...deck]); // Actualizează deck-ul
        const newHand = [...playerHand, newCard]; // Adaugă cardul la mâna jucătorului
        setPlayerHand(newHand);
        setPlayerScore(calculateScore(newHand)); // Recalculează scorul

        if (calculateScore(newHand) > 21) {
            setGameOver(true); // Jocul se încheie dacă scorul depășește 21
        }
    };

    const stand = () => {
        let dealerHandTemp = [...dealerHand]; // Copie a mâinii dealerului
        let dealerScoreTemp = dealerScore;

        // Dezvăluie cartea ascunsă a dealerului
        dealerHandTemp = [dealerHand[0], dealerHand[1]];
        setDealerHand(dealerHandTemp);

        while (dealerScoreTemp < 17) {
            const newCard = deck.pop();
            dealerHandTemp = [...dealerHandTemp, newCard];
            dealerScoreTemp = calculateScore(dealerHandTemp);
        }

        setDealerHand(dealerHandTemp);
        setDealerScore(dealerScoreTemp);
        setGameOver(true);
    };

    const getResult = () => {
        if (playerScore > 21) {
            return 'Dealer wins! You busted.';
        } else if (dealerScore > 21) {
            return 'You win! Dealer busted.';
        } else if (playerScore > dealerScore) {
            return 'You win!';
        } else if (playerScore < dealerScore) {
            return 'Dealer wins!';
        } else {
            return 'It\'s a tie!';
        }
    };

    const getCardImage = (card) => {
        if (card === 'hidden') {
            return '/images/hidden_card.png'; // Calea către imaginea cărții ascunse
        }
        return `/images/${card}.png`; // Calea către imaginea cărții reale
    };

    if (!isAuthenticated) {
        return (
            <div className="game-container">
                <h2>Nu sunteți autentificat</h2>
                <button onClick={() => navigate('/login')}>Mergi la Login</button>
            </div>
        );
    }

    return (
        <div className="game-container">
            <h1 className="game-title">Blackjack</h1>
            <button
                className="start-button"
                onClick={startGame}
                disabled={!gameOver}>
                Start Game
            </button>
            <div className="hand player-hand">
                <h2>{username ? `${username}'s Hand` : 'Player\'s Hand'} (Score: {playerScore})</h2>
                <div className="cards">
                    {playerHand.map((card, index) => (
                        <img
                            key={index}
                            src={getCardImage(card)}
                            alt={`card-${card}`}
                            className="card-image"
                        />
                    ))}
                </div>
                {!gameOver && (
                    <div className="actions">
                        <button onClick={hit} className="action-btn">Hit</button>
                        <button onClick={stand} className="action-btn">Stand</button>
                    </div>
                )}
            </div>
            <div className="hand dealer-hand">
                <h2>Dealer Hand (Score: {dealerScore})</h2>
                <div className="cards">
                    {dealerHand.map((card, index) => (
                        <img
                            key={index}
                            src={getCardImage(card)}
                            alt={`card-${card}`}
                            className="card-image"
                        />
                    ))}
                </div>
            </div>
            {gameOver && <div className="result">{getResult()}</div>}
        </div>
    );
};

export default GamePage;