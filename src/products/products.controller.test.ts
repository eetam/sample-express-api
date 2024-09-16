import { Container } from "inversify";
import request from "supertest";
import { InversifyExpressServer } from "inversify-express-utils";
import { CommandMediator } from "../cqrs-common/command.mediator";
import { QueryMediator } from "../cqrs-common/query.mediator";
import { GetProductsQuery } from "./services/query/get-products.query";
import { CreateProductDto } from "./dtos/create-product-dto";
import { AddProductCommand } from "./services/command/add-product.command";
import { RestockProductDto } from "./dtos/restock-product-dto";
import { RestockProductCommand } from "./services/command/restock-product.command";
import {
  InsufficientStockException,
  ProductNotFoundException,
} from "./services/exceptions";
import { SellProductDto } from "./dtos/sell-product-dto";
import { SellProductCommand } from "./services/command/sell-product.command";
import { CreateProductResponseDto } from "./dtos/create-product-response.dto copy";
import { RestockProductResponseDto } from "./dtos/restock-product-response.dto";
import { SellProductResponseDto } from "./dtos/sell-product-response.dto";
import { GetAllProductResponsesDto } from "./dtos/get-all-products-response.dto";
import { serverErrorConfig } from "../config/server.config";
import { json, urlencoded } from "body-parser";
import "./products.controller";

const testMongoId = "66e43a4c85f4f8e78d33fded";

describe("ProductsController", () => {
  let server: any;
  let container: Container;
  let commandMediatorMock: any;
  let queryMediatorMock: any;

  beforeAll(() => {
    commandMediatorMock = {
      execute: jest.fn(),
    };
    queryMediatorMock = {
      execute: jest.fn(),
    };

    container = new Container({ autoBindInjectable: true });

    container.bind(CommandMediator).toConstantValue(commandMediatorMock);
    container.bind(QueryMediator).toConstantValue(queryMediatorMock);

    const inversifyServer = new InversifyExpressServer(container);
    inversifyServer.setConfig((app) => {
      app.use(
        urlencoded({
          extended: true,
        })
      );
      app.use(json());
    });
    inversifyServer.setErrorConfig(serverErrorConfig);
    server = inversifyServer.build();
  });

  describe("GET /products", () => {
    it("should return all products", async () => {
      // given
      const products: GetAllProductResponsesDto = {
        products: [
          {
            id: testMongoId,
            name: "Product 1",
            description: "Description 1",
            stock: 10,
            price: 100,
          },
        ],
      };
      queryMediatorMock.execute.mockResolvedValue(products);

      // when
      const response = await request(server).get("/products");

      // then
      expect(response.status).toBe(200);
      expect(response.body).toEqual(products);
      expect(queryMediatorMock.execute).toHaveBeenCalledWith(
        new GetProductsQuery()
      );
    });
  });

  describe("POST /products", () => {
    it("should create a product", async () => {
      // given
      const createProductDto: CreateProductDto = {
        name: "Product 1",
        description: "Description 1",
        stock: 10,
        price: 100,
      };
      const createdProduct: CreateProductResponseDto = {
        id: testMongoId,
        ...createProductDto,
      };
      commandMediatorMock.execute.mockResolvedValue(createdProduct);

      // when
      const response = await request(server)
        .post("/products")
        .send(createProductDto);

      // then
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdProduct);
      expect(commandMediatorMock.execute).toHaveBeenCalledWith(
        new AddProductCommand(
          createProductDto.name,
          createProductDto.description,
          createProductDto.stock,
          createProductDto.price
        )
      );
    });
  });

  describe("POST /products/:id/restock", () => {
    it("should restock a product", async () => {
      // given
      const restockProductDto: RestockProductDto = { additionalStock: 5 };
      const restockedProduct: RestockProductResponseDto = {
        newStockLevel: 15,
      };
      commandMediatorMock.execute.mockResolvedValue(restockedProduct);

      // when
      const response = await request(server)
        .post(`/products/${testMongoId}/restock`)
        .send(restockProductDto);

      // then
      expect(response.status).toBe(200);
      expect(response.body).toEqual(restockedProduct);
      expect(commandMediatorMock.execute).toHaveBeenCalledWith(
        new RestockProductCommand(
          testMongoId,
          restockProductDto.additionalStock
        )
      );
    });

    it("should return 404 if product not found", async () => {
      // given
      commandMediatorMock.execute.mockRejectedValue(
        new ProductNotFoundException("Product not found")
      );

      // when
      const response = await request(server)
        .post(`/products/${testMongoId}/restock`)
        .send({ additionalStock: 5 });

      // then
      expect(response.status).toBe(404);
      expect(response.body["errorMessage"]).toEqual("Product not found");
      expect(response.body["type"]).toBe("Not found");
    });
  });

  describe("POST /products/:id/sell", () => {
    it("should sell a product", async () => {
      // given
      const sellProductDto: SellProductDto = { quantity: 2 };
      const soldProduct: SellProductResponseDto = { quantityLeft: 8 };
      commandMediatorMock.execute.mockResolvedValue(soldProduct);

      // when
      const response = await request(server)
        .post(`/products/${testMongoId}/sell`)
        .send(sellProductDto);

      // then
      expect(response.status).toBe(200);
      expect(response.body).toEqual(soldProduct);
      expect(commandMediatorMock.execute).toHaveBeenCalledWith(
        new SellProductCommand(testMongoId, sellProductDto.quantity)
      );
    });

    it("should return 404 if product not found", async () => {
      // given
      commandMediatorMock.execute.mockRejectedValue(
        new ProductNotFoundException("Product not found")
      );

      // when
      const response = await request(server)
        .post(`/products/${testMongoId}/sell`)
        .send({ quantity: 2 });

      // then
      expect(response.status).toBe(404);
      expect(response.body["errorMessage"]).toEqual("Product not found");
      expect(response.body["type"]).toBe("Not found");
    });

    it("should return 400 if insufficient stock", async () => {
      // given
      commandMediatorMock.execute.mockRejectedValue(
        new InsufficientStockException("Insufficient stock")
      );

      // when
      const response = await request(server)
        .post(`/products/${testMongoId}/sell`)
        .send({ quantity: 2 });

      // then
      expect(response.status).toBe(400);
      expect(response.body["errorMessage"]).toEqual("Insufficient stock");
      expect(response.body["type"]).toBe("Bad Request");
    });
  });
});
