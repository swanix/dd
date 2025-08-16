# 🔧 Configuración de Variables de Entorno en Netlify

## 🚨 **Problema:**
Los deploys están fallando por dos razones:
1. **Dependencia faltante**: El módulo `marked` no estaba en `package.json`
2. **Variables de entorno**: Pueden faltar variables en Netlify

## ✅ **Solución:**

### **1. Dependencia Agregada:**
```bash
# La dependencia 'marked' ya fue agregada al package.json
npm install
```

### **2. Variables Requeridas en Netlify:**

Ve a tu [Netlify Dashboard](https://app.netlify.com/) y configura estas variables:

#### **Variables Obligatorias:**
```
AUTH0_DOMAIN=dev-7kj3jxtxwwirocri.us.auth0.com
AUTH0_CLIENT_ID=BORj4AB79Rho5yP5uSavuP4sern8pemZ
```

#### **Variables Opcionales:**
```
NETLIFY_URL=https://tu-app.netlify.app
AUTH0_CLIENT_SECRET=tu-client-secret
AUTH0_AUDIENCE=tu-audience
```

### **2. Pasos para Configurar:**

#### **A. Ir al Dashboard de Netlify:**
1. Ve a [app.netlify.com](https://app.netlify.com/)
2. Selecciona tu sitio
3. Ve a **Site settings** → **Environment variables**

#### **B. Agregar Variables:**
1. Haz clic en **Add a variable**
2. Agrega cada variable con su valor
3. Haz clic en **Save**

#### **C. Verificar Configuración:**
- ✅ **AUTH0_DOMAIN** debe ser tu dominio de Auth0
- ✅ **AUTH0_CLIENT_ID** debe ser tu Client ID de Auth0
- ✅ **NETLIFY_URL** debe ser la URL de tu sitio en Netlify

### **3. Trigger de Deploy:**

Después de configurar las variables:
1. Ve a **Deploys**
2. Haz clic en **Trigger deploy** → **Deploy site**
3. El build debería completarse exitosamente

### **4. Verificación:**

Después del deploy exitoso:
- ✅ **El sitio carga** sin errores
- ✅ **La autenticación funciona**
- ✅ **El logout funciona**
- ✅ **El diseño minimal aparece**

## 🔍 **Troubleshooting:**

### **Si el Deploy Sigue Fallando:**
1. **Verificar variables** en Netlify Dashboard
2. **Revisar logs** del deploy para errores específicos
3. **Asegurar** que las variables no tengan espacios extra
4. **Verificar** que los valores sean correctos

### **Si la Autenticación No Funciona:**
1. **Verificar** AUTH0_DOMAIN y AUTH0_CLIENT_ID
2. **Configurar URLs** en Auth0 Dashboard
3. **Verificar** que NETLIFY_URL sea correcta

## 📝 **Notas Importantes:**

- ✅ **Las variables son sensibles** - no las compartas
- ✅ **Reinicia el deploy** después de agregar variables
- ✅ **Verifica los logs** si hay errores
- ✅ **Prueba la funcionalidad** después del deploy

---

*Guía para configurar variables de entorno en Netlify*
