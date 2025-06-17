import React, { useState } from 'react'
import Navbar from '../components/Navbar'

import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Segmented,
  Select,
  TreeSelect,
  TimePicker, Radio
} from 'antd';

import { Country, City, State } from 'country-state-city';




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
  const [pincode, setPincode] = useState();
  const [form] = Form.useForm();
  const [condition, setcondition] = useState('lost');
  const [selectedCountryCode, setSelectedCountry] = useState(undefined)
  const [selectedStateCode, setSelectedState] = useState(undefined)

  const countryOptions = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  const stateOptions = State.getStatesOfCountry(selectedCountryCode).map(state => ({
    label: state.name,
    value: state.isoCode,
  }));

  const cityOptions = City.getCitiesOfState(selectedCountryCode, selectedStateCode).map(city => ({
    label: city.name,
    value: city.name,
  }));

  return (
    <>
      <Navbar />
      <div className='flex flex-col mt-24 items-center justify-center w-full'>

        <h1 className='text-xl font-semibold'>Please Enter the Details</h1>
        <Form
          className='shadow-md'
          {...formItemLayout}
          form={form}
          variant={'outlined'}
          style={{ padding: 15, borderRadius: 10, width: "50%" }}
          initialValues={{ variant: 'filled' }}
        >

          <Form.Item label="Condition" name="Condition" rules={[{ required: true, message: 'Please input!' }]}>
            <Radio.Group value={condition} onChange={(e) => setcondition(e.target.value)}>
              <Radio.Button value="Lost">Lost</Radio.Button>
              <Radio.Button value="Found">Found</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Title" name="Title" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="Description"
            rules={[{ message: 'Please input!' }]}
          >
            <Input.TextArea />
          </Form.Item>


          <Form.Item
            label="Country"
            name="Country"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Select
              showSearch
              onChange={(val) => {
                setSelectedCountry(val);
                setSelectedState(null);
                form.setFieldsValue({ State: undefined, City: undefined });
              }}
              options={countryOptions}
            />
          </Form.Item>

          <Form.Item
            label="State"
            name="State"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Select showSearch options={stateOptions} onChange={(val) => {setSelectedState(val); form.setFieldsValue({City:undefined})}} disabled={!selectedCountryCode}/>
          </Form.Item>

          <Form.Item
            label="City"
            name="City"
            rules={[{ message: 'Please input!' }]}
          >
            <Select showSearch options={cityOptions} disabled={!selectedStateCode}/>
          </Form.Item>


          <Form.Item
            label="Pincode"
            name="Pincode"
            rules={[{ message: 'Please input!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date"
            name="Date"
            rules={[{ message: 'Please input!' }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Time"
            name="Time">
            <TimePicker format="HH:mm" />
          </Form.Item>

          {condition == 'lost' ? (
            <Form.Item
              label="Award"
              name="Award"
              rules={[{ message: 'Please input!' }]}
            >
              <Input />
            </Form.Item>
          ) : null}


          <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default CreatePost;