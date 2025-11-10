/**
 * Script para ejecutar pruebas del sistema IVR
 * Inicia el servidor automáticamente y ejecuta las pruebas
 */

const { spawn } = require('child_process');
const axios = require('axios');

const PORT = 9080;
const BASE_URL = `http://localhost:${PORT}`;

let serverProcess = null;

// Función para verificar si el servidor está funcionando
async function waitForServer(maxAttempts = 30, delay = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(BASE_URL, { timeout: 1000 });
      console.log('✅ Servidor detectado y funcionando');
      return true;
    } catch (error) {
      if (i === 0) {
        console.log(`🔍 Esperando a que el servidor esté listo... (intento ${i + 1}/${maxAttempts})`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
}

// Función para iniciar el servidor
function startServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando servidor...');
    
    serverProcess = spawn('node', ['src/server.js'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    let serverReady = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output.trim());
      
      if (output.includes('Servidor listo para recibir peticiones') && !serverReady) {
        serverReady = true;
        setTimeout(resolve, 1000); // Espera un poco más para estar seguro
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error('Error del servidor:', data.toString());
    });

    serverProcess.on('error', (error) => {
      console.error('Error iniciando servidor:', error);
      reject(error);
    });

    // Timeout de seguridad
    setTimeout(() => {
      if (!serverReady) {
        console.log('⏰ Timeout esperando servidor, continuando...');
        resolve();
      }
    }, 10000);
  });
}

// Función para ejecutar las pruebas
async function runTests() {
  try {
    console.log('\n🧪 Ejecutando pruebas del sistema IVR...');
    
    const testProcess = spawn('node', ['test-ivr.js'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    return new Promise((resolve, reject) => {
      testProcess.on('close', (code) => {
        if (code === 0) {
          console.log('\n✅ Pruebas completadas exitosamente');
          resolve();
        } else {
          console.log(`\n❌ Pruebas fallaron con código: ${code}`);
          reject(new Error(`Tests failed with code ${code}`));
        }
      });

      testProcess.on('error', (error) => {
        console.error('Error ejecutando pruebas:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error en las pruebas:', error);
    throw error;
  }
}

// Función principal
async function main() {
  try {
    // Verificar si el servidor ya está ejecutándose
    const serverRunning = await axios.get(BASE_URL, { timeout: 2000 })
      .then(() => true)
      .catch(() => false);

    if (serverRunning) {
      console.log('✅ Servidor ya está ejecutándose');
    } else {
      // Iniciar servidor
      await startServer();
      
      // Verificar que esté funcionando
      const isReady = await waitForServer();
      if (!isReady) {
        throw new Error('El servidor no pudo iniciarse correctamente');
      }
    }

    // Ejecutar pruebas
    await runTests();

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Limpiar: cerrar servidor si lo iniciamos nosotros
    if (serverProcess) {
      console.log('\n🛑 Cerrando servidor...');
      serverProcess.kill();
    }
  }
}

// Manejo de señales para limpieza
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando aplicación...');
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});

// Ejecutar
main();