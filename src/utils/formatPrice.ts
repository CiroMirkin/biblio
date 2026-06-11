
/** 1000 -> "1.000" */
export const formatPrice = (price: number): string => `$${price.toLocaleString("es-PY")}`