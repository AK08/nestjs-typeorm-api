import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { CurrentUser } from '../auth/decorators/currentuser.decorator';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard';
import { UpdatePostDto } from './dtos/update-post.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../auth/entity/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findPostById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postsService.createPost(createPostDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.postsService.updatePost(id, updatePostDto, user);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
