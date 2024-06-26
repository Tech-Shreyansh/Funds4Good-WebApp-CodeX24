"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ProgressBar from './ProgressBar';
import BaseUrl from '@/lib/BaseUrl';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Post {
    loanRequestId: string;
    name: string;
    zipcode: string;
    bio: string;
    occupation: string;
    income: string;
    idDetails: string;
    idNumber: string;
    imageUploaded: string;
    loanAmount: number;
    loanCategory: string;
    timeDuration: string;
    loanDescription: string;
    repaymentStartDate: string;
    emiRepetition: string;
    userId: string;
    raising: number;
    createdAt: string;
    bookMarked : boolean;
    receiverId: string
}

const Post = () => {
    const navItems = [
        { name: "All" },
        { name: "Women and Children" },
        { name: "Startup" },
        { name: "Potential Borrowers" }
    ];
    const router = useRouter()

    const [progress, setProgress] = useState(50);
    const [name, setName] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            console.error("Access token not found. User not authenticated.");
            return;
        }
        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        };

        BaseUrl.get("/api/loans/getAll",config)
            .then((response) => {
                console.log(response.data)
                if (response.status === 200) {
                    setPosts(response.data)
                } else {
                    throw new Error("Failed to fetch posts");
                }
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
            });

        const storedName = localStorage.getItem("name");
        setName(storedName);
    }, []);

    const handleBookmark = async (postId: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("Access token not found");

            const response = await BaseUrl.post(`/api/loans/bookMark/${postId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*'
                }
            });

            if (response.status === 200) {
                toast.success("Bookmark Toggled successfully");
                // Optionally, you can update the state to reflect the changes in real-time
            } else {
                throw new Error("Failed to bookmark post");
            }
        } catch (error) {
            console.error("Error bookmarking post:", error);
        }
    };

    return (
        <div className="flex flex-col items-start justify-around gap-8 p-8">
            <p className="text-[#4F46E5] text-3xl">Welcome {name ? name.charAt(0).toUpperCase() + name.slice(1) : ""}!</p>
            <div className="flex items-start justify-between gap-6">
                {navItems.map((item, index) => (
                    <button key={index} className="rounded-full px-4 py-2 text-black border-2 border-gray-300 hover:bg-[#4F46E5] hover:text-white">{item.name}</button>
                ))}
            </div>
            {posts.map((post, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg w-full shadow-md p-4 mb-4 flex flex-col justify-between">
                    <div className="flex items-center mb-4 justify-between">
                        <span className="text-black font-bold">{post.name}</span>
                        <p>{post.bookMarked}</p>
                        {post.bookMarked ?<BookmarkIcon fill='black' onClick={() => handleBookmark(post.loanRequestId)} className='cursor-pointer' /> :<BookmarkIcon onClick={() => handleBookmark(post.loanRequestId)} className='cursor-pointer' />}
                    </div>
                    <p className="text-gray-800 mb-4">{post.loanDescription}</p>
                    <Image src={`https://funds4good.pranavbisaria.live${post.imageUploaded}`} alt="Post" className="w-full mb-4 rounded-lg" width={600} height={400}/>
                    <div className="flex items-start gap-6 mb-6">
                        <div>Amount: <span className="text-[#808080]">{post.loanAmount}</span></div>
                        <div>Type: <span className="text-[#808080]">{post.loanCategory}</span></div>
                        <div>Duration: <span className="text-[#808080]">{post.repaymentStartDate}</span></div>
                    </div>
                    <div className="mb-6"> <ProgressBar progress={progress} /></div>
                    <div className="flex items-start justify-between gap-6 mb-6">
                        <div>Raising: <span className="text-[#51DA21]">{post.loanAmount}</span></div>
                    </div>
                    <div className="flex items-start gap-4 justify-around">
                        <Button onClick={()=>{ router.push("postDescription"); localStorage.setItem("requestid",post.loanRequestId) }} className="text-center border-2 border-[#D9D9D9] text-black px-6 py-3 w-1/2 h-12 rounded-md">Read More</Button>
                        <Button onClick={()=>{ router.push("postDescription"); localStorage.setItem("requestid",post.loanRequestId) }} className="text-center bg-[#4F46E5] text-white px-6 py-3 w-1/2 h-12 rounded-md">Support</Button>
                    </div>
                    <ToastContainer />
                </div>
            ))}
        </div>
    );
};

export default Post;
