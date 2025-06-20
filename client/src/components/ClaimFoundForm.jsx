import { InboxOutlined } from '@ant-design/icons';
import { createClient } from '@supabase/supabase-js';
import { Form, Modal, Input, Upload, Button } from 'antd'
import React, { useState } from 'react'
import { useAuth } from '../utils/AppContext';
import { useCustomMessage } from '../utils/feedback';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const { Dragger } = Upload;

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


function ClaimFoundForm({ status, post_id, user_id , type}) {

    const [form] = Form.useForm();
    const [isLoading, setisLoading] = useState(false);
    const [isSubmitted, setisSubmitted] = useState(false);
    const [imageListPost, setImageListPost] = useState([]);
    const { notify, contextHolder } = useCustomMessage()
    const [isDisabled, setisDisabled]=useState(false)

    const handleSubmit = async (values) => {
        setisLoading(true)
        setisDisabled(true)
        values.post_id = post_id
        values.user_id = user_id
        values.image_count = imageListPost.length;
        values.type=status
        delete values.Image;
        console.log(values)

        const { data, error } = await supabase.from("ClaimFound").upsert(values).select();

        if (error) {
            setisDisabled(false)
            return notify.error(`Failed to save post: ${error.message}`);
        }
        console.log(data)
        const claim_id = `${data?.[0]?.post_id}${data?.[0].user_id}`;
        if (!claim_id) {
            setisDisabled(false)
            return notify.error('Failed to retrieve post ID');
        }
        else{

            const {error}=await uploadFile(imageListPost, claim_id);
            console.log(error)
            if(error){
                setisDisabled(false)
               return  notify.error(error.message);
            }
        }

        notify.success('Post and images saved successfully!');



        // setisLoading(false)
        // setTimeout(()=>{
        //   navigate("/home")
        // },3000)
        setisSubmitted(true)
        setisDisabled(true)
        setisLoading(false)
    }
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

    const uploadFile = async (imageList, claim_id) => {
        if (!imageList || imageList.length === 0) {
            return true;
        }

        for (let i = 0; i < imageList.length; i++) {
            const file = imageList[i]?.originFileObj;
            if (!file) {
                notify.error(`Invalid file at index ${i}`);
                throw new Error(`Invalid file at index ${i}`);
            }

            const filePath = `${claim_id}/proof_image_${i}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage
                .from('proof-pics')
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









    return (
        <div>   
            {contextHolder}
            <div className='flex flex-col md:flex-row gap-8'>

                <Form
                    className="shadow-md w-full md:w-[65%]"
                    {...formItemLayout}
                    form={form}
                    variant={'outlined'}
                    style={{
                        padding: 15,
                        borderRadius: 10,
                        width: '100%',
                        maxWidth: '100%',
                        ...(window.innerWidth >= 768 && { width: '65%' })
                    }}
                    onFinish={handleSubmit}
                >


                    <Form.Item label="Proof" name="proof" rules={[{ required: true }]}>
                        <Input.TextArea style={{ height: 200 }} />
                    </Form.Item>


                    <Form.Item label="Location" name="location" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Image"
                        name="Image"
                        rules={[{ required: true, message: 'Please upload an image' }]}
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
                        <Button type="primary" htmlType="submit" loading={isLoading} disabled={isDisabled}>
                            {!isSubmitted ?
                                ("Submit") : "Submitted"
                            }
                        </Button>
                    </Form.Item>
                </Form>

                <div className='flex flex-col bg-white rounded-2xl shadow-sm p-4 w-[100%] md:w-[35%]'>

                    <h1 className='font-semibold text-center text-lg'>Other users who {status == "found" ? "claimed" : "found"}</h1>

                </div>
            </div>
        </div>
    )
}

export default ClaimFoundForm