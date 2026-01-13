// Future Hooman: Outbreak at the Clinic - Game Logic

// Game State
const gameState = {
    mode: null, // 'storyteller' or 'player'
    gameCode: null,
    playerName: null,
    players: [],
    currentPhase: 'setup', // 'setup', 'stasis', 'active'
    nightCount: 0,
    dayCount: 0,
    roles: [],
    gameLog: []
};

// Role Definitions (Future Hooman Edition)
const ROLES = {
    // Clinicians (Good)
    washerwoman: {
        name: "HR Representative",
        team: "clinicians",
        type: "clinician",
        ability: "You start knowing that 1 of 2 staff members is a particular Clinician role."
    },
    librarian: {
        name: "Outreach Coordinator",
        team: "clinicians",
        type: "clinician",
        ability: "You start knowing that 1 of 2 staff members is a particular FHEELS operative. (Or that zero are in play.)"
    },
    investigator: {
        name: "Internal Investigator",
        team: "clinicians",
        type: "clinician",
        ability: "You start knowing that 1 of 2 staff members is a particular SigSev operative."
    },
    chef: {
        name: "Project Manager",
        team: "clinicians",
        type: "clinician",
        ability: "You start knowing how many pairs of SigSev operatives there are."
    },
    empath: {
        name: "Mind Melder",
        team: "clinicians",
        type: "clinician",
        ability: "Each power cycle, you learn how many of your adjacent staff members are SigSev."
    },
    fortuneteller: {
        name: "Virologist",
        team: "clinicians",
        type: "clinician",
        ability: "Each power cycle, choose 2 staff: you learn if either is the Inoculator."
    },
    undertaker: {
        name: "Interrogator",
        team: "clinicians",
        type: "clinician",
        ability: "Each power cycle except the first, you learn which role was quarantined today."
    },
    monk: {
        name: "Pharmacist",
        team: "clinicians",
        type: "clinician",
        ability: "Each power cycle except the first, choose a staff member (not yourself): they are protected from the Inoculator during stasis."
    },
    ravenkeeper: {
        name: "Metabolist",
        team: "clinicians",
        type: "clinician",
        ability: "If you are inoculated during stasis, you are woken to choose a staff member: you learn their role."
    },
    virgin: {
        name: "Executive Assistant (Nepo Baby)",
        team: "clinicians",
        type: "clinician",
        ability: "The first time you are nominated for quarantine, if the nominator is a Clinician, they are quarantined immediately."
    },
    slayer: {
        name: "Neutralizer",
        team: "clinicians",
        type: "clinician",
        ability: "Once per session, during active hours, publicly choose a staff member: if they are the Inoculator, they are neutralized."
    },
    soldier: {
        name: "The Immune",
        team: "clinicians",
        type: "clinician",
        ability: "You are immune to the Inoculator."
    },
    mayor: {
        name: "Plan Z / Contingency Executive",
        team: "clinicians",
        type: "clinician",
        ability: "If only 3 staff remain and no quarantine occurs, Clinicians win."
    },
    
    // FHEELS (Good but with complications)
    butler: {
        name: "Intern",
        team: "clinicians",
        type: "fheels",
        ability: "Each power cycle, choose a staff member (not yourself): during active hours, you may only vote if they are voting too."
    },
    drunk: {
        name: "Corporate Simp",
        team: "clinicians",
        type: "fheels",
        ability: "You do not know you are the Corporate Simp. You think you are a Clinician, but your ability does not work."
    },
    recluse: {
        name: "Sympathizer",
        team: "clinicians",
        type: "fheels",
        ability: "You might register as SigSev and as an operative or the Inoculator, even if neutralized."
    },
    saint: {
        name: "FHEELS Executive",
        team: "clinicians",
        type: "fheels",
        ability: "If you are quarantined, Clinicians lose."
    },
    
    // SigSev Operatives (Evil)
    poisoner: {
        name: "Signal Jacker",
        team: "sigsev",
        type: "operative",
        ability: "Each power cycle, choose a staff member: they are signal jacked during stasis and the following active period."
    },
    spy: {
        name: "Embedded Observer",
        team: "sigsev",
        type: "operative",
        ability: "Each power cycle, you see the Health Records. You might register as Clinician."
    },
    scarletwoman: {
        name: "Lieutenant / Clone",
        team: "sigsev",
        type: "operative",
        ability: "If there are 5 or more staff active and the Inoculator is neutralized, you become the Inoculator."
    },
    baron: {
        name: "Propagandist / Recruiter",
        team: "sigsev",
        type: "operative",
        ability: "There are extra FHEELS operatives in play."
    },
    
    // Inoculator (SigSev Leadership)
    imp: {
        name: "Inoculator (Patient Zero)",
        team: "sigsev",
        type: "inoculator",
        ability: "Each power cycle except the first, choose a staff member: they are inoculated. If you inoculate yourself, an operative becomes the Inoculator."
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
    addToGameLog(`Session initialized by ${name}`, true);
    addToGameLog(`Session code: ${gameState.gameCode}`);
    addToGameLog(`Awaiting ${numPlayers} staff members to join...`);
    
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
    addToGameLog(`${name} joined the session`, true);
    
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
                    ${player.alive ? 'Active' : 'Neutralized'}
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
                <div class="status">${player.alive ? '✓ Active' : '✗ Neutralized'}</div>
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
                     gameState.currentPhase === 'night' ? `Power Cycle ${gameState.nightCount} (Stasis)` :
                     `Cycle ${gameState.dayCount} (Active)`;
    
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
        actionsElem.innerHTML = '<p>Assign roles to staff members before starting the session.</p>';
    } else if (gameState.currentPhase === 'night') {
        actionsElem.innerHTML = `
            <p>Power Cycle (Stasis) Actions:</p>
            <ul>
                <li>Wake staff with stasis abilities</li>
                <li>Inoculator chooses a target</li>
                <li>Process all stasis actions</li>
            </ul>
        `;
    } else if (gameState.currentPhase === 'day') {
        actionsElem.innerHTML = `
            <p>Active Cycle Actions:</p>
            <ul>
                <li>Staff discuss and share information</li>
                <li>Staff nominate and vote on quarantine</li>
                <li>Quarantine staff member if they receive majority votes</li>
            </ul>
        `;
    }
}

function updateRoleDistribution() {
    const roleDistElem = document.getElementById('role-distribution');
    if (!roleDistElem) return;
    
    const numPlayers = gameState.players.length;
    if (numPlayers === 0) {
        roleDistElem.innerHTML = '<p>No staff members yet</p>';
        return;
    }
    
    // Calculate role distribution based on player count
    let distribution = calculateRoleDistribution(numPlayers);
    
    roleDistElem.innerHTML = `
        <div class="role-item">Clinicians: ${distribution.townsfolk}</div>
        <div class="role-item">FHEELS: ${distribution.outsiders}</div>
        <div class="role-item">SigSev Operatives: ${distribution.minions}</div>
        <div class="role-item">Inoculator: ${distribution.demons}</div>
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
        alert('Need at least 5 staff members to start the session');
        return;
    }
    
    assignRolesToPlayers();
    addToGameLog('Roles have been assigned to all staff members', true);
    alert('Roles assigned! Share role information with each staff member privately.');
    updatePlayersDisplay();
});

function assignRolesToPlayers() {
    const numPlayers = gameState.players.length;
    const distribution = calculateRoleDistribution(numPlayers);
    
    // Create role pool
    const rolePool = [];
    
    // Add clinicians
    const townsfolkRoles = Object.values(ROLES).filter(r => r.type === 'clinician');
    for (let i = 0; i < distribution.townsfolk; i++) {
        rolePool.push(townsfolkRoles[i % townsfolkRoles.length]);
    }
    
    // Add FHEELS
    const outsiderRoles = Object.values(ROLES).filter(r => r.type === 'fheels');
    for (let i = 0; i < distribution.outsiders; i++) {
        rolePool.push(outsiderRoles[i % outsiderRoles.length]);
    }
    
    // Add SigSev operatives
    const minionRoles = Object.values(ROLES).filter(r => r.type === 'operative');
    for (let i = 0; i < distribution.minions; i++) {
        rolePool.push(minionRoles[i % minionRoles.length]);
    }
    
    // Add Inoculator
    const demonRoles = Object.values(ROLES).filter(r => r.type === 'inoculator');
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
    addToGameLog(`Power Cycle ${gameState.nightCount} begins - entering stasis`, true);
    updatePhaseDisplay();
});

document.getElementById('day-phase-btn')?.addEventListener('click', () => {
    gameState.currentPhase = 'day';
    gameState.dayCount++;
    addToGameLog(`Cycle ${gameState.dayCount} begins - staff are now active`, true);
    updatePhaseDisplay();
});

document.getElementById('end-game-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to end the session?')) {
        addToGameLog('Session ended by Helper Bot 3000', true);
        alert('Session ended. Thank you for your cooperation.');
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
    
    // NOTE: In a production app, this would wait for actual role assignment from Helper Bot 3000
    // via a backend service. This is a client-side demo simulation.
    setTimeout(() => {
        simulatePlayerRole();
    }, 2000);
}

function simulatePlayerRole() {
    // NOTE: This is demo functionality for client-side testing only.
    // In a real implementation, role assignment would come from Helper Bot 3000 via a backend.
    const allRoles = Object.values(ROLES);
    const randomRole = allRoles[Math.floor(Math.random() * allRoles.length)];
    
    const roleNameElem = document.getElementById('p-role-name');
    const roleTeamElem = document.getElementById('p-role-team');
    const roleAbilityElem = document.getElementById('p-role-ability');
    
    if (roleNameElem) {
        roleNameElem.textContent = randomRole.name;
        roleNameElem.style.color = randomRole.team === 'clinicians' ? '#a8dadc' : '#e63946';
    }
    
    if (roleTeamElem) {
        roleTeamElem.textContent = `Faction: ${randomRole.team.toUpperCase()}`;
        roleTeamElem.className = `role-team ${randomRole.team === 'clinicians' ? 'good' : 'evil'}`;
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
    addToGameLog('Welcome to Future Hooman: Outbreak at the Clinic. Helper Bot 3000 is standing by.');
});
