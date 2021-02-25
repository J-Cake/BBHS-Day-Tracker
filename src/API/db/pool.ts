import {Pool, PoolClient} from 'pg';

const pool: Pool = new Pool();

const clients: {
    User: PoolClient | Promise<PoolClient>
} = {
    User: pool.connect().then((client: PoolClient): PoolClient => clients.User = client) // The User Client. Used by all operations relating to users
};

export default clients;
