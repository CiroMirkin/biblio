import type { Genero } from "./literaryForm"

export type Dewey = number

interface DeweyEntrada {
  codigo: Dewey
  genero: Genero
  paises: string[]
}

const deweyPaises: DeweyEntrada[] = [
  { codigo: 810, genero: "Ficción", paises: ["Estados Unidos"] },
  { codigo: 811, genero: "Poesía", paises: ["Estados Unidos"] },
  { codigo: 812, genero: "Dramas", paises: ["Estados Unidos"] },
  { codigo: 813, genero: "Novela", paises: ["Estados Unidos"] },
  { codigo: 814, genero: "Ensayo", paises: ["Estados Unidos"] },
  { codigo: 815, genero: "Discursos", paises: ["Estados Unidos"] },
  { codigo: 816, genero: "Cartas", paises: ["Estados Unidos"] },
  { codigo: 817, genero: "Humor, sátiras, etc.", paises: ["Estados Unidos"] },
  { codigo: 818, genero: "Formas mixtas", paises: ["Estados Unidos"] },

  { codigo: 820, genero: "Ficción", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudáfrica", "India"] },
  { codigo: 821, genero: "Poesía", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudáfrica", "India"] },
  { codigo: 822, genero: "Dramas", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudáfrica", "India"] },
  { codigo: 823, genero: "Novela", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudáfrica", "India"] },
  { codigo: 824, genero: "Ensayo", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudáfrica", "India"] },
  { codigo: 825, genero: "Discursos", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudáfrica", "India"] },
  { codigo: 826, genero: "Cartas", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudáfrica", "India"] },
  { codigo: 827, genero: "Humor, sátiras, etc.", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudáfrica", "India"] },
  { codigo: 828, genero: "Formas mixtas", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudáfrica", "India"] },
  { codigo: 829, genero: "No ficción", paises: ["Reino Unido"] },

  { codigo: 830, genero: "Ficción", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 831, genero: "Poesía", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 832, genero: "Dramas", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 833, genero: "Novela", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 834, genero: "Ensayo", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 835, genero: "Discursos", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 836, genero: "Cartas", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 837, genero: "Humor, sátiras, etc.", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 838, genero: "Formas mixtas", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 839, genero: "Ficción", paises: ["Países Bajos", "Suecia", "Dinamarca", "Noruega", "Islandia"] },

  { codigo: 840, genero: "Ficción", paises: ["Francia", "Bélgica francófona", "Suiza francesa"] },
  { codigo: 841, genero: "Poesía", paises: ["Francia", "Bélgica francófona", "Suiza francesa"] },
  { codigo: 842, genero: "Dramas", paises: ["Francia", "Bélgica francófona", "Suiza francesa"] },
  { codigo: 843, genero: "Novela", paises: ["Francia", "Bélgica francófona", "Suiza francesa"] },
  { codigo: 844, genero: "Ensayo", paises: ["Francia", "Bélgica francófona", "Suiza francesa"] },
  { codigo: 845, genero: "Discursos", paises: ["Francia", "Bélgica francófona", "Suiza francesa"] },
  { codigo: 846, genero: "Cartas", paises: ["Francia", "Bélgica francófona", "Suiza francesa"] },
  { codigo: 847, genero: "Humor, sátiras, etc.", paises: ["Francia", "Bélgica francófona", "Suiza francesa"] },
  { codigo: 848, genero: "Formas mixtas", paises: ["Francia", "Bélgica francófona", "Suiza francesa"] },
  { codigo: 849, genero: "Ficción", paises: ["España (occitano/catalán)", "Francia (provenzal)"] },

  { codigo: 850, genero: "Ficción", paises: ["Italia"] },
  { codigo: 851, genero: "Poesía", paises: ["Italia"] },
  { codigo: 852, genero: "Dramas", paises: ["Italia"] },
  { codigo: 853, genero: "Novela", paises: ["Italia"] },
  { codigo: 854, genero: "Ensayo", paises: ["Italia"] },
  { codigo: 855, genero: "Discursos", paises: ["Italia"] },
  { codigo: 856, genero: "Cartas", paises: ["Italia"] },
  { codigo: 857, genero: "Humor, sátiras, etc.", paises: ["Italia"] },
  { codigo: 858, genero: "Formas mixtas", paises: ["Italia"] },
  { codigo: 859, genero: "Ficción", paises: ["Rumania"] },

  { codigo: 860, genero: "Ficción", paises: ["España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "República Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 861, genero: "Poesía", paises: ["España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "República Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 862, genero: "Dramas", paises: ["España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "República Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 863, genero: "Novela", paises: ["España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "República Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 863, genero: "Cuentos", paises: ["España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "República Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 864, genero: "Ensayo", paises: ["España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "República Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 865, genero: "Discursos", paises: ["España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "República Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 866, genero: "Cartas", paises: ["España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "República Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 867, genero: "Humor, sátiras, etc.", paises: ["España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "República Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 868, genero: "Formas mixtas", paises: ["España", "México", "Argentina", "Colombia", "Chile", "Perú", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "República Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 869, genero: "Ficción", paises: ["Portugal", "Brasil"] },

  { codigo: 870, genero: "Ficción", paises: ["Roma antigua"] },
  { codigo: 871, genero: "Poesía", paises: ["Roma antigua"] },
  { codigo: 872, genero: "Dramas", paises: ["Roma antigua"] },
  { codigo: 873, genero: "Novela", paises: ["Roma antigua"] },
  { codigo: 874, genero: "Poesía", paises: ["Roma antigua"] },
  { codigo: 875, genero: "Discursos", paises: ["Roma antigua"] },
  { codigo: 876, genero: "Cartas", paises: ["Roma antigua"] },
  { codigo: 877, genero: "Humor, sátiras, etc.", paises: ["Roma antigua"] },
  { codigo: 878, genero: "Formas mixtas", paises: ["Roma antigua"] },
  { codigo: 879, genero: "Ficción", paises: ["Italia (lenguas itálicas antiguas)"] },

  { codigo: 880, genero: "Ficción", paises: ["Grecia"] },
  { codigo: 881, genero: "Poesía", paises: ["Grecia"] },
  { codigo: 882, genero: "Dramas", paises: ["Grecia"] },
  { codigo: 883, genero: "Novela", paises: ["Grecia"] },
  { codigo: 884, genero: "Poesía", paises: ["Grecia"] },
  { codigo: 885, genero: "Discursos", paises: ["Grecia"] },
  { codigo: 886, genero: "Cartas", paises: ["Grecia"] },
  { codigo: 887, genero: "Humor, sátiras, etc.", paises: ["Grecia"] },
  { codigo: 888, genero: "Formas mixtas", paises: ["Grecia"] },
  { codigo: 889, genero: "Ficción", paises: ["Grecia"] },

  { codigo: 890, genero: "Ficción", paises: ["Diversos"] },
]

export function getDatosDelDewey(codigo: Dewey | undefined | null): { genero: Genero, paises: string[] } {
  if (!codigo) {
    return {
      genero: "Desconocido",
      paises: ["Desconocido"],
    }
  }
  
  const entrada = deweyPaises.find((item) => item.codigo === codigo)
  
  if (!entrada) {
    return {
      genero: "Desconocido",
      paises: ["Desconocido"],
    }
  }

  return {
    genero: entrada.genero,
    paises: entrada.paises,
  }
}

export function formatCountry(pais: string): string {
  pais = pais.trim().toLowerCase()
  if(!pais) return ""

  if(pais === 'arg') pais = 'Argentina'
  if(['eeuu', 'eu'].includes(pais)) pais = 'Estados unidos'
  if(['uk', 'inglaterra'].includes(pais)) pais = 'Reino Unido'
  
  return pais.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export function getDeweyPorPaisYGenero(pais: string, genero: Genero): Dewey | null {
  pais = formatCountry(pais)
  const entrada = deweyPaises.find(
    (item) => item.genero === genero && item.paises.includes(pais)
  )

  return entrada ? entrada.codigo : null
}

export { deweyPaises }
export default deweyPaises
