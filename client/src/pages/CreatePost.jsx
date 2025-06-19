import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  TimePicker,
  Upload,
  message,
} from 'antd';
import { Country, City, State } from 'country-state-city';
import { InboxOutlined } from '@ant-design/icons';
import { useAuth } from '../utils/AppContext';
import { createClient } from '@supabase/supabase-js';
import { useCustomMessage } from '../utils/feedback';
import { useNavigate } from 'react-router-dom';
import {Maps} from '../components/Maps';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const { Dragger } = Upload;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const CreatePost = () => {
  const navigate = useNavigate()
  let post_id;
  const { session } = useAuth();
  const { notify, contextHolder } = useCustomMessage();
  const { isLoggedIn, isProfileComplete } = useAuth();
  const [form] = Form.useForm();
  const [condition, setCondition] = useState('lost');
  const [selectedCountryCode, setSelectedCountry] = useState(undefined);
  const [selectedStateCode, setSelectedState] = useState(undefined);
  const [imageListPost, setImageListPost] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isSubmitted, setisSubmitted] = useState(false);
  const [category, setCategory] = useState(undefined)
  const [mapPin, setMapPin] = useState(false)

  const countryOptions = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  const stateOptions = State.getStatesOfCountry(selectedCountryCode || '').map((state) => ({
    label: state.name,
    value: state.isoCode,
  }));

  const cityOptions = City.getCitiesOfState(selectedCountryCode || '', selectedStateCode || '').map(
    (city) => ({
      label: city.name,
      value: city.name,
    })
  );

  const categoryOptions = ['electronics', 'financial', 'education', 'groceries', 'clothes', 'automobile',
    'person', 'pet', 'sports', 'documents', 'accessories', 'gadgets', 'toys',
    'tools', 'stationery', 'footwear', 'medication', 'art', 'baggage', 'home_appliances', 'others'
  ]

  const uploadProps = {
    name: 'file',
    listType: 'picture',
    maxCount: 10,
    accept: '.png,.jpg,.jpeg',
    beforeUpload: () => false,
    onChange(info) {
      console.log('Uploaded files:', info.fileList);
      setImageListPost(info.fileList);
    },
  };

  const uploadFile = async (imageList, postId) => {
    if (!imageList || imageList.length === 0) {
      return true;
    }

    for (let i = 0; i < imageList.length; i++) {
      const file = imageList[i]?.originFileObj;
      if (!file) {
        notify.error(`Invalid file at index ${i}`);
        throw new Error(`Invalid file at index ${i}`);
      }

      const filePath = `${postId}/post_image_${i}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage
        .from('post-pics')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error.message);
        notify.error(`Failed to upload image ${i + 1}: ${error.message}`);
        throw error;
      }
    }
    return true;
  };

  const handleSubmit = async (values) => {
    setisLoading(true)
    try {
      values.user_id = session.user.id;
      values.image_count = imageListPost.length;
      values.longitude=values.coordinates.lng;
      values.latitude=values.coordinates.lat;
      delete values.coordinates;
      delete values.Image;
      console.log('Form values:', values);

      const { data, error } = await supabase.from('posts').upsert(values).select();

      if (error) {
        throw new Error(error.message);
      }

      post_id = data?.[0]?.id;
      if (!post_id) {
        throw new Error('Failed to retrieve post ID');
      }

      await uploadFile(imageListPost, post_id);
      notify.success('Post and images saved successfully!');
    } catch (error) {
      notify.error(`Failed to save post: ${error.message}`);
    }
    // setisLoading(false)
    // setTimeout(()=>{
    //   navigate("/home")
    // },3000)
    setisSubmitted(true)
  };

  return (
    <div className="">
      {contextHolder}
      <Navbar />
      {!isLoggedIn ? (
        <h1>Please create an account first</h1>
      ) : !isProfileComplete ? (
        <h1>Please finish your profile first</h1>
      ) : (
        <>
          <div className="flex flex-col mt-14 items-center justify-center w-full">
            <h1 className="text-xl mb-10 font-semibold">Please Enter the Details</h1>
            <Form
              className="shadow-md"
              {...formItemLayout}
              form={form}
              variant={'outlined'}
              style={{ padding: 15, borderRadius: 10, width: '50%' }}
              onFinish={handleSubmit}
            >
              <Form.Item label="Condition" name="type" rules={[{ required: true }]}>
                <Radio.Group value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <Radio.Button value="lost">Lost</Radio.Button>
                  <Radio.Button value="found">Found</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input.TextArea style={{ height: 200 }} />
              </Form.Item>

              <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                <Select options={categoryOptions.map((cat) => ({ label: cat, value: cat }))} onChange={(val) => setCategory(val)} />

              </Form.Item>


              <Form.Item label="Location" name="location">
                <Input />
              </Form.Item>

              <Form.Item label="Country" name="country" rules={[{ required: true }]}>
                <Select
                  showSearch
                  options={countryOptions}
                  onChange={(val) => {
                    setSelectedCountry(val);
                    setSelectedState(undefined);
                    form.setFieldsValue({ state: undefined, city: undefined });
                  }}
                />
              </Form.Item>

              <Form.Item label="State" name="state" rules={[{ required: true }]}>
                <Select
                  showSearch
                  options={stateOptions}
                  onChange={(val) => {
                    setSelectedState(val);
                    form.setFieldsValue({ city: undefined });
                  }}
                  disabled={!selectedCountryCode}
                />
              </Form.Item>

              <Form.Item label="City" name="city">
                <Select showSearch options={cityOptions} disabled={!selectedStateCode} />
              </Form.Item>

              <Form.Item label="Pincode" name="pincode">
                <Input />
              </Form.Item>

              <Form.Item label="Mark Location on Map" name="coordinates" rules={[{ required: true }]}>
                <Button type="default" onClick={() => { setMapPin(true) }}>
                  Open Map
                </Button>
              </Form.Item>

              <Form.Item label="Date" name="date">
                <DatePicker />
              </Form.Item>

              {/* <Form.Item label="Time" name="time">
              <TimePicker format="HH:mm" />
            </Form.Item> */}

              {condition === 'lost' && (
                <Form.Item label="Award" name="award">
                  <Input />
                </Form.Item>
              )}

              <Form.Item
                label="Image"
                name="Image"
                rules={[{ required: false, message: 'Please upload an image' }]}
              >
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag image to upload</p>
                  <p className="ant-upload-hint">Up to 10 images allowed (.jpg/.png)</p>
                </Dragger>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  {!isSubmitted ?
                    ("Submit") : "Submitted"
                  }
                </Button>
              </Form.Item>
            </Form>
          </div>
          {mapPin &&
            <Modal
              open={mapPin}
              title="Click to Set Location on Map"
              onCancel={() => setMapPin(false)}
              footer={null}
              centered
              width={1200}
              destroyOnHidden
            >
              <div style={{ height: "700px" , width:"100%"}}>
                <Maps  form={form}/>
              </div>
            </Modal>

            

          }
        </>

      )}
    </div>
  );
};

export default CreatePost;