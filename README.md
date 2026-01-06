# smart-habits-api
# 🧠 Smart Habits API Consumer – AWS Lambda

Esta función **AWS Lambda** se encarga de **consumir el Smart Habits API**, procesar la respuesta y retornar un resultado estandarizado para su uso en flujos serverless.

Está diseñada bajo principios de **Clean Code**, **Single Responsibility** y **configuración por entorno**.

---

## 📌 Descripción general

La Lambda realiza las siguientes acciones:

1. Recibe un evento de entrada (API Gateway, EventBridge, SQS, etc.)
2. Construye una petición HTTP hacia el **Smart Habits API**
3. Incluye headers y autenticación requeridos
4. Procesa la respuesta del API
5. Maneja errores de forma controlada
6. Retorna una respuesta estandarizada

---

## 🏗️ Arquitectura

```text
[ Event Source ]
      |
      v
[AWS Lambda]
      |
      v
[ Smart Habits API ]
```

## 🧰 Tecnologías

- AWS Lambda  
- Node.js  
- API REST  
- Fetch / Axios  
- Variables de entorno  
- IAM Role con permisos mínimos  

---

## 📂 Estructura del proyecto

```text
.
├── src/
│   ├── handler.js              # Entry point de la Lambda
│   ├── api/
│   │   └── smartHabits.api.js  # Cliente HTTP del API
│   ├── services/
│   │   └── http.service.js     # Wrapper HTTP
│   ├── utils/
│   │   └── error-handler.js    # Manejo centralizado de errores
│   └── config/
│       └── env.js              # Lectura de variables de entorno
├── tests/
│   └── handler.spec.js
├── package.json
├── package-lock.json
└── README.md
````
