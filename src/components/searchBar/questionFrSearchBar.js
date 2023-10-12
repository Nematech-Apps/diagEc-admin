import React, { useState } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const QuestionFrSearchBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleInputChange = (event) => {
    const searchTerm = event.target.value;
    setSearchInput(searchTerm);
    onSearch(searchTerm); 
  };

  return (
    <Card sx={{ p: 2, width: '100%' }}>
      <OutlinedInput
        value={searchInput}
        onChange={handleInputChange}
        fullWidth
        placeholder="Rechercher une question(libellé,pilier)"
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
      />
    </Card>
  );
};