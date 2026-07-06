import type { LiteraryFormLabel } from "./literaryForm"

export type Dewey = number

interface DeweyEntrada {
  codigo: Dewey
  genero: LiteraryFormLabel
  paises: string[]
}

const deweyPaises: DeweyEntrada[] = [
  { codigo: 810, genero: "Ficción", paises: ["Estados Unidos"] },
  { codigo: 811, genero: "Poesía", paises: ["Estados Unidos"] },
  { codigo: 812, genero: "Dramas", paises: ["Estados Unidos"] },
  { codigo: 813, genero: "Novela", paises: ["Estados Unidos"] },
  { codigo: 813, genero: "Cuentos", paises: ["Estados Unidos"] },
  { codigo: 814, genero: "Ensayo", paises: ["Estados Unidos"] },
  { codigo: 815, genero: "Discursos", paises: ["Estados Unidos"] },
  { codigo: 816, genero: "Cartas", paises: ["Estados Unidos"] },
  { codigo: 817, genero: "Humor, sátiras, etc.", paises: ["Estados Unidos"] },
  { codigo: 818, genero: "Formas mixtas", paises: ["Estados Unidos"] },

  { codigo: 820, genero: "Ficción", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudafrica", "India"] },
  { codigo: 821, genero: "Poesía", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudafrica", "India"] },
  { codigo: 822, genero: "Dramas", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudafrica", "India"] },
  { codigo: 823, genero: "Novela", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudafrica", "India"] },
  { codigo: 823, genero: "Cuentos", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudafrica", "India"] },
  { codigo: 824, genero: "Ensayo", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudafrica", "India"] },
  { codigo: 825, genero: "Discursos", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudafrica", "India"] },
  { codigo: 826, genero: "Cartas", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudafrica", "India"] },
  { codigo: 827, genero: "Humor, sátiras, etc.", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudafrica", "India"] },
  { codigo: 828, genero: "Formas mixtas", paises: ["Reino Unido", "Irlanda", "Australia", "Nueva Zelanda", "Sudafrica", "India"] },
  { codigo: 829, genero: "No ficción", paises: ["Reino Unido"] },

  { codigo: 830, genero: "Ficción", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 831, genero: "Poesía", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 832, genero: "Dramas", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 833, genero: "Novela", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 833, genero: "Cuentos", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 834, genero: "Ensayo", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 835, genero: "Discursos", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 836, genero: "Cartas", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 837, genero: "Humor, sátiras, etc.", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 838, genero: "Formas mixtas", paises: ["Alemania", "Austria", "Suiza alemana"] },
  { codigo: 839, genero: "Ficción", paises: ["Paises Bajos", "Suecia", "Dinamarca", "Noruega", "Islandia"] },

  { codigo: 840, genero: "Ficción", paises: ["Francia", "Belgica francofona", "Suiza francesa"] },
  { codigo: 841, genero: "Poesía", paises: ["Francia", "Belgica francofona", "Suiza francesa"] },
  { codigo: 842, genero: "Dramas", paises: ["Francia", "Belgica francofona", "Suiza francesa"] },
  { codigo: 843, genero: "Novela", paises: ["Francia", "Belgica francofona", "Suiza francesa"] },
  { codigo: 843, genero: "Cuentos", paises: ["Francia", "Belgica francofona", "Suiza francesa"] },
  { codigo: 844, genero: "Ensayo", paises: ["Francia", "Belgica francofona", "Suiza francesa"] },
  { codigo: 845, genero: "Discursos", paises: ["Francia", "Belgica francofona", "Suiza francesa"] },
  { codigo: 846, genero: "Cartas", paises: ["Francia", "Belgica francofona", "Suiza francesa"] },
  { codigo: 847, genero: "Humor, sátiras, etc.", paises: ["Francia", "Belgica francofona", "Suiza francesa"] },
  { codigo: 848, genero: "Formas mixtas", paises: ["Francia", "Belgica francofona", "Suiza francesa"] },
  { codigo: 849, genero: "Ficción", paises: ["España (occitano/catalan)", "Francia (provenzal)"] },

  { codigo: 850, genero: "Ficción", paises: ["Italia"] },
  { codigo: 851, genero: "Poesía", paises: ["Italia"] },
  { codigo: 852, genero: "Dramas", paises: ["Italia"] },
  { codigo: 853, genero: "Novela", paises: ["Italia"] },
  { codigo: 853, genero: "Cuentos", paises: ["Italia"] },
  { codigo: 854, genero: "Ensayo", paises: ["Italia"] },
  { codigo: 855, genero: "Discursos", paises: ["Italia"] },
  { codigo: 856, genero: "Cartas", paises: ["Italia"] },
  { codigo: 857, genero: "Humor, sátiras, etc.", paises: ["Italia"] },
  { codigo: 858, genero: "Formas mixtas", paises: ["Italia"] },
  { codigo: 859, genero: "Ficción", paises: ["Rumania"] },

  { codigo: 860, genero: "Ficción", paises: ["España", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "Republica Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 861, genero: "Poesía", paises: ["España", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "Republica Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 862, genero: "Dramas", paises: ["España", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "Republica Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 863, genero: "Novela", paises: ["España", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "Republica Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 863, genero: "Cuentos", paises: ["España", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "Republica Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 864, genero: "Ensayo", paises: ["España", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "Republica Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 865, genero: "Discursos", paises: ["España", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "Republica Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 866, genero: "Cartas", paises: ["España", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "Republica Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 867, genero: "Humor, sátiras, etc.", paises: ["España", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "Republica Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 868, genero: "Formas mixtas", paises: ["España", "Mexico", "Argentina", "Colombia", "Chile", "Peru", "Venezuela", "Ecuador", "Guatemala", "Cuba", "Bolivia", "Republica Dominicana", "Honduras", "Paraguay", "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Uruguay", "Guinea Ecuatorial"] },
  { codigo: 869, genero: "Ficción", paises: ["Portugal", "Brasil"] },

  { codigo: 870, genero: "Ficción", paises: ["Roma antigua"] },
  { codigo: 871, genero: "Poesía", paises: ["Roma antigua"] },
  { codigo: 872, genero: "Dramas", paises: ["Roma antigua"] },
  { codigo: 873, genero: "Novela", paises: ["Roma antigua"] },
  { codigo: 873, genero: "Cuentos", paises: ["Roma antigua"] },
  { codigo: 874, genero: "Poesía", paises: ["Roma antigua"] },
  { codigo: 875, genero: "Discursos", paises: ["Roma antigua"] },
  { codigo: 876, genero: "Cartas", paises: ["Roma antigua"] },
  { codigo: 877, genero: "Humor, sátiras, etc.", paises: ["Roma antigua"] },
  { codigo: 878, genero: "Formas mixtas", paises: ["Roma antigua"] },
  { codigo: 879, genero: "Ficción", paises: ["Italia (lenguas italicas antiguas)"] },

  { codigo: 880, genero: "Ficción", paises: ["Grecia"] },
  { codigo: 881, genero: "Poesía", paises: ["Grecia"] },
  { codigo: 882, genero: "Dramas", paises: ["Grecia"] },
  { codigo: 883, genero: "Novela", paises: ["Grecia"] },
  { codigo: 883, genero: "Cuentos", paises: ["Grecia"] },
  { codigo: 884, genero: "Poesía", paises: ["Grecia"] },
  { codigo: 885, genero: "Discursos", paises: ["Grecia"] },
  { codigo: 886, genero: "Cartas", paises: ["Grecia"] },
  { codigo: 887, genero: "Humor, sátiras, etc.", paises: ["Grecia"] },
  { codigo: 888, genero: "Formas mixtas", paises: ["Grecia"] },
  { codigo: 889, genero: "Ficción", paises: ["Grecia"] },

  { codigo: 890, genero: "Ficción", paises: ["Diversos"] },

  { codigo: 891, genero: "Ficción", paises: ["Rusia", "Ucrania", "Polonia", "Republica Checa", "Eslovaquia", "Iran", "India (sanscrito e hindi)"] },
  { codigo: 891, genero: "Poesía", paises: ["Rusia", "Ucrania", "Polonia", "Republica Checa", "Eslovaquia", "Iran", "India (sanscrito e hindi)"] },
  { codigo: 891, genero: "Dramas", paises: ["Rusia", "Ucrania", "Polonia", "Republica Checa", "Eslovaquia", "Iran", "India (sanscrito e hindi)"] },
  { codigo: 891, genero: "Novela", paises: ["Rusia", "Ucrania", "Polonia", "Republica Checa", "Eslovaquia", "Iran", "India (sanscrito e hindi)"] },
  { codigo: 891, genero: "Cuentos", paises: ["Rusia", "Ucrania", "Polonia", "Republica Checa", "Eslovaquia", "Iran", "India (sanscrito e hindi)"] },
  { codigo: 891, genero: "Ensayo", paises: ["Rusia", "Ucrania", "Polonia", "Republica Checa", "Eslovaquia", "Iran", "India (sanscrito e hindi)"] },
  { codigo: 891, genero: "Discursos", paises: ["Rusia", "Ucrania", "Polonia", "Republica Checa", "Eslovaquia", "Iran", "India (sanscrito e hindi)"] },
  { codigo: 891, genero: "Cartas", paises: ["Rusia", "Ucrania", "Polonia", "Republica Checa", "Eslovaquia", "Iran", "India (sanscrito e hindi)"] },
  { codigo: 891, genero: "Humor, sátiras, etc.", paises: ["Rusia", "Ucrania", "Polonia", "Republica Checa", "Eslovaquia", "Iran", "India (sanscrito e hindi)"] },
  { codigo: 891, genero: "Formas mixtas", paises: ["Rusia", "Ucrania", "Polonia", "Republica Checa", "Eslovaquia", "Iran", "India (sanscrito e hindi)"] },

  { codigo: 892, genero: "Ficción", paises: ["Israel", "Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Etiopia"] },
  { codigo: 892, genero: "Poesía", paises: ["Israel", "Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Etiopia"] },
  { codigo: 892, genero: "Dramas", paises: ["Israel", "Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Etiopia"] },
  { codigo: 892, genero: "Novela", paises: ["Israel", "Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Etiopia"] },
  { codigo: 892, genero: "Cuentos", paises: ["Israel", "Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Etiopia"] },
  { codigo: 892, genero: "Ensayo", paises: ["Israel", "Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Etiopia"] },
  { codigo: 892, genero: "Discursos", paises: ["Israel", "Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Etiopia"] },
  { codigo: 892, genero: "Cartas", paises: ["Israel", "Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Etiopia"] },
  { codigo: 892, genero: "Humor, sátiras, etc.", paises: ["Israel", "Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Etiopia"] },
  { codigo: 892, genero: "Formas mixtas", paises: ["Israel", "Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Etiopia"] },

  { codigo: 893, genero: "Ficción", paises: ["Argelia", "Tunez", "Libia"] },
  { codigo: 893, genero: "Poesía", paises: ["Argelia", "Tunez", "Libia"] },
  { codigo: 893, genero: "Dramas", paises: ["Argelia", "Tunez", "Libia"] },
  { codigo: 893, genero: "Novela", paises: ["Argelia", "Tunez", "Libia"] },
  { codigo: 893, genero: "Cuentos", paises: ["Argelia", "Tunez", "Libia"] },
  { codigo: 893, genero: "Ensayo", paises: ["Argelia", "Tunez", "Libia"] },
  { codigo: 893, genero: "Discursos", paises: ["Argelia", "Tunez", "Libia"] },
  { codigo: 893, genero: "Cartas", paises: ["Argelia", "Tunez", "Libia"] },
  { codigo: 893, genero: "Humor, sátiras, etc.", paises: ["Argelia", "Tunez", "Libia"] },
  { codigo: 893, genero: "Formas mixtas", paises: ["Argelia", "Tunez", "Libia"] },

  { codigo: 894, genero: "Ficción", paises: ["Turquia", "Hungria", "Finlandia", "Estonia", "Mongolia"] },
  { codigo: 894, genero: "Poesía", paises: ["Turquia", "Hungria", "Finlandia", "Estonia", "Mongolia"] },
  { codigo: 894, genero: "Dramas", paises: ["Turquia", "Hungria", "Finlandia", "Estonia", "Mongolia"] },
  { codigo: 894, genero: "Novela", paises: ["Turquia", "Hungria", "Finlandia", "Estonia", "Mongolia"] },
  { codigo: 894, genero: "Cuentos", paises: ["Turquia", "Hungria", "Finlandia", "Estonia", "Mongolia"] },
  { codigo: 894, genero: "Ensayo", paises: ["Turquia", "Hungria", "Finlandia", "Estonia", "Mongolia"] },
  { codigo: 894, genero: "Discursos", paises: ["Turquia", "Hungria", "Finlandia", "Estonia", "Mongolia"] },
  { codigo: 894, genero: "Cartas", paises: ["Turquia", "Hungria", "Finlandia", "Estonia", "Mongolia"] },
  { codigo: 894, genero: "Humor, sátiras, etc.", paises: ["Turquia", "Hungria", "Finlandia", "Estonia", "Mongolia"] },
  { codigo: 894, genero: "Formas mixtas", paises: ["Turquia", "Hungria", "Finlandia", "Estonia", "Mongolia"] },

  { codigo: 895, genero: "Ficción", paises: ["Japon", "China", "Corea del Sur", "Corea del Norte", "Vietnam", "Tailandia"] },
  { codigo: 895, genero: "Poesía", paises: ["Japon", "China", "Corea del Sur", "Corea del Norte", "Vietnam", "Tailandia"] },
  { codigo: 895, genero: "Dramas", paises: ["Japon", "China", "Corea del Sur", "Corea del Norte", "Vietnam", "Tailandia"] },
  { codigo: 895, genero: "Novela", paises: ["Japon", "China", "Corea del Sur", "Corea del Norte", "Vietnam", "Tailandia"] },
  { codigo: 895, genero: "Cuentos", paises: ["Japon", "China", "Corea del Sur", "Corea del Norte", "Vietnam", "Tailandia"] },
  { codigo: 895, genero: "Ensayo", paises: ["Japon", "China", "Corea del Sur", "Corea del Norte", "Vietnam", "Tailandia"] },
  { codigo: 895, genero: "Discursos", paises: ["Japon", "China", "Corea del Sur", "Corea del Norte", "Vietnam", "Tailandia"] },
  { codigo: 895, genero: "Cartas", paises: ["Japon", "China", "Corea del Sur", "Corea del Norte", "Vietnam", "Tailandia"] },
  { codigo: 895, genero: "Humor, sátiras, etc.", paises: ["Japon", "China", "Corea del Sur", "Corea del Norte", "Vietnam", "Tailandia"] },
  { codigo: 895, genero: "Formas mixtas", paises: ["Japon", "China", "Corea del Sur", "Corea del Norte", "Vietnam", "Tailandia"] },

  { codigo: 896, genero: "Ficción", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896, genero: "Poesía", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896, genero: "Dramas", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896, genero: "Novela", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896, genero: "Cuentos", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896, genero: "Ensayo", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896, genero: "Discursos", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896, genero: "Cartas", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896, genero: "Humor, sátiras, etc.", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896, genero: "Formas mixtas", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },

  { codigo: 899, genero: "Ficción", paises: ["Indonesia", "Filipinas", "Malasia", "Camboya"] },
  { codigo: 899, genero: "Poesía", paises: ["Indonesia", "Filipinas", "Malasia", "Camboya"] },
  { codigo: 899, genero: "Dramas", paises: ["Indonesia", "Filipinas", "Malasia", "Camboya"] },
  { codigo: 899, genero: "Novela", paises: ["Indonesia", "Filipinas", "Malasia", "Camboya"] },
  { codigo: 899, genero: "Cuentos", paises: ["Indonesia", "Filipinas", "Malasia", "Camboya"] },
  { codigo: 899, genero: "Ensayo", paises: ["Indonesia", "Filipinas", "Malasia", "Camboya"] },
  { codigo: 899, genero: "Discursos", paises: ["Indonesia", "Filipinas", "Malasia", "Camboya"] },
  { codigo: 899, genero: "Cartas", paises: ["Indonesia", "Filipinas", "Malasia", "Camboya"] },
  { codigo: 899, genero: "Humor, sátiras, etc.", paises: ["Indonesia", "Filipinas", "Malasia", "Camboya"] },
  { codigo: 899, genero: "Formas mixtas", paises: ["Indonesia", "Filipinas", "Malasia", "Camboya"] },
]

export function getDatosDelDewey(codigo: Dewey | undefined | null): { genero: LiteraryFormLabel, paises: string[] } {
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

  if(['arg', 'argentino', 'a', 'ar'].includes(pais)) pais = 'Argentina'
  if(['eeuu', 'eu', 'ee uu', 'ee.uu'].includes(pais)) pais = 'Estados unidos'
  if(['uk', 'inglaterra', 'ingles', 'inglesa', 'britanico', 'britanica'].includes(pais)) pais = 'Reino Unido'
  if(['es', 'espanol', 'espanola', 'espana', 'esp'].includes(pais)) pais = 'España'
  if(['ch', 'chileno', 'chilena'].includes(pais)) pais = 'Chile'
  if(['brazil', 'brasilera', 'brazilera', 'brasilero', 'brazilero'].includes(pais)) pais = 'Brasil'
  if(['uru'].includes(pais)) pais = 'Uruguay'
  if(['venezolana', 'venezolano'].includes(pais)) pais = 'Venezuela'
  if(['mx', 'mexicano', 'mexicana'].includes(pais)) pais = 'Mexico'
  if(['roma'].includes(pais)) pais = 'Roma antigua'
  if(['japones', 'japonesa', 'nipon'].includes(pais)) pais = 'Japon'
  if(['aleman', 'alemana'].includes(pais)) pais = 'Alemania'
  if(['arabia'].includes(pais)) pais = 'Arabia Saudita'
  
  return pais.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export function getDeweyPorPaisYGenero(pais: string, genero: LiteraryFormLabel): Dewey | null {
  pais = formatCountry(pais)
  const entrada = deweyPaises.find(
    (item) => item.genero === genero && item.paises.includes(pais)
  )

  return entrada ? entrada.codigo : null
}

export const gruposLiterarios = [
  {
    label: "Literatura germana",
    paises: ["Alemania", "Austria", "Suiza"]
  },
  {
    label: "Literatura asiatica",
    paises: ["Japon", "China", "Corea del Sur", "India", "Vietnam"]
  },
  {
    label: "Literatura latinoamericana",
    paises: ["Argentina", "Mexico", "Colombia", "Chile", "Peru", "Cuba", "Uruguay", "Brasil"]
  },
  {
    label: "Literatura anglosajona",
    paises: ["Estados Unidos", "Reino Unido", "Canada", "Australia"]
  },
  {
    label: "Literatura francofona",
    paises: ["Francia", "Belgica", "Suiza", "Canada"]
  },
  {
    label: "Literatura nórdica",
    paises: ["Suecia", "Noruega", "Dinamarca", "Finlandia", "Islandia"]
  },
  {
    label: "Literatura eslava",
    paises: ["Rusia", "Polonia", "Republica Checa", "Ucrania"]
  },
  {
    label: "Literatura mediterranea",
    paises: ["Italia", "España", "Grecia", "Portugal"]
  }
]

export function getGrupoLiterario(pais: string | undefined) {
  if(!pais) return ""

  pais = formatCountry(pais)
  const grupo = gruposLiterarios.find(g =>
    g.paises.some(p => p === pais)
  )
  return grupo ? grupo.label : ""
}

export { deweyPaises }
export default deweyPaises
