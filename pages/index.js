import React from 'react';
import Container from '@material-ui/core/Container';
import auth0 from '../lib/auth0';
import { transactionsFetcher } from '../helpers/fetchers';
import TransactionsTable from '../components/TransactionsTable';

export default function Home(props) {
  const { width } = props;
  const transactions = JSON.parse(props.transactions);

  return (
    <Container maxWidth="md">
      <TransactionsTable width={width} transactions={transactions} />
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const session = await auth0.getSession(ctx.req);
  return {
      props: {
          transactions: JSON.stringify(await transactionsFetcher(session))
      }
  }
}