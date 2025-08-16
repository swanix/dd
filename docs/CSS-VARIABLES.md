# Variables CSS - Guía de Personalización

## Descripción
Este documento describe las variables CSS implementadas en la aplicación para facilitar la personalización de colores, espaciado, tipografía y otros estilos.

## Variables Disponibles

### 🎨 Colores Principales
```css
--primary-color: #007bff;      /* Color principal */
--primary-hover: #0056b3;      /* Color principal en hover */
--secondary-color: #6c757d;    /* Color secundario */
--success-color: #28a745;      /* Color de éxito */
--warning-color: #ffc107;      /* Color de advertencia */
--danger-color: #dc3545;       /* Color de error */
--info-color: #17a2b8;         /* Color informativo */
```

### 🎨 Colores de Fondo
```css
--bg-primary: #ffffff;         /* Fondo principal */
--bg-secondary: #f8f9fa;       /* Fondo secundario */
--bg-tertiary: #e9ecef;        /* Fondo terciario */
--bg-dark: #343a40;            /* Fondo oscuro */
```

### 📝 Colores de Texto
```css
--text-primary: #000000;       /* Texto principal */
--text-secondary: #495057;     /* Texto secundario */
--text-muted: #6c757d;         /* Texto atenuado */
--text-light: #ffffff;         /* Texto claro */
```

### 🔲 Colores de Bordes
```css
--border-color: #e9ecef;       /* Color de borde principal */
--border-light: #f0f0f0;       /* Color de borde claro */
```

### 🌫️ Colores de Sombras
```css
--shadow-light: rgba(0, 0, 0, 0.1);    /* Sombra ligera */
--shadow-medium: rgba(0, 0, 0, 0.15);  /* Sombra media */
--shadow-heavy: rgba(0, 0, 0, 0.25);   /* Sombra pesada */
```

### 📏 Espaciado
```css
--spacing-xs: 4px;             /* Espaciado extra pequeño */
--spacing-sm: 8px;             /* Espaciado pequeño */
--spacing-md: 12px;            /* Espaciado medio */
--spacing-lg: 16px;            /* Espaciado grande */
--spacing-xl: 20px;            /* Espaciado extra grande */
--spacing-xxl: 24px;           /* Espaciado doble extra grande */
```

### 🔄 Bordes Redondeados
```css
--border-radius-sm: 4px;       /* Radio pequeño */
--border-radius-md: 8px;       /* Radio medio */
--border-radius-lg: 12px;      /* Radio grande */
--border-radius-full: 50%;     /* Radio completo (círculo) */
```

### ⏱️ Transiciones
```css
--transition-fast: 0.2s ease;  /* Transición rápida */
--transition-normal: 0.3s ease; /* Transición normal */
--transition-slow: 0.4s ease;  /* Transición lenta */
```

### 📚 Tipografía
```css
--font-size-xs: 12px;          /* Tamaño extra pequeño */
--font-size-sm: 14px;          /* Tamaño pequeño */
--font-size-md: 16px;          /* Tamaño medio */
--font-size-lg: 18px;          /* Tamaño grande */
--font-size-xl: 24px;          /* Tamaño extra grande */
--font-size-xxl: 32px;         /* Tamaño doble extra grande */

--font-weight-normal: 400;     /* Peso normal */
--font-weight-medium: 500;     /* Peso medio */
--font-weight-semibold: 600;   /* Peso semi-negrita */
--font-weight-bold: 700;       /* Peso negrita */
```

## Cómo Personalizar

### 1. Cambiar Colores Principales
Para cambiar el esquema de colores, modifica las variables en `:root`:

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* ... otros colores */
}
```

### 2. Cambiar Espaciado
Para ajustar el espaciado general:

```css
:root {
    --spacing-md: 16px;        /* Aumentar espaciado medio */
    --spacing-lg: 20px;        /* Aumentar espaciado grande */
}
```

### 3. Cambiar Tipografía
Para personalizar la tipografía:

```css
:root {
    --font-size-md: 18px;      /* Aumentar tamaño base */
    --font-weight-semibold: 700; /* Hacer más negrita */
}
```

### 4. Cambiar Transiciones
Para ajustar la velocidad de las animaciones:

```css
:root {
    --transition-fast: 0.1s ease;   /* Transiciones más rápidas */
    --transition-normal: 0.2s ease;
}
```

## Ejemplos de Uso

### Tema Oscuro
```css
:root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
    --border-color: #404040;
}
```

### Tema Corporativo
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #34495e;
    --success-color: #27ae60;
    --warning-color: #f39c12;
    --danger-color: #e74c3c;
}
```

### Tema Minimalista
```css
:root {
    --spacing-md: 8px;
    --spacing-lg: 12px;
    --border-radius-md: 4px;
    --shadow-light: rgba(0, 0, 0, 0.05);
}
```

## Beneficios

1. **Consistencia**: Todos los elementos usan las mismas variables
2. **Mantenibilidad**: Cambios centralizados en un lugar
3. **Flexibilidad**: Fácil personalización sin tocar código específico
4. **Escalabilidad**: Nuevos componentes pueden usar las variables existentes
5. **Temas**: Fácil implementación de temas múltiples

## Notas Importantes

- Las variables están definidas en `:root` para acceso global
- Todos los colores hardcodeados han sido reemplazados por variables
- Las transiciones y espaciados son consistentes en toda la app
- Los cambios en las variables se aplican automáticamente a todos los elementos
