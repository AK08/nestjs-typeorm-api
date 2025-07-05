import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  // getTracker method tells nest how to identy the user or client making the request.
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body?.email || 'anonymous';
    // here we are creating a unique key based on email (eg : login-alen@gmail.com) and returning it.
    // this allows rate limiting per user/email but not per device.
    return `login-${email}`;
    // use below code if you want to block via ip address.
    // const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    // return `login-ip-${ip}`;
  }

  // Nest checks internal storage if the key has crossed the limit that is set.
  // if yes, it will call the below function.
  protected async throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(
      `Too many attempts. Please try again after 1 minute.`,
    );
  }
}
