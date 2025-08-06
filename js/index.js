/**
 * Manejo del formulario de contacto
 */
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  // Mostrar estado de carga
  submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Enviando...';
  submitBtn.disabled = true;

  try {
    // Recopilar datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validar campos requeridos
    if (!validateForm(data)) {
      throw new Error("Por favor completa todos los campos requeridos");
    }

    // Preparar el email
    const emailData = prepareEmailData(data);

    // Simular envío de email (en un entorno real, esto se haría con un backend)
    await sendEmail(emailData);

    // Mostrar mensaje de éxito
    showSuccessMessage();

    // Limpiar formulario
    form.reset();
  } catch (error) {
    showErrorMessage(error.message);
  } finally {
    // Restaurar botón
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
}

function validateForm(data) {
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "service",
    "origin",
    "destination",
    "message",
  ];

  for (const field of requiredFields) {
    if (!data[field] || data[field].trim() === "") {
      return false;
    }
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return false;
  }

  return true;
}

function prepareEmailData(data) {
  const serviceNames = {
    embalaje: "Embalaje Profesional",
    cargue: "Cargue de Paquetes",
    descargue: "Descargue de Paquetes",
    completo: "Servicio Completo (Embalaje + Cargue + Descargue)",

  };

  const urgencyNames = {
    normal: "Normal (3-5 días)",
    express: "Express (1-2 días)",
    urgent: "Urgente (Mismo día)",
  };

  return {
    to: "info@servicecargue.com",
    subject: `Nueva Solicitud de Cotización - ${
      serviceNames[data.service] || data.service
    }`,
    body: `
NUEVA SOLICITUD DE COTIZACIÓN - SERVICECARGUE

DATOS DEL CLIENTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre Completo: ${data.firstName} ${data.lastName}
Email: ${data.email}
Teléfono: ${data.phone}
Empresa: ${data.company || "No especificada"}

DETALLES DEL SERVICIO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Servicio Solicitado: ${serviceNames[data.service] || data.service}
Ciudad de Origen: ${data.origin}
Ciudad de Destino: ${data.destination}
Peso Aproximado: ${data.weight ? data.weight + " kg" : "No especificado"}
Urgencia: ${urgencyNames[data.urgency] || data.urgency}

MENSAJE DEL CLIENTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Solicitud enviada desde: www.servicecargue.com
Fecha: ${new Date().toLocaleString("es-CO")}
        `.trim(),
  };
}

async function sendEmail(emailData) {
  // En un entorno real, aquí harías una llamada a tu backend
  // Por ahora, simularemos el envío con EmailJS o similar

  // Simulación de envío (reemplaza con tu servicio real)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular éxito (en producción, conecta con tu servicio de email)
      console.log("Email que se enviaría:", emailData);

      // Para implementación real con EmailJS:
      // emailjs.send('service_id', 'template_id', emailData)
      //   .then(resolve)
      //   .catch(reject);

      // Por ahora, abrimos el cliente de email del usuario
      const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(
        emailData.subject
      )}&body=${encodeURIComponent(emailData.body)}`;
      window.open(mailtoLink);

      resolve("Email enviado exitosamente");
    }, 1500);
  });
}

function showSuccessMessage() {
  // Crear mensaje de éxito
  const message = document.createElement("div");
  message.className = "alert alert-success";
  message.innerHTML = `
        <div class="alert-content">
            <i class="ri-check-circle-line"></i>
            <h4>¡Solicitud Enviada Exitosamente!</h4>
            <p>Hemos recibido tu solicitud de cotización. Nos pondremos en contacto contigo en las próximas 2 horas durante horario laboral.</p>
        </div>
    `;

  showAlert(message);
}

function showErrorMessage(errorMsg) {
  const message = document.createElement("div");
  message.className = "alert alert-error";
  message.innerHTML = `
        <div class="alert-content">
            <i class="ri-error-warning-line"></i>
            <h4>Error al Enviar</h4>
            <p>${errorMsg}</p>
        </div>
    `;

  showAlert(message);
}

function showAlert(alertElement) {
  // Remover alertas existentes
  const existingAlerts = document.querySelectorAll(".alert");
  existingAlerts.forEach((alert) => alert.remove());

  // Insertar nueva alerta al inicio del formulario
  const form = document.getElementById("contactForm");
  form.parentNode.insertBefore(alertElement, form);

  // Scroll hacia la alerta
  alertElement.scrollIntoView({ behavior: "smooth", block: "center" });

  // Auto-remover después de 8 segundos
  setTimeout(() => {
    if (alertElement.parentNode) {
      alertElement.remove();
    }
  }, 8000);
}

// Validación en tiempo real
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(
    "#contactForm input, #contactForm select, #contactForm textarea"
  );

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });
  });
});

function validateField(field) {
  const value = field.value.trim();
  const isRequired = field.hasAttribute("required");

  // Remover clases de validación existentes
  field.classList.remove("field-valid", "field-invalid");

  if (isRequired && !value) {
    field.classList.add("field-invalid");
    return false;
  }

  // Validación específica por tipo
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      field.classList.add("field-invalid");
      return false;
    }
  }

  if (value) {
    field.classList.add("field-valid");
  }

  return true;
}

/**NAVEGACION */
function loadNavigation() {
  fetch("nav.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      const navPlaceholder = document.getElementById("nav-placeholder");
      if (navPlaceholder) {
        navPlaceholder.innerHTML = html;
      } else {
        console.warn("Elemento nav-placeholder no encontrado");
      }
    })
    .catch((err) => {
      console.warn("No se pudo cargar nav.html:", err);
    });
}
/**FOOTER */
function loadFooter() {
  fetch("footer.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      const footerPlaceholder = document.getElementById("footer-placeholder");
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = html;
      } else {
        console.warn("Elemento footer-placeholder no encontrado");
      }
    })
    .catch((err) => {
      console.warn("No se pudo cargar footer.html:", err);
    });
}

document.addEventListener("DOMContentLoaded", loadNavigation);
document.addEventListener("DOMContentLoaded", loadFooter);
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
});
