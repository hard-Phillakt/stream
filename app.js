const NodeMediaServer = require('node-media-server');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 80;

const app = express();

app.get('/', (req, res) => {

  res.end(`
  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js"></script>
      </head>
      <body>
        
        <video id="videoElement" style="width: 300px;"></video>

        
        <script>
          if (flvjs.isSupported()) {
            var videoElement = document.getElementById("videoElement");
            var flvPlayer = flvjs.createPlayer({
              type: "flv",
              //url: "ws://95.213.224.3:5000/cctv/BigBuckBunny.flv",
              url: "ws://95.213.224.3:5000/cctv/BigBuckBunny.flv",
            });
            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
          }

          document.body.onclick = function(){
            flvPlayer.play();
          }
        </script>
      </body>
    </html>
  `);

});

app.listen(PORT, () => {
  console.log('server is start...');
})

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 5000,
    allow_origin: '*'
  },
  relay: {
    // ffmpeg: `${path.join(__dirname, '/', 'ffmpeg.exe')}`,
    ffmpeg: '/usr/local/bin/ffmpeg',
    tasks: [
      {
        app: 'cctv',
        mode: 'static',
        // edge: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
        edge: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
        name: 'BigBuckBunny',
        rtsp_transport: 'tcp' //['udp', 'tcp', 'udp_multicast', 'http']
      },
      // {
      //   app: 'mv',
      //   mode: 'static',
      //   edge: 'C:/Users/mds/Desktop/media-stream/1.mp4',
      //   name: 'dq'
      // }
    ]
  }
};

var nms = new NodeMediaServer(config)
nms.run();