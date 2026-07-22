IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'admision')
BEGIN
    CREATE DATABASE admision;
END
GO

USE admision;
GO

-- Limpieza previa para poder reejecutar el script en desarrollo
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
    total NUMERIC(18,2) NOT NULL,
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

-- Datos semilla
INSERT INTO conceptos (codigo, descripcion, tipo, valor) VALUES
('OCUVP', 'Ocupación de vía pública', 'tasa', 1500.0000),
('ESPECT', 'Espectáculos públicos', 'tasa', 5000.0000),
('PUBLIP', 'Publicidad y propaganda', 'tasa', 2500.0000),
('FERIA', 'Ferias y eventos', 'tasa', 3000.0000),
('REC30', 'Recargo por pago fuera de término 30%', 'recargo', 30.0000),
('EXEMP', 'Exención por evento municipal', 'exencion', -1000.0000);
GO

-- Usuario admin de prueba: admin / Admin1234!
INSERT INTO usuarios (username, password_hash, nombre) VALUES
('admin', '$2b$10$MBWHdXoODNKBQwMp8S71sO.aghAnbE9fZQTgJw9hf8XPwzc.Ga6KC', 'Administrador');
GO
