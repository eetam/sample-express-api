import { injectable } from "inversify";

@injectable()
export class CommonService {
  public sayHello(): { message: string } {
    return {
      message: "Hello World!",
    };
  }
}
