import type { Locale } from './locale'

const es = {
  library: {
    heading: 'Biblioteca',
    play: 'Jugar',
    playGame: (title: string) => `Jugar a ${title}`,
  },
  play: {
    back: '← Biblioteca',
    loading: 'Cargando…',
    screen: 'Pantalla del juego',
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
    numbers: '0-9',
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
    heading: 'Library',
    play: 'Play',
    playGame: (title) => `Play ${title}`,
  },
  play: {
    back: '← Library',
    loading: 'Loading…',
    screen: 'Game screen',
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
    numbers: '0-9',
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
  language: {
    label: 'Language',
    es: 'Español',
    en: 'English',
  },
}

/** The dictionaries, by language. */
export const MESSAGES: Readonly<Record<Locale, Messages>> = { es, en }
