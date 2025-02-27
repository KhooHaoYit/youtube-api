import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';
import { AppService } from './app.service';
import { Video } from './@generated/video/video.model';

@Resolver()
export class AppResolver {

  constructor(
    private service: AppService,
    private prisma: PrismaService,
  ) { }

  @Query(() => Video, { nullable: true })
  async getVideo(
    @Info() info: GraphQLResolveInfo,
    @Args('id', { type: () => String }) id: string,
  ) {
    const { select } = new PrismaSelect(info).value;
    return await this.prisma.video.findUnique({
      where: { id },
      select
    });
  }

  @Query(() => [Video])
  async getVideos(
    @Info() info: GraphQLResolveInfo,
    @Args('ids', { type: () => [String] }) ids: string[],
  ) {
    const { select } = new PrismaSelect(info).value;
    return await this.prisma.video.findMany({
      where: { id: { in: ids } },
      select,
    });
  }

  @Query(() => [Video], { nullable: true })
  async getChannelVideos(
    @Info() info: GraphQLResolveInfo,
    @Args('id', { type: () => String }) id: string,
  ) {
    const { select } = new PrismaSelect(info).value;
    return await this.prisma.channel.findUnique({
      where: { id },
      select: {
        videos: { select },
      },
    }).then(res => res?.videos);
  }

  @Mutation(() => Video)
  async fetchVideo(
    @Info() info: GraphQLResolveInfo,
    @Args('id', { type: () => String }) id: string,
  ) {
    await this.service.updateVideo(id);
    return await this.getVideo(info, id);
  }

  @Mutation(() => [Video])
  async fetchVideos(
    @Info() info: GraphQLResolveInfo,
    @Args('ids', { type: () => [String] }) ids: string[],
  ) {
    await Promise.all(ids.map(id => this.service.updateVideo(id)));
    return await this.getVideos(info, ids);
  }

}
