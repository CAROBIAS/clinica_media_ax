export function calcularMedia(items) {
  if (!items || items.length === 0) return 0;

  const suma = items.reduce((acc, item) => acc + Number(item.cantidad), 0);
  return parseFloat((suma / items.length).toFixed(2));
}

export function calcularMediana(items) {
  if (!items || items.length === 0) return 0;

  const cantidades = items
    .map(item => Number(item.cantidad))
    .sort((a, b) => a - b);

  const mitad = Math.floor(cantidades.length / 2);

  if (cantidades.length % 2 !== 0) {
    return parseFloat(cantidades[mitad].toFixed(2));
  }

  return parseFloat(
    ((cantidades[mitad - 1] + cantidades[mitad]) / 2).toFixed(2)
  );
}

export function calcularModa(items) {
  if (!items || items.length === 0) {
    return { moda: 'N/D', descripcion: 'Sin datos', tipo: 'indeterminada' };
  }

  const maxCantidad = Math.max(...items.map(item => Number(item.cantidad)));
  const dominantes = items.filter(item => Number(item.cantidad) === maxCantidad);

  if (dominantes.length === items.length && items.length > 1) {
    return { moda: 'N/D', descripcion: 'No determinada', tipo: 'indeterminada' };
  }

  if (dominantes.length === 1) {
    return { moda: dominantes[0].nombre, cantidad: maxCantidad, tipo: 'unica' };
  }

  return {
    moda: dominantes.map(item => item.nombre),
    cantidad: maxCantidad,
    tipo: 'multiple',
  };
}