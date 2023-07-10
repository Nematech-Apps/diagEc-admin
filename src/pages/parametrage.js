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
import { DisplayQuestionTable } from 'src/sections/parametrage/display-question-table';

import { useCallback, useMemo, useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const now = new Date();


const Page = () => {

    const [alignment, setAlignment] = useState("Secteurs-Niveaux-Catégories");

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };


    const display = () => {
        if (alignment == "Secteurs-Niveaux-Catégories") {
            return (
                <>
                    <Grid
                        xs={12}
                        md={12}
                        lg={6}
                    >
                        <CreateSecteur />
                    </Grid>

                    <Grid
                        xs={12}
                        md={6}
                        lg={6}
                    >
                        <DisplaySecteurTable />
                    </Grid>

                    <Grid
                        xs={12}
                        md={12}
                        lg={6}
                    >
                        <CreateNiveau />
                    </Grid>

                    <Grid
                        xs={12}
                        md={6}
                        lg={6}
                    >
                        <DisplayNiveauTable />
                    </Grid>

                    <Grid
                        xs={12}
                        md={12}
                        lg={6}
                    >
                        <CreateCategory />
                    </Grid>

                    <Grid
                        xs={12}
                        md={6}
                        lg={6}
                    >
                        <DisplayCategorieTable />
                    </Grid>
                </>
            )
        } else if (alignment == 'Questions-Réponses-Piliers-Defis') {
            return (
                <>
                    <Grid
                        xs={12}
                        md={12}
                        lg={6}
                    >
                        <CreateAnswer />
                    </Grid>

                    <Grid
                        xs={12}
                        md={6}
                        lg={6}
                    >
                        <DisplayAnswerTable />
                    </Grid>

                    <Grid
                        xs={12}
                        md={12}
                        lg={12}
                    >
                        <CreatePilier />
                    </Grid>

                    <Grid
                        xs={12}
                        md={12}
                        lg={12}
                    >
                        <DisplayPilierTable />
                    </Grid>

                    <Grid
                        xs={12}
                        md={12}
                        lg={12}
                    >
                        <CreateDefis />
                    </Grid>

                    <Grid
                        xs={12}
                        md={12}
                        lg={12}
                    >
                        <DisplayDefisTable />
                    </Grid>



                    <Grid
                        xs={12}
                        md={12}
                        lg={12}
                    >
                        <CreateQuestion />
                    </Grid>

                    <Grid
                        xs={12}
                        md={12}
                        lg={12}
                    >
                        <DisplayQuestionTable />
                    </Grid>

                    {/* <Grid
                            xs={12}
                            md={6}
                            lg={6}
                        >
                            <DisplayNiveauTable/>
                        </Grid>

                        <Grid
                            xs={12}
                            md={12}
                            lg={6}
                        >
                            <CreateCategory />
                        </Grid>

                        <Grid
                            xs={12}
                            md={6}
                            lg={6}
                        >
                            <DisplayCategorieTable/>
                        </Grid> */}
                </>
            )
        }
    }

    return (
        <>
            <Head>
                <title>
                    Overview | Devias Kit
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
                            sm={6}
                            lg={12}
                        >
                            <ToggleButtonGroup
                                color="primary"
                                value={alignment}
                                exclusive
                                onChange={handleChange}
                                aria-label="Platform"
                            >
                                <ToggleButton value="Secteurs-Niveaux-Catégories">Secteurs-Niveaux-Catégories</ToggleButton>
                                <ToggleButton value="Questions-Réponses-Piliers-Defis">Questions-Réponses-Piliers-Défis</ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                        {/* <Grid
                        xs={12}
                        sm={6}
                        lg={3}
                    >
                        <OverviewBudget
                            difference={12}
                            positive
                            sx={{ height: '100%' }}
                            value="$24k"
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        sm={6}
                        lg={3}
                    >
                        <OverviewTotalCustomers
                            difference={16}
                            positive={false}
                            sx={{ height: '100%' }}
                            value="1.6k"
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        sm={6}
                        lg={3}
                    >
                        <OverviewTasksProgress
                            sx={{ height: '100%' }}
                            value={75.5}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        sm={6}
                        lg={3}
                    >
                        <OverviewTotalProfit
                            sx={{ height: '100%' }}
                            value="$15k"
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        lg={8}
                    >
                        <OverviewSales
                            chartSeries={[
                                {
                                    name: 'This year',
                                    data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                                },
                                {
                                    name: 'Last year',
                                    data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                                }
                            ]}
                            sx={{ height: '100%' }}
                        />
                    </Grid>
                    <Grid
                        xs={12}
                        md={6}
                        lg={4}
                    >
                        <OverviewTraffic
                            chartSeries={[63, 15, 22]}
                            labels={['Desktop', 'Tablet', 'Phone']}
                            sx={{ height: '100%' }}
                        />
                    </Grid> */}

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
