import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import auth0 from '../../lib/auth0';
import { businessFetcher } from '../../helpers/fetchers';
import { setBusiness } from '../../hooks/businessHooks';
import GridText from '../../components/GridRows/GridText';
import GridPhone from '../../components/GridRows/GridPhone';
import GridAddress from '../../components/GridRows/GridAddress';
import GridFile from '../../components/GridRows/GridFile';
import Loader from '../../components/Loader';

export default function MyBusiness(props) {
    const businessInfo = JSON.parse(props.businessInfo);
    const [name, address, phone, email, logo, edit,
        handleChange, edits] = setBusiness(businessInfo);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    /**
     * Generate a form data object from the data to upload
     */
    const toFormData = () => {
        let formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("logo", logo);
        return formData;
    }
    
    /**
     * Hanfle submit function
     */
    const handleSubmit = async () => {
        setLoading(true);
        await axios.put("/api/business", toFormData())
        router.push("/");
    }

    if (loading) return <Loader />
    return (
        <Container maxWidth="md">
            <Grid container spacing={3}>
                <Grid item xs={2}>
                    <Typography variant="h6" gutterBottom>
                        שם  העסק
                    </Typography>
                </Grid>
                <GridText
                    inEdit={edit.name}
                    name="name"
                    value={name}
                    handleChange={handleChange}
                    edits={{end: () => edits.end("name"), start: () => edits.start("name")}}
                    valid={{validators: ["required"], errorMessages: ["שדה חובה"]}}
                />
                <Grid item xs={2}>
                    <Typography variant="h6" gutterBottom>
                        כתובת
                    </Typography>
                </Grid>
                <GridAddress
                    inEdit={edit.address}
                    name="address"
                    value={address}
                    handleChange={handleChange}
                    edits={{end: () => edits.end("address"), start: () => edits.start("address")}}
                />
                <Grid item xs={2}>
                    <Typography variant="h6" gutterBottom>
                        טלפון
                    </Typography>
                </Grid>
                <GridPhone
                    inEdit={edit.phone}
                    name="phone"
                    value={phone}
                    handleChange={handleChange}
                    edits={{end: () => edits.end("phone"), start: () => edits.start("phone")}}
                    valid={{validators: ["matchRegexp:^[0-9]*$"], errorMessages: ["מספר טלפון לא חוקי"]}}
                />
                <Grid item xs={2}>
                    <Typography variant="h6" gutterBottom>
                        מייל
                    </Typography>
                </Grid>
                <GridText
                    inEdit={edit.email}
                    name="email"
                    value={email}
                    handleChange={handleChange}
                    edits={{end: () => edits.end("email"), start: () => edits.start("email")}}
                    valid={{validators: ["isEmail"], errorMessages: ["כתובת אימייל לא חוקית"]}}
                />
                <Grid item xs={2}>
                    <Typography variant="h6" gutterBottom>
                        לוגו
                    </Typography>
                </Grid>
                <GridFile
                    inEdit={edit.logo}
                    name="logo"
                    value={{ current: logo, initial: businessInfo.logo }}
                    handleChange={handleChange}
                    edits={{end: () => edits.end("logo"), start: () => edits.start("logo")}}
                />
            </Grid>

            <Button onClick={handleSubmit} variant="contained">שמור</Button>
        </Container>
    )
}

export async function getServerSideProps(ctx) {
    const session = await auth0.getSession(ctx.req);
    return {
        props: {
          businessInfo: JSON.stringify(await businessFetcher(session))
        }
    }
}