IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TasasEventualesDB')
BEGIN
    CREATE DATABASE TasasEventualesDB;
END
GO

USE TasasEventualesDB;
GO

DROP TABLE IF EXISTS liquidaciones_detalles;
DROP TABLE IF EXISTS liquidaciones;
DROP TABLE IF EXISTS conceptos;
DROP TABLE IF EXISTS contribuyentes;
DROP TABLE IF EXISTS usuarios;
GO

CREATE TABLE contribuyentes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cuit VARCHAR(20) NOT NULL UNIQUE,
    apellido VARCHAR(150) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    domicilio VARCHAR(200),
    activo BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE conceptos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(150) NOT NULL,
    tipo VARCHAR(20) NOT NULL
        CHECK (tipo IN ('tasa','recargo','exencion')),
    es_porcentaje BIT NOT NULL DEFAULT 0,
    valor NUMERIC(12,4) NOT NULL,
    activo BIT NOT NULL DEFAULT 1
);
GO

CREATE TABLE liquidaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    contribuyente_id INT NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    fecha_evento DATE NOT NULL,
    fecha_emision DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    fecha_vencimiento DATE NOT NULL,
    total NUMERIC(18,2) NOT NULL DEFAULT 0,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente','pagada','vencida','anulada')),
    CONSTRAINT FK_liquidaciones_contribuyentes
        FOREIGN KEY (contribuyente_id)
        REFERENCES contribuyentes(id)
);
GO

CREATE TABLE liquidaciones_detalles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    liquidacion_id INT NOT NULL,
    concepto_id INT NOT NULL,
    cantidad NUMERIC(10,2) NOT NULL DEFAULT 1,
    base_imponible NUMERIC(12,2) NULL,
    monto NUMERIC(12,2) NOT NULL,
    CONSTRAINT FK_liqdet_liquidaciones
        FOREIGN KEY (liquidacion_id)
        REFERENCES liquidaciones(id)
        ON DELETE CASCADE,
    CONSTRAINT FK_liqdet_conceptos
        FOREIGN KEY (concepto_id)
        REFERENCES conceptos(id)
);
GO

CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    activo BIT NOT NULL DEFAULT 1
);
GO

-- CONTRIBUYENTES
INSERT INTO contribuyentes (cuit, apellido, nombre, domicilio, activo)
VALUES
('20-12345678-9', 'Gonzalez', 'Juan', 'Av. San Martin 123', 1),
('27-23456789-0', 'Perez', 'Maria', 'Urquiza 456', 1),
('23-34567890-1', 'Rodriguez', 'Carlos', 'Belgrano 789', 1),
('24-45678901-2', 'Lopez', 'Ana', 'Mitre 321', 1),
('30-56789012-3', 'Fernandez', 'Luis', 'Sarmiento 654', 1);
GO

-- CONCEPTOS
INSERT INTO conceptos (codigo, descripcion, tipo, es_porcentaje, valor, activo)
VALUES
('TSH', 'Tasa de Seguridad e Higiene', 'tasa', 0, 2500.0000, 1),
('PUB', 'Derecho de Publicidad y Propaganda', 'tasa', 0, 1800.0000, 1),
('REC10', 'Recargo por mora 10%', 'recargo', 1, 10.0000, 1),
('EXMIPY', 'Exencion MiPyME 100%', 'exencion', 1, 100.0000, 1),
('OCUP', 'Ocupacion de Espacio Publico', 'tasa', 0, 3200.0000, 1);
GO

-- LIQUIDACIONES
INSERT INTO liquidaciones
(contribuyente_id, tipo_evento, fecha_evento, fecha_emision, fecha_vencimiento, total, estado)
VALUES
(1, 'Habilitacion comercial', '2026-07-01', '2026-07-02', '2026-07-15', 4300.00, 'pendiente'),
(2, 'Renovacion anual', '2026-07-03', '2026-07-03', '2026-07-18', 0.00, 'pagada'),
(3, 'Instalacion de cartel publicitario', '2026-07-05', '2026-07-06', '2026-07-20', 1980.00, 'vencida'),
(4, 'Permiso de ocupacion de vereda', '2026-07-08', '2026-07-08', '2026-07-25', 8900.00, 'pendiente'),
(5, 'Reinscripcion comercial', '2026-07-10', '2026-07-11', '2026-07-28', 2750.00, 'anulada');
GO

-- DETALLES DE LIQUIDACIONES
INSERT INTO liquidaciones_detalles (liquidacion_id, concepto_id, cantidad, base_imponible, monto)
VALUES
(1, 1, 1, NULL, 2500.00),
(1, 2, 1, NULL, 1800.00),
(2, 1, 1, NULL, 2500.00),
(2, 4, 1, 2500.00, -2500.00),
(3, 2, 1, NULL, 1800.00),
(3, 3, 1, 1800.00, 180.00),
(4, 5, 2, NULL, 6400.00),
(4, 1, 1, NULL, 2500.00),
(5, 1, 1, NULL, 2500.00),
(5, 3, 1, 2500.00, 250.00);
GO

-- USUARIO ADMIN: admin / Admin1234!
INSERT INTO usuarios (username, password_hash, nombre)
VALUES ('admin', '$2b$10$L8zZw1tmkqiLoAyc9gpbvOqkfV5agvyJUNLt13ZRuAHGnmZyDIBD2', 'Administrador');
GO
