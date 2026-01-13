// Blood on the Clocktower - Game Logic

// Game State
const gameState = {
    mode: null, // 'storyteller' or 'player'
    gameCode: null,
    playerName: null,
    players: [],
    currentPhase: 'setup', // 'setup', 'night', 'day'
    nightCount: 0,
    dayCount: 0,
    roles: [],
    gameLog: []
};

// Role Definitions (Trouble Brewing Edition)
const ROLES = {
    // Townsfolk (Good)
    washerwoman: {
        name: "Washerwoman",
        team: "good",
        type: "townsfolk",
        ability: "You start knowing that 1 of 2 players is a particular Townsfolk."
    },
    librarian: {
        name: "Librarian",
        team: "good",
        type: "townsfolk",
        ability: "You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)"
    },
    investigator: {
        name: "Investigator",
        team: "good",
        type: "townsfolk",
        ability: "You start knowing that 1 of 2 players is a particular Minion."
    },
    chef: {
        name: "Chef",
        team: "good",
        type: "townsfolk",
        ability: "You start knowing how many pairs of evil players there are."
    },
    empath: {
        name: "Empath",
        team: "good",
        type: "townsfolk",
        ability: "Each night, you learn how many of your living neighbors are evil."
    },
    fortuneteller: {
        name: "Fortune Teller",
        team: "good",
        type: "townsfolk",
        ability: "Each night, choose 2 players: you learn if either is a Demon."
    },
    undertaker: {
        name: "Undertaker",
        team: "good",
        type: "townsfolk",
        ability: "Each night except the first, you learn which character died by execution today."
    },
    monk: {
        name: "Monk",
        team: "good",
        type: "townsfolk",
        ability: "Each night except the first, choose a player (not yourself): they are safe from the Demon tonight."
    },
    ravenkeeper: {
        name: "Ravenkeeper",
        team: "good",
        type: "townsfolk",
        ability: "If you die at night, you are woken to choose a player: you learn their character."
    },
    virgin: {
        name: "Virgin",
        team: "good",
        type: "townsfolk",
        ability: "The first time you are nominated, if the nominator is a Townsfolk, they are executed immediately."
    },
    slayer: {
        name: "Slayer",
        team: "good",
        type: "townsfolk",
        ability: "Once per game, during the day, publicly choose a player: if they are the Demon, they die."
    },
    soldier: {
        name: "Soldier",
        team: "good",
        type: "townsfolk",
        ability: "You are safe from the Demon."
    },
    mayor: {
        name: "Mayor",
        team: "good",
        type: "townsfolk",
        ability: "If only 3 players live and no execution occurs, your team wins."
    },
    
    // Outsiders (Good but with drawbacks)
    butler: {
        name: "Butler",
        team: "good",
        type: "outsider",
        ability: "Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too."
    },
    drunk: {
        name: "Drunk",
        team: "good",
        type: "outsider",
        ability: "You do not know you are the Drunk. You think you are a Townsfolk, but your ability does not work."
    },
    recluse: {
        name: "Recluse",
        team: "good",
        type: "outsider",
        ability: "You might register as evil and as a Minion or Demon, even if dead."
    },
    saint: {
        name: "Saint",
        team: "good",
        type: "outsider",
        ability: "If you die by execution, your team loses."
    },
    
    // Minions (Evil)
    poisoner: {
        name: "Poisoner",
        team: "evil",
        type: "minion",
        ability: "Each night, choose a player: they are poisoned tonight and tomorrow day."
    },
    spy: {
        name: "Spy",
        team: "evil",
        type: "minion",
        ability: "Each night, you see the Grimoire. You might register as good and as a Townsfolk or Outsider."
    },
    scarletwoman: {
        name: "Scarlet Woman",
        team: "evil",
        type: "minion",
        ability: "If there are 5 or more players alive and the Demon dies, you become the Demon."
    },
    baron: {
        name: "Baron",
        team: "evil",
        type: "minion",
        ability: "There are extra Outsiders in play."
    },
    
    // Demons (Evil)
    imp: {
        name: "Imp",
        team: "evil",
        type: "demon",
        ability: "Each night except the first, choose a player: they die. If you kill yourself, a Minion becomes the Imp."
    }
};

// Utility Functions
function generateGameCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function addToGameLog(message, important = false) {
    const entry = {
        timestamp: getTimestamp(),
        message: message,
        important: important
    };
    gameState.gameLog.push(entry);
    updateGameLogDisplay();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateGameLogDisplay() {
    const storytellerLog = document.getElementById('game-log');
    const playerLog = document.getElementById('p-game-log');
    
    const logHTML = gameState.gameLog.slice(-10).reverse().map(entry => `
        <div class="log-entry ${entry.important ? 'important' : ''}">
            <span class="log-timestamp">${escapeHtml(entry.timestamp)}</span>
            <span>${escapeHtml(entry.message)}</span>
        </div>
    `).join('');
    
    if (storytellerLog) storytellerLog.innerHTML = logHTML;
    if (playerLog) playerLog.innerHTML = logHTML;
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Landing Page
document.getElementById('create-game-btn')?.addEventListener('click', () => {
    showPage('create-game-page');
    document.getElementById('generate-code-btn').click();
});

document.getElementById('join-game-btn')?.addEventListener('click', () => {
    showPage('join-game-page');
});

document.getElementById('rules-btn')?.addEventListener('click', () => {
    showPage('rules-page');
});

document.getElementById('back-from-rules-btn')?.addEventListener('click', () => {
    showPage('landing-page');
});

// Generate Game Code
document.getElementById('generate-code-btn')?.addEventListener('click', () => {
    const code = generateGameCode();
    document.getElementById('game-code').value = code;
    gameState.gameCode = code;
});

// Create Game (Storyteller)
document.getElementById('start-game-btn')?.addEventListener('click', () => {
    const name = document.getElementById('storyteller-name').value.trim();
    const numPlayers = parseInt(document.getElementById('num-players').value);
    
    if (!name) {
        alert('Please enter your name');
        return;
    }
    
    if (!gameState.gameCode) {
        alert('Please generate a game code');
        return;
    }
    
    gameState.mode = 'storyteller';
    gameState.playerName = name;
    gameState.players = [];
    gameState.currentPhase = 'setup';
    
    // Initialize with storyteller
    addToGameLog(`Game created by ${name}`, true);
    addToGameLog(`Game code: ${gameState.gameCode}`);
    addToGameLog(`Waiting for ${numPlayers} players to join...`);
    
    setupStorytellerDashboard();
    showPage('storyteller-page');
});

document.getElementById('cancel-create-btn')?.addEventListener('click', () => {
    showPage('landing-page');
});

// Join Game (Player)
document.getElementById('join-btn')?.addEventListener('click', () => {
    const name = document.getElementById('player-name').value.trim();
    const code = document.getElementById('join-code').value.trim().toUpperCase();
    
    if (!name) {
        alert('Please enter your name');
        return;
    }
    
    if (!code) {
        alert('Please enter a game code');
        return;
    }
    
    gameState.mode = 'player';
    gameState.playerName = name;
    gameState.gameCode = code;
    gameState.currentPhase = 'setup';
    
    // Add player to game
    addPlayer(name);
    addToGameLog(`${name} joined the game`, true);
    
    setupPlayerView();
    showPage('player-page');
});

document.getElementById('cancel-join-btn')?.addEventListener('click', () => {
    showPage('landing-page');
});

// Player Management
function addPlayer(name, role = null) {
    const player = {
        name: name,
        role: role,
        alive: true,
        votedToday: false
    };
    gameState.players.push(player);
    updatePlayersDisplay();
}

function updatePlayersDisplay() {
    const count = gameState.players.length;
    
    // Update storyteller view
    const playerCountElem = document.getElementById('player-count');
    if (playerCountElem) playerCountElem.textContent = count;
    
    const playersListElem = document.getElementById('players-list');
    if (playersListElem) {
        playersListElem.innerHTML = gameState.players.map((player, index) => `
            <div class="player-item ${player.alive ? '' : 'dead'}">
                <div>
                    <div class="player-name">${player.name}</div>
                    <div class="player-role">${player.role ? player.role.name : 'No role assigned'}</div>
                </div>
                <span class="player-status ${player.alive ? 'alive' : 'dead'}">
                    ${player.alive ? 'Alive' : 'Dead'}
                </span>
            </div>
        `).join('');
    }
    
    // Update player view
    const pPlayersListElem = document.getElementById('p-players-list');
    if (pPlayersListElem) {
        pPlayersListElem.innerHTML = gameState.players.map(player => `
            <div class="player-card ${player.alive ? '' : 'dead'}">
                <div class="name">${player.name}</div>
                <div class="status">${player.alive ? '⚫ Alive' : '💀 Dead'}</div>
            </div>
        `).join('');
    }
}

// Storyteller Dashboard
function setupStorytellerDashboard() {
    document.getElementById('st-game-code').textContent = gameState.gameCode;
    updatePhaseDisplay();
    updatePlayersDisplay();
    updateRoleDistribution();
}

function updatePhaseDisplay() {
    const phaseText = gameState.currentPhase === 'setup' ? 'Setup' :
                     gameState.currentPhase === 'night' ? `Night ${gameState.nightCount}` :
                     `Day ${gameState.dayCount}`;
    
    const stPhaseElem = document.getElementById('st-phase');
    if (stPhaseElem) stPhaseElem.textContent = phaseText;
    
    const pPhaseElem = document.getElementById('p-phase');
    if (pPhaseElem) pPhaseElem.textContent = phaseText;
    
    updatePhaseActions();
}

function updatePhaseActions() {
    const actionsElem = document.getElementById('phase-actions');
    if (!actionsElem) return;
    
    if (gameState.currentPhase === 'setup') {
        actionsElem.innerHTML = '<p>Assign roles to players before starting the game.</p>';
    } else if (gameState.currentPhase === 'night') {
        actionsElem.innerHTML = `
            <p>Night Phase Actions:</p>
            <ul>
                <li>Wake players with night abilities</li>
                <li>Demon chooses a victim</li>
                <li>Process all night actions</li>
            </ul>
        `;
    } else if (gameState.currentPhase === 'day') {
        actionsElem.innerHTML = `
            <p>Day Phase Actions:</p>
            <ul>
                <li>Players discuss and share information</li>
                <li>Players nominate and vote on executions</li>
                <li>Execute player if they receive majority votes</li>
            </ul>
        `;
    }
}

function updateRoleDistribution() {
    const roleDistElem = document.getElementById('role-distribution');
    if (!roleDistElem) return;
    
    const numPlayers = gameState.players.length;
    if (numPlayers === 0) {
        roleDistElem.innerHTML = '<p>No players yet</p>';
        return;
    }
    
    // Calculate role distribution based on player count
    let distribution = calculateRoleDistribution(numPlayers);
    
    roleDistElem.innerHTML = `
        <div class="role-item">Townsfolk: ${distribution.townsfolk}</div>
        <div class="role-item">Outsiders: ${distribution.outsiders}</div>
        <div class="role-item">Minions: ${distribution.minions}</div>
        <div class="role-item">Demons: ${distribution.demons}</div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
            <strong>Total: ${numPlayers}</strong>
        </div>
    `;
}

function calculateRoleDistribution(numPlayers) {
    // Standard Trouble Brewing distribution
    const distributions = {
        5: { townsfolk: 3, outsiders: 0, minions: 1, demons: 1 },
        6: { townsfolk: 3, outsiders: 1, minions: 1, demons: 1 },
        7: { townsfolk: 5, outsiders: 0, minions: 1, demons: 1 },
        8: { townsfolk: 5, outsiders: 1, minions: 1, demons: 1 },
        9: { townsfolk: 5, outsiders: 2, minions: 1, demons: 1 },
        10: { townsfolk: 7, outsiders: 0, minions: 2, demons: 1 },
        11: { townsfolk: 7, outsiders: 1, minions: 2, demons: 1 },
        12: { townsfolk: 7, outsiders: 2, minions: 2, demons: 1 },
        13: { townsfolk: 9, outsiders: 0, minions: 3, demons: 1 },
        14: { townsfolk: 9, outsiders: 1, minions: 3, demons: 1 },
        15: { townsfolk: 9, outsiders: 2, minions: 3, demons: 1 }
    };
    
    return distributions[numPlayers] || distributions[7];
}

// Role Assignment
document.getElementById('assign-roles-btn')?.addEventListener('click', () => {
    if (gameState.players.length < 5) {
        alert('Need at least 5 players to start the game');
        return;
    }
    
    assignRolesToPlayers();
    addToGameLog('Roles have been assigned to all players', true);
    alert('Roles assigned! Share role information with each player privately.');
    updatePlayersDisplay();
});

function assignRolesToPlayers() {
    const numPlayers = gameState.players.length;
    const distribution = calculateRoleDistribution(numPlayers);
    
    // Create role pool
    const rolePool = [];
    
    // Add townsfolk
    const townsfolkRoles = Object.values(ROLES).filter(r => r.type === 'townsfolk');
    for (let i = 0; i < distribution.townsfolk; i++) {
        rolePool.push(townsfolkRoles[i % townsfolkRoles.length]);
    }
    
    // Add outsiders
    const outsiderRoles = Object.values(ROLES).filter(r => r.type === 'outsider');
    for (let i = 0; i < distribution.outsiders; i++) {
        rolePool.push(outsiderRoles[i % outsiderRoles.length]);
    }
    
    // Add minions
    const minionRoles = Object.values(ROLES).filter(r => r.type === 'minion');
    for (let i = 0; i < distribution.minions; i++) {
        rolePool.push(minionRoles[i % minionRoles.length]);
    }
    
    // Add demon
    const demonRoles = Object.values(ROLES).filter(r => r.type === 'demon');
    rolePool.push(demonRoles[0]);
    
    // Shuffle and assign
    shuffleArray(rolePool);
    gameState.players.forEach((player, index) => {
        player.role = rolePool[index];
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Phase Management
document.getElementById('night-phase-btn')?.addEventListener('click', () => {
    gameState.currentPhase = 'night';
    gameState.nightCount++;
    gameState.players.forEach(p => p.votedToday = false);
    addToGameLog(`Night ${gameState.nightCount} begins`, true);
    updatePhaseDisplay();
});

document.getElementById('day-phase-btn')?.addEventListener('click', () => {
    gameState.currentPhase = 'day';
    gameState.dayCount++;
    addToGameLog(`Day ${gameState.dayCount} begins`, true);
    updatePhaseDisplay();
});

document.getElementById('end-game-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to end the game?')) {
        addToGameLog('Game ended by Storyteller', true);
        alert('Game ended. Thank you for playing!');
        showPage('landing-page');
        resetGameState();
    }
});

function resetGameState() {
    gameState.mode = null;
    gameState.gameCode = null;
    gameState.playerName = null;
    gameState.players = [];
    gameState.currentPhase = 'setup';
    gameState.nightCount = 0;
    gameState.dayCount = 0;
    gameState.roles = [];
    gameState.gameLog = [];
}

// Player View
function setupPlayerView() {
    document.getElementById('p-name').textContent = gameState.playerName;
    updatePhaseDisplay();
    
    // NOTE: In a production app, this would wait for actual role assignment from the storyteller
    // via a backend service. This is a client-side demo simulation.
    setTimeout(() => {
        simulatePlayerRole();
    }, 2000);
}

function simulatePlayerRole() {
    // NOTE: This is demo functionality for client-side testing only.
    // In a real implementation, role assignment would come from the storyteller via a backend.
    const allRoles = Object.values(ROLES);
    const randomRole = allRoles[Math.floor(Math.random() * allRoles.length)];
    
    const roleNameElem = document.getElementById('p-role-name');
    const roleTeamElem = document.getElementById('p-role-team');
    const roleAbilityElem = document.getElementById('p-role-ability');
    
    if (roleNameElem) {
        roleNameElem.textContent = randomRole.name;
        roleNameElem.style.color = randomRole.team === 'good' ? '#a8dadc' : '#e63946';
    }
    
    if (roleTeamElem) {
        roleTeamElem.textContent = `Team: ${randomRole.team.toUpperCase()}`;
        roleTeamElem.className = `role-team ${randomRole.team}`;
    }
    
    if (roleAbilityElem) {
        roleAbilityElem.textContent = randomRole.ability;
    }
    
    addToGameLog(`You have been assigned the role: ${randomRole.name}`);
    
    // NOTE: Demo player list for UI testing. In production, this would sync with actual game state.
    if (gameState.players.length === 0) {
        const demoNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', gameState.playerName];
        demoNames.forEach(name => addPlayer(name));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addToGameLog('Welcome to Blood on the Clocktower!');
});
