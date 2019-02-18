
import Koa = require("koa");
import { Context } from "koa";
import { Logger } from "pino";
import autobind from "autobind-decorator";

/**
 * Wrapper for the Koa application
 */
@autobind
export class KoaService {

  constructor(
    private readonly routes: Routes,
    private readonly koa: Koa,
    private readonly port: number,
    private readonly logger: Logger
  ) {}

  /**
   * Add the request handler and start the koa service
   */
  public start(): void {
    this.koa.use(this.errorHandler);
    this.koa.use(this.requestLogger);
    this.koa.use(this.handler);
    this.koa.listen(this.port);

    this.logger.info(`Started on ${this.port}`);
  }

  /**
   * Use the request path to delegate to a controller
   */
  private async handler(context: Context): Promise<void> {
    if (this.routes[context.request.path]) {
      context.body = this.routes[context.request.path](context.query);
    }
  }

  /**
   * Log the request info and response time
   */
  public async requestLogger(context: Context, next: any) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    this.logger.info(`${context.method} ${context.url} - ${ms}`);
    context.set("X-Response-Time", `${ms}ms`);
  }

  /**
   * Standard Koa error handling
   */
  private async errorHandler(context: Context, next: () => void): Promise<void> {
    try {
      await next();
    } catch (err) {
      context.status = err.status || 500;
      context.body = err.message;
      context.app.emit("error", err, context);
    }
  }

}

export type RequestParams = Record<string, string>;
export type RequestHandler = (query: RequestParams) => {};
export type Routes = Record<string, RequestHandler>;
