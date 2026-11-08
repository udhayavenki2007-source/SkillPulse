-- ===================================================
-- INTERVIEWIQ AI - SEED DATA
-- Default Roles, Domains, Skills & Initial Templates
-- ===================================================

USE interviewiq_db;

-- Standard Job Roles
INSERT INTO job_roles (title, category, description, required_skills) VALUES
('Java Developer', 'Backend', 'Core Java, Spring Boot, Microservices, Hibernate, REST APIs, MySQL', '["Java", "Spring Boot", "Hibernate", "REST APIs", "MySQL", "OOP", "Microservices", "Git"]'),
('Full Stack Developer', 'Engineering', 'End-to-end web architecture across React, Node.js, Express, databases and deployment', '["JavaScript", "React.js", "Node.js", "Express.js", "MySQL", "REST APIs", "Git", "Tailwind CSS"]'),
('Frontend Developer', 'Frontend', 'Modern client-side engineering with React, TypeScript, responsive layout, performance and state management', '["HTML5", "CSS3", "JavaScript", "React.js", "Tailwind CSS", "Redux/Context", "Performance", "Web APIs"]'),
('Backend Developer', 'Backend', 'High-throughput server-side services, data modeling, concurrency, caching, and API design', '["Node.js", "Express", "Python", "SQL", "Database Design", "Authentication", "Caching", "Security"]'),
('Python Developer', 'Backend', 'Python architecture, Django/FastAPI frameworks, ORM, data structures and asynchronous programming', '["Python", "FastAPI", "Django", "PostgreSQL", "Data Structures", "AsyncIO", "Unit Testing"]'),
('Data Analyst', 'Data', 'Data wrangling, SQL analytics, statistical analysis, dashboarding, business intelligence', '["SQL", "Python", "Pandas", "Tableau/PowerBI", "Statistics", "Data Cleaning", "Data Visualization"]'),
('Data Scientist', 'Data', 'Machine learning modeling, feature engineering, exploratory data analysis, experimental design', '["Python", "Scikit-Learn", "NumPy", "Pandas", "Machine Learning", "Statistics", "SQL"]'),
('Software Engineer', 'Engineering', 'Algorithms, system design, data structures, clean code, CI/CD, scalable software craftsmanship', '["Data Structures", "Algorithms", "System Design", "OOP", "Git", "Testing", "CI/CD"]'),
('UI/UX Designer', 'Design', 'User research, wireframing, high-fidelity UI design, prototyping, design systems, design thinking', '["Figma", "Wireframing", "User Research", "Prototyping", "Design Systems", "Usability Testing"]'),
('DevOps Engineer', 'Infrastructure', 'Infrastructure as Code, CI/CD pipelines, Docker, Kubernetes, cloud platforms, monitoring', '["Docker", "Kubernetes", "CI/CD", "AWS/Cloud", "Linux", "Terraform", "Monitoring"]'),
('Cloud Engineer', 'Infrastructure', 'Cloud architecture, IAM, serverless computing, storage, networking, security policies', '["AWS", "Azure", "Cloud Architecture", "Networking", "IAM", "Serverless", "Terraform"]')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Domain Tracks
INSERT INTO domain_tracks (id, name, slug, description, icon) VALUES
(1, 'Full Stack Development', 'full-stack-dev', 'Master modern web applications from frontend interfaces to backend systems and databases.', 'Layers'),
(2, 'Java Backend Development', 'java-backend-dev', 'Enterprise server engineering with Spring Boot, Java concurrency, ORM and distributed microservices.', 'Server'),
(3, 'Frontend Development', 'frontend-dev', 'Craft immersive, responsive, accessible web interfaces and state architectures.', 'Layout'),
(4, 'Python Development', 'python-dev', 'Modern Python engineering for APIs, automation, data backends, and async systems.', 'Code'),
(5, 'Data Analytics', 'data-analytics', 'Transform raw enterprise datasets into actionable business intelligence and dashboards.', 'BarChart3'),
(6, 'Data Science', 'data-science', 'Statistical modeling, predictive machine learning, deep learning, and data pipelines.', 'Brain'),
(7, 'AI / ML Engineering', 'aiml-engineering', 'Design and deploy modern LLMs, neural networks, vector databases, and AI pipelines.', 'Cpu'),
(8, 'Cloud Computing', 'cloud-computing', 'Architect resilient cloud infrastructure on AWS/GCP with automated CI/CD and containers.', 'Cloud'),
(9, 'Cybersecurity', 'cybersecurity', 'Defend systems, web applications, and network topologies against vulnerabilities.', 'Shield')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Domain Skills for Full Stack Development
INSERT INTO domain_skills (domain_id, skill_name, category, importance, description, estimated_hours) VALUES
-- Frontend
(1, 'HTML5 & Semantic Markup', 'Frontend', 'Essential', 'Accessible and semantic structure, forms, SEO metadata, DOM hierarchy.', 15),
(1, 'CSS3 & Responsive Design', 'Frontend', 'Essential', 'Flexbox, Grid, Media Queries, Tailwind CSS, fluid typography.', 25),
(1, 'JavaScript ES6+', 'Frontend', 'Essential', 'Promises, Async/Await, closures, event loop, array transformations.', 40),
(1, 'React.js & Hooks', 'Frontend', 'Essential', 'Component lifecycle, useState, useEffect, custom hooks, context API.', 50),
(1, 'State Management', 'Frontend', 'Recommended', 'Redux Toolkit, Zustand, global cache management with React Query.', 25),

-- Backend
(1, 'Node.js & Event Loop', 'Backend', 'Essential', 'Asynchronous I/O, event emitters, streams, buffer management.', 30),
(1, 'Express.js Framework', 'Backend', 'Essential', 'Routing, middleware chains, error handlers, RESTful API principles.', 30),
(1, 'RESTful API Architecture', 'Backend', 'Essential', 'HTTP methods, status codes, payload formatting, idempotency.', 20),
(1, 'Authentication & Security', 'Backend', 'Essential', 'JWT tokens, bcrypt hashing, CORS, rate limiting, helmet.', 25),

-- Database
(1, 'SQL & Relational Modeling', 'Database', 'Essential', 'Schema design, normalization 3NF, keys, joins, subqueries, grouping.', 35),
(1, 'MySQL Engine & Transactions', 'Database', 'Essential', 'ACID guarantees, indexing strategies, query execution plans.', 30),
(1, 'NoSQL Basics (MongoDB)', 'Database', 'Recommended', 'Document schemas, aggregations, indexing, BSON structures.', 20),

-- Tools
(1, 'Git & GitHub Workflows', 'Tools', 'Essential', 'Branching, merging, rebasing, pull requests, resolving conflicts.', 20),
(1, 'Postman & API Testing', 'Tools', 'Essential', 'Mocking, environment variables, automated collection test scripts.', 15),
(1, 'Docker & Containerization', 'Tools', 'Recommended', 'Dockerfiles, compose files, multi-stage builds, volumes.', 25),

-- Core Skills
(1, 'Data Structures & Algorithms', 'Core Skills', 'Essential', 'Arrays, hash maps, linked lists, trees, search/sort, Big-O.', 60),
(1, 'Object-Oriented & Functional Paradigms', 'Core Skills', 'Essential', 'Encapsulation, abstraction, immutability, pure functions.', 25),
(1, 'System Design Fundamentals', 'Core Skills', 'Recommended', 'Scalability, load balancing, caching, vertical vs horizontal scaling.', 35),

-- Projects
(1, 'Beginner: Personal Portfolio & Blog', 'Projects', 'Essential', 'Interactive responsive portfolio featuring dynamic project showcases.', 20),
(1, 'Intermediate: E-Commerce Storefront', 'Projects', 'Essential', 'Product catalog, shopping cart, mock checkout, JWT authentication.', 45),
(1, 'Advanced: Full-Stack SaaS Platform', 'Projects', 'Essential', 'Enterprise multi-tenant platform with analytics, payments and dashboards.', 70);

-- Domain Skills for Java Backend Development
INSERT INTO domain_skills (domain_id, skill_name, category, importance, description, estimated_hours) VALUES
(2, 'Core Java & OOP Fundamentals', 'Backend', 'Essential', 'Inheritance, Polymorphism, Encapsulation, Abstract classes and Interfaces.', 45),
(2, 'Java Collections Framework', 'Backend', 'Essential', 'List, Set, Map hierarchies, ArrayList vs LinkedList, HashMap internals.', 35),
(2, 'Exception Handling & Best Practices', 'Backend', 'Essential', 'Checked vs unchecked exceptions, custom exception hierarchies, try-with-resources.', 20),
(2, 'Multithreading & Concurrency', 'Backend', 'Essential', 'Thread lifecycle, synchronization, volatile, Executors, CompletableFuture.', 40),
(2, 'Java 8+ Features (Streams & Lambdas)', 'Backend', 'Essential', 'Stream API, Functional interfaces, Optional, Collectors, method references.', 30),
(2, 'Spring Framework & Spring Boot', 'Backend', 'Essential', 'Dependency injection, IoC container, Autowiring, Actuator, Profiles.', 50),
(2, 'Hibernate & Spring Data JPA', 'Database', 'Essential', 'Entity mappings, OneToMany, ManyToMany, Lazy vs Eager, JPQL, Transactions.', 40),
(2, 'Microservices Architecture', 'Core Skills', 'Recommended', 'Service discovery, API gateway, circuit breaker pattern, distributed tracing.', 45),
(2, 'Maven & Gradle Build Systems', 'Tools', 'Essential', 'Dependency management, plugins, lifecycle phases, multi-module builds.', 20),
(2, 'Unit & Integration Testing (JUnit 5, Mockito)', 'Tools', 'Essential', 'Test-driven concepts, mocking beans, verifying interactions, assertions.', 30);
