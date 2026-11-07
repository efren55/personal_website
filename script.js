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
     EDITAR: Personaliza aquí la información detallada de cada proyecto.
     ========================================================================== */
  const PROJECTS_DATA = [
    {
      category: 'Machine Learning · Clasificación',
      title: 'Predicción de Abandono de Clientes (Churn)',
      description:
        'Desarrollo de un sistema end-to-end para detectar clientes con alta probabilidad de cancelar su suscripción, permitiendo al equipo comercial intervenir de forma proactiva.',
      highlights: [
        'Ingeniería de variables sobre histórico transaccional y comportamiento de uso.',
        'Entrenamiento y optimización de XGBoost logrando un ROC-AUC de 0.91 en validación temporal.',
        'Integración de valores SHAP para explicar los factores de riesgo individuales de cada cliente.'
      ],
      tech: ['Python', 'XGBoost', 'Scikit-Learn', 'SHAP', 'SQL', 'Docker'],
      repoUrl: 'https://github.com/tu-usuario'
    },
    {
      category: 'NLP & LLMs · Procesamiento de Texto',
      title: 'Análisis Inteligente de Reseñas y Sentimiento',
      description:
        'Pipeline automatizado de Procesamiento de Lenguaje Natural para clasificar miles de comentarios de usuarios, detectar urgencias y resumir hallazgos clave.',
      highlights: [
        'Fine-tuning de modelos basados en Transformers para clasificación multietiqueta.',
        'Clustering semántico mediante embeddings para descubrir tópicos emergentes sin supervisión.',
        'Despliegue de una API REST ligera en FastAPI para inferencia en tiempo real.'
      ],
      tech: ['Python', 'PyTorch', 'Hugging Face', 'FastAPI', 'Plotly'],
      repoUrl: 'https://github.com/tu-usuario'
    },
    {
      category: 'Series de Tiempo · Forecasting',
      title: 'Motor de Pronóstico de Demanda Multivariado',
      description:
        'Arquitectura de pronóstico a nivel tienda-producto para optimizar niveles de inventario y reducir quiebres de stock en cadenas de suministro.',
      highlights: [
        'Incorporación de regresores exógenos: calendario promocional, precios y clima.',
        'Reducción del error porcentual absoluto medio (MAPE) por debajo del 6.5%.',
        'Tablero interactivo de seguimiento para comparar predicciones vs. demanda real.'
      ],
      tech: ['Python', 'LightGBM', 'Statsmodels', 'Pandas', 'Streamlit'],
      repoUrl: 'https://github.com/tu-usuario'
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

  const openProjectModal = (projectIndex) => {
    const project = PROJECTS_DATA[projectIndex];
    if (!project || !modal) return;

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
  };

  const closeProjectModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  projectTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const index = Number(trigger.getAttribute('data-project'));
      openProjectModal(index);
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
     6. MICRO-INTERACCIÓN EN BARRAS DEL HERO
     ========================================================================== */
  const heroMiniBars = document.getElementById('heroMiniBars');
  if (heroMiniBars) {
    heroMiniBars.addEventListener('mouseenter', () => {
      const bars = heroMiniBars.querySelectorAll('.mini-bar');
      bars.forEach((bar) => {
        const randomHeight = Math.floor(Math.random() * 55) + 40;
        bar.style.height = `${randomHeight}%`;
      });
    });
  }

  /* ==========================================================================
     7. FORMULARIO DE CONTACTO Y AÑO ACTUAL
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
