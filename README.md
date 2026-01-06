<div align="center">

# Assignment Tracking System

![Next.JS](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)

**Streamlining the process of managing assignments records. For HKDSE ICT SBA.**

</div>

## Features

1. **Teachers** are able to create assignments, view submission records, and generate reports and statistics.
2. **Subject Monitors** are able to update assignment submission statuses for their assigned classes.
3. **Administrators** are able to manage users and monitor the system.
4. **Students** are able to view their own assignment records and deadlines.

## Project Structure

ATS follows the folder and file conventions of Next.js. See [official documentation](https://nextjs.org/docs/app/getting-started/project-structure) for more.

```sh
public                # static assets to be served
src                   # source folder
|
+-- app               # app router
|   |
|   +-- (main)        # main application component
|   +-- login
+-- components        # shared components used across the entire application
|
+-- db                # datbaase functions
|
+-- utils             # shared utility functions
eslint.config.mjs     # configuration file for ESLint
jsconfig.json         # configuration file for JavaScript
next.config.mjs       # configuration file for Next.js
package.json          # project dependencies and scripts
pnpm-lock.yaml        # pnpm lockfile
postcss.config.mjs    # configuration file for PostCSS (for TailwindCSS)
```

## HKDSE ICT SBA

The **School-Based Assignment (SBA)** accounts for 20% of the total subject mark in the ICT curriculum. It consists of two guided tasks that focus on the development of an information system. These tasks are centred around two key stages of system development:

- **Task 1: Design and Implementation (25 marks)**
- **Task 2: Testing and Evaluation (15 marks)**

This SBA combines components from 2A: Databases and 2B: Web Application Development.

---
