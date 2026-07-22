import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Usuario } from './usuarios/entities/usuario.entity';
import { Contribuyente } from './contribuyentes/entities/contribuyente.entity';
import { Concepto } from './conceptos/entities/concepto.entity';
import { Liquidacion } from './liquidaciones/entities/liquidacion.entity';
import { LiquidacionDetalle } from './liquidaciones/entities/liquidacion-detalle.entity';
import { Pago } from './pagos/entities/pago.entity';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ContribuyentesModule } from './contribuyentes/contribuyentes.module';
import { ConceptosModule } from './conceptos/conceptos.module';
import { LiquidacionesModule } from './liquidaciones/liquidaciones.module';
import { PagosModule } from './pagos/pagos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '1433', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Usuario, Contribuyente, Concepto, Liquidacion, LiquidacionDetalle, Pago],
      synchronize: false,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }),
    AuthModule,
    UsuariosModule,
    ContribuyentesModule,
    ConceptosModule,
    LiquidacionesModule,
    PagosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
