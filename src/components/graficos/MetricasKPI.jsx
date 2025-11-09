import React from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  MinusIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

const MetricasKPI = ({ metricas, promedioIPG, tendenciaTemporal }) => {
  // Validar que tenemos datos suficientes
  if (!metricas || !promedioIPG) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No hay datos suficientes para mostrar métricas</p>
        <p className="text-sm text-gray-500 mt-2">Completa algunas entrevistas para ver las estadísticas</p>
      </div>
    );
  }

  const getTendenciaIcon = (tendencia) => {
    switch (tendencia) {
      case 'creciente':
        return <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />;
      case 'decreciente':
        return <ArrowTrendingDownIcon className="h-6 w-6 text-red-500" />;
      default:
        return <MinusIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTendenciaColor = (tendencia) => {
    switch (tendencia) {
      case 'creciente':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'decreciente':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTendenciaTexto = (tendencia) => {
    switch (tendencia) {
      case 'creciente':
        return 'Tendencia Positiva';
      case 'decreciente':
        return 'Tendencia Negativa';
      default:
        return 'Tendencia Estable';
    }
  };

  const kpis = [
    {
      titulo: 'Promedio IPG',
      valor: promedioIPG?.toFixed(1) || '0.0',
      unidad: 'pts',
      descripcion: 'Puntuación promedio general',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      icono: <ChartBarIcon className="h-6 w-6 text-blue-500" />
    },
    {
      titulo: 'Desviación Estándar',
      valor: metricas.desviacionEstandar?.toFixed(1) || '0.0',
      unidad: 'pts',
      descripcion: 'Variabilidad en resultados',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      icono: <ChartBarIcon className="h-6 w-6 text-purple-500" />
    },
    {
      titulo: 'Mediana',
      valor: metricas.mediana?.toFixed(1) || '0.0',
      unidad: 'pts',
      descripcion: 'Valor central de resultados',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      icono: <ChartBarIcon className="h-6 w-6 text-indigo-500" />
    },
    {
      titulo: 'Tendencia Temporal',
      valor: getTendenciaTexto(tendenciaTemporal?.tendencia),
      unidad: '',
      descripcion: `Pendiente: ${tendenciaTemporal?.pendiente?.toFixed(2) || '0.00'}`,
      color: getTendenciaColor(tendenciaTemporal?.tendencia),
      icono: getTendenciaIcon(tendenciaTemporal?.tendencia)
    }
  ];

  const percentiles = metricas.percentiles || {};

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className={`p-4 rounded-lg border ${kpi.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium opacity-75">{kpi.titulo}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold">{kpi.valor}</p>
                  {kpi.unidad && <span className="ml-1 text-sm opacity-75">{kpi.unidad}</span>}
                </div>
                <p className="text-xs opacity-60 mt-1">{kpi.descripcion}</p>
              </div>
              <div className="ml-3">
                {kpi.icono}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Percentiles */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold mb-4">Distribución de Resultados (Percentiles)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">P25</p>
            <p className="text-xl font-bold text-gray-800">{percentiles.p25?.toFixed(1) || '0.0'}</p>
            <p className="text-xs text-gray-500">25% por debajo</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">P50 (Mediana)</p>
            <p className="text-xl font-bold text-blue-800">{percentiles.p50?.toFixed(1) || '0.0'}</p>
            <p className="text-xs text-blue-500">50% por debajo</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600">P75</p>
            <p className="text-xl font-bold text-green-800">{percentiles.p75?.toFixed(1) || '0.0'}</p>
            <p className="text-xs text-green-500">75% por debajo</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-600">P90</p>
            <p className="text-xl font-bold text-orange-800">{percentiles.p90?.toFixed(1) || '0.0'}</p>
            <p className="text-xs text-orange-500">90% por debajo</p>
          </div>
        </div>
      </div>

      {/* Interpretación de Variabilidad */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold mb-3">Interpretación de Variabilidad</h4>
        <div className="space-y-2">
          {metricas.desviacionEstandar <= 10 && (
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <p className="text-sm text-green-800">
                <strong>Baja variabilidad:</strong> Los resultados son muy consistentes entre candidatos
              </p>
            </div>
          )}
          {metricas.desviacionEstandar > 10 && metricas.desviacionEstandar <= 20 && (
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <p className="text-sm text-yellow-800">
                <strong>Variabilidad moderada:</strong> Existe diversidad normal en los resultados
              </p>
            </div>
          )}
          {metricas.desviacionEstandar > 20 && (
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <p className="text-sm text-red-800">
                <strong>Alta variabilidad:</strong> Los resultados varían significativamente entre candidatos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricasKPI;