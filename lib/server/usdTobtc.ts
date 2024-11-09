import { fiatToBitcoin } from 'bitcoin-conversion';


export const conv = async (price: any) => {
    await fiatToBitcoin(price, 'USD')
        .then(d => d)
        .catch(() => console.clear());
}