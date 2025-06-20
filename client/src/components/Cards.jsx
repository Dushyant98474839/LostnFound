import React, { useEffect, useState } from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined, EnvironmentOutlined, LogoutOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Avatar, Card, Button, Carousel, Modal } from 'antd';
import { createClient } from '@supabase/supabase-js';
import { MapsCards } from './Maps';
import { useCustomMessage } from '../utils/feedback';
import ClaimFoundForm from './ClaimFoundForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AppContext';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
const { Meta } = Card;

const Cards = ({ obj, displayOptions, details, userposts, canBeDeleted }) => {
  // const [status, setStatus] = useState('lost');
  const [username, setUsername] = useState(undefined)
  const [profilepic, setProfilePic] = useState();
  const [postImages, setPostImages] = useState([]);
  const [mapPin, setMapPin] = useState(false)
  const { notify, contextHolder } = useCustomMessage();
  const [showForm, setshowForm] = useState(false);
  const navigate = useNavigate()
  const { session, isLoggedIn, isProfileComplete } = useAuth();

  useEffect(() => {
    const fetchUsername = async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", obj.user_id).single();
      if (data) {
        // console.log(data)
        setUsername(data.username)
      }
      else {
        console.log(error)
        return null
      }
    }
    fetchUsername()


    const fetchDP = async () => {
      const { data, error } = await supabase.from('profiles').select("profile_pic").eq("id", obj.user_id);
      // console.log(data)
      if (data?.[0]?.profile_pic) {
        setProfilePic(`${import.meta.env.VITE_PROFILE_PIC_URL}${data?.[0]?.profile_pic}`);
      }
    }
    fetchDP()

    const fetchPostImages = async () => {
      const { data, error } = await supabase.storage.from('post-pics').list(`${obj.id}`, {
        limit: 100, offset: 0
      })
      // console.log(data)
      if (error) {
        return notify.error(error.message)
      }


      const urllist = await Promise.all(data.map(async (file, i) => {
        let { data: publicUrl } = await supabase.storage.from('post-pics').getPublicUrl(`${obj.id}/${file.name}`)
        // console.log(publicUrl)
        return `${publicUrl.publicUrl}`;
      }))

      setPostImages(urllist)

    };

    fetchPostImages()
  }, [])

  const handleDelete = async (e) => {
    const { error } = await supabase.from("posts").delete().eq("id", obj.id);
    if (error) {
      notify.error(error.message)
    }
    else {
      notify.success("Post Successfully deleted")
      setTimeout(
        () => {

          window.location.reload()
        }, 1000
      )
    }
  }

  // const images = [
  //   "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  //   "https://images.moneycontrol.com/static-mcnews/2024/06/20240613162128_Shipping-Corporation-of-India.jpg?impolicy=website&width=770&height=431",
  //   "https://picsum.photos/400/200"
  // ];

  return (
    <div className={`my-4 p-4 shadow-md rounded-lg ${userposts ? `w-full` : "w-full"}`}>
      {contextHolder}
      <div className='w-full flex flex-row justify-between items-center p-3'>
        <div className='flex flex-row gap-2'>

          <Avatar className="border border-gray-200" src={profilepic} />
          <h1 className='text-lg font-semibold'>{username}</h1>
        </div>
        {displayOptions ?
          <div className='flex flex-row gap-2'>
            {
              obj.resolved &&
              <CheckCircleOutlined className="" />
            }
            {!obj.resolved &&
              <DeleteOutlined className="hover:cursor-pointer" onClick={handleDelete} />
            }
          </div> : ""
        }

      </div>

      <Card
        className='rounded-none w-full mx-auto'
        cover={
          <Carousel autoplay arrows>
            {postImages && postImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Image ${index}`}
                className={`w-full ${(userposts) ? `h-96` : `h-48`} object-contain rounded`}
              />

            ))}
          </Carousel>
        }
        actions={[]}
      >
        <Meta
          title={obj.title}
          description={obj.description}
        />

        <div className='flex flex-row justify-between mt-4 gap-8'>

          {details ?
            <Button type="primary" onClick={() => navigate(`/my-posts/${obj.id}`)}>Details</Button> : (obj.type == 'lost') ? (
              <div>
                {
                  obj.award && (

                    <h1 className='text-lg my-4'>
                      <span className='font-semibold text-gray-700'>Award: </span>{obj.award}
                    </h1>
                  )
                }
                <Button type="primary" onClick={() => {
                  if (!session) return notify.error("You must be logged in.");
                  if (!isProfileComplete) return notify.error("Please complete your profile.");
                  setshowForm(true);
                }}>Found</Button>
              </div>
            ) : (
              <Button type="primary" onClick={() => {
                if (!session) return notify.error("You must be logged in.");
                if (!isProfileComplete) return notify.error("Please complete your profile.");
                setshowForm(true);
              }}>Claim</Button>
            )}



          <div>
            <h1 className='mt-4 text-xl'>{`${obj.location},${(obj.city) ? obj.city : ""}, ${obj.state}, ${obj.country}, ${(obj.pincode) ? obj.pincode : ""}`}</h1>
            <h1 className='mb-2 text-xl'>{obj.date}</h1>

            <div className="hover:cursor-pointer " onClick={() => {
              setMapPin(true)
            }}>
              <EnvironmentOutlined className=' text-xl' /><span className='ml-2'>View On Map</span>
            </div>

            <Modal
              open={mapPin}
              title="Click to Set Location on Map"
              onCancel={() => setMapPin(false)}
              footer={null}
              centered
              width={1200}
              destroyOnHidden
            >
              <div style={{ height: "700px", width: "100%" }}>
                <MapsCards lng={(obj.longitude) ? obj.longitude : "28.5965800646348"} lat={obj.latitude ? obj.latitude : "77.187252046424"} />
              </div>
            </Modal>

            <Modal
              open={showForm}
              onCancel={() => { setshowForm(false) }}
              centered
              width={1200}
              destroyOnHidden
              title="Please fill the form."
            >

              <ClaimFoundForm status={obj.type} post_id={obj.id} user_id={obj.user_id} />
            </Modal>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Cards;
