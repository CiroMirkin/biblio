import fs from 'fs'
import { Record } from 'marcjs'
import { getLibros } from '../handlers/libros'
import { isMarc21 } from "@shared/models"
import { type Marc21 } from "@shared/models/marc21"
import { get } from '../settings'

/**
 * El sistema usa sus propios codigos de itemtype, distintos a los de Koha.
 * 
 * Biblio usa "BK" y Koha usa "LIB".
 */
const ITEM_TYPE_SISTEMA_A_KOHA: { [codigo: string]: string } = {
    BK: 'LIB',
}

function itemTypeHaciaKoha(codigo: string | undefined): string {
    if (!codigo) return 'LIB'
    return ITEM_TYPE_SISTEMA_A_KOHA[codigo] ?? codigo
}

export async function excelAMrc(outputPath: string, excluirSinIsbn = true): Promise<void> {
    const libros = await getLibros()

    if (libros.length === 0) {
        console.log('No se encontraron registros validos.')
        return
    }

    const librosFiltrados = excluirSinIsbn
        ? libros.filter(libro => isMarc21(libro) && !!libro.holding.barcode)
        : libros

    if (librosFiltrados.length === 0) {
        console.log('No se encontraron registros validos.')
        return
    }

    const chunks = librosFiltrados.map(libro => {
        if(isMarc21(libro)) {
            const raw = libroToRecord(libro).as('iso2709')
            return Buffer.from(raw, 'utf8')
        }
        else {
            const branch = get('nombreBiblioteca')
            const markLibro: Marc21 = {
                ...libro,
                itemType: 'BK',
                holding: {
                    holdingBranch: branch,
                    homeBranch: branch,
                }
            }
            const raw = libroToRecord(markLibro).as('iso2709')
            return Buffer.from(raw, 'utf8')
        }
    })
    fs.writeFileSync(outputPath, Buffer.concat(chunks))
}

function libroToRecord(libro: Marc21): InstanceType<typeof Record> {
    const record = new Record()
    const leader = '01197nam  22002891  4500'
    record.leader = leader.substring(0, 9) + 'a' + leader.substring(10)
    const itemType = itemTypeHaciaKoha(libro.itemType)

    // Deberia asignarlo Koha al importar los datos
    record.append(['001', ""])

    record.append(
        ['003', 'LOCAL'],
        ['008', buildField008(libro)],
    )

    record.append(['040', '  ', 'a', 'LOCAL', 'b', 'spa', 'c', 'LOCAL'])

    if (libro.holding.barcode) {
        record.append(['020', '  ', 'a', libro.holding.barcode])
    }

    if (libro.autor) {
        record.append(['100', '1 ', 'a', libro.autor])
    }

    if (libro.authorCountry) {
        record.append(['386', '  ', 'a', libro.authorCountry, 'm', 'nationality/regional group'])
    }

    if (libro.titulo) {
        record.append(['245', libro.autor ? '10' : '00', 'a', libro.titulo])
    }

    if (libro.edition) {
        record.append(['250', '  ', 'a', libro.edition])
    }

    const subs260: string[] = []
    if (libro.placeOfPublication) subs260.push('a', libro.placeOfPublication)
    if (libro.publisher)          subs260.push('b', libro.publisher)
    if (libro.publicationYear)    subs260.push('c', libro.publicationYear)
    if (subs260.length) {
        record.append(['260', '  ', ...subs260])
    }

    if (libro.dewey !== undefined) {
        record.append(['082', '0 ', 'a', String(libro.dewey)])
    }

    record.append(['942', '  ', 'c', itemType])

    const subs952: string[] = [
        'a', libro.holding.homeBranch || 'CENTRAL',
    ]
    if (libro.holding.holdingBranch) subs952.push('b', libro.holding.holdingBranch)
    subs952.push('y', itemType)
    if (libro.holding.callNumber) {
        subs952.push('o', libro.holding.callNumber)
    }
    if (libro.holding.publicNote)    subs952.push('z', libro.holding.publicNote)
    if (libro.numeroInventario)      subs952.push('p', String(libro.numeroInventario))

    record.append(['952', '  ', ...subs952])

    return record
}

function buildField008(libro: Marc21): string {
    const year     = (libro.publicationYear ?? '').padEnd(4, ' ').slice(0, 4)
    const literary = libro.literaryForm ?? '0'
    return `000000s${year}    xx            00${literary}0 spa d`.slice(0, 40).padEnd(40, ' ')
}
