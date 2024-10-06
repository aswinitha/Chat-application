
 import { initializeApp } from "firebase/app";
  import {  getAuth,signInWithEmailAndPassword,sendPasswordResetEmail,signOut,createUserWithEmailAndPassword} from "firebase/auth";
 import { getFirestore,setDoc,doc } from "firebase/firestore";
 import { toast } from "react-toastify";



const firebaseConfig = {
  apiKey: "AIzaSyARUdRbw5DpGsNaz2IIr5s4sU9ZFzSKcIM",
  authDomain: "chat1-app-gs.firebaseapp.com",
  projectId: "chat1-app-gs",
  storageBucket: "chat1-app-gs.appspot.com",
  messagingSenderId: "1084814298329",
  appId: "1:1084814298329:web:b5ed76f5cadd811637c2c8"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password) => {
    try{
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const  user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey,There i am using chat app",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatsData:[]
        })
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(""));
    }
}
     const login = async (email,password) => {
     try{
        await signInWithEmailAndPassword(auth,email,password);

    }catch (error){
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(""));
    }
 

}

const logout =async () =>{
    try{
         await signOut(auth)
        }catch (error){
            console.error(error);
            toast.error(error.code.split('/')[1].split('-').join(""));
        }
  
 }
const resetPass = async (email) => {
    if(!email){
        toast.error("Enter your email");
        return null;
    }
    try {
      const userRef =collection(db,'users') ;
      const q = query(userRef,where("email","==",email))
      const querySnap = await getDocs(q);
      if(!querySnap.empty){
        await sendPasswordResetEmail(auth,email);
        toast.success("Reset Email Sent")
      }
      else{
        toast.error("Email doesn't exists")
      }
    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }
}

 export {signup,login,logout,resetPass,db,auth}