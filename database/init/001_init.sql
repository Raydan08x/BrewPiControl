-- Script de inicialización de la base de datos BrewPi
-- Crea tablas principales para lotes, eventos y parámetros críticos

CREATE TABLE IF NOT EXISTS lotes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL DEFAULT NOW(),
    receta VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS eventos (
    id SERIAL PRIMARY KEY,
    lote_id INT REFERENCES lotes(id),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS parametros (
    id SERIAL PRIMARY KEY,
    lote_id INT REFERENCES lotes(id),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    nombre VARCHAR(50) NOT NULL,
    valor FLOAT NOT NULL,
    unidad VARCHAR(10) NOT NULL
);
