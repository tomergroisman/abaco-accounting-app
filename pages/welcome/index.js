import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import StepWizard from 'react-step-wizard';
import { toFormData } from '../../helpers/functions';
import { setBusiness } from '../../hooks/businessHooks';
import Step1 from '../../components/WelcomeWizard/Step1';
import Step2 from '../../components/WelcomeWizard/Step2';
import Loader from '../../components/Loader';
import { useStyles } from '../../styles/components/WelcomeWizardStyles';

export default function Welcome() {
    const [name, address, phone, email, logo, edit,
        handleChange, edits, deleteFields] = setBusiness();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const classes = useStyles();
    const transitions = {
        enterRight: classes.enterRight,
        enterLeft: classes.enterLeft,
        exitRight: classes.exitRight,
        exitLeft: classes.exitLeft,
    }
    
    /**
     * Submit the form
     */
    const handleSubmit = async () => {
        const data = {
            name,
            address,
            phone,
            email,
            logo
        }
        await axios.put("/api/business", toFormData(data));
        router.push("/");
    }

    /**
     * Skip selected fields
     * Submit the form without the selected fields
     */
    const handleSkip = async (fields) => {
        deleteFields(fields);
        handleSubmit();
    }

    useEffect(() => {
        if (loading)
            handleSubmit()
    }, [loading])

    // Render
    return (
        <Container maxWidth="md" className={classes.root}>
            {loading ? 
            <Loader /> :
            <div>
                <Typography gutterBottom variant="h2">רגע אחד לפני שמתחילים...</Typography>
                <StepWizard transitions={transitions}>
                <Step1
                    name={name}
                    handleChange={handleChange}
                />
                <Step2
                    handleSubmit={() => setLoading(true)}
                    handleChange={handleChange}
                    handleSkip={handleSkip}
                    fullAddress={address}
                    fullPhone={phone}
                    email={email}
                    logo={logo}
                />
            </StepWizard>
            </div> }
        </Container>
    )


}