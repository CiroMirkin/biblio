
export function validateISBN(raw: string): boolean {
    const cleaned = raw.replace(/[-\s]/g, '')

    if (cleaned.length === 13) {
        if (!/^\d{13}$/.test(cleaned)) return false
        if (!cleaned.startsWith('978') && !cleaned.startsWith('979')) return false

        const sum = cleaned
            .slice(0, 12)
            .split('')
            .reduce((acc, d, i) => acc + parseInt(d) * (i % 2 === 0 ? 1 : 3), 0)
        const check = (10 - (sum % 10)) % 10
        return check === parseInt(cleaned[12])
    }

    if (cleaned.length === 10) {
        if (!/^\d{9}[\dX]$/.test(cleaned)) return false

        const sum = cleaned
            .split('')
            .reduce((acc, d, i) => acc + (d === 'X' ? 10 : parseInt(d)) * (i + 1), 0)
        return sum % 11 === 0
    }

    return false
}
