// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const API = `https://fonts.googleapis.com/css2?family=Roboto&text="${encodeURIComponent('테스트 입니다.')}"`;

  const css = await (
    await fetch(API, {
      headers: {
        // Make sure it returns TTF.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    })
  ).text();

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (!resource) return null;

  const fontRes = await fetch(resource[1]);
  const robotoArrayBuffer = await fontRes.arrayBuffer();

  // @ts-ignore
  const svg = await satori(
    <div style={{ display: 'flex', color: 'black', position: 'relative' }}>
      <img src="https://img-cf.kurly.com/shop/data/goods/1653039356229l0.jpg" width={550} height={708} />
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          borderRadius: '4px',
          backgroundColor: 'red',
          fontFamily: 'Roboto',
          padding: '0 8px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        테스트 입니다.
      </div>
    </div>,
    {
      fonts: [
        {
          name: 'Roboto',
          // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
          data: robotoArrayBuffer,
          weight: 400,
          style: 'normal',
        },
      ],
      width: 550,
      height: 708,
    },
  );

  const opts = {
    // background: 'rgba(238, 235, 230, .9)',
    font: {
      fontFiles: ['./example/SourceHanSerifCN-Light-subset.ttf'], // Load custom fonts.
      loadSystemFonts: false, // It will be faster to disable loading system fonts.
      // defaultFontFamily: 'Source Han Serif CN Light', // You can omit this.
    },
  };
  const resvg = new Resvg(svg, opts);
  const pngData = resvg.render();

  const png = pngData.asPng();

  res.setHeader('Content-Type', 'image/png');
  res.send(png);
}
