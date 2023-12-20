import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import BuildingOfficeIcon from '@heroicons/react/24/solid/BuildingOfficeIcon';
import LifebuoyIcon from '@heroicons/react/24/solid/LifebuoyIcon';
import PaperClipIcon from '@heroicons/react/24/solid/PaperClipIcon';
import BanknotesIcon from '@heroicons/react/24/solid/BanknotesIcon';
import BookmarkSquareIcon from '@heroicons/react/24/solid/BookmarkSquareIcon';
import TicketIcon from '@heroicons/react/24/solid/TicketIcon';
import SunIcon from '@heroicons/react/24/solid/SunIcon';
import FolderOpenIcon from '@heroicons/react/24/solid/FolderOpenIcon';
import QuestionMarkCircleIcon from '@heroicons/react/24/solid/QuestionMarkCircleIcon';
import Square3Stack3DIcon from '@heroicons/react/24/solid/Square3Stack3DIcon';
import QueueListIcon from '@heroicons/react/24/solid/QueueListIcon';
import LightBulbIcon from '@heroicons/react/24/solid/LightBulbIcon';
import BriefcaseIcon from '@heroicons/react/24/solid/BriefcaseIcon';
import RectangleGroupIcon from '@heroicons/react/24/solid/RectangleGroupIcon';
import SwatchIcon from '@heroicons/react/24/solid/SwatchIcon';
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon';


import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Tableau de bord',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Paramétrage',
  //   path: '/parametrage',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   )
  // },
  {
    title: "Utilisateurs",
    path: '/users',
    icon: (
      <SvgIcon fontSize="small">
        <UserGroupIcon />
      </SvgIcon>
    )
  },
  {
    title: "Secteurs",
    path: '/secteurs',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
  {
    title: "Niveaux",
    path: '/niveaux',
    icon: (
      <SvgIcon fontSize="small">
        <SwatchIcon />
      </SvgIcon>
    )
  },
  {
    title: "Catégories",
    path: '/categories',
    icon: (
      <SvgIcon fontSize="small">
        <RectangleGroupIcon />
      </SvgIcon>
    )
  },
  {
    title: "Réponses",
    path: '/reponses',
    icon: (
      <SvgIcon fontSize="small">
        <Square3Stack3DIcon />
      </SvgIcon>
    )
  },
  {
    title: "Piliers",
    path: '/piliers',
    icon: (
      <SvgIcon fontSize="small">
        <QueueListIcon />
      </SvgIcon>
    )
  },
  {
    title: "Défis",
    path: '/defis',
    icon: (
      <SvgIcon fontSize="small">
        <LightBulbIcon />
      </SvgIcon>
    )
  },
  {
    title: "Questions",
    path: '/questions',
    icon: (
      <SvgIcon fontSize="small">
        <QuestionMarkCircleIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Customers',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Entreprises',
    path: '/companies',
    icon: (
      <SvgIcon fontSize="small">
        <BriefcaseIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Paramètres',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Login',
    path: '/auth/login',
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Register',
    path: '/auth/register',
    icon: (
      <SvgIcon fontSize="small">
        <UserPlusIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Error',
    path: '/404',
    icon: (
      <SvgIcon fontSize="small">
        <XCircleIcon />
      </SvgIcon>
    )
  }
];
