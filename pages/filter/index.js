import React from 'react';
import Container from '@material-ui/core/Container';
import auth0 from '../../lib/auth0';
import Bar from '../../components/FilterBar/Bar';
import { customersFetcher, suppliersFetcher ,transactionsFetcher } from '../../helpers/fetchers';
import TransactionsTable from '../../components/TransactionsTable';
import { setFilter } from '../../hooks/filterHooks'

export default function Filter(props) {
    const { width } = props;
    const { transactions, fields, loading,
        handleChange } = setFilter(JSON.parse(props.transactionsList));
    const customers = JSON.parse(props.customersList);
    const suppliers = JSON.parse(props.suppliersList);

    return (
        <Container maxWidth="md">
            <Bar
                fields={fields}
                handleChange={handleChange}
                lists={{
                    customers,
                    suppliers
                }}
            />
            
            <TransactionsTable width={width} transactions={transactions} filter loading={loading} />
        </Container>
    )
}

export async function getServerSideProps(ctx) {
    const session = await auth0.getSession(ctx.req);
    return {
        props: {
            transactionsList: JSON.stringify(await transactionsFetcher(session)),
            customersList: JSON.stringify(await customersFetcher(session, "name")),
            suppliersList: JSON.stringify(await suppliersFetcher(session, "name")),
        }
    }
}