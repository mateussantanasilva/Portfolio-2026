import iconAws from '@/assets/stack/AWS.png'
import iconAzure from '@/assets/stack/Azure.png'
import iconDocker from '@/assets/stack/Docker.png'
import iconExpress from '@/assets/stack/Express.png'
import iconFastify from '@/assets/stack/Fastify.png'
import iconFigma from '@/assets/stack/Figma.png'
import iconFirebase from '@/assets/stack/Firebase.png'
import iconGit from '@/assets/stack/Git.png'
import iconGoogleCloud from '@/assets/stack/Google Cloud.png'
import iconJavascript from '@/assets/stack/JavaScript.png'
import iconJest from '@/assets/stack/Jest.png'
import iconLinux from '@/assets/stack/Linux.png'
import iconMongodb from '@/assets/stack/MongoDB.png'
import iconMysql from '@/assets/stack/MySQL.png'
import iconNestjs from '@/assets/stack/Nest.js.png'
import iconNextjs from '@/assets/stack/Next.js.png'
import iconNodejs from '@/assets/stack/Node.js.png'
import iconPostgres from '@/assets/stack/PostgresSQL.png'
import iconReact from '@/assets/stack/React.png'
import iconStorybook from '@/assets/stack/Storybook.png'
import iconTailwind from '@/assets/stack/Tailwind CSS.png'
import iconTypescript from '@/assets/stack/TypeScript.png'

export interface StackTech {
  icon: string
  invertInDark?: boolean
  name: string
}

export interface StackCategory {
  badges?: readonly string[]
  description: string
  id: string
  name: string
  techs?: readonly StackTech[]
}

const frontend: StackCategory = {
  description:
    'Interfaces animadas, responsivas e performáticas com React, Next.js, TypeScript e componentes reutilizáveis.',
  id: 'frontend',
  name: 'Front-end',
  techs: [
    { icon: iconReact, name: 'React' },
    { icon: iconNextjs, invertInDark: true, name: 'Next.js' },
    { icon: iconTypescript, name: 'TypeScript' },
    { icon: iconJavascript, name: 'JavaScript' },
    { icon: iconTailwind, name: 'Tailwind CSS' },
    { icon: iconStorybook, name: 'Storybook' },
  ],
}

const design: StackCategory = {
  description:
    'Da interface no Figma ao componente com facilidade de manutenção.',
  id: 'design',
  name: 'Design System & UI',
  techs: [{ icon: iconFigma, name: 'Figma' }],
}

const mobile: StackCategory = {
  description:
    'Aplicações multiplataforma para Android e iOS com React Native e Expo, focando na experiência fluida.',
  id: 'mobile',
  name: 'Mobile',
  techs: [
    { icon: iconReact, name: 'React Native' },
    { icon: iconTypescript, name: 'TypeScript' },
  ],
}

const backend: StackCategory = {
  description:
    'APIs e serviços com Node.js e TypeScript, aplicando orientação a objetos, princípios SOLID e padrões de projeto.',
  id: 'backend',
  name: 'Back-end',
  techs: [
    { icon: iconNodejs, name: 'Node.js' },
    { icon: iconNestjs, name: 'Nest.js' },
    { icon: iconExpress, invertInDark: true, name: 'Express' },
    { icon: iconFastify, invertInDark: true, name: 'Fastify' },
  ],
}

const testing: StackCategory = {
  description:
    'Testes automatizados com Jest para garantir o funcionamento correto das aplicações.',
  id: 'testing',
  name: 'Testes',
  techs: [{ icon: iconJest, name: 'Jest' }],
}

const databases: StackCategory = {
  description:
    'Modelagem e gerenciamento de dados com bancos relacionais e NoSQL, utilizando ORMs e outras ferramentas de acesso a dados.',
  id: 'databases',
  name: 'Bancos de dados',
  techs: [
    { icon: iconMongodb, name: 'MongoDB' },
    { icon: iconMysql, name: 'MySQL' },
    { icon: iconPostgres, name: 'PostgreSQL' },
    { icon: iconFirebase, name: 'Firebase' },
  ],
}

const cloud: StackCategory = {
  description:
    'Versionamento, containers, Linux e fundamentos de cloud para o desenvolvimento e a entrega de aplicações.',
  id: 'cloud',
  name: 'Cloud & DevOps',
  techs: [
    { icon: iconAzure, name: 'Azure' },
    { icon: iconAws, invertInDark: true, name: 'AWS' },
    { icon: iconGoogleCloud, name: 'Google Cloud' },
    { icon: iconDocker, name: 'Docker' },
    { icon: iconLinux, name: 'Linux' },
    { icon: iconGit, name: 'Git' },
  ],
}

const engineering: StackCategory = {
  badges: ['Patterns', 'Segurança', 'Gestão de Projetos'],
  description:
    'Fundamentos de requisitos, arquitetura, qualidade, segurança e gestão aplicados ao ciclo de vida do software.',
  id: 'engineering',
  name: 'Engenharia & conceitos',
}

const agile: StackCategory = {
  badges: ['Scrum', 'Kanban'],
  description:
    'Colaboração em equipe com Scrum e Kanban, organizando tarefas por prioridade.',
  id: 'agile',
  name: 'Metodologias ágeis',
}

/** Linhas no desktop (3 colunas por linha, coluna central mais estreita) */
export const stackRows = [
  [frontend, design, mobile],
  [backend, testing, databases],
  [cloud, agile, engineering],
] as const

export const stackCategories = stackRows.flat()
