import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
//import { saltAndHashPassword } from "@/utils/password"
// import { cookies } from "next/headers";

import { adminDb } from "@/lib/firebase-admin";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        //let user = null



        // logic to salt and hash password
        const pwHash = credentials.password //saltAndHashPassword(credentials.password)
        const usersRef = adminDb.collection("users");

        const q = usersRef.where("email", "==", credentials.email);
        const snapshot = await q.get();
        if (snapshot.empty) {
          
           throw new Error("Invalid ! credentials.");
        }

        if (pwHash !== snapshot.docs[0].data().password) {
          throw new Error("Invalid !!! credentials.")
        }

        
        const user = snapshot.docs[0].data();

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }

        //  (await cookies()).set('session', 'some_session_token_value', { httpOnly: true, secure: true, path: '/' });
        //console.log("Credentials received in authorize:", user)
        // return user object with their profile data
        return user
      },
    }),
  ],
})