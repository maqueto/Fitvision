// Constantes do jogo
const TEAM_FORMATIONS = {
    '4-4-2': { defenders: 4, midfielders: 4, forwards: 2 },
    '4-3-3': { defenders: 4, midfielders: 3, forwards: 3 },
    '3-5-2': { defenders: 3, midfielders: 5, forwards: 2 },
    '4-2-3-1': { defenders: 4, midfielders: 5, forwards: 1 }
};

const EVENT_TYPES = {
    GOAL: { text: 'Gol!', class: 'goal' },
    YELLOW_CARD: { text: 'Cartão amarelo', class: 'yellow-card' },
    RED_CARD: { text: 'Cartão vermelho!', class: 'red-card' },
    INJURY: { text: 'Lesão!', class: 'injury' },
    SUBSTITUTION: { text: 'Substituição', class: 'substitution' }
};

// Dados do jogo
let gameData = {
    clubs: [],
    selectedClub: null,
    currentOpponent: null,
    matchEvents: [],
    simulationSpeed: 1,
    isSimulationPaused: false
};

// Elementos DOM
const domElements = {
    screens: {
        mainMenu: document.getElementById('main-menu'),
        clubSelection: document.getElementById('club-selection'),
        squadView: document.getElementById('squad-view'),
        matchSimulation: document.getElementById('match-simulation'),
        matchResult: document.getElementById('match-result'),
        howToPlay: document.getElementById('how-to-play-screen'),
        credits: document.getElementById('credits-screen')
    },
    buttons: {
        startGame: document.getElementById('start-game'),
        howToPlay: document.getElementById('how-to-play'),
        credits: document.getElementById('credits'),
        confirmClub: document.getElementById('confirm-club'),
        backToMenuFromClub: document.getElementById('back-to-menu-from-club'),
        simulateMatch: document.getElementById('simulate-match'),
        backToClubSelection: document.getElementById('back-to-club-selection'),
        training: document.getElementById('training'),
        pauseMatch: document.getElementById('pause-match'),
        speedUpMatch: document.getElementById('speed-up-match'),
        backToSquad: document.getElementById('back-to-squad'),
        newMatch: document.getElementById('new-match'),
        backToMenuFromHelp: document.getElementById('back-to-menu-from-help'),
        backToMenuFromCredits: document.getElementById('back-to-menu-from-credits')
    },
    clubSelection: {
        clubList: document.getElementById('club-list-container'),
        selectedClubPreview: document.getElementById('selected-club-preview')
    },
    squadView: {
        clubName: document.getElementById('current-club-name'),
        clubPower: document.getElementById('club-power'),
        clubBudget: document.getElementById('club-budget'),
        playerList: document.getElementById('player-list').querySelector('tbody')
    },
    matchSimulation: {
        homeTeamName: document.getElementById('home-team-name'),
        awayTeamName: document.getElementById('away-team-name'),
        homeTeamLogo: document.getElementById('home-team-logo'),
        awayTeamLogo: document.getElementById('away-team-logo'),
        homeScore: document.getElementById('home-score'),
        awayScore: document.getElementById('away-score'),
        currentMinute: document.getElementById('current-minute'),
        timeProgress: document.getElementById('time-progress'),
        eventsList: document.getElementById('events-list'),
        shotsStatHome: document.getElementById('shots-stat-home'),
        shotsStatAway: document.getElementById('shots-stat-away'),
        possessionStatHome: document.getElementById('possession-stat-home'),
        possessionStatAway: document.getElementById('possession-stat-away'),
        foulsStatHome: document.getElementById('fouls-stat-home'),
        foulsStatAway: document.getElementById('fouls-stat-away')
    },
    matchResult: {
        resultHomeName: document.getElementById('result-home-name'),
        resultAwayName: document.getElementById('result-away-name'),
        resultHomeLogo: document.getElementById('result-home-logo'),
        resultAwayLogo: document.getElementById('result-away-logo'),
        resultHomeScore: document.getElementById('result-home-score'),
        resultAwayScore: document.getElementById('result-away-score'),
        resultMessage: document.getElementById('result-message'),
        highlightEvents: document.getElementById('highlight-events'),
        topPlayers: document.getElementById('top-players').querySelector('tbody')
    }
};

// Inicialização do jogo
function initGame() {
    generateSampleData();
    setupEventListeners();
    showScreen('main-menu');
}

// Gerar dados de exemplo
function generateSampleData() {
    gameData.clubs = [
        {
            id: 1,
            name: 'Real Madrid',
            power: 92,
            budget: 500,
            formation: '4-3-3',
            players: generatePlayers(25, 85, 94)
        },
        {
            id: 2,
            name: 'Barcelona',
            power: 90,
            budget: 450,
            formation: '4-3-3',
            players: generatePlayers(25, 84, 92)
        },
        {
            id: 3,
            name: 'Manchester City',
            power: 91,
            budget: 600,
            formation: '4-2-3-1',
            players: generatePlayers(25, 84, 93)
        },
        {
            id: 4,
            name: 'Liverpool',
            power: 89,
            budget: 400,
            formation: '4-3-3',
            players: generatePlayers(25, 83, 91)
        },
        {
            id: 5,
            name: 'Bayern Munich',
            power: 90,
            budget: 350,
            formation: '4-2-3-1',
            players: generatePlayers(25, 84, 92)
        },
        {
            id: 6,
            name: 'PSG',
            power: 88,
            budget: 700,
            formation: '4-3-3',
            players: generatePlayers(25, 82, 90)
        },
        {
            id: 7,
            name: 'Juventus',
            power: 86,
            budget: 300,
            formation: '3-5-2',
            players: generatePlayers(25, 80, 88)
        },
        {
            id: 8,
            name: 'Ajax',
            power: 82,
            budget: 150,
            formation: '4-3-3',
            players: generatePlayers(25, 75, 85)
        }
    ];
}

// Gerar jogadores fictícios
function generatePlayers(count, minOverall, maxOverall) {
    const positions = ['GK', 'DEF', 'MID', 'ATT'];
    const firstNames = ['Lionel', 'Cristiano', 'Neymar', 'Kylian', 'Kevin', 'Robert', 'Mohamed', 'Sergio', 'Luka', 'Karim', 'Toni', 'Gareth', 'Eden', 'Paul', 'Antoine', 'Virgil', 'Sadio', 'Alisson', 'Ederson', 'Thibaut'];
    const lastNames = ['Messi', 'Ronaldo', 'Jr', 'Mbappé', 'De Bruyne', 'Lewandowski', 'Salah', 'Agüero', 'Modrić', 'Benzema', 'Kroos', 'Bale', 'Hazard', 'Pogba', 'Griezmann', 'van Dijk', 'Mané', 'Becker', 'Moraes', 'Courtois'];
    
    const players = [];
    
    for (let i = 0; i < count; i++) {
        const position = positions[Math.floor(Math.random() * positions.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const overall = Math.floor(Math.random() * (maxOverall - minOverall + 1)) + minOverall;
        const age = Math.floor(Math.random() * 10) + 18;
        
        players.push({
            id: i + 1,
            name: `${firstName} ${lastName}`,
            position: position,
            overall: overall,
            age: age,
            fitness: 100,
            form: Math.floor(Math.random() * 10) + 1
        });
    }
    
    // Garantir pelo menos 2 goleiros
    players[0].position = 'GK';
    players[1].position = 'GK';
    
    return players;
}

// Configurar listeners de eventos
function setupEventListeners() {
    // Navegação entre telas
    domElements.buttons.startGame.addEventListener('click', () => showScreen('club-selection'));
    domElements.buttons.howToPlay.addEventListener('click', () => showScreen('how-to-play'));
    domElements.buttons.credits.addEventListener('click', () => showScreen('credits'));
    domElements.buttons.backToMenuFromClub.addEventListener('click', () => showScreen('main-menu'));
    domElements.buttons.backToMenuFromHelp.addEventListener('click', () => showScreen('main-menu'));
    domElements.buttons.backToMenuFromCredits.addEventListener('click', () => showScreen('main-menu'));
    domElements.buttons.backToClubSelection.addEventListener('click', () => showScreen('club-selection'));
    domElements.buttons.backToSquad.addEventListener('click', () => showScreen('squad-view'));
    
    // Seleção de clube
    domElements.buttons.confirmClub.addEventListener('click', confirmClubSelection);
    
    // Simulação de partida
    domElements.buttons.simulateMatch.addEventListener('click', startMatchSimulation);
    domElements.buttons.pauseMatch.addEventListener('click', togglePauseSimulation);
    domElements.buttons.speedUpMatch.addEventListener('click', changeSimulationSpeed);
    domElements.buttons.newMatch.addEventListener('click', startMatchSimulation);
}

// Mostrar tela específica
function showScreen(screenName) {
    // Esconder todas as telas
    for (const screen in domElements.screens) {
        domElements.screens[screen].classList.remove('active');
    }
    
    // Mostrar tela solicitada
    domElements.screens[screenName].classList.add('active');
    
    // Carregar dados específicos da tela
    switch (screenName) {
        case 'club-selection':
            loadClubSelectionScreen();
            break;
        case 'squad-view':
            loadSquadViewScreen();
            break;
    }
}

// Carregar tela de seleção de clube
function loadClubSelectionScreen() {
    domElements.clubSelection.clubList.innerHTML = '';
    domElements.buttons.confirmClub.disabled = true;
    gameData.selectedClub = null;
    
    gameData.clubs.forEach(club => {
        const clubElement = document.createElement('div');
        clubElement.className = 'club-item';
        clubElement.innerHTML = `
            <div class="club-logo">${club.name.charAt(0)}</div>
            <div class="club-name">${club.name}</div>
            <div class="club-power">Poder: ${club.power}</div>
        `;
        
        clubElement.addEventListener('click', () => selectClub(club));
        domElements.clubSelection.clubList.appendChild(clubElement);
    });
}

// Selecionar clube
function selectClub(club) {
    // Remover seleção anterior
    const previouslySelected = document.querySelector('.club-item.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }
    
    // Adicionar seleção nova
    const clubElements = document.querySelectorAll('.club-item');
    clubElements.forEach(element => {
        if (element.querySelector('.club-name').textContent === club.name) {
            element.classList.add('selected');
        }
    });
    
    // Atualizar preview
    domElements.clubSelection.selectedClubPreview.innerHTML = `
        <h3>${club.name}</h3>
        <p>Poder: ${club.power}</p>
        <p>Orçamento: €${club.budget}M</p>
        <p>Formação: ${club.formation}</p>
    `;
    
    gameData.selectedClub = club;
    domElements.buttons.confirmClub.disabled = false;
}

// Confirmar seleção de clube
function confirmClubSelection() {
    if (gameData.selectedClub) {
        showScreen('squad-view');
    }
}

// Carregar tela de visualização do elenco
function loadSquadViewScreen() {
    if (!gameData.selectedClub) return;
    
    const club = gameData.selectedClub;
    
    // Atualizar informações do clube
    domElements.squadView.clubName.textContent = club.name;
    domElements.squadView.clubPower.textContent = club.power;
    domElements.squadView.clubBudget.textContent = `€${club.budget}M`;
    
    // Carregar lista de jogadores
    domElements.squadView.playerList.innerHTML = '';
    club.players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.position}</td>
            <td>${player.overall}</td>
            <td>${player.age}</td>
        `;
        domElements.squadView.playerList.appendChild(row);
    });
    
    // Atualizar formação tática
    document.getElementById('formation-type').textContent = club.formation;
}

// Iniciar simulação de partida
function startMatchSimulation() {
    if (!gameData.selectedClub) return;
    
    // Selecionar adversário aleatório (excluindo o próprio time)
    let availableOpponents = gameData.clubs.filter(club => club.id !== gameData.selectedClub.id);
    gameData.currentOpponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
    
    // Resetar dados da partida
    gameData.matchEvents = [];
    gameData.simulationSpeed = 1;
    gameData.isSimulationPaused = false;
    
    // Configurar tela de simulação
    domElements.matchSimulation.homeTeamName.textContent = gameData.selectedClub.name;
    domElements.matchSimulation.awayTeamName.textContent = gameData.currentOpponent.name;
    domElements.matchSimulation.homeTeamLogo.textContent = gameData.selectedClub.name.charAt(0);
    domElements.matchSimulation.awayTeamLogo.textContent = gameData.currentOpponent.name.charAt(0);
    domElements.matchSimulation.homeScore.textContent = '0';
    domElements.matchSimulation.awayScore.textContent = '0';
    domElements.matchSimulation.currentMinute.textContent = "0'";
    domElements.matchSimulation.timeProgress.style.width = '0%';
    domElements.matchSimulation.eventsList.innerHTML = '';
    
    // Resetar estatísticas
    domElements.matchSimulation.shotsStatHome.style.width = '0%';
    domElements.matchSimulation.shotsStatAway.style.width = '0%';
    domElements.matchSimulation.possessionStatHome.style.width = '50%';
    domElements.matchSimulation.possessionStatAway.style.width = '50%';
    domElements.matchSimulation.foulsStatHome.style.width = '0%';
    domElements.matchSimulation.foulsStatAway.style.width = '0%';
    
    // Mostrar tela de simulação
    showScreen('match-simulation');
    
    // Iniciar simulação
    simulateMatch();
}

// Simular partida
function simulateMatch() {
    let minute = 0;
    const matchDuration = 90;
    const homeTeamPower = gameData.selectedClub.power;
    const awayTeamPower = gameData.currentOpponent.power;
    
    // Estatísticas da partida
    const matchStats = {
        homeShots: 0,
        awayShots: 0,
        homePossession: 50,
        awayPossession: 50,
        homeFouls: 0,
        awayFouls: 0,
        homeGoals: 0,
        awayGoals: 0
    };
    
    const simulationInterval = setInterval(() => {
        if (gameData.isSimulationPaused) return;
        
        minute++;
        domElements.matchSimulation.currentMinute.textContent = `${minute}'`;
        domElements.matchSimulation.timeProgress.style.width = `${(minute / matchDuration) * 100}%`;
        
        // Atualizar estatísticas
        updateMatchStats(matchStats, homeTeamPower, awayTeamPower);
        
        // Gerar eventos aleatórios
        if (Math.random() < 0.3) {
            generateMatchEvent(minute, matchStats, homeTeamPower, awayTeamPower);
        }
        
        // Final da partida
        if (minute >= matchDuration) {
            clearInterval(simulationInterval);
            setTimeout(() => showMatchResult(matchStats), 2000);
        }
    }, 1000 / gameData.simulationSpeed);
}

// Atualizar estatísticas da partida
function updateMatchStats(stats, homePower, awayPower) {
    // Finalizações
    const homeShotChance = 0.02 * (homePower / 90);
    const awayShotChance = 0.02 * (awayPower / 90);
    
    if (Math.random() < homeShotChance) {
        stats.homeShots++;
    }
    if (Math.random() < awayShotChance) {
        stats.awayShots++;
    }
    
    // Posse de bola (ligeira vantagem para o time mais forte)
    const possessionChange = (homePower - awayPower) / 1000;
    stats.homePossession += possessionChange;
    stats.awayPossession -= possessionChange;
    
    // Garantir que a posse fique entre 20% e 80%
    stats.homePossession = Math.max(20, Math.min(80, stats.homePossession));
    stats.awayPossession = 100 - stats.homePossession;
    
    // Faltas
    if (Math.random() < 0.03) {
        stats.homeFouls++;
    }
    if (Math.random() < 0.03) {
        stats.awayFouls++;
    }
    
    // Atualizar UI
    const totalShots = stats.homeShots + stats.awayShots || 1;
    const homeShotsPercent = (stats.homeShots / totalShots) * 100;
    const awayShotsPercent = (stats.awayShots / totalShots) * 100;
    
    domElements.matchSimulation.shotsStatHome.style.width = `${homeShotsPercent}%`;
    domElements.matchSimulation.shotsStatAway.style.width = `${awayShotsPercent}%`;
    domElements.matchSimulation.possessionStatHome.style.width = `${stats.homePossession}%`;
    domElements.matchSimulation.possessionStatAway.style.width = `${stats.awayPossession}%`;
    
    const totalFouls = stats.homeFouls + stats.awayFouls || 1;
    const homeFoulsPercent = (stats.homeFouls / totalFouls) * 100;
    const awayFoulsPercent = (stats.awayFouls / totalFouls) * 100;
    
    domElements.matchSimulation.foulsStatHome.style.width = `${homeFoulsPercent}%`;
    domElements.matchSimulation.foulsStatAway.style.width = `${awayFoulsPercent}%`;
}

// Gerar evento durante a partida
function generateMatchEvent(minute, stats, homePower, awayPower) {
    const eventTypes = Object.keys(EVENT_TYPES);
    const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const isHomeTeam = Math.random() < (homePower / (homePower + awayPower));
    const teamName = isHomeTeam ? gameData.selectedClub.name : gameData.currentOpponent.name;
    
    let eventDescription = '';
    let isGoal = false;
    
    switch (randomEventType) {
        case 'GOAL':
            if (Math.random() < 0.3 * (isHomeTeam ? homePower : awayPower) / 90) {
                eventDescription = `${teamName} marca um gol!`;
                if (isHomeTeam) {
                    stats.homeGoals++;
                    domElements.matchSimulation.homeScore.textContent = stats.homeGoals;
                } else {
                    stats.awayGoals++;
                    domElements.matchSimulation.awayScore.textContent = stats.awayGoals;
                }
                isGoal = true;
            } else {
                return; // Chance de gol não foi bem sucedida
            }
            break;
        case 'YELLOW_CARD':
            eventDescription = `Cartão amarelo para ${teamName}`;
            break;
        case 'RED_CARD':
            eventDescription = `Cartão vermelho para ${teamName}!`;
            break;
        case 'INJURY':
            eventDescription = `Jogador de ${teamName} se machuca!`;
            break;
        case 'SUBSTITUTION':
            eventDescription = `${teamName} faz uma substituição`;
            break;
    }
    
    // Criar elemento de evento
    const eventElement = document.createElement('div');
    eventElement.className = `event-item ${EVENT_TYPES[randomEventType].class}`;
    eventElement.innerHTML = `
        <span class="event-minute">${minute}'</span>
        <div class="event-icon">${randomEventType === 'GOAL' ? '⚽' : randomEventType === 'YELLOW_CARD' ? '🟨' : randomEventType === 'RED_CARD' ? '🟥' : '🩹'}</div>
        <span class="event-text">${eventDescription}</span>
    `;
    
    // Adicionar à lista de eventos
    domElements.matchSimulation.eventsList.prepend(eventElement);
    
    // Adicionar aos eventos do jogo
    gameData.matchEvents.push({
        minute: minute,
        type: randomEventType,
        team: isHomeTeam ? 'home' : 'away',
        description: eventDescription,
        isGoal: isGoal
    });
}

// Pausar/continuar simulação
function togglePauseSimulation() {
    gameData.isSimulationPaused = !gameData.isSimulationPaused;
    domElements.buttons.pauseMatch.textContent = gameData.isSimulationPaused ? 'Continuar' : 'Pausar';
}

// Alterar velocidade da simulação
function changeSimulationSpeed() {
    gameData.simulationSpeed = gameData.simulationSpeed === 1 ? 3 : 1;
    domElements.buttons.speedUpMatch.textContent = gameData.simulationSpeed === 1 ? 'Acelerar' : 'Velocidade Normal';
}

// Mostrar resultado da partida
function showMatchResult(stats) {
    // Configurar elementos da tela de resultado
    domElements.matchResult.resultHomeName.textContent = gameData.selectedClub.name;
    domElements.matchResult.resultAwayName.textContent = gameData.currentOpponent.name;
    domElements.matchResult.resultHomeLogo.textContent = gameData.selectedClub.name.charAt(0);
    domElements.matchResult.resultAwayLogo.textContent = gameData.currentOpponent.name.charAt(0);
    domElements.matchResult.resultHomeScore.textContent = stats.homeGoals;
    domElements.matchResult.resultAwayScore.textContent = stats.awayGoals;
    
    // Determinar mensagem do resultado
    if (stats.homeGoals > stats.awayGoals) {
        domElements.matchResult.resultMessage.textContent = 'Vitória!';
        domElements.matchResult.resultMessage.style.color = '#27ae60';
    } else if (stats.homeGoals < stats.awayGoals) {
        domElements.matchResult.resultMessage.textContent = 'Derrota';
        domElements.matchResult.resultMessage.style.color = '#e74c3c';
    } else {
        domElements.matchResult.resultMessage.textContent = 'Empate';
        domElements.matchResult.resultMessage.style.color = '#f39c12';
    }
    
    // Listar eventos importantes (gols)
    domElements.matchResult.highlightEvents.innerHTML = '';
    const highlightEvents = gameData.matchEvents.filter(event => event.isGoal);
    
    if (highlightEvents.length === 0) {
        const noGoalsItem = document.createElement('li');
        noGoalsItem.textContent = 'Nenhum gol marcado na partida';
        domElements.matchResult.highlightEvents.appendChild(noGoalsItem);
    } else {
        highlightEvents.forEach(event => {
            const eventItem = document.createElement('li');
            eventItem.textContent = `${event.minute}' - ${event.description}`;
            domElements.matchResult.highlightEvents.appendChild(eventItem);
        });
    }
    
    // Listar melhores jogadores (simulado)
    domElements.matchResult.topPlayers.innerHTML = '';
    const topPlayers = [
        { name: gameData.selectedClub.players[0].name, team: gameData.selectedClub.name, rating: 8.5 },
        { name: gameData.currentOpponent.players[0].name, team: gameData.currentOpponent.name, rating: 8.2 },
        { name: gameData.selectedClub.players[1].name, team: gameData.selectedClub.name, rating: 7.8 },
        { name: gameData.currentOpponent.players[1].name, team: gameData.currentOpponent.name, rating: 7.5 },
        { name: gameData.selectedClub.players[2].name, team: gameData.selectedClub.name, rating: 7.3 }
    ];
    
    topPlayers.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.team}</td>
            <td>${player.rating.toFixed(1)}</td>
        `;
        domElements.matchResult.topPlayers.appendChild(row);
    });
    
    // Mostrar tela de resultado
    showScreen('match-result');
}

// Iniciar o jogo quando a página carregar
window.addEventListener('DOMContentLoaded', initGame);
