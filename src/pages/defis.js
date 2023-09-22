import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';

import { useSelection } from 'src/hooks/use-selection';
import { applyPagination } from 'src/utils/apply-pagination';

import { CreateCategory } from 'src/sections/parametrage/create-category';
import { CreateSecteur } from 'src/sections/parametrage/create-secteur';
import { CreateNiveau } from 'src/sections/parametrage/create-niveau';
import { CreateAnswer } from 'src/sections/parametrage/create-answer';
import { CreatePilier } from 'src/sections/parametrage/create-pilier';
import { CreateDefis } from 'src/sections/parametrage/create-defis';
import { CreateQuestion } from 'src/sections/parametrage/create-question';
import { DisplaySecteurTable } from 'src/sections/parametrage/display-secteur-table';
import { DisplayNiveauTable } from 'src/sections/parametrage/display-niveau-table';
import { DisplayCategorieTable } from 'src/sections/parametrage/display-categorie-table';
import { DisplayAnswerTable } from 'src/sections/parametrage/display-answer-table';
import { DisplayPilierTable } from 'src/sections/parametrage/display-pilier-table';
import { DisplayDefisTable } from 'src/sections/parametrage/display-defis-table';
import { DisplayDefisTableEn } from 'src/sections/parametrage/display-defis-tableEn';
import { DisplayDefisTableIt } from 'src/sections/parametrage/display-defis-tableIt';
import { DisplayQuestionTable } from 'src/sections/parametrage/display-question-table';

import { useCallback, useMemo, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const now = new Date();


const Page = () => {

    const [alignment, setAlignment] = useState("Français");

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const display = () => {
        if (alignment == "Français") {
            return (
                <>
                    <Grid
                        xs={12}
                        md={12}
                        lg={12}
                    >
                        <DisplayDefisTable />
                    </Grid>

                </>
            )
        } else if (alignment == 'Anglais') {
            return (
                <>
                    <Grid
                        xs={12}
                        md={12}
                        lg={12}
                    >
                        <DisplayDefisTableEn />
                    </Grid>


                </>
            )
        } else if (alignment == 'Italien') {
            return (
                <>
                    <Grid
                        xs={12}
                        md={12}
                        lg={12}
                    >
                        <DisplayDefisTableIt />
                    </Grid>

                </>
            )
        }
    }

    return (
        <>
            <Head>
                <title>
                    Défis | DiagEc
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            xs={12}
                            md={12}
                            lg={12}
                        >
                            <CreateDefis />
                        </Grid>

                        <Grid
                            xs={12}
                            sm={6}
                            lg={12}
                        >
                            <ToggleButtonGroup
                                color="primary"
                                value={alignment}
                                exclusive
                                onChange={handleChange}
                                aria-label="Platform"
                                fullWidth
                            >
                                <ToggleButton value="Français">Français</ToggleButton>
                                <ToggleButton value="Anglais">Anglais</ToggleButton>
                                <ToggleButton value="Italien">Italien</ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>

                        {display()}
                    </Grid>
                </Container>
            </Box>
        </>
    )
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
