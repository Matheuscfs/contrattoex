import PusherClient from 'pusher-js';
import PusherServer from 'pusher';

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
const pusherAppId = process.env.PUSHER_APP_ID;
const pusherSecret = process.env.PUSHER_SECRET;

let pusherClient: PusherClient | null = null;
let pusherServer: PusherServer | null = null;

if (typeof window !== 'undefined') {
  if (!pusherKey || !pusherCluster) {
    console.error('Pusher environment variables are not properly configured');
  } else {
    pusherClient = new PusherClient(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true,
      authEndpoint: '/api/pusher/auth',
      auth: {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    });
  }
}

if (typeof window === 'undefined') {
  if (!pusherAppId || !pusherKey || !pusherSecret || !pusherCluster) {
    console.error('Pusher server environment variables are not properly configured');
  } else {
    pusherServer = new PusherServer({
      appId: pusherAppId,
      key: pusherKey,
      secret: pusherSecret,
      cluster: pusherCluster,
      useTLS: true,
    });
  }
}

export { pusherClient, pusherServer }; 