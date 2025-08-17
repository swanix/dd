# 🔐 Propuesta de Autenticación para XDiagrams

## 🎯 Objetivo

Mantener el HTML simple y limpio como en el archivo original `xdiagrams.html`, pero agregando soporte opcional para autenticación.

## 📋 Estado Actual

### HTML Original (Simple y Limpio)
```html
<script>
  window.$xDiagrams = {
    url: "https://api.sheetbest.com/sheets/f4c2def0-403c-4197-8020-9f1c42e34515/tabs/All",
    title: "Inspector",
    clustersPerRow: "6 3 7 6 3",
    showThemeToggle: false 
  };
</script>
```

### Problema
La librería hace peticiones directas sin enviar headers de autenticación.

## 💡 Propuesta de Solución

### Opción 1: Detección Automática (Recomendada)

La librería xdiagrams debería detectar automáticamente si hay un token de autenticación disponible y enviarlo en las peticiones.

```html
<!-- HTML simple - sin cambios -->
<script>
  window.$xDiagrams = {
    url: "/.netlify/functions/xdiagrams-proxy",
    title: "Inspector - Protegido",
    clustersPerRow: "6 3 7 6 3",
    showThemeToggle: false
  };
</script>
```

**Comportamiento de la librería:**
1. Buscar automáticamente `localStorage.getItem('auth_token')`
2. Si existe, enviarlo en header `Authorization: Bearer <token>`
3. Si no existe, hacer petición sin autenticación (comportamiento actual)

### Opción 2: Configuración Opcional

```html
<script>
  window.$xDiagrams = {
    url: "/.netlify/functions/xdiagrams-proxy",
    title: "Inspector - Protegido",
    clustersPerRow: "6 3 7 6 3",
    showThemeToggle: false,
    // Configuración opcional para autenticación
    auth: {
      tokenKey: 'auth_token', // Clave en localStorage
      // O token directo:
      // token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  };
</script>
```

### Opción 3: Headers Personalizados

```html
<script>
  window.$xDiagrams = {
    url: "/.netlify/functions/xdiagrams-proxy",
    title: "Inspector - Protegido",
    clustersPerRow: "6 3 7 6 3",
    showThemeToggle: false,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    }
  };
</script>
```

## 🔧 Implementación Sugerida

### Modificaciones en la Librería XDiagrams

```javascript
// En el módulo de carga de datos
async function loadData(config) {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Detección automática de token
  const token = localStorage.getItem('auth_token') || 
                config.auth?.token || 
                config.headers?.['Authorization']?.replace('Bearer ', '');

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(config.url, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token inválido o expirado
      console.warn('Token de autenticación inválido o expirado');
      // Opcional: redirigir a login
      // window.location.href = '/login.html';
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
```

## 📊 Comparación de Opciones

| Opción | HTML Simple | Compatibilidad | Flexibilidad | Complejidad |
|--------|-------------|----------------|--------------|-------------|
| **Detección Automática** | ✅ Sí | ✅ Total | ⚠️ Limitada | 🟢 Baja |
| **Configuración Opcional** | ✅ Sí | ✅ Total | 🟢 Alta | 🟡 Media |
| **Headers Personalizados** | ⚠️ Parcial | ✅ Total | 🟢 Alta | 🟡 Media |

## 🎯 Recomendación

**Implementar Opción 1 (Detección Automática)** porque:

1. ✅ **Mantiene HTML simple** - Sin cambios en el HTML existente
2. ✅ **Compatibilidad total** - No rompe implementaciones existentes
3. ✅ **Fácil de usar** - Funciona automáticamente
4. ✅ **Baja complejidad** - Implementación simple

### Implementación Gradual

1. **Fase 1**: Detección automática de `auth_token` en localStorage
2. **Fase 2**: Agregar configuración opcional `auth: {}`
3. **Fase 3**: Agregar soporte para headers personalizados

## 🚀 Beneficios

### Para el Usuario Final
- HTML simple y limpio
- Funciona automáticamente con autenticación
- No requiere cambios en implementaciones existentes

### Para el Desarrollador
- API consistente
- Fácil de implementar
- Compatibilidad hacia atrás

### Para la Librería
- Más flexible
- Mejor experiencia de usuario
- Preparada para futuras mejoras

## 📝 Ejemplo de Uso

### Sin Autenticación (Comportamiento Actual)
```html
<script>
  window.$xDiagrams = {
    url: "https://api.sheetbest.com/sheets/...",
    title: "Inspector"
  };
</script>
```

### Con Autenticación Automática
```html
<script>
  window.$xDiagrams = {
    url: "/.netlify/functions/xdiagrams-proxy",
    title: "Inspector - Protegido"
  };
</script>
```

### Con Configuración Explícita
```html
<script>
  window.$xDiagrams = {
    url: "/.netlify/functions/xdiagrams-proxy",
    title: "Inspector - Protegido",
    auth: {
      tokenKey: 'custom_token_key'
    }
  };
</script>
```

## 🔄 Próximos Pasos

1. **Implementar detección automática** en la librería xdiagrams
2. **Probar con el proxy** actual
3. **Documentar** el nuevo comportamiento
4. **Crear ejemplos** de uso
5. **Publicar nueva versión** de la librería

