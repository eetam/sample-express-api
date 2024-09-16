import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpMethod,
} from "inversify-express-utils";
import { CommonService } from "./common.service";
import { NotFoundException } from "../config/exception.config";

@controller("/")
export class CommonController extends BaseHttpController {
  constructor(
    @inject(CommonService) private readonly commonService: CommonService
  ) {
    super();
  }

  @httpGet("/")
  public sayHello(): { message: string } {
    return this.commonService.sayHello();
  }

  @httpMethod("all", "*")
  public getNotFound(): string {
    throw new NotFoundException("Endpoint not found");
  }
}
