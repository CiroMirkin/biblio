# Registro MARC: El oso y el dragón

**Autor:** Tom Clancy
**ISBN:** 9500724383
**Fuente:** koha-2.mrc (registro numero 1853 del archivo)

## Cabecera y campos de control

| Campo | Contenido | Significado |
|---|---|---|
| LDR | 00673nam a2200241ua 4500 | Lider del registro (longitud, tipo de material: nam = libro/monografia) |
| 001 | 8987 | Numero de control del registro (biblionumber en Koha) |
| 003 | 1312 | Identificador de la agencia que asigno el 001 |
| 005 | 20260706203337.0 | Fecha y hora de la ultima transaccion/modificacion |
| 008 | 040218s2003.... | Datos codificados de longitud fija: fecha de catalogacion (040218), año de publicacion (2003) |

## Campos de datos bibliograficos

| Campo | Subcampo | Contenido | Significado |
|---|---|---|---|
| 020 | $a | 9500724383 | ISBN |
| 040 | $a $b $c $d | 1312 / spa / 1312 / 1312 | Centro catalogador, idioma de catalogacion (spa = español), centro que transcribe, centro que modifica |
| 100 | 1- $a | Clancy, Tom, 1947-2013 | Autor principal (persona), indicador 1 = apellido primero |
| 245 | 10 $a | El oso y el dragon | Titulo propiamente dicho (indicadores 1,0 = con punto de acceso, sin articulo a omitir) |
| 250 | $a | 1a. ed. | Mencion de edicion |
| 260 | $a $b $c | Buenos Aires / Sudamericana / 2003 | Lugar de publicacion, editorial, año |
| 300 | $a | 896 p. | Descripcion fisica (paginas) |
| 650 (x3) | $a | Literatura estadounidense / Novela / Ciber espionaje | Materias/temas (encabezamientos de materia), uno por cada campo 650 repetido |
| 900 | $a | Dolores | Campo local (probablemente sucursal/coleccion local, no estandar MARC) |

> El **ISBN** está en el campo 020 (subcampo $a) y el **numero de inventario** esta en el campo 952 (subcampo $p, ej: $p12032) como barcode/código de barras del ítem.

> El **tipo de item** ("LIB" en 942$c y 952$y) es el código propio de esta instancia de Koha. El sistema lo traduce internamente a su propio código ("BK") al importar, y lo traduce de vuelta a "LIB" al exportar hacia Koha. Ver la tabla de conversión en `mrcToLibro.ts` y `crearArchivoMrc.ts`.

## Campos propios de Koha (locales)

| Campo | Subcampo | Contenido | Significado |
|---|---|---|---|
| 942 | $c $2 | LIB / udc | Tipo de item por defecto (LIB) y esquema de clasificacion (udc = CDU) |
| 999 | $c $d | 2144 / 2144 | biblionumber y biblioitemnumber internos de Koha |
| 952 | $0 | 0 | Withdrawn status |
| 952 | $1 | 0 | Lost status |
| 952 | $4 | 0 | Damaged status |
| 952 | $6 | N_813_CLA | Clasificacion normalizada (para ordenar) |
| 952 | $7 | 0 | Not for loan status |
| 952 | $9 | 4971 | itemnumber (identificador unico del item) |
| 952 | $a $b | 3983 / 3983 | Biblioteca de origen / biblioteca actual (homebranch / holdingbranch) |
| 952 | $c | NOV | Ubicacion/estanteria (shelving location) |
| 952 | $d | 2026-07-06 | Fecha de adquisicion |
| 952 | $o | N 813 CLA | Signatura topografica (call number) |
| 952 | $p | 12032 | Codigo de barras (barcode) |
| 952 | $r | 2026-07-06 | Fecha de ultima vez visto (datelastseen) |
| 952 | $t | 1 | Numero de copia |
| 952 | $w | 2026-07-06 | Fecha de ultima modificacion de precio/estado |
| 952 | $y | LIB | Tipo de item (itype) |

## Resumen

Los datos bibliograficos clasicos (autor, titulo, edicion, editorial, año, paginas, materias, ISBN) estan en los campos 020, 040, 100, 245, 250, 260, 300 y 650. Toda la informacion del item fisico (ejemplar) -codigo de barras, ubicacion, sucursal, signatura, fechas- esta concentrada en el campo 952, que es el campo de holdings/items propio de Koha.

## Registro MARC crudo

```
=LDR  00673nam a2200241ua 4500
=001  8987
=003  1312
=005  20260706203337.0
=008  040218s2003\\\\|||||||||||||||||\||||||c
=020  \\$a9500724383
=040  \\$a1312$bspa$c1312$d1312
=100  1\$aClancy, Tom, 1947-2013
=245  10$aEl oso y el dragon
=250  \\$a1a. ed.
=260  \\$aBuenos Aires$bSudamericana$c2003
=300  \\$a896 p.
=650  \\$aLiteratura estadounidense
=650  \\$aNovela
=650  \\$aCiber espionaje
=900  \\$aDolores
=942  \\$cLIB$2udc
=999  \\$c2144$d2144
=952  \\$00$10$40$6N_813_CLA$70$94971$a3983$b3983$cNOV$d2026-07-06$oN 813 CLA$p12032$r2026-07-06$t1$w2026-07-06$yLIB
```