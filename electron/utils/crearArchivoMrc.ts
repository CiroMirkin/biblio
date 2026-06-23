import fs from 'fs'
import { Record } from 'marcjs'
import { getLibros } from '../handlers/libros'
import type { Marc21, Marc21EnPrestamo } from '../models/marc21'


export async function excelAMrc(outputPath: string): Promise<void> {
    const libros = await getLibros()

    if (libros.length === 0) {
        console.log('No se encontraron registros validos.')
        return
    }

    const chunks = libros.filter(l => "holding" in l).map(libro =>
        Buffer.from(libroToRecord(libro).as('iso2709'), 'binary')
    )
    fs.writeFileSync(outputPath, Buffer.concat(chunks))
}

function libroToRecord(libro: Marc21): InstanceType<typeof Record> {
    const record = new Record()
    const itemType = libro.itemType || 'BK'

    // Deberia asignarlo Koha a importar los datos
    record.append(['001', ""])
    
    record.append(
        ['003', 'LOCAL'],
        ['008', buildField008(libro)],
    )

    record.append(['040', '  ', 'a', 'LOCAL', 'b', 'spa', 'c', 'LOCAL'])

    if (libro.autor) {
        record.append(['100', '1 ', 'a', libro.autor])
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

    record.append(['942', '  ', 'c', itemType])

    const subs952: string[] = [
        'b', libro.holding.homeBranch       || 'CENTRAL',
        'p', libro.holding.barcode,
        'y', itemType,
    ]
    if (libro.holding.holdingBranch) subs952.push('a', libro.holding.holdingBranch)
    if (libro.holding.callNumber)    subs952.push('o', libro.holding.callNumber)
    if (libro.holding.publicNote)    subs952.push('z', libro.holding.publicNote)

    record.append(['952', '  ', ...subs952])

    return record
}


function buildField008(libro: Marc21EnPrestamo): string {
    const year     = (libro.publicationYear ?? '').padEnd(4, ' ').slice(0, 4)
    const literary = libro.literaryForm ?? '0'
    return `000000s${year}    xx            00${literary}0 spa d`.slice(0, 40).padEnd(40, ' ')
}
