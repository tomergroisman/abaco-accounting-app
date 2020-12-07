import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Container, Grid } from '@material-ui/core';
import auth0 from '../../lib/auth0'
import { suppliersFetcher } from '../../helpers/fetchers'
import PageTitle from '../../components/PageTitle';
import EntryCard from '../../components/EntryCard';
import Loader from '../../components/Loader'


export default function Suppliers(props) {
  const initialSuppliersList = JSON.parse(props.suppliersList)
  const { popup } = props;
  const [entry, setEntry] = popup;
  const [suppliersList, setSuppliersList] = useState(initialSuppliersList);
  const firstUpdate = useRef(true);

  /**
   * Fetch the relevand data frm the server
   */
  const fetchData = async () => {
    const { data } = await axios.get(`/api/supplier`);
    setSuppliersList(data.suppliers);
  }

  /**
   * Delete a supplier from the server
   */
  const deleteSupplier = async (_id) => {
    await axios.delete(`/api/supplier?_id=${_id}`);
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
        <PageTitle>ספקים</PageTitle>
        { !suppliersList ? <Loader /> :
        <Grid container spacing={3}>
          {suppliersList.map(supplier => (
            <Grid item md={4} sm={6} xs={12} key={supplier._id}>
              <EntryCard
                _id={supplier._id}
                title={supplier.name}
                deleteEntry={deleteSupplier}
                openForm={() => setEntry(["supplier", supplier])}
              />
            </Grid>
          ))}
          <Grid item md={4} sm={6} xs={12}>
            <EntryCard
              openForm={() => setEntry("supplier")}
              isAdd
            />
          </Grid>
        </Grid> }
      </Container>
  )
}

export async function getServerSideProps(ctx) {
  const session = await auth0.getSession(ctx.req);
  return {
      props: {
        suppliersList: JSON.stringify(await suppliersFetcher(session))
      }
  }
}