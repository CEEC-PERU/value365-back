# 📝 Documentación API - POST /api/responses

## 🎯 Endpoint
```
POST /api/responses
```

## 📦 Estructura del Payload

### Campos Obligatorios
```json
{
  "form_id": 1,           // ✅ OBLIGATORIO - ID del formulario (number)
  "session_id": "string", // ⚠️ OPCIONAL - Identificador de sesión (se genera automático si no se envía)
  "answers": []           // ✅ OBLIGATORIO - Array de respuestas (array)
}
```

### Estructura de cada respuesta en `answers`
```json
{
  "question_id": 1,              // ✅ OBLIGATORIO - ID de la pregunta (number)
  "respuesta_texto": "string",   // 📝 OPCIONAL - Para respuestas de texto
  "respuesta_numerica": 123,     // 🔢 OPCIONAL - Para respuestas numéricas
  "respuesta_json": {}           // 📋 OPCIONAL - Para respuestas complejas (objetos, arrays)
}
```

**⚠️ IMPORTANTE:** Para cada respuesta, **al menos uno** de los campos de respuesta debe tener valor:
- `respuesta_texto`
- `respuesta_numerica` 
- `respuesta_json`

---

## 📋 Ejemplos de Payloads Válidos

### Ejemplo 1: Respuestas de Texto Simples
```json
{
  "form_id": 5,
  "session_id": "user_12345",
  "answers": [
    {
      "question_id": 10,
      "respuesta_texto": "Juan Pérez"
    },
    {
      "question_id": 11,
      "respuesta_texto": "juan.perez@example.com"
    },
    {
      "question_id": 12,
      "respuesta_texto": "Excelente servicio"
    }
  ]
}
```

### Ejemplo 2: Respuestas Numéricas
```json
{
  "form_id": 5,
  "session_id": "user_67890",
  "answers": [
    {
      "question_id": 15,
      "respuesta_numerica": 5
    },
    {
      "question_id": 16,
      "respuesta_numerica": 28
    },
    {
      "question_id": 17,
      "respuesta_numerica": 4.5
    }
  ]
}
```

### Ejemplo 3: Respuestas JSON (Múltiple Selección, Checkboxes)
```json
{
  "form_id": 5,
  "session_id": "user_abc123",
  "answers": [
    {
      "question_id": 20,
      "respuesta_json": {
        "opciones_seleccionadas": ["Opción A", "Opción C"],
        "otras": "Comentario adicional"
      }
    },
    {
      "question_id": 21,
      "respuesta_json": ["React", "Node.js", "PostgreSQL"]
    }
  ]
}
```

### Ejemplo 4: Respuestas Mixtas (Combinadas)
```json
{
  "form_id": 5,
  "session_id": "session_2025_001",
  "answers": [
    {
      "question_id": 1,
      "respuesta_texto": "María González"
    },
    {
      "question_id": 2,
      "respuesta_numerica": 32
    },
    {
      "question_id": 3,
      "respuesta_json": {
        "ciudad": "Lima",
        "distrito": "Miraflores"
      }
    },
    {
      "question_id": 4,
      "respuesta_texto": "Sí, acepto los términos"
    }
  ]
}
```

### Ejemplo 5: Respuesta Mínima (Sin session_id)
```json
{
  "form_id": 5,
  "answers": [
    {
      "question_id": 1,
      "respuesta_texto": "Respuesta rápida"
    }
  ]
}
```
*Nota: Si no envías `session_id`, se genera automáticamente uno basado en timestamp.*

---

## ✅ Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "message": "¡Gracias por tu respuesta!",
  "data": {
    "form_response_id": 42
  }
}
```

---

## ❌ Errores Comunes

### Error 400: Campos Faltantes
```json
{
  "error": "Faltan campos obligatorios",
  "details": "Se requiere: form_id (number), answers (array), session_id (string, opcional)"
}
```

**Causas:**
- No enviaste `form_id`
- No enviaste `answers`
- `answers` no es un array

### Error 500: Error al Procesar
```json
{
  "error": "Hubo un error al procesar tu respuesta.",
  "details": "foreign key violation - question_id 999 does not exist"
}
```

**Causas comunes:**
- El `form_id` no existe en la base de datos
- Algún `question_id` no existe
- Algún `question_id` no pertenece al formulario especificado
- Error de conexión a la base de datos

---

## 🔍 Validaciones del Backend

### Validación de Estructura
```javascript
// ✅ VÁLIDO
{
  "form_id": 5,
  "answers": [{ "question_id": 1, "respuesta_texto": "Hola" }]
}

// ❌ INVÁLIDO - form_id es string
{
  "form_id": "5",
  "answers": []
}

// ❌ INVÁLIDO - answers no es array
{
  "form_id": 5,
  "answers": "respuesta"
}
```

### Validación de Respuestas
```javascript
// ✅ VÁLIDO - Al menos un campo de respuesta
{
  "question_id": 1,
  "respuesta_texto": "Hola"
}

// ✅ VÁLIDO - respuesta_json puede ser objeto o array
{
  "question_id": 2,
  "respuesta_json": { "key": "value" }
}

// ⚠️ VÁLIDO PERO VACÍO - Se insertará con valores NULL
{
  "question_id": 3
}
```

---

## 🧪 Testing con cURL

```bash
curl -X POST http://localhost:9080/api/responses \
  -H "Content-Type: application/json" \
  -d '{
    "form_id": 5,
    "session_id": "test_session_001",
    "answers": [
      {
        "question_id": 1,
        "respuesta_texto": "Prueba desde cURL"
      }
    ]
  }'
```

## 🧪 Testing con JavaScript/Fetch

```javascript
const payload = {
  form_id: 5,
  session_id: `session_${Date.now()}`,
  answers: [
    {
      question_id: 1,
      respuesta_texto: "Mi respuesta"
    },
    {
      question_id: 2,
      respuesta_numerica: 8
    }
  ]
};

fetch('http://localhost:9080/api/responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload)
})
  .then(response => response.json())
  .then(data => console.log('✅ Respuesta guardada:', data))
  .catch(error => console.error('❌ Error:', error));
```

## 🧪 Testing con Postman

1. **Method:** POST
2. **URL:** `http://localhost:9080/api/responses`
3. **Headers:**
   ```
   Content-Type: application/json
   ```
4. **Body (raw JSON):**
   ```json
   {
     "form_id": 5,
     "answers": [
       {
         "question_id": 1,
         "respuesta_texto": "Test desde Postman"
       }
     ]
   }
   ```

---

## 📊 Tablas de Base de Datos Involucradas

### `form_responses`
```sql
CREATE TABLE form_responses (
  id SERIAL PRIMARY KEY,
  form_id INTEGER REFERENCES forms(id),
  session_id VARCHAR(255),
  fecha_inicio TIMESTAMP,
  estado VARCHAR(50)
);
```

### `question_responses`
```sql
CREATE TABLE question_responses (
  id SERIAL PRIMARY KEY,
  form_response_id INTEGER REFERENCES form_responses(id),
  question_id INTEGER REFERENCES questions(id),
  respuesta_texto TEXT,
  respuesta_numerica NUMERIC,
  respuesta_json JSONB
);
```

---

## 🎯 Resumen Rápido

**URL:** `POST /api/responses`

**Body mínimo:**
```json
{
  "form_id": 5,
  "answers": [
    { "question_id": 1, "respuesta_texto": "Respuesta" }
  ]
}
```

**Campos obligatorios:**
- ✅ `form_id` (number)
- ✅ `answers` (array)
- ✅ Cada answer debe tener `question_id` (number)

**Campos opcionales:**
- `session_id` (string) - Se genera automático si no se envía
- `respuesta_texto` (string)
- `respuesta_numerica` (number)
- `respuesta_json` (object/array)
