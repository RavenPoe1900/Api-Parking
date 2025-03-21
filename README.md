# **Proyecto de Gestión Integral de Reservas de Parqueo**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

✨ Un sistema modular y escalable para gestionar múltiples reservaciones de estacionamiento, usuarios, roles y registros de actividades.

---

## **Enfoque del Proyecto**

Este proyecto está diseñado para simplificar y optimizar la gestión de múltiples reservaciones en estacionamientos. La solución integra de manera modular la administración de reservas, usuarios, roles y registros de actividades, garantizando una experiencia segura, escalable y eficiente. El sistema permite verificar en tiempo real la disponibilidad de espacios, facilitando la toma de decisiones y el control del flujo en los parqueos.

---

## **Características Principales**

### **Base**

El módulo base establece las funcionalidades comunes y reutilizables que sustentan los distintos componentes del sistema (reservations, parking, roles, usuarios y datos de vehículos). Entre sus principales características se destacan:

- **Operaciones CRUD Genéricas:** Implementa métodos centralizados para crear, leer, actualizar y eliminar registros, promoviendo la reutilización de código y simplificando el mantenimiento.
- **Filtrado y Búsqueda Dinámica:** Ofrece herramientas para generar filtros y realizar consultas precisas en la base de datos, agilizando la gestión de la información.
- **Gestión Centralizada de Errores:** Captura y registra incidencias de forma centralizada, lanzando excepciones adecuadas para mantener la integridad y consistencia del sistema.
- **Integración con LogsService:** Automatiza el registro de eventos y errores durante las operaciones, facilitando el seguimiento y la auditoría.
- **Compatibilidad Multientorno:** Diseñado para ser extendido por módulos específicos (Parking, Roles, Usuarios y Vehículos), brindando una base sólida y escalable para la administración de datos.

---

### **Logs**

El módulo de logs se encarga de rastrear y documentar todas las actividades y errores del sistema. Sus funcionalidades incluyen:

- **Registro de Eventos:** Permite crear entradas de log que capturan actividades y sucesos relevantes.
- **Consulta y Análisis de Logs:** Recupera registros con soporte para paginación y filtros personalizados, facilitando un análisis detallado y la auditoría.
- **Integración Multiservicio:** Se utiliza en diversos módulos (Parking, Roles, Usuarios y Vehículos) para mantener un seguimiento homogéneo y riguroso de todas las operaciones.

---

### **Reservations**

Este módulo gestiona la lógica de negocio relacionada con las reservas de estacionamiento. Entre sus funciones destacan:

- **Creación de Reservas:** Verifica la disponibilidad de espacios antes de confirmar una nueva reserva.
- **Consulta y Paginación:** Permite listar las reservas en forma paginada y filtrarlas por rangos de fecha.
- **Actualización de Reservas:** Facilita la modificación de los detalles de una reserva, comprobando la disponibilidad para nuevos intervalos de tiempo.
- **Gestión de Estados:** Controla y valida las transiciones de estado (por ejemplo, de "Reservado" a "Check-in") para asegurar procesos coherentes.
- **Resumen de Estados:** Genera informes que agrupan las reservas según su estado actual.
- **Verificación de Disponibilidad:** Evalúa en tiempo real la disponibilidad de espacios en un parqueo para intervalos específicos.

---

### **Servicios de Autenticación**

El módulo de autenticación (AuthService) se encarga de gestionar el acceso seguro al sistema mediante:

- **Inicio de Sesión:** Valida las credenciales del usuario y emite un token JWT para acceder a los recursos protegidos.
- **Registro de Usuarios:** Permite la creación de nuevos usuarios con el rol "cliente", asegurando el almacenamiento seguro de contraseñas mediante hashing.
- **Validación de Roles y Asociaciones:** Garantiza que los usuarios dispongan del rol adecuado y estén vinculados al estacionamiento correcto.
- **Manejo de Excepciones:** Gestiona de forma adecuada los errores de autenticación, impidiendo el acceso a usuarios no autorizados.

---

## **Tecnologías Utilizadas**

Este proyecto utiliza las siguientes tecnologías y herramientas:

- **Backend:** [NestJS](https://nestjs.com/) (Framework Node.js)
- **Base de Datos:** [MongoDB](https://www.mongodb.com/) o [PostgreSQL](https://www.postgresql.org/)
- **Autenticación:** JSON Web Tokens (JWT)
- **Logs:** Integración con servicios de registro para auditoría y depuración
- **Testing:** Jest para pruebas unitarias y de integración
- **Documentación API:** Swagger/OpenAPI

---

## **Instalación**

Para ejecutar este proyecto localmente, sigue estos pasos:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/usuario/proyecto.git
   cd proyecto

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
