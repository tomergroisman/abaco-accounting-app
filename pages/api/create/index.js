import { createUser } from '../../../helpers/functions';

/**
 * Check if connection is an Auth0 authenticated
 */
function checkAuthentication(reqConnection) {
    const connections = process.env.AUTH0_CONNECTIONS;
    const currentConnection = connections.filter(connection => {
        const isAuth =
            connection.id == reqConnection.id &&
            connection.name == reqConnection.name &&
            connection.tenant == reqConnection.tenant;
        return isAuth;
    })[0];
    return currentConnection;
}

export default async function create(req, res) {
    let isAuth;

    try {
        const { connection } = req.body.context;
        isAuth = checkAuthentication(connection);
    } catch {
        isAuth = false;
    }

    if (isAuth) {
        const { user } = req.body;
        createUser(user.id);
        res.status(200).send("Success");
    }
    else {
        res.status(200).send("Not authenticated");
    }
}