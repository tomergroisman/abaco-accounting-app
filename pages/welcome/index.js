import React from 'react';
import axios from 'axios';
import auth0 from '../../lib/auth0';

export default function Welcome() {
    return (
        <div>
            <h1>Hello</h1>
        </div>
    )
}

// export async function getServerSideProps(ctx) {
//     const session = await auth0.getSession(ctx.req);
//     if (session) {
//       const userInfo = await axios.get(`https://squid-productions.eu.auth0.com/api/v2/users/${session.user.sub}`, {
//         headers: {
//           authorization: 'Bearer ' + process.env.AUTH0_API_ACCESS_TOKEN
//         }
//        });
//        const { logins_count } = userInfo.data;
//        if (logins_count !== 1) {
//         ctx.res.writeHead(301, {
//           Location: '/'
//         });
//         ctx.res.end();
//         return null
//        }
//     }
//     return null;
//   }