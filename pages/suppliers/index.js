import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Container, Grid } from '@material-ui/core';
import PageTitle from '../../components/PageTitle';
import EntryCard from '../../components/EntryCard';
import Loader from '../../components/Loader'


export default function Suppliers(props) {
  const { popup } = props;
  const [entry, setEntry] = popup;
  const [suppliersList, setSuppliersList] = useState(null);

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

  /** Re-render after entry change */
  useEffect(() => {
    fetchData();
  }, [entry]);

  // Render
  return (
      <Container maxWidth="md">
        <PageTitle>ספקים</PageTitle>
        { !suppliersList ? <Loader /> :
        <Grid container spacing={3}>
          {suppliersList.map((supplier, i) => (
            <Grid item md={4} key={supplier._id}>
              <EntryCard
                _id={supplier._id}
                title={supplier.name}
                deleteEntry={deleteSupplier}
                openForm={() => setEntry(["supplier", supplier])}
              />
            </Grid>
          ))}
        </Grid> }
      </Container>
  )
}