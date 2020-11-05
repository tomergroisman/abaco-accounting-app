import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Container, Grid } from '@material-ui/core';
import auth0 from '../../lib/auth0'
import { paymentMethodFetcher } from '../../helpers/fetchers'
import PageTitle from '../../components/PageTitle';
import EntryCard from '../../components/EntryCard';


export default function PaymentMethod(props) {
  const initialPaymentMethod = JSON.parse(props.paymentMethodList)
  const { popup } = props;
  const [entry, setEntry] = popup;
  const [paymentMethodList, setPaymentMethodList] = useState(initialPaymentMethod);
  const firstUpdate = useRef(true);

  /**
   * Fetch the relevand data frm the server
   */
  const fetchData = async () => {
    const { data } = await axios.get(`/api/paymentMethod`);
    setPaymentMethodList(data.methods);
  }

  /**
   * Delete a supplier from the server
   */
  const deleteMethod = async (_id) => {
    await axios.delete(`/api/paymentMethod?_id=${_id}`);
    fetchData();
  }

  /**
   * Re-fetch after a new entry was added to the database
   */
  useEffect(() => {
    if (!entry && !firstUpdate.current)
      fetchData();

    firstUpdate.current = false
  }, [entry]);

  // Render
  return (
      <Container maxWidth="md">
        <PageTitle>שיטות תשלום</PageTitle>
        <Grid container spacing={3}>
          {paymentMethodList.map(method => (
            <Grid item md={4} key={method._id}>
              <EntryCard
                _id={method._id}
                title={method.name}
                deleteEntry={deleteMethod}
                openForm={() => setEntry(["paymentMethod", method])}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
  )
}

export async function getServerSideProps(ctx) {
    const session = await auth0.getSession(ctx.req);
    return {
        props: {
            paymentMethodList: JSON.stringify(await paymentMethodFetcher(session))
        }
    }
}