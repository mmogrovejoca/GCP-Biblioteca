// ==========================================
// DATA STORE (The "Brain")
// ==========================================
const gcpData = [
    // --- GOBIERNO (Expanded) ---
    {
        id: 1,
        category: "Gobierno",
        title: "Resource Hierarchy",
        description: "La estructura base de GCP: Organización -> Carpetas -> Proyectos -> Recursos. Fundamental para la herencia de políticas.",
        bestPractice: "Utiliza Carpetas para reflejar unidades de negocio o entornos (Prod, Dev). Usa 'Tags' para control granular de políticas.",
        tags: ["iam", "organization", "folders"]
    },
    {
        id: 2,
        category: "Gobierno",
        title: "IAM Best Practices & Conditions",
        description: "Gestión de identidades. IAM Conditions permite otorgar acceso solo si se cumplen ciertos criterios (ej: hora del día, IP).",
        bestPractice: "Aplica el Principio de Menor Privilegio (PoLP). Usa IAM Conditions para accesos temporales y evita Service Accounts Keys permanentes.",
        tags: ["security", "access", "conditions"]
    },
    {
        id: 3,
        category: "Gobierno",
        title: "Organization Policies (Constraints)",
        description: "Control centralizado sobre recursos. Restringe configuraciones físicas y lógicas.",
        bestPractice: "Aplica restricciones críticas: 'Domain Restricted Sharing', 'Trusted Image Projects' y 'Disable External IP for Compute Engines' por defecto.",
        tags: ["compliance", "security"]
    },
    {
        id: 17,
        category: "Gobierno",
        title: "Infrastructure as Code (IaC) - Terraform",
        description: "Gestión de infraestructura mediante código declarativo. Es el estándar de facto en GCP.",
        bestPractice: "Almacena el estado de Terraform en un Bucket de GCS con versionado activado. Usa módulos para estandarizar recursos y 'Service Account Impersonation' para ejecutar los planes.",
        tags: ["terraform", "automation", "devops"]
    },
    {
        id: 18,
        category: "Gobierno",
        title: "Workload Identity Federation",
        description: "Permite acceder a recursos de GCP desde AWS, Azure o On-prem sin descargar claves de Service Accounts.",
        bestPractice: "ELIMINA las claves de cuentas de servicio (JSON keys) de tus repositorios. Usa Workload Identity para autenticar pipelines de CI/CD (GitHub Actions, GitLab).",
        tags: ["security", "auth", "multi-cloud"]
    },
    {
        id: 19,
        category: "Gobierno",
        title: "Cloud Asset Inventory",
        description: "Servicio para monitorizar y analizar todos los recursos y políticas de IAM en tiempo real.",
        bestPractice: "Configura feeds de notificación para detectar cambios críticos en la infraestructura (ej: un firewall abierto al mundo) y disparar una Cloud Function de remediación.",
        tags: ["inventory", "monitoring", "security"]
    },

    // --- ARQUITECTURA (New & Expanded) ---
    {
        id: 33,
        category: "Arquitectura",
        title: "Regional vs Zonal vs Global",
        description: "Entender el alcance de falla de los recursos. Zonal (VM), Regional (Subnet, App Engine), Global (VPC, Pub/Sub).",
        bestPractice: "Diseña para fallas zonales como mínimo. Para alta disponibilidad (HA), distribuye recursos en múltiples zonas dentro de una región. Para DR crítico, usa multi-región.",
        tags: ["ha", "reliability", "dr"]
    },
    {
        id: 34,
        category: "Arquitectura",
        title: "Disaster Recovery Patterns",
        description: "Estrategias de recuperación: Cold, Warm y Hot standby.",
        bestPractice: "Define tu RTO y RPO antes de elegir. Para bases de datos, Cloud SQL HA (Regional) cubre la mayoría de casos. Spanner ofrece consistencia global para requisitos extremos.",
        tags: ["dr", "rto", "rpo"]
    },
    {
        id: 35,
        category: "Arquitectura",
        title: "Private Service Connect",
        description: "Conexión privada a servicios de Google y de terceros sin usar direcciones IP públicas ni peering complejo.",
        bestPractice: "Úsalo en lugar de VPC Peering cuando necesites consumir un servicio en otra VPC (incluso de otra organización) sin preocuparte por la superposición de IPs (CIDR overlap).",
        tags: ["networking", "security", "privatelink"]
    },
    {
        id: 36,
        category: "Arquitectura",
        title: "Serverless Event-Driven (Eventarc)",
        description: "Arquitecturas reactivas que escalan a cero. Eventarc unifica la entrega de eventos desde Google, SaaS y aplicaciones propias.",
        bestPractice: "Desacopla servicios usando Pub/Sub y Eventarc. Esto permite que los equipos evolucionen independientemente y el sistema sea más resiliente a picos de tráfico.",
        tags: ["serverless", "events", "microservices"]
    },
    {
        id: 37,
        category: "Arquitectura",
        title: "Microservices & Service Mesh",
        description: "Gestión de comunicación entre microservicios (mTLS, observabilidad, traffic splitting).",
        bestPractice: "No implementes Istio/Anthos Service Mesh prematuramente. Comienza con servicios bien definidos en Cloud Run o GKE estándar. Adopta Mesh solo cuando la complejidad de red lo justifique.",
        tags: ["k8s", "istio", "anthos"]
    },
    {
        id: 38,
        category: "Arquitectura",
        title: "Cost Optimization (CUDs)",
        description: "Estrategias financieras para reducir la factura de nube.",
        bestPractice: "Analiza 'Recommendations AI'. Compromete uso (Committed Use Discounts) solo para cargas base estables (cómputo/base de datos) por 1 o 3 años para ahorrar hasta un 50-70%.",
        tags: ["finops", "billing", "saving"]
    },
        {
        id: 39,
        category: "Arquitectura",
        title: "Hybrid Connectivity",
        description: "Conectar On-premise con GCP: Cloud VPN (HA) vs Cloud Interconnect (Dedicated/Partner).",
        bestPractice: "Usa VPN HA para cargas menores a 3 Gbps o backups. Para latencia baja y alto throughput crítico, invierte en Interconnect. Siempre diseña redundancia (99.99% SLA requiere 2 interconexiones en 2 metros).",
        tags: ["hybrid", "network", "mpls"]
    },

    // --- DESARROLLO (New Category) ---
    {
        id: 25,
        category: "Desarrollo",
        title: "Cloud Build (CI/CD Serverless)",
        description: "Plataforma de integración y despliegue continuo totalmente gestionada.",
        bestPractice: "Usa 'Private Pools' si necesitas acceder a recursos dentro de tu VPC durante el build. Integra chequeos de seguridad (Container Analysis) en el pipeline antes de desplegar.",
        tags: ["cicd", "devops", "automation"]
    },
    {
        id: 26,
        category: "Desarrollo",
        title: "Artifact Registry",
        description: "El sucesor de Container Registry. Almacena imágenes Docker, paquetes Maven, npm, etc.",
        bestPractice: "Utiliza repositorios remotos en Artifact Registry para cachear dependencias públicas (proxy) y evitar errores de 'rate limit' o caídas de repositorios públicos externos.",
        tags: ["containers", "dependencies", "security"]
    },
    {
        id: 27,
        category: "Desarrollo",
        title: "Cloud Functions (2nd Gen)",
        description: "FaaS basado en Knative. Mayor concurrencia, tiempos de ejecución más largos y triggers de Eventarc.",
        bestPractice: "Prefiere 2nd Gen sobre 1st Gen. Usa Cloud Functions para 'pegamento' (glue code) y tareas ligeras basadas en eventos. Para APIs REST complejas, prefiere Cloud Run.",
        tags: ["serverless", "faas", "python", "node"]
    },
    {
        id: 28,
        category: "Desarrollo",
        title: "Firestore vs Cloud SQL",
        description: "NoSQL (Documentos) vs Relacional (SQL). Firestore escala horizontalmente casi infinitamente.",
        bestPractice: "Usa Firestore para backends de apps móviles, perfiles de usuario y catálogos en tiempo real. Usa Cloud SQL (PostgreSQL) si necesitas transacciones complejas, ACID estricto y esquemas relacionales.",
        tags: ["database", "nosql", "sql"]
    },
        {
        id: 29,
        category: "Desarrollo",
        title: "API Gateway & Apigee",
        description: "Gestión de APIs. API Gateway es ligero (basado en Envoy). Apigee es empresarial completo.",
        bestPractice: "Para microservicios internos o exposiciones simples, API Gateway es suficiente. Si necesitas monetización, portal de desarrolladores y analítica profunda, salta a Apigee.",
        tags: ["api", "rest", "management"]
    },
    {
        id: 30,
        category: "Desarrollo",
        title: "Cloud Code & IDEs",
        description: "Plugin para VS Code e IntelliJ que facilita el desarrollo en Kubernetes y Cloud Run.",
        bestPractice: "Instala Cloud Code para tener 'skaffold' integrado. Permite bucles de desarrollo rápidos (hot reload) en clústeres remotos de desarrollo sin tener que reconstruir Dockerfiles manualmente.",
        tags: ["ide", "productivity", "k8s"]
    },
        {
        id: 31,
        category: "Desarrollo",
        title: "Debugging & Profiling",
        description: "Herramientas de Cloud Operations para inspeccionar código en producción sin detenerlo.",
        bestPractice: "Usa Cloud Profiler continuamente (bajo overhead) para detectar cuellos de botella de CPU/RAM. Cloud Trace es obligatorio para arquitecturas de microservicios distribuidos.",
        tags: ["observability", "debug", "performance"]
    },

    // --- COMPUTO (Existing + Refined) ---
    {
        id: 6,
        category: "Computo",
        title: "GKE vs Cloud Run",
        description: "GKE es Kubernetes estándar. Cloud Run es Knative serverless.",
        bestPractice: "Empieza con Cloud Run. Migra a GKE Autopilot si necesitas control de red avanzado. GKE Standard solo para casos muy específicos de personalización de nodos.",
        tags: ["kubernetes", "containers"]
    },
        {
        id: 8,
        category: "Computo",
        title: "Compute Engine (Spot VMs)",
        description: "VMs preemtibles con hasta 91% de descuento.",
        bestPractice: "Ideales para trabajos batch o renderizado. Usa 'Managed Instance Groups' (MIGs) para reponer automáticamente las instancias si Google las reclama.",
        tags: ["vm", "cost"]
    },

    // --- NETWORKING (Existing +) ---
    {
        id: 12,
        category: "Networking",
        title: "VPC Design & Subnets",
        description: "Red definida por software global.",
        bestPractice: "Planifica tu direccionamiento IP con cuidado (evita superposiciones). Usa 'Private Google Access' para que las VMs sin IP pública accedan a las APIs de Google.",
        tags: ["vpc", "ip"]
    },
    {
        id: 15,
        category: "Networking",
        title: "Cloud Load Balancing (GSLB)",
        description: "Balanceo global Anycast.",
        bestPractice: "Usa HTTPS LB Global con Cloud CDN activado para entregar contenido estático. Cloud Armor (WAF) se integra aquí para protección DDoS y OWASP Top 10.",
        tags: ["lb", "security", "cdn"]
    },

    // --- DATOS (Existing +) ---
    {
        id: 9,
        category: "Datos",
        title: "BigQuery (Data Warehouse)",
        description: "Analítica a escala de petabytes.",
        bestPractice: "Optimiza costos: 1) Particiona tablas por fecha. 2) Clustered tables. 3) Usa 'Preview' en lugar de Select *. 4) Configura expiración de tablas temporales.",
        tags: ["analytics", "sql"]
    },
    {
        id: 10,
        category: "Datos",
        title: "Dataflow (Apache Beam)",
        description: "Procesamiento unificado Batch y Stream.",
        bestPractice: "Para pipelines simples de movimiento de datos, prefiere las plantillas de Dataflow (Templates) antes que escribir código Beam desde cero.",
        tags: ["etl", "stream"]
    },

        // --- SEGURIDAD (Existing +) ---
    {
        id: 16,
        category: "Seguridad",
        title: "VPC Service Controls",
        description: "Perímetro de seguridad para datos.",
        bestPractice: "Es la defensa más fuerte contra exfiltración. Úsalo para 'encerrar' BigQuery y Storage de modo que solo sean accesibles desde redes confiables, bloqueando accesos públicos incluso con credenciales robadas.",
        tags: ["perimeter", "dlp"]
    },
    {
        id: 41,
        category: "Seguridad",
        title: "Secret Manager",
        description: "Almacenamiento seguro de claves API, passwords y certificados.",
        bestPractice: "Nunca guardes secretos en variables de entorno en texto plano. Inyectalos en tiempo de ejecución en Cloud Run/Functions como volúmenes montados o variables de entorno desde Secret Manager.",
        tags: ["secrets", "devsecops"]
    }
];

// ==========================================
// APP LOGIC
// ==========================================

// State
let currentCategory = 'All';
let searchTerm = '';

// DOM Elements
const sidebar = document.getElementById('sidebar');
const contentGrid = document.getElementById('contentGrid');
const searchInput = document.getElementById('searchInput');

// Initialize
function init() {
    renderSidebar();
    renderContent();
    setupEventListeners();
}

// Render Sidebar Categories
function renderSidebar() {
    // Get unique categories and counts
    const categories = ['All', ...new Set(gcpData.map(item => item.category))];

    const html = `
        <div class="nav-header">Categorías</div>
        ${categories.map(cat => {
            const count = cat === 'All'
                ? gcpData.length
                : gcpData.filter(d => d.category === cat).length;

            return `
                <div class="nav-item ${cat === currentCategory ? 'active' : ''}"
                        onclick="setCategory('${cat}')">
                    <span>${cat === 'All' ? 'Ver Todo' : cat}</span>
                    <span class="count">${count}</span>
                </div>
            `;
        }).join('')}
    `;

    sidebar.innerHTML = html;
}

// Render Main Content
function renderContent() {
    // Filter Data
    const filteredData = gcpData.filter(item => {
        const matchesCategory = currentCategory === 'All' || item.category === currentCategory;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.bestPractice.toLowerCase().includes(searchLower) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchLower));

        return matchesCategory && matchesSearch;
    });

    // Generate HTML
    if (filteredData.length === 0) {
        contentGrid.innerHTML = `
            <div class="no-results">
                <span class="material-icons">sentiment_dissatisfied</span>
                <h2>No se encontraron resultados</h2>
                <p>Intenta ajustar tu búsqueda o categoría.</p>
            </div>
        `;
        return;
    }

    contentGrid.innerHTML = filteredData.map(item => `
        <div class="card">
            <div class="card-header">
                <span class="tag ${item.category}">${item.category}</span>
            </div>
            <h3 class="card-title">${highlightText(item.title, searchTerm)}</h3>
            <p class="card-desc">${highlightText(item.description, searchTerm)}</p>
            <div class="architect-note">
                <strong><span class="material-icons" style="font-size:12px; vertical-align:middle">stars</span> Recomendación del Arquitecto</strong>
                ${highlightText(item.bestPractice, searchTerm)}
            </div>
        </div>
    `).join('');
}

// Helper: Escape Regex characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Helper: Highlight search terms
function highlightText(text, query) {
    if (!query) return text;
    const safeQuery = escapeRegExp(query);
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderContent();
    });
}

// Actions
window.setCategory = function(cat) {
    currentCategory = cat;
    renderSidebar(); // Re-render to update active class
    renderContent();

    // On mobile, scroll to top of content
    if (window.innerWidth <= 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Start App
init();
