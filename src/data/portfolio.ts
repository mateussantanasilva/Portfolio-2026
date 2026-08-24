import iconGithubSocial from '@/assets/icons/GitHub.png'
import iconInstagram from '@/assets/icons/Instagram.png'
import iconLinkedin from '@/assets/icons/Linkedin.png'
import iconBriefcase from '@/assets/icons/menu/briefcase.svg'
import iconContact from '@/assets/icons/menu/contact.svg'
import iconHandshake from '@/assets/icons/menu/hand-shake.svg'
import iconHome from '@/assets/icons/menu/home.svg'
import iconFile from '@/assets/icons/menu/icon-file.svg'
import iconMonitorCode from '@/assets/icons/menu/monitor-code.svg'
import iconUser from '@/assets/icons/menu/user.svg'
import heroImage from '@/assets/portfolio/hero.png'
import iconCpu from '@/assets/portfolio/icon-cpu.svg'
import iconMonitor from '@/assets/portfolio/icon-monitor.svg'
import iconServer from '@/assets/portfolio/icon-server.svg'
import iconSmartphone from '@/assets/portfolio/icon-smartphone.svg'
import projectBibliotroca from '@/assets/projects/bibliotroca.webp'
import projectConnecta from '@/assets/projects/connecta.webp'
import projectIgnite from '@/assets/projects/ignite-projects.webp'
import projectSavpets from '@/assets/projects/savpets.webp'
import { stackCategories } from '@/data/stack'

const cvUrl = '/CV_MateusSantana.pdf'

export const portfolio = {
  brand: {
    displayName: 'Mateus Santana',
    handle: '@mateussantanasilva',
    tagline: 'desenvolvedor de software',
  },
  contact: {
    cta: 'Continuar no WhatsApp',
    cvLabel: 'Ver currículo',
    cvUrl,
    email: 'santanasilva1778@gmail.com',
    emailLabel: 'E-mail',
    form: {
      contactPlaceholder: 'e-mail ou WhatsApp',
      intentPlaceholder: 'uma vaga, projeto ou parceria',
      namePlaceholder: 'seu nome',
    },
    headline: 'Entre em contato',
    location: 'São Paulo, SP — Zona Leste',
    locationLabel: 'Localização',
    phone: '(11) 93217-8035',
    phoneLabel: 'WhatsApp',
    socials: [
      {
        href: 'https://github.com/mateussantanasilva',
        icon: iconGithubSocial,
        label: 'GitHub',
      },
      {
        href: 'https://www.linkedin.com/in/mateus-santana-silva/',
        icon: iconLinkedin,
        label: 'LinkedIn',
      },
      {
        href: 'https://www.instagram.com/santana__mss/',
        icon: iconInstagram,
        label: 'Instagram',
      },
    ],
    subtitle:
      'Conte-me um pouco sobre a oportunidade e vamos conversar sobre como posso contribuir.',
    teaserTitle: 'Vamos conversar?',
    whatsappNumber: '5511932178035',
    whatsappUrl: 'https://wa.me/5511932178035',
  },
  education: {
    items: [
      {
        degree: 'Pós-graduação em Engenharia de Software · 600 horas',
        description:
          'Aprofundamento em requisitos, projeto de software, testes, qualidade e gerenciamento de projetos, conectando fundamentos de engenharia à prática de desenvolvimento.',
        period: '2026',
        school: 'FAMEESP',
      },
      {
        degree:
          'Graduação em Desenvolvimento de Software Multiplataforma · Láurea Acadêmica',
        description:
          'Formação voltada ao desenvolvimento de aplicações web e mobile e às práticas de Engenharia de Software.',
        period: '2024',
        school: 'FATEC Zona Leste',
      },
      {
        degree: 'Técnico em Desenvolvimento de Sistemas',
        description:
          'Base técnica em lógica de programação, desenvolvimento de sistemas e construção de aplicações.',
        period: '2021',
        school: 'ETEC Zona Leste',
      },
    ],
    title: '/Formação',
  },
  experience: {
    items: [
      {
        company: 'Ateliê de Propaganda',
        description:
          'Desenvolvo e mantenho sistemas web para promoções e campanhas, gestão empresarial e financeira e automação de processos. Também atuo em aplicações mobile e sistemas desktop offline, colaborando no planejamento e na evolução técnica das soluções.',
        period: '05/2025 – Atual',
        role: 'Desenvolvedor Front-end',
      },
      {
        company: 'FATEC Zona Leste',
        description:
          'Desenvolvi um sistema web para a gestão do acervo da faculdade e prestei suporte técnico a alunos e funcionários da instituição.',
        period: '08/2022 – 10/2022',
        role: 'Estágio em Desenvolvimento Web',
      },
    ],
    title: '/Experiência',
  },
  hero: {
    background: heroImage,
    bio: 'Minha atuação é focada em front-end, complementada por experiência em aplicações mobile e conhecimentos de back-end.',
    title: 'Desenvolvedor · Full Stack ·',
  },
  intro: {
    body: 'Atuo como desenvolvedor front-end, criando sistemas para campanhas, gestão empresarial e financeira, automação de processos, além de aplicações mobile e soluções desktop offline. Sou pós-graduado em Engenharia de Software e graduado pela FATEC Zona Leste, com Láurea Acadêmica.',
    cvUrl,
    lead: 'Desenvolvo interfaces e sistemas que transformam necessidades de negócio em experiências digitais claras, confiáveis e fáceis de evoluir.',
    link: 'Ver currículo',
  },
  nav: {
    items: [
      {
        href: '#inicio',
        icon: iconHome,
        id: 'inicio',
        label: 'Início',
      },
      {
        href: '#sobre',
        icon: iconUser,
        id: 'sobre',
        label: 'Sobre',
      },
      {
        href: '#atuacao',
        icon: iconHandshake,
        id: 'atuacao',
        label: 'Atuação',
      },
      {
        href: '#projetos',
        icon: iconMonitorCode,
        id: 'projetos',
        label: 'Projetos',
      },
      {
        href: '#experiencia',
        icon: iconBriefcase,
        id: 'experiencia',
        label: 'Experiência',
      },
      {
        external: true,
        href: cvUrl,
        icon: iconFile,
        id: 'curriculo',
        label: 'Currículo',
      },
      {
        href: '#contato',
        icon: iconContact,
        id: 'contato',
        label: 'Contato',
      },
    ],
  },
  services: {
    description:
      'Como posso contribuir em times de produto e em projetos sob demanda.',
    items: [
      {
        description:
          'Criação e evolução de interfaces responsivas, acessíveis e integradas a APIs com React, Next.js, TypeScript e Design Systems.',
        icon: iconMonitor,
        name: 'Desenvolvimento Front-end',
      },
      {
        description:
          'Desenvolvimento de APIs REST e regras de negócio com Node.js e TypeScript, aplicando organização modular, orientação a objetos e princípios SOLID.',
        icon: iconServer,
        name: 'Desenvolvimento Back-end',
      },
      {
        description:
          'Aplicações multiplataforma com React Native e Expo, com foco em experiência fluida, consistência e facilidade de manutenção.',
        icon: iconSmartphone,
        name: 'Desenvolvimento Mobile',
      },
      {
        description:
          'Requisitos, organização técnica, versionamento e práticas de qualidade para construir soluções mais fáceis de manter e evoluir.',
        icon: iconCpu,
        name: 'Engenharia de Software',
      },
    ],
    title: '/Atuação',
  },
  stack: {
    categories: stackCategories,
    description:
      'Tecnologias, práticas e fundamentos que aplico para construir e evoluir produtos digitais.',
    title: '/Habilidades',
  },
  works: {
    description:
      'Projetos que mostram como transformo necessidades em produtos web e mobile.',
    exploreHref: 'https://github.com/mateussantanasilva',
    exploreLabel: 'Explorar mais no GitHub',
    items: [
      {
        description:
          'Plataforma web para organizar doações e aproximar doadores de pessoas e instituições beneficiadas.',
        href: 'https://github.com/mateussantanasilva/Connecta',
        image: projectConnecta,
        title: 'Connecta',
      },
      {
        description:
          'Plataforma para facilitar a troca e o compartilhamento de livros e materiais didáticos entre estudantes.',
        href: 'https://github.com/mateussantanasilva/BiblioTroca',
        image: projectBibliotroca,
        title: 'BiblioTroca',
      },
      {
        description:
          'Sistema para centralizar dados internos de uma empresa de cuidados animais e apoiar a divulgação de campanhas de adoção.',
        href: 'https://github.com/mateussantanasilva/SavPets',
        image: projectSavpets,
        title: 'SavPets',
      },
      {
        description:
          'Coleção de aplicações desenvolvidas durante a formação Ignite para praticar React.js, componentização e fundamentos do ecossistema Front-end.',
        href: 'https://github.com/mateussantanasilva/WebProjects',
        image: projectIgnite,
        title: 'Projetos Ignite',
      },
    ],
    title: '/Projetos',
  },
} as const
