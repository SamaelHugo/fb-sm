import {useForm} from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup";
import {addDoc, collection} from "firebase/firestore"
import {auth, db} from "../../config/firebase"
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";


interface createFormData {
    title: string
    description: string
}

export const CreateForm = () => {
    const [user] = useAuthState(auth)
    const navigate = useNavigate()

    const schema = yup.object().shape({
        title: yup.string().required("You must add a title"),
        description : yup.string().required("You must add a description").max(150),
    })

    const {register, handleSubmit, formState: {errors}} = useForm<createFormData>({
        resolver: yupResolver(schema)
    })

    const postsRef = collection(db, "posts")

    const onCreatePost = async (data: createFormData) => {
        await addDoc(postsRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid,
        })

        navigate("/")
    }

    return (
        <div className="create-post">
            <form action="" onSubmit={handleSubmit(onCreatePost)} className="form">
                <input type="text" placeholder="Title..." {...register("title")} />
                <p style={{color: "darkred"}}>{errors.title?.message}</p>
                <textarea placeholder="Description ..." {...register("description")}/>
                <p style={{color: "darkred"}}>{errors.description?.message}</p>
                <input type="submit" className="submitForm"/>
            </form>
        </div>
    )
}