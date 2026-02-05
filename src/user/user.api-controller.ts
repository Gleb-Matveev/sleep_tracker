import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from './entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedUserResponseDto, UserResponseDto } from './dto/user-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UserAdapter } from './user.adapter';
import type { Request, Response } from 'express';
import { PaginationService } from 'src/common/services/pagination.service';

@ApiCookieAuth('sAccessToken')
@Roles(UserRole.ADMIN)
@ApiTags('Users')
@Controller('api/user')
export class UserApiController {
  constructor(
    private readonly userService: UserService,
    private readonly userAdapter: UserAdapter,
    private readonly paginationService: PaginationService,
  ) {}

  @ApiOperation({
    summary: 'Get all users',
    description:
      'Returns a list of users with pagination. Use query parameters page and limit to control pagination. Pagination parameters are described in PaginationDto.',
  })
  @ApiOkResponse({
    type: PaginatedUserResponseDto,
    description:
      'Successful response with list of users and pagination metadata',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid pagination parameters (page < 1 or limit outside allowed range)',
  })
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    const { data, total } = await this.userService.findAllPaginated(
      page,
      limit,
    );

    const userDto = data.map((day) => this.userAdapter.toResponseDto(day));

    const response = this.paginationService.createPaginatedResponse(
      userDto,
      total,
      page,
      limit,
      req,
      res,
    );

    return response;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns information about a specific user by its identifier',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique user identifier',
    example: 1,
  })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'User found and returned',
  })
  @ApiResponse({
    status: 404,
    description: 'User with the specified ID not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format (must be a number)',
  })
  async findOne(@Param('id') id: string) {
    return this.userAdapter.toResponseDto(await this.userService.findOneWithRelations(+id));
  }
}
