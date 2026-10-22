/* =========================================================
   APEXFIT – APP.JS (LOGIK, FIREBASE, I18N, LVL 100 & AVATARE)
   ========================================================= */

const FIREBASE_DB_URL = "https://apexfit-4c49a-default-rtdb.europe-west1.firebasedatabase.app";
const XP_PER_WORKOUT_SET = 50;
const XP_PER_LEVEL = 250;
const MAX_LEVEL = 100;

/* --- FARBPALETTEN (STANDARD & MONOCHROM WEISS-SCHWARZ TÖNE) --- */
const DEFAULT_COLORS = [
    '#0a84ff', '#30d158', '#5e5ce6', '#ff9f0a',
    '#ff375f', '#64d2ff', '#bf5af2', '#ffd60a',
    '#10b981', '#f43f5e', '#8b5cf6', '#14b8a6',
    '#f97316', '#8e8e93', '#ffffff', '#111216'
];

const MONOCHROME_COLORS = [
    '#ffffff', '#f4f4f5', '#e4e4e7', '#d4d4d8',
    '#bdbdc2', '#a1a1aa', '#8a8a93', '#71717a',
    '#52525b', '#3f3f46', '#2e2e33', '#27272a',
    '#1f1f23', '#18181b', '#121215', '#09090b'
];

/* --- MASSGESCHNEIDERTE SVG-ICONS FÜR FITNESS (GYM, MUSKELN, GERÄTE) & HABITS --- */
const CUSTOM_SVG_ICONS = {
    // 1. Kurzhantel (Dumbbell)
    custom_dumbbell: `<svg viewBox="0 0 24 24"><path d="M20.5 7.5a1 1 0 0 0-1 1v1h-1V6a1.5 1.5 0 0 0-3 0v4.5h-7V6a1.5 1.5 0 0 0-3 0v3.5h-1v-1a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0v-1h1V18a1.5 1.5 0 0 0 3 0v-4.5h7V18a1.5 1.5 0 0 0 3 0v-3.5h1v1a1 1 0 0 0 2 0v-7a1 1 0 0 0-1-1Z"/></svg>`,
    // 2. Langhantel (Barbell)
    custom_barbell: `<svg viewBox="0 0 24 24"><path d="M2 11h2v2H2v-2Zm18 0h2v2h-2v-2ZM5 7h2v10H5V7Zm12 0h2v10h-2V7ZM8 9h1.5v6H8V9Zm6.5 0H16v6h-1.5V9Zm-5 2h5v2h-5v-2Z"/></svg>`,
    // 3. Bizeps / Muskel-Arm
    custom_biceps: `<svg viewBox="0 0 24 24"><path d="M18.5 4.5c-1.7 0-3 1.3-3 3 0 .6.2 1.2.5 1.7l-1.8 1.8c-1.3-1-3.1-1.2-4.6-.3-.8.5-1.4 1.2-1.8 2.1L6 8.5 4.2 10c-.8.7-1.1 1.8-.8 2.8l1.4 4.7c.4 1.3 1.6 2.2 3 2.2h6.7c2.8 0 5-2.2 5-5 0-1.5-.7-2.9-1.8-3.8l1.8-2.2c.6-.3 1-.9 1-1.7 0-1.4-1.1-2.5-2-2.5Z"/></svg>`,
    // 4. Brustmuskel / Torso (Chest)
    custom_chest: `<svg viewBox="0 0 24 24"><path d="M4 5c2.5-1.2 5.2-1.5 8-1.5s5.5.3 8 1.5l1.5 4.5c.3 1-.2 2.1-1.1 2.6l-1.4.7v6.7H5v-6.7l-1.4-.7c-.9-.5-1.4-1.6-1.1-2.6L4 5Zm8 2v5c2.8 0 5-1.2 5.5-3.5L16.5 6c-1.4-.4-3-.5-4.5-.5V7Zm-1.5-1.5c-1.5 0-3.1.1-4.5.5l-1 2.5C5.5 10.8 7.7 12 10.5 12V5.5Z"/></svg>`,
    // 5. Breiter Rücken / V-Taper (Back)
    custom_back: `<svg viewBox="0 0 24 24"><path d="M3 5.5 7.5 3h9L21 5.5l-2.5 8.5-2.5 7H8l-2.5-7L3 5.5Zm8 1.5v11h2V7h-2Zm-4.2 1 1.6 5.5h1.6V8H6.8Zm8.8 0v5.5h1.6L18.8 8h-3.2Z"/></svg>`,
    // 6. Beine / Quadrizeps (Legs)
    custom_legs: `<svg viewBox="0 0 24 24"><path d="M6 3h12l-1 7.5 1.5 6.5-2.5 4h-2.5l-.5-6.5L12 9l-1 5.5L10.5 21H8l-2.5-4L7 10.5 6 3Z"/></svg>`,
    // 7. Laufband (Treadmill)
    custom_treadmill: `<svg viewBox="0 0 24 24"><path d="M19.5 3a1.5 1.5 0 0 0-1.4 1L14.8 14H4a2 2 0 0 0 0 4h14.5a1.5 1.5 0 0 0 1.4-1l2.5-12A1.5 1.5 0 0 0 19.5 3ZM3 20h18v2H3v-2Zm5.5-9.5 2.5-2.5 2 2 2.5-3 1.5 1.2-3.8 4.5-2.2-2.2-1.3 1.3-1.2-1.3Z"/></svg>`,
    // 8. Kettlebell
    custom_kettlebell: `<svg viewBox="0 0 24 24"><path d="M9 3h6a2 2 0 0 1 2 2v2.2A7.5 7.5 0 1 1 7 7.2V5a2 2 0 0 1 2-2Zm0 2v1.3a7.5 7.5 0 0 1 6 0V5H9Zm3 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>`,
    // 9. Kabelzug / Maschine (Cable Pulley)
    custom_cable: `<svg viewBox="0 0 24 24"><path d="M4 2h16v3H4V2Zm7 3h2v6.2l3.8 5.8H14l-2-3.2-2 3.2H7.2L11 11.2V5Zm-5 14h12v3H6v-3Z"/></svg>`,
    // 10. Hantelbank (Bench Press)
    custom_bench: `<svg viewBox="0 0 24 24"><path d="M2 13h20v3H19v5h-2.5v-5h-9v5H5v-5H2v-3Zm4-8h2v6H6V5Zm10 0h2v6h-2V5ZM3 7h18v2H3V7Z"/></svg>`,
    // 11. Sixpack / Core (Abs)
    custom_abs: `<svg viewBox="0 0 24 24"><rect x="6" y="3" width="5" height="4.5" rx="1.5"/><rect x="13" y="3" width="5" height="4.5" rx="1.5"/><rect x="6" y="9.5" width="5" height="4.5" rx="1.5"/><rect x="13" y="9.5" width="5" height="4.5" rx="1.5"/><rect x="6" y="16" width="5" height="4.5" rx="1.5"/><rect x="13" y="16" width="5" height="4.5" rx="1.5"/></svg>`,
    // 12. Eigenes Katzen-Icon (Haustier für Habits)
    custom_cat: `<svg viewBox="0 0 24 24"><path d="M12 5c-1.6 0-3.1.5-4.3 1.4L4.5 3.8A1 1 0 0 0 3 4.6v5.8C2.4 11.5 2 12.7 2 14c0 4.4 4.5 8 10 8s10-3.6 10-8c0-1.3-.4-2.5-1-3.6V4.6a1 1 0 0 0-1.5-.8l-3.2 2.6C15.1 5.5 13.6 5 12 5Zm-3.5 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-3.5 3.2c1.1 0 2 .6 2.4 1.5h-4.8c.4-.9 1.3-1.5 2.4-1.5Z"/></svg>`,
    // 13. Supplement Kapsel / Dose (für Habits)
    custom_supp: `<svg viewBox="0 0 24 24"><path d="M16.2 3.8a4.5 4.5 0 0 0-6.4 0l-6 6a4.5 4.5 0 0 0 6.4 6.4l6-6a4.5 4.5 0 0 0 0-6.4Zm-5 5 2.1-2.1a2.5 2.5 0 0 1 3.6 3.6L14.8 12.4 11.2 8.8ZM19 14a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1Z"/></svg>`
};

/* --- SPEZIELLE FITNESS-ICONS --- */
const FITNESS_ICONS = [
    'custom_dumbbell', 'custom_barbell', 'custom_biceps', 'custom_chest', 'custom_back',
    'custom_legs', 'custom_abs', 'custom_bench', 'custom_cable', 'custom_kettlebell',
    'custom_treadmill', 'fitness_center', 'exercise', 'directions_run', 'pedal_bike',
    'rowing', 'sports_gymnastics', 'sports_mma', 'timer', 'monitoring'
];

/* --- SPEZIELLE HABIT-ICONS --- */
const HABIT_ICONS = [
    'custom_supp', 'medication', 'description', 'format_list_bulleted', 'fact_check',
    'lock', 'folder', 'event_repeat', 'custom_cat', 'pets',
    'backpack', 'bolt', 'local_fire_department', 'water_drop', 'self_improvement',
    'bedtime', 'menu_book', 'code', 'spa', 'custom_dumbbell'
];

function renderIconMarkup(iconKey, sizePx = 22) {
    if (CUSTOM_SVG_ICONS[iconKey]) {
        return `<span style="display:inline-flex; width:${sizePx}px; height:${sizePx}px; align-items:center; justify-content:center;">${CUSTOM_SVG_ICONS[iconKey]}</span>`;
    }
    const cleanName = iconKey ? iconKey.toLowerCase() : 'bolt';
    return `<span class="material-symbols-rounded" style="font-size:${sizePx}px;">${cleanName}</span>`;
}

/* --- 21 EIGENE SEPARATE LEVEL-ICONS MIT INDIVIDUELLEN LOOP-ANIMATIONEN (BIS LVL 100) --- */
const LEVEL_TIERS = [
    { min: 1,   title: 'Rookie',       fx: 'lvl-fx-1',  svg: `<svg viewBox="0 0 36 36"><polygon points="18,4 30,18 18,32 6,18" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="18" cy="18" r="4" fill="currentColor"/></svg>` },
    { min: 5,   title: 'Starter',      fx: 'lvl-fx-2',  svg: `<svg viewBox="0 0 36 36"><path d="M18 3L29 9.5V22.5L18 29L7 22.5V9.5L18 3Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M13 20L18 13L23 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>` },
    { min: 10,  title: 'Striver',      fx: 'lvl-fx-3',  svg: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray="6 3"/><path d="M11 21L18 12L25 21M13 25L18 18L23 25" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>` },
    { min: 15,  title: 'Challenger',   fx: 'lvl-fx-4',  svg: `<svg viewBox="0 0 36 36"><path d="M18 3L31 8V18C31 26 18 33 18 33C18 33 5 26 5 18V8L18 3Z" fill="none" stroke="currentColor" stroke-width="2.4"/><polygon points="18,9 22,18 18,27 14,18" fill="currentColor"/></svg>` },
    { min: 20,  title: 'Hustler',      fx: 'lvl-fx-5',  svg: `<svg viewBox="0 0 36 36"><polygon points="18,2 23,13 34,14 26,22 28,33 18,27 8,33 10,22 2,14 13,13" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="18" cy="18" r="4" fill="currentColor"/></svg>` },
    { min: 25,  title: 'Warrior',      fx: 'lvl-fx-6',  svg: `<svg viewBox="0 0 36 36"><path d="M7 7L29 29M29 7L7 29" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><polygon points="18,4 26,18 18,32 10,18" fill="var(--bg-main)" stroke="currentColor" stroke-width="2.4"/></svg>` },
    { min: 30,  title: 'Vanguard',     fx: 'lvl-fx-7',  svg: `<svg viewBox="0 0 36 36"><polygon points="18,2 33,11 33,25 18,34 3,25 3,11" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M10 14L18 24L26 14M13 10L18 16L23 10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>` },
    { min: 35,  title: 'Spartan',      fx: 'lvl-fx-8',  svg: `<svg viewBox="0 0 36 36"><path d="M8 28L12 10L18 4L24 10L28 28L18 23L8 28Z" fill="none" stroke="currentColor" stroke-width="2.4"/><line x1="18" y1="4" x2="18" y2="23" stroke="currentColor" stroke-width="2.4"/></svg>` },
    { min: 40,  title: 'Gladiator',    fx: 'lvl-fx-9',  svg: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" stroke-width="2.2"/><polygon points="18,5 22,14 31,18 22,22 18,31 14,22 5,18 14,14" fill="currentColor"/></svg>` },
    { min: 45,  title: 'Commander',    fx: 'lvl-fx-10', svg: `<svg viewBox="0 0 36 36"><path d="M4 18L11 7H25L32 18L25 29H11L4 18Z" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M11 22L18 14L25 22M11 16L18 8L25 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>` },
    { min: 50,  title: 'Master',       fx: 'lvl-fx-11', svg: `<svg viewBox="0 0 36 36"><path d="M5 26L8 12L14 18L18 8L22 18L28 12L31 26H5Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><circle cx="18" cy="5" r="2" fill="currentColor"/></svg>` },
    { min: 55,  title: 'Grandmaster',  fx: 'lvl-fx-12', svg: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="8 4"/><polygon points="18,4 28,24 8,24" fill="none" stroke="currentColor" stroke-width="2.2"/><polygon points="18,32 28,12 8,12" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>` },
    { min: 60,  title: 'Titan',        fx: 'lvl-fx-13', svg: `<svg viewBox="0 0 36 36"><polygon points="18,2 32,9 32,27 18,34 4,27 4,9" fill="none" stroke="currentColor" stroke-width="2.5"/><polygon points="18,8 26,18 18,28 10,18" fill="currentColor"/><circle cx="18" cy="18" r="3" fill="var(--bg-main)"/></svg>` },
    { min: 65,  title: 'Immortal',     fx: 'lvl-fx-14', svg: `<svg viewBox="0 0 36 36"><path d="M18 6C11 6 3 12 3 18C3 24 11 30 18 30C25 30 33 24 33 18C33 12 25 6 18 6Z" fill="none" stroke="currentColor" stroke-width="2.4"/><polygon points="18,10 24,18 18,26 12,18" fill="currentColor"/></svg>` },
    { min: 70,  title: 'Olympian',     fx: 'lvl-fx-15', svg: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="7" fill="currentColor"/><path d="M18 2V7M18 29V34M2 18H7M29 18H34M6.7 6.7L10.2 10.2M25.8 25.8L29.3 29.3M29.3 6.7L25.8 10.2M10.2 25.8L6.7 29.3" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>` },
    { min: 75,  title: 'Apex Legend',  fx: 'lvl-fx-16', svg: `<svg viewBox="0 0 36 36"><polygon points="18,2 33,10 33,26 18,34 3,26 3,10" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M9 24L12 13L18 18L24 13L27 24H9Z" fill="currentColor"/><circle cx="18" cy="8" r="2.5" fill="currentColor"/></svg>` },
    // NEU: LEVEL 80 BIS LEVEL 100
    { min: 80,  title: 'Mythic',       fx: 'lvl-fx-17', svg: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5 3"/><polygon points="18,3 23,13 33,18 23,23 18,33 13,23 3,18 13,13" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="18" cy="18" r="4.5" fill="currentColor"/></svg>` },
    { min: 85,  title: 'Astral',       fx: 'lvl-fx-18', svg: `<svg viewBox="0 0 36 36"><polygon points="18,2 22,14 34,18 22,22 18,34 14,22 2,18 14,14" fill="currentColor"/><polygon points="7,7 16,15 29,7 21,16 29,29 18,21 7,29 15,18" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>` },
    { min: 90,  title: 'Celestial',    fx: 'lvl-fx-19', svg: `<svg viewBox="0 0 36 36"><path d="M3 12C8 12 12 16 18 6C24 16 28 12 33 12C31 22 25 29 18 33C11 29 5 22 3 12Z" fill="none" stroke="currentColor" stroke-width="2.4"/><polygon points="18,11 23,20 18,28 13,20" fill="currentColor"/></svg>` },
    { min: 95,  title: 'Eternal',      fx: 'lvl-fx-20', svg: `<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" stroke-width="2.2"/><ellipse cx="18" cy="18" rx="15" ry="6" fill="none" stroke="currentColor" stroke-width="1.8" transform="rotate(45 18 18)"/><ellipse cx="18" cy="18" rx="15" ry="6" fill="none" stroke="currentColor" stroke-width="1.8" transform="rotate(-45 18 18)"/><circle cx="18" cy="18" r="4.5" fill="currentColor"/></svg>` },
    { min: 100, title: 'Apex God',     fx: 'lvl-fx-21', svg: `<svg viewBox="0 0 36 36"><polygon points="18,1 23,11 35,9 27,18 35,27 23,25 18,35 13,25 1,27 9,18 1,9 13,11" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M10 23L13 13L18 17L23 13L26 23H10Z" fill="currentColor"/><circle cx="18" cy="9" r="2.5" fill="currentColor"/></svg>` }
];

function getLevelTierData(level) {
    let chosen = LEVEL_TIERS[0];
    for (const t of LEVEL_TIERS) {
        if (level >= t.min) chosen = t;
    }
    return chosen;
}

function getLevelFromXP(xp) {
    const rawLvl = Math.floor(xp / XP_PER_LEVEL) + 1;
    return Math.min(MAX_LEVEL, rawLvl);
}

/* --- MEHRSPRACHIGKEIT (DE, EN, FR, ES) --- */
const TRANSLATIONS = {
    de: {
        greeting: "Guten Tag",
        daily_focus: "Daily Focus",
        today: "Heute",
        consistency: "Consistency",
        seven_days: "7 Tage",
        show_graphs: "Performance-Graphen anzeigen",
        graphs_sub: "7-Tage XP-Trend & Fitness-Sätze",
        xp_curve_title: "7-Tage XP & Aktivitäts-Kurve",
        habit_matrix_title: "7-Tage Habit Matrix",
        habit_matrix_sub: "Jeder Haken bringt bis zu 50 XP",
        fitness_matrix_title: "7-Tage Fitness-Matrix & Verlauf",
        fitness_matrix_sub: "Absolvierte Sätze pro Muskelgruppe",
        nav_home: "Home",
        nav_fitness: "Fitness",
        nav_habits: "Habits",
        nav_journal: "Journal",
        nav_more: "Mehr",
        nav_ranking: "Ranking",
        nav_settings: "Einstellungen",
        start_workout: "Training starten",
        habits_sub: "Tägliche Ziele (Max. 50 XP)",
        btn_add_category: "+ Kategorie",
        btn_add_goal: "+ Neues Ziel",
        journal_sub: "Fortschritt & Trainings-Zeiten",
        strength_prog_title: "Kraft- & Satz-Entwicklung",
        strength_prog_sub: "Maximalgewicht (kg) der letzten Workouts",
        tracker_sub: "Ernährung, Wasser & Schritte",
        daily_balance: "Heutige Tagesbilanz",
        protein: "Eiweiß",
        fat: "Fett",
        carbs: "Kohlenhydrate",
        food_section_title: "Essen • Mahlzeit eintragen",
        food_section_sub: "Nährwerte direkt untereinander eingeben",
        meal_name: "Mahlzeit",
        calories: "Kalorien",
        btn_save_meal: "+ Mahlzeit zum Tag speichern",
        water_section_title: "Trinken • Wasser hinzufügen",
        water_section_sub: "Schnellauswahl oder Eingabe in ml / Liter",
        steps_section_title: "Schrittzähler • Tägliche Bewegung",
        btn_show_history: "History • Letzte Tagesergebnisse vergleichen",
        btn_invite: "Einladen (Link/Code)",
        btn_add_friend: "+ Freundes-Code",
        settings_profile_title: "Profil & Körperdaten",
        settings_profile_sub: "Name, Profilbild, Gewicht & Fokus-Ziel",
        upload_avatar: "Profilbild hochladen",
        remove_avatar: "Bild entfernen",
        label_username: "Dein Name",
        label_bodyweight: "Körpergewicht (kg)",
        label_fitness_goal: "Dein Ziel",
        goal_lose: "Abnehmen",
        goal_maintain: "Gewicht halten",
        goal_diet: "Diät / Definition",
        goal_muscle: "Muskelaufbau",
        settings_targets_title: "Tagesziele (FitTracker)",
        settings_targets_sub: "Schrittziel, Kalorien- & Wasserbedarf",
        label_step_goal: "Schritte-Ziel",
        label_kcal_goal: "Kalorien (kcal)",
        label_water_goal: "Wasser (Liter)",
        settings_appearance_title: "Design, Effekte & Sprache",
        settings_appearance_sub: "App-Theme, Eigene Farben, Icon-Glow & Sprache",
        label_language: "Sprache / Language",
        label_theme: "App-Design (3 Modi zur Auswahl)",
        label_icon_glow: "Icon Glow-Effekt aktivieren",
        sub_icon_glow: "Leuchtender Schein um Kategorien- & Card-Icons",
        label_auto_pause: "Auto-Pausen-Timer im Gym",
        sub_auto_pause: "Startet die Pause automatisch nach jedem abgehakten Satz",
        settings_backup_title: "Daten & Backup",
        btn_save_settings: "Einstellungen speichern",
        more_menu_title: "Mehr auswählen",
        more_tracker_sub: "Kalorien, Wasser, Schrittzähler & History",
        more_ranking_sub: "Vergleiche Lvl, XP & 7-Tage-History mit Freunden",
        more_settings_sub: "Profilbild, Name, Gewicht, Ziele, Sprache & Design",
        btn_close: "Schließen"
    },
    en: {
        greeting: "Welcome back",
        daily_focus: "Daily Focus",
        today: "Today",
        consistency: "Consistency",
        seven_days: "7 Days",
        show_graphs: "Show Performance Graphs",
        graphs_sub: "7-Day XP Trend & Workout Sets",
        xp_curve_title: "7-Day XP & Activity Curve",
        habit_matrix_title: "7-Day Habit Matrix",
        habit_matrix_sub: "Every check-in grants up to 50 XP",
        fitness_matrix_title: "7-Day Fitness Matrix & Trend",
        fitness_matrix_sub: "Completed sets per muscle group",
        nav_home: "Home",
        nav_fitness: "Fitness",
        nav_habits: "Habits",
        nav_journal: "Journal",
        nav_more: "More",
        nav_ranking: "Ranking",
        nav_settings: "Settings",
        start_workout: "Start Workout",
        habits_sub: "Daily Goals (Max. 50 XP)",
        btn_add_category: "+ Category",
        btn_add_goal: "+ New Goal",
        journal_sub: "Progress & Workout Times",
        strength_prog_title: "Strength & Set Progression",
        strength_prog_sub: "Max weight (kg) of recent workouts",
        tracker_sub: "Nutrition, Water & Steps",
        daily_balance: "Today's Daily Balance",
        protein: "Protein",
        fat: "Fat",
        carbs: "Carbs",
        food_section_title: "Food • Log Meal",
        food_section_sub: "Enter nutrition values stacked below",
        meal_name: "Meal",
        calories: "Calories",
        btn_save_meal: "+ Save Meal to Today",
        water_section_title: "Hydration • Add Water",
        water_section_sub: "Quick buttons or custom ml / Liters",
        steps_section_title: "Step Counter • Daily Activity",
        btn_show_history: "History • Compare Past Daily Results",
        btn_invite: "Invite (Link/Code)",
        btn_add_friend: "+ Friend Code",
        settings_profile_title: "Profile & Body Metrics",
        settings_profile_sub: "Name, Avatar, Bodyweight & Goal",
        upload_avatar: "Upload Avatar",
        remove_avatar: "Remove photo",
        label_username: "Your Name",
        label_bodyweight: "Bodyweight (kg)",
        label_fitness_goal: "Your Goal",
        goal_lose: "Lose Weight",
        goal_maintain: "Maintain Weight",
        goal_diet: "Cut / Diet",
        goal_muscle: "Build Muscle",
        settings_targets_title: "Daily Targets (FitTracker)",
        settings_targets_sub: "Step target, calorie & water goals",
        label_step_goal: "Steps Goal",
        label_kcal_goal: "Calories (kcal)",
        label_water_goal: "Water (Liters)",
        settings_appearance_title: "Design, Effects & Language",
        settings_appearance_sub: "App Theme, Custom Colors, Icon Glow & Language",
        label_language: "Language",
        label_theme: "App Theme (3 Modes)",
        label_icon_glow: "Enable Icon Glow Effect",
        sub_icon_glow: "Glowing aura around category & card icons",
        label_auto_pause: "Auto Rest Timer in Gym",
        sub_auto_pause: "Automatically starts rest timer after checking a set",
        settings_backup_title: "Data & Backup",
        btn_save_settings: "Save Settings",
        more_menu_title: "More Options",
        more_tracker_sub: "Calories, Water, Step Counter & History",
        more_ranking_sub: "Compare Lvl, XP & 7-Day History live",
        more_settings_sub: "Avatar, Name, Weight, Goals, Language & Theme",
        btn_close: "Close"
    },
    fr: {
        greeting: "Bonjour",
        daily_focus: "Focus du Jour",
        today: "Auj.",
        consistency: "Régularité",
        seven_days: "7 Jours",
        show_graphs: "Afficher les graphiques",
        graphs_sub: "Tendance XP & séries sur 7 jours",
        xp_curve_title: "Courbe XP & Activité (7j)",
        habit_matrix_title: "Matrice d'Habitudes (7j)",
        habit_matrix_sub: "Chaque validation rapporte jusqu'à 50 XP",
        fitness_matrix_title: "Matrice Fitness & Séries (7j)",
        fitness_matrix_sub: "Séries complétées par groupe musculaire",
        nav_home: "Accueil",
        nav_fitness: "Fitness",
        nav_habits: "Habitudes",
        nav_journal: "Journal",
        nav_more: "Plus",
        nav_ranking: "Classement",
        nav_settings: "Réglages",
        start_workout: "Démarrer séance",
        habits_sub: "Objectifs quotidiens (Max. 50 XP)",
        btn_add_category: "+ Catégorie",
        btn_add_goal: "+ Objectif",
        journal_sub: "Progrès & Durées d'entraînement",
        strength_prog_title: "Progression Force & Séries",
        strength_prog_sub: "Poids max (kg) des dernières séances",
        tracker_sub: "Nutrition, Eau & Pas",
        daily_balance: "Bilan du Jour",
        protein: "Protéines",
        fat: "Lipides",
        carbs: "Glucides",
        food_section_title: "Repas • Ajouter un plat",
        food_section_sub: "Saisir les valeurs nutritionnelles",
        meal_name: "Repas",
        calories: "Calories",
        btn_save_meal: "+ Enregistrer le repas",
        water_section_title: "Hydratation • Eau",
        water_section_sub: "Ajout rapide ou en ml / Litres",
        steps_section_title: "Podomètre • Pas quotidiens",
        btn_show_history: "Historique • Comparer les derniers jours",
        btn_invite: "Inviter (Lien/Code)",
        btn_add_friend: "+ Code Ami",
        settings_profile_title: "Profil & Corps",
        settings_profile_sub: "Nom, Photo, Poids & Objectif",
        upload_avatar: "Charger une photo",
        remove_avatar: "Supprimer la photo",
        label_username: "Votre Nom",
        label_bodyweight: "Poids corporel (kg)",
        label_fitness_goal: "Objectif",
        goal_lose: "Perdre du poids",
        goal_maintain: "Maintenir le poids",
        goal_diet: "Sèche / Diète",
        goal_muscle: "Prise de masse",
        settings_targets_title: "Objectifs du Jour (FitTracker)",
        settings_targets_sub: "Pas, calories & eau par jour",
        label_step_goal: "Objectif Pas",
        label_kcal_goal: "Calories (kcal)",
        label_water_goal: "Eau (Litres)",
        settings_appearance_title: "Design, Effets & Langue",
        settings_appearance_sub: "Thème, couleurs perso, lueur & langue",
        label_language: "Langue / Language",
        label_theme: "Thème de l'application",
        label_icon_glow: "Effet lumineux des icônes",
        sub_icon_glow: "Aura lumineuse sur les icônes des cartes",
        label_auto_pause: "Minuteur de repos auto",
        sub_auto_pause: "Lance la pause après chaque série validée",
        settings_backup_title: "Données & Sauvegarde",
        btn_save_settings: "Enregistrer les réglages",
        more_menu_title: "Plus d'options",
        more_tracker_sub: "Calories, Eau, Podomètre & Historique",
        more_ranking_sub: "Comparez Lvl, XP & Historique 7j",
        more_settings_sub: "Photo, Nom, Poids, Objectifs, Langue & Thème",
        btn_close: "Fermer"
    },
    es: {
        greeting: "Hola",
        daily_focus: "Enfoque Diario",
        today: "Hoy",
        consistency: "Constancia",
        seven_days: "7 Días",
        show_graphs: "Mostrar gráficos de rendimiento",
        graphs_sub: "Tendencia de XP y series (7 días)",
        xp_curve_title: "Curva de XP y Actividad (7d)",
        habit_matrix_title: "Matriz de Hábitos (7d)",
        habit_matrix_sub: "Cada tarea suma hasta 50 XP",
        fitness_matrix_title: "Matriz de Fitness y Series",
        fitness_matrix_sub: "Series completadas por grupo muscular",
        nav_home: "Inicio",
        nav_fitness: "Fitness",
        nav_habits: "Hábitos",
        nav_journal: "Diario",
        nav_more: "Más",
        nav_ranking: "Ranking",
        nav_settings: "Ajustes",
        start_workout: "Iniciar entreno",
        habits_sub: "Metas diarias (Máx. 50 XP)",
        btn_add_category: "+ Categoría",
        btn_add_goal: "+ Nueva Meta",
        journal_sub: "Progreso y Tiempos de Entreno",
        strength_prog_title: "Progreso de Fuerza y Series",
        strength_prog_sub: "Peso máximo (kg) en últimos entrenos",
        tracker_sub: "Nutrición, Agua y Pasos",
        daily_balance: "Balance Diario de Hoy",
        protein: "Proteína",
        fat: "Grasas",
        carbs: "Carbohidratos",
        food_section_title: "Comida • Registrar plato",
        food_section_sub: "Introduce los valores nutricionales",
        meal_name: "Comida",
        calories: "Calorías",
        btn_save_meal: "+ Guardar comida de hoy",
        water_section_title: "Hidratación • Añadir agua",
        water_section_sub: "Botones rápidos o en ml / Litros",
        steps_section_title: "Podómetro • Pasos diarios",
        btn_show_history: "Historial • Comparar días anteriores",
        btn_invite: "Invitar (Enlace/Código)",
        btn_add_friend: "+ Código Amigo",
        settings_profile_title: "Perfil y Datos Corporales",
        settings_profile_sub: "Nombre, Foto, Peso y Objetivo",
        upload_avatar: "Subir foto de perfil",
        remove_avatar: "Eliminar foto",
        label_username: "Tu Nombre",
        label_bodyweight: "Peso corporal (kg)",
        label_fitness_goal: "Tu Objetivo",
        goal_lose: "Perder peso",
        goal_maintain: "Mantener peso",
        goal_diet: "Definición / Dieta",
        goal_muscle: "Ganar músculo",
        settings_targets_title: "Metas Diarias (FitTracker)",
        settings_targets_sub: "Meta de pasos, calorías y agua",
        label_step_goal: "Meta de Pasos",
        label_kcal_goal: "Calorías (kcal)",
        label_water_goal: "Agua (Litros)",
        settings_appearance_title: "Diseño, Efectos e Idioma",
        settings_appearance_sub: "Tema, colores propios, brillo e idioma",
        label_language: "Idioma / Language",
        label_theme: "Diseño de la App",
        label_icon_glow: "Activar brillo en iconos (Glow)",
        sub_icon_glow: "Efecto luminoso en los iconos de tarjetas",
        label_auto_pause: "Temporizador de descanso auto",
        sub_auto_pause: "Inicia el descanso al completar una serie",
        settings_backup_title: "Datos y Copia de Seguridad",
        btn_save_settings: "Guardar ajustes",
        more_menu_title: "Más opciones",
        more_tracker_sub: "Calorías, Agua, Pasos e Historial",
        more_ranking_sub: "Compara Lvl, XP e Historial 7d",
        more_settings_sub: "Foto, Nombre, Peso, Metas, Idioma y Diseño",
        btn_close: "Cerrar"
    }
};

/* --- KONTRAST-ERKENNUNG (LUMINANZ-BERECHNUNG FÜR JEDE HEX-FARBE) --- */
function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return { r: 10, g: 132, b: 255 };
    let c = hex.replace('#', '').trim();
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    const num = parseInt(c, 16);
    if (isNaN(num)) return { r: 10, g: 132, b: 255 };
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function getContrastText(hex) {
    const { r, g, b } = hexToRgb(hex);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 150) ? '#09090b' : '#ffffff';
}

function getBorderForColor(hex) {
    if (!hex) return 'transparent';
    const { r, g, b } = hexToRgb(hex);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    if (yiq < 40) return 'rgba(255, 255, 255, 0.45)';
    return hex;
}

function getEffectiveIconColor(hex) {
    if (userSettings && userSettings.theme === 'monochrome') {
        return '#ffffff';
    }
    if (userSettings && userSettings.theme === 'custom' && userSettings.customColors) {
        if (!hex) return userSettings.customColors.accent || '#ff375f';
    }
    if (!hex) return '#0a84ff';
    const { r, g, b } = hexToRgb(hex);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    if (yiq < 35) return '#f5f7fa';
    return hex;
}

function formatSecondsMMSS(totalSec) {
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

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
    const lang = (userSettings && userSettings.lang) ? userSettings.lang : 'de';
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

/* --- APP-STATUS & LOCALSTORAGE INITIALISIERUNG --- */
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

let userSettings = JSON.parse(localStorage.getItem('apexfit_settings')) || {
    weight: 75,
    fitnessGoal: 'muscle',
    stepGoal: 10000,
    kcalGoal: 2500,
    waterGoal: 3.0,
    lang: 'de',
    theme: 'default',
    iconGlow: false,
    autoPause: true,
    avatarDataUrl: '',
    customColors: {
        bg: '#12131a',
        card: '#202330',
        accent: '#ff375f',
        text: '#ffffff'
    }
};
if (!userSettings.customColors) {
    userSettings.customColors = { bg: '#12131a', card: '#202330', accent: '#ff375f', text: '#ffffff' };
}

let showHomeGraphs = localStorage.getItem('apexfit_show_graphs') === 'true';
let showTrackerHistory = false;

let habitCategories = JSON.parse(localStorage.getItem('marlii_habit_cats')) || [
    { id: 'hcat_1', name: 'Supplements', color: '#0a84ff', icon: 'custom_supp' },
    { id: 'hcat_2', name: 'Daily Routine & Focus', color: '#30d158', icon: 'event_repeat' }
];
habitCategories.forEach(c => {
    if (!c.icon) c.icon = 'bolt';
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
        icon: 'custom_chest',
        color: '#0a84ff',
        exercises: [
            { id: 'ex_1', name: 'Bankdrücken', sets: 4, reps: 8, weight: 70 },
            { id: 'ex_2', name: 'Butterfly (Kabel)', sets: 3, reps: 12, weight: 25 }
        ]
    },
    {
        id: 'cat_2',
        name: 'Arme',
        icon: 'custom_biceps',
        color: '#5e5ce6',
        exercises: [
            { id: 'ex_3', name: 'Kurzhantel Curls', sets: 3, reps: 10, weight: 16 },
            { id: 'ex_4', name: 'Trizepsdrücken Seil', sets: 3, reps: 12, weight: 27.5 }
        ]
    }
];
fitnessData.forEach(c => {
    if (!c.icon || c.icon === 'fitness_center') c.icon = 'custom_dumbbell';
    if (!c.color) c.color = '#0a84ff';
});

let journalData = JSON.parse(localStorage.getItem('apexfit_journal')) || [];
let friendIds = JSON.parse(localStorage.getItem('apexfit_friend_ids')) || [];

let nutritionData = JSON.parse(localStorage.getItem('apexfit_nutrition')) || {};
if (!nutritionData[todayKey]) {
    nutritionData[todayKey] = { meals: [], waterMl: 0, waterLogs: [], steps: 0, stepsLogs: [] };
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
let editingHabitCategoryId = null;
let selectedHabitColor = '#0a84ff';
let selectedHabitIcon = 'custom_supp';
let selectedFitColor = '#0a84ff';
let selectedFitIcon = 'custom_dumbbell';
let selectedJournalFilter = 'ALL';
let currentSharedCategory = null;

let activeWorkout = null;
let workoutTimerInterval = null;

function saveAll() {
    localStorage.setItem('apexfit_username', userName);
    localStorage.setItem('apexfit_settings', JSON.stringify(userSettings));
    localStorage.setItem('marlii_habit_cats', JSON.stringify(habitCategories));
    localStorage.setItem('marlii_habits_list', JSON.stringify(habitsList));
    localStorage.setItem('marlii_fitness_data', JSON.stringify(fitnessData));
    localStorage.setItem('apexfit_journal', JSON.stringify(journalData));
    localStorage.setItem('apexfit_friend_ids', JSON.stringify(friendIds));
    localStorage.setItem('apexfit_notes', JSON.stringify(notesData));
    localStorage.setItem('apexfit_nutrition', JSON.stringify(nutritionData));
    syncMyProfileToFirebase();
}

/* --- SEPARATE PICKER FÜR FITNESS-ICONS UND HABIT-ICONS --- */
function initPickers() {
    const fitIconContainer = document.getElementById('fit-icon-picker');
    const habitIconContainer = document.getElementById('habit-icon-picker');
    if (!fitIconContainer || !habitIconContainer) return;

    fitIconContainer.innerHTML = '';
    habitIconContainer.innerHTML = '';

    FITNESS_ICONS.forEach((ic, idx) => {
        const isSel = (ic === selectedFitIcon) || (idx === 0 && !FITNESS_ICONS.includes(selectedFitIcon));
        fitIconContainer.innerHTML += `
            <div class="icon-option ${isSel ? 'selected' : ''}" data-icon="${ic}" onclick="selectFitIcon(this)">
                ${renderIconMarkup(ic, 22)}
            </div>`;
    });

    HABIT_ICONS.forEach((ic, idx) => {
        const isSel = (ic === selectedHabitIcon) || (idx === 0 && !HABIT_ICONS.includes(selectedHabitIcon));
        habitIconContainer.innerHTML += `
            <div class="icon-option ${isSel ? 'selected' : ''}" data-icon="${ic}" onclick="selectHabitIcon(this)">
                ${renderIconMarkup(ic, 22)}
            </div>`;
    });

    const palette = (userSettings.theme === 'monochrome') ? MONOCHROME_COLORS : DEFAULT_COLORS;
    if (!palette.includes(selectedFitColor)) selectedFitColor = palette[0];
    if (!palette.includes(selectedHabitColor)) selectedHabitColor = palette[0];

    const fitColorContainer = document.getElementById('fit-color-picker');
    const habitColorContainer = document.getElementById('habit-color-picker');
    fitColorContainer.innerHTML = '';
    habitColorContainer.innerHTML = '';

    palette.forEach((col) => {
        const extraBorder = ['#111216', '#09090b', '#121215'].includes(col) ? 'border-color: rgba(255,255,255,0.45);' : '';
        fitColorContainer.innerHTML += `
            <div class="color-swatch ${col === selectedFitColor ? 'selected' : ''}" data-color="${col}" style="background:${col}; ${extraBorder}" onclick="selectFitColor(this)"></div>`;
        habitColorContainer.innerHTML += `
            <div class="color-swatch ${col === selectedHabitColor ? 'selected' : ''}" data-color="${col}" style="background:${col}; ${extraBorder}" onclick="selectHabitColor(this)"></div>`;
    });
}

/* --- LEVEL & XP BERECHNUNG (BIS LVL 100) --- */
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

function calculateMyDailyXPForDate(dateKey) {
    let dayXP = 0;
    habitsList.forEach(h => {
        if (h.history && h.history[dateKey]) {
            dayXP += Math.min(50, Number(h.xp) || 25);
        }
    });
    journalData.forEach(j => {
        const jDay = j.dateKey || (j.dateISO ? getDateKey(new Date(j.dateISO)) : '');
        if (jDay === dateKey && j.exercises) {
            j.exercises.forEach(ex => {
                dayXP += (ex.sets ? ex.sets.length : 0) * XP_PER_WORKOUT_SET;
            });
        }
    });
    return dayXP;
}

function calculateMyLast7DaysXPMap() {
    const map = {};
    const last7 = getLast7Days();
    last7.forEach(d => {
        map[d.key] = calculateMyDailyXPForDate(d.key);
    });
    return map;
}

function renderLevelCard() {
    const totalXP = calculateTotalXP();
    const currentLevel = getLevelFromXP(totalXP);
    const tierData = getLevelTierData(currentLevel);

    const slotEl = document.getElementById('lvl-unique-icon-slot');
    if (slotEl) {
        slotEl.innerHTML = `<div class="lvl-badge-wrap ${tierData.fx}">${tierData.svg}</div>`;
    }

    document.getElementById('lvl-number').innerText = `Lvl ${currentLevel}`;
    document.getElementById('lvl-rank-title').innerText = `• ${tierData.title}`;
    document.getElementById('total-xp-badge').innerText = `${totalXP} XP`;

    if (currentLevel >= MAX_LEVEL) {
        document.getElementById('lvl-progress-bar').style.width = '100%';
        document.getElementById('lvl-progress-text').innerText = 'MAX LVL 100 ERREICHT';
        document.getElementById('lvl-next-hint').innerText = 'Apex God Status';
    } else {
        const xpIntoLevel = totalXP % XP_PER_LEVEL;
        const xpMissing = XP_PER_LEVEL - xpIntoLevel;
        const pct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);
        const nextMilestoneLvl = Math.min(MAX_LEVEL, Math.floor(currentLevel / 5) * 5 + 5);

        document.getElementById('lvl-progress-bar').style.width = `${pct}%`;
        document.getElementById('lvl-progress-text').innerText = `${xpIntoLevel} / ${XP_PER_LEVEL} XP (${pct}%)`;
        document.getElementById('lvl-next-hint').innerText = `Noch ${xpMissing} XP bis Lvl ${currentLevel + 1} (Rang: Lvl ${nextMilestoneLvl})`;
    }
}

/* --- NOTIZEN SYSTEM --- */
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

/* --- SVG GRAPH GENERATOR --- */
function createSmoothSVGChart(labels, values, accentColor, unitSuffix = '') {
    let chartColor = accentColor;
    if (userSettings.theme === 'monochrome') chartColor = '#ffffff';
    else if (userSettings.theme === 'custom' && userSettings.customColors?.accent) chartColor = userSettings.customColors.accent;

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
            <circle cx="${p.x}" cy="${p.y}" r="4" fill="${chartColor}" stroke="#111" stroke-width="1.5" />
            <text x="${p.x}" y="${p.y - 8}" fill="var(--text-main)" font-size="9.5" font-weight="700" text-anchor="middle">${p.v}${unitSuffix}</text>
            <text x="${p.x}" y="${h - 6}" fill="var(--text-muted)" font-size="9.5" font-weight="600" text-anchor="middle">${p.label}</text>
        `;
    });

    return `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:100%; overflow:visible;">
        <defs>
            <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${chartColor}" stop-opacity="0.42"/>
                <stop offset="100%" stop-color="${chartColor}" stop-opacity="0.0"/>
            </linearGradient>
        </defs>
        <line x1="${padLeft}" y1="${padTop + plotH}" x2="${w - padRight}" y2="${padTop + plotH}" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <path d="${areaD}" fill="url(#${gradId})" />
        <path d="${pathD}" fill="none" stroke="${chartColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
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
    document.getElementById('daily-score-sub').innerText = `${doneToday} / ${totalHabits}`;

    document.getElementById('ring-weekly').style.strokeDashoffset = circumference - (weeklyPct / 100) * circumference;
    document.getElementById('weekly-score-val').innerText = `${weeklyPct}%`;
    document.getElementById('weekly-score-sub').innerText = `${doneWeek} Check-ins`;

    const sw = document.getElementById('home-graph-switch');
    const gWrap = document.getElementById('home-graphs-wrapper');
    if (showHomeGraphs) {
        sw.classList.add('on');
        gWrap.style.display = 'block';
        const labels = last7.map(d => d.dayName);
        const xpValues = last7.map(d => calculateMyDailyXPForDate(d.key));
        document.getElementById('home-xp-chart').innerHTML = createSmoothSVGChart(labels, xpValues, '#0a84ff', '');
    } else {
        sw.classList.remove('on');
        gWrap.style.display = 'none';
    }

    // 7-Tage Habit Matrix: Sortiert nach Kategorien-Reihenfolge
    const matrixContainer = document.getElementById('matrix-container');
    if (habitsList.length === 0) {
        matrixContainer.innerHTML = `<p class="empty-hint">Noch keine Ziele im Reiter „Habits“ angelegt.</p>`;
    } else {
        const orderedHabits = [];
        habitCategories.forEach(cat => {
            const catItems = habitsList.filter(h => h.catId === cat.id);
            orderedHabits.push(...catItems);
        });
        const orphanHabits = habitsList.filter(h => !habitCategories.some(c => c.id === h.catId));
        orderedHabits.push(...orphanHabits);

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

        orderedHabits.forEach(h => {
            const cat = habitCategories.find(c => c.id === h.catId);
            const rawColor = cat ? cat.color : '#0a84ff';
            const dotColor = (userSettings.theme === 'monochrome') ? '#ffffff' : rawColor;
            const catIcon = cat && cat.icon ? cat.icon : 'bolt';
            const iconCol = getEffectiveIconColor(rawColor);
            const dotBorder = getBorderForColor(dotColor);
            const checkTextColor = getContrastText(dotColor);

            tableHTML += `
                <tr class="matrix-row">
                    <td>
                        <div class="matrix-habit-name">
                            <span class="card-corner-icon" style="--icon-color:${iconCol};">
                                ${renderIconMarkup(catIcon, 17)}
                            </span>
                            <span class="matrix-habit-text">${h.name}</span>
                        </div>
                    </td>`;

            last7.forEach(d => {
                const isDone = !!(h.history && h.history[d.key]);
                const doneStyle = isDone
                    ? `background:${dotColor}; border-color:${dotBorder}; color:${checkTextColor};`
                    : '';
                tableHTML += `
                    <td class="matrix-cell">
                        <button class="matrix-dot-btn ${isDone ? 'done' : ''}" style="${doneStyle}" onclick="toggleHabitDate('${h.id}', '${d.key}')">
                            ${isDone ? `<span class="material-symbols-rounded" style="font-size:15px; font-weight:bold; color:${checkTextColor} !important;">check</span>` : ''}
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
        const activeColor = (userSettings.theme === 'monochrome') ? '#ffffff' : cat.color;
        const dotBorder = getBorderForColor(activeColor);
        const checkColor = getContrastText(activeColor);
        const iconCol = getEffectiveIconColor(cat.color);
        const cIcon = cat.icon || 'bolt';

        let itemsHTML = '';
        if (catHabits.length === 0) {
            itemsHTML = `<p class="empty-hint">Noch keine Ziele in dieser Kategorie</p>`;
        } else {
            catHabits.forEach(h => {
                const isDone = !!(h.history && h.history[tKey]);
                const streak = calculateStreak(h);
                const xpVal = Math.min(50, Number(h.xp) || 25);
                const circleStyle = isDone ? `background:${activeColor}; border-color:${dotBorder};` : '';

                itemsHTML += `
                <div class="habit-item-row ${isDone ? 'completed' : ''}">
                    <div class="habit-left" onclick="toggleHabitDate('${h.id}', '${tKey}')">
                        <div class="check-circle" style="${circleStyle}">
                            ${isDone ? `<span class="material-symbols-rounded" style="font-size:16px; color:${checkColor} !important; font-weight:bold;">check</span>` : ''}
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

        container.innerHTML += `
        <div class="bevel-card">
            <div class="category-header">
                <div class="category-title-group">
                    <span class="card-corner-icon floating-card-icon" style="--icon-color:${iconCol};">
                        ${renderIconMarkup(cIcon, 24)}
                    </span>
                    <h2 class="category-title">${cat.name}</h2>
                    <span class="badge-count">${doneCount}/${catHabits.length}</span>
                </div>
                <div class="category-actions">
                    <button class="btn-edit-icon" onclick="openHabitCategoryModal('${cat.id}')" title="Kategorie bearbeiten (Name, Icon, Farbe)">
                        <span class="material-symbols-rounded" style="font-size:19px;">edit</span>
                    </button>
                    <button class="btn-delete-icon" onclick="deleteHabitCategory('${cat.id}')" title="Kategorie löschen">
                        <span class="material-symbols-rounded" style="font-size:19px;">delete</span>
                    </button>
                </div>
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

function openHabitCategoryModal(editCatId = null) {
    editingHabitCategoryId = editCatId;
    const titleEl = document.getElementById('habit-cat-modal-title');
    const saveBtn = document.getElementById('habit-cat-save-btn');
    const nameInput = document.getElementById('input-habit-cat-name');

    if (editCatId) {
        const existingCat = habitCategories.find(c => c.id === editCatId);
        if (existingCat) {
            titleEl.innerText = 'Kategorie bearbeiten';
            saveBtn.innerText = 'Speichern';
            nameInput.value = existingCat.name;
            selectedHabitIcon = existingCat.icon || 'custom_supp';
            selectedHabitColor = existingCat.color || '#0a84ff';
        }
    } else {
        titleEl.innerText = 'Neue Ziel-Kategorie';
        saveBtn.innerText = 'Erstellen';
        nameInput.value = '';
    }

    initPickers();
    document.getElementById('modal-habit-category').classList.add('open');
    setTimeout(() => nameInput.focus(), 100);
}

function saveHabitCategory() {
    const name = document.getElementById('input-habit-cat-name').value.trim();
    if (!name) return;

    if (editingHabitCategoryId) {
        const cat = habitCategories.find(c => c.id === editingHabitCategoryId);
        if (cat) {
            cat.name = name;
            cat.icon = selectedHabitIcon;
            cat.color = selectedHabitColor;
        }
        editingHabitCategoryId = null;
    } else {
        habitCategories.push({
            id: 'hcat_' + Date.now(),
            name: name,
            icon: selectedHabitIcon,
            color: selectedHabitColor
        });
    }

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

/* --- 3. FITNESS REITER, FITNESS-MATRIX & PLÄNE TEILEN --- */
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
        const rawColor = cat.color || '#0a84ff';
        const cColor = (userSettings.theme === 'monochrome') ? '#ffffff' : rawColor;
        const iconCol = getEffectiveIconColor(rawColor);
        const cBorder = getBorderForColor(cColor);
        const cText = getContrastText(cColor);
        const cIcon = cat.icon || 'custom_dumbbell';

        tableHTML += `
            <tr class="matrix-row">
                <td>
                    <div class="matrix-habit-name">
                        <span class="card-corner-icon" style="--icon-color:${iconCol};">
                            ${renderIconMarkup(cIcon, 17)}
                        </span>
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
            const cellStyle = isTrained ? `background:${cColor}; border-color:${cBorder}; color:${cText}; font-size:10px; font-weight:800;` : '';

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
                <p class="empty-hint">Noch keine Muskelgruppen vorhanden.<br>Tippe oben rechts auf das <b>+</b> oder importiere einen Plan.</p>
            </div>`;
        return;
    }

    fitnessData.forEach(cat => {
        const rawColor = cat.color || '#0a84ff';
        const btnColor = (userSettings.theme === 'monochrome') ? '#ffffff' : rawColor;
        const cIcon = cat.icon || 'custom_dumbbell';
        const cText = getContrastText(btnColor);
        const cBorder = getBorderForColor(btnColor);
        const iconCol = getEffectiveIconColor(rawColor);

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

        container.innerHTML += `
        <div class="bevel-card">
            <div class="category-header">
                <div class="category-title-group">
                    <span class="card-corner-icon floating-card-icon" style="--icon-color:${iconCol};">
                        ${renderIconMarkup(cIcon, 25)}
                    </span>
                    <h2 class="category-title">${cat.name}</h2>
                    <span class="badge-count">${cat.exercises.length}</span>
                </div>
                <div class="category-actions">
                    <button class="btn-pill" style="background:${btnColor}; color:${cText}; border-color:${cBorder};" onclick="openFitnessExerciseModal('${cat.id}')">
                        <span class="material-symbols-rounded" style="font-size:15px; color:${cText} !important;">add</span> Übung
                    </button>
                    <button class="btn-share-icon" onclick="openSharePlanModal('${cat.id}')" title="Trainingsplan mit Freunden teilen">
                        <span class="material-symbols-rounded" style="font-size:19px;">share</span>
                    </button>
                    <button class="btn-delete-icon" onclick="deleteFitnessCategory('${cat.id}')" title="Muskelgruppe löschen">
                        <span class="material-symbols-rounded" style="font-size:19px;">delete</span>
                    </button>
                </div>
            </div>
            <div>${exercisesHTML}</div>
        </div>`;
    });
}

/* --- TRAININGSPLÄNE TEILEN & IMPORTIEREN --- */
function encodePlanPayload(catObj) {
    const cleanPlan = {
        name: catObj.name,
        icon: catObj.icon || 'custom_dumbbell',
        color: catObj.color || '#0a84ff',
        exercises: (catObj.exercises || []).map(e => ({
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            weight: e.weight
        }))
    };
    return 'APEXPLAN:' + btoa(encodeURIComponent(JSON.stringify(cleanPlan)));
}

function decodePlanPayload(rawStr) {
    let str = rawStr.trim();
    if (str.includes('plan=')) {
        try {
            const url = new URL(str);
            str = url.searchParams.get('plan') || str;
        } catch (e) {
            const parts = str.split('plan=');
            if (parts[1]) str = decodeURIComponent(parts[1].split('&')[0]);
        }
    }
    if (str.startsWith('APEXPLAN:')) {
        str = str.replace('APEXPLAN:', '');
    }
    const jsonStr = decodeURIComponent(atob(str));
    return JSON.parse(jsonStr);
}

function openSharePlanModal(catId) {
    const cat = fitnessData.find(c => c.id === catId);
    if (!cat) return;
    currentSharedCategory = cat;
    const code = encodePlanPayload(cat);
    document.getElementById('share-plan-modal-title').innerText = `Plan teilen: ${cat.name}`;
    document.getElementById('share-plan-code-output').value = code;
    document.getElementById('modal-share-plan').classList.add('open');
}

function copySharedPlanCode() {
    const code = document.getElementById('share-plan-code-output').value;
    if (!code) return;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code);
        alert('Trainingsplan-Code wurde kopiert! Schicke ihn an deinen Freund.');
    } else {
        prompt('Kopiere diesen Plan-Code:', code);
    }
}

function sharePlanDirectLink() {
    if (!currentSharedCategory) return;
    const code = encodePlanPayload(currentSharedCategory);
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?plan=${encodeURIComponent(code)}`;

    if (navigator.share) {
        navigator.share({
            title: `ApexFit Trainingsplan: ${currentSharedCategory.name}`,
            text: `Importiere meinen Trainingsplan für „${currentSharedCategory.name}“ direkt in ApexFit!`,
            url: shareUrl
        }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        alert(`Direkter Plan-Link kopiert:\n${shareUrl}`);
    } else {
        prompt('Kopiere diesen Plan-Link:', shareUrl);
    }
}

function openImportPlanModal() {
    document.getElementById('input-import-plan-code').value = '';
    document.getElementById('modal-import-plan').classList.add('open');
    setTimeout(() => document.getElementById('input-import-plan-code').focus(), 100);
}

function confirmImportFitnessPlan() {
    const raw = document.getElementById('input-import-plan-code').value;
    if (!raw.trim()) return;
    try {
        const parsed = decodePlanPayload(raw);
        if (!parsed || !parsed.name) throw new Error('Ungültiges Format');

        fitnessData.push({
            id: 'cat_' + Date.now(),
            name: parsed.name,
            icon: parsed.icon || 'custom_dumbbell',
            color: parsed.color || '#0a84ff',
            exercises: (parsed.exercises || []).map((ex, i) => ({
                id: 'ex_' + Date.now() + '_' + i,
                name: ex.name || 'Übung',
                sets: Number(ex.sets) || 3,
                reps: Number(ex.reps) || 10,
                weight: Number(ex.weight) || 50
            }))
        });

        saveAll();
        renderFitness();
        renderHome();
        closeModals();
        alert(`Trainingsplan „${parsed.name}“ erfolgreich hinzugefügt!`);
    } catch (e) {
        alert('Der eingegebene Plan-Code konnte nicht gelesen werden. Bitte prüfe den Code.');
    }
}

/* --- LIVE WORKOUT IM GYM --- */
function openStartWorkoutModal() {
    const listEl = document.getElementById('start-workout-cat-list');
    listEl.innerHTML = '';

    if (fitnessData.length === 0) {
        listEl.innerHTML = `<p class="empty-hint">Bitte erstelle zuerst mit dem <b>+</b> eine Muskelgruppe und Übungen.</p>`;
    } else {
        fitnessData.forEach(cat => {
            const iconCol = getEffectiveIconColor(cat.color);
            listEl.innerHTML += `
            <div class="workout-select-item" onclick="startLiveWorkout('${cat.id}')">
                <div style="display:flex; align-items:center; gap:14px;">
                    <span class="card-corner-icon" style="--icon-color:${iconCol};">
                        ${renderIconMarkup(cat.icon || 'custom_dumbbell', 26)}
                    </span>
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
        catIcon: cat.icon || 'custom_dumbbell',
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
                        <span class="material-symbols-rounded" style="font-size:17px; font-weight:bold;">check</span>
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
                        <span class="material-symbols-rounded" style="font-size:14px;">remove</span>
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

    const trainActiveClass = !activeWorkout.isPaused ? 'active-train' : '';
    const pauseActiveClass = activeWorkout.isPaused ? 'active-pause' : '';
    const pauseLabel = activeWorkout.isPaused ? 'Pause läuft' : 'Pause';

    container.innerHTML = `
    <div class="active-workout-banner">
        <div class="workout-top-bar">
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                <div>
                    <div style="font-size:11px; color:#4ade80; font-weight:800; text-transform:uppercase;">AKTIVES TRAINING</div>
                    <h2 style="margin:2px 0 0 0; font-size:21px;">${activeWorkout.catName}</h2>
                </div>
                <button class="btn-delete-icon" onclick="cancelActiveWorkout()" title="Training abbrechen">
                    <span class="material-symbols-rounded" style="color:var(--danger);">close</span>
                </button>
            </div>
            <div class="timers-row">
                <div class="timer-pill train-pill ${trainActiveClass}" onclick="if(activeWorkout.isPaused) toggleWorkoutPauseMode()" style="cursor:pointer;">
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
        <button class="btn-primary" style="width:100%; margin-top:12px; background:linear-gradient(135deg, #30d158 0%, #1f9d3d 100%) !important; color:#fff !important;" onclick="finishWorkoutWithCelebration()">
            Training abschließen & XP sichern
        </button>
    </div>`;
}

function toggleWorkoutSet(exIdx, setIdx) {
    if (!activeWorkout) return;
    const s = activeWorkout.exercises[exIdx].sets[setIdx];
    s.done = !s.done;
    if (s.done && userSettings.autoPause) {
        activeWorkout.isPaused = true;
    }
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
    initPickers();
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
        const iconCol = getEffectiveIconColor(entry.catColor || '#0a84ff');

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

        html += `
        <div class="bevel-card">
            <div class="category-header" style="margin-bottom:8px;">
                <div class="category-title-group">
                    <span class="card-corner-icon floating-card-icon" style="--icon-color:${iconCol};">
                        ${renderIconMarkup(entry.catIcon || 'custom_dumbbell', 25)}
                    </span>
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

/* --- 5. FITTRACKER --- */
function getTodayNutrition() {
    const tKey = getDateKey(new Date());
    if (!nutritionData[tKey]) {
        nutritionData[tKey] = { meals: [], waterMl: 0, waterLogs: [], steps: 0, stepsLogs: [] };
    }
    if (typeof nutritionData[tKey].steps === 'undefined') nutritionData[tKey].steps = 0;
    if (!Array.isArray(nutritionData[tKey].stepsLogs)) nutritionData[tKey].stepsLogs = [];
    return nutritionData[tKey];
}

function renderFitTracker() {
    const dayLog = getTodayNutrition();

    let totalKcal = 0, totalPro = 0, totalFat = 0, totalCarbs = 0;
    dayLog.meals.forEach(m => {
        totalKcal += Number(m.kcal) || 0;
        totalPro += Number(m.protein) || 0;
        totalFat += Number(m.fat) || 0;
        totalCarbs += Number(m.carbs) || 0;
    });

    const liters = ((Number(dayLog.waterMl) || 0) / 1000).toFixed(2);
    const stepsToday = Number(dayLog.steps) || 0;
    const stepGoal = Number(userSettings.stepGoal) || 10000;
    const kcalGoal = Number(userSettings.kcalGoal) || 2500;
    const waterGoal = Number(userSettings.waterGoal) || 3.0;

    document.getElementById('daily-total-kcal').innerText = `${Math.round(totalKcal)}`;
    document.getElementById('daily-goal-kcal-lbl').innerText = `/ ${kcalGoal} kcal`;

    document.getElementById('daily-total-water').innerText = `${liters} L`;
    document.getElementById('daily-goal-water-lbl').innerText = `/ ${waterGoal.toFixed(1)} L Wasser`;

    document.getElementById('daily-total-steps').innerText = `${stepsToday.toLocaleString('de-DE')}`;
    document.getElementById('daily-goal-steps-lbl').innerText = `/ ${stepGoal.toLocaleString('de-DE')} Schritte`;

    document.getElementById('daily-total-protein').innerText = `${Math.round(totalPro * 10) / 10} g`;
    document.getElementById('daily-total-fat').innerText = `${Math.round(totalFat * 10) / 10} g`;
    document.getElementById('daily-total-carbs').innerText = `${Math.round(totalCarbs * 10) / 10} g`;

    const stepPct = Math.min(100, Math.round((stepsToday / stepGoal) * 100));
    document.getElementById('steps-progress-bar').style.width = `${stepPct}%`;
    document.getElementById('steps-progress-subtitle').innerText = `${stepsToday.toLocaleString('de-DE')} von ${stepGoal.toLocaleString('de-DE')} Schritten (${stepPct}%)`;

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
                        🔥 ${m.kcal} kcal • 🥩 ${m.protein}g E • 💧 ${m.fat}g F • 🌾 ${m.carbs}g KH
                    </div>
                </div>
                <button class="btn-delete-icon" onclick="deleteMealItem('${m.id}')">
                    <span class="material-symbols-rounded" style="font-size:18px;">close</span>
                </button>
            </div>`;
        });
        mealsEl.innerHTML = mHtml;
    }

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

    const stepsEl = document.getElementById('today-steps-logs');
    if (stepsEl) {
        if (!dayLog.stepsLogs || dayLog.stepsLogs.length === 0) {
            stepsEl.innerHTML = '';
        } else {
            let sHtml = `<div style="display:flex; flex-wrap:wrap; gap:6px;">`;
            dayLog.stepsLogs.forEach(s => {
                sHtml += `
                <span class="journal-set-tag" style="display:inline-flex; align-items:center; gap:5px; color:var(--accent-green);">
                    👟 +${Number(s.count).toLocaleString('de-DE')}
                    <span class="material-symbols-rounded" style="font-size:14px; cursor:pointer;" onclick="removeStepLog('${s.id}')" title="Schritte entfernen">close</span>
                </span>`;
            });
            sHtml += `</div>`;
            stepsEl.innerHTML = sHtml;
        }
    }

    if (showTrackerHistory) {
        renderTrackerHistoryCards();
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

/* --- SCHRITTZÄHLER LOGIK --- */
function addStepsAmount(stepsToAdd) {
    const val = parseInt(stepsToAdd) || 0;
    if (val <= 0) return;
    const dayLog = getTodayNutrition();
    dayLog.steps = (Number(dayLog.steps) || 0) + val;
    if (!Array.isArray(dayLog.stepsLogs)) dayLog.stepsLogs = [];
    dayLog.stepsLogs.push({
        id: 'st_' + Date.now(),
        count: val
    });
    saveAll();
    renderFitTracker();
}

function addCustomSteps() {
    const inp = document.getElementById('steps-custom-val');
    const val = parseInt(inp.value) || 0;
    if (val <= 0) return;
    addStepsAmount(val);
    inp.value = '';
}

function setExactSteps() {
    const inp = document.getElementById('steps-custom-val');
    const val = Math.max(0, parseInt(inp.value) || 0);
    const dayLog = getTodayNutrition();
    dayLog.steps = val;
    dayLog.stepsLogs = val > 0 ? [{ id: 'st_' + Date.now(), count: val }] : [];
    inp.value = '';
    saveAll();
    renderFitTracker();
}

function removeStepLog(sId) {
    const dayLog = getTodayNutrition();
    const item = (dayLog.stepsLogs || []).find(s => s.id === sId);
    if (item) {
        dayLog.steps = Math.max(0, (Number(dayLog.steps) || 0) - item.count);
        dayLog.stepsLogs = dayLog.stepsLogs.filter(s => s.id !== sId);
        saveAll();
        renderFitTracker();
    }
}

/* --- FITTRACKER HISTORY --- */
function toggleTrackerHistory() {
    showTrackerHistory = !showTrackerHistory;
    const cont = document.getElementById('tracker-history-container');
    if (showTrackerHistory) {
        cont.style.display = 'block';
        renderTrackerHistoryCards();
    } else {
        cont.style.display = 'none';
    }
}

function deleteTrackerHistoryDay(dateKey) {
    if (!confirm('Diesen Tag aus der FitTracker-History wirklich entfernen?')) return;
    if (dateKey === getDateKey(new Date())) {
        nutritionData[dateKey] = { meals: [], waterMl: 0, waterLogs: [], steps: 0, stepsLogs: [] };
    } else {
        delete nutritionData[dateKey];
    }
    saveAll();
    renderFitTracker();
    renderTrackerHistoryCards();
}

function renderTrackerHistoryCards() {
    const cont = document.getElementById('tracker-history-container');
    const allDateKeys = Object.keys(nutritionData).sort((a, b) => b.localeCompare(a));

    if (allDateKeys.length === 0) {
        cont.innerHTML = `<div class="bevel-card"><p class="empty-hint">Noch keine vergangenen Tage gespeichert.</p></div>`;
        return;
    }

    let html = '';
    allDateKeys.slice(0, 10).forEach(dKey => {
        const dLog = nutritionData[dKey];
        let kcal = 0, pro = 0, fat = 0, carbs = 0;
        (dLog.meals || []).forEach(m => {
            kcal += Number(m.kcal) || 0;
            pro += Number(m.protein) || 0;
            fat += Number(m.fat) || 0;
            carbs += Number(m.carbs) || 0;
        });
        const liters = ((Number(dLog.waterMl) || 0) / 1000).toFixed(2);
        const steps = Number(dLog.steps) || 0;
        const isToday = dKey === getDateKey(new Date());

        const dateObj = new Date(dKey + 'T12:00:00');
        const readableDate = isNaN(dateObj) ? dKey : dateObj.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

        html += `
        <div class="tracker-summary-hero" style="margin-bottom:14px;">
            <div class="card-title-row" style="margin-bottom:12px;">
                <div>
                    <h3>${isToday ? 'Heute (' + readableDate + ')' : readableDate}</h3>
                    <span class="card-subtitle">${(dLog.meals || []).length} Mahlzeiten protokolliert</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="card-corner-icon floating-card-icon" style="--icon-color: var(--accent-blue);">
                        <span class="material-symbols-rounded">calendar_today</span>
                    </span>
                    <button class="btn-delete-icon" onclick="deleteTrackerHistoryDay('${dKey}')" title="Tag aus History löschen">
                        <span class="material-symbols-rounded" style="font-size:19px;">delete</span>
                    </button>
                </div>
            </div>

            <div class="tracker-hero-grid-3">
                <div class="tracker-hero-box">
                    <span class="card-corner-icon floating-card-icon" style="--icon-color: var(--accent-orange);">
                        <span class="material-symbols-rounded">local_fire_department</span>
                    </span>
                    <div class="tracker-hero-val">${Math.round(kcal)}</div>
                    <div class="tracker-hero-lbl">kcal</div>
                </div>
                <div class="tracker-hero-box">
                    <span class="card-corner-icon floating-card-icon" style="--icon-color: var(--accent-cyan);">
                        <span class="material-symbols-rounded">water_drop</span>
                    </span>
                    <div class="tracker-hero-val" style="color:var(--accent-cyan);">${liters} L</div>
                    <div class="tracker-hero-lbl">Wasser</div>
                </div>
                <div class="tracker-hero-box">
                    <span class="card-corner-icon floating-card-icon" style="--icon-color: var(--accent-green);">
                        <span class="material-symbols-rounded">footprint</span>
                    </span>
                    <div class="tracker-hero-val" style="color:var(--accent-green);">${steps.toLocaleString('de-DE')}</div>
                    <div class="tracker-hero-lbl">Schritte</div>
                </div>
            </div>

            <div class="macro-summary-bar">
                <div>
                    <div style="font-size:14px; font-weight:800; color:var(--accent-green);">${Math.round(pro * 10) / 10} g</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Eiweiß</div>
                </div>
                <div>
                    <div style="font-size:14px; font-weight:800; color:var(--accent-orange);">${Math.round(fat * 10) / 10} g</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Fett</div>
                </div>
                <div>
                    <div style="font-size:14px; font-weight:800; color:var(--accent-blue);">${Math.round(carbs * 10) / 10} g</div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Kohlenhydrate</div>
                </div>
            </div>
        </div>`;
    });

    cont.innerHTML = html;
}

/* --- 6. EINSTELLUNGEN & ALLE BENUTZER-AVATARE SYNCHRONISIEREN --- */
function applyCustomThemeCSSVars() {
    const rootStyle = document.documentElement.style;
    if (userSettings.theme === 'custom' && userSettings.customColors) {
        const c = userSettings.customColors;
        const rgbCard = hexToRgb(c.card);
        const rgbBg = hexToRgb(c.bg);
        const btnContrast = getContrastText(c.accent);

        rootStyle.setProperty('--bg-main', c.bg);
        rootStyle.setProperty('--bg-secondary', c.card);
        rootStyle.setProperty('--liquid-bg', `linear-gradient(135deg, rgba(${rgbCard.r}, ${rgbCard.g}, ${rgbCard.b}, 0.88) 0%, rgba(${rgbBg.r}, ${rgbBg.g}, ${rgbBg.b}, 0.92) 100%)`);
        rootStyle.setProperty('--liquid-inner', `rgba(${rgbBg.r}, ${rgbBg.g}, ${rgbBg.b}, 0.65)`);
        rootStyle.setProperty('--accent-blue', c.accent);
        rootStyle.setProperty('--text-main', c.text);
        rootStyle.setProperty('--btn-primary-text', btnContrast);
        rootStyle.setProperty('--header-bg', `rgba(${rgbBg.r}, ${rgbBg.g}, ${rgbBg.b}, 0.80)`);
        rootStyle.setProperty('--dock-bg', `rgba(${rgbCard.r}, ${rgbCard.g}, ${rgbCard.b}, 0.90)`);
        rootStyle.setProperty('--sheet-bg', `linear-gradient(160deg, ${c.card} 0%, ${c.bg} 100%)`);
    } else {
        ['--bg-main', '--bg-secondary', '--liquid-bg', '--liquid-inner', '--accent-blue', '--text-main', '--btn-primary-text', '--header-bg', '--dock-bg', '--sheet-bg'].forEach(prop => {
            rootStyle.removeProperty(prop);
        });
    }

    if (userSettings.customColors) {
        const dBg = document.getElementById('preview-dot-custom-bg');
        const dCard = document.getElementById('preview-dot-custom-card');
        const dAcc = document.getElementById('preview-dot-custom-acc');
        if (dBg) dBg.style.background = userSettings.customColors.bg;
        if (dCard) dCard.style.background = userSettings.customColors.card;
        if (dAcc) dAcc.style.background = userSettings.customColors.accent;
    }
}

function updateCustomThemeColors() {
    userSettings.customColors = {
        bg: document.getElementById('custom-col-bg').value,
        card: document.getElementById('custom-col-card').value,
        accent: document.getElementById('custom-col-accent').value,
        text: document.getElementById('custom-col-text').value
    };
    saveAll();
    applyVisualSettings();
    renderHome();
    renderFitness();
    renderHabits();
    renderJournal();
    renderFitTracker();
}

function applyVisualSettings() {
    document.documentElement.setAttribute('data-theme', userSettings.theme || 'default');
    document.documentElement.setAttribute('data-glow', userSettings.iconGlow ? 'on' : 'off');
    applyCustomThemeCSSVars();

    document.getElementById('display-username').innerText = userName;

    // Alle Benutzer-Avatare im Header (Home, Habits, Journal, FitTracker) sowie in Einstellungen synchronisieren
    const allSyncImgs = document.querySelectorAll('.user-avatar-sync-img');
    const allSyncIcons = document.querySelectorAll('.user-avatar-sync-icon');
    const settingsImg = document.getElementById('settings-avatar-img');
    const settingsIcon = document.getElementById('settings-avatar-icon');

    if (userSettings.avatarDataUrl) {
        allSyncImgs.forEach(img => {
            img.src = userSettings.avatarDataUrl;
            img.style.display = 'block';
        });
        allSyncIcons.forEach(ic => {
            ic.style.display = 'none';
        });
        if (settingsImg) {
            settingsImg.src = userSettings.avatarDataUrl;
            settingsImg.style.display = 'block';
        }
        if (settingsIcon) settingsIcon.style.display = 'none';
    } else {
        allSyncImgs.forEach(img => {
            img.style.display = 'none';
        });
        allSyncIcons.forEach(ic => {
            ic.style.display = 'block';
        });
        if (settingsImg) settingsImg.style.display = 'none';
        if (settingsIcon) settingsIcon.style.display = 'block';
    }

    applyTranslations(userSettings.lang || 'de');
    initPickers();
}

function renderSettingsView() {
    document.getElementById('settings-input-name').value = userName;
    document.getElementById('settings-input-weight').value = userSettings.weight || 75;
    document.getElementById('settings-select-goal').value = userSettings.fitnessGoal || 'muscle';
    document.getElementById('settings-input-step-goal').value = userSettings.stepGoal || 10000;
    document.getElementById('settings-input-kcal-goal').value = userSettings.kcalGoal || 2500;
    document.getElementById('settings-input-water-goal').value = userSettings.waterGoal || 3.0;
    document.getElementById('settings-select-lang').value = userSettings.lang || 'de';

    document.getElementById('theme-card-default').classList.toggle('active', userSettings.theme === 'default');
    document.getElementById('theme-card-monochrome').classList.toggle('active', userSettings.theme === 'monochrome');
    document.getElementById('theme-card-custom').classList.toggle('active', userSettings.theme === 'custom');

    const customEditor = document.getElementById('custom-theme-editor');
    if (customEditor) {
        customEditor.style.display = (userSettings.theme === 'custom') ? 'block' : 'none';
        if (userSettings.customColors) {
            document.getElementById('custom-col-bg').value = userSettings.customColors.bg || '#12131a';
            document.getElementById('custom-col-card').value = userSettings.customColors.card || '#202330';
            document.getElementById('custom-col-accent').value = userSettings.customColors.accent || '#ff375f';
            document.getElementById('custom-col-text').value = userSettings.customColors.text || '#ffffff';
        }
    }

    document.getElementById('settings-glow-switch').classList.toggle('on', !!userSettings.iconGlow);
    document.getElementById('settings-autopause-switch').classList.toggle('on', !!userSettings.autoPause);
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxDim = 180;
            let w = img.width;
            let h = img.height;
            if (w > h) {
                if (w > maxDim) { h = Math.round(h * (maxDim / w)); w = maxDim; }
            } else {
                if (h > maxDim) { w = Math.round(w * (maxDim / h)); h = maxDim; }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            userSettings.avatarDataUrl = canvas.toDataURL('image/jpeg', 0.80);
            saveAll();
            applyVisualSettings();
            syncAndLoadLeaderboard(false);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function removeAvatarImage() {
    userSettings.avatarDataUrl = '';
    saveAll();
    applyVisualSettings();
    syncAndLoadLeaderboard(false);
}

function selectAppTheme(themeName) {
    userSettings.theme = themeName;
    saveAll();
    applyVisualSettings();
    renderSettingsView();
    renderHome();
    renderFitness();
    renderHabits();
    renderJournal();
    renderFitTracker();
}

function toggleIconGlowSetting() {
    userSettings.iconGlow = !userSettings.iconGlow;
    saveAll();
    applyVisualSettings();
    renderSettingsView();
}

function toggleAutoPauseSetting() {
    userSettings.autoPause = !userSettings.autoPause;
    saveAll();
    renderSettingsView();
}

function changeAppLanguage(langCode) {
    userSettings.lang = langCode;
    saveAll();
    applyTranslations(langCode);
    renderHome();
}

function applyTranslations(langCode) {
    const dict = TRANSLATIONS[langCode] || TRANSLATIONS.de;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerText = dict[key];
        }
    });

    const now = new Date();
    const localeMap = { de: 'de-DE', en: 'en-US', fr: 'fr-FR', es: 'es-ES' };
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const dateLabel = document.getElementById('current-date-label');
    if (dateLabel) {
        dateLabel.innerText = 'APEXFIT • ' + now.toLocaleDateString(localeMap[langCode] || 'de-DE', options);
    }
}

function saveAllSettings() {
    const newName = document.getElementById('settings-input-name').value.trim();
    if (newName) userName = newName;

    userSettings.weight = parseFloat(document.getElementById('settings-input-weight').value) || 75;
    userSettings.fitnessGoal = document.getElementById('settings-select-goal').value || 'muscle';
    userSettings.stepGoal = Math.max(500, parseInt(document.getElementById('settings-input-step-goal').value) || 10000);
    userSettings.kcalGoal = Math.max(500, parseInt(document.getElementById('settings-input-kcal-goal').value) || 2500);
    userSettings.waterGoal = Math.max(0.5, parseFloat(document.getElementById('settings-input-water-goal').value) || 3.0);
    userSettings.lang = document.getElementById('settings-select-lang').value || 'de';

    saveAll();
    applyVisualSettings();
    renderHome();
    renderFitTracker();
    alert('Deine Einstellungen wurden gespeichert!');
}

function exportBackupJSON() {
    const backupObj = {
        userName,
        userSettings,
        habitCategories,
        habitsList,
        fitnessData,
        journalData,
        nutritionData,
        notesData
    };
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexFit_Backup_${getDateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importBackupJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.userName) userName = data.userName;
            if (data.userSettings) userSettings = { ...userSettings, ...data.userSettings };
            if (data.habitCategories) habitCategories = data.habitCategories;
            if (data.habitsList) habitsList = data.habitsList;
            if (data.fitnessData) fitnessData = data.fitnessData;
            if (data.journalData) journalData = data.journalData;
            if (data.nutritionData) nutritionData = data.nutritionData;
            if (data.notesData) notesData = data.notesData;

            saveAll();
            applyVisualSettings();
            renderSettingsView();
            renderHome();
            renderFitness();
            renderHabits();
            renderJournal();
            renderFitTracker();
            alert('Backup erfolgreich wiederhergestellt!');
        } catch (err) {
            alert('Ungültige Backup-Datei.');
        }
    };
    reader.readAsText(file);
}

/* --- 7. LIVE FIREBASE RANKING (MIT ECHTEN PROFILBILDERN / AVATAREN & 7-TAGE XP-HISTORY) --- */
async function syncMyProfileToFirebase() {
    const myXP = calculateTotalXP();
    const myLvl = getLevelFromXP(myXP);
    const tierData = getLevelTierData(myLvl);
    const payload = {
        id: myUserId,
        name: userName,
        xp: myXP,
        level: myLvl,
        rank: tierData.title,
        avatar: userSettings.avatarDataUrl || '',
        dailyXP: calculateMyLast7DaysXPMap(),
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

    const myDailyMap = calculateMyLast7DaysXPMap();

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
                avatar: userSettings.avatarDataUrl || '',
                dailyXP: myDailyMap,
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
                        avatar: pData.avatar || '',
                        dailyXP: pData.dailyXP || {},
                        isMe: false
                    });
                }
            } catch (err) {}
        });

        await Promise.all(fetchPromises);
        renderLeaderboardDOM(players);
        renderLeaderboard7DayHistory(players);

        if (statusEl) {
            const timeStr = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            statusEl.innerText = `Live synchronisiert (${timeStr} Uhr)`;
        }
    } catch (err) {
        const fallbackPlayers = [
            { id: myUserId, name: userName, xp: calculateTotalXP(), avatar: userSettings.avatarDataUrl || '', dailyXP: myDailyMap, isMe: true }
        ];
        renderLeaderboardDOM(fallbackPlayers);
        renderLeaderboard7DayHistory(fallbackPlayers);
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
        const tierData = getLevelTierData(lvl);
        let badgeClass = '';
        if (rankNum === 1) badgeClass = 'lb-rank-1';
        else if (rankNum === 2) badgeClass = 'lb-rank-2';
        else if (rankNum === 3) badgeClass = 'lb-rank-3';

        const avatarMarkup = p.avatar
            ? `<img src="${p.avatar}" alt="${p.name}">`
            : `<span class="material-symbols-rounded" style="font-size:20px;">person</span>`;

        html += `
        <div class="leaderboard-row ${p.isMe ? 'is-me' : ''}">
            <div class="lb-left">
                <div class="lb-rank-badge ${badgeClass}">${rankNum}</div>
                <!-- Benutzer-Avatar (Profilbild oder Benutzer-Icon) -->
                <div class="lb-avatar-wrap">${avatarMarkup}</div>
                <div class="lb-user-info">
                    <div class="lb-name">
                        <span>${p.name}</span>
                        ${p.isMe ? `<span style="font-size:10px; background:var(--accent-blue); color:var(--btn-primary-text); font-weight:800; padding:2px 6px; border-radius:8px;">DU</span>` : ''}
                    </div>
                    <div class="lb-sub">Lvl ${lvl} • ${tierData.title}</div>
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

/* --- 7-TAGE XP-HISTORY IM RANKING --- */
function renderLeaderboard7DayHistory(players) {
    const chartEl = document.getElementById('leaderboard-history-chart');
    const tableEl = document.getElementById('leaderboard-history-table-container');
    if (!chartEl || !tableEl) return;

    const last7 = getLast7Days();
    const lineColors = ['#0a84ff', '#30d158', '#ff9f0a', '#bf5af2', '#ff375f', '#64d2ff'];

    const w = 340, h = 130, padL = 24, padR = 16, padT = 20, padB = 26;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    let maxDayXP = 50;
    players.forEach(p => {
        last7.forEach(d => {
            const val = Number(p.dailyXP && p.dailyXP[d.key]) || 0;
            if (val > maxDayXP) maxDayXP = val;
        });
    });

    let pathsHTML = '';
    let labelsHTML = '';

    last7.forEach((d, i) => {
        const x = padL + (i / 6) * plotW;
        labelsHTML += `<text x="${x}" y="${h - 6}" fill="var(--text-muted)" font-size="9.5" font-weight="600" text-anchor="middle">${d.dayName}</text>`;
    });

    players.slice(0, 5).forEach((p, pIdx) => {
        const col = (userSettings.theme === 'monochrome')
            ? (p.isMe ? '#ffffff' : '#71717a')
            : lineColors[pIdx % lineColors.length];

        let dPath = '';
        let dots = '';
        last7.forEach((d, i) => {
            const val = Number(p.dailyXP && p.dailyXP[d.key]) || 0;
            const x = padL + (i / 6) * plotW;
            const y = padT + plotH - (val / maxDayXP) * plotH;
            dPath += (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
            dots += `<circle cx="${x}" cy="${y}" r="3.5" fill="${col}" stroke="#111" stroke-width="1.2"/>`;
        });

        pathsHTML += `<path d="${dPath}" fill="none" stroke="${col}" stroke-width="${p.isMe ? 3 : 2}" stroke-linecap="round" stroke-linejoin="round"/>${dots}`;
    });

    chartEl.innerHTML = `
        <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:100%; overflow:visible;">
            <line x1="${padL}" y1="${padT + plotH}" x2="${w - padR}" y2="${padT + plotH}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            ${pathsHTML}
            ${labelsHTML}
        </svg>`;

    let tHTML = `
        <table class="matrix-table">
            <colgroup>
                <col class="matrix-col-habit">
                <col class="matrix-col-day"><col class="matrix-col-day"><col class="matrix-col-day">
                <col class="matrix-col-day"><col class="matrix-col-day"><col class="matrix-col-day"><col class="matrix-col-day">
            </colgroup>
            <thead><tr><th></th>`;
    last7.forEach(d => {
        tHTML += `<th class="matrix-header-day ${d.isToday ? 'is-today' : ''}">${d.dayName}<span class="matrix-day-num">${d.dayNum}</span></th>`;
    });
    tHTML += `</tr></thead><tbody>`;

    players.forEach((p, pIdx) => {
        const dotCol = (userSettings.theme === 'monochrome')
            ? '#ffffff'
            : lineColors[pIdx % lineColors.length];

        tHTML += `
            <tr class="matrix-row">
                <td>
                    <div class="matrix-habit-name">
                        <span style="width:8px; height:8px; border-radius:50%; background:${dotCol}; flex-shrink:0;"></span>
                        <span class="matrix-habit-text">${p.name}</span>
                    </div>
                </td>`;
        last7.forEach(d => {
            const xpVal = Number(p.dailyXP && p.dailyXP[d.key]) || 0;
            tHTML += `
                <td class="matrix-cell">
                    <span class="lb-history-day-pill ${xpVal > 0 ? 'has-xp' : ''}">${xpVal}</span>
                </td>`;
        });
        tHTML += `</tr>`;
    });

    tHTML += `</tbody></table>`;
    tableEl.innerHTML = tHTML;
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

/* --- EINGEHENDE LINKS PRÜFEN --- */
async function checkIncomingLinks() {
    const params = new URLSearchParams(window.location.search);
    const invitedBy = params.get('invite');
    const sharedPlan = params.get('plan');

    if (invitedBy) {
        const cleanCode = invitedBy.toUpperCase().trim();
        window.history.replaceState({}, document.title, window.location.pathname);
        if (cleanCode && cleanCode !== myUserId) {
            await linkFriendsInFirebase(cleanCode);
            openTabFromMore('leaderboard');
            alert(`Erfolgreich mit Freund (${cleanCode}) im Live-Ranking verbunden!`);
        }
    } else if (sharedPlan) {
        window.history.replaceState({}, document.title, window.location.pathname);
        try {
            const parsed = decodePlanPayload(sharedPlan);
            if (parsed && parsed.name && confirm(`Möchtest du den geteilten Trainingsplan „${parsed.name}“ (${(parsed.exercises || []).length} Übungen) in dein ApexFit importieren?`)) {
                fitnessData.push({
                    id: 'cat_' + Date.now(),
                    name: parsed.name,
                    icon: parsed.icon || 'custom_dumbbell',
                    color: parsed.color || '#0a84ff',
                    exercises: (parsed.exercises || []).map((ex, i) => ({
                        id: 'ex_' + Date.now() + '_' + i,
                        name: ex.name || 'Übung',
                        sets: Number(ex.sets) || 3,
                        reps: Number(ex.reps) || 10,
                        weight: Number(ex.weight) || 50
                    }))
                });
                saveAll();
                renderFitness();
                renderHome();
                switchTab('fitness', document.getElementById('nav-fitness'));
            }
        } catch (e) {}
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
    const targetView = document.getElementById('view-' + tabId);
    if (targetView) targetView.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    } else if (['fittracker', 'leaderboard', 'settings'].includes(tabId)) {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

setInterval(() => {
    const lbView = document.getElementById('view-leaderboard');
    if (lbView && lbView.classList.contains('active')) {
        syncAndLoadLeaderboard(false);
    }
}, 20000);

/* --- INITIALER START --- */
checkNotesAutoCleanup();
applyVisualSettings();
renderSettingsView();
renderHome();
renderFitness();
renderHabits();
renderJournal();
renderFitTracker();
syncAndLoadLeaderboard(false);
checkIncomingLinks();
