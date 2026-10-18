/* ==========================================
   APEXFIT – HAUPTSKRIPT (app.js)
   ========================================== */

const FIREBASE_DB_URL = "https://apexfit-4c49a-default-rtdb.europe-west1.firebasedatabase.app";
const XP_PER_WORKOUT_SET = 50;
const XP_PER_LEVEL = 250;
const MAX_LEVEL = 75;

/* --- ZUSÄTZLICHE FLEX-SOLID SYMBOLE IN DAS SVG-SPRITE LADEN --- */
function injectAdditionalFlexIcons() {
    const sprite = document.getElementById('flex-solid-sprites');
    if (!sprite) return;
    sprite.insertAdjacentHTML('beforeend', `
        <!-- Kapsel / Supplements -->
        <symbol id="fx-pill" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M14.8 3.5C16.8 1.5 20.1 1.5 22.1 3.5C24.1 5.5 24.1 8.8 22.1 10.8L10.8 22.1C8.8 24.1 5.5 24.1 3.5 22.1C1.5 20.1 1.5 16.8 3.5 14.8L14.8 3.5ZM10.2 11.6L12.4 13.8L18.8 7.4C19.4 6.8 19.4 5.8 18.8 5.2C18.2 4.6 17.2 4.6 16.6 5.2L10.2 11.6Z"/>
        </symbol>
        <!-- Herz / Cardio -->
        <symbol id="fx-heart" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M12 21.3C11.4 21.3 10.8 21.1 10.3 20.7C5.4 16.8 2 13.2 2 8.8C2 5.4 4.6 3 7.8 3C9.6 3 11.1 3.8 12 5.1C12.9 3.8 14.4 3 16.2 3C19.4 3 22 5.4 22 8.8C22 13.2 18.6 16.8 13.7 20.7C13.2 21.1 12.6 21.3 12 21.3ZM8.5 7.5C7.7 7.5 7 8.2 7 9C7 9.8 7.7 10.5 8.5 10.5H15.5C16.3 10.5 17 9.8 17 9C17 8.2 16.3 7.5 15.5 7.5H8.5Z"/>
        </symbol>
        <!-- Code / Fokus -->
        <symbol id="fx-code" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M3 12C3 5.8 5.8 3 12 3C18.2 3 21 5.8 21 12C21 18.2 18.2 21 12 21C5.8 21 3 18.2 3 12ZM9.7 8.8C10.3 8.2 10.3 7.3 9.7 6.7C9.1 6.1 8.2 6.1 7.6 6.7L4.8 9.5C4.2 10.1 4.2 11 4.8 11.6L7.6 14.4C8.2 15 9.1 15 9.7 14.4C10.3 13.8 10.3 12.9 9.7 12.3L7.9 10.5L9.7 8.8ZM14.3 8.8L16.1 10.5L14.3 12.3C13.7 12.9 13.7 13.8 14.3 14.4C14.9 15 15.8 15 16.4 14.4L19.2 11.6C19.8 11 19.8 10.1 19.2 9.5L16.4 6.7C15.8 6.1 14.9 6.1 14.3 6.7C13.7 7.3 13.7 8.2 14.3 8.8Z"/>
        </symbol>
        <!-- Mond / Schlaf -->
        <symbol id="fx-moon" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M11.8 2.2C12.6 2.1 13.2 2.9 12.8 3.6C11.9 5.1 11.5 6.9 11.8 8.8C12.3 12.1 15 14.7 18.3 15.2C19.4 15.4 20.5 15.2 21.4 14.8C22.1 14.5 22.9 15.2 22.6 15.9C21.1 19.6 17.4 22.1 13.1 22.1C7.4 22.1 2.8 17.5 2.8 11.8C2.8 6.8 6.5 2.7 11.8 2.2ZM8.5 13.5C7.7 13.5 7 14.2 7 15C7 15.8 7.7 16.5 8.5 16.5H11.5C12.3 16.5 13 15.8 13 15C13 14.2 12.3 13.5 11.5 13.5H8.5Z"/>
        </symbol>
        <!-- Faust / Power -->
        <symbol id="fx-fist" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M6.5 3.5C7.6 3.5 8.5 4.4 8.5 5.5V4.5C8.5 3.4 9.4 2.5 10.5 2.5C11.6 2.5 12.5 3.4 12.5 4.5V4C12.5 2.9 13.4 2 14.5 2C15.6 2 16.5 2.9 16.5 4V5.5C16.5 4.4 17.4 3.5 18.5 3.5C19.6 3.5 20.5 4.4 20.5 5.5V12.5C20.5 17.8 17.2 21.5 12 21.5C6.8 21.5 3.5 17.8 3.5 12.5V8.5C3.5 7.4 4.4 6.5 5.5 6.5H6.5V3.5ZM8.5 12C7.7 12 7 12.7 7 13.5C7 14.3 7.7 15 8.5 15H15.5C16.3 15 17 14.3 17 13.5C17 12.7 16.3 12 15.5 12H8.5Z"/>
        </symbol>
        <!-- Sonne / Energie -->
        <symbol id="fx-sun" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd" d="M12 2C12.8 2 13.5 2.7 13.5 3.5V4.5C13.5 5.3 12.8 6 12 6C11.2 6 10.5 5.3 10.5 4.5V3.5C10.5 2.7 11.2 2 12 2ZM12 7.2C14.7 7.2 16.8 9.3 16.8 12C16.8 14.7 14.7 16.8 12 16.8C9.3 16.8 7.2 14.7 7.2 12C7.2 9.3 9.3 7.2 12 7.2ZM12 10.2C11 10.2 10.2 11 10.2 12C10.2 13 11 13.8 12 13.8C13 13.8 13.8 13 13.8 12C13.8 11 13 10.2 12 10.2ZM12 18C12.8 18 13.5 18.7 13.5 19.5V20.5C13.5 21.3 12.8 22 12 22C11.2 22 10.5 21.3 10.5 20.5V19.5C10.5 18.7 11.2 18 12 18ZM4.5 10.5C5.3 10.5 6 11.2 6 12C6 12.8 5.3 13.5 4.5 13.5H3.5C2.7 13.5 2 12.8 2 12C2 11.2 2.7 10.5 3.5 10.5H4.5ZM20.5 10.5C21.3 10.5 22 11.2 22 12C22 12.8 21.3 13.5 20.5 13.5H19.5C18.7 13.5 18 12.8 18 12C18 11.2 18.7 10.5 19.5 10.5H20.5Z"/>
        </symbol>
    `);
}

/* --- FARBEN & FLEX-SOLID ICONS PALETTEN --- */
const ACCENT_COLORS = [
    '#0a84ff', '#30d158', '#5e5ce6', '#ff9f0a',
    '#ff375f', '#64d2ff', '#bf5af2', '#ffd60a',
    '#10b981', '#f43f5e', '#8b5cf6', '#14b8a6',
    '#f97316', '#8e8e93', '#ffffff', '#111216'
];

const FLEX_ICON_LIST = [
    'fx-dumbbell', 'fx-bolt', 'fx-flame', 'fx-fist', 'fx-heart',
    'fx-shield', 'fx-trophy', 'fx-target', 'fx-rocket', 'fx-star',
    'fx-pill', 'fx-drop', 'fx-nutrition', 'fx-code', 'fx-calendar',
    'fx-chart', 'fx-moon', 'fx-sun', 'fx-gem', 'fx-crown'
];

// Hilfsfunktion: Rendert ein Flex-Solid SVG-Icon (optional als schwebendes Card-Corner-Icon)
function renderFlexIcon(iconId, colorHex = 'currentColor', sizePx = 22, isCornerFloating = false) {
    let cleanId = iconId || 'fx-bolt';
    // Fallback, falls aus älteren Speicherständen noch ein Material-Name hinterlegt ist
    if (!cleanId.startsWith('fx-')) {
        const map = {
            'fitness_center': 'fx-dumbbell',
            'bolt': 'fx-bolt',
            'local_fire_department': 'fx-flame',
            'medication': 'fx-pill',
            'water_drop': 'fx-drop',
            'favorite': 'fx-heart',
            'shield': 'fx-shield',
            'trophy': 'fx-trophy',
            'code': 'fx-code',
            'nutrition': 'fx-nutrition'
        };
        cleanId = map[cleanId] || 'fx-bolt';
    }
    const cornerClass = isCornerFloating ? 'card-corner-icon' : '';
    return `<svg class="flex-solid-icon ${cornerClass}" style="width:${sizePx}px; height:${sizePx}px; color:${colorHex};"><use href="#${cleanId}"/></svg>`;
}

function getContrastText(hex) {
    if (!hex) return '#ffffff';
    const c = hex.toLowerCase();
    if (c === '#ffffff' || c === '#ffd60a' || c === '#64d2ff') return '#000000';
    return '#ffffff';
}

function getBorderForColor(hex) {
    if (!hex) return 'transparent';
    if (hex.toLowerCase() === '#111216' || hex.toLowerCase() === '#000000') {
        return 'rgba(255, 255, 255, 0.42)';
    }
    return hex;
}

function getGlowColor(hex) {
    if (!hex) return '#0a84ff';
    if (hex.toLowerCase() === '#111216' || hex.toLowerCase() === '#000000') {
        return '#f5f7fa';
    }
    return hex;
}

function formatSecondsMMSS(totalSec) {
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

/* --- MEHRSPRACHIGKEIT (DE, EN, FR, ES) --- */
const TRANSLATIONS = {
    de: {
        greeting: "Guten Tag",
        daily_focus: "Daily Focus",
        today: "Heute",
        consistency: "Consistency",
        days_7: "7 Tage",
        show_graphs: "Performance-Graphen anzeigen",
        graphs_sub: "7-Tage XP-Trend & Fitness-Sätze",
        xp_curve_title: "7-Tage XP & Aktivitäts-Kurve",
        habit_matrix_title: "7-Tage Habit Matrix",
        habit_matrix_sub: "Jeder Haken bringt bis zu 50 XP",
        fit_matrix_title: "7-Tage Fitness-Matrix & Verlauf",
        fit_matrix_sub: "Absolvierte Sätze pro Muskelgruppe",
        nav_home: "Home",
        nav_fitness: "Fitness",
        nav_habits: "Habits",
        nav_journal: "Journal",
        nav_more: "Mehr",
        nav_ranking: "Ranking",
        start_workout: "Training starten",
        habits_subtitle: "Tägliche Ziele (Max. 50 XP)",
        add_category: "+ Kategorie",
        add_goal: "+ Neues Ziel",
        journal_subtitle: "Fortschritt & Trainings-Zeiten",
        strength_curve_title: "Kraft- & Satz-Entwicklung",
        strength_curve_sub: "Maximalgewicht (kg) der letzten Workouts",
        daily_balance: "Heutige Tagesbilanz",
        protein: "Eiweiß",
        fat: "Fett",
        carbs: "Kohlenhydrate",
        food_scanner_title: "Essen • KI Foto-Scanner",
        upload_meal_photo: "Mahlzeit fotografieren oder Bild wählen",
        meal: "Mahlzeit",
        calories: "Kalorien",
        save_meal_btn: "+ Mahlzeit zum heutigen Tag speichern",
        water_title: "Trinken • Wasser hinzufügen",
        show_history_btn: "History • Letzte Tagesergebnisse vergleichen",
        invite_btn: "Einladen (Link/Code)",
        add_friend_btn: "+ Freundes-Code",
        settings_title: "Einstellungen",
        profile_and_goals: "Profil & Körperziel",
        your_name: "Dein Name",
        body_weight: "Körpergewicht (kg)",
        goal_label: "Dein Ziel",
        goal_lose: "Abnehmen",
        goal_maintain: "Gewicht halten",
        goal_diet: "Diät (Defizit)",
        goal_bulk: "Muskelaufbau",
        save_profile_btn: "Profil & Ziel speichern",
        language_title: "Sprache / Language",
        daily_targets_title: "Tagesziele (FitTracker)",
        save_targets_btn: "Richtwerte aktualisieren",
        more_menu_title: "Mehr auswählen",
        close_btn: "Schließen"
    },
    en: {
        greeting: "Hello",
        daily_focus: "Daily Focus",
        today: "Today",
        consistency: "Consistency",
        days_7: "7 Days",
        show_graphs: "Show Performance Graphs",
        graphs_sub: "7-Day XP Trend & Workout Sets",
        xp_curve_title: "7-Day XP & Activity Curve",
        habit_matrix_title: "7-Day Habit Matrix",
        habit_matrix_sub: "Each check-in grants up to 50 XP",
        fit_matrix_title: "7-Day Fitness Matrix & Trend",
        fit_matrix_sub: "Completed sets per muscle group",
        nav_home: "Home",
        nav_fitness: "Fitness",
        nav_habits: "Habits",
        nav_journal: "Journal",
        nav_more: "More",
        nav_ranking: "Ranking",
        start_workout: "Start Workout",
        habits_subtitle: "Daily Goals (Max. 50 XP)",
        add_category: "+ Category",
        add_goal: "+ New Goal",
        journal_subtitle: "Progress & Workout Times",
        strength_curve_title: "Strength & Set Progression",
        strength_curve_sub: "Max weight (kg) of recent workouts",
        daily_balance: "Today's Nutrition Summary",
        protein: "Protein",
        fat: "Fat",
        carbs: "Carbs",
        food_scanner_title: "Food • AI Photo Scanner",
        upload_meal_photo: "Take a photo or upload meal image",
        meal: "Meal",
        calories: "Calories",
        save_meal_btn: "+ Save meal to today's log",
        water_title: "Hydration • Add Water",
        show_history_btn: "History • Compare past daily results",
        invite_btn: "Invite (Link/Code)",
        add_friend_btn: "+ Friend Code",
        settings_title: "Settings",
        profile_and_goals: "Profile & Body Goal",
        your_name: "Your Name",
        body_weight: "Body Weight (kg)",
        goal_label: "Your Goal",
        goal_lose: "Lose Weight",
        goal_maintain: "Maintain Weight",
        goal_diet: "Diet (Deficit)",
        goal_bulk: "Muscle Gain",
        save_profile_btn: "Save Profile & Goal",
        language_title: "Language",
        daily_targets_title: "Daily Targets (FitTracker)",
        save_targets_btn: "Update Targets",
        more_menu_title: "More Options",
        close_btn: "Close"
    },
    fr: {
        greeting: "Bonjour",
        daily_focus: "Focus du Jour",
        today: "Aujourd'hui",
        consistency: "Régularité",
        days_7: "7 Jours",
        show_graphs: "Afficher les graphiques",
        graphs_sub: "Tendance XP & séries sur 7 jours",
        xp_curve_title: "Courbe XP & Activité (7j)",
        habit_matrix_title: "Matrice d'Habitudes (7j)",
        habit_matrix_sub: "Chaque coche rapporte jusqu'à 50 XP",
        fit_matrix_title: "Matrice Fitness & Séries (7j)",
        fit_matrix_sub: "Séries complétées par groupe musculaire",
        nav_home: "Accueil",
        nav_fitness: "Fitness",
        nav_habits: "Habitudes",
        nav_journal: "Journal",
        nav_more: "Plus",
        nav_ranking: "Classement",
        start_workout: "Démarrer",
        habits_subtitle: "Objectifs quotidiens (Max. 50 XP)",
        add_category: "+ Catégorie",
        add_goal: "+ Nouvel Objectif",
        journal_subtitle: "Progrès & Durées",
        strength_curve_title: "Progression de Force",
        strength_curve_sub: "Poids max (kg) des dernières séances",
        daily_balance: "Bilan du Jour",
        protein: "Protéines",
        fat: "Lipides",
        carbs: "Glucides",
        food_scanner_title: "Repas • Scanner Photo IA",
        upload_meal_photo: "Prendre une photo du repas",
        meal: "Repas",
        calories: "Calories",
        save_meal_btn: "+ Ajouter le repas à aujourd'hui",
        water_title: "Hydratation • Eau",
        show_history_btn: "Historique • Comparer les derniers jours",
        invite_btn: "Inviter (Lien/Code)",
        add_friend_btn: "+ Code Ami",
        settings_title: "Paramètres",
        profile_and_goals: "Profil & Objectif Corporel",
        your_name: "Ton Nom",
        body_weight: "Poids (kg)",
        goal_label: "Ton Objectif",
        goal_lose: "Perdre du poids",
        goal_maintain: "Maintenir le poids",
        goal_diet: "Régime (Déficit)",
        goal_bulk: "Prise de masse",
        save_profile_btn: "Enregistrer le profil",
        language_title: "Langue / Language",
        daily_targets_title: "Objectifs Journaliers",
        save_targets_btn: "Mettre à jour",
        more_menu_title: "Plus d'options",
        close_btn: "Fermer"
    },
    es: {
        greeting: "Hola",
        daily_focus: "Enfoque Diario",
        today: "Hoy",
        consistency: "Constancia",
        days_7: "7 Días",
        show_graphs: "Mostrar gráficos de rendimiento",
        graphs_sub: "Tendencia de XP y series (7 días)",
        xp_curve_title: "Curva de XP y Actividad (7d)",
        habit_matrix_title: "Matriz de Hábitos (7d)",
        habit_matrix_sub: "Cada tarea suma hasta 50 XP",
        fit_matrix_title: "Matriz de Fitness y Series (7d)",
        fit_matrix_sub: "Series completadas por grupo muscular",
        nav_home: "Inicio",
        nav_fitness: "Fitness",
        nav_habits: "Hábitos",
        nav_journal: "Diario",
        nav_more: "Más",
        nav_ranking: "Ranking",
        start_workout: "Entrenar",
        habits_subtitle: "Metas diarias (Máx. 50 XP)",
        add_category: "+ Categoría",
        add_goal: "+ Nueva Meta",
        journal_subtitle: "Progreso y Tiempos",
        strength_curve_title: "Evolución de Fuerza",
        strength_curve_sub: "Peso máximo (kg) en entrenamientos",
        daily_balance: "Balance Diario",
        protein: "Proteína",
        fat: "Grasa",
        carbs: "Carbohidratos",
        food_scanner_title: "Comida • Escáner Foto IA",
        upload_meal_photo: "Tomar foto o subir imagen de comida",
        meal: "Comida",
        calories: "Calorías",
        save_meal_btn: "+ Guardar comida en el día de hoy",
        water_title: "Hidratación • Añadir Agua",
        show_history_btn: "Historial • Comparar días anteriores",
        invite_btn: "Invitar (Enlace/Código)",
        add_friend_btn: "+ Código Amigo",
        settings_title: "Ajustes",
        profile_and_goals: "Perfil y Objetivo Físico",
        your_name: "Tu Nombre",
        body_weight: "Peso corporal (kg)",
        goal_label: "Tu Objetivo",
        goal_lose: "Perder peso",
        goal_maintain: "Mantener peso",
        goal_diet: "Dieta (Déficit)",
        goal_bulk: "Ganar músculo",
        save_profile_btn: "Guardar perfil y objetivo",
        language_title: "Idioma / Language",
        daily_targets_title: "Metas Diarias (FitTracker)",
        save_targets_btn: "Actualizar metas",
        more_menu_title: "Más opciones",
        close_btn: "Cerrar"
    }
};

/* --- DATUMS-HELFER --- */
function getDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getMondayKey(dateObj) {
    const d = new Date(dateObj);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return getDateKey(d);
}

function getLast7Days() {
    const days = [];
    const lang = appSettings.language || 'de';
    const dayNamesMap = {
        de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        fr: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
        es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']
    };
    const dayNames = dayNamesMap[lang] || dayNamesMap.de;
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({
            key: getDateKey(d),
            dayName: dayNames[d.getDay()],
            dayNum: d.getDate(),
            isToday: i === 0
        });
    }
    return days;
}

/* --- BENUTZERDATEN & EINSTELLUNGEN INITIALISIEREN --- */
const todayKey = getDateKey(new Date());
const currentMondayKey = getMondayKey(new Date());

let myUserId = localStorage.getItem('apexfit_uid');
if (!myUserId) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'AF-';
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    myUserId = code;
    localStorage.setItem('apexfit_uid', myUserId);
}

let userName = localStorage.getItem('apexfit_username') || 'Marlii';

// Kein voreingestellter fremder Token mehr – der User trägt seinen eigenen ein
let geminiApiKey = localStorage.getItem('apexfit_gemini_key') || '';

let appSettings = JSON.parse(localStorage.getItem('apexfit_settings')) || {
    bodyWeight: 75.0,
    goal: 'maintain',
    language: 'de',
    kcalGoal: 2400,
    waterGoalLiters: 3.0
};

let showHomeGraphs = localStorage.getItem('apexfit_show_graphs') === 'true';
let showTrackerHistory = false;

let habitCategories = JSON.parse(localStorage.getItem('marlii_habit_cats')) || [
    { id: 'hcat_1', name: 'Supplements', color: '#0a84ff', icon: 'fx-pill' },
    { id: 'hcat_2', name: 'Daily Routine & Focus', color: '#30d158', icon: 'fx-bolt' }
];
habitCategories.forEach(c => {
    if (!c.icon || !c.icon.startsWith('fx-')) c.icon = 'fx-bolt';
    if (!c.color) c.color = '#0a84ff';
});

let habitsList = JSON.parse(localStorage.getItem('marlii_habits_list')) || [
    { id: 'hab_1', catId: 'hcat_1', name: 'Creatin (5g)', xp: 20, history: { [todayKey]: true } },
    { id: 'hab_2', catId: 'hcat_1', name: 'Magnesium & Omega-3', xp: 20, history: {} },
    { id: 'hab_3', catId: 'hcat_2', name: 'Morning Care / Ice Roller', xp: 30, history: { [todayKey]: true } },
    { id: 'hab_4', catId: 'hcat_2', name: 'Fokus-Session / Projekt', xp: 50, history: {} }
];
habitsList.forEach(h => {
    h.xp = Math.min(50, Math.max(5, Number(h.xp) || 25));
});

let fitnessData = JSON.parse(localStorage.getItem('marlii_fitness_data')) || [
    {
        id: 'cat_1',
        name: 'Brust',
        icon: 'fx-dumbbell',
        color: '#0a84ff',
        exercises: [
            { id: 'ex_1', name: 'Bankdrücken', sets: 4, reps: 8, weight: 70 },
            { id: 'ex_2', name: 'Butterfly (Kabel)', sets: 3, reps: 12, weight: 25 }
        ]
    },
    {
        id: 'cat_2',
        name: 'Arme',
        icon: 'fx-fist',
        color: '#5e5ce6',
        exercises: [
            { id: 'ex_3', name: 'Kurzhantel Curls', sets: 3, reps: 10, weight: 16 },
            { id: 'ex_4', name: 'Trizepsdrücken Seil', sets: 3, reps: 12, weight: 27.5 }
        ]
    }
];
fitnessData.forEach(c => {
    if (!c.icon || !c.icon.startsWith('fx-')) c.icon = 'fx-dumbbell';
    if (!c.color) c.color = '#0a84ff';
});

let journalData = JSON.parse(localStorage.getItem('apexfit_journal')) || [];
let friendIds = JSON.parse(localStorage.getItem('apexfit_friend_ids')) || [];

let nutritionData = JSON.parse(localStorage.getItem('apexfit_nutrition')) || {};
if (!nutritionData[todayKey]) {
    nutritionData[todayKey] = { meals: [], waterMl: 0, waterLogs: [] };
}

let notesData = JSON.parse(localStorage.getItem('apexfit_notes')) || {
    dailyDate: todayKey,
    weeklyKey: currentMondayKey,
    daily: [],
    weekly: [],
    general: []
};

let currentNotesTab = 'daily';
let currentFitCategoryId = null;
let selectedHabitColor = '#0a84ff';
let selectedHabitIcon = 'fx-bolt';
let selectedFitColor = '#0a84ff';
let selectedFitIcon = 'fx-dumbbell';
let selectedJournalFilter = 'ALL';

let activeWorkout = null;
let workoutTimerInterval = null;

function saveAll() {
    localStorage.setItem('apexfit_username', userName);
    localStorage.setItem('apexfit_settings', JSON.stringify(appSettings));
    localStorage.setItem('marlii_habit_cats', JSON.stringify(habitCategories));
    localStorage.setItem('marlii_habits_list', JSON.stringify(habitsList));
    localStorage.setItem('marlii_fitness_data', JSON.stringify(fitnessData));
    localStorage.setItem('apexfit_journal', JSON.stringify(journalData));
    localStorage.setItem('apexfit_friend_ids', JSON.stringify(friendIds));
    localStorage.setItem('apexfit_notes', JSON.stringify(notesData));
    localStorage.setItem('apexfit_nutrition', JSON.stringify(nutritionData));
    syncMyProfileToFirebase();
}

/* --- NOTIZEN AUTO-CLEANUP --- */
function checkNotesAutoCleanup() {
    let changed = false;
    const nowDayKey = getDateKey(new Date());
    const nowMonKey = getMondayKey(new Date());

    if (notesData.dailyDate !== nowDayKey) {
        notesData.daily = [];
        notesData.dailyDate = nowDayKey;
        changed = true;
    }
    if (notesData.weeklyKey !== nowMonKey) {
        notesData.weekly = [];
        notesData.weeklyKey = nowMonKey;
        changed = true;
    }
    if (changed) {
        localStorage.setItem('apexfit_notes', JSON.stringify(notesData));
    }
    updateNotesBadge();
}

function updateNotesBadge() {
    const total = (notesData.daily?.length || 0) + (notesData.weekly?.length || 0) + (notesData.general?.length || 0);
    const badge = document.getElementById('notes-count-badge');
    if (badge) {
        badge.style.display = total > 0 ? 'flex' : 'none';
        badge.innerText = total;
    }
}

/* --- PICKER FÜR FLEX-SOLID ICONS & 16 FARBEN INITIALISIEREN --- */
function initPickers() {
    const fitIconContainer = document.getElementById('fit-icon-picker');
    const habitIconContainer = document.getElementById('habit-icon-picker');
    if (!fitIconContainer || !habitIconContainer) return;

    fitIconContainer.innerHTML = '';
    habitIconContainer.innerHTML = '';

    FLEX_ICON_LIST.forEach((ic, idx) => {
        fitIconContainer.innerHTML += `
            <div class="icon-option ${idx === 0 ? 'selected' : ''}" data-icon="${ic}" onclick="selectFitIcon(this)">
                ${renderFlexIcon(ic, 'currentColor', 22, false)}
            </div>`;
        habitIconContainer.innerHTML += `
            <div class="icon-option ${idx === 1 ? 'selected' : ''}" data-icon="${ic}" onclick="selectHabitIcon(this)">
                ${renderFlexIcon(ic, 'currentColor', 22, false)}
            </div>`;
    });

    const fitColorContainer = document.getElementById('fit-color-picker');
    const habitColorContainer = document.getElementById('habit-color-picker');
    fitColorContainer.innerHTML = '';
    habitColorContainer.innerHTML = '';

    ACCENT_COLORS.forEach((col, idx) => {
        const extraBorder = col === '#111216' ? 'border-color: rgba(255,255,255,0.4);' : '';
        fitColorContainer.innerHTML += `
            <div class="color-swatch ${idx === 0 ? 'selected' : ''}" data-color="${col}" style="background:${col}; ${extraBorder}" onclick="selectFitColor(this)"></div>`;
        habitColorContainer.innerHTML += `
            <div class="color-swatch ${idx === 0 ? 'selected' : ''}" data-color="${col}" style="background:${col}; ${extraBorder}" onclick="selectHabitColor(this)"></div>`;
    });
}

/* --- LEVEL & XP SYSTEM (BIS LVL 75 MIT FLEX-SOLID ANIMATIONS-ICONS) --- */
function getLevelFromXP(xp) {
    const rawLvl = Math.floor(xp / XP_PER_LEVEL) + 1;
    return Math.min(MAX_LEVEL, rawLvl);
}

function getRankTitle(level) {
    if (level >= 75) return 'Apex Legend';
    if (level >= 70) return 'Olympian';
    if (level >= 65) return 'Immortal';
    if (level >= 60) return 'Titan';
    if (level >= 55) return 'Grandmaster';
    if (level >= 50) return 'Master';
    if (level >= 45) return 'Commander';
    if (level >= 40) return 'Gladiator';
    if (level >= 35) return 'Spartan';
    if (level >= 30) return 'Vanguard';
    if (level >= 25) return 'Warrior';
    if (level >= 20) return 'Hustler';
    if (level >= 15) return 'Challenger';
    if (level >= 10) return 'Striver';
    if (level >= 5)  return 'Starter';
    return 'Rookie';
}

function getLevelIconInfo(level) {
    if (level >= 75) return { icon: 'fx-crown', tierClass: 'lvl-tier-5' };
    if (level >= 70) return { icon: 'fx-trophy', tierClass: 'lvl-tier-5' };
    if (level >= 65) return { icon: 'fx-gem', tierClass: 'lvl-tier-5' };
    if (level >= 60) return { icon: 'fx-sun', tierClass: 'lvl-tier-4' };
    if (level >= 55) return { icon: 'fx-star', tierClass: 'lvl-tier-4' };
    if (level >= 50) return { icon: 'fx-crown', tierClass: 'lvl-tier-4' };
    if (level >= 45) return { icon: 'fx-rocket', tierClass: 'lvl-tier-4' };
    if (level >= 40) return { icon: 'fx-flame', tierClass: 'lvl-tier-3' };
    if (level >= 35) return { icon: 'fx-shield', tierClass: 'lvl-tier-3' };
    if (level >= 30) return { icon: 'fx-fist', tierClass: 'lvl-tier-3' };
    if (level >= 25) return { icon: 'fx-target', tierClass: 'lvl-tier-2' };
    if (level >= 20) return { icon: 'fx-rocket', tierClass: 'lvl-tier-2' };
    if (level >= 15) return { icon: 'fx-shield', tierClass: 'lvl-tier-2' };
    if (level >= 10) return { icon: 'fx-dumbbell', tierClass: 'lvl-tier-1' };
    if (level >= 5)  return { icon: 'fx-flame', tierClass: 'lvl-tier-1' };
    return { icon: 'fx-bolt', tierClass: 'lvl-tier-1' };
}

function calculateTotalXP() {
    let totalXP = 0;
    habitsList.forEach(h => {
        const xpVal = Math.min(50, Number(h.xp) || 25);
        if (h.history) {
            const completedDaysCount = Object.keys(h.history).filter(k => h.history[k]).length;
            totalXP += completedDaysCount * xpVal;
        }
    });
    journalData.forEach(entry => {
        if (entry.exercises) {
            entry.exercises.forEach(ex => {
                totalXP += (ex.sets ? ex.sets.length : 0) * XP_PER_WORKOUT_SET;
            });
        }
    });
    return totalXP;
}

function renderLevelCard() {
    const totalXP = calculateTotalXP();
    const currentLevel = getLevelFromXP(totalXP);
    const rankName = getRankTitle(currentLevel);
    const iconInfo = getLevelIconInfo(currentLevel);

    const iconWrapper = document.getElementById('lvl-icon-wrapper');
    if (iconWrapper) {
        iconWrapper.className = `lvl-anim-wrapper ${iconInfo.tierClass}`;
        iconWrapper.innerHTML = `<svg viewBox="0 0 24 24"><use href="#${iconInfo.icon}"/></svg>`;
    }

    document.getElementById('lvl-number').innerText = `Lvl ${currentLevel}`;
    document.getElementById('lvl-rank-title').innerText = `• ${rankName}`;
    document.getElementById('total-xp-badge').innerText = `${totalXP} XP`;

    if (currentLevel >= MAX_LEVEL) {
        document.getElementById('lvl-progress-bar').style.width = '100%';
        document.getElementById('lvl-progress-text').innerText = 'MAX LVL 75 ERREICHT';
        document.getElementById('lvl-next-hint').innerText = 'Apex Legend Status';
    } else {
        const xpIntoLevel = totalXP % XP_PER_LEVEL;
        const xpMissing = XP_PER_LEVEL - xpIntoLevel;
        const pct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);
        const nextMilestoneLvl = Math.floor(currentLevel / 5) * 5 + 5;

        document.getElementById('lvl-progress-bar').style.width = `${pct}%`;
        document.getElementById('lvl-progress-text').innerText = `${xpIntoLevel} / ${XP_PER_LEVEL} XP (${pct}%)`;
        document.getElementById('lvl-next-hint').innerText = `Noch ${xpMissing} XP bis Lvl ${currentLevel + 1} (Rang: Lvl ${nextMilestoneLvl})`;
    }
}

/* --- NOTIZEN MODAL --- */
function openNotesModal() {
    checkNotesAutoCleanup();
    renderNotesModal();
    document.getElementById('modal-notes').classList.add('open');
}

function switchNotesTab(tabKey) {
    currentNotesTab = tabKey;
    document.querySelectorAll('.notes-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('ntab-' + tabKey).classList.add('active');

    const hintEl = document.getElementById('notes-expiry-hint');
    if (tabKey === 'daily') {
        hintEl.innerText = '⏱ Tägliche Notizen löschen sich automatisch um Mitternacht.';
    } else if (tabKey === 'weekly') {
        hintEl.innerText = '📅 Wöchentliche Notizen gelten von Montag bis Sonntag.';
    } else {
        hintEl.innerText = '📌 Generelle Notizen bleiben dauerhaft gespeichert.';
    }
    renderNotesModal();
}

function renderNotesModal() {
    const listEl = document.getElementById('notes-list-container');
    const arr = notesData[currentNotesTab] || [];

    if (arr.length === 0) {
        listEl.innerHTML = `<p class="empty-hint">Keine Notizen in dieser Ansicht vorhanden.</p>`;
        return;
    }

    let html = '';
    arr.forEach(item => {
        html += `
        <div class="note-item-card">
            <div style="font-size:14px; line-height:1.4; word-break:break-word;">${item.text}</div>
            <button class="btn-delete-icon" onclick="deleteNoteItem('${item.id}')">
                <span class="material-symbols-rounded" style="font-size:18px;">close</span>
            </button>
        </div>`;
    });
    listEl.innerHTML = html;
}

function addNoteItem() {
    const inp = document.getElementById('input-note-text');
    const text = inp.value.trim();
    if (!text) return;

    if (!notesData[currentNotesTab]) notesData[currentNotesTab] = [];
    notesData[currentNotesTab].unshift({
        id: 'note_' + Date.now(),
        text: text
    });
    inp.value = '';
    saveAll();
    updateNotesBadge();
    renderNotesModal();
}

function deleteNoteItem(noteId) {
    notesData[currentNotesTab] = (notesData[currentNotesTab] || []).filter(n => n.id !== noteId);
    saveAll();
    updateNotesBadge();
    renderNotesModal();
}

/* --- PROFIL & EINSTELLUNGEN (SPRACHE, GEWICHT, ZIEL, BACKUP) --- */
function openProfileModal() {
    document.getElementById('input-username').value = userName;
    document.getElementById('modal-profile').classList.add('open');
    setTimeout(() => document.getElementById('input-username').focus(), 100);
}

function saveUsername() {
    const val = document.getElementById('input-username').value.trim();
    if (val) {
        userName = val;
        document.getElementById('display-username').innerText = userName;
        const setInp = document.getElementById('settings-input-name');
        if (setInp) setInp.value = userName;
        saveAll();
        syncAndLoadLeaderboard();
    }
    closeModals();
}

function renderSettingsView() {
    document.getElementById('settings-input-name').value = userName;
    document.getElementById('settings-input-weight').value = appSettings.bodyWeight || '';
    document.getElementById('settings-select-goal').value = appSettings.goal || 'maintain';
    document.getElementById('settings-select-lang').value = appSettings.language || 'de';
    document.getElementById('settings-input-kcal-goal').value = appSettings.kcalGoal || 2400;
    document.getElementById('settings-input-water-goal').value = appSettings.waterGoalLiters || 3.0;
    document.getElementById('settings-input-apikey').value = geminiApiKey || '';
}

function saveSettingsProfile() {
    const newName = document.getElementById('settings-input-name').value.trim();
    const newWeight = parseFloat(document.getElementById('settings-input-weight').value) || 75.0;
    const newGoal = document.getElementById('settings-select-goal').value;

    if (newName) {
        userName = newName;
        document.getElementById('display-username').innerText = userName;
    }
    appSettings.bodyWeight = newWeight;
    appSettings.goal = newGoal;

    saveAll();
    renderFitTracker();
    alert('Profil & Körperziel erfolgreich gespeichert!');
}

function saveSettingsTargets() {
    appSettings.kcalGoal = parseInt(document.getElementById('settings-input-kcal-goal').value) || 2400;
    appSettings.waterGoalLiters = parseFloat(document.getElementById('settings-input-water-goal').value) || 3.0;
    saveAll();
    renderFitTracker();
    alert('Tagesziele für den FitTracker aktualisiert!');
}

function saveSettingsApiKey() {
    geminiApiKey = document.getElementById('settings-input-apikey').value.trim();
    localStorage.setItem('apexfit_gemini_key', geminiApiKey);
    updateScannerStatusText();
    alert('Dein KI API-Key wurde lokal gespeichert!');
}

function changeAppLanguage(langCode) {
    appSettings.language = langCode || 'de';
    saveAll();
    applyTranslations();
    renderHome();
    renderFitTracker();
}

function applyTranslations() {
    const lang = appSettings.language || 'de';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.de;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerText = dict[key];
        }
    });

    const localeMap = { de: 'de-DE', en: 'en-US', fr: 'fr-FR', es: 'es-ES' };
    const now = new Date();
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    document.getElementById('current-date-label').innerText = 'APEXFIT • ' + now.toLocaleDateString(localeMap[lang] || 'de-DE', options);
}

function exportAppData() {
    const backup = {
        userName,
        appSettings,
        habitCategories,
        habitsList,
        fitnessData,
        journalData,
        nutritionData,
        notesData
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexFit_Backup_${getDateKey(new Date())}.json`;
    a.click();
}

function resetAllAppData() {
    if (confirm('Möchtest du wirklich alle lokalen Daten von ApexFit zurücksetzen?')) {
        localStorage.clear();
        window.location.reload();
    }
}

/* --- SVG GRAPH GENERATOR --- */
function createSmoothSVGChart(labels, values, accentColor, unitSuffix = '') {
    const w = 340;
    const h = 125;
    const padLeft = 24;
    const padRight = 18;
    const padTop = 22;
    const padBottom = 26;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    const maxVal = Math.max(...values, 10);
    const pts = values.map((v, i) => {
        const x = padLeft + (values.length > 1 ? (i / (values.length - 1)) * plotW : plotW / 2);
        const y = padTop + plotH - (v / maxVal) * plotH;
        return { x, y, v, label: labels[i] };
    });

    let pathD = '';
    pts.forEach((p, idx) => {
        pathD += (idx === 0 ? `M ${p.x},${p.y}` : ` L ${p.x},${p.y}`);
    });

    const areaD = `${pathD} L ${pts[pts.length - 1].x},${padTop + plotH} L ${pts[0].x},${padTop + plotH} Z`;
    const gradId = 'grad_' + Math.random().toString(36).substring(2, 7);

    let circlesHTML = '';
    pts.forEach(p => {
        circlesHTML += `
            <circle cx="${p.x}" cy="${p.y}" r="4" fill="${accentColor}" stroke="#fff" stroke-width="1.5" />
            <text x="${p.x}" y="${p.y - 8}" fill="#f5f7fa" font-size="9.5" font-weight="700" text-anchor="middle">${p.v}${unitSuffix}</text>
            <text x="${p.x}" y="${h - 6}" fill="#8e93a4" font-size="9.5" font-weight="600" text-anchor="middle">${p.label}</text>
        `;
    });

    return `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:100%; overflow:visible;">
        <defs>
            <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.38"/>
                <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.0"/>
            </linearGradient>
        </defs>
        <line x1="${padLeft}" y1="${padTop + plotH}" x2="${w - padRight}" y2="${padTop + plotH}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        <path d="${areaD}" fill="url(#${gradId})" />
        <path d="${pathD}" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        ${circlesHTML}
    </svg>`;
}

function toggleHomeGraphs() {
    showHomeGraphs = !showHomeGraphs;
    localStorage.setItem('apexfit_show_graphs', showHomeGraphs);
    renderHome();
}

function calculateStreak(habit) {
    let streak = 0;
    let d = new Date();
    if (!habit.history || !habit.history[getDateKey(d)]) {
        d.setDate(d.getDate() - 1);
    }
    while (habit.history && habit.history[getDateKey(d)]) {
        streak++;
        d.setDate(d.getDate() - 1);
    }
    return streak;
}

/* --- 1. HOME DASHBOARD RENDERN --- */
function renderHome() {
    renderLevelCard();

    const last7 = getLast7Days();
    const tKey = last7[6].key;
    const totalHabits = habitsList.length;

    let doneToday = 0;
    habitsList.forEach(h => {
        if (h.history && h.history[tKey]) doneToday++;
    });
    const dailyPct = totalHabits > 0 ? Math.round((doneToday / totalHabits) * 100) : 0;

    let totalPossibleWeek = totalHabits * 7;
    let doneWeek = 0;
    habitsList.forEach(h => {
        last7.forEach(d => {
            if (h.history && h.history[d.key]) doneWeek++;
        });
    });
    const weeklyPct = totalPossibleWeek > 0 ? Math.round((doneWeek / totalPossibleWeek) * 100) : 0;

    const circumference = 276.46;
    document.getElementById('ring-daily').style.strokeDashoffset = circumference - (dailyPct / 100) * circumference;
    document.getElementById('daily-score-val').innerText = `${dailyPct}%`;
    document.getElementById('daily-score-sub').innerText = `${doneToday} / ${totalHabits} erledigt`;

    document.getElementById('ring-weekly').style.strokeDashoffset = circumference - (weeklyPct / 100) * circumference;
    document.getElementById('weekly-score-val').innerText = `${weeklyPct}%`;
    document.getElementById('weekly-score-sub').innerText = `${doneWeek} Check-ins`;

    const sw = document.getElementById('home-graph-switch');
    const gWrap = document.getElementById('home-graphs-wrapper');
    if (showHomeGraphs) {
        sw.classList.add('on');
        gWrap.style.display = 'block';
        const labels = last7.map(d => d.dayName);
        const xpValues = last7.map(d => {
            let dayXP = 0;
            habitsList.forEach(h => {
                if (h.history && h.history[d.key]) dayXP += Math.min(50, Number(h.xp) || 25);
            });
            journalData.forEach(j => {
                const jDay = j.dateKey || (j.dateISO ? getDateKey(new Date(j.dateISO)) : '');
                if (jDay === d.key && j.exercises) {
                    j.exercises.forEach(ex => { dayXP += (ex.sets ? ex.sets.length : 0) * XP_PER_WORKOUT_SET; });
                }
            });
            return dayXP;
        });
        document.getElementById('home-xp-chart').innerHTML = createSmoothSVGChart(labels, xpValues, '#0a84ff', '');
    } else {
        sw.classList.remove('on');
        gWrap.style.display = 'none';
    }

    // 7-Tage Habit Matrix (Statische Zeilen-Icons ohne Schwebe-Effekt, dezenter Glow beim Haken)
    const matrixContainer = document.getElementById('matrix-container');
    if (habitsList.length === 0) {
        matrixContainer.innerHTML = `<p class="empty-hint">Noch keine Ziele im Reiter „Habits“ angelegt.</p>`;
    } else {
        let tableHTML = `
            <table class="matrix-table">
                <colgroup>
                    <col class="matrix-col-habit">
                    <col class="matrix-col-day"><col class="matrix-col-day"><col class="matrix-col-day">
                    <col class="matrix-col-day"><col class="matrix-col-day"><col class="matrix-col-day"><col class="matrix-col-day">
                </colgroup>
                <thead><tr><th></th>`;
        last7.forEach(d => {
            tableHTML += `
                <th class="matrix-header-day ${d.isToday ? 'is-today' : ''}">
                    ${d.dayName}
                    <span class="matrix-day-num">${d.dayNum}</span>
                </th>`;
        });
        tableHTML += `</tr></thead><tbody>`;

        habitsList.forEach(h => {
            const cat = habitCategories.find(c => c.id === h.catId);
            const dotColor = cat ? cat.color : '#0a84ff';
            const catIcon = cat && cat.icon ? cat.icon : 'fx-bolt';
            const glowCol = getGlowColor(dotColor);
            const dotBorder = getBorderForColor(dotColor);
            const checkTextColor = getContrastText(dotColor);

            tableHTML += `
                <tr class="matrix-row">
                    <td>
                        <div class="matrix-habit-name">
                            ${renderFlexIcon(catIcon, glowCol, 16, false)}
                            <span class="matrix-habit-text">${h.name}</span>
                        </div>
                    </td>`;

            last7.forEach(d => {
                const isDone = h.history && h.history[d.key];
                const doneStyle = isDone ? `background:${dotColor}; border-color:${dotBorder}; color:${checkTextColor}; box-shadow: 0 2px 5px ${dotColor}33;` : '';
                tableHTML += `
                    <td class="matrix-cell">
                        <button class="matrix-dot-btn ${isDone ? 'done' : ''}" style="${doneStyle}" onclick="toggleHabitDate('${h.id}', '${d.key}')">
                            <span class="material-symbols-rounded" style="font-size:15px; font-weight:bold;">check</span>
                        </button>
                    </td>`;
            });

            tableHTML += `</tr>`;
        });

        tableHTML += `</tbody></table>`;
        matrixContainer.innerHTML = tableHTML;
    }

    renderFitnessMatrixAndChart();
}

/* --- 2. HABITS REITER RENDERN --- */
function renderHabits() {
    const container = document.getElementById('habits-categories-container');
    container.innerHTML = '';
    const tKey = getDateKey(new Date());

    if (habitCategories.length === 0) {
        container.innerHTML = `<div class="bevel-card"><p class="empty-hint">Erstelle oben zuerst eine Kategorie.</p></div>`;
        return;
    }

    habitCategories.forEach(cat => {
        const catHabits = habitsList.filter(h => h.catId === cat.id);
        const doneCount = catHabits.filter(h => h.history && h.history[tKey]).length;
        const dotBorder = getBorderForColor(cat.color);
        const checkColor = getContrastText(cat.color);
        const glowCol = getGlowColor(cat.color);
        const cIcon = cat.icon || 'fx-bolt';

        let itemsHTML = '';
        if (catHabits.length === 0) {
            itemsHTML = `<p class="empty-hint">Noch keine Ziele in dieser Kategorie</p>`;
        } else {
            catHabits.forEach(h => {
                const isDone = h.history && h.history[tKey];
                const streak = calculateStreak(h);
                const xpVal = Math.min(50, Number(h.xp) || 25);
                const circleStyle = isDone ? `background:${cat.color}; border-color:${dotBorder}; box-shadow: 0 2px 6px ${cat.color}38;` : '';

                itemsHTML += `
                <div class="habit-item-row ${isDone ? 'completed' : ''}">
                    <div class="habit-left" onclick="toggleHabitDate('${h.id}', '${tKey}')">
                        <div class="check-circle" style="${circleStyle}">
                            ${isDone ? `<span class="material-symbols-rounded" style="font-size:16px; color:${checkColor}; font-weight:bold;">check</span>` : ''}
                        </div>
                        <span class="habit-title">${h.name}</span>
                    </div>
                    <div class="habit-right">
                        <span class="xp-pill">+${xpVal} XP</span>
                        ${streak > 0 ? `<span class="streak-pill">🔥 ${streak}d</span>` : ''}
                        <button class="btn-delete-icon" onclick="deleteHabit('${h.id}')" title="Ziel löschen">
                            <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                        </button>
                    </div>
                </div>`;
            });
        }

        // Das Kategorie-Icon oben links in der Liquid-Card bekommt die Schwebe-Animation (true)
        container.innerHTML += `
        <div class="bevel-card">
            <div class="category-header">
                <div class="category-title-group">
                    ${renderFlexIcon(cIcon, glowCol, 24, true)}
                    <h2 class="category-title">${cat.name}</h2>
                    <span class="badge-count">${doneCount}/${catHabits.length}</span>
                </div>
                <button class="btn-delete-icon" onclick="deleteHabitCategory('${cat.id}')" title="Kategorie löschen">
                    <span class="material-symbols-rounded" style="font-size:19px;">delete</span>
                </button>
            </div>
            <div>${itemsHTML}</div>
        </div>`;
    });
}

function toggleHabitDate(habitId, dateKey) {
    const habit = habitsList.find(h => h.id === habitId);
    if (!habit) return;
    if (!habit.history) habit.history = {};

    if (habit.history[dateKey]) {
        delete habit.history[dateKey];
    } else {
        habit.history[dateKey] = true;
    }
    saveAll();
    renderHome();
    renderHabits();
}

function updateXpPreview(val) {
    document.getElementById('xp-slider-label').innerText = `${val} XP`;
    document.querySelectorAll('.xp-preset-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === `${val} XP`);
    });
}

function setXpPreset(val) {
    document.getElementById('input-habit-xp').value = val;
    updateXpPreview(val);
}

function selectHabitIcon(el) {
    document.querySelectorAll('#habit-icon-picker .icon-option').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    selectedHabitIcon = el.getAttribute('data-icon');
}

function selectHabitColor(el) {
    document.querySelectorAll('#habit-color-picker .color-swatch').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    selectedHabitColor = el.getAttribute('data-color');
}

function openHabitCategoryModal() {
    document.getElementById('input-habit-cat-name').value = '';
    document.getElementById('modal-habit-category').classList.add('open');
    setTimeout(() => document.getElementById('input-habit-cat-name').focus(), 100);
}

function saveHabitCategory() {
    const name = document.getElementById('input-habit-cat-name').value.trim();
    if (!name) return;
    habitCategories.push({
        id: 'hcat_' + Date.now(),
        name: name,
        icon: selectedHabitIcon,
        color: selectedHabitColor
    });
    saveAll();
    renderHabits();
    renderHome();
    closeModals();
}

function deleteHabitCategory(catId) {
    habitCategories = habitCategories.filter(c => c.id !== catId);
    habitsList = habitsList.filter(h => h.catId !== catId);
    saveAll();
    renderHabits();
    renderHome();
}

function openNewHabitModal() {
    if (habitCategories.length === 0) {
        openHabitCategoryModal();
        return;
    }
    document.getElementById('input-habit-name').value = '';
    setXpPreset(25);
    const select = document.getElementById('select-habit-cat');
    select.innerHTML = '';
    habitCategories.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
    document.getElementById('modal-habit-item').classList.add('open');
    setTimeout(() => document.getElementById('input-habit-name').focus(), 100);
}

function saveNewHabit() {
    const name = document.getElementById('input-habit-name').value.trim();
    const catId = document.getElementById('select-habit-cat').value;
    const xpVal = Math.min(50, Math.max(5, parseInt(document.getElementById('input-habit-xp').value) || 25));
    if (!name || !catId) return;

    habitsList.push({
        id: 'hab_' + Date.now(),
        catId: catId,
        name: name,
        xp: xpVal,
        history: {}
    });
    saveAll();
    renderHabits();
    renderHome();
    closeModals();
}

function deleteHabit(habitId) {
    habitsList = habitsList.filter(h => h.id !== habitId);
    saveAll();
    renderHabits();
    renderHome();
}

/* --- 3. FITNESS REITER & FITNESS-MATRIX (AUF HOME) --- */
function selectFitIcon(el) {
    document.querySelectorAll('#fit-icon-picker .icon-option').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    selectedFitIcon = el.getAttribute('data-icon');
}

function selectFitColor(el) {
    document.querySelectorAll('#fit-color-picker .color-swatch').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    selectedFitColor = el.getAttribute('data-color');
}

function renderFitnessMatrixAndChart() {
    const matrixEl = document.getElementById('fitness-matrix-container');
    const chartEl = document.getElementById('fitness-sets-chart');
    if (!matrixEl || !chartEl) return;

    const last7 = getLast7Days();

    if (fitnessData.length === 0) {
        matrixEl.innerHTML = `<p class="empty-hint">Erstelle im Reiter Fitness eine Muskelgruppe, um deine Trainings-Matrix zu sehen.</p>`;
        chartEl.innerHTML = '';
        return;
    }

    let tableHTML = `
        <table class="matrix-table">
            <colgroup>
                <col class="matrix-col-habit">
                <col class="matrix-col-day"><col class="matrix-col-day"><col class="matrix-col-day">
                <col class="matrix-col-day"><col class="matrix-col-day"><col class="matrix-col-day"><col class="matrix-col-day">
            </colgroup>
            <thead><tr><th></th>`;
    last7.forEach(d => {
        tableHTML += `
            <th class="matrix-header-day ${d.isToday ? 'is-today' : ''}">
                ${d.dayName}
                <span class="matrix-day-num">${d.dayNum}</span>
            </th>`;
    });
    tableHTML += `</tr></thead><tbody>`;

    fitnessData.forEach(cat => {
        const cColor = cat.color || '#0a84ff';
        const glowCol = getGlowColor(cColor);
        const cBorder = getBorderForColor(cColor);
        const cText = getContrastText(cColor);
        const cIcon = cat.icon || 'fx-dumbbell';

        tableHTML += `
            <tr class="matrix-row">
                <td>
                    <div class="matrix-habit-name">
                        ${renderFlexIcon(cIcon, glowCol, 16, false)}
                        <span class="matrix-habit-text">${cat.name}</span>
                    </div>
                </td>`;

        last7.forEach(d => {
            let setsCount = 0;
            journalData.forEach(j => {
                const jDay = j.dateKey || (j.dateISO ? getDateKey(new Date(j.dateISO)) : '');
                if (jDay === d.key && j.catName === cat.name && j.exercises) {
                    j.exercises.forEach(ex => { setsCount += (ex.sets ? ex.sets.length : 0); });
                }
            });

            const isTrained = setsCount > 0;
            const cellStyle = isTrained ? `background:${cColor}; border-color:${cBorder}; color:${cText}; box-shadow:0 2px 5px ${cColor}33; font-size:10px; font-weight:800;` : '';

            tableHTML += `
                <td class="matrix-cell">
                    <div class="matrix-dot-btn ${isTrained ? 'done' : ''}" style="${cellStyle}">
                        ${isTrained ? setsCount : ''}
                    </div>
                </td>`;
        });

        tableHTML += `</tr>`;
    });

    tableHTML += `</tbody></table>`;
    matrixEl.innerHTML = tableHTML;

    const labels = last7.map(d => d.dayName);
    const dailySets = last7.map(d => {
        let sTotal = 0;
        journalData.forEach(j => {
            const jDay = j.dateKey || (j.dateISO ? getDateKey(new Date(j.dateISO)) : '');
            if (jDay === d.key && j.exercises) {
                j.exercises.forEach(ex => { sTotal += (ex.sets ? ex.sets.length : 0); });
            }
        });
        return sTotal;
    });

    chartEl.innerHTML = createSmoothSVGChart(labels, dailySets, '#30d158', '');
}

function renderFitness() {
    renderActiveWorkoutBanner();
    renderFitnessMatrixAndChart();

    const container = document.getElementById('fitness-categories-container');
    container.innerHTML = '';

    if (fitnessData.length === 0) {
        container.innerHTML = `
            <div class="bevel-card" style="text-align:center; padding: 35px 20px;">
                <p class="empty-hint">Noch keine Muskelgruppen vorhanden.<br>Tippe oben rechts auf das <b>+</b>.</p>
            </div>`;
        return;
    }

    fitnessData.forEach(cat => {
        const cColor = cat.color || '#0a84ff';
        const cIcon = cat.icon || 'fx-dumbbell';
        const cText = getContrastText(cColor);
        const cBorder = getBorderForColor(cColor);
        const glowCol = getGlowColor(cColor);

        let exercisesHTML = '';
        if (cat.exercises.length === 0) {
            exercisesHTML = `<p class="empty-hint">Keine Übungen eingetragen</p>`;
        } else {
            cat.exercises.forEach(ex => {
                exercisesHTML += `
                <div class="exercise-item">
                    <div class="exercise-top">
                        <span class="exercise-name">${ex.name}</span>
                        <button class="btn-delete-icon" onclick="deleteFitnessExercise('${cat.id}', '${ex.id}')">
                            <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                        </button>
                    </div>
                    <div class="metrics-grid">
                        <div class="metric-box">
                            <span class="metric-label">Sätze</span>
                            <input type="number" class="metric-input" value="${ex.sets}" 
                                onchange="updateFitnessMetric('${cat.id}', '${ex.id}', 'sets', this.value)">
                        </div>
                        <div class="metric-box">
                            <span class="metric-label">Wdh.</span>
                            <input type="number" class="metric-input" value="${ex.reps}" 
                                onchange="updateFitnessMetric('${cat.id}', '${ex.id}', 'reps', this.value)">
                        </div>
                        <div class="metric-box">
                            <span class="metric-label">kg</span>
                            <input type="number" step="0.5" class="metric-input" value="${ex.weight}" 
                                onchange="updateFitnessMetric('${cat.id}', '${ex.id}', 'weight', this.value)">
                        </div>
                    </div>
                </div>`;
            });
        }

        // Das Eck-Icon oben links in der Muskelgruppen-Karte schwebt (true)
        container.innerHTML += `
        <div class="bevel-card">
            <div class="category-header">
                <div class="category-title-group">
                    ${renderFlexIcon(cIcon, glowCol, 25, true)}
                    <h2 class="category-title">${cat.name}</h2>
                    <span class="badge-count">${cat.exercises.length}</span>
                </div>
                <div class="category-actions">
                    <button class="btn-pill" style="background:${cColor}; color:${cText}; border-color:${cBorder};" onclick="openFitnessExerciseModal('${cat.id}')">
                        <span class="material-symbols-rounded" style="font-size:15px;">add</span> Übung
                    </button>
                    <button class="btn-delete-icon" onclick="deleteFitnessCategory('${cat.id}')">
                        <span class="material-symbols-rounded" style="font-size:19px;">delete</span>
                    </button>
                </div>
            </div>
            <div>${exercisesHTML}</div>
        </div>`;
    });
}

/* --- LIVE WORKOUT STARTEN, PAUSEN-TIMER & SÄTZE --- */
function openStartWorkoutModal() {
    const listEl = document.getElementById('start-workout-cat-list');
    listEl.innerHTML = '';

    if (fitnessData.length === 0) {
        listEl.innerHTML = `<p class="empty-hint">Bitte erstelle zuerst mit dem <b>+</b> eine Muskelgruppe und Übungen.</p>`;
    } else {
        fitnessData.forEach(cat => {
            const glowCol = getGlowColor(cat.color);
            listEl.innerHTML += `
            <div class="workout-select-item" onclick="startLiveWorkout('${cat.id}')">
                <div style="display:flex; align-items:center; gap:14px;">
                    ${renderFlexIcon(cat.icon || 'fx-dumbbell', glowCol, 26, false)}
                    <div>
                        <div style="font-size:16px; font-weight:700;">${cat.name}</div>
                        <div style="font-size:12px; color:var(--text-muted);">${cat.exercises.length} Übungen • +50 XP je Satz</div>
                    </div>
                </div>
                <span class="material-symbols-rounded" style="color:var(--accent-green);">play_circle</span>
            </div>`;
        });
    }
    document.getElementById('modal-start-workout').classList.add('open');
}

function startLiveWorkout(catId) {
    const cat = fitnessData.find(c => c.id === catId);
    if (!cat) return;

    const sessionExercises = cat.exercises.map(ex => {
        const count = Math.max(1, parseInt(ex.sets) || 3);
        const setsArr = [];
        for (let i = 0; i < count; i++) {
            setsArr.push({
                setNum: i + 1,
                weight: ex.weight,
                reps: ex.reps,
                done: false
            });
        }
        return {
            exId: ex.id,
            name: ex.name,
            sets: setsArr
        };
    });

    activeWorkout = {
        catId: cat.id,
        catName: cat.name,
        catIcon: cat.icon || 'fx-dumbbell',
        catColor: cat.color || '#0a84ff',
        trainSeconds: 0,
        pauseSeconds: 0,
        isPaused: false,
        exercises: sessionExercises
    };

    closeModals();
    renderFitness();
    startWorkoutStopwatch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startWorkoutStopwatch() {
    if (workoutTimerInterval) clearInterval(workoutTimerInterval);
    workoutTimerInterval = setInterval(() => {
        if (!activeWorkout) return;
        if (activeWorkout.isPaused) {
            activeWorkout.pauseSeconds++;
        } else {
            activeWorkout.trainSeconds++;
        }
        const tEl = document.getElementById('live-workout-timer');
        const pEl = document.getElementById('live-pause-timer');
        if (tEl) tEl.innerText = formatSecondsMMSS(activeWorkout.trainSeconds);
        if (pEl) pEl.innerText = formatSecondsMMSS(activeWorkout.pauseSeconds);
    }, 1000);
}

function toggleWorkoutPauseMode() {
    if (!activeWorkout) return;
    activeWorkout.isPaused = !activeWorkout.isPaused;
    renderActiveWorkoutBanner();
}

function renderActiveWorkoutBanner() {
    const container = document.getElementById('active-workout-container');
    if (!activeWorkout) {
        container.innerHTML = '';
        return;
    }

    let exBlocksHTML = '';
    if (activeWorkout.exercises.length === 0) {
        exBlocksHTML = `<p class="empty-hint">Keine Übungen in dieser Muskelgruppe vorhanden.</p>`;
    } else {
        activeWorkout.exercises.forEach((ex, exIdx) => {
            let setsHTML = '';
            ex.sets.forEach((s, setIdx) => {
                setsHTML += `
                <div class="set-row ${s.done ? 'set-done' : ''}">
                    <button class="set-check-btn" onclick="toggleWorkoutSet(${exIdx}, ${setIdx})" title="Satz abhaken (+50 XP)">
                        <span class="material-symbols-rounded" style="font-size:18px; font-weight:bold;">check</span>
                    </button>
                    <span class="set-num-label">${setIdx + 1}. Satz</span>
                    <div class="set-inline-box">
                        <input type="number" step="0.5" class="set-inline-input" value="${s.weight}" 
                            onchange="updateWorkoutSetValue(${exIdx}, ${setIdx}, 'weight', this.value)">
                        <span class="set-inline-unit">kg</span>
                    </div>
                    <div class="set-inline-box">
                        <input type="number" class="set-inline-input" value="${s.reps}" 
                            onchange="updateWorkoutSetValue(${exIdx}, ${setIdx}, 'reps', this.value)">
                        <span class="set-inline-unit">Wdh</span>
                    </div>
                    <button class="btn-remove-set" onclick="removeWorkoutSet(${exIdx}, ${setIdx})" title="Satz entfernen">
                        <span class="material-symbols-rounded" style="font-size:16px;">remove</span>
                    </button>
                </div>`;
            });

            exBlocksHTML += `
            <div class="exercise-item" style="margin-bottom:14px;">
                <div class="exercise-top">
                    <span class="exercise-name">${ex.name}</span>
                    <button class="btn-pill" style="background:rgba(255,255,255,0.09); color:#fff; font-size:11px; padding:4px 10px;" onclick="addExtraWorkoutSet(${exIdx})">
                        + Satz
                    </button>
                </div>
                <div>${setsHTML}</div>
            </div>`;
        });
    }

    const pauseActiveClass = activeWorkout.isPaused ? 'active-pause' : '';
    const pauseLabel = activeWorkout.isPaused ? 'Pause läuft (Weiter)' : 'Pause starten';

    container.innerHTML = `
    <div class="active-workout-banner">
        <div class="workout-top-bar">
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                <div>
                    <div style="font-size:11px; color:#4ade80; font-weight:800; text-transform:uppercase;">AKTIVES TRAINING • +50 XP/SATZ</div>
                    <h2 style="margin:2px 0 0 0; font-size:21px;">${activeWorkout.catName}</h2>
                </div>
                <button class="btn-delete-icon" onclick="cancelActiveWorkout()" title="Training abbrechen">
                    <span class="material-symbols-rounded" style="color:var(--danger);">close</span>
                </button>
            </div>
            <div class="timers-row">
                <div class="timer-pill">
                    <span class="material-symbols-rounded" style="font-size:16px;">timer</span>
                    <span>Training: <b id="live-workout-timer">${formatSecondsMMSS(activeWorkout.trainSeconds)}</b></span>
                </div>
                <div class="timer-pill pause-pill ${pauseActiveClass}" onclick="toggleWorkoutPauseMode()">
                    <span class="material-symbols-rounded" style="font-size:16px;">${activeWorkout.isPaused ? 'play_arrow' : 'pause_circle'}</span>
                    <span>${pauseLabel}: <b id="live-pause-timer">${formatSecondsMMSS(activeWorkout.pauseSeconds)}</b></span>
                </div>
            </div>
        </div>
        <div>${exBlocksHTML}</div>
        <button class="btn-primary" style="width:100%; margin-top:12px; background:linear-gradient(135deg, #30d158 0%, #1f9d3d 100%);" onclick="finishWorkoutWithCelebration()">
            Training abschließen & XP sichern
        </button>
    </div>`;
}

function toggleWorkoutSet(exIdx, setIdx) {
    if (!activeWorkout) return;
    const s = activeWorkout.exercises[exIdx].sets[setIdx];
    s.done = !s.done;
    renderActiveWorkoutBanner();
}

function updateWorkoutSetValue(exIdx, setIdx, field, val) {
    if (!activeWorkout) return;
    activeWorkout.exercises[exIdx].sets[setIdx][field] = parseFloat(val) || 0;
}

function addExtraWorkoutSet(exIdx) {
    if (!activeWorkout) return;
    const setsArr = activeWorkout.exercises[exIdx].sets;
    const lastSet = setsArr[setsArr.length - 1] || { weight: 50, reps: 10 };
    setsArr.push({
        setNum: setsArr.length + 1,
        weight: lastSet.weight,
        reps: lastSet.reps,
        done: false
    });
    renderActiveWorkoutBanner();
}

function removeWorkoutSet(exIdx, setIdx) {
    if (!activeWorkout) return;
    const setsArr = activeWorkout.exercises[exIdx].sets;
    setsArr.splice(setIdx, 1);
    setsArr.forEach((s, i) => { s.setNum = i + 1; });
    renderActiveWorkoutBanner();
}

function cancelActiveWorkout() {
    if (confirm('Aktuelles Training wirklich ohne Speichern abbrechen?')) {
        activeWorkout = null;
        if (workoutTimerInterval) clearInterval(workoutTimerInterval);
        renderActiveWorkoutBanner();
    }
}

function spawnConfettiParticles() {
    const sheet = document.getElementById('celebration-sheet');
    sheet.querySelectorAll('.confetti-piece').forEach(el => el.remove());
    const colors = ['#30d158', '#0a84ff', '#ffd60a', '#ff375f', '#5e5ce6', '#64d2ff'];
    for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        p.style.left = Math.random() * 94 + 3 + '%';
        p.style.background = colors[i % colors.length];
        p.style.animationDelay = (Math.random() * 0.45) + 's';
        sheet.appendChild(p);
    }
}

function finishWorkoutWithCelebration() {
    if (!activeWorkout) return;
    if (workoutTimerInterval) clearInterval(workoutTimerInterval);

    const trainTimeFormatted = formatSecondsMMSS(activeWorkout.trainSeconds);
    const pauseTimeFormatted = formatSecondsMMSS(activeWorkout.pauseSeconds);
    const durationMins = Math.max(1, Math.round(activeWorkout.trainSeconds / 60));

    let anyChecked = false;
    activeWorkout.exercises.forEach(ex => {
        if (ex.sets.some(s => s.done)) anyChecked = true;
    });

    const loggedExercises = activeWorkout.exercises.map(ex => ({
        name: ex.name,
        sets: anyChecked ? ex.sets.filter(s => s.done) : ex.sets
    })).filter(ex => ex.sets.length > 0);

    let completedSetsCount = 0;
    loggedExercises.forEach(ex => { completedSetsCount += ex.sets.length; });
    const earnedXP = completedSetsCount * XP_PER_WORKOUT_SET;

    journalData.unshift({
        id: 'j_' + Date.now(),
        dateKey: getDateKey(new Date()),
        dateISO: new Date().toISOString(),
        dateFormatted: new Date().toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }),
        catId: activeWorkout.catId,
        catName: activeWorkout.catName,
        catIcon: activeWorkout.catIcon,
        catColor: activeWorkout.catColor,
        duration: durationMins,
        trainTimeStr: trainTimeFormatted,
        pauseTimeStr: pauseTimeFormatted,
        earnedXP: earnedXP,
        exercises: loggedExercises
    });

    const finishedCatName = activeWorkout.catName;
    activeWorkout = null;

    saveAll();
    renderHome();
    renderFitness();
    renderJournal();

    document.getElementById('celeb-cat-subtitle').innerText = `${finishedCatName} erfolgreich abgeschlossen!`;
    document.getElementById('celeb-train-time').innerText = trainTimeFormatted;
    document.getElementById('celeb-pause-time').innerText = pauseTimeFormatted;
    document.getElementById('celeb-xp-earned').innerText = `+${earnedXP} XP`;
    document.getElementById('celeb-sets-count').innerText = `${completedSetsCount} Sätze`;

    document.getElementById('modal-celebrate-workout').classList.add('open');
    spawnConfettiParticles();
}

function closeCelebrationAndOpenJournal() {
    closeModals();
    switchTab('journal', document.getElementById('nav-journal'));
}

function updateFitnessMetric(catId, exId, field, newValue) {
    const category = fitnessData.find(c => c.id === catId);
    if (!category) return;
    const exercise = category.exercises.find(e => e.id === exId);
    if (!exercise) return;
    exercise[field] = parseFloat(newValue) || 0;
    saveAll();
}

function openFitnessCategoryModal() {
    document.getElementById('input-fit-cat-name').value = '';
    document.getElementById('modal-fit-category').classList.add('open');
    setTimeout(() => document.getElementById('input-fit-cat-name').focus(), 100);
}

function saveFitnessCategory() {
    const name = document.getElementById('input-fit-cat-name').value.trim();
    if (!name) return;
    fitnessData.push({
        id: 'cat_' + Date.now(),
        name: name,
        icon: selectedFitIcon,
        color: selectedFitColor,
        exercises: []
    });
    saveAll();
    renderFitness();
    renderHome();
    renderJournal();
    closeModals();
}

function deleteFitnessCategory(catId) {
    fitnessData = fitnessData.filter(c => c.id !== catId);
    saveAll();
    renderFitness();
    renderHome();
    renderJournal();
}

function openFitnessExerciseModal(catId) {
    currentFitCategoryId = catId;
    document.getElementById('input-ex-name').value = '';
    document.getElementById('input-ex-sets').value = '3';
    document.getElementById('input-ex-reps').value = '10';
    document.getElementById('input-ex-weight').value = '50';
    document.getElementById('modal-fit-exercise').classList.add('open');
    setTimeout(() => document.getElementById('input-ex-name').focus(), 100);
}

function saveFitnessExercise() {
    const name = document.getElementById('input-ex-name').value.trim();
    const sets = parseFloat(document.getElementById('input-ex-sets').value) || 0;
    const reps = parseFloat(document.getElementById('input-ex-reps').value) || 0;
    const weight = parseFloat(document.getElementById('input-ex-weight').value) || 0;
    if (!name || !currentFitCategoryId) return;

    const category = fitnessData.find(c => c.id === currentFitCategoryId);
    if (category) {
        category.exercises.push({ id: 'ex_' + Date.now(), name, sets, reps, weight });
        saveAll();
        renderFitness();
    }
    closeModals();
}

function deleteFitnessExercise(catId, exId) {
    const category = fitnessData.find(c => c.id === catId);
    if (!category) return;
    category.exercises = category.exercises.filter(e => e.id !== exId);
    saveAll();
    renderFitness();
}

/* --- 4. JOURNAL REITER RENDERN --- */
function setJournalFilter(filterName) {
    selectedJournalFilter = filterName;
    renderJournal();
}

function renderJournal() {
    const filterBar = document.getElementById('journal-filter-bar');
    const statsContainer = document.getElementById('journal-stats-container');
    const entriesContainer = document.getElementById('journal-entries-container');
    const chartContainer = document.getElementById('journal-progression-chart');

    const muscleNames = new Set();
    fitnessData.forEach(c => muscleNames.add(c.name));
    journalData.forEach(j => muscleNames.add(j.catName));

    let filterHTML = `<div class="filter-chip ${selectedJournalFilter === 'ALL' ? 'active' : ''}" onclick="setJournalFilter('ALL')">Alle Workouts</div>`;
    muscleNames.forEach(mName => {
        const isAct = selectedJournalFilter === mName;
        filterHTML += `<div class="filter-chip ${isAct ? 'active' : ''}" onclick="setJournalFilter('${mName}')">${mName}</div>`;
    });
    filterBar.innerHTML = filterHTML;

    const filtered = selectedJournalFilter === 'ALL'
        ? journalData
        : journalData.filter(j => j.catName === selectedJournalFilter);

    let totalSessions = filtered.length;
    let maxWeight = 0;
    let totalCompletedSets = 0;

    filtered.forEach(entry => {
        entry.exercises.forEach(ex => {
            totalCompletedSets += (ex.sets ? ex.sets.length : 0);
            ex.sets.forEach(s => {
                const w = parseFloat(s.weight) || 0;
                if (w > maxWeight) maxWeight = w;
            });
        });
    });

    const totalWorkoutXP = totalCompletedSets * XP_PER_WORKOUT_SET;

    statsContainer.innerHTML = `
        <div class="journal-stat-box">
            <div class="journal-stat-val">${totalSessions}</div>
            <div class="journal-stat-lbl">Workouts</div>
        </div>
        <div class="journal-stat-box">
            <div class="journal-stat-val">${maxWeight} kg</div>
            <div class="journal-stat-lbl">Max Gewicht</div>
        </div>
        <div class="journal-stat-box">
            <div class="journal-stat-val" style="color:var(--accent-blue);">${totalCompletedSets} Sätze</div>
            <div class="journal-stat-lbl">+${totalWorkoutXP} XP verdient</div>
        </div>
    `;

    const recentSessions = filtered.slice(0, 6).reverse();
    if (recentSessions.length > 0) {
        const cLabels = recentSessions.map(s => s.dateFormatted.split(',')[1]?.trim().slice(0, 6) || 'Tag');
        const cWeights = recentSessions.map(s => {
            let mW = 0;
            s.exercises.forEach(ex => ex.sets.forEach(st => {
                const w = parseFloat(st.weight) || 0;
                if (w > mW) mW = w;
            }));
            return mW;
        });
        chartContainer.innerHTML = createSmoothSVGChart(cLabels, cWeights, '#0a84ff', 'kg');
    } else {
        chartContainer.innerHTML = `<p class="empty-hint" style="padding-top:35px;">Absolviere ein Training für deine Kraft-Kurve.</p>`;
    }

    if (filtered.length === 0) {
        entriesContainer.innerHTML = `
            <div class="bevel-card">
                <p class="empty-hint">
                    Noch keine abgeschlossenen Workouts ${selectedJournalFilter !== 'ALL' ? 'für <b>' + selectedJournalFilter + '</b>' : ''} im Journal.<br>
                    Starte dein nächstes Training oben im Reiter <b>Fitness</b>!
                </p>
            </div>`;
        return;
    }

    let html = '';
    filtered.forEach(entry => {
        const cColor = entry.catColor || '#0a84ff';
        const glowCol = getGlowColor(cColor);

        let entrySetsCount = 0;
        let exListHTML = '';
        entry.exercises.forEach(ex => {
            entrySetsCount += (ex.sets ? ex.sets.length : 0);
            let setsPills = '';
            ex.sets.forEach((s, idx) => {
                setsPills += `<span class="journal-set-tag">${idx + 1}. ${s.weight} kg × ${s.reps}</span>`;
            });
            exListHTML += `
                <div class="journal-ex-block">
                    <div class="journal-ex-title">${ex.name}</div>
                    <div class="journal-set-pills">${setsPills}</div>
                </div>`;
        });

        const xpForEntry = entrySetsCount * XP_PER_WORKOUT_SET;
        const timeInfo = entry.trainTimeStr
            ? `⏱ Training: ${entry.trainTimeStr} • ⏸ Pause: ${entry.pauseTimeStr || '00:00'}`
            : `⏱ ${entry.duration} Min.`;

        // Das Eck-Icon oben links in der Journal-Karte schwebt (true)
        html += `
        <div class="bevel-card">
            <div class="category-header" style="margin-bottom:8px;">
                <div class="category-title-group">
                    ${renderFlexIcon(entry.catIcon || 'fx-dumbbell', glowCol, 25, true)}
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <h2 class="category-title">${entry.catName}</h2>
                            <span class="xp-pill">+${xpForEntry} XP</span>
                        </div>
                        <div style="font-size:11.5px; color:var(--text-muted); margin-top:3px;">
                            ${entry.dateFormatted} • ${timeInfo}
                        </div>
                    </div>
                </div>
                <button class="btn-delete-icon" onclick="deleteJournalEntry('${entry.id}')" title="Eintrag löschen">
                    <span class="material-symbols-rounded" style="font-size:19px;">delete</span>
                </button>
            </div>
            <div class="journal-entry-exercises">${exListHTML}</div>
        </div>`;
    });

    entriesContainer.innerHTML = html;
}

function deleteJournalEntry(entryId) {
    journalData = journalData.filter(j => j.id !== entryId);
    saveAll();
    renderHome();
    renderFitness();
    renderJournal();
}

/* --- 5. FITTRACKER (KI FOTO-SCANNER + WASSER + HISTORY VERGLEICH UNTEN) --- */
function getTodayNutrition() {
    const tKey = getDateKey(new Date());
    if (!nutritionData[tKey]) {
        nutritionData[tKey] = { meals: [], waterMl: 0, waterLogs: [] };
    }
    return nutritionData[tKey];
}

function updateScannerStatusText() {
    const statusEl = document.getElementById('ai-scan-status');
    if (!statusEl) return;
    if (geminiApiKey && geminiApiKey.startsWith('AIza')) {
        statusEl.innerText = 'KI-Scanner bereit • Foto aufnehmen oder auswählen';
        statusEl.style.color = 'var(--text-muted)';
    } else {
        statusEl.innerText = 'Hinweis: Eigenen API-Key oben rechts (🔑) oder in Einstellungen eintragen';
        statusEl.style.color = '#fbbf24';
    }
}

function renderFitTracker() {
    updateScannerStatusText();
    const dayLog = getTodayNutrition();

    let totalKcal = 0;
    let totalPro = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    dayLog.meals.forEach(m => {
        totalKcal += Number(m.kcal) || 0;
        totalPro += Number(m.protein) || 0;
        totalFat += Number(m.fat) || 0;
        totalCarbs += Number(m.carbs) || 0;
    });

    const liters = ((Number(dayLog.waterMl) || 0) / 1000).toFixed(2);
    const goalNames = { cut: 'Abnehmen', maintain: 'Gewicht halten', diet: 'Diät (Defizit)', bulk: 'Muskelaufbau' };

    document.getElementById('daily-total-kcal').innerText = `${Math.round(totalKcal)} kcal`;
    document.getElementById('daily-kcal-target-lbl').innerText = `Ziel: ${appSettings.kcalGoal || 2400} kcal`;

    document.getElementById('daily-total-water').innerText = `${liters} L`;
    document.getElementById('daily-water-target-lbl').innerText = `Ziel: ${Number(appSettings.waterGoalLiters || 3).toFixed(1)} L`;

    const subEl = document.getElementById('tracker-goal-Dynamic-sub');
    if (subEl) {
        subEl.innerText = `Fokus: ${goalNames[appSettings.goal] || 'Fit'} • ${appSettings.bodyWeight || 75} kg`;
    }

    document.getElementById('daily-total-protein').innerText = `${Math.round(totalPro * 10) / 10} g`;
    document.getElementById('daily-total-fat').innerText = `${Math.round(totalFat * 10) / 10} g`;
    document.getElementById('daily-total-carbs').innerText = `${Math.round(totalCarbs * 10) / 10} g`;

    // Gespeicherte Mahlzeiten heute
    const mealsEl = document.getElementById('today-meals-list');
    if (dayLog.meals.length === 0) {
        mealsEl.innerHTML = `<p class="empty-hint" style="padding:4px 0;">Heute noch keine Mahlzeit gespeichert.</p>`;
    } else {
        let mHtml = `<div style="font-size:12px; font-weight:700; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase;">Heutige Mahlzeiten</div>`;
        dayLog.meals.forEach(m => {
            mHtml += `
            <div class="habit-item-row" style="padding:12px 14px;">
                <div>
                    <div style="font-size:14.5px; font-weight:700;">${m.name}</div>
                    <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">
                        🔥 ${m.kcal} kcal • 🥩 ${m.protein}g E • 🥑 ${m.fat}g F • 🌾 ${m.carbs}g KH
                    </div>
                </div>
                <button class="btn-delete-icon" onclick="deleteMealItem('${m.id}')">
                    <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                </button>
            </div>`;
        });
        mealsEl.innerHTML = mHtml;
    }

    // Wasser-Logs heute
    const waterEl = document.getElementById('today-water-logs');
    if (!dayLog.waterLogs || dayLog.waterLogs.length === 0) {
        waterEl.innerHTML = '';
    } else {
        let wHtml = `<div style="display:flex; flex-wrap:wrap; gap:6px;">`;
        dayLog.waterLogs.forEach(w => {
            wHtml += `
            <span class="journal-set-tag" style="display:inline-flex; align-items:center; gap:5px; color:var(--accent-cyan);">
                💧 ${w.label}
                <span class="material-symbols-rounded" style="font-size:14px; cursor:pointer;" onclick="removeWaterLog('${w.id}')">close</span>
            </span>`;
        });
        wHtml += `</div>`;
        waterEl.innerHTML = wHtml;
    }

    if (showTrackerHistory) {
        renderTrackerHistoryCards();
    }
}

/* --- HISTORY VERGLEICH UNTEN IM FITTRACKER (OPTIK WIE TAGESBILANZ OBEN) --- */
function toggleTrackerHistory() {
    showTrackerHistory = !showTrackerHistory;
    const histContainer = document.getElementById('tracker-history-container');
    if (showTrackerHistory) {
        histContainer.style.display = 'block';
        renderTrackerHistoryCards();
    } else {
        histContainer.style.display = 'none';
    }
}

function renderTrackerHistoryCards() {
    const container = document.getElementById('tracker-history-container');
    if (!container) return;

    const allDayKeys = Object.keys(nutritionData).sort((a, b) => b.localeCompare(a));
    if (allDayKeys.length === 0) {
        container.innerHTML = `<div class="bevel-card"><p class="empty-hint">Noch keine vergangenen Tage gespeichert.</p></div>`;
        return;
    }

    let html = '';
    allDayKeys.slice(0, 10).forEach(dKey => {
        const entry = nutritionData[dKey];
        if (!entry) return;

        let kSum = 0, pSum = 0, fSum = 0, cSum = 0;
        (entry.meals || []).forEach(m => {
            kSum += Number(m.kcal) || 0;
            pSum += Number(m.protein) || 0;
            fSum += Number(m.fat) || 0;
            cSum += Number(m.carbs) || 0;
        });
        const wLiters = ((Number(entry.waterMl) || 0) / 1000).toFixed(2);
        const isToday = dKey === getDateKey(new Date());

        const dateParts = dKey.split('-');
        const prettyDate = dateParts.length === 3 ? `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}` : dKey;

        html += `
        <div class="history-day-card">
            <div class="card-title-row" style="margin-bottom:12px;">
                <div>
                    <h3>${isToday ? 'Heute (' + prettyDate + ')' : prettyDate}</h3>
                    <span class="card-subtitle">${(entry.meals || []).length} Mahlzeiten protokolliert</span>
                </div>
                ${renderFlexIcon('fx-nutrition', 'var(--accent-green)', 22, true)}
            </div>

            <div class="tracker-hero-grid">
                <div class="tracker-hero-box">
                    ${renderFlexIcon('fx-flame', 'var(--accent-orange)', 20, true)}
                    <div class="tracker-hero-val">${Math.round(kSum)} kcal</div>
                    <div class="tracker-hero-lbl">Kalorien (${appSettings.kcalGoal || 2400} Ziel)</div>
                </div>
                <div class="tracker-hero-box">
                    ${renderFlexIcon('fx-drop', 'var(--accent-cyan)', 20, true)}
                    <div class="tracker-hero-val" style="color:var(--accent-cyan);">${wLiters} L</div>
                    <div class="tracker-hero-lbl">Wasser (${Number(appSettings.waterGoalLiters || 3).toFixed(1)} L Ziel)</div>
                </div>
            </div>

            <div class="macro-summary-bar">
                <div>
                    <div style="font-size:14px; font-weight:800; color:#30d158;">${Math.round(pSum * 10) / 10} g</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Eiweiß</div>
                </div>
                <div>
                    <div style="font-size:14px; font-weight:800; color:#ff9f0a;">${Math.round(fSum * 10) / 10} g</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Fett</div>
                </div>
                <div>
                    <div style="font-size:14px; font-weight:800; color:#0a84ff;">${Math.round(cSum * 10) / 10} g</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Kohlenhydrate</div>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;
}

function openApiKeyModal() {
    document.getElementById('input-gemini-key').value = geminiApiKey;
    document.getElementById('modal-apikey').classList.add('open');
}

function saveGeminiKey() {
    geminiApiKey = document.getElementById('input-gemini-key').value.trim();
    localStorage.setItem('apexfit_gemini_key', geminiApiKey);
    const setKeyInp = document.getElementById('settings-input-apikey');
    if (setKeyInp) setKeyInp.value = geminiApiKey;
    updateScannerStatusText();
    closeModals();
}

// Komprimiert große Handy-Fotos vor dem Senden an die KI auf max. 800px
function compressImageFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const maxDim = 800;
                let w = img.width;
                let h = img.height;
                if (w > h && w > maxDim) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                } else if (h > maxDim) {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                resolve({
                    dataUrl: compressedDataUrl,
                    base64: compressedDataUrl.split(',')[1],
                    mimeType: 'image/jpeg'
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

async function handleFoodPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('ai-scan-status');
    const previewImg = document.getElementById('food-preview-image');

    statusEl.innerText = '⏳ Bild wird vorbereitet & mit KI analysiert...';
    statusEl.style.color = '#64d2ff';

    const compressed = await compressImageFile(file);
    previewImg.src = compressed.dataUrl;
    previewImg.style.display = 'block';

    if (!geminiApiKey || !geminiApiKey.startsWith('AIza')) {
        statusEl.innerText = '⚠️ Bitte trage oben rechts über das Schlüssel-Symbol (🔑) deinen eigenen Google AI Studio Key (AIzaSy...) ein!';
        statusEl.style.color = '#fbbf24';
        openApiKeyModal();
        return;
    }

    await analyzeFoodImageWithGemini(compressed.base64, compressed.mimeType, file.name);
}

async function analyzeFoodImageWithGemini(base64Data, mimeType, fileName) {
    const statusEl = document.getElementById('ai-scan-status');
    const promptText = 'Analysiere die Mahlzeit auf diesem Foto. Antworte ausschließlich als reines JSON-Objekt ohne Markdown: {"name": "Name des Gerichts auf Deutsch", "kcal": 550, "protein": 35, "fat": 18, "carbs": 55}';

    const requestBody = {
        contents: [{
            parts: [
                { text: promptText },
                { inline_data: { mime_type: mimeType, data: base64Data } }
            ]
        }]
    };

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            document.getElementById('food-input-name').value = parsed.name || 'Mahlzeit';
            document.getElementById('food-input-kcal').value = Math.round(Number(parsed.kcal) || 0);
            document.getElementById('food-input-protein').value = Math.round((Number(parsed.protein) || 0) * 10) / 10;
            document.getElementById('food-input-fat').value = Math.round((Number(parsed.fat) || 0) * 10) / 10;
            document.getElementById('food-input-carbs').value = Math.round((Number(parsed.carbs) || 0) * 10) / 10;

            statusEl.innerText = '✅ KI-Analyse abgeschlossen! Werte untereinander eingetragen.';
            statusEl.style.color = '#30d158';
            return;
        }
        throw new Error('Ungültige KI-Antwort');
    } catch (err) {
        const cleanName = (fileName || 'Mahlzeit').replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        document.getElementById('food-input-name').value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        statusEl.innerText = '⚠️ KI-Anfrage fehlgeschlagen. Prüfe deinen API-Key (AIzaSy...) oder trage die Werte manuell ein.';
        statusEl.style.color = '#ff9f0a';
    }
}

function addMealToDay() {
    const name = document.getElementById('food-input-name').value.trim() || 'Mahlzeit';
    const kcal = parseFloat(document.getElementById('food-input-kcal').value) || 0;
    const protein = parseFloat(document.getElementById('food-input-protein').value) || 0;
    const fat = parseFloat(document.getElementById('food-input-fat').value) || 0;
    const carbs = parseFloat(document.getElementById('food-input-carbs').value) || 0;

    const dayLog = getTodayNutrition();
    dayLog.meals.unshift({
        id: 'meal_' + Date.now(),
        name,
        kcal,
        protein,
        fat,
        carbs
    });

    document.getElementById('food-input-name').value = '';
    document.getElementById('food-input-kcal').value = '0';
    document.getElementById('food-input-protein').value = '0';
    document.getElementById('food-input-fat').value = '0';
    document.getElementById('food-input-carbs').value = '0';
    document.getElementById('food-preview-image').style.display = 'none';
    updateScannerStatusText();

    saveAll();
    renderFitTracker();
}

function deleteMealItem(mealId) {
    const dayLog = getTodayNutrition();
    dayLog.meals = dayLog.meals.filter(m => m.id !== mealId);
    saveAll();
    renderFitTracker();
}

function addWaterAmount(amount, unit) {
    const val = parseFloat(amount) || 0;
    if (val <= 0) return;

    const ml = unit === 'l' ? Math.round(val * 1000) : Math.round(val);
    const label = unit === 'l' ? `${val} L` : `${ml} ml`;

    const dayLog = getTodayNutrition();
    dayLog.waterMl = (Number(dayLog.waterMl) || 0) + ml;
    if (!dayLog.waterLogs) dayLog.waterLogs = [];
    dayLog.waterLogs.push({
        id: 'w_' + Date.now(),
        ml: ml,
        label: label
    });

    saveAll();
    renderFitTracker();
}

function addCustomWater() {
    const val = parseFloat(document.getElementById('water-custom-val').value);
    const unit = document.getElementById('water-custom-unit').value;
    if (!val || val <= 0) return;

    addWaterAmount(val, unit);
    document.getElementById('water-custom-val').value = '';
}

function removeWaterLog(wId) {
    const dayLog = getTodayNutrition();
    const item = (dayLog.waterLogs || []).find(w => w.id === wId);
    if (item) {
        dayLog.waterMl = Math.max(0, (Number(dayLog.waterMl) || 0) - item.ml);
        dayLog.waterLogs = dayLog.waterLogs.filter(w => w.id !== wId);
        saveAll();
        renderFitTracker();
    }
}

/* --- 6. LIVE FIREBASE RANKING & INVITE SYSTEM --- */
async function syncMyProfileToFirebase() {
    const myXP = calculateTotalXP();
    const myLvl = getLevelFromXP(myXP);
    const payload = {
        id: myUserId,
        name: userName,
        xp: myXP,
        level: myLvl,
        rank: getRankTitle(myLvl),
        updatedAt: Date.now()
    };
    try {
        await fetch(`${FIREBASE_DB_URL}/users/${myUserId}/profile.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {}
}

async function linkFriendsInFirebase(friendCode) {
    if (!friendCode || friendCode === myUserId) return;
    if (!friendIds.includes(friendCode)) {
        friendIds.push(friendCode);
        localStorage.setItem('apexfit_friend_ids', JSON.stringify(friendIds));
    }
    try {
        await fetch(`${FIREBASE_DB_URL}/users/${myUserId}/friends/${friendCode}.json`, {
            method: 'PUT',
            body: JSON.stringify(true)
        });
        await fetch(`${FIREBASE_DB_URL}/users/${friendCode}/friends/${myUserId}.json`, {
            method: 'PUT',
            body: JSON.stringify(true)
        });
    } catch (e) {}
}

async function syncAndLoadLeaderboard(showSpinner = false) {
    const statusEl = document.getElementById('lb-sync-status');
    if (showSpinner && statusEl) statusEl.innerText = 'Aktualisiere Live-Daten...';

    await syncMyProfileToFirebase();

    try {
        const friendsRes = await fetch(`${FIREBASE_DB_URL}/users/${myUserId}/friends.json`);
        const remoteFriendsObj = await friendsRes.json();
        if (remoteFriendsObj && typeof remoteFriendsObj === 'object') {
            Object.keys(remoteFriendsObj).forEach(fCode => {
                if (remoteFriendsObj[fCode] && !friendIds.includes(fCode) && fCode !== myUserId) {
                    friendIds.push(fCode);
                }
            });
            localStorage.setItem('apexfit_friend_ids', JSON.stringify(friendIds));
        }

        const players = [
            {
                id: myUserId,
                name: userName,
                xp: calculateTotalXP(),
                isMe: true
            }
        ];

        const fetchPromises = friendIds.map(async (fId) => {
            try {
                const res = await fetch(`${FIREBASE_DB_URL}/users/${fId}/profile.json`);
                const pData = await res.json();
                if (pData && pData.name) {
                    players.push({
                        id: fId,
                        name: pData.name,
                        xp: Number(pData.xp) || 0,
                        isMe: false
                    });
                }
            } catch (err) {}
        });

        await Promise.all(fetchPromises);
        renderLeaderboardDOM(players);

        if (statusEl) {
            const timeStr = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            statusEl.innerText = `Live synchronisiert (${timeStr} Uhr)`;
        }
    } catch (err) {
        renderLeaderboardDOM([
            { id: myUserId, name: userName, xp: calculateTotalXP(), isMe: true }
        ]);
        if (statusEl) statusEl.innerText = 'Offline-Ansicht';
    }
}

function renderLeaderboardDOM(players) {
    const container = document.getElementById('leaderboard-list-container');
    players.sort((a, b) => b.xp - a.xp);

    let html = '';
    players.forEach((p, idx) => {
        const rankNum = idx + 1;
        const lvl = getLevelFromXP(p.xp);
        const rankTitle = getRankTitle(lvl);
        const lvlIcon = getLevelIconInfo(lvl);
        let badgeClass = '';
        if (rankNum === 1) badgeClass = 'lb-rank-1';
        else if (rankNum === 2) badgeClass = 'lb-rank-2';
        else if (rankNum === 3) badgeClass = 'lb-rank-3';

        html += `
        <div class="leaderboard-row ${p.isMe ? 'is-me' : ''}">
            <div class="lb-left">
                <div class="lb-rank-badge ${badgeClass}">${rankNum}</div>
                <div class="lvl-anim-wrapper ${lvlIcon.tierClass}" style="width:26px; height:26px;">
                    <svg viewBox="0 0 24 24" style="width:24px; height:24px;"><use href="#${lvlIcon.icon}"/></svg>
                </div>
                <div class="lb-user-info">
                    <div class="lb-name">
                        <span>${p.name}</span>
                        ${p.isMe ? '<span style="font-size:10px; background:var(--accent-blue); color:#fff; padding:2px 6px; border-radius:8px;">DU</span>' : ''}
                    </div>
                    <div class="lb-sub">Lvl ${lvl} • ${rankTitle}</div>
                </div>
            </div>
            <div class="lb-right">
                <span class="lb-xp-val">${p.xp} XP</span>
                ${!p.isMe ? `<button class="btn-delete-icon" onclick="removeFriendFromLeaderboard('${p.id}')" title="Freund entfernen"><span class="material-symbols-rounded" style="font-size:18px;">close</span></button>` : ''}
            </div>
        </div>`;
    });

    if (players.length === 1) {
        html += `<p class="empty-hint" style="margin-top:10px;">Tippe oben auf <b>„Einladen (Link/Code)“</b>, um Freunde ins Live-Ranking zu holen!</p>`;
    }

    container.innerHTML = html;
}

function openInviteModal() {
    document.getElementById('my-friend-code-display').innerText = myUserId;
    document.getElementById('modal-invite').classList.add('open');
}

function getMyInviteUrl() {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?invite=${encodeURIComponent(myUserId)}`;
}

function copyFriendCode() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(myUserId);
        alert(`Dein Freundes-Code wurde kopiert:\n${myUserId}`);
    } else {
        prompt('Kopiere deinen Freundes-Code:', myUserId);
    }
}

function shareInviteLink() {
    const inviteUrl = getMyInviteUrl();
    if (navigator.share) {
        navigator.share({
            title: 'ApexFit Live-Ranking',
            text: `Füge mich bei ApexFit zum Live-Leaderboard hinzu! Mein Code: ${myUserId}`,
            url: inviteUrl
        }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(inviteUrl);
        alert(`Einladungs-Link kopiert!\nSchicke ihn deinen Freunden:\n${inviteUrl}`);
    } else {
        prompt('Kopiere deinen Einladungs-Link:', inviteUrl);
    }
}

function openAddFriendModal() {
    document.getElementById('input-friend-code').value = '';
    document.getElementById('modal-add-friend').classList.add('open');
    setTimeout(() => document.getElementById('input-friend-code').focus(), 100);
}

function extractFriendCode(rawInput) {
    const trimmed = rawInput.trim();
    if (trimmed.includes('invite=')) {
        try {
            const url = new URL(trimmed);
            const p = url.searchParams.get('invite');
            if (p) return p.toUpperCase().trim();
        } catch (e) {
            const parts = trimmed.split('invite=');
            if (parts[1]) return parts[1].split('&')[0].toUpperCase().trim();
        }
    }
    return trimmed.toUpperCase();
}

async function addFriendByCodeInput() {
    const raw = document.getElementById('input-friend-code').value;
    const code = extractFriendCode(raw);
    if (!code || code === myUserId) {
        alert('Bitte gib einen gültigen Freundes-Code von einem Freund ein.');
        return;
    }
    closeModals();
    await linkFriendsInFirebase(code);
    await syncAndLoadLeaderboard(true);
}

async function removeFriendFromLeaderboard(fId) {
    friendIds = friendIds.filter(id => id !== fId);
    localStorage.setItem('apexfit_friend_ids', JSON.stringify(friendIds));
    try {
        await fetch(`${FIREBASE_DB_URL}/users/${myUserId}/friends/${fId}.json`, { method: 'DELETE' });
    } catch (e) {}
    syncAndLoadLeaderboard(true);
}

async function checkIncomingInviteLink() {
    const params = new URLSearchParams(window.location.search);
    const invitedBy = params.get('invite');
    if (invitedBy) {
        const cleanCode = invitedBy.toUpperCase().trim();
        window.history.replaceState({}, document.title, window.location.pathname);
        if (cleanCode && cleanCode !== myUserId) {
            await linkFriendsInFirebase(cleanCode);
            openTabFromMore('leaderboard');
            alert(`Erfolgreich mit Freund (${cleanCode}) im Live-Ranking verbunden!`);
        }
    }
}

/* --- NAVIGATION & "+ MEHR" MENÜ --- */
function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
}

function openMoreMenuModal() {
    document.getElementById('modal-more-menu').classList.add('open');
}

function openTabFromMore(tabId) {
    closeModals();
    switchTab(tabId, document.getElementById('nav-more'));
}

function switchTab(tabId, element) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById('view-' + tabId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    } else if (tabId === 'fittracker' || tabId === 'leaderboard' || tabId === 'settings') {
        document.getElementById('nav-more').classList.add('active');
    }

    if (tabId === 'leaderboard') {
        syncAndLoadLeaderboard(true);
    } else if (tabId === 'journal') {
        renderJournal();
    } else if (tabId === 'fitness') {
        renderFitness();
    } else if (tabId === 'home') {
        renderHome();
    } else if (tabId === 'fittracker') {
        renderFitTracker();
    } else if (tabId === 'habits') {
        renderHabits();
    } else if (tabId === 'settings') {
        renderSettingsView();
    }
}

setInterval(() => {
    const lbView = document.getElementById('view-leaderboard');
    if (lbView && lbView.classList.contains('active')) {
        syncAndLoadLeaderboard(false);
    }
}, 20000);

/* --- INITIALER APP-START --- */
document.getElementById('display-username').innerText = userName;
injectAdditionalFlexIcons();
checkNotesAutoCleanup();
initPickers();
applyTranslations();
renderHome();
renderFitness();
renderHabits();
renderJournal();
renderFitTracker();
renderSettingsView();
syncAndLoadLeaderboard(false);
checkIncomingInviteLink();