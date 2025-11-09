import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import estadisticasService from '../services/estadisticasService';

/**
 * Componente para mostrar gráfica de dona de puntajes por módulos
 */
const ModulosDonutChart = ({ entrevistaId }) => {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colores para cada módulo - paleta más vibrante y contrastante
  const coloresModulos = {
    'adaptabilidad': '#1976D2',     // Azul más intenso
    'comunicacion': '#388E3C',      // Verde más intenso
    'gestion_estres': '#F57C00',    // Naranja más intenso
    'resolucion_problemas': '#7B1FA2', // Púrpura más intenso
    'trabajo_equipo': '#D32F2F',    // Rojo más intenso
    'Personalidad': '#1976D2',
    'Logica': '#388E3C', 
    'Competencias': '#F57C00',
    'Integridad': '#7B1FA2'
  };

  useEffect(() => {
    const cargarDatos = async () => {
      if (!entrevistaId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await estadisticasService.obtenerPuntajesPorModulo(entrevistaId);
        
        // El backend devuelve { puntajes_por_modulo: {...} }, necesitamos transformarlo
        if (data.puntajes_por_modulo) {
          const datosGrafica = Object.entries(data.puntajes_por_modulo).map(([modulo, puntaje]) => {
            // Normalizar nombre del módulo para mostrar
            let nombreModulo = modulo;
            if (modulo === 'gestion_estres') nombreModulo = 'Gestión Estrés';
            else if (modulo === 'resolucion_problemas') nombreModulo = 'Resolución Problemas';
            else if (modulo === 'trabajo_equipo') nombreModulo = 'Trabajo Equipo';
            else if (modulo === 'comunicacion') nombreModulo = 'Comunicación';
            else if (modulo === 'adaptabilidad') nombreModulo = 'Adaptabilidad';
            else if (modulo === 'Logica') nombreModulo = 'Lógica';
            
            return {
              name: nombreModulo,
              value: Math.round(puntaje),
              color: coloresModulos[modulo] || '#757575'
            };
          });
          setDatos(datosGrafica);
        } else {
          setDatos([]);
        }
      } catch (err) {
        console.error('Error al cargar puntajes por módulo:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [entrevistaId]);

  if (loading) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: 120, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  // Verificar si no hay datos o todos los valores son 0
  const tieneValoresValidos = datos && datos.length > 0 && datos.some(item => item.value > 0);

  if (error || !datos || datos.length === 0 || !tieneValoresValidos) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: 180, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            mb: 2, 
            fontWeight: 500,
            fontSize: '0.75rem',
            textAlign: 'center'
          }}
        >
          Puntajes por Módulo
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            color: '#d32f2f'
          }}
        >
          No hay datos para mostrar
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ 
          display: 'block', 
          mb: 2, 
          fontWeight: 500,
          fontSize: '0.75rem',
          textAlign: 'center'
        }}
      >
        Puntajes por Módulo
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        {/* Gráfica de dona */}
        <Box sx={{ width: '60%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datos}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {datos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Leyenda */}
        <Box sx={{ width: '40%', pl: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {datos.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: entry.color, 
                  borderRadius: '2px',
                  flexShrink: 0
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.7rem', 
                  lineHeight: 1.2,
                  color: 'text.secondary'
                }}
              >
                {entry.name}: {entry.value}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ModulosDonutChart;