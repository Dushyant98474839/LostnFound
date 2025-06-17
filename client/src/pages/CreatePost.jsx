import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  TimePicker,
  Upload,
  message
} from 'antd';
import { Country, City, State } from 'country-state-city';
import { InboxOutlined } from '@ant-design/icons';

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

  useEffect(() => {
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          
        }
      };
  
      checkSession();
    }, []);

  const [form] = Form.useForm();
  const [condition, setCondition] = useState('lost');
  const [selectedCountryCode, setSelectedCountry] = useState(undefined);
  const [selectedStateCode, setSelectedState] = useState(undefined);

  const countryOptions = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  const stateOptions = State.getStatesOfCountry(selectedCountryCode || "").map(state => ({
    label: state.name,
    value: state.isoCode,
  }));

  const cityOptions = City.getCitiesOfState(selectedCountryCode || "", selectedStateCode || "").map(city => ({
    label: city.name,
    value: city.name,
  }));

  // Upload props
  const uploadProps = {
    name: 'file',
    listType: 'picture',
    maxCount: 1,
    accept: ".png,.jpg,.jpeg",
    beforeUpload: () => false, // prevent auto-upload
    onChange(info) {
      const file = info.fileList[0];
      if (file && file.originFileObj) {
        form.setFieldsValue({ Image: file.originFileObj });
      }
    },
  };

  return (
    <>
    <div className=''>

      <Navbar />
      <div className='flex flex-col mt-14 items-center justify-center w-full'>
        <h1 className='text-xl mb-10 font-semibold'>Please Enter the Details</h1>
        <Form
          className='shadow-md'
          {...formItemLayout}
          form={form}
          variant={'outlined'}
          style={{ padding: 15, borderRadius: 10, width: "50%" }}
          onFinish={(values) => {
            console.log("Submitted Values: ", values);
            message.success("Form submitted!");
          }}
        >
          <Form.Item label="Condition" name="Condition" rules={[{ required: true }]}>
            <Radio.Group value={condition} onChange={(e) => setCondition(e.target.value)}>
              <Radio.Button value="lost">Lost</Radio.Button>
              <Radio.Button value="found">Found</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="Description">
            <Input.TextArea style={{height:200}}/>
          </Form.Item>
          
          <Form.Item label="Address" name="Address">
            <Input />
          </Form.Item>

          <Form.Item label="Country" name="Country" rules={[{ required: true }]}>
            <Select
              showSearch
              options={countryOptions}
              onChange={(val) => {
                setSelectedCountry(val);
                setSelectedState(undefined);
                form.setFieldsValue({ State: undefined, City: undefined });
              }}
              />
          </Form.Item>

          <Form.Item label="State" name="State" rules={[{ required: true }]}>
            <Select
              showSearch
              options={stateOptions}
              onChange={(val) => {
                setSelectedState(val);
                form.setFieldsValue({ City: undefined });
              }}
              disabled={!selectedCountryCode}
            />
          </Form.Item>

          <Form.Item label="City" name="City">
            <Select
              showSearch
              options={cityOptions}
              disabled={!selectedStateCode}
            />
          </Form.Item>

          <Form.Item label="Pincode" name="Pincode">
            <Input />
          </Form.Item>

          <Form.Item label="Date" name="Date">
            <DatePicker />
          </Form.Item>

          <Form.Item label="Time" name="Time">
            <TimePicker format="HH:mm" />
          </Form.Item>

          {condition === 'lost' && (
            <Form.Item label="Award" name="Award">
              <Input />
            </Form.Item>
          )}

          <Form.Item
            label="Image"
            name="Image"
            valuePropName="file"
            rules={[{ required: true, message: 'Please upload an image' }]}
            >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag image to upload</p>
              <p className="ant-upload-hint">Only one image is allowed (.jpg/.png)</p>
            </Dragger>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

        </Form>
      </div>
            </div>
    </>
  );
};

export default CreatePost;
