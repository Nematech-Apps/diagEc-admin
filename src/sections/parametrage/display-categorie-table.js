import { useState, useEffect } from 'react';
import { subDays, subHours } from 'date-fns';
import { CategorieTable } from "./categorie-table";
import { getCategoriesList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


// const now = new Date();

// const data = [
//     {
//         id: '5ece2c077e39da27658aa8a9',
//         image: '/assets/products/product-1.png',
//         name: 'Healthcare Erbology',
//         updatedAt: subHours(now, 6).getTime()
//     },
//     {
//         id: '5ece2c0d16f70bff2cf86cd8',
//         image: '/assets/products/product-2.png',
//         name: 'Makeup Lancome Rouge',
//         updatedAt: subDays(subHours(now, 8), 2).getTime()
//     },
//     {
//         id: 'b393ce1b09c1254c3a92c827',
//         image: '/assets/products/product-5.png',
//         name: 'Skincare Soja CO',
//         updatedAt: subDays(subHours(now, 1), 1).getTime()
//     },
//     {
//         id: 'a6ede15670da63f49f752c89',
//         image: '/assets/products/product-6.png',
//         name: 'Makeup Lipstick',
//         updatedAt: subDays(subHours(now, 3), 3).getTime()
//     },
//     {
//         id: 'bcad5524fe3a2f8f8620ceda',
//         image: '/assets/products/product-7.png',
//         name: 'Healthcare Ritual',
//         updatedAt: subDays(subHours(now, 5), 6).getTime()
//     }
// ];


export const DisplayCategorieTable = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = OnSnapshot(
            getCategoriesList(),
            (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setData(fetchedData);
                setIsLoading(false);
            },
            (error) => {
                console.log('Error fetching data:', error);
                setIsLoading(false);
            }
        );

        return () => {
            // Clean up the listener when the component unmounts
            unsubscribe();
        };

    }, []);

    if (isLoading) {
        return (
            <Stack spacing={1}>
                {/* For variant="text", adjust the height via font-size */}
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                {/* For other variants, adjust the size with `width` and `height` */}
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={210} height={60} />
                <Skeleton variant="rounded" width={210} height={60} />
            </Stack>
        );
    }


    return (
        <CategorieTable
            products={data}
            sx={{ height: '100%'}}
        />
    )
}