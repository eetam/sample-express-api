import { Container } from "inversify";

import "../common/common.controller";
import "../products/products.controller";
import "../orders/orders.controller";
import { AddProductHandler } from "../products/services/command/handlers/add-product.handler";
import { GetProductsHandler } from "../products/services/query/handlers/get-products.handler";
import { RestockProductHandler } from "../products/services/command/handlers/restock-product.handler";
import { SellProductHandler } from "../products/services/command/handlers/sell-product.handler";
import { ProductModel } from "../products/models/product";
import { OrderModel } from "../orders/models/order";
import { CommandMediator } from "../cqrs-common/command.mediator";
import { QueryMediator } from "../cqrs-common/query.mediator";
import { AddOrderHandler } from "../orders/services/command/handlers/add-order.handler";

export const container = new Container({ autoBindInjectable: true });
container.bind(Container).toConstantValue(container);

container.bind(ProductModel).toConstantValue(ProductModel.getModel());
container.bind(OrderModel).toConstantValue(OrderModel.getModel());

container.bind(CommandMediator).toSelf().inSingletonScope();
container.bind(QueryMediator).toSelf().inSingletonScope();

const commandMediator = container.get(CommandMediator);
commandMediator.registerHandler("AddProductCommand", AddProductHandler);
commandMediator.registerHandler("RestockProductCommand", RestockProductHandler);
commandMediator.registerHandler("SellProductCommand", SellProductHandler);

commandMediator.registerHandler("AddOrderCommand", AddOrderHandler);

const queryMediator = container.get(QueryMediator);
queryMediator.registerHandler("GetProductsQuery", GetProductsHandler);
