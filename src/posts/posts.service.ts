import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { User, UserRole } from 'src/auth/entity/user.entity';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async findAll() {
    const posts = await this.postsRepository.find({
      relations: ['authorName'],
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      authorName: {
        id: post.authorName.id,
        name: post.authorName.name,
        email: post.authorName.email,
        role: post.authorName.role,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  }

  async findPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['authorName'],
    });
    if (!post) {
      throw new NotFoundException('Post does not exist.');
    }
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      authorName: {
        id: post.authorName.id,
        name: post.authorName.name,
        email: post.authorName.email,
        role: post.authorName.role,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async createPost(createPostDto: CreatePostDto, user: User) {
    const post = this.postsRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      authorName: user,
    });

    const savePost = await this.postsRepository.save(post);
    return savePost;
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.findPostById(id);

    if (post.authorName.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Not your post!');
    }

    if (updatePostDto.title) {
      post.title = updatePostDto.title;
    }

    if (updatePostDto.content) {
      post.content = updatePostDto.content;
    }
    const savePost = await this.postsRepository.save(post);
    return savePost;
  }

  async deletePost(id: number) {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('No post was found to delete.');
    }
    return {
        message : 'Post is deleted.'
    }
  }
}
