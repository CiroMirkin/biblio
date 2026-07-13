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
  { codigo: 891.7, genero: "Ficción", paises: ["Rusia"] },
  { codigo: 891.71, genero: "Poesía", paises: ["Rusia"] },
  { codigo: 891.72, genero: "Dramas", paises: ["Rusia"] },
  { codigo: 891.73, genero: "Novela", paises: ["Rusia"] },
  { codigo: 891.73, genero: "Cuentos", paises: ["Rusia"] },
  { codigo: 891.74, genero: "Ensayo", paises: ["Rusia"] },
  { codigo: 891.75, genero: "Discursos", paises: ["Rusia"] },
  { codigo: 891.76, genero: "Cartas", paises: ["Rusia"] },
  { codigo: 891.77, genero: "Humor, sátiras, etc.", paises: ["Rusia"] },
  { codigo: 891.78, genero: "Formas mixtas", paises: ["Rusia"] },

  { codigo: 891.79, genero: "Ficción", paises: ["Ucrania"] },
  { codigo: 891.791, genero: "Poesía", paises: ["Ucrania"] },
  { codigo: 891.792, genero: "Dramas", paises: ["Ucrania"] },
  { codigo: 891.793, genero: "Novela", paises: ["Ucrania"] },
  { codigo: 891.793, genero: "Cuentos", paises: ["Ucrania"] },
  { codigo: 891.794, genero: "Ensayo", paises: ["Ucrania"] },
  { codigo: 891.795, genero: "Discursos", paises: ["Ucrania"] },
  { codigo: 891.796, genero: "Cartas", paises: ["Ucrania"] },
  { codigo: 891.797, genero: "Humor, sátiras, etc.", paises: ["Ucrania"] },
  { codigo: 891.798, genero: "Formas mixtas", paises: ["Ucrania"] },

  { codigo: 891.85, genero: "Ficción", paises: ["Polonia"] },
  { codigo: 891.851, genero: "Poesía", paises: ["Polonia"] },
  { codigo: 891.852, genero: "Dramas", paises: ["Polonia"] },
  { codigo: 891.853, genero: "Novela", paises: ["Polonia"] },
  { codigo: 891.853, genero: "Cuentos", paises: ["Polonia"] },
  { codigo: 891.854, genero: "Ensayo", paises: ["Polonia"] },
  { codigo: 891.855, genero: "Discursos", paises: ["Polonia"] },
  { codigo: 891.856, genero: "Cartas", paises: ["Polonia"] },
  { codigo: 891.857, genero: "Humor, sátiras, etc.", paises: ["Polonia"] },
  { codigo: 891.858, genero: "Formas mixtas", paises: ["Polonia"] },

  { codigo: 891.86, genero: "Ficción", paises: ["Republica Checa"] },
  { codigo: 891.861, genero: "Poesía", paises: ["Republica Checa"] },
  { codigo: 891.862, genero: "Dramas", paises: ["Republica Checa"] },
  { codigo: 891.863, genero: "Novela", paises: ["Republica Checa"] },
  { codigo: 891.863, genero: "Cuentos", paises: ["Republica Checa"] },
  { codigo: 891.864, genero: "Ensayo", paises: ["Republica Checa"] },
  { codigo: 891.865, genero: "Discursos", paises: ["Republica Checa"] },
  { codigo: 891.866, genero: "Cartas", paises: ["Republica Checa"] },
  { codigo: 891.867, genero: "Humor, sátiras, etc.", paises: ["Republica Checa"] },
  { codigo: 891.868, genero: "Formas mixtas", paises: ["Republica Checa"] },

  { codigo: 891.87, genero: "Ficción", paises: ["Eslovaquia"] },
  { codigo: 891.871, genero: "Poesía", paises: ["Eslovaquia"] },
  { codigo: 891.872, genero: "Dramas", paises: ["Eslovaquia"] },
  { codigo: 891.873, genero: "Novela", paises: ["Eslovaquia"] },
  { codigo: 891.873, genero: "Cuentos", paises: ["Eslovaquia"] },
  { codigo: 891.874, genero: "Ensayo", paises: ["Eslovaquia"] },
  { codigo: 891.875, genero: "Discursos", paises: ["Eslovaquia"] },
  { codigo: 891.876, genero: "Cartas", paises: ["Eslovaquia"] },
  { codigo: 891.877, genero: "Humor, sátiras, etc.", paises: ["Eslovaquia"] },
  { codigo: 891.878, genero: "Formas mixtas", paises: ["Eslovaquia"] },

  { codigo: 891.55, genero: "Ficción", paises: ["Iran"] },
  { codigo: 891.551, genero: "Poesía", paises: ["Iran"] },
  { codigo: 891.552, genero: "Dramas", paises: ["Iran"] },
  { codigo: 891.553, genero: "Novela", paises: ["Iran"] },
  { codigo: 891.553, genero: "Cuentos", paises: ["Iran"] },
  { codigo: 891.554, genero: "Ensayo", paises: ["Iran"] },
  { codigo: 891.555, genero: "Discursos", paises: ["Iran"] },
  { codigo: 891.556, genero: "Cartas", paises: ["Iran"] },
  { codigo: 891.557, genero: "Humor, sátiras, etc.", paises: ["Iran"] },
  { codigo: 891.558, genero: "Formas mixtas", paises: ["Iran"] },

  { codigo: 891.1, genero: "Ficción", paises: ["India (sanscrito e hindi)"] },
  { codigo: 891.11, genero: "Poesía", paises: ["India (sanscrito e hindi)"] },
  { codigo: 891.12, genero: "Dramas", paises: ["India (sanscrito e hindi)"] },
  { codigo: 891.13, genero: "Novela", paises: ["India (sanscrito e hindi)"] },
  { codigo: 891.13, genero: "Cuentos", paises: ["India (sanscrito e hindi)"] },
  { codigo: 891.14, genero: "Ensayo", paises: ["India (sanscrito e hindi)"] },
  { codigo: 891.15, genero: "Discursos", paises: ["India (sanscrito e hindi)"] },
  { codigo: 891.16, genero: "Cartas", paises: ["India (sanscrito e hindi)"] },
  { codigo: 891.17, genero: "Humor, sátiras, etc.", paises: ["India (sanscrito e hindi)"] },
  { codigo: 891.18, genero: "Formas mixtas", paises: ["India (sanscrito e hindi)"] },

  { codigo: 892.4, genero: "Ficción", paises: ["Israel"] },
  { codigo: 892.41, genero: "Poesía", paises: ["Israel"] },
  { codigo: 892.42, genero: "Dramas", paises: ["Israel"] },
  { codigo: 892.43, genero: "Novela", paises: ["Israel"] },
  { codigo: 892.43, genero: "Cuentos", paises: ["Israel"] },
  { codigo: 892.44, genero: "Ensayo", paises: ["Israel"] },
  { codigo: 892.45, genero: "Discursos", paises: ["Israel"] },
  { codigo: 892.46, genero: "Cartas", paises: ["Israel"] },
  { codigo: 892.47, genero: "Humor, sátiras, etc.", paises: ["Israel"] },
  { codigo: 892.48, genero: "Formas mixtas", paises: ["Israel"] },

  { codigo: 892.7, genero: "Ficción", paises: ["Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Argelia", "Tunez", "Libia"] },
  { codigo: 892.71, genero: "Poesía", paises: ["Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Argelia", "Tunez", "Libia"] },
  { codigo: 892.72, genero: "Dramas", paises: ["Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Argelia", "Tunez", "Libia"] },
  { codigo: 892.73, genero: "Novela", paises: ["Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Argelia", "Tunez", "Libia"] },
  { codigo: 892.73, genero: "Cuentos", paises: ["Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Argelia", "Tunez", "Libia"] },
  { codigo: 892.74, genero: "Ensayo", paises: ["Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Argelia", "Tunez", "Libia"] },
  { codigo: 892.75, genero: "Discursos", paises: ["Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Argelia", "Tunez", "Libia"] },
  { codigo: 892.76, genero: "Cartas", paises: ["Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Argelia", "Tunez", "Libia"] },
  { codigo: 892.77, genero: "Humor, sátiras, etc.", paises: ["Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Argelia", "Tunez", "Libia"] },
  { codigo: 892.78, genero: "Formas mixtas", paises: ["Arabia Saudita", "Egipto", "Siria", "Iraq", "Marruecos", "Argelia", "Tunez", "Libia"] },

  { codigo: 892.8, genero: "Ficción", paises: ["Etiopia"] },
  { codigo: 892.81, genero: "Poesía", paises: ["Etiopia"] },
  { codigo: 892.82, genero: "Dramas", paises: ["Etiopia"] },
  { codigo: 892.83, genero: "Novela", paises: ["Etiopia"] },
  { codigo: 892.83, genero: "Cuentos", paises: ["Etiopia"] },
  { codigo: 892.84, genero: "Ensayo", paises: ["Etiopia"] },
  { codigo: 892.85, genero: "Discursos", paises: ["Etiopia"] },
  { codigo: 892.86, genero: "Cartas", paises: ["Etiopia"] },
  { codigo: 892.87, genero: "Humor, sátiras, etc.", paises: ["Etiopia"] },
  { codigo: 892.88, genero: "Formas mixtas", paises: ["Etiopia"] },

  { codigo: 894.35, genero: "Ficción", paises: ["Turquia"] },
  { codigo: 894.351, genero: "Poesía", paises: ["Turquia"] },
  { codigo: 894.352, genero: "Dramas", paises: ["Turquia"] },
  { codigo: 894.353, genero: "Novela", paises: ["Turquia"] },
  { codigo: 894.353, genero: "Cuentos", paises: ["Turquia"] },
  { codigo: 894.354, genero: "Ensayo", paises: ["Turquia"] },
  { codigo: 894.355, genero: "Discursos", paises: ["Turquia"] },
  { codigo: 894.356, genero: "Cartas", paises: ["Turquia"] },
  { codigo: 894.357, genero: "Humor, sátiras, etc.", paises: ["Turquia"] },
  { codigo: 894.358, genero: "Formas mixtas", paises: ["Turquia"] },

  { codigo: 894.511, genero: "Ficción", paises: ["Hungria"] },
  { codigo: 894.5111, genero: "Poesía", paises: ["Hungria"] },
  { codigo: 894.5112, genero: "Dramas", paises: ["Hungria"] },
  { codigo: 894.5113, genero: "Novela", paises: ["Hungria"] },
  { codigo: 894.5113, genero: "Cuentos", paises: ["Hungria"] },
  { codigo: 894.5114, genero: "Ensayo", paises: ["Hungria"] },
  { codigo: 894.5115, genero: "Discursos", paises: ["Hungria"] },
  { codigo: 894.5116, genero: "Cartas", paises: ["Hungria"] },
  { codigo: 894.5117, genero: "Humor, sátiras, etc.", paises: ["Hungria"] },
  { codigo: 894.5118, genero: "Formas mixtas", paises: ["Hungria"] },

  { codigo: 894.541, genero: "Ficción", paises: ["Finlandia"] },
  { codigo: 894.5411, genero: "Poesía", paises: ["Finlandia"] },
  { codigo: 894.5412, genero: "Dramas", paises: ["Finlandia"] },
  { codigo: 894.5413, genero: "Novela", paises: ["Finlandia"] },
  { codigo: 894.5413, genero: "Cuentos", paises: ["Finlandia"] },
  { codigo: 894.5414, genero: "Ensayo", paises: ["Finlandia"] },
  { codigo: 894.5415, genero: "Discursos", paises: ["Finlandia"] },
  { codigo: 894.5416, genero: "Cartas", paises: ["Finlandia"] },
  { codigo: 894.5417, genero: "Humor, sátiras, etc.", paises: ["Finlandia"] },
  { codigo: 894.5418, genero: "Formas mixtas", paises: ["Finlandia"] },

  { codigo: 894.545, genero: "Ficción", paises: ["Estonia"] },
  { codigo: 894.5451, genero: "Poesía", paises: ["Estonia"] },
  { codigo: 894.5452, genero: "Dramas", paises: ["Estonia"] },
  { codigo: 894.5453, genero: "Novela", paises: ["Estonia"] },
  { codigo: 894.5453, genero: "Cuentos", paises: ["Estonia"] },
  { codigo: 894.5454, genero: "Ensayo", paises: ["Estonia"] },
  { codigo: 894.5455, genero: "Discursos", paises: ["Estonia"] },
  { codigo: 894.5456, genero: "Cartas", paises: ["Estonia"] },
  { codigo: 894.5457, genero: "Humor, sátiras, etc.", paises: ["Estonia"] },
  { codigo: 894.5458, genero: "Formas mixtas", paises: ["Estonia"] },

  { codigo: 894.2, genero: "Ficción", paises: ["Mongolia"] },
  { codigo: 894.21, genero: "Poesía", paises: ["Mongolia"] },
  { codigo: 894.22, genero: "Dramas", paises: ["Mongolia"] },
  { codigo: 894.23, genero: "Novela", paises: ["Mongolia"] },
  { codigo: 894.23, genero: "Cuentos", paises: ["Mongolia"] },
  { codigo: 894.24, genero: "Ensayo", paises: ["Mongolia"] },
  { codigo: 894.25, genero: "Discursos", paises: ["Mongolia"] },
  { codigo: 894.26, genero: "Cartas", paises: ["Mongolia"] },
  { codigo: 894.27, genero: "Humor, sátiras, etc.", paises: ["Mongolia"] },
  { codigo: 894.28, genero: "Formas mixtas", paises: ["Mongolia"] },

  { codigo: 895.1, genero: "Ficción", paises: ["China"] },
  { codigo: 895.11, genero: "Poesía", paises: ["China"] },
  { codigo: 895.12, genero: "Dramas", paises: ["China"] },
  { codigo: 895.13, genero: "Novela", paises: ["China"] },
  { codigo: 895.13, genero: "Cuentos", paises: ["China"] },
  { codigo: 895.14, genero: "Ensayo", paises: ["China"] },
  { codigo: 895.15, genero: "Discursos", paises: ["China"] },
  { codigo: 895.16, genero: "Cartas", paises: ["China"] },
  { codigo: 895.17, genero: "Humor, sátiras, etc.", paises: ["China"] },
  { codigo: 895.18, genero: "Formas mixtas", paises: ["China"] },

  { codigo: 895.6, genero: "Ficción", paises: ["Japon"] },
  { codigo: 895.61, genero: "Poesía", paises: ["Japon"] },
  { codigo: 895.62, genero: "Dramas", paises: ["Japon"] },
  { codigo: 895.63, genero: "Novela", paises: ["Japon"] },
  { codigo: 895.63, genero: "Cuentos", paises: ["Japon"] },
  { codigo: 895.64, genero: "Ensayo", paises: ["Japon"] },
  { codigo: 895.65, genero: "Discursos", paises: ["Japon"] },
  { codigo: 895.66, genero: "Cartas", paises: ["Japon"] },
  { codigo: 895.67, genero: "Humor, sátiras, etc.", paises: ["Japon"] },
  { codigo: 895.68, genero: "Formas mixtas", paises: ["Japon"] },

  { codigo: 895.7, genero: "Ficción", paises: ["Corea del Sur", "Corea del Norte", "Corea"] },
  { codigo: 895.71, genero: "Poesía", paises: ["Corea del Sur", "Corea del Norte", "Corea"] },
  { codigo: 895.72, genero: "Dramas", paises: ["Corea del Sur", "Corea del Norte", "Corea"] },
  { codigo: 895.73, genero: "Novela", paises: ["Corea del Sur", "Corea del Norte", "Corea"] },
  { codigo: 895.73, genero: "Cuentos", paises: ["Corea del Sur", "Corea del Norte", "Corea"] },
  { codigo: 895.74, genero: "Ensayo", paises: ["Corea del Sur", "Corea del Norte", "Corea"] },
  { codigo: 895.75, genero: "Discursos", paises: ["Corea del Sur", "Corea del Norte", "Corea"] },
  { codigo: 895.76, genero: "Cartas", paises: ["Corea del Sur", "Corea del Norte", "Corea"] },
  { codigo: 895.77, genero: "Humor, sátiras, etc.", paises: ["Corea del Sur", "Corea del Norte", "Corea"] },
  { codigo: 895.78, genero: "Formas mixtas", paises: ["Corea del Sur", "Corea del Norte", "Corea"] },

  { codigo: 895.9223, genero: "Ficción", paises: ["Vietnam"] },
  { codigo: 895.92231, genero: "Poesía", paises: ["Vietnam"] },
  { codigo: 895.92232, genero: "Dramas", paises: ["Vietnam"] },
  { codigo: 895.92233, genero: "Novela", paises: ["Vietnam"] },
  { codigo: 895.92233, genero: "Cuentos", paises: ["Vietnam"] },
  { codigo: 895.92234, genero: "Ensayo", paises: ["Vietnam"] },
  { codigo: 895.92235, genero: "Discursos", paises: ["Vietnam"] },
  { codigo: 895.92236, genero: "Cartas", paises: ["Vietnam"] },
  { codigo: 895.92237, genero: "Humor, sátiras, etc.", paises: ["Vietnam"] },
  { codigo: 895.92238, genero: "Formas mixtas", paises: ["Vietnam"] },

  { codigo: 895.9591, genero: "Ficción", paises: ["Tailandia"] },
  { codigo: 895.95911, genero: "Poesía", paises: ["Tailandia"] },
  { codigo: 895.95912, genero: "Dramas", paises: ["Tailandia"] },
  { codigo: 895.95913, genero: "Novela", paises: ["Tailandia"] },
  { codigo: 895.95913, genero: "Cuentos", paises: ["Tailandia"] },
  { codigo: 895.95914, genero: "Ensayo", paises: ["Tailandia"] },
  { codigo: 895.95915, genero: "Discursos", paises: ["Tailandia"] },
  { codigo: 895.95916, genero: "Cartas", paises: ["Tailandia"] },
  { codigo: 895.95917, genero: "Humor, sátiras, etc.", paises: ["Tailandia"] },
  { codigo: 895.95918, genero: "Formas mixtas", paises: ["Tailandia"] },

  { codigo: 895.93, genero: "Ficción", paises: ["Camboya"] },
  { codigo: 895.931, genero: "Poesía", paises: ["Camboya"] },
  { codigo: 895.932, genero: "Dramas", paises: ["Camboya"] },
  { codigo: 895.933, genero: "Novela", paises: ["Camboya"] },
  { codigo: 895.933, genero: "Cuentos", paises: ["Camboya"] },
  { codigo: 895.934, genero: "Ensayo", paises: ["Camboya"] },
  { codigo: 895.935, genero: "Discursos", paises: ["Camboya"] },
  { codigo: 895.936, genero: "Cartas", paises: ["Camboya"] },
  { codigo: 895.937, genero: "Humor, sátiras, etc.", paises: ["Camboya"] },
  { codigo: 895.938, genero: "Formas mixtas", paises: ["Camboya"] },

  { codigo: 896.3, genero: "Ficción", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896.31, genero: "Poesía", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896.32, genero: "Dramas", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896.33, genero: "Novela", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896.33, genero: "Cuentos", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896.34, genero: "Ensayo", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896.35, genero: "Discursos", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896.36, genero: "Cartas", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896.37, genero: "Humor, sátiras, etc.", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },
  { codigo: 896.38, genero: "Formas mixtas", paises: ["Nigeria", "Kenia", "Ghana", "Sudan", "Sudafrica (lenguas africanas)"] },

  { codigo: 899.211, genero: "Ficción", paises: ["Filipinas"] },
  { codigo: 899.2111, genero: "Poesía", paises: ["Filipinas"] },
  { codigo: 899.2112, genero: "Dramas", paises: ["Filipinas"] },
  { codigo: 899.2113, genero: "Novela", paises: ["Filipinas"] },
  { codigo: 899.2113, genero: "Cuentos", paises: ["Filipinas"] },
  { codigo: 899.2114, genero: "Ensayo", paises: ["Filipinas"] },
  { codigo: 899.2115, genero: "Discursos", paises: ["Filipinas"] },
  { codigo: 899.2116, genero: "Cartas", paises: ["Filipinas"] },
  { codigo: 899.2117, genero: "Humor, sátiras, etc.", paises: ["Filipinas"] },
  { codigo: 899.2118, genero: "Formas mixtas", paises: ["Filipinas"] },

  { codigo: 899.221, genero: "Ficción", paises: ["Indonesia", "Malasia"] },
  { codigo: 899.2211, genero: "Poesía", paises: ["Indonesia", "Malasia"] },
  { codigo: 899.2212, genero: "Dramas", paises: ["Indonesia", "Malasia"] },
  { codigo: 899.2213, genero: "Novela", paises: ["Indonesia", "Malasia"] },
  { codigo: 899.2213, genero: "Cuentos", paises: ["Indonesia", "Malasia"] },
  { codigo: 899.2214, genero: "Ensayo", paises: ["Indonesia", "Malasia"] },
  { codigo: 899.2215, genero: "Discursos", paises: ["Indonesia", "Malasia"] },
  { codigo: 899.2216, genero: "Cartas", paises: ["Indonesia", "Malasia"] },
  { codigo: 899.2217, genero: "Humor, sátiras, etc.", paises: ["Indonesia", "Malasia"] },
  { codigo: 899.2218, genero: "Formas mixtas", paises: ["Indonesia", "Malasia"] },
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
  if(['vietnamita'].includes(pais)) pais = 'Vietnam'

  if(['corea del sur'].includes(pais)) return 'Corea del Sur'
  if(['corea del norte'].includes(pais)) return 'Corea del Norte'
  
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
