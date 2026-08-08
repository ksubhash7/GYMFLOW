const exercises = {
  "CHEST": [
    ["Push-Ups", "CHEST", "Do controlled push-ups.", "3", "10", "60"],
    ["Wall Push-Ups", "CHEST", "Push against a wall with control.", "3", "15", "45"],
    ["Knee Push-Ups", "CHEST", "Do push-ups with your knees on the floor.", "3", "10", "60"]
  ],

  "BACK": [
    ["Superman", "BACK", "Lie down and lift your arms and legs.", "3", "10", "45"],
    ["Dumbbell Row", "BACK", "Pull the dumbbell toward your body.", "3", "10", "60"]
  ],

  "LEGS": [
    ["Squats", "LEGS", "Squat down and stand back up.", "3", "15", "60"],
    ["Lunges", "LEGS", "Step forward and lower your body.", "3", "10", "60"],
    ["Calf Raises", "CALVES", "Raise your heels and slowly lower them.", "3", "15", "45"],
    ["Wall Sit", "LEGS", "Hold a sitting position against a wall.", "3", "30 sec", "60"]
  ],

  "ARMS": [
    ["Bicep Curls", "BICEPS", "Curl the dumbbells toward your shoulders.", "3", "12", "60"],
    ["Hammer Curls", "BICEPS", "Curl the dumbbells with palms facing each other.", "3", "12", "60"],
    ["Tricep Dips", "TRICEPS", "Lower and push yourself back up.", "3", "8", "60"]
  ],

  "SHOULDERS": [
    ["Arm Circles", "SHOULDERS", "Make slow circles with your arms.", "3", "30 sec", "30"],
    ["Shoulder Press", "SHOULDERS", "Press the dumbbells overhead.", "3", "10", "60"],
    ["Front Raises", "SHOULDERS", "Raise the dumbbells in front of you.", "3", "12", "45"]
  ],

  "FULL BODY": [
    ["Jumping Jacks", "FULL BODY", "Jump while moving your arms and legs.", "3", "20", "45"],
    ["High Knees", "FULL BODY", "Run in place while lifting your knees.", "3", "20", "45"],
    ["Mountain Climbers", "FULL BODY", "Bring your knees toward your chest.", "3", "15", "45"],
    ["Bodyweight Squats", "FULL BODY", "Squat down and stand back up.", "3", "15", "60"]
  ]
};

const all = Object.values(exercises).flat();
const tips = [
  "Control every rep. Quality beats momentum.",
  "Leave your ego at the door. Technique comes first.",
  "Breathe through the hardest part of every rep.",
  "Progress slowly. Consistency compounds.",
  "Own the eccentric. Don't just drop the weight."
];

let mode = "FULL BODY";
let current = null;
let completed = 0;
let rotation = 0;
let timerInterval;

const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const againBtn = document.getElementById("againBtn");
const startBtn = document.getElementById("startBtn");
const timerOverlay = document.getElementById("timerOverlay");
const timerDisplay = document.getElementById("timer");

function getPool() {
  return mode === "FULL BODY" ? all : exercises[mode];
}

function showExercise(exercise) {
  current = exercise;
  document.getElementById("exerciseCategory").textContent = exercise[1];
  document.getElementById("exerciseName").textContent = exercise[0];
  document.getElementById("exerciseDescription").textContent = exercise[2];
  document.getElementById("sets").textContent = exercise[3];
  document.getElementById("reps").textContent = exercise[4];
  document.getElementById("rest").textContent = exercise[5] + "s";
  document.getElementById("exerciseIcon").textContent = "✦";
  startBtn.disabled = false;
}

function spin() {
  if (spinBtn.disabled) return;
  spinBtn.disabled = true;

  const pool = getPool();
  const selected = pool[Math.floor(Math.random() * pool.length)];
  const extra = 1440 + Math.floor(Math.random() * 360);
  rotation += extra;
  wheel.style.transform = `rotate(${rotation}deg)`;

  document.getElementById("exerciseCategory").textContent = "SELECTING...";
  document.getElementById("exerciseName").textContent = "Let the wheel decide";
  document.getElementById("exerciseDescription").textContent = "Finding your next challenge...";
  startBtn.disabled = true;

  setTimeout(() => {
    showExercise(selected);
    spinBtn.disabled = false;
    document.getElementById("tip").textContent = tips[Math.floor(Math.random() * tips.length)];
  }, 4100);
}

function startRestTimer() {
  if (!current) return;
  let seconds = Number(current[5]);
  timerOverlay.classList.add("show");
  updateTimer(seconds);

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds--;
    updateTimer(seconds);
    if (seconds <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "DONE";
    }
  }, 1000);
}

function updateTimer(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${m}:${s}`;
}

function completeExercise() {
  if (!current) return;
  completed++;
  document.getElementById("completed").textContent = completed;
  document.getElementById("sessionCount").textContent = completed;
  document.getElementById("progressBar").style.width = `${Math.min(completed * 10, 100)}%`;
  startRestTimer();
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    mode = button.dataset.mode;
    document.getElementById("modeLabel").textContent = mode;
    current = null;
    startBtn.disabled = true;
    document.getElementById("exerciseCategory").textContent = "WAITING FOR SPIN";
    document.getElementById("exerciseName").textContent = "Spin the wheel";
    document.getElementById("exerciseDescription").textContent = `Ready for a ${mode.toLowerCase()} challenge.`;
    document.getElementById("sets").textContent = "—";
    document.getElementById("reps").textContent = "—";
    document.getElementById("rest").textContent = "—";
  });
});

spinBtn.addEventListener("click", spin);
againBtn.addEventListener("click", spin);
startBtn.addEventListener("click", completeExercise);

document.getElementById("closeTimer").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerOverlay.classList.remove("show");
});
document.getElementById("skipTimer").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerOverlay.classList.remove("show");
});

timerOverlay.addEventListener("click", e => {
  if (e.target === timerOverlay) {
    clearInterval(timerInterval);
    timerOverlay.classList.remove("show");
  }
});
