import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '../../generated/prisma';
import { PaginationDto } from '../common/dto/pagination';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit{

  private readonly logger=new Logger(ProductsService.name)

  onModuleInit() {
    this.$connect()
    this.logger.log("Connected to database")
  }
  create(createProductDto: CreateProductDto) {

  return this.product.create({
      data:createProductDto
    })
    
  }

  async findAll(paginationDto:PaginationDto) {
    const {page=1,limit=10}=paginationDto

    const totalPages=await this.product.count({
      where:{
        available:true
      }
    })
    const products=await this.product.findMany({
      where:{
        available:true
      },
      skip:(page-1)*limit,
      take:limit,
        orderBy:{
        price:"asc"
      },
    })
    return {
      data:products,
      meta:{
      totalPages,
      currentPage:page,
      lastPage:Math.ceil(totalPages/limit),
      nextPage:page<totalPages?page+1:null,
      prevPage: page>1?page-1:null
    }
    };
  }
 

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id
      }
    });
    if (!product) {
      throw new NotFoundException("Producto no encontrado");
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const {id:_,...data}=updateProductDto
    await this.findOne(id)
     return this.product.update({
      where:{
        id,
        available:true
      },
      data
     })
  }

 async remove(id: number) {

    await this.findOne(id)
  const product= await this.product.update({
      where:{
        id
      },
      data:{
        available:false
      }
    })

      return product

  }

}
