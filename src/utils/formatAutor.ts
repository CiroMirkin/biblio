
export const formatAutor = (autor: string) => (
    autor.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
)