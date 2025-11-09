import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define los estilos para el PDF (similar a CSS)
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
  },
  scoreSection: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  listItem: {
    fontSize: 11,
    marginBottom: 3,
  }
});

// Este es el componente que define tu PDF
// Recibe los 'resultados' como prop
const ReportePDF = ({ resultados }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Encabezado */}
      <Text style={styles.header}>Resultados del Test Psicométrico</Text>

      {/* Datos del Candidato */}
      <View style={styles.section}>
        <Text style={styles.text}><strong>Candidato:</strong> {resultados?.candidato_nombre || 'Nombre no disponible'}</Text>
        <Text style={styles.text}><strong>Email:</strong> {resultados?.candidato_email || 'Email no disponible'}</Text>
        <Text style={styles.text}><strong>Test Realizado:</strong> {resultados?.plantilla_titulo || 'Plantilla no disponible'}</Text>
        <Text style={styles.text}><strong>Estado:</strong> {resultados.estado}</Text>
      </View>

      {/* Sección de Calificación */}
      <View style={[styles.section, styles.scoreSection]}>
        <Text style={styles.title}>Calificación General</Text>
        <Text style={styles.subtitle}>IPG Final: {resultados?.ipg_final || 0} / 100</Text>
        <Text style={styles.subtitle}>Desglose por Módulo:</Text>
        {resultados.desgloseModulos && Object.entries(resultados.desgloseModulos).map(([modulo, puntaje]) => (
          <Text key={modulo} style={styles.listItem}>- {modulo}: {puntaje} / 100</Text>
        ))}
      </View>

      {/* Respuestas Individuales */}
      <View>
        <Text style={styles.title}>Respuestas Individuales</Text>
        {resultados.resultados && resultados.resultados.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.text}><strong>Pregunta:</strong> {item.pregunta}</Text>
            <Text style={styles.text}><strong>Respuesta Seleccionada:</strong> {item.respuesta}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ReportePDF;