import React from 'react';

const GraficoCorrelaciones = ({ correlaciones, titulo = "Correlaciones entre Módulos" }) => {
  if (!correlaciones || Object.keys(correlaciones).length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">{titulo}</h3>
        <p className="text-gray-500">No hay datos suficientes para mostrar correlaciones</p>
      </div>
    );
  }

  // Extraer módulos únicos de las correlaciones
  const modulosSet = new Set();
  Object.keys(correlaciones).forEach(key => {
    const [modulo1, modulo2] = key.split('_');
    modulosSet.add(modulo1);
    modulosSet.add(modulo2);
  });
  const modulos = Array.from(modulosSet);

  // Crear matriz de correlaciones
  const matriz = modulos.map(modulo1 => 
    modulos.map(modulo2 => {
      if (modulo1 === modulo2) return 1; // Correlación perfecta consigo mismo
      
      const key1 = `${modulo1}_${modulo2}`;
      const key2 = `${modulo2}_${modulo1}`;
      
      return correlaciones[key1] || correlaciones[key2] || 0;
    })
  );

  // Función para obtener el color basado en la correlación
  const getColorForCorrelation = (correlation) => {
    const absCorr = Math.abs(correlation);
    const intensity = Math.min(absCorr, 1);
    
    if (correlation > 0) {
      // Correlación positiva - tonos de azul
      const blue = Math.floor(255 - (intensity * 100));
      return `rgb(${blue}, ${blue}, 255)`;
    } else if (correlation < 0) {
      // Correlación negativa - tonos de rojo
      const red = Math.floor(255 - (intensity * 100));
      return `rgb(255, ${red}, ${red})`;
    } else {
      // Sin correlación - gris
      return 'rgb(240, 240, 240)';
    }
  };

  // Función para obtener el texto de interpretación
  const getCorrelationText = (correlation) => {
    const absCorr = Math.abs(correlation);
    if (absCorr >= 0.8) return 'Muy fuerte';
    if (absCorr >= 0.6) return 'Fuerte';
    if (absCorr >= 0.4) return 'Moderada';
    if (absCorr >= 0.2) return 'Débil';
    return 'Muy débil';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{titulo}</h3>
      
      {/* Leyenda */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Interpretación de correlaciones:</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 rounded mr-2"></div>
            <span>Correlación positiva</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 rounded mr-2"></div>
            <span>Correlación negativa</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <span>Sin correlación</span>
          </div>
        </div>
      </div>

      {/* Matriz de correlaciones */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="p-2"></th>
              {modulos.map((modulo, index) => (
                <th key={index} className="p-2 text-xs font-medium text-gray-700 transform -rotate-45 origin-bottom-left">
                  <div className="w-20 text-left">{modulo}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modulos.map((modulo1, i) => (
              <tr key={i}>
                <td className="p-2 text-xs font-medium text-gray-700 text-right pr-4">
                  {modulo1}
                </td>
                {modulos.map((modulo2, j) => {
                  const correlation = matriz[i][j];
                  return (
                    <td
                      key={j}
                      className="p-1 text-center border border-gray-200 relative group cursor-pointer"
                      style={{ backgroundColor: getColorForCorrelation(correlation) }}
                    >
                      <div className="w-12 h-12 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {correlation.toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                        <div className="text-center">
                          <div className="font-semibold">{modulo1} ↔ {modulo2}</div>
                          <div>Correlación: {correlation.toFixed(3)}</div>
                          <div>Intensidad: {getCorrelationText(correlation)}</div>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen de correlaciones significativas */}
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-3">Correlaciones Significativas</h4>
        <div className="space-y-2">
          {Object.entries(correlaciones)
            .filter(([_, correlation]) => Math.abs(correlation) >= 0.4)
            .sort(([_, a], [__, b]) => Math.abs(b) - Math.abs(a))
            .slice(0, 5)
            .map(([key, correlation], index) => {
              const [modulo1, modulo2] = key.split('_');
              const isPositive = correlation > 0;
              return (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  isPositive ? 'bg-blue-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      isPositive ? 'bg-blue-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {modulo1} ↔ {modulo2}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${
                      isPositive ? 'text-blue-700' : 'text-red-700'
                    }`}>
                      {correlation.toFixed(3)}
                    </span>
                    <div className="text-xs text-gray-600">
                      {getCorrelationText(correlation)}
                    </div>
                  </div>
                </div>
              );
            })}
          {Object.entries(correlaciones).filter(([_, correlation]) => Math.abs(correlation) >= 0.4).length === 0 && (
            <p className="text-sm text-gray-500 italic">No se encontraron correlaciones significativas (≥0.4)</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraficoCorrelaciones;