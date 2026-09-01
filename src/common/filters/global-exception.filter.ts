import { Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';
import { QueryFailedError } from 'typeorm';
import { GraphQLError } from 'graphql';

@Catch()
export class GlobalExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger('ErrorHandler');

  catch(exception: any, host: ArgumentsHost) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;
      message = response.message || exception.message;
    } else if (exception instanceof QueryFailedError) {
      // التعامل مع أخطاء الداتابيز (مثل مفتاح أجنبي غير موجود)
      status = HttpStatus.BAD_REQUEST;
      message = `Database Error: ${(exception as any).detail || exception.message}`;
    } else {
      message = exception?.message || 'Unknown error';
    }

    // تنظيف الرسالة إذا كانت مصفوفة (Array)
    const finalMessage = Array.isArray(message) ? message.join(', ') : message;

    // 🎨 طباعة الخطأ في التيرمنال بسطر واحد أنيق وبدون Stack Trace المزعج
    if (status >= 500) {
      this.logger.error(`🚨 [${status}] ${finalMessage}`, ''); 
    } else {
      this.logger.error(`⚠️ [${status}] ${finalMessage}`, '');
    }

    // إذا كان الطلب قادم من GraphQL
    if (host.getType<GqlContextType>() === 'graphql') {
      if (exception instanceof QueryFailedError) {
        return new GraphQLError(finalMessage, {
          extensions: {
            code: 'BAD_REQUEST',
            statusCode: status,
          },
        });
      }
      return exception;
    }

    // إذا كان الطلب REST API عادياً
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    return response.status(status).json({
      statusCode: status,
      message: finalMessage,
      errorType: status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST',
    });
  }
}
