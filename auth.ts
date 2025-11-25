import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
//import { saltAndHashPassword } from "@/utils/password"
// import { cookies } from "next/headers";


 
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
 
        // logic to verify if the user exists
        const user = {email: credentials.email as string, password: pwHash as string}; //await getUserFromDb(credentials.email, pwHash)

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