import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js';
import { useCustomMessage } from '../utils/feedback';
import Cards from '../components/Cards';
import { useAuth } from '../utils/AppContext';
import { Avatar, Button, Modal } from 'antd';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function PostPage() {
    const { postId } = useParams();
    const [postData, setPostData] = useState(null);
    const { notify, contextHolder } = useCustomMessage();
    const [usersList, setUsersList] = useState([])
    const { session } = useAuth()
    const [status, setStatus] = useState()
    const [userClaims, setUserClaims] = useState([]);
    const [selecteduserid, setselectedUserid] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [validUser, setvalidUser] = useState(false)
    const [isResolved, setisResolved] = useState(false)
    const navigate = useNavigate()

    const handleDelete = async (postId, user_id) => {
        console.log(user_id, "  ", postId)
        const { error } = await supabase.from("ClaimFound").delete().eq("user_id", user_id).eq("post_id", postId)
        if (error) return notify.error(error.message)
        notify.success(`Successfully Removed`)
        window.location.reload()
    }

    useEffect(() => {
        const fetchUserClaimList = async () => {
            const { data, error } = await supabase
                .from("ClaimFound")
                .select("*")
                .eq("post_id", postId);

            if (error) {
                return notify.error(error.message);
            }
            console.log("data", data)
            const claimsWithImages = await Promise.all(
                data.map(async (claim) => {
                    // console.log(`${claim.post_id}${claim.user_id}`)
                    const { data: imageList, error: imgError } = await supabase
                        .storage
                        .from("proof-pics")
                        .list(`${claim.post_id}${claim.user_id}`);

                    let imageUrls = [];
                    console.log("img", imageList)
                    if (!imgError && imageList?.length > 0) {
                        imageUrls = await Promise.all(
                            imageList.map((img) => {
                                const { data: publicUrl } = supabase
                                    .storage
                                    .from("proof-pics")
                                    .getPublicUrl(`${claim.post_id}${claim.user_id}/${img.name}`);
                                return publicUrl.publicUrl;
                            })
                        );
                    }

                    return {
                        ...claim,
                        images: imageUrls
                    };
                })
            );

            setUserClaims(claimsWithImages);
        };

        fetchUserClaimList();
    }, [postId, session]);

    const handleInteraction = async (userId) => {
        const { error } = await supabase.from("posts").update({ resolved: true }).eq("id", postId)
        if (error) return notify.error(error.message)
        else {
            if (status == 'lost') {
                const { error } = await supabase.from("posts").update({ found_by_finally: userId }).eq("id", postId)
                if (error) return notify.error(error.message)
                else {
                    const { data: profileData, error: pointsError } = await supabase
                        .from("profiles")
                        .select("points")
                        .eq("id", userId)
                        .single();

                    if (pointsError) {
                        return notify.error(pointsError.message);
                    }

                    const updatedPoints = (profileData?.points ?? 0) + 1;

                    const { error: updateError } = await supabase
                        .from("profiles")
                        .update({ points: updatedPoints })
                        .eq("id", userId);

                    if (updateError) {
                        return notify.error(updateError.message);
                    }

                }
            }
            else {
                const { error } = await supabase.from("posts").update({ handed_over: userId }).eq("id", postId)
                if (error) return notify.error(error.message)
                else {
                    const { data: profileData, error: pointsError } = await supabase
                        .from("profiles")
                        .select("points")
                        .eq("id", session?.user?.id)
                        .single();

                    if (pointsError) {
                        return notify.error(pointsError.message);
                    }

                    const updatedPoints = (profileData?.points ?? 0) + 1;

                    const { error: updateError } = await supabase
                        .from("profiles")
                        .update({ points: updatedPoints })
                        .eq("id", session?.user?.id);

                    if (updateError) {
                        return notify.error(updateError.message);
                    }
                }
            }
        }
        notify.success("Finished Process, Item resolved!")
        setTimeout(() => {
            window.location.reload()
        }, 1500)
    }

    useEffect(() => {
        const fetchUserClaims = async () => {
            const { data, error } = await supabase.from("ClaimFound").select("*").eq("post_id", postId);
            if (error) {
                return notify.error(error.message)
            }
            // console.log(data)
            const usersArr = await Promise.all(data.map(async (obj, i) => {
                const { data, error } = await supabase.from("profiles").select("*").eq("id", obj.user_id).single();
                return data
            }))
            console.log("fdsfd,", usersArr)
            setUsersList(usersArr)

        }
        fetchUserClaims()
    }, [session])

    useEffect(() => {
        const fetchPostData = async () => {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", postId)
                .single();

            if (error || !data) {
                notify.error(error?.message || "Post not found");
                setPostData(undefined);
            } else {
                setStatus(data.type)
                setisResolved(data.resolved)
                setPostData(data);
                console.log("fadskfnadkfnakjdsfn", data.user_id == session.user.id)
                if (!(data.user_id == session.user.id)) {
                    navigate("/home")
                }
            }
        };

        fetchPostData();
    }, [postId, session]);

    if (postData === undefined) {
        return (
            <div>
                {contextHolder}
                <Navbar />
                <div className="text-center mt-10 text-red-500 text-lg">Post not found</div>
            </div>
        );
    }

    return (

        <div>
            {contextHolder}
            <Navbar />
            {!postData ? (
                <div className="text-center mt-10 text-gray-500 text-lg">Loading post...</div>
            ) : (
                <div className='w-[80%] mx-auto'>
                    <Cards obj={postData} displayOptions={true} details={true} userposts={true} canBeDeleted={isResolved} />

                    <div className='flex flex-col bg-white rounded-2xl shadow-sm p-4 w-[100%]  md:w-[100%]'>

                        <h1 className='font-semibold text-center text-lg'>Other users who {status == "found" ? "claimed" : "found"}</h1>

                        <div className='flex flex-col md:flex-row gap-2 w-full items-center'>
                            <div className='w-[100%] flex flex-col gap-2 w-[30%]'>
                                {usersList.map((obj, i) => {
                                    return (

                                        <div className={`flex flex-row ${(obj.id == postData.handed_over || obj.id == postData.found_by_finally) && `bg-amber-300`} justify-between items-center p-2 shadow-sm rounded`}>
                                            <div className='flex flex-row gap-2 items-center'>
                                                <Avatar className="border border-gray-200" src={`${import.meta.env.VITE_PROFILE_PIC_URL}${obj.profile_pic}`} />
                                                <h1 className='font'>{obj.username}</h1>
                                            </div>
                                            <div className='flex flex-row items-center'>
                                                <Button color="primary" variant="text" size='small' onClick={() => { setselectedUserid(obj.id) }}>
                                                    View
                                                </Button>
                                                <Button color="danger" variant="text" size='small' disabled={isResolved} onClick={() => { handleDelete(postId, obj.id) }}>
                                                    Delete
                                                </Button>
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                            <div className='w-full md:w-[70%] flex flex-col gap-4'>
                                {userClaims.map((claim, i) => (
                                    (claim.user_id == selecteduserid) ?

                                        <div key={i} className='rounded-lg p-4 shadow-sm flex flex-col gap-2'>
                                            {/* <h2 className='font-semibold mb-2'>User ID: {claim.user_id}</h2> */}
                                            <p><span className='font-medium flex flex-wrap'>Location:</span> {claim.location}</p>
                                            <p><span className='font-medium'>Proof:</span> {claim.proof}</p>
                                            <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mt-2'>
                                                {claim.images.map((url, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={url}
                                                        alt="proof-img"
                                                        className='rounded-lg object-cover h-32 w-full shadow-sm cursor-pointer hover:scale-105 transition-transform duration-200'
                                                        onClick={() => {
                                                            setModalImage(url);
                                                            setIsModalOpen(true);
                                                        }}
                                                    />

                                                ))}
                                            </div>
                                            <Button type="primary" className='mt-4' disabled={isResolved} onClick={() => { handleInteraction(selecteduserid) }}>{(status == 'found') ? `Hand Over` : `Claim Your Item`}</Button>
                                        </div> : ""

                                ))}
                            </div>


                        </div>
                    </div>

                </div>



            )}
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
            >
                <img src={modalImage} alt="Full View" className="w-full h-auto rounded" />
            </Modal>


        </div>
    );
}

export default PostPage
