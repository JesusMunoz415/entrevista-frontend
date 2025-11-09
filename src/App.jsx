import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import Typography from '@mui/material/Typography';

// Componentes de utilidad
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import GlobalLoading from './components/GlobalLoading';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading de páginas para code splitting
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const AuthCallbackPage = React.lazy(() => import('./pages/AuthCallbackPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const CrearPlantillaPage = React.lazy(() => import('./pages/CrearPlantillaPage'));
const PlantillaDetailPage = React.lazy(() => import('./pages/PlantillaDetailPage'));
const EditarPlantillaPage = React.lazy(() => import('./pages/EditarPlantillaPage'));
const EntrevistaPage = React.lazy(() => import('./pages/EntrevistaPage'));
const ResultadosPage = React.lazy(() => import('./pages/ResultadosPage'));
const EvaluacionManualPage = React.lazy(() => import('./pages/EvaluacionManualPage'));
const EvaluacionDetailPage = React.lazy(() => import('./pages/EvaluacionDetailPage'));
const SecuritySettingsPage = React.lazy(() => import('./pages/SecuritySettingsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CssBaseline />
        <Toaster position="top-right" />
        
        {/* Contenedor principal con fondo gris */}
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingTop: '32px' }}>
          <GlobalLoading />
          
          {/* Contenedor del contenido que se centra a sí mismo */}
          <div 
            style={{
              margin: '0 auto', // Margen automático a los lados para centrar
              width: '90%',     
              maxWidth: '960px',
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              ProfileAnalytics - Plataforma de Entrevistas
            </Typography>
            
            <hr style={{ width: '100%', marginBottom: '20px' }} />

            <Suspense fallback={<LoadingSpinner message="Cargando página..." />}>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route path="/entrevista/:enlaceUnico" element={<EntrevistaPage />} />

                {/* Rutas protegidas */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/crear-plantilla" 
                  element={
                    <ProtectedRoute>
                      <CrearPlantillaPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/plantillas/:id" 
                  element={
                    <ProtectedRoute>
                      <PlantillaDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/plantillas/editar/:id" 
                  element={
                    <ProtectedRoute>
                      <EditarPlantillaPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/resultados/:id" 
                  element={
                    <ProtectedRoute>
                      <ResultadosPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/evaluacion" 
                  element={
                    <ProtectedRoute>
                      <EvaluacionManualPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/evaluacion/:id" 
                  element={
                    <ProtectedRoute>
                      <EvaluacionDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/security-settings" 
                  element={
                    <ProtectedRoute>
                      <SecuritySettingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </div>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;