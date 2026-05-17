-- CreateTable
CREATE TABLE `CLIENTE` (
    `rut_cliente` VARCHAR(12) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,

    PRIMARY KEY (`rut_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TATUADOR` (
    `id_tatuador` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `nombre_artistico` VARCHAR(100) NOT NULL,
    `especialidad` VARCHAR(100) NOT NULL,
    `portafolio_web` VARCHAR(200) NOT NULL,
    `disponibilidad` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_tatuador`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DISENO` (
    `id_diseno` VARCHAR(20) NOT NULL,
    `boceto` VARCHAR(200) NOT NULL,
    `comentarios` VARCHAR(400) NOT NULL,
    `autor` VARCHAR(100) NOT NULL,
    `derechos_uso` VARCHAR(400) NOT NULL,
    `fecha_creacion` DATE NOT NULL,
    `disponible` BOOLEAN NOT NULL,

    PRIMARY KEY (`id_diseno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CITA` (
    `id_cita` VARCHAR(20) NOT NULL,
    `fecha` DATE NOT NULL,
    `hora` TIME NOT NULL,
    `estado` VARCHAR(30) NOT NULL,
    `fecha_creacion` DATE NOT NULL,
    `usuario_creador` VARCHAR(50) NOT NULL,
    `rut_cliente` VARCHAR(12) NOT NULL,
    `id_tatuador` VARCHAR(20) NOT NULL,
    `id_diseno` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id_cita`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PAGO` (
    `id_pago` VARCHAR(20) NOT NULL,
    `monto` DECIMAL(12, 2) NOT NULL,
    `metodo_pago` VARCHAR(50) NOT NULL,
    `estado` VARCHAR(30) NOT NULL,
    `fecha` DATE NOT NULL,
    `id_cita` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id_pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PROCEDIMIENTO` (
    `id_procedimiento` VARCHAR(20) NOT NULL,
    `area_corporal` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(400) NOT NULL,
    `fecha_ejecucion` DATE NOT NULL,
    `fecha_creacion` DATE NOT NULL,
    `usuario_creador` VARCHAR(50) NOT NULL,
    `completado` BOOLEAN NOT NULL,
    `id_cita` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id_procedimiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `INSUMO` (
    `id_insumo` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `tipo` VARCHAR(100) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `fecha_ingreso` DATE NOT NULL,
    `fecha_vencimiento` DATE NULL,
    `responsable_uso` VARCHAR(100) NOT NULL,
    `perecible` BOOLEAN NOT NULL,

    PRIMARY KEY (`id_insumo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PROCEDIMIENTO_INSUMO` (
    `id_procedimiento` VARCHAR(20) NOT NULL,
    `id_insumo` VARCHAR(20) NOT NULL,
    `cantidad_utilizada` INTEGER NOT NULL,

    PRIMARY KEY (`id_procedimiento`, `id_insumo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CITA` ADD CONSTRAINT `CITA_rut_cliente_fkey` FOREIGN KEY (`rut_cliente`) REFERENCES `CLIENTE`(`rut_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CITA` ADD CONSTRAINT `CITA_id_tatuador_fkey` FOREIGN KEY (`id_tatuador`) REFERENCES `TATUADOR`(`id_tatuador`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CITA` ADD CONSTRAINT `CITA_id_diseno_fkey` FOREIGN KEY (`id_diseno`) REFERENCES `DISENO`(`id_diseno`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PAGO` ADD CONSTRAINT `PAGO_id_cita_fkey` FOREIGN KEY (`id_cita`) REFERENCES `CITA`(`id_cita`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PROCEDIMIENTO` ADD CONSTRAINT `PROCEDIMIENTO_id_cita_fkey` FOREIGN KEY (`id_cita`) REFERENCES `CITA`(`id_cita`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PROCEDIMIENTO_INSUMO` ADD CONSTRAINT `PROCEDIMIENTO_INSUMO_id_procedimiento_fkey` FOREIGN KEY (`id_procedimiento`) REFERENCES `PROCEDIMIENTO`(`id_procedimiento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PROCEDIMIENTO_INSUMO` ADD CONSTRAINT `PROCEDIMIENTO_INSUMO_id_insumo_fkey` FOREIGN KEY (`id_insumo`) REFERENCES `INSUMO`(`id_insumo`) ON DELETE RESTRICT ON UPDATE CASCADE;
