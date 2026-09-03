import heroPortrait from '@/assets/hero-me.png'
import iconBriefcase from '@/assets/menu/briefcase.svg'
import iconContact from '@/assets/menu/contact.svg'
import iconHandshake from '@/assets/menu/hand-shake.svg'
import iconHome from '@/assets/menu/home.svg'
import iconFile from '@/assets/menu/icon-file.svg'
import iconMonitorCode from '@/assets/menu/monitor-code.svg'
import iconUser from '@/assets/menu/user.svg'
import projectBibliotroca from '@/assets/projects/bibliotroca.webp'
import projectConnecta from '@/assets/projects/connecta.webp'
import projectJobHunter from '@/assets/projects/job-hunter.webp'
import projectSavpets from '@/assets/projects/savpets.webp'
import iconCpu from '@/assets/services/icon-cpu.svg'
import iconMonitor from '@/assets/services/icon-monitor.svg'
import iconServer from '@/assets/services/icon-server.svg'
import iconSmartphone from '@/assets/services/icon-smartphone.svg'
import iconGithubSocial from '@/assets/stack/GitHub.png'
import iconLinkedin from '@/assets/stack/Linkedin.png'

const cvUrl = '/CV_MateusSantana.pdf'

export const portfolio = {
  brand: {
    displayName: 'Mateus Santana',
    handle: '@mateussantanasilva',
    tagline: 'desenvolvedor de software',
  },
  contact: {
    cta: 'Continuar no WhatsApp',
    email: 'santanasilva1778@gmail.com',
    emailLabel: 'E-mail',
    form: {
      contactLabel: 'E-mail ou WhatsApp',
      contactPlaceholder: 'seu@email.com ou (11) 99999-9999',
      messageLabel: 'Mensagem',
      messagePlaceholder: 'Escreva sua mensagem aqui',
      nameLabel: 'Nome',
      namePlaceholder: 'Seu nome completo',
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
    ],
    subtitle:
      'Vamos conversar sobre sua oportunidade e o que podemos construir juntos.',
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
    portrait: heroPortrait,
    title: 'Desenvolvedor',
  },
  intro: {
    body: 'Atuo como desenvolvedor front-end em sistemas para campanhas, gestão empresarial e financeira, automações, além de apps mobile e desktop offline. Sou pós-graduado em Engenharia de Software e graduado pela FATEC Zona Leste, com Láurea Acadêmica.',
    cvUrl,
    lead: 'Desenvolvo interfaces e sistemas com visual moderno, animações performáticas e experiências digitais confiáveis e de fácil manutenção.',
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
      'Áreas em que posso contribuir no desenvolvimento de projetos.',
    items: [
      {
        description:
          'Criação de interfaces responsivas, acessíveis e integradas a APIs, com foco em usabilidade e visual moderno.',
        icon: iconMonitor,
        name: 'Desenvolvimento Front-end',
      },
      {
        description:
          'Desenvolvimento de APIs e funcionalidades, seguindo boas práticas de estruturação e manutenção.',
        icon: iconServer,
        name: 'Desenvolvimento Back-end',
      },
      {
        description:
          'Desenvolvimento de aplicações multiplataforma para celulares e tablets, integrando recursos nativos, APIs e serviços.',
        icon: iconSmartphone,
        name: 'Desenvolvimento Mobile',
      },
      {
        description:
          'Análise de requisitos, planejamento técnico e testes para desenvolver soluções confiáveis.',
        icon: iconCpu,
        name: 'Engenharia de Software',
      },
    ],
    title: '/Atuação',
  },
  stack: {
    description:
      'Ferramentas e práticas que uso no dia a dia para criar produtos digitais.',
    title: '/Habilidades',
  },
  works: {
    description:
      'Projetos que mostram como transformo ideias em produtos digitais.',
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
        'Serviço backend que usa IA para analisar vagas e enviar as melhores oportunidades pelo Telegram.',
        href: 'https://github.com/mateussantanasilva/job-hunter',
        image: projectJobHunter,
        title: 'Job Hunter AI',
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
      // {
      //   description:
      //     'Coleção de aplicações desenvolvidas durante a formação Ignite para praticar React.js, componentização e fundamentos do ecossistema Front-end.',
      //   href: 'https://github.com/mateussantanasilva/WebProjects',
      //   image: projectIgnite,
      //   title: 'Projetos Ignite',
      // },
    ],
    title: '/Projetos',
  },
} as const
