import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficoBarras = ({ datos, titulo = "Rendimiento por Módulos", tipo = "modulos" }) => {
  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">{titulo}</h3>
        <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico</p>
      </div>
    );
  }

  // Preparar datos según el tipo
  let labels, dataPoints, colors;

  if (tipo === "modulos") {
    // Para módulos, calcular promedios
    const modulosStats = {};
    
    datos.forEach(entrevista => {
      if (entrevista.resultados) {
        entrevista.resultados.forEach(resultado => {
          if (!modulosStats[resultado.modulo]) {
            modulosStats[resultado.modulo] = { total: 0, count: 0 };
          }
          modulosStats[resultado.modulo].total += resultado.puntos;
          modulosStats[resultado.modulo].count += 1;
        });
      }
    });

    const modulosConPromedio = Object.entries(modulosStats)
      .map(([modulo, stats]) => ({
        modulo,
        promedio: stats.total / stats.count
      }))
      .sort((a, b) => b.promedio - a.promedio);

    labels = modulosConPromedio.map(m => m.modulo);
    dataPoints = modulosConPromedio.map(m => m.promedio);
    colors = dataPoints.map((_, index) => {
      const hue = (index * 137.508) % 360; // Golden angle approximation
      return `hsl(${hue}, 70%, 60%)`;
    });
  } else {
    // Para otros tipos de datos
    labels = datos.map(item => item.label || item.nombre || 'Sin nombre');
    dataPoints = datos.map(item => item.valor || item.puntos || 0);
    colors = ['rgba(59, 130, 246, 0.8)'];
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: tipo === "modulos" ? 'Promedio de Puntos' : 'Valor',
        data: dataPoints,
        backgroundColor: colors.length > 1 ? colors : colors[0],
        borderColor: colors.length > 1 ? colors.map(color => color.replace('0.8', '1')) : colors[0].replace('0.8', '1'),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: titulo,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y.toFixed(1);
            return tipo === "modulos" ? `Promedio: ${value}` : `Valor: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: tipo === "modulos" ? 'Módulos' : 'Categorías',
        },
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: tipo === "modulos" ? 'Promedio de Puntos' : 'Valor',
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div style={{ 
        height: '280px',
        minHeight: '200px',
        width: '100%'
      }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GraficoBarras;