/**
 * ============================================================================
 * SCRIPT PRINCIPAL - PORTAFOLIO DATA SCIENTIST
 * ============================================================================
 * Contiene la lógica interactiva de navegación móvil, filtrado de habilidades,
 * modal de detalle de proyectos, scroll-spy y formulario de contacto.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. DATOS DE PROYECTOS PARA EL MODAL DETALLADO
     ========================================================================== */
  const PROJECTS_DATA = [
    {
      category: 'NLP & LLMs · Sistemas RAG',
      title: 'Asistente IA con RAG: Ley Federal del Trabajo',
      description:
        'Chatbot interactivo que responde consultas sobre la legislación laboral de México mediante un sistema de Generación Aumentada por Recuperación (RAG). Desarrollado con LangChain, ChromaDB y la API de OpenAI, y desplegado en Streamlit Cloud.',
      highlights: [
        'Indexación semántica de la Ley Federal del Trabajo de México en una base vectorial ChromaDB.',
        'Orquestación de consultas contextuales mediante LangChain y modelos de OpenAI para respuestas precisas.',
        'Interfaz conversacional desplegada en Streamlit Cloud accesible para consulta inmediata.'
      ],
      tech: ['Streamlit', 'Pandas', 'LangChain', 'Seaborn', 'Matplotlib', 'RAG & ChromaDB'],
      repoUrl: 'https://github.com/efren55'
    },
    {
      category: 'AI & Data Analytics · BigQuery & NLP',
      title: 'Análisis de Tendencias con Google Trends e IA',
      description:
        'Pipeline de análisis de datos y NLP aplicado al dataset de Google Trends Hourly (BigQuery) para evaluar los términos más buscados de la semana. Desarrollado con Pandas, Matplotlib y Seaborn para exploración visual, y enriquecido con LangChain, Gemini API, modelos de Hugging Face y Lingua para el procesamiento de texto.',
      highlights: [
        'Extracción y agregación de series temporales de búsqueda desde Google Trends Hourly en BigQuery mediante SQL.',
        'Clasificación lingüística y enriquecimiento semántico con Lingua, Hugging Face, LangChain y Gemini API.',
        'Visualización analítica de patrones semanales de interés con Pandas, Matplotlib y Seaborn.'
      ],
      tech: ['LangChain', 'SQL', 'BigQuery', 'Pandas', 'Seaborn', 'Matplotlib', 'Lingua & Hugging Face'],
      repoUrl: 'https://github.com/efren55'
    },
    {
      category: 'AI & Data Analytics · Big Data & Movilidad',
      title: 'Análisis de Movilidad Urbana en NYC',
      description:
        'Procesamiento y análisis a gran escala de millones de registros del dataset de taxis de NYC para evaluar patrones de demanda y uso del transporte por distrito. Desarrollo de pipelines de Big Data utilizando Databricks, PySpark y Spark SQL, integrando LangChain y realizando análisis exploratorio (EDA) con Pandas, Matplotlib y Seaborn.',
      highlights: [
        'Procesamiento distribuido de millones de viajes en Databricks utilizando PySpark y consultas optimizadas en Spark SQL.',
        'Análisis exploratorio (EDA) de demanda horaria, estacionalidad y flujos entre distritos de Nueva York.',
        'Integración de LangChain y visualizaciones estadísticas con Pandas, Matplotlib y Seaborn para comunicar hallazgos clave.'
      ],
      tech: ['Pandas', 'LangChain', 'Databricks', 'PySpark', 'Spark SQL', 'Seaborn', 'Matplotlib'],
      repoUrl: 'https://github.com/efren55'
    }
  ];

  /* ==========================================================================
     2. MENÚ DE NAVEGACIÓN RESPONSIVE (MÓVIL)
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar menú móvil al hacer clic en cualquier enlace
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar menú al hacer clic fuera de la barra de navegación
    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ==========================================================================
     3. RESALTADO DE SECCIÓN ACTIVA AL HACER SCROLL (SCROLL SPY)
     ========================================================================== */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navItems.forEach((item) => {
          item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* ==========================================================================
     4. FILTRADO INTERACTIVO DE HABILIDADES (SKILLS)
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedFilter = button.getAttribute('data-filter');

      // Actualizar estado visual y accesible de los botones
      filterButtons.forEach((btn) => {
        const isCurrent = btn === button;
        btn.classList.toggle('active', isCurrent);
        btn.setAttribute('aria-selected', String(isCurrent));
      });

      // Mostrar u ocultar tarjetas según la categoría seleccionada
      skillCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = selectedFilter === 'all' || cardCategory === selectedFilter;
        card.style.display = shouldShow ? 'flex' : 'none';
      });
    });
  });

  /* ==========================================================================
     5. MODAL DE DETALLE DE PROYECTOS
     ========================================================================== */
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalSecondaryClose = document.getElementById('modalSecondaryClose');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalHighlights = document.getElementById('modalHighlights');
  const modalTech = document.getElementById('modalTech');
  const modalRepoLink = document.getElementById('modalRepoLink');
  const projectTriggers = document.querySelectorAll('.project-modal-trigger');

  let lastFocusedTrigger = null;

  const openProjectModal = (projectIndex, triggerElement) => {
    const project = PROJECTS_DATA[projectIndex];
    if (!project || !modal) return;

    lastFocusedTrigger = triggerElement || document.activeElement;

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;

    // Renderizar puntos clave
    modalHighlights.innerHTML = '';
    project.highlights.forEach((point) => {
      const li = document.createElement('li');
      li.textContent = point;
      modalHighlights.appendChild(li);
    });

    // Renderizar etiquetas tecnológicas
    modalTech.innerHTML = '';
    project.tech.forEach((techName) => {
      const span = document.createElement('span');
      span.className = 'tech-mini-badge';
      span.textContent = techName;
      modalTech.appendChild(span);
    });

    if (modalRepoLink) {
      modalRepoLink.href = project.repoUrl;
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (modalClose) {
      modalClose.focus();
    }
  };

  const closeProjectModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';

    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  };

  projectTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const index = Number(trigger.getAttribute('data-project'));
      openProjectModal(index, trigger);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalSecondaryClose) modalSecondaryClose.addEventListener('click', closeProjectModal);

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  /* ==========================================================================
     6. FORMULARIO DE CONTACTO Y AÑO ACTUAL
     ========================================================================== */


  const contactForm = document.getElementById('contactForm');
  const submitBtnText = document.getElementById('submitBtnText');

  if (contactForm && submitBtnText) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();
      const proveedor = document.getElementById('proveedorCorreo').value;

      if (!nombre || !mensaje) return;

      // =========================================================================
      // SEGURIDAD ANTI-BOTS RECOLECTORES (Ocultación en Base64):
      // "ZGV2ZWxvcGVyaW90Y29udHJvbHNAZ21haWwuY29t" es "developeriotcontrols@gmail.com"
      // Si algún día cambias de correo, puedes generar el código en la consola del 
      // navegador escribiendo: btoa("tu_nuevo_correo@gmail.com")
      // =========================================================================
      const CORREO_OCULTO_BASE64 = "ZGV2ZWxvcGVyaW90Y29udHJvbHNAZ21haWwuY29t";
      const destino = atob(CORREO_OCULTO_BASE64); // Desencripta tu correo al instante

      // Preparamos el asunto y el cuerpo del mensaje codificados para URL
      const asunto = encodeURIComponent(`Contacto desde portafolio web: ${nombre}`);
      const cuerpo = encodeURIComponent(`Hola, soy ${nombre}.\n\n${mensaje}`);

      let urlRedireccion = "";

      // Generamos el enlace exacto según lo que eligió el usuario
      if (proveedor === "gmail") {
        // Abre directamente la ventana de redactar de Gmail en el navegador
        urlRedireccion = `https://mail.google.com/mail/?view=cm&fs=1&to=${destino}&su=${asunto}&body=${cuerpo}`;
        window.open(urlRedireccion, '_blank', 'noopener,noreferrer');
      }
      else if (proveedor === "outlook") {
        // Abre directamente la ventana de redactar de Outlook/Hotmail en el navegador
        urlRedireccion = `https://outlook.live.com/mail/0/deeplink/compose?to=${destino}&subject=${asunto}&body=${cuerpo}`;
        window.open(urlRedireccion, '_blank', 'noopener,noreferrer');
      }
      else {
        // Abre la app nativa del celular (iOS/Android) o cliente de escritorio
        urlRedireccion = `mailto:${destino}?subject=${asunto}&body=${cuerpo}`;
        window.location.href = urlRedireccion;
      }

      // Confirmación visual en el botón
      const originalText = submitBtnText.textContent;
      submitBtnText.textContent = '¡Abriendo tu bandeja de correo!';
      contactForm.reset();

      setTimeout(() => {
        submitBtnText.textContent = originalText;
      }, 3500);
    });
  }

  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
