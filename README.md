# 📡 Sensor Management

Una para la gestión de sensores en tiempo real con comunicación mediante NATS.

## 🚢 Despliegue

Puedes probar la aplicación desplegada aquí:  
[https://sensor-management-lx7ccs6z3-jmontes33s-projects.vercel.app/](https://sensor-management-lx7ccs6z3-jmontes33s-projects.vercel.app/)

## 📋 Descripción

Esta aplicación te permite visualizar, crear, editar y eliminar sensores con actualización en tiempo real. Cualquier cambio realizado se reflejará instantáneamente en todas las pantallas abiertas gracias a la comunicación mediante el protocolo NATS.

## 🔧 Stack Tecnológico

- **SvelteKit**: Framework principal
- **TypeScript**: Tipado estático
- **TailwindCSS**: Estilos y diseño
- **Shadcn**: Estilos y diseño
- **NATS**: Protocolo de mensajería en tiempo real

## 🏗️ Arquitectura

El proyecto utiliza **Feature-Sliced Design**, una arquitectura modular que organiza el código por características y capas de abstracción.

## ⚠️ Nota sobre Simulación

**Todo el sistema está simulado para propósitos de demostración:**

- **Autenticación**: Simulada mediante `localStorage`, permitiendo registrar múltiples usuarios
- **Datos iniciales**: 15 sensores cargados desde un archivo JSON mockeado
- **Protocolo NATS**: Completamente simulado (podría implementarse con Docker, pero opté por la simulación por falta de tiempo.)

## 📚 ¿Cómo se podría mejorar?

- Se podría hacer testing unitario, o incluso algún e2e.
- Si invierto más tiempo podría analizar, y encontrar oportunidades de mejora en división de componentes, y separación de responsabilidades.
- Se podría implementar una librería de terceros para la autenticación y nats.ws para el uso de NATS.
- Todo esto no se ha hecho por falta de tiempo.

## 🚀 Instalación y Uso

1. Clona el repositorio en tu máquina local
2. Instala las dependencias:
   ```bash
   pnpm install
   ```
3. Ejecuta el proyecto en modo desarrollo:
   ```bash
   pnpm run dev
   ```

## 🤖 Uso de IA en el Desarrollo

Sí, he utilizado IA durante el desarrollo, pero de manera inteligente, y consciente:

- Búsqueda de información sobre el protocolo NATS
- Autocompletados para funciones y componentes
- Consultas sobre la arquitectura Feature-Sliced Design

Saber utilizar la IA es indispensable para un buen programador hoy en día. Sin embargo, existe una gran diferencia entre usar la IA comprendiendo lo que se está haciendo, a usarla para resolver problemas de 0 a 100 sin entender el proceso, ni el código generado.
