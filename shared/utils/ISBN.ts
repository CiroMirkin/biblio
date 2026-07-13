import isbn3 from "isbn3"

export function formatISBN(digits: string): string {
    if (digits.length !== 10 && digits.length !== 13) return digits
    const parsed = isbn3.parse(digits)
    if (!parsed) return digits
    return parsed.isbn13h ?? parsed.isbn10h ?? digits
}

export function validateISBN(raw: string): boolean {
    if (!raw) return false

    const parsed = isbn3.parse(raw)
    return parsed?.isValid ?? false
}
