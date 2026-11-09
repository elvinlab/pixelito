import type { Locale } from './locale'

const es = {
  library: {
    tagline: 'Tus juegos retro, en el bolsillo.',
    heading: 'Biblioteca',
    play: 'Jugar',
    playGame: (title: string) => `Jugar a ${title}`,
    source: 'Código fuente',
    neverPlayed: 'Sin jugar todavía',
    install: 'Instalar',
    lastPlayed: (when: string) => `Jugado ${when}`,
  },
  play: {
    back: '← Biblioteca',
    loading: 'Cargando…',
    slow: 'Tarda más de lo normal. La primera vez descarga el emulador.',
    idle: '¿El juego espera? Toca OK para continuar.',
    idleKeyboard: '¿El juego espera? Presiona Enter para continuar.',
    screen: 'Pantalla del juego',
    exportSaves: 'Exportar partidas',
    exportFailed: 'No se pudieron exportar las partidas.',
  },
  help: {
    open: 'Ayuda de controles',
    title: 'Controles',
    close: 'Cerrar',
    keyboard: 'Con teclado',
    touch: 'Con pantalla táctil',
    rows: [
      ['Flechas o W A S D', 'Moverte por el menú o el juego'],
      ['F, Enter o Espacio', 'OK: aceptar'],
      ['Q / F1', 'Tecla izquierda (la acción de la esquina izquierda)'],
      ['E / F2', 'Tecla derecha (la acción de la esquina derecha)'],
      ['Esc', 'Atrás'],
      ['0 – 9', 'Números'],
    ],
    softKeys:
      'Las teclas izquierda y derecha hacen lo que el juego escribe en las esquinas de abajo de su pantalla (por ejemplo, Opciones o Atrás).',
    touchText:
      'Usa la cruz para moverte y OK para aceptar. Con «123» cambias la cruz por los números.',
    showPad: 'Mostrar las teclas en pantalla',
  },
  keys: {
    softLeft: 'Tecla izquierda',
    softRight: 'Tecla derecha',
    up: 'Arriba',
    down: 'Abajo',
    left: 'Izquierda',
    right: 'Derecha',
    ok: 'Aceptar',
    back: 'Atrás',
    exit: 'Salir',
    numbers: '123',
    arrows: 'Cruz',
    number: (digit: string) => `Número ${digit}`,
    star: 'Asterisco',
    pound: 'Numeral',
  },
  compatibility: {
    playable: 'Jugable',
    partial: 'Parcial',
    'does-not-run': 'No funciona',
    untested: 'Sin probar',
  },
  notFound: {
    title: 'No hay nada acá',
    body: 'No encontramos esa página ni ese juego.',
    back: 'Volver a la biblioteca',
  },
  theme: {
    label: 'Tema',
    night: 'Noche',
    dmg: 'Portátil',
    light: 'Día',
  },
  language: {
    label: 'Idioma',
    es: 'Español',
    en: 'English',
  },
}

/** Every string the interface shows. Both languages must have the same shape. */
export type Messages = typeof es

const en: Messages = {
  library: {
    tagline: 'Retro games, right in your pocket.',
    heading: 'Library',
    play: 'Play',
    playGame: (title) => `Play ${title}`,
    source: 'Source code',
    neverPlayed: 'Not played yet',
    install: 'Install',
    lastPlayed: (when) => `Played ${when}`,
  },
  play: {
    back: '← Library',
    loading: 'Loading…',
    slow: 'Taking longer than usual. The first time it downloads the emulator.',
    idle: 'Is the game waiting? Press OK to continue.',
    idleKeyboard: 'Is the game waiting? Press Enter to continue.',
    screen: 'Game screen',
    exportSaves: 'Export saves',
    exportFailed: 'Could not export the saves.',
  },
  help: {
    open: 'Controls help',
    title: 'Controls',
    close: 'Close',
    keyboard: 'With a keyboard',
    touch: 'With a touch screen',
    rows: [
      ['Arrows or W A S D', 'Move through the menu or the game'],
      ['F, Enter or Space', 'OK: accept'],
      ['Q / F1', 'Left key (the action in the left corner)'],
      ['E / F2', 'Right key (the action in the right corner)'],
      ['Esc', 'Back'],
      ['0 – 9', 'Numbers'],
    ],
    softKeys:
      'The left and right keys do whatever the game writes in the bottom corners of its screen (for example Options or Back).',
    touchText:
      'Use the arrow keys to move and OK to accept. «123» swaps the arrows for the numbers.',
    showPad: 'Show the on-screen keys',
  },
  keys: {
    softLeft: 'Left soft key',
    softRight: 'Right soft key',
    up: 'Up',
    down: 'Down',
    left: 'Left',
    right: 'Right',
    ok: 'OK',
    back: 'Back',
    exit: 'Exit',
    numbers: '123',
    arrows: 'D-pad',
    number: (digit) => `Number ${digit}`,
    star: 'Star',
    pound: 'Pound',
  },
  compatibility: {
    playable: 'Playable',
    partial: 'Partial',
    'does-not-run': 'Does not run',
    untested: 'Untested',
  },
  notFound: {
    title: 'Nothing here',
    body: 'We could not find that page or game.',
    back: 'Back to the library',
  },
  theme: {
    label: 'Theme',
    night: 'Night',
    dmg: 'Handheld',
    light: 'Day',
  },
  language: {
    label: 'Language',
    es: 'Español',
    en: 'English',
  },
}

/** The dictionaries, by language. */
export const MESSAGES: Readonly<Record<Locale, Messages>> = { es, en }
