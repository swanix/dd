# 🔧 Troubleshooting - XDiagrams

## 📋 Problemas Identificados y Soluciones

### ❌ **Problema Principal**: No carga datos desde el proxy de Netlify

**Síntomas:**
- CSP ya no da errores ✅
- Favicon se carga correctamente ✅
- El diagrama no muestra datos ❌

**Causas Posibles:**
1. Variables de entorno no cargadas en el servidor
2. Autenticación no funciona correctamente
3. La librería xdiagrams no envía el token al proxy
4. El proxy no puede acceder a SheetBest

## 🧪 Archivos de Prueba Disponibles

### 1. **Test Simple** (Sin Autenticación)
- **Archivo**: `/app/xdiagrams-simple-test.html`
- **Propósito**: Verificar que xdiagrams funciona básicamente
- **Uso**: Probar si el problema es la librería o la autenticación

### 2. **Test con Autenticación**
- **Archivo**: `/app/xdiagrams-protected-auth.html`
- **Propósito**: Verificar autenticación + carga de datos
- **Uso**: Probar el flujo completo con autenticación

### 3. **Test del Proxy**
- **Script**: `node scripts/test-proxy-direct.js`
- **Propósito**: Verificar que el proxy funciona
- **Uso**: Probar el endpoint directamente

### 4. **Test de Variables de Entorno**
- **Script**: `node scripts/test-env-loading.js`
- **Propósito**: Verificar carga de variables
- **Uso**: Confirmar que las variables están disponibles

## 🔍 Pasos de Diagnóstico

### **Paso 1: Verificar Variables de Entorno**
```bash
node scripts/test-env-loading.js
```

**Resultado Esperado:**
- ✅ Variables en .env.local encontradas
- ✅ Variables en process.env cargadas
- ✅ Servidor corriendo

### **Paso 2: Probar XDiagrams Básico**
1. Ir a `/app/xdiagrams-simple-test.html`
2. Verificar que los tests pasan
3. Confirmar que el diagrama se carga con datos públicos

**Resultado Esperado:**
- ✅ CSS cargado
- ✅ Script cargado
- ✅ Configuración aplicada
- ✅ Diagrama muestra datos

### **Paso 3: Probar Proxy Directamente**
```bash
node scripts/test-proxy-direct.js
```

**Resultado Esperado:**
- ✅ Proxy rechaza sin token (401)
- ✅ Proxy rechaza token inválido (401)
- ✅ Variables configuradas

### **Paso 4: Probar con Autenticación**
1. Ir a `/app/xdiagrams-protected-auth.html`
2. Verificar que detecta token
3. Confirmar que carga el diagrama

**Resultado Esperado:**
- ✅ Autenticación exitosa
- ✅ XDiagrams carga
- ✅ Datos se muestran

## 🚀 Soluciones por Problema

### **Problema A: Variables no cargadas**
```bash
# Reiniciar servidor de desarrollo
# Verificar que .env.local existe
# Confirmar que las variables están en process.env
```

### **Problema B: Autenticación falla**
```bash
# Verificar token en localStorage
# Probar endpoint auth-protect directamente
# Confirmar configuración de Auth0
```

### **Problema C: Proxy no responde**
```bash
# Verificar que la función existe
# Probar endpoint directamente
# Revisar logs del servidor
```

### **Problema D: SheetBest no responde**
```bash
# Verificar API key
# Probar URL de SheetBest directamente
# Confirmar permisos de la API key
```

## 📊 Estado Actual

| Componente | Estado | Notas |
|------------|--------|-------|
| CSP | ✅ Resuelto | Estilos y fuentes cargan |
| Favicon | ✅ Resuelto | Ruta corregida |
| Proxy | ✅ Funciona | Rechaza correctamente |
| Variables | ⚠️ Verificar | Puede requerir reinicio |
| Autenticación | ❓ Probar | Depende de variables |
| Datos | ❓ Probar | Depende de autenticación |

## 🎯 Próximos Pasos Recomendados

1. **Ejecutar diagnóstico completo**:
   ```bash
   node scripts/test-env-loading.js
   node scripts/test-proxy-direct.js
   ```

2. **Probar página simple**:
   - Ir a `/app/xdiagrams-simple-test.html`
   - Verificar que funciona sin autenticación

3. **Si el simple funciona, probar con auth**:
   - Ir a `/app/xdiagrams-protected-auth.html`
   - Verificar autenticación y carga

4. **Si hay problemas, revisar logs**:
   - Consola del navegador
   - Logs del servidor de desarrollo
   - Network tab para ver peticiones

## 📞 Información de Debug

### **Logs Útiles:**
- Consola del navegador (F12)
- Network tab para ver peticiones HTTP
- Logs del servidor de desarrollo
- Respuestas del proxy

### **URLs de Prueba:**
- Proxy: `/.netlify/functions/xdiagrams-proxy`
- Auth: `/.netlify/functions/auth-protect`
- Test simple: `/app/xdiagrams-simple-test.html`
- Test auth: `/app/xdiagrams-protected-auth.html`

### **Variables Críticas:**
- `AUTH0_DOMAIN`
- `SHEETBEST_API_KEY`
- `XDIAGRAMS_SHEET_ID`
- `XDIAGRAMS_TAB_NAME`
