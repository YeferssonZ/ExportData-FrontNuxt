<template>
  <div>
    <button @click="showExportDialog('excel')">Exportar a Excel</button>
    <button @click="showExportDialog('csv')">Exportar a CSV</button>
  </div>
</template>

<script>
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { parse } from 'json2csv';

export default {
  data() {
    return {
      apiData: [],
    };
  },
  async mounted() {
    try {
      const response = await fetch('http://192.168.1.101:9000/api/spectral');
      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        this.apiData = data;
      } else {
        console.error('La respuesta de la API no contiene datos válidos');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  },
  methods: {
    async showExportDialog(format) {
      const fileName = prompt('Ingrese el nombre del archivo:', 'Informe');
      if (fileName) {
        if (format === 'excel') {
          this.exportToExcel(fileName);
        } else if (format === 'csv') {
          this.exportToCSV(fileName);
        }
      }
    },
    exportToExcel(fileName) {
      if (this.apiData.length > 0) {
        const excelData = this.transformToExcelFormat(this.apiData);
        this.downloadFile(excelData, fileName, 'xlsx');
      } else {
        console.error('No se encontraron datos para exportar a Excel');
      }
    },
    exportToCSV(fileName) {
      if (this.apiData.length > 0) {
        const csvData = this.transformToCSVFormat(this.apiData);
        this.downloadFile(csvData, fileName, 'csv');
      } else {
        console.error('No se encontraron datos válidos para exportar a CSV');
      }
    },
    transformToExcelFormat(data) {
      const excelData = [];

      data.forEach((item) => {
        const excelItem = {
          'ID': item.id,
          'Frecuencia Máxima': item.frecMax,
          'Modo X Frecuencia': item.modoX.frecuencia.join(','),
          'Modo X Amplitud': item.modoX.amplitud.join(','),
          'Modo Y Frecuencia': item.modoY.frecuencia.join(','),
          'Modo Y Amplitud': item.modoY.amplitud.join(','),
          'Modo Z Frecuencia': item.modoZ.frecuencia.join(','),
          'Modo Z Amplitud': item.modoZ.amplitud.join(','),
        };
        excelData.push(excelItem);
      });

      return excelData;
    },
    transformToCSVFormat(data) {
      const csvData = [];

      data.forEach((item) => {
        const csvItem = {
          'ID': item.id,
          'Frecuencia Máxima': item.frecMax,
          'Modo X Frecuencia': item.modoX.frecuencia.join(','),
          'Modo X Amplitud': item.modoX.amplitud.join(','),
          'Modo Y Frecuencia': item.modoY.frecuencia.join(','),
          'Modo Y Amplitud': item.modoY.amplitud.join(','),
          'Modo Z Frecuencia': item.modoZ.frecuencia.join(','),
          'Modo Z Amplitud': item.modoZ.amplitud.join(','),
        };
        csvData.push(csvItem);
      });

      return csvData;
    },
    downloadFile(data, fileName, format) {
      if (format === 'xlsx') {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
      } else if (format === 'csv') {
        const csv = parse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${fileName}.csv`);
      }
    },
  },
};
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
