// Configurações iniciais
document.addEventListener('DOMContentLoaded', function() {
  // Variáveis globais
  let currentUser = null;
  let workoutTimer = null;
  let workoutSeconds = 0;
  let isWorkoutPaused = true;
  let currentExerciseIndex = 0;
  let currentSet = 1;
  let currentReps = 0;
  let poseDetector = null;
  let postureScore = 75;
  
  // Dados mockados (em uma aplicação real, viriam de um backend)
  const mockExercises = [
    {
      id: 1,
      name: "Supino Reto",
      muscles: ["Peitoral", "Tríceps", "Deltóide"],
      description: "Deite-se no banco com os pés apoiados no chão. Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros. Desça a barra até o peito, mantendo os cotovelos em um ângulo de 75 graus. Empurre a barra para cima até estender os braços.",
      sets: 3,
      reps: 10,
      tips: [
        "Mantenha as costas firmes no banco",
        "Não arquear a lombar excessivamente",
        "Cotovelos em 75 graus na descida"
      ],
      videoUrl: "https://example.com/videos/supino.mp4"
    },
    {
      id: 2,
      name: "Agachamento Livre",
      muscles: ["Quadríceps", "Glúteos", "Isquiotibiais"],
      description: "Fique em pé com os pés na largura dos ombros. Mantenha as costas retas e agache como se fosse sentar em uma cadeira, até que suas coxas fiquem paralelas ao chão. Volte à posição inicial.",
      sets: 4,
      reps: 12,
      tips: [
        "Mantenha o peito erguido",
        "Joelhos não devem passar dos pés",
        "Desça até o paralelo"
      ],
      videoUrl: "https://example.com/videos/agachamento.mp4"
    }
  ];

  const mockWorkoutPlan = {
    name: "Superior A - Hipertrofia",
    duration: 45,
    calories: 320,
    exercises: mockExercises
  };

  const mockProgressData = {
    weight: [
      { date: '2023-01-01', value: 80 },
      { date: '2023-01-08', value: 79.5 },
      { date: '2023-01-15', value: 79 },
      { date: '2023-01-22', value: 78.5 },
      { date: '2023-01-29', value: 78 }
    ],
    muscle: [
      { date: '2023-01-01', value: 40 },
      { date: '2023-01-08', value: 40.5 },
      { date: '2023-01-15', value: 41 },
      { date: '2023-01-22', value: 41.5 },
      { date: '2023-01-29', value: 42 }
    ],
    fat: [
      { date: '2023-01-01', value: 21 },
      { date: '2023-01-08', value: 20.5 },
      { date: '2023-01-15', value: 20 },
      { date: '2023-01-22', value: 19 },
      { date: '2023-01-29', value: 18 }
    ]
  };

  // Inicialização do aplicativo
  initApp();

  // Função de inicialização
  function initApp() {
    // Simular splash screen por 2 segundos
    setTimeout(() => {
      document.getElementById('splash-screen').classList.remove('active');
      document.getElementById('onboarding-screen').classList.add('active');
      initOnboarding();
    }, 2000);
    
    // Inicializar gráficos
    initCharts();
    
    // Configurar listeners
    setupEventListeners();
  }

  // Inicializar onboarding
  function initOnboarding() {
    const slides = document.querySelectorAll('.onboarding-slide');
    const nextBtn = document.querySelector('.next-btn');
    const skipBtn = document.querySelector('.skip-btn');
    const progressSteps = document.querySelectorAll('.progress-step');
    let currentSlide = 0;

    // Mostrar primeiro slide
    showSlide(currentSlide);

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      
      // Atualizar barra de progresso
      progressSteps.forEach((step, i) => {
        step.classList.toggle('active', i <= index);
      });
      
      // Atualizar texto do botão no último slide
      if (index === slides.length - 1) {
        nextBtn.textContent = 'Começar';
      } else {
        nextBtn.textContent = 'Próximo';
      }
    }

    nextBtn.addEventListener('click', () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
      } else {
        // Finalizar onboarding
        document.getElementById('onboarding-screen').classList.remove('active');
        document.getElementById('signup-screen').classList.add('active');
      }
    });

    skipBtn.addEventListener('click', () => {
      document.getElementById('onboarding-screen').classList.remove('active');
      document.getElementById('signup-screen').classList.add('active');
    });
  }

  // Configurar listeners de eventos
  function setupEventListeners() {
    // Formulário de cadastro
    document.getElementById('user-data-form').addEventListener('submit', handleSignup);
    
    // Navegação inferior
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('data-target');
        navigateTo(target);
      });
    });
    
    // Botão de voltar
    document.querySelector('.btn-back').addEventListener('click', () => {
      document.getElementById('workout-screen').classList.remove('active');
      document.getElementById('main-app').classList.add('active');
      resetWorkoutTimer();
    });
    
    // Controles de treino
    document.getElementById('play-pause-btn').addEventListener('click', toggleWorkoutPlayPause);
    document.getElementById('prev-exercise').addEventListener('click', prevExercise);
    document.getElementById('next-exercise').addEventListener('click', nextExercise);
    document.getElementById('finish-set-btn').addEventListener('click', finishSet);
    document.querySelector('.plus-rep').addEventListener('click', () => updateReps(1));
    document.querySelector('.minus-rep').addEventListener('click', () => updateReps(-1));
    
    // Botão iniciar treino
    document.querySelector('.start-workout-btn').addEventListener('click', startWorkout);
    
    // Modal de configurações
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
      toggle.addEventListener('click', function() {
        this.classList.toggle('active');
      });
    });
    
    // Toggles de unidade
    document.querySelectorAll('.unit-switch span').forEach(span => {
      span.addEventListener('click', function() {
        this.parentNode.querySelectorAll('span').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  // Manipular cadastro do usuário
  function handleSignup(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('user-name').value,
      age: document.getElementById('user-age').value,
      gender: document.getElementById('user-gender').value,
      height: document.getElementById('user-height').value,
      weight: document.getElementById('user-weight').value,
      goal: document.querySelector('input[name="goal"]:checked').value,
      level: document.getElementById('user-level').value
    };
    
    // Validar dados (simplificado)
    if (!formData.name || !formData.age || !formData.height || !formData.weight) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // Criar usuário
    currentUser = {
      ...formData,
      bmi: calculateBMI(formData.height, formData.weight),
      joinDate: new Date().toISOString()
    };
    
    // Atualizar UI com dados do usuário
    updateUserProfile();
    
    // Navegar para tela principal
    document.getElementById('signup-screen').classList.remove('active');
    document.getElementById('main-app').classList.add('active');
  }

  // Calcular IMC
  function calculateBMI(height, weight) {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  }

  // Atualizar perfil do usuário
  function updateUserProfile() {
    if (!currentUser) return;
    
    // Tela principal
    document.getElementById('user-display-name').textContent = currentUser.name;
    document.getElementById('bmi-value').textContent = currentUser.bmi;
    
    // Tela de perfil
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-goal').textContent = `Objetivo: ${getGoalName(currentUser.goal)}`;
    document.getElementById('profile-weight').textContent = `${currentUser.weight}kg`;
    
    // Atualizar métricas baseadas no IMC
    updateBodyMetrics();
  }

  // Obter nome do objetivo
  function getGoalName(goal) {
    const goals = {
      hypertrophy: 'Hipertrofia',
      weightloss: 'Perda de peso',
      endurance: 'Resistência'
    };
    return goals[goal] || goal;
  }

  // Atualizar métricas corporais
  function updateBodyMetrics() {
    if (!currentUser) return;
    
    const bmi = parseFloat(currentUser.bmi);
    let fatPercentage, musclePercentage, waterPercentage;
    
    // Cálculos simplificados (em uma aplicação real seriam mais precisos)
    if (currentUser.gender === 'male') {
      fatPercentage = (1.20 * bmi) + (0.23 * currentUser.age) - 16.2;
      musclePercentage = 100 - (fatPercentage + 15); // 15% para ossos, órgãos, etc.
    } else {
      fatPercentage = (1.20 * bmi) + (0.23 * currentUser.age) - 5.4;
      musclePercentage = 100 - (fatPercentage + 20); // 20% para ossos, órgãos, etc.
    }
    
    waterPercentage = currentUser.gender === 'male' ? 60 : 55;
    
    // Atualizar UI
    document.getElementById('fat-value').textContent = `${fatPercentage.toFixed(1)}%`;
    document.getElementById('muscle-value').textContent = `${musclePercentage.toFixed(1)}%`;
    document.getElementById('water-value').textContent = `${waterPercentage}%`;
    
    // Atualizar perfil
    document.getElementById('profile-fat').textContent = `${fatPercentage.toFixed(1)}%`;
    document.getElementById('profile-muscle').textContent = `${musclePercentage.toFixed(1)}%`;
    document.getElementById('profile-water').textContent = `${waterPercentage}%`;
  }

  // Navegação entre telas
  function navigateTo(screenId) {
    // Esconder todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Mostrar tela alvo
    document.getElementById(screenId).classList.add('active');
    
    // Inicializar telas específicas
    if (screenId === 'posture-screen') {
      initPostureAnalysis();
    } else if (screenId === 'profile-screen') {
      updateProfileStats();
    }
  }

  // Inicializar gráficos
  function initCharts() {
    // Gráfico de progresso
    const progressCtx = document.getElementById('progress-chart').getContext('2d');
    const progressChart = new Chart(progressCtx, {
      type: 'line',
      data: {
        labels: mockProgressData.weight.map(item => item.date.split('-')[2] + '/' + item.date.split('-')[1]),
        datasets: [
          {
            label: 'Peso (kg)',
            data: mockProgressData.weight.map(item => item.value),
            borderColor: '#4361ee',
            backgroundColor: 'rgba(67, 97, 238, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Músculo (%)',
            data: mockProgressData.muscle.map(item => item.value),
            borderColor: '#4ad66d',
            backgroundColor: 'rgba(74, 214, 109, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Gordura (%)',
            data: mockProgressData.fat.map(item => item.value),
            borderColor: '#f72585',
            backgroundColor: 'rgba(247, 37, 133, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
    
    // Gráfico do corpo (perfil)
    const bodyCtx = document.getElementById('body-chart').getContext('2d');
    const bodyChart = new Chart(bodyCtx, {
      type: 'radar',
      data: {
        labels: ['Força', 'Resistência', 'Flexibilidade', 'Equilíbrio', 'Agilidade', 'Coordenação'],
        datasets: [{
          label: 'Seu Desempenho',
          data: [85, 70, 60, 75, 65, 80],
          backgroundColor: 'rgba(67, 97, 238, 0.2)',
          borderColor: '#4361ee',
          pointBackgroundColor: '#4361ee',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#4361ee'
        }]
      },
      options: {
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  }

  // Iniciar treino
  function startWorkout() {
    document.getElementById('main-app').classList.remove('active');
    document.getElementById('workout-screen').classList.add('active');
    
    // Carregar primeiro exercício
    loadExercise(currentExerciseIndex);
    
    // Iniciar temporizador
    startWorkoutTimer();
    
    // Iniciar detecção de postura
    initPoseDetection();
  }

  // Carregar exercício
  function loadExercise(index) {
    if (index < 0 || index >= mockWorkoutPlan.exercises.length) return;
    
    const exercise = mockWorkoutPlan.exercises[index];
    
    // Atualizar UI
    document.getElementById('current-exercise-name').textContent = exercise.name;
    document.getElementById('exercise-description').textContent = exercise.description;
    document.getElementById('current-set').textContent = currentSet;
    document.getElementById('current-reps').textContent = currentReps;
    
    // Atualizar dicas de postura
    const tipsList = document.getElementById('posture-tips-list');
    tipsList.innerHTML = '';
    exercise.tips.forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      tipsList.appendChild(li);
    });
    
    // Atualizar contador de repetições
    document.getElementById('rep-display').textContent = currentReps;
  }

  // Controle do temporizador de treino
  function startWorkoutTimer() {
    resetWorkoutTimer();
    isWorkoutPaused = false;
    workoutTimer = setInterval(updateWorkoutTimer, 1000);
    document.getElementById('play-pause-btn').innerHTML = '<i class="fas fa-pause"></i>';
  }

  function pauseWorkoutTimer() {
    isWorkoutPaused = true;
    clearInterval(workoutTimer);
    document.getElementById('play-pause-btn').innerHTML = '<i class="fas fa-play"></i>';
  }

  function resetWorkoutTimer() {
    workoutSeconds = 0;
    updateWorkoutTimerDisplay();
  }

  function updateWorkoutTimer() {
    if (!isWorkoutPaused) {
      workoutSeconds++;
      updateWorkoutTimerDisplay();
    }
  }

  function updateWorkoutTimerDisplay() {
    const minutes = Math.floor(workoutSeconds / 60);
    const seconds = workoutSeconds % 60;
    document.getElementById('workout-time').textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Alternar play/pause
  function toggleWorkoutPlayPause() {
    if (isWorkoutPaused) {
      startWorkoutTimer();
    } else {
      pauseWorkoutTimer();
    }
  }

  // Navegação entre exercícios
  function prevExercise() {
    if (currentExerciseIndex > 0) {
      currentExerciseIndex--;
      currentSet = 1;
      currentReps = 0;
      loadExercise(currentExerciseIndex);
    }
  }

  function nextExercise() {
    if (currentExerciseIndex < mockWorkoutPlan.exercises.length - 1) {
      currentExerciseIndex++;
      currentSet = 1;
      currentReps = 0;
      loadExercise(currentExerciseIndex);
    } else {
      // Fim do treino
      finishWorkout();
    }
  }

  // Atualizar contador de repetições
  function updateReps(change) {
    currentReps = Math.max(0, currentReps + change);
    document.getElementById('current-reps').textContent = currentReps;
    document.getElementById('rep-display').textContent = currentReps;
  }

  // Finalizar série
  function finishSet() {
    const exercise = mockWorkoutPlan.exercises[currentExerciseIndex];
    
    if (currentSet < exercise.sets) {
      currentSet++;
      currentReps = 0;
      loadExercise(currentExerciseIndex);
      
      // Feedback visual
      const btn = document.getElementById('finish-set-btn');
      btn.textContent = 'Série concluída!';
      btn.style.backgroundColor = '#4ad66d';
      
      setTimeout(() => {
        btn.textContent = 'Finalizar Série';
        btn.style.backgroundColor = '';
      }, 1500);
    } else {
      nextExercise();
    }
  }

  // Finalizar treino
  function finishWorkout() {
    pauseWorkoutTimer();
    
    // Mostrar resumo do treino
    alert(`Treino concluído!\nDuração: ${Math.floor(workoutSeconds / 60)} minutos\nExercícios completados: ${mockWorkoutPlan.exercises.length}`);
    
    // Voltar para tela principal
    document.getElementById('workout-screen').classList.remove('active');
    document.getElementById('main-app').classList.add('active');
    
    // Resetar variáveis
    currentExerciseIndex = 0;
    currentSet = 1;
    currentReps = 0;
  }

  // Inicializar detecção de postura
  async function initPoseDetection() {
    try {
      // Carregar modelo de detecção de pose
      await tf.ready();
      const model = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        enableSmoothing: true
      };
      
      poseDetector = await poseDetection.createDetector(model, detectorConfig);
      
      // Configurar câmera
      const video = document.getElementById('pose-video');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        detectPose();
      };
    } catch (error) {
      console.error('Erro ao inicializar detecção de pose:', error);
    }
  }

  // Detectar pose em tempo real
  async function detectPose() {
    if (!poseDetector) return;
    
    const video = document.getElementById('pose-video');
    const canvas = document.getElementById('pose-canvas');
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Detectar poses
    const poses = await poseDetector.estimatePoses(video);
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar esqueleto (simplificado)
    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;
      
      // Desenhar pontos
      keypoints.forEach(keypoint => {
        if (keypoint.score > 0.3) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#4361ee';
          ctx.fill();
        }
      });
      
      // Simular análise de postura (em uma aplicação real seria mais complexo)
      simulatePostureAnalysis();
    }
    
    // Continuar detecção
    requestAnimationFrame(detectPose);
  }

  // Simular análise de postura
  function simulatePostureAnalysis() {
    // Alternar aleatoriamente entre feedback bom e ruim para demonstração
    const isGoodPosture = Math.random() > 0.5;
    
    const alertElement = document.getElementById('posture-alert');
    const goodElement = document.getElementById('posture-good');
    
    if (isGoodPosture) {
      alertElement.classList.add('hidden');
      goodElement.classList.remove('hidden');
    } else {
      goodElement.classList.add('hidden');
      alertElement.classList.remove('hidden');
    }
  }

  // Inicializar análise de postura
  async function initPostureAnalysis() {
    try {
      // Configurar câmera
      const video = document.getElementById('posture-video');
      const canvas = document.getElementById('posture-canvas');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      
      video.onloadedmetadata = () => {
        video.play();
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Iniciar simulação de análise
        simulatePostureScore();
      };
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
    }
  }

  // Simular pontuação de postura
  function simulatePostureScore() {
    // Variar a pontuação aleatoriamente para demonstração
    postureScore = Math.max(50, Math.min(95, postureScore + (Math.random() * 10 - 5)));
    
    // Atualizar UI
    document.querySelector('.score-value').textContent = `${Math.round(postureScore)}%`;
    document.querySelector('.circle-fill').setAttribute('stroke-dasharray', `${postureScore}, 100`);
    
    // Atualizar lista de problemas
    const issuesList = document.getElementById('posture-issues-list');
    issuesList.innerHTML = '';
    
    if (postureScore < 70) {
      const issues = [
        "Ombro esquerdo mais alto que o direito",
        "Leve inclinação para frente",
        "Pescoço projetado para frente",
        "Desalinhamento pélvico"
      ];
      
      // Selecionar 1-3 problemas aleatórios
      const randomIssues = issues
        .sort(() => 0.5 - Math.random())
        .slice(0, 1 + Math.floor(Math.random() * 2));
      
      randomIssues.forEach(issue => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>${issue}</span>`;
        issuesList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = "Nenhum problema significativo detectado";
      issuesList.appendChild(li);
    }
    
    // Continuar simulação
    setTimeout(simulatePostureScore, 3000);
  }

  // Atualizar estatísticas do perfil
  function updateProfileStats() {
    if (!currentUser) return;
    
    // Dados mockados
    document.getElementById('active-days').textContent = `${Math.floor(Math.random() * 30)}/30`;
    document.getElementById('total-calories').textContent = `${Math.floor(Math.random() * 10000).toLocaleString()} kcal`;
    document.getElementById('total-workouts').textContent = Math.floor(Math.random() * 50);
    document.getElementById('total-achievements').textContent = Math.floor(Math.random() * 10);
  }

  // Controle de modais
  function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
  }

  function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
  }

  // Funções auxiliares
  function getCurrentGreeting() {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  // Atualizar saudação
  setInterval(() => {
    if (document.getElementById('greeting-text')) {
      document.getElementById('greeting-text').textContent = `${getCurrentGreeting()},`;
    }
  }, 60000);
});
