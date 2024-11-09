import Image from "next/image";


export const ShowImage = ({ item, url }) => (
    <div>
        <Image
            src={`/api/${url}/photo/${item._id}`}
            alt=''
            width={50}
            height={50}
            style={{borderRadius: '3px'}}
        />
    </div>
);

export default ShowImage;