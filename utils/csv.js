import { parse } from 'json2csv';
import { saveAs } from 'file-saver';

export function exportToCSV(data, fileName) {
  const csvData = [];

  data.forEach((item) => {
    const modoX = item.modoX.frecuencia.map((frec, index) => ({
      Frecuencia: frec,
      Amplitud: item.modoX.amplitud[index],
      Modo: 'X',
    }));

    const modoY = item.modoY.frecuencia.map((frec, index) => ({
      Frecuencia: frec,
      Amplitud: item.modoY.amplitud[index],
      Modo: 'Y',
    }));

    const modoZ = item.modoZ.frecuencia.map((frec, index) => ({
      Frecuencia: frec,
      Amplitud: item.modoZ.amplitud[index],
      Modo: 'Z',
    }));

    csvData.push(...modoX, ...modoY, ...modoZ);
  });

  const csv = parse(csvData, { fields: ["Modo", "Frecuencia", "Amplitud"], header: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}.csv`);
}