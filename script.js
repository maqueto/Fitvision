// script.js

// --- Dados do Jogo (Mais Complexos) ---
// Arrays de objetos para clubes e jogadores
const gameData = {
    clubs: [
        {
            id: 1,
            name: "Leões Valentes F.C.",
            power: 75, // Poder geral para simulação simplificada
            players: [
                { id: 101, name: "Pedro Goleiro", position: "GK", overall: 78 },
                { id: 102, name: "João Zagueiro", position: "DEF", overall: 76 },
                { id: 103, name: "Maria Lateral", position: "DEF", overall: 75 },
                { id: 104, name: "Carlos Volante", position: "MID", overall: 74 },
                { id: 105, name: "Ana Meia-Campo", position: "MID", overall: 77 },
                { id: 106, name: "Lucas Ponta", position: "ATT", overall: 79 },
                { id: 107, name: "Beatriz Centroavante", position: "ATT", overall: 80 },
                 { id: 108, name: "Rafa Zagueiro", position: "DEF", overall: 73 },
                 { id: 109, name: "Bruno Lateral", position: "DEF", overall: 72 },
                 { id: 110, name: "Fernanda Volante", position: "MID", overall: 75 },
                 { id: 111, name: "Gustavo Meia", position: "MID", overall: 76 },
                 { id: 112, name: "Helena Atacante", position: "ATT", overall: 78 },
            ]
        },
        {
            id: 2,
            name: "Águias Poderosas S.E.",
            power: 80,
             players: [
                { id: 201, name: "Felipe Goleiro", position: "GK", overall: 82 },
                { id: 202, name: "Gabriela Zagueira", position: "DEF", overall: 81 },
                { id: 203, name: "Thiago Lateral", position: "DEF", overall: 80 },
                { id: 204, name: "Julia Volante", position: "MID", overall: 79 },
                { id: 205, name: "Leonardo Meia", position: "MID", overall: 83 },
                { id: 206, name: "Camila Ponta", position: "ATT", overall: 84 },
                { id: 207, name: "Ricardo Centroavante", position: "ATT", overall: 85 },
                 { id: 208, name: "Patrícia Zagueira", position: "DEF", overall: 79 },
                 { id: 209, name: "Daniel Lateral", position: "DEF", overall: 78 },
                 { id: 210, name: "Manuela Volante", position: "MID", overall: 80 },
                 { id: 211, name: "Eduardo Meia", position: "MID", overall: 81 },
                 { id: 212, name: "Isabela Atacante", position: "ATT", overall: 83 },
            ]
        },
         {
            id: 3,
            name: "Panteras Negras F.C.",
            power: 70,
             players: [
                { id: 301, name: "Goleiro 301", position: "GK", overall: 70 },
                { id: 302, name: "Zagueiro 302", position: "DEF", overall: 71 },
                { id: 303, name: "Lateral 303", position: "DEF", overall: 69 },
                { id: 304, name: "Volante 304", position: "MID", overall: 70 },
                { id: 305, name: "Meia 305", position: "MID", overall: 72 },
                { id: 306, name: "Ponta 306", position: "ATT", overall: 74 },
                { id: 307, name: "Centroavante 307", position: "ATT", overall: 75 },
                 { id: 308, name: "Zagueiro 308", position: "DEF", overall: 68 },
                 { id: 309, name: "Lateral 309", position: "DEF", overall: 67 },
                 { id: 310, name: "Volante 310", position: "MID", overall: 69 },
                 { id: 311, name: "Meia 311", position: "MID", overall: 70 },
                 { id: 312, name: "Atacante 312", position: "ATT", overall: 73 },
            ]
        }
        // Adicione mais clubes aqui
    ],
    // Podemos adicionar mais dados globais aqui no futuro (ligas, etc.)
};


// --- Elementos da UI (Mantidos do código anterior) ---
// ... (tudo que estava na seção Elementos da UI antes) ...
// Seções da UI
const gameContainer = document.getElementById('game-container');
const screens = document.querySelectorAll('.game-screen');

// Tela Inicial
const homeScreen = document.getElementById('home-screen');
const startButton = document.getElementById('start-game-btn');

// Tela de Seleção de Clube
const clubSelectionScreen = document.getElementById('club-selection-screen');
const clubListContainer = document.getElementById('club-list-container');
const selectClubButton = document.getElementById('select-club-btn');

// Tela do Elenco
const squadScreen = document.getElementById('squad-screen');
const currentClubNameDisplay = document.getElementById('current-club-name');
const playerListBody = document.getElementById('player-list-body');
const simulateMatchButton = document.getElementById('simulate-match-btn');

// Tela de Simulação da Partida
const matchScreen = document.getElementById('match-screen');
const homeTeamDisplay = document.getElementById('home-team-display');
const awayTeamDisplay = document.getElementById('away-team-display');
const scoreDisplay = document.getElementById('score-display');
const matchLog = document.getElementById('match-log');
const startSimulationButton = document.getElementById('start-simulation-btn');
const viewResultButton = document.getElementById('view-result-btn');

// Tela de Resultado da Partida
const resultScreen = document.getElementById('result-screen');
const finalScoreDisplay = document.getElementById('final-score');
const resultMessageDisplay = document.getElementById('result-message');
const resultEventsList = document.getElementById('result-events-list');


const backButtons = document.querySelectorAll('.back-button');


// --- Estado do Jogo (Mais Complexo) ---
let selectedClub = null; // Objeto do clube selecionado pelo jogador
let selectedClubElement = null; // Referência ao botão do clube selecionado na tela de seleção
let currentOpponent = null; // Objeto do clube adversário na partida
let matchResult = { // Objeto para guardar os resultados da partida atual
    homeScore: 0,
    awayScore: 0,
    events: [] // Array de strings ou objetos para os eventos (ex: gols)
};


// --- Funções de Navegação (Mantidas do código anterior) ---
function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// --- Funções de Lógica do Jogo (Implementadas agora) ---

// Carrega e exibe a lista de clubes na tela de seleção
function loadClubSelection() {
    clubListContainer.innerHTML = ''; // Limpa a lista atual

    if (gameData.clubs.length === 0) {
        clubListContainer.innerHTML = '<p>Nenhum clube disponível no momento.</p>';
        selectClubButton.disabled = true;
        return;
    }

    gameData.clubs.forEach(club => {
        const clubButton = document.createElement('button');
        clubButton.textContent = club.name;
        clubButton.dataset.clubId = club.id; // Guarda o ID do clube no botão

        // Adiciona evento de clique para selecionar o clube
        clubButton.addEventListener('click', () => {
            // Remove a classe 'selected' do botão anterior (se houver)
            if (selectedClubElement) {
                selectedClubElement.classList.remove('selected');
            }

            // Encontra o objeto clube correspondente nos dados
            selectedClub = gameData.clubs.find(c => c.id === club.id);
            selectedClubElement = clubButton; // Guarda a referência do botão clicado

            // Adiciona a classe 'selected' ao botão clicado
            selectedClubElement.classList.add('selected');

            selectClubButton.disabled = false; // Habilita o botão "Confirmar Clube"
            console.log(`Clube selecionado: ${selectedClub.name}`);

            // Opcional: mostrar info do clube selecionado na div selected-club-info
            // document.getElementById('selected-club-info').innerHTML = `<p>Você selecionou: <strong>${selectedClub.name}</strong> (Poder: ${selectedClub.power})</p>`;
        });

        clubListContainer.appendChild(clubButton); // Adiciona o botão à lista
    });

    // Desabilitar o botão "Confirmar Clube" até que um clube seja selecionado
    selectClubButton.disabled = true;
     if (selectedClubElement) { // Se já havia um clube selecionado antes de voltar
        selectedClubElement.classList.remove('selected'); // Limpa o estado visual anterior
        selectedClubElement = null;
     }
     selectedClub = null; // Reseta o clube selecionado ao voltar para a tela de seleção

}

// Carrega e exibe o elenco do clube selecionado
function loadSquad(clubId) {
    const club = gameData.clubs.find(c => c.id === clubId);

    if (!club) {
        console.error(`Clube com ID ${clubId} não encontrado!`);
        currentClubNameDisplay.textContent = "Erro ao carregar clube";
        playerListBody.innerHTML = '<tr><td colspan="3">Erro ao carregar elenco.</td></tr>';
        return;
    }

    selectedClub = club; // Garante que selectedClub está atualizado (útil se voltarmos para esta tela)
    currentClubNameDisplay.textContent = selectedClub.name; // Exibe o nome do clube
    playerListBody.innerHTML = ''; // Limpa a lista atual

    if (!selectedClub.players || selectedClub.players.length === 0) {
         playerListBody.innerHTML = '<tr><td colspan="3">Elenco não disponível.</td></tr>';
         simulateMatchButton.disabled = true; // Não pode simular sem jogadores
         return;
    }

    // Ordena jogadores (ex: por Overall, posição, nome) - Opcional
    const sortedPlayers = [...selectedClub.players].sort((a, b) => b.overall - a.overall);


    sortedPlayers.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.position}</td>
            <td>${player.overall}</td>
            `;
        playerListBody.appendChild(row); // Adiciona a linha à tabela
    });

    simulateMatchButton.disabled = false; // Habilita o botão de simular
}

// Configura a próxima partida (escolhe adversário, etc.)
function setupMatch() {
    if (!selectedClub) {
        console.error("Nenhum clube selecionado para configurar a partida!");
        // Poderia redirecionar de volta para a seleção de clube
        return;
    }

    // Escolhe um adversário aleatório diferente do clube do jogador
    const availableOpponents = gameData.clubs.filter(club => club.id !== selectedClub.id);

    if (availableOpponents.length === 0) {
        console.warn("Não há adversários disponíveis!");
        // Poderia desabilitar o botão de simular ou mostrar uma mensagem
        homeTeamDisplay.textContent = selectedClub.name;
        awayTeamDisplay.textContent = "Sem Adversário";
        scoreDisplay.textContent = '-';
        matchLog.innerHTML = '<p>Não há adversários para simular.</p>';
        startSimulationButton.classList.add('hidden');
        viewResultButton.classList.add('hidden');
         simulateMatchButton.disabled = true; // Desabilita simulação na tela de elenco
        return;
    }

    const randomOpponentIndex = Math.floor(Math.random() * availableOpponents.length);
    currentOpponent = availableOpponents[randomOpponentIndex];

    // Exibe os nomes dos times na tela de partida
    homeTeamDisplay.textContent = selectedClub.name;
    awayTeamDisplay.textContent = currentOpponent.name;
    scoreDisplay.textContent = '0 - 0'; // Reseta placar visual
    matchLog.innerHTML = '<p>Partida prestes a começar...</p>'; // Limpa log
    startSimulationButton.classList.remove('hidden'); // Garante botão de iniciar visível
    viewResultButton.classList.add('hidden'); // Garante botão de ver resultado escondido

    console.log(`Partida configurada: ${selectedClub.name} vs ${currentOpponent.name}`);
}

// Simula a partida (lógica simplificada)
function simulateMatch() {
    if (!selectedClub || !currentOpponent) {
        console.error("Times não configurados para simulação!");
         matchLog.innerHTML = '<p>Erro na configuração da partida.</p>';
        return;
    }

    console.log(`Simulando: ${selectedClub.name} (${selectedClub.power}) vs ${currentOpponent.name} (${currentOpponent.power})`);

    matchResult = { homeScore: 0, awayScore: 0, events: [] }; // Reseta o resultado
    matchLog.innerHTML = ''; // Limpa o log para a nova simulação

    // Lógica de simulação básica:
    // A chance de um evento de gol ocorrer é influenciada pelo poder do time.
    // Iteramos por "minutos" ou "eventos" e, em cada passo, verificamos se um gol ocorre.
    const totalMinutes = 90;
    const eventsPerMinute = 0.1; // Média de eventos por minuto (para simulação)

    // Calcular chance base de gol por 'tick' de simulação
    const baseChance = 0.005; // Pequena chance base
    const chanceFactor = 0.001; // Quão GERAL influencia o poder


    // Função para simular um tick
    function simulateTick(minute) {
        // Chance de gol para o time da casa (jogador)
        const homeGoalChance = baseChance + (selectedClub.power * chanceFactor) + (Math.random() * 0.01); // Add randomness
        if (Math.random() < homeGoalChance) {
            matchResult.homeScore++;
             const scorer = selectedClub.players[Math.floor(Math.random() * selectedClub.players.length)]; // Escolhe um jogador aleatório
             const event = `Gol do ${selectedClub.name}! (${scorer.name}) aos ${minute}'`;
            matchResult.events.push(event);
            matchLog.innerHTML += `<p>${event}</p>`; // Atualiza o log
            scoreDisplay.textContent = `${matchResult.homeScore} - ${matchResult.awayScore}`;
        }

        // Chance de gol para o time de fora (adversário)
        const awayGoalChance = baseChance + (currentOpponent.power * chanceFactor) + (Math.random() * 0.01); // Add randomness
        if (Math.random() < awayGoalChance) {
            matchResult.awayScore++;
            const scorer = currentOpponent.players[Math.floor(Math.random() * currentOpponent.players.length)]; // Escolhe um jogador aleatório
            const event = `Gol do ${currentOpponent.name}! (${scorer.name}) aos ${minute}'`;
            matchResult.events.push(event);
            matchLog.innerHTML += `<p>${event}</p>`; // Atualiza o log
            scoreDisplay.textContent = `${matchResult.homeScore} - ${matchResult.awayScore}`;
        }

        // Scroll para o final do log automaticamente
        matchLog.scrollTop = matchLog.scrollHeight;
    }

    // Simula minuto a minuto
    let currentMinute = 0;
    const simulationInterval = setInterval(() => {
        currentMinute++;
        // Adiciona um evento de minuto no log a cada ~10 minutos simulados para feedback visual
        if (currentMinute % 10 === 0 || currentMinute === 1) {
             matchLog.innerHTML += `<p>-- ${currentMinute}' minutos --</p>`;
             matchLog.scrollTop = matchLog.scrollHeight;
        }


        simulateTick(currentMinute);

        if (currentMinute >= totalMinutes) {
            clearInterval(simulationInterval); // Para a simulação após 90 minutos
            console.log("Simulação concluída.");
            matchLog.innerHTML += '<p>-- Fim de jogo --</p>';
             matchLog.scrollTop = matchLog.scrollHeight;


            // Atualiza botões após a simulação
            startSimulationButton.classList.add('hidden');
            viewResultButton.classList.remove('hidden');
        }
    }, 50); // Intervalo de tempo entre cada minuto simulado (em ms)

}


// Exibe o resultado da partida na tela de resultado
function displayResult() {
     if (!matchResult || !selectedClub || !currentOpponent) {
         console.error("Dados de resultado ou times não disponíveis!");
          finalScoreDisplay.textContent = 'Placar: -';
          resultMessageDisplay.textContent = 'Erro ao carregar resultado.';
          resultEventsList.innerHTML = '<li>Erro ao carregar eventos.</li>';
         return;
     }

    finalScoreDisplay.textContent = `Placar Final: ${matchResult.homeScore} - ${matchResult.awayScore}`;

    // Determina a mensagem do resultado
    if (matchResult.homeScore > matchResult.awayScore) {
        resultMessageDisplay.textContent = `🎉 Vitória do ${selectedClub.name}! 🎉`;
    } else if (matchResult.homeScore < matchResult.awayScore) {
        resultMessageDisplay.textContent = `😢 Derrota para o ${selectedClub.name}. Vitória do ${currentOpponent.name}.`;
    } else {
        resultMessageDisplay.textContent = "🤝 Empate!";
    }

    // Lista os eventos (gols)
    resultEventsList.innerHTML = ''; // Limpa a lista atual
    if (matchResult.events.length > 0) {
        matchResult.events.forEach(event => {
            const listItem = document.createElement('li');
            listItem.textContent = event;
            resultEventsList.appendChild(listItem);
        });
    } else {
        resultEventsList.innerHTML = '<li>Nenhum gol marcado na partida.</li>';
    }
}


// --- Event Listeners (Atualizados e Expandidos) ---

document.addEventListener('DOMContentLoaded', () => {

    // Botão "Começar Jogo" na tela inicial
    startButton.addEventListener('click', () => {
        showScreen('club-selection-screen');
        loadClubSelection(); // Agora esta função preenche a lista de clubes e adiciona listeners
    });

    // Botões "Voltar" (Mantidos do código anterior, com pequenas melhorias)
     backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreenId = button.dataset.targetScreen;
            showScreen(targetScreenId);

            // Lógica específica ao voltar para certas telas
            if (targetScreenId === 'club-selection-screen') {
                 // Reseta a seleção de clube ao voltar para esta tela
                 selectedClub = null;
                 if (selectedClubElement) {
                     selectedClubElement.classList.remove('selected');
                     selectedClubElement = null;
                 }
                 selectClubButton.disabled = true; // Desabilita o botão confirmar
                 // Opcional: recarregar a lista de clubes se ela puder mudar
                 // loadClubSelection();
            } else if (targetScreenId === 'squad-screen') {
                 // Ao voltar para o elenco após uma partida ou configuração
                 currentOpponent = null; // Reseta o adversário configurado
                 matchResult = { homeScore: 0, awayScore: 0, events: [] }; // Reseta o resultado da partida
                 // Limpa o estado visual da tela de partida
                 matchLog.innerHTML = '<p>Partida prestes a começar...</p>';
                 scoreDisplay.textContent = '0 - 0';
                 startSimulationButton.classList.remove('hidden');
                 viewResultButton.classList.add('hidden');
            }
        });
    });


    // Botão "Confirmar Clube" (Atualizado para usar o clube selecionado)
     selectClubButton.addEventListener('click', () => {
         if (selectedClub) { // Verifica se selectedClub foi preenchido pelo clique no botão do clube
             showScreen('squad-screen');
             loadSquad(selectedClub.id); // Passa o ID do clube selecionado para carregar o elenco
         } else {
             console.warn("Nenhum clube selecionado para confirmar!");
             // Poderia mostrar uma mensagem visual ao usuário
         }
     });

     // Botão "Simular Próxima Partida" (Na tela do elenco)
     simulateMatchButton.addEventListener('click', () => {
         showScreen('match-screen');
         setupMatch(); // Configura a partida (escolhe adversário)
         // A simulação agora é iniciada pelo botão "Iniciar Simulação" na tela de partida
     });

     // Botão "Iniciar Simulação" (Dentro da tela de partida)
     startSimulationButton.addEventListener('click', () => {
         simulateMatch(); // Executa a lógica de simulação
          // Os botões serão atualizados DENTRO da função simulateMatch() quando a simulação terminar
     });

     // Botão "Ver Resultado" (Aparece após a simulação)
     viewResultButton.addEventListener('click', () => {
         showScreen('result-screen');
         displayResult(); // Exibe os dados armazenados no matchResult
     });


    // --- Inicialização ---
    // Mostra a tela inicial ao carregar
     showScreen('home-screen');

     // Prepara a tela de seleção de clube logo no início, mas ela só será visível quando o botão start for clicado
     // loadClubSelection(); // Poderia carregar aqui, mas é melhor carregar quando o botão start é clicado
});
