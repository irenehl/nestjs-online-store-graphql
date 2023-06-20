import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { AwsModule } from './aws/aws.module';
import { CategoryModule } from './category/category.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        AwsModule,
        ProductModule,
        CartModule,
        OrderModule,
        CategoryModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
