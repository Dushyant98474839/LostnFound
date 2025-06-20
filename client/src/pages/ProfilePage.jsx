import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../utils/AppContext';
import { createClient } from '@supabase/supabase-js';
import { Input, Button, Avatar, Form, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useCustomMessage } from '../utils/feedback';
import convertToPNG from '../utils/convertToPNG';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
const { Dragger } = Upload;

function ProfilePage() {
    const { notify, contextHolder } = useCustomMessage();
    const [form] = useForm();
    const { session } = useAuth();
    const [pubUrl, setPubUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loadingButton, setLoadingButton] = useState(false);
    const [isUsernameTaken, setUsernameTaken] = useState(false);

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

        if (data) {
            form.setFieldsValue(data);
        } else if (error) {
            notify.error("Error fetching Profile");
        }

        const { data: imageList, error: imgError } = await supabase
                        .storage
                        .from("profile-pics")
                        .list(`${session.user.id}`);

                    let imageUrl = null;
                    console.log("img", imageList)
                    if (!imgError && imageList?.length > 0) {
                        imageUrl = await Promise.all(
                            imageList.map((img) => {
                                const { data: publicUrl } = supabase
                                    .storage
                                    .from("profile-pics")
                                    .getPublicUrl(`${session.user.id}/${img.name}`);
                                setPubUrl(publicUrl.publicUrl)
                            })
                        );
                    }
                    
    };

    useEffect(() => {
        if (session?.user) {
            fetchProfile();

        }
    }, [session]);

    const handleUsernameChange = async (e) => {
        const username = e.target.value;
        const { data } = await supabase.from('profiles').select('username').eq('username', username).maybeSingle();

        if (data) {
            setUsernameTaken(true)
        } else {
            setUsernameTaken(false)
        }
    };

    const handleFinish = async (values) => {
        setLoadingButton(true);

        if (!session?.user) {
            notify.error("Session not ready yet.");
            setLoadingButton(false);
            return;
        }

        values.id = session.user.id;

        if (values.username && values.phone_no) {
            values.is_profile_complete = true;
            console.log('profile created')
        }

        if (selectedFile) {
            const uploadedPath = await uploadFile(selectedFile, session.user.id);
            if (!uploadedPath) {
                notify.error("Image Upload Failed");
                setLoadingButton(false);
                return;
            }
            values.profile_pic = uploadedPath;

            const { data: publicUrl } = supabase
                .storage
                .from('profile-pics')
                .getPublicUrl(uploadedPath);

            if (publicUrl?.publicUrl) {
                setPubUrl(`${publicUrl.publicUrl}?t=${Date.now()}`);
            }
        }
        console.log(values)
        const { error } = await supabase.from('profiles').upsert(values).eq('id', session.user.id);
        if (error) {
            notify.error("Profile Updation Failed");
        } else {
            notify.success("Profile updated Successfully");
        }

        setLoadingButton(false);
        setTimeout(()=>
    
        window.location.reload()
    )
    };

    const uploadFile = async (file, userId) => {
        let newfile=await convertToPNG(file);
        const ext = file.name.split('.').pop().toLowerCase();
        const filePath = `${userId}/profile_image_.${ext}`;

        const { error } = await supabase.storage
            .from('profile-pics')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            notify.error(error.message);
            return null;
        }

        return filePath;
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: true,
        beforeUpload(file) {
            console.log(file)
            setSelectedFile(file);
            // form.setFieldValue('profilepic', file); 
            return false; 
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                {session ? (
                    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
                        <Avatar className="border border-gray-200 mb-6" size={100} src={pubUrl} />
                        <Form layout="vertical" form={form} onFinish={handleFinish}>
                            <Form.Item label="Username" name="username" rules={[{ required: true }]} message={(isUsernameTaken)?"username taken":""}>
                                <Input onChange={handleUsernameChange} />
                            </Form.Item>

                            <Form.Item label="First Name" name="first_name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Last Name" name="last_name">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Phone Country Code" name="phone_country_code" rules={[{required:true}]}>
                                <Input placeholder="+91" />
                            </Form.Item>

                            <Form.Item label="Phone Number" name="phone_no" rules={[{required:true}]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Identity Proof" name="govt_id_url">
                                <Input />
                            </Form.Item>

                            <Form.Item label="Profile pic" name="profile_pic">
                                <Dragger {...uploadProps}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">
                                        Click or drag file to this area to upload
                                    </p>
                                    <p className="ant-upload-hint">
                                        Support for a single image file.
                                    </p>
                                </Dragger>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loadingButton}>
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                ) : (
                    <h1>Please Create an Account {session}</h1>
                )}
            </div>
        </>
    );
}

export default ProfilePage;
