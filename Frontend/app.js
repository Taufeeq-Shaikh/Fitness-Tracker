let appData = {
    profile: {
        name: "Alex Mercer",
        age: 26,
        weight: 75,
        calorieGoal: 2200
    },
    workouts: [],
    meals: [],
    caloriesBurnedToday: 0
};

const standardExercises = [
    { name: "Barbell Squat", target: "Legs", desc: "Lower hips from a standing position and return upward. Maintain a neutral posture." },
    { name: "Bench Press", target: "Chest", desc: "Press a weight upward away from your chest while flat on an exercise bench." },
    { name: "Deadlift", target: "Back", desc: "Lift a deadweight off the ground to hip level while pulling with your back and hips locked." },
    { name: "Overhead Press", target: "Shoulders", desc: "Drive a barbell vertically over your head from your upper chest until lock out." },
    { name: "Pull-Ups", target: "Back & Pull", desc: "Pull your entire body vertically upward until your head clears the static hanging bar." },
    { name: "Leg Press", target: "Legs", desc: "Push the platform away until your legs are extended, then return slowly." },
    { name: "Bulgarian Split Squat", target: "Legs", desc: "Lower your body with one foot elevated behind you, then drive back up." },
    { name: "Leg Extension", target: "Legs", desc: "Extend your knees to lift the weight, then lower it with control." },
    { name: "Hamstring Curl", target: "Legs", desc: "Curl your heels toward your glutes, then return slowly." },
    { name: "Calf Raise", target: "Legs", desc: "Raise your heels as high as possible, then lower them under control." },
    { name: "Hip Thrust", target: "Glutes", desc: "Drive your hips upward until your body forms a straight line from shoulders to knees." }
];

document.addEventListener("DOMContentLoaded", () => {
    loadDataFromStorage();
    setupNavigation();
    setupFormListeners();
    renderExerciseLibrary();
    updateUI();
});

// Simple Single-Page Router Switcher 
function setupNavigation() {
    const links = document.querySelectorAll(".nav-link");
    const panels = document.querySelectorAll(".panel");

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const targetPanel = link.getAttribute("data-target");
            panels.forEach(panel => {
                if(panel.id === targetPanel) {
                    panel.classList.add("active-panel");
                } else {
                    panel.classList.remove("active-panel");
                }
            });
        });
    });
}

// Tracking Event Relays 
function setupFormListeners() {
    document.getElementById("workout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("workout-name").value;
        const sets = parseInt(document.getElementById("workout-sets").value);
        const reps = parseInt(document.getElementById("workout-reps").value);
        const weight = parseInt(document.getElementById("workout-weight").value);

        appData.workouts.push({ name, sets, reps, weight });
        appData.caloriesBurnedToday += 50; 

        saveToStorage();
        updateUI();
        e.target.reset();
    });

    document.getElementById("calorie-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("food-name").value;
        const calories = parseInt(document.getElementById("food-calories").value);

        appData.meals.push({ name, calories });

        saveToStorage();
        updateUI();
        e.target.reset();
    });

    document.getElementById("profile-form").addEventListener("submit", (e) => {
        e.preventDefault();
        appData.profile.name = document.getElementById("profile-name").value;
        appData.profile.age = parseInt(document.getElementById("profile-age").value);
        appData.profile.weight = parseInt(document.getElementById("profile-weight").value);
        appData.profile.calorieGoal = parseInt(document.getElementById("profile-goal").value);

        saveToStorage();
        updateUI();
        alert("Configuration parameters updated.");
    });
}

// Minimalist Data Renderer
function updateUI() {
    document.getElementById("dash-username").innerText = appData.profile.name;
    document.getElementById("profile-name").value = appData.profile.name;
    document.getElementById("profile-age").value = appData.profile.age;
    document.getElementById("profile-weight").value = appData.profile.weight;
    document.getElementById("profile-goal").value = appData.profile.calorieGoal;

    const totalIntake = appData.meals.reduce((sum, item) => sum + item.calories, 0);
    const totalWeightLifted = appData.workouts.reduce((sum, item) => sum + (item.sets * item.reps * item.weight), 0);
    
    document.getElementById("dash-calories-burned").innerText = appData.caloriesBurnedToday;
    document.getElementById("dash-calories-intake").innerText = `${totalIntake} / ${appData.profile.calorieGoal}`;
    document.getElementById("dash-workout-count").innerText = appData.workouts.length;

    // Build standard workout table rows
    const tableBody = document.getElementById("workout-table-body");
    tableBody.innerHTML = "";
    appData.workouts.forEach(w => {
        tableBody.insertAdjacentHTML("beforeend", `<tr>
            <td><strong>${w.name}</strong></td>
            <td>${w.sets}</td>
            <td>${w.reps}</td>
            <td>${w.weight} kg</td>
        </tr>`);
    });

    // meal list
    const mealList = document.getElementById("meal-list");
    mealList.innerHTML = "";
    appData.meals.forEach(m => {
        mealList.insertAdjacentHTML("beforeend", `<li><span>${m.name}</span> <span>${m.calories} kcal</span></li>`);
    });

    // Build consolidated activity feeds
    const dashboardLog = document.getElementById("today-log-list");
    dashboardLog.innerHTML = "";
    
    appData.workouts.forEach(w => {
        dashboardLog.insertAdjacentHTML("beforeend", `<li><span>Log: ${w.name}</span> <span>${w.sets} sets completed</span></li>`);
    });
    appData.meals.forEach(m => {
        dashboardLog.insertAdjacentHTML("beforeend", `<li><span>Intake: ${m.name}</span> <span>+${m.calories} kcal</span></li>`);
    });

    document.getElementById("analytics-total-weight").innerText = totalWeightLifted;
    document.getElementById("analytics-net-calories").innerText = totalIntake - appData.caloriesBurnedToday;
}

// Exercise
function renderExerciseLibrary() {
    const grid = document.getElementById("library-grid");
    grid.innerHTML = "";
    standardExercises.forEach(ex => {
        grid.insertAdjacentHTML("beforeend", `
            <div class="lib-card">
                <span class="tag-badge">${ex.target}</span>
                <h3>${ex.name}</h3>
                <p>${ex.desc}</p>
            </div>
        `);
    });
}

//  Local storage
function saveToStorage() {
    localStorage.setItem("fitpulse_minimal_data", JSON.stringify(appData));
}

function loadDataFromStorage() {
    const stored = localStorage.getItem("fitpulse_minimal_data");
    if (stored) {
        try { appData = JSON.parse(stored); } catch (e) { console.error("Data structure parsing failed.", e); }
    }
}

