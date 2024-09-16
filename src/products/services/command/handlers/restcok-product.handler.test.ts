import { RestockProductHandler } from "./restock-product.handler";
import { RestockProductCommand } from "../restock-product.command";
import { ProductsRepository } from "../../../products.repo";
import { ProductNotFoundException } from "../../exceptions";
import { RestockProductResponseDto } from "../../../dtos/restock-product-response.dto";
import { IProductDoc } from "../../../models/product";

const testMongoId = "66e43a4c85f4f8e78d33fded";
const nonExistingTestMongoId = "66e43a4c85f4f8e78d33fdec";

describe("RestockProductHandler", () => {
  let restockProductHandler: RestockProductHandler;
  let productsRepositoryMock: jest.Mocked<ProductsRepository>;

  beforeEach(() => {
    productsRepositoryMock = {
      getProductById: jest.fn(),
    } as unknown as jest.Mocked<ProductsRepository>;

    restockProductHandler = new RestockProductHandler(productsRepositoryMock);
  });

  it("should restock a product successfully", async () => {
    const command = new RestockProductCommand(testMongoId, 10);
    const product = {
      _id: testMongoId,
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 5,
      save: jest.fn(),
    };

    productsRepositoryMock.getProductById.mockResolvedValue(
      product as unknown as IProductDoc
    );

    const result: RestockProductResponseDto =
      await restockProductHandler.handle(command);

    expect(productsRepositoryMock.getProductById).toHaveBeenCalledWith(
      testMongoId
    );
    expect(product.stock).toBe(15);
    expect(product.save).toHaveBeenCalled();
    expect(result).toEqual({ newStockLevel: 15 });
  });

  it("should throw ProductNotFoundException if product is not found", async () => {
    const command = new RestockProductCommand(nonExistingTestMongoId, 10);

    productsRepositoryMock.getProductById.mockResolvedValue(null);

    await expect(restockProductHandler.handle(command)).rejects.toThrow(
      new ProductNotFoundException(
        `Product with ID ${nonExistingTestMongoId} not found`
      )
    );

    expect(productsRepositoryMock.getProductById).toHaveBeenCalledWith(
      nonExistingTestMongoId
    );
  });
});
