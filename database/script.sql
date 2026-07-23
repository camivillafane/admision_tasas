CREATE TABLE contribuyentes (
 id INT IDENTITY(1,1) PRIMARY KEY,
 cuit VARCHAR(20) NOT NULL UNIQUE,
 apellido VARCHAR(150) NOT NULL,
 nombre VARCHAR(150) NOT NULL,
 domicilio VARCHAR(200),
 activo BIT NOT NULL DEFAULT 1
);
CREATE TABLE conceptos (
 id INT IDENTITY(1,1) PRIMARY KEY,
 codigo VARCHAR(20) NOT NULL UNIQUE,
 descripcion VARCHAR(150) NOT NULL,
 tipo VARCHAR(20) NOT NULL
 CHECK (tipo IN ('tasa','recargo','exencion')),
 valor NUMERIC(12,4) NOT NULL, -- monto fijo, valor por unidad o %
 activo BIT NOT NULL DEFAULT 1
);
CREATE TABLE liquidaciones (
 id INT IDENTITY(1,1) PRIMARY KEY,
 contribuyente_id INT NOT NULL,
 tipo_evento VARCHAR(100) NOT NULL, -- descripción del hecho imponible
 fecha_evento DATE NOT NULL,
 fecha_emision DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
 fecha_vencimiento DATE NOT NULL,
 total NUMERIC(18,2) NOT NULL,
 estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
 CHECK (estado IN ('pendiente','pagada','vencida','anulada')),
 CONSTRAINT FK_liquidaciones_contribuyentes
 FOREIGN KEY (contribuyente_id)
 REFERENCES contribuyentes(id)
);
CREATE TABLE liquidaciones_detalles (
 id INT IDENTITY(1,1) PRIMARY KEY,
 liquidacion_id INT NOT NULL,
 concepto_id INT NOT NULL,
 cantidad NUMERIC(10,2) NOT NULL DEFAULT 1, -- m2, días, unidades
 monto NUMERIC(12,2) NOT NULL, -- monto ya calculado para ese concepto
 CONSTRAINT FK_liqdet_liquidaciones
 FOREIGN KEY (liquidacion_id)
 REFERENCES liquidaciones(id)
 ON DELETE CASCADE,
 CONSTRAINT FK_liqdet_conceptos
 FOREIGN KEY (concepto_id)
 REFERENCES conceptos(id)
);

CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    activo BIT NOT NULL DEFAULT 1
);

-- =========================
-- CONTRIBUYENTES
-- =========================
INSERT INTO contribuyentes (cuit, apellido, nombre, domicilio, activo)
VALUES
('20-12345678-9', 'González', 'Juan', 'Av. San Martín 123', 1),
('27-23456789-0', 'Pérez', 'María', 'Urquiza 456', 1),
('23-34567890-1', 'Rodríguez', 'Carlos', 'Belgrano 789', 1),
('24-45678901-2', 'López', 'Ana', 'Mitre 321', 1),
('30-56789012-3', 'Fernández', 'Luis', 'Sarmiento 654', 1);
-- =========================
-- CONCEPTOS
-- =========================
INSERT INTO conceptos (codigo, descripcion, tipo, valor, activo)
VALUES
('TSH', 'Tasa de Seguridad e Higiene', 'tasa', 2500.00, 1),
('PUB', 'Derecho de Publicidad y Propaganda', 'tasa', 1800.00, 1),
('REC10', 'Recargo por mora 10%', 'recargo', 10.00, 1),
('EXMIPY', 'Exención MiPyME', 'exencion', 100.00, 1),
('OCUP', 'Ocupación de Espacio Público', 'tasa', 3200.00, 1);
-- =========================
-- LIQUIDACIONES
-- =========================
INSERT INTO liquidaciones
(contribuyente_id, tipo_evento, fecha_evento, fecha_emision, fecha_vencimiento,
estado)
VALUES
(1, 'Habilitación comercial', '2026-07-01', '2026-07-02', '2026-07-15', 'pendiente'),
(2, 'Renovación anual', '2026-07-03', '2026-07-03', '2026-07-18', 'pagada'),
(3, 'Instalación de cartel publicitario', '2026-07-05', '2026-07-06', '2026-07-20',
'vencida'),
(4, 'Permiso de ocupación de vereda', '2026-07-08', '2026-07-08', '2026-07-25', 'pendiente'),
(5, 'Reinscripción comercial', '2026-07-10', '2026-07-11', '2026-07-28', 'anulada');
-- =========================
-- DETALLES DE LIQUIDACIONES
-- =========================
INSERT INTO liquidaciones_detalles (liquidacion_id, concepto_id, cantidad, monto)
VALUES
-- Liquidación 1
(1, 1, 1, 2500.00),
(1, 2, 1, 1800.00),
-- Liquidación 2
(2, 1, 1, 2500.00),
(2, 4, 1, -2500.00),
-- Liquidación 3
(3, 2, 1, 1800.00),
(3, 3, 1, 180.00),
-- Liquidación 4
(4, 5, 2, 6400.00),
(4, 1, 1, 2500.00),
-- Liquidación 5
(5, 1, 1, 2500.00),
(5, 3, 1, 250.00);

-- =========================
-- USUARIO ADMIN: admin / Admin1234!
-- =========================
INSERT INTO usuarios (username, password_hash, nombre)
VALUES ('admin', '$2b$10$L8zZw1tmkqiLoAyc9gpbvOqkfV5agvyJUNLt13ZRuAHGnmZyDIBD2', 'Administrador');
GO
