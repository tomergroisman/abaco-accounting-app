import React from 'react';
import { useRouter } from 'next/router'
import DefaultErrorPage from 'next/error';
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import auth0 from '../../lib/auth0';
import { formaDateToShow, downloadPdf, getUser, noEmail, emailSent} from '../../helpers/functions';
import { incomeFetcher } from '../../helpers/fetchers'
import { useStyles } from '../../styles/pages/showStyles';
import EmailButton from '../../components/EmailButton'

export default function ShowIncome(props) {
    const { userId, _id, setAlertStatus } = props;
    const income = JSON.parse(props.income);
    const classes = useStyles(props);
    const router = useRouter();

    // Render
    if (!income) return <DefaultErrorPage statusCode={404} />
    return (
        <div>
            <Container className={classes.container} maxWidth='md'>
                <Grid container spacing={3}>
                    <Grid item md={12}>
                        <p className={classes.noMargin}><strong>מספר קבלה:</strong> {income.invoice_number}</p>
                    </Grid>
                    <Grid item md={3}>
                        <p className={classes.noMargin}><strong>לקוח:</strong> {income.customer}</p>
                    </Grid>
                    <Grid item md={6}></Grid>
                    <Grid item md={3}>
                        <p className={classes.noMargin}><strong>תאריך:</strong> {formaDateToShow(income.date)}</p>
                    </Grid>
                    <Grid item md={12}>
                        <TableContainer className={classes.tableContainer}>
                            <Table>
                                <TableHead>
                                    <TableRow className={classes.tableHead}>
                                        <TableCell>#</TableCell>
                                        <TableCell>פירוט</TableCell>
                                        <TableCell>מחיר ליחידה</TableCell>
                                        <TableCell>כמות</TableCell>
                                        <TableCell>סה"כ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    { income.items.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>{item.price_per_unit}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.sum}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell rowSpan={5} className={classes.noBottomCell}/>
                                        <TableCell rowSpan={5} className={classes.noBottomCell}/>
                                        <TableCell colSpan={2}>סה"כ לפני מע"מ</TableCell>
                                        <TableCell>{income.sum_before_vat}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>מע"מ</TableCell>
                                        <TableCell>{income.vat}%</TableCell>
                                        <TableCell>{income.vat_amount}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.noBottomCell} colSpan={2}>סה"כ כולל מע"מ</TableCell>
                                        <TableCell className={classes.noBottomCell}>{income.total}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.seperatorCell} colSpan={3}></TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell className={classes.noBottomCell} colSpan={2}>שיטת תשלום</TableCell>
                                        <TableCell className={classes.noBottomCell}>{income.payment_method}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                <div className={classes.metadata}>
                    <p><strong>קטגוריה:</strong> {income.category}</p>
                    <p><strong>אסמכתא:</strong> {income.reference}</p>
                    <p><strong>הערות:</strong> {income.comments}</p>
                </div>

                <div className={classes.buttonConteiner}>
                    <EmailButton
                        user={ userId }
                        invoiceId= { _id }
                        variant="contained"
                        noEmail={() => noEmail(setAlertStatus)}
                        onSuccess={() => emailSent(setAlertStatus)}
                    />
                    <Button onClick={() => downloadPdf(income.invoice_number)} variant="contained" size="large" color="primary">הורד חשבונית</Button>
                    <Button onClick={() => router.back()} variant="contained" size="large" color="primary">חזור</Button>
                </div>
            </Container>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const session = await auth0.getSession(ctx.req);
    const userId = getUser(session);

    const { _id } = ctx.query;
    return {
        props: {
            income: JSON.stringify(await incomeFetcher(session, _id)),
            userId,
            _id
        }
    }
}