// Builds the Android APK with Gradle and copies it to ../dist/TuningBook.apk.
// Uses the JDK bundled with Android Studio and the SDK in %LOCALAPPDATA%\Android\Sdk.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const androidDir = path.join(root, 'android');
const sdk = process.env.ANDROID_HOME || path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk');
const jdk = process.env.JAVA_HOME || 'C:\\Program Files\\Android\\Android Studio\\jbr';

fs.writeFileSync(path.join(androidDir, 'local.properties'), `sdk.dir=${sdk.replace(/\\/g, '\\\\')}\n`);
execFileSync('cmd.exe', ['/c', path.join(androidDir, 'gradlew.bat'),'assembleDebug', '--console=plain'], {
  cwd: androidDir,
  stdio: 'inherit',
  env: { ...process.env, JAVA_HOME: jdk, ANDROID_HOME: sdk },
});

const apk = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const out = path.join(root, '..', 'dist', 'TuningBook.apk');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.copyFileSync(apk, out);
console.log(`APK: ${out} (${(fs.statSync(out).size / 1048576).toFixed(1)} MB)`);
