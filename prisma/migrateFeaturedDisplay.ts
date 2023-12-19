import { Prisma, PrismaClient } from "@prisma/client";
import { getFeaturedDisplay } from "src/youtube/types/export/url/channelTab/home";

const prisma = new PrismaClient;

(async () => {
  let channels = await prisma.channel.findMany({
    where: {
      featuredDisplay: {
        not: Prisma.DbNull
      }
    },
    select: {
      id: true,
      featuredDisplay: true
    }
  });

  console.log(`Detected ${channels.length} channels with featuredDisplay`);

  const newChannels = channels.map(channel => {
    let featuredDisplay = <ReturnType<typeof getFeaturedDisplay>>channel.featuredDisplay;
    if (featuredDisplay.includes(<any>null))
      featuredDisplay = featuredDisplay.filter(display => display);
    if (featuredDisplay
      .some(display => (
        display[0] === 'videos'
        && ['Popular videos', 'Videos', 'Past live streams'].includes(display[1])
      ) || display[0] === <any>'shorts'
      )
    )
      featuredDisplay = featuredDisplay.map(display => {
        if (display[0] === <any>'shorts')
          return ['playlist', channel.id.replace('UC', 'UUSH')];
        if (display[0] !== 'videos')
          return display;
        switch (display[1]) {
          default:
            throw new Error(`Unknown display type: ${display[1]}`);
          case 'Upcoming live streams':
          case 'Live now':
            return display;
          case <any>'Popular videos':
            return ['playlist', channel.id.replace('UC', 'UULP')];
          case <any>'Videos':
            return ['playlist', channel.id.replace('UC', 'UULF')];
          case <any>'Past live streams':
            return ['playlist', channel.id.replace('UC', 'UULV')];
        }
      });
    if (channel.featuredDisplay === featuredDisplay)
      return [];
    return [[channel, { ...channel, featuredDisplay }]];
  }).flat();

  console.log(`${newChannels.length} of which the data can be migrated`);

  if (process.argv[2] !== 'deploy')
    return console.log('In order to deploy this migration, please add `deploy` at the end of the cli');

  console.log('Deploying migration');
  console.log();

  for (const [oldChannel, newChannel] of newChannels) {
    console.log(JSON.stringify([oldChannel.id, oldChannel.featuredDisplay, newChannel.featuredDisplay]));
    await prisma.channel.update({
      where: { id: newChannel.id },
      data: {
        featuredDisplay: newChannel.featuredDisplay!
      }
    })
  }

  console.log();
  console.log('Migration deployed');

})();
