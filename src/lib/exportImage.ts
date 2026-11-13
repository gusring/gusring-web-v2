import { FORM_FONT, FORM_FONT_WEIGHT, INK, lineY, markScale, marksFor } from '../forms/render';
import { FormDef, Mark, pageIndex, Values } from '../forms/types';

// 화면의 FormSvg와 같은 Mark를 Canvas에 그려 PNG로 만든다.

const SCALE = 2;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function drawMark(ctx: CanvasRenderingContext2D, m: Mark, scale = 1) {
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  switch (m.kind) {
    case 'text': {
      const align = m.box.align ?? 'left';
      ctx.font = `${FORM_FONT_WEIGHT} ${m.size}px ${FORM_FONT}`;
      ctx.textAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
      ctx.textBaseline = 'middle';
      const x = align === 'left' ? m.box.x : align === 'center' ? m.box.x + m.box.w / 2 : m.box.x + m.box.w;
      const lines = m.lines ?? [m.text];
      lines.forEach((line, i) => ctx.fillText(line, x, lineY(m.box, m.size, lines.length, i)));
      break;
    }
    case 'circle':
      ctx.lineWidth = 2.8 * scale;
      ctx.beginPath();
      ctx.arc(m.at.x, m.at.y, 15 * scale, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'check':
      ctx.lineWidth = 3.2 * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(m.at.x - 8 * scale, m.at.y);
      ctx.lineTo(m.at.x - 2 * scale, m.at.y + 7 * scale);
      ctx.lineTo(m.at.x + 10 * scale, m.at.y - 10 * scale);
      ctx.stroke();
      break;
  }
}

/** 쪽마다 한 장씩 그린다 (인쇄할 때 쪽마다 A4 한 장) */
export async function renderPagePngs(form: FormDef, values: Values): Promise<string[]> {
  await document.fonts.ready;
  return Promise.all(
    form.pages.map(async (pg, i) => {
      const img = await loadImage(pg.image);
      const canvas = document.createElement('canvas');
      canvas.width = pg.width * SCALE;
      canvas.height = pg.height * SCALE;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(SCALE, SCALE);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, pg.width, pg.height);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, pg.width, pg.height);
      for (const f of form.fields) if (pageIndex(f) === i) for (const m of marksFor(f, values[f.id])) drawMark(ctx, m, markScale(pg.width));
      return canvas.toDataURL('image/png');
    }),
  );
}

/** 휴대폰 브라우저가 그릴 수 있는 캔버스 넓이 (iOS Safari 한도 16,777,216px보다 조금 작게) */
const MAX_CANVAS_AREA = 16_000_000;
const PAGE_GAP = 24;

/**
 * 이미지 저장용 한 장. 1쪽 서식은 그 쪽 그대로,
 * 여러 쪽 서식은 쪽을 같은 폭으로 맞춰 위에서 아래로 이어 붙인다 (휴대폰에서 파일 하나로 저장되도록).
 */
export async function joinPagePngs(pngs: string[]): Promise<string> {
  if (pngs.length === 1) return pngs[0];
  const imgs = await Promise.all(pngs.map(loadImage));
  const width = Math.max(...imgs.map((i) => i.naturalWidth));
  const heights = imgs.map((i) => (i.naturalHeight * width) / i.naturalWidth);
  const total = heights.reduce((a, b) => a + b, 0) + PAGE_GAP * (imgs.length - 1);
  const scale = Math.min(1, Math.sqrt(MAX_CANVAS_AREA / (width * total)));
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(total * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(0, 0, width, total);
  ctx.imageSmoothingQuality = 'high';
  let y = 0;
  imgs.forEach((img, i) => {
    ctx.drawImage(img, 0, y, width, heights[i]);
    y += heights[i] + PAGE_GAP;
  });
  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
