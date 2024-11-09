import * as tf from '@tensorflow/tfjs';
import { address } from 'bitcoinjs-lib';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const protectBtcAddress = (btcaddress: any) => {
        let avg: any, btcSplit: any, endHash: any, startHash: any, hiddenBtc: any;

        btcSplit = btcaddress.split('1');

        startHash = btcSplit[0];
        endHash = btcSplit[1];

        avg = endHash.length / 6;

        endHash = endHash.substring(endHash.length - avg)

        hiddenBtc = startHash + '1*************************************************' + endHash;

        console.log(hiddenBtc)
    }

    protectBtcAddress('tb1qetnwg77j3e4ws2kwr6khj0q8wghvn0p9s4m4fpv0nan3e62kc40sg6ev4r')
    res.end()
}