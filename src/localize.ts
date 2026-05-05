import type { HomeAssistant, ViewMode } from "./types.js";

type TranslationKey =
  | "allDay"
  | "animated"
  | "appearance"
  | "backgroundBlur"
  | "backgroundImage"
  | "backgroundImageHelper"
  | "backgroundImageOpacity"
  | "backgroundMedia"
  | "backgroundMediaHelper"
  | "calendarFilters"
  | "calendarGridLines"
  | "calendarGridLinesDesc"
  | "calendarNavigation"
  | "calendarView"
  | "close"
  | "cleanDashboard"
  | "date"
  | "default"
  | "description"
  | "dimPastEvents"
  | "dimPastEventsDesc"
  | "eventFont"
  | "eventFontSize"
  | "extraLarge"
  | "features"
  | "filters"
  | "friendlyRounded"
  | "general"
  | "background"
  | "eventDisplay"
  | "fixedHeight"
  | "fixedHeightHelper"
  | "hi"
  | "heightAuto"
  | "heightFixed"
  | "heightHomeAssistant"
  | "heightMode"
  | "heightNatural"
  | "integration"
  | "integrationHelper"
  | "jumpTo"
  | "keepAllDayEventsVisible"
  | "keepAllDayEventsVisibleDesc"
  | "large"
  | "loading"
  | "lo"
  | "medium"
  | "monday"
  | "next"
  | "nextWeek"
  | "openWeatherForecast"
  | "previous"
  | "removeBackgroundImage"
  | "serif"
  | "showCalendars"
  | "showEventTimes"
  | "showEventTimesDesc"
  | "scheduleWindow"
  | "small"
  | "static"
  | "sunday"
  | "timeFormat"
  | "time"
  | "today"
  | "twelveHour"
  | "twentyFourHour"
  | "unconfigured"
  | "viewBiweek"
  | "viewMonth"
  | "viewNext7Days"
  | "viewToday"
  | "viewWeek"
  | "calendar"
  | "addEvent"
  | "allDayLabel"
  | "cardOpacity"
  | "cancel"
  | "createEvent"
  | "deleteEvent"
  | "deleteEventConfirm"
  | "deleteEventUnavailable"
  | "editEvent"
  | "end"
  | "glassBackground"
  | "glassBackgroundDesc"
  | "location"
  | "noWritableCalendars"
  | "save"
  | "start"
  | "title"
  | "updateEvent"
  | "visibleEndHour"
  | "visibleEndHourHelper"
  | "visibleStartHour"
  | "weatherForecast"
  | "weatherForecastDesc"
  | "weatherIconStyle"
  | "weekStartsOn"
  | "visualBehavior";

type TranslationMap = Partial<Record<TranslationKey, string>>;

const TRANSLATIONS: Record<string, TranslationMap> = {
  en: {
    allDay: "all-day",
    animated: "Animated",
    appearance: "Appearance",
    backgroundBlur: "Background blur",
    backgroundImage: "Background image URL",
    backgroundImageHelper: "Optional. Example: /local/family-background.jpg",
    backgroundImageOpacity: "Background image opacity",
    backgroundMedia: "Background image",
    backgroundMediaHelper: "Choose an image from Home Assistant media. Manual URL below remains available as a fallback.",
    background: "Background",
    calendarFilters: "Calendar filters",
    calendarGridLines: "Calendar grid lines",
    calendarGridLinesDesc: "Show dividers in Month, Week, and Biweek views.",
    calendarNavigation: "Calendar navigation",
    calendarView: "Calendar view",
    close: "Close",
    cleanDashboard: "Clean dashboard",
    date: "Date",
    default: "Default",
    description: "Description",
    dimPastEvents: "Dim past events",
    dimPastEventsDesc: "Reduces opacity once an event has ended.",
    eventFont: "Event font",
    eventFontSize: "Event font size",
    eventDisplay: "Event display",
    extraLarge: "Extra large",
    features: "Features",
    filters: "Filters",
    friendlyRounded: "Friendly rounded",
    general: "General",
    fixedHeight: "Fixed calendar height",
    fixedHeightHelper: "Use any CSS height, for example 640px, 70vh, or 42rem.",
    heightAuto: "Auto fit screen",
    heightFixed: "Fixed height",
    heightHomeAssistant: "Home Assistant layout",
    heightMode: "Height mode",
    heightNatural: "Natural height",
    hi: "HI",
    integration: "Integration",
    integrationHelper: "Domain of your Aurora Calendar integration (usually aurora_calendar)",
    jumpTo: "Jump To",
    keepAllDayEventsVisible: "Keep all-day events visible",
    keepAllDayEventsVisibleDesc: "Always keep all-day events pinned at the top instead of hiding them when active events reach them.",
    large: "Large",
    loading: "Loading...",
    lo: "LO",
    medium: "Medium",
    monday: "Monday",
    next: "Next",
    nextWeek: "Next Week",
    openWeatherForecast: "Open weather forecast",
    previous: "Previous",
    removeBackgroundImage: "Remove selected image",
    serif: "Serif",
    showCalendars: "Show calendars",
    showEventTimes: "Show event times",
    showEventTimesDesc: "Display start time on event chips.",
    scheduleWindow: "Schedule window",
    small: "Small",
    static: "Static",
    sunday: "Sunday",
    timeFormat: "Time format",
    time: "Time",
    today: "Today",
    twelveHour: "12 hour",
    twentyFourHour: "24 hour",
    unconfigured: "Open Settings -> Integrations -> Aurora Calendar -> Configure to add your calendars.",
    viewBiweek: "Biweek",
    viewMonth: "Month",
    viewNext7Days: "Next 7 Days",
    viewToday: "Today",
    viewWeek: "Week",
    calendar: "Calendar",
    addEvent: "Add event",
    allDayLabel: "All day",
    cardOpacity: "Card opacity",
    cancel: "Cancel",
    createEvent: "Create event",
    deleteEvent: "Delete event",
    deleteEventConfirm: "Delete this event?",
    deleteEventUnavailable: "This calendar event cannot be deleted from Aurora.",
    editEvent: "Edit event",
    end: "End",
    glassBackground: "Glass background",
    glassBackgroundDesc: "Adds a soft translucent surface so dashboard backgrounds or images can show through.",
    location: "Location",
    noWritableCalendars: "No configured calendars currently report event creation support.",
    save: "Save",
    start: "Start",
    title: "Title",
    updateEvent: "Update event",
    visibleEndHour: "Visible end hour",
    visibleEndHourHelper: "Exclusive end; 22:00 shows through 9:59 PM.",
    visibleStartHour: "Visible start hour",
    weatherForecast: "Weather forecast",
    weatherForecastDesc: "Show daily condition icon and temperature on each day cell.",
    weatherIconStyle: "Weather icon style",
    weekStartsOn: "Week starts on",
    visualBehavior: "Visual behavior",
  },
  es: {
    allDay: "todo el dia",
    animated: "Animado",
    appearance: "Apariencia",
    backgroundBlur: "Desenfoque del fondo",
    backgroundImage: "URL de imagen de fondo",
    backgroundImageHelper: "Opcional. Ejemplo: /local/family-background.jpg",
    backgroundImageOpacity: "Opacidad de imagen de fondo",
    backgroundMedia: "Imagen de fondo",
    backgroundMediaHelper: "Elige una imagen desde medios de Home Assistant. La URL manual queda disponible como respaldo.",
    background: "Fondo",
    calendarFilters: "Filtros del calendario",
    calendarGridLines: "Lineas del calendario",
    calendarGridLinesDesc: "Mostrar divisores en las vistas Mes, Semana y Quincena.",
    calendarNavigation: "Navegacion del calendario",
    calendarView: "Vista del calendario",
    cleanDashboard: "Panel limpio",
    default: "Predeterminado",
    dimPastEvents: "Atenuar eventos pasados",
    dimPastEventsDesc: "Reduce la opacidad cuando un evento ha terminado.",
    eventFont: "Fuente de eventos",
    eventFontSize: "Tamano de fuente de eventos",
    eventDisplay: "Visualizacion de eventos",
    extraLarge: "Extra grande",
    features: "Funciones",
    filters: "Filtros",
    friendlyRounded: "Redondeada amigable",
    general: "General",
    fixedHeight: "Altura fija del calendario",
    fixedHeightHelper: "Usa cualquier altura CSS, por ejemplo 640px, 70vh o 42rem.",
    heightAuto: "Ajustar a la pantalla",
    heightFixed: "Altura fija",
    heightHomeAssistant: "Diseno de Home Assistant",
    heightMode: "Modo de altura",
    heightNatural: "Altura natural",
    hi: "MAX",
    integration: "Integracion",
    integrationHelper: "Dominio de tu integracion Aurora Calendar (normalmente aurora_calendar)",
    jumpTo: "Ir a",
    keepAllDayEventsVisible: "Mantener visibles los eventos de todo el dia",
    keepAllDayEventsVisibleDesc: "Mantiene los eventos de todo el dia fijos arriba en vez de ocultarlos cuando llegan eventos activos.",
    large: "Grande",
    loading: "Cargando...",
    lo: "MIN",
    medium: "Mediano",
    monday: "Lunes",
    next: "Siguiente",
    nextWeek: "Proxima semana",
    openWeatherForecast: "Abrir pronostico del tiempo",
    previous: "Anterior",
    removeBackgroundImage: "Quitar imagen seleccionada",
    serif: "Serif",
    showCalendars: "Mostrar calendarios",
    showEventTimes: "Mostrar horas de eventos",
    showEventTimesDesc: "Muestra la hora de inicio en las tarjetas de eventos.",
    scheduleWindow: "Horario visible",
    small: "Pequeno",
    static: "Estatico",
    sunday: "Domingo",
    timeFormat: "Formato de hora",
    today: "Hoy",
    twelveHour: "12 horas",
    twentyFourHour: "24 horas",
    unconfigured: "Abre Ajustes -> Integraciones -> Aurora Calendar -> Configurar para agregar tus calendarios.",
    viewBiweek: "Quincena",
    viewMonth: "Mes",
    viewNext7Days: "Proximos 7 dias",
    viewToday: "Hoy",
    viewWeek: "Semana",
    cardOpacity: "Opacidad de la tarjeta",
    glassBackground: "Fondo tipo cristal",
    glassBackgroundDesc: "Agrega una superficie translucida para mostrar fondos o imagenes del panel.",
    visibleEndHour: "Hora final visible",
    visibleEndHourHelper: "Fin exclusivo; 22:00 muestra hasta las 9:59 PM.",
    visibleStartHour: "Hora inicial visible",
    weatherForecast: "Pronostico del tiempo",
    weatherForecastDesc: "Muestra condicion diaria y temperatura en cada dia.",
    weatherIconStyle: "Estilo de icono del tiempo",
    weekStartsOn: "La semana empieza el",
    visualBehavior: "Comportamiento visual",
  },
  de: {
    allDay: "ganztagig",
    animated: "Animiert",
    appearance: "Darstellung",
    calendarFilters: "Kalenderfilter",
    calendarGridLines: "Kalender-Rasterlinien",
    calendarGridLinesDesc: "Trennlinien in Monats-, Wochen- und Zweiwochenansicht anzeigen.",
    calendarNavigation: "Kalendernavigation",
    calendarView: "Kalenderansicht",
    cleanDashboard: "Klares Dashboard",
    default: "Standard",
    dimPastEvents: "Vergangene Ereignisse abdunkeln",
    dimPastEventsDesc: "Verringert die Deckkraft, sobald ein Ereignis beendet ist.",
    eventFont: "Ereignisschrift",
    eventFontSize: "Ereignis-Schriftgroesse",
    extraLarge: "Extra gross",
    features: "Funktionen",
    filters: "Filter",
    friendlyRounded: "Freundlich gerundet",
    general: "Allgemein",
    hi: "MAX",
    integration: "Integration",
    integrationHelper: "Domain deiner Aurora Calendar Integration (normalerweise aurora_calendar)",
    jumpTo: "Springen zu",
    large: "Gross",
    loading: "Wird geladen...",
    lo: "MIN",
    medium: "Mittel",
    monday: "Montag",
    next: "Weiter",
    nextWeek: "Naechste Woche",
    openWeatherForecast: "Wettervorhersage oeffnen",
    previous: "Zurueck",
    serif: "Serif",
    showCalendars: "Kalender anzeigen",
    showEventTimes: "Ereigniszeiten anzeigen",
    showEventTimesDesc: "Startzeit auf Ereignis-Chips anzeigen.",
    small: "Klein",
    static: "Statisch",
    sunday: "Sonntag",
    timeFormat: "Zeitformat",
    today: "Heute",
    twelveHour: "12 Stunden",
    twentyFourHour: "24 Stunden",
    unconfigured: "Oeffne Einstellungen -> Integrationen -> Aurora Calendar -> Konfigurieren, um deine Kalender hinzuzufuegen.",
    viewBiweek: "Zwei Wochen",
    viewMonth: "Monat",
    viewNext7Days: "Naechste 7 Tage",
    viewToday: "Heute",
    viewWeek: "Woche",
    visibleEndHour: "Sichtbare Endstunde",
    visibleEndHourHelper: "Exklusives Ende; 22:00 zeigt bis 21:59.",
    visibleStartHour: "Sichtbare Startstunde",
    weatherForecast: "Wettervorhersage",
    weatherForecastDesc: "Taegliches Wettersymbol und Temperatur in jeder Tageszelle anzeigen.",
    weatherIconStyle: "Wettericon-Stil",
    weekStartsOn: "Woche beginnt am",
  },
  fr: {
    allDay: "toute la journee",
    animated: "Anime",
    appearance: "Apparence",
    calendarFilters: "Filtres du calendrier",
    calendarGridLines: "Lignes de grille du calendrier",
    calendarGridLinesDesc: "Afficher les separateurs dans les vues Mois, Semaine et Deux semaines.",
    calendarNavigation: "Navigation du calendrier",
    calendarView: "Vue du calendrier",
    cleanDashboard: "Tableau de bord epure",
    default: "Par defaut",
    dimPastEvents: "Attenuer les evenements passes",
    dimPastEventsDesc: "Reduit l'opacite lorsqu'un evenement est termine.",
    eventFont: "Police des evenements",
    eventFontSize: "Taille de police des evenements",
    extraLarge: "Tres grand",
    features: "Fonctionnalites",
    filters: "Filtres",
    friendlyRounded: "Arrondie conviviale",
    general: "General",
    hi: "MAX",
    integration: "Integration",
    integrationHelper: "Domaine de votre integration Aurora Calendar (generalement aurora_calendar)",
    jumpTo: "Aller a",
    large: "Grand",
    loading: "Chargement...",
    lo: "MIN",
    medium: "Moyen",
    monday: "Lundi",
    next: "Suivant",
    nextWeek: "Semaine suivante",
    openWeatherForecast: "Ouvrir les previsions meteo",
    previous: "Precedent",
    serif: "Serif",
    showCalendars: "Afficher les calendriers",
    showEventTimes: "Afficher les heures des evenements",
    showEventTimesDesc: "Afficher l'heure de debut sur les cartes d'evenement.",
    small: "Petit",
    static: "Statique",
    sunday: "Dimanche",
    timeFormat: "Format de l'heure",
    today: "Aujourd'hui",
    twelveHour: "12 heures",
    twentyFourHour: "24 heures",
    unconfigured: "Ouvrez Parametres -> Integrations -> Aurora Calendar -> Configurer pour ajouter vos calendriers.",
    viewBiweek: "Deux semaines",
    viewMonth: "Mois",
    viewNext7Days: "7 prochains jours",
    viewToday: "Aujourd'hui",
    viewWeek: "Semaine",
    visibleEndHour: "Heure de fin visible",
    visibleEndHourHelper: "Fin exclusive; 22:00 affiche jusqu'a 21:59.",
    visibleStartHour: "Heure de debut visible",
    weatherForecast: "Previsions meteo",
    weatherForecastDesc: "Afficher l'icone de condition quotidienne et la temperature sur chaque jour.",
    weatherIconStyle: "Style d'icone meteo",
    weekStartsOn: "La semaine commence le",
  },
  it: {
    allDay: "tutto il giorno",
    animated: "Animato",
    appearance: "Aspetto",
    calendarFilters: "Filtri calendario",
    calendarGridLines: "Linee griglia calendario",
    calendarGridLinesDesc: "Mostra divisori nelle viste Mese, Settimana e Bisettimanale.",
    calendarNavigation: "Navigazione calendario",
    calendarView: "Vista calendario",
    cleanDashboard: "Dashboard pulita",
    default: "Predefinito",
    dimPastEvents: "Attenua eventi passati",
    dimPastEventsDesc: "Riduce l'opacita quando un evento e terminato.",
    eventFont: "Carattere eventi",
    eventFontSize: "Dimensione carattere eventi",
    extraLarge: "Molto grande",
    features: "Funzioni",
    filters: "Filtri",
    friendlyRounded: "Arrotondato amichevole",
    general: "Generale",
    hi: "MAX",
    integration: "Integrazione",
    integrationHelper: "Dominio della tua integrazione Aurora Calendar (di solito aurora_calendar)",
    jumpTo: "Vai a",
    large: "Grande",
    loading: "Caricamento...",
    lo: "MIN",
    medium: "Medio",
    monday: "Lunedi",
    next: "Avanti",
    nextWeek: "Prossima settimana",
    openWeatherForecast: "Apri previsioni meteo",
    previous: "Indietro",
    serif: "Serif",
    showCalendars: "Mostra calendari",
    showEventTimes: "Mostra orari eventi",
    showEventTimesDesc: "Mostra l'ora di inizio sulle schede evento.",
    small: "Piccolo",
    static: "Statico",
    sunday: "Domenica",
    timeFormat: "Formato ora",
    today: "Oggi",
    twelveHour: "12 ore",
    twentyFourHour: "24 ore",
    unconfigured: "Apri Impostazioni -> Integrazioni -> Aurora Calendar -> Configura per aggiungere i calendari.",
    viewBiweek: "Due settimane",
    viewMonth: "Mese",
    viewNext7Days: "Prossimi 7 giorni",
    viewToday: "Oggi",
    viewWeek: "Settimana",
    visibleEndHour: "Ora finale visibile",
    visibleEndHourHelper: "Fine esclusiva; 22:00 mostra fino alle 21:59.",
    visibleStartHour: "Ora iniziale visibile",
    weatherForecast: "Previsioni meteo",
    weatherForecastDesc: "Mostra icona condizione giornaliera e temperatura in ogni giorno.",
    weatherIconStyle: "Stile icona meteo",
    weekStartsOn: "La settimana inizia di",
  },
  nl: {
    allDay: "hele dag",
    animated: "Geanimeerd",
    appearance: "Uiterlijk",
    calendarFilters: "Kalenderfilters",
    calendarGridLines: "Kalenderrasterlijnen",
    calendarGridLinesDesc: "Toon scheidingslijnen in maand-, week- en tweewekenweergave.",
    calendarNavigation: "Kalendernavigatie",
    calendarView: "Kalenderweergave",
    cleanDashboard: "Strak dashboard",
    default: "Standaard",
    dimPastEvents: "Afgelopen gebeurtenissen dimmen",
    dimPastEventsDesc: "Vermindert de dekking zodra een gebeurtenis is afgelopen.",
    eventFont: "Lettertype gebeurtenissen",
    eventFontSize: "Lettergrootte gebeurtenissen",
    extraLarge: "Extra groot",
    features: "Functies",
    filters: "Filters",
    friendlyRounded: "Vriendelijk afgerond",
    general: "Algemeen",
    hi: "MAX",
    integration: "Integratie",
    integrationHelper: "Domein van je Aurora Calendar-integratie (meestal aurora_calendar)",
    jumpTo: "Ga naar",
    large: "Groot",
    loading: "Laden...",
    lo: "MIN",
    medium: "Gemiddeld",
    monday: "Maandag",
    next: "Volgende",
    nextWeek: "Volgende week",
    openWeatherForecast: "Weersverwachting openen",
    previous: "Vorige",
    serif: "Serif",
    showCalendars: "Kalenders tonen",
    showEventTimes: "Tijden van gebeurtenissen tonen",
    showEventTimesDesc: "Starttijd op gebeurteniskaarten tonen.",
    small: "Klein",
    static: "Statisch",
    sunday: "Zondag",
    timeFormat: "Tijdnotatie",
    today: "Vandaag",
    twelveHour: "12 uur",
    twentyFourHour: "24 uur",
    unconfigured: "Open Instellingen -> Integraties -> Aurora Calendar -> Configureren om je kalenders toe te voegen.",
    viewBiweek: "Twee weken",
    viewMonth: "Maand",
    viewNext7Days: "Volgende 7 dagen",
    viewToday: "Vandaag",
    viewWeek: "Week",
    visibleEndHour: "Zichtbare eindtijd",
    visibleEndHourHelper: "Exclusief einde; 22:00 toont tot 21:59.",
    visibleStartHour: "Zichtbare starttijd",
    weatherForecast: "Weersverwachting",
    weatherForecastDesc: "Toon dagelijkse conditie-icoon en temperatuur in elke dagcel.",
    weatherIconStyle: "Stijl weericoon",
    weekStartsOn: "Week begint op",
  },
  pt: {
    allDay: "dia inteiro",
    animated: "Animado",
    appearance: "Aparencia",
    calendarFilters: "Filtros do calendario",
    calendarGridLines: "Linhas da grelha do calendario",
    calendarGridLinesDesc: "Mostrar divisorias nas vistas Mes, Semana e Quinzenal.",
    calendarNavigation: "Navegacao do calendario",
    calendarView: "Vista do calendario",
    cleanDashboard: "Painel limpo",
    default: "Predefinido",
    dimPastEvents: "Atenuar eventos passados",
    dimPastEventsDesc: "Reduz a opacidade quando um evento termina.",
    eventFont: "Tipo de letra dos eventos",
    eventFontSize: "Tamanho do texto dos eventos",
    extraLarge: "Extra grande",
    features: "Funcionalidades",
    filters: "Filtros",
    friendlyRounded: "Arredondado amigavel",
    general: "Geral",
    hi: "MAX",
    integration: "Integracao",
    integrationHelper: "Dominio da integracao Aurora Calendar (normalmente aurora_calendar)",
    jumpTo: "Ir para",
    large: "Grande",
    loading: "A carregar...",
    lo: "MIN",
    medium: "Medio",
    monday: "Segunda-feira",
    next: "Seguinte",
    nextWeek: "Proxima semana",
    openWeatherForecast: "Abrir previsao meteorologica",
    previous: "Anterior",
    serif: "Serif",
    showCalendars: "Mostrar calendarios",
    showEventTimes: "Mostrar horas dos eventos",
    showEventTimesDesc: "Mostra a hora de inicio nos cartoes de evento.",
    small: "Pequeno",
    static: "Estatico",
    sunday: "Domingo",
    timeFormat: "Formato da hora",
    today: "Hoje",
    twelveHour: "12 horas",
    twentyFourHour: "24 horas",
    unconfigured: "Abra Definicoes -> Integracoes -> Aurora Calendar -> Configurar para adicionar os calendarios.",
    viewBiweek: "Quinzenal",
    viewMonth: "Mes",
    viewNext7Days: "Proximos 7 dias",
    viewToday: "Hoje",
    viewWeek: "Semana",
    visibleEndHour: "Hora final visivel",
    visibleEndHourHelper: "Fim exclusivo; 22:00 mostra ate 21:59.",
    visibleStartHour: "Hora inicial visivel",
    weatherForecast: "Previsao meteorologica",
    weatherForecastDesc: "Mostrar icone da condicao diaria e temperatura em cada dia.",
    weatherIconStyle: "Estilo do icone meteorologico",
    weekStartsOn: "A semana comeca em",
  },
  "pt-BR": {
    allDay: "dia inteiro",
    animated: "Animado",
    appearance: "Aparencia",
    calendarFilters: "Filtros do calendario",
    calendarGridLines: "Linhas do calendario",
    calendarGridLinesDesc: "Mostrar divisorias nas visualizacoes Mes, Semana e Quinzenal.",
    calendarNavigation: "Navegacao do calendario",
    calendarView: "Visualizacao do calendario",
    cleanDashboard: "Painel limpo",
    default: "Padrao",
    dimPastEvents: "Escurecer eventos passados",
    dimPastEventsDesc: "Reduz a opacidade quando um evento termina.",
    eventFont: "Fonte dos eventos",
    eventFontSize: "Tamanho da fonte dos eventos",
    extraLarge: "Extra grande",
    features: "Recursos",
    filters: "Filtros",
    friendlyRounded: "Arredondada amigavel",
    general: "Geral",
    hi: "MAX",
    integration: "Integracao",
    integrationHelper: "Dominio da integracao Aurora Calendar (normalmente aurora_calendar)",
    jumpTo: "Ir para",
    large: "Grande",
    loading: "Carregando...",
    lo: "MIN",
    medium: "Medio",
    monday: "Segunda-feira",
    next: "Proximo",
    nextWeek: "Proxima semana",
    openWeatherForecast: "Abrir previsao do tempo",
    previous: "Anterior",
    serif: "Serif",
    showCalendars: "Mostrar calendarios",
    showEventTimes: "Mostrar horarios dos eventos",
    showEventTimesDesc: "Mostra o horario de inicio nos cartoes de evento.",
    small: "Pequeno",
    static: "Estatico",
    sunday: "Domingo",
    timeFormat: "Formato de hora",
    today: "Hoje",
    twelveHour: "12 horas",
    twentyFourHour: "24 horas",
    unconfigured: "Abra Configuracoes -> Integracoes -> Aurora Calendar -> Configurar para adicionar seus calendarios.",
    viewBiweek: "Quinzenal",
    viewMonth: "Mes",
    viewNext7Days: "Proximos 7 dias",
    viewToday: "Hoje",
    viewWeek: "Semana",
    visibleEndHour: "Hora final visivel",
    visibleEndHourHelper: "Fim exclusivo; 22:00 mostra ate 21:59.",
    visibleStartHour: "Hora inicial visivel",
    weatherForecast: "Previsao do tempo",
    weatherForecastDesc: "Mostra icone da condicao diaria e temperatura em cada dia.",
    weatherIconStyle: "Estilo do icone do tempo",
    weekStartsOn: "A semana comeca em",
  },
  pl: {
    allDay: "caly dzien",
    animated: "Animowana",
    appearance: "Wyglad",
    calendarFilters: "Filtry kalendarza",
    calendarGridLines: "Linie siatki kalendarza",
    calendarGridLinesDesc: "Pokazuj linie w widokach miesiaca, tygodnia i dwoch tygodni.",
    calendarNavigation: "Nawigacja kalendarza",
    calendarView: "Widok kalendarza",
    cleanDashboard: "Czysty pulpit",
    default: "Domyslne",
    dimPastEvents: "Przyciemnij minione wydarzenia",
    dimPastEventsDesc: "Zmniejsza krycie po zakonczeniu wydarzenia.",
    eventFont: "Czcionka wydarzen",
    eventFontSize: "Rozmiar czcionki wydarzen",
    extraLarge: "Bardzo duzy",
    features: "Funkcje",
    filters: "Filtry",
    friendlyRounded: "Przyjaznie zaokraglona",
    general: "Ogolne",
    hi: "MAX",
    integration: "Integracja",
    integrationHelper: "Domena integracji Aurora Calendar (zwykle aurora_calendar)",
    jumpTo: "Przejdz do",
    large: "Duzy",
    loading: "Ladowanie...",
    lo: "MIN",
    medium: "Sredni",
    monday: "Poniedzialek",
    next: "Nastepny",
    nextWeek: "Nastepny tydzien",
    openWeatherForecast: "Otworz prognoze pogody",
    previous: "Poprzedni",
    serif: "Szeryfowa",
    showCalendars: "Pokaz kalendarze",
    showEventTimes: "Pokaz godziny wydarzen",
    showEventTimesDesc: "Pokazuj czas rozpoczecia na kartach wydarzen.",
    small: "Maly",
    static: "Statyczna",
    sunday: "Niedziela",
    timeFormat: "Format czasu",
    today: "Dzisiaj",
    twelveHour: "12-godzinny",
    twentyFourHour: "24-godzinny",
    unconfigured: "Otworz Ustawienia -> Integracje -> Aurora Calendar -> Konfiguruj, aby dodac kalendarze.",
    viewBiweek: "Dwa tygodnie",
    viewMonth: "Miesiac",
    viewNext7Days: "Nastepne 7 dni",
    viewToday: "Dzisiaj",
    viewWeek: "Tydzien",
    visibleEndHour: "Widoczna godzina koncowa",
    visibleEndHourHelper: "Koniec wylaczny; 22:00 pokazuje do 21:59.",
    visibleStartHour: "Widoczna godzina poczatkowa",
    weatherForecast: "Prognoza pogody",
    weatherForecastDesc: "Pokazuj ikone warunkow i temperature w kazdej komorce dnia.",
    weatherIconStyle: "Styl ikony pogody",
    weekStartsOn: "Tydzien zaczyna sie w",
  },
  sv: {
    allDay: "hela dagen",
    animated: "Animerad",
    appearance: "Utseende",
    calendarFilters: "Kalenderfilter",
    calendarGridLines: "Kalenderrutnat",
    calendarGridLinesDesc: "Visa avdelare i manads-, vecko- och tvaveckorsvyer.",
    calendarNavigation: "Kalendernavigering",
    calendarView: "Kalendervy",
    cleanDashboard: "Ren instrumentpanel",
    default: "Standard",
    dimPastEvents: "Tona ned tidigare handelser",
    dimPastEventsDesc: "Minskar opaciteten nar en handelse har slutat.",
    eventFont: "Handelsetypsnitt",
    eventFontSize: "Textstorlek for handelser",
    extraLarge: "Extra stor",
    features: "Funktioner",
    filters: "Filter",
    friendlyRounded: "Vanligt rundad",
    general: "Allmant",
    hi: "MAX",
    integration: "Integration",
    integrationHelper: "Doman for din Aurora Calendar-integration (vanligtvis aurora_calendar)",
    jumpTo: "Ga till",
    large: "Stor",
    loading: "Laddar...",
    lo: "MIN",
    medium: "Medium",
    monday: "Mandag",
    next: "Nasta",
    nextWeek: "Nasta vecka",
    openWeatherForecast: "Oppna vaderprognos",
    previous: "Foregaende",
    serif: "Serif",
    showCalendars: "Visa kalendrar",
    showEventTimes: "Visa tider for handelser",
    showEventTimesDesc: "Visa starttid pa handelsekort.",
    small: "Liten",
    static: "Statisk",
    sunday: "Sondag",
    timeFormat: "Tidsformat",
    today: "Idag",
    twelveHour: "12 timmar",
    twentyFourHour: "24 timmar",
    unconfigured: "Oppna Installningar -> Integrationer -> Aurora Calendar -> Konfigurera for att lagga till dina kalendrar.",
    viewBiweek: "Tva veckor",
    viewMonth: "Manad",
    viewNext7Days: "Nasta 7 dagarna",
    viewToday: "Idag",
    viewWeek: "Vecka",
    visibleEndHour: "Synlig sluttimme",
    visibleEndHourHelper: "Exklusivt slut; 22:00 visar till 21:59.",
    visibleStartHour: "Synlig starttimme",
    weatherForecast: "Vaderprognos",
    weatherForecastDesc: "Visa daglig vaderikon och temperatur i varje dagruta.",
    weatherIconStyle: "Stil for vaderikon",
    weekStartsOn: "Veckan borjar pa",
  },
};

const VIEW_LABEL_KEYS: Record<ViewMode, TranslationKey> = {
  Month: "viewMonth",
  Week: "viewWeek",
  Biweek: "viewBiweek",
  Today: "viewToday",
  "Next 7 Days": "viewNext7Days",
};

export function localeFromHass(hass?: HomeAssistant): string {
  return (
    hass?.locale?.language ||
    navigator.languages?.[0] ||
    navigator.language ||
    "en"
  );
}

export function t(locale: string, key: TranslationKey): string {
  const normalized = normalizeLocale(locale);
  return (
    TRANSLATIONS[normalized]?.[key] ||
    TRANSLATIONS[baseLocale(normalized)]?.[key] ||
    TRANSLATIONS.en[key] || key
  );
}

export function viewModeLabel(locale: string, mode: ViewMode): string {
  return t(locale, VIEW_LABEL_KEYS[mode]);
}

export function formatWeekday(locale: string, date: Date, width: "short" | "long" = "short"): string {
  return new Intl.DateTimeFormat(locale, { weekday: width }).format(date);
}

export function formatMonth(locale: string, date: Date, width: "short" | "long" = "short"): string {
  return new Intl.DateTimeFormat(locale, { month: width }).format(date);
}

export function formatMonthTitle(locale: string, date: Date): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}

export function formatTodayTitle(locale: string, date: Date): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatRangeTitle(locale: string, start: Date, end: Date): string {
  const s = formatMonthDay(locale, start);
  const e = sameMonth(start, end)
    ? new Intl.DateTimeFormat(locale, { day: "numeric" }).format(end)
    : formatMonthDay(locale, end);
  return `${s} - ${e}`;
}

export function formatFullWeekRange(locale: string, start: Date, end: Date): string {
  const s = formatMonthDay(locale, start, "long");
  const e = sameMonth(start, end)
    ? new Intl.DateTimeFormat(locale, { day: "numeric" }).format(end)
    : formatMonthDay(locale, end, "long");
  return `${s} - ${e}`;
}

function formatMonthDay(locale: string, date: Date, month: "short" | "long" = "short"): string {
  return new Intl.DateTimeFormat(locale, { month, day: "numeric" }).format(date);
}

function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function normalizeLocale(locale: string): string {
  let canonical = "en";
  try {
    canonical = Intl.getCanonicalLocales(locale || "en")[0] || "en";
  } catch {
    canonical = "en";
  }
  if (canonical.toLowerCase() === "pt-br") return "pt-BR";
  return baseLocale(canonical);
}

function baseLocale(locale: string): string {
  return locale.split("-")[0];
}
