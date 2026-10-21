const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

const ROOT_DIR = __dirname;
const MOBILE_DIR = path.join(ROOT_DIR, 'mobile');
const HTML_FILE = path.join(ROOT_DIR, 'Descargar-APK.html');

function run(cmd, cwd = ROOT_DIR) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch (err) {
    return null;
  }
}

function fetchAsciiQr(url) {
  return new Promise((resolve) => {
    const target = 'https://qrenco.de/' + url;
    const req = https.get(
      target,
      {
        timeout: 4000,
        headers: { 'User-Agent': 'curl/8.0' },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

function getLatestFinishedBuild() {
  console.log('🔍 Consultando el último build disponible en EAS...');
  const jsonStr = run('npx eas-cli build:list --platform android --status finished --limit 1 --json --non-interactive', MOBILE_DIR);
  if (!jsonStr) return null;
  try {
    const list = JSON.parse(jsonStr);
    return list && list.length > 0 ? list[0] : null;
  } catch {
    return null;
  }
}

function checkRepoStatus(lastCommitHash) {
  const status = run('git status --porcelain mobile', ROOT_DIR) || '';
  const currentCommit = run('git rev-parse HEAD', ROOT_DIR) || '';
  const hasChanges = status.length > 0;
  const isNewCommit = lastCommitHash && currentCommit && !currentCommit.startsWith(lastCommitHash) && !lastCommitHash.startsWith(currentCommit);
  return { hasChanges, currentCommit, isNewCommit, status };
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

function buildNewApk() {
  console.log('\n🚀 Iniciando compilación de nuevo APK en EAS Build...');
  const dateStr = new Date().toLocaleString('es-AR');
  
  // Verificar cambios locales sin commitear
  const status = run('git status --porcelain mobile', ROOT_DIR);
  if (status) {
    console.log('⚠️ Se detectaron cambios locales sin commitear en /mobile.');
    console.log('Por seguridad, ningún script modifica el historial git.');
    console.log('Por favor, realizá commit de tus cambios antes de compilar un nuevo APK en EAS.');
    return null;
  }

  console.log('⏳ Compilando APK en la nube (esto demora ~10-15 minutos)...');
  const buildProcess = spawnSync('cmd.exe', ['/c', 'npx', 'eas-cli', 'build', '-p', 'android', '--profile', 'preview'], {
    cwd: MOBILE_DIR,
    stdio: 'inherit',
  });

  if (buildProcess.status !== 0) {
    console.log('❌ Error al compilar en EAS. Mostraremos el último APK que finalizó correctamente.');
    return null;
  }

  console.log('✅ ¡Compilación finalizada con éxito!');
  return getLatestFinishedBuild();
}

function generateHtml(build, qrImageUrl) {
  const apkUrl = build.artifacts?.applicationArchiveUrl || build.artifacts?.buildUrl || '#';
  const completedDate = build.completedAt ? new Date(build.completedAt).toLocaleString('es-AR') : new Date().toLocaleString('es-AR');
  const commitMsg = build.gitCommitMessage || 'Versión actualizada';
  const commitHash = build.gitCommitHash ? build.gitCommitHash.slice(0, 7) : 'latest';
  const buildId = build.id || 'N/A';
  const dashboardUrl = `https://expo.dev/accounts/sytus/projects/splitwaisito/builds/${buildId}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Descargar Splitwaisito APK</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #0f172a;
    }
    .card {
      background: #ffffff;
      max-width: 480px;
      width: 100%;
      border-radius: 28px;
      padding: 36px 28px;
      box-shadow: 0 20px 40px -15px rgba(16, 185, 129, 0.15), 0 0 1px 1px rgba(0,0,0,0.05);
      text-align: center;
    }
    .badge-wrap {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ecfdf5;
      color: #059669;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 16px;
      border: 1px solid #a7f3d0;
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
    }
    h1 {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }
    p.subtitle {
      color: #64748b;
      font-size: 14px;
      margin-bottom: 24px;
    }
    .qr-container {
      background: #ffffff;
      border: 2px dashed #cbd5e1;
      border-radius: 20px;
      padding: 16px;
      display: inline-block;
      margin-bottom: 24px;
      transition: transform 0.2s ease;
    }
    .qr-container:hover {
      transform: scale(1.02);
    }
    .qr-container img {
      display: block;
      width: 250px;
      height: 250px;
      border-radius: 12px;
    }
    .btn-download {
      display: block;
      width: 100%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      padding: 16px 24px;
      border-radius: 16px;
      box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
      transition: all 0.2s ease;
      margin-bottom: 20px;
    }
    .btn-download:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-2px);
      box-shadow: 0 14px 24px -5px rgba(16, 185, 129, 0.5);
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 14px 18px;
      text-align: left;
      font-size: 13px;
      color: #334155;
      margin-bottom: 20px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .meta-row:last-child {
      margin-bottom: 0;
    }
    .meta-label {
      color: #64748b;
      font-weight: 500;
    }
    .meta-value {
      font-weight: 600;
      color: #0f172a;
    }
    .instructions {
      text-align: left;
      font-size: 12.5px;
      color: #64748b;
      line-height: 1.6;
      border-top: 1px solid #f1f5f9;
      padding-top: 18px;
    }
    .instructions ol {
      margin-left: 18px;
      margin-top: 6px;
    }
    .instructions li {
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge-wrap">
      <span class="badge-dot"></span>
      <span>APK Listo para Instalar</span>
    </div>
    <h1>Splitwaisito Android</h1>
    <p class="subtitle">Escaneá el código con la cámara de tu celular</p>

    <div class="qr-container">
      <img src="${qrImageUrl}" alt="Código QR para descargar el APK" />
    </div>

    <a href="${apkUrl}" class="btn-download" target="_blank" download>
      ⬇️ Descargar APK directamente
    </a>

    <div class="meta-box">
      <div class="meta-row">
        <span class="meta-label">Compilación:</span>
        <span class="meta-value">${completedDate}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Commit:</span>
        <span class="meta-value">${commitHash} (${commitMsg})</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Dashboard:</span>
        <span class="meta-value"><a href="${dashboardUrl}" target="_blank" style="color: #0284c7; text-decoration: none;">Ver en Expo</a></span>
      </div>
    </div>

    <div class="instructions">
      <strong>Instrucciones para Android:</strong>
      <ol>
        <li>Abrí la <strong>Cámara</strong> de tu celular y apuntá al código QR.</li>
        <li>Tocá el banner emergente para iniciar la descarga.</li>
        <li>Al abrir el archivo, si Android te solicita permisos para <em>"Instalar apps desconocidas"</em>, pulsá <strong>Permitir</strong>.</li>
      </ol>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(HTML_FILE, html, 'utf8');
}

async function main() {
  console.clear();
  console.log('===============================================================');
  console.log('   Splitwaisito - Gestor de Descarga de APK y Codigo QR        ');
  console.log('===============================================================\n');

  let build = getLatestFinishedBuild();
  if (!build) {
    console.log('⚠️ No se encontro ninguna compilacion finalizada en EAS.');
    console.log('Compilando el primer APK ahora mismo...');
    build = buildNewApk();
    if (!build) {
      console.log('No se pudo obtener el APK.');
      process.exit(1);
    }
  }

  const { hasChanges, isNewCommit, status } = checkRepoStatus(build.gitCommitHash);

  if (hasChanges || isNewCommit) {
    console.log('\n⚡ ¡Se detectaron cambios en el codigo de la app!');
    if (hasChanges) {
      console.log('   Archivos modificados detectados en mobile/:');
      status.split('\n').filter(Boolean).slice(0, 5).forEach((line) => console.log('     • ' + line));
    } else if (isNewCommit) {
      console.log('   Hay nuevos commits locales posteriores al ultimo APK compilado.');
    }

    console.log('\nOpciones:');
    console.log('  [1] Compilar un NUEVO APK en EAS con estos cambios (~10-15 min)');
    console.log('  [2] Abrir directamente el QR del ULTIMO APK ya compilado (inmediato)');
    
    const respuesta = await askQuestion('\nElige una opcion (1 o 2) [default: 2]: ');
    if (respuesta === '1') {
      const nuevoBuild = buildNewApk();
      if (nuevoBuild) {
        build = nuevoBuild;
      }
    }
  } else {
    console.log('✅ El codigo local coincide con el ultimo APK compilado.');
  }

  const apkUrl = build.artifacts?.applicationArchiveUrl || build.artifacts?.buildUrl;
  if (!apkUrl) {
    console.log('❌ No se encontro la URL del archivo APK.');
    process.exit(1);
  }

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(apkUrl)}`;

  // Generar el archivo HTML con el QR y la info
  generateHtml(build, qrImageUrl);

  // Mostrar QR en consola
  console.log('\n📲 ESCANEA ESTE QR CON TU CELULAR PARA DESCARGAR EL APK:\n');
  const asciiQr = await fetchAsciiQr(apkUrl);
  if (asciiQr) {
    console.log(asciiQr);
  } else {
    console.log('Enlace directo: ' + apkUrl);
  }

  console.log('\n🔗 Enlace directo del APK:');
  console.log('   ' + apkUrl);
  console.log('\n🌐 Abriendo pagina visual con el QR en tu navegador...');
  
  // Abrir navegador
  try {
    execSync(`start "" "${HTML_FILE}"`);
  } catch (err) {
    // Si falla start en windows, no es bloqueante
  }

  console.log('\n===============================================================');
  console.log('  La pagina web interactiva ya fue abierta en tu navegador.');
  console.log('  Para volver a abrirla o actualizarla cuando hagas cambios,');
  console.log('  simplemente volve a ejecutar Descargar-APK.bat.');
  console.log('===============================================================\n');
}

main().catch((err) => {
  console.error('Error inesperado:', err);
  process.exit(1);
});
