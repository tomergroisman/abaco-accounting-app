import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Container, Grid } from '@material-ui/core';
import auth0 from '../../lib/auth0'
import { categoriesFetcher } from '../../helpers/fetchers'
import PageTitle from '../../components/PageTitle';
import EntryCard from '../../components/EntryCard';


export default function Customers(props) {
  const initialCategoryList = JSON.parse(props.categoryList)
  const { popup } = props;
  const [entry, setEntry] = popup;
  const [categoryList, setCategoryList] = useState(initialCategoryList);
  const firstUpdate = useRef(true);

  /**
   * Fetch the relevand data frm the server
   */
  const fetchData = async () => {
    const res = await axios.all([
        axios.get(`/api/category?type=income`),
        axios.get(`/api/category?type=expense`)
    ]);
    setCategoryList({
        income: res[0].data.categories,
        expense: res[1].data.categories
    });
  }

  /**
   * Delete a supplier from the server
   */
  const deleteCategory = async (_id) => {
    await axios.delete(`/api/category?_id=${_id}`);
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
        <PageTitle>קטגוריות</PageTitle>
        <h5>הכנסות</h5>
        <Grid container spacing={3}>
          {categoryList.income.map(category => (
            <Grid item md={4} key={category._id}>
              <EntryCard
                _id={category._id}
                title={category.name}
                deleteEntry={deleteCategory}
                openForm={() => setEntry(["category", category])}
              />
            </Grid>
          ))}
        </Grid>
        <h5>הוצאות</h5>
        <Grid container spacing={3}>
          {categoryList.expense.map(category => (
            <Grid item md={4} key={category._id}>
              <EntryCard
                _id={category._id}
                title={category.name}
                deleteEntry={deleteCategory}
                openForm={() => setEntry(["category", category])}
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
            categoryList: JSON.stringify(await categoriesFetcher(session))
        }
    }
}