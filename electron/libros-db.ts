import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import type { LibroEnPrestamo } from './libro'
import { LIBROS_JSON_PATH } from './constants'

type Data = LibroEnPrestamo[]

const adapter = new JSONFile<Data>(LIBROS_JSON_PATH)
const defaultData: Data = []
export const db = new Low<Data>(adapter, defaultData)
