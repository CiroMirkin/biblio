declare module 'marcjs' {
    type FieldArray = [tag: string, ...rest: string[]]

    class Record {
        leader: string
        fields: FieldArray[]

        append(...fields: FieldArray[]): this
        delete(match: RegExp | string): this
        get(match: RegExp | string): FieldArray[]
        clone(): Record
        as(format: 'iso2709' | 'marcxml' | 'json' | 'mij' | 'text'): string
        mij(): object
    }

    export { Record }
}