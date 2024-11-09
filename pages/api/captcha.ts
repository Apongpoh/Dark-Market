import svgCaptcha from 'svg-captcha';
import { NextApiRequest, NextApiResponse } from 'next'


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    if (method === 'GET') {
        const captcha = svgCaptcha.create({ size: 6 });
        return res.json(captcha.text);
    }
}