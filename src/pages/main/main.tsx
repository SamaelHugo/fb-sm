import {getDocs, collection} from "firebase/firestore"
import {db} from "../../config/firebase";
import {useEffect, useState} from "react";
import {Post} from "./post";
import {PostType} from "./types";

export const Main = () => {
    const [postsList, setPostList] = useState<PostType[] | null>(null)
    const postRef = collection(db, "posts")

    const getPosts = async () => {
        const data = await getDocs(postRef)
        setPostList(data.docs.map((doc) => ({...doc.data(), id: doc.id})) as PostType[])
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <div>
        {postsList?.map((post) => (
            <Post post={post}/>
        ))}
    </div>)
}
