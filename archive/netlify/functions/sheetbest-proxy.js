// Netlify Function para proteger SheetBest API
// Ubicación: netlify/functions/sheetbest-proxy.js

const axios = require('axios');

exports.handler = async (event, context) => {
  // Configurar CORS para permitir peticiones desde tu dominio
  const headers = {
    'Access-Control-Allow-Origin': '*', // Permitir todos los orígenes para desarrollo
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Manejar preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Netlify Function ejecutándose...');
    console.log('Método HTTP:', event.httpMethod);
    console.log('Headers:', event.headers);

    // Verificar que sea una petición GET
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Método no permitido' })
      };
    }

    // Verificar autorización (JWT de Auth0)
    const authHeader = event.headers.authorization;
    console.log('Auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No hay token de autorización');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token de autorización requerido' })
      };
    }

    const token = authHeader.substring(7);
    console.log('Token recibido:', token ? 'SÍ' : 'NO');
    
    // Verificar que existe un token
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token inválido' })
      };
    }

    // Verificar que existe la variable de entorno
    const apiKey = process.env.SHEETBEST_API_KEY;
    console.log('API Key existe:', apiKey ? 'SÍ' : 'NO');
    console.log('API Key (primeros 10 chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'NO');

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API Key de SheetBest no configurada' })
      };
    }

    // Configuración de SheetBest - USAR X-Api-Key como requiere SheetBest
    const sheetBestConfig = {
      headers: {
        'X-Api-Key': apiKey, // Header correcto para SheetBest
        'Content-Type': 'application/json'
      }
    };

    console.log('Haciendo petición a SheetBest...');
    console.log('Headers enviados:', sheetBestConfig.headers);

    // Hacer petición a SheetBest
    const response = await axios.get(
      'https://api.sheetbest.com/sheets/28f15681-b2ab-47a0-bbcb-205d142d9ef7/tabs/All',
      sheetBestConfig
    );

    console.log('Respuesta de SheetBest exitosa');

    // Devolver datos al frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    console.error('Error en proxy:', error);
    console.error('Error response:', error.response ? error.response.data : 'No response data');
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message,
        response: error.response ? error.response.data : null
      })
    };
  }
};
