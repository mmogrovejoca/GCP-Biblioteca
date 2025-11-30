// ==========================================
// DATA STORE (The "Brain")
// ==========================================
const gcpData = [
    // ==================================================================================
    // 1. GOBIERNO, IDENTIDAD Y FINOPS (Cimientos)
    // ==================================================================================
    {
        id: 101,
        category: "Gobierno",
        title: "Jerarquía de Recursos",
        description: "Estructura organizativa: Organización (Raíz) -> Carpetas (Dept/Entorno) -> Proyectos (Límite de confianza/facturación) -> Recursos.",
        bestPractice: "Mapea la jerarquía a tu estructura de negocio. Usa Carpetas para aislar Prod de Non-Prod y aplicar políticas (Org Policies) diferenciadas.",
        tags: ["organization", "folders", "projects"]
    },
    {
        id: 102,
        category: "Gobierno",
        title: "IAM: Mínimo Privilegio & Custom Roles",
        description: "Sistema de control de acceso. Los roles predefinidos pueden ser amplios. Los Custom Roles permiten ajustar permisos específicos.",
        bestPractice: "Evita roles básicos (Owner/Editor) en Prod. Usa 'IAM Recommender' para eliminar permisos no usados. Audita 'Custom Roles' periódicamente.",
        tags: ["iam", "security", "roles"]
    },
    {
        id: 103,
        category: "Gobierno",
        title: "Workload Identity Federation",
        description: "Mecanismo para autenticar cargas de trabajo externas (AWS, Azure, On-prem, GitHub Actions) sin gestionar claves de servicio (Service Account Keys).",
        bestPractice: "Es la forma PREFERIDA de autenticación externa. Evita riesgos de fuga de claves JSON de Service Accounts. Configura pools de identidad dedicados.",
        tags: ["iam", "security", "federation", "multicloud"]
    },
    {
        id: 104,
        category: "Gobierno",
        title: "Organization Policies",
        description: "Restricciones preventivas centralizadas que se heredan en la jerarquía (ej: restringir regiones, prohibir IPs públicas).",
        bestPractice: "Aplica 'constraints' de seguridad desde el día 1: 'iam.disableServiceAccountKeyCreation', 'compute.vmExternalIpAccess' (bloquear), y restricciones de residencia de datos.",
        tags: ["policy", "compliance", "governance"]
    },
    {
        id: 105,
        category: "Gobierno",
        title: "Service Accounts: Gestión de Keys",
        description: "Identidades máquina para aplicaciones. Las claves exportadas (JSON) son el vector de ataque #1 en la nube.",
        bestPractice: "Evita claves exportadas siempre que sea posible. Si son necesarias, rótalas automáticamente cada 90 días. Usa 'Service Account Impersonation' para desarrolladores locales.",
        tags: ["iam", "security", "keys"]
    },
    {
        id: 106,
        category: "Gobierno",
        title: "Billing & Cost Management",
        description: "Gestión financiera. Budgets envían alertas. Labels (clave:valor) permiten desglosar costos.",
        bestPractice: "Etiqueta TODOS los recursos (env, owner, cost-center). Configura presupuestos al 50%, 90% y 100% del gasto esperado. Vincula alertas a Pub/Sub para acciones automáticas.",
        tags: ["finops", "billing", "labels"]
    },
    {
        id: 107,
        category: "Gobierno",
        title: "FinOps: BigQuery Billing Export",
        description: "Exportación detallada de logs de facturación a BigQuery para análisis granular SQL.",
        bestPractice: "Habilita el 'Detailed Usage Cost' export para ver costos a nivel de recurso y etiquetas. Conecta estos datos a Looker Studio para dashboards de chargeback.",
        tags: ["finops", "bigquery", "analytics"]
    },
    {
        id: 108,
        category: "Gobierno",
        title: "Terraform en GCP",
        description: "Infraestructura como Código (IaC). Permite versiones, auditoría y replicación de entornos.",
        bestPractice: "Adopta una estructura modular (red, app, data). Usa un 'Remote Backend' en GCS con bloqueo de estado. Implementa CI/CD para aplicar cambios de infraestructura.",
        tags: ["iac", "terraform", "automation"]
    },

    // ==================================================================================
    // 2. NETWORKING Y CONECTIVIDAD
    // ==================================================================================
    {
        id: 201,
        category: "Networking",
        title: "VPC Design & Subnets",
        description: "Diseño de red virtual global. Las subredes son regionales. Importante planificar rangos IP para evitar solapamientos.",
        bestPractice: "Usa modo 'Custom' (no Auto). Reserva rangos secundarios para pods y servicios de GKE (IP Aliasing). Planifica para crecimiento futuro.",
        tags: ["vpc", "subnets", "ipam"]
    },
    {
        id: 202,
        category: "Networking",
        title: "Shared VPC",
        description: "Permite compartir una VPC (Host Project) con múltiples Service Projects. Centraliza la red, descentraliza recursos.",
        bestPractice: "Patrón estándar para empresas. El equipo de redes gestiona el Host Project (Firewalls, VPN), los equipos de apps gestionan sus instancias en Service Projects.",
        tags: ["vpc", "shared-vpc", "architecture"]
    },
    {
        id: 203,
        category: "Networking",
        title: "VPC Network Peering",
        description: "Conecta dos VPCs independientes de forma privada. NO es transitivo (A conecta B, B conecta C -> A NO ve a C).",
        bestPractice: "Útil para SaaS o fusiones. Ten cuidado con el límite de cuotas y la falta de transitividad. Para arquitecturas Hub & Spoke complejas, considera VPN o Network Connectivity Center.",
        tags: ["peering", "connectivity"]
    },
    {
        id: 204,
        category: "Networking",
        title: "Cloud DNS",
        description: "Servicio DNS gestionado escalable. Soporta zonas públicas, privadas y peering de DNS.",
        bestPractice: "Usa 'Private Zones' para resolución interna. Configura DNS Peering para resolver nombres on-premise desde GCP y viceversa (Split-horizon DNS).",
        tags: ["dns", "hybrid"]
    },
    {
        id: 205,
        category: "Networking",
        title: "Hybrid: HA-VPN",
        description: "VPN IPsec de Alta Disponibilidad (99.99% SLA). Conecta on-premise con VPC a través de internet.",
        bestPractice: "Configura siempre dos túneles para redundancia. Usa BGP (Cloud Router) para enrutamiento dinámico y failover automático.",
        tags: ["vpn", "hybrid", "connectivity"]
    },
    {
        id: 206,
        category: "Networking",
        title: "Hybrid: Cloud Interconnect",
        description: "Conexión física dedicada (Dedicated) o a través de proveedor (Partner) para alto ancho de banda y baja latencia.",
        bestPractice: "Justificado para cargas masivas de datos o latencia crítica. Dedicated requiere presencia en colocation. Partner es más flexible. Requiere encriptación adicional (MACsec o VPN) si la seguridad es estricta.",
        tags: ["interconnect", "hybrid", "mpls"]
    },
    {
        id: 207,
        category: "Networking",
        title: "Global HTTP(S) Load Balancer (L7)",
        description: "Balanceador Anycast global. Termina SSL en el borde, cerca del usuario. Distribuye tráfico a backends en múltiples regiones.",
        bestPractice: "Úsalo para apps web públicas. Activa Cloud CDN para caché. Integra Cloud Armor para seguridad WAF. Certificados SSL gestionados por Google son gratuitos y se auto-renuevan.",
        tags: ["load-balancing", "http", "global"]
    },
    {
        id: 208,
        category: "Networking",
        title: "Internal Passthrough NLB (L4)",
        description: "Balanceo TCP/UDP regional interno. Preserva la IP del cliente (Source IP preservation).",
        bestPractice: "Ideal para bases de datos o servicios internos TCP que no requieren inspección HTTP. Latencia muy baja porque el tráfico fluye directamente al backend (Direct Server Return).",
        tags: ["load-balancing", "internal", "tcp"]
    },
    {
        id: 209,
        category: "Networking",
        title: "Cloud CDN & Caching",
        description: "Red de entrega de contenido integrada en Load Balancers. Cachea contenido estático en puntos de presencia (PoPs).",
        bestPractice: "Maximiza el 'Cache Hit Ratio' configurando cabeceras Cache-Control adecuadas. Usa invalidación de caché programática solo cuando sea estrictamente necesario (tiene costo).",
        tags: ["cdn", "performance", "web"]
    },
    {
        id: 210,
        category: "Networking",
        title: "Private Service Connect (PSC)",
        description: "Consumo privado de servicios (Google o 3rd party) mediante endpoints IP locales en tu VPC.",
        bestPractice: "Reemplazo moderno del VPC Peering para servicios. Elimina problemas de solapamiento de IPs y simplifica la seguridad (tráfico unidireccional).",
        tags: ["psc", "private-access", "security"]
    },

    // ==================================================================================
    // 3. SEGURIDAD ZERO TRUST
    // ==================================================================================
    {
        id: 301,
        category: "Seguridad",
        title: "VPC Service Controls (VPC-SC)",
        description: "Perímetro de seguridad que previene la exfiltración de datos desde servicios gestionados (BigQuery, Storage) hacia redes no autorizadas.",
        bestPractice: "Implementación compleja pero crítica para datos sensibles. Diseña perímetros por entorno. Usa 'Dry Run Mode' para auditar antes de bloquear tráfico real.",
        tags: ["vpc-sc", "data-protection", "exfiltration"]
    },
    {
        id: 302,
        category: "Seguridad",
        title: "Cloud Armor",
        description: "WAF (Web Application Firewall) y protección DDoS global en el borde.",
        bestPractice: "Configura reglas de limitación de tasa (Rate Limiting) para prevenir abusos. Usa reglas preconfiguradas para mitigar OWASP Top 10 (SQLi, XSS).",
        tags: ["waf", "ddos", "security"]
    },
    {
        id: 303,
        category: "Seguridad",
        title: "Firewall Rules vs Policies",
        description: "Reglas tradicionales (por proyecto/tag) vs Políticas Jerárquicas (Global/Regional/Org).",
        bestPractice: "Usa Políticas Jerárquicas de Firewall para imponer reglas base inmutables (ej: permitir SSH solo desde IAP) a nivel de Organización o Carpeta.",
        tags: ["firewall", "network-security"]
    },
    {
        id: 304,
        category: "Seguridad",
        title: "Identity-Aware Proxy (IAP)",
        description: "Acceso seguro a aplicaciones web y VMs (SSH/RDP) basado en identidad, sin VPN.",
        bestPractice: "Cierra el puerto 22/3389 al internet público. Usa túneles IAP para administración remota segura. Context-aware access permite validar dispositivo y ubicación.",
        tags: ["iap", "zero-trust", "remote-access"]
    },
    {
        id: 305,
        category: "Seguridad",
        title: "Secret Manager",
        description: "Almacenamiento centralizado y versionado de secretos (API keys, passwords, certificados).",
        bestPractice: "Nunca hardcodees secretos. Inyéctalos en tiempo de ejecución. Configura rotación automática con Cloud Functions para bases de datos.",
        tags: ["secrets", "devsecops"]
    },
    {
        id: 306,
        category: "Seguridad",
        title: "KMS & CMEK",
        description: "Key Management Service. CMEK (Customer-Managed Encryption Keys) permite controlar las claves de encriptación de servicios (Storage, BQ, Compute).",
        bestPractice: "Usa CMEK cuando la regulación exija control total sobre el ciclo de vida de la clave (creación, rotación, revocación). Ten cuidado: si revocas la clave, los datos son inaccesibles.",
        tags: ["encryption", "kms", "compliance"]
    },
    {
        id: 307,
        category: "Seguridad",
        title: "Cloud Asset Inventory",
        description: "Inventario en tiempo real de todos los recursos y políticas. Permite análisis de historial.",
        bestPractice: "Úsalo para responder: '¿Quién tenía acceso a este bucket el mes pasado?'. Exporta datos a BigQuery para análisis de seguridad y cumplimiento.",
        tags: ["asset", "compliance", "history"]
    },
    {
        id: 308,
        category: "Seguridad",
        title: "Security Command Center (SCC)",
        description: "Dashboard centralizado de seguridad y amenazas. Versión Premium ofrece detección de amenazas basada en eventos.",
        bestPractice: "Remedia hallazgos críticos (ej: bucket público abierto, minería de criptomonedas) integrando SCC con herramientas de ticketing o automatización.",
        tags: ["scc", "monitoring", "threats"]
    },

    // ==================================================================================
    // 4. CÓMPUTO MODERNO
    // ==================================================================================
    {
        id: 401,
        category: "Computo",
        title: "Compute Engine: Familias (N, E, T)",
        description: "Variedad de máquinas: E2 (costo-eficiente), N2 (propósito general), T2D (Tau - alto rendimiento scale-out), C2 (Compute-optimized).",
        bestPractice: "E2 para dev/test y webs ligeras. T2D para microservicios stateless que escalan mucho (mejor performance/precio). N2 para bases de datos.",
        tags: ["gce", "vm", "hardware"]
    },
    {
        id: 402,
        category: "Computo",
        title: "MIGs (Managed Instance Groups)",
        description: "Grupos de VMs idénticas con auto-scaling y auto-healing (reemplazo automático si falla el health check).",
        bestPractice: "Siempre usa MIGs para cargas stateless. Para Stateful (DBs), usa Stateful MIGs con precaución. Distribuye en múltiples zonas para HA.",
        tags: ["scaling", "ha", "reliability"]
    },
    {
        id: 403,
        category: "Computo",
        title: "Spot VMs",
        description: "VMs de exceso de capacidad con grandes descuentos (60-91%). Google puede reclamarlas en cualquier momento.",
        bestPractice: "Obligatorio para batch processing, renderizado y CI/CD workers. Gestiona la interrupción con scripts de apagado elegante. No usar para bases de datos.",
        tags: ["cost", "spot", "batch"]
    },
    {
        id: 404,
        category: "Computo",
        title: "GKE Standard vs Autopilot",
        description: "Standard: Gestionas nodos (VMs) y configuración. Autopilot: Google gestiona nodos, seguridad y escalado, pagas por Pod.",
        bestPractice: "Autopilot por defecto para reducir carga operativa y mejorar seguridad (hardening aplicado). Standard si necesitas GPUs especiales, kernels personalizados o tweaks de sistema operativo muy específicos.",
        tags: ["k8s", "containers", "managed"]
    },
    {
        id: 405,
        category: "Computo",
        title: "GKE Multi-cluster (Anthos/Fleet)",
        description: "Gestión unificada de múltiples clústeres. Fleet proporciona identidad y configuración consistente.",
        bestPractice: "Usa Multi-Cluster Ingress (MCI) para balanceo global entre clústeres. Anthos Config Management (ACM) para sincronizar políticas y manifiestos vía GitOps.",
        tags: ["anthos", "fleet", "hybrid"]
    },
    {
        id: 406,
        category: "Computo",
        title: "Cloud Run: Servicios vs Jobs",
        description: "Services: Web/API (request/response). Jobs: Tareas batch que inician, trabajan y terminan.",
        bestPractice: "Usa Services para APIs REST/gRPC. Usa Jobs para migraciones de DB, procesamiento de archivos diarios o scripts de mantenimiento.",
        tags: ["serverless", "containers", "batch"]
    },
    {
        id: 407,
        category: "Computo",
        title: "VMware Engine (GCVE)",
        description: "Stack completo de VMware (vSphere, vSan, NSX) corriendo nativamente en hardware de Google.",
        bestPractice: "La vía más rápida para migrar 'Lift & Shift' de data centers on-premise sin re-arquitecturar aplicaciones legacy. Conectividad L2/L3 transparente con VPC.",
        tags: ["vmware", "migration", "legacy"]
    },
    {
        id: 408,
        category: "Computo",
        title: "Batch Processing",
        description: "Cloud Batch es un servicio gestionado para programar, encolar y ejecutar trabajos por lotes.",
        bestPractice: "Reemplaza soluciones custom sobre GCE. Soporta Spot VMs nativamente para reducir costos en trabajos HPC, transcodificación o genómica.",
        tags: ["batch", "hpc", "scheduling"]
    },

    // ==================================================================================
    // 5. DESARROLLO Y DEVOPS
    // ==================================================================================
    {
        id: 501,
        category: "Desarrollo",
        title: "Cloud Build",
        description: "CI/CD serverless. Construye, testea y despliega contenedores y artefactos.",
        bestPractice: "Optimiza tiempos de build usando caché (Kaniko). Usa 'Private Pools' para acceder a recursos internos de la VPC de forma segura durante el build.",
        tags: ["cicd", "pipeline", "docker"]
    },
    {
        id: 502,
        category: "Desarrollo",
        title: "Cloud Deploy",
        description: "Servicio de Continuous Delivery (CD) para GKE, Cloud Run y Anthos. Gestiona promociones entre entornos.",
        bestPractice: "Define un pipeline de entrega claro (Dev -> Staging -> Prod) con aprobaciones manuales para Prod. Visualiza métricas de DORA (frecuencia de despliegue, tasa de fallos).",
        tags: ["cd", "release", "k8s"]
    },
    {
        id: 503,
        category: "Desarrollo",
        title: "Artifact Registry",
        description: "Repositorio universal de artefactos (Docker, Maven, NPM, Python, Apt/Yum).",
        bestPractice: "Usa repositorios remotos para cachear dependencias públicas (Docker Hub, PyPI) y protegerte contra caídas externas y ataques a la cadena de suministro.",
        tags: ["registry", "security", "supply-chain"]
    },
    {
        id: 504,
        category: "Desarrollo",
        title: "Cloud Functions (2nd Gen)",
        description: "FaaS basado en Eventarc y Cloud Run. Tiempos de ejecución hasta 60 min, mayor concurrencia.",
        bestPractice: "Ideal para arquitecturas 'Glue' (conectar servicios). No uses para orquestación compleja (usa Workflows o Composer).",
        tags: ["serverless", "faas", "event-driven"]
    },
    {
        id: 505,
        category: "Desarrollo",
        title: "Pub/Sub: Patrones",
        description: "Mensajería asíncrona global. Desacopla productores y consumidores.",
        bestPractice: "Patrón 'Fan-out': Un mensaje se envía a múltiples suscripciones para procesamientos distintos. Usa 'Dead Letter Queues' para manejar mensajes erróneos sin bloquear el pipeline.",
        tags: ["messaging", "async", "integration"]
    },
    {
        id: 506,
        category: "Desarrollo",
        title: "Eventarc",
        description: "Bus de eventos unificado para recibir eventos de Google (Audit Logs), fuentes personalizadas o 3rd party.",
        bestPractice: "Úsalo para disparar Cloud Run/Functions en respuesta a cambios de infraestructura (ej: 'Archivo subido a Storage', 'Nueva VM creada').",
        tags: ["events", "triggers", "automation"]
    },
    {
        id: 507,
        category: "Desarrollo",
        title: "Cloud Trace",
        description: "Tracing distribuido para detectar latencias en microservicios.",
        bestPractice: "Propaga el contexto de traza (trace context) en las cabeceras HTTP entre tus microservicios para ver la cascada completa de llamadas.",
        tags: ["observability", "apm", "latency"]
    },
    {
        id: 508,
        category: "Desarrollo",
        title: "Cloud Profiler & Debugger",
        description: "Profiler: Analiza uso de CPU/RAM en producción. Debugger: Snapshot de variables sin detener la app (Deprecado, usar Snapshot Debugger alternatives).",
        bestPractice: "Profiler es esencial para optimizar costos. Identifica funciones que consumen CPU innecesariamente ('hotspots') y optimízalas para reducir el tamaño de las instancias.",
        tags: ["performance", "debug", "optimization"]
    },

    // ==================================================================================
    // 6. BASES DE DATOS Y ALMACENAMIENTO
    // ==================================================================================
    {
        id: 601,
        category: "Bases de Datos",
        title: "Cloud Storage: Clases",
        description: "Standard (Hot), Nearline (30 días), Coldline (90 días), Archive (365 días).",
        bestPractice: "Usa Autoclass para que Google mueva objetos automáticamente según acceso. Archive es muy barato almacenamiento pero caro de leer: solo para cumplimiento legal/backups raros.",
        tags: ["storage", "object", "lifecycle"]
    },
    {
        id: 602,
        category: "Bases de Datos",
        title: "Cloud Storage: Features",
        description: "Versioning (protección contra borrado/sobreescritura), Lifecycle Policies (borrado/movimiento automático).",
        bestPractice: "Activa Versioning en buckets de estado de Terraform. Usa Lifecycle para borrar uploads temporales antiguos (ej: > 7 días) y reducir costos.",
        tags: ["storage", "management", "backup"]
    },
    {
        id: 603,
        category: "Bases de Datos",
        title: "Cloud SQL: HA & Replicas",
        description: "MySQL/PostgreSQL/SQL Server gestionado. HA es regional (failover automático). Read Replicas escalan lectura.",
        bestPractice: "HA es obligatorio para Prod. Usa Private IP para seguridad. Read Replicas NO sirven para HA (no hay failover automático a réplica), solo para descargar tráfico de lectura.",
        tags: ["sql", "rdbms", "ha"]
    },
    {
        id: 604,
        category: "Bases de Datos",
        title: "AlloyDB para PostgreSQL",
        description: "PostgreSQL compatible, 4x más rápido para transacciones, 100x para analítica. Almacenamiento desagregado inteligente.",
        bestPractice: "Úsalo para cargas PostgreSQL empresariales exigentes donde Cloud SQL se queda corto en rendimiento o escalabilidad. SLA de 99.99% incluso con mantenimiento.",
        tags: ["postgresql", "alloydb", "performance"]
    },
    {
        id: 605,
        category: "Bases de Datos",
        title: "Cloud Spanner",
        description: "Base de datos relacional GLOBAL con consistencia fuerte horizontal. Usa relojes atómicos (TrueTime).",
        bestPractice: "Para aplicaciones financieras, inventario global o juegos que requieren escala infinita Y consistencia ACID. Costo base alto, justifica solo para escala masiva o requisitos de consistencia global.",
        tags: ["newsql", "global", "acid"]
    },
    {
        id: 606,
        category: "Bases de Datos",
        title: "Cloud Bigtable",
        description: "Base de datos NoSQL Wide-column (HBase compatible). Baja latencia, alto throughput (IoT, FinTech, AdTech).",
        bestPractice: "El diseño de la 'Row Key' es crítico para evitar 'hotspotting'. Evita claves secuenciales (timestamps al inicio). Prefiere claves hash o distribuidas.",
        tags: ["nosql", "bigdata", "iot"]
    },
    {
        id: 607,
        category: "Bases de Datos",
        title: "Firestore",
        description: "NoSQL de documentos. Modo Datastore (Legacy) vs Modo Nativo (Moderno, real-time, offline sync).",
        bestPractice: "Backend por defecto para apps móviles/web. Potente para consultas flexibles y actualizaciones en tiempo real a clientes. Costo por lectura/escritura (cuidado con diseños de lectura excesiva).",
        tags: ["nosql", "mobile", "web"]
    },
    {
        id: 608,
        category: "Bases de Datos",
        title: "Memorystore",
        description: "Redis o Memcached gestionado. Caché en memoria para baja latencia.",
        bestPractice: "Coloca la caché en la misma región que tu cómputo. Usa nivel Standard (con réplica) para HA. Clave para reducir carga en Cloud SQL.",
        tags: ["cache", "redis", "performance"]
    },

    // ==================================================================================
    // 7. DATOS Y ANALYTICS
    // ==================================================================================
    {
        id: 701,
        category: "Analytics",
        title: "BigQuery: Arquitectura",
        description: "Data Warehouse Serverless. Separa cómputo (Slots) de almacenamiento (Colossus).",
        bestPractice: "Entiende el modelo de precios (On-demand vs Editions). Editions (Slots) ofrece costos predecibles para cargas constantes.",
        tags: ["dw", "sql", "bigdata"]
    },
    {
        id: 702,
        category: "Analytics",
        title: "BigQuery: Optimización",
        description: "Partitioning (dividir tabla por fecha/int) y Clustering (ordenar datos dentro de partición).",
        bestPractice: "SIEMPRE particiona tablas grandes (ej: por fecha de ingestión). Clusterea por campos de filtro frecuente (ej: customer_id). Esto reduce drásticamente los bytes escaneados ($$$).",
        tags: ["performance", "cost", "sql"]
    },
    {
        id: 703,
        category: "Analytics",
        title: "Dataflow: Stream vs Batch",
        description: "Apache Beam runner. Autoscaling horizontal y vertical (Prime). Garantía 'exactly-once'.",
        bestPractice: "La herramienta definitiva para ETL complejo. Prefiere Streaming si el negocio necesita latencia < minutos. Usa Dataflow Prime para manejar 'stragglers' y picos de memoria.",
        tags: ["etl", "stream", "apache-beam"]
    },
    {
        id: 704,
        category: "Analytics",
        title: "Dataproc",
        description: "Hadoop/Spark gestionado. Migración fácil de cargas on-premise.",
        bestPractice: "Usa clusters efímeros (crear, procesar, borrar) con datos en GCS (no en HDFS). Usa Dataproc Serverless para evitar gestionar clusters.",
        tags: ["spark", "hadoop", "migration"]
    },
    {
        id: 705,
        category: "Analytics",
        title: "Data Catalog & Dataplex",
        description: "Gobierno de datos. Catalog: Metadatos y búsqueda. Dataplex: Data Fabric, calidad y linaje.",
        bestPractice: "Usa Dataplex para gestionar lagos de datos distribuidos como si fueran uno solo. Implementa políticas de calidad automáticas para confiar en tus datos.",
        tags: ["governance", "metadata", "quality"]
    },
    {
        id: 706,
        category: "Analytics",
        title: "Cloud Composer",
        description: "Apache Airflow gestionado. Orquestación de workflows de datos.",
        bestPractice: "Composer V2 escala mejor y paga por uso. Úsalo para orquestar (disparar trabajos de BQ, Dataflow) pero NO para mover datos pesados dentro de los workers de Airflow.",
        tags: ["orchestration", "airflow", "workflow"]
    },
    {
        id: 707,
        category: "Analytics",
        title: "Vertex AI: Pipelines & MLOps",
        description: "Plataforma unificada de ML. Pipelines (Kubeflow) orquesta el entrenamiento y despliegue.",
        bestPractice: "Adopta MLOps. No entrenes modelos en notebooks locales manualmente. Versiona datos, código y modelos en Vertex Model Registry.",
        tags: ["ai", "ml", "mlops"]
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
                <span class="tag ${item.category.replace(/\s+/g, '')}">${item.category}</span>
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
