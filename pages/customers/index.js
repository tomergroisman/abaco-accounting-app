import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Container, Grid } from '@material-ui/core';
import auth0 from '../../lib/auth0'
import { customersFetcher } from '../../helpers/fetchers'
import PageTitle from '../../components/PageTitle';
import EntryCard from '../../components/EntryCard';


export default function Customers(props) {
  const initialCustomersList = JSON.parse(props.customersList)
  const { popup } = props;
  const [entry, setEntry] = popup;
  const [customersList, setCustomersList] = useState(initialCustomersList);
  const firstUpdate = useRef(true);

  /**
   * Fetch the relevand data frm the server
   */
  const fetchData = async () => {
    const { data } = await axios.get(`/api/customer`);
    setCustomersList(data.customers);
  }

  /**
   * Delete a supplier from the server
   */
  const deleteCustomer = async (_id) => {
    await axios.delete(`/api/customer?_id=${_id}`);
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
        <PageTitle>לקוחות</PageTitle>
        <Grid container spacing={3}>
          {customersList.map(customer => (
            <Grid item md={4} key={customer._id}>
              <EntryCard
                _id={customer._id}
                title={customer.name}
                deleteEntry={deleteCustomer}
                openForm={() => setEntry(["customer", customer])}
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
            customersList: JSON.stringify(await customersFetcher(session))
        }
    }
}