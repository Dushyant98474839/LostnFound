import React, { useState } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Avatar, Card, Button, Carousel } from 'antd';

const { Meta } = Card;

const Cards = () => {
  const [status, setStatus] = useState('lost');

  // List of image URLs
  const images = [
    "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
    "https://images.moneycontrol.com/static-mcnews/2024/06/20240613162128_Shipping-Corporation-of-India.jpg?impolicy=website&width=770&height=431",
    "https://picsum.photos/400/200"
  ];

  return (
    <div className="my-4 w-full shadow-md">
      <div className='w-full flex flex-row gap-4 items-center p-3'>
        <Avatar className="border border-gray-200" src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
        <h1 className='text-lg font-semibold'>Dushyant</h1>
      </div>

      <Card
        className='rounded-none'
        cover={
          <Carousel autoplay arrows>
            {images.map((src, index) => (
              <img key={index} src={src} alt={`Image ${index}`} className="w-full h-full object-cover" />
            ))}
          </Carousel>
        }
        actions={[]}
      >
        <Meta
          title="Item"
          description="This is the description"
        />

        <div className='flex flex-row items-start justify-between mt-4'>

          {status === 'lost' ? (
            <div>
              <h1 className='text-lg my-4'>
                <span className='font-semibold'>Award:</span> $900
              </h1>
              <Button type="primary">Found</Button>
            </div>
          ) : (
            <Button type="primary">Claim</Button>
          )}

          <div>
            <h1 className='mt-4 text-xl'>location (lat, long)</h1>
            <h1 className='mb-2 text-xl'>time</h1>
            
            <EnvironmentOutlined className='hover:cursor-pointer text-xl' />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Cards;
