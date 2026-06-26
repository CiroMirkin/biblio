declare module 'marcjs' {
    import { Duplex, DuplexOptions } from 'stream'

    type ControlField = [tag: string, value: string]
    type VariableField = [tag: string, indicators: string, ...subfieldPairs: string[]]
    type FieldArray = ControlField | VariableField

    type GetControlFieldResult = { tag: string; value: string }
    type GetVariableFieldResult = {
        tag: string
        ind1: string
        ind2: string
        subf: [code: string, value: string][]
    }
    type GetFieldResult = GetControlFieldResult | GetVariableFieldResult

    interface MijRecord {
        leader: string
        fields: Record<string, string | { ind1: string; ind2: string; subfields: Record<string, string>[] }>[]
    }

    class Record {
        leader: string
        fields: FieldArray[]

        constructor()
        clone(): Record
        append(...fields: FieldArray[]): this
        get(match: string | RegExp): GetFieldResult[]
        delete(match: string | RegExp): this
        match(match: string | RegExp, cb: (field: GetFieldResult) => void): void
        mij(): MijRecord
        as(format: 'iso2709' | 'marcxml' | 'json' | 'mij' | 'text'): string
    }

    interface StreamOptions extends DuplexOptions {
        readableHighWaterMark?: number
        writableHighWaterMark?: number
    }

    class Iso2709Parser extends Duplex {
        constructor(options?: StreamOptions)
        static parse(data: Buffer): Record
    }

    class Iso2709Formater extends Duplex {
        constructor(options?: StreamOptions)
        static format(record: Record): string
    }

    class MarcxmlFormater extends Duplex {
        constructor(options?: StreamOptions)
        static format(record: Record): string
    }

    class MiJParser extends Duplex {
        constructor(options?: StreamOptions)
        static parse(data: string): Record
    }

    class MiJFormater extends Duplex {
        constructor(options?: StreamOptions)
        static format(record: Record): string
    }

    class JsonFormater extends Duplex {
        constructor(options?: StreamOptions)
        static format(record: Record): string
    }

    class TextFormater extends Duplex {
        constructor(options?: StreamOptions)
        static format(record: Record): string
    }

    import { Transform as NodeTransform } from 'stream'
    class Transform extends NodeTransform {
        constructor(trans: (record: Record) => void)
    }

    const Marc: {
        formater: {
            iso2709: typeof Iso2709Formater.format
            marcxml: typeof MarcxmlFormater.format
            mij: typeof MiJFormater.format
            text: typeof TextFormater.format
            json: typeof JsonFormater.format
        }
        parser: {
            iso2709: typeof Iso2709Parser.parse
            marcxml: (data: string) => Record
            mij: typeof MiJParser.parse
        }
        parse(raw: string | Buffer, type: 'iso2709' | 'marcxml' | 'mij'): Record
        format(record: Record, type: 'iso2709' | 'marcxml' | 'mij' | 'text' | 'json'): string
        transform(trans: (record: Record) => void): Transform
        createStream(
            type: 'iso2709' | 'marcxml' | 'mij' | 'json' | 'text',
            what: 'parser' | 'formater'
        ): Duplex
    }

    export {
        Marc,
        Record,
        Iso2709Parser,
        Iso2709Formater,
        MarcxmlFormater,
        MiJParser,
        MiJFormater,
        JsonFormater,
        TextFormater,
        Transform,
    }
}